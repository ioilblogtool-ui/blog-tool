export type JWCMode = "jeonseToWolse" | "wolseToJeonse" | "compare";

export interface JWCRules {
  annualCapRate: number;
  baseRate: number;
  plusSpreadRate: number;
  legalCapRate: number;
  baseRateDateLabel: string;
}

export interface JWCDefaultInput {
  mode: JWCMode;
  jeonseDeposit: number;
  wolseDeposit: number;
  monthlyRent: number;
  customRate: number;
  useLegalCap: boolean;
  loanRate: number;
  opportunityRate: number;
  comparisonYears: number;
  movingCost: number;
  brokerFee: number;
  baseRate: number;
}

export interface JWCScenarioPreset {
  id: string;
  label: string;
  summary: string;
  values: Partial<JWCDefaultInput>;
}

export interface JWCFaqItem {
  question: string;
  answer: string;
}

export interface JWCRelatedLink {
  href: string;
  label: string;
}

export const JWC_PAGE_META = {
  title: "전월세 전환율 계산기 2026 | 전세 vs 월세 유불리 바로 계산 | 비교계산소",
  description:
    "전세 보증금과 월세 조건을 같은 기준으로 환산해 실제 전환율, 법정 상한 초과 여부, 전세 환산 보증금, 월세 환산액, 비교 기간 총비용 차이를 한눈에 확인하세요.",
  eyebrow: "부동산 비교 계산",
  heroTitle: "전월세 전환율 계산기",
  heroDescription:
    "전세 보증금과 월세 조건을 같은 기준으로 환산해서 실제 전환율, 법정 상한 초과 여부, 비교 기간 총비용까지 한눈에 확인하세요.",
};

export const JWC_RULES: JWCRules = {
  annualCapRate: 0.1,
  baseRate: 0.025,
  plusSpreadRate: 0.02,
  legalCapRate: 0.045,
  baseRateDateLabel: "2026-04-14 기준 2.50%",
};

export const JWC_DEFAULT_INPUT: JWCDefaultInput = {
  mode: "compare",
  jeonseDeposit: 300_000_000,
  wolseDeposit: 50_000_000,
  monthlyRent: 900_000,
  customRate: 0.045,
  useLegalCap: true,
  loanRate: 0.04,
  opportunityRate: 0.025,
  comparisonYears: 2,
  movingCost: 1_500_000,
  brokerFee: 1_200_000,
  baseRate: JWC_RULES.baseRate,
};

export const JWC_SCENARIO_PRESETS: JWCScenarioPreset[] = [
  {
    id: "renewal-3eok-90",
    label: "전세 3억 vs 보증금 5천/월세 90",
    summary: "재계약 협상에서 가장 많이 묻는 전형적인 전세 일부 월세 전환 예시입니다.",
    values: {
      mode: "compare",
      jeonseDeposit: 300_000_000,
      wolseDeposit: 50_000_000,
      monthlyRent: 900_000,
      comparisonYears: 2,
    },
  },
  {
    id: "renewal-4eok-130",
    label: "전세 4억 vs 보증금 1억/월세 130",
    summary: "목돈은 유지하되 월세 부담이 커지는 상황을 점검할 때 보기 좋습니다.",
    values: {
      mode: "compare",
      jeonseDeposit: 400_000_000,
      wolseDeposit: 100_000_000,
      monthlyRent: 1_300_000,
      comparisonYears: 2,
    },
  },
  {
    id: "starter-low-cash",
    label: "사회초년생 현금흐름 우선",
    summary: "보증금 여력은 낮고 월 현금흐름이 중요한 상황을 가정한 예시입니다.",
    values: {
      mode: "compare",
      jeonseDeposit: 200_000_000,
      wolseDeposit: 30_000_000,
      monthlyRent: 750_000,
      loanRate: 0.045,
      opportunityRate: 0.02,
      comparisonYears: 2,
    },
  },
];

export const JWC_FAQ: JWCFaqItem[] = [
  {
    question: "전월세 전환율은 몇 %가 기준인가요?",
    answer:
      "이 계산기는 주택임대차보호법상 기준을 반영해 연 10%와 기준금리+연 2% 중 더 낮은 값을 법정 상한으로 사용합니다. 2026년 4월 14일 기준금리 2.50%를 넣으면 계산상 상한은 연 4.50%입니다.",
  },
  {
    question: "실제 전환율과 법정 상한이 다르면 어떻게 봐야 하나요?",
    answer:
      "실제 전환율은 현재 제안된 보증금 차이와 월세를 연 환산한 값이고, 법정 상한은 협상 기준선입니다. 실제 전환율이 더 높게 나오면 계약 조건을 다시 점검하거나 법령·공식 상담 창구를 함께 확인하는 편이 안전합니다.",
  },
  {
    question: "전세와 월세 중 어느 쪽이 더 유리한지는 어떻게 판단하나요?",
    answer:
      "이 계산기는 비교 기간 동안의 월세 총액, 전세 보증금의 대출비용, 월세 보증금의 기회비용, 이사비용과 중개수수료까지 합쳐 전세 총비용과 월세 총비용을 나란히 보여줍니다. 총비용과 별개로 월 현금흐름 부담도 함께 읽는 것이 좋습니다.",
  },
  {
    question: "기준금리를 직접 바꿔도 되나요?",
    answer:
      "가능합니다. 화면의 기준금리 입력을 수정하면 법정 상한 계산도 함께 바뀝니다. 다만 실제 계약 판단 전에는 최신 한국은행 기준금리와 법령 변경 여부를 같이 확인하는 편이 안전합니다.",
  },
  {
    question: "이 계산기 결과를 계약 근거로 바로 써도 되나요?",
    answer:
      "아닙니다. 이 페이지는 참고용 계산기이며 실제 계약은 지역, 주택 유형, 갱신 여부, 개별 특약에 따라 달라질 수 있습니다. 중요한 의사결정 전에는 공식 법령과 상담 창구를 함께 확인해야 합니다.",
  },
];

export const JWC_RELATED_LINKS: JWCRelatedLink[] = [
  { href: "/tools/home-purchase-fund/", label: "내집마련 자금 계산기" },
  { href: "/reports/seoul-housing-2016-vs-2026/", label: "서울 주거비 2016 vs 2026 리포트" },
  { href: "/reports/seoul-apartment-jeonse-report/", label: "서울 아파트 전세 리포트" },
  { href: "/tools/national-pension-calculator/", label: "국민연금 예상수령액 계산기" },
];

export const JWC_NEXT_CONTENT = {
  eyebrow: "다음 계산 흐름",
  title: "주거 판단 다음에 같이 보면 좋은 계산기",
  desc: "전월세 비교만으로 의사결정이 끝나지 않는 경우가 많아서, 대출·주거비 흐름까지 이어서 볼 수 있게 묶었습니다.",
  href: "/tools/home-purchase-fund/",
  cta: "내집마련 자금 계산기 보기",
  badges: ["주거 판단", "총비용 비교", "현금흐름"],
  sub: [
    {
      href: "/reports/seoul-apartment-jeonse-report/",
      title: "서울 아파트 전세 리포트",
      desc: "전세 시장 흐름을 같이 보면 현재 제안이 어느 정도 수준인지 감을 잡기 좋습니다.",
      badges: ["부동산 리포트"],
    },
    {
      href: "/reports/seoul-housing-2016-vs-2026/",
      title: "서울 주거비 10년 비교",
      desc: "월세와 전세 부담이 장기적으로 어떻게 바뀌었는지 큰 흐름으로 확인할 수 있습니다.",
      badges: ["장기 비교"],
    },
    {
      href: "/tools/national-pension-calculator/",
      title: "국민연금 예상수령액 계산기",
      desc: "월 고정지출과 장기 현금흐름 계획을 함께 볼 때 연결하기 좋은 도구입니다.",
      badges: ["생활비 계획"],
    },
  ],
};

export const JWC_SOURCE_LINKS = [
  {
    href: "https://www.law.go.kr/법령/주택임대차보호법",
    source: "국가법령정보센터",
    title: "주택임대차보호법",
    desc: "전월세 전환 관련 법령 원문과 최신 개정 여부를 확인할 때 참고할 수 있습니다.",
  },
  {
    href: "https://www.bok.or.kr/portal/main/main.do",
    source: "한국은행",
    title: "한국은행 기준금리",
    desc: "법정 상한 계산에 사용하는 기준금리 최신 값을 확인하는 용도입니다.",
  },
  {
    href: "https://adrhome.reb.or.kr/adrhome/reb/transfer/transferCalculatorForm.do?Key=10404000000002022101900",
    source: "한국부동산원 · LH 임대차분쟁조정위원회",
    title: "전월세전환 계산",
    desc: "공식 계산 화면과 함께 비교해보면 입력 구조와 결과 차이를 점검하기 좋습니다.",
  },
];
