# 고유가 피해지원금 계산기 설계 문서

> 기획 원문: `docs/plan/202606/high-oil-support-payment-calculator.md`  
> 작성일: 2026-06-04  
> 콘텐츠 유형: `/tools/` 계산기  
> 구현 기준: 2026년 고유가 피해지원금 공식 지급액을 바탕으로 대상 유형별 예상 수령액과 신청 체크리스트를 제공한다.

---

## 1. 문서 개요

- 구현 대상: `고유가 피해지원금 계산기`
- slug: `high-oil-support-payment-calculator`
- URL: `/tools/high-oil-support-payment-calculator/`
- 카테고리: 복지·지원금 / 생활비
- 핵심 검색 의도: `고유가 피해지원금 계산기`, `고유가 피해지원금 대상`, `고유가 피해지원금 신청`, `고유가 피해지원금 2차 신청`
- 핵심 출력: 예상 총 수령액, 1인 예상 수령액, 기본 지원금, 지역 추가금, 2차 신청 마감 안내
- 안전 문구: 이 계산기는 공식 지급액을 바탕으로 한 모의계산이며, 실제 지급 여부와 방식은 주소지 관할 지방정부 심사 결과에 따라 달라질 수 있다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    highOilSupportPaymentCalculator.ts
  pages/
    tools/
      high-oil-support-payment-calculator.astro

public/
  scripts/
    high-oil-support-payment-calculator.js

src/styles/scss/pages/
  _high-oil-support-payment-calculator.scss
```

필수 등록:

- `src/data/tools.ts`
- `src/styles/app.scss`에 `@use 'scss/pages/high-oil-support-payment-calculator';`
- `public/sitemap.xml`

선택 등록:

- `/tools/index.astro`의 복지·지원금 또는 생활비 클러스터 노출 확인
- `/reports/2026-government-welfare-benefits/` 하단 CTA 추가
- OG 이미지: `public/og/tools/high-oil-support-payment-calculator.png`

---

## 3. 레이아웃 방향

- 기본은 `SimpleToolShell` 기반 계산기 페이지로 구현한다.
- 입력 영역은 `대상 유형`, `지역 조건`, `신청 상태` 3개 그룹으로 나눈다.
- 결과는 상단 KPI 카드 5개로 즉시 보여준다.
- 정책성 수치와 사용자 조건 기반 결과를 구분하기 위해 결과 카드마다 `공식`, `모의계산`, `확인 필요` 배지를 사용한다.
- 기간 한정 콘텐츠이므로 Hero와 결과 영역에 `2차 신청 마감: 2026년 7월 3일`을 반복 노출한다.
- SCSS prefix: `hosp-`
- pageClass: `hosp-page`
- resultFirst: `false`

권장 설정:

```astro
<SimpleToolShell
  calculatorId="high-oil-support-payment-calculator"
  pageClass="hosp-page"
  resultFirst={false}
>
```

---

## 4. 페이지 IA

1. Hero
2. 공식 지급액·모의계산 안내 `InfoNotice`
3. 빠른 프리셋
4. 계산기 입력 영역
5. 결과 KPI 카드
6. 신청 마감·상태 안내
7. 대상별 지급액 표
8. 신청 체크리스트
9. 자주 헷갈리는 조건
10. 관련 계산기 CTA
11. 본문 설명 `SeoContent`
12. FAQ
13. 출처·업데이트 기준

---

## 5. 데이터 모델

파일: `src/data/highOilSupportPaymentCalculator.ts`

```ts
export type SupportTargetType =
  | "basic-livelihood-recipient"
  | "near-poverty-class"
  | "single-parent-family"
  | "unknown";

export type ResidenceAreaType = "capital-area" | "non-capital-area";
export type ApplicationRound = "first" | "second" | "unknown";
export type PaymentMethod =
  | "mobile-local-voucher"
  | "card-local-voucher"
  | "offline"
  | "unknown";

export interface HighOilSupportInput {
  targetType: SupportTargetType;
  eligiblePeople: number;
  residenceArea: ResidenceAreaType;
  isPopulationDeclineArea: boolean;
  applicationRound: ApplicationRound;
  applicationDate: string;
  birthYearLastDigit: string;
  paymentMethod: PaymentMethod;
}

export interface HighOilSupportResult {
  baseAmountPerPerson: number;
  regionalExtraPerPerson: number;
  amountPerPerson: number;
  totalAmount: number;
  eligiblePeople: number;
  targetLabel: string;
  regionalStatusLabel: string;
  applicationStatusLabel: string;
  daysUntilDeadline: number | null;
  warnings: string[];
  checklist: HighOilChecklistItem[];
}

export interface HighOilChecklistItem {
  id: string;
  label: string;
  status: "ok" | "check" | "warning";
  description: string;
}

export interface HighOilSupportPreset {
  id: string;
  label: string;
  summary: string;
  input: Partial<HighOilSupportInput>;
}

export interface HighOilSupportFaq {
  question: string;
  answer: string;
}
```

---

## 6. 기준 상수

```ts
export const HIGH_OIL_SUPPORT_2026 = {
  year: 2026,
  firstRoundStart: "2026-04-27",
  secondRoundStart: "2026-05-18",
  secondRoundEnd: "2026-07-03",
  baseAmounts: {
    "basic-livelihood-recipient": 550000,
    "near-poverty-class": 450000,
    "single-parent-family": 450000,
    unknown: 0,
  },
  regionalExtraAmount: 50000,
  sources: [
    {
      label: "대한민국 정책브리핑 고유가 피해지원금 지급 개시",
      url: "https://www.korea.kr/news/policyFocusView.do?newsId=148963458&pWise=main&pWiseMain=F2&pkgId=49500834",
    },
    {
      label: "대한민국 정책브리핑 고유가 피해지원금 지급계획",
      url: "https://www.korea.kr/news/policyFocusView.do?newsId=148962496&pkgId=49500834",
    },
  ],
};
```

대상 유형:

```ts
export const SUPPORT_TARGET_OPTIONS = [
  {
    id: "basic-livelihood-recipient",
    label: "기초생활수급자",
    amountLabel: "1인당 55만 원",
    badge: "공식",
  },
  {
    id: "near-poverty-class",
    label: "차상위계층",
    amountLabel: "1인당 45만 원",
    badge: "공식",
  },
  {
    id: "single-parent-family",
    label: "한부모가족",
    amountLabel: "1인당 45만 원",
    badge: "공식",
  },
  {
    id: "unknown",
    label: "해당 여부 확인 필요",
    amountLabel: "관할 지자체 확인",
    badge: "확인 필요",
  },
];
```

---

## 7. 계산 로직

### 7-1. 기본 지원금

```text
기본 지원금 =
  기초생활수급자: 550,000원
  차상위계층: 450,000원
  한부모가족: 450,000원
  확인 필요: 0원
```

`unknown`을 선택하면 총액을 0원으로만 보여주지 말고, 결과 카드에 `대상 유형 확인 필요` 상태를 표시한다.

### 7-2. 지역 추가금

```text
if residenceArea == "non-capital-area" and isPopulationDeclineArea == true:
  regionalExtraPerPerson = 50,000원
else:
  regionalExtraPerPerson = 0원
```

문구 주의:

- `비수도권 및 인구감소지역` 조건은 사용자가 직접 확인해야 한다.
- 결과에는 `지역 추가금은 주소지 기준 확인 필요` 배지를 붙인다.

### 7-3. 총 수령액

```text
amountPerPerson = baseAmountPerPerson + regionalExtraPerPerson
totalAmount = amountPerPerson * eligiblePeople
```

보정:

- 대상 인원 수는 1~20 범위로 제한한다.
- 빈 값, 음수, NaN은 1로 fallback 처리한다.

### 7-4. 신청 기간 상태

```text
if applicationDate > 2026-07-03:
  status = "마감 이후일 수 있음"
else if applicationDate >= 2026-06-24:
  status = "마감 임박"
else:
  status = "2차 신청 기간 내"
```

`applicationDate` 파싱 실패 시:

```text
status = "2차 신청 마감일은 2026년 7월 3일입니다."
```

---

## 8. 프리셋

```ts
export const HIGH_OIL_SUPPORT_PRESETS = [
  {
    id: "basic-one",
    label: "기초생활수급자 1인",
    summary: "기본 55만 원",
    input: {
      targetType: "basic-livelihood-recipient",
      eligiblePeople: 1,
      residenceArea: "capital-area",
      isPopulationDeclineArea: false,
    },
  },
  {
    id: "basic-non-capital-decline",
    label: "기초생활수급자 + 지역 추가",
    summary: "1인 60만 원 가능성",
    input: {
      targetType: "basic-livelihood-recipient",
      eligiblePeople: 1,
      residenceArea: "non-capital-area",
      isPopulationDeclineArea: true,
    },
  },
  {
    id: "single-parent-two",
    label: "한부모가족 2인",
    summary: "2인 기준 모의계산",
    input: {
      targetType: "single-parent-family",
      eligiblePeople: 2,
      residenceArea: "capital-area",
      isPopulationDeclineArea: false,
    },
  },
];
```

---

## 9. 화면 상세 설계

### 9-1. Hero

- eyebrow: `2026년 6월 한정 지원금`
- title: `고유가 피해지원금 계산기`
- description: `대상 유형과 거주 지역을 선택하면 2026년 고유가 피해지원금 예상 수령액과 신청 체크리스트를 확인할 수 있습니다.`
- CTA:
  - `예상 수령액 계산하기`
  - `신청 체크리스트 보기`
  - `정부 지원금 더 보기`

### 9-2. InfoNotice

제목: `모의계산 안내`

문구:

```text
이 계산기는 2026년 고유가 피해지원금 공식 지급액을 바탕으로 한 모의계산입니다.
실제 지급 대상 여부, 지역 추가금 적용, 지급 방식은 주소지 관할 지방정부 심사와 공지에 따라 달라질 수 있습니다.
2차 신청 마감일은 2026년 7월 3일로 안내되어 있습니다.
```

### 9-3. 입력 영역

#### 대상 유형

- segmented control
- 항목: 기초생활수급자, 차상위계층, 한부모가족, 확인 필요
- 각 항목 아래에 1인 기본 지급액을 작게 표시

#### 대상 인원 수

- number input + stepper
- min 1, max 20
- 설명: `공식 안내에 따라 성인은 개인별 신청·지급될 수 있습니다. 정확한 대상 인원은 지자체 안내를 확인하세요.`

#### 지역 조건

- 권역: 수도권 / 비수도권
- 인구감소지역 여부: toggle
- 토글 활성화 시 안내: `지역 추가금은 주소지 기준으로 확인해야 합니다.`

#### 신청 상태

- 신청 차수: 1차 / 2차 / 아직 모름
- 신청 예정일: date
- 지급 방식: 모바일 지역사랑상품권 / 카드형 상품권 / 오프라인 / 모름

### 9-4. 결과 KPI

| 카드 | 예시 | 배지 |
| --- | ---: | --- |
| 예상 총 수령액 | 600,000원 | 모의계산 |
| 1인 예상 수령액 | 600,000원 | 모의계산 |
| 기본 지원금 | 550,000원 | 공식 |
| 지역 추가금 | 50,000원 | 확인 필요 |
| 신청 마감 | 2026년 7월 3일 | 공식 |

### 9-5. 결과 해석 문구

```text
입력한 조건 기준 예상 총 수령액은 600,000원입니다.
기초생활수급자 기본 지원금 55만 원에 비수도권·인구감소지역 추가금 5만 원을 반영한 모의계산입니다.
실제 지급 여부와 지역 추가금 적용은 주소지 관할 지방정부 공지를 확인하세요.
```

### 9-6. 신청 체크리스트

체크 상태:

- `ok`: 입력 조건상 준비됨
- `check`: 확인 필요
- `warning`: 마감 임박 또는 대상 불명확

항목:

- 대상 유형 확인
- 주민등록상 주소지 확인
- 비수도권·인구감소지역 여부 확인
- 지역사랑상품권 앱 또는 지자체 신청 페이지 확인
- 본인 인증·신분 확인 준비
- 2026년 7월 3일 전 신청 여부 확인

---

## 10. SeoContent 본문 설계

### 10-1. intro

```text
고유가 피해지원금은 고유가로 인한 생활비 부담을 줄이기 위해 기초생활수급자, 차상위계층, 한부모가족 등 취약계층을 대상으로 지급되는 한시 지원금입니다. 2026년 공식 안내 기준으로 기초생활수급자는 1인당 55만 원, 차상위계층과 한부모가족은 1인당 45만 원을 받을 수 있습니다.

비수도권 및 인구감소지역 주민에게는 1인당 5만 원이 추가 지급될 수 있습니다. 다만 지역 추가금 적용 여부는 주민등록상 주소지와 지자체 기준에 따라 달라질 수 있으므로, 계산 결과는 신청 전 확인용으로 활용하는 것이 좋습니다.

이 계산기는 대상 유형, 대상 인원 수, 거주 지역 조건을 입력해 예상 수령액을 빠르게 확인하도록 만든 모의계산 도구입니다. 실제 지급 여부와 지급 방식은 주소지 관할 지방정부 심사 결과가 우선합니다.
```

### 10-2. highlights

- 기초생활수급자는 1인당 55만 원 기준으로 계산합니다.
- 차상위계층과 한부모가족은 1인당 45만 원 기준으로 계산합니다.
- 비수도권 및 인구감소지역 조건을 선택하면 1인당 5만 원 추가금을 반영합니다.
- 2차 신청 마감일은 2026년 7월 3일로 안내합니다.

### 10-3. criteria

- 대상 유형별 지급액
- 지역 추가금 적용 조건
- 대상 인원 수에 따른 총액 계산
- 신청 기간과 마감일
- 지급 방식과 지자체 확인 필요 사항

---

## 11. FAQ

```ts
export const HIGH_OIL_SUPPORT_FAQ = [
  {
    question: "고유가 피해지원금은 누구에게 지급되나요?",
    answer: "공식 안내 기준으로 기초생활수급자, 차상위계층, 한부모가족 등이 주요 대상입니다. 실제 대상 여부는 주소지 관할 지방정부 심사 결과에 따라 달라질 수 있습니다.",
  },
  {
    question: "기초생활수급자는 얼마를 받나요?",
    answer: "2026년 공식 안내 기준으로 기초생활수급자는 1인당 55만 원을 받을 수 있습니다. 비수도권 및 인구감소지역 조건에 해당하면 1인당 5만 원이 추가될 수 있습니다.",
  },
  {
    question: "차상위계층과 한부모가족은 얼마를 받나요?",
    answer: "차상위계층과 한부모가족은 1인당 45만 원 기준으로 안내되어 있습니다. 지역 추가금 적용 여부는 주소지 기준으로 확인해야 합니다.",
  },
  {
    question: "비수도권이면 추가 5만 원을 무조건 받나요?",
    answer: "공식 안내는 비수도권 및 인구감소지역 주민에게 1인당 5만 원을 추가 지급한다고 설명합니다. 정확한 적용 여부는 주소지 관할 지방정부 공지를 확인해야 합니다.",
  },
  {
    question: "2026년 6월에도 신청할 수 있나요?",
    answer: "2차 신청 기간은 2026년 5월 18일부터 7월 3일까지로 안내되어 있습니다. 다만 지역별 접수 방식과 세부 일정은 지자체 공지를 확인해야 합니다.",
  },
  {
    question: "어디에서 신청하나요?",
    answer: "주소지 관할 지방정부의 온라인 신청 페이지, 지역사랑상품권 앱 또는 오프라인 창구를 통해 신청할 수 있습니다. 지역별 방식은 다를 수 있습니다.",
  },
  {
    question: "가족 여러 명도 각각 받을 수 있나요?",
    answer: "공식 안내에는 성인은 개인별로 신청하고 지급받는 방식이 설명되어 있습니다. 실제 가족 구성원별 지급 여부는 대상 자격과 지자체 심사 기준을 확인해야 합니다.",
  },
  {
    question: "계산기 결과와 실제 지급액이 다를 수 있나요?",
    answer: "네. 계산 결과는 입력 조건을 바탕으로 한 모의계산입니다. 실제 지급액은 대상 확인, 주소지, 지역 추가금 적용, 지급 방식에 따라 달라질 수 있습니다.",
  },
];
```

---

## 12. 관련 링크 / CTA

```ts
export const RELATED_HIGH_OIL_SUPPORT_LINKS = [
  {
    href: "/tools/welfare-benefit-eligibility/",
    label: "복지급여 수급 자격 계산기",
    description: "다른 복지급여도 받을 수 있는지 함께 확인하세요.",
  },
  {
    href: "/reports/2026-government-welfare-benefits/",
    label: "2026 정부 복지지원금 완전 정복",
    description: "생계·주거·청년·가족 지원금을 한 번에 비교하세요.",
  },
  {
    href: "/reports/single-household-living-cost-2026/",
    label: "2026 1인 가구 생활비 완전 해부",
    description: "지원금이 월 생활비에서 얼마나 도움이 되는지 확인하세요.",
  },
  {
    href: "/tools/household-income/",
    label: "가구 소득 계산기",
    description: "가구 소득과 지원금 기준을 함께 점검하세요.",
  },
];
```

CTA 문구:

- `다른 복지급여도 확인하기`
- `2026년 정부 지원금 한 번에 보기`
- `생활비 기준으로 체감액 비교하기`

---

## 13. 스타일 설계

SCSS 파일: `src/styles/scss/pages/_high-oil-support-payment-calculator.scss`

### 13-1. 톤

- 복지·지원금 페이지이므로 안정감 있는 녹색 계열 브랜드 컬러를 기본으로 한다.
- `모의계산`, `확인 필요`, `마감 임박` 같은 상태 배지는 색상 대비를 분명히 한다.
- 카드 모서리는 8~12px 범위 유지.
- 정책 페이지처럼 딱딱해지지 않도록 숫자 카드와 체크리스트를 가볍게 배치한다.

### 13-2. 주요 클래스

```scss
.hosp-page {}
.hosp-presets {}
.hosp-form-grid {}
.hosp-input-group {}
.hosp-segmented {}
.hosp-result-grid {}
.hosp-kpi-card {}
.hosp-kpi-card--primary {}
.hosp-badge {}
.hosp-badge--official {}
.hosp-badge--estimate {}
.hosp-badge--check {}
.hosp-deadline-card {}
.hosp-checklist {}
.hosp-checklist__item {}
.hosp-checklist__item--ok {}
.hosp-checklist__item--check {}
.hosp-checklist__item--warning {}
.hosp-amount-table {}
.hosp-related-grid {}
```

### 13-3. 반응형

- 768px 이하: 입력 영역 1열, KPI 카드 2열 또는 1열.
- 480px 이하: 모든 카드 1열.
- 금액 표는 모바일에서 가로 스크롤보다 카드형으로 전환하는 편이 좋다.
- 신청 체크리스트는 아이콘+짧은 문장 구조로 세로 스택.

---

## 14. 클라이언트 스크립트 설계

파일: `public/scripts/high-oil-support-payment-calculator.js`

### 14-1. DOM id

입력:

```text
hosp-target-type
hosp-eligible-people
hosp-residence-area
hosp-population-decline-area
hosp-application-round
hosp-application-date
hosp-birth-year-last-digit
hosp-payment-method
```

결과:

```text
hosp-total-amount
hosp-per-person-amount
hosp-base-amount
hosp-regional-extra
hosp-application-deadline
hosp-application-status
hosp-result-interpretation
hosp-checklist
```

### 14-2. 주요 함수

```js
function parseNumber(value, fallback) {}
function parseDate(value) {}
function formatMoney(value) {}
function formatDate(value) {}
function getInput() {}
function getBaseAmount(targetType) {}
function getRegionalExtra(input) {}
function getApplicationStatus(input) {}
function buildChecklist(input, result) {}
function calculateHighOilSupport(input) {}
function renderResult(result) {}
function applyPreset(presetId) {}
function bindEvents() {}
```

### 14-3. 접근성

- 결과 영역에 `aria-live="polite"` 적용.
- segmented control은 실제 `button` 또는 radio 기반으로 구현.
- 신청 체크리스트 상태는 색상만으로 구분하지 않고 텍스트도 함께 표기.
- 마감 임박 메시지는 결과 카드와 해석 문구에 모두 노출.

---

## 15. 검증 케이스

### 15-1. 계산 결과

| 케이스 | 입력 | 기대 |
| --- | --- | --- |
| 기초생활수급자 1인 | target basic, 지역 추가 없음 | 550,000원 |
| 기초생활수급자 1인 + 지역 추가 | target basic, 비수도권, 인구감소지역 | 600,000원 |
| 차상위계층 2인 | target near-poverty, 2명 | 900,000원 |
| 한부모가족 2인 + 지역 추가 | target single-parent, 2명, 지역 추가 | 1,000,000원 |
| 확인 필요 | target unknown | 총액 0원 + 대상 확인 필요 안내 |
| 대상 인원 음수 | eligiblePeople -1 | 1명으로 보정 |
| 마감 이후 | 신청일 2026-07-04 | 마감 이후일 수 있음 경고 |

### 15-2. UI 검증

- 대상 유형 변경 시 기본 지원금 카드가 즉시 바뀐다.
- 지역 추가 toggle 변경 시 지역 추가금과 총액이 즉시 바뀐다.
- `unknown` 선택 시 신청 체크리스트에 대상 확인 항목이 `warning`으로 바뀐다.
- 모바일에서 결과 카드의 금액 텍스트가 부모 영역을 넘지 않는다.
- 신청 마감일이 Hero, 결과, 본문 중 최소 2곳 이상 보인다.

---

## 16. SEO / 메타

```ts
const pageTitle = "고유가 피해지원금 계산기";
const metaTitle = "고유가 피해지원금 계산기 | 대상·수령액·신청 기간 확인 2026";
const metaDescription =
  "2026년 고유가 피해지원금 대상 유형과 거주 지역을 입력해 예상 수령액을 계산하세요. 기초생활수급자 55만 원, 차상위·한부모가족 45만 원, 비수도권·인구감소지역 추가 5만 원 기준을 반영했습니다.";
```

관련 키워드:

- 고유가 피해지원금 계산기
- 고유가 피해지원금 대상
- 고유가 피해지원금 신청
- 고유가 피해지원금 2차 신청
- 고유가 피해지원금 기초생활수급자
- 고유가 피해지원금 차상위
- 고유가 피해지원금 한부모

---

## 17. 안전 / 정책 표현

반드시 사용할 표현:

- `예상`
- `모의계산`
- `확인 필요`
- `주소지 관할 지방정부 확인`
- `실제 지급 여부와 지급 방식은 달라질 수 있습니다`

피해야 할 표현:

- `무조건 지급`
- `대상 확정`
- `신청하면 바로 지급`
- `지역 추가금 자동 적용`
- `정확한 지급액`

결과 상단 배지:

```text
2026년 공식 지급액 기준 · 모의계산 · 지자체 확인 필요
```

---

## 18. 구현 체크리스트

- [ ] `src/data/highOilSupportPaymentCalculator.ts` 생성
- [ ] `src/pages/tools/high-oil-support-payment-calculator.astro` 생성
- [ ] `public/scripts/high-oil-support-payment-calculator.js` 생성
- [ ] `src/styles/scss/pages/_high-oil-support-payment-calculator.scss` 생성
- [ ] `src/styles/app.scss` 등록
- [ ] `src/data/tools.ts` 등록
- [ ] `public/sitemap.xml` URL 추가
- [ ] 정책브리핑 출처 링크 본문 포함
- [ ] 관련 복지 계산기 CTA 연결
- [ ] `npm run build` 성공
- [ ] 모바일 레이아웃 확인

---

## 19. 배포 전 QA

1. `/tools/high-oil-support-payment-calculator/` 직접 접근 가능
2. 모든 입력 변경 시 결과 즉시 갱신
3. 공식 지급액과 모의계산 배지 구분
4. 2026년 7월 3일 마감일 표시
5. `확인 필요` 선택 시 대상 확정처럼 보이지 않음
6. 지역 추가금이 비수도권 + 인구감소지역 조건에서만 반영
7. FAQ visible 상태 유지
8. 관련 계산기 링크가 모두 실제 페이지로 연결
9. `npm run build` 통과

---

## 20. 후속 확장

- 기간 종료 후 `신청 종료 안내 + 관련 복지 계산기` 페이지로 전환
- 지자체별 신청 링크 데이터 추가
- 인구감소지역 선택용 지역 드롭다운 추가
- 지역사랑상품권 사용처 안내 리포트 연결
- 2026년 민생지원금·복지지원금 허브와 통합
