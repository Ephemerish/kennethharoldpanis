import type { APIRoute } from "astro";
import { getTagBySlug, getTagLabel } from "@data/taxonomy/tags";
import { getTechBySlug, techSlug } from "@data/taxonomy/technologies";
import { hrefOf, loadTaxonomy, tagsOf, techOf, type TaxonomyItem } from "@app/features/taxonomy/collect";
import type { SearchItem } from "@app/api/stores";

export const prerender = true;

/**
 * One flat index for search (docs/systems/search.md): projects, posts, roles,
 * certifications, and every tag and technology with how many things use it.
 * Built from the taxonomy, so it lists exactly what the tag and tech pages do.
 * Fetched lazily by the search island on first open.
 */
export const GET: APIRoute = async () => {
  const taxonomy = await loadTaxonomy();
  const all: TaxonomyItem[] = [...taxonomy.entries, ...taxonomy.bio];

  const tagCounts = new Map<string, number>();
  const techCounts = new Map<string, number>();
  const bump = (m: Map<string, number>, k: string) => m.set(k, (m.get(k) ?? 0) + 1);

  const items: SearchItem[] = [];

  for (const item of all) {
    tagsOf(item).forEach((tag) => bump(tagCounts, tag));
    techOf(item).forEach((name) => bump(techCounts, techSlug(name)));
    const keywords = [...tagsOf(item).map(getTagLabel), ...techOf(item)];

    if ("entry" in item) {
      const data = item.entry.data;
      const date = item.kind === "blog" ? item.entry.data.pubDate : item.entry.data.endDate ?? item.entry.data.startDate;
      items.push({
        type: item.kind,
        title: data.title,
        url: hrefOf(item),
        description: data.description,
        keywords,
        date: date.toISOString(),
      });
    } else if (item.kind === "experience") {
      items.push({ type: "experience", title: item.record.title, url: hrefOf(item), description: item.record.org, keywords });
    } else {
      items.push({
        type: "certification",
        title: item.record.title,
        url: hrefOf(item),
        description: item.record.issuer,
        keywords,
      });
    }
  }

  for (const [slug, count] of tagCounts) {
    items.push({ type: "tag", title: getTagBySlug(slug)?.label ?? slug, url: `/tags/${slug}`, count });
  }

  for (const [slug, count] of techCounts) {
    const tech = getTechBySlug(slug);
    items.push({ type: "tech", title: tech?.name ?? slug, url: `/tech/${slug}`, count, imagePath: tech?.imagePath, imagePathDark: tech?.imagePathDark });
  }

  return new Response(JSON.stringify(items), { headers: { "Content-Type": "application/json" } });
};
