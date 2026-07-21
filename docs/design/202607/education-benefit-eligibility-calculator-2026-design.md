# 2026 교육급여·교육비 지원 계산기 — 설계 문서

> 작성일: 2026-07-20  
> 유형: 계산기 (`/tools/`, `SimpleToolShell`)  
> 신규 슬러그: `education-benefit-eligibility-calculator-2026`  
> 신규 콘텐츠 포지션: 기존 `복지급여 수급 자격 계산기`는 생계·의료·주거·교육급여 전체 판정이고, 이 문서는 **초·중·고 학생 가구의 교육급여 바우처·교육비 지원 신청 가능성 전용 계산기**다.

---

## 1. 배경 및 목적

교육부는 2026년 3월 초·중·고 학생 교육급여와 교육비 지원 집중 신청 기간을 운영한다고 발표했다. 교육급여는 「국민기초생활보장법」에 따른 법정 의무지출로, 기준 중위소득 50% 이하 가구의 초·중·고 학생에게 교육활동지원비와 고교 학비를 지원한다. 2026년 교육활동지원비는 전년 대비 평균 6% 인상되어 초등학생 502,000원, 중학생 699,000원, 고등학생 860,000원이다.

교육비 지원은 교육급여와 이름이 비슷하지만 성격이 다르다. 교육급여가 전국 공통 법정 급여라면, 교육비 지원은 시도교육청 재량 사업이다. 지원 대상은 기초생활수급자, 한부모가족 보호대상자, 법정 차상위, 통상 기준 중위소득 50~80% 이하 가구 등으로 안내되며, 지원 항목은 급식비, 방과후학교 자유수강권, 교육정보화비, 고교 학비 등이다. 실제 기준과 항목은 지역·학교급·예산에 따라 달라진다.

이미 사이트에는 `복지급여 수급 자격 계산기`가 있다. 하지만 그 페이지는 생계·의료·주거·교육급여 전체를 비교하는 범용 복지 계산기라, 학부모가 검색하는 "교육급여 받을 수 있나", "교육활동지원비 얼마", "교육비 지원 신청"이라는 좁은 의도에는 다소 넓다. 이 신규 계산기는 학생 수, 학교급, 가구원 수, 월 소득인정액을 입력하면 **교육급여 가능성, 예상 교육활동지원비, 교육비 지원 확인 후보**를 바로 보여주는 검색 진입용 도구로 설계한다.

**목표**
- 가구원 수와 월 소득인정액을 입력해 2026년 교육급여 기준 중위소득 50% 통과 여부 계산
- 초·중·고 학생 수를 입력해 연간 교육활동지원비 예상 합계 계산
- 고등학생이 있는 경우 무상교육 제외 학교의 입학금·수업료·교과서비 확인 안내
- 교육급여 기준을 넘더라도 교육비 지원(통상 중위 50~80% 이하 등) 확인 후보를 보여줌
- 교육급여 신청 후 바우처를 별도로 신청해야 한다는 절차를 강하게 안내
- 기존 `복지급여 수급 자격 계산기`, `중학교 교복비 계산기`, `아이 사교육비 계산기`와 내부 링크 연결

---

## 2. 중복 방지 및 포지셔닝

### 2-1. 기존 페이지와 역할 분리

| 구분 | 기존 페이지 | 신규 계산기 |
|---|---|---|
| 복지급여 전체 | `/tools/welfare-benefit-eligibility/` — 생계·의료·주거·교육급여 전체 소득인정액 간이 판정 | 교육급여와 교육비 지원만 빠르게 확인 |
| 생계급여 | `/tools/livelihood-benefit-income-recognition/` — 생계급여 소득인정액 전용 | 다루지 않음 |
| 주거급여 | `/tools/housing-benefit-income-recognition/` — 주거급여 전용 | 다루지 않음 |
| 국가장학금 | `/tools/national-scholarship-calculator-2026/` — 대학생 국가장학금 | 초·중·고 학생 지원 전용 |
| 교복비 | `/tools/school-uniform-cost-calculator-2026/` — 교복 구매 총액 | 교육급여·교육비 지원 가능성 및 지원액 |

### 2-2. 만들지 않는 것

- 생계·의료·주거급여까지 다시 계산하지 않는다. 전체 복지 판정은 기존 계산기로 연결한다.
- 복잡한 재산 소득환산액 계산을 이 페이지에서 새로 구현하지 않는다. 사용자는 `월 소득인정액`을 직접 입력하거나, "모르면 복지급여 계산기에서 먼저 계산" CTA를 따른다.
- 시도교육청별 교육비 지원 세부 기준을 확정 판정하지 않는다. 교육비 지원은 `확인 후보`로만 표시한다.
- 교복비·학원비 같은 실제 지출액 계산은 별도 계산기로 연결한다.

---

## 3. 공식 데이터 기준

### 3-1. 공식 근거

| 항목 | 2026 기준 | 출처 |
|---|---:|---|
| 교육급여 선정기준 | 기준 중위소득 50% 이하 | 교육부 2026년 교육급여 보도자료 |
| 4인 가구 교육급여 기준 | 월 3,247,369원 이하 | 교육부 보도자료, 기존 WBE 기준 |
| 교육활동지원비 초등 | 연 502,000원 | 교육부 보도자료 |
| 교육활동지원비 중등 | 연 699,000원 | 교육부 보도자료 |
| 교육활동지원비 고등 | 연 860,000원 | 교육부 보도자료 |
| 교육급여 신청처 | 행정복지센터, 복지로, 교육비 원클릭 | 교육부 보도자료 |
| 집중 신청 기간 | 2026-03-03~2026-03-20 | 교육부 보도자료 |
| 신청 가능 기간 | 연중 신청 가능, 신청일 기준 지원 | 교육부 보도자료 |
| 교육급여 바우처 | 신규 수급 선정 후 별도 신청 필요 | 교육부 보도자료, 한국장학재단 안내 |
| 교육비 지원 기준 | 기초생활수급자·한부모·차상위·통상 중위 50~80% 이하 | 교육부 보도자료 |

### 3-2. 공식 링크

- 교육부 2026년 교육급여·교육비 지원 보도자료: `https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=294&boardSeq=105459&lev=0&m=020402&opType=N&page=1&s=moe&searchType=null&statusYN=W&temp=Y`
- 교육부 2026년 교육급여 선정기준 및 최저보장수준 고시: `https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=141&boardSeq=104926&lev=0&m=0302`
- 교육급여 바우처: `https://e-voucher.kosaf.go.kr/`
- 복지로: `https://www.bokjiro.go.kr/`
- 교육비 원클릭 신청 시스템: `https://oneclick.neis.go.kr/`

### 3-3. 데이터 배지 원칙

| 배지 | 적용 대상 | 설명 |
|---|---|---|
| `공식` | 교육급여 중위 50% 기준, 교육활동지원비 단가 | 교육부 공개 기준 |
| `계산` | 학생 수 × 학교급별 교육활동지원비 | 입력값 기반 계산 |
| `추정` | 연간 합계, 지원 후보 | 실제 선정·지급은 심사 결과에 따름 |
| `확인 필요` | 교육비 지원, 고교 학비, 급식비, 방과후 자유수강권 | 시도교육청·학교별 기준 상이 |

---

## 4. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/educationBenefitEligibility2026.ts` |
| 도구 등록 | `src/data/tools.ts` |
| 페이지 | `src/pages/tools/education-benefit-eligibility-calculator-2026.astro` |
| 스크립트 | `public/scripts/education-benefit-eligibility-calculator-2026.js` |
| 스타일 | `src/styles/scss/pages/_education-benefit-eligibility-calculator-2026.scss` |
| 앱 CSS import | `src/styles/app.scss` |
| 도구 라이브러리 매핑 | `src/pages/tools/index.astro` |
| 사이트맵 | `public/sitemap.xml` |
| 인바운드 CTA 수정 | `src/data/welfareBenefitEligibility.ts`, `src/pages/reports/elementary-school-ready-cost-2026.astro`, `src/data/schoolUniformCostCalculator2026.ts` |

---

## 5. URL 및 메타

```
슬러그: /tools/education-benefit-eligibility-calculator-2026/
타이틀(seoTitle): 2026 교육급여 계산기 | 초중고 교육활동지원비 받을 수 있나 확인
디스크립션: 가구원 수·월 소득인정액·초중고 학생 수를 입력하면 2026년 교육급여 기준 통과 여부와 예상 교육활동지원비를 계산합니다. 교육비 지원 확인 항목과 신청 절차도 함께 안내합니다.
```

### SEO 타겟

| 키워드 | 검색 의도 | 대응 섹션 |
|---|---|---|
| 2026 교육급여 | 제도 기준 확인 | Hero, 기준표 |
| 교육급여 계산기 | 직접 자격 확인 | 메인 계산기 |
| 교육활동지원비 2026 | 지원금액 확인 | 학생 수별 결과 |
| 교육급여 중위소득 50 | 소득기준 확인 | 기준 중위소득 표 |
| 초중고 교육비 지원 | 교육급여 외 지원 확인 | 교육비 지원 후보 카드 |
| 교육급여 바우처 신청 | 신청 절차 확인 | 절차 타임라인 |
| 복지로 교육급여 신청 | 신청처 확인 | CTA, 체크리스트 |

---

## 6. 데이터 파일 설계

**`src/data/educationBenefitEligibility2026.ts`**

기준 중위소득과 교육급여 50% 기준은 기존 `WBE_2026_THRESHOLDS`를 import해 재사용한다. 이렇게 해야 복지급여 계산기와 숫자가 어긋나지 않는다.

```ts
import { WBE_2026_THRESHOLDS } from "./welfareBenefitEligibility";

export type EbeSchoolLevel = "elementary" | "middle" | "high";
export type EbeEligibilityStatus = "eligible" | "borderline" | "over";
export type EbeEducationCostStatus = "likely" | "check" | "unlikely";
export type EvidenceBadge = "공식" | "계산" | "추정" | "확인 필요";

export interface EbeStudentInput {
  level: EbeSchoolLevel;
  count: number;
}

export interface EbeSupportAmount {
  level: EbeSchoolLevel;
  label: string;
  annualActivitySupport: number;
  badge: EvidenceBadge;
}

export interface EbePreset {
  id: string;
  label: string;
  summary: string;
  input: {
    householdSize: number;
    monthlyRecognizedIncome: number;
    elementaryCount: number;
    middleCount: number;
    highCount: number;
  };
}

export interface EbeFaqItem {
  question: string;
  answer: string;
}

export interface EbeRelatedLink {
  href: string;
  label: string;
  description?: string;
}

export const EBE_META = {
  slug: "education-benefit-eligibility-calculator-2026",
  title: "2026 교육급여 계산기",
  seoTitle: "2026 교육급여 계산기 | 초중고 교육활동지원비 받을 수 있나 확인",
  seoDescription:
    "가구원 수·월 소득인정액·초중고 학생 수를 입력하면 2026년 교육급여 기준 통과 여부와 예상 교육활동지원비를 계산합니다. 교육비 지원 확인 항목과 신청 절차도 함께 안내합니다.",
  updatedAt: "2026-07-20",
  dataNote:
    "교육급여 선정기준과 교육활동지원비는 교육부 2026년 공식 발표 기준입니다. 이 계산기는 신청 전 자가 점검용이며 실제 선정 여부와 교육비 지원 항목은 소득·재산 조사와 시도교육청 심사 결과에 따라 달라질 수 있습니다.",
};

export const EBE_SUPPORT_AMOUNTS: EbeSupportAmount[] = [
  { level: "elementary", label: "초등학생", annualActivitySupport: 502_000, badge: "공식" },
  { level: "middle", label: "중학생", annualActivitySupport: 699_000, badge: "공식" },
  { level: "high", label: "고등학생", annualActivitySupport: 860_000, badge: "공식" },
];

export const EBE_DEFAULT_INPUT = {
  householdSize: 4,
  monthlyRecognizedIncome: 2_800_000,
  elementaryCount: 1,
  middleCount: 1,
  highCount: 0,
  showEducationCostSupport: true,
};

export const EBE_PRESETS: EbePreset[] = [
  {
    id: "four-two-children",
    label: "4인 가구 자녀 2명",
    summary: "초등 1명·중등 1명, 소득인정액 280만 원",
    input: {
      householdSize: 4,
      monthlyRecognizedIncome: 2_800_000,
      elementaryCount: 1,
      middleCount: 1,
      highCount: 0,
    },
  },
  {
    id: "single-parent-middle",
    label: "2인 한부모 중학생",
    summary: "중학생 1명, 소득인정액 180만 원",
    input: {
      householdSize: 2,
      monthlyRecognizedIncome: 1_800_000,
      elementaryCount: 0,
      middleCount: 1,
      highCount: 0,
    },
  },
  {
    id: "high-school",
    label: "3인 가구 고등학생",
    summary: "고등학생 1명, 소득인정액 250만 원",
    input: {
      householdSize: 3,
      monthlyRecognizedIncome: 2_500_000,
      elementaryCount: 0,
      middleCount: 0,
      highCount: 1,
    },
  },
];
```

### 6-1. 기준표 재사용

```ts
export const EBE_THRESHOLDS = WBE_2026_THRESHOLDS.map((row) => ({
  householdSize: row.householdSize,
  medianIncome: row.medianIncome,
  educationThreshold: row.education,
  nearEducationCostCheckLine: Math.round(row.medianIncome * 0.8),
}));
```

`nearEducationCostCheckLine`은 교육비 지원의 일반적 확인 범위(통상 중위 50~80% 이하)를 보여주는 참고선이다. 시도교육청별 세부 기준이 다르므로 "교육비 지원 가능"이 아니라 "교육비 지원 확인 필요"로만 표시한다.

---

## 7. 계산 로직

### 7-1. 교육급여 자격 가능성

```ts
educationThreshold = EBE_THRESHOLDS.find(row => row.householdSize === householdSize).educationThreshold
gap = educationThreshold - monthlyRecognizedIncome
ratio = monthlyRecognizedIncome / educationThreshold

if (monthlyRecognizedIncome <= educationThreshold) status = "eligible"
else if (monthlyRecognizedIncome <= educationThreshold * 1.1) status = "borderline"
else status = "over"
```

상태 문구:

| 상태 | 조건 | 문구 |
|---|---|---|
| `eligible` | 소득인정액 ≤ 교육급여 기준 | "교육급여 기준 안에 들어올 가능성이 있습니다" |
| `borderline` | 기준 초과 10% 이내 | "경계 구간입니다. 실제 소득·재산 조사와 교육비 지원을 함께 확인하세요" |
| `over` | 기준 초과 | "교육급여 기준은 넘지만 교육비 지원이나 다른 제도는 확인할 수 있습니다" |

### 7-2. 예상 교육활동지원비

```ts
elementarySupport = elementaryCount * 502000
middleSupport = middleCount * 699000
highSupport = highCount * 860000
totalActivitySupport = elementarySupport + middleSupport + highSupport

expectedActivitySupport =
  status === "eligible" ? totalActivitySupport : 0
```

경계/초과 구간에서는 금액을 0원으로 처리하되, "선정되면 받을 수 있는 연간 교육활동지원비"를 별도 참고 카드로 표시한다.

### 7-3. 교육비 지원 확인 후보

교육비 지원은 시도교육청 기준이 다르므로 확정 판정하지 않는다.

```ts
educationCostCheckLine = medianIncome * 0.8

if (monthlyRecognizedIncome <= educationThreshold) educationCostStatus = "likely"
else if (monthlyRecognizedIncome <= educationCostCheckLine) educationCostStatus = "check"
else educationCostStatus = "unlikely"
```

문구:

| 상태 | 의미 | 문구 |
|---|---|---|
| `likely` | 교육급여 기준 안 | "교육급여와 함께 교육비 지원 항목도 확인하세요" |
| `check` | 중위 50~80% 참고선 | "교육급여는 어려울 수 있지만 교육비 지원은 교육청 기준으로 확인할 만합니다" |
| `unlikely` | 중위 80% 초과 | "일반 교육비 지원 기준은 넘을 가능성이 큽니다. 지역별 예외 지원을 확인하세요" |

### 7-4. 고등학생 추가 안내

고등학생 수가 1명 이상이면 다음 안내를 노출한다.

- 고교 무상교육 제외 학교는 입학금·수업료·교과서비 지원 여부 확인
- 교육비 지원에서는 학교운영지원비, 급식비, 방과후학교 자유수강권, 교육정보화비 등 추가 항목 확인
- 교육급여 대상자는 교육활동지원비 바우처 신청이 별도로 필요

---

## 8. UX 설계

### 8-1. 페이지 구조

1. Hero
   - H1: `2026 교육급여 계산기`
   - 설명: `가구원 수, 월 소득인정액, 초·중·고 학생 수를 입력하면 교육급여 가능성과 예상 교육활동지원비를 확인합니다.`
   - Hero stats:
     - `초등 50.2만`
     - `중등 69.9만`
     - `고등 86.0만`

2. InfoNotice
   - 교육급여는 기준 중위소득 50% 이하
   - 교육비 지원은 시도교육청 재량 사업
   - 신규 수급자는 교육급여 신청 후 바우처 별도 신청 필요

3. 입력 패널
   - 가구원 수
   - 월 소득인정액
   - 초등학생 수
   - 중학생 수
   - 고등학생 수
   - 빠른 입력 프리셋

4. 결과 패널
   - 교육급여 가능성
   - 기준선 대비 차이
   - 예상 교육활동지원비
   - 교육비 지원 확인 후보
   - 신청 절차 타임라인

5. 기준표
   - 가구원 수별 2026 기준 중위소득, 교육급여 50%, 교육비 지원 확인선 80%

6. 체크리스트
   - 신청 전 준비 서류
   - 바우처 별도 신청
   - 교육비 원클릭 확인

7. SEO 콘텐츠
   - intro 5단락 이상
   - FAQ 8개 이상
   - 관련 링크

### 8-2. 입력 상세

| 항목 | UI | 기본값 | 검증 |
|---|---|---:|---|
| 가구원 수 | stepper 또는 select | 4 | 1~6, 7인 이상은 6인 초과 안내 |
| 월 소득인정액 | numeric input | 2,800,000 | 0~20,000,000 |
| 초등학생 수 | stepper | 1 | 0~5 |
| 중학생 수 | stepper | 1 | 0~5 |
| 고등학생 수 | stepper | 0 | 0~5 |
| 교육비 지원 보기 | toggle | 켜짐 | boolean |

### 8-3. 결과 카드

| 카드 | 표시값 | 배지 |
|---|---|---|
| 교육급여 가능성 | `eligible/borderline/over` | 계산 |
| 기준선 차이 | `educationThreshold - income` | 공식 기준 대비 |
| 선정 시 교육활동지원비 | `totalActivitySupport` | 공식 단가 × 학생 수 |
| 예상 지급액 | eligible이면 `totalActivitySupport`, 아니면 0 | 추정 |
| 교육비 지원 확인 | `likely/check/unlikely` | 확인 필요 |

### 8-4. 신청 절차 타임라인

1. 교육급여 신청
   - 행정복지센터 방문, 복지로, 교육비 원클릭
2. 소득·재산 조사 및 급여 결정
   - 학교·교육청 통지
3. 교육급여 바우처 별도 신청
   - 교육급여 바우처 누리집
4. 바우처 배정 및 사용
   - 신용·체크카드, 선불카드, 간편결제 방식

---

## 9. 스크립트 설계

**`public/scripts/education-benefit-eligibility-calculator-2026.js`**

### 9-1. 패턴

- IIFE 패턴
- `data-ebe-input`, `data-ebe-result`, `data-ebe-preset` 기반 DOM 조작
- `textContent`만 사용
- URL state 유지
- 숫자 입력 콤마 포맷
- 기준표는 TS 데이터에서 Astro가 렌더링하고, JS는 결과 강조만 업데이트

### 9-2. 상태 구조

```js
const state = {
  householdSize: 4,
  monthlyRecognizedIncome: 2800000,
  elementaryCount: 1,
  middleCount: 1,
  highCount: 0,
  showEducationCostSupport: true,
};
```

### 9-3. URL 파라미터

| 파라미터 | 의미 | 예시 |
|---|---|---|
| `household` | 가구원 수 | `4` |
| `income` | 월 소득인정액 | `2800000` |
| `el` | 초등학생 수 | `1` |
| `mid` | 중학생 수 | `1` |
| `high` | 고등학생 수 | `0` |
| `cost` | 교육비 지원 후보 보기 | `1` |

### 9-4. 복사 문구

> 4인 가구, 초등 1명·중등 1명 기준 교육급여 선정 시 연간 교육활동지원비는 약 120.1만 원입니다. 월 소득인정액이 기준선보다 X원 낮거나 높습니다.

---

## 10. Astro 페이지 설계

**`src/pages/tools/education-benefit-eligibility-calculator-2026.astro`**

### 10-1. import

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
  EBE_META,
  EBE_THRESHOLDS,
  EBE_SUPPORT_AMOUNTS,
  EBE_DEFAULT_INPUT,
  EBE_PRESETS,
  EBE_FAQ,
  EBE_SEO_CONTENT,
  EBE_RELATED_LINKS,
  EBE_SOURCES,
} from "../../data/educationBenefitEligibility2026";
---
```

### 10-2. JSON-LD

```ts
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "2026 교육급여 계산기",
  applicationCategory: "FinanceApplication",
  operatingSystem: "All",
  inLanguage: "ko-KR",
  isAccessibleForFree: true,
  url: `${siteUrl}/tools/education-benefit-eligibility-calculator-2026/`,
  description: EBE_META.seoDescription,
  provider: { "@type": "Organization", name: "비교계산소" },
  mainEntity: { "@type": "FAQPage", mainEntity: faqSchema }
}
```

### 10-3. 마크업 구조

- `SimpleToolShell calculatorId="education-benefit-eligibility-calculator-2026" pageClass="ebe-page"`
- `CalculatorHero` hero
- `InfoNotice` 공식 기준 안내
- `slot="aside"` 입력 패널
- `slot="main"` 결과/기준표/타임라인
- `<Fragment slot="seo">` 안에 `SeoContent`

---

## 11. SCSS 설계

**`src/styles/scss/pages/_education-benefit-eligibility-calculator-2026.scss`**

### 11-1. prefix

모든 클래스는 `ebe-` prefix를 사용한다.

```scss
.ebe-page {}
.ebe-preset-grid {}
.ebe-student-count-grid {}
.ebe-result-kpi {}
.ebe-threshold-meter {}
.ebe-support-breakdown {}
.ebe-process-timeline {}
.ebe-threshold-table {}
.ebe-checklist {}
```

### 11-2. 디자인 방향

- 복지·지원금 주제이므로 신뢰감 있는 정보형 UI.
- 결과는 "확정" 느낌을 주지 않도록 `가능성`, `자가 점검`, `확인 필요` 라벨을 반복한다.
- eligible 상태는 초록, borderline은 노랑, over는 회색/파랑 안내 톤.
- 모바일에서 소득 기준표는 카드형으로 전환한다.

### 11-3. 반응형 기준

| 구간 | 처리 |
|---|---|
| 320~479px | 입력 1열, KPI 1열, 기준표 카드형 |
| 480~767px | 학생 수 stepper 3열 가능, KPI 2열 |
| 768px 이상 | 입력/결과 2컬럼, 기준표 테이블 유지 |

---

## 12. SEO 콘텐츠 설계

### 12-1. `EBE_SEO_CONTENT`

```ts
export const EBE_SEO_CONTENT = {
  introTitle: "교육급여는 교육비 지원과 함께 확인해야 합니다",
  intro: [
    "교육급여는 초·중·고 학생이 있는 저소득 가구의 교육비 부담을 줄이기 위한 기초생활보장 급여입니다. 2026년 기준으로 교육급여는 기준 중위소득 50% 이하 가구의 학생을 대상으로 하며, 초등학생·중학생·고등학생에게 교육활동지원비를 연 1회 지원합니다.",
    "2026년 교육활동지원비는 초등학생 50만 2천 원, 중학생 69만 9천 원, 고등학생 86만 원입니다. 고등학생의 경우 고교 무상교육 제외 학교라면 입학금, 수업료, 교과서비 지원 여부도 함께 확인해야 합니다. 이 계산기는 학생 수를 학교급별로 입력하면 선정 시 받을 수 있는 연간 교육활동지원비 합계를 계산합니다.",
    "교육급여와 교육비 지원은 이름이 비슷하지만 다릅니다. 교육급여는 국민기초생활보장법에 따른 전국 공통 급여이고, 교육비 지원은 시도교육청이 자체 기준으로 운영하는 지원입니다. 교육비 지원에는 급식비, 방과후학교 자유수강권, 교육정보화비, 고교 학비 등이 포함될 수 있습니다.",
    "소득기준을 볼 때는 단순 월급이 아니라 소득인정액을 기준으로 봐야 합니다. 소득인정액은 소득과 재산을 함께 반영한 값이므로, 월급만 보고 대상 여부를 단정하기 어렵습니다. 소득인정액을 모른다면 먼저 복지급여 수급 자격 계산기에서 간이 계산한 뒤 이 페이지에 입력하는 흐름이 좋습니다.",
    "교육급여는 연중 신청할 수 있지만 신청일을 기준으로 지원되기 때문에 3월 집중 신청 기간에 신청하는 것이 유리합니다. 신규 수급자로 선정된 경우에는 교육급여 신청만으로 끝나는 것이 아니라, 한국장학재단의 교육급여 바우처 누리집에서 교육활동지원비 이용권을 별도로 신청해야 합니다.",
  ],
  inputPoints: [
    "가구원 수와 월 소득인정액을 입력하면 2026년 교육급여 기준 중위소득 50% 기준선과 비교합니다.",
    "초등·중등·고등 학생 수를 입력하면 선정 시 받을 수 있는 교육활동지원비 합계를 계산합니다.",
    "교육급여 기준을 넘는 경우에도 교육비 지원 확인 후보를 함께 안내합니다.",
  ],
  criteria: [
    "2026년 교육급여는 기준 중위소득 50% 이하 가구 학생이 대상입니다.",
    "교육활동지원비는 초등 502,000원, 중등 699,000원, 고등 860,000원입니다.",
    "교육비 지원은 시도교육청 재량 사업으로 지역별 기준과 항목이 다를 수 있습니다.",
    "이 계산기는 자가 점검용이며 실제 선정 여부는 소득·재산 조사와 교육청 심사 결과에 따릅니다.",
  ],
};
```

### 12-2. FAQ

최소 8개 제공.

```ts
export const EBE_FAQ: EbeFaqItem[] = [
  {
    question: "2026년 교육급여 기준은 얼마인가요?",
    answer: "2026년 교육급여는 기준 중위소득 50% 이하 가구 학생을 대상으로 합니다. 예를 들어 4인 가구 기준은 월 3,247,369원 이하입니다.",
  },
  {
    question: "2026년 교육활동지원비는 얼마인가요?",
    answer: "교육부 발표 기준 초등학생은 연 502,000원, 중학생은 연 699,000원, 고등학생은 연 860,000원입니다.",
  },
  {
    question: "교육급여와 교육비 지원은 같은 제도인가요?",
    answer: "아닙니다. 교육급여는 국민기초생활보장법에 따른 전국 공통 급여이고, 교육비 지원은 시도교육청이 자체 기준으로 운영하는 사업입니다.",
  },
  {
    question: "교육급여는 어디에서 신청하나요?",
    answer: "주소지 읍면동 행정복지센터를 방문하거나 복지로, 교육비 원클릭 신청 시스템에서 신청할 수 있습니다.",
  },
  {
    question: "교육급여 바우처는 자동으로 나오나요?",
    answer: "신규 수급자로 선정되면 교육급여 바우처 누리집에서 교육활동지원비 이용권을 별도로 신청해야 합니다. 교육급여 신청과 바우처 신청은 절차가 다릅니다.",
  },
  {
    question: "교육급여 기준을 조금 넘으면 아무 지원도 못 받나요?",
    answer: "그렇지 않을 수 있습니다. 교육급여 기준을 넘더라도 시도교육청의 교육비 지원은 통상 기준 중위소득 50~80% 이하 등 별도 기준으로 확인할 수 있습니다.",
  },
  {
    question: "소득인정액을 모르면 어떻게 하나요?",
    answer: "소득인정액은 소득과 재산을 함께 반영한 값입니다. 정확한 값은 심사로 결정되며, 신청 전에는 복지급여 수급 자격 계산기에서 간이로 먼저 확인할 수 있습니다.",
  },
  {
    question: "이미 교육급여를 받고 있으면 다시 신청해야 하나요?",
    answer: "교육부 안내에 따르면 이미 지원을 받고 있는 학생은 다시 신청할 필요가 없습니다. 다만 신규 수급자나 새로 지원이 필요한 학생은 신청해야 합니다.",
  },
];
```

---

## 13. 내부 링크 전략

### 13-1. 인바운드

| 출발 페이지 | 연결 방식 |
|---|---|
| `/tools/welfare-benefit-eligibility/` | 교육급여 결과 카드에서 "교육활동지원비 자세히 계산" CTA |
| `/reports/2026-government-welfare-benefits/` | 교육급여 섹션 CTA |
| `/reports/elementary-school-ready-cost-2026/` | 입학 준비비 지원 안내 CTA |
| `/tools/school-uniform-cost-calculator-2026/` | 교복 지원금/교육비 지원 확인 CTA |
| `/tools/child-tutoring-cost-calculator/` | 교육비 부담 관련 링크 |

### 13-2. 아웃바운드

```ts
export const EBE_RELATED_LINKS: EbeRelatedLink[] = [
  {
    href: "/tools/welfare-benefit-eligibility/",
    label: "복지급여 수급 자격 계산기",
    description: "소득인정액을 모른다면 생계·주거·교육급여 기준을 먼저 함께 확인하세요.",
  },
  {
    href: "/tools/school-uniform-cost-calculator-2026/",
    label: "중학교 교복비 계산기 2026",
    description: "교복·체육복 첫 구매 비용과 지원금 차감 후 부담액을 계산합니다.",
  },
  {
    href: "/reports/elementary-school-ready-cost-2026/",
    label: "초등학교 입학 준비 비용 2026",
    description: "책가방·문구·체육복 등 입학 전 준비비를 확인합니다.",
  },
  {
    href: "/tools/child-tutoring-cost-calculator/",
    label: "아이 사교육비 계산기",
    description: "월 학원비와 연간 교육비를 따로 계산합니다.",
  },
  {
    href: "/compare/welfare/",
    label: "지원금 비교표",
    description: "청년·출산·복지급여 지원금을 상황별로 비교합니다.",
  },
];
```

---

## 14. 도구 등록 메타

**`src/data/tools.ts`**

교육비·지원금 클러스터에 배치한다.

```ts
{
  slug: "education-benefit-eligibility-calculator-2026",
  title: "2026 교육급여 계산기",
  description:
    "가구원 수·월 소득인정액·초중고 학생 수를 입력하면 교육급여 기준 통과 여부와 예상 교육활동지원비를 계산합니다.",
  order: 72.36,
  eyebrow: "교육급여",
  category: "support",
  iframeReady: false,
  badges: ["신규", "교육비", "2026"],
  previewStats: [
    { label: "초등", value: "50.2만", context: "교육활동지원비" },
    { label: "중·고", value: "69.9만~86만", context: "연 1회" },
  ],
}
```

**도구 라이브러리 카테고리**

`src/pages/tools/index.astro`의 `topicBySlug`에는 `"복지·지원금"`으로 등록한다. 향후 `교육비·학교` 카테고리를 신설하면 `school-uniform-cost-calculator-2026`, `education-benefit-eligibility-calculator-2026`, `university-cost-calculator-2026`, `national-scholarship-calculator-2026`를 함께 이동할 수 있다.

---

## 15. 사이트맵 및 OG

### 15-1. sitemap

```xml
<url>
  <loc>https://bigyocalc.com/tools/education-benefit-eligibility-calculator-2026/</loc>
  <lastmod>2026-07-20</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

### 15-2. OG 이미지

전용 OG 생성 권장.

권장 문구:

- Eyebrow: `2026 교육급여`
- Title: `교육활동지원비 받을 수 있나`
- Stats:
  - `초등 50.2만`
  - `중등 69.9만`
  - `고등 86.0만`

---

## 16. 품질 및 QA 체크리스트

### 16-1. 계산 검증

- [ ] `WBE_2026_THRESHOLDS`의 교육급여 기준과 신규 계산기 기준이 일치하는지 확인
- [ ] 4인 가구 기준 교육급여 기준이 3,247,369원으로 표시되는지 확인
- [ ] 초등 1명·중등 1명 합계가 1,201,000원으로 계산되는지 확인
- [ ] 기준 초과 시 예상 지급액은 0원, 선정 시 받을 수 있는 참고 금액은 별도 표시되는지 확인
- [ ] 교육비 지원 후보는 확정 표현이 아니라 `확인 필요`로 표시되는지 확인
- [ ] 고등학생 수가 1명 이상일 때 고교 학비 안내가 노출되는지 확인

### 16-2. UX 검증

- [ ] 320px 모바일에서 입력과 결과 카드가 넘치지 않음
- [ ] 학생 수 stepper가 터치 환경에서 충분히 큼
- [ ] 프리셋 클릭 시 입력값과 결과가 즉시 갱신됨
- [ ] 기준표에서 현재 가구원 수 행이 강조됨
- [ ] 신청 절차 타임라인이 모바일에서 읽기 쉬움
- [ ] 복사 링크가 현재 입력값을 유지함

### 16-3. SEO 검증

- [ ] H1에 `2026 교육급여 계산기` 포함
- [ ] title 60자 이내
- [ ] meta description 120~160자 안팎
- [ ] FAQ 8개 이상
- [ ] intro 5단락 이상, 800자 이상
- [ ] 공식 출처 링크 포함
- [ ] `FAQPage` JSON-LD 포함
- [ ] sitemap 등록

### 16-4. 보안 검증

- [ ] 사용자 입력값을 `innerHTML`에 삽입하지 않음
- [ ] URL 파라미터 숫자 범위 검증
- [ ] allowlist 없는 문자열 상태 사용 금지
- [ ] 외부 링크는 새 창일 경우 `rel="noopener noreferrer"`
- [ ] 개인정보 입력 없음, 서버 전송 없음

---

## 17. 구현 순서

1. `src/data/educationBenefitEligibility2026.ts` 작성
2. `src/pages/tools/education-benefit-eligibility-calculator-2026.astro` 작성
3. `public/scripts/education-benefit-eligibility-calculator-2026.js` 작성
4. `src/styles/scss/pages/_education-benefit-eligibility-calculator-2026.scss` 작성
5. `src/data/tools.ts` 등록
6. `src/pages/tools/index.astro` topic 등록
7. `src/styles/app.scss` import 추가
8. `public/sitemap.xml` 등록
9. 기존 복지급여/교복비/초등 입학준비 페이지 related 링크 보강
10. `npm run build` 검증

---

## 18. 리스크 및 보완

| 리스크 | 설명 | 보완 |
|---|---|---|
| 기존 복지급여 계산기와 중복 | 교육급여 50% 기준은 이미 포함 | 초·중·고 학생 수별 교육활동지원비와 바우처 신청 절차에 집중 |
| 교육비 지원 기준 지역차 | 시도교육청별 기준과 항목이 다름 | 확정 판정 금지, `확인 필요` 카드로 표시 |
| 소득인정액 입력 어려움 | 사용자가 정확한 값을 모를 수 있음 | 복지급여 계산기 CTA와 "소득인정액 먼저 계산" 안내 |
| 바우처 신청 누락 | 교육급여 선정 후 바우처 별도 신청 필요 | 결과와 타임라인에서 반복 안내 |
| 금액 확정 오해 | 계산 결과가 실제 지급액처럼 보일 수 있음 | `자가 점검`, `선정 시`, `실제 심사 결과 우선` 문구 고정 |

---

## 19. 2차 확장 아이디어

1. **시도교육청별 교육비 지원 비교 리포트**
   - 급식비, 방과후 자유수강권, 교육정보화비 기준 차이 정리

2. **교육급여 바우처 사용처 가이드**
   - 어디에 쓸 수 있고 어디에 못 쓰는지 FAQ형 콘텐츠

3. **한부모·차상위 교육비 지원 계산기**
   - 교육급여 기준을 넘는 가구를 위한 별도 확인 도구

4. **입학 준비비 통합 계산기**
   - 교복비 + 학용품 + 방과후 + 교육급여/교육비 지원을 한 화면에서 합산

---

## 20. 최종 판정

`2026 교육급여·교육비 지원 계산기`는 기존 복지 전체 계산기의 하위 랜딩으로 만들 가치가 있다. 검색 의도는 "복지급여 전체"보다 훨씬 구체적이고, 학부모는 학생 수와 학교급에 따라 실제 얼마를 받을 수 있는지 바로 알고 싶어 한다. 교육급여 기준은 공식 수치가 명확하고, 교육비 지원은 지역차가 있으므로 확정 판정 대신 확인 후보로 설계하면 데이터 신뢰성과 실사용성을 함께 확보할 수 있다.
