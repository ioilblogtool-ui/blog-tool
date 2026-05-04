# 중도상환 수수료 계산기 — 설계 문서

> 기획 원문: 없음 (설계 문서 선작성)
> 작성일: 2026-04-27
> 구현 기준: Claude/Codex가 이 문서만 보고 바로 `/tools/` 계산기를 구현할 수 있는 수준으로 고정
> 참고 계산기: `jeonwolse-conversion`, `home-purchase-fund`, `coin-tax-calculator`
> 계산기 유형: **Type A. Simple Calculator** (단순 결과 중심 + 유불리 해석)

---

## 1. 문서 개요

### 1-1. 대상

- 구현 대상: `중도상환 수수료 계산기`
- 권장 slug: `mortgage-prepayment-penalty`
- 권장 URL: `/tools/mortgage-prepayment-penalty/`
- 콘텐츠 유형: 계산기 (`/tools/`)
- 카테고리: 부동산·집 마련

### 1-2. 페이지 성격

- 핵심 질문: **"지금 갚으면 수수료가 얼마이고, 갚는 게 유리한가?"**
- 중도상환 수수료 금액 → 잔여 이자 절감액 → 순 절약 금액 → 유불리 판단 흐름으로 이어지는 도구
- 완전 상환(일시 상환)과 부분 상환을 모두 처리한다.
- 2026 기준 맥락: 은행권 주담대는 2025년 하반기부터 수수료 폐지·인하 흐름이 있지만, 기존 약정 대출은 약정 수수료율이 적용된다. 보험사·저축은행·카드사 대출은 별도 확인이 필요하다. 이 맥락을 InfoNotice에 명확히 고지한다.
- 결과는 항상 **"참고용 추정값"** 으로 표기하고, 실제 수수료는 대출 기관 확인을 안내한다.

### 1-3. 이 문서의 역할

- 데이터 스키마, 입력 UX, 계산 로직, 결과 카드, FAQ, SCSS prefix, 등록 체크를 고정
- 이후 구현은 이 문서를 기준으로 `src/data/`, `src/pages/tools/`, `public/scripts/`, `src/styles/`, `src/data/tools.ts`에 반영

---

## 2. 권장 파일 구조

```text
src/
  data/
    mortgagePrepaymentPenalty.ts
  pages/
    tools/
      mortgage-prepayment-penalty.astro

public/
  scripts/
    mortgage-prepayment-penalty.js
  og/
    tools/
      mortgage-prepayment-penalty.png

src/styles/scss/pages/
  _mortgage-prepayment-penalty.scss
```

### 2-1. 추가 반영 파일

- `src/data/tools.ts`
- `src/pages/tools/index.astro` (topicBySlug)
- `src/pages/index.astro` (topicBySlug)
- `src/styles/app.scss`
- `public/sitemap.xml`

---

## 3. 구현 범위

### 3-1. MVP 포함

- 대출 유형 선택 (주담대 / 전세대출 / 신용대출 / 직접 입력)
- 잔여 원금·수수료율·대출 약정 기간·잔여 기간 입력
- 중도상환 수수료 계산
- 잔여 이자 절감액 계산 (단순 근사)
- 순 절약 금액 = 절감 이자 - 수수료
- 유불리 판단 배지 (유리 / 불리 / 소폭 유리)
- 부분 상환 vs 전액 상환 전환 탭
- 시나리오 프리셋 3개
- FAQ 5개
- URL 공유 / 초기화

### 3-2. MVP 제외

- 월 상환액 재계산 (부분 상환 후 잔여 스케줄)
- 대환대출 시나리오 비교 (별도 계산기로 분리)
- 은행별 실시간 수수료율 조회
- 원리금 균등 / 원금 균등 / 만기일시 상환 방식별 정밀 이자 계산

### 3-3. v2 확장 여지

- 대환대출 비교: 새 금리와 이전 비용을 합산한 갈아타기 손익
- 부분 상환 후 월 상환액 재계산
- 기간별 최적 상환 시점 추천

---

## 4. 페이지 목표

- 사용자가 "지금 중도상환하면 얼마 드나요?"를 5초 안에 확인할 수 있다.
- 수수료만 보여주는 게 아니라 절감 이자와 순 절약 금액까지 보여줘서 **실제 유불리 판단**을 돕는다.
- 2026 기준 은행 주담대 수수료 폐지 흐름을 InfoNotice로 알려, 자기 대출 조건을 먼저 확인하도록 유도한다.
- 결과는 항상 "참고용 추정값"임을 명시하고, 최종 판단은 금융기관 확인을 안내한다.

---

## 5. 데이터 설계 (`src/data/mortgagePrepaymentPenalty.ts`)

### 5-1. 타입 정의

```ts
export type LoanType = "mortgage" | "jeonse" | "credit" | "custom";

export interface LoanTypePreset {
  id: LoanType;
  label: string;
  defaultPenaltyRate: number;   // 수수료율 기본값 (소수)
  defaultLoanTermMonths: number; // 약정 기간 기본값 (개월)
  defaultRatePercent: number;    // 기본 대출 금리 (%)
  note: string;
}

export interface ScenarioPreset {
  id: string;
  label: string;
  summary: string;
  values: {
    loanType: LoanType;
    remainingPrincipal: number;
    penaltyRate: number;
    loanTermMonths: number;
    remainingMonths: number;
    annualRatePercent: number;
    prepaymentAmount: "full" | number;
  };
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

### 5-2. 대출 유형 프리셋

```ts
export const MPC_LOAN_TYPE_PRESETS: LoanTypePreset[] = [
  {
    id: "mortgage",
    label: "주택담보대출",
    defaultPenaltyRate: 0.014,       // 1.4% (기존 약정 기준 참고값)
    defaultLoanTermMonths: 360,       // 30년
    defaultRatePercent: 4.2,
    note: "2025년 하반기 이후 신규 은행 주담대는 수수료율이 인하·폐지되는 경우가 있습니다. 실제 약정서를 확인하세요.",
  },
  {
    id: "jeonse",
    label: "전세대출",
    defaultPenaltyRate: 0.012,       // 1.2%
    defaultLoanTermMonths: 24,        // 2년
    defaultRatePercent: 3.8,
    note: "전세대출은 만기 전 1개월 이내 상환 시 수수료가 면제되는 경우가 많습니다. 약정 조건을 먼저 확인하세요.",
  },
  {
    id: "credit",
    label: "신용대출",
    defaultPenaltyRate: 0.007,       // 0.7%
    defaultLoanTermMonths: 12,        // 1년
    defaultRatePercent: 5.5,
    note: "신용대출 중도상환 수수료율은 은행별, 상품별로 0.5%~1.0% 수준이며 1년 이상 경과 시 면제되는 경우도 있습니다.",
  },
  {
    id: "custom",
    label: "직접 입력",
    defaultPenaltyRate: 0.014,
    defaultLoanTermMonths: 120,
    defaultRatePercent: 4.0,
    note: "대출 약정서의 중도상환 수수료율과 기간을 직접 입력합니다.",
  },
];
```

### 5-3. 기본 입력값

```ts
export const MPC_DEFAULT_INPUT = {
  loanType: "mortgage" as LoanType,
  remainingPrincipal: 300_000_000,   // 3억원
  penaltyRate: 0.014,                // 1.4%
  loanTermMonths: 360,               // 30년
  remainingMonths: 24,               // 잔여 24개월
  annualRatePercent: 4.2,            // 연 4.2%
  prepaymentMode: "full" as "full" | "partial",
  partialAmount: 100_000_000,        // 부분상환 시 1억원
};
```

### 5-4. 시나리오 프리셋

```ts
export const MPC_SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: "mortgage-early",
    label: "주담대 2년 내 조기상환",
    summary: "3억 주담대 · 잔여 24개월",
    values: {
      loanType: "mortgage",
      remainingPrincipal: 300_000_000,
      penaltyRate: 0.014,
      loanTermMonths: 360,
      remainingMonths: 24,
      annualRatePercent: 4.2,
      prepaymentAmount: "full",
    },
  },
  {
    id: "jeonse-expiry",
    label: "전세대출 만기 6개월 전",
    summary: "2억 전세대출 · 잔여 6개월",
    values: {
      loanType: "jeonse",
      remainingPrincipal: 200_000_000,
      penaltyRate: 0.012,
      loanTermMonths: 24,
      remainingMonths: 6,
      annualRatePercent: 3.8,
      prepaymentAmount: "full",
    },
  },
  {
    id: "credit-partial",
    label: "신용대출 부분 상환",
    summary: "5천만 신용대출 · 1천만 부분상환",
    values: {
      loanType: "credit",
      remainingPrincipal: 50_000_000,
      penaltyRate: 0.007,
      loanTermMonths: 12,
      remainingMonths: 8,
      annualRatePercent: 5.5,
      prepaymentAmount: 10_000_000,
    },
  },
];
```

### 5-5. FAQ

```ts
export const MPC_FAQ: FaqItem[] = [
  {
    question: "중도상환 수수료 공식은 어떻게 되나요?",
    answer:
      "대부분의 금융기관은 '중도상환 원금 × 수수료율 × (잔여 기간 일수 / 약정 기간 일수)' 공식을 사용합니다. 잔여 기간이 짧을수록 수수료가 줄어들고, 약정 기간이 끝나면 수수료 없이 상환할 수 있습니다. 실제 계산 방식은 금융기관마다 다를 수 있으므로 약정서를 먼저 확인하세요.",
  },
  {
    question: "2026년에 주담대 중도상환 수수료가 폐지됐나요?",
    answer:
      "2025년 하반기부터 일부 은행의 신규 주택담보대출에 대해 중도상환 수수료가 폐지되거나 대폭 인하됐습니다. 그러나 2025년 이전에 약정한 기존 대출은 기존 약정 수수료율이 적용될 수 있습니다. 보험사·저축은행·카드사 대출은 별도 기준이 적용되므로 반드시 해당 금융기관에 확인하세요.",
  },
  {
    question: "잔여 이자 절감액은 어떻게 계산하나요?",
    answer:
      "이 계산기는 '잔여 원금 × 연이율 × (잔여 개월/12)' 방식으로 간단히 추정합니다. 실제로는 원리금 균등 방식에서 잔여 이자는 이보다 적고, 원금 균등 방식은 별도 스케줄이 필요합니다. 간편 추정값이므로 정확한 이자 절감액은 금융기관 상담을 통해 확인하는 것을 권장합니다.",
  },
  {
    question: "중도상환이 항상 유리한가요?",
    answer:
      "수수료보다 절감 이자가 크면 유리하지만, 만기가 얼마 남지 않은 시점에는 절감 이자가 적어 수수료가 더 클 수 있습니다. 또한 현금을 다른 투자에 활용하거나 비상금으로 보유해야 하는 상황이라면 단순 수수료 비교만으로 결정하는 것은 위험합니다. 유동성과 기회비용까지 고려하세요.",
  },
  {
    question: "전세대출은 만기 전에 갚으면 수수료가 면제되나요?",
    answer:
      "일부 금융기관은 만기일 1개월 전후 기간에 수수료를 면제하는 조건을 제공합니다. 하지만 모든 상품에 해당하지 않으므로 약정서의 '중도상환 수수료 면제 조건'을 직접 확인해야 합니다.",
  },
];
```

### 5-6. 관련 링크

```ts
export const MPC_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/home-purchase-fund/",    label: "내집마련 자금 계산기" },
  { href: "/tools/jeonwolse-conversion/",  label: "전월세 전환율 계산기" },
  { href: "/reports/seoul-housing-2016-vs-2026/", label: "서울 집값 10년 비교 리포트" },
  { href: "/tools/dca-investment-calculator/",    label: "적립식 투자 수익 계산기" },
];
```

### 5-7. 2026 주의 안내 포인트

```ts
export const MPC_INFO_LINES = [
  "이 계산기는 공개 자료 기준 참고용입니다. 실제 수수료는 약정서와 금융기관 확인이 필수입니다.",
  "2025년 하반기부터 일부 은행 신규 주담대는 수수료 폐지·인하 적용. 기존 약정 대출은 기존 조건이 적용됩니다.",
  "절감 이자는 단순 근사값이므로 원리금 균등 / 원금 균등 방식에 따라 실제값과 차이가 날 수 있습니다.",
];
```

---

## 6. 계산 로직

### 6-1. 변수 정의

```js
remainingPrincipal   // 잔여(중도상환) 원금 (원)
prepaymentAmount     // 실제 상환할 금액 (원, 전액=remainingPrincipal)
penaltyRate          // 중도상환 수수료율 (소수, 예: 0.014 = 1.4%)
loanTermMonths       // 대출 약정 총 기간 (개월)
remainingMonths      // 잔여 기간 (개월)
annualRatePercent    // 연 금리 (%)
```

### 6-2. 중도상환 수수료

```js
// 잔여 기간 비율 (일수 대신 개월로 단순화)
const remainingRatio = remainingMonths / loanTermMonths;

// 중도상환 수수료
const prepaymentPenalty = prepaymentAmount * penaltyRate * remainingRatio;
```

> **설계 이유:** 대부분의 한국 금융기관은 잔여 기간 비율 방식을 사용한다. 일수보다 개월 단위가 사용자 친화적이며, 실제 차이는 무시할 수준이다.

### 6-3. 잔여 이자 절감액 (단순 근사)

완전 상환의 경우:
```js
const monthlyRate = annualRatePercent / 100 / 12;

// 단순 근사: 잔여 원금에 잔여 기간 이자를 적용
// (원리금 균등 기준 실제 잔여 이자보다 보수적으로 높게 나옴 → 참고값 표시)
const estimatedInterestSavings = prepaymentAmount * monthlyRate * remainingMonths;
```

부분 상환의 경우:
```js
// 상환 원금에 대한 잔여 이자만 절감
const estimatedInterestSavings = prepaymentAmount * monthlyRate * remainingMonths;
```

### 6-4. 순 절약 금액 및 유불리

```js
const netSavings = estimatedInterestSavings - prepaymentPenalty;

// 유불리 판단
let verdict;
if (netSavings > 0) {
  if (netSavings / estimatedInterestSavings > 0.2) {
    verdict = "유리";       // 절감액 대비 20% 이상 이득
  } else {
    verdict = "소폭 유리";  // 이득이지만 미미
  }
} else {
  verdict = "불리";
}

// 수수료 회수 기간 (몇 개월 지나야 수수료를 이자 절감으로 회수하나)
const breakEvenMonths = monthlyRate > 0
  ? prepaymentPenalty / (prepaymentAmount * monthlyRate)
  : 0;
```

### 6-5. 수수료율 면제 기준 (안내용)

만기 잔여 3개월 이내이거나 수수료 면제 조건 해당 여부는 계산기에서 직접 판단하지 않고, InfoNotice로 안내에 그친다.

### 6-6. 엣지 케이스

- `remainingMonths <= 0`: "잔여 기간이 없거나 만기가 지났습니다" 안내
- `prepaymentAmount > remainingPrincipal`: 최대 잔여 원금으로 클램프
- `penaltyRate <= 0`: 수수료 0원 처리, "수수료 없는 상환" 메시지

---

## 7. 페이지 구조 (`src/pages/tools/mortgage-prepayment-penalty.astro`)

### 7-1. 기본 구성

- `BaseLayout`
- `SiteHeader`
- `CalculatorHero`
- `InfoNotice`
- `ToolActionBar`
- `SimpleToolShell`
- `SeoContent`

### 7-2. 권장 설정

- `calculatorId="mortgage-prepayment-penalty"`
- `pageClass="mpc-page"`
- `resultFirst={true}`

### 7-3. 섹션 순서

#### [A] Hero

```astro
<CalculatorHero
  eyebrow="대출 계산기"
  title="지금 중도상환하면 수수료 얼마? 갚는 게 유리한지까지 계산합니다"
  description="잔여 원금, 수수료율, 잔여 기간, 금리를 입력하면 수수료 금액과 이자 절감액을 비교해 중도상환 유불리를 바로 확인합니다."
/>
```

#### [B] InfoNotice

```astro
<InfoNotice
  lines={MPC_INFO_LINES}
/>
```

#### [C] 입력 패널 (aside)

##### 블록 1. 대출 유형 탭

```html
<div class="mpc-loan-tabs" id="mpcLoanTabs">
  <!-- MPC_LOAN_TYPE_PRESETS 기반 탭 4개 -->
</div>
<p class="mpc-loan-note" id="mpcLoanNote">...</p>
```

##### 블록 2. 상환 방식 탭

```html
<div class="mpc-mode-tabs" id="mpcModeTabs">
  <button class="mpc-mode-tab is-active" data-mode="full">전액 상환</button>
  <button class="mpc-mode-tab" data-mode="partial">부분 상환</button>
</div>
```

##### 블록 3. 기본 입력 (form-grid)

| 필드 | id | 기본값 | 타입 |
|------|----|--------|------|
| 잔여 원금 (원) | `mpcRemainingPrincipal` | 300,000,000 | text/numeric |
| 부분 상환 금액 (원) | `mpcPartialAmount` | 100,000,000 | text/numeric (partial 모드만) |
| 중도상환 수수료율 (%) | `mpcPenaltyRate` | 1.400 | number |
| 대출 약정 기간 (개월) | `mpcLoanTermMonths` | 360 | number |
| 잔여 기간 (개월) | `mpcRemainingMonths` | 24 | number |
| 현재 대출 금리 (%) | `mpcAnnualRate` | 4.200 | number |

##### 블록 4. 시나리오 프리셋 버튼

```html
<div class="mpc-presets" id="mpcPresets">
  <!-- MPC_SCENARIO_PRESETS 기반 3개 버튼 -->
</div>
```

##### 블록 5. 액션

```html
<ToolActionBar resetId="mpcResetBtn" copyId="mpcCopyLinkBtn" />
```

#### [D] 결과 KPI 카드 (main)

```html
<div class="mpc-kpi-grid">
  <!-- 카드 1: 중도상환 수수료 (가장 크게) -->
  <div class="mpc-kpi-card mpc-kpi-card--main">
    <p>중도상환 수수료</p>
    <strong id="mpcPenaltyAmount">-</strong>
    <span>잔여원금 × 수수료율 × 잔여비율</span>
  </div>

  <!-- 카드 2: 잔여 이자 절감액 -->
  <div class="mpc-kpi-card">
    <p>예상 이자 절감액</p>
    <strong id="mpcInterestSavings">-</strong>
    <span class="mpc-kpi-note">단순 근사값</span>
  </div>

  <!-- 카드 3: 순 절약 금액 -->
  <div class="mpc-kpi-card">
    <p>순 절약 금액</p>
    <strong id="mpcNetSavings">-</strong>
    <span>절감 이자 - 수수료</span>
  </div>

  <!-- 카드 4: 수수료 회수 기간 -->
  <div class="mpc-kpi-card">
    <p>수수료 회수 기간</p>
    <strong id="mpcBreakEvenMonths">-</strong>
    <span>수수료 ÷ 월 절감 이자</span>
  </div>
</div>
```

#### [E] 유불리 판정 배지 박스

```html
<div class="mpc-verdict-box" id="mpcVerdictBox">
  <span class="mpc-verdict-badge" id="mpcVerdictBadge">-</span>
  <p id="mpcVerdictCopy">조건을 입력하면 유불리 해석이 표시됩니다.</p>
</div>
```

#### [F] 상세 계산표

```html
<table class="mpc-breakdown-table">
  <tbody>
    <tr><td>상환 원금</td><td id="mpcDPrepaymentAmount">-</td></tr>
    <tr><td>중도상환 수수료율</td><td id="mpcDPenaltyRate">-</td></tr>
    <tr><td>잔여 기간 비율</td><td id="mpcDRemainingRatio">-</td></tr>
    <tr><td>중도상환 수수료</td><td id="mpcDPenalty">-</td></tr>
    <tr class="mpc-separator"><td colspan="2">이자 절감 추정</td></tr>
    <tr><td>월 이자 기준</td><td id="mpcDMonthlyInterest">-</td></tr>
    <tr><td>잔여 기간</td><td id="mpcDRemainingMonths">-</td></tr>
    <tr><td>예상 이자 절감액</td><td id="mpcDInterestSavings">-</td></tr>
    <tr><td>순 절약 금액</td><td id="mpcDNetSavings">-</td></tr>
  </tbody>
</table>
```

#### [G] 이어보기 관련 링크

#### [H] FAQ + SeoContent

---

## 8. 인터랙션 설계 (`public/scripts/mortgage-prepayment-penalty.js`)

### 8-1. 상태 객체

```js
const state = {
  loanType: "mortgage",
  prepaymentMode: "full",        // "full" | "partial"
  remainingPrincipal: 300_000_000,
  partialAmount: 100_000_000,
  penaltyRate: 0.014,
  loanTermMonths: 360,
  remainingMonths: 24,
  annualRatePercent: 4.2,
};
```

### 8-2. 주요 함수 목록

| 함수명 | 역할 |
|--------|------|
| `readForm()` | 입력 DOM → state |
| `calculate(state)` | 핵심 계산, 결과 객체 반환 |
| `updateUI(result)` | KPI, 판정 박스, 상세표 갱신 |
| `onLoanTypeChange(type)` | 대출 유형 변경 시 기본값 자동 반영 |
| `onModeChange(mode)` | 상환 방식 변경 시 부분금액 입력 표시/숨김 |
| `applyPreset(presetId)` | 시나리오 버튼 적용 |
| `syncUrlParams()` | URL 직렬화 |
| `loadFromUrl()` | URL 복원 |
| `copyLink()` | 링크 복사 |
| `resetAll()` | 초기화 |
| `initFaq()` | FAQ accordion |

### 8-3. 통합 계산 함수

```js
function calculate(s) {
  const prepaymentAmount = s.prepaymentMode === "full"
    ? s.remainingPrincipal
    : Math.min(s.partialAmount, s.remainingPrincipal);

  const safeRemaining = Math.max(0, s.remainingMonths);
  const safeTerm = Math.max(1, s.loanTermMonths);
  const remainingRatio = safeRemaining / safeTerm;

  const prepaymentPenalty = prepaymentAmount * s.penaltyRate * remainingRatio;

  const monthlyRate = (s.annualRatePercent / 100) / 12;
  const estimatedInterestSavings = prepaymentAmount * monthlyRate * safeRemaining;

  const netSavings = estimatedInterestSavings - prepaymentPenalty;

  const breakEvenMonths = monthlyRate > 0
    ? prepaymentPenalty / (prepaymentAmount * monthlyRate)
    : 0;

  let verdict, verdictMod;
  if (s.penaltyRate <= 0) {
    verdict = "수수료 없음";
    verdictMod = "free";
  } else if (netSavings > 0) {
    const ratio = netSavings / (estimatedInterestSavings || 1);
    if (ratio > 0.2) { verdict = "유리"; verdictMod = "good"; }
    else { verdict = "소폭 유리"; verdictMod = "neutral"; }
  } else {
    verdict = "불리"; verdictMod = "bad";
  }

  const verdictCopy = {
    free: "수수료 없이 상환 가능합니다. 약정서에서 면제 조건을 다시 확인하세요.",
    good: `수수료(${fmtWon(prepaymentPenalty)})보다 이자 절감(${fmtBig(estimatedInterestSavings)})이 커서 중도상환이 유리합니다.`,
    neutral: `절감 이자가 수수료보다 소폭 많지만 차이가 크지 않습니다. 유동성과 기회비용도 함께 고려하세요.`,
    bad: `잔여 기간이 짧아 이자 절감(${fmtBig(estimatedInterestSavings)})보다 수수료(${fmtWon(prepaymentPenalty)})가 더 큽니다. 만기까지 유지하는 편이 유리할 수 있습니다.`,
  }[verdictMod];

  return {
    prepaymentAmount,
    prepaymentPenalty,
    estimatedInterestSavings,
    netSavings,
    breakEvenMonths,
    remainingRatio,
    monthlyInterest: prepaymentAmount * monthlyRate,
    verdict,
    verdictMod,
    verdictCopy,
  };
}
```

### 8-4. URL 파라미터

| 파라미터 | 의미 |
|----------|------|
| `lt` | loanType |
| `pm` | prepaymentMode (`full`/`partial`) |
| `rp` | remainingPrincipal |
| `pa` | partialAmount |
| `pr` | penaltyRate (%) |
| `tm` | loanTermMonths |
| `rm` | remainingMonths |
| `ar` | annualRatePercent |

예시:
```text
?lt=mortgage&pm=full&rp=300000000&pr=1.4&tm=360&rm=24&ar=4.2
```

### 8-5. 유불리 배지 색상

- `free`: 파란 계열
- `good`: 초록 계열
- `neutral`: 노랑 계열
- `bad`: 빨강 계열

---

## 9. 스타일 가이드 (`_mortgage-prepayment-penalty.scss`)

### 9-1. prefix

모든 클래스명 `mpc-` prefix 사용.

### 9-2. CSS 변수

```scss
.mpc-page {
  --mpc-good:    #1f8f63;
  --mpc-neutral: #e8a000;
  --mpc-bad:     #d95c5c;
  --mpc-free:    #1a56db;
}
```

### 9-3. 주요 블록

```scss
.mpc-kpi-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.mpc-kpi-card {
  padding: 14px 12px;
  border: 1px solid #ebe8df;
  border-radius: 12px;
  background: #fff;
  display: grid;
  gap: 6px;

  &--main {
    grid-column: 1 / -1;
    border-color: var(--color-primary);
    background: #eff4ff;

    @media (min-width: 768px) {
      grid-column: span 2;
    }
  }
}

.mpc-loan-tabs,
.mpc-mode-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.mpc-loan-tab,
.mpc-mode-tab {
  padding: 8px 12px;
  border: 1px solid #dcd9d0;
  border-radius: 999px;
  background: #f8f7f3;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.12s, border-color 0.12s, color 0.12s;

  &.is-active {
    border-color: #1a56db;
    background: #e1eaff;
    color: #1a56db;
  }
}

.mpc-loan-note {
  font-size: 12px;
  color: #6c6a64;
  line-height: 1.6;
  margin-top: 8px;
}

.mpc-verdict-box {
  padding: 14px 16px;
  border-radius: 10px;
  border: 1.5px solid #ebe8df;
  background: #f8f7f3;
  display: flex;
  align-items: flex-start;
  gap: 12px;

  &--good    { border-color: #b6e8d7; background: #f0faf6; }
  &--neutral { border-color: #fde68a; background: #fffbeb; }
  &--bad     { border-color: #fecaca; background: #fef2f2; }
  &--free    { border-color: #b8d0ff; background: #eff4ff; }
}

.mpc-verdict-badge {
  flex-shrink: 0;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;

  &--good    { background: #dcfce7; color: #166534; }
  &--neutral { background: #fef9c3; color: #854d0e; }
  &--bad     { background: #fee2e2; color: #991b1b; }
  &--free    { background: #e1eaff; color: #1a3e8c; }
}

.mpc-breakdown-table {
  width: 100%;
  border-collapse: collapse;

  td {
    padding: 10px 12px;
    border-bottom: 1px solid #ece9df;
    font-size: 13px;

    &:last-child {
      text-align: right;
      font-weight: 700;
      color: #1a1a18;
    }

    &:first-child {
      color: #4d4a43;
    }
  }

  tr.mpc-separator td {
    background: #f8f7f3;
    font-size: 11px;
    font-weight: 700;
    color: #6c6a64;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
}

.mpc-presets {
  display: grid;
  gap: 8px;
}

.mpc-preset-btn {
  display: grid;
  gap: 3px;
  text-align: left;
  padding: 10px 12px;
  border: 1.5px solid #e2e2dc;
  border-radius: 10px;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.12s, background 0.12s;

  strong { font-size: 12px; font-weight: 700; color: #1a1a18; }
  span   { font-size: 11px; color: #6c6a64; }

  &:hover, &.is-active {
    border-color: #1a56db;
    background: #eff4ff;
  }
}
```

### 9-4. 모바일 대응

- KPI 카드: 2열 (기본) → 4열 (768px+), 메인 카드 항상 full-width
- 상세 계산표: 좌측 항목명·우측 금액 2열 고정
- 대출 유형 탭: flex-wrap으로 2줄 처리
- 유불리 배지 박스: 배지와 문구를 flex-row → flex-column (480px 이하)

---

## 10. SEO / 메타

### 10-1. 메타

- `title`: `중도상환 수수료 계산기 | 지금 갚으면 얼마? 유불리 자동 계산`
- `description`: `대출 잔여 원금, 수수료율, 잔여 기간을 입력하면 중도상환 수수료와 이자 절감액을 비교해 유불리를 바로 확인합니다. 주담대·전세대출·신용대출 지원.`

### 10-2. H 구조

- H1: `중도상환 수수료 계산기`
- H2: (결과 섹션) `수수료와 절감 이자를 비교합니다`
- H2: `상세 계산표`
- H2: `중도상환 수수료 FAQ`

### 10-3. 타겟 키워드

- 중도상환 수수료 계산기
- 대출 중도상환 수수료 얼마
- 주담대 중도상환 유불리
- 전세대출 중도상환 수수료
- 중도상환 이자 절감

### 10-4. 구조화 데이터

- `WebApplication`
- `FAQPage`

---

## 11. 등록 반영

### 11-1. `src/data/tools.ts`

```ts
{
  slug: "mortgage-prepayment-penalty",
  title: "중도상환 수수료 계산기",
  description: "대출 잔여 원금, 수수료율, 잔여 기간을 입력하면 중도상환 수수료와 이자 절감액을 비교해 갚는 게 유리한지 바로 확인합니다.",
  order: 14.5,
  eyebrow: "대출 계산기",
  category: "realestate",
  iframeReady: true,
  badges: ["신규", "부동산"],
  previewStats: [
    { label: "수수료 공식", value: "원금×율×잔여비율", context: "은행 일반 기준" },
    { label: "결과", value: "유불리 자동 판정" },
  ],
},
```

### 11-2. `src/pages/tools/index.astro` (`topicBySlug`)

```ts
"mortgage-prepayment-penalty": "부동산·집 마련",
```

`toolHighlights`:
```ts
"mortgage-prepayment-penalty": "수수료 금액과 이자 절감액을 비교해 지금 갚는 게 유리한지 바로 확인합니다.",
```

### 11-3. `src/pages/index.astro` (`topicBySlug`)

```ts
"mortgage-prepayment-penalty": "부동산·내집마련",
```

### 11-4. `src/styles/app.scss`

```scss
@use 'scss/pages/mortgage-prepayment-penalty';
```

### 11-5. `public/sitemap.xml`

```xml
<url>
  <loc>https://bigyocalc.com/tools/mortgage-prepayment-penalty/</loc>
  <changefreq>yearly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## 12. 구현 순서

1. `src/data/mortgagePrepaymentPenalty.ts` 작성
2. `src/pages/tools/mortgage-prepayment-penalty.astro` 작성
3. `public/scripts/mortgage-prepayment-penalty.js` 작성
4. `src/styles/scss/pages/_mortgage-prepayment-penalty.scss` 작성
5. `src/data/tools.ts` 등록
6. `src/pages/tools/index.astro` topicBySlug + toolHighlights 추가
7. `src/pages/index.astro` topicBySlug 추가
8. `src/styles/app.scss` import 추가
9. `public/sitemap.xml` URL 추가
10. `npm run build` 검증

---

## 13. QA 체크리스트

### 계산 로직

- [ ] 수수료 = 상환원금 × 수수료율 × (잔여개월 / 약정개월)
- [ ] 잔여 기간 0이하 → 수수료 0원, "만기 도래" 안내
- [ ] 수수료율 0 → "수수료 없음" 배지 노출
- [ ] 부분 상환 금액 > 잔여 원금 → 잔여 원금으로 클램프
- [ ] 순 절약 < 0 → "불리" 배지 빨강
- [ ] 순 절약 > 0 소폭 → "소폭 유리" 노랑
- [ ] 순 절약 > 이자의 20% → "유리" 초록

### UI

- [ ] 모바일 375px KPI 카드 2열 정상 표시
- [ ] 부분 상환 탭 전환 시 금액 입력 필드 표시/숨김 즉시 반영
- [ ] 대출 유형 탭 전환 시 수수료율·약정기간·금리 기본값 자동 반영
- [ ] 시나리오 버튼 클릭 후 결과 즉시 갱신
- [ ] 유불리 배지 색상이 상태에 따라 정확히 변경
- [ ] FAQ accordion 키보드 접근 가능

### URL 파라미터

- [ ] 현재 입력 상태 직렬화
- [ ] 공유 링크 재진입 시 동일 결과 복원

### 등록

- [ ] `src/data/tools.ts` 항목 추가
- [ ] `src/pages/tools/index.astro` topicBySlug + toolHighlights 추가
- [ ] `src/pages/index.astro` topicBySlug 추가
- [ ] `src/styles/app.scss` import 추가
- [ ] `public/sitemap.xml` URL 추가
- [ ] `npm run build` 에러 없음

---

## 14. 핵심 구현 메모

- 이 계산기의 핵심은 **수수료 금액보다 "갚는 게 유리한지 판단"** 이다. 유불리 배지가 결과의 1순위여야 한다.
- 잔여 이자 절감액은 단순 근사값이라는 점을 항상 UI에서 명확히 표시한다. ("단순 근사값" 배지 또는 note)
- 2026 기준 은행 주담대 수수료 변화는 InfoNotice에서만 안내하고, 계산기 로직에서는 사용자가 직접 수수료율을 입력하게 한다. 기본값은 "기존 약정 참고값"으로 표기한다.
- 대출 유형 탭 전환 시 수수료율·약정기간·금리 기본값이 자동으로 바뀌는 UX가 이 계산기의 핵심 편의 기능이다.
- 결과 문구는 숫자만 나열하지 말고 "수수료(OOO원)보다 이자 절감(OOO원)이 커서 유리합니다" 처럼 해석 문장으로 표현한다.
