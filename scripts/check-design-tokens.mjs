/**
 * Holds the theme to its rules (KHP §5.1, §5.6, §5.7): outside
 * lib/khp-ui/tokens/, no raw colour, no colour scale the theme doesn't define
 * (the site's are brand, neutral, success, warning, error, plus white, black
 * and ink), no rounded corners, no raw z-index, and no text in neutral-300 or
 * neutral-400 (under AA contrast in both themes; KHP §5.3). Those two steps
 * are for borders and aria-hidden icons only. No coloured or thick stripe down
 * one side of a box, the best-known AI tell (KHP §5.9); a quote's rule is the
 * one exception. Exits non-zero with every hit.
 */
import { readFile, readdir } from "node:fs/promises";
import { join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const SCAN = ["src", "lib"];
const EXT = /\.(astro|tsx?|mjs|css)$/;
const SKIP = [/^lib\/khp-ui\/tokens\//, /^src\/data\/apps\/patch-notes\/releases\.ts$/];

// Files allowed raw colour, each with its reason (keep this list short).
const RAW_COLOUR_OK = {
  "src/app/features/article/PretextCover.tsx": "canvas artwork; a canvas cannot read CSS variables",
  };

// Tailwind's own palettes are switched off in theme.css, so a class using one
// draws nothing. Catch it here instead of on screen.
const PALETTE = "gray|grey|slate|zinc|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose";
const PREFIX = "bg|text|border|border-[xytrbl]|ring|ring-offset|outline|from|via|to|fill|stroke|divide|decoration|placeholder|caret|accent|shadow";

const RULES = [
  { id: "raw colour", re: /#[0-9a-fA-F]{3,8}\b(?![\w-])|\brgba?\(/g, rawColour: true },
  { id: "palette class", re: new RegExp(`(?<![\\w-])(?:[a-z-]+:)*(?:${PREFIX})-(?:(?:${PALETTE})-\\d{2,3})(?:/\\d+)?(?![\\w-])`, "g") },
  { id: "rounded corner", re: /(?<![\w-])(?:[a-z-]+:)*rounded(?:-[a-z0-9]+)?(?![\w-])/g },
  { id: "raw z-index", re: /(?<![\w-])(?:[a-z-]+:)*z-(?:\d+|\[\d+\])(?![\w-])/g },
  // A side stripe: a left or right border thicker than 1px, or in brand or status colour.
  { id: "side stripe", re: /(?<![\w-])(?:[a-z-]+:)*border-[lrse]-(?:[2-9]|\[[^\]]+\]|(?:brand|success|warning|error)-\d{2,3})(?![\w-])/g, unlessQuote: true },
  // Too faint to read: allowed only on a line that marks its element aria-hidden.
  { id: "faint text", re: /(?<![\w-])(?:[a-z-]+:)*(?:text|placeholder:text)-neutral-(?:300|400)(?![\w-])/g, unlessDecorative: true },
];

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (EXT.test(entry.name)) yield path;
  }
}

const hits = [];
for (const top of SCAN) {
  for await (const file of walk(join(root, top))) {
    const rel = relative(root, file);
    if (SKIP.some((re) => re.test(rel))) continue;
    const lines = (await readFile(file, "utf8")).split("\n");
    lines.forEach((line, i) => {
      if (/^\s*(\/\/|\*|\/\*)/.test(line)) return; // comments may name what they forbid
      for (const rule of RULES) {
        if (rule.rawColour && RAW_COLOUR_OK[rel]) continue;
        if (rule.unlessDecorative && /aria-hidden/.test(line)) continue;
        if (rule.unlessQuote && /blockquote/.test(line)) continue;
        for (const match of line.matchAll(rule.re)) {
          hits.push(`${rel}:${i + 1}  ${rule.id}  ${match[0]}`);
        }
      }
    });
  }
}

if (hits.length) {
  console.error(`Design token check failed (${hits.length}). See docs/standards/05-colour-type-and-tokens.md.\n`);
  console.error(hits.join("\n"));
  process.exit(1);
}
console.log("Design tokens: every colour, layer and corner comes from the theme.");
