import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";

export function proxy(request: NextRequest) {
  // API-domain cookies are not always visible to the frontend domain in
  // production, so only use this token when the browser sends it here.
  const token =
    request.cookies.get("accessToken")?.value ||
    request.cookies.get("authjs.session-token")?.value;

  const { pathname } = request.nextUrl;

  const isPaymentCallback =
    pathname.startsWith("/company/payment/success") ||
    pathname.startsWith("/company/payment/fail");

  const isPublicRoute =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/admin/login" ||
    isPaymentCallback;

  const isProtectedRoute =
    (pathname.startsWith("/candidate/") ||
      pathname.startsWith("/company/") ||
      pathname.startsWith("/admin/")) &&
    !isPublicRoute;

  const isAuthRoute = pathname === "/login" || pathname === "/signup";

  if (token) {
    try {
      const payload = decodeJwt(token);
      const role = payload.role as string;

      if (isAuthRoute) {
        let target = "/candidate/dashboard";
        if (role === "admin") target = "/admin/dashboard";
        if (role === "company") target = "/company/dashboard";

        return NextResponse.redirect(new URL(target, request.url));
      }

      if (pathname.startsWith("/admin") && role !== "admin") {
        return NextResponse.redirect(
          new URL("/candidate/dashboard", request.url),
        );
      }
      if (pathname.startsWith("/company") && role !== "company") {
        return NextResponse.redirect(
          new URL("/candidate/dashboard", request.url),
        );
      }
      if (pathname.startsWith("/candidate") && role !== "candidate") {
        if (role === "company") {
          return NextResponse.redirect(
            new URL("/company/dashboard", request.url),
          );
        }
        if (role === "admin") {
          return NextResponse.redirect(
            new URL("/admin/dashboard", request.url),
          );
        }
      }
    } catch {
      const response = NextResponse.next();
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      return response;
    }
  }

  // Do not redirect protected pages just because this frontend request has no
  // cookie. In split frontend/backend deployments, axios still sends the cookie
  // to the API host with withCredentials, and the backend enforces access.
  const response = NextResponse.next();
  if (isProtectedRoute) {
    response.headers.set(
      "Cache-Control",
      "no-store, max-age=0, must-revalidate",
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/candidate/:path*",
    "/company/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
  ],
};
