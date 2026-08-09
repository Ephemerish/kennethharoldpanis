import { useState, useEffect } from "react";
import { ImageViewer } from "./ImageViewer";

/**
 * ContentImageViewer, makes every server-rendered article image (the hero
 * and all markdown/figure images) open the shared zoomable ImageViewer.
 *
 * Mounted once per article page. It scans the DOM (those images are static
 * HTML, not React), wires click-to-open, and shares one viewer with
 * prev/next across all of them. Card thumbnails are links and are left
 * alone on purpose.
 */
export default function ContentImageViewer({
  selector = "#article-hero, #article-content img",
}: {
  selector?: string;
}) {
  const [images, setImages] = useState<string[]>([]);
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLImageElement>(selector)
    );
    if (!nodes.length) return;

    setImages(nodes.map((n) => n.currentSrc || n.src));

    const cleanups = nodes.map((node, i) => {
      node.style.cursor = "";
      const onClick = (e: MouseEvent) => {
        e.preventDefault();
        setIndex(i);
      };
      node.addEventListener("click", onClick);
      return () => node.removeEventListener("click", onClick);
    });

    return () => cleanups.forEach((fn) => fn());
  }, [selector]);

  return (
    <ImageViewer
      images={images}
      index={index}
      onClose={() => setIndex(null)}
      onIndexChange={setIndex}
    />
  );
}
