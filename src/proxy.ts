import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const url = request.nextUrl.pathname;

  // === SECURITY HEADERS ===
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // === CACHE HEADERS ===
  if (url.startsWith("/category") || url.startsWith("/product") || url === "/") {
    response.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  }

  if (url.startsWith("/admin") || url.startsWith("/dashboard") || url.startsWith("/checkout") || url.startsWith("/cart")) {
    response.headers.set("Cache-Control", "no-store, max-age=0");
  }

  // === PROTECT ADMIN ROUTES ===
  if (url.startsWith("/admin")) {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // === PROTECT API ADMIN ROUTES ===
  if (url.startsWith("/api/admin")) {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};