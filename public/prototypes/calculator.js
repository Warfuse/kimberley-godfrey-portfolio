import { defaults, limits, calculate } from "./calculator-model.mjs";
const labels = {
  purchase: "Purchase price ($)",
  rehab: "Renovation budget ($)",
  arv: "After-repair value ($)",
  months: "Hold time (months)",
  purchaseLtv: "Purchase LTV (%)",
  rehabLtv: "Renovation LTV (%)",
  rate: "Annual interest rate (%)",
  points: "Origination points (%)",
  attorney: "Attorney fee ($)",
  appraisal: "Appraisal ($)",
  mortgageTax: "Mortgage tax (%)",
  title: "Title insurance (%)",
  monthlyTax: "Property tax & HOA ($/month)",
  insurance: "Insurance ($/month)",
  transfer: "Transfer tax (%)",
  broker: "Broker fee (% of resale)",
  other: "Other costs ($)",
};
const groups = {
  "deal-fields": ["purchase", "rehab", "arv", "months"],
  "finance-fields": ["purchaseLtv", "rehabLtv", "rate", "points"],
  "fee-fields": [
    "attorney",
    "appraisal",
    "mortgageTax",
    "title",
    "monthlyTax",
    "insurance",
    "transfer",
    "broker",
    "other",
  ],
};
let values = { ...defaults },
  result,
  saved = null,
  timer;
const money = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
const pct = (n) =>
  n === null ? "N/A" : `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;
for (const [id, keys] of Object.entries(groups)) {
  document.getElementById(id).innerHTML = keys
    .map((k) => {
      let [lo, hi] = limits[k],
        step = ["purchase", "rehab", "arv"].includes(k)
          ? 1000
          : [
                "months",
                "attorney",
                "appraisal",
                "monthlyTax",
                "insurance",
                "other",
              ].includes(k)
            ? 1
            : 0.1;
      return `<div class="field"><label for="${k}">${labels[k]}</label><input id="${k}" type="number" inputmode="decimal" min="${lo}" max="${hi}" step="${step}" value="${values[k]}" required><input data-range="${k}" type="range" aria-label="${labels[k]} slider" min="${lo}" max="${hi}" step="${step}" value="${values[k]}"><span><span>${lo.toLocaleString()}</span><span>${hi.toLocaleString()}</span></span></div>`;
    })
    .join("");
}
function read() {
  for (const k of Object.keys(defaults)) {
    const el = document.getElementById(k);
    values[k] = el.value.trim() === "" ? NaN : Number(el.value);
  }
  return values;
}
function render() {
  try {
    result = calculate(read());
    document.getElementById("input-error").textContent = "";
    document.getElementById("profit").textContent = money(result.profit);
    document.getElementById("roi").textContent = pct(result.roi);
    document.getElementById("mobile-profit").textContent = money(result.profit);
    document.getElementById("mobile-roi").textContent = pct(result.roi);
    const health = document.getElementById("health");
    health.dataset.tier = result.tier.toLowerCase();
    health.textContent = `${result.tier} deal · ${result.tier === "Losing" ? "projected loss" : result.roi === null ? "ROI cannot be calculated" : pct(result.roi) + " cash-on-cash"}`;
    clearTimeout(timer);
    timer = setTimeout(() => {
      document.getElementById("verdict").textContent =
        `This scenario projects ${result.profit < 0 ? "a loss" : "a profit"} of ${money(Math.abs(result.profit))} against ${money(result.total)} in total project costs.`;
    }, 180);
    document.getElementById("breakdown").innerHTML = [
      ["Purchase loan", result.purchaseLoan],
      ["Renovation loan", result.rehabLoan],
      ["Interest", result.interest],
      ["Origination", result.origination],
      ["Acquisition fees & taxes", result.acquisition],
      ["Holding costs", result.carry],
      ["Selling costs", result.sale],
      ["Other", values.other],
      ["Cash required (simplified)", result.cash],
      ["Break-even resale value", result.breakEven],
      ["Total project cost", result.total],
    ]
      .map(([k, n]) => `<div><span>${k}</span><span>${money(n)}</span></div>`)
      .join("");
    const parts = [
        values.purchase,
        values.rehab,
        result.fees,
        Math.max(0, result.profit),
      ],
      sum = parts.reduce((a, b) => a + b, 0);
    document
      .querySelectorAll(".cost-bar span")
      .forEach(
        (el, i) => (el.style.width = `${sum ? (parts[i] / sum) * 100 : 0}%`),
      );
    document.querySelector("#save").disabled = false;
    document.querySelector("#download").disabled = false;
    if (saved) showComparison();
  } catch (e) {
    result = null;
    clearTimeout(timer);
    const bad = Object.keys(limits).find(
      (k) =>
        !Number.isFinite(values[k]) ||
        values[k] < limits[k][0] ||
        values[k] > limits[k][1],
    );
    document.getElementById("input-error").textContent = bad
      ? `Enter ${labels[bad]} between ${limits[bad][0].toLocaleString()} and ${limits[bad][1].toLocaleString()}.`
      : e.message;
    document.getElementById("snapshot").textContent = saved
      ? "Saved comparison is retained. Complete your inputs to compare."
      : "";
    document.getElementById("profit").textContent = "—";
    document.getElementById("roi").textContent = "—";
    document.getElementById("mobile-profit").textContent = "—";
    document.getElementById("mobile-roi").textContent = "—";
    document.getElementById("health").textContent = "Check your inputs";
    document.getElementById("verdict").textContent =
      "Complete every field with a value in its stated range.";
    document.getElementById("breakdown").innerHTML = "";
    document
      .querySelectorAll(".cost-bar span")
      .forEach((el) => (el.style.width = "0%"));
    document.querySelector("#save").disabled = true;
    document.querySelector("#download").disabled = true;
  }
}
function setValues(next) {
  values = { ...next };
  for (const k of Object.keys(defaults)) {
    document.getElementById(k).value = values[k];
    document.querySelector(`[data-range="${k}"]`).value = values[k];
  }
  render();
}
document
  .querySelector("#calculator")
  .addEventListener("submit", (e) => e.preventDefault());
document.querySelector("#calculator").addEventListener("input", (e) => {
  let key = e.target.dataset.range;
  if (key) {
    document.getElementById(key).value = e.target.value;
  } else if (e.target.type === "number") {
    document.querySelector(`[data-range="${e.target.id}"]`).value =
      e.target.value;
  }
  render();
});
document.querySelector("#reset").onclick = () => {
  saved = null;
  document.getElementById("snapshot").textContent = "";
  setValues(defaults);
};
document.querySelectorAll("[data-scenario]").forEach(
  (b) =>
    (b.onclick = () =>
      setValues({
        ...defaults,
        ...({
          optimistic: { arv: 475000 },
          stress: { rehab: 110000, months: 15, arv: 360000 },
        }[b.dataset.scenario] || {}),
      })),
);
function showComparison() {
  document.getElementById("snapshot").textContent =
    `Saved: ${money(saved.profit)} profit / ${pct(saved.roi)} ROI. Current profit difference: ${money(result.profit - saved.profit)}.`;
}
document.getElementById("save").onclick = () => {
  saved = { ...result };
  showComparison();
};
document.getElementById("download").onclick = () => {
  if (!result) return;
  const text = `EXPRESS CAPITAL — PORTFOLIO PROTOTYPE\nIllustrative model, not a quote.\n\n${Object.entries(
    values,
  )
    .map(([k, v]) => `${labels[k]}: ${v}`)
    .join(
      "\n",
    )}\n\nProfit: ${money(result.profit)}\nCash-on-cash ROI: ${pct(result.roi)}\nTotal cost: ${money(result.total)}\nCash required: ${money(result.cash)}\n\nFull principal drawn day one; simple interest; see on-page assumptions. Demo health tiers are not lender approved.\n`;
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "deal-snapshot.txt";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
render();
