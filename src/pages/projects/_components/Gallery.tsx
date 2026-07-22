import { useState } from "react";
import { ImageViewer } from "../../../components";

interface GalleryProps {
  images: string[];
  alt?: string;
}

/**
 * Gallery, just a thumbnail grid. Clicking a thumbnail opens the shared
 * ImageViewer (zoom + prev/next). No lightbox logic lives here.
 */
export default function Gallery({ images, alt = "Project image" }: GalleryProps) {
  const [index, setIndex] = useState<number | null>(null);

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
              className="w-full h-auto   "
            />
          </button>
        ))}
      </div>

      <ImageViewer
        images={images}
        index={index}
        onClose={() => setIndex(null)}
        onIndexChange={setIndex}
        alt={alt}
      />
    </>
  );
}
