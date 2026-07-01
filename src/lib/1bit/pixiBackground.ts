/**
 * PixiJS controller for the procedural, live-building 1-bit map background.
 *
 * It runs the generation PIPELINE (water -> nature -> ...; see ./stages) against
 * a shared world, then reveals each stage's tiles progressively so a visitor
 * watches the world assemble: the water appears first, then nature grows on top,
 * and so on. The Bountiful Bits pack has no ground tile, so the ground is a flat
 * colour we fill (or transparent). Each layer is tinted independently.
 *
 * Pixels stay crisp (nearest-neighbour, integer scale) and share one texture
 * source, so Pixi batches them. Once the build animation finishes the ticker
 * stops, so idle CPU cost returns to ~zero.
 *
 * This module statically imports `pixi.js`; import it dynamically from the call
 * site (e.g. inside a React effect) so Pixi lands in a lazy-loaded chunk.
 */

import {
  Application,
  Assets,
  Container,
  Graphics,
  Rectangle,
  Sprite,
  Texture,
  type TextureSource,
} from "pixi.js";

import { NATURE_SHEET } from "./bountiful-bits";
import { makeRng } from "./rng";
import { createWorld, type LayerName, type MapTuning, type PlacedTile } from "./world";
import { PIPELINE } from "./stages";

const TILE = NATURE_SHEET.tileSize;

export interface BackgroundOptions {
  /** Seed for deterministic layout (number or human-readable string). */
  seed?: number | string;
  /** Integer pixel scale for each tile (2 -> 20px tiles). */
  scale?: number;
  /** Overall opacity of the whole background (0..1). */
  opacity?: number;

  /** Flat ground colour on a light page (0xRRGGBB), or null for transparent. */
  groundLightColor?: number | null;
  /** Flat ground colour in dark theme, or null. */
  groundDarkColor?: number | null;

  /** Per-layer tints (0xRRGGBB), light theme. */
  waterLightTint?: number;
  natureLightTint?: number;
  roadLightTint?: number;
  civLightTint?: number;
  /** Per-layer tints, dark theme. */
  waterDarkTint?: number;
  natureDarkTint?: number;
  roadDarkTint?: number;
  civDarkTint?: number;

  /** Animate the staged build on first load. */
  animate?: boolean;
  /** How long each stage takes to reveal (ms). */
  stageRevealMs?: number;
  /** Pause between stages (ms). */
  stageGapMs?: number;
  /** Per-tile fade-in duration (ms). */
  tileFadeMs?: number;

  /** Map tuning (see MapTuning). */
  waterAmount?: number;
  riverAmount?: number;
  forestFreq?: number;
  meadowFreq?: number;
  treeLine?: number;
  lushness?: number;
}

export interface BackgroundHandle {
  /** Re-roll with a fresh seed and replay the build animation. */
  regenerate(): void;
  /** Tear everything down and remove the canvas. */
  destroy(): void;
}

const DEFAULTS = {
  seed: "0101010" as number | string,
  scale: 2,
  opacity: 1,

  groundLightColor: null as number | null,
  groundDarkColor: null as number | null,

  // Water reads slightly cooler; other layers neutral grey. Tune freely.
  waterLightTint: 0x8f9db4,
  natureLightTint: 0x9a9a9a,
  roadLightTint: 0xb0a48f,
  civLightTint: 0x8a8a8a,
  waterDarkTint: 0x3a4152,
  natureDarkTint: 0x565660,
  roadDarkTint: 0x4a4436,
  civDarkTint: 0x60606a,

  animate: true,
  stageRevealMs: 900,
  stageGapMs: 250,
  tileFadeMs: 260,

  waterAmount: 0.07,
  riverAmount: 0.7,
  forestFreq: 5,
  meadowFreq: 5,
  treeLine: 0.6,
  lushness: 1,
};

const RESIZE_DEBOUNCE_MS: number = 150;

function isDarkTheme(): boolean {
  return document.documentElement.classList.contains("dark");
}

function prefersReducedMotion(): boolean {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

function viewportSize() {
  return {
    width: Math.max(1, window.innerWidth),
    height: Math.max(1, window.innerHeight),
  };
}

export async function createBackground(
  container: HTMLElement,
  options: BackgroundOptions = {},
): Promise<BackgroundHandle> {
  const opts = { ...DEFAULTS, ...options };
  const tilePx = TILE * opts.scale;
  const tuning: MapTuning = {
    waterAmount: opts.waterAmount,
    riverAmount: opts.riverAmount,
    forestFreq: opts.forestFreq,
    meadowFreq: opts.meadowFreq,
    treeLine: opts.treeLine,
    lushness: opts.lushness,
  };

  let destroyed = false;
  let seed = opts.seed;

  // --- Pixi application -----------------------------------------------------
  const { width, height } = viewportSize();
  const app = new Application();
  await app.init({
    width,
    height,
    backgroundAlpha: 0,
    antialias: false,
    autoDensity: true,
    resolution: Math.min(2, Math.max(1, Math.round(window.devicePixelRatio || 1))),
    preference: "webgl",
    powerPreference: "low-power",
  });

  if (destroyed) {
    app.destroy({ removeView: true }, { children: true });
    throw new Error("bit1: background destroyed during init");
  }

  app.ticker.stop(); // we run the ticker only during the build animation
  const canvas = app.canvas;
  canvas.style.display = "block";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.imageRendering = "pixelated";
  container.appendChild(canvas);

  const onContextLost = (e: Event) => e.preventDefault();
  const onContextRestored = () => {
    if (!destroyed) rebuild(false);
  };
  canvas.addEventListener("webglcontextlost", onContextLost, false);
  canvas.addEventListener("webglcontextrestored", onContextRestored, false);

  // --- Texture atlas --------------------------------------------------------
  const sheet: Texture = await Assets.load(NATURE_SHEET.url);
  if (destroyed) {
    app.destroy({ removeView: true }, { children: true });
    throw new Error("bit1: background destroyed during asset load");
  }
  const source: TextureSource = sheet.source;
  source.scaleMode = "nearest";

  const frameCache = new Map<number, Texture>();
  function frameTexture(col: number, row: number): Texture {
    const key = row * 100 + col;
    let tex = frameCache.get(key);
    if (!tex) {
      tex = new Texture({
        source,
        frame: new Rectangle(col * TILE, row * TILE, TILE, TILE),
      });
      frameCache.set(key, tex);
    }
    return tex;
  }

  // --- Layers ---------------------------------------------------------------
  const ground = new Graphics();
  const layers: Record<LayerName, Container> = {
    water: new Container(),
    nature: new Container(),
    road: new Container(),
    civ: new Container(),
  };
  app.stage.addChild(ground, layers.water, layers.nature, layers.road, layers.civ);

  function tintFor(layer: LayerName): number {
    const dark = isDarkTheme();
    switch (layer) {
      case "water":
        return dark ? opts.waterDarkTint : opts.waterLightTint;
      case "nature":
        return dark ? opts.natureDarkTint : opts.natureLightTint;
      case "road":
        return dark ? opts.roadDarkTint : opts.roadLightTint;
      case "civ":
        return dark ? opts.civDarkTint : opts.civLightTint;
    }
  }

  // Sprites currently on screen, with their layer + scheduled reveal time.
  interface Anim {
    sprite: Sprite;
    layer: LayerName;
    revealAt: number;
  }
  let anim: Anim[] = [];
  let elapsed = 0;
  let animating = false;

  function drawGround(w: number, h: number) {
    ground.clear();
    const color = isDarkTheme() ? opts.groundDarkColor : opts.groundLightColor;
    if (color !== null && color !== undefined) ground.rect(0, 0, w, h).fill(color);
  }

  function clearLayers() {
    for (const key of Object.keys(layers) as LayerName[]) {
      layers[key].removeChildren().forEach((c) => c.destroy());
    }
    anim = [];
  }

  function render() {
    if (!destroyed) app.renderer.render(app.stage);
  }

  /** Build every stage, create sprites, and schedule their reveal. */
  function rebuild(withAnimation: boolean) {
    stopTicker();
    clearLayers();

    const { width: w, height: h } = viewportSize();
    drawGround(w, h);

    const world = createWorld(w, h, tilePx, makeRng(seed), tuning);
    const doAnimate = withAnimation && opts.animate && !prefersReducedMotion();

    let stageStart = 0;
    for (const stage of PIPELINE) {
      const tiles: PlacedTile[] = stage.build(world);
      // Reveal each stage as a diagonal sweep.
      tiles.sort((a, b) => a.x + a.y - (b.x + b.y));

      const tint = tintFor(stage.name);
      const n = Math.max(1, tiles.length);
      for (let i = 0; i < tiles.length; i++) {
        const t = tiles[i];
        const sprite = new Sprite(frameTexture(t.col, t.row));
        sprite.x = t.x;
        sprite.y = t.y;
        sprite.scale.set(opts.scale);
        sprite.roundPixels = true;
        sprite.tint = tint;
        sprite.alpha = doAnimate ? 0 : opts.opacity;
        layers[t.layer].addChild(sprite);
        anim.push({
          sprite,
          layer: t.layer,
          revealAt: stageStart + (i / n) * opts.stageRevealMs,
        });
      }
      stageStart += opts.stageRevealMs + opts.stageGapMs;
    }

    if (doAnimate) startTicker();
    else render();
  }

  function tick() {
    elapsed += app.ticker.deltaMS;
    let done = true;
    for (const a of anim) {
      const p = (elapsed - a.revealAt) / opts.tileFadeMs;
      const alpha = p <= 0 ? 0 : p >= 1 ? 1 : p;
      a.sprite.alpha = alpha * opts.opacity;
      if (alpha < 1) done = false;
    }
    render();
    if (done) stopTicker();
  }

  function startTicker() {
    elapsed = 0;
    animating = true;
    app.ticker.add(tick);
    app.ticker.start();
  }

  function stopTicker() {
    if (!animating) return;
    animating = false;
    app.ticker.remove(tick);
    app.ticker.stop();
  }

  rebuild(true);

  // --- Resize (rebuild, no replay) -----------------------------------------
  let resizeTimer: ReturnType<typeof setTimeout> | undefined;
  function onResize() {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (destroyed) return;
      const { width: w, height: h } = viewportSize();
      app.renderer.resize(w, h);
      rebuild(false);
    }, RESIZE_DEBOUNCE_MS);
  }
  window.addEventListener("resize", onResize);

  // --- Theme changes: re-tint + re-colour ground ---------------------------
  const themeObserver = new MutationObserver(() => {
    if (destroyed) return;
    const { width: w, height: h } = viewportSize();
    drawGround(w, h);
    for (const a of anim) a.sprite.tint = tintFor(a.layer);
    render();
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  return {
    regenerate() {
      if (destroyed) return;
      seed = (Math.random() * 0xffffffff) >>> 0;
      rebuild(true);
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      stopTicker();
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      themeObserver.disconnect();
      for (const tex of frameCache.values()) tex.destroy(false);
      frameCache.clear();
      app.destroy({ removeView: true }, { children: true });
    },
  };
}
