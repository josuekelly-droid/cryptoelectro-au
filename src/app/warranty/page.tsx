import { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Warranty",
  description: "2-year warranty on all products at Cryptoelectro-au.",
};

export default function WarrantyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Warranty" }]} />
      
      <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-8">Warranty <span className="text-gradient">Information</span></h1>

      <div className="space-y-8 text-text-primary/70 leading-relaxed">
        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">2-Year Warranty Included</h2>
          <p>All products sold on Cryptoelectro-au come with a minimum 2-year manufacturer warranty. This covers defects in materials and workmanship under normal use.</p>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">What's Covered</h2>
          <ul className="list-disc ml-6 space-y-2 text-sm">
            <li>Manufacturing defects</li>
            <li>Hardware failures not caused by misuse</li>
            <li>Battery defects (if battery holds less than 80% capacity within warranty period)</li>
          </ul>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">What's Not Covered</h2>
          <ul className="list-disc ml-6 space-y-2 text-sm">
            <li>Accidental damage (drops, spills, cracks)</li>
            <li>Water damage beyond rated IP protection</li>
            <li>Unauthorized repairs or modifications</li>
            <li>Normal wear and tear</li>
            <li>Lost or stolen products</li>
          </ul>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-text-primary">How to Claim Warranty</h2>
          <p>Contact our support team with your order number and a description of the issue. We will guide you through the warranty claim process.</p>
        </section>

        <div className="text-center">
          <Link href="/contact" className="btn-primary">Claim Warranty</Link>
        </div>
      </div>
    </div>
  );
}