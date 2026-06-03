import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.NEXTAUTH_URL || "https://cryptoelectro-au.store";

export async function GET() {
  let products: { slug: string; updatedAt: Date }[] = [];
  let categories: { slug: string; updatedAt: Date }[] = [];
  let blogPosts: { slug: string; updatedAt: Date }[] = [];

  try { products = await prisma.product.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }); } catch {}
  try { categories = await prisma.category.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }); } catch {}
  try { blogPosts = await prisma.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }); } catch {}

  const today = new Date().toISOString();

  const staticPages = [
    { url: "/", priority: "1.0", changefreq: "daily" },
    { url: "/about", priority: "0.7", changefreq: "monthly" },
    { url: "/contact", priority: "0.7", changefreq: "monthly" },
    { url: "/faq", priority: "0.6", changefreq: "monthly" },
    { url: "/blog", priority: "0.8", changefreq: "weekly" },
    { url: "/affiliate-program", priority: "0.9", changefreq: "weekly" },
    { url: "/referral-program", priority: "0.9", changefreq: "weekly" },
    { url: "/careers", priority: "0.6", changefreq: "weekly" },
    { url: "/category/smartphones", priority: "0.9", changefreq: "daily" },
    { url: "/category/cameras", priority: "0.9", changefreq: "daily" },
    { url: "/category/computers", priority: "0.9", changefreq: "daily" },
    { url: "/category/home-appliances", priority: "0.9", changefreq: "daily" },
    { url: "/category/gaming-consoles", priority: "0.9", changefreq: "daily" },
    { url: "/category/all", priority: "0.8", changefreq: "weekly" },
    { url: "/search", priority: "0.5", changefreq: "monthly" },
    { url: "/shipping", priority: "0.5", changefreq: "monthly" },
    { url: "/returns", priority: "0.5", changefreq: "monthly" },
    { url: "/warranty", priority: "0.5", changefreq: "monthly" },
    { url: "/privacy", priority: "0.3", changefreq: "yearly" },
    { url: "/terms", priority: "0.3", changefreq: "yearly" },
    { url: "/cookies", priority: "0.3", changefreq: "yearly" },
    { url: "/forgot-password", priority: "0.3", changefreq: "yearly" },
    { url: "/login", priority: "0.5", changefreq: "yearly" },
    { url: "/register", priority: "0.5", changefreq: "yearly" },
  ];

  const urls = [
    ...staticPages.map((p) =>
      `<url><loc>${SITE_URL}${p.url}</loc><lastmod>${today}</lastmod><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>`
    ),
    ...categories.map((c) =>
      `<url><loc>${SITE_URL}/category/${c.slug}</loc><lastmod>${new Date(c.updatedAt).toISOString()}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>`
    ),
    ...products.map((p) =>
      `<url><loc>${SITE_URL}/product/${p.slug}</loc><lastmod>${new Date(p.updatedAt).toISOString()}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`
    ),
    ...blogPosts.map((b) =>
      `<url><loc>${SITE_URL}/blog/${b.slug}</loc><lastmod>${new Date(b.updatedAt).toISOString()}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}