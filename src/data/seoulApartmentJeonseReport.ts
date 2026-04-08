export type HousingMode = "jeonse" | "semiJeonse" | "wolse";
export type BudgetMode = "deposit" | "monthlyTotal";
export type DistrictKey = "gangseo" | "gangdong" | "gangbuk";

export interface SeoulApartmentJeonseMeta {
  slug: string;
  title: string;
  subtitle: string;
  methodology: string;
  caution: string;
  updatedAt: string;
}

export interface SeoulApartmentJeonseKpi {
  label: string;
  value: string;
  sub: string;
  tone?: "neutral" | "warn" | "accent";
}

export interface SeoulApartmentJeonseMarketPoint {
  year: number;
  jeonseEok: number;
  saleEok: number;
  jeonseShare: number;
  rentDepositEok: number;
  rentMonthlyManwon: number;
  semiJeonseDepositEok: number;
  semiJeonseMonthlyManwon: number;
  policyRate: number;
  estimatedJeonseLoanRate: number;
  loanInterest80Manwon: number;
}

export interface SeoulApartmentJeonseDistrictCard {
  key: DistrictKey;
  name: string;
  tagline: string;
  commuteFit: string;
  summary: string;
  thenVsNow: string;
  compromise: string[];
}

export interface SeoulApartmentJeonseConditionRow {
  label: string;
  before: string;
  now: string;
  impact: string;
}

export interface SeoulApartmentJeonseCauseCard {
  title: string;
  description: string;
}

export interface SeoulApartmentJeonseBehaviorShiftCard {
  title: string;
  summary: string;
}

export interface SeoulApartmentJeonseBudgetScenario {
  budgetMin: number;
  budgetMax: number;
  depositGuide: string;
  jeonseResult: string;
  semiJeonseResult: string;
  wolseResult: string;
  recommendedCta: string;
}

export interface SeoulApartmentJeonseFaqItem {
  q: string;
  a: string;
}

export interface SeoulApartmentJeonseRelatedLink {
  label: string;
  href: string;
}

export const seoulApartmentJeonseReport = {
  meta: {
    slug: "seoul-apartment-jeonse-report",
    title: "전세 사라지는 서울 아파트 | 신혼부부가 찾던 역세권 전세는 왜 없어졌나",
    subtitle:
      "서울 아파트 전세가 왜 체감상 더 어려워졌는지, 평균 전세가와 전세 비중 변화, 강서·강동·강북 실수요 지역 기준으로 정리한 비교 리포트입니다.",
    methodology:
      "이 리포트는 서울 아파트 전세 시장을 공개 통계와 기사 정리값 기준으로 비교계산소 리포트 형식에 맞게 재구성한 참고용 콘텐츠입니다.",
    caution:
      "서울 평균값, 지역 체감, 개별 매물 가격은 서로 다른 성격의 정보입니다. 금리와 전세대출 항목 중 기준금리는 한국은행 공개값을 참고했고, 전세대출 금리는 시장 환경을 반영한 참고 추정치입니다.",
    updatedAt: "2026년 4월 기준 정리",
  } satisfies SeoulApartmentJeonseMeta,
  heroSummary:
    "서울 아파트 전세는 단순히 비싸진 것을 넘어, 신혼부부가 많이 찾는 역세권·적정 면적·실거주 가능한 조건의 선택지가 함께 줄어든 시장으로 바뀌었습니다. 그래서 지금은 전세만 보던 방식에서 반전세, 월세, 심지어 매매 가능성까지 함께 검토하는 흐름이 강해졌습니다.",
  kpis: [
    { label: "서울 평균 전세가", value: "5.8억", sub: "2016년 3.1억 대비 +87%", tone: "warn" },
    { label: "서울 평균 매매가", value: "11.2억", sub: "전세와 함께 매매 거리도 확대", tone: "warn" },
    { label: "전세 비중", value: "43%", sub: "2016년 61% 대비 -18%p", tone: "accent" },
    { label: "전세대출 참고금리", value: "3.9%", sub: "2026 기준 추정 참고치", tone: "accent" },
    { label: "역세권 전세 체감", value: "희소", sub: "신축·준신축 선호 구간에서 더 강함", tone: "neutral" },
  ] satisfies SeoulApartmentJeonseKpi[],
  marketSeries: [
    { year: 2016, jeonseEok: 3.1, saleEok: 5.2, jeonseShare: 61, rentDepositEok: 0.5, rentMonthlyManwon: 72, semiJeonseDepositEok: 1.9, semiJeonseMonthlyManwon: 43, policyRate: 1.25, estimatedJeonseLoanRate: 2.7, loanInterest80Manwon: 670 },
    { year: 2018, jeonseEok: 3.8, saleEok: 6.7, jeonseShare: 58, rentDepositEok: 0.7, rentMonthlyManwon: 81, semiJeonseDepositEok: 2.3, semiJeonseMonthlyManwon: 49, policyRate: 1.75, estimatedJeonseLoanRate: 3.4, loanInterest80Manwon: 1034 },
    { year: 2020, jeonseEok: 4.9, saleEok: 8.9, jeonseShare: 53, rentDepositEok: 0.95, rentMonthlyManwon: 95, semiJeonseDepositEok: 2.9, semiJeonseMonthlyManwon: 58, policyRate: 0.5, estimatedJeonseLoanRate: 2.4, loanInterest80Manwon: 941 },
    { year: 2022, jeonseEok: 5.6, saleEok: 10.7, jeonseShare: 47, rentDepositEok: 1.15, rentMonthlyManwon: 111, semiJeonseDepositEok: 3.2, semiJeonseMonthlyManwon: 76, policyRate: 3.25, estimatedJeonseLoanRate: 5.2, loanInterest80Manwon: 2330 },
    { year: 2024, jeonseEok: 5.7, saleEok: 10.9, jeonseShare: 45, rentDepositEok: 1.25, rentMonthlyManwon: 118, semiJeonseDepositEok: 3.3, semiJeonseMonthlyManwon: 82, policyRate: 3.0, estimatedJeonseLoanRate: 4.3, loanInterest80Manwon: 1961 },
    { year: 2026, jeonseEok: 5.8, saleEok: 11.2, jeonseShare: 43, rentDepositEok: 1.35, rentMonthlyManwon: 124, semiJeonseDepositEok: 3.4, semiJeonseMonthlyManwon: 88, policyRate: 2.5, estimatedJeonseLoanRate: 3.9, loanInterest80Manwon: 1810 },
  ] satisfies SeoulApartmentJeonseMarketPoint[],
  districtCards: [
    {
      key: "gangseo",
      name: "강서",
      tagline: "서울 서남권 실수요 대안지",
      commuteFit: "마곡·여의도·김포공항 축 출퇴근 수요",
      summary:
        "예전에는 서울 안에서 그나마 예산을 맞추기 쉬운 전세 대안지로 많이 찾았지만, 지금은 역세권·준신축 조건을 붙이면 선택지가 빠르게 줄어드는 체감이 강합니다.",
      thenVsNow: "예전에는 전세 단독 탐색이 가능했지만, 지금은 면적이나 연식을 함께 양보해야 하는 경우가 늘었습니다.",
      compromise: ["역세권 거리", "준공 연식", "전용면적"],
    },
    {
      key: "gangdong",
      name: "강동",
      tagline: "신축 선호가 강한 동남권 외곽 축",
      commuteFit: "잠실·강남 접근성과 신축 선호가 동시에 작동",
      summary:
        "신축 단지 선호가 강하고 서울 동남권 접근성이 있어 실수요가 꾸준하지만, 전세만으로 보기는 점점 어려워지고 반전세까지 같이 보는 흐름이 커졌습니다.",
      thenVsNow: "예전보다 같은 예산에서 신축 전세 접근이 어려워져 구축 또는 반전세 검토가 늘었습니다.",
      compromise: ["신축 여부", "단지 규모", "전세 단독 선택"],
    },
    {
      key: "gangbuk",
      name: "강북",
      tagline: "예산 방어를 기대하고 찾는 북부 생활권",
      commuteFit: "성북·노원·미아권 등 예산 방어형 탐색 수요",
      summary:
        "상대적으로 예산 부담을 낮추려는 수요가 많이 몰리지만, 서울 안에서 전세를 유지하려는 수요가 함께 유입되며 체감 선택지는 생각보다 넓지 않습니다.",
      thenVsNow: "예산은 맞춰도 역세권, 상태, 면적 중 하나는 예전보다 더 크게 양보해야 하는 경우가 많습니다.",
      compromise: ["역세권 체감", "주택 상태", "생활권 우선순위"],
    },
  ] satisfies SeoulApartmentJeonseDistrictCard[],
  conditionRows: [
    { label: "같은 예산 기준", before: "전세 단독 탐색 가능", now: "반전세·월세 병행 필요", impact: "검색 단계부터 선택 구조가 달라짐" },
    { label: "역세권 접근성", before: "핵심 조건 유지 가능", now: "도보 거리 양보 빈도 증가", impact: "출퇴근 체감 비용 상승" },
    { label: "전용면적", before: "실거주 적정 면적 가능", now: "소형 위주 검토 확대", impact: "신혼부부 체감 압박 증가" },
    { label: "준공 연식", before: "준신축까지 탐색 가능", now: "구축 선택 비중 확대", impact: "상태와 비용의 교환 심화" },
    { label: "대안 검토", before: "전세 중심 판단", now: "월세·매매 병행 판단", impact: "의사결정이 복잡해짐" },
  ] satisfies SeoulApartmentJeonseConditionRow[],
  causes: [
    { title: "금리 환경 변화", description: "전세 자금 조달 비용과 임대인의 자금 운용 방식이 바뀌면서 전세 구조 자체의 매력이 줄었습니다." },
    { title: "전세사기 이후 신뢰 저하", description: "보증금 안전성에 대한 불안이 커지며 임차인과 임대인 모두 전세를 보는 방식이 보수적으로 바뀌었습니다." },
    { title: "임대인의 월세 선호 확대", description: "목돈 대신 안정적인 현금 흐름을 택하는 임대인이 늘면서 반전세와 월세 비중이 커졌습니다." },
    { title: "좋은 입지 물량 경쟁 심화", description: "역세권·신축·생활권이 좋은 구간에 수요가 몰리면서 체감상 전세가 더 빨리 사라지는 것처럼 느껴집니다." },
  ] satisfies SeoulApartmentJeonseCauseCard[],
  behaviorShifts: [
    { title: "전세 단독 탐색에서 혼합 탐색으로 이동", summary: "실수요자는 전세만 보지 않고 반전세와 월세까지 같이 열어두는 경우가 많아졌습니다." },
    { title: "입지·면적·연식 중 하나를 양보", summary: "같은 예산 안에서 서울을 유지하려면 예전보다 주거 조건을 더 많이 조정해야 합니다." },
    { title: "일부 수요는 매매 가능성까지 병행 검토", summary: "전세 가격이 높아지며 차라리 매매 가능성을 같이 보자는 판단이 늘었습니다." },
  ] satisfies SeoulApartmentJeonseBehaviorShiftCard[],
  budgetScenarios: [
    {
      budgetMin: 0,
      budgetMax: 20000,
      depositGuide: "보증금 2억 이하 구간",
      jeonseResult: "서울 아파트 전세 단독 선택지는 매우 제한적입니다.",
      semiJeonseResult: "반전세 위주로 검토해야 하며 입지나 면적 양보가 필요합니다.",
      wolseResult: "월세 중심 탐색이 현실적이며 월 고정비 부담 관리가 중요합니다.",
      recommendedCta: "전세 vs 월세 비교 계산기로 월 부담을 먼저 확인해보세요.",
    },
    {
      budgetMin: 20001,
      budgetMax: 40000,
      depositGuide: "보증금 2억~4억 구간",
      jeonseResult: "서울 외곽 또는 구축 위주의 제한적 전세 검토가 가능합니다.",
      semiJeonseResult: "강서·강북권 중심으로 반전세 선택지가 상대적으로 넓습니다.",
      wolseResult: "직주근접을 우선하면 월세 병행 검토가 더 현실적입니다.",
      recommendedCta: "반전세와 월세를 같이 비교해 총 주거비를 보는 편이 좋습니다.",
    },
    {
      budgetMin: 40001,
      budgetMax: 70000,
      depositGuide: "보증금 4억~7억 구간",
      jeonseResult: "서울 내 전세 선택지가 생기지만 역세권·신축은 여전히 경쟁이 강합니다.",
      semiJeonseResult: "조건을 높이고 싶다면 반전세가 더 유연한 대안이 됩니다.",
      wolseResult: "월세를 택하면 입지와 상태를 조금 더 확보할 수 있습니다.",
      recommendedCta: "전세 유지와 월 고정비 중 무엇이 더 유리한지 계산기로 확인해보세요.",
    },
    {
      budgetMin: 70001,
      budgetMax: 999999,
      depositGuide: "보증금 7억 이상 구간",
      jeonseResult: "서울 전세 선택 폭은 넓어지지만 선호 지역 신축은 여전히 가격 장벽이 있습니다.",
      semiJeonseResult: "입지나 상품성을 우선할 때 반전세가 대안이 될 수 있습니다.",
      wolseResult: "월세 선택은 입지와 단지 선호를 높이는 전략으로 작동할 수 있습니다.",
      recommendedCta: "매매 가능성까지 포함해 자금 계획을 같이 보는 편이 좋습니다.",
    },
  ] satisfies SeoulApartmentJeonseBudgetScenario[],
  faq: [
    { q: "왜 서울 전세가 줄어든 것처럼 느껴지나요?", a: "가격 상승만이 아니라 전세 비중 감소, 월세 전환 확대, 선호 입지 경쟁 심화가 동시에 나타나기 때문입니다. 그래서 체감상 찾을 수 있는 전세가 더 빠르게 줄어든 것처럼 느껴집니다." },
    { q: "역세권 전세가 특히 더 어려운 이유는 뭔가요?", a: "출퇴근 편의, 생활 인프라, 신축 선호가 겹치는 구간에는 수요가 집중됩니다. 서울 전세 선택지가 줄어들수록 이런 지역은 체감상 가장 먼저 부족해집니다." },
    { q: "전세 대신 반전세를 봐야 하는 기준은 뭔가요?", a: "보증금을 더 올리기 어렵지만 서울 안에서 입지나 상태를 유지하고 싶다면 반전세를 같이 보는 편이 현실적입니다. 다만 월 고정비가 생기므로 총 주거비 비교가 필요합니다." },
    { q: "서울 외곽으로 가면 해결되나요?", a: "일부 예산 구간에서는 선택지가 넓어질 수 있지만, 역세권 접근성이나 면적, 연식 중 하나를 양보하게 되는 경우가 많습니다. 완전한 해결보다는 조건 재조정에 가깝습니다." },
    { q: "지금은 전세보다 매매를 같이 봐야 하나요?", a: "전세 가격 자체가 높아진 구간에서는 일부 수요가 매매 가능성을 병행 검토하는 것이 자연스럽습니다. 다만 대출 여력, 보유 현금, 거주 기간을 함께 봐야 합니다." },
  ] satisfies SeoulApartmentJeonseFaqItem[],
  relatedLinks: [
    { label: "서울 집값 2016 vs 2026 리포트", href: "/reports/seoul-housing-2016-vs-2026/" },
    { label: "가구 소득 계산기", href: "/tools/household-income/" },
    { label: "주택 구매 자금 계산기", href: "/tools/home-purchase-fund/" },
  ] satisfies SeoulApartmentJeonseRelatedLink[],
} as const;

export function findBudgetScenario(budgetValue: number) {
  return (
    seoulApartmentJeonseReport.budgetScenarios.find(
      (scenario) => budgetValue >= scenario.budgetMin && budgetValue <= scenario.budgetMax,
    ) ?? seoulApartmentJeonseReport.budgetScenarios[0]
  );
}

