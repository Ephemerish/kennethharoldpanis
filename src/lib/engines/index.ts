/**
 * Article engines, the pluggable rendering modes for long-form entries.
 *
 * An "engine" decides how a blog entry is presented. The default `prose`
 * engine renders markdown through <Prose />, exactly as before. The `pretext`
 * engine renders the same article but led by an interactive pretext.js
 * text-measurement playground. More engines can be added over time.
 *
 * To add an engine:
 *   1. register it here (this drives the content schema enum + the card badge),
 *   2. map its key to an Astro component in src/pages/blogs/[slug].astro.
 *
 * Kept dependency-free on purpose so it can be imported from
 * src/content/config.ts, which runs in Astro's content config context.
 */

export type EngineKey = "prose" | "pretext";

export interface EngineMeta {
  key: EngineKey;
  /** Short label shown as a badge on cards and in the article header. */
  label: string;
  /** One-line description of what the engine does. */
  description: string;
  /** Tailwind classes for the badge. Empty string means "no badge". */
  badgeClass: string;
  /** When true, cards/heroes render a live demo cover instead of the image. */
  liveCover?: boolean;
}

export const ENGINES: Record<EngineKey, EngineMeta> = {
  prose: {
    key: "prose",
    label: "Article",
    description: "Standard markdown, rendered through the shared Prose styles.",
    badgeClass: "",
  },
  pretext: {
    key: "pretext",
    label: "pretext.js",
    description:
      "The body text is laid out and revealed with pretext.js, which finds the line breaks by pure arithmetic instead of measuring the DOM.",
    badgeClass: "bg-brand-600 text-neutral-0 border border-brand-700",
    liveCover: true,
  },
};

/** Tuple of engine keys, shaped for z.enum() in the content schema. */
export const ENGINE_KEYS = Object.keys(ENGINES) as [EngineKey, ...EngineKey[]];

export const DEFAULT_ENGINE: EngineKey = "prose";

/** Resolve a (possibly missing/unknown) key to a registered engine. */
export const getEngine = (key?: string | null): EngineMeta =>
  ENGINES[(key as EngineKey) ?? DEFAULT_ENGINE] ?? ENGINES[DEFAULT_ENGINE];

/** Non-default engines with a badge class get a chip on their card/header. */
export const engineHasBadge = (key?: string | null): boolean => {
  const engine = getEngine(key);
  return engine.key !== DEFAULT_ENGINE && engine.badgeClass.length > 0;
};

/** Whether this engine renders a live demo cover instead of a static image. */
export const engineHasLiveCover = (key?: string | null): boolean =>
  !!getEngine(key).liveCover;
