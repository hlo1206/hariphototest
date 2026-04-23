import { useState } from "react";
import { Layout } from "@/components/layout";
import { MasonryGrid } from "@/components/masonry-grid";
import { Lightbox } from "@/components/lightbox";
import { categories, Photo } from "@/lib/data";
import { motion } from "framer-motion";

export default function Portraits() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const openLightbox = (_photo: Photo, index: number) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  return (
    <Layout>
      <div className="pt-32 pb-16 px-6 md:px-12 max-w-screen-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 md:mb-24 max-w-2xl"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">
            Collection
          </p>
          <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-6">
            Portraits
          </h1>
          <p className="text-muted-foreground font-light text-lg">
            Capturing the raw emotion and authentic presence of individuals.
            Every face tells a story, beautifully illuminated by natural light.
          </p>
        </motion.div>

        <MasonryGrid photos={categories.portraits} onPhotoClick={openLightbox} />
      </div>

      <Lightbox
        photos={categories.portraits}
        currentIndex={currentPhotoIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setCurrentPhotoIndex}
      />
    </Layout>
  );
}
