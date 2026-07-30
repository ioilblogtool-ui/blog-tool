export type KlcScenario = {
  id: "sideways" | "uptrend" | "volatileUp2026" | "downtrend";
  label: string;
  narrative: string;
  dailyIndexReturns: number[];
};

export type KlcPrincipalPreset = {
  label: string;
  won: number;
};

export type KlcDetailCard = {
  key: string;
  label: string;
  description: string;
  badge: "단순 계산" | "시뮬레이션";
};

export type KlcMechanismStep = {
  day: string;
  indexValue: string;
  indexReturnLabel: string;
  leverageValue: string;
  leverageReturnLabel: string;
};

export type KlcRegulationEvent = {
  dateLabel: string;
  content: string;
  status: "완료" | "예정";
};

export type KlcFaqItem = {
  question: string;
  answer: string;
};

export const KLC_META = {
  slug: "kospi-leverage-etf-calculator",
  eyebrow: "레버리지 ETF 계산기",
  title: "코스피 레버리지 ETF 손익 계산기",
  h1: "코스피 레버리지 ETF 손익 계산기",
  description: "코스피200이 움직인 경로에 따라 2배 레버리지 수익률이 어떻게 달라지는지, 투자금액을 넣어 바로 확인해보세요.",
  seoTitle: "코스피 레버리지 ETF 계산기 2026 | 지수 2배 아닌 진짜 손익",
  seoDescription:
    "투자금액과 시장 흐름을 선택하면 코스피200 수익률과 2배 레버리지 시뮬레이션 수익률 차이를 바로 계산합니다. 예상 손익, 원금 복구 필요 상승률까지 확인하세요.",
  updatedAt: "2026-07-30",
};

// 일별 등락률은 소수로 저장 (0.05 = +5%). 기본 프리셋 sideways는
// 코스피200이 정확히 원점으로 돌아오는 +10% / -1/11(-9.0909...%) 쌍을 3회 반복한다.
export const KLC_SCENARIOS: KlcScenario[] = [
  {
    id: "sideways",
    label: "오르내림 반복",
    narrative: "코스피200이 상승과 하락을 반복한 뒤 시작점으로 돌아옵니다. 코스피200은 본전이어도 레버리지 ETF에는 손실이 남을 수 있습니다.",
    dailyIndexReturns: [0.1, -1 / 11, 0.1, -1 / 11, 0.1, -1 / 11],
  },
  {
    id: "uptrend",
    label: "꾸준히 상승",
    narrative: "코스피200이 같은 방향으로 계속 오릅니다. 상승 흐름이 이어지면 복리효과로 단순 2배보다 높은 결과가 나올 수도 있습니다.",
    dailyIndexReturns: Array(10).fill(0.02),
  },
  {
    id: "volatileUp2026",
    label: "급등락 반복",
    narrative: "큰 폭의 상승과 하락이 반복됩니다. 코스피200이 소폭 상승해도 레버리지 ETF 시뮬레이션 수익률은 더 낮아질 수 있습니다.",
    dailyIndexReturns: [0.07, -0.06, 0.08, -0.07, 0.04, -0.03],
  },
  {
    id: "downtrend",
    label: "꾸준히 하락",
    narrative: "코스피200이 같은 방향으로 계속 하락합니다. 레버리지 ETF의 손실이 일반 지수 투자보다 빠르게 커집니다.",
    dailyIndexReturns: Array(5).fill(-0.02),
  },
];

export const KLC_PRINCIPAL_PRESETS: KlcPrincipalPreset[] = [
  { label: "100만원", won: 1_000_000 },
  { label: "500만원", won: 5_000_000 },
  { label: "1,000만원", won: 10_000_000 },
  { label: "3,000만원", won: 30_000_000 },
  { label: "1억원", won: 100_000_000 },
];

// 상세보기(접힘) 영역에만 노출하는 카드. 핵심 3개(평가금액·손익·코스피200 비교)는
// astro 페이지에 고정 마크업으로 둔다.
export const KLC_DETAIL_CARDS: KlcDetailCard[] = [
  {
    key: "indexCumulativeReturn",
    label: "코스피200 누적수익률",
    description: "선택한 시장 흐름의 일별 등락률을 그대로 복리 계산한 값입니다.",
    badge: "단순 계산",
  },
  {
    key: "leverageSimpleReturn",
    label: "단순 2배로 계산한 수익률",
    description: "코스피200 누적수익률에 배율을 곱한 값입니다. 실제 레버리지 ETF 수익률과는 다릅니다.",
    badge: "단순 계산",
  },
  {
    key: "leverageActualReturnPreFee",
    label: "일별 복리 시뮬레이션",
    description: "일별 등락률에 배율을 매일 적용해 복리로 계산한 값입니다(운용보수 반영 전).",
    badge: "시뮬레이션",
  },
  {
    key: "leverageFinalReturn",
    label: "보수 반영 예상수익률",
    description: "일별 복리 시뮬레이션에서 보유기간 만큼의 운용보수를 차감한 값입니다.",
    badge: "시뮬레이션",
  },
  {
    key: "decayGap",
    label: "단순 계산과의 차이",
    description: "보수 반영 예상수익률에서 단순 2배 계산을 뺀 값입니다. 오르내림이 반복될수록 이 차이가 커집니다.",
    badge: "시뮬레이션",
  },
];

export const KLC_MECHANISM = {
  title: "코스피200이 본전인데 레버리지는 손실인 이유",
  steps: [
    { day: "시작", indexValue: "100", indexReturnLabel: "-", leverageValue: "100", leverageReturnLabel: "-" },
    { day: "1일차", indexValue: "110", indexReturnLabel: "+10%", leverageValue: "120", leverageReturnLabel: "+20%" },
    { day: "2일차", indexValue: "100", indexReturnLabel: "-9.09%", leverageValue: "98.18", leverageReturnLabel: "-18.18%" },
  ] as KlcMechanismStep[],
  conclusion:
    "레버리지 ETF는 전체 기간 수익률을 마지막에 2배로 계산하지 않습니다. 매일의 수익률을 2배로 적용하기 때문에 상승과 하락이 반복되면 코스피200은 본전이어도 레버리지 ETF에는 손실이 남을 수 있습니다.",
};

// 팩트체크 완료 (2026-07-30 기준, 금융위원회 보도자료 fsc.go.kr/no010101/87403).
// 배포 시점마다 최신 시행일을 재확인한다.
export const KLC_REGULATION_TIMELINE: KlcRegulationEvent[] = [
  { dateLabel: "2026년 7월 16일", content: "단일종목 레버리지 상품(ETF·ETN) 신규상장 잠정 중단, 광고·판촉 금지", status: "완료" },
  { dateLabel: "2026년 7월 31일", content: "단일종목 레버리지 상품 신규·추가 매수 시 현금 3천만원 예탁 필요 (대용증권 불인정)", status: "예정" },
  { dateLabel: "2026년 8월 19일", content: "괴리율 관리 기준 강화 (3% → 2%)", status: "예정" },
  { dateLabel: "2026년 11월", content: "국내 단일종목 상품 매매단위 확대 추진 (1주 → 20주)", status: "예정" },
];

export const KLC_FAQ: KlcFaqItem[] = [
  {
    question: "코스피200이 10% 오르면 레버리지도 20% 오르나요?",
    answer:
      "하루 동안 10% 오른 경우에는 약 20% 상승을 추구합니다. 하지만 여러 날에 걸쳐 누적 10% 오른 경우에는 상승과 하락의 순서에 따라 최종 수익률이 20%보다 높거나 낮을 수 있습니다.",
  },
  {
    question: "코스피200은 회복했는데 레버리지는 왜 손실인가요?",
    answer:
      "레버리지는 하루 수익률의 2배를 매일 적용합니다. 상승과 하락이 반복되면 복리 효과 때문에 코스피200이 시작점으로 돌아와도 레버리지에는 손실이 남을 수 있습니다.",
  },
  {
    question: "레버리지 ETF는 장기투자하면 안 되나요?",
    answer:
      "보유기간만으로 판단할 수는 없습니다. 한 방향의 추세가 이어지면 유리한 복리효과가 나타날 수 있지만, 변동성이 크고 방향이 자주 바뀌면 수익률이 크게 훼손될 수 있습니다. 일반 지수 ETF보다 손실 폭과 변동성이 크다는 점을 고려해야 합니다.",
  },
  {
    question: "계산 결과가 실제 ETF 수익률과 같나요?",
    answer:
      "같지 않을 수 있습니다. 이 계산기는 일별 등락률과 설정한 운용보수만 반영한 시뮬레이션입니다. 실제 상품에는 추적오차, 기타비용, 선물 관련 비용, 시장가격과 순자산가치(NAV) 차이 등이 추가로 반영됩니다.",
  },
  {
    question: "손실 후 원금을 회복하려면 얼마나 올라야 하나요?",
    answer:
      "손실률보다 더 높은 상승률이 필요합니다. 예를 들어 -10% 손실은 +11.1%, -20% 손실은 +25.0%, -30% 손실은 +42.9%, -50% 손실은 +100.0% 상승이 있어야 원금을 회복합니다.",
  },
  {
    question: "현금 3천만원이 있어야 KODEX 레버리지를 살 수 있나요?",
    answer:
      "아닙니다. 2026년 7월 31일 시행되는 현금 3천만원 예탁금 기준은 삼성전자·SK하이닉스처럼 개별 종목을 추종하는 '단일종목 레버리지 ETF·ETN'에 적용됩니다. 코스피200 지수를 추종하는 KODEX 레버리지 같은 일반 지수형 레버리지 ETF는 이번 단일종목 규제 대상이 아닙니다.",
  },
  {
    question: "3배 레버리지 상품도 국내에 있나요?",
    answer: "국내 상장 상품은 통상 코스피200 일간수익률의 2배가 표준입니다. 고급 설정에서 배율을 직접 입력하면 3배 등 다른 배율도 참고용으로 계산해볼 수 있습니다.",
  },
  {
    question: "레버리지 ETF의 투자위험등급은 어느 정도인가요?",
    answer: "KODEX 레버리지 기준 1등급(매우높은위험)으로 분류됩니다. 파생상품을 활용해 배율을 추종하는 만큼 원금 손실이 크게 확대될 수 있습니다.",
  },
];

export const KLC_RELATED_LINKS = [
  { href: "/tools/dca-investment-calculator/", label: "적립식 투자 계산기" },
  { href: "/tools/etf-distribution-tax-calculator/", label: "ETF 분배금 세금 계산기" },
  { href: "/reports/kospi-sidecar-record-2026/", label: "2026 코스피 사이드카 41회 리포트" },
];

export const KLC_SOURCE_LINKS = [
  { label: "삼성자산운용 KODEX 레버리지 상품 페이지", href: "https://www.samsungfund.com/etf/product/view.do?id=2ETF25" },
  { label: "금융위원회 단일종목 레버리지 상품 보완방안 보도자료", href: "https://www.fsc.go.kr/no010101/87403" },
];
