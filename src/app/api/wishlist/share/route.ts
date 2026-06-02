import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import crypto from "crypto";

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "cryptoelectro-au-secret-key-change-in-production");

export async function POST(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let userId: string;
  try { const { payload } = await jwtVerify(token, JWT_SECRET); userId = payload.userId as string; }
  catch { return NextResponse.json({ error: "Invalid token" }, { status: 401 }); }

  const { productIds } = await req.json();
  if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
    return NextResponse.json({ error: "No products selected" }, { status: 400 });
  }

  let shared = await prisma.sharedWishlist.findFirst({ where: { userId } });

  if (shared) {
    shared = await prisma.sharedWishlist.update({
      where: { id: shared.id },
      data: { productIds: JSON.stringify(productIds), updatedAt: new Date() },
    });
  } else {
    const shareToken = crypto.randomBytes(8).toString("hex");
    shared = await prisma.sharedWishlist.create({
      data: { userId, shareToken, productIds: JSON.stringify(productIds) },
    });
  }

  return NextResponse.json({
    shareToken: shared.shareToken,
    url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/wishlist/${shared.shareToken}`,
  });
}