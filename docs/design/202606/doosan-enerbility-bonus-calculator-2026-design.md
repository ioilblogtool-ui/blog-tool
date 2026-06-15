# 두산에너빌리티 성과급 계산기 — 설계 문서

> 기획 원문: `docs/plan/202606/doosan-enerbility-bonus-calculator-2026-plan.md`
> 작성일: 2026-06-15
> 구현 기준: Codex/Claude가 이 문서만 보고 `/tools/doosan-enerbility-bonus-calculator/` 페이지 구현에 착수할 수 있는 수준
> 참고 페이지: `posco-bonus-calculator`(설계), `samsung-bonus`, `bonus-after-tax-calculator`

---

## 1. 문서 개요

### 1-1. 대상

- 구현 대상: `두산에너빌리티 성과급 계산기 2026`
- 콘텐츠 유형: 계산기 (tool)
- slug: `doosan-enerbility-bonus-calculator`
- URL: `/tools/doosan-enerbility-bonus-calculator/`

### 1-2. 문서 역할

- 기획 문서를 기준으로 데이터 스키마, 페이지 섹션, 입출력, CTA, 스타일 prefix, QA를 구현 단위로 고정한다.
- `posco-bonus-calculator`와 동일한 단일 계산기 패턴(연봉/월급 입력 → 성과급률 → 세전/세후)을 재사용하므로, 컴포넌트/스크립트 구조는 포스코 계산기 코드를 복제해 데이터만 교체하는 방식으로 구현한다.

### 1-3. 페이지 성격

- **단독 계산기**: 두산에너빌리티 1개 회사만 다루는 단일 입력형 계산기 (samsung-bonus와 동일 IA)
- **사용자 입력 기준 시뮬레이션**: 성과급률 기본값(15%)은 추정값이며 사용자가 직접 조정 가능
- **원전(SMR) 테마는 배경 설명에 한정**: 성과급 수치 산정에 직접 반영하지 않고, 업종 배경 섹션에서만 "참고 정보"로 다룸 — 투자 권유로 읽히지 않도록 사실 위주 서술

### 1-4. 권장 파일 구조

```txt
src/
  data/
    doosanEnerbilityBonusCalculator2026.ts
  pages/
    tools/
      doosan-enerbility-bonus-calculator.astro

public/
  scripts/
    doosan-enerbility-bonus-calculator.js
  og/
    tools/
      doosan-enerbility-bonus-calculator.png

src/styles/scss/pages/
  _doosan-enerbility-bonus-calculator.scss
```

필수 등록: `src/data/tools.ts`, `src/styles/app.scss`, `public/sitemap.xml`, `src/pages/index.astro`(`topicBySlug`)

---

## 2. SEO 설계

### 2-1. 메타

```ts
title: "두산에너빌리티 성과급 계산기｜PS 세전·세후 계산 2026"
description: "두산에너빌리티 성과급(PS)을 연봉 기준으로 계산해보세요. 지급률 추정값을 직접 조정하고, 세전·세후 체감액과 성과급률별 시나리오를 확인할 수 있습니다."
ogImage: "/og/tools/doosan-enerbility-bonus-calculator.png"
```

### 2-2. 키워드 매핑

| 키워드 | 반영 위치 |
|---|---|
| 두산에너빌리티 성과급 계산기 | title, H1, hero |
| 두산에너빌리티 성과급 | title, 섹션 H2 |
| 두산에너빌리티 보너스 | FAQ |
| 두산 원전 성과급 | 업종 배경 섹션, FAQ |
| 두산에너빌리티 성과급 세후 | 세후 섹션, FAQ |

---

## 3. 데이터 스키마

### 3-1. `src/data/doosanEnerbilityBonusCalculator2026.ts`

```ts
export type BonusInputMode = "salaryPercent" | "monthlyMultiple" | "fixedAmount";
export type TaxMode = "simple" | "manual";

export const DOOSAN_BONUS_DEFAULTS = {
  defaultMode: "salaryPercent" as BonusInputMode,
  defaultSalaryPercent: 15,
  defaultMonthlyMultiple: 1.5,
  defaultFixedAmount: 0,
  structureSummary:
    "사업 부문(원전·에너지·건설 등) 실적과 그룹 평가 기준에 연동되는 성과급 구조로 알려져 있습니다.",
  caution:
    "사업부, 직급, 평가 결과, 노사 협의에 따라 실제 금액이 달라질 수 있습니다.",
  industryNote:
    "최근 원전(SMR) 관련 수주 확대가 보도되고 있으나, 이는 일반 동향 참고 정보이며 성과급 지급률을 보장하지 않습니다.",
};

export const DOOSAN_SIMPLE_TAX_RATE = 0.22;

export interface DoosanScenarioRow {
  rate: number;        // 성과급률 %
  label: string;        // "10%" 등
}

export const DOOSAN_SCENARIO_RATES: DoosanScenarioRow[] = [
  { rate: 10, label: "10%" },
  { rate: 15, label: "15% (기준)" },
  { rate: 20, label: "20%" },
  { rate: 25, label: "25%" },
  { rate: 30, label: "30%" },
];

export interface FaqItem { question: string; answer: string; }
export const DOOSAN_BONUS_FAQ: FaqItem[] = [ /* 7개, 본문 13장 참조 */ ];

export interface RelatedLink { href: string; label: string; description: string; }
export const DOOSAN_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/corporate-bonus-comparison-2026/", label: "대기업 성과급 비교 리포트", description: "주요 대기업 성과급 발표 동향을 한눈에 확인" },
  { href: "/tools/bonus-after-tax-calculator/", label: "성과급 세후 실수령액 계산기", description: "성과급에 대한 세금을 정확히 계산" },
  { href: "/tools/semiconductor-bonus-comparison/", label: "반도체 성과급 비교", description: "삼성전자·SK하이닉스 성과급 비교" },
  { href: "/tools/hanwha-bonus-calculator/", label: "한화오션·한화에어로스페이스 성과급 계산기", description: "조선·방산 업종 성과급 계산" },
  { href: "/tools/bonus-simulator/", label: "대기업 성과급 시뮬레이터", description: "여러 대기업 성과급을 한 번에 비교" },
];
```

### 3-2. 계산 로직

```
연간 성과급 세전 = 기준액 × 입력값

  - salaryPercent 모드: 기준액 = 연봉, 입력값 = 지급률(%) / 100
  - monthlyMultiple 모드: 기준액 = 월급, 입력값 = 배수
  - fixedAmount 모드: 입력값 = 사용자가 입력한 금액 그대로

연봉 대비 비율 = 연간 성과급 세전 / 연봉 × 100
월급 환산 = 연간 성과급 세전 / 월급  (개월치)

세후 추정(simple 모드) = 연간 성과급 세전 × (1 - DOOSAN_SIMPLE_TAX_RATE)
세후 추정(manual 모드) = 연간 성과급 세전 × (1 - 사용자 입력 세율 / 100)
```

> 세전/세후 계산 로직은 `posco-bonus-calculator`와 동일한 함수를 복제하여 사용한다. `DOOSAN_SIMPLE_TAX_RATE = 0.22` 단일값을 사용하며(LG식 누진 세율 함수 미적용), `manual` 모드에서는 사용자가 직접 세율(%)을 입력할 수 있다.

---

## 4. 페이지 구조

### 4-1. 레이아웃 쉘

`SimpleToolShell.astro` — `resultFirst={true}` (samsung-bonus / posco-bonus-calculator와 동일 패턴)

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
  DOOSAN_BONUS_DEFAULTS,
  DOOSAN_SCENARIO_RATES,
  DOOSAN_RELATED_LINKS,
} from "../../data/doosanEnerbilityBonusCalculator2026";
---
```

### 4-3. 레이아웃 순서

```txt
BaseLayout
  SiteHeader
  SimpleToolShell (calculatorId="doosan-enerbility-bonus-calculator" pageClass="doosan-bonus-page" resultFirst={true})
    slot:hero → CalculatorHero
    slot:actions → ToolActionBar
    slot:aside → 입력 패널
    [결과 우선 패널]
    [A] KPI 핵심 카드
    [B] 다음 계산 CTA (세후·투자)
    [C] 성과급 구조 설명
    [D] 성과급률 시나리오 비교 표 (10/15/20/25/30%)
    [E] 업종 배경 설명 (원전/에너지)
    [F] 계산 기준 요약
    InfoNotice
    [G] 관련 계산기 그리드
    slot:seo → SeoContent (FAQ 포함)
```

---

## 5. 입력 패널 설계 (`slot:aside`)

```astro
<div class="stack" id="doosan-bonus-inputs">

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
        <input id="doosanAnnualSalaryInput" type="number" value="65000000" />
        <div class="calc-slider-row">
          <input type="range" id="doosanAnnualSalarySlider" class="calc-slider"
            min="30000000" max="150000000" step="1000000" value="65000000" />
          <span id="doosanAnnualSalarySliderVal" class="calc-slider-val">6,500만원</span>
        </div>
      </label>

      <label class="field field-span-full">
        <span>월급 (세전, 월 기준)</span>
        <input id="doosanMonthlySalaryInput" type="number" value="5400000" />
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
        <input id="modeSalaryPercent" name="doosanBonusMode" type="radio" value="salaryPercent" checked />
        <span>연봉 대비 %</span>
      </label>
      <label class="mode-chip">
        <input id="modeMonthlyMultiple" name="doosanBonusMode" type="radio" value="monthlyMultiple" />
        <span>월급 × 배수</span>
      </label>
      <label class="mode-chip">
        <input id="modeFixedAmount" name="doosanBonusMode" type="radio" value="fixedAmount" />
        <span>금액 직접 입력</span>
      </label>
    </div>

    <!-- salaryPercent -->
    <div id="doosanSalaryPercentBlock">
      <label class="field field-span-full">
        <span>성과급률 (연봉 대비 %)</span>
        <input id="doosanSalaryPercentInput" type="number" value="15" min="0" max="100" step="1" />
        <div class="calc-slider-row">
          <input type="range" id="doosanSalaryPercentSlider" class="calc-slider" min="0" max="60" step="1" value="15" />
          <span id="doosanSalaryPercentSliderVal" class="calc-slider-val">15%</span>
        </div>
      </label>
    </div>

    <!-- monthlyMultiple -->
    <div id="doosanMonthlyMultipleBlock" hidden>
      <label class="field field-span-full">
        <span>월급 배수 (개월치)</span>
        <input id="doosanMonthlyMultipleInput" type="number" value="1.5" min="0" max="6" step="0.1" />
        <div class="calc-slider-row">
          <input type="range" id="doosanMonthlyMultipleSlider" class="calc-slider" min="0" max="6" step="0.1" value="1.5" />
          <span id="doosanMonthlyMultipleSliderVal" class="calc-slider-val">1.5개월</span>
        </div>
      </label>
    </div>

    <!-- fixedAmount -->
    <div id="doosanFixedAmountBlock" hidden>
      <label class="field field-span-full">
        <span>성과급 금액 (세전, 연간)</span>
        <input id="doosanFixedAmountInput" type="number" value="0" min="0" step="100000" />
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
        <input id="taxModeSimple" name="doosanTaxMode" type="radio" value="simple" checked />
        <span>간이 세율 (22%)</span>
      </label>
      <label class="mode-chip">
        <input id="taxModeManual" name="doosanTaxMode" type="radio" value="manual" />
        <span>직접 입력</span>
      </label>
    </div>

    <div id="doosanManualTaxBlock" hidden>
      <label class="field field-span-full">
        <span>적용 세율 (%)</span>
        <input id="doosanManualTaxInput" type="number" value="22" min="0" max="50" step="0.1" />
      </label>
    </div>
  </article>

  <button id="calcDoosanBonusBtn" class="button button--primary" type="button">성과급 계산하기</button>

</div>
```

---

## 6. 출력 섹션 설계

### [결과 우선 패널]

```astro
<article class="panel result-priority-panel" id="doosan-bonus-results">
  <div class="panel-heading">
    <div>
      <p class="panel-heading__eyebrow">결과 먼저 보기</p>
      <h2 class="panel__title">내 예상 성과급</h2>
    </div>
  </div>
  <div class="result-priority-panel__actions">
    <a class="button button--secondary" href="#doosan-bonus-inputs">조건 다시 입력</a>
    <a class="button button--ghost" href="#doosan-bonus-details">세부 내역 보기</a>
  </div>
</article>
```

### [A] KPI 핵심 카드

```astro
<section class="dbc-section">
  <div class="dbc-section__head">
    <p class="dbc-section__eyebrow">내 계산 결과</p>
    <h2>두산에너빌리티 성과급 계산 결과</h2>
    <p class="dbc-section__sub">사용자 입력 기준 시뮬레이션</p>
  </div>
  <div class="kpi-grid">
    <article class="kpi-card kpi-card--accent">
      <p>연간 성과급 (세전)</p>
      <strong id="doosanBonusGross">-</strong>
      <span>시뮬레이션</span>
    </article>
    <article class="kpi-card">
      <p>연간 성과급 (세후 추정)</p>
      <strong id="doosanBonusNet">-</strong>
      <span>참고값</span>
    </article>
    <article class="kpi-card">
      <p>월급 대비</p>
      <strong id="doosanMonthlyRatio">-</strong>
      <span>개월치</span>
    </article>
    <article class="kpi-card">
      <p>연봉 대비 비율</p>
      <strong id="doosanAnnualRatio">-</strong>
      <span>참고값</span>
    </article>
  </div>
</section>
```

### [B] 다음 계산 CTA

```astro
<section class="dbc-next-step" aria-label="계산 결과 다음 단계">
  <p class="dbc-section__eyebrow">지금 바로 이어서</p>
  <div class="dbc-next-step__actions">
    <a id="doosanAfterTaxCta" class="button button--primary"
       href={withBase("/tools/bonus-after-tax-calculator/?company=doosan-enerbility")}>
      세후 실수령 계산하기 →
    </a>
    <a id="doosanDcaCta" class="button button--secondary"
       href={withBase("/tools/dca-investment-calculator/?m=300000&p=10&a=SP500,NASDAQ100,QQQ&fx=1&div=1")}>
      이 금액 투자하면? →
    </a>
  </div>
  <p class="dbc-next-step__note">성과급 세전 금액을 기준으로 다음 계산기에 자동 반영합니다.</p>
</section>
```

### [C] 성과급 구조 설명

```astro
<section class="dbc-section" id="doosan-bonus-details">
  <div class="dbc-section__head">
    <p class="dbc-section__eyebrow">성과급 구조</p>
    <h2>두산에너빌리티 성과급(PS)이란?</h2>
  </div>
  <div class="dbc-logic-grid">
    <article class="dbc-logic-card">
      <strong>PS (이익배분제) 구조</strong>
      <p>{DOOSAN_BONUS_DEFAULTS.structureSummary}</p>
    </article>
    <article class="dbc-logic-card">
      <strong>지급 기준 주의사항</strong>
      <p>{DOOSAN_BONUS_DEFAULTS.caution}</p>
    </article>
    <article class="dbc-logic-card">
      <strong>연봉 기준인 이유</strong>
      <p>이 계산기는 연봉을 기준으로 지급률(%)을 곱해 산정하는 방식을 기본으로 하며, 월급 배수 또는 금액 직접 입력 방식으로도 계산할 수 있습니다.</p>
    </article>
  </div>
</section>
```

### [D] 성과급률 시나리오 비교 표

```astro
<section class="dbc-section">
  <div class="dbc-section__head">
    <p class="dbc-section__eyebrow">시나리오 비교</p>
    <h2>성과급률별 예상 금액 (현재 연봉 기준)</h2>
  </div>
  <div class="table-wrap">
    <table class="result-table dbc-scenario-table">
      <thead>
        <tr>
          <th>지급률</th>
          <th>연간 성과급 세전</th>
          <th>세후 추정</th>
          <th>월급 대비</th>
        </tr>
      </thead>
      <tbody id="doosanScenarioTableBody">
        <!-- JS로 DOOSAN_SCENARIO_RATES 5행 렌더링 -->
      </tbody>
    </table>
  </div>
</section>
```

### [E] 업종 배경 설명 (원전/에너지)

```astro
<section class="dbc-section">
  <div class="dbc-section__head">
    <p class="dbc-section__eyebrow">업종 배경</p>
    <h2>두산에너빌리티 사업과 원전(SMR) 동향</h2>
  </div>
  <div class="dbc-logic-grid">
    <article class="dbc-logic-card">
      <strong>주요 사업 부문</strong>
      <p>두산에너빌리티는 원전·발전·에너지 설비, 건설 부문 등으로 구성되며, 사업 부문별 실적에 따라 성과급 규모가 달라질 수 있습니다.</p>
    </article>
    <article class="dbc-logic-card">
      <strong>원전(SMR) 관련 참고 정보</strong>
      <p>{DOOSAN_BONUS_DEFAULTS.industryNote}</p>
    </article>
  </div>
</section>
```

### [F] 계산 기준 요약

```astro
<article class="panel">
  <div class="panel-heading">
    <div>
      <p class="panel-heading__eyebrow">계산 기준</p>
      <h2 class="panel__title">계산 기준 요약</h2>
    </div>
  </div>
  <div class="dbc-logic-grid">
    <article class="dbc-logic-card">
      <strong>연간 성과급 = 연봉 × 지급률(%) (기본 모드)</strong>
      <p>월급 배수 또는 금액 직접 입력 모드로도 계산할 수 있습니다.</p>
    </article>
    <article class="dbc-logic-card">
      <strong>세후는 참고값</strong>
      <p>간이 세율 22% 또는 직접 입력한 세율을 적용한 추정값으로, 실제 세후 금액은 개인 과세표준에 따라 달라집니다.</p>
    </article>
    <article class="dbc-logic-card">
      <strong>성과급률 기본값은 추정값</strong>
      <p>보도·업계 추정 기반 시뮬레이션이며 실제 지급률은 사업 실적과 노사 협의에 따라 달라질 수 있습니다.</p>
    </article>
  </div>
</article>
```

### [G] 관련 계산기 그리드

```astro
<section class="dbc-section">
  <div class="dbc-section__head">
    <p class="dbc-section__eyebrow">관련 계산기</p>
    <h2>함께 보면 좋은 계산기</h2>
  </div>
  <div class="dbc-related-grid">
    {DOOSAN_RELATED_LINKS.map((link) => (
      <a class="dbc-related-card" href={withBase(link.href)}>
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
  annualSalary: 65000000,
  monthlySalary: 5400000,
  bonusMode: "salaryPercent",   // "salaryPercent" | "monthlyMultiple" | "fixedAmount"
  salaryPercent: 15,
  monthlyMultiple: 1.5,
  fixedAmount: 0,
  taxMode: "simple",             // "simple" | "manual"
  manualTaxRate: 22,
};
```

### 7-2. 이벤트 흐름

1. 연봉 입력 변경 → 월급 자동 계산(연봉÷12), 슬라이더 동기화
2. 월급 직접 수정 시 연봉은 자동 갱신하지 않음 (연봉이 기준값, 월급은 표시/배수 계산용)
3. `bonusMode` 라디오 변경 → 해당 입력 블록만 표시, 나머지 `hidden` 처리
4. `taxMode` 라디오 변경 → `manual` 선택 시 세율 입력 블록 표시
5. 슬라이더 ↔ 숫자 입력 양방향 동기화 (posco-bonus-calculator와 동일 패턴)
6. `calcDoosanBonusBtn` 클릭 또는 주요 입력 변경 → `calculate()` 실행
7. `calculate()`:
   - 모드별 세전 성과급 계산
   - 세후 추정 계산 (taxMode에 따라 0.22 또는 manualTaxRate/100)
   - KPI 카드 갱신
   - 시나리오 표(10/15/20/25/30%) 리렌더링 (현재 연봉/월급 기준, salaryPercent 모드 기준 고정 산정)
   - 다음 계산기 CTA URL prefill

### 7-3. CTA URL prefill

```js
const afterTaxUrl = `/tools/bonus-after-tax-calculator/?bonus=${bonusGross}&salary=${annualSalary}&company=doosan-enerbility`;

const monthlyInvest = Math.min(3000000, Math.max(100000, Math.round((bonusGross / 12) / 50000) * 50000));
const dcaUrl = `/tools/dca-investment-calculator/?m=${monthlyInvest}&p=10&a=SP500,NASDAQ100,QQQ&fx=1&div=1`;
```

### 7-4. URL 파라미터 (공유 링크)

```
/tools/doosan-enerbility-bonus-calculator/?salary=70000000&mode=salaryPercent&rate=20&taxMode=simple
```

---

## 8. Chart.js 설계

- 이 페이지는 비교 대상이 없는 단독 계산기이므로 Chart.js를 필수로 사용하지 않는다.
- 선택 사항: 시나리오 비교 표([D])를 보조하는 막대 차트(`doosan-scenario-chart`)를 추가할 수 있다. 추가 시:

```js
{
  type: "bar",
  data: {
    labels: ["10%", "15%", "20%", "25%", "30%"],
    datasets: [
      { label: "연간 성과급 (세전, 원)", data: [...], backgroundColor: "#1A56DB" }
    ]
  },
  options: { responsive: true, plugins: { legend: { display: false } } }
}
```

---

## 9. 스타일 설계

### 9-1. Prefix

- 페이지 루트: `.doosan-bonus-page`
- 섹션: `.dbc-section`
- 로직 카드: `.dbc-logic-grid`, `.dbc-logic-card`
- 다음 단계 CTA: `.dbc-next-step`
- 관련 계산기: `.dbc-related-grid`, `.dbc-related-card`
- 시나리오 테이블: `.dbc-scenario-table` (공통 `.result-table` 확장)

### 9-2. 시각 톤

- 사이트 기본 톤(blue primary `#1A56DB`) 그대로 사용, 별도 브랜드 컬러 없음
- 추정/시뮬레이션 배지: 공통 `.estimate-badge` 클래스 재사용

### 9-3. SCSS 골격

```scss
.doosan-bonus-page {
  .dbc-section {
    padding: 24px 0;
  }

  .dbc-section__head {
    margin-bottom: 16px;
  }

  .dbc-logic-grid,
  .dbc-related-grid {
    display: grid;
    gap: 10px;
    grid-template-columns: 1fr;
  }

  .dbc-logic-card,
  .dbc-related-card {
    border: 1px solid #E0DFDB;
    border-radius: 10px;
    padding: 16px;
    background: #FFFFFF;
  }

  .dbc-related-card {
    display: grid;
    gap: 6px;
    color: inherit;
    text-decoration: none;

    strong { color: #0F172A; }
    span { color: #64748B; font-size: 0.86rem; }
  }

  .dbc-next-step {
    border: 1px solid #DBEAFE;
    border-radius: 10px;
    background: #EFF6FF;
    padding: 18px;
    margin: 16px 0;
  }

  .dbc-next-step__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 12px 0 8px;
  }

  .dbc-next-step__note {
    font-size: 0.75rem;
    color: #6B7280;
    margin: 0;
  }
}

@media (min-width: 768px) {
  .doosan-bonus-page {
    .dbc-logic-grid,
    .dbc-related-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
}

@media (min-width: 1024px) {
  .doosan-bonus-page {
    .dbc-related-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
}
```

---

## 10. `tools.ts` 등록

```ts
{
  slug: "doosan-enerbility-bonus-calculator",
  title: "두산에너빌리티 성과급 계산기",
  description: "두산에너빌리티 성과급(PS)을 연봉 기준으로 계산하고, 지급률을 직접 조정해 세전·세후 예상액을 확인합니다.",
  category: "bonus",
  order: 4.8,
  badges: ["추정", "시뮬레이션"],
  isNew: true,
}
```

---

## 11. Sitemap / OG

### 11-1. sitemap.xml

```xml
<url>
  <loc>https://bigyocalc.com/tools/doosan-enerbility-bonus-calculator/</loc>
  <lastmod>2026-06-15</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

### 11-2. OG 이미지

```txt
public/og/tools/doosan-enerbility-bonus-calculator.png
```

텍스트:
- 메인: `두산에너빌리티 성과급 계산기`
- 서브: `PS 세전·세후 계산 2026`

---

## 12. InfoNotice 문구

```astro
<InfoNotice
  title="안내"
  lines={[
    "성과급(PS) 지급률 기본값은 보도·업계 추정 기반 시뮬레이션이며, 실제 지급률은 사업 부문 실적과 노사 협의에 따라 달라집니다.",
    "원전(SMR) 관련 수주 동향은 일반 참고 정보이며 성과급 지급률을 보장하지 않습니다.",
    "세후 추정값은 개인 과세표준·공제 조건에 따라 실제 수령액과 다를 수 있습니다.",
    "이 계산기는 투자 권유 또는 특정 기업 평가를 목적으로 하지 않습니다.",
  ]}
/>
```

---

## 13. SeoContent (FAQ 포함)

```astro
<SeoContent
  introTitle="두산에너빌리티 성과급 계산기 활용 가이드"
  intro={[
    "이 계산기는 두산에너빌리티 성과급(PS)을 연봉 또는 월급 기준으로 시뮬레이션합니다. 지급률 기본값(15%)은 보도·업계 추정 기반이며, 직접 입력 모드로 자유롭게 조정할 수 있습니다.",
    "성과급은 연봉 대비 %, 월급 × 배수, 금액 직접 입력 등 3가지 방식 중 편한 방식을 선택해 계산할 수 있습니다.",
    "두산에너빌리티는 원전·발전·에너지 설비, 건설 등 여러 사업 부문으로 구성되어 있으며, 사업 부문별 실적과 그룹 평가 기준에 따라 성과급(PS) 규모가 달라질 수 있는 것으로 알려져 있습니다.",
    "최근 원전(SMR, 소형모듈원자로) 관련 수주 확대 소식이 보도되고 있으나, 이는 일반적인 산업 동향 참고 정보이며 특정 연도의 성과급 지급률을 보장하지 않습니다. 이 계산기는 해당 동향을 성과급 수치 산정에 직접 반영하지 않습니다.",
    "세후 추정값은 간이 세율(22%) 또는 직접 입력한 세율을 적용한 참고값입니다. 정확한 세후 금액은 성과급 세후 계산기를 통해 확인하는 것을 권장합니다.",
  ]}
  inputPoints={[
    "연봉을 입력하면 월급이 자동 계산되며, 직접 수정할 수도 있습니다.",
    "성과급 입력 방식을 연봉 대비 %, 월급 배수, 금액 직접 입력 중에서 선택할 수 있습니다.",
    "세율은 간이 세율(22%) 또는 직접 입력 중 선택할 수 있습니다.",
    "성과급률별(10/15/20/25/30%) 예상 금액을 표로 한눈에 비교할 수 있습니다.",
  ]}
  criteria={[
    "연간 성과급(세전) = 연봉 × 지급률(%) (기본 모드 기준)",
    "성과급률 기본값은 보도 및 업계 추정 기반이며 실제 지급률과 다를 수 있습니다.",
    "세후 추정은 간이 세율(22%) 또는 사용자가 입력한 세율을 적용한 참고값입니다.",
    "원전(SMR) 등 산업 동향은 배경 설명으로만 제공되며 계산 결과에 직접 반영되지 않습니다.",
  ]}
  faq={[
    { question: "두산에너빌리티 성과급(PS)은 어떻게 산정되나요?", answer: "사업 부문(원전·에너지·건설 등) 실적과 그룹 평가 기준에 연동되는 이익배분제(PS) 구조로 알려져 있습니다. 정확한 산정 기준은 회사 공식 발표를 참고하세요." },
    { question: "이 계산기의 성과급률 15%는 확정된 수치인가요?", answer: "아니요. 보도·업계 추정 기반 시뮬레이션 기본값이며, 실제 지급률은 사업 실적과 노사 협의에 따라 달라질 수 있습니다. 직접 입력 모드로 원하는 수치를 적용해 보세요." },
    { question: "원전(SMR) 수주 확대가 성과급에 영향을 주나요?", answer: "관련 동향이 보도되고 있으나, 이 계산기는 해당 정보를 성과급 수치 산정에 직접 반영하지 않습니다. 일반 참고 정보로만 안내합니다." },
    { question: "세후로 얼마나 받게 되나요?", answer: "성과급은 근로소득으로 합산 과세됩니다. 이 계산기의 세후 값은 간이 세율(22%) 또는 직접 입력한 세율을 적용한 참고값이며, 정확한 금액은 성과급 세후 계산기를 이용하세요." },
    { question: "월급 배수로도 계산할 수 있나요?", answer: "네. 입력 방식에서 '월급 × 배수'를 선택하면 월급에 배수를 곱한 금액으로 성과급을 계산할 수 있습니다." },
    { question: "다른 대기업과 비교하려면 어떻게 하나요?", answer: "대기업 성과급 시뮬레이터 또는 대기업 성과급 비교 리포트를 통해 여러 기업의 성과급을 동일 기준으로 비교해 볼 수 있습니다." },
    { question: "사업 부문별로 성과급이 다른가요?", answer: "두산에너빌리티는 원전·발전·에너지 설비, 건설 등 여러 사업 부문으로 구성되어 있어 부문별 실적에 따라 성과급 규모가 달라질 수 있는 것으로 알려져 있습니다." },
  ]}
  related={[
    { href: "/reports/corporate-bonus-comparison-2026/", label: "2026 대기업 성과급 완전 비교" },
    { href: "/tools/bonus-after-tax-calculator/", label: "성과급 세후 실수령액 계산기" },
    { href: "/tools/bonus-simulator/", label: "대기업 성과급 시뮬레이터" },
    { href: "/tools/semiconductor-bonus-comparison/", label: "반도체 성과급 비교" },
    { href: "/tools/hanwha-bonus-calculator/", label: "한화오션·한화에어로스페이스 성과급 계산기" },
  ]}
/>
```

---

## 14. 구현 순서

1. `src/data/doosanEnerbilityBonusCalculator2026.ts` 작성
2. `src/pages/tools/doosan-enerbility-bonus-calculator.astro` 작성 (포스코 계산기 페이지 구조 복제 후 데이터/문구 교체)
3. `src/styles/scss/pages/_doosan-enerbility-bonus-calculator.scss` 작성 및 `app.scss`에 import 추가
4. `public/scripts/doosan-enerbility-bonus-calculator.js` 작성 (계산 로직·DOM 바인딩)
5. `src/data/tools.ts`에 항목 등록
6. `public/sitemap.xml`에 URL 추가
7. `src/pages/index.astro`의 `topicBySlug`에 등록
8. OG 이미지 생성 또는 기본 이미지 연결
9. `npm run build` 성공 확인
10. 로컬 확인 후 배포

---

## 15. QA 체크리스트

### 콘텐츠 QA

- [ ] H1/title/description에 `두산에너빌리티 성과급 계산기`가 자연스럽게 포함됨
- [ ] `두산에너빌리티 보너스`, `두산 원전 성과급` 키워드가 본문에 포함됨
- [ ] 추정/시뮬레이션 배지가 결과 카드에 표시됨
- [ ] 원전(SMR) 관련 서술이 사실 위주이며 투자 권유로 읽히지 않음
- [ ] 확정 지급률처럼 오해할 수 있는 표현 없음
- [ ] FAQ 5개 이상, SeoContent intro 5문단/800자 이상

### UX QA

- [ ] 연봉 입력 시 월급 자동 계산 및 슬라이더 동기화 정상 동작
- [ ] 입력 모드(연봉%/월급배수/금액직접) 전환 시 블록이 올바르게 토글됨
- [ ] 세율 모드(간이/직접) 전환 정상 동작
- [ ] 시나리오 비교 표(10~30%)가 정상 렌더링됨
- [ ] CTA(세후·투자) 링크가 성과급 금액 prefill로 연결됨
- [ ] 모바일에서 입력 패널과 표가 깨지지 않음

### 기술 QA

- [ ] `npm run build` 성공
- [ ] `/tools/doosan-enerbility-bonus-calculator/` 라우트 생성 확인
- [ ] `tools.ts`, `sitemap.xml`, `app.scss` 등록 확인
- [ ] URL 파라미터 공유 링크 복원 정상 동작
- [ ] 링크 404 없음

---

## 16. 발행 후 관찰 지표

7~14일 기준:

- `/tools/doosan-enerbility-bonus-calculator/` 세션 수
- `두산에너빌리티 성과급`, `두산에너빌리티 성과급 계산기` 검색어 등장 여부
- CTR 8% 이상 여부
- `/tools/bonus-after-tax-calculator/`, `/tools/bonus-simulator/` 내부 이동

초기 목표:

- 7일 세션 30 이상
- CTR 8% 이상
- 내부 이동 5건 이상
