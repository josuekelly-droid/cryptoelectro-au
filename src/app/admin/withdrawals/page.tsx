"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  const fetchWithdrawals = () => {
    fetch("/api/admin/withdrawals")
      .then(r => r.json())
      .then(d => setWithdrawals(d.withdrawals || []));
  };

  useEffect(() => { fetchWithdrawals(); }, []);

  const markAsPaid = async (id: string) => {
    const res = await fetch(`/api/admin/withdrawals/${id}`, { method: "PUT" });
    if (res.ok) {
      setMessage("✅ Marked as paid!");
      fetchWithdrawals();
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const rejectWithdrawal = async (id: string) => {
    const res = await fetch(`/api/admin/withdrawals/${id}`, { method: "DELETE" });
    if (res.ok) {
      setMessage("❌ Withdrawal rejected");
      fetchWithdrawals();
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading font-bold">Withdrawal Requests</h1>
        <Link href="/admin" className="btn-secondary text-sm">← Back</Link>
      </div>

      {message && (
        <div className="bg-success/10 border border-success/30 text-success text-sm p-3 rounded-md mb-4">
          {message}
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary-light">
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Date</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Affiliate Code</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Amount</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Wallet Address</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Status</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w: any) => (
                <tr key={w.id} className="border-b border-secondary-light">
                  <td className="px-6 py-4 text-sm">{new Date(w.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm font-mono">{w.affiliate?.code || "N/A"}</td>
                  <td className="px-6 py-4 text-sm font-medium">${Number(w.commission).toFixed(2)}</td>
                  <td className="px-6 py-4 text-xs font-mono text-text-primary/60 max-w-[200px] truncate">
                    {w.affiliate?.walletAddress || "No address"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge text-xs ${
                      w.status === "paid" ? "badge-success" : 
                      w.status === "pending_withdrawal" ? "badge-warning" : "badge-error"
                    }`}>
                      {w.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    {w.status === "pending_withdrawal" && (
                      <>
                        <button
                          onClick={() => markAsPaid(w.id)}
                          className="text-xs text-success hover:underline"
                        >
                          Mark Paid
                        </button>
                        <button
                          onClick={() => rejectWithdrawal(w.id)}
                          className="text-xs text-error hover:underline"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {w.status === "paid" && (
                      <span className="text-xs text-text-primary/30">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
              {withdrawals.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-text-primary/50">No withdrawal requests</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}