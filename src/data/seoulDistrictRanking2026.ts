export type DataStatus = "공식" | "추정" | "참고";

export interface DistrictRow {
  id: string;
  districtName: string;
  representativeComplex: string;
  latestPriceManwon: number;
  latestTradeDate: string;
  prevYearPriceManwon: number;
  yoyChangePercent: number;
  jeonseRatio: number | null;
  reportSlug: string | null;
  areaNote: string;
  status: DataStatus;
  tradeNote?: string;
}

export interface SdarMeta {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  updatedAt: string;
  dataAsOf: string;
  notice: string;
}

export interface SdarFaqItem {
  question: string;
  answer: string;
}

export interface SdarRelatedLink {
  href: string;
  label: string;
  description: string;
}

export function formatEok(manwon: number): string {
  if (manwon === 0) return "-";
  const eok = manwon / 10000;
  if (eok >= 100) return `${Math.round(eok)}억`;
  if (Number.isInteger(eok)) return `${eok}억`;
  return `${eok.toFixed(1)}억`;
}

export function formatChange(pct: number): string {
  if (pct === 0) return "-";
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}%`;
}

// ─── META ────────────────────────────────────────────────────────────────────

export const SDAR_META: SdarMeta = {
  slug: "seoul-district-apartment-price-ranking-2026",
  title: "서울 구별 아파트 집값 순위 2026",
  seoTitle: "서울 구별 집값 순위 2026 | 25개 구 평균 아파트 가격 한눈에 비교",
  description:
    "서울 25개 구 아파트 평균 실거래가를 순위로 정리. 가장 비싼 구·저렴한 구·전년 대비 상승률 비교까지 한눈에 확인하세요. 구별 상세 리포트 포함.",
  updatedAt: "2026-07-01",
  dataAsOf: "2026년 상반기 국토교통부 실거래가 공개시스템 기준",
  notice:
    "각 구의 대표 단지 1개 기준 84㎡ 실거래가입니다. 단지별·층별·향별 편차가 크며 구 내 모든 아파트의 평균과 다를 수 있습니다. 전년 대비 상승률이 '-'인 항목은 비교 데이터 미확인 구간입니다. 이 리포트는 투자 권유가 아닙니다.",
};

// ─── DISTRICTS ───────────────────────────────────────────────────────────────

export const SDAR_DISTRICTS: DistrictRow[] = [
  {
    id: "yongsan",
    districtName: "용산구",
    representativeComplex: "한남더힐",
    latestPriceManwon: 1100000,
    latestTradeDate: "2026 상반기",
    prevYearPriceManwon: 980000,
    yoyChangePercent: 12.2,
    jeonseRatio: 28,
    reportSlug: "yongsan-apartment-price-2026",
    areaNote: "한남·이태원권 초고가 단지 기준",
    status: "추정",
  },
  {
    id: "seongdong",
    districtName: "성동구",
    representativeComplex: "갤러리아포레",
    latestPriceManwon: 650000,
    latestTradeDate: "2026 상반기",
    prevYearPriceManwon: 560000,
    yoyChangePercent: 16.1,
    jeonseRatio: null,
    reportSlug: "seongdong-apartment-price-2026",
    areaNote: "성수동 한강뷰 초고가 단지 기준",
    status: "추정",
    tradeNote: "전세가율 데이터 미확인",
  },
  {
    id: "gangnam",
    districtName: "강남구",
    representativeComplex: "압구정 현대",
    latestPriceManwon: 520000,
    latestTradeDate: "2026 상반기",
    prevYearPriceManwon: 0,
    yoyChangePercent: 0,
    jeonseRatio: null,
    reportSlug: "gangnam-apartment-price-2026",
    areaNote: "압구정 재건축 기대권 기준",
    status: "참고",
    tradeNote: "전년 대비 상승률 미확인",
  },
  {
    id: "songpa",
    districtName: "송파구",
    representativeComplex: "리센츠",
    latestPriceManwon: 345000,
    latestTradeDate: "2026 상반기",
    prevYearPriceManwon: 310000,
    yoyChangePercent: 11.3,
    jeonseRatio: 44.9,
    reportSlug: "songpa-apartment-price-2026",
    areaNote: "잠실 대단지 기준",
    status: "추정",
  },
  {
    id: "gangdong",
    districtName: "강동구",
    representativeComplex: "올림픽파크포레온",
    latestPriceManwon: 313000,
    latestTradeDate: "2026.06.25",
    prevYearPriceManwon: 320000,
    yoyChangePercent: -2.2,
    jeonseRatio: 43,
    reportSlug: "gangdong-apartment-price-2026",
    areaNote: "둔촌 재건축 대단지 기준 — 입주 물량 조정기",
    status: "추정",
  },
  {
    id: "mapo",
    districtName: "마포구",
    representativeComplex: "공덕자이",
    latestPriceManwon: 283000,
    latestTradeDate: "2026 상반기",
    prevYearPriceManwon: 0,
    yoyChangePercent: 0,
    jeonseRatio: null,
    reportSlug: "mapo-apartment-price-2026",
    areaNote: "공덕·아현권 대표 단지 기준",
    status: "참고",
    tradeNote: "전년 대비 상승률 미확인",
  },
  {
    id: "gangseo",
    districtName: "강서구",
    representativeComplex: "마곡 엠밸리",
    latestPriceManwon: 198500,
    latestTradeDate: "2026 상반기",
    prevYearPriceManwon: 0,
    yoyChangePercent: 0,
    jeonseRatio: null,
    reportSlug: "gangseo-magok-apartment-price-2026",
    areaNote: "마곡 신도시 대단지 기준",
    status: "참고",
    tradeNote: "전년 대비 상승률 미확인",
  },
];

// 매매가 기준 내림차순 정렬
export const SDAR_DISTRICTS_BY_PRICE = [...SDAR_DISTRICTS].sort(
  (a, b) => b.latestPriceManwon - a.latestPriceManwon
);

// ─── PRICE BANDS ─────────────────────────────────────────────────────────────

export interface PriceBand {
  label: string;
  minManwon: number;
  maxManwon: number | null;
}

export const SDAR_PRICE_BANDS: PriceBand[] = [
  { label: "50억 이상", minManwon: 500000, maxManwon: null },
  { label: "30~50억", minManwon: 300000, maxManwon: 499999 },
  { label: "20~30억", minManwon: 200000, maxManwon: 299999 },
  { label: "10~20억", minManwon: 100000, maxManwon: 199999 },
  { label: "10억 미만", minManwon: 0, maxManwon: 99999 },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────

export const SDAR_FAQ: SdarFaqItem[] = [
  {
    question: "서울에서 아파트 집값이 가장 비싼 구는 어디인가요?",
    answer:
      "이 리포트 기준(2026년 상반기, 84㎡ 대표 단지)으로는 용산구(한남더힐 110억대)가 가장 높습니다. 단, 단지별·층별·향별 편차가 크며 구 내 모든 아파트의 평균이 아닌 대표 단지 기준임을 감안해야 합니다.",
  },
  {
    question: "같은 서울인데 왜 구별로 집값 차이가 이렇게 크나요?",
    answer:
      "교통 접근성(지하철·GTX), 학군, 한강 조망, 재건축·재개발 기대감, 브랜드 선호도, 생활 인프라 등 복합적인 요인이 작용합니다. 단일 요인으로 설명하기 어렵습니다.",
  },
  {
    question: "전세가율이 높은 구가 투자하기 좋은 건가요?",
    answer:
      "전세가율은 갭투자 참고 지표 중 하나이지만, 투자 적합성을 보장하지 않습니다. 전세가율이 높다고 무조건 좋거나 낮다고 나쁜 것이 아니며, 실거주·투자 목적에 따라 판단 기준이 다릅니다. 이 리포트는 투자 권유가 아닙니다.",
  },
  {
    question: "이 데이터는 언제 기준인가요?",
    answer:
      "2026년 상반기 국토교통부 실거래가 공개시스템(rt.molit.go.kr) 기준입니다. 각 구의 대표 단지 1개(84㎡)의 최근 실거래가로, 발행 이후 실거래가는 계속 변동됩니다.",
  },
  {
    question: "아파트가 아닌 빌라·오피스텔은 포함되나요?",
    answer:
      "이 리포트는 아파트(전용 84㎡ 기준) 실거래가만 포함합니다. 빌라·다가구·오피스텔·다세대는 포함되지 않으며, 실제 구 내 평균 주거비와 다를 수 있습니다.",
  },
  {
    question: "상승률이 '-'로 표시된 구는 왜 그런가요?",
    answer:
      "2025년 동기 비교 데이터가 확인되지 않은 구는 상승률을 '-'로 표시합니다. 데이터가 보완되는 대로 업데이트할 예정입니다.",
  },
];

// ─── SEO TEXT ────────────────────────────────────────────────────────────────

export const SDAR_SEO_INTRO = `서울 25개 구별 아파트 집값을 비교할 때 가장 먼저 확인해야 할 것은 어떤 단지·평형을 기준으로 하느냐입니다. 같은 구 안에서도 재건축 기대가 있는 구축 단지와 신축 대단지의 가격 차이는 수십 억 원에 달할 수 있습니다. 이 리포트는 각 구의 대표 단지 1개(전용 84㎡ 기준)를 기준으로 하며, 구 전체 평균이 아님을 명심해야 합니다.

서울 구별 집값 격차는 2026년 기준 용산구(한남더힐 110억대)와 외곽 구(5~9억대 예상) 간 10배 이상으로 벌어져 있습니다. 같은 서울이지만 구별 시장 상황과 매수 전략이 크게 다를 수밖에 없습니다. 예산과 실거주 조건에 맞는 구를 먼저 추린 뒤 해당 구의 상세 리포트에서 단지별 데이터를 확인하는 순서로 활용하시기 바랍니다.`;

export const SDAR_SEO_CRITERIA = [
  "매매가: 각 구 대표 단지 84㎡ 기준 2026년 상반기 국토교통부 실거래가",
  "전년 대비 상승률: 2025년 동기 대비 동일 단지·평형 비교 (미확인 구간은 '-' 표시)",
  "전세가율: (전세 평균 ÷ 매매 평균) × 100, 데이터 없는 구는 '-'",
  "대표 단지: 구 내 인지도·거래량 기준 선정, 구 전체 평균 아님",
  "추정·참고 뱃지: 거래 건수 적거나 전년 비교 미확인 구간에 표시",
];

// ─── RELATED LINKS ────────────────────────────────────────────────────────────

export const SDAR_RELATED_LINKS: SdarRelatedLink[] = [
  {
    href: "/reports/yongsan-apartment-price-2026/",
    label: "용산구 아파트 실거래가 2026",
    description: "한남더힐·나인원한남 등 한남·이태원권 상세 분석",
  },
  {
    href: "/reports/gangnam-apartment-price-2026/",
    label: "강남구 아파트 실거래가 2026",
    description: "압구정 현대·한양 등 재건축 기대권 가격 비교",
  },
  {
    href: "/reports/seongdong-apartment-price-2026/",
    label: "성동구 아파트 실거래가 2026",
    description: "아크로서울포레스트·갤러리아포레 성수동 한강뷰 단지",
  },
  {
    href: "/reports/songpa-apartment-price-2026/",
    label: "송파구 아파트 실거래가 2026",
    description: "잠실 엘스·리센츠·트리지움 대단지 시세 비교",
  },
  {
    href: "/reports/gangdong-apartment-price-2026/",
    label: "강동구 아파트 실거래가 2026",
    description: "올림픽파크포레온·고덕그라시움 등 강동 Top10",
  },
  {
    href: "/reports/mapo-apartment-price-2026/",
    label: "마포구 아파트 실거래가 2026",
    description: "마포래미안·공덕자이 등 아현·공덕권 시세",
  },
  {
    href: "/reports/gangseo-magok-apartment-price-2026/",
    label: "강서(마곡) 아파트 실거래가 2026",
    description: "마곡 엠밸리 단지군 실거래가 및 전세가율",
  },
  {
    href: "/tools/apartment-holding-tax/",
    label: "아파트 보유세 계산기",
    description: "재산세·종부세 합산 보유세 자동 계산",
  },
];
