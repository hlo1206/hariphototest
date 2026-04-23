import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Photo } from "@/lib/data";

interface LightboxProps {
  photos: Photo[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export function Lightbox({ photos, currentIndex, isOpen, onClose, onNavigate }: LightboxProps) {
  const currentPhoto = photos[currentIndex];

  const handlePrevious = useCallback(() => {
    onNavigate((currentIndex - 1 + photos.length) % photos.length);
  }, [currentIndex, photos.length, onNavigate]);

  const handleNext = useCallback(() => {
    onNavigate((currentIndex + 1) % photos.length);
  }, [currentIndex, photos.length, onNavigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, handlePrevious, handleNext]);

  return (
    <AnimatePresence>
      {isOpen && currentPhoto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-50 p-2 text-white/60 hover:text-white transition-colors mix-blend-difference"
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" strokeWidth={1.5} />
          </button>

          {/* Navigation */}
          <button
            onClick={handlePrevious}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 p-4 text-white/60 hover:text-white transition-colors"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-8 h-8 md:w-12 md:h-12" strokeWidth={1} />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 p-4 text-white/60 hover:text-white transition-colors"
            aria-label="Next photo"
          >
            <ChevronRight className="w-8 h-8 md:w-12 md:h-12" strokeWidth={1} />
          </button>

          {/* Image */}
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-12">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative max-w-full max-h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={currentPhoto.src}
                alt={currentPhoto.title}
                className="max-w-full max-h-[85vh] object-contain shadow-2xl"
              />
            </motion.div>
            
            {/* Caption */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-8 left-0 w-full text-center px-4"
            >
              <h3 className="text-white font-serif text-xl md:text-2xl tracking-wide">
                {currentPhoto.title}
              </h3>
              <p className="text-white/60 text-sm mt-2 font-light uppercase tracking-widest">
                {currentPhoto.category} {currentPhoto.subCategory ? `— ${currentPhoto.subCategory}` : ""}
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
