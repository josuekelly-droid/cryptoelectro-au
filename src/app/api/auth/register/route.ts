import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { registerSchema } from "@/lib/validations";
import { logRegister } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validation avec Zod
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, password } = parsed.data;
    const referralCode = body.referralCode;

    // Check if user exists
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Générer le code de parrainage
    const generatedReferralCode = `${firstName.toUpperCase().substring(0, 4)}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        referralCode: generatedReferralCode,
        referredBy: referredBy || null,
      },
    });

    // Log registration
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    await logRegister(user.id, ip);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: "Account created successfully",
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