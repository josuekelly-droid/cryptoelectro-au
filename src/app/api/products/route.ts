import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "999999");
    const sort = searchParams.get("sort") || "featured";
    const search = searchParams.get("search") || "";
    const inStock = searchParams.get("inStock") === "true";
    const featured = searchParams.get("featured") === "true";

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      price: { gte: minPrice, lte: maxPrice },
    };

    if (category) where.category = { slug: category };
    if (brand) where.brand = { slug: brand };
    if (inStock) where.inStock = true;
    if (featured) where.isFeatured = true;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { brand: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = {};
    switch (sort) {
      case "price-asc": orderBy = { price: "asc" }; break;
      case "price-desc": orderBy = { price: "desc" }; break;
      case "newest": orderBy = { createdAt: "desc" }; break;
      case "rating": orderBy = { rating: "desc" }; break;
      default: orderBy = { isFeatured: "desc" };
    }

    const [products, total, activeDeals] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: { brand: true, category: true, images: { orderBy: { sortOrder: "asc" } }, colors: true, specs: true },
      }),
      prisma.product.count({ where }),
      prisma.deal.findMany({
        where: { isActive: true, expiresAt: { gt: new Date() } },
        select: { productId: true, dealPrice: true },
      }),
    ]);

    // Appliquer les prix deals aux produits
    const dealMap = new Map(activeDeals.map((d) => [d.productId, Number(d.dealPrice)]));
    const productsWithDeals = products.map((p) => {
      const dealPrice = dealMap.get(p.id);
      if (dealPrice) {
        return { ...p, compareAtPrice: p.price, price: dealPrice, isNew: true };
      }
      return p;
    });

    return NextResponse.json({
      products: productsWithDeals,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}