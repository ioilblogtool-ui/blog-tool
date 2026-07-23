export type PropertyTaxMode = "july" | "house" | "land" | "manual";
export type JulyInputBasis = "baseTax" | "totalPayment";
export type LandTaxType = "aggregate" | "separate" | "specialGeneral" | "specialHighRate";

export interface PropertyTaxSeptemberInput {
  mode: PropertyTaxMode;
  julyHousingAmount: number;
  julyInputBasis: JulyInputBasis;
  paidAllInJuly: boolean;
  includeLandTax: boolean;
  landTaxType: LandTaxType;
  landTaxBase: number;
  housingPublicPrice: number;
  fairMarketValueRatio: number;
  useSingleHomeSpecialRate: boolean;
  localEducationTax: number;
  regionalResourceFacilityTax: number;
  manualHousingTax: number;
  manualLandTax: number;
  taxCreditAmount: number;
}

export interface PropertyTaxSeptemberResult {
  septemberTotal: number;
  septemberHousingTax: number;
  landPropertyTax: number;
  estimatedAnnualHousingTax: number;
  housingTaxBase: number;
  julyComparisonAmount: number;
  localEducationTax: number;
  regionalResourceFacilityTax: number;
  taxCreditAmount: number;
  dueDateLabel: string;
  modeLabel: string;
  estimateLevel: "simple" | "estimated" | "manual";
  insight: string;
}

export interface ProgressiveTaxBracket {
  minExclusive: number;
  maxInclusive: number | null;
  baseTax: number;
  marginalRate: number;
}

export const PROPERTY_TAX_SEPTEMBER_META = {
  slug: "property-tax-september-payment-calculator-2026",
  title: "재산세 9월분 납부액 계산기 2026",
  seoTitle: "재산세 9월분 납부액 계산기 2026 | 주택 2기분·토지분 재산세",
  seoDescription:
    "2026년 9월 재산세 납부액을 계산합니다. 7월 주택분 고지액으로 9월 2기분을 추정하고, 토지분 재산세와 납부기간까지 함께 확인하세요.",
  updatedAt: "2026-07-23",
  dataNote:
    "지방세법상 토지분 재산세와 주택 2기분 납기는 매년 9월 16일부터 9월 30일까지입니다. 실제 납부액은 지방자치단체 고지서와 위택스·이택스 확인 결과가 우선합니다.",
};

export const PROPERTY_TAX_SEPTEMBER_DUE_DATES = {
  start: "2026년 9월 16일",
  end: "2026년 9월 30일",
  label: "2026년 9월 16일~9월 30일",
};

export const HOUSING_GENERAL_BRACKETS: ProgressiveTaxBracket[] = [
  { minExclusive: 0, maxInclusive: 60_000_000, baseTax: 0, marginalRate: 0.001 },
  { minExclusive: 60_000_000, maxInclusive: 150_000_000, baseTax: 60_000, marginalRate: 0.0015 },
  { minExclusive: 150_000_000, maxInclusive: 300_000_000, baseTax: 195_000, marginalRate: 0.0025 },
  { minExclusive: 300_000_000, maxInclusive: null, baseTax: 570_000, marginalRate: 0.004 },
];

export const HOUSING_SINGLE_HOME_SPECIAL_BRACKETS: ProgressiveTaxBracket[] = [
  { minExclusive: 0, maxInclusive: 60_000_000, baseTax: 0, marginalRate: 0.0005 },
  { minExclusive: 60_000_000, maxInclusive: 150_000_000, baseTax: 30_000, marginalRate: 0.001 },
  { minExclusive: 150_000_000, maxInclusive: 300_000_000, baseTax: 120_000, marginalRate: 0.002 },
  { minExclusive: 300_000_000, maxInclusive: null, baseTax: 420_000, marginalRate: 0.0035 },
];

export const LAND_AGGREGATE_BRACKETS: ProgressiveTaxBracket[] = [
  { minExclusive: 0, maxInclusive: 50_000_000, baseTax: 0, marginalRate: 0.002 },
  { minExclusive: 50_000_000, maxInclusive: 100_000_000, baseTax: 100_000, marginalRate: 0.003 },
  { minExclusive: 100_000_000, maxInclusive: null, baseTax: 250_000, marginalRate: 0.005 },
];

export const LAND_SEPARATE_BRACKETS: ProgressiveTaxBracket[] = [
  { minExclusive: 0, maxInclusive: 200_000_000, baseTax: 0, marginalRate: 0.002 },
  { minExclusive: 200_000_000, maxInclusive: 1_000_000_000, baseTax: 400_000, marginalRate: 0.003 },
  { minExclusive: 1_000_000_000, maxInclusive: null, baseTax: 2_800_000, marginalRate: 0.004 },
];

export const PROPERTY_TAX_SEPTEMBER_DEFAULT_INPUT: PropertyTaxSeptemberInput = {
  mode: "july",
  julyHousingAmount: 250_000,
  julyInputBasis: "totalPayment",
  paidAllInJuly: false,
  includeLandTax: false,
  landTaxType: "aggregate",
  landTaxBase: 100_000_000,
  housingPublicPrice: 600_000_000,
  fairMarketValueRatio: 60,
  useSingleHomeSpecialRate: true,
  localEducationTax: 0,
  regionalResourceFacilityTax: 0,
  manualHousingTax: 250_000,
  manualLandTax: 0,
  taxCreditAmount: 0,
};

export const PROPERTY_TAX_SEPTEMBER_MODES = [
  { id: "july", label: "7월 고지액 기준", summary: "7월 주택분으로 9월 2기분 추정" },
  { id: "house", label: "공시가격 기준", summary: "공시가격과 세율표로 주택분 추정" },
  { id: "land", label: "토지 과세표준", summary: "토지 유형별 본세 계산" },
  { id: "manual", label: "직접 합산", summary: "고지서 항목을 직접 입력" },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(Number.isFinite(value) ? value : 0, min), max);
}

export function calcProgressiveTax(taxBase: number, brackets: ProgressiveTaxBracket[]) {
  if (taxBase <= 0) return 0;
  const bracket = brackets.find((item) => {
    if (taxBase <= item.minExclusive) return false;
    if (item.maxInclusive === null) return true;
    return taxBase <= item.maxInclusive;
  });
  if (!bracket) return 0;
  return Math.round(bracket.baseTax + (taxBase - bracket.minExclusive) * bracket.marginalRate);
}

export function calcLandPropertyTax(taxBase: number, landTaxType: LandTaxType) {
  if (landTaxType === "aggregate") return calcProgressiveTax(taxBase, LAND_AGGREGATE_BRACKETS);
  if (landTaxType === "separate") return calcProgressiveTax(taxBase, LAND_SEPARATE_BRACKETS);
  if (landTaxType === "specialHighRate") return Math.round(taxBase * 0.04);
  return Math.round(taxBase * 0.002);
}

function buildInsight(input: PropertyTaxSeptemberInput, result: Omit<PropertyTaxSeptemberResult, "insight">) {
  if (input.mode === "july" && input.paidAllInJuly) {
    return "7월에 주택분이 일시부과된 경우 9월 주택분 고지서가 없을 수 있습니다. 토지분이나 다른 부가세목이 있는지는 고지서를 확인해야 합니다.";
  }
  if (input.mode === "july") {
    return `7월 주택분 입력액 기준 9월 주택 2기분은 약 ${Math.round(result.septemberHousingTax).toLocaleString("ko-KR")}원으로 예상됩니다. 토지분이 있으면 9월 납부액은 더 커질 수 있습니다.`;
  }
  if (input.mode === "house") {
    return "공시가격 기준 결과는 공정시장가액비율과 세율표를 적용한 추정액입니다. 세부담 상한, 감면, 공동명의, 지방교육세 등은 실제 고지서에서 달라질 수 있습니다.";
  }
  if (input.mode === "land") {
    return "토지분 재산세는 토지 과세 유형 선택이 중요합니다. 종합합산·별도합산·분리과세 구분은 고지서나 지자체 안내를 기준으로 확인하세요.";
  }
  return "직접 입력 모드는 고지서 항목을 예산표처럼 합산합니다. 실제 납부는 위택스·이택스 또는 지방자치단체 고지서 기준으로 확인하세요.";
}

export function calcPropertyTaxSeptemberPayment(input: PropertyTaxSeptemberInput): PropertyTaxSeptemberResult {
  const mode = input.mode;
  const julyHousingAmount = clamp(input.julyHousingAmount, 0, 50_000_000);
  const housingPublicPrice = clamp(input.housingPublicPrice, 0, 10_000_000_000);
  const fairMarketValueRatio = clamp(input.fairMarketValueRatio, 1, 100);
  const landTaxBase = clamp(input.landTaxBase, 0, 10_000_000_000);
  const localEducationTax = clamp(input.localEducationTax, 0, 10_000_000);
  const regionalResourceFacilityTax = clamp(input.regionalResourceFacilityTax, 0, 10_000_000);
  const taxCreditAmount = clamp(input.taxCreditAmount, 0, 10_000_000);

  const housingTaxBase = housingPublicPrice * (fairMarketValueRatio / 100);
  const housingBrackets = input.useSingleHomeSpecialRate ? HOUSING_SINGLE_HOME_SPECIAL_BRACKETS : HOUSING_GENERAL_BRACKETS;
  const estimatedAnnualHousingTax = calcProgressiveTax(housingTaxBase, housingBrackets);

  let septemberHousingTax = 0;
  let landPropertyTax = 0;
  let estimateLevel: PropertyTaxSeptemberResult["estimateLevel"] = "simple";
  let modeLabel = "7월 고지액 기준";

  if (mode === "july") {
    septemberHousingTax = input.paidAllInJuly ? 0 : julyHousingAmount;
    landPropertyTax = input.includeLandTax ? calcLandPropertyTax(landTaxBase, input.landTaxType) : 0;
  } else if (mode === "house") {
    septemberHousingTax = Math.round(estimatedAnnualHousingTax / 2);
    landPropertyTax = input.includeLandTax ? calcLandPropertyTax(landTaxBase, input.landTaxType) : 0;
    estimateLevel = "estimated";
    modeLabel = "공시가격 기준 추정";
  } else if (mode === "land") {
    septemberHousingTax = input.includeLandTax ? 0 : 0;
    landPropertyTax = calcLandPropertyTax(landTaxBase, input.landTaxType);
    estimateLevel = "estimated";
    modeLabel = "토지 과세표준 기준";
  } else {
    septemberHousingTax = clamp(input.manualHousingTax, 0, 50_000_000);
    landPropertyTax = clamp(input.manualLandTax, 0, 50_000_000);
    estimateLevel = "manual";
    modeLabel = "직접 입력 합산";
  }

  const septemberTotal = Math.max(0, septemberHousingTax + landPropertyTax + localEducationTax + regionalResourceFacilityTax - taxCreditAmount);
  const resultWithoutInsight = {
    septemberTotal,
    septemberHousingTax,
    landPropertyTax,
    estimatedAnnualHousingTax,
    housingTaxBase,
    julyComparisonAmount: septemberTotal - julyHousingAmount,
    localEducationTax,
    regionalResourceFacilityTax,
    taxCreditAmount,
    dueDateLabel: PROPERTY_TAX_SEPTEMBER_DUE_DATES.label,
    modeLabel,
    estimateLevel,
  };

  return { ...resultWithoutInsight, insight: buildInsight(input, resultWithoutInsight) };
}

export const PROPERTY_TAX_SEPTEMBER_CHECKLIST = [
  "2026년 6월 1일 기준 소유 여부",
  "7월 주택분이 일시부과되었는지",
  "9월 주택 2기분 고지서가 있는지",
  "토지분 고지서가 별도로 있는지",
  "공동명의 지분별 고지 여부",
  "감면·세부담 상한 적용 여부",
  "지방교육세·지역자원시설세 포함 여부",
  "자동이체·전자송달 세액공제 여부",
  "위택스·이택스 납부 가능 여부",
];

export const PROPERTY_TAX_SEPTEMBER_FAQ = [
  {
    question: "7월에 냈는데 9월에도 재산세가 나오나요?",
    answer:
      "주택분 재산세는 원칙적으로 연세액의 절반을 7월에, 나머지 절반을 9월에 냅니다. 다만 해당 연도 부과세액이 20만 원 이하인 경우에는 조례에 따라 7월에 한 번에 부과될 수 있습니다.",
  },
  {
    question: "9월 재산세 납부기간은 언제인가요?",
    answer: "토지분과 주택 2기분 재산세는 매년 9월 16일부터 9월 30일까지 납부합니다.",
  },
  {
    question: "토지분 재산세는 왜 9월에 나오나요?",
    answer:
      "지방세법상 토지 재산세 납기는 매년 9월 16일부터 9월 30일까지입니다. 주택과 별도로 토지를 보유하고 있으면 9월 고지액이 커질 수 있습니다.",
  },
  {
    question: "공시가격으로 계산한 값과 고지서가 다른 이유는 무엇인가요?",
    answer:
      "공정시장가액비율, 세부담 상한, 감면, 공동소유, 지자체 조례, 지방교육세, 지역자원시설세가 반영되면 단순 계산값과 달라질 수 있습니다.",
  },
  {
    question: "1세대 1주택 특례는 항상 적용되나요?",
    answer:
      "아닙니다. 시가표준액 9억 원 이하 등 요건을 충족해야 하며, 실제 적용 여부는 지방자치단체 고지서 기준으로 확인해야 합니다.",
  },
];

export const PROPERTY_TAX_SEPTEMBER_SEO_CONTENT = {
  introTitle: "9월 재산세는 주택 2기분과 토지분이 핵심입니다",
  intro: [
    "재산세는 과세기준일인 6월 1일 현재 소유자를 기준으로 부과됩니다. 건축물분은 7월, 토지분은 9월에 납부하고, 주택분은 일반적으로 연세액을 7월과 9월에 절반씩 나눠 냅니다.",
    "이 계산기는 7월 주택분 고지액을 알고 있는 사용자가 9월 2기분 예산을 빠르게 잡도록 설계했습니다. 공시가격 기준 추정과 토지 과세표준 기준 계산도 제공하지만, 실제 납부액은 지자체 고지서와 위택스·이택스 확인 결과가 우선합니다.",
    "7월에 주택분을 한 번만 냈다면 20만 원 이하 일시부과 또는 지자체 조례 적용 가능성이 있습니다. 9월에는 토지분이 함께 나올 수 있으므로 고지서 항목을 나눠 확인하는 것이 좋습니다.",
  ],
  inputPoints: [
    "7월 주택분 고지액으로 9월 주택 2기분을 추정합니다.",
    "7월 일시부과 여부를 켜면 9월 주택분을 0원으로 계산합니다.",
    "공시가격, 공정시장가액비율, 1세대 1주택 특례 여부로 주택분을 추정합니다.",
    "토지 종합합산·별도합산·분리과세 기준으로 토지분 본세를 계산합니다.",
    "지방교육세·지역자원시설세·세액공제는 직접 입력해 합산할 수 있습니다.",
  ],
  criteria: [
    "토지분 납기는 매년 9월 16일부터 9월 30일까지입니다.",
    "주택분은 원칙적으로 7월과 9월에 연세액의 절반씩 부과됩니다.",
    "해당 연도 주택분 부과세액이 20만 원 이하이면 조례에 따라 7월에 일시부과될 수 있습니다.",
    "공시가격 기준 계산은 세부담 상한, 감면, 공동명의, 지자체 조례를 정밀 반영하지 않는 추정입니다.",
    "최종 납부액은 지방자치단체 고지서와 위택스·이택스 기준이 우선합니다.",
  ],
};

export const PROPERTY_TAX_SEPTEMBER_RELATED_LINKS = [
  { href: "/reports/property-tax-payment-2026/", label: "재산세 납부기간 2026", description: "7월·9월 재산세 납부 흐름을 정리합니다." },
  { href: "/tools/apartment-holding-tax/", label: "아파트 보유세 계산기", description: "재산세와 종합부동산세까지 함께 봅니다." },
  { href: "/tools/real-estate-acquisition-tax/", label: "부동산 취득세 계산기", description: "취득 단계 세금과 보유 단계 세금을 이어서 확인합니다." },
];
