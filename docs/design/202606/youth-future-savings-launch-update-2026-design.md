# 청년미래적금 6월 출시판 업데이트 설계 문서

> 기획 원문: `docs/plan/202606/youth-future-savings-launch-update-2026.md`  
> 작성일: 2026-06-04  
> 콘텐츠 유형: `/reports/` 리프레시 + `/tools/` 계산기 기능 보강  
> 구현 기준: 2026년 6월 출시 기준 청년미래적금 조건, 정부기여금, 만기 수령액 시나리오, 청년도약계좌 갈아타기 판단을 반영한다.

---

## 1. 문서 개요

- 구현 대상 1: `/reports/youth-future-savings-2026/`
- 구현 대상 2: `/reports/youth-savings-comparison-2026/`
- 구현 대상 3: `/tools/youth-savings-maturity-calculator/`
- 핵심 검색 의도: `청년미래적금`, `청년미래적금 신청`, `청년미래적금 조건`, `청년미래적금 만기 수령액`, `청년미래적금 청년도약계좌 갈아타기`
- 핵심 출력: 6월 출시 요약, 일반형·우대형 차이, 월 납입액별 만기 수령액, 갈아타기 판단, 신청 전 체크리스트
- 안전 문구: 금리와 은행별 우대조건은 신청 시점 상품설명서가 우선이며, 만기 수령액은 금리 가정에 따른 추정값이다.

---

## 2. 구현 범위

## 2-1. 리포트 업데이트

```text
src/data/youthFutureSavings2026.ts
src/pages/reports/youth-future-savings-2026.astro
src/styles/scss/pages/_youth-future-savings-2026.scss
public/scripts/youth-future-savings-2026.js
```

## 2-2. 비교 리포트 업데이트

```text
src/data/youthSavingsComparison2026.ts
src/pages/reports/youth-savings-comparison-2026.astro
src/styles/scss/pages/_youth-savings-comparison-2026.scss
public/scripts/youth-savings-comparison-2026.js
```

## 2-3. 계산기 보강

```text
src/data/youthSavingsMaturityCalculator.ts
src/pages/tools/youth-savings-maturity-calculator.astro
public/scripts/youth-savings-maturity-calculator.js
src/styles/scss/pages/_youth-savings-maturity-calculator.scss
```

필수 등록 확인:

- 기존 페이지라면 `reports.ts`, `tools.ts`, `sitemap.xml`, `app.scss` 중 누락 여부만 확인
- 신규 slug가 아니므로 sitemap 추가보다 기존 URL 유지가 우선
- 메타 title/description 업데이트

---

## 3. 업데이트 전략

신규 페이지를 추가하지 않고 기존 자산 3개를 역할별로 최신화한다.

| 대상 | 역할 | 업데이트 핵심 |
| --- | --- | --- |
| 단독 리포트 | 청년미래적금 6월 출시 가이드 | 조건·신청·수령액·갈아타기 |
| 비교 리포트 | 청년 정책 적금 비교 | 청년미래적금 vs 청년도약계좌 중심 |
| 만기 계산기 | 실제 납입액별 계산 | 청년미래적금 모드 추가 |

중복 방지:

- 단독 리포트는 청년미래적금 하나에 집중한다.
- 비교 리포트는 상품 간 차이와 추천 케이스에 집중한다.
- 계산기는 숫자 산출과 공유 가능한 결과에 집중한다.

---

## 4. 공통 데이터 모델

파일 후보: `src/data/youthFutureSavings2026.ts`

```ts
export type YouthFutureSavingsType = "general" | "preferred";
export type YouthFutureEligibilityStatus = "ok" | "check" | "risk";

export interface YouthFutureSavingsRule {
  launchMonth: string;
  maturityMonths: number;
  monthlyContributionLimit: number;
  governmentContributionRates: Record<YouthFutureSavingsType, number>;
  taxFree: boolean;
  recruitmentMonths: number[];
  ageRange: {
    min: number;
    max: number;
    militaryServiceExclusionYears: number;
  };
  specialAgeException: string;
}

export interface YouthFutureScenarioInput {
  monthlyContribution: number;
  accountType: YouthFutureSavingsType;
  annualRate: number;
  months: number;
  taxFree: boolean;
}

export interface YouthFutureScenarioResult {
  principal: number;
  governmentContribution: number;
  estimatedInterest: number;
  estimatedTaxSaving: number;
  maturityAmount: number;
  accountTypeLabel: string;
  assumptionLabel: string;
  warnings: string[];
}

export interface YouthFutureChecklistItem {
  id: string;
  label: string;
  status: YouthFutureEligibilityStatus;
  description: string;
}

export interface YouthLeapSwitchInput {
  hasYouthLeapAccount: boolean;
  paidMonths: number;
  remainingMonths: number;
  currentMonthlyContribution: number;
  canJoinFutureSavings: boolean;
  expectedFutureSavingsType: YouthFutureSavingsType | "unknown";
}

export interface YouthLeapSwitchResult {
  type: "keep" | "consider-switch" | "check-required" | "new-join";
  title: string;
  description: string;
  checklist: YouthFutureChecklistItem[];
}
```

---

## 5. 기준 상수

```ts
export const YOUTH_FUTURE_SAVINGS_2026: YouthFutureSavingsRule = {
  launchMonth: "2026-06",
  maturityMonths: 36,
  monthlyContributionLimit: 500000,
  governmentContributionRates: {
    general: 0.06,
    preferred: 0.12,
  },
  taxFree: true,
  recruitmentMonths: [6, 12],
  ageRange: {
    min: 19,
    max: 34,
    militaryServiceExclusionYears: 6,
  },
  specialAgeException: "1991년 1월~8월 출생자 예외 가입 허용",
};

export const YOUTH_FUTURE_SOURCES = [
  {
    label: "대한민국 정책브리핑 청년미래적금 6월 출시",
    url: "https://www.korea.kr/policy/civilView.do?newsId=148963384",
  },
];
```

화면 표기용 카드:

```ts
export const YOUTH_FUTURE_SUMMARY_CARDS = [
  { label: "출시", value: "2026년 6월", badge: "공식" },
  { label: "월 납입", value: "최대 50만 원", badge: "공식" },
  { label: "만기", value: "3년", badge: "공식" },
  { label: "일반형", value: "납입액 6%", badge: "공식" },
  { label: "우대형", value: "납입액 12%", badge: "공식" },
  { label: "세금", value: "이자소득 비과세", badge: "공식" },
];
```

---

## 6. 만기 수령액 계산 로직

### 6-1. 납입 원금

```text
납입 원금 = 월 납입액 x 36개월
```

보정:

- 월 납입액은 0~500,000원 범위로 제한한다.
- 청년미래적금 모드에서는 기간을 36개월로 고정한다.

### 6-2. 정부기여금

```text
일반형 정부기여금 = 납입 원금 x 0.06
우대형 정부기여금 = 납입 원금 x 0.12
```

### 6-3. 예상 이자

월 적립식 단리 근사 모델:

```text
월 이자율 = 연 금리 / 12
예상 이자 = Σ(월 납입액 x 월 이자율 x 남은 개월 수)
```

구현 예시:

```js
function calculateInstallmentInterest(monthlyContribution, months, annualRate) {
  const monthlyRate = annualRate / 100 / 12;
  let interest = 0;

  for (let month = 1; month <= months; month += 1) {
    const remainingMonths = months - month + 1;
    interest += monthlyContribution * monthlyRate * remainingMonths;
  }

  return interest;
}
```

주의:

- 실제 자유적립식 상품의 이자 계산은 납입일, 은행별 금리, 우대조건에 따라 달라질 수 있다.
- 결과 카드에는 `금리 가정`, `추정` 배지를 붙인다.

### 6-4. 비과세 효과

```text
일반 적금 과세 가정 세금 = 예상 이자 x 15.4%
비과세 효과 = taxFree ? 일반 적금 과세 가정 세금 : 0
```

### 6-5. 만기 수령액

```text
예상 만기 수령액 = 납입 원금 + 정부기여금 + 예상 이자
```

비과세 효과는 만기 수령액에 중복 더하지 않는다. 비교 설명용 보조 지표로만 표시한다.

---

## 7. 청년도약계좌 갈아타기 판단 로직

### 7-1. 판단 입력

```ts
type YouthLeapSwitchInput = {
  hasYouthLeapAccount: boolean;
  paidMonths: number;
  remainingMonths: number;
  currentMonthlyContribution: number;
  canJoinFutureSavings: boolean;
  expectedFutureSavingsType: "general" | "preferred" | "unknown";
};
```

### 7-2. 결과 분기

```text
if hasYouthLeapAccount == false:
  result = "new-join"
else if canJoinFutureSavings == false:
  result = "check-required"
else if paidMonths >= 36:
  result = "keep"
else if expectedFutureSavingsType == "preferred" and paidMonths <= 12:
  result = "consider-switch"
else:
  result = "check-required"
```

### 7-3. 결과 메시지

| 결과 | 제목 | 설명 방향 |
| --- | --- | --- |
| `new-join` | 청년미래적금 신규 가입 조건부터 확인 | 청년도약계좌 미가입자는 청년미래적금 조건과 은행별 금리 확인 |
| `keep` | 기존 청년도약계좌 유지 우선 검토 | 이미 납입 기간이 길다면 기존 혜택 손실 가능성 |
| `consider-switch` | 갈아타기 검토 가능 | 우대형 가능성, 3년 만기 선호, 기존 납입 기간 짧은 경우 |
| `check-required` | 조건 확인 필요 | 특별중도해지, 소득, 가구소득, 은행 금리 확인 필요 |

주의 문구:

```text
청년도약계좌에서 청년미래적금으로 갈아타는 것이 무조건 유리한 것은 아닙니다. 기존 납입 기간, 이미 받은 혜택, 특별중도해지 인정 여부, 청년미래적금 가입 유형, 은행별 금리를 함께 확인해야 합니다.
```

---

## 8. 단독 리포트 화면 설계

### 8-1. Hero

- eyebrow: `2026년 6월 출시 기준`
- title: `청년미래적금 조건·만기 수령액 정리 2026`
- description: `가입 조건, 일반형·우대형 차이, 월 납입액별 만기 수령액, 청년도약계좌 갈아타기 판단을 한 번에 정리했습니다.`
- CTA:
  - `만기 수령액 계산하기`
  - `청년도약계좌와 비교하기`
  - `신청 전 체크리스트 보기`

### 8-2. InfoNotice

제목: `금리 가정 안내`

문구:

```text
청년미래적금의 월 납입 한도, 만기, 정부기여금 비율은 공식 안내 기준으로 정리했습니다.
은행별 금리와 우대조건은 신청 시점 상품설명서가 우선합니다.
만기 수령액은 입력한 금리 가정에 따른 추정값입니다.
```

### 8-3. 상단 요약 카드

6개 카드:

- 출시: 2026년 6월
- 신청: 연 2회, 6월·12월 모집 계획
- 월 납입: 최대 50만 원
- 만기: 3년
- 일반형: 납입액의 6%
- 우대형: 납입액의 12%

### 8-4. 조건 체크리스트

체크 항목:

- 만 19~34세
- 병역이행 기간 최대 6년 제외 가능
- 1991년 1월~8월 출생 특례 해당 여부
- 개인소득 기준
- 가구 중위소득 기준
- 금융소득 종합과세 여부
- 중소기업 재직·신규 취업·소상공인 등 우대형 조건

상태:

- `충족 가능`
- `확인 필요`
- `주의`

### 8-5. 만기 수령액 시나리오 표

고정 행:

| 월 납입액 | 납입 원금 | 일반형 기여금 | 우대형 기여금 | 예상 이자 | 예상 만기 수령액 |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 10만 원 | 계산 | 계산 | 계산 | 계산 | 계산 |
| 30만 원 | 계산 | 계산 | 계산 | 계산 | 계산 |
| 50만 원 | 계산 | 계산 | 계산 | 계산 | 계산 |

표 상단에 적용 금리 입력 또는 선택:

- 4%
- 5%
- 6%
- 직접 입력

### 8-6. 갈아타기 판단 카드

입력형 간단 체크:

- 청년도약계좌 가입 중인가?
- 현재 몇 개월 납입했나?
- 청년미래적금 우대형 가능성이 있나?
- 3년 만기 상품을 선호하나?

출력:

- 유지 우선
- 갈아타기 검토
- 조건 확인 필요
- 신규 가입 우선

### 8-7. 은행별 금리 업데이트 영역

초기 상태:

```text
취급 금융기관별 최종 금리와 우대조건은 신청 시점 상품설명서를 기준으로 업데이트합니다.
금리 확정 전에는 만기 수령액 계산기에 직접 금리를 입력해 시나리오로 확인하세요.
```

금리 확정 후 표 구조:

| 금융기관 | 기본금리 | 최고금리 | 주요 우대조건 | 신청 앱 |
| --- | ---: | ---: | --- | --- |

---

## 9. 비교 리포트 화면 설계

### 9-1. 핵심 비교표

| 항목 | 청년미래적금 | 청년도약계좌 |
| --- | --- | --- |
| 만기 | 3년 | 5년 |
| 월 납입 한도 | 50만 원 | 70만 원 |
| 정부 지원 | 일반형 6%, 우대형 12% | 소득 구간별 기여금 |
| 비과세 | 적용 | 적용 |
| 신규 가입 | 2026년 6월 출시 | 기존 상품 조건 확인 |
| 핵심 판단 | 짧은 만기와 명확한 기여금 | 장기 납입과 큰 납입 한도 |

### 9-2. 추천 케이스 카드

청년미래적금이 더 맞는 경우:

- 3년 만기를 선호한다.
- 월 50만 원 이내로 납입할 계획이다.
- 우대형 12% 가능성이 있다.
- 청년도약계좌에 아직 가입하지 않았다.

청년도약계좌 유지가 더 나을 수 있는 경우:

- 이미 납입 기간이 길다.
- 기존 상품의 정부기여금·금리 혜택 손실이 크다.
- 월 50만 원보다 더 많이 납입할 수 있다.
- 특별중도해지 인정 여부가 불확실하다.

### 9-3. 내부 링크

- 단독 리포트 CTA: `/reports/youth-future-savings-2026/`
- 계산기 CTA: `/tools/youth-savings-maturity-calculator/`
- 정부 복지지원금 CTA: `/reports/2026-government-welfare-benefits/`

---

## 10. 계산기 화면 설계

기존 `/tools/youth-savings-maturity-calculator/`에 상품 선택 모드를 추가한다.

### 10-1. 입력 영역

| 입력 | 타입 | 청년미래적금 모드 동작 |
| --- | --- | --- |
| 상품 선택 | segmented control | 청년미래적금 / 청년도약계좌 / 일반 적금 |
| 가입 유형 | segmented control | 일반형 6% / 우대형 12% |
| 월 납입액 | slider + number | 최대 50만 원 |
| 적용 금리 | number | 기본 6%, 직접 수정 가능 |
| 납입 기간 | fixed/read-only | 36개월 |
| 비과세 | toggle | 기본 켜짐 |

### 10-2. 결과 카드

| 카드 | 내용 | 배지 |
| --- | --- | --- |
| 예상 만기 수령액 | 원금 + 기여금 + 이자 | 추정 |
| 납입 원금 | 월 납입액 x 36 | 공식 구조 |
| 정부기여금 | 6% 또는 12% | 공식 비율 |
| 예상 이자 | 금리 가정 기반 | 추정 |
| 비과세 효과 | 일반 과세 대비 | 추정 |

### 10-3. 결과 해석 문구

```text
월 50만 원을 36개월 납입하고 연 6% 금리를 가정하면 예상 만기 수령액은 약 000만 원입니다.
이 결과는 일반형 정부기여금 6%와 비과세 가정을 반영한 추정값입니다.
은행별 금리와 우대조건, 실제 납입일에 따라 결과는 달라질 수 있습니다.
```

---

## 11. 클라이언트 스크립트 설계

### 11-1. 공통 함수

```js
function clampNumber(value, min, max) {}
function parseMoney(value) {}
function formatMoney(value) {}
function formatPercent(value) {}
function calculateInstallmentInterest(monthlyContribution, months, annualRate) {}
function calculateYouthFutureSavings(input) {}
function calculateLeapSwitch(input) {}
function renderYouthFutureResult(result) {}
function renderSwitchResult(result) {}
function bindYouthFutureEvents() {}
```

### 11-2. 계산기 DOM id

입력:

```text
ysmc-product-type
ysmc-future-account-type
ysmc-monthly-contribution
ysmc-annual-rate
ysmc-tax-free
ysmc-has-leap-account
ysmc-leap-paid-months
ysmc-leap-remaining-months
ysmc-can-join-future
```

결과:

```text
ysmc-maturity-amount
ysmc-principal
ysmc-government-contribution
ysmc-estimated-interest
ysmc-tax-saving
ysmc-assumption-label
ysmc-switch-result
```

### 11-3. 접근성

- 상품 선택과 가입 유형 선택은 radio 또는 button group으로 구현.
- 금리 가정 변경 시 결과 영역 `aria-live="polite"`.
- `추정`, `공식`, `확인 필요` 배지는 색상과 텍스트를 함께 제공.
- 슬라이더 값은 number input과 동기화.

---

## 12. 스타일 설계

### 12-1. 단독 리포트 prefix

SCSS 파일: `src/styles/scss/pages/_youth-future-savings-2026.scss`

```scss
.yfs-page {}
.yfs-launch-summary {}
.yfs-summary-grid {}
.yfs-summary-card {}
.yfs-checklist {}
.yfs-scenario-table {}
.yfs-rate-assumption {}
.yfs-switch-card {}
.yfs-bank-rate-table {}
.yfs-badge {}
.yfs-badge--official {}
.yfs-badge--estimate {}
.yfs-badge--check {}
```

### 12-2. 비교 리포트 prefix

```scss
.ysc-page {}
.ysc-comparison-table {}
.ysc-recommend-grid {}
.ysc-recommend-card {}
.ysc-switch-guide {}
.ysc-product-chip {}
```

### 12-3. 계산기 prefix

```scss
.ysmc-page {}
.ysmc-product-tabs {}
.ysmc-future-mode {}
.ysmc-rate-box {}
.ysmc-result-grid {}
.ysmc-kpi-card {}
.ysmc-switch-result {}
```

### 12-4. 반응형

- 768px 이하: 요약 카드 2열, 입력/결과 1열.
- 480px 이하: 모든 카드 1열.
- 비교표는 모바일에서 카드형 비교로 전환하거나 `overflow-x: auto` 적용.
- 긴 CTA 문구는 두 줄 허용.

---

## 13. FAQ

```ts
export const YOUTH_FUTURE_SAVINGS_FAQ = [
  {
    question: "청년미래적금은 언제 신청하나요?",
    answer: "2026년 6월 출시 예정이며, 공식 안내 기준으로 연 2회인 6월과 12월 신규 가입자를 모집할 계획입니다. 실제 신청 일정은 취급 금융기관 공지를 확인해야 합니다.",
  },
  {
    question: "월 최대 얼마까지 넣을 수 있나요?",
    answer: "청년미래적금은 월 최대 50만 원 한도 내에서 자유롭게 납입하는 3년 만기 상품으로 안내되어 있습니다.",
  },
  {
    question: "일반형과 우대형은 무엇이 다른가요?",
    answer: "정부기여금 비율이 다릅니다. 일반형은 납입액의 6%, 우대형은 납입액의 12% 기준으로 안내되어 있습니다. 우대형은 중소기업 재직, 신규 취업, 소상공인 등 세부 조건 확인이 필요합니다.",
  },
  {
    question: "금리는 확정되었나요?",
    answer: "공식 안내에는 3년 고정금리 구조가 설명되어 있지만, 은행별 최종 금리와 우대조건은 신청 시점 상품설명서를 기준으로 확인해야 합니다.",
  },
  {
    question: "청년도약계좌 가입자도 청년미래적금에 가입할 수 있나요?",
    answer: "공식 안내는 요건을 충족하면 청년미래적금 신규가입 후 청년도약계좌 특별중도해지를 진행할 수 있다고 설명합니다. 실제 적용 여부는 취급기관 확인이 필요합니다.",
  },
  {
    question: "청년도약계좌에서 갈아타는 것이 유리한가요?",
    answer: "무조건 유리하다고 볼 수 없습니다. 기존 납입 기간, 이미 받은 혜택, 특별중도해지 인정 여부, 청년미래적금 가입 유형, 은행별 금리를 함께 비교해야 합니다.",
  },
  {
    question: "만 35세가 되었는데 가입할 수 있나요?",
    answer: "청년도약계좌 가입 종료와 청년미래적금 출시 사이에 만 35세가 된 1991년 1월~8월 출생자는 예외적으로 가입 허용된다고 안내되어 있습니다.",
  },
  {
    question: "만기 수령액 계산 결과는 실제와 같은가요?",
    answer: "계산 결과는 입력한 납입액과 금리 가정을 바탕으로 한 추정값입니다. 실제 수령액은 은행별 금리, 우대조건, 납입일, 중도해지 여부에 따라 달라질 수 있습니다.",
  },
];
```

---

## 14. 관련 링크 / CTA

```ts
export const RELATED_YOUTH_FUTURE_LINKS = [
  {
    href: "/tools/youth-savings-maturity-calculator/",
    label: "청년 적금 만기 수령액 계산기",
    description: "월 납입액과 금리 가정으로 만기 수령액을 계산하세요.",
  },
  {
    href: "/reports/youth-savings-comparison-2026/",
    label: "청년미래적금 vs 청년도약계좌 비교",
    description: "조건, 만기, 정부기여금 차이를 나란히 비교하세요.",
  },
  {
    href: "/reports/2026-government-welfare-benefits/",
    label: "2026 정부 복지지원금 완전 정복",
    description: "청년·가족·주거 지원금을 함께 확인하세요.",
  },
  {
    href: "/tools/savings-vs-etf-retirement/",
    label: "적금 vs ETF 장기 수익 비교",
    description: "적금과 투자의 장기 수익 구조를 비교해보세요.",
  },
];
```

CTA 문구:

- `월 납입액별 만기 수령액 계산하기`
- `청년도약계좌와 비교하기`
- `다른 청년 지원금 보기`
- `적금과 ETF 수익 비교하기`

---

## 15. SEO / 메타

단독 리포트:

```ts
const pageTitle = "청년미래적금 조건·만기 수령액 정리 2026";
const metaTitle = "청년미래적금 조건·만기 수령액 2026 | 6월 신청·우대형·갈아타기 정리";
const metaDescription =
  "2026년 6월 출시 청년미래적금 가입 조건, 월 50만 원 납입 시 만기 수령액, 일반형 6%·우대형 12% 정부기여금, 청년도약계좌 갈아타기 판단 기준을 정리했습니다.";
```

비교 리포트:

```ts
const comparisonMetaTitle = "청년미래적금 vs 청년도약계좌 비교 2026 | 조건·만기·정부기여금 차이";
const comparisonMetaDescription =
  "청년미래적금과 청년도약계좌의 가입 조건, 월 납입 한도, 만기, 정부기여금, 비과세 혜택, 갈아타기 판단 기준을 비교합니다.";
```

관련 키워드:

- 청년미래적금
- 청년미래적금 신청
- 청년미래적금 조건
- 청년미래적금 만기 수령액
- 청년미래적금 우대형
- 청년미래적금 일반형
- 청년미래적금 청년도약계좌
- 청년미래적금 6월

---

## 16. 안전 / 금융 표현

반드시 사용할 표현:

- `추정`
- `금리 가정`
- `확인 필요`
- `상품설명서 기준`
- `은행별 조건에 따라 달라질 수 있습니다`

피해야 할 표현:

- `무조건 유리`
- `확정 수령액`
- `최고 금리 보장`
- `갈아타기 추천`
- `가입 확정`

결과 상단 배지:

```text
2026년 6월 출시 기준 · 금리 가정 · 만기 수령액 추정
```

---

## 17. 검증 케이스

### 17-1. 계산 결과

| 케이스 | 입력 | 기대 |
| --- | --- | --- |
| 일반형 50만 원 | 월 500,000원, 36개월, 6% | 원금 18,000,000원, 기여금 1,080,000원 |
| 우대형 50만 원 | 월 500,000원, 36개월, 6% | 원금 18,000,000원, 기여금 2,160,000원 |
| 월 납입액 초과 | 700,000원 | 500,000원으로 보정 |
| 금리 0% | 연 0% | 이자 0원, 기여금만 반영 |
| 일반형 vs 우대형 | 동일 납입액 | 우대형이 기여금 2배 |
| 청년도약계좌 미가입 | hasLeap false | 신규 가입 우선 메시지 |
| 기존 납입 40개월 | hasLeap true, paidMonths 40 | 유지 우선 메시지 |

### 17-2. UI 검증

- 청년미래적금 모드 선택 시 납입 한도 50만 원이 적용된다.
- 가입 유형 변경 시 정부기여금 카드가 즉시 바뀐다.
- 금리 변경 시 예상 이자와 만기 수령액이 즉시 갱신된다.
- 결과 카드에 `추정` 배지가 보인다.
- 갈아타기 결과가 무조건 추천처럼 보이지 않는다.
- 모바일에서 비교표가 화면 밖으로 깨지지 않는다.

---

## 18. 구현 체크리스트

- [ ] 단독 리포트 Hero와 메타를 6월 출시 기준으로 업데이트
- [ ] 일반형 6% / 우대형 12% 요약 카드 추가
- [ ] 월 납입액별 만기 수령액 시나리오 추가
- [ ] 청년도약계좌 갈아타기 판단 카드 추가
- [ ] 비교 리포트에서 청년미래적금 vs 청년도약계좌 구조 재정렬
- [ ] 만기 계산기에 청년미래적금 모드 추가
- [ ] 금리 가정과 추정 배지 적용
- [ ] FAQ visible 상태 유지
- [ ] 정책브리핑 출처 링크 반영
- [ ] `npm run build` 성공

---

## 19. 배포 전 QA

1. `/reports/youth-future-savings-2026/`에서 `2026년 6월 출시 기준`이 상단에 보임
2. `/reports/youth-savings-comparison-2026/`에서 청년미래적금과 청년도약계좌 차이가 첫 화면 가까이에 보임
3. `/tools/youth-savings-maturity-calculator/`에서 청년미래적금 모드 선택 가능
4. 월 납입액 50만 원 초과 입력 시 보정 또는 경고 표시
5. 일반형과 우대형 기여금이 각각 6%, 12%로 계산
6. 금리와 만기 수령액이 확정값처럼 보이지 않음
7. 청년도약계좌 갈아타기 섹션이 무조건 전환을 권하지 않음
8. 내부 링크가 모두 실제 페이지로 연결
9. `npm run build` 통과

---

## 20. 후속 확장

- 은행별 금리 확정 후 금융기관 비교표 업데이트
- 청년도약계좌 실제 잔여 혜택 비교 계산 추가
- 청년미래적금 전용 `/tools/youth-future-savings-calculator/` 분리 검토
- 청년 금융상품 허브 페이지 생성
- ISA·IRP·연금저축과 청년 적금의 절세 조합 리포트 추가
