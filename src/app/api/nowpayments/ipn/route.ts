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

async function decreaseStock(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) return;

    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stockQuantity: { decrement: item.quantity },
        },
      });
      console.log(`📦 Stock decreased: product ${item.productId} by ${item.quantity}`);
    }
  } catch (error) {
    console.error("Decrease stock error:", error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📥 IPN Received:", body);

    const {
      payment_id,
      payment_status,
      order_id,
    } = body;

    if (payment_status === "finished" || payment_status === "confirmed") {
      const order = await prisma.order.findFirst({
        where: { paymentId: String(payment_id) },
      });

      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: "CONFIRMED",
            status: "CONFIRMED",
          },
        });
        await addLoyaltyRewards(order);
        await decreaseStock(order.id); // ← 📦 Diminuer le stock
        console.log(`✅ Order ${order.orderNumber} confirmed via IPN`);
      } else {
        const orderByNumber = await prisma.order.findFirst({
          where: { orderNumber: String(order_id) },
        });

        if (orderByNumber) {
          await prisma.order.update({
            where: { id: orderByNumber.id },
            data: {
              paymentStatus: "CONFIRMED",
              status: "CONFIRMED",
              paymentId: String(payment_id),
            },
          });
          await addLoyaltyRewards(orderByNumber);
          await decreaseStock(orderByNumber.id); // ← 📦 Diminuer le stock
          console.log(`✅ Order ${order_id} confirmed via IPN`);
        }
      }
    } else if (payment_status === "expired" || payment_status === "failed") {
      const order = await prisma.order.findFirst({
        where: { paymentId: String(payment_id) },
      });

      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: payment_status.toUpperCase(),
          },
        });
        console.log(`❌ Order ${order.orderNumber} payment ${payment_status}`);
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("IPN Error:", error);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}