/**
 * The taxonomy: every thing on the site that carries tags and tech, in one
 * list (docs/systems/content-registries.md). Tag pages, tech pages, the
 * sitemap and search read it, so they can never disagree about what exists.
 *
 * Projects and posts come from the content collections; roles and
 * certifications from src/data/bio. Each knows its tags, its tech and where
 * it lives on the site.
 */
import { getCollection, type CollectionEntry } from "astro:content";
import { timeline, type TimelineEntry } from "@data/bio/experience";
import { certifications, type Certification } from "@data/bio/certifications";
import { techSlug } from "@data/taxonomy/technologies";
import { newestFirst, type AnyEntry } from "@app/features/entries/model";

export type BioRecord =
  | { kind: "experience"; record: TimelineEntry }
  | { kind: "certification"; record: Certification };

export type TaxonomyItem = AnyEntry | BioRecord;

export const tagsOf = (item: TaxonomyItem): readonly string[] =>
  "entry" in item ? item.entry.data.tags : (item.record.tags ?? []);

export const techOf = (item: TaxonomyItem): readonly string[] =>
  "entry" in item ? item.entry.data.tech : (item.record.tech ?? []);

/** Where an item lives: its page, or its card on /bio. */
export const hrefOf = (item: TaxonomyItem): string => {
  if (item.kind === "blog") return `/blogs/${item.entry.id}`;
  if (item.kind === "project") return `/projects/${item.entry.id}`;
  return `/bio#${item.record.slug}`;
};

export interface Taxonomy {
  entries: AnyEntry[];
  bio: BioRecord[];
  /** Every tag slug some item uses. */
  tagSlugs: Set<string>;
  /** Every tech slug some item uses. */
  techSlugs: Set<string>;
  withTag(slug: string): { entries: AnyEntry[]; bio: BioRecord[] };
  withTech(slug: string): { entries: AnyEntry[]; bio: BioRecord[] };
}

export async function loadTaxonomy(): Promise<Taxonomy> {
  const [projects, posts] = await Promise.all([getCollection("projects"), getCollection("blog")]);
  const entries: AnyEntry[] = [
    ...projects.map((entry: CollectionEntry<"projects">) => ({ kind: "project" as const, entry })),
    ...posts.map((entry: CollectionEntry<"blog">) => ({ kind: "blog" as const, entry })),
  ].sort(newestFirst);
  const bio: BioRecord[] = [
    ...timeline.map((record) => ({ kind: "experience" as const, record })),
    ...certifications.map((record) => ({ kind: "certification" as const, record })),
  ];
  const all: TaxonomyItem[] = [...entries, ...bio];

  const hasTag = (slug: string) => (item: TaxonomyItem) => tagsOf(item).includes(slug);
  const hasTech = (slug: string) => (item: TaxonomyItem) => techOf(item).some((name) => techSlug(name) === slug);

  return {
    entries,
    bio,
    tagSlugs: new Set(all.flatMap((item) => tagsOf(item))),
    techSlugs: new Set(all.flatMap((item) => techOf(item).map(techSlug))),
    withTag: (slug) => ({ entries: entries.filter(hasTag(slug)), bio: bio.filter(hasTag(slug)) }),
    withTech: (slug) => ({ entries: entries.filter(hasTech(slug)), bio: bio.filter(hasTech(slug)) }),
  };
}
