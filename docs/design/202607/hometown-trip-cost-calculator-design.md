# 설계 문서
## 귀성길 교통수단 비교 계산기

> 기획 원본: `docs/plan/202607/chuseok-content-cluster-2026-plan.md` (§4-2)
> 신규 구현 페이지: `/tools/hometown-trip-cost-calculator/`
> 발행 목표: 2026-08월 말 (추석 예매 공지 직전이 검색 피크)

---

## 0. 구현 개요

| 항목 | 값 |
|---|---|
| slug | `hometown-trip-cost-calculator` |
| 페이지 경로 | `src/pages/tools/hometown-trip-cost-calculator.astro` |
| 데이터 파일 | `src/data/hometownTripCostCalculator.ts` |
| 스크립트 | `public/scripts/hometown-trip-cost-calculator.js` |
| SCSS | `src/styles/scss/pages/_hometown-trip-cost-calculator.scss` |
| SCSS/데이터 prefix | `htc-` / `HTC_` |
| 레이아웃 | `SimpleToolShell` (`pageClass="htc-page"`) |
| 홈 tools 카테고리 | `category: "여행·교통"` |
| 주요 CTA | `/tools/travel-expense-split/`, `/tools/holiday-bonus-after-tax-calculator/` |

---

## 1. 제품 방향

### 1-1. 한 줄 정의

`출발지·도착지·인원수를 입력하면 KTX/SRT·고속버스·자가용 중 무엇이 더 저렴하고 빠른지 왕복 기준으로 비교하는 계산기`

### 1-2. 핵심 차별점

- 단일 수단 요금 조회가 아니라 **교통수단 간 비교표**를 1화면에서 제공(비교계산소 정체성)
- 인원수를 반영해 "가족 4명이면 자가용이 더 쌀 수도 있다"는 실제 의사결정 포인트를 계산
- 예매 오픈일을 날짜로 단정하지 않고(§1-3), 비용·시간 비교에 집중

### 1-3. 데이터 신뢰성 — 착수 전 확인 필요 (★ 구현 전 재확인 필수)

기획 단계(2026-07-21)에서 확인한 요금 중 **서울-부산만 확정 수치**이고, 나머지 구간은 구현 착수 시 재확인이 필요하다.

| 구간 | 확인 상태 | 값 |
|---|---|---|
| 서울-부산 KTX | **확정** (2026-04 요금 인하 반영) | 일반실 48,800원, 특실 68,300원 ([info.koreacharts.com](https://info.koreacharts.com/traintime/10012/10020/contents.html?date=2026-07-13)) |
| 서울-부산 고속버스 | 참고치 (변동 가능) | 일반 약 23,000원, 우등 약 34,000원, 프리미엄 약 40,000원 ([bus.koreacharts.com](https://bus.koreacharts.com/express-bus-terminal/NAEK010/NAEK700.html)) |
| 서울-대구 KTX | **미확정 — 검색된 "20,900원부터"는 얼리버드 특가일 가능성, 정상 운임 아닐 수 있음** | 구현 착수 시 코레일 공식 요금표(`www.letskorail.com` 또는 `korail.com`)에서 정상 운임 재확인 후 확정 |
| 서울-광주 KTX | **미확정 — "22,300원부터"도 동일한 이유로 재확인 필요** | 코레일/SR 공식 요금표 재확인 |
| 서울-대전 KTX | 미조사 | 구현 착수 시 조사 |
| 추석 예매 오픈일 | **미발표** (2026-07-18 기준) | 날짜를 하드코딩하지 않고 "통상 명절 3~4주 전, 코레일·SR 공지 확인" 안내 문구만 사용 |

**구현 담당자는 §3-2 요금 테이블을 채우기 전에 반드시 위 표의 "미확정" 항목을 코레일·SR 공식 요금표로 재조사한다.** 이 문서의 예시 수치는 설계 구조를 보여주기 위한 placeholder다.

---

## 2. SEO 설계

### 2-1. 메타

```ts
export const HTC_META = {
  slug: "hometown-trip-cost-calculator",
  title: "귀성길 교통수단 비교 계산기",
  description:
    "출발지, 인원수를 입력하면 KTX·SRT·고속버스·자가용 중 뭐가 더 저렴하고 빠른지 왕복 기준으로 비교합니다.",
  seoTitle: "귀성길 교통수단 비교 계산기 2026 | KTX·고속버스·자가용 얼마 차이날까",
  seoDescription:
    "추석 귀성길, KTX·SRT·고속버스·자가용 중 무엇이 더 저렴하고 빠른지 왕복 기준으로 비교합니다. 인원수를 입력하면 1인당 비용까지 바로 확인할 수 있습니다.",
  updatedAt: "2026-07",
  dataNote:
    "교통 요금은 예매 시점, 좌석 등급, 출발 시간대에 따라 달라질 수 있는 참고용 수치입니다. 정확한 요금과 예매 가능 여부는 코레일·SR·고속버스통합예매(KOBUS) 공식 채널에서 확인하세요.",
};
```

### 2-2. Hero

```astro
<CalculatorHero
  eyebrow="추석 귀성길"
  title={HTC_META.title}
  description="KTX·SRT·고속버스·자가용 중 뭐가 더 저렴하고 빠른지 인원수 기준으로 비교하세요."
  badges={["추석", "귀성길", "KTX vs 버스 vs 자차", "2026"]}
/>
```

### 2-3. 키워드 매핑

| 키워드 | 노출 위치 |
|---|---|
| 귀성길 교통수단 비교 | title, H1 |
| 추석 KTX 고속버스 비교 | Hero, FAQ |
| 귀성 기차표 예매 | 안내 섹션, FAQ |
| 서울 부산 귀성 비용 | 프리셋, 결과 |
| 추석 자가용 유류비 | FAQ |

---

## 3. 데이터 파일 설계

### 3-1. 타입

```ts
export type TransportMode = "ktx" | "bus" | "car";

export interface RoutePreset {
  id: string;
  label: string; // "서울 → 부산"
  distanceKm: number;
  ktxFareOneWay: number | null; // null이면 KTX 노선 없음
  ktxDurationMin: number;
  busGeneralFareOneWay: number;
  busPremiumFareOneWay: number;
  busDurationMin: number;
  tollOneWay: number; // 자가용 통행료(편도, 참고값)
  carDurationMin: number; // 정체 없는 기준
  sourceNote: string;
}

export interface TripInput {
  routeId: string;
  passengerCount: number;
  transportModeForCar: "compact" | "midsize" | "suv";
  fuelPricePerLiter: number; // 참고 전국 평균, 사용자 수정 가능
  fuelEfficiencyKmPerLiter: number; // 차종 기본값 자동 세팅, 수정 가능
}

export interface TripResult {
  ktx: { totalCost: number; perPerson: number; durationMin: number } | null;
  bus: { totalCost: number; perPerson: number; durationMin: number };
  car: { totalCost: number; perPerson: number; durationMin: number };
  cheapest: TransportMode;
  fastest: TransportMode;
}
```

### 3-2. 구간 프리셋 (★ §1-3 재확인 후 확정 수치로 교체)

```ts
export const HTC_ROUTES: RoutePreset[] = [
  {
    id: "seoul-busan",
    label: "서울 → 부산",
    distanceKm: 325,
    ktxFareOneWay: 48_800,
    ktxDurationMin: 160,
    busGeneralFareOneWay: 23_000,
    busPremiumFareOneWay: 40_000,
    busDurationMin: 270,
    tollOneWay: 21_300, // 참고값 — 구현 시 한국도로공사 통행료 조회로 재확인
    carDurationMin: 240,
    sourceNote: "KTX 요금은 2026년 4월 인하 이후 기준(2026-07 확인)",
  },
  {
    id: "seoul-daegu",
    label: "서울 → 대구",
    distanceKm: 244,
    ktxFareOneWay: null, // TODO: 구현 착수 시 코레일 공식 요금표로 확정
    ktxDurationMin: 96,
    busGeneralFareOneWay: 0, // TODO
    busPremiumFareOneWay: 0, // TODO
    busDurationMin: 210,
    tollOneWay: 0, // TODO
    carDurationMin: 195,
    sourceNote: "요금 미확정 — 구현 전 재조사 필요",
  },
  {
    id: "seoul-gwangju",
    label: "서울 → 광주",
    distanceKm: 267,
    ktxFareOneWay: null, // TODO
    ktxDurationMin: 108,
    busGeneralFareOneWay: 0, // TODO
    busPremiumFareOneWay: 34_300,
    busDurationMin: 210,
    tollOneWay: 0, // TODO
    carDurationMin: 210,
    sourceNote: "KTX·통행료 미확정 — 구현 전 재조사 필요",
  },
  {
    id: "seoul-daejeon",
    label: "서울 → 대전",
    distanceKm: 140,
    ktxFareOneWay: null, // TODO
    ktxDurationMin: 50,
    busGeneralFareOneWay: 0, // TODO
    busPremiumFareOneWay: 0, // TODO
    busDurationMin: 120,
    tollOneWay: 0, // TODO
    carDurationMin: 110,
    sourceNote: "요금 미확정 — 구현 전 재조사 필요",
  },
];
```

### 3-3. 자가용 기본 연비/유가

```ts
export const HTC_CAR_DEFAULTS = {
  compact: { fuelEfficiencyKmPerLiter: 14, label: "경차·소형" },
  midsize: { fuelEfficiencyKmPerLiter: 11, label: "중형" },
  suv: { fuelEfficiencyKmPerLiter: 9, label: "SUV·RV" },
};

// 전국 평균 휘발유 가격 참고값 — 구현 시 오피넷(opinet.co.kr) 최신 값으로 재확인
export const HTC_DEFAULT_FUEL_PRICE = 1_650;
```

### 3-4. 계산 함수

```ts
export function calcTripCost(route: RoutePreset, input: TripInput): TripResult {
  const roundTripKtxFare = route.ktxFareOneWay !== null ? route.ktxFareOneWay * 2 * input.passengerCount : null;
  const roundTripBusFare = route.busGeneralFareOneWay * 2 * input.passengerCount;

  const fuelNeeded = (route.distanceKm * 2) / input.fuelEfficiencyKmPerLiter;
  const fuelCost = Math.round(fuelNeeded * input.fuelPricePerLiter);
  const carTotal = fuelCost + route.tollOneWay * 2; // 인원수와 무관(왕복 총액), 4인까지 동일 차량 가정

  const ktx = roundTripKtxFare !== null
    ? { totalCost: roundTripKtxFare, perPerson: Math.round(roundTripKtxFare / input.passengerCount), durationMin: route.ktxDurationMin }
    : null;
  const bus = { totalCost: roundTripBusFare, perPerson: Math.round(roundTripBusFare / input.passengerCount), durationMin: route.busDurationMin };
  const car = { totalCost: carTotal, perPerson: Math.round(carTotal / input.passengerCount), durationMin: route.carDurationMin };

  const candidates = [ktx && { mode: "ktx" as const, ...ktx }, { mode: "bus" as const, ...bus }, { mode: "car" as const, ...car }].filter(Boolean) as Array<{ mode: TransportMode; totalCost: number; durationMin: number }>;
  const cheapest = candidates.reduce((a, b) => (b.totalCost < a.totalCost ? b : a)).mode;
  const fastest = candidates.reduce((a, b) => (b.durationMin < a.durationMin ? b : a)).mode;

  return { ktx, bus, car, cheapest, fastest };
}
```

인원수가 늘어도 자가용 비용은 거의 고정(연료비만 증가하지 않음)되므로, 인원수가 3~4명 이상이면 자가용이 저렴해지는 결과가 자연스럽게 나온다 — 이 지점이 콘텐츠의 핵심 인사이트다.

### 3-5. FAQ

```ts
export const HTC_FAQ = [
  {
    question: "추석 기차표는 언제부터 예매할 수 있나요?",
    answer:
      "2026년 추석(9월 25일) 특별 예매 일정은 아직 공식 발표되지 않았습니다. 과거에는 명절 3~4주 전에 예매가 시작된 경우가 많았지만 매년 다를 수 있으므로, 코레일과 SR 공지사항을 직접 확인하는 것이 정확합니다.",
  },
  {
    question: "가족 여러 명이면 자가용이 항상 더 싼가요?",
    answer:
      "인원수가 늘어도 자가용 연료비와 통행료는 크게 늘지 않는 반면 KTX·고속버스 요금은 인원수만큼 곱해집니다. 그래서 3~4인 이상 가족 단위 이동에서는 자가용이 더 저렴한 경우가 많지만, 정체로 인한 소요시간 증가와 톨게이트 요금 변동은 별도로 고려해야 합니다.",
  },
  {
    question: "명절 기간 고속도로 통행료는 무료 아닌가요?",
    answer:
      "명절 당일 전후로 일부 구간에 통행료 면제가 적용된 사례가 있었지만, 적용 여부와 기간은 매년 국토교통부·한국도로공사 발표에 따라 달라집니다. 확정 발표 전에는 유료로 가정하고 계산하는 것이 안전합니다.",
  },
  {
    question: "요금이 실제와 다른 이유는 무엇인가요?",
    answer:
      "이 계산기의 요금은 참고용 기준값입니다. 실제 요금은 예매 시점, 좌석 등급(특실·우등·프리미엄), 요일과 시간대, 왕복 할인 여부에 따라 달라질 수 있어 최종 예매 전 공식 채널에서 다시 확인해야 합니다.",
  },
];
```

### 3-6. 관련 링크

```ts
export const HTC_RELATED_LINKS = [
  { href: "/tools/travel-expense-split/", label: "여행 경비 분담 계산기" },
  { href: "/tools/holiday-bonus-after-tax-calculator/", label: "명절 상여금 실수령 계산기" },
  { href: "/tools/beolcho-cost-calculator/", label: "벌초 대행비용 계산기" },
];
```

---

## 4. 페이지 마크업 설계

```text
[SimpleToolShell pageClass="htc-page"]
  slot="hero": [CalculatorHero] + [InfoNotice dataNote]
  slot="actions": [ToolActionBar]
  slot="aside":
    .panel 구간 선택 — HTC_ROUTES 라디오/버튼 그룹 (data-htc-route)
    .panel 인원수 입력 (data-htc-input="passengerCount")
    .panel 자가용 옵션 — 차종 select(data-htc-input="carType"), 유가 입력(연동 기본값)
  default slot (main):
    .panel.htc-compare-panel — 비교 카드 3개(KTX/버스/자가용), 각 카드에 총비용·1인당비용·소요시간
      - "가장 저렴" / "가장 빠름" 배지를 해당 카드에 부착
    .panel — 구간 상세 참고 표(거리, 요금 출처)
    .panel — 예매 타임라인 안내 (날짜 단정 없이 "통상 3~4주 전, 공지 확인" 카피 + 코레일/SR 링크)
  slot="seo": [SeoContent]
```

### 4-1. 비교 카드 마크업 예시

```astro
<div class="htc-compare-grid">
  <article class="htc-compare-card" data-htc-mode="ktx" data-htc-badge-target>
    <span class="htc-mode-label">KTX·SRT</span>
    <strong data-htc-result="ktx.totalCost">0원</strong>
    <span data-htc-result="ktx.perPerson">1인당 0원</span>
    <span data-htc-result="ktx.durationMin">0분</span>
  </article>
  <article class="htc-compare-card" data-htc-mode="bus">...</article>
  <article class="htc-compare-card" data-htc-mode="car">...</article>
</div>
```

`cheapest`/`fastest` 값에 해당하는 카드에 JS로 `is-cheapest`/`is-fastest` 클래스를 토글해 배지를 표시한다.

---

## 5. SCSS 설계

```scss
.htc-page {
  .htc-compare-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }

  .htc-compare-card {
    border: 1px solid #dde3f0;
    border-radius: 8px;
    background: #f8faff;
    padding: 18px;
    display: grid;
    gap: 6px;
    position: relative;

    &.is-cheapest::before {
      content: "최저비용";
      position: absolute;
      top: -10px; left: 12px;
      background: #16a34a;
      color: #fff;
      font-size: 11px;
      font-weight: 900;
      padding: 2px 8px;
      border-radius: 999px;
    }

    &.is-fastest {
      border-color: #1a56db;
    }
  }

  @media (max-width: 768px) {
    .htc-compare-grid { grid-template-columns: 1fr; }
  }
}
```

---

## 6. 구현 순서

1. **§1-3 재확인**: 서울-대구·광주·대전 KTX 요금, 통행료, 추석 예매 공지 여부를 코레일·SR·한국도로공사 공식 자료로 재조사 (최우선, 다른 작업보다 선행)
2. `src/data/hometownTripCostCalculator.ts` 작성 — §3-2 TODO 값을 실제 수치로 교체
3. `src/pages/tools/hometown-trip-cost-calculator.astro` 작성 (§4)
4. `public/scripts/hometown-trip-cost-calculator.js` 작성 (§3-4 로직 그대로 구현)
5. `src/styles/scss/pages/_hometown-trip-cost-calculator.scss` 작성, `app.scss` 등록
6. `src/data/tools.ts` 등록
7. `public/sitemap.xml` 등록
8. `npm run build` 확인

---

## 7. QA 체크리스트

- [ ] §1-3의 모든 TODO 요금이 실제 수치로 채워졌는가? (placeholder 0원 노출 금지)
- [ ] 인원수를 4명으로 바꾸면 자가용이 더 저렴해지는 케이스가 실제로 나오는가?
- [ ] "최저비용"·"최단시간" 배지가 정확한 카드에 붙는가?
- [ ] 예매 오픈일을 특정 날짜로 단정하지 않았는가? (§1-3 원칙 재확인)
- [ ] 모바일에서 비교 카드 3개가 1열로 정상 전환되는가?
- [ ] `npm run build` 성공 확인
