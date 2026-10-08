// 공식 기준은 주입된 연도 데이터만 사용한다. DOM 없는 계산·검증·URL 모듈.
const MAX = Number.MAX_SAFE_INTEGER;
const finite = (v) => typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= MAX;
const money = (v) => finite(v) && Number.isSafeInteger(v);
const verified = (f) => f?.status === "verified" && f.value !== null && f.value !== undefined;
const val = (f) => verified(f) ? f.value : null;
const amount = (value, reason = null) => ({ status: value === null ? "pending" : "ready", value, reason });
const pending = (reason = "기준 확인 후 계산") => amount(null, reason);
const invalid = (reason) => ({ status: "invalid", value: null, reason });
const annual = (a) => a.value === null ? { ...a } : finite(a.value * 12) ? amount(a.value * 12) : invalid("연간 계산 범위를 초과했습니다");
const add = (a, b) => {
  if (a.status === "invalid" || b.status === "invalid") return invalid(a.reason || b.reason);
  if (a.value === null || b.value === null) return pending(a.reason || b.reason);
  return finite(a.value + b.value) ? amount(a.value + b.value) : invalid("계산 범위를 초과했습니다");
};
const breakdown = (health, care) => {
  const monthlyTotal = add(health, care);
  return { health, care, monthlyTotal, annualTotal: annual(monthlyTotal) };
};
const empty = (reason, bad = false) => {
  const a = bad ? invalid(reason) : pending(reason);
  return breakdown(a, { ...a });
};
const diff = (a, b) => a.value === null || b.value === null ? pending() : amount(a.value - b.value);
const diffBreakdown = (a, b) => Object.fromEntries(["health", "care", "monthlyTotal", "annualTotal"].map((k) => [k, diff(a[k], b[k])]));

export function parseNumericInput(raw, decimal = false) {
  const text = String(raw ?? "").trim();
  if (!text) return { value: null, error: "금액을 입력해 주세요" };
  const syntax = decimal ? /^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$/ : /^(?:\d+|\d{1,3}(?:,\d{3})+)$/;
  if (!syntax.test(text)) return { value: null, error: "0 이상의 숫자를 올바르게 입력해 주세요" };
  const value = Number(text.replaceAll(",", ""));
  return !finite(value) || (!decimal && !money(value)) ? { value: null, error: "입력 가능한 숫자 범위를 초과했습니다" } : { value, error: null };
}
export function getCapabilities(rule) {
  const missingHealth = ["healthRate", "employeeShare", "employerShare", "employeeLimits", "rounding"].filter((k) => !verified(rule?.[k]));
  const careKey = val(rule?.rounding)?.careFactor === "publishedHealthRatio" ? "carePublishedHealthRatio" : "careIncomeRate";
  const missingCare = verified(rule?.[careKey]) ? [] : [careKey];
  const regionalMissing = ["healthRate", "regionalPointPrice", "regionalPolicy", "rounding"].filter((k) => !verified(rule?.[k]));
  return { employeeHealth: !missingHealth.length, employeeTotal: !missingHealth.length && !missingCare.length,
    regionalHealth: !regionalMissing.length, missingHealth, missingCare, regionalMissing };
}
export function resolveMonthlyWage(input) {
  if (input.incomeMode === "monthlyWage") return money(input.monthlyWage) ? input.monthlyWage : null;
  if (input.incomeMode !== "annualSalary" || !money(input.annualSalary) || !money(input.excludedAnnualPay) || input.excludedAnnualPay > input.annualSalary) return null;
  return (input.annualSalary - input.excludedAnnualPay) / 12;
}
export function validateState(state) {
  const errors = {};
  const requireMoney = (path, v) => { if (!money(v)) errors[path] = "0 이상의 원 단위 금액을 입력해 주세요"; };
  if (![2026, 2027].includes(state.year)) errors.year = "계산 연도를 확인해 주세요";
  if (state.mode === "employee") {
    const e = state.employee, c = state.comparison;
    if (e.incomeMode === "monthlyWage") requireMoney("employee.monthlyWage", e.monthlyWage);
    else if (e.incomeMode === "annualSalary") {
      requireMoney("employee.annualSalary", e.annualSalary); requireMoney("employee.excludedAnnualPay", e.excludedAnnualPay);
      if (money(e.annualSalary) && money(e.excludedAnnualPay) && e.excludedAnnualPay > e.annualSalary) errors["employee.excludedAnnualPay"] = "제외 급여는 연봉을 초과할 수 없습니다";
    } else errors["employee.incomeMode"] = "입력 방식을 확인해 주세요";
    requireMoney("employee.otherAnnualIncome", e.otherAnnualIncome);
    if (state.year === 2027 && c.enabled && c.previousBasis === "custom") {
      if (e.incomeMode === "monthlyWage") requireMoney("comparison.previousMonthlyWage", c.previousMonthlyWage);
      else {
        requireMoney("comparison.previousAnnualSalary", c.previousAnnualSalary); requireMoney("comparison.previousExcludedAnnualPay", c.previousExcludedAnnualPay);
        if (money(c.previousAnnualSalary) && money(c.previousExcludedAnnualPay) && c.previousExcludedAnnualPay > c.previousAnnualSalary) errors["comparison.previousExcludedAnnualPay"] = "제외 급여는 이전 연봉을 초과할 수 없습니다";
      }
    }
  } else if (state.mode === "regional") {
    const r = state.regional;
    requireMoney("regional.assessedMonthlyIncome", r.assessedMonthlyIncome); requireMoney("regional.assessedAnnualIncomeForThreshold", r.assessedAnnualIncomeForThreshold);
    if (!finite(r.propertyPoints) || Math.abs(r.propertyPoints * 100 - Math.round(r.propertyPoints * 100)) > 1e-5) errors["regional.propertyPoints"] = "0 이상의 재산점수를 입력해 주세요 (소수 둘째 자리까지)";
  } else if (state.mode === "transition") {
    const t = state.transition;
    requireMoney("transition.beforeMonthlyWage", t.beforeMonthlyWage); requireMoney("transition.afterRegionalTotal", t.afterRegionalTotal);
    if (t.showContinuation) requireMoney("transition.continuationTotal", t.continuationTotal);
  } else errors.mode = "가입자 유형을 확인해 주세요";
  return errors;
}
function floorUnit(v, unit) {
  if (!finite(v) || !money(unit) || unit <= 0) return null;
  const q = v / unit, rounded = Math.round(q);
  return Math.floor(Math.abs(q - rounded) < 1e-8 ? rounded : q) * unit;
}
function carePremium(health, rawHealth, rule) {
  const policy = val(rule.rounding);
  if (!policy || health.value === null) return pending();
  const base = policy.careBase === "rawHealth" ? rawHealth : health.value;
  const h = val(rule.healthRate), l = val(rule.careIncomeRate);
  const factor = policy.careFactor === "publishedHealthRatio" ? val(rule.carePublishedHealthRatio) : h > 0 && l !== null ? l / h : null;
  if (factor === null || !finite(factor)) return pending("장기요양보험 기준 확인 후 계산");
  const v = floorUnit(base * factor, policy.careUnitWon);
  return v === null ? invalid("계산 범위를 초과했습니다") : amount(v);
}
export function calculateEmployee(input, rule) {
  const monthlyWage = resolveMonthlyWage(input), caps = getCapabilities(rule);
  const base = { monthlyWage, missingRuleIds: [...caps.missingHealth, ...caps.missingCare], lowerApplied: false, upperApplied: false, warningCodes: [], theoretical: null };
  const fail = (status, reason) => ({ ...base, status, employee: empty(reason, status === "invalid"), employer: empty(reason, status === "invalid"), combined: empty(reason, status === "invalid"), burdenRatio: pending(reason) });
  if (monthlyWage === null) return fail("invalid", "보수 입력값을 확인해 주세요");
  if (monthlyWage === 0) return fail("unavailable", "무보수·자격 조건을 공단에서 확인하세요");
  const h = val(rule?.healthRate), e = val(rule?.employeeShare), r = val(rule?.employerShare);
  if (!(h > 0) || e === null || r === null || Math.abs(e + r - 1) > 1e-10) return fail("unavailable", "건강보험료율·분담 기준 확인 후 계산");
  const raw = monthlyWage * h;
  if (!finite(raw * 12)) return fail("invalid", "연간 계산 범위를 초과했습니다");
  const theorySide = (share) => {
    const l = val(rule.careIncomeRate);
    return breakdown(amount(raw * share), l === null ? pending("장기요양보험 기준 확인 후 계산") : amount(monthlyWage * l * share));
  };
  // 상하한·단수처리 없는 이론값은 정식 납부액과 별도 모델·패널로 제공한다.
  base.theoretical = { employee: theorySide(e), employer: theorySide(r), rawCombinedHealth: raw };
  if (money(input.otherAnnualIncome) && input.otherAnnualIncome > 0) {
    const threshold = val(rule.otherIncomeThreshold);
    base.warningCodes.push(threshold === null ? "otherIncomeUnverified" : input.otherAnnualIncome > threshold ? "otherIncomeAbove" : "otherIncomeBelow");
  }
  if (!caps.employeeHealth) return fail("partial", "상하한·단수처리 기준 확인 후 계산");
  const limits = rule.employeeLimits.value, policy = rule.rounding.value;
  const bounded = Math.min(limits.upper, Math.max(limits.lower, raw));
  base.lowerApplied = raw < limits.lower; base.upperApplied = raw > limits.upper;
  const healthSide = (share) => floorUnit(policy.healthStage === "beforeSplit" ? floorUnit(bounded, policy.healthUnitWon) * share : bounded * share, policy.healthUnitWon);
  const eh = healthSide(e), rh = healthSide(r);
  if (eh === null || rh === null) return fail("invalid", "계산 범위를 초과했습니다");
  const employee = breakdown(amount(eh), carePremium(amount(eh), bounded * e, rule));
  const employer = breakdown(amount(rh), carePremium(amount(rh), bounded * r, rule));
  const combined = breakdown(add(employee.health, employer.health), add(employee.care, employer.care));
  return { ...base, status: employee.monthlyTotal.status === "invalid" ? "invalid" : employee.monthlyTotal.value === null ? "partial" : "ready", employee, employer, combined,
    burdenRatio: employee.monthlyTotal.value === null ? pending() : amount(employee.monthlyTotal.value / monthlyWage * 100) };
}
export function calculateComparison(state, rules) {
  if (!state.comparison.enabled || state.year !== 2027) return null;
  const c = state.comparison, input = state.employee;
  const previous = c.previousBasis === "same" ? input : { ...input, monthlyWage: c.previousMonthlyWage, annualSalary: c.previousAnnualSalary, excludedAnnualPay: c.previousExcludedAnnualPay };
  const a = calculateEmployee(previous, rules[2026]), b = calculateEmployee(previous, rules[2027]), now = calculateEmployee(input, rules[2027]);
  const effects = (old, same, current) => ({ previous: old, sameBasisCurrent: same, current,
    rulesEffect: diffBreakdown(same, old), wageEffect: diffBreakdown(current, same), totalEffect: diffBreakdown(current, old) });
  return { previousWage: a.monthlyWage, currentWage: now.monthlyWage,
    employee: effects(a.employee, b.employee, now.employee), employer: effects(a.employer, b.employer, now.employer),
    theoretical: a.theoretical && b.theoretical && now.theoretical ? effects(a.theoretical.employee, b.theoretical.employee, now.theoretical.employee) : null };
}
export function calculateRegional(input, rule) {
  const result = { status: "unavailable", regional: empty("지역 부과 기준 확인 후 계산"), incomePremium: null, propertyPremium: null };
  if (!money(input.assessedMonthlyIncome) || !money(input.assessedAnnualIncomeForThreshold) || !finite(input.propertyPoints)) return { ...result, status: "invalid", regional: empty("공단 산정 소득·재산점수를 입력해 주세요", true) };
  if (!input.standardConditionsConfirmed) return { ...result, regional: empty("감면·조정 없는 표준조건을 확인해 주세요") };
  if (!getCapabilities(rule).regionalHealth) return result;
  const p = rule.regionalPolicy.value;
  const incomePremium = input.assessedAnnualIncomeForThreshold <= p.lowIncomeThresholdAnnual ? p.minimumIncomePremium : input.assessedMonthlyIncome * rule.healthRate.value;
  const propertyPremium = input.propertyPoints * rule.regionalPointPrice.value;
  if (!finite(incomePremium) || !finite(propertyPremium) || !finite(incomePremium + propertyPremium)) return { ...result, status: "invalid", regional: empty("계산 범위를 초과했습니다", true) };
  const bounded = Math.min(p.totalHealthUpper, Math.max(p.totalHealthLower, incomePremium + propertyPremium));
  const health = floorUnit(bounded, rule.rounding.value.healthUnitWon);
  if (health === null) return { ...result, status: "invalid", regional: empty("계산 범위를 초과했습니다", true) };
  const regional = breakdown(amount(health), carePremium(amount(health), bounded, rule));
  return { status: regional.monthlyTotal.status === "invalid" ? "invalid" : regional.monthlyTotal.value === null ? "partial" : "ready", regional, incomePremium, propertyPremium };
}
export function calculateTransition(input, rule) {
  const before = calculateEmployee({ incomeMode: "monthlyWage", monthlyWage: input.beforeMonthlyWage, otherAnnualIncome: 0 }, rule);
  const confirmed = (v) => money(v) && finite(v * 12) ? amount(v) : invalid("확인한 월 합계를 입력해 주세요");
  const after = confirmed(input.afterRegionalTotal), continuation = input.showContinuation ? confirmed(input.continuationTotal) : null;
  return { year: rule.year, before, after, afterAnnual: annual(after), difference: diff(after, before.employee.monthlyTotal),
    continuation, continuationAnnual: continuation ? annual(continuation) : null, continuationDifference: continuation ? diff(continuation, before.employee.monthlyTotal) : null };
}

const fields = {
  wage: ["employee", "monthlyWage"], salary: ["employee", "annualSalary"], excluded: ["employee", "excludedAnnualPay"], other: ["employee", "otherAnnualIncome"],
  pwage: ["comparison", "previousMonthlyWage"], psalary: ["comparison", "previousAnnualSalary"], pexcluded: ["comparison", "previousExcludedAnnualPay"],
  rmi: ["regional", "assessedMonthlyIncome"], rai: ["regional", "assessedAnnualIncomeForThreshold"], rpoints: ["regional", "propertyPoints"],
  twage: ["transition", "beforeMonthlyWage"], rtotal: ["transition", "afterRegionalTotal"], ctotal: ["transition", "continuationTotal"],
};
const bools = { employer: ["employee", "showEmployerShare"], compare: ["comparison", "enabled"], rstandard: ["regional", "standardConditionsConfirmed"], continuation: ["transition", "showContinuation"] };
export function parseUrlState(search, defaults) {
  const state = structuredClone(defaults), p = new URLSearchParams(search), notices = [], errors = {};
  const legacy = !p.has("v") && ["mode", "wage", "salary", "other", "ri", "rp", "rent", "points", "twage", "tai", "tap", "car"].some((k) => p.has(k));
  if (p.has("v") && p.get("v") !== "2") return { state, notices: ["지원하지 않는 버전의 공유 링크입니다"], errors };
  if (legacy) { state.year = 2026; notices.push("2026 기준 링크입니다. 이전 링크에는 입력 방식이 없어 월 보수 기준으로 복원했습니다."); }
  const enumField = (key, allowed, set) => {
    if (!p.has(key)) return;
    if (allowed.includes(p.get(key))) set(p.get(key)); else notices.push("공유 링크의 선택값을 확인해 주세요");
  };
  enumField("mode", ["employee", "regional", "transition"], (v) => { state.mode = v; });
  if (!legacy) {
    enumField("year", ["2026", "2027"], (v) => { state.year = Number(v); });
    enumField("im", ["monthlyWage", "annualSalary"], (v) => { state.employee.incomeMode = v; });
    enumField("previous", ["same", "custom"], (v) => { state.comparison.previousBasis = v; });
  }
  if (p.get("v") === "2") {
    for (const [group, key] of Object.values(fields)) state[group][key] = null;
    state.employee.excludedAnnualPay = 0; state.employee.otherAnnualIncome = 0; state.comparison.previousExcludedAnnualPay = 0;
  }
  for (const [key, [group, field]] of Object.entries(fields)) {
    if (!p.has(key) || legacy && !["wage", "salary", "other", "twage"].includes(key)) continue;
    const parsed = parseNumericInput(p.get(key), key === "rpoints");
    state[group][field] = parsed.value;
    if (parsed.error) { errors[`${group}.${field}`] = parsed.error; notices.push("공유 링크의 숫자를 확인해 주세요"); }
  }
  if (!legacy) for (const [key, [group, field]] of Object.entries(bools)) {
    if (!p.has(key)) continue;
    if (["0", "1"].includes(p.get(key))) state[group][field] = p.get(key) === "1"; else notices.push("공유 링크의 선택 옵션을 확인해 주세요");
  }
  if (legacy && (state.mode !== "employee" || ["ri", "rp", "rent", "points", "tai", "tap", "car"].some((k) => p.has(k)))) notices.push("이전 지역·퇴직 입력은 자동 환산하지 않습니다. 공단 확인 자료를 다시 입력하세요.");
  return { state, notices: [...new Set(notices)], errors };
}
export function serializeUrlState(state) {
  const p = new URLSearchParams({ v: "2", mode: state.mode, year: String(state.year) }), include = [];
  if (state.mode === "employee") {
    p.set("im", state.employee.incomeMode); p.set("employer", state.employee.showEmployerShare ? "1" : "0");
    p.set("compare", state.comparison.enabled ? "1" : "0"); p.set("previous", state.comparison.previousBasis);
    include.push("wage", "salary", "excluded", "other");
    if (state.comparison.enabled && state.comparison.previousBasis === "custom") include.push("pwage", "psalary", "pexcluded");
  } else if (state.mode === "regional") {
    include.push("rmi", "rai", "rpoints"); p.set("rstandard", state.regional.standardConditionsConfirmed ? "1" : "0");
  } else {
    include.push("twage", "rtotal"); p.set("continuation", state.transition.showContinuation ? "1" : "0");
    if (state.transition.showContinuation) include.push("ctotal");
  }
  for (const key of include) { const [group, field] = fields[key], v = state[group][field]; if (v !== null && finite(v)) p.set(key, String(v)); }
  return p.toString();
}
