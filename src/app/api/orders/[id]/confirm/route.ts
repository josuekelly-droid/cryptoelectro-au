import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getRewardTier(points: number) {
  if (points >= 2500) return "DIAMOND";
  if (points >= 1000) return "PLATINUM";
  if (points >= 500) return "GOLD";
  if (points >= 200) return "SILVER";
  return "BRONZE";
}

async function addLoyaltyRewards(order: any) {
  try {
    const userId = order.userId;
    const earnedPoints = Math.floor(Number(order.subtotal) * 10);

    const existingReward = await prisma.reward.findUnique({ where: { userId } });
    if (existingReward) {
      const newPoints = existingReward.points + earnedPoints;
      const newTier = getRewardTier(newPoints);
      await prisma.reward.update({
        where: { userId },
        data: { points: newPoints, tier: newTier },
      });
    } else {
      const newTier = getRewardTier(earnedPoints);
      await prisma.reward.create({
        data: { userId, points: earnedPoints, tier: newTier },
      });
    }
    console.log(`🏆 ${earnedPoints} loyalty points added for user ${userId}`);
  } catch (error) {
    console.error("Loyalty rewards error:", error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  await prisma.order.update({
    where: { id },
    data: {
      status: "CONFIRMED",
      paymentStatus: "CONFIRMED",
    },
  });

  // 🏆 Loyalty rewards
  await addLoyaltyRewards(order);

  // 📦 Diminuer le stock
  for (const item of order.items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: {
        stockQuantity: { decrement: item.quantity },
      },
    });
    console.log(`📦 Stock decreased: product ${item.productId} by ${item.quantity}`);
  }

  return NextResponse.json({ message: "Order confirmed" });
}