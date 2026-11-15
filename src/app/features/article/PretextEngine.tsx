import { useElementBox, usePretext } from "./pretext/hooks";
import { Heading } from "./pretext/blocks/Heading";
import { Quote } from "./pretext/blocks/Quote";
import { Para } from "./pretext/blocks/Para";
import { RichPara } from "./pretext/blocks/RichPara";
import { LeadFlow } from "./pretext/blocks/LeadFlow";
import type { Block, Seg } from "./pretext/blocks/types";

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
 * <PretextCover /> via ./pretext/shared. Each block kind (heading, drop-cap
 * paragraph, rich links, quote, the animated lead) is its own renderer under
 * ./pretext/blocks — this file only dispatches by block kind.
 */

export type { Block, Seg };

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
