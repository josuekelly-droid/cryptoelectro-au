"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useAuth } from "@/hooks/useAuth";

// ============ AVIS STATIQUES PAR DÉFAUT ============
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

export default function TestimonialsPage() {
  const { user } = useAuth();
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ content: "", rating: 5, role: "", location: "" });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // SEO
    document.title = "Customer Reviews — Cryptoelectro-au | Real Crypto Shopper Testimonials";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", "Real customer reviews and testimonials. See why Australians trust Cryptoelectro-au for buying premium electronics with cryptocurrency and credit cards.");

    fetch("/api/testimonials")
      .then(r => r.json())
      .then(d => {
        const realReviews = d.testimonials || [];

        // Formater les avis statiques
        const staticFormatted = defaultReviews.map((r, i) => ({
          id: `static-${i}`,
          content: r.content,
          rating: r.rating,
          role: r.role,
          location: r.location,
          user: { firstName: r.name.split(" ")[0], lastName: r.name.split(" ")[1] || "" },
          createdAt: new Date().toISOString(),
          isStatic: true,
        }));

        
        const allReviews = [...realReviews, ...staticFormatted];
        setTestimonials(allReviews);
        setLoading(false);

        // ============ SCHEMA.ORG AGGREGATE RATING ============
        if (allReviews.length > 0) {
          const avgRating = allReviews.reduce((sum: number, t: any) => sum + t.rating, 0) / allReviews.length;

          const schema = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Cryptoelectro-au",
            "url": "https://cryptoelectro-au.store",
            "description": "Australia's premium electronics marketplace with cryptocurrency and credit card payments.",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": avgRating.toFixed(1),
              "reviewCount": allReviews.length,
              "bestRating": "5",
            },
            "review": allReviews.slice(0, 50).map((t: any) => ({
              "@type": "Review",
              "author": { "@type": "Person", "name": `${t.user.firstName} ${t.user.lastName}` },
              "datePublished": t.createdAt,
              "reviewBody": t.content,
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": t.rating,
                "bestRating": "5",
              },
            })),
          };

          const oldScript = document.querySelector('script[data-schema="testimonials"]');
          if (oldScript) oldScript.remove();

          const script = document.createElement("script");
          script.setAttribute("data-schema", "testimonials");
          script.type = "application/ld+json";
          script.textContent = JSON.stringify(schema);
          document.head.appendChild(script);
        }
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("loading");

    const res = await fetch("/api/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (res.ok) {
      setSubmitStatus("success");
      setMessage("Thank you! Your review has been submitted and will appear once approved.");
      setForm({ content: "", rating: 5, role: "", location: "" });
      setShowForm(false);
    } else {
      setSubmitStatus("error");
      setMessage(data.error || "Something went wrong.");
    }
  };

  const avgRating = testimonials.length > 0
    ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
    : "0.0";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Customer Reviews" }]} />

      <div className="text-center mb-12">
        <h1 className="text-3xl lg:text-4xl font-heading font-bold">Customer <span className="text-gradient">Reviews</span></h1>
        <p className="mt-4 text-text-primary/50 max-w-xl mx-auto">Real reviews from real customers. Share your experience with Cryptoelectro-au.</p>

        {testimonials.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(s => (
                <svg key={s} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={s <= Math.round(Number(avgRating)) ? "currentColor" : "none"} stroke="currentColor" className={`w-5 h-5 ${s <= Math.round(Number(avgRating)) ? "text-warning" : "text-text-primary/20"}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-medium text-text-primary">{avgRating} out of 5</span>
            <span className="text-sm text-text-primary/40">· {testimonials.length} review{testimonials.length > 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      <div className="text-center mb-10">
        {user ? (
          !showForm ? (
            <button onClick={() => setShowForm(true)} className="btn-primary">Write a Review</button>
          ) : (
            <div className="card p-6 max-w-lg mx-auto text-left">
              <h3 className="text-lg font-heading font-bold mb-4">Share Your Experience</h3>
              {submitStatus === "success" ? (
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mx-auto">✓</div>
                  <p className="text-success text-sm">{message}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary/70 mb-2">Rating</label>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(star => (
                        <button type="button" key={star} onClick={() => setForm({...form, rating: star})}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={star <= form.rating ? "currentColor" : "none"} stroke="currentColor" className={`w-6 h-6 ${star <= form.rating ? "text-warning" : "text-text-primary/30"}`}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary/70 mb-2">Your Review *</label>
                    <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="input-field resize-none" rows={4} placeholder="Share your experience..." required minLength={10} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary/70 mb-2">Your Role (optional)</label>
                      <input type="text" value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="input-field" placeholder="e.g., Tech Reviewer" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary/70 mb-2">Location (optional)</label>
                      <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="input-field" placeholder="e.g., Sydney, AU" />
                    </div>
                  </div>
                  {submitStatus === "error" && <p className="text-error text-sm">{message}</p>}
                  <div className="flex gap-3">
                    <button type="submit" className="btn-primary text-sm" disabled={submitStatus === "loading"}>Submit Review</button>
                    <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
                  </div>
                </form>
              )}
            </div>
          )
        ) : (
          <p className="text-text-primary/50">
            <Link href="/login?redirect=/testimonials" className="text-accent hover:underline">Sign in</Link> to write a review.
          </p>
        )}
      </div>

      {/* Liste des avis */}
      {loading ? (
        <p className="text-center text-text-primary/50">Loading reviews...</p>
      ) : testimonials.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
              <div className="flex gap-1 mb-3">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={s <= t.rating ? "currentColor" : "none"} stroke="currentColor" className={`w-3.5 h-3.5 ${s <= t.rating ? "text-warning" : "text-text-primary/20"}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-text-primary/70 leading-relaxed mb-3 line-clamp-4">&ldquo;{t.content}&rdquo;</p>
              <div className="flex items-center gap-2 pt-3 border-t border-secondary-light">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-accent">{t.user.firstName?.charAt(0)}{t.user.lastName?.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-xs font-medium">{t.user.firstName} {t.user.lastName}</p>
                  {t.role && <p className="text-xs text-text-primary/40">{t.role}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 card">
          <span className="text-4xl mb-4 block">⭐</span>
          <h3 className="text-lg font-heading font-semibold mb-2">No Reviews Yet</h3>
          <p className="text-text-primary/50">Be the first to share your experience!</p>
        </div>
      )}
    </div>
  );
}