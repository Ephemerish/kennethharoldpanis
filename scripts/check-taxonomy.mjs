/**
 * Holds the tag and tech system together (docs/systems/content-registries.md).
 * Fails the build when:
 *   - a registered technology or tag is attached to nothing (projects, posts,
 *     roles and certifications all count), so every /tech and /tags page has
 *     something real behind it;
 *   - a project, post, role or certification names a tag or tech that is not
 *     registered, or carries no tag at all;
 *   - a technology's logo file is missing;
 *   - two roles or certifications share an anchor slug.
 * Run with type stripping: it imports the registries themselves, not a copy.
 */
import { readdir, readFile, access } from "node:fs/promises";
import { join, resolve } from "node:path";
import { technologies } from "../src/app/data/technologies.ts";
import { tags } from "../src/app/data/tags.ts";
import { timeline } from "../src/app/data/experience.ts";
import { certifications } from "../src/app/data/certifications.ts";

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
  const folder = join(root, "src/content", dir);
  for (const file of (await readdir(folder)).filter((f) => /\.mdx?$/.test(f))) {
    const frontmatter = (await readFile(join(folder, file), "utf8")).split("---")[1] ?? "";
    const where = `src/content/${dir}/${file}`;
    items.push({ where, tags: frontmatterList(frontmatter, "tags", where), tech: frontmatterList(frontmatter, "tech", where) });
  }
}
for (const r of timeline) items.push({ where: `experience "${r.slug}"`, tags: r.tags, tech: r.tech ?? [] });
for (const c of certifications) items.push({ where: `certification "${c.slug}"`, tags: c.tags, tech: c.tech ?? [] });

const techNames = new Map(technologies.map((t) => [t.name.toLowerCase(), t.name]));
const tagSlugs = new Set(tags.map((t) => t.slug));
const usedTech = new Set();
const usedTags = new Set();

for (const item of items) {
  if (item.tags.length === 0) problems.push(`${item.where} has no tags. Give it at least one from src/app/data/tags.ts.`);
  for (const tag of item.tags) {
    if (!tagSlugs.has(tag)) problems.push(`${item.where} uses unregistered tag "${tag}". Add it to src/app/data/tags.ts.`);
    usedTags.add(tag);
  }
  for (const name of item.tech) {
    if (!techNames.has(name.toLowerCase())) problems.push(`${item.where} uses unregistered tech "${name}". Add it to src/app/data/technologies.ts.`);
    usedTech.add(name.toLowerCase());
  }
}

for (const tech of technologies) {
  if (!usedTech.has(tech.name.toLowerCase()))
    problems.push(`Technology "${tech.name}" is attached to nothing. Add it to the tech of a project, post, role or certification it belongs to, or remove it.`);
  if (tech.imagePath) {
    try { await access(join(root, "public", tech.imagePath)); }
    catch { problems.push(`Technology "${tech.name}" logo is missing: public${tech.imagePath}`); }
  }
}
for (const tag of tags) {
  if (!usedTags.has(tag.slug))
    problems.push(`Tag "${tag.slug}" is attached to nothing. Attach it to what it describes, or remove it.`);
}

const anchors = [...timeline.map((r) => r.slug), ...certifications.map((c) => c.slug)];
for (const slug of new Set(anchors.filter((s, i) => anchors.indexOf(s) !== i)))
  problems.push(`Two bio records share the anchor "${slug}".`);

if (problems.length) {
  console.error(`\nTaxonomy check failed (${problems.length}):\n  - ${problems.join("\n  - ")}\n`);
  process.exit(1);
}
console.log(`Taxonomy OK: ${technologies.length} technologies and ${tags.length} tags, each attached to real work; ${items.length} items checked.`);
