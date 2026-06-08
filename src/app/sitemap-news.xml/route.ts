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

function newsUrl(
  loc: string,
  title: string,
  publicationDate: string
) {
  return `
<url>
  <loc>${escapeXml(loc)}</loc>
  <news:news>
    <news:publication>
      <news:name>Cryptoelectro-au</news:name>
      <news:language>en</news:language>
    </news:publication>
    <news:publication_date>${publicationDate}</news:publication_date>
    <news:title>${escapeXml(title)}</news:title>
  </news:news>
</url>`;
}

export async function GET() {
  const baseUrl = SITE_URL;

  /**
   * GOOGLE NEWS RULE
   * Only articles from the last 48 hours are eligible
   */
  const twoDaysAgo = new Date();
  twoDaysAgo.setHours(twoDaysAgo.getHours() - 48);

  const blogPosts = await prisma.blogPost.findMany({
    where: {
      published: true,
      createdAt: {
        gte: twoDaysAgo, // ← Seulement les articles récents (< 48h)
      },
    },
    select: { slug: true, title: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  const now = new Date().toISOString();

  const blogUrls = blogPosts.map((b) =>
    newsUrl(
      `${baseUrl}/blog/${b.slug}`,
      b.title,
      new Date(b.createdAt).toISOString()
    )
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Google News sitemap generated: ${now} -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${blogUrls.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=1800, s-maxage=1800",
    },
  });
}