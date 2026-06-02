import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { code, amount } = await req.json();
  if (!code) return NextResponse.json({ error: "Code required" }, { status: 400 });

  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });

  if (!coupon || !coupon.isActive) return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return NextResponse.json({ error: "This code has expired" }, { status: 400 });
  if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) return NextResponse.json({ error: "This code has reached its usage limit" }, { status: 400 });
  if (coupon.minAmount && Number(coupon.minAmount) > Number(amount)) return NextResponse.json({ error: `Minimum order amount is $${coupon.minAmount}` }, { status: 400 });

  const discount = coupon.type === "percentage" ? (Number(amount) * Number(coupon.value)) / 100 : Number(coupon.value);

  return NextResponse.json({ valid: true, code: coupon.code, type: coupon.type, value: Number(coupon.value), discount: Math.min(discount, Number(amount)) });
}