import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import nodemailer from "nodemailer";

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "cryptoelectro-au-secret-key-change-in-production");
const transporter = nodemailer.createTransport({ service: "gmail", auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD } });

export async function POST(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  const { orderId } = await req.json();
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: { select: { email: true, firstName: true } } },
  });

  if (!order?.user?.email) return NextResponse.json({ error: "Order or user not found" }, { status: 404 });

  const statusMessages: Record<string, string> = {
    CONFIRMED: "has been confirmed and is being prepared",
    PROCESSING: "is being processed",
    SHIPPED: "has been shipped and is on its way",
    DELIVERED: "has been delivered",
    CANCELLED: "has been cancelled",
  };

  const message = statusMessages[order.status] || "status has been updated";

  await transporter.sendMail({
    from: `"Cryptoelectro-au" <${process.env.GMAIL_USER}>`,
    to: order.user.email,
    subject: `Order ${order.orderNumber} Update - Cryptoelectro-au`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
        <h2 style="color: #007BFF;">Cryptoelectro-au</h2>
        <p>Hello ${order.user.firstName},</p>
        <p>Your order <strong>#${order.orderNumber}</strong> ${message}.</p>
        <p>📦 <a href="${process.env.NEXTAUTH_URL}/dashboard" style="color: #007BFF;">Track your order</a></p>
        <p>Thank you for shopping with us!</p>
        <p>- Cryptoelectro-au Team</p>
      </div>
    `,
  });

  return NextResponse.json({ message: "Email sent" });
}