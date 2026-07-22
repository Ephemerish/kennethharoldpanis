import { useEffect, useRef, useState } from "react";
import {
  clamp,
  FONT,
  layoutGlyphs,
  measureUnits,
  randPhrase,
} from "./pretext/shared";
import { createCloth } from "./pretext/cloth";
import { useElementBox, usePretext } from "./pretext/hooks";

/**
 * PretextCover, the live pretext demo shown where a post's cover image would
 * normally go. Strips of fabric hang from just above the top edge, each one
 * printed with a Matrix-style phrase that flows down it; gusts of wind sweep
 * through and blow the cloth around while the post title sits still in the
 * middle.
 *
 * Each strip is a verlet rope (points plus distance constraints) so the cloth
 * physics is real, not a shader trick. pretext measures every character
 * individually (canvas measureText under the hood), so each letter is placed
 * at its exact advance and can never be cut mid-glyph. Rendering is on a
 * canvas so the whole thing stays cheap.
 *
 *   variant="featured" allows bigger text (wide featured card / article hero).
 *
 *   animate={false} skips the cloth entirely and just presents the title
 *   sitting still on the dark box, for spots where the motion is unwanted.
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

    // Cloth banners: strips of fabric printed with phrases, blown by gusts
    // and the pointer. All the physics lives in the createCloth util; this
    // component only sizes it and draws it.
    const bannerFS = featured ? 13 : 12;
    const cellH = bannerFS * 1.3; // one letter cell down the strip
    const stripW = Math.round(bannerFS * 1.8);
    const PIN_Y = -cellH * 2; // pin just above the frame, so no visible start

    const sim = createCloth({
      w: W,
      h: H,
      stripW,
      gapX: Math.round(stripW * 0.5),
      pinY: PIN_Y,
      // 1.5x the box height: hem stays out of frame, sim stays light.
      stripLen: H * 1.5,
      makePhrase: () => randPhrase() + "   ",
    });

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

    // The pointer is a breeze of its own; the sim owns the physics, this
    // just feeds it canvas-relative pointer motion.
    const onPointerMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      sim.pointerMove(e.clientX - r.left, e.clientY - r.top, e.timeStamp);
    };
    const onPointerLeave = () => sim.pointerEnd();
    canvas.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("pointercancel", onPointerLeave);

    const MIN_DT = 1 / 30; // throttle to ~30fps, plenty for cloth
    let raf = 0;
    let last = 0;

    const draw = (dt: number) => {
      sim.step(Math.min(dt, 1 / 20)); // keep verlet stable across frame spikes

      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, W, H);

      ctx.font = `600 ${bannerFS}px ${FONT}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const hw = stripW / 2;

      for (const s of sim.strips) {
        const pts = s.pts;
        const total = s.cum[s.cum.length - 1];

        // Fabric: one shaded quad per rope segment. Tilted segments catch
        // more light, which is what sells the ripple as cloth.
        for (let k = 0; k < pts.length - 1; k++) {
          const a = pts[k];
          const b = pts[k + 1];
          if (a.y > H + stripW && b.y > H + stripW) continue; // below frame
          if (a.y < -stripW && b.y < -stripW) continue; // above frame
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const inv = 1 / (Math.hypot(dx, dy) || 1e-6);
          const nx = -dy * inv * hw;
          const ny = dx * inv * hw;
          const tilt = Math.abs(dx * inv);
          const l = 26 + s.shade * 5 + tilt * 70;
          ctx.fillStyle = `rgb(${(10 + l * 0.35) | 0}, ${(22 + l) | 0}, ${(14 + l * 0.45) | 0})`;
          ctx.beginPath();
          ctx.moveTo(a.x + nx, a.y + ny);
          ctx.lineTo(b.x + nx, b.y + ny);
          ctx.lineTo(b.x - nx, b.y - ny);
          ctx.lineTo(a.x - nx, a.y - ny);
          ctx.closePath();
          ctx.fill();
        }

        // The phrase flows down the fabric; each letter cell rides the curve
        // and tilts with the local tangent, so the text moves as cloth.
        const L = s.phrase.length;
        const off = s.scroll % cellH;
        const base = Math.floor(s.scroll / cellH);
        ctx.fillStyle = "rgba(180, 245, 110, 0.9)";
        for (let k = 0; ; k++) {
          const arc = k * cellH + off + cellH * 0.5;
          if (arc > total - 2) break;
          const idx = (((k - base) % L) + L) % L;
          const ch = s.phrase[idx];
          if (ch === " ") continue;
          const [x, y, ang] = sim.posAt(s, arc);
          if (y > H + cellH || y < -cellH) continue; // outside the frame
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(ang - Math.PI / 2);
          ctx.fillText(ch, 0, 0);
          ctx.restore();
        }
      }

      // Wind-lines: a bright comet flows along each undulating path (some
      // with a loop-the-loop). setLineDash advances the segment forward so
      // the gust looks like moving air from any of the 8 compass directions.
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (const l of sim.winds) {
        const progress = l.age / l.ttl;
        const alpha = Math.sin(Math.PI * clamp(progress, 0, 1)) * 0.55;
        if (alpha < 0.02) continue;
        ctx.strokeStyle = `rgba(200, 255, 160, ${alpha.toFixed(3)})`;
        ctx.lineWidth = 1.4;
        // The dash segment is the "comet body"; the gap hides the rest of
        // the path so only the bright segment is visible at any moment.
        ctx.setLineDash([l.seg, l.total + l.seg]);
        ctx.lineDashOffset = l.seg - progress * (l.total + l.seg);
        ctx.save();
        ctx.translate(l.x, l.y);
        ctx.rotate(l.ang);
        ctx.beginPath();
        ctx.moveTo(l.pts[0].x, l.pts[0].y);
        for (let i = 1; i < l.pts.length; i++)
          ctx.lineTo(l.pts[i].x, l.pts[i].y);
        ctx.stroke();
        ctx.restore();
      }
      ctx.setLineDash([]);
      ctx.restore();

      // Title sits still on top of the banners, no drop-in.
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
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("pointercancel", onPointerLeave);
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
