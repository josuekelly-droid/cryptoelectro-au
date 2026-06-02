import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { code } = await req.json();
  await prisma.coupon.update({ where: { code }, data: { usedCount: { increment: 1 } } });
  return NextResponse.json({ message: "ok" });
}