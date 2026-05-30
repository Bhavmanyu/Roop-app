import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/security";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /admin/dashboard routes
  if (pathname.startsWith("/admin/dashboard")) {
    const session = req.cookies.get("roope_admin_session")?.value;
    if (!await verifySessionToken(session)) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
