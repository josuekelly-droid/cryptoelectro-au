"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function PromoBanner() {
  const [banners, setBanners] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch("/api/banners").then(r => r.json()).then(d => setBanners(d.banners || []));
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => { setCurrent((prev) => (prev + 1) % banners.length); }, 4000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0 || dismissed) return null;

  const banner = banners[current];

  return (
    <div style={{ backgroundColor: banner.bgColor, color: banner.textColor }} className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-2 text-center text-sm font-medium">
        {banner.link ? (
          <Link href={banner.link} className="hover:underline">{banner.text}</Link>
        ) : (
          <span>{banner.text}</span>
        )}
      </div>
      <button onClick={() => setDismissed(true)} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity" style={{ color: banner.textColor }}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
      </button>
    </div>
  );
}