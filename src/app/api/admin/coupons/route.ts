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
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ coupons });
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const data = await req.json();
  const coupon = await prisma.coupon.create({
    data: {
      code: data.code.toUpperCase(),
      type: data.type || "percentage",
      value: Number(data.value),
      minAmount: data.minAmount ? Number(data.minAmount) : null,
      maxUses: Number(data.maxUses || 0),
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    },
  });
  return NextResponse.json({ coupon }, { status: 201 });
}