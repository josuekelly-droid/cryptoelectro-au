"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-secondary-dark/95 border-t border-secondary-light backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-text-primary/70 text-center sm:text-left">
          We use cookies to keep you signed in (7 days), track affiliate referrals (30 days), and improve your experience.{" "}
          <Link href="/cookies" className="text-accent hover:underline">Learn more</Link>.
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button onClick={decline} className="btn-secondary text-sm py-2 px-4">
            Decline
          </button>
          <button onClick={accept} className="btn-primary text-sm py-2 px-4">
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}