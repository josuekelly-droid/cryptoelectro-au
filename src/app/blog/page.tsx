"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";

const defaultPosts = [
  {
    id: "1",
    title: "Why Pay with Crypto? The Future of E-Commerce Payments",
    excerpt: "Discover the advantages of using cryptocurrency for your online purchases. Faster, cheaper, and more secure transactions.",
    category: "Crypto",
    date: "May 25, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=400&fit=crop",
    author: "Alex Thompson",
  },
  {
    id: "2",
    title: "Top 10 Smartphones of 2026: Ultimate Buying Guide",
    excerpt: "From Samsung to Apple, we compare the best flagship phones of the year to help you make the right choice.",
    category: "Tech",
    date: "May 20, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=400&fit=crop",
    author: "Sarah Mitchell",
  },
  {
    id: "3",
    title: "How to Secure Your Crypto Wallet: A Complete Guide",
    excerpt: "Learn the best practices for keeping your cryptocurrency safe. Hardware wallets, seed phrases, and security tips.",
    category: "Crypto",
    date: "May 18, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop",
    author: "Alex Thompson",
  },
  {
    id: "4",
    title: "The Rise of Premium Home Appliances in Australia",
    excerpt: "Australian households are investing more in high-end appliances. Here's why and what to look for.",
    category: "Lifestyle",
    date: "May 15, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop",
    author: "James Wilson",
  },
  {
    id: "5",
    title: "Gaming in 2026: PS5 Pro, Xbox Series X2, and Nintendo Switch 2",
    excerpt: "A comprehensive look at the latest gaming consoles and what they mean for Australian gamers.",
    category: "Gaming",
    date: "May 12, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1593118247619-e2d6f056869e?w=800&h=400&fit=crop",
    author: "Sarah Mitchell",
  },
  {
    id: "6",
    title: "Bitcoin vs Ethereum vs USDT: Which to Use for Shopping?",
    excerpt: "Compare the most popular cryptocurrencies for everyday purchases. Speed, fees, and convenience analyzed.",
    category: "Crypto",
    date: "May 10, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=800&h=400&fit=crop",
    author: "Alex Thompson",
  },
  {
    id: "7",
    title: "Building the Ultimate Home Office: Tech Essentials for 2026",
    excerpt: "Remote work is here to stay. Discover the premium tech that will transform your home office into a productivity powerhouse.",
    category: "Tech",
    date: "May 8, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800&h=400&fit=crop",
    author: "James Wilson",
  },
  {
    id: "8",
    title: "Understanding Crypto Market Cycles: A Guide for Beginners",
    excerpt: "New to crypto? Learn how market cycles work and how to make informed decisions when using cryptocurrency for purchases.",
    category: "Crypto",
    date: "May 5, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1631603090989-93f9ef6f9d80?w=800&h=400&fit=crop",
    author: "Alex Thompson",
  },
  {
    id: "9",
    title: "Photography Gear Guide: From Beginner to Pro in 2026",
    excerpt: "Whether you're just starting out or upgrading your kit, here's the essential photography gear available with crypto payments.",
    category: "Tech",
    date: "May 2, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=400&fit=crop",
    author: "Sarah Mitchell",
  },
];

const categories = ["All", "Crypto", "Tech", "Gaming", "Lifestyle"];

export default function BlogPage() {
  const [posts, setPosts] = useState(defaultPosts);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
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
            readTime: Math.ceil(p.content.split(" ").length / 200) + " min read",
            image: p.image || "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=400&fit=crop",
            author: p.author,
          })));
        }
      })
      .catch(() => {});
  }, []);

  const filteredPosts = activeCategory === "All" ? posts : posts.filter((p) => p.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Blog" }]} />

      <div className="text-center mb-12">
        <h1 className="text-3xl lg:text-4xl font-heading font-bold">
          Cryptoelectro <span className="text-gradient">Blog</span>
        </h1>
        <p className="mt-4 text-text-primary/50 max-w-xl mx-auto">
          Insights, guides, and the latest news on electronics and cryptocurrency in Australia.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-body transition-colors ${
              activeCategory === cat ? "bg-accent text-white" : "bg-secondary text-text-primary/60 hover:text-text-primary hover:bg-secondary-light"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {filteredPosts.map((post) => (
          <Link key={post.id} href={`/blog/${post.id}`} className="card-hover group overflow-hidden">
            <div className="aspect-video overflow-hidden bg-secondary-light">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="badge badge-accent text-xs">{post.category}</span>
                <span className="text-xs text-text-primary/40">{post.readTime}</span>
              </div>
              <h2 className="text-lg font-heading font-bold text-text-primary group-hover:text-accent transition-colors line-clamp-2 mb-2">{post.title}</h2>
              <p className="text-sm text-text-primary/50 line-clamp-2 mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-xs font-heading font-bold text-accent">{post.author.charAt(0)}</span>
                  </div>
                  <span className="text-xs text-text-primary/40">{post.author}</span>
                </div>
                <span className="text-xs text-text-primary/30">{post.date}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}