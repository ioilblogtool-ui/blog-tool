export type ResidentTaxpayerType = "individual" | "individualBusiness" | "corporation";
export type ResidentCorporationType = "general" | "other";

export interface ResidentTaxInput {
  taxpayerType: ResidentTaxpayerType;
  // 개인분
  individualBaseTax: number;
  isIndividualExempt: boolean;
  // 개인사업자 사업소분 대상 판정
  isVatExempt: boolean;
  vatBase: number;
  totalRevenue: number;
  // 법인 사업소분
  corporationType: ResidentCorporationType;
  capitalAmount: number;
  // 사업소 공통(개인사업자·법인)
  businessFloorArea: number;
  isPollutionFacility: boolean;
  // 종업원분
  last12MonthsPayroll: number;
  currentMonthPayroll: number;
  dueMonth: number;
  dueDay: number;
}

export interface ResidentTaxResult {
  individualBaseTax: number;
  individualEduTax: number;
  individualTotal: number;
  isBusinessSubject: boolean;
  businessBasicTax: number;
  isFloorTaxApplied: boolean;
  businessFloorTax: number;
  businessEduTax: number;
  businessTotal: number;
  monthlyAveragePayroll: number;
  isEmployeeTaxTarget: boolean;
  employeeTax: number;
  totalTax: number;
  daysUntilDue: number;
  dueLabel: string;
  statusLabel: string;
}

export const RESIDENT_TAX_META = {
  slug: "resident-tax-calculator-2026",
  title: "주민세 계산기 2026",
  seoTitle: "주민세 계산기 2026 | 개인분·사업소분·종업원분 바로 계산",
  seoDescription:
    "과세표준액·자본금·연면적·급여총액을 입력하면 개인분·사업소분·종업원분 예상 세액과 지방교육세를 바로 계산합니다. 계산 과정과 신고 대상 판정 포함.",
  updatedAt: "2026-07-23",
  dataNote:
    "사업소분 기본세액은 개인사업자 5만원, 법인은 자본금 구간별 5만~20만원이 표준세율입니다. 기본세액의 25%가 지방교육세로 추가되고, 사업소 연면적이 330㎡를 초과하면 초과분이 아닌 전체 연면적에 세액을 적용합니다. 실제 세액은 지자체 조례와 고지서·위택스 신고 결과가 우선합니다.",
};

export const RESIDENT_TAX_DEFAULT_INPUT: ResidentTaxInput = {
  taxpayerType: "individualBusiness",
  individualBaseTax: 4_800,
  isIndividualExempt: false,
  isVatExempt: false,
  vatBase: 100_000_000,
  totalRevenue: 100_000_000,
  corporationType: "general",
  capitalAmount: 500_000_000,
  businessFloorArea: 120,
  isPollutionFacility: false,
  last12MonthsPayroll: 0,
  currentMonthPayroll: 0,
  dueMonth: 8,
  dueDay: 31,
};

export const RESIDENT_TAX_PRESETS = [
  {
    id: "individual",
    label: "일반 개인",
    summary: "세대주 개인분+지방교육세",
    input: {
      taxpayerType: "individual",
      individualBaseTax: 4_800,
      isIndividualExempt: false,
      vatBase: 0,
      totalRevenue: 0,
      businessFloorArea: 0,
      last12MonthsPayroll: 0,
      currentMonthPayroll: 0,
    },
  },
  {
    id: "smallBusiness",
    label: "소규모 개인사업자",
    summary: "과세표준 1억·120㎡",
    input: {
      taxpayerType: "individualBusiness",
      isVatExempt: false,
      vatBase: 100_000_000,
      totalRevenue: 100_000_000,
      businessFloorArea: 120,
      isPollutionFacility: false,
      last12MonthsPayroll: 0,
      currentMonthPayroll: 0,
    },
  },
  {
    id: "midBusiness",
    label: "중형 사업장",
    summary: "개인사업자·400㎡",
    input: {
      taxpayerType: "individualBusiness",
      isVatExempt: false,
      vatBase: 100_000_000,
      totalRevenue: 100_000_000,
      businessFloorArea: 400,
      isPollutionFacility: false,
      last12MonthsPayroll: 0,
      currentMonthPayroll: 0,
    },
  },
  {
    id: "corporation",
    label: "법인 사업소",
    summary: "자본금 40억·500㎡",
    input: {
      taxpayerType: "corporation",
      corporationType: "general",
      capitalAmount: 4_000_000_000,
      businessFloorArea: 500,
      isPollutionFacility: false,
      last12MonthsPayroll: 2_400_000_000,
      currentMonthPayroll: 200_000_000,
    },
  },
];

export const RESIDENT_TAX_RULES = [
  { label: "개인분", period: "과세기준일 7월 1일 · 8월 16일~31일 납부", target: "매년 7월 1일 현재 주소를 둔 개인", note: "조례로 정한 정액+지방교육세" },
  { label: "사업소분(개인사업자)", period: "과세기준일 7월 1일 · 8월 1일~31일 신고·납부", target: "직전 연도 과세표준액·총수입금액 8천만원 이상", note: "기본세액 5만원+면적 세액" },
  { label: "사업소분(법인)", period: "과세기준일 7월 1일 · 8월 1일~31일 신고·납부", target: "사업소를 둔 법인", note: "자본금별 기본세액+면적 세액" },
  { label: "종업원분", period: "매월분 다음 달 10일까지 신고·납부", target: "최근 12개월 월평균 급여 1억 8천만원 초과 사업주", note: "해당 월 급여총액의 0.5%" },
];

function getCorporationBasicTax(capitalAmount: number, corporationType: ResidentCorporationType): number {
  if (corporationType === "other") return 50_000;
  if (capitalAmount > 5_000_000_000) return 200_000;
  if (capitalAmount > 3_000_000_000) return 100_000;
  return 50_000;
}

export function calcResidentTax(input: ResidentTaxInput, today = new Date("2026-07-23T00:00:00+09:00")): ResidentTaxResult {
  const isIndividual = input.taxpayerType === "individual";
  const isIndividualBusiness = input.taxpayerType === "individualBusiness";
  const isCorporation = input.taxpayerType === "corporation";

  const individualBaseTax = isIndividual && !input.isIndividualExempt ? input.individualBaseTax : 0;
  const individualEduTax = Math.round(individualBaseTax * 0.25);
  const individualTotal = individualBaseTax + individualEduTax;

  const revenueBase = input.isVatExempt ? input.totalRevenue : input.vatBase;
  const isIndividualBusinessTaxable = isIndividualBusiness && revenueBase >= 80_000_000;
  const isBusinessSubject = isCorporation || isIndividualBusinessTaxable;

  const businessBasicTax = isBusinessSubject
    ? isCorporation
      ? getCorporationBasicTax(input.capitalAmount, input.corporationType)
      : 50_000
    : 0;

  const isFloorTaxApplied = isBusinessSubject && input.businessFloorArea > 330;
  const floorRate = input.isPollutionFacility ? 500 : 250;
  const businessFloorTax = isFloorTaxApplied ? Math.round(input.businessFloorArea * floorRate) : 0;
  const businessEduTax = Math.round(businessBasicTax * 0.25);
  const businessTotal = businessBasicTax + businessFloorTax + businessEduTax;

  const monthlyAveragePayroll = !isIndividual ? input.last12MonthsPayroll / 12 : 0;
  const isEmployeeTaxTarget = monthlyAveragePayroll > 180_000_000;
  const employeeTax = isEmployeeTaxTarget ? Math.round(input.currentMonthPayroll * 0.005) : 0;

  const totalTax = individualTotal + businessTotal + employeeTax;
  const dueDate = new Date(Date.UTC(2026, input.dueMonth - 1, input.dueDay, 15));
  const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / 86_400_000);

  return {
    individualBaseTax,
    individualEduTax,
    individualTotal,
    isBusinessSubject,
    businessBasicTax,
    isFloorTaxApplied,
    businessFloorTax,
    businessEduTax,
    businessTotal,
    monthlyAveragePayroll,
    isEmployeeTaxTarget,
    employeeTax,
    totalTax,
    daysUntilDue,
    dueLabel: `2026년 ${input.dueMonth}월 ${input.dueDay}일`,
    statusLabel: daysUntilDue >= 0 ? `마감까지 ${daysUntilDue}일` : "납부기한 경과",
  };
}

export const RESIDENT_TAX_FAQ = [
  {
    question: "개인사업자는 개인분과 사업소분을 모두 내나요?",
    answer:
      "가능합니다. 개인분은 주소지를 기준으로 부과되고 사업소분은 사업장과 사업 규모를 기준으로 부과됩니다. 세대주인 개인사업자가 직전 연도 부가가치세 과세표준액 또는 총수입금액 기준을 충족하면 개인분과 사업소분 납세의무가 각각 생길 수 있습니다.",
  },
  {
    question: "매출이 8천만원 미만인 개인사업자도 사업소분을 내나요?",
    answer:
      "직전 연도 부가가치세 과세표준액이 8천만원 미만인 개인사업자는 일반적으로 사업소분 기본세액 납세 대상에서 제외됩니다. 부가가치세 면세사업자는 과세표준 대신 총수입금액을 기준으로 판단합니다.",
  },
  {
    question: "사업장이 330㎡이면 면적 세액이 발생하나요?",
    answer:
      "330㎡ 이하라면 일반적으로 연면적 세액이 발생하지 않습니다. 330㎡를 초과하면 초과 면적만이 아니라 사업소 전체 연면적에 ㎡당 250원(오염물질 배출 사업소는 500원)을 적용합니다.",
  },
  {
    question: "공용면적도 사업소 연면적에 포함되나요?",
    answer:
      "원칙적으로 공용면적을 포함합니다. 다만 기숙사, 구내식당, 휴게실 등 종업원의 보건·후생에 직접 사용되는 일부 시설은 과세면적에서 제외될 수 있어 관할 지자체 확인이 필요합니다.",
  },
  {
    question: "지방교육세는 어떻게 계산하나요?",
    answer:
      "개인분 주민세 본세와 사업소분 기본세액의 25%가 지방교육세로 부과됩니다. 사업소분의 연면적 세액에는 지방교육세를 다시 곱하지 않습니다.",
  },
  {
    question: "종업원분 기준의 1억 8천만원에 이번 달 급여만 넣나요?",
    answer:
      "아닙니다. 납세 대상 여부는 최근 12개월 급여총액의 월평균으로 판단합니다. 대상이 되는 경우 실제 납부액은 해당 월에 지급한 급여총액의 0.5%로 계산합니다.",
  },
  {
    question: "종업원 급여총액에 비과세 식대도 포함되나요?",
    answer:
      "일반적으로 소득세법상 비과세 대상 급여는 종업원분 급여총액에서 제외됩니다. 급여 항목별 포함 여부가 불명확하다면 세무 담당자나 관할 지방자치단체에 확인해야 합니다.",
  },
  {
    question: "사업소가 여러 지역에 있으면 한 번만 신고하나요?",
    answer:
      "사업소분은 사업소 소재지를 기준으로 하므로, 여러 지방자치단체에 사업소가 있다면 사업소별로 관할 지방자치단체에 각각 신고해야 할 수 있습니다.",
  },
  {
    question: "휴업 중인 사업장도 내야 하나요?",
    answer:
      "과세기준일 현재 1년 이상 계속 휴업 중인 사업자는 사업소분 대상에서 제외될 수 있습니다. 사업자등록 상태만이 아니라 실제 휴업기간과 관할 지방자치단체 판단을 확인해야 합니다.",
  },
];

export const RESIDENT_TAX_SEO_CONTENT = {
  introTitle: "주민세, 개인분·사업소분·종업원분을 나눠 봐야 합니다",
  intro: [
    "주민세는 개인분, 사업소분, 종업원분으로 구분됩니다. 개인분은 매년 7월 1일 현재 주소를 둔 개인에게 고지되며, 사업소분은 사업소를 둔 일정 규모 이상의 개인사업자와 법인이 신고·납부합니다. 사업소분은 기본세액, 사업소 연면적 세액, 기본세액의 25%인 지방교육세를 합산해 계산합니다. 종업원분은 최근 12개월 급여총액의 월평균이 1억 8천만원을 초과하는 사업장이 해당 월 급여총액의 0.5%를 신고·납부합니다.",
    "이 계산기는 일반 개인, 개인사업자, 법인 사업소를 선택해 2026년 예상 주민세를 계산합니다. 개인분은 본세와 지방교육세를 함께 표시하고, 사업소분은 직전 연도 매출 기준(개인사업자) 또는 자본금 구간(법인)에 따라 기본세액을 자동으로 판정합니다. 사업소 연면적이 330㎡를 초과하면 전체 연면적 기준으로 면적 세액을 계산하고, 종업원분은 최근 12개월 급여총액과 해당 월 급여총액을 나눠 입력해 대상 여부와 실제 납부액을 함께 보여줍니다.",
    "개인분 세액과 사업소분 세율은 지방자치단체 조례, 사업자 유형, 법인 자본금, 사업소 면적 및 감면 여부에 따라 달라질 수 있습니다. 계산 결과는 예상액이며 실제 고지서, 위택스 신고 결과와 관할 지방자치단체 안내가 우선합니다.",
  ],
  criteria: [
    "사업소분 기본세액은 개인사업자 5만원, 법인은 자본금 구간별 5만~20만원을 표준세율로 적용합니다.",
    "사업소 연면적이 330㎡를 초과하면 초과분이 아닌 전체 연면적에 ㎡당 250원(오염물질 배출 사업소는 500원)을 적용합니다.",
    "종업원분은 최근 12개월 급여총액의 월평균이 1억 8천만원을 초과할 때만 해당 월 급여총액의 0.5%를 적용합니다.",
    "개인분과 사업소분 기본세액에는 기본세액의 25%에 해당하는 지방교육세를 더합니다.",
    "실제 세액은 지자체 조례, 감면 대상 여부, 위택스 신고 결과에 따라 달라질 수 있습니다.",
  ],
  inputPoints: [
    "개인분 주민세와 지방교육세를 포함한 예상 고지액을 확인할 수 있습니다.",
    "개인사업자의 매출 기준(8천만원)에 따른 사업소분 대상 여부를 판정합니다.",
    "법인의 자본금 구간별 사업소분 기본세액을 확인할 수 있습니다.",
    "사업소 연면적 330㎡ 초과 여부와 면적 세액을 계산합니다.",
    "종업원분 주민세 대상 여부와 해당 월 예상 세액을 확인할 수 있습니다.",
    "2026년 신고·납부 기한과 납부 방법을 함께 확인할 수 있습니다.",
  ],
  prepItems: [
    "주민세 개인분 고지서 또는 거주지역 정보",
    "직전 연도 부가가치세 과세표준액(면세사업자는 총수입금액)",
    "법인 자본금 또는 출자금",
    "사업소 전체 연면적(㎡)",
    "오염물질 배출 사업소 해당 여부",
    "최근 12개월 급여총액",
    "신고 대상 월의 실제 지급 급여총액",
  ],
};

export const RESIDENT_TAX_RELATED_LINKS = [
  { href: "/tools/apartment-holding-tax/", label: "아파트 보유세 계산기", description: "재산세·종부세 부담을 함께 확인합니다." },
  { href: "/reports/property-tax-payment-2026/", label: "재산세 납부기간 2026", description: "7월·9월 지방세 납부 일정을 정리합니다." },
  { href: "/tools/four-insurance-calculator/", label: "4대보험 계산기", description: "급여에서 빠지는 공제액을 확인합니다." },
];
