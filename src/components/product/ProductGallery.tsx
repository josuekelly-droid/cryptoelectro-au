"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Use provided images or generate placeholders
  const displayImages =
    images.length > 0
      ? images
      : Array.from({ length: 4 }, (_, i) => `/placeholder-${i + 1}.webp`);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        className="card overflow-hidden aspect-square relative cursor-zoom-in"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-light to-secondary-dark flex items-center justify-center">
          <span className="text-8xl font-heading font-bold text-text-primary/5">
            {productName.charAt(0)}
          </span>
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 z-10">
          <span className="badge badge-accent text-xs">PREMIUM</span>
        </div>

        {/* Zoom indicator */}
        <div className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/60 backdrop-blur-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 text-text-primary/70"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6"
            />
          </svg>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {displayImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
              selectedImage === index
                ? "border-accent shadow-lg shadow-accent/20"
                : "border-transparent hover:border-secondary-light"
            }`}
          >
            <div className="w-full h-full bg-secondary-light flex items-center justify-center">
              <span className="text-2xl font-heading font-bold text-text-primary/20">
                {index + 1}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}