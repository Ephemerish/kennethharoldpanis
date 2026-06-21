import { useEffect, useRef, useState } from "react";
import {
  asSquares,
  clamp,
  flowText,
  FONT,
  rectOf,
  SQUARE_COLOR,
  stepSquares,
  type Prepared,
  type Run,
  type Square,
  type SquareState,
} from "./pretext/shared";
import { useElementBox, usePretext } from "./pretext/hooks";

/**
 * PretextEngine, the renderer behind the "pretext" article engine.
 *
 * Instead of the usual markdown/Prose pipeline, this lays the article out
 * itself with pretext.js, with visible results:
 *
 *   - The first letter of each section is a drop cap that pulses small/big.
 *   - The opening paragraph flows around two glowing squares that bounce around
 *     the box. Text fills every free horizontal gap on a line, so it runs
 *     between the squares instead of just stopping at the first one.
 *
 * It degrades cleanly: on the server (and before pretext loads) it renders
 * plain, readable HTML. Motion pauses offscreen and stops under
 * prefers-reduced-motion. All the layout/physics maths is shared with
 * <PretextCover /> via ./pretext/shared.
 */

export type Seg = { text: string; href?: string };
export type Block =
  | { kind: "h2"; text: string }
  | { kind: "p"; text: string }
  | { kind: "rich"; segments: Seg[] }
  | { kind: "quote"; text: string; source?: { label: string; href: string } };

export default function PretextEngine({ blocks }: { blocks: Block[] }) {
  const { pt, reduce } = usePretext();
  const { ref: wrapRef, box } = useElementBox<HTMLDivElement>({ w: 680, h: 0 });
  const width = box.w;

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

/** Plain section heading. */
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

/** Opening paragraph, flowed through the gaps around two bouncing squares. */
function LeadFlow({
  text,
  width,
  pt,
  reduce,
}: {
  text: string;
  width: number;
  pt: import("./pretext/shared").Pretext | null;
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
    let prepared: Prepared;
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

    const compute = (sq: Square[]): Run[] =>
      flowText(pt, prepared, {
        width,
        startTop: 0,
        maxBottom: h,
        lineHeight: LH,
        rects: sq.map((s) => rectOf(s, GAP)),
        minSeg: MINSEG,
        align: "left",
      });

    const seeds: SquareState[] = [
      { x: width * 0.62, y: h * 0.32, vx: 78, vy: 58, base: 96 * scale, s: 96 * scale },
      { x: width * 0.8, y: h * 0.66, vx: -104, vy: -72, base: 66 * scale, s: 66 * scale },
    ];

    if (reduce) {
      seeds[0].x = width - 70 * scale;
      seeds[0].y = h * 0.38;
      seeds[1].x = width * 0.66;
      seeds[1].y = h * 0.66;
      const next = seeds.map((s) => ({ x: s.x, y: s.y, s: s.base }));
      setSquares(next);
      setRuns(compute(next));
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
        stepSquares(seeds, { w: width, h }, dt, t, {
          pulse: true,
          collide: true,
          jitter: 16,
          maxV: 160,
        });
        const next = asSquares(seeds);
        setSquares(next);
        setRuns(compute(next));
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
            left: s.x - s.s / 2,
            top: s.y - s.s / 2,
            width: s.s,
            height: s.s,
            background: SQUARE_COLOR,
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
