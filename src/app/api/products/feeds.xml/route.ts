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
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      images: { where: { isMain: true }, take: 3 },
      brand: { select: { name: true } },
    },
  });

  const items = products.map((p) => `
    <item>
      <g:id>${p.id}</g:id>
      <g:title>${escapeXml(p.name)}</g:title>
      <g:description>${escapeXml((p.shortDescription || p.description || "").substring(0, 5000))}</g:description>
      <g:link>${escapeXml(`${SITE_URL}/product/${p.slug}`)}</g:link>
      <g:image_link>${escapeXml(p.images?.[0]?.url || "")}</g:image_link>
      <g:availability>${p.inStock ? "in_stock" : "out_of_stock"}</g:availability>
      <g:price>${Number(p.price).toFixed(2)} AUD</g:price>
      <g:brand>${escapeXml(p.brand?.name || "Cryptoelectro")}</g:brand>
      <g:condition>new</g:condition>
    </item>`).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Cryptoelectro-au</title>
    <link>${SITE_URL}</link>
    <description>Australia's premium electronics marketplace</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}