/**
 * Article engines: how a blog post is presented (docs/systems/article-engines.md).
 *
 * `prose` renders markdown through <Prose />. `pretext` lays the body out with
 * pretext.js and leads with a live cover. To add an engine, register it here
 * (this drives the content schema) and map its key in
 * src/app/pages/blogs/[slug]/BlogPost.astro.
 *
 * Dependency-free on purpose: src/content.config.ts imports it.
 */

export type EngineKey = "prose" | "pretext";

export interface EngineMeta {
  key: EngineKey;
  /** What the engine does, in one line. */
  description: string;
  /** Cards and article heads show a live demo instead of the cover image. */
  liveCover?: boolean;
}

export const ENGINES: Record<EngineKey, EngineMeta> = {
  prose: {
    key: "prose",
    description: "Markdown, rendered through the shared Prose styles.",
  },
  pretext: {
    key: "pretext",
    description:
      "The body is laid out with pretext.js, which finds line breaks by arithmetic instead of measuring the DOM.",
    liveCover: true,
  },
};

/** Engine keys, shaped for z.enum() in the content schema. */
export const ENGINE_KEYS = Object.keys(ENGINES) as [EngineKey, ...EngineKey[]];

export const DEFAULT_ENGINE: EngineKey = "prose";

/** Whether this engine shows a live demo cover instead of the image. */
export const engineHasLiveCover = (key?: string | null): boolean =>
  !!ENGINES[(key as EngineKey) ?? DEFAULT_ENGINE]?.liveCover;
