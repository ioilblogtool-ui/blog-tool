# 퇴직금 중간정산 세금 계산기 — 설계 문서

> 기획 원문: `docs/plan/202608/retirement-lump-sum-interim-settlement-tax-calculator.md`
> 작성일: 2026-08-05
> 구현 기준: Claude/Codex가 이 문서를 보고 바로 구현에 착수할 수 있는 수준으로 고정

---

## 1. 문서 개요

- 구현 대상: `퇴직금 중간정산 세금 계산기`
- slug: `retirement-lump-sum-interim-settlement-tax-calculator`
- URL: `/tools/retirement-lump-sum-interim-settlement-tax-calculator/`
- 카테고리: 투자·재테크
- 핵심 검색 의도: "퇴직금 중간정산 세금 계산기", "퇴직소득세 계산기", "퇴직금 중간정산 사유", "퇴직금 중간정산 불이익"
- 핵심 출력: 중간정산 시 예상 퇴직소득세·실수령액, 계속근무 가정 시 비례 환산 세금, 중간정산으로 인한 세금 차이
- 핵심 CTA: `/tools/retirement/`, `/tools/retirement-dc-db-calculator/`, `/tools/peak-wage-retirement-calculator/`, `/tools/capital-gains-tax-calculator/`

중요 톤:
- 이 계산기는 사이트 최초로 **실제 퇴직소득세 계산식(근속연수공제·환산급여공제·연분연승법)**을 구현한다. 기존 `retirement` 계산기의 "임의 세율 곱하기" 방식과 혼동되지 않도록 페이지 어디에도 "간이 추정 세율"이라는 표현을 쓰지 않는다.
- "중간정산 받으면 손해"라고 단정하지 않는다. 근속연수·금액 구간에 따라 차이가 달라질 수 있으므로 항상 "~일 수 있습니다" 톤을 유지한다.
- 법정 중간정산 사유 체크리스트를 세금 계산보다 먼저 노출해, 애초에 중간정산이 가능한 상황인지부터 확인시킨다.
- 모든 결과에 `추정`, `참고` 배지와 "실제 원천징수·신고 세액과 다를 수 있다" 고지를 포함한다.

---

## 2. 기존 프로젝트 재사용 상수 (신규 산정 금지)

이 계산기는 **종합소득세 누진세율표를 새로 만들지 않는다.** `src/data/capitalGainsTaxCalculator.ts`에 이미 정의된 `CGT_TAX_BRACKETS`(소득세법 §55, 8구간)를 그대로 import해서 재사용한다.

```ts
// src/data/capitalGainsTaxCalculator.ts (기존, 그대로 재사용)
export const CGT_TAX_BRACKETS = [
  { limit: 14_000_000,  rate: 0.06, cumDed: 0,          label: "1,400만 이하 6%" },
  { limit: 50_000_000,  rate: 0.15, cumDed: 1_260_000,  label: "5,000만 이하 15%" },
  { limit: 88_000_000,  rate: 0.24, cumDed: 5_760_000,  label: "8,800만 이하 24%" },
  { limit: 150_000_000, rate: 0.35, cumDed: 15_440_000, label: "1.5억 이하 35%" },
  { limit: 300_000_000, rate: 0.38, cumDed: 19_940_000, label: "3억 이하 38%" },
  { limit: 500_000_000, rate: 0.40, cumDed: 25_940_000, label: "5억 이하 40%" },
  { limit: 1_000_000_000, rate: 0.42, cumDed: 35_940_000, label: "10억 이하 42%" },
  { limit: Infinity,    rate: 0.45, cumDed: 65_940_000, label: "10억 초과 45%" },
];
```

이 계산기의 데이터 파일에서는 위 배열을 **재수출(re-export)하지 않고 직접 import**해서 사용한다:

```ts
import { CGT_TAX_BRACKETS } from "./capitalGainsTaxCalculator";
```

근속연수공제표·환산급여공제표는 이 프로젝트에 아직 없으므로 신규 상수로 정의한다(§6).

---

## 3. 구현 파일 구조

```text
src/
  data/
    retirementLumpSumInterimSettlementTaxCalculator.ts   ← 타입, 신규 상수, CGT_TAX_BRACKETS import, 프리셋, FAQ
  pages/
    tools/
      retirement-lump-sum-interim-settlement-tax-calculator.astro

public/
  scripts/
    retirement-lump-sum-interim-settlement-tax-calculator.js

src/styles/scss/pages/
  _retirement-lump-sum-interim-settlement-tax-calculator.scss
```

데이터 export prefix: `RIST_*` (Retirement Interim Settlement Tax) — slug가 길어 파일명과 별개로 코드 내 식별자는 축약형을 사용한다.

추가 등록 필수:
- `src/data/tools.ts` (category: `투자·재테크`, order는 `retirement-dc-db-calculator`(4.8) 근처에 배치, 예: 4.82)
- `src/styles/app.scss` — `@use 'scss/pages/retirement-lump-sum-interim-settlement-tax-calculator';`
- `public/sitemap.xml`
- `src/pages/index.astro` 홈 노출 (`isNew` 배지)

---

## 4. 레이아웃 방향

- `SimpleToolShell` 기반. 좌측(aside) 입력 패널, 우측(main) 결과.
- SCSS prefix: `rist-`
- 결과 상단에 **법정 중간정산 사유 체크리스트**를 고정 노출한다(계산 결과보다 먼저).

```astro
<SimpleToolShell calculatorId="retirement-lump-sum-interim-settlement-tax-calculator" pageClass="rist-page">
```

`InfoNotice` 고정 문구:

```text
근속연수공제·환산급여공제·연분연승법을 적용한 퇴직소득세 추정 계산기입니다.
실제 원천징수·신고 세액은 퇴직급여 산정 방식, 근속연수 단수 처리, 회사 규정에 따라 달라질 수 있습니다.
```

---

## 5. 데이터 모델

```ts
// src/data/retirementLumpSumInterimSettlementTaxCalculator.ts

export type InterimSettlementReason =
  | "home-purchase"          // 무주택자 주택구입
  | "housing-deposit"        // 무주택자 전세금·임차보증금
  | "medical-care"           // 본인·배우자·부양가족 6개월 이상 요양
  | "bankruptcy"             // 파산선고
  | "individual-rehab"       // 개인회생절차 개시
  | "wage-peak"              // 임금피크제 시행
  | "working-hours-cut"      // 근로시간 단축으로 퇴직급여 감소
  | "disaster"               // 천재지변 등 고용노동부장관 고시 사유
  | "none";                  // 해당 사유 없음(적격 여부 확인 필요)

export interface RistInput {
  reason: InterimSettlementReason;
  hireDate: string;                 // YYYY-MM-DD, 근속연수 계산 기준
  settlementDate: string;           // YYYY-MM-DD, 중간정산 예정일/완료일
  settlementAmount: number;         // 중간정산 지급액(세전)
  futureRetireDate: string;         // YYYY-MM-DD, 비교용 최종 퇴직 예상일
  futureTotalPay: number;           // 비교용, 중간정산 없이 한 번에 받았다고 가정할 총 퇴직급여
}

export interface RistTaxBreakdown {
  years: number;                    // 근속연수(올림 처리 후)
  serviceDeduction: number;         // 근속연수공제
  convertedIncome: number;          // 환산급여
  convertedDeduction: number;       // 환산급여공제
  taxBase: number;                  // 과세표준
  bracketLabel: string;             // 적용된 종합소득세 구간 라벨
  calculatedTax: number;            // 산출세액(연분연승 환산 후)
  localTax: number;                 // 지방소득세(10%)
  totalTax: number;                 // 최종 납부세액
}

export interface RistResult {
  reasonEligible: boolean;          // 법정 사유 해당 여부
  interim: RistTaxBreakdown;        // 시나리오 A: 지금 중간정산
  interimNetAmount: number;         // 중간정산 지급액 - interim.totalTax
  continuedProrated: RistTaxBreakdown; // 시나리오 B: 계속근무 가정, 전체 근속연수로 1회 계산
  continuedProratedTax: number;     // 시나리오 B 세액을 정산 시점 근속연수 비율로 환산한 값(비교용)
  taxDifference: number;            // interim.totalTax - continuedProratedTax (양수면 중간정산이 더 불리)
  serviceYearsAtSettlement: number; // 정산 시점까지 근속연수(올림 전 원값, 표시용)
  totalServiceYears: number;        // 전체 근속연수(비교 시나리오, 올림 전 원값)
}

export interface RistPreset {
  id: string;
  label: string;
  summary: string;
  input: Partial<RistInput>;
}
```

---

## 6. 기준 데이터

### 6-1. 법정 중간정산 사유

```ts
export const RIST_REASONS: { id: InterimSettlementReason; label: string; detail: string }[] = [
  { id: "home-purchase", label: "무주택자 주택구입", detail: "근로자 본인 명의로 주택을 구입하는 경우" },
  { id: "housing-deposit", label: "무주택자 전세금·임차보증금", detail: "하나의 사업장에서 근무하는 동안 1회로 한정" },
  { id: "medical-care", label: "본인·배우자·부양가족 요양", detail: "6개월 이상 요양이 필요하고 연간 임금총액의 12.5%를 초과해 부담하는 경우" },
  { id: "bankruptcy", label: "파산선고", detail: "중간정산 신청일로부터 5년 이내" },
  { id: "individual-rehab", label: "개인회생절차 개시", detail: "중간정산 신청일로부터 5년 이내" },
  { id: "wage-peak", label: "임금피크제 시행", detail: "사용자가 임금피크제를 도입해 임금이 감소하는 경우" },
  { id: "working-hours-cut", label: "근로시간 단축", detail: "소정근로시간 단축으로 퇴직급여가 감소하는 경우" },
  { id: "disaster", label: "천재지변 등", detail: "고용노동부장관이 정하는 재난 피해 등" },
  { id: "none", label: "해당 사유 없음", detail: "위 사유에 해당하지 않으면 중간정산이 제한될 수 있습니다" },
];
```

### 6-2. 근속연수공제표

```ts
export const RIST_SERVICE_YEAR_DEDUCTION_TIERS = [
  { maxYears: 5,        base: 0,          perYear: 1_000_000, fromYear: 0 },
  { maxYears: 10,       base: 5_000_000,  perYear: 2_000_000, fromYear: 5 },
  { maxYears: 20,       base: 15_000_000, perYear: 2_500_000, fromYear: 10 },
  { maxYears: Infinity, base: 40_000_000, perYear: 3_000_000, fromYear: 20 },
];
// 근속연수공제 = tier.base + tier.perYear × (years - tier.fromYear)
```

### 6-3. 환산급여공제표

```ts
export const RIST_CONVERTED_INCOME_DEDUCTION_TIERS = [
  { maxIncome: 8_000_000,   base: 0,           rate: 1.00, fromIncome: 0 },
  { maxIncome: 70_000_000,  base: 8_000_000,   rate: 0.60, fromIncome: 8_000_000 },
  { maxIncome: 100_000_000, base: 45_200_000,  rate: 0.55, fromIncome: 70_000_000 },
  { maxIncome: 300_000_000, base: 61_700_000,  rate: 0.45, fromIncome: 100_000_000 },
  { maxIncome: Infinity,    base: 151_700_000, rate: 0.35, fromIncome: 300_000_000 },
];
// 환산급여공제 = tier.base + tier.rate × (convertedIncome - tier.fromIncome)
```

### 6-4. 정책 메타

```ts
export const RIST_META = {
  title: "퇴직금 중간정산 세금 계산기",
  seoTitle: "퇴직금 중간정산 세금 계산기 2026 | 세금 얼마나 더 낼까 바로 계산",
  description: "중간정산 근속연수와 정산금액을 입력하면 퇴직소득세를 바로 계산합니다. 중간정산 없이 계속 근무했을 때와 세금 차이까지 비교. 법정 중간정산 사유 체크리스트 포함.",
  caution: "이 계산기는 근속연수공제·환산급여공제·연분연승법을 적용한 퇴직소득세 추정 계산기입니다. 실제 원천징수·신고 세액은 퇴직급여 산정 방식, 근속연수 단수 처리, 회사 규정에 따라 달라질 수 있습니다.",
  sourceNote: "소득세법 §55(퇴직소득세 계산), 근로자퇴직급여보장법 시행령 제3조(중간정산 사유) 기준",
};
```

---

## 7. 계산 로직

### 7-1. 근속연수 계산 (날짜 기반)

```text
근속연수(원값) = (종료일 - 시작일) 일수 ÷ 365.25
근속연수(올림) = max(1, ceil(근속연수(원값)))   // 1년 미만은 1년, 소수점 이하는 올림
```

> ⚠️ 근속연수 단수 처리(특히 "1개월 미만은 1개월로, 1년 미만은 1년으로 본다"는 세부 조문 해석)는 구현 직전 최신 예규로 재확인한다(기획서 §3-3). MVP는 위 올림 처리를 기본값으로 한다.

### 7-2. 퇴직소득세 계산 함수 (공통 — 두 시나리오 모두 이 함수 재사용)

```text
function calcRetirementTax(totalPay, rawServiceYears):
  years = max(1, ceil(rawServiceYears))
  serviceDeduction = getServiceYearDeduction(years)          // §6-2
  convertedIncome = max(0, totalPay - serviceDeduction) × 12 / years
  convertedDeduction = getConvertedIncomeDeduction(convertedIncome)  // §6-3
  taxBase = max(0, convertedIncome - convertedDeduction)
  bracket = CGT_TAX_BRACKETS에서 taxBase ≤ limit인 첫 구간
  convertedTax = max(0, taxBase × bracket.rate − bracket.cumDed)
  calculatedTax = convertedTax × years / 12
  localTax = calculatedTax × 0.1
  totalTax = calculatedTax + localTax
  return { years, serviceDeduction, convertedIncome, convertedDeduction, taxBase, bracketLabel: bracket.label, calculatedTax, localTax, totalTax }
```

### 7-3. 두 시나리오 비교

```text
serviceYearsAtSettlement = calcServiceYears(hireDate, settlementDate)
totalServiceYears        = calcServiceYears(hireDate, futureRetireDate)

interim            = calcRetirementTax(settlementAmount, serviceYearsAtSettlement)
continuedFull      = calcRetirementTax(futureTotalPay, totalServiceYears)

// 시나리오 B(계속근무 가정)의 세액을 "정산 시점까지 근속기간에 해당하는 비율"로 환산해
// 시나리오 A와 같은 저울 위에서 비교한다 (근속연수·급여 총량이 다른 두 계산을 그대로 빼면 오해 소지가 있음)
continuedProratedTax = continuedFull.totalTax × (serviceYearsAtSettlement(올림 후 years) / totalServiceYears(올림 후 years))

taxDifference = interim.totalTax − continuedProratedTax
```

결과 화면에는 `continuedProrated`(= `continuedFull`의 세부 breakdown, 표시는 위 비례 환산값 기준)와 `taxDifference`를 함께 보여주고, **"두 시나리오는 근속연수·급여 총량이 다른 가정 비교이므로 참고용"**이라는 문구를 반드시 노출한다(기획서 §6-2 원칙).

### 7-4. 사유 적격 여부

```text
reasonEligible = (input.reason !== "none")
```

`reason === "none"`이면 결과 상단에 "법정 중간정산 사유에 해당하지 않으면 중간정산 자체가 제한될 수 있습니다"라는 경고 카드를 최우선으로 노출한다(세금 계산 결과보다 위).

---

## 8. 프리셋

```ts
export const RIST_PRESETS: RistPreset[] = [
  {
    id: "home-purchase-case",
    label: "무주택자 주택구입 자금",
    summary: "8년차 · 5,000만원",
    input: {
      reason: "home-purchase",
      hireDate: "2018-08-05",
      settlementDate: "2026-08-05",
      settlementAmount: 50_000_000,
      futureRetireDate: "2038-08-05",
      futureTotalPay: 200_000_000,
    },
  },
  {
    id: "wage-peak-case",
    label: "임금피크제 도입",
    summary: "25년차 · 2억원",
    input: {
      reason: "wage-peak",
      hireDate: "2001-08-05",
      settlementDate: "2026-08-05",
      settlementAmount: 200_000_000,
      futureRetireDate: "2028-08-05",
      futureTotalPay: 220_000_000,
    },
  },
  {
    id: "housing-deposit-case",
    label: "전세보증금 마련",
    summary: "4년차 · 2,000만원",
    input: {
      reason: "housing-deposit",
      hireDate: "2022-08-05",
      settlementDate: "2026-08-05",
      settlementAmount: 20_000_000,
      futureRetireDate: "2036-08-05",
      futureTotalPay: 150_000_000,
    },
  },
  {
    id: "medical-care-case",
    label: "6개월 요양비 부담",
    summary: "15년차 · 1억2,000만원",
    input: {
      reason: "medical-care",
      hireDate: "2011-08-05",
      settlementDate: "2026-08-05",
      settlementAmount: 120_000_000,
      futureRetireDate: "2031-08-05",
      futureTotalPay: 160_000_000,
    },
  },
];
```

---

## 9. 페이지 IA

1. **Hero** — 제목: "퇴직금 중간정산 세금 계산기", 부제: "중간정산 받으면 세금을 더 낼 수도 있습니다 — 계속근무 시나리오와 바로 비교하세요"
2. **InfoNotice** — 연분연승법 적용 고지, 참고용 추정 고지
3. **프리셋 버튼 4개**
4. **법정 중간정산 사유 선택** (§6-1 체크리스트, select 또는 radio)
5. **입력 패널** — 입사일, 정산일, 정산금액, [비교용] 예상 최종 퇴직일·예상 최종 퇴직급여
6. **사유 부적격 경고 카드** (`reason === "none"`일 때만 최상단 노출)
7. **KPI 카드 4개** — 중간정산 실수령액 / 중간정산 세금 / 계속근무 가정 비례 세금 / 세금 차이
8. **공제 구조 비교 그래프** — 두 시나리오의 근속연수공제·환산급여공제 막대그래프
9. **계산 과정 상세 표** — 두 시나리오 각각의 §7-2 단계별 값(근속연수→공제→환산급여→과세표준→세액)을 나란히 표로 노출
10. **자연어 결과 메시지**
11. **SeoContent** (FAQ 포함)

---

## 10. 입력 UI 상세

| 필드 | 타입 | 기본값 | 유효성 | 보조 문구 |
|---|---|---:|---|---|
| 중간정산 사유 | select | `home-purchase` | — | "법정 사유에 해당하지 않으면 중간정산이 제한될 수 있습니다" |
| 입사일 | date | 2018-08-05 | ≤ 정산일 | "근속연수 계산 기준일입니다" |
| 중간정산일 | date | 오늘 | ≥ 입사일 | — |
| 중간정산 지급액 | number(원) | 50,000,000 | min 0 | "세전 정산 예정 금액을 입력하세요" |
| [비교용] 예상 최종 퇴직일 | date | 입사일+20년 자동 제안 | ≥ 정산일 | "중간정산 없이 계속 근무했다고 가정할 시점" |
| [비교용] 예상 최종 퇴직급여 총액 | number(원) | 정산금액 비례 자동 제안 | min 0 | "중간정산 없이 한 번에 받았다고 가정할 총액" |

---

## 11. 결과 UI 상세

### 11-1. 사유 부적격 경고 카드 (조건부, 최상단)

```text
⚠ 선택한 사유로는 중간정산이 제한될 수 있습니다.
법정 중간정산 사유(주택구입·전세보증금·요양·파산·개인회생·임금피크제·근로시간 단축·재난)를 다시 확인하세요.
```

### 11-2. KPI 카드

| 카드 | 레이블 | 표시값 | 스타일 |
|---|---|---|---|
| Main | 중간정산 실수령액 | X만 원 | `rist-kpi-card--main` |
| Accent | 중간정산 예상 퇴직소득세 | X만 원 | — |
| 일반 | 계속근무 가정 시 비례 환산 세금 | X만 원 | — |
| 강조 | 중간정산으로 인한 세금 차이 | ±X만 원 | 양수(불리) 빨강 / 음수(유리) 파랑 |

### 11-3. 공제 구조 비교 (막대그래프)

```text
┌───────────────┬───────────────┐
│  중간정산      │  계속근무 가정  │
├───────────────┼───────────────┤
│ 근속연수 N년   │ 근속연수 M년   │
│ 근속연수공제 X │ 근속연수공제 Y │
│ 환산급여공제 X │ 환산급여공제 Y │
└───────────────┴───────────────┘
```

### 11-4. 계산 과정 상세 표

| 단계 | 중간정산 | 계속근무 가정 |
|---|---:|---:|
| 근속연수 | N년 | M년 |
| 근속연수공제 | X원 | Y원 |
| 환산급여 | X원 | Y원 |
| 환산급여공제 | X원 | Y원 |
| 과세표준 | X원 | Y원 |
| 적용 세율 구간 | 라벨 | 라벨 |
| 산출세액 | X원 | Y원 |
| 지방소득세 | X원 | Y원 |
| 최종 납부세액 | X원 | Y원 |

### 11-5. 자연어 결과 메시지

```text
입사 후 8년차에 5,000만원을 중간정산 받으면
예상 퇴직소득세는 약 42만 원, 실수령액은 약 4,958만 원으로 추정됩니다.

같은 조건에서 중간정산 없이 20년을 채우고 한 번에 받았다고 가정하면
정산 시점 근속기간 비율로 환산한 세금은 약 XX만 원으로,
중간정산을 받을 경우 약 OO만 원의 세금을 더 낼 수 있는 구조로 추정됩니다.

다만 이는 근속연수·급여 가정이 다른 두 시나리오의 참고 비교이며,
중간정산은 자금을 미리 활용할 수 있다는 장점도 있으니
세금 차이와 자금 필요성을 함께 고려해 결정하는 것이 안전합니다.
```

---

## 12. JavaScript 설계

```js
// public/scripts/retirement-lump-sum-interim-settlement-tax-calculator.js
(() => {
  const DATA = JSON.parse(document.getElementById('rist-data').textContent);
  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  const state = {
    reason: 'home-purchase',
    hireDate: '2018-08-05',
    settlementDate: new Date().toISOString().slice(0, 10),
    settlementAmount: 50000000,
    futureRetireDate: '2038-08-05',
    futureTotalPay: 200000000,
  };

  function q(sel) { return document.querySelector(sel); }
  function qa(sel) { return Array.from(document.querySelectorAll(sel)); }
  function num(v, fallback = 0) {
    const n = Number(String(v ?? '').replace(/,/g, ''));
    return Number.isFinite(n) ? Math.max(0, n) : fallback;
  }
  function fmtMan(n) { return Math.round(n / 10000).toLocaleString('ko-KR') + '만 원'; }

  function calcServiceYears(startStr, endStr) {
    const start = new Date(startStr);
    const end = new Date(endStr);
    const days = (end - start) / MS_PER_DAY;
    return Math.max(0, days / 365.25);
  }

  function getServiceYearDeduction(years) {
    const tier = DATA.serviceYearTiers.find(t => years <= t.maxYears);
    return tier.base + tier.perYear * (years - tier.fromYear);
  }

  function getConvertedIncomeDeduction(income) {
    const tier = DATA.convertedIncomeTiers.find(t => income <= t.maxIncome);
    return tier.base + tier.rate * (income - tier.fromIncome);
  }

  function findTaxBracket(base) {
    return DATA.taxBrackets.find(b => base <= b.limit);
  }

  function calcRetirementTax(totalPay, rawServiceYears) {
    const years = Math.max(1, Math.ceil(rawServiceYears));
    const serviceDeduction = getServiceYearDeduction(years);
    const convertedIncome = Math.max(0, totalPay - serviceDeduction) * 12 / years;
    const convertedDeduction = getConvertedIncomeDeduction(convertedIncome);
    const taxBase = Math.max(0, convertedIncome - convertedDeduction);
    const bracket = findTaxBracket(taxBase);
    const convertedTax = Math.max(0, taxBase * bracket.rate - bracket.cumDed);
    const calculatedTax = convertedTax * years / 12;
    const localTax = calculatedTax * 0.1;
    const totalTax = calculatedTax + localTax;

    return {
      years, serviceDeduction, convertedIncome, convertedDeduction,
      taxBase, bracketLabel: bracket.label, calculatedTax, localTax, totalTax,
    };
  }

  function calculate(s) {
    const serviceYearsAtSettlement = calcServiceYears(s.hireDate, s.settlementDate);
    const totalServiceYears = calcServiceYears(s.hireDate, s.futureRetireDate);

    const interim = calcRetirementTax(s.settlementAmount, serviceYearsAtSettlement);
    const continuedFull = calcRetirementTax(s.futureTotalPay, totalServiceYears);

    const continuedProratedTax = continuedFull.totalTax *
      (interim.years / continuedFull.years);

    return {
      reasonEligible: s.reason !== 'none',
      interim,
      interimNetAmount: s.settlementAmount - interim.totalTax,
      continuedProrated: continuedFull,
      continuedProratedTax,
      taxDifference: interim.totalTax - continuedProratedTax,
      serviceYearsAtSettlement,
      totalServiceYears,
    };
  }

  function renderReasonWarning(result) {}
  function renderKpis(result) {}
  function renderBreakdownTable(result) {}
  function renderMessage(result, state) {}
  function syncUrl(state) {}
  function restoreFromUrl() {}
  function applyPreset(id) {
    const preset = DATA.presets.find(p => p.id === id);
    if (!preset) return;
    Object.assign(state, preset.input);
    reflectStateToInputs();
    update();
  }
  function reflectStateToInputs() {}

  function readInputs() {
    state.reason = q('[data-rist="reason"]')?.value || 'home-purchase';
    state.hireDate = q('[data-rist="hireDate"]')?.value || state.hireDate;
    state.settlementDate = q('[data-rist="settlementDate"]')?.value || state.settlementDate;
    state.settlementAmount = num(q('[data-rist="settlementAmount"]')?.value, 50000000);
    state.futureRetireDate = q('[data-rist="futureRetireDate"]')?.value || state.futureRetireDate;
    state.futureTotalPay = num(q('[data-rist="futureTotalPay"]')?.value, 200000000);
  }

  function update() {
    readInputs();
    const result = calculate(state);
    renderReasonWarning(result);
    renderKpis(result);
    renderBreakdownTable(result);
    renderMessage(result, state);
    syncUrl(state);
  }

  function bindEvents() {
    qa('[data-rist]').forEach(el => {
      el.addEventListener('input', update);
      el.addEventListener('change', update);
    });
    qa('[data-rist-preset]').forEach(btn => {
      btn.addEventListener('click', () => applyPreset(btn.dataset.ristPreset));
    });
  }

  restoreFromUrl();
  bindEvents();
  update();
})();
```

URL 파라미터: `reason / hire / settle / amount / retire / futurePay`

데이터 주입(`script#rist-data`)에는 `serviceYearTiers`(§6-2), `convertedIncomeTiers`(§6-3), `taxBrackets`(§2, `CGT_TAX_BRACKETS` 그대로), `presets`(§8)를 JSON으로 직렬화해 astro 페이지에서 전달한다.

---

## 13. SCSS 설계 (핵심 발췌)

```scss
.rist-page {
  .rist-warning-card {
    border: 1px solid #fecaca;
    background: #fef2f2;
    border-radius: 12px;
    padding: 14px 16px;
    color: #991b1b;
    font-size: 0.88rem;
    margin-bottom: 16px;

    &[hidden] { display: none; }
  }

  .rist-kpi-card--diff {
    &[data-sign="positive"] strong { color: #dc2626; } // 세금 늘어남
    &[data-sign="negative"] strong { color: #1a56db; } // 세금 줄어듦
  }

  .rist-compare-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-top: 20px;
  }

  .rist-breakdown-table-wrap {
    overflow-x: auto;
    margin-top: 20px;
  }

  .rist-breakdown-table {
    width: 100%;
    min-width: 560px;
    border-collapse: collapse;
    font-size: 0.84rem;

    th, td {
      padding: 10px 12px;
      border-bottom: 1px solid #e8ede9;
      text-align: left;
    }

    th {
      background: #f8fcfa;
      font-weight: 800;
      color: #374151;
    }
  }

  @media (max-width: 720px) {
    .rist-compare-grid {
      grid-template-columns: 1fr;
    }
  }
}
```

---

## 14. SEO 설계

```text
title: 퇴직금 중간정산 세금 계산기 2026 | 세금 얼마나 더 낼까 바로 계산
description: 중간정산 근속연수와 정산금액을 입력하면 퇴직소득세를 바로 계산합니다. 중간정산 없이 계속 근무했을 때와 세금 차이까지 비교. 법정 중간정산 사유 체크리스트 포함.
H1: 퇴직금 중간정산 세금 계산기
```

키워드: 퇴직금 중간정산 세금 계산기, 퇴직소득세 계산기, 퇴직금 중간정산 사유, 퇴직금 중간정산 불이익, 근속연수공제

---

## 15. SeoContent 초안

### intro

1. 퇴직금 중간정산을 받으면 그 시점까지의 근속연수로 퇴직소득세를 미리 정산하고, 이후 근속연수는 정산일 다음날부터 다시 0에서 시작됩니다. 문제는 퇴직소득세의 핵심 공제 장치인 근속연수공제와 환산급여공제가 모두 근속연수·소득 구간이 커질수록 유리해지는 누진 구조라는 점입니다.
2. 이 계산기는 지금 중간정산을 받을 경우의 예상 퇴직소득세와, 중간정산 없이 계속 근무하다 같은 시점에 한 번에 정산했다고 가정할 경우의 예상 퇴직소득세를 같은 계산식(소득세법 §55 연분연승법)으로 나란히 비교합니다.
3. 법정 중간정산 사유(무주택자 주택구입, 전세보증금, 6개월 이상 요양, 파산·개인회생, 임금피크제, 근로시간 단축 등)에 해당하지 않으면 애초에 중간정산이 제한될 수 있어, 계산 전에 먼저 확인하는 것이 안전합니다.

### criteria

- 근속연수공제·환산급여공제·종합소득세 누진세율은 소득세법 §55 기준입니다.
- 법정 중간정산 사유는 근로자퇴직급여보장법 시행령 제3조 기준입니다.
- 두 시나리오 비교는 근속연수·급여 총량이 다른 가정 간 참고용 비교이며, 실제 세액은 원천징수·신고 시 달라질 수 있습니다.

### FAQ

```ts
export const RIST_FAQ = [
  { question: "중간정산을 받으면 나중에 세금을 더 내나요?", answer: "근속연수공제와 환산급여공제가 근속연수·소득 구간이 클수록 유리해지는 구조라, 중간정산으로 근속연수가 쪼개지면 총 공제액이 줄어들어 세금이 늘어나는 경우가 많습니다. 다만 근속연수 구간, 금액에 따라 차이가 달라질 수 있어 이 계산기로 직접 비교하는 것이 정확합니다." },
  { question: "아무 때나 중간정산을 받을 수 있나요?", answer: "아니요. 무주택자 주택구입, 전세보증금 부담, 6개월 이상 요양, 파산·개인회생, 임금피크제 도입, 근로시간 단축 등 법정 사유가 있어야 합니다." },
  { question: "중간정산 후 근속연수는 어떻게 되나요?", answer: "중간정산일 다음날부터 근속연수가 다시 0부터 계산됩니다. 최종 퇴직 시에는 정산일 이후 근속기간만으로 퇴직소득세를 다시 계산합니다." },
  { question: "전세보증금 때문에 중간정산을 받았는데 또 받을 수 있나요?", answer: "전세금·임차보증금 사유는 하나의 사업장에서 근무하는 동안 1회로 한정됩니다." },
  { question: "이 계산기 결과가 실제 원천징수 금액과 같나요?", answer: "같지 않을 수 있습니다. 실제 세액은 회사의 원천징수 방식, 근속연수 단수 처리, 퇴직급여 산정 방식에 따라 달라질 수 있어 참고용으로만 사용해야 합니다." },
];
```

---

## 16. 관련 링크

- `/tools/retirement/` — 퇴직금 총액 산정
- `/tools/retirement-dc-db-calculator/` — DB/DC 전환 유불리 비교
- `/tools/peak-wage-retirement-calculator/` — 임금피크제 사유로 중간정산을 고려하는 사용자 연결
- `/tools/capital-gains-tax-calculator/` — 같은 소득세법 누진세율표를 쓰는 계산기 상호 연결

---

## 17. QA 체크리스트

- [ ] `CGT_TAX_BRACKETS`를 재정의 없이 import해서 사용하는지 확인 (중복 상수 금지)
- [ ] 근속연수 1년 미만 입력 시 최소 1년으로 처리되는지 확인
- [ ] 중간정산 사유가 `none`일 때 경고 카드가 KPI 결과보다 먼저 노출되는지 확인
- [ ] 두 시나리오(중간정산 / 계속근무 가정)의 계산 과정 상세 표가 나란히 정확히 표시되는지 확인
- [ ] `taxDifference`가 음수일 때(중간정산이 오히려 유리한 경우) 색상·문구가 올바르게 전환되는지 확인
- [ ] 입사일 > 정산일, 정산일 > 예상 최종 퇴직일처럼 잘못된 날짜 입력 시 방어 처리 확인
- [ ] 정산금액 0원 입력 시 NaN 미노출
- [ ] 4개 프리셋 적용 시 입력값·결과가 올바르게 갱신되는지 확인
- [ ] 계산 과정 상세 표가 모바일에서 가로 스크롤로 정상 표시되는지 확인
- [ ] URL 파라미터 복원 정상 동작
- [ ] "실제 원천징수·신고 세액과 다를 수 있다" 고지 문구가 화면에 노출되는지 확인
- [ ] `tools.ts`, `app.scss`, `sitemap.xml` 등록 완료
- [ ] `npm run build` 성공
