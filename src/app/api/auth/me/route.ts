import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "cryptoelectro-au-secret-key-change-in-production"
);

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user is blocked - force logout
    if (user.isBlocked) {
      const response = NextResponse.json(
        { error: "Your account has been suspended. Please contact support." },
        { status: 403 }
      );
      response.cookies.set("auth-token", "", { maxAge: 0, path: "/" });
      return response;
    }

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
}