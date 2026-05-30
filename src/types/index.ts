export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  brand: string;
  category: string;
  images: string[];
  specs: Record<string, string>;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isFeatured: boolean;
  isNew: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
}