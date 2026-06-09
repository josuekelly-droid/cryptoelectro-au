import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { registerSchema } from "@/lib/validations";
import { logRegister } from "@/lib/audit";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, password } = parsed.data;
    const referralCode = body.referralCode;

    
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Vérifier le code de parrainage
    let referredBy: string | null = null;
    if (referralCode) {
      const referrer = await prisma.user.findUnique({ where: { referralCode } });
      if (referrer) {
        referredBy = referrer.id;
      }
    }

    
    const hashedPassword = await bcrypt.hash(password, 12);

    
    const generatedReferralCode = `${firstName.toUpperCase().substring(0, 4)}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

    
    const emailVerifyToken = crypto.randomBytes(32).toString("hex");
    const emailVerifyExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures

    
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        referralCode: generatedReferralCode,
        referredBy: referredBy || null,
        emailVerifyToken,
        emailVerifyExpiry,
        emailVerified: false,
      },
    });

    // 📧 Envoyer l'email de vérification
    if (user.email) {
      sendVerificationEmail(user.email, {
        firstName: user.firstName,
        token: emailVerifyToken,
      }).catch((err) => console.error("Verification email error:", err));
    }

    // Log registration
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    await logRegister(user.id, ip);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: "Account created successfully. Please check your email to verify your account.",
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}