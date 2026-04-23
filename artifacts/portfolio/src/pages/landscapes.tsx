import { useState } from "react";
import { Layout } from "@/components/layout";
import { MasonryGrid } from "@/components/masonry-grid";
import { Lightbox } from "@/components/lightbox";
import { categories, Photo } from "@/lib/data";
import { motion } from "framer-motion";

export default function Landscapes() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

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
          className="mb-16 md:mb-24 max-w-2xl"
        >
          <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-6">Landscapes</h1>
          <p className="text-muted-foreground font-light text-lg">
            The quiet majesty of nature. Serene mists, enduring mountains, and the soft light of the early morning.
          </p>
        </motion.div>

        <MasonryGrid photos={categories.landscapes} onPhotoClick={openLightbox} />
      </div>

      <Lightbox
        photos={categories.landscapes}
        currentIndex={currentPhotoIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setCurrentPhotoIndex}
      />
    </Layout>
  );
}
