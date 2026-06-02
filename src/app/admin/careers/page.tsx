"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminCareersPage() {
  const [careers, setCareers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    title: "", department: "", location: "", type: "Full-time",
    description: "", requirements: "", salary: "", isActive: true,
  });

  const fetchCareers = () => {
    fetch("/api/admin/careers").then(r => r.json()).then(d => setCareers(d.careers || []));
  };

  useEffect(() => { fetchCareers(); }, []);

  const resetForm = () => {
    setForm({ title: "", department: "", location: "", type: "Full-time", description: "", requirements: "", salary: "", isActive: true });
    setEditing(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editing ? `/api/admin/careers/${editing.id}` : "/api/admin/careers";
    const method = editing ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setShowForm(false);
    resetForm();
    fetchCareers();
  };

  const handleEdit = (career: any) => {
    setEditing(career);
    setForm({
      title: career.title, department: career.department, location: career.location,
      type: career.type, description: career.description, requirements: career.requirements,
      salary: career.salary || "", isActive: career.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this job posting?")) return;
    await fetch(`/api/admin/careers/${id}`, { method: "DELETE" });
    fetchCareers();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-xl sm:text-2xl font-heading font-bold">Careers</h1>
        <div className="flex gap-3">
          <Link href="/admin" className="btn-secondary text-sm">← Back</Link>
          <button onClick={() => { setShowForm(!showForm); resetForm(); }} className="btn-primary text-sm">+ New Job</button>
        </div>
      </div>

      {showForm && (
        <div className="card p-4 sm:p-6 mb-8">
          <h2 className="text-lg font-heading font-bold mb-4">{editing ? "Edit Job" : "New Job"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-text-primary/70 mb-2">Title *</label><input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input-field" required /></div>
              <div><label className="block text-sm font-medium text-text-primary/70 mb-2">Department</label><input type="text" value={form.department} onChange={e => setForm({...form, department: e.target.value})} className="input-field" /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div><label className="block text-sm font-medium text-text-primary/70 mb-2">Location</label><input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="input-field" /></div>
              <div><label className="block text-sm font-medium text-text-primary/70 mb-2">Type</label><select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="input-field"><option>Full-time</option><option>Part-time</option><option>Contract</option><option>Remote</option></select></div>
              <div><label className="block text-sm font-medium text-text-primary/70 mb-2">Salary</label><input type="text" value={form.salary} onChange={e => setForm({...form, salary: e.target.value})} className="input-field" placeholder="e.g. $80,000 - $100,000" /></div>
            </div>
            <div><label className="block text-sm font-medium text-text-primary/70 mb-2">Description *</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-field" rows={5} required /></div>
            <div><label className="block text-sm font-medium text-text-primary/70 mb-2">Requirements</label><textarea value={form.requirements} onChange={e => setForm({...form, requirements: e.target.value})} className="input-field" rows={4} /></div>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} /><span className="text-sm">Active</span></label>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary text-sm">{editing ? "Update" : "Create"}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Tableau responsive */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-secondary-light">
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-4 sm:px-6 py-3">Title</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-4 sm:px-6 py-3 hidden sm:table-cell">Department</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-4 sm:px-6 py-3 hidden md:table-cell">Location</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-4 sm:px-6 py-3">Type</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-4 sm:px-6 py-3">Status</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-4 sm:px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {careers.map((c: any) => (
                <tr key={c.id} className="border-b border-secondary-light">
                  <td className="px-4 sm:px-6 py-3 text-sm font-medium max-w-[150px] sm:max-w-none truncate">{c.title}</td>
                  <td className="px-4 sm:px-6 py-3 text-sm text-text-primary/60 hidden sm:table-cell">{c.department}</td>
                  <td className="px-4 sm:px-6 py-3 text-sm text-text-primary/60 hidden md:table-cell">{c.location}</td>
                  <td className="px-4 sm:px-6 py-3 text-sm">{c.type}</td>
                  <td className="px-4 sm:px-6 py-3">{c.isActive ? <span className="badge badge-success text-xs">Active</span> : <span className="badge badge-error text-xs">Inactive</span>}</td>
                  <td className="px-4 sm:px-6 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(c)} className="text-xs text-accent hover:underline whitespace-nowrap">Edit</button>
                      <button onClick={() => handleDelete(c.id)} className="text-xs text-error hover:underline whitespace-nowrap">Delete</button>
                    </div>
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