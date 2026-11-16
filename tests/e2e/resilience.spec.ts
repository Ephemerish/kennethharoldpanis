/**
 * The site works in any condition (KHP §7.8): with script off, with every
 * image failing, with storage refused, and with the search index failing.
 * Each condition costs a feature, never the page.
 */
import { expect, test, type Page } from "@playwright/test";

const pages = ["/", "/bio", "/projects", "/projects/pundo", "/blogs", "/contact", "/tech/react"];
const isMobile = (name: string) => name === "mobile";

async function errorsOn(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

test.describe("with script off", () => {
  test.use({ javaScriptEnabled: false });

  for (const path of pages) {
    test(`${path} still reads, and every page is reachable`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      // The top bar's links are there at every width, as a row on a phone.
      for (const name of ["Bio", "Projects", "Blogs", "Contact"]) {
        await expect(page.getByRole("navigation").getByRole("link", { name, exact: true }).filter({ visible: true }).first()).toBeVisible();
      }
      // Controls that need script are hidden, not dead.
      await expect(page.getByRole("button", { name: "Toggle menu" })).toBeHidden();
    });
  }

  test("the contact form posts and lands on a page that says what happened", async ({ page }) => {
    test.skip(!!process.env.RESEND_API_KEY, "With a real key this would send an email.");
    await page.goto("/contact");
    await page.locator("#name").fill("Ada Lovelace");
    await page.locator("#email").fill("ada@example.com");
    await page.locator("select#subject").selectOption("job-opportunity");
    await page.locator("#message").fill("Hello there.");
    await page.getByRole("button", { name: "Send Message" }).click();
    // No email service in tests, so the honest answer is "not sent", with the address to use instead.
    await expect(page).toHaveURL(/\/contact\/not-sent$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Message Not Sent");
    await expect(page.getByText("[at]")).toBeVisible();
  });
});

test("a form posted without script is redirected, never shown raw JSON", async ({ request }, info) => {
  // A browser sends its origin with a form; Astro refuses a cross-site post without one.
  const Origin = String(info.project.use.baseURL);
  // The honeypot answers "sent" without sending, so this checks the success path safely.
  const sent = await request.post("/api/contact", {
    form: { name: "Bot", email: "bot@example.com", subject: "freelance", message: "x", website: "spam" },
    headers: { Accept: "text/html", Origin },
    maxRedirects: 0,
  });
  expect(sent.status()).toBe(303);
  expect(sent.headers().location).toBe("/thank-you");
  const refused = await request.post("/api/contact", { form: { name: "" }, headers: { Accept: "text/html", Origin }, maxRedirects: 0 });
  expect(refused.headers().location).toBe("/contact/not-sent");
  const json = await request.post("/api/contact", { form: { name: "" }, headers: { Accept: "application/json", Origin } });
  expect(json.status()).toBe(400);
});

test("with every image failing, the layout holds and shows no broken icons", async ({ page }) => {
  await page.route(/\.(png|jpe?g|svg|webp|avif|gif)(\?.*)?$/, (route) => route.abort());
  for (const path of ["/", "/bio", "/projects"]) {
    await page.goto(path, { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const shown = await page.evaluate(() =>
      [...document.images].filter((img) => img.complete && img.naturalWidth === 0 && !img.hasAttribute("data-broken") && img.loading !== "lazy").length
    );
    expect(shown, `${path}: failed images still showing`).toBe(0);
    const sideways = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
    expect(sideways, `${path}: sideways scroll`).toBe(false);
  }
});

test("with storage refused, the theme still switches and nothing throws", async ({ page }, info) => {
  const errors = await errorsOn(page);
  await page.addInitScript(() => {
    for (const name of ["localStorage", "sessionStorage"]) {
      Object.defineProperty(window, name, { get() { throw new Error("Storage is disabled"); } });
    }
  });
  await page.goto("/");
  await page.waitForFunction(() => !document.querySelector('astro-island[component-url*="Navbar"][ssr]'));
  if (isMobile(info.project.name)) await page.getByRole("button", { name: "Toggle menu" }).click();
  await page.getByRole("button", { name: /Switch to dark theme/ }).first().click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  expect(errors).toEqual([]);
});

test("when the search index fails, search says so", async ({ page }, info) => {
  test.skip(isMobile(info.project.name), "The same component inside the mobile menu.");
  await page.route("**/search.json", (route) => route.fulfill({ status: 500, body: "" }));
  await page.goto("/");
  await page.waitForFunction(() => !document.querySelector('astro-island[component-url*="Navbar"][ssr]'));
  await page.locator("input[data-search-input]:visible").fill("react");
  await expect(page.getByText("Search isn't available right now.")).toBeVisible();
});
