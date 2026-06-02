"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ text: "", link: "", bgColor: "#007BFF", textColor: "#FFFFFF" });
  const [message, setMessage] = useState("");

  const fetchBanners = () => { fetch("/api/admin/banners").then(r => r.json()).then(d => setBanners(d.banners || [])); };
  useEffect(() => { fetchBanners(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/admin/banners", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setShowForm(false); setForm({ text: "", link: "", bgColor: "#007BFF", textColor: "#FFFFFF" }); fetchBanners();
    setMessage("Banner created!"); setTimeout(() => setMessage(""), 3000);
  };

  const toggleActive = async (id: string, current: boolean) => {
    await fetch(`/api/admin/banners/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !current }) });
    fetchBanners();
  };

  const deleteBanner = async (id: string) => {
    if (!confirm("Delete?")) return;
    await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
    fetchBanners();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-xl sm:text-2xl font-heading font-bold">Promo Banners</h1>
        <div className="flex gap-3"><Link href="/admin" className="btn-secondary text-sm">← Back</Link><button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">+ New Banner</button></div>
      </div>
      {message && <div className="bg-success/10 border border-success/30 text-success text-sm p-3 rounded-md mb-4">{message}</div>}
      {showForm && (
        <div className="card p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium text-text-primary/70 mb-2">Text *</label><input type="text" value={form.text} onChange={e => setForm({...form, text: e.target.value})} className="input-field" placeholder="🔥 Use code WELCOME10 for 10% off!" required /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-text-primary/70 mb-2">Link (optional)</label><input type="text" value={form.link} onChange={e => setForm({...form, link: e.target.value})} className="input-field" placeholder="/category/smartphones" /></div>
              <div><label className="block text-sm font-medium text-text-primary/70 mb-2">Background Color</label><input type="color" value={form.bgColor} onChange={e => setForm({...form, bgColor: e.target.value})} className="w-full h-10 rounded cursor-pointer" /></div>
            </div>
            <button type="submit" className="btn-primary text-sm">Create Banner</button>
          </form>
        </div>
      )}
      <div className="card overflow-hidden"><div className="overflow-x-auto"><table className="w-full min-w-[600px]"><thead><tr className="border-b border-secondary-light"><th className="text-left text-xs font-medium text-text-primary/50 uppercase px-4 sm:px-6 py-3">Text</th><th className="text-left text-xs font-medium text-text-primary/50 uppercase px-4 sm:px-6 py-3">Link</th><th className="text-left text-xs font-medium text-text-primary/50 uppercase px-4 sm:px-6 py-3">Status</th><th className="text-left text-xs font-medium text-text-primary/50 uppercase px-4 sm:px-6 py-3">Actions</th></tr></thead><tbody>{banners.map((b: any) => (<tr key={b.id} className="border-b border-secondary-light"><td className="px-4 sm:px-6 py-3 text-sm">{b.text}</td><td className="px-4 sm:px-6 py-3 text-sm text-text-primary/40">{b.link || "-"}</td><td className="px-4 sm:px-6 py-3"><button onClick={() => toggleActive(b.id, b.isActive)} className={`badge text-xs ${b.isActive ? "badge-success" : "badge-error"}`}>{b.isActive ? "Active" : "Inactive"}</button></td><td className="px-4 sm:px-6 py-3"><button onClick={() => deleteBanner(b.id)} className="text-xs text-error hover:underline">Delete</button></td></tr>))}</tbody></table></div></div>
    </div>
  );
}