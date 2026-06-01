"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Order {
  id: string;
  orderNumber: string;
  user: { firstName: string; lastName: string; email: string };
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  address: { firstName: string; lastName: string; phone: string; address: string; city: string; state: string; postcode: string; country: string } | null;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = () => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((d) => { setOrders(d.orders || []); setLoading(false); });
  };

  const updateOrderStatus = async (id: string, status: string) => {
    // 1. Mettre à jour le statut en BDD
    await fetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    // 2. Envoyer l'email automatiquement
    await fetch("/api/admin/notify-customer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: id, status }),
    });

    // 3. Mettre à jour l'UI
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    setMessage(`Order ${status.toLowerCase()} - email sent to customer`);
    setTimeout(() => setMessage(""), 3000);
  };

  const statuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

  if (loading) return <div className="p-8"><p className="text-text-primary/50">Loading...</p></div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-xl sm:text-2xl font-heading font-bold">Orders ({orders.length})</h1>
        <Link href="/admin" className="btn-secondary text-sm">← Back</Link>
      </div>

      {message && <div className="bg-success/10 border border-success/30 text-success text-sm p-3 rounded-md mb-4">{message}</div>}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-secondary-light">
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-3 sm:px-6 py-3">Order</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-3 sm:px-6 py-3 hidden sm:table-cell">Customer</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-3 sm:px-6 py-3">Total</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-3 sm:px-6 py-3">Status</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-3 sm:px-6 py-3 hidden md:table-cell">Payment</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <>
                  <tr key={order.id} className="border-b border-secondary-light hover:bg-secondary-dark/30">
                    <td className="px-3 sm:px-6 py-3 text-sm font-mono font-medium text-accent">
                      <button onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)} className="hover:underline text-left">
                        {order.orderNumber}
                      </button>
                    </td>
                    <td className="px-3 sm:px-6 py-3 text-sm hidden sm:table-cell">
                      {order.user.firstName} {order.user.lastName}
                    </td>
                    <td className="px-3 sm:px-6 py-3 text-sm font-medium">${Number(order.total).toLocaleString()}</td>
                    <td className="px-3 sm:px-6 py-3">
                      <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)} className="bg-secondary border border-secondary-light rounded px-2 py-1 text-xs">
                        {statuses.map((s) => (<option key={s} value={s}>{s}</option>))}
                      </select>
                    </td>
                    <td className="px-3 sm:px-6 py-3 hidden md:table-cell">
                      <span className={`badge text-xs ${order.paymentStatus === "CONFIRMED" ? "badge-success" : "badge-warning"}`}>{order.paymentStatus}</span>
                    </td>
                  </tr>
                  {expandedOrder === order.id && order.address && (
                    <tr key={`${order.id}-details`} className="bg-secondary-dark/30">
                      <td colSpan={5} className="px-3 sm:px-6 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-text-primary mb-2">📦 Shipping Address</p>
                            <p className="text-text-primary/60">{order.address.firstName} {order.address.lastName}</p>
                            <p className="text-text-primary/60">{order.address.address}</p>
                            <p className="text-text-primary/60">{order.address.city}, {order.address.state} {order.address.postcode}</p>
                            <p className="text-text-primary/60">{order.address.country}</p>
                          </div>
                          <div>
                            <p className="font-medium text-text-primary mb-2">📞 Contact</p>
                            <p className="text-text-primary/60">{order.user.email}</p>
                            <p className="text-text-primary/60">{order.address.phone}</p>
                          </div>
                          <div>
                            <p className="font-medium text-text-primary mb-2">💳 Payment</p>
                            <p className="text-text-primary/60">Method: {order.paymentMethod === "crypto" ? "Cryptocurrency" : "Card/PayPal"}</p>
                            <p className="text-text-primary/60">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}