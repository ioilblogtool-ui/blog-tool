export type RetakeType = "COMMUTE" | "BOARDING";

export interface RetakePreset {
  type: RetakeType;
  label: string;
  monthlyTuitionDefault: number;
  extraFeeDefault: number; // 특강·교재비·단체복·모의고사 등 부대비용(기간 총액)
  note: string;
}

// 2026-01 기준 조사 종합
export const RETAKE_PRESETS: RetakePreset[] = [
  {
    type: "COMMUTE",
    label: "통학 종합반(재종반)",
    monthlyTuitionDefault: 2_000_000,
    extraFeeDefault: 10_000_000,
    note: "서울 재종반 월 수강료 200만원대. 교재비·특강비 포함 시 월 300만원 수준(10개월 기준 총 3,000만원대)",
  },
  {
    type: "BOARDING",
    label: "기숙학원",
    monthlyTuitionDefault: 3_500_000,
    extraFeeDefault: 5_000_000,
    note: "전국 평균 월 350만원(2026-01 기준, 숙식 포함 통합가). 선택 특강·모의고사·단체복 등은 별도 청구, 지방생 서울 기숙학원은 월 400만원 초과",
  },
];

export interface RetakeInput {
  type: RetakeType;
  monthlyTuition: number;
  months: number; // 기본 10개월(2~11월)
  extraFee: number;
}

export interface RetakeResult {
  tuitionTotal: number;
  extraTotal: number;
  grandTotal: number;
  monthlyAverage: number;
}

// public/scripts/retake-exam-cost-calculator-2026.js와 1:1 대응 로직 — 값 변경 시 양쪽 동기화 필수
// 향후 retake-vs-college-tuition-2026(2차)이 그대로 import해서 재사용할 순수 함수
export function calcRetakeCost(input: RetakeInput): RetakeResult {
  const tuitionTotal = input.monthlyTuition * input.months;
  const extraTotal = input.extraFee;
  const grandTotal = tuitionTotal + extraTotal;
  const monthlyAverage = input.months > 0 ? grandTotal / input.months : 0;
  return { tuitionTotal, extraTotal, grandTotal, monthlyAverage };
}

export const RETAKE_DEFAULT_INPUT: RetakeInput = {
  type: "COMMUTE",
  monthlyTuition: 2_000_000,
  months: 10,
  extraFee: 10_000_000,
};

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export const RETAKE_META = {
  slug: "retake-exam-cost-calculator-2026",
  title: "재수 비용 계산기 2026",
  seoTitle: "재수 비용 계산기 2026 | 학원비·생활비 1년 총액 바로 계산",
  seoDescription:
    "재수 유형(통학 종합반/기숙학원)과 기간을 입력하면 학원비·특강비를 합산한 1년 총비용을 바로 계산합니다. 대학 등록금과 비교도 가능합니다.",
  updatedAt: "2026-07-15",
  dataNote:
    "학원비 기본값은 2026년 1월 기준 조사된 통학 재종반·기숙학원 시세를 참고한 값이며, 학원·지역·선택 프로그램에 따라 실제 금액은 크게 달라질 수 있습니다. 이 계산 결과는 예산 계획을 위한 참고 자료입니다.",
};

export const RETAKE_FAQ: FaqItem[] = [
  {
    question: "재수학원 기숙형과 통학형 중 뭐가 더 비싼가요?",
    answer:
      "기숙학원이 더 비쌉니다. 통학 재종반은 10개월 기준 약 3,000만 원대인 반면, 기숙학원은 전국 평균 월 350만 원 기준으로도 10개월이면 4,000만 원 안팎입니다.",
  },
  {
    question: "재수 1년에 진짜 4,000만 원까지 드나요?",
    answer:
      "기숙학원을 선택하고 특강·모의고사 등 부대비용을 더하면 4,000만 원 안팎이 될 수 있습니다. 통학형은 이보다 낮은 3,000만 원대가 일반적입니다.",
  },
  {
    question: "기숙학원비에 숙식비가 포함돼 있나요?",
    answer:
      "네, 기숙학원의 월 비용은 보통 수업료와 숙식비가 통합된 가격입니다. 선택 특강, 모의고사, 단체복 등만 별도로 청구됩니다.",
  },
  {
    question: "지방에서 서울로 재수학원 다니면 얼마나 더 드나요?",
    answer:
      "지방 학생이 서울 기숙학원을 선택하면 월 비용이 400만 원을 넘는 경우가 많아 지역 기숙학원보다 부담이 커집니다.",
  },
  {
    question: "독학재수(독학기숙학원)도 이 계산기에 포함되나요?",
    answer:
      "독학기숙학원은 상대적으로 저렴한 편(월 230만 원대~)이라 기숙학원 유형의 월 수강료를 직접 낮춰 입력하면 근사할 수 있지만, 정확한 산정은 아닙니다.",
  },
  {
    question: "재수 비용과 대학 4년 등록금 중 뭐가 더 큰가요?",
    answer:
      "재수 1년 비용(3,000만~4,000만 원대)이 국공립대 4년 등록금(약 1,700만 원)보다 큰 경우가 많고, 사립대 4년 등록금(약 3,300만 원)과는 비슷하거나 더 클 수 있습니다. 대학 등록금 계산기에서 직접 비교해보세요.",
  },
];

export const RETAKE_SEO_CONTENT = {
  introTitle: "재수, 등록금보다 비쌀 수 있다는 걸 미리 계산해보세요",
  intro: [
    "재수를 고민할 때 가장 막막한 부분은 '진짜 얼마나 드는지' 감이 안 잡힌다는 점입니다. 언론에는 '등록금보다 비싼 재수학원비'라는 표현이 자주 등장하는데, 실제로 기숙학원은 2026년 1월 기준 전국 평균 월 350만 원으로 10개월이면 4,000만 원 안팎, 통학 재종반도 교재비·특강비를 포함하면 10개월에 3,000만 원대가 듭니다. 이 계산기는 재수 유형과 기간을 입력해 1년 총비용을 미리 가늠해볼 수 있게 합니다.",
    "이 계산기는 통학 종합반과 기숙학원 두 유형을 구분해 계산합니다. 두 유형 모두 '월 수강료 × 기간'에 특강·교재비·단체복·모의고사 같은 부대비용을 더하는 구조는 같지만, 기본값이 크게 다릅니다. 특히 기숙학원의 월 비용은 숙식이 포함된 통합가로 보도되기 때문에, 별도로 생활비를 더하면 이중 계산이 됩니다. 이 계산기는 이 점을 반영해 통합가 기준으로만 계산합니다.",
    "결과를 볼 때는 학원비 총액뿐 아니라 부대비용이 전체에서 차지하는 비중도 함께 보는 것이 좋습니다. 실제 재수종합반 납부 사례에서는 특강료·급식비 같은 부대비용이 전체 납부액의 30% 이상을 차지한 경우도 있어, 기본 수강료만 보고 예산을 짜면 실제 지출과 차이가 클 수 있습니다.",
    "이 계산기의 기본값은 2026년 1월 기준 조사된 시세를 참고한 값이며, 실제 학원·지역·선택 프로그램에 따라 금액은 크게 달라질 수 있습니다. 정확한 비용은 등록하려는 학원에 직접 문의해야 하며, 이 계산 결과는 예산 계획을 위한 참고 자료로만 활용하는 것이 좋습니다.",
  ],
  inputPoints: [
    "재수 유형(통학 종합반/기숙학원)을 선택하면 실제 조사된 월 수강료·부대비용 기본값이 자동으로 채워집니다.",
    "재수 기간을 조정하면 총비용과 월평균 비용이 함께 계산됩니다.",
    "결과를 대학 등록금 계산기와 비교해 재수와 진학 중 어느 쪽 부담이 더 큰지 가늠할 수 있습니다.",
  ],
  criteria: [
    "학원비 기본값은 2026년 1월 기준 조사된 통학 재종반·기숙학원 시세 참고치입니다.",
    "기숙학원 비용은 숙식 포함 통합가로 계산하며 별도 생활비를 더하지 않습니다.",
    "부대비용(특강·교재·단체복·모의고사 등)은 기간 전체 합계로 입력합니다.",
    "실제 비용은 학원·지역·선택 프로그램에 따라 이 계산 결과와 크게 다를 수 있습니다.",
  ],
};

export const RETAKE_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/tools/college-application-fee-calculator-2026/",
    label: "대입 원서비 계산기 2026",
    description: "수시·정시 지원 개수에 따른 전형료 총액을 계산합니다.",
  },
  {
    href: "/tools/university-cost-calculator-2026/",
    label: "대학 등록금 계산기 2026",
    description: "재수 대신 진학할 경우 대학 4년 실부담금을 계산합니다.",
  },
  {
    href: "/reports/retake-vs-college-tuition-2026/",
    label: "재수 vs 대학 등록금 2026",
    description: "재수 1년 비용과 대학 4년 등록금을 나란히 비교합니다.",
  },
  {
    href: "/tools/child-tutoring-cost-calculator/",
    label: "아이 사교육비 계산기",
    description: "재수 결정 전 참고할 수 있는 학년별 사교육비를 계산합니다.",
  },
];
