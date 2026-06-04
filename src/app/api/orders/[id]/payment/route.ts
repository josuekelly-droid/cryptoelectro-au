import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { z } from "zod";

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "");

// ============ SCHÉMA DE VALIDATION ============
const paymentSchema = z.object({
  paymentId: z.string().min(1).max(100),
  cryptoAddress: z.string().min(1).max(200),
  idempotencyKey: z.string().min(1).max(100).optional(),
});

// ============ SERVICE DE CONVERSION CRYPTO (API RÉELLE COINGECKO) ============
async function getCryptoAmount(audAmount: number, currency: string): Promise<string> {
  try {
    const coinIds: Record<string, string> = {
      BTC: "bitcoin",
      ETH: "ethereum",
      USDT: "tether",
      USDC: "usd-coin",
      TRX: "tron",
      SOL: "solana",
    };

    const coinId = coinIds[currency] || "tether";

    // Prix crypto en USD
    const cryptoRes = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`,
      { cache: "no-store" }
    );
    const cryptoData = await cryptoRes.json();
    const cryptoPriceUSD = cryptoData[coinId]?.usd || 1;

    // Taux AUD ↔ USD via USDT
const forexRes = await fetch(
  `https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd,aud`,
  { cache: "no-store" }
);

const forexData = await forexRes.json();

const usdtUsd = forexData.tether?.usd || 1;
const usdtAud = forexData.tether?.aud || 1.5;

// 1 AUD = combien de USD
const usdPerAud = usdtUsd / usdtAud;

// AUD → USD
const amountUSD = audAmount * usdPerAud;

// USD → Crypto
const cryptoAmount = amountUSD / cryptoPriceUSD;

    return cryptoAmount.toFixed(8);
  } catch {
    // Fallback si API indisponible
    const fallbackRates: Record<string, number> = {
      BTC: 0.00001,
      ETH: 0.0002,
      USDT: 1,
      USDC: 1,
      TRX: 15,
      SOL: 0.01,
    };
    return (audAmount * (fallbackRates[currency] || 1)).toFixed(8);
  }
}

// ============ VÉRIFICATION EXPIRATION ============
async function isOrderExpired(orderId: string): Promise<boolean> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { expiresAt: true, status: true },
  });

  if (!order || !order.expiresAt) return false;
  
  const expiryDate = new Date(order.expiresAt);
  const now = new Date();
  
  return now > expiryDate;
}

// ============ FONCTIONS UTILITAIRES ============
async function authenticateAndAuthorize(
  req: NextRequest,
  orderId: string
): Promise<{ userId: string; order: any } | NextResponse> {
  const token = req.cookies.get("auth-token")?.value;
  if (!token)
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });

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
    select: {
      userId: true,
      paymentStatus: true,
      total: true,
      cryptoCurrency: true,
      paymentId: true,
      status: true,
      expiresAt: true, // ⏰ AJOUTÉ
    },
  });

  if (!order)
    return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const isOwner = order.userId === userId;
  const isAdminOrManager = userRole === "ADMIN" || userRole === "MANAGER";
  if (!isOwner && !isAdminOrManager) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  return { userId, order };
}

function getAllowedTransitions(currentStatus: string): string[] {
  const transitions: Record<string, string[]> = {
    PENDING: ["WAITING_CONFIRMATION"],
    WAITING_CONFIRMATION: ["CONFIRMED", "EXPIRED", "FAILED"],
    CONFIRMED: [],
    EXPIRED: ["WAITING_CONFIRMATION"],
    FAILED: ["WAITING_CONFIRMATION"],
    REFUNDED: [],
  };
  return transitions[currentStatus] || [];
}

// ============ ROUTE PRINCIPALE ============
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // ===== VÉRIFICATION EXPIRATION AVANT TOUT =====
    const expired = await isOrderExpired(id);
    if (expired) {
      // Annuler la commande expirée
      await prisma.order.update({
        where: { id },
        data: {
          status: "CANCELLED",
          paymentStatus: "EXPIRED",
          notes: "Commande annulée automatiquement - délai de paiement dépassé (1h)",
        },
      });

      return NextResponse.json(
        {
          error: "Cette commande a expiré. Le délai de paiement d'une heure est dépassé.",
          code: "ORDER_EXPIRED",
        },
        { status: 410 }
      );
    }

    // ===== AUTH + AUTORISATION =====
    const auth = await authenticateAndAuthorize(req, id);
    if (auth instanceof NextResponse) return auth;
    const { order } = auth;

    // ===== PROTECTION IDEMPOTENCE =====
    const body = await req.json();
    const idempotencyKey = body.idempotencyKey;

    if (idempotencyKey) {
      const existingLog = await prisma.auditLog.findFirst({
        where: { action: "PAYMENT_UPDATED", details: { contains: idempotencyKey } },
      });
      if (existingLog) {
        return NextResponse.json(
          { message: "Payment already processed", order: { id } },
          { status: 200 }
        );
      }
    }

    // ===== PROTECTION STATUT + CONCURRENCE =====
    if (order.status === "CANCELLED") {
      return NextResponse.json(
        { error: "Cette commande a été annulée" },
        { status: 410 }
      );
    }

    if (order.paymentStatus === "CONFIRMED") {
      return NextResponse.json(
        { error: "Order is already paid and cannot be modified" },
        { status: 409 }
      );
    }

    if (order.paymentId) {
      return NextResponse.json(
        { error: "Payment already in progress. Cannot modify." },
        { status: 409 }
      );
    }

    const allowed = getAllowedTransitions(order.paymentStatus);
    if (!allowed.includes("WAITING_CONFIRMATION")) {
      return NextResponse.json(
        { error: `Cannot update payment from status "${order.paymentStatus}"` },
        { status: 409 }
      );
    }

    // ===== VALIDATION =====
    const parsed = paymentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            "Invalid data: " + parsed.error.issues.map((i) => i.message).join(", "),
        },
        { status: 400 }
      );
    }

    const { paymentId, cryptoAddress } = parsed.data;

    // ===== CALCUL DU MONTANT CRYPTO VIA API RÉELLE =====
    const audAmount = Number(order.total);
    const currency = order.cryptoCurrency || "USDT";
    const cryptoAmount = await getCryptoAmount(audAmount, currency);

    // ===== MISE À JOUR AVEC TRANSACTION PRISMA (ATOMICITÉ) =====
    const updatedOrder = await prisma.$transaction(async (tx) => {
      const currentOrder = await tx.order.findUnique({
        where: { id },
        select: { paymentStatus: true, paymentId: true },
      });

      if (!currentOrder || currentOrder.paymentId) {
        throw new Error("CONCURRENT_MODIFICATION");
      }
      if (currentOrder.paymentStatus !== order.paymentStatus) {
        throw new Error("STATUS_CHANGED");
      }

      return tx.order.update({
        where: { id },
        data: {
          paymentId,
          cryptoAddress,
          cryptoAmount,
          paymentStatus: "WAITING_CONFIRMATION",
          expiresAt: new Date(Date.now() + 30 * 60 * 1000), // ⏰ RÉINITIALISER L'EXPIRATION À +30MIN
        },
      });
    });

    // ===== AUDIT LOG ENRICHI =====
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    await prisma.auditLog.create({
      data: {
        userId: order.userId,
        action: "PAYMENT_UPDATED",
        details: `Order ${id}: payment ${paymentId}, address ${cryptoAddress.substring(0, 10)}..., amount ${cryptoAmount} ${currency}, previousStatus: ${order.paymentStatus}, newStatus: WAITING_CONFIRMATION${idempotencyKey ? ", idempotencyKey: " + idempotencyKey : ""}`,
        ipAddress: ip,
        userAgent: userAgent,
      },
    });

    return NextResponse.json({ order: updatedOrder });
  } catch (error: any) {
    if (
      error.message === "CONCURRENT_MODIFICATION" ||
      error.message === "STATUS_CHANGED"
    ) {
      return NextResponse.json(
        {
          error:
            "Payment information was modified by another request. Please try again.",
        },
        { status: 409 }
      );
    }

    console.error("Payment update error:", error.message || error);
    return NextResponse.json(
      { error: "Failed to update payment information. Please try again." },
      { status: 500 }
    );
  }
}