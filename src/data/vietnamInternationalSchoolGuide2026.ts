import { SAC_SCHOOLS, SAC_LIVING_COSTS, SAC_FX_RATES, type SeaSchoolProfile } from "./southeastAsiaInternationalSchoolCostCalculator2026";

export type FaqItem = { question: string; answer: string };
export type RelatedLink = { href: string; label: string; description: string };

export const VIS_META = {
  slug: "vietnam-international-school-guide-2026",
  title: "베트남 국제학교, 호치민·하노이는 얼마나 들까",
  seoTitle: "베트남 국제학교 2026 완전 정리 | 호치민·하노이 학비 비교",
  seoDescription:
    "호치민·하노이 국제학교의 학비를 비교합니다. 학교 선택 시 반드시 확인해야 할 재정 안정성 체크포인트도 정리했습니다.",
  description: "호치민 4곳·하노이 5곳, 총 9개교의 학비·커리큘럼을 비교하고, 학교 선택 시 확인할 리스크를 안내합니다.",
  updatedAt: "2026-07-09",
  aisvnRiskNote:
    "American International School Vietnam(AISVN)은 학부모 예치금을 둘러싼 재정 스캔들로 2024년 7월부터 운영이 사실상 중단되었고, 2026년 1월 12일 호치민시가 공식 해산을 결정했습니다. 학비가 유난히 저렴하거나 최근 급성장한 학교, 재정 구조가 불투명한 학교는 입학 전 반드시 재정 건전성과 인가 현황을 확인해야 합니다.",
};

// 호치민 + 하노이 필터링해 재사용 — 새 데이터 정의 금지. AISVN은 폐교로 SAC_SCHOOLS에 포함하지 않음
export const VIS_HCMC_SCHOOLS: SeaSchoolProfile[] = SAC_SCHOOLS.filter((s) => s.country === "VN" && s.city === "ho_chi_minh");
export const VIS_HANOI_SCHOOLS: SeaSchoolProfile[] = SAC_SCHOOLS.filter((s) => s.country === "VN" && s.city === "hanoi");
export const VIS_HCMC_LIVING_COST = SAC_LIVING_COSTS.find((l) => l.city === "ho_chi_minh")!;
export const VIS_HANOI_LIVING_COST = SAC_LIVING_COSTS.find((l) => l.city === "hanoi")!;
export const VIS_FX_RATE = SAC_FX_RATES.find((f) => f.currency === "VND")!;

export type SchoolProfileNote = { schoolId: string; oneLinerKo: string; bestFor: string };

export const VIS_SCHOOL_NOTES: SchoolProfileNote[] = [
  { schoolId: "ais-hcmc", oneLinerKo: "이 클러스터 전체에서 유일하게 학교 공식 Fee Schedule PDF 원문을 직접 확인한 학교 — 데이터 신뢰도가 가장 높음.", bestFor: "정확한 학비 정보를 우선하는 가정" },
  { schoolId: "bis-hcmc", oneLinerKo: "영국식 명문 Nord Anglia 계열, 다만 중간 학년 데이터는 아직 확인되지 않음.", bestFor: "영국식 커리큘럼을 원하는 가정(중간 학년은 별도 확인 필요)" },
  { schoolId: "ishcmc", oneLinerKo: "호치민에서 오래된 IB 국제학교 중 하나.", bestFor: "IB 디플로마를 목표로 하는 가정" },
  { schoolId: "renaissance-saigon", oneLinerKo: "호치민 4개교 중 상대적으로 학비가 낮은 편.", bestFor: "예산을 고려하면서 IB 커리큘럼을 원하는 가정" },
  { schoolId: "bis-hanoi", oneLinerKo: "하노이 5개교 중 학년별 데이터가 가장 촘촘하고 공식 확인됨(두 차례 독립 조사로 교차검증).", bestFor: "영국식 커리큘럼을 원하고 정확한 학비 정보를 우선하는 가정" },
  { schoolId: "bvis-hanoi", oneLinerKo: "BIS Hanoi 자매학교, 상대적으로 학비가 낮은 편.", bestFor: "영국식 커리큘럼을 원하면서 BIS보다 예산을 낮추고 싶은 가정" },
  { schoolId: "concordia-hanoi", oneLinerKo: "하노이 5개교 중 최고가, IB 커리큘럼.", bestFor: "IB 프리미엄 교육을 원하는 가정" },
  { schoolId: "unis-hanoi", oneLinerKo: "하노이의 대표 IB 국제학교 중 하나, 학년별 데이터가 세분화되어 있으나 3자 집계 기준.", bestFor: "IB 디플로마를 목표로 하는 가정" },
  { schoolId: "his-hanoi", oneLinerKo: "하노이 5개교 중 상대적으로 저렴한 미국식 학교.", bestFor: "예산을 고려하면서 미국식 커리큘럼을 원하는 가정" },
];

export const VIS_FAQ: FaqItem[] = [
  {
    question: "호치민과 하노이 중 어디가 더 저렴한가요?",
    answer:
      "확보된 데이터 기준으로는 두 도시 모두 프리미엄 학교 위주라 큰 차이는 없지만, 호치민의 Renaissance International School Saigon(약 1억 9,000만 VND부터)과 하노이의 BVIS Hanoi(약 2억 5,170만 VND부터)가 각 도시에서 상대적으로 저렴한 편입니다.",
  },
  {
    question: "베트남 국제학교 학비는 어떤 통화로 확인해야 하나요?",
    answer:
      "베트남 국제학교는 보통 베트남 동(VND)으로 학비를 고지하지만, 계약서나 안내 자료에 미국 달러(USD) 환산액을 함께 표기하는 경우도 많습니다. 이 페이지는 VND 기준으로 정리했으며, 원화 환산은 계산기에서 확인할 수 있습니다.",
  },
  {
    question: "AISVN(American International School Vietnam)은 왜 이 페이지에 없나요?",
    answer:
      "AISVN은 학부모 예치금을 둘러싼 재정 스캔들로 2024년 7월부터 정상 운영이 어려워졌고, 2026년 1월 12일 호치민시가 공식 해산을 결정했습니다. 더 이상 유효한 선택지가 아니어서 데이터에서 제외했습니다. 자세한 내용은 아래 '학교 선택 시 확인할 것' 섹션을 참고하세요.",
  },
  {
    question: "베트남 국제학교를 고를 때 학비 외에 무엇을 확인해야 하나요?",
    answer:
      "학비가 다른 학교보다 유난히 저렴하거나, 학교 역사가 짧거나, 재정 구조가 불투명하다면 입학 전 인가 현황과 재정 건전성을 반드시 확인해야 합니다. AISVN 사례처럼 재정 문제로 갑자기 폐교하면 이미 납부한 학비를 돌려받지 못할 위험이 있습니다.",
  },
  {
    question: "하노이 국제학교 학비 데이터는 얼마나 정확한가요?",
    answer:
      "학교마다 다릅니다. BIS Hanoi·BVIS Hanoi·Concordia International School Hanoi는 학교 공식 페이지 원문으로 확인했지만, UNIS Hanoi·Hanoi International School(HIS)은 3자 집계 사이트를 통해 확보해 재확인이 더 필요합니다. 각 학교 카드의 신뢰도 배지를 확인하세요.",
  },
  {
    question: "VND 학비를 원화로 환산하면 정확히 얼마인가요?",
    answer:
      "이 페이지의 원화 환산은 2026-07-09 기준 환율(1,000 VND ≈ 57.15원)을 고정값으로 적용한 참고 수치입니다. 베트남 동은 단위가 커서 계산 실수가 나기 쉬우니, 실제 납부 전에는 반드시 송금 시점 환율로 다시 확인하세요.",
  },
];

export const VIS_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/southeast-asia-international-school-cost-calculator-2026/", label: "동남아 국제학교 비용 계산기", description: "학비를 직접 계산해보세요." },
  { href: "/reports/korea-vs-southeast-asia-international-school-2026/", label: "한국 vs 동남아 국제학교 비교", description: "한국과 동남아 3개국 총비용을 비교합니다." },
  { href: "/reports/malaysia-international-school-guide-2026/", label: "말레이시아 국제학교 총정리", description: "쿠알라룸푸르·조호바루 국제학교 학비를 정리합니다." },
  { href: "/reports/thailand-international-school-guide-2026/", label: "태국 국제학교 총정리", description: "방콕·치앙마이 국제학교 학비를 정리합니다." },
];
