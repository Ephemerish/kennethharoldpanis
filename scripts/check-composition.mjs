/**
 * Pages are built from components, never raw HTML (KHP §4.9). This fails when
 * a template under src/app/pages, src/app/features or src/app/layout writes an
 * HTML element directly instead of using a component from @ui. Raw HTML lives
 * in lib/khp-ui (and the tiny brand icons in src/app/shared), so one change to
 * a component changes it everywhere.
 *
 * Allowed in templates: <slot>, inline SVG drawings, <script> and <style>
 * blocks, and the document's own tags in MainLayout and Head.
 */
import { readFile, readdir } from "node:fs/promises";
import { join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const SCAN = ["src/app/pages", "src/app/features", "src/app/layout"];
const ALWAYS = new Set(["slot", "svg", "path", "g", "circle", "rect", "line", "polyline", "polygon", "defs", "use", "lineargradient", "stop"]);
const DOCUMENT = new Set(["html", "head", "body", "meta", "link", "title"]);
const DOCUMENT_FILES = new Set(["src/app/layout/MainLayout.astro", "src/app/layout/Head.astro"]);

async function* astroFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* astroFiles(path);
    else if (entry.name.endsWith(".astro")) yield path;
  }
}

/** The template only: no frontmatter, scripts, styles, comments or SVG bodies. */
function template(source) {
  return source
    .replace(/^---[\s\S]*?\n---/, "")
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/<svg[\s\S]*?<\/svg>/g, "<svg></svg>");
}

const problems = [];
for (const dir of SCAN) {
  for await (const file of astroFiles(join(root, dir))) {
    const rel = relative(root, file);
    const source = await readFile(file, "utf8");
    const body = template(source);
    const offset = source.length - body.length;
    for (const match of body.matchAll(/(?<![\w$])<([a-z][a-z0-9-]*)(?=[\s/>])/g)) {
      const tag = match[1];
      if (ALWAYS.has(tag) || (DOCUMENT_FILES.has(rel) && DOCUMENT.has(tag))) continue;
      const line = source.slice(0, match.index + offset).split("\n").length;
      problems.push(`${rel}:~${line}  <${tag}>`);
    }
  }
}

if (problems.length) {
  console.error(`\nComposition check failed (${problems.length}): use a component from @ui instead of raw HTML.\n  ${problems.join("\n  ")}\n`);
  process.exit(1);
}
console.log("Composition: every page, feature and layout is built from components.");
