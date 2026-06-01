"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // SEO dynamique
  useEffect(() => {
    document.title = "Contact Us - Cryptoelectro-au | Premium Electronics Marketplace";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", "Contact Cryptoelectro-au for support, inquiries, and crypto payment help. Reach our team in Sydney, Australia by email, phone, or contact form.");
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", "Contact Us - Cryptoelectro-au");
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", "Get in touch with Cryptoelectro-au. Support for orders, crypto payments, shipping, and more.");
  }, []);

  // Schema JSON-LD Contact
  useEffect(() => {
    const contactSchema = {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "Contact Cryptoelectro-au",
      url: "https://cryptoelectro.au/contact",
      description: "Contact Cryptoelectro-au for support, inquiries, and crypto payment help.",
      mainEntity: {
        "@type": "Organization",
        name: "Cryptoelectro-au",
        email: "support@cryptoelectro.au",
        telephone: "1300 123 456",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Sydney",
          addressRegion: "NSW",
          addressCountry: "AU",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          email: "support@cryptoelectro.au",
          availableLanguage: "English",
        },
      },
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(contactSchema);
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to send message. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    }

    setLoading(false);
  };

  const contactInfo = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
      ),
      title: "Email",
      value: "support@cryptoelectro.au",
      link: "mailto:support@cryptoelectro.au",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
        </svg>
      ),
      title: "Phone",
      value: "1300 123 456",
      link: "tel:1300123456",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
      title: "Hours",
      value: "Mon-Fri: 9am - 6pm AEST",
      link: null,
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
      ),
      title: "Location",
      value: "Sydney, NSW, Australia",
      link: null,
    },
  ];

  if (submitted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: "Contact" }]} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="min-h-[50vh] flex flex-col items-center justify-center text-center py-16"
        >
          <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-success">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-2xl font-heading font-bold mb-2">Message Sent!</h2>
          <p className="text-text-primary/50 mb-4 max-w-md">Thank you for contacting us. We will get back to you within 24 hours.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Contact" }]} />

      <div className="text-center mb-12">
        <h1 className="text-3xl lg:text-4xl font-heading font-bold">
          Get in <span className="text-gradient">Touch</span>
        </h1>
        <p className="mt-4 text-text-primary/50 max-w-xl mx-auto">Have a question or need help? We&apos;re here for you.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Contact Info */}
        <div className="lg:col-span-1 space-y-4">
          {contactInfo.map((info) => (
            <div key={info.title} className="card p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent">{info.icon}</div>
              <div>
                <h3 className="text-sm font-heading font-semibold">{info.title}</h3>
                {info.link ? (
                  <a href={info.link} className="text-sm text-text-primary/60 hover:text-accent transition-colors">{info.value}</a>
                ) : (
                  <p className="text-sm text-text-primary/60">{info.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="card p-6 sm:p-8">
            {error && <div className="mb-4 bg-error/10 border border-error/30 text-error text-sm p-3 rounded-md">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-text-primary/70 mb-2">Name</label>
                  <input type="text" id="name" value={form.name} onChange={handleChange} placeholder="Your name" className="input-field" required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-primary/70 mb-2">Email</label>
                  <input type="email" id="email" value={form.email} onChange={handleChange} placeholder="your@email.com" className="input-field" required />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-text-primary/70 mb-2">Subject</label>
                <select id="subject" value={form.subject} onChange={handleChange} className="input-field" required>
                  <option value="">Select a topic</option>
                  <option value="order">Order Inquiry</option>
                  <option value="product">Product Question</option>
                  <option value="crypto">Crypto Payment Help</option>
                  <option value="shipping">Shipping & Delivery</option>
                  <option value="returns">Returns & Warranty</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-text-primary/70 mb-2">Message</label>
                <textarea id="message" value={form.message} onChange={handleChange} placeholder="Tell us how we can help..." rows={5} className="input-field resize-none" required />
              </div>

              <button type="submit" className="btn-primary w-full sm:w-auto" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}