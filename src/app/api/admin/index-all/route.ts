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
    return payload.role === "ADMIN";
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const urls: { url: string; type: string }[] = [];

  // 1. Récupérer toutes les URLs
  const [products, categories, blogPosts, careers] = await Promise.all([
    prisma.product.findMany({ where: { isActive: true }, select: { slug: true } }),
    prisma.category.findMany({ where: { isActive: true }, select: { slug: true } }),
    prisma.blogPost.findMany({ where: { published: true }, select: { slug: true } }),
    prisma.career.findMany({ where: { isActive: true }, select: { slug: true } }),
  ]);

  const staticPages = [
    "/", "/category/all", "/blog", "/careers", "/contact", "/faq",
    "/shipping", "/testimonials", "/returns", "/terms", "/privacy",
    "/about", "/affiliate-program", "/referral-program", "/search", "/warranty",
  ];

  staticPages.forEach((slug) => urls.push({ url: slug, type: "static" }));
  categories.forEach((c) => urls.push({ url: `/category/${c.slug}`, type: "category" }));
  products.forEach((p) => urls.push({ url: `/product/${p.slug}`, type: "product" }));
  blogPosts.forEach((b) => urls.push({ url: `/blog/${b.slug}`, type: "blog" }));
  careers.forEach((c) => urls.push({ url: `/careers/${c.slug}`, type: "career" }));

  // 2. Créer les logs en "pending"
  await prisma.indexingLog.createMany({
    data: urls.map((u) => ({ url: u.url, type: u.type, status: "pending" })),
  });

  console.log(`🚀 Starting indexing for ${urls.length} URLs`);

  // 3. Indexer chaque URL (bloquant cette fois)
  for (const item of urls) {
    try {
      console.log(`📤 Indexing: ${item.url}`);
      const result = await notifyGoogleIndexing(item.url);
      
      await prisma.indexingLog.updateMany({
        where: { url: item.url, status: "pending" },
        data: {
          status: result.success ? "success" : "error",
          error: result.success ? null : result.error?.message || "Unknown error",
        },
      });
      
      console.log(`${result.success ? "✅" : "❌"} ${item.url}`);
    } catch (err: any) {
      console.error(`❌ ${item.url}:`, err?.message);
      await prisma.indexingLog.updateMany({
        where: { url: item.url, status: "pending" },
        data: { status: "error", error: err?.message || "Failed" },
      });
    }
    
    // De 1000ms → 500ms 
await new Promise((resolve) => setTimeout(resolve, 500));

  }

  console.log(`✅ Indexing complete: ${urls.length} URLs`);

  return NextResponse.json({
    message: `Indexing complete for ${urls.length} URLs`,
    total: urls.length,
  });
}