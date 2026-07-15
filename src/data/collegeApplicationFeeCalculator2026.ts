export type FeeTier = "LOW" | "AVERAGE" | "HIGH";

export interface FeeTierPreset {
  tier: FeeTier;
  label: string;
  feePerApplication: number;
  note: string;
}

// 0-1 확인값 종합 — 단일 확정 평균 없어 3단계 프리셋으로 제시
export const FEE_TIER_PRESETS: FeeTierPreset[] = [
  { tier: "LOW", label: "저가", feePerApplication: 30_000, note: "국공립대·서류전형 위주는 2만~3만원대가 일반적" },
  {
    tier: "AVERAGE",
    label: "평균(추정)",
    feePerApplication: 52_000,
    note: "2020년 전국 평균 4만 7,806원에 2026학년도 사립대 중심 인상률(약 9.0%)을 반영한 추정치",
  },
  { tier: "HIGH", label: "고가", feePerApplication: 105_000, note: "2024학년도 중앙대 1인당 평균 10만 5,242원 등 주요 사립대·실기 전형 사례" },
];

export const MAX_SUSI_COUNT = 6;
export const MAX_JEONGSI_COUNT = 3;

export interface AppFeeInput {
  susiCount: number;
  susiFee: number;
  jeongsiCount: number;
  jeongsiFee: number;
}

export interface AppFeeResult {
  susiTotal: number;
  jeongsiTotal: number;
  grandTotal: number;
}

// public/scripts/college-application-fee-calculator-2026.js와 1:1 대응 로직 — 값 변경 시 양쪽 동기화 필수
export function calcApplicationFee(input: AppFeeInput): AppFeeResult {
  const susiTotal = input.susiFee * input.susiCount;
  const jeongsiTotal = input.jeongsiFee * input.jeongsiCount;
  return { susiTotal, jeongsiTotal, grandTotal: susiTotal + jeongsiTotal };
}

export const APP_FEE_DEFAULT_INPUT: AppFeeInput = {
  susiCount: 6,
  susiFee: 52_000,
  jeongsiCount: 3,
  jeongsiFee: 52_000,
};

export interface AdmissionScheduleRow {
  label: string;
  period: string;
}

export const ADMISSION_SCHEDULE_2026: AdmissionScheduleRow[] = [
  { label: "2026학년도 수시 원서접수", period: "9월 8일(월)~12일(금) 중 대학별 3일 이상" },
  { label: "2026학년도 정시 원서접수", period: "2025-12-29~12-31 (3일간)" },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export const APP_FEE_META = {
  slug: "college-application-fee-calculator-2026",
  title: "대입 원서비 계산기 2026",
  seoTitle: "대입 원서비 계산기 2026 | 수시·정시 전형료 총액 바로 계산",
  seoDescription:
    "수시·정시 지원 개수와 대학별 전형료 구간을 입력하면 원서비 총액을 바로 계산합니다. 최대 수시 6개·정시 3개 기준.",
  updatedAt: "2026-07-15",
  dataNote:
    "전형료는 2020년 전국 평균(4만 7,806원)에 2026학년도 사립대 중심 인상률(약 9.0%)을 반영한 추정치이며, 대학·전형 유형별로 2만~12만원대까지 편차가 큽니다. 정확한 금액은 각 대학 모집요강에서 확인하세요.",
};

export const APP_FEE_FAQ: FaqItem[] = [
  {
    question: "수시는 몇 개까지 지원할 수 있나요?",
    answer: "최대 6개입니다. 수시 원서를 6개 모두 접수하면 전형료 총합이 가장 커집니다.",
  },
  {
    question: "정시는 몇 개까지 지원할 수 있나요?",
    answer: "가/나/다군 기준 최대 3개입니다.",
  },
  {
    question: "전형료가 가장 비싼 대학은 얼마나 하나요?",
    answer: "2024학년도 기준 중앙대가 1인당 평균 10만 5,242원으로 가장 높았습니다. 실기 전형은 12만 원대까지도 나옵니다.",
  },
  {
    question: "왜 전형료가 저가/평균/고가로 나뉘어 있나요?",
    answer: "국공립대 서류전형은 2만~3만 원대, 사립대·실기 포함 전형은 10만 원 이상까지 편차가 커서 단일 평균 대신 3단계로 제시합니다.",
  },
  {
    question: "수시 6개를 전부 최상위권 대학에 넣으면 얼마나 드나요?",
    answer:
      "고가 구간(10만 원대)으로 6개를 지원하면 60만 원 안팎까지 나올 수 있습니다. 실제로 최고가 대학 위주로 지원한 사례에서 46만 원대가 보도된 바 있습니다.",
  },
];

export const APP_FEE_SEO_CONTENT = {
  introTitle: "대입 원서비, 수시 6장이면 얼마나 나올까",
  intro: [
    "대입을 앞둔 수험생과 학부모가 자주 놓치는 지출이 원서 접수비입니다. 수시는 최대 6개, 정시는 가/나/다군 최대 3개까지 지원할 수 있는데, 대학마다 전형료가 2만 원대부터 12만 원대까지 크게 차이가 나서 어디에 지원하느냐에 따라 총액이 몇 배씩 벌어집니다. 이 계산기는 지원 개수와 전형료 구간을 입력해 원서비 총액을 바로 계산합니다.",
    "전형료는 2026학년도 들어 사립대를 중심으로 약 9.0% 인상됐습니다. 2020년 조사된 전국 평균 4만 7,806원에 이 인상률을 반영하면 5만 원대 초반 수준으로 추정되지만, 실제로는 국공립대 서류전형(2만~3만 원대)부터 주요 사립대·실기전형(10만 원 이상)까지 편차가 매우 커서 이 계산기는 저가·평균·고가 3단계 구간으로 나눠 제시합니다.",
    "결과를 볼 때는 수시와 정시를 따로 보는 것이 좋습니다. 수시는 최대 6장까지 쓸 수 있어 총액이 크게 불어날 수 있고, 정시는 3장으로 제한돼 있어 상대적으로 부담이 적습니다. 최상위권 대학 위주로 수시 6장을 채우면 총액이 60만 원 가까이 나올 수 있다는 점도 미리 알아두면 예산을 짜기 수월합니다.",
    "이 계산기의 전형료는 확정된 공식 평균이 아니라 여러 소스를 종합한 추정치입니다. 대학·전형 유형별 정확한 금액은 반드시 각 대학의 모집요강에서 확인해야 하며, 이 계산 결과는 예산 계획을 위한 참고 자료로만 활용하는 것이 좋습니다.",
  ],
  inputPoints: [
    "수시·정시 지원 개수를 입력하면 각각의 전형료 총액과 합계를 바로 계산합니다.",
    "저가/평균/고가 3단계 전형료 구간을 선택하거나 직접 금액을 입력할 수 있습니다.",
    "2026학년도 수시·정시 원서접수 일정을 함께 확인할 수 있습니다.",
  ],
  criteria: [
    "전형료 구간은 2020년 전국 평균에 2026학년도 인상률(약 9.0%)을 반영한 추정치입니다.",
    "수시 최대 지원 개수는 6개, 정시는 가/나/다군 기준 최대 3개입니다.",
    "실제 전형료는 대학·전형 유형에 따라 2만~12만원대까지 차이가 큽니다.",
    "정확한 금액은 각 대학 모집요강에서 확인해야 합니다.",
  ],
};

export const APP_FEE_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/tools/retake-exam-cost-calculator-2026/",
    label: "재수 비용 계산기 2026",
    description: "재수 유형·기간별 1년 총비용을 계산합니다.",
  },
  {
    href: "/tools/university-cost-calculator-2026/",
    label: "대학 등록금 계산기 2026",
    description: "합격 후 대학 4년 실부담금을 계산합니다.",
  },
  {
    href: "/reports/retake-vs-college-tuition-2026/",
    label: "재수 vs 대학 등록금 2026",
    description: "재수 1년 비용과 대학 4년 등록금을 나란히 비교합니다.",
  },
  {
    href: "/tools/child-tutoring-cost-calculator/",
    label: "아이 사교육비 계산기",
    description: "입시 준비 과정의 사교육비를 함께 확인합니다.",
  },
];
