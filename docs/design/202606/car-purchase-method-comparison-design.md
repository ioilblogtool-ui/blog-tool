# 리스 vs 할부 vs 현금 구매 손익 계산기 설계 문서

## 기본 정보
- slug: `car-purchase-method-comparison`
- 레이아웃: `SimpleToolShell` (3방향 비교지만 aside 단일 입력 → 결과 3열 비교)
- 데이터 파일: `src/data/carPurchaseMethodComparison.ts`
- 스크립트: `public/scripts/car-purchase-method-comparison.js`
- SCSS: `src/styles/scss/pages/_car-purchase-method-comparison.scss`
- prefix: `cpm-`

## 화면 구성

```
[Hero: 자동차 리스 vs 할부 vs 현금 비교 계산기 2026]
[aside: 입력 패널]              [main: 결과 영역]
  - 공통 조건                    - 3열 총비용 비교 카드
  - 리스 조건 (섹션 토글)         - 연도별 누적비용 라인 차트
  - 할부 조건 (섹션 토글)         - 항목별 비용 테이블
  - 현금 조건 (섹션 토글)         - 추천 케이스 가이드 박스
[SeoContent + FAQ]
```

## 입력 패널 (aside)

### 공통 조건
```html
<section class="cpm-section">
  <h3>공통 조건</h3>
  <label>차량 가격 <input data-cpm="carPrice" type="number" value="3500"> 만원</label>
  <label>보유 기간 <input data-cpm="holdYears" type="number" value="5" min="1" max="7"> 년</label>
  <label>구매자 유형
    <select data-cpm="buyerType">
      <option value="employee">직장인</option>
      <option value="business">사업자/프리랜서</option>
    </select>
  </label>
</section>
```

### 리스 조건
```html
<section class="cpm-section cpm-section--collapsible" data-cpm-section="lease">
  <h3 class="cpm-section__toggle">리스 조건 <span class="cpm-chevron">▼</span></h3>
  <div class="cpm-section__body">
    <label>보증금 비율 <input data-cpm="leaseDepositPct" type="number" value="20"> %</label>
    <label>월 리스료 <input data-cpm="leaseMonthly" type="number" value="60"> 만원</label>
    <label>리스 기간 <input data-cpm="leaseTerm" type="number" value="36"> 개월</label>
    <label>잔존가치 <input data-cpm="leaseResidual" type="number" value="30"> %</label>
  </div>
</section>
```

### 할부 조건
```html
<section class="cpm-section cpm-section--collapsible" data-cpm-section="installment">
  <h3 class="cpm-section__toggle">할부 조건 <span class="cpm-chevron">▼</span></h3>
  <div class="cpm-section__body">
    <label>선납금 <input data-cpm="instDownPct" type="number" value="20"> %</label>
    <label>할부 기간 <input data-cpm="instTerm" type="number" value="60"> 개월</label>
    <label>할부 금리 <input data-cpm="instRate" type="number" value="5.5"> %</label>
  </div>
</section>
```

### 현금 조건
```html
<section class="cpm-section cpm-section--collapsible" data-cpm-section="cash">
  <h3 class="cpm-section__toggle">현금 조건 <span class="cpm-chevron">▼</span></h3>
  <div class="cpm-section__body">
    <label>기회비용 금리 <input data-cpm="cashOppRate" type="number" value="4.0"> %</label>
    <p class="cpm-hint">현금 대신 예금/투자 시 기대수익률</p>
  </div>
</section>
```

## 계산 로직

### 리스 총비용
```js
function calcLease(carPrice, leaseDepositPct, leaseMonthly, leaseTerm, leaseResidual, holdYears) {
  const deposit = carPrice * leaseDepositPct / 100;
  const leaseCost = leaseMonthly * leaseTerm;
  // 리스 기간 후 추가 연장 or 재리스 비용 (보유기간 > 리스기간이면 반복)
  const cycles = Math.ceil((holdYears * 12) / leaseTerm);
  const totalLease = deposit + leaseCost * cycles;
  // 잔존가치: 리스 만기 후 인수 안 하면 0, 인수하면 잔존가치만큼 추가
  return { deposit, leaseCost, total: totalLease };
}
```

### 할부 총비용
```js
function calcInstallment(carPrice, instDownPct, instTerm, instRate) {
  const down = carPrice * instDownPct / 100;
  const principal = carPrice - down;
  const monthlyRate = instRate / 100 / 12;
  // 원리금균등상환
  const monthlyPayment = principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -instTerm));
  const totalInterest = monthlyPayment * instTerm - principal;
  return { down, principal, totalInterest, total: carPrice + totalInterest };
}
```

### 현금 총비용 (기회비용 포함)
```js
function calcCash(carPrice, cashOppRate, holdYears) {
  // 기회비용: 차에 묶인 돈의 연 수익률 × 보유기간
  const opportunityCost = carPrice * (cashOppRate / 100) * holdYears;
  return { carPrice, opportunityCost, total: carPrice + opportunityCost };
}
```

### 사업자 절세 효과 (buyerType === 'business')
```js
// 리스: 월 리스료 전액 경비 처리 → 연간 절세액 = 리스료합계 × 실효세율
// 할부: 이자 부분만 경비 처리 → 연간 절세액 = 이자합계 × 실효세율
// 현금: 감가상각 경비 처리 → 연간 절세액 = (차량가 / 5) × 실효세율
const EFFECTIVE_TAX_RATE = 0.25; // 추정 실효세율 25%
```

## 결과 영역

### 3열 총비용 비교 카드
```html
<div class="cpm-compare-grid">
  <div class="cpm-compare-card cpm-compare-card--lease">
    <div class="cpm-compare__label">리스</div>
    <div class="cpm-compare__total" id="cpmLeaseTotal">—</div>
    <div class="cpm-compare__sub" id="cpmLeaseSub">보증금 + 리스료</div>
  </div>
  <div class="cpm-compare-card cpm-compare-card--inst">
    <div class="cpm-compare__label">할부</div>
    <div class="cpm-compare__total" id="cpmInstTotal">—</div>
    <div class="cpm-compare__sub" id="cpmInstSub">원금 + 이자</div>
  </div>
  <div class="cpm-compare-card cpm-compare-card--cash">
    <div class="cpm-compare__label">현금</div>
    <div class="cpm-compare__total" id="cpmCashTotal">—</div>
    <div class="cpm-compare__sub" id="cpmCashSub">차량가 + 기회비용</div>
  </div>
</div>
<!-- 최저 방식 강조 배지 -->
<div class="cpm-winner" id="cpmWinner">현금 구매가 가장 유리합니다</div>
```

### 라인 차트
- x축: 1~보유기간(년), y축: 누적비용(만원)
- 리스: `#1a56db`, 할부: `#f59e0b`, 현금: `#10b981`

### 추천 케이스 가이드
```html
<div class="cpm-guide-grid">
  <div class="cpm-guide-card">
    <strong>현금이 유리한 경우</strong>
    <ul>
      <li>목돈이 있고 5년 이상 장기 보유</li>
      <li>투자 수익률이 4% 미만</li>
    </ul>
  </div>
  <div class="cpm-guide-card">
    <strong>리스가 유리한 경우</strong>
    <ul>
      <li>사업자 — 리스료 전액 경비처리</li>
      <li>3년 단기 후 신차 교체 패턴</li>
    </ul>
  </div>
  <div class="cpm-guide-card">
    <strong>할부가 유리한 경우</strong>
    <ul>
      <li>목돈 없이 소유권 취득 원할 때</li>
      <li>금리 4% 미만 특판 할부 이용 시</li>
    </ul>
  </div>
</div>
```

## 데이터 파일 구조
```ts
export const CPM_DEFAULTS = {
  carPrice: 3500,
  holdYears: 5,
  buyerType: 'employee',
  leaseDepositPct: 20,
  leaseMonthly: 60,
  leaseTerm: 36,
  leaseResidual: 30,
  instDownPct: 20,
  instTerm: 60,
  instRate: 5.5,
  cashOppRate: 4.0,
};

export const CPM_META = {
  slug: "car-purchase-method-comparison",
  title: "자동차 리스 vs 할부 vs 현금 비교 계산기 2026 | 내 조건엔 뭐가 유리?",
  description: "차량가격·금리·운용기간 입력하면 리스·할부·현금 구매 총비용 바로 비교. 직장인·사업자 절세 효과 포함.",
  updatedAt: "2026-06-17",
  caution: "리스료·할부 금리는 금융사 조건에 따라 다릅니다. 절세 효과는 세무사 상담 후 확인하세요.",
};
```

## SCSS 구조
```scss
.cpm-page { ... }
.cpm-section { background: #fff; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 1.25rem; margin-bottom: 0.75rem; }
.cpm-section__toggle { cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
.cpm-section__body { margin-top: 0.75rem; }
.cpm-section.is-collapsed .cpm-section__body { display: none; }
.cpm-hint { font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem; }
.cpm-compare-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
.cpm-compare-card { background: #f8f9fa; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 1rem; text-align: center; }
.cpm-compare-card--lease { border-top: 3px solid #1a56db; }
.cpm-compare-card--inst { border-top: 3px solid #f59e0b; }
.cpm-compare-card--cash { border-top: 3px solid #10b981; }
.cpm-compare-card.is-winner { box-shadow: 0 0 0 2px #1a56db; }
.cpm-compare__label { font-size: 0.75rem; color: #6b7280; margin-bottom: 0.25rem; }
.cpm-compare__total { font-size: 1.375rem; font-weight: 700; color: #111827; }
.cpm-compare__sub { font-size: 0.7rem; color: #9ca3af; margin-top: 0.25rem; }
.cpm-winner { text-align: center; font-weight: 700; color: #1a56db; margin: 1rem 0; font-size: 1rem; }
.cpm-guide-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin: 1.5rem 0; }
.cpm-guide-card { background: #f8f9fa; border-radius: 0.75rem; padding: 1rem; font-size: 0.875rem; }
.cpm-guide-card strong { display: block; margin-bottom: 0.5rem; color: #111827; }
.cpm-guide-card ul { padding-left: 1rem; color: #4b5563; }
@media (max-width: 640px) {
  .cpm-compare-grid { grid-template-columns: 1fr; }
  .cpm-guide-grid { grid-template-columns: 1fr; }
}
```

## 구현 순서
1. `src/data/carPurchaseMethodComparison.ts` — CPM_DEFAULTS, CPM_META, CPM_FAQ
2. `src/pages/tools/car-purchase-method-comparison.astro` — SimpleToolShell 마크업
3. `public/scripts/car-purchase-method-comparison.js` — IIFE, 3가지 calc 함수, render, chart
4. `src/styles/scss/pages/_car-purchase-method-comparison.scss`
5. `src/styles/app.scss` — @use 추가
6. `src/data/tools.ts` — 등록 (category: "자동차", order: 70.2)
7. `public/sitemap.xml` — URL 추가

## QA 포인트
- [ ] 3가지 방식 중 최저 비용 카드에 winner 강조 표시
- [ ] buyerType 사업자 선택 시 절세 효과 수치 반영
- [ ] 섹션 토글 (리스/할부/현금 섹션 접기/펼치기)
- [ ] 모바일 3열 → 1열 레이아웃 정상 표시
- [ ] 할부 금리 0% 입력 시 0으로 처리 (캠페인 할부 케이스)
