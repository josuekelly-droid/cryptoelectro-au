"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useWishlist } from "@/lib/wishlist";
import { featuredProducts } from "@/lib/data";
import ProductCard from "@/components/product/ProductCard";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function WishlistPage() {
  const { items } = useWishlist();
  const [shareUrl, setShareUrl] = useState("");
  const [shareMessage, setShareMessage] = useState("");

  const wishlistProducts = featuredProducts.filter((p) => items.includes(p.id));

  const handleShare = async () => {
    const res = await fetch("/api/wishlist/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productIds: items }),
    });
    const data = await res.json();
    if (data.url) {
      setShareUrl(data.url);
      navigator.clipboard.writeText(data.url);
      setShareMessage("Link copied! Share it with your friends and family.");
      setTimeout(() => setShareMessage(""), 4000);
    }
  };

  if (wishlistProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Wishlist" }]} />
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center py-16">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-20 h-20 text-text-primary/20 mb-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
          <h2 className="text-2xl font-heading font-bold mb-2">Your Wishlist is Empty</h2>
          <p className="text-text-primary/50 mb-8 max-w-md">Save your favorite products here and come back to them anytime.</p>
          <Link href="/category/smartphones" className="btn-primary">Discover Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Wishlist" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-heading font-bold">My Wishlist</h1>
          <p className="mt-1 text-text-primary/50">{wishlistProducts.length} {wishlistProducts.length === 1 ? "product" : "products"} saved</p>
        </div>
        <button onClick={handleShare} className="btn-secondary text-sm flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" /></svg>
          Share Wishlist
        </button>
      </div>

      {shareMessage && (
        <div className="bg-success/10 border border-success/30 text-success text-sm p-3 rounded-md mb-4">{shareMessage}</div>
      )}

      {shareUrl && (
        <div className="card p-4 mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <span className="text-sm font-medium flex-shrink-0">Public link:</span>
          <input type="text" value={shareUrl} readOnly className="input-field flex-1 text-sm" />
          <button onClick={() => { navigator.clipboard.writeText(shareUrl); setShareMessage("Link copied!"); setTimeout(() => setShareMessage(""), 3000); }} className="btn-primary text-sm whitespace-nowrap">Copy Link</button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {wishlistProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
  );
}