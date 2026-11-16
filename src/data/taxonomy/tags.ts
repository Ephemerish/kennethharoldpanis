/**
 * Tags: the themes that group work (docs/systems/content-registries.md).
 *
 * The rule, so tags and tech never overlap:
 *   - tech is a named tool or platform, with a logo: what was used;
 *   - a tag is a theme: what the work is, across tools;
 *   - a tag groups at least two things, never repeats a technology's name,
 *     and an item carries at most three.
 * scripts/check-taxonomy.mjs fails the build when any of that breaks. Content
 * names tags by slug through the schema; roles and certifications through the
 * `TagSlug` type. Every tag has a /tags page, introduced by its `description`.
 */

export interface Tag {
  slug: string;
  label: string;
  /** One line on what the tag gathers, shown on its page. */
  description: string;
}

export const tags = [
  { slug: "web-app", label: "Web App", description: "Apps that run in the browser, from work and from my own projects." },
  { slug: "side-project", label: "Side Project", description: "Things I build and run on my own time." },
  { slug: "architecture", label: "Architecture", description: "How larger frontends are split, shared and shipped." },
  { slug: "developer-tools", label: "Developer Tools", description: "Tools I tried in earnest, and what I made of them." },
  { slug: "hardware", label: "Hardware", description: "Work with physical devices: boards, radios and computers." },
  { slug: "thesis", label: "Thesis", description: "My undergraduate research and what came out of it." },
  { slug: "education", label: "Education", description: "Where I studied." },
] as const satisfies readonly Tag[];

/** A registered tag's slug. */
export type TagSlug = (typeof tags)[number]["slug"];

const bySlug = new Map<string, Tag>(tags.map((tag) => [tag.slug, tag]));

export const getTagBySlug = (slug: string): Tag | undefined => bySlug.get(slug);

// Display label for a slug, falling back to the slug itself if unregistered.
export const getTagLabel = (slug: string): string => bySlug.get(slug)?.label ?? slug;

export const getAllTagSlugs = (): string[] => tags.map((tag) => tag.slug);
