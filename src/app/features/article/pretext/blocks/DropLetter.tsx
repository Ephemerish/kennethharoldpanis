import { useEffect, useRef } from "react";
import { FONT } from "../shared";
import { visibleAnimation } from "../animation";

/** A drop-cap first letter that pulses between the body size and ~2 lines tall.
 *  It animates the real font-size, so the text around it visibly re-wraps. */
export function DropLetter({ ch, reduce }: { ch: string; reduce: boolean }) {
  const SMALL = 20; // about the body text size (the "original")
  const BIG = 58; // about two lines tall
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (reduce) {
      element.style.fontSize = `${(SMALL + BIG) / 2}px`;
      return;
    }
    let t = 0;
    return visibleAnimation(element, dt => {
      t += dt;
      const p = 0.5 + 0.5 * Math.sin(t * 1.8); // 0..1
      element.style.fontSize = `${SMALL + (BIG - SMALL) * p}px`;
    }, 20);
  }, [reduce]);

  return (
    <span
      ref={ref}
      style={{
        float: "left",
        fontFamily: FONT,
        fontWeight: 800,
        color: "var(--brand-600)",
        fontSize: `${SMALL}px`,
        lineHeight: 1,
        paddingRight: 10,
        marginTop: 2,
      }}
    >
      {ch}
    </span>
  );
}
