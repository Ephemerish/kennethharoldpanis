import { defineCollection, z } from "astro:content";
import { getAllTagSlugs } from "../data/tags";

// Tags must be registered slugs in src/data/tags.ts — an unknown or
// misspelled tag fails the build, keeping the vocabulary consistent.
const tagSlugs = getAllTagSlugs() as [string, ...string[]];
const tagsSchema = z.array(z.enum(tagSlugs));

const blogCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    author: z.string(),
    image: z.string(),
    tags: tagsSchema,
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
    tags: tagsSchema,
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

    // The "Overview" card on the project page.
    overview: z
      .object({
        // "Built with": software stack (logo chips) + hardware/tools (plain chips).
        builtWith: z
          .object({
            technology: z.array(z.string()).optional(),
            materials: z.array(z.string()).optional(),
          })
          .optional(),
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
