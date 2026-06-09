import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || ""
);

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as string;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ message: "Email already verified." });
    }

    
    const emailVerifyToken = crypto.randomBytes(32).toString("hex");
    const emailVerifyExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: userId },
      data: { emailVerifyToken, emailVerifyExpiry },
    });

    
    sendVerificationEmail(user.email, {
      firstName: user.firstName,
      token: emailVerifyToken,
    }).catch((err) => console.error("Resend verification error:", err));

    return NextResponse.json({ message: "Verification email sent." });
  } catch {
    return NextResponse.json({ error: "Failed to resend." }, { status: 500 });
  }
}