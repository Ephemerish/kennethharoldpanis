/**
 * Entries: projects and posts as one kind of thing. Every list of them, on
 * every page, renders through `toCard`, `EntryCard` and `EntryGrid`. Pure
 * functions, no rendering.
 */
import type { CollectionEntry } from "astro:content";
import { readTime } from "@app/calc/format";

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

/**
 * What a card shows, the same fields for a project and a post (KHP §4.10): a
 * card never branches on the kind, it reads this. A project's status and a
 * post's read time are the only facts one kind has and the other doesn't.
 */
export interface CardData {
  href: string;
  title: string;
  /** The cover: an image under /images, or an engine that draws a live cover. */
  image?: string;
  engine?: string;
  date: Date;
  summary?: string;
  tags: readonly string[];
  /** A project's status, said in words. */
  status?: (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS];
  /** A post's read time ("6 min read"). */
  readTime?: string;
  /** The words of the card's last line. */
  action: string;
}

export function toCard(item: AnyEntry): CardData {
  if (item.kind === "blog") {
    const { data, id, body } = item.entry;
    return {
      href: `/blogs/${id}`,
      title: data.title,
      image: data.image,
      engine: data.engine,
      date: data.pubDate,
      summary: data.description,
      tags: data.tags,
      readTime: readTime(body ?? ""),
      action: "Read post",
    };
  }
  const { data, id } = item.entry;
  return {
    href: `/projects/${id}`,
    title: data.title,
    image: data.image,
    date: data.endDate ?? data.startDate,
    summary: data.description,
    tags: data.tags,
    status: PROJECT_STATUS[data.status],
    action: "View project",
  };
}

/** Wrap a collection's entries as AnyEntry, for a grid. */
export const asProjects = (entries: CollectionEntry<"projects">[]): AnyEntry[] => entries.map((entry) => ({ kind: "project", entry }));
export const asPosts = (entries: CollectionEntry<"blog">[]): AnyEntry[] => entries.map((entry) => ({ kind: "blog", entry }));
