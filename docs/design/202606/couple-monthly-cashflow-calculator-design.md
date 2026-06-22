# 부부 월 현금흐름 계산기 설계 문서

> 기획 문서: `docs/plan/202606/couple-monthly-cashflow-calculator.md`
> 작성일: 2026-06-22
> 구현 대상: `/tools/couple-monthly-cashflow-calculator/`
> 구현 기준: 부부 합산 월 실수령, 지출 구조, 투자 가능액, 저축률, 목표자산 도달 기간을 즉시 계산하는 체류형 계산기

---

## 1. 문서 개요

### 1-1. 구현 대상

- 이름: 부부 월 현금흐름 계산기
- slug: `couple-monthly-cashflow-calculator`
- URL: `/tools/couple-monthly-cashflow-calculator/`
- 카테고리: 생활비/재테크 또는 급여 (`living` 또는 `salary`)
- pageClass: `cmc-page`
- JS id: `couple-monthly-cashflow-calculator`
- SCSS prefix: `cmc-`

### 1-2. 사용자 결과 목표

사용자가 숫자를 입력하면 다음 질문에 답해야 한다.

1. 우리 부부 월 실수령 합계는 얼마인가?
2. 고정비와 변동비는 각각 얼마인가?
3. 매달 실제로 남는 돈은 얼마인가?
4. 저축률은 몇 %이고 위험/보통/양호/강함 중 어디인가?
5. 현재 투자 가능액으로 10억까지 몇 년 걸리는가?
6. 어떤 항목을 줄이면 효과가 큰가?

---

## 2. 파일 구조

```text
src/
  data/
    coupleMonthlyCashflowCalculator.ts
  pages/
    tools/
      couple-monthly-cashflow-calculator.astro

public/
  scripts/
    couple-monthly-cashflow-calculator.js

src/styles/scss/pages/
  _couple-monthly-cashflow-calculator.scss
```

필수 등록:

- `src/data/tools.ts`: 도구 목록 등록
- `src/styles/app.scss`: `@use 'scss/pages/couple-monthly-cashflow-calculator';`
- `public/sitemap.xml`: `/tools/couple-monthly-cashflow-calculator/` 추가
- 필요 시 `src/pages/index.astro`: 신규/추천 계산기 노출

---

## 3. 데이터 파일 설계

파일: `src/data/coupleMonthlyCashflowCalculator.ts`

### 3-1. 메타

```ts
export const COUPLE_MONTHLY_CASHFLOW_META = {
  slug: "couple-monthly-cashflow-calculator",
  title: "부부 월 현금흐름 계산기",
  description:
    "남편 연봉, 아내 연봉, 대출, 육아비, 생활비, 투자금을 입력하면 월 실수령 합계와 잉여현금, 저축률, 목표자산 도달 기간을 계산합니다.",
  updatedAt: "2026.06.22",
};
```

### 3-2. 타입

```ts
export interface CashflowPreset {
  id: string;
  label: string;
  description: string;
  income: {
    husbandSalary: number;
    wifeSalary: number;
    husbandBonus: number;
    wifeBonus: number;
    otherMonthlyIncome: number;
  };
  housing: {
    type: "mortgage" | "jeonseLoan" | "monthlyRent" | "none";
    loanBalance: number;
    loanRate: number;
    manualMonthlyPayment: number;
    rent: number;
    maintenanceFee: number;
  };
  childcare: {
    children: number;
    daycare: number;
    formulaFood: number;
    diaper: number;
    medical: number;
    childInsurance: number;
    careEducation: number;
  };
  living: {
    food: number;
    transport: number;
    telecomSubscription: number;
    coupleInsurance: number;
    medicalBeautyClothing: number;
    familyEvents: number;
    otherCard: number;
  };
  investing: {
    depositSavings: number;
    isa: number;
    pension: number;
    stockEtf: number;
    crypto: number;
    currentAssets: number;
    targetAssets: number;
    expectedReturn: number;
  };
}
```

### 3-3. 프리셋

```ts
export const CASHFLOW_PRESETS: CashflowPreset[] = [
  {
    id: "newlywed_dual_income",
    label: "신혼 맞벌이",
    description: "자녀 없이 주거비와 생활비 중심으로 저축률을 보는 기본 시나리오",
    income: {
      husbandSalary: 60000000,
      wifeSalary: 50000000,
      husbandBonus: 0,
      wifeBonus: 0,
      otherMonthlyIncome: 0,
    },
    housing: {
      type: "jeonseLoan",
      loanBalance: 200000000,
      loanRate: 4,
      manualMonthlyPayment: 0,
      rent: 0,
      maintenanceFee: 300000,
    },
    childcare: {
      children: 0,
      daycare: 0,
      formulaFood: 0,
      diaper: 0,
      medical: 50000,
      childInsurance: 0,
      careEducation: 0,
    },
    living: {
      food: 1000000,
      transport: 400000,
      telecomSubscription: 250000,
      coupleInsurance: 300000,
      medicalBeautyClothing: 300000,
      familyEvents: 300000,
      otherCard: 500000,
    },
    investing: {
      depositSavings: 500000,
      isa: 500000,
      pension: 500000,
      stockEtf: 500000,
      crypto: 0,
      currentAssets: 50000000,
      targetAssets: 1000000000,
      expectedReturn: 5,
    },
  },
];
```

프리셋은 최소 5개를 제공한다.

- `newlywed_dual_income`: 신혼 맞벌이
- `infant_one_child`: 영유아 1명
- `single_income_parenting`: 외벌이 전환
- `high_mortgage`: 대출 많은 부부
- `fire_focused`: FIRE 집중형

### 3-4. 안내/SEO 데이터

```ts
export const SAVING_RATE_BANDS = [
  { min: -Infinity, max: 0, label: "적자", tone: "danger" },
  { min: 0, max: 10, label: "위험", tone: "warning" },
  { min: 10, max: 25, label: "보통", tone: "neutral" },
  { min: 25, max: 40, label: "양호", tone: "positive" },
  { min: 40, max: Infinity, label: "강함", tone: "strong" },
];

export const CASHFLOW_RELATED_LINKS = [
  { href: "/tools/salary/", label: "연봉 실수령 계산기" },
  { href: "/tools/household-income/", label: "가구소득 순위 계산기" },
  { href: "/tools/formula-cost/", label: "분유비 계산기" },
  { href: "/tools/diaper-cost/", label: "기저귀 비용 계산기" },
  { href: "/tools/fire-calculator/", label: "FIRE 계산기" },
  { href: "/tools/dca-investment-calculator/", label: "적립식 투자 계산기" },
];
```

---

## 4. Astro 페이지 설계

파일: `src/pages/tools/couple-monthly-cashflow-calculator.astro`

### 4-1. 기본 구조

```astro
---
import SimpleToolShell from "../../layouts/SimpleToolShell.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  COUPLE_MONTHLY_CASHFLOW_META,
  CASHFLOW_PRESETS,
  CASHFLOW_RELATED_LINKS,
} from "../../data/coupleMonthlyCashflowCalculator";
---

<SimpleToolShell
  calculatorId="couple-monthly-cashflow-calculator"
  pageClass="cmc-page"
  title={COUPLE_MONTHLY_CASHFLOW_META.title}
  description={COUPLE_MONTHLY_CASHFLOW_META.description}
>
```

실제 프로젝트의 `SimpleToolShell` props 패턴에 맞춰 조정한다.

### 4-2. IA

1. `CalculatorHero`
   - eyebrow: `부부 생활비 · 저축률 계산`
   - H1: `부부 월 현금흐름 계산기`
   - description: 연봉, 대출, 육아비, 생활비, 투자금을 넣으면 한 달 잉여현금과 목표자산 도달 기간을 계산한다는 문구
2. `InfoNotice`
   - 세후 소득, 세금, 보험료, 투자수익률은 추정값
   - 투자 수익률은 원금 손실 가능성 안내
3. 프리셋 버튼
4. 입력 섹션
5. 결과 섹션
6. 현금흐름 상세표
7. 목표자산 도달 기간
8. 내부 CTA 카드
9. SEO 본문
10. FAQ

---

## 5. 입력 UI 설계

### 5-1. 레이아웃

PC:

- 좌측: 입력 패널
- 우측: 결과 패널 sticky
- 입력 패널은 `소득`, `주거`, `육아`, `생활비`, `투자` 탭 또는 접이식 섹션

모바일:

- Hero
- 프리셋
- 결과 요약 카드
- 입력 섹션
- 상세 결과
- 내부 CTA

모바일에서는 결과 카드가 너무 아래로 밀리지 않도록 입력 상단에 축약 결과 바를 둔다.

### 5-2. 컴포넌트 클래스

```text
cmc-page
cmc-preset-grid
cmc-preset-button
cmc-calculator-grid
cmc-input-panel
cmc-input-section
cmc-field-grid
cmc-result-panel
cmc-kpi-grid
cmc-kpi-card
cmc-cashflow-bars
cmc-breakdown-table
cmc-saving-badge
cmc-target-card
cmc-suggestion-grid
cmc-cta-grid
```

### 5-3. 입력 컨트롤 원칙

- 금액 입력은 `number input + 만원 단위 헬퍼`를 같이 제공한다.
- 자녀 수는 stepper 또는 select.
- 주거 형태는 segmented control.
- 기대수익률은 slider + number input.
- 프리셋은 버튼 카드로 제공하되, 클릭하면 모든 입력값을 즉시 갱신한다.
- 입력 변경 시 결과는 즉시 갱신한다.

---

## 6. 클라이언트 스크립트 설계

파일: `public/scripts/couple-monthly-cashflow-calculator.js`

### 6-1. 상태 모델

```js
const state = {
  husbandSalary: 60000000,
  wifeSalary: 50000000,
  husbandBonus: 0,
  wifeBonus: 0,
  otherMonthlyIncome: 0,
  housingType: "jeonseLoan",
  loanBalance: 200000000,
  loanRate: 4,
  manualMonthlyPayment: 0,
  rent: 0,
  maintenanceFee: 300000,
  children: 1,
  daycare: 200000,
  formulaFood: 200000,
  diaper: 100000,
  childMedical: 50000,
  childInsurance: 100000,
  careEducation: 0,
  food: 1200000,
  transport: 500000,
  telecomSubscription: 250000,
  coupleInsurance: 400000,
  medicalBeautyClothing: 300000,
  familyEvents: 300000,
  otherCard: 500000,
  depositSavings: 500000,
  isa: 500000,
  pension: 500000,
  stockEtf: 500000,
  crypto: 0,
  currentAssets: 50000000,
  targetAssets: 1000000000,
  expectedReturn: 5,
};
```

### 6-2. 주요 함수

```js
function estimateAnnualNetIncome(grossAnnual) {}
function estimateMonthlyNetIncome(grossAnnual, annualBonus) {}
function calculateHousingCost(input) {}
function calculateChildcareCost(input) {}
function calculateLivingCost(input) {}
function calculateMonthlyInvesting(input) {}
function calculateTargetYears(currentAssets, monthlyInvestment, targetAssets, expectedReturn) {}
function getSavingRateBand(savingRate) {}
function calculateCashflow(input) {}
function renderResults(result) {}
function renderBreakdown(result) {}
function bindInputs() {}
function applyPreset(presetId) {}
```

### 6-3. 세후 소득 추정

정확한 기존 연봉 계산 로직이 있으면 재사용한다. 독립 구현이 필요하면 아래처럼 단순 추정한다.

```js
function estimateAnnualNetIncome(grossAnnual) {
  const nationalPension = Math.min(grossAnnual * 0.045, 2817000);
  const healthInsurance = grossAnnual * 0.03545;
  const longTermCare = healthInsurance * 0.1295;
  const employmentInsurance = grossAnnual * 0.009;
  const taxableIncome = Math.max(
    grossAnnual - nationalPension - healthInsurance - longTermCare - employmentInsurance - 1500000,
    0
  );
  const estimatedIncomeTax = estimateIncomeTax(taxableIncome);
  const localTax = estimatedIncomeTax * 0.1;
  return Math.max(
    grossAnnual - nationalPension - healthInsurance - longTermCare - employmentInsurance - estimatedIncomeTax - localTax,
    0
  );
}
```

세후 소득은 반드시 `추정`으로 표기한다.

### 6-4. 목표자산 기간 계산

```js
function calculateTargetYears(currentAssets, monthlyInvestment, targetAssets, expectedReturn) {
  if (currentAssets >= targetAssets) return 0;
  if (monthlyInvestment <= 0 && expectedReturn <= 0) return null;

  const monthlyRate = Math.pow(1 + expectedReturn / 100, 1 / 12) - 1;
  let assets = currentAssets;

  for (let month = 1; month <= 720; month += 1) {
    assets = assets * (1 + monthlyRate) + monthlyInvestment;
    if (assets >= targetAssets) return month / 12;
  }

  return null;
}
```

---

## 7. 결과 렌더링 설계

### 7-1. 결과 객체

```ts
interface CashflowResult {
  husbandMonthlyNet: number;
  wifeMonthlyNet: number;
  totalMonthlyNet: number;
  housingCost: number;
  childcareCost: number;
  livingCost: number;
  fixedCost: number;
  variableCost: number;
  monthlyInvestingInput: number;
  monthlySurplus: number;
  investableAmount: number;
  savingRate: number;
  savingBandLabel: string;
  targetYears: number | null;
  largestExpenseCategory: string;
}
```

### 7-2. KPI 카드

1. 월 실수령 합계
2. 고정비
3. 변동비
4. 투자 가능액
5. 저축률
6. 목표자산 도달 기간

### 7-3. 현금흐름 바

월 실수령액을 100%로 두고 다음 비중을 시각화한다.

- 주거비
- 육아비
- 생활비
- 보험료/고정비
- 투자 가능액

색상은 단일 hue로 가지 않고 다음처럼 구분한다.

- 소득: 녹색 계열
- 주거: 남색/회색
- 육아: 청록
- 생활비: 노랑/주황
- 투자 가능액: 파랑
- 적자/경고: 빨강

### 7-4. 개선 제안

계산 결과에 따라 최대 3개 제안을 표시한다.

| 조건 | 제안 |
|---|---|
| 주거비 / 실수령 > 35% | 주거비 비중이 높습니다. 대출 갈아타기나 월세/전세 구조를 비교해보세요. |
| 육아비 / 실수령 > 15% | 육아비 비중이 큽니다. 분유, 기저귀, 어린이집 비용을 항목별로 나눠보세요. |
| 저축률 < 10% | 예비비가 부족할 수 있습니다. 고정 구독과 보험료부터 점검해보세요. |
| 투자 가능액 > 0 and 목표자산 기간 null | 목표자산이나 기대수익률을 현실적으로 조정해보세요. |
| 저축률 >= 40% | 자산 형성 속도가 빠릅니다. FIRE 계산기로 장기 계획을 확인해보세요. |

---

## 8. SCSS 설계

파일: `src/styles/scss/pages/_couple-monthly-cashflow-calculator.scss`

### 8-1. 레이아웃

```scss
.cmc-page {
  .cmc-calculator-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.05fr) minmax(360px, 0.95fr);
    gap: 24px;
    align-items: start;
  }

  .cmc-result-panel {
    position: sticky;
    top: 88px;
  }
}
```

### 8-2. 카드

- 카드 radius는 8px 이하.
- 결과 KPI는 숫자가 줄바꿈되지 않도록 `font-variant-numeric: tabular-nums`.
- 모바일에서 카드 너비가 흔들리지 않도록 grid minmax 사용.
- 긴 한국어 라벨은 `word-break: keep-all`, 필요 시 `overflow-wrap: anywhere`.

### 8-3. 모바일

```scss
@media (max-width: 860px) {
  .cmc-page {
    .cmc-calculator-grid {
      grid-template-columns: 1fr;
    }

    .cmc-result-panel {
      position: static;
    }

    .cmc-kpi-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
}

@media (max-width: 520px) {
  .cmc-page {
    .cmc-kpi-grid {
      grid-template-columns: 1fr;
    }
  }
}
```

---

## 9. SEO 콘텐츠 설계

`SeoContent`에 넣을 문단은 최소 7개 블록으로 구성한다.

1. 부부 월 현금흐름 계산기의 의미
2. 연봉보다 월 잉여현금이 중요한 이유
3. 맞벌이 부부의 고정비 구조
4. 육아비가 생겼을 때 현금흐름 변화
5. 저축률 기준과 해석
6. 목표자산 도달 기간 계산 방식
7. 계산 결과를 활용하는 순서

본문 안에는 내부 링크를 자연스럽게 배치한다.

- 연봉 실수령 계산기
- 가구소득 순위 계산기
- 분유비 계산기
- 기저귀 비용 계산기
- FIRE 계산기
- 적립식 투자 계산기

---

## 10. 구조화 데이터

`SoftwareApplication` 또는 `WebApplication` JSON-LD를 사용한다.

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "부부 월 현금흐름 계산기",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "All",
  "description": "부부 합산 월 실수령액, 고정비, 변동비, 투자 가능액, 저축률, 목표자산 도달 기간을 계산합니다.",
  "url": "https://bigyocalc.com/tools/couple-monthly-cashflow-calculator/"
}
```

FAQ가 충분하면 `FAQPage` JSON-LD도 추가한다.

---

## 11. 접근성/UX 체크

- 모든 입력에는 `label` 연결.
- 숫자 입력은 모바일 숫자 키패드가 뜨도록 `inputmode="numeric"` 또는 `inputmode="decimal"`.
- 결과 갱신 영역은 과도한 `aria-live`를 피하고, 주요 결과 카드만 polite로 처리 가능.
- 색상만으로 등급을 구분하지 않고 `적자`, `위험`, `보통`, `양호`, `강함` 텍스트를 함께 표시.
- 프리셋 버튼은 현재 선택 상태를 `aria-pressed`로 표시.

---

## 12. 검증 체크리스트

### 12-1. 계산 검증

- 부부 연봉을 0으로 넣어도 NaN이 나오지 않는다.
- 월 실수령 합계가 0이면 저축률은 0 또는 계산 불가로 안전 처리한다.
- 투자 가능액이 음수이면 목표자산 기간은 계산하지 않는다.
- 목표자산이 현재자산보다 작으면 0년으로 표시한다.
- 기대수익률이 0%여도 목표 기간 계산이 된다.
- 60년 초과 도달은 "현재 조건으로는 도달이 어렵습니다"로 표시한다.

### 12-2. 콘텐츠 검증

- 사용자 facing 텍스트는 한국어.
- 미완성 상태를 암시하는 문구, 빈 링크, 임시 수치가 없음.
- 추정 계산임을 표시.
- 투자 수익률은 보장값이 아님을 표시.
- FAQ와 내부 링크가 빈약하지 않음.

### 12-3. 빌드 검증

```bash
npm run build
```

빌드 성공 전 커밋/푸시 금지.

---

## 13. 구현 순서

1. `src/data/coupleMonthlyCashflowCalculator.ts` 작성
2. `public/scripts/couple-monthly-cashflow-calculator.js` 작성
3. `src/pages/tools/couple-monthly-cashflow-calculator.astro` 작성
4. `src/styles/scss/pages/_couple-monthly-cashflow-calculator.scss` 작성
5. `src/data/tools.ts` 등록
6. `src/styles/app.scss` 등록
7. `public/sitemap.xml` 등록
8. 홈/관련 계산기 CTA 연결
9. 미완성 신호 스캔
10. `npm run build`

---

## 14. 이후 확장

1. 맞벌이 vs 외벌이 비교 모드
2. 육아휴직 급여 계산기와 자동 연결
3. 대출 갈아타기 계산기와 주거비 비교 연결
4. 결과 공유 URL 파라미터
5. 월별 자산 증가 그래프
6. 지출 항목별 절감 시뮬레이션
7. "현재 저축률로 가능한 목표" 추천 카드

---

## 15. 설계 결론

이 계산기는 단순 소득 계산기가 아니라 비교계산소의 여러 계산기를 묶는 생활 재무 허브다. 첫 화면에서는 결과가 빠르게 보여야 하고, 아래로 내려갈수록 지출 구조와 내부 CTA가 촘촘해야 한다. 구현 시 가장 중요한 것은 숫자 계산의 안정성, 모바일 입력 편의성, 그리고 "연봉이 아니라 매달 남는 돈"이라는 메시지를 페이지 전체에 일관되게 유지하는 것이다.
