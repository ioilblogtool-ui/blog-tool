# 자녀장려금 계산기 2026 설계 문서

> 기획 원문: `docs/plan/202606/child-incentive-calculator-2026.md`
> 작성일: 2026-06-22
> 콘텐츠 유형: `/tools/` 계산기
> 구현 기준: 2026년 자녀장려금 산정 공식(소득 감소구간), 재산 기준(2.4억/1.7억), 신청유형별 감액(기한 후 신청 5%)을 반영해 자녀별 예상 지급액을 계산한다.
> ⚠️ 산정 공식의 계수(2,100만 원, 80/4,900 등)는 보도자료 인용 추정치이므로 **구현 착수 전 국세청 홈택스 모의계산으로 반드시 재검증**한다.
> 근로장려금 계산기(`docs/design/202606/work-incentive-calculator-2026-design.md`)와 공유 데이터 모델(`incentiveCalculatorShared.ts`)을 사용한다. 그 문서를 먼저 구현한 뒤 이 문서를 진행하는 순서를 권장한다.

---

## 1. 문서 개요

- 구현 대상: `자녀장려금 계산기 2026`
- slug: `child-incentive-calculator`
- URL: `/tools/child-incentive-calculator/`
- 카테고리: 복지·지원금
- 핵심 검색 의도: `자녀장려금 계산기`, `자녀장려금 지급액`, `자녀 1명 2명 자녀장려금`, `자녀장려금 재산 기준`, `자녀장려금 기한 후 신청`
- 핵심 출력: 신청 가능 여부, 자녀 1인당 산정액, 자녀장려금 총액(기본), 재산·신청유형 감액 적용 후 최종 예상 지급액, 자녀 수별 비교
- 안전 문구: 모의계산 도구, 산정 공식은 매년 조정 가능
- 근로장려금 계산기와 강한 상호 CTA 필수 (거의 항상 함께 검색되는 키워드)

---

## 2. 구현 파일 구조

```text
src/
  data/
    incentiveCalculatorShared.ts   # 근로장려금 설계 문서에서 이미 생성됨 — 재사용
    childIncentiveCalculator.ts
  pages/
    tools/
      child-incentive-calculator.astro

public/
  scripts/
    incentive-calculator-shared.js  # 이미 생성됨 — 재사용
    child-incentive-calculator.js

src/styles/scss/pages/
  _child-incentive-calculator.scss
```

필수 등록:

- `src/data/tools.ts`
- `src/styles/app.scss`에 `@use 'scss/pages/child-incentive-calculator';`
- `public/sitemap.xml`
- `src/pages/index.astro`의 `topicBySlug`에 `복지·지원금` 카테고리 등록
- 근로장려금 계산기 `RELATED_WORK_INCENTIVE_LINKS`에 이 페이지 추가 (양방향)

---

## 3. 레이아웃 방향

- `SimpleToolShell` 기반.
- 근로장려금 계산기와 동일한 입력 그룹 패턴(`기본 정보`, `소득 정보`, `재산 정보`)을 사용해 사용자가 두 계산기를 오갈 때 낯설지 않게 한다.
- 자녀 수별 비교 표(1명/2명/3명)를 결과 영역에서 강조 — 이 페이지만의 차별 포인트.
- SCSS prefix: `cic-`
- pageClass: `cic-page`
- resultFirst: `false`

```astro
<SimpleToolShell calculatorId="child-incentive-calculator" pageClass="cic-page" resultFirst={false}>
```

---

## 4. 페이지 IA

1. Hero
2. InfoNotice
3. 빠른 프리셋 (자녀 1명/2명/3명)
4. 계산기 입력 영역
5. 결과 KPI 카드
6. 자녀 수별 비교 표
7. 감액 적용 해석 카드
8. 근로장려금 계산기 CTA (강조)
9. FAQ
10. SeoContent

---

## 5. 데이터 모델 — `childIncentiveCalculator.ts`

```ts
import type { IncentiveHouseholdType, IncentiveAssetInput, ApplicationTimingId } from "./incentiveCalculatorShared";

export interface ChildIncentiveInput {
  householdType: IncentiveHouseholdType;
  totalIncome: number;
  childCount: number;
  applicationTiming: ApplicationTimingId;
  asset: IncentiveAssetInput;
}

export interface ChildIncentiveResult {
  totalIncome: number;
  incomeEligible: boolean;
  perChildBaseAmount: number;
  baseAmount: number; // perChildBaseAmount * childCount
  assetTierLabel: string;
  assetReductionRate: number;
  afterAssetAmount: number;
  timingReductionRate: number;
  finalAmount: number;
  interpretation: string;
  warnings: string[];
}

export interface ChildCountComparisonRow {
  childCount: number;
  finalAmount: number;
}

export interface ChildIncentivePreset {
  id: string;
  label: string;
  summary: string;
  input: Partial<ChildIncentiveInput>;
}

export interface ChildIncentiveFaq {
  question: string;
  answer: string;
}
```

---

## 6. 기준 상수 (⚠️ 추정값 — 구현 전 재검증 필수)

```ts
export const CHILD_INCENTIVE_2026 = {
  incomeLimit: 70_000_000, // 부부합산 소득 상한
  fullAmountIncomeCeiling: 21_000_000, // 이 소득까지는 자녀 1인당 최대 100만원
  maxPerChild: 1_000_000,
  minPerChild: 500_000,
  // 감소구간 공식: maxPerChild - (totalIncome - fullAmountIncomeCeiling) * decreaseNumerator / decreaseDenominator
  decreaseNumerator: 80,
  decreaseDenominator: 4_900,
};
```

검증 메모: 검색된 보도자료는 홑벌이가구 기준 공식만 제공했다. 단독가구·맞벌이가구에 동일 공식이 적용되는지, 계수가 가구유형별로 다른지는 **국세청 홈택스 모의계산으로 가구유형별 샘플 3건 이상 대조 검증** 후 확정한다. 검증 전까지는 가구유형 구분 없이 동일 공식을 적용하는 것으로 구현하고, UI에 "가구유형별 정확한 차이는 홈택스에서 확인하세요" 안내를 추가한다.

---

## 7. 계산 로직

### 7-1. 자녀 1인당 기본 산정액

```text
if (totalIncome <= fullAmountIncomeCeiling) {
  perChildBaseAmount = maxPerChild  // 100만원
} else if (totalIncome >= incomeLimit) {
  perChildBaseAmount = 0  // 소득 기준 초과
} else {
  perChildBaseAmount = maxPerChild - (totalIncome - fullAmountIncomeCeiling) * decreaseNumerator / decreaseDenominator
  perChildBaseAmount = clamp(perChildBaseAmount, minPerChild, maxPerChild)
}
```

### 7-2. 자녀장려금 총액(기본)

```text
baseAmount = perChildBaseAmount * childCount
```

### 7-3. 재산·신청유형 감액 (근로장려금과 동일 공유 로직)

```ts
import { sumIncentiveAssets, evaluateAssetTier, APPLICATION_TIMING_REDUCTION } from "./incentiveCalculatorShared";

const totalAsset = sumIncentiveAssets(input.asset);
const assetResult = evaluateAssetTier(totalAsset);
const afterAssetAmount = baseAmount * (1 - assetResult.reductionRate);
const finalAmount = afterAssetAmount * (1 - APPLICATION_TIMING_REDUCTION[input.applicationTiming]);
```

### 7-4. 자녀 수별 비교 표

```text
for (count of [1, 2, 3]) {
  perChild = perChildBaseAmount (소득에 따라 동일)
  rowFinalAmount = perChild * count * (1 - assetReductionRate) * (1 - timingReductionRate)
}
```

현재 입력한 `childCount` 행은 강조 표시.

### 7-5. 해석 문구

```text
부부합산 총소득 {totalIncome}원 기준으로 자녀 1인당 산정액은 {perChildBaseAmount}원입니다.
자녀 {childCount}명 기준 기본 산정액은 {baseAmount}원입니다.
{assetReductionRate > 0 ? "재산 합계가 1.7억~2.4억 구간에 해당해 50% 감액이 적용됐습니다." : ""}
{applicationTiming === "late" ? "기한 후 신청으로 5% 추가 감액이 적용됐습니다." : ""}
최종 예상 지급액은 {finalAmount}원입니다.
```

---

## 8. 프리셋

```ts
export const CHILD_INCENTIVE_PRESETS: ChildIncentivePreset[] = [
  {
    id: "one-child",
    label: "자녀 1명·소득 3,000만 원",
    summary: "기본 케이스",
    input: { childCount: 1, totalIncome: 30_000_000, applicationTiming: "regular" },
  },
  {
    id: "two-children",
    label: "자녀 2명·소득 4,000만 원",
    summary: "다자녀 가구 예시",
    input: { childCount: 2, totalIncome: 40_000_000, applicationTiming: "regular" },
  },
  {
    id: "three-children-late",
    label: "자녀 3명·기한 후 신청",
    summary: "다자녀 + 기한 후 신청 감액 예시",
    input: { childCount: 3, totalIncome: 35_000_000, applicationTiming: "late" },
  },
];
```

---

## 9. 화면 상세 설계

### 9-1. Hero

- eyebrow: `복지·지원금`
- title: `자녀장려금 계산기 2026`
- description: `부부합산 소득, 자녀 수, 재산을 입력하면 2026년 기준 자녀별 예상 지급액을 계산합니다.`

### 9-2. 결과 KPI

| 카드 | 예시 |
|---|---:|
| 최종 예상 지급액 | 1,800,000원 |
| 자녀 1인당 산정액 | 900,000원 |
| 자녀 수 | 2명 |
| 감액 적용 | 재산 50% |

### 9-3. 자녀 수별 비교 표

| 자녀 수 | 예상 지급액 |
|---|---:|
| 1명 | 900,000원 |
| **2명(입력값)** | **1,800,000원** |
| 3명 | 2,700,000원 |

### 9-4. 근로장려금 CTA (강조 배치)

결과 바로 아래, FAQ 이전에 배치:

```text
근로장려금도 같이 받을 수 있을까요? 근로장려금 계산기에서 같은 조건으로 바로 확인해보세요.
```

---

## 10. SeoContent 본문 설계

### 10-1. intro

```text
자녀장려금은 18세 미만 부양자녀를 둔 가구의 양육 부담을 줄이기 위해 국세청이 지급하는 장려금입니다. 부부합산 총소득이 7,000만 원 미만이면 신청할 수 있고, 자녀 1인당 최소 50만 원에서 최대 100만 원까지 지급됩니다.

지급액은 소득이 낮을수록 자녀 1인당 최대 100만 원에 가깝고, 소득이 7,000만 원에 가까워질수록 점차 줄어드는 구조입니다. 자녀가 2명, 3명이면 1인당 산정액에 자녀 수를 곱해 총액이 정해집니다.

재산 기준은 근로장려금과 동일합니다. 재산 합계가 2.4억 원 이상이면 신청이 어렵고, 1.7억 원 이상 2.4억 원 미만이면 산정액의 50%만 지급됩니다. 신청 기한을 놓쳐 기한 후 신청(6/2~12/1)을 하면 산정액의 95%만 지급됩니다.

자녀장려금은 근로장려금과 별도로 산정되지만 동시에 신청할 수 있습니다. 두 장려금을 모두 받을 수 있는지 궁금하다면 근로장려금 계산기에서 같은 조건으로 함께 확인해보세요.
```

### 10-2. criteria

- 부부합산 소득 7,000만 원 미만
- 18세 미만 부양자녀 기준
- 자녀 1인당 50만~100만 원, 소득에 따라 감소
- 재산 2.4억/1.7억 감액 기준, 기한 후 신청 5% 감액

---

## 11. FAQ

```ts
export const CHILD_INCENTIVE_FAQ: ChildIncentiveFaq[] = [
  {
    question: "자녀장려금은 자녀 1명당 얼마인가요?",
    answer: "소득에 따라 자녀 1인당 최소 50만 원에서 최대 100만 원까지 지급됩니다. 소득이 낮을수록 최대 금액에 가깝습니다.",
  },
  {
    question: "자녀 3명이면 최대 얼마까지 받나요?",
    answer: "자녀 1인당 최대 100만 원이므로, 자녀 3명이면 이론상 최대 300만 원까지 받을 수 있습니다.",
  },
  {
    question: "집이 있으면 자녀장려금을 못 받나요?",
    answer: "재산 합계가 2.4억 원 미만이면 신청할 수 있습니다. 다만 1.7억 원 이상 2.4억 원 미만이면 산정액의 50%만 지급됩니다.",
  },
  {
    question: "근로장려금과 같이 받을 수 있나요?",
    answer: "네. 자녀장려금과 근로장려금은 별도로 산정되어 동시에 신청할 수 있습니다.",
  },
  {
    question: "자녀가 만 18세가 넘으면 어떻게 되나요?",
    answer: "자녀장려금은 만 18세 미만 부양자녀를 기준으로 하므로, 18세가 넘으면 해당 자녀는 산정 대상에서 제외됩니다.",
  },
  {
    question: "기한 후 신청하면 얼마나 깎이나요?",
    answer: "기한 후 신청(6월 2일~12월 1일)은 산정액의 95%만 지급되어 5% 감액이 적용됩니다.",
  },
];
```

---

## 12. 관련 링크 / CTA

```ts
export const RELATED_CHILD_INCENTIVE_LINKS = [
  { href: "/tools/work-incentive-calculator/", label: "근로장려금 계산기", description: "같은 조건으로 근로장려금도 함께 계산하세요." },
  { href: "/tools/welfare-benefit-eligibility/", label: "복지급여 수급 자격 계산기", description: "다른 복지급여 가능성도 점검하세요." },
];
```

---

## 13. 스타일 설계

SCSS 파일: `src/styles/scss/pages/_child-incentive-calculator.scss`

```scss
.cic-page {}
.cic-presets {}
.cic-form-grid {}
.cic-result-grid {}
.cic-kpi-card {}
.cic-child-count-table {}
.cic-child-count-table__row--active {}
.cic-reduction-card {}
.cic-cta-card {}
```

근로장려금 계산기(`wic-`)와 시각적 통일감을 유지하되, `.cic-child-count-table__row--active`로 자녀 수 비교 표의 현재 입력 행을 강조하는 것이 이 페이지의 핵심 차별 UI다.

---

## 14. 클라이언트 스크립트 설계

파일: `public/scripts/child-incentive-calculator.js` (공유 로직은 `incentive-calculator-shared.js` 재사용)

### 14-1. 주요 함수

```js
function calculatePerChildAmount(totalIncome) {}
function buildChildCountComparison(perChildAmount, assetReductionRate, timingReductionRate) {}
function calculateChildIncentive(input) {}
function renderResult(result) {}
function renderComparisonTable(rows, activeChildCount) {}
function applyPreset(presetId) {}
function bindEvents() {}
```

---

## 15. 검증 케이스

| 케이스 | 입력 | 기대 |
|---|---|---|
| 최대 지급 | totalIncome 20,000,000 | perChildBaseAmount = 1,000,000 |
| 감소구간 중간 | totalIncome 40,000,000 | perChildBaseAmount = 1,000,000 - (40,000,000-21,000,000)*80/4,900 (clamp 50만~100만) |
| 소득 초과 | totalIncome 71,000,000 | perChildBaseAmount 0, 신청불가 |
| 자녀 2명 | childCount 2 | baseAmount = perChildBaseAmount × 2 |
| 재산 50% 감액 | totalAsset 200,000,000 | afterAssetAmount = baseAmount × 0.5 |
| 기한후 신청 | applicationTiming "late" | finalAmount = afterAssetAmount × 0.95 |
| 자녀 수 비교 표 | childCount 2 | 1명/2명/3명 행 모두 같은 perChildAmount 기준으로 비례 |

---

## 16. SEO / 메타

```ts
const pageTitle = "자녀장려금 계산기 2026";
const metaTitle = "자녀장려금 계산기 2026 - 자녀 1명·2명 예상 지급액";
const metaDescription =
  "2026년 기준 자녀장려금 계산기로 부부합산 소득, 자녀 수, 재산을 입력해 자녀별 예상 지급액과 감액 여부를 확인하세요.";
```

---

## 17. 안전 / 정책 표현

반드시 사용: `예상`, `모의계산`, `확인 필요`, `홈택스 확인`
피해야 할 표현: `지급 확정`, `정확한 지급액`

결과 상단 배지: `2026년 기준 · 모의계산 · 홈택스 확인 필요`

---

## 18. 구현 체크리스트

- [ ] `incentiveCalculatorShared.ts` (근로장려금 작업에서 생성된 것 재사용, 없으면 먼저 생성)
- [ ] `src/data/childIncentiveCalculator.ts` 생성
- [ ] **국세청 공식 자료로 감소구간 공식 계수 재검증** (가장 중요)
- [ ] `src/pages/tools/child-incentive-calculator.astro` 생성
- [ ] `public/scripts/child-incentive-calculator.js` 생성 (공유 스크립트 재사용)
- [ ] `src/styles/scss/pages/_child-incentive-calculator.scss` 생성
- [ ] `src/styles/app.scss`, `src/data/tools.ts`, `public/sitemap.xml` 등록
- [ ] `src/pages/index.astro` topicBySlug 등록
- [ ] 근로장려금 계산기 `RELATED_WORK_INCENTIVE_LINKS`에 이 페이지 추가 (양방향 CTA)
- [ ] `npm run build` 성공
- [ ] 검증 케이스 전체 확인

---

## 19. 후속 확장

- 근로장려금 + 자녀장려금 통합 결과 요약 컴포넌트 (둘 다 계산 시 합산 총액 표시)
- `/reports/work-child-incentive-late-application-2026/` 기한 후 신청 가이드 리포트와 연결
- 정부지원금 통합 조회 페이지의 첫 두 구성요소로 활용
