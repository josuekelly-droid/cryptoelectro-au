import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.order.update({
    where: { id },
    data: {
      status: "CONFIRMED",
      paymentStatus: "CONFIRMED",
    },
  });
  return NextResponse.json({ message: "Order confirmed" });
}