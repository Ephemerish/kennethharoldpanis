/**
 * Writes Brotli (.br) and gzip (.gz) copies of every text file the site
 * serves, once, at build time (KHP §7.7). server.mjs sends the smallest copy a
 * browser accepts, so no request pays to compress.
 */
import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import { join, resolve } from "node:path";
import { promisify } from "node:util";
import zlib from "node:zlib";

const brotli = promisify(zlib.brotliCompress);
const gzip = promisify(zlib.gzip);
const root = resolve(import.meta.dirname, "../dist/client");
const TEXT = /\.(html|js|mjs|css|json|svg|xml|txt|webmanifest)$/;
const MIN_BYTES = 1024;

async function* files(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* files(path);
    else if (TEXT.test(entry.name)) yield path;
  }
}

let count = 0;
let before = 0;
let after = 0;
for await (const file of files(root)) {
  if ((await stat(file)).size < MIN_BYTES) continue;
  const data = await readFile(file);
  const [br, gz] = await Promise.all([
    brotli(data, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11, [zlib.constants.BROTLI_PARAM_SIZE_HINT]: data.length } }),
    gzip(data, { level: 9 }),
  ]);
  await Promise.all([writeFile(`${file}.br`, br), writeFile(`${file}.gz`, gz)]);
  count++;
  before += data.length;
  after += br.length;
}
console.log(`Compressed ${count} files: ${(before / 1024).toFixed(0)} KB down to ${(after / 1024).toFixed(0)} KB with Brotli.`);
