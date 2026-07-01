import { useEffect, useRef } from "react";
import type { BackgroundOptions, BackgroundHandle } from "../lib/1bit";

/**
 * Bit1Background, the procedurally generated 1-bit pixel-art backdrop.
 *
 * A thin client island that mounts a fixed, full-viewport WebGL canvas behind
 * all page content and scatters decoration tiles from the Bountiful Bits set
 * across it. The heavy lifting (and PixiJS itself) lives in
 * `lib/1bit/pixiBackground`, which is imported dynamically so Pixi loads as a
 * lazy chunk and never blocks first paint.
 *
 * `z-index: -1` on a fixed child paints above the opaque <body> background but
 * below normal content, so no other element needs a stacking-context tweak.
 *
 * Use with `client:idle transition:persist` so the scene builds off the
 * critical path and survives Astro view-transition navigations without a
 * rebuild/flash.
 */
export default function Bit1Background(props: BackgroundOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let handle: BackgroundHandle | undefined;
    let cancelled = false;

    (async () => {
      try {
        const { createBackground } = await import("../lib/1bit/pixiBackground");
        if (cancelled) return;
        handle = await createBackground(el, props);
        if (cancelled) handle.destroy();
      } catch (err) {
        // Background is purely decorative; never let it break the page, but do
        // surface the reason so it isn't silently invisible.
        console.warn("[Bit1Background] disabled:", err);
      }
    })();

    return () => {
      cancelled = true;
      handle?.destroy();
    };
    // Config is read once at mount; changing props does not live-update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    />
  );
}
