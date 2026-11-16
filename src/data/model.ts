/**
 * The data model: the fields everything the site lists shares, under one name
 * each (docs/GLOSSARY.md, "Field names"). Projects and posts carry them in
 * their frontmatter (src/content.config.ts); roles, schools and certifications
 * in src/data/bio/. Data holds facts only, never a component or a style.
 */
import type { TagSlug } from "./taxonomy/tags";
import type { TechName } from "./taxonomy/technologies";

export interface Listed {
  /** Its URL part, or its anchor on /bio. */
  slug: string;
  title: string;
  /** One or two sentences about it, in the owner's words. */
  description: string;
  /** Under public/; a cover, a logo or a badge. Without one, the page shows the name's initials. */
  image?: string;
  tags: TagSlug[];
  tech: TechName[];
}
