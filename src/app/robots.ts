import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXTAUTH_URL || "https://cryptoelectro-au.store";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/dashboard/", "/checkout", "/cart", "/api/nowpayments/", "/api/paypal/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}