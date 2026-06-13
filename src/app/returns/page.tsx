import { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Returns Policy",
  description: "Easy returns within 30 days. Learn how to return your products at Cryptoelectro-au.",
};

export default function ReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Returns" }]} />
      
      <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-8">Returns <span className="text-gradient">Policy</span></h1>

      <div className="space-y-8 text-text-primary/70 leading-relaxed">
        <p>Last updated: June 2026</p>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">30-Day Return Policy</h2>
          <p>We offer a hassle-free 30-day return policy on most products. If you are not completely satisfied with your purchase, you can return it within 30 days of delivery for a full refund or exchange. No questions asked.</p>
          <p className="text-sm text-text-primary/40">Return window starts from the date your order is delivered, not the order date.</p>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">Eligibility Requirements</h2>
          <ul className="list-disc ml-6 space-y-2 text-sm">
            <li>Item must be in its original condition — no scratches, dents, or signs of misuse</li>
            <li>All original accessories, manuals, cables, and packaging must be included</li>
            <li>Proof of purchase is required (order confirmation email or order number)</li>
            <li>Items must be returned within 30 days of delivery</li>
            <li>Gift cards and software licenses cannot be returned once activated</li>
          </ul>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">Non-Returnable Items</h2>
          <ul className="list-disc ml-6 space-y-2 text-sm">
            <li>Opened software, games, or digital download codes</li>
            <li>Earphones, headphones, and personal audio devices (hygiene reasons)</li>
            <li>Items damaged by misuse, accident, or unauthorized repair</li>
            <li>Custom or special-order products</li>
            <li>Gift cards and store credits</li>
          </ul>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">How to Return an Item</h2>
          <ol className="list-decimal ml-6 space-y-3 text-sm">
            <li>Log into your account and go to your <Link href="/dashboard" className="text-accent hover:underline">order history</Link></li>
            <li>Select the order containing the item you wish to return</li>
            <li>Click "Request Return" and select the reason</li>
            <li>You will receive a prepaid return shipping label via email within 24 hours</li>
            <li>Pack the item securely in its original packaging</li>
            <li>Drop off at your nearest Australia Post office or authorized courier</li>
            <li>Once we receive and inspect the item, refunds are processed within 5-10 business days</li>
          </ol>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">Return Shipping Costs</h2>
          <ul className="list-disc ml-6 space-y-2 text-sm">
            <li><strong>Defective or incorrect items:</strong> Free return shipping — we cover all costs</li>
            <li><strong>Change of mind:</strong> Return shipping is at your expense. A flat rate of $15 will be deducted from your refund for the prepaid label</li>
            <li><strong>Exchange:</strong> Free shipping on the replacement item</li>
          </ul>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">Refunds</h2>
          <p>Refunds are issued to the original payment method once the item is received and inspected:</p>
          <ul className="list-disc ml-6 space-y-2 text-sm">
            <li><strong>Cryptocurrency payments:</strong> Refunded in the same cryptocurrency at the current exchange rate at the time of refund</li>
            <li><strong>Credit/Debit card payments:</strong> Refunded to the original card — may take 3-5 additional business days to appear on your statement</li>
            <li><strong>PayPal payments:</strong> Refunded to your PayPal account</li>
            <li><strong>Store credit:</strong> Available immediately upon processing</li>
          </ul>
          <p className="text-sm text-text-primary/40 mt-2">Shipping charges are non-refundable except for defective or incorrect items.</p>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">Warranty Returns</h2>
          <p>All products sold on Cryptoelectro-au include the manufacturer's warranty. Duration varies by product and brand. If your product develops a fault covered by warranty:</p>
          <ol className="list-decimal ml-6 space-y-2 text-sm mt-2">
            <li>Contact us at <a href="mailto:cryptoelectroau@gmail.com" className="text-accent hover:underline">cryptoelectroau@gmail.com</a> with your order number and description of the fault</li>
            <li>We will coordinate with the manufacturer to assess your claim</li>
            <li>If approved, we will arrange repair, replacement, or refund at no cost to you</li>
          </ol>
          <p className="mt-2">This is in addition to your rights under Australian Consumer Law.</p>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">Australian Consumer Law</h2>
          <p>Our returns policy operates in addition to your rights under the Australian Consumer Law. You are entitled to a repair, replacement, or refund if a product is faulty, not of acceptable quality, or does not match its description.</p>
        </section>

        <div className="text-center pt-4">
          <p className="text-sm text-text-primary/50 mb-4">Ready to start a return? Contact our support team.</p>
          <Link href="/contact" className="btn-primary">Contact Support</Link>
        </div>
      </div>
    </div>
  );
}