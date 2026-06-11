export type HomeCountType = "one" | "two" | "threePlus";
export type OwnershipType = "single" | "spouseJoint" | "jointOther";
export type RegionType = "general" | "regulated";

export interface ApartmentHoldingTaxInput {
  taxYear: number;
  officialPrice: number;
  homeCountType: HomeCountType;
  isOneHouseholdOneHome: boolean;
  ownershipType: OwnershipType;
  ownershipShareRate: number;
  regionType: RegionType;
  holdingYears: number;
  age: number;
  propertyTaxFairMarketRatio: number | null;
  comprehensiveTaxFairMarketRatio: number | null;
  comprehensiveTaxDeductionOverride: number | null;
  applyTaxBurdenCap: boolean;
  previousYearHoldingTax: number | null;
  targetHoldingTax: number | null;
  officialPriceChangeRate: number;
}

export interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
  deduction: number;
  label: string;
}

export interface TaxCreditRate {
  minValue: number;
  maxValue: number | null;
  rate: number;
  label: string;
}

export interface HoldingTaxYearConfig {
  year: number;
  propertyTaxFairMarketRatio: number;
  propertyTaxOneHomeSpecialRatios: Array<{
    maxOfficialPrice: number;
    ratio: number;
    label: string;
  }>;
  comprehensiveTaxFairMarketRatio: number;
  comprehensiveTaxDeductionGeneral: number;
  comprehensiveTaxDeductionOneHome: number;
  localEducationTaxRate: number;
  ruralSpecialTaxRate: number;
  propertyTaxBrackets: TaxBracket[];
  propertyTaxSpecialBrackets: TaxBracket[];
  comprehensiveTaxBracketsGeneral: TaxBracket[];
  comprehensiveTaxBracketsMultiHome: TaxBracket[];
  seniorCreditRates: TaxCreditRate[];
  longHoldingCreditRates: TaxCreditRate[];
  oneHomeCreditLimitRate: number;
  taxBurdenCapRates: Array<{
    condition: string;
    capRate: number;
  }>;
  sourceLabel: string;
  sourceUpdatedAt: string;
  notes: string[];
}

export interface ApartmentHoldingTaxPreset {
  id: string;
  label: string;
  description: string;
  input: Partial<ApartmentHoldingTaxInput>;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  desc: string;
}

export const AHT_META = {
  slug: "apartment-holding-tax",
  title: "아파트 보유세 계산기",
  seoTitle: "아파트 보유세 계산기 2026 | 재산세·종부세 내 아파트는 얼마?",
  description:
    "공시가격만 입력하면 재산세·종합부동산세·농특세까지 2026년 기준으로 즉시 계산. 1세대1주택 감면·고령자공제 반영해 내 아파트 보유세가 정확히 얼마인지 30초 만에 확인하세요.",
  updatedAt: "2026-05-22",
  caution:
    "이 계산기는 공시가격 기준 간이 추정 도구입니다. 실제 고지세액은 지자체 조례, 감면, 합산배제, 세부담상한, 공동명의 판단, 납세자별 주택 합산 방식에 따라 달라질 수 있습니다.",
};

export const AHT_DEFAULT_INPUT: ApartmentHoldingTaxInput = {
  taxYear: 2026,
  officialPrice: 1_200_000_000,
  homeCountType: "one",
  isOneHouseholdOneHome: true,
  ownershipType: "single",
  ownershipShareRate: 100,
  regionType: "general",
  holdingYears: 10,
  age: 65,
  propertyTaxFairMarketRatio: null,
  comprehensiveTaxFairMarketRatio: null,
  comprehensiveTaxDeductionOverride: null,
  applyTaxBurdenCap: false,
  previousYearHoldingTax: null,
  targetHoldingTax: 3_000_000,
  officialPriceChangeRate: 10,
};

export const AHT_YEAR_CONFIGS: HoldingTaxYearConfig[] = [
  {
    year: 2026,
    propertyTaxFairMarketRatio: 60,
    propertyTaxOneHomeSpecialRatios: [
      { maxOfficialPrice: 300_000_000, ratio: 43, label: "1세대 1주택 3억 이하 특례" },
      { maxOfficialPrice: 600_000_000, ratio: 44, label: "1세대 1주택 6억 이하 특례" },
      { maxOfficialPrice: 900_000_000, ratio: 45, label: "1세대 1주택 9억 이하 특례" },
    ],
    comprehensiveTaxFairMarketRatio: 60,
    comprehensiveTaxDeductionGeneral: 900_000_000,
    comprehensiveTaxDeductionOneHome: 1_200_000_000,
    localEducationTaxRate: 20,
    ruralSpecialTaxRate: 20,
    propertyTaxBrackets: [
      { min: 0, max: 60_000_000, rate: 0.1, deduction: 0, label: "6천만 원 이하" },
      { min: 60_000_000, max: 150_000_000, rate: 0.15, deduction: 30_000, label: "6천만~1억5천만 원" },
      { min: 150_000_000, max: 300_000_000, rate: 0.25, deduction: 180_000, label: "1억5천만~3억 원" },
      { min: 300_000_000, max: null, rate: 0.4, deduction: 630_000, label: "3억 원 초과" },
    ],
    propertyTaxSpecialBrackets: [
      { min: 0, max: 60_000_000, rate: 0.05, deduction: 0, label: "특례 6천만 원 이하" },
      { min: 60_000_000, max: 150_000_000, rate: 0.1, deduction: 30_000, label: "특례 6천만~1억5천만 원" },
      { min: 150_000_000, max: 300_000_000, rate: 0.2, deduction: 180_000, label: "특례 1억5천만~3억 원" },
      { min: 300_000_000, max: null, rate: 0.35, deduction: 630_000, label: "특례 3억 원 초과" },
    ],
    comprehensiveTaxBracketsGeneral: [
      { min: 0, max: 300_000_000, rate: 0.5, deduction: 0, label: "3억 원 이하" },
      { min: 300_000_000, max: 600_000_000, rate: 0.7, deduction: 600_000, label: "3억~6억 원" },
      { min: 600_000_000, max: 1_200_000_000, rate: 1, deduction: 2_400_000, label: "6억~12억 원" },
      { min: 1_200_000_000, max: 2_500_000_000, rate: 1.3, deduction: 6_000_000, label: "12억~25억 원" },
      { min: 2_500_000_000, max: 5_000_000_000, rate: 1.5, deduction: 11_000_000, label: "25억~50억 원" },
      { min: 5_000_000_000, max: 9_400_000_000, rate: 2, deduction: 36_200_000, label: "50억~94억 원" },
      { min: 9_400_000_000, max: null, rate: 2.7, deduction: 101_800_000, label: "94억 원 초과" },
    ],
    comprehensiveTaxBracketsMultiHome: [
      { min: 0, max: 300_000_000, rate: 0.5, deduction: 0, label: "3억 원 이하" },
      { min: 300_000_000, max: 600_000_000, rate: 0.7, deduction: 600_000, label: "3억~6억 원" },
      { min: 600_000_000, max: 1_200_000_000, rate: 1, deduction: 2_400_000, label: "6억~12억 원" },
      { min: 1_200_000_000, max: 2_500_000_000, rate: 2, deduction: 14_400_000, label: "12억~25억 원" },
      { min: 2_500_000_000, max: 5_000_000_000, rate: 3, deduction: 39_400_000, label: "25억~50억 원" },
      { min: 5_000_000_000, max: 9_400_000_000, rate: 4, deduction: 89_400_000, label: "50억~94억 원" },
      { min: 9_400_000_000, max: null, rate: 5, deduction: 183_400_000, label: "94억 원 초과" },
    ],
    seniorCreditRates: [
      { minValue: 60, maxValue: 65, rate: 20, label: "60세 이상 65세 미만" },
      { minValue: 65, maxValue: 70, rate: 30, label: "65세 이상 70세 미만" },
      { minValue: 70, maxValue: null, rate: 40, label: "70세 이상" },
    ],
    longHoldingCreditRates: [
      { minValue: 5, maxValue: 10, rate: 20, label: "5년 이상 10년 미만" },
      { minValue: 10, maxValue: 15, rate: 40, label: "10년 이상 15년 미만" },
      { minValue: 15, maxValue: null, rate: 50, label: "15년 이상" },
    ],
    oneHomeCreditLimitRate: 80,
    taxBurdenCapRates: [
      { condition: "공시가격 3억 이하", capRate: 105 },
      { condition: "공시가격 6억 이하", capRate: 110 },
      { condition: "공시가격 6억 초과", capRate: 130 },
    ],
    sourceLabel: "국가법령정보센터 지방세법·종합부동산세법 2026년 시행 기준",
    sourceUpdatedAt: "2026-05-22",
    notes: [
      "재산세 주택 세율과 1세대 1주택 특례세율은 지방세법 시행규칙 별지 재산세 부과 안내 구조를 기준으로 정리했습니다.",
      "종합부동산세 공제금액, 세율, 고령자·장기보유 세액공제는 종합부동산세법 및 시행규칙 별지 서식의 주택 기준을 사용했습니다.",
      "세부담상한, 공시가격 상한율, 재산세 중 종부세 중복분 공제는 실제 고지 구조가 복잡해 간이 안내와 보수적 추정으로 표시합니다.",
    ],
  },
];

export const AHT_PRESETS: ApartmentHoldingTaxPreset[] = [
  {
    id: "one-home-entry",
    label: "종부세 경계 1주택",
    description: "공시가격 12억 원, 1세대 1주택 기준",
    input: { officialPrice: 1_200_000_000, homeCountType: "one", isOneHouseholdOneHome: true, holdingYears: 10, age: 65 },
  },
  {
    id: "seoul-high",
    label: "서울 고가 1주택",
    description: "공시가격 18억 원, 장기보유 공제 확인",
    input: { officialPrice: 1_800_000_000, homeCountType: "one", isOneHouseholdOneHome: true, holdingYears: 15, age: 70 },
  },
  {
    id: "two-home",
    label: "2주택 보유자",
    description: "공시가격 9억 원, 일반 공제 기준",
    input: { officialPrice: 900_000_000, homeCountType: "two", isOneHouseholdOneHome: false, holdingYears: 4, age: 55 },
  },
  {
    id: "joint-share",
    label: "부부 공동명의",
    description: "공시가격 15억 원, 지분 50% 단순 계산",
    input: { officialPrice: 1_500_000_000, ownershipType: "spouseJoint", ownershipShareRate: 50, isOneHouseholdOneHome: true, holdingYears: 10, age: 65 },
  },
];

export const AHT_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/home-purchase-fund/", label: "주택 매수 자금 계산기", desc: "취득 전 필요한 자기자본을 함께 확인" },
  { href: "/tools/real-estate-acquisition-tax/", label: "부동산 취득세 계산기", desc: "매수 시점 세금과 보유세를 나란히 비교" },
  { href: "/tools/jeonwolse-conversion/", label: "전월세 전환율 계산기", desc: "보유 대신 임차 비용을 환산" },
  { href: "/reports/seoul-apartment-price-2026/", label: "서울 아파트 가격 리포트", desc: "공시가격과 시세 변동을 함께 점검" },
];

export const AHT_SOURCE_LINKS = [
  {
    title: "국가법령정보센터 종합부동산세법",
    href: "https://law.go.kr/LSW/lsInfoP.do?lsiSeq=280417",
  },
  {
    title: "종합부동산세법 시행규칙 별지 서식",
    href: "https://www.law.go.kr/LSW/flDownload.do?bylClsCd=110202&flSeq=150969151&gubun=",
  },
  {
    title: "지방세법 재산세 부과 안내 서식",
    href: "https://www.law.go.kr/flDownload.do?bylClsCd=110202&flSeq=160303121&gubun=",
  },
];

export const AHT_FAQ: FaqItem[] = [
  {
    question: "아파트 보유세는 어떤 세금의 합계인가요?",
    answer:
      "보통 재산세와 지방교육세, 종합부동산세와 농어촌특별세를 함께 봅니다. 종부세 대상이 아니면 재산세 영역만 부담하는 경우가 많습니다.",
  },
  {
    question: "공시가격과 시세 중 무엇을 입력해야 하나요?",
    answer:
      "보유세 계산은 공시가격을 기준으로 합니다. 실거래가나 호가가 아니라 공동주택 공시가격을 입력해야 계산 구조에 가깝습니다.",
  },
  {
    question: "1세대 1주택이면 종부세가 항상 없나요?",
    answer:
      "아닙니다. 1세대 1주택자는 종부세 공제금액이 일반보다 크지만, 공시가격이 공제금액을 넘으면 종부세 과세표준이 생길 수 있습니다.",
  },
  {
    question: "고령자·장기보유 공제는 재산세에도 적용되나요?",
    answer:
      "이 계산기에서는 종합부동산세 세액공제 비교에 적용합니다. 재산세 감면은 별도 요건과 지자체 고지 구조가 있어 실제 고지서를 확인해야 합니다.",
  },
  {
    question: "계산 결과가 실제 고지서와 같나요?",
    answer:
      "같지 않을 수 있습니다. 실제 세액은 납세자별 합산, 공동명의, 합산배제, 감면, 세부담상한, 지자체 조례와 고지 시스템에 따라 달라집니다.",
  },
];
