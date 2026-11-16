/**
 * Holds the interface's words to KHP §6.7 (ported from Ebb §8 and §1.16.3 and
 * Pundo §13): a line says what something is, never how to use the screen; a
 * subtitle is one sentence of at most 15 words; a label is 1 to 3 words; a
 * title has no full stop; no filler, no em dash, no emoji; and the glossary's
 * word for each thing (docs/GLOSSARY.md, its "Not" column). Reads the
 * templates, the UI library and src/data, but not the owner's articles
 * (src/data/content/) or the apps' own release notes. Exits non-zero with
 * every hit.
 */
import { readFile, readdir } from "node:fs/promises";
import { join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const SCAN = ["src/app", "src/pages", "src/data", "lib/khp-ui/components"];
const EXT = /\.(astro|tsx?|mjs)$/;
const SKIP = [/^src\/data\/content\//, /^src\/data\/apps\/patch-notes\//];

const SUBTITLE_WORDS = 15;
const LABEL_WORDS = 3;

// Telling the reader how to work the page: the page should make it obvious.
const HOW = /\b(click|tap|press) (here|on|to|it|this|one|a|the)\b|\bopen (one|any|a card)\b|\beach one opens\b|\bhover (over|on|to)\b|\bscroll (down|up|to)\b|\bcheck (it|them) out\b|\btake a look\b|\bfeel free\b|\bdon'?t hesitate\b|\bsee below\b|\bbelow you(?:'ll| will) find\b/i;
// Words that say nothing about the work (KHP §6.6, §10.7).
const FILLER = /\b(seamless(ly)?|passionate|elevate[sd]?|unlock(s|ing)?|cutting[- ]edge|leverag(e|es|ing)|robust|powerful|delve|empower(s|ing)?|world[- ]class|next[- ]level|supercharg\w*|game[- ]chang\w*|effortless(ly)?|revolutioni[sz]\w*|innovative|synerg\w*|state[- ]of[- ]the[- ]art|my journey|in today's)\b/i;
const EMOJI = /\p{Extended_Pictographic}/u;

// The glossary's banned words: the "Not" column of its first table.
const glossary = await readFile(join(root, "docs/GLOSSARY.md"), "utf8");
const firstTable = glossary.split("## Words on screen")[1].split("\n## ")[0];
const BANNED = firstTable
  .split("\n")
  .filter((row) => row.startsWith("| ") && !row.startsWith("| Say") && !row.startsWith("| ---"))
  .flatMap((row) => {
    const cells = row.split("|").map((cell) => cell.trim());
    const say = cells[1];
    return cells[3].split(",").map((not) => ({ not: not.trim(), say })).filter((entry) => entry.not);
  })
  .map(({ not, say }) => ({ say, re: new RegExp(`\\b${not.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i"), not }));

/** Text a reader sees on a line: quoted strings with a space in them, and text between tags. */
const visible = (line) =>
  [...line.matchAll(/"([^"]*\s[^"]*)"|`([^`]*\s[^`]*)`|>([^<>{}]*[A-Za-z][^<>{}]*)</g)].map((m) => m[1] ?? m[2] ?? m[3])
    .filter((text) => !/^[#.[]/.test(text.trim())); // a CSS selector, not words

/** The text of a line with its comments removed. */
const code = (line) =>
  line
    .replace(/\{\/\*.*?\*\/\}/g, "")
    .replace(/\/\*.*?\*\//g, "")
    .replace(/(^|\s)\/\/.*$/, "$1");
const isComment = (line) => /^\s*(\/\/|\*|\/\*|\{\/\*)/.test(line);
const words = (text) => text.trim().split(/\s+/).filter(Boolean).length;

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
    lines.forEach((raw, i) => {
      if (isComment(raw)) return;
      const line = code(raw);
      const at = `${rel}:${i + 1}`;
      const how = line.match(HOW);
      if (how) hits.push(`${at}  how-to line  "${how[0]}": say what it is; the page shows how`);
      const filler = line.match(FILLER);
      if (filler) hits.push(`${at}  filler  "${filler[0]}": replace it with a fact`);
      if (line.includes("—")) hits.push(`${at}  em dash: use a comma, a colon or two sentences`);
      if (EMOJI.test(line)) hits.push(`${at}  emoji`);
      if (!/^\s*import\b/.test(line))
        for (const text of visible(line))
          for (const { re, not, say } of BANNED)
            if (re.test(text)) hits.push(`${at}  glossary  "${not}": say "${say}" (docs/GLOSSARY.md)`);
      for (const m of line.matchAll(/\bsubtitle="([^"]+)"/g)) {
        const text = m[1];
        if (words(text) > SUBTITLE_WORDS) hits.push(`${at}  subtitle over ${SUBTITLE_WORDS} words (${words(text)})`);
        if (/[.!?]\s+\S/.test(text)) hits.push(`${at}  subtitle is more than one sentence`);
      }
      for (const m of line.matchAll(/<Label\b[^>]*>([^<{]+)<\/Label>/g)) {
        if (words(m[1]) > LABEL_WORDS) hits.push(`${at}  label over ${LABEL_WORDS} words: "${m[1].trim()}"`);
      }
      for (const m of line.matchAll(/\b(?:heading|accent|suffix|title)="([^"]+)"/g)) {
        if (/[^.]\.$/.test(m[1].trim())) hits.push(`${at}  title ends with a full stop: "${m[1]}"`);
      }
    });
  }
}

if (hits.length) {
  console.error(`Copy check failed (${hits.length}). See docs/standards/06-states-feedback-and-writing.md §6.7.\n`);
  console.error(hits.join("\n"));
  process.exit(1);
}
console.log(`Copy: every line says what, within its budget, with no filler, in the glossary's words (${BANNED.length} banned).`);
