import { readdir, readFile } from "node:fs/promises";
import { resolve, relative } from "node:path";

const ignored = new Set([".git", ".wrangler", "node_modules", "artifacts"]);
const forbidden =
  /(?:^|\/)(?:\.dev\.vars(?:\..*)?|\.env(?:\..*)?|wrangler\.production\.jsonc|connect\.html|keychain\.py|server\.py|.*\.(?:pem|key|p12|log|keynote)|godaddy-dns-backup\.txt|portfolio-source\.pdf|Kimberley-Godfrey-CV\.pdf)$/i;
const patterns = [
  /sk-ant-[A-Za-z0-9_-]{20,}/,
  /(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,})/,
  /AKIA[0-9A-Z]{16}/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /(?:ANTHROPIC_API_KEY|CLOUDFLARE_API_TOKEN)\s*[:=]\s*["']?[A-Za-z0-9_-]{24,}/,
  /\/Users\/[A-Za-z0-9._-]+\//,
];
let count = 0;
async function inspect(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const path = resolve(dir, entry.name),
      name = relative(process.cwd(), path);
    if (entry.isSymbolicLink())
      throw Error(`Review symlink before publication: ${name}`);
    if (entry.isDirectory()) {
      await inspect(path);
      continue;
    }
    if (name === ".dev.vars.example") continue;
    if (forbidden.test(name))
      throw Error(`Private/local file must not be published: ${name}`);
    const bytes = await readFile(path);
    // Scan binary assets too for contiguous credential strings; this is not OCR or a full-history scanner.
    const text = bytes.toString("utf8");
    for (const pattern of patterns)
      if (pattern.test(text))
        throw Error(
          `Potential private data in ${name}; inspect locally. Matched value withheld.`,
        );
    count++;
  }
}
await inspect(process.cwd());
console.log(
  `Publication checks passed for ${count} files. No common credential patterns or private/local files found.`,
);
