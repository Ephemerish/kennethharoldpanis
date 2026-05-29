// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import mdx from "@astrojs/mdx";

import react from "@astrojs/react";

import node from "@astrojs/node";

import rehypeFigure from "./src/lib/rehype-figure.mjs";

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
    '/certifications': '/bio/certifications',
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
    plugins: [tailwindcss()],
  },

  integrations: [mdx(), react()],

  adapter: node({
    mode: "standalone",
  }),
});