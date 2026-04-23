import { useEffect, useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { Photo } from "@/lib/data";

interface LightboxProps {
  photos: Photo[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 5;

export function Lightbox({ photos, currentIndex, isOpen, onClose, onNavigate }: LightboxProps) {
  const currentPhoto = photos[currentIndex];
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragState = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchStartRef = useRef<{ dist: number; zoom: number } | null>(null);

  const resetZoom = useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const handlePrevious = useCallback(() => {
    resetZoom();
    onNavigate((currentIndex - 1 + photos.length) % photos.length);
  }, [currentIndex, photos.length, onNavigate, resetZoom]);

  const handleNext = useCallback(() => {
    resetZoom();
    onNavigate((currentIndex + 1) % photos.length);
  }, [currentIndex, photos.length, onNavigate, resetZoom]);

  useEffect(() => {
    resetZoom();
  }, [currentIndex, resetZoom]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(MAX_ZOOM, z + 0.5));
      if (e.key === "-") setZoom((z) => Math.max(MIN_ZOOM, z - 0.5));
      if (e.key === "0") resetZoom();
    };

    window.addEventListener("keydown", handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, handlePrevious, handleNext, resetZoom]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.005;
    setZoom((z) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z + delta)));
  };

  const handleDoubleClick = () => {
    if (zoom > 1) resetZoom();
    else setZoom(2.5);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointersRef.current.size === 2) {
      const pts = Array.from(pointersRef.current.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      pinchStartRef.current = { dist, zoom };
      dragState.current = null;
    } else if (pointersRef.current.size === 1 && zoom > 1) {
      dragState.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointersRef.current.size === 2 && pinchStartRef.current) {
      const pts = Array.from(pointersRef.current.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const ratio = dist / pinchStartRef.current.dist;
      const next = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, pinchStartRef.current.zoom * ratio));
      setZoom(next);
      return;
    }

    if (dragState.current && pointersRef.current.size === 1) {
      setOffset({
        x: dragState.current.ox + (e.clientX - dragState.current.x),
        y: dragState.current.oy + (e.clientY - dragState.current.y),
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size < 2) pinchStartRef.current = null;
    if (pointersRef.current.size === 0) dragState.current = null;
    if (pointersRef.current.size === 1 && zoom > 1) {
      const remaining = Array.from(pointersRef.current.values())[0];
      dragState.current = { x: remaining.x, y: remaining.y, ox: offset.x, oy: offset.y };
    }
  };

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
            className="absolute top-6 right-6 z-50 p-2 text-white/60 hover:text-white transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" strokeWidth={1.5} />
          </button>

          {/* Zoom controls */}
          <div className="absolute top-6 left-6 z-50 flex items-center gap-2 text-white/70">
            <button
              onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z - 0.5))}
              className="p-2 hover:text-white transition-colors"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <span className="text-xs tabular-nums tracking-wider w-10 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + 0.5))}
              className="p-2 hover:text-white transition-colors"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>

          {/* Navigation */}
          {photos.length > 1 && (
            <>
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
            </>
          )}

          {/* Image */}
          <div
            className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-12 overflow-hidden"
            onWheel={handleWheel}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onDoubleClick={handleDoubleClick}
            style={{ touchAction: "none" }}
          >
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative max-w-full max-h-full flex items-center justify-center select-none pointer-events-none"
            >
              <img
                src={currentPhoto.src}
                alt={currentPhoto.title}
                draggable={false}
                style={{
                  transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                  transition: dragState.current || pinchStartRef.current ? "none" : "transform 0.2s ease-out",
                  cursor: zoom > 1 ? (dragState.current ? "grabbing" : "grab") : "zoom-in",
                  willChange: "transform",
                }}
                className="max-w-full max-h-[85vh] object-contain shadow-2xl"
              />
            </motion.div>

            {/* Caption */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-8 left-0 w-full text-center px-4 pointer-events-none"
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
