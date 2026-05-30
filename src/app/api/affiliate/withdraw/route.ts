import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "cryptoelectro-au-secret-key-change-in-production");
const MIN_WITHDRAW = 1; // On baisse le minimum pour les tests

export async function POST(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let userId: string;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    userId = payload.userId as string;
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const body = await req.json();
  const { type, amount, walletAddress } = body;

  const affiliate = await prisma.affiliate.findUnique({ where: { userId } });
  if (!affiliate) return NextResponse.json({ error: "No affiliate account" }, { status: 404 });

  const withdrawAmount = Number(amount);

  if (withdrawAmount < MIN_WITHDRAW) {
    return NextResponse.json({ error: `Minimum withdrawal is $${MIN_WITHDRAW}` }, { status: 400 });
  }

  if (type === "store_credit") {
    // Vérifier le solde du store credit
    if (withdrawAmount > Number(affiliate.storeCredit)) {
      return NextResponse.json({ error: "Insufficient store credit balance" }, { status: 400 });
    }

    // Déduire du store credit
    const updated = await prisma.affiliate.update({
      where: { userId },
      data: {
        storeCredit: { decrement: withdrawAmount },
      },
    });

    return NextResponse.json({
      message: `$${withdrawAmount} deducted from store credit`,
      newStoreCredit: Number(updated.storeCredit),
    });
  }

  if (type === "crypto") {
    if (withdrawAmount > Number(affiliate.availableBalance)) {
      return NextResponse.json({ error: "Insufficient available balance" }, { status: 400 });
    }

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required for crypto withdrawal" }, { status: 400 });
    }

    const updated = await prisma.affiliate.update({
      where: { userId },
      data: {
        walletAddress: walletAddress || affiliate.walletAddress,
        availableBalance: { decrement: withdrawAmount },
        totalWithdrawn: { increment: withdrawAmount },
      },
    });

    await prisma.affiliateReferral.create({
      data: {
        affiliateId: affiliate.id,
        commission: withdrawAmount,
        status: "pending_withdrawal",
      },
    });

    return NextResponse.json({
      message: `$${withdrawAmount} withdrawal requested. Processing time: 24-48h.`,
      newBalance: Number(updated.availableBalance),
    });
  }

  return NextResponse.json({ error: "Invalid withdrawal type" }, { status: 400 });
}