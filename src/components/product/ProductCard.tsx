"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";

interface ProductCardProps {
  product: any;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [addedToCart, setAddedToCart] = useState(false);

  const brandName = typeof product.brand === "object" ? product.brand.name : product.brand;
  const brandLetter = brandName ? brandName.charAt(0) : "?";
  const productName = product.name || "Unknown Product";
  const productPrice = Number(product.price) || 0;
  const comparePrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const productRating = Number(product.rating) || 0;
  const productReviews = Number(product.reviewCount) || 0;
  const productImages = product.images || [];
  const mainImage = productImages.length > 0 ? productImages[0].url || productImages[0] : null;

  const discount = comparePrice
    ? Math.round(((comparePrice - productPrice) / comparePrice) * 100)
    : 0;

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, "Default");
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/product/${product.slug || product.id}`} className="card-hover block group">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gradient-to-br from-secondary-light to-secondary-dark">
          {mainImage ? (
            <img
              src={mainImage}
              alt={productName}
              className="absolute inset-0 w-full h-full object-cover z-10"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <span className="text-6xl font-heading font-bold text-text-primary/10">
                {brandLetter}
              </span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
            {product.isNew && (
              <span className="badge badge-accent text-xs font-semibold px-2 py-1">NEW</span>
            )}
            {discount > 0 && (
              <span className="badge badge-error text-xs font-semibold px-2 py-1">-{discount}%</span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300 z-20
                       ${inWishlist
                         ? "bg-error/20 text-error opacity-100"
                         : "bg-background/60 text-text-primary/70 hover:text-error hover:bg-background/80 opacity-0 group-hover:opacity-100"
                       }`}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            onClick={handleWishlist}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={inWishlist ? "currentColor" : "none"}
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          </button>

          {/* Quick Add to Cart */}
          <button
            className={`absolute bottom-3 right-3 p-3 rounded-full shadow-lg transition-all duration-300 z-20
                       opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0
                       ${addedToCart
                         ? "bg-success text-white shadow-success/30"
                         : "bg-accent text-white shadow-accent/30 hover:bg-accent-hover"
                       }`}
            aria-label="Add to cart"
            onClick={handleAddToCart}
          >
            {addedToCart ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            )}
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <span className="text-xs text-text-primary/50 font-body uppercase tracking-wider">
            {brandName}
          </span>
          <h3 className="mt-1 text-sm font-heading font-semibold text-text-primary line-clamp-2 group-hover:text-accent transition-colors">
            {productName}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={i < Math.floor(productRating) ? "currentColor" : "none"}
                  stroke="currentColor"
                  className={`w-3 h-3 ${i < Math.floor(productRating) ? "text-warning" : "text-text-primary/20"}`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-text-primary/50">({productReviews})</span>
          </div>

          {/* Price */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg font-heading font-bold text-text-primary">
              ${productPrice.toLocaleString()}
            </span>
            {comparePrice && (
              <span className="text-sm text-text-primary/40 line-through">
                ${comparePrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}