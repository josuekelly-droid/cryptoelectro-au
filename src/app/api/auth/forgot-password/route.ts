import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ message: "If this email exists, a reset link has been sent." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = new Date(Date.now() + 3600000);

    await prisma.user.update({
      where: { email },
      data: { resetToken, resetTokenExpiry: resetExpires },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: `"Cryptoelectro-au" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Reset your Cryptoelectro-au password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #007BFF;">Cryptoelectro-au</h1>
          <h2>Reset Your Password</h2>
          <p>You requested a password reset. Click the button below to create a new password. This link expires in 1 hour.</p>
          <a href="${resetUrl}" style="display: inline-block; background: #007BFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">Reset Password</a>
          <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #999; font-size: 12px;">Cryptoelectro-au - Australia's Premium Electronics Marketplace</p>
        </div>
      `,
    });

    return NextResponse.json({ message: "If this email exists, a reset link has been sent." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Failed to send reset email" }, { status: 500 });
  }
}