"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: "", type: "percentage", value: "", minAmount: "", maxUses: "", expiresAt: "" });
  const [message, setMessage] = useState("");

  const fetchCoupons = () => {
    fetch("/api/admin/coupons").then(r => r.json()).then(d => setCoupons(d.coupons || []));
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/coupons", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, value: Number(form.value), minAmount: form.minAmount ? Number(form.minAmount) : null, maxUses: Number(form.maxUses || 0), expiresAt: form.expiresAt || null }) });
    if (res.ok) { setShowForm(false); setForm({ code: "", type: "percentage", value: "", minAmount: "", maxUses: "", expiresAt: "" }); fetchCoupons(); setMessage("Coupon created!"); setTimeout(() => setMessage(""), 3000); }
  };

  const toggleActive = async (id: string, current: boolean) => {
    await fetch(`/api/admin/coupons/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !current }) });
    fetchCoupons();
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm("Delete?")) return;
    await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    fetchCoupons();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-xl sm:text-2xl font-heading font-bold">Coupons</h1>
        <div className="flex gap-3">
          <Link href="/admin" className="btn-secondary text-sm">← Back</Link>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">+ New Coupon</button>
        </div>
      </div>

      {message && <div className="bg-success/10 border border-success/30 text-success text-sm p-3 rounded-md mb-4">{message}</div>}

      {showForm && (
        <div className="card p-6 mb-8">
          <h2 className="text-lg font-heading font-bold mb-4">New Coupon</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div><label className="block text-sm font-medium text-text-primary/70 mb-2">Code *</label><input type="text" value={form.code} onChange={e => setForm({...form, code: e.target.value})} className="input-field" placeholder="WELCOME10" required /></div>
              <div><label className="block text-sm font-medium text-text-primary/70 mb-2">Type</label><select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="input-field"><option value="percentage">Percentage (%)</option><option value="fixed">Fixed Amount ($)</option></select></div>
              <div><label className="block text-sm font-medium text-text-primary/70 mb-2">Value *</label><input type="number" value={form.value} onChange={e => setForm({...form, value: e.target.value})} className="input-field" placeholder={form.type === "percentage" ? "10" : "20"} required /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div><label className="block text-sm font-medium text-text-primary/70 mb-2">Min Order ($)</label><input type="number" value={form.minAmount} onChange={e => setForm({...form, minAmount: e.target.value})} className="input-field" /></div>
              <div><label className="block text-sm font-medium text-text-primary/70 mb-2">Max Uses</label><input type="number" value={form.maxUses} onChange={e => setForm({...form, maxUses: e.target.value})} className="input-field" placeholder="0 = unlimited" /></div>
              <div><label className="block text-sm font-medium text-text-primary/70 mb-2">Expires At</label><input type="date" value={form.expiresAt} onChange={e => setForm({...form, expiresAt: e.target.value})} className="input-field" /></div>
            </div>
            <button type="submit" className="btn-primary text-sm">Create Coupon</button>
          </form>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead><tr className="border-b border-secondary-light"><th className="text-left text-xs font-medium text-text-primary/50 uppercase px-4 sm:px-6 py-3">Code</th><th className="text-left text-xs font-medium text-text-primary/50 uppercase px-4 sm:px-6 py-3">Discount</th><th className="text-left text-xs font-medium text-text-primary/50 uppercase px-4 sm:px-6 py-3">Used</th><th className="text-left text-xs font-medium text-text-primary/50 uppercase px-4 sm:px-6 py-3">Status</th><th className="text-left text-xs font-medium text-text-primary/50 uppercase px-4 sm:px-6 py-3">Expires</th><th className="text-left text-xs font-medium text-text-primary/50 uppercase px-4 sm:px-6 py-3">Actions</th></tr></thead>
            <tbody>
              {coupons.map((c: any) => (
                <tr key={c.id} className="border-b border-secondary-light">
                  <td className="px-4 sm:px-6 py-3 text-sm font-mono font-bold">{c.code}</td>
                  <td className="px-4 sm:px-6 py-3 text-sm">{c.type === "percentage" ? `${c.value}%` : `$${c.value}`}</td>
                  <td className="px-4 sm:px-6 py-3 text-sm">{c.maxUses > 0 ? `${c.usedCount}/${c.maxUses}` : c.usedCount}</td>
                  <td className="px-4 sm:px-6 py-3"><button onClick={() => toggleActive(c.id, c.isActive)} className={`badge text-xs ${c.isActive ? "badge-success" : "badge-error"}`}>{c.isActive ? "Active" : "Inactive"}</button></td>
                  <td className="px-4 sm:px-6 py-3 text-sm text-text-primary/40">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "Never"}</td>
                  <td className="px-4 sm:px-6 py-3"><button onClick={() => deleteCoupon(c.id)} className="text-xs text-error hover:underline">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}