import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  root: __dirname,
  server: {
    port: 3000, // Ensure it matches the Docker exposed port
    host: "0.0.0.0",
    allowedHosts: [
      "kennethharoldpanis-230158669164.asia-east1.run.app",
      "kennethharoldpanis.com",
      "www.kennethharoldpanis.com",
    ],
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
  },
});
