// 4대보험·국민연금 공용 모듈 검증 — 기대값은 손으로 계산한 값(코드 결과를 복사하지 않음)
// 실행: node scripts/check-four-insurance-calculator.mjs
import assert from "node:assert/strict";
import { SOCIAL_INSURANCE_RULES as rules } from "../src/data/socialInsuranceRules.ts";
import { INSURANCE_RATES_2026 } from "../src/data/employeeTaxInsuranceRates2026.ts";
import { calculatePensionMonthly, calculatePensionRateOnly, findRule, roundRational } from "../public/scripts/national-pension-contribution-core.js";
import {
  calculateFourInsuranceComparison,
  calculateHealthInsurance,
  calculatePeriod,
  validatePayrollPeriod,
} from "../public/scripts/four-insurance-core.js";

let passed = 0;
function check(name, fn) {
  fn();
  passed++;
  console.log("통과: " + name);
}

const period = (over = {}) => ({
  month: "2026-11",
  grossPayWon: 3_000_000,
  nonTaxablePayWon: 200_000,
  basisMode: "simple_estimate",
  explicitBases: {},
  applicability: { pension: "applies", health: "applies", employment: "applies" },
  ...over,
});
const byKind = (agg, kind) => agg.items.find((i) => i.kind === kind);
const np = (month, amount, kind = "income_estimate", subscriber = "employee") =>
  calculatePensionMonthly({ month, subscriber, basisInput: { kind, amountWon: amount } }, rules);

// ─── 국민연금 (설계 02 T2) ───
check("T2-01~04 요율 비교 (직장·지역)", () => {
  const cases = [
    ["employee", 2_000_000, 95_000, 100_000, 5_000, 60_000],
    ["employee", 3_000_000, 142_500, 150_000, 7_500, 90_000],
    ["employee", 5_000_000, 237_500, 250_000, 12_500, 150_000],
    ["regional", 3_000_000, 285_000, 300_000, 15_000, 180_000],
  ];
  for (const [subscriber, basis, b, a, d, y] of cases) {
    const r = calculatePensionRateOnly({ subscriber, fixedBasisWon: basis, fromYear: 2026, toYear: 2027 }, rules.pensionRates);
    assert.ok(r.ok);
    assert.equal(roundRational(r.value.before.subscriberWon), b);
    assert.equal(roundRational(r.value.after.subscriberWon), a);
    assert.equal(roundRational(r.value.subscriberDeltaWon), d);
    assert.equal(roundRational(r.value.monthlyDeltaAnnualizedWon), y);
    if (subscriber === "regional") assert.equal(r.value.after.employerWon, null);
  }
});

check("국민연금 월 추정: 천원 미만 절사·상하한·기간", () => {
  assert.equal(np("2026-11", 3_000_000).value.subscriberWon, 142_500);
  assert.equal(np("2027-01", 3_000_000).value.subscriberWon, 150_000);
  const r = np("2026-11", 3_000_500);
  assert.equal(r.value.basisWon, 3_000_000);
  assert.equal(r.value.adjustments[0].kind, "income_rounding");
  assert.equal(np("2026-11", 7_000_000).value.subscriberWon, 313_025); // 상한 6,590,000 × 4.75%
  assert.equal(np("2027-01", 7_000_000).value.subscriberWon, 329_500); // 같은 상한 × 5%
  assert.equal(np("2026-11", 300_000).value.subscriberWon, 19_475); // 하한 410,000 × 4.75%
  assert.equal(np("2026-05", 7_000_000).value.basisWon, 6_370_000); // 2025.7~2026.6 상한
  assert.equal(np("2027-07", 3_000_000).issue.code, "NP_BASIS_RULE_UNAVAILABLE");
  assert.equal(np("2028-01", 3_000_000).issue.code, "NP_RATE_UNAVAILABLE");
});

check("국민연금 신고 기준소득월액은 보정하지 않음", () => {
  assert.equal(np("2026-11", 3_000_500, "reported_basis").issue.code, "NP_INVALID_REPORTED_BASIS");
  assert.equal(np("2026-11", 7_000_000, "reported_basis").issue.code, "NP_INVALID_REPORTED_BASIS");
  assert.equal(np("2026-11", 3_000_000, "reported_basis").value.subscriberWon, 142_500);
  assert.equal(np("2026-11", 0).issue.code, "NP_ZERO_OR_NEGATIVE");
});

check("T4-01 4대보험의 국민연금 = 공용 함수 결과", () => {
  const agg = calculatePeriod(validatePayrollPeriod(period({ grossPayWon: 3_000_000, nonTaxablePayWon: 0 })).value, rules);
  const item = byKind(agg, "pension");
  assert.equal(item.employeeWon, np("2026-11", 3_000_000).value.subscriberWon);
  assert.deepEqual(item.provenance.ruleIds, ["np-rate-2026", "np-basis-2026-07"]);
});

// ─── 건강·장기요양·고용 ───
check("건강·장기요양·고용 2026 (월 300만·비과세 20만)", () => {
  const agg = calculatePeriod(validatePayrollPeriod(period()).value, rules);
  assert.equal(byKind(agg, "pension").employeeWon, 133_000); // 2,800,000 × 4.75%
  assert.equal(byKind(agg, "health").employeeWon, 100_660); // 2,800,000 × 3.595%
  assert.equal(byKind(agg, "long_term_care").employeeWon, 13_220); // 100,660 × 0.9448/7.19 = 13,227.2 → 10원 버림
  assert.equal(byKind(agg, "employment").employeeWon, 25_200); // 2,800,000 × 0.9%
  assert.equal(agg.completeTotalWon, 272_080);
});

check("T4-03·T4-05 2027 고용보험 미확정 → 합계 없음, 확정 소계만", () => {
  const agg = calculatePeriod(validatePayrollPeriod(period({ month: "2027-01" })).value, rules);
  assert.equal(byKind(agg, "pension").employeeWon, 140_000);
  assert.equal(byKind(agg, "health").employeeWon, 100_660);
  assert.equal(byKind(agg, "long_term_care").employeeWon, 13_990); // 100,660 × 0.9994/7.19 = 13,991.6
  assert.equal(byKind(agg, "employment").status, "unavailable");
  assert.equal(byKind(agg, "employment").issue.code, "FI_SCENARIO_NOT_OPTED_IN");
  assert.equal(agg.completeTotalWon, null);
  assert.equal(agg.scenarioTotalWon, null);
  assert.equal(agg.verifiedSubtotalWon, 254_650);
});

const fullInput = (over = {}) => ({
  comparisonMode: "same_basis",
  before: period(),
  after: period({ month: "2027-01" }),
  assumptions: { employmentScenario: false },
  tax: { mode: "excluded" },
  ...over,
});

check("T4-04 전후 비교는 공통 항목 교집합만", () => {
  const r = calculateFourInsuranceComparison(fullInput(), rules).value;
  assert.equal(r.comparison.scope, "common_subset");
  assert.deepEqual(r.comparison.kinds, ["pension", "health", "long_term_care"]);
  assert.equal(r.comparison.beforeSubtotalWon, 246_880);
  assert.equal(r.comparison.afterSubtotalWon, 254_650);
  assert.equal(r.comparison.deltaWon, 7_770);
  assert.equal(r.scenarioComparison, null);
});

check("T4-06 가정 선택 시 가정 총계는 확정 합계와 분리", () => {
  const r = calculateFourInsuranceComparison(fullInput({ assumptions: { employmentScenario: true } }), rules).value;
  assert.equal(byKind(r.after, "employment").employeeWon, 28_000);
  assert.equal(byKind(r.after, "employment").assumption, true);
  assert.equal(r.after.completeTotalWon, null);
  assert.equal(r.after.scenarioTotalWon, 282_650);
  assert.equal(r.comparison.scope, "common_subset"); // 확정 비교 범위는 그대로
  assert.equal(r.scenarioComparison.deltaWon, 10_570);
  assert.equal(r.cash.after.assumption, true);
  // 해제하면 가정 결과 제거
  const off = calculateFourInsuranceComparison(fullInput(), rules).value;
  assert.equal(off.after.scenarioTotalWon, null);
  assert.equal(off.cash.after.label, "unavailable");
});

check("T4-07 건강보험 실패 → 장기요양도 계산 안 함 / 미적용·모름 구분", () => {
  const unknown = calculatePeriod(validatePayrollPeriod(period({ applicability: { pension: "applies", health: "unknown", employment: "applies" } })).value, rules);
  assert.equal(byKind(unknown, "health").status, "unavailable");
  assert.equal(byKind(unknown, "long_term_care").status, "unavailable");
  assert.equal(unknown.completeTotalWon, null);
  const off = calculatePeriod(validatePayrollPeriod(period({ applicability: { pension: "applies", health: "not_applicable", employment: "applies" } })).value, rules);
  assert.equal(byKind(off, "long_term_care").status, "not_applicable");
  assert.equal(off.completeTotalWon, 133_000 + 25_200);
});

check("T4-08 건강보험 상·하한: 2026 적용, 2027 고시 전이면 계산 안 함", () => {
  assert.equal(calculateHealthInsurance(130_000_000, "2026-11", rules).employeeWon, 4_591_740);
  assert.equal(calculateHealthInsurance(200_000, "2026-11", rules).employeeWon, 10_080);
  assert.equal(calculateHealthInsurance(130_000_000, "2027-01", rules).issue.code, "HI_LIMIT_UNKNOWN");
  assert.equal(calculateHealthInsurance(200_000, "2027-01", rules).issue.code, "HI_LIMIT_UNKNOWN");
  assert.equal(calculateHealthInsurance(2_800_000, "2027-01", rules).notes.length, 1);
});

check("T4-02·T4-11 비과세는 지급액에서 다시 빼지 않음, 세금 제외 명칭", () => {
  const r = calculateFourInsuranceComparison(fullInput(), rules).value;
  assert.equal(r.cash.before.grossPayWon, 3_000_000);
  assert.equal(r.cash.before.label, "after_insurance");
  assert.equal(r.cash.before.amountWon, 3_000_000 - 272_080);
});

check("T4-12 세금 직접 입력은 국세·지방세 각각 차감", () => {
  const tax = { mode: "manual", incomeTaxWon: 50_000, localTaxWon: 5_000 };
  const r = calculateFourInsuranceComparison(fullInput({ tax }), rules).value;
  assert.equal(r.cash.before.label, "estimated_take_home");
  assert.equal(r.cash.before.amountWon, 3_000_000 - 272_080 - 50_000 - 5_000);
});

check("T4-09 가족 수는 세금 미리보기에만 영향", () => {
  const a = calculateFourInsuranceComparison(fullInput({ tax: { mode: "legacy_preview", dependents: 1, children: 0 } }), rules).value;
  const b = calculateFourInsuranceComparison(fullInput({ tax: { mode: "legacy_preview", dependents: 4, children: 2 } }), rules).value;
  assert.equal(a.before.completeTotalWon, b.before.completeTotalWon);
  assert.ok(a.cash.before.incomeTaxWon > b.cash.before.incomeTaxWon);
  assert.equal(a.cash.before.label, "preview");
});

check("입력 검증: 비과세 초과·빈 급여·고급 기준 누락", () => {
  const codes = (r) => r.errors.map((e) => e.code);
  assert.ok(codes(validatePayrollPeriod(period({ nonTaxablePayWon: 4_000_000 }))).includes("FI_INVALID_NON_TAXABLE"));
  assert.ok(codes(validatePayrollPeriod(period({ grossPayWon: null }))).includes("FI_EMPTY_GROSS"));
  assert.ok(codes(validatePayrollPeriod(period({ basisMode: "explicit_bases", explicitBases: { pension: 3_000_000 } }))).includes("FI_EXPLICIT_BASIS_MISSING"));
  const ok = validatePayrollPeriod(period({ basisMode: "explicit_bases", explicitBases: { pension: 3_000_000, health: 2_900_000, employment: 2_950_000 } }));
  const agg = calculatePeriod(ok.value, rules);
  assert.equal(byKind(agg, "health").employeeWon, 104_250); // 2,900,000 × 3.595%
  assert.equal(byKind(agg, "employment").employeeWon, 26_550); // 2,950,000 × 0.9%
});

check("2026 규칙 = 기존 2026 요율표 리포트 값", () => {
  const np26 = findRule(rules.pensionRates, "2026-11");
  const basis26 = findRule(rules.pensionBasis, "2026-11");
  const hi26 = findRule(rules.health, "2026-11");
  const ltc26 = findRule(rules.longTermCare, "2026-11");
  const ei26 = findRule(rules.employment, "2026-11");
  const near = (ratio, v) => Math.abs(ratio.num / ratio.den - v) < 1e-9;
  assert.ok(near(np26.employee, INSURANCE_RATES_2026.nationalPensionEmployee));
  assert.equal(basis26.lowerWon, INSURANCE_RATES_2026.nationalPensionMinMonthlyBase);
  assert.equal(basis26.upperWon, INSURANCE_RATES_2026.nationalPensionMaxMonthlyBase);
  assert.ok(near(hi26.employee, INSURANCE_RATES_2026.healthInsuranceEmployee));
  assert.equal((ltc26.linkedRatio.num / ltc26.linkedRatio.den).toFixed(4), INSURANCE_RATES_2026.longTermCareRateOnHealth.toFixed(4));
  assert.ok(near(ei26.employee, INSURANCE_RATES_2026.employmentInsuranceEmployee));
});

check("규칙 기간 중복 없음", () => {
  for (const [name, list] of Object.entries({ pensionRates: rules.pensionRates, pensionBasis: rules.pensionBasis, health: rules.health, longTermCare: rules.longTermCare, employment: rules.employment })) {
    for (const m of ["2025-07", "2026-01", "2026-06", "2026-07", "2026-12", "2027-01", "2027-06"]) {
      const hits = list.filter((r) => r.from <= m && (r.to == null || m <= r.to));
      assert.ok(hits.length <= 1, `${name} ${m} 중복`);
    }
  }
});

console.log(`\n${passed}개 검증 통과`);
