import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const shared = await prisma.sharedWishlist.findUnique({
    where: { shareToken: token },
    include: { user: { select: { firstName: true, lastName: true } } },
  });

  if (!shared) return NextResponse.json({ error: "Wishlist not found" }, { status: 404 });

  const productIds = JSON.parse(shared.productIds || "[]");

  if (productIds.length === 0) {
    return NextResponse.json({ wishlist: shared, products: [] });
  }

  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
    include: {
      brand: true,
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      colors: true,
      specs: true,
    },
  });

  return NextResponse.json({ wishlist: shared, products });
}