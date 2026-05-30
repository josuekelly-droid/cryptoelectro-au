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

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return NextResponse.json({ orders: [] });
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const orders = await prisma.order.findMany({
      where: { userId: payload.userId as string },
      include: {
        items: { include: { product: { include: { images: true, brand: true } } } },
        address: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ orders: [] });
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let userId: string;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    userId = payload.userId as string;
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const body = await req.json();
  const orderItems = body.items;

  if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
    return NextResponse.json({ error: "No items in order" }, { status: 400 });
  }

  const subtotal = orderItems.reduce(
    (s: number, i: any) => s + Number(i.price) * Number(i.quantity),
    0
  );
  const total = subtotal + Number(body.shipping || 0) + Number(body.tax || 0);

  const order = await prisma.order.create({
    data: {
      orderNumber: `CRY-${Date.now().toString(36).toUpperCase()}`,
      userId,
      addressId: body.addressId || null,
      subtotal,
      shipping: Number(body.shipping || 0),
      tax: Number(body.tax || 0),
      total,
      cryptoCurrency: body.cryptoCurrency || null,
      paymentMethod: body.cryptoCurrency ? "crypto" : "card",
      items: {
        create: orderItems.map((i: any) => ({
          productId: i.productId,
          color: i.color || "Default",
          quantity: Number(i.quantity),
          price: Number(i.price),
        })),
      },
    },
    include: { items: { include: { product: true } } },
  });

  // Mettre à jour les points de fidélité
  const earnedPoints = Math.floor(subtotal * 10);

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

  // ============ AFFILIATE TRACKING ============
  const affiliateRef = req.cookies.get("affiliate_ref")?.value;

  if (affiliateRef && order) {
    try {
      const affiliate = await prisma.affiliate.findUnique({ where: { code: affiliateRef } });

      if (affiliate) {
        const commission = (subtotal * 5) / 100; // 5% de commission

        // Créer la référence
        await prisma.affiliateReferral.create({
          data: {
            affiliateId: affiliate.id,
            orderId: order.id,
            commission,
            status: "pending",
          },
        });

        // Mettre à jour l'affilié
        await prisma.affiliate.update({
          where: { id: affiliate.id },
          data: {
            purchases: { increment: 1 },
            totalEarned: { increment: commission },
            availableBalance: { increment: commission },
          },
        });

        console.log(`💰 Commission of $${commission} credited to affiliate ${affiliate.code}`);
      }
    } catch (error) {
      console.error("Affiliate tracking error:", error);
    }
  }

  return NextResponse.json({ order }, { status: 201 });
}