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

// Mark as paid
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const { id } = await params;
  await prisma.affiliateReferral.update({ where: { id }, data: { status: "paid" } });
  return NextResponse.json({ message: "Marked as paid" });
}

// Reject
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const { id } = await params;
  await prisma.affiliateReferral.update({ where: { id }, data: { status: "rejected" } });
  return NextResponse.json({ message: "Rejected" });
}