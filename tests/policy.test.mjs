import assert from "node:assert/strict";
import { reserveBudget, validateReport, limitedJSON } from "../src/policy.mjs";
const now = Date.parse("2026-11-14T12:00:00Z");
let state;
for (let n = 0; n < 12; n++) {
  state = reserveBudget(state, now);
  assert.ok(state);
}
assert.equal(reserveBudget(state, now), null, "hard daily cap");
state = reserveBudget({ ...state, monthly: 40 }, now + 86400000);
assert.equal(state, null, "monthly cap survives a day change");
assert.equal(
  reserveBudget(
    { day: "2026-10-14", month: "2026-10", daily: 12, monthly: 40 },
    now,
  ).monthly,
  1,
  "new month resets safely",
);
const report = {
  headline: "A fictional pattern",
  observations: ["The sample changed."],
  discussion_points: ["What does this mean for me?"],
  lifestyle_ideas: [],
  uncertainty: "Fictional data, not a diagnosis.",
};
assert.deepEqual(validateReport(report), report);
for (const observation of [
  "You have nocturnal hypertension",
  "Double your medication",
  "<script>bad</script>",
])
  assert.throws(() =>
    validateReport({ ...report, observations: [observation] }),
  );
assert.throws(() => validateReport({ ...report, extra: "unsupported" }));
assert.deepEqual(
  await limitedJSON(
    new Request("https://example.com", {
      method: "POST",
      body: '{"scenario":"overnight"}',
    }),
  ),
  { scenario: "overnight" },
);
await assert.rejects(() =>
  limitedJSON(
    new Request("https://example.com", {
      method: "POST",
      body: "x".repeat(2049),
    }),
  ),
);
console.log(
  "Daily/monthly caps, safety/schema validation and request-size limits passed.",
);
