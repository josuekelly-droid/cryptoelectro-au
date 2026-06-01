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

  const orders = await prisma.order.findMany({
    include: {
      user: { select: { id: true, firstName: true, lastName: true, email: true } },
      items: { include: { product: { select: { name: true } } } },
      address: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}