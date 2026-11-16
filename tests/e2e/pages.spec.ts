/**
 * Every page renders cleanly, at desktop and phone width (KHP §9.2): it
 * answers 200, has one h1, no sideways scroll, alt text on every image, no
 * script errors, no failed requests, and every internal link leads somewhere.
 */
import { expect, test } from "@playwright/test";
import { routes } from "../support/routes";

for (const path of routes) {
  test(`${path} renders cleanly`, async ({ page }) => {
    const problems: string[] = [];
    page.on("pageerror", (error) => problems.push(`script error: ${error.message}`));
    page.on("console", (message) => {
      if (message.type() === "error") problems.push(`console: ${message.text()}`);
    });
    page.on("response", (response) => {
      const url = new URL(response.url());
      if (url.hostname === "127.0.0.1" && response.status() >= 400) problems.push(`${response.status()} ${url.pathname}`);
    });

    const response = await page.goto(path, { waitUntil: "networkidle" });
    expect(response?.status(), "status").toBe(200);
    await expect(page.locator("h1"), "exactly one h1").toHaveCount(1);
    expect(await page.locator("img:not([alt])").count(), "images without alt").toBe(0);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, "sideways scroll in px").toBeLessThanOrEqual(0);
    expect(problems).toEqual([]);
  });
}

test("an unknown page answers 404 with a way back", async ({ page }) => {
  const response = await page.goto("/no-such-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page Not Found");
  await expect(page.getByRole("link", { name: "Go back to Home" })).toBeVisible();
});

test("every internal link leads to a real page", async ({ page, request }, info) => {
  test.skip(info.project.name !== "desktop", "Links are the same at every width.");
  test.setTimeout(120_000);
  const links = new Set<string>();
  for (const path of routes) {
    await page.goto(path);
    for (const href of await page.locator("a[href^='/']").evaluateAll((as) => as.map((a) => a.getAttribute("href")!))) {
      links.add(href.split("#")[0] || "/");
    }
  }
  const broken: string[] = [];
  for (const href of links) {
    const response = await request.get(href);
    if (response.status() >= 400) broken.push(`${response.status()} ${href}`);
  }
  expect(broken).toEqual([]);
});
