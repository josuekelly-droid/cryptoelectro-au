"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/product/ProductCard";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) { setLoading(false); return; }
    fetch(`/api/products?search=${encodeURIComponent(query)}&limit=50`)
      .then(r => r.json())
      .then(d => { setProducts(d.products || []); setLoading(false); });
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Search" }, { label: query }]} />
      <h1 className="text-3xl font-heading font-bold mb-2">Search Results</h1>
      <p className="text-text-primary/50 mb-8">Showing results for "{query}"</p>
      {loading ? (
        <p className="text-text-primary/50">Searching...</p>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-text-primary/50">No products found for "{query}".</p>
        </div>
      )}
    </div>
  );
}