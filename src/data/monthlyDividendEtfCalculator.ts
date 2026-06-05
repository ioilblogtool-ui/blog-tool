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

  // ── 국내 상장 커버드콜 ETF ──────────────────────────────
  {
    id: "tiger-nasdaq-cc",
    name: "TIGER 미국나스닥100커버드콜",
    ticker: "TIGER 나스닥100CC",
    market: "domestic",
    annualDistRate: 12.0,
    monthlyDistRate: 1.0,
    category: "covered-call",
    description: "나스닥100 기반 커버드콜. 매월 분배금. DC 퇴직연금 편입 가능.",
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
    description: "S&P500 기반 커버드콜. 상대적으로 낮은 변동성.",
    taxRate: 15.4,
  },
  {
    id: "tiger-tech-top10-cc",
    name: "TIGER 미국테크TOP10타겟커버드콜",
    ticker: "TIGER 테크TOP10CC",
    market: "domestic",
    annualDistRate: 13.0,
    monthlyDistRate: 1.083,
    category: "covered-call",
    description: "애플·MS·엔비디아 등 미국 기술주 TOP10 커버드콜.",
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
    description: "KB자산운용 나스닥100 커버드콜 ETF.",
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
  {
    id: "ace-snp-cc",
    name: "ACE 미국S&P500커버드콜",
    ticker: "ACE S&P500CC",
    market: "domestic",
    annualDistRate: 10.5,
    monthlyDistRate: 0.875,
    category: "covered-call",
    description: "한국투자신탁운용 S&P500 커버드콜 ETF.",
    taxRate: 15.4,
  },
  {
    id: "tiger-us30yr-cc",
    name: "TIGER 미국30년국채커버드콜",
    ticker: "TIGER 미국30년채CC",
    market: "domestic",
    annualDistRate: 12.0,
    monthlyDistRate: 1.0,
    category: "covered-call",
    description: "미국 30년 국채 + 콜옵션 매도. 채권 기반 안정적 분배.",
    taxRate: 15.4,
  },

  // ── 국내 상장 배당·고배당 ETF ──────────────────────────
  {
    id: "tiger-div-growth",
    name: "TIGER 배당성장 ETF",
    ticker: "TIGER 배당성장",
    market: "domestic",
    annualDistRate: 2.5,
    monthlyDistRate: 0.208,
    category: "dividend",
    description: "국내 배당성장주 ETF. 안정적 배당 + 주가 성장.",
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
    description: "국내 고배당주 집중 ETF. 분기 배당.",
    taxRate: 15.4,
    remark: "분기 배당 (월 환산)",
  },
  {
    id: "ace-schd-kr",
    name: "ACE 미국배당다우존스 (SCHD 추종)",
    ticker: "ACE 미국배당",
    market: "domestic",
    annualDistRate: 3.8,
    monthlyDistRate: 0.317,
    category: "dividend",
    description: "SCHD 유사 국내 상장 버전. 미국 배당성장주 추종.",
    taxRate: 15.4,
  },
  {
    id: "tiger-reits",
    name: "TIGER 리츠부동산인프라",
    ticker: "TIGER 리츠",
    market: "domestic",
    annualDistRate: 5.0,
    monthlyDistRate: 0.417,
    category: "dividend",
    description: "국내 리츠·인프라 ETF. 매월 분배금 지급.",
    taxRate: 15.4,
  },
  {
    id: "kodex-dividend-value",
    name: "KODEX 한국배당가치",
    ticker: "KODEX 배당가치",
    market: "domestic",
    annualDistRate: 4.0,
    monthlyDistRate: 0.333,
    category: "dividend",
    description: "국내 배당가치주 중심 ETF.",
    taxRate: 15.4,
  },

  // ── 미국 상장 고배당·커버드콜 ETF ──────────────────────
  {
    id: "cony",
    name: "CONY (Coinbase 커버드콜)",
    ticker: "CONY",
    market: "us",
    annualDistRate: 60.0,
    monthlyDistRate: 5.0,
    category: "covered-call",
    description: "Coinbase 단일 종목 커버드콜. 변동성 매우 큼. 원금 손실 위험 극대.",
    taxRate: 22.0,
    remark: "⚠️ 단일 종목 — 위험 매우 높음",
  },
  {
    id: "nvdy",
    name: "NVDY (엔비디아 커버드콜)",
    ticker: "NVDY",
    market: "us",
    annualDistRate: 70.0,
    monthlyDistRate: 5.833,
    category: "covered-call",
    description: "엔비디아 단일 종목 커버드콜. 분배율 최고수준, 리스크 매우 큼.",
    taxRate: 22.0,
    remark: "⚠️ 단일 종목 — 위험 매우 높음",
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
    remark: "⚠️ 단일 종목 — 위험 높음",
  },
  {
    id: "ymax",
    name: "YMAX (YieldMax Universe)",
    ticker: "YMAX",
    market: "us",
    annualDistRate: 50.0,
    monthlyDistRate: 4.167,
    category: "covered-call",
    description: "YieldMax ETF 포트폴리오 분산. 매주 분배금.",
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
  {
    id: "jepi",
    name: "JEPI (JPMorgan Equity Premium Income)",
    ticker: "JEPI",
    market: "us",
    annualDistRate: 8.5,
    monthlyDistRate: 0.708,
    category: "covered-call",
    description: "S&P500 커버드콜 + ELN 전략. 변동성 낮은 편. 안정적 분배.",
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
    description: "나스닥100 기반 ELN 전략. 매월 분배금.",
    taxRate: 22.0,
  },
  {
    id: "qyld",
    name: "QYLD (Global X Nasdaq Covered Call)",
    ticker: "QYLD",
    market: "us",
    annualDistRate: 12.0,
    monthlyDistRate: 1.0,
    category: "covered-call",
    description: "나스닥100 ATM 콜옵션 완전매도. 상승 수익 포기.",
    taxRate: 22.0,
  },
  {
    id: "xyld",
    name: "XYLD (Global X S&P500 Covered Call)",
    ticker: "XYLD",
    market: "us",
    annualDistRate: 11.0,
    monthlyDistRate: 0.917,
    category: "covered-call",
    description: "S&P500 ATM 콜옵션 완전매도. 매월 분배금.",
    taxRate: 22.0,
  },
  {
    id: "ryld",
    name: "RYLD (Global X Russell 2000 Covered Call)",
    ticker: "RYLD",
    market: "us",
    annualDistRate: 13.0,
    monthlyDistRate: 1.083,
    category: "covered-call",
    description: "Russell 2000 소형주 커버드콜. 높은 분배율.",
    taxRate: 22.0,
  },

  // ── 미국 상장 배당 ETF ──────────────────────────────────
  {
    id: "schd",
    name: "SCHD (Schwab US Dividend Equity)",
    ticker: "SCHD",
    market: "us",
    annualDistRate: 3.8,
    monthlyDistRate: 0.317,
    category: "dividend",
    description: "미국 배당성장 ETF의 대표. 분기 배당. 장기 자산 증식에 유리.",
    taxRate: 22.0,
    remark: "분기 배당 (월 환산)",
  },
  {
    id: "vym",
    name: "VYM (Vanguard High Dividend Yield)",
    ticker: "VYM",
    market: "us",
    annualDistRate: 3.2,
    monthlyDistRate: 0.267,
    category: "dividend",
    description: "뱅가드 고배당 ETF. 분기 배당. 안정적 배당주 포트폴리오.",
    taxRate: 22.0,
    remark: "분기 배당 (월 환산)",
  },
  {
    id: "vig",
    name: "VIG (Vanguard Dividend Appreciation)",
    ticker: "VIG",
    market: "us",
    annualDistRate: 1.8,
    monthlyDistRate: 0.15,
    category: "dividend",
    description: "10년 이상 배당 성장 기업. 성장 + 배당 균형.",
    taxRate: 22.0,
    remark: "분기 배당 (월 환산)",
  },
  {
    id: "agnc",
    name: "AGNC (AGNC Investment Corp)",
    ticker: "AGNC",
    market: "us",
    annualDistRate: 14.0,
    monthlyDistRate: 1.167,
    category: "dividend",
    description: "미국 mREIT. 주택담보증권(MBS) 투자. 매월 배당. 금리 민감.",
    taxRate: 22.0,
    remark: "금리 변동에 민감 — 원금 변동 큼",
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
