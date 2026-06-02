import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { logOrderCreated } from "@/lib/audit";
import { sendOrderConfirmationEmail } from "@/lib/email";

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

  // Récupérer les noms des produits pour l'email
  const productIds = orderItems.map((i: any) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true },
  });
  const productMap = new Map(products.map((p) => [p.id, p.name]));

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

  // Marquer le panier comme complété
await prisma.abandonedCart.updateMany({
  where: { userId },
  data: { isCompleted: true },
});

  // Log order creation
  await logOrderCreated(userId, order.orderNumber);

  // ============ ENVOI EMAIL DE CONFIRMATION ============
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (user?.email) {
    sendOrderConfirmationEmail(user.email, {
      orderNumber: order.orderNumber,
      customerName: user.firstName,
      items: orderItems.map((i: any) => ({
        name: productMap.get(i.productId) || "Product",
        quantity: i.quantity,
        price: Number(i.price),
      })),
      subtotal,
      shipping: Number(body.shipping || 0),
      tax: Number(body.tax || 0),
      total,
      cryptoCurrency: body.cryptoCurrency || undefined,
      cryptoAmount: undefined,
      cryptoAddress: undefined,
      paymentMethod: body.cryptoCurrency ? "crypto" : "card",
    }).catch((err) => console.error("Email send error:", err));
  }

  // ============ NOTIFICATION ADMIN ============
const admins = await prisma.user.findMany({
  where: { role: "ADMIN" },
  select: { email: true, firstName: true },
});

for (const admin of admins) {
  if (admin.email) {
    sendOrderConfirmationEmail(admin.email, {
      orderNumber: `[ADMIN] ${order.orderNumber}`,
      customerName: `${user?.firstName} ${user?.lastName}`,
      items: orderItems.map((i: any) => ({
        name: productMap.get(i.productId) || "Product",
        quantity: i.quantity,
        price: Number(i.price),
      })),
      subtotal,
      shipping: Number(body.shipping || 0),
      tax: Number(body.tax || 0),
      total,
      cryptoCurrency: body.cryptoCurrency || undefined,
      paymentMethod: body.cryptoCurrency ? "crypto" : "card",
    }).catch((err) => console.error("Admin email error:", err));
  }
}

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
        const commission = (subtotal * 5) / 100;

        await prisma.affiliateReferral.create({
          data: {
            affiliateId: affiliate.id,
            orderId: order.id,
            commission,
            status: "pending",
          },
        });

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

  // ============ REFERRAL REWARD ============
  if (user?.referredBy && !user.referralRewardClaimed) {
    try {
      // Compter les commandes confirmées du filleul
      const orderCount = await prisma.order.count({
        where: { userId, status: { not: "CANCELLED" } },
      });

      if (orderCount === 1) {
        // Première commande : attribuer la récompense
        const REWARD_AMOUNT = 10;

        // Créditer le parrain
        const referrerAffiliate = await prisma.affiliate.findUnique({ where: { userId: user.referredBy } });
        if (referrerAffiliate) {
          await prisma.affiliate.update({
            where: { userId: user.referredBy },
            data: { storeCredit: { increment: REWARD_AMOUNT } },
          });
        } else {
          await prisma.affiliate.create({
  data: {
    userId: user.referredBy,
    code: `REF-${user.referredBy.substring(0, 6).toUpperCase()}`,
    storeCredit: REWARD_AMOUNT,
  },
});
        }

        // Créditer le filleul
        const referredAffiliate = await prisma.affiliate.findUnique({ where: { userId } });
        if (referredAffiliate) {
          await prisma.affiliate.update({
            where: { userId },
            data: { storeCredit: { increment: REWARD_AMOUNT } },
          });
        } else {
          await prisma.affiliate.create({
  data: {
    userId,
    code: `REF-${userId.substring(0, 6).toUpperCase()}`,
    storeCredit: REWARD_AMOUNT,
  },
});
        }

        // Marquer comme récompense attribuée
        await prisma.user.update({
          where: { id: userId },
          data: { referralRewardClaimed: true },
        });

        console.log(`🎁 Referral reward: $${REWARD_AMOUNT} credited to referrer and referred`);
      }
    } catch (error) {
      console.error("Referral reward error:", error);
    }
  }

  return NextResponse.json({ order }, { status: 201 });
}