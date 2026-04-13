export const CTC_RULES = {
  taxStartDateLabel: "2027년 1월 1일 이후 양도·대여분",
  basicDeduction: 2_500_000,
  incomeTaxRate: 0.2,
  localTaxRate: 0.02,
  effectiveTaxRate: 0.22,
  defaultBuyFeeRate: 0.0005,
  defaultSellFeeRate: 0.0005,
  defaultTaxYear: 2027,
};

export const CTC_DEFAULT_INPUT = {
  assetName: "BTC",
  averageBuyPrice: 10_000_000,
  quantity: 1,
  sellPrice: 100_000_000,
  buyFeeRate: CTC_RULES.defaultBuyFeeRate,
  sellFeeRate: CTC_RULES.defaultSellFeeRate,
  extraCost: 0,
  taxMode: "effective" as "effective" | "incomeTaxOnly",
  taxYear: CTC_RULES.defaultTaxYear,
};

export const CTC_ASSET_PRESETS = [
  { label: "BTC", value: "BTC" },
  { label: "ETH", value: "ETH" },
  { label: "XRP", value: "XRP" },
  { label: "SOL", value: "SOL" },
  { label: "DOGE", value: "DOGE" },
];

export const CTC_SCENARIO_PRESETS = [
  {
    id: "btc-1eok",
    label: "BTC 1천만→1억",
    summary: "세전 수익이 세후 기준으로 얼마나 줄어드는지 감을 잡기 좋은 대표 예시",
    values: {
      assetName: "BTC",
      averageBuyPrice: 10_000_000,
      quantity: 1,
      sellPrice: 100_000_000,
      buyFeeRate: 0.0005,
      sellFeeRate: 0.0005,
      extraCost: 0,
    },
  },
  {
    id: "eth-10",
    label: "ETH 200만→350만",
    summary: "알트코인 수익 실현 때 세전·세후 차이를 가볍게 확인하기 좋은 예시",
    values: {
      assetName: "ETH",
      averageBuyPrice: 2_000_000,
      quantity: 10,
      sellPrice: 3_500_000,
      buyFeeRate: 0.0005,
      sellFeeRate: 0.0005,
      extraCost: 0,
    },
  },
  {
    id: "under-deduction",
    label: "250만 이하 수익",
    summary: "기본공제 범위 안에서는 예상 세금이 0원으로 처리되는 예시",
    values: {
      assetName: "XRP",
      averageBuyPrice: 1_000,
      quantity: 5_000,
      sellPrice: 1_510,
      buyFeeRate: 0.0005,
      sellFeeRate: 0.0005,
      extraCost: 0,
    },
  },
];

export const CTC_FAQ = [
  {
    question: "코인 세금은 언제부터 적용되나요?",
    answer:
      "국세청 공개 안내 기준으로 가상자산소득 과세는 2027년 1월 1일 이후 양도·대여분부터 적용되는 흐름을 반영했습니다. 실제 신고 시점에는 최신 법령과 공지 변경 여부를 함께 확인하는 편이 안전합니다.",
  },
  {
    question: "250만원 기본공제는 어떻게 반영되나요?",
    answer:
      "가상자산 양도차익에서 연 250만원을 먼저 차감하고 남는 금액을 과세표준으로 보는 구조를 기준으로 계산합니다. 이 계산기는 단일 코인 기준으로 빠르게 감을 잡는 데 초점을 둔 참고용 도구입니다.",
  },
  {
    question: "수수료도 비용으로 반영되나요?",
    answer:
      "계산기에서는 매수 수수료와 매도 수수료를 모두 비용으로 반영해 양도차익을 계산합니다. 다만 실제 필요경비 인정 범위는 거래 기록과 신고 기준에 따라 달라질 수 있습니다.",
  },
  {
    question: "22% 세율이 왜 기본값인가요?",
    answer:
      "국세 20%에 지방소득세를 반영한 체감 계산값으로 22%를 기본값으로 제공합니다. 필요하면 화면에서 국세 20% 기준으로 바로 전환해서 비교할 수 있습니다.",
  },
  {
    question: "여러 코인을 한 번에 계산할 수 있나요?",
    answer:
      "현재 MVP는 단일 코인 기준입니다. 대신 실제 사용 흐름을 고려해 이후 버전에서는 여러 코인 합산과 기간 손익 통합 계산으로 확장할 수 있게 구조를 잡아두었습니다.",
  },
];

export const CTC_RELATED_LINKS = [
  { href: "/tools/dca-investment-calculator/", label: "분할매수 수익 비교 계산기" },
  { href: "/tools/fire-calculator/", label: "파이어 계산기" },
  { href: "/tools/salary-tier/", label: "연봉 티어 계산기" },
  { href: "/reports/korea-rich-top10-assets/", label: "한국 부자 TOP10 자산 비교" },
];

export const CTC_NEXT_CONTENT = {
  eyebrow: "계산기 이어보기",
  title: "세금 계산 다음에 바로 비교해볼 투자 콘텐츠",
  desc: "코인 매도 세금만 보면 판단이 끊기기 쉬워서, 수익률 비교와 자산 계획 흐름으로 자연스럽게 이어볼 수 있게 묶었습니다.",
  href: "/tools/dca-investment-calculator/",
  cta: "분할매수 수익 계산기 보기",
  badges: ["투자 비교", "세후 기준", "자산 감각"],
  sub: [
    {
      href: "/tools/fire-calculator/",
      title: "파이어 계산기",
      desc: "세후 차익이 장기 생활비 기준으로 어느 정도 의미가 있는지 같이 확인해보세요.",
      badges: ["은퇴 계획"],
    },
    {
      href: "/tools/salary-tier/",
      title: "연봉 티어 계산기",
      desc: "근로소득과 투자 차익을 함께 보면서 체감 자산 규모를 비교하기 좋습니다.",
      badges: ["소득 비교"],
    },
    {
      href: "/reports/korea-rich-top10-assets/",
      title: "한국 부자 TOP10 자산 비교",
      desc: "자산 규모 감각을 넓히고 싶다면 상위 자산가 비교 리포트까지 이어서 보세요.",
      badges: ["리포트"],
    },
  ],
};

export const CTC_SOURCE_LINKS = [
  {
    href: "https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=238935&mi=40370",
    label: "국세청 가상자산소득 과세 개요",
    source: "국세청",
    title: "거주자의 가상자산소득 과세 개요",
    desc: "가상자산 과세 시기, 기본공제, 세율 기준을 공식 문서로 확인할 수 있습니다.",
  },
  {
    href: "https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%EC%86%8C%EB%93%9D%EC%84%B8%EB%B2%95",
    label: "소득세법",
    source: "국가법령정보센터",
    title: "소득세법",
    desc: "실제 신고 판단 전에는 최신 법령 문구와 개정 여부를 함께 확인하는 편이 안전합니다.",
  },
];
