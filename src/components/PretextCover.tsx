import { useEffect, useRef, useState } from "react";
import type { PreparedTextWithSegments } from "@chenglou/pretext";

/**
 * PretextCover, a live pretext mini-demo used wherever the post's cover image
 * would normally go (the article cards). Short text flows around a bouncing
 * square, laid out by pretext. Used in place of an <img>, so it fills its
 * container. It is NOT used for the social/OG preview, which must stay a real
 * image file that other sites can fetch.
 *
 * Server-side (and before pretext loads) it shows a plain "pretext" cover, so
 * the card is never blank.
 */

type Pretext = typeof import("@chenglou/pretext");
type Run = { text: string; top: number; left: number; w: number };
type Sq = { x: number; y: number; s: number };

const FONT = "Outfit, system-ui, sans-serif";
const PAD = 12;
const TEXT =
  "pretext lays this text out with quick math, no drawing first, so it can flow around the square as it bounces, see for yourself";

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));
const rand = (a: number, b: number) => a + Math.random() * (b - a);

export default function PretextCover() {
  const ptRef = useRef<Pretext | null>(null);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 480, h: 270 });
  const [runs, setRuns] = useState<Run[] | null>(null);
  const [sq, setSq] = useState<Sq | null>(null);

  useEffect(() => {
    let alive = true;
    setReduce(!!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
    (async () => {
      let m: Pretext;
      try {
        m = await import("@chenglou/pretext");
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
      ptRef.current = m;
      setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const update = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const FS = clamp(Math.round(box.w / 30), 11, 16);
  const LH = Math.round(FS * 1.4);

  useEffect(() => {
    const pt = ready ? ptRef.current : null;
    if (!pt || box.w < 60 || box.h < 60) {
      setRuns(null);
      return;
    }
    const W = box.w - PAD * 2;
    const H = box.h - PAD * 2;
    const GAP = 10;
    const sqSize = clamp(Math.min(W, H) * 0.34, 28, 96);

    let prepared: PreparedTextWithSegments;
    try {
      prepared = pt.prepareWithSegments(TEXT, `${FS}px Outfit`);
    } catch {
      setRuns(null);
      return;
    }

    const compute = (s: Sq): Run[] => {
      const r = {
        left: s.x - s.s / 2,
        right: s.x + s.s / 2,
        top: s.y - s.s / 2,
        bottom: s.y + s.s / 2,
      };
      const out: Run[] = [];
      let cursor = { segmentIndex: 0, graphemeIndex: 0 };
      let top = 0;
      let guard = 0;
      while (top + LH <= H && guard < 80) {
        guard++;
        const free: [number, number][] = [];
        if (top + LH > r.top && top < r.bottom) {
          const oL = Math.max(0, r.left - GAP);
          const oR = Math.min(W, r.right + GAP);
          if (oL >= 1) free.push([0, oL]);
          if (oR < W) free.push([oR, W]);
        } else {
          free.push([0, W]);
        }
        let placed = false;
        for (const [x0, x1] of free) {
          const w = x1 - x0;
          if (w < 38) continue;
          const range = pt.layoutNextLineRange(prepared, cursor, w);
          if (!range) continue;
          if (
            range.end.segmentIndex === cursor.segmentIndex &&
            range.end.graphemeIndex === cursor.graphemeIndex
          )
            continue;
          const line = pt.materializeLineRange(prepared, range);
          out.push({ text: line.text, top, left: x0, w });
          cursor = range.end;
          placed = true;
        }
        top += LH;
        if (!placed) {
          if (!pt.layoutNextLineRange(prepared, cursor, W)) break;
        }
      }
      return out;
    };

    if (reduce) {
      const s = { x: W * 0.68, y: H * 0.5, s: sqSize };
      setSq(s);
      setRuns(compute(s));
      return;
    }

    let raf = 0;
    let running = true;
    let last = performance.now();
    const st = { x: W * 0.5, y: H * 0.4, vx: 58, vy: 44, s: sqSize };
    const loop = (now: number) => {
      let dt = (now - last) / 1000;
      last = now;
      if (dt > 0.05) dt = 0.05;
      if (running) {
        const hs = st.s / 2;
        st.x += st.vx * dt;
        st.y += st.vy * dt;
        if (st.x < hs) {
          st.x = hs;
          st.vx = Math.abs(st.vx);
          st.vy += rand(-10, 10);
        } else if (st.x > W - hs) {
          st.x = W - hs;
          st.vx = -Math.abs(st.vx);
          st.vy += rand(-10, 10);
        }
        if (st.y < hs) {
          st.y = hs;
          st.vy = Math.abs(st.vy);
          st.vx += rand(-10, 10);
        } else if (st.y > H - hs) {
          st.y = H - hs;
          st.vy = -Math.abs(st.vy);
          st.vx += rand(-10, 10);
        }
        st.vx = clamp(st.vx, -120, 120);
        st.vy = clamp(st.vy, -120, 120);
        const s = { x: st.x, y: st.y, s: st.s };
        setSq(s);
        setRuns(compute(s));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const io = new IntersectionObserver(
      ([e]) => {
        running = e.isIntersecting;
      },
      { threshold: 0 }
    );
    if (rootRef.current) io.observe(rootRef.current);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [ready, box.w, box.h, reduce, FS, LH]);

  return (
    <div
      ref={rootRef}
      className="relative h-full w-full overflow-hidden bg-brand-700 text-neutral-0"
    >
      {!ready || runs === null ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <span
            className="font-bold leading-none"
            style={{ fontFamily: FONT, fontSize: clamp(box.w / 8, 28, 72) }}
          >
            pretext
          </span>
          <span className="mt-2 text-xs opacity-80">measured, not guessed</span>
        </div>
      ) : (
        <div
          className="absolute"
          style={{ left: PAD, top: PAD, right: PAD, bottom: PAD }}
        >
          {sq && (
            <div
              className="absolute bg-neutral-0"
              style={{
                left: sq.x - sq.s / 2,
                top: sq.y - sq.s / 2,
                width: sq.s,
                height: sq.s,
              }}
            />
          )}
          {runs.map((r, i) => (
            <span
              key={i}
              className="absolute overflow-hidden"
              style={{
                top: r.top,
                left: r.left,
                width: r.w,
                fontFamily: FONT,
                fontSize: `${FS}px`,
                lineHeight: `${LH}px`,
                whiteSpace: "nowrap",
              }}
            >
              {r.text}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
