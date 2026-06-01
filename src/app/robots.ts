import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXTAUTH_URL || "https://cryptoelectro-au.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/dashboard/", "/checkout", "/cart"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}