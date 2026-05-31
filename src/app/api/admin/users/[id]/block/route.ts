import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { logAdminAction } from "@/lib/audit";

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "cryptoelectro-au-secret-key-change-in-production");

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { id } = await params;
    const body = await req.json();
    const { isBlocked } = body;

    const user = await prisma.user.update({
      where: { id },
      data: { isBlocked },
    });

    // Log admin action
    const adminId = payload.userId as string;
    await logAdminAction(adminId, isBlocked ? "BLOCK_USER" : "UNBLOCK_USER", `User ${user.email} ${isBlocked ? "blocked" : "unblocked"}`);

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}