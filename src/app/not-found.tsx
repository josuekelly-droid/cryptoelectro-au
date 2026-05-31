import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found | Cryptoelectro-au",
  description: "The page you are looking for does not exist.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <span className="text-8xl font-heading font-bold text-text-primary/10 block mb-4">
          404
        </span>
        <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
          Page Not Found
        </h1>
        <p className="text-text-primary/50 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Try searching for a product or browse our categories.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
          <Link href="/category/smartphones" className="btn-secondary">
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}