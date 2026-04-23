import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Photo } from "@/lib/data";

interface MasonryGridProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo, index: number) => void;
}

export function MasonryGrid({ photos, onPhotoClick }: MasonryGridProps) {
  // Simple CSS columns masonry
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
      {photos.map((photo, i) => (
        <motion.div
          key={photo.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative group cursor-pointer overflow-hidden break-inside-avoid"
          onClick={() => onPhotoClick(photo, i)}
        >
          <div className="aspect-w-auto aspect-h-auto">
            <img
              src={photo.src}
              alt={photo.title}
              className={`w-full h-auto object-cover bg-muted transition-transform duration-700 ease-out group-hover:scale-[1.02] ${
                photo.aspectRatio === "portrait"
                  ? "aspect-[3/4]"
                  : photo.aspectRatio === "landscape"
                  ? "aspect-[4/3]"
                  : "aspect-square"
              }`}
              loading="lazy"
            />
          </div>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
            <h3 className="text-white font-serif text-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
              {photo.title}
            </h3>
            {photo.subCategory && (
              <p className="text-white/80 text-sm font-light mt-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75 ease-out uppercase tracking-widest">
                {photo.subCategory}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
