import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import crypto from "crypto";

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "cryptoelectro-au-secret-key-change-in-production");

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let userId: string;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    userId = payload.userId as string;
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  let affiliate = await prisma.affiliate.findUnique({ where: { userId } });

  if (!affiliate) {
    const code = `CRY-${userId.substring(0, 6).toUpperCase()}`;
    affiliate = await prisma.affiliate.create({
      data: { userId, code },
    });
  }

  const referrals = await prisma.affiliateReferral.findMany({
    where: { affiliateId: affiliate.id },
    include: { order: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    affiliate: {
      ...affiliate,
      availableBalance: Number(affiliate.availableBalance),
      totalEarned: Number(affiliate.totalEarned),
      totalWithdrawn: Number(affiliate.totalWithdrawn),
      storeCredit: Number(affiliate.storeCredit),
    },
    referrals,
  });
}