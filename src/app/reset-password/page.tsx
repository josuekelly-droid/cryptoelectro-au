"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-text-primary/50">Loading...</p>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match"); return; }
    setLoading(true); setError("");
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    if (res.ok) { setDone(true); setMessage(data.message); }
    else { setError(data.error); }
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
          <h1 className="text-2xl font-heading font-bold">Reset Password</h1>
        </div>
        <div className="card p-6 sm:p-8">
          {done ? (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-success"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
              </div>
              <p className="text-text-primary/70 mb-4">{message}</p>
              <Link href="/login" className="btn-primary">Sign In</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && <div className="bg-error/10 border border-error/30 text-error text-sm p-3 rounded-md">{error}</div>}
              <div><label className="block text-sm font-medium text-text-primary/70 mb-2">New Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-field" required minLength={8} /></div>
              <div><label className="block text-sm font-medium text-text-primary/70 mb-2">Confirm Password</label><input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} className="input-field" required /></div>
              <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? "Resetting..." : "Reset Password"}</button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}