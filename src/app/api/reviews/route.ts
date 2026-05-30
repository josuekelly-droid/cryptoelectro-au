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

// GET - Récupérer les reviews d'un produit
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ error: "productId required" }, { status: 400 });
  }

  const reviews = await prisma.review.findMany({
    where: { productId },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ reviews });
}

// POST - Créer une review
export async function POST(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { productId, rating, title, content } = await req.json();

  if (!productId || !rating || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: {
      productId,
      userId,
      rating: Math.min(5, Math.max(1, rating)),
      title: title || "",
      content,
      isVerified: true,
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  // Mettre à jour la note moyenne du produit
  const allReviews = await prisma.review.findMany({
    where: { productId },
    select: { rating: true },
  });

  const avgRating =
    allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

  await prisma.product.update({
    where: { id: productId },
    data: {
      rating: avgRating,
      reviewCount: allReviews.length,
    },
  });

  return NextResponse.json({ review }, { status: 201 });
}