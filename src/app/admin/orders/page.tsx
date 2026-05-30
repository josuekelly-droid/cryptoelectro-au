"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Order {
  id: string;
  orderNumber: string;
  user: { firstName: string; lastName: string };
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((d) => {
        setOrders(d.orders || []);
        setLoading(false);
      });
  }, []);

  const updateOrderStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  };

  const statuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading font-bold">Orders</h1>
        <Link href="/admin" className="btn-secondary text-sm">← Back</Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary-light">
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Order</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Customer</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Total</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Status</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Payment</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-secondary-light hover:bg-secondary-dark/30">
                  <td className="px-6 py-4 text-sm font-mono font-medium text-accent">{order.orderNumber}</td>
                  <td className="px-6 py-4 text-sm">{order.user.firstName} {order.user.lastName}</td>
                  <td className="px-6 py-4 text-sm font-medium">${Number(order.total).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="bg-secondary border border-secondary-light rounded px-2 py-1 text-xs"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge text-xs ${order.paymentStatus === "CONFIRMED" ? "badge-success" : "badge-warning"}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-primary/40">
                    {new Date(order.createdAt).toLocaleDateString()}
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