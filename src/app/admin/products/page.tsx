"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  inStock: boolean;
  brand: { name: string };
  category: { name: string };
  _count: { orderItems: number; reviews: number };
  createdAt: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data.products);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading font-bold">Products</h1>
        <Link href="/admin/products/new" className="btn-primary text-sm">
          + Add Product
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary-light">
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Product</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Brand</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Category</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Price</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Stock</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-secondary-light hover:bg-secondary-dark/30">
                  <td className="px-6 py-4 text-sm font-medium">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-text-primary/60">{product.brand.name}</td>
                  <td className="px-6 py-4 text-sm text-text-primary/60">{product.category.name}</td>
                  <td className="px-6 py-4 text-sm">${Number(product.price).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`badge text-xs ${product.inStock ? "badge-success" : "badge-error"}`}>
                      {product.inStock ? "In Stock" : "Out"}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <Link href={`/admin/products/${product.id}/edit`} className="text-sm text-accent hover:underline">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(product.id)} className="text-sm text-error hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}