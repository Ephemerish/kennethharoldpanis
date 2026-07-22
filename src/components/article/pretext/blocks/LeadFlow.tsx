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
  type Pretext,
  type Run,
  type Square,
  type SquareState,
} from "../shared";

/** Opening paragraph, flowed through the gaps around two bouncing squares. */
export function LeadFlow({
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
