import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { getClientIp, isRateLimited } from "@/lib/security";

export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    // Rate limit: Max 20 queries per 5 minutes per IP
    if (isRateLimited(ip, 20, 5 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Authentication token is missing." }, { status: 401 });
    }

    // Verify token with Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user || !user.email) {
      console.error("Auth token verification failed:", authError);
      return NextResponse.json({ error: "Invalid or expired session token." }, { status: 401 });
    }

    // Query bookings belonging to verified user's email using supabaseAdmin (bypassing RLS safely)
    const { data: bookings, error: dbError } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .eq("email", user.email)
      .order("created_at", { ascending: false });

    if (dbError) {
      console.error("Database query failed for user bookings:", dbError);
      return NextResponse.json({ error: "Failed to fetch bookings history." }, { status: 500 });
    }

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (err) {
    console.error("Bookings history API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
