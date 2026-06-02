import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendBookingNotification, sendBookingConfirmation } from "@/lib/email";
import crypto from "crypto";
import { z } from "zod";
import { isRateLimited, getClientIp } from "@/lib/security";

const verifySchema = z.object({
  booking_id: z.string().uuid("Invalid booking identifier"),
  razorpay_order_id: z.string().min(1, "Order identifier is required"),
  razorpay_payment_id: z.string().min(1, "Payment identifier is required"),
  razorpay_signature: z.string().min(1, "Signature is required"),
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    // Rate Limit: Max 10 verification requests per 10 minutes per IP
    if (isRateLimited(ip, 10, 10 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many verification attempts. Please try again later." },
        { status: 429 }
      );
    }

    const rawBody = await req.json();
    const result = verifySchema.safeParse(rawBody);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    const { booking_id, razorpay_order_id, razorpay_payment_id, razorpay_signature } = result.data;

    // CRYPTOGRAPHIC SIGNATURE VERIFICATION
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "placeholder_key_secret";
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isGenuine = expectedSignature === razorpay_signature;

    if (!isGenuine) {
      console.warn(`Cryptographic payment signature mismatch for booking: ${booking_id}`);
      
      // Update booking to failed state
      await supabaseAdmin
        .from("bookings")
        .update({
          payment_status: "failed",
          status: "cancelled",
        })
        .eq("id", booking_id);

      return NextResponse.json(
        { error: "Cryptographic signature verification failed. Transaction flagged as unsafe." },
        { status: 400 }
      );
    }

    // Finalize booking transaction
    const { data: booking, error: dbError } = await supabaseAdmin
      .from("bookings")
      .update({
        payment_status: "paid",
        status: "confirmed",
        razorpay_payment_id,
        razorpay_signature,
      })
      .eq("id", booking_id)
      .select()
      .single();

    if (dbError || !booking) {
      console.error(`Database finalization error for booking ${booking_id}:`, dbError);
      return NextResponse.json({ error: "Failed to finalize booking transaction" }, { status: 500 });
    }

    // Dispatch secure email notifications (non-blocking)
    try {
      await Promise.all([
        sendBookingNotification(booking),
        sendBookingConfirmation(booking),
      ]);
    } catch (emailError) {
      console.error("Booking verification email notification error:", emailError);
    }

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      paymentStatus: "paid",
    }, { status: 200 });

  } catch (err: any) {
    console.error("Payment Verification API error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
