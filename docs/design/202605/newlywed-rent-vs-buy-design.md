# 신혼집 전세 vs 매매 손익 계산기 — 설계 문서

> 기획 원문: `docs/plan/202605/newlywed-rent-vs-buy.md`
> 작성일: 2026-05-17
> 콘텐츠 유형: `/tools/` 계산기
> 구현 기준: 전세 기회비용 + 집값 상승 시나리오 + 손익분기 전환 연도 비교

---

## 1. 문서 개요

- 구현 대상: `신혼집 전세 vs 매매 손익 계산기`
- slug: `newlywed-rent-vs-buy`
- URL: `/tools/newlywed-rent-vs-buy/`
- 카테고리: 결혼/웨딩, 부동산
- 핵심 검색 의도: "신혼집 전세 매매 비교", "전세 vs 매매 계산기", "신혼부부 주택 손익분기", "전세 기회비용 계산"
- 핵심 CTA: `/reports/newlywed-cost-2026/` + 주택금융공사 특례대출 안내
- 인접 계산기와의 차별화:
  - `jeonse-vs-wolse-calculator`: 월세 vs 전세 비교 (임차 형태 비교)
  - `newlywed-rent-vs-buy`: **전세 거주 vs 매매 진입** 비교 (거주 vs 자산 취득 비교)
  - 집값 상승·손익분기 시점·기회비용 3종 결합이 핵심 차별점

---

## 2. 구현 파일 구조

```text
src/
  data/
    newlywedRentVsBuy.ts        ← 타입 정의, 상수, 프리셋, FAQ, 관련 링크
  pages/
    tools/
      newlywed-rent-vs-buy.astro

public/
  scripts/
    newlywed-rent-vs-buy.js

src/styles/scss/pages/
  _newlywed-rent-vs-buy.scss
```

추가 등록 필수:
- `src/data/tools.ts`
- `src/styles/app.scss` — `@use 'scss/pages/newlywed-rent-vs-buy';`
- `public/sitemap.xml`

---

## 3. 레이아웃 방향

- `SimpleToolShell` 기반. `resultFirst={false}` — 모바일 입력 먼저.
- SCSS prefix: `nrb-`

```astro
<SimpleToolShell
  calculatorId="newlywed-rent-vs-buy"
  pageClass="nrb-page"
  resultFirst={false}
>
```

---

## 4. 데이터 모델

```ts
// src/data/newlywedRentVsBuy.ts

export type LoanType = 'equal-payment' | 'equal-principal' | 'bullet';
// 원리금균등 | 원금균등 | 만기일시상환

export interface NrbInput {
  // 전세
  jeonseDeposit: number;       // 전세 보증금 (원)
  jeonseLoan: number;          // 전세 대출금 (원)
  jeonseLoanRate: number;      // 전세 대출 금리 (소수, 예: 0.03)

  // 매매
  buyPrice: number;            // 매매가 (원)
  buyLoan: number;             // 매매 대출금 (원)
  buyLoanRate: number;         // 매매 대출 금리 (소수)
  loanType: LoanType;          // 대출 상환 방식
  includeAcquisitionTax: boolean; // 취득세·등기비 포함 여부

  // 시나리오
  livingYears: number;         // 예상 거주 기간 (년)
  housePriceGrowthRate: number; // 집값 연 상승률 (소수, 예: 0.02)
  depositReturnRate: number;   // 보증금 운용 수익률 (소수, 예: 0.04)
  isSpecialLoan: boolean;      // 신혼부부 특례대출 적용 여부
  specialLoanRate: number;     // 특례대출 금리 (소수, 기본 0.027)
}

export interface NrbYearResult {
  year: number;
  jeonseCumCost: number;       // 전세 누적 순비용 (원)
  buyCumCost: number;          // 매매 누적 순비용 (집값 상승 차감 후)
  diff: number;                // 차이 (양수 = 매매 유리, 음수 = 전세 유리)
}

export interface NrbResult {
  // 전세 연간
  jeonseEquity: number;        // 전세 자기자본 (보증금 – 대출금)
  jeonseInterestAnnual: number; // 전세 대출 연 이자
  depositOpportunityCost: number; // 보증금 자기자본 기회비용 (연)
  jeonseAnnualCost: number;    // 전세 연간 총비용

  // 매매 연간
  buyEquity: number;           // 매매 자기자본 (매매가 – 대출금)
  buyMonthlyPayment: number;   // 월 대출 상환액
  buyInterestAnnual: number;   // 매매 대출 연 이자 (1년차)
  acquisitionTax: number;      // 취득세 + 등기비 (1회)
  buyAnnualNetCost: number;    // 매매 연간 순비용 (이자 – 집값상승/N)

  // 비교 결과
  yearResults: NrbYearResult[]; // 연도별 누적 비용 배열
  breakevenYear: number | null; // 손익분기 연도 (null = 전환 없음)
  finalDiff: number;            // 거주 기간 종료 시점 누적 차이
  betterOption: 'JEONSE' | 'BUY' | 'SAME';

  // 집값 상승 순자산
  houseFinalValue: number;     // N년 후 집값
  buyFinalNetAsset: number;    // N년 후 매매 순자산 (집값 – 잔여 대출)

  // 특례대출 적용 시 차이
  specialLoanSaving: number;   // 특례대출 vs 일반 금리 이자 절감액 (누적)
}

export interface NrbPreset {
  id: string;
  label: string;
  jeonseDeposit: number;
  jeonseLoan: number;
  jeonseLoanRate: number;
  buyPrice: number;
  buyLoan: number;
  buyLoanRate: number;
  loanType: LoanType;
  livingYears: number;
  housePriceGrowthRate: number;
  depositReturnRate: number;
  isSpecialLoan: boolean;
  specialLoanRate: number;
  includeAcquisitionTax: boolean;
}

// 상수
export const ACQUISITION_TAX_RATE = {
  under6: 0.011,    // 6억 이하: 취득세 1% + 지방교육세 0.1%
  mid: null,        // 6~9억: 비례 계산
  over9: 0.033,     // 9억 초과: 3% + 0.3%
};
export const REGISTRATION_FEE_RATE = 0.004; // 등기비 추정 0.4%
export const DEFAULT_SPECIAL_LOAN_RATE = 0.027; // 신혼부부 특례 기본 2.7%
```

---

## 5. 계산 로직

### 5-1. 취득세 계산

```text
매매가 ≤ 6억: 취득세 = 매매가 × 1.1%
6억 < 매매가 ≤ 9억:
  세율 = (매매가/100,000,000 × 2/3 - 3) / 100  (비례세율)
  취득세 = 매매가 × 세율
매매가 > 9억: 취득세 = 매매가 × 3.3%
등기비(추정) = 매매가 × 0.4%
초기 취득비용 = 취득세 + 등기비
```

### 5-2. 전세 연간 순비용

```text
전세 자기자본 = max(전세 보증금 – 전세 대출금, 0)
전세 대출 연 이자 = 전세 대출금 × 전세 대출 금리
보증금 기회비용 = 전세 자기자본 × 보증금 운용 수익률
전세 연간 총비용 = 전세 대출 이자 + 보증금 기회비용
```

### 5-3. 매매 대출 월 상환액 (원리금균등)

```text
r = 매매 대출 금리 / 12
n = 대출 기간 개월 수 (기본 360개월 = 30년)
월 상환액 = 대출금 × r × (1+r)^n / ((1+r)^n – 1)
```

원금균등 / 만기일시상환도 동일 인터페이스로 계산.

### 5-4. 매매 연간 순비용

```text
매매 대출 연 이자(Y년차) = Y년차 잔여 원금 × 매매 대출 금리
집값 상승분 연 = 매매가 × 집값 연 상승률
매매 연간 순비용 = 매매 대출 연 이자 – 집값 상승분 연
  (단, includeAcquisitionTax = true이면 1년차에 초기 취득비용 1회 가산)
```

### 5-5. 연도별 누적 비교

```text
N년차 전세 누적 = 전세 연간 총비용 × N
N년차 매매 누적 = 1년차부터 N년차까지 (매매 대출 이자 - 집값 상승분) 합산
                 + 초기 취득비용 (includeAcquisitionTax = true 시)

차이(N) = 전세 누적(N) – 매매 누적(N)
  양수 → 매매 유리
  음수 → 전세 유리
```

### 5-6. 손익분기 전환 시점

```text
차이(N-1) < 0 이고 차이(N) ≥ 0 인 최초 N → breakevenYear = N
범위 내 전환 없음 → breakevenYear = null
```

### 5-7. N년 후 매매 순자산

```text
N년 후 집값 = 매매가 × (1 + 집값 연 상승률)^N
N년 후 잔여 대출 = 원금균등·원리금균등 상환 후 잔금 계산
매매 순자산 = N년 후 집값 – N년 후 잔여 대출
```

### 5-8. 신혼부부 특례대출 절감액

```text
특례 이자 = 매매 대출금 × 특례대출 금리
일반 이자 = 매매 대출금 × 일반 매매 대출 금리
연간 절감액 = 일반 이자 – 특례 이자
N년 누적 절감액 = 연간 절감액 × N
  (특례 기간 5~10년 후 일반 금리 전환은 안내 문구로 처리, 계산 단순화)
```

### 예외 처리

- 전세 대출금 > 전세 보증금 → 자기자본 0으로 처리
- 매매 대출금 > 매매가 → 자기자본 0으로 처리
- 집값 상승률 < 0 → 매매 순비용이 상승 가능, 정상 처리
- 거주 기간 0 → 1년 최솟값 적용

---

## 6. 프리셋 (4개)

| ID | 레이블 | 전세 보증금 | 전세 대출 | 매매가 | 매매 대출 | 거주 기간 | 집값 상승률 | 특례대출 |
|---|---|---|---|---|---|---|---|---|
| `수도권-신혼` | 수도권 신혼 표준 | 3억 | 1.5억 | 5억 | 3억 | 5년 | 2% | OFF |
| `서울-장기` | 서울 내집마련 장기 | 3억 | 1.5억 | 8억 | 5억 | 10년 | 3% | OFF |
| `지방-소형` | 지방 소형 실속 | 1.5억 | 7천 | 2.5억 | 1.5억 | 5년 | 1% | OFF |
| `특례대출` | 특례대출 최대 활용 | 2억 | 1억 | 5억 | 3억 | 7년 | 2% | ON |

---

## 7. 페이지 IA

1. **Hero** — 제목: "신혼집 전세 vs 매매 손익 계산기", 부제: "전세 기회비용, 집값 상승, 손익분기 전환 시점을 한 번에 계산합니다"
2. **InfoNotice** — "이 계산기는 일반적인 참고 시뮬레이션입니다. 실제 대출 조건·세금·시세는 금융기관 및 등기소 확인이 필요합니다."
3. **프리셋 버튼 (4개)**
4. **입력 패널** — 전세 조건, 매매 조건, 시나리오 슬라이더 3종, 특례대출 토글
5. **KPI 카드 (4개)** — 누적 순비용 차이, 월 실부담 비교, 손익분기 시점, N년 후 매매 순자산
6. **자연어 결과 메시지**
7. **기간별 누적 비용 비교표** (1/3/5/10/입력기간)
8. **손익분기 라인 차트** (Chart.js — 전세 vs 매매 곡선)
9. **특례대출 효과 카드** (isSpecialLoan ON 시 표시)
10. **주택금융공사 특례대출 CTA 배너**
11. **관련 계산기 링크 (3개)**
12. **SeoContent** — intro 5문단, FAQ 8개, 관련 링크 5개

---

## 8. 입력 UI 상세

| 필드 | 타입 | 기본값 | 범위 |
|---|---|---|---|
| 전세 보증금 (원) | number (쉼표) | 300,000,000 | 1천만 ~ 30억 |
| 전세 대출금 (원) | number (쉼표) | 150,000,000 | 0 ~ 전세 보증금 |
| 전세 대출 금리 (%) | number | 3.0 | 0 ~ 10 |
| 매매가 (원) | number (쉼표) | 500,000,000 | 1천만 ~ 50억 |
| 매매 대출금 (원) | number (쉼표) | 300,000,000 | 0 ~ 매매가 |
| 매매 대출 금리 (%) | number | 4.0 | 0 ~ 10 |
| 대출 상환 방식 | select 3종 | 원리금균등 | — |
| 예상 거주 기간 (년) | slider | 5 | 1 ~ 20 |
| 집값 연 상승률 (%) | slider | 2 | -5 ~ 15 |
| 보증금 운용 수익률 (%) | slider | 4 | 0 ~ 10 |
| 취득세·등기비 포함 | checkbox | true | — |
| 신혼부부 특례대출 | toggle | false | — |
| 특례대출 금리 (%) | number (특례 ON 시) | 2.7 | 0 ~ 10 |

보조 문구:
- 전세 대출 금리 아래: "버팀목 전세대출(신혼부부 우대) 기준 연 2.0~3.5%"
- 집값 연 상승률 아래: "최근 5년 수도권 평균 약 3~4%, 전국 평균 약 2%"
- 보증금 운용 수익률 아래: "예금 3~4%, ETF 기대수익 4~7% 사이에서 설정하세요"
- 특례대출 토글 ON 시: "신혼부부 구입자금 특례대출 최저 연 1.85%~3.3% (2026 기준)"

---

## 9. 결과 UI 상세

### KPI 카드 (4개)

| 카드 | 레이블 | 서브 텍스트 | 비고 |
|---|---|---|---|
| Main | N년 누적 순비용 차이 | "[전세/매매]가 약 XXX만원 저렴합니다" | |
| 일반 | 전세 월 실부담 | 대출이자 + 기회비용 / 12 | |
| 일반 | 매매 월 실부담 | 대출이자 / 12 | |
| 일반 | 손익분기 전환 시점 | "X년째부터 매매 유리" or "입력 기간 내 전환 없음" | |

### 자연어 결과 메시지

```text
전세 보증금 X억 / 매매가 X억 기준,
집값이 연 X% 오른다고 가정하면
X년 거주 시 [전세/매매]가 약 X만원 저렴합니다.
[X년째부터 매매가 더 유리해집니다. / 입력 기간 내 전환점이 없습니다.]
```

### 기간별 누적 비용 비교표

| 기간 | 전세 누적 순비용 | 매매 누적 순비용 | 차이 (유리한 쪽) |
|---|---|---|---|
| 1년 | X만원 | X만원 | [전세/매매] +X만원 |
| 3년 | X만원 | X만원 | ... |
| 5년 | X만원 | X만원 | ... |
| 10년 | X만원 | X만원 | ... |
| N년 (입력) | X만원 | X만원 | ... |

5인 미만 사업장처럼 조건별 강조: 손익분기 전환 행은 배경색 강조.

### 손익분기 라인 차트

- Chart.js Line 차트
- X축: 1~N년
- Y축: 누적 순비용 (만원)
- 전세 선 (파랑), 매매 선 (초록)
- 교차점에 "손익분기" 어노테이션
- 수당이 모두 0인 경우(집값 상승률 = 0, 기회비용 = 0) → 단순 직선 2개

### 특례대출 효과 카드 (isSpecialLoan ON 시)

```text
┌────────────────────────────────────┐
│  일반 금리 (X%) 적용 시 N년 이자    XX만원 │
│  특례금리 (X%) 적용 시 N년 이자    XX만원 │
│  절감액                          +XX만원 │
│                                        │
│  손익분기 시점 단축: 약 X년 빨라집니다     │
│  [주택금융공사 특례대출 신청 →]           │
└────────────────────────────────────┘
```

---

## 10. JavaScript 설계

```js
// public/scripts/newlywed-rent-vs-buy.js
(() => {
  const DATA = JSON.parse(document.getElementById('nrbData').textContent);
  // DATA: { PRESETS, ACQUISITION_TAX_RATE, REGISTRATION_FEE_RATE, DEFAULT_SPECIAL_LOAN_RATE }

  let state = {
    jeonseDeposit: 300000000,
    jeonseLoan: 150000000,
    jeonseLoanRate: 0.03,
    buyPrice: 500000000,
    buyLoan: 300000000,
    buyLoanRate: 0.04,
    loanType: 'equal-payment',
    livingYears: 5,
    housePriceGrowthRate: 0.02,
    depositReturnRate: 0.04,
    includeAcquisitionTax: true,
    isSpecialLoan: false,
    specialLoanRate: 0.027,
  };

  let chartInstance = null;

  function sanitize(val, fallback, min, max) { /* ... */ }
  function readInputs() { /* state 갱신 */ }
  function calcAcquisitionTax(price) { /* 취득세 + 등기비 */ }
  function calcMonthlyPayment(loan, rate, months, type) { /* 대출 유형별 월 상환액 */ }
  function calcYearlyInterest(loan, rate, year, type) { /* Y년차 이자 */ }
  function calculate(s) { /* NrbResult 반환 */ }
  function renderKpi(r) { /* KPI 카드 4개 */ }
  function renderMessage(r, s) { /* 자연어 메시지 */ }
  function renderTable(r, s) { /* 기간별 비교표 */ }
  function renderChart(r, s) { /* 라인 차트 */ }
  function renderSpecialLoanCard(r, s) { /* 특례대출 카드 조건부 */ }
  function toggleSpecialLoanField(on) { /* 특례대출 입력 슬라이드 */ }
  function applyPreset(id) { /* 프리셋 적용 */ }
  function syncUrl(s) { /* URL 파라미터 저장 */ }
  function restoreFromUrl() { /* URL 파라미터 복원 */ }
  function bindEvents() { /* 모든 input/change/click 이벤트 */ }
  function refresh() {
    readInputs();
    const r = calculate(state);
    renderKpi(r);
    renderMessage(r, state);
    renderTable(r, state);
    renderChart(r, state);
    renderSpecialLoanCard(r, state);
    syncUrl(state);
  }

  restoreFromUrl();
  bindEvents();
  refresh();
})();
```

URL 파라미터:
`jd` / `jl` / `jr` / `bp` / `bl` / `br` / `lt` / `ly` / `gr` / `dr` / `tax` / `sp` / `sr`

---

## 11. SCSS 설계

```scss
.nrb-page {

  // 프리셋
  .nrb-preset-grid { display: flex; flex-wrap: wrap; gap: 8px; }
  .nrb-preset-btn {
    border: 1px solid #dce6e2; border-radius: 20px; padding: 6px 14px;
    font-size: 0.82rem; cursor: pointer; background: #fff;
    &.is-active { background: #0f6e56; color: #fff; border-color: #0f6e56; }
  }

  // 입력 슬라이더 그룹
  .nrb-slider-group { margin-top: 20px; }
  .nrb-slider-label {
    display: flex; justify-content: space-between; font-size: 0.88rem;
    font-weight: 600; margin-bottom: 6px;
  }
  .nrb-slider-value { color: #0f6e56; font-weight: 700; }

  // 특례대출 토글 (opc-page와 동일 패턴 재사용)
  .nrb-special-field { max-height: 0; overflow: hidden; transition: max-height 0.25s; }
  .nrb-special-field.is-open { max-height: 120px; }

  // KPI 카드
  .nrb-kpi-grid {
    display: grid; gap: 12px; grid-template-columns: repeat(2, 1fr);
    @media (min-width: 900px) { grid-template-columns: repeat(4, 1fr); }
  }
  .nrb-kpi-card {
    background: #f8faf9; border: 1px solid #e8ede9; border-radius: 12px; padding: 16px;
    &--main { background: #f0fdf4; border-color: #6ee7b7; }
    &--jeonse { border-left: 3px solid #1a56db; }
    &--buy    { border-left: 3px solid #0f6e56; }
  }
  .nrb-kpi-value { font-size: 1.2rem; font-weight: 800; display: block; margin: 6px 0; }

  // 결과 메시지
  .nrb-result-message { font-size: 0.92rem; color: #374151; line-height: 1.7; margin: 0; }

  // 비교표
  .nrb-compare-table {
    width: 100%; border-collapse: collapse;
    th, td { padding: 10px 12px; border-bottom: 1px solid #e8ede9; font-size: 0.88rem; }
    th { background: #f8fcfa; font-weight: 700; }
    td:not(:first-child) { text-align: right; }
    tr.is-breakeven td { background: #fef9c3; font-weight: 700; }
    td.is-jeonse-win { color: #1a56db; }
    td.is-buy-win    { color: #0f6e56; }
  }

  // 라인 차트
  .nrb-chart-wrap { max-width: 640px; margin: 24px auto 0; }

  // 특례대출 카드
  .nrb-special-card {
    border: 1.5px solid #bfdbfe; border-radius: 12px; padding: 18px 20px; margin-top: 20px;
    display: none;
    &.is-visible { display: block; }
    .nrb-special-row { display: flex; justify-content: space-between; padding: 6px 0;
      font-size: 0.9rem; border-bottom: 1px solid #f3f4f6; }
    .nrb-special-saving { font-size: 1.1rem; font-weight: 700; color: #0f6e56; }
  }

  // CTA 배너
  .nrb-cta-banner {
    background: #f0f7ff; border: 1px solid #bfdbfe; border-radius: 12px;
    padding: 18px 20px; margin-top: 24px;
    display: flex; align-items: center; justify-content: space-between;
    gap: 16px; flex-wrap: wrap;
  }
  .nrb-cta-btn {
    padding: 8px 18px; background: #1a56db; color: #fff; border-radius: 8px;
    font-size: 0.86rem; font-weight: 700; text-decoration: none; white-space: nowrap;
  }
}
```

---

## 12. SEO 설계

```text
title: 신혼집 전세 vs 매매 손익 계산기 | 기회비용·손익분기·집값 상승 시나리오 비교
description: 전세 보증금·매매가·대출 금리·거주 기간을 입력하면 5·10년 누적 순비용과 손익분기 전환 시점을 자동 계산합니다. 신혼부부 특례대출 조건 포함.
H1: 신혼집 전세 vs 매매 손익 계산기
```

JSON-LD: `WebApplication` + `FAQPage`

키워드: 신혼집 전세 매매 비교, 전세 vs 매매 계산기, 신혼부부 주택 손익, 전세 기회비용, 신혼부부 특례대출 비교

---

## 13. SeoContent 초안

### intro (5문단)

1. 신혼집 마련의 첫 고민은 전세로 시작할지, 바로 매매로 진입할지입니다. 두 선택은 월 부담액뿐 아니라 기회비용·집값 상승·자산 형성 경로가 모두 다릅니다. 이 계산기는 전세 보증금이 묶이는 기회비용과 매매 후 집값 상승으로 생기는 자산 증가를 동시에 반영해 어느 시점에 어느 선택이 유리한지를 숫자로 보여줍니다.

2. 전세의 숨겨진 비용은 보증금 기회비용입니다. 전세 보증금 3억 원을 연 4% 예금에 넣으면 연 1,200만 원의 이자를 받을 수 있습니다. 이 기회비용은 전세 대출이자와 합산해 전세의 실질 연간 비용을 구성합니다. 이 계산기는 이 기회비용을 자동으로 반영합니다.

3. 매매의 유불리는 집값 상승률에 크게 달라집니다. 집값이 전혀 오르지 않는다면 대출이자가 순비용 전체가 되지만, 집값이 연 3% 오른다면 대출이자 중 일부를 집값 상승분이 상쇄합니다. 이 계산기에서 집값 연 상승률 슬라이더를 조정하면 시나리오별 손익분기 전환 시점이 즉시 바뀝니다.

4. 신혼부부 특례대출을 이용하면 일반 주담대보다 낮은 금리로 매매 부담을 줄일 수 있습니다. 2026년 기준 신혼부부 구입자금 특례대출은 연 1.85~3.3% 수준으로 제공됩니다. 이 계산기에서 특례대출 토글을 켜면 금리 차이로 인한 이자 절감액과 손익분기 시점 변화를 자동으로 확인할 수 있습니다.

5. 이 계산기의 결과는 입력한 가정(금리·집값 상승률·수익률)에 따라 크게 달라지는 참고용 시뮬레이션입니다. 실제 대출 한도와 금리는 금융기관 상담을 통해 확인하고, 취득세 감면 등 세부 혜택은 등기소·세무사에게 확인하세요.

### FAQ (8개)

```ts
export const NRB_FAQ = [
  {
    question: "전세 기회비용은 어떻게 계산하나요?",
    answer: "전세 자기자본(보증금 – 대출금)을 보증금 운용 수익률로 곱한 값입니다. 예를 들어 자기자본 1억 5천만 원에 수익률 4%를 적용하면 연 600만 원이 기회비용으로 발생합니다. 이 기회비용은 전세 대출이자와 합산해 전세의 실질 연간 비용을 구성합니다.",
  },
  {
    question: "집값 상승률은 어떻게 입력해야 하나요?",
    answer: "최근 5년(2021~2026) 수도권 아파트 평균 상승률은 연 3~4% 수준이었으나, 이는 과거 데이터이며 미래를 보장하지 않습니다. 보수적 시나리오(1%), 중립(2~3%), 낙관(4~5%) 세 가지를 각각 입력해 결과를 비교해 보는 것을 권장합니다.",
  },
  {
    question: "손익분기 전환 시점이 '전환 없음'으로 나오는 경우는 언제인가요?",
    answer: "집값 상승률이 낮거나 매매 대출 금리가 높아 입력한 거주 기간 안에 매매가 전세보다 유리해지는 시점이 없을 때 표시됩니다. 이 경우 집값 상승률 슬라이더를 올리거나 거주 기간을 늘려 전환 시점을 탐색해 보세요.",
  },
  {
    question: "신혼부부 특례대출이란 무엇인가요?",
    answer: "결혼 7년 이내 신혼부부 또는 예비 신혼부부가 이용할 수 있는 정부 지원 주택담보대출입니다. 2026년 기준 연 1.85~3.3% 금리로, 최대 5억 원(아파트 9억 이하)까지 이용 가능합니다. 자세한 조건은 주택금융공사 홈페이지를 확인하세요.",
  },
  {
    question: "원리금균등과 원금균등 중 어떤 방식이 유리한가요?",
    answer: "원금균등상환은 초기 납입액이 크지만 총이자가 적습니다. 원리금균등상환은 매달 동일한 금액을 납부해 예측 가능성이 높지만 총이자가 다소 많습니다. 초기 여유 자금이 있다면 원금균등이 장기적으로 유리하고, 안정적 월 지출 관리가 우선이라면 원리금균등이 편리합니다.",
  },
  {
    question: "취득세·등기비를 포함해야 더 정확한 계산이 되나요?",
    answer: "매매 초기에 1회성으로 발생하는 비용이므로 포함하면 더 현실적인 비교가 가능합니다. 특히 거주 기간이 짧을수록 1회성 비용의 영향이 크게 나타납니다. 생애최초 취득세 감면을 받는 경우 실제 부담이 줄어드므로, 감면액만큼 입력값을 조정해도 됩니다.",
  },
  {
    question: "전세 사기 리스크는 이 계산기에 반영되나요?",
    answer: "이 계산기는 순수 비용·자산 측면의 시뮬레이션이며, 전세 사기 리스크나 보증 사고 가능성은 반영되지 않습니다. 전세 계약 시 전세보증보험 가입, 선순위 채권 확인, 등기부 열람 등 별도 리스크 관리가 필요합니다.",
  },
  {
    question: "이 계산기 결과만으로 전세·매매를 결정해도 되나요?",
    answer: "이 계산기는 재무적 비용·손익 측면의 참고 시뮬레이션입니다. 실제 결정에는 직장 이동 가능성, 자녀 계획, 가족 상황, 지역 선호, 대출 가능 여부 등 비재무적 요소도 중요합니다. 큰 결정 전에는 부동산 중개사·재무설계사와 상담을 권장합니다.",
  },
];
```

---

## 14. 관련 링크

```ts
export const NRB_RELATED_LINKS = [
  { href: '/reports/newlywed-cost-2026/', label: '2026 신혼부부 결혼·신혼집 비용 완전 분석' },
  { href: '/tools/home-purchase-fund/', label: '내집마련 자금 계산기' },
  { href: '/tools/jeonwolse-conversion/', label: '전월세 전환율 계산기' },
  { href: '/tools/mortgage-prepayment-penalty/', label: '중도상환 수수료 계산기' },
  { href: '/tools/apt-cheonyak-gajum-calculator/', label: '아파트 청약 가점 계산기' },
];
```

---

## 15. QA 체크리스트

- [ ] 전세 대출금 > 전세 보증금 → 자기자본 0 처리, 음수 미출력
- [ ] 매매 대출금 > 매매가 → 자기자본 0 처리, 경고 문구 표시
- [ ] 집값 상승률 음수 입력 시 매매 순비용 상승 정상 처리
- [ ] 거주 기간 1년 최솟값 적용 확인
- [ ] 손익분기 전환 없음 케이스 정상 표시
- [ ] 특례대출 토글 OFF → 특례 카드 미표시, 금리 필드 숨김
- [ ] 원리금균등·원금균등·만기일시상환 각 방식 계산 검증
- [ ] Chart.js 스크립트 태그 포함 확인
- [ ] 프리셋 4개 클릭 시 모든 입력값 즉시 갱신
- [ ] URL 파라미터 복원 정상 동작
- [ ] InfoNotice 법적 면책 문구 노출 확인
- [ ] 모바일 360px — KPI 2열, 비교표 가로 스크롤 정상
- [ ] `tools.ts`, `app.scss`, `sitemap.xml` 등록 완료
- [ ] `npm run build` 성공
