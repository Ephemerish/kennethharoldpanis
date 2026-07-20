#!/usr/bin/env node
// Every technology in src/data/technologies.ts must be attached to at least
// one project or blog post's `tech` list, so the tech carousel and /tech
// pages only ever show skills that trace back to real, documented work.
// Run before `astro build` so an untraceable tech fails CI instead of
// shipping quietly.
import { readdir, readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function extractTechNames(source) {
  const uncommented = source
    .split('\n')
    .filter((line) => !line.trim().startsWith('//'))
    .join('\n');
  const names = [];
  const re = /name:\s*'([^']+)'/g;
  let match;
  while ((match = re.exec(uncommented))) names.push(match[1]);
  return names;
}

function extractUsedTech(frontmatter) {
  const match = frontmatter.match(/^tech:\s*(\[[^\]]*\])/m);
  if (!match) return [];
  try {
    return JSON.parse(match[1].replace(/'/g, '"'));
  } catch {
    return [];
  }
}

async function collectUsedTech(dir) {
  const used = new Set();
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
    const text = await readFile(join(dir, entry.name), 'utf-8');
    for (const name of extractUsedTech(text)) used.add(name.toLowerCase());
  }
  return used;
}

const techSource = await readFile(join(root, 'src/data/technologies.ts'), 'utf-8');
const allTechNames = extractTechNames(techSource);

const [projectTech, blogTech] = await Promise.all([
  collectUsedTech(join(root, 'src/content/projects')),
  collectUsedTech(join(root, 'src/content/blog')),
]);
const used = new Set([...projectTech, ...blogTech]);

const orphans = allTechNames.filter((name) => !used.has(name.toLowerCase()));

if (orphans.length > 0) {
  console.error(
    `\nTech traceability check failed: ${orphans.length} technolog${orphans.length === 1 ? 'y' : 'ies'} ` +
      `in src/data/technologies.ts ${orphans.length === 1 ? 'is' : 'are'} not attached to any project or blog post:\n` +
      orphans.map((name) => `  - ${name}`).join('\n') +
      `\n\nEvery tech must trace back to real work. Add it to a project's or post's ` +
      `"tech" list in src/content/, or remove it from src/data/technologies.ts.\n`
  );
  process.exit(1);
}

console.log(
  `Tech traceability OK: all ${allTechNames.length} technologies are attached to at least one project or post.`
);
