import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getTagBySlug } from "../data/tags";
import { getTechBySlug, techSlug } from "../data/technologies";

export const prerender = true;

/**
 * One flat index for the global command palette: projects, blog posts, and
 * every tag / tech actually in use (with usage counts). Built once at build
 * time and fetched lazily by the search island on first open.
 */
export const GET: APIRoute = async () => {
  const [projects, blogs] = await Promise.all([
    getCollection("projects"),
    getCollection("blog"),
  ]);

  const tagCounts = new Map<string, number>();
  const techCounts = new Map<string, number>();
  const bump = (m: Map<string, number>, k: string) => m.set(k, (m.get(k) ?? 0) + 1);

  type Item = {
    type: "project" | "blog" | "tag" | "tech";
    title: string;
    url: string;
    description?: string;
    keywords?: string[];
    group?: string;
    count?: number;
    imagePath?: string;
    // ISO date for blog/project items, so the search island can show "Latest".
    date?: string;
  };

  const items: Item[] = [];

  for (const p of projects) {
    p.data.tags.forEach((t) => bump(tagCounts, t));
    p.data.tech.forEach((t) => bump(techCounts, techSlug(t)));
    items.push({
      type: "project",
      title: p.data.title,
      url: `/projects/${p.slug}`,
      description: p.data.description,
      keywords: [...p.data.tags, ...p.data.tech],
      date: (p.data.endDate ?? p.data.startDate).toISOString(),
    });
  }

  for (const b of blogs) {
    b.data.tags.forEach((t) => bump(tagCounts, t));
    b.data.tech.forEach((t) => bump(techCounts, techSlug(t)));
    items.push({
      type: "blog",
      title: b.data.title,
      url: `/blogs/${b.slug}`,
      description: b.data.description,
      keywords: [...b.data.tags, ...b.data.tech],
      date: b.data.pubDate.toISOString(),
    });
  }

  for (const [slug, count] of tagCounts) {
    const tag = getTagBySlug(slug);
    items.push({
      type: "tag",
      title: tag?.label ?? slug,
      url: `/tags/${slug}`,
      group: tag?.group,
      count,
    });
  }

  for (const [slug, count] of techCounts) {
    const tech = getTechBySlug(slug);
    items.push({
      type: "tech",
      title: tech?.name ?? slug,
      url: `/tech/${slug}`,
      group: tech?.category,
      count,
      imagePath: tech?.imagePath,
    });
  }

  return new Response(JSON.stringify(items), {
    headers: { "Content-Type": "application/json" },
  });
};
