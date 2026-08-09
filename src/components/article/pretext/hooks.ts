/**
 * React glue for the pretext components.
 *
 *   - usePretext     lazy-loads pretext.js (after fonts are ready) + reports
 *                    prefers-reduced-motion.
 *   - useElementBox  tracks an element's pixel size via ResizeObserver.
 *
 * Keeping these here means <PretextCover /> and <PretextEngine /> share the
 * exact same loading and sizing behaviour. The pure layout/physics maths lives
 * in ./shared.ts.
 */
import { useEffect, useRef, useState } from "react";
import type { Box, Pretext } from "./shared";

/** Lazy-load pretext.js once the web fonts are ready. */
export function usePretext(): { pt: Pretext | null; reduce: boolean } {
  const ref = useRef<Pretext | null>(null);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    let alive = true;
    setReduce(!!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
    (async () => {
      let mod: Pretext;
      try {
        mod = await import("@chenglou/pretext");
      } catch {
        return;
      }
      if (document.fonts?.ready) {
        try {
          await document.fonts.ready;
        } catch {
          /* best effort */
        }
      }
      if (!alive) return;
      ref.current = mod;
      setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  return { pt: ready ? ref.current : null, reduce };
}

/** Track the rendered size of an element. */
export function useElementBox<T extends HTMLElement>(initial: Box) {
  const ref = useRef<T>(null);
  const [box, setBox] = useState<Box>(initial);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { ref, box };
}
