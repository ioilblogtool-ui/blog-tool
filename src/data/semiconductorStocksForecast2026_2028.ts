export type SemiconductorCompanySlug = "samsung-electronics" | "sk-hynix" | "micron" | "tsmc";
export type SemiconductorBusinessType = "integrated" | "memory" | "foundry";
export type ForecastCurrency = "KRW" | "USD" | "TWD";
export type ForecastYear = 2026 | 2027 | 2028;
export type ForecastBadge = "공식" | "컨센서스" | "시나리오" | "환산" | "추정" | "업데이트필요";
export type ScenarioKey = "bear" | "base" | "bull";
export type MetricKey = "revenue" | "operatingProfit" | "operatingMargin" | "revenueCagr" | "opCagr" | "forwardPer" | "evEbitda";

export interface SemiconductorCompany {
  slug: SemiconductorCompanySlug;
  companyName: string;
  shortName: string;
  ticker: string;
  exchange: string;
  currency: ForecastCurrency;
  businessType: SemiconductorBusinessType;
  countryLabel: string;
  description: string;
  coreDrivers: string[];
  keyRisks: string[];
  investorQuestion: string;
}

export interface SemiconductorForecast {
  companySlug: SemiconductorCompanySlug;
  year: ForecastYear;
  revenue: number;
  operatingProfit: number;
  operatingMargin: number;
  netIncome?: number;
  capex?: number;
  sourceType: "official" | "consensus" | "scenario";
  sourceLabel: string;
  sourceUrl?: string;
  sourceDate: string;
  badge: ForecastBadge;
  note?: string;
}

export interface FxRateSet {
  asOf: string;
  usdKrw: number;
  twdKrw: number;
  twdUsd: number;
  sourceLabel: string;
  badge: ForecastBadge;
}

export interface SemiconductorScenario {
  companySlug: SemiconductorCompanySlug;
  scenario: ScenarioKey;
  label: string;
  year: 2028;
  operatingProfit: number;
  targetMultiple: number;
  impliedMarketCap: number;
  impliedUpside?: number;
  assumptions: string[];
  caution: string;
}

export interface SemiconductorSource {
  id: string;
  label: string;
  organization: string;
  url: string;
  asOf: string;
  badge: ForecastBadge;
  note: string;
}

export interface ForecastKpiCard {
  label: string;
  value: string;
  description: string;
  badge: ForecastBadge;
  tone: "neutral" | "memory" | "foundry" | "caution" | "growth";
}

export interface BusinessModelMatrixItem {
  companySlug: SemiconductorCompanySlug;
  revenueSource: string;
  aiBenefit: string;
  marginDriver: string;
  mainRisk: string;
}

export interface RelatedReportLink {
  label: string;
  href: string;
  description: string;
}

export interface SemiconductorStocksForecastData {
  meta: {
    slug: string;
    title: string;
    description: string;
    h1: string;
    eyebrow: string;
    updatedAt: string;
    forecastRange: string;
    caution: string;
  };
  fx: FxRateSet;
  companies: SemiconductorCompany[];
  forecasts: SemiconductorForecast[];
  scenarios: SemiconductorScenario[];
  kpiCards: ForecastKpiCard[];
  businessMatrix: BusinessModelMatrixItem[];
  sources: SemiconductorSource[];
  relatedLinks: RelatedReportLink[];
  risks: string[];
  seoIntro: string[];
  seoInputPoints: string[];
  seoCriteria: string[];
  faq: { q: string; a: string }[];
}

export const semiconductorCompanies: SemiconductorCompany[] = [
  {
    slug: "samsung-electronics",
    companyName: "삼성전자",
    shortName: "삼성전자",
    ticker: "005930.KS",
    exchange: "KRX",
    currency: "KRW",
    businessType: "integrated",
    countryLabel: "한국",
    description: "메모리, 파운드리, 모바일, 가전을 함께 보유한 종합 반도체·전자 기업입니다.",
    coreDrivers: ["DS부문 회복", "HBM 경쟁력", "파운드리 적자 축소", "MX 수익성"],
    keyRisks: ["HBM 진입 지연", "파운드리 수익성", "전사 실적 혼합"],
    investorQuestion: "DS부문 회복이 전사 밸류에이션을 얼마나 다시 끌어올릴 수 있는가?",
  },
  {
    slug: "sk-hynix",
    companyName: "SK하이닉스",
    shortName: "SK하이닉스",
    ticker: "000660.KS",
    exchange: "KRX",
    currency: "KRW",
    businessType: "memory",
    countryLabel: "한국",
    description: "DRAM, HBM, NAND에 집중된 메모리 반도체 기업입니다.",
    coreDrivers: ["HBM 고마진", "DRAM ASP", "AI 서버 수요", "공급 규율"],
    keyRisks: ["고객 집중", "HBM 공급 증가", "성과급·Capex 부담"],
    investorQuestion: "HBM 고마진이 2028년까지 유지될 수 있는가?",
  },
  {
    slug: "micron",
    companyName: "Micron Technology",
    shortName: "Micron",
    ticker: "MU",
    exchange: "NASDAQ",
    currency: "USD",
    businessType: "memory",
    countryLabel: "미국",
    description: "미국 대표 메모리 반도체 기업으로 DRAM, NAND, HBM을 공급합니다.",
    coreDrivers: ["HBM 램프업", "DRAM 가격", "미국 상장 프리미엄", "데이터센터 수요"],
    keyRisks: ["HBM 후발 점유율", "NAND 변동성", "FY 기준 비교 착시"],
    investorQuestion: "HBM 후발주자 프리미엄이 2027~2028년 실적으로 확인되는가?",
  },
  {
    slug: "tsmc",
    companyName: "TSMC",
    shortName: "TSMC",
    ticker: "TSM",
    exchange: "NYSE ADR",
    currency: "TWD",
    businessType: "foundry",
    countryLabel: "대만",
    description: "AI GPU와 ASIC 선단공정을 담당하는 글로벌 파운드리 1위 기업입니다.",
    coreDrivers: ["HPC 매출", "3nm·2nm", "AI ASIC", "선단공정 가격"],
    keyRisks: ["Capex 증가", "지정학 리스크", "고객 집중"],
    investorQuestion: "AI 파운드리 프리미엄이 높은 Capex 부담을 계속 상쇄할 수 있는가?",
  },
];

export const fxRateSet: FxRateSet = {
  asOf: "2026-05-31",
  usdKrw: 1450,
  twdKrw: 43.8,
  twdUsd: 0.0302,
  sourceLabel: "비교용 고정 환율",
  badge: "환산",
};

export const semiconductorForecasts: SemiconductorForecast[] = [
  { companySlug: "samsung-electronics", year: 2026, revenue: 585, operatingProfit: 145, operatingMargin: 24.8, sourceType: "consensus", sourceLabel: "국내 증권사 보도·컨센서스 범위 재구성", sourceDate: "2026-05-31", badge: "컨센서스", note: "전사 연결 실적 기준 추정입니다. DS부문만의 실적이 아닙니다." },
  { companySlug: "samsung-electronics", year: 2027, revenue: 635, operatingProfit: 165, operatingMargin: 26.0, sourceType: "scenario", sourceLabel: "메모리 업황 지속 시나리오", sourceDate: "2026-05-31", badge: "시나리오", note: "HBM과 범용 DRAM 가격 강세가 이어지는 기준 시나리오입니다." },
  { companySlug: "samsung-electronics", year: 2028, revenue: 660, operatingProfit: 150, operatingMargin: 22.7, sourceType: "scenario", sourceLabel: "공급 확대 후 정상화 시나리오", sourceDate: "2026-05-31", badge: "시나리오", note: "2028년 공급 확대와 가격 정상화를 일부 반영했습니다." },
  { companySlug: "sk-hynix", year: 2026, revenue: 300, operatingProfit: 228, operatingMargin: 76.0, sourceType: "consensus", sourceLabel: "메모리 슈퍼사이클 보도·리서치 범위 재구성", sourceDate: "2026-05-31", badge: "컨센서스", note: "HBM과 범용 DRAM 가격 강세가 동시에 반영된 고마진 시나리오입니다." },
  { companySlug: "sk-hynix", year: 2027, revenue: 365, operatingProfit: 284, operatingMargin: 77.8, sourceType: "scenario", sourceLabel: "HBM 공급 부족 지속 시나리오", sourceDate: "2026-05-31", badge: "시나리오", note: "2027년까지 공급 부족이 이어진다는 가정입니다." },
  { companySlug: "sk-hynix", year: 2028, revenue: 370, operatingProfit: 265, operatingMargin: 71.6, sourceType: "scenario", sourceLabel: "공급 증가 후 완만한 정상화", sourceDate: "2026-05-31", badge: "시나리오", note: "2028년 공급 확대와 가격 둔화를 일부 반영했습니다." },
  { companySlug: "micron", year: 2026, revenue: 68, operatingProfit: 32, operatingMargin: 47.1, sourceType: "consensus", sourceLabel: "미국 컨센서스·HBM 램프업 재구성", sourceDate: "2026-05-31", badge: "컨센서스", note: "Micron은 FY 기준 실적 발표 기업이므로 calendar year와 차이가 날 수 있습니다." },
  { companySlug: "micron", year: 2027, revenue: 82, operatingProfit: 41, operatingMargin: 50.0, sourceType: "scenario", sourceLabel: "HBM 후발 램프업 시나리오", sourceDate: "2026-05-31", badge: "시나리오", note: "HBM 매출 확대와 DRAM 가격 강세가 유지되는 기준 시나리오입니다." },
  { companySlug: "micron", year: 2028, revenue: 88, operatingProfit: 42, operatingMargin: 47.7, sourceType: "scenario", sourceLabel: "메모리 정상화 시나리오", sourceDate: "2026-05-31", badge: "시나리오", note: "2028년 공급 정상화 가능성을 반영했습니다." },
  { companySlug: "tsmc", year: 2026, revenue: 5.12, operatingProfit: 2.46, operatingMargin: 48.0, sourceType: "consensus", sourceLabel: "Citi AI 메가사이클 매출 전망 재구성", sourceDate: "2026-05-31", badge: "컨센서스", note: "TWD 기준입니다. ADR 주가와 회계 통화를 혼동하면 안 됩니다." },
  { companySlug: "tsmc", year: 2027, revenue: 6.95, operatingProfit: 3.41, operatingMargin: 49.1, sourceType: "scenario", sourceLabel: "AI HPC 고성장 시나리오", sourceDate: "2026-05-31", badge: "시나리오", note: "AI GPU·ASIC 수요와 선단공정 가격을 반영했습니다." },
  { companySlug: "tsmc", year: 2028, revenue: 8.66, operatingProfit: 4.20, operatingMargin: 48.5, sourceType: "scenario", sourceLabel: "2nm 전환·AI ASIC 확대 시나리오", sourceDate: "2026-05-31", badge: "시나리오", note: "Capex 증가에도 높은 선단공정 가동률을 가정했습니다." },
];

export const businessModelMatrix: BusinessModelMatrixItem[] = [
  { companySlug: "samsung-electronics", revenueSource: "메모리·파운드리·MX·가전", aiBenefit: "메모리 가격과 HBM 진입이 동시에 작동", marginDriver: "DS부문 회복과 파운드리 적자 축소", mainRisk: "전사 실적 혼합으로 반도체 순수 수혜가 희석될 수 있음" },
  { companySlug: "sk-hynix", revenueSource: "DRAM·HBM·NAND", aiBenefit: "HBM과 AI 서버 DRAM 수요에 가장 직접 노출", marginDriver: "고마진 HBM과 범용 DRAM ASP", mainRisk: "고객 집중과 2028년 공급 확대" },
  { companySlug: "micron", revenueSource: "DRAM·NAND·HBM", aiBenefit: "미국 상장 메모리 대표주로 HBM 후발 램프업 기대", marginDriver: "DRAM 가격과 HBM 인증·공급 확대", mainRisk: "한국 2사 대비 HBM 점유율 확인 필요" },
  { companySlug: "tsmc", revenueSource: "AI GPU·ASIC 파운드리", aiBenefit: "엔비디아·빅테크 AI 칩 생산 수요 흡수", marginDriver: "3nm·2nm 선단공정과 HPC 매출 비중", mainRisk: "Capex 부담과 지정학 리스크" },
];

export const semiconductorScenarios: SemiconductorScenario[] = semiconductorCompanies.flatMap((company) => {
  const base = semiconductorForecasts.find((item) => item.companySlug === company.slug && item.year === 2028)!;
  const nativeName = company.currency === "KRW" ? "조원" : company.currency === "USD" ? "십억 달러" : "조 대만달러";
  const multiples: Record<ScenarioKey, number> = company.businessType === "foundry"
    ? { bear: 16, base: 20, bull: 24 }
    : { bear: 4, base: 6, bull: 8 };
  const opMultiplier: Record<ScenarioKey, number> = { bear: 0.82, base: 1, bull: 1.18 };
  return (["bear", "base", "bull"] as ScenarioKey[]).map((scenario) => {
    const operatingProfit = Math.round(base.operatingProfit * opMultiplier[scenario] * 10) / 10;
    const targetMultiple = multiples[scenario];
    return {
      companySlug: company.slug,
      scenario,
      label: scenario === "bear" ? "보수" : scenario === "base" ? "기준" : "낙관",
      year: 2028,
      operatingProfit,
      targetMultiple,
      impliedMarketCap: Math.round(operatingProfit * targetMultiple * 10) / 10,
      assumptions: [
        scenario === "bear" ? "AI 서버 Capex 속도 둔화" : scenario === "base" ? "AI 서버 투자와 공급 부족이 완만하게 지속" : "HBM·선단공정 공급 부족 장기화",
        company.businessType === "foundry" ? "선단공정 가동률과 Capex 효율이 핵심 변수" : "DRAM·HBM ASP와 공급 증가 속도가 핵심 변수",
        `영업이익은 ${nativeName} 기준 단순 시나리오`,
      ],
      caution: "목표주가가 아니라 영업이익과 배수 가정에 따른 단순 시가총액 범위입니다.",
    };
  });
});

export const semiconductorSources: SemiconductorSource[] = [
  { id: "samsung-ir", label: "삼성전자 IR", organization: "Samsung Electronics", url: "https://www.samsung.com/global/ir/", asOf: "2026-05-31", badge: "공식", note: "분기 실적과 사업부 코멘트의 1차 확인 경로입니다." },
  { id: "sk-hynix-ir", label: "SK하이닉스 IR", organization: "SK hynix", url: "https://www.skhynix.com/ir/main.do", asOf: "2026-05-31", badge: "공식", note: "HBM·DRAM·NAND 업황 코멘트와 실적 확인 경로입니다." },
  { id: "micron-ir", label: "Micron Investor Relations", organization: "Micron Technology", url: "https://investors.micron.com/", asOf: "2026-05-31", badge: "공식", note: "Micron은 FY 기준 실적과 가이던스를 확인해야 합니다." },
  { id: "tsmc-ir", label: "TSMC Investor Relations", organization: "TSMC", url: "https://investor.tsmc.com/english", asOf: "2026-05-31", badge: "공식", note: "TWD 기준 실적, 월별 매출, 공정별 매출 비중 확인 경로입니다." },
  { id: "sp-hynix", label: "S&P Global SK하이닉스 전망", organization: "S&P Global Ratings", url: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3513063", asOf: "2026-03", badge: "컨센서스", note: "2026~2027 매출·현금흐름과 2028년 공급 정상화 리스크를 확인하는 보조 출처입니다." },
  { id: "tsmc-citi", label: "TSMC AI 메가사이클 전망", organization: "Investing.com 보도", url: "https://www.investing.com/news/stock-market-news/tsmc-price-target-raised-at-citi-as-ai-megacycle-accelerates-4587255", asOf: "2026-03", badge: "컨센서스", note: "2026~2028 TSMC 매출 전망과 Capex 상향 시나리오를 보조 확인했습니다." },
  { id: "micron-consensus", label: "Micron 컨센서스 보조", organization: "StockAnalysis/Finnhub", url: "https://stockanalysis.com/stocks/mu/forecast/", asOf: "2026-05", badge: "컨센서스", note: "Micron 매출·EPS 컨센서스 확인용 보조 출처입니다." },
];

export function getCompany(slug: SemiconductorCompanySlug) {
  return semiconductorCompanies.find((company) => company.slug === slug)!;
}

export function getCompanyForecasts(slug: SemiconductorCompanySlug) {
  return semiconductorForecasts.filter((item) => item.companySlug === slug).sort((a, b) => a.year - b.year);
}

export function calcCagr(start: number, end: number, years: number) {
  if (start <= 0 || end <= 0 || years <= 0) return 0;
  return (Math.pow(end / start, 1 / years) - 1) * 100;
}

export function formatMargin(value: number) {
  return `${value.toFixed(1)}%`;
}

export function formatMultiple(value: number) {
  return `${value.toFixed(1).replace(".0", "")}배`;
}

export function formatNativeCurrency(value: number, currency: ForecastCurrency) {
  if (currency === "KRW") return `${value.toLocaleString("ko-KR", { maximumFractionDigits: 1 })}조원`;
  if (currency === "USD") return `$${value.toLocaleString("ko-KR", { maximumFractionDigits: 1 })}B`;
  return `NT$${value.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}조`;
}

export function convertToKrw(value: number, currency: ForecastCurrency, fx: FxRateSet = fxRateSet) {
  if (currency === "KRW") return value;
  if (currency === "USD") return (value * fx.usdKrw) / 1000;
  return value * fx.twdKrw;
}

export function convertToUsd(value: number, currency: ForecastCurrency, fx: FxRateSet = fxRateSet) {
  if (currency === "USD") return value;
  if (currency === "KRW") return (value * 1000) / fx.usdKrw;
  return value * fx.twdUsd * 1000;
}

export function formatKrwFromNative(value: number, currency: ForecastCurrency, fx: FxRateSet = fxRateSet) {
  return `약 ${convertToKrw(value, currency, fx).toLocaleString("ko-KR", { maximumFractionDigits: 1 })}조원`;
}

export function formatUsdFromNative(value: number, currency: ForecastCurrency, fx: FxRateSet = fxRateSet) {
  return `약 $${convertToUsd(value, currency, fx).toLocaleString("ko-KR", { maximumFractionDigits: 1 })}B`;
}

const opCagrRanking = semiconductorCompanies
  .map((company) => {
    const list = getCompanyForecasts(company.slug);
    return { company, cagr: calcCagr(list[0].operatingProfit, list[2].operatingProfit, 2) };
  })
  .sort((a, b) => b.cagr - a.cagr);

export const semiconductorStocksForecast2026_2028: SemiconductorStocksForecastData = {
  meta: {
    slug: "semiconductor-stocks-forecast-2026-2028",
    title: "삼성전자·SK하이닉스·마이크론·TSMC 2026~2028 실적 전망 비교",
    description: "삼성전자, SK하이닉스, 마이크론, TSMC의 2026~2028년 매출·영업이익·영업이익률 전망을 비교합니다. HBM, DRAM, 파운드리, AI 서버 수요를 기준으로 보수·기준·낙관 시나리오별 밸류에이션을 정리했습니다.",
    h1: "반도체 4대장 2026~2028 실적 전망 비교",
    eyebrow: "투자 데이터 리포트",
    updatedAt: "2026-05-31",
    forecastRange: "2026E~2028E",
    caution: "이 페이지는 투자 권유가 아니라 공개자료와 컨센서스 기반 비교 리포트입니다. 2026~2028년 수치는 확정 실적이 아니며 실적 발표, 환율, 메모리 가격, AI 서버 투자, Capex 계획에 따라 바뀔 수 있습니다.",
  },
  fx: fxRateSet,
  companies: semiconductorCompanies,
  forecasts: semiconductorForecasts,
  scenarios: semiconductorScenarios,
  kpiCards: [
    { label: "2028E 영업이익률", value: "SK하이닉스 71.6%", description: "HBM과 DRAM 가격 강세가 유지된다는 시나리오 기준입니다.", badge: "시나리오", tone: "memory" },
    { label: "영업이익 CAGR", value: `${opCagrRanking[0].company.shortName} ${opCagrRanking[0].cagr.toFixed(1)}%`, description: "2026E~2028E 영업이익 증가율 기준입니다.", badge: "추정", tone: "growth" },
    { label: "파운드리 프리미엄", value: "TSMC", description: "AI GPU·ASIC 선단공정 수요와 높은 고객 락인이 핵심입니다.", badge: "컨센서스", tone: "foundry" },
    { label: "주의할 변수", value: "2028 공급 증가", description: "메모리는 공급 확대 시 가격과 이익률 정상화가 빠르게 올 수 있습니다.", badge: "업데이트필요", tone: "caution" },
  ],
  businessMatrix: businessModelMatrix,
  sources: semiconductorSources,
  relatedLinks: [
    { label: "미국·한국 반도체 ETF 비교 2026", href: "/reports/semiconductor-etf-2026/", description: "개별주가 부담스러울 때 ETF로 반도체 사이클을 담는 방법을 비교합니다." },
    { label: "반도체 산업 구조 한눈에 보기", href: "/reports/semiconductor-value-chain/", description: "엔비디아, TSMC, 삼성전자, SK하이닉스가 밸류체인에서 맡는 역할을 정리합니다." },
    { label: "ETF vs 직접투자 10년 비교", href: "/reports/etf-vs-direct-stock-10year-2026/", description: "개별 반도체주와 ETF 투자 방식의 장단점을 비교합니다." },
    { label: "국내 증권사 수수료·혜택 비교", href: "/reports/stock-brokerage-fee-comparison-2026/", description: "국내·미국 주식 거래비용을 확인할 때 연결합니다." },
  ],
  risks: [
    "AI 서버 Capex 둔화",
    "HBM 공급 과잉",
    "범용 DRAM·NAND 가격 하락",
    "환율 변동",
    "TSMC 지정학 리스크",
    "삼성전자 파운드리 수익성",
    "Micron 회계연도 비교 착시",
  ],
  seoIntro: [
    "반도체 주식 전망은 주가 차트만 보면 흔들리기 쉽습니다. 삼성전자, SK하이닉스, 마이크론, TSMC는 모두 AI 반도체 사이클의 수혜를 받지만 수익 구조는 다릅니다. 메모리 기업은 HBM과 DRAM 가격에 민감하고, TSMC는 선단공정과 HPC 매출 비중에 더 크게 반응합니다.",
    "이 리포트는 2026~2028년 매출, 영업이익, 영업이익률을 같은 화면에서 비교합니다. 원통화 기준을 우선 보여주고, 원화·달러 환산은 참고값으로 제공합니다. 환율과 회계연도 차이 때문에 환산값은 절대 순위보다 규모 감각을 잡는 용도로 보는 편이 안전합니다.",
    "주가 전망은 단일 목표가보다 시나리오로 읽어야 합니다. 같은 2028년 영업이익이라도 시장이 부여하는 배수가 달라지면 시가총액 범위가 크게 달라집니다. 그래서 이 페이지는 보수·기준·낙관 시나리오별 영업이익과 적용 배수를 함께 제시합니다.",
    "모든 2026~2028 수치는 확정값이 아니라 컨센서스와 시나리오 기반 추정입니다. 실제 투자 판단 전에는 각 회사 IR, 공시, 최신 실적 발표, 환율, 본인의 투자 성향을 반드시 확인해야 합니다.",
  ],
  seoInputPoints: [
    "삼성전자와 SK하이닉스는 같은 한국 반도체주라도 전사 실적 구조와 HBM 민감도가 다릅니다.",
    "Micron은 FY 기준, TSMC는 TWD 기준이므로 단순 숫자 비교 전에 기준을 맞춰야 합니다.",
    "목표주가보다 매출·영업이익·영업이익률·밸류에이션 배수를 먼저 봐야 합니다.",
  ],
  seoCriteria: [
    "삼성전자와 SK하이닉스는 조원, Micron은 십억 달러, TSMC는 조 대만달러를 원통화 기준으로 표시합니다.",
    "원화·달러 환산은 2026-05-31 비교용 고정 환율을 사용한 참고값입니다.",
    "2026~2028년 전망치는 공식 확정 실적이 아니라 컨센서스와 시나리오 기반 추정입니다.",
    "밸류에이션 범위는 목표주가나 매수·매도 의견이 아니라 산식 결과입니다.",
  ],
  faq: [
    { q: "이 페이지의 실적 전망은 공식 확정치인가요?", a: "아닙니다. 2026~2028년 수치는 공식 실적이 아니라 공개자료, 컨센서스, 리서치 보도, 자체 시나리오를 같은 기준으로 재구성한 추정값입니다." },
    { q: "삼성전자와 SK하이닉스는 왜 다르게 봐야 하나요?", a: "삼성전자는 메모리, 파운드리, 모바일, 가전이 섞인 종합 기업이고 SK하이닉스는 메모리와 HBM 비중이 훨씬 큽니다. 그래서 같은 반도체주라도 이익 민감도가 다릅니다." },
    { q: "Micron은 왜 FY 기준 주의가 필요한가요?", a: "Micron은 미국 기업으로 회계연도 기준 실적을 발표합니다. 한국 기업의 1~12월 기준과 직접 비교하면 시점이 어긋날 수 있습니다." },
    { q: "TSMC는 메모리 기업이 아닌데 왜 같이 비교하나요?", a: "TSMC는 AI GPU와 AI ASIC 생산을 담당하는 파운드리 핵심 기업입니다. AI 반도체 사이클을 보려면 메모리 3사와 TSMC를 함께 비교하는 것이 유용합니다." },
    { q: "시나리오상 시가총액은 목표주가인가요?", a: "아닙니다. 2028년 영업이익과 적용 배수 가정으로 계산한 단순 범위입니다. 목표주가나 매수·매도 의견이 아닙니다." },
    { q: "HBM 가격이 내려가면 어떤 기업이 가장 민감한가요?", a: "HBM과 DRAM 의존도가 높은 메모리 기업이 더 민감합니다. 다만 고객 계약, 제품 믹스, 범용 DRAM 가격, 환율에 따라 실제 영향은 달라집니다." },
  ],
};
