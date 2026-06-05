export type PeakWageInput = {
  currentSalaryManwon: number;
  currentServiceYears: number;
  yearsUntilPeak: number;
  yearsAfterPeak: number;
  salaryCutRate: number;
  dcReturnRate: number;
};

export type PeakWageResult = {
  serviceAtSwitch: number;
  totalServiceYears: number;
  postPeakSalaryManwon: number;
  dbKeepManwon: number;
  dbNoCutBasisManwon: number;
  dbImpactManwon: number;
  transferPrincipalManwon: number;
  dcFutureContributionManwon: number;
  switchToDcManwon: number;
  diffManwon: number;
  diffPct: number;
  breakEvenReturnRate: number | null;
  verdict: "switch" | "keep" | "similar";
};

export const DEFAULT_PEAK_WAGE_INPUT: PeakWageInput = {
  currentSalaryManwon: 8000,
  currentServiceYears: 20,
  yearsUntilPeak: 1,
  yearsAfterPeak: 3,
  salaryCutRate: 20,
  dcReturnRate: 5,
};

export const PEAK_WAGE_PRESETS = [
  {
    id: "one-year",
    label: "1년 후 피크",
    values: { yearsUntilPeak: 1, yearsAfterPeak: 3, salaryCutRate: 20 },
  },
  {
    id: "immediate",
    label: "곧바로 피크",
    values: { yearsUntilPeak: 0, yearsAfterPeak: 3, salaryCutRate: 20 },
  },
  {
    id: "long-peak",
    label: "5년 피크 구간",
    values: { yearsUntilPeak: 1, yearsAfterPeak: 5, salaryCutRate: 25 },
  },
  {
    id: "mild-cut",
    label: "완만한 삭감",
    values: { yearsUntilPeak: 2, yearsAfterPeak: 3, salaryCutRate: 10 },
  },
] as const;

export const PEAK_WAGE_FAQ = [
  {
    question: "임금피크제 전에 퇴직연금 DB형을 DC형으로 바꾸면 무조건 유리한가요?",
    answer:
      "아닙니다. 임금 삭감 폭이 크고 피크 후 근속기간이 길수록 DC 전환 검토 이유가 커지지만, DC형은 운용 손익이 본인에게 귀속됩니다. 회사 규약, 전환 가능 시점, 운용상품, 본인의 위험 감수 성향을 함께 확인해야 합니다.",
  },
  {
    question: "DB형 유지 금액은 어떤 기준으로 계산하나요?",
    answer:
      "이 계산기는 퇴직 직전 연봉을 월평균 임금처럼 단순 환산한 뒤 총 근속연수를 곱하는 간이 방식입니다. 실제 퇴직급여는 평균임금 산정, 수당 포함 여부, 회사 규정에 따라 달라질 수 있습니다.",
  },
  {
    question: "DC 전환 금액은 어떤 구조로 계산하나요?",
    answer:
      "전환 시점까지 쌓인 DB 기준 퇴직급여를 DC 계좌로 옮긴다고 가정하고, 이후에는 임금피크 후 연봉의 1/12이 매년 납입되어 입력한 수익률로 운용된다고 단순 추정합니다.",
  },
  {
    question: "손익분기 수익률은 무엇인가요?",
    answer:
      "DB형을 그대로 유지했을 때의 예상 금액과 DC 전환 시 예상 금액이 비슷해지는 연평균 운용수익률입니다. 이 수익률이 높게 나오면 실제로 달성하기 어려울 수 있으므로 보수적으로 봐야 합니다.",
  },
  {
    question: "이미 임금피크제가 시작된 뒤에도 계산할 수 있나요?",
    answer:
      "가능합니다. '임금피크까지 남은 기간'을 0년으로 두고 현재 연봉과 삭감률, 남은 근속기간을 입력하면 됩니다. 다만 이미 평균임금이 낮아진 상태라면 전환 전 산정 기준을 회사에 확인해야 합니다.",
  },
  {
    question: "이 계산 결과만 보고 전환 신청을 해도 되나요?",
    answer:
      "아니요. 이 페이지는 전환 검토를 돕는 추정 계산기입니다. 실제 신청 전에는 회사 인사팀, 퇴직연금 사업자, 근로자대표 동의 여부, 전환 후 재전환 가능 여부를 반드시 확인해야 합니다.",
  },
];

export const PEAK_WAGE_RELATED_LINKS = [
  { href: "/reports/retirement-pension-db-to-dc-peak-wage-2026/", label: "임금피크제 전 DB에서 DC로 바꿔야 할까" },
  { href: "/tools/retirement-dc-db-calculator/", label: "퇴직연금 DB vs DC 전환 계산기" },
  { href: "/reports/retirement-pension-dc-db-irp-2026/", label: "퇴직연금 DB·DC·IRP 비교" },
  { href: "/tools/retirement/", label: "퇴직금 계산기" },
  { href: "/tools/irp-pension-calculator/", label: "IRP 연금 계산기" },
];

export function calculatePeakWageRetirement(input: PeakWageInput): PeakWageResult {
  const currentSalary = Math.max(input.currentSalaryManwon, 0);
  const currentYears = Math.max(input.currentServiceYears, 0);
  const yearsUntilPeak = Math.max(input.yearsUntilPeak, 0);
  const yearsAfterPeak = Math.max(input.yearsAfterPeak, 0);
  const cutRate = Math.min(Math.max(input.salaryCutRate, 0), 80);
  const dcReturn = Math.max(input.dcReturnRate, -20) / 100;

  const serviceAtSwitch = currentYears + yearsUntilPeak;
  const totalServiceYears = serviceAtSwitch + yearsAfterPeak;
  const postPeakSalaryManwon = currentSalary * (1 - cutRate / 100);

  const dbKeepManwon = (postPeakSalaryManwon / 12) * totalServiceYears;
  const dbNoCutBasisManwon = (currentSalary / 12) * totalServiceYears;
  const dbImpactManwon = Math.max(dbNoCutBasisManwon - dbKeepManwon, 0);

  const transferPrincipalManwon = (currentSalary / 12) * serviceAtSwitch;
  const grownPrincipal = transferPrincipalManwon * Math.pow(1 + dcReturn, yearsAfterPeak);

  let dcFutureContributionManwon = 0;
  for (let year = 1; year <= yearsAfterPeak; year += 1) {
    const remainingYears = yearsAfterPeak - year;
    dcFutureContributionManwon += (postPeakSalaryManwon / 12) * Math.pow(1 + dcReturn, remainingYears);
  }

  const switchToDcManwon = grownPrincipal + dcFutureContributionManwon;
  const diffManwon = switchToDcManwon - dbKeepManwon;
  const diffPct = dbKeepManwon > 0 ? (diffManwon / dbKeepManwon) * 100 : 0;
  const verdict = Math.abs(diffPct) < 3 ? "similar" : diffManwon > 0 ? "switch" : "keep";

  return {
    serviceAtSwitch,
    totalServiceYears,
    postPeakSalaryManwon,
    dbKeepManwon,
    dbNoCutBasisManwon,
    dbImpactManwon,
    transferPrincipalManwon,
    dcFutureContributionManwon,
    switchToDcManwon,
    diffManwon,
    diffPct,
    breakEvenReturnRate: findBreakEvenReturn(input),
    verdict,
  };
}

export function findBreakEvenReturn(input: PeakWageInput): number | null {
  const targetInput = { ...input, dcReturnRate: 0 };
  const zero = calculateWithoutBreakEven(targetInput).switchToDcManwon - calculateWithoutBreakEven(targetInput).dbKeepManwon;
  if (zero >= 0) return 0;

  const highInput = { ...input, dcReturnRate: 15 };
  const high = calculateWithoutBreakEven(highInput).switchToDcManwon - calculateWithoutBreakEven(highInput).dbKeepManwon;
  if (high < 0) return null;

  let low = 0;
  let highRate = 15;
  for (let i = 0; i < 32; i += 1) {
    const mid = (low + highRate) / 2;
    const midInput = { ...input, dcReturnRate: mid };
    const diff = calculateWithoutBreakEven(midInput).switchToDcManwon - calculateWithoutBreakEven(midInput).dbKeepManwon;
    if (diff >= 0) highRate = mid;
    else low = mid;
  }
  return highRate;
}

function calculateWithoutBreakEven(input: PeakWageInput): Omit<PeakWageResult, "breakEvenReturnRate" | "verdict" | "diffPct"> {
  const currentSalary = Math.max(input.currentSalaryManwon, 0);
  const currentYears = Math.max(input.currentServiceYears, 0);
  const yearsUntilPeak = Math.max(input.yearsUntilPeak, 0);
  const yearsAfterPeak = Math.max(input.yearsAfterPeak, 0);
  const cutRate = Math.min(Math.max(input.salaryCutRate, 0), 80);
  const dcReturn = Math.max(input.dcReturnRate, -20) / 100;

  const serviceAtSwitch = currentYears + yearsUntilPeak;
  const totalServiceYears = serviceAtSwitch + yearsAfterPeak;
  const postPeakSalaryManwon = currentSalary * (1 - cutRate / 100);
  const dbKeepManwon = (postPeakSalaryManwon / 12) * totalServiceYears;
  const dbNoCutBasisManwon = (currentSalary / 12) * totalServiceYears;
  const dbImpactManwon = Math.max(dbNoCutBasisManwon - dbKeepManwon, 0);
  const transferPrincipalManwon = (currentSalary / 12) * serviceAtSwitch;
  const grownPrincipal = transferPrincipalManwon * Math.pow(1 + dcReturn, yearsAfterPeak);

  let dcFutureContributionManwon = 0;
  for (let year = 1; year <= yearsAfterPeak; year += 1) {
    dcFutureContributionManwon += (postPeakSalaryManwon / 12) * Math.pow(1 + dcReturn, yearsAfterPeak - year);
  }

  const switchToDcManwon = grownPrincipal + dcFutureContributionManwon;
  const diffManwon = switchToDcManwon - dbKeepManwon;

  return {
    serviceAtSwitch,
    totalServiceYears,
    postPeakSalaryManwon,
    dbKeepManwon,
    dbNoCutBasisManwon,
    dbImpactManwon,
    transferPrincipalManwon,
    dcFutureContributionManwon,
    switchToDcManwon,
    diffManwon,
  };
}

export function formatManwon(value: number): string {
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  if (abs >= 10000) {
    const eok = Math.floor(abs / 10000);
    const man = Math.round(abs % 10000);
    return man > 0
      ? `${sign}${eok.toLocaleString("ko-KR")}억 ${man.toLocaleString("ko-KR")}만원`
      : `${sign}${eok.toLocaleString("ko-KR")}억원`;
  }
  return `${sign}${Math.round(abs).toLocaleString("ko-KR")}만원`;
}
