"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";

export default function EditProductPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/products/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data.product);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!product) return <div className="p-8">Product not found</div>;

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-heading font-bold mb-8">Edit Product</h1>
      <ProductForm product={product} isEditing />
    </div>
  );
}