import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendReviewNotification } from "@/lib/email";
import { z } from "zod";
import { isRateLimited, getClientIp, sanitizeObject } from "@/lib/security";

const reviewSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  location: z.string().min(2, "Location must be at least 2 characters").max(150),
  service: z.string().min(1, "Service is required").max(150),
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  review_text: z.string().min(5, "Review must be at least 5 characters").max(2000),
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    
    // Rate limit: Max 3 review submissions per 30 minutes per IP
    if (isRateLimited(ip, 3, 30 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many reviews submitted from this device. Please try again later." },
        { status: 429 }
      );
    }

    const rawBody = await req.json();
    const result = reviewSchema.safeParse(rawBody);

    if (!result.success) {
      console.warn("Validation failed for Review:", result.error.issues);
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    // Sanitize parameters to avoid stored XSS injection
    const sanitizedData = sanitizeObject(result.data);

    const { data, error } = await supabaseAdmin
      .from("reviews")
      .insert({
        ...sanitizedData,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase review submission error:", error);
      return NextResponse.json({ error: "Failed to submit your review" }, { status: 500 });
    }

    try {
      await sendReviewNotification(data);
    } catch (emailError) {
      console.error("Review notification email error:", emailError);
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Reviews API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
