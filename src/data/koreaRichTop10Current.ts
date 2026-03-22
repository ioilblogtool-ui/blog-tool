export type WealthType = "inherited" | "self-made" | "mixed";

export type KoreaRichCurrentEntry = {
  rank: number;
  name: string;
  nameEn?: string;
  slug: string;
  netWorthUsdB: number;
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
  entries: KoreaRichCurrentEntry[];
  sectorSummaries: SectorSummary[];
  wealthTypeSummaries: WealthTypeSummary[];
  interpretationPoints: { title: string; body: string }[];
  faq: FaqItem[];
};

export const koreaRichTop10Seed: KoreaRichTop10Seed = {
  meta: {
    title: "한국 부자 TOP 10 자산 비교 리포트",
    subtitle:
      "2026년 현재 볼 수 있는 최신 공개 기준으로, 자산 규모와 서울 국평·그랜저 환산값까지 함께 봅니다.",
    baseYearLabel: "2026년 현재 최신 공개 기준(2025 Forbes Korea 발표본)",
    methodology:
      "2026년 현재 공개된 최신 Forbes Korea 순위(2025 발표본)를 기준으로 정리했습니다.",
    caution:
      "서울 국평과 그랜저 환산은 재미를 위한 참고 비교입니다. 환율과 기준 가격은 바뀔 수 있어 직접 조정할 수 있습니다.",
    primaryCurrency: "KRW",
    secondaryCurrency: "USD_BILLION"
  },
  conversionDefaults: {
    usdKrwRate: 1500,
    seoul84PriceKrw: 1328680000,
    grandeurPriceKrw: 38570000
  },
  entries: [
    {
      rank: 1,
      name: "김병주",
      nameEn: "Michael Kim",
      slug: "michael-kim",
      netWorthUsdB: 9.5,
      sector: "금융/PE",
      sourceOfWealth: "MBK Partners",
      wealthType: "self-made",
      summary: "MBK Partners를 통해 사모펀드 업계에서 큰 자산을 형성한 금융·투자형 자수성가 부호입니다.",
      tags: ["금융", "PE", "자수성가", "MBK"]
    },
    {
      rank: 2,
      name: "이재용",
      nameEn: "Jay Y. Lee",
      slug: "jay-y-lee",
      netWorthUsdB: 7.8,
      sector: "재벌/전자",
      sourceOfWealth: "Samsung",
      wealthType: "inherited",
      summary: "삼성 지분과 경영권을 중심으로 자산을 보유한 대표적인 재벌 상속형 상위 부호입니다.",
      tags: ["삼성", "전자", "재벌", "상속형"]
    },
    {
      rank: 3,
      name: "조정호",
      nameEn: "Cho Jung-ho",
      slug: "cho-jung-ho",
      netWorthUsdB: 7.7,
      sector: "금융",
      sourceOfWealth: "Meritz Financial Group",
      wealthType: "self-made",
      summary: "메리츠금융지주 기반으로 최근 상위권에 안착한 금융업종 대표 부호입니다.",
      tags: ["금융", "메리츠", "자수성가"]
    },
    {
      rank: 4,
      name: "서정진",
      nameEn: "Seo Jung-jin",
      slug: "seo-jung-jin",
      netWorthUsdB: 6.3,
      sector: "바이오",
      sourceOfWealth: "Celltrion",
      wealthType: "self-made",
      summary: "셀트리온을 통해 바이오 업종에서 부를 만든 대표적인 자수성가형 부호입니다.",
      tags: ["바이오", "셀트리온", "자수성가"]
    },
    {
      rank: 5,
      name: "정몽구",
      nameEn: "Chung Mong-koo",
      slug: "chung-mong-koo",
      netWorthUsdB: 3.9,
      sector: "자동차/재벌",
      sourceOfWealth: "Hyundai Motor / Kia",
      wealthType: "inherited",
      summary: "현대자동차그룹 기반의 전통 제조업·재벌 자산을 대표하는 인물입니다.",
      tags: ["현대차", "기아", "자동차", "재벌", "상속형"]
    },
    {
      rank: 6,
      name: "김범석",
      nameEn: "Bom Kim",
      slug: "bom-kim",
      netWorthUsdB: 3.4,
      sector: "이커머스/플랫폼",
      sourceOfWealth: "Coupang",
      wealthType: "self-made",
      summary: "쿠팡을 통해 이커머스·플랫폼 부문에서 자산을 형성한 신흥 자수성가형 부호입니다.",
      tags: ["쿠팡", "이커머스", "플랫폼", "자수성가"]
    },
    {
      rank: 7,
      name: "김범수",
      nameEn: "Kim Beom-su",
      slug: "kim-beom-su",
      netWorthUsdB: 3.3,
      sector: "플랫폼/인터넷",
      sourceOfWealth: "Kakao",
      wealthType: "self-made",
      summary: "카카오를 중심으로 인터넷·플랫폼 분야에서 부를 만든 대표적인 자수성가형 부호입니다.",
      tags: ["카카오", "인터넷", "플랫폼", "자수성가"]
    },
    {
      rank: 8,
      name: "홍라희",
      nameEn: "Hong Ra-hee",
      slug: "hong-ra-hee",
      netWorthUsdB: 3.2,
      sector: "재벌/전자",
      sourceOfWealth: "Samsung-related holdings",
      wealthType: "inherited",
      summary: "삼성가 상속 자산을 대표하는 상위 부호로, 삼성 지분 가치와 함께 언급됩니다.",
      tags: ["삼성", "재벌", "상속형"]
    },
    {
      rank: 9,
      name: "이부진",
      nameEn: "Lee Boo-jin",
      slug: "lee-boo-jin",
      netWorthUsdB: 3.1,
      sector: "재벌/서비스",
      sourceOfWealth: "Hotel Shilla / Samsung-related holdings",
      wealthType: "inherited",
      summary: "호텔신라 및 삼성가 관련 지분을 바탕으로 한 상위 재벌 자산가입니다.",
      tags: ["호텔신라", "삼성", "서비스", "상속형"]
    },
    {
      rank: 10,
      name: "정의선",
      nameEn: "Chung Eui-sun",
      slug: "chung-eui-sun",
      netWorthUsdB: 3.0,
      sector: "자동차/재벌",
      sourceOfWealth: "Hyundai Motor Group",
      wealthType: "inherited",
      summary: "현대차그룹 차세대 경영권과 지분을 중심으로 자산을 보유한 상위 부호입니다.",
      tags: ["현대차", "자동차", "재벌", "상속형"]
    }
  ],
  sectorSummaries: [
    {
      key: "finance-pe",
      label: "금융·사모펀드",
      description: "김병주, 조정호처럼 금융·투자업에서 큰 자산을 형성한 인물이 상위권에 자리합니다."
    },
    {
      key: "chaebol-electronics",
      label: "재벌·전자",
      description: "삼성가 인물들이 여전히 상위권에 포진해 있어 전통 재벌 자산의 존재감이 큽니다."
    },
    {
      key: "biotech",
      label: "바이오",
      description: "서정진 사례처럼 바이오 업종도 한국 상위 부호권에서 강한 존재감을 보여줍니다."
    },
    {
      key: "platform-ecommerce",
      label: "플랫폼·이커머스",
      description: "카카오와 쿠팡처럼 디지털 플랫폼 기반 자산가도 상위권에 진입해 있습니다."
    },
    {
      key: "automotive-chaebol",
      label: "자동차·재벌",
      description: "현대차그룹 기반 자산가가 꾸준히 상위권에 올라와 있습니다."
    }
  ],
  wealthTypeSummaries: [
    {
      key: "inherited",
      label: "상속형",
      description: "기존 재벌 지분 상속과 승계를 통해 자산을 유지·확대한 유형입니다."
    },
    {
      key: "self-made",
      label: "자수성가형",
      description: "창업, 투자, 플랫폼, 바이오 등으로 부를 새로 형성한 유형입니다."
    },
    {
      key: "mixed",
      label: "혼합형",
      description: "기존 기반과 새로운 투자·경영 성과가 함께 작용한 유형입니다."
    }
  ],
  interpretationPoints: [
    {
      title: "금융·투자형 상위권 부상",
      body: "김병주와 조정호처럼 금융·투자 기반 자산가가 상단을 차지해, 예전보다 상위권 구성이 더 다양해졌습니다."
    },
    {
      title: "재벌 상속형 자산은 여전히 강함",
      body: "삼성가와 현대차그룹 인물들이 여전히 상위권에 자리해, 전통 재벌 자산의 영향력도 여전히 큽니다."
    },
    {
      title: "바이오와 플랫폼의 존재감",
      body: "셀트리온, 카카오, 쿠팡처럼 바이오와 플랫폼 분야가 최근 한국 부의 지형을 더 복합적으로 만들고 있습니다."
    }
  ],
  faq: [
    {
      q: "왜 2026년 현재인데 2025 Forbes 순위를 쓰나요?",
      a: "2026년 현재 공개된 최신 Forbes Korea 부자 순위 발표본이 2025 리스트이기 때문입니다."
    },
    {
      q: "자산은 어떤 기준으로 계산되나요?",
      a: "Forbes가 공개한 순위와 자산 추정치를 기준으로 사용하며, 주식 가치와 환율에 따라 달라질 수 있습니다."
    },
    {
      q: "서울 국평 몇 채, 그랜저 몇 대는 정확한 값인가요?",
      a: "아닙니다. 현재 환율과 기준 가격을 바탕으로 계산한 참고용 환산값입니다."
    },
    {
      q: "환율과 가격을 왜 바꿀 수 있게 하나요?",
      a: "원화 환산 결과는 환율과 기준 가격에 따라 달라지기 때문에, 사용자가 직접 조정할 수 있게 하는 편이 더 직관적입니다."
    },
    {
      q: "상속형과 자수성가형은 어떻게 나누나요?",
      a: "공개된 기업 배경과 부의 원천을 바탕으로 단순화한 분류입니다."
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
  rank2025: number;
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
    rank2025: 1,
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
      { year: 2025, netWorthUsdB: 9.5, inTop10: true, sourceRef: "Forbes Korea 2025 list" }
    ]
  },
  {
    rank2025: 2,
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
      { year: 2025, netWorthUsdB: 7.8, inTop10: true, sourceRef: "Forbes Korea 2025 list" }
    ]
  },
  {
    rank2025: 3,
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
      { year: 2025, netWorthUsdB: 7.7, inTop10: true, sourceRef: "Forbes Korea 2025 list" }
    ]
  },
  {
    rank2025: 4,
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
      { year: 2025, netWorthUsdB: 6.3, inTop10: true, sourceRef: "Forbes Korea 2025 list" }
    ]
  },
  {
    rank2025: 5,
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
      { year: 2025, netWorthUsdB: 3.9, inTop10: true, sourceRef: "Forbes Korea 2025 list" }
    ]
  },
  {
    rank2025: 6,
    name: "김범석",
    nameEn: "Bom Kim",
    slug: "bom-kim",
    sector: "이커머스/플랫폼",
    sourceOfWealth: "Coupang",
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
      { year: 2025, netWorthUsdB: 3.4, inTop10: true, sourceRef: "Forbes Korea 2025 list" }
    ]
  },
  {
    rank2025: 7,
    name: "김범수",
    nameEn: "Kim Beom-su",
    slug: "kim-beom-su",
    sector: "플랫폼/인터넷",
    sourceOfWealth: "Kakao",
    wealthType: "self-made",
    history: [
      { year: 2016, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2017, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2018, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2019, netWorthUsdB: null, inTop10: null, sourceRef: null },
      { year: 2020, netWorthUsdB: 5.3, inTop10: true, sourceRef: "Forbes Korea 2020 snippet" },
      { year: 2021, netWorthUsdB: 10.6, inTop10: true, sourceRef: "Forbes Korea 2021 snippet" },
      { year: 2022, netWorthUsdB: 9.6, inTop10: true, sourceRef: "Forbes Korea 2022 snippet" },
      { year: 2023, netWorthUsdB: 5.0, inTop10: true, sourceRef: "Forbes Korea 2023 snippet" },
      { year: 2024, netWorthUsdB: 4.5, inTop10: true, sourceRef: "Forbes Korea 2024 snippet" },
      { year: 2025, netWorthUsdB: 3.3, inTop10: true, sourceRef: "Forbes Korea 2025 list" }
    ]
  },
  {
    rank2025: 8,
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
      { year: 2025, netWorthUsdB: 3.2, inTop10: true, sourceRef: "Forbes Korea 2025 list" }
    ]
  },
  {
    rank2025: 9,
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
      { year: 2025, netWorthUsdB: 3.1, inTop10: true, sourceRef: "Forbes Korea 2025 list" }
    ]
  },
  {
    rank2025: 10,
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
      { year: 2025, netWorthUsdB: 3.0, inTop10: true, sourceRef: "Forbes Korea 2025 list" }
    ]
  }
];
