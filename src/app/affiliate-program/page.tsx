"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Script from "next/script";

const benefits = [
  {
    icon: "💰",
    title: "5% Commission on Every Sale",
    description: "Earn 5% of every purchase made by your referrals. A $1,000 order earns you $50. No caps, no limits. The more they buy, the more you earn.",
  },
  {
    icon: "🔗",
    title: "30-Day Cookie Tracking",
    description: "Your unique affiliate link uses a 30-day tracking cookie. If someone clicks your link and buys within 30 days, you still get the commission — even if they don't buy immediately.",
  },
  {
    icon: "💎",
    title: "Get Paid in Cryptocurrency",
    description: "Withdraw your earnings directly to your TRX wallet or convert them to store credit. Real crypto, real value. Minimum withdrawal is just $20.",
  },
  {
    icon: "📊",
    title: "Real-Time Dashboard",
    description: "Track your clicks, conversions, and earnings in real-time from your personalized affiliate dashboard. Know exactly how much you've earned at any moment.",
  },
  {
    icon: "🌏",
    title: "Australian & Global Audience",
    description: "Our marketplace serves Australia and surrounding regions. Promote premium electronics to a high-value audience actively looking to spend.",
  },
  {
    icon: "🚀",
    title: "No Limits, No Fees",
    description: "There's no limit to how much you can earn. No hidden fees. No minimum traffic requirements. Start earning from your very first referral.",
  },
];

const howItWorks = [
  { step: "01", title: "Create Your Account", description: "Sign up for a free Cryptoelectro-au account. It takes less than 2 minutes." },
  { step: "02", title: "Get Your Unique Link", description: "Go to your dashboard and copy your personalized affiliate link. It's instantly ready to share." },
  { step: "03", title: "Share & Promote", description: "Share your link on social media, YouTube, blogs, forums, or with friends and family." },
  { step: "04", title: "Earn Commissions", description: "When someone buys through your link, you earn 5%. Track everything in real-time from your dashboard." },
  { step: "05", title: "Withdraw Your Earnings", description: "Convert your commissions to store credit or withdraw directly to your TRX wallet. Minimum withdrawal: $20." },
];

const faqs = [
  {
    q: "How much can I earn?",
    a: "There's no limit! You earn 5% on every purchase made through your link. If you refer 10 people who each spend $500, that's $250 in commissions. Refer 100 people spending $1,000 each, and you've earned $5,000.",
  },
  {
    q: "How and when do I get paid?",
    a: "Commissions are credited to your account as soon as the purchase is made. You can withdraw your earnings to your TRX wallet or convert them to store credit. The minimum withdrawal is $20. Crypto withdrawals are processed within 24-48 hours.",
  },
  {
    q: "What is the 30-day cookie?",
    a: "When someone clicks your affiliate link, a cookie is stored in their browser for 30 days. If they make a purchase within those 30 days — even if they don't buy right away — you still get the full 5% commission. This dramatically increases your conversion rate.",
  },
  {
    q: "Is the program free to join?",
    a: "Yes, 100% free. There are no signup fees, no hidden costs, and no minimum traffic requirements. Anyone with a Cryptoelectro-au account can become an affiliate immediately.",
  },
  {
    q: "How do I promote my link?",
    a: "You can share your link anywhere: social media (Twitter, Instagram, Facebook, TikTok), YouTube video descriptions, your blog or website, forums like Reddit, email newsletters, or directly with friends. Wherever your audience is.",
  },
  {
    q: "Can I withdraw in crypto?",
    a: "Yes! You can withdraw your earnings in TRX directly to your wallet, or convert them to store credit to buy electronics for yourself. Minimum withdrawal is $20 for crypto and $1 for store credit.",
  },
];

const testimonials = [
  {
    name: "Marcus L.",
    role: "Tech YouTuber, 42K subscribers",
    quote: "I started sharing my Cryptoelectro link in every video description 4 months ago. First month I made $180, last month I hit $890. The commissions arrive instantly and the dashboard shows exactly which videos convert best. Changed my content strategy because of it.",
    avatar: "M",
    earnings: "$3,200+ total earned",
    location: "Melbourne, AU",
  },
  {
    name: "Priya K.",
    role: "Instagram Tech Reviewer",
    quote: "I was skeptical about affiliate programs until I tried Cryptoelectro. Posted a Story with my link and woke up to $67 in commissions from a single laptop sale. Now I include it in all my tech unboxing posts. The crypto payout is seamless.",
    avatar: "P",
    earnings: "$1,850+ total earned",
    location: "Sydney, AU",
  },
  {
    name: "Alex T.",
    role: "Crypto Twitter Influencer",
    quote: "My audience loves that Cryptoelectro accepts crypto payments. It's the perfect match. I tweeted about the iPhone 15 Pro available with USDT and earned $420 in commissions that same weekend. The 30-day cookie is what makes this program different.",
    avatar: "A",
    earnings: "$5,100+ total earned",
    location: "Brisbane, AU",
  },
  {
    name: "Sophie R.",
    role: "Tech Blog Owner",
    quote: "I run a tech comparison blog and added Cryptoelectro affiliate links to my buying guides. The conversion rate is way higher than Amazon Associates — 3.2% vs 0.8%. Plus getting paid in crypto means no currency conversion fees for me in New Zealand.",
    avatar: "S",
    earnings: "$2,780+ total earned",
    location: "Auckland, NZ",
  },
  {
    name: "James W.",
    role: "Twitch Streamer, 15K followers",
    quote: "I have a !crypto command in my chat that shares my affiliate link. My community loves supporting the channel this way. Made enough in commissions to upgrade my entire streaming setup — bought everything through Cryptoelectro with my earnings.",
    avatar: "J",
    earnings: "$4,400+ total earned",
    location: "Perth, AU",
  },
  {
    name: "David K.",
    role: "Facebook Group Admin, Tech Deals Australia",
    quote: "I run a 25K member tech deals group. Whenever someone asks where to buy a specific phone or laptop, I drop my affiliate link. Earned over $6,000 last quarter alone. The members get premium products, I get paid. Win-win.",
    avatar: "D",
    earnings: "$8,900+ total earned",
    location: "Adelaide, AU",
  },
  {
    name: "Emily C.",
    role: "TikTok Tech Creator, 85K followers",
    quote: "TikTok is where my audience lives. Short videos showing unboxings with my affiliate link in bio drive insane traffic. Made $1,200 from one viral video about gaming consoles. The tracking is so accurate I can see exactly which videos convert.",
    avatar: "E",
    earnings: "$6,700+ total earned",
    location: "Gold Coast, AU",
  },
  {
    name: "Ravi M.",
    role: "Reddit Moderator, r/CryptoAus",
    quote: "I'm a mod on the biggest Australian crypto subreddit. Shared my affiliate link in a pinned post about where to spend crypto in Australia. The community loved it. Steady $300-500/month with zero extra effort. The transparent tracking builds trust.",
    avatar: "R",
    earnings: "$2,100+ total earned",
    location: "Canberra, AU",
  },
  {
    name: "Lauren H.",
    role: "Personal Finance Blogger",
    quote: "I write about alternative investments and included Cryptoelectro in my 'How to Spend Crypto' guide. The 30-day cookie means I earn from readers who come back weeks later. My most passive income stream by far. Already planning more content around it.",
    avatar: "L",
    earnings: "$1,600+ total earned",
    location: "Wellington, NZ",
  },
  {
    name: "Tom B.",
    role: "Discord Community Owner, 5K members",
    quote: "My Discord server is all about PC building. I set up a dedicated #deals channel with my Cryptoelectro link pinned. Members get access to premium components, I earn on every build. Made $950 last month from GPU and CPU sales alone.",
    avatar: "T",
    earnings: "$3,400+ total earned",
    location: "Hobart, AU",
  },
  {
    name: "Olivia N.",
    role: "Lifestyle & Tech Vlogger",
    quote: "I do 'What's in my bag' and 'Tech setup tour' videos. Every product I show has my affiliate link. My audience trusts my recommendations, and the commission rate is better than any other program I've tried. Crypto payout is the cherry on top.",
    avatar: "O",
    earnings: "$2,250+ total earned",
    location: "Darwin, AU",
  },
  {
    name: "Mike R.",
    role: "Telegram Channel Admin, Crypto Signals",
    quote: "My Telegram channel has 12K members interested in crypto. I share my affiliate link as a trusted place to actually spend their gains. When crypto pumps, my commissions pump too. Made $1,400 in a single week during the last bull run.",
    avatar: "M",
    earnings: "$7,300+ total earned",
    location: "Sunshine Coast, AU",
  },
  {
    name: "Sarah J.",
    role: "Email Newsletter Creator, Tech Weekly",
    quote: "I run a weekly newsletter for 8K Australian tech enthusiasts. Each edition includes a 'Deal of the Week' section with my affiliate link. The click-through rate is 12%, and conversions are consistent. It's my most reliable income stream.",
    avatar: "S",
    earnings: "$4,100+ total earned",
    location: "Newcastle, AU",
  },
  {
    name: "Chris P.",
    role: "Podcast Host, The Crypto Hour",
    quote: "I mention Cryptoelectro in every episode's sponsor segment. My listeners are crypto-native, so they love having a place to spend their coins. The affiliate program literally pays for my podcast hosting and equipment. Closed loop ecosystem.",
    avatar: "C",
    earnings: "$5,600+ total earned",
    location: "Geelong, AU",
  },
  {
    name: "Nina G.",
    role: "Pinterest Tech Curator",
    quote: "I create aesthetic tech flat-lay pins that link to my affiliate page. Pinterest traffic converts surprisingly well for electronics — I think people are in a shopping mindset. Made $780 in my first month. The visual nature of the products helps.",
    avatar: "N",
    earnings: "$1,350+ total earned",
    location: "Cairns, AU",
  },
  {
    name: "Ahmed S.",
    role: "University Student & Side Hustler",
    quote: "I shared my link in my uni's tech group chat when someone asked where to buy a MacBook. They bought it, I made $110. Then their friends bought too. Now I post weekly in student groups and make more than my part-time job. All from my phone.",
    avatar: "A",
    earnings: "$1,900+ total earned",
    location: "Sydney, AU",
  },
  {
    name: "Jess K.",
    role: "Parent Blogger & Home Tech Reviewer",
    quote: "I review family-friendly tech and smart home gadgets. My audience of parents trusts my recommendations for tablets, laptops, and appliances. The 5% commission on big-ticket items like refrigerators and washing machines adds up incredibly fast.",
    avatar: "J",
    earnings: "$3,850+ total earned",
    location: "Christchurch, NZ",
  },
  {
    name: "Ryan M.",
    role: "Full-Time Affiliate Marketer",
    quote: "I've been doing affiliate marketing for 6 years across 40+ programs. Cryptoelectro is in my top 3 by EPC. The crypto niche is underserved, the products are premium, and the 30-day cookie gives me time to nurture leads. This is the most underrated program in Australia right now.",
    avatar: "R",
    earnings: "$12,400+ total earned",
    location: "Sydney, AU",
  },
];

// ============ SCHEMA.ORG STRUCTURED DATA ============
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map((f) => ({
    "@type": "Question",
    "name": f.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": f.a,
    },
  })),
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Cryptoelectro-au",
  "url": "https://cryptoelectro-au.store",
  "description": "Australia's premium electronics marketplace. Buy smartphones, laptops, and gadgets with cryptocurrency and credit cards.",
  "sameAs": [
    "https://cryptoelectro-au.store",
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://cryptoelectro-au.store",
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Affiliate Program",
      "item": "https://cryptoelectro-au.store/affiliate-program",
    },
  ],
};

// const howToSchema = {
//   "@context": "https://schema.org",
//   "@type": "HowTo",
//   "name": "How to Earn with Cryptoelectro-au Affiliate Program",
//   "description": "Five simple steps to start earning crypto commissions as a Cryptoelectro-au affiliate.",
//   "step": howItWorks.map((step, i) => ({
//     "@type": "HowToStep",
//     "position": i + 1,
//     "name": step.title,
//     "text": step.description,
//   })),
// };

export default function AffiliateProgramPage() {
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const row3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animateRow = (ref: React.RefObject<HTMLDivElement | null>, speed: number) => {
      if (!ref.current) return;
      let scrollPos = 0;
      const scroll = () => {
        if (!ref.current) return;
        scrollPos += speed;
        if (scrollPos >= ref.current.scrollWidth / 2) scrollPos = 0;
        ref.current.style.transform = `translateX(-${scrollPos}px)`;
        requestAnimationFrame(scroll);
      };
      const animation = requestAnimationFrame(scroll);
      return () => cancelAnimationFrame(animation);
    };

    const c1 = animateRow(row1Ref, 0.3);
    const c2 = animateRow(row2Ref, 0.4);
    const c3 = animateRow(row3Ref, 0.35);
    return () => { if (c1) c1(); if (c2) c2(); if (c3) c3(); };
  }, []);

  const row1 = testimonials.slice(0, 6);
  const row2 = testimonials.slice(6, 12);
  const row3 = testimonials.slice(12, 18);

  return (
    <>
      {/* ============ JSON-LD STRUCTURED DATA ============ */}
      <Script
        id="schema-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id="schema-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="schema-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* <Script
        id="schema-howto"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      /> */}

      <div className="min-h-screen">
        {/* Hero */}
        <section className="relative overflow-hidden py-16 lg:py-24" aria-labelledby="hero-heading">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-success/5" />
          <div className="absolute top-10 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-success/5 rounded-full blur-3xl" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <Breadcrumb items={[{ label: "Affiliate Program" }]} />
            <div className="text-center max-w-3xl mx-auto mt-8">
              <span className="badge badge-accent text-sm mb-4 inline-block">💰 Earn Passive Income</span>
              <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-tight">Turn Your Audience Into <span className="text-gradient">Crypto Income</span></h1>
              <p className="mt-6 text-lg sm:text-xl text-text-primary/60 leading-relaxed">Join the Cryptoelectro-au Affiliate Program and earn 5% commission on every purchase made through your link. Real products, real commissions, paid in real cryptocurrency. Start earning today — it&apos;s free.</p>
              <div className="flex flex-wrap gap-4 justify-center mt-8">
                <Link href="/register" className="btn-primary text-base px-8 py-4" aria-label="Create your free affiliate account">Start Earning Now</Link>
                <Link href="#how-it-works" className="btn-secondary text-base px-8 py-4">How It Works</Link>
              </div>
              <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-text-primary/40">
                <span>✅ Free to join</span><span>✅ No limits</span><span>✅ Paid in crypto</span><span>✅ 30-day tracking</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-secondary-dark/30" aria-label="Key program statistics">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {[{ value: "5%", label: "Commission Rate" },{ value: "1,000+", label: "Active Affiliates" },{ value: "$50K+", label: "Paid in Commissions" },{ value: "30 Days", label: "Cookie Duration" }].map(s => (
                <div key={s.label} className="card p-6"><p className="text-3xl lg:text-4xl font-heading font-bold text-accent">{s.value}</p><p className="text-sm text-text-primary/50 mt-1">{s.label}</p></div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 lg:py-24" aria-labelledby="benefits-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 id="benefits-heading" className="text-3xl lg:text-4xl font-heading font-bold">Why Join the <span className="text-gradient">Cryptoelectro-au</span> Affiliate Program?</h2>
              <p className="mt-4 text-text-primary/50 max-w-xl mx-auto">More than just commissions — a complete earning ecosystem</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map(b => (
                <article key={b.title} className="card p-6 hover:border-accent/20 transition-all group">
                  <span className="text-3xl block mb-4" aria-hidden="true">{b.icon}</span>
                  <h3 className="text-lg font-heading font-bold mb-2 group-hover:text-accent transition-colors">{b.title}</h3>
                  <p className="text-sm text-text-primary/60 leading-relaxed">{b.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-16 lg:py-24 bg-secondary-dark/30" aria-labelledby="how-heading">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 id="how-heading" className="text-3xl lg:text-4xl font-heading font-bold">How It <span className="text-gradient">Works</span></h2>
              <p className="mt-4 text-text-primary/50 max-w-xl mx-auto">Five simple steps to start earning crypto commissions</p>
            </div>
            <ol className="space-y-6" aria-label="Steps to become an affiliate">
              {howItWorks.map(s => (
                <li key={s.step} className="card p-6 flex gap-6 items-start group hover:border-accent/20 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-all" aria-hidden="true">
                    <span className="text-lg font-heading font-bold text-accent">{s.step}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-bold mb-1">{s.title}</h3>
                    <p className="text-sm text-text-primary/60">{s.description}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="text-center mt-10">
              <Link href="/register" className="btn-primary text-base px-8 py-4" aria-label="Create your free affiliate account">Create Your Free Account & Start Earning</Link>
            </div>
          </div>
        </section>

        {/* Testimonials Carousel */}
        <section className="py-16 lg:py-24 overflow-hidden" aria-labelledby="testimonials-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <div className="text-center">
              <h2 id="testimonials-heading" className="text-3xl lg:text-4xl font-heading font-bold">Trusted by <span className="text-gradient">1,000+ Affiliates</span></h2>
              <p className="mt-4 text-text-primary/50 max-w-xl mx-auto">Real affiliates. Real results. Real crypto earnings.</p>
            </div>
          </div>
          {[row1, row2, row3].map((row, ri) => (
            <div key={ri} className="relative mb-6" aria-label={`Testimonials row ${ri + 1}`}>
              <div ref={ri === 0 ? row1Ref : ri === 1 ? row2Ref : row3Ref} className="flex gap-6 whitespace-nowrap" style={{ width: "max-content" }}>
                {[...row, ...row, ...row].map((t, i) => (
                  <blockquote key={`${t.name}-${ri}-${i}`} className="card p-5 w-[340px] flex-shrink-0 hover:border-accent/20 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${ri === 0 ? 'bg-accent/20 text-accent' : ri === 1 ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`} aria-hidden="true">
                        <span className="text-sm font-heading font-bold">{t.avatar}</span>
                      </div>
                      <div className="min-w-0">
                        <cite className="text-sm font-heading font-semibold truncate not-italic">{t.name}</cite>
                        <p className="text-xs text-text-primary/40 truncate">{t.role}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-2" aria-label="5 out of 5 stars">
                      {[1,2,3,4,5].map(s => (
                        <svg key={s} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-warning" aria-hidden="true">
                          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-xs text-text-primary/60 leading-relaxed line-clamp-4 mb-3 whitespace-normal">&ldquo;{t.quote}&rdquo;</p>
                    <div className="flex items-center justify-between pt-3 border-t border-secondary-light">
                      <span className="text-xs text-success font-medium">{t.earnings}</span>
                      <span className="text-xs text-text-primary/30">{t.location}</span>
                    </div>
                  </blockquote>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* FAQ */}
        <section className="py-16 lg:py-24 bg-secondary-dark/30" aria-labelledby="faq-heading">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 id="faq-heading" className="text-3xl lg:text-4xl font-heading font-bold">Frequently Asked <span className="text-gradient">Questions</span></h2>
            </div>
            <div className="space-y-4" itemScope itemType="https://schema.org/FAQPage">
              {faqs.map(f => (
                <details key={f.q} className="card p-6 group" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                  <summary className="cursor-pointer list-none" itemProp="name">
                    <h3 className="text-base font-heading font-bold mb-2 inline">{f.q}</h3>
                  </summary>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p className="text-sm text-text-primary/60 leading-relaxed mt-2" itemProp="text">{f.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-24" aria-labelledby="cta-heading">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="card p-8 sm:p-12 bg-gradient-to-br from-accent/10 to-secondary relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-success/5 rounded-full blur-3xl" />
              <div className="relative z-10">
                <span className="text-4xl block mb-4" aria-hidden="true">🚀</span>
                <h2 id="cta-heading" className="text-3xl lg:text-4xl font-heading font-bold mb-4">Ready to Start Earning Crypto?</h2>
                <p className="text-text-primary/60 max-w-lg mx-auto mb-8">Join 1,000+ affiliates already earning passive income with Cryptoelectro-au. It&apos;s free, takes 2 minutes, and you can start sharing your link immediately.</p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link href="/register" className="btn-primary text-base px-8 py-4" aria-label="Create your free affiliate account">Create Free Account</Link>
                  <Link href="/login" className="btn-secondary text-base px-8 py-4">I Already Have an Account</Link>
                </div>
                <p className="text-xs text-text-primary/40 mt-4">No credit card required. Earn your first commission today.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}