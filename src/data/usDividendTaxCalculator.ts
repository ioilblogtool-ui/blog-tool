// 미국주식 배당소득세 계산기 데이터

export const UDTA_META = {
  title: "미국주식 배당소득세 계산기 2026 — 원천징수·종합과세 세후 실수령 | 비교계산소",
  description:
    "미국주식 배당금의 세금을 계산하세요. 미국 원천징수 15%, 국내 금융소득종합과세 2,000만원 기준 초과 시 추가 세금까지 자동 계산합니다.",
} as const;

export const UDTA_TAX_BRACKETS = [
  { threshold: 12_000_000, rate: 0.06,  label: "1,200만원 이하 · 6%" },
  { threshold: 46_000_000, rate: 0.15,  label: "1,200~4,600만원 · 15%" },
  { threshold: 88_000_000, rate: 0.24,  label: "4,600~8,800만원 · 24%" },
  { threshold: 150_000_000, rate: 0.35, label: "8,800만~1.5억 · 35%" },
  { threshold: 300_000_000, rate: 0.38, label: "1.5억~3억 · 38%" },
  { threshold: 500_000_000, rate: 0.40, label: "3억~5억 · 40%" },
  { threshold: Infinity,    rate: 0.42, label: "5억 초과 · 42%" },
];

export const UDTA_STOCK_PRESETS = [
  { id: "aapl",  name: "AAPL (Apple)",         annualYieldPct: 0.55 },
  { id: "msft",  name: "MSFT (Microsoft)",      annualYieldPct: 0.75 },
  { id: "jnj",   name: "JNJ (J&J)",             annualYieldPct: 3.2 },
  { id: "ko",    name: "KO (Coca-Cola)",         annualYieldPct: 3.1 },
  { id: "realty",name: "O (Realty Income)",      annualYieldPct: 5.8 },
  { id: "custom",name: "직접 입력",              annualYieldPct: 3.0 },
];

export const UDTA_FAQS = [
  {
    question: "미국주식 배당금에 세금이 얼마나 붙나요?",
    answer:
      "미국에서 원천징수 15%가 먼저 차감됩니다. 100달러 배당이면 85달러가 입금됩니다. 한미 조세조약으로 15% 세율이 적용됩니다. 연간 금융소득(배당+이자)이 2,000만원을 넘으면 국내에서 종합소득세 신고를 해야 하고 추가 세금이 발생할 수 있습니다.",
  },
  {
    question: "금융소득 2,000만원이란 무엇인가요?",
    answer:
      "국내외 모든 이자·배당 소득을 합산한 금액입니다. 2,000만원까지는 분리과세(15.4%)로 끝나지만, 초과분은 다른 소득과 합산해 종합소득세가 부과됩니다. 미국 주식 배당, 국내 ETF 분배금, 예금 이자 모두 포함됩니다.",
  },
  {
    question: "미국 원천징수 15%는 국내 세금 신고 시 공제받을 수 있나요?",
    answer:
      "종합소득세 신고 대상이 되면 외국납부세액공제(미국에 납부한 15%)를 신청해 이중과세를 줄일 수 있습니다. 다만 공제 한도와 계산 방식이 복잡하므로 세무사 상담을 권장합니다.",
  },
  {
    question: "배당금을 많이 받아도 세금이 안 늘어나게 하려면?",
    answer:
      "미국 ETF는 ISA 계좌에 직접 편입할 수 없지만, 한국 상장 해외 ETF는 ISA 계좌 내에서 비과세·분리과세 혜택을 받을 수 있습니다. 연간 2,000만원 한도 내에서 납입하면 금융소득종합과세를 피할 수 있습니다.",
  },
  {
    question: "배당 재투자(DRIP)도 세금이 붙나요?",
    answer:
      "미국 증권사에서 자동 재투자(DRIP)를 설정해도 배당금은 지급된 것으로 간주해 세금이 부과됩니다. 재투자 여부와 관계없이 배당금 전액에 원천징수세가 적용됩니다.",
  },
];
