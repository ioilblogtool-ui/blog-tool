import { seoulApartmentDistricts, type SeoulApartmentDistrict } from "./seoulApartmentPrice2026";

export type AffordabilityTier = "buyable" | "stretch" | "jeonse-only" | "hard";
export type LtvAssumption = 60 | 70 | 80;

export interface DistrictMapShape {
  id: string;
  d: string;
  x: number;
  y: number;
}

export interface BudgetBand {
  budget: string;
  options: string;
  strategy: string;
  caution: string;
}

export interface AffordabilityResult {
  districtId: string;
  districtName: string;
  averagePrice: number;
  price84: number;
  jeonsePrice: number;
  tier: AffordabilityTier;
  gapManwon: number;
  gapLabel: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const SHAA_META = {
  slug: "seoul-housing-affordability-map-2026",
  title: "내 연봉으로 서울 어디 살 수 있나 | 구별 PIR 지도 2026",
  seoTitle: "서울 집값 PIR 지도 2026 | 내 연봉으로 살 수 있는 구 확인",
  seoDescription:
    "연소득과 보유 현금을 입력하면 서울 25개 구 매매·전세 가능 여부를 지도로 바로 확인합니다. 구별 평균가, 전세가율, 예산대별 추천 지역까지 한 번에 비교하세요.",
  description:
    "연소득과 보유 현금을 입력하면 서울 25개 구 중 매매 가능, 대출 부담, 전세만 가능, 진입 어려움 구간을 지도로 바로 보여주는 인터랙티브 리포트입니다.",
  updatedAt: "2026-06-20",
  dataNote:
    "구별 평균가·전세가율은 2024~2026년 공개 실거래 구조를 바탕으로 재구성한 표본·추정 리포트 기준입니다. 대출 가능액은 LTV만 반영한 단순 추정이며, 실제 DSR, 신용도, 규제지역별 차등은 반영하지 않습니다.",
};

export const SHAA_MAP_SHAPES: DistrictMapShape[] = [
  { id: "dobong", d: "M355 34 L455 38 L448 112 L365 116 L330 78 Z", x: 395, y: 77 },
  { id: "nowon", d: "M468 44 L580 62 L562 150 L458 128 L455 70 Z", x: 515, y: 102 },
  { id: "gangbuk", d: "M278 94 L358 86 L365 157 L288 174 L238 132 Z", x: 306, y: 134 },
  { id: "seongbuk", d: "M365 132 L466 136 L455 212 L352 210 L324 166 Z", x: 397, y: 174 },
  { id: "jungnang", d: "M468 146 L570 158 L610 220 L508 246 L452 214 Z", x: 531, y: 202 },
  { id: "eunpyeong", d: "M106 136 L232 108 L286 174 L246 248 L118 248 L64 198 Z", x: 170, y: 190 },
  { id: "seodaemun", d: "M132 260 L250 258 L300 318 L218 366 L112 326 Z", x: 210, y: 312 },
  { id: "jongno", d: "M262 236 L354 220 L422 272 L370 326 L292 318 L242 270 Z", x: 334, y: 273 },
  { id: "dongdaemun", d: "M426 236 L508 252 L522 336 L434 344 L372 326 Z", x: 458, y: 296 },
  { id: "gwangjin", d: "M524 292 L634 272 L686 350 L626 420 L530 384 Z", x: 604, y: 350 },
  { id: "mapo", d: "M48 330 L190 354 L224 438 L96 472 L34 420 Z", x: 126, y: 408 },
  { id: "jung", d: "M308 328 L380 334 L410 398 L326 420 L266 378 Z", x: 340, y: 376 },
  { id: "seongdong", d: "M416 350 L520 352 L536 430 L442 454 L396 400 Z", x: 469, y: 405 },
  { id: "yongsan", d: "M258 396 L370 430 L398 504 L282 526 L218 462 Z", x: 310, y: 466 },
  { id: "gangseo", d: "M20 448 L130 482 L130 590 L34 592 L4 520 Z", x: 70, y: 528 },
  { id: "yangcheon", d: "M146 456 L238 456 L258 548 L164 588 L118 520 Z", x: 186, y: 520 },
  { id: "guro", d: "M176 602 L278 558 L336 626 L298 704 L180 694 Z", x: 254, y: 640 },
  { id: "geumcheon", d: "M306 640 L396 622 L430 704 L370 764 L292 718 Z", x: 358, y: 690 },
  { id: "yeongdeungpo", d: "M236 438 L330 432 L338 534 L258 556 L212 506 Z", x: 276, y: 494 },
  { id: "dongjak", d: "M350 470 L446 466 L484 550 L410 620 L338 558 Z", x: 410, y: 542 },
  { id: "gwanak", d: "M408 628 L516 566 L596 646 L546 734 L434 724 Z", x: 504, y: 660 },
  { id: "seocho", d: "M496 462 L618 430 L672 522 L606 632 L500 560 Z", x: 584, y: 532 },
  { id: "gangnam", d: "M632 430 L742 388 L798 492 L710 596 L616 526 Z", x: 710, y: 492 },
  { id: "songpa", d: "M742 350 L852 326 L900 438 L810 520 L748 456 Z", x: 816, y: 428 },
  { id: "gangdong", d: "M812 240 L910 246 L936 338 L858 396 L792 330 Z", x: 860, y: 314 },
];

export const SHAA_DISTRICT_ID_BY_NAME: Record<string, string> = {
  "강남구": "gangnam", "서초구": "seocho", "송파구": "songpa", "용산구": "yongsan",
  "성동구": "seongdong", "마포구": "mapo", "양천구": "yangcheon", "광진구": "gwangjin",
  "동작구": "dongjak", "종로구": "jongno", "중구": "jung", "영등포구": "yeongdeungpo",
  "강동구": "gangdong", "서대문구": "seodaemun", "동대문구": "dongdaemun", "성북구": "seongbuk",
  "강서구": "gangseo", "은평구": "eunpyeong", "관악구": "gwanak", "구로구": "guro",
  "중랑구": "jungnang", "노원구": "nowon", "금천구": "geumcheon", "강북구": "gangbuk",
  "도봉구": "dobong",
};

export const SHAA_DEFAULTS = {
  annualIncomeManwon: 6000,
  cashManwon: 30000,
  ltv: 70 as LtvAssumption,
  jeonseLoanRatio: 0.8,
};

export const SHAA_BUDGET_BANDS: BudgetBand[] = [
  { budget: "6억 이하", options: "도봉·강북·금천 일부 소형 또는 구축", strategy: "실거주 안정성과 관리상태를 최우선으로 확인", caution: "84㎡는 선택지가 좁고 대출·수리비 변수가 큼" },
  { budget: "6억~9억", options: "노원·도봉·강북·금천·중랑·구로 59㎡ 또는 구축 84㎡", strategy: "역세권, 대단지, 거래량이 있는 생활권부터 좁히기", caution: "전세가율이 높으면 하락장 리스크를 더 보수적으로 봐야 함" },
  { budget: "9억~12억", options: "강서·은평·성북·동대문·서대문 일부 59~84㎡", strategy: "실거주 편의와 환금성의 균형을 비교", caution: "동일 구 안에서도 신축과 구축 가격 차이가 큼" },
  { budget: "12억~15억", options: "영등포·강동·동작·광진 일부, 마용성 소형", strategy: "학군, 직주근접, 신축 프리미엄을 분리해 계산", caution: "고점 거래 1건이 평균을 끌어올렸는지 확인" },
  { budget: "15억 이상", options: "마용성 84㎡ 일부, 강남3구 소형·준신축", strategy: "장기 보유와 세금·대출 규제를 함께 검토", caution: "취득세, 보유세, 대출 규제 체감액이 커짐" },
];

export const SHAA_FAQ: FaqItem[] = [
  {
    question: "이 지도의 매매 가능 등급은 어떻게 계산되나요?",
    answer:
      "보유 현금을 LTV(담보대출비율) 가정으로 나눠 최대 매매 가능 예산을 구합니다. 예를 들어 보유 현금 3억원, LTV 70% 가정이면 최대 매매 가능 예산은 3억 ÷ (1-0.7) = 약 10억원입니다. 이 예산이 구 평균가 이상이면 '매매 가능', 84㎡ 평균가 이상이지만 평균가에는 못 미치면 '대출 부담 큼'으로 분류합니다.",
  },
  {
    question: "전세 가능 여부는 어떻게 계산하나요?",
    answer:
      "보유 현금에 전세대출로 추가 확보 가능한 금액(보유 현금의 80% 가정)을 더해 최대 전세 가능 예산을 구합니다. 이 예산이 해당 구의 추정 전세가(평균 매매가 × 전세가율) 이상이면 '전세 가능'으로 분류합니다.",
  },
  {
    question: "이 계산은 실제 대출 한도와 같은가요?",
    answer:
      "아닙니다. 실제 대출 한도는 LTV뿐 아니라 DSR(소득 대비 부채상환비율), 신용점수, 규제지역 여부, 보유 주택 수에 따라 크게 달라집니다. 이 리포트는 LTV만 반영한 단순 추정이며, 정확한 한도는 '부동산 매매 자금 계산기'나 은행 상담을 통해 확인해야 합니다.",
  },
  {
    question: "구별 평균가는 어떤 기준인가요?",
    answer:
      "2024~2026년 공개 실거래 구조를 바탕으로 비교계산소가 재구성한 표본·추정 리포트 기준입니다. 같은 구 안에서도 단지별 편차가 크기 때문에 평균가를 특정 단지의 확정 시세로 해석하면 안 됩니다.",
  },
  {
    question: "LTV 가정을 바꾸면 결과가 많이 달라지나요?",
    answer:
      "네, LTV 60%에서 80%로 올리면 같은 보유 현금으로 매매 가능 예산이 크게 늘어납니다. 다만 LTV가 높을수록 매달 갚아야 하는 원리금 부담도 커지므로, 등급이 '매매 가능'으로 나왔다고 해서 무리한 대출까지 권장하는 것은 아닙니다.",
  },
  {
    question: "지도에 표시되는 행정구역은 정확한가요?",
    answer:
      "아닙니다. 이 지도는 빠른 탐색을 위한 단순화 SVG로, 실제 행정 경계와 면적 비율과는 다릅니다. 정확한 경계는 국토교통부나 서울시 공식 지도를 참고해야 합니다.",
  },
];

export const SHAA_SEO_INTRO: string[] = [
  "서울 집값이 무섭다는 말은 이제 흔한 표현이 됐지만, 실제로 내 연봉과 보유 현금으로 서울 어디를 살 수 있는지를 구체적으로 따져보는 사람은 많지 않습니다. 이 리포트는 연소득과 보유 현금을 입력하면 서울 25개 구를 매매 가능, 대출 부담 큼, 전세만 가능, 진입 어려움 네 단계로 나눠 지도에 바로 표시해주는 인터랙티브 콘텐츠입니다. 평균값만 보여주는 기존 통계와 달리, 입력값을 바꿀 때마다 지도 색이 즉시 바뀌기 때문에 내 상황을 기준으로 구별 격차를 체감할 수 있습니다.",
  "계산 방식은 단순합니다. 매매는 보유 현금을 LTV(담보대출비율) 가정으로 나눠 최대 매매 가능 예산을 구하고, 이 예산을 구별 평균 매매가와 비교합니다. 전세는 보유 현금에 전세대출로 추가 확보 가능한 금액을 더해 최대 전세 예산을 구하고, 구별 평균 전세가(매매가 × 전세가율)와 비교합니다. 두 계산 모두 실제 DSR이나 규제지역별 차등을 반영하지 않은 단순 추정이므로, 결과는 '대략적인 방향'으로 읽는 것이 맞습니다.",
  "서울 25개 구의 평균 매매가는 강남·서초·송파 강남3구가 20억원대 이상으로 가장 높고, 노원·도봉·강북 등 노도강 권역은 6억원대~8억원대로 상대적으로 접근성이 높습니다. 다만 같은 구 안에서도 신축과 구축, 역세권과 외곽의 가격 차이가 매우 크기 때문에 구 평균가를 특정 단지의 확정 시세처럼 받아들이면 안 됩니다. 이 리포트는 구별 비교의 출발점으로 활용하고, 실제 매물 확인은 국토교통부 실거래가 공개시스템이나 부동산 플랫폼에서 진행하는 것을 권장합니다.",
  "전세와 매매를 같은 화면에서 토글로 전환할 수 있다는 점도 이 리포트의 특징입니다. 최근 서울에서는 전세 매물 자체가 줄고 전세가가 오르면서, 매매는 부담스럽고 전세도 만만치 않은 이중 부담 구조가 형성됐습니다. 이 리포트에서 매매 탭과 전세 탭을 번갈아 눌러보면, 내 예산으로 매매가 가능한 구와 전세만 가능한 구, 둘 다 어려운 구가 어떻게 갈리는지 한눈에 비교할 수 있습니다.",
  "이 리포트는 대출 상담이나 투자 추천이 아닙니다. 비교계산소의 다른 부동산 리포트와 동일하게, 공개된 시세 데이터를 기준으로 단순화한 비교 정보를 제공하는 데 목적이 있습니다. 정확한 대출 한도나 세금, 자금 계획은 '부동산 매매 자금 계산기'와 금융기관 상담을 통해 별도로 확인하는 것이 안전합니다.",
];

export const SHAA_SEO_CRITERIA: string[] = [
  "구별 평균가·전세가율은 2024~2026년 공개 실거래 구조를 재구성한 표본·추정 데이터입니다.",
  "매매 가능 예산은 보유 현금을 LTV 가정으로 나눈 단순 추정값이며, DSR·신용도·규제지역 차등은 반영하지 않습니다.",
  "전세 가능 예산은 보유 현금에 전세대출 가정 비율을 더한 단순 추정값입니다.",
  "지도 경계는 빠른 탐색용 단순화 SVG로 실제 행정 경계와 다릅니다.",
];

export const SHAA_TIER_LABELS: Record<AffordabilityTier, string> = {
  buyable: "매매 가능",
  stretch: "대출 부담 큼",
  "jeonse-only": "전세만 가능",
  hard: "진입 어려움",
};

export const SHAA_RELATED_LINKS = [
  { href: "/reports/seoul-housing-2016-vs-2026/", label: "서울 집값 2016 vs 2026 비교", description: "서울 평균 매매가·전세가·PIR의 10년 변화" },
  { href: "/reports/seoul-jeonwolse-ratio-2026/", label: "서울 25개 구 전월세 전환 지도", description: "구별 전세 축소·월세화 흐름 비교" },
  { href: "/reports/seoul-apartment-jeonse-report/", label: "전세 사라지는 서울 아파트", description: "전세 비중 감소의 구조적 원인" },
  { href: "/tools/home-purchase-fund/", label: "부동산 매매 자금 계산기", description: "정확한 대출 한도·취득세까지 포함한 자금 계산" },
];

export function normalizeDistrictId(districtName: string): string {
  return SHAA_DISTRICT_ID_BY_NAME[districtName] ?? "";
}

export function formatManwonToEok(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "0원";
  const eok = value / 10000;
  return `${eok >= 10 ? eok.toFixed(1) : eok.toFixed(2)}억원`;
}

export function calcMaxBuyBudgetManwon(cashManwon: number, ltv: LtvAssumption) {
  const safeCash = Math.max(cashManwon || 0, 0);
  return Math.round(safeCash / (1 - ltv / 100));
}

export function calcMaxJeonseBudgetManwon(cashManwon: number, jeonseLoanRatio: number) {
  const safeCash = Math.max(cashManwon || 0, 0);
  return Math.round(safeCash + safeCash * jeonseLoanRatio);
}

export function classifyDistrict(
  district: SeoulApartmentDistrict,
  maxBuyBudgetManwon: number,
  maxJeonseBudgetManwon: number,
): AffordabilityResult {
  const averagePriceManwon = district.average / 10000;
  const price84Manwon = district.price84 / 10000;
  const jeonsePriceManwon = (district.average * (district.jeonseRatio / 100)) / 10000;

  // price84(국민평형 84㎡ 평균가)는 average(전체 평형 평균가)보다 항상 높은 값이므로
  // 더 큰 임계값(price84)을 먼저 확인해야 "대출 부담 큼" 구간이 정상적으로 분류된다.
  let tier: AffordabilityTier;
  if (maxBuyBudgetManwon >= price84Manwon) {
    tier = "buyable";
  } else if (maxBuyBudgetManwon >= averagePriceManwon) {
    tier = "stretch";
  } else if (maxJeonseBudgetManwon >= jeonsePriceManwon) {
    tier = "jeonse-only";
  } else {
    tier = "hard";
  }

  const referenceManwon = tier === "buyable" ? price84Manwon : averagePriceManwon;
  const gapManwon = tier === "buyable"
    ? maxBuyBudgetManwon - referenceManwon
    : referenceManwon - maxBuyBudgetManwon;

  const gapLabel = tier === "buyable"
    ? `예산 여유 약 ${formatManwonToEok(gapManwon * 10000)}`
    : `예산 부족 약 ${formatManwonToEok(gapManwon * 10000)}`;

  return {
    districtId: normalizeDistrictId(district.district),
    districtName: district.district,
    averagePrice: district.average,
    price84: district.price84,
    jeonsePrice: jeonsePriceManwon * 10000,
    tier,
    gapManwon: gapManwon * 10000,
    gapLabel,
  };
}

export function classifyAllDistricts(
  cashManwon: number,
  ltv: LtvAssumption,
  jeonseLoanRatio: number = SHAA_DEFAULTS.jeonseLoanRatio,
): AffordabilityResult[] {
  const maxBuy = calcMaxBuyBudgetManwon(cashManwon, ltv);
  const maxJeonse = calcMaxJeonseBudgetManwon(cashManwon, jeonseLoanRatio);
  return seoulApartmentDistricts.map((district) => classifyDistrict(district, maxBuy, maxJeonse));
}

export function getTierSummary(results: AffordabilityResult[]) {
  return {
    buyable: results.filter((r) => r.tier === "buyable").length,
    stretch: results.filter((r) => r.tier === "stretch").length,
    jeonseOnly: results.filter((r) => r.tier === "jeonse-only").length,
    hard: results.filter((r) => r.tier === "hard").length,
  };
}
