/**
 * Measuring a page the way Chrome's Core Web Vitals do, from inside the page
 * (KHP §7.7): Largest Contentful Paint, Cumulative Layout Shift, long tasks
 * (for Total Blocking Time) and event timings (for Interaction to Next Paint).
 */
import type { Page } from "@playwright/test";

declare global {
  interface Window {
    __vitals: { lcp: number; cls: number; longTasks: number[]; events: number[] };
  }
}

/** Installs the observers before any page script runs. */
export async function observeVitals(page: Page) {
  await page.addInitScript(() => {
    const v = (window.__vitals = { lcp: 0, cls: 0, longTasks: [] as number[], events: [] as number[] });
    const watch = (type: string, fn: (entry: any) => void, extra: object = {}) => {
      try {
        new PerformanceObserver((list) => list.getEntries().forEach(fn)).observe({ type, buffered: true, ...extra } as PerformanceObserverInit);
      } catch {
        // An entry type this browser doesn't report.
      }
    };
    watch("largest-contentful-paint", (e) => (v.lcp = e.startTime));
    watch("layout-shift", (e) => {
      if (!e.hadRecentInput) v.cls += e.value;
    });
    watch("longtask", (e) => v.longTasks.push(e.duration));
    watch("event", (e) => e.interactionId && v.events.push(e.duration), { durationThreshold: 16 });
  });
}

/** Slows the CPU like a mid-range phone and the network like good 4G. */
export async function throttle(page: Page, cpu = 4) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpu });
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 40,
    downloadThroughput: (12 * 1024 * 1024) / 8,
    uploadThroughput: (3 * 1024 * 1024) / 8,
  });
}

export async function readVitals(page: Page) {
  return page.evaluate(() => {
    const v = window.__vitals;
    const tbt = v.longTasks.reduce((sum, d) => sum + Math.max(0, d - 50), 0);
    const inp = v.events.length ? Math.max(...v.events) : 0;
    const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
    const js = resources.filter((r) => r.initiatorType === "script" || r.name.endsWith(".js"));
    const jsKb = js.reduce((sum, r) => sum + (r.transferSize || r.encodedBodySize), 0) / 1024;
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const htmlKb = (nav?.transferSize || nav?.encodedBodySize || 0) / 1024;
    return { lcp: v.lcp, cls: v.cls, tbt, inp, jsKb, htmlKb };
  });
}

/**
 * Scrolls the whole page at a brisk pace (about 2,400 px a second at 60fps)
 * and returns how long each frame took.
 */
export async function scrollFrames(page: Page): Promise<number[]> {
  return page.evaluate(
    () =>
      new Promise<number[]>((resolve) => {
        const frames: number[] = [];
        const end = document.documentElement.scrollHeight - innerHeight;
        let y = 0;
        let last = performance.now();
        const step = (now: number) => {
          frames.push(now - last);
          last = now;
          y = Math.min(end, y + 40);
          window.scrollTo(0, y);
          if (y < end) requestAnimationFrame(step);
          else requestAnimationFrame(() => resolve(frames.slice(1)));
        };
        requestAnimationFrame(step);
      })
  );
}

export const percentile = (values: number[], p: number) => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length))];
};
