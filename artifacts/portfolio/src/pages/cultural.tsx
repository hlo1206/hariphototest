import { useState } from "react";
import { Layout } from "@/components/layout";
import { MasonryGrid } from "@/components/masonry-grid";
import { Lightbox } from "@/components/lightbox";
import { categories, Photo } from "@/lib/data";
import { motion } from "framer-motion";

const subCategories = ["All", "Ganpati", "Gudi Padwa", "Diwali"];

export default function Cultural() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const filteredPhotos = activeFilter === "All" 
    ? categories.cultural 
    : categories.cultural.filter(p => p.subCategory === activeFilter);

  const openLightbox = (photo: Photo, index: number) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  return (
    <Layout>
      <div className="pt-32 pb-16 px-6 md:px-12 max-w-screen-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 max-w-2xl"
        >
          <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-6">Cultural Events</h1>
          <p className="text-muted-foreground font-light text-lg">
            The beating heart of Indian traditions. Vibrant, spiritual, and deeply rooted in the rhythms of the community.
          </p>
        </motion.div>

        {/* Filter Chips */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-4 mb-16"
        >
          {subCategories.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-full text-sm tracking-wide uppercase transition-colors ${
                activeFilter === filter 
                  ? "bg-foreground text-background" 
                  : "bg-secondary text-secondary-foreground hover:bg-foreground/10"
              }`}
            >
              {filter}
            </button>
          ))}
        </motion.div>

        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <MasonryGrid photos={filteredPhotos} onPhotoClick={openLightbox} />
        </motion.div>
      </div>

      <Lightbox
        photos={filteredPhotos}
        currentIndex={currentPhotoIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setCurrentPhotoIndex}
      />
    </Layout>
  );
}
