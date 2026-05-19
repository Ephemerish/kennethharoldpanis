import { useState, useEffect, useCallback } from "react";
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface GalleryProps {
  images: string[];
  alt?: string;
}

/**
 * Gallery — a thumbnail grid that opens a fullscreen lightbox.
 *
 * Click a thumbnail to open the image full size. Arrow keys / on-screen
 * arrows move between images, Esc or a backdrop click closes. Dependency
 * free so it stays light on the page.
 */
export default function Gallery({ images, alt = "Project image" }: GalleryProps) {
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(
    () => setIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length]
  );
  const next = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, prev, next]);

  if (!images.length) return null;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Open image ${i + 1} of ${images.length}`}
            className="group relative block overflow-hidden border border-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <img
              src={src}
              alt={`${alt} ${i + 1}`}
              loading="lazy"
              className="w-full h-32 md:h-44 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-8"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-7 h-7" />
          </button>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous image"
              className="absolute left-2 sm:left-6 p-2 text-white/70 hover:text-white transition-colors"
            >
              <ChevronLeftIcon className="w-8 h-8 sm:w-10 sm:h-10" />
            </button>
          )}

          <img
            src={images[index]}
            alt={`${alt} ${index + 1}`}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-[90vw] object-contain shadow-2xl"
          />

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next image"
              className="absolute right-2 sm:right-6 p-2 text-white/70 hover:text-white transition-colors"
            >
              <ChevronRightIcon className="w-8 h-8 sm:w-10 sm:h-10" />
            </button>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/60 text-sm tracking-wide">
              {index + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}
