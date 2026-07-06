# 삼성전자 주택대출 복지 계산기 설계 문서

> 작성일: 2026-07-01  
> 콘텐츠 유형: `/tools/` 계산기 + 해설형 SEO 콘텐츠  
> 구현 대상 URL: `/tools/samsung-electronics-housing-loan-benefit-calculator/`  
> 연결 기획 문서: `docs/plan/202607/samsung-electronics-housing-loan-benefit-calculator.md`  
> 핵심 안전장치: `5억 원·연 1.5%`는 삼성전자 공식 확정값이 아니라 대표 시뮬레이션 입력값으로 처리한다.

---

## 1. 문서 개요

- 구현 대상: 삼성전자 주택대출 복지 계산기
- 권장 slug: `samsung-electronics-housing-loan-benefit-calculator`
- URL: `/tools/samsung-electronics-housing-loan-benefit-calculator/`
- 카테고리: 연봉·복지·대기업 총보상
- 핵심 질문:
  - 삼성전자 주택대출 복지를 돈으로 환산하면 얼마인가?
  - 5억 원을 연 1.5%로 빌리면 시중금리 대비 월·연 얼마를 아끼는가?
  - 이 복지 혜택을 세전 연봉으로 환산하면 어느 정도 가치인가?
- 핵심 출력:
  - 연간 이자 절감액
  - 월 이자 절감액
  - 대출기간 총 이자 절감액
  - 세전 연봉 환산액
  - 시중금리별 민감도
  - 대출원금별 민감도

---

## 2. 제품 방향

### 2.1 페이지 한 줄 정의

`사내 주택대출 복지를 시중대출과 비교해 월 현금흐름과 세전 연봉 가치로 환산하는 계산기`

### 2.2 사용자가 얻는 것

- “5억·1.5%” 시나리오의 대략적인 경제적 가치
- 본인의 예상 대출원금, 복지금리, 시중금리를 넣은 맞춤 결과
- 연봉표에 드러나지 않는 금융 복지의 체감 규모
- 삼성전자 복지 조건을 공식 확정값으로 오해하지 않도록 하는 데이터 신뢰도 안내
- 대기업 총보상 비교 콘텐츠로 이어지는 탐색 경로

### 2.3 피해야 할 것

- `삼성전자 주택대출은 무조건 5억·1.5%다`처럼 보이는 표현
- 사내대출 과세 여부를 단정하는 표현
- 주택담보대출 갈아타기를 권유하는 투자·금융 자문형 표현
- 실제 대출 가능 여부를 보장하는 문구
- 회사 내부 규정을 공식 문서 없이 확정 수치로 표시하는 것

---

## 3. 데이터 신뢰도 설계

### 3.1 배지 체계

```ts
export type BenefitEvidenceBadge =
  | "공식"
  | "보도 기준"
  | "사용자 입력값"
  | "시뮬레이션"
  | "확인 필요";
```

| 배지 | 사용 조건 | 예시 |
|---|---|---|
| 공식 | 삼성전자 공식 문서 또는 공시에서 확인된 수치 | 공식 복리후생 항목 |
| 보도 기준 | 언론 보도로 확인된 수치 | 특정 시점의 복지금리 보도 |
| 사용자 입력값 | 계산기에서 사용자가 직접 입력한 값 | 대출원금 5억 원, 복지금리 1.5% |
| 시뮬레이션 | 계산 편의를 위한 기본 가정 | 시중금리 4.0%, 세율 24% |
| 확인 필요 | 공개 근거가 부족하거나 최신 확인이 필요한 값 | 실제 사내대출 한도·자격 |

### 3.2 상단 필수 안내

```text
이 계산기는 공개 자료와 사용자가 입력한 조건을 바탕으로 사내대출 복지의 경제적 가치를 추정합니다. 삼성전자 실제 주택자금 대출 한도, 금리, 대상, 재직 조건, 과세 여부는 회사 내부 규정과 개인 상황에 따라 달라질 수 있습니다.
```

### 3.3 대표 시나리오 표기 원칙

상단에는 다음처럼 표시한다.

```text
대표 시나리오
대출 5억 원 · 복지금리 1.5% · 시중금리 4.0%
배지: 시뮬레이션
```

본문과 FAQ에서는 `대표 시나리오`, `사용자 입력값`, `가정값`이라는 단어를 반복해 공식값 오해를 줄인다.

---

## 4. SEO 설계

### 4.1 SEO title

권장:

```text
삼성전자 주택대출 복지 계산기 | 5억 1.5% 이자 이득 계산
```

대안:

```text
삼성전자 주택자금 대출 복지 계산기 | 연봉 환산 이득 비교
```

```text
삼성전자 복지 계산기 | 주택대출 5억이면 실제 이득 얼마?
```

### 4.2 Meta description

```text
삼성전자 주택자금 대출 복지를 시중금리와 비교해 연간 이자 절감액, 월 절감액, 세전 연봉 환산액으로 계산합니다. 5억 원·연 1.5% 시나리오도 바로 확인할 수 있습니다.
```

### 4.3 H1

```text
삼성전자 주택대출 복지 계산기
```

### 4.4 H1 하단 리드

```text
5억 원을 연 1.5%로 빌릴 수 있다면 시중금리 대비 이자를 얼마나 아낄 수 있을까요? 사내대출 복지를 월 절감액, 연 절감액, 세전 연봉 환산액으로 계산합니다.
```

### 4.5 H2 구조

- 5억 연 1.5%면 실제 이득 얼마?
- 내 조건으로 삼성전자 주택대출 복지 계산하기
- 시중금리가 오르면 복지 가치는 얼마나 커질까
- 대출원금별 이자 절감액 비교
- 사내대출 복지를 연봉으로 환산하는 방법
- 세금과 과세 가능성은 어떻게 봐야 할까
- 삼성전자 주택대출 복지 계산 FAQ

### 4.6 키워드 매핑

| 키워드 | 노출 위치 |
|---|---|
| 삼성전자 주택대출 | title, H1 하단 리드, FAQ |
| 삼성전자 주택자금 대출 | meta description, 본문 첫 섹션 |
| 삼성전자 복지 | H2, 내부 링크 |
| 삼성전자 복지 계산기 | title 대안, FAQ |
| 5억 1.5% 대출 이자 | title, 대표 시나리오 카드 |
| 사내대출 이득 | 본문 해설, 계산 결과 |
| 대기업 주택대출 복지 | 확장 섹션, 관련 콘텐츠 |
| 세전 연봉 환산 | 결과 카드, 해설 섹션 |

---

## 5. 계산 로직 설계

### 5.1 MVP 계산 방식

MVP는 `단순 연간 이자 차이`를 기본 계산식으로 사용한다. 이는 첫 화면에서 직관적인 결과를 보여주기 좋고, 사내대출 조건이 완전히 확인되지 않아도 사용자 입력 기반 계산기로 안전하게 작동한다.

```text
복지대출 연 이자 = 대출원금 × 복지금리
시중대출 연 이자 = 대출원금 × 시중금리
연간 절감액 = 시중대출 연 이자 - 복지대출 연 이자
월 절감액 = 연간 절감액 ÷ 12
기간 총 절감액 = 연간 절감액 × 대출기간
세전 연봉 환산액 = 연간 절감액 ÷ (1 - 추정 세율)
```

### 5.2 대표 시나리오 계산

입력:

- 대출원금: 500,000,000원
- 복지금리: 1.5%
- 시중금리: 4.0%
- 대출기간: 10년
- 추정 세율: 24%

출력:

| 항목 | 계산 | 결과 |
|---|---:|---:|
| 복지대출 연 이자 | 5억 × 1.5% | 750만 원 |
| 시중대출 연 이자 | 5억 × 4.0% | 2,000만 원 |
| 연간 절감액 | 2,000만 - 750만 | 1,250만 원 |
| 월 절감액 | 1,250만 ÷ 12 | 약 104만 원 |
| 10년 단순 절감액 | 1,250만 × 10 | 1억 2,500만 원 |
| 세전 연봉 환산액 | 1,250만 ÷ 0.76 | 약 1,645만 원 |

### 5.3 입력값 제한

| 입력 | 최소 | 최대 | 기본값 | 단위 |
|---|---:|---:|---:|---|
| 대출원금 | 1,000만 | 10억 | 5억 | 원 |
| 복지금리 | 0.0 | 10.0 | 1.5 | % |
| 시중금리 | 0.0 | 15.0 | 4.0 | % |
| 대출기간 | 1 | 40 | 10 | 년 |
| 추정 세율 | 0 | 60 | 24 | % |

검증 규칙:

- 시중금리가 복지금리보다 낮으면 절감액이 음수로 표시될 수 있다.
- 음수 결과는 `시중금리보다 복지금리가 높아 이득이 없습니다`로 안내한다.
- 세율이 100% 이상이면 세전 환산 계산을 하지 않는다.
- 대출원금이 0이면 모든 결과를 0으로 처리한다.

### 5.4 확장 계산

2차 구현에서 아래 방식을 추가할 수 있다.

| 상환 방식 | 구현 우선순위 | 설명 |
|---|---:|---|
| 단순 이자 | 1 | MVP 기본 |
| 만기일시상환 | 1 | 단순 이자와 거의 동일 |
| 원금균등 | 2 | 매월 원금 동일 상환 |
| 원리금균등 | 2 | 금융 계산식 필요 |
| 거치 후 상환 | 3 | 사내대출 규정 확인 후 |

---

## 6. 데이터 모델 설계

파일:

```text
src/data/samsungElectronicsHousingLoanBenefit.ts
```

### 6.1 타입 정의

```ts
export type BenefitEvidenceBadge =
  | "공식"
  | "보도 기준"
  | "사용자 입력값"
  | "시뮬레이션"
  | "확인 필요";

export type RepaymentType = "simpleInterest" | "interestOnly" | "equalPrincipal" | "equalPayment";

export interface LoanBenefitMeta {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  updatedAt: string;
  dataAsOf: string;
  notice: string;
}

export interface HousingLoanScenario {
  id: string;
  label: string;
  description: string;
  companyName: string;
  principalKrw: number;
  benefitRatePercent: number;
  marketRatePercent: number;
  years: number;
  taxRatePercent: number;
  repaymentType: RepaymentType;
  evidenceBadge: BenefitEvidenceBadge;
  sourceLabel: string;
  note: string;
}

export interface HousingLoanResult {
  benefitAnnualInterestKrw: number;
  marketAnnualInterestKrw: number;
  annualSavingKrw: number;
  monthlySavingKrw: number;
  totalSavingKrw: number;
  grossSalaryEquivalentKrw: number | null;
  rateGapPercentPoint: number;
}

export interface SensitivityRow {
  label: string;
  principalKrw: number;
  benefitRatePercent: number;
  marketRatePercent: number;
  annualSavingKrw: number;
  monthlySavingKrw: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}
```

### 6.2 메타 데이터

```ts
export const SEHL_META: LoanBenefitMeta = {
  slug: "samsung-electronics-housing-loan-benefit-calculator",
  title: "삼성전자 주택대출 복지 계산기",
  seoTitle: "삼성전자 주택대출 복지 계산기 | 5억 1.5% 이자 이득 계산",
  description:
    "삼성전자 주택자금 대출 복지를 시중금리와 비교해 연간 이자 절감액, 월 절감액, 세전 연봉 환산액으로 계산합니다.",
  updatedAt: "2026-07-01",
  dataAsOf: "2026년 7월 1일 대표 시뮬레이션 기준",
  notice:
    "실제 삼성전자 주택자금 대출 한도, 금리, 대상, 재직 조건, 과세 여부는 회사 내부 규정과 개인 상황에 따라 달라질 수 있습니다.",
};
```

### 6.3 기본 시나리오

```ts
export const SEHL_DEFAULT_SCENARIO: HousingLoanScenario = {
  id: "samsung-5eok-1-5-vs-4-0",
  label: "5억 원·연 1.5% 대표 시나리오",
  description: "대출 5억 원, 복지금리 1.5%, 시중금리 4.0%를 비교합니다.",
  companyName: "삼성전자",
  principalKrw: 500000000,
  benefitRatePercent: 1.5,
  marketRatePercent: 4.0,
  years: 10,
  taxRatePercent: 24,
  repaymentType: "simpleInterest",
  evidenceBadge: "시뮬레이션",
  sourceLabel: "사용자 제안 시나리오, 공식 확인 필요",
  note:
    "5억 원·연 1.5%는 계산 예시이며 실제 사내대출 조건은 삼성전자 내부 규정에 따라 달라질 수 있습니다.",
};
```

### 6.4 계산 함수

```ts
export function calculateSimpleInterestBenefit(
  principalKrw: number,
  benefitRatePercent: number,
  marketRatePercent: number,
  years: number,
  taxRatePercent: number
): HousingLoanResult {
  const benefitRate = benefitRatePercent / 100;
  const marketRate = marketRatePercent / 100;
  const taxRate = taxRatePercent / 100;
  const benefitAnnualInterestKrw = principalKrw * benefitRate;
  const marketAnnualInterestKrw = principalKrw * marketRate;
  const annualSavingKrw = marketAnnualInterestKrw - benefitAnnualInterestKrw;
  const monthlySavingKrw = annualSavingKrw / 12;
  const totalSavingKrw = annualSavingKrw * years;
  const grossSalaryEquivalentKrw =
    taxRate >= 1 ? null : annualSavingKrw / (1 - taxRate);

  return {
    benefitAnnualInterestKrw,
    marketAnnualInterestKrw,
    annualSavingKrw,
    monthlySavingKrw,
    totalSavingKrw,
    grossSalaryEquivalentKrw,
    rateGapPercentPoint: marketRatePercent - benefitRatePercent,
  };
}
```

### 6.5 포맷 함수

```ts
export function formatKoreanWon(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (abs >= 100000000) {
    const eok = abs / 100000000;
    return `${sign}${Number.isInteger(eok) ? eok.toFixed(0) : eok.toFixed(1)}억 원`;
  }

  if (abs >= 10000) {
    const man = abs / 10000;
    return `${sign}${Math.round(man).toLocaleString("ko-KR")}만 원`;
  }

  return `${sign}${Math.round(abs).toLocaleString("ko-KR")}원`;
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}
```

---

## 7. 페이지 파일 설계

### 7.1 파일 구성

```text
src/pages/tools/samsung-electronics-housing-loan-benefit-calculator.astro
src/data/samsungElectronicsHousingLoanBenefit.ts
public/scripts/samsung-electronics-housing-loan-benefit-calculator.js
src/styles/scss/pages/_samsung-electronics-housing-loan-benefit-calculator.scss
```

등록 파일:

```text
src/data/tools.ts
src/styles/app.scss
public/sitemap.xml
```

선택 등록:

```text
src/pages/index.astro
```

### 7.2 Astro 페이지 구조

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import { withBase } from "../../utils/base";
import {
  SEHL_META,
  SEHL_DEFAULT_SCENARIO,
  SEHL_FAQ,
  SEHL_SEO_INTRO,
  SEHL_SEO_CRITERIA,
  calculateSimpleInterestBenefit,
  formatKoreanWon,
} from "../../data/samsungElectronicsHousingLoanBenefit";

const defaultResult = calculateSimpleInterestBenefit(
  SEHL_DEFAULT_SCENARIO.principalKrw,
  SEHL_DEFAULT_SCENARIO.benefitRatePercent,
  SEHL_DEFAULT_SCENARIO.marketRatePercent,
  SEHL_DEFAULT_SCENARIO.years,
  SEHL_DEFAULT_SCENARIO.taxRatePercent
);
---
```

### 7.3 HTML 섹션 순서

1. `BaseLayout`
2. `SiteHeader`
3. `CalculatorHero`
4. 안전 안내 `InfoNotice`
5. 대표 결과 카드
6. 계산기 입력 패널
7. 결과 카드 그리드
8. 시중금리별 비교 테이블
9. 대출원금별 비교 테이블
10. 해설 본문
11. FAQ
12. `SeoContent`
13. JSON 데이터 script
14. 클라이언트 JS

---

## 8. UI 설계

### 8.1 전체 톤

- 금융 계산기이므로 차분하고 신뢰감 있는 톤
- 카드 남발을 피하고 계산 영역과 결과 영역을 명확히 구분
- 삼성 브랜드 색을 직접적으로 흉내 내기보다 비교계산소의 기존 디자인 톤 유지
- 숫자 결과는 크고 분명하게, 근거·주의 문구는 바로 아래 작게 배치

### 8.2 주요 섹션 클래스

페이지 prefix:

```text
sehl-
```

권장 클래스:

```text
.sehl-page
.sehl-hero-summary
.sehl-assumption-bar
.sehl-calculator
.sehl-input-panel
.sehl-result-panel
.sehl-result-grid
.sehl-result-card
.sehl-badge
.sehl-scenario-table
.sehl-explain-section
.sehl-warning-box
.sehl-related-grid
```

### 8.3 Hero

구성:

- eyebrow: `연봉·복지 계산기`
- H1: `삼성전자 주택대출 복지 계산기`
- lead: `5억 원을 연 1.5%로 빌릴 수 있다면...`
- update: `2026년 7월 1일 시뮬레이션 기준`
- badge: `시뮬레이션`

Hero 하단 KPI:

| KPI | 값 |
|---|---|
| 연간 절감액 | 약 1,250만 원 |
| 월 절감액 | 약 104만 원 |
| 세전 연봉 환산 | 약 1,645만 원 |
| 금리 차이 | 2.5%p |

### 8.4 계산기 입력 패널

입력 UI:

- 대출원금: 숫자 input + quick button
- 복지금리: number input + range
- 시중금리: number input + quick button
- 대출기간: number input
- 세율: segmented quick button + number input
- 상환방식: segmented control, MVP에서는 `단순 이자`만 active, 나머지는 disabled 또는 `준비 중`

권장 quick buttons:

```text
대출원금: 1억, 3억, 5억, 7억
시중금리: 3.5%, 4.0%, 4.5%, 5.0%
세율: 15%, 24%, 35%
```

### 8.5 결과 패널

결과 우선순위:

1. 연간 이자 절감액
2. 월 이자 절감액
3. 총 절감액
4. 세전 연봉 환산액

결과 문구 예시:

```text
연간 약 1,250만 원 절감
시중금리 4.0%와 복지금리 1.5%의 차이 2.5%p 기준입니다.
```

```text
월 약 104만 원 절감
월 현금흐름으로 보면 관리비·식비·교육비처럼 바로 체감되는 금액입니다.
```

```text
세전 연봉 약 1,645만 원 가치
추정 세율 24%를 적용한 단순 환산값입니다.
```

### 8.6 비교 테이블

#### 시중금리별 민감도

| 시중금리 | 금리 차이 | 연간 절감액 | 월 절감액 |
|---:|---:|---:|---:|
| 3.5% | 2.0%p | 1,000만 원 | 약 83만 원 |
| 4.0% | 2.5%p | 1,250만 원 | 약 104만 원 |
| 4.5% | 3.0%p | 1,500만 원 | 125만 원 |
| 5.0% | 3.5%p | 1,750만 원 | 약 146만 원 |

#### 대출원금별 민감도

| 대출원금 | 연간 절감액 | 월 절감액 |
|---:|---:|---:|
| 1억 원 | 250만 원 | 약 21만 원 |
| 3억 원 | 750만 원 | 약 63만 원 |
| 5억 원 | 1,250만 원 | 약 104만 원 |
| 7억 원 | 1,750만 원 | 약 146만 원 |

---

## 9. 클라이언트 JS 설계

파일:

```text
public/scripts/samsung-electronics-housing-loan-benefit-calculator.js
```

### 9.1 구현 원칙

- IIFE 패턴 사용
- 전역 변수 노출 금지
- DOM은 `data-*` 속성으로 조회
- 입력 즉시 계산 결과 반영
- URL state는 2차 구현으로 미룸
- Chart.js 없이 CSS bar와 테이블로 시작

### 9.2 DOM data 속성

입력:

```html
<input data-sehl-input="principal" />
<input data-sehl-input="benefit-rate" />
<input data-sehl-input="market-rate" />
<input data-sehl-input="years" />
<input data-sehl-input="tax-rate" />
```

결과:

```html
<output data-sehl-output="annual-saving"></output>
<output data-sehl-output="monthly-saving"></output>
<output data-sehl-output="total-saving"></output>
<output data-sehl-output="gross-salary"></output>
<output data-sehl-output="rate-gap"></output>
```

빠른 버튼:

```html
<button data-sehl-preset="principal" data-value="500000000">5억</button>
<button data-sehl-preset="market-rate" data-value="4.5">4.5%</button>
```

### 9.3 JS 흐름

```text
init
  -> collectElements
  -> bindInputs
  -> bindPresetButtons
  -> calculateAndRender

calculateAndRender
  -> readState
  -> validateState
  -> calculate
  -> renderResultCards
  -> renderSensitivityRows
  -> renderWarnings
```

### 9.4 예외 처리

- 입력값이 숫자가 아니면 기본값으로 복원
- 음수 입력은 0으로 보정
- 시중금리 < 복지금리이면 결과 색상을 경고 톤으로 변경
- 세율 >= 100이면 세전 연봉 환산 결과에 `계산 불가` 표시

---

## 10. SCSS 설계

파일:

```text
src/styles/scss/pages/_samsung-electronics-housing-loan-benefit-calculator.scss
```

### 10.1 스타일 원칙

- prefix `sehl-` 일관 적용
- 중첩은 3단계 이하
- 모바일 320px에서 가로 스크롤 방지
- 결과 숫자는 tabular-nums 적용
- 버튼과 input 높이 고정으로 레이아웃 흔들림 방지
- 색상은 기존 사이트 변수 우선 사용

### 10.2 레이아웃

```scss
.sehl-page {
  display: grid;
  gap: var(--space-8);
}

.sehl-calculator {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(320px, 1.05fr);
  gap: var(--space-6);
}

@media (max-width: 860px) {
  .sehl-calculator {
    grid-template-columns: 1fr;
  }
}
```

### 10.3 결과 카드

```scss
.sehl-result-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
}

.sehl-result-card {
  min-height: 132px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: var(--space-5);
}

.sehl-result-card__value {
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
}

@media (max-width: 640px) {
  .sehl-result-grid {
    grid-template-columns: 1fr;
  }
}
```

### 10.4 배지

```scss
.sehl-badge {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  border-radius: 999px;
  padding: 0 10px;
  font-size: 0.78rem;
  font-weight: 700;
}

.sehl-badge--simulation {
  background: #eef2ff;
  color: #3730a3;
}

.sehl-badge--needs-check {
  background: #fff7ed;
  color: #9a3412;
}
```

---

## 11. 접근성 설계

- 모든 input에 label 연결
- 결과 output에 `aria-live="polite"` 적용
- quick button은 현재 선택 상태를 `aria-pressed`로 표시
- 표에는 caption 제공
- 금액 결과는 색상만으로 양수·음수를 구분하지 않고 문구를 함께 표시
- 모바일에서 input 확대 시 레이아웃이 깨지지 않도록 최소 16px 폰트 사용

예시:

```html
<label for="sehl-principal">대출원금</label>
<input id="sehl-principal" data-sehl-input="principal" inputmode="numeric" />
```

```html
<output data-sehl-output="annual-saving" aria-live="polite">
  약 1,250만 원
</output>
```

---

## 12. JSON-LD 설계

### 12.1 WebApplication

```ts
const calculatorJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SEHL_META.title,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: `${siteBase}/tools/${SEHL_META.slug}/`,
  description: SEHL_META.description,
  inLanguage: "ko-KR",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "KRW",
  },
};
```

### 12.2 FAQPage

FAQ는 실제 검색 질문형으로 구성한다.

```ts
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: SEHL_FAQ.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};
```

---

## 13. FAQ 설계

최소 7개:

1. 삼성전자 주택대출 복지 금리는 정말 1.5%인가요?
2. 5억 원을 1.5%로 빌리면 얼마를 아끼나요?
3. 이 금액을 연봉으로 환산하면 얼마인가요?
4. 사내대출 이득도 세금을 내야 하나요?
5. 원리금균등 상환이면 결과가 달라지나요?
6. 삼성전자 말고 다른 회사 복지도 비교할 수 있나요?
7. 기존 주택담보대출을 사내대출로 갈아타는 계산도 가능한가요?
8. 시중금리는 어떤 값을 넣어야 하나요?

답변 원칙:

- 공식 확정값 단정 금지
- 계산 예시와 실제 조건 분리
- 세무·대출 자문으로 보이지 않게 안내
- 사용자가 다음 행동으로 `회사 규정 확인`, `본인 금리 입력`, `기존 대출 조건 확인`을 하도록 유도

---

## 14. 관련 콘텐츠 설계

우선 내부 링크 후보:

- `/reports/samsung-ds-bonus-calculation-guide/`
- `/tools/samsung-bonus/`
- `/reports/samsung-bonus-rank-net-comparison-2026/`
- `/reports/samsung-electronics-stock-2016-vs-2026/`
- `/tools/sk-hynix-bonus/`
- `/tools/salary/`
- `/tools/loan-refinancing-calculator/`

관련 카드 문구:

```text
삼성전자 성과급 계산기
성과급과 금융 복지를 함께 보면 총보상 체감액이 달라집니다.
```

```text
대출 갈아타기 계산기
기존 주택담보대출과 사내대출의 이자 차이를 함께 비교해보세요.
```

---

## 15. 등록 작업 체크리스트

새 계산기 추가 시:

- [ ] `src/pages/tools/samsung-electronics-housing-loan-benefit-calculator.astro` 생성
- [ ] `src/data/samsungElectronicsHousingLoanBenefit.ts` 생성
- [ ] `public/scripts/samsung-electronics-housing-loan-benefit-calculator.js` 생성
- [ ] `src/styles/scss/pages/_samsung-electronics-housing-loan-benefit-calculator.scss` 생성
- [ ] `src/data/tools.ts`에 slug 등록
- [ ] `src/styles/app.scss`에 `@use` 추가
- [ ] `public/sitemap.xml`에 URL 추가
- [ ] 홈 노출 필요 시 `src/pages/index.astro` 등록
- [ ] `npm run build` 성공 확인

---

## 16. 테스트 시나리오

### 16.1 기본값

입력:

- 대출원금 5억
- 복지금리 1.5%
- 시중금리 4.0%
- 대출기간 10년
- 세율 24%

기대 결과:

- 복지대출 연 이자: 750만 원
- 시중대출 연 이자: 2,000만 원
- 연간 절감액: 1,250만 원
- 월 절감액: 약 104만 원
- 총 절감액: 1억 2,500만 원
- 세전 연봉 환산액: 약 1,645만 원

### 16.2 시중금리 5.0%

기대 결과:

- 금리 차이: 3.5%p
- 연간 절감액: 1,750만 원
- 월 절감액: 약 146만 원

### 16.3 시중금리 1.0%, 복지금리 1.5%

기대 결과:

- 연간 절감액: -250만 원
- 경고 문구: `입력한 시중금리가 복지금리보다 낮아 이자 절감 효과가 없습니다.`

### 16.4 세율 100%

기대 결과:

- 세전 연봉 환산액: `계산 불가`
- 안내 문구: `세율은 100% 미만으로 입력해야 합니다.`

---

## 17. 품질 기준

콘텐츠:

- `5억·1.5%`가 공식 확정값처럼 보이지 않을 것
- 대표 결과에 `시뮬레이션` 배지를 붙일 것
- 실제 조건 확인 필요 문구가 첫 화면에 있을 것
- 세금 가능성을 단정하지 않을 것
- 모든 금액을 한국식 단위로 표시할 것

UX:

- 모바일 320px에서 가로 스크롤이 없을 것
- 결과 카드가 입력 변경 즉시 갱신될 것
- quick button 선택 상태가 명확할 것
- 긴 표는 모바일에서 카드형 또는 가로 스크롤 컨테이너로 처리할 것

코드:

- JS는 IIFE로 작성할 것
- 전역 변수 사용 금지
- SCSS prefix `sehl-` 유지
- 데이터와 계산 함수는 TypeScript 데이터 파일에 분리
- build 통과 필수

SEO:

- title에 `삼성전자 주택대출` 포함
- description에 `연간 이자 절감액`, `세전 연봉 환산액` 포함
- FAQ 7개 이상
- 관련 삼성전자·대기업 복지 콘텐츠 링크 포함
- sitemap 등록

---

## 18. 구현 우선순위

### 1차 MVP

1. 데이터 파일과 단순 이자 계산 함수
2. 계산기 페이지
3. 입력 즉시 결과 갱신 JS
4. 결과 카드 4개
5. 시중금리별·대출원금별 민감도 표
6. FAQ와 SEO 본문
7. tools 등록, 스타일 등록, sitemap 등록
8. build 검증

### 2차 고도화

1. 원금균등·원리금균등 계산
2. 기존 대출 갈아타기 입력
3. 중도상환수수료 입력
4. 결과 공유 URL
5. 회사별 복지 프리셋

### 3차 확장

1. 대기업 주택대출 복지 비교 리포트
2. 삼성전자 총보상 계산기
3. 성과급·연봉·복지 통합 비교
4. SK하이닉스·현대차·LG 복지 비교 페이지

---

## 19. 최종 설계 결론

이 페이지의 승부처는 `삼성전자 복지 좋다`라는 추상적 관심을 `연간 1,250만 원 절감`, `월 104만 원 절감`, `세전 연봉 1,645만 원 가치`처럼 바로 이해되는 숫자로 바꾸는 것이다.

다만 실제 삼성전자 사내대출 조건은 공개 확정값으로 보기 어렵기 때문에, 구현은 반드시 입력형 계산기여야 한다. 상단에서는 `5억 원·연 1.5%` 대표 시나리오로 클릭 의도를 만족시키고, 계산 영역에서는 사용자가 본인 조건으로 금리·원금·기간을 바꿔볼 수 있게 한다.

데이터 신뢰도는 이 콘텐츠의 핵심 품질 기준이다. 대표 시나리오는 `시뮬레이션`, 사용자가 바꾼 값은 `사용자 입력값`, 실제 회사 규정은 `확인 필요`로 분리하면 검색 유입과 신뢰도를 동시에 잡을 수 있다.
