// 4대보험 공용 계산 모듈 (DOM 없음)
// 설계: docs/design/202611/04_4대보험_계산기_상세설계.md
// 국민연금은 national-pension-contribution-core.js 의 calculatePensionMonthly 를 그대로 쓴다.

import { calculatePensionMonthly, findRule, mulFloor } from "./national-pension-contribution-core.js?v=20261110";

export const INSURANCE_KINDS = ["pension", "health", "long_term_care", "employment"];
export const INSURANCE_LABELS = {
  pension: "국민연금",
  health: "건강보험",
  long_term_care: "장기요양보험",
  employment: "고용보험",
};

const issue = (code, message) => ({ code, message });
const unavailable = (kind, code, message) => ({ status: "unavailable", kind, issue: issue(code, message) });
const notApplicable = (kind, reason) => ({ status: "not_applicable", kind, reason });

// ─── 입력 검증 ───────────────────────────────────────────────────────────────
/**
 * raw: { month, grossPayWon, nonTaxablePayWon, basisMode: 'simple_estimate'|'explicit_bases',
 *        explicitBases: { pension, health, employment }, applicability: { pension, health, employment } }
 * 장기요양 적용 여부는 건강보험을 따른다(별도 면제·경감은 미지원).
 */
export function validatePayrollPeriod(raw) {
  const errors = [];
  const warnings = [];
  const int = (v) => (typeof v === "number" && Number.isSafeInteger(v) ? v : null);
  const gross = int(raw?.grossPayWon);
  const nonTaxable = int(raw?.nonTaxablePayWon ?? 0);

  if (!/^\d{4}-\d{2}$/.test(raw?.month || "")) errors.push({ field: "month", ...issue("FI_INVALID_MONTH", "기준월을 선택해 주세요.") });
  if (gross == null) errors.push({ field: "grossPayWon", ...issue("FI_EMPTY_GROSS", "세전 월 급여를 입력해 주세요.") });
  else if (gross <= 0) errors.push({ field: "grossPayWon", ...issue("FI_GROSS_RANGE", "일반 월급 계산은 0원보다 큰 급여만 지원합니다.") });
  if (nonTaxable == null || nonTaxable < 0) errors.push({ field: "nonTaxablePayWon", ...issue("FI_INVALID_NON_TAXABLE", "비과세 금액은 0원 이상이어야 합니다.") });
  else if (gross != null && nonTaxable > gross) errors.push({ field: "nonTaxablePayWon", ...issue("FI_INVALID_NON_TAXABLE", "비과세 금액이 세전 급여보다 클 수 없습니다.") });

  const applicability = {
    pension: raw?.applicability?.pension ?? "applies",
    health: raw?.applicability?.health ?? "applies",
    employment: raw?.applicability?.employment ?? "applies",
  };
  applicability.long_term_care = applicability.health;

  const basisMode = raw?.basisMode === "explicit_bases" ? "explicit_bases" : "simple_estimate";
  const explicitBases = {};
  if (basisMode === "explicit_bases") {
    for (const kind of ["pension", "health", "employment"]) {
      if (applicability[kind] !== "applies") continue;
      const v = int(raw?.explicitBases?.[kind]);
      if (v == null || v <= 0) {
        errors.push({ field: `explicit_${kind}`, ...issue("FI_EXPLICIT_BASIS_MISSING", `${INSURANCE_LABELS[kind]} 산정 기준 금액을 입력해 주세요.`) });
      } else {
        explicitBases[kind] = v;
      }
    }
  }

  if (errors.length) return { ok: false, errors };
  if (basisMode === "simple_estimate" && gross - nonTaxable === 0) {
    warnings.push(issue("FI_ZERO_BASIS", "급여에서 비과세를 빼면 0원입니다. 보험별 하한이 적용되는지 신고·자격을 확인하세요."));
  }
  return {
    ok: true,
    warnings,
    value: { month: raw.month, grossPayWon: gross, nonTaxablePayWon: nonTaxable, basisMode, explicitBases, applicability },
  };
}

// ─── 보험별 계산 ─────────────────────────────────────────────────────────────
function basisFor(period, kind) {
  if (period.basisMode === "explicit_bases") return { amount: period.explicitBases[kind], basisKind: "reported" };
  return { amount: period.grossPayWon - period.nonTaxablePayWon, basisKind: "estimated_from_pay" };
}

function pensionItem(period, rules) {
  const { amount, basisKind } = basisFor(period, "pension");
  const res = calculatePensionMonthly(
    {
      month: period.month,
      subscriber: "employee",
      basisInput: { kind: basisKind === "reported" ? "reported_basis" : "income_estimate", amountWon: amount },
    },
    rules,
  );
  if (!res.ok) return unavailable("pension", res.issue.code, res.issue.message);
  return {
    status: "calculated",
    kind: "pension",
    employeeWon: res.value.subscriberWon,
    employerWon: res.value.employerWon,
    appliedBasisWon: res.value.basisWon,
    basisKind,
    assumption: false,
    adjustments: res.value.adjustments,
    provenance: { ruleIds: [res.value.provenance.rateRuleId, res.value.provenance.basisRuleId], roundingStatus: res.value.provenance.roundingStatus },
  };
}

/** 가장 최근에 상·하한이 고시된 건강보험 규칙(2027 상·하한 고시 전 범위 판단용) */
function latestBoundedHealthRule(rules, month) {
  return [...rules.health]
    .filter((r) => r.from <= month && r.lowerPremiumWon != null && r.upperPremiumWon != null)
    .sort((a, b) => (a.from < b.from ? 1 : -1))[0] || null;
}

export function calculateHealthInsurance(basisWon, month, rules) {
  const rule = findRule(rules.health, month);
  if (!rule || rule.status === "unknown" || rule.status === "scenario") {
    return unavailable("health", "FI_RULE_UNAVAILABLE", `${month} 건강보험료율이 확인되지 않았습니다.`);
  }
  if (!Number.isSafeInteger(basisWon) || basisWon < 0) return unavailable("health", "FI_RULE_UNAVAILABLE", "건강보험 보수월액이 올바르지 않습니다.");

  const unit = rules.rounding?.healthPremium?.unit ?? 10;
  const rawTotal = (basisWon * rule.total.num) / rule.total.den; // 비교용(정확한 유리수 값)
  let employeeWon;
  const notes = [];

  let lower = rule.lowerPremiumWon;
  let upper = rule.upperPremiumWon;
  if (lower == null || upper == null) {
    // 해당 연도 상·하한 고시 전: 직전 고시 범위 안이면 상·하한이 걸리지 않는다고 보고 계산, 벗어나면 계산하지 않는다
    const ref = latestBoundedHealthRule(rules, month);
    if (!ref || rawTotal < ref.lowerPremiumWon || rawTotal > ref.upperPremiumWon) {
      return unavailable("health", "HI_LIMIT_UNKNOWN", `${month.slice(0, 4)}년 건강보험료 상·하한이 아직 고시되지 않아, 상·하한 근처 보수월액은 계산하지 않습니다.`);
    }
    notes.push(`${month.slice(0, 4)}년 보험료 상·하한 고시 전이라 상·하한을 적용하지 않았습니다.`);
    employeeWon = mulFloor(basisWon, rule.employee, unit);
  } else if (rawTotal > upper) {
    employeeWon = Math.floor(upper / 2 / unit) * unit;
    notes.push(`보험료 상한(월 ${upper.toLocaleString("ko-KR")}원)이 적용됐습니다.`);
  } else if (rawTotal < lower) {
    employeeWon = Math.floor(lower / 2 / unit) * unit;
    notes.push(`보험료 하한(월 ${lower.toLocaleString("ko-KR")}원)이 적용됐습니다.`);
  } else {
    employeeWon = mulFloor(basisWon, rule.employee, unit);
  }

  return {
    status: "calculated",
    kind: "health",
    employeeWon,
    employerWon: employeeWon, // 직장가입자 사용자 부담은 근로자와 같은 절반
    appliedBasisWon: basisWon,
    assumption: false,
    ruleStatus: rule.status,
    notes,
    provenance: { ruleIds: [rule.id], roundingStatus: rules.rounding?.healthPremium?.status ?? "unknown" },
  };
}

export function calculateLongTermCare(healthItem, month, rules) {
  if (!healthItem || healthItem.status === "not_applicable") return notApplicable("long_term_care", "건강보험 미적용이면 장기요양보험도 부과되지 않습니다.");
  if (healthItem.status !== "calculated") {
    return unavailable("long_term_care", "FI_LTC_DEPENDS_ON_HEALTH", "건강보험료를 계산할 수 없어 장기요양보험료도 계산하지 않습니다.");
  }
  const rule = findRule(rules.longTermCare, month);
  if (!rule || rule.status === "unknown" || rule.status === "scenario") {
    return unavailable("long_term_care", "FI_RULE_UNAVAILABLE", `${month} 장기요양보험료율이 확인되지 않았습니다.`);
  }
  const unit = rules.rounding?.longTermCarePremium?.unit ?? 10;
  const employeeWon = mulFloor(healthItem.employeeWon, rule.linkedRatio, unit);
  return {
    status: "calculated",
    kind: "long_term_care",
    employeeWon,
    employerWon: mulFloor(healthItem.employerWon, rule.linkedRatio, unit),
    appliedBasisWon: healthItem.employeeWon,
    assumption: false,
    ruleStatus: rule.status,
    displayedLinkedRatio: rule.displayedLinkedRatio,
    provenance: { ruleIds: [rule.id, ...healthItem.provenance.ruleIds], roundingStatus: rules.rounding?.longTermCarePremium?.status ?? "unknown" },
  };
}

export function calculateEmploymentInsurance(basisWon, month, rules, { allowScenario = false } = {}) {
  const rule = findRule(rules.employment, month);
  if (!rule || rule.status === "unknown") {
    return unavailable("employment", "FI_RULE_UNAVAILABLE", `${month} 고용보험료율이 확인되지 않았습니다.`);
  }
  if (rule.status === "scenario" && !allowScenario) {
    return unavailable("employment", "FI_SCENARIO_NOT_OPTED_IN", `${month.slice(0, 4)}년 고용보험료율은 정부안 단계라 확정 계산에 넣지 않았습니다.`);
  }
  const unit = rules.rounding?.employmentPremium?.unit ?? 10;
  return {
    status: "calculated",
    kind: "employment",
    employeeWon: mulFloor(basisWon, rule.employee, unit),
    employerWon: mulFloor(basisWon, rule.employerUnemployment, unit),
    appliedBasisWon: basisWon,
    assumption: rule.status === "scenario",
    ruleStatus: rule.status,
    provenance: { ruleIds: [rule.id], roundingStatus: rules.rounding?.employmentPremium?.status ?? "unknown" },
  };
}

// ─── 집계·비교 ───────────────────────────────────────────────────────────────
export function aggregateInsuranceItems(items) {
  const verified = items.filter((i) => i.status === "calculated" && !i.assumption);
  const assumed = items.filter((i) => i.status === "calculated" && i.assumption);
  const missing = items.filter((i) => i.status === "unavailable");
  const verifiedSubtotalWon = verified.reduce((s, i) => s + i.employeeWon, 0);
  const complete = missing.length === 0 && assumed.length === 0;
  const scenarioReady = missing.length === 0 && assumed.length > 0;
  return {
    items,
    verifiedSubtotalWon,
    includedKinds: verified.map((i) => i.kind),
    assumedKinds: assumed.map((i) => i.kind),
    missingKinds: missing.map((i) => i.kind),
    notApplicableKinds: items.filter((i) => i.status === "not_applicable").map((i) => i.kind),
    completeTotalWon: complete ? verifiedSubtotalWon : null,
    scenarioTotalWon: scenarioReady ? verifiedSubtotalWon + assumed.reduce((s, i) => s + i.employeeWon, 0) : null,
    employerReferenceWon: items
      .filter((i) => i.status === "calculated" && i.employerWon != null)
      .reduce((s, i) => s + i.employerWon, 0),
  };
}

/** 항목 상태가 양쪽에서 같은 의미일 때만 비교 대상으로 삼는다 */
function itemComparable(b, a) {
  if (b.status === "not_applicable" && a.status === "not_applicable") return true;
  return b.status === "calculated" && a.status === "calculated" && !b.assumption && !a.assumption;
}

export function compareInsuranceScopes(before, after) {
  const rows = INSURANCE_KINDS.map((kind) => {
    const b = before.items.find((i) => i.kind === kind);
    const a = after.items.find((i) => i.kind === kind);
    const comparable = itemComparable(b, a);
    const delta =
      b.status === "calculated" && a.status === "calculated" ? a.employeeWon - b.employeeWon : null;
    return { kind, before: b, after: a, comparable, deltaWon: delta };
  });

  if (before.completeTotalWon != null && after.completeTotalWon != null) {
    return { scope: "complete", rows, deltaWon: after.completeTotalWon - before.completeTotalWon, kinds: INSURANCE_KINDS.slice() };
  }
  const commonKinds = rows.filter((r) => r.comparable && r.before.status === "calculated").map((r) => r.kind);
  if (commonKinds.length === 0) {
    return { scope: "none", rows, deltaWon: null, kinds: [], issue: issue("FI_NO_COMMON_SCOPE", "두 기간에 함께 계산된 항목이 없어 차이를 비교할 수 없습니다.") };
  }
  const sum = (agg) => agg.items.filter((i) => commonKinds.includes(i.kind)).reduce((s, i) => s + i.employeeWon, 0);
  return {
    scope: "common_subset",
    rows,
    deltaWon: sum(after) - sum(before),
    beforeSubtotalWon: sum(before),
    afterSubtotalWon: sum(after),
    kinds: commonKinds,
  };
}

/** 가정 총계 비교: 한쪽이 확정 합계, 다른 쪽이 가정 총계일 때만 */
export function compareScenarioTotals(before, after) {
  const b = before.completeTotalWon ?? before.scenarioTotalWon;
  const a = after.completeTotalWon ?? after.scenarioTotalWon;
  if (b == null || a == null) return null;
  if (before.scenarioTotalWon == null && after.scenarioTotalWon == null) return null; // 가정이 없으면 이 비교는 쓰지 않음
  return { beforeWon: b, afterWon: a, deltaWon: a - b };
}

// ─── 기간 계산 ───────────────────────────────────────────────────────────────
export function calculatePeriod(period, rules, { allowEmploymentScenario = false } = {}) {
  const ap = period.applicability;
  const items = [];

  items.push(
    ap.pension === "not_applicable" ? notApplicable("pension", "국민연금 미적용으로 선택했습니다.")
    : ap.pension === "unknown" ? unavailable("pension", "FI_APPLICABILITY_UNKNOWN", "국민연금 적용 여부를 확인해 주세요.")
    : pensionItem(period, rules),
  );

  let health;
  if (ap.health === "not_applicable") health = notApplicable("health", "건강보험 미적용으로 선택했습니다.");
  else if (ap.health === "unknown") health = unavailable("health", "FI_APPLICABILITY_UNKNOWN", "건강보험 적용 여부를 확인해 주세요.");
  else health = calculateHealthInsurance(basisFor(period, "health").amount, period.month, rules);
  items.push(health);

  items.push(
    ap.health === "unknown"
      ? unavailable("long_term_care", "FI_APPLICABILITY_UNKNOWN", "건강보험 적용 여부가 정해져야 장기요양보험을 계산합니다.")
      : calculateLongTermCare(health, period.month, rules),
  );

  items.push(
    ap.employment === "not_applicable" ? notApplicable("employment", "고용보험 미적용으로 선택했습니다.")
    : ap.employment === "unknown" ? unavailable("employment", "FI_APPLICABILITY_UNKNOWN", "고용보험 적용 여부를 확인해 주세요.")
    : calculateEmploymentInsurance(basisFor(period, "employment").amount, period.month, rules, { allowScenario: allowEmploymentScenario }),
  );

  return aggregateInsuranceItems(items);
}

// ─── 세금·수령액 (보험료와 분리) ─────────────────────────────────────────────
// 기존 페이지의 간이 소득세 추정식. 국세청 간이세액표가 아니므로 'preview'로만 쓴다.
export function legacyEstimatedIncomeTax(monthlyTaxablePay, dependents, children) {
  const annual = monthlyTaxablePay * 12;
  const earned = Math.min(12_000_000, Math.max(7_500_000, annual * 0.2));
  const personal = Math.max(1, dependents) * 1_500_000;
  const childDeduction = Math.max(0, children) * 150_000;
  const base = Math.max(0, annual - earned - personal - childDeduction);
  const brackets = [
    { limit: 14_000_000, rate: 0.06, deduction: 0 },
    { limit: 50_000_000, rate: 0.15, deduction: 1_260_000 },
    { limit: 88_000_000, rate: 0.24, deduction: 5_760_000 },
    { limit: 150_000_000, rate: 0.35, deduction: 15_440_000 },
    { limit: 300_000_000, rate: 0.38, deduction: 19_940_000 },
    { limit: 500_000_000, rate: 0.4, deduction: 25_940_000 },
    { limit: 1_000_000_000, rate: 0.42, deduction: 35_940_000 },
    { limit: Infinity, rate: 0.45, deduction: 65_940_000 },
  ];
  const bracket = brackets.find((b) => base <= b.limit);
  const tax = Math.max(0, base * bracket.rate - bracket.deduction);
  const credit = tax <= 1_300_000 ? tax * 0.55 : 715_000 + (tax - 1_300_000) * 0.3;
  const annualTax = Math.max(0, tax - Math.min(740_000, credit));
  const incomeTax = Math.floor(annualTax / 12 / 10) * 10;
  return { incomeTaxWon: incomeTax, localTaxWon: Math.floor(incomeTax / 10 / 10) * 10 };
}

/**
 * taxInput: { mode: 'excluded' } | { mode: 'manual', incomeTaxWon, localTaxWon }
 *         | { mode: 'legacy_preview', dependents, children }
 * useScenario: 가정 총계를 쓸지(사용자가 가정을 켠 경우)
 */
export function calculatePayrollCash(period, aggregate, taxInput, { useScenario = false } = {}) {
  const insurance = aggregate.completeTotalWon ?? (useScenario ? aggregate.scenarioTotalWon : null);
  const assumption = aggregate.completeTotalWon == null && insurance != null;
  const base = { grossPayWon: period.grossPayWon, insuranceTotalWon: insurance, assumption };

  if (insurance == null) {
    return { ...base, incomeTaxWon: null, localTaxWon: null, amountWon: null, label: "unavailable", issue: issue("FI_TAKE_HOME_INCOMPLETE", "계산되지 않은 보험 항목이 있어 공제 후 금액을 내지 않습니다.") };
  }
  // 비과세는 산정 기준만 줄일 뿐 지급액에서 다시 빼지 않는다
  if (taxInput?.mode === "manual") {
    const it = taxInput.incomeTaxWon;
    const lt = taxInput.localTaxWon;
    if (!Number.isSafeInteger(it) || !Number.isSafeInteger(lt) || it < 0 || lt < 0) {
      return { ...base, incomeTaxWon: null, localTaxWon: null, amountWon: null, label: "unavailable", issue: issue("FI_TAX_INPUT", "소득세와 지방소득세를 0원 이상으로 입력해 주세요.") };
    }
    return { ...base, incomeTaxWon: it, localTaxWon: lt, amountWon: period.grossPayWon - insurance - it - lt, label: "estimated_take_home" };
  }
  if (taxInput?.mode === "legacy_preview") {
    const t = legacyEstimatedIncomeTax(period.grossPayWon - period.nonTaxablePayWon, taxInput.dependents ?? 1, taxInput.children ?? 0);
    return { ...base, ...t, amountWon: period.grossPayWon - insurance - t.incomeTaxWon - t.localTaxWon, label: "preview" };
  }
  return { ...base, incomeTaxWon: null, localTaxWon: null, amountWon: period.grossPayWon - insurance, label: "after_insurance" };
}

// ─── 최상위 ─────────────────────────────────────────────────────────────────
/**
 * input: { comparisonMode: 'same_basis'|'changed_pay', before: rawPeriod, after: rawPeriod,
 *          assumptions: { employmentScenario: boolean }, tax: TaxInput }
 */
export function calculateFourInsuranceComparison(input, rules) {
  const vb = validatePayrollPeriod(input.before);
  const va = validatePayrollPeriod(input.after);
  if (!vb.ok || !va.ok) {
    return { ok: false, errors: { before: vb.ok ? [] : vb.errors, after: va.ok ? [] : va.errors } };
  }
  const allowEmploymentScenario = Boolean(input.assumptions?.employmentScenario);
  const before = calculatePeriod(vb.value, rules, { allowEmploymentScenario: false });
  const after = calculatePeriod(va.value, rules, { allowEmploymentScenario });
  const comparison = compareInsuranceScopes(before, after);
  const scenarioComparison = allowEmploymentScenario ? compareScenarioTotals(before, after) : null;
  return {
    ok: true,
    value: {
      comparisonMode: input.comparisonMode,
      periods: { before: vb.value, after: va.value },
      warnings: [...vb.warnings, ...va.warnings],
      before,
      after,
      comparison,
      scenarioComparison,
      cash: {
        before: calculatePayrollCash(vb.value, before, input.tax?.before ?? input.tax, { useScenario: false }),
        after: calculatePayrollCash(va.value, after, input.tax?.after ?? input.tax, { useScenario: allowEmploymentScenario }),
      },
    },
  };
}
