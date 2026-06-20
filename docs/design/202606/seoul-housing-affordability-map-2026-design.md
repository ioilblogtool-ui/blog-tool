# 내 연봉으로 서울 어디 살 수 있나 — 지도형 PIR 리포트 2026 설계 문서

## 1. 개요

- **슬러그**: `reports/seoul-housing-affordability-map-2026`
- **유형**: 리포트 (인터랙티브 지도 + 개인화 계산형)
- **prefix**: `shaa-` (Seoul Housing Affordability Atlas)
- **데이터 파일**: `src/data/seoulHousingAffordabilityMap2026.ts`
- **인터랙션 스크립트**: `public/scripts/seoul-housing-affordability-map-2026.js`
- **스타일**: `src/styles/scss/pages/_seoul-housing-affordability-map-2026.scss`
- **기획 문서**: `docs/plan/202606/seoul-housing-affordability-map-2026-plan.md`
- **후속편 관계**: `seoul-housing-2016-vs-2026`(서울 평균 10년 비교)의 구별 확장판. `seoul-jeonwolse-ratio-2026`(전월세 전환 지도), `seoul-apartment-jeonse-report`(전세 소멸)와 같은 클러스터로 상호 연결.

### 핵심 차별화

기존 서울 부동산 리포트들은 "시장이 어떻게 변했는가"를 설명하는 정적 콘텐츠다. 이 리포트는 **사용자의 연소득·보유 현금을 입력하면 25개 구 지도가 실시간으로 재색칠되는 개인화 계산형 콘텐츠**로, "나는 지금 서울 어디를 살 수 있나"라는 직접적인 검색 의도에 답한다. 매매/전세 토글로 "전월세" 검색 트래픽도 같은 페이지에서 흡수한다.

---

## 2. 화면 구성 (IA)

```text
[BaseLayout]
  SiteHeader
  main.report-page.shaa-page
    CalculatorHero          (eyebrow: "서울 주거 의사결정 리포트")
    InfoNotice              (단순화 계산 고지, 표본·추정 데이터 고지, SVG 지도 단순화 고지)

    section.shaa-inputs     (연소득 / 보유현금 / LTV 가정 입력 + 매매·전세 토글)  <- 핵심 인터랙션
    section.shaa-summary    (등급별 구 개수 KPI 카드 4종, 입력값 따라 실시간 갱신)
    section.shaa-workspace  (지도 + 검색 + 선택 구 상세 패널)  <- 핵심 섹션
    section.shaa-budget     (예산대별 추천 구 리스트 - 기존 budgetBands 재사용/확장)
    section.shaa-method     (계산 방법론 설명 카드)
    section.shaa-related    (관련 리포트/계산기 링크)

    SeoContent
```

---

## 3. 기존 자산 재사용 상세

### 3.1 지도 좌표 (`mapShapes`)

`src/pages/reports/local-election-seoul-2026.astro`의 `mapShapes` 배열(25개 구 `id`, `d`(SVG path), `x`/`y`(라벨 좌표))을 **그대로 복제**해 새 데이터 파일에 정의한다. 정당 데이터와는 무관하게 좌표만 가져오므로 import가 아니라 값 복제. 좌표 25개 전부 동일하게 사용 (도봉, 노원, 강북, 성북, 중랑, 은평, 서대문, 종로, 동대문, 광진, 마포, 중구, 성동, 용산, 강서, 양천, 구로, 금천, 영등포, 동작, 관악, 서초, 강남, 송파, 강동).

### 3.2 인터랙션 스크립트 패턴

`public/scripts/local-election-seoul-2026.js`의 구조(데이터 JSON 주입 → Map 변환 → 클릭/키보드/검색/해시 라우팅/툴팁)를 동일하게 따른다. 차이점:
- 정당색(`dem`/`ppp`) 대신 **등급색**(`buyable`/`stretch`/`jeonse-only`/`hard`) 클래스 적용
- 정적 데이터가 아니라 **입력값이 바뀔 때마다 전체 등급을 재계산하고 지도 클래스를 다시 칠하는 함수**(`recalculateAndRepaint`)가 추가됨 — 기존 election 스크립트에는 없는 신규 로직

### 3.3 구별 시세 데이터

`src/data/seoulApartmentPrice2026.ts`의 `seoulApartmentDistricts`(25개 구, `average`, `price84`, `jeonseRatio` 등)를 새 데이터 파일에서 import해 그대로 사용한다. 별도 데이터 중복 없이 단일 소스 유지.

---

## 4. 데이터 파일 (`src/data/seoulHousingAffordabilityMap2026.ts`)

```ts
import { seoulApartmentDistricts, type SeoulApartmentDistrict } from "./seoulApartmentPrice2026";

export type AffordabilityTier = "buyable" | "stretch" | "jeonse-only" | "hard";
export type HousingMode = "buy" | "jeonse";
export type LtvAssumption = 60 | 70 | 80;

export interface DistrictMapShape {
  id: string;
  d: string;
  x: number;
  y: number;
}

export interface DistrictDisplayMeta {
  id: string;
  districtName: string;
  districtShort: string;
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
    "구별 평균가·전세가율은 2024~2026년 공개 실거래 구조를 바탕으로 재구성한 표본·추정 리포트 기준입니다(seoul-apartment-price-2026 리포트와 동일 데이터). 대출 가능액은 LTV만 반영한 단순 추정이며, 실제 DSR, 신용도, 규제지역별 차등은 반영하지 않습니다.",
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

// districtName(예: "강남구") -> id 매핑은 normalizeDistrictId()로 처리
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
  jeonseLoanRatio: 0.8, // 보유 현금 대비 전세대출로 추가 확보 가능한 비율 가정
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

export function normalizeDistrictId(districtName: string): string | undefined {
  return SHAA_DISTRICT_ID_BY_NAME[districtName];
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

  let tier: AffordabilityTier;
  if (maxBuyBudgetManwon >= averagePriceManwon) {
    tier = "buyable";
  } else if (maxBuyBudgetManwon >= price84Manwon) {
    tier = "stretch";
  } else if (maxJeonseBudgetManwon >= jeonsePriceManwon) {
    tier = "jeonse-only";
  } else {
    tier = "hard";
  }

  const gapManwon = tier === "buyable"
    ? maxBuyBudgetManwon - averagePriceManwon
    : averagePriceManwon - maxBuyBudgetManwon;

  const gapLabel = tier === "buyable"
    ? `예산 여유 약 ${formatManwonToEok(gapManwon * 10000)}`
    : `예산 부족 약 ${formatManwonToEok(gapManwon * 10000)}`;

  return {
    districtId: normalizeDistrictId(district.district) ?? "",
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
```

> 참고: `calcMaxBuyBudgetManwon`의 LTV 0% 분모 보호는 `ltv`가 60/70/80 리터럴 타입으로 제한되어 100%가 들어올 수 없으므로 별도 가드 불필요.

---

## 5. Astro 페이지 (`src/pages/reports/seoul-housing-affordability-map-2026.astro`)

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import { seoulApartmentDistricts } from "../../data/seoulApartmentPrice2026";
import {
  SHAA_META,
  SHAA_MAP_SHAPES,
  SHAA_DEFAULTS,
  SHAA_BUDGET_BANDS,
  SHAA_FAQ,
  SHAA_SEO_INTRO,
  SHAA_SEO_CRITERIA,
  SHAA_RELATED_LINKS,
  SHAA_TIER_LABELS,
  normalizeDistrictId,
  classifyAllDistricts,
  getTierSummary,
  formatManwonToEok,
} from "../../data/seoulHousingAffordabilityMap2026";
import { withBase } from "../../utils/base";

const siteBase = (import.meta.env.SITE ?? "https://bigyocalc.com").replace(/\/$/, "");
const reportUrl = `${siteBase}/reports/${SHAA_META.slug}/`;

const initialResults = classifyAllDistricts(SHAA_DEFAULTS.cashManwon, SHAA_DEFAULTS.ltv);
const initialSummary = getTierSummary(initialResults);
const initialSelected = initialResults.find((r) => r.districtId === "gangnam") ?? initialResults[0];

// 클라이언트 스크립트에 넘길 원본 구별 시세 + 매핑 데이터
const clientPayload = {
  districts: seoulApartmentDistricts.map((d) => ({
    ...d,
    id: normalizeDistrictId(d.district),
  })),
  defaults: SHAA_DEFAULTS,
  tierLabels: SHAA_TIER_LABELS,
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: SHAA_META.title,
    description: SHAA_META.seoDescription,
    dateModified: SHAA_META.updatedAt,
    mainEntityOfPage: reportUrl,
    author: { "@type": "Organization", name: "비교계산소" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SHAA_FAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: siteBase },
      { "@type": "ListItem", position: 2, name: "리포트", item: `${siteBase}/reports/` },
      { "@type": "ListItem", position: 3, name: SHAA_META.title, item: reportUrl },
    ],
  },
];
---

<BaseLayout title={SHAA_META.seoTitle} description={SHAA_META.seoDescription} jsonLd={jsonLd}>
  <SiteHeader />

  <main class="container page-shell report-page shaa-page" data-report="seoul-housing-affordability-map-2026">
    <CalculatorHero
      eyebrow="서울 주거 의사결정 리포트"
      title={SHAA_META.title}
      description={SHAA_META.description}
    />

    <InfoNotice
      title="계산 기준 안내"
      lines={[
        SHAA_META.dataNote,
        "이 페이지는 대출 상담이나 투자 추천이 아니라, 공개 시세를 기준으로 단순화한 비교 정보입니다.",
        "정확한 대출 한도는 '부동산 매매 자금 계산기'나 금융기관 상담으로 별도 확인하세요.",
      ]}
    />

    <!-- 6.1 입력 섹션 / 6.2 등급 요약 / 6.3 지도+패널 / 6.4 예산대 / 6.5 방법론 / 6.6 관련링크 -->

    <script id="shaaPayload" type="application/json" set:html={JSON.stringify(clientPayload)} />

    <SeoContent
      introTitle="서울 집값, 내 연봉 기준으로 다시 보면"
      intro={SHAA_SEO_INTRO}
      criteria={SHAA_SEO_CRITERIA}
      faq={SHAA_FAQ}
      related={SHAA_RELATED_LINKS}
    />
  </main>

  <script src={withBase("scripts/seoul-housing-affordability-map-2026.js")} defer></script>
</BaseLayout>
```

---

## 6. 주요 섹션 마크업 설계

### 6.1 입력 섹션 (핵심 인터랙션)

```astro
<section class="content-section shaa-inputs" aria-labelledby="shaa-inputs-title">
  <div class="shaa-section-heading">
    <p>내 조건 입력</p>
    <h2 id="shaa-inputs-title">연소득과 보유 현금을 입력하면 지도가 바로 바뀝니다</h2>
    <span>입력값은 저장되지 않으며, URL 파라미터로만 공유됩니다.</span>
  </div>

  <div class="shaa-mode-toggle" role="tablist" aria-label="매매·전세 보기 전환">
    <button type="button" id="shaaModeBuy" class="shaa-mode-btn is-active" role="tab" aria-selected="true">매매로 보기</button>
    <button type="button" id="shaaModeJeonse" class="shaa-mode-btn" role="tab" aria-selected="false">전세로 보기</button>
  </div>

  <div class="shaa-input-grid">
    <label class="shaa-input-field">
      <span>연소득(만원)</span>
      <input type="range" id="shaaIncomeRange" min="2000" max="30000" step="100" value={SHAA_DEFAULTS.annualIncomeManwon} />
      <input type="number" id="shaaIncomeNumber" min="0" value={SHAA_DEFAULTS.annualIncomeManwon} />
    </label>
    <label class="shaa-input-field">
      <span>보유 현금(만원)</span>
      <input type="range" id="shaaCashRange" min="0" max="300000" step="500" value={SHAA_DEFAULTS.cashManwon} />
      <input type="number" id="shaaCashNumber" min="0" value={SHAA_DEFAULTS.cashManwon} />
    </label>
    <label class="shaa-input-field">
      <span>대출 가정 (LTV)</span>
      <select id="shaaLtvSelect">
        <option value="60">60%</option>
        <option value="70" selected>70%</option>
        <option value="80">80%</option>
      </select>
    </label>
  </div>
</section>
```

> `연소득`은 1차 버전에서는 지도 등급 계산에 직접 쓰이지 않고(매매/전세 등급은 현금+LTV 기준), `home-purchase-fund` 계산기 링크 CTA와 "연봉 대비 등급" 보조 텍스트("이 등급은 보유 현금 기준이며, 연소득 {income}만원 기준 연 상환 부담도 함께 고려하세요")에 활용한다. 향후 DSR 반영 시 실제 대출 한도 계산에 연동 가능하도록 입력 필드를 미리 마련.

### 6.2 등급 요약 KPI

```astro
<section class="content-section shaa-summary" aria-labelledby="shaa-summary-title">
  <div class="shaa-section-heading">
    <p>한눈에 보기</p>
    <h2 id="shaa-summary-title">서울 25개 구 중 몇 곳이 가능할까</h2>
  </div>

  <div class="shaa-summary-grid">
    <article class="shaa-summary-card shaa-summary-card--buyable">
      <span>매매 가능</span>
      <strong id="shaaCountBuyable">{initialSummary.buyable}</strong>
      <small>개 구</small>
    </article>
    <article class="shaa-summary-card shaa-summary-card--stretch">
      <span>대출 부담 큼</span>
      <strong id="shaaCountStretch">{initialSummary.stretch}</strong>
      <small>개 구</small>
    </article>
    <article class="shaa-summary-card shaa-summary-card--jeonse-only">
      <span>전세만 가능</span>
      <strong id="shaaCountJeonseOnly">{initialSummary.jeonseOnly}</strong>
      <small>개 구</small>
    </article>
    <article class="shaa-summary-card shaa-summary-card--hard">
      <span>진입 어려움</span>
      <strong id="shaaCountHard">{initialSummary.hard}</strong>
      <small>개 구</small>
    </article>
  </div>
</section>
```

### 6.3 지도 + 검색 + 상세 패널 (핵심 섹션, election 리포트 패턴 재사용)

```astro
<section class="content-section shaa-workspace" aria-labelledby="shaa-map-title">
  <div class="shaa-section-heading">
    <p>인터랙티브 지도</p>
    <h2 id="shaa-map-title">구를 클릭하면 상세 비교가 나옵니다</h2>
    <span>지도 색은 위에서 입력한 조건에 따라 실시간으로 바뀝니다.</span>
  </div>

  <div class="shaa-search" role="search">
    <label for="shaaDistrictSearch">구 이름 검색</label>
    <div class="shaa-search__row">
      <input id="shaaDistrictSearch" type="search" list="shaaDistrictOptions" placeholder="예: 강남구, 노원구" autocomplete="off" />
      <button type="button" id="shaaDistrictSearchButton">검색</button>
    </div>
    <datalist id="shaaDistrictOptions">
      {seoulApartmentDistricts.map((d) => <option value={d.district}>{d.district}</option>)}
    </datalist>
  </div>

  <div class="shaa-layout">
    <div class="shaa-map-wrap">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 940 780" class="shaa-map" id="shaaMap" role="img" aria-labelledby="shaa-map-svg-title">
        <title id="shaa-map-svg-title">서울 25개 구 PIR 기준 매매·전세 가능 여부 지도</title>
        <g class="shaa-map__regions">
          {SHAA_MAP_SHAPES.map((shape) => {
            const result = initialResults.find((r) => r.districtId === shape.id);
            return (
              <path
                id={`shaa-district-${shape.id}`}
                class={`shaa-map__district shaa-map__district--${result?.tier ?? "hard"}`}
                data-district-id={shape.id}
                d={shape.d}
                tabindex="0"
                role="button"
                aria-label={`${result?.districtName ?? shape.id} ${SHAA_TIER_LABELS[result?.tier ?? "hard"]}`}
              />
            );
          })}
        </g>
        <g class="shaa-map__labels" aria-hidden="true">
          {SHAA_MAP_SHAPES.map((shape) => {
            const result = initialResults.find((r) => r.districtId === shape.id);
            return <text x={shape.x} y={shape.y}>{result?.districtName.replace("구", "") ?? shape.id}</text>;
          })}
        </g>
      </svg>
      <div id="shaaTooltip" class="shaa-tooltip" aria-hidden="true"></div>
      <div class="shaa-legend" aria-label="지도 범례">
        <span class="shaa-legend__item shaa-legend__item--buyable">매매 가능</span>
        <span class="shaa-legend__item shaa-legend__item--stretch">대출 부담 큼</span>
        <span class="shaa-legend__item shaa-legend__item--jeonse-only">전세만 가능</span>
        <span class="shaa-legend__item shaa-legend__item--hard">진입 어려움</span>
      </div>
    </div>

    <aside class="shaa-panel" id="shaaPanel" aria-live="polite">
      <p class="shaa-panel__eyebrow">선택된 구</p>
      <h3 id="shaaPanelDistrictName">{initialSelected.districtName}</h3>
      <div id="shaaPanelTierPill" class={`shaa-tier-pill shaa-tier-pill--${initialSelected.tier}`}>
        {SHAA_TIER_LABELS[initialSelected.tier]}
      </div>
      <dl class="shaa-panel__facts">
        <div><dt>평균 매매가</dt><dd id="shaaPanelAverage">{formatManwonToEok(initialSelected.averagePrice)}</dd></div>
        <div><dt>84㎡ 평균가</dt><dd id="shaaPanelPrice84">{formatManwonToEok(initialSelected.price84)}</dd></div>
        <div><dt>추정 전세가</dt><dd id="shaaPanelJeonse">{formatManwonToEok(initialSelected.jeonsePrice)}</dd></div>
        <div><dt>예산 격차</dt><dd id="shaaPanelGap">{initialSelected.gapLabel}</dd></div>
      </dl>
    </aside>
  </div>
</section>
```

### 6.4 예산대별 추천

```astro
<section class="content-section shaa-budget" aria-labelledby="shaa-budget-title">
  <div class="shaa-section-heading">
    <p>예산대별 추천</p>
    <h2 id="shaa-budget-title">내 예산대에서는 어디부터 봐야 할까</h2>
  </div>

  <div class="shaa-budget-grid">
    {SHAA_BUDGET_BANDS.map((band) => (
      <article class="shaa-budget-card">
        <strong>{band.budget}</strong>
        <p class="shaa-budget-options">{band.options}</p>
        <p class="shaa-budget-strategy">{band.strategy}</p>
        <p class="shaa-budget-caution">⚠ {band.caution}</p>
      </article>
    ))}
  </div>
</section>
```

### 6.5 방법론

```astro
<section class="content-section shaa-method" aria-labelledby="shaa-method-title">
  <div class="shaa-section-heading">
    <p>계산 방법론</p>
    <h2 id="shaa-method-title">등급은 이렇게 계산됩니다</h2>
  </div>
  <div class="shaa-method-grid">
    <article>
      <h3>매매 가능 예산</h3>
      <p>보유 현금 ÷ (1 - LTV). LTV 70% 가정 시 보유 현금의 약 3.3배가 최대 매매 예산입니다.</p>
    </article>
    <article>
      <h3>전세 가능 예산</h3>
      <p>보유 현금 + (보유 현금 × 전세대출 가정 비율 80%). 전세는 매매보다 진입 장벽이 낮게 계산됩니다.</p>
    </article>
    <article>
      <h3>등급 분류 기준</h3>
      <p>매매 예산이 구 평균가 이상이면 매매 가능, 84㎡가 이상이면 대출 부담 큼, 전세 예산이 추정 전세가 이상이면 전세만 가능, 둘 다 부족하면 진입 어려움으로 분류합니다.</p>
    </article>
  </div>
</section>
```

### 6.6 관련 링크

```astro
<section class="content-section shaa-related" aria-labelledby="shaa-related-title">
  <div class="shaa-section-heading">
    <p>같이 보면 좋은 콘텐츠</p>
    <h2 id="shaa-related-title">서울 주거 리포트 이어서 보기</h2>
  </div>
  <div class="shaa-related-grid">
    {SHAA_RELATED_LINKS.map((link) => (
      <a class="shaa-related-card" href={withBase(link.href)}>
        <strong>{link.label}</strong>
        <p>{link.description}</p>
      </a>
    ))}
  </div>
</section>
```

---

## 7. 클라이언트 스크립트 설계 (`public/scripts/seoul-housing-affordability-map-2026.js`)

`local-election-seoul-2026.js`의 구조(데이터 주입 → 클릭/검색/툴팁/해시 라우팅)를 베이스로 하되, **입력값 변경 시 전체 재계산 후 지도 재색칠**하는 로직이 추가된다.

```js
(function () {
  const payloadScript = document.getElementById("shaaPayload");
  if (!payloadScript) return;

  const payload = JSON.parse(payloadScript.textContent || "{}");
  const districts = payload.districts || [];
  const tierLabels = payload.tierLabels || {};
  const defaults = payload.defaults || {};

  const incomeRange = document.getElementById("shaaIncomeRange");
  const incomeNumber = document.getElementById("shaaIncomeNumber");
  const cashRange = document.getElementById("shaaCashRange");
  const cashNumber = document.getElementById("shaaCashNumber");
  const ltvSelect = document.getElementById("shaaLtvSelect");
  const modeBuyBtn = document.getElementById("shaaModeBuy");
  const modeJeonseBtn = document.getElementById("shaaModeJeonse");
  const panel = document.getElementById("shaaPanel");
  const tooltip = document.getElementById("shaaTooltip");
  const searchInput = document.getElementById("shaaDistrictSearch");
  const searchButton = document.getElementById("shaaDistrictSearchButton");

  let mode = "buy"; // "buy" | "jeonse"
  let selectedDistrictId = "gangnam";

  const formatEok = (manwon) => {
    if (!Number.isFinite(manwon) || manwon <= 0) return "0원";
    const eok = manwon / 10000;
    return `${eok >= 10 ? eok.toFixed(1) : eok.toFixed(2)}억원`;
  };

  function calcMaxBuyBudget(cashManwon, ltv) {
    return cashManwon / (1 - ltv / 100);
  }

  function calcMaxJeonseBudget(cashManwon, jeonseLoanRatio) {
    return cashManwon + cashManwon * jeonseLoanRatio;
  }

  function classify(district, maxBuy, maxJeonse) {
    const averageManwon = district.average / 10000;
    const price84Manwon = district.price84 / 10000;
    const jeonseManwon = (district.average * (district.jeonseRatio / 100)) / 10000;

    let tier;
    if (maxBuy >= averageManwon) tier = "buyable";
    else if (maxBuy >= price84Manwon) tier = "stretch";
    else if (maxJeonse >= jeonseManwon) tier = "jeonse-only";
    else tier = "hard";

    return { ...district, tier, averageManwon, price84Manwon, jeonseManwon };
  }

  function recalcAll() {
    const cash = Number(cashNumber.value) || 0;
    const ltv = Number(ltvSelect.value) || 70;
    const maxBuy = calcMaxBuyBudget(cash, ltv);
    const maxJeonse = calcMaxJeonseBudget(cash, defaults.jeonseLoanRatio ?? 0.8);
    return districts.map((d) => classify(d, maxBuy, maxJeonse));
  }

  function repaintMap(results) {
    const byId = new Map(results.map((r) => [r.id, r]));
    document.querySelectorAll("[data-district-id]").forEach((node) => {
      const result = byId.get(node.dataset.districtId);
      if (!result) return;
      node.className = node.className.replace(/shaa-map__district--\S+/g, "").trim();
      node.classList.add(`shaa-map__district--${result.tier}`);
      node.setAttribute("aria-label", `${result.district} ${tierLabels[result.tier] ?? result.tier}`);
    });
  }

  function updateSummary(results) {
    const counts = { buyable: 0, stretch: 0, "jeonse-only": 0, hard: 0 };
    results.forEach((r) => { counts[r.tier] = (counts[r.tier] || 0) + 1; });
    const setText = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = String(value); };
    setText("shaaCountBuyable", counts.buyable);
    setText("shaaCountStretch", counts.stretch);
    setText("shaaCountJeonseOnly", counts["jeonse-only"]);
    setText("shaaCountHard", counts.hard);
  }

  function updatePanel(results) {
    const selected = results.find((r) => r.id === selectedDistrictId) || results[0];
    if (!selected || !panel) return;
    document.getElementById("shaaPanelDistrictName").textContent = selected.district;
    const pill = document.getElementById("shaaPanelTierPill");
    pill.textContent = tierLabels[selected.tier] ?? selected.tier;
    pill.className = `shaa-tier-pill shaa-tier-pill--${selected.tier}`;
    document.getElementById("shaaPanelAverage").textContent = formatEok(selected.averageManwon);
    document.getElementById("shaaPanelPrice84").textContent = formatEok(selected.price84Manwon);
    document.getElementById("shaaPanelJeonse").textContent = formatEok(selected.jeonseManwon);

    const cash = Number(cashNumber.value) || 0;
    const ltv = Number(ltvSelect.value) || 70;
    const maxBuy = calcMaxBuyBudget(cash, ltv);
    const gap = selected.tier === "buyable"
      ? maxBuy - selected.averageManwon
      : selected.averageManwon - maxBuy;
    const gapLabel = selected.tier === "buyable"
      ? `예산 여유 약 ${formatEok(gap)}`
      : `예산 부족 약 ${formatEok(gap)}`;
    document.getElementById("shaaPanelGap").textContent = gapLabel;
  }

  function recalcAndRepaint() {
    const results = recalcAll();
    repaintMap(results);
    updateSummary(results);
    updatePanel(results);
  }

  function syncRangeAndNumber(rangeEl, numberEl) {
    rangeEl.addEventListener("input", () => { numberEl.value = rangeEl.value; recalcAndRepaint(); });
    numberEl.addEventListener("input", () => { rangeEl.value = numberEl.value; recalcAndRepaint(); });
  }
  syncRangeAndNumber(incomeRange, incomeNumber);
  syncRangeAndNumber(cashRange, cashNumber);
  ltvSelect.addEventListener("change", recalcAndRepaint);

  function setMode(nextMode) {
    mode = nextMode;
    modeBuyBtn.classList.toggle("is-active", mode === "buy");
    modeBuyBtn.setAttribute("aria-selected", String(mode === "buy"));
    modeJeonseBtn.classList.toggle("is-active", mode === "jeonse");
    modeJeonseBtn.setAttribute("aria-selected", String(mode === "jeonse"));
    document.querySelectorAll(".shaa-map").forEach((map) => map.classList.toggle("shaa-map--jeonse", mode === "jeonse"));
    // 매매 모드: buyable/stretch 강조, 전세 모드: jeonse-only까지 포함해 강조 (CSS 클래스로 분기)
  }
  modeBuyBtn.addEventListener("click", () => setMode("buy"));
  modeJeonseBtn.addEventListener("click", () => setMode("jeonse"));

  document.querySelectorAll("[data-district-id]").forEach((node) => {
    const id = node.dataset.districtId;
    node.addEventListener("click", () => { selectedDistrictId = id; updatePanel(recalcAll()); history.replaceState(null, "", `#${id}`); });
    node.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectedDistrictId = id; updatePanel(recalcAll()); }
    });
    node.addEventListener("mouseenter", () => {
      const result = recalcAll().find((r) => r.id === id);
      if (!tooltip || !result) return;
      tooltip.innerHTML = `<strong>${result.district}</strong><span>${tierLabels[result.tier]}</span>`;
      tooltip.setAttribute("aria-hidden", "false");
    });
    node.addEventListener("mousemove", (e) => { if (tooltip) { tooltip.style.left = `${e.offsetX + 14}px`; tooltip.style.top = `${e.offsetY + 14}px`; } });
    node.addEventListener("mouseleave", () => { if (tooltip) tooltip.setAttribute("aria-hidden", "true"); });
  });

  function findDistrict(query) {
    const normalized = String(query || "").trim().replace(/\s/g, "");
    if (!normalized) return null;
    return districts.find((d) => d.district.replace(/\s/g, "").includes(normalized)) || null;
  }
  function runSearch() {
    const district = findDistrict(searchInput.value);
    if (district) {
      selectedDistrictId = district.id;
      updatePanel(recalcAll());
      document.getElementById(`shaa-district-${district.id}`)?.focus({ preventScroll: true });
    }
  }
  searchButton.addEventListener("click", runSearch);
  searchInput.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); runSearch(); } });

  const hashId = decodeURIComponent(window.location.hash.replace("#", ""));
  if (districts.some((d) => d.id === hashId)) selectedDistrictId = hashId;

  recalcAndRepaint();
})();
```

> XSS 방지: 패널 렌더링은 `textContent` 위주로 작성해 `innerHTML` 사용을 툴팁 한 곳으로 최소화했고, 툴팁에 들어가는 값은 데이터 파일 출처(구 이름·등급 라벨)로 사용자 입력이 직접 삽입되지 않으므로 안전함.

---

## 8. SCSS 설계 포인트 (`_seoul-housing-affordability-map-2026.scss`)

`local-election-seoul-2026.scss`의 지도/툴팁/패널 레이아웃 구조를 베이스로 하되 색상 토큰을 등급색으로 교체:

```scss
.shaa-page {
  --shaa-buyable: #0f8a5f;
  --shaa-stretch: #b8860b;
  --shaa-jeonse-only: #2f5acf;
  --shaa-hard: #c23b3b;

  .shaa-map__district {
    stroke: #fff;
    stroke-width: 1.5;
    cursor: pointer;
    transition: fill 0.2s, opacity 0.15s;

    &--buyable { fill: var(--shaa-buyable); }
    &--stretch { fill: var(--shaa-stretch); }
    &--jeonse-only { fill: var(--shaa-jeonse-only); }
    &--hard { fill: var(--shaa-hard); }

    &.is-active { stroke: #172033; stroke-width: 3; }
    &:hover { opacity: 0.85; }
  }

  // 입력 그리드, 요약 카드, 패널, 범례, 예산대 카드, 방법론 카드 레이아웃은
  // lee-kang-in-psg-salary-2026 / han-seong-sook 설계 문서와 동일한
  // grid + card 패턴(--ink/--muted/--line/--soft 토큰) 재사용
}
```

> 전체 SCSS는 구현 단계에서 기존 `_local-election-seoul-2026.scss`와 `_lee-kang-in-psg-salary-2026.scss`를 참고해 작성하며, 위 색상 토큰과 지도 클래스만 신규로 정의하면 나머지(KPI 카드, 패널, 검색창, 범례, 모바일 반응형)는 기존 패턴을 그대로 복제해 일관성을 유지한다.

---

## 9. SEO 콘텐츠 (GOOGLE_SEO_RULES.md 기준)

- `intro` 5단락, 1,000자 이상 (위 데이터 파일 `SHAA_SEO_INTRO` 참고 — 800자 기준 충족)
- `faq` 6개 (5개 기준 충족)
- `SeoContent`를 `main` 내부에 일반 자식으로 배치 (리포트는 Shell을 쓰지 않으므로 `Fragment slot` 불필요 — `lee-kang-in-psg-salary-2026.astro` 실제 구현과 동일 패턴)
- JSON-LD: `Article`, `FAQPage`, `BreadcrumbList`

---

## 10. 등록 체크리스트

| 파일 | 작업 |
|---|---|
| `src/data/reports.ts` | `seoul-housing-affordability-map-2026` 항목 추가 |
| `src/styles/app.scss` | `@use 'scss/pages/seoul-housing-affordability-map-2026';` 추가 |
| `public/sitemap.xml` | `/reports/seoul-housing-affordability-map-2026/` 추가 (`changefreq: monthly`) |
| `src/data/seoulHousing2016Vs2026.ts` | `relatedLinks`에 본 리포트 추가 검토 |
| `src/data/seoulJeonwolseRatio2026.ts` | 관련 링크에 본 리포트 추가 검토 (전세 검색 트래픽 상호 연결) |
| `src/pages/reports/index.astro` | 리포트 허브 노출 확인 |

---

## 11. QA 포인트

- [ ] 입력값(연소득/현금/LTV) 변경 시 지도 색·요약 카운트·패널이 모두 동기화되어 갱신됨
- [ ] 매매/전세 토글 전환이 정상 동작
- [ ] 검색·해시 라우팅·키보드 포커스(Enter/Space)로 구 선택 가능
- [ ] `intro` 800자 이상, `faq` 5개 이상
- [ ] 모바일 375px에서 입력 그리드·지도·패널이 세로로 자연스럽게 쌓임 (지도는 가로 스크롤 없이 viewBox 비율 유지)
- [ ] LTV 60/70/80% 변경 시 등급 분류가 합리적으로 바뀌는지 수동 검증 (경계값 케이스 포함)
- [ ] 모든 추정 수치에 "단순 추정", "표본·추정" 고지 유지
- [ ] JSON-LD 3종 생성 확인
- [ ] `reports.ts`, `app.scss`, `sitemap.xml` 등록 누락 없음
- [ ] `npm run build` 성공

---

## 12. 구현 리스크

- **대출 한도 오인 리스크**: LTV만 반영한 단순 계산이 실제 대출 가능액처럼 오인될 수 있음. InfoNotice, FAQ, 방법론 섹션 3곳에서 반복 고지하고 `home-purchase-fund` 계산기로 CTA 연결.
- **구 평균가 표본 한계**: 같은 구 안 단지별 편차가 크다는 점을 지도 패널과 SEO 콘텐츠에 반복 노출.
- **지도 좌표 재사용 시 일관성 깨짐 리스크**: `mapShapes` 좌표를 복제하는 과정에서 25개 구 누락/오타가 생기면 일부 구가 클릭 불가능해짐 — 구현 시 `local-election-seoul-2026.astro`의 좌표를 1:1 diff로 검증.
- **성능**: 25개 구 × 입력 변경마다 재계산은 연산량이 작아 디바운스 없이도 충분히 빠름 (단, `input` 이벤트가 매우 빠르게 연속 발생하는 슬라이더 드래그 시 가벼운 `requestAnimationFrame` 스로틀링 고려 가능 — 1차 구현에서는 생략 가능).
