import { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Shipping Information",
  description: "Shipping rates, delivery times, and tracking for Cryptoelectro-au. Free shipping on orders over $500 AUD.",
};

export default function ShippingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Shipping" }]} />
      
      <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-8">Shipping <span className="text-gradient">Information</span></h1>

      <div className="space-y-8 text-text-primary/70 leading-relaxed">
        <p>Last updated: June 2026</p>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">Australia-Wide Delivery</h2>
          <p>We deliver to all Australian states and territories. Orders are processed within 1-2 business days and shipped from our distribution centres across Australia.</p>
          
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div className="bg-secondary-dark p-4 rounded-lg">
              <h3 className="font-heading font-semibold text-text-primary mb-2">📦 Standard Shipping</h3>
              <p className="text-sm">3-7 business days to metro areas</p>
              <p className="text-sm">5-10 business days to regional areas</p>
              <p className="text-sm font-medium mt-2 text-success">Free on orders over $500 AUD</p>
              <p className="text-sm">$29.99 AUD for orders under $500</p>
            </div>
            <div className="bg-secondary-dark p-4 rounded-lg">
              <h3 className="font-heading font-semibold text-text-primary mb-2">🚀 Express Shipping</h3>
              <p className="text-sm">1-2 business days to major cities</p>
              <p className="text-sm">2-4 business days to regional areas</p>
              <p className="text-sm font-medium mt-2">$49.99 AUD flat rate</p>
              <p className="text-sm">Australia Post Express or courier</p>
            </div>
          </div>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">International Shipping</h2>
          <p>We ship to select international destinations:</p>
          
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-secondary-light">
                  <th className="text-left py-2 pr-4 font-heading font-semibold text-text-primary">Destination</th>
                  <th className="text-left py-2 pr-4 font-heading font-semibold text-text-primary">Delivery Time</th>
                  <th className="text-left py-2 font-heading font-semibold text-text-primary">Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-secondary-light/50">
                  <td className="py-3 pr-4">🇳🇿 New Zealand</td>
                  <td className="py-3 pr-4">5-10 business days</td>
                  <td className="py-3">Calculated at checkout</td>
                </tr>
                <tr className="border-b border-secondary-light/50">
                  <td className="py-3 pr-4">🇫🇯 Fiji</td>
                  <td className="py-3 pr-4">7-14 business days</td>
                  <td className="py-3">Calculated at checkout</td>
                </tr>
                <tr className="border-b border-secondary-light/50">
                  <td className="py-3 pr-4">🇵🇬 Papua New Guinea</td>
                  <td className="py-3 pr-4">7-14 business days</td>
                  <td className="py-3">Calculated at checkout</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4">🌏 Other Pacific Islands</td>
                  <td className="py-3 pr-4">10-18 business days</td>
                  <td className="py-3">Calculated at checkout</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <p className="text-sm text-text-primary/40 mt-4">International customers are responsible for any customs duties, taxes, or import fees imposed by their country.</p>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">Order Tracking</h2>
          <p>Once your order is shipped, you will receive a confirmation email with:</p>
          <ul className="list-disc ml-6 space-y-2 text-sm mt-2">
            <li>Tracking number and carrier information</li>
            <li>Estimated delivery date</li>
            <li>Link to track your package online</li>
          </ul>
          <p className="mt-2">You can also track all your orders anytime from your <Link href="/dashboard" className="text-accent hover:underline">account dashboard</Link>.</p>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">Processing Time</h2>
          <ul className="list-disc ml-6 space-y-2 text-sm">
            <li>Orders placed before 2 PM AEST are processed the same business day</li>
            <li>Orders placed after 2 PM or on weekends/public holidays are processed the next business day</li>
            <li>Crypto payments are confirmed within 10-30 minutes of detection on the blockchain</li>
            <li>Card payments via PayPal are confirmed instantly</li>
          </ul>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">Shipping Insurance</h2>
          <p>All orders are automatically insured against loss or damage during transit at no extra cost. If your package arrives damaged or goes missing, contact us within 48 hours of delivery (or expected delivery) and we will arrange a replacement or full refund.</p>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">Frequently Asked Questions</h2>
          
          <div className="space-y-3">
            <details className="bg-secondary-dark p-4 rounded-lg">
              <summary className="cursor-pointer font-medium text-text-primary text-sm">Can I change my shipping address after placing an order?</summary>
              <p className="mt-2 text-sm">If your order hasn't been shipped yet, contact us immediately at <a href="mailto:cryptoelectroau@gmail.com" className="text-accent hover:underline">cryptoelectroau@gmail.com</a>. Once shipped, we cannot change the delivery address.</p>
            </details>
            
            <details className="bg-secondary-dark p-4 rounded-lg">
              <summary className="cursor-pointer font-medium text-text-primary text-sm">Do you ship to PO Boxes?</summary>
              <p className="mt-2 text-sm">Yes, we ship to PO Boxes and Parcel Lockers across Australia via Australia Post.</p>
            </details>
            
            <details className="bg-secondary-dark p-4 rounded-lg">
              <summary className="cursor-pointer font-medium text-text-primary text-sm">What if my package is delayed?</summary>
              <p className="mt-2 text-sm">If your order hasn't arrived within the estimated timeframe, check your tracking number first. If the delay exceeds 5 business days beyond the estimate, contact us and we will investigate with the carrier.</p>
            </details>
          </div>
        </section>

        <div className="text-center pt-4">
          <p className="text-sm text-text-primary/50 mb-4">Have a question about shipping? We're here to help.</p>
          <Link href="/contact" className="btn-primary">Contact Support</Link>
        </div>
      </div>
    </div>
  );
}