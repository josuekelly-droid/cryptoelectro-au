import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "cryptoelectro-au-secret-key-change-in-production");

export async function POST(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return NextResponse.json({ message: "ok" }); // Ignorer si pas connecté

  let userId: string;
  try { const { payload } = await jwtVerify(token, JWT_SECRET); userId = payload.userId as string; }
  catch { return NextResponse.json({ message: "ok" }); }

  await prisma.abandonedCart.upsert({
    where: { userId },
    update: { lastActivity: new Date(), isCompleted: false },
    create: { userId, lastActivity: new Date() },
  });

  return NextResponse.json({ message: "ok" });
}