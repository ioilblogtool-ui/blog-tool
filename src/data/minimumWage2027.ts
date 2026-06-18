export const MW27_CURRENT = {
  year: 2027,
  hourly: 10030,       // 7월 발표 후 이 값 교체
  prevHourly: 10030,   // 2026 시급
  announced: false,    // 발표 후 true로 변경
  announcedDate: "",
};

export const MW27_HISTORY = [
  { year: 2020, hourly: 8590,  changeRate: 2.9 },
  { year: 2021, hourly: 8720,  changeRate: 1.5 },
  { year: 2022, hourly: 9160,  changeRate: 5.0 },
  { year: 2023, hourly: 9620,  changeRate: 5.0 },
  { year: 2024, hourly: 9860,  changeRate: 2.5 },
  { year: 2025, hourly: 10030, changeRate: 1.7 },
  { year: 2026, hourly: 10030, changeRate: 0.0 },
  { year: 2027, hourly: 10030, changeRate: 0.0 }, // 발표 후 업데이트
];

// OECD 주요국 최저임금 (달러 환산 / PPP 환산 / 빅맥 현지가격 USD)
// 업데이트 기준: 2026년 상반기 / 이코노미스트 빅맥지수
export const MW27_GLOBAL = [
  { country: "호주",   flag: "🇦🇺", hourlyUSD: 15.8, hourlyPPP: 12.1, bigmacUSD: 7.50 },
  { country: "영국",   flag: "🇬🇧", hourlyUSD: 15.4, hourlyPPP: 11.8, bigmacUSD: 5.90 },
  { country: "프랑스", flag: "🇫🇷", hourlyUSD: 12.9, hourlyPPP: 10.4, bigmacUSD: 6.20 },
  { country: "독일",   flag: "🇩🇪", hourlyUSD: 13.9, hourlyPPP: 10.9, bigmacUSD: 6.00 },
  { country: "캐나다", flag: "🇨🇦", hourlyUSD: 12.5, hourlyPPP: 10.2, bigmacUSD: 7.00 },
  { country: "스페인", flag: "🇪🇸", hourlyUSD: 9.5,  hourlyPPP: 8.8,  bigmacUSD: 5.50 },
  { country: "일본",   flag: "🇯🇵", hourlyUSD: 6.8,  hourlyPPP: 8.9,  bigmacUSD: 4.00 },
  { country: "미국",   flag: "🇺🇸", hourlyUSD: 7.25, hourlyPPP: 7.25, bigmacUSD: 5.80 },
  { country: "한국",   flag: "🇰🇷", hourlyUSD: 7.3,  hourlyPPP: 9.1,  bigmacUSD: 5.20 },
  { country: "폴란드", flag: "🇵🇱", hourlyUSD: 5.8,  hourlyPPP: 8.2,  bigmacUSD: 3.80 },
];

export const MW27_ITEMS = {
  bigmac:    { label: "빅맥",         icon: "🍔", priceKRW: 5700 },
  americano: { label: "아메리카노",    icon: "☕", priceKRW: 4500 },
  subway:    { label: "지하철 1회",    icon: "🚇", priceKRW: 1500 },
  convenience: { label: "편의점 도시락", icon: "🍱", priceKRW: 4500 },
} as const;

export type MW27ItemKey = keyof typeof MW27_ITEMS;

export const MW27_DEFAULTS = {
  hoursPerDay: 8,
  daysPerWeek: 5,
  includeWeeklyHoliday: true,
  compareMode: "ppp" as "usd" | "ppp",
  compareItem: "bigmac" as MW27ItemKey,
};

export const MW27_META = {
  slug: "minimum-wage-2027",
  title: "2027 최저임금 계산기 | 세후 월급 + 세계 최저임금 순위 비교",
  description: "2027년 최저임금 시급으로 세후 월급 바로 계산. OECD 국가별 최저임금 순위와 빅맥으로 보는 구매력 비교 포함.",
  updatedAt: "2026-06-18",
  caution: "글로벌 데이터는 OECD·이코노미스트 빅맥지수 기준 추정값입니다. 환율·물가에 따라 달라질 수 있습니다.",
};

export const MW27_FAQ = [
  {
    question: "2027 최저임금은 언제 발표되나요?",
    answer: "최저임금위원회가 매년 6~7월 심의를 거쳐 8월 5일 이전 고시합니다. 2027년 적용 최저임금은 2026년 7월 중 발표 예정입니다. 발표 즉시 이 계산기에 반영됩니다.",
  },
  {
    question: "주휴수당은 어떤 경우에 받나요?",
    answer: "1주 소정근로시간이 15시간 이상인 근로자에게 유급 주휴일(8시간분)이 주어집니다. 주 5일 8시간 기준 월급 계산 시 주휴수당이 포함되어 실질 시급은 명목 시급보다 약 20% 높게 됩니다.",
  },
  {
    question: "한국 최저임금은 세계 몇 위인가요?",
    answer: "단순 달러 환산으로는 OECD 중하위권(약 20위)이지만, 물가를 반영한 PPP 기준으로는 중위권(약 14~15위)입니다. 일본보다는 높고 서유럽 주요국보다는 낮습니다.",
  },
  {
    question: "빅맥 지수로 구매력을 비교하는 이유는?",
    answer: "단순 시급을 달러로 환산하면 물가 차이가 반영되지 않습니다. '1시간 일해서 빅맥을 몇 개 살 수 있나'로 비교하면 각국의 실질 생활 수준을 직관적으로 알 수 있습니다. 한국은 약 1.4개로 호주(2.1개), 영국(2.6개)보다 낮습니다.",
  },
  {
    question: "최저임금 위반 시 어떻게 되나요?",
    answer: "최저임금법 위반 시 3년 이하 징역 또는 2천만원 이하 벌금에 처해집니다. 고용노동부 고객상담센터(☎1350)에 신고할 수 있습니다.",
  },
];
