import { defineCollection, z } from "astro:content";
const blogCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    author: z.string(),
    image: z.string(),
    tags: z.array(z.string()),
  }),
});

const projectCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    gallery: z.array(z.string()).optional(),
    tags: z.array(z.string()),
    // "Built with" is rendered in two parts in the Overview card:
    //   technologies -> "Technology" (shown as logo chips via getTechByName)
    //   materials    -> "Materials & tools" (shown as plain chips)
    // Use technologies for software/stack; materials for hardware/tools.
    technologies: z.array(z.string()).optional(),
    demoUrl: z.string().optional(),
    githubUrl: z.string().optional(),
    featured: z.boolean().default(false),
    status: z.enum(["completed", "in-progress", "planned"]),
    startDate: z.date(),
    endDate: z.date().optional(),
    challenges: z.array(z.string()).optional(),
    materials: z.array(z.string()).optional(),
    keyFeatures: z.array(z.string()).optional(),
    team: z.array(z.string()).optional(),
  }),
});

export const collections = {
  blog: blogCollection,
  projects: projectCollection,
};
