"use client";

import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-heading font-bold mb-8">Add New Product</h1>
      <ProductForm />
    </div>
  );
}