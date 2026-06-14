const SITE_URL = process.env.NEXTAUTH_URL || "https://cryptoelectro-au.store";

// ============ TYPES ============
interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: number | string;
  compareAtPrice?: number | string | null;
  inStock: boolean;
  stockQuantity?: number;
  rating?: number;
  reviewCount?: number;
  images?: { url: string }[];
  brand?: { name: string } | string;
  category?: { name: string } | string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  updatedAt?: string;
  createdAt?: string;
}

// ============ PRODUCT SCHEMA (ENRICHI) ============
export function generateProductSchema(product: Product) {
  const brandName = typeof product.brand === "object" ? product.brand.name : product.brand;
  const price = Number(product.price);
  const comparePrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const availability = product.inStock
    ? product.stockQuantity && product.stockQuantity > 0
      ? "https://schema.org/InStock"
      : "https://schema.org/InStock"
    : "https://schema.org/OutOfStock";
  const mainImage = product.images?.[0]?.url || "";

  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription || product.description || "",
    image: mainImage,
    sku: product.id,
    brand: { "@type": "Brand", name: brandName },
    offers: {
      "@type": "Offer",
      price: price,
      priceCurrency: "AUD",
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
      availability: availability,
      url: `${SITE_URL}/product/${product.slug}`,
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Cryptoelectro-au",
      },
    },
  };

  // Prix barré (promotion)
  if (comparePrice && comparePrice > price) {
    schema.offers.priceSpecification = {
      "@type": "PriceSpecification",
      price: price,
      priceCurrency: "AUD",
    };
    schema.offers.potentialAction = {
      "@type": "BuyAction",
      target: `${SITE_URL}/product/${product.slug}`,
    };
  }

  // Stock quantity
  if (product.stockQuantity !== undefined && product.stockQuantity !== null) {
    schema.offers.inventoryLevel = {
      "@type": "QuantitativeValue",
      value: product.stockQuantity,
    };
  }

  // Aggregate rating
  if (product.rating && product.reviewCount && product.reviewCount > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(product.rating),
      reviewCount: Number(product.reviewCount),
      bestRating: "5",
    };
  }

  // Images supplémentaires
  if (product.images && product.images.length > 1) {
    schema.image = product.images.map((img: { url: string }) => img.url);
  }

  return schema;
}

// ============ BREADCRUMB SCHEMA ============
export function generateBreadcrumbSchema(items: { label: string; href?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? `${SITE_URL}${item.href}` : undefined,
    })),
  };
}

// ============ ORGANIZATION SCHEMA (ENRICHI) ============
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Cryptoelectro-au",
    url: SITE_URL,
    description: "Australia's premium electronics marketplace with cryptocurrency and credit card payments. Shop smartphones, laptops, cameras, and home appliances with Bitcoin, Ethereum, USDT, and 100+ cryptocurrencies.",
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/og-image.png`,
    email: "cryptoelectroau@gmail.com",
    telephone: "+61 02 9433 9429",
    address: {
      "@type": "PostalAddress",
      addressCountry: "AU",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+61 02 9433 9429",
      contactType: "customer service",
      areaServed: "AU",
      availableLanguage: "English",
    },
    sameAs: [
      "https://twitter.com/cryptoelectroau",
      "https://www.instagram.com/cryptoelectro__au",
      "https://www.facebook.com/share/1D58ZZsbhk/",
    ],
    foundingDate: "2026",
  };
}

// ============ WEBSITE SCHEMA ============
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Cryptoelectro-au",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

// ============ FAQ SCHEMA ============
export function generateFaqSchema(questions: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.a,
      },
    })),
  };
}

// ============ ARTICLE SCHEMA ============
export function generateArticleSchema(article: {
  title: string;
  excerpt?: string;
  image?: string;
  author?: string;
  createdAt: string;
  updatedAt?: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt || article.title,
    image: article.image || `${SITE_URL}/og-image.png`,
    author: {
      "@type": "Person",
      name: article.author || "Cryptoelectro Team",
    },
    publisher: {
      "@type": "Organization",
      name: "Cryptoelectro-au",
      url: SITE_URL,
    },
    datePublished: article.createdAt,
    dateModified: article.updatedAt || article.createdAt,
    mainEntityOfPage: `${SITE_URL}/blog/${article.slug}`,
  };
}

// ============ JOB POSTING SCHEMA ============
export function generateJobPostingSchema(job: {
  title: string;
  description: string;
  department?: string;
  location?: string;
  type?: string;
  salary?: string;
  createdAt: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.createdAt,
    validThrough: new Date(new Date(job.createdAt).getTime() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    employmentType: job.type?.replace("-", "_").toUpperCase() || "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: "Cryptoelectro-au",
      sameAs: SITE_URL,
      email: "cryptoelectroau@gmail.com",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location || "Sydney",
        addressRegion: "NSW",
        addressCountry: "AU",
        postalCode: "2000",
        streetAddress: "123 George Street",
      },
    },
    baseSalary: job.salary
      ? {
          "@type": "MonetaryAmount",
          currency: "AUD",
          value: { "@type": "QuantitativeValue", value: job.salary, unitText: "YEAR" },
        }
      : undefined,
    applicationContact: {
      "@type": "ContactPoint",
      email: "cryptoelectroau@gmail.com",
      contactType: "Apply",
    },
  };
}

// ============ AGGREGATE RATING SCHEMA ============
export function generateAggregateRatingSchema(reviews: { rating: number; content: string; author: string; date: string }[]) {
  if (!reviews || reviews.length === 0) return null;

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Cryptoelectro-au",
    url: SITE_URL,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: avgRating.toFixed(1),
      reviewCount: reviews.length,
      bestRating: "5",
    },
    review: reviews.slice(0, 2000).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author },
      datePublished: r.date,
      reviewBody: r.content,
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: "5",
      },
    })),
  };
}

// ============ SEO METADATA HELPER ============
export function generateProductMetadata(product: Product) {
  const brandName = typeof product.brand === "object" ? product.brand.name : product.brand;
  const categoryName = typeof product.category === "object" ? product.category.name : product.category;
  const price = Number(product.price);
  const stockInfo = product.inStock
    ? product.stockQuantity && product.stockQuantity > 0
      ? `In Stock — ${product.stockQuantity} available`
      : "In Stock"
    : "Out of Stock";

  const title = product.metaTitle || `${product.name} - Buy with Crypto | Cryptoelectro-au`;
  const description = product.metaDescription || product.shortDescription || `Buy ${product.name} from ${brandName} with cryptocurrency and credit card. ${stockInfo}. Fast shipping Australia-wide.`;

  return {
    title,
    description,
    keywords: `${product.name}, ${brandName}, ${categoryName}, buy with crypto, cryptocurrency, Bitcoin, Ethereum, Australia`,
    openGraph: {
      title: `${product.name} - ${brandName} | Cryptoelectro-au`,
      description: `${description} | $${price.toLocaleString()} AUD | ${stockInfo}`,
      images: product.images?.[0]?.url ? [{ url: product.images[0].url, width: 1200, height: 630, alt: product.name }] : [],
      type: "product",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} - Cryptoelectro-au`,
      description: description.substring(0, 200),
    },
    alternates: {
      canonical: `${SITE_URL}/product/${product.slug}`,
    },
  };
}

// ============ CATEGORY METADATA HELPER ============
export function generateCategoryMetadata(category: { name: string; description?: string; slug: string }) {
  return {
    title: `${category.name} - Buy with Crypto | Cryptoelectro-au`,
    description: category.description || `Shop ${category.name} with cryptocurrency and credit card. Premium electronics, fast shipping Australia-wide.`,
    openGraph: {
      title: `${category.name} - Cryptoelectro-au`,
      description: category.description || `Explore our ${category.name} collection. Pay with crypto or card.`,
    },
    alternates: {
      canonical: `${SITE_URL}/category/${category.slug}`,
    },
  };
}

// ============ BLOG METADATA HELPER ============
export function generateBlogMetadata(post: { title: string; excerpt?: string; image?: string; slug: string }) {
  return {
    title: `${post.title} - Cryptoelectro-au Blog`,
    description: post.excerpt || post.title,
    openGraph: {
      title: `${post.title} - Cryptoelectro-au`,
      description: post.excerpt || "",
      images: post.image ? [{ url: post.image }] : [],
      type: "article",
    },
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`,
    },
  };
}