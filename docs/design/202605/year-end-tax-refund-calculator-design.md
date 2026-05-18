# 연말정산 환급액 계산기 — 설계 문서

> 작성일: 2026-05-17
> 콘텐츠 유형: `/tools/` 계산기
> 구현 기준: 총급여·부양가족·소득공제·세액공제 입력 → 결정세액·예상 환급액 자동 산출 + 추가 공제 시나리오 시뮬레이션

---

## 1. 문서 개요

- 구현 대상: `연말정산 환급액 계산기`
- slug: `year-end-tax-refund-calculator`
- URL: `/tools/year-end-tax-refund-calculator/`
- 카테고리: 세금/절세
- 핵심 검색 의도: "연말정산 환급액 계산기", "연말정산 얼마 돌려받나", "연금저축 세액공제 계산", "연말정산 공제 한도"
- 핵심 출력: 예상 환급액(또는 추납액), 결정세액, 세액공제 합계, 추가 공제 여력
- 핵심 CTA: `/reports/2026-year-end-tax-saving-guide/` + 연금저축·IRP 제휴 배너

---

## 2. 구현 파일 구조

```text
src/
  data/
    yearEndTaxRefundCalculator.ts   ← 타입, 세율표, 공제 상수, 프리셋, FAQ, 관련 링크
  pages/
    tools/
      year-end-tax-refund-calculator.astro

public/
  scripts/
    year-end-tax-refund-calculator.js

src/styles/scss/pages/
  _year-end-tax-refund-calculator.scss
```

추가 등록 필수:
- `src/data/tools.ts`
- `src/styles/app.scss` — `@use 'scss/pages/year-end-tax-refund-calculator';`
- `public/sitemap.xml`

---

## 3. 레이아웃 방향

- `SimpleToolShell` 기반. 입력 패널 사이드, 결과 메인 영역.
- `resultFirst={false}` — 모바일 입력 먼저.
- SCSS prefix: `yetc-`
- 입력은 3단계 탭(기본정보 / 소득공제 / 세액공제)으로 분리해 인지 부하 최소화.

```astro
<SimpleToolShell
  calculatorId="year-end-tax-refund-calculator"
  pageClass="op-page yetc-page"
  resultFirst={false}
>
```

---

## 4. 데이터 모델

```ts
// src/data/yearEndTaxRefundCalculator.ts

export interface YetcInput {
  // 기본 정보
  grossSalary: number;          // 총급여 (원)
  withheldTax: number;          // 기납부세액 (원, 0이면 자동 추정)
  dependents: number;           // 부양가족 수 (본인 포함)
  elderlyDependents: number;    // 경로우대 70세 이상
  disabledDependents: number;   // 장애인 부양가족
  children: number;             // 자녀 수 (8세 이상 20세 이하)

  // 소득공제
  creditCardAmount: number;     // 신용카드 사용액
  debitCashAmount: number;      // 체크카드·현금영수증
  housingSubscription: number;  // 주택청약저축 납입액
  mortgageRepayment: number;    // 전세대출 원리금 상환액

  // 세액공제
  medicalExpense: number;       // 의료비 지출
  educationExpense: number;     // 교육비 지출
  pensionSaving: number;        // 연금저축 납입액
  irpAmount: number;            // IRP 납입액
  insurance: number;            // 보장성보험료
  donation: number;             // 기부금
  monthlyRent: number;          // 월세 연간 합계
  isRenter: boolean;            // 무주택 세대주 여부
}

export interface YetcResult {
  laborDeduction: number;       // 근로소득공제
  laborIncome: number;          // 근로소득금액
  personalDeduction: number;    // 인적공제
  creditCardDeduction: number;  // 신용카드 소득공제
  housingDeduction: number;     // 주택자금 소득공제
  totalDeduction: number;       // 소득공제 합계
  taxBase: number;              // 과세표준
  taxAmount: number;            // 산출세액
  childTaxCredit: number;       // 자녀세액공제
  pensionTaxCredit: number;     // 연금저축·IRP 세액공제
  medicalTaxCredit: number;     // 의료비 세액공제
  educationTaxCredit: number;   // 교육비 세액공제
  insuranceTaxCredit: number;   // 보험료 세액공제
  donationTaxCredit: number;    // 기부금 세액공제
  rentTaxCredit: number;        // 월세 세액공제
  totalTaxCredit: number;       // 세액공제 합계
  finalTax: number;             // 결정세액
  withheldTax: number;          // 기납부세액
  refund: number;               // 환급액 (양수=환급, 음수=추납)
  pensionRemaining: number;     // 연금저축 추가 납입 여력
  irpRemaining: number;         // IRP 추가 납입 여력
}

export interface YetcPreset {
  id: string;
  label: string;
  summary: string;
  input: Partial<YetcInput>;
}

export interface YetcFaq {
  question: string;
  answer: string;
}
```

---

## 5. 계산 로직

### 5-1. 근로소득공제

```text
총급여 ≤ 500만: × 70%
500만 초과 ~ 1,500만: 350만 + (초과분 × 40%)
1,500만 초과 ~ 4,500만: 750만 + (초과분 × 15%)
4,500만 초과 ~ 1억: 1,200만 + (초과분 × 5%)
1억 초과: 1,475만 + (초과분 × 2%)  ※ 상한 2,000만 원
```

### 5-2. 인적공제

```text
기본공제: 부양가족 × 150만 원
경로우대: elderlyDependents × 100만 원 (추가)
장애인:   disabledDependents × 200만 원 (추가)
```

### 5-3. 자녀세액공제

```text
자녀 1명: 15만 원
자녀 2명: 35만 원
자녀 3명 이상: 35만 + (3명 초과 × 30만 원)
```

### 5-4. 신용카드 소득공제

```text
최저 사용액 = grossSalary × 0.25
초과 사용액 = (신용카드 + 체크카드 + 현금영수증) - 최저 사용액
초과 사용액 > 0일 때:
  신용카드 초과분 × 15%
  체크카드·현금영수증 초과분 × 30%
  (신용카드 먼저 최저 사용액 충당)

공제 한도:
  총급여 ≤ 7천만: 300만 원
  7천만 초과 ~ 1.2억: 250만 원
  1.2억 초과: 200만 원
```

### 5-5. 주택자금 소득공제

```text
주택청약저축: 납입액 × 40%  (한도 300만 원)
전세대출 원리금: 상환액 × 40%  (한도 400만 원)
합산 한도: 400만 원
```

### 5-6. 소득세 산출세액

```text
과세표준 = 근로소득금액 - 소득공제 합계  (0 미만이면 0)

세율 구간 (2026년 기준):
  ≤ 1,400만: × 6%
  1,400만 초과 ~ 5,000만: × 15% - 126만
  5,000만 초과 ~ 8,800만: × 24% - 576만
  8,800만 초과 ~ 1.5억: × 35% - 1,544만
  1.5억 초과 ~ 3억: × 38% - 1,994만
  3억 초과 ~ 5억: × 40% - 2,594만
  5억 초과 ~ 10억: × 42% - 3,594만
  10억 초과: × 45% - 6,594만
```

### 5-7. 연금저축·IRP 세액공제

```text
공제율:
  총급여 ≤ 5,500만 원: 16.5%
  총급여 > 5,500만 원: 13.2%

공제 한도:
  연금저축: min(납입액, 600만 원)
  IRP 포함: min(연금저축 + IRP, 900만 원)

세액공제액 = 공제 기준액 × 공제율
```

### 5-8. 의료비 세액공제

```text
공제 대상액 = 의료비 - grossSalary × 0.03  (0 미만이면 0)
세액공제 = 공제 대상액 × 0.15
```

### 5-9. 교육비 세액공제

```text
세액공제 = min(교육비, 한도) × 0.15
(MVP 단순화: 한도 구분 없이 입력값 × 15%)
```

### 5-10. 보장성보험료 세액공제

```text
세액공제 = min(보험료, 100만 원) × 0.12
```

### 5-11. 기부금 세액공제

```text
세액공제 = min(기부금, 2,000만 원) × 0.15
(1,000만 원 초과분 30% 적용 — MVP에서는 단순 15%)
```

### 5-12. 월세 세액공제

```text
요건: isRenter === true AND grossSalary ≤ 70,000,000

공제율:
  총급여 ≤ 5,500만: 17%
  총급여 > 5,500만: 15%

세액공제 = min(monthlyRent, 750만 원) × 공제율
```

### 5-13. 결정세액·환급액

```text
결정세액 = max(산출세액 - 세액공제 합계, 0)
환급액   = 기납부세액 - 결정세액  (양수=환급, 음수=추납)
```

### 5-14. 기납부세액 자동 추정 (직접 입력 없을 때)

```text
추정 기납부세액 = 산출세액 × 0.95  (근로소득세액공제 적용 후 간이 추정)
※ "추정값이므로 실제 원천징수영수증 확인 권장" 안내 필수
```

### 5-15. 추가 공제 여력

```text
pensionRemaining = max(0, 6,000,000 - pensionSaving)
irpRemaining = max(0, 9,000,000 - (pensionSaving + irpAmount))

추가 납입 시 추가 환급액:
additionalRefund = irpRemaining × 공제율
```

예외 처리:
- 총급여 0 → 계산 불가 안내
- 결정세액 < 0 → 0으로 처리
- 연금저축 + IRP > 900만 → 900만으로 자동 캡
- 기납부세액 미입력 → 자동 추정 + 안내 표시

---

## 6. 프리셋 초안

```ts
export const YETC_PRESETS: YetcPreset[] = [
  {
    id: "single-basic",
    label: "미혼 직장인 기본",
    summary: "연봉 4천 · 미혼 · 신용카드만",
    input: {
      grossSalary: 40000000, dependents: 1, children: 0,
      creditCardAmount: 12000000, pensionSaving: 0,
    },
  },
  {
    id: "married-child",
    label: "기혼 자녀 1명",
    summary: "연봉 5천 · 배우자+자녀 · 연금저축",
    input: {
      grossSalary: 50000000, dependents: 3, children: 1,
      creditCardAmount: 15000000, pensionSaving: 3000000,
    },
  },
  {
    id: "high-income",
    label: "고소득 IRP 최대",
    summary: "연봉 8천 · IRP 한도 채움",
    input: {
      grossSalary: 80000000, dependents: 4, children: 2,
      creditCardAmount: 20000000,
      pensionSaving: 6000000, irpAmount: 3000000,
    },
  },
  {
    id: "renter",
    label: "월세 + 연금저축",
    summary: "연봉 4.5천 · 월세 · 연금저축",
    input: {
      grossSalary: 45000000, dependents: 1, children: 0,
      monthlyRent: 9600000, isRenter: true,
      pensionSaving: 3000000,
    },
  },
];
```

---

## 7. 페이지 IA

1. **Hero** — 제목: "연말정산 환급액 계산기", 부제: "공제 항목을 입력하면 예상 환급액을 자동 계산합니다"
2. **InfoNotice** — "이 계산기는 주요 공제 항목만 반영한 참고용 추정값입니다. 정확한 환급액은 홈택스 연말정산 간소화 서비스에서 확인하세요."
3. **프리셋 버튼 (4개)**
4. **입력 패널 (탭 3개)** — 기본정보 / 소득공제 / 세액공제
5. **KPI 카드 (4개)** — 환급액, 결정세액, 세액공제 합계, 추가 공제 여력
6. **공제 기여도 테이블**
7. **연금저축·IRP 추가 납입 시나리오 카드** (미달 시 조건부 표시)
8. **연금저축·IRP 제휴 배너** (미달 시 조건부 표시)
9. **공제 항목별 절세 파이 차트**
10. **절세 전략 리포트 CTA**
11. **SeoContent** — intro 5문단, FAQ 8개, 관련 링크 5개

---

## 8. 입력 UI 상세

### 탭 1 — 기본 정보

| 필드 | 타입 | 기본값 | 유효성 |
|------|------|--------|-------|
| 총급여 (원) | number (쉼표) | 50,000,000 | min 1,000,000 |
| 기납부세액 (원) | number (쉼표) | 0 (자동 추정) | min 0 |
| 부양가족 수 (본인 포함) | number | 1 | min 1, max 10 |
| 경로우대 부양가족 수 | number | 0 | min 0 |
| 장애인 부양가족 수 | number | 0 | min 0 |
| 자녀 수 (8~20세) | number | 0 | min 0 |

보조 문구:
- 총급여 아래: "비과세 소득(식대·교통비 등) 제외한 과세 대상 급여"
- 기납부세액 아래: "비워두면 총급여 기준 자동 추정 (부정확할 수 있음)"
- 부양가족 아래: "본인 포함, 연간 소득 100만 원 이하인 가족"

### 탭 2 — 소득공제

| 필드 | 타입 | 기본값 |
|------|------|--------|
| 신용카드 사용액 | number (쉼표) | 0 |
| 체크카드·현금영수증 | number (쉼표) | 0 |
| 주택청약저축 납입액 | number (쉼표) | 0 |
| 전세대출 원리금 상환액 | number (쉼표) | 0 |

보조 문구:
- 신용카드 아래: "총급여의 25%를 초과한 사용분부터 15% 공제"
- 체크카드 아래: "총급여의 25% 초과분부터 30% 공제 (신용카드보다 유리)"

### 탭 3 — 세액공제

| 필드 | 타입 | 기본값 |
|------|------|--------|
| 의료비 지출 | number (쉼표) | 0 |
| 교육비 지출 | number (쉼표) | 0 |
| 연금저축 납입액 | number (쉼표) | 0 |
| IRP 납입액 | number (쉼표) | 0 |
| 보장성 보험료 | number (쉼표) | 0 |
| 기부금 | number (쉼표) | 0 |
| 월세 연간 합계 | number (쉼표) | 0 |
| 무주택 세대주 | checkbox | checked |

보조 문구:
- 연금저축 아래: "한도 600만 원. 연봉 5,500만 원 이하 16.5%, 초과 13.2% 세액공제"
- IRP 아래: "연금저축 포함 합산 900만 원까지 공제"
- 월세 아래: "총급여 7천만 원 이하, 무주택 세대주 조건 충족 시 공제 가능"

---

## 9. 결과 UI 상세

### KPI 카드 (4개)

| 카드 | 레이블 | 서브 텍스트 | 스타일 |
|------|--------|-----------|-------|
| Main | 예상 환급액 | 환급 or 추납 | 양수: 초록, 음수: 레드 |
| 일반 | 결정세액 | 산출세액 - 세액공제 | — |
| 일반 | 세액공제 합계 | 연금·의료·보험 등 | — |
| Accent | 추가 공제 여력 | 연금저축·IRP 잔여 한도 | 미달 시 강조 |

환급 vs 추납 표시:
- 환급: `예상 환급액 +XX만 원` (초록 배경)
- 추납: `추가 납부 XX만 원` (빨간 배경 + 경고 아이콘)

### 공제 기여도 테이블

| 공제 항목 | 공제액 | 절세 기여액 | 비율 |
|---------|-------|-----------|------|
| 인적공제 | X원 | X원 | X% |
| 신용카드 | X원 | X원 | X% |
| 연금저축·IRP | X원 | X원 | X% |
| 의료비 | X원 | X원 | X% |
| 교육비 | X원 | X원 | X% |
| 보험료 | X원 | X원 | X% |
| 기부금 | X원 | X원 | X% |
| 월세 | X원 | X원 | X% |

절세 기여액 = 각 공제액 × 한계세율 (소득공제) or 공제액 자체 (세액공제)

### 연금저축·IRP 추가 납입 시나리오 카드 (조건부)

```
pensionRemaining > 0 OR irpRemaining > 0 일 때 표시:

┌──────────────────────────────────────────┐
│  💡 연금저축 OO만 원 더 납입하면          │
│                                          │
│  추가 환급액: +XX만 원                   │
│  (12월 31일까지 납입 필요)               │
│                                          │
│  [연금저축 추가 납입하기 →]  (제휴 링크)  │
└──────────────────────────────────────────┘
```

### 절세 파이 차트

- Chart.js Doughnut 차트
- 세액공제 항목별 비율 시각화 (연금·의료·보험·교육·월세 등)
- 항목이 0이면 차트에서 제외
- 중앙에 세액공제 합계 표시

### 자연어 결과 메시지

```text
총급여 5천만 원 기준, 입력하신 공제 항목 적용 시
결정세액은 약 XXX만 원입니다.
기납부세액 대비 약 XX만 원을 환급받을 것으로 예상됩니다.

연금저축 한도 중 OO만 원이 남아있습니다.
12월 31일까지 추가 납입하면 약 XX만 원을 더 환급받을 수 있습니다.
```

---

## 10. JavaScript 설계

```js
// public/scripts/year-end-tax-refund-calculator.js
(() => {
  const DATA = JSON.parse(document.getElementById('yetcConfig').textContent);
  let chart = null;
  let activeTab = 'basic';

  const state = {
    grossSalary: 50000000,
    withheldTax: 0,
    dependents: 1,
    elderlyDependents: 0,
    disabledDependents: 0,
    children: 0,
    creditCardAmount: 0,
    debitCashAmount: 0,
    housingSubscription: 0,
    mortgageRepayment: 0,
    medicalExpense: 0,
    educationExpense: 0,
    pensionSaving: 0,
    irpAmount: 0,
    insurance: 0,
    donation: 0,
    monthlyRent: 0,
    isRenter: true,
  };

  // ── 유틸 ────────────────────────────────────────────────
  function q(sel) { return document.querySelector(sel); }
  function fmtW(n) { return Math.round(n).toLocaleString('ko-KR') + '원'; }
  function fmtManWon(n) {
    const m = Math.floor(Math.abs(n) / 10000);
    const r = Math.abs(n) % 10000;
    const sign = n < 0 ? '-' : '';
    if (m > 0 && r > 0) return sign + m + '만 ' + r.toLocaleString() + '원';
    if (m > 0) return sign + m + '만 원';
    return sign + r.toLocaleString() + '원';
  }

  // ── 계산 ────────────────────────────────────────────────
  function calcLaborDeduction(salary) {
    if (salary <= 5000000)   return salary * 0.70;
    if (salary <= 15000000)  return 3500000  + (salary - 5000000)  * 0.40;
    if (salary <= 45000000)  return 7500000  + (salary - 15000000) * 0.15;
    if (salary <= 100000000) return 12000000 + (salary - 45000000) * 0.05;
    return Math.min(14750000 + (salary - 100000000) * 0.02, 20000000);
  }

  function calcTax(base) {
    if (base <= 0)           return 0;
    if (base <= 14000000)    return base * 0.06;
    if (base <= 50000000)    return base * 0.15 - 1260000;
    if (base <= 88000000)    return base * 0.24 - 5760000;
    if (base <= 150000000)   return base * 0.35 - 15440000;
    if (base <= 300000000)   return base * 0.38 - 19940000;
    if (base <= 500000000)   return base * 0.40 - 25940000;
    if (base <= 1000000000)  return base * 0.42 - 35940000;
    return base * 0.45 - 65940000;
  }

  function calcCreditCard(s) {
    const minUse = s.grossSalary * 0.25;
    const totalUse = s.creditCardAmount + s.debitCashAmount;
    if (totalUse <= minUse) return 0;
    const excess = totalUse - minUse;
    // 신용카드 먼저 최저 충당, 초과분은 체크/현금
    const creditExcess = Math.max(0, s.creditCardAmount - minUse);
    const debitExcess  = Math.min(s.debitCashAmount, excess - creditExcess);
    const rawDeduction = creditExcess * 0.15 + debitExcess * 0.30;

    let limit = 3000000;
    if (s.grossSalary > 120000000)    limit = 2000000;
    else if (s.grossSalary > 70000000) limit = 2500000;
    return Math.min(rawDeduction, limit);
  }

  function calcHousing(s) {
    const subscriptionDeduction = Math.min(s.housingSubscription * 0.40, 3000000);
    const mortgageDeduction     = Math.min(s.mortgageRepayment  * 0.40, 4000000);
    return Math.min(subscriptionDeduction + mortgageDeduction, 4000000);
  }

  function calcPensionCredit(s) {
    const rate = s.grossSalary <= 55000000 ? 0.165 : 0.132;
    const base = Math.min(s.pensionSaving + s.irpAmount, 9000000);
    return base * rate;
  }

  function calcMedicalCredit(s) {
    const threshold = s.grossSalary * 0.03;
    const excess = Math.max(0, s.medicalExpense - threshold);
    return excess * 0.15;
  }

  function calcRentCredit(s) {
    if (!s.isRenter || s.grossSalary > 70000000 || s.monthlyRent === 0) return 0;
    const rate = s.grossSalary <= 55000000 ? 0.17 : 0.15;
    return Math.min(s.monthlyRent, 7500000) * rate;
  }

  function calculate(s) {
    const laborDeduction   = calcLaborDeduction(s.grossSalary);
    const laborIncome      = s.grossSalary - laborDeduction;
    const personalDeduction = (s.dependents * 1500000)
                            + (s.elderlyDependents  * 1000000)
                            + (s.disabledDependents * 2000000);
    const creditCardDeduction = calcCreditCard(s);
    const housingDeduction    = calcHousing(s);
    const totalDeduction = personalDeduction + creditCardDeduction + housingDeduction;
    const taxBase = Math.max(0, laborIncome - totalDeduction);
    const taxAmount = calcTax(taxBase);

    // 자녀세액공제
    let childCredit = 0;
    if (s.children === 1) childCredit = 150000;
    else if (s.children === 2) childCredit = 350000;
    else if (s.children >= 3) childCredit = 350000 + (s.children - 2) * 300000;

    const pensionCredit    = calcPensionCredit(s);
    const medicalCredit    = calcMedicalCredit(s);
    const educationCredit  = Math.min(s.educationExpense, 9000000) * 0.15;
    const insuranceCredit  = Math.min(s.insurance, 1000000) * 0.12;
    const donationCredit   = Math.min(s.donation, 20000000) * 0.15;
    const rentCredit       = calcRentCredit(s);
    const totalTaxCredit   = childCredit + pensionCredit + medicalCredit
                           + educationCredit + insuranceCredit + donationCredit + rentCredit;

    const finalTax   = Math.max(0, taxAmount - totalTaxCredit);
    const withheld   = s.withheldTax > 0 ? s.withheldTax : Math.round(taxAmount * 0.92);
    const refund     = withheld - finalTax;

    const pensionRemaining = Math.max(0, 6000000 - s.pensionSaving);
    const irpRemaining     = Math.max(0, 9000000 - (s.pensionSaving + s.irpAmount));

    return {
      laborDeduction, laborIncome, personalDeduction,
      creditCardDeduction, housingDeduction, totalDeduction,
      taxBase, taxAmount,
      childCredit, pensionCredit, medicalCredit,
      educationCredit, insuranceCredit, donationCredit, rentCredit,
      totalTaxCredit, finalTax, withheldTax: withheld, refund,
      pensionRemaining, irpRemaining,
      isAutoWithheld: s.withheldTax === 0,
    };
  }

  // ── 렌더 함수 ────────────────────────────────────────────
  function renderKpi(r) { /* 4개 카드 갱신, 환급/추납 색상 분기 */ }
  function renderTable(r, s) { /* 공제 항목별 기여도 테이블 */ }
  function renderScenario(r, s) { /* 연금저축 추가 납입 시나리오 카드 조건부 표시 */ }
  function renderBanner(r) { /* 제휴 배너 조건부 표시 */ }
  function renderChart(r) { /* Doughnut 차트 - 세액공제 비율 */ }
  function renderMessage(r, s) { /* 자연어 메시지 */ }

  // ── 탭 전환 ──────────────────────────────────────────────
  function switchTab(tabId) {
    document.querySelectorAll('.yetc-tab-btn').forEach(btn =>
      btn.classList.toggle('is-active', btn.dataset.tab === tabId)
    );
    document.querySelectorAll('.yetc-tab-panel').forEach(panel =>
      panel.hidden = panel.dataset.panel !== tabId
    );
    activeTab = tabId;
  }

  // ── 입력 읽기 ─────────────────────────────────────────────
  function readInputs() {
    const n = (id, fallback = 0) => {
      const val = q(`[data-yetc="${id}"]`)?.value.replace(/,/g, '');
      const num = parseFloat(val);
      return isNaN(num) ? fallback : num;
    };
    state.grossSalary        = n('grossSalary', 50000000);
    state.withheldTax        = n('withheldTax', 0);
    state.dependents         = n('dependents', 1);
    state.elderlyDependents  = n('elderlyDependents', 0);
    state.disabledDependents = n('disabledDependents', 0);
    state.children           = n('children', 0);
    state.creditCardAmount   = n('creditCardAmount', 0);
    state.debitCashAmount    = n('debitCashAmount', 0);
    state.housingSubscription= n('housingSubscription', 0);
    state.mortgageRepayment  = n('mortgageRepayment', 0);
    state.medicalExpense     = n('medicalExpense', 0);
    state.educationExpense   = n('educationExpense', 0);
    state.pensionSaving      = Math.min(n('pensionSaving', 0), 6000000);
    state.irpAmount          = Math.min(n('irpAmount', 0),
                                 Math.max(0, 9000000 - state.pensionSaving));
    state.insurance          = n('insurance', 0);
    state.donation           = n('donation', 0);
    state.monthlyRent        = n('monthlyRent', 0);
    state.isRenter           = q('[data-yetc="isRenter"]')?.checked ?? true;
  }

  function applyPreset(id) { /* 프리셋 적용 */ }
  function syncUrl(s) { /* URL 파라미터 동기화 */ }
  function restoreFromUrl() { /* URL 복원 */ }

  function update() {
    readInputs();
    const r = calculate(state);
    renderKpi(r);
    renderTable(r, state);
    renderScenario(r, state);
    renderBanner(r);
    renderChart(r);
    renderMessage(r, state);
    syncUrl(state);
  }

  function bindEvents() {
    document.querySelectorAll('.yetc-tab-btn').forEach(btn =>
      btn.addEventListener('click', () => switchTab(btn.dataset.tab))
    );
    document.querySelectorAll('[data-yetc]').forEach(el =>
      el.addEventListener('change', update)
    );
    document.querySelectorAll('.yetc-preset-btn').forEach(btn =>
      btn.addEventListener('click', () => applyPreset(btn.dataset.preset))
    );
    q('#yetcResetBtn')?.addEventListener('click', () => applyPreset('single-basic'));
    q('#yetcCopyBtn')?.addEventListener('click', () =>
      navigator.clipboard?.writeText(location.href)
    );
  }

  restoreFromUrl();
  bindEvents();
  update();
})();
```

URL 파라미터: `sal` / `wt` / `dep` / `eld` / `dis` / `chd` / `cc` / `dc` / `hs` / `mr` / `med` / `edu` / `pen` / `irp` / `ins` / `don` / `rent` / `renter`

---

## 11. SCSS 설계

```scss
.yetc-page {

  .yetc-preset-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 20px;

    .yetc-preset-btn {
      border: 1px solid #dce6e2;
      border-radius: 20px;
      padding: 6px 14px;
      font-size: 0.82rem;
      cursor: pointer;
      background: #fff;
      transition: background 0.15s, border-color 0.15s;
      &.is-active { background: #0F6E56; color: #fff; border-color: #0F6E56; }
    }
  }

  // 탭 네비게이션
  .yetc-tab-nav {
    display: flex;
    gap: 4px;
    border-bottom: 2px solid #e8ede9;
    margin-bottom: 16px;

    .yetc-tab-btn {
      padding: 8px 16px;
      font-size: 0.86rem;
      font-weight: 600;
      color: #6b7280;
      border: none;
      background: none;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      transition: color 0.15s, border-color 0.15s;

      &.is-active { color: #0F6E56; border-bottom-color: #0F6E56; }
    }
  }

  .yetc-tab-panel { /* hidden 처리는 JS */ }

  .yetc-kpi-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(2, 1fr);
    @media (min-width: 900px) { grid-template-columns: repeat(4, 1fr); }
  }

  .yetc-kpi-card {
    background: #f8faf9;
    border: 1px solid #e8ede9;
    border-radius: 12px;
    padding: 16px;

    p    { font-size: 0.78rem; color: #6b7280; margin-bottom: 6px; }
    strong { display: block; font-size: 1.2rem; font-weight: 800; color: #111827; margin-bottom: 4px; }
    span { font-size: 0.74rem; color: #9ca3af; }

    &--main-refund {
      background: #e1f5ee;
      border-color: #0f6e56;
      strong { color: #0f6e56; font-size: 1.4rem; }
    }
    &--main-pay {
      background: #fff5f5;
      border-color: #fca5a5;
      strong { color: #b91c1c; font-size: 1.4rem; }
    }
    &--accent {
      background: #f0f7ff;
      border-color: #bfdbfe;
    }
  }

  .yetc-deduction-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    font-size: 0.86rem;

    th, td {
      padding: 9px 12px;
      border-bottom: 1px solid #e8ede9;
    }
    th { background: #f8fcfa; font-weight: 700; text-align: left; }
    td:not(:first-child) { text-align: right; }
    tr.is-total td { font-weight: 700; background: #f0fdf4; }
    td.yetc-contribution { color: #0f6e56; font-weight: 600; }
  }

  // 연금저축 추가 납입 시나리오 카드
  .yetc-scenario-card {
    display: none;
    background: #fff8e6;
    border: 1.5px solid #fbbf24;
    border-radius: 12px;
    padding: 18px 20px;
    margin-top: 20px;

    &.is-visible { display: block; }

    .yetc-scenario-title {
      font-size: 0.88rem;
      font-weight: 700;
      color: #92400e;
      margin-bottom: 12px;

      &::before { content: "💡 "; }
    }

    .yetc-scenario-gain {
      font-size: 1.3rem;
      font-weight: 800;
      color: #0f6e56;
      margin-bottom: 4px;
    }

    .yetc-scenario-note {
      font-size: 0.8rem;
      color: #6b7280;
    }

    .yetc-scenario-cta {
      display: inline-block;
      margin-top: 12px;
      padding: 7px 16px;
      background: #0f6e56;
      color: #fff;
      border-radius: 8px;
      font-size: 0.84rem;
      font-weight: 700;
      text-decoration: none;
    }
  }

  // 제휴 배너
  .yetc-affiliate-banner {
    display: none;
    background: #f0f7ff;
    border: 1px solid #bfdbfe;
    border-radius: 12px;
    padding: 18px 20px;
    margin-top: 16px;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;

    &.is-visible { display: flex; }

    .yetc-banner-text {
      font-size: 0.9rem;
      font-weight: 600;
      color: #1e3a5f;
    }

    .yetc-banner-btn {
      padding: 8px 18px;
      background: #1a56db;
      color: #fff;
      border-radius: 8px;
      font-size: 0.84rem;
      font-weight: 700;
      text-decoration: none;
      white-space: nowrap;
    }
  }

  .yetc-message {
    background: #f8faf9;
    border-left: 3px solid #0f6e56;
    border-radius: 0 10px 10px 0;
    padding: 14px 18px;
    font-size: 0.88rem;
    line-height: 1.75;
    color: #374151;
    margin-top: 20px;
  }

  .yetc-chart-wrap {
    position: relative;
    max-width: 320px;
    margin: 24px auto 0;
  }

  // 절세 전략 리포트 CTA
  .yetc-report-cta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    background: #f0fdf4;
    border: 1.5px solid #86efac;
    border-radius: 12px;
    padding: 18px 20px;
    margin-top: 24px;

    .yetc-report-text {
      font-size: 0.9rem;
      font-weight: 600;
      color: #111827;
    }

    .yetc-report-btn {
      padding: 8px 18px;
      background: #0f6e56;
      color: #fff;
      border-radius: 8px;
      font-size: 0.84rem;
      font-weight: 700;
      text-decoration: none;
      white-space: nowrap;
    }
  }

  // 자동 추정 표시
  .yetc-auto-badge {
    display: inline-block;
    font-size: 0.72rem;
    padding: 2px 8px;
    background: #fef3c7;
    color: #92400e;
    border-radius: 10px;
    margin-left: 6px;
  }
}
```

---

## 12. SEO 설계

```text
title: 연말정산 환급액 계산기 — 내 공제 항목 입력하고 예상 환급액 즉시 확인
description: 총급여·부양가족·신용카드·의료비·연금저축 등 공제 항목을 입력하면 연말정산 예상 환급액을 자동 계산합니다. 공제 한도 미달 시 추가 납입 효과도 함께 확인하세요.
H1: 연말정산 환급액 계산기
```

JSON-LD: `WebApplication` + `FAQPage`

키워드: 연말정산 환급액 계산기, 연말정산 얼마 돌려받나, 연금저축 세액공제 계산, 연말정산 공제 한도, 연말정산 절세

---

## 13. SeoContent 초안

### introTitle
`연말정산 환급액 계산기 — 공제 항목을 입력하고 예상 환급액을 바로 확인하세요`

### intro (5문단)

1. 연말정산에서 환급받는 금액은 기납부세액(1년간 원천징수로 납부한 세금)과 결정세액(실제 내야 할 세금)의 차이입니다. 공제 항목을 많이 챙길수록 결정세액이 낮아져 환급액이 늘어납니다. 이 계산기는 주요 공제 항목을 입력하면 예상 환급액을 자동으로 계산해 드립니다.

2. 세액공제는 산출세액에서 직접 차감되므로 소득 구간과 무관하게 동일한 금액을 돌려받습니다. 연금저축 900만 원을 납입하면 연봉 5,500만 원 이하 기준 최대 148.5만 원을, 5,500만 원 초과 기준 최대 118.8만 원을 환급받을 수 있습니다. 연말 납입 기한(12월 31일)까지 한도를 채우는 것이 가장 직접적인 절세 방법입니다.

3. 신용카드 공제는 총급여의 25%를 초과한 사용분부터 적용됩니다. 초과분 중 신용카드는 15%, 체크카드·현금영수증은 30%를 공제받습니다. 따라서 총급여 25%까지는 혜택이 많은 신용카드로 쓰고, 그 이상은 체크카드나 현금영수증으로 결제하는 것이 절세 효과가 큽니다.

4. 월세 납부자라면 월세 세액공제도 놓치지 마세요. 총급여 7,000만 원 이하 무주택 세대주라면 연간 월세 합계의 15~17%를 세액공제받을 수 있습니다. 연 월세 1,000만 원이라면 최대 170만 원을 돌려받을 수 있습니다. 임대차계약서와 월세 납입 증빙을 꼭 보관해 두세요.

5. 이 계산기는 주요 공제 항목만 반영한 참고용 추정값입니다. 실제 연말정산에는 더 세부적인 공제 조건과 한도가 적용됩니다. 정확한 환급액은 매년 1~2월 국세청 홈택스 연말정산 간소화 서비스에서 확인하고, 누락된 항목은 경정청구(5년 이내)를 통해 소급 신청할 수 있습니다.

### FAQ (8개)

```ts
export const YETC_FAQ = [
  {
    question: "기납부세액을 모르면 어떻게 하나요?",
    answer: "기납부세액 칸을 비워두면 총급여 기준으로 자동 추정합니다. 정확한 기납부세액은 매년 1월 발급되는 근로소득 원천징수영수증 또는 국세청 홈택스에서 확인할 수 있습니다. 자동 추정값은 실제와 차이가 있을 수 있으므로 참고용으로만 활용하세요.",
  },
  {
    question: "연금저축과 IRP 중 어느 쪽을 먼저 채워야 하나요?",
    answer: "일반적으로 연금저축을 600만 원 먼저 채운 뒤 IRP로 나머지 300만 원을 채우는 것이 권장됩니다. 연금저축은 중도 해지 시 페널티가 상대적으로 낮고 운용 상품이 다양합니다. IRP는 퇴직소득·이직 시 수령과 연계해 추가로 활용할 수 있습니다.",
  },
  {
    question: "신용카드 공제와 체크카드 공제를 합산해서 받을 수 있나요?",
    answer: "네. 신용카드, 체크카드, 현금영수증 사용액을 합산해 총급여의 25%를 초과한 금액부터 공제받습니다. 다만 초과분 중 신용카드는 15%, 체크카드·현금영수증은 30%로 공제율이 다릅니다. 최적 전략은 총급여 25%까지는 신용카드(포인트·혜택 극대화), 초과분은 체크카드나 현금영수증으로 결제하는 것입니다.",
  },
  {
    question: "월세 세액공제는 어떤 조건을 충족해야 하나요?",
    answer: "총급여 7,000만 원 이하, 무주택 세대주(세대원), 임차 주택이 국민주택규모(85㎡) 이하인 경우 공제받을 수 있습니다. 임대차계약서, 월세 납입 증빙(계좌이체 내역 등)을 보관해야 하며, 확정일자 또는 전입신고가 되어있어야 합니다.",
  },
  {
    question: "부양가족으로 등록할 수 있는 요건은 무엇인가요?",
    answer: "연간 소득금액 100만 원 이하(근로소득만 있으면 총급여 500만 원 이하)이고 생계를 함께 하는 가족이어야 합니다. 따로 사는 부모님도 실질적으로 부양하고 있다면 등록 가능합니다. 배우자의 부모(장인·장모)도 요건 충족 시 등록할 수 있습니다.",
  },
  {
    question: "5년 전 연말정산에서 놓친 공제도 돌려받을 수 있나요?",
    answer: "네. 경정청구를 통해 5년 이내 신고 오류·누락 공제를 소급 신청할 수 있습니다. 홈택스(hometax.go.kr)에서 '경정청구' 메뉴로 직접 신청하거나, 세무사를 통해 대행할 수 있습니다. 5년이 지나면 시효가 만료되므로 서두르는 것이 좋습니다.",
  },
  {
    question: "연말정산 환급액이 이 계산기와 다른 이유는 무엇인가요?",
    answer: "이 계산기는 주요 공제 항목만 반영하며, 실제 연말정산에는 근로소득세액공제, 자녀세액공제 세부 조건, 종합소득세 합산 여부 등 추가 항목이 적용됩니다. 또한 기납부세액을 직접 입력하지 않은 경우 자동 추정값을 사용하므로 차이가 발생할 수 있습니다.",
  },
  {
    question: "맞벌이 부부는 공제를 어떻게 나눠야 유리한가요?",
    answer: "자녀 교육비·의료비는 실제 지출한 사람이 공제받아야 합니다. 부양가족(자녀 등)은 소득이 높은 쪽(한계세율이 높은 쪽)에 몰아주면 소득공제 효과가 더 큽니다. 단, 부양가족 중복 공제는 가산세가 발생하므로 한 명만 신청해야 합니다.",
  },
];
```

---

## 14. 관련 링크

- `/reports/2026-year-end-tax-saving-guide/` — 연말정산 절세 전략 완전 정복
- `/tools/irp-pension-calculator/` — IRP·연금저축 세액공제 계산기
- `/tools/salary/` — 연봉 실수령 계산기
- `/tools/retirement/` — 퇴직금 계산기
- `/tools/overtime-pay-calculator/` — 야근수당 계산기

---

## 15. QA 체크리스트

- [ ] 총급여 0 또는 미입력 시 NaN 미노출, "총급여를 입력하세요" 안내
- [ ] 연금저축 + IRP > 900만 원 입력 시 자동 캡 처리 + 안내
- [ ] 결정세액 < 0이면 0으로 처리 (음수 결정세액 미표시)
- [ ] 환급 vs 추납 색상 분기 정상 동작 (초록 vs 빨간)
- [ ] 기납부세액 미입력 시 자동 추정 + "추정값" 배지 표시
- [ ] 월세 공제: 총급여 > 7천만 원 or isRenter=false 시 0으로 처리
- [ ] 연금저축·IRP 미달 시 시나리오 카드 + 제휴 배너 표시, 한도 충족 시 숨김
- [ ] 탭 전환 시 해당 패널만 표시
- [ ] 프리셋 4개 클릭 시 모든 입력값 즉시 갱신
- [ ] Doughnut 차트 — 0인 항목 제외, 세액공제 없으면 빈 상태 처리
- [ ] URL 파라미터 복원 정상 동작
- [ ] InfoNotice 면책 문구 노출 확인
- [ ] 모바일 360px — KPI 2열, 테이블 가로 스크롤 정상
- [ ] `tools.ts`, `app.scss`, `sitemap.xml` 등록 완료
- [ ] `npm run build` 성공
