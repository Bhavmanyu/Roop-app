import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendBookingNotification, sendBookingConfirmation } from "@/lib/email";
import { z } from "zod";
import { isRateLimited, getClientIp, sanitizeObject } from "@/lib/security";

const bookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().min(8, "Invalid phone number").max(20),
  email: z.string().email("Invalid email address").max(100),
  occasion: z.string().min(1, "Occasion is required").max(100),
  service_id: z.string().min(1, "Service ID is required").max(100),
  service_name: z.string().min(1, "Service name is required").max(150),
  service_price: z.number().int().nonnegative("Service price must be a positive number"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  time: z.string().min(1, "Time is required").max(50),
  city: z.string().min(1, "City is required").max(100),
  address: z.string().min(5, "Address must be at least 5 characters").max(500),
  artist_tier: z.string().min(1, "Artist tier is required").max(50),
  extras: z.array(z.string()).default([]),
  coupon: z.string().max(50).optional().default(""),
  total_amount: z.number().int().nonnegative("Total amount must be a positive number"),
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    
    // Rate limit: Max 5 booking submissions per 10 minutes per IP
    if (isRateLimited(ip, 5, 10 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many bookings submitted recently. Please try again later." },
        { status: 429 }
      );
    }

    const rawBody = await req.json();
    const result = bookingSchema.safeParse(rawBody);

    if (!result.success) {
      console.warn("Validation failed for Booking:", result.error.issues);
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    // Sanitize input to protect against XSS
    const sanitizedData = sanitizeObject(result.data);

    // Save to Supabase
    const { data, error } = await supabaseAdmin
      .from("bookings")
      .insert({
        ...sanitizedData,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase booking error:", error);
      return NextResponse.json({ error: "Failed to process booking in database" }, { status: 500 });
    }

    // Send emails (non-blocking)
    try {
      await Promise.all([
        sendBookingNotification(data),
        sendBookingConfirmation(data),
      ]);
    } catch (emailError) {
      console.error("Booking email notification error:", emailError);
    }

    return NextResponse.json({ success: true, bookingId: data.id }, { status: 201 });
  } catch (err) {
    console.error("Booking API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
