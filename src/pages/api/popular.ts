import type { APIRoute } from "astro";

export const prerender = false;

/**
 * Thin server-side pass-through for the `popular-route-segments` Supabase edge
 * function. Returns the function's response verbatim (per-section
 * { segment, count } lists) so the search island can order its "Popular"
 * suggestions by real traffic. The only job here is keeping the Supabase key
 * server-side, mirroring /api/analytics. Fails soft to empty sections so the
 * island falls back to static usage counts.
 */

// Match lib/supabase.ts: non-PUBLIC import.meta.env vars are inlined at build
// time (often undefined in CI/Docker), so fall back to runtime process.env,
// which is where the deployed server actually gets its Supabase config.
const supabaseUrl = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey =
  import.meta.env.SUPABASE_ANON_KEY ||
  import.meta.env.SUPABASE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_KEY;

const FN_BASE = supabaseUrl
  ? `${supabaseUrl}/functions/v1/popular-route-segments`
  : null;

const EMPTY = { tags: [], tech: [], blogs: [], projects: [] };

export const GET: APIRoute = async () => {
  let body: unknown = EMPTY;
  if (FN_BASE && supabaseKey) {
    try {
      // One call to the base function returns every section in a single scan.
      const res = await fetch(FN_BASE, {
        headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
      });
      if (res.ok) body = await res.json();
    } catch {
      // Fail soft: the island falls back to static usage counts.
    }
  }
  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json",
      // Keep it fresh; popularity is cheap to recompute and low-traffic.
      "Cache-Control": "public, max-age=15",
    },
  });
};
