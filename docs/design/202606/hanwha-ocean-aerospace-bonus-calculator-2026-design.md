# 한화오션·한화에어로스페이스 성과급 계산기 — 설계 문서

> 기획 원문: `docs/plan/202606/hanwha-ocean-aerospace-bonus-calculator-2026-plan.md`
> 작성일: 2026-06-15
> 구현 기준: Codex/Claude가 이 문서만 보고 `/tools/hanwha-bonus-calculator/` 페이지 구현에 착수할 수 있는 수준
> 참고 페이지: `posco-bonus-calculator`(설계, 계열사 선택 패턴), `doosan-enerbility-bonus-calculator`(설계), `semiconductor-bonus-comparison`

---

## 1. 문서 개요

### 1-1. 대상

- 구현 대상: `한화오션·한화에어로스페이스 성과급 계산기 2026`
- 콘텐츠 유형: 계산기 (tool)
- slug: `hanwha-bonus-calculator`
- URL: `/tools/hanwha-bonus-calculator/`

### 1-2. 문서 역할

- 기획 문서를 기준으로 데이터 스키마, 페이지 섹션, 입출력, CTA, 스타일 prefix, QA를 구현 단위로 고정한다.
- 단일 페이지에서 두 회사(한화오션/한화에어로스페이스)를 **탭으로 전환**하는 구조로, `doosan-enerbility-bonus-calculator`의 단독 계산기 코드(연봉/월급 입력, 입력 모드 3종, 세금 모드 2종, 시나리오 표)를 기반으로 탭 전환 시 회사별 기본값/문구만 교체하는 방식으로 구현한다.

### 1-3. 페이지 성격

- **탭형 단독 계산기**: 한화오션(조선) / 한화에어로스페이스(방산) 2개 탭, 각 탭은 독립된 회사 설정값을 가짐
- **탭 전환 정책**: 탭 전환 시 입력값은 해당 회사의 기본값으로 **리셋**된다 (기획 문서 9번 QA/리스크 — 사용자 혼란 방지를 위해 유지 대신 리셋 채택)
- **사용자 입력 기준 시뮬레이션**: 두 회사 모두 성과급률 기본값은 추정값이며 사용자가 직접 조정 가능
- **업종 사이클 설명**: 조선(수주 사이클)과 방산(수출 실적) 특성 차이를 `recentTrendNote`/`structureSummary`로 구분 설명, 과도한 "호재성" 표현 금지

### 1-4. 권장 파일 구조

```txt
src/
  data/
    hanwhaBonusCalculator2026.ts
  pages/
    tools/
      hanwha-bonus-calculator.astro

public/
  scripts/
    hanwha-bonus-calculator.js
  og/
    tools/
      hanwha-bonus-calculator.png

src/styles/scss/pages/
  _hanwha-bonus-calculator.scss
```

필수 등록: `src/data/tools.ts`, `src/styles/app.scss`, `public/sitemap.xml`, `src/pages/index.astro`(`topicBySlug`)

---

## 2. SEO 설계

### 2-1. 메타

```ts
title: "한화오션·한화에어로스페이스 성과급 계산기｜PS 세전·세후 계산 2026"
description: "한화오션(조선)과 한화에어로스페이스(방산) 성과급(PS)을 연봉 기준으로 계산해보세요. 탭으로 회사를 전환하고, 지급률을 직접 조정해 세전·세후 예상액을 확인할 수 있습니다."
ogImage: "/og/tools/hanwha-bonus-calculator.png"
```

### 2-2. 키워드 매핑

| 키워드 | 반영 위치 |
|---|---|
| 한화오션 성과급 | title, H1, 한화오션 탭 |
| 한화오션 성과급 계산기 | title, hero |
| 한화오션 보너스 | FAQ |
| 한화에어로스페이스 성과급 | title, H1, 한화에어로스페이스 탭 |
| 한화에어로스페이스 성과급 계산기 | hero |
| 한화 방산 보너스 | FAQ |

---

## 3. 데이터 스키마

### 3-1. `src/data/hanwhaBonusCalculator2026.ts`

```ts
export type HanwhaCompanyId = "hanwhaOcean" | "hanwhaAerospace";
export type BonusInputMode = "salaryPercent" | "monthlyMultiple" | "fixedAmount";
export type TaxMode = "simple" | "manual";

export interface HanwhaCompanyConfig {
  id: HanwhaCompanyId;
  name: string;             // "한화오션" / "한화에어로스페이스"
  industryTag: string;      // "조선" / "방산"
  defaultMode: BonusInputMode;
  defaultSalaryPercent: number;
  defaultMonthlyMultiple: number;
  defaultAnnualSalary: number;  // 탭 전환 시 리셋되는 연봉 기본값
  structureSummary: string;
  caution: string;
  recentTrendNote: string;
}

export const HANWHA_COMPANIES: HanwhaCompanyConfig[] = [
  {
    id: "hanwhaOcean", name: "한화오션", industryTag: "조선",
    defaultMode: "salaryPercent", defaultSalaryPercent: 15, defaultMonthlyMultiple: 1.5,
    defaultAnnualSalary: 60000000,
    structureSummary: "조선 업황·수주 실적에 연동되는 PS 성과급 구조로 알려져 있습니다.",
    caution: "사업부, 직급, 평가 결과에 따라 실제 금액이 달라질 수 있습니다.",
    recentTrendNote: "최근 수주 호조로 업계 성과급 기대감이 높아진 추세로 보입니다 (참고용).",
  },
  {
    id: "hanwhaAerospace", name: "한화에어로스페이스", industryTag: "방산",
    defaultMode: "salaryPercent", defaultSalaryPercent: 20, defaultMonthlyMultiple: 2,
    defaultAnnualSalary: 65000000,
    structureSummary: "방산 수출 실적·이익 목표 달성에 따른 PS 성과급 구조로 알려져 있습니다.",
    caution: "사업부, 직급, 평가 결과에 따라 실제 금액이 달라질 수 있습니다.",
    recentTrendNote: "방산 수출 확대에 따라 실적 개선 기대감이 반영될 수 있습니다 (참고용).",
  },
];

export const HANWHA_SIMPLE_TAX_RATE = 0.22;

export interface HanwhaScenarioRow { rate: number; label: string; }
export const HANWHA_SCENARIO_RATES: HanwhaScenarioRow[] = [
  { rate: 10, label: "10%" },
  { rate: 15, label: "15%" },
  { rate: 20, label: "20%" },
  { rate: 25, label: "25%" },
  { rate: 30, label: "30%" },
];

export interface FaqItem { question: string; answer: string; }
export const HANWHA_BONUS_FAQ: FaqItem[] = [ /* 7개, 본문 13장 참조 */ ];

export interface RelatedLink { href: string; label: string; description: string; }
export const HANWHA_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/shipbuilding-bonus-comparison/", label: "조선업 성과급 비교", description: "조선 대형 3사 성과급 비교" },
  { href: "/reports/corporate-bonus-comparison-2026/", label: "대기업 성과급 비교 리포트", description: "주요 대기업 성과급 발표 동향" },
  { href: "/tools/bonus-after-tax-calculator/", label: "성과급 세후 실수령액 계산기", description: "성과급 세금을 정확히 계산" },
  { href: "/tools/doosan-enerbility-bonus-calculator/", label: "두산에너빌리티 성과급 계산기", description: "에너지 업종 성과급 계산" },
  { href: "/tools/bonus-simulator/", label: "대기업 성과급 시뮬레이터", description: "여러 대기업 성과급 한 번에 비교" },
];
```

### 3-2. 계산 로직

`doosan-enerbility-bonus-calculator`와 동일한 계산식을 회사별로 적용:

```
연간 성과급 세전 = 기준액 × 입력값

  - salaryPercent 모드: 기준액 = 연봉, 입력값 = 지급률(%) / 100
  - monthlyMultiple 모드: 기준액 = 월급(연봉÷12), 입력값 = 배수
  - fixedAmount 모드: 입력값 = 사용자가 입력한 금액 그대로

연봉 대비 비율 = 연간 성과급 세전 / 연봉 × 100
월급 환산 = 연간 성과급 세전 / 월급  (개월치)

세후 추정(simple) = 연간 성과급 세전 × (1 - HANWHA_SIMPLE_TAX_RATE)
세후 추정(manual) = 연간 성과급 세전 × (1 - 사용자 입력 세율 / 100)
```

---

## 4. 페이지 구조

### 4-1. 레이아웃 쉘

`SimpleToolShell.astro` — `resultFirst={true}` + 회사 탭(2개)

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
  HANWHA_COMPANIES,
  HANWHA_SCENARIO_RATES,
  HANWHA_RELATED_LINKS,
} from "../../data/hanwhaBonusCalculator2026";
---
```

### 4-3. 레이아웃 순서

```txt
BaseLayout
  SiteHeader
  SimpleToolShell (calculatorId="hanwha-bonus-calculator" pageClass="hanwha-bonus-page" resultFirst={true})
    slot:hero → CalculatorHero
    [회사 탭: 한화오션 / 한화에어로스페이스]
    slot:actions → ToolActionBar
    slot:aside → 입력 패널
    [결과 우선 패널]
    [A] KPI 핵심 카드 (현재 탭 회사명 표시)
    [B] 다음 계산 CTA (세후·투자)
    [C] 성과급 구조 설명 (현재 탭 회사의 structureSummary/caution)
    [D] 성과급률 시나리오 비교 표 (10/15/20/25/30%)
    [E] 업종 특이사항 (조선 vs 방산 사이클 차이, recentTrendNote)
    [F] 계산 기준 요약
    InfoNotice
    [G] 관련 계산기 그리드
    slot:seo → SeoContent (FAQ 포함, 두 회사 모두 다룸)
```

---

## 5. 회사 탭 설계

```astro
<div class="hbc-tabs" role="tablist" aria-label="회사 선택">
  {HANWHA_COMPANIES.map((c, i) => (
    <button
      type="button"
      class="hbc-tab"
      role="tab"
      data-company={c.id}
      aria-selected={i === 0 ? "true" : "false"}
    >
      <span class="hbc-tab__name">{c.name}</span>
      <span class="hbc-tab__industry">{c.industryTag}</span>
    </button>
  ))}
</div>
```

- 기본 선택: `hanwhaOcean` (배열 첫 번째)
- 탭 클릭 시:
  1. `state.company`를 해당 `id`로 변경
  2. 입력값(연봉, 모드, 지급률, 세금모드)을 해당 회사의 기본값으로 **리셋**
  3. CalculatorHero 서브타이틀, [C]/[E] 섹션 텍스트, KPI 헤딩의 회사명을 갱신
  4. `calculate()` 재실행
- URL 파라미터로 탭 상태 복원 가능 (`?company=hanwhaAerospace`)

---

## 6. 입력 패널 설계 (`slot:aside`)

`doosan-enerbility-bonus-calculator`의 입력 패널과 동일한 구조를 사용하되, 연봉 기본값은 현재 선택된 `HanwhaCompanyConfig.defaultAnnualSalary`, 지급률 기본값은 `defaultSalaryPercent`/`defaultMonthlyMultiple`을 사용한다.

```astro
<div class="stack" id="hanwha-bonus-inputs">

  <!-- 연봉/월급 입력 -->
  <article class="panel">
    <div class="panel-heading">
      <div>
        <p class="panel-heading__eyebrow">빠른 입력</p>
        <h2 class="panel__title">연봉·월급 입력</h2>
      </div>
    </div>

    <div class="form-grid form-grid--compact">
      <label class="field field-span-full">
        <span>연봉 (세전, 연 기준)</span>
        <input id="hanwhaAnnualSalaryInput" type="number" value="60000000" />
        <div class="calc-slider-row">
          <input type="range" id="hanwhaAnnualSalarySlider" class="calc-slider"
            min="30000000" max="150000000" step="1000000" value="60000000" />
          <span id="hanwhaAnnualSalarySliderVal" class="calc-slider-val">6,000만원</span>
        </div>
      </label>

      <label class="field field-span-full">
        <span>월급 (세전, 월 기준)</span>
        <input id="hanwhaMonthlySalaryInput" type="number" value="5000000" />
        <small>연봉 입력 시 자동 계산(연봉÷12)되며, 직접 수정도 가능합니다.</small>
      </label>
    </div>
  </article>

  <!-- 성과급 입력 모드 -->
  <article class="panel">
    <div class="panel-heading">
      <div>
        <p class="panel-heading__eyebrow">성과급 입력 방식</p>
        <h2 class="panel__title">지급 방식 선택</h2>
      </div>
    </div>

    <div class="toggle-grid">
      <label class="mode-chip">
        <input id="modeSalaryPercent" name="hanwhaBonusMode" type="radio" value="salaryPercent" checked />
        <span>연봉 대비 %</span>
      </label>
      <label class="mode-chip">
        <input id="modeMonthlyMultiple" name="hanwhaBonusMode" type="radio" value="monthlyMultiple" />
        <span>월급 × 배수</span>
      </label>
      <label class="mode-chip">
        <input id="modeFixedAmount" name="hanwhaBonusMode" type="radio" value="fixedAmount" />
        <span>금액 직접 입력</span>
      </label>
    </div>

    <div id="hanwhaSalaryPercentBlock">
      <label class="field field-span-full">
        <span>성과급률 (연봉 대비 %)</span>
        <input id="hanwhaSalaryPercentInput" type="number" value="15" min="0" max="100" step="1" />
        <div class="calc-slider-row">
          <input type="range" id="hanwhaSalaryPercentSlider" class="calc-slider" min="0" max="60" step="1" value="15" />
          <span id="hanwhaSalaryPercentSliderVal" class="calc-slider-val">15%</span>
        </div>
      </label>
    </div>

    <div id="hanwhaMonthlyMultipleBlock" hidden>
      <label class="field field-span-full">
        <span>월급 배수 (개월치)</span>
        <input id="hanwhaMonthlyMultipleInput" type="number" value="1.5" min="0" max="6" step="0.1" />
        <div class="calc-slider-row">
          <input type="range" id="hanwhaMonthlyMultipleSlider" class="calc-slider" min="0" max="6" step="0.1" value="1.5" />
          <span id="hanwhaMonthlyMultipleSliderVal" class="calc-slider-val">1.5개월</span>
        </div>
      </label>
    </div>

    <div id="hanwhaFixedAmountBlock" hidden>
      <label class="field field-span-full">
        <span>성과급 금액 (세전, 연간)</span>
        <input id="hanwhaFixedAmountInput" type="number" value="0" min="0" step="100000" />
      </label>
    </div>
  </article>

  <!-- 세금 모드 -->
  <article class="panel">
    <div class="panel-heading">
      <div>
        <p class="panel-heading__eyebrow">세후 계산</p>
        <h2 class="panel__title">세율 적용 방식</h2>
      </div>
    </div>

    <div class="toggle-grid">
      <label class="mode-chip">
        <input id="taxModeSimple" name="hanwhaTaxMode" type="radio" value="simple" checked />
        <span>간이 세율 (22%)</span>
      </label>
      <label class="mode-chip">
        <input id="taxModeManual" name="hanwhaTaxMode" type="radio" value="manual" />
        <span>직접 입력</span>
      </label>
    </div>

    <div id="hanwhaManualTaxBlock" hidden>
      <label class="field field-span-full">
        <span>적용 세율 (%)</span>
        <input id="hanwhaManualTaxInput" type="number" value="22" min="0" max="50" step="0.1" />
      </label>
    </div>
  </article>

  <button id="calcHanwhaBonusBtn" class="button button--primary" type="button">성과급 계산하기</button>

</div>
```

---

## 7. 출력 섹션 설계

### [결과 우선 패널]

```astro
<article class="panel result-priority-panel" id="hanwha-bonus-results">
  <div class="panel-heading">
    <div>
      <p class="panel-heading__eyebrow">결과 먼저 보기</p>
      <h2 class="panel__title">내 예상 성과급</h2>
    </div>
  </div>
  <div class="result-priority-panel__actions">
    <a class="button button--secondary" href="#hanwha-bonus-inputs">조건 다시 입력</a>
    <a class="button button--ghost" href="#hanwha-bonus-details">세부 내역 보기</a>
  </div>
</article>
```

### [A] KPI 핵심 카드

```astro
<section class="hbc-section">
  <div class="hbc-section__head">
    <p class="hbc-section__eyebrow">내 계산 결과</p>
    <h2 id="hanwhaResultHeadline">한화오션 성과급 계산 결과</h2>
    <p class="hbc-section__sub">사용자 입력 기준 시뮬레이션</p>
  </div>
  <div class="kpi-grid">
    <article class="kpi-card kpi-card--accent">
      <p>연간 성과급 (세전)</p>
      <strong id="hanwhaBonusGross">-</strong>
      <span>시뮬레이션</span>
    </article>
    <article class="kpi-card">
      <p>연간 성과급 (세후 추정)</p>
      <strong id="hanwhaBonusNet">-</strong>
      <span>참고값</span>
    </article>
    <article class="kpi-card">
      <p>월급 대비</p>
      <strong id="hanwhaMonthlyRatio">-</strong>
      <span>개월치</span>
    </article>
    <article class="kpi-card">
      <p>연봉 대비 비율</p>
      <strong id="hanwhaAnnualRatio">-</strong>
      <span>참고값</span>
    </article>
  </div>
</section>
```

`#hanwhaResultHeadline`은 탭 전환 시 `"{회사명} 성과급 계산 결과"`로 갱신한다.

### [B] 다음 계산 CTA

```astro
<section class="hbc-next-step" aria-label="계산 결과 다음 단계">
  <p class="hbc-section__eyebrow">지금 바로 이어서</p>
  <div class="hbc-next-step__actions">
    <a id="hanwhaAfterTaxCta" class="button button--primary"
       href={withBase("/tools/bonus-after-tax-calculator/?company=hanwha-ocean")}>
      세후 실수령 계산하기 →
    </a>
    <a id="hanwhaDcaCta" class="button button--secondary"
       href={withBase("/tools/dca-investment-calculator/?m=300000&p=10&a=SP500,NASDAQ100,QQQ&fx=1&div=1")}>
      이 금액 투자하면? →
    </a>
  </div>
  <p class="hbc-next-step__note">성과급 세전 금액을 기준으로 다음 계산기에 자동 반영합니다.</p>
</section>
```

`afterTaxUrl`의 `company` 파라미터는 탭에 따라 `hanwha-ocean` / `hanwha-aerospace`로 변경된다.

### [C] 성과급 구조 설명

```astro
<section class="hbc-section" id="hanwha-bonus-details">
  <div class="hbc-section__head">
    <p class="hbc-section__eyebrow">성과급 구조</p>
    <h2 id="hanwhaStructureTitle">한화오션 성과급(PS)이란?</h2>
  </div>
  <div class="hbc-logic-grid">
    <article class="hbc-logic-card">
      <strong>PS (이익배분제) 구조</strong>
      <p id="hanwhaStructureSummary"></p>
    </article>
    <article class="hbc-logic-card">
      <strong>지급 기준 주의사항</strong>
      <p id="hanwhaCaution"></p>
    </article>
    <article class="hbc-logic-card">
      <strong>연봉 기준인 이유</strong>
      <p>이 계산기는 연봉을 기준으로 지급률(%)을 곱해 산정하는 방식을 기본으로 하며, 월급 배수 또는 금액 직접 입력 방식으로도 계산할 수 있습니다.</p>
    </article>
  </div>
</section>
```

`#hanwhaStructureTitle`, `#hanwhaStructureSummary`, `#hanwhaCaution`은 탭 전환 시 현재 회사의 `name`/`structureSummary`/`caution`으로 갱신한다.

### [D] 성과급률 시나리오 비교 표

```astro
<section class="hbc-section">
  <div class="hbc-section__head">
    <p class="hbc-section__eyebrow">시나리오 비교</p>
    <h2>성과급률별 예상 금액 (현재 연봉 기준)</h2>
  </div>
  <div class="table-wrap">
    <table class="result-table hbc-scenario-table">
      <thead>
        <tr>
          <th>지급률</th>
          <th>연간 성과급 세전</th>
          <th>세후 추정</th>
          <th>월급 대비</th>
        </tr>
      </thead>
      <tbody id="hanwhaScenarioTableBody">
        <!-- JS로 HANWHA_SCENARIO_RATES 5행 렌더링 -->
      </tbody>
    </table>
  </div>
</section>
```

### [E] 업종 특이사항 (조선 vs 방산)

```astro
<section class="hbc-section">
  <div class="hbc-section__head">
    <p class="hbc-section__eyebrow">업종 특이사항</p>
    <h2>조선업과 방산업의 성과급 사이클 차이</h2>
  </div>
  <div class="hbc-logic-grid">
    {HANWHA_COMPANIES.map((c) => (
      <article class="hbc-logic-card" data-company={c.id}>
        <strong>{c.name} ({c.industryTag})</strong>
        <p>{c.recentTrendNote}</p>
      </article>
    ))}
    <article class="hbc-logic-card">
      <strong>조선업 사이클</strong>
      <p>조선업은 수주 실적과 선박 인도 시점에 따라 실적·성과급 규모가 달라지는 것으로 알려져 있습니다.</p>
    </article>
    <article class="hbc-logic-card">
      <strong>방산업 사이클</strong>
      <p>방산업은 해외 수출 계약과 양산 일정에 따라 실적·성과급 규모가 달라지는 것으로 알려져 있습니다.</p>
    </article>
  </div>
</section>
```

> 이 섹션은 탭과 무관하게 두 회사를 항상 함께 보여준다 (비교 정보 제공 목적).

### [F] 계산 기준 요약

```astro
<article class="panel">
  <div class="panel-heading">
    <div>
      <p class="panel-heading__eyebrow">계산 기준</p>
      <h2 class="panel__title">계산 기준 요약</h2>
    </div>
  </div>
  <div class="hbc-logic-grid">
    <article class="hbc-logic-card">
      <strong>연간 성과급 = 연봉 × 지급률(%) (기본 모드)</strong>
      <p>월급 배수 또는 금액 직접 입력 모드로도 계산할 수 있습니다.</p>
    </article>
    <article class="hbc-logic-card">
      <strong>세후는 참고값</strong>
      <p>간이 세율 22% 또는 직접 입력한 세율을 적용한 추정값으로, 실제 세후 금액은 개인 과세표준에 따라 달라집니다.</p>
    </article>
    <article class="hbc-logic-card">
      <strong>탭 전환 시 입력값 리셋</strong>
      <p>회사 탭을 전환하면 해당 회사의 기본 연봉·지급률로 초기화됩니다.</p>
    </article>
    <article class="hbc-logic-card">
      <strong>성과급률 기본값은 추정값</strong>
      <p>보도·업계 추정 기반 시뮬레이션이며 실제 지급률은 사업 실적과 노사 협의에 따라 달라질 수 있습니다.</p>
    </article>
  </div>
</article>
```

### [G] 관련 계산기 그리드

```astro
<section class="hbc-section">
  <div class="hbc-section__head">
    <p class="hbc-section__eyebrow">관련 계산기</p>
    <h2>함께 보면 좋은 계산기</h2>
  </div>
  <div class="hbc-related-grid">
    {HANWHA_RELATED_LINKS.map((link) => (
      <a class="hbc-related-card" href={withBase(link.href)}>
        <strong>{link.label}</strong>
        <span>{link.description}</span>
      </a>
    ))}
  </div>
</section>
```

---

## 8. 인터랙션 설계

### 8-1. 상태 관리

```js
const state = {
  company: "hanwhaOcean",        // "hanwhaOcean" | "hanwhaAerospace"
  annualSalary: 60000000,
  monthlySalary: 5000000,
  bonusMode: "salaryPercent",    // "salaryPercent" | "monthlyMultiple" | "fixedAmount"
  salaryPercent: 15,
  monthlyMultiple: 1.5,
  fixedAmount: 0,
  taxMode: "simple",              // "simple" | "manual"
  manualTaxRate: 22,
};
```

### 8-2. 이벤트 흐름

1. 탭 클릭 → `state.company` 변경 → 해당 `HanwhaCompanyConfig`의 `defaultAnnualSalary`/`defaultSalaryPercent`/`defaultMonthlyMultiple`로 입력값 **리셋** (모드는 `salaryPercent`, 세금모드는 `simple`로도 리셋) → `[A]`/`[C]` 텍스트 갱신 → `calculate()` 재실행
2. 연봉 입력 변경 → 월급 자동 계산(연봉÷12), 슬라이더 동기화
3. `bonusMode` 라디오 변경 → 해당 입력 블록만 표시
4. `taxMode` 라디오 변경 → `manual` 선택 시 세율 입력 블록 표시
5. 슬라이더 ↔ 숫자 입력 양방향 동기화 (`doosan-enerbility-bonus-calculator`와 동일 패턴)
6. `calcHanwhaBonusBtn` 클릭 또는 주요 입력 변경 → `calculate()` 실행
7. `calculate()`:
   - 모드별 세전 성과급 계산
   - 세후 추정 계산
   - KPI 카드 갱신 (헤딩에 현재 회사명 반영)
   - 시나리오 표(10/15/20/25/30%) 리렌더링
   - 다음 계산기 CTA URL prefill (company 파라미터를 현재 탭에 맞게 설정)

### 8-3. CTA URL prefill

```js
const companySlug = state.company === "hanwhaOcean" ? "hanwha-ocean" : "hanwha-aerospace";
const afterTaxUrl = `/tools/bonus-after-tax-calculator/?bonus=${bonusGross}&salary=${annualSalary}&company=${companySlug}`;

const monthlyInvest = Math.min(3000000, Math.max(100000, Math.round((bonusGross / 12) / 50000) * 50000));
const dcaUrl = `/tools/dca-investment-calculator/?m=${monthlyInvest}&p=10&a=SP500,NASDAQ100,QQQ&fx=1&div=1`;
```

### 8-4. URL 파라미터 (공유 링크)

```
/tools/hanwha-bonus-calculator/?company=hanwhaAerospace&salary=70000000&mode=salaryPercent&rate=20&taxMode=simple
```

복원 시: URL 파라미터 → 탭 활성화(`company`) → 나머지 입력값 적용 → `calculate()` 순서로 처리. `company` 파라미터가 없으면 첫 번째 탭(`hanwhaOcean`)을 기본 선택한다.

---

## 9. Chart.js 설계

- 두 회사를 직접 비교하는 차트는 두지 않는다 (탭 전환형 단독 계산기이므로 비교 차트는 `shipbuilding-bonus-comparison`에서 제공).
- 선택 사항: 시나리오 비교 표([D])를 보조하는 막대 차트(`hanwha-scenario-chart`)를 추가할 수 있다. 추가 시 `doosan-enerbility-bonus-calculator-2026-design.md` 8장의 패턴을 그대로 따른다.

---

## 10. 스타일 설계

### 10-1. Prefix

- 페이지 루트: `.hanwha-bonus-page`
- 탭: `.hbc-tabs`, `.hbc-tab`
- 섹션: `.hbc-section`
- 로직 카드: `.hbc-logic-grid`, `.hbc-logic-card`
- 다음 단계 CTA: `.hbc-next-step`
- 관련 계산기: `.hbc-related-grid`, `.hbc-related-card`
- 시나리오 테이블: `.hbc-scenario-table` (공통 `.result-table` 확장)

### 10-2. 시각 톤

- 사이트 기본 톤(blue primary `#1A56DB`) 유지
- 탭 활성 상태: primary 컬러 강조 (`aria-selected="true"`에 밑줄/배경 강조)
- 추정/시뮬레이션 배지: 공통 `.estimate-badge` 클래스 재사용

### 10-3. SCSS 골격

```scss
.hanwha-bonus-page {
  .hbc-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    overflow-x: auto;
  }

  .hbc-tab {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 12px 16px;
    border: 1px solid #E0DFDB;
    border-radius: 10px;
    background: #FFFFFF;
    cursor: pointer;
    font-weight: 600;

    &[aria-selected="true"] {
      border-color: #1A56DB;
      background: #EFF6FF;
      color: #1A56DB;
    }

    .hbc-tab__industry {
      font-size: 0.75rem;
      font-weight: 400;
      color: #6B7280;
    }
  }

  .hbc-section {
    padding: 24px 0;
  }

  .hbc-section__head {
    margin-bottom: 16px;
  }

  .hbc-logic-grid,
  .hbc-related-grid {
    display: grid;
    gap: 10px;
    grid-template-columns: 1fr;
  }

  .hbc-logic-card,
  .hbc-related-card {
    border: 1px solid #E0DFDB;
    border-radius: 10px;
    padding: 16px;
    background: #FFFFFF;
  }

  .hbc-related-card {
    display: grid;
    gap: 6px;
    color: inherit;
    text-decoration: none;

    strong { color: #0F172A; }
    span { color: #64748B; font-size: 0.86rem; }
  }

  .hbc-next-step {
    border: 1px solid #DBEAFE;
    border-radius: 10px;
    background: #EFF6FF;
    padding: 18px;
    margin: 16px 0;
  }

  .hbc-next-step__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 12px 0 8px;
  }

  .hbc-next-step__note {
    font-size: 0.75rem;
    color: #6B7280;
    margin: 0;
  }
}

@media (min-width: 768px) {
  .hanwha-bonus-page {
    .hbc-logic-grid,
    .hbc-related-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
}

@media (min-width: 1024px) {
  .hanwha-bonus-page {
    .hbc-related-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
}
```

---

## 11. `tools.ts` 등록

```ts
{
  slug: "hanwha-bonus-calculator",
  title: "한화오션·한화에어로스페이스 성과급 계산기",
  description: "한화오션(조선)과 한화에어로스페이스(방산)의 성과급(PS)을 탭으로 전환해 계산합니다. 지급률을 직접 조정해 세전·세후 예상액을 확인하세요.",
  category: "bonus",
  order: 4.9,
  badges: ["추정", "시뮬레이션"],
  isNew: true,
}
```

---

## 12. Sitemap / OG

### 12-1. sitemap.xml

```xml
<url>
  <loc>https://bigyocalc.com/tools/hanwha-bonus-calculator/</loc>
  <lastmod>2026-06-15</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

### 12-2. OG 이미지

```txt
public/og/tools/hanwha-bonus-calculator.png
```

텍스트:
- 메인: `한화오션·한화에어로스페이스 성과급 계산기`
- 서브: `PS 세전·세후 계산 2026`

---

## 13. InfoNotice 문구

```astro
<InfoNotice
  title="안내"
  lines={[
    "성과급(PS) 지급률 기본값은 보도·업계 추정 기반 시뮬레이션이며, 실제 지급률은 사업 실적과 노사 협의에 따라 달라집니다.",
    "탭을 전환하면 입력값이 해당 회사의 기본값으로 초기화됩니다.",
    "조선·방산 업종 동향 설명은 일반 참고 정보이며 특정 연도의 성과급을 보장하지 않습니다.",
    "세후 추정값은 개인 과세표준·공제 조건에 따라 실제 수령액과 다를 수 있습니다.",
    "이 계산기는 투자 권유 또는 특정 기업 평가를 목적으로 하지 않습니다.",
  ]}
/>
```

---

## 14. SeoContent (FAQ 포함)

```astro
<SeoContent
  introTitle="한화오션·한화에어로스페이스 성과급 계산기 활용 가이드"
  intro={[
    "이 계산기는 한화오션(조선)과 한화에어로스페이스(방산) 두 회사의 성과급(PS)을 탭으로 전환해 각각 시뮬레이션할 수 있습니다. 탭을 전환하면 해당 회사의 기본 연봉·지급률로 입력값이 초기화됩니다.",
    "한화오션은 조선 업황·수주 실적에 연동되는 PS 성과급 구조로 알려져 있으며, 한화에어로스페이스는 방산 수출 실적·이익 목표 달성도에 연동되는 구조로 알려져 있습니다.",
    "성과급 지급률 기본값(한화오션 15%, 한화에어로스페이스 20%)은 보도·업계 추정 기반 시뮬레이션이며, 직접 입력 모드로 자유롭게 조정할 수 있습니다.",
    "조선업은 수주 실적과 선박 인도 시점에 따라, 방산업은 해외 수출 계약과 양산 일정에 따라 실적과 성과급 규모가 달라지는 사이클을 가진 것으로 알려져 있습니다. 최근 두 업종 모두 수주·수출 호조가 보도되고 있으나, 이는 일반 동향 참고 정보로만 제공됩니다.",
    "세후 추정값은 간이 세율(22%) 또는 직접 입력한 세율을 적용한 참고값입니다. 정확한 세후 금액은 성과급 세후 계산기를 통해 확인하는 것을 권장합니다.",
  ]}
  inputPoints={[
    "상단 탭에서 한화오션 또는 한화에어로스페이스를 선택할 수 있습니다.",
    "탭 전환 시 입력값은 해당 회사의 기본 연봉·지급률로 초기화됩니다.",
    "성과급 입력 방식을 연봉 대비 %, 월급 배수, 금액 직접 입력 중에서 선택할 수 있습니다.",
    "세율은 간이 세율(22%) 또는 직접 입력 중 선택할 수 있습니다.",
    "성과급률별(10/15/20/25/30%) 예상 금액을 표로 비교할 수 있습니다.",
  ]}
  criteria={[
    "연간 성과급(세전) = 연봉 × 지급률(%) (기본 모드 기준)",
    "성과급률 기본값은 회사별로 다르며 보도·업계 추정 기반입니다 (한화오션 15%, 한화에어로스페이스 20%).",
    "세후 추정은 간이 세율(22%) 또는 사용자가 입력한 세율을 적용한 참고값입니다.",
    "조선·방산 업종 동향은 배경 설명으로만 제공되며 계산 결과에 직접 반영되지 않습니다.",
  ]}
  faq={[
    { question: "한화오션 성과급은 어떻게 산정되나요?", answer: "조선 업황과 수주 실적에 연동되는 이익배분제(PS) 구조로 알려져 있습니다. 정확한 산정 기준은 회사 공식 발표를 참고하세요." },
    { question: "한화에어로스페이스 성과급은 어떻게 산정되나요?", answer: "방산 수출 실적과 이익 목표 달성도에 따른 PS 성과급 구조로 알려져 있습니다. 정확한 산정 기준은 회사 공식 발표를 참고하세요." },
    { question: "이 계산기의 성과급률(15%, 20%)은 확정된 수치인가요?", answer: "아니요. 보도·업계 추정 기반 시뮬레이션 기본값이며, 실제 지급률은 사업 실적과 노사 협의에 따라 달라질 수 있습니다. 직접 입력 모드로 원하는 수치를 적용해 보세요." },
    { question: "탭을 전환하면 입력한 값이 사라지나요?", answer: "네. 탭을 전환하면 혼란을 줄이기 위해 해당 회사의 기본 연봉·지급률로 입력값이 초기화됩니다." },
    { question: "최근 수주·수출 호조가 성과급에 반영되나요?", answer: "관련 동향이 보도되고 있으나, 이 계산기는 해당 정보를 성과급 수치 산정에 직접 반영하지 않습니다. 일반 참고 정보로만 안내합니다." },
    { question: "세후로 얼마나 받게 되나요?", answer: "성과급은 근로소득으로 합산 과세됩니다. 이 계산기의 세후 값은 간이 세율(22%) 또는 직접 입력한 세율을 적용한 참고값이며, 정확한 금액은 성과급 세후 계산기를 이용하세요." },
    { question: "다른 조선업체와 비교하려면 어떻게 하나요?", answer: "조선업 성과급 비교 페이지에서 대형 조선 3사의 성과급을 함께 비교해 볼 수 있습니다." },
  ]}
  related={[
    { href: "/tools/shipbuilding-bonus-comparison/", label: "조선업 성과급 비교" },
    { href: "/reports/corporate-bonus-comparison-2026/", label: "2026 대기업 성과급 완전 비교" },
    { href: "/tools/bonus-after-tax-calculator/", label: "성과급 세후 실수령액 계산기" },
    { href: "/tools/doosan-enerbility-bonus-calculator/", label: "두산에너빌리티 성과급 계산기" },
    { href: "/tools/bonus-simulator/", label: "대기업 성과급 시뮬레이터" },
  ]}
/>
```

---

## 15. 구현 순서

1. `src/data/hanwhaBonusCalculator2026.ts` 작성 (2개사 config)
2. `src/pages/tools/hanwha-bonus-calculator.astro` 작성 (`doosan-enerbility-bonus-calculator` 구조 복제 + 탭 마크업 추가)
3. `src/styles/scss/pages/_hanwha-bonus-calculator.scss` 작성 (탭 스타일 포함) 및 `app.scss`에 import 추가
4. `public/scripts/hanwha-bonus-calculator.js` 작성 — 탭 전환 로직(`data-company` 속성 기반) + 계산 로직
5. `src/data/tools.ts`에 항목 등록
6. `public/sitemap.xml`에 URL 추가
7. `src/pages/index.astro`의 `topicBySlug`에 등록
8. OG 이미지 생성 또는 기본 이미지 연결
9. `npm run build` 성공 확인
10. 로컬 확인 후 배포 (특히 탭 전환 시 리셋 동작, FAQ에 두 회사 모두 반영됐는지 확인)

---

## 16. QA 체크리스트

### 콘텐츠 QA

- [ ] H1/title/description에 `한화오션 성과급`, `한화에어로스페이스 성과급` 모두 포함됨
- [ ] `한화오션 보너스`, `한화 방산 보너스` 키워드가 FAQ 등에 포함됨
- [ ] 두 회사 모두 추정/시뮬레이션 배지가 표시됨
- [ ] 조선/방산 업종 설명이 "참고용", "알려져 있다" 톤으로 일관됨, 과도한 호재성 표현 없음
- [ ] FAQ 5개 이상(두 회사 모두 다룸), SeoContent intro 5문단/800자 이상

### UX QA

- [ ] 탭 전환 시 입력값이 해당 회사 기본값으로 리셋됨
- [ ] 탭 전환 시 [A] 헤딩, [C] 구조 설명, CTA의 company 파라미터가 모두 갱신됨
- [ ] 입력 모드(연봉%/월급배수/금액직접) 전환 시 블록이 올바르게 토글됨
- [ ] 세율 모드(간이/직접) 전환 정상 동작
- [ ] 시나리오 비교 표(10~30%)가 현재 탭 기준으로 정상 렌더링됨
- [ ] 모바일에서 탭이 가로 스크롤 없이 또는 자연스러운 가로 스크롤로 동작함

### 기술 QA

- [ ] `npm run build` 성공
- [ ] `/tools/hanwha-bonus-calculator/` 라우트 생성 확인
- [ ] `tools.ts`, `sitemap.xml`, `app.scss` 등록 확인
- [ ] URL 파라미터(`company`, `salary`, `mode`, `rate`, `taxMode`) 공유 링크 복원 정상 동작
- [ ] 링크 404 없음 (`shipbuilding-bonus-comparison`, `doosan-enerbility-bonus-calculator` 등 상호 링크 포함)

---

## 17. 발행 후 관찰 지표

7~14일 기준:

- `/tools/hanwha-bonus-calculator/` 세션 수 및 탭별 사용 비율(가능 시)
- `한화오션 성과급`, `한화에어로스페이스 성과급` 검색어 등장 여부
- CTR 8% 이상 여부
- `/tools/shipbuilding-bonus-comparison/`, `/tools/bonus-after-tax-calculator/` 내부 이동

초기 목표:

- 7일 세션 40 이상
- CTR 8% 이상
- 내부 이동 5건 이상
