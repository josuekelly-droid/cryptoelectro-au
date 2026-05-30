"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((r) => r.json())
      .then((d) => setCustomers(d.customers || []));
  }, []);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading font-bold">Customers</h1>
        <Link href="/admin" className="btn-secondary text-sm">← Back</Link>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary-light">
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Name</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Email</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Orders</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c: any) => (
                <tr key={c.id} className="border-b border-secondary-light">
                  <td className="px-6 py-4 text-sm">{c.firstName} {c.lastName}</td>
                  <td className="px-6 py-4 text-sm text-text-primary/60">{c.email}</td>
                  <td className="px-6 py-4 text-sm">{c._count.orders}</td>
                  <td className="px-6 py-4 text-sm text-text-primary/40">{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}