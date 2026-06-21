/**
 * Shared pretext.js helpers.
 *
 * Everything that both the article engine (<PretextEngine />) and the card/
 * article cover (<PretextCover />) need lives here, so the layout maths and the
 * bouncing-square physics are defined exactly once:
 *
 *   - flowText   wraps prepared text through the free gaps left by the squares.
 *   - stepSquares advances the square physics by one frame (bounce + collide).
 *   - byLetter   lets pretext break between letters, not just words.
 *
 * These are framework-free (no React) so they can be unit-reasoned about and
 * reused; the React glue (module loading, sizing, the rAF loop) lives in
 * ./hooks.ts.
 */
import type { PreparedTextWithSegments } from "@chenglou/pretext";

export type Pretext = typeof import("@chenglou/pretext");
export type Prepared = PreparedTextWithSegments;

export type Box = { w: number; h: number };
export type Rect = { left: number; right: number; top: number; bottom: number };
export type Run = { text: string; top: number; left: number; w: number };
/** A square as drawn. */
export type Square = { x: number; y: number; s: number };
/** A square plus the physics state needed to animate it. */
export type SquareState = Square & { vx: number; vy: number; base: number };

export const FONT = "Outfit, system-ui, sans-serif";
export const SQUARE_COLOR = "rgb(101, 163, 13)"; // brand-600

export const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));
export const rand = (a: number, b: number) => a + Math.random() * (b - a);

/**
 * Insert a zero-width break opportunity between every grapheme so pretext can
 * wrap by letter, not just at spaces. Invisible — the text reads the same.
 */
export const byLetter = (s: string) => Array.from(s).join("\u200B");

/** Square → rectangle, optionally grown by `gap` of clearance on every side. */
export const rectOf = (sq: Square, gap = 0): Rect => ({
  left: sq.x - sq.s / 2 - gap,
  right: sq.x + sq.s / 2 + gap,
  top: sq.y - sq.s / 2 - gap,
  bottom: sq.y + sq.s / 2 + gap,
});

export type FlowOptions = {
  width: number;
  /** First row's y. Use to vertically center a short block. */
  startTop: number;
  /** Stop once a row would pass this y. */
  maxBottom: number;
  lineHeight: number;
  /** Obstacles, already grown by their clearance (see rectOf). */
  rects: Rect[];
  /** Ignore free gaps narrower than this. */
  minSeg: number;
  /** "center" each line in its gap, or pack it "left". */
  align: "left" | "center";
};

/**
 * Lay prepared text out row by row, filling every free horizontal gap left by
 * the rects so the text flows past the squares instead of stopping at the
 * first one. Returns the positioned line runs.
 */
export function flowText(
  pt: Pretext,
  prepared: Prepared,
  { width: W, startTop, maxBottom, lineHeight: LH, rects, minSeg, align }: FlowOptions
): Run[] {
  const runs: Run[] = [];
  let cursor = { segmentIndex: 0, graphemeIndex: 0 };
  let top = startTop;
  let guard = 0;

  while (top + LH <= maxBottom && guard < 240) {
    guard++;

    // Intervals the squares occupy on this row band, merged.
    const occ: [number, number][] = [];
    for (const r of rects) {
      if (top + LH > r.top && top < r.bottom) {
        occ.push([Math.max(0, r.left), Math.min(W, r.right)]);
      }
    }
    occ.sort((a, b) => a[0] - b[0]);
    const merged: [number, number][] = [];
    for (const iv of occ) {
      const last = merged[merged.length - 1];
      if (last && iv[0] <= last[1]) last[1] = Math.max(last[1], iv[1]);
      else merged.push([iv[0], iv[1]]);
    }

    // The gaps between them.
    const free: [number, number][] = [];
    let x = 0;
    for (const m of merged) {
      if (m[0] - x >= 1) free.push([x, m[0]]);
      x = Math.max(x, m[1]);
    }
    if (x < W) free.push([x, W]);

    let placed = false;
    for (const [x0, x1] of free) {
      const gw = x1 - x0;
      if (gw < minSeg) continue;
      const range = pt.layoutNextLineRange(prepared, cursor, gw);
      if (!range) continue;
      if (
        range.end.segmentIndex === cursor.segmentIndex &&
        range.end.graphemeIndex === cursor.graphemeIndex
      )
        continue;
      const line = pt.materializeLineRange(prepared, range);
      const left = align === "center" ? x0 + (gw - line.width) / 2 : x0;
      runs.push({ text: line.text, top, left, w: line.width });
      cursor = range.end;
      placed = true;
    }

    top += LH;
    if (!placed && !pt.layoutNextLineRange(prepared, cursor, W)) break;
  }

  return runs;
}

export type StepOptions = {
  /** Pulse each square's size around its base. */
  pulse?: boolean;
  /** Bounce the two squares off each other (needs exactly two). */
  collide?: boolean;
  /** Random velocity kick on each wall bounce. */
  jitter?: number;
  /** Speed cap. */
  maxV?: number;
};

/** Advance the squares one frame: walls, optional pulse, optional collision. */
export function stepSquares(
  st: SquareState[],
  box: Box,
  dt: number,
  t: number,
  { pulse = false, collide = false, jitter = 14, maxV = 150 }: StepOptions = {}
): void {
  for (let i = 0; i < st.length; i++) {
    const s = st[i];
    if (pulse) s.s = s.base + (i ? 8 : 12) * Math.sin(t * (i ? 1.1 : 0.9));
    const hs = s.s / 2;
    s.x += s.vx * dt;
    s.y += s.vy * dt;
    if (s.x < hs) {
      s.x = hs;
      s.vx = Math.abs(s.vx);
      s.vy += rand(-jitter, jitter);
    } else if (s.x > box.w - hs) {
      s.x = box.w - hs;
      s.vx = -Math.abs(s.vx);
      s.vy += rand(-jitter, jitter);
    }
    if (s.y < hs) {
      s.y = hs;
      s.vy = Math.abs(s.vy);
      s.vx += rand(-jitter, jitter);
    } else if (s.y > box.h - hs) {
      s.y = box.h - hs;
      s.vy = -Math.abs(s.vy);
      s.vx += rand(-jitter, jitter);
    }
    s.vx = clamp(s.vx, -maxV, maxV);
    s.vy = clamp(s.vy, -maxV, maxV);
  }

  if (collide && st.length === 2) {
    const a = st[0];
    const b = st[1];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const ox = a.s / 2 + b.s / 2 - Math.abs(dx);
    const oy = a.s / 2 + b.s / 2 - Math.abs(dy);
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
      for (const s of st) {
        const hs = s.s / 2;
        s.x = clamp(s.x, hs, box.w - hs);
        s.y = clamp(s.y, hs, box.h - hs);
        s.vx = clamp(s.vx, -maxV, maxV);
        s.vy = clamp(s.vy, -maxV, maxV);
      }
    }
  }
}

export const asSquares = (st: SquareState[]): Square[] =>
  st.map((s) => ({ x: s.x, y: s.y, s: s.s }));

/* --------------------------------------------------------------------------
 * Per-character measurement + grid layout (for the Matrix cover).
 *
 * pretext measures with canvas measureText, so measuring one grapheme returns
 * the exact advance the browser will paint. We measure and place EVERY
 * character on its own, so a glyph is always given its full measured width and
 * can never be clipped mid-letter.
 * ------------------------------------------------------------------------ */

/** Latin glyphs a letter scrambles through before it locks in. */
export const MATRIX_GLYPHS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&?!<>/\\{}[]";

export const randGlyph = () =>
  MATRIX_GLYPHS[(Math.random() * MATRIX_GLYPHS.length) | 0];

/** Nonsense the rain streams spell out as they fall, just for fun. */
export const FUNNY_PHRASES = [
  "IT WORKS ON MY MACHINE",
  "JUST ONE MORE COMMIT",
  "THE DOM IS A LIE",
  "MEASURE TWICE DRAW NEVER",
  "SHIP IT AND PRAY",
  "404 BRAIN NOT FOUND",
  "TRUST THE MATH",
  "RM -RF REGRETS",
  "BLAME THE CACHE",
  "YOLO DEPLOY ON FRIDAY",
  "PRETEXT IS WITCHCRAFT",
  "NO DOM NO PROBLEM",
  "WHY IS IT LIKE THIS",
  "CONSOLE LOG EVERYTHING",
  "EMBRACE THE CHAOS",
  "REALITY IS OPTIONAL",
  "TABS VERSUS SPACES FOREVER",
  "HELP I AM TRAPPED IN A CARD",
  "THIS IS FINE",
  "I HAVE NO IDEA WHAT I AM DOING",
];

export const randPhrase = () =>
  FUNNY_PHRASES[(Math.random() * FUNNY_PHRASES.length) | 0];

/**
 * Measure each unique grapheme's advance at 1px, so widths can be scaled to any
 * font size by simple multiplication. Spaces are measured by difference, since
 * pretext collapses a bare " ".
 */
export function measureUnits(
  pt: Pretext,
  text: string,
  fontFamily: string
): Map<string, number> {
  const nat = (s: string) =>
    pt.measureNaturalWidth(pt.prepareWithSegments(s, `100px ${fontFamily}`)) / 100;
  const units = new Map<string, number>();
  for (const ch of new Set(Array.from(text))) {
    units.set(ch, ch === " " ? Math.max(0, nat("A A") - nat("AA")) : nat(ch));
  }
  return units;
}

export type Glyph = {
  ch: string;
  x: number;
  y: number;
  w: number;
  row: number;
  col: number;
};

export type GlyphLayout = {
  glyphs: Glyph[];
  width: number;
  height: number;
  lines: number;
  rowHeight: number;
};

/**
 * Place each character of `text` into rows that fit `maxWidth`, wrapping at
 * spaces (hard-breaking a word only if it alone is too wide). Pure arithmetic
 * given the 1px unit widths from measureUnits — every glyph gets its own exact
 * box, so nothing is ever cut.
 */
export function layoutGlyphs(
  units: Map<string, number>,
  text: string,
  opts: {
    fontSize: number;
    maxWidth: number;
    lineHeight: number;
    align?: "left" | "center";
  }
): GlyphLayout {
  const { fontSize: fs, maxWidth, lineHeight, align = "center" } = opts;
  const w = (ch: string) => (units.get(ch) ?? 0) * fs;
  const spaceW = w(" ");

  type Cell = { ch: string; w: number };
  const lines: Cell[][] = [];
  let line: Cell[] = [];
  let lineW = 0;

  const pushLine = () => {
    // Drop a trailing space so centering stays true.
    while (line.length && line[line.length - 1].ch === " ") {
      lineW -= line.pop()!.w;
    }
    lines.push(line);
    line = [];
    lineW = 0;
  };

  for (const word of text.split(" ")) {
    const cells: Cell[] = Array.from(word).map((ch) => ({ ch, w: w(ch) }));
    const wordW = cells.reduce((s, c) => s + c.w, 0);
    if (line.length && lineW + spaceW + wordW > maxWidth) pushLine();
    else if (line.length) {
      line.push({ ch: " ", w: spaceW });
      lineW += spaceW;
    }
    for (const c of cells) {
      if (line.length && lineW + c.w > maxWidth) pushLine();
      line.push(c);
      lineW += c.w;
    }
  }
  if (line.length) pushLine();

  const glyphs: Glyph[] = [];
  let maxLineW = 0;
  lines.forEach((cells, row) => {
    const lw = cells.reduce((s, c) => s + c.w, 0);
    maxLineW = Math.max(maxLineW, lw);
    let x = align === "center" ? (maxWidth - lw) / 2 : 0;
    const y = row * lineHeight;
    cells.forEach((c, col) => {
      if (c.ch !== " ") glyphs.push({ ch: c.ch, x, y, w: c.w, row, col });
      x += c.w;
    });
  });

  return {
    glyphs,
    width: maxLineW,
    height: lines.length * lineHeight,
    lines: lines.length,
    rowHeight: lineHeight,
  };
}
