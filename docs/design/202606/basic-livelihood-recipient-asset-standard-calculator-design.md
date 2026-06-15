# 기초생활수급자 재산 기준 계산기 2026 설계 문서

> 작성일: 2026-06-15  
> 구현 대상: `/tools/basic-livelihood-recipient-asset-standard/`  
> 콘텐츠 유형: 계산기형 도구 + 재산 기준 해설 랜딩  
> 선행 기획: `docs/plan/202606/basic-livelihood-recipient-asset-standard-calculator.md`  
> 기존 연결: `/tools/welfare-benefit-eligibility/`, `/tools/livelihood-benefit-income-recognition/`

---

## 1. 설계 요약

이 페이지는 `기초생활수급자 자격 계산기`를 다시 만드는 페이지가 아니다. 사용자가 가장 자주 불안해하는 질문인 **“재산 때문에 탈락할까?”**에 집중하는 페이지다.

따라서 결과의 중심은 수급 가능/불가능이 아니라 다음 항목이다.

1. 지역별 기본재산액 차감 후 남는 재산
2. 재산의 월 소득환산액
3. 재산이 전체 소득인정액에 미치는 영향
4. 자동차·금융재산·부채의 확인 필요 항목

생계급여 예상액은 보조로만 표시하고, 전체 자격 판정은 `/tools/welfare-benefit-eligibility/`로 넘긴다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    basicLivelihoodRecipientAssetStandard.ts
      - 페이지 메타
      - 재산 유형 라벨
      - 프리셋
      - FAQ
      - SEO 본문
      - 관련 링크

  pages/
    tools/
      basic-livelihood-recipient-asset-standard.astro
      - SimpleToolShell 기반 페이지
      - 재산 중심 입력 폼
      - 재산 분해 결과
      - 해설/FAQ

public/
  scripts/
    basic-livelihood-recipient-asset-standard.js
      - 재산 중심 계산
      - 위험도 판정
      - URL state

src/styles/scss/pages/
  _basic-livelihood-recipient-asset-standard.scss
      - prefix: blas-

등록 파일:
  src/data/tools.ts
  src/styles/app.scss
  public/sitemap.xml
```

기본재산액, 기준 중위소득, 환산율은 기존 `welfareBenefitEligibility.ts`에서 가져온다.

---

## 3. 라우팅 및 메타

### URL

```text
/tools/basic-livelihood-recipient-asset-standard/
```

### tools.ts 등록안

```ts
{
  slug: "basic-livelihood-recipient-asset-standard",
  title: "기초생활수급자 재산 기준 계산기 2026",
  description: "전세보증금, 예금, 부채, 자동차 정보를 입력해 기초생활수급자 재산 기준에서 소득환산액과 확인 필요 항목을 간이 점검합니다.",
  order: 4.72,
  eyebrow: "기초생활 재산 기준",
  category: "support",
  iframeReady: true,
  badges: ["재산 기준", "기초생활", "2026"],
  previewStats: [
    { label: "대도시 기본재산액", value: "9,900만 원" },
    { label: "핵심 결과", value: "재산 위험도" }
  ],
}
```

### BaseLayout 메타

```ts
title: "기초생활수급자 재산 기준 계산기 2026 | 전세보증금·예금·자동차 확인"
description: "주거재산, 금융재산, 일반재산, 부채, 자동차 정보를 입력해 기초생활수급자 재산 기준에서 소득환산액과 확인 필요 항목을 자가 점검합니다."
```

---

## 4. 데이터 설계

### 기존 데이터 재사용

```ts
import {
  WBE_2026_THRESHOLDS,
  WBE_ASSET_DEDUCTION_BY_REGION,
  WBE_MONTHLY_CONVERSION_RATE,
  WBE_WORK_INCOME_DEDUCTION,
} from "./welfareBenefitEligibility";
```

### 신규 타입

```ts
export type BlasRegion = "metro" | "city" | "rural";
export type BlasHousingType = "rent" | "jeonse" | "own" | "free";
export type BlasCarType = "none" | "general" | "business" | "disabled" | "protected";
export type BlasAssetRisk = "low" | "medium" | "high" | "needs-check";

export interface BlasInput {
  householdSize: number;
  region: BlasRegion;
  housingType: BlasHousingType;
  housingAsset: number;
  generalAsset: number;
  financialAsset: number;
  insuranceRefundAsset: number;
  debt: number;
  hasCar: boolean;
  carValue: number;
  carType: BlasCarType;
  earnedIncome: number;
  publicTransferIncome: number;
  applyWorkDeduction: boolean;
}

export interface BlasAssetBreakdownItem {
  id: "housing" | "general" | "financial" | "insurance" | "debt" | "car";
  label: string;
  inputAmount: number;
  recognizedAmount: number;
  monthlyConvertedAmount: number;
  status: "ignored" | "included" | "deducted" | "needs-check";
  note: string;
}

export interface BlasResult {
  householdSize: number;
  medianIncome: number;
  livelihoodThreshold: number;
  basicAssetDeduction: number;
  totalAsset: number;
  assetAfterDebt: number;
  assetAfterBasicDeduction: number;
  housingMonthlyIncome: number;
  generalMonthlyIncome: number;
  financialMonthlyIncome: number;
  assetMonthlyIncome: number;
  incomeAfterDeduction: number;
  incomeRecognized: number;
  assetShareOfIncomeRecognized: number;
  risk: BlasAssetRisk;
  breakdown: BlasAssetBreakdownItem[];
  warningFlags: BlasWarningFlag[];
  nextActions: BlasNextAction[];
}

export interface BlasWarningFlag {
  id: "car" | "financial" | "debt" | "general-asset" | "estimate";
  title: string;
  message: string;
  severity: "info" | "warning" | "danger";
}

export interface BlasNextAction {
  id: "livelihood" | "full-benefit" | "welfare-hub" | "resident-center";
  label: string;
  href: string;
  reason: string;
}
```

### 메타 상수

```ts
export const BLAS_META = {
  slug: "basic-livelihood-recipient-asset-standard",
  title: "기초생활수급자 재산 기준 계산기 2026",
  seoTitle: "기초생활수급자 재산 기준 계산기 2026 | 전세보증금·예금·자동차 확인",
  seoDescription: "주거재산, 금융재산, 일반재산, 부채, 자동차 정보를 입력해 기초생활수급자 재산 기준에서 소득환산액과 확인 필요 항목을 자가 점검합니다.",
  updatedAt: "2026-06-15",
  dataNote: "재산 기준은 실제 조사에서 재산 종류, 지역, 자동차 용도, 부채 인정 여부에 따라 달라질 수 있습니다. 이 계산기는 신청 전 이해를 돕는 자가 점검용 추정입니다.",
};
```

### 라벨 상수

```ts
export const BLAS_REGION_LABELS = {
  metro: "대도시",
  city: "중소도시",
  rural: "농어촌",
};

export const BLAS_CAR_TYPE_LABELS = {
  none: "없음",
  general: "일반 차량",
  business: "생업용 차량",
  disabled: "장애인용 차량",
  protected: "보호용 차량",
};
```

---

## 5. 계산 로직 설계

### 함수 분리

```js
function getBasicAssetDeduction(region) {}
function calculateTotalAsset(input) {}
function calculateAssetAfterDebt(input) {}
function splitAssetAfterDeduction(input, basicDeduction) {}
function calculateAssetMonthlyIncome(input) {}
function calculateIncomeAfterDeduction(input) {}
function calculateIncomeRecognized(input, assetMonthlyIncome) {}
function judgeAssetRisk(input, result) {}
function buildBreakdown(input, result) {}
function buildWarningFlags(input, result) {}
function buildNextActions(input, result) {}
function calculate(input) {}
```

### 핵심 계산 순서

```text
1. 지역별 기본재산액 조회
2. 총재산 = 주거재산 + 일반재산 + 금융재산 + 보험해지환급금
3. 부채 차감 후 재산 = max(총재산 - 부채, 0)
4. 기본재산액 차감 후 재산 = max(부채 차감 후 재산 - 기본재산액, 0)
5. 재산 종류별 월 소득환산액 계산
6. 월소득 공제 후 소득평가액 계산
7. 소득평가액 + 재산환산액 = 소득인정액
8. 재산환산액 비중 계산
9. 재산 위험도 판정
10. 자동차·부채·금융재산 확인 필요 플래그 생성
```

### 기본재산액 차감 모델

MVP에서는 사용자가 이해하기 쉬운 방식으로 단순화한다.

```text
기본재산액은 전체 순재산에서 먼저 차감한다.
남는 재산이 있으면 주거/일반/금융재산 비율에 따라 환산액을 계산한다.
```

구현상 더 단순하게 하려면 다음 순서로 차감한다.

```text
1. 주거재산에서 우선 차감
2. 남은 기본재산액을 일반재산에서 차감
3. 남은 기본재산액을 금융재산에서 차감
```

결과 화면에는 “실제 조사 방식과 다를 수 있는 간이 모델”이라고 표시한다.

### 월 소득환산액

```text
주거·일반재산 월 환산액 = 인정 재산 × 1.04%
금융재산 월 환산액 = 인정 금융재산 × 6.26%
자동차 = 금액 직접 반영보다 확인 필요 플래그
```

기존 `WBE_MONTHLY_CONVERSION_RATE`와 맞춘다.

### 위험도 판정

```js
const assetRatio = assetMonthlyIncome / livelihoodThreshold;

if (hasCar && carType === "general") risk = "needs-check";
else if (assetRatio <= 0.1) risk = "low";
else if (assetRatio <= 0.25) risk = "medium";
else risk = "high";
```

| 위험도 | 조건 | 문구 |
|---|---|---|
| low | 재산환산액이 생계급여 기준의 10% 이하 | 재산 부담이 낮은 편입니다 |
| medium | 10~25% | 소득과 함께 보면 경계가 될 수 있습니다 |
| high | 25% 초과 | 재산 때문에 기준 초과 가능성이 있습니다 |
| needs-check | 일반 자동차 또는 특이 항목 | 실제 조사 확인이 필요합니다 |

---

## 6. UI 구조

### 전체 레이아웃

`SimpleToolShell` 기반.

```astro
<SimpleToolShell
  calculatorId="basic-livelihood-recipient-asset-standard"
  pageClass="blas-page"
  resultFirst={false}
>
```

### 섹션 순서

1. Hero
2. InfoNotice
3. 지역별 기본재산액 빠른 표
4. 프리셋 카드
5. 재산 중심 입력 폼
6. 결과 KPI
7. 기본재산액 게이지
8. 재산 분해 표
9. 자동차·부채 확인 필요 카드
10. 다음 계산 CTA
11. 재산 기준 해설
12. FAQ
13. 관련 링크
14. SEO 본문

---

## 7. 입력 UI 상세

### 프리셋

```html
<div class="blas-preset-grid">
  <button type="button" data-blas-preset="jeonse-small">전세보증금 5천만 원</button>
  <button type="button" data-blas-preset="deposit-financial">예금 2천만 원</button>
  <button type="button" data-blas-preset="car-risk">자동차 보유</button>
  <button type="button" data-blas-preset="debt-offset">부채 차감</button>
</div>
```

### 입력 필드

| name | 라벨 | 타입 | 기본값 |
|---|---|---|---|
| `householdSize` | 가구원 수 | select | `4` |
| `region` | 거주 지역 | segmented/select | `metro` |
| `housingType` | 주거 형태 | select | `jeonse` |
| `housingAsset` | 전세보증금/주택가액 | number | `50000000` |
| `generalAsset` | 토지·일반재산 | number | `0` |
| `financialAsset` | 예금·적금·주식 | number | `10000000` |
| `insuranceRefundAsset` | 보험 해지환급금 | number | `0` |
| `debt` | 인정 가능 부채 | number | `0` |
| `hasCar` | 자동차 보유 | checkbox | `false` |
| `carValue` | 차량가액 | number | `0` |
| `carType` | 차량 용도 | select | `general` |
| `earnedIncome` | 월 근로·사업소득 | number | `1200000` |
| `publicTransferIncome` | 공적 이전소득 | number | `0` |

### 입력 그룹

```html
<section class="blas-input-group" aria-labelledby="blas-household-title">
<section class="blas-input-group" aria-labelledby="blas-asset-title">
<section class="blas-input-group" aria-labelledby="blas-car-title">
<section class="blas-input-group" aria-labelledby="blas-income-title">
```

재산 페이지이므로 `asset-title` 그룹을 가장 강조한다.

---

## 8. 결과 UI 상세

### KPI 카드

```html
<section class="blas-kpi-grid" aria-label="재산 기준 계산 결과">
  <article class="blas-kpi blas-kpi--main">
    <span>재산 위험도</span>
    <strong data-blas-result="riskLabel">낮음</strong>
    <small data-blas-result="riskSummary">재산 부담이 낮은 편입니다.</small>
  </article>
  ...
</section>
```

| data key | 표시 |
|---|---|
| `riskLabel` | 낮음/경계/높음/확인 필요 |
| `assetAfterBasicDeduction` | 기본재산액 차감 후 재산 |
| `assetMonthlyIncome` | 재산의 월 소득환산액 |
| `incomeRecognized` | 전체 소득인정액 |
| `assetShare` | 소득인정액 중 재산 비중 |

### 기본재산액 게이지

```html
<div class="blas-basic-asset-meter">
  <div class="blas-basic-asset-meter__bar">
    <span data-blas-basic-asset-fill></span>
  </div>
  <p data-blas-basic-asset-copy></p>
</div>
```

게이지:

```js
const fill = Math.min((assetAfterDebt / basicAssetDeduction) * 100, 160);
```

문구:

| 상태 | 문구 |
|---|---|
| 기본재산액 이하 | 입력한 재산은 지역별 기본재산액 범위 안에 있습니다. |
| 기본재산액 초과 | 기본재산액을 초과한 재산 일부가 월 소득으로 환산될 수 있습니다. |

### 재산 분해 표

```html
<table class="blas-breakdown-table">
  <thead>
    <tr>
      <th>항목</th>
      <th>입력 금액</th>
      <th>반영 금액</th>
      <th>월 환산액</th>
      <th>상태</th>
    </tr>
  </thead>
  <tbody data-blas-breakdown-body></tbody>
</table>
```

### 위험 플래그 카드

```html
<div class="blas-warning-list" data-blas-warnings></div>
```

경고 카드 유형:

| id | 제목 | severity |
|---|---|---|
| `car` | 자동차 확인 필요 | warning/danger |
| `financial` | 금융재산 확인 필요 | info/warning |
| `debt` | 부채 인정 여부 확인 | info |
| `general-asset` | 일반재산 영향 큼 | warning |
| `estimate` | 자가 점검용 추정 | info |

---

## 9. URL 상태 설계

### 파라미터

| 파라미터 | 의미 |
|---|---|
| `hh` | 가구원 수 |
| `rg` | 지역 |
| `ht` | 주거 형태 |
| `ha` | 주거재산 |
| `ga` | 일반재산 |
| `fa` | 금융재산 |
| `ia` | 보험 해지환급금 |
| `debt` | 부채 |
| `car` | 자동차 여부 |
| `cv` | 차량가액 |
| `ct` | 차량 용도 |
| `inc` | 월 근로·사업소득 |

### 예시

```text
/tools/basic-livelihood-recipient-asset-standard/?rg=metro&ha=80000000&fa=10000000&car=yes&cv=12000000
```

공유 버튼:

```html
<button type="button" data-blas-copy-link>현재 입력값 링크 복사</button>
<span data-blas-copy-status aria-live="polite"></span>
```

---

## 10. SEO 본문 설계

### H2/H3 구조

```text
H2 기초생활수급자 재산 기준은 단순 총액이 아닙니다
H3 소득인정액에서 재산이 반영되는 방식

H2 지역별 기본재산액이 중요한 이유
H3 대도시·중소도시·농어촌 차이

H2 전세보증금과 주택은 어떻게 보나요?
H3 전세보증금도 재산에 포함되나요?
H3 월세 보증금은 어떻게 입력하나요?

H2 예금·적금·주식 같은 금융재산은 어떻게 반영되나요?

H2 자동차가 있으면 무조건 탈락인가요?

H2 부채는 재산에서 뺄 수 있나요?

H2 재산 기준을 넘을 때 확인할 다른 지원

H2 자주 묻는 질문
```

### FAQ

```ts
export const BLAS_FAQ = [
  {
    question: "기초생활수급자는 재산이 있으면 안 되나요?",
    answer: "재산이 있다고 무조건 제외되는 것은 아닙니다. 지역별 기본재산액, 재산 종류, 소득, 가구 특성을 함께 봅니다."
  },
  {
    question: "전세보증금도 재산인가요?",
    answer: "전세보증금은 주거재산으로 볼 수 있습니다. 다만 지역별 기본재산액 차감과 실제 조사 기준에 따라 반영 방식이 달라질 수 있습니다."
  },
  {
    question: "예금은 얼마까지 괜찮나요?",
    answer: "단순히 예금 총액만으로 판단하지 않습니다. 가구원 수, 지역, 다른 재산, 월소득과 함께 소득인정액으로 계산합니다."
  },
  {
    question: "자동차가 있으면 기초생활수급자가 될 수 없나요?",
    answer: "무조건 그렇지는 않습니다. 차량 용도, 가액, 장애인·생업용 여부 등에 따라 다르게 볼 수 있어 별도 확인이 필요합니다."
  },
  {
    question: "부채는 모두 재산에서 빼주나요?",
    answer: "인정 가능한 부채인지가 중요합니다. 금융기관 부채 등 확인 가능한 자료가 필요할 수 있습니다."
  },
  {
    question: "생계급여는 어렵지만 주거급여는 가능할 수 있나요?",
    answer: "가능할 수 있습니다. 급여마다 선정기준이 다르기 때문에 통합 복지급여 계산기로 함께 확인하는 것이 좋습니다."
  }
];
```

---

## 11. 내부 링크 및 CTA 설계

### 결과 CTA

| 조건 | CTA |
|---|---|
| risk low | `생계급여 예상액 계산하기` |
| risk medium | `4대 급여 전체 가능성 보기` |
| risk high | `주거급여·교육급여 가능성 확인` |
| car warning | `자동차 기준은 주민센터에서 확인하세요` |

### 링크

```ts
export const BLAS_RELATED_LINKS = [
  { href: "/tools/livelihood-benefit-income-recognition/", label: "생계급여 예상액 계산기" },
  { href: "/tools/welfare-benefit-eligibility/", label: "기초생활수급자 자격 계산기" },
  { href: "/compare/welfare/", label: "복지지원금 비교표" },
  { href: "/reports/2026-government-welfare-benefits/", label: "2026 정부 복지지원금 정리" },
  { href: "/tools/high-oil-support-payment-calculator/", label: "고유가 지원금 계산기" },
];
```

### 기존 페이지 역링크 필요

- `/tools/welfare-benefit-eligibility/`
  - 소득인정액 분해 섹션 아래 `재산 기준 자세히 보기`
- `/reports/2026-government-welfare-benefits/`
  - 기초생활보장 섹션 CTA
- `/compare/welfare/`
  - 빠른 계산 카드 추가

---

## 12. 접근성

- 결과 영역 `aria-live="polite"`
- 위험도 색상만으로 판단하지 않고 텍스트 병기
- 표 caption 제공
- 모바일에서 표 가로 스크롤 가능
- 프리셋 버튼 `aria-pressed`
- 자동차 상세 입력은 toggle 상태에 따라 `hidden` 처리
- 입력 필드 label 필수
- 결과 문장은 스크린리더에서 자연스럽게 읽히도록 숫자 뒤 단위 포함

---

## 13. SCSS 설계

### prefix

```scss
.blas-page { ... }
```

### 주요 클래스

```scss
.blas-preset-grid
.blas-input-group
.blas-asset-grid
.blas-car-panel
.blas-kpi-grid
.blas-kpi
.blas-kpi--main
.blas-basic-asset-meter
.blas-breakdown-table-wrap
.blas-breakdown-table
.blas-warning-list
.blas-next-actions
.blas-guide-grid
.blas-faq
```

### 색상 방향

- 기본: white/gray 기반
- 신뢰: blue
- 안전/낮음: green
- 경계: amber
- 확인 필요/높음: red
- radius 8px 이하
- 큰 hero 장식 금지. 계산기가 첫 화면이어야 함.

---

## 14. QA 체크리스트

### 계산 QA

- [ ] 대도시 기본재산액 9,900만 원이 표시된다.
- [ ] 중소도시 기본재산액 7,700만 원이 표시된다.
- [ ] 농어촌 기본재산액 5,300만 원이 표시된다.
- [ ] 총재산이 기본재산액 이하이면 기본재산액 차감 후 재산이 0원이다.
- [ ] 금융재산 입력 시 월 환산액이 표시된다.
- [ ] 부채 입력 시 총재산에서 차감된다.
- [ ] 자동차 보유 시 확인 필요 플래그가 표시된다.
- [ ] 차량 용도 `생업용`, `장애인용`은 단정 판정 대신 확인 필요로 표시된다.
- [ ] URL 파라미터 복원이 된다.

### 콘텐츠 QA

- [ ] “재산 있으면 무조건 탈락” 같은 단정 표현이 없다.
- [ ] 전세보증금은 재산에 포함될 수 있다고 설명한다.
- [ ] 자동차는 실제 조사 확인 필요로 안내한다.
- [ ] 부채는 인정 가능 여부 확인 필요로 안내한다.
- [ ] 통합 복지급여 계산기로 연결된다.

### UI QA

- [ ] 모바일 360px에서 KPI 카드 텍스트가 넘치지 않는다.
- [ ] 재산 분해 표는 가로 스크롤된다.
- [ ] 경고 카드가 너무 위협적으로 보이지 않는다.
- [ ] 첫 화면에서 기본재산액 표 또는 요약이 보인다.

### 배포 QA

- [ ] `src/data/tools.ts` 등록
- [ ] `src/styles/app.scss` import
- [ ] `public/sitemap.xml` 등록
- [ ] `npm run build` 성공
- [ ] 기존 복지 페이지에 역링크 추가

---

## 15. 구현 우선순위

1. 데이터 파일 생성
2. 재산 계산 함수 구현
3. Astro 페이지 생성
4. KPI/재산 분해 표 구현
5. 자동차 확인 필요 로직 구현
6. URL state/프리셋/공유 링크
7. SEO 본문/FAQ
8. 기존 복지 페이지 역링크
9. 빌드 및 모바일 확인

---

## 16. 최종 설계 판단

이 페이지의 핵심은 “자격 판정”이 아니라 “재산 영향 해석”이다. 사용자는 복지 제도의 정확한 계산식을 외우고 싶은 것이 아니라, 전세보증금·예금·자동차 때문에 내가 위험한지 알고 싶어 한다.

따라서 첫 결과는 `재산 위험도`, `기본재산액 차감 후 재산`, `월 소득환산액`이어야 한다. 수급 가능성은 보조로만 두고, 최종 판단은 통합 복지급여 계산기와 주민센터 확인으로 연결한다.
