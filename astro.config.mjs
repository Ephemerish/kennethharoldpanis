// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import mdx from "@astrojs/mdx";

import react from "@astrojs/react";

import node from "@astrojs/node";

import rehypeFigure from "./src/app/features/article/rehype-figure.mjs";

// https://astro.build/config
export default defineConfig({
  site: 'https://kennethharoldpanis.com',
  output: 'server', // Per-page prerender flags promote static pages to SSG; the
  // rest stay SSR. Keeps the contact API + any future dynamic routes working.
  prefetch: {
    // Prefetch every internal link on hover so navigations feel instant.
    // viewport mode would also prefetch all in-viewport links; hover is the
    // best balance of speed vs. wasted bandwidth on a portfolio site.
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  redirects: {
    '/certifications': '/bio',
    '/bio/certifications': '/bio',
    '/bio/experience': '/bio',
  },
  // The hosts the site answers on. Without this list Astro treats every
  // request as coming from "localhost", so its same-origin check refuses
  // every form post from the real site with 403 (KHP §7.8). Tests and local
  // runs use 127.0.0.1 and localhost.
  security: {
    allowedDomains: [
      { protocol: "https", hostname: "kennethharoldpanis.com" },
      { protocol: "https", hostname: "www.kennethharoldpanis.com" },
      { protocol: "https", hostname: "kennethharoldpanis-230158669164.asia-east1.run.app" },
      { protocol: "http", hostname: "127.0.0.1" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
  server: {
    port: 3000, // Ensure it matches the Docker exposed port
    host: "0.0.0.0",
    allowedHosts: [
      "kennethharoldpanis-230158669164.asia-east1.run.app",
      "kennethharoldpanis.com",
      "www.kennethharoldpanis.com",
    ],
  },

  markdown: {
    rehypePlugins: [rehypeFigure],
  },

  vite: {
    // Keep a production build from invalidating modules served by a running
    // dev server. Both otherwise share node_modules/.vite by default.
    cacheDir: process.env.NODE_ENV === 'development'
      ? 'node_modules/.vite-dev'
      : 'node_modules/.vite-build',
    plugins: [tailwindcss()],
    // Bundle every island's browser dependencies when the dev server starts.
    // Otherwise Vite finds them on the first visit to a page that uses them
    // (sonner and Radix on /contact), re-bundles, and reloads the page: a
    // multi-second stall in dev. The production build is unaffected.
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "@radix-ui/react-select",
        "sonner",
        "class-variance-authority",
        "clsx",
        "tailwind-merge",
        "@phosphor-icons/react",
        "nanostores",
        "@nanostores/react",
        "@nanostores/query",
        "@chenglou/pretext",
      ],
    },
  },

  integrations: [mdx(), react()],

  // Middleware mode: server.mjs serves dist/client precompressed and hands
  // everything else to Astro (KHP §7.7).
  adapter: node({
    mode: "middleware",
  }),
});
