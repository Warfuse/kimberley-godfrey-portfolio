import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { test } from "node:test";
import {
  scenes,
  sourceScreens,
  selectScene,
  nextScene,
  previousScene,
} from "../public/airalo/journey.mjs";

test("Airalo journey preserves supplied sample balances and navigation boundaries", () => {
  assert.equal(scenes.length, 7);
  assert.equal(new Set(scenes.map((s) => s.id)).size, 7);
  assert.equal(selectScene("ready").data, "10 GB");
  assert.equal(selectScene("low").data, "0.8 GB");
  assert.equal(selectScene("expiry").days, "4 days");
  assert.equal(selectScene("topup").data, "5.8 GB");
  assert.equal(selectScene("topup").days, selectScene("expiry").days);
  assert.equal(selectScene("topup").airmoney, "US$3.20");
  assert.equal(selectScene("airmoney").airmoney, "US$3.73");
  for (let i = 0; i < scenes.length; i++) {
    assert.equal(
      nextScene(scenes[i].id).id,
      scenes[(i + 1) % scenes.length].id,
    );
    assert.equal(previousScene(scenes[i].id).id, scenes[Math.max(0, i - 1)].id);
  }
  assert.equal(selectScene("unknown").id, "ready");
  assert.equal(nextScene("unknown").id, "ready");
  assert.equal(previousScene("unknown").id, "ready");
});

test("all twelve original captures are present and unchanged", async () => {
  const manifest = JSON.parse(
    await readFile(
      new URL("../docs/airalo/source-images.json", import.meta.url),
      "utf8",
    ),
  );
  assert.equal(sourceScreens.length, 12);
  assert.equal(new Set(sourceScreens.map((s) => s.image)).size, 12);
  assert.deepEqual(
    new Set(sourceScreens.map((s) => s.image)),
    new Set(manifest.map((s) => s.file)),
  );
  for (const source of manifest) {
    const bytes = await readFile(
      new URL(`../public/airalo/assets/${source.file}`, import.meta.url),
    );
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      source.sha256,
      source.file,
    );
  }
});
