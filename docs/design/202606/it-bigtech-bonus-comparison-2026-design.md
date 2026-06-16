# 국내 빅테크 5사 성과급 비교 계산기 — 설계 문서

> 기획 원문: `docs/plan/202606/kakao-naver-bonus-comparison-2026-plan.md`
> 작성일: 2026-06-16
> 구현 기준: Claude/Codex가 이 문서만 보고 `/tools/it-bigtech-bonus-comparison/` 페이지를 구현할 수 있는 수준
> 참고 페이지: `telecom-bonus-comparison` (동일 패턴 — SimpleToolShell + aside 5개 회사 패널 + KPI/표/차트)

---

## 1. 문서 개요

### 1-1. 대상

- 구현 대상: `국내 빅테크 5사 성과급 비교 계산기 2026`
- 콘텐츠 유형: 계산기 (tool)
- slug: `it-bigtech-bonus-comparison`
- URL: `/tools/it-bigtech-bonus-comparison/`

### 1-2. 문서 역할

- 기획 문서를 기준으로 데이터 스키마, 페이지 섹션, 입출력, 스타일 prefix, QA를 구현 단위로 고정한다.
- `telecom-bonus-comparison`의 구조를 그대로 차용한다. 차이점은 비교 대상이 5사(카카오·네이버·토스·라인·쿠팡)이고, 스톡 보상 설명 섹션이 추가된다는 점이다.

### 1-3. 페이지 성격

- **5사 동시 비교 계산기**: 항상 5사를 표시 (회사 선택 토글 없음)
- **현금성 성과급 시뮬레이션 중심**: 스톡옵션/RSU는 수치화하지 않고 정성 설명 섹션으로 분리
- **추정/시뮬레이션 명시**: 기본 지급률은 업계 추정값이며 사용자가 직접 조정 가능

### 1-4. 권장 파일 구조

```txt
src/
  data/
    itBigtechBonusComparison2026.ts
  pages/
    tools/
      it-bigtech-bonus-comparison.astro

public/
  scripts/
    it-bigtech-bonus-comparison.js

src/styles/scss/pages/
  _it-bigtech-bonus-comparison.scss
```

필수 등록: `src/data/tools.ts`, `src/styles/app.scss`, `public/sitemap.xml`, `src/pages/index.astro`(`topicBySlug`)

---

## 2. SEO 설계

### 2-1. 메타

```ts
title: "국내 빅테크 5사 성과급 비교 계산기 2026 (카카오·네이버·토스·라인·쿠팡)"
description: "카카오, 네이버, 토스, 라인플러스, 쿠팡의 성과급을 같은 연봉 기준으로 비교해보세요. 회사별 지급률을 직접 조정해 세전·세후 예상액과 차이를 한 화면에서 확인할 수 있습니다."
ogImage: "/og/tools/it-bigtech-bonus-comparison.png"
```

### 2-2. 키워드 매핑

| 키워드 | 반영 위치 |
|--------|-----------|
| 카카오 성과급 | title, H1, FAQ, 해설 카드 |
| 네이버 성과급 | title, H1, FAQ, 해설 카드 |
| 토스 성과급 | title, H1, FAQ, 해설 카드 |
| 쿠팡 성과급 | title, H1, FAQ, 해설 카드 |
| 라인 연봉 | title, H1, FAQ, 해설 카드 |
| 빅테크 성과급 비교 | description, SeoContent |
| IT 플랫폼 성과급 비교 | SeoContent, 관련 링크 |

---

## 3. 데이터 스키마

### 3-1. `src/data/itBigtechBonusComparison2026.ts`

```ts
export type BigtechCompanyId = "kakao" | "naver" | "toss" | "line" | "coupang";
export type BonusInputMode = "salaryPercent" | "monthlyMultiple" | "fixedAmount";
export type TaxMode = "simple" | "manual";
export type EvidenceBadge = "추정" | "시뮬레이션" | "사용자 입력 기준";

export interface BigtechCompanyConfig {
  id: BigtechCompanyId;
  name: string;
  shortName: string;
  defaultMode: BonusInputMode;
  defaultSalaryPercent: number;
  defaultMonthlyMultiple: number;
  defaultFixedAmount: number;
  structureSummary: string;
  stockNote: string;
  caution: string;
  badges: EvidenceBadge[];
}

export const BIGTECH_COMPANIES: BigtechCompanyConfig[] = [
  {
    id: "kakao", name: "카카오", shortName: "카카오",
    defaultMode: "salaryPercent", defaultSalaryPercent: 15, defaultMonthlyMultiple: 1.5, defaultFixedAmount: 0,
    structureSummary: "사업부·계열사별 성과에 따른 현금 성과급(PS) 구조로 알려져 있습니다.",
    stockNote: "직군·연차에 따라 스톡옵션이 부여되는 경우가 있으나 대상·규모는 개별 계약에 따라 다릅니다.",
    caution: "카카오뱅크·카카오페이 등 계열사별로 보상 구조가 다를 수 있습니다.",
    badges: ["추정", "시뮬레이션"],
  },
  {
    id: "naver", name: "네이버", shortName: "네이버",
    defaultMode: "salaryPercent", defaultSalaryPercent: 15, defaultMonthlyMultiple: 1.5, defaultFixedAmount: 0,
    structureSummary: "사업 성과 및 개인 평가에 따른 현금 성과급(인센티브) 구조로 알려져 있습니다.",
    stockNote: "스톡그랜트(주식 보상) 프로그램을 운영한 사례가 있으며 대상·규모는 시기별로 다릅니다.",
    caution: "네이버웹툰·네이버클라우드 등 계열사별로 보상 구조가 다를 수 있습니다.",
    badges: ["추정", "시뮬레이션"],
  },
  {
    id: "toss", name: "토스(비바리퍼블리카)", shortName: "토스",
    defaultMode: "salaryPercent", defaultSalaryPercent: 20, defaultMonthlyMultiple: 2.0, defaultFixedAmount: 0,
    structureSummary: "연봉 자체가 업계 상위 수준이며 성과 기반 현금 보너스 구조로 알려져 있습니다.",
    stockNote: "초기 입사자 중심으로 스톡옵션이 부여된 사례가 많으며, 최근에는 RSU 방식도 병행하는 것으로 알려져 있습니다.",
    caution: "비상장사로 스톡옵션 행사 가능 시기·가치는 불확실하며, 직군·연차별 편차가 큽니다.",
    badges: ["추정", "시뮬레이션"],
  },
  {
    id: "line", name: "라인플러스", shortName: "라인",
    defaultMode: "salaryPercent", defaultSalaryPercent: 12, defaultMonthlyMultiple: 1.2, defaultFixedAmount: 0,
    structureSummary: "일본 본사(LY Corporation) 실적 연동 구조이며, 국내법인(라인플러스) 기준 현금 성과급이 지급됩니다.",
    stockNote: "일본 본사 주식 기반 보상(RSU)이 부여되는 경우가 있으며 환율 변동에 따라 실수령액이 달라질 수 있습니다.",
    caution: "본사 실적과 환율 영향을 받으므로 연도별 편차가 클 수 있습니다.",
    badges: ["추정", "시뮬레이션"],
  },
  {
    id: "coupang", name: "쿠팡", shortName: "쿠팡",
    defaultMode: "salaryPercent", defaultSalaryPercent: 10, defaultMonthlyMultiple: 1.0, defaultFixedAmount: 0,
    structureSummary: "미국 상장사(NYSE: CPNG)로 현금 성과급보다 RSU(양도제한조건부주식) 비중이 높은 구조입니다.",
    stockNote: "입사 시 RSU 부여가 일반적이며 Vesting 스케줄(보통 4년)에 따라 주식이 지급됩니다. 주가 변동에 따라 실수령 가치가 달라집니다.",
    caution: "직군(개발/물류/운영)별 보상 구조 차이가 크며, 현금 성과급만으로 비교하면 실질 보상을 과소평가할 수 있습니다.",
    badges: ["추정", "시뮬레이션"],
  },
];

export const BIGTECH_SIMPLE_TAX_RATE = 0.22;

export interface BigtechCompanyProfile {
  id: BigtechCompanyId;
  averageSalary: string;
  employeeCount: string;
  stockType: string;
  recentBonus: string;
}

export const BIGTECH_COMPANY_PROFILES: BigtechCompanyProfile[] = [
  { id: "kakao",   averageSalary: "약 1억 1,000만 원", employeeCount: "약 3,800명",       stockType: "스톡옵션",       recentBonus: "비공개" },
  { id: "naver",   averageSalary: "약 1억 3,000만 원", employeeCount: "약 4,500명",       stockType: "스톡그랜트",     recentBonus: "비공개" },
  { id: "toss",    averageSalary: "약 1억 5,000만 원+", employeeCount: "약 2,000명",      stockType: "스톡옵션/RSU",   recentBonus: "비공개" },
  { id: "line",    averageSalary: "약 1억 원",          employeeCount: "약 1,000명",      stockType: "본사 RSU(엔화)", recentBonus: "비공개" },
  { id: "coupang", averageSalary: "약 1억 원+",         employeeCount: "약 5,000명(본사)", stockType: "RSU(USD)",       recentBonus: "비공개" },
];

export const BIGTECH_PROFILE_NOTE =
  "평균연봉·직원수는 사업보고서 및 업계 추정 기반 참고 정보입니다. 성과급 지급률은 각 사가 공식적으로 공개한 경우에만 표기했으며, 비공개 항목은 '비공개'로 표시했습니다.";

export interface FaqItem { question: string; answer: string; }
export const BIGTECH_BONUS_FAQ: FaqItem[] = [
  {
    question: "카카오와 네이버 중 성과급이 더 많은 곳은 어디인가요?",
    answer: "연도와 사업부 실적에 따라 다르며, 이 계산기는 동일한 연봉·지급률 가정 하에서의 비교용 시뮬레이션만 제공합니다. 실제 수령액은 개인 평가와 소속 계열사에 따라 크게 달라집니다.",
  },
  {
    question: "토스 성과급은 왜 기본값이 20%로 높게 설정되어 있나요?",
    answer: "토스(비바리퍼블리카)는 연봉 자체가 업계 상위 수준이며, 성과 기반 현금 보너스가 상대적으로 높다는 업계 추정을 반영한 시뮬레이션 기본값입니다. 실제 지급률은 회사 및 개인 성과에 따라 다릅니다.",
  },
  {
    question: "쿠팡은 왜 현금 성과급 기본값이 낮게 설정되어 있나요?",
    answer: "쿠팡은 현금 성과급보다 RSU(양도제한조건부주식) 비중이 높은 보상 구조로 알려져 있습니다. 이 계산기는 현금 성과급만 시뮬레이션하므로, RSU를 포함한 실질 총보상은 훨씬 높을 수 있습니다.",
  },
  {
    question: "라인플러스 성과급에 환율이 영향을 미치나요?",
    answer: "라인플러스는 일본 본사(LY Corporation) 실적과 연동된 구조이며, 일본 본사 주식 기반 RSU가 부여되는 경우 엔화 환율에 따라 원화 환산 실수령액이 달라질 수 있습니다.",
  },
  {
    question: "스톡옵션·RSU는 왜 계산기에 포함되지 않나요?",
    answer: "스톡옵션과 RSU는 주가·환율·Vesting 스케줄·행사 시점에 따라 가치가 크게 달라지므로, 단순 수치 비교가 오히려 오해를 유발할 수 있어 정성 설명 섹션으로만 안내하고 있습니다.",
  },
  {
    question: "이 계산기의 기본 지급률은 공식 수치인가요?",
    answer: "아니요. 보도·업계 추정 기반 시뮬레이션 기본값이며, 각 회사의 공식 지급률이 아닙니다. 알고 계신 수치가 있다면 직접 입력 모드로 조정해 사용하세요.",
  },
  {
    question: "세후 금액은 어떻게 계산되나요?",
    answer: "성과급은 근로소득으로 합산 과세됩니다. 이 계산기의 세후 값은 간편 공제율(22%) 또는 직접 입력한 세율을 적용한 참고값이며, 정확한 세후 금액은 성과급 세후 실수령액 계산기를 이용하세요.",
  },
];

export interface RelatedLink { href: string; label: string; description: string; }
export const BIGTECH_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/it-platform-bonus-comparison/", label: "IT 플랫폼 성과급 비교", description: "배달·이커머스 포함 IT 업계 비교" },
  { href: "/reports/it-salary-top10/", label: "국내 IT 연봉 TOP10", description: "IT 업계 직군별 연봉 순위" },
  { href: "/tools/semiconductor-bonus-comparison/", label: "반도체 성과급 비교", description: "삼성전자·SK하이닉스 등 비교" },
  { href: "/tools/bonus-after-tax-calculator/", label: "성과급 세후 실수령액 계산기", description: "성과급 세금을 정확히 계산" },
  { href: "/tools/bonus-simulator/", label: "대기업 성과급 시뮬레이터", description: "여러 대기업 성과급 한 번에 비교" },
];
```

### 3-2. 계산 로직

`telecom-bonus-comparison`과 동일한 계산식을 5사 각각에 적용:

```
연간 성과급(세전) = 기준액 × 입력값
  - salaryPercent: 기준액 = 연봉, 입력값 = 지급률(%) / 100
  - monthlyMultiple: 기준액 = 월급(연봉÷12), 입력값 = 배수
  - fixedAmount: 입력값 = 사용자 입력 금액 그대로

연간 성과급(세후 추정) = 연간 성과급(세전) × (1 - 세율)
  - simple 모드: 세율 = 0.22
  - manual 모드: 세율 = 사용자 입력 / 100

월평균 환산 = 연간 성과급(세전) / 12
총보상(세전) = 연봉 + 연간 성과급(세전)
```

KPI 산출:
```
최고 예상 세후 성과급 = max(5사 세후 성과급)
5사 간 최대 차이 = max(5사 세전 성과급) - min(5사 세전 성과급)
월평균 차이 = 최대 차이 / 12
성과급 포함 최고 총보상 = max(5사 총보상)
```

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
  BIGTECH_COMPANIES,
  BIGTECH_BONUS_FAQ,
  BIGTECH_RELATED_LINKS,
  BIGTECH_COMPANY_PROFILES,
  BIGTECH_PROFILE_NOTE,
} from "../../data/itBigtechBonusComparison2026";

const config = { companies: BIGTECH_COMPANIES };

const faqSchema = BIGTECH_BONUS_FAQ.map((item) => ({
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
  SimpleToolShell (calculatorId="it-bigtech-bonus-comparison" pageClass="ibb-page" resultFirst={false})
    slot:hero → CalculatorHero + InfoNotice
    slot:actions → ToolActionBar
    slot:aside → 입력 패널 (연봉/월급 공통 입력 + 5사별 지급 방식 입력 + 세율)
    [A] KPI 핵심 비교 카드
    [B] 5사 비교 결과 표
    [C] 5사 비교 바 차트
    [D] 스톡 보상 설명 섹션 (5사 카드)
    [E] 기업 현황 참고 표
    [F] 관련 계산기 그리드
    slot:seo → SeoContent (FAQ 포함)
```

---

## 5. 입력 패널 설계 (`slot:aside`)

`telecom-bonus-comparison`의 aside 구조를 그대로 차용. 5사 모두 항상 표시.

```astro
<section class="ibb-calculator" data-ibb-calculator>
  <!-- 공통 연봉 입력 -->
  <article class="panel ibb-input-panel">
    <div class="panel-heading">
      <div>
        <p class="panel-heading__eyebrow">기준 입력</p>
        <h2 class="panel__title">같은 조건으로 맞추기</h2>
      </div>
      <p class="panel-heading__summary">연봉과 월 기본급을 먼저 맞춘 뒤 회사별 성과급 방식을 조정하세요.</p>
    </div>
    <div class="form-grid">
      <label class="field" for="ibbAnnualSalary">
        <span>기준 연봉</span>
        <input id="ibbAnnualSalary" data-ibb-annual-salary type="text" inputmode="numeric" value="120,000,000" />
        <small>빅테크 5사 평균 연봉(추정) 기준이며, 성과급 포함 전 연봉입니다.</small>
      </label>
      <label class="field" for="ibbMonthlySalary">
        <span>월 기본급</span>
        <input id="ibbMonthlySalary" data-ibb-monthly-salary type="text" inputmode="numeric" value="10,000,000" />
        <small data-ibb-monthly-hint>연봉을 바꾸면 자동 갱신됩니다.</small>
      </label>
      <button class="button button--secondary" type="button" data-ibb-reset-monthly>
        연봉 기준으로 다시 계산
      </button>
      <label class="field" for="ibbTaxMode">
        <span>세후 계산 방식</span>
        <select id="ibbTaxMode" data-ibb-tax-mode>
          <option value="simple" selected>간편 추정 (22%)</option>
          <option value="manual">직접 세율 입력</option>
        </select>
      </label>
      <label class="field" for="ibbManualTaxRate">
        <span>직접 공제율 (%)</span>
        <input id="ibbManualTaxRate" data-ibb-manual-tax-rate type="number" min="0" max="60" step="0.1" value="22" />
        <small>직접 세율 입력 모드에서 사용합니다.</small>
      </label>
    </div>
  </article>

  <!-- 5사별 성과급 입력 -->
  <article class="panel ibb-company-inputs">
    <div class="panel-heading">
      <div>
        <p class="panel-heading__eyebrow">회사별 가정</p>
        <h2 class="panel__title">성과급 방식 입력</h2>
      </div>
      <p class="panel-heading__summary">기본값은 추정 시뮬레이션 값입니다. 알고 있는 지급 기준으로 직접 수정하세요.</p>
    </div>
    <div class="ibb-company-panel-list">
      {BIGTECH_COMPANIES.map((company) => (
        <section class="ibb-company-panel" data-ibb-company-panel={company.id}>
          <div class="ibb-company-panel__head">
            <div>
              <strong>{company.name}</strong>
              <span>{company.structureSummary}</span>
            </div>
            <div class="ibb-company-panel__badges">
              {company.badges.map((badge) => <span>{badge}</span>)}
            </div>
          </div>
          <div class="ibb-company-panel__inputs">
            <label class="field" for={`ibbMode-${company.id}`}>
              <span>성과급 방식</span>
              <select id={`ibbMode-${company.id}`} data-ibb-mode={company.id}>
                <option value="salaryPercent" selected={company.defaultMode === "salaryPercent"}>연봉 대비 %</option>
                <option value="monthlyMultiple" selected={company.defaultMode === "monthlyMultiple"}>월급 n개월</option>
                <option value="fixedAmount" selected={company.defaultMode === "fixedAmount"}>고정 금액</option>
              </select>
            </label>
            <label class="field" for={`ibbPercent-${company.id}`} data-ibb-field-group={company.id} data-ibb-field-mode="salaryPercent">
              <span>성과급률 (%)</span>
              <input id={`ibbPercent-${company.id}`} data-ibb-salary-percent={company.id} type="number" min="0" max="100" step="0.5" value={company.defaultSalaryPercent} />
            </label>
            <label class="field" for={`ibbMultiple-${company.id}`} data-ibb-field-group={company.id} data-ibb-field-mode="monthlyMultiple">
              <span>월급 개월 수</span>
              <input id={`ibbMultiple-${company.id}`} data-ibb-monthly-multiple={company.id} type="number" min="0" max="12" step="0.1" value={company.defaultMonthlyMultiple} />
            </label>
            <label class="field" for={`ibbFixed-${company.id}`} data-ibb-field-group={company.id} data-ibb-field-mode="fixedAmount">
              <span>고정 성과급</span>
              <input id={`ibbFixed-${company.id}`} data-ibb-fixed-amount={company.id} type="text" inputmode="numeric" value="0" />
            </label>
          </div>
          <p class="ibb-company-panel__caution">{company.caution}</p>
        </section>
      ))}
    </div>
  </article>
</section>
```

---

## 6. 출력 섹션 설계

### [A] KPI 핵심 비교 카드

```astro
<section class="ibb-results">
  <div class="ibb-section-head">
    <p class="ibb-section-head__eyebrow">핵심 결과</p>
    <h2>빅테크 5사 성과급 비교</h2>
    <p>입력값을 바꾸면 결과가 바로 갱신됩니다. 모든 금액은 사용자 입력 기준 시뮬레이션입니다.</p>
  </div>
  <div class="ibb-kpi-grid">
    <article class="ibb-kpi-card">
      <span>최고 예상 세후 성과급</span>
      <strong data-ibb-best-net>-</strong>
      <small data-ibb-best-net-company>-</small>
    </article>
    <article class="ibb-kpi-card">
      <span>5사 간 최대 차이 (세전)</span>
      <strong data-ibb-max-gap>-</strong>
      <small>5사 비교 기준</small>
    </article>
    <article class="ibb-kpi-card">
      <span>월평균 차이</span>
      <strong data-ibb-monthly-gap>-</strong>
      <small>12개월 환산</small>
    </article>
    <article class="ibb-kpi-card">
      <span>성과급 포함 최고 총보상</span>
      <strong data-ibb-best-total>-</strong>
      <small data-ibb-best-total-company>-</small>
    </article>
  </div>
</section>
```

### [B] 5사 비교 결과 표

```astro
<section class="ibb-result-section">
  <div class="ibb-section-head">
    <p class="ibb-section-head__eyebrow">회사별 표</p>
    <h2>세전·세후·월평균 환산</h2>
  </div>
  <div class="ibb-table-wrap">
    <table class="ibb-result-table">
      <caption>빅테크 5사 성과급 비교 결과 표</caption>
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
      <tbody data-ibb-result-table></tbody>
    </table>
  </div>
  <p class="ibb-footnote">예상 세후 금액은 간편 공제율(또는 직접 입력한 공제율)을 적용한 추정값입니다. 실제 통장 입금액은 지급월 급여, 부양가족, 비과세 항목, 4대보험, 연말정산 결과에 따라 달라질 수 있습니다.</p>
</section>
```

### [C] 5사 비교 바 차트

```astro
<section class="ibb-chart-section">
  <div class="ibb-section-head">
    <p class="ibb-section-head__eyebrow">시각화</p>
    <h2>5사 세전·세후 성과급 비교</h2>
  </div>
  <div class="ibb-chart-wrap">
    <canvas id="ibbCompareChart" aria-label="빅테크 5사 성과급 비교 차트" role="img"></canvas>
  </div>
</section>
```

### [D] 스톡 보상 설명 섹션 (5사 카드)

```astro
<section class="ibb-stock-section">
  <div class="ibb-section-head">
    <p class="ibb-section-head__eyebrow">스톡 보상 안내</p>
    <h2>현금 성과급 외 주식 보상 비교</h2>
    <p>아래 내용은 수치화하지 않은 정성 안내입니다. 실제 가치는 주가·환율·Vesting 시점에 따라 달라집니다.</p>
  </div>
  <div class="ibb-stock-grid">
    {BIGTECH_COMPANIES.map((company) => (
      <article class="ibb-stock-card">
        <div class="ibb-stock-card__head">
          <strong>{company.name}</strong>
          <div class="ibb-stock-card__badges">
            {company.badges.map((badge) => <span>{badge}</span>)}
          </div>
        </div>
        <p>{company.stockNote}</p>
        <p class="ibb-stock-card__caution">{company.caution}</p>
      </article>
    ))}
  </div>
</section>
```

### [E] 기업 현황 참고 표

```astro
<section class="ibb-profile-section">
  <div class="ibb-section-head">
    <p class="ibb-section-head__eyebrow">기업 현황 (참고)</p>
    <h2>빅테크 5사 평균연봉·스톡 보상 비교</h2>
    <p>업계 추정 및 공개 정보 기반 참고 자료입니다.</p>
  </div>
  <div class="ibb-table-wrap">
    <table class="ibb-result-table ibb-profile-table">
      <caption>빅테크 5사 기업 현황 비교 표</caption>
      <thead>
        <tr>
          <th>회사</th>
          <th>평균연봉 (추정)</th>
          <th>직원수 (추정)</th>
          <th>스톡 보상 유형</th>
          <th>최근 성과급</th>
        </tr>
      </thead>
      <tbody>
        {BIGTECH_COMPANIES.map((company) => {
          const profile = BIGTECH_COMPANY_PROFILES.find((p) => p.id === company.id);
          if (!profile) return null;
          return (
            <tr>
              <td class="cell-label"><strong>{company.name}</strong></td>
              <td>{profile.averageSalary}</td>
              <td>{profile.employeeCount}</td>
              <td>{profile.stockType}</td>
              <td>{profile.recentBonus}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
  <p class="ibb-footnote">{BIGTECH_PROFILE_NOTE}</p>
</section>
```

### [F] 관련 계산기 그리드

```astro
<section class="ibb-related">
  <div class="ibb-section-head">
    <p class="ibb-section-head__eyebrow">다음 단계</p>
    <h2>함께 보면 좋은 계산기</h2>
  </div>
  <div class="ibb-related-grid">
    {BIGTECH_RELATED_LINKS.map((link) => (
      <a class="ibb-related-card" href={link.href}>
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
  annualSalary: 120_000_000,
  monthlySalary: 10_000_000,
  monthlySalaryTouched: false,
  taxMode: "simple",
  manualTaxRate: 0.22,
  companies: {
    kakao:   { mode: "salaryPercent", salaryPercent: 15, monthlyMultiple: 1.5, fixedAmount: 0 },
    naver:   { mode: "salaryPercent", salaryPercent: 15, monthlyMultiple: 1.5, fixedAmount: 0 },
    toss:    { mode: "salaryPercent", salaryPercent: 20, monthlyMultiple: 2.0, fixedAmount: 0 },
    line:    { mode: "salaryPercent", salaryPercent: 12, monthlyMultiple: 1.2, fixedAmount: 0 },
    coupang: { mode: "salaryPercent", salaryPercent: 10, monthlyMultiple: 1.0, fixedAmount: 0 },
  },
};
```

### 7-2. data-attribute 매핑

| 요소 | data-attribute |
|------|---------------|
| 계산기 루트 | `data-ibb-calculator` |
| 연봉 입력 | `data-ibb-annual-salary` |
| 월급 입력 | `data-ibb-monthly-salary` |
| 월급 힌트 | `data-ibb-monthly-hint` |
| 월급 리셋 버튼 | `data-ibb-reset-monthly` |
| 세율 모드 select | `data-ibb-tax-mode` |
| 직접 세율 input | `data-ibb-manual-tax-rate` |
| 회사별 모드 select | `data-ibb-mode="{id}"` |
| 회사별 지급률 | `data-ibb-salary-percent="{id}"` |
| 회사별 월배수 | `data-ibb-monthly-multiple="{id}"` |
| 회사별 고정금액 | `data-ibb-fixed-amount="{id}"` |
| 입력 필드 그룹 | `data-ibb-field-group="{id}" data-ibb-field-mode="{mode}"` |
| KPI 세후 최고 | `data-ibb-best-net` |
| KPI 세후 최고 회사 | `data-ibb-best-net-company` |
| KPI 최대 차이 | `data-ibb-max-gap` |
| KPI 월평균 차이 | `data-ibb-monthly-gap` |
| KPI 총보상 최고 | `data-ibb-best-total` |
| KPI 총보상 최고 회사 | `data-ibb-best-total-company` |
| 결과 표 tbody | `data-ibb-result-table` |

### 7-3. 이벤트 흐름

1. 연봉 입력 변경 → `monthlySalaryTouched`가 `false`면 월급 = 연봉÷12 자동 갱신 → `update()`
2. 월급 직접 수정 → `monthlySalaryTouched = true` → 이후 연봉 변경 시에도 유지
3. `data-ibb-reset-monthly` 클릭 → `monthlySalaryTouched = false` → 월급 재계산
4. 회사별 모드 select 변경 → 해당 회사의 `data-ibb-field-group` 중 `data-ibb-field-mode` 일치 항목만 표시 (`hidden` 토글)
5. 지급률/배수/고정금액 변경 → `state.companies[id]` 갱신 → `update()`
6. 세율 모드 변경 → manual 선택 시 직접 세율 input 활성화
7. `update()` = `syncInputs()` + `renderResults()` + `renderChart()`

### 7-4. 스크립트 구조 (`public/scripts/it-bigtech-bonus-comparison.js`)

`telecom-bonus-comparison.js`와 동일한 구조. prefix만 `tbc` → `ibb`로 변경, 회사 수 3 → 5.

```js
import { buildDefaultOptions, makeLabelPlugin, formatKRW } from "./chart-config.js";

(() => {
  const configEl = document.getElementById("ibbConfig");
  const root = document.querySelector("[data-ibb-calculator]");
  if (!configEl || !root) return;

  const config = JSON.parse(configEl.textContent || "{}");
  const companies = Array.isArray(config.companies) ? config.companies : [];

  const TAX_RATE_SIMPLE = 0.22;

  const state = {
    annualSalary: 120_000_000,
    monthlySalary: 10_000_000,
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

  // els: data-attribute 쿼리 (telecom 패턴 동일, 접두사 ibb-)
  // formatWon, formatInputNumber, parseNumber, escapeHtml: 동일 헬퍼
  // getTaxRate, calculateGrossBonus, getInputLabel, calculateResults: 동일 로직
  // syncInputs: data-ibb-* 쿼리로 동기화
  // renderResults: 5사 결과 → KPI + tbody 렌더링
  // renderChart: ibbCompareChart, 5사 × 세전/세후 그룹 바
  // resetAll: state 초기화 → update()
  // addEventListener: telecom 패턴과 동일
  // update(): syncInputs + renderResults + renderChart
  // 마지막 줄: update();
})();
```

---

## 8. Chart.js 설계

- 차트: 그룹 바 차트 (`ibbCompareChart`)
- X축: 카카오 / 네이버 / 토스 / 라인 / 쿠팡 (5개 그룹, `shortName` 사용)
- 데이터셋 2개: "세전 성과급", "세후 추정"
- `buildDefaultOptions()`, `makeLabelPlugin(formatKRW)`, `formatKRW` 재사용
- `ibb-chart-wrap`: `position: relative; height: 260px; overflow: hidden;` (5개 항목이므로 통신 3사보다 조금 높게)

---

## 9. 스타일 설계

### 9-1. Prefix: `ibb-`

```
.ibb-page
.ibb-calculator
.ibb-input-panel
.ibb-company-inputs
.ibb-company-panel-list
.ibb-company-panel
.ibb-company-panel__head
.ibb-company-panel__inputs
.ibb-company-panel__badges
.ibb-company-panel__caution
.ibb-results
.ibb-kpi-grid
.ibb-kpi-card
.ibb-result-section
.ibb-table-wrap
.ibb-result-table
.ibb-footnote
.ibb-chart-section
.ibb-chart-wrap
.ibb-stock-section
.ibb-stock-grid
.ibb-stock-card
.ibb-stock-card__head
.ibb-stock-card__badges
.ibb-stock-card__caution
.ibb-profile-section
.ibb-profile-table
.ibb-related
.ibb-related-grid
.ibb-related-card
.ibb-section-head
.ibb-section-head__eyebrow
```

### 9-2. SCSS 골격 (`_it-bigtech-bonus-comparison.scss`)

`_telecom-bonus-comparison.scss` 구조를 그대로 복제 후 prefix `tbc` → `ibb`로 전환.

차이점:
- `.ibb-company-panel-list`: 단일 컬럼 유지 (aside 너비 제약, telecom 패턴 동일)
- `.ibb-company-panel__inputs`: `@media (min-width: 380px)` 에서 2컬럼
- `.ibb-chart-wrap`: `height: 260px` (5개 항목)
- `.ibb-stock-grid`: 기본 1컬럼, 768px+ 2컬럼, 1024px+ 3컬럼
- `.ibb-profile-table tbody td`: `white-space: normal`

```scss
// ── 배지 ──
.ibb-page .ibb-badges { /* tbc-badges 동일 */ }

// ── 입력 패널 ──
.ibb-page .ibb-company-panel-list { display: grid; gap: 12px; grid-template-columns: 1fr; }
.ibb-page .ibb-company-panel { border: 1px solid #E0DFDB; border-radius: 10px; padding: 16px; background: #FFFFFF; }
.ibb-page .ibb-company-panel__head { /* tbc 동일 */ }
.ibb-page .ibb-company-panel__badges { /* tbc 동일 */ }
.ibb-page .ibb-company-panel__inputs { display: grid; gap: 10px; grid-template-columns: 1fr; }
.ibb-page .ibb-company-panel__caution { margin: 10px 0 0; font-size: 11px; color: #888780; line-height: 1.5; }

// ── KPI ──
.ibb-page .ibb-kpi-grid { display: grid; gap: 8px; grid-template-columns: 1fr; }
.ibb-page .ibb-kpi-card { /* tbc 동일 */ }

// ── 결과 표 ──
.ibb-page .ibb-table-wrap { overflow-x: auto; }
.ibb-page .ibb-result-table { /* tbc 동일 */ }
.ibb-page .ibb-footnote { margin: 10px 0 0; font-size: 11px; color: #888780; line-height: 1.5; }

// ── 차트 ──
.ibb-page .ibb-chart-wrap { position: relative; height: 260px; overflow: hidden; margin-bottom: 8px; }

// ── 스톡 보상 ──
.ibb-page .ibb-stock-section { padding: 24px 0; }
.ibb-page .ibb-stock-grid { display: grid; gap: 10px; grid-template-columns: 1fr; }
.ibb-page .ibb-stock-card { border: 1px solid #E0DFDB; border-radius: 10px; padding: 16px; background: #FFFFFF; }
.ibb-page .ibb-stock-card__head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.ibb-page .ibb-stock-card__caution { font-size: 11px; color: #888780; margin-top: 6px; }

// ── 기업 현황 ──
.ibb-page .ibb-profile-section { padding: 24px 0; }
.ibb-page .ibb-profile-table tbody td { white-space: normal; }

// ── 관련 ──
.ibb-page .ibb-related-grid { display: grid; gap: 10px; grid-template-columns: 1fr; }
.ibb-page .ibb-related-card { /* tbc 동일 */ }

// ── 반응형 ──
@media (min-width: 380px) {
  .ibb-page .ibb-company-panel__inputs { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (min-width: 560px) {
  .ibb-page .ibb-kpi-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (min-width: 768px) {
  .ibb-page .ibb-stock-grid,
  .ibb-page .ibb-related-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .ibb-page .ibb-kpi-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}
@media (min-width: 1024px) {
  .ibb-page .ibb-stock-grid,
  .ibb-page .ibb-related-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
```

---

## 10. `tools.ts` 등록

```ts
{
  slug: "it-bigtech-bonus-comparison",
  title: "국내 빅테크 5사 성과급 비교 계산기",
  description: "카카오·네이버·토스·라인플러스·쿠팡의 성과급을 같은 연봉 기준으로 비교합니다. 회사별 지급률을 직접 조정해 세전·세후 예상액과 차이를 확인하세요.",
  order: 27.8,
  eyebrow: "빅테크 5사 Tool",
  category: "simulator",
  iframeReady: true,
  badges: ["신규", "추정"],
  previewStats: [
    { label: "비교 대상", value: "5사", context: "카카오·네이버·토스·라인·쿠팡" },
    { label: "산출 항목", value: "PS", context: "세전·세후" },
  ],
},
```

`src/pages/index.astro`의 `topicBySlug`에 `"it-bigtech-bonus-comparison": "성과급 비교"` 추가.

---

## 11. Sitemap / OG

### sitemap.xml

```xml
<url>
  <loc>https://bigyocalc.com/tools/it-bigtech-bonus-comparison/</loc>
  <lastmod>2026-06-16</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

### OG 이미지

```txt
public/og/tools/it-bigtech-bonus-comparison.png
```

텍스트:
- 메인: `카카오·네이버·토스·라인·쿠팡 성과급 비교`
- 서브: `빅테크 5사 세전·세후 시뮬레이션 2026`

---

## 12. InfoNotice 문구

```astro
<InfoNotice
  title="계산 전 안내"
  lines={[
    "이 계산기는 사용자가 입력한 연봉과 성과급률을 기준으로 한 비교용 시뮬레이션입니다.",
    "실제 지급액은 회사, 사업부, 직급, 평가, 계열사 소속에 따라 크게 달라질 수 있습니다.",
    "스톡옵션·RSU 등 주식 기반 보상은 이 계산기에 포함되지 않으며 별도 섹션에서 정성적으로 안내합니다.",
    "쿠팡은 현금 성과급보다 RSU 비중이 높으므로 현금 비교만으로 총보상을 판단하지 않도록 주의하세요.",
    "이 계산기는 특정 회사에 대한 투자 권유 또는 평가를 목적으로 하지 않습니다.",
  ]}
/>
```

---

## 13. Config 주입 (`<script>` 태그)

```astro
<script id="ibbConfig" type="application/json" set:html={JSON.stringify(config)}></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
<script type="module" src="/scripts/it-bigtech-bonus-comparison.js"></script>
```

---

## 14. SeoContent (요약)

```astro
<SeoContent
  introTitle="국내 빅테크 5사 성과급 비교 계산기 활용 가이드"
  intro={[
    "이 계산기는 카카오, 네이버, 토스(비바리퍼블리카), 라인플러스, 쿠팡 등 국내 주요 빅테크 5사의 성과급(현금 보너스)을 같은 연봉 기준으로 동시에 비교할 수 있는 시뮬레이션 도구입니다.",
    "IT 업계 이직을 준비하거나 보상 수준을 비교하고 싶은 분들이 각 회사의 성과급 지급 방식·수준을 한 화면에서 확인할 수 있도록 만들었습니다.",
    "카카오와 네이버는 사업부·계열사별 성과에 따른 현금 성과급 구조를, 토스는 업계 상위 수준의 연봉과 성과 기반 보너스를, 라인플러스는 일본 본사 실적 연동 구조를, 쿠팡은 RSU 중심의 보상 체계를 운영하는 것으로 알려져 있습니다.",
    "기준 연봉을 입력하면 월 기본급이 자동으로 계산되며, 회사별로 성과급 입력 방식(연봉 대비 %, 월급 n개월, 고정 금액)을 선택해 원하는 조건으로 비교할 수 있습니다.",
    "스톡옵션·RSU 등 주식 기반 보상은 주가·환율·Vesting 일정에 따라 가치가 크게 달라지므로 이 계산기에서는 수치화하지 않고 정성 설명 섹션으로만 제공합니다. 특히 쿠팡은 현금 성과급보다 RSU 비중이 높으므로 현금 비교만으로 총보상을 단정하지 않도록 주의하세요.",
  ]}
  faq={BIGTECH_BONUS_FAQ}
/>
```

---

## 15. 구현 순서

1. `src/data/itBigtechBonusComparison2026.ts` 작성 (5개사 config, profile, FAQ, 관련 링크)
2. `src/pages/tools/it-bigtech-bonus-comparison.astro` 작성
3. `src/styles/scss/pages/_it-bigtech-bonus-comparison.scss` 작성 + `app.scss` import 추가
4. `public/scripts/it-bigtech-bonus-comparison.js` 작성
5. `src/data/tools.ts` 등록
6. `public/sitemap.xml` URL 추가
7. `src/pages/index.astro` `topicBySlug` 등록
8. `npm run build` 성공 확인

---

## 16. QA 체크리스트

### 콘텐츠 QA

- [ ] H1/title/description에 5사 이름 모두 포함
- [ ] 각 회사 카드에 추정/시뮬레이션 배지 표시
- [ ] 스톡 보상 섹션이 수치 없이 정성 설명으로만 구성
- [ ] 쿠팡 현금 성과급 과소평가 주의 문구 포함
- [ ] 라인 환율 영향 안내 포함
- [ ] FAQ 7개 이상, SeoContent intro 5문단/800자 이상

### UX QA

- [ ] 연봉 변경 시 월급 자동 갱신 정상 동작
- [ ] 5사 모드 전환(연봉%/월배수/고정) 각각 정상 동작
- [ ] KPI 4개 카드 실시간 갱신
- [ ] 결과 표 5행 정상 렌더링, 세후 최고 행 `is-best` 하이라이트
- [ ] Chart.js 5개 그룹 바 차트 정상 렌더링
- [ ] 모바일에서 aside 회사 패널 단일 컬럼 레이아웃 정상

### 기술 QA

- [ ] `npm run build` 성공, `/tools/it-bigtech-bonus-comparison/` 라우트 생성
- [ ] `tools.ts`, `sitemap.xml`, `app.scss`, `index.astro` 등록 확인
- [ ] 관련 링크 404 없음
