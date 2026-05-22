# 배달 vs 직접 요리 비용 계산기 — 설계 문서

> 기획 원문: `docs/plan/202605/delivery-vs-cooking-cost.md`  
> 작성일: 2026-05-20  
> 콘텐츠 유형: `/tools/` 계산기  
> 구현 기준: 배달 주문 비용과 직접 요리 비용을 비교해 월간·연간 절약액, 손익분기 주문금액, 판단 라벨을 산출

---

## 1. 문서 개요

- 구현 대상: `배달 vs 직접 요리 비용 계산기`
- slug: `delivery-vs-cooking-cost`
- URL: `/tools/delivery-vs-cooking-cost/`
- 카테고리: 생활비절약
- 핵심 검색 의도: "배달음식 vs 직접요리 비용 비교", "배달비 절약 계산기", "자취생 식비 계산", "집밥 배달 비교"
- 핵심 출력: 월 배달 총지출, 월 직접요리 총비용, 월 절약 가능 금액, 연간 절약 예상액, 손익분기 주문금액
- 안전 원칙: 직접 요리가 무조건 저렴하다고 단정하지 않는다. 식재료비, 시간 비용, 할인 쿠폰은 모두 사용자가 입력한 가정값임을 표시한다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    deliveryVsCookingCost.ts       ← 타입, 기본값, 프리셋, FAQ, 관련 링크
  pages/
    tools/
      delivery-vs-cooking-cost.astro

public/
  scripts/
    delivery-vs-cooking-cost.js

src/styles/scss/pages/
  _delivery-vs-cooking-cost.scss
```

추가 등록 필수:

- `src/data/tools.ts`
- `src/styles/app.scss` — `@use 'scss/pages/delivery-vs-cooking-cost';`
- `public/sitemap.xml`

선택 등록:

- `src/pages/index.astro` 생활비절약 추천 도구에 추가
- `public/og/tools/delivery-vs-cooking-cost.png` 또는 OG 생성 스크립트 대상 추가

---

## 3. 레이아웃 방향

- `SimpleToolShell` 기반.
- 입력은 4단계로 분리한다.
  - Step 1: 가구·식사 조건
  - Step 2: 배달 비용
  - Step 3: 직접 요리 비용
  - Step 4: 시간 비용 옵션
- 결과는 `연간 절약액 → 월 절약액 → 월 지출 비교 → 손익분기 주문금액` 순서로 읽히게 한다.
- SCSS prefix: `dvcc-`
- pageClass: `dvcc-page`
- 모바일에서는 입력 직후 결과 KPI가 바로 보이도록 구성한다.

권장 설정:

```astro
<SimpleToolShell
  calculatorId="delivery-vs-cooking-cost"
  pageClass="dvcc-page"
  resultFirst={false}
>
```

---

## 4. 페이지 IA

1. Hero
2. 생활비 계산 고지 `InfoNotice`
3. 프리셋 시나리오 버튼
4. 계산기 입력 영역
5. 결과 KPI 카드
6. 결과 해석 카드
7. 배달 vs 직접요리 비용 분해표
8. 비용 구성 차트
9. 손익분기 주문금액 해석
10. 생애주기별 시나리오
11. 절약 팁 체크리스트
12. 관련 계산기/리포트 CTA
13. `SeoContent` FAQ

---

## 5. 데이터 모델

파일: `src/data/deliveryVsCookingCost.ts`

```ts
export type HouseholdSize = 1 | 2 | 3 | 4;
export type DecisionLabel = "직접요리 유리" | "조건부 유리" | "배달도 합리적";
export type DecisionTone = "positive" | "neutral" | "caution";

export interface DeliveryVsCookingInput {
  householdSize: HouseholdSize;
  weeklyDeliveryOrders: number;
  mealsPerOrder: number;
  weeksPerMonth: number;
  monthlyBudget: number;

  deliveryFoodCost: number;
  deliveryFee: number;
  riderTip: number;
  serviceFee: number;
  couponDiscount: number;

  cookingIngredientCost: number;
  energyCost: number;
  consumableCost: number;
  ingredientWasteRate: number;
  groceryDeliveryFeePerMeal: number;

  includeTimeCost: boolean;
  hourlyWage: number;
  groceryMinutes: number;
  cookingMinutes: number;
  cleanupMinutes: number;
  includeDeliveryWaitTime: boolean;
  deliveryWaitMinutes: number;
}

export interface DeliveryVsCookingResult {
  monthlyOrderCount: number;
  deliveryCostPerMeal: number;
  deliveryTimeCostPerMeal: number;
  deliveryComparableCostPerMeal: number;
  cookingCashCostPerMeal: number;
  cookingTimeCostPerMeal: number;
  cookingComparableCostPerMeal: number;
  monthlyDeliveryCost: number;
  monthlyCookingCost: number;
  monthlySaving: number;
  annualSaving: number;
  breakEvenFoodCost: number;
  deliveryExtraCostRatio: number;
  decisionLabel: DecisionLabel;
  decisionTone: DecisionTone;
  decisionMessage: string;
  warnings: string[];
}

export interface DeliveryVsCookingPreset {
  id: string;
  label: string;
  description: string;
  input: Partial<DeliveryVsCookingInput>;
}

export interface DeliveryVsCookingScenario {
  title: string;
  target: string;
  summary: string;
  monthlySavingHint: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description?: string;
}
```

---

## 6. 핵심 데이터 상수

### 6-1. 메타

```ts
export const DVCC_META = {
  title: "배달 vs 직접 요리 비용 계산기",
  subtitle:
    "배달 음식값, 배달비, 식재료비, 조리 시간까지 반영해 월간·연간 절약액을 계산합니다.",
  updatedAt: "2026년 5월 기준",
  caution:
    "결과는 사용자가 입력한 비용과 시간 가정을 바탕으로 한 생활비 시뮬레이션입니다.",
};
```

### 6-2. 기본 입력값

```ts
export const DVCC_DEFAULT_INPUT: DeliveryVsCookingInput = {
  householdSize: 1,
  weeklyDeliveryOrders: 3,
  mealsPerOrder: 1,
  weeksPerMonth: 4.345,
  monthlyBudget: 300000,

  deliveryFoodCost: 18000,
  deliveryFee: 3000,
  riderTip: 0,
  serviceFee: 0,
  couponDiscount: 2000,

  cookingIngredientCost: 9000,
  energyCost: 500,
  consumableCost: 500,
  ingredientWasteRate: 0.1,
  groceryDeliveryFeePerMeal: 0,

  includeTimeCost: false,
  hourlyWage: 15000,
  groceryMinutes: 10,
  cookingMinutes: 25,
  cleanupMinutes: 10,
  includeDeliveryWaitTime: false,
  deliveryWaitMinutes: 35,
};
```

### 6-3. 프리셋

```ts
export const DVCC_PRESETS: DeliveryVsCookingPreset[] = [
  {
    id: "solo-heavy-delivery",
    label: "자취생 혼밥",
    description: "1인 가구가 주 4회 배달을 시켜 먹는 경우입니다.",
    input: {
      householdSize: 1,
      weeklyDeliveryOrders: 4,
      deliveryFoodCost: 18000,
      deliveryFee: 3000,
      couponDiscount: 1500,
      cookingIngredientCost: 9000,
      ingredientWasteRate: 0.12,
    },
  },
  {
    id: "dual-income-couple",
    label: "맞벌이 부부",
    description: "2인 가구가 시간 비용까지 반영해 비교합니다.",
    input: {
      householdSize: 2,
      weeklyDeliveryOrders: 3,
      deliveryFoodCost: 28000,
      deliveryFee: 3500,
      cookingIngredientCost: 15000,
      includeTimeCost: true,
      hourlyWage: 20000,
      cookingMinutes: 30,
      cleanupMinutes: 10,
    },
  },
  {
    id: "family-three",
    label: "3인 가족",
    description: "가족 단위 배달 주문과 직접요리 비용을 비교합니다.",
    input: {
      householdSize: 3,
      weeklyDeliveryOrders: 2,
      deliveryFoodCost: 38000,
      deliveryFee: 4000,
      cookingIngredientCost: 18000,
      ingredientWasteRate: 0.07,
    },
  },
  {
    id: "family-four",
    label: "4인 가족",
    description: "4인 가족의 배달 음식값과 장보기 비용을 비교합니다.",
    input: {
      householdSize: 4,
      weeklyDeliveryOrders: 2,
      deliveryFoodCost: 45000,
      deliveryFee: 4000,
      cookingIngredientCost: 24000,
      ingredientWasteRate: 0.05,
    },
  },
  {
    id: "meal-kit",
    label: "밀키트 대체",
    description: "식재료비는 높지만 조리 시간이 짧은 밀키트형 시나리오입니다.",
    input: {
      householdSize: 2,
      weeklyDeliveryOrders: 3,
      deliveryFoodCost: 28000,
      deliveryFee: 3000,
      cookingIngredientCost: 19000,
      ingredientWasteRate: 0.03,
      includeTimeCost: true,
      cookingMinutes: 15,
      cleanupMinutes: 5,
    },
  },
];
```

---

## 7. 계산 로직

### 7-1. 보조 함수

```ts
function clampNumber(value: number, min = 0, max = Number.MAX_SAFE_INTEGER) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}
```

### 7-2. 배달 비용

```ts
function calculateDeliveryCost(input: DeliveryVsCookingInput) {
  const cashCost = Math.max(
    input.deliveryFoodCost +
      input.deliveryFee +
      input.riderTip +
      input.serviceFee -
      input.couponDiscount,
    0
  );

  const waitTimeCost = input.includeDeliveryWaitTime
    ? (input.deliveryWaitMinutes / 60) * input.hourlyWage
    : 0;

  return {
    cashCost,
    waitTimeCost,
    comparableCost: cashCost + waitTimeCost,
  };
}
```

### 7-3. 직접 요리 비용

```ts
function calculateCookingCost(input: DeliveryVsCookingInput) {
  const wasteCost = input.cookingIngredientCost * input.ingredientWasteRate;
  const cashCost =
    input.cookingIngredientCost +
    input.energyCost +
    input.consumableCost +
    wasteCost +
    input.groceryDeliveryFeePerMeal;

  const timeMinutes =
    input.groceryMinutes + input.cookingMinutes + input.cleanupMinutes;

  const timeCost = input.includeTimeCost
    ? (timeMinutes / 60) * input.hourlyWage
    : 0;

  return {
    cashCost,
    wasteCost,
    timeCost,
    comparableCost: cashCost + timeCost,
  };
}
```

### 7-4. 전체 계산

```ts
function calculateDeliveryVsCooking(
  input: DeliveryVsCookingInput
): DeliveryVsCookingResult {
  const monthlyOrderCount =
    input.weeklyDeliveryOrders * input.weeksPerMonth * input.mealsPerOrder;
  const delivery = calculateDeliveryCost(input);
  const cooking = calculateCookingCost(input);

  const monthlyDeliveryCost = monthlyOrderCount * delivery.comparableCost;
  const monthlyCookingCost = monthlyOrderCount * cooking.comparableCost;
  const monthlySaving = monthlyDeliveryCost - monthlyCookingCost;
  const annualSaving = monthlySaving * 12;

  const breakEvenFoodCost =
    cooking.comparableCost -
    input.deliveryFee -
    input.riderTip -
    input.serviceFee +
    input.couponDiscount -
    delivery.waitTimeCost;

  const deliveryExtraCost =
    input.deliveryFee + input.riderTip + input.serviceFee;
  const deliveryExtraCostRatio =
    delivery.cashCost > 0 ? deliveryExtraCost / delivery.cashCost : 0;

  const decision = getDecision(monthlySaving, input.includeTimeCost);

  return {
    monthlyOrderCount,
    deliveryCostPerMeal: delivery.cashCost,
    deliveryTimeCostPerMeal: delivery.waitTimeCost,
    deliveryComparableCostPerMeal: delivery.comparableCost,
    cookingCashCostPerMeal: cooking.cashCost,
    cookingTimeCostPerMeal: cooking.timeCost,
    cookingComparableCostPerMeal: cooking.comparableCost,
    monthlyDeliveryCost,
    monthlyCookingCost,
    monthlySaving,
    annualSaving,
    breakEvenFoodCost,
    deliveryExtraCostRatio,
    decisionLabel: decision.label,
    decisionTone: decision.tone,
    decisionMessage: decision.message,
    warnings: getWarnings(input, monthlySaving, breakEvenFoodCost),
  };
}
```

### 7-5. 판단 라벨

```ts
function getDecision(
  monthlySaving: number,
  includeTimeCost: boolean
): { label: DecisionLabel; tone: DecisionTone; message: string } {
  if (monthlySaving >= 100000) {
    return {
      label: "직접요리 유리",
      tone: "positive",
      message: "현재 조건에서는 직접요리로 바꿀 때 월 절약액이 크게 발생합니다.",
    };
  }

  if (monthlySaving > 0) {
    return {
      label: "조건부 유리",
      tone: "neutral",
      message: includeTimeCost
        ? "시간 비용을 포함해도 직접요리가 조금 더 유리합니다."
        : "현금 지출 기준으로는 직접요리가 유리하지만 시간 비용을 함께 확인해보세요.",
    };
  }

  return {
    label: "배달도 합리적",
    tone: "caution",
    message: "현재 입력값에서는 시간이나 재료비를 고려하면 배달이 더 합리적일 수 있습니다.",
  };
}
```

### 7-6. 경고 문구

```ts
function getWarnings(
  input: DeliveryVsCookingInput,
  monthlySaving: number,
  breakEvenFoodCost: number
) {
  const warnings: string[] = [];

  if (!input.includeTimeCost) {
    warnings.push("현재 결과는 시간 비용을 제외한 현금 지출 중심 계산입니다.");
  }

  if (input.ingredientWasteRate >= 0.2) {
    warnings.push("식재료 낭비율이 높으면 1인 가구 직접요리 절약액이 크게 줄어들 수 있습니다.");
  }

  if (breakEvenFoodCost <= 0) {
    warnings.push("배달 부대비용만으로도 직접요리 비용을 넘는 구간입니다.");
  }

  if (monthlySaving < 0 && input.includeTimeCost) {
    warnings.push("시간 비용을 크게 잡으면 배달이 더 합리적으로 나올 수 있습니다.");
  }

  return warnings;
}
```

---

## 8. 클라이언트 스크립트 구조

파일: `public/scripts/delivery-vs-cooking-cost.js`

```js
(function () {
  const root = document.querySelector('[data-calculator="delivery-vs-cooking-cost"]');
  if (!root) return;

  const state = {
    householdSize: 1,
    weeklyDeliveryOrders: 3,
    mealsPerOrder: 1,
    weeksPerMonth: 4.345,
    monthlyBudget: 300000,
    deliveryFoodCost: 18000,
    deliveryFee: 3000,
    riderTip: 0,
    serviceFee: 0,
    couponDiscount: 2000,
    cookingIngredientCost: 9000,
    energyCost: 500,
    consumableCost: 500,
    ingredientWasteRate: 0.1,
    groceryDeliveryFeePerMeal: 0,
    includeTimeCost: false,
    hourlyWage: 15000,
    groceryMinutes: 10,
    cookingMinutes: 25,
    cleanupMinutes: 10,
    includeDeliveryWaitTime: false,
    deliveryWaitMinutes: 35,
  };

  function readForm() {}
  function calculate(input) {}
  function render(result) {}
  function renderBreakdown(result) {}
  function renderWarnings(warnings) {}
  function renderChart(result) {}
  function applyPreset(id) {}
  function syncUrlParams() {}
  function restoreFromUrl() {}
  function copyShareLink() {}

  restoreFromUrl();
  render(calculate(state));
})();
```

필수 인터랙션:

- 입력 변경 시 즉시 계산
- 프리셋 클릭 시 입력값과 결과 동시 갱신
- 시간 비용 토글 시 시간 입력 필드 표시/숨김
- 배달 대기 시간 토글 시 대기 시간 입력 필드 표시/숨김
- URL 파라미터 저장/복원
- 공유 링크 복사
- 비용 분해 차트 갱신
- 초기화 버튼 동작

---

## 9. Astro 마크업 설계

### 9-1. Frontmatter

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import SimpleToolShell from "../../components/SimpleToolShell.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import ToolActionBar from "../../components/ToolActionBar.astro";
import {
  DVCC_META,
  DVCC_DEFAULT_INPUT,
  DVCC_PRESETS,
  DVCC_SCENARIOS,
  DVCC_FAQ,
  DVCC_RELATED_LINKS,
} from "../../data/deliveryVsCookingCost";
---
```

### 9-2. 주요 DOM ID

입력:

| DOM | 용도 |
| --- | --- |
| `#dvcc-household-size` | 가구 인원 |
| `#dvcc-weekly-orders` | 주당 배달 횟수 |
| `#dvcc-meals-per-order` | 1회 주문 식사 수 |
| `#dvcc-weeks-per-month` | 월 계산 주수 |
| `#dvcc-monthly-budget` | 월 외식·배달 예산 |
| `#dvcc-delivery-food-cost` | 배달 음식값 |
| `#dvcc-delivery-fee` | 배달비 |
| `#dvcc-rider-tip` | 팁·포장비 |
| `#dvcc-service-fee` | 서비스 수수료 |
| `#dvcc-coupon-discount` | 쿠폰 할인 |
| `#dvcc-cooking-ingredient-cost` | 식재료비 |
| `#dvcc-energy-cost` | 조리 에너지 비용 |
| `#dvcc-consumable-cost` | 소모품 비용 |
| `#dvcc-waste-rate` | 식재료 낭비율 |
| `#dvcc-grocery-delivery-fee` | 장보기 배송비 |
| `#dvcc-include-time-cost` | 시간 비용 반영 토글 |
| `#dvcc-hourly-wage` | 본인 시급 |
| `#dvcc-grocery-minutes` | 장보기 시간 |
| `#dvcc-cooking-minutes` | 조리 시간 |
| `#dvcc-cleanup-minutes` | 정리 시간 |
| `#dvcc-include-wait-time` | 배달 대기 시간 반영 토글 |
| `#dvcc-delivery-wait-minutes` | 배달 대기 시간 |

결과:

| DOM | 용도 |
| --- | --- |
| `#dvcc-r-annual-saving` | 연간 절약 예상액 |
| `#dvcc-r-monthly-saving` | 월 절약 가능 금액 |
| `#dvcc-r-delivery-monthly` | 월 배달 총지출 |
| `#dvcc-r-cooking-monthly` | 월 직접요리 총비용 |
| `#dvcc-r-break-even` | 손익분기 주문금액 |
| `#dvcc-r-decision` | 판단 라벨 |
| `#dvcc-r-comment` | 결과 해석 문구 |
| `#dvcc-breakdown-body` | 비용 분해표 |
| `#dvcc-warning-list` | 경고 문구 |
| `#dvcc-cost-chart` | 비용 분해 차트 |

---

## 10. 결과 UI 설계

### 10-1. KPI 카드

| 카드 | 데이터 | 표시 |
| --- | --- | --- |
| 연간 절약 예상액 | `annualSaving` | 메인 카드 |
| 월 절약 가능 금액 | `monthlySaving` | 서브 카드 |
| 월 배달 총지출 | `monthlyDeliveryCost` | 서브 카드 |
| 월 직접요리 총비용 | `monthlyCookingCost` | 서브 카드 |
| 손익분기 주문금액 | `breakEvenFoodCost` | 강조 카드 |

`monthlySaving`이 음수이면 "월 추가 비용"으로 표시하고, 절대값과 함께 배달도 합리적일 수 있다는 메시지를 보여준다.

### 10-2. 판단 배지

| label | tone | UI |
| --- | --- | --- |
| 직접요리 유리 | positive | 초록 |
| 조건부 유리 | neutral | 기본 |
| 배달도 합리적 | caution | 노랑 |

### 10-3. 비용 분해표

| 항목 | 배달 | 직접요리 | 차이 |
| --- | ---: | ---: | ---: |
| 음식값/재료비 | `deliveryFoodCost` | `cookingIngredientCost` | 계산값 |
| 배달비·팁·수수료 | 합산 | - | 계산값 |
| 할인 | `couponDiscount` | - | 계산값 |
| 에너지·소모품 | - | 합산 | 계산값 |
| 식재료 낭비비용 | - | 계산값 | 계산값 |
| 시간 비용 | 옵션 | 옵션 | 계산값 |
| 월 총비용 | `monthlyDeliveryCost` | `monthlyCookingCost` | `monthlySaving` |

### 10-4. 차트

Chart.js 막대 차트 권장:

- X축: 배달, 직접요리
- Stack: 음식값/재료비, 부대비용, 시간비용, 할인/낭비
- 모바일에서 높이 260px 고정
- Chart.js 미로드 시 표만으로도 결과를 이해 가능해야 함

---

## 11. 입력 UX 설계

### Step 1. 가구·식사 조건

| 필드 | UI | 비고 |
| --- | --- | --- |
| 가구 인원 | segmented/select | 1~4인 |
| 주당 배달 횟수 | slider + number | 0~14회 |
| 1회 주문 식사 수 | number | 보통 1끼 |
| 월 계산 주수 | number | 기본 4.345, 고급 설정 |
| 월 예산 | money input | 초과 여부 해석용 |

### Step 2. 배달 비용

| 필드 | UI | 비고 |
| --- | --- | --- |
| 음식값 | money input | 1회 주문 기준 |
| 배달비 | money input | 거리 할증 포함 |
| 팁·포장비 | money input | 선택 |
| 서비스 수수료 | money input | 선택 |
| 쿠폰 할인 | money input | 평균 할인액 |

### Step 3. 직접요리 비용

| 필드 | UI | 비고 |
| --- | --- | --- |
| 식재료비 | money input | 1끼 전체 기준 |
| 에너지 비용 | money input | 가스·전기 |
| 소모품 비용 | money input | 양념·세제 등 |
| 식재료 낭비율 | percent slider | 0~40% |
| 장보기 배송비 | money input | 끼니별 환산 |

### Step 4. 시간 비용

| 필드 | UI | 비고 |
| --- | --- | --- |
| 시간 비용 반영 | toggle | 기본 꺼짐 |
| 본인 시급 | money input | 토글 켜짐 시 활성 |
| 장보기 시간 | number | 분 단위 |
| 조리 시간 | number | 분 단위 |
| 정리 시간 | number | 분 단위 |
| 배달 대기 시간 반영 | toggle | 선택 |
| 배달 대기 시간 | number | 분 단위 |

---

## 12. URL 파라미터

공유 가능한 링크를 위해 핵심 값만 저장한다.

| 파라미터 | 필드 |
| --- | --- |
| `hh` | householdSize |
| `wo` | weeklyDeliveryOrders |
| `food` | deliveryFoodCost |
| `fee` | deliveryFee |
| `tip` | riderTip |
| `coupon` | couponDiscount |
| `ing` | cookingIngredientCost |
| `waste` | ingredientWasteRate |
| `time` | includeTimeCost |
| `wage` | hourlyWage |
| `cookMin` | cookingMinutes |

예시:

```text
/tools/delivery-vs-cooking-cost/?hh=1&wo=4&food=18000&fee=3000&ing=9000
```

---

## 13. SEO 콘텐츠 설계

```astro
<SeoContent
  introTitle="배달 vs 직접 요리 비용 계산기 활용법"
  intro={[
    "배달음식과 직접요리의 비용 차이는 음식값만으로 결정되지 않습니다. 배달비, 팁, 쿠폰, 식재료 낭비율, 조리 시간까지 함께 봐야 실제 생활비 차이를 알 수 있습니다.",
    "이 계산기는 주당 배달 횟수와 1회 비용을 입력해 월간·연간 절약 가능 금액과 손익분기 주문금액을 계산합니다.",
  ]}
  inputPoints={[
    "주당 배달 횟수와 1회 평균 주문금액을 입력합니다.",
    "배달비, 팁, 서비스 수수료, 쿠폰 할인액을 따로 입력합니다.",
    "직접요리 식재료비와 식재료 낭비율, 시간 비용 반영 여부를 선택합니다.",
  ]}
  criteria={[
    "결과는 입력값을 바탕으로 한 생활비 시뮬레이션입니다.",
    "식재료 가격, 배달 할인, 조리 시간, 실제 식사량에 따라 결과는 달라질 수 있습니다.",
    "시간 비용은 선택값이며, 현금 지출 절약액과 구분해서 해석해야 합니다.",
  ]}
  faq={DVCC_FAQ}
  related={DVCC_RELATED_LINKS}
/>
```

---

## 14. FAQ

```ts
export const DVCC_FAQ: FaqItem[] = [
  {
    q: "직접 요리가 항상 배달보다 저렴한가요?",
    a: "아닙니다. 1인 가구에서 식재료 낭비율이 높거나 시간 비용을 크게 잡으면 직접요리의 절약액이 줄어들 수 있습니다. 그래서 현금 지출 기준과 시간 포함 기준을 나눠 보는 것이 좋습니다.",
  },
  {
    q: "시간 비용은 꼭 넣어야 하나요?",
    a: "필수는 아닙니다. 생활비 절약 관점에서는 현금 지출 기준이 직관적이고, 맞벌이·야근이 많은 직장인은 시간 비용까지 포함해 보는 것이 더 현실적입니다.",
  },
  {
    q: "배달 쿠폰은 어떻게 반영하나요?",
    a: "1회 평균 할인액으로 입력합니다. 특정 날짜의 큰 할인보다 한 달 동안 실제로 자주 받는 평균 할인액을 넣어야 결과가 현실적입니다.",
  },
  {
    q: "밀키트는 직접요리 비용에 넣나요?",
    a: "MVP에서는 직접요리 프리셋 중 하나로 처리합니다. 밀키트는 식재료비는 높지만 조리 시간이 짧기 때문에 시간 비용 포함 결과에서 유리해질 수 있습니다.",
  },
  {
    q: "손익분기 주문금액은 무슨 뜻인가요?",
    a: "직접요리 비용과 배달 비용이 같아지는 1회 음식값입니다. 이 금액보다 비싸게 주문하면 직접요리가 비용상 유리하고, 이 금액보다 낮으면 배달도 합리적일 수 있습니다.",
  },
  {
    q: "가족 수가 많으면 직접요리가 더 유리한가요?",
    a: "대체로 유리해지는 경향이 있습니다. 배달은 인원수만큼 음식값이 늘지만 직접요리는 식재료를 묶음으로 쓰면서 1인당 비용이 낮아지는 경우가 많습니다.",
  },
];
```

---

## 15. 관련 링크

```ts
export const DVCC_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/reports/single-household-living-cost-2026/",
    label: "2026 1인 가구 생활비 완전 해부",
    description: "혼자 사는 데 드는 월 생활비를 항목별로 확인합니다.",
  },
  {
    href: "/tools/household-income/",
    label: "가구소득 계산기",
    description: "월 소득 대비 생활비 비중을 함께 확인합니다.",
  },
  {
    href: "/tools/salary/",
    label: "연봉 실수령 계산기",
    description: "본인 시급과 실수령 기준 예산을 계산합니다.",
  },
  {
    href: "/tools/travel-savings-goal-calculator/",
    label: "여행 저축 목표 계산기",
    description: "절약액을 여행 목표 자금으로 바꿔 봅니다.",
  },
  {
    href: "/tools/ai-work-roi-calculator/",
    label: "AI 업무 ROI 계산기",
    description: "시간 비용과 기회비용 관점을 비교합니다.",
  },
];
```

> 구현 전 실제 존재하지 않는 URL은 현재 라우팅에 맞춰 조정한다.

---

## 16. SCSS 설계

파일: `src/styles/scss/pages/_delivery-vs-cooking-cost.scss`

주요 클래스:

```scss
.dvcc-page {}
.dvcc-preset-grid {}
.dvcc-input-section {}
.dvcc-field-grid {}
.dvcc-slider-row {}
.dvcc-result-grid {}
.dvcc-decision-badge {}
.dvcc-result-comment {}
.dvcc-breakdown-table {}
.dvcc-chart-wrap {}
.dvcc-warning-list {}
.dvcc-scenario-grid {}
.dvcc-checklist {}
.dvcc-cta-band {}
```

스타일 원칙:

- 생활비 절약 도구이므로 차분한 초록/차콜/오프화이트 톤.
- 카드 radius는 8px 이하.
- 카드 안에 카드 중첩 금지.
- 결과 숫자는 크고 명확하게, 단위는 작게.
- 표는 모바일 가로 스크롤.
- 프리셋 버튼은 2~3열 그리드, 모바일 1열.
- 시간 비용 영역은 토글 켜짐 시 부드럽게 노출되지만 레이아웃 밀림이 크지 않게 한다.

---

## 17. 접근성 및 UX 체크

- 모든 입력에 `label` 연결.
- 금액 입력은 `inputmode="numeric"`.
- 비율 입력은 `%` 단위 보조 텍스트 표시.
- 결과 KPI 영역은 `aria-live="polite"`.
- 판단 라벨은 색상과 텍스트를 함께 사용.
- 프리셋 버튼은 `aria-pressed` 적용.
- 시간 비용 토글 상태는 `aria-expanded` 또는 `hidden`을 명확히 관리.
- 차트가 없어도 비용 분해표로 정보가 전달되어야 한다.
- 모바일 360px에서 긴 금액이 카드 밖으로 넘치지 않아야 한다.

---

## 18. 고정 안내 문구

### InfoNotice

```text
이 계산기는 입력한 배달비, 식재료비, 조리 시간 가정을 바탕으로 한 생활비 시뮬레이션입니다.
실제 식비는 지역, 할인 쿠폰, 식재료 가격, 식사량, 조리 방식에 따라 달라질 수 있습니다.
```

### 시간 비용 안내

```text
시간 비용은 실제 지출이 아니라 내 시간을 금액으로 환산한 기회비용입니다.
현금 지출 절약액과 구분해서 해석하세요.
```

### 식재료 낭비 안내

```text
1인 가구는 남는 식재료가 많으면 직접요리의 절약 효과가 줄어들 수 있습니다.
식재료 낭비율을 현실적으로 입력하세요.
```

### 제휴 링크 안내

```text
일부 장보기·생활비 관리 링크에는 제휴 링크가 포함될 수 있습니다.
특정 서비스가 항상 더 저렴하다는 의미는 아닙니다.
```

---

## 19. 검증 시나리오

| 케이스 | 입력 | 기대 결과 |
| --- | --- | --- |
| 기본 1인 가구 | 주 3회, 배달 19,000원, 요리 10,900원 | 월 절약액 양수 |
| 배달비 과다 | 배달비 6,000원, 쿠폰 0원 | 배달 부대비용 경고 |
| 시간 비용 포함 | 시급 25,000원, 조리 60분 | 직접요리 절약액 감소 또는 배달도 합리적 |
| 재료 낭비율 높음 | 낭비율 30% | 낭비율 경고 |
| 배달 쿠폰 큼 | 쿠폰 8,000원 | 월 절약액 감소 |
| 주당 배달 0회 | 0회 | 월 지출·절약액 0, NaN 없음 |
| 가족 4인 | 배달 45,000원, 요리 24,000원 | 직접요리 유리 가능성 큼 |
| 손익분기 0 이하 | 요리비 낮고 배달비 높음 | 부대비용만으로 비싸다는 메시지 |

---

## 20. 구현 체크리스트

### 데이터

- [ ] `DVCC_META` 작성
- [ ] `DVCC_DEFAULT_INPUT` 작성
- [ ] `DVCC_PRESETS` 작성
- [ ] `DVCC_SCENARIOS` 작성
- [ ] `DVCC_FAQ` 작성
- [ ] `DVCC_RELATED_LINKS` 작성

### 페이지

- [ ] Hero/InfoNotice 구성
- [ ] SimpleToolShell 기반 입력/결과 영역 구성
- [ ] 4단계 입력 섹션 구성
- [ ] KPI 카드 5개 구성
- [ ] 판단 라벨과 결과 해석 카드 구성
- [ ] 비용 분해표 구성
- [ ] 비용 차트 구성
- [ ] 생애주기별 시나리오 구성
- [ ] SeoContent 연결

### 스크립트

- [ ] 배달 1회 비용 계산
- [ ] 직접요리 1회 비용 계산
- [ ] 시간 비용 계산
- [ ] 월간·연간 절약액 계산
- [ ] 손익분기 주문금액 계산
- [ ] 판단 라벨 계산
- [ ] 경고 문구 계산
- [ ] 프리셋 적용
- [ ] URL 상태 저장/복원
- [ ] Chart.js 차트 갱신
- [ ] 공유 링크 복사

### 등록

- [ ] `src/data/tools.ts` 등록
- [ ] `src/styles/app.scss` import 추가
- [ ] `public/sitemap.xml` URL 추가
- [ ] `npm run build` 성공 확인

---

## 21. v1/v2 경계

### v1에 포함

- 1~4인 가구 선택
- 주당 배달 횟수 입력
- 배달 음식값·배달비·팁·쿠폰 입력
- 직접요리 식재료비·에너지·소모품·낭비율 입력
- 시간 비용 포함/제외 토글
- 월·연간 절약액 계산
- 손익분기 주문금액 계산
- 프리셋 시나리오
- 비용 분해표와 차트
- FAQ와 관련 링크

### v2로 미룸

- 장보기 앱 실시간 가격 연동
- 배달앱 영수증 OCR 입력
- 밀키트 브랜드별 가격 비교
- 사용자의 월별 식비 기록 저장
- 자주 먹는 메뉴별 장보기 리스트 추천
- 지역별 평균 배달비 데이터 반영

---

## 22. 최종 구현 방향

이 계산기는 "집밥이 무조건 싸다"를 주장하는 페이지가 아니라, 사용자의 배달 습관과 직접요리 조건을 숫자로 비교해 합리적인 선택을 돕는 도구다.

핵심 결과는 연간 절약 예상액이지만, 판단은 반드시 월 절약액, 시간 비용 포함 여부, 식재료 낭비율, 손익분기 주문금액을 함께 보도록 설계한다. 특히 1인 가구는 식재료 낭비율이 높으면 직접요리의 장점이 줄어들 수 있으므로 해당 경고를 결과 가까이에 노출한다.

생활비 절약 카테고리의 허브 도구로 사용할 수 있도록 `2026 1인 가구 생활비 완전 해부` 리포트와 강하게 연결한다.
