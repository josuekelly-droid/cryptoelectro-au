"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
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
        a: "Yes! We offer free standard shipping on all orders over $500 AUD within Australia. For orders under $500, a flat rate of $29.99 AUD applies. Express shipping is available for $49.99 AUD.",
      },
      {
        q: "Can I track my order?",
        a: "Absolutely. Once your order is shipped, you will receive a tracking number via email. You can also track all your orders anytime from your account dashboard.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes, we ship to Australia and surrounding regions including New Zealand, Papua New Guinea, Fiji, and select Pacific Islands. International shipping rates are calculated at checkout based on weight and destination. For full details, see our Shipping Information page.",
      },
      {
        q: "How fast are orders processed?",
        a: "Orders placed before 2 PM AEST are processed the same business day. Crypto payments are confirmed within 10-30 minutes once detected on the blockchain. Card payments via PayPal are confirmed instantly.",
      },
    ],
  },
  {
    title: "Crypto Payments",
    questions: [
      {
        q: "Which cryptocurrencies do you accept?",
        a: "We accept Bitcoin (BTC), Ethereum (ETH), Tether (USDT), USD Coin (USDC), TRON (TRX), Solana (SOL), and 100+ other cryptocurrencies through our payment partner NowPayments.",
      },
      {
        q: "How do crypto payments work?",
        a: "At checkout, select 'Cryptocurrency' as your payment method. Choose your preferred cryptocurrency, and you'll receive a wallet address and exact amount to send. Once the transaction is confirmed on the blockchain, your order is automatically processed and confirmed.",
      },
      {
        q: "What happens if I send the wrong amount of crypto?",
        a: "Please ensure you send the exact amount displayed at checkout. Underpayments may delay your order while we verify the transaction. Overpayments will be refunded to the wallet address you provide. Contact support immediately if you make an error.",
      },
      {
        q: "Are crypto payments refundable?",
        a: "Yes. Refunds for crypto payments are processed in the same cryptocurrency at the exchange rate current at the time of refund. The AUD value of your order is fixed, but the crypto amount may vary due to market fluctuations between purchase and refund.",
      },
      {
        q: "How long does crypto payment confirmation take?",
        a: "Most crypto payments are detected within 10-30 minutes. Bitcoin and Ethereum may take longer during network congestion. You'll receive an email confirmation once your payment is verified on the blockchain.",
      },
      {
        q: "Is it safe to pay with cryptocurrency?",
        a: "Yes. All crypto payments are processed through NowPayments, a trusted global crypto payment gateway. We never receive or store your private keys. The wallet address you send to is generated uniquely for your order.",
      },
    ],
  },
  {
    title: "Credit & Debit Cards",
    questions: [
      {
        q: "Can I pay with a credit or debit card?",
        a: "Yes! We accept all major credit and debit cards through PayPal. You don't need a PayPal account — you can check out as a guest and pay directly with your Visa, Mastercard, or American Express.",
      },
      {
        q: "Is card payment secure?",
        a: "Card payments are processed securely through PayPal, which uses industry-leading encryption and fraud protection. We never see or store your full card details on our servers.",
      },
      {
        q: "Are there extra fees for card payments?",
        a: "No. The price you see is the price you pay. There are no hidden surcharges or processing fees for card payments.",
      },
      {
        q: "How long do card refunds take?",
        a: "Card refunds are processed within 5-10 business days after we receive and inspect your returned item. The refunded amount may take an additional 3-5 business days to appear on your card statement, depending on your bank.",
      },
    ],
  },
  {
    title: "Returns & Warranty",
    questions: [
      {
        q: "What is your return policy?",
        a: "We offer a hassle-free 30-day return policy for most products. Items must be in original condition with all accessories and packaging. Some exclusions apply for opened software and personal care items. For full details, see our Returns Policy.",
      },
      {
        q: "How do I initiate a return?",
        a: "Log into your account, go to your order history, and select 'Request Return'. Alternatively, contact our support team at cryptoelectroau@gmail.com. You will receive a prepaid return shipping label via email within 24 hours.",
      },
      {
        q: "Do products come with a warranty?",
        a: "Yes! All products sold on Cryptoelectro-au come with a minimum 2-year manufacturer warranty covering defects in materials and workmanship under normal use. For full details, see our Warranty Information page.",
      },
      {
        q: "What if my product is faulty?",
        a: "If your product develops a fault, contact us immediately with your order number and a description of the issue. We will coordinate with the manufacturer to arrange repair, replacement, or refund at no cost to you. This is in addition to your rights under Australian Consumer Law.",
      },
    ],
  },
  {
    title: "Account & Security",
    questions: [
      {
        q: "Is my personal information secure?",
        a: "Yes. We use industry-standard SSL/TLS encryption to protect all data in transit. Passwords are hashed using bcrypt (12 rounds). We never store crypto wallet keys or full credit card details on our servers. For more information, see our Privacy Policy.",
      },
      {
        q: "How do I reset my password?",
        a: "Click 'Forgot Password' on the login page, enter your email address, and you'll receive a password reset link. The link expires after 1 hour for security reasons. If you don't receive the email, check your spam folder.",
      },
      {
        q: "Do I need to verify my email?",
        a: "Yes. After creating your account, you'll receive a verification email. Click the link to verify your email address. This helps secure your account and ensures you receive order confirmations. You can resend the verification email from your dashboard.",
      },
      {
        q: "Can I have multiple shipping addresses?",
        a: "Yes! You can save multiple shipping addresses in your account dashboard for faster checkout. Manage them under Account → Addresses when logged in.",
      },
    ],
  },
  {
    title: "Loyalty & Rewards",
    questions: [
      {
        q: "How does the loyalty program work?",
        a: "You earn 10 points for every $1 spent (excluding shipping and tax). Points unlock loyalty tiers (Bronze, Silver, Gold, Platinum, Diamond), each with increasing discounts on future purchases. You can track your points and tier from your dashboard.",
      },
      {
        q: "How do I earn store credit?",
        a: "Store credit can be earned through our referral program ($10 per referred friend who makes a purchase), affiliate commissions (5% on every sale), and loyalty rewards. Check your dashboard for your current store credit balance.",
      },
      {
        q: "Can I combine loyalty discount with coupons?",
        a: "Yes! Loyalty discounts and coupon codes can be combined at checkout. Store credit can also be applied on top of these discounts, making your purchases even more rewarding.",
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

  // SEO dynamique + Schema.org
  useEffect(() => {
    document.title = "FAQ — Cryptoelectro-au | Crypto & Card Payments, Shipping, Returns";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Find answers about cryptocurrency payments, credit card payments, shipping, returns, warranty, and account security at Cryptoelectro-au.");
    }

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
          Find answers about payments, shipping, returns, and more.
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
      <div className="text-center mt-12 p-8 card bg-gradient-to-br from-accent/5 to-secondary">
        <span className="text-3xl block mb-3">💬</span>
        <h3 className="text-xl font-heading font-bold mb-2">
          Still Need Help?
        </h3>
        <p className="text-text-primary/50 mb-4 max-w-md mx-auto">
          Can&apos;t find what you&apos;re looking for? Our support team is here to help.
        </p>
        <Link href="/contact" className="btn-primary text-sm">
          Contact Support
        </Link>
      </div>
    </div>
  );
}