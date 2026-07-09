import { IST_SCHOOLS, IST_META, type InternationalSchoolProfile } from "./internationalSchoolTuitionCalculator2026";

export type FaqItem = { question: string; answer: string };
export type RelatedLink = { href: string; label: string };
export type ExpansionCandidate = { name: string; area: string; note: string };
export type RankingRow = { school: InternationalSchoolProfile; representativeAnnualKrw: number; rank: number };

export const SISC_META = {
  slug: "seoul-international-school-comparison-2026",
  title: "서울·경기·송도 국제학교, 뭐가 다를까",
  seoTitle: "서울·경기 국제학교 2026 비교 | SFS·Dulwich·채드윅 학비 정리",
  seoDescription:
    "서울·송도 국제학교의 학비와 입학조건을 비교합니다. Chadwick·SFS·Dulwich 등 대표 학교 포함, 외국인학교 내국인 정원 제한도 함께 정리했습니다.",
  description: "Chadwick International(송도), Seoul Foreign School, Dulwich College Seoul 3개교의 학비와 입학조건을 비교합니다.",
  updatedAt: "2026-07-08",
  admissionNote:
    "이 3개교는 모두 「외국인학교 및 외국인유치원 설립·운영에 관한 규정」에 따른 외국인학교로, 내국인 입학 정원이 30%(교육감 재량 시 50%)로 제한됩니다. 내국인 지원자는 해외 거주 3년 이상 + 학교장 판단(한국어 능력·문화 적응 우려) 요건도 충족해야 합니다.",
};

// 서울·경기·송도 3개교만 필터링해 재사용 — 새 데이터 정의 금지
export const SISC_SCHOOLS: InternationalSchoolProfile[] = IST_SCHOOLS.filter((s) => s.region === "seoul_songdo");

// 대표 학년(첫 번째 tier) 기준, 계산기 기본 환율로 계산한 연간 학비 랭킹 — 저렴한 순
export const SISC_RANKING: RankingRow[] = [...SISC_SCHOOLS]
  .map((school) => {
    const tier = school.tuitionTiers[0];
    const representativeAnnualKrw = Math.round(tier.krwPortion + tier.usdPortion * IST_META.defaultExchangeRate);
    return { school, representativeAnnualKrw };
  })
  .sort((a, b) => a.representativeAnnualKrw - b.representativeAnnualKrw)
  .map((row, i) => ({ ...row, rank: i + 1 }));

// 학교별 추천 유형 — 학교 성격 기반 간단 코멘트
export const SISC_RECOMMEND_FOR: Record<string, string> = {
  "chadwick-songdo": "송도 거주 예정이거나 미국식 대형 캠퍼스를 선호하는 가정",
  "sfs-seoul": "서울 도심 접근성과 오랜 역사의 커뮤니티를 중시하는 가정",
  "dulwich-seoul": "영국식 커리큘럼과 원화 고정 학비의 예측 가능성을 원하는 가정",
};

// 아직 데이터가 없는 확장 후보 — 학비를 추정해서 채우지 않고 이름만 안내
export const SISC_EXPANSION_CANDIDATES: ExpansionCandidate[] = [
  { name: "Dwight School Seoul", area: "서울 강남", note: "추후 학비 데이터 추가 예정" },
  { name: "YISS (Yongsan International School of Seoul)", area: "서울 한남", note: "추후 학비 데이터 추가 예정" },
  { name: "KIS Pangyo", area: "경기 판교", note: "추후 학비 데이터 추가 예정" },
];

export const SISC_FAQ: FaqItem[] = [
  {
    question: "서울권 국제학교는 아무나 지원할 수 있나요?",
    answer:
      "이 3개교는 모두 외국인학교로 분류되어 내국인 정원이 30%(교육감 재량 시 50%)로 제한됩니다. 내국인 지원자는 해외 거주 3년 이상 등 별도 요건을 충족해야 합니다. 제주 국제학교와 달리 정원 제한이 있다는 점이 가장 큰 차이입니다.",
  },
  {
    question: "서울권 3개교 중 학비가 가장 낮은 곳은?",
    answer:
      "초등 기준으로는 Seoul Foreign School(원화 1,750만원+달러 7,000)이 상대적으로 낮은 편입니다. 다만 중등 데이터가 아직 확인되지 않아 학년에 따라 순위가 달라질 수 있습니다.",
  },
  {
    question: "Dulwich College Seoul은 왜 학비가 전부 원화인가요?",
    answer:
      "이 클러스터의 7개교 중 Dulwich만 학비를 전액 원화로 청구합니다. 나머지 학교는 원화와 달러를 혼합해 청구하므로, Dulwich는 환율 변동의 영향을 받지 않는다는 차이가 있습니다.",
  },
  {
    question: "채드윅 송도는 왜 다른 두 학교보다 학비가 높나요?",
    answer:
      "Chadwick International은 Village School부터 Upper School까지 원화·달러 혼합 학비가 다른 두 학교보다 높게 책정되어 있습니다. 다만 2026/27학년도 확정 요율은 2026년 1월 공개 예정이라 최신 수치는 재확인이 필요합니다.",
  },
  {
    question: "이 페이지에 없는 서울권 학교도 있나요?",
    answer:
      "네. Dwight School Seoul, YISS, KIS Pangyo 등은 검색 수요를 확인한 뒤 추후 추가할 예정입니다.",
  },
];

export const SISC_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/international-school-overview-2026/", label: "국내 국제학교 총정리" },
  { href: "/tools/international-school-tuition-calculator-2026/", label: "국제학교 학비 계산기" },
  { href: "/reports/jeju-international-school-comparison-2026/", label: "제주 국제학교 4곳 비교" },
  { href: "/reports/international-school-vs-foreign-school-2026/", label: "국제학교 vs 외국인학교 차이" },
];
