import assert from "node:assert/strict";
import { loadWorker } from "./load-worker.mjs";
const { HiloReports } = await loadWorker();
const state = new Map();
let queue = Promise.resolve();
const storage = {
  async get(k) {
    return structuredClone(state.get(k));
  },
  async put(k, v) {
    state.set(k, structuredClone(v));
  },
  async delete(k) {
    state.delete(k);
  },
  transaction(fn) {
    const p = queue.then(() => fn(storage));
    queue = p.catch(() => {});
    return p;
  },
};
const env = {
  ANTHROPIC_API_KEY: "test-only-dummy",
  ANTHROPIC_MODEL: "model",
  DATA_VERSION: "test",
  AI_ENABLED_UNTIL: Date.now() + 60000,
};
const report = {
  headline: "Fictional result",
  observations: ["The fictional night average changed."],
  discussion_points: ["What context should I record?"],
  lifestyle_ideas: [],
  uncertainty: "Fictional only.",
};
let calls = 0;
globalThis.fetch = async () => {
  calls++;
  return Response.json({
    model: "model",
    content: [{ type: "text", text: JSON.stringify(report) }],
  });
};
const doObject = new HiloReports({ storage }, env);
assert.equal((await doObject.summary("overnight:summary")).status, 200);
assert.equal(
  (await (await doObject.summary("overnight:summary")).json()).cached,
  true,
);
assert.equal(calls, 1, "repeat request must not spend another API call");
state.set("budget", {
  day: new Date().toISOString().slice(0, 10),
  month: new Date().toISOString().slice(0, 7),
  daily: 11,
  monthly: 11,
});
const responses = await Promise.all(
  ["quiet-week:gp", "steadier:gp", "limited:gp"].map((s) =>
    doObject.summary(s),
  ),
);
assert.equal(
  responses.filter((r) => r.status === 200).length,
  1,
  "concurrent requests cannot overrun daily reservation",
);
assert.equal(calls, 2);
assert.equal((await doObject.summary("real-patient:summary")).status, 400);
assert.equal(calls, 2);
assert.equal(
  (await (await doObject.summary("overnight:summary")).json()).cached,
  true,
  "cache still works after generation budget exhausted",
);
console.log(
  "Real coordinator code: cached report avoids paid call; concurrent requests respect hard daily cap; unsupported context rejected.",
);
