# 근로장려금 계산기 2026 설계 문서

> 기획 원문: `docs/plan/202606/work-incentive-calculator-2026.md`
> 작성일: 2026-06-22
> 콘텐츠 유형: `/tools/` 계산기
> 구현 기준: 2026년 근로장려금 산정표(점증/평탄/점감 구간), 재산 기준(2.4억/1.7억), 신청유형별 감액(기한 후 신청 5%)을 반영해 예상 지급액을 계산한다.
> ⚠️ 산정 구간 경계값과 점감 기울기는 추정치이므로 **구현 착수 전 국세청 홈택스 "근로·자녀장려금 모의계산" 또는 국세청 공식 보도자료로 반드시 재검증**한다. 잘못된 금액 노출은 신뢰도 리스크가 크다.

---

## 1. 문서 개요

- 구현 대상: `근로장려금 계산기 2026`
- slug: `work-incentive-calculator`
- URL: `/tools/work-incentive-calculator/`
- 카테고리: 복지·지원금
- 핵심 검색 의도: `근로장려금 계산기`, `근로장려금 지급액`, `근로장려금 기한 후 신청`, `근로장려금 재산 기준`, `근로장려금 맞벌이`
- 핵심 출력: 신청 가능 여부, 기본 산정액, 재산 감액 적용 후 금액, 신청유형 감액 적용 후 최종 예상 지급액, 산정 구간 표시
- 안전 문구: 이 계산기는 실제 지급 확정 도구가 아니라 국세청 공식 산정표를 바탕으로 한 모의계산 도구다. 산정표는 매년 조정될 수 있다.
- 자녀장려금 계산기(`docs/design/202606/child-incentive-calculator-2026-design.md`)와 가구유형·재산 입력 데이터 구조를 공유한다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    incentiveCalculatorShared.ts        # 근로·자녀장려금 공유 타입/상수 (가구유형, 재산 항목)
    workIncentiveCalculator.ts
  pages/
    tools/
      work-incentive-calculator.astro

public/
  scripts/
    work-incentive-calculator.js
    incentive-calculator-shared.js      # 가구유형 판정, 재산 합계, 감액 적용 공통 함수

src/styles/scss/pages/
  _work-incentive-calculator.scss
```

필수 등록:

- `src/data/tools.ts`
- `src/styles/app.scss`에 `@use 'scss/pages/work-incentive-calculator';`
- `public/sitemap.xml`

선택 등록:

- `src/pages/index.astro`의 `topicBySlug`에 `복지·지원금` 카테고리로 등록
- 자녀장려금 계산기와 상호 CTA
- OG 이미지 생성 대상: `public/og/tools/work-incentive-calculator.png`

---

## 3. 공유 데이터 모델 — `incentiveCalculatorShared.ts`

근로장려금·자녀장려금이 공통으로 쓰는 가구유형·재산 입력 구조를 먼저 분리한다.

```ts
export type IncentiveHouseholdType = "single" | "single-earner" | "dual-earner";
export type ApplicationTimingId = "regular" | "late";
export type AssetTierId = "under-170m" | "170m-240m" | "over-240m";

export interface IncentiveAssetInput {
  housing: number;
  deposit: number; // 전세금·임차보증금
  savings: number; // 예금·적금
  securities: number; // 주식·증권
  vehicle: number;
  other: number;
}

export interface IncentiveAssetResult {
  totalAsset: number;
  tier: AssetTierId;
  tierLabel: string;
  reductionRate: number; // 0, 0.5
}

export const INCENTIVE_HOUSEHOLD_TYPES: { id: IncentiveHouseholdType; label: string; description: string }[] = [
  { id: "single", label: "단독가구", description: "배우자, 18세 미만 부양자녀, 70세 이상 직계존속이 모두 없는 가구" },
  { id: "single-earner", label: "홑벌이가구", description: "배우자(총급여 300만 원 미만) 또는 부양자녀 또는 70세 이상 직계존속이 있는 가구" },
  { id: "dual-earner", label: "맞벌이가구", description: "신청인과 배우자 각각의 총급여가 300만 원 이상인 가구" },
];

export const INCENTIVE_ASSET_THRESHOLDS = {
  reductionStart: 170_000_000, // 1.7억
  eligibilityLimit: 240_000_000, // 2.4억
};

export function sumIncentiveAssets(input: IncentiveAssetInput): number {
  return input.housing + input.deposit + input.savings + input.securities + input.vehicle + input.other;
}

export function evaluateAssetTier(totalAsset: number): IncentiveAssetResult {
  if (totalAsset >= INCENTIVE_ASSET_THRESHOLDS.eligibilityLimit) {
    return { totalAsset, tier: "over-240m", tierLabel: "신청 불가(2.4억 이상)", reductionRate: 0 };
  }
  if (totalAsset >= INCENTIVE_ASSET_THRESHOLDS.reductionStart) {
    return { totalAsset, tier: "170m-240m", tierLabel: "50% 감액 구간(1.7억~2.4억)", reductionRate: 0.5 };
  }
  return { totalAsset, tier: "under-170m", tierLabel: "감액 없음(1.7억 미만)", reductionRate: 0 };
}

export const APPLICATION_TIMING_REDUCTION: Record<ApplicationTimingId, number> = {
  regular: 0,
  late: 0.05, // 기한 후 신청 5% 감액 (95% 지급)
};
```

---

## 4. 레이아웃 방향

- `SimpleToolShell` 기반 계산기 페이지.
- 입력 영역은 `기본 정보`, `소득 정보`, `재산 정보` 3개 그룹.
- 결과는 KPI 4개(최종 예상 지급액, 기본 산정액, 적용 구간, 감액 여부)를 상단에 먼저 노출.
- 감액 두 종류(재산/신청유형)는 별도 카드에서 "왜 줄었는지" 명확히 해석.
- SCSS prefix: `wic-`
- pageClass: `wic-page`
- resultFirst: `false`

```astro
<SimpleToolShell calculatorId="work-incentive-calculator" pageClass="wic-page" resultFirst={false}>
```

---

## 5. 페이지 IA

1. Hero
2. InfoNotice (모의계산 고지, 산정표 매년 갱신 고지, 기한 후 신청 5% 감액 vs 재산 50% 감액 구분 강조)
3. 빠른 프리셋 (단독/홑벌이/맞벌이 대표 케이스)
4. 계산기 입력 영역
5. 결과 KPI 카드
6. 감액 적용 해석 카드
7. 가구유형별 소득·재산 기준표
8. 신청 기간 타임라인(반기/정기/기한 후)
9. 자녀장려금 계산기 CTA
10. FAQ
11. SeoContent

---

## 6. 데이터 모델 — `workIncentiveCalculator.ts`

```ts
import type { IncentiveHouseholdType, IncentiveAssetInput, ApplicationTimingId } from "./incentiveCalculatorShared";

export type IncomeBandId = "increasing" | "flat" | "decreasing" | "over-limit";

export interface WorkIncentiveBandTable {
  householdType: IncentiveHouseholdType;
  incomeLimit: number; // 소득 상한
  increasingEnd: number; // 점증구간 종료 소득
  flatEnd: number; // 평탄구간 종료 소득
  maxAmount: number; // 최대 지급액
}

export interface WorkIncentiveInput {
  householdType: IncentiveHouseholdType;
  applicantIncome: number;
  spouseIncome: number;
  useDirectTotalIncome: boolean;
  totalIncome: number;
  applicationTiming: ApplicationTimingId;
  asset: IncentiveAssetInput;
}

export interface WorkIncentiveResult {
  totalIncome: number;
  incomeEligible: boolean;
  band: IncomeBandId;
  bandLabel: string;
  baseAmount: number;
  assetTierLabel: string;
  assetReductionRate: number;
  afterAssetAmount: number;
  timingReductionRate: number;
  finalAmount: number;
  interpretation: string;
  warnings: string[];
}

export interface WorkIncentivePreset {
  id: string;
  label: string;
  summary: string;
  input: Partial<WorkIncentiveInput>;
}

export interface WorkIncentiveFaq {
  question: string;
  answer: string;
}
```

---

## 7. 기준 상수 (⚠️ 추정값 — 구현 전 재검증 필수)

```ts
export const WORK_INCENTIVE_BANDS_2026: WorkIncentiveBandTable[] = [
  { householdType: "single", incomeLimit: 22_000_000, increasingEnd: 4_000_000, flatEnd: 9_000_000, maxAmount: 1_650_000 },
  { householdType: "single-earner", incomeLimit: 32_000_000, increasingEnd: 7_000_000, flatEnd: 14_000_000, maxAmount: 2_850_000 },
  { householdType: "dual-earner", incomeLimit: 44_000_000, increasingEnd: 8_000_000, flatEnd: 17_000_000, maxAmount: 3_300_000 },
];
```

검증 메모: `increasingEnd`/`flatEnd`는 다수 보도자료 기준 추정치이며, 일부 매체는 맞벌이 점증구간 종료를 400만 원으로 보도하기도 했다. 점감구간의 정확한 기울기(소득 1만 원 증가당 감액 비율)는 `(maxAmount) / (incomeLimit - flatEnd)`로 선형 감소한다고 가정했으나, 실제로는 구간이 더 세분화되어 있을 수 있다. **반드시 국세청 모의계산 결과 3~5개 샘플과 대조해 기울기를 보정**한다.

---

## 8. 계산 로직

### 8-1. 가구유형 자동 판정 보조

UI에서는 사용자가 직접 가구유형을 선택하도록 하되, 배우자 소득 입력 시 참고 안내를 제공한다.

```text
배우자 소득이 300만 원 이상이면 "맞벌이가구가 맞는지 확인해보세요" 안내 표시
```

### 8-2. 총소득 계산

```text
총소득 =
  직접 입력 모드이면 totalIncome
  아니면 applicantIncome + spouseIncome
```

### 8-3. 소득 기준 충족 여부

```text
incomeEligible = 총소득 < bandTable[householdType].incomeLimit
```

### 8-4. 기본 산정액 (점증→평탄→점감)

```text
band = bandTable[householdType]

if (총소득 >= band.incomeLimit) {
  baseAmount = 0
  bandLabel = "소득 기준 초과"
} else if (총소득 <= band.increasingEnd) {
  // 점증구간: 0에서 maxAmount까지 선형 증가
  baseAmount = band.maxAmount * (총소득 / band.increasingEnd)
  bandLabel = "점증구간"
} else if (총소득 <= band.flatEnd) {
  // 평탄구간: 최대 지급액 고정
  baseAmount = band.maxAmount
  bandLabel = "평탄구간(최대 지급)"
} else {
  // 점감구간: maxAmount에서 0까지 선형 감소
  const ratio = (band.incomeLimit - 총소득) / (band.incomeLimit - band.flatEnd)
  baseAmount = band.maxAmount * ratio
  bandLabel = "점감구간"
}
```

보정:

- `increasingEnd`가 0이면 0으로 나누는 오류를 방지하기 위해 점증구간을 건너뛰고 평탄구간 로직으로 처리.
- `baseAmount`는 항상 0 이상, `maxAmount` 이하로 clamp.
- 1,000원 단위로 round.

### 8-5. 재산 감액

```ts
import { sumIncentiveAssets, evaluateAssetTier } from "./incentiveCalculatorShared";

const totalAsset = sumIncentiveAssets(input.asset);
const assetResult = evaluateAssetTier(totalAsset);
// assetResult.tier === "over-240m" 이면 전체 신청 불가 처리
const afterAssetAmount = baseAmount * (1 - assetResult.reductionRate);
```

### 8-6. 신청유형 감액

```ts
import { APPLICATION_TIMING_REDUCTION } from "./incentiveCalculatorShared";

const timingReductionRate = APPLICATION_TIMING_REDUCTION[input.applicationTiming];
const finalAmount = afterAssetAmount * (1 - timingReductionRate);
```

### 8-7. 해석 문구 생성

```text
입력한 조건 기준으로 {householdTypeLabel} 소득 {totalIncome}원은 {bandLabel}에 해당해 기본 산정액은 {baseAmount}원입니다.
재산 합계 {totalAsset}원은 {assetTierLabel}에 해당해 {assetReductionRate > 0 ? "50% 감액이 적용됐습니다" : "감액이 적용되지 않았습니다"}.
{applicationTiming === "late" ? "기한 후 신청으로 5% 추가 감액이 적용되어" : ""} 최종 예상 지급액은 {finalAmount}원입니다.
```

### 8-8. 신청 불가 처리

```text
if (!incomeEligible || assetResult.tier === "over-240m") {
  finalAmount = 0
  경고 문구: "소득 또는 재산 기준을 초과해 신청이 어려울 것으로 예상됩니다. 정확한 판단은 홈택스에서 확인하세요."
}
```

---

## 9. 프리셋

```ts
export const WORK_INCENTIVE_PRESETS: WorkIncentivePreset[] = [
  {
    id: "single-low",
    label: "단독가구·연 1,200만 원",
    summary: "1인 가구 평탄구간 예시",
    input: { householdType: "single", applicantIncome: 12_000_000, applicationTiming: "regular" },
  },
  {
    id: "single-earner-mid",
    label: "홑벌이가구·연 2,400만 원",
    summary: "외벌이 가구 점감구간 예시",
    input: { householdType: "single-earner", applicantIncome: 24_000_000, applicationTiming: "regular" },
  },
  {
    id: "dual-earner-late",
    label: "맞벌이가구·기한 후 신청",
    summary: "맞벌이 + 기한 후 신청 감액 예시",
    input: { householdType: "dual-earner", applicantIncome: 18_000_000, spouseIncome: 12_000_000, applicationTiming: "late" },
  },
];
```

---

## 10. 화면 상세 설계

### 10-1. Hero

- eyebrow: `복지·지원금`
- title: `근로장려금 계산기 2026`
- description: `가구유형, 총소득, 재산을 입력하면 2026년 기준 예상 지급액과 기한 후 신청 시 감액 여부를 계산합니다.`

### 10-2. InfoNotice

- `이 계산기는 국세청 근로장려금 산정표를 바탕으로 한 모의계산입니다. 실제 지급액은 홈택스 심사 결과에 따라 달라질 수 있습니다.`
- `기한 후 신청(6/2~12/1)은 산정액의 95%만 지급됩니다. 재산 1.7억~2.4억 구간 50% 감액과는 별도로 적용됩니다.`
- `산정표 구간과 금액은 매년 조정되므로 이 페이지는 2026년 기준으로 갱신된 내용입니다.`

### 10-3. 결과 KPI

| 카드 | 예시 |
|---|---:|
| 최종 예상 지급액 | 1,650,000원 |
| 기본 산정액 | 1,650,000원 |
| 적용 구간 | 평탄구간(최대 지급) |
| 감액 적용 | 없음 |

### 10-4. 감액 해석 카드

```text
재산 감액: 재산 합계 1.9억 원은 1.7억~2.4억 구간에 해당해 산정액의 50%만 지급됩니다.
신청유형 감액: 기한 후 신청으로 산정액의 5%가 추가로 줄어듭니다.
```

### 10-5. 기준표

가구유형별 소득 상한·재산 기준·최대 지급액을 표로 제공. 현재 입력에 해당하는 행은 강조.

### 10-6. 신청 기간 타임라인

```text
반기 신청(2025년 하반기분): 2026.03.01~03.16
정기 신청: 2026.05.01~06.01 (전액 지급)
기한 후 신청: 2026.06.02~12.01 (95% 지급)
```

---

## 11. SeoContent 본문 설계

### 11-1. intro

```text
근로장려금은 일은 하지만 소득이 낮은 가구의 생활을 지원하기 위해 국세청이 지급하는 장려금입니다. 가구유형(단독·홑벌이·맞벌이)에 따라 소득 기준과 최대 지급액이 다르며, 지급액은 소득 구간에 따라 점증→평탄→점감 구조로 계산됩니다.

2026년 정기 신청은 5월 1일부터 6월 1일까지였고, 이 기간을 놓쳤다면 6월 2일부터 12월 1일까지 기한 후 신청이 가능합니다. 다만 기한 후 신청은 산정액의 95%만 지급되어 5% 감액이 적용됩니다.

재산 기준도 함께 봐야 합니다. 가구원 재산 합계가 2.4억 원 이상이면 신청이 어렵고, 1.7억 원 이상 2.4억 원 미만이면 산정액의 50%만 지급됩니다. 이 계산기는 가구유형, 소득, 재산을 입력해 두 가지 감액을 모두 반영한 예상 지급액을 계산합니다.

산정표의 구간 경계값과 최대 지급액은 매년 조정될 수 있어, 이 페이지는 2026년 기준으로 갱신된 내용입니다. 정확한 최종 지급액은 국세청 홈택스 모의계산 또는 실제 심사 결과로 확인해야 합니다.
```

### 11-2. criteria

- 가구유형별 소득 상한과 산정 구간 기준
- 재산 2.4억/1.7억 감액 기준
- 기한 후 신청 5% 감액 기준
- 산정표는 매년 조정될 수 있어 실제 신청 시 홈택스 확인 필요

---

## 12. FAQ

```ts
export const WORK_INCENTIVE_FAQ: WorkIncentiveFaq[] = [
  {
    question: "근로장려금 신청 기한을 놓쳤어요, 지금도 신청 가능한가요?",
    answer: "네. 정기 신청 기간(5/1~6/1)이 지났어도 6월 2일부터 12월 1일까지 기한 후 신청이 가능합니다. 다만 산정액의 95%만 지급되어 5% 감액이 적용됩니다.",
  },
  {
    question: "집이 있으면 근로장려금을 못 받나요?",
    answer: "재산 합계가 2.4억 원 미만이면 신청할 수 있습니다. 다만 1.7억 원 이상 2.4억 원 미만이면 산정액의 50%만 지급됩니다.",
  },
  {
    question: "전세금도 재산에 포함되나요?",
    answer: "네. 재산 합계에는 주택, 전세금·임차보증금, 예금, 주식·증권, 자동차 등이 포함됩니다.",
  },
  {
    question: "맞벌이 부부는 둘 다 신청할 수 있나요?",
    answer: "근로장려금은 가구 단위로 1건만 신청할 수 있습니다. 맞벌이가구는 신청인과 배우자 각각의 총급여가 300만 원 이상인 경우를 말하며, 소득 상한이 더 높게 적용됩니다.",
  },
  {
    question: "근로장려금과 자녀장려금을 같이 받을 수 있나요?",
    answer: "네. 두 장려금은 별도로 산정되어 동시에 신청할 수 있습니다. 자녀장려금 계산기에서 추가로 확인해보세요.",
  },
  {
    question: "계산 결과와 실제 지급액이 다른 이유는 무엇인가요?",
    answer: "산정표의 소득 구간과 최대 지급액은 매년 조정될 수 있고, 실제 소득·재산 심사 결과나 가구원 구성에 따라 달라질 수 있습니다. 정확한 금액은 국세청 홈택스에서 확인하세요.",
  },
];
```

---

## 13. 관련 링크 / CTA

```ts
export const RELATED_WORK_INCENTIVE_LINKS = [
  { href: "/tools/child-incentive-calculator/", label: "자녀장려금 계산기", description: "자녀가 있다면 자녀장려금도 함께 계산하세요." },
  { href: "/tools/salary/", label: "연봉 실수령액 계산기", description: "내 소득 기준을 다시 확인하세요." },
  { href: "/tools/welfare-benefit-eligibility/", label: "복지급여 수급 자격 계산기", description: "다른 복지급여 가능성도 점검하세요." },
];
```

---

## 14. 스타일 설계

SCSS 파일: `src/styles/scss/pages/_work-incentive-calculator.scss`

```scss
.wic-page {}
.wic-presets {}
.wic-form-grid {}
.wic-input-group {}
.wic-result-grid {}
.wic-kpi-card {}
.wic-reduction-card {}
.wic-band-table {}
.wic-timeline {}
.wic-related-grid {}
```

반응형: 768px 이하 입력 1열, KPI 카드 2열. 480px 이하 전체 1열. 기준표는 `overflow-x: auto`.

---

## 15. 클라이언트 스크립트 설계

파일: `public/scripts/work-incentive-calculator.js` (+ 공유 로직 `public/scripts/incentive-calculator-shared.js`)

### 15-1. 주요 함수

```js
function sumAssets(input) {}
function evaluateAssetTier(totalAsset) {}
function getBandTable(householdType) {}
function calculateBaseAmount(totalIncome, band) {}
function calculateWorkIncentive(input) {}
function renderResult(result) {}
function applyPreset(presetId) {}
function bindEvents() {}
```

`sumAssets`, `evaluateAssetTier`는 자녀장려금 스크립트와 공유하므로 `incentive-calculator-shared.js`에 분리한다.

---

## 16. 검증 케이스

| 케이스 | 입력 | 기대 |
|---|---|---|
| 단독 점증구간 | single, income 2,000,000 | maxAmount × (200/400) |
| 단독 평탄구간 | single, income 6,000,000 | maxAmount(1,650,000) |
| 단독 점감구간 | single, income 18,000,000 | maxAmount × (22,000,000-18,000,000)/(22,000,000-9,000,000) |
| 소득 초과 | single, income 23,000,000 | baseAmount 0, "소득 기준 초과" |
| 재산 50% 감액 | totalAsset 190,000,000 | afterAssetAmount = baseAmount × 0.5 |
| 재산 신청불가 | totalAsset 250,000,000 | finalAmount 0, 신청불가 경고 |
| 기한후 신청 | applicationTiming "late" | finalAmount = afterAssetAmount × 0.95 |

---

## 17. SEO / 메타

```ts
const pageTitle = "근로장려금 계산기 2026";
const metaTitle = "근로장려금 계산기 2026 - 기한 후 신청 가능 여부·예상 지급액";
const metaDescription =
  "2026년 기준 근로장려금 계산기로 가구유형, 총소득, 재산을 입력해 예상 지급액과 기한 후 신청 시 감액 여부를 확인하세요.";
```

---

## 18. 안전 / 정책 표현

반드시 사용: `예상`, `모의계산`, `확인 필요`, `홈택스 확인`, `실제 지급액은 달라질 수 있습니다`
피해야 할 표현: `지급 확정`, `무조건 받을 수 있음`, `정확한 지급액`

결과 상단 배지: `2026년 기준 · 모의계산 · 홈택스 확인 필요`

---

## 19. 구현 체크리스트

- [ ] `src/data/incentiveCalculatorShared.ts` 생성 (자녀장려금과 공유)
- [ ] `src/data/workIncentiveCalculator.ts` 생성
- [ ] **국세청 공식 산정표로 점증/평탄/점감 구간 경계값 재검증** (가장 중요)
- [ ] `src/pages/tools/work-incentive-calculator.astro` 생성
- [ ] `public/scripts/incentive-calculator-shared.js`, `work-incentive-calculator.js` 생성
- [ ] `src/styles/scss/pages/_work-incentive-calculator.scss` 생성
- [ ] `src/styles/app.scss`, `src/data/tools.ts`, `public/sitemap.xml` 등록
- [ ] `src/pages/index.astro` topicBySlug에 복지·지원금 카테고리 등록
- [ ] 자녀장려금 계산기와 상호 CTA 연결
- [ ] `npm run build` 성공
- [ ] 검증 케이스 전체 확인

---

## 20. 후속 확장

- `/tools/child-incentive-calculator/` (자녀장려금, 별도 설계 문서)
- `/reports/work-child-incentive-late-application-2026/` 기한 후 신청 가이드 리포트
- 정부지원금 통합 조회 페이지에서 두 계산기를 허브로 연결
