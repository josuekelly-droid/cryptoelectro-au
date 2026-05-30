"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const updateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(""); setError("");
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (res.ok) setMessage("Email updated successfully!");
    else setError(data.error || "Failed to update email");
  };

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(""); setError("");
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } else {
      setError(data.error || "Failed to update password");
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading font-bold">Settings</h1>
        <Link href="/admin" className="btn-secondary text-sm">← Back</Link>
      </div>

      {message && <div className="bg-success/10 border border-success/30 text-success text-sm p-3 rounded-md mb-4">{message}</div>}
      {error && <div className="bg-error/10 border border-error/30 text-error text-sm p-3 rounded-md mb-4">{error}</div>}

      <div className="space-y-8">
        <div className="card p-6">
          <h2 className="text-lg font-heading font-bold mb-4">Update Email</h2>
          <form onSubmit={updateEmail} className="space-y-4">
            <div><label className="block text-sm font-medium text-text-primary/70 mb-2">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field" required /></div>
            <button type="submit" className="btn-primary text-sm">Update Email</button>
          </form>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-heading font-bold mb-4">Change Password</h2>
          <form onSubmit={updatePassword} className="space-y-4">
            <div><label className="block text-sm font-medium text-text-primary/70 mb-2">Current Password</label><input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="input-field" required /></div>
            <div><label className="block text-sm font-medium text-text-primary/70 mb-2">New Password</label><input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="input-field" required minLength={8} /></div>
            <button type="submit" className="btn-primary text-sm">Change Password</button>
          </form>
        </div>
      </div>
    </div>
  );
}