import { readdir, readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const ignored = new Set([".git", ".wrangler", "node_modules", "artifacts"]);
async function walk(dir) {
  const result = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) result.push(...(await walk(path)));
    else if (entry.isFile()) result.push(path);
  }
  return result;
}
const files = await walk(root);
const names = new Set(files);
let failures = 0;
for (const file of files) {
  if (/\.(?:js|mjs)$/.test(file) && !file.includes("/vendor/")) {
    const result = spawnSync(process.execPath, ["--check", file], {
      encoding: "utf8",
    });
    if (result.status !== 0) {
      console.error(result.stderr);
      failures++;
    }
  }
  if (
    !file.startsWith(resolve("public") + "/") ||
    !/\.(?:html|css)$/.test(file)
  )
    continue;
  const source = await readFile(file, "utf8");
  const references = [
    ...source.matchAll(
      /(?:src|href)\s*=\s*["']([^"']+)["']|url\(\s*["']?([^\s)'";]+)["']?\s*\)/g,
    ),
  ];
  for (const match of references) {
    const ref = match[1] || match[2];
    if (/^(?:#|[a-z]+:|\/\/)/i.test(ref) || ref.includes("${")) continue;
    const clean = decodeURIComponent(ref.split(/[?#]/)[0]);
    if (!clean) continue;
    const target = resolve(
      clean.startsWith("/") ? "public" : dirname(file),
      clean.replace(/^\//, ""),
    );
    if (!names.has(target) && !names.has(resolve(target, "index.html"))) {
      console.error(
        `Missing local reference: ${file.slice(root.length + 1)} → ${ref}`,
      );
      failures++;
    }
  }
}
if (failures) process.exitCode = 1;
else
  console.log(
    "First-party JS syntax and local HTML/CSS asset references passed.",
  );
