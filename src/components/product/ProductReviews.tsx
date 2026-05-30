"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  isVerified: boolean;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface ProductReviewsProps {
  productId?: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, title: "", content: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (productId) {
      fetch(`/api/reviews?productId=${productId}`)
        .then((r) => r.json())
        .then((d) => setReviews(d.reviews || []));
    }
  }, [productId]);

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    stars: star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage:
      reviews.length > 0
        ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100
        : 0,
  }));

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("Please sign in to leave a review.");
      return;
    }
    setSubmitting(true);
    setError("");
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        rating: newReview.rating,
        title: newReview.title,
        content: newReview.content,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setReviews([data.review, ...reviews]);
      setNewReview({ rating: 5, title: "", content: "" });
      setShowForm(false);
      setSuccess("Review submitted! Thank you.");
      setTimeout(() => setSuccess(""), 3000);
    } else {
      const data = await res.json();
      setError(data.error || "Failed to submit review.");
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-heading font-bold">Customer Reviews</h3>

      {/* Rating Summary */}
      <div className="grid sm:grid-cols-2 gap-8 p-6 card">
        <div className="flex flex-col items-center justify-center">
          <span className="text-5xl font-heading font-bold text-gradient">
            {averageRating.toFixed(1)}
          </span>
          <div className="flex items-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={star <= Math.round(averageRating) ? "currentColor" : "none"}
                stroke="currentColor"
                className={`w-5 h-5 ${star <= Math.round(averageRating) ? "text-warning" : "text-text-primary/20"}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
              </svg>
            ))}
          </div>
          <p className="text-sm text-text-primary/50 mt-1">
            Based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="space-y-2">
          {ratingDistribution.map((dist) => (
            <div key={dist.stars} className="flex items-center gap-3">
              <span className="text-sm text-text-primary/60 w-6">{dist.stars}★</span>
              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-warning rounded-full transition-all duration-500"
                  style={{ width: `${dist.percentage}%` }}
                />
              </div>
              <span className="text-sm text-text-primary/40 w-8 text-right">{dist.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Success message */}
      {success && (
        <div className="bg-success/10 border border-success/30 text-success text-sm p-3 rounded-md">
          {success}
        </div>
      )}

      {/* Write Review Button */}
      {!showForm && (
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm">
          Write a Review
        </button>
      )}

      {/* Review Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6 space-y-4">
          <h4 className="text-lg font-heading font-semibold">Write Your Review</h4>
          {error && (
            <div className="bg-error/10 border border-error/30 text-error text-sm p-3 rounded-md">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary/70 mb-2">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="text-2xl transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill={star <= newReview.rating ? "currentColor" : "none"}
                      stroke="currentColor"
                      className={`w-6 h-6 ${star <= newReview.rating ? "text-warning" : "text-text-primary/20"}`}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary/70 mb-2">Title (optional)</label>
              <input
                type="text"
                value={newReview.title}
                onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                placeholder="Summary of your review"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary/70 mb-2">Review *</label>
              <textarea
                value={newReview.content}
                onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                placeholder="Share your experience with this product"
                className="input-field resize-none"
                rows={4}
                required
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary text-sm" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm">
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {displayedReviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-sm font-heading font-bold text-accent">
                      {review.user.firstName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-heading font-semibold">
                      {review.user.firstName} {review.user.lastName.charAt(0)}.
                    </p>
                    <p className="text-xs text-text-primary/40">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={star <= review.rating ? "currentColor" : "none"}
                    stroke="currentColor"
                    className={`w-4 h-4 ${star <= review.rating ? "text-warning" : "text-text-primary/20"}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                ))}
              </div>
            </div>
            {review.title && (
              <h4 className="text-base font-heading font-semibold mb-2">{review.title}</h4>
            )}
            <p className="text-sm text-text-primary/60 leading-relaxed">{review.content}</p>
            {review.isVerified && (
              <div className="flex items-center gap-1 mt-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-success">
                  <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                </svg>
                <span className="text-xs text-success">Verified Purchase</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {reviews.length > 3 && (
        <div className="text-center">
          <button onClick={() => setShowAll(!showAll)} className="btn-secondary text-sm">
            {showAll ? "Show Less" : `Show All ${reviews.length} Reviews`}
          </button>
        </div>
      )}
    </div>
  );
}