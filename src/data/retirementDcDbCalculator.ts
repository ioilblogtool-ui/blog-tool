// ============================================================
// retirementDcDbCalculator.ts
// DB형 vs DC형 퇴직연금 전환 계산기 데이터
// ============================================================

export interface DbDcScenario {
  dcReturnRate: number;   // DC 운용 수익률 %
  label: string;
  description: string;
  color: string;
}

export interface SalaryGrowthPreset {
  id: string;
  label: string;
  annualGrowthRate: number;  // 연봉 인상률 %
  description: string;
}

/** DB형 퇴직금 계산
 * 퇴직 직전 3개월 평균임금 × 근속연수
 * 연봉 인상이 있으면 마지막 연봉 기준
 */
export function calcDbRetirement(
  currentAnnualSalaryManwon: number,
  yearsOfService: number,
  annualSalaryGrowthPct: number
): number {
  // 퇴직 시점 연봉 계산 (현재 연봉 × (1 + 인상률)^잔여연수)
  const finalAnnualSalary =
    currentAnnualSalaryManwon * Math.pow(1 + annualSalaryGrowthPct / 100, yearsOfService);
  // 퇴직금 = 퇴직 직전 평균임금(월급) × 30 × 근속연수 / 365
  // 간이 계산: 최종 연봉 / 12 × 근속연수
  return (finalAnnualSalary / 12) * yearsOfService;
}

/** DC형 퇴직금 계산
 * 매년 연봉의 1/12을 납입 + 복리 운용
 */
export function calcDcRetirement(
  currentAnnualSalaryManwon: number,
  yearsOfService: number,
  annualSalaryGrowthPct: number,
  dcReturnRatePct: number
): number {
  let total = 0;
  let salary = currentAnnualSalaryManwon;
  const r = dcReturnRatePct / 100;

  for (let y = 1; y <= yearsOfService; y++) {
    // y년차 납입액 (연봉/12)
    const contribution = salary / 12;
    // 납입 후 남은 기간 복리 운용
    const remainingYears = yearsOfService - y;
    total += contribution * Math.pow(1 + r, remainingYears);
    // 다음 해 연봉 인상
    salary *= 1 + annualSalaryGrowthPct / 100;
  }

  return total;
}

/** 전환 유불리 판단 */
export function getRecommendation(
  dbAmount: number,
  dcAmount: number,
  dcReturnRate: number,
  salaryGrowthRate: number
): {
  winner: "db" | "dc" | "similar";
  diff: number;
  diffPct: number;
  reason: string;
} {
  const diff = dcAmount - dbAmount;
  const diffPct = (diff / dbAmount) * 100;
  const absDiffPct = Math.abs(diffPct);

  if (absDiffPct < 3) {
    return {
      winner: "similar",
      diff,
      diffPct,
      reason: "두 유형의 차이가 크지 않습니다. 투자 성향과 이직 계획에 따라 선택하세요.",
    };
  }

  if (diff > 0) {
    return {
      winner: "dc",
      diff,
      diffPct,
      reason: `DC형이 유리합니다. 운용 수익률(${dcReturnRate}%)이 연봉 인상률(${salaryGrowthRate}%)보다 높아 복리 효과가 큽니다.`,
    };
  }

  return {
    winner: "db",
    diff,
    diffPct,
    reason: `DB형이 유리합니다. 연봉 인상률(${salaryGrowthRate}%)이 높아 퇴직 시점 임금 기준 계산이 더 유리합니다.`,
  };
}

export function fmtManwon(v: number): string {
  if (v < 0) return "-" + fmtManwon(-v);
  if (v >= 10000) {
    const eok = Math.floor(v / 10000);
    const rem = Math.round((v % 10000) / 1000) * 1000;
    if (rem > 0) return `${eok.toLocaleString("ko-KR")}억 ${(rem / 10000 * 10000 / 1000).toFixed(0)}천만`;
    return `${eok.toLocaleString("ko-KR")}억`;
  }
  return `${Math.round(v).toLocaleString("ko-KR")}만`;
}

// ─── DC 수익률 시나리오 ──────────────────────────────────
export const DC_SCENARIOS: DbDcScenario[] = [
  { dcReturnRate: 2.0,  label: "예금·채권",        description: "원금 보장형 상품 위주", color: "#94a3b8" },
  { dcReturnRate: 5.0,  label: "혼합형",            description: "주식 30% + 채권 70%",  color: "#60a5fa" },
  { dcReturnRate: 8.0,  label: "S&P500 ETF",        description: "미국 지수 ETF 중심",   color: "#34d399" },
  { dcReturnRate: 10.0, label: "나스닥100 ETF",      description: "기술주 ETF 중심",      color: "#f59e0b" },
  { dcReturnRate: 12.0, label: "레버리지·고수익",    description: "공격형 — 변동성 큼",   color: "#f87171" },
];

// ─── 연봉 인상률 프리셋 ───────────────────────────────────
export const SALARY_GROWTH_PRESETS: SalaryGrowthPreset[] = [
  { id: "low",    label: "낮음 (1~2%)",    annualGrowthRate: 1.5, description: "물가 상승분 수준" },
  { id: "avg",    label: "평균 (3~4%)",    annualGrowthRate: 3.5, description: "대기업 평균 수준" },
  { id: "high",   label: "높음 (5~7%)",    annualGrowthRate: 6.0, description: "빠른 성장 직군" },
  { id: "freeze", label: "동결 (0%)",       annualGrowthRate: 0,   description: "임금 피크제 적용" },
];

// ─── FAQ ─────────────────────────────────────────────────
export const FAQ = [
  {
    q: "DB형과 DC형 퇴직연금의 핵심 차이는?",
    a: "DB형(확정급여형)은 퇴직 직전 3개월 평균임금 × 근속연수로 퇴직금이 결정됩니다. 회사가 운용 위험을 부담합니다. DC형(확정기여형)은 매년 연봉의 1/12이 내 계좌에 입금되고, 내가 직접 ETF·펀드로 운용합니다. 운용 수익에 따라 퇴직금이 달라집니다.",
  },
  {
    q: "DC형이 유리한 경우는?",
    a: "① 운용 수익률(ETF 등)이 연봉 인상률보다 높을 때 ② 이직이 잦아 누적 근속 기간이 짧을 때 ③ 임금 피크제 적용 예정인 경우 ④ 직접 투자에 관심이 있고 장기 우상향 자산에 투자할 때 유리합니다.",
  },
  {
    q: "DB형이 유리한 경우는?",
    a: "① 연봉 인상률이 높고 장기 근속 예정인 경우 ② 투자에 관심이 없거나 원금 손실이 불안한 경우 ③ 퇴직이 가까워 복리 운용 기간이 짧은 경우 유리합니다. 임금 피크제 없이 꾸준히 연봉이 오르는 직장인이라면 DB가 유리할 수 있습니다.",
  },
  {
    q: "DC형으로 전환하면 퇴직연금 계좌에서 ETF를 살 수 있나요?",
    a: "네, DC형 퇴직연금 계좌에서 국내 상장 ETF를 매매할 수 있습니다. 단, 레버리지·인버스 ETF는 편입이 제한됩니다. S&P500, 나스닥100, 미국배당 ETF 등은 편입 가능합니다.",
  },
  {
    q: "한번 DC형으로 전환하면 다시 DB형으로 돌아갈 수 있나요?",
    a: "일반적으로 DC → DB 재전환은 불가능합니다. 회사 규정에 따라 다를 수 있으나, 대부분 DC 전환은 되돌릴 수 없습니다. 전환 전 충분히 시뮬레이션해보세요.",
  },
  {
    q: "이 계산기 결과가 실제 퇴직금과 다를 수 있나요?",
    a: "네, 이 계산기는 참고용 시뮬레이션입니다. 실제 퇴직금은 상여금 포함 여부, 수당, 회사 적립 방식에 따라 달라질 수 있습니다. 정확한 계산은 회사 인사팀이나 퇴직연금 운용사에 문의하세요.",
  },
];
