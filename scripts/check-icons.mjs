/**
 * An icon is a control, a signal or a logo, never decoration (KHP §4.8, §5.9).
 * Only the files below may import Phosphor icons, each for its stated job; an
 * icon anywhere else (a calendar beside a date, an arrow after "View all", a
 * rocket beside "Project") fails. To add one, add the file and its job here,
 * and say in the change why words alone can't do it.
 */
import { readFile, readdir } from "node:fs/promises";
import { join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const ALLOWED = {
  "src/app/layout/Navbar.tsx": "the menu button (open, close): the icon is the control",
  "src/app/layout/ThemeToggle.tsx": "the theme button: the icon is the control",
  "src/app/layout/nav/AppsMenu.tsx": "the menu caret, and the mark that a link opens a new tab",
  "src/app/layout/nav/MobileMenu.tsx": "the mark that a link opens a new tab",
  "src/app/features/search/Search.tsx": "the magnifier that marks the search field",
  "src/app/features/article/ImageViewer.tsx": "the viewer's buttons (close, previous, next, zoom, reset): icon-only controls",
  "src/app/pages/projects/[slug]/ProjectActions.astro": "the mark that a link opens a new tab",
  "src/app/pages/projects/[slug]/ProjectUpdates.astro": "the icon-only button that opens release notes",
  "src/app/pages/bio/CertificationCard.astro": "the mark that a link opens a new tab",
  "lib/khp-ui/components/form/Select.tsx": "the select's caret and scroll buttons",
  "lib/khp-ui/components/surface/AccordionItem.astro": "the caret that shows a card opens",
  "lib/khp-ui/components/overlay/Drawer.astro": "the drawer's close button",
};
const EXT = /\.(astro|tsx?|mjs)$/;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (EXT.test(entry.name)) yield path;
  }
}

const hits = [];
for (const top of ["src", "lib"]) {
  for await (const file of walk(join(root, top))) {
    const rel = relative(root, file);
    const text = await readFile(file, "utf8");
    if (/from\s+["']@phosphor-icons\/react["']/.test(text) && !ALLOWED[rel]) hits.push(rel);
  }
}

if (hits.length) {
  console.error(`Icon check failed (${hits.length}): an icon is a control, a signal or a logo, never decoration (KHP §4.8).\n`);
  console.error(hits.map((h) => `  ${h}`).join("\n"));
  process.exit(1);
}
console.log(`Icons: only controls and signals, in ${Object.keys(ALLOWED).length} places.`);
