import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "cryptoelectro-au-secret-key-change-in-production");

async function isAdmin(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return false;
  try { const { payload } = await jwtVerify(token, JWT_SECRET); return payload.role === "ADMIN"; }
  catch { return false; }
}

export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const withdrawals = await prisma.affiliateReferral.findMany({
    where: { status: { not: "pending" } }, // exclude regular commissions
    include: { affiliate: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ withdrawals });
}