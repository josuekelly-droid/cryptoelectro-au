import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { sendWithdrawalConfirmationEmail } from "@/lib/email";

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "cryptoelectro-au-secret-key-change-in-production");

async function isAdmin(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return false;
  try { const { payload } = await jwtVerify(token, JWT_SECRET); return payload.role === "ADMIN"; }
  catch { return false; }
}

// Mark as paid
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const { id } = await params;

  const referral = await prisma.affiliateReferral.update({
    where: { id },
    data: { status: "paid" },
    include: {
      affiliate: {
        include: {
          user: { select: { id: true, firstName: true, email: true } },
        },
      },
    },
  });

  // Envoyer l'email de confirmation au client
  if (referral.affiliate?.user?.email) {
    sendWithdrawalConfirmationEmail(referral.affiliate.user.email, {
      customerName: referral.affiliate.user.firstName,
      amount: Number(referral.commission),
      type: "crypto",
      newBalance: Number(referral.affiliate.availableBalance),
    }).catch((err) => console.error("Paid withdrawal email error:", err));
  }

  return NextResponse.json({ message: "Marked as paid" });
}

// Reject
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const { id } = await params;
  await prisma.affiliateReferral.update({ where: { id }, data: { status: "rejected" } });
  return NextResponse.json({ message: "Rejected" });
}