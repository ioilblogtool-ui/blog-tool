import { SAC_SCHOOLS, SAC_LIVING_COSTS, SAC_FX_RATES, type SeaSchoolProfile } from "./southeastAsiaInternationalSchoolCostCalculator2026";

export type FaqItem = { question: string; answer: string };
export type RelatedLink = { href: string; label: string; description: string };

export const TIS_META = {
  slug: "thailand-international-school-guide-2026",
  title: "태국 국제학교, 방콕·치앙마이는 얼마나 들까",
  seoTitle: "태국 국제학교 2026 완전 정리 | 방콕·치앙마이 학비 비교",
  seoDescription:
    "방콕·치앙마이 국제학교의 학비와 등급별 구간을 비교합니다. 한국 국제학교 대비 비용 차이까지 한눈에 확인하세요.",
  description: "방콕 7곳·치앙마이 4곳, 총 11개교의 학비·커리큘럼·등급을 비교합니다.",
  updatedAt: "2026-07-09",
  nistExcludedNote:
    "NIST International School(방콕)은 공식 홈페이지가 자바스크립트 렌더링 방식이라 실제 학비를 확인할 수 없었고, 검색 결과끼리도 서로 다른 수치(45만~113만 THB 범위)를 제시해 이 페이지에서 제외했습니다.",
};

// 방콕 + 치앙마이 필터링해 재사용 — 새 데이터 정의 금지
export const TIS_BANGKOK_SCHOOLS: SeaSchoolProfile[] = SAC_SCHOOLS.filter((s) => s.country === "TH" && s.city === "bangkok");
export const TIS_CHIANGMAI_SCHOOLS: SeaSchoolProfile[] = SAC_SCHOOLS.filter((s) => s.country === "TH" && s.city === "chiang_mai");
export const TIS_BANGKOK_LIVING_COST = SAC_LIVING_COSTS.find((l) => l.city === "bangkok")!;
export const TIS_CHIANGMAI_LIVING_COST = SAC_LIVING_COSTS.find((l) => l.city === "chiang_mai")!;
export const TIS_FX_RATE = SAC_FX_RATES.find((f) => f.currency === "THB")!;

export type SchoolProfileNote = { schoolId: string; oneLinerKo: string; bestFor: string };

export const TIS_SCHOOL_NOTES: SchoolProfileNote[] = [
  { schoolId: "isb-bangkok", oneLinerKo: "방콕 7개교 중 학년별 데이터가 가장 촘촘한 미국식 프리미엄 학교.", bestFor: "미국 대학 진학을 목표로 하는 가정" },
  { schoolId: "harrow-bangkok", oneLinerKo: "영국 명문 Harrow의 방콕 분교, 학년별 세부 학비는 아직 확인되지 않음.", bestFor: "영국식 전통 명문교를 선호하는 가정(학년별 정확한 학비는 재확인 필요)" },
  { schoolId: "shrewsbury-city-bangkok", oneLinerKo: "City Campus 기준 유치~초등 데이터 확보, 중·고등은 별도 확인 필요.", bestFor: "유치~초등 자녀를 둔 영국식 커리큘럼 희망 가정" },
  { schoolId: "kis-bangkok", oneLinerKo: "IB 커리큘럼, 방콕 7개교 중 중간 가격대.", bestFor: "IB 디플로마를 목표로 하는 가정" },
  { schoolId: "patana-bangkok", oneLinerKo: "방콕의 대표 프리미엄 영국식 학교, 학년별 데이터가 가장 촘촘하게 공식 확인됨.", bestFor: "영국식 프리미엄 명문교를 원하는 가정" },
  { schoolId: "bangkok-prep", oneLinerKo: "방콕 7개교 중 중간~저가 구간을 대표하는 영국식 학교, 공식 확인됨.", bestFor: "합리적인 가격대의 영국식 커리큘럼을 원하는 가정" },
  { schoolId: "wells-bangkok", oneLinerKo: "방콕에서 가장 저렴한 축으로 추정되나, 공식 페이지 직접 확인은 아직 안 됨.", bestFor: "예산을 최우선으로 고려하는 가정(수치 재확인 권장)" },
  { schoolId: "ptis-chiangmai", oneLinerKo: "치앙마이의 대표 IB 국제학교, 다만 데이터가 2024-25학년도 기준으로 다소 오래됨.", bestFor: "IB 디플로마를 목표로 하는 가정" },
  { schoolId: "cmis-chiangmai", oneLinerKo: "치앙마이 4개교 중 최신 데이터(2026-27)로 공식 확인됨.", bestFor: "최신 학비 정보를 우선하는 가정" },
  { schoolId: "grace-chiangmai", oneLinerKo: "치앙마이 4개교 중 가장 저렴.", bestFor: "예산을 최우선으로 고려하는 가정" },
  { schoolId: "apis-chiangmai", oneLinerKo: "Primary와 Main Campus로 캠퍼스가 나뉘어 학년 간 학비 체계가 다름.", bestFor: "캠퍼스별 학비 차이를 감안할 수 있는 가정" },
];

export const TIS_FAQ: FaqItem[] = [
  {
    question: "방콕과 치앙마이 중 어디가 더 저렴한가요?",
    answer:
      "치앙마이가 전반적으로 저렴한 편입니다. 치앙마이 4개교의 학비는 약 29만~74만 THB 범위인 반면, 방콕은 저가형(Wells·Bangkok Prep)도 24만~86만 THB, 프리미엄(ISB·Patana)은 100만 THB를 넘는 학교도 있습니다. 다만 방콕에도 저가형 학교가 있어 도시보다는 학교 등급이 더 중요한 변수입니다.",
  },
  {
    question: "방콕 국제학교 중 가장 저렴한 곳은 어디인가요?",
    answer:
      "확보된 데이터 기준으로는 Wells International School이 가장 낮은 것으로 추정되지만, 이 학교는 공식 페이지 직접 확인이 안 되어 수치의 확실성이 낮습니다. 공식 확인된 학교 중에서는 Bangkok Preparatory International School이 상대적으로 저렴한 편입니다.",
  },
  {
    question: "NIST International School은 왜 이 페이지에 없나요?",
    answer:
      "NIST의 공식 홈페이지는 자바스크립트로 학비를 표시하는 방식이라 직접 조회가 불가능했고, 검색 결과마다 제시하는 수치가 서로 달라(45만~113만 THB 범위) 신뢰할 수 있는 단일 수치를 확보하지 못했습니다. 확인되는 대로 추가할 예정입니다.",
  },
  {
    question: "치앙마이 국제학교 학비는 최신 정보인가요?",
    answer:
      "치앙마이 4개교 중 Chiang Mai International School(CMIS)은 2026-2027학년도 최신 정보입니다. 다만 Prem Tinsulanonda International School(PTIS)은 2024-2025학년도 공식 자료를 기준으로 하며, 국제학교 학비는 보통 연 5~8% 인상되므로 실제 2026-27학년도 학비는 이보다 10~15% 높을 수 있습니다.",
  },
  {
    question: "방콕·치앙마이 국제학교 학비에 생활비까지 더하면 얼마나 드나요?",
    answer:
      "방콕은 외국인 4인 가족 기준 월 생활비(주거비 제외) 약 8만 6,839 THB, 치앙마이는 약 6만 6,555 THB로 조사되었습니다. 정확한 총비용은 계산기에서 학교와 거주 형태를 선택해 확인할 수 있습니다.",
  },
  {
    question: "THB 학비를 원화로 환산하면 정확히 얼마인가요?",
    answer:
      "이 페이지의 원화 환산은 2026-07-09 기준 환율(1 THB ≈ 44.95원)을 고정값으로 적용한 참고 수치입니다. 실제 납부 시점의 환율은 이보다 오르거나 내릴 수 있으므로, 정확한 금액은 송금·납부 시점 환율로 다시 계산해야 합니다.",
  },
];

export const TIS_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/southeast-asia-international-school-cost-calculator-2026/", label: "동남아 국제학교 비용 계산기", description: "학비와 생활비를 합산해 직접 계산해보세요." },
  { href: "/reports/korea-vs-southeast-asia-international-school-2026/", label: "한국 vs 동남아 국제학교 비교", description: "한국과 동남아 3개국 총비용을 비교합니다." },
  { href: "/reports/malaysia-international-school-guide-2026/", label: "말레이시아 국제학교 총정리", description: "쿠알라룸푸르·조호바루 국제학교 학비를 정리합니다." },
  { href: "/reports/vietnam-international-school-guide-2026/", label: "베트남 국제학교 총정리", description: "호치민·하노이 국제학교 학비를 정리합니다." },
];
