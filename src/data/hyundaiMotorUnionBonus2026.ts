export interface ProfitBasis {
  id: string;
  label: string;
  shortLabel: string;
  netProfit: number;
  sourceName: string;
  sourceUrl: string;
}

export const PROFIT_BASES: ProfitBasis[] = [
  {
    id: "profit-10_3648",
    label: "2025년 순이익 10조 3,648억원 기준",
    shortLabel: "10조 3,648억원",
    netProfit: 10_364_800_000_000,
    sourceName: "한국금융신문",
    sourceUrl: "https://www.fntimes.com/html/view.php?ud=202605170046102444dd55077bc2_18",
  },
  {
    id: "profit-13_0",
    label: "2025년 순이익 13조원 기준",
    shortLabel: "13조원",
    netProfit: 13_000_000_000_000,
    sourceName: "보도 종합",
    sourceUrl: "https://www.reportera.co.kr/car/hyundai-motor-wage-negotiation-2026-bonus-ai-employment/comment-page-1/",
  },
];

export interface EmployeeBasis {
  id: string;
  label: string;
  shortLabel: string;
  employeeCount: number;
  note: string;
}

export const EMPLOYEE_BASES: EmployeeBasis[] = [
  {
    id: "union-39668",
    label: "정규직 조합원 3만 9,668명 기준",
    shortLabel: "3만 9,668명",
    employeeCount: 39_668,
    note: "쟁의행위 찬반투표 대상 조합원 수 (가장 좁은 기준)",
  },
  {
    id: "estimate-51500",
    label: "보도 환산 기준 (약 5만 1,500명)",
    shortLabel: "약 5만 1,500명",
    employeeCount: 51_500,
    note: "1인당 6,000만원 보도를 역산한 추정 직원 수",
  },
  {
    id: "estimate-75000",
    label: "협력업체 포함 추정 (약 7만 5,000명)",
    shortLabel: "약 7만 5,000명",
    employeeCount: 75_000,
    note: "1인당 4,000만원 보도를 역산한 추정치 — 협력업체 동일적용 요구를 반영하면 분모가 커짐",
  },
];

export const DEMAND_RATE = 0.3;
export const DEFAULT_PROFIT_BASIS_ID = "profit-10_3648";
export const DEFAULT_EMPLOYEE_BASIS_ID = "union-39668";

export interface UnionDemandFact {
  label: string;
  value: string;
  sourceName: string;
  sourceUrl: string;
}

export const UNION_DEMAND_FACTS: UnionDemandFact[] = [
  {
    label: "기본급 인상",
    value: "월 14만 9,600원 (호봉승급분 제외)",
    sourceName: "서울신문",
    sourceUrl: "https://www.seoul.co.kr/news/society/2026/05/06/20260506500120",
  },
  {
    label: "성과급",
    value: "전년도 순이익의 30% (정규직 + 협력업체 동일 적용 요구)",
    sourceName: "미주중앙일보",
    sourceUrl: "https://www.koreadaily.com/article/20260624020122139",
  },
  {
    label: "상여금",
    value: "750% → 800% 인상",
    sourceName: "뉴데일리",
    sourceUrl: "https://biz.newdaily.co.kr/site/data/html/2026/04/20/2026042000109.html",
  },
  {
    label: "고용 형태",
    value: "완전 월급제 시행 요구",
    sourceName: "보도 종합",
    sourceUrl: "https://www.usmbc.co.kr/NewsArticle/838968",
  },
  {
    label: "정년",
    value: "국민연금 수급 시기와 연동, 최장 65세 연장",
    sourceName: "보도 종합",
    sourceUrl: "https://www.ajunews.com/view/20260506152923422",
  },
  {
    label: "쟁의행위 투표",
    value: "조합원 39,668명 중 찬성률 86.65% (투표율 94.15%)",
    sourceName: "파이낸셜뉴스",
    sourceUrl: "https://www.fnnews.com/news/202606241731301676",
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const HMU_FAQ: FaqItem[] = [
  {
    question: "현대차 노조가 요구하는 성과급은 확정된 금액인가요?",
    answer:
      "아닙니다. 2026년 4월 임시대의원대회에서 확정한 노조 요구안이며, 회사와의 협상을 통해 실제 지급액과 방식은 달라질 수 있습니다. 이 페이지의 모든 계산은 '요구안 기준' 시뮬레이션입니다.",
  },
  {
    question: "순이익 30%면 정확히 얼마인가요?",
    answer:
      "기준 순이익에 따라 다릅니다. 2025년 순이익을 10조 3,648억원으로 볼 경우 약 3조 914억원, 13조원으로 볼 경우 약 3조 9,000억원입니다. 보도마다 기준 시점과 집계 방식이 달라 두 수치 모두 참고용으로 제공합니다.",
  },
  {
    question: "1인당 환산액이 보도마다 6,000만원, 4,000만원으로 다른 이유는?",
    answer:
      "나누는 직원 수 기준이 다릅니다. 정규직 조합원(3만 9,668명)만 기준으로 하면 1인당 금액이 커지고, 협력업체까지 포함한 추정치(약 7만 5,000명)로 나누면 분모가 커져 1인당 금액이 작아집니다. 이 페이지에서 두 기준을 직접 바꿔보며 비교할 수 있습니다.",
  },
  {
    question: "협력업체 직원도 성과급을 받게 되나요?",
    answer:
      "노조는 협력업체 직원에게도 동일 적용을 요구하고 있으나, 이는 요구안 단계로 실제 적용 여부는 협상 결과에 따라 달라집니다.",
  },
  {
    question: "상여금 750%에서 800%로 오르면 실제로 얼마나 늘어나나요?",
    answer:
      "기본급 기준 50%p 추가 상여이며, 개인 기본급에 따라 금액이 달라집니다. 이 페이지의 성과급(순이익 30%) 계산과는 별도 항목입니다.",
  },
  {
    question: "이 계산기로 내 예상 성과급을 알 수 있나요?",
    answer:
      "이 페이지는 전체 재원을 단순 평균한 1인당 추정액을 보여주는 것으로, 실제 개인별 지급액은 호봉, 평가, 직군에 따라 다릅니다. 세후 실수령액이 궁금하다면 성과급 세금 계산기에서 직접 확인해보세요.",
  },
  {
    question: "현대차는 원래 성과급을 어떤 방식으로 지급했나요?",
    answer:
      "현대차는 연봉 대비 비율(%)이 아니라 매년 노사협의로 정해지는 방식을 사용해왔습니다. 노조의 이번 요구는 '전년도 순이익의 30%'라는 고정 비율을 새로 도입하자는 것으로, 기존 방식과는 근본적으로 다른 구조 변경 요구입니다.",
  },
  {
    question: "노조 요구가 그대로 받아들여질 가능성은 얼마나 되나요?",
    answer:
      "단정하기 어렵습니다. 회사 측은 실적 방어가 어렵다는 입장을 보이고 있고, 과거에도 노조 요구안과 최종 합의안 사이에 상당한 차이가 있었습니다. 쟁의행위 찬성률 86.65%로 파업권을 확보한 상태라 협상 압박은 커졌지만, 최종 수치는 협상 결과를 지켜봐야 합니다.",
  },
];

export function formatHmuWon(amount: number): string {
  if (amount >= 1_000_000_000_000) {
    const jo = amount / 1_000_000_000_000;
    const eok = Math.round((amount % 1_000_000_000_000) / 100_000_000);
    return eok > 0 ? `${Math.floor(jo)}조 ${eok.toLocaleString()}억원` : `${Math.floor(jo)}조원`;
  }
  if (amount >= 100_000_000) {
    const eok = amount / 100_000_000;
    return `${eok % 1 === 0 ? eok : eok.toFixed(1)}억원`;
  }
  if (amount >= 10_000) {
    return `${Math.round(amount / 10_000).toLocaleString()}만원`;
  }
  return `${amount.toLocaleString()}원`;
}

export interface MatrixRow {
  profitBasisId: string;
  employeeBasisId: string;
  profitShortLabel: string;
  employeeShortLabel: string;
  totalFund: number;
  perHead: number;
}

export const MATRIX_ROWS: MatrixRow[] = PROFIT_BASES.flatMap((profit) =>
  EMPLOYEE_BASES.map((employee) => {
    const totalFund = profit.netProfit * DEMAND_RATE;
    return {
      profitBasisId: profit.id,
      employeeBasisId: employee.id,
      profitShortLabel: profit.shortLabel,
      employeeShortLabel: employee.shortLabel,
      totalFund,
      perHead: totalFund / employee.employeeCount,
    };
  })
);

export interface ComparisonRow {
  label: string;
  current: string;
  demand: string;
  note: string;
}

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    label: "상여금",
    current: "750%",
    demand: "800%",
    note: "기본급 기준 50%p 추가. 성과급(순이익 30%)과는 별도 항목",
  },
  {
    label: "기본급",
    current: "호봉제 인상분만 반영",
    demand: "월 14만 9,600원 추가 인상",
    note: "호봉승급분 제외, 별도 인상 요구",
  },
  {
    label: "성과급 산정 기준",
    current: "노사협의 별도 결정 (매년 변동)",
    demand: "전년도 순이익의 30% 고정 비율",
    note: "비율을 고정하면 실적이 나빠도 일정 수준 보장되는 구조로 바뀜",
  },
  {
    label: "지급 대상",
    current: "정규직 중심",
    demand: "정규직 + 협력업체 동일 적용",
    note: "협력업체 포함 여부에 따라 1인당 환산액이 크게 갈림",
  },
];

export const SEO_INTRO_TITLE = "현대차 성과급 30% 요구, 어떻게 봐야 할까요?";

export const SEO_CRITERIA: string[] = [
  "총 성과급 재원 = 기준 순이익 × 30% (노조 요구 비율)",
  "1인당 환산액 = 총 성과급 재원 ÷ 선택한 직원 수 기준",
  "순이익 기준은 보도된 두 수치(10조 3,648억원 / 13조원) 중 선택 가능",
  "직원 수 기준은 정규직 조합원 수와, 협력업체 포함 추정치 중 선택 가능",
  "모든 결과는 단순 평균이며 실제 개인별 배분 방식과는 무관한 추정치",
];

export interface RelatedLink {
  href: string;
  label: string;
}

export const RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/bonus-after-tax-calculator/", label: "성과급 세금 계산기" },
  { href: "/tools/hyundai-bonus/", label: "현대자동차 성과급 계산기" },
  { href: "/reports/samsung-biologics-union-bonus-2026/", label: "삼성바이오로직스 성과급 20% 요구 계산" },
  { href: "/reports/kakao-union-bonus-2026/", label: "카카오 성과급 갈등 2026" },
  { href: "/reports/corporate-bonus-comparison-2026/", label: "대기업 성과급 완전 비교" },
  { href: "/reports/corporate-bonus-ranking-top10-2026/", label: "대기업 성과급 순위 TOP 10" },
];

export const HMU_META = {
  slug: "hyundai-motor-union-bonus-2026",
  title: "현대차 성과급 30% 요구, 1인당 얼마?",
  seoTitle: "현대차 성과급 30% 요구 2026 | 1인당 환산액 바로 계산",
  description:
    "현대차 노조의 순이익 30% 성과급 요구안을 1인당으로 환산해보는 시뮬레이션. 기준에 따라 4천만~6천만원까지 차이나는 이유를 직접 계산해보세요.",
  updatedAt: "2026-06-26",
};
