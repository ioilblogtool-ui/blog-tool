# 생계급여 소득인정액 계산기 2026 설계 문서

> 작성일: 2026-06-15  
> 구현 대상: `/tools/livelihood-benefit-income-recognition/`  
> 콘텐츠 유형: 계산기형 도구  
> 선행 기획: `docs/plan/202606/livelihood-benefit-income-recognition-calculator.md`  
> 기존 모페이지: `/tools/welfare-benefit-eligibility/`

---

## 1. 설계 요약

이 페이지는 기존 `복지급여 수급 자격 계산기`의 하위 검색 랜딩이다. 기존 페이지가 생계·의료·주거·교육급여 전체를 판정한다면, 이 페이지는 **생계급여 하나만 빠르게 확인**하게 만든다.

사용자가 기대하는 첫 답은 “내 소득인정액이 얼마고, 생계급여를 받으면 월 얼마쯤인가”이다. 따라서 첫 화면과 결과 화면은 다음 3가지를 즉시 보여줘야 한다.

1. 2026년 가구원 수별 생계급여 선정기준
2. 입력값 기준 소득인정액 추정
3. 예상 생계급여액 = 생계급여 선정기준 - 소득인정액

단, 이 페이지는 공적 판정 도구가 아니다. 모든 계산 결과에는 `자가 점검용 추정`, `확인 필요` 배지를 노출한다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    livelihoodBenefitIncomeRecognition.ts
      - 페이지 메타
      - 프리셋
      - FAQ
      - SEO 본문
      - 관련 링크
      - 기존 WBE 데이터 재수출 또는 래핑

  pages/
    tools/
      livelihood-benefit-income-recognition.astro
      - SimpleToolShell 기반 페이지
      - 입력 폼
      - 결과 패널
      - 기준표/해설/FAQ

public/
  scripts/
    livelihood-benefit-income-recognition.js
      - 입력 상태 관리
      - 계산 로직
      - URL state
      - DOM 렌더링

src/styles/scss/pages/
  _livelihood-benefit-income-recognition.scss
      - prefix: lbirc-

등록 파일:
  src/data/tools.ts
  src/styles/app.scss
  public/sitemap.xml
```

가능하면 계산 기준 데이터는 `src/data/welfareBenefitEligibility.ts`에서 가져온다. 중복 상수 선언을 줄여야 2027 기준 업데이트 때 관리가 쉽다.

---

## 3. 라우팅 및 메타

### URL

```text
/tools/livelihood-benefit-income-recognition/
```

### tools.ts 등록안

```ts
{
  slug: "livelihood-benefit-income-recognition",
  title: "생계급여 소득인정액 계산기 2026",
  description: "가구원 수, 월소득, 재산을 입력해 2026년 생계급여 선정기준 대비 소득인정액과 예상 생계급여액을 간이 계산합니다.",
  order: 4.71,
  eyebrow: "생계급여 계산",
  category: "support",
  iframeReady: true,
  badges: ["생계급여", "소득인정액", "2026"],
  previewStats: [
    { label: "4인 생계급여 기준", value: "207.8만 원" },
    { label: "결과", value: "예상 지급액" }
  ],
}
```

### BaseLayout 메타

```ts
title: "생계급여 소득인정액 계산기 2026 | 선정기준·예상 지급액 확인"
description: "가구원 수, 월소득, 재산을 입력해 2026년 생계급여 선정기준 대비 소득인정액과 예상 생계급여액을 자가 점검용으로 계산합니다."
```

### JSON-LD

- `WebApplication`
- `FAQPage`
- `BreadcrumbList`

`WebApplication`의 `applicationCategory`는 `FinanceApplication`보다는 복지 성격을 고려해 `UtilityApplication`이 무난하다.

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
export type LbircRegion = "metro" | "city" | "rural";
export type LbircHousingType = "rent" | "jeonse" | "own" | "free";
export type LbircRiskLevel = "likely" | "borderline" | "over" | "needs-check";

export interface LbircInput {
  householdSize: number;
  region: LbircRegion;
  housingType: LbircHousingType;
  earnedIncome: number;
  publicTransferIncome: number;
  privateTransferIncome: number;
  propertyIncome: number;
  housingAsset: number;
  generalAsset: number;
  financialAsset: number;
  debt: number;
  hasCar: boolean;
  carValue: number;
  applyWorkDeduction: boolean;
  hasCrisisReason: boolean;
}

export interface LbircResult {
  householdSize: number;
  medianIncome: number;
  livelihoodThreshold: number;
  grossMonthlyIncome: number;
  workIncomeDeduction: number;
  incomeAfterDeduction: number;
  basicAssetDeduction: number;
  assetAfterDeduction: number;
  assetMonthlyIncome: number;
  incomeRecognized: number;
  ratioToLivelihoodThreshold: number;
  estimatedLivelihoodBenefit: number;
  gapToThreshold: number;
  judgement: LbircRiskLevel;
  warningFlags: LbircWarningFlag[];
  nextActions: LbircNextAction[];
}

export interface LbircWarningFlag {
  id: "car" | "asset" | "debt" | "estimate" | "crisis";
  title: string;
  message: string;
  severity: "info" | "warning" | "danger";
}

export interface LbircNextAction {
  id: "apply" | "full-benefit" | "housing" | "emergency" | "welfare-hub";
  label: string;
  href: string;
  reason: string;
  priority: "high" | "medium" | "low";
}
```

### 상수

```ts
export const LBIRC_META = {
  slug: "livelihood-benefit-income-recognition",
  title: "생계급여 소득인정액 계산기 2026",
  seoTitle: "생계급여 소득인정액 계산기 2026 | 선정기준·예상 지급액 확인",
  seoDescription: "가구원 수, 월소득, 재산을 입력해 2026년 생계급여 선정기준 대비 소득인정액과 예상 생계급여액을 자가 점검용으로 계산합니다.",
  updatedAt: "2026-06-15",
  dataNote: "2026년 기준 중위소득과 생계급여 선정기준을 바탕으로 한 자가 점검용 추정입니다. 실제 수급 여부와 지급액은 주민센터 조사 결과에 따라 달라질 수 있습니다.",
};
```

### 프리셋

```ts
export const LBIRC_PRESETS = [
  {
    id: "single-low-income",
    label: "1인 저소득 가구",
    summary: "월소득 70만 원, 금융재산 300만 원",
    input: { householdSize: 1, earnedIncome: 700000, financialAsset: 3000000 }
  },
  {
    id: "single-parent-two",
    label: "2인 한부모 가구",
    summary: "월소득 150만 원, 전세보증금 5,000만 원",
    input: { householdSize: 2, earnedIncome: 1500000, housingAsset: 50000000 }
  },
  {
    id: "family-four-borderline",
    label: "4인 경계 가구",
    summary: "월소득 250만 원, 금융재산 500만 원",
    input: { householdSize: 4, earnedIncome: 2500000, financialAsset: 5000000 }
  },
  {
    id: "senior-alone",
    label: "노인 단독 가구",
    summary: "공적 이전소득 70만 원, 농어촌 자가",
    input: { householdSize: 1, region: "rural", publicTransferIncome: 700000, housingAsset: 40000000 }
  }
];
```

---

## 5. 계산 로직 설계

### 함수 분리

```js
function getThreshold(householdSize) {}
function getBasicAssetDeduction(region) {}
function calculateGrossIncome(input) {}
function calculateWorkDeduction(input) {}
function calculateIncomeAfterDeduction(input) {}
function calculateAssetMonthlyIncome(input) {}
function calculateIncomeRecognized(input) {}
function judgeLivelihood(result) {}
function buildWarningFlags(input, result) {}
function buildNextActions(input, result) {}
function calculate(input) {}
```

### 계산 순서

```text
1. 가구원 수로 기준 중위소득/생계급여 선정기준 조회
2. 월 소득 합계 계산
3. 근로·사업소득 공제 계산
4. 소득평가액 계산
5. 지역별 기본재산액 조회
6. 재산 총액과 부채 차감
7. 재산의 월 소득환산액 계산
8. 소득인정액 계산
9. 생계급여 기준 대비 비율 계산
10. 예상 생계급여액 계산
11. 판정/경고/다음 행동 생성
```

### 핵심 공식

```text
월소득합계 =
  근로·사업소득 + 공적 이전소득 + 사적 이전소득 + 재산소득

근로소득공제 =
  min(근로·사업소득 × 30%, 600,000원)

소득평가액 =
  max(월소득합계 - 근로소득공제, 0)

순재산 =
  max(주거재산 + 일반재산 + 금융재산 - 부채 - 지역별 기본재산액, 0)

재산의 소득환산액 =
  주거·일반재산 환산액 + 금융재산 환산액

소득인정액 =
  소득평가액 + 재산의 소득환산액

예상 생계급여액 =
  max(생계급여 선정기준 - 소득인정액, 0)
```

### 판정 기준

```js
if (incomeRecognized <= threshold * 0.95) judgement = "likely";
else if (incomeRecognized <= threshold * 1.05) judgement = "borderline";
else judgement = "over";

if (hasCar || carValue > 0) addWarning("car");
if (assetAfterDeduction > threshold * 0.25) addWarning("asset");
if (debt > 0) addWarning("debt");
```

판정 문구는 확정형을 피한다.

| 상태 | 표시 문구 |
|---|---|
| `likely` | 생계급여 신청 가능성이 있는 구간입니다 |
| `borderline` | 기준선 근처라 실제 조사에서 달라질 수 있습니다 |
| `over` | 입력값 기준으로는 생계급여 기준을 초과한 것으로 보입니다 |
| `needs-check` | 자동차·재산·부채 등 별도 확인 항목이 있습니다 |

---

## 6. UI 구조

### 전체 레이아웃

`SimpleToolShell` 기반을 권장한다.

```astro
<SimpleToolShell
  calculatorId="livelihood-benefit-income-recognition"
  pageClass="lbirc-page"
  resultFirst={false}
>
```

모바일에서는 입력이 먼저 나오고, 결과는 sticky가 아니라 입력 아래 카드형으로 흐르게 한다. 복지 페이지는 사용자가 입력을 신중하게 하므로 과도한 애니메이션은 피한다.

### 섹션 순서

1. Hero
2. InfoNotice
3. 빠른 기준표
4. 입력 폼
5. 결과 KPI
6. 생계급여 기준선 게이지
7. 소득인정액 분해
8. 다음 확인 CTA
9. 2026 생계급여 선정기준표
10. 소득인정액 설명
11. FAQ
12. 관련 링크
13. SEO 본문

---

## 7. 입력 UI 상세

### 빠른 프리셋

```html
<div class="lbirc-preset-grid">
  <button type="button" data-lbirc-preset="single-low-income">1인 저소득</button>
  <button type="button" data-lbirc-preset="single-parent-two">2인 한부모</button>
  <button type="button" data-lbirc-preset="family-four-borderline">4인 경계</button>
  <button type="button" data-lbirc-preset="senior-alone">노인 단독</button>
</div>
```

### 기본 입력 필드

| DOM id/name | 라벨 | 타입 | 기본값 |
|---|---|---|---|
| `householdSize` | 가구원 수 | select | `4` |
| `region` | 거주 지역 | select | `metro` |
| `earnedIncome` | 월 근로·사업소득 | number | `1500000` |
| `publicTransferIncome` | 공적 이전소득 | number | `0` |
| `housingAsset` | 주거재산 | number | `50000000` |
| `financialAsset` | 금융재산 | number | `5000000` |
| `debt` | 인정 가능 부채 | number | `0` |
| `hasCar` | 자동차 있음 | checkbox | `false` |

### 상세 입력 접기

```html
<details class="lbirc-advanced">
  <summary>상세 입력 열기</summary>
  ...
</details>
```

상세 입력에는 일반재산, 사적 이전소득, 재산소득, 자동차가액, 위기 사유를 둔다.

### 입력 UX 규칙

- 금액 입력은 원 단위지만 placeholder는 `예: 1500000`처럼 숫자만 표시
- UI 표시값은 `150만 원`으로 포맷
- 빈 값은 0 처리
- 음수 입력은 0 처리
- 가구원 수 7인 이상은 “현재 간이 계산은 6인까지 지원” 안내

---

## 8. 결과 UI 상세

### KPI 카드

```html
<section class="lbirc-result-kpis">
  <article class="lbirc-kpi lbirc-kpi--main">
    <span>소득인정액 추정</span>
    <strong data-lbirc-result="incomeRecognized">185만 원</strong>
    <small>자가 점검용 추정</small>
  </article>
  ...
</section>
```

| data key | 표시 |
|---|---|
| `incomeRecognized` | 소득인정액 |
| `livelihoodThreshold` | 생계급여 선정기준 |
| `estimatedLivelihoodBenefit` | 예상 생계급여액 |
| `gapToThreshold` | 기준까지 차이 |

### 결과 요약 문장

```html
<p data-lbirc-summary>
  입력값 기준 소득인정액은 월 약 185만 원으로 추정됩니다...
</p>
```

문장 생성 규칙:

| 상태 | 요약 첫 문장 |
|---|---|
| likely | `생계급여 신청 가능성이 있는 구간입니다.` |
| borderline | `생계급여 기준선에 가까운 경계 구간입니다.` |
| over | `입력값 기준으로는 생계급여 기준을 초과한 것으로 보입니다.` |

### 기준선 게이지

```html
<div class="lbirc-gauge">
  <span class="lbirc-gauge__bar">
    <i data-lbirc-gauge-fill></i>
  </span>
  <div class="lbirc-gauge__markers">
    <span>0%</span>
    <span>95%</span>
    <span>100%</span>
    <span>105%</span>
  </div>
</div>
```

게이지 fill:

```js
Math.min(result.ratioToLivelihoodThreshold * 100, 140)
```

### 소득인정액 분해

```html
<div class="lbirc-breakdown">
  <article>
    <span>소득평가액</span>
    <strong data-lbirc-breakdown="incomeAfterDeduction"></strong>
  </article>
  <article>
    <span>재산 소득환산액</span>
    <strong data-lbirc-breakdown="assetMonthlyIncome"></strong>
  </article>
  <article>
    <span>근로소득 공제</span>
    <strong data-lbirc-breakdown="workIncomeDeduction"></strong>
  </article>
</div>
```

### 경고 플래그

```html
<div class="lbirc-warning-list" data-lbirc-warnings></div>
```

자동차, 부채, 고액 재산, 위기 사유는 카드로 표시한다.

---

## 9. URL 상태 설계

### 지원 파라미터

| 파라미터 | 의미 | 예 |
|---|---|---|
| `hh` | 가구원 수 | `4` |
| `rg` | 지역 | `metro` |
| `inc` | 근로·사업소득 | `1500000` |
| `pub` | 공적 이전소득 | `700000` |
| `ha` | 주거재산 | `50000000` |
| `fa` | 금융재산 | `5000000` |
| `debt` | 부채 | `10000000` |
| `car` | 자동차 여부 | `yes` |

### 예시 URL

```text
/tools/livelihood-benefit-income-recognition/?hh=4&rg=metro&inc=1800000&ha=50000000&fa=3000000
```

URL 업데이트는 debounce 250ms 적용. 공유 URL 복사 버튼 제공.

---

## 10. 접근성

- 결과 요약 영역에 `aria-live="polite"`
- 숫자만 색으로 구분하지 않고 상태 텍스트 병기
- 게이지는 `aria-hidden="true"` 처리하고 실제 판정은 텍스트로 제공
- 프리셋 버튼은 선택 상태 `aria-pressed`
- 입력 오류는 필드 아래 텍스트로 표시
- 모든 버튼/입력은 모바일 44px 이상 높이

---

## 11. SCSS 설계

### prefix

```scss
.lbirc-page { ... }
```

### 주요 클래스

```scss
.lbirc-preset-grid
.lbirc-input-grid
.lbirc-money-field
.lbirc-result-kpis
.lbirc-kpi
.lbirc-kpi--main
.lbirc-gauge
.lbirc-breakdown
.lbirc-warning-list
.lbirc-next-actions
.lbirc-threshold-table
.lbirc-explain-grid
```

### 톤

- 공공/복지 성격: 과한 마케팅 느낌 금지
- 메인 색: 신뢰감 있는 blue/green 조합
- 위험 플래그: red보다는 amber 중심, 실제 위험만 red
- 카드 radius 8px 이하
- 표는 모바일 가로 스크롤 허용

---

## 12. 내부 링크 및 CTA

### 상단 CTA

```text
4대 급여 전체 가능성 보기 → /tools/welfare-benefit-eligibility/
복지지원금 비교표 보기 → /compare/welfare/
```

### 결과 CTA 조건

| 조건 | CTA |
|---|---|
| likely | `주민센터 상담 전 준비서류 확인` |
| borderline | `복지급여 전체 가능성 다시 계산` |
| over | `주거급여·교육급여 가능성 확인` |
| hasCrisisReason | `긴급복지 지원도 확인` |
| hasCar | `재산 기준 계산기로 자동차 영향 확인` |

---

## 13. QA 체크리스트

### 계산 QA

- [ ] 4인 가구 기준 생계급여 선정기준이 2,078,316원으로 표시된다.
- [ ] 소득인정액이 선정기준보다 낮으면 예상 생계급여액이 양수로 표시된다.
- [ ] 소득인정액이 선정기준보다 높으면 예상 생계급여액은 0원이다.
- [ ] 빈 금액 입력은 0으로 처리된다.
- [ ] 음수 입력은 0으로 보정된다.
- [ ] 자동차 있음 선택 시 확인 필요 플래그가 표시된다.
- [ ] URL 파라미터로 입력값이 복원된다.

### 콘텐츠 QA

- [ ] 결과에 “확정”, “수급 가능”처럼 단정 표현이 없다.
- [ ] `자가 점검용 추정` 배지가 첫 화면과 결과 화면에 보인다.
- [ ] 생계급여 기준표와 계산 결과가 같은 기준값을 사용한다.
- [ ] 주민센터/복지로 최종 확인 안내가 있다.
- [ ] 기존 통합 계산기와 중복되는 제목 구조가 아니다.

### 배포 QA

- [ ] `src/data/tools.ts` 등록
- [ ] `src/styles/app.scss` import
- [ ] `public/sitemap.xml` 등록
- [ ] `npm run build` 성공
- [ ] 모바일 360px에서 입력/결과 카드 텍스트가 넘치지 않음

---

## 14. 구현 우선순위

1. 데이터 래퍼 파일 생성
2. 계산 함수 JS 구현
3. Astro 페이지 생성
4. 결과 KPI/게이지 렌더링
5. URL state/프리셋/공유 링크
6. SEO 본문/FAQ/관련 링크
7. 등록 파일 업데이트
8. 빌드 및 모바일 확인

---

## 15. 최종 설계 판단

이 페이지는 기존 복지 계산기의 축소판이 아니라 **생계급여 검색어 전용 빠른 계산기**다. 그래서 UI는 통합 판정보다 짧아야 하고, 결과는 생계급여 예상액을 중심으로 보여줘야 한다.

성공 조건은 사용자가 첫 10초 안에 “내가 기준선보다 아래인지 위인지”를 이해하는 것이다.
