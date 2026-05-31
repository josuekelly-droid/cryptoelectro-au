"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  const fetchCustomers = useCallback(() => {
    fetch("/api/admin/customers")
      .then((r) => r.json())
      .then((d) => setCustomers(d.customers || []));
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const toggleBlock = async (id: string, currentStatus: boolean, email: string) => {
    if (!confirm(`${currentStatus ? "Unblock" : "Block"} user ${email}?`)) return;

    const res = await fetch(`/api/admin/users/${id}/block`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isBlocked: !currentStatus }),
    });

    if (res.ok) {
      setMessage(`${email} ${currentStatus ? "unblocked" : "blocked"} successfully!`);
      setTimeout(() => setMessage(""), 3000);
      fetchCustomers();
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading font-bold">Customers</h1>
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
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Name</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Email</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Orders</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Status</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Joined</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c: any) => (
                <tr key={c.id} className="border-b border-secondary-light">
                  <td className="px-6 py-4 text-sm">{c.firstName} {c.lastName}</td>
                  <td className="px-6 py-4 text-sm text-text-primary/60">{c.email}</td>
                  <td className="px-6 py-4 text-sm">{c._count.orders}</td>
                  <td className="px-6 py-4">
                    {c.isBlocked ? (
                      <span className="badge badge-error text-xs">Blocked</span>
                    ) : (
                      <span className="badge badge-success text-xs">Active</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-primary/40">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleBlock(c.id, c.isBlocked, c.email)}
                      className={`text-xs font-medium hover:underline ${
                        c.isBlocked ? "text-success" : "text-error"
                      }`}
                    >
                      {c.isBlocked ? "Unblock" : "Block"}
                    </button>
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