import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { logOrderCreated, logOrderExpired } from "@/lib/audit";
import { sendOrderConfirmationEmail, sendOrderExpiredEmail, sendOrderExpiredAdminEmail } from "@/lib/email";

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

// ============ FONCTION D'ANNULATION DES COMMANDES EXPIRÉES AVEC EMAILS ============
async function cancelExpiredOrders(userId: string) {
  const now = new Date();

  // Trouver les commandes expirées avec les infos nécessaires pour les emails
  const expiredOrders = await prisma.order.findMany({
    where: {
      userId,
      paymentStatus: {
        in: ["PENDING", "WAITING_CONFIRMATION"],
      },
      expiresAt: {
        lte: now,
      },
      status: {
        not: "CANCELLED",
      },
    },
    select: {
      id: true,
      orderNumber: true,
      total: true,
      expiresAt: true,
      paymentMethod: true,
      cryptoCurrency: true,
      items: {
        select: {
          quantity: true,
          price: true,
          product: {
            select: {
              name: true,
            },
          },
        },
      },
      user: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  if (expiredOrders.length === 0) return 0;

  // Annuler les commandes
  await prisma.order.updateMany({
    where: {
      id: { in: expiredOrders.map((o) => o.id) },
    },
    data: {
      status: "CANCELLED",
      paymentStatus: "EXPIRED",
      notes: "Commande annulée automatiquement - délai de paiement dépassé (30 minutes)",
    },
  });

  // Récupérer les admins une seule fois
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: { email: true },
  });

  // Envoyer les emails pour chaque commande expirée
  for (const order of expiredOrders) {
    const user = order.user;

  // Audit log pour la commande expirée
    await logOrderExpired(userId, order.orderNumber, "Délai de paiement dépassé (30 minutes)");

    // Email client
    if (user?.email) {
      sendOrderExpiredEmail(user.email, {
        orderNumber: order.orderNumber,
        customerName: user.firstName,
        items: order.items.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: Number(item.price),
        })),
        total: Number(order.total),
        expiredAt: order.expiresAt ? new Date(order.expiresAt).toISOString() : now.toISOString(),
      }).catch((err) => console.error("Client expired email error:", err));
    }

    // Email admins
    for (const admin of admins) {
      if (admin.email) {
        sendOrderExpiredAdminEmail(admin.email, {
          orderNumber: order.orderNumber,
          customerName: `${user?.firstName} ${user?.lastName}`,
          customerEmail: user?.email || "N/A",
          items: order.items.map((item) => ({
            name: item.product.name,
            quantity: item.quantity,
            price: Number(item.price),
          })),
          total: Number(order.total),
          expiredAt: order.expiresAt ? new Date(order.expiresAt).toISOString() : now.toISOString(),
          paymentMethod: order.paymentMethod,
          cryptoCurrency: order.cryptoCurrency,
        }).catch((err) => console.error("Admin expired email error:", err));
      }
    }

    console.log(`📧 Emails d'expiration envoyés pour la commande ${order.orderNumber}`);
  }

  console.log(
    `🕐 ${expiredOrders.length} commande(s) expirée(s) annulée(s) pour l'utilisateur ${userId}`
  );

  return expiredOrders.length;
}

// ============ GET : Récupérer les commandes avec vérification d'expiration ============
export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return NextResponse.json({ orders: [] });

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as string;

    // VÉRIFICATION ET ANNULATION DES COMMANDES EXPIRÉES AVANT DE LES RETOURNER
    await cancelExpiredOrders(userId);

    // Récupérer toutes les commandes
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: { include: { images: true, brand: true } },
          },
        },
        address: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ orders: [] });
  }
}

// ============ POST : Créer une commande avec expiration ============
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
  const total = body.total || (subtotal + Number(body.shipping || 0) + Number(body.tax || 0));

  // Récupérer les noms des produits pour l'email
  const productIds = orderItems.map((i: any) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true },
  });
  const productMap = new Map(products.map((p) => [p.id, p.name]));

  // ============ CRÉATION DE LA COMMANDE AVEC expiresAt ============
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // +30 minutes

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
      expiresAt: expiresAt,
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
      const affiliate = await prisma.affiliate.findUnique({
        where: { code: affiliateRef },
      });

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

        console.log(
          `💰 Commission of $${commission} credited to affiliate ${affiliate.code}`
        );
      }
    } catch (error) {
      console.error("Affiliate tracking error:", error);
    }
  }

  // ============ REFERRAL REWARD ============
  if (user?.referredBy && !user.referralRewardClaimed) {
    try {
      const orderCount = await prisma.order.count({
        where: { userId, status: { not: "CANCELLED" } },
      });

      if (orderCount === 1) {
        const REWARD_AMOUNT = 10;

        const referrerAffiliate = await prisma.affiliate.findUnique({
          where: { userId: user.referredBy },
        });
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

        const referredAffiliate = await prisma.affiliate.findUnique({
          where: { userId },
        });
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

        await prisma.user.update({
          where: { id: userId },
          data: { referralRewardClaimed: true },
        });

        console.log(
          `🎁 Referral reward: $${REWARD_AMOUNT} credited to referrer and referred`
        );
      }
    } catch (error) {
      console.error("Referral reward error:", error);
    }
  }

  return NextResponse.json({ order }, { status: 201 });
}