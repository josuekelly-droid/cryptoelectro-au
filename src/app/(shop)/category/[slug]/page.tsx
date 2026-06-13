import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import CategoryClient from "./CategoryClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const category = await prisma.category.findFirst({
    where: { OR: [{ slug }, { id: slug }] },
    select: { name: true, description: true },
  });

  if (!category) {
    return { title: "Category Not Found - Cryptoelectro-au" };
  }

  return {
    title: `${category.name} - Buy with Crypto | Cryptoelectro-au`,
    description: category.description || `Shop ${category.name} with credit card & cryptocurrency. Premium electronics, fast shipping Australia-wide.`,
    openGraph: {
      title: `${category.name} - Cryptoelectro-au`,
      description: category.description || `Explore our ${category.name} collection. Pay with crypto or card.`,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  return <CategoryClient slug={slug} />;
}