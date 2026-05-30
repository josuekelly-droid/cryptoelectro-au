"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setMessage(data.message || "Check your email for the reset link.");
    if (data.resetUrl) {
      console.log("Reset URL:", data.resetUrl);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <span className="text-2xl font-heading font-bold text-gradient">Cryptoelectro</span>
            <span className="text-base font-heading font-semibold text-accent">.au</span>
          </Link>
          <h1 className="text-2xl font-heading font-bold">Forgot Password</h1>
          <p className="mt-2 text-text-primary/50">Enter your email to receive a reset link.</p>
        </div>
        <div className="card p-6 sm:p-8">
          {message ? (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-success"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
              </div>
              <p className="text-text-primary/70">{message}</p>
              <Link href="/login" className="btn-primary mt-6 inline-block">Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-primary/70 mb-2">Email Address</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" className="input-field" required />
              </div>
              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
              <p className="text-center text-sm text-text-primary/50">
                <Link href="/login" className="text-accent hover:underline">Back to Login</Link>
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}