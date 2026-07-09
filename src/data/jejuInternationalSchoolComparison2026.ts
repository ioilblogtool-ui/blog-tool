import { IST_SCHOOLS, IST_META, type InternationalSchoolProfile } from "./internationalSchoolTuitionCalculator2026";

export type FaqItem = { question: string; answer: string };
export type RelatedLink = { href: string; label: string };
export type RankingRow = { school: InternationalSchoolProfile; representativeAnnualKrw: number; rank: number };

export const JIS_META = {
  slug: "jeju-international-school-comparison-2026",
  title: "제주 국제학교 4곳, 뭐가 다를까",
  seoTitle: "제주 국제학교 2026 순위 | NLCS·BHA·SJA·KIS 학비 비교",
  seoDescription:
    "제주 4개 국제학교의 학비, 입학조건, 통학·기숙 여부, 커리큘럼을 한 번에 비교합니다. 제주 이주 전 확인할 것 포함.",
  description: "NLCS Jeju, Branksome Hall Asia, KIS Jeju, SJA Jeju 4개교의 학비·기숙 여부·커리큘럼을 비교합니다.",
  updatedAt: "2026-07-08",
  legalBasisNote:
    "제주 국제학교는 「경제자유구역 및 제주국제자유도시의 외국교육기관 설립·운영에 관한 특별법」에 근거해 설립되어 내국인 입학 비율·거주 요건 제한이 없습니다. 이는 서울·경기 외국인학교(내국인 정원 30%, 해외 거주 3년 이상 요건)와 가장 큰 차이입니다.",
};

// 제주 4개교만 필터링해 재사용 — 새 데이터 정의 금지
export const JIS_SCHOOLS: InternationalSchoolProfile[] = IST_SCHOOLS.filter((s) => s.region === "jeju");

// 대표 학년(첫 번째 tier) 기준, 계산기 기본 환율로 계산한 연간 학비 랭킹 — 저렴한 순
export const JIS_RANKING: RankingRow[] = [...JIS_SCHOOLS]
  .map((school) => {
    const tier = school.tuitionTiers[0];
    const representativeAnnualKrw = Math.round(tier.krwPortion + tier.usdPortion * IST_META.defaultExchangeRate);
    return { school, representativeAnnualKrw };
  })
  .sort((a, b) => a.representativeAnnualKrw - b.representativeAnnualKrw)
  .map((row, i) => ({ ...row, rank: i + 1 }));

// 학교별 추천 유형 — 커리큘럼·학교 성격 기반 간단 코멘트
export const JIS_RECOMMEND_FOR: Record<string, string> = {
  "nlcs-jeju": "영국식 커리큘럼과 명문대 진학을 지향하는 가정",
  "branksome-hall-asia": "IB 커리큘럼과 기숙형 교육을 선호하는 가정",
  "kis-jeju": "미국식 커리큘럼 기반의 균형 잡힌 교육을 원하는 가정",
  "sja-jeju": "비교적 신설 학교의 미국 사립학교식 교육을 원하는 가정",
};

export type CurriculumRow = {
  schoolId: string;
  curriculum: string;
  foundedYear: string;
  gradeRange: string;
  admissionFeature: string;
};

// 학비 외 커리큘럼·설립연도·학년범위는 이 리포트 전용 — 구현 전 각 학교 About 페이지에서 재확인 필요
export const JIS_CURRICULUM_ROWS: CurriculumRow[] = [
  {
    schoolId: "nlcs-jeju",
    curriculum: "영국식 (GCSE, A-Level)",
    foundedYear: "확인 필요",
    gradeRange: "만 3세~고3 (Year 13)",
    admissionFeature: "런던 NLCS 본교와 커리큘럼 연계",
  },
  {
    schoolId: "branksome-hall-asia",
    curriculum: "IB (International Baccalaureate)",
    foundedYear: "확인 필요",
    gradeRange: "JK~고3 (Grade 12)",
    admissionFeature: "캐나다 토론토 Branksome Hall 본교와 자매결연",
  },
  {
    schoolId: "kis-jeju",
    curriculum: "미국식 (AP)",
    foundedYear: "확인 필요",
    gradeRange: "유치~고3 (Grade 12)",
    admissionFeature: "국내 최초 제주 국제학교 중 하나, 미국 대학 진학 실적 강조",
  },
  {
    schoolId: "sja-jeju",
    curriculum: "미국식 (AP)",
    foundedYear: "확인 필요",
    gradeRange: "유치~중등 확인 (고등 학년 운영 여부 확인 필요)",
    admissionFeature: "미국 버몬트주 St. Johnsbury Academy 본교와 연계",
  },
];

export const JIS_FAQ: FaqItem[] = [
  {
    question: "제주 국제학교는 왜 내국인이 자유롭게 입학할 수 있나요?",
    answer:
      "제주 국제학교는 「경제자유구역 및 제주국제자유도시의 외국교육기관 설립·운영에 관한 특별법」에 근거해 설립되어, 서울·경기의 일반 외국인학교와 달리 내국인 입학 비율이나 해외 거주 요건에 제한이 없습니다. 정원 전체를 한국 국적 학생으로 채우는 것도 가능합니다.",
  },
  {
    question: "제주 4개교 중 학비가 가장 저렴한 곳은 어디인가요?",
    answer:
      "통학 기준으로는 SJA Jeju의 유치~초등 구간(원화 2,413만원+달러 8,990) 학비가 상대적으로 낮은 편입니다. 다만 기숙사 이용 여부, 학년, 환율에 따라 순위가 바뀔 수 있어 학비 계산기로 직접 비교하는 것이 정확합니다.",
  },
  {
    question: "통학과 기숙 중 어느 쪽이 총비용이 더 낮나요?",
    answer:
      "학비만 보면 통학이 저렴하지만, 제주에 거주지가 없다면 별도 주거비·생활비가 추가됩니다. 기숙사를 이용하면 학비에 기숙사비가 추가되는 대신 별도 주거비 부담이 없어, 가족의 제주 이주 여부에 따라 유불리가 달라집니다.",
  },
  {
    question: "제주 4개교의 커리큘럼 차이는 무엇인가요?",
    answer:
      "NLCS Jeju는 영국식(GCSE·A-Level), Branksome Hall Asia는 IB, KIS Jeju와 SJA Jeju는 미국식(AP) 커리큘럼을 따릅니다. 진학을 원하는 국가·대학에 따라 유리한 커리큘럼이 다를 수 있습니다.",
  },
  {
    question: "제주 국제학교에 다니려면 꼭 제주로 이사해야 하나요?",
    answer:
      "기숙사를 이용하면 반드시 이주할 필요는 없지만, 통학을 원한다면 학교 인근(제주 영어교육도시 등)에 거주해야 합니다. 이 경우 학비 외에 제주 지역 주거비도 함께 고려해야 합니다.",
  },
];

// 클러스터의 나머지 리포트(허브)가 구현되는 대로 이 배열에 추가한다.
// 아직 없는 페이지를 링크하면 404가 나므로, 지금 시점에 실제로 존재하는 페이지만 포함한다.
export const JIS_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/international-school-overview-2026/", label: "국내 국제학교 총정리" },
  { href: "/tools/international-school-tuition-calculator-2026/", label: "국제학교 학비 계산기" },
  { href: "/reports/seoul-international-school-comparison-2026/", label: "서울·경기 국제학교 비교" },
  { href: "/reports/international-school-vs-foreign-school-2026/", label: "국제학교 vs 외국인학교 차이" },
];
