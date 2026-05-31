import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { sendWithdrawalConfirmationEmail } from "@/lib/email";

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "cryptoelectro-au-secret-key-change-in-production");
const MIN_WITHDRAW = 1;

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

  // Récupérer l'utilisateur pour l'email
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (type === "store_credit") {
    // Vérifier le solde disponible (availableBalance)
    if (withdrawAmount > Number(affiliate.availableBalance)) {
      return NextResponse.json({ error: "Insufficient available balance" }, { status: 400 });
    }

    // Convertir availableBalance en storeCredit
    const updated = await prisma.affiliate.update({
      where: { userId },
      data: {
        availableBalance: { decrement: withdrawAmount },
        storeCredit: { increment: withdrawAmount },
        totalWithdrawn: { increment: withdrawAmount },
      },
    });

    // Envoyer l'email de confirmation
    if (user?.email) {
      sendWithdrawalConfirmationEmail(user.email, {
        customerName: user.firstName,
        amount: withdrawAmount,
        type: "store_credit",
        newBalance: Number(updated.availableBalance),
      }).catch((err) => console.error("Withdrawal email error:", err));
    }

    return NextResponse.json({
      message: `$${withdrawAmount} converted to store credit`,
      newStoreCredit: Number(updated.storeCredit),
      newBalance: Number(updated.availableBalance),
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

    // Envoyer l'email de confirmation
    if (user?.email) {
      sendWithdrawalConfirmationEmail(user.email, {
        customerName: user.firstName,
        amount: withdrawAmount,
        type: "crypto",
        walletAddress: walletAddress,
        newBalance: Number(updated.availableBalance),
      }).catch((err) => console.error("Withdrawal email error:", err));
    }

    return NextResponse.json({
      message: `$${withdrawAmount} withdrawal requested. Processing time: 24-48h.`,
      newBalance: Number(updated.availableBalance),
    });
  }

  return NextResponse.json({ error: "Invalid withdrawal type" }, { status: 400 });
}