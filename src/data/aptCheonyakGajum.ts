export interface CyGInput {
  homelessYears: number;
  dependentsCount: number;
  subscriptionYears: number;
  isHouseholder: boolean;
}

export interface CyGResult {
  totalScore: number;
  homelessScore: number;
  dependentsScore: number;
  subscriptionScore: number;
  scoreLevel: "low" | "mid" | "high" | "top";
  regionLevel: CyGRegionLevel;
  strategyMessages: string[];
}

export interface CyGRegionLevel {
  seoul: string;
  metro: string;
  local: string;
}

export interface CyGRegionRefLine {
  id: string;
  label: string;
  minScore: number;
  maxScore: number;
  note: string;
}

export interface CyGFaqItem {
  question: string;
  answer: string;
}

export interface CyGRelatedLink {
  href: string;
  label: string;
}

export interface CyGNextContent {
  eyebrow: string;
  title: string;
  desc: string;
  href: string;
  cta: string;
  badges: string[];
  sub: {
    href: string;
    title: string;
    desc: string;
    badges: string[];
  }[];
}

export const CYG_PAGE_META = {
  title: "청약 가점 계산기 2026 | 84점 기준 내 점수 + 지역 참고선 확인 | 비교계산소",
  description:
    "무주택기간, 부양가족 수, 청약통장 가입기간을 입력하면 청약 가점을 즉시 계산해드립니다. 항목별 점수와 서울·수도권·지방 참고 당첨선 비교까지 한 번에 확인하세요.",
  eyebrow: "청약 가점 계산",
  heroTitle: "아파트 청약 가점 계산기",
  heroDescription:
    "무주택기간, 부양가족 수, 청약통장 가입기간만 입력하면 총 84점 기준 청약 가점과 서울·수도권·지방 참고 당첨선을 바로 확인할 수 있습니다.",
};

export const CYG_DEFAULT_INPUT: CyGInput = {
  homelessYears: 5,
  dependentsCount: 2,
  subscriptionYears: 5,
  isHouseholder: true,
};

export const CYG_REGION_REF_LINES: CyGRegionRefLine[] = [
  {
    id: "seoul-popular",
    label: "서울 인기 단지",
    minScore: 60,
    maxScore: 84,
    note: "강남·마포·용산 등 핵심 입지, 경쟁이 매우 높음",
  },
  {
    id: "seoul-standard",
    label: "서울 일반 단지",
    minScore: 50,
    maxScore: 65,
    note: "서울 외곽·비인기 타입 포함, 분양 조건에 따라 상이",
  },
  {
    id: "metro",
    label: "수도권 (경기·인천)",
    minScore: 40,
    maxScore: 55,
    note: "택지지구·신도시 포함, 단지별 편차 큼",
  },
  {
    id: "local",
    label: "지방 광역시",
    minScore: 25,
    maxScore: 45,
    note: "대전·대구·부산 등, 일부 단지는 더 낮을 수 있음",
  },
];

export const CYG_FAQ: CyGFaqItem[] = [
  {
    question: "청약 가점은 몇 점 만점인가요?",
    answer:
      "민영주택 일반공급 가점제 기준 총점은 84점이며, 무주택기간 32점·부양가족수 35점·청약통장 가입기간 17점으로 구성됩니다.",
  },
  {
    question: "부양가족은 누구까지 인정되나요?",
    answer:
      "배우자, 직계존속(부모·조부모 등), 직계비속(자녀 등)이 대표적입니다. 단, 동일 세대 구성·주민등록 동거 기간·실제 부양 사실이 요건이 되므로 모집공고문과 등본을 반드시 확인해야 합니다.",
  },
  {
    question: "내 점수로 당첨 가능한 지역을 알 수 있나요?",
    answer:
      "참고 수준으로만 확인할 수 있습니다. 실제 당첨선은 단지, 공급유형, 지역 수요, 경쟁률에 따라 크게 달라집니다. 이 계산기의 지역 참고선은 최근 주요 분양 사례를 기준으로 한 참고값입니다.",
  },
  {
    question: "세대주가 아니면 청약 가점이 낮아지나요?",
    answer:
      "청약 가점 점수 자체는 세대주 여부와 무관하지만, 공급유형에 따라 세대주 요건이 별도로 붙는 경우가 있습니다. 모집공고문의 청약 자격 조건을 먼저 확인하세요.",
  },
];

export const CYG_RELATED_LINKS: CyGRelatedLink[] = [
  { href: "/tools/jeonwolse-conversion/", label: "전월세 전환율 계산기" },
  { href: "/tools/home-purchase-fund/", label: "내집마련 자금 계산기" },
  { href: "/reports/seoul-apartment-jeonse-report/", label: "서울 아파트 전월세 비율 리포트" },
];

export const CYG_NEXT_CONTENT: CyGNextContent = {
  eyebrow: "이어보기",
  title: "전월세 전환율 계산기",
  desc: "청약 전에 지금 살고 있는 전세·월세 조건이 합리적인지도 같이 확인해보세요.",
  href: "/tools/jeonwolse-conversion/",
  cta: "전월세 전환율 계산하기",
  badges: ["부동산", "전세·월세"],
  sub: [
    {
      href: "/tools/home-purchase-fund/",
      title: "내집마련 자금 계산기",
      desc: "LTV 기반 대출 가능액과 총 필요 현금을 계산합니다.",
      badges: ["부동산", "대출"],
    },
    {
      href: "/reports/seoul-apartment-jeonse-report/",
      title: "서울 아파트 전월세 비율 리포트",
      desc: "서울 구별 전세·월세 비율과 최근 추이를 확인합니다.",
      badges: ["리포트", "부동산"],
    },
  ],
};
