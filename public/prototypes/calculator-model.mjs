export const defaults = {
  purchase: 250000,
  rehab: 74000,
  arv: 400000,
  months: 9,
  purchaseLtv: 80,
  rehabLtv: 100,
  rate: 10,
  points: 2,
  attorney: 1500,
  appraisal: 550,
  mortgageTax: 1,
  title: 0.5,
  monthlyTax: 300,
  insurance: 100,
  transfer: 1,
  broker: 5,
  other: 0,
};
export const limits = {
  purchase: [0, 2000000],
  rehab: [0, 1000000],
  arv: [0, 5000000],
  months: [0, 36],
  purchaseLtv: [0, 100],
  rehabLtv: [0, 100],
  rate: [0, 30],
  points: [0, 10],
  attorney: [0, 20000],
  appraisal: [0, 5000],
  mortgageTax: [0, 5],
  title: [0, 5],
  monthlyTax: [0, 10000],
  insurance: [0, 5000],
  transfer: [0, 10],
  broker: [0, 15],
  other: [0, 100000],
};
export function calculate(v) {
  for (const [k, [lo, hi]] of Object.entries(limits)) {
    if (!Number.isFinite(v[k]) || v[k] < lo || v[k] > hi)
      throw new RangeError(`Enter ${k} between ${lo} and ${hi}.`);
  }
  const purchaseLoan = (v.purchase * v.purchaseLtv) / 100,
    rehabLoan = (v.rehab * v.rehabLtv) / 100,
    loan = purchaseLoan + rehabLoan,
    interest = (((loan * v.rate) / 100) * v.months) / 12,
    origination = (loan * v.points) / 100,
    acquisition =
      v.attorney +
      v.appraisal +
      (loan * v.mortgageTax) / 100 +
      (v.purchase * v.title) / 100 +
      (v.purchase * v.transfer) / 100,
    carry = (v.monthlyTax + v.insurance) * v.months,
    sale = (v.arv * v.broker) / 100,
    fees = interest + origination + acquisition + carry + sale + v.other,
    total = v.purchase + v.rehab + fees,
    profit = v.arv - total,
    cash = v.purchase + v.rehab - loan + fees,
    roi = cash > 0 ? (profit / cash) * 100 : null,
    tier =
      profit < 0
        ? "Losing"
        : roi === null
          ? "Unrated"
          : roi < 10
            ? "Weak"
            : roi < 20
              ? "Good"
              : "Strong";
  return {
    purchaseLoan,
    rehabLoan,
    loan,
    interest,
    origination,
    acquisition,
    carry,
    sale,
    fees,
    total,
    profit,
    cash,
    roi,
    tier,
    breakEven: v.broker < 100 ? (total - sale) / (1 - v.broker / 100) : null,
  };
}
