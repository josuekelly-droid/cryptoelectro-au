import { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Cryptoelectro-au, Australia's premium electronics marketplace.",
};

const values = [
  {
    icon: "🔒",
    title: "Trust & Security",
    description:
      "Your transactions are secured by blockchain technology. We never compromise on the safety of your data and funds.",
  },
  {
    icon: "⚡",
    title: "Innovation",
    description:
      "We embrace the future of commerce by integrating cryptocurrency and credit cards payments with premium electronics shopping.",
  },
  {
    icon: "💎",
    title: "Quality",
    description:
      "Every product in our catalog is carefully curated from the world's leading electronics manufacturers.",
  },
  {
    icon: "🌏",
    title: "Accessibility",
    description:
      "Serving all of Australia and surrounding regions with fast shipping and local customer support.",
  },
];

const stats = [
  { value: "50+", label: "Brand Partners" },
  { value: "1,000+", label: "Products Available" },
  { value: "10,000+", label: "Happy Customers" },
  { value: "100+", label: "Cryptos Accepted" },
];

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "About Us" }]} />

      {/* Hero */}
      <div className="text-center py-12 lg:py-16">
        <h1 className="text-3xl lg:text-5xl font-heading font-bold">
          About{" "}
          <span className="text-gradient">Cryptoelectro-au</span>
        </h1>
        <p className="mt-6 text-lg text-text-primary/60 max-w-2xl mx-auto leading-relaxed">
          Australia&apos;s premier destination for high-end electronics. We
          combine premium products with innovative cryptocurrency and credit card payments to
          deliver a shopping experience like no other.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="card p-6 text-center"
          >
            <p className="text-2xl lg:text-3xl font-heading font-bold text-accent">
              {stat.value}
            </p>
            <p className="text-sm text-text-primary/50 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="text-2xl lg:text-3xl font-heading font-bold text-center mb-12">
          Our <span className="text-gradient">Values</span>
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => (
            <div key={value.title} className="card p-6 text-center group">
              <span className="text-4xl block mb-4">{value.icon}</span>
              <h3 className="text-lg font-heading font-bold mb-2 group-hover:text-accent transition-colors">
                {value.title}
              </h3>
              <p className="text-sm text-text-primary/50 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <div className="card p-8 lg:p-12 text-center relative overflow-hidden mb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-accent/10" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-2xl lg:text-3xl font-heading font-bold mb-4">
            Our Mission
          </h2>
          <p className="text-text-primary/60 leading-relaxed">
            To bridge the gap between premium electronics and modern payment
            methods. We believe that Australian consumers deserve access to the
            best technology products with the freedom to pay how they want —
            including with cryptocurrency and credit cards.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-2xl lg:text-3xl font-heading font-bold mb-4">
          Ready to Experience the Future ?
        </h2>
        <p className="text-text-primary/50 mb-6">
          Browse our premium collection and pay with your favorite cryptocurrency or credit cards.
        </p>
        <Link href="/category/all" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    </div>
  );
}