import { readFile } from "node:fs/promises";
export async function loadWorker() {
  const here = new URL("../src/", import.meta.url);
  let source = await readFile(new URL("worker.js", here), "utf8");
  source = source.replace(
    /import\s*\{\s*DurableObject\s*\}\s*from\s*["']cloudflare:workers["'];?/,
    "class DurableObject {constructor(ctx,env){this.ctx=ctx;this.env=env}}",
  );
  for (const name of ["contexts", "system"]) {
    source = source.replace(
      new RegExp(`import\\s+${name}\\s+from\\s+["']\\./${name}\\.json["'];?`),
      `const ${name}=${await readFile(new URL(name + ".json", here), "utf8")};`,
    );
  }
  source = source.replace(
    /["']\.\/policy\.mjs["']/,
    JSON.stringify(new URL("policy.mjs", here).href),
  );
  return import(
    "data:text/javascript;base64," + Buffer.from(source).toString("base64")
  );
}
