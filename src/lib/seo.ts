export function generateProductSchema(product: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription || product.description,
    image: product.images?.[0]?.url || "",
    brand: { "@type": "Brand", name: typeof product.brand === "object" ? product.brand.name : product.brand },
    offers: {
      "@type": "Offer",
      price: Number(product.price),
      priceCurrency: "AUD",
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${process.env.NEXTAUTH_URL}/product/${product.slug}`,
    },
  };
}

export function generateBreadcrumbSchema(items: { label: string; href?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? `${process.env.NEXTAUTH_URL}${item.href}` : undefined,
    })),
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Cryptoelectro-au",
    url: process.env.NEXTAUTH_URL,
    description: "Australia's premium electronics marketplace with cryptocurrency and Credit cards payments.",
    sameAs: ["https://twitter.com/cryptoelectro-au", "https://www.instagram.com/cryptoelectro__au", "https://www.facebook.com/share/1D58ZZsbhk/"],
  };
}