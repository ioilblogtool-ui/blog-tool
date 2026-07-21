export const HBC_META = {
  slug: "holiday-bonus-after-tax-calculator",
  title: "명절 상여금 실수령액 계산기",
  description:
    "설·추석 상여금과 떡값에서 세금이 얼마나 공제되는지 계산하세요. 연봉과 지급월을 반영해 추가 실수령액을 추정합니다.",
  seoTitle: "명절 상여금 실수령액 계산기 | 추석 떡값 세금·4대보험",
  seoDescription:
    "설·추석 상여금과 떡값에서 세금이 얼마나 공제되는지 계산하세요. 연봉, 지급월을 반영해 추가 실수령액을 추정하고 상품권 과세, 4대보험과 연말정산 기준도 확인할 수 있습니다.",
  updatedAt: "2026-07",
  dataNote:
    "이 계산기는 근로소득 간이세액표 전체와 상여금 원천징수 방식을 그대로 재현하지 않는 간이 추정 도구입니다. 소득세는 연봉 구간별 근사 세율을 적용한 참고값이며, 국민연금·건강보험은 지급월에 곧바로 반영되지 않을 수 있어 기본값을 반영 안 함으로 둡니다. 실제 원천징수액과 연말정산 결과는 회사 급여 시스템에 따라 달라집니다.",
};

export type InsuranceReflectionMode = "notReflected" | "immediate";

export interface HolidayBonusInput {
  taxYear: number;
  bonusGrossAmount: number;
  annualSalary: number;
  paymentMonth: number;
  includeLocalIncomeTax: boolean;
  pensionHealthReflection: InsuranceReflectionMode;
  incomeTaxMode: "simple" | "conservative";
}

export interface HolidayBonusResult {
  incomeTaxRate: number;
  incomeTax: number;
  localIncomeTax: number;
  nationalPension: number;
  healthInsurance: number;
  longTermCareInsurance: number;
  employmentInsurance: number;
  totalDeduction: number;
  netAmount: number;
  netRate: number;
  scenarioTaxOnly: number;
  scenarioTaxPlusEmployment: number;
  scenarioAllImmediate: number;
}

export const HBC_DEFAULT_INPUT: HolidayBonusInput = {
  taxYear: 2026,
  bonusGrossAmount: 500_000,
  annualSalary: 45_000_000,
  paymentMonth: 9,
  includeLocalIncomeTax: true,
  pensionHealthReflection: "notReflected",
  incomeTaxMode: "simple",
};

// bonus-after-tax-calculator.js와 동일한 값 — 두 계산기의 세율·요율은 항상 함께 갱신한다.
export const HBC_INSURANCE_CONFIG = {
  year: 2026,
  nationalPensionEmployeeRate: 4.75,
  nationalPensionMonthlyIncomeMin: 400_000,
  nationalPensionMonthlyIncomeMax: 6_370_000,
  healthInsuranceEmployeeRate: 3.595,
  longTermCareRateOnHealthInsurance: 13.14,
  employmentInsuranceEmployeeRate: 0.9,
};

export const HBC_TAX_BRACKETS = [
  { minAnnualSalary: 0, maxAnnualSalary: 50_000_000, baseWithholdingRate: 8, conservativeRate: 10, label: "5천만 원 이하" },
  { minAnnualSalary: 50_000_000, maxAnnualSalary: 80_000_000, baseWithholdingRate: 12, conservativeRate: 15, label: "5천만~8천만 원" },
  { minAnnualSalary: 80_000_000, maxAnnualSalary: 120_000_000, baseWithholdingRate: 18, conservativeRate: 22, label: "8천만~1.2억 원" },
  { minAnnualSalary: 120_000_000, maxAnnualSalary: 200_000_000, baseWithholdingRate: 24, conservativeRate: 28, label: "1.2억~2억 원" },
  { minAnnualSalary: 200_000_000, maxAnnualSalary: null, baseWithholdingRate: 30, conservativeRate: 35, label: "2억 원 초과" },
];

export function getTaxBracket(annualSalary: number) {
  return (
    HBC_TAX_BRACKETS.find(
      (b) => annualSalary >= b.minAnnualSalary && (b.maxAnnualSalary === null || annualSalary < b.maxAnnualSalary)
    ) || HBC_TAX_BRACKETS[0]
  );
}

function calcPensionHealthImmediate(bonusGrossAmount: number) {
  const pensionBase = Math.min(
    Math.max(bonusGrossAmount, HBC_INSURANCE_CONFIG.nationalPensionMonthlyIncomeMin),
    HBC_INSURANCE_CONFIG.nationalPensionMonthlyIncomeMax
  );
  const nationalPension = (pensionBase * HBC_INSURANCE_CONFIG.nationalPensionEmployeeRate) / 100;
  const healthInsurance = (bonusGrossAmount * HBC_INSURANCE_CONFIG.healthInsuranceEmployeeRate) / 100;
  const longTermCareInsurance = (healthInsurance * HBC_INSURANCE_CONFIG.longTermCareRateOnHealthInsurance) / 100;
  return { nationalPension, healthInsurance, longTermCareInsurance };
}

export function calcHolidayBonus(input: HolidayBonusInput): HolidayBonusResult {
  const bracket = getTaxBracket(input.annualSalary);
  const incomeTaxRate = input.incomeTaxMode === "conservative" ? bracket.conservativeRate : bracket.baseWithholdingRate;
  const incomeTax = (input.bonusGrossAmount * incomeTaxRate) / 100;
  const localIncomeTax = input.includeLocalIncomeTax ? incomeTax * 0.1 : 0;
  const employmentInsurance = (input.bonusGrossAmount * HBC_INSURANCE_CONFIG.employmentInsuranceEmployeeRate) / 100;

  const immediate = calcPensionHealthImmediate(input.bonusGrossAmount);
  const active = input.pensionHealthReflection === "immediate"
    ? immediate
    : { nationalPension: 0, healthInsurance: 0, longTermCareInsurance: 0 };

  const totalDeduction = incomeTax + localIncomeTax + employmentInsurance + active.nationalPension + active.healthInsurance + active.longTermCareInsurance;
  const netAmount = Math.max(input.bonusGrossAmount - totalDeduction, 0);

  const scenarioTaxOnly = Math.max(input.bonusGrossAmount - incomeTax - localIncomeTax, 0);
  const scenarioTaxPlusEmployment = Math.max(scenarioTaxOnly - employmentInsurance, 0);
  const scenarioAllImmediate = Math.max(
    scenarioTaxPlusEmployment - immediate.nationalPension - immediate.healthInsurance - immediate.longTermCareInsurance,
    0
  );

  return {
    incomeTaxRate,
    incomeTax,
    localIncomeTax,
    nationalPension: active.nationalPension,
    healthInsurance: active.healthInsurance,
    longTermCareInsurance: active.longTermCareInsurance,
    employmentInsurance,
    totalDeduction,
    netAmount,
    netRate: input.bonusGrossAmount > 0 ? (netAmount / input.bonusGrossAmount) * 100 : 0,
    scenarioTaxOnly,
    scenarioTaxPlusEmployment,
    scenarioAllImmediate,
  };
}

export interface HolidayBonusPreset {
  id: string;
  label: string;
  summary: string;
  input: Partial<HolidayBonusInput>;
}

export const HBC_PRESETS: HolidayBonusPreset[] = [
  { id: "tteok-20", label: "소액 떡값 20만 원", summary: "연봉 4,000만원 예시", input: { bonusGrossAmount: 200_000, annualSalary: 40_000_000 } },
  { id: "bonus-50", label: "일반 명절상여 50만 원", summary: "연봉 4,500만원 예시", input: { bonusGrossAmount: 500_000, annualSalary: 45_000_000 } },
  { id: "bonus-100", label: "대기업 명절상여 100만 원", summary: "연봉 5,500만원 예시", input: { bonusGrossAmount: 1_000_000, annualSalary: 55_000_000 } },
  { id: "bonus-200", label: "기본급 50% 상여 200만 원", summary: "연봉 7,000만원 예시", input: { bonusGrossAmount: 2_000_000, annualSalary: 70_000_000 } },
  { id: "bonus-500", label: "특별 명절격려금 500만 원", summary: "연봉 9,000만원 예시", input: { bonusGrossAmount: 5_000_000, annualSalary: 90_000_000, incomeTaxMode: "conservative" } },
];

export interface GiftTypeRow {
  giftType: string;
  treatment: string;
}

export const HBC_GIFT_TYPE_TABLE: GiftTypeRow[] = [
  { giftType: "현금 명절 상여금", treatment: "과세 근로소득" },
  { giftType: "계좌로 지급한 떡값", treatment: "과세 근로소득" },
  { giftType: "백화점·온라인 상품권", treatment: "과세 근로소득 가능성 높음" },
  { giftType: "복지포인트", treatment: "운영 방식에 따라 판단" },
  { giftType: "회사 공통 현물 선물", treatment: "지급 성격·회계처리에 따라 확인 필요" },
  { giftType: "거래처에서 받은 선물", treatment: "회사 급여와 별개의 이슈" },
];

export interface PayComparisonRow {
  category: string;
  regularPay: string;
  holidayBonus: string;
}

export const HBC_PAY_COMPARISON_TABLE: PayComparisonRow[] = [
  { category: "소득 구분", regularPay: "근로소득", holidayBonus: "근로소득" },
  { category: "지급 시 세금", regularPay: "간이세액표 적용", holidayBonus: "상여 원천징수 방식 적용" },
  { category: "최종 세금", regularPay: "연말정산에서 확정", holidayBonus: "연말정산에서 함께 확정" },
  { category: "지급월 공제액", regularPay: "비교적 일정", holidayBonus: "지급 방식에 따라 변동 가능" },
  { category: "4대보험", regularPay: "보수 기준", holidayBonus: "보험별 반영 방식 차이" },
];

export interface BonusTypeRow {
  aspect: string;
  regularBonus: string;
  oneTimeBonus: string;
}

export const HBC_BONUS_TYPE_TABLE: BonusTypeRow[] = [
  { aspect: "지급 근거", regularBonus: "취업규칙·단체협약·근로계약", oneTimeBonus: "회사 재량 가능" },
  { aspect: "지급 주기", regularBonus: "설·추석 등 정기적", oneTimeBonus: "비정기적" },
  { aspect: "임금성", regularBonus: "인정 가능성 높음", oneTimeBonus: "지급 조건에 따라 판단" },
  { aspect: "통상임금", regularBonus: "정기성·일률성 등 충족 시 포함 가능", oneTimeBonus: "포함 가능성 상대적으로 낮음" },
  { aspect: "퇴직금 평균임금", regularBonus: "임금으로 인정되면 반영 가능", oneTimeBonus: "임금성 여부에 따라 다름" },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const HBC_FAQ: FaqItem[] = [
  {
    question: "명절 상여금은 몇 퍼센트나 떼나요?",
    answer:
      "모든 근로자에게 동일한 공제율이 적용되는 것은 아닙니다. 상여금 규모, 월급, 부양가족 수, 상여 지급 대상 기간과 회사의 원천징수 방식에 따라 달라집니다. 연봉 구간만으로 상여금에 고정된 세율을 적용하는 것은 이 계산기의 간이 추정 방식이며, 실제 원천징수와 다를 수 있습니다.",
  },
  {
    question: "상여금이 적은데 세금이 많이 나온 이유는?",
    answer:
      "상여 지급월의 월급과 상여가 합산되거나, 회사가 상여금 원천징수 방식을 적용하면서 평소보다 소득세가 크게 표시될 수 있습니다. 다만 원천징수액은 최종 세금이 아니며 연말정산에서 연간 총급여와 공제항목을 기준으로 다시 정산됩니다.",
  },
  {
    question: "상여 지급월에 국민연금도 늘어나나요?",
    answer:
      "반드시 즉시 늘어나는 것은 아닙니다. 국민연금은 신고된 기준소득월액을 기준으로 매월 부과되므로, 일회성 상여 지급월에 상여금의 일정 비율이 바로 추가 공제되지 않을 수 있습니다. 이 계산기는 기본값을 반영 안 함으로 두고 있습니다.",
  },
  {
    question: "건강보험료는 상여금에 바로 붙나요?",
    answer:
      "회사의 보수월액 신고 방식에 따라 지급월에 반영되거나 이후 보수총액 정산에서 반영될 수 있습니다. 건강보험은 보수총액 신고를 바탕으로 실제 보수와 납부 보험료를 정산하므로, 실제 급여명세서에서는 상여금의 근로자 부담률만큼 정확히 즉시 공제되지 않을 수 있습니다.",
  },
  {
    question: "상품권도 세금을 내나요?",
    answer:
      "회사가 근로자에게 명절 보상으로 지급하는 상품권은 일반적으로 경제적 이익에 해당해 과세 근로소득으로 처리될 가능성이 높습니다. 실제 처리는 회사 급여명세서에서 확인하는 것이 정확합니다.",
  },
  {
    question: "명절 상여금도 연말정산에 포함되나요?",
    answer:
      "네. 과세 근로소득으로 처리된 명절 상여금은 해당 연도의 총급여에 포함되며, 월별로 원천징수한 세금은 연말정산에서 최종 정산됩니다.",
  },
  {
    question: "명절 상여금도 퇴직금에 포함되나요?",
    answer:
      "취업규칙이나 근로계약에 따라 정기적·일률적으로 지급되고 근로의 대가로 인정되는 명절 상여금은 평균임금이나 통상임금 판단에 영향을 줄 수 있습니다. 단순히 명칭이 '떡값'이라는 이유만으로 포함 또는 제외되는 것은 아닙니다.",
  },
  {
    question: "이 계산기와 성과급 계산기 결과가 다른 이유는 무엇인가요?",
    answer:
      "계산 구조는 비슷하지만, 이 계산기는 명절 상여 스케일(수십만~수백만 원)에 맞춘 프리셋과 지급월 기본값(9월)을 사용하고, 국민연금·건강보험 기본값을 반영 안 함으로 둡니다. 큰 금액의 성과급은 성과급 세후 실수령액 계산기에서 계산하는 것이 더 적합합니다.",
  },
];

export interface RelatedLink {
  href: string;
  label: string;
}

export const HBC_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/bonus-after-tax-calculator/", label: "성과급 세후 실수령액 계산기" },
  { href: "/tools/salary/", label: "연봉 실수령액 계산기" },
  { href: "/tools/hometown-trip-cost-calculator/", label: "귀성길 교통수단 비교 계산기" },
];

export const HBC_SEO_CONTENT = {
  introTitle: "명절 상여금, 세금은 어떻게 계산되나요?",
  intro: [
    "현금으로 지급되는 명절 상여금과 떡값은 일반적으로 과세 근로소득에 포함됩니다. 다만 소득세는 상여금에 고정 세율을 곱하는 방식이 아니며, 지급월 급여, 부양가족 수, 상여금 지급 대상 기간과 회사의 원천징수 방식에 따라 달라집니다.",
    "국민연금과 건강보험도 명절 상여금에 보험료율을 단순히 곱한 금액이 지급월에 바로 추가 공제되는 것은 아닙니다. 국민연금은 기준소득월액, 건강보험은 보수월액과 보수총액 정산 방식에 따라 실제 공제 시점과 금액이 달라질 수 있습니다.",
    "이 계산기는 세금만 반영한 결과와 4대보험을 함께 반영한 결과를 구분해서 보여주는 간이 추정 도구입니다. 최종 원천징수액은 회사 급여 시스템이 우선하며, 연간 소득세는 연말정산에서 확정됩니다.",
  ],
  criteria: [
    "소득세는 연봉 구간별 근사 세율을 상여금에 적용한 간이 추정치이며, 실제 근로소득 간이세액표·누적 정산 방식과 다를 수 있습니다.",
    "국민연금·건강보험·장기요양보험은 기본값을 반영 안 함으로 두며, \"즉시 반영 추정\"으로 전환하면 상여금 비율만큼 단순 계산합니다.",
    "고용보험은 보수에 비례해 추가 공제될 수 있어 항상 계산에 반영합니다.",
  ],
};
