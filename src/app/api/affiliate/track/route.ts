import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const refCode = req.nextUrl.searchParams.get("ref");

  if (refCode) {
    try {
      const affiliate = await prisma.affiliate.findUnique({ where: { code: refCode } });

      if (affiliate) {
        // Incrémenter les clics
        await prisma.affiliate.update({
          where: { code: refCode },
          data: { clicks: { increment: 1 } },
        });

        // Créer une réponse avec cookie
        const response = NextResponse.redirect(new URL("/", req.url));
        response.cookies.set("affiliate_ref", refCode, {
          maxAge: 60 * 60 * 24 * 30, // 30 jours
          path: "/",
          httpOnly: true,
        });

        console.log(`✅ Affiliate click tracked: ${refCode}`);
        return response;
      }
    } catch (error) {
      console.error("Tracking error:", error);
    }
  }

  return NextResponse.redirect(new URL("/", req.url));
}