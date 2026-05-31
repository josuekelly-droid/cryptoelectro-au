"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumb from "@/components/ui/Breadcrumb";

const faqCategories = [
  {
    title: "Orders & Shipping",
    questions: [
      {
        q: "How long does shipping take?",
        a: "Standard shipping to Australian addresses takes 3-7 business days. Express shipping is available for 1-2 business day delivery to major cities. International shipping to surrounding regions takes 7-14 business days.",
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes! We offer free standard shipping on all orders over $500 AUD within Australia. For orders under $500, a flat rate of $29.99 applies.",
      },
      {
        q: "Can I track my order?",
        a: "Absolutely. Once your order is shipped, you will receive a tracking number via email. You can also track your order from your account dashboard.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes, we ship to Australia and surrounding regions including New Zealand, Papua New Guinea, and select Pacific Islands. Shipping rates vary by destination.",
      },
    ],
  },
  {
    title: "Crypto Payments",
    questions: [
      {
        q: "Which cryptocurrencies do you accept?",
        a: "We accept Bitcoin (BTC), Ethereum (ETH), Tether (USDT), USD Coin (USDC), Solana (SOL), and 100+ other cryptocurrencies through our payment partner NowPayments.",
      },
      {
        q: "How do crypto payments work?",
        a: "At checkout, select 'Cryptocurrency' as your payment method. Choose your preferred cryptocurrency, and you'll receive a wallet address and exact amount to send. Once the transaction is confirmed on the blockchain, your order is processed.",
      },
      {
        q: "What if I send the wrong amount of crypto?",
        a: "Please ensure you send the exact amount displayed at checkout. Underpayments may delay your order, and overpayments will be refunded to the wallet address you provide. Contact support immediately if you make an error.",
      },
      {
        q: "Are crypto payments refundable?",
        a: "Yes, refunds for crypto payments are processed in the same cryptocurrency at the current exchange rate at the time of refund. The amount may differ from your original payment due to market fluctuations.",
      },
    ],
  },
  {
    title: "Returns & Warranty",
    questions: [
      {
        q: "What is your return policy?",
        a: "We offer a 30-day return policy for most products. Items must be in original condition with all accessories and packaging. Some exclusions apply for opened software and personal care items.",
      },
      {
        q: "How do I initiate a return?",
        a: "Log into your account, go to your order history, and select 'Request Return'. Alternatively, contact our support team. You will receive a return shipping label via email.",
      },
      {
        q: "Do products come with a warranty?",
        a: "All products sold on Cryptoelectro-au come with a minimum 2-year warranty backed by the manufacturer. Some premium products may include extended warranty coverage.",
      },
    ],
  },
  {
    title: "Account & Security",
    questions: [
      {
        q: "Is my personal information secure?",
        a: "Yes, we use industry-standard encryption (SSL/TLS) to protect your personal data. We never store your crypto wallet keys or credit card details on our servers.",
      },
      {
        q: "How do I reset my password?",
        a: "Click 'Forgot Password' on the login page. Enter your email address, and you will receive a password reset link. The link expires after 1 hour for security.",
      },
      {
        q: "Can I have multiple shipping addresses?",
        a: "Yes! You can save multiple shipping addresses in your account dashboard for faster checkout. Manage them under Account → Addresses.",
      },
    ],
  },
];

export default function FAQPage() {
  const [openQuestions, setOpenQuestions] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState(0);

  const toggleQuestion = (q: string) => {
    setOpenQuestions((prev) =>
      prev.includes(q) ? prev.filter((item) => item !== q) : [...prev, q]
    );
  };

  // Injecter le FAQ Schema via JavaScript standard (pas de dangerouslySetInnerHTML)
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqCategories.flatMap((cat) =>
        cat.questions.map((q) => ({
          "@type": "Question",
          name: q.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: q.a,
          },
        }))
      ),
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "FAQ" }]} />

      <div className="text-center mb-12">
        <h1 className="text-3xl lg:text-4xl font-heading font-bold">
          Frequently Asked{" "}
          <span className="text-gradient">Questions</span>
        </h1>
        <p className="mt-4 text-text-primary/50">
          Find answers to common questions about shopping, payments, and more.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {faqCategories.map((cat, index) => (
          <button
            key={cat.title}
            onClick={() => setActiveCategory(index)}
            className={`px-4 py-2 rounded-md text-sm font-body transition-colors ${
              activeCategory === index
                ? "bg-accent text-white"
                : "bg-secondary text-text-primary/60 hover:text-text-primary"
            }`}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {/* Questions */}
      <div className="space-y-3">
        {faqCategories[activeCategory].questions.map((item) => (
          <div key={item.q} className="card overflow-hidden">
            <button
              onClick={() => toggleQuestion(item.q)}
              className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4"
            >
              <span className="text-sm sm:text-base font-medium text-text-primary">
                {item.q}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                  openQuestions.includes(item.q) ? "rotate-45" : ""
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
            <AnimatePresence>
              {openQuestions.includes(item.q) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm text-text-primary/60 leading-relaxed">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Still need help */}
      <div className="text-center mt-12 p-8 card">
        <h3 className="text-xl font-heading font-bold mb-2">
          Still Need Help?
        </h3>
        <p className="text-text-primary/50 mb-4">
          Can&apos;t find what you&apos;re looking for? Contact our support team.
        </p>
        <a href="/contact" className="btn-primary text-sm">
          Contact Us
        </a>
      </div>
    </div>
  );
}