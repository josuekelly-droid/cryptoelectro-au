"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductReviews from "@/components/product/ProductReviews";
import ProductCard from "@/components/product/ProductCard";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";

export default function ProductPage() {
  const params = useParams();
  const slug = params.id as string;
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("Default");
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");
  const [addedToCart, setAddedToCart] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setActiveImage(0);
    fetch(`/api/products?limit=100`)
      .then((r) => r.json())
      .then((d) => {
        const found = (d.products || []).find(
          (p: any) => p.slug === slug || p.id === slug
        );
        if (found) {
          setProduct(found);
          document.title = `${found.name} - Buy with Crypto | Cryptoelectro-au`;
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) {
            metaDesc.setAttribute("content", found.shortDescription || found.description?.substring(0, 160) || `Buy ${found.name} with cryptocurrency. Fast shipping Australia-wide.`);
          }
          const ogTitle = document.querySelector('meta[property="og:title"]');
          if (ogTitle) ogTitle.setAttribute("content", `${found.name} - Cryptoelectro-au`);
          const ogDesc = document.querySelector('meta[property="og:description"]');
          if (ogDesc) ogDesc.setAttribute("content", found.shortDescription || found.description?.substring(0, 160) || "");
          const ogImage = document.querySelector('meta[property="og:image"]');
          if (ogImage && found.images?.[0]?.url) ogImage.setAttribute("content", found.images[0].url);

          const catSlug = typeof found.category === "object" ? found.category.slug : found.category;
          fetch(`/api/products?category=${catSlug}&limit=4`)
            .then((r) => r.json())
            .then((rd) => {
              setRelatedProducts(
                (rd.products || []).filter((p: any) => p.id !== found.id).slice(0, 4)
              );
            });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  // Schema JSON-LD Produit (injecté proprement)
  useEffect(() => {
    if (!product) return;
    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.shortDescription || product.description,
      image: product.images?.[0]?.url || "",
      brand: { "@type": "Brand", name: brandName },
      sku: product.id,
      offers: {
        "@type": "Offer",
        price: Number(product.price) || 0,
        priceCurrency: "AUD",
        availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        url: `${window.location.origin}/product/${product.slug || product.id}`,
      },
      aggregateRating: (Number(product.reviewCount) || 0) > 0 ? {
        "@type": "AggregateRating",
        ratingValue: Number(product.rating) || 0,
        reviewCount: Number(product.reviewCount) || 0,
      } : undefined,
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, [product]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-text-primary/50">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-heading font-bold mb-4">Product Not Found</h2>
        <Link href="/category/smartphones" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  const brandName = typeof product.brand === "object" ? product.brand.name : product.brand;
  const categoryName = typeof product.category === "object" ? product.category.name : product.category;
  const categorySlug = typeof product.category === "object" ? product.category.slug : product.category;
  const productPrice = Number(product.price) || 0;
  const comparePrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const discount = comparePrice ? Math.round(((comparePrice - productPrice) / comparePrice) * 100) : 0;
  const images = product.images || [];
  const specs = product.specs || [];
  const colors = product.colors || [{ name: "Default" }];
  const inWishlist = isInWishlist(product.id);
  const productRating = Number(product.rating) || 0;
  const productReviews = Number(product.reviewCount) || 0;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { label: categoryName, href: `/category/${categorySlug}` },
          { label: brandName, href: `/category/${categorySlug}?brand=${brandName?.toLowerCase()}` },
          { label: product.name },
        ]}
      />

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mt-6">
        {/* Gallery */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="space-y-4 min-w-0 w-full">
          <div className="card overflow-hidden aspect-square relative">
            {images.length > 0 ? (
              <img src={images[activeImage]?.url || images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-secondary-light to-secondary-dark flex items-center justify-center">
                <span className="text-8xl font-heading font-bold text-text-primary/5">{brandName?.charAt(0) || "?"}</span>
              </div>
            )}
            {product.isNew && (
              <div className="absolute top-4 left-4 z-10"><span className="badge badge-accent text-xs font-semibold px-2 py-1">NEW</span></div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 -mr-4 sm:mr-0" style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
              {images.map((img: any, index: number) => (
                <button key={index} onClick={() => setActiveImage(index)} className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${activeImage === index ? "border-accent shadow-lg shadow-accent/20" : "border-transparent hover:border-secondary-light"}`}>
                  <img src={img.url || img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product Info */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="space-y-6">
          <div>
            <span className="text-sm text-accent font-body uppercase tracking-wider">{brandName}</span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold mt-1">{product.name}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={star <= Math.floor(productRating) ? "currentColor" : "none"} stroke="currentColor" className={`w-4 h-4 ${star <= Math.floor(productRating) ? "text-warning" : "text-text-primary/20"}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-text-primary font-medium">{productRating}</span>
            <span className="text-sm text-text-primary/40">({productReviews} reviews)</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-heading font-bold text-text-primary">${productPrice.toLocaleString()}</span>
            {comparePrice && (
              <>
                <span className="text-lg text-text-primary/40 line-through">${comparePrice.toLocaleString()}</span>
                <span className="badge badge-error text-sm">-{discount}%</span>
              </>
            )}
          </div>
                    {/* Stock Status */}
          <div className="flex items-center gap-2">
            {product.inStock && product.stockQuantity > 0 ? (
              <>
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm text-success">
                  In Stock — {product.stockQuantity} available
                </span>
              </>
            ) : product.inStock ? (
              <>
                <span className="w-2 h-2 rounded-full bg-success" />
                <span className="text-sm text-success">In Stock</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-error" />
                <span className="text-sm text-error">Out of Stock</span>
              </>
            )}
          </div>
          <p className="text-text-primary/60 leading-relaxed">{product.shortDescription || product.description}</p>
          {colors.length > 0 && (
            <div>
              <h4 className="text-sm font-heading font-semibold mb-3">Color: <span className="text-text-primary/60">{selectedColor}</span></h4>
              <div className="flex gap-3 flex-wrap">
                {colors.map((color: any) => {
                  const colorName = typeof color === "string" ? color : color.name;
                  return (
                    <button key={colorName} onClick={() => setSelectedColor(colorName)} className={`px-4 py-2 rounded-md text-sm border transition-all ${selectedColor === colorName ? "border-accent bg-accent/10 text-accent" : "border-secondary-light text-text-primary/60 hover:border-text-primary/30"}`}>{colorName}</button>
                  );
                })}
              </div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center border border-secondary-light rounded-md">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-secondary transition-colors"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" /></svg></button>
              <span className="w-12 text-center text-sm font-medium">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-secondary transition-colors"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg></button>
            </div>
            <button onClick={handleAddToCart} className={`btn-primary flex-1 text-base ${addedToCart ? "bg-success hover:bg-success" : ""}`}>{addedToCart ? "✓ Added!" : `Add to Cart - $${(productPrice * quantity).toLocaleString()}`}</button>
            <button onClick={() => toggleWishlist(product.id)} className={`btn-secondary p-3 ${inWishlist ? "text-error border-error" : ""}`} aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={inWishlist ? "currentColor" : "none"} strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
            </button>
          </div>
          <div className="card p-4 flex items-center gap-3"><span className="text-2xl">₿</span><div><p className="text-sm font-medium">Pay with Cryptocurrency</p><p className="text-xs text-text-primary/50">BTC, ETH, USDT & 100+ more accepted</p></div></div>
          <div className="space-y-3 pt-4 border-t border-secondary-light">
            <div className="flex items-center gap-3 text-sm"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-success"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg><span className="text-text-primary/60">Free shipping on orders over $500</span></div>
            <div className="flex items-center gap-3 text-sm"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-success"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182M16.5 19.5a2.25 2.25 0 0 0 2.25-2.25v-1.5M7.5 4.5a2.25 2.25 0 0 1 2.25 2.25v1.5" /></svg><span className="text-text-primary/60">30-day easy returns</span></div>
            <div className="flex items-center gap-3 text-sm"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-success"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg><span className="text-text-primary/60">2-year warranty included</span></div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="mt-16">
        <div className="border-b border-secondary-light">
          <div className="flex gap-8">
            {(["description", "specs", "reviews"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-4 text-sm font-heading font-semibold capitalize border-b-2 transition-colors ${activeTab === tab ? "border-accent text-accent" : "border-transparent text-text-primary/50 hover:text-text-primary"}`}>{tab === "specs" ? "Specifications" : tab}</button>
            ))}
          </div>
        </div>
        <div className="py-8">
          {activeTab === "description" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <p className="text-text-primary/70 leading-relaxed whitespace-pre-line">{product.description}</p>
            </motion.div>
          )}
          {activeTab === "specs" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              {specs.length > 0 ? (
                <div className="card overflow-hidden">
                  <table className="w-full">
                    <tbody>
                      {specs.map((spec: any, index: number) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-secondary-dark/50" : ""}>
                          <td className="px-6 py-3 text-sm font-medium text-text-primary w-1/3">{spec.label}</td>
                          <td className="px-6 py-3 text-sm text-text-primary/70">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (<p className="text-text-primary/50">No specifications available.</p>)}
            </motion.div>
          )}
          {activeTab === "reviews" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <ProductReviews productId={product.id} />
            </motion.div>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-heading font-bold mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p, index) => (<ProductCard key={p.id} product={p} index={index} />))}
          </div>
        </section>
      )}
    </div>
  );
}