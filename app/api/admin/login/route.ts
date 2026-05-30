import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSessionToken, isRateLimited, getClientIp } from "@/lib/security";

const loginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    
    // Strict rate limit on admin login attempts: 5 tries per 15 minutes
    if (isRateLimited(ip, 5, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const result = loginSchema.safeParse(body);
    
    if (!result.success) {
      console.warn("Validation failed for Admin Login:", result.error.issues);
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    const { password } = result.data;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json({ error: "Server authentication is not configured" }, { status: 500 });
    }

    if (password !== adminPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const secureToken = await createSessionToken();
    const response = NextResponse.json({ success: true });
    
    response.cookies.set("roope_admin_session", secureToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // Switched from lax to strict for higher security
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
