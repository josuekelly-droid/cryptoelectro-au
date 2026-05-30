import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "cryptoelectro-au-secret-key-change-in-production");

export async function PUT(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let userId: string;
  try { const { payload } = await jwtVerify(token, JWT_SECRET); userId = payload.userId as string; }
  catch { return NextResponse.json({ error: "Invalid token" }, { status: 401 }); }

  const body = await req.json();

  // Update email
  if (body.email && !body.currentPassword) {
    await prisma.user.update({ where: { id: userId }, data: { email: body.email } });
    return NextResponse.json({ message: "Email updated" });
  }

  // Update password
  if (body.currentPassword && body.newPassword) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const valid = await bcrypt.compare(body.currentPassword, user.password);
    if (!valid) return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });

    const hashed = await bcrypt.hash(body.newPassword, 12);
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
    return NextResponse.json({ message: "Password updated" });
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}