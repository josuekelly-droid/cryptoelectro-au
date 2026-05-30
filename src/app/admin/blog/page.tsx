"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: "", excerpt: "", content: "", category: "Tech", image: "", author: "", published: false });

  const fetchPosts = () => {
    fetch("/api/admin/blog").then(r => r.json()).then(d => setPosts(d.posts || []));
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editing ? `/api/admin/blog/${editing.id}` : "/api/admin/blog";
    const method = editing ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setShowForm(false);
    setEditing(null);
    setForm({ title: "", excerpt: "", content: "", category: "Tech", image: "", author: "", published: false });
    fetchPosts();
  };

  const handleEdit = (post: any) => {
    setEditing(post);
    setForm({ title: post.title, excerpt: post.excerpt, content: post.content, category: post.category, image: post.image || "", author: post.author, published: post.published });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    fetchPosts();
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading font-bold">Blog Posts</h1>
        <div className="flex gap-3">
          <Link href="/admin" className="btn-secondary text-sm">← Back</Link>
          <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ title: "", excerpt: "", content: "", category: "Tech", image: "", author: "", published: false }); }} className="btn-primary text-sm">+ New Post</button>
        </div>
      </div>

      {showForm && (
        <div className="card p-6 mb-8">
          <h2 className="text-lg font-heading font-bold mb-4">{editing ? "Edit Post" : "New Post"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-text-primary/70 mb-2">Title *</label><input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input-field" required /></div>
              <div><label className="block text-sm font-medium text-text-primary/70 mb-2">Category</label><select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input-field"><option>Tech</option><option>Crypto</option><option>Gaming</option><option>Lifestyle</option></select></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-text-primary/70 mb-2">Author</label><input type="text" value={form.author} onChange={e => setForm({...form, author: e.target.value})} className="input-field" /></div>
              <div><label className="block text-sm font-medium text-text-primary/70 mb-2">Image URL</label><input type="text" value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="input-field" /></div>
            </div>
            <div><label className="block text-sm font-medium text-text-primary/70 mb-2">Excerpt</label><textarea value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} className="input-field" rows={2} /></div>
            <div><label className="block text-sm font-medium text-text-primary/70 mb-2">Content *</label><textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="input-field" rows={8} required /></div>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.published} onChange={e => setForm({...form, published: e.target.checked})} /><span className="text-sm">Published</span></label>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary text-sm">{editing ? "Update" : "Create"}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-secondary-light">
              <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Title</th>
              <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Category</th>
              <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Author</th>
              <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Status</th>
              <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p: any) => (
              <tr key={p.id} className="border-b border-secondary-light">
                <td className="px-6 py-4 text-sm font-medium">{p.title}</td>
                <td className="px-6 py-4 text-sm text-text-primary/60">{p.category}</td>
                <td className="px-6 py-4 text-sm text-text-primary/60">{p.author}</td>
                <td className="px-6 py-4">{p.published ? <span className="badge badge-success text-xs">Published</span> : <span className="badge badge-warning text-xs">Draft</span>}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button onClick={() => handleEdit(p)} className="text-xs text-accent hover:underline">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="text-xs text-error hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}