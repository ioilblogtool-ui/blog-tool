// 배당금 목표 역산 계산기 데이터
// "월 얼마를 받으려면 얼마를 투자해야 하나?"

export interface DtcEtfPreset {
  id: string;
  name: string;
  annualYield: number;   // 연 수익률 %
  market: "us" | "kr";
  taxRate: number;       // 원천징수세율
  badge?: string;
  riskNote: string;
}

export const DTC_ETF_PRESETS: DtcEtfPreset[] = [
  // ── YieldMax 고분배 (미국 상장) ──────────────────────────
  { id: "cony",   name: "CONY (코인베이스 커버드콜)",   annualYield: 80,  market: "us", taxRate: 15, badge: "고위험", riskNote: "코인베이스 단일종목 커버드콜. 주가 변동성 극단적. 원금 손실 위험 큼" },
  { id: "amdy",   name: "AMDY (AMD 커버드콜)",          annualYield: 60,  market: "us", taxRate: 15, badge: "고위험", riskNote: "AMD 단일종목 커버드콜. 반도체 사이클에 따라 변동 심함" },
  { id: "nvdy",   name: "NVDY (엔비디아 커버드콜)",     annualYield: 55,  market: "us", taxRate: 15, badge: "고위험", riskNote: "NVDA 단일종목 커버드콜. 엔비디아 주가에 직접 노출" },
  { id: "tsly",   name: "TSLY (테슬라 커버드콜)",       annualYield: 50,  market: "us", taxRate: 15, badge: "고위험", riskNote: "Tesla 단일종목 커버드콜. 변동성 매우 높음" },
  { id: "msfo",   name: "MSFO (마이크로소프트 커버드콜)", annualYield: 18, market: "us", taxRate: 15, riskNote: "Microsoft 단일종목 커버드콜. 상대적으로 안정적" },
  { id: "aply",   name: "APLY (애플 커버드콜)",         annualYield: 16,  market: "us", taxRate: 15, riskNote: "Apple 단일종목 커버드콜. 안정적 기업이나 커버드콜 구조 내재" },
  { id: "ymax",   name: "YMAX (YieldMax 멀티 ETF)",     annualYield: 25,  market: "us", taxRate: 15, badge: "고위험", riskNote: "YieldMax ETF 다수 보유. 커버드콜 분산" },
  { id: "ymag",   name: "YMAG (매그니피센트7 커버드콜)", annualYield: 22, market: "us", taxRate: 15, riskNote: "AAPL·MSFT·NVDA 등 M7 커버드콜. 상승 제한" },

  // ── 미국 인컴형 ETF ──────────────────────────────────────
  { id: "jepi",   name: "JEPI (JPMorgan 인컴 ETF)",     annualYield: 7.5, market: "us", taxRate: 15, badge: "중위험", riskNote: "S&P500 + 커버드콜. 안정적 분배, 자산 규모 매우 큼" },
  { id: "jepq",   name: "JEPQ (JPMorgan 나스닥 인컴)",  annualYield: 9,   market: "us", taxRate: 15, badge: "중위험", riskNote: "나스닥100 + 커버드콜. JEPI보다 분배율 높지만 변동 큼" },
  { id: "o",      name: "O (Realty Income, 월배당)",     annualYield: 5.8, market: "us", taxRate: 15, badge: "안정",   riskNote: "월배당 리츠. 30년+ 배당 지속. 금리 변화에 민감" },
  { id: "schd",   name: "SCHD (배당성장 ETF)",           annualYield: 3.5, market: "us", taxRate: 15, badge: "안정",   riskNote: "미국 배당성장 대표 ETF. 낮은 수수료, 꾸준한 배당 성장" },
  { id: "vym",    name: "VYM (뱅가드 고배당)",           annualYield: 3.0, market: "us", taxRate: 15, badge: "안정",   riskNote: "미국 고배당주 폭넓게 분산. 보수율 0.06%" },
  { id: "dvy",    name: "DVY (iShares 고배당)",          annualYield: 4.5, market: "us", taxRate: 15, badge: "안정",   riskNote: "미국 고배당 100종목. SCHD보다 분배율 높음" },
  { id: "qqqi",   name: "QQQI (나스닥 커버드콜)",        annualYield: 14,  market: "us", taxRate: 15, badge: "중위험", riskNote: "나스닥100 기반 커버드콜. NEOS 운용" },

  // ── 국내 상장 월배당 ETF ─────────────────────────────────
  { id: "tiger-plus",   name: "TIGER 미국배당+7%프리미엄", annualYield: 9,   market: "kr", taxRate: 15.4, badge: "중위험", riskNote: "배당성장+커버드콜. ISA 편입 가능" },
  { id: "kodex-cover",  name: "KODEX 미국배당프리미엄",    annualYield: 8,   market: "kr", taxRate: 15.4, badge: "중위험", riskNote: "삼성자산운용 커버드콜 액티브. ISA 가능" },
  { id: "rise-cover",   name: "RISE 미국배당커버드콜",     annualYield: 7.5, market: "kr", taxRate: 15.4, badge: "중위험", riskNote: "KB자산운용 커버드콜. ISA 가능" },
  { id: "tiger-dow",    name: "TIGER 미국배당다우존스",    annualYield: 2.8, market: "kr", taxRate: 15.4, badge: "안정",   riskNote: "배당성장형. 낮은 수수료(0.05%). ISA 가능" },
  { id: "ace-dow",      name: "ACE 미국배당다우존스",      annualYield: 2.8, market: "kr", taxRate: 15.4, badge: "안정",   riskNote: "TIGER와 동일 지수. KB자산운용. ISA 가능" },
  { id: "sol-dow",      name: "SOL 미국배당다우존스",      annualYield: 2.8, market: "kr", taxRate: 15.4, badge: "안정",   riskNote: "신한자산운용 동일 지수. ISA 가능" },
  { id: "tiger-reits",  name: "TIGER 부동산인프라고배당",  annualYield: 6.5, market: "kr", taxRate: 15.4, badge: "중위험", riskNote: "국내 리츠+인프라. 금리에 민감. ISA 가능" },

  { id: "custom", name: "직접 입력",                      annualYield: 5,   market: "us", taxRate: 15,   riskNote: "직접 수익률 입력" },
];

export const DTC_META = {
  title: "배당금 목표 투자금 계산기 2026 — 월 100만원 받으려면 얼마? | 비교계산소",
  description:
    "목표 월 배당금(예: 100만원)을 입력하면 CONY·YMAX·SCHD 등 ETF별 필요 투자금을 자동 계산합니다. 세전·세후 구분, ETF별 투자금 비교표를 한눈에 확인하세요.",
} as const;

export const DTC_FAQS = [
  {
    question: "월 100만원 배당금을 받으려면 ETF별로 얼마가 필요한가요?",
    answer:
      "세전 기준 CONY(연 80%) 약 1,500만원, AMDY(연 60%) 약 2,000만원, JEPI(연 7.5%) 약 1억6,000만원, TIGER +7%프리미엄(연 9%) 약 1억3,300만원, SCHD(연 3.5%) 약 3억4,000만원입니다. CONY처럼 고분배 ETF는 주가 자체가 하락해 실질 수익률이 분배율보다 훨씬 낮을 수 있습니다.",
  },
  {
    question: "JEPI·JEPQ와 YieldMax ETF의 차이는 무엇인가요?",
    answer:
      "JEPI는 S&P500 주식과 ELN(주가연계증권) 옵션을 결합해 월배당을 만듭니다. 운용자산 300억 달러 이상으로 안정성이 높고 분배율(연 7~8%)도 비교적 안정적입니다. YieldMax(CONY·AMDY 등)는 단일 종목 커버드콜로 분배율이 더 높지만 주가 하락 위험도 큽니다. 배당 투자 입문이라면 JEPI·JEPQ가 더 적합합니다.",
  },
  {
    question: "SCHD와 VYM 중 어떤 ETF가 더 좋은가요?",
    answer:
      "SCHD는 배당 성장 이력과 재무 건전성을 기준으로 100종목을 선별해 배당이 꾸준히 오르는 편입니다. 보수율 0.06%로 매우 저렴하고 과거 10년 배당 성장률이 연 12%대입니다. VYM은 400종목 이상으로 더 분산되어 있고 분배율이 약간 낮습니다. 장기 배당 성장 목적이면 SCHD, 광범위한 분산을 원하면 VYM이 유리합니다.",
  },
  {
    question: "세전 기준과 세후 기준은 어떻게 다른가요?",
    answer:
      "세전 기준은 '분배금 X원이 필요한 투자금'이고, 세후 기준은 '세금 차감 후 실제로 X원을 받기 위한 투자금'입니다. 미국 ETF(CONY·JEPI·SCHD 등)는 15% 원천징수, 국내 ETF는 15.4%가 차감됩니다. 세후 기준으로 월 100만원을 받으려면 미국 ETF는 투자금이 약 18% 더 필요합니다.",
  },
  {
    question: "커버드콜 ETF의 분배율이 높은데 왜 위험한가요?",
    answer:
      "커버드콜은 보유 주식의 콜옵션을 팔아 프리미엄을 받는 구조입니다. 주가가 오를 때 상승 수익을 포기하고 옵션 프리미엄을 분배금으로 줍니다. 주가가 하락하면 분배금을 받아도 원금이 더 빠르게 줄어듭니다. CONY처럼 단일 종목 커버드콜은 해당 종목이 급락하면 분배율도 급락하고 주가 손실도 커집니다.",
  },
  {
    question: "O (Realty Income)는 왜 월배당인가요?",
    answer:
      "Realty Income(O)은 미국 리츠(REIT)로 법적으로 과세소득의 90% 이상을 배당해야 합니다. 1969년 이후 매월 배당을 지급해온 대표적인 월배당 리츠이며, 배당을 30년 이상 연속으로 늘려온 '배당 귀족' 종목입니다. 다만 금리가 오르면 리츠 주가가 하락하는 경향이 있어 금리 환경을 함께 고려해야 합니다.",
  },
  {
    question: "배당 투자로 월 생활비를 충당하는 것이 현실적인가요?",
    answer:
      "월 300만원을 SCHD(연 3.5%)로 받으려면 약 10억원, TIGER +7%프리미엄(연 9%)으로는 약 4억원, JEPI(연 7.5%)로는 약 4억8,000만원이 필요합니다. 일반 직장인에게 단기 달성은 어렵지만, 성과급·저축을 꾸준히 배당 ETF에 투자해 10~20년 장기 목표로 설계하는 것이 현실적입니다.",
  },
  {
    question: "국내 상장 ETF와 미국 상장 ETF 중 어디에 투자해야 하나요?",
    answer:
      "국내 상장 ETF(TIGER·ACE·SOL 다우존스 등)는 ISA 계좌에 편입할 수 있어 비과세·저율과세 혜택이 가능합니다. 원화로 투자하고 원화로 분배금을 받아 환전 과정이 없습니다. 미국 상장 ETF(CONY·JEPI·SCHD 등)는 직접 해외주식 계좌가 필요하고 달러로 분배금을 받습니다. 장기적으로는 ISA 혜택을 활용할 수 있는 국내 상장 ETF를 우선 고려하는 것이 세금 면에서 유리합니다.",
  },
];
