import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.NEXTAUTH_URL || "https://cryptoelectro.au";

export default async function GET() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  const blogPosts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  const staticPages = [
    { url: "/", priority: "1.0", changefreq: "daily" },
    { url: "/about", priority: "0.7", changefreq: "monthly" },
    { url: "/contact", priority: "0.7", changefreq: "monthly" },
    { url: "/faq", priority: "0.6", changefreq: "monthly" },
    { url: "/blog", priority: "0.8", changefreq: "weekly" },
    { url: "/affiliate-program", priority: "0.9", changefreq: "weekly" },
    { url: "/careers", priority: "0.6", changefreq: "weekly" },
    { url: "/shipping", priority: "0.5", changefreq: "monthly" },
    { url: "/returns", priority: "0.5", changefreq: "monthly" },
    { url: "/warranty", priority: "0.5", changefreq: "monthly" },
    { url: "/privacy", priority: "0.3", changefreq: "yearly" },
    { url: "/terms", priority: "0.3", changefreq: "yearly" },
    { url: "/cookies", priority: "0.3", changefreq: "yearly" },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (page) => `
    <url>
      <loc>${SITE_URL}${page.url}</loc>
      <changefreq>${page.changefreq}</changefreq>
      <priority>${page.priority}</priority>
    </url>`
    )
    .join("")}
  ${categories
    .map(
      (cat) => `
    <url>
      <loc>${SITE_URL}/category/${cat.slug}</loc>
      <changefreq>daily</changefreq>
      <priority>0.9</priority>
      <lastmod>${new Date(cat.updatedAt).toISOString()}</lastmod>
    </url>`
    )
    .join("")}
  ${products
    .map(
      (p) => `
    <url>
      <loc>${SITE_URL}/product/${p.slug}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
      <lastmod>${new Date(p.updatedAt).toISOString()}</lastmod>
    </url>`
    )
    .join("")}
  ${blogPosts
    .map(
      (post) => `
    <url>
      <loc>${SITE_URL}/blog/${post.slug}</loc>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
      <lastmod>${new Date(post.updatedAt).toISOString()}</lastmod>
    </url>`
    )
    .join("")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}