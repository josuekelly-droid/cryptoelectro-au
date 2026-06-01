import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.NEXTAUTH_URL || "https://cryptoelectro-au.vercel.app";

export async function GET() {
  let products: { slug: string }[] = [];
  let categories: { slug: string }[] = [];
  let blogPosts: { slug: string }[] = [];

  try { products = await prisma.product.findMany({ where: { isActive: true }, select: { slug: true } }); } catch {}
  try { categories = await prisma.category.findMany({ where: { isActive: true }, select: { slug: true } }); } catch {}
  try { blogPosts = await prisma.blogPost.findMany({ where: { published: true }, select: { slug: true } }); } catch {}

  const staticPages = [
    { url: "/", priority: "1.0", changefreq: "daily" },
    { url: "/about", priority: "0.7" },
    { url: "/contact", priority: "0.7" },
    { url: "/faq", priority: "0.6" },
    { url: "/blog", priority: "0.8" },
    { url: "/affiliate-program", priority: "0.9" },
    { url: "/referral-program", priority: "0.9" },
    { url: "/careers", priority: "0.6" },
    { url: "/shipping", priority: "0.5" },
    { url: "/returns", priority: "0.5" },
    { url: "/warranty", priority: "0.5" },
    { url: "/privacy", priority: "0.3" },
    { url: "/terms", priority: "0.3" },
    { url: "/cookies", priority: "0.3" },
  ];

  const urls = [
    ...staticPages.map((p) => `<url><loc>${SITE_URL}${p.url}</loc><changefreq>${p.changefreq || "monthly"}</changefreq><priority>${p.priority}</priority></url>`),
    ...categories.map((c) => `<url><loc>${SITE_URL}/category/${c.slug}</loc><changefreq>daily</changefreq><priority>0.9</priority></url>`),
    ...products.map((p) => `<url><loc>${SITE_URL}/product/${p.slug}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`),
    ...blogPosts.map((b) => `<url><loc>${SITE_URL}/blog/${b.slug}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}