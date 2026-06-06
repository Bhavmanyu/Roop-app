import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/security";

export async function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  
  // Redirect all .vercel.app requests to the custom domain
  if (host.includes(".vercel.app")) {
    const url = req.nextUrl.clone();
    url.host = "roope.beauty";
    url.protocol = "https:";
    return NextResponse.redirect(url, 301);
  }

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
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
