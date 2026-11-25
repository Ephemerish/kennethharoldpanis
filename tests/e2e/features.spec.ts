/**
 * Every interactive feature works the way a visitor uses it (KHP §9.2):
 * navigation, search, the mobile menu, the theme, the apps menu, release
 * notes, collapsible sections, the image viewer, the marquee, the live cover,
 * bio anchors, the contact form and the splash.
 */
import { expect, test, type Page } from "@playwright/test";

const isMobile = (name: string) => name === "mobile";

/** The top bar hydrates when the browser is idle; wait for it like a reader would. */
async function navReady(page: Page) {
  await page.waitForFunction(() => !document.querySelector('astro-island[component-url*="Navbar"][ssr]'));
}

async function search(page: Page, mobile: boolean) {
  await navReady(page);
  if (mobile) await page.getByRole("button", { name: "Toggle menu" }).click();
  return page.locator("input[data-search-input]:visible");
}

test("the top bar marks the page you are on", async ({ page }, info) => {
  test.skip(isMobile(info.project.name), "The desktop bar shows the links.");
  await page.goto("/projects");
  await navReady(page);
  await expect(page.getByRole("navigation").getByRole("link", { name: "Projects", exact: true })).toHaveAttribute("aria-current", "page");
  await page.getByRole("navigation").getByRole("link", { name: "Bio", exact: true }).click();
  await expect(page).toHaveURL(/\/bio$/);
  await expect(page.getByRole("navigation").getByRole("link", { name: "Bio", exact: true })).toHaveAttribute("aria-current", "page");
});

test("search finds a project and opens it with the keyboard", async ({ page }, info) => {
  await page.goto("/");
  const input = await search(page, isMobile(info.project.name));
  await input.fill("pundo");
  await expect(page.getByRole("option", { name: /Pundo/ }).first()).toBeVisible();
  await input.press("Enter");
  await expect(page).toHaveURL(/\/projects\/pundo$/);
});

test("the mobile menu opens, closes on Escape, and holds search", async ({ page }, info) => {
  test.skip(!isMobile(info.project.name), "Only narrow screens have the menu.");
  await page.goto("/");
  await navReady(page);
  await page.getByRole("button", { name: "Toggle menu" }).click();
  const menu = page.locator("#mobile-menu");
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("link", { name: "Contact" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
});

test("'Search for something else' focuses search at any width", async ({ page }) => {
  await page.goto("/tags/web-app");
  await navReady(page);
  await page.getByRole("button", { name: "Search for something else" }).click();
  await expect(page.locator("input[data-search-input]:focus")).toHaveCount(1);
});

test("the theme switch is remembered across pages", async ({ page }, info) => {
  await page.goto("/");
  await navReady(page);
  if (isMobile(info.project.name)) await page.getByRole("button", { name: "Toggle menu" }).click();
  await page.getByRole("button", { name: /Switch to dark theme/ }).first().click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.goto("/bio");
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("the apps menu opens and closes with Escape", async ({ page }, info) => {
  test.skip(isMobile(info.project.name), "Apps sit in the mobile menu instead.");
  await page.goto("/");
  await navReady(page);
  const button = page.getByRole("button", { name: "Apps" });
  await button.click();
  await expect(page.locator("#apps-menu")).toBeVisible();
  await expect(page.locator("#apps-menu").getByRole("link", { name: /Pundo/ })).toHaveAttribute("target", "_blank");
  await page.keyboard.press("Escape");
  await expect(page.locator("#apps-menu")).toBeHidden();
  await expect(button).toBeFocused();
});

test("release notes open in a drawer and return focus when closed", async ({ page }) => {
  await page.goto("/projects/pundo");
  const trigger = page.getByRole("button", { name: "Open Pundo release notes" });
  await trigger.click();
  const drawer = page.getByRole("dialog", { name: "Release notes" });
  await expect(drawer).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("article sections fold one at a time and all at once", async ({ page }) => {
  await page.goto("/blogs/micro-frontends-experience-ripplev2");
  const toggle = page.locator("#article-content .section-toggle").first();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await page.getByRole("button", { name: "Hide All Sections" }).click();
  await expect(page.locator("#article-content .section-toggle[aria-expanded='true']")).toHaveCount(0);
});

test("an article's cover opens in the image viewer", async ({ page }) => {
  await page.goto("/blogs/is-n8n-even-worth-it");
  await page.locator("#article-hero").click();
  const viewer = page.getByRole("dialog", { name: "Image viewer" });
  await expect(viewer).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(viewer).toBeHidden();
});

test("the technologies marquee moves, and pauses under the pointer", async ({ page }, info) => {
  test.skip(isMobile(info.project.name), "Hover is a pointer behaviour.");
  await page.goto("/");
  // The track never stops moving, so act on its still container.
  const marquee = page.locator("[data-marquee]").first();
  const track = marquee.locator(".marquee-track");
  await marquee.scrollIntoViewIfNeeded();
  const position = () => track.evaluate((el) => getComputedStyle(el).transform);
  const first = await position();
  await page.waitForTimeout(400);
  expect(await position()).not.toBe(first);
  await marquee.hover();
  await expect(track).toHaveCSS("animation-play-state", "paused");
});

test("the technologies marquee can be dragged, and a drag doesn't open a tile", async ({ page }, info) => {
  test.skip(isMobile(info.project.name), "Touch dragging is the same code; the mouse path is enough.");
  await page.goto("/");
  // Raw mouse moves don't wait for what covers the page; a reader waits for the splash.
  await expect(page.locator("[data-splash][data-show]")).toHaveCount(0, { timeout: 10_000 });
  const marquee = page.locator("[data-marquee]").first();
  const track = marquee.locator(".marquee-track");
  await marquee.scrollIntoViewIfNeeded();
  const box = (await marquee.boundingBox())!;
  const y = box.y + box.height / 2;
  const clock = () => track.evaluate((el) => Number(el.getAnimations()[0]?.currentTime ?? 0));
  await page.mouse.move(box.x + box.width / 2, y);
  await page.mouse.down();
  const before = await clock();
  await page.mouse.move(box.x + box.width / 2 - 300, y, { steps: 10 });
  const after = await clock();
  await page.mouse.up();
  // Dragging left moves the row forward: well past what a moment's drift would.
  expect(Math.abs(after - before)).toBeGreaterThan(1000);
  await expect(page).toHaveURL(/\/$/);
});

test("the pretext cover comes alive when scrolled into view", async ({ page }) => {
  await page.goto("/");
  const still = page.locator("[data-pretext-still]").first();
  await still.scrollIntoViewIfNeeded();
  await expect(still.locator("canvas")).toHaveCSS("visibility", "visible", { timeout: 10_000 });
});

test("a bio anchor lands on its card", async ({ page }) => {
  await page.goto("/bio#aws-solutions-architect-associate");
  await expect(page.locator("#aws-solutions-architect-associate")).toBeInViewport();
});

test("the current role is open, and opening another shows the tech used there", async ({ page }) => {
  await page.goto("/bio");
  const current = page.locator("details#alphaus");
  await expect(current).toHaveAttribute("open", "");
  await expect(current.getByRole("link", { name: /Module Federation/ })).toBeVisible();
  await expect(current.getByRole("link", { name: /Spanner/ })).toBeVisible();
  const college = page.locator("details#bohol-island-state-university");
  await expect(college).not.toHaveAttribute("open", "");
  await college.locator("summary").click();
  await expect(college).toHaveAttribute("open", "");
  await expect(college.getByRole("link", { name: /LoRa/ })).toBeVisible();
  await expect(college.getByRole("link", { name: /HTML/ })).toBeVisible();
});

test("an anchor to a closed role opens it", async ({ page }) => {
  await page.goto("/bio#bohol-island-state-university");
  await expect(page.locator("details#bohol-island-state-university")).toHaveAttribute("open", "");
});

test.describe("the contact form", () => {
  test("won't send until every field is filled", async ({ page }) => {
    let posted = false;
    await page.route("**/api/contact", (route) => {
      posted = true;
      return route.fulfill({ json: { success: true } });
    });
    await page.goto("/contact");
    await page.getByRole("button", { name: "Send Message" }).click();
    expect(posted).toBe(false);
    await expect(page.locator("#name:invalid")).toHaveCount(1);
  });

  async function fill(page: Page) {
    await page.locator("#name").fill("Ada Lovelace");
    await page.locator("#email").fill("ada@example.com");
    await page.locator("#subject").click();
    await page.getByRole("option", { name: "Job Opportunity" }).click();
    await page.locator("#message").fill("Hello there.");
  }

  test("says it was sent only when the server accepts it", async ({ page }) => {
    await page.route("**/api/contact", (route) => route.fulfill({ json: { success: true } }));
    await page.goto("/contact");
    await fill(page);
    await page.getByRole("button", { name: "Send Message" }).click();
    await expect(page.getByText("Message sent successfully!")).toBeVisible();
    await expect(page.locator("#name")).toHaveValue("");
  });

  test("says it failed when the server refuses, and keeps the message", async ({ page }) => {
    await page.route("**/api/contact", (route) => route.fulfill({ status: 502, json: { success: false, error: "Failed to send email" } }));
    await page.goto("/contact");
    await fill(page);
    await page.getByRole("button", { name: "Send Message" }).click();
    await expect(page.getByText("Failed to send message")).toBeVisible();
    await expect(page.locator("#message")).toHaveValue("Hello there.");
  });
});

test("titles keep the space around their accent word", async ({ page }) => {
  await page.goto("/bio");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("My Experience");
  await expect(page.getByRole("heading", { level: 2, name: "My Certifications" })).toBeVisible();
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Technologies I Work With" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Latest from the Blog" })).toBeVisible();
});

test("a tech page says built with only when real work used it", async ({ page }) => {
  await page.goto("/tech/amazon-ec2");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Certified in Amazon EC2");
  await page.goto("/tech/spanner");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Built with Spanner");
  // The home rows show only tech used in real work.
  await page.goto("/");
  const rows = page.locator("[data-marquee]");
  await expect(rows.getByRole("link", { name: /Spanner/ }).first()).toBeAttached();
  await expect(rows.getByRole("link", { name: /Amazon EC2/ })).toHaveCount(0);
});

test.describe("the splash", () => {
  const splash = "[data-splash][data-show]";

  test("greets every load, then opens the page; moving between pages doesn't replay it", async ({ page }) => {
    await page.goto("/", { waitUntil: "commit" });
    await expect(page.locator(splash)).toBeVisible();
    await expect(page.locator("[data-splash]")).toHaveCount(0, { timeout: 8000 });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    // A link is a view-transition swap, not a load: no splash.
    await page.getByRole("link", { name: "View Projects" }).click();
    await expect(page).toHaveURL(/\/projects$/);
    await expect(page.locator(splash)).toHaveCount(0);
    // A reload is a load: it greets again.
    await page.reload({ waitUntil: "commit" });
    await expect(page.locator(splash)).toBeVisible();
    await expect(page.locator("[data-splash]")).toHaveCount(0, { timeout: 8000 });
  });

  test("stays away under reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator(splash)).toHaveCount(0);
  });

  test("stays away under Data Saver", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "connection", { value: { saveData: true } });
    });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator(splash)).toHaveCount(0);
  });
});
