# 설계 문서
## 명절 상여금 실수령 계산기

> 기획 원본: `docs/plan/202607/chuseok-content-cluster-2026-plan.md` (§4-1)
> 신규 구현 페이지: `/tools/holiday-bonus-after-tax-calculator/`
> 참고 재사용: `/tools/bonus-after-tax-calculator/` (`src/data/bonusAfterTaxCalculator.ts`) — 세금·4대보험 계산 구조를 그대로 재사용하고, 지급 방식·프리셋·카피만 명절 상여에 맞게 단순화한다.

---

## 0. 구현 개요

| 항목 | 값 |
|---|---|
| slug | `holiday-bonus-after-tax-calculator` |
| 페이지 경로 | `src/pages/tools/holiday-bonus-after-tax-calculator.astro` |
| 데이터 파일 | `src/data/holidayBonusAfterTaxCalculator.ts` |
| 스크립트 | `public/scripts/holiday-bonus-after-tax-calculator.js` |
| SCSS | `src/styles/scss/pages/_holiday-bonus-after-tax-calculator.scss` |
| SCSS/데이터 prefix | `hbc-` / `HBC_` |
| 레이아웃 | `SimpleToolShell` (`pageClass="hbc-page"`) |
| 홈 tools 카테고리 | `category: "성과급·세금"` |
| 주요 CTA | `/tools/bonus-after-tax-calculator/`, `/tools/salary/`, `/tools/overtime-pay-calculator/` |
| 발행 목표 | 2026-08 초 (9월 추석 상여 지급 전) |

---

## 1. 제품 방향

### 1-1. 한 줄 정의

`명절 상여금(추석·설 떡값)도 전액 과세 근로소득이라는 점을 명확히 하고, 연봉·부양가족·지급월을 입력해 세후 실수령액을 계산하는 계산기`

### 1-2. 기존 `bonus-after-tax-calculator`와 차별점

| 구분 | `bonus-after-tax-calculator` | `holiday-bonus-after-tax-calculator` |
|---|---|---|
| 타깃 검색어 | 성과급 세후 실수령액, 성과급 세금 | 추석 상여금 실수령, 명절 떡값 세금, 설 상여금 실수령 |
| 지급 방식 옵션 | 일시불/2회/4회 분할 | **일시불 고정** (명절 상여는 분할 지급이 드묾 — UI 단순화) |
| 프리셋 금액 | 500만~1억 원(성과급 스케일) | **20만~500만 원**(명절 떡값·상여 스케일, §3-4) |
| 지급월 기본값 | 2월 | **9월(추석) 고정, 설 프리셋은 1~2월로 전환** |
| 핵심 FAQ | 세금 일반 안내 | **"떡값은 비과세다" 통설 정정**이 1번 FAQ |

계산 로직(세율표, 4대보험 요율)은 `BAT_TAX_BRACKETS`, `BAT_INSURANCE_CONFIGS`(§3-2)와 동일한 값을 이 파일에도 복제해 사용한다. 이 저장소는 `public/scripts/*.js`가 번들러 없이 개별 로드되므로 크로스 파일 import가 불가능하다 — 기존 계산기들도 상수를 페이지별로 복제하는 방식을 쓰고 있어(예: 각 연봉 계산기의 4대보험 요율표) 이 컨벤션을 따른다.

### 1-3. 피해야 할 것

- "명절 떡값은 비과세"라는 흔한 오해를 방치하는 문구
- 회사마다 다른 명절 상여 지급 관행(법정 의무 아님)을 "모든 회사가 준다"처럼 서술
- 정확한 회사 원천징수 로직과 100% 일치한다는 인상

---

## 2. SEO 설계

### 2-1. 메타

```ts
export const HBC_META = {
  slug: "holiday-bonus-after-tax-calculator",
  title: "명절 상여금 실수령 계산기",
  description:
    "추석·설 상여금(떡값)도 전액 과세 근로소득입니다. 연봉과 부양가족을 입력해 세후 실수령액을 계산하세요.",
  seoTitle: "명절 상여금 실수령 계산기 | 추석 떡값 세후 금액 바로 계산",
  seoDescription:
    "추석·설 상여금과 떡값도 전액 과세 대상 근로소득입니다. 연봉, 부양가족 수, 지급월을 입력하면 소득세·4대보험을 뺀 세후 실수령액을 바로 계산합니다.",
  updatedAt: "2026-07",
  dataNote:
    "이 계산기는 근로소득 간이세액표 전체를 대체하지 않는 간이 추정 도구입니다. 실제 원천징수액과 연말정산 결과는 회사 급여 시스템, 부양가족, 지급월, 보험료 상한에 따라 달라질 수 있습니다.",
};
```

### 2-2. H1 / Hero

```astro
<CalculatorHero
  eyebrow="명절 상여금 실수령"
  title={HBC_META.title}
  description="추석·설 상여금과 떡값도 전액 과세 근로소득입니다. 연봉과 부양가족을 입력하면 세후 실수령액을 계산합니다."
  badges={["추석", "설", "떡값도 과세", "2026"]}
/>
```

### 2-3. 키워드 매핑

| 키워드 | 노출 위치 |
|---|---|
| 명절 상여금 실수령 | title, H1, FAQ |
| 추석 상여금 세금 | Hero description, FAQ |
| 떡값 비과세 | FAQ (오해 정정) |
| 설 상여금 실수령 | 프리셋, FAQ |
| 명절 보너스 세후 | 결과 패널 |

---

## 3. 데이터 파일 설계

파일: `src/data/holidayBonusAfterTaxCalculator.ts`

### 3-1. 타입 (BAT와 동일 구조, 필드만 축소)

```ts
export type HolidayType = "chuseok" | "seollal" | "other";

export interface HolidayBonusInput {
  taxYear: number;
  bonusGrossAmount: number;
  annualSalary: number;
  holidayType: HolidayType;
  paymentMonth: number;
  dependentCount: number;
  childUnder20Count: number;
  includeSocialInsurance: boolean;
  incomeTaxMode: "simple" | "conservative";
}

export interface HolidayBonusResult {
  grossAmount: number;
  incomeTax: number;
  localIncomeTax: number;
  nationalPension: number;
  healthInsurance: number;
  longTermCare: number;
  employmentInsurance: number;
  totalDeduction: number;
  netAmount: number;
  netRate: number; // netAmount / grossAmount * 100
}
```

### 3-2. 세율·요율 (BAT_TAX_BRACKETS·BAT_INSURANCE_CONFIGS 값 그대로 복제)

```ts
export const HBC_TAX_BRACKETS = [
  { minAnnualSalary: 0, maxAnnualSalary: 50_000_000, baseWithholdingRate: 8, conservativeRate: 10, label: "5천만 원 이하" },
  { minAnnualSalary: 50_000_000, maxAnnualSalary: 80_000_000, baseWithholdingRate: 12, conservativeRate: 15, label: "5천만~8천만 원" },
  { minAnnualSalary: 80_000_000, maxAnnualSalary: 120_000_000, baseWithholdingRate: 18, conservativeRate: 22, label: "8천만~1.2억 원" },
  { minAnnualSalary: 120_000_000, maxAnnualSalary: 200_000_000, baseWithholdingRate: 24, conservativeRate: 28, label: "1.2억~2억 원" },
  { minAnnualSalary: 200_000_000, maxAnnualSalary: null, baseWithholdingRate: 30, conservativeRate: 35, label: "2억 원 초과" },
];

export const HBC_INSURANCE_CONFIG = {
  year: 2026,
  nationalPensionEmployeeRate: 4.75,
  nationalPensionMonthlyIncomeMax: 6_370_000,
  healthInsuranceEmployeeRate: 3.595,
  longTermCareRateOnHealthInsurance: 13.14,
  employmentInsuranceEmployeeRate: 0.9,
};
```

> 구현 시 `bonus-after-tax-calculator` 쪽 값이 먼저 갱신되면 이 파일도 함께 갱신한다(두 계산기 값이 어긋나면 신뢰도 문제가 생기므로, 구현 체크리스트에 "두 파일 동일 여부 확인" 항목을 둔다 — §8).

### 3-3. 계산 함수

```ts
export function calcHolidayBonus(input: HolidayBonusInput): HolidayBonusResult {
  const bracket = HBC_TAX_BRACKETS.find(
    (b) => input.annualSalary >= b.minAnnualSalary && (b.maxAnnualSalary === null || input.annualSalary < b.maxAnnualSalary)
  )!;
  const rate = input.incomeTaxMode === "conservative" ? bracket.conservativeRate : bracket.baseWithholdingRate;
  const dependentDeduction = Math.min(input.dependentCount * 0.5, 3) + input.childUnder20Count * 0.3; // 부양가족 간이 보정(%p 차감), bonus-after-tax-calculator 로직과 동일 방식 유지
  const effectiveRate = Math.max(rate - dependentDeduction, 0);

  const incomeTax = Math.round((input.bonusGrossAmount * effectiveRate) / 100);
  const localIncomeTax = Math.round(incomeTax * 0.1);

  let nationalPension = 0, healthInsurance = 0, longTermCare = 0, employmentInsurance = 0;
  if (input.includeSocialInsurance) {
    const pensionBase = Math.min(input.bonusGrossAmount, HBC_INSURANCE_CONFIG.nationalPensionMonthlyIncomeMax);
    nationalPension = Math.round((pensionBase * HBC_INSURANCE_CONFIG.nationalPensionEmployeeRate) / 100);
    healthInsurance = Math.round((input.bonusGrossAmount * HBC_INSURANCE_CONFIG.healthInsuranceEmployeeRate) / 100);
    longTermCare = Math.round((healthInsurance * HBC_INSURANCE_CONFIG.longTermCareRateOnHealthInsurance) / 100);
    employmentInsurance = Math.round((input.bonusGrossAmount * HBC_INSURANCE_CONFIG.employmentInsuranceEmployeeRate) / 100);
  }

  const totalDeduction = incomeTax + localIncomeTax + nationalPension + healthInsurance + longTermCare + employmentInsurance;
  const netAmount = input.bonusGrossAmount - totalDeduction;

  return {
    grossAmount: input.bonusGrossAmount,
    incomeTax, localIncomeTax, nationalPension, healthInsurance, longTermCare, employmentInsurance,
    totalDeduction, netAmount,
    netRate: Math.round((netAmount / input.bonusGrossAmount) * 1000) / 10,
  };
}
```

`bonus-after-tax-calculator`의 실제 부양가족 보정식과 정확히 맞추려면 구현 직전 `public/scripts/bonus-after-tax-calculator.js`의 `calculateForGross` 함수(§0 참고: 이미 존재)를 열어 동일한 보정 로직을 그대로 옮긴다 — 위 공식은 설계 의도를 보여주는 참고용이며 최종 계수는 원본 스크립트 기준으로 맞춘다.

### 3-4. 프리셋 (명절 상여 스케일로 축소)

```ts
export const HBC_PRESETS = [
  { id: "tteok-20m", label: "떡값 20만 원", holidayType: "chuseok", input: { bonusGrossAmount: 200_000, annualSalary: 40_000_000 } },
  { id: "bonus-50m", label: "명절 상여 50만 원", holidayType: "chuseok", input: { bonusGrossAmount: 500_000, annualSalary: 45_000_000 } },
  { id: "bonus-100m", label: "명절 상여 100만 원", holidayType: "chuseok", input: { bonusGrossAmount: 1_000_000, annualSalary: 55_000_000 } },
  { id: "bonus-200m", label: "명절 상여 200만 원", holidayType: "chuseok", input: { bonusGrossAmount: 2_000_000, annualSalary: 70_000_000 } },
  { id: "bonus-500m", label: "명절 특별 상여 500만 원", holidayType: "chuseok", input: { bonusGrossAmount: 5_000_000, annualSalary: 90_000_000 } },
];
```

(m = 만원 단위 표기가 아니라 원 단위 그대로이니 구현 시 id 네이밍은 자유롭게 조정 가능. 핵심은 금액 스케일이 성과급용 프리셋보다 훨씬 작다는 점.)

### 3-5. FAQ (오해 정정 1번 배치)

```ts
export const HBC_FAQ = [
  {
    question: "추석 떡값은 세금이 없다고 들었는데 사실인가요?",
    answer:
      "사실이 아닙니다. 명절 상여금·떡값·명절 선물세트(현물 포함)는 소득세법상 비과세 항목에 해당하지 않아 전액 과세 대상 근로소득입니다. 이름이 '떡값', '격려금', '선물비'여도 근로소득세와 4대보험 부과 대상이 될 수 있습니다.",
  },
  {
    question: "명절 상여금은 언제 세금이 빠지나요?",
    answer:
      "통상 명절이 포함된 달이나 다음 달 급여명세에 상여금을 합산해 그 급여 전체에서 원천징수합니다. 지급 대상 기간이 정해지지 않은 상여는 해당 연도 1월부터 지급월까지를 기준으로 세액을 계산합니다.",
  },
  {
    question: "회사가 현금 대신 한우 세트 같은 선물을 줘도 세금을 내나요?",
    answer:
      "회사가 이를 급여성 상여로 처리하면 근로소득세 대상입니다. 다만 회사가 복리후생비 등 별도 비용으로 처리하고 근로소득에 반영하지 않는 경우 근로자가 소득세를 부담하지 않을 수 있습니다. 실제 처리 방식은 회사 급여 담당 부서에 확인해야 합니다.",
  },
  {
    question: "부양가족이 많으면 세금이 줄어드나요?",
    answer:
      "부양가족 수와 20세 이하 자녀 수는 간이세액 계산에 영향을 줄 수 있습니다. 다만 정확한 반영은 회사의 실제 원천징수 프로그램과 연말정산에서 확정됩니다.",
  },
  {
    question: "이 계산기와 성과급 계산기 결과가 다른 이유는 무엇인가요?",
    answer:
      "세금·4대보험 계산 구조는 같지만, 이 계산기는 명절 상여 스케일(수십만~수백만 원)에 맞춘 프리셋과 지급월 기본값(9월)을 사용합니다. 큰 금액의 성과급은 `/tools/bonus-after-tax-calculator/`에서 계산하는 것이 더 적합합니다.",
  },
];
```

### 3-6. 관련 링크

```ts
export const HBC_RELATED_LINKS = [
  { href: "/tools/bonus-after-tax-calculator/", label: "성과급 세후 실수령액 계산기" },
  { href: "/tools/salary/", label: "연봉 실수령액 계산기" },
  { href: "/tools/overtime-pay-calculator/", label: "야근수당 계산기" },
  { href: "/tools/hometown-trip-cost-calculator/", label: "귀성길 교통수단 비교 계산기" },
];
```

---

## 4. 페이지 마크업 설계 (SimpleToolShell 패턴, `education-benefit-eligibility-calculator-2026.astro` 준용)

```text
[BaseLayout jsonLd=[WebApplication, FAQPage]]
  [SiteHeader]
  [SimpleToolShell calculatorId="holiday-bonus-after-tax-calculator" pageClass="hbc-page"]
    slot="hero": [CalculatorHero] + [InfoNotice]
    slot="actions": [ToolActionBar resetId="hbcResetBtn" copyId="hbcCopyBtn"]
    slot="aside":
      .panel 프리셋 그리드 (HBC_PRESETS, data-hbc-preset)
      .panel 입력 폼
        - 상여금 총액 (data-hbc-input="bonusGrossAmount")
        - 연봉 (data-hbc-input="annualSalary")
        - 지급월 select, 9월 기본값 (data-hbc-input="paymentMonth")
        - 부양가족 수 / 20세 이하 자녀 수
        - 4대보험 포함 여부 토글
    default slot (main):
      .panel.hbc-result-panel — KPI 그리드: 세전 상여금 / 총 공제액 / 세후 실수령액 / 실수령률
      .panel — 공제 내역 표 (소득세/지방소득세/국민연금/건강보험/장기요양/고용보험)
      .panel — "떡값도 과세" 설명 카드 (FAQ 1번 내용 요약, 강조 배지)
    slot="seo": [SeoContent]
  [script id="hbc-data" type="application/json"]
  [script src="/scripts/holiday-bonus-after-tax-calculator.js" defer]
```

### 4-1. 결과 KPI 카드 (data-hbc-result 매핑)

| 카드 | data 속성 |
|---|---|
| 세전 상여금 | `data-hbc-result="grossAmount"` |
| 총 공제액 | `data-hbc-result="totalDeduction"` |
| 세후 실수령액 | `data-hbc-result="netAmount"` (메인 강조) |
| 실수령률 | `data-hbc-result="netRate"` |

---

## 5. SCSS 설계

`_holiday-bonus-after-tax-calculator.scss`는 기존 `_bonus-after-tax-calculator.scss`(있다면) 또는 `_education-benefit-eligibility-calculator-2026.scss`의 `.ebe-kpi-grid`, `.panel` 패턴을 그대로 재사용한다. 신규 클래스는 최소화한다.

```scss
.hbc-page {
  .hbc-result-panel {
    .hbc-kpi-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 14px; }
  }

  .hbc-tteok-notice {
    border: 1px solid #fde68a;
    background: #fffbeb;
    border-radius: 8px;
    padding: 16px;
    font-size: 13px;
    color: #92400e;
  }

  @media (max-width: 768px) {
    .hbc-kpi-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
  }
}
```

---

## 6. 구현 순서

1. `src/data/holidayBonusAfterTaxCalculator.ts` 작성 (§3) — **구현 직전 `bonus-after-tax-calculator.js`의 실제 계산 로직을 확인해 세율·보정식을 일치시킨다.**
2. `src/pages/tools/holiday-bonus-after-tax-calculator.astro` 작성 (§4)
3. `public/scripts/holiday-bonus-after-tax-calculator.js` 작성 — `bonus-after-tax-calculator.js`를 복제 후 지급 방식(할부) 관련 코드 제거, 프리셋 교체
4. `src/styles/scss/pages/_holiday-bonus-after-tax-calculator.scss` 작성, `app.scss`에 등록
5. `src/data/tools.ts`에 등록 (`category: "성과급·세금"`)
6. `public/sitemap.xml`에 `/tools/holiday-bonus-after-tax-calculator/` 추가
7. `npm run build` 확인

---

## 7. QA 체크리스트

- [ ] "떡값도 과세"라는 정정 문구가 InfoNotice 또는 첫 화면에 바로 보이는가?
- [ ] 프리셋 5개(20만~500만 원) 전환 시 결과가 즉시 갱신되는가?
- [ ] `bonus-after-tax-calculator`와 세율·요율 값이 동일한가? (두 파일 diff 확인)
- [ ] 4대보험 미포함 토글 시 관련 항목이 0으로 표시되는가?
- [ ] 모바일에서 KPI 그리드가 2열로 정상 전환되는가?
- [ ] `npm run build` 성공, `dist/tools/holiday-bonus-after-tax-calculator/index.html` 생성 확인
