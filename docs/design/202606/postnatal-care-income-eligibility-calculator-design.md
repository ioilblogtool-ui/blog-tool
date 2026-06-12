# 산후도우미 지원금 소득기준 계산기 2026 — 설계 문서

> 기획 원문: `docs/plan/202606/postnatal-care-income-eligibility-calculator.md`  
> 작성일: 2026-06-12  
> 콘텐츠 유형: `/tools/` 계산기  
> 구현 대상 URL: `/tools/postnatal-care-income-eligibility/`  
> 구현 기준: 2026년 산모·신생아 건강관리 지원사업의 소득기준을 건강보험료와 기준중위소득 150% 중심으로 판정하되, 모든 결과는 `추정` 또는 `확인 필요`로 표시한다.

---

## 1. 문서 개요

- 구현 대상: `산후도우미 지원금 소득기준 계산기 2026`
- slug: `postnatal-care-income-eligibility`
- URL: `/tools/postnatal-care-income-eligibility/`
- 카테고리: 출산·육아 / 복지지원
- 핵심 검색 의도: `산후도우미 지원금 소득기준 계산`, `산후도우미 소득기준`, `산후도우미 건강보험료 기준`, `산모신생아 건강관리 지원사업 소득기준`
- 핵심 출력: 지원 가능성, 기준중위소득 150% 기준액, 입력 보험료 합계, 기준 대비 여유/초과액, 예외지원 확인 항목, 다음 행동 CTA
- 안전 장치: 지원 가능성을 확정하지 않고 `가능성 높음`, `경계`, `초과 가능성`, `예외지원 확인 필요`로 표시한다.

이 페이지는 기존 `/tools/postnatal-care-cost/`의 앞단 퍼널이다. 사용자가 소득 구간을 모르더라도 먼저 건강보험료 기준으로 판정하고, 결과에서 비용 계산기로 이동하게 만든다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    postnatalCareIncomeEligibility.ts
    tools.ts
  pages/
    tools/
      postnatal-care-income-eligibility.astro
  styles/
    scss/
      pages/
        _postnatal-care-income-eligibility.scss
    app.scss

public/
  scripts/
    postnatal-care-income-eligibility.js
  sitemap.xml
```

추가 등록 필수:

- `src/data/tools.ts`: 계산기 목록 등록
- `src/styles/app.scss`: `@use 'scss/pages/postnatal-care-income-eligibility';`
- `public/sitemap.xml`: `/tools/postnatal-care-income-eligibility/` URL 추가
- 구현 후 `npm run build` 성공 확인

---

## 3. 레이아웃 방향

- `SimpleToolShell` 기반 계산기 페이지로 구현한다.
- 모바일은 입력 폼 → 결과 → 다음 행동 CTA 순서로 배치한다.
- 데스크톱은 좌측 입력, 우측 결과 구조를 사용한다.
- SCSS prefix: `pncei-`
- pageClass: `pncei-page`
- 결과 첫 카드는 `지원 가능성`으로 둔다.
- 숫자 결과보다 `다음에 무엇을 해야 하는지`가 중요하므로 결과 하단 CTA를 강하게 둔다.

권장 설정:

```astro
<SimpleToolShell
  calculatorId="postnatal-care-income-eligibility"
  pageClass="pncei-page"
  resultFirst={false}
>
```

---

## 4. 페이지 IA

1. Hero
2. 공식 기준·추정 범위 안내 `InfoNotice`
3. 빠른 판정 입력
4. 예외지원 체크
5. 핵심 결과 KPI
6. 건강보험료 기준 상세 비교
7. 예외지원 확인 카드
8. 다음 행동 CTA
9. 산후도우미 소득기준 해설
10. 신청 시기와 준비서류
11. FAQ
12. 관련 계산기 CTA
13. `SeoContent`

---

## 5. 데이터 설계

파일: `src/data/postnatalCareIncomeEligibility.ts`

### 5-1. 타입

```ts
export type PnceiInsuranceType = "employee" | "local" | "mixed";
export type PnceiJudgeMode = "premium" | "income";
export type PnceiBirthType = "single" | "twin" | "triplet_plus";
export type PnceiChildOrder = "first" | "second" | "third_plus";
export type PnceiRegion = "seoul" | "gyeonggi" | "incheon" | "busan" | "daegu" | "daejeon" | "gwangju" | "local";
export type PnceiSourceBadge = "공식" | "추정" | "확인 필요";
export type PnceiEligibilityStatus = "likely" | "borderline" | "over" | "exception_check";
export type PnceiIncomeTypeSuggestion = "ga" | "tonghap" | "ra" | "unknown";

export interface PnceiThreshold {
  year: number;
  householdSize: number;
  medianIncome100: number;
  medianIncome150: number;
  employeePremiumLimit: number;
  localPremiumLimit: number;
  mixedPremiumLimit: number;
  sourceBadge: PnceiSourceBadge;
  sourceLabel: string;
}

export interface PnceiExceptionReason {
  key: string;
  label: string;
  description: string;
  resultMessage: string;
  needsLocalOfficeCheck: boolean;
}

export interface PnceiRegionGuide {
  region: PnceiRegion;
  label: string;
  description: string;
  localCheckMessage: string;
}

export interface PnceiDefaultInput {
  judgeMode: PnceiJudgeMode;
  region: PnceiRegion;
  householdSize: number;
  insuranceType: PnceiInsuranceType;
  motherPremium: number;
  spousePremium: number;
  monthlyIncome: number;
  dualIncome: boolean;
  birthType: PnceiBirthType;
  childOrder: PnceiChildOrder;
  exceptionReasonKeys: string[];
}
```

### 5-2. 기준 데이터

2026년 기준중위소득과 건강보험료 기준표는 구현 직전에 공식표로 확인해 입력한다. 설계 단계에서는 구조만 확정한다.

```ts
export const PNCEI_THRESHOLDS_2026: PnceiThreshold[] = [
  {
    year: 2026,
    householdSize: 3,
    medianIncome100: 0,
    medianIncome150: 0,
    employeePremiumLimit: 0,
    localPremiumLimit: 0,
    mixedPremiumLimit: 0,
    sourceBadge: "확인 필요",
    sourceLabel: "2026년 산모·신생아 건강관리 지원사업 소득기준표 확인 필요",
  },
];
```

구현 전 확인 대상:

- 2026년 기준중위소득 100% 공식표
- 2026년 기준중위소득 150% 산모·신생아 건강관리 지원사업 건강보험료 기준표
- 건강보험료 본인부담금에 장기요양보험료를 포함하는지 여부
- 가구원 수 산정 시 출생 예정아 포함 방식
- 맞벌이 또는 부부 별도 가입자의 합산 방식

### 5-3. 옵션 데이터

```ts
export const PNCEI_INSURANCE_OPTIONS = [
  { key: "employee", label: "직장가입자", description: "직장 건강보험료 기준" },
  { key: "local", label: "지역가입자", description: "지역 건강보험료 기준" },
  { key: "mixed", label: "혼합", description: "직장+지역 혼합 세대 기준" },
];

export const PNCEI_EXCEPTION_REASONS: PnceiExceptionReason[] = [
  {
    key: "second_or_more",
    label: "둘째 이상",
    description: "둘째아 이상 출산가정은 일부 지자체에서 확대지원이 있을 수 있습니다.",
    resultMessage: "둘째 이상 출산은 150% 초과여도 예외지원 여부를 확인해볼 만합니다.",
    needsLocalOfficeCheck: true,
  },
  {
    key: "multiple_birth",
    label: "다태아",
    description: "쌍태아·삼태아 이상은 서비스 기간과 지원 기준이 달라질 수 있습니다.",
    resultMessage: "다태아는 돌봄 강도가 높아 보건소 기준 확인이 필요합니다.",
    needsLocalOfficeCheck: true,
  },
  {
    key: "premature_or_congenital",
    label: "미숙아·선천성이상아",
    description: "입원·퇴원일 기준으로 신청 기간이 달라질 수 있습니다.",
    resultMessage: "미숙아·선천성이상아는 신청 기간과 지원 기준을 별도로 확인하세요.",
    needsLocalOfficeCheck: true,
  },
  {
    key: "rare_disease",
    label: "희귀난치성질환 산모",
    description: "예외지원 대상 여부를 확인해야 합니다.",
    resultMessage: "희귀난치성질환 산모는 예외지원 대상 여부를 보건소에서 확인하세요.",
    needsLocalOfficeCheck: true,
  },
  {
    key: "disabled",
    label: "장애 산모·신생아",
    description: "장애 산모 또는 장애 신생아는 예외지원 가능성이 있습니다.",
    resultMessage: "장애 산모·신생아는 예외지원 또는 추가지원 여부를 확인하세요.",
    needsLocalOfficeCheck: true,
  },
  {
    key: "immigrant_or_single_mother",
    label: "결혼이민·미혼모",
    description: "지자체 기준에 따라 예외지원 확인이 필요할 수 있습니다.",
    resultMessage: "결혼이민·미혼모 가정은 지자체 예외지원 기준을 확인하세요.",
    needsLocalOfficeCheck: true,
  },
];
```

### 5-4. 참고 출처 카드

기존 산후도우미 비용 계산기와 출처 톤을 맞춘다.

```ts
export const PNCEI_REFERENCE_CARDS = [
  {
    source: "복지로",
    title: "산모·신생아 건강관리 지원사업 안내",
    href: "https://www.bokjiro.go.kr/",
    desc: "지원 대상, 신청 방법, 복지서비스 정보를 확인합니다.",
  },
  {
    source: "사회서비스 전자바우처",
    title: "산모·신생아 건강관리 지원사업",
    href: "https://www.socialservice.or.kr/",
    desc: "바우처 사업 안내와 제공기관 정보를 확인합니다.",
  },
  {
    source: "거주지 보건소",
    title: "2026년 건강보험료 기준표",
    href: "",
    desc: "최종 소득기준과 예외지원 여부는 거주지 보건소 공고를 확인합니다.",
  },
];
```

---

## 6. 계산 로직

### 6-1. 입력 모델

```ts
export interface PnceiInput {
  judgeMode: PnceiJudgeMode;
  region: PnceiRegion;
  householdSize: number;
  insuranceType: PnceiInsuranceType;
  motherPremium: number;
  spousePremium: number;
  monthlyIncome: number;
  dualIncome: boolean;
  birthType: PnceiBirthType;
  childOrder: PnceiChildOrder;
  exceptionReasonKeys: string[];
}
```

### 6-2. 결과 모델

```ts
export interface PnceiResult {
  status: PnceiEligibilityStatus;
  statusLabel: string;
  statusDescription: string;
  sourceBadge: PnceiSourceBadge;
  householdSize: number;
  insuranceType: PnceiInsuranceType;
  premiumTotal: number;
  monthlyIncome: number;
  premiumLimit: number;
  medianIncome150: number;
  differenceAmount: number;
  differenceRate: number;
  incomeTypeSuggestion: PnceiIncomeTypeSuggestion;
  exceptionMessages: string[];
  nextActionHref: string;
  nextActionLabel: string;
  warnings: string[];
}
```

### 6-3. 건강보험료 기준 판정

```text
입력 보험료 합계 = 산모 건강보험료 + 배우자 건강보험료
기준 보험료 = 가구원 수와 가입 유형에 맞는 2026년 150% 건강보험료 기준
차이 = 기준 보험료 - 입력 보험료 합계
차이율 = 입력 보험료 합계 / 기준 보험료
```

판정 기준:

| 조건 | status | 소득 구간 추천 |
| --- | --- | --- |
| 입력 보험료 <= 기준 보험료 × 0.95 | `likely` | `tonghap` |
| 입력 보험료 <= 기준 보험료 × 1.05 | `borderline` | `unknown` |
| 입력 보험료 > 기준 보험료 × 1.05, 예외 사유 없음 | `over` | `ra` |
| 입력 보험료 > 기준 보험료 × 1.05, 예외 사유 있음 | `exception_check` | `ra` |

주의:

- 기준 보험료가 0이거나 데이터가 없으면 계산하지 않고 `확인 필요` 상태를 표시한다.
- 95~105% 경계 구간은 실무 판정 차이가 생길 수 있으므로 확정 표현 금지.
- 보험료 입력값은 월 건강보험료 기준으로 받고, 장기요양보험료 포함 여부는 안내문으로 분리한다.

### 6-4. 월소득 기준 보조 판정

```text
월소득 기준액 = 기준중위소득 100% × 150%
차이 = 월소득 기준액 - 입력 월소득
```

월소득 기준은 건강보험료를 모르는 사용자를 위한 보조 판정이다. 결과 첫 줄에 반드시 `월소득 기준 보조 판정`을 표시한다.

### 6-5. 다음 행동 URL

결과에서 기존 비용 계산기로 넘긴다.

```ts
function buildCostCalculatorUrl(result: PnceiResult, input: PnceiInput): string {
  const params = new URLSearchParams({
    incomeType: result.incomeTypeSuggestion,
    birthType: input.birthType,
    childOrder: input.childOrder,
  });

  return `/tools/postnatal-care-cost/?${params.toString()}`;
}
```

기존 비용 계산기가 아직 해당 파라미터를 읽지 않는다면, 1차 구현에서는 일반 링크로 연결하고 2차에서 파라미터 복원을 추가한다.

---

## 7. Astro 페이지 설계

파일: `src/pages/tools/postnatal-care-income-eligibility.astro`

### 7-1. imports

```astro
---
import SiteLayout from "../../../layouts/SiteLayout.astro";
import CalculatorHero from "../../../components/CalculatorHero.astro";
import InfoNotice from "../../../components/InfoNotice.astro";
import SimpleToolShell from "../../../components/SimpleToolShell.astro";
import SeoContent from "../../../components/SeoContent.astro";
import {
  PNCEI_DEFAULT_INPUT,
  PNCEI_THRESHOLDS_2026,
  PNCEI_INSURANCE_OPTIONS,
  PNCEI_EXCEPTION_REASONS,
  PNCEI_REFERENCE_CARDS,
  PNCEI_FAQ,
  PNCEI_RELATED_LINKS,
  PNCEI_SEO,
} from "../../../data/postnatalCareIncomeEligibility";
---
```

실제 경로는 기존 컴포넌트 구조에 맞춰 조정한다.

### 7-2. Hero

```astro
<CalculatorHero
  eyebrow="출산·복지지원"
  title="산후도우미 지원금 소득기준 계산기 2026"
  description="가구원 수와 건강보험료를 입력해 산모·신생아 건강관리 지원사업의 기준중위소득 150% 해당 여부를 확인하세요."
  badges={["산후도우미", "건강보험료", "소득기준", "2026"]}
/>

<InfoNotice
  tone="caution"
  text="이 계산기는 2026년 산모·신생아 건강관리 지원사업 소득기준을 이해하기 위한 참고 계산입니다. 실제 지원 가능 여부와 정부지원금은 거주지 보건소, 복지로, 사회서비스 전자바우처 기준으로 최종 확인하세요."
/>
```

### 7-3. 입력 폼

입력 폼은 한 화면에서 너무 길어지지 않도록 3개 블록으로 나눈다.

```text
1. 가구 정보
   - 거주 지역
   - 가구원 수
   - 태아 유형
   - 출산 순위

2. 소득 판정
   - 판정 방식: 건강보험료 / 월소득
   - 가입 유형: 직장 / 지역 / 혼합
   - 산모 건강보험료
   - 배우자 건강보험료
   - 맞벌이 여부
   - 월소득

3. 예외지원 확인
   - 둘째 이상
   - 다태아
   - 미숙아·선천성이상아
   - 희귀난치성질환 산모
   - 장애 산모·신생아
   - 결혼이민·미혼모
```

권장 DOM id:

```html
<form id="pncei-form" class="pncei-form">
  <select id="pncei-region"></select>
  <input id="pncei-household-size" type="number" min="2" max="10" />
  <input id="pncei-mother-premium" type="number" min="0" step="1000" />
  <input id="pncei-spouse-premium" type="number" min="0" step="1000" />
  <input id="pncei-monthly-income" type="number" min="0" step="10000" />
</form>
```

### 7-4. 결과 영역

핵심 KPI 4개:

| 카드 | 표시값 |
| --- | --- |
| 지원 가능성 | 가능성 높음 / 경계 / 초과 가능성 / 예외지원 확인 |
| 기준 보험료 | 선택한 가구원 수·가입 유형 기준 |
| 입력 보험료 합계 | 산모+배우자 입력값 |
| 기준 대비 차이 | 기준보다 낮음/초과 |

보조 결과:

- 기준중위소득 150% 월 기준액
- 추천 소득 구간
- 예외지원 확인 항목
- 신청 시기 안내

### 7-5. 결과 CTA

```astro
<a class="pncei-next-cta" href="/tools/postnatal-care-cost/">
  지원 가능하면 본인부담금 계산하기
</a>
```

JS 계산 후에는 `href`를 조건에 맞게 갱신한다.

---

## 8. JavaScript 설계

파일: `public/scripts/postnatal-care-income-eligibility.js`

### 8-1. 함수 목록

| 함수 | 역할 |
| --- | --- |
| `readState()` | DOM 입력값을 state로 변환 |
| `findThreshold(state)` | 가구원 수 기준표 탐색 |
| `getPremiumLimit(threshold, insuranceType)` | 가입 유형별 보험료 기준 선택 |
| `calculateEligibility(state)` | 지원 가능성 계산 |
| `getExceptionMessages(state)` | 예외지원 체크 결과 생성 |
| `buildCostCalculatorUrl(result, state)` | 비용 계산기 URL 생성 |
| `renderKpis(result)` | 결과 카드 업데이트 |
| `renderInterpretation(result)` | 해석 문구 업데이트 |
| `renderExceptions(result)` | 예외지원 카드 업데이트 |
| `syncUrlParams(state)` | URL 상태 저장 |
| `restoreFromUrl()` | URL 상태 복원 |
| `bindEvents()` | 입력 이벤트 바인딩 |
| `initFaq()` | FAQ accordion |

### 8-2. URL 파라미터

| 파라미터 | 의미 |
| --- | --- |
| `mode` | `premium` / `income` |
| `rg` | 거주 지역 |
| `hh` | 가구원 수 |
| `ins` | 가입 유형 |
| `mp` | 산모 건강보험료 |
| `sp` | 배우자 건강보험료 |
| `mi` | 월소득 |
| `dual` | 맞벌이 여부 |
| `bt` | 태아 유형 |
| `co` | 출산 순위 |
| `ex` | 예외지원 사유 key 목록 |

### 8-3. 계산 함수 예시

```js
function calculateEligibility(state, thresholds, exceptions) {
  const threshold = findThreshold(state, thresholds);

  if (!threshold) {
    return {
      status: "borderline",
      statusLabel: "기준표 확인 필요",
      sourceBadge: "확인 필요",
      warnings: ["선택한 가구원 수의 2026년 기준표가 등록되지 않았습니다."],
    };
  }

  const premiumLimit = getPremiumLimit(threshold, state.insuranceType);
  const premiumTotal = state.motherPremium + state.spousePremium;
  const usesIncomeMode = state.judgeMode === "income";
  const compareBase = usesIncomeMode ? threshold.medianIncome150 : premiumLimit;
  const inputAmount = usesIncomeMode ? state.monthlyIncome : premiumTotal;
  const ratio = compareBase > 0 ? inputAmount / compareBase : 0;
  const hasException = state.exceptionReasonKeys.length > 0 || state.birthType !== "single" || state.childOrder !== "first";

  let status = "likely";
  if (ratio > 1.05 && hasException) status = "exception_check";
  else if (ratio > 1.05) status = "over";
  else if (ratio >= 0.95) status = "borderline";

  return {
    status,
    statusLabel: getStatusLabel(status),
    statusDescription: getStatusDescription(status, usesIncomeMode),
    sourceBadge: usesIncomeMode ? "추정" : "추정",
    householdSize: state.householdSize,
    insuranceType: state.insuranceType,
    premiumTotal,
    monthlyIncome: state.monthlyIncome,
    premiumLimit,
    medianIncome150: threshold.medianIncome150,
    differenceAmount: compareBase - inputAmount,
    differenceRate: ratio,
    incomeTypeSuggestion: getIncomeTypeSuggestion(status),
    exceptionMessages: getExceptionMessages(state, exceptions),
    warnings: buildWarnings(state, threshold, usesIncomeMode),
  };
}
```

### 8-4. 렌더링 원칙

- 금액은 `Intl.NumberFormat("ko-KR")`로 표시한다.
- 1만 원 이상은 `만원` 보조 표기를 함께 보여준다.
- 초과액은 빨간색 단독 표현보다 `확인 필요` 톤으로 부드럽게 표시한다.
- `지원 가능` 대신 `지원 가능성 높음`을 사용한다.
- `탈락`, `불가` 같은 단정 표현은 쓰지 않는다.

---

## 9. SCSS 설계

파일: `src/styles/scss/pages/_postnatal-care-income-eligibility.scss`

### 9-1. 주요 클래스

```scss
.pncei-page {}
.pncei-form {}
.pncei-form-section {}
.pncei-field-grid {}
.pncei-segmented {}
.pncei-checkbox-list {}
.pncei-result-grid {}
.pncei-result-card {}
.pncei-result-card--status {}
.pncei-badge {}
.pncei-badge--official {}
.pncei-badge--estimate {}
.pncei-badge--needs-check {}
.pncei-interpretation {}
.pncei-threshold-table {}
.pncei-exception-grid {}
.pncei-next-actions {}
.pncei-next-cta {}
.pncei-guide-section {}
.pncei-reference-grid {}
.pncei-faq {}
```

### 9-2. 레이아웃

- 모바일 375px: 입력 1열, 결과 카드 1열 또는 2열
- 640px 이상: 결과 카드 2열
- 920px 이상: 입력/결과 2컬럼
- 결과 카드는 `min-height`를 지정해 상태 변경 시 레이아웃 흔들림을 줄인다.

### 9-3. 색상 톤

출산·복지 페이지지만 너무 파스텔 톤으로 흐르지 않게, 차분한 민트/남색/코랄 보조색을 조합한다.

```scss
$pncei-ink: #17202a;
$pncei-muted: #667085;
$pncei-surface: #f7faf9;
$pncei-line: #d7e4df;
$pncei-primary: #1f7a6b;
$pncei-accent: #d86f45;
$pncei-warning: #9a6b12;
$pncei-danger: #b54708;
```

---

## 10. SEO 설계

### 10-1. Meta

```text
title: 산후도우미 지원금 소득기준 계산기 2026 | 건강보험료·기준중위소득 150%
description: 가구원 수와 건강보험료를 입력해 2026년 산후도우미 정부지원 소득기준, 기준중위소득 150% 이하 여부, 예외지원 확인 포인트를 계산합니다.
```

### 10-2. SeoContent intro

`SeoContent` intro는 최소 4문단 이상 작성한다.

1. 산후도우미 지원금은 비용보다 먼저 지원 대상 여부를 확인해야 한다.
2. 산모·신생아 건강관리 지원사업은 기준중위소득 150%와 건강보험료 기준이 핵심이다.
3. 맞벌이, 직장·지역 혼합, 가구원 수, 태아 유형에 따라 판정이 달라질 수 있다.
4. 150% 초과라도 둘째 이상, 다태아, 특수 사유, 지자체 확대지원은 확인할 필요가 있다.

### 10-3. FAQ 데이터

파일 내 상수:

```ts
export const PNCEI_FAQ = [
  {
    q: "산후도우미 지원금은 누구나 받을 수 있나요?",
    a: "산모·신생아 건강관리 지원사업은 소득 구간, 출산 순위, 태아 유형, 예외지원 여부, 거주지 기준에 따라 지원 여부와 지원금이 달라질 수 있습니다. 계산 결과는 참고용이며 최종 판정은 보건소 또는 복지로 신청 과정에서 확인해야 합니다.",
  },
  {
    q: "산후도우미 소득기준은 월급으로 보나요, 건강보험료로 보나요?",
    a: "실무에서는 건강보험료 본인부담금을 기준으로 판단하는 경우가 많습니다. 월급이나 연봉은 참고로 볼 수 있지만, 실제 신청에서는 직장가입자, 지역가입자, 혼합 세대별 건강보험료 기준표와 자격확인 여부가 중요합니다.",
  },
  {
    q: "맞벌이 부부는 건강보험료를 합산하나요?",
    a: "부부가 각각 건강보험에 가입되어 있으면 보험료를 함께 보는 구조가 될 수 있습니다. 다만 가입 유형과 세대 구성에 따라 달라질 수 있어 계산기 결과는 합산 추정으로 표시합니다.",
  },
  {
    q: "기준중위소득 150%를 넘으면 무조건 지원을 못 받나요?",
    a: "그렇지 않을 수 있습니다. 둘째 이상, 다태아, 미숙아, 희귀난치성질환 산모, 장애 산모·신생아, 결혼이민 산모, 미혼모, 지자체 확대지원 등 예외지원 사유가 있으면 150% 초과라도 확인해볼 필요가 있습니다.",
  },
  {
    q: "산후도우미 신청은 언제 해야 하나요?",
    a: "일반적으로 출산 예정일 40일 전부터 출산 후 60일 이내 신청 안내가 많이 쓰입니다. 미숙아 또는 선천성 이상아 입원 등 특수한 경우에는 퇴원일 기준으로 달라질 수 있으므로 거주지 보건소 기준을 확인해야 합니다.",
  },
  {
    q: "지원 가능하면 실제 본인부담금은 얼마인가요?",
    a: "본인부담금은 소득 구간뿐 아니라 태아 유형, 출산 순위, 서비스 기간, 지자체 추가지원, 제공기관 추가비에 따라 달라집니다. 이 페이지에서는 지원 가능성을 먼저 판단하고 산후도우미 비용 계산기로 연결합니다.",
  },
  {
    q: "건강보험료가 기준 근처이면 어떻게 해야 하나요?",
    a: "기준의 95~105% 안팎이면 경계 구간으로 표시합니다. 보험료 산정월, 장기요양보험료 포함 여부, 맞벌이 합산, 세대 구성에 따라 달라질 수 있으므로 신청 전 보건소에서 최신 기준표로 확인해야 합니다.",
  },
  {
    q: "지자체마다 기준이 다른가요?",
    a: "기본 사업 구조는 같아도 지자체별 예외지원, 추가지원, 150% 초과 지원 여부가 다를 수 있습니다. 결과에 표시되는 지역 확인 문구를 보고 거주지 보건소 기준을 확인하세요.",
  },
];
```

---

## 11. 관련 콘텐츠 CTA

```ts
export const PNCEI_RELATED_LINKS = [
  {
    href: "/tools/postnatal-care-cost/",
    label: "산후도우미 본인부담금 계산하기",
    description: "지원 가능성을 확인했다면 실제 예상 부담금을 계산합니다.",
  },
  {
    href: "/reports/postnatal-care-comparison-2026/",
    label: "산후도우미 vs 산후조리원 비교",
    description: "조리원과 산후도우미 비용·상황별 선택 기준을 비교합니다.",
  },
  {
    href: "/reports/postpartum-center-cost-2026/",
    label: "산후조리원 2주 비용 보기",
    description: "산후조리원 평균 비용과 지역별 차이를 확인합니다.",
  },
  {
    href: "/tools/birth-support-money/",
    label: "지역별 출산지원금 계산하기",
    description: "출산지원금과 산후도우미 지원을 함께 봅니다.",
  },
  {
    href: "/tools/welfare-benefit-eligibility/",
    label: "복지급여 가능성 확인하기",
    description: "출산 후 받을 수 있는 다른 복지급여를 함께 점검합니다.",
  },
];
```

---

## 12. 등록 설계

### 12-1. `src/data/tools.ts`

```ts
{
  slug: "postnatal-care-income-eligibility",
  title: "산후도우미 지원금 소득기준 계산기",
  description: "가구원 수와 건강보험료를 입력해 2026년 산모·신생아 건강관리 지원사업의 기준중위소득 150% 해당 여부와 예외지원 확인 포인트를 계산합니다.",
  order: 0,
  eyebrow: "출산·복지지원",
  category: "calculator",
  iframeReady: false,
  badges: ["산후도우미", "소득기준", "건강보험료", "2026"],
  previewStats: [
    { label: "판정 기준", value: "150%", context: "기준중위소득" },
    { label: "입력", value: "건보료", context: "맞벌이 합산 가능" },
    { label: "결과", value: "예외확인", context: "지자체 기준 안내" },
  ],
}
```

`order`는 구현 시 출산·복지 계산기 클러스터 안에서 `/tools/postnatal-care-cost/` 바로 앞 또는 바로 뒤로 조정한다.

### 12-2. `public/sitemap.xml`

```xml
<url>
  <loc>https://bigyocalc.com/tools/postnatal-care-income-eligibility/</loc>
  <changefreq>yearly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## 13. QA 체크리스트

### 데이터

- [ ] 2026년 기준중위소득 100%와 150%가 공식표와 일치하는가?
- [ ] 건강보험료 기준표의 직장·지역·혼합 구분이 정확한가?
- [ ] 장기요양보험료 포함 여부를 안내했는가?
- [ ] 가구원 수 산정 기준을 설명했는가?
- [ ] 공식 데이터와 추정 결과 배지가 분리되어 있는가?

### 계산

- [ ] 산모+배우자 건강보험료 합계가 올바르게 계산되는가?
- [ ] 가입 유형별 기준 보험료를 정확히 선택하는가?
- [ ] 95~105% 경계 구간이 `경계`로 표시되는가?
- [ ] 150% 초과 + 예외 사유 선택 시 `예외지원 확인 필요`로 표시되는가?
- [ ] 월소득 기준 선택 시 `보조 판정` 문구가 표시되는가?
- [ ] 기준표가 없는 가구원 수는 임의 계산하지 않는가?
- [ ] 비용 계산기 CTA URL이 추천 소득 구간, 태아 유형, 출산 순위를 포함하는가?

### UI

- [ ] 모바일 375px에서 가로 스크롤이 없는가?
- [ ] 결과 카드의 긴 문구가 버튼이나 카드 밖으로 넘치지 않는가?
- [ ] 예외지원 체크박스가 터치하기 충분한 크기인가?
- [ ] 결과 상태 색상이 단정적이거나 불안감을 과도하게 주지 않는가?
- [ ] FAQ accordion 접근성 속성(`aria-expanded`, `hidden`)이 적용되는가?

### 등록

- [ ] `src/data/tools.ts` 등록
- [ ] `src/styles/app.scss` import 추가
- [ ] `public/sitemap.xml` URL 추가
- [ ] `npm run build` 성공
- [ ] `dist/tools/postnatal-care-income-eligibility/index.html` 생성 확인

---

## 14. 구현 순서

1. `src/data/postnatalCareIncomeEligibility.ts` 생성: 타입, 기준표, 옵션, FAQ, CTA 데이터 작성
2. `src/pages/tools/postnatal-care-income-eligibility.astro` 생성: Hero, 입력 폼, 결과 영역, 본문, FAQ 구성
3. `public/scripts/postnatal-care-income-eligibility.js` 생성: 판정 로직, DOM 업데이트, URL 상태 저장
4. `src/styles/scss/pages/_postnatal-care-income-eligibility.scss` 생성: `pncei-` prefix 스타일 작성
5. `src/data/tools.ts`, `src/styles/app.scss`, `public/sitemap.xml` 등록
6. 기존 `/tools/postnatal-care-cost/`에 "소득 구간을 모르겠다면 먼저 확인" CTA 추가
7. `npm run build` 실행
8. 모바일/데스크톱 화면에서 텍스트 overflow, 결과 CTA, FAQ, URL 파라미터를 확인

---

## 15. MVP와 2차 확장

### MVP

- 건강보험료 기준 판정
- 월소득 보조 판정
- 예외지원 체크리스트
- 비용 계산기 CTA
- SEO 본문과 FAQ

### 2차 확장

- 지역별 150% 초과 확대지원 데이터
- 서울·경기·인천 등 주요 지자체 별도 안내 카드
- `/tools/postnatal-care-cost/` URL 파라미터 자동 복원
- 산후도우미 신청 준비서류 체크리스트 저장 기능
- 출산 예정일 기준 신청 가능 기간 D-day 표시

---

## 16. 구현 시 주의 문구

사용자에게 확정 판정처럼 보이지 않게 아래 표현을 반복 사용한다.

```text
지원 가능성 높음
경계 구간
150% 초과 가능성
예외지원 확인 필요
보건소 최종 확인 필요
복지로 신청 과정에서 최종 판정
```

피해야 할 표현:

```text
지원 확정
지원 불가
탈락
무조건 받을 수 있음
무조건 못 받음
```

---

## 17. 최종 설계 요약

이 페이지의 핵심은 산후도우미 비용 계산을 중복하는 것이 아니라, 사용자가 가장 먼저 막히는 `소득 구간 판정`을 풀어주는 것이다. 건강보험료 입력 → 150% 기준 비교 → 예외지원 확인 → 본인부담금 계산으로 이어지는 흐름을 만들면 기존 출산·복지 콘텐츠와 자연스럽게 연결된다.

MVP에서는 공식 기준표 확인이 끝난 범위만 계산하고, 애매한 조건은 과감하게 `확인 필요`로 표시한다. 복지 지원금 페이지는 정확성보다 더 중요한 것이 단정하지 않는 태도이므로, 계산 결과는 친절하되 항상 최종 확인 경로를 함께 제공한다.
