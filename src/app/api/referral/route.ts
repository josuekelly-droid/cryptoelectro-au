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

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Générer un code si pas encore existant
  let referralCode = user.referralCode;
  if (!referralCode) {
    referralCode = `${user.firstName.toUpperCase().substring(0, 4)}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
    await prisma.user.update({ where: { id: userId }, data: { referralCode } });
  }

  // Compter les filleuls
  const referredCount = await prisma.user.count({ where: { referredBy: userId } });

  // Récupérer la liste des filleuls
  const referrals = await prisma.user.findMany({
    where: { referredBy: userId },
    select: { id: true, firstName: true, lastName: true, email: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    referralCode,
    referralLink: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/register?ref=${referralCode}`,
    referredCount,
    referrals,
    rewardAmount: 10,
  });
}