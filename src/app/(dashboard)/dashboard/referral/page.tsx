"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function ReferralPage() {
  const { user } = useAuth();
  const [referral, setReferral] = useState<any>(null);

  useEffect(() => {
    fetch("/api/referral")
      .then((r) => r.json())
      .then((d) => setReferral(d));
  }, []);

  if (!referral) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Referral Program" }]} />
      <h1 className="text-3xl font-heading font-bold mb-8">Referral <span className="text-gradient">Program</span></h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Friends Referred", value: referral.referredCount.toString(), icon: "👥" },
          { label: "Reward per Friend", value: `$${referral.rewardAmount}`, icon: "🎁" },
          { label: "Total Earned", value: `$${(referral.referredCount * referral.rewardAmount).toFixed(2)}`, icon: "💰" },
        ].map((s) => (
          <div key={s.label} className="card p-5 text-center">
            <span className="text-2xl">{s.icon}</span>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
            <p className="text-xs text-text-primary/50">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Referral Code */}
      <div className="card p-6 space-y-4 mb-8">
        <h2 className="text-lg font-heading font-bold">Your Referral Code</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input type="text" value={referral.referralCode} readOnly className="input-field flex-1 text-sm font-mono text-center text-lg tracking-wider" />
          <button onClick={() => { navigator.clipboard.writeText(referral.referralCode); alert("Code copied!"); }} className="btn-primary text-sm">Copy Code</button>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input type="text" value={referral.referralLink} readOnly className="input-field flex-1 text-sm" />
          <button onClick={() => { navigator.clipboard.writeText(referral.referralLink); alert("Link copied!"); }} className="btn-secondary text-sm">Copy Link</button>
        </div>
        <p className="text-xs text-text-primary/40">Share your code or link. When a friend signs up and makes their first purchase, you both earn <strong>${referral.rewardAmount}</strong> in store credit!</p>
      </div>

      {/* Referral List */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-secondary-light"><h2 className="text-lg font-heading font-bold">Your Referrals</h2></div>
        {referral.referrals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-secondary-light"><th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Name</th><th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Email</th><th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Joined</th></tr></thead>
              <tbody>
                {referral.referrals.map((r: any) => (
                  <tr key={r.id} className="border-b border-secondary-light">
                    <td className="px-6 py-3 text-sm">{r.firstName} {r.lastName}</td>
                    <td className="px-6 py-3 text-sm text-text-primary/60">{r.email}</td>
                    <td className="px-6 py-3 text-sm text-text-primary/40">{new Date(r.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-text-primary/50">No referrals yet. Share your code to start earning!</div>
        )}
      </div>
    </div>
  );
}