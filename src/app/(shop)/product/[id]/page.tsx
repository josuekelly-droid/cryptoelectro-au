import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import ProductClient from "./ProductClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  const product = await prisma.product.findFirst({
    where: { OR: [{ slug: id }, { id }] },
    select: { name: true, shortDescription: true, images: true },
  });

  if (!product) return { title: "Product Not Found - Cryptoelectro-au" };

  return {
    title: `${product.name} - Buy with Crypto and credit cards | Cryptoelectro-au`,
    description: product.shortDescription || `Buy ${product.name} with cryptocurrency or credit cards. Fast shipping Australia-wide.`,
    openGraph: {
      title: `${product.name} - Cryptoelectro-au`,
      images: product.images?.[0]?.url ? [{ url: product.images[0].url }] : [],
    },
  };
}

export default function ProductPage() {
  return <ProductClient />;
}