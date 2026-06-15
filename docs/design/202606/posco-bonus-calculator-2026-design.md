# 포스코 성과급 계산기 — 설계 문서

> 기획 원문: `docs/plan/202606/posco-bonus-calculator-2026-plan.md`
> 작성일: 2026-06-15
> 구현 기준: Codex/Claude가 이 문서만 보고 `/tools/posco-bonus-calculator/` 계산기 페이지 구현에 착수할 수 있는 수준
> 참고 페이지: `lg-bonus`, `samsung-bonus`, `sk-hynix-bonus`, `bonus-after-tax-calculator`

---

## 1. 문서 개요

### 1-1. 대상

- 구현 대상: `포스코 성과급 계산기 2026`
- 콘텐츠 유형: 계산기 (tool)
- slug: `posco-bonus-calculator`
- URL: `/tools/posco-bonus-calculator/`

### 1-2. 문서 역할

- 기획 문서(`docs/plan/202606/posco-bonus-calculator-2026-plan.md`)를 비교계산소 계산기 구조에 맞게 구현 단위로 고정한다.
- 데이터 스키마, 페이지 섹션, 입출력 설계, CTA 흐름, 스타일 prefix, QA 기준을 정의한다.
- 구현자는 이 문서를 기준으로 `src/data/poscoBonusCalculator2026.ts`, `src/pages/tools/posco-bonus-calculator.astro`, `public/scripts/posco-bonus-calculator.js`, `src/styles/scss/pages/_posco-bonus-calculator.scss` 작업을 진행한다.

### 1-3. 페이지 성격

- **계열사별 PI·PS 계산기**: 포스코그룹 4개 주요 계열사(포스코·포스코퓨처엠·포스코인터내셔널·포스코이앤씨) 선택 → 연봉/월급 입력 → PI(생산성 격려금)+PS(이익배분) 합산 지급률 적용 → 세전·세후 추정 결과
- **성과급 시리즈 확장**: `lg-bonus`, `samsung-bonus`, `sk-hynix-bonus`, `hyundai-bonus`와 동일 연봉 기준 비교 바 차트 포함
- **계산기 유도형**: 계산 결과 → 세후 계산기 → DCA 계산기로 연결 (LG전자 계산기와 동일 CTA 패턴)
- **데이터 신뢰성 원칙**: 모든 지급률은 "사용자 입력 기준 시뮬레이션"이며, 공식 발표 자료가 아님을 InfoNotice·결과 카드에 반복 고지

### 1-4. 권장 파일 구조

```txt
src/
  data/
    poscoBonusCalculator2026.ts
  pages/
    tools/
      posco-bonus-calculator.astro

public/
  scripts/
    posco-bonus-calculator.js
  og/
    tools/
      posco-bonus-calculator.png

src/styles/scss/pages/
  _posco-bonus-calculator.scss
```

필수 등록:

- `src/data/tools.ts`
- `src/styles/app.scss`
- `public/sitemap.xml`
- `src/pages/index.astro` (`topicBySlug`)

---

## 2. SEO 설계

### 2-1. 메타

```ts
title: "포스코 성과급 계산기｜PI·PS 계열사별 세전·세후 계산 2026"
description: "포스코·포스코퓨처엠·포스코인터내셔널·포스코이앤씨 성과급(PI·PS)을 연봉 기준으로 계산해보세요. 계열사별 지급률 추정값과 세전·세후 체감액, 삼성전자·SK하이닉스·LG전자 비교까지 확인할 수 있습니다."
ogImage: "/og/tools/posco-bonus-calculator.png"
```

### 2-2. 핵심 키워드 매핑

| 키워드 | 반영 위치 |
|---|---|
| 포스코 성과급 계산기 | title, H1, hero |
| 포스코 성과급 | title, 섹션 H2 |
| 포스코 PI PS | 계산 기준 요약, FAQ |
| 포스코 성과급 얼마 | hero sub, FAQ |
| 포스코퓨처엠 성과급 | 계열사 선택 섹션, FAQ |
| 포스코인터내셔널 성과급 | 계열사 선택 섹션, FAQ |
| 포스코 성과급 세후 | 세후 섹션, FAQ |

---

## 3. 데이터 스키마

### 3-1. `src/data/poscoBonusCalculator2026.ts`

```ts
export type PoscoCompanyCode = "POSCO" | "FUTUREM" | "INTL" | "ENC";
export type PoscoRankCode = "STAFF" | "ASSISTANT_MANAGER" | "MANAGER" | "DEPUTY_GM" | "GM";
export type PoscoScenarioCode = "CONSERVATIVE" | "BASE" | "AGGRESSIVE";
export type PoscoInputMode = "ESTIMATE" | "CUSTOM";
export type EvidenceBadge = "추정" | "시뮬레이션";

export interface PoscoCompanyConfig {
  code: PoscoCompanyCode;
  label: string;            // "포스코"
  fullName: string;         // "포스코 (철강)"
  description: string;      // "철강 본원 사업 (열연·냉연·후판 등)"
  rateRange: { min: number; max: number }; // PI+PS 합산, 기본급 대비 % 정수
  baseScenario: Record<PoscoScenarioCode, number>; // %
  trend: string;            // "글로벌 철강 업황에 따라 변동성 있음"
  badge: EvidenceBadge;
}

export interface PoscoRankPreset {
  code: PoscoRankCode;
  label: string;             // "대리"
  defaultMonthlyBase: number;  // 월 기본급 (원)
  defaultAnnualSalary: number; // 연봉 참고값 (원)
}

export interface PoscoComparisonItem {
  company: string;   // "포스코"
  slug: string;      // "posco" | "samsung" | "skHynix" | "lg" | "hyundai"
  label: string;
  rate: number;       // 기준 시나리오 %, 동일 연봉 기준
  color: string;      // Chart.js 색상
}

export interface PoscoBonusTermGuide {
  term: string;       // "PI (생산성 격려금)"
  meaning: string;
  payoutPeriod: string;  // "익년 1~2월"
  caution: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  desc: string;
}
```

### 3-2. 데이터 export 목록

```ts
export const poscoCompanies: PoscoCompanyConfig[];        // 계열사 4개
export const poscoRankPresets: PoscoRankPreset[];          // 직급 5개
export const poscoComparisonItems: PoscoComparisonItem[];  // 타사 비교용 5개 (포스코 포함)
export const poscoBonusTerms: PoscoBonusTermGuide[];       // PI/PS 용어 설명 2개
export const POSCO_SIMPLE_TAX_RATE_FN = estimateTaxRate;   // lg-bonus와 동일 단순화 누진 함수
export const POSCO_NEXT_CALCULATOR: RelatedLink;
export const POSCO_RELATED_CALCULATORS: RelatedLink[];
```

### 3-3. 계열사 데이터 (추정값)

```ts
export const poscoCompanies: PoscoCompanyConfig[] = [
  {
    code: "POSCO",
    label: "포스코",
    fullName: "포스코 (철강)",
    description: "열연·냉연·후판 등 철강 본원 사업",
    rateRange: { min: 0, max: 50 },
    baseScenario: { CONSERVATIVE: 10, BASE: 20, AGGRESSIVE: 35 },
    trend: "글로벌 철강 공급과잉·중국 경기에 따라 연도별 변동성이 큰 편으로 알려져 있습니다.",
    badge: "추정",
  },
  {
    code: "FUTUREM",
    label: "포스코퓨처엠",
    fullName: "포스코퓨처엠 (이차전지소재)",
    description: "양극재·음극재 등 배터리 소재 사업",
    rateRange: { min: 0, max: 40 },
    baseScenario: { CONSERVATIVE: 5, BASE: 15, AGGRESSIVE: 30 },
    trend: "전기차·배터리 수요 사이클에 따라 변동성이 큰 편으로 알려져 있습니다.",
    badge: "추정",
  },
  {
    code: "INTL",
    label: "포스코인터내셔널",
    fullName: "포스코인터내셔널 (에너지·식량)",
    description: "LNG·에너지, 식량 트레이딩 사업",
    rateRange: { min: 10, max: 50 },
    baseScenario: { CONSERVATIVE: 15, BASE: 25, AGGRESSIVE: 40 },
    trend: "에너지 가격·트레이딩 실적에 따라 연도별 차이가 있는 것으로 알려져 있습니다.",
    badge: "추정",
  },
  {
    code: "ENC",
    label: "포스코이앤씨",
    fullName: "포스코이앤씨 (건설)",
    description: "건축·인프라·플랜트 건설 사업",
    rateRange: { min: 0, max: 30 },
    baseScenario: { CONSERVATIVE: 0, BASE: 10, AGGRESSIVE: 20 },
    trend: "건설 업황과 수주 실적에 따라 지급 여부가 달라질 수 있는 것으로 알려져 있습니다.",
    badge: "추정",
  },
];
```

### 3-4. 직급 프리셋

```ts
export const poscoRankPresets: PoscoRankPreset[] = [
  { code: "STAFF",             label: "사원", defaultMonthlyBase: 3500000, defaultAnnualSalary: 58000000 },
  { code: "ASSISTANT_MANAGER", label: "대리", defaultMonthlyBase: 4300000, defaultAnnualSalary: 72000000 },
  { code: "MANAGER",           label: "과장", defaultMonthlyBase: 5200000, defaultAnnualSalary: 88000000 },
  { code: "DEPUTY_GM",         label: "차장", defaultMonthlyBase: 6200000, defaultAnnualSalary: 105000000 },
  { code: "GM",                label: "부장", defaultMonthlyBase: 7300000, defaultAnnualSalary: 125000000 },
];
```

### 3-5. 타사 비교 데이터 (기준 시나리오, 동일 월 기본급 적용)

```ts
export const poscoComparisonItems: PoscoComparisonItem[] = [
  { company: "포스코",     slug: "posco-bonus-calculator", label: "포스코",     rate: 20, color: "#0F6E56" },
  { company: "삼성전자",   slug: "samsung-bonus",          label: "삼성전자",   rate: 20, color: "#1E429F" },
  { company: "SK하이닉스", slug: "sk-hynix-bonus",         label: "SK하이닉스", rate: 20, color: "#7C3AED" },
  { company: "LG전자",     slug: "lg-bonus",               label: "LG전자",     rate: 100, color: "#A50034" },
  { company: "현대자동차", slug: "hyundai-bonus",          label: "현대자동차", rate: 20, color: "#B45309" },
];
```

> **주의**: LG전자는 PI가 월 기본급 기준 상·하반기 각 %로 별도 산식을 쓰므로(`lg-bonus`), 비교 차트에서는 "연간 PI 합계 % (= h1+h2)"로 환산한 100을 사용한다. 구현 시 `lgCompensation.ts`의 기준 시나리오(H&A BASE: h1 100 + h2 100 = 200... )는 사업부별로 다르므로, 비교 차트용 값은 4개 사업부 평균의 기준 시나리오 합계를 사용하거나, 단순화를 위해 LG전자 대표값(전사 평균 추정)을 별도로 산정해 `poscoComparisonItems`에 고정값으로 명시한다. 정확한 수치는 구현 단계에서 `lgCompensation.ts`를 참조해 갱신한다.

### 3-6. PI/PS 용어 설명

```ts
export const poscoBonusTerms: PoscoBonusTermGuide[] = [
  {
    term: "PI (생산성 격려금, Productivity Incentive)",
    meaning: "회사/사업부 생산성·목표 달성도 평가에 따라 지급되는 성과급입니다.",
    payoutPeriod: "통상 익년 1~2월",
    caution: "사업 실적과 평가 결과에 따라 지급 여부·규모가 달라질 수 있습니다.",
  },
  {
    term: "PS (이익배분제, Profit Sharing)",
    meaning: "연간 이익 목표 달성 시 초과 이익의 일부를 배분하는 성과급입니다.",
    payoutPeriod: "통상 익년 1~2월",
    caution: "이익 목표 달성 여부에 따라 지급되지 않을 수도 있습니다.",
  },
];
```

### 3-7. 계산 로직

계산식:

```
연간 성과급(PI+PS) 세전 = 월 기본급 × 지급률(%) / 100
월 기본급 환산 배수 = 연간 성과급 세전 / 월 기본급  (= 지급률/100, 참고용 "개월치" 표기)
연봉 대비 비율 = 연간 성과급 세전 / 연봉 × 100
세후 추정 = 연간 성과급 세전 × (1 - 추정세율)
```

세후 추정 세율 (`lg-bonus`와 동일 함수 재사용):

```ts
function estimateTaxRate(bonusAmount: number): number {
  if (bonusAmount < 10000000) return 0.165;   // 16.5%
  if (bonusAmount < 30000000) return 0.264;   // 26.4%
  if (bonusAmount < 50000000) return 0.374;   // 37.4%
  return 0.418;                                // 41.8%
}
```

> 세후 금액은 개인 과세표준·공제 조건에 따라 달라지는 참고값이다. 정확한 세후 금액은 세후 계산기(`bonus-after-tax-calculator`)로 연결한다.

---

## 4. 페이지 구조

### 4-1. 레이아웃 쉘

`SimpleToolShell.astro` — `resultFirst={true}` 패턴 (lg-bonus와 동일)

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
  poscoCompanies,
  poscoRankPresets,
  poscoComparisonItems,
  poscoBonusTerms,
  POSCO_NEXT_CALCULATOR,
  POSCO_RELATED_CALCULATORS,
} from "../../data/poscoBonusCalculator2026";
---
```

### 4-3. 레이아웃 순서

```txt
BaseLayout
  SiteHeader
  SimpleToolShell (calculatorId="posco-bonus-calculator" pageClass="posco-bonus-page" resultFirst={true})
    slot:hero → CalculatorHero
    slot:actions → ToolActionBar
    slot:aside → 입력 패널
    [결과 우선 패널]
    [A] KPI 핵심 카드
    [B] 다음 계산 CTA (세후·투자)
    [C] 포스코 PI·PS 구조 설명
    [D] 계열사별 지급률 비교 바 차트
    [E] 직급별 예상 성과급 표
    [F] 타 대기업 비교 바 차트
    [G] 계산 기준 요약
    InfoNotice
    [H] 관련 계산기 그리드
    slot:seo → SeoContent (FAQ 포함)
```

---

## 5. 입력 패널 설계 (`slot:aside`)

```astro
<div class="stack" id="posco-bonus-inputs">

  <!-- 계열사 + 직급 + 월 기본급 -->
  <article class="panel">
    <div class="panel-heading">
      <div>
        <p class="panel-heading__eyebrow">빠른 입력</p>
        <h2 class="panel__title">계열사·직급·월 기본급 입력</h2>
      </div>
    </div>

    <div class="form-grid form-grid--compact">

      <label class="field field-span-full">
        <span>계열사</span>
        <select id="poscoCompanySelect">
          {poscoCompanies.map((c) => <option value={c.code}>{c.label} — {c.description}</option>)}
        </select>
        <small id="poscoCompanyHint"></small>
      </label>

      <label class="field">
        <span>직급</span>
        <select id="poscoRankSelect">
          {poscoRankPresets.map((r) => <option value={r.code}>{r.label}</option>)}
        </select>
      </label>

      <label class="field">
        <span>월 기본급</span>
        <input id="poscoMonthlyBaseInput" type="number" value="4300000" />
        <small id="poscoMonthlyBaseHint">직급 선택 시 예시값이 자동 입력됩니다. 직접 수정 가능합니다.</small>
        <div class="calc-slider-row">
          <input type="range" id="poscoMonthlyBaseSlider" class="calc-slider"
            min="2000000" max="12000000" step="100000" value="4300000" />
          <span id="poscoMonthlyBaseSliderVal" class="calc-slider-val">430만원</span>
        </div>
      </label>

    </div>
  </article>

  <!-- 지급률 설정 -->
  <article class="panel">
    <div class="panel-heading">
      <div>
        <p class="panel-heading__eyebrow">PI·PS 지급률 설정</p>
        <h2 class="panel__title">추정값 또는 직접 입력</h2>
      </div>
    </div>

    <div class="toggle-grid">
      <label class="mode-chip">
        <input id="rateModeEstimate" name="rateMode" type="radio" value="ESTIMATE" checked />
        <span>추정값 사용</span>
      </label>
      <label class="mode-chip">
        <input id="rateModeCustom" name="rateMode" type="radio" value="CUSTOM" />
        <span>직접 입력</span>
      </label>
    </div>
    <small id="rateModeHint">추정값은 보도·업계 추정 기반 시뮬레이션이며 실제 지급률과 다를 수 있습니다.</small>

    <!-- 시나리오 선택 (추정값 모드) -->
    <div id="poscoScenarioBlock">
      <div class="toggle-grid">
        <label class="mode-chip">
          <input name="poscoScenario" type="radio" value="CONSERVATIVE" />
          <span>보수적</span>
        </label>
        <label class="mode-chip">
          <input name="poscoScenario" type="radio" value="BASE" checked />
          <span>기준</span>
        </label>
        <label class="mode-chip mode-chip--highlight">
          <input name="poscoScenario" type="radio" value="AGGRESSIVE" />
          <span>낙관적</span>
        </label>
      </div>
      <small id="poscoScenarioHint"></small>
    </div>

    <!-- 직접 입력 (직접 입력 모드) -->
    <div id="poscoCustomRateBlock" hidden>
      <div class="form-grid form-grid--compact">
        <label class="field field-span-full">
          <span>PI+PS 합산 지급률 (%, 기본급 대비 연간)</span>
          <input id="poscoCustomRateInput" type="number" value="20" min="0" max="100" step="5" />
          <div class="calc-slider-row">
            <input type="range" id="poscoCustomRateSlider" class="calc-slider" min="0" max="100" step="5" value="20" />
            <span id="poscoCustomRateSliderVal" class="calc-slider-val">20%</span>
          </div>
        </label>
      </div>
    </div>
  </article>

  <button id="calcPoscoBonusBtn" class="button button--primary" type="button">성과급 계산하기</button>

</div>
```

---

## 6. 출력 섹션 설계

### [결과 우선 패널]

```astro
<article class="panel result-priority-panel" id="posco-bonus-results">
  <div class="panel-heading">
    <div>
      <p class="panel-heading__eyebrow">결과 먼저 보기</p>
      <h2 class="panel__title">내 예상 성과급</h2>
    </div>
  </div>
  <div class="result-priority-panel__actions">
    <a class="button button--secondary" href="#posco-bonus-inputs">조건 다시 입력</a>
    <a class="button button--ghost" href="#posco-bonus-details">세부 내역 보기</a>
  </div>
</article>
```

### [A] KPI 핵심 카드

```astro
<section class="pbc-section">
  <div class="pbc-section__head">
    <p class="pbc-section__eyebrow">내 계산 결과</p>
    <h2 id="poscoResultHeadline">포스코 성과급 계산 결과</h2>
    <p class="pbc-section__sub" id="poscoResultSubcopy">계열사·직급 기준 시뮬레이션</p>
  </div>
  <div class="kpi-grid">
    <article class="kpi-card kpi-card--accent">
      <p>연간 성과급 (세전)</p>
      <strong id="poscoBonusGross">-</strong>
      <span id="poscoBonusGrossNote">시뮬레이션</span>
    </article>
    <article class="kpi-card">
      <p>연간 성과급 (세후 추정)</p>
      <strong id="poscoBonusNet">-</strong>
      <span id="poscoBonusNetNote">참고값</span>
    </article>
    <article class="kpi-card">
      <p>월 기본급 대비</p>
      <strong id="poscoMonthlyRatio">-</strong>
      <span id="poscoMonthlyRatioNote">개월치</span>
    </article>
    <article class="kpi-card">
      <p>연봉 대비 비율</p>
      <strong id="poscoAnnualRatio">-</strong>
      <span id="poscoAnnualRatioNote">참고값</span>
    </article>
  </div>
</section>
```

### [B] 다음 계산 CTA

```astro
<section class="pbc-next-step" aria-label="계산 결과 다음 단계">
  <p class="pbc-section__eyebrow">지금 바로 이어서</p>
  <div class="pbc-next-step__actions">
    <a id="poscoAfterTaxCta" class="button button--primary"
       href={withBase("/tools/bonus-after-tax-calculator/?company=posco")}>
      세후 실수령 계산하기 →
    </a>
    <a id="poscoDcaCta" class="button button--secondary"
       href={withBase("/tools/dca-investment-calculator/?m=300000&p=10&a=SP500,NASDAQ100,QQQ&fx=1&div=1")}>
      이 금액 투자하면? →
    </a>
  </div>
  <p class="pbc-next-step__note" id="poscoNextStepNote">
    성과급 세전 금액을 기준으로 다음 계산기에 자동 반영합니다.
  </p>
</section>
```

### [C] 포스코 PI·PS 구조 설명

```astro
<section class="pbc-section" id="posco-bonus-details">
  <div class="pbc-section__head">
    <p class="pbc-section__eyebrow">PI·PS 구조</p>
    <h2>포스코 성과급 PI·PS란?</h2>
  </div>
  <div class="pbc-logic-grid">
    {poscoBonusTerms.map((t) => (
      <article class="pbc-logic-card">
        <strong>{t.term}</strong>
        <p>{t.meaning}</p>
        <span class="pbc-logic-card__meta">지급 시기: {t.payoutPeriod}</span>
      </article>
    ))}
    <article class="pbc-logic-card">
      <strong>기본급 기준인 이유</strong>
      <p>PI·PS는 연봉 총액이 아니라 월 기본급을 기준으로 지급률을 곱해 산정하는 방식이 일반적입니다. 각종 수당은 제외됩니다.</p>
    </article>
    <article class="pbc-logic-card">
      <strong>계열사마다 지급률이 다른 이유</strong>
      <p>포스코그룹은 지주사 체제로 철강·이차전지소재·에너지·건설 등 계열사가 독립적으로 실적을 평가받아 지급률이 달라집니다.</p>
    </article>
  </div>
</section>
```

### [D] 계열사별 지급률 비교 바 차트

```astro
<section class="pbc-section pbc-company-section">
  <div class="pbc-section__head">
    <p class="pbc-section__eyebrow">계열사별 비교</p>
    <h2>포스코·포스코퓨처엠·포스코인터내셔널·포스코이앤씨 지급률 범위</h2>
    <p>보수·기준·낙관적 시나리오 기준 추정값입니다.</p>
  </div>
  <div class="pbc-company-chart-wrap">
    <canvas id="posco-company-chart"></canvas>
  </div>
  <div class="pbc-company-grid">
    {poscoCompanies.map((c) => (
      <article class="pbc-company-card" data-code={c.code}>
        <p class="pbc-company-card__label">{c.label}</p>
        <strong class="pbc-company-card__full">{c.fullName}</strong>
        <span class="pbc-company-card__desc">{c.description}</span>
        <p class="pbc-company-card__trend">{c.trend}</p>
        <span class="estimate-badge">{c.badge}</span>
      </article>
    ))}
  </div>
</section>
```

### [E] 직급별 예상 성과급 표

```astro
<section class="pbc-section">
  <div class="pbc-section__head">
    <p class="pbc-section__eyebrow">직급별 예시</p>
    <h2>직급별 예상 성과급 (현재 계열사·시나리오 기준)</h2>
  </div>
  <div class="table-wrap">
    <table class="result-table pbc-rank-table">
      <thead>
        <tr>
          <th>직급</th>
          <th>월 기본급</th>
          <th>연간 성과급 세전</th>
          <th>세후 추정</th>
          <th>월급 대비</th>
        </tr>
      </thead>
      <tbody id="poscoRankTableBody">
        <!-- JS로 렌더링 -->
      </tbody>
    </table>
  </div>
  <div class="pbc-inline-cta">
    <a class="button button--primary" href="#posco-bonus-inputs">내 직급·기본급으로 다시 계산하기</a>
  </div>
</section>
```

### [F] 타 대기업 비교 바 차트

```astro
<section class="pbc-section">
  <div class="pbc-section__head">
    <p class="pbc-section__eyebrow">대기업 비교</p>
    <h2>삼성전자·SK하이닉스·LG전자·현대차와 성과급 비교</h2>
    <p>동일 월 기본급 기준 기준 시나리오 시뮬레이션입니다. 실제 지급 구조와 다를 수 있습니다.</p>
  </div>
  <div class="pbc-compare-chart-wrap">
    <canvas id="posco-compare-chart"></canvas>
  </div>
  <div class="pbc-compare-cta">
    <a class="button button--secondary" href={withBase("/tools/bonus-simulator/")}>
      여러 대기업 성과급 한 번에 비교하기 →
    </a>
  </div>
</section>
```

### [G] 계산 기준 요약

```astro
<article class="panel">
  <div class="panel-heading">
    <div>
      <p class="panel-heading__eyebrow">계산 기준</p>
      <h2 class="panel__title">계산 기준 요약</h2>
    </div>
  </div>
  <div class="pbc-logic-grid">
    <article class="pbc-logic-card">
      <strong>성과급(PI+PS) = 월 기본급 × 지급률(%)</strong>
      <p>연간 지급률을 월 기본급에 곱해 세전 성과급을 산정합니다.</p>
    </article>
    <article class="pbc-logic-card">
      <strong>세후는 참고값</strong>
      <p>개인 과세표준과 공제 조건에 따라 실제 세후 금액은 달라집니다.</p>
    </article>
    <article class="pbc-logic-card">
      <strong>계열사 지급률은 추정값</strong>
      <p>보도·업계 추정 기반 시뮬레이션이며 실제 실적·노사 협의에 따라 달라질 수 있습니다.</p>
    </article>
    <article class="pbc-logic-card">
      <strong>타사 비교도 시뮬레이션</strong>
      <p>각 계산기의 기준 시나리오를 동일 월 기본급에 적용한 추정값으로, 실제 비교가 아닙니다.</p>
    </article>
  </div>
</article>
```

### [H] 관련 계산기 그리드

```astro
<section class="pbc-section">
  <div class="pbc-section__head">
    <p class="pbc-section__eyebrow">관련 계산기</p>
    <h2>함께 보면 좋은 계산기</h2>
  </div>
  <div class="pbc-related-grid">
    {POSCO_RELATED_CALCULATORS.map((link) => (
      <a class="pbc-related-card" href={withBase(link.href)}>
        <strong>{link.label}</strong>
        <span>{link.desc}</span>
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
  company: "POSCO",
  rank: "ASSISTANT_MANAGER",
  monthlyBase: 4300000,
  rateMode: "ESTIMATE",    // "ESTIMATE" | "CUSTOM"
  scenario: "BASE",         // "CONSERVATIVE" | "BASE" | "AGGRESSIVE"
  customRate: 20,           // 직접 입력 모드 % (PI+PS 합산)
};
```

### 7-2. 이벤트 흐름

1. 계열사 또는 직급 변경 → 월 기본급 프리셋 자동 세팅, 계열사 추이 힌트(`trend`) 업데이트
2. 슬라이더 ↔ 직접입력 양방향 동기화 (`lg-bonus`와 동일 패턴)
3. 지급률 모드 전환(`rateMode`) → 시나리오 블록 / 직접입력 블록 토글 표시
4. `calcPoscoBonusBtn` 클릭 또는 주요 입력 변경 → `calculate()` 실행
5. `calculate()` 실행 시:
   - KPI 카드 업데이트 (세전/세후/월급대비/연봉대비)
   - 직급별 예상표 리렌더링 (현재 계열사·시나리오/직접입력 기준 5개 직급)
   - 타사 비교 바 차트 업데이트 (포스코 값만 현재 계산 결과로 갱신, 나머지 4사는 고정 비교값)
   - 다음 계산기 CTA URL prefill

### 7-3. CTA URL prefill

```js
// 세후 계산기
const afterTaxUrl = `/tools/bonus-after-tax-calculator/?bonus=${bonusGross}&salary=${annualSalary}&company=posco`;

// DCA 계산기
const monthlyInvest = Math.min(3000000, Math.max(100000, Math.round((bonusGross / 12) / 50000) * 50000));
const dcaUrl = `/tools/dca-investment-calculator/?m=${monthlyInvest}&p=10&a=SP500,NASDAQ100,QQQ&fx=1&div=1`;
```

### 7-4. URL 파라미터 (공유 링크)

```
/tools/posco-bonus-calculator/?company=FUTUREM&rank=MANAGER&base=5200000&rateMode=BASE
```

복원 시: URL 파라미터 → state → `calculate()` 순서로 처리 (`lg-bonus`와 동일)

---

## 8. Chart.js 설계

### 8-1. 계열사별 지급률 범위 바 차트 (`posco-company-chart`)

```js
{
  type: "bar",
  data: {
    labels: ["포스코", "포스코퓨처엠", "포스코인터내셔널", "포스코이앤씨"],
    datasets: [
      { label: "보수적", data: [...], backgroundColor: "#9CA3AF" },
      { label: "기준",   data: [...], backgroundColor: "#0F6E56" },
      { label: "낙관적", data: [...], backgroundColor: "#10B981" },
    ]
  },
  options: { responsive: true, plugins: { legend: { position: "top" } } }
}
```

Y축: 지급률 % (0~50%)

### 8-2. 타사 비교 가로 바 차트 (`posco-compare-chart`)

```js
{
  type: "bar",
  data: {
    labels: ["포스코", "삼성전자", "SK하이닉스", "LG전자", "현대자동차"],
    datasets: [
      {
        label: "연간 성과급 (세전, 추정)",
        data: [poscoTotal, samsungTotal, skhynixTotal, lgTotal, hyundaiTotal],
        backgroundColor: ["#0F6E56", "#1E429F", "#7C3AED", "#A50034", "#B45309"],
      }
    ]
  },
  options: {
    indexAxis: "y",
    responsive: true,
    plugins: { legend: { display: false } }
  }
}
```

> 타사 비교값은 `poscoComparisonItems` 데이터의 기준 시나리오 지급률을 사용자 입력 월 기본급에 적용하여 계산한다. 포스코 값만 현재 계산 결과(세전)로 실시간 갱신한다.

---

## 9. 스타일 설계

### 9-1. Prefix

- 페이지 루트: `.posco-bonus-page`
- 섹션: `.pbc-section`
- KPI: `.kpi-grid`, `.kpi-card` (공통 클래스 재사용)
- 로직 카드: `.pbc-logic-grid`, `.pbc-logic-card`
- 계열사 카드: `.pbc-company-grid`, `.pbc-company-card`
- 비교: `.pbc-compare-chart-wrap`, `.pbc-compare-cta`
- 다음 단계 CTA: `.pbc-next-step`
- 관련 계산기: `.pbc-related-grid`, `.pbc-related-card`

### 9-2. 시각 톤

- 포스코 브랜드 연상: `#0F6E56` (그린/틸 계열, 철강·에너지 톤)
- 기본 색상은 사이트 blue primary `#1A56DB` 기반 유지, 계열사 차트에만 그린 계열 포인트 컬러 사용
- 추정/시뮬레이션 배지: `estimate-badge` 공통 클래스 재사용

### 9-3. SCSS 골격

```scss
.posco-bonus-page {
  .pbc-section {
    padding: 24px 0;
  }

  .pbc-section__head {
    margin-bottom: 16px;
  }

  .pbc-logic-grid,
  .pbc-company-grid,
  .pbc-related-grid {
    display: grid;
    gap: 10px;
    grid-template-columns: 1fr;
  }

  .pbc-logic-card,
  .pbc-company-card,
  .pbc-related-card {
    border: 1px solid #E0DFDB;
    border-radius: 10px;
    padding: 16px;
    background: #FFFFFF;
  }

  .pbc-related-card {
    display: grid;
    gap: 6px;
    color: inherit;
    text-decoration: none;

    strong { color: #0F172A; }
    span { color: #64748B; font-size: 0.86rem; }
  }

  .pbc-company-chart-wrap,
  .pbc-compare-chart-wrap {
    width: 100%;
    max-height: 280px;
    margin-bottom: 16px;
    overflow: hidden;
  }

  .pbc-next-step {
    border: 1px solid #DBEAFE;
    border-radius: 10px;
    background: #EFF6FF;
    padding: 18px;
    margin: 16px 0;
  }

  .pbc-next-step__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 12px 0 8px;
  }

  .pbc-next-step__note {
    font-size: 0.75rem;
    color: #6B7280;
    margin: 0;
  }

  .pbc-inline-cta {
    margin-top: 16px;
    text-align: center;
  }
}

@media (min-width: 768px) {
  .posco-bonus-page {
    .pbc-logic-grid,
    .pbc-related-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .pbc-company-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
}

@media (min-width: 1024px) {
  .posco-bonus-page {
    .pbc-company-grid,
    .pbc-related-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }
}
```

---

## 10. `tools.ts` 등록

```ts
{
  slug: "posco-bonus-calculator",
  title: "포스코 성과급 계산기",
  description: "포스코·포스코퓨처엠·포스코인터내셔널·포스코이앤씨 계열사별 PI·PS 지급률과 기본급을 입력해 세전·세후 성과급을 계산합니다.",
  category: "bonus",
  order: 4.7,           // lg-bonus 다음 순서 권장
  badges: ["추정", "시뮬레이션"],
  isNew: true,
}
```

---

## 11. Sitemap / OG

### 11-1. sitemap.xml

```xml
<url>
  <loc>https://bigyocalc.com/tools/posco-bonus-calculator/</loc>
  <lastmod>2026-06-15</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

### 11-2. OG 이미지

```txt
public/og/tools/posco-bonus-calculator.png
```

텍스트:
- 메인: `포스코 성과급 계산기`
- 서브: `PI·PS 계열사별 세전·세후 계산 2026`

---

## 12. InfoNotice 문구

```astro
<InfoNotice
  title="안내"
  lines={[
    "계열사별 PI·PS 지급률 기본값은 보도·업계 추정 기반 시뮬레이션이며, 실제 지급률은 사업 실적과 노사 협의에 따라 달라집니다.",
    "직급별 월 기본급은 참고 예시값이며 본인 기본급을 직접 입력해 사용하세요.",
    "세후 추정값은 개인 과세표준·공제 조건에 따라 실제 수령액과 다를 수 있습니다.",
    "이 계산기는 투자 권유 또는 특정 계열사 입사를 권장하지 않습니다.",
  ]}
/>
```

---

## 13. SeoContent (FAQ 포함)

```astro
<SeoContent
  introTitle="포스코 성과급 계산기 활용 가이드"
  intro={[
    "이 계산기는 포스코·포스코퓨처엠·포스코인터내셔널·포스코이앤씨 등 포스코그룹 주요 계열사의 PI·PS 지급률 추정값을 기반으로 월 기본급 대비 세전·세후 성과급을 시뮬레이션합니다.",
    "계열사를 선택하면 해당 계열사의 보수·기준·낙관적 시나리오가 자동 반영됩니다. 직접 입력 모드로 전환하면 지급률을 자유롭게 조정할 수 있습니다.",
    "포스코그룹은 지주사 체제로 운영되어 철강(포스코), 이차전지소재(포스코퓨처엠), 에너지·식량(포스코인터내셔널), 건설(포스코이앤씨) 등 계열사별 사업 구조와 업황 사이클이 다릅니다. 이에 따라 PI·PS 지급률도 계열사별로 차이가 날 수 있습니다.",
    "PI(생산성 격려금)와 PS(이익배분제)는 회사 또는 사업부의 생산성·이익 목표 달성도에 따라 지급되는 성과급으로, 통상 익년 1~2월경 지급되는 것으로 알려져 있습니다. 다만 사업 실적이 목표에 미달할 경우 지급되지 않을 수 있습니다.",
    "삼성전자·SK하이닉스·LG전자·현대자동차 등 다른 대기업 성과급 계산기와 동일한 월 기본급 기준으로 비교 차트를 제공하므로, 업종 간 보상 구조 차이를 함께 살펴볼 수 있습니다.",
  ]}
  inputPoints={[
    "계열사를 선택하면 해당 계열사의 사업 설명과 지급률 시나리오가 자동 반영됩니다.",
    "직급을 선택하면 월 기본급 예시값이 자동 입력되며, 직접 수정할 수 있습니다.",
    "추정값 모드에서는 보수·기준·낙관 시나리오 중 하나를 선택해 지급률 범위를 확인할 수 있습니다.",
    "직접 입력 모드에서는 PI+PS 합산 지급률(%)을 슬라이더로 직접 조정합니다.",
    "삼성전자·SK하이닉스·LG전자·현대자동차와 동일 월 기본급 기준 비교 차트를 함께 확인할 수 있습니다.",
  ]}
  criteria={[
    "성과급(PI+PS)은 월 기본급에 지급률(%)을 곱해 산정하며 각종 수당은 포함하지 않습니다.",
    "계열사별 지급률 시나리오는 보도 및 업계 추정 기반이며 실제 실적·노사 협의 결과와 다를 수 있습니다.",
    "세후 추정은 근로소득 합산 과세 기준 단순화 누진세율을 적용한 참고값입니다.",
    "타사 비교 시뮬레이션은 각 계산기의 기준 시나리오를 동일 월 기본급에 적용한 추정값입니다.",
  ]}
  faq={[
    { question: "포스코 성과급 PI·PS가 뭔가요?", answer: "PI(생산성 격려금)는 생산성 평가, PS(이익배분제)는 연간 이익 목표 달성도에 따라 지급되는 성과급입니다. 두 항목을 합산해 연 1회 또는 연 2회 지급되는 것으로 알려져 있습니다." },
    { question: "포스코퓨처엠·포스코인터내셔널도 성과급이 다른가요?", answer: "네. 포스코그룹은 지주사 체제로 계열사별 독립 실적 평가를 받기 때문에 PI·PS 지급률이 계열사마다 다를 수 있습니다." },
    { question: "신입사원도 성과급을 받나요?", answer: "입사 시점에 따라 재직 기간을 비례 계산해 지급되는 경우가 일반적입니다. 정확한 기준은 계열사마다 다를 수 있습니다." },
    { question: "이 계산기의 지급률 수치는 정확한가요?", answer: "보도·업계 추정 기반 시뮬레이션 값으로 실제 지급률은 사업 실적과 노사 협의에 따라 달라집니다. 직접 입력 모드를 이용해 본인이 알고 있는 조건을 반영해 보세요." },
    { question: "삼성전자·SK하이닉스와 비교하면 어느 쪽이 더 많나요?", answer: "업종·연도·실적에 따라 다르며, 총보상(고정급+성과급+복지)을 함께 비교해야 합니다. 비교 차트를 참고하거나 대기업 성과급 시뮬레이터를 이용해 보세요." },
    { question: "세후로 얼마나 받나요?", answer: "성과급은 근로소득으로 합산 과세됩니다. 개인 과세표준에 따라 세율이 다르며, 이 계산기의 세후 값은 참고용입니다. 정확한 세후 금액은 성과급 세후 계산기를 이용하세요." },
    { question: "PI·PS는 언제 지급되나요?", answer: "통상 익년 1~2월경 지급되는 것으로 알려져 있으나, 정확한 지급 시기는 연도와 계열사에 따라 달라질 수 있습니다." },
  ]}
  related={[
    { href: "/tools/bonus-simulator/", label: "대기업 성과급 시뮬레이터" },
    { href: "/reports/corporate-bonus-comparison-2026/", label: "2026 대기업 성과급 완전 비교" },
    { href: "/tools/bonus-after-tax-calculator/", label: "성과급 세후 실수령액 계산기" },
    { href: "/tools/samsung-bonus/", label: "삼성전자 성과급 계산기" },
    { href: "/tools/sk-hynix-bonus/", label: "SK하이닉스 성과급 계산기" },
    { href: "/tools/lg-bonus/", label: "LG전자 성과급 계산기" },
    { href: "/tools/hyundai-bonus/", label: "현대자동차 성과급 계산기" },
  ]}
/>
```

---

## 14. 구현 순서

1. `src/data/poscoBonusCalculator2026.ts` 작성 (스키마 + 데이터, 8-2의 LG전자 비교값 산정 포함)
2. `src/pages/tools/posco-bonus-calculator.astro` 작성 (Astro 페이지)
3. `src/styles/scss/pages/_posco-bonus-calculator.scss` 작성 및 `src/styles/app.scss`에 import 추가
4. `public/scripts/posco-bonus-calculator.js` 작성 (계산 로직·DOM·Chart.js)
5. `src/data/tools.ts`에 `posco-bonus-calculator` 항목 등록
6. `public/sitemap.xml`에 URL 추가
7. `src/pages/index.astro`의 `topicBySlug`에 등록
8. OG 이미지 생성 또는 기본 이미지 연결
9. `npm run build` 성공 확인
10. 로컬 확인 후 배포

---

## 15. QA 체크리스트

### 콘텐츠 QA

- [ ] H1/title/description에 `포스코 성과급 계산기`가 자연스럽게 포함됨
- [ ] `포스코 PI PS`, `포스코퓨처엠 성과급`, `포스코인터내셔널 성과급` 키워드가 H2 또는 본문에 포함됨
- [ ] 계열사 4개(포스코·포스코퓨처엠·포스코인터내셔널·포스코이앤씨) 모두 선택 가능
- [ ] 직급별 월 기본급 preset이 적용되고 직접 수정 가능
- [ ] 추정값·시뮬레이션 배지가 계산기 상단 및 결과 카드에 표시됨
- [ ] 확정 지급률처럼 오해할 수 있는 표현 없음
- [ ] 세후 추정값이 참고값으로만 안내됨
- [ ] FAQ 5개 이상 포함됨, SeoContent intro 5문단/800자 이상

### UX QA

- [ ] 계열사 변경 시 지급률 범위 힌트(`trend`)가 자동 업데이트됨
- [ ] 슬라이더 ↔ 직접입력 양방향 동기화 정상 동작
- [ ] 지급률 모드 전환 시 시나리오 블록 / 직접입력 블록이 올바르게 토글됨
- [ ] 상단 CTA (세후·투자) 링크가 성과급 금액 prefill로 연결됨
- [ ] 삼성전자·SK하이닉스·LG전자·현대자동차 내부 링크가 연결됨
- [ ] 모바일에서 계열사 셀렉트와 슬라이더가 사용하기 편함
- [ ] 직급별 예상표가 모바일에서 깨지지 않음

### 기술 QA

- [ ] `npm run build` 성공, 빌드 에러 없음
- [ ] `/tools/posco-bonus-calculator/` 라우트 생성 확인
- [ ] `tools.ts` 등록 확인
- [ ] `sitemap.xml` 등록 확인 (trailing slash, changefreq 유효값)
- [ ] `app.scss`에 `_posco-bonus-calculator.scss` import 등록 확인
- [ ] Chart.js CDN 로드 및 차트 렌더링 정상
- [ ] URL 파라미터 공유 링크 복원 정상 동작
- [ ] 링크 404 없음

---

## 16. 발행 후 관찰 지표

7~14일 기준:

- `/tools/posco-bonus-calculator/` 세션 수
- `포스코 성과급`, `포스코 성과급 계산기`, `포스코퓨처엠 성과급` 검색어 등장 여부
- CTR 8% 이상 여부
- `/tools/bonus-after-tax-calculator/` 내부 이동
- `/tools/bonus-simulator/` 내부 이동
- `/tools/dca-investment-calculator/` 내부 이동

초기 목표:

- 7일 세션 50 이상
- CTR 8% 이상
- 타 성과급 계산기 내부 이동 10건 이상
