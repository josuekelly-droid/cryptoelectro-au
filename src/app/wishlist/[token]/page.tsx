"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductCard from "@/components/product/ProductCard";

export default function PublicWishlistPage() {
  const params = useParams();
  const token = params.token as string;
  const [wishlist, setWishlist] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/wishlist/public/${token}`)
      .then(r => r.json())
      .then(d => {
        setWishlist(d.wishlist);
        setProducts(d.products || []);
        setLoading(false);
      });
  }, [token]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-8"><p className="text-text-primary/50">Loading...</p></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Shared Wishlist" }]} />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-heading font-bold">
          {wishlist?.user?.firstName}&apos;s <span className="text-gradient">Wishlist</span>
        </h1>
        <p className="mt-2 text-text-primary/50">Help them get what they want — pick a gift from their wishlist!</p>
      </div>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      ) : (
        <div className="text-center py-16">
          <span className="text-4xl block mb-4">🎁</span>
          <p className="text-text-primary/50">This wishlist is empty or the products are no longer available.</p>
        </div>
      )}
    </div>
  );
}