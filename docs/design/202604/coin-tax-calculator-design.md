# 코인 세금 계산기 2026 — 설계 문서

> 기획 원문: `docs/plan/202604/coin-tax-calculator.md`
> 작성일: 2026-04-12
> 구현 기준: Claude/Codex가 이 문서를 보고 바로 구현에 착수할 수 있는 수준으로 고정
> 참고 계산기: `dca-investment-calculator`, `national-pension-calculator`, `salary`
> 참고 기준: 국세청 `거주자의 가상자산소득 과세 개요` 안내 기준 반영

---

## 1. 문서 개요

### 1-1. 대상

- 기획 문서: `docs/plan/202604/coin-tax-calculator.md`
- 구현 대상: `코인 세금 계산기 2026`
- 콘텐츠 유형: **계산기** (`/tools/` 계열)

### 1-2. 포지션 확정

> **"실제 신고 세액 확정기"가 아니라 "매도 전에 세후 수익을 빠르게 감 잡는 계산기"**

- 사용자는 세법 전체보다 `지금 팔면 얼마 남는지`를 가장 먼저 확인하고 싶다.
- 따라서 결과의 첫 우선순위는 `양도차익`, `예상 세금`, `세후 순이익`, `총 실수령 금액`이다.
- 법령/과세 기준은 변동 가능성이 있으므로 화면 상단과 하단에 `참고용 시뮬레이터` 문구를 반복 배치한다.
- 계산기 기본값은 **국세 20% + 지방소득세 반영 실효 22%**로 제공하되, 안내 문구에서 "국세청 기준 세율 20%에 지방소득세를 반영한 계산용 기본값"임을 명시한다.

### 1-3. 현재 기준 반영

- 국세청 안내 기준: **가상자산 소득 과세는 2027년 1월 1일 이후 양도·대여분부터 적용**
- 국세청 안내 기준: **연 250만원 기본공제**
- 계산기 반영 기준:
  - 기본 세율: `20%`
  - 계산기 표시 기본값: `22%` (`20% + 지방소득세 반영값`이라는 점을 문구로 고지)

### 1-4. 권장 slug

- `coin-tax-calculator`
- URL: `/tools/coin-tax-calculator/`

### 1-5. topicBySlug 카테고리

- `"coin-tax-calculator": "투자·재테크"` (`src/pages/index.astro`)

### 1-6. 권장 파일 구조

```
src/
  data/
    tools.ts
    coinTaxCalculator.ts
  pages/
    tools/
      coin-tax-calculator.astro

public/
  scripts/
    coin-tax-calculator.js
  og/tools/
    coin-tax-calculator.png

src/styles/scss/pages/
  _coin-tax-calculator.scss
```

---

## 2. 데이터 파일 설계 (`coinTaxCalculator.ts`)

```ts
export const CTC_RULES = {
  taxStartDateLabel: "2027-01-01 이후 양도·대여분",
  basicDeduction: 2_500_000,
  incomeTaxRate: 0.20,
  localTaxRate: 0.02,
  effectiveTaxRate: 0.22,
  defaultBuyFeeRate: 0.0005,   // 0.05%
  defaultSellFeeRate: 0.0005,  // 0.05%
  defaultTaxYear: 2027,
};

export const CTC_DEFAULT_INPUT = {
  assetName: "BTC",
  averageBuyPrice: 10_000_000,
  quantity: 1,
  sellPrice: 100_000_000,
  buyFeeRate: 0.0005,
  sellFeeRate: 0.0005,
  extraCost: 0,
  taxMode: "effective" as "effective" | "incomeTaxOnly",
  taxYear: 2027,
  holdingPeriodMonths: 12,
};

export const CTC_ASSET_PRESETS = [
  { label: "BTC", value: "BTC" },
  { label: "ETH", value: "ETH" },
  { label: "XRP", value: "XRP" },
  { label: "SOL", value: "SOL" },
];

export const CTC_SCENARIO_PRESETS = [
  {
    id: "btc-1eok",
    label: "BTC 1천만→1억",
    values: {
      assetName: "BTC",
      averageBuyPrice: 10_000_000,
      quantity: 1,
      sellPrice: 100_000_000,
      buyFeeRate: 0.0005,
      sellFeeRate: 0.0005,
      extraCost: 0,
    },
  },
  {
    id: "eth-10",
    label: "ETH 200만→350만",
    values: {
      assetName: "ETH",
      averageBuyPrice: 2_000_000,
      quantity: 10,
      sellPrice: 3_500_000,
      buyFeeRate: 0.0005,
      sellFeeRate: 0.0005,
      extraCost: 0,
    },
  },
  {
    id: "under-deduction",
    label: "250만 이하 수익",
    values: {
      assetName: "XRP",
      averageBuyPrice: 1_000,
      quantity: 5_000,
      sellPrice: 1_600,
      buyFeeRate: 0.0005,
      sellFeeRate: 0.0005,
      extraCost: 0,
    },
  },
];

export const CTC_FAQ = [
  {
    q: "코인 세금은 언제부터 적용되나요?",
    a: "국세청 안내 기준으로 가상자산 소득 과세는 2027년 1월 1일 이후 양도·대여분부터 적용됩니다. 실제 적용 범위와 신고 방식은 법령 개정 여부에 따라 달라질 수 있으므로 최신 공지를 함께 확인해야 합니다.",
  },
  {
    q: "250만원 기본공제는 어떻게 적용되나요?",
    a: "연간 가상자산 양도차익에서 250만원을 먼저 차감한 뒤 남는 금액을 과세표준으로 봅니다. 계산기에서는 단일 코인 기준 양도차익에 먼저 적용하고, 이후 복수 코인 합산 확장 시 연간 합산 기준으로 계산합니다.",
  },
  {
    q: "수수료도 비용으로 반영되나요?",
    a: "이 계산기에서는 사용 편의를 위해 매수 수수료와 매도 수수료를 모두 차감해 양도차익을 계산합니다. 실제 필요경비 인정 범위는 신고 기준과 증빙에 따라 달라질 수 있습니다.",
  },
  {
    q: "세율 22%는 왜 쓰나요?",
    a: "국세청 안내 기준 세율은 20%이며, 계산기에서는 지방소득세까지 포함한 체감 기준 실효 22%를 기본값으로 제공합니다. 필요하면 국세 20%만 보는 모드도 함께 제공합니다.",
  },
  {
    q: "여러 코인을 팔면 각각 따로 계산하나요?",
    a: "실제 과세는 연간 손익을 합산해 보는 방향으로 이해하는 것이 자연스럽습니다. MVP는 단일 코인 기준으로 빠르게 계산하고, v2에서 여러 코인 행을 추가해 연간 합산 손익 시뮬레이션까지 확장합니다.",
  },
];

export const CTC_RELATED_LINKS = [
  { href: "/tools/dca-investment-calculator/", label: "적립식 투자 수익 비교 계산기" },
  { href: "/tools/fire-calculator/", label: "파이어족 계산기" },
  { href: "/reports/us-rich-top10-patterns/", label: "미국 부자 TOP10 자산 패턴" },
  { href: "/reports/korea-rich-top10-assets/", label: "한국 부자 TOP10 자산 비교" },
];
```

### 2-1. 데이터 원칙

- `CTC_RULES`는 세율·공제액·기본 수수료율을 한곳에서 관리한다.
- 모든 숫자 입력값은 **원 단위 숫자**로 저장하고, 화면 출력 시만 `만원/원` 포맷팅을 적용한다.
- FAQ 문구는 법률 자문처럼 보이지 않도록 `안내 기준`, `참고용`, `최신 공지 확인` 표현을 유지한다.

---

## 3. 계산 로직

### 3-1. 핵심 산식

```js
function calcBuyAmount(input) {
  return input.averageBuyPrice * input.quantity;
}

function calcSellAmount(input) {
  return input.sellPrice * input.quantity;
}

function calcBuyFee(buyAmount, input) {
  return buyAmount * input.buyFeeRate;
}

function calcSellFee(sellAmount, input) {
  return sellAmount * input.sellFeeRate;
}

function calcTotalFee(buyFee, sellFee) {
  return buyFee + sellFee;
}

function calcCapitalGain(sellAmount, buyAmount, totalFee, extraCost) {
  return sellAmount - buyAmount - totalFee - extraCost;
}

function calcTaxableIncome(capitalGain) {
  return Math.max(0, capitalGain - CTC_RULES.basicDeduction);
}

function calcAppliedTaxRate(input) {
  return input.taxMode === "incomeTaxOnly"
    ? CTC_RULES.incomeTaxRate
    : CTC_RULES.effectiveTaxRate;
}

function calcEstimatedTax(taxableIncome, taxRate) {
  return taxableIncome * taxRate;
}

function calcAfterTaxProfit(capitalGain, estimatedTax) {
  return capitalGain - estimatedTax;
}

function calcNetReceipt(sellAmount, sellFee, estimatedTax) {
  return sellAmount - sellFee - estimatedTax;
}
```

### 3-2. 통합 계산 함수

```js
function calculate(input) {
  const buyAmount = calcBuyAmount(input);
  const sellAmount = calcSellAmount(input);
  const buyFee = calcBuyFee(buyAmount, input);
  const sellFee = calcSellFee(sellAmount, input);
  const totalFee = calcTotalFee(buyFee, sellFee);
  const capitalGain = calcCapitalGain(sellAmount, buyAmount, totalFee, input.extraCost || 0);
  const taxableIncome = calcTaxableIncome(capitalGain);
  const appliedTaxRate = calcAppliedTaxRate(input);
  const estimatedTax = calcEstimatedTax(taxableIncome, appliedTaxRate);
  const afterTaxProfit = calcAfterTaxProfit(capitalGain, estimatedTax);
  const netReceipt = calcNetReceipt(sellAmount, sellFee, estimatedTax);

  return {
    buyAmount,
    sellAmount,
    buyFee,
    sellFee,
    totalFee,
    capitalGain,
    taxableIncome,
    appliedTaxRate,
    estimatedTax,
    afterTaxProfit,
    netReceipt,
    isTaxFree: taxableIncome <= 0,
  };
}
```

### 3-3. 복수 코인 확장용 산식

```js
function calculatePortfolio(rows, taxMode) {
  const rowResults = rows.map(row => calculate({ ...row, taxMode }));
  const annualCapitalGain = rowResults.reduce((sum, row) => sum + row.capitalGain, 0);
  const taxableIncome = Math.max(0, annualCapitalGain - CTC_RULES.basicDeduction);
  const taxRate = taxMode === "incomeTaxOnly"
    ? CTC_RULES.incomeTaxRate
    : CTC_RULES.effectiveTaxRate;
  const estimatedTax = taxableIncome * taxRate;

  return {
    annualCapitalGain,
    taxableIncome,
    estimatedTax,
    rowResults,
  };
}
```

### 3-4. 계산상 주의사항

- `capitalGain`이 0 이하이면 과세표준과 예상 세금은 모두 `0` 처리
- `netReceipt`는 `세후 순이익`과 다르므로 별도 KPI로 유지
- `실수령 금액`은 사용자가 직관적으로 이해하기 쉬운 값이라 결과 카드에 반드시 포함
- `taxYear`는 MVP에서는 안내용이지만 URL 파라미터에는 포함해 이후 제도 비교 확장성을 남긴다

---

## 4. 페이지 구조 (`coin-tax-calculator.astro`)

### 4-1. 레이아웃 쉘

- `SimpleToolShell.astro`
- `resultFirst={true}` 사용 권장

### 4-2. Hero

```astro
<CalculatorHero
  eyebrow="가상자산 세금"
  title="코인 세금 계산기 2026"
  description="매수가, 수량, 매도가를 입력하면 가상자산 양도차익, 250만원 공제, 예상 세금, 세후 순이익을 바로 계산합니다."
/>
<InfoNotice
  text="이 계산기는 국세청 공개 안내 기준을 바탕으로 만든 참고용 시뮬레이터입니다. 실제 신고·납부 세액은 손익 통산, 필요경비 인정 범위, 법령 개정 여부에 따라 달라질 수 있습니다."
/>
```

### 4-3. 입력 패널 (aside)

#### SECTION A. 기본 입력

```html
<div class="panel">
  <div class="panel-heading">
    <p class="panel-heading__eyebrow">입력</p>
    <h2 class="panel__title">매도 조건 입력</h2>
  </div>

  <div class="form-grid">
    <label class="field">
      <span>코인명</span>
      <input type="text" id="ctc-asset-name" value="BTC" list="ctc-asset-list" />
    </label>

    <label class="field">
      <span>평균 매수단가</span>
      <input type="number" id="ctc-buy-price" value="10000000" min="0" step="1000" />
    </label>

    <label class="field">
      <span>보유 수량</span>
      <input type="number" id="ctc-quantity" value="1" min="0" step="0.00000001" />
    </label>

    <label class="field">
      <span>예상 매도가</span>
      <input type="number" id="ctc-sell-price" value="100000000" min="0" step="1000" />
    </label>

    <label class="field">
      <span>매수 수수료율 (%)</span>
      <input type="number" id="ctc-buy-fee-rate" value="0.05" min="0" max="10" step="0.01" />
    </label>

    <label class="field">
      <span>매도 수수료율 (%)</span>
      <input type="number" id="ctc-sell-fee-rate" value="0.05" min="0" max="10" step="0.01" />
    </label>

    <label class="field">
      <span>기타 필요경비</span>
      <input type="number" id="ctc-extra-cost" value="0" min="0" step="1000" />
    </label>

    <label class="field">
      <span>과세 기준 연도</span>
      <select id="ctc-tax-year">
        <option value="2027" selected>2027 이후 기준</option>
        <option value="2026">2026 이전 참고</option>
      </select>
    </label>
  </div>
</div>
```

#### SECTION B. 세율 모드 + 예시 버튼

```html
<div class="ctc-tax-mode-wrap">
  <div class="ctc-tax-mode-tabs" id="ctc-tax-mode-tabs">
    <button class="ctc-tax-mode-tab is-active" data-mode="effective">지방세 포함 22%</button>
    <button class="ctc-tax-mode-tab" data-mode="incomeTaxOnly">국세 20%</button>
  </div>
  <p class="ctc-help-text">22%는 국세청 안내 기준 세율 20%에 지방소득세를 반영한 계산용 기본값입니다.</p>
</div>

<div class="ctc-scenario-presets" id="ctc-scenario-presets">
  <button class="ctc-preset-btn" data-preset="btc-1eok">BTC 1천만→1억</button>
  <button class="ctc-preset-btn" data-preset="eth-10">ETH 200만→350만</button>
  <button class="ctc-preset-btn" data-preset="under-deduction">250만 이하 수익</button>
</div>
```

#### SECTION C. 액션 버튼

```html
<div class="ctc-actions">
  <button id="ctc-calc-btn" class="button button--primary">계산하기</button>
  <button id="ctc-reset-btn" class="button button--ghost">초기화</button>
  <button id="ctc-copy-link-btn" class="button button--ghost">링크 복사</button>
</div>
```

### 4-4. 결과 패널 (main)

#### 핵심 KPI 카드 5개

```html
<div class="ctc-result-cards">
  <div class="ctc-result-card ctc-result-card--main">
    <p class="ctc-result-label">양도차익</p>
    <p class="ctc-result-value ctc-result-value--hl" id="ctc-r-capital-gain">-</p>
  </div>

  <div class="ctc-result-card">
    <p class="ctc-result-label">과세표준</p>
    <p class="ctc-result-value" id="ctc-r-taxable-income">-</p>
    <p class="ctc-result-note">250만원 공제 반영</p>
  </div>

  <div class="ctc-result-card">
    <p class="ctc-result-label">예상 세금</p>
    <p class="ctc-result-value" id="ctc-r-tax">-</p>
    <p class="ctc-result-note"><span id="ctc-r-tax-rate">22%</span> 기준</p>
  </div>

  <div class="ctc-result-card">
    <p class="ctc-result-label">세후 순이익</p>
    <p class="ctc-result-value" id="ctc-r-after-tax-profit">-</p>
  </div>

  <div class="ctc-result-card">
    <p class="ctc-result-label">총 실수령 금액</p>
    <p class="ctc-result-value" id="ctc-r-net-receipt">-</p>
  </div>
</div>
```

#### 비과세/면책 안내 박스

```html
<div class="ctc-notice-box" id="ctc-taxfree-box" hidden>
  <strong>공제 범위 안이라 예상 세금이 0원입니다.</strong>
  <p>현재 입력 기준 양도차익이 250만원 기본공제 범위 안이어서 계산상 세금은 0원으로 표시됩니다.</p>
</div>

<div class="ctc-disclaimer">
  <p>이 계산 결과는 참고용입니다. 실제 신고 세액은 연간 손익 통산, 거래소별 증빙, 필요경비 인정 범위, 법령 개정 여부에 따라 달라질 수 있습니다.</p>
</div>
```

#### 상세 계산표

```html
<table class="ctc-breakdown-table">
  <tbody>
    <tr><th>총 매수금액</th><td id="ctc-r-buy-amount">-</td></tr>
    <tr><th>총 매도금액</th><td id="ctc-r-sell-amount">-</td></tr>
    <tr><th>총 매수 수수료</th><td id="ctc-r-buy-fee">-</td></tr>
    <tr><th>총 매도 수수료</th><td id="ctc-r-sell-fee">-</td></tr>
    <tr><th>총 수수료</th><td id="ctc-r-total-fee">-</td></tr>
    <tr><th>기타 필요경비</th><td id="ctc-r-extra-cost">-</td></tr>
    <tr><th>양도차익</th><td id="ctc-r-capital-gain-row">-</td></tr>
    <tr><th>기본공제</th><td id="ctc-r-deduction">250만원</td></tr>
    <tr><th>과세표준</th><td id="ctc-r-taxable-income-row">-</td></tr>
    <tr><th>예상 세금</th><td id="ctc-r-tax-row">-</td></tr>
  </tbody>
</table>
```

#### 예시 시나리오 카드

```html
<div class="ctc-scenario-grid">
  <!-- CTC_SCENARIO_PRESETS 기반 요약 카드 -->
</div>
```

#### FAQ + 관련 링크

- FAQ accordion 5개
- 관련 CTA 최소 3개
- `SeoContent`에 FAQ 주입

---

## 5. JS 인터랙션 (`coin-tax-calculator.js`)

### 5-1. 상태 객체

```js
const state = {
  assetName: "BTC",
  averageBuyPrice: 10000000,
  quantity: 1,
  sellPrice: 100000000,
  buyFeeRate: 0.0005,
  sellFeeRate: 0.0005,
  extraCost: 0,
  taxMode: "effective",
  taxYear: 2027,
};
```

### 5-2. 주요 함수 목록

| 함수명 | 역할 |
|---|---|
| `readForm()` | 입력 DOM 값을 state로 읽기 |
| `calculate(state)` | 핵심 계산 |
| `updateUI(result)` | KPI, 표, 안내 박스 갱신 |
| `applyPreset(presetId)` | 예시 시나리오 즉시 적용 |
| `syncUrlParams()` | URL 파라미터 동기화 |
| `restoreFromUrl()` | 공유 링크 복원 |
| `copyShareLink()` | 현재 상태 URL 복사 |
| `initFaq()` | FAQ accordion |

### 5-3. 입력값 파싱 규칙

```js
function pctToRate(value) {
  return (parseFloat(value) || 0) / 100;
}

function readForm() {
  state.assetName = document.getElementById("ctc-asset-name")?.value?.trim() || "BTC";
  state.averageBuyPrice = parseFloat(document.getElementById("ctc-buy-price")?.value || 0);
  state.quantity = parseFloat(document.getElementById("ctc-quantity")?.value || 0);
  state.sellPrice = parseFloat(document.getElementById("ctc-sell-price")?.value || 0);
  state.buyFeeRate = pctToRate(document.getElementById("ctc-buy-fee-rate")?.value);
  state.sellFeeRate = pctToRate(document.getElementById("ctc-sell-fee-rate")?.value);
  state.extraCost = parseFloat(document.getElementById("ctc-extra-cost")?.value || 0);
  state.taxYear = parseInt(document.getElementById("ctc-tax-year")?.value || 2027, 10);
}
```

### 5-4. UI 업데이트

```js
function updateUI(result) {
  setText("ctc-r-capital-gain", formatWon(result.capitalGain));
  setText("ctc-r-taxable-income", formatWon(result.taxableIncome));
  setText("ctc-r-tax", formatWon(result.estimatedTax));
  setText("ctc-r-after-tax-profit", formatWon(result.afterTaxProfit));
  setText("ctc-r-net-receipt", formatWon(result.netReceipt));

  setText("ctc-r-buy-amount", formatWon(result.buyAmount));
  setText("ctc-r-sell-amount", formatWon(result.sellAmount));
  setText("ctc-r-buy-fee", formatWon(result.buyFee));
  setText("ctc-r-sell-fee", formatWon(result.sellFee));
  setText("ctc-r-total-fee", formatWon(result.totalFee));
  setText("ctc-r-extra-cost", formatWon(state.extraCost));
  setText("ctc-r-capital-gain-row", formatWon(result.capitalGain));
  setText("ctc-r-taxable-income-row", formatWon(result.taxableIncome));
  setText("ctc-r-tax-row", formatWon(result.estimatedTax));
  setText("ctc-r-tax-rate", `${Math.round(result.appliedTaxRate * 100)}%`);

  const taxFreeBox = document.getElementById("ctc-taxfree-box");
  if (taxFreeBox) taxFreeBox.hidden = !result.isTaxFree;
}
```

### 5-5. URL 파라미터

| 파라미터 | 의미 |
|---|---|
| `asset` | 코인명 |
| `bp` | 평균 매수단가 |
| `qty` | 수량 |
| `sp` | 매도가 |
| `bf` | 매수 수수료율 |
| `sf` | 매도 수수료율 |
| `ec` | 기타 필요경비 |
| `tm` | 세율 모드 (`effective` / `incomeTaxOnly`) |
| `ty` | 과세 기준 연도 |

예시:

```text
?asset=BTC&bp=10000000&qty=1&sp=100000000&bf=0.05&sf=0.05&ec=0&tm=effective&ty=2027
```

### 5-6. 초기화

```js
document.addEventListener("DOMContentLoaded", function () {
  restoreFromUrl();
  bindEvents();
  initFaq();
  runCalculation();
});

function runCalculation() {
  readForm();
  const result = calculate(state);
  updateUI(result);
  syncUrlParams();
}
```

---

## 6. SCSS 설계 (`_coin-tax-calculator.scss`)

### 6-1. prefix

- 모든 클래스명 `ctc-` prefix 사용

### 6-2. CSS 변수

```scss
.ctc-page {
  --ctc-color-profit: #1f8f63;
  --ctc-color-tax: #d95c5c;
  --ctc-color-neutral: #4a6fa5;
  --ctc-color-warn: #f5a623;
}
```

### 6-3. 주요 컴포넌트

```scss
.ctc-result-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.ctc-result-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.125rem 1rem;
  text-align: center;

  &--main {
    border-color: var(--ctc-color-profit);
  }
}

.ctc-result-value {
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.2;

  &--hl {
    font-size: 1.75rem;
    color: var(--ctc-color-profit);
  }
}

.ctc-tax-mode-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.ctc-tax-mode-tab,
.ctc-preset-btn {
  padding: 0.5rem 0.875rem;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: transparent;
  cursor: pointer;
  font-size: 0.85rem;

  &.is-active {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: #fff;
  }
}

.ctc-breakdown-table {
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 0.75rem;
    border-bottom: 1px solid var(--color-border);
    text-align: left;
  }

  td {
    text-align: right;
    font-weight: 600;
  }
}

.ctc-notice-box {
  padding: 0.875rem 1rem;
  background: #fff8e1;
  border-left: 4px solid var(--ctc-color-warn);
  border-radius: 0 8px 8px 0;
  margin-bottom: 1rem;
}

.ctc-disclaimer {
  padding: 1rem 1.125rem;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-surface);
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.ctc-scenario-grid {
  display: grid;
  gap: 0.75rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.ctc-faq-item {
  border-bottom: 1px solid var(--color-border);
}

.ctc-faq-q {
  width: 100%;
  background: none;
  border: none;
  text-align: left;
  padding: 0.875rem 0;
  font-weight: 600;
  cursor: pointer;
}

.ctc-faq-a {
  padding: 0 0 1rem;
  color: var(--color-text-secondary);
  line-height: 1.7;
}
```

---

## 7. 등록 작업

### `src/data/tools.ts`

```ts
{
  slug: "coin-tax-calculator",
  title: "코인 세금 계산기",
  description: "비트코인·이더리움 등 가상자산 매도 시 양도차익, 250만원 공제, 예상 세금, 세후 순이익을 바로 계산합니다.",
  order: 24,
  eyebrow: "가상자산 세금",
  category: "calculator",
  iframeReady: false,
  badges: ["코인", "세금", "가상자산", "2027"],
  previewStats: [
    { label: "기본공제", value: "250만원", context: "국세청 안내 기준" },
    { label: "기본 계산세율", value: "22%", context: "지방세 포함 기본값" },
  ],
},
```

### `src/pages/index.astro`

```ts
"coin-tax-calculator": "투자·재테크",
```

### `src/styles/app.scss`

```scss
@use 'scss/pages/coin-tax-calculator';
```

### `public/sitemap.xml`

```xml
<url>
  <loc>https://bigyocalc.com/tools/coin-tax-calculator/</loc>
  <changefreq>yearly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## 8. SEO 설계

```text
title: "코인 세금 계산기 2026 | 가상자산 양도차익·250만원 공제·예상 세금 계산 | 비교계산소"
description: "비트코인·이더리움 등 코인 매도 시 양도차익, 250만원 기본공제, 예상 세금, 세후 순이익, 총 실수령 금액을 한 번에 계산해보세요."
```

### 권장 H 구조

- H1: 코인 세금 계산기 2026
- H2: 코인 매도 시 세후 수익 한눈에 보기
- H2: 상세 계산표
- H2: 대표 시나리오 예시
- H2: 코인 세금은 언제부터 적용되나요?
- H2: 코인 세금 계산 FAQ

---

## 9. QA 체크리스트

### 계산 로직

- [ ] 총 매수금액 = 평균 매수단가 × 수량
- [ ] 총 매도금액 = 매도가 × 수량
- [ ] 매수/매도 수수료 각각 분리 계산
- [ ] 양도차익 = 총 매도금액 - 총 매수금액 - 총 수수료 - 기타 필요경비
- [ ] 과세표준 = `max(0, 양도차익 - 2,500,000)`
- [ ] 세율 22% 모드 / 20% 모드 전환 시 결과 즉시 변경
- [ ] 과세표준 0 이하일 때 예상 세금 0 처리
- [ ] 총 실수령 금액 = 총 매도금액 - 총 매도 수수료 - 예상 세금

### UI

- [ ] 모바일 375px에서도 입력 폼이 한 화면 흐름으로 이어짐
- [ ] 예시 시나리오 버튼 클릭 시 값 즉시 반영
- [ ] 세율 모드 탭 활성화 상태 시각적으로 명확
- [ ] 비과세 케이스에서 안내 박스 노출
- [ ] FAQ accordion 정상 작동
- [ ] 링크 복사 버튼 정상 작동

### URL 파라미터

- [ ] 현재 입력 상태 직렬화
- [ ] 공유 링크 재진입 시 동일 계산 결과 복원

### 등록

- [ ] `src/data/tools.ts` 항목 추가
- [ ] `src/pages/index.astro` `topicBySlug` 추가
- [ ] `src/styles/app.scss` import 추가
- [ ] `public/sitemap.xml` URL 추가
- [ ] `npm run build` 에러 없음
- [ ] 메인 페이지 `투자·재테크` 필터에서 노출

---

## 10. 구현 메모

- MVP는 **단일 코인 계산기**로 끝내고, 구조만 `rows[]` 확장 가능하게 잡는다.
- 결과 상단은 `예상 세금`보다 `세후 순이익`과 `총 실수령 금액`이 더 눈에 띄게 설계한다.
- 법·세무 문구는 단정형 대신 `안내 기준`, `참고용`, `최신 기준 확인` 표현을 유지한다.
- 국세청 기준이 바뀌면 `CTC_RULES`와 `InfoNotice`, FAQ 첫 2개만 먼저 갱신해도 페이지 전체 정합성이 유지되도록 설계한다.
# 플레이북 타입 재지정 메모
#
# - 최종 타입: Type A. Simple Calculator
# - 기준 문서: docs/design/202604/calculator-playbook-design.md
# - 재지정 이유:
#   - 이 계산기의 핵심은 예상 세금과 세후 금액을 빠르게 보여주는 것이다.
#   - 사용자는 복잡한 전략 비교보다 지금 매도하면 얼마가 남는지 먼저 알고 싶어한다.
#   - 따라서 설계와 구현 모두 단순 결과 중심 계산기 구조를 우선한다.
# - 적용 규칙:
#   - KPI는 4~6개 이내로 유지한다.
#   - 차트와 과도한 시나리오 확장은 넣지 않는다.
#   - 하단은 이어보기, 외부 참고 링크를 고정 섹션으로 둔다.
