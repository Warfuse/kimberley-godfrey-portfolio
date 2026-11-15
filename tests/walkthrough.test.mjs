import { strict as assert } from "node:assert";
import { guideStage } from "../public/hilo/walkthrough.js";
const state = {
  enabled: true,
  chosen: false,
  view: "overview",
  busy: false,
  hasReport: false,
  urgent: false,
};
assert.equal(guideStage(state), "choose");
assert.equal(guideStage({ ...state, chosen: true }), "explain");
assert.equal(guideStage({ ...state, view: "ask" }), "generate");
assert.equal(guideStage({ ...state, view: "ask", hasReport: true }), "ready");
assert.equal(guideStage({ ...state, view: "ask", busy: true }), null);
assert.equal(guideStage({ ...state, enabled: false }), null);
assert.equal(guideStage({ ...state, urgent: true }), null);
assert.equal(guideStage({ ...state, view: "gp" }), null);
assert.equal(guideStage({ ...state, view: "reminders" }), null);
console.log(
  "Walkthrough progression, dismissal, loading and optional screens: passed",
);
