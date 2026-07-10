import { SAC_SCHOOLS, SAC_LIVING_COSTS, SAC_FX_RATES, type SeaSchoolProfile } from "./southeastAsiaInternationalSchoolCostCalculator2026";

export type FaqItem = { question: string; answer: string };
export type RelatedLink = { href: string; label: string; description: string };

export const MIS_META = {
  slug: "malaysia-international-school-guide-2026",
  title: "말레이시아 국제학교, 뭐가 다를까",
  seoTitle: "말레이시아 국제학교 2026 완전 정리 | 학비·생활비 총정리",
  seoDescription:
    "쿠알라룸푸르·조호바루 국제학교의 학비와 생활비를 비교합니다. 한국 국제학교 대비 비용 차이까지 확인하세요.",
  description: "쿠알라룸푸르 5곳·조호바루 3곳, 총 8개교의 학비·커리큘럼·생활비를 비교합니다.",
  updatedAt: "2026-07-09",
};

// 쿠알라룸푸르 + 조호바루 필터링해 재사용 — 새 데이터 정의 금지
export const MIS_KL_SCHOOLS: SeaSchoolProfile[] = SAC_SCHOOLS.filter((s) => s.country === "MY" && s.city === "kuala_lumpur");
export const MIS_JB_SCHOOLS: SeaSchoolProfile[] = SAC_SCHOOLS.filter((s) => s.country === "MY" && s.city === "johor_bahru");
export const MIS_KL_LIVING_COST = SAC_LIVING_COSTS.find((l) => l.city === "kuala_lumpur")!;
export const MIS_JB_LIVING_COST = SAC_LIVING_COSTS.find((l) => l.city === "johor_bahru")!;
export const MIS_FX_RATE = SAC_FX_RATES.find((f) => f.currency === "MYR")!;

export type SchoolProfileNote = {
  schoolId: string;
  oneLinerKo: string;
  bestFor: string;
};

export const MIS_SCHOOL_NOTES: SchoolProfileNote[] = [
  { schoolId: "gis-kl", oneLinerKo: "쿠알라룸푸르에서 가장 오래된 영국식 국제학교 중 하나로 학년 전 구간 데이터가 가장 촘촘하게 확인됨.", bestFor: "영국식 커리큘럼(GCSE·A-Level)을 원하는 가정" },
  { schoolId: "mkis-kl", oneLinerKo: "5개교 중 중간 가격대, 미국식 커리큘럼.", bestFor: "미국 대학 진학을 염두에 둔 가정" },
  { schoolId: "alice-smith-kl", oneLinerKo: "전통 있는 영국식 학교, 고학년 학비가 5개교 중 상위권.", bestFor: "안정적인 영국식 명문교를 찾는 가정" },
  { schoolId: "nexus-kl", oneLinerKo: "IB 커리큘럼 전 학년 데이터가 가장 세분화되어 확인됨.", bestFor: "IB 디플로마를 목표로 하는 가정" },
  { schoolId: "sri-kdu-kl", oneLinerKo: "5개교 중 가장 학비가 낮은 편, 다만 데이터 확보 학년이 초등 구간뿐.", bestFor: "예산을 최우선으로 고려하는 가정(단, 중·고등 학비는 별도 확인 필요)" },
  { schoolId: "marlborough-jb", oneLinerKo: "조호바루 3개교 중 가장 비싸지만 학년 전 구간 데이터가 가장 촘촘하고 공식 확인됨. 기숙 옵션도 있음.", bestFor: "영국 명문 사립교 브랜드를 중시하는 가정" },
  { schoolId: "real-schools-jb", oneLinerKo: "조호바루에서 가장 저렴한 국제학교 — 같은 학교 안에 국제부(영국식)와 말레이시아 국가과정을 함께 운영.", bestFor: "예산을 최우선으로 고려하는 가정" },
  { schoolId: "crescendo-help-jb", oneLinerKo: "Marlborough와 R.E.A.L 사이 중간 가격대, 영국식 IPC·Cambridge 커리큘럼.", bestFor: "중간 가격대에서 영국식 커리큘럼을 원하는 가정" },
];

export const MIS_FAQ: FaqItem[] = [
  {
    question: "쿠알라룸푸르·조호바루 국제학교 중 가장 저렴한 곳은 어디인가요?",
    answer:
      "확보된 데이터 기준으로는 조호바루의 R.E.A.L Schools JB(국제부 기준, Early Years 연간 약 1만3,760 MYR)가 8개교 중 가장 낮습니다. 쿠알라룸푸르에서는 Sri KDU Kota Damansara의 초등 구간이 상대적으로 낮은 편입니다.",
  },
  {
    question: "말레이시아 국제학교 학비에 세금이 포함되어 있나요?",
    answer:
      "2025년 7월부터 연 수업료가 6만 MYR를 초과하는 부분에 6% 서비스세(SST)가 부과됩니다. Marlborough College Malaysia는 공식 페이지에 SST 별도 부과가 명시되어 있으며, 다른 학교도 실제 지원 전 세금 포함 여부를 확인하는 것이 안전합니다.",
  },
  {
    question: "쿠알라룸푸르에서 국제학교를 보내면 생활비는 얼마나 드나요?",
    answer:
      "외국인 4인 가족 기준 월 생활비(주거비 제외)는 약 9,042 MYR입니다. 콘도 월세는 3베드룸 기준 외곽 약 2,492 MYR, 시내중심 약 4,943 MYR로 조사되었습니다. 정확한 총비용은 계산기에서 학교·거주 형태를 선택해 확인할 수 있습니다.",
  },
  {
    question: "조호바루 국제학교는 왜 총비용을 계산할 수 없나요?",
    answer:
      "조호바루의 학교 학비는 확인했지만, 가족 생활비 데이터는 아직 조사하지 못했습니다. 계산기에서 조호바루를 선택하면 총비용 대신 학비만 표시됩니다. 생활비 데이터가 보강되는 대로 다른 도시와 동일하게 총비용을 계산할 수 있도록 업데이트할 예정입니다.",
  },
  {
    question: "조호바루 R.E.A.L Schools는 왜 다른 학교보다 훨씬 저렴한가요?",
    answer:
      "R.E.A.L Schools Johor Bahru는 국제부(영국 커리큘럼)와 말레이시아 국가교육과정 트랙을 함께 운영합니다. 이 페이지의 학비는 국제부 기준만 사용했습니다 — 국가교육과정 트랙은 이보다 더 저렴하지만 국제학교로 분류하기 어려워 제외했습니다.",
  },
  {
    question: "말레이시아 국제학교는 한국 국제학교보다 저렴한가요?",
    answer:
      "학비만 비교하면 대체로 낮은 편입니다. 하지만 부모가 동반 거주할 경우 생활비가 추가되므로, 정확한 비교는 학비와 생활비를 함께 계산하는 것이 중요합니다. 한국과의 총비용 비교는 관련 리포트와 계산기를 참고하세요.",
  },
  {
    question: "MYR 학비를 원화로 환산하면 정확히 얼마인가요?",
    answer:
      "이 페이지의 원화 환산은 2026-07-09 기준 환율(1 MYR ≈ 368.4원)을 고정값으로 적용한 참고 수치입니다. 실제 납부 시점의 환율은 이보다 오르거나 내릴 수 있으므로, 정확한 금액은 송금·납부 시점 환율로 다시 계산해야 합니다.",
  },
];

export const MIS_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/southeast-asia-international-school-cost-calculator-2026/", label: "동남아 국제학교 비용 계산기", description: "학비와 생활비를 합산해 직접 계산해보세요." },
  { href: "/reports/korea-vs-southeast-asia-international-school-2026/", label: "한국 vs 동남아 국제학교 비교", description: "한국과 동남아 3개국 총비용을 비교합니다." },
  { href: "/reports/thailand-international-school-guide-2026/", label: "태국 국제학교 총정리", description: "방콕·치앙마이 국제학교 학비를 정리합니다." },
  { href: "/reports/vietnam-international-school-guide-2026/", label: "베트남 국제학교 총정리", description: "호치민·하노이 국제학교 학비를 정리합니다." },
];
