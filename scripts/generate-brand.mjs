/**
 * Draws the site's mark, the moon-phase "orbit", from one description: six
 * phases in a ring around a full moon, on the 500 grid with the 20 margin of
 * Pundo, Pidada and Sari. Writes, from the same shapes:
 *
 *   src/app/layout/brand/splash.json  the splash: each moon as a small SVG, where it
 *                                     sits, where it flies from, and the timing
 *   src/app/layout/brand/orbit.json, orbit-dark.json  the same animation as Lottie,
 *                                     the master for the app family; not loaded by the site
 *   public/favicon.svg, favicon.ico, apple-touch-icon.png  the mark at rest
 *
 * The site's splash is CSS, not a player: each moon is moved by `transform` on
 * the compositor, so it is smooth on any device and costs no download. Its
 * timing comes from TIMING below, which the Lottie uses too.
 * The colours here and the `--mark-*` tokens in lib/khp-ui/tokens/theme.css
 * must match.
 * Run with `pnpm generate:brand` after changing anything here; the output is
 * committed.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const root = resolve(import.meta.dirname, "..");
const brandDir = resolve(root, "src/app/layout/brand");

/** The mark's colours: moss ground, a darker moss for the unlit side, cream light. */
const THEMES = {
  light: { ground: "#3D6B47", shadow: "#2F5538", lit: "#E8E3D9" },
  dark: { ground: "#31593A", shadow: "#25462C", lit: "#E8E3D9" },
};

const SIZE = 500;
const CENTRE = 250;
const RING = 156; // distance from the centre to each moon
const MOON = 74; // each moon's radius
const FULL = 86; // the full moon in the middle
const COUNT = 6;

/** Each moon: where it sits, how lit it is (0 new, 0.5 half, 1 full) and which side is lit. */
const moons = Array.from({ length: COUNT }, (_, k) => {
  const angle = -Math.PI / 2 + (2 * Math.PI * k) / COUNT;
  const t = k / COUNT;
  return {
    x: CENTRE + RING * Math.cos(angle),
    y: CENTRE + RING * Math.sin(angle),
    phase: t <= 0.5 ? 2 * t : 2 - 2 * t,
    side: t <= 0.5 ? 1 : -1, // waxing is lit on the right, waning on the left
  };
});

const round = (n) => Math.round(n * 10) / 10;

/** The terminator's half-width: the lit part is a half disc plus or minus a half ellipse. */
const terminator = (phase) => Math.abs(Math.cos(Math.PI * phase)) * MOON;

/** SVG path of a moon's lit part. */
function litPath({ x, y, phase, side }) {
  const rx = terminator(phase);
  const top = `${round(x)} ${round(y - MOON)}`;
  const bottom = `${round(x)} ${round(y + MOON)}`;
  const limb = side > 0 ? 1 : 0;
  // Crescent: the terminator bows toward the lit side; gibbous: away from it.
  const bow = (phase > 0.5) === (side > 0) ? 1 : 0;
  const back = rx < 0.5 ? `L${top}` : `A${round(rx)} ${MOON} 0 0 ${bow} ${top}`;
  return `M${top}A${MOON} ${MOON} 0 0 ${limb} ${bottom}${back}Z`;
}

function markSvg({ ground, shadow, lit }) {
  const parts = [`<rect width="${SIZE}" height="${SIZE}" fill="${ground}"/>`];
  for (const moon of moons) {
    parts.push(`<circle cx="${round(moon.x)}" cy="${round(moon.y)}" r="${MOON}" fill="${shadow}"/>`);
    if (moon.phase >= 1) parts.push(`<circle cx="${round(moon.x)}" cy="${round(moon.y)}" r="${MOON}" fill="${lit}"/>`);
    else if (moon.phase > 0) parts.push(`<path d="${litPath(moon)}" fill="${lit}"/>`);
  }
  parts.push(`<circle cx="${CENTRE}" cy="${CENTRE}" r="${FULL}" fill="${lit}"/>`);
  return `<svg width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" fill="none" xmlns="http://www.w3.org/2000/svg">\n${parts.join("\n")}\n</svg>\n`;
}

// ---- Lottie ---------------------------------------------------------------
//
// The splash fills the window with the mark's ground colour (`--mark-ground`
// in theme.css), so the animation draws only the moons, on a large square
// stage centred in the window. Two named segments, one motion:
//   in   the moons fly in from beyond the window's edges and settle into the
//        ring (ease-out), a few frames apart; the full moon pops in last.
//   out  the same flight backwards (ease-in-out): the moons fly out past the
//        edges and the full moon shrinks away, while the splash fades.
// The splash plays `in`, waits for the page to load, then plays `out`.

/** The motion, in milliseconds: the splash's CSS and the Lottie both read it. */
const TIMING = {
  stagger: 50, // between one moon's flight in and the next, clockwise from the top
  fly: 730, // one moon's flight in
  popDelay: 500, // when the full moon starts to pop in
  pop: 400, // its pop
  hold: 1220, // when the mark is together and the splash may start to leave
  outStagger: 17, // between moons flying out
  out: 670, // the flight out, and the splash's fade
  max: 4500, // the splash is gone by then whatever happens
};

const STAGE = 1000; // the Lottie's square; the splash fits it to the window's short side
const MID = STAGE / 2;
const SCALE_MARK = 500 / (SIZE - 40); // the mark spans half the stage: half the window's short side
const FAR = 900; // how far from the middle a moon starts and ends: past every edge

const FPS = 60;
const frames = (ms) => Math.round((ms * FPS) / 1000);
const IN_START = 0;
const IN_STAGGER = frames(TIMING.stagger);
const FLY = frames(TIMING.fly);
const CENTRE_IN = frames(TIMING.popDelay);
const CENTRE_POP = [0, frames(TIMING.pop * 0.65), frames(TIMING.pop)]; // nothing, overshoot, rest
const IN_END = frames(TIMING.hold);
const OUT_STAGGER = frames(TIMING.outStagger);
const FLY_OUT = frames(TIMING.out);
const OUT_END = IN_END + (COUNT - 1) * OUT_STAGGER + FLY_OUT;

const KAPPA = 0.5523; // a quarter circle as a cubic Bézier

const colour = (hex) => [1, 3, 5].map((i) => round(parseInt(hex.slice(i, i + 2), 16) / 255 * 1000) / 1000).concat(1);
const still = (k) => ({ a: 0, k });
const fill = (hex) => ({ ty: "fl", c: still(colour(hex)), o: still(100), r: 1, bm: 0 });
const transform = () => ({ ty: "tr", p: still([0, 0]), a: still([0, 0]), s: still([100, 100]), r: still(0), o: still(100), sk: still(0), sa: still(0) });
const ellipse = (r) => ({ ty: "el", d: 1, p: still([0, 0]), s: still([round(2 * r), round(2 * r)]) });
const group = (name, ...items) => ({ ty: "gr", nm: name, it: [...items, transform()] });

/** A moon's lit part, around its own centre, as Bézier vertices: top, limb, bottom, terminator. */
function litShape({ phase, side }, r) {
  const s = side;
  const rx = Math.abs(Math.cos(Math.PI * phase)) * r * (phase < 0.5 ? s : -s); // the terminator's x offset
  const k = KAPPA * r;
  const kt = KAPPA * rx;
  const v = [[0, -r], [s * r, 0], [0, r], [rx, 0]];
  const o = [[s * k, 0], [0, k], [kt, 0], [0, -k]];
  const i = [[kt, 0], [0, -k], [s * k, 0], [0, k]];
  const r2 = (p) => p.map((q) => q.map(round));
  return { ty: "sh", d: 1, ks: still({ c: true, v: r2(v), i: r2(i), o: r2(o) }) };
}

/** Easing as Lottie handles: x and y of the out and in control points. */
const curve = (ox, oy, ix, iy, n = 3) => ({ o: { x: Array(n).fill(ox), y: Array(n).fill(oy) }, i: { x: Array(n).fill(ix), y: Array(n).fill(iy) } });
const EASE_OUT = (n) => curve(0.16, 1, 0.3, 1, n); // fast start, soft landing
const EASE_IN_OUT = (n) => curve(0.65, 0, 0.35, 1, n); // soft start, soft finish
const HOLD = (n) => curve(0.5, 0.5, 0.5, 0.5, n);

/** Keyframes: each entry is [frame, value, easing to the next]; the last has no easing. */
function keys(...list) {
  return { a: 1, k: list.map(([t, s, ease], n) => (n < list.length - 1 ? { t, s, ...ease } : { t, s })) };
}

function layer(index, name, position, scale, opacity, shapes) {
  return {
    ddd: 0, ind: index, ty: 4, nm: name, sr: 1,
    ks: { o: opacity, r: still(0), p: position, a: still([0, 0, 0]), s: scale },
    ao: 0, shapes, ip: 0, op: OUT_END, st: 0, bm: 0,
  };
}

function orbitLottie({ shadow, lit }) {
  const k = SCALE_MARK;
  const moonR = MOON * k;
  const layers = [];
  // The full moon pops in last and shrinks away first.
  layers.push(layer(1, "full moon", still([MID, MID, 0]),
    keys(
      [0, [0, 0, 100], HOLD(3)],
      [CENTRE_IN + CENTRE_POP[0], [0, 0, 100], EASE_OUT(3)],
      [CENTRE_IN + CENTRE_POP[1], [108, 108, 100], EASE_OUT(3)],
      [CENTRE_IN + CENTRE_POP[2], [100, 100, 100], HOLD(3)],
      [IN_END, [100, 100, 100], EASE_IN_OUT(3)],
      [IN_END + Math.round(FLY_OUT * 0.6), [0, 0, 100]],
    ),
    still(100),
    [group("full", ellipse(FULL * k), fill(lit))]));
  moons.forEach((moon, n) => {
    const dx = moon.x - CENTRE, dy = moon.y - CENTRE;
    const len = Math.hypot(dx, dy);
    const home = [round(MID + dx * k), round(MID + dy * k), 0];
    const away = [round(MID + (dx / len) * FAR), round(MID + (dy / len) * FAR), 0];
    const start = IN_START + n * IN_STAGGER;
    const leave = IN_END + n * OUT_STAGGER;
    const shapes = [];
    if (moon.phase >= 1) shapes.push(group("lit", ellipse(moonR), fill(lit)));
    else if (moon.phase > 0) shapes.push(group("lit", litShape(moon, moonR), fill(lit)));
    shapes.push(group("unlit", ellipse(moonR), fill(shadow)));
    layers.push(layer(n + 2, `moon ${n + 1}`,
      keys([0, away, HOLD(3)], [start, away, EASE_OUT(3)], [start + FLY, home, HOLD(3)], [leave, home, EASE_IN_OUT(3)], [leave + FLY_OUT, away]),
      keys([0, [70, 70, 100], HOLD(3)], [start, [70, 70, 100], EASE_OUT(3)], [start + FLY, [100, 100, 100], HOLD(3)], [leave, [100, 100, 100], EASE_IN_OUT(3)], [leave + FLY_OUT, [70, 70, 100]]),
      still(100),
      shapes));
  });
  return {
    v: "5.12.1", fr: FPS, ip: 0, op: OUT_END, w: STAGE, h: STAGE, nm: "khp-orbit", ddd: 0, assets: [], layers,
    markers: [{ tm: 0, cm: "in", dr: IN_END }, { tm: IN_END, cm: "out", dr: OUT_END - IN_END }],
  };
}

// ---- Splash (CSS) -----------------------------------------------------------
//
// Each piece is a moon in its own small SVG, filled by the `--mark-lit` and
// `--mark-shadow` tokens through classes, so one drawing serves both themes.
// x, y and size are percentages of the mark's box; dx, dy the unit direction
// it flies in from and out to; i its order.

function moonSvg(moon) {
  const r = MOON;
  const lit = moon.phase >= 1
    ? `<circle r="${r}" class="splash-lit"/>`
    : moon.phase > 0 ? `<path d="${litPath({ ...moon, x: 0, y: 0 })}" class="splash-lit"/>` : "";
  return `<svg viewBox="${-r} ${-r} ${2 * r} ${2 * r}" aria-hidden="true"><circle r="${r}" class="splash-unlit"/>${lit}</svg>`;
}

function splashPieces() {
  const box = SIZE - 40; // the mark's moons span the 20 margin to 480
  const pct = (v) => round(((v - 20) / box) * 1000) / 10;
  const pieces = moons.map((moon, i) => {
    const dx = moon.x - CENTRE, dy = moon.y - CENTRE;
    const len = Math.hypot(dx, dy);
    return {
      kind: "moon", i, svg: moonSvg(moon),
      x: pct(moon.x), y: pct(moon.y), size: round((2 * MOON / box) * 1000) / 10,
      dx: round((dx / len) * 1000) / 1000, dy: round((dy / len) * 1000) / 1000,
    };
  });
  pieces.push({
    kind: "full", i: COUNT, svg: `<svg viewBox="${-FULL} ${-FULL} ${2 * FULL} ${2 * FULL}" aria-hidden="true"><circle r="${FULL}" class="splash-lit"/></svg>`,
    x: 50, y: 50, size: round((2 * FULL / box) * 1000) / 10, dx: 0, dy: 0,
  });
  return { timing: TIMING, pieces };
}

// ---- Write ----------------------------------------------------------------

await mkdir(brandDir, { recursive: true });
await writeFile(resolve(brandDir, "splash.json"), JSON.stringify(splashPieces(), null, 2) + "\n");
for (const [name, theme] of Object.entries(THEMES)) {
  const suffix = name === "light" ? "" : "-dark";
  await writeFile(resolve(brandDir, `orbit${suffix}.json`), JSON.stringify(orbitLottie(theme)));
}

const svg = Buffer.from(markSvg(THEMES.light));
await writeFile(resolve(root, "public/favicon.svg"), svg);
await sharp(svg).resize(180, 180).png().toFile(resolve(root, "public/apple-touch-icon.png"));

// favicon.ico: 16, 32 and 48 pixel PNGs in one ICO container.
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((size) => sharp(svg).resize(size, size).png().toBuffer()));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((size, n) => {
  const at = 6 + 16 * n;
  header.writeUInt8(size, at);
  header.writeUInt8(size, at + 1);
  header.writeUInt16LE(1, at + 4);
  header.writeUInt16LE(32, at + 6);
  header.writeUInt32LE(pngs[n].length, at + 8);
  header.writeUInt32LE(offset, at + 12);
  offset += pngs[n].length;
});
await writeFile(resolve(root, "public/favicon.ico"), Buffer.concat([header, ...pngs]));

console.log(`Brand: splash pieces, the orbit Lottie (in ${IN_END} + out ${OUT_END - IN_END} frames at ${FPS} fps) and favicons written.`);
