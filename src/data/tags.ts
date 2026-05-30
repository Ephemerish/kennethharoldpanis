/**
 * Tags Data
 *
 * Single source of truth for content tags (mirrors technologies.ts).
 * Frontmatter references a tag by its `slug`; the UI shows its `label`.
 * The blog/project schema validates tags against this list, so an unknown
 * or misspelled tag fails the build. Add a tag here before using it.
 *
 * Keep tags about domain / type / topic. Specific stack items belong in a
 * project's `overview.builtWith`, not here, to avoid duplicating the tech list.
 */

export type TagGroup = "domain" | "type" | "topic";

export interface Tag {
  slug: string;
  label: string;
  group: TagGroup;
}

export const tags: Tag[] = [
  // Domain — subject area / industry
  { slug: "maritime-safety", label: "Maritime Safety", group: "domain" },
  { slug: "personal-finance", label: "Personal Finance", group: "domain" },
  { slug: "fintech", label: "Fintech", group: "domain" },

  // Type — what kind of thing it is
  { slug: "web-app", label: "Web App", group: "type" },
  { slug: "mobile-app", label: "Mobile App", group: "type" },
  { slug: "hardware", label: "Hardware", group: "type" },
  { slug: "thesis", label: "Thesis", group: "type" },
  { slug: "side-project", label: "Side Project", group: "type" },
  { slug: "beta", label: "Beta", group: "type" },

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
  { slug: "n8n", label: "n8n", group: "topic" },
  { slug: "micro-frontends", label: "Micro Frontends", group: "topic" },
  { slug: "architecture", label: "Architecture", group: "topic" },
  { slug: "module-federation", label: "Module Federation", group: "topic" },
  { slug: "nx", label: "Nx", group: "topic" },
];

const bySlug = new Map(tags.map((tag) => [tag.slug, tag]));

export const getTagBySlug = (slug: string): Tag | undefined => bySlug.get(slug);

// Display label for a slug, falling back to the slug itself if unregistered.
export const getTagLabel = (slug: string): string => bySlug.get(slug)?.label ?? slug;

export const getAllTagSlugs = (): string[] => tags.map((tag) => tag.slug);

export const getTagsByGroup = (group: TagGroup): Tag[] =>
  tags.filter((tag) => tag.group === group);
