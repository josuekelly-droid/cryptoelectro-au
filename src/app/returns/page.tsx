import { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Returns Policy",
  description: "Easy returns within 30 days. Learn how to return your products.",
};

export default function ReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Returns" }]} />
      
      <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-8">Returns <span className="text-gradient">Policy</span></h1>

      <div className="space-y-8 text-text-primary/70 leading-relaxed">
        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">30-Day Return Policy</h2>
          <p>We offer a 30-day return policy for most products. If you are not completely satisfied with your purchase, you can return it within 30 days of delivery for a full refund or exchange.</p>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">Conditions for Returns</h2>
          <ul className="list-disc ml-6 space-y-2 text-sm">
            <li>Items must be in original condition with all accessories and packaging</li>
            <li>Proof of purchase is required (order number or receipt)</li>
            <li>Software, games, and digital products must be unopened</li>
            <li>Personal care items cannot be returned for hygiene reasons</li>
            <li>Return shipping is free for defective or incorrect items</li>
          </ul>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">How to Return an Item</h2>
          <ol className="list-decimal ml-6 space-y-3 text-sm">
            <li>Log into your account and go to your order history</li>
            <li>Select the order and click "Request Return"</li>
            <li>Choose the reason for return and submit</li>
            <li>You will receive a return shipping label via email</li>
            <li>Drop off the package at the nearest post office</li>
            <li>Refunds are processed within 5-10 business days after we receive the item</li>
          </ol>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">Refunds</h2>
          <p>Refunds are issued to the original payment method:</p>
          <ul className="list-disc ml-6 space-y-2 text-sm">
            <li>Crypto payments: Refunded in the same cryptocurrency at the current exchange rate</li>
            <li>Card payments: Refunded to the original card</li>
          </ul>
        </section>

        <div className="text-center">
          <Link href="/contact" className="btn-primary">Start a Return</Link>
        </div>
      </div>
    </div>
  );
}