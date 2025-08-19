// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import mdx from "@astrojs/mdx";

import react from "@astrojs/react";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  site: 'https://kennethharoldpanis.com',
  server: {
    port: 3000, // Ensure it matches the Docker exposed port
    host: "0.0.0.0",
    allowedHosts: [
      "kennethharoldpanis-230158669164.asia-east1.run.app",
      "kennethharoldpanis.com",
      "www.kennethharoldpanis.com",
    ],
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [mdx(), react()],

  adapter: node({
    mode: "standalone",
  }),
});