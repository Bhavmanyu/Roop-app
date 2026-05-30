import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifySessionToken, isRateLimited, getClientIp } from "@/lib/security";
import { z } from "zod";

const uuidSchema = z.string().uuid("Invalid booking ID");
const statusSchema = z.enum(["pending", "confirmed", "cancelled"]);

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ip = getClientIp(req);
  if (isRateLimited(ip, 60, 60000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const session = req.cookies.get("roope_admin_session")?.value;
  if (!await verifySessionToken(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const idResult = uuidSchema.safeParse(id);
    if (!idResult.success) {
      return NextResponse.json({ error: idResult.error.errors[0].message }, { status: 400 });
    }

    const body = await req.json();
    const statusResult = statusSchema.safeParse(body.status);
    if (!statusResult.success) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("bookings")
      .update({ status: statusResult.data })
      .eq("id", idResult.data);

    if (error) {
      return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Booking update error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
