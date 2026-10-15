import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "cryptoelectro-au-secret-key-change-in-production"
);

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

// 🔒 AUTHENTIFICATION + AUTORISATION
async function authenticateAndAuthorize(
  req: NextRequest,
  orderId: string
): Promise<{ userId: string; order: any } | NextResponse> {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  let userId: string;
  let userRole: string;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    userId = payload.userId as string;
    userRole = payload.role as string;
  } catch {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // 🔒 Seul le propriétaire de la commande OU un admin peut la confirmer
  const isOwner = order.userId === userId;
  const isAdmin = userRole === "ADMIN";
  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  return { userId, order };
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 🔒 AUTH + AUTORISATION
    const auth = await authenticateAndAuthorize(req, id);
    if (auth instanceof NextResponse) return auth;
    const { order } = auth;

    // 🛡️ PROTECTION CONTRE LES DOUBLES CONFIRMATIONS (IDEMPOTENCE)
    if (order.status === "CONFIRMED" || order.paymentStatus === "CONFIRMED") {
      console.log(`⚠️ Order ${order.orderNumber} already confirmed, skipping`);
      return NextResponse.json({
        message: "Order already confirmed",
        alreadyConfirmed: true,
      });
    }

    // 🛡️ REFUSER SI LA COMMANDE EST ANNULÉE OU EXPIRÉE
    if (order.status === "CANCELLED" || order.paymentStatus === "EXPIRED") {
      return NextResponse.json(
        { error: "Cannot confirm a cancelled or expired order" },
        { status: 410 }
      );
    }

    // 🔒 TRANSACTION ATOMIQUE — Tout réussit ou tout échoue
    await prisma.$transaction(async (tx) => {
      // Re-vérifier dans la transaction (protection concurrence)
      const currentOrder = await tx.order.findUnique({
        where: { id },
        select: { status: true, paymentStatus: true },
      });

      if (
        !currentOrder ||
        currentOrder.status === "CONFIRMED" ||
        currentOrder.paymentStatus === "CONFIRMED"
      ) {
        throw new Error("ALREADY_CONFIRMED");
      }

      // 1. Mettre à jour le statut
      await tx.order.update({
        where: { id },
        data: {
          status: "CONFIRMED",
          paymentStatus: "CONFIRMED",
        },
      });

      // 2. Loyalty rewards
      const userId = order.userId;
      const earnedPoints = Math.floor(Number(order.subtotal) * 10);

      const existingReward = await tx.reward.findUnique({ where: { userId } });
      if (existingReward) {
        const newPoints = existingReward.points + earnedPoints;
        const newTier = getRewardTier(newPoints);
        await tx.reward.update({
          where: { userId },
          data: { points: newPoints, tier: newTier },
        });
      } else {
        const newTier = getRewardTier(earnedPoints);
        await tx.reward.create({
          data: { userId, points: earnedPoints, tier: newTier },
        });
      }

      // 3. Diminuer le stock (avec protection stock >= 0)
      for (const item of order.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { stockQuantity: true, name: true },
        });

        if (product) {
          const newStock = Math.max(0, product.stockQuantity - item.quantity);
          await tx.product.update({
            where: { id: item.productId },
            data: { stockQuantity: newStock },
          });
          console.log(
            `📦 Stock decreased: ${product.name} (${product.stockQuantity} → ${newStock})`
          );
        }
      }
    });

    console.log(`✅ Order ${order.orderNumber} confirmed successfully`);

    return NextResponse.json({ message: "Order confirmed" });
  } catch (error: any) {
    if (error.message === "ALREADY_CONFIRMED") {
      return NextResponse.json(
        { message: "Order already confirmed", alreadyConfirmed: true }
      );
    }

    console.error("Order confirmation error:", error);
    return NextResponse.json(
      { error: "Failed to confirm order" },
      { status: 500 }
    );
  }
}