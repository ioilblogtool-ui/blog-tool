export type AdrPresetScenario = {
  id: string;
  label: string;
  krxPrice: number;
  fxRate: number;
  adsPrice: number;
  note: string;
};

export type AdrInfoCard = {
  label: string;
  value: string;
  description: string;
};

export type AdrFaq = {
  question: string;
  answer: string;
};

export type AdrRelatedLink = {
  href: string;
  label: string;
  description: string;
};

// SK하이닉스 ADR 확정 스펙 (2026-07-10 나스닥 상장 기준) — 계산 상수, 사용자 입력 대상 아님
export const ADR_SPEC = {
  exchange: "Nasdaq Global Select Market",
  ticker: "SKHY",
  ipoPricePerAds: 149,
  adsPerShare: 10, // ADS 10주 = 한국 보통주 1주
  listedAt: "2026-07-10",
};

export const toolMeta = {
  slug: "sk-hynix-adr-premium-calculator",
  title: "SK하이닉스 ADR 계산기 2026 | 김치프리미엄 바로 계산",
  description:
    "국내 주가와 나스닥 SKHY 주가·환율 입력하면 SK하이닉스 김치프리미엄(할증·할인) % 바로 계산. ADS 10주=보통주 1주 비율 자동 반영.",
  h1: "SK하이닉스 ADR(SKHY) 프리미엄 계산기",
  eyebrow: "ADR 프리미엄 계산",
  updatedAt: "2026-07-10",
};

// 예시값 — 실제 계산 시 사용자가 증권사 앱 등에서 확인한 최신 값으로 교체해야 함
export const defaultInputs = {
  krxPrice: 2050000,
  fxRate: 1380,
  adsPrice: 149,
};

export const infoCards: AdrInfoCard[] = [
  {
    label: "ADR이란",
    value: "미국예탁증서",
    description:
      "해외 기업의 주식을 미국 예탁기관이 보관하고, 이를 근거로 미국 증시에서 달러로 거래할 수 있게 만든 증서입니다.",
  },
  {
    label: "프리미엄/디스카운트란",
    value: "가격 괴리 %",
    description:
      "SKHY 가격을 원화로 환산한 값이 국내 주가보다 비싸면 프리미엄(할증), 싸면 디스카운트(할인)라고 부릅니다.",
  },
  {
    label: "재정거래란",
    value: "가격차 차익거래",
    description:
      "이론상 싼 쪽을 사서 비싼 쪽에 파는 거래지만, 세금·환전 비용·결제일 차이 때문에 계산상 프리미엄만큼 실현되지 않는 경우가 많습니다.",
  },
];

export const presetScenarios: AdrPresetScenario[] = [
  {
    id: "premium",
    label: "할증(프리미엄) 10% 예시",
    krxPrice: 2050000,
    fxRate: 1380,
    adsPrice: 163.4,
    note: "나스닥 SKHY가 국내보다 10% 비싼 예시 값입니다.",
  },
  {
    id: "discount",
    label: "할인(디스카운트) 8% 예시",
    krxPrice: 2050000,
    fxRate: 1380,
    adsPrice: 136.7,
    note: "나스닥 SKHY가 국내보다 8% 싼 예시 값입니다.",
  },
  {
    id: "neutral",
    label: "등가(0%) 예시",
    krxPrice: 2050000,
    fxRate: 1380,
    adsPrice: 148.55,
    note: "국내 주가와 SKHY 환산가가 거의 같은 예시 값입니다.",
  },
];

export const faq: AdrFaq[] = [
  {
    question: "SK하이닉스 ADR(SKHY)이 뭔가요?",
    answer:
      "SK하이닉스는 2026년 7월 10일 미국 나스닥(Nasdaq Global Select Market)에 ADR을 상장했습니다. 티커는 SKHY이며, 미국예탁증서(ADR)는 해외 주식을 미국 증시에서 달러로 거래할 수 있게 만든 증서입니다.",
  },
  {
    question: "김치프리미엄은 어떻게 계산하나요?",
    answer:
      "SKHY 주가에 ADS 10주=보통주 1주 비율(10배)을 곱해 원/달러 환율로 환산한 뒤, 국내 주가와 비교해 차이를 퍼센트로 계산합니다. 이 계산기는 세 값(국내 주가, 환율, SKHY 주가)만 입력하면 비율을 자동 반영합니다.",
  },
  {
    question: "프리미엄이 있으면 실제로 차익거래가 가능한가요?",
    answer:
      "계산상 프리미엄이 확인되더라도 계좌 개설, 환전 수수료, 양도소득세·배당소득세, 결제일 차이 때문에 계산된 퍼센트만큼 실제 수익이 남지 않는 경우가 많습니다. 이 계산기는 투자 실행을 권유하지 않는 참고용 도구입니다.",
  },
  {
    question: "ADS 10주가 왜 보통주 1주와 같나요?",
    answer:
      "SK하이닉스 ADR은 상장 당시 ADS 10주가 한국 보통주 1주를 나타내는 구조로 확정됐습니다. 그래서 ADS 가격을 보통주 가치로 환산하려면 10을 곱해야 합니다.",
  },
  {
    question: "환율은 어떤 걸 입력해야 하나요?",
    answer:
      "매매기준율을 입력하는 것을 권장합니다. 현찰환율은 은행 우대율에 따라 달라져 실제 시장 가격 비교에는 매매기준율이 더 적합합니다.",
  },
];

export const relatedLinks: AdrRelatedLink[] = [
  {
    href: "/reports/sk-hynix-adr-listing-2026/",
    label: "SK하이닉스 ADR 상장 완전정리",
    description: "나스닥 상장 배경·조달금액·투자자 영향",
  },
  {
    href: "/reports/sk-hynix-korea-vs-adr-investment-2026/",
    label: "국내투자 vs ADR 투자 비교",
    description: "세금·환전비용·거래시간 비교표",
  },
  {
    href: "/reports/stock-brokerage-fee-comparison-2026/",
    label: "증권사 수수료 비교",
    description: "해외주식 환전 스프레드 참고",
  },
  {
    href: "/reports/sk-hynix-bonus-2027/",
    label: "하이닉스 2027 성과급 전망",
    description: "SK하이닉스 성과급 클러스터 연결",
  },
];
