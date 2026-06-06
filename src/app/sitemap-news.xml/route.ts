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

export async function GET() {
  let blogPosts: { slug: string; title: string; createdAt: Date }[] = [];

  try {
    blogPosts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, title: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {}

  const urls = blogPosts.map((b) =>
    `<url>
      <loc>${escapeXml(SITE_URL)}/blog/${escapeXml(b.slug)}</loc>
      <news:news>
        <news:publication>
          <news:name>Cryptoelectro-au</news:name>
          <news:language>en</news:language>
        </news:publication>
        <news:publication_date>${new Date(b.createdAt).toISOString()}</news:publication_date>
        <news:title>${escapeXml(b.title)}</news:title>
      </news:news>
    </url>`
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}