# 국민연금 수령액 계산기 2026 — 설계 문서

> 기획 원문: `docs/plan/202604/national-pension-calculator.md`
> 작성일: 2026-04-11
> 구현 기준: Claude/Codex가 이 문서를 보고 바로 구현에 착수할 수 있는 수준으로 고정
> 참고 계산기: `fire-calculator`, `dca-investment-calculator` (SimpleToolShell, 입력·결과 카드 패턴)
> 연관 리포트: `national-pension-generational-comparison-2026` (내부 링크 연결)

---

## 1. 문서 개요

### 1-1. 대상

- 기획 문서: `docs/plan/202604/national-pension-calculator.md`
- 구현 대상: `국민연금 수령액 계산기 2026`
- 콘텐츠 유형: **계산기** (`/tools/` 계열)

### 1-2. 포지션 확정

> **"공단 공식 조회 대체"가 아니라 "내 조건으로 빠르게 감 잡는 간편 추정 계산기"**

- 실제 수령액은 공단 가입이력 조회 결과와 다를 수 있음 — 안내 필수
- 대신 **조기/정상/연기수령 시나리오 3개 자동 비교**, **손익분기점**, **노후 부족분**은 직관적으로 제공
- 모든 수령액·납입액 결과값: `추정` 배지 필수

### 1-3. 권장 slug

- `national-pension-calculator`
- URL: `/tools/national-pension-calculator/`

### 1-4. topicBySlug 카테고리

- `"national-pension-calculator": "투자·재테크"` (`src/pages/index.astro`)

### 1-5. 권장 파일 구조

```
src/
  data/
    tools.ts                            ← 항목 추가
    nationalPensionCalculator.ts        ← 상수 + FAQ
  pages/
    tools/
      national-pension-calculator.astro

public/
  scripts/
    national-pension-calculator.js      ← 계산 로직, DOM 바인딩, 차트
  og/tools/
    national-pension-calculator.png

src/styles/scss/pages/
  _national-pension-calculator.scss    ← prefix: npc-
```

---

## 2. 데이터 파일 설계 (`nationalPensionCalculator.ts`)

```ts
// ── 공식 기준 상수
export const NPC_RULES = {
  minContributionYears: 10,         // 최소 가입기간 (노령연금 수급 조건)
  normalStartAge:       65,         // 정상 지급개시연령 (1969년 이후 출생)
  earlyStartAge:        60,         // 조기노령연금 시작 가능 연령
  maxDeferYears:        5,          // 연기 최대 연수
  deferBonusPerMonth:   0.006,      // 연기연금 월 가산율 (+0.6%/월, 공식)
  earlyDeductPerMonth:  0.005,      // 조기수령 월 감액율 (-0.5%/월, 공식)
  incomeReplacementRate: 0.43,      // 소득대체율 2026년부터
  premiumRate2026:      0.095,      // 2026년 보험료율
  aValue2026:           319.4,      // 2026년 기준 A값 (만원, 3,193,511원)
  baseContributionYears: 40,        // 소득대체율 기준 가입기간
  maxEndAge:            60,         // 납입 종료 최대 나이
};

// ── 기본 입력값
export const NPC_DEFAULT_INPUT = {
  currentAge:          40,
  birthYear:           1986,
  startYear:           2010,
  incomeMode:          "income" as "income" | "premium",
  monthlyIncome:       300,         // 만원
  monthlyPremium:      14,          // 만원 (직접 입력 시)
  endAge:              60,
  subscriberType:      "employee" as "employee" | "regional",
  claimType:           "normal" as "early" | "normal" | "deferred",
  deferYears:          3,
  lifeExpectancy:      85,
  targetMonthlyExpense: 300,        // 만원 (노후 생활비 목표)
  inflationRate:       2.5,         // % (실질가치 계산용)
  contributionGapYears: 0,
};

// ── 소득월액 프리셋 (빠른 입력 버튼)
export const INCOME_PRESETS = [
  { label: "200만원",  value: 200 },
  { label: "300만원",  value: 300 },
  { label: "400만원",  value: 400 },
  { label: "500만원",  value: 500 },
  { label: "600만원+", value: 600 },
];

// ── 기대수명 프리셋
export const LIFE_EXPECTANCY_PRESETS = [
  { label: "80세", value: 80 },
  { label: "85세", value: 85 },
  { label: "90세", value: 90 },
];

// ── FAQ
export const NPC_FAQ = [
  {
    q: "국민연금은 몇 년 이상 내야 받을 수 있나요?",
    a: "최소 가입기간 10년(120개월) 이상이어야 노령연금을 받을 수 있습니다. 10년 미만이면 반환일시금을 받게 됩니다.",
  },
  {
    q: "1969년 이후 출생자는 몇 살부터 받나요?",
    a: "1969년 이후 출생자는 만 65세부터 정상 노령연금을 받을 수 있습니다. 조기노령연금은 만 60세부터 신청 가능하며, 조기 수령 시 월 수령액이 줄어듭니다.",
  },
  {
    q: "조기노령연금은 몇 살부터 가능한가요?",
    a: "1969년 이후 출생자 기준 만 60세부터 조기노령연금 신청이 가능합니다. 1년 빠를 때마다 약 6% 감액됩니다. 최대 5년 조기 시 약 30% 감액됩니다.",
  },
  {
    q: "연기연금은 얼마나 더 받게 되나요?",
    a: "연기연금은 연기 1개월당 0.6%, 연 7.2%가 가산됩니다. 5년 연기(70세 수령) 시 정상 수령액보다 최대 36% 늘어납니다. 장수할수록 유리합니다.",
  },
  {
    q: "국민연금 계산기 결과와 실제 수령액은 왜 다를 수 있나요?",
    a: "이 계산기는 국민연금공단 공식 조회를 대체하지 않는 간편 추정 도구입니다. 실제 연금액은 개인 가입이력, 연도별 재평가율, 지급 시점의 A값 등 다양한 요소로 달라집니다. 정확한 예상액은 국민연금공단 내연금 서비스(공단 공식 홈페이지)에서 확인하세요.",
  },
];
```

---

## 3. 계산 로직

### 3-1. 입력 → 중간값 계산

```js
// 가입 시작 나이 및 가입기간
function calcContribution(input) {
  const currentYear   = new Date().getFullYear();       // 2026
  const birthYear     = currentYear - input.currentAge;
  const startAge      = input.startYear - birthYear;    // 가입 시작 당시 나이
  const rawYears      = input.endAge - startAge;        // 총 가입 가능 연수
  const contributionYears = Math.max(0, rawYears - (input.contributionGapYears || 0));
  const contributionMonths = contributionYears * 12;

  return { startAge, contributionYears, contributionMonths };
}

// 본인 납입 보험료/월
function calcMonthlyPremium(input) {
  if (input.incomeMode === "premium") {
    return input.monthlyPremium;
  }
  const rate = NPC_RULES.premiumRate2026;
  if (input.subscriberType === "employee") {
    return input.monthlyIncome * rate / 2;  // 직장가입자: 절반
  } else {
    return input.monthlyIncome * rate;       // 지역가입자: 전액
  }
}

// 총 납입액 (본인부담)
function calcTotalContribution(monthlyPremium, contributionMonths) {
  return Math.round(monthlyPremium * contributionMonths);
}
```

### 3-2. 수령액 추정 모델 (`추정`)

> 국민연금공단 간단계산 구조 참고. 실제 산식(A값·재평가율 완전 반영)과 다를 수 있음.

```js
function estimateNormalPension(input, contributionYears) {
  const { incomeReplacementRate, baseContributionYears, aValue2026 } = NPC_RULES;

  // 간편 모델: 소득월액과 A값의 평균 기반 추정
  const effectiveIncome = (aValue2026 + input.monthlyIncome) / 2;
  const periodFactor    = Math.min(1, contributionYears / baseContributionYears);
  const base            = Math.round(effectiveIncome * incomeReplacementRate * periodFactor);
  return base;
}
```

| 예시 | 소득월액 300만원, 40년 가입 |
|---|---|
| effectiveIncome | (319.4 + 300) / 2 = 309.7만원 |
| periodFactor | 40/40 = 1.0 |
| 예상 월 수령액 | 309.7 × 0.43 × 1.0 ≈ **133만원** |

### 3-3. 수령 방식별 조정

```js
function calcPensionByClaimType(normalPension, input) {
  const { normalStartAge, earlyStartAge, deferBonusPerMonth, earlyDeductPerMonth } = NPC_RULES;

  // 지급개시연령 (1969년 이후 기준)
  const pensionAge = normalStartAge;

  // 조기수령
  const earlyMonths  = (pensionAge - earlyStartAge) * 12;   // 최대 60개월
  const earlyPension = Math.round(normalPension * (1 - earlyMonths * earlyDeductPerMonth));

  // 연기수령 (입력된 연기 연수 기준)
  const deferMonths   = (input.deferYears || 0) * 12;
  const deferPension  = Math.round(normalPension * (1 + deferMonths * deferBonusPerMonth));
  const deferStartAge = pensionAge + (input.deferYears || 0);

  return {
    early:  { startAge: earlyStartAge, monthlyPension: earlyPension },
    normal: { startAge: pensionAge,    monthlyPension: normalPension },
    defer:  { startAge: deferStartAge, monthlyPension: deferPension  },
  };
}
```

### 3-4. 손익분기점 (`추정`)

```js
function calcBreakeven(totalContribution, monthlyPension, pensionStartAge) {
  if (monthlyPension <= 0) return null;
  const monthsNeeded = totalContribution / monthlyPension;
  const breakevenAge = pensionStartAge + monthsNeeded / 12;
  return Math.round(breakevenAge * 10) / 10;
}
```

### 3-5. 실질가치 보정 (`추정`)

```js
function calcRealPension(nominalPension, yearsUntilPension, inflationRate) {
  // 현재 가치로 환산: pension / (1 + inflation)^years
  const factor = Math.pow(1 + inflationRate / 100, yearsUntilPension);
  return Math.round(nominalPension / factor);
}
```

### 3-6. 총 예상수령액 / 노후 부족분

```js
function calcTotalPayout(monthlyPension, pensionStartAge, lifeExpectancy) {
  const receiveYears = Math.max(0, lifeExpectancy - pensionStartAge);
  return Math.round(monthlyPension * receiveYears * 12);
}

function calcShortfall(monthlyPension, targetMonthlyExpense) {
  return Math.max(0, targetMonthlyExpense - monthlyPension);
}
```

### 3-7. 통합 계산 함수

```js
function calculate(input) {
  const { contributionYears, contributionMonths } = calcContribution(input);
  const monthlyPremium   = calcMonthlyPremium(input);
  const totalContrib     = calcTotalContribution(monthlyPremium, contributionMonths);
  const normalPension    = estimateNormalPension(input, contributionYears);
  const scenarios        = calcPensionByClaimType(normalPension, input);
  const pensionStartAge  = NPC_RULES.normalStartAge;
  const yearsUntilPension = Math.max(0, pensionStartAge - input.currentAge);

  const result = {
    contributionYears,
    contributionMonths,
    monthlyPremium,
    totalContrib,
    normalPension,
    realPension:    calcRealPension(normalPension, yearsUntilPension, input.inflationRate || 2.5),
    scenarios,
    breakeven: {
      early:  calcBreakeven(totalContrib, scenarios.early.monthlyPension,  scenarios.early.startAge),
      normal: calcBreakeven(totalContrib, scenarios.normal.monthlyPension, scenarios.normal.startAge),
      defer:  calcBreakeven(totalContrib, scenarios.defer.monthlyPension,  scenarios.defer.startAge),
    },
    totalPayout:    calcTotalPayout(normalPension, pensionStartAge, input.lifeExpectancy || 85),
    shortfall:      calcShortfall(normalPension, input.targetMonthlyExpense || 300),
    isEligible:     contributionYears >= NPC_RULES.minContributionYears,
  };
  return result;
}
```

---

## 4. 페이지 구조 (`national-pension-calculator.astro`)

### 4-1. 레이아웃 쉘

`SimpleToolShell.astro`

### 4-2. Hero

```astro
<CalculatorHero
  eyebrow="연금계산"
  title="국민연금 수령액 계산기 2026"
  description="가입 시작 연도, 소득월액, 수령 방식을 입력하면 예상 월 수령액과 손익분기점, 조기·연기수령 차이를 바로 비교합니다."
/>
<InfoNotice
  text="이 계산기는 간편 추정 도구로, 국민연금공단 공식 조회를 대체하지 않습니다. 실제 수령액은 가입이력·재평가율·지급 시점 A값 등에 따라 달라질 수 있습니다."
/>
```

### 4-3. 입력 패널 (aside)

#### SECTION A. 기본 입력

```html
<div class="panel">
  <div class="panel-heading">
    <p class="panel-heading__eyebrow">입력</p>
    <h2 class="panel__title">내 가입 조건 입력</h2>
  </div>

  <div class="form-grid">

    <!-- ① 현재 나이 -->
    <label class="field">
      <span>현재 나이 (만 나이)</span>
      <input type="number" id="npc-current-age" value="40" min="20" max="64" />
    </label>

    <!-- ② 가입 시작 연도 -->
    <label class="field">
      <span>국민연금 가입 시작 연도</span>
      <input type="number" id="npc-start-year" value="2010" min="1988" max="2026" />
    </label>

    <!-- ③ 소득월액 입력 모드 탭 -->
    <div class="npc-income-mode-tabs">
      <button class="npc-mode-tab is-active" data-mode="income">월 소득월액</button>
      <button class="npc-mode-tab" data-mode="premium">월 보험료 직접</button>
    </div>

    <!-- ④-a 월 소득월액 입력 -->
    <label class="field" id="npc-income-field">
      <span>소득월액 (만원)</span>
      <input type="number" id="npc-monthly-income" value="300" min="37" max="617" step="10" />
      <div class="npc-presets">
        <button class="npc-preset-btn" data-value="200">200</button>
        <button class="npc-preset-btn" data-value="300">300</button>
        <button class="npc-preset-btn" data-value="400">400</button>
        <button class="npc-preset-btn" data-value="500">500</button>
      </div>
    </label>

    <!-- ④-b 월 보험료 직접 입력 -->
    <label class="field" id="npc-premium-field" style="display:none">
      <span>본인 월 납입 보험료 (만원)</span>
      <input type="number" id="npc-monthly-premium" value="14" min="1" max="100" />
    </label>

    <!-- ⑤ 예상 납입 종료 나이 -->
    <label class="field">
      <span>예상 납입 종료 나이 <span id="npc-end-age-display">60세</span></span>
      <input type="range" id="npc-end-age" value="60" min="30" max="60" step="1" />
    </label>

    <!-- ⑥ 가입자 유형 -->
    <fieldset class="field npc-radio-group">
      <legend>가입자 유형</legend>
      <label><input type="radio" name="subscriberType" value="employee" checked> 직장가입자 (보험료 절반)</label>
      <label><input type="radio" name="subscriberType" value="regional"> 지역가입자 (보험료 전액)</label>
    </fieldset>

    <!-- ⑦ 기대수명 -->
    <label class="field">
      <span>기대수명 가정</span>
      <select id="npc-life-expectancy">
        <option value="80">80세</option>
        <option value="85" selected>85세</option>
        <option value="90">90세</option>
        <option value="95">95세</option>
      </select>
    </label>

    <!-- ⑧ 노후 목표 생활비 -->
    <label class="field">
      <span>목표 노후 월 생활비 (만원)</span>
      <input type="number" id="npc-target-expense" value="300" min="50" max="1000" step="10" />
    </label>

  </div>
</div>
```

#### SECTION B. 고급 입력 (접힌 상태)

```html
<div class="npc-advanced-wrap">
  <button class="npc-advanced-toggle" id="npc-advanced-toggle" aria-expanded="false">
    정밀 설정 ▼
  </button>
  <div class="npc-advanced-panel" id="npc-advanced-panel" hidden>
    <div class="form-grid">

      <label class="field">
        <span>납입 공백 연수 (실직·육아·휴직 등)</span>
        <input type="number" id="npc-gap-years" value="0" min="0" max="20" />
      </label>

      <label class="field">
        <span>물가상승률 가정 (%)</span>
        <input type="number" id="npc-inflation" value="2.5" min="0" max="10" step="0.5" />
      </label>

    </div>
  </div>
</div>
```

### 4-4. 결과 패널 (main)

#### 수령 방식 탭

```html
<div class="npc-claim-tabs" id="npc-claim-tabs">
  <button class="npc-claim-tab" data-claim="early">조기수령 <small>(60세)</small></button>
  <button class="npc-claim-tab is-active" data-claim="normal">정상수령 <small>(65세)</small></button>
  <button class="npc-claim-tab" data-claim="deferred">
    연기수령 <small id="npc-defer-age-label">(68세)</small>
  </button>
</div>
<!-- 연기 연수 설정 (연기수령 탭 선택 시 표시) -->
<div class="npc-defer-ctrl" id="npc-defer-ctrl" hidden>
  <label>연기 연수:
    <select id="npc-defer-years">
      <option value="1">1년 (66세)</option>
      <option value="2">2년 (67세)</option>
      <option value="3" selected>3년 (68세)</option>
      <option value="4">4년 (69세)</option>
      <option value="5">5년 (70세)</option>
    </select>
  </label>
</div>
```

#### 핵심 결과 카드 5개

```html
<!-- 가입기간 미달 경고 (10년 미만 시 표시) -->
<div class="npc-ineligible-notice" id="npc-ineligible-notice" hidden>
  <strong>⚠ 가입기간 10년 미만 추정</strong>
  <p>현재 조건으로는 노령연금 수급이 어려울 수 있습니다. 납입 종료 나이를 늘리거나 가입 시작 연도를 앞당겨 확인해보세요.</p>
</div>

<div class="npc-result-cards" id="npc-result-cards">

  <div class="npc-result-card npc-result-card--main">
    <p class="npc-result-label">예상 월 수령액 (명목)</p>
    <p class="npc-result-value npc-result-value--hl" id="npc-r-monthly">–</p>
    <p class="npc-result-note"><span class="npc-badge npc-badge--est">추정</span> <span id="npc-r-claim-label">정상수령(65세)</span> 기준</p>
  </div>

  <div class="npc-result-card">
    <p class="npc-result-label">예상 월 수령액 (실질가치)</p>
    <p class="npc-result-value" id="npc-r-real">–</p>
    <p class="npc-result-note"><span class="npc-badge npc-badge--est">추정</span> 물가 반영 현재 가치</p>
  </div>

  <div class="npc-result-card">
    <p class="npc-result-label">총 납입액 (본인부담)</p>
    <p class="npc-result-value" id="npc-r-total-contrib">–</p>
    <p class="npc-result-note"><span class="npc-badge npc-badge--est">추정</span> <span id="npc-r-contrib-years">–</span>년 기준</p>
  </div>

  <div class="npc-result-card npc-result-card--breakeven">
    <p class="npc-result-label">손익분기점 나이</p>
    <p class="npc-result-value" id="npc-r-breakeven">–</p>
    <p class="npc-result-note"><span class="npc-badge npc-badge--est">추정</span> 몇 세까지 받으면 원금 회수</p>
  </div>

  <div class="npc-result-card">
    <p class="npc-result-label">총 예상수령액</p>
    <p class="npc-result-value" id="npc-r-total-payout">–</p>
    <p class="npc-result-note"><span class="npc-badge npc-badge--est">추정</span> <span id="npc-r-life-label">–</span>세 기준</p>
  </div>

</div>
```

#### 차트 1 — 조기·정상·연기 월 수령액 비교 bar chart

```html
<div class="npc-chart-wrap">
  <h3 class="npc-chart-title">수령 방식별 월 수령액 비교 <span class="npc-badge npc-badge--est">추정</span></h3>
  <canvas id="npc-compare-chart" height="220"></canvas>
</div>
```

#### 차트 2 — 총 납입액 vs 총 예상수령액 더블 bar

```html
<div class="npc-chart-wrap">
  <h3 class="npc-chart-title">납입 총액 vs 예상수령 총액 <span class="npc-badge npc-badge--est">추정</span></h3>
  <canvas id="npc-flow-chart" height="200"></canvas>
</div>
```

#### 노후 부족분 안내

```html
<div class="npc-shortfall-box" id="npc-shortfall-box">
  <h3 class="npc-shortfall-title">노후 월 생활비 대비 부족분</h3>
  <div class="npc-shortfall-row">
    <span>목표 생활비</span>
    <strong id="npc-target-display">300만원/월</strong>
  </div>
  <div class="npc-shortfall-row">
    <span>국민연금 예상 수령액</span>
    <strong id="npc-pension-display">–</strong>
  </div>
  <div class="npc-shortfall-row npc-shortfall-row--gap">
    <span>부족분</span>
    <strong id="npc-shortfall-display" class="npc-shortfall-value">–</strong>
  </div>
  <p class="npc-shortfall-cta-text">IRP·연금저축으로 부족분을 채우는 전략이 필요합니다.</p>
</div>
```

#### 해석 가이드

```html
<ul class="npc-guide-list" id="npc-guide-list">
  <!-- JS로 조건에 따라 동적 생성 -->
</ul>
```

#### 주의 문구

```html
<div class="npc-disclaimer">
  <p>이 계산기는 국민연금공단 공식 조회를 대체하지 않는 간편 추정 도구입니다.</p>
  <p>실제 연금액은 개인 가입이력, 연도별 재평가율, 지급 시점 A값, 가입 공백, 크레딧 반영 여부에 따라 달라집니다.</p>
  <p>정확한 예상수령액은 <a href="https://www.nps.or.kr" target="_blank" rel="noopener noreferrer">국민연금공단 내연금 서비스</a>에서 확인하세요.</p>
</div>
```

#### FAQ

```html
<section class="npc-faq">
  <h2>국민연금 계산기 FAQ</h2>
  <!-- NPC_FAQ 5개 accordion -->
</section>
```

#### 관련 콘텐츠 CTA

```html
<section class="npc-cta">
  <a href="/reports/national-pension-generational-comparison-2026/" class="npc-cta-card">
    <p>국민연금 세대별 손익 비교 2026</p><span>→</span>
  </a>
  <a href="/tools/fire-calculator/" class="npc-cta-card">
    <p>FIRE 은퇴 계산기</p><span>→</span>
  </a>
  <a href="/tools/dca-investment-calculator/" class="npc-cta-card">
    <p>적립식 투자 수익 계산기</p><span>→</span>
  </a>
</section>
```

#### SeoContent

```astro
<SeoContent
  heading="국민연금 수령액 계산기 FAQ"
  faqs={NPC_FAQ}
/>
```

---

## 5. JS 인터랙션 (`national-pension-calculator.js`)

### 5-1. 상태 객체

```js
const state = {
  currentAge:          40,
  startYear:           2010,
  incomeMode:          "income",    // "income" | "premium"
  monthlyIncome:       300,
  monthlyPremium:      14,
  endAge:              60,
  subscriberType:      "employee",
  claimType:           "normal",
  deferYears:          3,
  lifeExpectancy:      85,
  targetMonthlyExpense: 300,
  inflationRate:       2.5,
  contributionGapYears: 0,
};
```

### 5-2. 계산 상수

```js
const NPC_RULES = {
  minContributionYears: 10,
  normalStartAge:       65,
  earlyStartAge:        60,
  deferBonusPerMonth:   0.006,
  earlyDeductPerMonth:  0.005,
  incomeReplacementRate: 0.43,
  premiumRate2026:      0.095,
  aValue2026:           319.4,
  baseContributionYears: 40,
};
```

### 5-3. 차트 — 조기·정상·연기 비교 bar

```js
let compareChart = null;

function initCompareChart() {
  const canvas = document.getElementById("npc-compare-chart");
  if (!canvas || typeof Chart === "undefined") return;
  canvas.height = 220;

  compareChart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: ["조기수령 (60세)", "정상수령 (65세)", "연기수령"],
      datasets: [{
        label: "월 수령액 추정 (만원)",
        data: [0, 0, 0],
        backgroundColor: [
          "rgba(229, 115, 115, 0.7)",
          "rgba(76, 175, 141, 0.7)",
          "rgba(74, 144, 217, 0.7)",
        ],
        borderRadius: 6,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` 약 ${ctx.parsed.y.toLocaleString("ko-KR")}만원/월 (추정)`,
          },
        },
      },
      scales: {
        y: {
          ticks: { callback: v => v + "만" },
          title: { display: true, text: "월 수령액 (만원, 추정)", font: { size: 11 } },
        },
      },
    },
  });
}

function updateCompareChart(result) {
  if (!compareChart) return;
  compareChart.data.datasets[0].data = [
    result.scenarios.early.monthlyPension,
    result.scenarios.normal.monthlyPension,
    result.scenarios.defer.monthlyPension,
  ];
  // 연기수령 레이블 업데이트
  compareChart.data.labels[2] = `연기수령 (${result.scenarios.defer.startAge}세)`;
  compareChart.update();
}
```

### 5-4. 차트 — 납입 vs 수령 더블 bar

```js
let flowChart = null;

function initFlowChart() {
  const canvas = document.getElementById("npc-flow-chart");
  if (!canvas || typeof Chart === "undefined") return;
  canvas.height = 200;

  flowChart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: ["본인 납입 총액", "총 예상수령액"],
      datasets: [{
        label: "금액 (만원, 추정)",
        data: [0, 0],
        backgroundColor: [
          "rgba(144, 164, 174, 0.7)",
          "rgba(76, 175, 141, 0.7)",
        ],
        borderRadius: 6,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.parsed.y.toLocaleString("ko-KR")}만원 (추정)`,
          },
        },
      },
      scales: {
        y: {
          ticks: { callback: v => v.toLocaleString("ko-KR") + "만" },
        },
      },
    },
  });
}

function updateFlowChart(result) {
  if (!flowChart) return;
  flowChart.data.datasets[0].data = [
    result.totalContrib,
    result.totalPayout,
  ];
  flowChart.update();
}
```

### 5-5. DOM 업데이트

```js
function fmt(v) { return v.toLocaleString("ko-KR") + "만원"; }

function updateUI(result) {
  // 가입기간 미달 경고
  const notice = document.getElementById("npc-ineligible-notice");
  if (notice) notice.hidden = result.isEligible;

  // 결과 카드
  const claimType    = state.claimType;
  const activePension = result.scenarios[claimType]?.monthlyPension ?? result.normalPension;

  setText("npc-r-monthly",       fmt(activePension));
  setText("npc-r-real",          fmt(result.realPension));
  setText("npc-r-total-contrib", fmt(result.totalContrib));
  setText("npc-r-contrib-years", result.contributionYears + "년");
  setText("npc-r-total-payout",  fmt(result.totalPayout));
  setText("npc-r-life-label",    state.lifeExpectancy + "세");
  setText("npc-r-claim-label",   claimTypeLabel(claimType, result));

  const be = result.breakeven[claimType];
  setText("npc-r-breakeven", be ? Math.round(be) + "세" : "–");

  // 노후 부족분
  setText("npc-target-display",  fmt(state.targetMonthlyExpense));
  setText("npc-pension-display", fmt(activePension));
  setText("npc-shortfall-display",
    result.shortfall > 0 ? fmt(result.shortfall) + "/월 부족" : "충족");

  // 차트 업데이트
  updateCompareChart(result);
  updateFlowChart(result);
  updateGuideList(result);
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
```

### 5-6. 해석 가이드 동적 생성

```js
function updateGuideList(result) {
  const el = document.getElementById("npc-guide-list");
  if (!el) return;

  const msgs = [];
  if (result.contributionYears < 20) {
    msgs.push("가입기간이 짧을수록 월 수령액이 크게 낮아질 수 있어요. 납입 종료 나이를 늘려보세요.");
  }
  if (result.scenarios.defer.monthlyPension > result.scenarios.normal.monthlyPension * 1.3) {
    msgs.push("연기수령은 늦게 받는 대신 월 수령액이 커져 장수 시 유리할 수 있어요.");
  }
  if (result.shortfall > 100) {
    msgs.push(`노후 부족분이 월 ${result.shortfall.toLocaleString()}만원으로 추정됩니다. IRP·연금저축 병행을 검토해보세요.`);
  }
  if (state.subscriberType === "regional") {
    msgs.push("지역가입자는 보험료 전액 본인 부담입니다. 직장가입자 대비 실질 납입 부담이 큽니다.");
  }

  el.innerHTML = msgs.map(m =>
    `<li class="npc-guide-item">💡 ${m}</li>`
  ).join("");
}
```

### 5-7. 이벤트 바인딩

```js
function bindEvents() {
  // 소득월액 / 보험료 직접 입력 탭
  document.querySelectorAll(".npc-mode-tab").forEach(tab => {
    tab.addEventListener("click", function () {
      document.querySelectorAll(".npc-mode-tab").forEach(t => t.classList.remove("is-active"));
      this.classList.add("is-active");
      state.incomeMode = this.dataset.mode;
      const incomeField   = document.getElementById("npc-income-field");
      const premiumField  = document.getElementById("npc-premium-field");
      if (incomeField)  incomeField.style.display  = (state.incomeMode === "income")   ? "" : "none";
      if (premiumField) premiumField.style.display = (state.incomeMode === "premium")  ? "" : "none";
      recalc();
    });
  });

  // 수령 방식 탭
  document.querySelectorAll(".npc-claim-tab").forEach(tab => {
    tab.addEventListener("click", function () {
      document.querySelectorAll(".npc-claim-tab").forEach(t => t.classList.remove("is-active"));
      this.classList.add("is-active");
      state.claimType = this.dataset.claim;
      const deferCtrl = document.getElementById("npc-defer-ctrl");
      if (deferCtrl) deferCtrl.hidden = state.claimType !== "deferred";
      recalc();
    });
  });

  // 슬라이더: 납입 종료 나이
  const endAgeInput = document.getElementById("npc-end-age");
  if (endAgeInput) {
    endAgeInput.addEventListener("input", function () {
      state.endAge = parseInt(this.value, 10);
      const disp = document.getElementById("npc-end-age-display");
      if (disp) disp.textContent = state.endAge + "세";
      recalc();
    });
  }

  // 연기 연수
  const deferYearsSelect = document.getElementById("npc-defer-years");
  if (deferYearsSelect) {
    deferYearsSelect.addEventListener("change", function () {
      state.deferYears = parseInt(this.value, 10);
      const label = document.getElementById("npc-defer-age-label");
      if (label) label.textContent = `(${NPC_RULES.normalStartAge + state.deferYears}세)`;
      recalc();
    });
  }

  // 숫자 입력 필드들
  const numFields = [
    { id: "npc-current-age",    key: "currentAge",          parse: parseInt  },
    { id: "npc-start-year",     key: "startYear",           parse: parseInt  },
    { id: "npc-monthly-income", key: "monthlyIncome",       parse: parseFloat },
    { id: "npc-monthly-premium",key: "monthlyPremium",      parse: parseFloat },
    { id: "npc-target-expense", key: "targetMonthlyExpense",parse: parseFloat },
    { id: "npc-inflation",      key: "inflationRate",       parse: parseFloat },
    { id: "npc-gap-years",      key: "contributionGapYears",parse: parseInt  },
  ];
  numFields.forEach(({ id, key, parse }) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", function () {
      const v = parse(this.value, 10);
      if (!isNaN(v)) { state[key] = v; recalc(); }
    });
  });

  // 기대수명 셀렉트
  const lifeEl = document.getElementById("npc-life-expectancy");
  if (lifeEl) lifeEl.addEventListener("change", function () {
    state.lifeExpectancy = parseInt(this.value, 10); recalc();
  });

  // 가입자 유형 라디오
  document.querySelectorAll('[name="subscriberType"]').forEach(r => {
    r.addEventListener("change", function () { state.subscriberType = this.value; recalc(); });
  });

  // 소득월액 프리셋 버튼
  document.querySelectorAll(".npc-preset-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      state.monthlyIncome = parseInt(this.dataset.value, 10);
      const input = document.getElementById("npc-monthly-income");
      if (input) input.value = state.monthlyIncome;
      recalc();
    });
  });

  // 고급 설정 토글
  document.getElementById("npc-advanced-toggle")?.addEventListener("click", function () {
    const panel    = document.getElementById("npc-advanced-panel");
    const expanded = this.getAttribute("aria-expanded") === "true";
    if (panel) panel.hidden = expanded;
    this.setAttribute("aria-expanded", !expanded);
    this.textContent = expanded ? "정밀 설정 ▼" : "정밀 설정 접기 ▲";
  });
}
```

### 5-8. URL 파라미터 동기화

```js
function syncUrlParams() {
  const p = new URLSearchParams({
    age:  state.currentAge,
    sy:   state.startYear,
    mode: state.incomeMode,
    inc:  state.monthlyIncome,
    prm:  state.monthlyPremium,
    ea:   state.endAge,
    sub:  state.subscriberType,
    ct:   state.claimType,
    dy:   state.deferYears,
    le:   state.lifeExpectancy,
    te:   state.targetMonthlyExpense,
    inf:  state.inflationRate,
    gap:  state.contributionGapYears,
  });
  history.replaceState(null, "", "?" + p.toString());
}

function restoreFromUrl() {
  const p = new URLSearchParams(location.search);
  const map = [
    ["age","currentAge",parseInt],["sy","startYear",parseInt],
    ["mode","incomeMode",String],["inc","monthlyIncome",parseFloat],
    ["prm","monthlyPremium",parseFloat],["ea","endAge",parseInt],
    ["sub","subscriberType",String],["ct","claimType",String],
    ["dy","deferYears",parseInt],["le","lifeExpectancy",parseInt],
    ["te","targetMonthlyExpense",parseFloat],["inf","inflationRate",parseFloat],
    ["gap","contributionGapYears",parseInt],
  ];
  map.forEach(([param, key, parse]) => {
    if (p.get(param) !== null) state[key] = parse(p.get(param), 10);
  });
}
```

### 5-9. 초기화

```js
document.addEventListener("DOMContentLoaded", function () {
  restoreFromUrl();
  syncFormToState();  // 라디오·셀렉트·입력 DOM을 state 값으로 설정
  bindEvents();
  initFaq();

  if (typeof Chart !== "undefined") {
    initCompareChart();
    initFlowChart();
    recalc();
  } else {
    const s = document.querySelector('script[src*="chart.js"]');
    if (s) s.addEventListener("load", function () {
      initCompareChart();
      initFlowChart();
      recalc();
    });
  }
});

function recalc() {
  const result = calculate(state);
  updateUI(result);
  syncUrlParams();
}
```

---

## 6. SCSS 설계 (`_national-pension-calculator.scss`)

### 6-1. prefix: `npc-`

> 리포트 `np-`와 구분 필수

### 6-2. CSS 변수

```scss
.npc-page {
  --npc-color-early:  #e57373;
  --npc-color-normal: #4caf8d;
  --npc-color-defer:  #4a90d9;
}
```

### 6-3. 주요 컴포넌트

```scss
// 결과 카드 그리드
.npc-result-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
  @media (min-width: 640px) { grid-template-columns: repeat(3, 1fr); }
}

.npc-result-card {
  background: var(--color-surface);
  border-radius: 12px;
  padding: 1.25rem 1rem;
  border: 1px solid var(--color-border);
  text-align: center;

  &--main,
  &--breakeven { border-color: var(--color-primary); }
}

.npc-result-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.2;

  &--hl { font-size: 1.75rem; color: var(--color-primary); }
}

.npc-result-label { font-size: 0.8rem; color: var(--color-text-secondary); margin-bottom: 0.25rem; }
.npc-result-note  { font-size: 0.75rem; color: var(--color-text-secondary); margin-top: 0.25rem; }

// 배지
.npc-badge {
  display: inline-block;
  padding: 0.15em 0.55em;
  border-radius: 4px;
  font-size: 0.72rem;
  font-weight: 600;
  &--est      { background: #e3f2fd; color: #1565c0; }   // 추정
  &--official { background: #e8f5e9; color: #388e3c; }   // 공식
}

// 수령 방식 탭
.npc-claim-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.npc-claim-tab {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 2px solid var(--color-border);
  background: transparent;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  transition: all 0.15s;

  &[data-claim="early"].is-active   { border-color: var(--npc-color-early);  background: var(--npc-color-early);  color: #fff; }
  &[data-claim="normal"].is-active  { border-color: var(--npc-color-normal); background: var(--npc-color-normal); color: #fff; }
  &[data-claim="deferred"].is-active{ border-color: var(--npc-color-defer);  background: var(--npc-color-defer);  color: #fff; }

  small { display: block; font-size: 0.75rem; opacity: 0.85; }
}

// 연기 연수 설정
.npc-defer-ctrl {
  margin-bottom: 0.75rem;
  font-size: 0.875rem;

  select { margin-left: 0.5rem; }
}

// 차트 래퍼
.npc-chart-wrap {
  width: 100%;
  min-height: 200px;
  position: relative;
  margin: 1.5rem 0;
  canvas { width: 100% !important; }
}

.npc-chart-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

// 소득월액 프리셋 버튼
.npc-presets {
  display: flex;
  gap: 0.375rem;
  margin-top: 0.375rem;
  flex-wrap: wrap;
}

.npc-preset-btn {
  padding: 0.25rem 0.625rem;
  border-radius: 14px;
  border: 1px solid var(--color-border);
  background: transparent;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.12s;

  &:hover { background: var(--color-surface-alt); }
}

// 소득월액/보험료 입력 모드 탭
.npc-income-mode-tabs {
  display: flex;
  gap: 0;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.npc-mode-tab {
  flex: 1;
  padding: 0.45rem 0.5rem;
  background: transparent;
  border: none;
  font-size: 0.825rem;
  cursor: pointer;
  transition: background 0.12s;

  &.is-active {
    background: var(--color-primary);
    color: #fff;
    font-weight: 600;
  }
}

// 노후 부족분 박스
.npc-shortfall-box {
  padding: 1.25rem;
  background: var(--color-surface);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  margin: 1.5rem 0;
}

.npc-shortfall-title {
  font-size: 0.95rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.npc-shortfall-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.375rem 0;
  border-top: 1px solid var(--color-border);
  font-size: 0.9rem;

  &--gap strong { color: var(--color-primary); font-size: 1.1rem; }
}

.npc-shortfall-cta-text {
  font-size: 0.825rem;
  color: var(--color-text-secondary);
  margin-top: 0.625rem;
}

// 가입기간 미달 경고
.npc-ineligible-notice {
  padding: 0.875rem 1rem;
  background: #fff3e0;
  border-left: 4px solid #f5a623;
  border-radius: 0 8px 8px 0;
  margin-bottom: 1rem;
  font-size: 0.875rem;

  strong { display: block; margin-bottom: 0.25rem; }
}

// 해석 가이드 리스트
.npc-guide-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.npc-guide-item {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  padding: 0.5rem 0.75rem;
  background: var(--color-surface);
  border-left: 3px solid var(--color-primary);
  border-radius: 0 6px 6px 0;
}

// 라디오 그룹
.npc-radio-group {
  border: none; padding: 0; margin: 0;
  legend { font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem; }
  label  { display: inline-flex; align-items: center; gap: 0.375rem; margin-right: 1rem; font-size: 0.9rem; cursor: pointer; }
}

// 주의 문구
.npc-disclaimer {
  padding: 1rem 1.25rem;
  background: var(--color-surface);
  border-radius: 8px;
  border: 1px solid var(--color-border);
  font-size: 0.825rem;
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin: 1.5rem 0;
  p + p { margin-top: 0.375rem; }
}

// FAQ
.npc-faq-item { border-bottom: 1px solid var(--color-border); }
.npc-faq-q {
  width: 100%; text-align: left; padding: 0.875rem 0;
  font-weight: 600; font-size: 0.95rem;
  background: none; border: none; cursor: pointer;
  display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;
}
.npc-faq-a {
  padding: 0 0 1rem;
  font-size: 0.9rem; color: var(--color-text-secondary); line-height: 1.7;
}

// CTA 카드
.npc-cta {
  display: flex; flex-direction: column; gap: 0.5rem; margin: 2rem 0;
  @media (min-width: 640px) { flex-direction: row; }
}
.npc-cta-card {
  display: flex; justify-content: space-between; align-items: center;
  padding: 1rem 1.25rem;
  border: 1px solid var(--color-border); border-radius: 10px;
  text-decoration: none; color: var(--color-text);
  font-size: 0.9rem; font-weight: 600; flex: 1;
  transition: border-color 0.15s;
  &:hover { border-color: var(--color-primary); }
}

// 고급 설정 토글
.npc-advanced-toggle {
  width: 100%; text-align: left;
  background: none; border: 1px solid var(--color-border);
  border-radius: 6px; padding: 0.5rem 1rem;
  font-size: 0.875rem; cursor: pointer; margin-top: 0.75rem;
}
.npc-advanced-panel { padding-top: 0.75rem; }
```

---

## 7. 등록 작업

### `src/data/tools.ts`

```ts
{
  slug: "national-pension-calculator",
  title: "국민연금 수령액 계산기",
  description: "가입 시작 연도, 소득월액, 수령 방식(조기·정상·연기)을 입력하면 예상 월 수령액과 손익분기점을 계산합니다.",
  order: 23,
  eyebrow: "연금계산",
  category: "calculator",
  iframeReady: false,
  badges: ["국민연금", "연금", "노후", "2026"],
  previewStats: [
    { label: "연기수령 가산",  value: "+0.6%/월", context: "공식 기준" },
    { label: "최소 가입기간", value: "10년",      context: "노령연금 수급 조건" },
  ],
},
```

### `src/pages/index.astro` — `topicBySlug`

```ts
"national-pension-calculator": "투자·재테크",
```

### `src/styles/app.scss`

```scss
@use 'scss/pages/national-pension-calculator';
```

### `public/sitemap.xml`

```xml
<url>
  <loc>https://bigyocalc.com/tools/national-pension-calculator/</loc>
  <changefreq>yearly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## 8. SEO 설계

```
title: "국민연금 수령액 계산기 2026 | 조기·정상·연기수령 예상액 비교 | 비교계산소"
description: "현재 나이, 가입 시작 연도, 소득월액, 납입 종료 나이를 입력하면 국민연금 예상 월 수령액, 총 납입액, 손익분기점 나이, 조기·연기수령 차이를 계산해드립니다."
```

---

## 9. QA 체크리스트

### 계산 로직

- [ ] 가입기간 10년 미만 시 수급 불가 경고 표시
- [ ] 직장가입자 보험료 = 소득 × 9.5% ÷ 2
- [ ] 지역가입자 보험료 = 소득 × 9.5% 전액
- [ ] 조기수령 감액: -0.5%/월 (최대 60개월 = -30%)
- [ ] 연기수령 가산: +0.6%/월 (최대 60개월 = +36%)
- [ ] 손익분기점 = 총납입 ÷ 월수령 → 나이로 환산
- [ ] 총 예상수령액 = 월수령 × (기대수명 - 수급 시작 나이) × 12
- [ ] 실질가치 = 명목 수령액 ÷ (1 + 물가상승률)^(수급 시작까지 연수)
- [ ] 노후 부족분 = max(0, 목표생활비 - 월수령액)

### UI

- [ ] 소득월액 / 보험료 직접 탭 전환 → 해당 입력 필드 표시/숨김
- [ ] 연기수령 탭 선택 시 연기 연수 셀렉트 표시
- [ ] 제왕절개 기준... 아님, 납입 종료 나이 슬라이더 display 연동
- [ ] 수령 방식 탭 활성화에 따른 결과 카드 수치 변경
- [ ] 가입기간 미달 경고 조건부 표시
- [ ] 고급 설정 아코디언 작동
- [ ] FAQ accordion 작동

### 차트

- [ ] 조기/정상/연기 비교 bar chart 실시간 업데이트
- [ ] 납입 vs 수령 더블 bar chart 실시간 업데이트
- [ ] `maintainAspectRatio: false` + `canvas.height` 명시

### URL 파라미터

- [ ] 모든 state 항목 직렬화 → 복원 후 DOM 초기화

### 등록

- [ ] `src/data/tools.ts` order: 23 추가
- [ ] `src/pages/index.astro` `topicBySlug` 추가 ("투자·재테크")
- [ ] `src/styles/app.scss` import 추가
- [ ] `public/sitemap.xml` URL 추가
- [ ] `npm run build` 에러 없음
- [ ] 메인 페이지 "투자·재테크" 필터에서 노출
# 플레이북 타입 재지정 메모
#
# - 최종 타입: Type A. Simple Calculator
# - 기준 문서: docs/design/202604/calculator-playbook-design.md
# - 재지정 이유:
#   - 이 계산기는 공식 조회 대체가 아니라 빠르게 예상 수령액과 수급 시나리오 감을 잡게 하는 도구다.
#   - 사용자는 복잡한 시뮬레이션보다 핵심 수령액, 수급 시점, 부족분을 먼저 확인하고 싶어한다.
#   - 따라서 설계와 구현 모두 단순 결과 중심 계산기 구조를 우선한다.
# - 적용 규칙:
#   - KPI는 핵심 수령액 중심 4~6개로 제한한다.
#   - 차트는 꼭 필요한 경우에만 쓰고, 상세 계산표는 1개를 기본으로 둔다.
#   - 하단은 이어보기, 외부 참고 링크를 고정 섹션으로 둔다.
