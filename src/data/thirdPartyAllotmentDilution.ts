export type TpdPreset = {
  id: string;
  label: string;
  description: string;
  existingShares: number;
  treasuryShares: number;
  newShares: number;
  investmentAmount: number;
  currentPrice: number;
  ownedShares: number;
  treasurySharesCancelled: number;
  investorName: string;
};

export type TpdResultCard = {
  key: string;
  label: string;
  description: string;
  badge: string;
};

export const TPD_META = {
  slug: "third-party-allotment-dilution-calculator",
  eyebrow: "제3자배정 유상증자 계산기",
  title: "제3자배정 유상증자 지분희석 계산기",
  h1: "제3자배정 유상증자·지분희석 계산기",
  description:
    "기존 발행주식수, 신주 수, 투자금액, 현재 주가를 넣으면 신주 발행가, 투자자 지분율, 기존 주주 희석률, 주가가 몇 % 올라야 희석을 상쇄하는지 계산합니다.",
  seoTitle: "제3자배정 유상증자 지분희석 계산기 | 네이버 엔비디아 투자 예시",
  seoDescription:
    "기존 주식 수, 신주 수, 투자금액을 입력하면 신주 발행가, 신규 투자자 지분율, 기존 주주 지분희석률, 발행가 할인율과 증자 후 기업가치를 계산합니다.",
  updatedAt: "2026-07-27",
};

export const TPD_PRESETS: TpdPreset[] = [
  {
    id: "naver-nvidia-2026",
    label: "네이버·엔비디아 보도 예시",
    description:
      "발표 조건대로 거래가 종결되어 엔비디아가 네이버 신주 720만 주를 약 1조4810억원에 취득한다고 가정한 보도 예시입니다.",
    existingShares: 152_800_000,
    treasuryShares: 0,
    newShares: 7_200_000,
    investmentAmount: 1_481_000_000_000,
    currentPrice: 207_500,
    ownedShares: 100,
    treasurySharesCancelled: 0,
    investorName: "엔비디아",
  },
];

export const TPD_RESULT_CARDS: TpdResultCard[] = [
  {
    key: "investorOwnershipRate",
    label: "신규 투자자 지분율",
    description: "증자 후 유통주식수 대비 신주 수 비율입니다.",
    badge: "단순 계산",
  },
  {
    key: "dilutionRate",
    label: "기존 주주 지분율 감소",
    description: "자사주를 제외한 기존 유통주주의 지분율 감소입니다.",
    badge: "단순 계산",
  },
  {
    key: "issuePrice",
    label: "신주 1주당 발행가",
    description: "투자금액을 신주 수로 나눈 단순 발행가입니다.",
    badge: "단순 계산",
  },
  {
    key: "issueDiscountRate",
    label: "현재가 대비 발행가",
    description: "발행가가 현재 주가 대비 할인인지 할증인지 봅니다.",
    badge: "참고",
  },
  {
    key: "issuePricePreMoneyValuation",
    label: "발행가 기준 프리머니",
    description: "신주 발행가에 기존 발행주식 총수를 곱한 값입니다.",
    badge: "참고",
  },
  {
    key: "issuePricePostMoneyValuation",
    label: "발행가 기준 포스트머니",
    description: "발행가에 증자 후 발행주식 총수를 곱한 값입니다.",
    badge: "참고",
  },
  {
    key: "preMoneyValuation",
    label: "현재가 기준 시가총액",
    description: "현재 주가와 기존 발행주식 총수를 곱한 값입니다.",
    badge: "참고",
  },
  {
    key: "investmentToMarketCapRate",
    label: "투자금/시가총액 비율",
    description: "신규 투자금이 현재가 기준 시가총액의 몇 %인지 봅니다.",
    badge: "참고",
  },
  {
    key: "investorPaperGainRate",
    label: "투자자 평가손익률",
    description: "현재 주가를 기준으로 신주 발행가 대비 평가손익률을 단순 계산합니다.",
    badge: "시뮬레이션",
  },
  {
    key: "breakEvenValueIncreaseRate",
    label: "지분율 감소 보완 기업가치 상승률",
    description: "기존 주주의 지분율 감소만을 보완하려면 필요한 전체 기업가치 증가율입니다.",
    badge: "시뮬레이션",
  },
  {
    key: "postMoneyShares",
    label: "거래 후 발행주식 총수",
    description: "기존 발행주식 총수 + 신주 - 자사주 소각으로 계산합니다.",
    badge: "참고",
  },
  {
    key: "postOutstandingShares",
    label: "거래 후 유통주식 수",
    description: "자사주를 제외하고 시장·투자자가 보유하는 주식 수입니다.",
    badge: "참고",
  },
];

export const TPD_STRUCTURE_COMPARISON = [
  {
    title: "제3자배정 유상증자",
    capital: "회사에 현금 유입",
    shares: "신주 발행으로 총주식수 증가",
    dilution: "기존 주주는 지분율 희석",
    point: "성장 자금 조달과 전략적 투자자 유치에 초점",
  },
  {
    title: "구주 매각",
    capital: "회사에는 현금 유입 없음",
    shares: "총주식수 변동 없음",
    dilution: "기존 전체 주주의 희석 없음",
    point: "특정 주주의 지분만 이전",
  },
  {
    title: "지분교환",
    capital: "현금보다 주식 교환 구조가 핵심",
    shares: "양사 발행 구조에 따라 다름",
    dilution: "교환 비율과 발행 방식 확인 필요",
    point: "전략 제휴 성격이 강하지만 구조가 복잡",
  },
];

export const TPD_SIGNAL_GROUPS = [
  {
    title: "긍정적으로 볼 수 있는 지점",
    items: [
      "회사가 직접 성장 자금을 확보합니다.",
      "전략적 투자자가 들어오면 협력 기대가 가격에 반영될 수 있습니다.",
      "발행가가 현재가와 크게 벌어지지 않으면 과도한 할인 논란이 줄어듭니다.",
    ],
  },
  {
    title: "주의해서 볼 지점",
    items: [
      "신주가 발행되면 기존 주주의 지분율은 낮아집니다.",
      "투자금이 실제 이익과 현금흐름으로 이어지는지는 별도 검증이 필요합니다.",
      "보도 단계 수치는 최종 공시, 주주총회, 거래 종결 조건에 따라 달라질 수 있습니다.",
    ],
  },
];

export const TPD_CASE_SUMMARY = [
  { label: "예시 투자자", value: "엔비디아", note: "전략적 투자자 가정" },
  { label: "예정 투자금", value: "약 1조4810억원", note: "발표 기준 조건부 거래" },
  { label: "신주 수", value: "720만 주", note: "보도 수치 기준" },
  { label: "예상 지분율", value: "약 4.5%", note: "거래 종결 후 기준" },
];

export const TPD_FAQ = [
  {
    question: "제3자배정 유상증자는 기존 주주에게 무조건 나쁜가요?",
    answer:
      "무조건 나쁘다고 볼 수는 없습니다. 기존 주주 지분율은 낮아지지만, 회사가 받은 자금과 전략적 협력이 그 이상으로 기업가치를 높인다면 주주가치에는 긍정적일 수 있습니다. 그래서 희석률과 함께 자금 사용처, 발행가, 투자자 성격을 같이 봐야 합니다.",
  },
  {
    question: "희석률 4.5%라면 주가도 4.5% 빠져야 하나요?",
    answer:
      "그렇게 단순 연결되지는 않습니다. 희석률은 지분율 변화이고 주가는 시장이 미래 성장, 투자금 유입, 협력 기대를 함께 반영해 결정합니다. 이 계산기는 희석 자체의 크기를 분리해서 보는 도구입니다.",
  },
  {
    question: "희석 상쇄 필요 상승률은 무엇인가요?",
    answer:
      "기존 주주의 지분율 감소만을 기준으로 같은 경제적 몫을 유지하려면 전체 기업가치가 몇 % 올라야 하는지를 뜻합니다. 회사에 유입되는 투자금과 향후 사업가치, 실제 주가 변동을 반영한 결론은 아니므로 '주가가 반드시 그만큼 올라야 한다'는 뜻으로 해석하면 안 됩니다.",
  },
  {
    question: "발행가 할인율은 어떻게 해석하나요?",
    answer:
      "현재 주가보다 신주 발행가가 낮으면 할인 발행, 높으면 할증 발행으로 표시합니다. 다만 실제 발행가는 기준일, 산정 방식, 계약 조건에 따라 공시에서 별도로 확인해야 합니다.",
  },
  {
    question: "자사주 소각을 넣는 이유는 무엇인가요?",
    answer:
      "자사주 소각은 발행주식 총수를 줄이는 효과가 있지만, 자사주는 원래 의결권과 배당권이 제한되고 시장에서 유통되는 주식이 아닙니다. 그래서 이 도구는 발행주식 총수, 자사주, 유통주식 수를 구분해 계산합니다.",
  },
  {
    question: "이 계산기는 투자 판단을 대신하나요?",
    answer:
      "아닙니다. 단순 계산과 시뮬레이션을 제공하는 참고 도구입니다. 실제 투자 판단에는 최종 공시, 계약 조건, 실적 전망, 밸류에이션, 시장 변동성을 함께 확인해야 합니다.",
  },
  {
    question: "제3자배정과 지분교환은 같은 말인가요?",
    answer:
      "다릅니다. 제3자배정 유상증자는 회사가 신주를 발행해 특정 투자자에게 배정하고 회사에 자금이 들어오는 구조입니다. 지분교환은 양쪽 회사의 주식이나 지분을 교환하는 구조라 회계와 희석 효과가 다르게 나타날 수 있습니다.",
  },
  {
    question: "네이버 엔비디아 예시는 확정 수치인가요?",
    answer:
      "페이지의 기본값은 보도와 공식 발표에 나온 숫자를 사용한 예시입니다. 발표 조건대로 거래가 종결된다는 가정이며, 실제 거래는 최종 계약, 공시, 종결 조건에 따라 달라질 수 있으므로 최신 공시를 확인해야 합니다.",
  },
  {
    question: "발행주식 총수와 유통주식 수는 왜 나누나요?",
    answer:
      "발행주식 총수는 회사가 발행한 전체 주식이고, 유통주식 수는 여기서 회사가 보유한 자사주를 제외한 주식입니다. 일반 주주의 지분율 변화를 보려면 자사주를 제외한 유통주식 기준을 함께 보는 편이 더 정확합니다.",
  },
];

export const TPD_RELATED_LINKS = [
  {
    href: "/tools/stock-breakeven-calculator/",
    label: "주식 물타기·손익분기 계산기",
  },
  {
    href: "/tools/stock-brokerage-fee-calculator/",
    label: "증권사 수수료 계산기",
  },
  {
    href: "/tools/us-stock-exchange-profit-calculator/",
    label: "미국주식 환차익 계산기",
  },
  {
    href: "/tools/indirect-ownership-calculator/",
    label: "간접지분 계산기",
  },
];

export const TPD_SOURCE_LINKS = [
  {
    label: "NVIDIA 공식 발표",
    href: "https://investor.nvidia.com/news/press-release-details/2026/NAVER-NVIDIA-and-Brookfield-to-Expand-Koreas-National-AI-Factory-Infrastructure-Buildout/default.aspx",
  },
  {
    label: "Reuters 보도",
    href: "https://www.reuters.com/business/nvidia-acquire-1-bln-new-shares-south-koreas-naver-sources-say-2026-07-25/",
  },
  {
    label: "NAVER 공식 보도자료",
    href: "https://www.navercorp.com/media/pressReleasesDetail?seq=10034517",
  },
];
