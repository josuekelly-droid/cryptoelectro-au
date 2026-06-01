"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://cryptoelectro-au.vercel.app";
const categories = ["All", "Crypto", "Tech", "Gaming", "Lifestyle"];

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // SEO dynamique
    document.title = "Blog - Cryptoelectro-au | Tech, Crypto & Electronics Guides";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", "Read the latest tech news, crypto guides, and electronics buying tips on the Cryptoelectro-au blog. Stay informed about premium electronics and cryptocurrency payments in Australia.");
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", "Cryptoelectro-au Blog - Tech, Crypto & Electronics");
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", "Expert guides on electronics, cryptocurrency, gaming, and smart home tech. Read the Cryptoelectro-au blog.");
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", `${SITE_URL}/blog`);

    // Schema JSON-LD Blog
    const schema = {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Cryptoelectro-au Blog",
      description: "Tech news, crypto guides, and electronics buying tips for Australia.",
      url: `${SITE_URL}/blog`,
      publisher: {
        "@type": "Organization",
        name: "Cryptoelectro-au",
        url: SITE_URL,
        email: "cryptoelectroau@gmail.com",
      },
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    fetch("/api/blog")
      .then((r) => r.json())
      .then((d) => {
        if (d.posts && d.posts.length > 0) {
          setPosts(d.posts.map((p: any) => ({
            id: p.id,
            title: p.title,
            excerpt: p.excerpt,
            category: p.category,
            date: new Date(p.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
            readTime: Math.ceil((p.content?.split(" ").length || 0) / 200) + " min read",
            image: p.image || "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=400&fit=crop",
            author: p.author,
          })));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => { if (script) document.head.removeChild(script); };
  }, []);

  const filteredPosts = activeCategory === "All" ? posts : posts.filter((p) => p.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Blog" }]} />
      <div className="text-center mb-12">
        <h1 className="text-3xl lg:text-4xl font-heading font-bold">Cryptoelectro <span className="text-gradient">Blog</span></h1>
        <p className="mt-4 text-text-primary/50 max-w-xl mx-auto">Insights, guides, and the latest news on electronics and cryptocurrency in Australia.</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((cat) => (<button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-body transition-colors ${activeCategory === cat ? "bg-accent text-white" : "bg-secondary text-text-primary/60 hover:text-text-primary hover:bg-secondary-light"}`}>{cat}</button>))}
      </div>
      {loading ? <p className="text-center text-text-primary/50">Loading articles...</p> : filteredPosts.length === 0 ? <div className="text-center py-16"><p className="text-text-primary/50">No articles yet.</p></div> : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`} className="card-hover group overflow-hidden">
              <div className="aspect-video overflow-hidden bg-secondary-light"><img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-3"><span className="badge badge-accent text-xs">{post.category}</span><span className="text-xs text-text-primary/40">{post.readTime}</span></div>
                <h2 className="text-lg font-heading font-bold text-text-primary group-hover:text-accent transition-colors line-clamp-2 mb-2">{post.title}</h2>
                <p className="text-sm text-text-primary/50 line-clamp-2 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center"><span className="text-xs font-heading font-bold text-accent">{post.author?.charAt(0) || "C"}</span></div><span className="text-xs text-text-primary/40">{post.author || "Team"}</span></div>
                  <span className="text-xs text-text-primary/30">{post.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}