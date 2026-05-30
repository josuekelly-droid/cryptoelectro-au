import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "cryptoelectro-au-secret-key-change-in-production"
);

export async function POST(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let userId: string;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    userId = payload.userId as string;
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const body = await req.json();
  const { addressId, items: orderItems, cryptoCurrency, shipping, tax } = body;

  if (!orderItems || orderItems.length === 0) {
    return NextResponse.json({ error: "No items" }, { status: 400 });
  }

  const subtotal = orderItems.reduce((s: number, i: any) => s + Number(i.price) * Number(i.quantity), 0);
  const total = subtotal + Number(shipping || 0) + Number(tax || 0);

  const order = await prisma.order.create({
    data: {
      orderNumber: `CRY-${Date.now().toString(36).toUpperCase()}`,
      userId,
      addressId: addressId || null,
      subtotal,
      shipping: Number(shipping || 0),
      tax: Number(tax || 0),
      total,
      cryptoCurrency: cryptoCurrency || null,
      paymentMethod: cryptoCurrency ? "crypto" : "card",
      items: {
        create: orderItems.map((i: any) => ({
          productId: i.productId,
          color: i.color || "Default",
          quantity: Number(i.quantity),
          price: Number(i.price),
        })),
      },
    },
    include: { items: { include: { product: true } } },
  });

  return NextResponse.json({ order }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return NextResponse.json({ orders: [] });
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const orders = await prisma.order.findMany({
      where: { userId: payload.userId as string },
      include: {
        items: { include: { product: { include: { images: true, brand: true } } } },
        address: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ orders: [] });
  }
}