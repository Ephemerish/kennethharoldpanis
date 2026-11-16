/**
 * Every public page, read from the built sitemap, so the tests cover exactly
 * what the site publishes. A new page is tested the moment it ships.
 */
import { readFileSync } from "node:fs";

const sitemap = readFileSync(new URL("../../dist/client/sitemap.xml", import.meta.url), "utf8");

export const routes: string[] = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);

const firstUnder = (prefix: string) => {
  const found = routes.find((r) => r.startsWith(prefix));
  if (!found) throw new Error(`The sitemap has no page under ${prefix}`);
  return found;
};

/**
 * One representative page of each kind, for the slower performance runs.
 * Tag and tech pages come from the sitemap, so a renamed tag can't leave a
 * dead route here; every fixed path must be in the sitemap too.
 */
const fixed = [
  "/",
  "/projects",
  "/projects/pundo",
  "/projects/marine-communication-network",
  "/blogs",
  "/blogs/micro-frontends-experience-ripplev2",
  "/blogs/soo-i-tried-pretext",
  "/bio",
  "/contact",
  "/tech/react",
];
const missing = fixed.filter((r) => !routes.includes(r));
if (missing.length) throw new Error(`Not in the sitemap: ${missing.join(", ")}`);

export const representative: string[] = [...fixed, firstUnder("/tags/")];
