export type AspectRatio = "portrait" | "landscape" | "square";

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
}

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  sort_order: number;
}

export interface PhotoRow {
  id: string;
  category_id: string;
  subcategory_id: string | null;
  title: string | null;
  storage_path: string;
  aspect_ratio: AspectRatio;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
}

export interface Photo {
  id: string;
  src: string;
  storagePath: string;
  title: string;
  category: string;
  categorySlug: string;
  subCategory?: string;
  aspectRatio: AspectRatio;
  isFeatured: boolean;
}
