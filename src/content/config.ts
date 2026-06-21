import { defineCollection, z } from "astro:content";
import { getAllTagSlugs } from "../data/tags";
import { getAllTechNames } from "../data/technologies";
import { ENGINE_KEYS, DEFAULT_ENGINE } from "../lib/engines";

// Tags must be registered slugs in src/data/tags.ts — an unknown or
// misspelled tag fails the build, keeping the vocabulary consistent.
// Every entry needs at least one tag.
const tagSlugs = getAllTagSlugs() as [string, ...string[]];
const tagsSchema = z.array(z.enum(tagSlugs)).min(1, "Add at least one tag.");

// Tech must be a name registered in src/data/technologies.ts (case-insensitive),
// so it resolves to a logo + /tech page. Every entry needs at least one.
const techNames = new Set(getAllTechNames().map((name) => name.toLowerCase()));
const techSchema = z
  .array(z.string())
  .min(1, "Add at least one technology.")
  .refine(
    (arr) => arr.every((t) => techNames.has(t.toLowerCase())),
    (arr) => ({
      message: `Unknown tech: ${arr
        .filter((t) => !techNames.has(t.toLowerCase()))
        .join(", ")}. Register it in src/data/technologies.ts.`,
    })
  );

const blogCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    author: z.string(),
    image: z.string(),
    description: z.string().optional(),
    tags: tagsSchema,
    tech: techSchema,
    // Which renderer presents this post. Defaults to the markdown engine, so
    // every existing post is unaffected. See src/lib/engines.
    engine: z.enum(ENGINE_KEYS).default(DEFAULT_ENGINE),
  }),
});

const projectCollection = defineCollection({
  type: "content",
  schema: z.object({
    // Identity + listing — read by the cards and the sort/filter logic.
    title: z.string(),
    description: z.string(),
    image: z.string(),
    gallery: z.array(z.string()).optional(),
    // Shared with blogs: at least one tag + one tech, shown the same way.
    tags: tagsSchema,
    tech: techSchema,
    featured: z.boolean().default(false),
    status: z.enum(["completed", "in-progress", "planned"]),
    startDate: z.date(),
    endDate: z.date().optional(),

    // Outbound links — UI: "Visit Live Site" / "View Code".
    links: z
      .object({
        live: z.string().optional(),
        code: z.string().optional(),
      })
      .optional(),

    // Project-only detail shown in the "Overview" card (tech lives top-level).
    overview: z
      .object({
        materials: z.array(z.string()).optional(), // hardware / tools, plain chips
        keyFeatures: z.array(z.string()).optional(),
        challenges: z.array(z.string()).optional(),
        team: z.array(z.string()).optional(),
        // Theses / research only.
        academic: z
          .object({
            institution: z.string().optional(),
            supervisor: z.string().optional(),
            researchArea: z.string().optional(),
          })
          .optional(),
      })
      .optional(),
  }),
});

export const collections = {
  blog: blogCollection,
  projects: projectCollection,
};
