# 소득 대비 집값 부담 계산기 설계 문서

> 기획 원문: `docs/plan/202606/income-home-affordability-calculator.md`
> 작성일: 2026-06-10
> 콘텐츠 유형: `/tools/` 계산기
> 구현 기준: 연소득·보유현금·지역유형을 입력하면 DSR·LTV 기준 최대 대출 가능액을 역산하고, 그 한도 안에서 살 수 있는 적정 매매가(PIR·월 상환 부담률 포함)를 계산한다.

---

## 1. 문서 개요

- 구현 대상: `소득 대비 집값 부담 계산기`
- slug: `income-home-affordability`
- URL: `/tools/income-home-affordability/`
- 카테고리: 부동산 (`realestate`)
- 핵심 검색 의도: `연봉 대비 집값 계산기`, `내 연봉으로 집 살 수 있을까`, `DSR 대출한도 계산기`, `소득 대비 적정 집값`
- 핵심 출력: 적정 매매가(PRIMARY), DSR 기준 최대 대출 가능액, PIR(연봉 대비 집값 배수) + 부담 배지, 월 상환 부담률, 지역 유형별 비교표, 비용 상세 내역
- 안전 문구: 실제 대출 가능액은 신용평가·기존부채·소득증빙·금융기관 정책에 따라 달라질 수 있는 모의계산 결과
- `home-purchase-fund`(내집마련 자금 계산기)와 정/역방향 쌍 — LTV/취득세/중개보수 계산 함수와 데이터를 그대로 재사용

### 1-1. 기획 대비 범위 조정

기획 문서의 "생애최초 여부" 토글은 `home-purchase-fund`의 `LTV_RATES` 테이블에 생애최초 전용 우대율이 별도로 정의되어 있지 않아(이미 `none`=70%가 최댓값) 이번 1차 구현에서는 제외한다. 두 계산기의 LTV 기준을 어긋나지 않게 유지하기 위함이며, 후속 확장(§16)에서 재검토한다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    incomeHomeAffordability.ts
  pages/
    tools/
      income-home-affordability.astro

public/
  scripts/
    income-home-affordability.js

src/styles/scss/pages/
  _income-home-affordability.scss
```

필수 등록:

- `src/data/tools.ts` — `category: "realestate"`, `home-purchase-fund` 다음 순서
- `src/styles/app.scss` → `@use 'scss/pages/income-home-affordability';`
- `public/sitemap.xml` → `/tools/income-home-affordability/` 추가

선택 등록:

- `home-purchase-fund.astro` 결과 영역에 "반대로 계산해보기" CTA 추가 (상호 링크)
- `public/og/tools/income-home-affordability.png` OG 이미지 (후속)

---

## 3. 레이아웃 방향

- `SimpleToolShell` 기반, `home-purchase-fund`와 동일한 패널 구조(`panel`, `panel-heading`, `calc-slider-row` 등 공용 클래스 재사용)
- 입력 영역(aside): 연소득 → 보유 현금 → 기존 대출 → 지역 유형 → 주택 보유 수 → 대출 조건(금리/기간/DSR한도) 순서
- 결과 영역: KPI 4종 → 결과 해석 문구 → 지역 유형별 비교표 → 비용 상세 테이블 → "내집마련 자금 계산기로 이어보기" CTA
- SCSS prefix: `iha-`
- pageClass: `iha-page`

```astro
<SimpleToolShell calculatorId="income-home-affordability" pageClass="iha-page">
```

---

## 4. 페이지 IA

1. Hero
2. InfoNotice (모의계산 안내)
3. 입력 영역 (연소득 / 보유현금 / 기존부채 / 지역유형 / 주택보유수 / 금리·기간·DSR한도)
4. 결과 KPI 카드 4종
5. 결과 해석 문구
6. 지역 유형별 비교표
7. 비용 상세 내역 테이블
8. "내집마련 자금 계산기로 이어보기" CTA (URL 파라미터 연계)
9. SeoContent (FAQ + related)

---

## 5. 데이터 모델

파일: `src/data/incomeHomeAffordability.ts`

```ts
import {
  LTV_RATES,
  getPolicyLoanLimit,
  calcAcquisitionTax,
  calcBrokerageFee,
  calcMonthlyPayment,
  REGION_LABELS,
  OWNERSHIP_LABELS,
  type RegionType,
  type OwnershipType,
} from "./homePurchaseFund";

export const DSR_DEFAULT = 0.4;
export const STRESS_DSR_ADD_RATE = 1.5; // %p

export const DSR_OPTIONS = [
  { value: 0.35, label: "35%" },
  { value: 0.40, label: "40% (기본)" },
  { value: 0.50, label: "50%" },
];

export const PIR_BANDS = [
  { max: 5,        label: "낮음",     tone: "positive" },
  { max: 8,        label: "보통",     tone: "neutral"  },
  { max: 12,       label: "높음",     tone: "warning"  },
  { max: Infinity, label: "매우 높음", tone: "negative" },
];

export interface IncomeAffordabilityPreset {
  id: string;
  label: string;
  income: number;          // 원 단위 연소득
  cash: number;            // 원 단위 보유 현금
  existingDebtAnnual: number;
  regionType: RegionType;
  ownershipType: OwnershipType;
  rate: number;
  term: number;
  dsr: number;
}
```

`LTV_RATES`, `getPolicyLoanLimit`, `calcAcquisitionTax`, `calcBrokerageFee`, `calcMonthlyPayment`, `REGION_LABELS`, `OWNERSHIP_LABELS`는 `home-purchase-fund.ts`에서 그대로 import하여 사용한다 (신규 정의 없음, 정책 변경 시 한 곳만 수정).

---

## 6. 프리셋

```ts
export const PRESETS: IncomeAffordabilityPreset[] = [
  {
    id: "single_6000",
    label: "🟢 연봉 6천·1인 가구",
    income: 60000000,
    cash: 150000000,
    existingDebtAnnual: 0,
    regionType: "regulated",
    ownershipType: "none",
    rate: 4.0,
    term: 30,
    dsr: 0.40,
  },
  {
    id: "couple_9000",
    label: "🟡 부부합산 9천",
    income: 90000000,
    cash: 300000000,
    existingDebtAnnual: 0,
    regionType: "regulated",
    ownershipType: "none",
    rate: 4.0,
    term: 30,
    dsr: 0.40,
  },
  {
    id: "couple_12000_seoul",
    label: "🔴 부부합산 1.2억·서울 토허제",
    income: 120000000,
    cash: 600000000,
    existingDebtAnnual: 0,
    regionType: "overheated",
    ownershipType: "none",
    rate: 4.0,
    term: 30,
    dsr: 0.40,
  },
  {
    id: "regional_5000",
    label: "🔵 연봉 5천·비규제지역",
    income: 50000000,
    cash: 100000000,
    existingDebtAnnual: 0,
    regionType: "unregulated",
    ownershipType: "none",
    rate: 4.0,
    term: 30,
    dsr: 0.40,
  },
];
```

---

## 7. 계산 로직

### 7-1. DSR 기준 최대 대출 가능액

```text
연간 가용 원리금 = max(연소득 × DSR한도 − 기존 대출 연간 원리금, 0)
월 가용 원리금   = 연간 가용 원리금 / 12

월이율(스트레스 반영) = (대출금리 + 1.5%p) / 12
n = 대출기간(년) × 12

DSR기준 대출가능액 = 월 가용 원리금 × [(1+월이율)^n − 1] / [월이율 × (1+월이율)^n]
```

월이율이 0이면 `DSR기준 대출가능액 = 월 가용 원리금 × n`.

### 7-2. 적정 매매가 역산 (이분 탐색)

```text
탐색 범위: price ∈ [1억, 50억], 1천만원 단위 수렴, 반복 40회

각 price에 대해:
  ltv          = LTV_RATES[regionType][ownershipType]
  ltvLoan      = price × ltv / 100
  policyLimit  = getPolicyLoanLimit(regionType, price)
  maxLoan      = min(DSR기준 대출가능액, ltvLoan, policyLimit)
  tax          = calcAcquisitionTax(price, ownershipType, regionType)
  brokerage    = calcBrokerageFee(price)
  requiredCash = (price − maxLoan) + tax + brokerage

requiredCash(price)는 price에 대해 단조증가 →
requiredCash <= 보유현금 을 만족하는 최대 price를 이분 탐색으로 산출 = 적정 매매가
```

LTV가 0%(투기과열+토허제·2주택 이상)인 경우 `maxLoan = 0`이며, 이때도 동일한 이분 탐색이 성립한다(전액 자기자본 + 부대비용 ≤ 보유현금).

### 7-3. PIR / 월 상환 부담률

```text
PIR = 적정 매매가 / 연소득
월 상환액(표시용, 스트레스 미반영) = calcMonthlyPayment(최종 maxLoan, 대출금리, 대출기간)
월 상환 부담률 = 월 상환액 / (연소득 / 12) × 100
```

### 7-4. 부담 수준 배지 (`PIR_BANDS` 순회)

```text
PIR < 5        → "낮음" (positive)
5 <= PIR < 8   → "보통" (neutral)
8 <= PIR < 12  → "높음" (warning)
PIR >= 12      → "매우 높음" (negative)
```

### 7-5. 지역 유형별 비교표

위 7-1~7-3 로직을 `overheated` / `regulated` / `unregulated` 3종 지역유형에 대해 동일한 입력(연소득·보유현금·기존부채·금리·기간·DSR)으로 각각 계산해 비교표 행으로 렌더링한다. 현재 선택된 지역 유형 행은 강조 표시한다.

---

## 8. 화면 상세 설계

### 8-1. Hero

- eyebrow: `부동산 계산기`
- title: `소득 대비 집값 부담 계산기`
- description: `연봉과 보유 현금을 입력하면 DSR·LTV 기준 최대 대출 가능액과 적정 매매가, 연봉 대비 집값 배수(PIR)를 바로 계산합니다.`

### 8-2. InfoNotice

- `이 계산기는 2026년 3월 기준 LTV·DSR·취득세·중개보수 정책을 바탕으로 한 모의계산입니다.`
- `실제 대출 가능액은 신용평가, 기존 부채, 소득 증빙, 금융기관 정책에 따라 달라질 수 있습니다.`
- `최종 대출 조건은 반드시 금융기관을 통해 확인하세요.`

### 8-3. 입력 영역

| 그룹 | 입력 항목 | 컨트롤 | 기본값 |
|---|---|---|---|
| 소득·자산 | 연소득(세전) | 슬라이더+직접입력 (1천만~3억, 100만 단위) | 6,000만원 |
| 소득·자산 | 보유 현금 | 슬라이더+직접입력 (0~20억, 100만 단위) | 1.5억원 |
| 소득·자산 | 기존 대출 연간 원리금 | 숫자 입력 (0~5천만) | 0원 |
| 지역·보유 | 지역 유형 | 라디오 3종 (`hpf-radio-row` 패턴 재사용, name=`ihaRegion`) | 조정대상지역 |
| 지역·보유 | 현재 주택 보유 수 | 라디오 3종 (name=`ihaOwnership`) | 무주택 |
| 대출 조건 | 연 금리 | 슬라이더 (2~8%, 0.1%) | 4.0% |
| 대출 조건 | 대출 기간 | 셀렉트 (10/20/30/40년) | 30년 |
| 대출 조건 | DSR 한도 | 셀렉트 (`DSR_OPTIONS`) | 40% |

### 8-4. 결과 KPI (4개)

| 카드 | 표시값 예시 | 비고 |
|---|---:|---|
| 적정 매매가 (PRIMARY) | 약 7억 2,000만원 | `iha-kpi-card--primary` |
| DSR 기준 최대 대출 가능액 | 약 3억 6,000만원 | |
| 연봉 대비 집값 배수 (PIR) | 12.0배 — 매우 높음 배지 | 배지 색상은 `PIR_BANDS.tone` |
| 월 상환 부담률 | 월급의 38% | 월 상환액 병기 |

### 8-5. 결과 해석 문구

```text
연소득 6,000만원, 보유 현금 1억 5,000만원 기준으로
DSR 40% 한도에서 최대 약 3억 6,000만원까지 대출이 가능할 것으로 추정됩니다.
이를 반영한 적정 매매가는 약 7억 2,000만원이며, 연봉의 약 12.0배(매우 높음 구간)입니다.
월 상환액은 약 171만원으로 월급의 약 38%를 차지합니다.
```

### 8-6. 지역 유형별 비교표

| 지역 유형 | 적정 매매가 | 최대 대출 | PIR |
|---|---:|---:|---:|
| 투기과열+토허제 | X억 | X억 | X배 |
| 조정대상지역 | X억 | X억 | X배 (현재 선택, 강조) |
| 비규제지역 | X억 | X억 | X배 |

### 8-7. 비용 상세 내역 테이블

`home-purchase-fund`의 `hpf-table` 행 패턴과 동일하게 적정 매매가 기준으로 출력:

| 항목 | 금액 | 비고 |
|---|---:|---|
| 적정 매매가 | X억 | 역산 결과 |
| 최대 대출 가능액 | −X억 | DSR/LTV/정책한도 중 최소 |
| 필요 자기자본 | X억 | 매매가 − 대출 |
| 취득세(지방교육세 포함) | X만원 | 추정값 |
| 중개보수(상한 기준) | X만원 | 추정값 |
| 합계 필요 현금 | X억 | 보유 현금과 일치(이분 탐색 수렴값) |

### 8-8. CTA — 내집마련 자금 계산기로 이어보기

```text
"이 매매가 기준으로 필요 현금과 월 상환액을 더 자세히 보고 싶다면?"
[내집마련 자금 계산기에서 계산하기 →]
```

링크: `/tools/home-purchase-fund/?price={적정매매가(만원)}&region={regionType}&ownership={ownershipType}&rate={rate}&term={term}`

`home-purchase-fund.js`의 `loadParams()`가 이미 `price`, `region`, `ownership`, `rate`, `term`, `cash` 파라미터를 지원하므로 추가 작업 없이 연동 가능.

---

## 9. SeoContent 본문 설계

### 9-1. intro

```text
소득 대비 집값 부담 계산기는 연봉과 보유 현금을 입력하면 DSR(총부채원리금상환비율)과 LTV(주택담보대출비율) 기준으로 대출 가능액을 추정하고, 그 한도 안에서 살 수 있는 적정 매매가를 역산해주는 계산기입니다.

내집마련을 준비할 때 가장 먼저 막히는 질문은 "내 연봉과 모은 돈으로 어디까지 살 수 있을까"입니다. 이 계산기는 연소득의 일정 비율(DSR)을 한도로 한 대출 가능액과, 보유 현금에서 취득세·중개보수를 뺀 자기자본을 함께 고려해 적정 매매가를 계산합니다.

또한 적정 매매가가 연봉의 몇 배인지(PIR)와 월 상환액이 월급에서 차지하는 비율을 함께 보여줘, 단순히 "대출이 얼마나 나오는가"를 넘어 "이 정도 집값이 내 소득 대비 무리한 수준인가"까지 가늠할 수 있도록 설계했습니다.

계산 결과로 나온 적정 매매가를 기준으로 실제 필요한 현금과 부대비용을 더 자세히 보고 싶다면 내집마련 자금 계산기로 이어서 확인할 수 있습니다.
```

### 9-2. inputPoints

- 연소득(세전), 보유 현금, 기존 대출 연간 원리금을 입력하면 DSR 한도 내 최대 대출 가능액이 계산됩니다.
- 지역 유형(투기과열+토허제 / 조정대상지역 / 비규제지역)과 주택 보유 수에 따라 LTV·취득세 기준이 자동 적용됩니다.
- 대출 금리·기간·DSR 한도(35%/40%/50%)를 조정하면 적정 매매가와 PIR이 즉시 갱신됩니다.

### 9-3. criteria

- DSR 기본 한도는 40%이며, 스트레스 DSR 가산금리 1.5%p를 반영해 보수적으로 계산합니다.
- LTV·정책상 대출 한도·취득세·중개보수 기준은 `내집마련 자금 계산기`와 동일한 2026년 3월 기준 정책 참고값을 사용합니다.
- PIR(연봉 대비 집값 배수) 구간은 5배 미만(낮음), 5~8배(보통), 8~12배(높음), 12배 이상(매우 높음)으로 구분한 일반적 해석 기준입니다.

---

## 10. FAQ

```ts
export const PAGE_FAQ = [
  {
    question: "적정 매매가는 어떻게 계산되나요?",
    answer: "DSR 한도 내 최대 대출 가능액과 보유 현금에서 취득세·중개보수를 뺀 자기자본을 더해, 그 범위 안에서 살 수 있는 가장 높은 매매가를 역산한 추정값입니다.",
  },
  {
    question: "DSR 40%는 모든 은행에 동일하게 적용되나요?",
    answer: "차주 단위 DSR 규제 비율이며 은행, 상품, 소득 구간, 정책에 따라 35~50% 등으로 달라질 수 있습니다. 이 계산기에서는 DSR 한도를 직접 선택할 수 있습니다.",
  },
  {
    question: "PIR(소득 대비 집값 배수)이 높으면 무조건 무리한 건가요?",
    answer: "PIR이 높을수록 소득 대비 집값 부담이 크다는 의미이지만, 자산·소득 증가 가능성이나 거주 목적에 따라 판단 기준은 달라질 수 있어 참고 지표로 활용하는 것이 좋습니다.",
  },
  {
    question: "토허제 지역은 왜 적정 매매가가 낮게 나오나요?",
    answer: "투기과열지구+토허제는 LTV가 50%(2주택 이상은 0%)로 낮아 대출 한도가 줄고, 그만큼 자기자본 부담이 커지기 때문입니다.",
  },
  {
    question: "기존 대출이 있으면 결과가 어떻게 달라지나요?",
    answer: "기존 대출의 연간 원리금 상환액만큼 DSR 한도에서 차감되어 신규 대출 가능액과 적정 매매가가 함께 줄어듭니다.",
  },
  {
    question: "계산 결과와 실제 대출 한도가 다른 이유는 무엇인가요?",
    answer: "신용점수, 기존 대출 종류, 소득 증빙 방식, 스트레스 DSR 단계 적용 여부 등에 따라 실제 한도는 이 계산기 결과와 다를 수 있습니다.",
  },
];
```

---

## 11. 관련 링크 / CTA

```ts
export const relatedLinks = [
  { href: "/tools/home-purchase-fund/", label: "내집마련 자금 계산기" },
  { href: "/tools/salary/", label: "연봉 실수령액 계산기" },
  { href: "/tools/retirement/", label: "퇴직금 계산기" },
];
```

---

## 12. 스타일 설계

SCSS 파일: `src/styles/scss/pages/_income-home-affordability.scss`

- prefix: `iha-`
- `home-purchase-fund.scss`의 `.hpf-section`, `.hpf-presets`, `.hpf-preset-btn`, `.hpf-price-row`, `.hpf-radio-group/row`, `.hpf-kpi-grid/card`, `.hpf-table`, `.hpf-info-box` 패턴을 `iha-` 접두사로 동일하게 정의 (룩앤필 일관성 유지)
- 추가 클래스:
  - `.iha-pir-badge`, `.iha-pir-badge--positive|neutral|warning|negative` — PIR 부담 배지 색상
  - `.iha-region-table` — 지역 유형별 비교표, 현재 선택 행은 `.iha-region-table__row--active`
  - `.iha-cta-box` — home-purchase-fund 연계 CTA 박스

반응형: `home-purchase-fund`와 동일 기준(768px 이하 입력 1열, KPI 2열 → 480px 이하 1열, 표는 `overflow-x: auto`)

---

## 13. 클라이언트 스크립트 설계

파일: `public/scripts/income-home-affordability.js`

### 13-1. 재사용 함수 (home-purchase-fund.js와 동일 정의)

```js
function getLTV(regionType, ownershipType) {}
function getPolicyLimit(regionType, price) {}
function calcAcquisitionTax(price, ownershipType, regionType) {}
function calcBrokerageFee(price) {}
function calcMonthlyPayment(loan, annualRate, termYears) {}
```

### 13-2. 신규 함수

```js
function calcDsrLoanLimit(income, existingDebtAnnual, dsrRatio, rate, termYears) {}
function calcAffordablePrice(dsrLoanLimit, cash, regionType, ownershipType) {} // 이분 탐색
function getPirBand(pir) {}
function calculate() {}
function renderRegionTable(input, dsrLoanLimit) {}
function buildHomePurchaseFundLink(price, regionType, ownershipType, rate, term) {}
```

### 13-3. DOM id 규칙

```text
iha-income-slider / iha-income-input / iha-income-label
iha-cash-slider / iha-cash-input / iha-cash-label
iha-existing-debt-input
ihaRegion (radio name)
ihaOwnership (radio name)
iha-rate-slider / iha-rate-label
iha-term-select
iha-dsr-select

iha-affordable-price
iha-max-loan
iha-pir
iha-pir-badge
iha-monthly-burden
iha-interpretation
iha-region-table-tbody
iha-breakdown-tbody
iha-cta-link
```

### 13-4. URL 파라미터

`saveParams()` / `loadParams()`는 `home-purchase-fund.js`와 동일한 패턴으로 `income`, `cash`, `debt`, `region`, `ownership`, `rate`, `term`, `dsr`을 직렬화한다.

---

## 14. 검증 케이스

| 케이스 | 입력 | 기대 |
|---|---|---|
| 기본 케이스 | 연소득 6천, 현금 1.5억, 조정지역, 무주택, 4.0%, 30년, DSR 40% | 적정매매가 산출, requiredCash ≈ 보유현금 |
| 토허제 + 2주택 | regionType=overheated, ownershipType=two_plus | LTV 0% → maxLoan=0, 적정매매가 = 보유현금에서 취득세·중개비 역산한 값 |
| 기존부채 과다 | existingDebtAnnual ≥ 연소득×DSR | DSR기준 대출가능액 0, 적정매매가는 현금만으로 결정 |
| PIR 경계값 | PIR = 5, 8, 12 정확히 걸치는 입력 | 배지가 각각 "낮음/보통", "보통/높음", "높음/매우높음" 경계에서 올바르게 전환 |
| 지역 비교표 | 동일 입력에서 3개 지역 유형 | 투기과열 < 조정 ≈ 비규제 순으로 적정매매가 차이 발생 |
| CTA 링크 | 임의 입력 | `/tools/home-purchase-fund/?price=...` 파라미터가 home-purchase-fund에서 정상 로드됨 |

---

## 15. SEO / 메타

```ts
const pageTitle = "소득 대비 집값 부담 계산기";
const metaTitle = "소득 대비 집값 부담 계산기 — 내 연봉으로 살 수 있는 집값은? | 비교계산소";
const metaDescription =
  "연봉과 보유 현금을 입력하면 DSR·LTV 기준 최대 대출 가능액과 적정 매매가를 계산합니다. 연봉 대비 집값 배수(PIR), 월 상환 부담률까지 한 번에 확인하세요.";
```

OG 이미지: `public/og/tools/income-home-affordability.png` (후속 생성)

---

## 16. 후속 확장

- 생애최초 우대 LTV 토글 — `home-purchase-fund` LTV 테이블에 생애최초 전용 구간을 추가한 뒤 두 계산기에 동시 반영
- `국평 아파트 TOP10 실거래가` 시리즈와 연결해 "적정 매매가대 실제 단지 시세" 비교 제공
- `/reports/` 인터랙티브 형태로 PIR 지역별 분포 리포트 확장

---

## 17. 구현 체크리스트

- [ ] `src/data/incomeHomeAffordability.ts` 생성 (PAGE_META, 프리셋, FAQ, related, DSR/PIR 상수, homePurchaseFund 함수 re-export)
- [ ] `src/pages/tools/income-home-affordability.astro` 생성
- [ ] `public/scripts/income-home-affordability.js` 생성 (이분 탐색 포함)
- [ ] `src/styles/scss/pages/_income-home-affordability.scss` 생성
- [ ] `src/styles/app.scss` 등록
- [ ] `src/data/tools.ts` 등록 (category: realestate)
- [ ] `public/sitemap.xml` URL 추가
- [ ] `home-purchase-fund.astro`에 상호 CTA 추가
- [ ] `npm run build` 성공
- [ ] 모바일 레이아웃 확인
- [ ] 검증 케이스(§14) 확인
