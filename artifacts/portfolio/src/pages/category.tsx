import { useState, useMemo } from "react";
import { useRoute } from "wouter";
import { Layout } from "@/components/layout";
import { MasonryGrid } from "@/components/masonry-grid";
import { Lightbox } from "@/components/lightbox";
import { motion } from "framer-motion";
import { useCategories, useSubcategories, usePhotos } from "@/lib/queries";
import { useHashFilter } from "@/hooks/use-hash-filter";
import NotFound from "@/pages/not-found";

export default function CategoryPage() {
  const [, params] = useRoute("/c/:slug");
  const slug = params?.slug ?? "";

  const { data: categories, isLoading: catLoading } = useCategories();
  const { data: subcats } = useSubcategories();
  const { data: photos = [], isLoading: photosLoading } = usePhotos({
    categorySlug: slug,
  });

  const category = categories?.find((c) => c.slug === slug);
  const categorySubs = useMemo(
    () => (category ? (subcats ?? []).filter((s) => s.category_id === category.id) : []),
    [category, subcats],
  );

  const subFilters = useMemo(
    () => ["All", ...categorySubs.map((s) => s.name)],
    [categorySubs],
  );

  const [activeFilter, setActiveFilter] = useHashFilter(subFilters);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  if (!catLoading && !category) {
    return <NotFound />;
  }

  const filtered =
    activeFilter === "All"
      ? photos
      : photos.filter((p) => p.subCategory === activeFilter);

  return (
    <Layout>
      <div className="pt-32 pb-16 px-6 md:px-12 max-w-screen-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 max-w-2xl"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">
            Collection
          </p>
          <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-6">
            {category?.name ?? "Loading…"}
          </h1>
          {category?.description && (
            <p className="text-muted-foreground font-light text-lg">
              {category.description}
            </p>
          )}
        </motion.div>

        {categorySubs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-3 mb-16"
          >
            {subFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full text-sm tracking-wide uppercase transition-colors ${
                  activeFilter === filter
                    ? "bg-foreground text-background"
                    : "bg-secondary text-secondary-foreground hover:bg-foreground/10"
                }`}
              >
                {filter}
              </button>
            ))}
          </motion.div>
        )}

        {photosLoading ? (
          <div className="py-24 text-center text-muted-foreground font-light">
            Loading photographs…
          </div>
        ) : (
          <MasonryGrid
            photos={filtered}
            onPhotoClick={(_p, i) => {
              setCurrentPhotoIndex(i);
              setLightboxOpen(true);
            }}
          />
        )}
      </div>

      <Lightbox
        photos={filtered}
        currentIndex={currentPhotoIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setCurrentPhotoIndex}
      />
    </Layout>
  );
}
