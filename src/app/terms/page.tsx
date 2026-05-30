import { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for using Cryptoelectro-au.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Terms & Conditions" }]} />
      
      <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-8">Terms & <span className="text-gradient">Conditions</span></h1>

      <div className="space-y-8 text-text-primary/70 leading-relaxed text-sm">
        <p>Last updated: May 2026</p>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">1. Acceptance of Terms</h2>
          <p>By accessing and using Cryptoelectro-au, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our services.</p>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">2. Products and Pricing</h2>
          <p>All prices are listed in Australian Dollars (AUD) and include GST where applicable. We reserve the right to change prices without notice. Product images are for illustration purposes only.</p>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">3. Crypto Payments</h2>
          <p>Cryptocurrency payments are processed through NowPayments. The exchange rate is locked at the time of checkout. We are not responsible for market fluctuations between payment and confirmation.</p>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">4. Limitation of Liability</h2>
          <p>Cryptoelectro-au is not liable for any indirect, incidental, or consequential damages arising from the use of our products or services.</p>
        </section>
      </div>
    </div>
  );
}