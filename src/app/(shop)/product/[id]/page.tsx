import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import ProductClient from "./ProductClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  const product = await prisma.product.findFirst({
    where: { OR: [{ slug: id }, { id }] },
    select: { 
      name: true, 
      shortDescription: true, 
      images: true,
      price: true,
      inStock: true,
      stockQuantity: true,
      metaTitle: true,
      metaDescription: true,
    },
  });

  if (!product) {
    return { title: "Product Not Found - Cryptoelectro-au" };
  }

  // Utiliser les champs SEO dédiés s'ils existent, sinon fallback
  const seoTitle = product.metaTitle || `${product.name} - Buy with credit card and Crypto | Cryptoelectro-au`;
  const seoDescription = product.metaDescription || product.shortDescription || `Buy ${product.name} with credit card and cryptocurrency. Fast shipping Australia-wide.`;
  
  // Info stock pour les métadonnées
  const stockInfo = product.inStock 
    ? product.stockQuantity > 0 
      ? `In Stock — ${product.stockQuantity} available` 
      : "In Stock"
    : "Out of Stock";

  return {
    title: seoTitle,
    description: seoDescription,
    openGraph: {
      title: `${product.name} - Cryptoelectro-au`,
      description: `${seoDescription} | ${stockInfo} | $${Number(product.price).toLocaleString()} AUD`,
      images: product.images?.[0]?.url ? [{ url: product.images[0].url, width: 1200, height: 630 }] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  return <ProductClient slug={id} />;
}