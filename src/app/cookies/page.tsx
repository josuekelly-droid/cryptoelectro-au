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
        <p>Last updated: June 2026</p>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">What Are Cookies</h2>
          <p>Cookies are small text files stored on your device when you visit a website. They help us remember your preferences, keep you signed in, and improve your shopping experience.</p>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">Cookies We Use</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-secondary-light">
                  <th className="py-3 pr-4 font-heading font-semibold text-text-primary">Cookie</th>
                  <th className="py-3 pr-4 font-heading font-semibold text-text-primary">Duration</th>
                  <th className="py-3 font-heading font-semibold text-text-primary">Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-secondary-light/50">
                  <td className="py-3 pr-4 font-mono text-xs">auth-token</td>
                  <td className="py-3 pr-4">7 days</td>
                  <td className="py-3">Keeps you signed in to your account. Essential for accessing your dashboard, wishlist, and checkout.</td>
                </tr>
                <tr className="border-b border-secondary-light/50">
                  <td className="py-3 pr-4 font-mono text-xs">affiliate_ref</td>
                  <td className="py-3 pr-4">30 days</td>
                  <td className="py-3">Tracks affiliate referrals. When someone clicks an affiliate link, this cookie ensures the affiliate receives their commission if a purchase is made within 30 days.</td>
                </tr>
                <tr className="border-b border-secondary-light/50">
                  <td className="py-3 pr-4 font-mono text-xs">cookie-consent</td>
                  <td className="py-3 pr-4">Permanent</td>
                  <td className="py-3">Remembers your cookie preferences so we don't show the consent banner again.</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-xs">wishlist</td>
                  <td className="py-3 pr-4">Persistent</td>
                  <td className="py-3">Stored in your browser's local storage to remember products you've saved to your wishlist.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">Third-Party Services</h2>
          <p>We use the following third-party services that may set their own cookies:</p>
          <ul className="list-disc ml-6 space-y-1 mt-2">
            <li><strong>NowPayments</strong> — Cryptocurrency payment processing</li>
            <li><strong>PayPal</strong> — Card payment processing</li>
            <li><strong>Vercel</strong> — Website hosting and analytics</li>
          </ul>
          <p className="mt-2">These services have their own cookie policies. We recommend reviewing them for more information.</p>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">Managing Cookies</h2>
          <p>You can control and delete cookies through your browser settings. Here are links to instructions for popular browsers:</p>
          <ul className="list-disc ml-6 space-y-1 mt-2">
            <li><a href="https://support.google.com/chrome/answer/95647" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/en-au/guide/safari/sfri11471/mac" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Safari</a></li>
            <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
          </ul>
          <p className="mt-2">Blocking essential cookies (like auth-token) may prevent you from signing in or completing purchases.</p>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">Updates to This Policy</h2>
          <p>We may update this Cookie Policy from time to time. Changes will be posted on this page with an updated date.</p>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">Contact Us</h2>
          <p>If you have questions about our use of cookies, please contact us at{" "}
            <a href="mailto:cryptoelectroau@gmail.com" className="text-accent hover:underline">cryptoelectroau@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}