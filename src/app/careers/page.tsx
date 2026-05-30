"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function CareersPage() {
  const [careers, setCareers] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/careers")
      .then(r => r.json())
      .then(d => setCareers(d.careers || []));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Careers" }]} />
      <div className="text-center mb-12">
        <h1 className="text-3xl lg:text-4xl font-heading font-bold">
          Join Our <span className="text-gradient">Team</span>
        </h1>
        <p className="mt-4 text-text-primary/50 max-w-xl mx-auto">
          Help us build the future of crypto e-commerce in Australia.
        </p>
      </div>
      <div className="space-y-4">
        {careers.map((job) => (
          <div key={job.id} className="card p-6 hover:border-accent/30 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <h2 className="text-lg font-heading font-bold">{job.title}</h2>
                <p className="text-sm text-text-primary/50">{job.department} · {job.location} · {job.type}</p>
              </div>
              {job.salary && <span className="badge badge-accent text-sm">{job.salary}</span>}
            </div>
            <p className="text-sm text-text-primary/60 line-clamp-3 mb-4">{job.description}</p>
            <Link href={`/careers/${job.id}`} className="text-sm text-accent hover:underline">View Details →</Link>
          </div>
        ))}
        {careers.length === 0 && (
          <div className="text-center py-16">
            <p className="text-text-primary/50">No open positions at the moment. Check back later!</p>
          </div>
        )}
      </div>
    </div>
  );
}