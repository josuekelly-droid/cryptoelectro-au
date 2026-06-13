import { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Warranty",
  description: "All products at Cryptoelectro-au come with a minimum 2-year manufacturer warranty. Learn what's covered and how to claim.",
};

export default function WarrantyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Warranty" }]} />
      
      <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-8">Warranty <span className="text-gradient">Information</span></h1>

      <div className="space-y-8 text-text-primary/70 leading-relaxed text-sm">
        <p>Last updated: June 2026</p>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">2-Year Warranty Included</h2>
          <p>All products sold on Cryptoelectro-au come with a minimum <strong className="text-text-primary">2-year manufacturer warranty</strong> covering defects in materials and workmanship under normal use. This is our promise to you — every purchase is protected.</p>
          <p>This warranty operates in addition to your rights under the <strong className="text-text-primary">Australian Consumer Law</strong>, which provides statutory guarantees that cannot be excluded.</p>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">What's Covered</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Manufacturing defects present at the time of purchase</li>
            <li>Hardware failures that occur during normal use (not caused by misuse)</li>
            <li>Screen defects (dead pixels exceeding manufacturer threshold)</li>
            <li>Battery defects — if battery holds less than 80% of original capacity within warranty period</li>
            <li>Charging port, button, and speaker failures not caused by physical damage</li>
            <li>Software issues that cannot be resolved through updates or factory reset</li>
          </ul>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">What's Not Covered</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Accidental damage — drops, spills, cracks, dents, or scratches</li>
            <li>Water or liquid damage beyond the device's rated IP protection</li>
            <li>Damage caused by unauthorized repairs, modifications, or use of non-genuine parts</li>
            <li>Normal wear and tear — cosmetic damage like scratches, fading, or worn finishes</li>
            <li>Lost, stolen, or intentionally damaged products</li>
            <li>Damage from use with incompatible accessories or improper voltage</li>
            <li>Battery degradation from normal use (unless below 80% capacity)</li>
            <li>Software issues caused by third-party apps, jailbreaking, or rooting</li>
          </ul>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">Warranty Period by Brand</h2>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-secondary-light">
                  <th className="text-left py-2 pr-4 font-heading font-semibold text-text-primary">Brand</th>
                  <th className="text-left py-2 font-heading font-semibold text-text-primary">Warranty Period</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-secondary-light/50">
                  <td className="py-2 pr-4">Apple</td>
                  <td className="py-2">2 years (Apple Limited Warranty)</td>
                </tr>
                <tr className="border-b border-secondary-light/50">
                  <td className="py-2 pr-4">Samsung</td>
                  <td className="py-2">2 years (Samsung Warranty)</td>
                </tr>
                <tr className="border-b border-secondary-light/50">
                  <td className="py-2 pr-4">HP, Lenovo, Dell</td>
                  <td className="py-2">2 years (Manufacturer Warranty)</td>
                </tr>
                <tr className="border-b border-secondary-light/50">
                  <td className="py-2 pr-4">Sony, Nikon, Canon</td>
                  <td className="py-2">2 years (Manufacturer Warranty)</td>
                </tr>
                <tr className="border-b border-secondary-light/50">
                  <td className="py-2 pr-4">Microsoft, Nintendo</td>
                  <td className="py-2">2 years (Manufacturer Warranty)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Other Brands</td>
                  <td className="py-2">Minimum 2 years (Manufacturer Warranty)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">How to Make a Warranty Claim</h2>
          <ol className="list-decimal ml-6 space-y-3">
            <li>
              <strong>Contact our support team</strong><br />
              Email us at <a href="mailto:cryptoelectroau@gmail.com" className="text-accent hover:underline">cryptoelectroau@gmail.com</a> with:
              <ul className="list-disc ml-6 mt-1 space-y-1">
                <li>Your order number (e.g., CRY-XXXXX)</li>
                <li>A detailed description of the issue</li>
                <li>Photos or videos showing the defect (if applicable)</li>
              </ul>
            </li>
            <li>
              <strong>Assessment</strong><br />
              We will assess your claim within 2-3 business days and coordinate with the manufacturer. We may ask for additional information or troubleshooting steps.
            </li>
            <li>
              <strong>Resolution</strong><br />
              If approved, we will arrange one of the following at no cost to you:
              <ul className="list-disc ml-6 mt-1 space-y-1">
                <li>Repair by an authorized service centre</li>
                <li>Replacement with the same or equivalent model</li>
                <li>Full refund (including original shipping if the item was defective on arrival)</li>
              </ul>
            </li>
            <li>
              <strong>Return shipping</strong><br />
              For approved warranty claims, we provide a prepaid return shipping label. Do not return items without authorization.
            </li>
          </ol>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">Australian Consumer Law</h2>
          <p>Under the Australian Consumer Law (Competition and Consumer Act 2010), you are entitled to:</p>
          <ul className="list-disc ml-6 space-y-2 mt-2">
            <li>A repair, replacement, or refund if a product has a <strong>major problem</strong></li>
            <li>A repair or replacement if a product has a <strong>minor problem</strong></li>
            <li>Compensation for reasonably foreseeable loss or damage caused by a product failure</li>
          </ul>
          <p className="mt-2">These rights apply regardless of the manufacturer warranty and cannot be excluded by these terms.</p>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">Extended Warranty</h2>
          <p>Some manufacturers offer extended warranty options for purchase. Extended warranties are handled directly by the manufacturer and are not included in the standard 2-year coverage. Check the product page or contact the manufacturer for extended warranty availability.</p>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">Contact Us</h2>
          <p>For warranty claims or questions, contact our support team at{" "}
            <a href="mailto:cryptoelectroau@gmail.com" className="text-accent hover:underline">cryptoelectroau@gmail.com</a>.
          </p>
        </section>

        <div className="text-center pt-4">
          <p className="text-sm text-text-primary/50 mb-4">Have a warranty question? We're here to help.</p>
          <Link href="/contact" className="btn-primary">Contact Support</Link>
        </div>
      </div>
    </div>
  );
}