import { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Cryptoelectro-au collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Privacy Policy" }]} />
      
      <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-8">Privacy <span className="text-gradient">Policy</span></h1>

      <div className="space-y-8 text-text-primary/70 leading-relaxed text-sm">
        <p>Last updated: May 2026</p>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">1. Information We Collect</h2>
          <p>We collect information you provide when creating an account, placing an order, or contacting support:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Name and contact information (email, phone, address)</li>
            <li>Payment information (crypto wallet addresses for refunds)</li>
            <li>Order history and preferences</li>
          </ul>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">2. How We Use Your Information</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Process and fulfill your orders</li>
            <li>Communicate about your orders and account</li>
            <li>Improve our products and services</li>
            <li>Send promotional emails (with your consent)</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">3. Data Protection</h2>
          <p>We implement industry-standard security measures including SSL/TLS encryption. We never store your crypto private keys or credit card details on our servers.</p>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">4. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal data. Contact us at privacy@cryptoelectro.au to exercise these rights.</p>
        </section>
      </div>
    </div>
  );
}