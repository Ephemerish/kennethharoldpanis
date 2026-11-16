/**
 * Entries: blog posts and projects as one kind of thing, for pages that list
 * both (tag and tech pages). Pure functions, no rendering.
 */
import type { CollectionEntry } from "astro:content";

export type AnyEntry =
  | { kind: "blog"; entry: CollectionEntry<"blog"> }
  | { kind: "project"; entry: CollectionEntry<"projects"> };

/** Blogs file under their publish date; projects under end, else start. */
export function entryDate(item: AnyEntry): Date {
  if (item.kind === "blog") return item.entry.data.pubDate;
  return item.entry.data.endDate ?? item.entry.data.startDate;
}

export const newestFirst = (a: AnyEntry, b: AnyEntry) => entryDate(b).valueOf() - entryDate(a).valueOf();

/** A project's status, said the same way on its card and its page. */
export const PROJECT_STATUS: Record<
  CollectionEntry<"projects">["data"]["status"],
  { label: string; variant: "success" | "warning" | "neutral" }
> = {
  completed: { label: "Completed", variant: "success" },
  "in-progress": { label: "In Progress", variant: "warning" },
  planned: { label: "Planned", variant: "neutral" },
};

/** Featured projects first, then newest by end (else start) date. */
export function sortProjects(projects: CollectionEntry<"projects">[]) {
  return [...projects].sort(
    (a, b) =>
      Number(b.data.featured) - Number(a.data.featured) ||
      (b.data.endDate ?? b.data.startDate).valueOf() - (a.data.endDate ?? a.data.startDate).valueOf()
  );
}

/** Newest post first. */
export function sortPosts(posts: CollectionEntry<"blog">[]) {
  return [...posts].sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Cards in the first row of a grid: above the fold, so their covers load first. */
export const FIRST_ROW = 3;
