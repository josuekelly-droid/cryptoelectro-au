import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { email, firstName, cartId, type } = await req.json();

    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    // Vérifier que les variables d'env sont définies
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return NextResponse.json({ error: "Email config missing: " + (process.env.GMAIL_USER ? "USER OK" : "USER MISSING") + " / " + (process.env.GMAIL_APP_PASSWORD ? "PASS OK" : "PASS MISSING") }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    });

    const SITE_URL = process.env.NEXTAUTH_URL || "https://cryptoelectro-au.vercel.app";

    await transporter.sendMail({
      from: `"Cryptoelectro-au" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: type === "first" ? "You left something in your cart" : "Your cart is about to expire",
      html: `<p>Hi ${firstName},</p><p>Test email from Cryptoelectro-au.</p><p><a href="${SITE_URL}/cart">Return to Cart</a></p>`,
    });

    if (cartId !== "test") {
      await prisma.abandonedCart.update({
        where: { id: cartId },
        data: { reminderCount: { increment: 1 }, lastReminderAt: new Date() },
      });
    }

    return NextResponse.json({ message: "Sent to " + email });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unknown" }, { status: 500 });
  }
}