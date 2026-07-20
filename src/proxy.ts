import { type NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const isLogin = request.nextUrl.pathname === "/admin/login";
  const hasSessionCookie = Boolean(request.cookies.get("brujula_session")?.value);

  if (!isLogin && !hasSessionCookie) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
