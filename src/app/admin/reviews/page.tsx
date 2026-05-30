"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);

  const fetchReviews = () => {
    fetch("/api/admin/reviews")
      .then((r) => r.json())
      .then((d) => setReviews(d.reviews || []));
  };

  useEffect(() => { fetchReviews(); }, []);

  const approveReview = async (id: string) => {
    await fetch(`/api/admin/reviews/${id}`, { method: "PUT" });
    fetchReviews();
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    fetchReviews();
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading font-bold">Reviews</h1>
        <Link href="/admin" className="btn-secondary text-sm">← Back</Link>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary-light">
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Product</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">User</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Rating</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Content</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Verified</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r: any) => (
                <tr key={r.id} className="border-b border-secondary-light">
                  <td className="px-6 py-4 text-sm">{r.product?.name || "N/A"}</td>
                  <td className="px-6 py-4 text-sm">{r.user?.firstName} {r.user?.lastName}</td>
                  <td className="px-6 py-4 text-sm">{"⭐".repeat(r.rating)}</td>
                  <td className="px-6 py-4 text-sm text-text-primary/60 max-w-xs truncate">{r.content}</td>
                  <td className="px-6 py-4">{r.isVerified ? <span className="badge badge-success text-xs">Yes</span> : <span className="badge badge-warning text-xs">No</span>}</td>
                  <td className="px-6 py-4 flex gap-2">
                    {!r.isVerified && (
                      <button onClick={() => approveReview(r.id)} className="text-xs text-success hover:underline">Approve</button>
                    )}
                    <button onClick={() => deleteReview(r.id)} className="text-xs text-error hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}