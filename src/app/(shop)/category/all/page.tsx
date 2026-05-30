"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductCard from "@/components/product/ProductCard";
import CategoryFilters, { FilterState } from "@/components/product/CategoryFilters";

const PRODUCTS_PER_PAGE = 12;

export default function AllProductsPage() {
  const searchParams = useSearchParams();
  const brandParam = searchParams.get("brand") || "";

  const [filters, setFilters] = useState<FilterState>({
    brands: brandParam ? [brandParam] : [],
    priceRange: [0, 100000],
    sortBy: "featured",
    inStock: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/products?limit=100")
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.products || []);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (brandParam) {
      setFilters((prev) => ({
        ...prev,
        brands: [brandParam],
      }));
    }
  }, [brandParam]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filters.brands.length > 0) {
      result = result.filter((p) => {
        const brandName = (typeof p.brand === "object" ? p.brand.name : p.brand).toLowerCase();
        return filters.brands.some((b) => b.toLowerCase() === brandName);
      });
    }

    result = result.filter(
      (p) => Number(p.price) >= filters.priceRange[0] && Number(p.price) <= filters.priceRange[1]
    );

    if (filters.inStock) {
      result = result.filter((p) => p.inStock);
    }

    switch (filters.sortBy) {
      case "price-asc":
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-desc":
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "rating":
        result.sort((a, b) => Number(b.rating) - Number(a.rating));
        break;
      default:
        result.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return Number(b.rating) - Number(a.rating);
        });
    }

    return result;
  }, [products, filters]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-text-primary/50">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "All Products" }]} />

      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-heading font-bold">
          {brandParam
            ? `${brandParam.charAt(0).toUpperCase() + brandParam.slice(1)} Products`
            : "All Products"}
        </h1>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <CategoryFilters onFilterChange={setFilters} />
          </div>
        </aside>

        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-text-primary/50">
              Showing {paginatedProducts.length} of {filteredProducts.length} products
            </p>
          </div>

          {paginatedProducts.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {paginatedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 text-text-primary/20 mx-auto mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <h3 className="text-lg font-heading font-semibold mb-2">No Products Found</h3>
              <p className="text-text-primary/50">Try adjusting your filters.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="btn-secondary text-sm py-2 px-4 disabled:opacity-50">
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} onClick={() => setCurrentPage(page)} className={`w-10 h-10 rounded-md text-sm ${currentPage === page ? "bg-accent text-white" : "text-text-primary/60 hover:bg-secondary"}`}>
                  {page}
                </button>
              ))}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="btn-secondary text-sm py-2 px-4 disabled:opacity-50">
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}