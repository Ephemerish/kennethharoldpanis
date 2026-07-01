import { useEffect, useRef, useState } from "react";
import {
  clamp,
  FONT,
  layoutGlyphs,
  measureUnits,
  randPhrase,
  rand,
} from "./pretext/shared";
import { useElementBox, usePretext } from "./pretext/hooks";

/**
 * PretextCover, the live pretext demo shown where a post's cover image would
 * normally go. Glyphs rain down Matrix-style with the post title sitting still
 * in the middle.
 *
 * pretext measures every character individually (canvas measureText under the
 * hood), so each letter is placed at its exact advance and can never be cut
 * mid-glyph. Rendering is on a canvas so the rain stays cheap.
 *
 *   variant="featured" allows bigger text (wide featured card / article hero).
 *
 *   animate={false} skips the rain entirely and just presents the title sitting
 *   still on the dark box, used on the article hero where the falling glyphs are
 *   unwanted.
 *
 * Before the canvas is live (server render, static mode, or reduced motion) it
 * shows the title centered, so the slot is never blank.
 */

type Variant = "default" | "featured";

const PAD = 16;
const DEFAULT_TITLE = "Soo I tried pretext";
const BG = "rgb(6, 16, 9)";
const LOCKED = "rgb(255, 255, 255)";
const GLOW = "rgba(163, 230, 53, 0.9)";

export default function PretextCover({
  title = DEFAULT_TITLE,
  variant = "default",
  animate = true,
}: {
  title?: string;
  variant?: Variant;
  animate?: boolean;
}) {
  const { pt, reduce } = usePretext();
  const { ref, box } = useElementBox<HTMLDivElement>({ w: 480, h: 270 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);

  const featured = variant === "featured";

  useEffect(() => {
    // Static mode: no canvas animation. Leaving `active` false lets the
    // centered title overlay below render the title sitting still.
    if (!animate) return;
    const canvas = canvasRef.current;
    if (!pt || !canvas || box.w < 80 || box.h < 80) return;

    // Reduced motion: no rain. Leave `active` false so the centered title
    // overlay below renders the title sitting still, with no motion.
    if (reduce) return;

    const W = box.w;
    const H = box.h;
    const innerW = W - PAD * 2;
    const innerH = H - PAD * 2;

    // Measure each character once (1px advances), then auto-fit the biggest font
    // where the whole title still fits the box.
    const units = measureUnits(pt, title, FONT);
    let FS = 16;
    {
      let lo = 12;
      let hi = clamp(innerH, 14, featured ? 96 : 56);
      for (let i = 0; i < 9; i++) {
        const mid = (lo + hi) / 2;
        const L = layoutGlyphs(units, title, {
          fontSize: mid,
          maxWidth: innerW,
          lineHeight: mid * 1.18,
          align: "center",
        });
        if (L.height <= innerH && L.width <= innerW) {
          FS = mid;
          lo = mid;
        } else {
          hi = mid;
        }
      }
      FS = Math.round(FS);
    }
    const LH = FS * 1.18;
    const layout = layoutGlyphs(units, title, {
      fontSize: FS,
      maxWidth: innerW,
      lineHeight: LH,
      align: "center",
    });
    const dy = PAD + Math.max(0, (innerH - layout.height) / 2);

    // Small, standard-text-sized rain. Each column streams a funny phrase; the
    // translucent wash (in the loop) fades older glyphs into trails, so we draw
    // only ONE glyph per column per frame — cheap even on the wide hero.
    const rainFS = featured ? 12 : 11;
    const cellW = rainFS * 1.15;
    const cellH = rainFS * 1.2;
    const cols = Math.max(1, Math.floor(W / cellW));
    const rows = Math.max(4, Math.floor(H / cellH));
    type Stream = { phrase: string; row: number; speed: number; offset: number };
    const spawn = (): Stream => ({
      phrase: randPhrase(),
      row: -rand(0, rows),
      speed: rand(8, 16),
      offset: (Math.random() * 97) | 0,
    });
    const streams = Array.from({ length: cols }, spawn);
    // Map a row to a character of this stream's phrase (cyclic).
    const charAt = (s: Stream, rr: number) => {
      const len = s.phrase.length;
      return s.phrase[(((rr - s.offset) % len) + len) % len];
    };

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.textBaseline = "top";
    setActive(true);

    // Pre-render the finished title once. The glow (shadowBlur) is the costly
    // part, so we blit this bitmap on top of the rain each frame instead of
    // re-shadowing every letter.
    const titleCanvas = document.createElement("canvas");
    titleCanvas.width = canvas.width;
    titleCanvas.height = canvas.height;
    const tctx = titleCanvas.getContext("2d");
    if (tctx) {
      tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      tctx.textBaseline = "top";
      tctx.font = `800 ${FS}px ${FONT}`;
      tctx.fillStyle = LOCKED;
      tctx.shadowColor = GLOW;
      tctx.shadowBlur = FS * 0.45;
      for (const g of layout.glyphs) tctx.fillText(g.ch, PAD + g.x, dy + g.y);
    }

    const MIN_DT = 1 / 30; // throttle to ~30fps — plenty for rain
    let raf = 0;
    let last = 0;

    const draw = (dt: number) => {
      // Translucent wash fades the previous frame's glyphs into trailing tails.
      ctx.fillStyle = "rgba(6, 16, 9, 0.16)";
      ctx.fillRect(0, 0, W, H);

      ctx.textAlign = "center";
      ctx.font = `600 ${rainFS}px ${FONT}`;
      ctx.fillStyle = "rgba(180, 245, 110, 0.92)";
      for (let c = 0; c < cols; c++) {
        const s = streams[c];
        const r = Math.floor(s.row);
        const y = r * cellH;
        const ch = charAt(s, r);
        if (y >= 0 && y < H && ch !== " ")
          ctx.fillText(ch, c * cellW + cellW / 2, y);
        s.row += s.speed * dt;
        if (y > H && Math.random() < 0.02) Object.assign(s, spawn());
      }
      ctx.textAlign = "left";

      // Title sits still on top of the rain, no drop-in.
      if (tctx) ctx.drawImage(titleCanvas, 0, 0, W, H);
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!last) last = now;
      const dt = (now - last) / 1000;
      if (dt < MIN_DT) return; // skip frames to hit the target fps
      last = now;
      draw(Math.min(dt, 0.1));
    };

    // Only animate while on screen: start/stop the loop entirely (not just a
    // flag), so an offscreen card costs nothing.
    const start = () => {
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    };
    const stop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);
    if (tctx) ctx.drawImage(titleCanvas, 0, 0, W, H);

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) start();
        else stop();
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    return () => {
      stop();
      io.disconnect();
    };
  }, [pt, box.w, box.h, reduce, title, featured, animate]);

  return (
    <div
      ref={ref}
      className="relative h-full w-full overflow-hidden"
      style={{ background: BG }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {!active && (
        <div className="absolute inset-0 flex items-center justify-center p-5 text-center">
          <span
            className="font-extrabold leading-tight"
            style={{
              fontFamily: FONT,
              color: LOCKED,
              fontSize: clamp(box.w / 9, 24, featured ? 96 : 56),
              textWrap: "balance",
            }}
          >
            {title}
          </span>
        </div>
      )}
    </div>
  );
}
