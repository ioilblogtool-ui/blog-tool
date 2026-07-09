import { IST_SCHOOLS, IST_META } from "./internationalSchoolTuitionCalculator2026";
import { CUMULATIVE_COST_ROWS, EKC_META } from "./englishKindergartenVsRegularCost2026";

export type FaqItem = { question: string; answer: string };
export type RelatedLink = { href: string; label: string };

export const ISK_META = {
  slug: "international-school-vs-kindergarten-2026",
  title: "영어유치원 3년 vs 국제학교, 뭐가 남을까",
  seoTitle: "국제학교 vs 영어유치원 2026 | 비용·효과 한눈에 비교",
  seoDescription:
    "영어유치원 3년 비용과 국제학교 초등 진학 비용을 비교합니다. 어느 쪽이 우리 가정에 맞는지 확인하세요.",
  description: "영어유치원 3년 누적 비용과 국제학교 초등 1년 학비를 나란히 비교해 다음 선택을 돕습니다.",
  updatedAt: "2026-07-08",
  dataSourceNote: `영어유치원 비용은 기존 「${EKC_META.title}」 리포트 데이터(${EKC_META.updatedAt} 기준)를 그대로 인용했습니다. 국제학교 학비는 이 클러스터의 학비 계산기 데이터(2026-07-08 확인)를 인용했습니다.`,
};

// 영어유치원 3년 누적 비용 — 기존 리포트 데이터 그대로 인용 (재계산·재조사 금지)
export const ISK_KINDERGARTEN_ROWS = CUMULATIVE_COST_ROWS;

// 국제학교 쪽 비교값 — IST_SCHOOLS에서 초등 진학 시점 학비만 추출
export const ISK_SCHOOL_ENTRY_ROWS = IST_SCHOOLS.map((school) => {
  const elementaryTier =
    school.tuitionTiers.find(
      (t) =>
        t.tierKey.includes("elementary") ||
        t.tierKey.includes("village") ||
        t.tierKey === "y1_6" ||
        t.tierKey === "all_grades"
    ) ?? school.tuitionTiers[0];
  return {
    schoolName: school.name,
    region: school.regionLabel,
    tierLabel: elementaryTier.tierLabel,
    krwPortion: elementaryTier.krwPortion,
    usdPortion: elementaryTier.usdPortion,
  };
});

export type LadderRow = { label: string; annualKrw: number; group: "kinder" | "school" };

// 연간 비용 사다리 — 영어유치원 4등급(연 환산) + 국제학교 7개교(대표 학년, 기본 환율) 한눈에 비교
export const ISK_COST_LADDER: LadderRow[] = [
  ...ISK_KINDERGARTEN_ROWS.map((row) => ({
    label: row.option,
    annualKrw: row.monthlyNetFee * 12,
    group: "kinder" as const,
  })),
  ...IST_SCHOOLS.map((school) => {
    const tier = school.tuitionTiers[0];
    return {
      label: school.name,
      annualKrw: Math.round(tier.krwPortion + tier.usdPortion * IST_META.defaultExchangeRate),
      group: "school" as const,
    };
  }),
].sort((a, b) => a.annualKrw - b.annualKrw);

export const ISK_FAQ: FaqItem[] = [
  {
    question: "영어유치원 3년과 국제학교 초등 1년 중 어느 쪽이 더 비싼가요?",
    answer:
      "영어유치원 프리미엄형 3년 누적 비용(약 8,460만원)은 국제학교 초등 1년 학비보다 높은 경우가 많습니다. 다만 국제학교는 초등 이후로도 계속 학비가 발생하므로, 단년도 비교가 아니라 장기 누적 비교가 필요합니다.",
  },
  {
    question: "영어유치원을 보내면 국제학교 입학에 유리한가요?",
    answer:
      "영어 노출 경험이 국제학교 적응에 도움이 될 수는 있지만, 입학 자격(내국인 정원 제한, 해외 거주 요건 등)과는 무관합니다. 영어유치원 이력이 입학 심사에 가산점으로 작용한다는 공식 근거는 없습니다.",
  },
  {
    question: "국제학교 대신 영어유치원 + 사교육을 계속하는 게 나을까요?",
    answer:
      "가정마다 다릅니다. 영어유치원은 유아기에 한정되지만 국제학교는 초·중·고 전체 학비가 매년 발생합니다. 장기 누적 비용과 진학 목표(국내 대학 vs 해외 대학)를 함께 고려해 결정하는 것이 좋습니다.",
  },
  {
    question: "이 비교의 영어유치원 비용은 어디서 가져온 데이터인가요?",
    answer:
      "이 사이트의 기존 영어유치원 vs 일반유치원 비교 리포트 데이터를 그대로 인용했습니다. 더 상세한 등급별·지역별 비교는 해당 리포트에서 확인할 수 있습니다.",
  },
  {
    question: "국제학교 학비도 매년 오르나요?",
    answer:
      "네. 대부분의 국제학교는 매년 학비를 개정하며, 이 페이지의 국제학교 학비는 2026-07-08 확인 기준입니다. 실제 지원 전에는 학교 공식 입학처에서 최신 학비를 재확인하세요.",
  },
];

export const ISK_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/english-kindergarten-vs-regular-kindergarten-cost-2026/", label: "영어유치원 vs 일반유치원 비용 비교" },
  { href: "/reports/international-school-overview-2026/", label: "국내 국제학교 총정리" },
  { href: "/tools/international-school-tuition-calculator-2026/", label: "국제학교 학비 계산기" },
  { href: "/reports/jeju-international-school-comparison-2026/", label: "제주 국제학교 4곳 비교" },
  { href: "/tools/child-tutoring-cost-calculator/", label: "자녀 사교육비 계산기" },
];
