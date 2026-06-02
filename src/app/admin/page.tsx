"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalProducts: 0, totalCustomers: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        setStats({
          totalRevenue: d.totalRevenue || 0,
          totalOrders: d.totalOrders || 0,
          totalProducts: d.totalProducts || 0,
          totalCustomers: d.totalCustomers || 0,
        });
        setRecentOrders(d.recentOrders || []);
        setLoading(false);
      });
  }, []);

  const menuItems = [
    { icon: "📊", label: "Dashboard", href: "/admin" },
    { icon: "📦", label: "Products", href: "/admin/products" },
    { icon: "🎫", label: "Coupons", href: "/admin/coupons" },
    { icon: "📢", label: "Banners", href: "/admin/banners" },
    { icon: "⚡", label: "Deals", href: "/admin/deals" },
    { icon: "🛒", label: "Orders", href: "/admin/orders" },
    { icon: "👥", label: "Customers", href: "/admin/customers" },
    { icon: "⭐", label: "Reviews", href: "/admin/reviews" },
    { icon: "💸", label: "Withdrawals", href: "/admin/withdrawals" },
    { icon: "💼", label: "Careers", href: "/admin/careers" },
    { icon: "📝", label: "Blog", href: "/admin/blog" },
    { icon: "🔍", label: "Audit Logs", href: "/admin/audit" },
    { icon: "⚙️", label: "Settings", href: "/admin/settings" },
  ];

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "badge-warning", CONFIRMED: "badge-success", PROCESSING: "badge-accent",
      SHIPPED: "badge-accent", DELIVERED: "badge-success", CANCELLED: "badge-error",
    };
    return <span className={`badge ${colors[status] || "badge-warning"} text-xs`}>{status}</span>;
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-secondary-dark border-r border-secondary-light transition-all duration-300 flex-shrink-0 hidden lg:block`}>
        <div className="p-6">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-lg font-heading font-bold text-gradient">CE</span>
            {sidebarOpen && <span className="text-sm text-text-primary/50">Admin Panel</span>}
          </Link>
        </div>
        <nav className="px-3 space-y-1">
          {menuItems.map((item) => (
            <Link key={item.label} href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-text-primary/60 hover:text-text-primary hover:bg-secondary transition-colors">
              <span>{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <aside className="fixed top-0 left-0 z-50 w-64 h-full bg-secondary-dark border-r border-secondary-light lg:hidden">
          <div className="p-6 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="text-lg font-heading font-bold text-gradient">CE</span>
              <span className="text-sm text-text-primary/50">Admin Panel</span>
            </Link>
            <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-text-primary/60 hover:text-text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <nav className="px-3 space-y-1">
            {menuItems.map((item) => (
              <Link key={item.label} href={item.href} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-text-primary/60 hover:text-text-primary hover:bg-secondary transition-colors">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>
      )}

      {/* Main */}
      <div className="flex-1 overflow-x-hidden">
        <div className="bg-secondary-dark border-b border-secondary-light p-4 flex items-center justify-between">
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-text-primary/60 hover:text-text-primary transition-colors lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
          </button>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-text-primary/60 hover:text-text-primary transition-colors hidden lg:block">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
          </button>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-text-primary/40 hover:text-accent transition-colors">View Site</Link>
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
              <span className="text-xs font-bold text-white">A</span>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold mb-6 lg:mb-8">Dashboard</h1>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 lg:mb-8">
            {[
              { label: "Total Revenue", value: `$${Number(stats.totalRevenue).toLocaleString()}`, icon: "💰" },
              { label: "Total Orders", value: stats.totalOrders.toString(), icon: "📦" },
              { label: "Products", value: stats.totalProducts.toString(), icon: "🛍️" },
              { label: "Customers", value: stats.totalCustomers.toString(), icon: "👥" },
            ].map((stat) => (
              <div key={stat.label} className="card p-4 sm:p-6">
                <p className="text-xs sm:text-sm text-text-primary/50">{stat.label}</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="card overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-secondary-light flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-heading font-bold">Recent Orders</h2>
              <Link href="/admin/orders" className="text-xs sm:text-sm text-accent hover:text-accent-hover">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-secondary-light">
                    <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-4 sm:px-6 py-3">Order</th>
                    <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-4 sm:px-6 py-3">Customer</th>
                    <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-4 sm:px-6 py-3">Total</th>
                    <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-4 sm:px-6 py-3">Status</th>
                    <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-4 sm:px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order: any) => (
                    <tr key={order.id} className="border-b border-secondary-light hover:bg-secondary-dark/30">
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-mono font-medium text-accent">{order.orderNumber}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-text-primary/60">{order.user?.firstName} {order.user?.lastName}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium">${Number(order.total).toLocaleString()}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">{getStatusBadge(order.status)}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-text-primary/40">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}