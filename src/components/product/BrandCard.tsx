import Link from "next/link";
import { Brand } from "@/types";

interface BrandCardProps {
  brand: Brand;
}

export default function BrandCard({ brand }: BrandCardProps) {
  return (
    <Link
      href={`/category?brand=${brand.slug}`}
      className="card flex flex-col items-center justify-center p-6 gap-4 
                 group min-w-[140px]"
    >
      <div className="w-16 h-16 rounded-full bg-secondary-light flex items-center justify-center 
                      group-hover:bg-accent/10 transition-colors">
        <span className="text-2xl font-heading font-bold text-text-primary/40 group-hover:text-accent transition-colors">
          {brand.name.charAt(0)}
        </span>
      </div>
      <span className="text-sm font-body text-text-primary/70 group-hover:text-accent transition-colors text-center">
        {brand.name}
      </span>
    </Link>
  );
}