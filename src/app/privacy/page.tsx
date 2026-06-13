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
        <p>Last updated: June 2026</p>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">1. Information We Collect</h2>
          <p>We collect information you provide when creating an account, placing an order, or contacting support:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li><strong>Account Information:</strong> Name, email address, password (hashed)</li>
            <li><strong>Contact Information:</strong> Phone number, shipping address, billing address</li>
            <li><strong>Payment Information:</strong> Cryptocurrency wallet addresses (for refunds only). We never store credit card details — they are processed by PayPal.</li>
            <li><strong>Order History:</strong> Products purchased, order dates, amounts</li>
            <li><strong>Usage Data:</strong> Pages visited, referral source (affiliate tracking)</li>
          </ul>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">2. How We Use Your Information</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Process and fulfill your orders</li>
            <li>Communicate about your orders and account (confirmation emails, shipping updates)</li>
            <li>Provide customer support</li>
            <li>Send promotional emails (with your explicit consent)</li>
            <li>Track affiliate referrals to credit affiliates with their commissions</li>
            <li>Improve our products and services</li>
            <li>Comply with Australian legal obligations</li>
          </ul>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">3. Cookies & Tracking</h2>
          <p>We use essential cookies to keep you signed in (7 days) and track affiliate referrals (30 days). For full details, see our{" "}
            <a href="/cookies" className="text-accent hover:underline">Cookie Policy</a>.
          </p>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">4. Third-Party Services</h2>
          <p>We share information with trusted third parties to operate our services:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li><strong>NowPayments</strong> — Cryptocurrency payment processing</li>
            <li><strong>PayPal</strong> — Credit/debit card payment processing</li>
            <li><strong>Vercel</strong> — Website hosting (servers in the United States)</li>
            <li><strong>Neon</strong> — Database hosting (servers in Singapore)</li>
          </ul>
          <p>These providers are contractually obligated to protect your data and comply with applicable privacy laws.</p>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">5. Data Retention</h2>
          <p>We retain your account information as long as your account is active. You can request deletion at any time. Order records are retained for 7 years to comply with Australian tax law.</p>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">6. Data Protection</h2>
          <p>We implement industry-standard security measures:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>SSL/TLS encryption for all data in transit</li>
            <li>Passwords hashed with bcrypt (12 rounds)</li>
            <li>JWT authentication with httpOnly cookies</li>
            <li>We never store credit card details or crypto private keys</li>
          </ul>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">7. Your Rights</h2>
          <p>Under the Australian Privacy Act 1988 and GDPR (where applicable), you have the right to:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Delete your account and associated data</li>
            <li>Object to processing of your data</li>
            <li>Data portability</li>
          </ul>
          <p>To exercise these rights, contact us at{" "}
            <a href="mailto:cryptoelectroau@gmail.com" className="text-accent hover:underline">cryptoelectroau@gmail.com</a>.
          </p>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">8. International Data Transfers</h2>
          <p>Your data may be processed in the United States (Vercel), Singapore (Neon), and Australia. We ensure appropriate safeguards are in place for cross-border data transfers.</p>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">9. Children's Privacy</h2>
          <p>Our services are not intended for individuals under 18. We do not knowingly collect data from children.</p>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">10. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. Material changes will be communicated via email.</p>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">11. Contact Us</h2>
          <p>For privacy-related inquiries, contact our Data Protection Officer at{" "}
            <a href="mailto:cryptoelectroau@gmail.com" className="text-accent hover:underline">cryptoelectroau@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}