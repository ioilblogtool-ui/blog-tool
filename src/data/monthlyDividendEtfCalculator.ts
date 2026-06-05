// ============================================================
// monthlyDividendEtfCalculator.ts
// 월배당 ETF 배당금 계산기 데이터
// ============================================================

export type EtfMarket = "domestic" | "us";

export interface EtfPreset {
  id: string;
  name: string;
  ticker: string;
  market: EtfMarket;
  annualDistRate: number;   // 연 분배율 % (예: 12.5)
  monthlyDistRate: number;  // 월 분배율 % (annualDistRate / 12)
  category: "covered-call" | "dividend" | "growth-dividend" | "bond";
  description: string;
  taxRate: number;          // 세율 % (국내 15.4 / 해외 22)
  remark?: string;
}

export interface ScenarioRow {
  label: string;
  investmentManwon: number;
}

export interface GoalRow {
  monthlyGoalManwon: number;
  label: string;
}

// ─── ETF 프리셋 ───────────────────────────────────────────
// 분배율은 최근 12개월 실적 기반 추정치 — 변동 가능
export const ETF_PRESETS: EtfPreset[] = [
  // 국내 상장 커버드콜 ETF
  {
    id: "tiger-nasdaq-cc",
    name: "TIGER 미국나스닥100커버드콜",
    ticker: "TIGER 나스닥100CC",
    market: "domestic",
    annualDistRate: 12.0,
    monthlyDistRate: 1.0,
    category: "covered-call",
    description: "나스닥100 기반 커버드콜 전략. 매월 분배금 지급.",
    taxRate: 15.4,
  },
  {
    id: "tiger-snp-cc",
    name: "TIGER 미국S&P500커버드콜",
    ticker: "TIGER S&P500CC",
    market: "domestic",
    annualDistRate: 10.0,
    monthlyDistRate: 0.833,
    category: "covered-call",
    description: "S&P500 기반 커버드콜 전략. 매월 분배금 지급.",
    taxRate: 15.4,
  },
  {
    id: "rise-nasdaq-cc",
    name: "RISE 미국나스닥100커버드콜",
    ticker: "RISE 나스닥100CC",
    market: "domestic",
    annualDistRate: 11.5,
    monthlyDistRate: 0.958,
    category: "covered-call",
    description: "나스닥100 기반 KB자산운용 커버드콜 ETF.",
    taxRate: 15.4,
  },
  {
    id: "kodex-nasdaq-cc",
    name: "KODEX 미국나스닥100커버드콜",
    ticker: "KODEX 나스닥100CC",
    market: "domestic",
    annualDistRate: 11.0,
    monthlyDistRate: 0.917,
    category: "covered-call",
    description: "삼성자산운용 나스닥100 커버드콜 ETF.",
    taxRate: 15.4,
  },
  // 미국 상장 고배당 커버드콜 ETF
  {
    id: "cony",
    name: "CONY (Coinbase 커버드콜)",
    ticker: "CONY",
    market: "us",
    annualDistRate: 60.0,
    monthlyDistRate: 5.0,
    category: "covered-call",
    description: "Coinbase 단일 종목 커버드콜. 변동성 매우 큼. 원금 손실 위험 높음.",
    taxRate: 22.0,
    remark: "⚠️ 단일 종목 커버드콜 — 위험 매우 높음",
  },
  {
    id: "amdy",
    name: "AMDY (AMD 커버드콜)",
    ticker: "AMDY",
    market: "us",
    annualDistRate: 55.0,
    monthlyDistRate: 4.583,
    category: "covered-call",
    description: "AMD 단일 종목 커버드콜. 변동성 큼.",
    taxRate: 22.0,
    remark: "⚠️ 단일 종목 커버드콜 — 위험 높음",
  },
  {
    id: "ymax",
    name: "YMAX (YieldMax Universe)",
    ticker: "YMAX",
    market: "us",
    annualDistRate: 50.0,
    monthlyDistRate: 4.167,
    category: "covered-call",
    description: "YieldMax ETF 포트폴리오 분산 투자. 매주 분배금.",
    taxRate: 22.0,
  },
  {
    id: "ymag",
    name: "YMAG (YieldMax Magnificent 7)",
    ticker: "YMAG",
    market: "us",
    annualDistRate: 45.0,
    monthlyDistRate: 3.75,
    category: "covered-call",
    description: "매그니피센트7 커버드콜. 매주 분배금.",
    taxRate: 22.0,
  },
  // 미국 상장 배당 ETF
  {
    id: "jepi",
    name: "JEPI (JPMorgan Equity Premium Income)",
    ticker: "JEPI",
    market: "us",
    annualDistRate: 8.5,
    monthlyDistRate: 0.708,
    category: "covered-call",
    description: "S&P500 커버드콜 + ELN 전략. 변동성 낮은 편.",
    taxRate: 22.0,
  },
  {
    id: "jepq",
    name: "JEPQ (JPMorgan Nasdaq Equity Premium)",
    ticker: "JEPQ",
    market: "us",
    annualDistRate: 10.0,
    monthlyDistRate: 0.833,
    category: "covered-call",
    description: "나스닥100 기반 커버드콜. 매월 분배금.",
    taxRate: 22.0,
  },
  {
    id: "schd",
    name: "SCHD (Schwab US Dividend Equity)",
    ticker: "SCHD",
    market: "us",
    annualDistRate: 3.8,
    monthlyDistRate: 0.317,
    category: "dividend",
    description: "배당성장 ETF. 분기 배당. 안정적 성장 추구.",
    taxRate: 22.0,
    remark: "분기 배당 (월 환산)",
  },
  {
    id: "qyld",
    name: "QYLD (Global X Nasdaq Covered Call)",
    ticker: "QYLD",
    market: "us",
    annualDistRate: 12.0,
    monthlyDistRate: 1.0,
    category: "covered-call",
    description: "나스닥100 커버드콜. 매월 분배금. 상승 수익 제한.",
    taxRate: 22.0,
  },
  // 국내 상장 배당 ETF
  {
    id: "tiger-dividend",
    name: "TIGER 배당성장 ETF",
    ticker: "TIGER 배당성장",
    market: "domestic",
    annualDistRate: 2.5,
    monthlyDistRate: 0.208,
    category: "dividend",
    description: "국내 배당성장주 ETF. 안정적인 배당 지급.",
    taxRate: 15.4,
  },
  {
    id: "kodex-highDiv",
    name: "KODEX 고배당",
    ticker: "KODEX 고배당",
    market: "domestic",
    annualDistRate: 5.5,
    monthlyDistRate: 0.458,
    category: "dividend",
    description: "국내 고배당주 집중 ETF.",
    taxRate: 15.4,
  },
];

// ─── 투자금 시나리오 ──────────────────────────────────────
export const INVESTMENT_SCENARIOS: ScenarioRow[] = [
  { label: "1,000만원", investmentManwon: 1000 },
  { label: "3,000만원", investmentManwon: 3000 },
  { label: "5,000만원", investmentManwon: 5000 },
  { label: "1억원",     investmentManwon: 10000 },
  { label: "2억원",     investmentManwon: 20000 },
  { label: "3억원",     investmentManwon: 30000 },
];

// ─── 목표 월배당 역산 ─────────────────────────────────────
export const GOAL_SCENARIOS: GoalRow[] = [
  { monthlyGoalManwon: 10,  label: "월 10만원" },
  { monthlyGoalManwon: 30,  label: "월 30만원" },
  { monthlyGoalManwon: 50,  label: "월 50만원" },
  { monthlyGoalManwon: 100, label: "월 100만원" },
  { monthlyGoalManwon: 200, label: "월 200만원" },
  { monthlyGoalManwon: 300, label: "월 300만원" },
];

// ─── 계산 함수 ────────────────────────────────────────────
export function calcMonthlyDist(
  investmentManwon: number,
  annualDistRatePct: number,
  taxRatePct: number
) {
  const grossMonthly = (investmentManwon * (annualDistRatePct / 100)) / 12;
  const tax = grossMonthly * (taxRatePct / 100);
  const netMonthly = grossMonthly - tax;
  return { grossMonthly, tax, netMonthly };
}

export function calcRequiredInvestment(
  targetMonthlyManwon: number,
  annualDistRatePct: number,
  taxRatePct: number
): number {
  // netMonthly = investment * (annualRate/100/12) * (1 - taxRate/100)
  const monthlyNetRate = (annualDistRatePct / 100 / 12) * (1 - taxRatePct / 100);
  if (monthlyNetRate <= 0) return 0;
  return targetMonthlyManwon / monthlyNetRate;
}

export function fmtManwon(v: number): string {
  if (v >= 10000) {
    const eok = Math.floor(v / 10000);
    const rem = Math.round((v % 10000) / 100) * 100;
    if (rem > 0) return `${eok}억 ${(rem / 100).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}백만`;
    return `${eok.toLocaleString("ko-KR")}억`;
  }
  return `${Math.round(v).toLocaleString("ko-KR")}만`;
}
