import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
});

const SITE_URL = process.env.NEXTAUTH_URL || "https://cryptoelectro-au.vercel.app";

export async function POST(req: NextRequest) {
  const { email, firstName, cartId, type } = await req.json();

  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  try {
    await transporter.sendMail({
      from: `"Cryptoelectro-au" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: type === "first" ? "You left something in your cart 🛒" : "Your cart is about to expire ⏰",
      html: type === "first"
        ? `<div style="font-family:Arial,sans-serif;max-width:500px;padding:20px"><h2 style="color:#007BFF">Cryptoelectro-au</h2><p>Hi ${firstName},</p><p>We noticed you added items to your cart but didn't complete your purchase.</p><p style="margin:20px 0"><a href="${SITE_URL}/cart" style="background:#007BFF;color:#fff;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold">Return to Cart</a></p></div>`
        : `<div style="font-family:Arial,sans-serif;max-width:500px;padding:20px"><h2 style="color:#007BFF">Cryptoelectro-au</h2><p>Hi ${firstName},</p><p>Your cart is still waiting! Don't miss out.</p><p style="margin:20px 0"><a href="${SITE_URL}/cart" style="background:#007BFF;color:#fff;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold">Complete Your Order</a></p></div>`,
    });

    await prisma.abandonedCart.update({
      where: { id: cartId },
      data: { reminderCount: { increment: 1 }, lastReminderAt: new Date() },
    });

    return NextResponse.json({ message: "Sent" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}