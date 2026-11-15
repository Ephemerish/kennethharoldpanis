/**
 * Tags: what a project, post, role or certification is about
 * (docs/systems/content-registries.md). Content names tags by `slug` through
 * the schema; experience and certifications through the `TagSlug` type, so a
 * typo fails the check. scripts/check-taxonomy.mjs fails the build on a tag
 * nothing uses. Every tag gets a /tags page.
 *
 * Keep tags about domain / type / topic. Specific stack items belong in a
 * entry's `tech` list (src/app/data/technologies.ts), not here.
 */

export type TagGroup = "domain" | "type" | "topic";

export interface Tag {
  slug: string;
  label: string;
  group: TagGroup;
}

export const tags = [
  // Domain — subject area / industry
  { slug: "maritime-safety", label: "Maritime Safety", group: "domain" },
  { slug: "fintech", label: "Fintech", group: "domain" },
  { slug: "productivity", label: "Productivity", group: "domain" },
  { slug: "cloud", label: "Cloud", group: "domain" },
  { slug: "finops", label: "FinOps", group: "domain" },

  // Type — what kind of thing it is
  { slug: "web-app", label: "Web App", group: "type" },
  { slug: "mobile-app", label: "Mobile App", group: "type" },
  { slug: "hardware", label: "Hardware", group: "type" },
  { slug: "thesis", label: "Thesis", group: "type" },
  { slug: "side-project", label: "Side Project", group: "type" },
  { slug: "beta", label: "Beta", group: "type" },
  { slug: "education", label: "Education", group: "type" },

  // Topic — concept, technique, tool, or feature
  { slug: "emergency-response", label: "Emergency Response", group: "topic" },
  { slug: "gps-tracking", label: "GPS Tracking", group: "topic" },
  { slug: "microcontroller", label: "Microcontroller", group: "topic" },
  { slug: "budgeting", label: "Budgeting", group: "topic" },
  { slug: "50-30-20", label: "50/30/20", group: "topic" },
  { slug: "automation", label: "Automation", group: "topic" },
  { slug: "workflow", label: "Workflow", group: "topic" },
  { slug: "integration", label: "Integration", group: "topic" },
  { slug: "developer-tools", label: "Developer Tools", group: "topic" },
  { slug: "micro-frontends", label: "Micro Frontends", group: "topic" },
  { slug: "architecture", label: "Architecture", group: "topic" },
  { slug: "performance", label: "Performance", group: "topic" },
  { slug: "focus", label: "Focus", group: "topic" },
  { slug: "collaboration", label: "Collaboration", group: "topic" },
] as const satisfies readonly Tag[];

/** A registered tag's slug. */
export type TagSlug = (typeof tags)[number]["slug"];

const bySlug = new Map<string, Tag>(tags.map((tag) => [tag.slug, tag]));

export const getTagBySlug = (slug: string): Tag | undefined => bySlug.get(slug);

// Display label for a slug, falling back to the slug itself if unregistered.
export const getTagLabel = (slug: string): string => bySlug.get(slug)?.label ?? slug;

export const getAllTagSlugs = (): string[] => tags.map((tag) => tag.slug);
