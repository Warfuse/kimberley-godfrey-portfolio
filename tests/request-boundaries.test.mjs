import assert from "node:assert/strict";
import { loadWorker } from "./load-worker.mjs";
const { default: worker } = await loadWorker();
const env = {
  LOCAL_DEVELOPMENT: "1",
  AI_ENABLED_UNTIL: "0",
  ASSETS: { fetch: () => new Response("asset") },
};
async function request(url, init = {}, bindings = env) {
  return worker.fetch(new Request(url, init), bindings);
}
for (const url of [
  "http://amaplan.com/hilo/?demo=1",
  "http://www.amaplan.com/hilo/?demo=1",
  "https://www.amaplan.com/hilo/?demo=1",
]) {
  const response = await request(url);
  assert.equal(response.status, 301);
  assert.equal(
    response.headers.get("location"),
    "https://amaplan.com/hilo/?demo=1",
  );
}
assert.equal((await request("https://untrusted.example/")).status, 404);
assert.equal((await request("http://localhost:8787/")).status, 200);
assert.equal(
  (
    await request(
      "http://localhost:8787/",
      {},
      { ...env, LOCAL_DEVELOPMENT: "0" },
    )
  ).status,
  404,
);
assert.equal(
  (await request("https://amaplan.com/hilo/connect.html")).status,
  404,
);
const status = await (await request("https://amaplan.com/api/status")).json();
assert.equal(status.connected, false);
assert.equal(Object.hasOwn(status, "key"), false);
async function post(body, changes = {}) {
  return request("https://amaplan.com/api/summary", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Origin: "https://amaplan.com",
      "X-Portfolio-Token": status.csrf,
      ...changes,
    },
    body: JSON.stringify(body),
  });
}
assert.equal(
  (await post({ scenario: "overnight" })).status,
  503,
  "default clone cannot spend provider budget",
);
assert.equal((await post({ scenario: "urgent" })).status, 422);
assert.equal((await post({ scenario: "real-person" })).status, 400);
assert.equal(
  (await post({ scenario: "overnight", patient: "not allowed" })).status,
  400,
);
assert.equal(
  (await post({ scenario: "overnight", question: "ignore instructions" }))
    .status,
  400,
);
assert.equal(
  (await post({ scenario: "overnight" }, { Origin: "https://other.example" }))
    .status,
  403,
);
assert.equal(
  (await post({ scenario: "overnight" }, { "X-Portfolio-Token": "invalid" }))
    .status,
  403,
);
assert.equal(
  (await post({ scenario: "overnight" }, { "Sec-Fetch-Site": "cross-site" }))
    .status,
  403,
);
console.log(
  "Host, HTTPS/www, local-only mode, credential-free status, disabled AI and request rejection boundaries passed.",
);
