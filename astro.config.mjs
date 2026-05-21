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
  output: 'server', // Enable server-side rendering
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
    ssr: {
      // Bundle Supabase so the alias below is applied to the server build.
      noExternal: ["@supabase/supabase-js"],
    },
    resolve: {
      alias: {
        // Supabase's ESM entry (dist/esm/wrapper.mjs) re-imports its
        // CommonJS build (dist/main/index.js). Bundled into Astro's ESM
        // server output that CJS file throws "exports is not defined".
        // dist/module/index.js is the pure-ESM build, so pin to it.
        "@supabase/supabase-js":
          "@supabase/supabase-js/dist/module/index.js",
      },
    },
  },

  integrations: [mdx(), react()],

  adapter: node({
    mode: "standalone",
  }),
});