"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useWishlist } from "@/lib/wishlist";
import { featuredProducts } from "@/lib/data";
import ProductCard from "@/components/product/ProductCard";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function WishlistPage() {
  const { items } = useWishlist();

  const wishlistProducts = featuredProducts.filter((p) =>
    items.includes(p.id)
  );

  if (wishlistProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Wishlist" },
          ]}
        />
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center py-16">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
            className="w-20 h-20 text-text-primary/20 mb-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
          <h2 className="text-2xl font-heading font-bold mb-2">
            Your Wishlist is Empty
          </h2>
          <p className="text-text-primary/50 mb-8 max-w-md">
            Save your favorite products here and come back to them anytime.
          </p>
          <Link href="/category/smartphones" className="btn-primary">
            Discover Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Wishlist" },
        ]}
      />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-heading font-bold">
            My Wishlist
          </h1>
          <p className="mt-1 text-text-primary/50">
            {wishlistProducts.length}{" "}
            {wishlistProducts.length === 1 ? "product" : "products"} saved
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {wishlistProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
  );
}