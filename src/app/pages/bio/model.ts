/**
 * The bio's sums (no rendering): what a role used, and the facts the summary
 * card shows. All from src/data, so the bio can't drift from the data.
 */
import type { CollectionEntry } from "astro:content";
import type { TimelineEntry } from "@data/bio/experience";

/**
 * Every technology used in a role: its own list, plus the tech of the project
 * or post it produced, in that order and without repeats.
 */
export function techUsed(role: TimelineEntry, entries: (CollectionEntry<"blog"> | CollectionEntry<"projects">)[]): string[] {
  const work = entries.find((entry) => {
    const base = entry.collection === "blog" ? "/blogs/" : "/projects/";
    return role.href === base + entry.id;
  });
  const seen = new Map<string, string>();
  for (const name of [...(role.tech ?? []), ...(work?.data.tech ?? [])]) {
    if (!seen.has(name.toLowerCase())) seen.set(name.toLowerCase(), name);
  }
  return [...seen.values()];
}
