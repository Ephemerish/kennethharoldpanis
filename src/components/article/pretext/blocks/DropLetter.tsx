import { useEffect, useRef, useState } from "react";
import { FONT } from "../shared";

/** A drop-cap first letter that pulses between the body size and ~2 lines tall.
 *  It animates the real font-size, so the text around it visibly re-wraps. */
export function DropLetter({ ch, reduce }: { ch: string; reduce: boolean }) {
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
