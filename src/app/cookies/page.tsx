import { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How Cryptoelectro-au uses cookies and similar technologies.",
};

export default function CookiesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Cookie Policy" }]} />
      
      <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-8">Cookie <span className="text-gradient">Policy</span></h1>

      <div className="space-y-8 text-text-primary/70 leading-relaxed text-sm">
        <p>Last updated: May 2026</p>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">What Are Cookies</h2>
          <p>Cookies are small text files stored on your device when you visit a website. They help us remember your preferences and improve your experience.</p>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">How We Use Cookies</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li><strong>Essential Cookies:</strong> Required for the website to function (authentication, cart, checkout)</li>
            <li><strong>Preference Cookies:</strong> Remember your language, currency, and display preferences</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
            <li><strong>Marketing Cookies:</strong> Used to show relevant advertisements (with your consent)</li>
          </ul>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">Managing Cookies</h2>
          <p>You can control and delete cookies through your browser settings. Blocking essential cookies may affect website functionality.</p>
        </section>
      </div>
    </div>
  );
}