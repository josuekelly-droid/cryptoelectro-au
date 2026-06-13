import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { notifyGoogleIndexing } from "@/lib/indexing";

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "cryptoelectro-au-secret-key-change-in-production");

async function isAdmin(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.role === "ADMIN" || payload.role === "MANAGER";
  } catch { return false; }
}

export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const data = await req.json();
  const post = await prisma.blogPost.create({
    data: {
      title: data.title,
      slug: data.slug || data.title.toLowerCase().replace(/[&]/g, "and").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      excerpt: data.excerpt,
      content: data.content,
      category: data.category,
      image: data.image || "",
      author: data.author,
      published: data.published || false,
    },
  });

  // 📢 Notifier Google (avec await pour Vercel)
  try {
    const indexingResult = await notifyGoogleIndexing(`/blog/${post.slug}`);
    if (!indexingResult.success) {
      console.error("❌ Indexing failed:", indexingResult.error?.message || "Unknown error");
    }
  } catch (err: any) {
    console.error("❌ Indexing error:", err?.message || err);
  }
  
  return NextResponse.json({ post }, { status: 201 });
}