import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendBridalInquiryNotification } from "@/lib/email";
import { z } from "zod";
import { isRateLimited, getClientIp, sanitizeObject } from "@/lib/security";

const bridalSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().min(8, "Invalid phone number").max(20),
  email: z.string().email("Invalid email address").max(100),
  package_id: z.string().min(1, "Package ID is required").max(100),
  package_name: z.string().min(1, "Package name is required").max(150),
  wedding_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid wedding date format (YYYY-MM-DD)").or(z.null()).optional().default(null),
  city: z.string().min(1, "City is required").max(100),
  message: z.string().max(2000).optional().default(""),
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    
    // Rate limit: Max 5 bridal inquiries per 10 minutes per IP
    if (isRateLimited(ip, 5, 10 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many inquiries submitted recently. Please try again later." },
        { status: 429 }
      );
    }

    const rawBody = await req.json();
    const result = bridalSchema.safeParse(rawBody);

    if (!result.success) {
      console.warn("Validation failed for Bridal Inquiry:", result.error.issues);
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    // Sanitize values against HTML injection/XSS
    const sanitizedData = sanitizeObject(result.data);

    const { data, error } = await supabaseAdmin
      .from("bridal_inquiries")
      .insert({
        ...sanitizedData,
        status: "new",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase bridal inquiry error:", error);
      return NextResponse.json({ error: "Failed to submit inquiry to database" }, { status: 500 });
    }

    try {
      await sendBridalInquiryNotification(data);
    } catch (emailError) {
      console.error("Bridal inquiry email error:", emailError);
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Bridal API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
