import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

// ============ SECRET JWT OBLIGATOIRE ============
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("❌ NEXTAUTH_SECRET is required in production!");
}

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

// ============ FONCTION UTILITAIRE ============
async function getUserFromToken(request: NextRequest): Promise<{ userId: string; role: string; isBlocked: boolean } | null> {
  const token = request.cookies.get("auth-token")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as string;

    // ✅ Vérifier que l'utilisateur existe encore et n'est pas bloqué
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, isBlocked: true },
    });

    if (!user || user.isBlocked) return null;

    return { userId: user.id, role: user.role, isBlocked: user.isBlocked };
  } catch {
    return null;
  }
}

// ============ LISTES DE RESTRICTIONS ============
const MANAGER_RESTRICTED_PAGES = [
  "/admin/settings",
  "/admin/audit",
  "/admin/customers",
  "/admin/withdrawals",
  "/admin/orders",
  "/admin/coupons",
  "/admin/banners",
  "/admin/deals",
  "/admin/reviews",
  "/admin/careers",
  "/admin/blog",
];

const MANAGER_RESTRICTED_API = [
  "/api/admin/settings",
  "/api/admin/audit",
  "/api/admin/customers",
  "/api/admin/withdrawals",
  "/api/admin/orders",
  "/api/admin/coupons",
  "/api/admin/banners",
  "/api/admin/deals",
  "/api/admin/reviews",
  "/api/admin/careers",
  "/api/admin/blog",
];

// ============ PROXY ============
export async function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const url = request.nextUrl.pathname;

  // ===== SECURITY HEADERS =====
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  // ===== CSP =====
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.paypal.com https://*.paypal.com https://www.paypalobjects.com",
      "style-src 'self' 'unsafe-inline' https://*.paypal.com",
      "img-src 'self' data: https: blob: https://*.paypal.com https://www.paypalobjects.com",
      "font-src 'self' https://*.paypal.com",
      "connect-src 'self' https://api.nowpayments.io https://*.paypal.com https://www.paypal.com https://www.paypalobjects.com",
      "frame-src 'self' https://*.paypal.com https://www.paypal.com",
      "frame-ancestors 'none'",
      "form-action 'self'",
    ].join("; ")
  );

  // ===== CACHE HEADERS =====
  if (url.startsWith("/category") || url.startsWith("/product") || url === "/") {
    response.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  }
  if (url.startsWith("/admin") || url.startsWith("/dashboard") || url.startsWith("/checkout") || url.startsWith("/cart")) {
    response.headers.set("Cache-Control", "no-store, max-age=0");
  }

  // ===== RÉCUPÉRATION UNIQUE DE L'UTILISATEUR =====
  const user = await getUserFromToken(request);

  // ===== PROTECT ADMIN ROUTES =====
  if (url.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (user.role !== "ADMIN" && user.role !== "MANAGER") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (user.role === "MANAGER") {
      if (MANAGER_RESTRICTED_PAGES.some((path) => url.startsWith(path))) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
  }

  // ===== PROTECT DASHBOARD =====
  if (url.startsWith("/dashboard")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // ===== PROTECT CHECKOUT =====
  if (url.startsWith("/checkout")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login?redirect=/checkout", request.url));
    }
  }

  // ===== PROTECT API ADMIN ROUTES =====
  if (url.startsWith("/api/admin")) {
    if (!user || (user.role !== "ADMIN" && user.role !== "MANAGER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (user.role === "MANAGER") {
      if (MANAGER_RESTRICTED_API.some((path) => url.startsWith(path))) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};