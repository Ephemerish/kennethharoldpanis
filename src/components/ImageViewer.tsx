import { useState, useEffect, useCallback, useRef } from "react";
import {
  XIcon as XMarkIcon,
  CaretLeftIcon as ChevronLeftIcon,
  CaretRightIcon as ChevronRightIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  ArrowCounterClockwiseIcon,
} from "@phosphor-icons/react";

const MIN_SCALE = 1;
const MAX_SCALE = 6;

interface ImageViewerProps {
  images: string[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (i: number) => void;
  alt?: string;
}

/**
 * ImageViewer — the single fullscreen image overlay used everywhere.
 *
 * Controlled: render it with `index` (null = closed). Supports zoom
 * (wheel, buttons, double-click), drag-to-pan when zoomed, prev/next,
 * keyboard (Esc, arrows) and backdrop close. Dependency free.
 *
 * For a standalone clickable image, use the `ZoomableImage` export below.
 */
export function ImageViewer({
  images,
  index,
  onClose,
  onIndexChange,
  alt = "Image",
}: ImageViewerProps) {
  const open = index !== null;
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const reset = useCallback(() => {
    setScale(1);
    setPos({ x: 0, y: 0 });
  }, []);

  const go = useCallback(
    (dir: number) => {
      if (index === null) return;
      reset();
      onIndexChange((index + dir + images.length) % images.length);
    },
    [index, images.length, onIndexChange, reset]
  );

  const zoomBy = useCallback((factor: number) => {
    setScale((s) => {
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, s * factor));
      if (next === 1) setPos({ x: 0, y: 0 });
      return next;
    });
  }, []);

  // Reset zoom whenever the image changes or the viewer closes.
  useEffect(() => {
    reset();
  }, [index, reset]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "+" || e.key === "=") zoomBy(1.25);
      else if (e.key === "-") zoomBy(1 / 1.25);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, go, zoomBy]);

  if (!open || index === null) return null;

  const multiple = images.length > 1;

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    zoomBy(e.deltaY < 0 ? 1.15 : 1 / 1.15);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (scale === 1) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y };
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    setPos({
      x: drag.current.px + (e.clientX - drag.current.x),
      y: drag.current.py + (e.clientY - drag.current.y),
    });
  };
  const endDrag = () => {
    drag.current = null;
    setDragging(false);
  };

  const btn =
    "p-2 text-white/70 hover:text-white  disabled:opacity-30";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      {/* Toolbar */}
      <div
        className="absolute top-3 right-3 flex items-center gap-1"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className={btn} onClick={() => zoomBy(1 / 1.25)} aria-label="Zoom out">
          <MagnifyingGlassMinusIcon className="w-6 h-6" />
        </button>
        <button type="button" className={btn} onClick={() => zoomBy(1.25)} aria-label="Zoom in">
          <MagnifyingGlassPlusIcon className="w-6 h-6" />
        </button>
        <button
          type="button"
          className={btn}
          onClick={reset}
          disabled={scale === 1 && pos.x === 0 && pos.y === 0}
          aria-label="Reset zoom"
        >
          <ArrowCounterClockwiseIcon className="w-6 h-6" />
        </button>
        <button type="button" className={btn} onClick={onClose} aria-label="Close">
          <XMarkIcon className="w-7 h-7" />
        </button>
      </div>

      {multiple && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            go(-1);
          }}
          aria-label="Previous image"
          className="absolute left-2 sm:left-6 z-10 p-2 text-white/70 hover:text-white "
        >
          <ChevronLeftIcon className="w-8 h-8 sm:w-10 sm:h-10" />
        </button>
      )}

      <img
        src={images[index]}
        alt={`${alt} ${index + 1}`}
        draggable={false}
        onClick={(e) => e.stopPropagation()}
        onWheel={onWheel}
        onDoubleClick={() => (scale === 1 ? zoomBy(2.5) : reset())}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
          transition: dragging ? "none" : "transform 0.15s ",
          cursor: scale === 1 ? "" : dragging ? "grabbing" : "grab",
          touchAction: "none",
        }}
        className="max-h-[90vh] max-w-[92vw] object-contain select-none shadow-2xl"
      />

      {multiple && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            go(1);
          }}
          aria-label="Next image"
          className="absolute right-2 sm:right-6 z-10 p-2 text-white/70 hover:text-white "
        >
          <ChevronRightIcon className="w-8 h-8 sm:w-10 sm:h-10" />
        </button>
      )}

      {multiple && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/60 text-sm tracking-wide">
          {index + 1} / {images.length}
        </div>
      )}
    </div>
  );
}

interface ZoomableImageProps {
  src: string;
  alt?: string;
  className?: string;
  loading?: "lazy" | "eager";
}

/**
 * ZoomableImage — drop-in for any single image. Renders the image and
 * opens the shared ImageViewer (with zoom) on click.
 */
export function ZoomableImage({ src, alt = "Image", className, loading = "lazy" }: ZoomableImageProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <img
        src={src}
        alt={alt}
        loading={loading}
        onClick={() => setOpen(true)}
        className={`cursor- ${className ?? ""}`}
      />
      <ImageViewer
        images={[src]}
        index={open ? 0 : null}
        onClose={() => setOpen(false)}
        onIndexChange={() => {}}
        alt={alt}
      />
    </>
  );
}

export default ImageViewer;
