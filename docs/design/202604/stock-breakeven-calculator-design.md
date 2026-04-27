# 주식 손익분기점 계산기 — 설계 문서

> 기획 원문: 없음 (설계 문서 선작성)
> 작성일: 2026-04-27
> 구현 기준: Claude/Codex가 이 문서만 보고 바로 `/tools/` 계산기를 구현할 수 있는 수준으로 고정
> 참고 계산기: `coin-tax-calculator`, `domestic-stock-capital-gains-tax`, `dca-investment-calculator`

---

## 1. 문서 개요

### 1-1. 대상

- 구현 대상: `주식 손익분기점 계산기`
- 권장 slug: `stock-breakeven-calculator`
- 권장 URL: `/tools/stock-breakeven-calculator/`
- 콘텐츠 유형: 계산기 (`/tools/`)

### 1-2. 페이지 성격

- 주식을 매수한 뒤 수수료와 거래세를 포함한 **실제 손익분기점 매도가**를 바로 계산하는 도구
- 핵심 질문: "지금 얼마에 팔아야 본전인가?"
- 확장 질문: "현재 주가 기준 내 손익은?" / "목표 수익률로 팔려면 얼마에 팔아야 하나?"
- 매수가와 동일한 가격에 팔면 손해를 본다는 사실(수수료+거래세)을 직관적으로 인식시키는 것이 이 계산기의 핵심 UX 포인트다.
- 계산기 유형: **Type A. Simple Calculator** (단순 결과 중심)

### 1-3. 이 문서의 역할

- 데이터 스키마, 입력 UX, 계산 로직, FAQ, SCSS prefix, 등록 체크를 고정
- 이후 구현은 이 문서를 기준으로 `src/data/`, `src/pages/tools/`, `public/scripts/`, `src/styles/`, `src/data/tools.ts`에 반영

---

## 2. 권장 파일 구조

```text
src/
  data/
    stockBreakevenCalculator.ts
  pages/
    tools/
      stock-breakeven-calculator.astro

public/
  scripts/
    stock-breakeven-calculator.js
  og/
    tools/
      stock-breakeven-calculator.png

src/styles/scss/pages/
  _stock-breakeven-calculator.scss
```

### 2-1. 추가 반영 파일

- `src/data/tools.ts`
- `src/styles/app.scss`
- `public/sitemap.xml`

---

## 3. 구현 범위

### 3-1. MVP 범위

- 매수가, 수량, 매수 수수료율 입력
- 매도 수수료율, 증권거래세율 입력 (기본값 자동 설정)
- 손익분기점 매도가 계산
- 손익분기점 상승률(%) 표시
- 현재가 입력 시 현재 손익(금액 + %) 실시간 표시
- 목표 수익률 입력 시 목표 매도가 표시
- 결과 KPI 카드
- 시장 구분 프리셋 (코스피 / 코스닥 / 코넥스)
- FAQ / 관련 링크 / 출처

### 3-2. MVP 제외

- 차트 (v2에서 추가)
- 복수 종목 포트폴리오 합산
- 평균단가 재계산 (물타기/불타기)
- 세후 손익분기점 (양도소득세 반영) — 별도 계산기로 분리

### 3-3. 확장 여지 (v2 이후)

- 물타기/추가 매수 후 평균단가 재계산 및 손익분기점 갱신
- 주가 시나리오 바 차트 (매수가 / 손익분기점 / 현재가 / 목표가 비교)
- 하락 회복 계산: "X% 하락한 주식이 원금 회복하려면 Y% 상승 필요"
- URL 공유

---

## 4. 페이지 목표

- 사용자가 "매수가 = 손익분기점"이 아님을 즉시 이해하게 만든다.
- 수수료와 거래세를 포함한 실제 본전 매도가를 0.1초 안에 확인할 수 있다.
- 현재 주가를 입력해 지금 내 투자 상태(수익/손실)를 확인하는 용도로도 쓸 수 있다.
- 결과는 항상 "참고용 추정값"임을 명시하고, 실제 수수료는 증권사마다 다름을 안내한다.

---

## 5. 데이터 설계 (`src/data/stockBreakevenCalculator.ts`)

### 5-1. 타입 정의

```ts
export type MarketType = "kospi" | "kosdaq" | "konex" | "custom";

export interface MarketPreset {
  id: MarketType;
  label: string;
  transactionTaxRate: number;
  note: string;
}

export interface CalculatorMeta {
  slug: string;
  title: string;
  description: string;
  updatedAt: string;
  caution: string;
}

export interface ScenarioPreset {
  id: string;
  label: string;
  buyPrice: number;
  quantity: number;
  buyFeeRate: number;
  sellFeeRate: number;
  market: MarketType;
  currentPrice?: number;
  targetReturnRate?: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
}
```

### 5-2. 권장 export 구조

```ts
export const SBC_META: CalculatorMeta = { ... };
export const SBC_MARKET_PRESETS: MarketPreset[] = [ ... ];
export const SBC_DEFAULT_INPUT = { ... };
export const SBC_SCENARIO_PRESETS: ScenarioPreset[] = [ ... ];
export const SBC_FAQ: FaqItem[] = [ ... ];
export const SBC_RELATED_LINKS: RelatedLink[] = [ ... ];
```

### 5-3. 상수 값 (2026 기준)

```ts
export const SBC_META = {
  slug: "stock-breakeven-calculator",
  title: "주식 손익분기점 계산기",
  description: "매수가, 수량, 수수료, 거래세를 반영해 실제 손익분기점 매도가를 계산합니다.",
  updatedAt: "2026-04",
  caution: "본 계산기는 참고용이며, 실제 수수료·세율은 증권사·시장에 따라 다를 수 있습니다.",
};

export const SBC_MARKET_PRESETS: MarketPreset[] = [
  { id: "kospi",  label: "코스피",  transactionTaxRate: 0.0018, note: "증권거래세 0.18%" },
  { id: "kosdaq", label: "코스닥",  transactionTaxRate: 0.0018, note: "증권거래세 0.18%" },
  { id: "konex",  label: "코넥스",  transactionTaxRate: 0.001,  note: "증권거래세 0.10%" },
  { id: "custom", label: "직접 입력", transactionTaxRate: 0,    note: "거래세율 직접 입력" },
];

export const SBC_DEFAULT_INPUT = {
  buyPrice: 50000,
  quantity: 100,
  buyFeeRate: 0.00015,   // 0.015%
  sellFeeRate: 0.00015,  // 0.015%
  market: "kospi" as MarketType,
  transactionTaxRate: 0.0018,
  currentPrice: null,
  targetReturnRate: 5,   // 5%
};

export const SBC_SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: "samsung",
    label: "대형주 100주",
    buyPrice: 80000,
    quantity: 100,
    buyFeeRate: 0.00015,
    sellFeeRate: 0.00015,
    market: "kospi",
    currentPrice: 76000,
    targetReturnRate: 10,
  },
  {
    id: "kosdaq-mid",
    label: "코스닥 중형주",
    buyPrice: 15000,
    quantity: 500,
    buyFeeRate: 0.00015,
    sellFeeRate: 0.00015,
    market: "kosdaq",
    currentPrice: 13500,
    targetReturnRate: 15,
  },
  {
    id: "loss-recovery",
    label: "30% 하락 회복",
    buyPrice: 100000,
    quantity: 50,
    buyFeeRate: 0.00015,
    sellFeeRate: 0.00015,
    market: "kospi",
    currentPrice: 70000,
    targetReturnRate: 0,
  },
];

export const SBC_FAQ: FaqItem[] = [
  {
    question: "매수가와 손익분기점은 왜 다른가요?",
    answer: "주식을 살 때 매수 수수료, 팔 때 매도 수수료와 증권거래세가 발생합니다. 이 비용을 모두 회수해야 '본전'이므로 손익분기점 매도가는 매수가보다 높습니다.",
  },
  {
    question: "증권거래세율은 얼마인가요?",
    answer: "2026년 기준 코스피·코스닥 상장주식의 증권거래세율은 0.18%입니다(매도 시 매도금액 기준). 코넥스는 0.10%입니다. 실제 적용 세율은 시장과 거래 방식에 따라 다를 수 있으므로 증권사 HTS/MTS에서 확인해야 합니다.",
  },
  {
    question: "수수료율은 어디서 확인하나요?",
    answer: "증권사마다 수수료율이 다릅니다. 온라인(MTS/HTS) 기준으로는 보통 0.015%~0.1% 수준이며, 신규 개설 혜택으로 일정 기간 무료인 경우도 있습니다. 이용 중인 증권사 앱에서 '수수료 안내'를 확인하세요.",
  },
  {
    question: "손익분기점 계산에 세금(양도소득세)도 포함되나요?",
    answer: "이 계산기는 매매 수수료와 증권거래세(거래 시 자동 부과)만 반영합니다. 국내 상장주식 개인투자자(비대주주)는 원칙적으로 양도소득세 과세 대상이 아닙니다. 대주주이거나 비상장주식이라면 별도 양도소득세 계산이 필요합니다.",
  },
  {
    question: "목표 수익률 계산은 어떻게 되나요?",
    answer: "목표 수익률을 입력하면, 매수 총비용 대비 그 수익률을 달성하기 위한 매도가를 계산합니다. 예를 들어 목표 수익률 10% 입력 시 모든 비용 회수 후 10%의 순이익이 남는 매도가를 보여줍니다.",
  },
];

export const SBC_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/domestic-stock-capital-gains-tax/", label: "국내주식 양도소득세 계산기" },
  { href: "/tools/dca-investment-calculator/",        label: "적립식 투자 수익 비교 계산기" },
  { href: "/tools/coin-tax-calculator/",              label: "코인 세금 계산기" },
  { href: "/tools/fire-calculator/",                  label: "파이어족 계산기" },
];
```

---

## 6. 계산 로직

### 6-1. 핵심 변수 정의

```js
// 입력값
buyPrice          // 주당 매수가 (원)
quantity          // 수량 (주)
buyFeeRate        // 매수 수수료율 (소수, 예: 0.00015)
sellFeeRate       // 매도 수수료율 (소수, 예: 0.00015)
transactionTaxRate// 증권거래세율 (소수, 예: 0.0018)
currentPrice      // 현재가 (null 가능)
targetReturnRate  // 목표 수익률 (%, 예: 5)
```

### 6-2. 매수 총비용

```js
totalBuyAmount = buyPrice * quantity;
buyFee = totalBuyAmount * buyFeeRate;
totalBuyCost = totalBuyAmount + buyFee;
```

### 6-3. 손익분기점 매도가

매도 수수료와 증권거래세는 매도금액 기준으로 부과된다.
`순수령금액 = 매도금액 × (1 - sellFeeRate - transactionTaxRate)`

손익분기점 조건: `순수령금액 = totalBuyCost`

```js
breakEvenSellAmount = totalBuyCost / (1 - sellFeeRate - transactionTaxRate);
breakEvenSellPrice  = breakEvenSellAmount / quantity;

breakEvenRiseRate   = ((breakEvenSellPrice - buyPrice) / buyPrice) * 100;
// 매수가 대비 손익분기점까지 오른 비율(%)
```

### 6-4. 손익분기점 매도 시 수수료·세금

```js
breakevenSellFee         = breakEvenSellAmount * sellFeeRate;
breakevenTransactionTax  = breakEvenSellAmount * transactionTaxRate;
breakevenTotalCost       = buyFee + breakevenSellFee + breakevenTransactionTax;
```

### 6-5. 현재가 기준 손익 (currentPrice가 있을 때만)

```js
currentSellAmount   = currentPrice * quantity;
currentSellFee      = currentSellAmount * sellFeeRate;
currentTxTax        = currentSellAmount * transactionTaxRate;
currentNetReceipt   = currentSellAmount - currentSellFee - currentTxTax;

currentProfitLoss     = currentNetReceipt - totalBuyCost;
currentReturnRate     = (currentProfitLoss / totalBuyCost) * 100;

isBelowBreakEven      = currentPrice < breakEvenSellPrice;
gapToBreakEven        = breakEvenSellPrice - currentPrice;
gapToBreakEvenRate    = (gapToBreakEven / currentPrice) * 100;
// 현재가에서 손익분기점까지 남은 상승 필요율
```

### 6-6. 목표 수익률 매도가

```js
// 목표: 순수령금액 = totalBuyCost × (1 + targetReturnRate / 100)
targetNetReceipt  = totalBuyCost * (1 + targetReturnRate / 100);
targetSellAmount  = targetNetReceipt / (1 - sellFeeRate - transactionTaxRate);
targetSellPrice   = targetSellAmount / quantity;
targetRiseRate    = ((targetSellPrice - buyPrice) / buyPrice) * 100;
```

### 6-7. 엣지 케이스 처리

- `quantity <= 0` 또는 `buyPrice <= 0` 이면 계산 중단, 안내 메시지 표시
- `(sellFeeRate + transactionTaxRate) >= 1` 이면 비정상 입력으로 처리
- `currentPrice` 미입력 시 현재 손익 섹션 숨김
- `targetReturnRate`가 0이면 "목표 매도가 = 손익분기점"과 동일

---

## 7. 페이지 구조 (`src/pages/tools/stock-breakeven-calculator.astro`)

### 7-1. 기본 구성

- `BaseLayout`
- `SiteHeader`
- `CalculatorHero`
- `InfoNotice`
- `ToolActionBar`
- `SimpleToolShell`
- `SeoContent`

### 7-2. 권장 설정

- `calculatorId="stock-breakeven-calculator"`
- `pageClass="sbc-page"`
- `resultFirst={true}`

### 7-3. 섹션 순서

#### [A] Hero

```astro
<CalculatorHero
  eyebrow="주식 계산기"
  title="주식 손익분기점 계산기"
  description="매수가, 수량, 수수료, 증권거래세를 반영해 실제 본전 매도가를 계산합니다. 현재가를 입력하면 지금 내 손익도 바로 확인할 수 있습니다."
/>
```

#### [B] InfoNotice

```astro
<InfoNotice
  text="계산 결과는 입력값 기준 참고용 추정치입니다. 실제 수수료율과 거래세율은 이용 중인 증권사와 시장에 따라 다를 수 있으니 확인 후 활용하세요."
/>
```

#### [C] 입력 패널 (aside)

##### 블록 1. 매수 정보

| 필드 | id | 기본값 | 타입 |
|------|----|--------|------|
| 주당 매수가 | `sbc-buy-price` | 50,000 | number |
| 매수 수량 | `sbc-quantity` | 100 | number |
| 매수 수수료율 (%) | `sbc-buy-fee-rate` | 0.015 | number |

##### 블록 2. 매도 조건

| 필드 | id | 기본값 | 타입 |
|------|----|--------|------|
| 시장 구분 | `sbc-market` | kospi | select |
| 증권거래세율 (%) | `sbc-tx-tax-rate` | 0.18 | number (custom일 때만 활성) |
| 매도 수수료율 (%) | `sbc-sell-fee-rate` | 0.015 | number |

시장 구분 select 변경 시 증권거래세율 자동 반영:
- 코스피/코스닥 → 0.18%
- 코넥스 → 0.10%
- 직접 입력 → 입력 필드 활성화

##### 블록 3. 현재가 & 목표 수익률 (선택 입력)

| 필드 | id | 기본값 | 타입 |
|------|----|--------|------|
| 현재 주가 (선택) | `sbc-current-price` | - | number (optional) |
| 목표 수익률 (%) | `sbc-target-return` | 5 | number |

##### 블록 4. 액션 버튼

```html
<div class="sbc-actions">
  <button id="sbc-calc-btn" class="button button--primary">계산하기</button>
  <button id="sbc-reset-btn" class="button button--ghost">초기화</button>
  <button id="sbc-copy-link-btn" class="button button--ghost">링크 복사</button>
</div>
```

##### 블록 5. 예시 시나리오 버튼

```html
<div class="sbc-scenario-presets" id="sbc-scenario-presets">
  <button class="sbc-preset-btn" data-preset="samsung">대형주 100주</button>
  <button class="sbc-preset-btn" data-preset="kosdaq-mid">코스닥 중형주</button>
  <button class="sbc-preset-btn" data-preset="loss-recovery">30% 하락 회복</button>
</div>
```

#### [D] 결과 KPI 카드 (main)

```html
<div class="sbc-kpi-grid">
  <!-- 카드 1: 손익분기점 매도가 (가장 크게) -->
  <div class="sbc-kpi-card sbc-kpi-card--main">
    <p class="sbc-kpi-label">손익분기점 매도가</p>
    <p class="sbc-kpi-value sbc-kpi-value--hl" id="sbc-r-breakeven-price">-</p>
    <p class="sbc-kpi-note">매수가 대비 <span id="sbc-r-rise-rate">-</span> 상승해야 본전</p>
  </div>

  <!-- 카드 2: 총 매수비용 -->
  <div class="sbc-kpi-card">
    <p class="sbc-kpi-label">총 매수비용</p>
    <p class="sbc-kpi-value" id="sbc-r-total-buy-cost">-</p>
    <p class="sbc-kpi-note">매수금액 + 수수료</p>
  </div>

  <!-- 카드 3: 총 비용 합계 -->
  <div class="sbc-kpi-card">
    <p class="sbc-kpi-label">예상 총 비용 (매수+매도)</p>
    <p class="sbc-kpi-value" id="sbc-r-total-cost">-</p>
    <p class="sbc-kpi-note">수수료 + 거래세 합산</p>
  </div>

  <!-- 카드 4: 목표 매도가 -->
  <div class="sbc-kpi-card">
    <p class="sbc-kpi-label">목표 수익률 매도가</p>
    <p class="sbc-kpi-value" id="sbc-r-target-price">-</p>
    <p class="sbc-kpi-note">목표 <span id="sbc-r-target-rate">-</span>% 기준</p>
  </div>
</div>
```

#### [E] 현재가 손익 박스 (currentPrice 입력 시 노출)

```html
<div class="sbc-current-result" id="sbc-current-result" hidden>
  <div class="sbc-current-result__header">
    <span>현재가 기준 손익</span>
    <span class="sbc-status-badge" id="sbc-status-badge">-</span>
  </div>
  <div class="sbc-current-grid">
    <div>
      <p class="sbc-current-label">예상 손익</p>
      <p class="sbc-current-value" id="sbc-r-profit-loss">-</p>
    </div>
    <div>
      <p class="sbc-current-label">수익률</p>
      <p class="sbc-current-value" id="sbc-r-return-rate">-</p>
    </div>
    <div>
      <p class="sbc-current-label">손익분기점까지</p>
      <p class="sbc-current-value" id="sbc-r-gap-to-be">-</p>
    </div>
    <div>
      <p class="sbc-current-label">필요 상승률</p>
      <p class="sbc-current-value" id="sbc-r-gap-rate">-</p>
    </div>
  </div>
</div>
```

#### [F] 상세 계산표

```html
<table class="sbc-breakdown-table">
  <tbody>
    <tr><th>주당 매수가</th><td id="sbc-d-buy-price">-</td></tr>
    <tr><th>매수 수량</th><td id="sbc-d-quantity">-</td></tr>
    <tr><th>총 매수금액</th><td id="sbc-d-buy-amount">-</td></tr>
    <tr><th>매수 수수료</th><td id="sbc-d-buy-fee">-</td></tr>
    <tr><th>총 매수비용</th><td id="sbc-d-total-buy-cost">-</td></tr>
    <tr class="sbc-separator"><th colspan="2">손익분기점 기준 매도 시</th></tr>
    <tr><th>손익분기점 매도가</th><td id="sbc-d-be-price">-</td></tr>
    <tr><th>매도 수수료</th><td id="sbc-d-sell-fee">-</td></tr>
    <tr><th>증권거래세</th><td id="sbc-d-tx-tax">-</td></tr>
    <tr><th>총 비용 합계</th><td id="sbc-d-total-cost">-</td></tr>
  </tbody>
</table>
```

#### [G] FAQ / 출처 / 관련 링크

- FAQ 5개 (accordion)
- 관련 계산기 CTA 최소 3개
- `SeoContent`에 FAQ 주입

---

## 8. 인터랙션 설계 (`public/scripts/stock-breakeven-calculator.js`)

### 8-1. 상태 객체

```js
const state = {
  buyPrice: 50000,
  quantity: 100,
  buyFeeRate: 0.00015,
  sellFeeRate: 0.00015,
  market: "kospi",
  transactionTaxRate: 0.0018,
  currentPrice: null,
  targetReturnRate: 5,
};
```

### 8-2. 주요 함수 목록

| 함수명 | 역할 |
|--------|------|
| `readForm()` | 입력 DOM 값을 state로 읽기 |
| `calculate(state)` | 핵심 계산, 결과 객체 반환 |
| `updateUI(result)` | KPI 카드, 상세표, 현재가 박스 갱신 |
| `applyPreset(presetId)` | 예시 시나리오 즉시 적용 |
| `onMarketChange()` | 시장 변경 시 거래세율 자동 반영 |
| `syncUrlParams()` | URL 파라미터 직렬화 |
| `restoreFromUrl()` | 공유 링크 복원 |
| `copyShareLink()` | 현재 상태 URL 복사 |
| `initFaq()` | FAQ accordion 초기화 |

### 8-3. 통합 계산 함수

```js
function calculate(state) {
  const { buyPrice, quantity, buyFeeRate, sellFeeRate, transactionTaxRate,
          currentPrice, targetReturnRate } = state;

  // 매수
  const totalBuyAmount = buyPrice * quantity;
  const buyFee         = totalBuyAmount * buyFeeRate;
  const totalBuyCost   = totalBuyAmount + buyFee;

  // 손익분기점
  const denominator         = 1 - sellFeeRate - transactionTaxRate;
  const breakEvenSellAmount = totalBuyCost / denominator;
  const breakEvenSellPrice  = breakEvenSellAmount / quantity;
  const breakEvenRiseRate   = ((breakEvenSellPrice - buyPrice) / buyPrice) * 100;

  // 손익분기점 기준 비용
  const beSellFee        = breakEvenSellAmount * sellFeeRate;
  const beTxTax          = breakEvenSellAmount * transactionTaxRate;
  const totalCostAtBE    = buyFee + beSellFee + beTxTax;

  // 목표 수익률
  const targetNetReceipt = totalBuyCost * (1 + targetReturnRate / 100);
  const targetSellAmount = targetNetReceipt / denominator;
  const targetSellPrice  = targetSellAmount / quantity;
  const targetRiseRate   = ((targetSellPrice - buyPrice) / buyPrice) * 100;

  // 현재가 손익
  let currentResult = null;
  if (currentPrice && currentPrice > 0) {
    const curSellAmount  = currentPrice * quantity;
    const curSellFee     = curSellAmount * sellFeeRate;
    const curTxTax       = curSellAmount * transactionTaxRate;
    const curNetReceipt  = curSellAmount - curSellFee - curTxTax;
    const profitLoss     = curNetReceipt - totalBuyCost;
    const returnRate     = (profitLoss / totalBuyCost) * 100;
    const gapToBreakEven = breakEvenSellPrice - currentPrice;
    const gapRate        = (gapToBreakEven / currentPrice) * 100;

    currentResult = {
      curNetReceipt,
      profitLoss,
      returnRate,
      gapToBreakEven,
      gapRate,
      isProfit: profitLoss >= 0,
    };
  }

  return {
    totalBuyAmount, buyFee, totalBuyCost,
    breakEvenSellPrice, breakEvenRiseRate,
    beSellFee, beTxTax, totalCostAtBE,
    targetSellPrice, targetRiseRate,
    currentResult,
  };
}
```

### 8-4. 색상 상태 표시

- 현재가 > 손익분기점: `sbc-status-badge--profit` (초록)
- 현재가 < 손익분기점: `sbc-status-badge--loss` (빨강)
- 현재가 = 손익분기점 ±0.5%: `sbc-status-badge--near` (노랑)

### 8-5. URL 파라미터

| 파라미터 | 의미 |
|----------|------|
| `bp` | 주당 매수가 |
| `qty` | 수량 |
| `bf` | 매수 수수료율 |
| `sf` | 매도 수수료율 |
| `mkt` | 시장 구분 |
| `tt` | 증권거래세율 |
| `cp` | 현재가 |
| `tr` | 목표 수익률 |

예시:

```text
?bp=50000&qty=100&bf=0.015&sf=0.015&mkt=kospi&tt=0.18&cp=48000&tr=5
```

### 8-6. 초기화

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

## 9. 스타일 가이드 (`_stock-breakeven-calculator.scss`)

### 9-1. prefix

- 모든 클래스명 `sbc-` prefix 사용

### 9-2. CSS 변수

```scss
.sbc-page {
  --sbc-color-profit:  #1f8f63;
  --sbc-color-loss:    #d95c5c;
  --sbc-color-neutral: #4a6fa5;
  --sbc-color-warn:    #f5a623;
  --sbc-color-near:    #e8a000;
}
```

### 9-3. 주요 블록

```scss
.sbc-kpi-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.sbc-kpi-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.125rem 1rem;
  text-align: center;

  &--main {
    grid-column: 1 / -1;
    border-color: var(--color-primary);

    @media (min-width: 768px) {
      grid-column: span 2;
    }
  }
}

.sbc-kpi-value {
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.2;

  &--hl {
    font-size: 1.75rem;
    color: var(--color-primary);
  }
}

.sbc-status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;

  &--profit { background: #e8f5e9; color: var(--sbc-color-profit); }
  &--loss   { background: #fdecea; color: var(--sbc-color-loss); }
  &--near   { background: #fff8e1; color: var(--sbc-color-near); }
}

.sbc-current-result {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.25rem;
  margin-top: 1.25rem;
}

.sbc-current-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.sbc-breakdown-table {
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 0.75rem;
    border-bottom: 1px solid var(--color-border);
    text-align: left;
  }

  td { text-align: right; font-weight: 600; }
}

.sbc-separator th {
  background: var(--color-surface);
  color: var(--color-text-secondary);
  font-size: 0.8rem;
  padding: 0.5rem 0.75rem;
}

.sbc-scenario-presets {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.sbc-preset-btn {
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
```

### 9-4. 모바일 대응

- KPI 카드 2열 (기본) → 4열 (768px+)
- 메인 KPI 카드는 항상 full-width
- 현재가 손익 섹션 2열 (기본) → 4열 (640px+)
- 상세 계산표는 스크롤 없이 표시되도록 `font-size: 0.9rem` 유지

---

## 10. SEO / 메타 / 스키마

### 10-1. 메타

- `title`: `주식 손익분기점 계산기 | 수수료·거래세 포함 실제 본전 매도가 계산`
- `description`: `주식 매수 후 수수료와 증권거래세를 모두 반영한 손익분기점 매도가를 즉시 계산합니다. 현재가 입력 시 지금 내 손익도 바로 확인하세요.`

### 10-2. H 구조

- H1: `주식 손익분기점 계산기`
- H2: `손익분기점 계산 결과`
- H2: `상세 계산표`
- H2: `주식 손익분기점 FAQ`

### 10-3. 구조화 데이터

- `WebApplication`
- `FAQPage`

### 10-4. 타겟 키워드

- 주식 손익분기점 계산기
- 주식 본전 매도가 계산
- 주식 수수료 포함 손익분기점
- 증권거래세 포함 본전가
- 주식 매수가 손익분기점 차이

---

## 11. 등록 반영

### 11-1. `src/data/tools.ts`

```ts
{
  slug: "stock-breakeven-calculator",
  title: "주식 손익분기점 계산기",
  description: "매수가, 수량, 수수료, 증권거래세를 반영해 실제 본전 매도가와 목표 수익률 매도가를 계산합니다.",
  order: 28,
  eyebrow: "주식 계산기",
  category: "investment",
  iframeReady: false,
  badges: ["주식", "수수료", "손익분기점"],
  previewStats: [
    { label: "거래세 기본값", value: "0.18%", context: "코스피·코스닥 기준" },
    { label: "계산 항목", value: "수수료+거래세", context: "매수·매도 모두 반영" },
  ],
},
```

### 11-2. `src/styles/app.scss`

```scss
@use 'scss/pages/stock-breakeven-calculator';
```

### 11-3. `public/sitemap.xml`

```xml
<url>
  <loc>https://bigyocalc.com/tools/stock-breakeven-calculator/</loc>
  <changefreq>yearly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## 12. 구현 순서

1. `src/data/stockBreakevenCalculator.ts` 작성
2. `src/pages/tools/stock-breakeven-calculator.astro` 작성
3. `public/scripts/stock-breakeven-calculator.js` 작성
4. `src/styles/scss/pages/_stock-breakeven-calculator.scss` 작성
5. `src/data/tools.ts` 등록
6. `src/styles/app.scss` import 추가
7. `public/sitemap.xml` 등록
8. `npm run build` 검증

---

## 13. QA 체크리스트

### 계산 로직

- [ ] 총 매수비용 = 주당 매수가 × 수량 + 매수 수수료
- [ ] 손익분기점 매도가 = 총 매수비용 / (수량 × (1 - 매도수수료율 - 거래세율))
- [ ] 손익분기점 상승률(%) = (손익분기점 매도가 - 매수가) / 매수가 × 100
- [ ] 목표 수익률 매도가: 순수령금액이 총 매수비용 × (1 + 목표수익률%)가 되는 매도가
- [ ] 현재가 미입력 시 손익 섹션 hidden 처리
- [ ] 시장 변경 시 거래세율 자동 반영 (직접 입력 선택 시 입력 필드 활성화)
- [ ] 수량·매수가 0 이하 입력 시 계산 중단 및 안내

### UI

- [ ] 모바일 375px에서 KPI 카드 2열 정상 표시
- [ ] 손익분기점 카드가 가장 두드러지게 표시됨
- [ ] 현재가 입력 시 손익 박스 즉시 노출
- [ ] 수익/손실 상태에 따라 badge 색상 변경
- [ ] 예시 시나리오 버튼 클릭 시 폼 값 즉시 반영 후 자동 계산
- [ ] FAQ accordion 정상 작동

### URL 파라미터

- [ ] 현재 입력 상태 직렬화 (현재가 포함)
- [ ] 공유 링크 재진입 시 동일 계산 결과 복원

### 등록

- [ ] `src/data/tools.ts` 항목 추가
- [ ] `src/styles/app.scss` import 추가
- [ ] `public/sitemap.xml` URL 추가
- [ ] `npm run build` 에러 없음

---

## 14. 핵심 구현 메모

- 이 계산기의 핵심 인사이트는 "매수가 = 손익분기점이 아님"이다. 이것을 첫 결과 카드에서 시각적으로 강조한다.
- `breakEvenRiseRate`가 0.3% ~ 0.5% 정도 나오는 게 현실적이다. 이 작은 차이가 수수료의 실체를 보여준다.
- 현재가 입력은 선택 사항이지만 재방문율을 높이는 핵심 기능이므로 입력 UI를 눈에 띄게 배치한다.
- 결과는 항상 "참고용 추정값" 표현 유지. 실제 수수료는 증권사·계좌 유형마다 다름.
- 거래세율은 법 개정에 민감하므로 `SBC_MARKET_PRESETS`에만 정의하고, 하드코딩하지 않는다.
- 국내 개인투자자 기준 비과세를 전제하되, InfoNotice에서 대주주/비상장 예외를 간략히 안내한다.
