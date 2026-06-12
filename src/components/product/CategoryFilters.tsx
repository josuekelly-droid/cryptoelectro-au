"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CategoryFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  brands: string[];
  priceRange: [number, number];
  sortBy: string;
  inStock: boolean;
}

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
  { value: "rating", label: "Highest Rated" },
];

export default function CategoryFilters({ onFilterChange }: CategoryFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState("featured");
  const [inStock, setInStock] = useState(false);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  // 🔄 Charger les marques depuis la base de données
  useEffect(() => {
    fetch("/api/brands")
      .then((r) => r.json())
      .then((d) => {
        const brands = (d.brands || []).map((b: any) => b.name);
        setAvailableBrands(brands);
      })
      .catch(() => setAvailableBrands([]));
  }, []);

  const toggleBrand = (brand: string) => {
    const updated = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(updated);
    onFilterChange({ brands: updated, priceRange, sortBy, inStock });
  };

  const handlePriceChange = (index: number, value: number) => {
    const updated: [number, number] = [...priceRange] as [number, number];
    updated[index] = value;
    setPriceRange(updated);
    onFilterChange({ brands: selectedBrands, priceRange: updated, sortBy, inStock });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    onFilterChange({ brands: selectedBrands, priceRange, sortBy: value, inStock });
  };

  const handleStockToggle = () => {
    setInStock(!inStock);
    onFilterChange({ brands: selectedBrands, priceRange, sortBy, inStock: !inStock });
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setPriceRange([0, 10000]);
    setSortBy("featured");
    setInStock(false);
    onFilterChange({ brands: [], priceRange: [0, 10000], sortBy: "featured", inStock: false });
  };

  const hasActiveFilters =
    selectedBrands.length > 0 || priceRange[0] > 0 || priceRange[1] < 10000 || inStock || sortBy !== "featured";

  return (
    <div className="space-y-4">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden flex items-center justify-between">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn-secondary text-sm flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
            />
          </svg>
          Filters
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-accent" />
          )}
        </button>

        {/* Sort Select Mobile */}
        <select
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
          className="input-field w-auto py-2 text-sm"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {(isOpen || typeof window !== "undefined" && window.innerWidth >= 1024) && (
          <motion.div
            initial={false}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`space-y-6 ${isOpen ? "block" : "hidden lg:block"}`}
          >
            {/* Sort - Desktop */}
            <div className="hidden lg:block">
              <h4 className="text-sm font-heading font-semibold text-text-primary mb-3">
                Sort By
              </h4>
              <div className="space-y-2">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSortChange(opt.value)}
                    className={`block w-full text-left text-sm py-1.5 px-2 rounded transition-colors ${
                      sortBy === opt.value
                        ? "text-accent bg-accent/10"
                        : "text-text-primary/60 hover:text-text-primary"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div>
              <h4 className="text-sm font-heading font-semibold text-text-primary mb-3">
                Brands
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {availableBrands.map((brand) => (
                  <label
                    key={brand}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="w-4 h-4 rounded border-secondary-light bg-secondary 
                                 text-accent focus:ring-accent focus:ring-offset-0"
                    />
                    <span className="text-sm text-text-primary/60 group-hover:text-text-primary transition-colors">
                      {brand}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="text-sm font-heading font-semibold text-text-primary mb-3">
                Price Range
              </h4>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                    placeholder="Min"
                    className="input-field py-2 text-sm"
                  />
                </div>
                <span className="text-text-primary/30">-</span>
                <div className="flex-1">
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                    placeholder="Max"
                    className="input-field py-2 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* In Stock */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={handleStockToggle}
                  className="w-4 h-4 rounded border-secondary-light bg-secondary 
                             text-accent focus:ring-accent focus:ring-offset-0"
                />
                <span className="text-sm text-text-primary/60 group-hover:text-text-primary transition-colors">
                  In Stock Only
                </span>
              </label>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-error hover:text-error/80 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}