import { atom } from "nanostores";
import { nanoquery } from "@nanostores/query";

/**
 * One place for every client-side API call. Reads are nanoquery fetcher stores
 * (cached + deduped + loading/error state); writes are mutator stores / helpers.
 * Components subscribe with `useStore(...)` instead of hand-rolling fetch +
 * cache logic per call site.
 */

export type ItemType = "project" | "blog" | "tag" | "tech" | "experience" | "certification";

export interface SearchItem {
  type: ItemType;
  title: string;
  url: string;
  description?: string;
  keywords?: string[];
  count?: number;
  imagePath?: string;
  date?: string;
}

export type PopularRow = { segment: string; count: number };
export type PopularResponse = Record<
  "tags" | "tech" | "blogs" | "projects",
  PopularRow[]
>;

const [createFetcherStore, createMutatorStore] = nanoquery({
  // First key is always the URL; any extra keys are gates (see below).
  fetcher: async (url) => {
    const res = await fetch(String(url));
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return res.json();
  },
  // These payloads change slowly; keep them warm for the session.
  dedupeTime: 5 * 60_000,
  cacheLifetime: 30 * 60_000,
});

// Lazy loading: nothing fetches until the search UI opens and flips this gate.
// A `null` key disables a fetcher store; flipping to "on" triggers the fetch.
const $searchEnabled = atom<"on" | null>(null);
export const enableSearch = () => $searchEnabled.set("on");

export const $searchIndex = createFetcherStore<SearchItem[]>([
  "/search.json",
  $searchEnabled,
]);

export const $popular = createFetcherStore<PopularResponse>([
  "/api/popular",
  $searchEnabled,
]);

// --- Writes -----------------------------------------------------------------

// /api/contact expects multipart FormData (matches the existing form).
export const $sendContact = createMutatorStore<FormData>(async ({ data }) => {
  const res = await fetch("/api/contact", { method: "POST", body: data });
  const result = await res.json();
  if (!result?.success) throw new Error(result?.error || "Failed to send message");
  return result;
});

// Analytics is fire-and-forget telemetry: never block or throw, and use
// keepalive so it still sends during page unload.
export const sendAnalytics = (data: Record<string, unknown>) =>
  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    keepalive: true,
  }).catch(() => {});
