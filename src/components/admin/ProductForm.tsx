"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
}

interface Brand {
  id: string;
  name: string;
}

interface Spec {
  label: string;
  value: string;
}

interface Color {
  name: string;
  hexCode: string;
  inStock: boolean;
}

interface ProductFormProps {
  product?: {
    id?: string;
    name?: string;
    slug?: string;
    description?: string;
    shortDescription?: string;
    metaTitle?: string | null;
    metaDescription?: string | null;
    price?: number;
    compareAtPrice?: number | null;
    brandId?: string;
    categoryId?: string;
    isFeatured?: boolean;
    isNew?: boolean;
    inStock?: boolean;
    stockQuantity?: number;
    specs?: { label: string; value: string }[];
    colors?: { name: string; hexCode?: string | null; inStock?: boolean }[];
    images?: { url: string }[];
  };
  isEditing?: boolean;
}

export default function ProductForm({ product, isEditing = false }: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    shortDescription: product?.shortDescription || "",
    metaTitle: product?.metaTitle || product?.name || "",
    metaDescription: product?.metaDescription || product?.shortDescription || product?.description?.substring(0, 160) || "",
    price: product?.price || 0,
    compareAtPrice: product?.compareAtPrice?.toString() || "",
    brandId: product?.brandId || "",
    categoryId: product?.categoryId || "",
    isFeatured: product?.isFeatured || false,
    isNew: product?.isNew || false,
    inStock: product?.inStock ?? true,
    stockQuantity: product?.stockQuantity || 0,
  });

  const [specs, setSpecs] = useState<Spec[]>(
    product?.specs?.map((s) => ({ label: s.label, value: s.value })) || [
      { label: "", value: "" },
    ]
  );

  const [colors, setColors] = useState<Color[]>(
    product?.colors?.map((c) => ({
      name: c.name,
      hexCode: c.hexCode || "#000000",
      inStock: c.inStock ?? true,
    })) || [{ name: "", hexCode: "#000000", inStock: true }]
  );

  const [images, setImages] = useState<string[]>(
    product?.images?.map((i) => i.url) || [""]
  );

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []))
      .catch(() => setCategories([]));

    fetch("/api/brands")
      .then((r) => r.json())
      .then((d) => setBrands(d.brands || []))
      .catch(() => setBrands([]));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    });
  };

  const addSpec = () => setSpecs([...specs, { label: "", value: "" }]);

  const updateSpec = (index: number, field: "label" | "value", value: string) => {
    const updated = [...specs];
    updated[index][field] = value;
    setSpecs(updated);
  };

  const removeSpec = (index: number) =>
    setSpecs(specs.filter((_, i) => i !== index));

  const addColor = () =>
    setColors([...colors, { name: "", hexCode: "#000000", inStock: true }]);

  const updateColor = (index: number, field: keyof Color, val: string | boolean) => {
  const updated = [...colors];
  updated[index] = { ...updated[index], [field]: val };
  setColors(updated);
};

  const removeColor = (index: number) =>
    setColors(colors.filter((_, i) => i !== index));

  const addImage = () => setImages([...images, ""]);

  const updateImage = (index: number, value: string) => {
    const updated = [...images];
    updated[index] = value;
    setImages(updated);
  };

  const removeImage = (index: number) =>
    setImages(images.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = isEditing
      ? `/api/admin/products/${product?.id}`
      : "/api/admin/products";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          compareAtPrice: form.compareAtPrice
            ? Number(form.compareAtPrice)
            : null,
          specs: specs.filter((s) => s.label && s.value),
          colors: colors.filter((c) => c.name),
          images: images.filter((i) => i),
        }),
      });

      if (res.ok) {
        router.push("/admin/products");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Network error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {error && (
        <div className="bg-error/10 border border-error/30 text-error text-sm p-3 rounded-md">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="card p-6 space-y-4">
        <h3 className="text-lg font-heading font-bold">Basic Information</h3>

        <div>
          <label className="block text-sm font-medium text-text-primary/70 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary/70 mb-2">
              Price (AUD) *
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="input-field"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary/70 mb-2">
              Compare At Price
            </label>
            <input
              type="number"
              name="compareAtPrice"
              value={form.compareAtPrice}
              onChange={handleChange}
              className="input-field"
              step="0.01"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary/70 mb-2">
              Brand *
            </label>
            <select
              name="brandId"
              value={form.brandId}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Select brand</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary/70 mb-2">
              Category *
            </label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary/70 mb-2">
            Short Description
          </label>
          <textarea
            name="shortDescription"
            value={form.shortDescription}
            onChange={handleChange}
            className="input-field resize-none"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary/70 mb-2">
            Full Description *
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="input-field resize-none"
            rows={5}
            required
          />
        </div>

        {/* 🔍 SEO Section */}
        <div className="border-t border-secondary-light pt-4 mt-4">
          <h4 className="text-sm font-heading font-bold mb-3 text-accent">SEO Meta Tags</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-text-primary/70 mb-2">
                Meta Title
              </label>
              <input
                type="text"
                name="metaTitle"
                value={form.metaTitle}
                onChange={handleChange}
                className="input-field"
                placeholder=""
                maxLength={70}
              />
              <p className="text-xs text-text-primary/40 mt-1">
                {form.metaTitle.length}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary/70 mb-2">
                Meta Description
              </label>
              <textarea
                name="metaDescription"
                value={form.metaDescription}
                onChange={handleChange}
                className="input-field resize-none"
                rows={3}
                placeholder=""
                maxLength={160}
              />
              <p className="text-xs text-text-primary/40 mt-1">
                {form.metaDescription.length}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={handleChange}
              className="w-4 h-4 rounded border-secondary-light bg-secondary text-accent focus:ring-accent focus:ring-offset-0"
            />
            <span className="text-sm">Featured</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isNew"
              checked={form.isNew}
              onChange={handleChange}
              className="w-4 h-4 rounded border-secondary-light bg-secondary text-accent focus:ring-accent focus:ring-offset-0"
            />
            <span className="text-sm">New Arrival</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="inStock"
              checked={form.inStock}
              onChange={handleChange}
              className="w-4 h-4 rounded border-secondary-light bg-secondary text-accent focus:ring-accent focus:ring-offset-0"
            />
            <span className="text-sm">In Stock</span>
          </label>
        </div>
      </div>

      {/* Images */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-heading font-bold">Images</h3>
          <button
            type="button"
            onClick={addImage}
            className="btn-secondary text-sm"
          >
            + Add Image
          </button>
        </div>
        {images.map((img, i) => (
          <div key={i} className="flex gap-3">
            <input
              type="text"
              value={img}
              onChange={(e) => updateImage(i, e.target.value)}
              placeholder="Image URL (e.g., /images/product.webp)"
              className="input-field flex-1"
            />
            {images.length > 1 && (
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="text-error text-sm flex-shrink-0"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Colors */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-heading font-bold">Colors</h3>
          <button
            type="button"
            onClick={addColor}
            className="btn-secondary text-sm"
          >
            + Add Color
          </button>
        </div>
        {colors.map((color, i) => (
          <div key={i} className="flex gap-3 items-center">
            <input
              type="text"
              value={color.name}
              onChange={(e) => updateColor(i, "name", e.target.value)}
              placeholder="Color name (e.g., Phantom Black)"
              className="input-field flex-1"
            />
            <input
              type="color"
              value={color.hexCode}
              onChange={(e) => updateColor(i, "hexCode", e.target.value)}
              className="w-10 h-10 rounded cursor-pointer border border-secondary-light"
            />
            {colors.length > 1 && (
              <button
                type="button"
                onClick={() => removeColor(i)}
                className="text-error text-sm flex-shrink-0"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Specs */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-heading font-bold">Specifications</h3>
          <button
            type="button"
            onClick={addSpec}
            className="btn-secondary text-sm"
          >
            + Add Spec
          </button>
        </div>
        {specs.map((spec, i) => (
          <div key={i} className="flex gap-3">
            <input
              type="text"
              value={spec.label}
              onChange={(e) => updateSpec(i, "label", e.target.value)}
              placeholder="Label (e.g., Display)"
              className="input-field flex-1"
            />
            <input
              type="text"
              value={spec.value}
              onChange={(e) => updateSpec(i, "value", e.target.value)}
              placeholder="Value (e.g., 6.8 inch AMOLED)"
              className="input-field flex-1"
            />
            {specs.length > 1 && (
              <button
                type="button"
                onClick={() => removeSpec(i)}
                className="text-error text-sm flex-shrink-0"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading
            ? "Saving..."
            : isEditing
            ? "Update Product"
            : "Create Product"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}