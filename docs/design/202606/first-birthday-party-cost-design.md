# 돌잔치 비용 비교 계산기 — 설계 문서

> 기획 원문: `docs/plan/202606/first-birthday-party-cost-comparison-plan.md`  
> 작성일: 2026-06-27  
> 콘텐츠 유형: `/tools/` 계산기  
> 구현 기준: 지역·돌잔치 유형·하객 수·보증 인원·식대·촬영·한복·돌상·답례품을 합산해 총비용과 순부담액을 실시간 계산하는 가족 행사 예산 계산기

---

## 1. 문서 개요

- 구현 대상: `돌잔치 비용 비교 계산기`
- slug: `first-birthday-party-cost`
- URL: `/tools/first-birthday-party-cost/`
- 카테고리: 육아·출산
- 핵심 검색 의도: `돌잔치 비용`, `돌잔치 비용 계산기`, `돌잔치 식대`, `호텔 돌잔치 비용`, `돌잔치 한복 대여 비용`
- 핵심 출력: 예상 총비용, 식대 합계, 부대비용, 순부담액, 1인당 실비, 소규모·일반·프리미엄 비교
- 안전 장치: 모든 가격은 `추정` 또는 `시뮬레이션` 배지. 실제 계약 전 보증 인원, 부가세, 봉사료, 주차, 취소 위약금 확인 안내 필수.

---

## 2. 구현 파일 구조

```text
src/
  data/
    firstBirthdayPartyCost.ts
  pages/
    tools/
      first-birthday-party-cost.astro

public/
  scripts/
    first-birthday-party-cost.js

src/styles/scss/pages/
  _first-birthday-party-cost.scss
```

추가 등록 필수:

- `src/data/tools.ts` — slug 등록, category는 육아·출산 계열
- `src/styles/app.scss` — `@use 'scss/pages/first-birthday-party-cost';`
- `public/sitemap.xml` — `/tools/first-birthday-party-cost/`

선택 등록:

- `src/pages/index.astro` — 신규/추천 도구 노출
- `public/og/tools/first-birthday-party-cost.png`
- 관련 계산기 하단 링크: 분유값, 기저귀값, 출산·육아 지원금, 결혼 준비 예산 계산기

---

## 3. 레이아웃 방향

- `SimpleToolShell` 기반을 우선 검토한다.
- pageClass: `fbpc-page`
- SCSS prefix: `fbpc-`
- 입력은 `기본 조건`, `촬영·의상`, `진행·답례품`, `분담` 4개 블록으로 나눈다.
- 결과는 KPI 5개 → 비용 비중 바 → 등급 비교 카드 → 계약 체크리스트 순서로 배치한다.
- 모바일에서는 입력 블록을 세로 스택으로 두고, 결과 요약을 입력 직후에 노출한다.
- Chart.js는 필수는 아니다. 비용 비중은 CSS progress bar로 충분하다.

```astro
<SimpleToolShell
  calculatorId="first-birthday-party-cost"
  pageClass="fbpc-page"
  resultFirst={false}
>
```

---

## 4. 페이지 IA

1. Hero
2. 추정값 안내 `InfoNotice`
3. 프리셋 선택: 가족 식사 / 일반 연회장 / 호텔·프리미엄 / 셀프 파티룸
4. 기본 조건 입력: 지역, 하객 수, 보증 인원, 1인 식대, 장소 패키지
5. 옵션 입력: 스튜디오 촬영, 행사 스냅, 아이 한복, 부모 한복, 돌상
6. 진행·답례품 입력: 답례품 단가/수량, 사회자, 성장 영상, 헤어메이크업, 예비비
7. KPI 결과 카드: 총비용, 식대, 부대비용, 순부담액, 1인당 실비
8. 비용 분해: 식대 / 장소 / 촬영 / 의상 / 돌상 / 답례품 / 진행비
9. 등급 비교: 소규모 / 일반 / 프리미엄
10. 계약 전 체크리스트
11. 관련 계산기 CTA
12. `SeoContent` + FAQ

---

## 5. 데이터 모델

파일: `src/data/firstBirthdayPartyCost.ts`

```ts
export type BirthdayRegion = "seoul" | "metro" | "majorCity" | "local";
export type PartyType = "familyMeal" | "banquet" | "hotelPremium" | "selfPartyRoom";
export type OptionTier = "none" | "value" | "standard" | "premium";
export type EvidenceBadge = "참고" | "추정" | "시뮬레이션";

export interface BirthdayRegionOption {
  id: BirthdayRegion;
  label: string;
  multiplier: number;
  note: string;
}

export interface PartyTypePreset {
  id: PartyType;
  label: string;
  description: string;
  defaultGuestCount: number;
  defaultGuaranteedCount: number;
  defaultMealPrice: number;
  defaultVenuePackageCost: number;
  recommendedReplyGiftCountMode: "guest" | "guaranteed";
}

export interface CostTierValue {
  min: number;
  defaultValue: number;
  max: number;
  badge: EvidenceBadge;
}

export interface OptionCostTable {
  studio: Record<OptionTier, CostTierValue>;
  eventSnap: Record<Exclude<OptionTier, "none">, CostTierValue>;
  childHanbok: Record<OptionTier, CostTierValue>;
  parentHanbok: Record<OptionTier, CostTierValue>;
  dolTable: Record<OptionTier, CostTierValue>;
  hostEvent: Record<Exclude<OptionTier, "none">, CostTierValue>;
  growthVideo: Record<Exclude<OptionTier, "none">, CostTierValue>;
  hairMakeup: Record<Exclude<OptionTier, "none">, CostTierValue>;
}

export interface BirthdayPartyInput {
  region: BirthdayRegion;
  partyType: PartyType;
  guestCount: number;
  guaranteedCount: number;
  mealPrice: number;
  venuePackageCost: number;
  studioTier: OptionTier;
  eventSnapEnabled: boolean;
  eventSnapCost: number;
  childHanbokTier: OptionTier;
  parentHanbokEnabled: boolean;
  parentHanbokCost: number;
  dolTableTier: OptionTier;
  replyGiftUnitPrice: number;
  replyGiftCount: number;
  hostEventEnabled: boolean;
  hostEventCost: number;
  growthVideoEnabled: boolean;
  growthVideoCost: number;
  hairMakeupEnabled: boolean;
  hairMakeupCost: number;
  reserveRate: number;
  expectedGiftMoney: number;
}

export interface CostBreakdownItem {
  id: string;
  label: string;
  amount: number;
  sharePercent: number;
  badge: EvidenceBadge;
}

export interface BirthdayPartyResult {
  billableGuestCount: number;
  mealTotal: number;
  venueTotal: number;
  studioTotal: number;
  outfitTotal: number;
  dolTableTotal: number;
  replyGiftTotal: number;
  eventTotal: number;
  subtotalBeforeReserve: number;
  reserveAmount: number;
  totalCost: number;
  netCost: number;
  costPerGuest: number;
  largestCategoryLabel: string;
  mealSharePercent: number;
  breakdown: CostBreakdownItem[];
  interpretation: string;
  warnings: string[];
}

export interface ScenarioCompareItem {
  id: "small" | "standard" | "premium";
  label: string;
  description: string;
  estimatedTotal: number;
  diffFromCurrent: number;
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

### 6-1. 지역 옵션

```ts
export const BIRTHDAY_REGION_OPTIONS: BirthdayRegionOption[] = [
  { id: "seoul", label: "서울", multiplier: 1.18, note: "식대와 장소 패키지가 높은 편" },
  { id: "metro", label: "수도권", multiplier: 1, note: "기본 기준값" },
  { id: "majorCity", label: "광역시", multiplier: 0.96, note: "업체별 차이가 큰 구간" },
  { id: "local", label: "지방", multiplier: 0.9, note: "장소비와 식대가 낮은 편" },
];
```

### 6-2. 돌잔치 유형 프리셋

```ts
export const PARTY_TYPE_PRESETS: PartyTypePreset[] = [
  {
    id: "familyMeal",
    label: "가족 식사",
    description: "직계 가족 중심의 소규모 식사형",
    defaultGuestCount: 20,
    defaultGuaranteedCount: 20,
    defaultMealPrice: 60000,
    defaultVenuePackageCost: 100000,
    recommendedReplyGiftCountMode: "guest",
  },
  {
    id: "banquet",
    label: "일반 연회장",
    description: "뷔페·한정식·연회장 중심의 표준형",
    defaultGuestCount: 60,
    defaultGuaranteedCount: 50,
    defaultMealPrice: 65000,
    defaultVenuePackageCost: 600000,
    recommendedReplyGiftCountMode: "guaranteed",
  },
  {
    id: "hotelPremium",
    label: "호텔·프리미엄",
    description: "호텔·프리미엄 홀 중심의 고급형",
    defaultGuestCount: 80,
    defaultGuaranteedCount: 70,
    defaultMealPrice: 120000,
    defaultVenuePackageCost: 1800000,
    recommendedReplyGiftCountMode: "guaranteed",
  },
  {
    id: "selfPartyRoom",
    label: "셀프 파티룸",
    description: "파티룸 대관과 셀프 상차림 중심",
    defaultGuestCount: 25,
    defaultGuaranteedCount: 0,
    defaultMealPrice: 35000,
    defaultVenuePackageCost: 500000,
    recommendedReplyGiftCountMode: "guest",
  },
];
```

### 6-3. 초기 입력값

```ts
export const DEFAULT_BIRTHDAY_PARTY_INPUT: BirthdayPartyInput = {
  region: "metro",
  partyType: "banquet",
  guestCount: 60,
  guaranteedCount: 50,
  mealPrice: 65000,
  venuePackageCost: 600000,
  studioTier: "standard",
  eventSnapEnabled: true,
  eventSnapCost: 600000,
  childHanbokTier: "standard",
  parentHanbokEnabled: false,
  parentHanbokCost: 500000,
  dolTableTier: "standard",
  replyGiftUnitPrice: 4000,
  replyGiftCount: 60,
  hostEventEnabled: false,
  hostEventCost: 300000,
  growthVideoEnabled: false,
  growthVideoCost: 150000,
  hairMakeupEnabled: false,
  hairMakeupCost: 250000,
  reserveRate: 5,
  expectedGiftMoney: 0,
};
```

---

## 7. 계산 규칙

### 7-1. 핵심 함수

```ts
export function calculateBirthdayPartyCost(input: BirthdayPartyInput): BirthdayPartyResult
export function applyPartyPreset(input: BirthdayPartyInput, partyType: PartyType): BirthdayPartyInput
export function buildScenarioComparison(input: BirthdayPartyInput): ScenarioCompareItem[]
export function formatWon(value: number): string
export function formatManwon(value: number): string
```

### 7-2. 계산 순서

1. 지역 보정 계수를 가져온다.
2. `billableGuestCount = Math.max(guestCount, guaranteedCount)`로 식대 기준 인원을 정한다.
3. `mealTotal = billableGuestCount * mealPrice * regionMultiplier`로 식대 합계를 계산한다.
4. 장소 패키지는 `venuePackageCost * regionMultiplier`로 보정한다.
5. 스튜디오, 한복, 돌상은 선택 tier의 기본값을 가져오되 사용자가 직접 수정한 금액이 있으면 직접 입력값을 우선한다.
6. 답례품은 `replyGiftUnitPrice * replyGiftCount`로 계산한다.
7. 토글형 비용은 enabled일 때만 합산한다.
8. 예비비는 `subtotalBeforeReserve * reserveRate / 100`으로 계산한다.
9. 총비용은 모든 항목과 예비비를 합산한다.
10. 순부담액은 `Math.max(totalCost - expectedGiftMoney, 0)`으로 계산한다.

### 7-3. 상세 수식

```text
식대 기준 인원 = max(하객 수, 보증 인원)
식대 합계 = 식대 기준 인원 × 1인 식대 × 지역 보정
장소 합계 = 장소 패키지 × 지역 보정

촬영 합계 = 스튜디오 촬영 + 행사 스냅
의상 합계 = 아이 한복 + 부모 한복
답례품 합계 = 답례품 단가 × 답례품 수량
진행비 합계 = 사회자·이벤트 + 성장 영상 + 헤어메이크업

예비비 기준액 = 식대 + 장소 + 촬영 + 의상 + 돌상 + 답례품 + 진행비
예비비 = 예비비 기준액 × 예비비율

총비용 = 예비비 기준액 + 예비비
순부담액 = max(총비용 - 예상 축의금, 0)
1인당 실비 = 총비용 ÷ max(하객 수, 1)
```

### 7-4. 해석 문구 규칙

| 조건 | 문구 방향 |
|---|---|
| 식대 비중 70% 이상 | 식대와 보증 인원이 총액을 좌우한다고 안내 |
| 부대비용 200만원 이상 | 촬영·돌상·한복 옵션 조정 여지 안내 |
| 순부담액 0원 | 축의금 예상액이 총비용보다 크거나 같으므로 보수적 입력 권장 |
| 호텔·프리미엄 + 하객 80명 이상 | 총액 변동 폭이 크므로 봉사료·부가세 확인 강조 |
| 보증 인원 > 하객 수 | 실제 참석자가 적어도 보증 인원 기준 청구 가능 안내 |

---

## 8. Astro 마크업 구조

파일: `src/pages/tools/first-birthday-party-cost.astro`

### 8-1. imports

```astro
---
import BaseLayout from "../../components/BaseLayout.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  BIRTHDAY_REGION_OPTIONS,
  PARTY_TYPE_PRESETS,
  DEFAULT_BIRTHDAY_PARTY_INPUT,
  FIRST_BIRTHDAY_FAQ,
  FIRST_BIRTHDAY_RELATED,
} from "../../data/firstBirthdayPartyCost";
---
```

### 8-2. 상위 구조

```astro
<BaseLayout title={seoTitle} description={seoDescription} pageClass="fbpc-page">
  <CalculatorHero ... />
  <InfoNotice ... />

  <main class="fbpc-shell" data-fbpc-root>
    <section class="fbpc-control-panel" aria-labelledby="fbpc-input-title">
      ...
    </section>

    <section class="fbpc-result-panel" aria-labelledby="fbpc-result-title">
      ...
    </section>
  </main>

  <section class="content-section fbpc-checklist-section">
    ...
  </section>

  <SeoContent ... />

  <script type="module" src="/scripts/first-birthday-party-cost.js"></script>
</BaseLayout>
```

---

## 9. DOM ID 및 data 속성

### 9-1. 입력 요소

| 요소 | ID / selector | 비고 |
|---|---|---|
| 루트 | `[data-fbpc-root]` | 전체 컨테이너 |
| 지역 버튼 | `[data-fbpc-region]` | value: seoul/metro/majorCity/local |
| 유형 버튼 | `[data-fbpc-party-type]` | 프리셋 적용 |
| 하객 수 | `#fbpcGuestCount` | number |
| 보증 인원 | `#fbpcGuaranteedCount` | number |
| 1인 식대 | `#fbpcMealPrice` | number |
| 장소 패키지 | `#fbpcVenuePackageCost` | number |
| 스튜디오 등급 | `#fbpcStudioTier` | select |
| 행사 스냅 | `#fbpcEventSnapEnabled` | checkbox |
| 행사 스냅 비용 | `#fbpcEventSnapCost` | number |
| 아이 한복 | `#fbpcChildHanbokTier` | select |
| 부모 한복 | `#fbpcParentHanbokEnabled` | checkbox |
| 부모 한복 비용 | `#fbpcParentHanbokCost` | number |
| 돌상 등급 | `#fbpcDolTableTier` | select |
| 답례품 단가 | `#fbpcReplyGiftUnitPrice` | number |
| 답례품 수량 | `#fbpcReplyGiftCount` | number |
| 사회자·이벤트 | `#fbpcHostEventEnabled` | checkbox |
| 사회자·이벤트 비용 | `#fbpcHostEventCost` | number |
| 성장 영상 | `#fbpcGrowthVideoEnabled` | checkbox |
| 성장 영상 비용 | `#fbpcGrowthVideoCost` | number |
| 헤어메이크업 | `#fbpcHairMakeupEnabled` | checkbox |
| 헤어메이크업 비용 | `#fbpcHairMakeupCost` | number |
| 예비비율 | `#fbpcReserveRate` | number |
| 예상 축의금 | `#fbpcExpectedGiftMoney` | number |

### 9-2. 출력 요소

| 요소 | ID / selector | 표시 |
|---|---|---|
| 총비용 | `#fbpcTotalCost` | 만원 단위 |
| 식대 합계 | `#fbpcMealTotal` | 만원 단위 |
| 부대비용 | `#fbpcExtraTotal` | 만원 단위 |
| 순부담액 | `#fbpcNetCost` | 만원 단위 |
| 1인당 실비 | `#fbpcCostPerGuest` | 원 또는 만원 |
| 식대 기준 인원 | `#fbpcBillableGuestCount` | 명 |
| 결과 해석 | `#fbpcInterpretation` | 문장 |
| 경고 리스트 | `#fbpcWarnings` | ul |
| 비용 분해 | `[data-fbpc-breakdown]` | 비중 바 |
| 등급 비교 | `[data-fbpc-scenarios]` | 카드 3개 |
| 공유 버튼 | `#fbpcShareButton` | URL 복사 |

---

## 10. 클라이언트 스크립트 구조

파일: `public/scripts/first-birthday-party-cost.js`

### 10-1. 모듈 구조

```js
(function () {
  const state = { ...DEFAULT_INPUT_FROM_DATASET };

  function init() {}
  function bindEvents() {}
  function readInputState() {}
  function applyPreset(partyType) {}
  function calculate(input) {}
  function render(result) {}
  function renderBreakdown(items) {}
  function renderScenarios(items) {}
  function syncUrl() {}
  function restoreFromUrl() {}
  function copyShareUrl() {}

  document.addEventListener("DOMContentLoaded", init);
})();
```

### 10-2. 이벤트 규칙

- 모든 `input`, `change`, `click` 이벤트는 즉시 계산을 실행한다.
- 지역 변경은 금액을 자동 보정하지 않고 결과 계산에 multiplier만 적용한다.
- 유형 변경은 프리셋 기본값을 입력 필드에 실제로 반영한다.
- 사용자가 세부 금액을 직접 수정한 뒤 지역만 바꿔도 직접 입력값은 유지한다.
- 답례품 수량은 유형 프리셋 적용 시 하객 수 또는 보증 인원 기준으로 자동 세팅한다.
- URL 복원은 초기 렌더 전에 실행해 입력값 깜빡임을 줄인다.

---

## 11. URL 파라미터 설계

긴 키를 피하고 숫자는 원 단위로 저장한다.

| 파라미터 | 의미 |
|---|---|
| `region` | 지역 |
| `type` | 돌잔치 유형 |
| `guest` | 하객 수 |
| `guarantee` | 보증 인원 |
| `meal` | 1인 식대 |
| `venue` | 장소 패키지 |
| `studio` | 스튜디오 등급 |
| `snap` | 행사 스냅 사용 여부 |
| `childHanbok` | 아이 한복 등급 |
| `parentHanbok` | 부모 한복 사용 여부 |
| `dol` | 돌상 등급 |
| `giftUnit` | 답례품 단가 |
| `giftCount` | 답례품 수량 |
| `host` | 사회자 사용 여부 |
| `video` | 성장 영상 사용 여부 |
| `makeup` | 헤어메이크업 사용 여부 |
| `reserve` | 예비비율 |
| `money` | 예상 축의금 |

예시:

```text
/tools/first-birthday-party-cost/?region=metro&type=banquet&guest=60&guarantee=50&meal=65000&reserve=5
```

---

## 12. 스타일 설계

파일: `src/styles/scss/pages/_first-birthday-party-cost.scss`

### 12-1. 주요 클래스

```scss
.fbpc-page {}
.fbpc-shell {}
.fbpc-control-panel {}
.fbpc-result-panel {}
.fbpc-field-grid {}
.fbpc-segment-row {}
.fbpc-segment-button {}
.fbpc-option-card {}
.fbpc-kpi-grid {}
.fbpc-kpi-card {}
.fbpc-breakdown-list {}
.fbpc-breakdown-bar {}
.fbpc-scenario-grid {}
.fbpc-scenario-card {}
.fbpc-warning-list {}
.fbpc-checklist-grid {}
```

### 12-2. 레이아웃 규칙

- 모바일: 모든 입력과 결과 1열.
- 태블릿 이상: 입력 1열, 결과 1열이되 KPI는 2열.
- 데스크톱: `.fbpc-shell`은 `minmax(0, 1fr) 380px` 또는 `1fr 420px` 2열. 결과 패널을 오른쪽 sticky로 두되, 모바일에서는 sticky 해제.
- 입력 필드는 최소 높이를 고정해 토글 열림/닫힘 시 레이아웃 점프를 줄인다.
- 카드는 8px 이하 radius를 사용한다.
- 색상은 기존 육아·비용 계산기 톤과 맞추고, 한 색상 계열만 과도하게 쓰지 않는다.

---

## 13. SeoContent 구성

### 13-1. introTitle

```text
돌잔치 비용 비교 계산기 — 결과 읽는 법
```

### 13-2. intro

구현 시 4단락 모두 150자 이상으로 작성한다.

1. 돌잔치 비용은 식대, 보증 인원, 촬영, 한복, 돌상, 답례품이 함께 움직인다는 맥락.
2. 계산 방식은 보증 인원과 하객 수 중 큰 값을 식대 기준으로 잡고, 선택 옵션을 더하는 구조라는 설명.
3. 결과 해석은 총액보다 식대 비중, 부대비용 비중, 순부담액을 함께 봐야 한다는 안내.
4. 실제 견적은 지역·업체·패키지·부가세·봉사료·계약 조건에 따라 달라진다는 한계.

### 13-3. FAQ

`FIRST_BIRTHDAY_FAQ`는 6개 이상으로 둔다.

- 돌잔치 비용은 보통 얼마 정도 잡아야 하나요?
- 하객 수보다 보증 인원이 중요한 이유는 무엇인가요?
- 스튜디오 촬영과 행사 스냅은 둘 다 해야 하나요?
- 한복은 대여와 구매 중 무엇이 유리한가요?
- 돌잔치 답례품은 몇 개 준비해야 하나요?
- 축의금까지 고려하면 순부담액은 어떻게 계산하나요?

---

## 14. QA 체크리스트

### 14-1. 계산 QA

- [ ] 하객 수보다 보증 인원이 큰 경우 식대가 보증 인원 기준으로 계산된다.
- [ ] 보증 인원이 0인 셀프 파티룸은 하객 수 기준으로 계산된다.
- [ ] 토글이 꺼진 옵션 비용은 합산되지 않는다.
- [ ] 답례품 수량을 0으로 두면 답례품 비용이 0원이 된다.
- [ ] 예상 축의금이 총비용보다 커도 순부담액은 음수가 되지 않는다.
- [ ] 예비비율 0~20% 범위에서 정상 계산된다.
- [ ] 지역 변경 시 총액이 multiplier 기준으로 변한다.

### 14-2. UI QA

- [ ] 모바일 360px에서 입력 라벨과 버튼 텍스트가 넘치지 않는다.
- [ ] KPI 카드 숫자가 긴 경우에도 줄바꿈이 안정적이다.
- [ ] 비용 분해 바가 0원 항목에서 깨지지 않는다.
- [ ] 결과 패널 sticky가 데스크톱에서만 적용된다.
- [ ] 모든 입력은 키보드 접근이 가능하다.
- [ ] 버튼 활성 상태에 `aria-pressed`를 반영한다.

### 14-3. 콘텐츠 QA

- [ ] 사용자 facing 텍스트는 모두 한국어다.
- [ ] 추정값을 공식 평균처럼 표현하지 않는다.
- [ ] `InfoNotice`에 참고용 추정값, 실제 견적 차이, 계약 전 확인 항목을 명시한다.
- [ ] `SeoContent` intro 4단락과 FAQ 5개 이상 기준을 만족한다.
- [ ] 관련 링크가 3개 이상 연결된다.

### 14-4. 배포 QA

- [ ] `src/data/tools.ts` 등록
- [ ] `src/styles/app.scss` 등록
- [ ] `public/sitemap.xml` 등록
- [ ] `npm run build` 성공

---

## 15. 구현 순서

1. `src/data/firstBirthdayPartyCost.ts` 생성: 타입, 프리셋, FAQ, related, 계산 함수 초안.
2. `src/pages/tools/first-birthday-party-cost.astro` 생성: Hero, InfoNotice, 입력, 결과, SeoContent.
3. `public/scripts/first-birthday-party-cost.js` 생성: 상태 복원, 이벤트 바인딩, 계산, 렌더링, URL 공유.
4. `src/styles/scss/pages/_first-birthday-party-cost.scss` 생성: 모바일 우선 스타일.
5. `src/data/tools.ts`, `src/styles/app.scss`, `public/sitemap.xml` 등록.
6. `npm run build` 실행.
7. 필요 시 dev 서버와 브라우저에서 모바일/데스크톱 레이아웃 확인.

---

## 16. 구현 요청 프롬프트

```text
비교계산소(bigyocalc.com)에 `/tools/first-birthday-party-cost/` 경로로 "돌잔치 비용 비교 계산기"를 구현해줘.

기획 문서:
- `docs/plan/202606/first-birthday-party-cost-comparison-plan.md`

설계 문서:
- `docs/design/202606/first-birthday-party-cost-design.md`

필수 구현:
- 지역, 돌잔치 유형, 하객 수, 보증 인원, 1인 식대, 장소 패키지 입력
- 스튜디오 촬영, 행사 스냅, 아이 한복, 부모 한복, 돌상, 답례품, 사회자, 성장 영상, 헤어메이크업, 예비비, 예상 축의금 입력
- 총비용, 식대 합계, 부대비용, 순부담액, 1인당 실비 계산
- 비용 분해 비중 바와 소규모/일반/프리미엄 비교 카드
- URL 파라미터 공유
- InfoNotice와 SeoContent 기준 충족
- 사용자 facing 텍스트는 한국어만 사용

완료 전 `npm run build`를 반드시 통과시켜줘.
```
