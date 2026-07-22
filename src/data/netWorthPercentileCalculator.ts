export interface NwpPreset {
  id: string;
  label: string;
  summary: string;
  input: Record<string, string | number | boolean>;
}

export interface NwpFaqItem {
  question: string;
  answer: string;
}

export const NWP_META = {
  slug: "net-worth-percentile-calculator",
  title: "내 순자산 상위 몇 % 계산기",
  seoTitle: "내 순자산 상위 몇 % 계산기 | 대한민국 가구 기준",
  seoDescription:
    "부동산, 전세보증금, 예금, 주식, 코인, 연금과 부채를 입력하면 대한민국 가구 순자산 분포에서 상위 몇 % 수준인지 추정합니다. 최신 가계금융복지조사 기준.",
  dataNote:
    "가계금융복지조사(국가데이터처·한국은행·금융감독원)의 대한민국 가구 순자산 분포를 기준으로 한 참고용 추정입니다. 비교 단위는 개인이 아닌 가구이며, 정확한 전 가구 순위를 보장하지 않습니다.",
  updatedAt: "2026-07-22",
};

// 2025년 가계금융복지조사(2025-03-31 기준) 공식 누적분포 지점 — 백분위 계산에 실제로 사용 가능한 값만 포함
// 주의: 평균값(전체/1분위/10분위 평균)은 백분위 "경계"가 아니므로 계산에 사용하지 않는다. 참고 통계로만 NWP_MEAN_STATS에 분리.
export const NWP_BOUNDARY_POINTS = {
  low: { value: 300_000_000, topPercentile: 43 }, // 순자산 3억 미만 가구 57.0% → 3억은 상위 43% 지점
  high: { value: 1_000_000_000, topPercentile: 11.8 }, // 순자산 10억 이상 가구 11.8%
};

// 참고용 통계(평균 등) — 절대 백분위 경계로 사용하지 않는다. "평균 대비 배율" 등 별도 지표에만 사용.
export const NWP_MEAN_STATS = {
  totalAssetAverage: 566_780_000, // 가구 평균 총자산
  debtAverage: 95_340_000, // 가구 평균 부채
  netWorthAverage: 471_440_000, // 가구 평균 순자산
  netWorthYoyChangePercent: 5.0, // 평균 순자산 전년 대비 증가율
  decile1Average: -7_710_000, // 1분위(하위 10%) 평균 순자산 — 참고용, 백분위 경계 아님
  decile10Average: 2_171_220_000, // 10분위(상위 10%) 평균 순자산 — 참고용, 백분위 경계 아님
  decile10ShareOfTotal: 0.461, // 상위 10%가 전체 순자산의 46.1% 보유(자산 점유율, 인원 비율 아님)
  giniCoefficient: 0.625, // 순자산 지니계수
  giniCoefficientPrevYear: 0.612,
};

export const NWP_STAT_SOURCE = {
  year: 2025,
  surveyDate: "2025-03-31",
  sourceName: "국가데이터처·한국은행·금융감독원 가계금융복지조사",
  sourceUrl: "https://www.korea.kr/briefing/policyBriefingView.do?newsId=156733201",
};

export const NWP_PRESETS: NwpPreset[] = [
  {
    id: "starter",
    label: "사회초년생",
    summary: "순자산 약 5천만",
    input: { realEstate: 0, jeonseDeposit: 0, savings: 30000000, domesticStock: 20000000, overseasStock: 0, crypto: 0, pension: 0, debt: 0 },
  },
  {
    id: "newlywed-jeonse",
    label: "신혼부부 전세형",
    summary: "순자산 약 1.5억",
    input: { realEstate: 0, jeonseDeposit: 300000000, savings: 50000000, domesticStock: 0, overseasStock: 0, crypto: 0, pension: 0, debt: 200000000 },
  },
  {
    id: "capital-owner-30s",
    label: "수도권 자가 30대",
    summary: "순자산 약 3억",
    input: { realEstate: 700000000, jeonseDeposit: 0, savings: 50000000, domesticStock: 50000000, overseasStock: 0, crypto: 0, pension: 0, debt: 500000000 },
  },
  {
    id: "seoul-owner-loan",
    label: "서울 자가 대출형",
    summary: "순자산 약 10억",
    input: { realEstate: 1200000000, jeonseDeposit: 0, savings: 60000000, domesticStock: 60000000, overseasStock: 0, crypto: 0, pension: 0, debt: 320000000 },
  },
  {
    id: "financial-asset-rich",
    label: "금융자산가형",
    summary: "순자산 약 12억",
    input: { realEstate: 600000000, jeonseDeposit: 0, savings: 200000000, domesticStock: 300000000, overseasStock: 150000000, crypto: 50000000, pension: 0, debt: 100000000 },
  },
  {
    id: "debt-heavy",
    label: "부채 초과형",
    summary: "순자산 마이너스",
    input: { realEstate: 0, jeonseDeposit: 0, savings: 8000000, domesticStock: 0, overseasStock: 0, crypto: 0, pension: 0, debt: 12000000 },
  },
];

export const NWP_DISTRIBUTION_TABLE = [
  { label: "가구 평균 총자산", value: "5억 6,678만 원" },
  { label: "가구 평균 부채", value: "9,534만 원" },
  { label: "가구 평균 순자산", value: "4억 7,144만 원 (전년 대비 +5.0%)" },
  { label: "순자산 상위 10% 가구의 평균", value: "21억 7,122만 원 (경계값 아님, 참고용)" },
  { label: "순자산 3억 원 미만 가구", value: "57.0%" },
  { label: "순자산 10억 원 이상 가구", value: "11.8%" },
  { label: "순자산 지니계수", value: "0.625 (전년 0.612)" },
];

export const NWP_FAQ: NwpFaqItem[] = [
  {
    question: "이 계산기의 순위는 정확한가요?",
    answer: "아닙니다. 통계청 가계금융복지조사의 공개된 누적분포 구간(3억 원 미만 57.0%, 10억 원 이상 11.8%) 사이를 보간한 구간 추정치이며, 정확한 개인·가구 순위를 보장하지 않습니다.",
  },
  {
    question: "전세보증금도 자산에 포함되나요?",
    answer:
      "네. 집주인에게 돌려받을 수 있는 전세보증금은 자산으로 입력합니다. 전세자금대출이 있다면 해당 대출 잔액은 부채에 별도로 입력해야 합니다. 예를 들어 전세보증금 3억 원, 전세대출 2억 원이면 순자산에 미치는 금액은 1억 원입니다.",
  },
  {
    question: "국민연금도 자산에 넣어야 하나요?",
    answer:
      "아닙니다. 퇴직연금·개인연금은 현재 적립금 또는 해지환급금 기준으로 입력할 수 있지만, 국민연금의 미래 예상 수령액은 현재 순자산에 포함하지 않는 것을 권장합니다. 즉시 현금화할 수 있는 자산이 아니기 때문입니다.",
  },
  {
    question: "순자산이 마이너스면 어떻게 되나요?",
    answer: "총부채가 총자산보다 많으면 순자산은 마이너스로 계산됩니다. 드문 상황이 아니며, 결과 화면에서는 순위뿐 아니라 부채비율도 함께 확인하는 것이 중요합니다.",
  },
  {
    question: "부동산 시세는 어떻게 입력해야 하나요?",
    answer: "실제 매입가격이 아니라 지금 매도한다면 받을 수 있는 시세를 입력합니다. 국토교통부 실거래가, 한국부동산원·KB 시세를 참고하세요. 취득세·양도소득세는 계산에서 제외합니다.",
  },
  {
    question: "부부 자산은 합쳐서 입력해야 하나요?",
    answer: "네. 가계금융복지조사는 가구 단위 통계이므로, 부부가 같은 가구를 구성한다면 부동산·예금·주식·부채를 모두 합산해 입력해야 통계와 비교 기준이 일치합니다.",
  },
];

export const NWP_SEO_CONTENT = {
  introTitle: "내 순자산은 대한민국에서 상위 몇 % 수준일까요?",
  intro: [
    "부동산, 전세보증금, 예금·적금, 주식, 코인, 퇴직연금과 부채를 입력하면 순자산을 계산하고, 가계금융복지조사의 대한민국 가구 순자산 분포와 비교해 현재 위치를 추정합니다. 순자산은 보유한 전체 자산에서 대출과 기타 부채를 뺀 금액입니다.",
    "대한민국 가구의 평균 총자산은 5억 6,678만 원, 평균 부채는 9,534만 원, 평균 순자산은 4억 7,144만 원입니다. 전체 가구의 57.0%는 순자산 3억 원 미만을 보유하고 있으며, 순자산 10억 원 이상인 가구는 11.8%입니다.",
    "이 계산기의 비교 단위는 개인이 아닌 가구입니다. 부부가 함께 생활한다면 부부가 보유한 자산과 부채를 합산해 입력해야 통계와 비교 기준이 일치합니다.",
    "계산 결과는 공식적으로 확인 가능한 누적분포 지점(3억 원 미만 57.0%, 10억 원 이상 11.8%) 사이를 보간한 구간 추정치입니다. 평균 순자산이나 상위 구간의 평균값은 백분위 경계로 사용하지 않습니다. 상위 10% 가구의 평균이 21억 원이라고 해서 21억 원이 상위 10% 진입 기준이라는 뜻은 아니기 때문입니다. 따라서 이 결과는 정확한 소수점 단위 백분위가 아니라 근사 구간으로 이해해야 합니다.",
  ],
  inputPoints: [
    "자산 항목과 부채를 입력하면 순자산과 전국 가구 기준 추정 상위 %가 즉시 계산됩니다.",
    "평균 순자산 대비 배율, 부동산 집중도, 부채비율로 자산 구성을 진단할 수 있습니다.",
    "한국 부자 TOP10 1위 자산과의 배율 비교로 체감 규모를 확인할 수 있습니다.",
  ],
  criteria: [
    "자산과 부채는 가계금융복지조사(최신 발표 기준)와 비교하며, 비교 단위는 개인이 아닌 가구입니다.",
    "백분위는 공식 누적분포 구간(3억 원 미만 57.0%, 10억 원 이상 11.8%) 사이를 보간한 추정치이며, 평균값은 경계로 사용하지 않습니다.",
    "통계 구간 밖으로 벗어날수록 추정 신뢰도가 낮아지며, 이 경우 결과를 넓은 구간으로 표시합니다.",
    "부동산 시세는 사용자가 직접 입력한 값이며 공식 시세가 아닙니다.",
  ],
};

export const NWP_RELATED_LINKS = [
  { href: "/reports/korea-rich-top10-assets/", label: "한국 부자 TOP 10 자산 비교 리포트" },
  { href: "/reports/us-rich-top10-patterns/", label: "세계 부자 TOP 10 성공 패턴 리포트" },
  { href: "/tools/fire-calculator/", label: "파이어족 계산기" },
  { href: "/tools/home-purchase-fund/", label: "내집마련 자금 계산기" },
];
