"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Testimonial {
  id: string;
  content: string;
  rating: number;
  role: string | null;
  location: string | null;
  isApproved: boolean;
  createdAt: string;
  user: { firstName: string; lastName: string; email: string };
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTestimonials(); }, []);

  const fetchTestimonials = () => {
    fetch("/api/testimonials?admin=true")
      .then((r) => r.json())
      .then((d) => { setTestimonials(d.testimonials || []); setLoading(false); });
  };

  const approve = async (id: string) => {
    await fetch(`/api/admin/testimonials/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isApproved: true }),
    });
    fetchTestimonials();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    fetchTestimonials();
  };

  const pending = testimonials.filter((t) => !t.isApproved);
  const approved = testimonials.filter((t) => t.isApproved);

  if (loading) return <div className="p-8"><p className="text-text-primary/50">Loading...</p></div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl sm:text-2xl font-heading font-bold">Testimonials ({testimonials.length})</h1>
        <Link href="/admin" className="btn-secondary text-sm">← Back</Link>
      </div>

      {/* En attente */}
      {pending.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-heading font-bold mb-4 text-warning">⏳ Pending Approval ({pending.length})</h2>
          <div className="space-y-3">
            {pending.map((t) => (
              <div key={t.id} className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-accent">{t.user.firstName?.charAt(0)}{t.user.lastName?.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.user.firstName} {t.user.lastName}</p>
                      <p className="text-xs text-text-primary/40">{t.user.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={s <= t.rating ? "currentColor" : "none"} stroke="currentColor" className={`w-3 h-3 ${s <= t.rating ? "text-warning" : "text-text-primary/20"}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-text-primary/70 mb-3">&ldquo;{t.content}&rdquo;</p>
                <div className="flex items-center justify-between text-xs text-text-primary/40 mb-3">
                  <span>{t.role || "No role"} · {t.location || "No location"}</span>
                  <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => approve(t.id)} className="btn-primary text-xs py-1.5 px-3">Approve</button>
                  <button onClick={() => remove(t.id)} className="btn-secondary text-xs py-1.5 px-3 text-error">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approuvés */}
      <div>
        <h2 className="text-lg font-heading font-bold mb-4 text-success">✅ Approved ({approved.length})</h2>
        {approved.length > 0 ? (
          <div className="space-y-3">
            {approved.map((t) => (
              <div key={t.id} className="card p-5 opacity-70">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{t.user.firstName} {t.user.lastName}</span>
                    <span className="text-xs text-text-primary/40">{t.user.email}</span>
                  </div>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={s <= t.rating ? "currentColor" : "none"} stroke="currentColor" className={`w-3 h-3 ${s <= t.rating ? "text-warning" : "text-text-primary/20"}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-text-primary/60 line-clamp-2">&ldquo;{t.content}&rdquo;</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-text-primary/40">{new Date(t.createdAt).toLocaleDateString()}</span>
                  <button onClick={() => remove(t.id)} className="text-xs text-error hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-text-primary/50 text-sm">No approved testimonials yet.</p>
        )}
      </div>
    </div>
  );
}