# 항공권 최저가 시기 계산기 설계 문서

> 기획 원문: `docs/plan/202604/flight-cheapest-timing-calculator.md`  
> 작성일: 2026-04-20  
> 구현 기준: 현재 비교계산소 `/tools/` 계산기 구조를 기준으로 Codex/Claude가 바로 구현 가능한 수준  
> 중요 고지: 이 도구는 실시간 항공권 조회가 아니라 권역·시즌·예매 시점 계수를 사용하는 `추정 시뮬레이션` 계산기다.

---

## 1. 문서 개요

### 1-1. 대상

- 기획 문서: `docs/plan/202604/flight-cheapest-timing-calculator.md`
- 구현 대상: `항공권 최저가 시기 계산기`
- 권장 slug: `flight-cheapest-timing-calculator`
- URL: `/tools/flight-cheapest-timing-calculator/`
- 콘텐츠 유형: 인터랙티브 계산기 (`/tools/` 계열)
- 페이지 분류: 여행/항공/숙박비

### 1-2. 페이지 역할

이 계산기는 사용자가 여행 조건을 입력하면 아래 4가지를 바로 판단하도록 돕는다.

- 출발일 기준 권장 예매 시점
- 지금 예매와 기다렸다 예매하는 경우의 예상 가격 차이
- 인원수 반영 총 항공권 비용 차이
- 성수기·요일·시간대 선택에 따른 추가 부담 또는 절약 효과

핵심 메시지는 `항공권은 언제 사느냐에 따라 총 여행비가 달라진다`가 아니라, `내 조건에서는 지금 예매와 대기 중 어느 쪽이 더 유리한가`다.

### 1-3. 참고 구현 패턴

- `overseas-travel-cost`
  - 여행 비용 입력 구조, 지역 프리셋, FAQ/SEO 블록 참고
- `jeonwolse-conversion`
  - 입력 변경 즉시 결과 재계산, 결과 해석 카드 참고
- `ai-stack-cost-calculator`
  - 결과 KPI 카드 + 시나리오 비교 구조 참고
- `dca-investment-calculator`
  - 기간별 시뮬레이션 차트, 하단 관련 계산기 CTA 참고

### 1-4. MVP 범위

**1차 출시 필수 구현**

- 프리셋 4개
- 입력 폼
- 결과 KPI 카드 5개
- 지금 예매 vs 최적 시점 예매 비교
- 예매 시점별 예상가 차트
- 권역별 예매 가이드
- 시즌·요일·시간대 해석 문구
- 관련 여행 계산기 CTA
- FAQ + `SeoContent`
- `추정 시뮬레이션` 고지

**2차 확장 후보**

- 세부 도시별 기준 운임 확대
- 직항/경유 옵션
- 수하물·좌석지정 포함 총액 비교
- 가격 알림 추천일 계산
- 실제 항공권 비교 제휴 링크 연동

---

## 2. 파일 구조

```
src/
  data/
    flightCheapestTimingCalculator.ts
  pages/
    tools/
      flight-cheapest-timing-calculator.astro

public/
  og/
    tools/
      flight-cheapest-timing-calculator.png
  scripts/
    flight-cheapest-timing-calculator.js

src/styles/scss/pages/
  _flight-cheapest-timing-calculator.scss
```

등록 체크:

- `src/data/tools.ts`에 slug 등록
- `src/styles/app.scss`에 `@use "scss/pages/flight-cheapest-timing-calculator";` 추가
- `public/sitemap.xml`에 `/tools/flight-cheapest-timing-calculator/` 추가
- OG 이미지 생성 또는 placeholder 확인

---

## 3. 데이터 파일 설계

파일: `src/data/flightCheapestTimingCalculator.ts`

### 3-1. 타입 정의

```ts
export type FlightOrigin = "icn" | "gmp" | "pus" | "tae" | "cju" | "regional";

export type FlightRegion =
  | "japan"
  | "southeast-asia"
  | "china-hk-tw"
  | "europe"
  | "americas"
  | "oceania";

export type DepartureDayPreference =
  | "any"
  | "weekday"
  | "friday"
  | "saturday"
  | "sunday";

export type FlightTimePreference = "any" | "early" | "late-night" | "regular";

export type AirlinePreference = "lowest" | "lcc-ok" | "fsc";

export type BookingAdviceStatus = "book-now" | "wait-possible" | "high-risk";

export type FlightTimingPreset = {
  id: string;
  label: string;
  origin: FlightOrigin;
  region: FlightRegion;
  destinationLabel: string;
  departureMonth: number;
  persons: number;
  nights: number;
  dayPreference: DepartureDayPreference;
  timePreference: FlightTimePreference;
  baggageIncluded: boolean;
  airlinePreference: AirlinePreference;
  assumedWeeksBeforeDeparture: number;
  description: string;
};

export type FlightBaseFare = {
  origin: FlightOrigin;
  region: FlightRegion;
  label: string;
  baseFare: number;
  fareRangeLabel: string;
};

export type BookingWindowRule = {
  region: FlightRegion;
  minWeeks: number;
  maxWeeks: number;
  factor: number;
  label: string;
};

export type RegionBookingGuide = {
  region: FlightRegion;
  label: string;
  recommendedWeeksLabel: string;
  recommendedMinWeeks: number;
  recommendedMaxWeeks: number;
  shortTip: string;
  caution: string;
};
```

### 3-2. 프리셋 데이터

```ts
export const FLIGHT_TIMING_PRESETS: FlightTimingPreset[] = [
  {
    id: "japan-weekend",
    label: "일본 주말 여행",
    origin: "icn",
    region: "japan",
    destinationLabel: "오사카/도쿄",
    departureMonth: 7,
    persons: 2,
    nights: 4,
    dayPreference: "friday",
    timePreference: "regular",
    baggageIncluded: true,
    airlinePreference: "lcc-ok",
    assumedWeeksBeforeDeparture: 10,
    description: "여름 휴가철 일본 단거리 노선 기준",
  },
  {
    id: "sea-vacation",
    label: "동남아 휴양 여행",
    origin: "icn",
    region: "southeast-asia",
    destinationLabel: "방콕/다낭",
    departureMonth: 8,
    persons: 2,
    nights: 5,
    dayPreference: "saturday",
    timePreference: "late-night",
    baggageIncluded: true,
    airlinePreference: "lcc-ok",
    assumedWeeksBeforeDeparture: 12,
    description: "성수기 휴양지 왕복 항공권 기준",
  },
  {
    id: "europe-free-travel",
    label: "유럽 자유여행",
    origin: "icn",
    region: "europe",
    destinationLabel: "파리/런던",
    departureMonth: 10,
    persons: 2,
    nights: 7,
    dayPreference: "weekday",
    timePreference: "regular",
    baggageIncluded: true,
    airlinePreference: "fsc",
    assumedWeeksBeforeDeparture: 18,
    description: "장거리 이코노미 왕복 항공권 기준",
  },
  {
    id: "americas-long-haul",
    label: "미주 장거리 여행",
    origin: "icn",
    region: "americas",
    destinationLabel: "뉴욕/LA",
    departureMonth: 12,
    persons: 2,
    nights: 7,
    dayPreference: "weekday",
    timePreference: "regular",
    baggageIncluded: true,
    airlinePreference: "fsc",
    assumedWeeksBeforeDeparture: 20,
    description: "연말 미주 장거리 노선 기준",
  },
];
```

### 3-3. 기준 운임 테이블

초기 MVP는 권역 단위 평균 기준가만 사용한다. 실제 항공권 가격처럼 보이지 않도록 UI와 본문에 `예상`, `시뮬레이션`, `참고용` 표현을 반드시 사용한다.

```ts
export const FLIGHT_BASE_FARES: FlightBaseFare[] = [
  { origin: "icn", region: "japan", label: "인천 → 일본", baseFare: 220000, fareRangeLabel: "20만~45만원" },
  { origin: "icn", region: "southeast-asia", label: "인천 → 동남아", baseFare: 390000, fareRangeLabel: "30만~70만원" },
  { origin: "icn", region: "china-hk-tw", label: "인천 → 중국·홍콩·대만", baseFare: 300000, fareRangeLabel: "25만~60만원" },
  { origin: "icn", region: "europe", label: "인천 → 유럽", baseFare: 980000, fareRangeLabel: "90만~180만원" },
  { origin: "icn", region: "americas", label: "인천 → 미주", baseFare: 1150000, fareRangeLabel: "110만~220만원" },
  { origin: "icn", region: "oceania", label: "인천 → 대양주", baseFare: 850000, fareRangeLabel: "75만~160만원" },
];
```

김포·부산·대구·제주·기타 지방 출발은 MVP에서 기준 운임에 출발지 계수만 곱한다.

```ts
export const ORIGIN_FACTORS: Record<FlightOrigin, number> = {
  icn: 1,
  gmp: 1.03,
  pus: 1.08,
  tae: 1.12,
  cju: 1.15,
  regional: 1.18,
};
```

### 3-4. 시즌 계수

```ts
export const MONTH_SEASON_FACTORS: Record<number, { label: string; factor: number; tone: "low" | "normal" | "high" | "peak" }> = {
  1: { label: "겨울 성수기/설 연휴 영향", factor: 1.20, tone: "high" },
  2: { label: "겨울 여행 수요", factor: 1.08, tone: "normal" },
  3: { label: "비수기", factor: 0.95, tone: "low" },
  4: { label: "봄 여행 수요", factor: 1.03, tone: "normal" },
  5: { label: "연휴 수요", factor: 1.10, tone: "high" },
  6: { label: "비수기", factor: 0.96, tone: "low" },
  7: { label: "여름 성수기", factor: 1.22, tone: "high" },
  8: { label: "여름 극성수기", factor: 1.32, tone: "peak" },
  9: { label: "추석 변수", factor: 1.12, tone: "high" },
  10: { label: "가을 여행 수요", factor: 1.06, tone: "normal" },
  11: { label: "비수기", factor: 0.93, tone: "low" },
  12: { label: "연말 성수기", factor: 1.25, tone: "peak" },
};
```

### 3-5. 권역별 예매 시점 규칙

예매 시점은 `출발까지 남은 주 수` 기준이다. 낮은 계수일수록 예상가가 낮다.

```ts
export const BOOKING_WINDOW_RULES: BookingWindowRule[] = [
  { region: "japan", minWeeks: 13, maxWeeks: 52, factor: 1.05, label: "너무 이른 예약" },
  { region: "japan", minWeeks: 8, maxWeeks: 12, factor: 0.96, label: "조기 예약 구간" },
  { region: "japan", minWeeks: 4, maxWeeks: 7, factor: 0.92, label: "최저가 가능 구간" },
  { region: "japan", minWeeks: 2, maxWeeks: 3, factor: 1.00, label: "보통 구간" },
  { region: "japan", minWeeks: 0, maxWeeks: 1, factor: 1.18, label: "임박 상승 구간" },

  { region: "southeast-asia", minWeeks: 14, maxWeeks: 52, factor: 1.04, label: "너무 이른 예약" },
  { region: "southeast-asia", minWeeks: 10, maxWeeks: 13, factor: 0.97, label: "조기 예약 구간" },
  { region: "southeast-asia", minWeeks: 6, maxWeeks: 9, factor: 0.91, label: "최저가 가능 구간" },
  { region: "southeast-asia", minWeeks: 3, maxWeeks: 5, factor: 1.00, label: "보통 구간" },
  { region: "southeast-asia", minWeeks: 0, maxWeeks: 2, factor: 1.17, label: "임박 상승 구간" },

  { region: "china-hk-tw", minWeeks: 12, maxWeeks: 52, factor: 1.04, label: "너무 이른 예약" },
  { region: "china-hk-tw", minWeeks: 8, maxWeeks: 11, factor: 0.97, label: "조기 예약 구간" },
  { region: "china-hk-tw", minWeeks: 5, maxWeeks: 7, factor: 0.93, label: "최저가 가능 구간" },
  { region: "china-hk-tw", minWeeks: 2, maxWeeks: 4, factor: 1.00, label: "보통 구간" },
  { region: "china-hk-tw", minWeeks: 0, maxWeeks: 1, factor: 1.16, label: "임박 상승 구간" },

  { region: "europe", minWeeks: 22, maxWeeks: 52, factor: 1.03, label: "너무 이른 예약" },
  { region: "europe", minWeeks: 15, maxWeeks: 21, factor: 0.96, label: "조기 예약 구간" },
  { region: "europe", minWeeks: 10, maxWeeks: 14, factor: 0.92, label: "최저가 가능 구간" },
  { region: "europe", minWeeks: 5, maxWeeks: 9, factor: 1.03, label: "상승 전환 구간" },
  { region: "europe", minWeeks: 0, maxWeeks: 4, factor: 1.20, label: "임박 상승 구간" },

  { region: "americas", minWeeks: 24, maxWeeks: 52, factor: 1.03, label: "너무 이른 예약" },
  { region: "americas", minWeeks: 16, maxWeeks: 23, factor: 0.96, label: "조기 예약 구간" },
  { region: "americas", minWeeks: 12, maxWeeks: 15, factor: 0.93, label: "최저가 가능 구간" },
  { region: "americas", minWeeks: 6, maxWeeks: 11, factor: 1.04, label: "상승 전환 구간" },
  { region: "americas", minWeeks: 0, maxWeeks: 5, factor: 1.22, label: "임박 상승 구간" },

  { region: "oceania", minWeeks: 22, maxWeeks: 52, factor: 1.03, label: "너무 이른 예약" },
  { region: "oceania", minWeeks: 14, maxWeeks: 21, factor: 0.96, label: "조기 예약 구간" },
  { region: "oceania", minWeeks: 9, maxWeeks: 13, factor: 0.93, label: "최저가 가능 구간" },
  { region: "oceania", minWeeks: 5, maxWeeks: 8, factor: 1.03, label: "상승 전환 구간" },
  { region: "oceania", minWeeks: 0, maxWeeks: 4, factor: 1.19, label: "임박 상승 구간" },
];
```

### 3-6. 보조 계수

```ts
export const DAY_FACTORS: Record<DepartureDayPreference, { label: string; factor: number }> = {
  any: { label: "상관없음", factor: 1.00 },
  weekday: { label: "평일", factor: 0.97 },
  friday: { label: "금요일", factor: 1.08 },
  saturday: { label: "토요일", factor: 1.08 },
  sunday: { label: "일요일", factor: 1.04 },
};

export const TIME_FACTORS: Record<FlightTimePreference, { label: string; factor: number }> = {
  any: { label: "상관없음", factor: 0.98 },
  early: { label: "조조편", factor: 0.94 },
  "late-night": { label: "심야편", factor: 0.95 },
  regular: { label: "일반 시간대", factor: 1.00 },
};

export const AIRLINE_FACTORS: Record<AirlinePreference, { label: string; factor: number }> = {
  lowest: { label: "최저가 우선", factor: 0.94 },
  "lcc-ok": { label: "LCC 가능", factor: 0.97 },
  fsc: { label: "FSC 선호", factor: 1.08 },
};

export const BAGGAGE_INCLUDED_EXTRA = 35000;
```

### 3-7. 권역별 가이드 데이터

```ts
export const REGION_BOOKING_GUIDES: RegionBookingGuide[] = [
  {
    region: "japan",
    label: "일본",
    recommendedWeeksLabel: "출발 4~8주 전",
    recommendedMinWeeks: 4,
    recommendedMaxWeeks: 8,
    shortTip: "주말·연휴 단거리 노선은 좌석 소진이 빨라지는 편입니다.",
    caution: "벚꽃·여름휴가·연말에는 대기 전략보다 조기 확정이 유리할 수 있습니다.",
  },
  {
    region: "southeast-asia",
    label: "동남아",
    recommendedWeeksLabel: "출발 6~10주 전",
    recommendedMinWeeks: 6,
    recommendedMaxWeeks: 10,
    shortTip: "휴양지 노선은 심야편 선택 시 총액을 낮추기 쉽습니다.",
    caution: "8월·연말에는 숙박비까지 같이 오르므로 항공권만 따로 늦추기 어렵습니다.",
  },
  {
    region: "china-hk-tw",
    label: "중국·홍콩·대만",
    recommendedWeeksLabel: "출발 5~9주 전",
    recommendedMinWeeks: 5,
    recommendedMaxWeeks: 9,
    shortTip: "단거리 도시 여행은 평일 출발 선택지가 있으면 절약 폭이 커집니다.",
    caution: "연휴·박람회·콘서트 일정에 따라 도시별 편차가 큽니다.",
  },
  {
    region: "europe",
    label: "유럽",
    recommendedWeeksLabel: "출발 10~18주 전",
    recommendedMinWeeks: 10,
    recommendedMaxWeeks: 18,
    shortTip: "장거리 노선은 너무 늦으면 선택 가능한 항공사와 환승 조합이 줄어듭니다.",
    caution: "여름·연말은 항공권과 숙박 모두 빠르게 오르는 구간입니다.",
  },
  {
    region: "americas",
    label: "미주",
    recommendedWeeksLabel: "출발 12~20주 전",
    recommendedMinWeeks: 12,
    recommendedMaxWeeks: 20,
    shortTip: "장거리 직항 선호 시 조기 예매 안정성이 높습니다.",
    caution: "출발 임박 시 1인당 수십만원 차이가 날 수 있습니다.",
  },
  {
    region: "oceania",
    label: "대양주",
    recommendedWeeksLabel: "출발 9~16주 전",
    recommendedMinWeeks: 9,
    recommendedMaxWeeks: 16,
    shortTip: "성수기 휴양·어학 수요가 겹치는 달은 조기 확정이 유리합니다.",
    caution: "크리스마스·연말 출발은 대기 전략 위험이 큽니다.",
  },
];
```

### 3-8. FAQ 데이터

```ts
export const FLIGHT_TIMING_FAQ = [
  {
    q: "항공권은 보통 몇 주 전에 예매하는 것이 가장 싼가요?",
    a: "권역과 시즌에 따라 다르지만 단거리 노선은 출발 4~10주 전, 장거리 노선은 출발 10~20주 전이 유리한 경우가 많습니다. 이 계산기는 입력 조건에 따라 권장 구간을 추정합니다.",
  },
  {
    q: "이 계산기의 항공권 가격은 실시간 최저가인가요?",
    a: "아닙니다. 실시간 항공권 조회가 아니라 권역별 기준 운임과 시즌·요일·예매 시점 계수를 조합한 추정 시뮬레이션입니다. 실제 결제 전에는 항공권 비교 서비스에서 최종 금액을 확인해야 합니다.",
  },
  {
    q: "성수기에는 기다리면 더 싸질 수도 있나요?",
    a: "성수기에는 좌석이 줄어들수록 가격이 빠르게 오를 수 있어 대기 전략이 불리할 수 있습니다. 특히 가족 여행처럼 여러 좌석이 필요한 경우 더 이른 예매가 안정적입니다.",
  },
  {
    q: "조조편이나 심야편은 정말 더 저렴한가요?",
    a: "수요가 낮은 시간대는 일반 시간대보다 저렴한 경우가 많습니다. 다만 공항 이동 비용, 숙박 체크인 시간, 가족 동반 편의성까지 함께 고려해야 합니다.",
  },
  {
    q: "LCC가 항상 더 저렴한가요?",
    a: "기본 운임만 보면 LCC가 저렴할 수 있지만 수하물, 좌석 지정, 기내식, 변경 수수료를 합치면 FSC와 총액 차이가 줄어들 수 있습니다.",
  },
  {
    q: "가족 여행은 언제 예매하는 것이 좋나요?",
    a: "인원수가 많을수록 같은 가격대 좌석을 여러 장 확보하기 어렵습니다. 가족 여행은 단독 여행보다 권장 예매 구간의 앞쪽에서 확정하는 편이 안전합니다.",
  },
];
```

---

## 4. 계산 로직

### 4-1. 입력값

| 변수명 | 타입 | 설명 | 기본값 |
|---|---|---|---|
| `origin` | `FlightOrigin` | 출발 공항 | `icn` |
| `region` | `FlightRegion` | 목적지 권역 | `japan` |
| `destinationLabel` | `string` | 세부 목적지 표시명 | `오사카/도쿄` |
| `departureMonth` | `number` | 출발 희망 월 | `7` |
| `persons` | `number` | 여행 인원 | `2` |
| `nights` | `number` | 여행 박 수 | `4` |
| `dayPreference` | `DepartureDayPreference` | 출발 요일 선호 | `friday` |
| `timePreference` | `FlightTimePreference` | 시간대 선호 | `regular` |
| `baggageIncluded` | `boolean` | 수하물 포함 여부 | `true` |
| `airlinePreference` | `AirlinePreference` | 항공사 성향 | `lcc-ok` |
| `weeksBeforeDeparture` | `number` | 현재 기준 출발까지 남은 주 수 | `10` |

### 4-2. 기본 계산식

```ts
estimatedFarePerPerson =
  baseFare
  * originFactor
  * seasonFactor
  * bookingWindowFactor
  * dayFactor
  * timeFactor
  * airlineFactor
  + baggageExtra;

totalFare = roundToNearestThousand(estimatedFarePerPerson) * persons;
```

반올림:

- 1인 예상가는 1,000원 단위 반올림
- 총액은 `1인 예상가 × 인원수`
- 절약액은 음수가 되면 `추가 부담액`으로 표시

### 4-3. 최적 시점 계산

1. 선택한 권역의 `REGION_BOOKING_GUIDES`에서 권장 최소·최대 주차를 찾는다.
2. `recommendedMinWeeks`와 `recommendedMaxWeeks` 사이의 각 주차를 후보로 둔다.
3. 후보 주차별 예상가를 계산한다.
4. 가장 낮은 예상가를 `optimalFarePerPerson`으로 둔다.
5. 해당 주차를 `optimalWeeksBeforeDeparture`로 표시한다.

### 4-4. 시나리오 차트 데이터

고정 시나리오:

- 지금 예매: `weeksBeforeDeparture`
- 2주 후 예매: `max(weeksBeforeDeparture - 2, 0)`
- 4주 후 예매: `max(weeksBeforeDeparture - 4, 0)`
- 8주 후 예매: `max(weeksBeforeDeparture - 8, 0)`
- 출발 직전: `0`

시나리오별 계산값:

```ts
type FlightTimingScenario = {
  id: string;
  label: string;
  weeksBeforeDeparture: number;
  farePerPerson: number;
  totalFare: number;
  isBest: boolean;
};
```

### 4-5. 추천 상태값

| 상태 | 조건 | 문구 방향 |
|---|---|---|
| `book-now` | 현재 예매가가 최적가 대비 3% 이내이거나 성수기·임박 구간 | 지금 예매 추천 |
| `wait-possible` | 2~8주 후 시나리오 중 현재보다 5% 이상 낮은 값 존재 | 대기 가능 |
| `high-risk` | 출발까지 3주 이하 또는 성수기 `peak` + 현재가 상승 구간 | 지연 위험 |

상태 판단 우선순위:

1. `high-risk`
2. `book-now`
3. `wait-possible`

### 4-6. 결과 출력값

| 변수명 | 설명 |
|---|---|
| `recommendedWeeksLabel` | 권역별 권장 예매 구간 |
| `currentFarePerPerson` | 지금 예매 예상 1인 운임 |
| `optimalFarePerPerson` | 최적 시점 예상 1인 운임 |
| `savingPerPerson` | 1인당 예상 절약액 |
| `totalSaving` | 전체 인원 기준 예상 절약액 |
| `currentTotalFare` | 지금 예매 총액 |
| `optimalTotalFare` | 최적 시점 총액 |
| `seasonPremium` | 비수기 대비 시즌 추가 부담 추정액 |
| `timeSaving` | 조조/심야 선택 시 일반 시간대 대비 절약액 |
| `adviceStatus` | 추천 상태값 |
| `adviceMessage` | 결과 해석 문구 |

---

## 5. 페이지 섹션 구조

### 5-1. 히어로

컴포넌트: `CalculatorHero`

카피:

- eyebrow: `여행 항공권 계산`
- title: `항공권 최저가 시기 계산기`
- description: `출발 월, 목적지 권역, 인원수를 넣으면 지금 예매와 기다렸다 예매하는 경우의 예상 항공권 차이를 계산합니다.`

보조 태그:

- `권역별 예매 시점`
- `성수기 계수 반영`
- `인원수 총액 비교`

주의:

- 히어로 또는 계산기 상단에 `추정 시뮬레이션` 배지를 표시한다.
- `실시간 최저가`라는 표현은 사용하지 않는다.

### 5-2. 액션 바

컴포넌트: `ToolActionBar`

버튼:

- 초기화
- 공유 링크 복사

URL 상태:

- `origin`
- `region`
- `month`
- `persons`
- `nights`
- `weeks`
- `day`
- `time`
- `baggage`
- `airline`

### 5-3. 프리셋 버튼

`fct-preset-list` 블록

버튼 4개:

- 일본 주말 여행
- 동남아 휴양 여행
- 유럽 자유여행
- 미주 장거리 여행

프리셋 선택 시 모든 입력값을 덮어쓰고 결과/차트를 즉시 재계산한다.

### 5-4. 입력 폼

권장 클래스 prefix: `fct-`

입력 그룹:

1. 여행 기본 조건
   - 출발지
   - 목적지 권역
   - 세부 목적지 표시명
   - 여행 출발 월
   - 현재 기준 출발까지 남은 주 수

2. 인원·일정
   - 여행 인원
   - 여행 박 수

3. 항공권 선택 성향
   - 출발 요일 선호
   - 편명 시간대
   - 수하물 포함 여부
   - 항공사 성향

입력 UX:

- `persons`는 1~10명
- `nights`는 1~30박
- `weeksBeforeDeparture`는 0~52주
- 성수기 월 선택 시 인라인 배지 표시
- 권역 선택 시 권장 예매 구간 안내 문구 즉시 갱신

### 5-5. 결과 요약 카드

상단 KPI 5개:

| 카드 | 값 | 보조 문구 |
|---|---|---|
| 권장 예매 시점 | `출발 4~8주 전` | 권역별 기준 |
| 지금 예매 예상가 | `1인 289,000원` | 입력 조건 기준 |
| 최적 시점 예상가 | `1인 247,000원` | 시뮬레이션 최저 |
| 예상 절약액 | `2인 총 84,000원` | 현재 대비 |
| 판단 | `2~4주 대기 가능` | 상태 배지 |

상태 배지 색상:

- `book-now`: 초록 계열
- `wait-possible`: 파랑 계열
- `high-risk`: 빨강/주황 계열

### 5-6. 해석 카드

`fct-interpretation-card`

동적 문구 예시:

- `현재는 권장 예매 구간보다 이른 편입니다. 2~4주 후 예상가가 더 낮아질 가능성이 있습니다.`
- `성수기 출발이고 출발까지 남은 기간이 짧습니다. 대기보다 지금 예매가 더 안전한 조건입니다.`
- `조조·심야편을 허용하면 일반 시간대 대비 1인당 약 1만~3만원 절약 가능성이 있습니다.`
- `가족 여행처럼 인원이 많은 경우 같은 가격대 좌석 확보가 어려워질 수 있습니다.`

문구 아래에 작은 고지:

`실제 항공권 가격은 항공사, 좌석 등급, 프로모션, 환율, 유류할증료에 따라 달라질 수 있습니다.`

### 5-7. 시점별 가격 시뮬레이션 차트

`fct-scenario-chart`

구성:

- Chart.js bar 또는 line chart
- x축: 예매 시점
- y축: 예상 1인 항공권
- 보조 텍스트: 인원수 반영 총액
- 최저 시나리오에 `최저 예상` 라벨 표시

차트 아래 표:

| 예매 시점 | 출발 전 주 수 | 1인 예상가 | 전체 총액 |
|---|---:|---:|---:|
| 지금 | 10주 전 | 289,000원 | 578,000원 |
| 2주 후 | 8주 전 | 261,000원 | 522,000원 |
| 4주 후 | 6주 전 | 247,000원 | 494,000원 |
| 8주 후 | 2주 전 | 284,000원 | 568,000원 |
| 출발 직전 | 0주 전 | 338,000원 | 676,000원 |

### 5-8. 권역별 예매 가이드

`fct-region-guide`

카드 6개:

- 일본
- 동남아
- 중국·홍콩·대만
- 유럽
- 미주
- 대양주

각 카드 구성:

- 권역명
- 권장 예매 구간
- 짧은 팁
- 주의 문구

### 5-9. 시즌·요일·시간대 팁

`fct-saving-tips`

3열 카드:

1. 성수기 주의
   - 설·여름휴가·추석·연말은 조기 확정 우선
2. 요일 선택
   - 금·토 출발은 높고 화·수 출발은 낮은 편으로 시뮬레이션
3. 시간대 선택
   - 조조·심야는 절약 가능성이 있으나 이동 편의성 확인 필요

### 5-10. 내부 링크 CTA

하단 CTA 문구:

- `항공권만 아껴도 끝이 아닙니다. 환전, 숙박, 보험까지 같이 계산해보세요.`

연결 후보:

- `/tools/overseas-travel-cost/`
- `/tools/overseas-travel-cost-compare-2026/` 또는 구현된 여행 비용 비교 페이지
- 국내선 vs KTX 비교 계산기가 있으면 연결
- 여행 환전 계산기가 있으면 연결

존재하지 않는 도구는 구현 시점에 실제 slug를 확인하고 연결한다.

### 5-11. 참고/제휴 CTA

위치:

- 결과 카드 하단
- 차트 하단
- 본문 하단

문구:

- `실제 항공권 가격 비교하기`
- `가격 알림 설정하러 가기`
- `해외여행 총비용도 계산하기`

제휴 링크가 없으면 `href` 없이 내부 CTA만 유지한다. 임의 외부 링크를 추가하지 않는다.

### 5-12. FAQ + SEO 본문

FAQ는 `FLIGHT_TIMING_FAQ`를 사용한다.

SEO 본문 핵심 키워드:

- 항공권 최저가 시기
- 항공권 언제 예매
- 항공권 예매 최적 시점
- 일본 항공권 예매 시기
- 동남아 항공권 예매 시기
- 유럽 항공권 몇 달 전 예약

본문 표현 주의:

- `일반적으로`, `추정`, `가능성`, `참고용` 표현 사용
- `반드시`, `무조건`, `최저가 보장` 표현 금지

---

## 6. Astro 마크업 설계

페이지: `src/pages/tools/flight-cheapest-timing-calculator.astro`

권장 구조:

```astro
---
import BaseLayout from "../../components/BaseLayout.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import SimpleToolShell from "../../components/SimpleToolShell.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  FLIGHT_TIMING_PRESETS,
  FLIGHT_BASE_FARES,
  REGION_BOOKING_GUIDES,
  MONTH_SEASON_FACTORS,
  FLIGHT_TIMING_FAQ,
} from "../../data/flightCheapestTimingCalculator";

const pageTitle = "항공권 최저가 시기 계산기 | 지금 예매 vs 기다리기 비용 비교";
const pageDescription = "출발지, 목적지 권역, 출발 월, 인원수를 입력하면 항공권 권장 예매 시점과 지금 예매 대비 예상 절약액을 계산합니다.";
---

<BaseLayout title={pageTitle} description={pageDescription} pageClass="fct-page">
  <CalculatorHero ... />
  <SimpleToolShell resultFirst={false}>
    <Fragment slot="form">
      <!-- 프리셋 + 입력 폼 -->
    </Fragment>
    <Fragment slot="result">
      <!-- 결과 KPI + 해석 카드 + 차트 -->
    </Fragment>
  </SimpleToolShell>
  <InfoNotice ... />
  <SeoContent ... />
  <script
    type="application/json"
    id="fct-data"
    set:html={JSON.stringify({
      presets: FLIGHT_TIMING_PRESETS,
      baseFares: FLIGHT_BASE_FARES,
      regionGuides: REGION_BOOKING_GUIDES,
      seasonFactors: MONTH_SEASON_FACTORS,
    })}
  />
  <script src="/scripts/flight-cheapest-timing-calculator.js" defer></script>
</BaseLayout>
```

---

## 7. DOM 계약

### 7-1. 입력 요소

| DOM id | 역할 |
|---|---|
| `fct-origin` | 출발지 select |
| `fct-region` | 목적지 권역 select |
| `fct-destination-label` | 세부 목적지 input/select |
| `fct-month` | 출발 월 select |
| `fct-weeks-before` | 출발까지 남은 주 수 number |
| `fct-persons` | 인원수 number |
| `fct-nights` | 여행 박 수 number |
| `fct-day` | 출발 요일 select |
| `fct-time` | 편명 시간대 select |
| `fct-baggage` | 수하물 포함 checkbox |
| `fct-airline` | 항공사 성향 select |

### 7-2. 출력 요소

| DOM id | 표시값 |
|---|---|
| `fct-recommended-weeks` | 권장 예매 시점 |
| `fct-current-fare` | 지금 예매 1인 예상가 |
| `fct-optimal-fare` | 최적 시점 1인 예상가 |
| `fct-total-saving` | 총 예상 절약액 |
| `fct-advice-badge` | 추천 상태 배지 |
| `fct-advice-message` | 해석 문구 |
| `fct-season-note` | 시즌 안내 |
| `fct-time-saving` | 시간대 절약 효과 |
| `fct-scenario-table-body` | 시나리오 표 body |
| `fct-chart` | Chart.js canvas |

### 7-3. 버튼/상태

| selector | 역할 |
|---|---|
| `[data-fct-preset]` | 프리셋 적용 |
| `[data-fct-reset]` | 기본값 초기화 |
| `[data-fct-copy-url]` | 공유 링크 복사 |

---

## 8. 클라이언트 JS 설계

파일: `public/scripts/flight-cheapest-timing-calculator.js`

### 8-1. 모듈 구조

```js
(function () {
  const state = {};
  const data = readData();
  const els = bindElements();

  function readData() {}
  function bindElements() {}
  function getInputValues() {}
  function applyPreset(presetId) {}
  function calculate(values) {}
  function estimateFare(values, weeksBeforeDeparture) {}
  function getBookingWindowFactor(region, weeksBeforeDeparture) {}
  function buildScenarios(values) {}
  function getAdvice(result) {}
  function render(result) {}
  function renderScenarioTable(scenarios) {}
  function renderChart(scenarios) {}
  function syncUrl(values) {}
  function restoreFromUrl() {}
  function formatWon(value) {}
  function roundToNearestThousand(value) {}
  function init() {}

  init();
})();
```

### 8-2. Chart.js 처리

- `window.Chart`가 없으면 차트 영역을 숨기고 표만 노출한다.
- 기존 차트 인스턴스가 있으면 `destroy()` 후 재생성한다.
- 모바일에서는 legend를 숨기고 tooltip만 유지한다.

### 8-3. 접근성

- 결과 변경 시 핵심 결과 영역에 `aria-live="polite"` 적용
- 프리셋 버튼은 선택 상태에 `aria-pressed`
- 차트 표는 차트와 동일 데이터를 제공해 스크린리더에서 내용 확인 가능

### 8-4. 오류 방어

- 입력값이 비어 있으면 기본값으로 보정
- 인원수는 1~10으로 clamp
- 남은 주 수는 0~52로 clamp
- 기준 운임이 없으면 인천·일본 기준으로 fallback
- 수하물 추가비는 LCC/최저가 성향일 때만 `baggageIncluded === true`이면 더한다.

---

## 9. SCSS 설계

파일: `src/styles/scss/pages/_flight-cheapest-timing-calculator.scss`

prefix: `fct-`

### 9-1. 주요 블록

```scss
.fct-page {}
.fct-presets {}
.fct-form {}
.fct-form-grid {}
.fct-season-badge {}
.fct-result-summary {}
.fct-kpi-card {}
.fct-advice-card {}
.fct-chart-card {}
.fct-scenario-table {}
.fct-region-guide {}
.fct-saving-tips {}
.fct-related-tools {}
```

### 9-2. 레이아웃

PC:

- `SimpleToolShell` 기본 2열 사용
- 왼쪽 입력, 오른쪽 결과
- 결과 카드 상단 sticky는 사용하지 않는다. 입력이 길어 모바일에서 어색해질 수 있다.

Mobile:

- 입력 → 결과 → 차트 → 가이드 순서
- 프리셋 버튼은 가로 스크롤
- KPI 카드는 2열 또는 1열 자동 전환
- 차트 아래 표는 가로 스크롤 허용

### 9-3. 색상/상태

상태 색상은 기존 토큰을 우선 사용한다.

- 성공/추천: green 계열
- 대기 가능: blue 계열
- 위험/임박: amber 또는 red 계열

주의:

- 보라색 단일톤 페이지로 만들지 않는다.
- 카드 중첩 금지
- 결과 금액은 충분히 크고 스캔 가능하게 표시한다.

---

## 10. 콘텐츠/SEO 설계

### 10-1. 메타

Title:

`항공권 최저가 시기 계산기 | 지금 예매 vs 기다리기 비용 비교`

Description:

`출발지, 목적지 권역, 출발 월, 인원수를 입력하면 항공권 권장 예매 시점과 지금 예매 대비 예상 절약액을 계산합니다. 일본·동남아·유럽·미주 노선별 예매 시점과 성수기 차이를 참고하세요.`

H1:

`항공권 최저가 시기 계산기`

### 10-2. 본문 섹션 제목

- `항공권은 언제 예매해야 유리할까?`
- `권역별 권장 예매 시점`
- `성수기에는 왜 대기 전략이 위험할까?`
- `조조·심야편 선택 시 확인할 점`
- `LCC와 FSC는 총액으로 비교해야 합니다`

### 10-3. 필수 고지 문구

계산기 하단 또는 결과 카드 아래:

`이 계산 결과는 실시간 항공권 조회가 아닌 입력 조건 기반 추정 시뮬레이션입니다. 실제 가격은 항공사, 좌석 등급, 프로모션, 환율, 유류할증료, 결제 시점에 따라 달라질 수 있습니다.`

---

## 11. QA 체크리스트

### 11-1. 계산 QA

- [ ] 일본/동남아/유럽/미주 프리셋 모두 결과가 출력된다.
- [ ] 출발까지 남은 주 수가 0일 때 임박 상승 구간으로 계산된다.
- [ ] 최적 시점 예상가가 현재가보다 낮을 때 절약액이 양수로 표시된다.
- [ ] 현재가가 최적가보다 낮거나 같을 때 `지금 예매 추천` 상태가 표시된다.
- [ ] 인원수 변경 시 총액과 총 절약액이 즉시 바뀐다.
- [ ] 조조/심야 선택 시 일반 시간대 대비 절약 효과가 표시된다.
- [ ] 성수기 월 선택 시 시즌 안내가 바뀐다.

### 11-2. UI QA

- [ ] 모바일 360px에서 입력 라벨과 값이 겹치지 않는다.
- [ ] 프리셋 버튼이 줄바꿈 또는 가로 스크롤로 자연스럽게 처리된다.
- [ ] 결과 카드 금액이 긴 경우에도 카드 밖으로 넘치지 않는다.
- [ ] 차트가 없는 환경에서도 시나리오 표가 노출된다.
- [ ] FAQ와 SEO 본문이 계산기 아래에 배치된다.

### 11-3. 등록 QA

- [ ] `src/data/tools.ts` 등록 완료
- [ ] `src/styles/app.scss` partial import 완료
- [ ] `public/sitemap.xml` URL 추가
- [ ] `npm run build` 성공
- [ ] `/tools/flight-cheapest-timing-calculator/` 직접 접근 확인

---

## 12. 구현 순서

1. `src/data/flightCheapestTimingCalculator.ts` 작성
2. `src/pages/tools/flight-cheapest-timing-calculator.astro` 작성
3. `public/scripts/flight-cheapest-timing-calculator.js` 작성
4. `src/styles/scss/pages/_flight-cheapest-timing-calculator.scss` 작성
5. `src/data/tools.ts`, `src/styles/app.scss`, `public/sitemap.xml` 등록
6. `npm run build`
7. 모바일/데스크톱 수동 QA

---

## 13. 최종 구현 원칙

- 이 페이지는 `항공권 실시간 최저가 조회`가 아니라 `예매 타이밍 판단용 추정 계산기`다.
- 결과는 금액보다 판단 문구가 중요하다. 사용자는 `지금 사야 하는가, 기다려도 되는가`를 알고 싶어 한다.
- 가족/성수기/장거리 조건은 대기 전략 위험을 더 강하게 안내한다.
- 모든 사용자 facing 텍스트는 한국어로 작성한다.
- 추정값은 반드시 `예상`, `추정`, `시뮬레이션`, `참고용` 중 하나의 표현과 함께 노출한다.
