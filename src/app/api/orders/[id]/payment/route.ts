import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const order = await prisma.order.update({
      where: { id },
      data: {
        paymentId: body.paymentId || null,
        cryptoAddress: body.cryptoAddress || null,
        cryptoAmount: body.cryptoAmount?.toString() || null,
        paymentStatus: "WAITING_CONFIRMATION",
      },
    });

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error("Payment update error:", error.message);
    return NextResponse.json(
      { error: "Update failed: " + error.message },
      { status: 500 }
    );
  }
}