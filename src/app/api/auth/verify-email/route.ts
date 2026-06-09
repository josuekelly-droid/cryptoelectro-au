import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No token provided." },
        { status: 400 }
      );
    }

    
    const user = await prisma.user.findFirst({
      where: {
        emailVerifyToken: token,
        emailVerifyExpiry: { gt: new Date() }, 
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired verification link. Please request a new one." },
        { status: 400 }
      );
    }

    
    if (user.emailVerified) {
      return NextResponse.json(
        { success: true, message: "Email already verified. You can sign in." }
      );
    }

    // Marquer l'email comme vérifié
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifyToken: null,
        emailVerifyExpiry: null,
      },
    });

    return NextResponse.json(
      { success: true, message: "Email verified successfully! You can now sign in." }
    );
  } catch (error) {
    console.error("Verify email error:", error);
    return NextResponse.json(
      { success: false, error: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}