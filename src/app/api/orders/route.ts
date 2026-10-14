import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { logOrderCreated, logOrderExpired } from "@/lib/audit";
import { sendOrderConfirmationEmail, sendOrderExpiredEmail, sendOrderExpiredAdminEmail } from "@/lib/email";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "cryptoelectro-au-secret-key-change-in-production"
);

// 🔒 Mapping du tier → pourcentage de réduction loyalty
function getLoyaltyPercent(tier: string): number {
  switch (tier) {
    case "DIAMOND": return 20;
    case "PLATINUM": return 15;
    case "GOLD": return 10;
    case "SILVER": return 5;
    default: return 0;
  }
}

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

  const expiredOrders = await prisma.order.findMany({
    where: {
      userId,
      paymentStatus: { in: ["PENDING", "WAITING_CONFIRMATION"] },
      expiresAt: { lte: now },
      status: { not: "CANCELLED" },
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
          product: { select: { name: true } },
        },
      },
      user: {
        select: { email: true, firstName: true, lastName: true },
      },
    },
  });

  if (expiredOrders.length === 0) return 0;

  await prisma.order.updateMany({
    where: { id: { in: expiredOrders.map((o) => o.id) } },
    data: {
      status: "CANCELLED",
      paymentStatus: "EXPIRED",
      notes: "Commande annulée automatiquement - délai de paiement dépassé (30 minutes)",
    },
  });

  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: { email: true },
  });

  for (const order of expiredOrders) {
    const user = order.user;

    await logOrderExpired(userId, order.orderNumber, "Délai de paiement dépassé (30 minutes)");

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

    await cancelExpiredOrders(userId);

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

// ============ POST : Créer une commande SÉCURISÉE ============
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

  if (orderItems.length > 50) {
    return NextResponse.json({ error: "Too many items in order" }, { status: 400 });
  }

  // 🔒 ÉTAPE 1 : Récupérer les VRAIS produits depuis la DB
  const productIds = orderItems.map((i: any) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
    select: { id: true, name: true, price: true, inStock: true, stockQuantity: true },
  });

  if (products.length !== productIds.length) {
    return NextResponse.json(
      { error: "Some products are invalid or unavailable" },
      { status: 400 }
    );
  }

  const productMap = new Map(products.map((p) => [p.id, p]));

  // 🔒 ÉTAPE 2 : Recalculer le subtotal avec les VRAIS prix DB
  let subtotal = 0;
  const validatedItems: { productId: string; color: string; quantity: number; price: number }[] = [];

  for (const item of orderItems) {
    const product = productMap.get(item.productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 400 });
    }

    const qty = Math.floor(Number(item.quantity));
    if (!Number.isFinite(qty) || qty < 1 || qty > 50) {
      return NextResponse.json(
        { error: `Invalid quantity for ${product.name}` },
        { status: 400 }
      );
    }

    if (!product.inStock) {
      return NextResponse.json(
        { error: `${product.name} is out of stock` },
        { status: 400 }
      );
    }

    const realPrice = Number(product.price);
    subtotal += realPrice * qty;

    validatedItems.push({
      productId: item.productId,
      color: item.color || "Default",
      quantity: qty,
      price: realPrice, // ✅ Vrai prix DB
    });
  }

  subtotal = Math.round(subtotal * 100) / 100;

  // 🔒 ÉTAPE 3 : Recalculer shipping et tax selon TES règles
  const shipping = subtotal > 500 ? 0 : 29.99;
  const tax = Math.round(subtotal * 0.1 * 100) / 100;

  // 🔒 ÉTAPE 4 : Récupérer la loyalty discount depuis la DB
  const reward = await prisma.reward.findUnique({ where: { userId } });
  const loyaltyPercent = reward ? getLoyaltyPercent(reward.tier) : 0;
  const loyaltyDiscount = Math.round(subtotal * loyaltyPercent) / 100;

  // 🔒 ÉTAPE 5 : Valider le coupon si fourni
  let couponDiscount = 0;
  let appliedCouponCode: string | null = null;

  if (body.couponCode && typeof body.couponCode === "string") {
    const coupon = await prisma.coupon.findUnique({
      where: { code: body.couponCode.toUpperCase().trim() },
    });

    const isValid =
      coupon &&
      coupon.isActive &&
      (!coupon.expiresAt || new Date(coupon.expiresAt) > new Date()) &&
      (!coupon.minAmount || subtotal >= Number(coupon.minAmount)) &&
      (coupon.maxUses === 0 || coupon.usedCount < coupon.maxUses);

    if (isValid && coupon) {
      if (coupon.type === "percentage") {
        couponDiscount = Math.round(subtotal * Number(coupon.value)) / 100;
      } else {
        couponDiscount = Math.min(Number(coupon.value), subtotal);
      }
      appliedCouponCode = coupon.code;
    }
  }

  // 🔒 ÉTAPE 6 : Valider le store credit si demandé
  let creditApplied = 0;
  if (body.useCredit === true) {
    const affiliate = await prisma.affiliate.findUnique({ where: { userId } });
    const availableCredit = affiliate ? Number(affiliate.storeCredit) : 0;

    const maxUsableCredit = Math.max(
      0,
      subtotal + shipping + tax - loyaltyDiscount - couponDiscount
    );
    creditApplied = Math.min(availableCredit, maxUsableCredit);
    creditApplied = Math.round(creditApplied * 100) / 100;
  }

  // 🔒 ÉTAPE 7 : Calculer le VRAI total côté serveur
  const total = Math.max(
    0,
    Math.round((subtotal + shipping + tax - loyaltyDiscount - couponDiscount - creditApplied) * 100) / 100
  );

  // Log de debug pour identifier les tentatives de fraude
  console.log("🔒 ORDER_SECURITY_CHECK", {
    userId,
    clientTotal: body.total,
    serverTotal: total,
    subtotal,
    shipping,
    tax,
    loyaltyDiscount,
    couponDiscount,
    creditApplied,
    itemsCount: orderItems.length,
  });

  // 🚨 Alerte si tentative de manipulation
  if (body.total && Math.abs(Number(body.total) - total) > 1) {
    console.warn("🚨 FRAUD ATTEMPT DETECTED", {
      userId,
      clientTotal: body.total,
      serverTotal: total,
      difference: Number(body.total) - total,
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: "SECURITY_PRICE_MANIPULATION",
        details: `Client sent total=${body.total}, server calculated total=${total} (subtotal=${subtotal}, shipping=${shipping}, tax=${tax})`,
        ipAddress: req.headers.get("x-forwarded-for") || "unknown",
        userAgent: req.headers.get("user-agent") || "unknown",
      },
    });

    return NextResponse.json(
      { error: "Invalid order total. Please refresh and try again." },
      { status: 400 }
    );
  }

  // ============ CRÉATION DE LA COMMANDE ============
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

  const order = await prisma.order.create({
    data: {
      orderNumber: `CRY-${Date.now().toString(36).toUpperCase()}`,
      userId,
      addressId: body.addressId || null,
      subtotal,       // ✅ Recalculé serveur
      shipping,       // ✅ Recalculé serveur
      tax,            // ✅ Recalculé serveur
      total,          // ✅ Recalculé serveur
      cryptoCurrency: body.cryptoCurrency || null,
      paymentMethod: body.cryptoCurrency ? "crypto" : "card",
      expiresAt: expiresAt,
      items: {
        create: validatedItems.map((i) => ({
          productId: i.productId,
          color: i.color,
          quantity: i.quantity,
          price: i.price, // ✅ Vrai prix DB
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

  await logOrderCreated(userId, order.orderNumber);

  // ============ EMAIL DE CONFIRMATION ============
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (user?.email) {
    sendOrderConfirmationEmail(user.email, {
      orderNumber: order.orderNumber,
      customerName: user.firstName,
      items: validatedItems.map((i) => ({
        name: productMap.get(i.productId)?.name || "Product",
        quantity: i.quantity,
        price: i.price,
      })),
      subtotal,
      shipping,
      tax,
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
        items: validatedItems.map((i) => ({
          name: productMap.get(i.productId)?.name || "Product",
          quantity: i.quantity,
          price: i.price,
        })),
        subtotal,
        shipping,
        tax,
        total,
        cryptoCurrency: body.cryptoCurrency || undefined,
        paymentMethod: body.cryptoCurrency ? "crypto" : "card",
      }).catch((err) => console.error("Admin email error:", err));
    }
  }

  // ============ AFFILIATE TRACKING ============
  const affiliateRef = req.cookies.get("affiliate_ref")?.value;

  if (affiliateRef && order) {
    try {
      const affiliate = await prisma.affiliate.findUnique({
        where: { code: affiliateRef },
      });

      if (affiliate) {
        const commission = Math.round((subtotal * 5)) / 100;

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

        console.log(`🎁 Referral reward: $${REWARD_AMOUNT} credited to referrer and referred`);
      }
    } catch (error) {
      console.error("Referral reward error:", error);
    }
  }

  return NextResponse.json({ order }, { status: 201 });
}