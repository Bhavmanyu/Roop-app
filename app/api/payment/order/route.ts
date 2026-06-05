import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { services, bridalPackages, eventPackages, extras } from "@/lib/data";
import Razorpay from "razorpay";
import { z } from "zod";
import { isRateLimited, getClientIp, sanitizeObject } from "@/lib/security";

const orderSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(8).max(20),
  email: z.string().email().max(100),
  occasion: z.string().min(1).max(100),
  service_id: z.string().min(1).max(100),
  service_name: z.string().min(1).max(150),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().min(1).max(50),
  city: z.string().min(1).max(100),
  address: z.string().min(5).max(500),
  artist_tier: z.string().min(1).max(50),
  extras: z.array(z.string()).default([]),
  coupon: z.string().max(50).optional().default(""),
  cartItems: z.record(z.string(), z.number()).default({}),
  tip_amount: z.number().int().nonnegative().optional().default(0),
});

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder_key_id",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "placeholder_key_secret",
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    
    // Rate Limit: Max 10 order generation requests per 10 minutes per IP
    if (isRateLimited(ip, 10, 10 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many order requests. Please try again later." },
        { status: 429 }
      );
    }

    const rawBody = await req.json();
    const result = orderSchema.safeParse(rawBody);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    const validatedData = result.data;

    // SECURE SERVER-SIDE PRICING COMPUTATION
    const findCatalogItem = (id: string) => {
      const svc = services.find(s => s.id === id);
      if (svc) return svc;
      const bridal = bridalPackages.find(b => b.id === id);
      if (bridal) return bridal;
      const evt = eventPackages.find(e => e.id === id);
      if (evt) return evt;
      return null;
    };

    let basePrice = 0;
    const hasCart = Object.keys(validatedData.cartItems).length > 0;

    if (hasCart) {
      for (const [itemId, qty] of Object.entries(validatedData.cartItems)) {
        const item = findCatalogItem(itemId);
        if (!item) {
          return NextResponse.json({ error: `Invalid service item selected: ${itemId}` }, { status: 400 });
        }
        basePrice += item.price * qty;
      }
    } else {
      const singleItem = findCatalogItem(validatedData.service_id);
      if (!singleItem) {
        return NextResponse.json({ error: "Invalid service selected" }, { status: 400 });
      }
      basePrice = singleItem.price;
    }

    // Extras sum
    let extrasTotal = 0;
    for (const extraId of validatedData.extras) {
      const extraItem = extras.find(e => e.id === extraId);
      if (!extraItem) {
        return NextResponse.json({ error: `Invalid extra selected: ${extraId}` }, { status: 400 });
      }
      extrasTotal += extraItem.price;
    }

    const subtotal = basePrice + extrasTotal;

    // Apply Coupon
    let discount = 0;
    if (validatedData.coupon === "ROOPE25") {
      discount = Math.round(subtotal * 0.25);
    } else if (validatedData.coupon === "WELCOME") {
      discount = Math.min(500, subtotal);
    }

    const finalAmount = Math.max(0, subtotal - discount) + validatedData.tip_amount;

    // Create Razorpay Order
    // Razorpay amount is in paise (1 INR = 100 paise)
    const razorpayAmount = finalAmount * 100;

    const orderOptions = {
      amount: razorpayAmount,
      currency: "INR",
      receipt: `rcpt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    };

    const razorpayOrder = await razorpay.orders.create(orderOptions);

    if (!razorpayOrder || !razorpayOrder.id) {
      console.error("Failed to create order with Razorpay:", razorpayOrder);
      return NextResponse.json({ error: "Failed to initialize secure checkout transaction" }, { status: 500 });
    }

    // Sanitize input to protect against XSS before database insertion
    const sanitizedData = sanitizeObject(validatedData);

    // Save pending booking linked to the Razorpay Order ID
    const { data: dbBooking, error: dbError } = await supabaseAdmin
      .from("bookings")
      .insert({
        name: sanitizedData.name,
        phone: sanitizedData.phone,
        email: sanitizedData.email,
        occasion: sanitizedData.occasion,
        service_id: sanitizedData.service_id,
        service_name: sanitizedData.service_name,
        service_price: basePrice,
        date: sanitizedData.date,
        time: sanitizedData.time,
        city: sanitizedData.city,
        address: sanitizedData.address,
        artist_tier: sanitizedData.artist_tier,
        extras: sanitizedData.extras,
        coupon: sanitizedData.coupon,
        total_amount: finalAmount,
        status: "pending",
        payment_status: "pending",
        razorpay_order_id: razorpayOrder.id,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Supabase payment order insert error:", dbError);
      return NextResponse.json({ error: "Failed to record transaction in database" }, { status: 500 });
    }

    // Return transaction details to frontend
    return NextResponse.json({
      success: true,
      bookingId: dbBooking.id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder_key_id",
    }, { status: 201 });

  } catch (err: any) {
    console.error("Payment Order API error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
