import type { APIRoute } from "astro";
import { site } from "@data/site";

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${new URL("/sitemap.xml", site.url)}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
