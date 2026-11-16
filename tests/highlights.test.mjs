import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import {
  highlights,
  isReady,
  selectHighlight,
  remainingConcepts,
} from "../public/highlights.mjs";
assert.equal(
  selectHighlight(""),
  null,
  "general portfolio is the neutral default",
);
assert.equal(selectHighlight("?hilo"), "hilo");
assert.equal(selectHighlight("?HILO"), "hilo");
assert.equal(selectHighlight("?highlight=braze"), "braze");
assert.equal(selectHighlight("?utm_source=email&nevis"), "nevis");
assert.equal(
  selectHighlight("?hilo&braze"),
  "hilo",
  "first recognised key wins",
);
assert.equal(selectHighlight("?xps"), "xps");
assert.equal(selectHighlight("?unknown"), null);
assert.equal(selectHighlight("?__proto__"), null);
assert.equal(selectHighlight("?highlight=%3Cscript%3E"), null);
assert.equal(
  selectHighlight("?hilo=https://untrusted.example"),
  "hilo",
  "values cannot replace allowlisted routes",
);
assert.deepEqual(
  remainingConcepts("hilo").map(([key]) => key),
  ["xps"],
);
assert.deepEqual(
  remainingConcepts("royal").map(([key]) => key),
  ["hilo", "xps"],
);
assert.deepEqual(
  remainingConcepts(null).map(([key]) => key),
  ["hilo", "xps"],
);
const unavailable = { ...highlights, xps: { ...highlights.xps, ready: false } };
assert.equal(selectHighlight("?xps", unavailable), null);
const future = {
  ...highlights,
  xps: {
    name: "XPS",
    kind: "concept",
    ready: true,
    href: "prototypes/xps.html",
    title: ["My task", "My contribution"],
  },
};
assert.equal(selectHighlight("?xps", future), "xps");
assert.deepEqual(
  remainingConcepts("xps", future).map(([key]) => key),
  ["hilo"],
);
assert.deepEqual(
  remainingConcepts("hilo", future).map(([key]) => key),
  ["xps"],
);
for (const [key, item] of Object.entries(highlights)) {
  if (!isReady(item)) continue;
  assert.match(item.href, /^(?:(?:hilo|xps)\/|prototypes\/[a-z-]+\.html)$/);
  assert.equal(item.title.length, 2);
  assert.ok(item.status && item.image && item.imageAlt && item.summary, key);
}
console.log(
  "Highlight routing, safe fallbacks, query injection boundaries and concept promotion passed.",
);

for (const item of Object.values(highlights).filter(isReady)) {
  await access(new URL(`../public/${item.image}`, import.meta.url));
  await access(
    new URL(
      `../public/${item.href.endsWith("/") ? item.href + "index.html" : item.href}`,
      import.meta.url,
    ),
  );
}
