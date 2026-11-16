/**
 * The performance budget (KHP §7.7): every kind of page, and the interactions
 * people use, measured in Chrome with the CPU slowed 4x and a 4G network.
 * Thresholds live in src/data/settings.ts; a miss fails with the numbers.
 */
import { expect, test, type Page } from "@playwright/test";
import { performanceBudget as budget } from "../../src/data/settings";
import { representative } from "../support/routes";
import { observeVitals, percentile, readVitals, scrollFrames, throttle } from "../support/vitals";

test.describe.configure({ mode: "serial" });

async function load(page: Page, path: string) {
  await observeVitals(page);
  await throttle(page);
  const response = await page.goto(path, { waitUntil: "networkidle" });
  expect(response?.ok(), `${path} answered ${response?.status()}`).toBe(true);
  // Let idle hydration finish, so its work counts against the page.
  await page.waitForFunction(() => !document.querySelector('astro-island[component-url*="Navbar"][ssr]'));
  await page.waitForTimeout(1000);
}

for (const path of representative) {
  test(`${path} loads fast and scrolls smoothly`, async ({ page }) => {
    await load(page, path);
    const v = await readVitals(page);
    const frames = await scrollFrames(page);
    const p95 = percentile(frames, 95);
    const jank = frames.filter((f) => f > 50).length / Math.max(1, frames.length);
    console.log(
      `${path.padEnd(42)} LCP ${v.lcp.toFixed(0)}ms  CLS ${v.cls.toFixed(3)}  TBT ${v.tbt.toFixed(0)}ms  ` +
        `JS ${v.jsKb.toFixed(0)}KB  HTML ${v.htmlKb.toFixed(1)}KB  scroll p95 ${p95.toFixed(1)}ms  jank ${(jank * 100).toFixed(1)}%`
    );
    expect.soft(v.lcp, "Largest Contentful Paint (ms)").toBeLessThanOrEqual(budget.lcp);
    expect.soft(v.cls, "Cumulative Layout Shift").toBeLessThanOrEqual(budget.cls);
    expect.soft(v.tbt, "Total Blocking Time (ms)").toBeLessThanOrEqual(budget.tbt);
    expect.soft(v.jsKb, "JavaScript loaded (KB)").toBeLessThanOrEqual(budget.initialJsKb);
    expect.soft(v.htmlKb, "HTML (KB)").toBeLessThanOrEqual(budget.htmlKb);
    expect.soft(p95, "scroll frame time, 95th percentile (ms)").toBeLessThanOrEqual(budget.scrollFrameP95);
    expect.soft(jank, "share of janky scroll frames").toBeLessThanOrEqual(budget.scrollJankShare);
  });
}

/** Each interaction, then the slowest input-to-paint it caused. */
const interactions: { name: string; path: string; act: (page: Page) => Promise<void> }[] = [
  { name: "switching the theme", path: "/", act: (p) => p.getByRole("button", { name: /Switch to dark theme/ }).click() },
  { name: "opening the apps menu", path: "/", act: (p) => p.getByRole("button", { name: "Apps" }).click() },
  { name: "typing in search", path: "/", act: (p) => p.locator("input[data-search-input]:visible").pressSequentially("micro", { delay: 60 }) },
  { name: "opening release notes", path: "/projects/pundo", act: (p) => p.getByRole("button", { name: "Open Pundo release notes" }).click() },
  { name: "folding an article section", path: "/blogs/micro-frontends-experience-ripplev2", act: (p) => p.locator("#article-content .section-toggle").first().click() },
  { name: "opening the image viewer", path: "/blogs/is-n8n-even-worth-it", act: (p) => p.locator("#article-hero").click() },
];

for (const { name, path, act } of interactions) {
  test(`${name} answers within ${budget.inp}ms`, async ({ page }) => {
    await load(page, path);
    await page.evaluate(() => (window.__vitals.events = []));
    await act(page);
    await page.waitForTimeout(500);
    const { inp } = await readVitals(page);
    console.log(`${name.padEnd(42)} INP ${inp.toFixed(0)}ms`);
    expect(inp, "Interaction to Next Paint (ms)").toBeLessThanOrEqual(budget.inp);
  });
}
