import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import BlogClient from "./BlogClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const post = await prisma.blogPost.findFirst({
    where: { OR: [{ slug: id }, { id }] },
    select: { title: true, excerpt: true, image: true },
  });

  if (!post) return { title: "Article Not Found" };

  return {
    title: `${post.title} - Cryptoelectro-au Blog`,
    description: post.excerpt || post.title,
    openGraph: {
      title: `${post.title} - Cryptoelectro-au`,
      description: post.excerpt || "",
      images: post.image ? [{ url: post.image }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { id } = await params;
  return <BlogClient slug={id} />;
}