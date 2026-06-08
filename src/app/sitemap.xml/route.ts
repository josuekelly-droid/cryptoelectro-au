import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.NEXTAUTH_URL || "https://cryptoelectro-au.store";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function url(
  loc: string,
  lastmod: string,
  priority: string,
  changefreq: string
) {
  return `
<url>
  <loc>${escapeXml(loc)}</loc>
  <lastmod>${lastmod}</lastmod>
  <changefreq>${changefreq}</changefreq>
  <priority>${priority}</priority>
</url>`;
}

export async function GET() {
  const baseUrl = SITE_URL;

  const [products, categories, blogPosts, careers] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true, isFeatured: true },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.career.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const now = new Date().toISOString();

  /**
   * STATIC PAGES (stable SEO signals)
   */
  const staticPages = [
    { url: "/", priority: "1.0", changefreq: "daily" },
    { url: "/category/all", priority: "0.9", changefreq: "daily" },
    { url: "/blog", priority: "0.8", changefreq: "weekly" },
    { url: "/careers", priority: "0.7", changefreq: "weekly" },
    { url: "/contact", priority: "0.6", changefreq: "monthly" },
    { url: "/faq", priority: "0.6", changefreq: "monthly" },
    { url: "/shipping", priority: "0.5", changefreq: "monthly" },
    { url: "/returns", priority: "0.5", changefreq: "monthly" },
    { url: "/terms", priority: "0.3", changefreq: "yearly" },
    { url: "/privacy", priority: "0.3", changefreq: "yearly" },
    { url: "/about", priority: "0.7", changefreq: "monthly" },
    { url: "/affiliate-program", priority: "0.9", changefreq: "weekly" },
    { url: "/referral-program", priority: "0.9", changefreq: "weekly" },
    { url: "/search", priority: "0.5", changefreq: "monthly" },
    { url: "/warranty", priority: "0.5", changefreq: "monthly" },
  ];

  /**
   * PRODUCTS (dynamic SEO scoring)
   */
  const productUrls = products.map((p) => {
    const priority = p.isFeatured ? "1.0" : "0.8";

    return url(
      `${baseUrl}/product/${p.slug}`,
      new Date(p.updatedAt).toISOString(),
      priority,
      "weekly"
    );
  });

  /**
   * CATEGORIES
   */
  const categoryUrls = categories.map((c) =>
    url(
      `${baseUrl}/category/${c.slug}`,
      new Date(c.updatedAt).toISOString(),
      "0.9",
      "daily"
    )
  );

  /**
   * BLOG
   */
  const blogUrls = blogPosts.map((b) =>
    url(
      `${baseUrl}/blog/${b.slug}`,
      new Date(b.updatedAt).toISOString(),
      "0.7",
      "weekly"
    )
  );

  /**
   * CAREERS
   */
  const careerUrls = careers.map((c) =>
    url(
      `${baseUrl}/careers/${c.slug}`,
      new Date(c.updatedAt).toISOString(),
      "0.7",
      "weekly"
    )
  );

  /**
   * STATIC URLS
   */
  const staticUrls = staticPages.map((p) =>
    url(
      `${baseUrl}${p.url}`,
      now,
      p.priority,
      p.changefreq
    )
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- optimized sitemap generated: ${now} -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[
  ...staticUrls,
  ...categoryUrls,
  ...productUrls,
  ...blogUrls,
  ...careerUrls,
].join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",

      /**
       * IMPORTANT SEO OPTIMIZATION
       * 1 hour cache = better crawl efficiency than no-store
       */
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}