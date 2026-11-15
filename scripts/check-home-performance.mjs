/**
 * The home page's performance budget (KHP §7.6), checked on the built HTML.
 * Motion is welcome; cost up front is not:
 *   - nothing hydrates eagerly (`client:load`); the top bar waits for idle;
 *   - the pretext cover paints as a still and hydrates only when visible;
 *   - no CSS blur on the page (it repaints on every scroll frame);
 *   - the marquee's duplicate row is inert, so it is not tabbed or read twice;
 *   - the HTML stays under 120 KB.
 * The pretext article keeps its live cover.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const home = readFileSync("dist/client/index.html", "utf8");
const article = readFileSync("dist/client/blogs/soo-i-tried-pretext/index.html", "utf8");

assert.doesNotMatch(home, /<astro-island[^>]*client="load"/, "Home hydrates an island eagerly; use client:idle or client:visible.");
assert.match(home, /data-pretext-still/, "The pretext card must paint its still first.");
const cover = home.match(/<astro-island[^>]*component-url="[^"]*PretextCover[^"]*"[^>]*>/)?.[0];
if (cover) assert.match(cover, /client="visible"/, "The pretext cover must hydrate only when visible.");
assert.doesNotMatch(home, /class="[^"]*(?:blur-2xl|backdrop-blur)/, "Home uses a CSS blur.");
assert.match(home, /data-marquee-copy[^>]*inert|inert[^>]*data-marquee-copy/, "The marquee's second row must be inert.");
const kb = Buffer.byteLength(home) / 1024;
assert.ok(kb < 120, `Home HTML is ${kb.toFixed(0)} KB, over the 120 KB budget.`);
assert.match(article, /component-url="[^"]*PretextCover/, "The pretext article lost its live cover.");

console.log(`Home is within budget (${kb.toFixed(0)} KB, no eager islands, no blur); the pretext article keeps its live cover.`);
