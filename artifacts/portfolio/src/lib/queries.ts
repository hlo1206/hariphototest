import { useQuery } from "@tanstack/react-query";
import { supabase, publicPhotoUrl } from "./supabase";
import type { Category, Subcategory, Photo, AspectRatio } from "./types";

interface JoinedPhotoRow {
  id: string;
  category_id: string;
  subcategory_id: string | null;
  title: string | null;
  storage_path: string;
  aspect_ratio: AspectRatio;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  categories: { slug: string; name: string } | { slug: string; name: string }[] | null;
  subcategories: { name: string } | { name: string }[] | null;
}

function pickOne<T>(v: T | T[] | null | undefined): T | undefined {
  if (!v) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

function mapPhoto(row: JoinedPhotoRow): Photo {
  const cat = pickOne(row.categories);
  const sub = pickOne(row.subcategories);
  return {
    id: row.id,
    src: publicPhotoUrl(row.storage_path),
    storagePath: row.storage_path,
    title: row.title ?? "",
    category: cat?.name ?? "",
    categorySlug: cat?.slug ?? "",
    subCategory: sub?.name,
    aspectRatio: row.aspect_ratio,
    isFeatured: row.is_featured,
  };
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useSubcategories() {
  return useQuery({
    queryKey: ["subcategories"],
    queryFn: async (): Promise<Subcategory[]> => {
      const { data, error } = await supabase
        .from("subcategories")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

interface PhotoQueryOptions {
  categorySlug?: string;
  featuredOnly?: boolean;
  limit?: number;
}

export function usePhotos(opts: PhotoQueryOptions = {}) {
  return useQuery({
    queryKey: ["photos", opts],
    queryFn: async (): Promise<Photo[]> => {
      let query = supabase
        .from("photos")
        .select(
          "id, category_id, subcategory_id, title, storage_path, aspect_ratio, is_featured, sort_order, created_at, categories!inner(slug,name), subcategories(name)",
        )
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (opts.categorySlug) {
        query = query.eq("categories.slug", opts.categorySlug);
      }
      if (opts.featuredOnly) {
        query = query.eq("is_featured", true);
      }
      if (opts.limit) {
        query = query.limit(opts.limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return ((data ?? []) as unknown as JoinedPhotoRow[]).map(mapPhoto);
    },
  });
}
