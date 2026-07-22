import {
  RocketLaunchIcon,
  BookOpenIcon,
  TagIcon,
  CpuIcon,
  BriefcaseIcon,
  CertificateIcon,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import type { ItemType, SearchItem, PopularResponse } from "@/lib/stores/api";

export const TYPE_META: Record<ItemType, { label: string; Icon: Icon }> = {
  project: { label: "Project", Icon: RocketLaunchIcon },
  blog: { label: "Blog", Icon: BookOpenIcon },
  tag: { label: "Tag", Icon: TagIcon },
  tech: { label: "Tech", Icon: CpuIcon },
  experience: { label: "Experience", Icon: BriefcaseIcon },
  certification: { label: "Certification", Icon: CertificateIcon },
};

// Analytics-driven popularity from /api/popular, flattened across every
// content type into one list ranked by visit count.
type PopularEntry = { type: ItemType; slug: string; count: number };

// Maps an /api/popular section key to its search item type.
const POPULAR_TYPES: Record<keyof PopularResponse, ItemType> = {
  tech: "tech",
  tags: "tag",
  projects: "project",
  blogs: "blog",
};

// Flatten all sections of the /api/popular payload, sort by count descending.
export function parsePopular(data: PopularResponse | undefined): PopularEntry[] {
  const out: PopularEntry[] = [];
  if (data && typeof data === "object") {
    for (const key of Object.keys(POPULAR_TYPES) as (keyof PopularResponse)[]) {
      const list = data[key];
      if (!Array.isArray(list)) continue;
      for (const row of list) {
        if (row?.segment) {
          out.push({ type: POPULAR_TYPES[key], slug: row.segment, count: row.count ?? 0 });
        }
      }
    }
  }
  return out.sort((a, b) => b.count - a.count);
}

// Resolve the analytics ranking back to indexed items, most-visited first.
export function popularItems(items: SearchItem[], popular: PopularEntry[], max = 6): SearchItem[] {
  const seen = new Set<string>();
  const picked: SearchItem[] = [];
  for (const { type, slug } of popular) {
    if (picked.length >= max) break;
    const it = items.find((i) => i.type === type && i.url.endsWith(`/${slug}`));
    if (it && !seen.has(it.url)) {
      seen.add(it.url);
      picked.push(it);
    }
  }
  return picked;
}

// Newest posts + projects by date, for when there's no popularity data yet.
export function latestItems(items: SearchItem[], max = 6): SearchItem[] {
  return items
    .filter((i) => (i.type === "blog" || i.type === "project") && i.date)
    .sort((a, b) => (b.date! < a.date! ? -1 : 1))
    .slice(0, max);
}

export const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function scoreItem(item: SearchItem, tokens: string[]): number {
  const title = item.title.toLowerCase();
  const keywords = (item.keywords ?? []).join(" ").toLowerCase();
  const desc = (item.description ?? "").toLowerCase();
  let total = 0;
  for (const tok of tokens) {
    let s = 0;
    if (title === tok) s = 100;
    else if (title.startsWith(tok)) s = 60;
    else if (new RegExp(`\\b${escapeRegExp(tok)}`).test(title)) s = 45;
    else if (title.includes(tok)) s = 30;
    else if (keywords.includes(tok)) s = 18;
    else if (desc.includes(tok)) s = 8;
    else return -1; // every token must match somewhere
    total += s;
  }
  return total;
}
