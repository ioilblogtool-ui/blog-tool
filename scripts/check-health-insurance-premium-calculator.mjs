import assert from "node:assert/strict";
import fs from "node:fs/promises";
import ts from "typescript";
import { calculateEmployee, calculateComparison, calculateRegional, calculateTransition, getCapabilities,
  validateState, parseNumericInput, parseUrlState, serializeUrlState } from "../public/scripts/health-insurance-premium-core.js";

const source = await fs.readFile("src/data/healthInsurancePremiumCalculator.ts", "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 }, reportDiagnostics: true });
assert.equal(compiled.diagnostics?.length ?? 0, 0);
const data = await import("data:text/javascript;base64," + Buffer.from(compiled.outputText).toString("base64"));
const defaults = data.HEALTH_INSURANCE_DEFAULT_INPUT, rules = data.HEALTH_INSURANCE_RULES_BY_YEAR;
const clone = (v) => structuredClone(v);
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-6, `${a} != ${b}`);
const v = (value) => ({ value, status: "verified", sourceIds: ["test-assumption"], checkedAt: "2026-10-08", effectiveFrom: "2026-01-01" });
// 테스트 가정: 검증 미완료 산식을 운영 기준으로 채우지 않는다.
function fixture(year = 2026) {
  return { ...clone(rules[year]), careIncomeRate: v(.009448), carePublishedHealthRatio: v(.1314),
    employeeLimits: v({ basis: "combinedMonthlyHealth", lower: 20_160, upper: 9_183_480 }),
    rounding: v({ method: "floor", healthUnitWon: 10, careUnitWon: 10, healthStage: "afterSplit", careBase: "chargedHealth", careFactor: "publishedHealthRatio" }),
    regionalPolicy: v({ lowIncomeThresholdAnnual: 3_360_000, minimumIncomePremium: 20_160, totalHealthLower: 20_160, totalHealthUpper: 4_591_740, lowIncomeBasis: "assessedAnnualIncome" }) };
}

for (const [wage, health, care, monthly, yearly] of [
  [3_000_000, 107850, 14170, 122020, 1464240], [4_000_000, 143800, 18890, 162690, 1952280],
  [5_000_000, 179750, 23610, 203360, 2440320], [7_000_000, 251650, 33060, 284710, 3416520],
]) {
  const input = { ...defaults.employee, monthlyWage: wage };
  const r = calculateEmployee(input, fixture());
  assert.equal(r.employee.health.value, health); assert.equal(r.employee.care.value, care);
  assert.equal(r.employee.monthlyTotal.value, monthly); assert.equal(r.employee.annualTotal.value, yearly);
  assert.equal(r.combined.monthlyTotal.value, monthly * 2); assert.equal(r.employer.monthlyTotal.value, monthly);
  const pending = calculateEmployee(input, rules[2027]);
  assert.equal(pending.status, "partial"); assert.equal(pending.employee.monthlyTotal.value, null);
  assert.equal(pending.employee.care.value, null); near(pending.theoretical.employee.health.value, health);
}
for (const [salary, health, care, total] of [[50_000_000,149790,19680,169470],[55_000_000,164770,21650,186420]]) {
  const r = calculateEmployee({ ...defaults.employee, incomeMode: "annualSalary", annualSalary: salary }, fixture());
  assert.equal(r.employee.health.value, health); assert.equal(r.employee.care.value, care); assert.equal(r.employee.monthlyTotal.value, total);
}

const raised = clone(defaults);
raised.employee.incomeMode = "annualSalary"; raised.employee.annualSalary = 55_000_000;
raised.employee.showEmployerShare = false;
Object.assign(raised.comparison, { previousBasis: "custom", previousAnnualSalary: 50_000_000, previousExcludedAnnualPay: 0 });
const future = fixture(2027), old = fixture(); future.carePublishedHealthRatio = v(.15);
const c = calculateComparison(raised, { 2026: old, 2027: future });
for (const side of ["employee", "employer"]) for (const metric of ["health", "care", "monthlyTotal", "annualTotal"])
  assert.equal(c[side].rulesEffect[metric].value + c[side].wageEffect[metric].value, c[side].totalEffect[metric].value);
near(c.theoretical.wageEffect.health.value * 12, 179750);
assert.equal(c.employee.rulesEffect.health.value, 0); assert.equal(c.employee.wageEffect.health.value, 14980);
const pendingCompare = calculateComparison(raised, rules);
assert.equal(pendingCompare.employee.totalEffect.monthlyTotal.value, null);
near(pendingCompare.theoretical.wageEffect.health.value, 14979.166666666666);
raised.comparison.previousBasis = "same";
assert.equal(calculateComparison(raised, { 2026: old, 2027: old }).employee.totalEffect.monthlyTotal.value, 0);
raised.year = 2026; assert.equal(calculateComparison(raised, rules), null);

const low = calculateEmployee({ ...defaults.employee, monthlyWage: 1 }, fixture());
assert.equal(low.lowerApplied, true); assert.equal(low.employee.health.value, 10080);
const high = calculateEmployee({ ...defaults.employee, monthlyWage: 200_000_000 }, fixture());
assert.equal(high.upperApplied, true); assert.equal(high.employee.health.value, 4591740);
for (const boundary of [20160/.0719,9183480/.0719]) for (const offset of [-1,0,1]) {
  const wage = Math.floor(boundary) + offset;
  const r = calculateEmployee({ ...defaults.employee, monthlyWage: wage }, fixture());
  assert.ok(r.employee.health.value >= 10080 && r.employee.health.value <= 4591740);
}
for (const wage of [null,-1,NaN,Infinity,Number.MAX_SAFE_INTEGER + 1])
  assert.equal(calculateEmployee({ ...defaults.employee, monthlyWage: wage }, fixture()).status, "invalid");
assert.equal(calculateEmployee({ ...defaults.employee, monthlyWage: 0 }, fixture()).status, "unavailable");
assert.equal(calculateEmployee({ ...defaults.employee, incomeMode: "annualSalary", excludedAnnualPay: 40_000_000 }, fixture()).status, "invalid");
const deduction = calculateEmployee({ ...defaults.employee, incomeMode: "annualSalary", annualSalary: 36_000_000, excludedAnnualPay: 12_000_000 }, fixture());
assert.equal(deduction.monthlyWage, 2_000_000);
const wageNoDoubleSubtract = calculateEmployee({ ...defaults.employee, excludedAnnualPay: 12_000_000 }, fixture());
assert.equal(wageNoDoubleSubtract.monthlyWage, 3_000_000);

const ratioRule = fixture(); ratioRule.rounding.value.careFactor = "incomeRateRatio";
assert.equal(calculateEmployee(defaults.employee, ratioRule).employee.care.value, Math.floor(107850*.009448/.0719/10)*10);
ratioRule.careIncomeRate = { ...ratioRule.careIncomeRate, value: null, status: "pending" };
const missingCare = calculateEmployee(defaults.employee, ratioRule);
assert.equal(missingCare.employee.health.value, 107850); assert.equal(missingCare.employee.monthlyTotal.value, null); assert.equal(missingCare.burdenRatio.value, null);
for (const other of [19999999,20000000,20000001]) {
  const r = calculateEmployee({ ...defaults.employee, otherAnnualIncome: other }, fixture());
  assert.equal(r.warningCodes[0], other > 20000000 ? "otherIncomeAbove" : "otherIncomeBelow");
  assert.equal(r.employee.monthlyTotal.value, 122020);
}

const regionalInput = { assessedMonthlyIncome: 3_000_000, assessedAnnualIncomeForThreshold: 36_000_000, propertyPoints: 0, standardConditionsConfirmed: true };
const regionalZero = calculateRegional(regionalInput, fixture()); assert.equal(regionalZero.propertyPremium, 0); assert.equal(regionalZero.regional.health.value, 215700);
const regionalHundred = calculateRegional({ ...regionalInput, propertyPoints: 100 }, fixture()); assert.equal(regionalHundred.propertyPremium, 21150); assert.equal(regionalHundred.regional.health.value, 236850);
for (const income of [3359999,3360000,3360001]) {
  const r = calculateRegional({ ...regionalInput, assessedMonthlyIncome: 280000, assessedAnnualIncomeForThreshold: income }, fixture());
  assert.equal(r.incomePremium, income <= 3360000 ? 20160 : 280000*.0719);
}
assert.equal(calculateRegional({ ...regionalInput, standardConditionsConfirmed: false }, fixture()).status, "unavailable");
assert.equal(calculateRegional(regionalInput, rules[2027]).status, "unavailable");
assert.equal(calculateRegional({ ...regionalInput, propertyPoints: -1 }, fixture()).status, "invalid");
const transition = calculateTransition({ beforeMonthlyWage: 3_000_000, afterRegionalTotal: 200000, showContinuation: true, continuationTotal: 130000 }, fixture());
assert.equal(transition.difference.value, 77980); assert.equal(transition.afterAnnual.value, 2400000); assert.equal(transition.continuationDifference.value, 7980);
assert.equal(calculateTransition({ ...defaults.transition, afterRegionalTotal: 200000 }, rules[2027]).difference.value, null);

for (const raw of ["", "-1", "1e6", "NaN", "Infinity", "3abc000", "30,00", "1.5", "9007199254740992"])
  assert.ok(parseNumericInput(raw).error, raw);
assert.equal(parseNumericInput("3,000,000").value, 3000000); assert.equal(parseNumericInput("0").value, 0);
assert.equal(parseNumericInput("100.25",true).value,100.25); assert.ok(parseNumericInput("100.251",true).error);
const errorState = clone(defaults); errorState.employee.monthlyWage = null;
assert.ok(validateState(errorState)["employee.monthlyWage"]);

for (const state of [clone(defaults), { ...clone(defaults), year: 2026 }, { ...clone(defaults), ...{ employee: { ...defaults.employee, incomeMode: "annualSalary", showEmployerShare: false } } }]) {
  const back = parseUrlState(serializeUrlState(state), defaults).state;
  assert.deepEqual(back.employee, state.employee); assert.equal(back.year,state.year);
}
const shareRaise = clone(defaults); shareRaise.employee.incomeMode="annualSalary";
Object.assign(shareRaise.comparison,{previousBasis:"custom",previousAnnualSalary:50000000,previousExcludedAnnualPay:1000000});
assert.deepEqual(parseUrlState(serializeUrlState(shareRaise),defaults).state.comparison, shareRaise.comparison);
const shareRegion = clone(defaults); shareRegion.mode = "regional"; shareRegion.regional = regionalInput;
assert.deepEqual(parseUrlState(serializeUrlState(shareRegion),defaults).state.regional, shareRegion.regional);
const shareTransition = clone(defaults); shareTransition.mode="transition";
Object.assign(shareTransition.transition,{afterRegionalTotal:200000,showContinuation:true,continuationTotal:130000});
assert.deepEqual(parseUrlState(serializeUrlState(shareTransition),defaults).state.transition,shareTransition.transition);
assert.equal(parseUrlState("?wage=3000000&salary=50000000",defaults).state.year,2026);
assert.equal(parseUrlState("?wage=3000000&salary=50000000",defaults).state.employee.incomeMode,"monthlyWage");
const legacyRegion = parseUrlState("?mode=regional&ri=50000000&points=100&car=50000000",defaults);
assert.equal(legacyRegion.state.regional.propertyPoints,null); assert.ok(legacyRegion.notices.length);
assert.equal(parseUrlState("?v=2&mode=employee&wage=-1",defaults).state.employee.monthlyWage,null);
assert.equal(parseUrlState("?v=2&mode=employee",defaults).state.employee.monthlyWage,null);
assert.equal(parseUrlState("?v=3&wage=1",defaults).state.employee.monthlyWage,defaults.employee.monthlyWage);
assert.equal(parseUrlState("?utm_source=test",defaults).state.year,2027);
assert.equal(getCapabilities(rules[2027]).employeeTotal,false);
assert.ok(data.HEALTH_INSURANCE_SEO.title.length<=50);
assert.ok(data.HEALTH_INSURANCE_SEO.description.length>=80 && data.HEALTH_INSURANCE_SEO.description.length<=120);
assert.ok(data.HEALTH_INSURANCE_SEO.intro.length>=4 && data.HEALTH_INSURANCE_SEO.intro.every((p)=>p.length>=150));
assert.ok(data.HEALTH_INSURANCE_FAQ.length>=7);
for (const faq of data.HEALTH_INSURANCE_FAQ) assert.ok(faq.answer.split(/[.!?]/).filter((s)=>s.trim()).length>=2);
for (const link of data.HEALTH_INSURANCE_SEO.related) await fs.access(`src/pages${link.href.replace(/\/$/,"")}.astro`);
for (const file of ["src/data/healthInsurancePremiumCalculator.ts","public/scripts/health-insurance-premium-core.js","public/scripts/health-insurance-premium-calculator.js","src/pages/tools/health-insurance-premium-calculator.astro"]) {
  const content = await fs.readFile(file,"utf8"); assert.equal(/[\u3040-\u30ff]/.test(content),false);
}
console.log("건강보험료 검증 통과: 대표값·회귀·비교 분해·상하한·미확인 기준·지역·퇴직·입력·URL·콘텐츠");
