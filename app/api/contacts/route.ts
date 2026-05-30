import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendContactNotification } from "@/lib/email";
import { z } from "zod";
import { isRateLimited, getClientIp, sanitizeObject } from "@/lib/security";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(100),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(200),
  message: z.string().min(5, "Message must be at least 5 characters").max(3000),
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    
    // Rate limit: Max 5 contact submissions per 10 minutes per IP
    if (isRateLimited(ip, 5, 10 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many contact submissions recently. Please try again later." },
        { status: 429 }
      );
    }

    const rawBody = await req.json();
    const result = contactSchema.safeParse(rawBody);

    if (!result.success) {
      console.warn("Validation failed for Contact:", result.error.issues);
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    // Sanitize input properties to prevent script injection (XSS)
    const sanitizedData = sanitizeObject(result.data);

    const { data, error } = await supabaseAdmin
      .from("contacts")
      .insert({
        ...sanitizedData,
        status: "new",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase contact error:", error);
      return NextResponse.json({ error: "Failed to submit your message" }, { status: 500 });
    }

    try {
      await sendContactNotification(data);
    } catch (emailError) {
      console.error("Contact notification email error:", emailError);
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
