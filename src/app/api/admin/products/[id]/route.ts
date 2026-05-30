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

// GET - Récupérer un produit par ID (admin)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      brand: true,
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      colors: true,
      specs: true,
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ product });
}

// PUT - Mettre à jour un produit
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const data = await req.json();

  // Mise à jour du produit
  const product = await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      shortDescription: data.shortDescription,
      price: data.price,
      compareAtPrice: data.compareAtPrice || null,
      brandId: data.brandId,
      categoryId: data.categoryId,
      isFeatured: data.isFeatured,
      isNew: data.isNew,
      inStock: data.inStock,
      stockQuantity: data.stockQuantity,
    },
  });

  // Mettre à jour les specs (supprimer et recréer)
  if (data.specs) {
    await prisma.productSpec.deleteMany({ where: { productId: id } });
    await prisma.productSpec.createMany({
      data: data.specs.map((spec: { label: string; value: string }) => ({
        productId: id,
        label: spec.label,
        value: spec.value,
      })),
    });
  }

  // Mettre à jour les couleurs
  if (data.colors) {
    await prisma.productColor.deleteMany({ where: { productId: id } });
    await prisma.productColor.createMany({
      data: data.colors.map((color: { name: string; hexCode?: string; inStock?: boolean }) => ({
        productId: id,
        name: color.name,
        hexCode: color.hexCode,
        inStock: color.inStock ?? true,
      })),
    });
  }

  // Mettre à jour les images
  if (data.images) {
    await prisma.productImage.deleteMany({ where: { productId: id } });
    await prisma.productImage.createMany({
      data: data.images.map((url: string, index: number) => ({
        productId: id,
        url,
        isMain: index === 0,
        sortOrder: index,
      })),
    });
  }

  const updated = await prisma.product.findUnique({
    where: { id },
    include: {
      brand: true,
      category: true,
      images: true,
      colors: true,
      specs: true,
    },
  });

  return NextResponse.json({ product: updated });
}

// DELETE - Supprimer un produit
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;

  await prisma.product.delete({ where: { id } });

  return NextResponse.json({ message: "Product deleted" });
}