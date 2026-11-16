import { atom } from "nanostores";
import { nanoquery } from "@nanostores/query";

/**
 * Every call the browser makes to the site's API (docs/systems/search.md,
 * docs/systems/contact.md). Reads are nanoquery fetcher stores, cached and
 * deduped; components subscribe with `useStore(...)`. Writes are plain calls.
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
  /** The logo for dark mode, when the main one is dark ink. */
  imagePathDark?: string;
  date?: string;
}

export type PopularRow = { segment: string; count: number };
export type PopularResponse = Record<
  "tags" | "tech" | "blogs" | "projects",
  PopularRow[]
>;

const [createFetcherStore] = nanoquery({
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

/**
 * Sends the contact form. Throws with the server's words when it is refused,
 * so the form never reports a failed send as sent. A plain call, not a
 * mutator store: nanoquery's mutate() swallows errors.
 */
export async function sendContact(form: FormData): Promise<void> {
  let result: { success?: boolean; error?: string } | null = null;
  try {
    const res = await fetch("/api/contact", { method: "POST", body: form, headers: { Accept: "application/json" } });
    result = await res.json();
  } catch {
    throw new Error("Failed to send message");
  }
  if (!result?.success) throw new Error(result?.error || "Failed to send message");
}
