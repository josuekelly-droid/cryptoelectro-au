"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductCard from "@/components/product/ProductCard";

export default function DealsPage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Flash Deals - Cryptoelectro-au | Limited Time Offers";
    fetch("/api/deals").then(r => r.json()).then(d => { setDeals(d.deals || []); setLoading(false); });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Flash Deals" }]} />
      <div className="text-center mb-12">
        <span className="badge badge-error text-sm mb-4 inline-block">⚡ Limited Time</span>
        <h1 className="text-3xl lg:text-4xl font-heading font-bold">Flash <span className="text-gradient">Deals</span></h1>
        <p className="mt-4 text-text-primary/50">Grab these deals before they expire!</p>
      </div>
      {loading ? <p className="text-center text-text-primary/50">Loading deals...</p> : deals.length === 0 ? <div className="text-center py-16"><p className="text-text-primary/50">No active deals. Check back soon!</p></div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {deals.map((deal: any) => {
            const product = { ...deal.product, price: Number(deal.dealPrice), compareAtPrice: Number(deal.product.price), isNew: true };
            return <ProductCard key={deal.id} product={product} />;
          })}
        </div>
      )}
    </div>
  );
}