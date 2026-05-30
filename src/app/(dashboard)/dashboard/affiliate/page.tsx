"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Link from "next/link";

export default function AffiliatePage() {
  const { user } = useAuth();
  const [affiliate, setAffiliate] = useState<any>(null);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawType, setWithdrawType] = useState<"store_credit" | "crypto">("store_credit");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(() => {
    fetch("/api/affiliate")
      .then((r) => r.json())
      .then((d) => {
        setAffiliate(d.affiliate);
        setReferrals(d.referrals || []);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Recharger les données quand la page reprend le focus
  useEffect(() => {
    const handleFocus = () => fetchData();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchData]);

  const affiliateLink = typeof window !== "undefined" ? `${window.location.origin}/?ref=${affiliate?.code}` : "";

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    const res = await fetch("/api/affiliate/withdraw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: withdrawType,
        amount: Number(withdrawAmount),
        walletAddress: withdrawType === "crypto" ? walletAddress : undefined,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage(data.message);
      setShowWithdraw(false);
      setWithdrawAmount("");
      fetchData(); // Recharger immédiatement
    } else {
      setError(data.error);
    }
    setLoading(false);
  };

  if (!affiliate) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Affiliate Program" }]} />

      <h1 className="text-3xl font-heading font-bold mb-8">Affiliate <span className="text-gradient">Program</span></h1>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Available Balance", value: `$${Number(affiliate.availableBalance || 0).toFixed(2)}`, icon: "💰" },
          { label: "Store Credit", value: `$${Number(affiliate.storeCredit || 0).toFixed(2)}`, icon: "🛒" },
          { label: "Total Earned", value: `$${Number(affiliate.totalEarned || 0).toFixed(2)}`, icon: "📈" },
          { label: "Clicks", value: String(affiliate.clicks || 0), icon: "👆" },
        ].map((s) => (
          <div key={s.label} className="card p-4 sm:p-5 text-center">
            <span className="text-xl sm:text-2xl">{s.icon}</span>
            <p className="text-lg sm:text-xl font-bold mt-1">{s.value}</p>
            <p className="text-xs text-text-primary/50">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Affiliate Link */}
      <div className="card p-6 space-y-4 mb-8">
        <h2 className="text-lg font-heading font-bold">Your Affiliate Link</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <input type="text" value={affiliateLink} readOnly className="input-field flex-1 text-sm" />
          <button onClick={() => { navigator.clipboard.writeText(affiliateLink); setMessage("Link copied!"); setTimeout(() => setMessage(""), 2000); }} className="btn-primary text-sm">Copy Link</button>
        </div>
        {message && <p className="text-sm text-success">{message}</p>}
        <p className="text-xs text-text-primary/40">Share this link and earn <strong>5% commission</strong> on every purchase! Cookie lasts 30 days.</p>
      </div>

      {/* Withdraw */}
      <div className="card p-6 space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-heading font-bold">Withdraw Commissions</h2>
          <span className="text-sm text-text-primary/50">Min: $20</span>
        </div>

        {!showWithdraw ? (
          <button
            onClick={() => setShowWithdraw(true)}
            className="btn-primary text-sm"
            disabled={Number(affiliate.availableBalance || 0) < 20}
          >
            {Number(affiliate.availableBalance || 0) < 20 ? "Need $20 minimum" : "Withdraw Funds"}
          </button>
        ) : (
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div className="flex gap-3">
              <button type="button" onClick={() => setWithdrawType("store_credit")} className={`flex-1 p-3 rounded-md border-2 text-sm transition-all ${withdrawType === "store_credit" ? "border-accent bg-accent/5 text-accent" : "border-secondary-light text-text-primary/60"}`}>
                🛒 Store Credit
              </button>
              <button type="button" onClick={() => setWithdrawType("crypto")} className={`flex-1 p-3 rounded-md border-2 text-sm transition-all ${withdrawType === "crypto" ? "border-accent bg-accent/5 text-accent" : "border-secondary-light text-text-primary/60"}`}>
                💎 Crypto (TRX)
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary/70 mb-2">
                Amount (min $20, max ${Number(affiliate.availableBalance || 0).toFixed(2)})
              </label>
              <input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} className="input-field" min="20" max={Number(affiliate.availableBalance || 0)} step="0.01" required />
            </div>

            {withdrawType === "crypto" && (
              <div>
                <label className="block text-sm font-medium text-text-primary/70 mb-2">TRX Wallet Address</label>
                <input type="text" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} placeholder="Your TRX wallet address" className="input-field" required />
              </div>
            )}

            {error && <div className="bg-error/10 border border-error/30 text-error text-sm p-3 rounded-md">{error}</div>}

            <div className="flex gap-3">
              <button type="submit" className="btn-primary text-sm" disabled={loading}>
                {loading ? "Processing..." : withdrawType === "store_credit" ? "Convert to Credit" : "Request Withdrawal"}
              </button>
              <button type="button" onClick={() => { setShowWithdraw(false); setError(""); }} className="btn-secondary text-sm">Cancel</button>
            </div>
          </form>
        )}
      </div>

      {/* Referral History */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-secondary-light">
          <h2 className="text-lg font-heading font-bold">Referral History</h2>
        </div>
        {referrals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-light">
                  <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Date</th>
                  <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Order</th>
                  <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Commission</th>
                  <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((r: any) => (
                  <tr key={r.id} className="border-b border-secondary-light">
                    <td className="px-6 py-3 text-sm">{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-3 text-sm font-mono">{r.order?.orderNumber || "N/A"}</td>
                    <td className="px-6 py-3 text-sm">${Number(r.commission).toFixed(2)}</td>
                    <td className="px-6 py-3">
                      <span className={`badge text-xs ${
                        r.status === "paid" ? "badge-success" : r.status === "pending_withdrawal" ? "badge-accent" : "badge-warning"
                      }`}>
                        {r.status.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-text-primary/50">No referrals yet. Share your link to start earning!</div>
        )}
      </div>
    </div>
  );
}