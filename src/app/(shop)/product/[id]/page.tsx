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
    select: { name: true, shortDescription: true, images: true },
  });

  if (!product) {
    return { title: "Product Not Found - Cryptoelectro-au" };
  }

  return {
    title: `${product.name} - Buy with Crypto | Cryptoelectro-au`,
    description: product.shortDescription || `Buy ${product.name} with cryptocurrency. Fast shipping Australia-wide.`,
    openGraph: {
      title: `${product.name} - Cryptoelectro-au`,
      description: product.shortDescription || "",
      images: product.images?.[0]?.url ? [{ url: product.images[0].url }] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  return <ProductClient slug={id} />;
}