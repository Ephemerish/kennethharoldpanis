/**
 * End-to-end and performance tests (docs/systems/testing.md, KHP §9.2).
 * They run against the production build served by server.mjs, so what they
 * measure is what visitors get. Locally they drive the installed Chrome; CI
 * installs Playwright's Chromium.
 */
import { defineConfig } from "@playwright/test";

const PORT = 4400;

export default defineConfig({
  testDir: "tests",
  testMatch: /.*\.spec\.ts/,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    channel: process.env.CI ? undefined : "chrome",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "node server.mjs",
    env: { PORT: String(PORT), HOST: "127.0.0.1" },
    url: `http://127.0.0.1:${PORT}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  projects: [
    { name: "desktop", testDir: "tests/e2e", use: { viewport: { width: 1440, height: 900 } } },
    { name: "mobile", testDir: "tests/e2e", use: { viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true } },
    // One page at a time, so measurements don't compete for the CPU.
    { name: "performance", testDir: "tests/perf", fullyParallel: false, use: { viewport: { width: 1440, height: 900 } } },
  ],
});
