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
    category: z.enum(["web", "mobile", "hardware", "iot", "ai-ml", "game", "desktop", "thesis", "research"]),
    demoUrl: z.string().optional(),
    videoUrl: z.string().optional(),
    githubUrl: z.string().optional(),
    featured: z.boolean().default(false),
    status: z.enum(["completed", "in-progress", "planned"]),
    startDate: z.date(),
    endDate: z.date().optional(),
    challenges: z.array(z.string()).optional(),
    technologies: z.array(z.string()).optional(),
    keyFeatures: z.array(z.string()).optional(),
    team: z.array(z.string()).optional(),
    institution: z.string().optional(),
    supervisor: z.string().optional(),
    researchArea: z.string().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
  projects: projectCollection,
};
