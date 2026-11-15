import assert from "node:assert/strict";
import {
  calculate,
  defaults,
  limits,
} from "../public/prototypes/calculator-model.mjs";
const base = calculate(defaults);
assert.equal(base.loan, 274000);
assert.equal(base.interest, 20550);
assert.equal(base.origination, 5480);
assert.equal(base.acquisition, 8540);
assert.equal(base.carry, 3600);
assert.equal(base.sale, 20000);
assert.equal(base.total, 382170);
assert.equal(base.profit, 17830);
assert.equal(base.cash, 108170);
assert.equal(base.tier, "Good");
const loss = calculate({ ...defaults, rehab: 110000, months: 15, arv: 360000 });
assert.equal(loss.profit, -77850);
assert.equal(loss.tier, "Losing");
const higher = calculate({ ...defaults, arv: 475000 });
assert.equal(higher.profit - base.profit, 75000 * (1 - defaults.broker / 100));
const cashPurchase = calculate({ ...defaults, purchaseLtv: 0, rehabLtv: 0 });
assert.equal(cashPurchase.interest, 0);
assert.equal(cashPurchase.origination, 0);
assert.equal(cashPurchase.cash, cashPurchase.total);
const zero = calculate(
  Object.fromEntries(Object.keys(defaults).map((k) => [k, 0])),
);
assert.equal(zero.roi, null);
assert.equal(zero.tier, "Unrated");
assert.equal(zero.profit, 0);
for (const key of Object.keys(limits)) {
  assert.throws(() => calculate({ ...defaults, [key]: NaN }), RangeError);
  assert.throws(() => calculate({ ...defaults, [key]: -1 }), RangeError);
  assert.throws(
    () => calculate({ ...defaults, [key]: limits[key][1] + 1 }),
    RangeError,
  );
}
const atBreakEven = calculate({ ...defaults, arv: base.breakEven });
assert.ok(Math.abs(atBreakEven.profit) < 0.00001);
assert.ok(Math.abs(base.roi - (base.profit / base.cash) * 100) < 1e-10);
console.log(
  "Calculator arithmetic, scenario, break-even, zero-denominator and all input-boundary checks passed.",
);
