import { IST_SCHOOLS, type InternationalSchoolProfile } from "./internationalSchoolTuitionCalculator2026";
import { SAC_SCHOOLS, SAC_LIVING_COSTS, SAC_FX_RATES, type SeaSchoolProfile } from "./southeastAsiaInternationalSchoolCostCalculator2026";

export type FaqItem = { question: string; answer: string };
export type RelatedLink = { href: string; label: string; description: string };

export const KVSA_META = {
  slug: "korea-vs-southeast-asia-international-school-2026",
  title: "한국 국제학교, 동남아로 옮기면 정말 저렴할까",
  seoTitle: "한국 vs 동남아 국제학교 2026 | 1년 총비용 한눈에 비교",
  seoDescription:
    "한국과 말레이시아·태국·베트남 국제학교의 학비, 생활비, 5년 누적 비용을 비교합니다. 계산기로 우리 가족 비용도 바로 확인하세요.",
  description: "한국과 동남아 3개국 국제학교의 학비와 생활비를 더한 총비용을 비교합니다.",
  updatedAt: "2026-07-09",
};

// 한국 쪽 대표값 — 국내 클러스터 7개교 중 지역별 대표 1곳씩 선정
export const KVSA_KR_REPRESENTATIVE_IDS = ["dulwich-seoul", "chadwick-songdo", "nlcs-jeju"] as const;
export const KVSA_KR_SCHOOLS: InternationalSchoolProfile[] = IST_SCHOOLS.filter((s) =>
  (KVSA_KR_REPRESENTATIVE_IDS as readonly string[]).includes(s.id)
);

// 동남아 쪽 — 6개 도시 대표 1곳씩만 선정 (전체 28개교를 다 나열하면 비교표가 지나치게 길어짐)
export const KVSA_SEA_REPRESENTATIVE_IDS = [
  "sri-kdu-kl",
  "real-schools-jb",
  "kis-bangkok",
  "cmis-chiangmai",
  "renaissance-saigon",
  "bis-hanoi",
] as const;
export const KVSA_SEA_SCHOOLS: SeaSchoolProfile[] = SAC_SCHOOLS.filter((s) =>
  (KVSA_SEA_REPRESENTATIVE_IDS as readonly string[]).includes(s.id)
);
export const KVSA_SEA_LIVING_COSTS = SAC_LIVING_COSTS;
export const KVSA_SEA_FX_RATES = SAC_FX_RATES;

export type CountrySummaryCard = {
  countryKey: "MY" | "TH" | "VN";
  countryLabel: string;
  cityLabel: string;
  prosNote: string;
  consNote: string;
  bestFor: string;
};

export const KVSA_COUNTRY_SUMMARY: CountrySummaryCard[] = [
  {
    countryKey: "MY",
    countryLabel: "말레이시아",
    cityLabel: "쿠알라룸푸르·조호바루",
    prosNote: "6개 도시 중 학교 선택지가 가장 많고, 학비 스펙트럼도 넓어 예산에 맞춰 고르기 쉽습니다.",
    consNote: "학교 등급별 학비 편차가 커서, 등급을 잘못 고르면 한국과 비슷하거나 더 비쌀 수 있습니다.",
    bestFor: "예산에 맞춰 학교를 직접 비교해보고 싶은 가족",
  },
  {
    countryKey: "TH",
    countryLabel: "태국",
    cityLabel: "방콕·치앙마이",
    prosNote: "국제학교 수가 많고 생활 인프라(병원·쇼핑·교통)가 잘 갖춰져 있습니다.",
    consNote: "프리미엄 학교(ISB·Patana 등)는 학비만으로도 한국 상위권 학교에 근접하거나 더 비쌉니다.",
    bestFor: "학비보다 생활 인프라·편의성을 중시하는 가족",
  },
  {
    countryKey: "VN",
    countryLabel: "베트남",
    cityLabel: "호치민·하노이",
    prosNote: "한국 기업 주재원이 많아 한인 커뮤니티·정보 교류가 활발합니다.",
    consNote: "일부 학교의 재정 안정성 이슈(폐교 사례 존재)가 있어 학교 선택 시 재정 건전성 확인이 특히 중요합니다.",
    bestFor: "주재원 발령 등으로 이미 이주가 예정된 가족",
  },
];

export const KVSA_FAQ: FaqItem[] = [
  {
    question: "동남아 국제학교가 한국보다 확실히 저렴한가요?",
    answer:
      "학비만 보면 대체로 그렇습니다. 하지만 부모가 동반해 거주할 경우 주거비·생활비가 추가되므로, 총비용은 학교 등급과 거주 형태에 따라 한국과 비슷해지거나 오히려 더 비싸질 수 있습니다. 계산기에서 조건을 입력해 직접 비교해보는 것이 정확합니다.",
  },
  {
    question: "한국과 동남아 중 어느 쪽이 커리큘럼 선택지가 더 많나요?",
    answer:
      "양쪽 모두 IB·영국식(A-Level)·미국식(AP) 커리큘럼을 제공하는 학교가 있습니다. 특정 대학 진학을 목표로 한다면 목표 국가의 대입 제도와 맞는 커리큘럼을 우선 확인하는 것이 좋습니다.",
  },
  {
    question: "자녀 1명을 한국 국제학교에 보내는 비용으로 동남아 가족 이주가 가능한가요?",
    answer:
      "학교와 거주 형태에 따라 다릅니다. 한국의 프리미엄 학교(예: 서울권 원화 전액 학교) 학비 수준이면 동남아 중간~프리미엄 등급 학교의 학비+생활비를 감당할 수 있는 경우가 있지만, 정확한 비교는 계산기로 직접 확인해야 합니다.",
  },
  {
    question: "말레이시아·태국·베트남 각각 어떤 도시를 비교할 수 있나요?",
    answer: "말레이시아는 쿠알라룸푸르·조호바루, 태국은 방콕·치앙마이, 베트남은 호치민·하노이까지 총 6개 도시를 비교할 수 있습니다. 다만 조호바루는 아직 생활비 데이터가 없어 학비만 계산됩니다.",
  },
  {
    question: "베트남 국제학교는 안전한가요?",
    answer:
      "대부분 안정적으로 운영되지만, 일부 학교는 재정 문제로 폐교한 사례가 실제로 있었습니다(AISVN, 2026년 1월 해산). 학비가 유난히 저렴하거나 최근 설립된 학교라면 재정 건전성과 학력 인정 여부를 반드시 확인하세요.",
  },
  {
    question: "한국과 동남아 학비는 어떤 기준으로 원화 환산했나요?",
    answer:
      "한국 학교의 달러 분담분은 국내 계산기 기본 환율(1,380원/달러), 동남아 학교는 2026-07-09 기준 통화별 환율(MYR 368.4원, THB 44.95원, VND 0.05715원)을 적용했습니다. 두 기준 모두 고정값이라 실제 납부 시점 환율과 다를 수 있습니다.",
  },
];

export const KVSA_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/southeast-asia-international-school-cost-calculator-2026/", label: "동남아 국제학교 비용 계산기", description: "우리 가족 조건으로 직접 계산해보세요." },
  { href: "/reports/malaysia-international-school-guide-2026/", label: "말레이시아 국제학교 총정리", description: "쿠알라룸푸르·조호바루 국제학교 학비와 생활비를 정리합니다." },
  { href: "/reports/thailand-international-school-guide-2026/", label: "태국 국제학교 총정리", description: "방콕·치앙마이 국제학교 학비와 생활비를 정리합니다." },
  { href: "/reports/vietnam-international-school-guide-2026/", label: "베트남 국제학교 총정리", description: "호치민·하노이 국제학교 학비와 생활비를 정리합니다." },
  { href: "/reports/international-school-overview-2026/", label: "국내 국제학교 총정리", description: "국내 국제학교 학비와 입학조건을 비교합니다." },
];
