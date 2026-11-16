/**
 * Holds the tag and tech system to its rule (docs/systems/content-registries.md,
 * src/data/taxonomy/tags.ts). Fails the build when:
 *   - a technology is attached to nothing (projects, posts, roles and
 *     certifications all count), so every /tech page has real work behind it;
 *   - a tag groups fewer than two things: a tag that leads to one item is noise;
 *   - a tag repeats a technology's name: that is what tech is for;
 *   - an item carries more than three tags, or neither a tag nor a technology;
 *   - a project or post has no tag (the content schema also requires one);
 *   - anything names an unregistered tag or technology;
 *   - two roles or certifications share an anchor slug.
 * Logo files and their visibility are checked by check-assets.mjs.
 * Run with type stripping: it imports the registries themselves, not a copy.
 */
import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { technologies } from "../src/data/taxonomy/technologies.ts";
import { tags } from "../src/data/taxonomy/tags.ts";
import { timeline } from "../src/data/bio/experience.ts";
import { certifications } from "../src/data/bio/certifications.ts";

const root = resolve(import.meta.dirname, "..");
const problems = [];

/** Reads `key: [...]` from frontmatter; a list it cannot read is a problem. */
function frontmatterList(frontmatter, key, where) {
  const line = frontmatter.match(new RegExp(`^${key}:(.*)$`, "m"));
  if (!line) return [];
  try {
    return JSON.parse(line[1].trim().replace(/'/g, '"'));
  } catch {
    problems.push(`${where}: write ${key} on one line, as [..., ...], so it can be checked.`);
    return [];
  }
}

const items = [];
for (const dir of ["projects", "blog"]) {
  const folder = join(root, "src/data/content", dir);
  for (const file of (await readdir(folder)).filter((f) => /\.mdx?$/.test(f))) {
    const frontmatter = (await readFile(join(folder, file), "utf8")).split("---")[1] ?? "";
    const where = `src/data/content/${dir}/${file}`;
    items.push({ where, tags: frontmatterList(frontmatter, "tags", where), tech: frontmatterList(frontmatter, "tech", where) });
  }
}
for (const r of timeline) items.push({ where: `experience "${r.slug}"`, tags: r.tags ?? [], tech: r.tech ?? [], bio: true });
for (const c of certifications) items.push({ where: `certification "${c.slug}"`, tags: c.tags ?? [], tech: c.tech ?? [], bio: true });

const MIN_TAG_USES = 2;
const MAX_TAGS = 3;
const tagUses = new Map();

const techNames = new Map(technologies.map((t) => [t.name.toLowerCase(), t.name]));
const tagSlugs = new Set(tags.map((t) => t.slug));
const usedTech = new Set();

for (const item of items) {
  if (!item.bio && item.tags.length === 0) problems.push(`${item.where} has no tags. Give it at least one from src/data/taxonomy/tags.ts.`);
  if (item.tags.length === 0 && item.tech.length === 0) problems.push(`${item.where} has neither a tag nor a technology, so nothing links to it.`);
  if (item.tags.length > MAX_TAGS) problems.push(`${item.where} has ${item.tags.length} tags; keep the ${MAX_TAGS} that matter most.`);
  for (const tag of item.tags) tagUses.set(tag, (tagUses.get(tag) ?? 0) + 1);
  for (const tag of item.tags) {
    if (!tagSlugs.has(tag)) problems.push(`${item.where} uses unregistered tag "${tag}". Add it to src/data/taxonomy/tags.ts.`);
  }
  for (const name of item.tech) {
    if (!techNames.has(name.toLowerCase())) problems.push(`${item.where} uses unregistered tech "${name}". Add it to src/data/taxonomy/technologies.ts.`);
    usedTech.add(name.toLowerCase());
  }
}

for (const tech of technologies) {
  if (!usedTech.has(tech.name.toLowerCase()))
    problems.push(`Technology "${tech.name}" is attached to nothing. Add it to the tech of a project, post, role or certification it belongs to, or remove it.`);
}
for (const tag of tags) {
  const uses = tagUses.get(tag.slug) ?? 0;
  if (uses < MIN_TAG_USES)
    problems.push(`Tag "${tag.slug}" groups ${uses} item${uses === 1 ? "" : "s"}; a tag must group at least ${MIN_TAG_USES}. Attach it where it fits, or remove it.`);
  if (techNames.has(tag.label.toLowerCase()) || techNames.has(tag.slug.toLowerCase()))
    problems.push(`Tag "${tag.slug}" repeats a technology's name. Use the technology instead.`);
}

const anchors = [...timeline.map((r) => r.slug), ...certifications.map((c) => c.slug)];
for (const slug of new Set(anchors.filter((s, i) => anchors.indexOf(s) !== i)))
  problems.push(`Two bio records share the anchor "${slug}".`);

if (problems.length) {
  console.error(`\nTaxonomy check failed (${problems.length}):\n  - ${problems.join("\n  - ")}\n`);
  process.exit(1);
}
console.log(`Taxonomy OK: ${technologies.length} technologies, each used; ${tags.length} tags, each grouping ${MIN_TAG_USES} or more; ${items.length} items checked.`);
