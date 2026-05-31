"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    // Supprimer l'ancien script s'il existe
    if (scriptRef.current) {
      scriptRef.current.remove();
    }

    // Créer le schema BreadcrumbList
    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: window.location.origin + "/",
        },
        ...items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 2,
          name: item.label,
          item: item.href ? window.location.origin + item.href : undefined,
        })),
      ].filter((i) => i.item !== undefined),
    };

    // Injecter le script proprement
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    scriptRef.current = script;

    return () => {
      if (scriptRef.current) {
        scriptRef.current.remove();
      }
    };
  }, [items]);

  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        <li>
          <Link
            href="/"
            className="text-text-primary/50 hover:text-accent transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
              <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
            </svg>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-3 h-3 text-text-primary/30"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
            {item.href ? (
              <Link
                href={item.href}
                className="text-text-primary/50 hover:text-accent transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-text-primary">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}