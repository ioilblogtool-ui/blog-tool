// 국민연금 보험료 공용 계산 모듈 (DOM 없음)
// 4대보험 계산기와 국민연금 보험료 계산기가 같은 함수·같은 규칙 버전을 쓰도록 분리했다.
// 설계: docs/design/202611/02_국민연금_보험료_계산기_상세설계.md
//
// 금액은 원 단위 정수(Number)로 다룬다. 요율은 정수 분수 {num, den}이며
// amount × num 이 2^53 아래에서 계산되므로(10억원 × 10만 = 1e14) 절사 결과가 정확하다.

/** 기간 규칙 조회: from ≤ month ≤ to (YYYY-MM 문자열 비교) */
export function findRule(rules, month) {
  if (!Array.isArray(rules) || !/^\d{4}-\d{2}$/.test(month || "")) return null;
  const hits = rules.filter((r) => r.from <= month && (r.to == null || month <= r.to));
  if (hits.length !== 1) return null; // 없음 또는 기간 중복 — 어느 쪽도 임의로 고르지 않는다
  return hits[0];
}

/** amount × ratio 를 unit 단위로 버림 */
export function mulFloor(amount, ratio, unit = 1) {
  if (!Number.isSafeInteger(amount) || amount < 0) throw new RangeError("amount must be a non-negative safe integer");
  return Math.floor((amount * ratio.num) / (ratio.den * unit)) * unit;
}

/** 유리수 결과 {num, den} — 요율 비교 모드에서 반올림 전 값을 보존 */
function mulRational(amount, ratio) {
  return { num: amount * ratio.num, den: ratio.den };
}
function subRational(a, b) {
  return { num: a.num * b.den - b.num * a.den, den: a.den * b.den };
}
function scaleRational(a, k) {
  return { num: a.num * k, den: a.den };
}
export function roundRational(r) {
  return Math.round(r.num / r.den);
}

function fail(code, message) {
  return { ok: false, issue: { code, message } };
}

/**
 * 같은 기준소득월액에 연도별 요율만 적용한 비교 (단수 처리·상하한 제외)
 * input: { subscriber: 'employee'|'regional', fixedBasisWon, fromYear, toYear }
 */
export function calculatePensionRateOnly(input, rateRules) {
  const basis = input?.fixedBasisWon;
  if (!Number.isSafeInteger(basis)) return fail("NP_EMPTY_BASIS", "기준소득월액을 입력해 주세요.");
  if (basis <= 0) return fail("NP_ZERO_OR_NEGATIVE", "기준소득월액은 0보다 커야 합니다.");
  if (basis > 100_000_000) return fail("NP_AMOUNT_LIMIT", "1억원 이하로 입력해 주세요.");

  const ruleFor = (year) => findRule(rateRules, `${year}-01`);
  const before = ruleFor(input.fromYear);
  const after = ruleFor(input.toYear);
  if (!before || !after || before.status !== "verified" || after.status !== "verified") {
    return fail("NP_RATE_UNAVAILABLE", "해당 연도의 확인된 국민연금 요율이 없습니다.");
  }

  const burden = (rule) => {
    const regional = input.subscriber === "regional";
    const subscriber = mulRational(basis, regional ? rule.total : rule.employee);
    return {
      basisWon: basis,
      subscriberWon: subscriber,
      employerWon: regional ? null : mulRational(basis, rule.employer),
      totalWon: mulRational(basis, rule.total),
      calculationKind: "rate_only",
      ruleId: rule.id,
    };
  };
  const b = burden(before);
  const a = burden(after);
  const subscriberDelta = subRational(a.subscriberWon, b.subscriberWon);
  return {
    ok: true,
    value: {
      mode: "rate_only",
      before: b,
      after: a,
      subscriberDeltaWon: subscriberDelta,
      employerDeltaWon: a.employerWon && b.employerWon ? subRational(a.employerWon, b.employerWon) : null,
      monthlyDeltaAnnualizedWon: scaleRational(subscriberDelta, 12),
      annualizationMonths: 12,
    },
  };
}

/**
 * 특정 월의 국민연금 보험료 추정 — 4대보험 계산기의 공용 진입점
 * input: { month: 'YYYY-MM', subscriber: 'employee'|'regional',
 *          basisInput: { kind: 'reported_basis'|'income_estimate', amountWon } }
 * rules: { pensionRates, pensionBasis, rounding }
 */
export function calculatePensionMonthly(input, rules) {
  const amount = input?.basisInput?.amountWon;
  if (!Number.isSafeInteger(amount)) return fail("NP_EMPTY_BASIS", "국민연금 기준 금액을 입력해 주세요.");
  if (amount <= 0) return fail("NP_ZERO_OR_NEGATIVE", "기준 금액이 0원 이하이면 일반 보험료 계산 대상이 아닙니다. 납부예외 여부를 공단에서 확인하세요.");

  const rate = findRule(rules.pensionRates, input.month);
  if (!rate || rate.status !== "verified") return fail("NP_RATE_UNAVAILABLE", `${input.month} 국민연금 요율이 확인되지 않았습니다.`);
  const basisRule = findRule(rules.pensionBasis, input.month);
  if (!basisRule || basisRule.status !== "verified") {
    return fail("NP_BASIS_RULE_UNAVAILABLE", `${input.month}에 적용할 기준소득월액 상·하한이 아직 고시되지 않았습니다.`);
  }

  const adjustments = [];
  let basis;
  if (input.basisInput.kind === "reported_basis") {
    // 신고된 기준소득월액은 다시 절사·보정하지 않는다. 형식이 맞지 않으면 확인 요청.
    if (amount % basisRule.incomeRoundingUnit !== 0 || amount < basisRule.lowerWon || amount > basisRule.upperWon) {
      return fail(
        "NP_INVALID_REPORTED_BASIS",
        `${input.month} 기준소득월액은 ${basisRule.lowerWon.toLocaleString("ko-KR")}~${basisRule.upperWon.toLocaleString("ko-KR")}원, 천원 단위여야 합니다.`,
      );
    }
    basis = amount;
  } else {
    const rounded = Math.floor(amount / basisRule.incomeRoundingUnit) * basisRule.incomeRoundingUnit;
    if (rounded !== amount) adjustments.push({ kind: "income_rounding", beforeWon: amount, afterWon: rounded, ruleId: basisRule.id });
    basis = rounded;
    if (basis < basisRule.lowerWon) {
      adjustments.push({ kind: "lower_bound", beforeWon: basis, afterWon: basisRule.lowerWon, ruleId: basisRule.id });
      basis = basisRule.lowerWon;
    } else if (basis > basisRule.upperWon) {
      adjustments.push({ kind: "upper_bound", beforeWon: basis, afterWon: basisRule.upperWon, ruleId: basisRule.id });
      basis = basisRule.upperWon;
    }
  }

  const unit = rules.rounding?.pensionPremium?.unit ?? 1;
  const regional = input.subscriber === "regional";
  const subscriberWon = mulFloor(basis, regional ? rate.total : rate.employee, unit);
  const employerWon = regional ? null : mulFloor(basis, rate.employer, unit);
  return {
    ok: true,
    value: {
      basisWon: basis,
      subscriberWon,
      employerWon,
      totalWon: subscriberWon + (employerWon ?? 0),
      calculationKind: "estimate",
      adjustments,
      provenance: {
        rateRuleId: rate.id,
        basisRuleId: basisRule.id,
        roundingRuleId: rules.rounding?.pensionPremium?.id ?? null,
        roundingStatus: rules.rounding?.pensionPremium?.status ?? "unknown",
      },
    },
  };
}
