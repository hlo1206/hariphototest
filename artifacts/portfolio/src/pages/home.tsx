import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout";
import { MasonryGrid } from "@/components/masonry-grid";
import { Lightbox } from "@/components/lightbox";
import { usePhotos } from "@/lib/queries";
import hariPhoto from "@assets/IMG-20260423-WA0005_1776950452874.jpg";

export default function Home() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const { data: featured = [] } = usePhotos({ featuredOnly: true, limit: 9 });
  const heroSrc = featured[0]?.src ?? hariPhoto;

  return (
    <Layout>
      <section className="relative w-full h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            src={heroSrc}
            alt="Hero background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center px-4 text-white max-w-4xl mx-auto flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tighter mb-6"
          >
            Hariharakrishnan Sriram
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="font-light text-xl md:text-2xl tracking-wide text-white/90 uppercase"
          >
            Honest, expressive, and timeless imagery.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60"
        >
          <span className="text-xs tracking-[0.3em] uppercase">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/60 to-transparent" />
        </motion.div>
      </section>

      <section className="py-24 md:py-32 px-6 md:px-12 max-w-screen-2xl mx-auto">
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground"
          >
            Selected Works
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/c/portraits"
              className="text-primary font-medium tracking-wide uppercase text-sm hover:text-foreground transition-colors pb-1 border-b border-primary/30 hover:border-foreground"
            >
              View All Galleries
            </Link>
          </motion.div>
        </div>

        <MasonryGrid
          photos={featured}
          onPhotoClick={(_p, i) => {
            setCurrentPhotoIndex(i);
            setLightboxOpen(true);
          }}
        />
      </section>

      <section className="py-24 md:py-32 bg-secondary text-secondary-foreground px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl md:text-5xl leading-tight mb-10"
          >
            "For me, photography is about observation and connection—finding meaning in fleeting moments and transforming them into lasting visual stories."
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-4 border border-foreground/20 hover:bg-foreground hover:text-background transition-all duration-300 uppercase tracking-widest text-sm"
            >
              Read the Full Story
            </Link>
          </motion.div>
        </div>
      </section>

      <Lightbox
        photos={featured}
        currentIndex={currentPhotoIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setCurrentPhotoIndex}
      />
    </Layout>
  );
}
