import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";

export function proxy(request: NextRequest) {
  // 1. Lấy token từ Cookie (Ưu tiên accessToken bạn đã thấy trong DevTools)
  const token =
    request.cookies.get("accessToken")?.value ||
    request.cookies.get("authjs.session-token")?.value;

  const { pathname } = request.nextUrl;

  // Định nghĩa các nhóm route
  const isPaymentCallback =
    pathname.startsWith("/company/payment/success") ||
    pathname.startsWith("/company/payment/fail");

  const isPublicRoute =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/admin/login" || // Thêm dòng này
    isPaymentCallback;

  const isProtectedRoute =
    (pathname.startsWith("/candidate") ||
      pathname.startsWith("/company") ||
      pathname.startsWith("/admin")) &&
    !isPublicRoute;

  const isAuthRoute = pathname === "/login" || pathname === "/signup";

  // 2. Xử lý khi đã có Token
  if (token) {
    try {
      // Giải mã JWT để lấy role (không cần secret key để decode lấy payload)
      const payload = decodeJwt(token);
      const role = payload.role as string; // Đảm bảo backend trả về field 'role'

      // A. Nếu đang ở trang Login/Signup mà đã có token -> Đẩy về Dashboard đúng role
      if (isAuthRoute) {
        let target = "/candidate/dashboard";
        if (role === "admin") target = "/admin/dashboard";
        if (role === "company") target = "/company/dashboard";

        return NextResponse.redirect(new URL(target, request.url));
      }

      // B. Chặn chéo vai trò (Bảo mật tầng Middleware)
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
        if (role === "company")
          return NextResponse.redirect(
            new URL("/company/dashboard", request.url),
          );
        if (role === "admin")
          return NextResponse.redirect(
            new URL("/admin/dashboard", request.url),
          );
      }
    } catch (error) {
      // Nếu token không hợp lệ hoặc hết hạn, xóa token
      const response = new NextResponse();
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");

      // Nếu đang ở route bảo vệ, đẩy về login
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL("/login", request.url), response);
      }

      // Nếu token không hợp lệ trên login/signup, vẫn xóa nó để tránh lỗi
      // Tiếp tục request bình thường
      return response;
    }
  }

  // 3. Nếu chưa có Token mà vào trang bảo vệ -> Đẩy về Login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 4. Thiết lập Header chống Cache (Sửa lỗi nhấn "Back" sau khi logout)
  const response = NextResponse.next();
  if (isProtectedRoute) {
    response.headers.set(
      "Cache-Control",
      "no-store, max-age=0, must-revalidate",
    );
  }

  return response;
}

// Cấu hình Matcher để Middleware không chạy lãng phí vào các file tĩnh
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
