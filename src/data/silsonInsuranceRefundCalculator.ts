export type SilsonGeneration = "gen1" | "gen2" | "gen3" | "gen4" | "custom";
export type VisitType = "outpatient" | "inpatient";
export type HospitalType = "clinic" | "generalHospital" | "tertiaryHospital" | "custom";

export interface SilsonGenerationPreset {
  id: SilsonGeneration;
  label: string;
  salePeriod: string;
  coveredCoinsuranceRate: number;
  nonCoveredCoinsuranceRate: number;
  specialNonCoveredCoinsuranceRate: number;
  outpatientDeductible: number;
  outpatientLimit: number;
  annualLimit: number;
  description: string;
  caution: string;
}

export interface SilsonRefundInput {
  generation: SilsonGeneration;
  visitType: VisitType;
  hospitalType: HospitalType;
  hasSpecialNonCoveredRider: boolean;
  coveredPatientPaid: number;
  nonCoveredGeneral: number;
  manualTherapy: number;
  nonCoveredInjection: number;
  mriMra: number;
  prescriptionCost: number;
  coveredCoinsuranceRate: number;
  nonCoveredCoinsuranceRate: number;
  specialNonCoveredCoinsuranceRate: number;
  outpatientDeductible: number;
  outpatientLimit: number;
  annualLimit: number;
  claimedThisYear: number;
  nonCoveredBenefitThisYear: number;
}

export interface SilsonRefundPreset {
  id: string;
  label: string;
  description: string;
  input: Partial<SilsonRefundInput>;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export const SIR_META = {
  title: "실손보험 환급액 계산기 | 병원비 영수증으로 예상 환급금 계산",
  description:
    "급여 본인부담금과 비급여 진료비를 입력하면 실손보험 세대별 자기부담금, 통원 공제, 연간 한도를 반영해 예상 환급액을 계산합니다.",
  updatedAt: "2026년 5월 기준",
} as const;

export const SIR_GENERATION_PRESETS: SilsonGenerationPreset[] = [
  {
    id: "gen1",
    label: "1세대",
    salePeriod: "2009년 9월 이전",
    coveredCoinsuranceRate: 0.1,
    nonCoveredCoinsuranceRate: 0.1,
    specialNonCoveredCoinsuranceRate: 0.1,
    outpatientDeductible: 5000,
    outpatientLimit: 300000,
    annualLimit: 50000000,
    description: "표준화 이전 상품으로 회사별 약관 차이가 큽니다.",
    caution: "보험증권 기준 직접 입력을 권장합니다.",
  },
  {
    id: "gen2",
    label: "2세대",
    salePeriod: "2009년 10월~2017년 3월",
    coveredCoinsuranceRate: 0.2,
    nonCoveredCoinsuranceRate: 0.2,
    specialNonCoveredCoinsuranceRate: 0.2,
    outpatientDeductible: 10000,
    outpatientLimit: 250000,
    annualLimit: 50000000,
    description: "표준화 실손으로 선택형 여부에 따라 자기부담률이 다를 수 있습니다.",
    caution: "선택형/표준형 여부를 확인하세요.",
  },
  {
    id: "gen3",
    label: "3세대",
    salePeriod: "2017년 4월~2021년 6월",
    coveredCoinsuranceRate: 0.2,
    nonCoveredCoinsuranceRate: 0.2,
    specialNonCoveredCoinsuranceRate: 0.3,
    outpatientDeductible: 10000,
    outpatientLimit: 250000,
    annualLimit: 50000000,
    description: "3대 비급여 특약 가입 여부가 중요합니다.",
    caution: "도수치료·비급여주사·MRI/MRA 특약을 확인하세요.",
  },
  {
    id: "gen4",
    label: "4세대",
    salePeriod: "2021년 7월 이후",
    coveredCoinsuranceRate: 0.2,
    nonCoveredCoinsuranceRate: 0.3,
    specialNonCoveredCoinsuranceRate: 0.3,
    outpatientDeductible: 30000,
    outpatientLimit: 200000,
    annualLimit: 50000000,
    description: "급여와 비급여가 분리되고 비급여 보험료 차등제가 적용됩니다.",
    caution: "비급여 보험금 누적액을 함께 확인하세요.",
  },
];

export const SIR_DEFAULT_INPUT: SilsonRefundInput = {
  generation: "gen4",
  visitType: "outpatient",
  hospitalType: "clinic",
  hasSpecialNonCoveredRider: true,
  coveredPatientPaid: 50000,
  nonCoveredGeneral: 0,
  manualTherapy: 0,
  nonCoveredInjection: 0,
  mriMra: 0,
  prescriptionCost: 0,
  coveredCoinsuranceRate: 0.2,
  nonCoveredCoinsuranceRate: 0.3,
  specialNonCoveredCoinsuranceRate: 0.3,
  outpatientDeductible: 30000,
  outpatientLimit: 200000,
  annualLimit: 50000000,
  claimedThisYear: 0,
  nonCoveredBenefitThisYear: 0,
};

export const SIR_PRESETS: SilsonRefundPreset[] = [
  {
    id: "mri-gen4",
    label: "4세대 MRI 통원",
    description: "MRI 60만 원 검사 후 예상 환급액을 확인합니다.",
    input: {
      generation: "gen4",
      visitType: "outpatient",
      hasSpecialNonCoveredRider: true,
      coveredPatientPaid: 0,
      mriMra: 600000,
    },
  },
  {
    id: "manual-gen3",
    label: "3세대 도수치료",
    description: "도수치료 12만 원, 3대 비급여 특약 기준입니다.",
    input: {
      generation: "gen3",
      visitType: "outpatient",
      hasSpecialNonCoveredRider: true,
      coveredPatientPaid: 0,
      manualTherapy: 120000,
    },
  },
  {
    id: "small-outpatient",
    label: "소액 통원",
    description: "급여 본인부담 1만 5천 원 청구 실익을 확인합니다.",
    input: {
      generation: "gen4",
      visitType: "outpatient",
      coveredPatientPaid: 15000,
    },
  },
  {
    id: "inpatient-surgery",
    label: "입원 수술비",
    description: "입원 진료비 급여 100만 원, 비급여 80만 원 예시입니다.",
    input: {
      generation: "gen2",
      visitType: "inpatient",
      coveredPatientPaid: 1000000,
      nonCoveredGeneral: 800000,
    },
  },
];

export const SIR_INFO_LINES = [
  "이 계산기는 입력한 병원비와 세대별 대표 자기부담률을 바탕으로 한 예상 계산입니다.",
  "실제 보험금은 가입한 보험회사, 약관, 특약, 면책사항, 의료기관 서류 심사 결과에 따라 달라질 수 있습니다.",
  "1세대·2세대 실손보험은 가입 시기와 회사별 약관 차이가 큽니다. 정확한 계산을 위해 보험증권 또는 보험회사 앱에서 자기부담률과 통원 한도를 확인하세요.",
  "도수치료·비급여 주사료·MRI/MRA는 3대 비급여 특약 가입 여부에 따라 보장 여부와 한도가 달라질 수 있습니다.",
];

export const SIR_FAQ: FaqItem[] = [
  {
    question: "이 계산기의 결과가 실제 보험금과 같나요?",
    answer:
      "아니요. 입력한 금액과 세대별 대표 자기부담률을 바탕으로 한 예상 계산입니다. 실제 보험금은 보험회사, 약관, 특약, 면책사항, 심사 결과에 따라 달라질 수 있습니다.",
  },
  {
    question: "병원 영수증에서 공단부담금도 입력해야 하나요?",
    answer:
      "아니요. 공단부담금은 국민건강보험공단이 부담한 금액이므로 계산기 입력 대상에서 제외합니다. 사용자가 실제 낸 급여 본인부담금과 비급여 금액을 입력하세요.",
  },
  {
    question: "통원 진료비가 적으면 환급액이 0원이 될 수도 있나요?",
    answer:
      "네. 통원은 자기부담률뿐 아니라 최소 공제금액이 적용될 수 있습니다. 병원비가 공제금액보다 작거나 비슷하면 예상 환급액이 0원일 수 있습니다.",
  },
  {
    question: "도수치료와 MRI는 왜 별도로 입력하나요?",
    answer:
      "3세대 이후 실손보험에서는 도수치료·체외충격파·증식치료, 비급여 주사료, MRI/MRA가 3대 비급여 특약으로 분리되어 한도와 자기부담률이 다르게 적용될 수 있기 때문입니다.",
  },
  {
    question: "4세대 실손은 비급여를 청구하면 보험료가 오르나요?",
    answer:
      "4세대 실손보험은 비급여 보험금 수령액에 따라 갱신 시 비급여 보험료가 할인 또는 할증될 수 있습니다. 실제 적용 여부와 금액은 보험회사 조회 화면에서 확인해야 합니다.",
  },
  {
    question: "1세대 실손도 계산할 수 있나요?",
    answer:
      "가능합니다. 다만 1세대 실손은 보험회사별 약관 차이가 크므로 계산기 기본값보다 보험증권의 자기부담률과 한도를 직접 입력하는 것이 좋습니다.",
  },
];

export const SIR_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/tools/year-end-tax-refund-calculator/",
    label: "연말정산 환급액 계산기",
    description: "의료비 세액공제와 연말정산 환급액을 함께 확인합니다.",
  },
  {
    href: "/tools/pregnancy-checkup-cost/",
    label: "임신 주수별 검사비 계산기",
    description: "산부인과 검사비와 바우처 차감액을 계산합니다.",
  },
  {
    href: "/tools/fetal-insurance-calculator/",
    label: "태아보험 보험료 계산기",
    description: "보험료 범위와 보장 수준을 함께 점검합니다.",
  },
  {
    href: "/tools/loan-refinancing-calculator/",
    label: "대출 갈아타기 계산기",
    description: "병원비처럼 큰 지출 이후 현금흐름도 같이 점검합니다.",
  },
];
