"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function BlogPostPage() {
  const params = useParams();
  const id = params.id as string;
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blog`)
      .then((r) => r.json())
      .then((d) => {
        const found = (d.posts || []).find((p: any) => p.id === id || p.slug === id);
        setPost(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8"><p className="text-text-primary/50">Loading...</p></div>;

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl font-heading font-bold mb-4">Article Not Found</h1>
          <p className="text-text-primary/50 mb-8">The article you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/blog" className="btn-primary">Back to Blog</Link>
        </div>
      </div>
    );
  }

  const renderContent = (content: string) => {
    if (!content) return null;
    return content.split("\n").filter((line) => line.trim() !== "").map((line, i) => {
      if (line.startsWith("## ")) return <h2 key={i} className="text-xl sm:text-2xl font-heading font-bold mt-8 mb-4">{line.replace("## ", "")}</h2>;
      if (line.startsWith("### ")) return <h3 key={i} className="text-lg sm:text-xl font-heading font-semibold mt-6 mb-3">{line.replace("### ", "")}</h3>;
      if (line.startsWith("- ")) return <li key={i} className="ml-6 mb-2 text-text-primary/70 list-disc">{line.replace("- ", "")}</li>;
      if (line.match(/^\d\./)) return <li key={i} className="ml-6 mb-2 text-text-primary/70 list-decimal">{line.replace(/^\d\. /, "")}</li>;
      return <p key={i} className="text-text-primary/70 leading-relaxed mb-3">{line}</p>;
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />

      {post.image && (
        <div className="aspect-video rounded-xl overflow-hidden bg-secondary-light mb-8 mt-6">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="badge badge-accent text-xs">{post.category}</span>
          <span className="text-xs text-text-primary/40">{Math.ceil((post.content?.split(" ").length || 0) / 200)} min read</span>
          <span className="text-xs text-text-primary/30">·</span>
          <span className="text-xs text-text-primary/40">{new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold leading-tight">{post.title}</h1>
        <div className="flex items-center gap-3 mt-6">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="text-sm font-heading font-bold text-accent">{post.author?.charAt(0) || "C"}</span>
          </div>
          <div>
            <p className="text-sm font-medium">{post.author || "Cryptoelectro Team"}</p>
            <p className="text-xs text-text-primary/40">{post.category}</p>
          </div>
        </div>
      </div>

      <div className="prose prose-invert max-w-none">
        {renderContent(post.content)}
      </div>

      <div className="border-t border-secondary-light my-12" />
      <Link href="/blog" className="btn-secondary text-sm">← Back to Blog</Link>
    </div>
  );
}