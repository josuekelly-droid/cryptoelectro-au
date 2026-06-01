"use client";

import { useEffect } from "react";

interface SchemaScriptProps {
  schema: Record<string, any>;
}

export default function SchemaScript({ schema }: SchemaScriptProps) {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [schema]);

  return null;
}