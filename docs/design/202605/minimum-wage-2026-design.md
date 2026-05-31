# 2026 최저임금 완전 계산기 — 설계 문서

> 기획 원문: `docs/plan/202605/minimum-wage-2026.md`
> 작성일: 2026-05-31
> 구현 대상: `/tools/minimum-wage-2026/`
> 구현 기준: 2026 최저임금 기준 시급·주급·월급·연봉 환산, 주휴수당 포함/제외 토글, 4대보험 공제 후 실수령, 최저임금 미달 경고

---

## 1. 문서 개요

### 1-1. 대상

- 구현 대상: `2026 최저임금 완전 계산기`
- 콘텐츠 유형: 계산기형 도구
- slug: `minimum-wage-2026`
- URL: `/tools/minimum-wage-2026/`
- 카테고리: 직업/연봉

### 1-2. 문서 역할

이 문서는 기획 문서를 실제 구현 단위로 고정한다. 구현자는 이 문서를 기준으로 페이지, 데이터, 스크립트, 스타일, 등록 파일을 추가한다.

핵심 구현 목표:

- 2026 최저임금 시급을 기준으로 시급·일급·주급·월급·연봉을 즉시 환산한다.
- 주 15시간 기준 주휴수당 발생 여부를 자동 판단하고 금액을 분리 표시한다.
- 주휴수당 포함/제외 토글로 실질 시급과 명목 시급의 차이를 즉시 비교한다.
- 4대보험 공제 후 세후 실수령액(월·연)을 항목별로 분해 표시한다.
- 직접 시급 입력 시 최저임금 충족 여부를 즉시 판단하고, 미달 시 경고 배너를 노출한다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    minimumWage2026.ts
  pages/
    tools/
      minimum-wage-2026.astro

public/
  scripts/
    minimum-wage-2026.js

src/styles/scss/pages/
  _minimum-wage-2026.scss
```

필수 등록:

- `src/data/tools.ts`
- `src/styles/app.scss` — `@use 'scss/pages/minimum-wage-2026';`
- `public/sitemap.xml`

선택 등록:

- `src/pages/tools/overtime-pay-calculator.astro` 하단 내부 링크
- `src/pages/tools/year-end-tax-refund-calculator.astro` 하단 내부 링크

---

## 3. SEO 설계

### 3-1. 메타

```ts
title: "2026 최저임금 계산기 — 시급 월급 환산·주휴수당·세후 실수령 한 번에"
description: "2026년 최저임금 기준으로 시급·주급·월급·연봉을 즉시 환산합니다. 주휴수당 포함 여부, 4대보험 공제 후 세후 실수령액까지 한 번에 확인하고 최저임금 미달 여부도 즉시 판단하세요."
canonical: "/tools/minimum-wage-2026/"
```

### 3-2. 페이지 텍스트

Hero H1:

```text
2026 최저임금 완전 계산기
```

Hero sub:

```text
2026 최저임금 기준으로 시급·주급·월급·연봉을 즉시 계산합니다. 주휴수당 포함 여부와 4대보험 공제 후 실수령액까지 한 번에 확인하세요.
```

---

## 4. 레이아웃 방향

- `SimpleToolShell` 기반. 입력 패널 사이드(aside), 결과 메인 영역.
- `resultFirst={false}` — 모바일 입력 먼저.
- SCSS prefix: `mwc-`
- pageClass: `mwc-page`
- calculatorId: `minimum-wage-2026`

```astro
<SimpleToolShell
  calculatorId="minimum-wage-2026"
  pageClass="mwc-page"
  resultFirst={false}
>
```

권장 IA:

1. Hero
2. InfoNotice (추정 안내)
3. 입력 패널 (aside)
4. KPI 카드 4개
5. 환산 요약 테이블
6. 공제 상세 카드
7. 최저임금 미달 경고 배너 (조건부)
8. 주휴수당 가이드 카드
9. SeoContent + FAQ

---

## 5. 데이터 모델

파일: `src/data/minimumWage2026.ts`

```ts
// ─── 핵심 상수 ────────────────────────────────────────────────

/** 2026 최저임금 시급 (2025년 8월 고시 확정값 반영) */
export const MINIMUM_WAGE_2026 = 10_030; // ← 구현 시점 확정값으로 교체

/** 월 환산 주 수 (365 ÷ 7 ÷ 12) */
export const MONTHLY_WEEKS = 365 / 7 / 12; // ≈ 4.3452

/** 주휴수당 발생 최소 주 소정근로시간 */
export const WEEKLY_HOLIDAY_MIN_HOURS = 15;

/** 비과세 식대 (소득세 계산 시 공제) */
export const NONTAX_MEAL = 200_000;

// ─── 4대보험 요율 (2026 기준, 근로자 부담분) ──────────────────

export const INSURANCE_RATES = {
  nationalPension:      0.045,   // 국민연금 4.5%
  healthInsurance:      0.03545, // 건강보험 3.545%
  longTermCareRatio:    0.1295,  // 장기요양 = 건강보험료 × 12.95%
  employmentInsurance:  0.009,   // 고용보험 0.9%
} as const;

// ─── 간이 소득세 구간 (월 과세소득, 부양가족 0인 기준) ───────────

export interface IncomeTaxBracket {
  minIncome: number;   // 월 과세소득 하한
  maxIncome: number;   // 월 과세소득 상한
  monthlyTax: number;  // 간이세액 (원)
}

export const INCOME_TAX_BRACKETS: IncomeTaxBracket[] = [
  { minIncome: 0,       maxIncome: 1_060_000, monthlyTax: 0 },
  { minIncome: 1_060_000, maxIncome: 1_500_000, monthlyTax: 19_520 },
  { minIncome: 1_500_000, maxIncome: 3_000_000, monthlyTax: 62_010 },
  { minIncome: 3_000_000, maxIncome: 4_500_000, monthlyTax: 152_960 },
  { minIncome: 4_500_000, maxIncome: 9_999_999, monthlyTax: 298_010 },
];
// 실제 구현 시 국세청 2026 간이세액표 기준으로 보완 필요

// ─── 타입 정의 ────────────────────────────────────────────────

export type HourlyMode = "auto" | "manual";
export type DeductionMode = "estimated" | "none" | "custom";

export interface MwcPreset {
  id: string;
  label: string;
  weeklyHours: number;
  dailyHours: number;
  weeklyDays: number;
  hourlyMode: HourlyMode;
  hourlyWage: number;
  includeWeeklyHoliday: boolean;
}

export interface RelatedCalculator {
  href: string;
  label: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

// ─── 프리셋 ────────────────────────────────────────────────────

export const MWC_PRESETS: MwcPreset[] = [
  {
    id: "fulltime",
    label: "전일제 (주 40시간)",
    weeklyHours: 40,
    dailyHours: 8,
    weeklyDays: 5,
    hourlyMode: "auto",
    hourlyWage: MINIMUM_WAGE_2026,
    includeWeeklyHoliday: true,
  },
  {
    id: "parttime25",
    label: "편의점 알바 (주 25시간)",
    weeklyHours: 25,
    dailyHours: 5,
    weeklyDays: 5,
    hourlyMode: "auto",
    hourlyWage: MINIMUM_WAGE_2026,
    includeWeeklyHoliday: true,
  },
  {
    id: "weekend16",
    label: "주말 알바 (주 16시간)",
    weeklyHours: 16,
    dailyHours: 8,
    weeklyDays: 2,
    hourlyMode: "auto",
    hourlyWage: MINIMUM_WAGE_2026,
    includeWeeklyHoliday: true,
  },
  {
    id: "shorttime10",
    label: "단기 알바 (주 10시간)",
    weeklyHours: 10,
    dailyHours: 5,
    weeklyDays: 2,
    hourlyMode: "auto",
    hourlyWage: MINIMUM_WAGE_2026,
    includeWeeklyHoliday: false,
  },
];

// ─── 관련 계산기 ───────────────────────────────────────────────

export const MWC_RELATED_CALCULATORS: RelatedCalculator[] = [
  {
    href: "/tools/overtime-pay-calculator/",
    label: "야근수당 계산기",
    description: "연장·야간·휴일근로 수당을 통상임금 기준으로 자동 계산합니다.",
  },
  {
    href: "/tools/bonus-after-tax-calculator/",
    label: "성과급 세후 실수령액 계산기",
    description: "성과급에서 세금과 4대보험을 뺀 실수령 금액을 추정합니다.",
  },
  {
    href: "/tools/year-end-tax-refund-calculator/",
    label: "연말정산 계산기",
    description: "연말정산 환급·추가납부 금액을 미리 계산합니다.",
  },
  {
    href: "/tools/parental-leave-short-work/",
    label: "육아기 단축근무 급여 계산기",
    description: "단축근무 시 최저임금 적용 기준과 급여를 확인합니다.",
  },
];

// ─── FAQ ───────────────────────────────────────────────────────

export const MWC_FAQS: FaqItem[] = [
  {
    question: "2026 최저임금은 얼마인가요?",
    answer: "2026년 최저임금은 시간당 XX,XXX원으로 전년 대비 X% 인상됐습니다. 주 40시간·월 209시간 기준 월 환산액은 약 XX만 원입니다.",
  },
  {
    question: "주휴수당은 무조건 받을 수 있나요?",
    answer: "주휴수당은 1주 소정근로시간이 15시간 이상인 근로자에게 발생합니다. 주 14시간 이하 알바는 주휴수당 대상이 아닙니다. 계약서에 명시된 소정근로시간이 기준이므로 실제 근무시간과 구분해야 합니다.",
  },
  {
    question: "알바 여러 군데 다니면 주휴수당이 합산되나요?",
    answer: "아닙니다. 주휴수당은 단일 사업장 기준으로 발생합니다. A사 주 10시간, B사 주 10시간 근무해도 각 사업장에서 주 15시간 미만이면 어느 곳에서도 주휴수당이 발생하지 않습니다.",
  },
  {
    question: "수습 기간에도 최저임금을 다 받아야 하나요?",
    answer: "1년 이상 근로계약을 체결하고 3개월 이내 수습 중인 경우 최저임금의 90%까지 감액 적용이 가능합니다. 단, 단순 노무 종사자(편의점·청소 등)는 감액 불가이므로 직종을 확인해야 합니다.",
  },
  {
    question: "최저임금보다 적게 받으면 어떻게 해야 하나요?",
    answer: "고용노동부 민원마당(minwon.moel.go.kr)이나 콜센터(1350)에 임금체불로 신고할 수 있습니다. 사업주는 최저임금 위반 시 3년 이하 징역 또는 2,000만 원 이하 벌금 대상이 됩니다.",
  },
  {
    question: "식대·교통비도 최저임금에 포함되나요?",
    answer: "매월 지급되는 정기 상여금과 복리후생비의 일부가 최저임금 산입 범위에 포함될 수 있습니다. 이 계산기는 단순 시급 기준으로 계산하므로 복잡한 임금 구조는 노무사 상담을 권장합니다.",
  },
  {
    question: "사장님이 4대보험 빼고 최저임금이라고 하는데 맞나요?",
    answer: "아닙니다. 최저임금은 4대보험 공제 전 세전 임금 기준입니다. 4대보험 근로자 부담분은 세전 임금에서 공제하는 것이 원칙이며, 세후 실수령으로 최저임금 충족 여부를 판단하면 안 됩니다.",
  },
  {
    question: "주휴수당을 안 줘도 되는 경우가 있나요?",
    answer: "주 소정근로시간 15시간 미만 초단시간 근로자, 개인사업자·프리랜서 계약자(근로자성 별도 판단 필요)는 주휴수당 미발생 대상입니다. 사업장 규모와 무관하게 조건이 충족되면 지급 의무가 있습니다.",
  },
];
```

---

## 6. 계산 로직

### 6-1. 주휴수당 발생 판단

```js
const isHolidayEligible = weeklyHours >= WEEKLY_HOLIDAY_MIN_HOURS; // 15시간 이상

// 주휴시간(주) = (주 소정근로시간 / 40) × 8 — 단, 상한 8시간
const weeklyHolidayHours = isHolidayEligible
  ? Math.min(weeklyHours / 40, 1) * 8
  : 0;

// 주휴수당(주)
const weeklyHolidayPayWeek = weeklyHolidayHours * hourlyWage;
```

### 6-2. 월 환산

```js
const MONTHLY_WEEKS = 365 / 7 / 12; // ≈ 4.3452

// 월 소정근로시간
const monthlyScheduledHours = weeklyHours * MONTHLY_WEEKS;

// 월 주휴시간
const monthlyHolidayHours = weeklyHolidayHours * MONTHLY_WEEKS;

// 월급 (세전)
const monthlyGrossWithHoliday = (monthlyScheduledHours + monthlyHolidayHours) * hourlyWage;
const monthlyGrossWithout     = monthlyScheduledHours * hourlyWage;
const monthlyGross = includeWeeklyHoliday ? monthlyGrossWithHoliday : monthlyGrossWithout;
```

### 6-3. 환산 금액

```js
const dailyGross  = dailyHours * hourlyWage;
const weeklyGross = weeklyHours * hourlyWage
  + (includeWeeklyHoliday ? weeklyHolidayPayWeek : 0);
const annualGross = monthlyGross * 12;
```

### 6-4. 4대보험 공제

```js
const nationalPension     = monthlyGross * INSURANCE_RATES.nationalPension;
const healthInsurance     = monthlyGross * INSURANCE_RATES.healthInsurance;
const longTermCare        = healthInsurance * INSURANCE_RATES.longTermCareRatio;
const employmentInsurance = monthlyGross * INSURANCE_RATES.employmentInsurance;
const totalInsurance      = nationalPension + healthInsurance + longTermCare + employmentInsurance;
```

### 6-5. 소득세 추정

```js
// 비과세 식대 공제 후 과세 소득
const taxableIncome = Math.max(0, monthlyGross - NONTAX_MEAL);

// 간이세액표에서 구간 조회 (부양가족 0인)
const bracket = INCOME_TAX_BRACKETS.find(
  b => taxableIncome >= b.minIncome && taxableIncome < b.maxIncome
);
const incomeTax = bracket ? bracket.monthlyTax : 0;
const localTax  = Math.round(incomeTax * 0.1);
```

### 6-6. 세후 실수령

```js
const totalDeduction = totalInsurance + incomeTax + localTax;
const monthlyNet = Math.max(0, monthlyGross - totalDeduction);
const annualNet  = monthlyNet * 12;
```

### 6-7. 실질 시급

```js
// 주휴수당 포함 환산 시급 (받는 돈 기준)
const effectiveHourly = weeklyHours > 0
  ? monthlyGross / (monthlyScheduledHours)  // 실질 시간당 단가
  : hourlyWage;
// 더 직관적 표현: weeklyGross / weeklyHours
const effectiveHourlySimple = weeklyHours > 0
  ? weeklyGross / weeklyHours
  : hourlyWage;
```

> 구현 시 `weeklyGross / weeklyHours` 방식(주 기준 직관)과 `monthlyGross / monthlyScheduledHours` 방식(월 기준 정밀) 중 선택. 기획에서는 "주 기준" 방식을 권장.

### 6-8. 최저임금 충족 판단

```js
// hourlyMode === "manual" 일 때만 판단
const isCompliant = hourlyWage >= MINIMUM_WAGE_2026;
const deficit     = Math.max(0, MINIMUM_WAGE_2026 - hourlyWage);
// deficit > 0 → 월 미달액 = deficit * monthlyScheduledHours (근사)
const monthlyDeficit = deficit * (monthlyScheduledHours + monthlyHolidayHours);
```

### 6-9. 예외 처리

```text
- hourlyWage <= 0       → "시급을 입력해 주세요" 안내, 계산 중단
- weeklyHours <= 0      → "주 근로시간을 입력해 주세요" 안내
- weeklyHours > 40      → "주 소정근로시간 40시간 초과 입력 — 연장근로는 별도 계산기에서 확인하세요" 안내
- isTraineePeriod && hourlyMode === "auto"
                        → 수습 시급 = MINIMUM_WAGE_2026 * 0.9 적용
```

---

## 7. DOM 계약

### 7-1. 루트

```html
<div class="mwc-page" data-mwc-calculator>
```

### 7-2. 입력 (data-mwc-input)

| 속성값 | 요소 타입 | 역할 |
|--------|----------|------|
| `data-mwc-hourly-mode` | `select` | auto / manual |
| `data-mwc-hourly-wage` | `input[number]` | 시급 (원) |
| `data-mwc-weekly-hours` | `input[number]` | 주 소정근로시간 |
| `data-mwc-daily-hours` | `input[number]` | 1일 근무시간 |
| `data-mwc-weekly-days` | `input[number]` | 주 근무일수 |
| `data-mwc-include-holiday` | `input[checkbox]` | 주휴수당 포함 |
| `data-mwc-deduction-mode` | `select` | estimated / none / custom |
| `data-mwc-custom-rate` | `input[number]` | 직접 공제율 (%) |
| `data-mwc-trainee` | `input[checkbox]` | 수습 기간 여부 |

### 7-3. 출력 (data-mwc-output)

| 속성값 | 역할 |
|--------|------|
| `data-mwc-effective-hourly` | 실질 시급 |
| `data-mwc-daily-gross` | 일급 |
| `data-mwc-weekly-gross` | 주급 |
| `data-mwc-monthly-gross` | 월급 (세전) |
| `data-mwc-annual-gross` | 연봉 (세전) |
| `data-mwc-holiday-week` | 주휴수당 (주) |
| `data-mwc-holiday-month` | 주휴수당 (월) |
| `data-mwc-national-pension` | 국민연금 |
| `data-mwc-health-insurance` | 건강보험 |
| `data-mwc-long-term-care` | 장기요양 |
| `data-mwc-employment-insurance` | 고용보험 |
| `data-mwc-income-tax` | 소득세 추정 |
| `data-mwc-total-deduction` | 공제 합계 |
| `data-mwc-monthly-net` | 세후 실수령 (월) |
| `data-mwc-annual-net` | 세후 실수령 (연) |
| `data-mwc-compliance-badge` | 최저임금 충족 배지 |
| `data-mwc-deficit-amount` | 미달액 (수동 모드) |
| `data-mwc-holiday-note` | 주휴수당 발생/미발생 안내 |

### 7-4. 동적 표시 제어

| 요소 | 조건 |
|------|------|
| `[data-mwc-hourly-field]` | hourlyMode === "manual" 시 표시 |
| `[data-mwc-custom-rate-field]` | deductionMode === "custom" 시 표시 |
| `[data-mwc-trainee-field]` | hourlyMode === "manual" 시 표시 |
| `[data-mwc-compliance-section]` | hourlyMode === "manual" 시 표시 |
| `[data-mwc-deficit-banner]` | manual 모드 + hourlyWage < MINIMUM_WAGE_2026 |
| `[data-mwc-holiday-warning]` | weeklyHours < 15 |

---

## 8. Astro 페이지 구조

파일: `src/pages/tools/minimum-wage-2026.astro`

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import ToolActionBar from "../../components/ToolActionBar.astro";
import SimpleToolShell from "../../components/SimpleToolShell.astro";
import {
  MINIMUM_WAGE_2026,
  MWC_PRESETS,
  MWC_RELATED_CALCULATORS,
  MWC_FAQS,
} from "../../data/minimumWage2026";

const config = { minimumWage: MINIMUM_WAGE_2026, presets: MWC_PRESETS };
---
```

스크립트 주입:

```astro
<script id="mwcConfig" type="application/json" set:html={JSON.stringify(config)}></script>
<script src="/scripts/minimum-wage-2026.js" defer></script>
```

---

## 9. Astro 마크업 구조 (aside 입력 패널)

```astro
<Fragment slot="aside">
  <div class="mwc-aside-stack" data-mwc-calculator>

    <!-- 프리셋 버튼 -->
    <div class="mwc-preset-grid">
      {MWC_PRESETS.map(p => (
        <button class="mwc-preset-btn" data-mwc-preset={p.id}>{p.label}</button>
      ))}
    </div>

    <!-- 기본 설정 패널 -->
    <article class="panel">
      <div class="panel-heading">...</div>
      <div class="form-grid form-grid--compact">

        <!-- 시급 모드 선택 -->
        <label class="field">
          <span>시급 입력 방식</span>
          <select data-mwc-hourly-mode>
            <option value="auto">2026 최저임금 자동 ({MINIMUM_WAGE_2026}원)</option>
            <option value="manual">직접 입력</option>
          </select>
        </label>

        <!-- 직접 입력 시급 (조건부) -->
        <label class="field" data-mwc-hourly-field>
          <span>시급 (원)</span>
          <input data-mwc-hourly-wage type="number" min="0" step="10" class="input-number" />
          <small>최저임금 충족 여부를 즉시 확인합니다.</small>
        </label>

        <!-- 주 소정근로시간 -->
        <label class="field">
          <span>주 소정근로시간</span>
          <input data-mwc-weekly-hours type="number" min="1" max="40" step="0.5"
            value="40" class="input-number" />
          <small>계약서상 1주 근무 시간 (1~40시간)</small>
        </label>

        <!-- 1일 근무시간 -->
        <label class="field">
          <span>1일 근무시간</span>
          <input data-mwc-daily-hours type="number" min="1" max="12" step="0.5"
            value="8" class="input-number" />
        </label>

        <!-- 주휴수당 포함 -->
        <label class="field field--toggle">
          <span>주휴수당 포함</span>
          <input type="checkbox" data-mwc-include-holiday checked />
          <small data-mwc-holiday-note>주 15시간 이상 시 자동 발생</small>
        </label>

        <!-- 세후 공제 방식 -->
        <label class="field">
          <span>4대보험·세금 공제</span>
          <select data-mwc-deduction-mode>
            <option value="estimated">간편 추정 (자동)</option>
            <option value="none">공제 없이 세전만</option>
            <option value="custom">직접 공제율 입력</option>
          </select>
        </label>

        <!-- 직접 공제율 (조건부) -->
        <label class="field" data-mwc-custom-rate-field>
          <span>공제율 (%)</span>
          <input data-mwc-custom-rate type="number" min="0" max="50" step="0.1"
            value="9.4" class="input-number" />
        </label>

        <!-- 수습 기간 (수동 모드에서만) -->
        <label class="field field--toggle" data-mwc-trainee-field>
          <span>수습 기간 (90% 적용)</span>
          <input type="checkbox" data-mwc-trainee />
          <small>1년 이상 계약 + 3개월 이내 수습 시</small>
        </label>

      </div>
    </article>
  </div>
</Fragment>
```

---

## 10. 결과 영역 마크업 구조

```astro
<!-- KPI 카드 4개 -->
<div class="mwc-kpi-grid" aria-live="polite">
  <article class="mwc-kpi-card mwc-kpi-card--main">
    <span>세후 실수령 (월)</span>
    <strong data-mwc-monthly-net>-</strong>
    <small>4대보험·소득세 공제 후 추정</small>
  </article>
  <article class="mwc-kpi-card">
    <span>월급 (세전)</span>
    <strong data-mwc-monthly-gross>-</strong>
    <small>주휴수당 포함 기준</small>
  </article>
  <article class="mwc-kpi-card">
    <span>실질 시급</span>
    <strong data-mwc-effective-hourly>-</strong>
    <small>주휴수당 포함 환산</small>
  </article>
  <article class="mwc-kpi-card" data-mwc-compliance-section>
    <span>최저임금 충족</span>
    <strong data-mwc-compliance-badge>-</strong>
    <small>2026 최저임금 기준</small>
  </article>
</div>

<!-- 환산 요약 테이블 -->
<div class="mwc-table-wrap">
  <table class="mwc-summary-table">
    <thead>
      <tr><th>기간</th><th>세전</th><th>세후 (추정)</th></tr>
    </thead>
    <tbody>
      <tr><td>시간</td><td data-mwc-effective-hourly>-</td><td>-</td></tr>
      <tr><td>일</td><td data-mwc-daily-gross>-</td><td>-</td></tr>
      <tr><td>주</td><td data-mwc-weekly-gross>-</td><td>-</td></tr>
      <tr class="is-highlight"><td>월</td><td data-mwc-monthly-gross>-</td><td data-mwc-monthly-net>-</td></tr>
      <tr><td>연</td><td data-mwc-annual-gross>-</td><td data-mwc-annual-net>-</td></tr>
    </tbody>
  </table>
</div>

<!-- 공제 상세 카드 -->
<div class="mwc-deduction-card">
  <h3>월 공제 상세</h3>
  <ul class="mwc-deduction-list">
    <li><span>국민연금</span><strong data-mwc-national-pension>-</strong></li>
    <li><span>건강보험</span><strong data-mwc-health-insurance>-</strong></li>
    <li><span>장기요양</span><strong data-mwc-long-term-care>-</strong></li>
    <li><span>고용보험</span><strong data-mwc-employment-insurance>-</strong></li>
    <li><span>소득세 추정</span><strong data-mwc-income-tax>-</strong></li>
    <li class="is-total"><span>공제 합계</span><strong data-mwc-total-deduction>-</strong></li>
  </ul>
</div>

<!-- 최저임금 미달 경고 배너 (조건부) -->
<div class="mwc-deficit-banner" data-mwc-deficit-banner hidden>
  <p>입력하신 시급은 2026 최저임금 미달입니다.</p>
  <p>월 미달 추정액: <strong data-mwc-deficit-amount>-</strong></p>
  <a href="https://minwon.moel.go.kr" target="_blank" rel="noopener">고용노동부 신고 방법 보기</a>
</div>
```

---

## 11. 클라이언트 스크립트 설계

파일: `public/scripts/minimum-wage-2026.js`

```js
(function () {
  const root = document.querySelector(".mwc-page");
  const configNode = document.getElementById("mwcConfig");
  if (!root || !configNode) return;

  const { minimumWage, presets } = JSON.parse(configNode.textContent || "{}");
  const MONTHLY_WEEKS = 365 / 7 / 12;
  const NONTAX_MEAL   = 200_000;

  const INSURANCE = {
    nationalPension:     0.045,
    healthInsurance:     0.03545,
    longTermCareRatio:   0.1295,
    employmentInsurance: 0.009,
  };

  // 간이세액표 (부양가족 0인, 월 과세소득 기준)
  const TAX_TABLE = [
    { min: 0,         max: 1_060_000, tax: 0 },
    { min: 1_060_000, max: 1_500_000, tax: 19_520 },
    { min: 1_500_000, max: 3_000_000, tax: 62_010 },
    { min: 3_000_000, max: 4_500_000, tax: 152_960 },
    { min: 4_500_000, max: Infinity,  tax: 298_010 },
  ];

  const formatter = new Intl.NumberFormat("ko-KR");
  let monthlySalaryTouched = false; // 미사용 (이 계산기는 시급 기준)

  function q(sel) { return root.querySelector(sel); }
  function parseNum(v) { return Number(String(v ?? "").replace(/[^\d.]/g, "")) || 0; }
  function fmt(n)  { return `${formatter.format(Math.round(n || 0))}원`; }
  function setText(sel, val) { const el = q(sel); if (el) el.textContent = val; }

  function readState() {
    const hourlyMode    = q("[data-mwc-hourly-mode]")?.value || "auto";
    const manualWage    = parseNum(q("[data-mwc-hourly-wage]")?.value);
    const isTrainee     = Boolean(q("[data-mwc-trainee]")?.checked);
    const weeklyHours   = Math.max(0, Math.min(40, parseNum(q("[data-mwc-weekly-hours]")?.value) || 40));
    const dailyHours    = Math.max(0, parseNum(q("[data-mwc-daily-hours]")?.value) || 8);
    const includeHoliday = Boolean(q("[data-mwc-include-holiday]")?.checked);
    const deductionMode = q("[data-mwc-deduction-mode]")?.value || "estimated";
    const customRate    = parseNum(q("[data-mwc-custom-rate]")?.value) / 100;

    let hourlyWage = hourlyMode === "auto" ? minimumWage : manualWage;
    if (isTrainee && hourlyMode === "manual") hourlyWage = hourlyWage * 0.9;

    return { hourlyMode, hourlyWage, weeklyHours, dailyHours,
             includeHoliday, deductionMode, customRate, isTrainee,
             isManual: hourlyMode === "manual" };
  }

  function calculate(s) {
    const { hourlyWage, weeklyHours, dailyHours, includeHoliday } = s;

    // 주휴수당
    const isHolidayEligible = weeklyHours >= 15;
    const weeklyHolidayHours = isHolidayEligible ? Math.min(weeklyHours / 40, 1) * 8 : 0;
    const weeklyHolidayPayWeek = weeklyHolidayHours * hourlyWage;

    // 월 환산
    const monthlyScheduledHours = weeklyHours * MONTHLY_WEEKS;
    const monthlyHolidayHours   = weeklyHolidayHours * MONTHLY_WEEKS;

    const monthlyGrossBase    = monthlyScheduledHours * hourlyWage;
    const monthlyHolidayPay   = monthlyHolidayHours * hourlyWage;
    const monthlyGross        = monthlyGrossBase + (includeHoliday ? monthlyHolidayPay : 0);

    // 기간별 세전
    const dailyGross  = dailyHours * hourlyWage;
    const weeklyGross = weeklyHours * hourlyWage + (includeHoliday ? weeklyHolidayPayWeek : 0);
    const annualGross = monthlyGross * 12;

    // 실질 시급
    const effectiveHourly = weeklyHours > 0 ? weeklyGross / weeklyHours : hourlyWage;

    // 4대보험
    const np  = monthlyGross * INSURANCE.nationalPension;
    const hi  = monthlyGross * INSURANCE.healthInsurance;
    const ltc = hi * INSURANCE.longTermCareRatio;
    const ei  = monthlyGross * INSURANCE.employmentInsurance;
    const totalInsurance = np + hi + ltc + ei;

    // 소득세
    const taxable  = Math.max(0, monthlyGross - NONTAX_MEAL);
    const bracket  = TAX_TABLE.find(b => taxable >= b.min && taxable < b.max);
    const incomeTax = bracket ? bracket.tax : 0;
    const localTax  = Math.round(incomeTax * 0.1);

    // 공제 합산 (방식별)
    let totalDeduction;
    if (s.deductionMode === "none")   totalDeduction = 0;
    else if (s.deductionMode === "custom") totalDeduction = monthlyGross * s.customRate;
    else totalDeduction = totalInsurance + incomeTax + localTax;

    const monthlyNet = Math.max(0, monthlyGross - totalDeduction);
    const annualNet  = monthlyNet * 12;

    // 최저임금 판단
    const isCompliant    = hourlyWage >= minimumWage;
    const deficit        = Math.max(0, minimumWage - hourlyWage);
    const monthlyDeficit = deficit * (monthlyScheduledHours + (includeHoliday ? monthlyHolidayHours : 0));

    return {
      effectiveHourly, dailyGross, weeklyGross,
      monthlyGross, annualGross,
      weeklyHolidayPayWeek, monthlyHolidayPay,
      isHolidayEligible,
      np, hi, ltc, ei, totalInsurance,
      incomeTax, localTax, totalDeduction,
      monthlyNet, annualNet,
      isCompliant, deficit, monthlyDeficit,
    };
  }

  function render(s, r) {
    // KPI
    setText("[data-mwc-monthly-net]",      fmt(r.monthlyNet));
    setText("[data-mwc-monthly-gross]",    fmt(r.monthlyGross));
    setText("[data-mwc-effective-hourly]", fmt(r.effectiveHourly));

    // 환산 테이블
    setText("[data-mwc-daily-gross]",  fmt(r.dailyGross));
    setText("[data-mwc-weekly-gross]", fmt(r.weeklyGross));
    setText("[data-mwc-annual-gross]", fmt(r.annualGross));
    setText("[data-mwc-annual-net]",   fmt(r.annualNet));

    // 주휴수당
    setText("[data-mwc-holiday-week]",  fmt(r.weeklyHolidayPayWeek));
    setText("[data-mwc-holiday-month]", fmt(r.monthlyHolidayPay));

    // 공제 상세
    setText("[data-mwc-national-pension]",      fmt(r.np));
    setText("[data-mwc-health-insurance]",      fmt(r.hi));
    setText("[data-mwc-long-term-care]",        fmt(r.ltc));
    setText("[data-mwc-employment-insurance]",  fmt(r.ei));
    setText("[data-mwc-income-tax]",            fmt(r.incomeTax + r.localTax));
    setText("[data-mwc-total-deduction]",       fmt(r.totalDeduction));

    // 최저임금 충족 배지
    const badge = q("[data-mwc-compliance-badge]");
    if (badge && s.isManual) {
      badge.textContent = r.isCompliant ? "충족" : "미달";
      badge.className   = r.isCompliant ? "mwc-badge mwc-badge--ok" : "mwc-badge mwc-badge--warn";
    }

    // 최저임금 미달 배너
    const deficitBanner = q("[data-mwc-deficit-banner]");
    if (deficitBanner) {
      deficitBanner.hidden = !(s.isManual && !r.isCompliant);
      setText("[data-mwc-deficit-amount]", fmt(r.monthlyDeficit));
    }

    // 주휴 안내
    const holidayNote = q("[data-mwc-holiday-note]");
    if (holidayNote) {
      holidayNote.textContent = r.isHolidayEligible
        ? `주휴수당 발생 (주 ${s.weeklyHours}시간 ≥ 15시간)`
        : `주 15시간 미만 — 주휴수당 미발생`;
    }

    // 조건부 필드 표시
    toggleField("[data-mwc-hourly-field]",    s.isManual);
    toggleField("[data-mwc-trainee-field]",   s.isManual);
    toggleField("[data-mwc-custom-rate-field]", s.deductionMode === "custom");
    toggleField("[data-mwc-compliance-section]", s.isManual);
  }

  function toggleField(sel, visible) {
    const el = q(sel);
    if (el) el.hidden = !visible;
  }

  function applyPreset(id) {
    const p = (window._mwcPresets || []).find(x => x.id === id);
    if (!p) return;
    const modeEl = q("[data-mwc-hourly-mode]");
    if (modeEl) modeEl.value = p.hourlyMode;
    const wageEl = q("[data-mwc-hourly-wage]");
    if (wageEl) wageEl.value = p.hourlyWage;
    const whEl = q("[data-mwc-weekly-hours]");
    if (whEl) whEl.value = p.weeklyHours;
    const dhEl = q("[data-mwc-daily-hours]");
    if (dhEl) dhEl.value = p.dailyHours;
    const holEl = q("[data-mwc-include-holiday]");
    if (holEl) holEl.checked = p.includeWeeklyHoliday;
    update();
  }

  function update() {
    const s = readState();
    const r = calculate(s);
    render(s, r);
  }

  function reset() {
    const modeEl = q("[data-mwc-hourly-mode]");
    if (modeEl) modeEl.value = "auto";
    const whEl = q("[data-mwc-weekly-hours]");
    if (whEl) whEl.value = "40";
    const dhEl = q("[data-mwc-daily-hours]");
    if (dhEl) dhEl.value = "8";
    const holEl = q("[data-mwc-include-holiday]");
    if (holEl) holEl.checked = true;
    const dedEl = q("[data-mwc-deduction-mode]");
    if (dedEl) dedEl.value = "estimated";
    update();
  }

  function bindEvents() {
    root.addEventListener("input", update);
    root.addEventListener("change", update);
    root.querySelectorAll("[data-mwc-preset]").forEach(btn => {
      btn.addEventListener("click", () => applyPreset(btn.dataset.mwcPreset));
    });
    document.getElementById("mwcResetBtn")?.addEventListener("click", reset);
  }

  window._mwcPresets = presets || [];
  bindEvents();
  update();
})();
```

---

## 12. 스타일 설계

파일: `src/styles/scss/pages/_minimum-wage-2026.scss`

SCSS prefix: `mwc-`

주요 클래스:

```text
mwc-page
mwc-aside-stack
mwc-preset-grid / mwc-preset-btn
mwc-kpi-grid / mwc-kpi-card / mwc-kpi-card--main
mwc-table-wrap / mwc-summary-table
mwc-deduction-card / mwc-deduction-list
mwc-deficit-banner
mwc-badge / mwc-badge--ok / mwc-badge--warn
mwc-holiday-guide
mwc-related-grid / mwc-related-card
mwc-disclaimer
```

```scss
.mwc-page {

  .mwc-aside-stack {
    display: grid;
    gap: 16px;
  }

  .mwc-preset-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 4px;
  }

  .mwc-preset-btn {
    padding: 6px 14px;
    border: 1px solid #D1D5DB;
    border-radius: 999px;
    background: #F9FAFB;
    font-size: 13px;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;

    &:hover, &.is-active {
      border-color: #2563EB;
      background: #EFF6FF;
      color: #1D4ED8;
    }
  }

  .mwc-kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
    margin-bottom: 18px;
  }

  .mwc-kpi-card {
    padding: 16px 14px;
    border: 1px solid #E5E7EB;
    border-radius: 10px;
    background: #F9FAFB;

    span, small { display: block; font-size: 12px; color: #6B7280; }
    strong { display: block; margin: 6px 0 4px; font-size: 20px; line-height: 1.15; color: #111827; }
  }

  .mwc-kpi-card--main {
    border-color: #BFDBFE;
    background: #EFF6FF;
    strong { color: #1D4ED8; }
  }

  .mwc-table-wrap {
    overflow-x: auto;
    border: 1px solid #E5E7EB;
    border-radius: 10px;
    margin-bottom: 16px;
  }

  .mwc-summary-table {
    width: 100%;
    border-collapse: collapse;
    background: #FFFFFF;

    th, td {
      padding: 10px 14px;
      border-bottom: 1px solid #EEF0F3;
      font-size: 13px;
      text-align: left;
      white-space: nowrap;
    }

    th { background: #F7F6F4; color: #4B5563; font-weight: 700; }

    tr.is-highlight td { background: #F0F7FF; font-weight: 700; }
  }

  .mwc-deduction-card {
    padding: 16px;
    border: 1px solid #E5E7EB;
    border-radius: 10px;
    background: #FFFFFF;
    margin-bottom: 16px;

    h3 { margin: 0 0 12px; font-size: 14px; color: #374151; }
  }

  .mwc-deduction-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 6px;

    li {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: #4B5563;
      strong { color: #111827; }
    }

    li.is-total {
      padding-top: 8px;
      border-top: 1px solid #E5E7EB;
      font-weight: 700;
      color: #111827;
    }
  }

  .mwc-deficit-banner {
    padding: 14px 16px;
    border: 1px solid #FCA5A5;
    border-radius: 10px;
    background: #FEF2F2;
    margin-bottom: 16px;

    p { margin: 0 0 4px; font-size: 13px; color: #B91C1C; }
    a { font-size: 13px; color: #DC2626; font-weight: 600; }
  }

  .mwc-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 700;

    &--ok   { background: #D1FAE5; color: #065F46; }
    &--warn { background: #FEE2E2; color: #991B1B; }
  }

  .mwc-related-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .mwc-related-card {
    display: grid;
    gap: 6px;
    padding: 14px;
    border: 1px solid #E5E7EB;
    border-radius: 10px;
    background: #FFFFFF;
    text-decoration: none;
    color: inherit;

    strong { font-size: 14px; color: #1D4ED8; }
    span   { font-size: 12px; color: #6B7280; }

    &:hover { border-color: #BFDBFE; background: #F8FBFF; }
  }

  .mwc-disclaimer {
    margin: 12px 0 0;
    font-size: 12px;
    line-height: 1.6;
    color: #6B7280;
  }
}

@media (max-width: 920px) {
  .mwc-page {
    .mwc-kpi-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
}

@media (max-width: 640px) {
  .mwc-page {
    .mwc-kpi-grid        { grid-template-columns: 1fr; }
    .mwc-related-grid    { grid-template-columns: 1fr; }
  }
}
```

---

## 13. 접근성·사용성 기준

- 모든 `input`은 `label`과 연결한다.
- 조건부 표시 필드는 `hidden` 속성으로 DOM에 유지하되 숨긴다 (ARIA 고려).
- 결과 갱신 시 `aria-live="polite"` 영역에서 자동 안내.
- 최저임금 미달 배지는 색상 + 텍스트 함께 표시 (색상만 의존 금지).
- 숫자 입력 필드는 쉼표 포맷 없이 plain number 유지 (parseNumber로 정규화).

---

## 14. 안전 문구

상단 InfoNotice:

```text
이 계산기는 2026 최저임금 기준 시뮬레이션입니다. 실제 임금은 근로계약·단체협약·지급 방식에 따라 다를 수 있습니다.
4대보험과 소득세는 간편 추정값이며 실제 원천징수와 다를 수 있습니다.
주휴수당 발생 여부는 계약서상 소정근로시간 기준이며 실제 근무시간과 다를 수 있습니다.
```

결과 하단 disclaimer:

```text
예상 세후 금액은 간편 추정값입니다. 실제 통장 입금액은 부양가족, 비과세 항목, 연말정산 결과에 따라 달라질 수 있습니다.
```

---

## 15. QA 체크리스트

- [ ] 주 40시간 전일제: 월급 = 2026 최저임금 × 209시간
- [ ] 주 25시간 알바: 주휴수당 발생, (25/40)×8시간 주휴 포함 월급 계산 정확
- [ ] 주 10시간 알바: 주휴수당 미발생, 안내 문구 표시
- [ ] 주휴 포함/제외 토글 시 월급 금액 즉시 변경
- [ ] 수동 모드에서 최저임금 이상 입력 → 충족 배지 녹색
- [ ] 수동 모드에서 최저임금 미만 입력 → 미달 배지 적색 + 배너 표시
- [ ] 자동 모드에서는 충족 배지 섹션 hidden
- [ ] 공제 없음 모드: 세후 = 세전
- [ ] 직접 공제율 입력: 해당 비율 공제 후 실수령 표시
- [ ] 수습 기간 토글 (수동 모드): 시급 × 0.9 적용
- [ ] 프리셋 4개 클릭 시 입력값 정상 적용 후 계산
- [ ] 모바일 KPI 카드 1열, 테이블 가로 스크롤 정상
- [ ] `npm run build` 성공

---

## 16. 구현 순서

1. `src/data/minimumWage2026.ts` — 상수·타입·프리셋·FAQ·관련 링크 생성
2. `src/pages/tools/minimum-wage-2026.astro` — 정적 마크업 구현
3. `public/scripts/minimum-wage-2026.js` — 계산·렌더 로직 구현
4. `src/styles/scss/pages/_minimum-wage-2026.scss` — 스타일 구현
5. `src/data/tools.ts` — 등록
6. `src/styles/app.scss` — `@use` 추가
7. `public/sitemap.xml` — URL 추가
8. `npm run build` 및 QA 체크리스트 확인
