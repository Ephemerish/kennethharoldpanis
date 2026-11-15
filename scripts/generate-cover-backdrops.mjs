import { readdir, readFile, mkdir, access, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";
import { coverBackdrop } from "../src/app/features/entries/cover-image.mjs";

const root = resolve(import.meta.dirname, "..");
const content = resolve(root, "src/content");
const files = await readdir(content, { recursive: true });
const images = new Set();
const missing = [];
for (const file of files.filter(file => /\.mdx?$/.test(file))) {
  const source = await readFile(resolve(content, file), "utf8");
  const frontmatter = source.split("---")[1] ?? "";
  const match = frontmatter.match(/^image:\s*(?:"([^"]+)"|'([^']+)'|([^#\r\n]+))/m);
  const image = (match?.[1] ?? match?.[2] ?? match?.[3])?.trim();
  if (!image) continue;
  // A live-cover engine draws its own cover, so it needs no image file.
  const live = /^engine:\s*["']?pretext/m.test(frontmatter);
  try { await access(resolve(root, "public/images", image)); images.add(image); }
  catch { if (!live) missing.push(`${file}: public/images/${image}`); }
}
if (missing.length) {
  console.error(`Content images that do not exist:\n  ${missing.join("\n  ")}`);
  process.exit(1);
}

await mkdir(resolve(root, "public/images/cover-backdrops"), { recursive: true });
let count = 0;
for (const image of images) {
  const source = resolve(root, "public/images", image);
  const bitmap = await sharp(source)
    .resize(40, 24, { fit: "cover" })
    .blur(2)
    .webp({ quality: 70 })
    .toBuffer();
  await writeFile(resolve(root, "public", coverBackdrop(image).slice(1)), bitmap);
  count++;
}
console.log(`Prepared ${count} tiny cover backdrops; no browser blur needed.`);
