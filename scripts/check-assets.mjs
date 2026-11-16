/**
 * Every image the data names exists, and every logo can be seen (KHP §7.5).
 *
 * Each technology logo is drawn on the light tile and on the dark tile, and
 * the share of the logo that stands out from the tile is measured: different
 * enough in brightness or in colour. A logo that is mostly lost (dark ink on
 * the dark tile, white on the light one) fails, and needs an `imagePathDark`
 * (or a fixed main logo) in src/data/taxonomy/technologies.ts.
 *
 * Also checks certification badges and organisation logos exist.
 */
import { access } from "node:fs/promises";
import { join, resolve } from "node:path";
import sharp from "sharp";
import { technologies } from "../src/data/taxonomy/technologies.ts";
import { certifications } from "../src/data/bio/certifications.ts";
import { timeline } from "../src/data/bio/experience.ts";

const root = resolve(import.meta.dirname, "..");
const TILES = { light: [255, 255, 255], dark: [14, 14, 14] }; // --neutral-0 in each theme
const MIN_VISIBLE = 0.5;
const problems = [];

const luminance = (r, g, b) => {
  const f = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const contrast = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

/** Share of a logo's painted area that stands out from a tile colour. */
async function visibleShare(file, tile) {
  const { data } = await sharp(file, { density: 200 })
    .resize(64, 64, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const tileLum = luminance(...tile);
  let painted = 0;
  let seen = 0;
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3] / 255;
    if (a < 0.1) continue;
    const px = [0, 1, 2].map((k) => data[i + k] * a + tile[k] * (1 - a));
    painted += a;
    const distance = Math.hypot(px[0] - tile[0], px[1] - tile[1], px[2] - tile[2]);
    if (contrast(luminance(...px), tileLum) >= 1.5 || distance >= 90) seen += a;
  }
  return painted ? seen / painted : 0;
}

async function exists(path, what) {
  try {
    await access(join(root, "public", path));
    return true;
  } catch {
    problems.push(`${what}: missing file public${path}`);
    return false;
  }
}

for (const tech of technologies) {
  if (!tech.imagePath) continue;
  const light = tech.imagePath;
  const dark = tech.imagePathDark ?? tech.imagePath;
  if (!(await exists(light, tech.name)) || !(await exists(dark, `${tech.name} (dark)`))) continue;
  for (const [theme, file] of [["light", light], ["dark", dark]]) {
    let share;
    try {
      share = await visibleShare(join(root, "public", file), TILES[theme]);
    } catch (error) {
      problems.push(`${tech.name}: public${file} can't be read as an image (${error.message}). Is it empty?`);
      break;
    }
    if (share < MIN_VISIBLE)
      problems.push(`${tech.name} logo is ${(share * 100).toFixed(0)}% visible on the ${theme} tile (${file}). Give it ${theme === "dark" ? "an imagePathDark" : "a darker main logo"}.`);
  }
}
for (const cert of certifications) await exists(cert.image, `${cert.title} badge`);
for (const role of timeline) if (role.image) await exists(role.image, `${role.org} logo`);

if (problems.length) {
  console.error(`\nAsset check failed (${problems.length}):\n  - ${problems.join("\n  - ")}\n`);
  process.exit(1);
}
console.log(`Assets OK: ${technologies.length} logos visible in light and dark; badges and organisation logos present.`);
