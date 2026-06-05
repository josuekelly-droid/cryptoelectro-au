"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ExpiredOrderMessage from "@/components/dashboard/ExpiredOrderMessage";

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: string;
  paymentMethod: string;
  cryptoCurrency: string | null;
  paymentStatus: string;
  items: {
    id: string;
    quantity: number;
    price: number;
    color: string | null;
    product: {
      id: string;
      name: string;
      slug: string;
      images: { url: string }[];
      brand: { name: string } | string;
    };
  }[];
}

interface Stats {
  totalOrders: number;
  wishlistItems: number;
  reviewsWritten: number;
  rewardPoints: number;
}

interface RewardData {
  points: number;
  tier: string;
  tierInfo: { min: number; discount: number; color: string; label: string };
  nextTier: string | null;
  pointsToNext: number;
  discount: number;
  allTiers: { name: string; min: number; discount: number; color: string; label: string; current: boolean; achieved: boolean }[];
}

export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>({ totalOrders: 0, wishlistItems: 0, reviewsWritten: 0, rewardPoints: 0 });
  const [rewardData, setRewardData] = useState<RewardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "settings">("overview");

  // Change Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const ordersRes = await fetch("/api/orders");
      const ordersData = await ordersRes.json();
      const userOrders = ordersData.orders || [];
      setOrders(userOrders);

      const wishlistItems = JSON.parse(localStorage.getItem("wishlist") || "[]").length;

      const reviewsRes = await fetch("/api/reviews?userId=" + user?.id);
      const reviewsData = await reviewsRes.json();
      const reviewsWritten = (reviewsData.reviews || []).length;

      const rewardsRes = await fetch("/api/rewards");
      const rewardsJson = await rewardsRes.json();
      if (rewardsRes.ok) {
        setRewardData(rewardsJson);
        setStats({
          totalOrders: userOrders.length,
          wishlistItems,
          reviewsWritten,
          rewardPoints: rewardsJson.points || 0,
        });
      } else {
        setStats({ totalOrders: userOrders.length, wishlistItems, reviewsWritten, rewardPoints: 0 });
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    }
    setLoading(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage("");
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    setPasswordLoading(true);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    if (res.ok) {
      setPasswordMessage("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setPasswordError(data.error || "Failed to update password");
    }
    setPasswordLoading(false);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; label: string }> = {
      PENDING: { color: "badge-warning", label: "Pending" },
      CONFIRMED: { color: "badge-success", label: "Confirmed" },
      PROCESSING: { color: "badge-accent", label: "Processing" },
      SHIPPED: { color: "badge-accent", label: "Shipped" },
      DELIVERED: { color: "badge-success", label: "Delivered" },
      CANCELLED: { color: "badge-error", label: "Cancelled" },
    };
    const s = statusMap[status] || { color: "badge-warning", label: status };
    return <span className={`badge ${s.color} text-xs`}>{s.label}</span>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; label: string }> = {
      PENDING: { color: "badge-warning", label: "Payment Pending" },
      WAITING_CONFIRMATION: { color: "badge-warning", label: "Confirming" },
      CONFIRMED: { color: "badge-success", label: "Paid" },
      EXPIRED: { color: "badge-error", label: "Expired" },
      FAILED: { color: "badge-error", label: "Failed" },
      REFUNDED: { color: "badge-error", label: "Refunded" },
    };
    const s = statusMap[status] || { color: "badge-warning", label: status };
    return <span className={`badge ${s.color} text-xs`}>{s.label}</span>;
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin w-8 h-8 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-text-primary/50">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-text-primary/30">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        </div>
        <h2 className="text-2xl font-heading font-bold mb-2">Please Sign In</h2>
        <p className="text-text-primary/50 mb-6">Access your dashboard to view orders, wishlist, and rewards.</p>
        <Link href="/login" className="btn-primary">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Dashboard" }]} />

      <ExpiredOrderMessage />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-heading font-bold">Welcome back, {user.firstName} 👋</h1>
          <p className="mt-1 text-text-primary/50">{user.email} · {user.role === "ADMIN" ? "Administrator" : "Customer"}</p>
        </div>
        <div className="flex gap-3">
          {user.role === "ADMIN" && <Link href="/admin" className="btn-secondary text-sm">Admin Panel</Link>}
          <Link href="/category/all" className="btn-primary text-sm">Shop Now</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Orders", value: stats.totalOrders.toString(), icon: "📦" },
          { label: "Wishlist Items", value: stats.wishlistItems.toString(), icon: "❤️" },
          { label: "Reviews Written", value: stats.reviewsWritten.toString(), icon: "⭐" },
          { label: "Reward Points", value: stats.rewardPoints.toLocaleString(), icon: "🏆" },
        ].map((stat) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-5 sm:p-6 text-center">
            <span className="text-2xl sm:text-3xl">{stat.icon}</span>
            <p className="text-2xl sm:text-3xl font-heading font-bold mt-2">{stat.value}</p>
            <p className="text-xs sm:text-sm text-text-primary/50 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Loyalty Rewards Card */}
      {rewardData && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6 mb-8 bg-gradient-to-br from-accent/5 to-secondary">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-heading font-bold">Loyalty Rewards</h2>
              <p className="text-sm text-text-primary/50">Earn points on every purchase and unlock exclusive discounts</p>
            </div>
            <span className={`badge text-sm font-bold px-4 py-2 ${
              rewardData.tier === "DIAMOND" ? "bg-accent text-white" :
              rewardData.tier === "PLATINUM" ? "bg-purple-500/20 text-purple-400" :
              rewardData.tier === "GOLD" ? "badge-warning" :
              rewardData.tier === "SILVER" ? "bg-gray-300/20 text-gray-300" :
              "badge-accent"
            }`}>
              {rewardData.tierInfo.label} · {rewardData.discount}% Discount
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-secondary rounded-lg">
              <p className="text-3xl font-heading font-bold text-accent">{rewardData.points.toLocaleString()}</p>
              <p className="text-xs text-text-primary/50 mt-1">Total Points</p>
            </div>
            <div className="text-center p-4 bg-secondary rounded-lg">
              <p className="text-3xl font-heading font-bold text-success">{rewardData.discount}%</p>
              <p className="text-xs text-text-primary/50 mt-1">Current Discount</p>
            </div>
            <div className="text-center p-4 bg-secondary rounded-lg">
              <p className="text-3xl font-heading font-bold text-warning">{rewardData.pointsToNext.toLocaleString()}</p>
              <p className="text-xs text-text-primary/50 mt-1">To {rewardData.nextTier || "Max Tier"}</p>
            </div>
          </div>

          <div className="h-2 bg-secondary rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-accent to-success rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, (rewardData.points / (rewardData.points + rewardData.pointsToNext || 1)) * 100)}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-text-primary/40 px-1">
            {rewardData.allTiers.map((tier: any) => (
              <span key={tier.name} className={`${tier.achieved ? "text-accent font-bold" : ""}`}>
                {tier.label}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="border-b border-secondary-light mb-8">
        <div className="flex gap-6 overflow-x-auto">
          {(["overview", "orders", "settings"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-4 text-sm font-heading font-semibold capitalize border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? "border-accent text-accent" : "border-transparent text-text-primary/50 hover:text-text-primary"}`}>{tab}</button>
          ))}
        </div>
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-heading font-bold">Recent Orders</h2>
              {orders.length > 3 && <button onClick={() => setActiveTab("orders")} className="text-sm text-accent hover:underline">View All ({orders.length})</button>}
            </div>
            {orders.length > 0 ? (
              <div className="space-y-3">
                {orders.slice(0, 3).map((order) => (
                  <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-5 hover:border-accent/20 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono font-medium text-accent">{order.orderNumber}</span>
                        <span className="text-xs text-text-primary/30">·</span>
                        <span className="text-xs text-text-primary/50">{new Date(order.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}</span>
                      </div>
                      <div className="flex items-center gap-2">{getStatusBadge(order.status)}{getPaymentStatusBadge(order.paymentStatus)}</div>
                    </div>
                    <div className="flex flex-wrap gap-3 mb-3">
                      {order.items.slice(0, 3).map((item) => {
                        const img = item.product.images && item.product.images.length > 0 ? item.product.images[0].url : null;
                        return (
                          <div key={item.id} className="flex items-center gap-2 bg-secondary-dark/50 rounded-lg p-2">
                            <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center overflow-hidden flex-shrink-0">
                              {img ? <img src={img} alt={item.product.name} className="w-full h-full object-cover" /> : <span className="text-xs font-bold text-text-primary/20">{typeof item.product.brand === "object" ? (item.product.brand as { name: string }).name.charAt(0) : String(item.product.brand || "?").charAt(0)}</span>}
                            </div>
                            <div className="min-w-0"><p className="text-xs font-medium line-clamp-1">{item.product.name}</p><p className="text-xs text-text-primary/40">Qty: {item.quantity}</p></div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-secondary-light">
                      <div className="text-xs text-text-primary/50">{order.items.length} {order.items.length === 1 ? "item" : "items"} · {order.paymentMethod === "crypto" ? `Paid with ${order.cryptoCurrency || "Crypto"}` : "Card"}</div>
                      <span className="text-sm font-heading font-bold">${Number(order.total).toLocaleString()}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="card p-12 text-center">
                <span className="text-4xl mb-4 block">📦</span>
                <h3 className="text-lg font-heading font-semibold mb-2">No Orders Yet</h3>
                <p className="text-text-primary/50 mb-4">Start shopping and your orders will appear here.</p>
                <Link href="/category/smartphones" className="btn-primary text-sm">Browse Products</Link>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-heading font-bold mb-4">Quick Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Browse Products", desc: "Shop premium electronics", href: "/category/smartphones", icon: "🛒" },
                { label: "My Wishlist", desc: `${stats.wishlistItems} saved items`, href: "/dashboard/wishlist", icon: "❤️" },
                { label: "Affiliate Program", desc: "Earn 5% commission", href: "/dashboard/affiliate", icon: "💰" },
                { label: "Referral Program", desc: "Earn $10 per friend", href: "/dashboard/referral", icon: "🎁" },
                { label: "Need Help?", desc: "Contact our support team", href: "/contact", icon: "💬" },
              ].map((link) => (
                <Link key={link.label} href={link.href} className="card p-5 flex items-center gap-4 hover:border-accent/30 transition-all group">
                  <span className="text-2xl">{link.icon}</span>
                  <div><p className="font-heading font-semibold group-hover:text-accent transition-colors">{link.label}</p><p className="text-xs text-text-primary/50">{link.desc}</p></div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-xl font-heading font-bold mb-6">All Orders ({orders.length})</h2>
          {orders.length > 0 ? (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="card p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono font-medium text-accent">{order.orderNumber}</span>
                      <span className="text-xs text-text-primary/30">·</span>
                      <span className="text-xs text-text-primary/50">{new Date(order.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}</span>
                    </div>
                    <div className="flex items-center gap-2">{getStatusBadge(order.status)}{getPaymentStatusBadge(order.paymentStatus)}</div>
                  </div>
                  <div className="flex flex-wrap gap-3 mb-3">
                    {order.items.map((item) => {
                      const img = item.product.images && item.product.images.length > 0 ? item.product.images[0].url : null;
                      return (
                        <div key={item.id} className="flex items-center gap-2 bg-secondary-dark/50 rounded-lg p-2">
                          <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center overflow-hidden flex-shrink-0">
                            {img ? <img src={img} alt={item.product.name} className="w-full h-full object-cover" /> : <span className="text-xs font-bold text-text-primary/20">{typeof item.product.brand === "object" ? (item.product.brand as { name: string }).name.charAt(0) : String(item.product.brand || "?").charAt(0)}</span>}
                          </div>
                          <div className="min-w-0"><Link href={`/product/${item.product.slug || item.product.id}`} className="text-xs font-medium line-clamp-1 hover:text-accent">{item.product.name}</Link><p className="text-xs text-text-primary/40">Qty: {item.quantity} × ${Number(item.price).toLocaleString()}</p></div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-secondary-light">
                    <div><p className="text-xs text-text-primary/40">Subtotal</p><p className="text-sm font-medium">${Number(order.subtotal).toLocaleString()}</p></div>
                    <div><p className="text-xs text-text-primary/40">Shipping</p><p className="text-sm font-medium">{Number(order.shipping) === 0 ? "Free" : `$${Number(order.shipping).toFixed(2)}`}</p></div>
                    <div><p className="text-xs text-text-primary/40">Tax</p><p className="text-sm font-medium">${Number(order.tax).toFixed(2)}</p></div>
                    <div><p className="text-xs text-text-primary/40">Total</p><p className="text-sm font-heading font-bold">${Number(order.total).toLocaleString()}</p></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <span className="text-4xl mb-4 block">📦</span>
              <h3 className="text-lg font-heading font-semibold mb-2">No Orders Yet</h3>
              <p className="text-text-primary/50 mb-4">Start shopping and your orders will appear here.</p>
              <Link href="/category/smartphones" className="btn-primary text-sm">Browse Products</Link>
            </div>
          )}
        </motion.div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg space-y-8">
          {/* Account Info */}
          <div className="card p-6 space-y-4">
            <h2 className="text-xl font-heading font-bold">Account Information</h2>
            <div><label className="block text-sm font-medium text-text-primary/70 mb-2">Name</label><input type="text" value={`${user.firstName} ${user.lastName}`} className="input-field" disabled /></div>
            <div><label className="block text-sm font-medium text-text-primary/70 mb-2">Email</label><input type="email" value={user.email} className="input-field" disabled /></div>
            <div><label className="block text-sm font-medium text-text-primary/70 mb-2">Role</label><input type="text" value={user.role} className="input-field" disabled /></div>
          </div>

          {/* Change Password */}
          <div className="card p-6 space-y-4">
            <h2 className="text-xl font-heading font-bold">Change Password</h2>
            {passwordMessage && <div className="bg-success/10 border border-success/30 text-success text-sm p-3 rounded-md">{passwordMessage}</div>}
            {passwordError && <div className="bg-error/10 border border-error/30 text-error text-sm p-3 rounded-md">{passwordError}</div>}
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary/70 mb-2">Current Password</label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary/70 mb-2">New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input-field" required minLength={8} placeholder="Min. 8 characters" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary/70 mb-2">Confirm New Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field" required minLength={8} />
              </div>
              <button type="submit" className="btn-primary text-sm" disabled={passwordLoading}>
                {passwordLoading ? "Updating..." : "Change Password"}
              </button>
            </form>
          </div>

          {/* Logout */}
          <div className="card p-6">
            <button onClick={async () => { await logout(); window.location.href = "/"; }} className="btn-secondary text-sm text-error border-error/30 hover:bg-error/10 w-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2 inline"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" /></svg>
              Sign Out
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}