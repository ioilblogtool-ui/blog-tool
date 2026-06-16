# 항공사 5사 성과급 비교 계산기 — 설계 문서

> 기획 원문: `docs/plan/202606/airline-bonus-comparison-2026-plan.md`
> 작성일: 2026-06-16
> 구현 기준: Claude/Codex가 이 문서만 보고 `/tools/airline-bonus-comparison/` 페이지를 구현할 수 있는 수준
> 참고 페이지: `telecom-bonus-comparison` (동일 패턴 — SimpleToolShell + aside 회사 패널 + KPI/표/차트)
> 추가 기능: 직군 선택(조종사/객실승무원/일반직) → 연봉 힌트 문구 변경

---

## 1. 문서 개요

### 1-1. 대상

- 구현 대상: `항공사 5사 성과급 비교 계산기 2026`
- 콘텐츠 유형: 계산기 (tool)
- slug: `airline-bonus-comparison`
- URL: `/tools/airline-bonus-comparison/`

### 1-2. telecom과의 차이점

| 항목 | telecom | airline |
|------|---------|---------|
| 회사 수 | 3사 | 5사 |
| 추가 입력 | 없음 | **직군 선택** (조종사/객실승무원/일반직) |
| 직군 효과 | - | 연봉 힌트 문구만 변경 (지급률은 동일 적용) |
| 특이 섹션 | 기업 현황 표 | 직군별 보상 설명 카드 + 기업 현황 표 |
| prefix | `tbc-` | `alb-` |

### 1-3. 권장 파일 구조

```txt
src/
  data/
    airlineBonusComparison2026.ts
  pages/
    tools/
      airline-bonus-comparison.astro

public/
  scripts/
    airline-bonus-comparison.js

src/styles/scss/pages/
  _airline-bonus-comparison.scss
```

필수 등록: `src/data/tools.ts`, `src/styles/app.scss`, `public/sitemap.xml`, `src/pages/index.astro`(`topicBySlug`)

---

## 2. SEO 설계

### 2-1. 메타

```ts
title: "항공사 5사 성과급 비교 계산기 2026 (대한항공·아시아나·제주항공·티웨이·진에어)"
description: "대한항공, 아시아나항공, 제주항공, 티웨이항공, 진에어의 성과급을 같은 연봉 기준으로 비교해보세요. 직군(조종사·객실승무원·일반직) 선택 후 회사별 지급률을 조정해 세전·세후 예상액을 확인할 수 있습니다."
ogImage: "/og/tools/airline-bonus-comparison.png"
```

### 2-2. 키워드 매핑

| 키워드 | 반영 위치 |
|--------|-----------|
| 대한항공 성과급 | title, H1, FAQ, 해설 카드 |
| 아시아나 성과급 | title, H1, FAQ, 해설 카드 |
| 제주항공 성과급 | title, H1, FAQ, 해설 카드 |
| 티웨이 성과급 | title, H1, FAQ, 해설 카드 |
| 진에어 성과급 | title, H1, FAQ, 해설 카드 |
| 항공사 성과급 비교 | description, SeoContent |
| LCC 성과급 | SeoContent, FAQ |

---

## 3. 데이터 스키마

### 3-1. `src/data/airlineBonusComparison2026.ts`

```ts
export type AirlineCompanyId = "koreanair" | "asianaair" | "jejuair" | "twayair" | "jinair";
export type AirlineJobType = "pilot" | "cabinCrew" | "ground";
export type BonusInputMode = "salaryPercent" | "monthlyMultiple" | "fixedAmount";
export type TaxMode = "simple" | "manual";
export type EvidenceBadge = "추정" | "시뮬레이션" | "사용자 입력 기준";

export interface AirlineCompanyConfig {
  id: AirlineCompanyId;
  name: string;
  shortName: string;
  defaultMode: BonusInputMode;
  defaultSalaryPercent: number;
  defaultMonthlyMultiple: number;
  defaultFixedAmount: number;
  structureSummary: string;
  caution: string;
  badges: EvidenceBadge[];
}

export const AIRLINE_COMPANIES: AirlineCompanyConfig[] = [
  {
    id: "koreanair", name: "대한항공", shortName: "대한항공",
    defaultMode: "salaryPercent", defaultSalaryPercent: 10, defaultMonthlyMultiple: 1.0, defaultFixedAmount: 0,
    structureSummary: "그룹 실적과 평가 기준에 따른 격려금·성과급 구조로 알려져 있습니다.",
    caution: "직군(운항/객실/일반직), 직급, 아시아나항공 통합 진행 상황에 따라 달라질 수 있습니다.",
    badges: ["추정", "시뮬레이션"],
  },
  {
    id: "asianaair", name: "아시아나항공", shortName: "아시아나",
    defaultMode: "salaryPercent", defaultSalaryPercent: 8, defaultMonthlyMultiple: 0.8, defaultFixedAmount: 0,
    structureSummary: "실적 회복 추세에 따른 성과급 지급 가능성이 있는 것으로 알려져 있습니다.",
    caution: "대한항공과의 통합 진행 상황에 따라 보상 체계가 변경될 수 있습니다.",
    badges: ["추정", "시뮬레이션"],
  },
  {
    id: "jejuair", name: "제주항공", shortName: "제주항공",
    defaultMode: "salaryPercent", defaultSalaryPercent: 5, defaultMonthlyMultiple: 0.5, defaultFixedAmount: 0,
    structureSummary: "국내 LCC 1위 사업자로 실적에 따라 성과급 지급 규모가 변동하는 구조로 알려져 있습니다.",
    caution: "연도별 실적 변동에 따라 성과급 지급 여부와 규모가 달라질 수 있습니다.",
    badges: ["추정", "시뮬레이션"],
  },
  {
    id: "twayair", name: "티웨이항공", shortName: "티웨이",
    defaultMode: "salaryPercent", defaultSalaryPercent: 4, defaultMonthlyMultiple: 0.4, defaultFixedAmount: 0,
    structureSummary: "LCC 2위권으로 성과급 관련 공개 정보가 제한적이며 실적에 따라 변동합니다.",
    caution: "성과급 관련 공식 공개 정보가 적어 추정 불확실성이 높습니다.",
    badges: ["추정", "시뮬레이션"],
  },
  {
    id: "jinair", name: "진에어", shortName: "진에어",
    defaultMode: "salaryPercent", defaultSalaryPercent: 5, defaultMonthlyMultiple: 0.5, defaultFixedAmount: 0,
    structureSummary: "한진그룹 계열 LCC로 대한항공 실적과 연동된 구조를 가진 것으로 알려져 있습니다.",
    caution: "그룹 공통 기준 및 LCC 사업 실적에 따라 달라질 수 있습니다.",
    badges: ["추정", "시뮬레이션"],
  },
];

export interface AirlineJobTypeConfig {
  id: AirlineJobType;
  label: string;
  salaryRangeNote: string;
  avgSalaryHint: string;
}

export const AIRLINE_JOB_TYPES: AirlineJobTypeConfig[] = [
  {
    id: "pilot", label: "조종사",
    salaryRangeNote: "직급·기종·항공사에 따라 차이가 매우 큽니다.",
    avgSalaryHint: "기장 기준 약 1억 5,000만~3억 원 이상 (직급·기종·항공사별 추정)",
  },
  {
    id: "cabinCrew", label: "객실승무원",
    salaryRangeNote: "연차·직급에 따라 차이가 있습니다.",
    avgSalaryHint: "약 4,000만~8,000만 원 (연차·직급별 추정)",
  },
  {
    id: "ground", label: "일반직(지상직)",
    salaryRangeNote: "사무직 평균 수준으로 참고하세요.",
    avgSalaryHint: "약 5,000만~1억 원 (직급별 추정)",
  },
];

export interface AirlineCompanyProfile {
  id: AirlineCompanyId;
  averageSalary: string;
  employeeCount: string;
  revenue: string;
  recentBonus: string;
}

export const AIRLINE_COMPANY_PROFILES: AirlineCompanyProfile[] = [
  { id: "koreanair", averageSalary: "약 1억 원",       employeeCount: "약 19,000명", revenue: "약 16조 원 (2024)",          recentBonus: "비공개" },
  { id: "asianaair", averageSalary: "약 8,000만 원",   employeeCount: "약 9,000명",  revenue: "약 7조 원 (2024)",            recentBonus: "비공개" },
  { id: "jejuair",   averageSalary: "약 6,000만 원",   employeeCount: "약 4,000명",  revenue: "약 1조 7,000억 원 (2024)",    recentBonus: "비공개" },
  { id: "twayair",   averageSalary: "약 5,500만 원",   employeeCount: "약 3,000명",  revenue: "약 1조 원 (2024)",            recentBonus: "비공개" },
  { id: "jinair",    averageSalary: "약 5,500만 원",   employeeCount: "약 2,800명",  revenue: "약 9,000억 원 (2024)",        recentBonus: "비공개" },
];

export const AIRLINE_PROFILE_NOTE =
  "평균연봉·직원수는 사업보고서 및 업계 추정 기반 참고 정보입니다. 매출은 2024년 연간 기준 추정값이며, 성과급은 각 사가 공식 공개한 경우에만 표기하고 비공개 항목은 '비공개'로 표시했습니다.";

export const AIRLINE_SIMPLE_TAX_RATE = 0.22;

export interface FaqItem { question: string; answer: string; }
export const AIRLINE_BONUS_FAQ: FaqItem[] = [
  {
    question: "대한항공과 아시아나항공 통합 이후 성과급 구조는 어떻게 바뀌나요?",
    answer: "대한항공·아시아나 통합은 현재 진행 중이며, 통합 이후 보상 체계는 아직 확정되지 않았습니다. 이 계산기의 아시아나항공 기본값은 통합 이전 구조를 기준으로 한 추정 시뮬레이션입니다.",
  },
  {
    question: "조종사 성과급은 일반직과 어떻게 다른가요?",
    answer: "조종사는 기본급 외에 비행수당·노선수당 등 변동 보상이 별도로 지급되는 경우가 많아, 현금 성과급만으로 비교하면 실질 보상을 과소평가할 수 있습니다. 이 계산기는 현금 성과급 시뮬레이션만 제공합니다.",
  },
  {
    question: "이 계산기의 기본 성과급률은 공식 수치인가요?",
    answer: "아니요. 보도·업계 추정 기반 시뮬레이션 기본값이며, 각 회사의 공식 지급률이 아닙니다. 알고 계신 수치가 있다면 직접 입력 모드로 조정해 사용하세요.",
  },
  {
    question: "LCC(저비용항공사) 성과급은 대형 항공사와 얼마나 차이가 나나요?",
    answer: "일반적으로 대형 항공사(FSC)가 LCC보다 성과급 규모가 크고 안정적인 것으로 알려져 있습니다. 다만 실적 호조 시 LCC도 성과급을 지급하는 사례가 있으며, 회사별·연도별 편차가 큽니다.",
  },
  {
    question: "진에어는 대한항공 계열이라 성과급도 같은가요?",
    answer: "진에어는 한진그룹 계열 LCC로 대한항공 실적과 연동된 부분이 있지만, 독립 법인으로서 별도 보상 체계를 운영합니다. 대한항공과 동일한 수준의 성과급을 보장하지 않습니다.",
  },
  {
    question: "객실승무원 성과급은 어떤 방식으로 산정되나요?",
    answer: "객실승무원 성과급은 회사 실적, 개인 평가, 직급에 따라 결정되는 것으로 알려져 있습니다. 이 계산기는 정확한 산정 기준을 알 수 없어 사용자 입력 기준 시뮬레이션으로만 제공합니다.",
  },
  {
    question: "세후 금액은 어떻게 계산되나요?",
    answer: "성과급은 근로소득으로 합산 과세됩니다. 이 계산기의 세후 값은 간편 공제율(22%) 또는 직접 입력한 세율을 적용한 참고값이며, 정확한 세후 금액은 성과급 세후 실수령액 계산기를 이용하세요.",
  },
];

export interface RelatedLink { href: string; label: string; description: string; }
export const AIRLINE_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/shipbuilding-bonus-comparison/", label: "조선사 성과급 비교", description: "HD현대·삼성중공업·한화오션 비교" },
  { href: "/tools/semiconductor-bonus-comparison/", label: "반도체 성과급 비교", description: "삼성전자·SK하이닉스 등 비교" },
  { href: "/tools/bonus-after-tax-calculator/", label: "성과급 세후 실수령액 계산기", description: "성과급 세금을 정확히 계산" },
  { href: "/reports/corporate-bonus-comparison-2026/", label: "2026 대기업 성과급 비교 리포트", description: "주요 대기업 성과급 발표 동향" },
  { href: "/tools/bonus-simulator/", label: "대기업 성과급 시뮬레이터", description: "여러 대기업 성과급 한 번에 비교" },
];
```

### 3-2. 계산 로직

`telecom-bonus-comparison`과 동일:

```
연간 성과급(세전) = 기준액 × 입력값
  - salaryPercent: 연봉 × 지급률(%) / 100
  - monthlyMultiple: 월급(연봉÷12) × 배수
  - fixedAmount: 사용자 입력 금액

연간 성과급(세후) = 세전 × (1 - 세율)
월평균 환산 = 세전 / 12
총보상(세전) = 연봉 + 세전 성과급
```

직군 선택의 계산 영향: **없음** (힌트 문구만 변경)

---

## 4. 페이지 구조

### 4-1. 레이아웃 쉘

`SimpleToolShell.astro` — `resultFirst={false}`

### 4-2. 컴포넌트 import

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
  AIRLINE_COMPANIES,
  AIRLINE_JOB_TYPES,
  AIRLINE_BONUS_FAQ,
  AIRLINE_RELATED_LINKS,
  AIRLINE_COMPANY_PROFILES,
  AIRLINE_PROFILE_NOTE,
} from "../../data/airlineBonusComparison2026";

const config = {
  companies: AIRLINE_COMPANIES,
  jobTypes: AIRLINE_JOB_TYPES,
};

const faqSchema = AIRLINE_BONUS_FAQ.map((item) => ({
  "@type": "Question",
  name: item.question,
  acceptedAnswer: { "@type": "Answer", text: item.answer },
}));
---
```

### 4-3. 레이아웃 순서

```txt
BaseLayout
  SiteHeader
  SimpleToolShell (calculatorId="airline-bonus-comparison" pageClass="alb-page" resultFirst={false})
    slot:hero → CalculatorHero + 배지 + InfoNotice
    slot:actions → ToolActionBar
    slot:aside → 입력 패널 (직군 선택 + 연봉/월급 + 세율 + 5사 패널)
    [A] KPI 핵심 비교 카드
    [B] 5사 비교 결과 표
    [C] 5사 비교 바 차트
    [D] 직군별 보상 구조 설명 카드
    [E] 기업 현황 참고 표
    [F] 관련 계산기 그리드
    slot:seo → SeoContent
```

---

## 5. 입력 패널 설계 (`slot:aside`)

```astro
<section class="alb-calculator" data-alb-calculator>
  <!-- 공통 입력 -->
  <article class="panel alb-input-panel">
    <div class="panel-heading">
      <div>
        <p class="panel-heading__eyebrow">기준 입력</p>
        <h2 class="panel__title">같은 조건으로 맞추기</h2>
      </div>
      <p class="panel-heading__summary">직군을 선택하고 연봉을 입력한 뒤 회사별 성과급 방식을 조정하세요.</p>
    </div>
    <div class="form-grid">
      <!-- 직군 선택 (telecom에 없는 추가 입력) -->
      <label class="field" for="albJobType">
        <span>직군 선택</span>
        <select id="albJobType" data-alb-job-type>
          {AIRLINE_JOB_TYPES.map((job) => (
            <option value={job.id}>{job.label}</option>
          ))}
        </select>
        <small data-alb-job-hint>직군별 평균 연봉을 참고해 기준 연봉을 입력하세요.</small>
      </label>
      <label class="field" for="albAnnualSalary">
        <span>기준 연봉</span>
        <input id="albAnnualSalary" data-alb-annual-salary type="text" inputmode="numeric" value="70,000,000" />
        <small>성과급 포함 전 연봉 기준입니다.</small>
      </label>
      <label class="field" for="albMonthlySalary">
        <span>월 기본급</span>
        <input id="albMonthlySalary" data-alb-monthly-salary type="text" inputmode="numeric" value="5,833,333" />
        <small data-alb-monthly-hint>연봉을 바꾸면 자동 갱신됩니다.</small>
      </label>
      <button class="button button--secondary" type="button" data-alb-reset-monthly>
        연봉 기준으로 다시 계산
      </button>
      <label class="field" for="albTaxMode">
        <span>세후 계산 방식</span>
        <select id="albTaxMode" data-alb-tax-mode>
          <option value="simple" selected>간편 추정 (22%)</option>
          <option value="manual">직접 세율 입력</option>
        </select>
      </label>
      <label class="field" for="albManualTaxRate">
        <span>직접 공제율 (%)</span>
        <input id="albManualTaxRate" data-alb-manual-tax-rate type="number" min="0" max="60" step="0.1" value="22" />
        <small>직접 세율 입력 모드에서 사용합니다.</small>
      </label>
    </div>
  </article>

  <!-- 5사별 성과급 입력 -->
  <article class="panel alb-company-inputs">
    <div class="panel-heading">
      <div>
        <p class="panel-heading__eyebrow">회사별 가정</p>
        <h2 class="panel__title">성과급 방식 입력</h2>
      </div>
      <p class="panel-heading__summary">기본값은 추정 시뮬레이션 값입니다. 알고 있는 지급 기준으로 직접 수정하세요.</p>
    </div>
    <div class="alb-company-panel-list">
      {AIRLINE_COMPANIES.map((company) => (
        <section class="alb-company-panel" data-alb-company-panel={company.id}>
          <div class="alb-company-panel__head">
            <div>
              <strong>{company.name}</strong>
              <span>{company.structureSummary}</span>
            </div>
            <div class="alb-company-panel__badges">
              {company.badges.map((badge) => <span>{badge}</span>)}
            </div>
          </div>
          <div class="alb-company-panel__inputs">
            <label class="field" for={`albMode-${company.id}`}>
              <span>성과급 방식</span>
              <select id={`albMode-${company.id}`} data-alb-mode={company.id}>
                <option value="salaryPercent" selected={company.defaultMode === "salaryPercent"}>연봉 대비 %</option>
                <option value="monthlyMultiple" selected={company.defaultMode === "monthlyMultiple"}>월급 n개월</option>
                <option value="fixedAmount" selected={company.defaultMode === "fixedAmount"}>고정 금액</option>
              </select>
            </label>
            <label class="field" for={`albPercent-${company.id}`} data-alb-field-group={company.id} data-alb-field-mode="salaryPercent">
              <span>성과급률 (%)</span>
              <input id={`albPercent-${company.id}`} data-alb-salary-percent={company.id} type="number" min="0" max="100" step="0.5" value={company.defaultSalaryPercent} />
            </label>
            <label class="field" for={`albMultiple-${company.id}`} data-alb-field-group={company.id} data-alb-field-mode="monthlyMultiple">
              <span>월급 개월 수</span>
              <input id={`albMultiple-${company.id}`} data-alb-monthly-multiple={company.id} type="number" min="0" max="12" step="0.1" value={company.defaultMonthlyMultiple} />
            </label>
            <label class="field" for={`albFixed-${company.id}`} data-alb-field-group={company.id} data-alb-field-mode="fixedAmount">
              <span>고정 성과급</span>
              <input id={`albFixed-${company.id}`} data-alb-fixed-amount={company.id} type="text" inputmode="numeric" value="0" />
            </label>
          </div>
          <p class="alb-company-panel__caution">{company.caution}</p>
        </section>
      ))}
    </div>
  </article>
</section>
```

---

## 6. 출력 섹션 설계

### [A] KPI 카드

```astro
<section class="alb-results">
  <div class="alb-section-head">
    <p class="alb-section-head__eyebrow">핵심 결과</p>
    <h2>항공사 5사 성과급 비교</h2>
    <p>입력값을 바꾸면 결과가 바로 갱신됩니다. 모든 금액은 사용자 입력 기준 시뮬레이션입니다.</p>
  </div>
  <div class="alb-kpi-grid">
    <article class="alb-kpi-card">
      <span>최고 예상 세후 성과급</span>
      <strong data-alb-best-net>-</strong>
      <small data-alb-best-net-company>-</small>
    </article>
    <article class="alb-kpi-card">
      <span>5사 간 최대 차이 (세전)</span>
      <strong data-alb-max-gap>-</strong>
      <small>5사 비교 기준</small>
    </article>
    <article class="alb-kpi-card">
      <span>월평균 차이</span>
      <strong data-alb-monthly-gap>-</strong>
      <small>12개월 환산</small>
    </article>
    <article class="alb-kpi-card">
      <span>성과급 포함 최고 총보상</span>
      <strong data-alb-best-total>-</strong>
      <small data-alb-best-total-company>-</small>
    </article>
  </div>
</section>
```

### [B] 비교 결과 표

```astro
<section class="alb-result-section">
  <div class="alb-section-head">
    <p class="alb-section-head__eyebrow">회사별 표</p>
    <h2>세전·세후·월평균 환산</h2>
  </div>
  <div class="alb-table-wrap">
    <table class="alb-result-table">
      <caption>항공사 5사 성과급 비교 결과 표</caption>
      <thead>
        <tr>
          <th>회사</th>
          <th>입력 기준</th>
          <th>세전 성과급</th>
          <th>예상 세후</th>
          <th>월평균 환산</th>
          <th>총보상 (세전)</th>
        </tr>
      </thead>
      <tbody data-alb-result-table></tbody>
    </table>
  </div>
  <p class="alb-footnote">예상 세후 금액은 간편 공제율(또는 직접 입력한 공제율)을 적용한 추정값입니다. 실제 통장 입금액은 지급월 급여, 부양가족, 비과세 항목, 4대보험, 연말정산 결과에 따라 달라질 수 있습니다.</p>
</section>
```

### [C] 비교 차트

```astro
<section class="alb-chart-section">
  <div class="alb-section-head">
    <p class="alb-section-head__eyebrow">시각화</p>
    <h2>5사 세전·세후 성과급 비교</h2>
  </div>
  <div class="alb-chart-wrap">
    <canvas id="albCompareChart" aria-label="항공사 5사 성과급 비교 차트" role="img"></canvas>
  </div>
</section>
```

### [D] 직군별 보상 구조 설명 카드

```astro
<section class="alb-job-section">
  <div class="alb-section-head">
    <p class="alb-section-head__eyebrow">직군별 안내</p>
    <h2>항공사 직군별 보상 구조</h2>
    <p>아래 내용은 업계 추정 기반 정성 안내입니다. 실제 보상은 회사·직급·평가에 따라 달라집니다.</p>
  </div>
  <div class="alb-job-grid">
    {AIRLINE_JOB_TYPES.map((job) => (
      <article class="alb-job-card">
        <strong>{job.label}</strong>
        <p>{job.avgSalaryHint}</p>
        <p class="alb-job-card__note">{job.salaryRangeNote}</p>
      </article>
    ))}
  </div>
</section>
```

### [E] 기업 현황 참고 표

```astro
<section class="alb-profile-section">
  <div class="alb-section-head">
    <p class="alb-section-head__eyebrow">기업 현황 (참고)</p>
    <h2>항공사 5사 평균연봉·규모 비교</h2>
    <p>업계 추정 및 공개 정보 기반 참고 자료입니다.</p>
  </div>
  <div class="alb-table-wrap">
    <table class="alb-result-table alb-profile-table">
      <caption>항공사 5사 기업 현황 비교 표</caption>
      <thead>
        <tr>
          <th>회사</th>
          <th>평균연봉 (추정)</th>
          <th>직원수 (추정)</th>
          <th>매출 (2024)</th>
          <th>최근 성과급</th>
        </tr>
      </thead>
      <tbody>
        {AIRLINE_COMPANIES.map((company) => {
          const profile = AIRLINE_COMPANY_PROFILES.find((p) => p.id === company.id);
          if (!profile) return null;
          return (
            <tr>
              <td class="cell-label"><strong>{company.name}</strong></td>
              <td>{profile.averageSalary}</td>
              <td>{profile.employeeCount}</td>
              <td>{profile.revenue}</td>
              <td>{profile.recentBonus}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
  <p class="alb-footnote">{AIRLINE_PROFILE_NOTE}</p>
</section>
```

### [F] 관련 계산기 그리드

```astro
<section class="alb-related">
  <div class="alb-section-head">
    <p class="alb-section-head__eyebrow">다음 단계</p>
    <h2>함께 보면 좋은 계산기</h2>
  </div>
  <div class="alb-related-grid">
    {AIRLINE_RELATED_LINKS.map((link) => (
      <a class="alb-related-card" href={withBase(link.href)}>
        <strong>{link.label}</strong>
        <span>{link.description}</span>
      </a>
    ))}
  </div>
</section>
```

---

## 7. 인터랙션 설계

### 7-1. 상태 관리

```js
const state = {
  jobType: "ground",           // 직군 (힌트 문구 변경에만 사용)
  annualSalary: 70_000_000,
  monthlySalary: Math.round(70_000_000 / 12),
  monthlySalaryTouched: false,
  taxMode: "simple",
  manualTaxRate: 0.22,
  companies: {
    koreanair: { mode: "salaryPercent", salaryPercent: 10, monthlyMultiple: 1.0, fixedAmount: 0 },
    asianaair: { mode: "salaryPercent", salaryPercent:  8, monthlyMultiple: 0.8, fixedAmount: 0 },
    jejuair:   { mode: "salaryPercent", salaryPercent:  5, monthlyMultiple: 0.5, fixedAmount: 0 },
    twayair:   { mode: "salaryPercent", salaryPercent:  4, monthlyMultiple: 0.4, fixedAmount: 0 },
    jinair:    { mode: "salaryPercent", salaryPercent:  5, monthlyMultiple: 0.5, fixedAmount: 0 },
  },
};
```

### 7-2. 직군 선택 이벤트 (telecom에 없는 추가 로직)

```js
els.jobType?.addEventListener("change", (event) => {
  state.jobType = event.target.value;
  const found = jobTypes.find((j) => j.id === state.jobType);
  if (els.jobHint && found) els.jobHint.textContent = found.avgSalaryHint;
});
```

- `data-alb-job-hint` 요소의 텍스트만 교체
- 계산 로직에는 영향 없음 → `update()` 호출 불필요

### 7-3. data-attribute 매핑

| 요소 | data-attribute |
|------|---------------|
| 계산기 루트 | `data-alb-calculator` |
| 직군 select | `data-alb-job-type` |
| 직군 힌트 | `data-alb-job-hint` |
| 연봉 input | `data-alb-annual-salary` |
| 월급 input | `data-alb-monthly-salary` |
| 월급 힌트 | `data-alb-monthly-hint` |
| 월급 리셋 | `data-alb-reset-monthly` |
| 세율 모드 | `data-alb-tax-mode` |
| 직접 세율 | `data-alb-manual-tax-rate` |
| 회사 모드 | `data-alb-mode="{id}"` |
| 회사 지급률 | `data-alb-salary-percent="{id}"` |
| 회사 월배수 | `data-alb-monthly-multiple="{id}"` |
| 회사 고정금액 | `data-alb-fixed-amount="{id}"` |
| 입력 필드 그룹 | `data-alb-field-group="{id}" data-alb-field-mode="{mode}"` |
| KPI 세후 최고 | `data-alb-best-net` |
| KPI 세후 최고 회사 | `data-alb-best-net-company` |
| KPI 최대 차이 | `data-alb-max-gap` |
| KPI 월평균 차이 | `data-alb-monthly-gap` |
| KPI 총보상 최고 | `data-alb-best-total` |
| KPI 총보상 최고 회사 | `data-alb-best-total-company` |
| 결과 표 tbody | `data-alb-result-table` |

### 7-4. 스크립트 구조 (`public/scripts/airline-bonus-comparison.js`)

`it-bigtech-bonus-comparison.js`와 동일 구조. prefix `ibb` → `alb`, 직군 선택 이벤트 추가.

```js
import { buildDefaultOptions, makeLabelPlugin, formatKRW } from "./chart-config.js";

(() => {
  const configEl = document.getElementById("albConfig");
  const root = document.querySelector("[data-alb-calculator]");
  if (!configEl || !root) return;

  const config = JSON.parse(configEl.textContent || "{}");
  const companies = Array.isArray(config.companies) ? config.companies : [];
  const jobTypes = Array.isArray(config.jobTypes) ? config.jobTypes : [];

  const TAX_RATE_SIMPLE = 0.22;

  const state = {
    jobType: "ground",
    annualSalary: 70_000_000,
    monthlySalary: Math.round(70_000_000 / 12),
    monthlySalaryTouched: false,
    taxMode: "simple",
    manualTaxRate: 0.22,
    companies: {},
  };

  companies.forEach((company) => {
    state.companies[company.id] = {
      mode: company.defaultMode || "salaryPercent",
      salaryPercent: Number(company.defaultSalaryPercent || 0),
      monthlyMultiple: Number(company.defaultMonthlyMultiple || 0),
      fixedAmount: Number(company.defaultFixedAmount || 0),
    };
  });

  const els = {
    jobType: root.querySelector("[data-alb-job-type]"),
    jobHint: root.querySelector("[data-alb-job-hint]"),
    annualSalary: root.querySelector("[data-alb-annual-salary]"),
    monthlySalary: root.querySelector("[data-alb-monthly-salary]"),
    monthlyHint: root.querySelector("[data-alb-monthly-hint]"),
    resetMonthly: root.querySelector("[data-alb-reset-monthly]"),
    taxMode: root.querySelector("[data-alb-tax-mode]"),
    manualTaxRate: root.querySelector("[data-alb-manual-tax-rate]"),
    bestNet: document.querySelector("[data-alb-best-net]"),
    bestNetCompany: document.querySelector("[data-alb-best-net-company]"),
    maxGap: document.querySelector("[data-alb-max-gap]"),
    monthlyGap: document.querySelector("[data-alb-monthly-gap]"),
    bestTotal: document.querySelector("[data-alb-best-total]"),
    bestTotalCompany: document.querySelector("[data-alb-best-total-company]"),
    resultTable: document.querySelector("[data-alb-result-table]"),
    resetBtn: document.getElementById("albResetBtn"),
    copyBtn: document.getElementById("albCopyLinkBtn"),
  };

  // formatWon, formatInputNumber, parseNumber, escapeHtml: telecom 패턴 동일
  // getTaxRate, calculateGrossBonus, getInputLabel, calculateResults: 동일
  // syncInputs: data-alb-* 쿼리
  // renderResults: 5사 결과 → KPI + tbody
  // renderChart: albCompareChart, 5사 × 세전/세후 그룹 바
  // resetAll: state 초기화 (jobType = "ground", annualSalary = 70_000_000)

  // 직군 선택 이벤트 (추가)
  els.jobType?.addEventListener("change", (event) => {
    state.jobType = event.target.value;
    const found = jobTypes.find((j) => j.id === state.jobType);
    if (els.jobHint && found) els.jobHint.textContent = found.avgSalaryHint;
  });

  // 나머지 이벤트: telecom 패턴 동일 (alb- prefix)
  // 마지막 줄: update();
})();
```

---

## 8. Chart.js 설계

- 차트: 그룹 바 차트 (`albCompareChart`)
- X축: 대한항공 / 아시아나 / 제주항공 / 티웨이 / 진에어 (`shortName` 사용)
- 데이터셋 2개: "세전 성과급", "세후 추정"
- `alb-chart-wrap`: `height: 260px` (5개 항목)

---

## 9. 스타일 설계

### 9-1. Prefix: `alb-`

`_it-bigtech-bonus-comparison.scss` 구조를 그대로 복제, prefix `ibb` → `alb`.

차이점:
- `.alb-job-section`, `.alb-job-grid`, `.alb-job-card` 추가 (직군별 설명 섹션)
- `.alb-stock-section` 없음 (항공은 스톡 보상 섹션 없음)

```scss
// ── 직군별 보상 설명 ──
.alb-page .alb-job-section { padding: 24px 0; }
.alb-page .alb-job-grid {
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr;
}
.alb-page .alb-job-card {
  border: 1px solid #E0DFDB;
  border-radius: 10px;
  padding: 16px;
  background: #FFFFFF;

  strong { display: block; font-size: 14px; font-weight: 500; color: #1A1A18; margin-bottom: 8px; }
  p { font-size: 12px; color: #5F5E5A; line-height: 1.6; margin: 0 0 4px; }
}
.alb-page .alb-job-card__note { font-size: 11px; color: #888780; margin-top: 4px; }

// ── 반응형 ──
@media (min-width: 380px) {
  .alb-page .alb-company-panel__inputs { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (min-width: 560px) {
  .alb-page .alb-kpi-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (min-width: 768px) {
  .alb-page .alb-job-grid,
  .alb-page .alb-related-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .alb-page .alb-kpi-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}
@media (min-width: 1024px) {
  .alb-page .alb-job-grid,
  .alb-page .alb-related-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
```

나머지 클래스 (`alb-company-panel-list`, `alb-kpi-card`, `alb-result-table`, `alb-chart-wrap`, `alb-related-card` 등)는 `_it-bigtech-bonus-comparison.scss`와 동일 구조, prefix만 변경.

---

## 10. `tools.ts` 등록

```ts
{
  slug: "airline-bonus-comparison",
  title: "항공사 5사 성과급 비교 계산기",
  description: "대한항공·아시아나·제주항공·티웨이·진에어의 성과급을 같은 연봉 기준으로 비교합니다. 직군(조종사·승무원·일반직) 선택 후 회사별 지급률을 조정해 세전·세후 예상액을 확인하세요.",
  order: 27.9,
  eyebrow: "항공사 5사 Tool",
  category: "simulator",
  iframeReady: true,
  badges: ["신규", "추정"],
  previewStats: [
    { label: "비교 대상", value: "5사", context: "대한항공·아시아나·LCC 3사" },
    { label: "직군 선택", value: "3직군", context: "조종사·승무원·일반직" },
  ],
},
```

`index.astro`의 `topicBySlug`에 `"airline-bonus-comparison": "성과급 비교"` 추가.

---

## 11. Sitemap

```xml
<url>
  <loc>https://bigyocalc.com/tools/airline-bonus-comparison/</loc>
  <lastmod>2026-06-16</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## 12. InfoNotice 문구

```astro
<InfoNotice
  title="계산 전 안내"
  lines={[
    "이 계산기는 사용자가 입력한 연봉과 성과급률을 기준으로 한 비교용 시뮬레이션입니다.",
    "실제 지급액은 직군(운항/객실/일반직), 직급, 개인 평가, 노사 합의에 따라 크게 달라질 수 있습니다.",
    "조종사는 비행수당·노선수당 등 성과급 외 변동 보상이 별도로 존재하므로 현금 성과급만으로 비교하면 실질 보상을 과소평가할 수 있습니다.",
    "대한항공·아시아나항공 통합은 현재 진행 중이며, 통합 이후 보상 체계는 변경될 수 있습니다.",
    "이 계산기는 특정 항공사에 대한 투자 권유 또는 평가를 목적으로 하지 않습니다.",
  ]}
/>
```

---

## 13. Config 주입

```astro
<script id="albConfig" type="application/json" set:html={JSON.stringify(config)}></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
<script type="module" src={withBase("/scripts/airline-bonus-comparison.js")}></script>
```

---

## 14. 구현 순서

1. `src/data/airlineBonusComparison2026.ts` 작성
2. `src/pages/tools/airline-bonus-comparison.astro` 작성
3. `src/styles/scss/pages/_airline-bonus-comparison.scss` 작성 + `app.scss` import
4. `public/scripts/airline-bonus-comparison.js` 작성 (직군 선택 이벤트 포함)
5. `src/data/tools.ts` 등록
6. `public/sitemap.xml` URL 추가
7. `src/pages/index.astro` `topicBySlug` 등록
8. `npm run build` 성공 확인

---

## 15. QA 체크리스트

### 콘텐츠 QA

- [ ] H1/title/description에 5사 이름 모두 포함
- [ ] 각 회사 카드에 추정/시뮬레이션 배지 표시
- [ ] 대한항공-아시아나 통합 이슈 안내 문구 포함
- [ ] 조종사 비행수당 별도 안내 포함
- [ ] LCC 데이터 불확실성 안내 포함
- [ ] FAQ 7개, SeoContent intro 5문단/800자 이상

### UX QA

- [ ] 직군 선택 변경 시 `data-alb-job-hint` 텍스트만 교체, 계산값 미변동
- [ ] 연봉 변경 시 월급 자동 갱신
- [ ] 5사 모드 전환 각각 정상 동작
- [ ] KPI 4개 카드 실시간 갱신
- [ ] 결과 표 5행 정상 렌더링, 세후 최고 행 `is-best` 하이라이트
- [ ] Chart.js 5개 그룹 바 차트 정상 렌더링

### 기술 QA

- [ ] `npm run build` 성공, `/tools/airline-bonus-comparison/` 라우트 생성
- [ ] `tools.ts`, `sitemap.xml`, `app.scss`, `index.astro` 등록 확인
- [ ] 관련 링크 404 없음
