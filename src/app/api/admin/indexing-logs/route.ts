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

  const getCount = (status: string): number => {
    const found = stats.find((s) => s.status === status);
    if (!found) return 0;
    return Number(found._count);
  };

  const summary = {
    total: getCount("success") + getCount("pending") + getCount("error"),
    pending: getCount("pending"),
    success: getCount("success"),
    error: getCount("error"),
  };

  // 📊 Log visible dans Vercel
  console.log("📊 INDEXING STATS:", JSON.stringify(summary));
  console.log(`📊 Filter: ${filter} | Showing: ${logs.length} logs`);

  return NextResponse.json({ logs, summary });
}