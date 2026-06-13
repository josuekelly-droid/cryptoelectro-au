"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/product/ProductCard";
import CategoryCard from "@/components/product/CategoryCard";

// ============ AVIS PAR DÉFAUT ============
const defaultReviews = [
  { name: "Marcus L.", initials: "ML", role: "Tech Reviewer", location: "Melbourne, AU", rating: 5, content: "Best place to buy electronics with crypto. Ordered an iPhone and MacBook, both arrived in 3 days. The TRX payment was seamless. Highly recommend!" },
  { name: "Priya K.", initials: "PK", role: "Verified Buyer", location: "Sydney, AU", rating: 5, content: "I was skeptical about paying with Bitcoin, but the process was smooth and my Samsung Galaxy arrived exactly as described. Will shop again." },
  { name: "Alex T.", initials: "AT", role: "Crypto Enthusiast", location: "Brisbane, AU", rating: 5, content: "Finally a marketplace that understands crypto! Bought a gaming console with USDT. The 30-minute payment window is fair and the tracking updates were great." },
  { name: "Sophie R.", initials: "SR", role: "Verified Buyer", location: "Auckland, NZ", rating: 4, content: "Great selection of premium electronics. Shipping to NZ took 8 days but the product was perfect. Would love faster international shipping options." },
  { name: "James W.", initials: "JW", role: "Tech YouTuber", location: "Perth, AU", rating: 5, content: "I've made 4 purchases now. Every transaction was smooth, crypto payments confirmed quickly, and products are 100% genuine. My go-to electronics store." },
  { name: "Emily C.", initials: "EC", role: "Verified Buyer", location: "Gold Coast, AU", rating: 5, content: "Ordered AirPods and a MacBook. Paid with ETH, got confirmation in 15 minutes, delivered in 4 days. The loyalty program is a nice bonus too!" },
  { name: "David K.", initials: "DK", role: "Verified Buyer", location: "Adelaide, AU", rating: 5, content: "Replaced my entire home office setup through Cryptoelectro. MacBook, monitor, keyboard — all paid with crypto. Saved hundreds compared to retail. Absolutely recommend." },
  { name: "Sarah M.", initials: "SM", role: "Small Business Owner", location: "Canberra, AU", rating: 5, content: "I buy all my business electronics here now. The crypto payments save me forex fees, and the free shipping over $500 is a game changer. Customer support is responsive too." },
  { name: "Ryan P.", initials: "RP", role: "Verified Buyer", location: "Hobart, AU", rating: 4, content: "Bought a Samsung tablet for my daughter. Delivery to Tasmania was faster than expected. Only giving 4 stars because I wish there were more accessory options." },
  { name: "Olivia N.", initials: "ON", role: "Lifestyle Vlogger", location: "Darwin, AU", rating: 5, content: "I promote Cryptoelectro to all my followers. The affiliate program is legit — earned $200 last month just from sharing my link. Products are always authentic." },
  { name: "Tom H.", initials: "TH", role: "Gamer & Streamer", location: "Newcastle, AU", rating: 5, content: "Bought a PS5 with SOL. Payment confirmed in under 2 minutes. The whole process was so smooth I forgot I was spending crypto. This is the future of shopping." },
  { name: "Lauren B.", initials: "LB", role: "Verified Buyer", location: "Sunshine Coast, AU", rating: 5, content: "Finally found a place that accepts USDC. Bought a Nikon camera and lens kit. Everything was brand new, sealed, with Australian warranty. Will be back for more." },
  { name: "Mike R.", initials: "MR", role: "Crypto Trader", location: "Sydney, AU", rating: 4, content: "When crypto pumps, I shop here. Converted some gains into a new laptop. The exchange rate was fair and the order was processed quickly. More categories please!" },
  { name: "Nina G.", initials: "NG", role: "Verified Buyer", location: "Cairns, AU", rating: 5, content: "I was worried about buying expensive electronics online with crypto, but Cryptoelectro proved me wrong. My MacBook Air arrived in perfect condition. The 30-day return policy gives peace of mind." },
  { name: "Ahmed S.", initials: "AS", role: "University Student", location: "Sydney, AU", rating: 5, content: "Best prices I could find for an iPad. Paid with TRX — saved on international card fees. The loyalty points are building up nicely too. Student-friendly pricing would be amazing!" },
  { name: "Jess K.", initials: "JK", role: "Verified Buyer", location: "Christchurch, NZ", rating: 4, content: "Ordered from New Zealand. Took about 10 days but the product was worth the wait. Paid with Bitcoin and everything went smoothly. Would love a NZ warehouse for faster shipping." },
  { name: "Chris B.", initials: "CB", role: "IT Professional", location: "Geelong, AU", rating: 5, content: "As an IT guy, I appreciate that Cryptoelectro lists detailed specs. Bought a Lenovo ThinkPad for work. Paid with USDT, delivered in 3 days. Professional experience all around." },
  { name: "Rachel W.", initials: "RW", role: "Verified Buyer", location: "Wollongong, AU", rating: 5, content: "Gift shopping made easy. Bought my husband the latest Samsung phone for his birthday. He loves it. The gift packaging option would be a nice addition!" },
  { name: "Daniel F.", initials: "DF", role: "Freelancer", location: "Byron Bay, AU", rating: 5, content: "Freelancing in crypto means I need places to spend it. Cryptoelectro is perfect. Upgraded my entire workflow with a MacBook Pro and accessories. Zero issues." },
  { name: "Hannah L.", initials: "HL", role: "Verified Buyer", location: "Melbourne, AU", rating: 5, content: "Customer for 6 months now. Multiple purchases, zero problems. The store credit system is brilliant — I use my referral earnings for discounts. Best crypto marketplace in Australia!" },
];

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-text-primary/50">Loading...</p></div>}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [brands, setBrands] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [customerReviews, setCustomerReviews] = useState<any[]>(defaultReviews);

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) window.location.href = `/api/affiliate/track?ref=${ref}`;
  }, [searchParams]);

  useEffect(() => {
    // SEO Homepage
    document.title = "Cryptoelectro-au | Premium Electronics Marketplace – Pay with Crypto or Credit cards";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", "Australia's premium electronics marketplace. Buy smartphones, laptops, cameras, and home appliances with Credit cards, Bitcoin, Ethereum, USDT, TRX, and 100+ cryptocurrencies. Fast shipping Australia-wide.");
    
    fetch("/api/categories").then(r => r.json()).then(d => setCategories(d.categories || []));
    fetch("/api/products?limit=16&featured=true").then(r => r.json()).then(d => setProducts(d.products || []));
    fetch("/api/products?limit=1").then(r => r.json()).then(d => setTotalProducts(d.pagination?.total || 0));
    fetch("/api/brands").then(r => r.json()).then(d => setBrands(d.brands || []));
    fetch("/api/deals").then(r => r.json()).then(d => setDeals(d.deals || []));
    
    // Fetch real testimonials
    fetch("/api/testimonials?limit=50").then(r => r.json()).then(d => {
      const formatted = (d.testimonials || []).map((t: any) => ({
        name: `${t.user.firstName} ${t.user.lastName}`,
        initials: `${t.user.firstName?.charAt(0) || ""}${t.user.lastName?.charAt(0) || ""}`,
        role: t.role || null,
        location: t.location || null,
        content: t.content,
        rating: t.rating,
      }));
      if (formatted.length > 0) setCustomerReviews(formatted);
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      {/* ===== Hero Section ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs font-body text-accent">Crypto and Credit Card Payments Now Accepted</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-heading font-bold leading-tight">Premium Electronics <span className="text-gradient">for the Modern Age</span></h1>
              <p className="text-base sm:text-lg text-text-primary/60 max-w-lg">Australia&apos;s premier marketplace for high-end electronics. Shop smartphones, cameras, computers, and more. Pay with Credit cards, Bitcoin, Ethereum, USDT, and other cryptocurrencies.</p>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <Link href="/category/all" className="btn-primary text-sm sm:text-base">Shop Now</Link>
                <Link href="/about" className="btn-secondary text-sm sm:text-base">Learn More</Link>
              </div>
              <div className="flex gap-6 sm:gap-8 pt-2">
                <div><p className="text-xl sm:text-2xl font-heading font-bold text-accent">{totalProducts}+</p><p className="text-xs sm:text-sm text-text-primary/50">Products</p></div>
                <div><p className="text-xl sm:text-2xl font-heading font-bold text-accent">{brands.length}+</p><p className="text-xs sm:text-sm text-text-primary/50">Brands</p></div>
                <div><p className="text-xl sm:text-2xl font-heading font-bold text-accent">24/7</p><p className="text-xs sm:text-sm text-text-primary/50">Support</p></div>
              </div>
            </div>
            <div className="relative hidden lg:grid grid-cols-2 gap-3 xl:gap-4">
              <div className="card overflow-hidden aspect-[3/4] relative group"><div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" /><img src="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=800&fit=crop" alt="Premium Smartphone" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /><div className="absolute bottom-3 left-3 z-20"><span className="badge badge-accent text-xs">Smartphones</span></div></div>
              <div className="card overflow-hidden aspect-[3/4] relative group mt-8"><div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" /><img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=800&fit=crop" alt="Professional Camera" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /><div className="absolute bottom-3 left-3 z-20"><span className="badge badge-accent text-xs">Cameras</span></div></div>
              <div className="card overflow-hidden aspect-[4/3] relative group col-span-2"><div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" /><img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&h=600&fit=crop" alt="Premium Laptop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /><div className="absolute bottom-3 left-3 z-20"><span className="badge badge-accent text-xs">Computers</span></div></div>
            </div>
            <div className="lg:hidden grid grid-cols-2 gap-3">
              <div className="card overflow-hidden aspect-square relative"><img src="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop" alt="Smartphone" className="w-full h-full object-cover" /></div>
              <div className="card overflow-hidden aspect-square relative"><img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop" alt="Laptop" className="w-full h-full object-cover" /></div>
            </div>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      </section>

      {/* ===== Categories Bento Grid ===== */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12"><h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold">Shop by <span className="text-gradient">Category</span></h2><p className="mt-3 sm:mt-4 text-sm sm:text-base text-text-primary/50 max-w-lg mx-auto px-4">Explore our curated selection of premium electronics across multiple categories</p></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 auto-rows-fr">
            {categories.slice(0, 6).map((cat, index) => (<CategoryCard key={cat.id} category={cat} index={index} />))}
          </div>
        </div>
      </section>

      {/* ===== Featured Products ===== */}
      <section className="py-12 sm:py-16 lg:py-24 bg-secondary-dark/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8 sm:mb-12">
            <div><h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold">Featured <span className="text-gradient">Products</span></h2><p className="mt-2 text-sm sm:text-base text-text-primary/50">Handpicked premium electronics just for you</p></div>
            <Link href="/category/all" className="btn-outline text-sm whitespace-nowrap">View All Products</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.slice(0, 16).map((product: any, index: number) => (<ProductCard key={product.id} product={product} index={index} />))}
          </div>
        </div>
      </section>

      {/* ===== Flash Deals ===== */}
      {deals.length > 0 && (
        <section className="py-12 sm:py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8 sm:mb-12">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold"> Flash <span className="text-gradient">Deals</span></h2>
                <p className="mt-2 text-sm sm:text-base text-text-primary/50">Limited time offers — grab them before they&apos;re gone!</p>
              </div>
              <Link href="/deals" className="btn-outline text-sm whitespace-nowrap">View All Deals</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {deals.slice(0, 4).map((deal: any) => {
                const product = { ...deal.product, price: Number(deal.dealPrice), compareAtPrice: Number(deal.product.price), isNew: true };
                return <ProductCard key={deal.id} product={product} />;
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== Customer Reviews ===== */}
      <section className="py-12 sm:py-16 lg:py-24 bg-secondary-dark/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold">What Our <span className="text-gradient">Customers Say</span></h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-text-primary/50 max-w-lg mx-auto">Real reviews from real crypto shoppers</p>
          </div>
        </div>
        <div className="relative">
          <div className="flex gap-4 animate-scroll" style={{ width: "max-content" }}>
            {[...customerReviews, ...customerReviews, ...customerReviews].map((review, i) => (
              <div key={`${review.name}-${i}`} className="card p-5 w-[340px] flex-shrink-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-sm font-heading font-bold text-accent">{review.initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-heading font-semibold">{review.name}</p>
                    {review.role && <p className="text-xs text-text-primary/40">{review.role}</p>}
                  </div>
                </div>
                <div className="flex gap-1 mb-2">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={s <= review.rating ? "currentColor" : "none"} stroke="currentColor" className={`w-3.5 h-3.5 ${s <= review.rating ? "text-warning" : "text-text-primary/20"}`}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                    </svg>
                  ))}
                </div>
                <p className="text-xs text-text-primary/60 leading-relaxed line-clamp-4 mb-3 whitespace-normal">&ldquo;{review.content}&rdquo;</p>
                {review.location && (
                  <div className="text-xs text-text-primary/30 pt-3 border-t border-secondary-light">{review.location}</div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="text-center mt-8">
          <Link href="/testimonials" className="btn-outline text-sm">View All Reviews</Link>
        </div>
      </section>

      {/* ===== Trusted Brands ===== */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold">Trusted <span className="text-gradient">Brands</span></h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-text-primary/50 max-w-lg mx-auto px-4">We partner with the world&apos;s leading electronics manufacturers</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
            {brands.map((brand: any) => (
              <Link
                key={brand.id}
                href={`/category/all?brand=${brand.slug}`}
                className="card flex flex-col items-center justify-between p-4 sm:p-5 gap-0 group min-h-[150px] sm:min-h-[170px] hover:border-accent/30 transition-all"
              >
                <div className="flex-1 flex items-center justify-center w-full group-hover:scale-110 transition-transform duration-300">
                  {brand.slug === "samsung" && (
                    <svg viewBox="0 0 120 24" className="w-full max-w-[90px] h-auto" fill="currentColor" style={{color:"#1428A0"}}>
                      <text x="0" y="20" fontFamily="Arial,sans-serif" fontSize="22" fontWeight="900">SAMSUNG</text>
                    </svg>
                  )}
                  {brand.slug === "apple" && (
                    <svg viewBox="0 0 24 24" className="w-7 h-7 sm:w-9 sm:h-9" fill="currentColor" style={{color:"#000"}}>
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                  )}
                  {brand.slug === "sony" && (
                    <svg viewBox="0 0 80 24" className="w-full max-w-[70px] h-auto" fill="currentColor" style={{color:"#000"}}>
                      <text x="0" y="20" fontFamily="Arial,sans-serif" fontSize="22" fontWeight="900">SONY</text>
                    </svg>
                  )}
                  {brand.slug === "lg" && (
                    <svg viewBox="0 0 48 24" className="w-full max-w-[44px] h-auto" fill="currentColor">
                      <circle cx="12" cy="12" r="11" fill="#A50034"/>
                      <text x="12" y="17" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="11" fontWeight="900" fill="#FFF">LG</text>
                    </svg>
                  )}
                  {brand.slug === "dell" && (
                    <svg viewBox="0 0 80 24" className="w-full max-w-[70px] h-auto" fill="currentColor" style={{color:"#007DB8"}}>
                      <text x="0" y="20" fontFamily="Arial,sans-serif" fontSize="22" fontWeight="900">DELL</text>
                    </svg>
                  )}
                  {brand.slug === "lenovo" && (
                    <svg viewBox="0 0 100 24" className="w-full max-w-[85px] h-auto" fill="currentColor" style={{color:"#E2231A"}}>
                      <text x="0" y="20" fontFamily="Arial,sans-serif" fontSize="22" fontWeight="900">Lenovo</text>
                    </svg>
                  )}
                  {brand.slug === "hp" && (
                    <svg viewBox="0 0 80 24" className="w-full max-w-[55px] h-auto" fill="currentColor" style={{color:"#0096D6"}}>
                      <text x="0" y="20" fontFamily="Arial,sans-serif" fontSize="22" fontWeight="900">HP</text>
                    </svg>
                  )}
                  {brand.slug === "nikon" && (
                    <svg viewBox="0 0 100 24" className="w-full max-w-[85px] h-auto">
                      <rect x="2" y="2" width="96" height="20" rx="3" fill="#000"/>
                      <text x="50" y="17" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="14" fontWeight="900" fill="#FFDE00">Nikon</text>
                    </svg>
                  )}
                  {brand.slug === "dyson" && (
                    <svg viewBox="0 0 80 24" className="w-full max-w-[75px] h-auto" fill="currentColor" style={{color:"#000"}}>
                      <text x="0" y="20" fontFamily="Arial,sans-serif" fontSize="22" fontWeight="900">dyson</text>
                    </svg>
                  )}
                  {brand.slug === "microsoft" && (
                    <svg viewBox="0 0 24 24" className="w-7 h-7 sm:w-9 sm:h-9">
                      <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
                      <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/>
                      <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/>
                      <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
                    </svg>
                  )}
                  {brand.slug === "nintendo" && (
                    <svg viewBox="0 0 120 24" className="w-full max-w-[105px] h-auto" fill="currentColor" style={{color:"#E60012"}}>
                      <text x="0" y="20" fontFamily="Arial,sans-serif" fontSize="22" fontWeight="900">NINTENDO</text>
                    </svg>
                  )}
                </div>
                <span className="text-xs sm:text-sm font-body text-text-primary/60 group-hover:text-accent transition-colors text-center leading-tight mt-2">
                  {brand.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Crypto CTA ===== */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-6 sm:p-8 lg:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-accent/10" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-4 sm:space-y-6">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold">Ready to Pay with <span className="text-gradient">Crypto or Credit Cards?</span></h2>
              <p className="text-sm sm:text-base text-text-primary/60">Experience the future of shopping. Secure, fast, and borderless payments with Credit Cards, Bitcoin, Ethereum, USDT, and 100+ cryptocurrencies.</p>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 pt-2"><span className="badge badge-accent text-xs sm:text-sm">💳 Credit Cards</span><span className="badge badge-accent text-xs sm:text-sm">₿ Bitcoin</span><span className="badge badge-accent text-xs sm:text-sm">Ξ Ethereum</span><span className="badge badge-accent text-xs sm:text-sm">₮ USDT</span><span className="badge badge-accent text-xs sm:text-sm">+100 More</span></div>
              <div className="pt-4"><Link href="/category/all" className="btn-primary">Start Shopping</Link></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}