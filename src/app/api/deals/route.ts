import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const deals = await prisma.deal.findMany({
    where: { isActive: true, expiresAt: { gt: new Date() } },
    include: { product: { include: { images: true, brand: true } } },
    orderBy: { expiresAt: "asc" },
  });
  return NextResponse.json({ deals });
}