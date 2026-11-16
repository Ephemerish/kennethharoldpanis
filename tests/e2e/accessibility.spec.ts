/**
 * Every page passes WCAG 2.1 A and AA checks (axe), in light and in dark
 * (KHP §1.6, §5.2): contrast, names, labels, landmarks. Logos are images, so
 * their visibility is checked by scripts/check-assets.mjs instead.
 */
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { routes } from "../support/routes";

for (const theme of ["light", "dark"] as const) {
  for (const path of routes) {
    test(`${path} is accessible in ${theme}`, async ({ page }, info) => {
      test.skip(info.project.name !== "desktop", "Contrast and names are the same at every width.");
      await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
      await page.goto(path, { waitUntil: "networkidle" });
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
      const found = results.violations.map(
        (v) => `${v.id}: ${v.help} (${v.nodes.length}): ${v.nodes.slice(0, 4).map((n) => n.target.join(" ")).join(" | ")}`
      );
      expect(found).toEqual([]);
    });
  }
}
