import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

for (const slug of ["pundo", "pidada"]) {
  const html = readFileSync(`dist/client/projects/${slug}/index.html`, "utf8");
  const button = html.match(/<button\b[^>]*data-release-trigger[^>]*>[\s\S]*?<\/button>/)?.[0];
  assert.ok(button, `${slug} has a release-note control`);
  assert.match(button, /aria-label="Open [^"]+ release notes"/);
  assert.doesNotMatch(button, />Release notes<\/span>/);
  assert.match(html, /data-release-dialog/);
}

console.log("Project release controls are icon-only and open a notes drawer.");
