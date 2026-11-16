/**
 * The production server (docs/systems/head-and-seo.md, KHP §7.7).
 *
 * Files under dist/client are served directly, in the smallest encoding the
 * browser accepts (Brotli, gzip, or none; written at build time by
 * scripts/compress-assets.mjs), with long caching for hashed assets. Anything
 * else goes to Astro: the API, server-rendered routes and the 404 page.
 */
import http from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, join, normalize, resolve, sep } from "node:path";
import { handler as astro } from "./dist/server/entry.mjs";

const ROOT = resolve(import.meta.dirname, "dist/client");
const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? "0.0.0.0";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
};

/** Hashed build output never changes; everything else is checked each time. */
function cacheControl(path) {
  if (path.includes(`${sep}_astro${sep}`)) return "public, max-age=31536000, immutable";
  if (path.endsWith(".html")) return "public, max-age=0, must-revalidate";
  return "public, max-age=86400";
}

async function fileFor(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    return null;
  }
  const path = normalize(join(ROOT, decoded));
  if (path !== ROOT && !path.startsWith(ROOT + sep)) return null; // outside dist/client
  for (const candidate of [path, join(path, "index.html")]) {
    try {
      const info = await stat(candidate);
      if (info.isFile()) return { path: candidate, info };
    } catch {}
  }
  return null;
}

async function encodedVariant(path, acceptEncoding) {
  for (const [token, suffix] of [["br", ".br"], ["gzip", ".gz"]]) {
    if (!acceptEncoding.includes(token)) continue;
    try {
      const info = await stat(path + suffix);
      return { path: path + suffix, info, encoding: token };
    } catch {}
  }
  return null;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  if ((req.method === "GET" || req.method === "HEAD") && !url.pathname.startsWith("/api/")) {
    const file = await fileFor(url.pathname);
    if (file) {
      const type = TYPES[extname(file.path).toLowerCase()];
      const encoded = type ? await encodedVariant(file.path, String(req.headers["accept-encoding"] ?? "")) : null;
      const served = encoded ?? file;
      const lastModified = file.info.mtime.toUTCString();
      if (req.headers["if-modified-since"] === lastModified) {
        res.writeHead(304, { "Cache-Control": cacheControl(file.path), "Last-Modified": lastModified });
        return res.end();
      }
      res.writeHead(200, {
        "Content-Type": type ?? "application/octet-stream",
        "Content-Length": served.info.size,
        "Cache-Control": cacheControl(file.path),
        "Last-Modified": lastModified,
        "X-Content-Type-Options": "nosniff",
        Vary: "Accept-Encoding",
        ...(encoded && { "Content-Encoding": encoded.encoding }),
      });
      if (req.method === "HEAD") return res.end();
      return createReadStream(served.path).pipe(res);
    }
  }
  astro(req, res);
});

server.listen(PORT, HOST, () => console.log(`Listening on http://${HOST}:${PORT}`));
