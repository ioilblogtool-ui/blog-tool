export type RepaymentType = "annuity" | "equalPrincipal" | "bullet";
export type RateInputMode = "delta" | "target";

export interface LircInput {
  balance: number;
  rateNow: number;
  rateMode: RateInputMode;
  rateDelta: number;
  rateNew: number;
  months: number;
  repay: RepaymentType;
}

export interface LircPreset {
  id: string;
  label: string;
  description: string;
  input: Partial<LircInput>;
}

export interface LircRateDecision {
  date: string;
  from: number;
  to: number;
  action: "인상" | "인하" | "동결";
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export const LIRC_META = {
  title: "기준금리 변동 대출이자 계산기 2026 | 월 상환액 바로 계산",
  description:
    "대출잔액·현재 금리·변경 후 금리를 입력하면 월 상환액과 남은 기간 총이자 변화를 바로 계산. 0.25%p·0.5%p·1%p 금리 변동 빠른 비교표 포함.",
  h1: "기준금리·대출금리 변동 계산기 2026",
  updatedAt: "2026년 10월 기준",
} as const;

export const LIRC_DEFAULT_INPUT: LircInput = {
  balance: 300_000_000,
  rateNow: 4.0,
  rateMode: "delta",
  rateDelta: -0.25,
  rateNew: 3.75,
  months: 360,
  repay: "annuity",
};

export const LIRC_QUICK_DELTAS = [-1.0, -0.5, -0.25, 0.25, 0.5, 1.0];

export const LIRC_LIMITS = {
  balance: { min: 10_000, max: 5_000_000_000 },
  rate: { min: 0, max: 20 },
  delta: { min: -5, max: 5 },
  months: { min: 1, max: 600 },
} as const;

export const LIRC_REPAY_OPTIONS: { id: RepaymentType; label: string; note: string }[] = [
  { id: "annuity", label: "원리금균등", note: "매달 같은 금액(원금+이자)을 냅니다." },
  { id: "equalPrincipal", label: "원금균등", note: "매달 같은 원금 + 줄어드는 이자. 첫 달 기준으로 표시합니다." },
  { id: "bullet", label: "만기일시", note: "매달 이자만 내고 만기에 원금을 한 번에 갚습니다." },
];

// 한국은행 공식 자료 기준 (2026-10-07 확인). 결정회의 후 이 상수만 갱신한다.
export const LIRC_BASE_RATE = {
  current: 3.0,
  lastChange: { date: "2026-08-27", from: 2.75, to: 3.0, action: "인상" } as LircRateDecision,
  history: [
    { date: "2026-08-27", from: 2.75, to: 3.0, action: "인상" },
    { date: "2026-07-16", from: 2.5, to: 2.75, action: "인상" },
    { date: "2025-05-29", from: 2.75, to: 2.5, action: "인하" },
  ] as LircRateDecision[],
  meetings: [
    "2026-01-15",
    "2026-02-26",
    "2026-04-10",
    "2026-05-28",
    "2026-07-16",
    "2026-08-27",
    "2026-10-22",
    "2026-11-26",
  ],
  lastReviewedMeeting: "2026-08-27",
  checkedAt: "2026-10-07",
  sourceLabel: "한국은행 기준금리 추이·통화정책방향",
  sourceUrl: "https://www.bok.or.kr/portal/singl/baseRate/list.do?dataSeCd=01&menuNo=200643",
};

export const LIRC_PRESETS: LircPreset[] = [
  {
    id: "mortgage",
    label: "주담대 3억·30년",
    description: "변동형 주택담보대출 원리금균등 예시",
    input: { balance: 300_000_000, rateNow: 4.0, months: 360, repay: "annuity" },
  },
  {
    id: "jeonse",
    label: "전세대출 2억·2년",
    description: "만기일시상환(월 이자만 납부) 예시",
    input: { balance: 200_000_000, rateNow: 3.8, months: 24, repay: "bullet" },
  },
  {
    id: "credit",
    label: "신용대출 5천·1년",
    description: "금융채 연동 신용대출, 만기일시 예시",
    input: { balance: 50_000_000, rateNow: 5.5, months: 12, repay: "bullet" },
  },
];

export const LIRC_INFO_LINES = [
  "기준금리가 바뀌어도 내 대출금리가 같은 폭·같은 날 바뀌지는 않습니다. 은행 앱·약정서의 현재 적용금리와 예상 금리를 직접 입력하세요.",
  "결과는 연이율÷12 월 이율과 '변경 금리가 남은 기간 동안 유지된다'는 가정의 시뮬레이션이며, 실제 은행 청구액과 차이가 날 수 있습니다.",
  "기준금리·회의 일정은 한국은행 공시 기준이며, 계산에는 반영되지 않습니다.",
];

export const LIRC_RATE_STRUCTURE = [
  {
    title: "내 대출금리 = 기준지표 + 가산금리 − 우대금리",
    body: "변동금리 대출은 기준지표 금리에 은행이 정한 가산금리를 더하고, 급여이체·카드 실적 등 우대금리를 뺀 값으로 정해집니다.",
  },
  {
    title: "기준지표는 COFIX·금융채가 대표적",
    body: "주택담보대출 변동형은 은행 자금조달비용을 반영한 COFIX(은행연합회 매월 공시), 신용대출은 금융채 금리를 주로 씁니다. 둘 다 기준금리와 같은 폭·같은 날 움직이지 않을 수 있습니다.",
  },
  {
    title: "바뀌는 시점은 약정한 변동주기",
    body: "6개월·12개월 등 약정 주기가 돌아올 때 그 시점 기준지표로 재산정됩니다. 고정금리·혼합형의 고정 기간에는 기준금리가 바뀌어도 금리가 유지됩니다.",
  },
];

export const LIRC_INTRO = [
  "한국은행 금융통화위원회가 기준금리를 결정하는 날이나 은행에서 \"대출금리가 변경됩니다\"라는 안내를 받은 날, 가장 먼저 궁금한 것은 내 월 납입액이 얼마나 바뀌는지입니다. 변동금리 주택담보대출을 갚고 있는 직장인, 6개월·12개월마다 금리 재산정을 앞둔 전세자금대출 차주, 만기 연장을 앞둔 신용대출 이용자 모두 같은 질문을 합니다. 이 계산기는 대출잔액·남은 기간·상환방식은 그대로 두고 금리만 바꿨을 때 월 상환액과 남은 기간 총이자가 얼마나 달라지는지 보여줍니다.",
  "계산은 상환방식별 표준 공식을 사용합니다. 원리금균등은 매달 같은 금액을 내는 연금 공식으로, 원금균등은 원금을 남은 개월 수로 나누고 남은 원금에 이자를 붙이는 방식으로, 만기일시상환은 매달 이자만 내고 만기에 원금을 한 번에 갚는 방식으로 계산합니다. 월 이율은 연이율을 12로 나눈 값이며, 바뀐 금리가 남은 기간 동안 그대로 유지된다고 가정해 현재 금리와 나란히 비교합니다.",
  "같은 0.25%p라도 상환방식에 따라 체감이 다릅니다. 대출잔액 3억원·남은 30년·현재 금리 4.00% 기준으로 0.25%p가 내려가면 원리금균등은 월 약 4만 2,899원, 원금균등 첫 달과 만기일시는 월 6만 2,500원이 줄고, 30년 총이자는 원리금균등 기준 약 1,544만원 줄어듭니다. 반대로 0.5%p가 오르면 원리금균등 월 상환액은 약 8만 7,810원 늘어 같은 폭 인하 때 줄어드는 금액(약 8만 5,112원)보다 조금 큽니다.",
  "빠른 비교표에서 ±0.25%p, ±0.5%p, ±1.0%p 결과를 한 번에 보면 금리 변화에 내 대출이 얼마나 민감한지 알 수 있습니다. 1%p만 올라도 3억원·30년 원리금균등 대출은 월 약 17만 8천원, 30년 총이자는 약 6,416만원 늘어납니다. 월 부담 증가가 가계 예산을 압박하는 수준이라면 더 낮은 금리 상품으로 갈아타는 대환대출이나 여유자금으로 원금 일부를 갚는 중도상환을 함께 비교해 보는 것이 좋습니다.",
  "한국은행 기준금리는 2026년 8월 27일 2.75%에서 3.00%로 인상됐지만, 기준금리가 바뀐다고 내 대출금리가 같은 폭·같은 날 바뀌지는 않습니다. 변동금리는 COFIX·금융채 같은 기준지표에 가산금리를 더하고 우대금리를 뺀 구조이며, 약정된 변동주기가 돌아와야 재산정되고 고정금리 기간에는 변하지 않습니다. 이 계산기는 기준금리를 대출금리에 자동 반영하지 않으며, 일할 계산·거치기간·중도 일부상환을 반영하지 않는 참고용 시뮬레이션이므로 정확한 금액은 대출 은행에서 확인하세요.",
];

export const LIRC_INPUT_POINTS = [
  "금리 변동 전후 월 상환액·남은 기간 총이자를 나란히 비교",
  "±0.25%p·0.5%p·1.0%p 빠른 비교표로 금리 민감도 확인",
  "원리금균등·원금균등·만기일시 상환방식별 차이 확인",
];

export const LIRC_CRITERIA = [
  "월 이율 = 연이율 ÷ 12, 변경 금리는 즉시 적용·남은 기간 유지 가정(시뮬레이션)",
  "기준금리는 계산에 자동 반영하지 않음(사용자 입력 금리 기준)",
  "기준금리·결정회의 일정: 한국은행 공시(2026-10-07 확인)",
  "거치기간·중도 일부상환·일할 이자 계산 미반영",
];

export const LIRC_FAQ: FaqItem[] = [
  {
    question: "기준금리가 0.25%p 내리면 제 대출금리도 바로 0.25%p 내려가나요?",
    answer:
      "아닙니다. 변동금리 대출은 COFIX나 금융채 금리 같은 기준지표에 가산금리를 더해 정해지며, 기준지표는 기준금리와 같은 폭으로 움직이지 않을 수 있습니다. 또한 약정한 변동주기(예: 6개월)가 돌아와야 금리가 재산정되므로 반영 시점도 사람마다 다릅니다. 은행 앱이나 약정서에서 다음 금리 변경일을 먼저 확인하세요.",
  },
  {
    question: "고정금리 대출도 기준금리에 따라 이자가 바뀌나요?",
    answer:
      "고정금리 기간 동안에는 약정 금리가 유지되어 기준금리 변화와 무관합니다. 혼합형은 고정 기간이 끝나고 변동금리로 전환되는 시점부터 영향을 받습니다. 전환 시점이 가까운 경우 이 계산기에 예상 변동금리를 넣어 미리 부담을 확인할 수 있습니다.",
  },
  {
    question: "원리금균등과 원금균등 중 어느 쪽이 금리 변화에 더 민감한가요?",
    answer:
      "첫 달 월 상환액 변화는 남은 원금 전체에 금리 차이가 붙는 원금균등이 더 크게 보입니다. 다만 원금균등은 원금이 빠르게 줄어 남은 기간 총이자 증감은 원리금균등보다 작습니다. 매달 이자만 내는 만기일시상환은 금리 변화가 월 부담과 총이자에 가장 직접적으로 반영됩니다.",
  },
  {
    question: "금리 인상과 인하의 효과가 같은 크기인가요?",
    answer:
      "원금균등과 만기일시상환은 같은 폭이면 증가액과 감소액이 같습니다. 원리금균등은 같은 폭이라도 인상 시 늘어나는 금액이 인하 시 줄어드는 금액보다 조금 큽니다. 3억원·30년·4% 기준 +0.5%p는 월 약 8만 7,810원 증가, −0.5%p는 약 8만 5,112원 감소로 계산됩니다.",
  },
  {
    question: "다음 기준금리 결정은 언제인가요?",
    answer:
      "한국은행 공식 일정상 2026년 남은 통화정책방향 결정회의는 10월 22일(목)과 11월 26일(목)입니다. 2026년 8월 27일 결정 기준 현재 기준금리는 연 3.00%입니다. 결정 결과는 회의 당일 오전 한국은행 홈페이지에 공개됩니다.",
  },
  {
    question: "계산 결과가 은행 안내 금액과 조금 다른 이유는 무엇인가요?",
    answer:
      "은행은 실제 일수 기준으로 이자를 계산하고 원 단위 절사 규칙을 적용하지만, 이 계산기는 연이율을 12로 나눈 월 이율로 계산합니다. 거치기간, 중도 일부상환, 우대금리 변경도 반영하지 않습니다. 따라서 수천 원 단위 차이는 생길 수 있으며 정확한 금액은 대출 은행에서 확인해야 합니다.",
  },
  {
    question: "금리가 올라 부담이 커지면 어떻게 해야 하나요?",
    answer:
      "더 낮은 금리 상품으로 갈아타는 대환대출, 여유자금으로 원금 일부를 갚는 중도상환을 검토할 수 있습니다. 두 방법 모두 중도상환수수료와 부대비용을 함께 따져야 실제 이득을 알 수 있습니다. 아래 관련 계산기에서 이어서 비교해 보세요.",
  },
];

export const LIRC_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/tools/loan-refinancing-calculator/",
    label: "대출 갈아타기 계산기",
    description: "금리 부담이 커졌다면 신규 대출로 바꿀 때 손익분기 확인",
  },
  {
    href: "/tools/mortgage-prepayment-penalty/",
    label: "중도상환 수수료 계산기",
    description: "원금 일부 상환 시 수수료 vs 이자 절감 비교",
  },
  {
    href: "/tools/income-home-affordability/",
    label: "소득 대비 집값 부담 계산기",
    description: "금리가 DSR·대출 가능액에 미치는 영향",
  },
  {
    href: "/reports/2026-salaried-loan-comparison/",
    label: "2026 직장인 대출 완전 비교",
    description: "신용·주담대·전세대출 금리 구조 비교",
  },
];
