import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "cryptoelectro-au-secret-key-change-in-production");

async function isAdmin(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return false;
  try { const { payload } = await jwtVerify(token, JWT_SECRET); return payload.role === "ADMIN"; }
  catch { return false; }
}

export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const deals = await prisma.deal.findMany({ include: { product: { select: { name: true, price: true, images: true } } }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ deals });
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const data = await req.json();
  const deal = await prisma.deal.create({ data: { productId: data.productId, dealPrice: Number(data.dealPrice), expiresAt: new Date(data.expiresAt) } });
  return NextResponse.json({ deal }, { status: 201 });
}