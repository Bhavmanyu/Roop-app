import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendProfessionalApplicationNotification } from "@/lib/email";
import { z } from "zod";
import { isRateLimited, getClientIp, sanitizeObject } from "@/lib/security";

const professionalSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(100),
  phone: z.string().min(8, "Phone must be at least 8 characters").max(30),
  experience_years: z.number().min(0).max(80),
  city: z.string().min(2).max(100),
  skills: z.array(z.string()).min(1),
  portfolio_link: z.string().url("Invalid portfolio link").optional().or(z.literal("")),
  certificate_url: z.string().url("Invalid certificate URL"),
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    
    // Rate limit: Max 3 partner applications per 10 minutes per IP
    if (isRateLimited(ip, 3, 10 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many registration attempts recently. Please try again later." },
        { status: 429 }
      );
    }

    const rawBody = await req.json();
    const result = professionalSchema.safeParse(rawBody);

    if (!result.success) {
      console.warn("Validation failed for Professional application:", result.error.issues);
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    // Sanitize input properties to prevent script injection (XSS)
    const sanitizedData = sanitizeObject(result.data);

    const { data, error } = await supabaseAdmin
      .from("professional_applications")
      .insert({
        ...sanitizedData,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase professional application error:", error);
      return NextResponse.json({ error: "Failed to log application" }, { status: 500 });
    }

    try {
      await sendProfessionalApplicationNotification(data);
    } catch (emailError) {
      console.error("Professional application email notification error:", emailError);
    }

    return NextResponse.json({ success: true, id: data.id }, { status: 201 });
  } catch (err) {
    console.error("Professional Application API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
