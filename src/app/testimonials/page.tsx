"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useAuth } from "@/hooks/useAuth";

export default function TestimonialsPage() {
  const { user } = useAuth();
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ content: "", rating: 5, role: "", location: "" });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/testimonials")
      .then(r => r.json())
      .then(d => { setTestimonials(d.testimonials || []); setLoading(false); });
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Customer Reviews" }]} />

      <div className="text-center mb-12">
        <h1 className="text-3xl lg:text-4xl font-heading font-bold">Customer <span className="text-gradient">Reviews</span></h1>
        <p className="mt-4 text-text-primary/50 max-w-xl mx-auto">Real reviews from real customers. Share your experience with Cryptoelectro-au.</p>
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