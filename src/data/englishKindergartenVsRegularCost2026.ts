export type InstitutionType = "english_premium" | "english_standard" | "private_kinder" | "public_kinder";
export type SubsidyEligible = "none" | "partial" | "full";

export interface InstitutionOption {
  id: string;
  label: string;
  type: InstitutionType;
  monthlyListFee: number;
  subsidyEligible: SubsidyEligible;
  monthlySubsidy: number;
  monthlyNetFee: number;
  extraMonthlyCost: number;
  pros: string[];
  cons: string[];
  bestFor: string;
  note: string;
}

export interface RegionalFeeRow {
  region: string;
  englishKinderAvg: number;
  regularKinderAvg: number;
}

export interface AlternativeOption {
  id: string;
  label: string;
  monthlyCost: number;
  description: string;
  affiliateUrl: string;
}

export interface CumulativeCostRow {
  option: string;
  monthlyNetFee: number;
  threeYearTotal: number;
  isLowest?: boolean;
  isHighest?: boolean;
}

export interface EffectivenessView {
  stance: "positive" | "cautious";
  title: string;
  body: string;
}

export interface EkcFaq {
  question: string;
  answer: string;
}

export interface EkcLink {
  href: string;
  label: string;
}

export interface EkcCtaCard {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
}

export interface MistakeItem {
  title: string;
  body: string;
}

export interface SupportProgramRow {
  name: string;
  target: string;
  amount: string;
  note: string;
}

// ── META ────────────────────────────────────────────────
export const EKC_META = {
  slug: "english-kindergarten-vs-regular-kindergarten-cost-2026",
  title: "2026 영어유치원 vs 일반유치원 비용·효과 완전 비교",
  seoTitle: "영어유치원 일반유치원 비교 2026 | 월 학비 최대 200만 차이",
  description:
    "영어유치원과 일반유치원의 월 학비, 정부 지원금 반영 순부담액, 3년 누적 비용을 비교했습니다. 영어유치원 효과 논란과 대안까지 한 페이지에서 확인하세요.",
  updatedAt: "2026-06-27",
  dataNote:
    "이 리포트의 학비 정보는 2026년 6월 기준 추정값이며 특정 브랜드명을 명시하지 않습니다. 실제 학비는 기관·지역·시기에 따라 다를 수 있으므로 등록 전 반드시 해당 기관에 확인하세요.",
};

// ── 등급별 데이터 (4개) ────────────────────────────────────
export const INSTITUTIONS: InstitutionOption[] = [
  {
    id: "english_premium",
    label: "영어유치원 (프리미엄형)",
    type: "english_premium",
    monthlyListFee: 2200000,
    subsidyEligible: "none",
    monthlySubsidy: 0,
    monthlyNetFee: 2200000,
    extraMonthlyCost: 150000,
    pros: ["원어민 교사 비율 높음", "영어 노출 시간 많음", "다양한 특별활동"],
    cons: ["비용 부담 매우 큼", "지원금 대상 아닌 경우 다수", "초등 진학 후 적응 이슈 일부 제기"],
    bestFor: "영어 노출을 최우선으로 두고 비용 부담을 감당할 수 있는 가정",
    note: "강남·서초권 등 프리미엄 수요가 높은 지역 기준",
  },
  {
    id: "english_standard",
    label: "영어유치원 (일반형)",
    type: "english_standard",
    monthlyListFee: 1200000,
    subsidyEligible: "none",
    monthlySubsidy: 0,
    monthlyNetFee: 1200000,
    extraMonthlyCost: 100000,
    pros: ["프리미엄형보다 부담이 적음", "원어민+한국인 혼합 교사"],
    cons: ["프리미엄형 대비 영어 노출 시간·교사 비율 낮음"],
    bestFor: "영어 노출은 원하지만 프리미엄형 비용은 부담스러운 가정",
    note: "수도권 외곽·지방 거점도시 등 기준. 일부 정식 인가 기관만 부분 지원금 대상",
  },
  {
    id: "private_kinder",
    label: "민간유치원",
    type: "private_kinder",
    monthlyListFee: 450000,
    subsidyEligible: "partial",
    monthlySubsidy: 300000,
    monthlyNetFee: 150000,
    extraMonthlyCost: 50000,
    pros: ["지원금 적용으로 실질 부담 낮음", "접근성 높음"],
    cons: ["기관별 프로그램 편차 큼"],
    bestFor: "비용 부담을 최소화하면서 일반적인 유아 교육을 원하는 가정",
    note: "누리과정·유아학비 지원금 적용 기준",
  },
  {
    id: "public_kinder",
    label: "국공립유치원",
    type: "public_kinder",
    monthlyListFee: 100000,
    subsidyEligible: "full",
    monthlySubsidy: 90000,
    monthlyNetFee: 10000,
    extraMonthlyCost: 30000,
    pros: ["비용 부담 최소", "시설·안전 기준 높음"],
    cons: ["대기 인원 많음", "추첨 경쟁률 높은 지역 존재"],
    bestFor: "비용보다 안정성·접근성을 우선하는 가정 (대기 가능성 고려 필요)",
    note: "대부분 무상 또는 소액 부담",
  },
];

// ── 대안 3종 ────────────────────────────────────────────
export const ALTERNATIVES: AlternativeOption[] = [
  {
    id: "video_english",
    label: "화상영어",
    monthlyCost: 150000,
    description: "주 2~3회 화상 수업, 일반유치원과 병행 가능",
    affiliateUrl: "",
  },
  {
    id: "phone_english",
    label: "전화영어",
    monthlyCost: 120000,
    description: "매일 짧은 시간 전화 수업, 시간 유연성 높음",
    affiliateUrl: "",
  },
  {
    id: "english_books",
    label: "영어책 육아 + 영어 도서관",
    monthlyCost: 50000,
    description: "가정 내 영어 노출 환경 조성, 추가 인력 비용 없음",
    affiliateUrl: "",
  },
];

// ── 3년 누적 비용 ───────────────────────────────────────
export const CUMULATIVE_COST_ROWS: CumulativeCostRow[] = [
  { option: "영어유치원(프리미엄형)", monthlyNetFee: 2350000, threeYearTotal: 84600000, isHighest: true },
  { option: "영어유치원(일반형)", monthlyNetFee: 1300000, threeYearTotal: 46800000 },
  { option: "민간유치원", monthlyNetFee: 200000, threeYearTotal: 7200000 },
  { option: "국공립유치원", monthlyNetFee: 40000, threeYearTotal: 1800000, isLowest: true },
];

// ── 지역별 평균 학비 ─────────────────────────────────────
export const REGIONAL_FEE_ROWS: RegionalFeeRow[] = [
  { region: "강남·서초", englishKinderAvg: 2300000, regularKinderAvg: 550000 },
  { region: "목동", englishKinderAvg: 1900000, regularKinderAvg: 480000 },
  { region: "분당·판교", englishKinderAvg: 1850000, regularKinderAvg: 470000 },
  { region: "수도권 외곽", englishKinderAvg: 1300000, regularKinderAvg: 420000 },
  { region: "지방 거점도시", englishKinderAvg: 1100000, regularKinderAvg: 380000 },
];

// ── 효과성 균형 서술 ──────────────────────────────────────
export const EFFECTIVENESS_VIEWS: EffectivenessView[] = [
  {
    stance: "positive",
    title: "조기 영어 노출의 긍정적 효과",
    body: "유아기 집중적인 영어 노출이 듣기·발음 습득에 유리하다는 연구가 있습니다. 원어민 교사와의 상호작용이 자연스러운 언어 습득에 도움이 될 수 있습니다.",
  },
  {
    stance: "cautious",
    title: "장기 효과에 대한 신중한 시각",
    body: "조기 영어 교육이 장기적인 영어 실력 격차로 이어지는지는 학계에서도 견해가 갈립니다. 가정에서의 지속적인 영어 노출 여부가 기관 선택보다 더 중요한 변수라는 의견도 많습니다.",
  },
];

// ── 흔한 실수 ───────────────────────────────────────────
export const COMMON_MISTAKES: MistakeItem[] = [
  { title: "효과 검증 없이 등록", body: "주변 권유나 분위기에 따라 등록하기보다, 아이의 성향과 가정의 영어 노출 환경을 먼저 점검하는 것이 좋습니다." },
  { title: "형제 비교로 인한 스트레스", body: "형제·자매를 같은 기준으로 비교하면 아이에게 부담이 될 수 있습니다. 개별 성향에 맞춘 선택이 중요합니다." },
  { title: "갑작스러운 전환 시 적응 문제", body: "영어유치원에서 일반 초등학교로 전환 시 학습 방식·교우 관계 적응에 시간이 필요할 수 있습니다." },
];

// ── 사교육비 절세·지원 제도 ─────────────────────────────
export const SUPPORT_PROGRAMS: SupportProgramRow[] = [
  { name: "누리과정 지원금", target: "국공립·민간유치원 재원 만 3~5세", amount: "월 약 28만~35만 원 (추정)", note: "영어유치원(학원 분류)은 대상 아닌 경우 다수" },
  { name: "유아학비 지원", target: "어린이집·유치원 재원 아동", amount: "기관 유형별 차등", note: "정식 인가 기관 기준" },
  { name: "교육비 세액공제", target: "취학 전 아동 학원비 일부", amount: "연 300만 원 한도 내 15%", note: "영어유치원도 학원비로 공제 가능한 경우 있음, 확인 필요" },
];

// ── FAQ ──────────────────────────────────────────────────
export const EKC_FAQ: EkcFaq[] = [
  {
    question: "영어유치원은 정부 지원금을 받을 수 있나요?",
    answer:
      "대부분의 영어유치원은 유치원이 아닌 영어학원으로 분류되어 누리과정·유아학비 지원금 대상이 아닙니다. 일부 영어유치원 형태의 유치원(정식 인가)만 지원금 대상이 될 수 있으므로 등록 전 기관 분류를 확인해야 합니다.",
  },
  {
    question: "영어유치원 효과는 실제로 있나요?",
    answer:
      "조기 영어 노출이 듣기·발음에 긍정적 영향을 줄 수 있다는 연구가 있지만, 장기적인 영어 실력 격차로 이어지는지는 학계에서도 견해가 갈립니다. 가정에서의 지속적인 영어 노출 여부가 더 중요한 변수라는 의견도 많습니다.",
  },
  {
    question: "영어유치원을 다니다 일반 초등학교로 가면 적응이 어렵나요?",
    answer:
      "영어유치원 졸업 후 일반 초등학교 진학 시 학습 방식·교우 관계 적응에 시간이 필요할 수 있습니다. 다만 대부분의 아이들은 1학기 내 적응하는 경우가 많습니다.",
  },
  {
    question: "영어유치원 대신 비용을 아끼면서 영어 노출을 늘리는 방법이 있나요?",
    answer:
      "화상영어·전화영어(월 10~20만 원), 영어 도서관·영어책 육아, 방과후 영어 프로그램 등을 활용하면 일반유치원 비용에 월 10~30만 원을 추가하는 수준으로 영어 노출을 늘릴 수 있습니다.",
  },
  {
    question: "지역에 따라 영어유치원 학비가 그렇게 차이가 나나요?",
    answer:
      "강남·서초 등 일부 지역은 프리미엄 영어유치원이 많아 월 200만 원을 넘는 경우가 있고, 수도권 외 지역은 월 90만~120만 원대가 일반적입니다. 같은 브랜드라도 지역에 따라 학비 차이가 클 수 있습니다.",
  },
];

// ── 관련 링크 ────────────────────────────────────────────
export const EKC_RELATED_LINKS: EkcLink[] = [
  { href: "/tools/daycare-vs-babysitter-cost-2026/", label: "어린이집 vs 가정보육 비용 비교 계산기" },
  { href: "/reports/baby-food-cost-comparison-2026/", label: "이유식 비교 2026" },
  { href: "/reports/baby-cost-guide-first-year/", label: "신생아부터 돌까지 육아비용 총정리" },
  { href: "/tools/child-tutoring-cost-calculator/", label: "자녀 사교육비 계산기" },
];

export const EKC_CTA_CARDS: EkcCtaCard[] = [
  {
    href: "/tools/daycare-vs-babysitter-cost-2026/",
    eyebrow: "비용 비교",
    title: "어린이집 vs 가정보육 비용 비교 계산기",
    description: "어린이집과 베이비시터·단축근무 가정보육 비용을 정부지원금까지 반영해 비교합니다.",
    cta: "비용 비교하기",
  },
  {
    href: "/tools/child-tutoring-cost-calculator/",
    eyebrow: "사교육비",
    title: "자녀 사교육비 계산기",
    description: "학원·과외 등 자녀 사교육비를 입력해 월·연간 총비용을 계산합니다.",
    cta: "사교육비 계산",
  },
  {
    href: "/reports/baby-food-cost-comparison-2026/",
    eyebrow: "이전 단계",
    title: "이유식 비교 2026",
    description: "직접 만들기 vs 시판 이유식 6개월 비용을 비교합니다.",
    cta: "이유식 비교 보기",
  },
];
