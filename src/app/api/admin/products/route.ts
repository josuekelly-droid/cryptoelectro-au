import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { notifyGoogleIndexing } from "@/lib/indexing";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "cryptoelectro-au-secret-key-change-in-production"
);

async function isAdmin(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.role === "ADMIN" || payload.role === "MANAGER";
  } catch {
    return false;
  }
}

// GET - Tous les produits (admin)
export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const products = await prisma.product.findMany({
    include: {
      brand: true,
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      colors: true,
      specs: true,
      _count: { select: { orderItems: true, reviews: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ products });
}

// POST - Créer un produit
export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const data = await req.json();

  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug || data.name.toLowerCase().replace(/\s+/g, "-"),
      description: data.description,
      shortDescription: data.shortDescription,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      price: data.price,
      compareAtPrice: data.compareAtPrice || null,
      brandId: data.brandId,
      categoryId: data.categoryId,
      isFeatured: data.isFeatured || false,
      isNew: data.isNew || false,
      inStock: data.inStock ?? true,
      stockQuantity: data.stockQuantity || 0,
      specs: {
        create: data.specs || [],
      },
      colors: {
        create: data.colors || [],
      },
      images: {
        create: (data.images || []).map((url: string, index: number) => ({
          url,
          isMain: index === 0,
          sortOrder: index,
        })),
      },
    },
    include: {
      brand: true,
      category: true,
      images: true,
      colors: true,
      specs: true,
    },
  });

  notifyGoogleIndexing(`/product/${product.slug}`)
  .then((res) => {
    if (!res.success) {
      console.error("Indexing failed:", product.slug);
    }
  })
  .catch((err) => {
    console.error("Indexing error:", err);
  });

  return NextResponse.json({ product }, { status: 201 });
}