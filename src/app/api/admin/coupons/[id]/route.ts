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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const { id } = await params;
  const data = await req.json();
  const coupon = await prisma.coupon.update({ where: { id }, data: { ...data, isActive: data.isActive ?? true } });
  return NextResponse.json({ coupon });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const { id } = await params;
  await prisma.coupon.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted" });
}