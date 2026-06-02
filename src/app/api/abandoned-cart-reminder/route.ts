import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
});

const SITE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret") || "";
if (secret !== process.env.CRON_SECRET) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

  const now = new Date();
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const firstReminder = await prisma.abandonedCart.findMany({
    where: {
      isCompleted: false,
      reminderCount: 0,
      lastActivity: { lte: twoHoursAgo },
    },
    include: { user: { select: { email: true, firstName: true } } },
  });

  const secondReminder = await prisma.abandonedCart.findMany({
    where: {
      isCompleted: false,
      reminderCount: 1,
      lastActivity: { lte: twentyFourHoursAgo },
      lastReminderAt: { lte: twentyFourHoursAgo },
    },
    include: { user: { select: { email: true, firstName: true } } },
  });

  let sent = 0;

  for (const cart of firstReminder) {
    if (cart.user?.email) {
      await transporter.sendMail({
        from: `"Cryptoelectro-au" <${process.env.GMAIL_USER}>`,
        to: cart.user.email,
        subject: "You left something in your cart 🛒",
        html: `<div style="font-family:Arial,sans-serif;max-width:500px;padding:20px"><h2 style="color:#007BFF">Cryptoelectro-au</h2><p>Hi ${cart.user.firstName},</p><p>We noticed you added items to your cart but didn't complete your purchase. Your items are still waiting for you!</p><p style="margin:20px 0"><a href="${SITE_URL}/cart" style="background:#007BFF;color:#fff;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold">Return to Cart</a></p><p style="color:#666;font-size:12px">Don't want these reminders? <a href="${SITE_URL}/dashboard/settings">Unsubscribe</a></p></div>`,
      });
      await prisma.abandonedCart.update({ where: { id: cart.id }, data: { reminderCount: 1, lastReminderAt: new Date() } });
      sent++;
    }
  }

  for (const cart of secondReminder) {
    if (cart.user?.email) {
      await transporter.sendMail({
        from: `"Cryptoelectro-au" <${process.env.GMAIL_USER}>`,
        to: cart.user.email,
        subject: "Your cart is about to expire ⏰",
        html: `<div style="font-family:Arial,sans-serif;max-width:500px;padding:20px"><h2 style="color:#007BFF">Cryptoelectro-au</h2><p>Hi ${cart.user.firstName},</p><p>Your cart is still waiting! Don't miss out on your items — they may sell out soon.</p><p style="margin:20px 0"><a href="${SITE_URL}/cart" style="background:#007BFF;color:#fff;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold">Complete Your Order</a></p><p style="color:#666;font-size:12px">This is the last reminder we'll send about this cart.</p></div>`,
      });
      await prisma.abandonedCart.update({ where: { id: cart.id }, data: { reminderCount: 2, lastReminderAt: new Date() } });
      sent++;
    }
  }

  return NextResponse.json({ message: `Sent ${sent} reminders` });
}

// Force redeploy v2