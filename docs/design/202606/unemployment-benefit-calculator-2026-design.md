# 실업급여 계산기 2026 설계 문서

> 기획 원문: `docs/plan/202606/unemployment-benefit-calculator-2026.md`  
> 작성일: 2026-06-03  
> 콘텐츠 유형: `/tools/` 계산기  
> 구현 기준: 2026년 고용보험 구직급여 기준으로 예상 1일 구직급여액, 소정급여일수, 총 수급액, 생활비 커버 기간을 계산한다.

---

## 1. 문서 개요

- 구현 대상: `실업급여 계산기 2026`
- slug: `unemployment-benefit-calculator`
- URL: `/tools/unemployment-benefit-calculator/`
- 카테고리: 연봉·이직 / 퇴직·고용
- 핵심 검색 의도: `실업급여 계산기`, `실업급여 금액`, `실업급여 수급기간`, `구직급여 계산기`, `고용보험 실업급여 계산`
- 핵심 출력: 예상 1일 구직급여액, 예상 소정급여일수, 예상 총 수급액, 월 환산액, 상한·하한 적용 여부, 신청 전 체크리스트
- 안전 문구: 이 계산기는 실제 수급 자격 확정 도구가 아니라 고용보험 기준을 바탕으로 한 모의계산 도구다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    unemploymentBenefitCalculator.ts
  pages/
    tools/
      unemployment-benefit-calculator.astro

public/
  scripts/
    unemployment-benefit-calculator.js

src/styles/scss/pages/
  _unemployment-benefit-calculator.scss
```

필수 등록:

- `src/data/tools.ts`
- `src/styles/app.scss`에 `@use 'scss/pages/unemployment-benefit-calculator';`
- `public/sitemap.xml`

선택 등록:

- `src/pages/tools/index.astro` 연봉·이직 또는 생활비 관련 목록 노출 확인
- `src/pages/index.astro` 직장인 추천 계산기 노출 후보
- 기존 연봉·퇴직·이직 계산기 하단 CTA 추가
- OG 이미지 생성 대상 추가: `public/og/tools/unemployment-benefit-calculator.png`

---

## 3. 레이아웃 방향

- 기본은 `SimpleToolShell` 기반 계산기 페이지로 구현한다.
- 입력 항목이 많으므로 입력 영역은 `기본 정보`, `임금 정보`, `생활비 옵션` 3개 그룹으로 나눈다.
- 결과는 사용자가 바로 이해하도록 상단 KPI 4개를 먼저 보여준다.
- 결과 하단에는 “상한액 적용 / 하한액 적용 / 평균임금 기준” 해석을 별도 카드로 제공한다.
- 자격 조건은 확정 판정처럼 보이지 않게 `충족`, `확인 필요`, `고용센터 확인` 상태로 표현한다.
- SCSS prefix: `ubc-`
- pageClass: `ubc-page`
- resultFirst: `false`

권장 설정:

```astro
<SimpleToolShell
  calculatorId="unemployment-benefit-calculator"
  pageClass="ubc-page"
  resultFirst={false}
>
```

---

## 4. 페이지 IA

1. Hero
2. 고용보험 모의계산 안내 `InfoNotice`
3. 빠른 프리셋
4. 계산기 입력 영역
5. 결과 KPI 카드
6. 상한·하한 적용 해석
7. 수급 가능성 체크리스트
8. 소정급여일수 기준표
9. 퇴사 후 생활비 플랜
10. 신청 순서 안내
11. 관련 계산기 CTA
12. 계산 기준 본문
13. FAQ
14. SeoContent

---

## 5. 데이터 모델

파일: `src/data/unemploymentBenefitCalculator.ts`

```ts
export type EmploymentInsurancePeriodId =
  | "under-1y"
  | "1y-3y"
  | "3y-5y"
  | "5y-10y"
  | "over-10y";

export type LeaveReasonId =
  | "recommended-resignation"
  | "contract-expired"
  | "layoff"
  | "business-closure"
  | "voluntary"
  | "voluntary-with-just-cause"
  | "fired-for-cause"
  | "unknown";

export type BenefitLimitType = "floor" | "standard" | "cap";
export type EligibilityStatus = "ok" | "check" | "risk";

export interface UnemploymentBenefitInput {
  leaveDate: string;
  age: number;
  isDisabled: boolean;
  insurancePeriodId: EmploymentInsurancePeriodId;
  leaveReasonId: LeaveReasonId;
  hasInsuredDays180: boolean;
  useDirectAverageWage: boolean;
  threeMonthWageTotal: number;
  threeMonthTotalDays: number;
  dailyAverageWage: number;
  dailyWorkHours: number;
  monthlyLivingCost: number;
  retirementPay: number;
  emergencyFund: number;
}

export interface EligibilityCheck {
  id: string;
  label: string;
  status: EligibilityStatus;
  description: string;
}

export interface UnemploymentBenefitResult {
  dailyAverageWage: number;
  baseDailyBenefit: number;
  dailyBenefit: number;
  limitType: BenefitLimitType;
  benefitDays: number;
  totalBenefit: number;
  monthlyEquivalent30Days: number;
  monthlyEquivalent28Days: number;
  livingCostMonths: number | null;
  applicationDeadlineLabel: string;
  ageGroupLabel: string;
  insurancePeriodLabel: string;
  leaveReasonLabel: string;
  eligibilityChecks: EligibilityCheck[];
  interpretation: string;
  warnings: string[];
}

export interface UnemploymentBenefitPreset {
  id: string;
  label: string;
  summary: string;
  input: Partial<UnemploymentBenefitInput>;
}

export interface UnemploymentBenefitFaq {
  question: string;
  answer: string;
}
```

---

## 6. 기준 상수

```ts
export const UNEMPLOYMENT_BENEFIT_2026 = {
  dailyCap: 68100,
  dailyFloor: 66048,
  wageReplacementRate: 0.6,
  minimumWage: 10320,
  standardWorkHours: 8,
  applicationMonthsLimit: 12,
};

export const EMPLOYMENT_INSURANCE_PERIODS = [
  { id: "under-1y", label: "1년 미만", index: 0 },
  { id: "1y-3y", label: "1년 이상~3년 미만", index: 1 },
  { id: "3y-5y", label: "3년 이상~5년 미만", index: 2 },
  { id: "5y-10y", label: "5년 이상~10년 미만", index: 3 },
  { id: "over-10y", label: "10년 이상", index: 4 },
];

export const BENEFIT_DAYS_TABLE = {
  under50: [120, 150, 180, 210, 240],
  over50OrDisabled: [120, 180, 210, 240, 270],
};
```

퇴사 사유 데이터:

```ts
export const LEAVE_REASONS = [
  {
    id: "recommended-resignation",
    label: "권고사직",
    status: "ok",
    note: "비자발적 이직으로 인정될 가능성이 높은 유형입니다.",
  },
  {
    id: "contract-expired",
    label: "계약만료",
    status: "check",
    note: "계약 갱신 여부와 실제 이직 사유 확인이 필요합니다.",
  },
  {
    id: "layoff",
    label: "정리해고",
    status: "ok",
    note: "비자발적 이직으로 인정될 가능성이 높은 유형입니다.",
  },
  {
    id: "business-closure",
    label: "폐업·사업장 종료",
    status: "ok",
    note: "사업장 사정에 따른 이직으로 볼 수 있습니다.",
  },
  {
    id: "voluntary",
    label: "자발적 퇴사",
    status: "risk",
    note: "원칙적으로 수급이 어렵고 정당한 이직 사유 확인이 필요합니다.",
  },
  {
    id: "voluntary-with-just-cause",
    label: "자발적 퇴사이나 정당한 사유 있음",
    status: "check",
    note: "임금체불, 괴롭힘, 통근 곤란 등 사실관계 확인이 필요합니다.",
  },
  {
    id: "fired-for-cause",
    label: "중대한 귀책 해고",
    status: "risk",
    note: "수급자격 제한 사유에 해당할 수 있습니다.",
  },
  {
    id: "unknown",
    label: "아직 모름",
    status: "check",
    note: "이직확인서와 고용센터 상담으로 확인이 필요합니다.",
  },
];
```

---

## 7. 계산 로직

### 7-1. 평균임금

```text
1일 평균임금 =
  직접 입력 모드이면 dailyAverageWage
  아니면 최근 3개월 임금 총액 / 최근 3개월 총 일수
```

보정:

- 최근 3개월 총 일수가 1 미만이면 1로 보정한다.
- 평균임금이 음수이면 0으로 보정한다.
- 직접 입력값이 0이면 최근 3개월 기준으로 계산하도록 fallback 처리한다.

### 7-2. 1일 구직급여액

```text
기본 구직급여일액 = 1일 평균임금 × 0.6
구직급여일액 = min(max(기본 구직급여일액, 66,048), 68,100)
```

상태 판정:

| limitType | 조건 | 표시 문구 |
|---|---|---|
| floor | 기본 구직급여일액 < 66,048 | 하한액 적용 |
| standard | 66,048 <= 기본 구직급여일액 <= 68,100 | 평균임금 기준 |
| cap | 기본 구직급여일액 > 68,100 | 상한액 적용 |

주의:

- 2026년은 하한액과 상한액 차이가 작다.
- 사용자가 월급 250만~350만 원 구간을 입력하면 대부분 하한 또는 상한에 가까운 결과가 나올 수 있으므로 결과 해석을 명확히 제공한다.

### 7-3. 소정급여일수

```text
ageGroup =
  isDisabled === true 또는 age >= 50
    → over50OrDisabled
    → under50

benefitDays = BENEFIT_DAYS_TABLE[ageGroup][insurancePeriod.index]
```

### 7-4. 예상 총액

```text
예상 총 수급액 = 1일 구직급여액 × 소정급여일수
30일 월 환산액 = 1일 구직급여액 × 30
28일 월 환산액 = 1일 구직급여액 × 28
```

UI에서는 `월 환산액`을 생활비 비교용 보조값으로 표시하고, 실제 실업인정 회차별 지급액과 다를 수 있음을 안내한다.

### 7-5. 생활비 커버 기간

```text
생활비 재원 = 예상 총 수급액 + 퇴직금 예상액 + 비상금
생활비 커버 기간 = 생활비 재원 / 월 생활비
```

보정:

- 월 생활비가 0이면 `null` 처리하고 결과 카드에는 `생활비 입력 필요` 표시.
- 소수점 1자리까지 표시.

### 7-6. 신청 기한

```text
신청/수급 유의 기한 = 퇴사일 다음 날부터 12개월
```

정확한 날짜 계산이 필요하면 `leaveDate + 12개월`로 표시한다. 날짜 파싱이 실패하면 `퇴사일 기준 12개월 내 수급 필요` 문구로 fallback한다.

---

## 8. 프리셋

```ts
export const UNEMPLOYMENT_BENEFIT_PRESETS = [
  {
    id: "salary-250-1y",
    label: "월급 250만 원·1년 근무",
    summary: "첫 이직 공백기 예상",
    input: {
      threeMonthWageTotal: 7500000,
      threeMonthTotalDays: 92,
      age: 32,
      insurancePeriodId: "1y-3y",
      leaveReasonId: "contract-expired",
      hasInsuredDays180: true,
    },
  },
  {
    id: "salary-350-3y",
    label: "월급 350만 원·3년 근무",
    summary: "일반 직장인 권고사직",
    input: {
      threeMonthWageTotal: 10500000,
      threeMonthTotalDays: 92,
      age: 38,
      insurancePeriodId: "3y-5y",
      leaveReasonId: "recommended-resignation",
      hasInsuredDays180: true,
    },
  },
  {
    id: "over-50-10y",
    label: "50세 이상·10년 근무",
    summary: "장기근속 퇴직자",
    input: {
      threeMonthWageTotal: 12000000,
      threeMonthTotalDays: 92,
      age: 52,
      insurancePeriodId: "over-10y",
      leaveReasonId: "layoff",
      hasInsuredDays180: true,
    },
  },
];
```

---

## 9. 화면 상세 설계

### 9-1. Hero

- eyebrow: `퇴사 후 생활비`
- title: `실업급여 계산기 2026`
- description: `평균임금, 고용보험 가입기간, 나이를 입력하면 2026년 기준 예상 구직급여액과 수급기간을 계산합니다.`
- CTA:
  - `예상 실업급여 계산하기`
  - `퇴직금도 함께 계산`
  - `수급기간 기준 보기`

### 9-2. InfoNotice

제목: `모의계산 안내`

문구:

- `이 계산기는 고용보험 구직급여 기준을 바탕으로 한 예상액 계산기입니다.`
- `실제 수급 여부와 지급액은 피보험단위기간, 퇴사 사유, 평균임금 산정, 실업인정 결과에 따라 달라질 수 있습니다.`
- `최종 판단은 고용센터 또는 고용보험 공식 안내를 기준으로 확인하세요.`

### 9-3. 입력 폼

#### 기본 정보

- 퇴사일
- 만 나이
- 장애인 여부
- 고용보험 가입기간
- 퇴사 사유
- 피보험단위기간 180일 이상 여부

#### 임금 정보

- 최근 3개월 임금 총액
- 최근 3개월 총 일수
- 1일 평균임금 직접 입력 토글
- 1일 평균임금
- 1일 소정근로시간

#### 생활비 옵션

- 월 생활비
- 퇴직금 예상액
- 비상금

### 9-4. 결과 KPI

| 카드 | 예시 | 설명 |
|---|---:|---|
| 예상 총 실업급여 | 12,258,000원 | 총 수급액 |
| 1일 구직급여액 | 68,100원 | 상한·하한 적용 후 일액 |
| 예상 수급기간 | 180일 | 소정급여일수 |
| 월 환산액 | 약 204만 원 | 30일 기준 생활비 비교용 |

### 9-5. 상한·하한 해석 카드

상한액 적용:

```text
평균임금의 60%가 2026년 1일 상한액 68,100원을 초과해 상한액이 적용됐습니다.
월급이 높아도 구직급여일액은 상한액을 넘을 수 없습니다.
```

하한액 적용:

```text
평균임금의 60%가 2026년 1일 하한액 66,048원보다 낮아 하한액이 적용됐습니다.
하한액은 최저임금과 1일 소정근로시간 기준으로 산정됩니다.
```

평균임금 기준:

```text
입력한 평균임금의 60%가 상한·하한 범위 안에 있어 평균임금 기준 금액이 적용됐습니다.
```

### 9-6. 자격 체크리스트

| 항목 | 상태 |
|---|---|
| 피보험단위기간 180일 이상 | `충족` 또는 `확인 필요` |
| 퇴사 사유 | `충족 가능`, `확인 필요`, `위험` |
| 근로 의사와 능력 | `필요` |
| 적극적 재취업 활동 | `필요` |
| 12개월 내 수급 | `기한 확인` |

상태 색상:

- `ok`: 초록
- `check`: 노랑
- `risk`: 빨강

단, 전체 UX는 과도하게 경고형으로 만들지 않고 “확인해야 할 것” 중심으로 표현한다.

### 9-7. 소정급여일수 표

표는 모바일에서 가로 스크롤 가능하게 만든다.

열:

- 연령 그룹
- 1년 미만
- 1년 이상~3년 미만
- 3년 이상~5년 미만
- 5년 이상~10년 미만
- 10년 이상

현재 사용자 입력에 해당하는 셀은 강조한다.

### 9-8. 생활비 플랜

표시 항목:

- 예상 총 실업급여
- 퇴직금 예상액
- 비상금
- 월 생활비
- 버틸 수 있는 기간

해석 예시:

```text
월 생활비 200만 원 기준으로 예상 실업급여, 퇴직금, 비상금을 합치면 약 7.4개월을 버틸 수 있습니다.
실업급여는 회차별 실업인정을 거쳐 지급되므로 실제 현금 흐름은 지급 일정에 따라 달라질 수 있습니다.
```

---

## 10. SeoContent 본문 설계

### 10-1. intro

```text
실업급여는 고용보험에 가입한 근로자가 비자발적으로 실직한 뒤 재취업 활동을 하는 기간에 생활 안정을 돕기 위해 지급되는 급여입니다. 정식 명칭은 구직급여이며, 금액은 이직 전 평균임금의 60%를 기준으로 계산하되 1일 상한액과 하한액이 적용됩니다.

2026년 기준 구직급여일액은 1일 상한 68,100원, 하한 66,048원을 기준으로 계산합니다. 수급기간은 퇴사 당시 나이와 고용보험 가입기간에 따라 120일에서 270일까지 달라집니다.

이 계산기는 평균임금, 고용보험 가입기간, 나이, 퇴사 사유를 입력해 예상 구직급여액과 수급기간을 빠르게 확인하도록 만든 모의계산 도구입니다. 실제 수급 여부는 고용센터 심사와 실업인정 결과에 따라 달라질 수 있습니다.
```

### 10-2. highlights

- 실업급여는 평균임금 60%를 기준으로 하되 상한·하한액이 적용됩니다.
- 2026년 기준 1일 상한액은 68,100원, 하한액은 66,048원입니다.
- 소정급여일수는 50세 미만과 50세 이상 및 장애인, 고용보험 가입기간에 따라 달라집니다.
- 피보험단위기간 180일 이상, 비자발적 이직, 재취업 활동은 주요 확인 조건입니다.

### 10-3. criteria

- 평균임금 산정 기준
- 상한·하한 적용 방식
- 소정급여일수 표
- 자발적 퇴사 예외는 고용센터 확인 필요
- 실제 지급은 실업인정 회차와 구직활동 인정에 따라 달라짐

---

## 11. FAQ

```ts
export const UNEMPLOYMENT_BENEFIT_FAQ = [
  {
    question: "실업급여는 월급의 몇 퍼센트를 받나요?",
    answer: "기본적으로 이직 전 평균임금의 60%를 기준으로 계산합니다. 다만 1일 상한액과 하한액이 있어 실제 구직급여일액은 그 범위 안에서 결정됩니다.",
  },
  {
    question: "2026년 실업급여 상한액과 하한액은 얼마인가요?",
    answer: "2026년 기준 구직급여일액은 1일 상한 68,100원, 하한 66,048원을 기준으로 계산합니다.",
  },
  {
    question: "실업급여 수급기간은 어떻게 정해지나요?",
    answer: "퇴사 당시 나이, 장애인 여부, 고용보험 가입기간에 따라 120일에서 270일까지 달라집니다.",
  },
  {
    question: "자진퇴사도 실업급여를 받을 수 있나요?",
    answer: "원칙적으로 자발적 퇴사는 수급이 어렵습니다. 다만 임금체불, 직장 내 괴롭힘, 통근 곤란 등 정당한 이직 사유가 있는 경우에는 고용센터 확인이 필요합니다.",
  },
  {
    question: "계약만료는 실업급여 대상인가요?",
    answer: "계약만료는 상황에 따라 실업급여 대상이 될 수 있습니다. 계약 갱신 여부, 회사와 근로자의 의사, 이직확인서 내용에 따라 달라질 수 있어 고용센터 확인이 필요합니다.",
  },
  {
    question: "실업급여 신청은 언제까지 해야 하나요?",
    answer: "구직급여는 이직일 다음 날부터 12개월 안에 수급해야 합니다. 소정급여일수가 남아 있어도 수급기간이 지나면 남은 일수를 받을 수 없으므로 빠르게 신청하는 것이 좋습니다.",
  },
  {
    question: "아르바이트를 하면 실업급여가 줄어드나요?",
    answer: "실업인정 기간 중 근로 제공이나 소득이 있으면 신고해야 합니다. 실제 지급 여부와 금액은 근로일수, 소득, 실업인정 결과에 따라 달라질 수 있습니다.",
  },
  {
    question: "계산 결과와 실제 지급액이 다른 이유는 무엇인가요?",
    answer: "평균임금 산정 방식, 피보험단위기간, 퇴사 사유, 실업인정일수, 구직활동 인정 여부에 따라 실제 지급액이 달라질 수 있습니다.",
  },
];
```

---

## 12. 관련 링크 / CTA

```ts
export const RELATED_UNEMPLOYMENT_LINKS = [
  {
    href: "/tools/retirement/",
    label: "퇴직금 계산기",
    description: "퇴직금까지 합쳐 퇴사 후 생활비를 계산하세요.",
  },
  {
    href: "/tools/salary/",
    label: "연봉 실수령액 계산기",
    description: "퇴사 전 월급과 연봉 기준을 다시 확인하세요.",
  },
  {
    href: "/tools/negotiation/",
    label: "이직 계산기",
    description: "재취업 시 희망 연봉과 이직 손익을 계산하세요.",
  },
  {
    href: "/tools/year-end-tax-refund-calculator/",
    label: "연말정산 환급액 계산기",
    description: "중도퇴사 후 세금 환급 가능성을 함께 확인하세요.",
  },
  {
    href: "/tools/welfare-benefit-eligibility/",
    label: "복지급여 수급 자격 계산기",
    description: "소득이 줄었다면 복지급여 가능성도 점검하세요.",
  },
];
```

CTA 문구:

- `퇴직금까지 함께 계산하기`
- `퇴사 후 생활비 플랜 보기`
- `재취업 희망 연봉 계산하기`
- `소득 감소 시 복지급여 가능성 확인`

---

## 13. 스타일 설계

SCSS 파일: `src/styles/scss/pages/_unemployment-benefit-calculator.scss`

### 13-1. 톤

- 직장인·고용보험 주제이므로 차분한 행정형 대시보드 톤.
- 과도한 장식보다 입력값과 결과 해석의 신뢰감을 우선한다.
- 색상은 기존 사이트 톤을 유지하되 상태 색상만 제한적으로 사용한다.

### 13-2. 주요 클래스

```scss
.ubc-page {}
.ubc-presets {}
.ubc-form-grid {}
.ubc-input-group {}
.ubc-result-grid {}
.ubc-kpi-card {}
.ubc-limit-card {}
.ubc-checklist {}
.ubc-checklist__item {}
.ubc-checklist__item--ok {}
.ubc-checklist__item--check {}
.ubc-checklist__item--risk {}
.ubc-days-table {}
.ubc-living-plan {}
.ubc-steps {}
.ubc-related-grid {}
```

### 13-3. 반응형

- 768px 이하: 입력 그룹 1열, KPI 카드 2열 또는 1열.
- 480px 이하: 모든 카드 1열.
- 소정급여일수 표는 `overflow-x: auto`.
- 버튼 텍스트는 줄바꿈을 허용하고 최소 높이를 고정해 레이아웃 밀림을 줄인다.

---

## 14. 클라이언트 스크립트 설계

파일: `public/scripts/unemployment-benefit-calculator.js`

### 14-1. DOM 바인딩

권장 id:

```text
ubc-leave-date
ubc-age
ubc-disabled
ubc-insurance-period
ubc-leave-reason
ubc-insured-days-180
ubc-use-direct-average-wage
ubc-three-month-wage-total
ubc-three-month-total-days
ubc-daily-average-wage
ubc-daily-work-hours
ubc-monthly-living-cost
ubc-retirement-pay
ubc-emergency-fund
```

결과 id:

```text
ubc-total-benefit
ubc-daily-benefit
ubc-benefit-days
ubc-monthly-equivalent
ubc-limit-type
ubc-interpretation
ubc-checklist
ubc-living-months
```

### 14-2. 주요 함수

```js
function parseMoney(value) {}
function formatMoney(value) {}
function formatNumber(value) {}
function getInput() {}
function calculateAverageWage(input) {}
function calculateDailyBenefit(dailyAverageWage) {}
function getBenefitDays(input) {}
function buildEligibilityChecks(input) {}
function calculateUnemploymentBenefit(input) {}
function renderResult(result) {}
function applyPreset(presetId) {}
function bindEvents() {}
```

### 14-3. 접근성

- 결과 영역은 `aria-live="polite"` 적용.
- 프리셋 버튼은 실제 버튼 요소 사용.
- 토글은 checkbox 기반으로 구현.
- 결과가 바뀌면 스크린리더가 KPI 변경을 읽을 수 있도록 주요 결과 텍스트를 갱신한다.

---

## 15. 검증 케이스

### 15-1. 계산 결과

| 케이스 | 입력 | 기대 |
|---|---|---|
| 하한 적용 | 1일 평균임금 80,000원 | 기본 48,000원 → 66,048원 |
| 상한 적용 | 1일 평균임금 150,000원 | 기본 90,000원 → 68,100원 |
| 평균임금 기준 | 1일 평균임금 112,000원 | 기본 67,200원 그대로 |
| 50세 미만 3~5년 | age 35, `3y-5y` | 180일 |
| 50세 이상 3~5년 | age 52, `3y-5y` | 210일 |
| 장애인 1~3년 | isDisabled true, `1y-3y` | 180일 |
| 월 생활비 0 | monthlyLivingCost 0 | 생활비 커버 기간 null |

### 15-2. UI 검증

- 모바일에서 입력 필드가 부모 영역을 넘지 않는다.
- 소정급여일수 표가 모바일에서 가로 스크롤된다.
- `상한액 적용`, `하한액 적용`, `평균임금 기준` 배지가 결과에 따라 바뀐다.
- 퇴사 사유가 `자발적 퇴사`일 때 자격 체크리스트가 위험 상태로 바뀐다.
- 프리셋 클릭 후 모든 결과가 즉시 갱신된다.

---

## 16. SEO / 메타

```ts
const pageTitle = "실업급여 계산기 2026";
const metaTitle = "실업급여 계산기 2026 - 구직급여 금액·수급기간 자동 계산";
const metaDescription =
  "2026년 기준 실업급여 계산기로 평균임금, 고용보험 가입기간, 나이를 입력해 1일 구직급여액, 예상 총액, 수급기간을 확인하세요.";
```

관련 키워드:

- 실업급여 계산기
- 실업급여 금액
- 실업급여 수급기간
- 구직급여 계산기
- 고용보험 실업급여 계산
- 권고사직 실업급여
- 계약만료 실업급여
- 자발적 퇴사 실업급여

---

## 17. 안전 / 정책 표현

반드시 사용할 표현:

- `예상`
- `모의계산`
- `확인 필요`
- `고용센터 확인`
- `실제 수급 여부는 달라질 수 있습니다`

피해야 할 표현:

- `수급 확정`
- `무조건 받을 수 있음`
- `신청하면 지급`
- `정확한 지급액`

결과 상단 배지:

```text
2026년 기준 · 모의계산 · 고용센터 확인 필요
```

---

## 18. 구현 체크리스트

- [ ] `src/data/unemploymentBenefitCalculator.ts` 생성
- [ ] `src/pages/tools/unemployment-benefit-calculator.astro` 생성
- [ ] `public/scripts/unemployment-benefit-calculator.js` 생성
- [ ] `src/styles/scss/pages/_unemployment-benefit-calculator.scss` 생성
- [ ] `src/styles/app.scss` 등록
- [ ] `src/data/tools.ts` 등록
- [ ] `public/sitemap.xml` URL 추가
- [ ] 관련 계산기 CTA 연결
- [ ] `npm run build` 성공
- [ ] 모바일 레이아웃 확인
- [ ] 결과 계산 케이스 확인

---

## 19. 배포 전 QA

1. `/tools/unemployment-benefit-calculator/` 직접 접근 가능
2. 계산 결과가 입력 즉시 갱신
3. 상한·하한 적용 여부 정확히 표시
4. 소정급여일수 표와 결과가 일치
5. 자발적 퇴사 선택 시 확정 표현 없이 확인 필요로 안내
6. `실업급여 계산기 2026` title/H1/description 반영
7. 관련 계산기 링크가 모두 실제 페이지로 연결
8. `npm run build` 통과

---

## 20. 후속 확장

- `/reports/unemployment-benefit-guide-2026/` 실업급여 신청방법 가이드
- `/reports/contract-expired-unemployment-benefit-2026/` 계약만료 실업급여 가이드
- `/reports/recommended-resignation-unemployment-benefit-2026/` 권고사직 실업급여 가이드
- `/tools/resignation-living-cost-calculator/` 퇴사 후 생활비 계산기
- `/compare/welfare/`에 고용보험·복지급여 비교 섹션 추가

