"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function CareersPage() {
  const [careers, setCareers] = useState<any[]>([]);

  useEffect(() => {
    // SEO dynamique
    document.title = "Careers - Join Cryptoelectro-au | Remote & Hybrid Jobs Australia";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", "Join Cryptoelectro-au and build the future of crypto e-commerce. Explore remote and hybrid job opportunities in Australia. Apply today for exciting careers in tech, marketing, and design.");
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", "Careers at Cryptoelectro-au - Work in Crypto E-Commerce");
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", "Explore career opportunities at Cryptoelectro-au. Remote & hybrid jobs in Australia. Engineering, Marketing, Design, and more. Apply now.");
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", "https://cryptoelectro-au.store/careers");

    // Schema JSON-LD
    const schema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Careers at Cryptoelectro-au",
      description: "Join Cryptoelectro-au and build the future of crypto e-commerce. Explore remote and hybrid job opportunities in Australia.",
      url: "https://cryptoelectro-au.store/careers",
      about: {
        "@type": "Organization",
        name: "Cryptoelectro-au",
        url: "https://cryptoelectro-au.store",
        description: "Australia's premium electronics marketplace with cryptocurrency payments.",
        email: "cryptoelectroau@gmail.com",
        sameAs: [
          "https://twitter.com/cryptoelectroau",
          "https://web.facebook.com/people/Cryptoelectro-AU/61590304272310/",
          "https://instagram.com/cryptoelectro__au",
        ],
      },
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    // Charger les offres
    fetch("/api/careers")
      .then(r => r.json())
      .then(d => setCareers(d.careers || []));

    return () => { document.head.removeChild(script); };
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Careers" }]} />
      <div className="text-center mb-12">
        <span className="badge badge-accent text-sm mb-4 inline-block">🚀 We&apos;re Hiring</span>
        <h1 className="text-3xl lg:text-4xl font-heading font-bold">
          Join Our <span className="text-gradient">Team</span>
        </h1>
        <p className="mt-4 text-text-primary/50 max-w-xl mx-auto">
          Help us build the future of crypto e-commerce in Australia. We&apos;re a remote-first team passionate about technology, cryptocurrency, and premium electronics.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { value: "100%", label: "Remote-First" },
          { value: "Australia", label: "Based" },
          { value: "Crypto", label: "Payments" },
          { value: "4+", label: "Open Positions" },
        ].map((stat) => (
          <div key={stat.label} className="card p-4 text-center">
            <p className="text-xl font-heading font-bold text-accent">{stat.value}</p>
            <p className="text-xs text-text-primary/50 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {careers.map((job) => (
          <div key={job.id} className="card p-6 hover:border-accent/30 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <h2 className="text-lg font-heading font-bold">{job.title}</h2>
                <p className="text-sm text-text-primary/50">{job.department} · {job.location} · {job.type}</p>
              </div>
              {job.salary && <span className="badge badge-accent text-sm">{job.salary}</span>}
            </div>
            <p className="text-sm text-text-primary/60 line-clamp-3 mb-4">{job.description}</p>
            <Link href={`/careers/${job.id}`} className="text-sm text-accent hover:underline">View Details →</Link>
          </div>
        ))}
        {careers.length === 0 && (
          <div className="text-center py-16">
            <span className="text-4xl mb-4 block">📭</span>
            <p className="text-text-primary/50">No open positions at the moment.</p>
            <p className="text-text-primary/40 text-sm mt-2">Send your CV to <a href="mailto:cryptoelectroau@gmail.com" className="text-accent hover:underline">cryptoelectroau@gmail.com</a> for future opportunities.</p>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="card p-8 text-center mt-8 bg-gradient-to-br from-accent/5 to-secondary">
        <h2 className="text-xl font-heading font-bold mb-2">Don&apos;t See the Right Role?</h2>
        <p className="text-text-primary/50 mb-4">We&apos;re always looking for talented people. Send your resume to <a href="mailto:cryptoelectroau@gmail.com" className="text-accent hover:underline font-medium">cryptoelectroau@gmail.com</a> and tell us how you can contribute.</p>
        <a href="mailto:cryptoelectroau@gmail.com" className="btn-primary text-sm">Contact Us</a>
      </div>
    </div>
  );
}