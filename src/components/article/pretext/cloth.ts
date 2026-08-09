/**
 * createCloth, the physics utility behind <PretextCover />.
 *
 * Framework-free (like ./shared) so it can be reasoned about and reused on
 * its own; rendering stays with the caller, this module only owns state and
 * stepping. It simulates:
 *
 *   - fabric strips: verlet ropes (points plus distance constraints) pinned
 *     above the frame, with a phrase scroll offset per strip.
 *   - gusts: one at a time, sweeping in from any of the 8 compass directions
 *     with long calm stretches between, each either a straight shove or a
 *     curling swirl.
 *   - pointer wind: an air pocket around the mouse that out-muscles every
 *     automatic gust and fades shortly after the pointer stops.
 *   - wind-lines: the visible air. Each is a fixed undulating path (often
 *     with a loop-the-loop) that a short bright comet flows along, which is
 *     what an animated gust of wind is expected to look like.
 *
 * Ripples, S-curves, and neighbors overlapping are the point of the whole
 * effect; if tuning ever kills them, the tuning is wrong.
 */
import { clamp, rand } from "./shared";

export type ClothPoint = { x: number; y: number; px: number; py: number };

export type ClothStrip = {
  phrase: string;
  pts: ClothPoint[];
  pinX: number;
  seg: number;
  cum: number[]; // cumulative arc length per point, rebuilt each step
  scroll: number; // px the text has flowed down the fabric
  flow: number; // px/s
  shade: number; // per-strip fabric tint variation
};

/**
 * A visible line of moving air. `pts` is the path in local coords (travel
 * along +x, before rotating by `ang`); the caller reveals a comet of length
 * `seg` flowing along it with setLineDash:
 *
 *   dash [seg, total + seg], dashOffset seg - progress * (total + seg)
 */
export type WindLine = {
  x: number; // world anchor of the path start
  y: number;
  ang: number; // travel direction, radians
  pts: { x: number; y: number }[];
  total: number; // path length, px
  seg: number; // visible comet length, px
  drift: number; // px/s the whole line drifts along its direction
  age: number;
  ttl: number;
};

export type Cloth = {
  strips: ClothStrip[];
  winds: WindLine[];
  step(dt: number): void;
  /** Point + tangent angle at arc length `arc` down a strip's rope. */
  posAt(s: ClothStrip, arc: number): [number, number, number];
  /** Feed pointer motion, in canvas-relative coords + event timeStamp. */
  pointerMove(x: number, y: number, timeStamp: number): void;
  pointerEnd(): void;
};

// Light fabric: gravity just strong enough to keep the strips hanging, low
// drag so ripples run the length of the cloth before dying out.
const GRAV = 1200; // px/s^2
const DAMP = 0.975;
const SEG = 22; // rope segment length, px
const MOUSE_R = 100; // radius of the pointer's air pocket

export function createCloth(o: {
  w: number;
  h: number;
  stripW: number;
  gapX: number;
  pinY: number;
  stripLen: number;
  makePhrase: () => string;
}): Cloth {
  const { w, h, stripW, gapX, pinY, stripLen, makePhrase } = o;

  const pitch = stripW + gapX;
  const nStrips = Math.max(2, Math.floor((w - gapX) / pitch));
  const originX = (w - (nStrips * pitch - gapX)) / 2 + stripW / 2;

  const strips: ClothStrip[] = [];
  for (let i = 0; i < nStrips; i++) {
    const pinX = originX + i * pitch;
    const n = Math.max(5, Math.round(stripLen / SEG));
    const pts: ClothPoint[] = [];
    for (let k = 0; k <= n; k++) {
      // a hair of initial slack so the strips never wave in perfect sync
      const x = pinX + Math.sin(k * 0.7 + i) * 0.5;
      const y = pinY + (k * stripLen) / n;
      pts.push({ x, y, px: x, py: y });
    }
    strips.push({
      phrase: makePhrase(),
      pts,
      pinX,
      seg: stripLen / n,
      cum: [0],
      scroll: rand(0, 400),
      flow: rand(16, 40),
      shade: rand(-1, 1),
    });
  }

  // Wind. One gust at a time sweeps across with long calm stretches between.
  // Each gust rolls fresh dice: one of the 8 compass directions, and either
  // a straight push or a curling one.
  const DIAG = Math.hypot(w, h) / 2;
  const GUST_W = Math.max(70, w * 0.16); // gaussian half-width of the front
  const RANGE = DIAG + GUST_W * 3; // front travels center +- this
  let gustAng = 0;
  let gdx = 1;
  let gdy = 0;
  let gustCurl = false;
  let gustV = 0;
  let traveled = 0;
  let calm = rand(2, 5); // seconds until the first gust starts
  let t = rand(0, 100); // wind clock; random start so cards differ

  const rollGust = () => {
    gustAng = ((Math.random() * 8) | 0) * (Math.PI / 4);
    gdx = Math.cos(gustAng);
    gdy = Math.sin(gustAng);
    gustCurl = Math.random() < 0.5;
    gustV = rand(w * 0.35, w * 0.55);
    traveled = 0;
  };
  rollGust();

  const gustCenter = (): [number, number] => [
    w / 2 + gdx * (traveled - RANGE),
    h / 2 + gdy * (traveled - RANGE),
  ];

  // Gaussian band perpendicular to the travel direction.
  const gustEnv = (x: number, y: number) => {
    if (calm > 0) return 0;
    const [cx, cy] = gustCenter();
    const d = ((x - cx) * gdx + (y - cy) * gdy) / GUST_W;
    return Math.exp(-d * d);
  };

  // Wind acceleration at a point, px/s^2. The short-wavelength terms matter:
  // force that varies down a strip bends it into S-curves (cloth), uniform
  // force just tilts it whole (a swinging rod). Curling gusts put most of
  // their energy in the ripple, so the cloth swirls; straight gusts shove.
  // Vertical wind is halved so gravity always wins: fabric can float and
  // flutter but never fly upward.
  const windAt = (x: number, y: number): [number, number] => {
    const breeze =
      Math.sin(t * 0.9 + x * 0.03 + y * 0.015) * 55 +
      Math.sin(t * 2.3 + y * 0.035 + x * 0.011) * 28;
    const m =
      gustEnv(x, y) *
      (gustCurl
        ? 600 + 750 * Math.sin(t * 4 + (x + y) * 0.035)
        : 850 + 450 * Math.sin(t * 5 + (x + y) * 0.035));
    return [breeze + gdx * m, gdy * m * 0.5];
  };

  // The pointer is a breeze of its own, and the strongest wind in the scene.
  const mouse = { x: -1e4, y: -1e4, vx: 0, vy: 0, power: 0 };
  let lastMt = -1;
  let lastMx = 0;
  let lastMy = 0;

  const pointerMove = (x: number, y: number, timeStamp: number) => {
    if (lastMt >= 0) {
      const dtm = clamp((timeStamp - lastMt) / 1000, 0.008, 0.05);
      const vx = clamp((x - lastMx) / dtm, -1600, 1600);
      const vy = clamp((y - lastMy) / dtm, -1600, 1600);
      // smooth, so one jittery event can't spike the force
      mouse.vx = mouse.vx * 0.5 + vx * 0.5;
      mouse.vy = mouse.vy * 0.5 + vy * 0.5;
      mouse.power = 1;
    }
    mouse.x = x;
    mouse.y = y;
    lastMx = x;
    lastMy = y;
    lastMt = timeStamp;
  };
  const pointerEnd = () => {
    mouse.power = 0;
    lastMt = -1;
  };

  const winds: WindLine[] = [];

  // Build one wind-line: a gently undulating run, sometimes broken by a
  // loop-the-loop riding on it, all in local coords (travel along +x).
  const spawnLine = (x: number, y: number, ang: number, loopProb: number) => {
    const L = clamp(rand(w * 0.14, w * 0.28), 70, 300);
    const A = rand(5, 12); // undulation amplitude
    const k = (Math.PI * 2) / rand(90, 150);
    const ph = rand(0, Math.PI * 2);
    const loopAt = Math.random() < loopProb ? L * rand(0.45, 0.7) : -1;
    const pts: { x: number; y: number }[] = [];
    let looped = false;
    for (let sx = 0; sx <= L; sx += 6) {
      pts.push({ x: sx, y: Math.sin(sx * k + ph) * A });
      if (!looped && loopAt > 0 && sx >= loopAt) {
        looped = true;
        const r = rand(7, 13);
        const cy = Math.sin(sx * k + ph) * A - r; // loop rides on the line
        for (let a2 = 0.25; a2 < Math.PI * 2; a2 += 0.25) {
          const phi = Math.PI / 2 + a2;
          pts.push({ x: sx + Math.cos(phi) * r, y: cy + Math.sin(phi) * r });
        }
      }
    }
    let total = 0;
    for (let i = 1; i < pts.length; i++)
      total += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    winds.push({
      x,
      y,
      ang,
      pts,
      total,
      seg: total * rand(0.3, 0.45),
      drift: rand(25, 70),
      age: 0,
      ttl: rand(0.9, 1.6),
    });
  };

  const step = (dt: number) => {
    t += dt;
    // The pointer's air pocket dissipates soon after the pointer stops.
    mouse.power *= Math.exp(-dt * 3);
    if (calm > 0) calm -= dt;
    else {
      traveled += gustV * dt;
      if (traveled > RANGE * 2) {
        rollGust();
        calm = rand(9, 18); // gusts are rare events, not a cycle
      }
    }

    const dt2 = dt * dt;
    for (const s of strips) {
      const pts = s.pts;
      // Verlet integration; point 0 stays pinned above the frame.
      for (let k = 1; k < pts.length; k++) {
        const p = pts[k];
        const [wx, wy] = windAt(p.x, p.y);
        let ax = wx;
        let ay = GRAV + wy;
        if (mouse.power > 0.01) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const env =
            Math.exp(-(mdx * mdx + mdy * mdy) / (2 * MOUSE_R * MOUSE_R)) *
            mouse.power;
          // The pointer out-muscles any automatic gust: at full speed this
          // peaks several times the gust's force, but only inside the pocket.
          ax += mouse.vx * 4.5 * env;
          ay += Math.max(0, mouse.vy) * 2.5 * env; // may push down, never up
        }
        const vx = (p.x - p.px) * DAMP;
        const vy = (p.y - p.py) * DAMP;
        p.px = p.x;
        p.py = p.y;
        p.x += vx + ax * dt2;
        p.y += vy + ay * dt2;
      }
      // Distance constraints keep the rope inextensible.
      for (let it = 0; it < 3; it++) {
        pts[0].x = s.pinX;
        pts[0].y = pinY;
        for (let k = 0; k < pts.length - 1; k++) {
          const a = pts[k];
          const b = pts[k + 1];
          let dx = b.x - a.x;
          let dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 1e-6;
          const diff = ((dist - s.seg) / dist) * 0.5;
          dx *= diff;
          dy *= diff;
          if (k === 0) {
            b.x -= dx * 2;
            b.y -= dy * 2;
          } else {
            a.x += dx;
            a.y += dy;
            b.x -= dx;
            b.y -= dy;
          }
        }
      }
      s.scroll += s.flow * dt;
      // Rebuild the arc-length table the glyph placement walks.
      s.cum.length = 1;
      for (let k = 0; k < pts.length - 1; k++) {
        s.cum.push(
          s.cum[k] +
            Math.hypot(pts[k + 1].x - pts[k].x, pts[k + 1].y - pts[k].y)
        );
      }
    }

    // Wind-lines: spawn along the gust front while it crosses the frame.
    if (calm <= 0 && winds.length < 22 && Math.random() < 0.45) {
      const [cx, cy] = gustCenter();
      const off = rand(-DIAG, DIAG); // lateral position along the front
      const x = cx - gdy * off + gdx * rand(-GUST_W, GUST_W * 0.3);
      const y = cy + gdx * off + gdy * rand(-GUST_W, GUST_W * 0.3);
      if (x > -40 && x < w + 40 && y > -40 && y < h + 40)
        spawnLine(x, y, gustAng + rand(-0.12, 0.12), gustCurl ? 0.65 : 0.15);
    }
    // A fast-moving pointer sheds a wake of its own.
    const mSpeed = Math.hypot(mouse.vx, mouse.vy);
    if (
      mouse.power > 0.5 &&
      mSpeed > 350 &&
      winds.length < 30 &&
      Math.random() < 0.3
    ) {
      spawnLine(
        mouse.x + rand(-14, 14),
        mouse.y + rand(-14, 14),
        Math.atan2(mouse.vy, mouse.vx),
        0.3
      );
    }
    for (let i = winds.length - 1; i >= 0; i--) {
      const l = winds[i];
      l.age += dt;
      l.x += Math.cos(l.ang) * l.drift * dt;
      l.y += Math.sin(l.ang) * l.drift * dt;
      const gone =
        l.age > l.ttl ||
        l.x < -340 ||
        l.x > w + 340 ||
        l.y < -340 ||
        l.y > h + 340;
      if (gone) winds.splice(i, 1);
    }
  };

  const posAt = (s: ClothStrip, arc: number): [number, number, number] => {
    const pts = s.pts;
    const cum = s.cum;
    let k = 0;
    while (k < cum.length - 2 && cum[k + 1] < arc) k++;
    const segLen = cum[k + 1] - cum[k] || 1e-6;
    const f = clamp((arc - cum[k]) / segLen, 0, 1);
    const a = pts[k];
    const b = pts[k + 1];
    return [
      a.x + (b.x - a.x) * f,
      a.y + (b.y - a.y) * f,
      Math.atan2(b.y - a.y, b.x - a.x),
    ];
  };

  return { strips, winds, step, posAt, pointerMove, pointerEnd };
}
