# 성과급 세후 실수령액 계산기 설계 문서

> 기획 원문: `docs/plan/202605/bonus-after-tax-calculator.md`  
> 작성일: 2026-05-21  
> 콘텐츠 유형: `/tools/` 계산기  
> 구현 기준: 성과급 총액에서 소득세·지방소득세·4대보험을 차감해 세후 실수령액을 간이 추정하고, 회사별 성과급 계산기에서 연결 가능하게 한다.

---

## 1. 문서 개요

- 구현 대상: `성과급 세후 실수령액 계산기`
- slug: `bonus-after-tax-calculator`
- URL: `/tools/bonus-after-tax-calculator/`
- 카테고리: 연봉/성과급
- 핵심 검색 의도: `성과급 세금 계산기`, `성과급 세후 실수령액`, `성과급 3000만원 세금`, `보너스 세금 계산기`, `대기업 성과급 세후`
- 핵심 출력: 세후 실수령액, 총 공제액, 실수령률, 소득세·지방소득세, 4대보험 추정액, 분할 지급 비교
- 안전 장치: 실제 원천징수와 연말정산 결과는 회사 급여 시스템, 부양가족, 지급월, 보험료 상한에 따라 달라질 수 있으므로 `간이 추정` 배지를 반복 노출한다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    bonusAfterTaxCalculator.ts
  pages/
    tools/
      bonus-after-tax-calculator.astro

public/
  scripts/
    bonus-after-tax-calculator.js

src/styles/scss/pages/
  _bonus-after-tax-calculator.scss
```

추가 등록 필수:

- `src/data/tools.ts`
- `src/styles/app.scss`에 `@use 'scss/pages/bonus-after-tax-calculator';`
- `public/sitemap.xml`

선택 등록:

- `src/pages/index.astro` 성과급 비교 토픽 노출
- `src/pages/tools/index.astro` 성과급 비교 목록 노출
- 회사별 성과급 계산기 결과 하단 CTA 추가
  - `src/pages/tools/bonus-simulator.astro`
  - `src/pages/tools/samsung-bonus.astro`
  - `src/pages/tools/sk-hynix-bonus.astro`
  - `src/pages/tools/hyundai-bonus.astro`
- `public/og/tools/bonus-after-tax-calculator.png` 또는 OG 이미지 생성 대상 추가

---

## 3. 레이아웃 방향

- `SimpleToolShell` 기반 계산기 페이지로 구현한다.
- SCSS prefix: `bat-`
- pageClass: `bat-page`
- 사용자는 `통장 입금액`을 가장 먼저 보고 싶어 하므로 결과 KPI 첫 카드에 `세후 실수령액`을 둔다.
- 결과 아래에는 공제 항목 분해표를 붙여 "왜 이렇게 빠졌는지"를 설명한다.
- 고급 입력은 기본 접힘 처리해 초기 화면을 가볍게 유지한다.

권장 설정:

```astro
<SimpleToolShell
  calculatorId="bonus-after-tax-calculator"
  pageClass="bat-page"
  resultFirst={false}
>
```

---

## 4. 페이지 IA

1. Hero
2. 간이 추정·연말정산 안내 `InfoNotice`
3. 프리셋 선택
4. 기본 입력 폼
5. 4대보험 반영 옵션
6. 고급 입력 접힘 영역
7. 핵심 결과 KPI
8. 공제 항목 분해표
9. 일시 지급 vs 분할 지급 비교
10. 회사별 성과급 계산기 CTA
11. 성과급 세금 해설 본문
12. FAQ

---

## 5. 데이터 모델

파일: `src/data/bonusAfterTaxCalculator.ts`

```ts
export type BonusPaymentMethod = 'single' | 'twoInstallments' | 'fourInstallments';
export type IncomeTaxMode = 'simple' | 'conservative' | 'manual';
export type ResultTone = 'normal' | 'caution' | 'high';

export interface BonusAfterTaxInput {
  taxYear: number;
  bonusGrossAmount: number;
  annualSalary: number;
  monthlySalaryOverride: number | null;
  paymentMethod: BonusPaymentMethod;
  paymentMonth: number;
  dependentCount: number;
  childUnder20Count: number;
  includeLocalIncomeTax: boolean;

  includeSocialInsurance: boolean;
  includeNationalPension: boolean;
  includeHealthInsurance: boolean;
  includeLongTermCare: boolean;
  includeEmploymentInsurance: boolean;
  assumePensionCapReached: boolean;

  incomeTaxMode: IncomeTaxMode;
  manualWithholdingRate: number;
  yearEndAdjustmentEnabled: boolean;
  nonTaxableAmount: number;
}

export interface SocialInsuranceYearConfig {
  year: number;
  nationalPensionEmployeeRate: number;
  nationalPensionMonthlyIncomeMin: number;
  nationalPensionMonthlyIncomeMax: number;
  healthInsuranceEmployeeRate: number;
  longTermCareRateOnHealthInsurance: number;
  employmentInsuranceEmployeeRate: number;
  sourceLabel: string;
  sourceUpdatedAt: string;
  notes: string[];
}

export interface SimpleIncomeTaxBracket {
  minAnnualSalary: number;
  maxAnnualSalary: number | null;
  baseWithholdingRate: number;
  conservativeRate: number;
  label: string;
}

export interface DeductionBreakdown {
  incomeTax: number;
  localIncomeTax: number;
  nationalPension: number;
  healthInsurance: number;
  longTermCareInsurance: number;
  employmentInsurance: number;
  totalDeduction: number;
}

export interface InstallmentResult {
  label: string;
  installmentCount: number;
  grossPerInstallment: number;
  netPerInstallment: number;
  totalNetAmount: number;
  totalDeduction: number;
}

export interface BonusAfterTaxResult {
  taxableBonusAmount: number;
  monthlySalary: number;
  appliedIncomeTaxRate: number;
  deduction: DeductionBreakdown;
  netAmount: number;
  netRate: number;
  installmentResults: InstallmentResult[];
  tone: ResultTone;
  badges: string[];
  interpretation: string;
  warnings: string[];
}

export interface BonusAfterTaxPreset {
  id: string;
  label: string;
  description: string;
  input: Partial<BonusAfterTaxInput>;
}

export interface FaqItem {
  q: string;
  a: string;
}
```

---

## 6. 기준 데이터

### 6-1. 기본 입력값

```ts
export const DEFAULT_BONUS_AFTER_TAX_INPUT: BonusAfterTaxInput = {
  taxYear: 2026,
  bonusGrossAmount: 30_000_000,
  annualSalary: 90_000_000,
  monthlySalaryOverride: null,
  paymentMethod: 'single',
  paymentMonth: 2,
  dependentCount: 1,
  childUnder20Count: 0,
  includeLocalIncomeTax: true,
  includeSocialInsurance: true,
  includeNationalPension: true,
  includeHealthInsurance: true,
  includeLongTermCare: true,
  includeEmploymentInsurance: true,
  assumePensionCapReached: false,
  incomeTaxMode: 'simple',
  manualWithholdingRate: 20,
  yearEndAdjustmentEnabled: false,
  nonTaxableAmount: 0,
};
```

### 6-2. 간이 원천징수율

실제 근로소득 간이세액표 전체 구현 전까지 사용할 단순 모델이다.

```ts
export const SIMPLE_INCOME_TAX_BRACKETS: SimpleIncomeTaxBracket[] = [
  {
    minAnnualSalary: 0,
    maxAnnualSalary: 50_000_000,
    baseWithholdingRate: 8,
    conservativeRate: 10,
    label: '5천만 원 이하',
  },
  {
    minAnnualSalary: 50_000_000,
    maxAnnualSalary: 80_000_000,
    baseWithholdingRate: 12,
    conservativeRate: 15,
    label: '5천만~8천만 원',
  },
  {
    minAnnualSalary: 80_000_000,
    maxAnnualSalary: 120_000_000,
    baseWithholdingRate: 18,
    conservativeRate: 22,
    label: '8천만~1.2억 원',
  },
  {
    minAnnualSalary: 120_000_000,
    maxAnnualSalary: 200_000_000,
    baseWithholdingRate: 24,
    conservativeRate: 28,
    label: '1.2억~2억 원',
  },
  {
    minAnnualSalary: 200_000_000,
    maxAnnualSalary: null,
    baseWithholdingRate: 30,
    conservativeRate: 35,
    label: '2억 원 초과',
  },
];
```

### 6-3. 프리셋

| id | 라벨 | 성과급 | 연봉 |
| --- | --- | ---: | ---: |
| bonus-5m | 성과급 500만 원 | 5,000,000원 | 60,000,000원 |
| bonus-10m | 성과급 1,000만 원 | 10,000,000원 | 70,000,000원 |
| bonus-30m | 성과급 3,000만 원 | 30,000,000원 | 90,000,000원 |
| bonus-50m | 성과급 5,000만 원 | 50,000,000원 | 120,000,000원 |
| executive | 임원급 성과급 | 100,000,000원 | 200,000,000원 |

---

## 7. 계산 로직

### 7-1. 월 급여

```text
월 급여 =
  직접 입력값이 있으면 직접 입력값
  아니면 연봉 ÷ 12
```

### 7-2. 과세 대상 성과급

```text
과세 대상 성과급 = max(성과급 총액 - 비과세/제외 금액, 0)
```

### 7-3. 적용 원천징수율

```text
manual 모드:
  적용 원천징수율 = 직접 원천징수율

simple 모드:
  적용 원천징수율 = 연봉 구간별 기본 추정 원천징수율

conservative 모드:
  적용 원천징수율 = 연봉 구간별 보수적 추정 원천징수율
```

부양가족 수와 20세 이하 자녀 수는 초기 버전에서는 안내용 입력으로 두고, 실제 간이세액표 구현 시 보정에 사용한다. UI에는 `간이 모델에서는 단순 세율 추정` 안내를 표시한다.

### 7-4. 소득세와 지방소득세

```text
소득세 = 과세 대상 성과급 × 적용 원천징수율
지방소득세 = includeLocalIncomeTax ? 소득세 × 10% : 0
```

### 7-5. 국민연금

초기 모델은 단순 추정으로 처리한다.

```text
if includeSocialInsurance && includeNationalPension && !assumePensionCapReached:
  국민연금 = 과세 대상 성과급 × 국민연금 근로자 부담률
else:
  국민연금 = 0
```

주의:
- 실제 국민연금은 기준소득월액 상한과 정산 방식 영향을 받는다.
- `상한 도달` 토글이 켜져 있으면 국민연금 추가 차감을 0으로 처리한다.

### 7-6. 건강보험

```text
건강보험 = includeSocialInsurance && includeHealthInsurance
  ? 과세 대상 성과급 × 건강보험 근로자 부담률
  : 0
```

보수월액·보수총액 정산 방식에 따라 실제 금액과 지급 시점은 달라질 수 있다.

### 7-7. 장기요양보험

```text
장기요양보험 = includeSocialInsurance && includeLongTermCare
  ? 건강보험 × 장기요양보험료율
  : 0
```

### 7-8. 고용보험

```text
고용보험 = includeSocialInsurance && includeEmploymentInsurance
  ? 과세 대상 성과급 × 고용보험 근로자 부담률
  : 0
```

### 7-9. 총 공제액과 실수령액

```text
총 공제액 =
  소득세
  + 지방소득세
  + 국민연금
  + 건강보험
  + 장기요양보험
  + 고용보험

세후 실수령액 = 성과급 총액 - 총 공제액
실수령률 = 세후 실수령액 ÷ 성과급 총액
```

### 7-10. 분할 지급 비교

```text
회차별 성과급 = 성과급 총액 ÷ 지급 횟수
회차별 공제액 = calculateAfterTax(회차별 성과급)
총 세후액 = 회차별 세후액 × 지급 횟수
```

간이 모델에서는 분할 지급이 실제 세율을 낮춘다고 단정하지 않는다. 결과 영역에 `회사 원천징수 방식에 따라 달라짐` 안내를 붙인다.

---

## 8. 쿼리 파라미터 연동

회사별 성과급 계산기에서 연결할 수 있도록 URL 쿼리를 지원한다.

### 입력 파라미터

| 파라미터 | 설명 | 예시 |
| --- | --- | --- |
| `bonus` | 성과급 총액 | `30000000` |
| `salary` | 연봉 | `90000000` |
| `company` | 연결 출처 | `samsung`, `sk-hynix`, `hyundai`, `simulator` |
| `taxRate` | 직접 원천징수율 | `20` |
| `insurance` | 4대보험 반영 | `true`, `false` |

예시:

```text
/tools/bonus-after-tax-calculator/?bonus=30000000&salary=90000000&company=samsung
```

### 처리

- `bonus`가 있으면 성과급 총액에 반영한다.
- `salary`가 있으면 연봉에 반영한다.
- `company`가 있으면 상단에 `삼성전자 계산기에서 가져온 세전 성과급` 같은 안내 배지를 표시한다.
- 잘못된 값은 무시하고 기본값을 사용한다.

---

## 9. 입력 UI 설계

### 기본 입력

| 필드 | UI | 제약 |
| --- | --- | --- |
| 성과급 총액 | number input | 0원 이상 |
| 연봉 | number input | 0원 이상 |
| 월 급여 | number input | 자동/직접 수정 |
| 지급 방식 | segmented control | 일시·2회·4회 |
| 지급월 | select | 1~12월 |
| 부양가족 수 | number input | 1명 이상 권장 |
| 20세 이하 자녀 수 | number input | 0명 이상 |
| 지방소득세 포함 | toggle | 켜짐/꺼짐 |

### 4대보험 입력

| 필드 | UI | 기본 |
| --- | --- | --- |
| 4대보험 반영 | toggle | 켜짐 |
| 국민연금 | checkbox | 켜짐 |
| 건강보험 | checkbox | 켜짐 |
| 장기요양보험 | checkbox | 켜짐 |
| 고용보험 | checkbox | 켜짐 |
| 이미 상한 도달 | checkbox | 꺼짐 |

### 고급 입력

`details`로 접는다.

| 필드 | UI | 기본 |
| --- | --- | --- |
| 소득세 추정 방식 | select | 간이 추정 |
| 직접 원천징수율 | percent input | 20% |
| 연말정산 보정 | toggle | 꺼짐 |
| 비과세/제외 금액 | number input | 0원 |

---

## 10. 결과 UI 설계

### KPI 카드

| 카드 | 값 |
| --- | --- |
| 세후 실수령액 | netAmount |
| 총 공제액 | totalDeduction |
| 실수령률 | netRate |
| 세금 합계 | incomeTax + localIncomeTax |
| 4대보험 | social insurance total |

### 공제 항목 분해표

| 항목 | 금액 | 배지 |
| --- | ---: | --- |
| 소득세 | 계산값 | 간이 추정 |
| 지방소득세 | 계산값 | 소득세 10% |
| 국민연금 | 계산값 | 상한 주의 |
| 건강보험 | 계산값 | 정산 가능 |
| 장기요양보험 | 계산값 | 건강보험 연동 |
| 고용보험 | 계산값 | 근로자 부담 |

### 분할 지급 비교

| 지급 방식 | 회차별 세전 | 회차별 세후 | 총 세후 | 안내 |
| --- | ---: | ---: | ---: | --- |
| 일시 지급 | 계산값 | 계산값 | 계산값 | 기본 |
| 2회 분할 | 계산값 | 계산값 | 계산값 | 회사 방식 차이 |
| 4회 분할 | 계산값 | 계산값 | 계산값 | 회사 방식 차이 |

---

## 11. 상태 및 경고 처리

| 조건 | 처리 |
| --- | --- |
| 성과급 0원 | 계산 안내 표시 |
| 연봉 0원 | 간이세율 최저 구간 적용, 연봉 입력 권장 |
| 실수령률 60% 미만 | 고공제 주의 배지 |
| 원천징수율 35% 이상 | 보수적 추정 안내 |
| 4대보험 꺼짐 | 세금만 반영된 결과라는 안내 |
| 국민연금 상한 도달 켜짐 | 국민연금 추가 차감 0원 처리 |
| 비과세 금액이 성과급보다 큼 | 과세 대상 성과급 0원 처리 |
| company 쿼리 있음 | 출처 안내 배지 표시 |

---

## 12. 스크립트 구현

파일: `public/scripts/bonus-after-tax-calculator.js`

### 주요 함수

```js
function parseNumber(value)
function formatWon(value)
function formatPercent(value)
function getYearConfig(year)
function getMonthlySalary(input)
function getTaxableBonus(input)
function getSimpleIncomeTaxRate(input)
function calculateIncomeTax(input)
function calculateSocialInsurance(input, config)
function calculateBonusAfterTax(input)
function calculateInstallmentResults(input)
function readQueryParams()
function applyPreset(presetId)
function renderResult(result)
```

### 이벤트

- 입력 변경 시 즉시 계산
- 프리셋 버튼 클릭
- 지급 방식 변경 시 분할 지급 비교 갱신
- 4대보험 전체 토글 변경 시 하위 체크박스 활성/비활성
- 소득세 추정 방식이 `manual`일 때 직접 원천징수율 필드 강조

---

## 13. 접근성 및 모바일

- 모든 입력에 `label` 연결
- 결과 영역은 `aria-live="polite"`
- 금액 입력은 `inputmode="numeric"`
- 토글과 체크박스는 키보드 조작 가능해야 한다.
- 모바일에서는 공제 항목 분해표를 카드형으로 전환하거나 가로 스크롤 제공
- KPI 금액이 긴 경우 줄바꿈 허용
- `간이 추정` 안내는 색상만으로 구분하지 않고 텍스트 배지 사용

---

## 14. 콘텐츠 및 SEO

### Hero

```text
성과급 세후 실수령액 계산기
성과급 총액과 연봉을 입력하면 세금과 4대보험을 뺀 통장 입금액을 간이 추정합니다.
```

### SEO 메타

```ts
const seo = {
  title: '성과급 세금 계산기 - 세후 실수령액과 공제액 계산',
  description:
    '성과급 총액과 연봉을 입력해 소득세, 지방소득세, 4대보험을 차감한 세후 실수령액을 계산하세요. 성과급 3천만 원을 받으면 실제 통장에 얼마가 들어오는지 간이 추정할 수 있습니다.',
  canonical: '/tools/bonus-after-tax-calculator/',
};
```

구조화 데이터:

- `SoftwareApplication`
- `FAQPage`
- `BreadcrumbList`

---

## 15. 내부 링크 및 CTA

| 위치 | CTA | 링크 |
| --- | --- | --- |
| 결과 하단 | 대기업 성과급 시뮬레이터 열기 | `/tools/bonus-simulator/` |
| 회사별 연결 | 삼성전자 성과급 계산하기 | `/tools/samsung-bonus/` |
| 회사별 연결 | SK하이닉스 성과급 계산하기 | `/tools/sk-hynix-bonus/` |
| 회사별 연결 | 현대자동차 성과급 계산하기 | `/tools/hyundai-bonus/` |
| 관련 도구 | 연봉 실수령액 계산하기 | `/tools/salary/` |

회사별 계산기 쪽 추가 CTA 예시:

```text
이 성과급, 세후로 얼마인지 계산하기
```

링크:

```text
/tools/bonus-after-tax-calculator/?bonus={estimatedBonus}&salary={annualSalary}&company=samsung
```

---

## 16. 스타일 설계

파일: `src/styles/scss/pages/_bonus-after-tax-calculator.scss`

주요 클래스:

```scss
.bat-page {}
.bat-hero {}
.bat-notice {}
.bat-preset-grid {}
.bat-form-grid {}
.bat-insurance-panel {}
.bat-advanced {}
.bat-result-grid {}
.bat-deduction-table {}
.bat-installment-table {}
.bat-company-cta {}
.bat-faq {}
```

디자인 기준:

- 성과급 비교 페이지들과 톤을 맞춘다.
- 메인 KPI는 `통장 입금액`이 먼저 보이게 한다.
- 세금/보험료 차감 항목은 표로 투명하게 보여준다.
- 고급 옵션은 차분한 보조 패널로 처리한다.
- 모바일에서 입력 폼과 결과 카드가 겹치지 않도록 그리드 최소 폭을 안정적으로 둔다.

---

## 17. 공식 데이터 업데이트 체크리스트

구현 직전 최신 기준을 확인한다.

- [ ] 근로소득 간이세액표 최신 버전
- [ ] 국민연금 근로자 부담률
- [ ] 국민연금 기준소득월액 상한·하한
- [ ] 건강보험 근로자 부담률
- [ ] 장기요양보험료율
- [ ] 고용보험 근로자 부담률
- [ ] 지방소득세 계산 기준
- [ ] 성과급의 보수총액 신고·정산 반영 방식 안내
- [ ] 연말정산 환급·추징 가능성 안내 문구

---

## 18. 테스트 체크리스트

- [ ] 성과급 3,000만 원 프리셋이 정상 적용되는지 확인
- [ ] 연봉 구간별 원천징수율이 바뀌는지 확인
- [ ] 직접 원천징수율 입력 모드가 정상 동작하는지 확인
- [ ] 지방소득세 포함/제외 토글이 결과에 반영되는지 확인
- [ ] 4대보험 전체 토글과 개별 체크박스가 정상 동작하는지 확인
- [ ] 국민연금 상한 도달 시 국민연금 추가 차감이 0원 처리되는지 확인
- [ ] 비과세/제외 금액이 과세 대상 성과급에서 차감되는지 확인
- [ ] 일시·2회·4회 분할 지급 비교가 표시되는지 확인
- [ ] `bonus`, `salary`, `company` 쿼리 파라미터가 입력에 반영되는지 확인
- [ ] 회사별 성과급 계산기 CTA가 올바른 URL로 연결되는지 확인
- [ ] 모바일에서 공제 항목 분해표가 깨지지 않는지 확인
- [ ] 모든 결과에 `간이 추정` 또는 동등한 안내가 표시되는지 확인
- [ ] `npm run build` 성공 확인
