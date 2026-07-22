export type WealthType = "inherited" | "self-made" | "mixed";

export type RankStatus = "up" | "down" | "same" | "new";

export type KoreaRichCurrentEntry = {
  rank: number;
  prevRank: number | null;
  rankStatus: RankStatus;
  name: string;
  nameEn?: string;
  slug: string;
  netWorthUsdB: number;
  prevNetWorthUsdB: number | null;
  sector: string;
  sourceOfWealth: string;
  wealthType: WealthType;
  summary: string;
  tags: string[];
};

export type FunConversionConfig = {
  usdKrwRate: number;
  seoul84PriceKrw: number;
  grandeurPriceKrw: number;
};

export type SectorSummary = {
  key: string;
  label: string;
  description: string;
};

export type WealthTypeSummary = {
  key: WealthType;
  label: string;
  description: string;
};

export type FaqItem = {
  q: string;
  a: string;
};

export type YearOverYearSummary = {
  reportLabel: string;
  totalTop50UsdB: number;
  totalTop50PrevUsdB: number;
  totalTop50ChangePercent: number;
  minEntryUsdB: number;
  minEntryPrevUsdB: number;
  newEntrantNames: string[];
};

export type KoreaRichTop10Seed = {
  meta: {
    title: string;
    subtitle: string;
    baseYearLabel: string;
    methodology: string;
    caution: string;
    primaryCurrency: "KRW";
    secondaryCurrency: "USD_BILLION";
  };
  conversionDefaults: FunConversionConfig;
  yearOverYear: YearOverYearSummary;
  entries: KoreaRichCurrentEntry[];
  sectorSummaries: SectorSummary[];
  wealthTypeSummaries: WealthTypeSummary[];
  interpretationPoints: { title: string; body: string }[];
  faq: FaqItem[];
};

export const koreaRichTop10Seed: KoreaRichTop10Seed = {
  meta: {
    title: "한국 부자 TOP 10 자산 비교 2026 | 이재용 216억 달러 1위",
    subtitle:
      "Forbes가 2026년 4월 발표한 Korea's 50 Richest 순위를 기준으로 한국 상위 부자 10명의 자산과 전년 대비 변화, 업종별 비중을 비교하고 서울 국평·그랜저로 환산해봅니다.",
    baseYearLabel: "2026년 4월 Forbes Korea's 50 Richest 발표 기준",
    methodology:
      "본 리포트는 Forbes가 2026년 4월 13일 발표한 Korea's 50 Richest 순위(2026년 3월 27일 기준 평가)를 바탕으로 구성했습니다. 자산은 주식 가격, 환율, 비상장기업 평가 등에 따라 달라질 수 있으며, Forbes 실시간 억만장자 자산과 연간 순위 평가액은 서로 다를 수 있습니다.",
    caution:
      "자산은 은행 예금 같은 현금 보유액이 아니라 상장주식·비상장지분 등을 추정한 시장가치입니다. 서울 국평과 그랜저 환산은 재미를 위한 참고 비교이며, 환율과 기준 가격은 직접 조정할 수 있습니다.",
    primaryCurrency: "KRW",
    secondaryCurrency: "USD_BILLION"
  },
  conversionDefaults: {
    usdKrwRate: 1480,
    seoul84PriceKrw: 1328680000,
    grandeurPriceKrw: 38570000
  },
  yearOverYear: {
    reportLabel: "Forbes Korea's 50 Richest 2026 (2025 대비)",
    totalTop50UsdB: 175,
    totalTop50PrevUsdB: 99,
    totalTop50ChangePercent: 77,
    minEntryUsdB: 1,
    minEntryPrevUsdB: 0.665,
    newEntrantNames: ["이서현", "윤대인"]
  },
  entries: [
    {
      rank: 1,
      prevRank: 2,
      rankStatus: "up",
      name: "이재용",
      nameEn: "Jay Y. Lee",
      slug: "jay-y-lee",
      netWorthUsdB: 21.6,
      prevNetWorthUsdB: 7.8,
      sector: "재벌/전자",
      sourceOfWealth: "Samsung Electronics",
      wealthType: "inherited",
      summary: "삼성전자 AI 반도체 수요 확대와 주가 상승에 힘입어 자산이 급증하며 2026년 한국 1위 자리를 되찾은 재벌 상속형 인물입니다.",
      tags: ["삼성", "전자", "재벌", "상속형", "AI반도체"]
    },
    {
      rank: 2,
      prevRank: 1,
      rankStatus: "down",
      name: "김병주",
      nameEn: "Michael Kim",
      slug: "michael-kim",
      netWorthUsdB: 9.9,
      prevNetWorthUsdB: 9.5,
      sector: "금융/PE",
      sourceOfWealth: "MBK Partners",
      wealthType: "self-made",
      summary: "MBK Partners를 통해 사모펀드 업계에서 자산을 키운 금융·투자형 자수성가 부호로, 2025년 1위에서 2026년 2위로 내려왔습니다.",
      tags: ["금융", "PE", "자수성가", "MBK"]
    },
    {
      rank: 3,
      prevRank: 4,
      rankStatus: "up",
      name: "서정진",
      nameEn: "Seo Jung-jin",
      slug: "seo-jung-jin",
      netWorthUsdB: 8.1,
      prevNetWorthUsdB: 6.3,
      sector: "바이오",
      sourceOfWealth: "Celltrion",
      wealthType: "self-made",
      summary: "셀트리온 기업가치 상승에 힘입어 자산이 늘며 2025년 4위에서 2026년 3위로 오른 대표적인 바이오 자수성가형 부호입니다.",
      tags: ["바이오", "셀트리온", "자수성가"]
    },
    {
      rank: 4,
      prevRank: 3,
      rankStatus: "down",
      name: "조정호",
      nameEn: "Cho Jung-ho",
      slug: "cho-jung-ho",
      netWorthUsdB: 8.0,
      prevNetWorthUsdB: 7.7,
      sector: "금융",
      sourceOfWealth: "Meritz Financial Group",
      wealthType: "self-made",
      summary: "메리츠금융지주를 기반으로 상위권을 유지하고 있는 금융업종 대표 자수성가형 부호입니다.",
      tags: ["금융", "메리츠", "자수성가"]
    },
    {
      rank: 5,
      prevRank: 9,
      rankStatus: "up",
      name: "이부진",
      nameEn: "Lee Boo-jin",
      slug: "lee-boo-jin",
      netWorthUsdB: 7.9,
      prevNetWorthUsdB: 3.1,
      sector: "재벌/서비스",
      sourceOfWealth: "Hotel Shilla / Samsung-related holdings",
      wealthType: "inherited",
      summary: "호텔신라 및 삼성 관련 지분 가치 상승으로 2025년 9위에서 2026년 5위로 순위가 크게 오른 재벌 상속형 인물입니다.",
      tags: ["호텔신라", "삼성", "서비스", "상속형"]
    },
    {
      rank: 6,
      prevRank: null,
      rankStatus: "new",
      name: "이서현",
      nameEn: "Lee Seo-hyun",
      slug: "lee-seo-hyun",
      netWorthUsdB: 7.5,
      prevNetWorthUsdB: null,
      sector: "재벌/서비스",
      sourceOfWealth: "Samsung C&T",
      wealthType: "inherited",
      summary: "삼성물산 지분과 경영권을 바탕으로 2026년 처음 TOP10에 진입한 삼성가 상속형 인물입니다.",
      tags: ["삼성", "삼성물산", "재벌", "상속형", "신규진입"]
    },
    {
      rank: 7,
      prevRank: 5,
      rankStatus: "down",
      name: "정몽구",
      nameEn: "Chung Mong-koo",
      slug: "chung-mong-koo",
      netWorthUsdB: 7.3,
      prevNetWorthUsdB: 3.9,
      sector: "자동차/재벌",
      sourceOfWealth: "Hyundai Motor / Kia",
      wealthType: "inherited",
      summary: "현대자동차그룹 지분 가치가 함께 올랐지만 다른 인물들의 증가폭이 더 커 2025년 5위에서 2026년 7위로 내려간 재벌 상속형 인물입니다.",
      tags: ["현대차", "기아", "자동차", "재벌", "상속형"]
    },
    {
      rank: 8,
      prevRank: 8,
      rankStatus: "same",
      name: "홍라희",
      nameEn: "Hong Ra-hee",
      slug: "hong-ra-hee",
      netWorthUsdB: 7.1,
      prevNetWorthUsdB: 3.2,
      sector: "재벌/전자",
      sourceOfWealth: "Samsung-related holdings",
      wealthType: "inherited",
      summary: "삼성 관련 지분을 바탕으로 2025년에 이어 2026년에도 8위를 유지한 삼성가 상속형 인물입니다.",
      tags: ["삼성", "재벌", "상속형"]
    },
    {
      rank: 9,
      prevRank: 10,
      rankStatus: "up",
      name: "정의선",
      nameEn: "Chung Eui-sun",
      slug: "chung-eui-sun",
      netWorthUsdB: 6.3,
      prevNetWorthUsdB: 3.0,
      sector: "자동차/재벌",
      sourceOfWealth: "Hyundai Motor Group",
      wealthType: "inherited",
      summary: "현대차그룹 경영권과 지분을 바탕으로 2025년 10위에서 2026년 9위로 한 단계 오른 재벌 상속형 인물입니다.",
      tags: ["현대차", "자동차", "재벌", "상속형"]
    },
    {
      rank: 10,
      prevRank: null,
      rankStatus: "new",
      name: "윤대인",
      nameEn: "Yoon Dae-in",
      slug: "yoon-dae-in",
      netWorthUsdB: 5.9,
      prevNetWorthUsdB: null,
      sector: "제약/바이오",
      sourceOfWealth: "Samchundang Pharm",
      wealthType: "self-made",
      summary: "1986년 삼천당제약을 인수해 성장시킨 뒤 2026년 처음 TOP10에 진입한 제약업종 자수성가형 인물입니다.",
      tags: ["제약", "삼천당제약", "자수성가", "신규진입"]
    }
  ],
  sectorSummaries: [
    {
      key: "chaebol-electronics",
      label: "재벌·전자",
      description: "이재용, 홍라희 등 삼성가 인물이 AI 반도체 랠리에 힘입어 최상위권을 차지하고 있습니다."
    },
    {
      key: "finance-pe",
      label: "금융·사모펀드",
      description: "김병주, 조정호처럼 금융·투자업에서 큰 자산을 형성한 인물이 꾸준히 상위권에 자리합니다."
    },
    {
      key: "biotech-pharma",
      label: "바이오·제약",
      description: "서정진(셀트리온), 윤대인(삼천당제약)처럼 바이오·제약 업종도 상위권에서 강한 존재감을 보여줍니다."
    },
    {
      key: "chaebol-service",
      label: "재벌·서비스",
      description: "이부진(호텔신라), 이서현(삼성물산)처럼 서비스·유통 계열사를 기반으로 한 삼성가 자산가도 상위권에 있습니다."
    },
    {
      key: "automotive-chaebol",
      label: "자동차·재벌",
      description: "정몽구, 정의선 등 현대차그룹 기반 자산가가 꾸준히 상위권에 올라와 있습니다."
    }
  ],
  wealthTypeSummaries: [
    {
      key: "inherited",
      label: "상속형",
      description: "이재용, 이부진, 이서현, 정몽구, 홍라희, 정의선 등 6명으로, 기존 재벌 지분 상속과 승계를 통해 자산을 유지·확대한 유형입니다."
    },
    {
      key: "self-made",
      label: "자수성가형",
      description: "김병주, 서정진, 조정호, 윤대인 등 4명으로, 창업·인수·투자를 통해 부를 새로 형성한 유형입니다."
    },
    {
      key: "mixed",
      label: "혼합형",
      description: "기존 기반과 새로운 투자·경영 성과가 함께 작용한 유형으로, 상속과 자수성가 사이 경계가 뚜렷하지 않은 경우를 가리킵니다."
    }
  ],
  interpretationPoints: [
    {
      title: "재벌 상속형이 다시 최상위권을 장악",
      body: "이재용이 1위를 되찾고 이부진·이서현이 나란히 TOP10에 새로 진입하면서, 2026년 TOP10 중 6명이 재벌 상속형으로 채워졌습니다."
    },
    {
      title: "금융·바이오 자수성가형도 견조",
      body: "김병주, 조정호, 서정진, 윤대인 등 자수성가형 4명이 여전히 상위권을 지키며 상속형과 균형을 이루고 있습니다."
    },
    {
      title: "플랫폼 창업자는 TOP10 밖으로 밀려남",
      body: "2025년 상위권이던 쿠팡 김범석, 카카오 김범수는 반도체·재벌·바이오 자산의 증가폭에 밀려 2026년 TOP10에서 빠졌습니다."
    }
  ],
  faq: [
    {
      q: "2026년 한국 1위 부자는 누구인가요?",
      a: "이재용 삼성전자 회장이 216억 달러(약 32조 원)로 2026년 한국 1위입니다. AI 반도체 수요 확대로 전년 대비 자산이 가장 많이 늘며 2025년 2위에서 1위로 올라섰습니다."
    },
    {
      q: "한국 부자 순위의 자산은 현금을 의미하나요?",
      a: "아닙니다. 상장주식, 비상장기업 지분, 가족 공동자산 등을 시장가치로 추정한 순자산 추정치입니다. 대부분 현금화하려면 주가 충격, 세금, 경영권 변화 같은 문제가 따를 수 있어 보유 자산 전체를 현금 보유액으로 보기는 어렵습니다."
    },
    {
      q: "순위는 왜 매년 이렇게 크게 바뀌나요?",
      a: "보유 기업의 주가, 환율, 비상장기업 평가, 지분율 변화에 따라 자산이 달라지기 때문입니다. 2026년에는 AI 반도체 랠리로 삼성전자 관련 자산가들의 순위가 특히 크게 뛰었습니다."
    },
    {
      q: "서울 국평 몇 채, 그랜저 몇 대는 정확한 값인가요?",
      a: "아닙니다. 현재 환율과 기준 가격을 바탕으로 계산한 참고용 환산값이며, 실제 구매 가능한 수량을 의미하지 않습니다."
    },
    {
      q: "환율과 가격을 왜 바꿀 수 있게 하나요?",
      a: "원화 환산 결과는 환율과 기준 가격에 따라 달라지기 때문에, 사용자가 직접 조정할 수 있게 하는 편이 더 직관적입니다."
    },
    {
      q: "상속형과 자수성가형은 어떻게 나누나요?",
      a: "공개된 기업 배경과 부의 원천을 바탕으로 단순화한 분류입니다. 상속받은 지분을 기반으로 기업가치를 크게 키운 경우처럼 두 유형이 뚜렷하게 나뉘지 않는 사례도 있습니다."
    }
  ]
};

export function usdBillionToKrw(netWorthUsdB: number, usdKrwRate: number): number {
  return netWorthUsdB * 1000000000 * usdKrwRate;
}

export function krwToSeoul84Count(krwValue: number, seoul84PriceKrw: number): number {
  return krwValue / seoul84PriceKrw;
}

export function krwToGrandeurCount(krwValue: number, grandeurPriceKrw: number): number {
  return krwValue / grandeurPriceKrw;
}

export function formatKrwLarge(value: number): string {
  const jo = Math.floor(value / 1000000000000);
  const remainder = value % 1000000000000;
  const eok = Math.floor(remainder / 100000000);

  if (jo > 0) {
    return `${jo.toLocaleString("ko-KR")}조 ${eok.toLocaleString("ko-KR")}억 원`;
  }

  return `${Math.floor(value / 100000000).toLocaleString("ko-KR")}억 원`;
}

export function formatUsdB(value: number): string {
  return `$${value.toFixed(1)}B`;
}

export type KoreaRichYearPoint = {
  year: number;
  netWorthUsdB: number | null;
  inTop10: boolean | null;
  sourceRef: string | null;
};

export type KoreaCurrentTop10History = {
  rank: number;
  name: string;
  nameEn?: string;
  slug: string;
  sector: string;
  sourceOfWealth: string;
  wealthType: WealthType;
  history: KoreaRichYearPoint[];
};

export const koreaCurrentTop10HistorySeed: KoreaCurrentTop10History[] = [
  {
    rank: 1,
    name: "이재용",
    nameEn: "Jay Y. Lee",
    slug: "jay-y-lee",
    sector: "재벌/전자",
    sourceOfWealth: "Samsung",
    wealthType: "inherited",
    history: [
      { year: 2016, netWorthUsdB: 6.2, inTop10: true, sourceRef: "Forbes Korea 2016 snippet" },
      { year: 2017, netWorthUsdB: 6.2, inTop10: true, sourceRef: "Forbes Korea 2017 snippet" },
      { year: 2018, netWorthUsdB: 7.9, inTop10: true, sourceRef: "Forbes Korea 2018 snippet" },
      { year: 2019, netWorthUsdB: 6.1, inTop10: true, sourceRef: "Forbes Korea 2019 snippet" },
      { year: 2020, netWorthUsdB: 6.7, inTop10: true, sourceRef: "Forbes Korea 2020 snippet" },
      { year: 2021, netWorthUsdB: 12.4, inTop10: true, sourceRef: "Forbes Korea 2021 snippet" },
      { year: 2022, netWorthUsdB: 9.2, inTop10: true, sourceRef: "Forbes Korea 2022 snippet" },
      { year: 2023, netWorthUsdB: 8.0, inTop10: true, sourceRef: "Forbes Korea 2023 snippet" },
      { year: 2024, netWorthUsdB: 11.5, inTop10: true, sourceRef: "Forbes Korea 2024 snippet" },
      { year: 2025, netWorthUsdB: 7.8, inTop10: true, sourceRef: "Forbes Korea 2025 list" },
      { year: 2026, netWorthUsdB: 21.6, inTop10: true, sourceRef: "Forbes Korea 2026 list" }
    ]
  },
  {
    rank: 2,
    name: "김병주",
    nameEn: "Michael Kim",
    slug: "michael-kim",
    sector: "금융/PE",
    sourceOfWealth: "MBK Partners",
    wealthType: "self-made",
    history: [
      { year: 2016, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2017, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2018, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2019, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2020, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2021, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2022, netWorthUsdB: 7.7, inTop10: true, sourceRef: "Forbes Korea 2022 snippet" },
      { year: 2023, netWorthUsdB: 9.7, inTop10: true, sourceRef: "Forbes Korea 2023 snippet" },
      { year: 2024, netWorthUsdB: 9.7, inTop10: true, sourceRef: "Forbes Korea 2024 snippet" },
      { year: 2025, netWorthUsdB: 9.5, inTop10: true, sourceRef: "Forbes Korea 2025 list" },
      { year: 2026, netWorthUsdB: 9.9, inTop10: true, sourceRef: "Forbes Korea 2026 list" }
    ]
  },
  {
    rank: 3,
    name: "서정진",
    nameEn: "Seo Jung-jin",
    slug: "seo-jung-jin",
    sector: "바이오",
    sourceOfWealth: "Celltrion",
    wealthType: "self-made",
    history: [
      { year: 2016, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2017, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2018, netWorthUsdB: 11.0, inTop10: true, sourceRef: "Forbes Korea 2018 snippet" },
      { year: 2019, netWorthUsdB: 7.4, inTop10: true, sourceRef: "Forbes Korea 2019 snippet" },
      { year: 2020, netWorthUsdB: 11.4, inTop10: true, sourceRef: "Forbes Korea 2020 snippet" },
      { year: 2021, netWorthUsdB: 12.5, inTop10: true, sourceRef: "Forbes Korea 2021 snippet" },
      { year: 2022, netWorthUsdB: 6.9, inTop10: true, sourceRef: "Forbes Korea 2022 snippet" },
      { year: 2023, netWorthUsdB: 5.7, inTop10: true, sourceRef: "Forbes Korea 2023 snippet" },
      { year: 2024, netWorthUsdB: 7.5, inTop10: true, sourceRef: "Forbes Korea 2024 snippet" },
      { year: 2025, netWorthUsdB: 6.3, inTop10: true, sourceRef: "Forbes Korea 2025 list" },
      { year: 2026, netWorthUsdB: 8.1, inTop10: true, sourceRef: "Forbes Korea 2026 list" }
    ]
  },
  {
    rank: 4,
    name: "조정호",
    nameEn: "Cho Jung-ho",
    slug: "cho-jung-ho",
    sector: "금융",
    sourceOfWealth: "Meritz Financial Group",
    wealthType: "self-made",
    history: [
      { year: 2016, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2017, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2018, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2019, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2020, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2021, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2022, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2023, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2024, netWorthUsdB: 6.2, inTop10: true, sourceRef: "Forbes Korea 2024 snippet" },
      { year: 2025, netWorthUsdB: 7.7, inTop10: true, sourceRef: "Forbes Korea 2025 list" },
      { year: 2026, netWorthUsdB: 8.0, inTop10: true, sourceRef: "Forbes Korea 2026 list" }
    ]
  },
  {
    rank: 5,
    name: "이부진",
    nameEn: "Lee Boo-jin",
    slug: "lee-boo-jin",
    sector: "재벌/서비스",
    sourceOfWealth: "Hotel Shilla / Samsung-related holdings",
    wealthType: "inherited",
    history: [
      { year: 2016, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2017, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2018, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2019, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2020, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2021, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2022, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2023, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2024, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2025, netWorthUsdB: 3.1, inTop10: true, sourceRef: "Forbes Korea 2025 list" },
      { year: 2026, netWorthUsdB: 7.9, inTop10: true, sourceRef: "Forbes Korea 2026 list" }
    ]
  },
  {
    rank: 6,
    name: "이서현",
    nameEn: "Lee Seo-hyun",
    slug: "lee-seo-hyun",
    sector: "재벌/서비스",
    sourceOfWealth: "Samsung C&T",
    wealthType: "inherited",
    history: [
      { year: 2016, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2017, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2018, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2019, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2020, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2021, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2022, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2023, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2024, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2025, netWorthUsdB: null, inTop10: false, sourceRef: null },
      { year: 2026, netWorthUsdB: 7.5, inTop10: true, sourceRef: "Forbes Korea 2026 list" }
    ]
  },
  {
    rank: 7,
    name: "정몽구",
    nameEn: "Chung Mong-koo",
    slug: "chung-mong-koo",
    sector: "자동차/재벌",
    sourceOfWealth: "Hyundai Motor / Kia",
    wealthType: "inherited",
    history: [
      { year: 2016, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2017, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2018, netWorthUsdB: 4.9, inTop10: true, sourceRef: "Forbes Korea 2018 snippet" },
      { year: 2019, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2020, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2021, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2022, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2023, netWorthUsdB: 4.1, inTop10: true, sourceRef: "Forbes Korea 2023 snippet" },
      { year: 2024, netWorthUsdB: 4.6, inTop10: true, sourceRef: "Forbes Korea 2024 snippet" },
      { year: 2025, netWorthUsdB: 3.9, inTop10: true, sourceRef: "Forbes Korea 2025 list" },
      { year: 2026, netWorthUsdB: 7.3, inTop10: true, sourceRef: "Forbes Korea 2026 list" }
    ]
  },
  {
    rank: 8,
    name: "홍라희",
    nameEn: "Hong Ra-hee",
    slug: "hong-ra-hee",
    sector: "재벌/전자",
    sourceOfWealth: "Samsung-related holdings",
    wealthType: "inherited",
    history: [
      { year: 2016, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2017, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2018, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2019, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2020, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2021, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2022, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2023, netWorthUsdB: 4.9, inTop10: true, sourceRef: "Forbes Korea 2023 snippet" },
      { year: 2024, netWorthUsdB: 4.4, inTop10: true, sourceRef: "Forbes Korea 2024 snippet" },
      { year: 2025, netWorthUsdB: 3.2, inTop10: true, sourceRef: "Forbes Korea 2025 list" },
      { year: 2026, netWorthUsdB: 7.1, inTop10: true, sourceRef: "Forbes Korea 2026 list" }
    ]
  },
  {
    rank: 9,
    name: "정의선",
    nameEn: "Chung Eui-sun",
    slug: "chung-eui-sun",
    sector: "자동차/재벌",
    sourceOfWealth: "Hyundai Motor Group",
    wealthType: "inherited",
    history: [
      { year: 2016, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2017, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2018, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2019, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2020, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2021, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2022, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2023, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2024, netWorthUsdB: 3.4, inTop10: true, sourceRef: "Forbes Korea 2024 snippet" },
      { year: 2025, netWorthUsdB: 3.0, inTop10: true, sourceRef: "Forbes Korea 2025 list" },
      { year: 2026, netWorthUsdB: 6.3, inTop10: true, sourceRef: "Forbes Korea 2026 list" }
    ]
  },
  {
    rank: 10,
    name: "윤대인",
    nameEn: "Yoon Dae-in",
    slug: "yoon-dae-in",
    sector: "제약/바이오",
    sourceOfWealth: "Samchundang Pharm",
    wealthType: "self-made",
    history: [
      { year: 2016, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2017, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2018, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2019, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2020, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2021, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2022, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2023, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2024, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2025, netWorthUsdB: null, inTop10: false, sourceRef: null },
      { year: 2026, netWorthUsdB: 5.9, inTop10: true, sourceRef: "Forbes Korea 2026 list" }
    ]
  }
];
