import { DropLetter } from "./DropLetter";
import type { Seg } from "./types";

export function RichPara({
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
