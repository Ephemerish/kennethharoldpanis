import { useEffect, useRef, useState } from "react";
import type { PreparedTextWithSegments } from "@chenglou/pretext";

/**
 * PretextEngine, the renderer behind the "pretext" article engine.
 *
 * Instead of the usual markdown/Prose pipeline, this lays the article out
 * itself with pretext.js, with visible results:
 *
 *   - Headings size themselves to fill the column (measureNaturalWidth) and
 *     grow into place.
 *   - The first letter of each section is a drop cap that pulses small/big.
 *   - The opening paragraph flows around two glowing squares that bounce around
 *     the box. Text fills every free horizontal gap on a line, so it runs
 *     between the squares instead of just stopping at the first one.
 *
 * It degrades cleanly: on the server (and before pretext loads) it renders
 * plain, readable HTML. Motion pauses offscreen and stops under
 * prefers-reduced-motion.
 */

type Pretext = typeof import("@chenglou/pretext");

export type Seg = { text: string; href?: string };
export type Block =
  | { kind: "h2"; text: string }
  | { kind: "p"; text: string }
  | { kind: "rich"; segments: Seg[] }
  | { kind: "quote"; text: string; source?: { label: string; href: string } };

const FONT = "Outfit, system-ui, sans-serif";

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));
const rand = (a: number, b: number) => a + Math.random() * (b - a);

export default function PretextEngine({ blocks }: { blocks: Block[] }) {
  const ptRef = useRef<Pretext | null>(null);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(680);

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
      ptRef.current = mod;
      setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const measure = () => {
      if (wrapRef.current) setWidth(wrapRef.current.clientWidth);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const pt = ready ? ptRef.current : null;
  let leadUsed = false;
  let prevHeading = false;

  return (
    <div
      ref={wrapRef}
      className="pretext-engine max-w-none text-base sm:text-lg leading-7 sm:leading-8 font-light text-neutral-700"
    >
      {blocks.map((b, i) => {
        const sectionStart = prevHeading;
        prevHeading = b.kind === "h2";

        if (b.kind === "h2") return <Heading key={i} text={b.text} />;
        if (b.kind === "quote") return <Quote key={i} block={b} />;
        if (b.kind === "rich")
          return (
            <RichPara
              key={i}
              segments={b.segments}
              dropcap={sectionStart}
              reduce={reduce}
            />
          );
        if (!leadUsed) {
          leadUsed = true;
          return (
            <LeadFlow key={i} text={b.text} width={width} pt={pt} reduce={reduce} />
          );
        }
        return (
          <Para key={i} text={b.text} dropcap={sectionStart} reduce={reduce} />
        );
      })}
    </div>
  );
}

/** Plain section heading. (The auto-fit "grow" effect was removed.) */
function Heading({ text }: { text: string }) {
  return (
    <h2 className="mt-8 mb-4 text-lg sm:text-xl font-semibold tracking-tight text-neutral-900 pb-2 border-b-2 border-brand-500">
      {text}
    </h2>
  );
}

/** A drop-cap first letter that pulses between the body size and ~2 lines tall.
 *  It animates the real font-size, so the text around it visibly re-wraps. */
function DropLetter({ ch, reduce }: { ch: string; reduce: boolean }) {
  const SMALL = 20; // about the body text size (the "original")
  const BIG = 58; // about two lines tall
  const [fs, setFs] = useState(SMALL);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduce) {
      setFs((SMALL + BIG) / 2);
      return;
    }
    let raf = 0;
    let running = true;
    const start = performance.now();
    const loop = () => {
      if (running) {
        const t = (performance.now() - start) / 1000;
        const p = 0.5 + 0.5 * Math.sin(t * 1.8); // 0..1
        setFs(SMALL + (BIG - SMALL) * p);
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
    if (ref.current) io.observe(ref.current);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [reduce]);

  return (
    <span
      ref={ref}
      style={{
        float: "left",
        fontFamily: FONT,
        fontWeight: 800,
        color: "rgb(101, 163, 13)",
        fontSize: `${fs}px`,
        lineHeight: 1,
        paddingRight: 10,
        marginTop: 2,
      }}
    >
      {ch}
    </span>
  );
}

type Rect = { left: number; right: number; top: number; bottom: number };
type Square = { x: number; y: number; size: number };
type Run = { text: string; top: number; left: number; w: number };

const rectOf = (s: Square): Rect => ({
  left: s.x - s.size / 2,
  right: s.x + s.size / 2,
  top: s.y - s.size / 2,
  bottom: s.y + s.size / 2,
});

/** Opening paragraph, flowed through the gaps around two bouncing squares. */
function LeadFlow({
  text,
  width,
  pt,
  reduce,
}: {
  text: string;
  width: number;
  pt: Pretext | null;
  reduce: boolean;
}) {
  const FS = 22;
  const LH = 34;
  const GAP = 28; // clearance text keeps from a square (covers its glow)
  const MINSEG = 70; // ignore gaps narrower than this

  const [runs, setRuns] = useState<Run[] | null>(null);
  const [squares, setSquares] = useState<Square[]>([]);
  const [height, setHeight] = useState<number | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pt || !width) {
      setRuns(null);
      setHeight(null);
      return;
    }
    let prepared: PreparedTextWithSegments;
    try {
      prepared = pt.prepareWithSegments(text, `${FS}px Outfit`);
    } catch {
      setRuns(null);
      return;
    }

    // Reserve height for the worst-case wrap so text is never cut.
    const worst = pt.layout(prepared, Math.max(140, width * 0.6), LH);
    const h = (worst.lineCount + 1) * LH;
    setHeight(h);

    const scale = clamp(width / 560, 0.6, 1);

    // Fill every free horizontal gap on each line, left to right, so text runs
    // between the squares instead of stopping at the first one.
    const computeRuns = (rects: Rect[]): Run[] => {
      const out: Run[] = [];
      let cursor = { segmentIndex: 0, graphemeIndex: 0 };
      let top = 0;
      let guard = 0;
      while (top + LH <= h && guard < 240) {
        guard++;
        const occ: [number, number][] = [];
        for (const r of rects) {
          if (top + LH > r.top && top < r.bottom) {
            occ.push([Math.max(0, r.left - GAP), Math.min(width, r.right + GAP)]);
          }
        }
        occ.sort((a, b) => a[0] - b[0]);
        const merged: [number, number][] = [];
        for (const iv of occ) {
          const m = merged[merged.length - 1];
          if (m && iv[0] <= m[1]) m[1] = Math.max(m[1], iv[1]);
          else merged.push([iv[0], iv[1]]);
        }
        const free: [number, number][] = [];
        let x = 0;
        for (const m of merged) {
          if (m[0] - x >= 1) free.push([x, m[0]]);
          x = Math.max(x, m[1]);
        }
        if (x < width) free.push([x, width]);

        let placedAny = false;
        for (const [x0, x1] of free) {
          const w = x1 - x0;
          if (w < MINSEG) continue;
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
          placedAny = true;
        }

        top += LH;
        if (!placedAny) {
          // Either the band was fully blocked, or the text is finished.
          if (!pt.layoutNextLineRange(prepared, cursor, width)) break;
        }
      }
      return out;
    };

    const sizeAt = (base: number, t: number, i: number) =>
      base + (i ? 8 : 12) * Math.sin(t * (i ? 1.1 : 0.9));

    // Physics: two squares bouncing off the walls with a bit of jitter so the
    // motion is erratic, not a fixed path.
    const sq = [
      { x: width * 0.62, y: h * 0.32, vx: 78, vy: 58, base: 96 * scale, size: 96 * scale },
      { x: width * 0.8, y: h * 0.66, vx: -104, vy: -72, base: 66 * scale, size: 66 * scale },
    ];

    if (reduce) {
      sq[0].x = width - 70 * scale;
      sq[0].y = h * 0.38;
      sq[1].x = width * 0.66;
      sq[1].y = h * 0.66;
      const squaresOut = sq.map((s) => ({ x: s.x, y: s.y, size: s.base }));
      setSquares(squaresOut);
      setRuns(computeRuns(squaresOut.map(rectOf)));
      return;
    }

    let raf = 0;
    let running = true;
    let last = performance.now();
    let t = 0;
    const loop = (now: number) => {
      let dt = (now - last) / 1000;
      last = now;
      if (dt > 0.05) dt = 0.05;
      if (running) {
        t += dt;
        for (let i = 0; i < sq.length; i++) {
          const s = sq[i];
          s.size = sizeAt(s.base, t, i);
          const hs = s.size / 2;
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          if (s.x < hs) {
            s.x = hs;
            s.vx = Math.abs(s.vx);
            s.vy += rand(-16, 16);
          } else if (s.x > width - hs) {
            s.x = width - hs;
            s.vx = -Math.abs(s.vx);
            s.vy += rand(-16, 16);
          }
          if (s.y < hs) {
            s.y = hs;
            s.vy = Math.abs(s.vy);
            s.vx += rand(-16, 16);
          } else if (s.y > h - hs) {
            s.y = h - hs;
            s.vy = -Math.abs(s.vy);
            s.vx += rand(-16, 16);
          }
          s.vx = clamp(s.vx, -160, 160);
          s.vy = clamp(s.vy, -160, 160);
        }

        // Square-to-square collision: bounce off each other, not just the walls.
        if (sq.length === 2) {
          const a = sq[0];
          const b = sq[1];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const ox = a.size / 2 + b.size / 2 - Math.abs(dx);
          const oy = a.size / 2 + b.size / 2 - Math.abs(dy);
          if (ox > 0 && oy > 0) {
            if (ox < oy) {
              const push = (ox / 2) * (dx < 0 ? -1 : 1);
              a.x -= push;
              b.x += push;
              const tmp = a.vx;
              a.vx = b.vx + rand(-12, 12);
              b.vx = tmp + rand(-12, 12);
            } else {
              const push = (oy / 2) * (dy < 0 ? -1 : 1);
              a.y -= push;
              b.y += push;
              const tmp = a.vy;
              a.vy = b.vy + rand(-12, 12);
              b.vy = tmp + rand(-12, 12);
            }
            for (const s of sq) {
              const hs = s.size / 2;
              s.x = clamp(s.x, hs, width - hs);
              s.y = clamp(s.y, hs, h - hs);
              s.vx = clamp(s.vx, -160, 160);
              s.vy = clamp(s.vy, -160, 160);
            }
          }
        }

        const squaresOut = sq.map((s) => ({ x: s.x, y: s.y, size: s.size }));
        setSquares(squaresOut);
        setRuns(computeRuns(squaresOut.map(rectOf)));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    if (boxRef.current) io.observe(boxRef.current);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [pt, width, text, reduce]);

  if (!pt || runs === null || height === null) {
    return (
      <p className="mb-6 text-lg sm:text-xl leading-8 text-neutral-800">{text}</p>
    );
  }

  return (
    <div ref={boxRef} className="relative mb-8" style={{ height }}>
      {squares.map((s, i) => (
        <div
          key={i}
          className="pointer-events-none absolute"
          style={{
            left: s.x - s.size / 2,
            top: s.y - s.size / 2,
            width: s.size,
            height: s.size,
            background: "rgb(101, 163, 13)",
          }}
          aria-hidden
        />
      ))}
      {runs.map((r, i) => (
        <span
          key={i}
          className="absolute overflow-hidden text-neutral-800"
          style={{
            top: r.top,
            left: r.left,
            width: r.w,
            fontFamily: FONT,
            fontSize: `${FS}px`,
            lineHeight: `${LH}px`,
            fontWeight: 400,
            whiteSpace: "nowrap",
          }}
        >
          {r.text}
        </span>
      ))}
    </div>
  );
}

function Para({
  text,
  dropcap,
  reduce,
}: {
  text: string;
  dropcap?: boolean;
  reduce: boolean;
}) {
  if (!dropcap || !text) return <p className="mb-4">{text}</p>;
  return (
    <p className="mb-4" style={{ overflow: "hidden", minHeight: 64 }}>
      <DropLetter ch={text.slice(0, 1)} reduce={reduce} />
      {text.slice(1)}
    </p>
  );
}

function Quote({
  block,
}: {
  block: { kind: "quote"; text: string; source?: { label: string; href: string } };
}) {
  return (
    <blockquote className="my-6 border-l-2 border-brand-300 pl-4 italic text-neutral-600">
      <p className="mb-1 text-base sm:text-lg">{block.text}</p>
      {block.source && (
        <a
          href={block.source.href}
          target="_blank"
          rel="noopener noreferrer"
          className="not-italic text-sm font-medium text-brand-700 underline decoration-2 decoration-brand-400 underline-offset-2 hover:text-brand-800"
        >
          {block.source.label}
        </a>
      )}
    </blockquote>
  );
}

function RichPara({
  segments,
  dropcap,
  reduce,
}: {
  segments: Seg[];
  dropcap?: boolean;
  reduce: boolean;
}) {
  let segs = segments;
  let drop: React.ReactNode = null;
  const hasDrop = !!(dropcap && segs.length && !segs[0].href && segs[0].text);
  if (hasDrop) {
    drop = <DropLetter ch={segs[0].text.slice(0, 1)} reduce={reduce} />;
    segs = [{ text: segs[0].text.slice(1) }, ...segs.slice(1)];
  }
  return (
    <p
      className="mb-4"
      style={hasDrop ? { overflow: "hidden", minHeight: 64 } : undefined}
    >
      {drop}
      {segs.map((s, i) =>
        s.href ? (
          <a
            key={i}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-700 underline decoration-2 decoration-brand-400 underline-offset-2 hover:text-brand-800"
          >
            {s.text}
          </a>
        ) : (
          <span key={i}>{s.text}</span>
        )
      )}
    </p>
  );
}
