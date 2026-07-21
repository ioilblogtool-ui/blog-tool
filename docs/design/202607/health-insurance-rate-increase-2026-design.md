# 2026 건강보험료 인상액 계산기 — 설계 문서

> 작성일: 2026-07-20  
> 유형: 계산기 (`/tools/`, `SimpleToolShell`)  
> 신규 슬러그: `health-insurance-rate-increase-2026`  
> 차별화 기준: 기존 `/tools/health-insurance-premium-calculator/`는 직장·지역·퇴직 전환의 "보험료 총액" 계산기이고, 이 문서는 2025년 대비 2026년 "인상액·인상률·월급별 체감 차이"에 집중하는 컴패니언 계산기 설계다.

---

## 1. 배경 및 목적

2026년 건강보험료율은 보건복지부 발표 기준 7.19%로 결정되었고, 2025년 7.09% 대비 0.1%p 인상되었다. 직장가입자는 근로자와 사용자가 50%씩 부담하므로 근로자 본인 부담률은 2025년 3.545%에서 2026년 3.595%로 오른다. 장기요양보험료도 건강보험료에 연동되기 때문에 실제 급여명세서 체감액은 건강보험료 인상분만이 아니라 장기요양보험료 증가분까지 함께 봐야 한다.

이미 사이트에는 `건강보험료 계산기 2026`이 있지만, 해당 페이지는 직장가입자·지역가입자·퇴직 전환 비교를 모두 다루는 범용 계산기다. 네이버 검색에서는 "건강보험료 인상", "2026 건강보험료 얼마나 오르나", "월급 300 건강보험료 인상액"처럼 **전년 대비 차이**를 바로 알고 싶어 하는 생활형 검색 의도가 따로 생길 수 있다. 이 신규 계산기는 그 의도만 좁게 잡는다.

**목표**
- 월급 또는 연봉을 입력하면 2025년 대비 2026년 건강보험료·장기요양보험료·합계 인상액을 즉시 계산
- 직장가입자 본인 부담분, 회사 부담분, 총 납부분을 한 화면에서 비교
- 월급 구간별 예시표를 제공해 "내 월급이면 얼마나 더 빠지나"를 빠르게 이해하게 함
- 기존 `건강보험료 계산기 2026`, `4대보험 계산기 2026`, `연봉 실수령 계산기`로 자연스럽게 연결
- 공식 수치와 간이 추정을 명확히 분리해 품질 루브릭의 데이터 신뢰성 기준을 충족

---

## 2. 중복 방지 및 포지셔닝

### 2-1. 기존 페이지와 역할 분리

| 구분 | 기존 `health-insurance-premium-calculator` | 신규 `health-insurance-rate-increase-2026` |
|---|---|---|
| 핵심 질문 | 2026년에 건강보험료가 얼마인가? | 2025년보다 2026년에 얼마나 더 내나? |
| 주요 입력 | 월급·연봉, 지역가입자 소득·재산, 퇴직 전환 조건 | 월 보수월액 또는 연봉, 보기 옵션 |
| 주요 출력 | 2026 월 보험료 총액, 지역가입자 간이 추정, 퇴직 전환 비교 | 2025 vs 2026 차이, 월/연 인상액, 회사 부담분 포함 비교 |
| 검색 의도 | 건강보험료 계산기, 지역가입자 건강보험료, 퇴직 건강보험료 | 건강보험료 인상액, 2026 건강보험료 인상, 월급별 건보료 차이 |
| 복잡도 | 높음 | 낮음, 즉시 답변형 |

### 2-2. 만들지 않는 것

- 지역가입자 재산·자동차 점수 간이 산식은 신규 페이지에서 직접 구현하지 않는다. 지역가입자 정밀/간이 총액은 기존 건강보험료 계산기로 유도한다.
- 국민연금·고용보험·소득세까지 포함한 월급 실수령액 계산은 새 페이지의 핵심이 아니다. 결과 하단 CTA로 `4대보험 계산기`, `연봉 인상 계산기`를 연결한다.
- 피부양자 자격, 임의계속가입, 퇴직 후 지역가입자 전환 시뮬레이션은 기존 건강보험료 계산기의 `transition` 모드로 보낸다.

---

## 3. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/healthInsuranceRateIncrease2026.ts` |
| 도구 등록 | `src/data/tools.ts` |
| 페이지 | `src/pages/tools/health-insurance-rate-increase-2026.astro` |
| 스크립트 | `public/scripts/health-insurance-rate-increase-2026.js` |
| 스타일 | `src/styles/scss/pages/_health-insurance-rate-increase-2026.scss` |
| 앱 CSS import | `src/styles/app.scss` |
| 사이트맵 | `public/sitemap.xml` |
| 인바운드 CTA 수정 | `src/data/healthInsurancePremiumCalculator.ts`, `src/data/fourInsuranceCalculator.ts` 또는 관련 SeoContent |

---

## 4. URL 및 메타

```
슬러그: /tools/health-insurance-rate-increase-2026/
타이틀(seoTitle): 2026 건강보험료 인상액 계산기 | 월급별 건보료 차이 바로 계산
디스크립션: 월급·연봉을 입력하면 2025년 대비 2026년 건강보험료와 장기요양보험료가 월·연 단위로 얼마나 오르는지 계산합니다. 직장가입자 본인 부담분과 회사 부담분을 함께 비교하세요.
```

### 검색 타겟

| 키워드 | 검색 의도 | 대응 섹션 |
|---|---|---|
| 2026 건강보험료 인상 | 제도 변화 확인 | Hero, 공식 기준 카드 |
| 건강보험료 인상액 계산기 | 직접 계산 | 메인 입력/결과 |
| 월급 300 건강보험료 | 내 월급 구간 체감 | 프리셋, 월급별 예시표 |
| 건강보험료율 2026 | 공식 요율 확인 | 데이터 기준 표 |
| 장기요양보험료 2026 | 건보료 외 추가 부담 확인 | 상세 공제 표, FAQ |
| 직장가입자 건강보험료 인상 | 본인 부담 확인 | 직장가입자 결과 카드 |
| 회사 건강보험료 부담 | 사용자 부담분 확인 | 회사 부담 토글 |

---

## 5. 공식 데이터 기준

### 5-1. 출처

| 항목 | 2025 | 2026 | 출처/메모 |
|---|---:|---:|---|
| 건강보험료율 | 7.09% | 7.19% | 보건복지부, 국민건강보험공단 |
| 직장가입자 근로자 부담률 | 3.545% | 3.595% | 건강보험료율의 50% |
| 직장가입자 사용자 부담률 | 3.545% | 3.595% | 건강보험료율의 50% |
| 지역가입자 점수당 금액 | 208.4원 | 211.5원 | 국민건강보험공단 |
| 장기요양보험료율(소득 대비) | 0.9182% | 0.9448% | 국민건강보험공단 EDI 안내 |
| 장기요양보험료율(건보료 대비 환산) | 약 12.95% | 약 13.14% | `장기요양보험료율 / 건강보험료율` |

### 5-2. 공식 링크

- 보건복지부: `https://www.mohw.go.kr/gallery.es?act=view&bid=0003&list_no=379625&mid=a10505000000`
- 국민건강보험공단 보험료율 안내: `https://www.nhis.or.kr/english/wbheaa02500m01.do`
- 국민건강보험 EDI 2026년도 보험료율 인상 안내: `https://edi.nhis.or.kr/portal/images/popup/20251204_pop01longdesc.html`
- 보건복지부 재원조달체계: `https://www.mohw.go.kr/menu.es?mid=a10705010500`

### 5-3. 데이터 배지 원칙

| 표시 | 적용 대상 | 문구 |
|---|---|---|
| `공식` | 2025/2026 건강보험료율, 점수당 금액, 장기요양보험료율 | "보건복지부·국민건강보험공단 기준" |
| `계산` | 입력 월급에 요율을 곱해 산출한 인상액 | "입력값 기반 계산" |
| `추정` | 연봉을 12개월로 나눈 보수월액, 연간 환산액 | "실제 신고 보수월액과 다를 수 있음" |
| `안내` | 지역가입자·퇴직 전환 유도 문구 | "정확한 고지액은 공단 조회 필요" |

---

## 6. 데이터 파일 설계

**`src/data/healthInsuranceRateIncrease2026.ts`**

기존 `src/data/healthInsurancePremiumCalculator.ts`의 `HEALTH_INSURANCE_RULES_2026`를 재사용하는 방향이 좋다. 다만 기존 파일의 source URL 일부가 예전 보도자료 경로일 수 있으므로, 신규 데이터 파일은 인상액 계산에 필요한 상수와 공식 링크를 자체적으로 명시한다. 구현 시 기존 상수를 import해서 중복을 줄이되, 문서 기준은 아래 구조를 따른다.

```ts
export type HiriIncomeMode = "monthlyWage" | "annualSalary";
export type HiriViewMode = "employeeOnly" | "employeeAndEmployer" | "total";
export type EvidenceBadge = "공식" | "계산" | "추정" | "안내";

export interface HiriRateSet {
  year: 2025 | 2026;
  healthRate: number;              // 전체 건강보험료율
  employeeShareRate: number;       // 직장가입자 본인 부담률
  employerShareRate: number;       // 직장가입자 사용자 부담률
  longTermCareRateByIncome: number; // 소득 대비 장기요양보험료율
  longTermCareRateOnHealthPremium: number; // 건강보험료 대비 환산율
  regionalPointUnitPrice: number;
}

export interface HiriPreset {
  id: string;
  label: string;
  description: string;
  monthlyWage: number;
}

export interface HiriSource {
  label: string;
  url: string;
  badge: EvidenceBadge;
}

export interface HiriFaqItem {
  question: string;
  answer: string;
}

export interface HiriRelatedLink {
  href: string;
  label: string;
  description?: string;
}

export const HIRI_META = {
  slug: "health-insurance-rate-increase-2026",
  title: "2026 건강보험료 인상액 계산기",
  seoTitle: "2026 건강보험료 인상액 계산기 | 월급별 건보료 차이 바로 계산",
  seoDescription:
    "월급·연봉을 입력하면 2025년 대비 2026년 건강보험료와 장기요양보험료가 월·연 단위로 얼마나 오르는지 계산합니다. 직장가입자 본인 부담분과 회사 부담분을 함께 비교하세요.",
  updatedAt: "2026-07-20",
  dataNote:
    "2026년 건강보험료율 7.19%, 장기요양보험료율 0.9448%는 보건복지부·국민건강보험공단 공개 기준입니다. 연봉 입력은 12개월로 나눈 보수월액 추정이며, 실제 급여명세서와 보수월액 신고 기준에 따라 차이가 날 수 있습니다.",
};

export const HIRI_RATES: Record<2025 | 2026, HiriRateSet> = {
  2025: {
    year: 2025,
    healthRate: 0.0709,
    employeeShareRate: 0.03545,
    employerShareRate: 0.03545,
    longTermCareRateByIncome: 0.009182,
    longTermCareRateOnHealthPremium: 0.1295,
    regionalPointUnitPrice: 208.4,
  },
  2026: {
    year: 2026,
    healthRate: 0.0719,
    employeeShareRate: 0.03595,
    employerShareRate: 0.03595,
    longTermCareRateByIncome: 0.009448,
    longTermCareRateOnHealthPremium: 0.1314,
    regionalPointUnitPrice: 211.5,
  },
};

export const HIRI_DEFAULT_INPUT = {
  incomeMode: "monthlyWage" as HiriIncomeMode,
  monthlyWage: 3_000_000,
  annualSalary: 36_000_000,
  viewMode: "employeeAndEmployer" as HiriViewMode,
};

export const HIRI_PRESETS: HiriPreset[] = [
  { id: "wage-250", label: "월급 250만", description: "신입·초년생", monthlyWage: 2_500_000 },
  { id: "wage-300", label: "월급 300만", description: "평균 직장인 체감", monthlyWage: 3_000_000 },
  { id: "wage-400", label: "월급 400만", description: "연봉 4,800만", monthlyWage: 4_000_000 },
  { id: "wage-500", label: "월급 500만", description: "연봉 6,000만", monthlyWage: 5_000_000 },
  { id: "wage-700", label: "월급 700만", description: "고소득 직장인", monthlyWage: 7_000_000 },
];

export const HIRI_SOURCES: HiriSource[] = [
  {
    label: "보건복지부 2026년 건강보험료율 7.19% 결정",
    url: "https://www.mohw.go.kr/gallery.es?act=view&bid=0003&list_no=379625&mid=a10505000000",
    badge: "공식",
  },
  {
    label: "국민건강보험공단 보험료율 안내",
    url: "https://www.nhis.or.kr/english/wbheaa02500m01.do",
    badge: "공식",
  },
  {
    label: "국민건강보험 EDI 2026년도 보험료율 인상 안내",
    url: "https://edi.nhis.or.kr/portal/images/popup/20251204_pop01longdesc.html",
    badge: "공식",
  },
];
```

---

## 7. 계산 로직

### 7-1. 입력 정규화

```ts
function getMonthlyWage(input: {
  incomeMode: HiriIncomeMode;
  monthlyWage: number;
  annualSalary: number;
}) {
  if (input.incomeMode === "annualSalary") {
    return Math.round(input.annualSalary / 12);
  }
  return input.monthlyWage;
}
```

### 7-2. 직장가입자 본인 부담분

```ts
employeeHealth(year) = monthlyWage * HIRI_RATES[year].employeeShareRate
employeeLtc(year) = employeeHealth(year) * HIRI_RATES[year].longTermCareRateOnHealthPremium
employeeTotal(year) = employeeHealth(year) + employeeLtc(year)
employeeIncreaseMonthly = employeeTotal(2026) - employeeTotal(2025)
employeeIncreaseAnnual = employeeIncreaseMonthly * 12
```

### 7-3. 회사 부담분

```ts
employerHealth(year) = monthlyWage * HIRI_RATES[year].employerShareRate
employerLtc(year) = employerHealth(year) * HIRI_RATES[year].longTermCareRateOnHealthPremium
employerTotal(year) = employerHealth(year) + employerLtc(year)
employerIncreaseMonthly = employerTotal(2026) - employerTotal(2025)
```

### 7-4. 총 납부분

```ts
combinedTotal(year) = employeeTotal(year) + employerTotal(year)
combinedIncreaseMonthly = combinedTotal(2026) - combinedTotal(2025)
combinedIncreaseAnnual = combinedIncreaseMonthly * 12
```

### 7-5. 소득 대비 실효 부담률

```ts
employeeEffectiveRate(year) = employeeTotal(year) / monthlyWage
combinedEffectiveRate(year) = combinedTotal(year) / monthlyWage
```

UI에서는 `2025년 대비 +X원`, `월급 대비 +0.0%p`처럼 표시한다. 건강보험료율 자체는 전체 요율이 0.1%p 올랐지만, 근로자 본인 부담률은 0.05%p 오른다는 점을 FAQ와 데이터 카드에서 분리한다.

### 7-6. 지역가입자 보조 카드

신규 페이지는 지역가입자 정밀 계산을 하지 않는다. 대신 점수당 금액 변화만 공식 기준으로 보여준다.

```ts
regionalPointUnitIncrease = 211.5 - 208.4 // 3.1원
regionalPointUnitIncreaseRate = regionalPointUnitIncrease / 208.4
```

문구:

> 지역가입자는 소득·재산·자동차·세대 조건이 함께 반영되므로 이 페이지에서는 점수당 금액 인상만 안내합니다. 실제 지역가입자 보험료는 건강보험료 계산기에서 입력값을 넣어 간이 추정하세요.

---

## 8. UX 설계

### 8-1. 페이지 구조

1. Hero
   - H1: `2026 건강보험료 인상액 계산기`
   - 설명: `월급을 입력하면 2025년보다 건강보험료와 장기요양보험료가 얼마나 더 빠지는지 계산합니다.`
   - 히어로 스탯:
     - `2026 건강보험료율 7.19%`
     - `직장가입자 본인 3.595%`
     - `장기요양 13.14%`

2. 공식 기준 안내 `InfoNotice`
   - 2026 건강보험료율 7.19%
   - 2025 대비 0.1%p 인상
   - 장기요양보험료는 건강보험료에 연동

3. 입력 패널
   - 월급/연봉 탭
   - 월급 입력
   - 연봉 입력
   - 보기 옵션: `본인 부담만`, `본인+회사`, `총 납부분`
   - 빠른 입력 프리셋

4. 결과 패널
   - 메인 KPI: `내 월 부담 증가액`
   - 서브 KPI: `연간 증가액`, `2026 월 납부액`, `2025 월 납부액`
   - 건강보험료와 장기요양보험료 분해표
   - 회사 부담분 비교 카드
   - 월급 구간별 인상액 표

5. 추가 안내
   - 지역가입자 점수당 금액 변화
   - 정확한 고지액 확인 경로
   - 기존 건강보험료 계산기 CTA

6. SEO 콘텐츠
   - 5단락 이상 intro
   - FAQ 6개 이상
   - 공식 출처 링크
   - 관련 도구 링크

### 8-2. 입력 상세

| 항목 | UI | 기본값 | 검증 |
|---|---|---:|---|
| 입력 방식 | segmented control | 월급 | `monthlyWage`, `annualSalary` allowlist |
| 월 보수월액 | numeric text input | 3,000,000 | 0~30,000,000 |
| 세전 연봉 | numeric text input | 36,000,000 | 0~360,000,000 |
| 보기 옵션 | segmented control | 본인+회사 | allowlist |
| 빠른 입력 | button grid | 월급 300만 | 프리셋 ID allowlist |

### 8-3. 결과 카드 상세

| 카드 | 표시값 | 배지 |
|---|---|---|
| 내 월 부담 증가액 | `employeeIncreaseMonthly` | 계산 |
| 내 연 부담 증가액 | `employeeIncreaseAnnual` | 추정 |
| 2025 월 본인 부담 | `employeeTotal(2025)` | 공식 요율 기반 |
| 2026 월 본인 부담 | `employeeTotal(2026)` | 공식 요율 기반 |
| 건강보험료 증가분 | `employeeHealth(2026) - employeeHealth(2025)` | 계산 |
| 장기요양 증가분 | `employeeLtc(2026) - employeeLtc(2025)` | 계산 |
| 회사 월 부담 증가액 | `employerIncreaseMonthly` | 계산 |
| 노무비 총 증가액 | `combinedIncreaseMonthly` | 계산 |

### 8-4. 월급별 예시표

기본 제공 표:

| 월 보수월액 | 2025 본인 부담 | 2026 본인 부담 | 월 증가액 | 연 증가액 |
|---:|---:|---:|---:|---:|
| 250만 원 | 계산 | 계산 | 계산 | 계산 |
| 300만 원 | 계산 | 계산 | 계산 | 계산 |
| 400만 원 | 계산 | 계산 | 계산 | 계산 |
| 500만 원 | 계산 | 계산 | 계산 | 계산 |
| 700만 원 | 계산 | 계산 | 계산 | 계산 |

표는 실제 HTML `<table>`로 제공한다. 네이버 표 스니펫과 사용자의 빠른 비교에 유리하다.

---

## 9. 스크립트 설계

**`public/scripts/health-insurance-rate-increase-2026.js`**

### 9-1. 패턴

- IIFE 패턴
- `data-hiri-input`, `data-hiri-result`, `data-hiri-preset` 속성 기반 DOM 조작
- `textContent`만 사용
- URL state 유지
- 숫자 입력은 콤마 포맷, 내부 계산은 number

### 9-2. 주요 상태

```js
const state = {
  incomeMode: "monthlyWage",
  monthlyWage: 3000000,
  annualSalary: 36000000,
  viewMode: "employeeAndEmployer",
};
```

### 9-3. URL 파라미터

| 파라미터 | 의미 | 예시 |
|---|---|---|
| `mode` | 입력 방식 | `monthly`, `annual` |
| `wage` | 월 보수월액 | `3000000` |
| `salary` | 세전 연봉 | `36000000` |
| `view` | 보기 옵션 | `employee`, `both`, `total` |

허용 목록:

```js
const allowedModes = ["monthly", "annual"];
const allowedViews = ["employee", "both", "total"];
```

### 9-4. 복사 문구

`ToolActionBar`의 링크 복사 버튼은 현재 입력값을 URL에 반영한 뒤 복사한다.

공유 문구 예:

> 월급 300만 원 기준 2026년 건강보험료+장기요양보험료 본인 부담은 2025년보다 월 약 X원, 연 약 Y원 증가합니다.

---

## 10. Astro 페이지 설계

**`src/pages/tools/health-insurance-rate-increase-2026.astro`**

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
  HIRI_META,
  HIRI_RATES,
  HIRI_PRESETS,
  HIRI_FAQ,
  HIRI_SEO_CONTENT,
  HIRI_DEFAULT_INPUT,
  HIRI_SOURCES,
} from "../../data/healthInsuranceRateIncrease2026";
---
```

### 10-2. JSON-LD

```ts
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "2026 건강보험료 인상액 계산기",
  applicationCategory: "FinanceApplication",
  operatingSystem: "All",
  inLanguage: "ko-KR",
  isAccessibleForFree: true,
  url: `${siteUrl}/tools/health-insurance-rate-increase-2026/`,
  description: HIRI_META.seoDescription,
  provider: { "@type": "Organization", name: "비교계산소" },
  mainEntity: { "@type": "FAQPage", mainEntity: faqSchema }
}
```

### 10-3. 주요 마크업

- `SimpleToolShell calculatorId="health-insurance-rate-increase-2026" pageClass="hiri-page"`
- `InfoNotice`에는 공식 기준 3줄
- 입력 패널은 `slot="aside"`
- 결과 패널은 `slot="main"` 또는 SimpleToolShell 기본 구조에 맞춰 배치
- SEO 콘텐츠는 `<Fragment slot="seo">` 안에 배치

---

## 11. SCSS 설계

**`src/styles/scss/pages/_health-insurance-rate-increase-2026.scss`**

### 11-1. prefix

모든 클래스는 `hiri-` prefix를 사용한다.

예:

```scss
.hiri-page {}
.hiri-mode-tabs {}
.hiri-preset-grid {}
.hiri-result-kpi {}
.hiri-delta {}
.hiri-breakdown-table {}
.hiri-rate-card {}
```

### 11-2. 디자인 방향

- 계산기 표면은 기존 `health-insurance-premium-calculator`와 시각적으로 가까워야 한다.
- 다만 "인상액" 페이지이므로 결과 KPI에 상승/차이 표현을 명확히 둔다.
- 빨간색을 과도하게 쓰지 않는다. 인상액은 경고가 아니라 고정비 변화 안내이므로 `accent`, `warning`, `neutral` 톤을 균형 있게 사용한다.
- 모바일에서는 결과 KPI 1열, 상세 표는 가로 스크롤이 아닌 축약형 카드 또는 반응형 표로 처리한다.

### 11-3. 반응형 기준

| 구간 | 처리 |
|---|---|
| 320~479px | KPI 1열, 프리셋 2열, 표는 카드형 전환 |
| 480~767px | KPI 2열, 입력 필드 1열 |
| 768px 이상 | 입력/결과 2컬럼, 상세표 정상 |

---

## 12. SEO 콘텐츠 설계

### 12-1. `HIRI_SEO_CONTENT`

```ts
export const HIRI_SEO_CONTENT = {
  introTitle: "2026년 건강보험료 인상, 월급 기준으로 다시 봐야 합니다",
  intro: [
    "2026년 건강보험료율은 7.19%로 결정되었습니다. 2025년 7.09%와 비교하면 전체 보험료율은 0.1%p 올랐고, 직장가입자 본인 부담률은 3.545%에서 3.595%로 바뀝니다. 숫자만 보면 작아 보이지만 건강보험료는 매달 빠지는 고정 공제 항목이기 때문에 월급과 연봉 기준으로 보면 체감 차이가 생깁니다.",
    "직장가입자는 건강보험료를 회사와 절반씩 부담합니다. 그래서 월급명세서에서 직접 빠지는 금액은 전체 건강보험료율 7.19%가 아니라 본인 부담률 3.595%를 기준으로 계산됩니다. 다만 회사도 같은 금액을 부담하므로, 인건비 전체 관점에서는 근로자 부담분과 회사 부담분을 함께 보는 것이 좋습니다.",
    "장기요양보험료도 같이 확인해야 합니다. 장기요양보험료는 건강보험료에 연동되어 부과되므로 건강보험료가 오르면 장기요양보험료도 함께 바뀝니다. 이 계산기는 건강보험료 증가분과 장기요양보험료 증가분을 나누어 보여주고, 두 금액을 합친 실제 월 부담 증가액도 함께 표시합니다.",
    "연봉을 입력하는 경우에는 연봉을 12개월로 나눈 보수월액을 기준으로 간이 계산합니다. 실제 급여명세서의 건강보험료는 비과세 수당, 보수월액 신고, 정산 방식, 보수 외 소득 여부에 따라 달라질 수 있습니다. 따라서 이 페이지의 결과는 공식 요율을 적용한 자가 점검용 계산값으로 읽는 것이 안전합니다.",
    "지역가입자는 소득뿐 아니라 재산, 전월세, 자동차, 세대 조건이 함께 반영됩니다. 이 페이지에서는 2025년과 2026년의 점수당 금액 변화만 안내하고, 지역가입자 실제 고지액 추정은 별도 건강보험료 계산기로 연결합니다. 퇴직 예정자나 프리랜서 전환 예정자는 지역가입자 전환 부담까지 함께 확인하는 것이 좋습니다.",
  ],
  inputPoints: [
    "월 보수월액을 입력하면 2025년과 2026년의 직장가입자 본인 부담액을 비교합니다.",
    "연봉 입력 시 12개월로 나눈 추정 보수월액을 사용하므로 실제 신고 보수월액과 차이가 날 수 있습니다.",
    "회사 부담분 보기 옵션을 켜면 사용자 부담분과 전체 납부분 증가액도 함께 확인할 수 있습니다.",
  ],
  criteria: [
    "2026년 건강보험료율은 7.19%, 직장가입자 본인 부담률은 3.595%입니다.",
    "2025년 건강보험료율은 7.09%, 직장가입자 본인 부담률은 3.545%입니다.",
    "2026년 장기요양보험료율은 소득 대비 0.9448%, 건강보험료 대비 환산 약 13.14%입니다.",
    "이 계산기는 공식 요율을 적용한 참고 계산이며 실제 급여명세서와 다를 수 있습니다.",
  ],
};
```

### 12-2. FAQ

최소 7개 제공.

```ts
export const HIRI_FAQ: HiriFaqItem[] = [
  {
    question: "2026년 건강보험료율은 얼마인가요?",
    answer: "2026년 건강보험료율은 보건복지부 발표 기준 7.19%입니다. 2025년 7.09%보다 0.1%p 올랐습니다.",
  },
  {
    question: "직장가입자는 7.19%를 전부 본인이 내나요?",
    answer: "아니요. 직장가입자는 근로자와 사용자가 절반씩 부담합니다. 2026년 근로자 본인 부담률은 보수월액의 3.595%입니다.",
  },
  {
    question: "장기요양보험료도 같이 오르나요?",
    answer: "장기요양보험료는 건강보험료에 연동되어 계산됩니다. 따라서 건강보험료가 바뀌면 월급에서 빠지는 장기요양보험료도 함께 달라질 수 있습니다.",
  },
  {
    question: "연봉을 입력하면 실제 급여명세서와 정확히 맞나요?",
    answer: "연봉 입력은 연봉을 12개월로 나눈 보수월액 추정입니다. 실제 보험료는 비과세 수당, 보수월액 신고, 정산 방식에 따라 달라질 수 있습니다.",
  },
  {
    question: "월급 300만 원이면 얼마나 더 내나요?",
    answer: "이 계산기에 월 보수월액 300만 원을 입력하면 2025년 대비 2026년 본인 부담 증가액을 건강보험료와 장기요양보험료로 나누어 확인할 수 있습니다.",
  },
  {
    question: "지역가입자도 이 계산기를 써도 되나요?",
    answer: "지역가입자는 소득·재산·자동차·세대 조건이 함께 반영되어 구조가 더 복잡합니다. 이 페이지는 점수당 금액 변화만 안내하고, 실제 지역가입자 추정은 건강보험료 계산기를 이용하는 것이 좋습니다.",
  },
  {
    question: "회사 부담분은 왜 보여주나요?",
    answer: "직장가입자 보험료는 근로자와 회사가 절반씩 부담합니다. 월급명세서에는 본인 부담분만 보이지만, 총 인건비 관점에서는 회사 부담분까지 함께 보는 것이 도움이 됩니다.",
  },
];
```

---

## 13. 내부 링크 전략

### 13-1. 인바운드

| 출발 페이지 | 연결 방식 |
|---|---|
| `/tools/health-insurance-premium-calculator/` | 결과 하단 또는 related에 "2026 인상액만 따로 보기" CTA 추가 |
| `/tools/four-insurance-calculator/` | 건강보험 상세 섹션에서 "2025 대비 인상액 확인" CTA |
| `/tools/salary/` | 연봉 인상 결과 하단에 "건강보험료 인상분 따로 보기" CTA |
| `/reports/employee-tax-insurance-rates-2026/` | 4대보험 요율표 리포트에서 계산기 카드 추가 |

### 13-2. 아웃바운드

```ts
export const HIRI_RELATED_LINKS: HiriRelatedLink[] = [
  {
    href: "/tools/health-insurance-premium-calculator/",
    label: "건강보험료 계산기 2026",
    description: "직장·지역·퇴직 전환까지 전체 보험료를 계산합니다.",
  },
  {
    href: "/tools/four-insurance-calculator/",
    label: "4대보험 계산기 2026",
    description: "국민연금·건강보험·고용보험까지 월급 공제액을 함께 계산합니다.",
  },
  {
    href: "/tools/salary/",
    label: "연봉 인상 계산기",
    description: "연봉 변화에 따른 세전·세후 월급 차이를 확인합니다.",
  },
  {
    href: "/reports/employee-tax-insurance-rates-2026/",
    label: "2026 직장인 세금·4대보험 요율표",
    description: "급여명세서에서 빠지는 공제 항목을 표로 정리합니다.",
  },
];
```

---

## 14. 도구 등록 메타

**`src/data/tools.ts`**

기존 건강보험료 계산기 근처에 배치한다.

```ts
{
  slug: "health-insurance-rate-increase-2026",
  title: "2026 건강보험료 인상액 계산기",
  description:
    "월급·연봉을 입력하면 2025년 대비 2026년 건강보험료와 장기요양보험료가 월·연 단위로 얼마나 오르는지 계산합니다.",
  order: 0, // health-insurance-premium-calculator 근처 값으로 조정
  eyebrow: "건보료 인상",
  category: "calculator",
  iframeReady: false,
  badges: ["신규", "2026", "건강보험"],
  previewStats: [
    { label: "건강보험료율", value: "7.19%", context: "2026년 공식" },
    { label: "전년 대비", value: "+0.1%p", context: "전체 보험료율" },
  ],
}
```

**주의:** `src/pages/tools/index.astro`의 `topicBySlug`에는 `"연봉·이직"` 또는 `"보험·의료비"` 중 하나로 등록한다. 기존 `health-insurance-premium-calculator`는 현재 `"연봉·이직"`에 묶여 있으므로 신규 페이지도 일단 `"연봉·이직"`에 두는 것이 목록 UX 일관성이 좋다. 향후 `생활비·고정비` 카테고리를 신설하면 두 페이지를 함께 이동한다.

---

## 15. 사이트맵 및 OG

### 15-1. sitemap

```xml
<url>
  <loc>https://bigyocalc.com/tools/health-insurance-rate-increase-2026/</loc>
  <lastmod>2026-07-20</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

### 15-2. OG 이미지

초기 구현은 `og-home.png`를 사용해도 되지만, 배포 전 품질 기준상 전용 OG 생성을 권장한다.

권장 문구:

- Eyebrow: `2026 건강보험`
- Title: `건강보험료 얼마나 오르나`
- Stats:
  - `요율 7.19%`
  - `전년 +0.1%p`
  - `월급별 인상액`

---

## 16. 품질 및 QA 체크리스트

### 16-1. 계산 검증

- [ ] 월급 3,000,000원 기준 2025/2026 건강보험료 본인 부담이 `월급 × 3.545%`, `월급 × 3.595%`로 계산되는지 확인
- [ ] 장기요양보험료가 각 연도 건강보험료에 해당 연도 환산율을 곱해 계산되는지 확인
- [ ] 연봉 입력 시 12개월 환산값과 월급 입력값이 같은 경우 결과가 동일한지 확인
- [ ] 회사 부담분은 본인 부담분과 동일하게 계산되는지 확인
- [ ] 월/연 증가액 환산이 정확한지 확인
- [ ] 지역가입자 보조 카드는 점수당 금액 변화만 표시하고 고지액처럼 오인되지 않는지 확인

### 16-2. UX 검증

- [ ] 320px 모바일에서 입력 필드와 KPI 카드가 넘치지 않음
- [ ] 프리셋 클릭 시 입력값과 결과가 즉시 갱신됨
- [ ] 월급/연봉 탭 전환 시 숨김 필드와 URL state가 올바르게 반영됨
- [ ] 복사 링크가 현재 입력값을 보존함
- [ ] 표가 모바일에서 깨지지 않음

### 16-3. SEO 검증

- [ ] H1에 `2026 건강보험료 인상액 계산기` 포함
- [ ] title 60자 이내
- [ ] meta description 120~160자 안팎
- [ ] FAQ 6개 이상
- [ ] intro 5단락 이상, 800자 이상
- [ ] 공식 출처 링크 3개 이상
- [ ] `FAQPage` JSON-LD 포함
- [ ] sitemap 등록

### 16-4. 보안 검증

- [ ] 사용자 입력값을 `innerHTML`에 삽입하지 않음
- [ ] URL 파라미터는 숫자 범위와 allowlist 검증
- [ ] 외부 링크는 `target="_blank"` 사용 시 `rel="noopener noreferrer"` 포함
- [ ] 개인정보 입력 없음, 서버 전송 없음

---

## 17. 구현 순서

1. `src/data/healthInsuranceRateIncrease2026.ts` 작성
2. `src/pages/tools/health-insurance-rate-increase-2026.astro` 작성
3. `public/scripts/health-insurance-rate-increase-2026.js` 작성
4. `src/styles/scss/pages/_health-insurance-rate-increase-2026.scss` 작성
5. `src/data/tools.ts` 등록
6. `src/pages/tools/index.astro` topic 등록
7. `src/styles/app.scss` import 추가
8. `public/sitemap.xml` 등록
9. 기존 건강보험료/4대보험/연봉 계산기 related 링크 보강
10. `npm run build` 검증

---

## 18. 리스크 및 보완

| 리스크 | 설명 | 보완 |
|---|---|---|
| 기존 건강보험료 계산기와 중복 | 같은 요율을 다룸 | 제목·H1·결과를 "인상액" 중심으로 고정 |
| 연봉 입력 결과 오해 | 실제 보수월액은 연봉/12와 다를 수 있음 | `추정` 배지와 FAQ에 반복 안내 |
| 장기요양 환산율 혼동 | 0.9448%와 13.14%가 동시에 등장 | "소득 대비"와 "건보료 대비"를 표에서 구분 |
| 지역가입자 정확도 문제 | 지역가입자는 산식이 복잡함 | 이 페이지에서는 점수당 금액 변화만 안내하고 기존 계산기로 연결 |
| 사용자가 인상액을 너무 작게 느낄 수 있음 | 월 증가액은 작아 보일 수 있음 | 월/연/회사 부담/총 납부분을 함께 제공 |

---

## 19. 최종 판정

이 페이지는 기존 건강보험료 계산기의 단순 복제가 아니라, 2026년 요율 인상 이슈에 맞춘 **검색 진입용·즉답형 컴패니언 계산기**다. 공식 요율 기반이라 데이터 신뢰성이 높고, 월급 입력 하나만으로 결과가 나오기 때문에 모바일 검색 유입에 적합하다. 구현 시에는 지역가입자·퇴직 전환 복잡도를 욕심내지 않고, 전년 대비 직장가입자 인상액을 선명하게 보여주는 방향을 유지한다.
