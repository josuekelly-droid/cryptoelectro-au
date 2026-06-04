"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/hooks/useAuth";
import Breadcrumb from "@/components/ui/Breadcrumb";

type Step = "shipping" | "payment" | "processing" | "review";

declare global { interface Window { paypal?: any; } }

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("shipping");
  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postcode: "",
    country: "Australia",
  });
  const [paymentMethod, setPaymentMethod] = useState<"crypto" | "card">("crypto");
  const [selectedCrypto, setSelectedCrypto] = useState("TRX");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState("");
  const [paymentUrl, setPaymentUrl] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderSubtotal, setOrderSubtotal] = useState(0);
  const [orderTax, setOrderTax] = useState(0);
  const [loyaltyDiscount, setLoyaltyDiscount] = useState(0);
  const [storeCredit, setStoreCredit] = useState(0);
  const [useCredit, setUseCredit] = useState(false);
  const [savedTotalRef, setSavedTotalRef] = useState(0);
  const [savedOrderId, setSavedOrderId] = useState("");

  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");

  // ⏰ Compte à rebours
  const [orderExpiresAt, setOrderExpiresAt] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<{ minutes: number; seconds: number } | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  const shipping = subtotal > 500 ? 0 : 29.99;
  const tax = subtotal * 0.1;
  const discountAmount = (subtotal * loyaltyDiscount) / 100;
  const creditApplied = useCredit ? Math.min(storeCredit, subtotal + shipping + tax - discountAmount - couponDiscount) : 0;
  const total = Math.max(0, subtotal + shipping + tax - discountAmount - creditApplied - couponDiscount);

  const applyCoupon = async () => {
    setCouponError("");
    if (!couponCode.trim()) return;
    const res = await fetch("/api/coupons/validate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: couponCode, amount: subtotal }) });
    const data = await res.json();
    if (data.valid) { setCouponDiscount(data.discount); setAppliedCoupon(data.code); setCouponError(""); }
    else { setCouponError(data.error); setCouponDiscount(0); setAppliedCoupon(""); }
  };

  const loadStoreCredit = () => {
    fetch("/api/affiliate").then((r) => r.json()).then((d) => { if (d.affiliate?.storeCredit) setStoreCredit(Number(d.affiliate.storeCredit)); }).catch(() => {});
  };

  useEffect(() => {
    fetch("/api/rewards").then((r) => r.json()).then((d) => setLoyaltyDiscount(d.discount || 0)).catch(() => {});
    loadStoreCredit();
  }, []);

  // ⏰ Compte à rebours avec redirection automatique
  useEffect(() => {
    if (!orderExpiresAt) return;

    const expiryDate = new Date(orderExpiresAt).getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = expiryDate - now;

      if (difference <= 0) {
        setTimeLeft(null);
        setIsExpired(true);
        return;
      }

      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      setTimeLeft({ minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [orderExpiresAt]);

  // 🔴 Compte à rebours de redirection après expiration
  useEffect(() => {
    if (!isExpired) return;
    
    setRedirectCountdown(5);
    
    const redirectInterval = setInterval(() => {
      setRedirectCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(redirectInterval);
          window.location.href = "/dashboard";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(redirectInterval);
  }, [isExpired]);

  useEffect(() => {
    if (paymentMethod === "card" && step === "payment") {
      const container = document.getElementById("paypal-button-container");
      if (!container) return;
      container.innerHTML = "";
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test"}&currency=AUD&intent=capture`;
      script.onload = () => {
        if (window.paypal) {
          window.paypal.Buttons({
            createOrder: async () => {
              const res = await fetch("/api/paypal/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount: total, orderId: "pending" }) });
              const data = await res.json();
              return data.id;
            },
            onApprove: async (data: any) => { await createOrderBeforePayment(); await onPayPalApprove(data); },
            onError: (err: any) => { setError("Payment failed."); console.error(err); },
          }).render("#paypal-button-container");
        }
      };
      document.body.appendChild(script);
    }
  }, [paymentMethod, step, total]);

  const cryptos = [
    { symbol: "TRX", name: "TRON", icon: "🔷" },
    { symbol: "USDT", name: "Tether USD", icon: "₮" },
    { symbol: "USDC", name: "USD Coin", icon: "○" },
    { symbol: "BTC", name: "Bitcoin", icon: "₿" },
    { symbol: "ETH", name: "Ethereum", icon: "Ξ" },
    { symbol: "SOL", name: "Solana", icon: "◎" },
  ];

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShippingInfo({ ...shippingInfo, [e.target.id]: e.target.value });
  };

  const createOrderBeforePayment = async () => {
    if (!user) { setError("Please sign in."); return; }
    setIsProcessing(true); setError("");
    const orderItems = items.map((item) => ({ productId: item.product.id, color: item.color, quantity: item.quantity, price: Number(item.product.price) }));
    try {
      const addressRes = await fetch("/api/addresses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(shippingInfo) });
      if (!addressRes.ok) { setError("Failed to save address."); setIsProcessing(false); return; }
      const addressData = await addressRes.json();
      const savedCreditApplied = creditApplied; const savedUseCredit = useCredit;
      const orderRes = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ addressId: addressData.address.id, items: orderItems, paymentMethod: "card", shipping, tax, cryptoCurrency: null }) });
      if (!orderRes.ok) { setError("Failed."); setIsProcessing(false); return; }
      const orderData = await orderRes.json();
      if (savedUseCredit && savedCreditApplied > 0) { await fetch("/api/affiliate/withdraw", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "use_credit", amount: savedCreditApplied }) }); loadStoreCredit(); }
      if (appliedCoupon) { await fetch("/api/coupons/use", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: appliedCoupon }) }); }
      setOrderNumber(orderData.order.orderNumber); setOrderTotal(total); setOrderSubtotal(subtotal); setOrderTax(tax);
      setSavedOrderId(orderData.order.id); setSavedTotalRef(total);
      if (orderData.order.expiresAt) {
        setOrderExpiresAt(orderData.order.expiresAt);
      }
      clearCart(); setIsProcessing(false);
    } catch { setError("Network error."); setIsProcessing(false); }
  };

  const onPayPalApprove = async (data: any) => {
    setIsProcessing(true);
    try {
      await fetch(`/api/orders/${savedOrderId}/payment`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paymentId: data.orderID, cryptoAddress: "paypal", cryptoAmount: "0", paymentStatus: "CONFIRMED" }) });
      await fetch(`/api/orders/${savedOrderId}/confirm`, { method: "PUT" });
      setStep("review");
    } catch { setError("Payment confirmation failed."); }
    setIsProcessing(false);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true); setError("");
    if (!user) { setError("Please sign in."); setIsProcessing(false); return; }
    const orderItems = items.map((item) => ({ productId: item.product.id, color: item.color, quantity: item.quantity, price: Number(item.product.price) }));
    try {
      const addressRes = await fetch("/api/addresses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(shippingInfo) });
      if (!addressRes.ok) { setError("Failed to save address."); setIsProcessing(false); return; }
      const addressData = await addressRes.json();
      const savedTotal = total; const savedSubtotal = subtotal; const savedTax = tax;
      const savedCrypto = selectedCrypto; const savedCreditApplied = creditApplied; const savedUseCredit = useCredit;
      const savedCoupon = appliedCoupon;
      setSavedTotalRef(savedTotal);
      const orderRes = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ addressId: addressData.address.id, items: orderItems, cryptoCurrency: savedCrypto, shipping, tax: savedTax }) });
      if (!orderRes.ok) { setError("Failed."); setIsProcessing(false); return; }
      const orderData = await orderRes.json();
      const orderId = orderData.order.id; const newOrderNumber = orderData.order.orderNumber;
      if (orderData.order.expiresAt) {
        setOrderExpiresAt(orderData.order.expiresAt);
      }
      if (savedUseCredit && savedCreditApplied > 0) { await fetch("/api/affiliate/withdraw", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "use_credit", amount: savedCreditApplied }) }); loadStoreCredit(); }
      if (savedCoupon) { await fetch("/api/coupons/use", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: savedCoupon }) }); }
      if (savedTotal === 0) { await fetch(`/api/orders/${orderId}/payment`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paymentId: "store_credit", cryptoAddress: "store_credit", cryptoAmount: "0" }) }); await fetch(`/api/orders/${orderId}/confirm`, { method: "PUT" }); }
      setOrderNumber(newOrderNumber); setOrderTotal(savedTotal); setOrderSubtotal(savedSubtotal); setOrderTax(savedTax); clearCart();
      if (savedTotal > 0) {
        setStep("processing");
        const paymentRes = await fetch("/api/nowpayments/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ price: savedTotal, currency: savedCrypto, orderId: newOrderNumber }) });
        if (paymentRes.ok) { const pd = await paymentRes.json(); if (pd.pay_address) { await fetch(`/api/orders/${orderId}/payment`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paymentId: pd.payment_id, cryptoAddress: pd.pay_address, cryptoAmount: pd.pay_amount }) }); setPaymentUrl(pd.pay_address); setPaymentAmount(pd.pay_amount); } }
      }
      setStep("review");
    } catch { setError("Network error."); }
    setIsProcessing(false);
  };

  const steps: { id: Step; label: string }[] = [
    { id: "shipping", label: "Shipping" }, { id: "payment", label: "Payment" }, { id: "processing", label: "Processing" }, { id: "review", label: "Confirmation" },
  ];

  if (items.length === 0 && step !== "review") {
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><Breadcrumb items={[{ label: "Checkout" }]} /><div className="min-h-[50vh] flex flex-col items-center justify-center text-center py-16"><h2 className="text-2xl font-heading font-bold mb-2">Your Cart is Empty</h2><p className="text-text-primary/50 mb-8">Add some products before checking out.</p><Link href="/category/smartphones" className="btn-primary">Shop Now</Link></div></div>);
  }

  const currentStepIndex = steps.findIndex((st) => st.id === step);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Checkout" }]} />
      <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-8">Checkout</h1>
      <div className="flex items-center gap-4 mb-12">
        {steps.map((s, i) => (<div key={s.id} className="flex items-center gap-4"><div className={`flex items-center gap-2 ${step === s.id ? "text-accent" : currentStepIndex > i ? "text-success" : "text-text-primary/30"}`}><div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-heading font-bold ${step === s.id ? "bg-accent text-white" : currentStepIndex > i ? "bg-success text-white" : "bg-secondary text-text-primary/30"}`}>{currentStepIndex > i ? "✓" : i + 1}</div><span className="text-sm font-heading font-semibold hidden sm:inline">{s.label}</span></div>{i < steps.length - 1 && <div className={`w-8 h-px ${currentStepIndex > i ? "bg-success" : "bg-secondary-light"}`} />}</div>))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {step === "shipping" && (<motion.div key="shipping" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="card p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-heading font-bold">Shipping Information</h2>
              {!user && <div className="bg-warning/10 border border-warning/30 text-warning text-sm p-4 rounded-md"><p className="font-medium mb-1">Sign in required</p><p>Please <Link href="/login?redirect=/checkout" className="underline font-medium">sign in</Link> to continue.</p></div>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-text-primary/70 mb-2">First Name *</label><input type="text" id="firstName" value={shippingInfo.firstName} onChange={handleShippingChange} className="input-field" required /></div><div><label className="block text-sm font-medium text-text-primary/70 mb-2">Last Name *</label><input type="text" id="lastName" value={shippingInfo.lastName} onChange={handleShippingChange} className="input-field" required /></div></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-text-primary/70 mb-2">Email *</label><input type="email" id="email" value={shippingInfo.email} onChange={handleShippingChange} className="input-field" required /></div><div><label className="block text-sm font-medium text-text-primary/70 mb-2">Phone *</label><input type="tel" id="phone" value={shippingInfo.phone} onChange={handleShippingChange} className="input-field" required /></div></div>
              <div><label className="block text-sm font-medium text-text-primary/70 mb-2">Address *</label><input type="text" id="address" value={shippingInfo.address} onChange={handleShippingChange} className="input-field" required /></div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4"><div><label className="block text-sm font-medium text-text-primary/70 mb-2">City *</label><input type="text" id="city" value={shippingInfo.city} onChange={handleShippingChange} className="input-field" required /></div><div><label className="block text-sm font-medium text-text-primary/70 mb-2">State *</label><select id="state" value={shippingInfo.state} onChange={handleShippingChange} className="input-field" required><option value="">Select</option><option value="NSW">NSW</option><option value="VIC">VIC</option><option value="QLD">QLD</option><option value="WA">WA</option><option value="SA">SA</option><option value="TAS">TAS</option></select></div><div><label className="block text-sm font-medium text-text-primary/70 mb-2">Postcode *</label><input type="text" id="postcode" value={shippingInfo.postcode} onChange={handleShippingChange} className="input-field" required /></div></div>
              {error && <div className="bg-error/10 border border-error/30 text-error text-sm p-3 rounded-md">{error}</div>}
              <button onClick={() => { if (!user) { setError("Please sign in."); return; } setError(""); setStep("payment"); }} className="btn-primary w-full sm:w-auto">Continue to Payment</button>
            </motion.div>)}

            {step === "payment" && (<motion.div key="payment" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="card p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-heading font-bold">Payment Method</h2>
              <div className="flex gap-3">
                <button onClick={() => setPaymentMethod("crypto")} className={`flex-1 p-4 rounded-md border-2 text-center transition-all ${paymentMethod === "crypto" ? "border-accent bg-accent/5" : "border-secondary-light hover:border-text-primary/20"}`}><span className="text-2xl block mb-1">₿</span><span className="text-sm font-heading font-semibold">Cryptocurrency</span></button>
                <button onClick={() => setPaymentMethod("card")} className={`flex-1 p-4 rounded-md border-2 text-center transition-all ${paymentMethod === "card" ? "border-accent bg-accent/5" : "border-secondary-light hover:border-text-primary/20"}`}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mx-auto mb-1"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg><span className="text-sm font-heading font-semibold">Card / PayPal</span></button>
              </div>

              {/* Coupon Code */}
              <div className="flex gap-2">
                <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Coupon code" className="input-field flex-1 text-sm" />
                <button onClick={applyCoupon} className="btn-secondary text-sm whitespace-nowrap">Apply</button>
              </div>
              {appliedCoupon && <p className="text-xs text-success">✅ {appliedCoupon} applied (-${couponDiscount.toFixed(2)})</p>}
              {couponError && <p className="text-xs text-error">{couponError}</p>}

              {storeCredit > 0 && (<label className="flex items-center gap-3 bg-success/5 border border-success/20 rounded-lg p-4 cursor-pointer"><input type="checkbox" checked={useCredit} onChange={(e) => setUseCredit(e.target.checked)} className="w-4 h-4 rounded border-secondary-light text-accent" /><div><span className="text-sm font-medium text-success">Use Store Credit</span><p className="text-xs text-text-primary/50">You have ${storeCredit.toFixed(2)} available</p></div></label>)}

              {paymentMethod === "crypto" && (<div className="space-y-3"><h4 className="text-sm font-heading font-semibold">Select Cryptocurrency</h4><div className="space-y-2">{cryptos.map((c) => (<button key={c.symbol} onClick={() => setSelectedCrypto(c.symbol)} className={`w-full flex items-center gap-4 p-3 rounded-md border transition-all ${selectedCrypto === c.symbol ? "border-accent bg-accent/5" : "border-secondary-light hover:border-text-primary/20"}`}><span className="text-2xl w-8 text-center">{c.icon}</span><div className="text-left"><p className="text-sm font-medium">{c.name}</p><p className="text-xs text-text-primary/40">{c.symbol}</p></div></button>))}</div><p className="text-xs text-text-primary/40 flex items-center gap-1">🔒 Secured by NowPayments</p></div>)}

              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                    <p className="text-sm font-medium flex items-center gap-2"><span className="text-2xl">💳</span> Pay with Card or PayPal</p>
                    <p className="text-xs text-text-primary/50 mt-2">Click the PayPal button below to pay securely.</p>
                  </div>
                  <div id="paypal-button-container" className="flex justify-center"></div>
                </div>
              )}

              {paymentMethod === "crypto" && (<>
                {error && <div className="bg-error/10 border border-error/30 text-error text-sm p-3 rounded-md">{error}</div>}
                <div className="flex gap-3"><button onClick={() => setStep("shipping")} className="btn-secondary">Back</button><button onClick={handlePlaceOrder} disabled={isProcessing} className="btn-primary flex-1 flex items-center justify-center gap-2">{isProcessing ? "Processing..." : total === 0 ? "Place Free Order" : `Pay $${total.toFixed(2)} with ${selectedCrypto}`}</button></div>
              </>)}
            </motion.div>)}

            {step === "processing" && (<motion.div key="processing" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card p-6 sm:p-8 text-center space-y-6"><div className="animate-spin w-12 h-12 border-4 border-accent border-t-transparent rounded-full mx-auto" /><h2 className="text-xl font-heading font-bold">Processing Payment</h2><p className="text-text-primary/50">Please wait...</p></motion.div>)}

            {step === "review" && (<motion.div key="review" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card p-6 sm:p-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-success"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg></div>
              <h2 className="text-2xl font-heading font-bold">Order Confirmed!</h2>
              {orderNumber && <p className="text-text-primary font-mono text-lg">Order #{orderNumber}</p>}

              {/* ⏰ COMPTE À REBOURS - Paiement crypto en attente */}
              {!isExpired && timeLeft && orderTotal > 0 && paymentMethod === "crypto" && paymentUrl && (
                <div className={`border rounded-lg p-4 ${
                  timeLeft.minutes < 5 
                    ? "bg-warning/10 border-warning/30" 
                    : "bg-accent/5 border-accent/20"
                }`}>
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl ${timeLeft.minutes < 5 ? "animate-pulse" : ""}`}>⏱️</span>
                    <div className="text-left">
                      <p className={`text-sm font-medium ${
                        timeLeft.minutes < 5 ? "text-warning" : "text-text-primary"
                      }`}>
                        Temps restant pour payer
                      </p>
                      <p className={`text-lg font-mono font-bold ${
                        timeLeft.minutes < 5 ? "text-warning" : "text-accent"
                      }`}>
                        {String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
                      </p>
                      {timeLeft.minutes < 5 && (
                        <p className="text-xs text-warning mt-1">
                          ⚠️ Dépêchez-vous ! Votre commande expire bientôt.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ⏰ COMMANDE EXPIRÉE AVEC REDIRECTION */}
              {isExpired && (
                <div className="bg-error/10 border border-error/30 rounded-lg p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">⏰</span>
                    <div className="text-left">
                      <p className="text-lg font-heading font-bold text-error">Commande annulée</p>
                      <p className="text-sm text-text-primary/70 mt-1">
                        Le délai de paiement d&apos;une heure est dépassé.
                      </p>
                      <p className="text-sm text-text-primary/70">
                        Cette commande a été automatiquement annulée pour non-paiement.
                      </p>
                    </div>
                  </div>
                  <div className="bg-background rounded-md p-3">
                    <p className="text-xs text-text-primary/60">
                      Redirection vers votre tableau de bord dans <span className="font-bold text-error">{redirectCountdown}</span> seconde{redirectCountdown > 1 ? "s" : ""}...
                    </p>
                  </div>
                </div>
              )}

              {paymentUrl && !isExpired && (<div className="bg-accent/5 border border-accent/20 rounded-lg p-4 space-y-3 text-left"><p className="text-sm font-medium text-center">Send <strong>{paymentAmount} {selectedCrypto}</strong> to:</p><p className="text-xs font-mono bg-background p-3 rounded break-all select-all">{paymentUrl}</p><p className="text-xs text-text-primary/50 text-center">Your order will be confirmed automatically once payment is detected.</p></div>)}
              {!paymentUrl && paymentMethod === "crypto" && savedTotalRef > 0 && !isExpired && (<div className="bg-warning/10 border border-warning/30 rounded-lg p-4"><p className="text-sm text-warning">⚠️ Crypto payment could not be generated.</p></div>)}
              {orderTotal === 0 && (<div className="bg-success/10 border border-success/30 rounded-lg p-4"><p className="text-sm text-success">✅ Order fully covered by credits!</p></div>)}
              {paymentMethod === "card" && (<div className="bg-success/10 border border-success/30 rounded-lg p-4"><p className="text-sm text-success">💳 Card payment processed via PayPal.</p></div>)}
              <div className="space-y-2">
                {loyaltyDiscount > 0 && <p className="text-sm text-success">🎁 {loyaltyDiscount}% loyalty discount applied!</p>}
                {couponDiscount > 0 && <p className="text-sm text-success">🎫 Coupon {appliedCoupon} (-${couponDiscount.toFixed(2)})</p>}
                {creditApplied > 0 && <p className="text-sm text-success">🛒 ${creditApplied.toFixed(2)} store credit applied!</p>}
                <p><span className="text-text-primary/50">Subtotal:</span> <span className="font-medium">${orderSubtotal.toLocaleString()}</span></p>
                <p><span className="text-text-primary/50">GST (10%):</span> <span className="font-medium">${orderTax.toFixed(2)}</span></p>
                <p className="text-lg font-heading font-bold">Total: ${orderTotal.toFixed(2)}</p>
              </div>
              <div className="flex flex-wrap gap-3 justify-center"><Link href="/dashboard" className="btn-primary">View Orders</Link><Link href="/category/smartphones" className="btn-secondary">Continue Shopping</Link></div>
            </motion.div>)}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-1"><div className="card p-6 sticky top-24 space-y-4"><h3 className="text-lg font-heading font-bold">Order Summary</h3><div className="space-y-3 max-h-64 overflow-y-auto">{items.length > 0 ? items.map((item) => { const brandName = typeof item.product.brand === "object" && item.product.brand !== null ? (item.product.brand as { name: string }).name : String(item.product.brand || ""); const images = item.product.images || []; const img = images.length > 0 ? (typeof images[0] === "string" ? images[0] : (images[0] as { url: string }).url) : null; return (<div key={`${item.product.id}-${item.color}`} className="flex gap-3"><div className="w-12 h-12 rounded bg-secondary-light flex-shrink-0 overflow-hidden">{img ? <img src={img} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><span className="text-lg font-bold text-text-primary/10">{brandName.charAt(0)}</span></div>}</div><div className="flex-1 min-w-0"><p className="text-xs font-medium line-clamp-1">{item.product.name}</p><p className="text-xs text-text-primary/40">Qty: {item.quantity} · {item.color}</p></div><p className="text-sm font-medium">${(Number(item.product.price) * item.quantity).toLocaleString()}</p></div>); }) : <p className="text-xs text-text-primary/40 text-center py-4">Order placed</p>}</div><div className="border-t border-secondary-light pt-4 space-y-2 text-sm">{step === "review" ? (<><div className="flex justify-between"><span className="text-text-primary/60">Subtotal</span><span>${orderSubtotal.toLocaleString()}</span></div>{loyaltyDiscount > 0 && <div className="flex justify-between text-success"><span>🎁 Loyalty {loyaltyDiscount}%</span><span>-${discountAmount.toFixed(2)}</span></div>}{couponDiscount > 0 && <div className="flex justify-between text-success"><span>🎫 Coupon</span><span>-${couponDiscount.toFixed(2)}</span></div>}{creditApplied > 0 && <div className="flex justify-between text-success"><span>🛒 Store Credit</span><span>-${creditApplied.toFixed(2)}</span></div>}<div className="flex justify-between"><span className="text-text-primary/60">Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div><div className="flex justify-between"><span className="text-text-primary/60">GST (10%)</span><span>${orderTax.toFixed(2)}</span></div><div className="flex justify-between pt-2 border-t border-secondary-light"><span className="font-heading font-semibold">Total</span><span className="font-heading font-bold">${orderTotal.toFixed(2)}</span></div></>) : (<><div className="flex justify-between"><span className="text-text-primary/60">Subtotal</span><span>${subtotal.toLocaleString()}</span></div>{loyaltyDiscount > 0 && <div className="flex justify-between text-success"><span>🎁 Loyalty {loyaltyDiscount}%</span><span>-${discountAmount.toFixed(2)}</span></div>}{couponDiscount > 0 && <div className="flex justify-between text-success"><span>🎫 Coupon</span><span>-${couponDiscount.toFixed(2)}</span></div>}{useCredit && <div className="flex justify-between text-success"><span>🛒 Store Credit</span><span>-${creditApplied.toFixed(2)}</span></div>}<div className="flex justify-between"><span className="text-text-primary/60">Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div><div className="flex justify-between"><span className="text-text-primary/60">GST (10%)</span><span>${tax.toFixed(2)}</span></div><div className="flex justify-between pt-2 border-t border-secondary-light"><span className="font-heading font-semibold">Total</span><span className="font-heading font-bold">${total.toFixed(2)}</span></div></>)}</div></div></div>
      </div>
    </div>
  );
}