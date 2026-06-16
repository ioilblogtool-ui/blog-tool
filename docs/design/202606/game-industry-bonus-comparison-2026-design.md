# 게임업계 4사 성과급 비교 계산기 — 설계 문서

> 기획 원문: `docs/plan/202606/game-industry-bonus-comparison-2026-plan.md`
> 작성일: 2026-06-16
> 구현 기준: Claude/Codex가 이 문서만 보고 `/tools/game-industry-bonus-comparison/` 페이지를 구현할 수 있는 수준
> 참고 페이지: `airline-bonus-comparison` (동일 패턴 — SimpleToolShell + aside 회사 패널 + KPI/표/차트)
> 추가 특징: **변동성 섹션** — 신작 흥행 의존도를 정성 카드로 표현 (수치화 없음)

---

## 1. 문서 개요

### 1-1. 대상

- 구현 대상: `게임업계 4사 성과급 비교 계산기 2026`
- 콘텐츠 유형: 계산기 (tool)
- slug: `game-industry-bonus-comparison`
- URL: `/tools/game-industry-bonus-comparison/`

### 1-2. airline과의 차이점

| 항목 | airline | game |
|------|---------|------|
| 회사 수 | 5사 | 4사 |
| 추가 입력 | 직군 선택 | **없음** |
| 특이 섹션 | 직군별 보상 카드 + 기업 현황 표 | **변동성 설명 카드** + 기업 현황 표 |
| 변동성 카드 | - | 4사 신작 의존도/안정성 정성 비교 |
| 기본 연봉 | 70,000,000 | **80,000,000** (게임업계 평균 기준) |
| 차트 높이 | 260px (5사) | **240px** (4사) |
| prefix | `alb-` | `gbc-` |

### 1-3. 핵심 메시지

> "게임업계 성과급은 신작 흥행 여부에 따라 0%~수백%까지 변동 폭이 크다. 4사 모두 '추정 시뮬레이션'임을 명확히 고지."

### 1-4. 권장 파일 구조

```txt
src/
  data/
    gameIndustryBonusComparison2026.ts
  pages/
    tools/
      game-industry-bonus-comparison.astro

public/
  scripts/
    game-industry-bonus-comparison.js

src/styles/scss/pages/
  _game-industry-bonus-comparison.scss
```

필수 등록: `src/data/tools.ts`, `src/styles/app.scss`, `public/sitemap.xml`, `src/pages/index.astro`(`topicBySlug`)

---

## 2. SEO 설계

### 2-1. 메타

```ts
title: "게임업계 4사 성과급 비교 계산기 2026 (넥슨·넷마블·엔씨소프트·크래프톤)"
description: "넥슨, 넷마블, 엔씨소프트, 크래프톤의 성과급을 같은 연봉 기준으로 비교해보세요. 회사별 지급률을 직접 조정해 세전·세후 예상액과 차이를 확인하고, 신작 흥행에 따른 변동성 특성도 함께 안내합니다."
ogImage: "/og/tools/game-industry-bonus-comparison.png"
```

### 2-2. 키워드 매핑

| 키워드 | 반영 위치 |
|--------|-----------|
| 넥슨 성과급 | title, H1, FAQ, 변동성 카드 |
| 넷마블 성과급 | title, H1, FAQ, 변동성 카드 |
| 엔씨소프트 성과급 | title, H1, FAQ, 변동성 카드 |
| 크래프톤 성과급 | title, H1, FAQ, 변동성 카드 |
| 게임회사 성과급 비교 | description, SeoContent |
| 게임업계 보너스 | SeoContent, FAQ |
| 게임회사 연봉 성과급 | SeoContent |

---

## 3. 데이터 스키마

### 3-1. `src/data/gameIndustryBonusComparison2026.ts` — 전체 코드

```ts
export type GameCompanyId = "nexon" | "netmarble" | "ncsoft" | "krafton";
export type BonusInputMode = "salaryPercent" | "monthlyMultiple" | "fixedAmount";
export type TaxMode = "simple" | "manual";
export type EvidenceBadge = "추정" | "시뮬레이션" | "사용자 입력 기준";

export interface GameCompanyConfig {
  id: GameCompanyId;
  name: string;
  shortName: string;
  defaultMode: BonusInputMode;
  defaultSalaryPercent: number;
  defaultMonthlyMultiple: number;
  defaultFixedAmount: number;
  structureSummary: string;
  volatilityNote: string;
  caution: string;
  badges: EvidenceBadge[];
}

export const GAME_COMPANIES: GameCompanyConfig[] = [
  {
    id: "nexon",
    name: "넥슨",
    shortName: "넥슨",
    defaultMode: "salaryPercent",
    defaultSalaryPercent: 20,
    defaultMonthlyMultiple: 2.0,
    defaultFixedAmount: 0,
    structureSummary: "던전앤파이터 등 주요 IP 실적에 연동된 성과급 구조로 알려져 있습니다.",
    volatilityNote: "기존 IP 매출 안정성이 상대적으로 높아 예측 가능성이 있는 편으로 평가되기도 합니다. 다만 신작 성과에 따라 변동이 생길 수 있습니다.",
    caution: "직군(개발/기획/아트), 스튜디오, 연도별 실적에 따라 성과급 규모가 달라질 수 있습니다.",
    badges: ["추정", "시뮬레이션"],
  },
  {
    id: "netmarble",
    name: "넷마블",
    shortName: "넷마블",
    defaultMode: "salaryPercent",
    defaultSalaryPercent: 10,
    defaultMonthlyMultiple: 1.0,
    defaultFixedAmount: 0,
    structureSummary: "신작 출시 성과와 그룹 전체 실적에 따른 성과급 구조로 알려져 있습니다.",
    volatilityNote: "신작 흥행 여부에 따라 연도별 편차가 큰 편으로 알려져 있습니다. 성과급 지급 여부 자체가 연도마다 달라질 수 있습니다.",
    caution: "직군, 스튜디오, 연도별 실적에 따라 달라질 수 있습니다.",
    badges: ["추정", "시뮬레이션"],
  },
  {
    id: "ncsoft",
    name: "엔씨소프트",
    shortName: "엔씨소프트",
    defaultMode: "salaryPercent",
    defaultSalaryPercent: 10,
    defaultMonthlyMultiple: 1.0,
    defaultFixedAmount: 0,
    structureSummary: "리니지 시리즈 등 핵심 IP 실적과 신작 성과에 연동된 구조로 알려져 있습니다.",
    volatilityNote: "핵심 IP 매출 추세와 신작 흥행 여부에 따라 성과급 규모가 크게 달라질 수 있는 것으로 알려져 있습니다.",
    caution: "직군, 스튜디오, 연도별 실적에 따라 달라질 수 있습니다.",
    badges: ["추정", "시뮬레이션"],
  },
  {
    id: "krafton",
    name: "크래프톤",
    shortName: "크래프톤",
    defaultMode: "salaryPercent",
    defaultSalaryPercent: 25,
    defaultMonthlyMultiple: 2.5,
    defaultFixedAmount: 0,
    structureSummary: "PUBG 등 글로벌 IP 실적에 연동된 성과급 구조로, 업계 내 상대적으로 높은 편으로 언급되기도 합니다.",
    volatilityNote: "글로벌 매출 비중이 높아 환율·해외 시장 상황에 따른 변동성이 있습니다. 글로벌 신작 성과가 성과급 규모에 큰 영향을 미치는 것으로 알려져 있습니다.",
    caution: "직군, 스튜디오, 연도별 실적에 따라 달라질 수 있으며, 글로벌 출시 일정·성과에 따른 변동이 큽니다.",
    badges: ["추정", "시뮬레이션"],
  },
];

export const GAME_SIMPLE_TAX_RATE = 0.22;

export interface GameCompanyProfile {
  id: GameCompanyId;
  averageSalary: string;
  employeeCount: string;
  revenue: string;
  recentBonus: string;
}

export const GAME_COMPANY_PROFILES: GameCompanyProfile[] = [
  { id: "nexon",     averageSalary: "약 1억 2,000만 원",  employeeCount: "약 5,000명 (국내)",  revenue: "약 4조 원 (2024)",            recentBonus: "비공개" },
  { id: "netmarble", averageSalary: "약 8,000만 원",       employeeCount: "약 6,000명",         revenue: "약 2조 5,000억 원 (2024)",    recentBonus: "비공개" },
  { id: "ncsoft",    averageSalary: "약 1억 원",            employeeCount: "약 4,500명",         revenue: "약 1조 7,000억 원 (2024)",    recentBonus: "비공개" },
  { id: "krafton",   averageSalary: "약 1억 5,000만 원+",  employeeCount: "약 4,000명",         revenue: "약 2조 2,000억 원 (2024)",    recentBonus: "비공개" },
];

export const GAME_PROFILE_NOTE =
  "평균연봉·직원수는 사업보고서 및 업계 추정 기반 참고 정보입니다. 매출은 2024년 연간 기준 추정값이며, 성과급은 각 사가 공식 공개한 경우에만 표기하고 비공개 항목은 '비공개'로 표시했습니다.";

export interface FaqItem {
  question: string;
  answer: string;
}

export const GAME_BONUS_FAQ: FaqItem[] = [
  {
    question: "게임회사 성과급은 왜 연도마다 차이가 크나요?",
    answer: "게임업계 성과급은 신작 출시 성과와 기존 IP 매출 추세에 크게 의존합니다. 신작이 흥행하면 수백% 성과급이 지급된 사례도 있지만, 실적이 부진하면 성과급이 지급되지 않을 수도 있어 다른 업종 대비 변동 폭이 큰 편입니다.",
  },
  {
    question: "크래프톤 성과급이 높다는 말이 사실인가요?",
    answer: "크래프톤은 PUBG 글로벌 매출에 연동된 성과급 구조로 알려져 있으며, 업계 내에서 상대적으로 높은 수준으로 언급되기도 합니다. 다만 이는 추정 기반 정보이며 공식 확인된 수치가 아닙니다. 글로벌 신작 성과와 환율에 따라 연도별 편차가 있을 수 있습니다.",
  },
  {
    question: "넥슨과 크래프톤 중 성과급이 더 높은 곳은 어디인가요?",
    answer: "연도와 신작 성과에 따라 달라집니다. 이 계산기는 동일한 연봉·지급률 가정 하에서의 비교용 시뮬레이션만 제공합니다. 실제 수령액은 개인 평가, 소속 스튜디오, 연도별 실적에 따라 크게 달라집니다.",
  },
  {
    question: "이 계산기의 기본 성과급률은 공식 수치인가요?",
    answer: "아니요. 보도·업계 추정 기반 시뮬레이션 기본값이며, 각 회사의 공식 지급률이 아닙니다. 알고 계신 수치가 있다면 직접 입력 모드로 조정해 사용하세요.",
  },
  {
    question: "게임 개발자와 기획자 성과급은 차이가 있나요?",
    answer: "직군별 성과급 차이에 대한 공식 데이터가 없어 이 계산기에서는 직군 구분 없이 동일한 연봉 대비 지급률로 계산합니다. 실제로는 직군·직급·소속 스튜디오·기여도에 따라 차이가 있을 수 있습니다.",
  },
  {
    question: "엔씨소프트 성과급은 최근 어떤 추세인가요?",
    answer: "엔씨소프트의 성과급 규모는 리니지 시리즈 등 핵심 IP 매출 추세와 신작 성과에 따라 변동하는 것으로 알려져 있습니다. 이 계산기는 추정 기반 시뮬레이션이므로 최신 지급 실적과 다를 수 있습니다.",
  },
  {
    question: "세후 금액은 어떻게 계산되나요?",
    answer: "성과급은 근로소득으로 합산 과세됩니다. 이 계산기의 세후 값은 간편 공제율(22%) 또는 직접 입력한 세율을 적용한 참고값이며, 정확한 세후 금액은 성과급 세후 실수령액 계산기를 이용하세요.",
  },
];

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export const GAME_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/it-bigtech-bonus-comparison/",   label: "국내 빅테크 성과급 비교",    description: "카카오·네이버·토스·라인·쿠팡" },
  { href: "/tools/it-platform-bonus-comparison/",  label: "IT 플랫폼 성과급 비교",      description: "배달·이커머스 포함 IT 업계 비교" },
  { href: "/reports/it-salary-top10/",             label: "국내 IT 연봉 TOP10",         description: "IT 업계 직군별 연봉 순위" },
  { href: "/tools/bonus-after-tax-calculator/",    label: "성과급 세후 실수령액 계산기", description: "성과급 세금을 정확히 계산" },
  { href: "/tools/bonus-simulator/",               label: "대기업 성과급 시뮬레이터",   description: "여러 대기업 성과급 한 번에 비교" },
];
```

### 3-2. 계산 로직

`airline-bonus-comparison`과 동일:

```
연간 성과급(세전) = 기준액 × 입력값
  - salaryPercent: 연봉 × 지급률(%) / 100
  - monthlyMultiple: 월급(연봉÷12) × 배수
  - fixedAmount: 사용자 입력 금액

연간 성과급(세후) = 세전 × (1 - 세율)
월평균 환산 = 세전 / 12
총보상(세전) = 연봉 + 세전 성과급
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
  GAME_COMPANIES,
  GAME_BONUS_FAQ,
  GAME_RELATED_LINKS,
  GAME_COMPANY_PROFILES,
  GAME_PROFILE_NOTE,
} from "../../data/gameIndustryBonusComparison2026";

const normalizedBase = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;
const withBase = (path: string) => `${normalizedBase}${path.replace(/^\//, "")}`;

const config = { companies: GAME_COMPANIES };
---
```

### 4-3. 레이아웃 순서

```txt
BaseLayout
  SiteHeader
  SimpleToolShell (calculatorId="game-industry-bonus-comparison" pageClass="gbc-page" resultFirst={false})
    slot:hero → CalculatorHero + 배지 + InfoNotice
    slot:actions → ToolActionBar
    slot:aside → 입력 패널 (연봉/월급/세율 + 4사 패널)
    [A] KPI 핵심 비교 카드 (4개)
    [B] 4사 비교 결과 표
    [C] 4사 비교 바 차트
    [D] 변동성 설명 카드 (4사)
    [E] 기업 현황 참고 표
    [F] 관련 계산기 그리드
    slot:seo → SeoContent
```

---

## 5. 입력 패널 설계 (`slot:aside`)

```astro
<section class="gbc-calculator" data-gbc-calculator>
  <!-- 공통 입력 -->
  <article class="panel gbc-input-panel">
    <div class="panel-heading">
      <div>
        <p class="panel-heading__eyebrow">기준 입력</p>
        <h2 class="panel__title">같은 조건으로 맞추기</h2>
      </div>
      <p class="panel-heading__summary">연봉과 월 기본급을 먼저 맞춘 뒤 회사별 성과급 방식을 조정하세요.</p>
    </div>
    <div class="form-grid">
      <label class="field" for="gbcAnnualSalary">
        <span>기준 연봉</span>
        <input id="gbcAnnualSalary" data-gbc-annual-salary type="text" inputmode="numeric" value="80,000,000" />
        <small>게임업계 평균 연봉(추정) 기준이며, 성과급 포함 전 연봉입니다.</small>
      </label>
      <label class="field" for="gbcMonthlySalary">
        <span>월 기본급</span>
        <input id="gbcMonthlySalary" data-gbc-monthly-salary type="text" inputmode="numeric" value="6,666,667" />
        <small data-gbc-monthly-hint>연봉을 바꾸면 자동 갱신됩니다.</small>
      </label>
      <button class="button button--secondary" type="button" data-gbc-reset-monthly>
        연봉 기준으로 다시 계산
      </button>
      <label class="field" for="gbcTaxMode">
        <span>세후 계산 방식</span>
        <select id="gbcTaxMode" data-gbc-tax-mode>
          <option value="simple" selected>간편 추정 (22%)</option>
          <option value="manual">직접 세율 입력</option>
        </select>
      </label>
      <label class="field" for="gbcManualTaxRate">
        <span>직접 공제율 (%)</span>
        <input id="gbcManualTaxRate" data-gbc-manual-tax-rate type="number" min="0" max="60" step="0.1" value="22" />
        <small>직접 세율 입력 모드에서 사용합니다.</small>
      </label>
    </div>
  </article>

  <!-- 4사별 성과급 입력 -->
  <article class="panel gbc-company-inputs">
    <div class="panel-heading">
      <div>
        <p class="panel-heading__eyebrow">회사별 가정</p>
        <h2 class="panel__title">성과급 방식 입력</h2>
      </div>
      <p class="panel-heading__summary">기본값은 추정 시뮬레이션 값입니다. 알고 있는 지급 기준으로 직접 수정하세요.</p>
    </div>
    <div class="gbc-company-panel-list">
      {GAME_COMPANIES.map((company) => (
        <section class="gbc-company-panel" data-gbc-company-panel={company.id}>
          <div class="gbc-company-panel__head">
            <div>
              <strong>{company.name}</strong>
              <span>{company.structureSummary}</span>
            </div>
            <div class="gbc-company-panel__badges">
              {company.badges.map((badge) => <span>{badge}</span>)}
            </div>
          </div>
          <div class="gbc-company-panel__inputs">
            <label class="field" for={`gbcMode-${company.id}`}>
              <span>성과급 방식</span>
              <select id={`gbcMode-${company.id}`} data-gbc-mode={company.id}>
                <option value="salaryPercent" selected={company.defaultMode === "salaryPercent"}>연봉 대비 %</option>
                <option value="monthlyMultiple" selected={company.defaultMode === "monthlyMultiple"}>월급 n개월</option>
                <option value="fixedAmount" selected={company.defaultMode === "fixedAmount"}>고정 금액</option>
              </select>
            </label>
            <label class="field" for={`gbcPercent-${company.id}`} data-gbc-field-group={company.id} data-gbc-field-mode="salaryPercent">
              <span>성과급률 (%)</span>
              <input id={`gbcPercent-${company.id}`} data-gbc-salary-percent={company.id} type="number" min="0" max="300" step="0.5" value={company.defaultSalaryPercent} />
            </label>
            <label class="field" for={`gbcMultiple-${company.id}`} data-gbc-field-group={company.id} data-gbc-field-mode="monthlyMultiple">
              <span>월급 개월 수</span>
              <input id={`gbcMultiple-${company.id}`} data-gbc-monthly-multiple={company.id} type="number" min="0" max="36" step="0.1" value={company.defaultMonthlyMultiple} />
            </label>
            <label class="field" for={`gbcFixed-${company.id}`} data-gbc-field-group={company.id} data-gbc-field-mode="fixedAmount">
              <span>고정 성과급</span>
              <input id={`gbcFixed-${company.id}`} data-gbc-fixed-amount={company.id} type="text" inputmode="numeric" value="0" />
            </label>
          </div>
          <p class="gbc-company-panel__caution">{company.caution}</p>
        </section>
      ))}
    </div>
  </article>
</section>
```

> **airline과의 차이**: 직군 선택 select 없음 (게임업계는 직군별 공식 지급 데이터 없음)
> **airline과의 차이**: `salaryPercent` max를 300으로 확장 (게임업계 극단적 케이스 대비), `monthlyMultiple` max를 36으로 확장

---

## 6. 출력 섹션 설계

### [A] KPI 카드

```astro
<section class="gbc-results">
  <div class="gbc-section-head">
    <p class="gbc-section-head__eyebrow">핵심 결과</p>
    <h2>게임업계 4사 성과급 비교</h2>
    <p>입력값을 바꾸면 결과가 바로 갱신됩니다. 모든 금액은 사용자 입력 기준 시뮬레이션입니다.</p>
  </div>
  <div class="gbc-kpi-grid">
    <article class="gbc-kpi-card">
      <span>최고 예상 세후 성과급</span>
      <strong data-gbc-best-net>-</strong>
      <small data-gbc-best-net-company>-</small>
    </article>
    <article class="gbc-kpi-card">
      <span>4사 간 최대 차이 (세전)</span>
      <strong data-gbc-max-gap>-</strong>
      <small>4사 비교 기준</small>
    </article>
    <article class="gbc-kpi-card">
      <span>월평균 차이</span>
      <strong data-gbc-monthly-gap>-</strong>
      <small>12개월 환산</small>
    </article>
    <article class="gbc-kpi-card">
      <span>성과급 포함 최고 총보상</span>
      <strong data-gbc-best-total>-</strong>
      <small data-gbc-best-total-company>-</small>
    </article>
  </div>
</section>
```

### [B] 비교 결과 표

```astro
<section class="gbc-result-section">
  <div class="gbc-section-head">
    <p class="gbc-section-head__eyebrow">회사별 표</p>
    <h2>세전·세후·월평균 환산</h2>
  </div>
  <div class="gbc-table-wrap">
    <table class="gbc-result-table">
      <caption>게임업계 4사 성과급 비교 결과 표</caption>
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
      <tbody data-gbc-result-table></tbody>
    </table>
  </div>
  <p class="gbc-footnote">예상 세후 금액은 간편 공제율(또는 직접 입력한 공제율)을 적용한 추정값입니다. 실제 통장 입금액은 지급월 급여, 부양가족, 비과세 항목, 4대보험, 연말정산 결과에 따라 달라질 수 있습니다.</p>
</section>
```

### [C] 비교 차트

```astro
<section class="gbc-chart-section">
  <div class="gbc-section-head">
    <p class="gbc-section-head__eyebrow">시각화</p>
    <h2>4사 세전·세후 성과급 비교</h2>
  </div>
  <div class="gbc-chart-wrap">
    <canvas id="gbcCompareChart" aria-label="게임업계 4사 성과급 비교 차트" role="img"></canvas>
  </div>
</section>
```

### [D] 변동성 설명 카드 (핵심 차별 섹션)

```astro
<section class="gbc-volatility-section">
  <div class="gbc-section-head">
    <p class="gbc-section-head__eyebrow">변동성 안내</p>
    <h2>회사별 성과급 변동성 특성</h2>
    <p>아래 내용은 업계 추정 기반 정성 안내입니다. 신작 출시 결과에 따라 실제와 다를 수 있습니다.</p>
  </div>
  <div class="gbc-volatility-grid">
    {GAME_COMPANIES.map((company) => (
      <article class="gbc-volatility-card">
        <div class="gbc-volatility-card__head">
          <strong>{company.name}</strong>
          <div class="gbc-volatility-card__badges">
            {company.badges.map((badge) => <span>{badge}</span>)}
          </div>
        </div>
        <p>{company.volatilityNote}</p>
        <p class="gbc-volatility-card__caution">{company.caution}</p>
      </article>
    ))}
  </div>
</section>
```

### [E] 기업 현황 참고 표

```astro
<section class="gbc-profile-section">
  <div class="gbc-section-head">
    <p class="gbc-section-head__eyebrow">기업 현황 (참고)</p>
    <h2>게임업계 4사 평균연봉·규모 비교</h2>
    <p>업계 추정 및 공개 정보 기반 참고 자료입니다.</p>
  </div>
  <div class="gbc-table-wrap">
    <table class="gbc-result-table gbc-profile-table">
      <caption>게임업계 4사 기업 현황 비교 표</caption>
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
        {GAME_COMPANIES.map((company) => {
          const profile = GAME_COMPANY_PROFILES.find((p) => p.id === company.id);
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
  <p class="gbc-footnote">{GAME_PROFILE_NOTE}</p>
</section>
```

### [F] 관련 계산기 그리드

```astro
<section class="gbc-related">
  <div class="gbc-section-head">
    <p class="gbc-section-head__eyebrow">다음 단계</p>
    <h2>함께 보면 좋은 계산기</h2>
  </div>
  <div class="gbc-related-grid">
    {GAME_RELATED_LINKS.map((link) => (
      <a class="gbc-related-card" href={withBase(link.href)}>
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
  annualSalary: 80_000_000,
  monthlySalary: Math.round(80_000_000 / 12),
  monthlySalaryTouched: false,
  taxMode: "simple",
  manualTaxRate: 0.22,
  companies: {
    nexon:     { mode: "salaryPercent", salaryPercent: 20,  monthlyMultiple: 2.0, fixedAmount: 0 },
    netmarble: { mode: "salaryPercent", salaryPercent: 10,  monthlyMultiple: 1.0, fixedAmount: 0 },
    ncsoft:    { mode: "salaryPercent", salaryPercent: 10,  monthlyMultiple: 1.0, fixedAmount: 0 },
    krafton:   { mode: "salaryPercent", salaryPercent: 25,  monthlyMultiple: 2.5, fixedAmount: 0 },
  },
};
```

### 7-2. data-attribute 매핑

| 요소 | data-attribute |
|------|---------------|
| 계산기 루트 | `data-gbc-calculator` |
| 연봉 input | `data-gbc-annual-salary` |
| 월급 input | `data-gbc-monthly-salary` |
| 월급 힌트 | `data-gbc-monthly-hint` |
| 월급 리셋 | `data-gbc-reset-monthly` |
| 세율 모드 | `data-gbc-tax-mode` |
| 직접 세율 | `data-gbc-manual-tax-rate` |
| 회사 모드 | `data-gbc-mode="{id}"` |
| 회사 지급률 | `data-gbc-salary-percent="{id}"` |
| 회사 월배수 | `data-gbc-monthly-multiple="{id}"` |
| 회사 고정금액 | `data-gbc-fixed-amount="{id}"` |
| 입력 필드 그룹 | `data-gbc-field-group="{id}" data-gbc-field-mode="{mode}"` |
| KPI 세후 최고 | `data-gbc-best-net` |
| KPI 세후 최고 회사 | `data-gbc-best-net-company` |
| KPI 최대 차이 | `data-gbc-max-gap` |
| KPI 월평균 차이 | `data-gbc-monthly-gap` |
| KPI 총보상 최고 | `data-gbc-best-total` |
| KPI 총보상 최고 회사 | `data-gbc-best-total-company` |
| 결과 표 tbody | `data-gbc-result-table` |

### 7-3. 스크립트 구조 (`public/scripts/game-industry-bonus-comparison.js`)

`airline-bonus-comparison.js`와 동일 구조. prefix `alb` → `gbc`, 직군 선택 이벤트 제거.

```js
import { buildDefaultOptions, makeLabelPlugin, formatKRW } from "./chart-config.js";

(() => {
  const configEl = document.getElementById("gbcConfig");
  const root = document.querySelector("[data-gbc-calculator]");
  if (!configEl || !root) return;

  const config = JSON.parse(configEl.textContent || "{}");
  const companies = Array.isArray(config.companies) ? config.companies : [];

  const TAX_RATE_SIMPLE = 0.22;

  const state = {
    annualSalary: 80_000_000,
    monthlySalary: Math.round(80_000_000 / 12),
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

  // els: data-gbc-* 쿼리 (airline 패턴 동일, prefix만 gbc-)
  // formatWon, formatInputNumber, parseNumber, escapeHtml: airline 동일
  // getTaxRate, calculateGrossBonus, getInputLabel, calculateResults: airline 동일
  // syncInputs: data-gbc-field-mode 비교 시 field.dataset.gbcFieldMode 사용
  // renderResults: 4사 결과 → KPI + tbody
  // renderChart: gbcCompareChart, 4사 × 세전/세후 그룹 바
  // resetAll: annualSalary = 80_000_000
  // 이벤트: airline과 동일 패턴 (직군 이벤트 없음)
  // 마지막 줄: update();
})();
```

> **airline과의 핵심 차이**: `field.dataset.albFieldMode` → `field.dataset.gbcFieldMode`
> JS에서 `data-alb-field-mode` 값을 읽을 때 camelCase로 변환됨: `dataset.albFieldMode`
> `gbc-field-mode` → `dataset.gbcFieldMode` 로 동일하게 적용

---

## 8. Chart.js 설계

- 차트: 그룹 바 차트 (`gbcCompareChart`)
- X축: 넥슨 / 넷마블 / 엔씨소프트 / 크래프톤 (`shortName` 사용)
- 데이터셋 2개: "세전 성과급", "세후 추정"
- `gbc-chart-wrap`: `height: 240px` (4개 항목, airline의 260px보다 작게)

---

## 9. 스타일 설계

### 9-1. Prefix: `gbc-`

`_airline-bonus-comparison.scss` 구조를 그대로 복제, prefix `alb` → `gbc`.

차이점:
- `.gbc-volatility-section`, `.gbc-volatility-grid`, `.gbc-volatility-card` 추가 (변동성 설명 섹션)
- `.gbc-job-section` 없음 (직군 섹션 없음)
- 차트 높이: `240px`

```scss
// ── 변동성 설명 섹션 ───────────────────────────────────────────────────────────
.gbc-page .gbc-volatility-section {
  padding: 24px 0;
}

.gbc-page .gbc-volatility-grid {
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr;
}

.gbc-page .gbc-volatility-card {
  border: 1px solid #E0DFDB;
  border-radius: 10px;
  padding: 16px;
  background: #FFFFFF;

  p {
    font-size: 12px;
    color: #5F5E5A;
    line-height: 1.6;
    margin: 0 0 6px;
    &:last-child { margin-bottom: 0; }
  }
}

.gbc-page .gbc-volatility-card__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  strong {
    font-size: 14px;
    font-weight: 500;
    color: #1A1A18;
  }
}

.gbc-page .gbc-volatility-card__badges {
  display: flex;
  gap: 4px;

  span {
    font-size: 10px;
    padding: 2px 8px;
    border-radius: 999px;
    background: #EFF6FF;
    color: #1A56DB;
    white-space: nowrap;
  }
}

.gbc-page .gbc-volatility-card__caution {
  font-size: 11px;
  color: #888780;
  line-height: 1.5;
}

// ── 차트 ──────────────────────────────────────────────────────────────────────
.gbc-page .gbc-chart-wrap {
  position: relative;
  height: 240px;
  overflow: hidden;
  margin-bottom: 8px;
}

// ── 반응형 ────────────────────────────────────────────────────────────────────
@media (min-width: 380px) {
  .gbc-page .gbc-company-panel__inputs {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 560px) {
  .gbc-page .gbc-kpi-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 768px) {
  .gbc-page .gbc-volatility-grid,
  .gbc-page .gbc-related-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .gbc-page .gbc-kpi-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .gbc-page .gbc-volatility-grid,
  .gbc-page .gbc-related-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
```

> **주의**: 변동성 카드는 4개로 고정되므로 1024px에서도 2-col 유지 (3-col 시 레이아웃 비어 보임)

나머지 클래스(`gbc-company-panel-list`, `gbc-kpi-card`, `gbc-result-table`, `gbc-related-card` 등)는 `_airline-bonus-comparison.scss`와 동일 구조, prefix만 변경.

---

## 10. `tools.ts` 등록

```ts
{
  slug: "game-industry-bonus-comparison",
  title: "게임업계 4사 성과급 비교 계산기",
  description: "넥슨·넷마블·엔씨소프트·크래프톤의 성과급을 같은 연봉 기준으로 비교합니다. 회사별 지급률을 직접 조정해 세전·세후 예상액을 확인하고 신작 흥행 의존도 특성도 함께 안내합니다.",
  order: 27.85,
  eyebrow: "게임업계 4사 Tool",
  category: "simulator",
  iframeReady: true,
  badges: ["신규", "추정"],
  previewStats: [
    { label: "비교 대상", value: "4사", context: "넥슨·넷마블·엔씨·크래프톤" },
    { label: "변동성", value: "신작 연동", context: "흥행에 따라 0~수백%" },
  ],
},
```

`index.astro`의 `topicBySlug`에 `"game-industry-bonus-comparison": "성과급 비교"` 추가.

---

## 11. Sitemap

```xml
<url>
  <loc>https://bigyocalc.com/tools/game-industry-bonus-comparison/</loc>
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
    "게임업계 성과급은 신작 흥행 여부에 따라 0%~수백%까지 변동 폭이 매우 크므로, 기본값은 참고용 추정값입니다.",
    "실제 지급액은 직군(개발/기획/아트), 직급, 소속 스튜디오, 개인 평가, 연도별 실적에 따라 크게 달라질 수 있습니다.",
    "이 계산기는 특정 회사에 대한 투자 권유 또는 평가를 목적으로 하지 않습니다.",
  ]}
/>
```

---

## 13. Config 주입

```astro
<script id="gbcConfig" type="application/json" set:html={JSON.stringify(config)}></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
<script type="module" src={withBase("/scripts/game-industry-bonus-comparison.js")}></script>
```

---

## 14. SeoContent 주요 포인트

### introTitle
`"게임업계 4사 성과급 비교 계산기 활용 가이드"`

### intro (5문단, 800자 이상)
1. 이 계산기 소개 — 넥슨·넷마블·엔씨소프트·크래프톤 4사 성과급 비교 도구
2. 게임업계 성과급의 특성 — 신작 의존도, 변동 폭이 큰 이유
3. 4사 성과급 구조 특성 요약 — 넥슨(IP 안정성), 크래프톤(글로벌), 엔씨/넷마블(신작 변동)
4. 계산기 사용 방법 — 연봉 입력, 모드 선택, 실시간 갱신
5. 주의사항 — 추정값, 직군/스튜디오별 편차, 투자 판단 금지

### criteria
- 계산 방식 (모드별 수식)
- 기본값이 추정 기반임을 명시
- 세후 공제율 22% 간편 추정 안내

---

## 15. 구현 순서

1. `src/data/gameIndustryBonusComparison2026.ts` 작성
2. `src/pages/tools/game-industry-bonus-comparison.astro` 작성
3. `src/styles/scss/pages/_game-industry-bonus-comparison.scss` 작성 + `app.scss` import
4. `public/scripts/game-industry-bonus-comparison.js` 작성 (airline에서 prefix 변경, 직군 이벤트 제거)
5. `src/data/tools.ts` 등록 (order 27.85)
6. `public/sitemap.xml` URL 추가
7. `src/pages/index.astro` `topicBySlug` 등록
8. `npm run build` 성공 확인

---

## 16. QA 체크리스트

### 콘텐츠 QA

- [ ] H1/title/description에 4사 이름 모두 포함
- [ ] 각 회사 카드에 추정/시뮬레이션 배지 표시
- [ ] 변동성 카드 4개, `volatilityNote` + `caution` 문구 표시
- [ ] "신작 성과에 따라 변동" 메시지가 InfoNotice + 변동성 섹션 양쪽에 포함
- [ ] 특정 회사 우열 단정 표현 없음 (중립 톤)
- [ ] FAQ 7개, SeoContent intro 5문단/800자 이상

### UX QA

- [ ] 연봉 변경 시 월급 자동 갱신
- [ ] 4사 모드 전환 각각 정상 동작
- [ ] `salaryPercent` max=300, `monthlyMultiple` max=36 범위 정상 작동
- [ ] KPI 4개 카드 실시간 갱신
- [ ] 결과 표 4행 정상 렌더링, 세후 최고 행 `is-best` 하이라이트
- [ ] Chart.js 4개 그룹 바 차트 정상 렌더링

### 기술 QA

- [ ] `npm run build` 성공, `/tools/game-industry-bonus-comparison/` 라우트 생성
- [ ] `tools.ts`, `sitemap.xml`, `app.scss`, `index.astro` 등록 확인
- [ ] 관련 링크 404 없음
- [ ] `data-gbc-field-mode` hidden 전환 정상 작동
