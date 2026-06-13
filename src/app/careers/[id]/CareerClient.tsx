"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";

interface CareerClientProps {
  slug: string;
}

export default function CareerClient({ slug }: CareerClientProps) {
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/careers")
      .then((r) => r.json())
      .then((d) => {
        const found = (d.careers || []).find((c: any) => c.id === slug || c.slug === slug);
        setJob(found || null);
        setLoading(false);

        if (found) {
          // Schema JSON-LD JobPosting
          const schema = {
            "@context": "https://schema.org",
            "@type": "JobPosting",
            title: found.title,
            description: found.description,
            datePosted: found.createdAt,
            validThrough: new Date(new Date(found.createdAt).getTime() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            employmentType: found.type?.replace("-", "_").toUpperCase(),
            hiringOrganization: {
              "@type": "Organization",
              name: "Cryptoelectro-au",
              sameAs: "https://cryptoelectro-au.store",
              email: "cryptoelectroau@gmail.com",
            },
            jobLocation: {
              "@type": "Place",
              address: {
                "@type": "PostalAddress",
                addressLocality: found.location || "Sydney",
                addressRegion: "NSW",
                addressCountry: "AU",
                postalCode: "2000",        
                streetAddress: "123 George Street",
              },
            },
            baseSalary: found.salary
              ? {
                  "@type": "MonetaryAmount",
                  currency: "AUD",
                  value: { "@type": "QuantitativeValue", value: found.salary, unitText: "YEAR" },
                }
              : undefined,
            applicationContact: {
              "@type": "ContactPoint",
              email: "cryptoelectroau@gmail.com",
              contactType: "Apply",
            },
          };
          const script = document.createElement("script");
          script.type = "application/ld+json";
          script.textContent = JSON.stringify(schema);
          document.head.appendChild(script);
          return () => { document.head.removeChild(script); };
        }
      });
  }, [slug]);

  if (loading)
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-text-primary/50">Loading...</p>
      </div>
    );

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-heading font-bold mb-4">Job Not Found</h2>
        <p className="text-text-primary/50 mb-6">This position may have been filled or removed.</p>
        <Link href="/careers" className="btn-primary">View All Jobs</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Careers", href: "/careers" }, { label: job.title }]} />

      <div className="card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold">{job.title}</h1>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="badge badge-accent text-xs">{job.department}</span>
              <span className="badge badge-accent text-xs">{job.location}</span>
              <span className="badge badge-accent text-xs">{job.type}</span>
            </div>
          </div>
          {job.salary && <span className="badge badge-success text-sm px-4 py-2">{job.salary}</span>}
        </div>

        <div className="border-t border-secondary-light pt-6">
          <h2 className="text-xl font-heading font-bold mb-4">About the Role</h2>
          <p className="text-text-primary/70 leading-relaxed whitespace-pre-line">{job.description}</p>
        </div>

        {job.requirements && (
          <div className="border-t border-secondary-light pt-6">
            <h2 className="text-xl font-heading font-bold mb-4">Requirements</h2>
            <p className="text-text-primary/70 leading-relaxed whitespace-pre-line">{job.requirements}</p>
          </div>
        )}

        <div className="border-t border-secondary-light pt-6">
          <h2 className="text-xl font-heading font-bold mb-4">How to Apply</h2>
          <p className="text-text-primary/70 leading-relaxed">
            Send your resume and portfolio to{" "}
            <a href="mailto:cryptoelectroau@gmail.com" className="text-accent hover:underline">
              cryptoelectroau@gmail.com
            </a>{" "}
            with the subject line &quot;{job.title} - Application&quot;. We review applications on a rolling basis.
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <Link href="/careers" className="btn-secondary text-sm">← All Jobs</Link>
          <a
            href={`mailto:cryptoelectroau@gmail.com?subject=${encodeURIComponent(job.title)} - Application`}
            className="btn-primary text-sm"
          >
            Apply Now
          </a>
        </div>
      </div>
    </div>
  );
}