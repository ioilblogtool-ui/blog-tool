import { IST_SCHOOLS, IST_META, type InternationalSchoolProfile } from "./internationalSchoolTuitionCalculator2026";

export type ClusterCard = {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
};

export type FaqItem = { question: string; answer: string };

export const ISO_META = {
  slug: "international-school-overview-2026",
  title: "국내 국제학교, 학비부터 입학조건까지",
  seoTitle: "국내 국제학교 2026 완전 정리 | 학비·입학조건 한눈에 비교",
  seoDescription:
    "국제학교 학비, 입학조건, 지역별 대표 학교를 한 페이지에서 비교. 제주·서울·송도 국제학교와 학비 계산기까지 연결.",
  description: "국제학교를 검토 중인 학부모가 처음 봐야 할 학비·입학조건·지역 정보를 한 페이지에 모았습니다.",
  updatedAt: "2026-07-08",
};

// 허브는 IST_SCHOOLS를 그대로 재사용 — 새 학비 데이터 생성 금지
export const ISO_SCHOOLS: InternationalSchoolProfile[] = IST_SCHOOLS;

// 대표 학년(첫 번째 tier) 기준, 계산기 기본 환율로 계산한 연간 학비 — 7개교 전체 랭킹
const representativeAnnualKrw = (school: InternationalSchoolProfile) => {
  const tier = school.tuitionTiers[0];
  return Math.round(tier.krwPortion + tier.usdPortion * IST_META.defaultExchangeRate);
};

const rankedSchools = [...ISO_SCHOOLS].sort((a, b) => representativeAnnualKrw(a) - representativeAnnualKrw(b));
const cheapest = rankedSchools[0];
const priciest = rankedSchools[rankedSchools.length - 1];

const fmtMan = (n: number) => `${Math.round(n / 10000).toLocaleString("ko-KR")}만원`;

export const ISO_SUMMARY_STATS = [
  { label: "반영 학교 수", value: "7개교", sub: "제주 4개 + 서울·경기·송도 3개" },
  { label: "최저 학비 대표값", value: fmtMan(representativeAnnualKrw(cheapest)), sub: `${cheapest.name} (${cheapest.tuitionTiers[0].tierLabel} 기준)` },
  { label: "최고 학비 대표값", value: fmtMan(representativeAnnualKrw(priciest)), sub: `${priciest.name} (${priciest.tuitionTiers[0].tierLabel} 기준)` },
];

export const ISO_CLUSTER_CARDS: ClusterCard[] = [
  {
    href: "/tools/international-school-tuition-calculator-2026/",
    eyebrow: "계산기",
    title: "국제학교 학비 계산기",
    description: "지역·학교·학년·자녀 수를 입력하면 연간 학비와 월 부담액, 소득 대비 부담 등급까지 바로 계산합니다.",
    cta: "학비 계산하기",
  },
  {
    href: "/reports/jeju-international-school-comparison-2026/",
    eyebrow: "제주",
    title: "제주 국제학교 4곳 비교",
    description: "NLCS·BHA·SJA·KIS Jeju 학비 랭킹과 통학·기숙 옵션을 비교합니다.",
    cta: "제주 4개교 비교 보기",
  },
  {
    href: "/reports/seoul-international-school-comparison-2026/",
    eyebrow: "서울·경기·송도",
    title: "서울·경기 국제학교 비교",
    description: "SFS·Dulwich·채드윅 학비 랭킹과 추천 유형을 비교합니다.",
    cta: "서울권 비교 보기",
  },
  {
    href: "/reports/international-school-vs-foreign-school-2026/",
    eyebrow: "입학조건",
    title: "국제학교 vs 외국인학교 차이",
    description: "입학 자격과 내국인 정원 제한 차이, 부모들이 자주 하는 오해 TOP 5를 정리합니다.",
    cta: "차이 정리 보기",
  },
  {
    href: "/reports/international-school-vs-kindergarten-2026/",
    eyebrow: "대안 비교",
    title: "국제학교 vs 영어유치원",
    description: "영어유치원 4단계와 국제학교 7개교를 연간 비용 하나로 줄 세워 비교합니다.",
    cta: "비용 비교 보기",
  },
  {
    href: "/reports/international-school-admission-guide-2026/",
    eyebrow: "입학 준비",
    title: "입학조건 체크리스트",
    description: "준비 타임라인, 서류 체크리스트, 인터뷰 예상 질문까지 정리했습니다.",
    cta: "체크리스트 보기",
  },
];

export const ISO_REGION_SUMMARY = [
  {
    region: "제주",
    schoolCount: 4,
    schools: "NLCS Jeju, Branksome Hall Asia, KIS Jeju, SJA Jeju",
    feature: "제주국제자유도시특별법 근거로 내국인 입학 제한 없음. 기숙 옵션 있는 학교가 많음.",
  },
  {
    region: "서울·경기·송도",
    schoolCount: 3,
    schools: "Chadwick International(송도), Seoul Foreign School, Dulwich College Seoul",
    feature: "대부분 외국인학교로 분류되어 내국인 입학은 정원의 30%(교육감 재량 시 50%) 이내로 제한.",
  },
];

export const ISO_FAQ: FaqItem[] = [
  {
    question: "국제학교와 외국인학교는 같은 말인가요?",
    answer:
      "아닙니다. 국제학교(외국교육기관)는 경제자유구역·제주특별법 등 별도 법령으로 설립되어 내국인 입학 제한이 없는 경우가 많고, 외국인학교는 내국인 정원이 30%(교육감 재량 시 50%)로 제한됩니다. 자세한 차이는 관련 리포트에서 확인할 수 있습니다.",
  },
  {
    question: "이 페이지에 나오는 학비는 정확한가요?",
    answer:
      "각 학교 공식 홈페이지 2026-07-08 확인 기준입니다. 학교마다 매년 학비를 개정하므로, 실제 지원 전에는 반드시 학교 공식 입학처에서 최신 학비를 재확인하세요.",
  },
  {
    question: "제주와 서울 중 어디 국제학교가 더 저렴한가요?",
    answer: `대표 학년 기준으로는 ${cheapest.name}(${fmtMan(representativeAnnualKrw(cheapest))})이 가장 낮고, ${priciest.name}(${fmtMan(representativeAnnualKrw(priciest))})이 가장 높습니다. 다만 기숙 여부와 학년에 따라 순위가 바뀔 수 있어 학비 계산기로 직접 비교하는 것이 정확합니다.`,
  },
  {
    question: "국제학교 입학에 나이 제한이 있나요?",
    answer:
      "학교마다 학년별 정원과 입학 시험 기준이 다릅니다. 입학조건 체크리스트 리포트에서 준비 시점과 서류를 확인할 수 있습니다.",
  },
  {
    question: "이 클러스터에 없는 학교도 있나요?",
    answer:
      "네. 검색 수요가 높은 제주·서울·송도권 7개교를 우선 반영했습니다. Dwight School Seoul, YISS, KIS Pangyo 등은 추후 추가할 예정입니다.",
  },
];
