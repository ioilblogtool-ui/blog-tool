export interface OperatingProfitBasis {
  id: string;
  label: string;
  shortLabel: string;
  operatingProfit: number;
  sourceName: string;
  sourceUrl: string;
}

export const PROFIT_BASIS: OperatingProfitBasis = {
  id: "profit-2_0692",
  label: "2025년 영업이익 2조 692억원 기준",
  shortLabel: "2조 692억원",
  operatingProfit: 2_069_200_000_000,
  sourceName: "금융경제플러스",
  sourceUrl: "https://www.kndaily.co.kr/news/articleView.html?idxno=308794",
};

export interface EmployeeBasis {
  id: string;
  label: string;
  shortLabel: string;
  employeeCount: number;
  note: string;
}

export const EMPLOYEE_BASES: EmployeeBasis[] = [
  {
    id: "union-4000",
    label: "노조 조합원 약 4,000명 기준",
    shortLabel: "약 4,000명",
    employeeCount: 4_000,
    note: "파업 투표 모집단 기준, 전체 임직원과는 다름",
  },
  {
    id: "total-5360",
    label: "전체 임직원 약 5,360명 기준",
    shortLabel: "약 5,360명",
    employeeCount: 5_360,
    note: "국민연금 가입자 기준 집계 (사람인·캐치). 사업보고서 공식치와 소폭 차이 가능",
  },
];

export const DEMAND_RATE = 0.2;
export const ENCOURAGEMENT_PER_HEAD = 30_000_000;
export const DEFAULT_EMPLOYEE_BASIS_ID = "union-4000";

export interface OfferComparisonItem {
  label: string;
  unionDemand: string;
  companyOffer: string;
  gap: string;
}

export const OFFER_COMPARISON: OfferComparisonItem[] = [
  { label: "임금 인상률", unionDemand: "14.3% (평균 14% 보도)", companyOffer: "6.2%", gap: "약 2.3배 차이" },
  { label: "일시금·격려금", unionDemand: "1인당 3,000만원", companyOffer: "1인당 600만원", gap: "5배 차이" },
  { label: "성과급", unionDemand: "영업이익의 20% 배분", companyOffer: "별도 성과급 배분 합의 없음", gap: "구조 자체 미합의" },
  { label: "인사 운영", unionDemand: "채용·승진 등 인사 운영 참여", companyOffer: "경영권 영역으로 수용 불가 입장", gap: "원칙적 입장 차" },
];

export const OFFER_BAR_ROWS = [
  { label: "임금 인상률", demandValue: 14.3, offerValue: 6.2, demandText: "14.3%", offerText: "6.2%", maxScale: 14.3 },
  { label: "일시금·격려금 (만원)", demandValue: 3000, offerValue: 600, demandText: "3,000만원", offerText: "600만원", maxScale: 3000 },
];

export interface UnionDemandFact {
  label: string;
  value: string;
  sourceName: string;
  sourceUrl: string;
}

export const UNION_DEMAND_FACTS: UnionDemandFact[] = [
  {
    label: "임금 인상",
    value: "기본급 14.3% 인상 요구 (평균 14% 보도)",
    sourceName: "머니투데이",
    sourceUrl: "https://www.mt.co.kr/society/2026/05/01/2026050109014984094",
  },
  {
    label: "격려금",
    value: "1인당 3,000만원 타결금 요구",
    sourceName: "뉴시스",
    sourceUrl: "https://www.newsis.com/view/NISX20260609_0003661994",
  },
  {
    label: "성과급",
    value: "영업이익의 20% 배분 요구",
    sourceName: "뉴시스",
    sourceUrl: "https://www.newsis.com/view/NISX20260609_0003661994",
  },
  {
    label: "인사 참여",
    value: "채용·승진 등 인사 운영 참여 요구 → 이후 인사권 참여는 포기하고 수정안 협의로 전환",
    sourceName: "다음뉴스",
    sourceUrl: "https://v.daum.net/v/70IXKxx2Co",
  },
  {
    label: "파업",
    value: "창사 첫 전면파업 2026.5.1~5(5일간), 조합원 약 4,000명 중 2,500명 참여",
    sourceName: "아시아경제",
    sourceUrl: "https://www.asiae.co.kr/article/2026050119200122079",
  },
  {
    label: "예상 손실",
    value: "파업으로 인한 생산 차질 손실 약 6,400억원 추산",
    sourceName: "머니투데이",
    sourceUrl: "https://www.mt.co.kr/society/2026/05/01/2026050109014984094",
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const SBU_FAQ: FaqItem[] = [
  {
    question: "삼성바이오로직스가 왜 창사 첫 파업을 했나요?",
    answer:
      "2026년 임금협상에서 노조는 기본급 14.3% 인상, 1인당 3,000만원 격려금, 영업이익 20% 성과급 배분 등을 요구했으나 회사와 접점을 찾지 못해 2026년 5월 1일부터 5일간 창사 15년 만의 첫 전면파업에 들어갔습니다.",
  },
  {
    question: "노조 요구안과 회사 제시안의 차이는 얼마나 큰가요?",
    answer:
      "임금 인상률은 노조 14.3% vs 회사 6.2%로 약 2.3배, 격려금은 노조 3,000만원 vs 회사 600만원으로 5배 차이가 있습니다.",
  },
  {
    question: "영업이익 20%면 정확히 얼마인가요?",
    answer:
      "2025년 영업이익을 2조 692억원으로 볼 때 20%는 약 4,138억원입니다. 다만 이는 노조 요구안일 뿐 실제 합의된 금액이 아닙니다.",
  },
  {
    question: "1인당 환산액은 어떻게 계산하나요?",
    answer:
      "총 재원(영업이익 × 20%)을 직원 수로 나눈 단순 평균입니다. 실제 개인별 배분 방식과는 무관한 추정치이며, 조합원 기준(약 4,000명)과 전체 임직원 기준(약 5,360명) 중 선택해 비교할 수 있습니다.",
  },
  {
    question: "회사는 왜 노조 요구를 받아들이기 어렵다고 하나요?",
    answer:
      "회사는 노조안을 그대로 적용하면 신입사원 기준 실질 인상률이 21.3%에 달해 지급 여력과 향후 투자 재원 확보에 부담이 크다는 입장입니다.",
  },
  {
    question: "인사권 참여 요구는 무엇인가요?",
    answer:
      "노조는 채용·승진 등 인사 운영에 참여할 권리를 요구했으나, 이후 인사권 참여 요구를 포기하고 수정안을 협의하는 쪽으로 입장을 조정했습니다.",
  },
  {
    question: "파업으로 인한 손실은 얼마나 되나요?",
    answer:
      "회사는 5일간 전면파업이 진행될 경우 생산 설비 가동 차질로 약 6,400억원의 손실이 발생할 것으로 추산했습니다.",
  },
  {
    question: "협상은 지금 어떻게 진행되고 있나요?",
    answer:
      "정부 중재가 종료된 후 노사가 자체적으로 협상을 이어가고 있으며, 삼성그룹 초기업노조 탈퇴 여부에 대한 투표도 진행되는 등 상황이 유동적입니다. 최종 합의 시 이 페이지도 업데이트할 예정입니다.",
  },
];

export const SEO_CRITERIA: string[] = [
  "총 성과급 재원 = 2025년 영업이익(2조 692억원) × 20% (노조 요구 비율)",
  "1인당 환산액 = 총 성과급 재원 ÷ 선택한 직원 수 기준",
  "직원 수 기준은 노조 조합원 수(약 4,000명)와 전체 임직원 추정치(약 5,360명) 중 선택 가능",
  "격려금 포함 1인당 수령액 = 1인당 환산 성과급 + 격려금 요구액(3,000만원) 단순 합산",
  "모든 결과는 단순 평균이며 실제 개인별 배분 방식과는 무관한 추정치",
];

export interface RelatedLink {
  href: string;
  label: string;
}

export const RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/hyundai-motor-union-bonus-2026/", label: "현대차 성과급 30% 요구 계산" },
  { href: "/reports/kakao-union-bonus-2026/", label: "카카오 성과급 갈등 2026" },
  { href: "/tools/bonus-after-tax-calculator/", label: "성과급 세금 계산기" },
  { href: "/reports/corporate-bonus-comparison-2026/", label: "대기업 성과급 완전 비교" },
  { href: "/reports/corporate-bonus-ranking-top10-2026/", label: "대기업 성과급 순위 TOP 10" },
];

export function formatSbuWon(amount: number): string {
  if (amount >= 1_000_000_000_000) {
    const jo = amount / 1_000_000_000_000;
    const eok = Math.round((amount % 1_000_000_000_000) / 100_000_000);
    return eok > 0 ? `${Math.floor(jo)}조 ${eok.toLocaleString()}억원` : `${Math.floor(jo)}조원`;
  }
  if (amount >= 100_000_000) {
    const eok = amount / 100_000_000;
    const eokText = eok % 1 === 0 ? eok.toLocaleString() : eok.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    return `${eokText}억원`;
  }
  if (amount >= 10_000) {
    return `${Math.round(amount / 10_000).toLocaleString()}만원`;
  }
  return `${amount.toLocaleString()}원`;
}

export interface MatrixRow {
  employeeBasisId: string;
  employeeShortLabel: string;
  totalFund: number;
  perHead: number;
  perHeadWithEncouragement: number;
}

export const MATRIX_ROWS: MatrixRow[] = EMPLOYEE_BASES.map((employee) => {
  const totalFund = PROFIT_BASIS.operatingProfit * DEMAND_RATE;
  const perHead = totalFund / employee.employeeCount;
  return {
    employeeBasisId: employee.id,
    employeeShortLabel: employee.shortLabel,
    totalFund,
    perHead,
    perHeadWithEncouragement: perHead + ENCOURAGEMENT_PER_HEAD,
  };
});

export const SBU_META = {
  slug: "samsung-biologics-union-bonus-2026",
  title: "삼성바이오로직스 성과급 20% 요구, 1인당 얼마?",
  seoTitle: "삼성바이오로직스 성과급 20% 요구 2026 | 1인당 환산액 계산",
  description:
    "삼성바이오로직스 노조의 영업이익 20% 성과급, 1인당 3,000만원 격려금 요구를 직접 계산. 회사 제시안과 격차도 한눈에 비교합니다.",
  updatedAt: "2026-06-26",
};
