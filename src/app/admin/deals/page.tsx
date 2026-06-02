"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminDealsPage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ productId: "", dealPrice: "", expiresAt: "" });
  const [message, setMessage] = useState("");

  const fetchDeals = () => { fetch("/api/admin/deals").then(r => r.json()).then(d => setDeals(d.deals || [])); };
  useEffect(() => { fetchDeals(); fetch("/api/products?limit=100").then(r => r.json()).then(d => setProducts(d.products || [])); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/admin/deals", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setShowForm(false); setForm({ productId: "", dealPrice: "", expiresAt: "" }); fetchDeals();
    setMessage("Deal created!"); setTimeout(() => setMessage(""), 3000);
  };

  const toggleActive = async (id: string, current: boolean) => {
    await fetch(`/api/admin/deals/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !current }) });
    fetchDeals();
  };

  const deleteDeal = async (id: string) => {
    if (!confirm("Delete?")) return;
    await fetch(`/api/admin/deals/${id}`, { method: "DELETE" });
    fetchDeals();
  };

  const isExpired = (date: string) => new Date(date) < new Date();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-xl sm:text-2xl font-heading font-bold">Flash Deals</h1>
        <div className="flex gap-3"><Link href="/admin" className="btn-secondary text-sm">← Back</Link><button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">+ New Deal</button></div>
      </div>
      {message && <div className="bg-success/10 border border-success/30 text-success text-sm p-3 rounded-md mb-4">{message}</div>}
      {showForm && (
        <div className="card p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium text-text-primary/70 mb-2">Product *</label><select value={form.productId} onChange={e => setForm({...form, productId: e.target.value})} className="input-field" required><option value="">Select product</option>{products.map((p: any) => (<option key={p.id} value={p.id}>{p.name} - ${Number(p.price).toFixed(2)}</option>))}</select></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-text-primary/70 mb-2">Deal Price ($) *</label><input type="number" value={form.dealPrice} onChange={e => setForm({...form, dealPrice: e.target.value})} className="input-field" step="0.01" required /></div>
              <div><label className="block text-sm font-medium text-text-primary/70 mb-2">Expires At *</label><input type="datetime-local" value={form.expiresAt} onChange={e => setForm({...form, expiresAt: e.target.value})} className="input-field" required /></div>
            </div>
            <button type="submit" className="btn-primary text-sm">Create Deal</button>
          </form>
        </div>
      )}
      <div className="card overflow-hidden"><div className="overflow-x-auto"><table className="w-full min-w-[600px]"><thead><tr className="border-b border-secondary-light"><th className="text-left text-xs font-medium text-text-primary/50 uppercase px-4 sm:px-6 py-3">Product</th><th className="text-left text-xs font-medium text-text-primary/50 uppercase px-4 sm:px-6 py-3">Original</th><th className="text-left text-xs font-medium text-text-primary/50 uppercase px-4 sm:px-6 py-3">Deal</th><th className="text-left text-xs font-medium text-text-primary/50 uppercase px-4 sm:px-6 py-3">Expires</th><th className="text-left text-xs font-medium text-text-primary/50 uppercase px-4 sm:px-6 py-3">Status</th><th className="text-left text-xs font-medium text-text-primary/50 uppercase px-4 sm:px-6 py-3">Actions</th></tr></thead><tbody>{deals.map((d: any) => (<tr key={d.id} className="border-b border-secondary-light"><td className="px-4 sm:px-6 py-3 text-sm">{d.product?.name}</td><td className="px-4 sm:px-6 py-3 text-sm line-through text-text-primary/40">${Number(d.product?.price).toFixed(2)}</td><td className="px-4 sm:px-6 py-3 text-sm font-bold text-success">${Number(d.dealPrice).toFixed(2)}</td><td className="px-4 sm:px-6 py-3 text-sm text-text-primary/40">{new Date(d.expiresAt).toLocaleString()}</td><td className="px-4 sm:px-6 py-3">{isExpired(d.expiresAt) ? <span className="badge badge-error text-xs">Expired</span> : <button onClick={() => toggleActive(d.id, d.isActive)} className={`badge text-xs ${d.isActive ? "badge-success" : "badge-error"}`}>{d.isActive ? "Active" : "Inactive"}</button>}</td><td className="px-4 sm:px-6 py-3"><button onClick={() => deleteDeal(d.id)} className="text-xs text-error hover:underline">Delete</button></td></tr>))}</tbody></table></div></div>
    </div>
  );
}