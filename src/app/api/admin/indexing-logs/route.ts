import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "cryptoelectro-au-secret-key-change-in-production"
);

async function isAdmin(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.role === "ADMIN";
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter") || "all";

  const where: any = {};
  if (filter === "pending") where.status = "pending";
  if (filter === "success") where.status = "success";
  if (filter === "error") where.status = "error";

  const [logs, stats] = await Promise.all([
    prisma.indexingLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 500,
    }),
    prisma.indexingLog.groupBy({
      by: ["status"],
      _count: true,
    }),
  ]);

  const summary = {
    total: logs.length,
    pending: stats.find((s) => s.status === "pending")?._count || 0,
    success: stats.find((s) => s.status === "success")?._count || 0,
    error: stats.find((s) => s.status === "error")?._count || 0,
  };

  return NextResponse.json({ logs, summary });
}