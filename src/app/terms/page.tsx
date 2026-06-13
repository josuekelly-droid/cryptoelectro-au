import { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for using Cryptoelectro-au. Read our policies on orders, payments, returns, and liability.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Terms & Conditions" }]} />
      
      <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-8">Terms & <span className="text-gradient">Conditions</span></h1>

      <div className="space-y-8 text-text-primary/70 leading-relaxed text-sm">
        <p>Last updated: June 2026</p>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">1. Acceptance of Terms</h2>
          <p>By accessing and using Cryptoelectro-au ("we", "our", "us"), you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you must not use our website or services.</p>
          <p>We may update these terms at any time. Continued use of the website after changes constitutes acceptance of the new terms.</p>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">2. Eligibility</h2>
          <p>To use our services, you must be at least 18 years old and capable of entering into a legally binding contract. By placing an order, you confirm that you meet these requirements.</p>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">3. Account Registration</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>You must provide accurate and complete information when creating an account</li>
            <li>You are responsible for maintaining the confidentiality of your password</li>
            <li>You must notify us immediately of any unauthorized use of your account</li>
            <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
          </ul>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">4. Products and Pricing</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>All prices are in Australian Dollars (AUD) and include GST where applicable</li>
            <li>Prices and availability are subject to change without notice</li>
            <li>Product images are for illustration purposes — actual products may vary slightly</li>
            <li>We reserve the right to limit quantities or refuse orders at our discretion</li>
            <li>In the event of a pricing error, we will notify you and give you the option to cancel or pay the correct price</li>
          </ul>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">5. Orders and Payment</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>All orders are subject to acceptance and availability</li>
            <li>We accept cryptocurrency (BTC, ETH, USDT, TRX, SOL, USDC, and 100+ more) via NowPayments</li>
            <li>We accept credit/debit cards via PayPal</li>
            <li>Store credit and loyalty discounts can be applied at checkout</li>
            <li>Crypto exchange rates are locked at checkout — the exact crypto amount displayed is the amount you must send</li>
            <li>Orders not paid within 30 minutes of creation are automatically cancelled</li>
            <li>Payment is only confirmed once detected on the blockchain (crypto) or authorized by PayPal (card)</li>
          </ul>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">6. Shipping and Delivery</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>We ship to all Australian states and territories, plus select international destinations</li>
            <li>Free standard shipping on orders over $500 AUD within Australia</li>
            <li>Delivery times are estimates and not guaranteed</li>
            <li>Risk of loss passes to you upon delivery of the item to the carrier</li>
            <li>For full details, see our <Link href="/shipping" className="text-accent hover:underline">Shipping Information</Link></li>
          </ul>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">7. Returns and Refunds</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>30-day return policy on most items — see our <Link href="/returns" className="text-accent hover:underline">Returns Policy</Link> for full details</li>
            <li>Crypto refunds are issued in the same cryptocurrency at the exchange rate current at the time of refund</li>
            <li>Card refunds are processed to the original payment method</li>
            <li>Return shipping is free for defective or incorrect items</li>
          </ul>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">8. Intellectual Property</h2>
          <p>All content on this website — including logos, images, product descriptions, and blog posts — is the property of Cryptoelectro-au or its content suppliers and is protected by Australian and international copyright laws. Unauthorized use, reproduction, or distribution is prohibited.</p>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">9. User Conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Use the website for any unlawful purpose</li>
            <li>Submit false or misleading information</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Use bots, scrapers, or automated tools to access the website</li>
            <li>Interfere with other users' enjoyment of the website</li>
          </ul>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">10. Limitation of Liability</h2>
          <p>To the fullest extent permitted by law, Cryptoelectro-au shall not be liable for:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Any indirect, incidental, special, or consequential damages</li>
            <li>Loss of profits, revenue, data, or business opportunities</li>
            <li>Damages resulting from cryptocurrency market volatility</li>
            <li>Delays caused by payment processing, shipping carriers, or events beyond our control</li>
          </ul>
          <p>Our total liability for any claim shall not exceed the amount you paid for the product in question.</p>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">11. Australian Consumer Law</h2>
          <p>These terms do not exclude, restrict, or modify any rights that you have under the Australian Consumer Law (Competition and Consumer Act 2010). Our goods come with guarantees that cannot be excluded under Australian Consumer Law.</p>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">12. Privacy and Cookies</h2>
          <p>Your use of our website is also governed by our{" "}
            <Link href="/privacy" className="text-accent hover:underline">Privacy Policy</Link>{" "}
            and{" "}
            <Link href="/cookies" className="text-accent hover:underline">Cookie Policy</Link>.
          </p>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">13. Affiliate Program</h2>
          <p>Participation in our affiliate program is governed by the Affiliate Terms available on the{" "}
            <Link href="/affiliate-program" className="text-accent hover:underline">Affiliate Program</Link> page.
          </p>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">14. Termination</h2>
          <p>We reserve the right to terminate or suspend your account and access to our services at our sole discretion, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.</p>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">15. Contact Information</h2>
          <p>For questions about these Terms & Conditions, contact us at{" "}
            <a href="mailto:cryptoelectroau@gmail.com" className="text-accent hover:underline">cryptoelectroau@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}