import assert from "node:assert/strict";
import {
  createCase,
  transition,
  caseSummary,
} from "../public/xps/case-model.mjs";
const initial = createCase();
assert.equal(caseSummary(initial).owner, "You");
assert.throws(() => transition(initial, { type: "READY" }));
assert.throws(() => transition(initial, { type: "ACCEPT" }));
assert.throws(() =>
  transition(initial, { type: "SUBMIT", sample: "real-document" }),
);
let current = transition(initial, { type: "SUBMIT", sample: "clear" });
assert.equal(
  initial.stage,
  "needs_document",
  "transitions do not mutate the previous case",
);
assert.equal(current.stage, "under_review");
assert.equal(caseSummary(current).owner, "Administration team");
assert.throws(() => transition(current, { type: "SUBMIT", sample: "clear" }));
assert.throws(() => transition(current, { type: "READY" }));
current = transition(current, { type: "ACCEPT" });
assert.equal(current.stage, "preparing");
assert.equal(caseSummary(current).step, 2);
current = transition(current, { type: "READY" });
assert.equal(current.stage, "ready");
assert.equal(caseSummary(current).owner, "You");
assert.equal(current.events.length, 5);
assert.throws(() => transition(current, { type: "ACCEPT" }));
let returned = transition(createCase(), { type: "SUBMIT", sample: "unclear" });
assert.throws(() => transition(returned, { type: "ACCEPT" }), /unreadable/);
returned = transition(returned, { type: "RETURN" });
assert.equal(returned.stage, "needs_document");
assert.equal(returned.returned, true);
assert.equal(returned.sample, null);
returned = transition(returned, { type: "SUBMIT", sample: "clear" });
assert.equal(returned.returned, false);
returned = transition(returned, { type: "ACCEPT" });
assert.equal(returned.stage, "preparing");
assert.equal(returned.revision, 4);
assert.throws(() =>
  transition({ ...initial, stage: "unsupported" }, { type: "READY" }),
);
assert.throws(() =>
  transition(initial, { type: "SUBMIT", sample: "__proto__" }),
);
console.log(
  "XPS shared case: allowed transitions, unreadable sample, correction loop, immutability and next-owner states passed.",
);

// Readable text tokens: brand cyan is decorative, never small text on white.
function luminance(hex) {
  const rgb = hex
    .match(/[a-f\d]{2}/gi)
    .map((n) => parseInt(n, 16) / 255)
    .map((n) => (n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4));
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}
for (const [ink, paper] of [
  ["00338d", "ffffff"],
  ["526571", "ffffff"],
  ["805100", "fff5dc"],
  ["285d38", "edf5e8"],
]) {
  const a = luminance(ink),
    b = luminance(paper);
  assert.ok((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) >= 4.5);
}
