import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  // Si un ID est fourni, retourner un seul article (publié ou non)
  if (id) {
    const post = await prisma.blogPost.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });
    return NextResponse.json({ post });
  }

  // Sinon, retourner tous les articles publiés
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ posts });
}