import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [product, activeDeal] = await Promise.all([
      prisma.product.findUnique({
        where: { id },
        include: {
          brand: true,
          category: true,
          images: { orderBy: { sortOrder: "asc" } },
          colors: true,
          specs: true,
          reviews: {
            include: { user: { select: { id: true, firstName: true, lastName: true } } },
            orderBy: { createdAt: "desc" },
          },
        },
      }),
      prisma.deal.findFirst({
        where: { productId: id, isActive: true, expiresAt: { gt: new Date() } },
        select: { dealPrice: true },
      }),
    ]);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Appliquer le prix deal si actif
    if (activeDeal) {
      const productWithDeal = {
        ...product,
        compareAtPrice: product.price,
        price: activeDeal.dealPrice,
      };
      return NextResponse.json({ product: productWithDeal });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Get product error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}