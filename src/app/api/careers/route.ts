import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const careers = await prisma.career.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ careers });
}