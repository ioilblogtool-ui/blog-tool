# 신생아 초기 용품 풀세트 비용 계산기 설계 문서

> 기획 문서: `docs/plan/202606/newborn-starter-kit-cost-calculator-plan.md`  
> 작성일: 2026-06-27  
> 콘텐츠 유형: `/tools/` 계산기  
> 구현 목표: 신생아 출산 전 초기 용품 비용을 가성비/중급/프리미엄 프리셋과 직접 입력으로 계산하고, 첫 1년 육아비 콘텐츠로 자연스럽게 연결하는 육아·출산 계산기

---

## 1. 문서 개요

- 구현 대상: `신생아 초기 용품 풀세트 비용 계산기`
- slug: `newborn-starter-kit-cost`
- URL: `/tools/newborn-starter-kit-cost/`
- 카테고리: 육아·출산
- 주요 검색 의도: 신생아 준비물 비용, 출산준비물 비용, 아기용품 풀세트 비용, 유모차 카시트 아기침대 가격, 신생아 필수템
- 주요 출력: 예상 초기 준비 비용, 실부담액, 필수템 합계, 선택템 합계, 절감액, 구매 우선순위
- 안전 원칙: 모든 가격은 `참고 추정값`으로 표기하고, 실제 구매가·브랜드 평균가처럼 단정하지 않는다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    newbornStarterKitCost.ts
  pages/
    tools/
      newborn-starter-kit-cost.astro

public/
  scripts/
    newborn-starter-kit-cost.js

src/styles/scss/pages/
  _newborn-starter-kit-cost.scss
```

필수 등록:

- `src/data/tools.ts`에 `newborn-starter-kit-cost` 등록
- `src/styles/app.scss`에 `@use 'scss/pages/newborn-starter-kit-cost';` 추가
- `public/sitemap.xml`에 `/tools/newborn-starter-kit-cost/` 추가

권장 등록:

- `/compare/` 육아·출산 섹션에 "신생아 초기 용품 비용" 추가
- `/reports/baby-cost-guide-first-year/`에서 초기 용품비 CTA 연결
- `/tools/pregnancy-birth-cost/`, `/tools/birth-support-total/` 결과 하단 관련 링크 연결

---

## 3. 레이아웃 방향

- `SimpleToolShell` 기반으로 구현한다.
- pageClass: `nskc-page`
- SCSS prefix: `nskc-`
- 계산기는 입력 좌측, 결과 우측 구조를 기본으로 하고 모바일에서는 단일 컬럼으로 접는다.
- 결과 카드는 계산기 상단에서 바로 보여주되, 하단에 상세 해설과 FAQ를 충분히 배치해 검색 유입 대응력을 확보한다.
- Chart.js는 필수 아님. 비용 비중은 CSS progress bar와 금액 리스트로 충분하다.

```astro
<SimpleToolShell
  calculatorId="newborn-starter-kit-cost"
  pageClass="nskc-page"
  resultFirst={false}
>
```

---

## 4. 페이지 IA

1. Hero
2. 참고 추정값 안내 `InfoNotice`
3. 프리셋 선택: 가성비 / 중급 / 프리미엄 / 직접 입력
4. 기본 조건 입력: 출산 순서, 구매 방식, 재사용률, 선물·지원금 반영액
5. 필수템 체크리스트: 카시트, 유모차, 아기침대, 수유용품, 목욕용품, 의류·침구 등
6. 선택템 체크리스트: 바운서, 모빌, 아기모니터, 분유포트, 유축기 등
7. 결과 카드: 총 준비 비용, 실부담액, 필수템 합계, 선택템 합계, 절감액
8. 구매 우선순위: 출산 전 준비 / 출산 후 구매 / 중고·렌탈 검토 / 새 제품 권장
9. 등급별 비교표
10. 첫 1년 육아비 연결 CTA
11. `SeoContent` 상세 안내
12. FAQ

---

## 5. 데이터 모델

파일: `src/data/newbornStarterKitCost.ts`

```ts
export type StarterKitTier = "budget" | "standard" | "premium" | "custom";
export type BirthOrder = "first" | "secondPlus";
export type PurchaseStrategy = "new" | "mixed" | "rental" | "custom";
export type KitCategory =
  | "mobility"
  | "sleep"
  | "feeding"
  | "bathHygiene"
  | "clothingBedding"
  | "comfortAppliance";
export type PriorityGroup = "beforeBirth" | "afterBirth" | "usedRentalOk" | "newRecommended";
export type EvidenceBadge = "참고" | "추정" | "직접 조정";

export interface CostRange {
  min: number;
  defaultValue: number;
  max: number;
  badge: EvidenceBadge;
}

export interface StarterKitItem {
  id: string;
  label: string;
  shortLabel: string;
  category: KitCategory;
  required: boolean;
  defaultIncluded: Record<Exclude<StarterKitTier, "custom">, boolean>;
  prices: Record<Exclude<StarterKitTier, "custom">, CostRange>;
  reusable: boolean;
  usedRentalEligible: boolean;
  newRecommended: boolean;
  priority: PriorityGroup;
  note: string;
}

export interface TierPreset {
  id: Exclude<StarterKitTier, "custom">;
  label: string;
  description: string;
  summary: string;
}

export interface PurchaseStrategyOption {
  id: PurchaseStrategy;
  label: string;
  description: string;
  defaultSavingRate: number;
}

export interface StarterKitInput {
  tier: StarterKitTier;
  birthOrder: BirthOrder;
  purchaseStrategy: PurchaseStrategy;
  reuseRate: number;
  savingRate: number;
  giftOffset: number;
  supportOffset: number;
  selectedItemIds: string[];
  customPrices: Record<string, number>;
}

export interface StarterKitBreakdownItem {
  id: string;
  label: string;
  category: KitCategory;
  amount: number;
  sharePercent: number;
  required: boolean;
  priority: PriorityGroup;
}

export interface PriorityResult {
  group: PriorityGroup;
  label: string;
  description: string;
  items: StarterKitBreakdownItem[];
}

export interface StarterKitResult {
  grossTotal: number;
  netTotal: number;
  requiredTotal: number;
  optionalTotal: number;
  reusableSubtotal: number;
  usedRentalEligibleSubtotal: number;
  reuseSaving: number;
  strategySaving: number;
  offsetTotal: number;
  budgetDiff: number;
  standardDiff: number;
  interpretation: string;
  selectedCount: number;
  breakdown: StarterKitBreakdownItem[];
  priorityGroups: PriorityResult[];
  warnings: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description?: string;
}
```

---

## 6. 기본 데이터 설계

### 6.1 프리셋

```ts
export const STARTER_KIT_TIER_PRESETS: TierPreset[] = [
  {
    id: "budget",
    label: "가성비",
    description: "필수 기능 중심으로 예산을 낮춘 구성",
    summary: "중고·선물 활용 여지가 큰 최소 준비형",
  },
  {
    id: "standard",
    label: "중급",
    description: "대부분의 가정이 참고하기 쉬운 표준 구성",
    summary: "새 제품 중심에 편의용품 일부 포함",
  },
  {
    id: "premium",
    label: "프리미엄",
    description: "고가 이동용품과 편의가전을 폭넓게 포함한 구성",
    summary: "유모차·카시트·수면·가전 비용이 크게 반영",
  },
];
```

### 6.2 구매 방식

```ts
export const PURCHASE_STRATEGIES: PurchaseStrategyOption[] = [
  {
    id: "new",
    label: "새 제품 위주",
    description: "모든 품목을 새 제품 기준으로 계산합니다.",
    defaultSavingRate: 0,
  },
  {
    id: "mixed",
    label: "새 제품+중고 혼합",
    description: "중고 활용 가능한 품목에 일부 절감률을 반영합니다.",
    defaultSavingRate: 0.15,
  },
  {
    id: "rental",
    label: "렌탈 일부 활용",
    description: "사용 기간이 짧은 품목에 렌탈·대여 절감률을 반영합니다.",
    defaultSavingRate: 0.2,
  },
  {
    id: "custom",
    label: "직접 조정",
    description: "절감률을 직접 입력합니다.",
    defaultSavingRate: 0,
  },
];
```

### 6.3 품목 데이터

아래 가격은 `defaultValue` 중심으로 계산하고, min/max는 안내 표와 추정 범위 표시용으로 사용한다.

```ts
export const STARTER_KIT_ITEMS: StarterKitItem[] = [
  {
    id: "carSeat",
    label: "카시트",
    shortLabel: "카시트",
    category: "mobility",
    required: true,
    defaultIncluded: { budget: true, standard: true, premium: true },
    prices: {
      budget: { min: 150000, defaultValue: 250000, max: 300000, badge: "추정" },
      standard: { min: 400000, defaultValue: 550000, max: 700000, badge: "추정" },
      premium: { min: 800000, defaultValue: 1100000, max: 1500000, badge: "추정" },
    },
    reusable: true,
    usedRentalEligible: false,
    newRecommended: true,
    priority: "newRecommended",
    note: "중고 사용 시 사고 이력, 사용기한, 인증 상태 확인이 필요합니다.",
  },
  {
    id: "stroller",
    label: "유모차",
    shortLabel: "유모차",
    category: "mobility",
    required: true,
    defaultIncluded: { budget: true, standard: true, premium: true },
    prices: {
      budget: { min: 200000, defaultValue: 300000, max: 400000, badge: "추정" },
      standard: { min: 700000, defaultValue: 950000, max: 1200000, badge: "추정" },
      premium: { min: 1500000, defaultValue: 2000000, max: 2500000, badge: "추정" },
    },
    reusable: true,
    usedRentalEligible: true,
    newRecommended: false,
    priority: "afterBirth",
    note: "주거 환경과 외출 빈도에 따라 출산 후 구매해도 됩니다.",
  },
  {
    id: "babyBed",
    label: "아기침대·범퍼침대",
    shortLabel: "아기침대",
    category: "sleep",
    required: true,
    defaultIncluded: { budget: true, standard: true, premium: true },
    prices: {
      budget: { min: 100000, defaultValue: 180000, max: 250000, badge: "추정" },
      standard: { min: 300000, defaultValue: 450000, max: 600000, badge: "추정" },
      premium: { min: 800000, defaultValue: 1100000, max: 1500000, badge: "추정" },
    },
    reusable: true,
    usedRentalEligible: true,
    newRecommended: false,
    priority: "beforeBirth",
    note: "수면 방식과 집 구조에 따라 필요한 형태가 달라집니다.",
  },
  {
    id: "feedingStarter",
    label: "젖병·수유용품",
    shortLabel: "수유용품",
    category: "feeding",
    required: true,
    defaultIncluded: { budget: true, standard: true, premium: true },
    prices: {
      budget: { min: 80000, defaultValue: 120000, max: 150000, badge: "추정" },
      standard: { min: 180000, defaultValue: 240000, max: 300000, badge: "추정" },
      premium: { min: 350000, defaultValue: 480000, max: 600000, badge: "추정" },
    },
    reusable: false,
    usedRentalEligible: false,
    newRecommended: true,
    priority: "beforeBirth",
    note: "수유 방식이 정해진 뒤 추가 구매하는 방식이 안전합니다.",
  },
  {
    id: "bottleWasherSterilizer",
    label: "젖병세척기·소독기",
    shortLabel: "세척·소독",
    category: "feeding",
    required: false,
    defaultIncluded: { budget: false, standard: true, premium: true },
    prices: {
      budget: { min: 80000, defaultValue: 120000, max: 150000, badge: "추정" },
      standard: { min: 200000, defaultValue: 280000, max: 350000, badge: "추정" },
      premium: { min: 400000, defaultValue: 550000, max: 700000, badge: "추정" },
    },
    reusable: true,
    usedRentalEligible: true,
    newRecommended: false,
    priority: "afterBirth",
    note: "분유 수유 비중이 높을수록 체감 효용이 커집니다.",
  },
  {
    id: "babyCarrier",
    label: "아기띠",
    shortLabel: "아기띠",
    category: "mobility",
    required: true,
    defaultIncluded: { budget: true, standard: true, premium: true },
    prices: {
      budget: { min: 50000, defaultValue: 90000, max: 120000, badge: "추정" },
      standard: { min: 150000, defaultValue: 200000, max: 250000, badge: "추정" },
      premium: { min: 300000, defaultValue: 380000, max: 450000, badge: "추정" },
    },
    reusable: true,
    usedRentalEligible: true,
    newRecommended: false,
    priority: "afterBirth",
    note: "착용감 차이가 커서 출산 후 체형에 맞춰 사도 됩니다.",
  },
  {
    id: "bathSet",
    label: "아기욕조·목욕용품",
    shortLabel: "목욕용품",
    category: "bathHygiene",
    required: true,
    defaultIncluded: { budget: true, standard: true, premium: true },
    prices: {
      budget: { min: 30000, defaultValue: 60000, max: 80000, badge: "추정" },
      standard: { min: 100000, defaultValue: 140000, max: 180000, badge: "추정" },
      premium: { min: 200000, defaultValue: 280000, max: 350000, badge: "추정" },
    },
    reusable: true,
    usedRentalEligible: false,
    newRecommended: false,
    priority: "beforeBirth",
    note: "기본 욕조와 수건, 세정용품 중심으로 시작해도 됩니다.",
  },
  {
    id: "clothingBeddingStarter",
    label: "의류·침구 스타터",
    shortLabel: "의류·침구",
    category: "clothingBedding",
    required: true,
    defaultIncluded: { budget: true, standard: true, premium: true },
    prices: {
      budget: { min: 150000, defaultValue: 200000, max: 250000, badge: "추정" },
      standard: { min: 300000, defaultValue: 400000, max: 500000, badge: "추정" },
      premium: { min: 600000, defaultValue: 800000, max: 1000000, badge: "추정" },
    },
    reusable: true,
    usedRentalEligible: true,
    newRecommended: false,
    priority: "beforeBirth",
    note: "선물로 받는 경우가 많아 실제 현금 지출은 줄어들 수 있습니다.",
  },
  {
    id: "hygieneHealth",
    label: "체온계·위생용품",
    shortLabel: "위생용품",
    category: "bathHygiene",
    required: true,
    defaultIncluded: { budget: true, standard: true, premium: true },
    prices: {
      budget: { min: 50000, defaultValue: 80000, max: 100000, badge: "추정" },
      standard: { min: 120000, defaultValue: 160000, max: 200000, badge: "추정" },
      premium: { min: 250000, defaultValue: 300000, max: 350000, badge: "추정" },
    },
    reusable: false,
    usedRentalEligible: false,
    newRecommended: true,
    priority: "beforeBirth",
    note: "체온계, 손톱가위, 면봉, 세탁망 등 기본 위생용품입니다.",
  },
  {
    id: "bouncerMobile",
    label: "바운서·모빌",
    shortLabel: "바운서·모빌",
    category: "comfortAppliance",
    required: false,
    defaultIncluded: { budget: false, standard: true, premium: true },
    prices: {
      budget: { min: 80000, defaultValue: 130000, max: 180000, badge: "추정" },
      standard: { min: 250000, defaultValue: 350000, max: 450000, badge: "추정" },
      premium: { min: 600000, defaultValue: 800000, max: 1000000, badge: "추정" },
    },
    reusable: true,
    usedRentalEligible: true,
    newRecommended: false,
    priority: "usedRentalOk",
    note: "사용 기간이 짧아 중고·대여를 검토하기 좋습니다.",
  },
  {
    id: "babyMonitorAppliance",
    label: "아기모니터·편의가전",
    shortLabel: "편의가전",
    category: "comfortAppliance",
    required: false,
    defaultIncluded: { budget: false, standard: false, premium: true },
    prices: {
      budget: { min: 0, defaultValue: 100000, max: 150000, badge: "추정" },
      standard: { min: 200000, defaultValue: 350000, max: 500000, badge: "추정" },
      premium: { min: 800000, defaultValue: 1100000, max: 1500000, badge: "추정" },
    },
    reusable: true,
    usedRentalEligible: true,
    newRecommended: false,
    priority: "afterBirth",
    note: "수면 공간 분리 여부와 기존 가전 보유 여부에 따라 제외 가능합니다.",
  },
];
```

---

## 7. 계산 로직 설계

### 7.1 핵심 계산 함수

클라이언트 JS와 테스트 용이성을 위해 같은 계산 순서를 유지한다. TypeScript 파일에는 참고용 계산 함수를 export해도 되고, 실제 브라우저 계산은 `public/scripts/newborn-starter-kit-cost.js`에서 동일한 로직으로 수행한다.

```ts
export function calculateStarterKit(input: StarterKitInput): StarterKitResult {
  const tier = input.tier === "custom" ? "standard" : input.tier;

  const selectedItems = STARTER_KIT_ITEMS.filter((item) =>
    input.selectedItemIds.includes(item.id)
  );

  const breakdown = selectedItems.map((item) => {
    const defaultPrice = item.prices[tier].defaultValue;
    const amount = input.customPrices[item.id] ?? defaultPrice;

    return {
      id: item.id,
      label: item.label,
      category: item.category,
      amount,
      sharePercent: 0,
      required: item.required,
      priority: item.priority,
    };
  });

  const baseTotal = breakdown.reduce((sum, item) => sum + item.amount, 0);
  const requiredTotal = breakdown
    .filter((item) => item.required)
    .reduce((sum, item) => sum + item.amount, 0);
  const optionalTotal = baseTotal - requiredTotal;

  const reusableSubtotal = selectedItems
    .filter((item) => item.reusable)
    .reduce((sum, item) => sum + (input.customPrices[item.id] ?? item.prices[tier].defaultValue), 0);

  const usedRentalEligibleSubtotal = selectedItems
    .filter((item) => item.usedRentalEligible)
    .reduce((sum, item) => sum + (input.customPrices[item.id] ?? item.prices[tier].defaultValue), 0);

  const reuseSaving = reusableSubtotal * input.reuseRate;
  const strategySaving = usedRentalEligibleSubtotal * input.savingRate;
  const grossTotal = Math.max(0, baseTotal - reuseSaving - strategySaving);
  const offsetTotal = input.giftOffset + input.supportOffset;
  const netTotal = Math.max(0, grossTotal - offsetTotal);

  return {
    grossTotal,
    netTotal,
    requiredTotal,
    optionalTotal,
    reusableSubtotal,
    usedRentalEligibleSubtotal,
    reuseSaving,
    strategySaving,
    offsetTotal,
    budgetDiff: 0,
    standardDiff: 0,
    interpretation: getStarterKitInterpretation(netTotal),
    selectedCount: selectedItems.length,
    breakdown: attachSharePercent(breakdown, baseTotal),
    priorityGroups: buildPriorityGroups(breakdown),
    warnings: buildWarnings(input, selectedItems),
  };
}
```

### 7.2 해석 문구

```ts
export function getStarterKitInterpretation(netTotal: number): string {
  if (netTotal <= 2_000_000) {
    return "필수템 중심의 절약형 준비에 가깝습니다. 선물이나 중고 활용이 있다면 실제 현금 지출은 더 낮아질 수 있습니다.";
  }
  if (netTotal <= 5_000_000) {
    return "중급 표준 준비 범위입니다. 고가 이동용품과 편의용품을 일부 포함한 현실적인 예산에 가깝습니다.";
  }
  if (netTotal <= 9_000_000) {
    return "고가 품목이 꽤 포함된 준비 비용입니다. 유모차, 카시트, 수면용품, 편의가전의 우선순위를 다시 보면 예산을 줄일 수 있습니다.";
  }
  return "프리미엄 풀세트에 가까운 준비 비용입니다. 출산 전 꼭 필요한 품목과 출산 후 구매해도 되는 품목을 분리해보는 것이 좋습니다.";
}
```

### 7.3 경고 문구

조건별로 결과 하단에 표시한다.

- 카시트가 선택되어 있고 구매 방식이 중고 혼합 또는 렌탈이면:
  - `카시트는 사고 이력, 사용기한, 인증 상태 확인이 중요합니다. 확인이 어렵다면 새 제품 구매를 권장합니다.`
- 프리미엄 프리셋이고 실부담액이 900만 원 이상이면:
  - `프리미엄 품목이 많아 초기 현금 지출이 큽니다. 출산 후 구매해도 되는 품목을 분리해보세요.`
- 선물·지원금 반영액이 총 준비 비용보다 크면:
  - `지원금과 선물 반영액이 준비 비용보다 커서 실부담액은 0원으로 표시했습니다.`

---

## 8. Astro 페이지 설계

파일: `src/pages/tools/newborn-starter-kit-cost.astro`

### 8.1 imports

```astro
---
import SimpleToolShell from "../../components/SimpleToolShell.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  STARTER_KIT_ITEMS,
  STARTER_KIT_TIER_PRESETS,
  PURCHASE_STRATEGIES,
  NEWBORN_STARTER_KIT_FAQS,
  NEWBORN_STARTER_KIT_RELATED_LINKS,
} from "../../data/newbornStarterKitCost";
---
```

### 8.2 데이터 전달

```astro
<script
  type="application/json"
  id="nskc-data"
  set:html={JSON.stringify({
    items: STARTER_KIT_ITEMS,
    tiers: STARTER_KIT_TIER_PRESETS,
    strategies: PURCHASE_STRATEGIES,
  })}
/>
```

### 8.3 주요 DOM ID

클라이언트 JS에서 사용하는 ID와 data attribute는 아래로 고정한다.

```text
#nskc-form
#nskc-tier
#nskc-birth-order
#nskc-purchase-strategy
#nskc-reuse-rate
#nskc-saving-rate
#nskc-gift-offset
#nskc-support-offset
#nskc-item-list
#nskc-required-total
#nskc-optional-total
#nskc-gross-total
#nskc-net-total
#nskc-saving-total
#nskc-interpretation
#nskc-breakdown-list
#nskc-priority-groups
#nskc-warnings
```

품목 체크박스:

```html
<input
  type="checkbox"
  data-nskc-item-toggle
  data-item-id="carSeat"
/>
```

품목 가격 입력:

```html
<input
  type="number"
  data-nskc-price-input
  data-item-id="carSeat"
/>
```

---

## 9. 클라이언트 JS 설계

파일: `public/scripts/newborn-starter-kit-cost.js`

### 9.1 구조

```js
(function () {
  const dataEl = document.getElementById("nskc-data");
  const root = document.getElementById("newborn-starter-kit-cost");

  if (!dataEl || !root) return;

  const state = createInitialState(JSON.parse(dataEl.textContent || "{}"));

  bindControls(state);
  applyTierPreset(state);
  render(state);
})();
```

### 9.2 상태

```js
const state = {
  tier: "standard",
  birthOrder: "first",
  purchaseStrategy: "mixed",
  reuseRate: 0,
  savingRate: 0.15,
  giftOffset: 0,
  supportOffset: 0,
  selectedItemIds: [],
  customPrices: {},
};
```

### 9.3 주요 함수

```text
createInitialState(data)
bindControls(state)
applyTierPreset(state)
handleTierChange(nextTier)
handleBirthOrderChange(nextBirthOrder)
handlePurchaseStrategyChange(nextStrategy)
handleItemToggle(itemId, checked)
handlePriceChange(itemId, value)
calculate(state)
render(state)
renderTotals(result)
renderBreakdown(result)
renderPriorityGroups(result)
renderWarnings(result)
formatWon(value)
parseWonInput(value)
```

### 9.4 이벤트 규칙

- 프리셋 변경 시:
  - 해당 등급의 기본 포함 품목으로 체크박스를 재설정한다.
  - 해당 등급의 기본 가격으로 가격 입력값을 채운다.
  - 직접 수정값은 프리셋 전환 시 초기화한다.
- 직접 입력 모드 진입 시:
  - 현재 선택 상태와 가격을 유지한다.
  - 사용자가 품목별 가격을 자유롭게 수정할 수 있다.
- 출산 순서 변경 시:
  - 첫째: 재사용률 0%
  - 둘째 이상: 재사용률 30%
- 구매 방식 변경 시:
  - 새 제품 위주: 절감률 0%
  - 새 제품+중고 혼합: 절감률 15%
  - 렌탈 일부 활용: 절감률 20%
  - 직접 조정: 현재 절감률 유지

---

## 10. SCSS 설계

파일: `src/styles/scss/pages/_newborn-starter-kit-cost.scss`

### 10.1 클래스 구조

```scss
.nskc-page {}
.nskc-layout {}
.nskc-panel {}
.nskc-grid {}
.nskc-tier-tabs {}
.nskc-fieldset {}
.nskc-item-list {}
.nskc-item {}
.nskc-item__header {}
.nskc-item__meta {}
.nskc-item__price {}
.nskc-result {}
.nskc-result__total {}
.nskc-result__kpis {}
.nskc-breakdown {}
.nskc-priority {}
.nskc-compare {}
.nskc-cta {}
.nskc-warning {}
```

### 10.2 레이아웃

```scss
.nskc-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
  gap: 24px;
  align-items: start;
}

.nskc-result {
  position: sticky;
  top: 96px;
}

@media (max-width: 820px) {
  .nskc-layout {
    grid-template-columns: 1fr;
  }

  .nskc-result {
    position: static;
  }
}
```

### 10.3 디자인 원칙

- 카드 radius는 기존 사이트 기준과 맞추되 과하게 둥글게 하지 않는다.
- 금액 결과는 충분히 크게, 세부 라벨은 작고 명확하게 둔다.
- 필수/선택/주의 배지는 색상만으로 의미를 전달하지 말고 텍스트를 함께 둔다.
- 모바일에서 체크박스, 숫자 입력, 금액 라벨이 겹치지 않게 item row는 1열로 접는다.
- 한 화면에 입력이 너무 많아 보이지 않도록 `필수템`과 `선택템` 섹션을 분리한다.

---

## 11. 결과 렌더링 상세

### 11.1 KPI 카드

표시 순서:

1. 실부담액
2. 예상 초기 준비 비용
3. 필수템 합계
4. 선택템 합계
5. 절감액

문구:

- 실부담액: `선물·지원금 반영 후`
- 예상 초기 준비 비용: `절감 전 선택 품목 기준`
- 절감액: `재사용·중고·렌탈 반영`

### 11.2 비용 비중

카테고리별 합산:

- 이동: 카시트, 유모차, 아기띠
- 수면: 아기침대·범퍼침대
- 수유·세척: 젖병·수유용품, 젖병세척기·소독기
- 목욕·위생: 아기욕조·목욕용품, 체온계·위생용품
- 의류·침구: 의류·침구 스타터
- 편의가전: 바운서·모빌, 아기모니터·편의가전

각 항목:

- 카테고리명
- 금액
- 전체 대비 비중
- CSS bar

### 11.3 구매 우선순위

출력 그룹:

- 출산 전 준비 권장
- 출산 후 상황 보고 구매
- 중고·렌탈 검토 가능
- 새 제품 권장

각 그룹에는 선택된 품목만 표시한다.

---

## 12. SEO 콘텐츠 설계

`SeoContent`에 넣을 섹션:

1. 신생아 초기 용품비는 왜 크게 차이 날까
2. 출산 전에 꼭 사야 하는 것과 나중에 사도 되는 것
3. 가성비 세트와 프리미엄 세트의 차이
4. 중고·렌탈을 활용해도 되는 품목
5. 첫 1년 육아비와의 차이

FAQ:

- 신생아 용품 준비 비용은 보통 얼마 정도 잡아야 하나요?
- 출산 전에 반드시 사야 하는 품목은 무엇인가요?
- 카시트와 유모차는 꼭 프리미엄으로 사야 하나요?
- 중고로 사도 되는 품목과 피해야 하는 품목은 무엇인가요?
- 젖병세척기와 젖병소독기는 둘 다 필요한가요?
- 둘째 출산이면 준비 비용이 얼마나 줄어드나요?
- 이 계산기와 첫 1년 육아비 가이드는 어떻게 다른가요?

---

## 13. 접근성 및 사용성

- 모든 입력에는 `label`을 연결한다.
- 체크박스와 숫자 입력은 키보드로 조작 가능해야 한다.
- 결과 금액은 `aria-live="polite"` 영역에 넣어 변경을 인지할 수 있게 한다.
- 색상 배지에는 텍스트를 반드시 포함한다.
- 숫자 입력은 `inputmode="numeric"`을 사용한다.
- 큰 금액은 천 단위 콤마와 `원` 단위를 붙인다.
- 모바일에서 결과 요약이 입력 버튼을 가리지 않게 한다.

---

## 14. URL 파라미터 설계

MVP에서는 선택 사항이지만, 2차 개선에서 공유 링크를 위해 아래 파라미터를 사용한다.

```text
tier=standard
birth=first
strategy=mixed
reuse=0
saving=15
gift=0
support=0
items=carSeat,stroller,babyBed
price_carSeat=550000
```

주의:

- URL이 너무 길어질 수 있으므로 품목 가격은 기본값과 다른 경우에만 저장한다.
- 잘못된 값은 무시하고 기본값으로 복원한다.

---

## 15. 테스트 체크리스트

기능:

- [ ] 가성비/중급/프리미엄 전환 시 품목과 가격이 바뀐다.
- [ ] 직접 입력에서 가격 변경 시 결과가 즉시 갱신된다.
- [ ] 필수템 체크 해제 시 필수템 합계가 감소한다.
- [ ] 선택템 체크 시 선택템 합계가 증가한다.
- [ ] 둘째 이상 선택 시 재사용률 기본값이 30%로 바뀐다.
- [ ] 구매 방식 변경 시 절감률이 바뀐다.
- [ ] 선물·지원금 반영액이 실부담액에서 차감된다.
- [ ] 실부담액은 0원 아래로 내려가지 않는다.
- [ ] 카시트 중고 관련 경고가 조건에 맞게 표시된다.

반응형:

- [ ] 375px 모바일에서 버튼 텍스트와 금액이 겹치지 않는다.
- [ ] 820px 이하에서 입력/결과가 1열로 접힌다.
- [ ] 데스크톱에서 결과 카드 sticky가 정상 작동한다.

빌드:

- [ ] `npm run build` 성공
- [ ] sitemap URL 포함
- [ ] tools 목록에서 노출
- [ ] 관련 링크 404 없음

---

## 16. 구현 순서

1. `src/data/newbornStarterKitCost.ts` 생성
2. `src/pages/tools/newborn-starter-kit-cost.astro` 생성
3. `public/scripts/newborn-starter-kit-cost.js` 생성
4. `src/styles/scss/pages/_newborn-starter-kit-cost.scss` 생성
5. `src/data/tools.ts` 등록
6. `src/styles/app.scss` import 추가
7. `public/sitemap.xml` URL 추가
8. `/compare/` 육아·출산 섹션에 링크 추가
9. `npm run build`
10. 필요 시 로컬 브라우저에서 모바일/데스크톱 확인

---

## 17. 구현 시 주의사항

- 사용자 facing 문구는 모두 한국어로 작성한다.
- 가격은 공식 평균이 아니라 `참고 추정값`으로 표기한다.
- 카시트 중고 구매를 단순 절약 팁처럼 강조하지 않는다.
- 계산 결과를 실제 구매 견적처럼 단정하지 않는다.
- 특정 브랜드 추천이나 제휴 링크처럼 보이는 구성을 피한다.
- 기존 육아 계산기들과 내부 링크를 촘촘하게 연결한다.
- `npm run build` 실패 상태로 커밋·push하지 않는다.
