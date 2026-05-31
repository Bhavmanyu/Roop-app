import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendSalonApplicationNotification } from "@/lib/email";
import { z } from "zod";
import { isRateLimited, getClientIp, sanitizeObject } from "@/lib/security";

const salonSchema = z.object({
  salon_name: z.string().min(2, "Salon name must be at least 2 characters").max(100),
  owner_name: z.string().min(2, "Owner name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(100),
  phone: z.string().min(8, "Phone must be at least 8 characters").max(30),
  address: z.string().min(5, "Address must be at least 5 characters").max(500),
  website_link: z.string().url("Invalid website URL").optional().or(z.literal("")),
  staff_count: z.number().min(1),
  years_in_business: z.number().min(0),
  services: z.array(z.string()).min(1),
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
    const result = salonSchema.safeParse(rawBody);

    if (!result.success) {
      console.warn("Validation failed for Salon application:", result.error.issues);
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    // Sanitize input properties to prevent script injection (XSS)
    const sanitizedData = sanitizeObject(result.data);

    const { data, error } = await supabaseAdmin
      .from("salon_applications")
      .insert({
        ...sanitizedData,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase salon application error:", error);
      return NextResponse.json({ error: "Failed to log application" }, { status: 500 });
    }

    try {
      await sendSalonApplicationNotification(data);
    } catch (emailError) {
      console.error("Salon application email notification error:", emailError);
    }

    return NextResponse.json({ success: true, id: data.id }, { status: 201 });
  } catch (err) {
    console.error("Salon Application API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
