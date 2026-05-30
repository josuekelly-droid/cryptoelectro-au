import { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Shipping Information",
  description: "Shipping rates, delivery times, and tracking for Cryptoelectro-au.",
};

export default function ShippingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Shipping" }]} />
      
      <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-8">Shipping <span className="text-gradient">Information</span></h1>

      <div className="space-y-8 text-text-primary/70 leading-relaxed">
        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">Delivery Options</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-secondary-dark p-4 rounded-lg">
              <h3 className="font-heading font-semibold text-text-primary mb-2">Standard Shipping</h3>
              <p className="text-sm">3-7 business days</p>
              <p className="text-sm font-medium mt-1">Free on orders over $500</p>
              <p className="text-sm">$29.99 for orders under $500</p>
            </div>
            <div className="bg-secondary-dark p-4 rounded-lg">
              <h3 className="font-heading font-semibold text-text-primary mb-2">Express Shipping</h3>
              <p className="text-sm">1-2 business days to major cities</p>
              <p className="text-sm font-medium mt-1">$49.99 flat rate</p>
            </div>
          </div>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">International Shipping</h2>
          <p>We ship to Australia and surrounding regions including New Zealand, Papua New Guinea, Fiji, and select Pacific Islands.</p>
          <ul className="list-disc ml-6 space-y-2 text-sm">
            <li>New Zealand: 5-10 business days</li>
            <li>Pacific Islands: 7-14 business days</li>
            <li>Rates calculated at checkout based on weight and destination</li>
          </ul>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">Order Tracking</h2>
          <p>Once your order is shipped, you will receive a tracking number via email. You can also track your order from your account dashboard.</p>
        </section>

        <div className="text-center">
          <Link href="/contact" className="btn-primary">Contact Support</Link>
        </div>
      </div>
    </div>
  );
}