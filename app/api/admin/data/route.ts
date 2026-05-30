import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifySessionToken, isRateLimited, getClientIp } from "@/lib/security";

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  if (isRateLimited(ip, 60, 60000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const session = req.cookies.get("roope_admin_session")?.value;
  if (!await verifySessionToken(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [bookings, contacts, bridal, events, reviews] = await Promise.all([
      supabaseAdmin.from("bookings").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("contacts").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("bridal_inquiries").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("event_inquiries").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("reviews").select("*").order("created_at", { ascending: false }),
    ]);

    return NextResponse.json({
      bookings: bookings.data || [],
      contacts: contacts.data || [],
      bridal: bridal.data || [],
      events: events.data || [],
      reviews: reviews.data || [],
    });
  } catch (err) {
    console.error("Admin data error:", err);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
