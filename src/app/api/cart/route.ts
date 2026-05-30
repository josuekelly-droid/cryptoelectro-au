import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "cryptoelectro-au-secret-key-change-in-production"
);

async function getUserId(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.userId as string;
  } catch {
    return null;
  }
}

// GET - Récupérer le panier
export async function GET(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          brand: true,
          images: { orderBy: { sortOrder: "asc" } },
        },
      },
    },
  });

  return NextResponse.json({ items: cartItems });
}

// POST - Ajouter au panier
export async function POST(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { productId, quantity = 1, color = "Default" } = await req.json();

  if (!productId) {
    return NextResponse.json({ error: "Product ID required" }, { status: 400 });
  }

  // Vérifier si le produit existe déjà dans le panier
  const existing = await prisma.cartItem.findFirst({
    where: { userId, productId, color },
  });

  if (existing) {
    const updated = await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
      include: { product: true },
    });
    return NextResponse.json({ item: updated });
  }

  const item = await prisma.cartItem.create({
    data: { userId, productId, quantity, color },
    include: { product: true },
  });

  return NextResponse.json({ item }, { status: 201 });
}

// PUT - Mettre à jour la quantité
export async function PUT(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { itemId, quantity } = await req.json();

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
    return NextResponse.json({ message: "Item removed" });
  }

  const item = await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
    include: { product: true },
  });

  return NextResponse.json({ item });
}

// DELETE - Supprimer du panier
export async function DELETE(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { itemId } = await req.json();

  await prisma.cartItem.delete({ where: { id: itemId } });

  return NextResponse.json({ message: "Item removed" });
}