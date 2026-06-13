import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import CareerClient from "./CareerClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const career = await prisma.career.findFirst({
    where: { OR: [{ slug: id }, { id }] },
    select: { title: true, department: true, location: true, type: true, description: true },
  });

  if (!career) {
    return { title: "Job Not Found - Cryptoelectro-au Careers" };
  }

  const description = `${career.title} at Cryptoelectro-au. ${career.department} · ${career.location} · ${career.type}. Apply now and join Australia's premium crypto electronics marketplace.`;

  return {
    title: `${career.title} - Careers at Cryptoelectro-au | Apply Now`,
    description,
    openGraph: {
      title: `${career.title} - Cryptoelectro-au Careers`,
      description: `Apply for ${career.title} at Cryptoelectro-au. ${career.department} · ${career.location}. Join our team today.`,
    },
  };
}

export default async function CareerDetailPage({ params }: Props) {
  const { id } = await params;
  return <CareerClient slug={id} />;
}