import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Partners & Backlinks - Cryptoelectro-au",
  description: "Partner with Cryptoelectro-au, Australia's premium crypto electronics marketplace.",
  robots: { index: true, follow: true },
};

const backlinkOpportunities = [
  {
    platform: "BitcoinTalk Forum",
    url: "https://bitcointalk.org",
    description: "Post in the Marketplace section. Share your affiliate link and mention Cryptoelectro-au as a place to spend crypto on electronics.",
    strategy: "Create a signature with your affiliate link. Post helpful content in the Australia section.",
  },
  {
    platform: "Reddit - r/CryptoAus",
    url: "https://reddit.com/r/CryptoAus",
    description: "Australian crypto community. Share your experience and mention Cryptoelectro-au when relevant.",
    strategy: "Post genuine reviews, answer questions about where to spend crypto in Australia.",
  },
  {
    platform: "Reddit - r/BitcoinAUS",
    url: "https://reddit.com/r/BitcoinAUS",
    description: "Bitcoin-focused Australian community. Mention crypto spending options.",
    strategy: "Participate in discussions about crypto adoption and merchant adoption in Australia.",
  },
  {
    platform: "ProductReview.com.au",
    url: "https://www.productreview.com.au",
    description: "Australian review platform. List Cryptoelectro-au as a business and collect reviews.",
    strategy: "Create a business profile. Encourage happy customers to leave reviews.",
  },
  {
    platform: "TrustPilot",
    url: "https://www.trustpilot.com",
    description: "Global review platform. Build trust with verified reviews.",
    strategy: "Claim your business profile. Send review invitations to customers.",
  },
  {
    platform: "Medium / Dev.to",
    url: "https://medium.com",
    description: "Write articles about crypto e-commerce, electronics reviews, and link back to your site.",
    strategy: "Publish 2-3 articles per month with backlinks. Share on social media.",
  },
  {
    platform: "GitHub",
    url: "https://github.com/josuekelly-droid/cryptoelectro-au",
    description: "Your repo is already public! Add a detailed README with your site link.",
    strategy: "Add website link, description, and keywords in README.md. Star and share the repo.",
  },
  {
    platform: "YouTube Tech Reviewers",
    url: "https://youtube.com",
    description: "Contact Australian tech YouTubers for product reviews with affiliate links.",
    strategy: "Offer free products or higher commission rates for video reviews.",
  },
  {
    platform: "Crypto Twitter/X",
    url: "https://x.com",
    description: "Engage with the crypto community. Share updates about your marketplace.",
    strategy: "Post daily about crypto payments, new products, and affiliate success stories.",
  },
  {
    platform: "Australian Business Directories",
    url: "https://www.yellowpages.com.au",
    description: "List your business in Australian directories for local SEO.",
    strategy: "Submit to Yellow Pages, True Local, Hotfrog, and Yelp Australia.",
  },
];

const directories = [
  { name: "Yellow Pages Australia", url: "https://www.yellowpages.com.au" },
  { name: "True Local", url: "https://www.truelocal.com.au" },
  { name: "Hotfrog Australia", url: "https://www.hotfrog.com.au" },
  { name: "Yelp Australia", url: "https://www.yelp.com.au" },
  { name: "Startup Nation Australia", url: "https://www.startupdaily.net" },
  { name: "AngelList", url: "https://www.angellist.com" },
  { name: "Crunchbase", url: "https://www.crunchbase.com" },
];

export default function BacklinksPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-2">
        SEO & Backlink <span className="text-gradient">Strategy</span>
      </h1>
      <p className="text-text-primary/50 mb-8">Internal reference page — not indexed by search engines.</p>

      {/* Priority Actions */}
      <div className="card p-6 mb-8 bg-gradient-to-br from-accent/10 to-secondary">
        <h2 className="text-xl font-heading font-bold mb-3">🚀 Priority Actions This Week</h2>
        <ol className="list-decimal ml-6 space-y-2 text-sm text-text-primary/70">
          <li>Add website URL to GitHub README.md</li>
          <li>Create profiles on ProductReview.com.au and TrustPilot</li>
          <li>Post on r/CryptoAus and r/BitcoinAUS</li>
          <li>Submit to Yellow Pages and True Local</li>
          <li>Write 1 Medium article about buying electronics with crypto</li>
        </ol>
      </div>

      {/* Backlink Opportunities */}
      <h2 className="text-xl font-heading font-bold mb-4">Backlink Opportunities</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {backlinkOpportunities.map((opp) => (
          <div key={opp.platform} className="card p-5">
            <h3 className="font-heading font-semibold mb-1">{opp.platform}</h3>
            <p className="text-xs text-accent mb-2">{opp.url}</p>
            <p className="text-sm text-text-primary/60 mb-2">{opp.description}</p>
            <p className="text-xs text-text-primary/40 italic">Strategy: {opp.strategy}</p>
          </div>
        ))}
      </div>

      {/* Australian Directories */}
      <h2 className="text-xl font-heading font-bold mb-4">Australian Business Directories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {directories.map((dir) => (
          <a key={dir.name} href={dir.url} target="_blank" rel="noopener noreferrer" className="card p-4 text-center hover:border-accent/30 transition-all">
            <p className="text-sm font-medium">{dir.name}</p>
            <p className="text-xs text-accent mt-1">Submit Listing →</p>
          </a>
        ))}
      </div>
    </div>
  );
}