import type { APIRoute } from "astro";
import { site } from "@data/site";
import { resumeAvailable } from "@data/bio/resume";
import { pageCount, pageHref } from "@app/pages/blogs/model";
import { loadTaxonomy } from "@app/features/taxonomy/collect";

/** Every public page, built with the site (KHP §7.3). */
export const prerender = true;

export const GET: APIRoute = async () => {
  const taxonomy = await loadTaxonomy();
  const posts = taxonomy.entries.filter((item) => item.kind === "blog");

  const paths = new Set<string>(["/", "/bio", "/projects", "/blogs", "/contact"]);
  if (resumeAvailable) paths.add("/bio/resume");
  for (let page = 2; page <= pageCount(posts.length); page++) paths.add(pageHref(page));
  taxonomy.entries.forEach((item) => paths.add(`/${item.kind === "blog" ? "blogs" : "projects"}/${item.entry.id}`));
  taxonomy.tagSlugs.forEach((slug) => paths.add(`/tags/${slug}`));
  taxonomy.techSlugs.forEach((slug) => paths.add(`/tech/${slug}`));
  const urls = [...paths]
    .sort()
    .map((path) => `  <url><loc>${new URL(path, site.url).toString()}</loc></url>`)
    .join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } }
  );
};
