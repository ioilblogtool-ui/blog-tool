import { TUITION_PRESETS, TUITION_TREND_2022_2026 } from "./universityTuition2026";

export { TUITION_PRESETS, TUITION_TREND_2022_2026 };

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export interface TopTuitionSchool {
  name: string;
  annualTuition: number;
  note: string;
}

// 등록금 상위 대학 예시 — 절대 순위 단정 아닌 "예시"로만 제시 (계열 구성이 다른 학교 간 단순 비교 주의)
export const TUITION_TOP_SCHOOLS: TopTuitionSchool[] = [
  { name: "을지대학교", annualTuition: 11_280_400, note: "의학·자연과학 계열 중심이라 상대적으로 높게 산정" },
  { name: "연세대학교", annualTuition: 9_957_800, note: "전 계열 등록금이 모두 공개된 대학 중 최고" },
  { name: "한국에너지공과대학교(KENTECH)", annualTuition: 9_000_000, note: "이공계 특성화 대학 중 최고" },
  { name: "대구경북과학기술원(DGIST)", annualTuition: 7_934_000, note: "이공계 특성화" },
  { name: "한국과학기술원(KAIST)", annualTuition: 6_866_000, note: "이공계 특성화" },
  { name: "울산과학기술원(UNIST)", annualTuition: 6_568_000, note: "이공계 특성화" },
  { name: "포항공과대학교(POSTECH)", annualTuition: 5_613_000, note: "이공계 특성화 중 최저" },
];

export interface OverviewStat {
  label: string;
  value: string;
  note?: string;
}

export const UTR_OVERVIEW_STATS: OverviewStat[] = [
  { label: "4년제 전체 평균", value: "727만원", note: "전년 대비 +2.1%" },
  { label: "사립대 평균", value: "823만원" },
  { label: "국공립대 평균", value: "425만원" },
  { label: "2026학년도 인상 대학", value: "125개교", note: "동결 65개교(34.2%)" },
];

export const UTR_META = {
  slug: "university-tuition-ranking-2026",
  title: "대학 등록금 순위 2026",
  seoTitle: "대학 등록금 순위 2026 | 국공립·사립 등록금 비교",
  seoDescription:
    "2026학년도 설립유형별·계열별 평균 등록금과 등록금 상위 대학 예시, 최근 5년 인상·동결 현황을 한 번에 비교합니다.",
  description: "2026학년도 설립유형별·계열별 평균 등록금과 등록금 상위 대학 예시를 비교하는 리포트입니다.",
  updatedAt: "2026-07-15",
  dataNote:
    "설립유형·계열별 평균은 2026학년도 대학알리미 공시 기반 언론 보도 종합이며, 상위 대학 예시는 절대 순위가 아니라 계열 구성이 다른 학교 간 참고 사례입니다.",
};

const tuitionValues = TUITION_PRESETS.map((p) => p.annualTuition);
export const UTR_MAX_TUITION = Math.max(...tuitionValues);

export const UTR_FAQ: FaqItem[] = [
  {
    question: "등록금이 가장 비싼 대학은 어디인가요?",
    answer:
      "을지대학교가 연 1,128만 400원으로 가장 높게 나타났지만 의학·자연과학 계열 중심 구성 때문입니다. 전 계열이 공개된 대학 중에서는 연세대학교(995만 7,800원)가 최고입니다.",
  },
  {
    question: "국공립대와 사립대 등록금 차이는 얼마나 되나요?",
    answer: "2026학년도 기준 국공립대 평균은 425만 원, 사립대는 823만 1,500원으로 약 2배 차이입니다.",
  },
  {
    question: "등록금은 계속 오르고 있나요?",
    answer:
      "2026학년도 법정 인상 상한은 3.19%로 최근 5년(2022~2026) 중 가장 낮은 수준입니다. 다만 실제 인상 대학 수는 125개교(65.8%)로 여전히 많습니다.",
  },
  {
    question: "이공계 특성화 대학은 등록금이 저렴한가요?",
    answer: "POSTECH(561만 3,000원), UNIST(656만 8,000원), KAIST(686만 6,000원) 등은 국공립대 평균보다는 높지만 일반 사립대보다는 낮은 편입니다.",
  },
  {
    question: "계열에 따라 등록금이 얼마나 차이 나나요?",
    answer:
      "2026학년도 기준 의학 계열 평균 1,032만 5,900원, 예체능 833만 8,100원, 공학 767만 7,400원, 자연과학 732만 3,300원, 인문사회 643만 3,700원 순입니다.",
  },
  {
    question: "이 순위는 실질 등록금(장학금 차감 후) 기준인가요?",
    answer: "아닙니다. 이 리포트는 명목 등록금 기준입니다. 실질 부담액은 국가장학금 계산기로 예상 지원금을 계산해 별도로 확인하는 것이 정확합니다.",
  },
];

export const UTR_SEO_INTRO = [
  "대학을 고를 때 등록금은 계열·설립유형에 따라 최대 두 배 넘게 차이가 나는 항목입니다. 2026학년도 4년제 대학 평균 등록금은 연 727만 300원으로 전년보다 2.1% 올랐고, 사립대(823만 1,500원)와 국공립대(425만 원)는 약 2배 차이가 납니다. 이 리포트는 설립유형·계열별 평균과 등록금 상위 대학 예시, 최근 5년 인상·동결 추이를 한 화면에서 비교합니다.",
  "설립유형별 비교만으로는 실제 체감 차이를 다 알기 어렵습니다. 계열별로 보면 의학 계열 평균이 1,032만 5,900원으로 가장 높고 인문사회 계열은 643만 3,700원으로 가장 낮아, 같은 대학 안에서도 학과에 따라 등록금이 크게 달라집니다. 등록금 상위 대학 예시로 든 을지대학교(1,128만 400원)나 연세대학교(995만 7,800원)도 계열 구성이 다르므로 단순 순위가 아니라 참고 사례로 봐야 합니다.",
  "등록금 인상 추이를 보면 최근 5년간 법정 인상 상한이 2022년 1.65%에서 2025년 5.49%까지 올랐다가 2026년 3.19%로 다시 낮아졌습니다. 다만 상한이 낮아졌다고 인상 대학 수까지 줄어든 것은 아니어서, 2026학년도에도 190개 대학 중 125개교(65.8%)가 등록금을 인상했고 65개교(34.2%)만 동결했습니다.",
  "이 리포트는 2026학년도 대학알리미 공시와 언론 보도를 종합한 명목 등록금 기준입니다. 실제 학생이 부담하는 금액은 국가장학금 등 지원금을 뺀 실질 등록금으로 봐야 정확하므로, 국가장학금 계산기와 대학 등록금 계산기를 함께 확인하는 것을 권장합니다.",
];

export const UTR_SEO_CRITERIA = [
  "설립유형·계열별 평균은 2026학년도 대학알리미 공시 기반 언론 보도 종합 기준입니다.",
  "등록금 상위 대학 예시는 절대 순위가 아니며 계열 구성이 다른 학교 간 단순 비교에 주의해야 합니다.",
  "인상·동결 현황은 2022~2026학년도 5년간 법정 인상 상한과 실제 인상 대학 수 기준입니다.",
  "이 리포트는 명목 등록금이며 국가장학금 등 지원금을 뺀 실질 등록금이 아닙니다.",
];

export const UTR_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/university-cost-calculator-2026/", label: "대학 등록금 계산기 2026", description: "등록금·주거비·생활비를 반영한 4년 실부담금을 계산합니다." },
  { href: "/tools/national-scholarship-calculator-2026/", label: "국가장학금 계산기 2026", description: "소득분위별 예상 국가장학금 지원금을 계산합니다." },
  { href: "/tools/dorm-vs-commute-cost-comparison-2026/", label: "기숙사 vs 자취 vs 통학 비교", description: "거주 형태별 주거·생활비와 통학 시간을 비교합니다." },
];
