# 육아기 근로시간 단축 급여 계산기 설계 문서

> 기획 원문: `docs/plan/202606/childcare-short-time-pay-calculator-plan.md`  
> 작성일: 2026-06-20  
> 콘텐츠 유형: `/tools/` 정책형 급여 계산기  
> 구현 기준: 기존 육아 정책 계산기군과 중복되지 않도록 `단축근무 월급 + 고용보험 급여` 산정에 집중한다.

---

## 1. 문서 개요

- 구현 대상: `육아기 근로시간 단축 급여 계산기`
- slug: `childcare-short-time-pay-calculator`
- URL: `/tools/childcare-short-time-pay-calculator/`
- 카테고리: 육아·복지
- 핵심 검색 의도: `육아기 근로시간 단축 급여 계산기`, `육아기 단축근무 급여 계산`, `육아기 근로시간 단축 월급`, `단축근무 고용보험 급여`
- 핵심 출력: 회사 지급 예상 임금, 고용보험 급여 예상액, 합산 월수령 예상액, 기존 대비 차이, 최초 10시간/추가 단축분 급여 분해
- 안전 장치: 결과는 `세전 모의계산`으로 표시하고, 실제 지급액은 고용보험 심사와 회사 통상임금 산정 방식에 따라 달라질 수 있음을 반복 안내한다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    childcareShortTimePay.ts
  pages/
    tools/
      childcare-short-time-pay-calculator.astro

public/
  scripts/
    childcare-short-time-pay-calculator.js

src/styles/scss/pages/
  _childcare-short-time-pay-calculator.scss
```

추가 등록 필수:

- `src/data/tools.ts`
- `src/styles/app.scss`에 `@use 'scss/pages/childcare-short-time-pay-calculator';`
- `public/sitemap.xml`

선택 등록:

- `src/pages/index.astro` 육아·복지 계산기 영역 노출
- `src/pages/tools/index.astro` 육아 카테고리 노출
- 관련 계산기 하단 CTA 추가
  - `src/pages/tools/parental-leave-pay.astro`
  - `src/pages/tools/parental-leave-short-work-calculator.astro`
  - `src/pages/tools/single-parental-leave-total.astro`
  - `src/pages/tools/six-plus-six.astro`
- `public/og/tools/childcare-short-time-pay-calculator.png`

---

## 3. 기존 페이지와 역할 분리

### 3-1. 이번 페이지의 집중 범위

이번 페이지는 아래 질문 하나에 강하게 답한다.

> 육아기 근로시간 단축을 쓰면 월급과 고용보험 급여를 합쳐 얼마를 받을까?

범위에 포함:

- 월 통상임금 기준 단축급여 계산
- 회사 지급 예상 임금 계산
- 고용보험 급여 예상액 계산
- 주 근로시간별 시나리오 비교
- 기간 총액 계산
- 계산식과 상한/하한 적용 설명

범위에서 제외:

- 육아휴직 12개월/18개월 자격 판정
- 미사용 육아휴직 기간의 단축근무 전환 계산
- 부부 사용 전략
- 회차별 사용 이력 관리
- 월별 육아휴직 타임라인

위 제외 범위는 기존 `parental-leave-short-work-calculator`로 연결한다.

### 3-2. 내부 링크 흐름

```text
parental-leave-short-work-calculator
  └─ 단축근무 급여 자세히 보기
      └─ childcare-short-time-pay-calculator
            ├─ 육아휴직 급여 계산기
            ├─ 6+6 육아휴직 급여 계산기
            └─ 출산~육아 지원금 총액 계산기
```

---

## 4. 레이아웃 방향

### 4-1. 권장 쉘

`BaseLayout` 직접 구성 또는 `SimpleToolShell` 기반 중 하나를 선택한다.

권장: `BaseLayout` 직접 구성

이유:

- 첫 화면에 입력 패널과 KPI 결과를 촘촘하게 배치해야 한다.
- 단축시간 분해 바, 산식 카드, 시나리오 테이블이 필요하다.
- 기존 육아 정책 계산기들과 구분되는 단일 급여 계산 UI가 필요하다.

### 4-2. 클래스 prefix

- page class: `cstp-page`
- component prefix: `cstp-`
- calculator id: `childcare-short-time-pay-calculator`

### 4-3. 페이지 IA

1. `SiteHeader`
2. Hero
3. 정책 기준 `InfoNotice`
4. 계산기 입력 + 결과 그리드
5. 핵심 결과 KPI
6. 단축시간 분해 바
7. 급여 산식 카드
8. 기간 총액 표
9. 단축 후 주 근로시간별 비교표
10. 신청 전 체크 카드
11. 관련 계산기 링크
12. `SeoContent`

---

## 5. 데이터 모델

파일: `src/data/childcareShortTimePay.ts`

```ts
export type CompanyPayMode = "AUTO" | "MANUAL";

export type ResultTone = "normal" | "caution" | "error";

export interface ChildcareShortTimePayPolicy {
  year: number;
  sourceCheckedAt: string;
  sourceLabel: string;
  sourceUrl: string;
  firstTenHoursCapWage: number;
  extraHoursCapWage: number;
  minimumMonthlySupport: number;
  minWeeklyHoursAfter: number;
  maxWeeklyHoursAfter: number;
  defaultWeeklyHoursBefore: number;
  defaultWeeklyHoursAfter: number;
}

export interface ChildcareShortTimePayInput {
  monthlyOrdinaryWage: number;
  weeklyHoursBefore: number;
  weeklyHoursAfter: number;
  plannedMonths: number;
  companyPayMode: CompanyPayMode;
  manualCompanyPay: number | null;
}

export interface ChildcareShortTimePayResult {
  reducedWeeklyHours: number;
  firstTenHours: number;
  extraHours: number;
  reductionRate: number;
  companyPay: number;
  autoCompanyPay: number;
  governmentSupport: number;
  firstTenSupport: number;
  extraSupport: number;
  supportBeforeMinimum: number;
  minimumApplied: boolean;
  firstTenCapApplied: boolean;
  extraCapApplied: boolean;
  estimatedMonthlyTotal: number;
  monthlyDelta: number;
  replacementRate: number;
  totalCompanyPay: number;
  totalGovernmentSupport: number;
  totalReceived: number;
  totalOriginal: number;
  totalDelta: number;
  warnings: string[];
  tone: ResultTone;
}

export interface ChildcareShortTimePreset {
  label: string;
  weeklyHoursBefore: number;
  weeklyHoursAfter: number;
  description: string;
}

export interface ChildcareShortTimeScenarioRow {
  label: string;
  weeklyHoursAfter: number;
  reducedWeeklyHours: number;
  companyPay: number;
  governmentSupport: number;
  estimatedMonthlyTotal: number;
  monthlyDelta: number;
  replacementRate: number;
}

export interface RelatedToolLink {
  href: string;
  label: string;
  description: string;
}

export interface ChildcareShortTimeFaq {
  question: string;
  answer: string;
}
```

### 5-1. 정책 상수

```ts
export const CHILDCARE_SHORT_TIME_PAY_POLICY: ChildcareShortTimePayPolicy = {
  year: 2026,
  sourceCheckedAt: "2026-06-20",
  sourceLabel: "고용24 육아기 근로시간 단축 급여 안내",
  sourceUrl: "https://www.work24.go.kr/",
  firstTenHoursCapWage: 2_500_000,
  extraHoursCapWage: 1_600_000,
  minimumMonthlySupport: 500_000,
  minWeeklyHoursAfter: 15,
  maxWeeklyHoursAfter: 35,
  defaultWeeklyHoursBefore: 40,
  defaultWeeklyHoursAfter: 30,
};
```

### 5-2. 기본 입력값

```ts
export const DEFAULT_CHILDCARE_SHORT_TIME_INPUT: ChildcareShortTimePayInput = {
  monthlyOrdinaryWage: 3_000_000,
  weeklyHoursBefore: 40,
  weeklyHoursAfter: 30,
  plannedMonths: 12,
  companyPayMode: "AUTO",
  manualCompanyPay: null,
};
```

### 5-3. 프리셋

```ts
export const CHILDCARE_SHORT_TIME_PRESETS: ChildcareShortTimePreset[] = [
  { label: "40→35", weeklyHoursBefore: 40, weeklyHoursAfter: 35, description: "하루 1시간 단축에 가까운 가벼운 단축" },
  { label: "40→30", weeklyHoursBefore: 40, weeklyHoursAfter: 30, description: "최초 10시간 단축분만 적용되는 대표 사례" },
  { label: "40→25", weeklyHoursBefore: 40, weeklyHoursAfter: 25, description: "최초 10시간과 추가 5시간 단축분 혼합" },
  { label: "40→20", weeklyHoursBefore: 40, weeklyHoursAfter: 20, description: "반일 근무에 가까운 강한 단축" },
  { label: "40→15", weeklyHoursBefore: 40, weeklyHoursAfter: 15, description: "제도상 하한 근로시간에 가까운 단축" },
];
```

---

## 6. 계산 로직 상세

### 6-1. 순수 함수 위치

계산 함수는 1차 구현에서 클라이언트 JS에 둔다.

권장 함수:

```js
function calculateShortTimePay(input, policy) {}
function calculateScenarioRows(input, policy) {}
function validateInput(input, policy) {}
function formatWon(value) {}
function formatManwon(value) {}
function formatPercent(value) {}
```

TypeScript 데이터 파일에는 정책 상수와 문구 데이터만 둔다. 추후 테스트를 강화할 때 계산 로직을 `src/data` 또는 별도 util로 옮길 수 있다.

### 6-2. 입력 정규화

```js
function normalizeInput(raw) {
  return {
    monthlyOrdinaryWage: clamp(toNumber(raw.monthlyOrdinaryWage), 500000, 15000000),
    weeklyHoursBefore: clamp(toNumber(raw.weeklyHoursBefore), 15, 52),
    weeklyHoursAfter: clamp(toNumber(raw.weeklyHoursAfter), 0, 52),
    plannedMonths: clamp(toNumber(raw.plannedMonths), 1, 36),
    companyPayMode: raw.companyPayMode === "MANUAL" ? "MANUAL" : "AUTO",
    manualCompanyPay: raw.manualCompanyPay ? Math.max(toNumber(raw.manualCompanyPay), 0) : null,
  };
}
```

### 6-3. 입력 검증

경고는 계산을 완전히 막지 않는다. 다만 단축 전후 시간이 같거나 역전된 경우는 결과 톤을 `error`로 둔다.

```js
function validateInput(input, policy) {
  const warnings = [];

  if (input.weeklyHoursAfter >= input.weeklyHoursBefore) {
    warnings.push("단축 후 주 근로시간은 단축 전보다 작아야 합니다.");
  }

  if (input.weeklyHoursAfter < policy.minWeeklyHoursAfter) {
    warnings.push("단축 후 주 근로시간이 15시간 미만입니다. 실제 신청 가능 여부를 고용센터와 회사에 확인하세요.");
  }

  if (input.weeklyHoursAfter > policy.maxWeeklyHoursAfter) {
    warnings.push("단축 후 주 근로시간이 35시간을 초과했습니다. 육아기 근로시간 단축 제도 범위를 다시 확인하세요.");
  }

  if (input.companyPayMode === "MANUAL" && input.manualCompanyPay === null) {
    warnings.push("회사 지급액 직접 입력 모드에서는 단축 후 회사 지급 예상액을 입력해야 합니다.");
  }

  return warnings;
}
```

### 6-4. 단축시간 분해

```js
const reducedWeeklyHours = Math.max(input.weeklyHoursBefore - input.weeklyHoursAfter, 0);
const firstTenHours = Math.min(reducedWeeklyHours, 10);
const extraHours = Math.max(reducedWeeklyHours - 10, 0);
const reductionRate = input.weeklyHoursBefore > 0
  ? reducedWeeklyHours / input.weeklyHoursBefore
  : 0;
```

### 6-5. 회사 지급 예상 임금

```js
const autoCompanyPay = input.monthlyOrdinaryWage
  * (input.weeklyHoursAfter / input.weeklyHoursBefore);

const companyPay = input.companyPayMode === "MANUAL" && input.manualCompanyPay !== null
  ? input.manualCompanyPay
  : autoCompanyPay;
```

### 6-6. 고용보험 급여

```js
const firstTenRaw = input.monthlyOrdinaryWage
  * (firstTenHours / input.weeklyHoursBefore);

const firstTenCap = policy.firstTenHoursCapWage
  * (firstTenHours / input.weeklyHoursBefore);

const firstTenSupport = Math.min(firstTenRaw, firstTenCap);

const extraRaw = input.monthlyOrdinaryWage
  * 0.8
  * (extraHours / input.weeklyHoursBefore);

const extraCap = policy.extraHoursCapWage
  * (extraHours / input.weeklyHoursBefore);

const extraSupport = Math.min(extraRaw, extraCap);

const supportBeforeMinimum = firstTenSupport + extraSupport;

const governmentSupport = reducedWeeklyHours > 0
  ? Math.max(supportBeforeMinimum, policy.minimumMonthlySupport)
  : 0;

const minimumApplied = reducedWeeklyHours > 0
  && governmentSupport === policy.minimumMonthlySupport
  && supportBeforeMinimum < policy.minimumMonthlySupport;

const firstTenCapApplied = firstTenRaw > firstTenCap;
const extraCapApplied = extraRaw > extraCap;
```

### 6-7. 총액 계산

```js
const estimatedMonthlyTotal = companyPay + governmentSupport;
const monthlyDelta = estimatedMonthlyTotal - input.monthlyOrdinaryWage;
const replacementRate = input.monthlyOrdinaryWage > 0
  ? estimatedMonthlyTotal / input.monthlyOrdinaryWage
  : 0;

const totalCompanyPay = companyPay * input.plannedMonths;
const totalGovernmentSupport = governmentSupport * input.plannedMonths;
const totalReceived = estimatedMonthlyTotal * input.plannedMonths;
const totalOriginal = input.monthlyOrdinaryWage * input.plannedMonths;
const totalDelta = totalReceived - totalOriginal;
```

### 6-8. 결과 톤

```js
let tone = "normal";
if (warnings.length > 0) tone = "caution";
if (input.weeklyHoursAfter >= input.weeklyHoursBefore) tone = "error";
```

---

## 7. Astro 페이지 구조

파일: `src/pages/tools/childcare-short-time-pay-calculator.astro`

### 7-1. import

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import ToolActionBar from "../../components/ToolActionBar.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  CHILDCARE_SHORT_TIME_PAY_POLICY,
  CHILDCARE_SHORT_TIME_PRESETS,
  CHILDCARE_SHORT_TIME_FAQ,
  CHILDCARE_SHORT_TIME_RELATED_LINKS,
  childcareShortTimePayMeta,
} from "../../data/childcareShortTimePay";
---
```

### 7-2. BaseLayout

```astro
<BaseLayout
  title="육아기 근로시간 단축 급여 계산기｜단축근무 월급·고용보험 급여 예상"
  description="월 통상임금과 단축 전후 주 근로시간을 입력하면 육아기 근로시간 단축 시 회사 지급 임금, 고용보험 급여, 예상 월수령액과 기존 대비 감소액을 계산합니다."
>
```

### 7-3. 데이터 주입

```astro
<script
  id="cstp-data"
  type="application/json"
  set:html={JSON.stringify({
    policy: CHILDCARE_SHORT_TIME_PAY_POLICY,
    presets: CHILDCARE_SHORT_TIME_PRESETS,
  })}
/>
<script src="/scripts/childcare-short-time-pay-calculator.js" defer></script>
```

---

## 8. DOM 구조

### 8-1. 최상위

```astro
<main class="container page-shell cstp-page" id="childcare-short-time-pay-calculator">
```

### 8-2. 히어로

```astro
<CalculatorHero
  eyebrow="육아 정책 계산"
  title="육아기 근로시간 단축 급여 계산기"
  description="월 통상임금과 단축 전후 주 근로시간을 입력하면 회사 지급 임금, 고용보험 급여, 예상 월수령액을 계산합니다."
  badges={["2026 기준", "세전 모의계산", "통상임금 기준"]}
/>
```

### 8-3. 입력 폼

```astro
<section class="cstp-calculator content-section" aria-labelledby="cstp-input-title">
  <div class="cstp-layout">
    <form class="cstp-input-panel" id="cstp-form">
      ...
    </form>
    <aside class="cstp-result-panel" aria-live="polite">
      ...
    </aside>
  </div>
</section>
```

필수 input id:

- `cstp-wage`
- `cstp-before-hours`
- `cstp-after-hours`
- `cstp-months`
- `cstp-company-pay-mode-auto`
- `cstp-company-pay-mode-manual`
- `cstp-manual-company-pay`

필수 output id:

- `cstp-result-total`
- `cstp-result-government`
- `cstp-result-company`
- `cstp-result-delta`
- `cstp-result-replacement`
- `cstp-warning-list`

### 8-4. 프리셋 버튼

```astro
<div class="cstp-preset-grid" aria-label="단축근무 프리셋">
  {CHILDCARE_SHORT_TIME_PRESETS.map((preset) => (
    <button
      type="button"
      class="cstp-preset"
      data-before={preset.weeklyHoursBefore}
      data-after={preset.weeklyHoursAfter}
    >
      <strong>{preset.label}</strong>
      <span>{preset.description}</span>
    </button>
  ))}
</div>
```

### 8-5. 결과 KPI

```astro
<div class="cstp-kpi-grid">
  <article class="cstp-kpi cstp-kpi--primary">
    <span>예상 월수령액</span>
    <strong id="cstp-result-total">-</strong>
    <p>회사 지급액 + 고용보험 급여</p>
  </article>
  ...
</div>
```

### 8-6. 단축시간 분해 바

```astro
<section class="cstp-hours-breakdown content-section">
  <div class="cstp-hours-bar" id="cstp-hours-bar">
    <span class="cstp-hours-bar__work" id="cstp-hours-work"></span>
    <span class="cstp-hours-bar__first" id="cstp-hours-first"></span>
    <span class="cstp-hours-bar__extra" id="cstp-hours-extra"></span>
  </div>
  <div class="cstp-hours-legend">
    ...
  </div>
</section>
```

### 8-7. 산식 카드

```astro
<section class="cstp-formula-section content-section" aria-labelledby="cstp-formula-title">
  <div class="cstp-formula-grid">
    <article class="cstp-formula-card">
      <span class="cstp-formula-card__eyebrow">최초 10시간</span>
      <strong id="cstp-first-support">-</strong>
      <dl>...</dl>
    </article>
  </div>
</section>
```

### 8-8. 기간 총액 표

```astro
<table class="cstp-total-table">
  <thead>
    <tr>
      <th>구분</th>
      <th>월 금액</th>
      <th>기간</th>
      <th>합계</th>
    </tr>
  </thead>
  <tbody id="cstp-total-table-body"></tbody>
</table>
```

### 8-9. 시나리오 비교표

```astro
<tbody id="cstp-scenario-body"></tbody>
```

JS에서 35/30/25/20/15시간 행을 렌더링한다.

---

## 9. 클라이언트 JS 설계

파일: `public/scripts/childcare-short-time-pay-calculator.js`

### 9-1. IIFE 기본 구조

```js
(function () {
  "use strict";

  var state = {
    policy: null,
    presets: [],
    input: null,
    result: null,
  };

  function init() {}
  function readData() {}
  function bindEvents() {}
  function readInput() {}
  function calculate() {}
  function render() {}

  document.addEventListener("DOMContentLoaded", init);
})();
```

### 9-2. 초기화 순서

1. `#cstp-data` JSON 파싱
2. URL query param 적용
3. DOM 입력값 초기화
4. 이벤트 바인딩
5. 최초 계산 실행

### 9-3. 이벤트

대상:

- `input` 이벤트: 금액, 시간, 개월 수
- `change` 이벤트: 회사 지급액 모드
- `click` 이벤트: 프리셋 버튼
- `click` 이벤트: 초기화 버튼
- `click` 이벤트: 공유 링크 복사

### 9-4. URL query

읽기:

```text
wage=3000000
before=40
after=30
months=12
mode=AUTO
companyPay=2250000
```

쓰기:

- 입력 변경 후 `history.replaceState`로 현재 값 반영
- 공유 버튼 클릭 시 현재 URL 복사

### 9-5. 렌더 함수

필수 렌더:

- `renderKpis(result)`
- `renderWarnings(result.warnings)`
- `renderHoursBreakdown(result)`
- `renderFormulaCards(result)`
- `renderTotalTable(result)`
- `renderScenarioTable(input, policy)`
- `renderModeState(input)`

### 9-6. 접근성

- 결과 패널에 `aria-live="polite"`
- 경고 영역은 경고가 있을 때만 `role="status"` 또는 `role="alert"` 적용
- 프리셋 버튼은 선택된 값과 일치하면 `aria-pressed="true"`
- 직접 입력 영역은 비활성 상태에서 `hidden` 또는 `aria-hidden="true"`

---

## 10. SCSS 설계

파일: `src/styles/scss/pages/_childcare-short-time-pay-calculator.scss`

### 10-1. 기본 prefix

모든 클래스는 `cstp-`로 시작한다.

### 10-2. 주요 레이아웃

```scss
.cstp-page {}
.cstp-calculator {}
.cstp-layout {}
.cstp-input-panel {}
.cstp-result-panel {}
.cstp-kpi-grid {}
.cstp-hours-breakdown {}
.cstp-formula-grid {}
.cstp-total-table {}
.cstp-scenario-table {}
```

### 10-3. 레이아웃 규칙

- 데스크톱: 입력 0.95fr, 결과 1.05fr 2열
- 900px 이하: 1열
- 입력 패널은 card로 허용
- 결과 KPI 카드는 반복 아이템 card로 허용
- 페이지 섹션 자체는 floating card처럼 만들지 않는다.
- 카드 radius는 8px 이하 유지
- 버튼/세그먼트는 고정 높이와 min-width 지정

### 10-4. 색상 톤

육아 페이지지만 과한 파스텔/베이지 톤을 피한다.

권장:

- 배경: `#f7f8fb`
- 텍스트: `#172033`
- 주 강조: `#2563eb`
- 보조 강조: `#0891b2`
- 주의: `#b45309`
- 성공/보전: `#047857`
- 카드 경계: `#d9e2ef`

### 10-5. 모바일

- 320px에서 숫자 카드가 넘치지 않도록 `font-size: clamp()` 대신 고정 단계형 사이즈 사용
- 결과 금액은 `word-break: keep-all`
- 테이블은 가로 스크롤 컨테이너 안에 넣는다.
- 프리셋 버튼은 2열 grid, 360px 이하 1열도 허용
- 결과 카드 숫자는 `font-size: 1.35rem` 수준에서 시작

### 10-6. 상태 클래스

```scss
.cstp-kpi--primary {}
.cstp-kpi--positive {}
.cstp-kpi--negative {}
.cstp-kpi--caution {}
.cstp-warning-list.is-visible {}
.cstp-manual-pay.is-visible {}
.cstp-preset.is-active {}
.cstp-result-panel.is-error {}
```

---

## 11. 콘텐츠 설계

### 11-1. InfoNotice

상단 안내:

```text
이 계산기는 2026년 공개 기준을 바탕으로 한 세전 모의계산입니다. 실제 지급액은 고용보험 심사, 통상임금 산정, 회사 임금 지급 방식에 따라 달라질 수 있습니다.
```

### 11-2. 결과 안내 문구

정상:

```text
입력한 통상임금과 근로시간 기준으로 회사 지급 예상액과 고용보험 급여를 나누어 계산했습니다.
```

상한 적용:

```text
입력한 통상임금이 급여 상한 기준보다 높아 일부 구간에 상한이 적용됐습니다.
```

직접 입력:

```text
회사 지급액 직접 입력값을 총 월수령액 계산에 반영했습니다.
```

경고:

```text
입력값이 제도상 일반 범위를 벗어났습니다. 계산 결과는 참고용으로만 보고 신청 가능 여부를 확인하세요.
```

### 11-3. FAQ 데이터

최소 8개:

1. 육아기 근로시간 단축 급여는 누가 받을 수 있나요?
2. 계산기의 월 통상임금은 세전 월급인가요?
3. 단축 후 회사 월급은 어떻게 계산되나요?
4. 최초 10시간 단축분은 왜 따로 계산하나요?
5. 주 40시간에서 30시간으로 줄이면 얼마나 받나요?
6. 단축 후 주 15시간까지 줄일 수 있나요?
7. 육아휴직 급여와 동시에 받을 수 있나요?
8. 실제 지급액이 계산 결과와 다를 수 있나요?
9. 회사 지급액 직접 입력은 언제 쓰나요?

### 11-4. SeoContent related

```ts
[
  { href: "/tools/parental-leave-pay/", label: "육아휴직 급여 계산기" },
  { href: "/tools/parental-leave-short-work-calculator/", label: "육아휴직 + 육아기 단축근무 계산기" },
  { href: "/tools/single-parental-leave-total/", label: "한 명만 육아휴직 총수령액 계산기" },
  { href: "/tools/six-plus-six/", label: "6+6 육아휴직 급여 계산기" },
]
```

---

## 12. 예외 처리

### 12-1. 입력 오류

| 조건 | 처리 |
|---|---|
| 통상임금 0 이하 | 기본값 300만원으로 복원 또는 경고 |
| 단축 후 시간이 단축 전 이상 | 결과 톤 error, 지원금 0 처리 |
| 단축 후 15시간 미만 | 계산은 하되 제도 범위 경고 |
| 단축 후 35시간 초과 | 계산은 하되 제도 범위 경고 |
| 직접 입력 회사 지급액 누락 | 자동 계산값 사용, 경고 표시 |
| 사용 개월 수 36개월 초과 | 36개월로 clamp |

### 12-2. 포맷

- 화면 기본 표기는 `만원` 단위
- 상세 표는 `원` 단위 또는 `만원` 단위 중 하나로 통일
- 권장: KPI는 `287.5만원`, 표는 `2,875,000원`
- 음수 차이는 `-12.5만원`, 양수 차이는 `+3.2만원`

---

## 13. 도구 등록 설계

### 13-1. `src/data/tools.ts`

권장 추가:

```ts
{
  slug: "childcare-short-time-pay-calculator",
  title: "육아기 근로시간 단축 급여 계산기",
  description: "월 통상임금과 단축 전후 주 근로시간을 입력하면 회사 지급 임금, 고용보험 급여, 예상 월수령액을 계산합니다.",
  order: 0,
  eyebrow: "육아 단축근무 급여",
  category: "육아·복지",
  iframeReady: true,
  badges: ["신규", "육아", "고용보험"],
  previewStats: [
    { label: "대표 입력", value: "40→30시간" },
    { label: "결과", value: "월수령 예상" },
  ],
}
```

### 13-2. `src/styles/app.scss`

```scss
@use 'scss/pages/childcare-short-time-pay-calculator';
```

### 13-3. sitemap

```xml
<url>
  <loc>https://bigyocalc.com/tools/childcare-short-time-pay-calculator/</loc>
</url>
```

---

## 14. 테스트 케이스

### 14-1. 기본 계산

| 통상임금 | 전 | 후 | 기대 |
|---:|---:|---:|---|
| 3,000,000 | 40 | 30 | 단축 10시간, 추가 0시간 |
| 3,000,000 | 40 | 20 | 단축 20시간, 최초 10 + 추가 10 |
| 3,000,000 | 40 | 35 | 단축 5시간, 최초 5 |
| 3,000,000 | 40 | 15 | 단축 25시간, 최초 10 + 추가 15 |

### 14-2. 상한/하한

| 통상임금 | 전 | 후 | 확인 |
|---:|---:|---:|---|
| 1,000,000 | 40 | 35 | 하한 적용 가능성 |
| 5,000,000 | 40 | 30 | 최초 10시간 상한 적용 |
| 8,000,000 | 40 | 20 | 최초/추가 구간 상한 적용 |

### 14-3. 직접 입력

| 통상임금 | 전 | 후 | 직접 회사 지급액 | 확인 |
|---:|---:|---:|---:|---|
| 3,000,000 | 40 | 30 | 2,400,000 | 총액이 직접 입력 기준으로 갱신 |
| 4,000,000 | 40 | 20 | 1,900,000 | 정부 급여는 통상임금 기준 유지 |

### 14-4. 경고

| 전 | 후 | 기대 |
|---:|---:|---|
| 40 | 40 | error |
| 40 | 45 | error |
| 40 | 10 | 15시간 미만 경고 |
| 40 | 38 | 35시간 초과 경고 |

---

## 15. QA 체크리스트

### 15-1. 빌드

- `npm run build` 성공
- 페이지 HTML 생성 확인
- JS 콘솔 에러 없음
- CSS import 누락 없음
- sitemap URL 포함

### 15-2. 계산

- 최초 10시간 구간과 추가 구간이 정확히 분리되는지
- 회사 지급 자동 계산이 시간 비례로 동작하는지
- 직접 입력 모드에서 companyPay가 바뀌는지
- 고용보험 급여는 직접 입력 회사 지급액과 무관하게 통상임금 기준으로 계산되는지
- 하한/상한 배지가 조건에 맞게 표시되는지
- 기간 총액이 사용 개월 수에 맞게 바뀌는지

### 15-3. UX

- 모바일 320px에서 가로 스크롤이 테이블 영역에만 생기는지
- 프리셋 버튼 텍스트가 넘치지 않는지
- 결과 카드 숫자가 카드 밖으로 튀지 않는지
- 입력 변경 후 결과가 즉시 바뀌는지
- 공유 URL 복원 동작이 자연스러운지
- 초기화 버튼이 기본값으로 되돌리는지

### 15-4. 콘텐츠

- 사용자 노출 문구는 모두 한국어
- `확정 지급액`처럼 오해되는 표현 없음
- `준비 중`, `확인 중`, `업데이트 예정`, `TODO`, `href="#"` 없음
- 공식 출처와 기준일 표시
- FAQ 8개 이상
- 관련 링크 모두 실제 URL

---

## 16. 구현 순서

1. `src/data/childcareShortTimePay.ts` 작성
2. `src/pages/tools/childcare-short-time-pay-calculator.astro` 작성
3. `public/scripts/childcare-short-time-pay-calculator.js` 작성
4. `src/styles/scss/pages/_childcare-short-time-pay-calculator.scss` 작성
5. `src/data/tools.ts` 등록
6. `src/styles/app.scss` import 추가
7. `public/sitemap.xml` URL 추가
8. 관련 계산기 하단 링크는 2차 범위로 검토
9. `npm run build`
10. 모바일/데스크톱 확인

---

## 17. 구현 시 주의

- 기존 `parental-leave-short-work-calculator`를 대체하지 않는다.
- 페이지 제목과 설명은 반드시 `급여 계산`에 집중한다.
- 정책 계산 로직은 추정임을 명확히 표시한다.
- 회사 지급액 직접 입력 모드를 제공해 실제 회사 안내 금액을 반영할 수 있게 한다.
- 시나리오 비교는 같은 통상임금 기준으로 단축 후 시간만 바꾸어 계산한다.
- UI에서 `실수령액`이라는 표현은 피하고 `월수령 예상액`, `세전 예상`을 사용한다.
- 입력 프리셋과 시나리오 표는 서로 같은 계산 함수를 사용해 숫자 불일치를 막는다.
