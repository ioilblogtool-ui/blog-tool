# LG전자 성과급 계산기 — 설계 문서

> 기획 원문: `docs/plan/202605/lg-bonus-calculator.md`
> 작성일: 2026-05-24
> 구현 기준: Codex/Claude가 이 문서만 보고 `/tools/lg-bonus/` 계산기 페이지 구현에 착수할 수 있는 수준
> 참고 페이지: `samsung-bonus`, `sk-hynix-bonus`, `hyundai-bonus`, `bonus-simulator`

---

## 1. 문서 개요

### 1-1. 대상

- 구현 대상: `LG전자 성과급 계산기`
- 콘텐츠 유형: 계산기 (tool)
- slug: `lg-bonus`
- URL: `/tools/lg-bonus/`

### 1-2. 문서 역할

- 기획 문서를 현재 비교계산소 계산기 구조에 맞게 구현 단위로 고정한다.
- 데이터 스키마, 페이지 섹션, 입출력 설계, CTA 흐름, 스타일 prefix, QA 기준을 정의한다.
- 구현자는 이 문서를 기준으로 `src/data/lgCompensation.ts`, `src/pages/tools/lg-bonus.astro`, `public/scripts/lg-bonus.js`, `src/styles/scss/pages/_lg-bonus.scss` 작업을 진행한다.

### 1-3. 페이지 성격

- **사업부별 PI 계산기**: H&A·HE·VS·BS 사업부 선택 → 직급별 기본급 프리셋 → 상·하반기 PI 지급률 → 세전·세후 추정 결과
- **성과급 시리즈 확장**: 삼성전자·SK하이닉스·현대차와 동일 연봉 기준 비교 바 차트 포함
- **계산기 유도형**: 계산 결과 → 세후 계산기 → DCA 계산기로 연결

### 1-4. 권장 파일 구조

```txt
src/
  data/
    lgCompensation.ts
  pages/
    tools/
      lg-bonus.astro

public/
  scripts/
    lg-bonus.js
  og/
    tools/
      lg-bonus.png

src/styles/scss/pages/
  _lg-bonus.scss
```

필수 등록:

- `src/data/tools.ts`
- `src/styles/app.scss`
- `public/sitemap.xml`

---

## 2. SEO 설계

### 2-1. 메타

```ts
title: "LG전자 성과급 계산기｜H&A·HE·VS·BS 사업부별 PI 세전·세후 계산"
description: "LG전자 성과급 PI를 사업부와 기본급 기준으로 계산해보세요. H&A·HE·VS·BS 사업부별 지급률 추정값과 세전·세후 체감액, 삼성전자·SK하이닉스 비교까지 확인할 수 있습니다."
ogImage: "/og/tools/lg-bonus.png"
```

### 2-2. 핵심 키워드 매핑

| 키워드 | 반영 위치 |
|---|---|
| LG전자 성과급 계산기 | title, H1, hero |
| LG전자 PI 계산 | title, 섹션 H2 |
| LG전자 성과급 얼마 | hero sub, FAQ |
| LG전자 사업부별 성과급 | 사업부 선택 섹션, FAQ |
| LG전자 H&A 성과급 | 사업부별 카드 |
| LG전자 VS 성과급 | 사업부별 카드 |
| LG전자 PI 세후 | 세후 섹션, FAQ |

---

## 3. 데이터 스키마

### 3-1. `src/data/lgCompensation.ts`

```ts
export type LgDivisionCode = "HA" | "HE" | "VS" | "BS";
export type LgRankCode = "STAFF" | "ASSISTANT_MANAGER" | "MANAGER" | "DEPUTY_GM" | "GM";
export type LgScenarioCode = "CONSERVATIVE" | "BASE" | "AGGRESSIVE";

export interface LgDivisionConfig {
  code: LgDivisionCode;
  label: string;           // "H&A"
  fullName: string;        // "Home Appliance & Air Solution"
  description: string;     // "냉장고·세탁기·에어컨"
  piRangeH1: { min: number; max: number };  // % 정수
  piRangeH2: { min: number; max: number };
  baseScenario: Record<LgScenarioCode, { h1: number; h2: number }>;
  trend: string;           // "꾸준한 실적, PI 비교적 안정적"
  badge: "추정" | "시뮬레이션";
}

export interface LgRankPreset {
  code: LgRankCode;
  label: string;            // "대리"
  defaultMonthlyBase: number;  // 월 기본급 (원)
  defaultAnnualSalary: number; // 연봉 참고값 (원)
}

export interface LgComparisonItem {
  company: string;
  slug: string;
  label: string;
  piH1: number;    // 기준 시나리오 상반기 % (동일 연봉 기준)
  piH2: number;    // 기준 시나리오 하반기 %
  color: string;   // Chart.js 색상
}

export interface LgRelatedLink {
  href: string;
  label: string;
  desc: string;
}

export interface LgAffiliateProduct {
  url: string;
  tag: string;
  title: string;
  desc: string;
}
```

### 3-2. 데이터 export 목록

```ts
export const lgDivisions: LgDivisionConfig[];       // 사업부 4개
export const lgRankPresets: LgRankPreset[];          // 직급 5개
export const lgComparisonItems: LgComparisonItem[];  // 타사 비교용 4개
export const LG_NEXT_CALCULATOR: LgRelatedLink;
export const LG_RELATED_CALCULATORS: LgRelatedLink[];
export const LG_EXTERNAL_REFERENCE_LINKS: Array<{ url: string; title: string; desc: string }>;
export const LG_AFFILIATE_PRODUCTS: LgAffiliateProduct[];
```

### 3-3. 사업부 데이터 (추정값)

```ts
export const lgDivisions: LgDivisionConfig[] = [
  {
    code: "HA",
    label: "H&A",
    fullName: "Home Appliance & Air Solution",
    description: "냉장고·세탁기·에어컨",
    piRangeH1: { min: 50, max: 150 },
    piRangeH2: { min: 50, max: 150 },
    baseScenario: {
      CONSERVATIVE: { h1: 50, h2: 50 },
      BASE:         { h1: 100, h2: 100 },
      AGGRESSIVE:   { h1: 150, h2: 150 },
    },
    trend: "프리미엄 가전 실적 양호, PI 비교적 안정적",
    badge: "추정",
  },
  {
    code: "HE",
    label: "HE",
    fullName: "Home Entertainment",
    description: "TV·모니터·사이니지",
    piRangeH1: { min: 0, max: 100 },
    piRangeH2: { min: 50, max: 150 },
    baseScenario: {
      CONSERVATIVE: { h1: 0, h2: 50 },
      BASE:         { h1: 50, h2: 100 },
      AGGRESSIVE:   { h1: 100, h2: 150 },
    },
    trend: "TV 시장 수요 둔화, 연도별 변동 폭 큼",
    badge: "추정",
  },
  {
    code: "VS",
    label: "VS",
    fullName: "Vehicle component Solutions",
    description: "전기차 부품·인포테인먼트",
    piRangeH1: { min: 0, max: 100 },
    piRangeH2: { min: 0, max: 100 },
    baseScenario: {
      CONSERVATIVE: { h1: 0, h2: 0 },
      BASE:         { h1: 50, h2: 50 },
      AGGRESSIVE:   { h1: 100, h2: 100 },
    },
    trend: "흑자 전환 과도기, PI 불확실",
    badge: "추정",
  },
  {
    code: "BS",
    label: "BS",
    fullName: "Business Solutions",
    description: "B2B·상업용 디스플레이",
    piRangeH1: { min: 50, max: 125 },
    piRangeH2: { min: 50, max: 150 },
    baseScenario: {
      CONSERVATIVE: { h1: 50, h2: 50 },
      BASE:         { h1: 75, h2: 100 },
      AGGRESSIVE:   { h1: 125, h2: 150 },
    },
    trend: "B2B 사업 안정적, PI 중간 수준 꾸준",
    badge: "추정",
  },
];
```

### 3-4. 직급 프리셋

```ts
export const lgRankPresets: LgRankPreset[] = [
  { code: "STAFF",              label: "사원", defaultMonthlyBase: 3200000,  defaultAnnualSalary: 55000000 },
  { code: "ASSISTANT_MANAGER",  label: "대리", defaultMonthlyBase: 4000000,  defaultAnnualSalary: 70000000 },
  { code: "MANAGER",            label: "과장", defaultMonthlyBase: 4900000,  defaultAnnualSalary: 85000000 },
  { code: "DEPUTY_GM",          label: "차장", defaultMonthlyBase: 5900000,  defaultAnnualSalary: 100000000 },
  { code: "GM",                 label: "부장", defaultMonthlyBase: 7000000,  defaultAnnualSalary: 120000000 },
];
```

### 3-5. 계산 로직

계산식:

```
PI 세전 = 월 기본급 × 지급률(%) / 100
상반기 PI = 월 기본급 × h1 / 100
하반기 PI = 월 기본급 × h2 / 100
연간 PI 세전 = 상반기 PI + 하반기 PI + 임협 타결금
월 기본급 환산 배수 = 연간 PI 세전 / 월 기본급
연봉 대비 비율 = 연간 PI 세전 / (월 기본급 × 12) × 100
세후 추정 = 연간 PI 세전 × (1 - 추정세율)
```

세후 추정 세율 (참고용, 누진 단순화):

```ts
function estimateTaxRate(bonusAmount: number): number {
  if (bonusAmount < 10000000) return 0.165;   // 16.5%
  if (bonusAmount < 30000000) return 0.264;   // 26.4%
  if (bonusAmount < 50000000) return 0.374;   // 37.4%
  return 0.418;                                // 41.8%
}
```

> 세후 금액은 개인 과세표준·공제 조건에 따라 달라지는 참고값이다. 정확한 세후 금액은 세후 계산기로 연결한다.

---

## 4. 페이지 구조

### 4-1. 레이아웃 쉘

`SimpleToolShell.astro` — `resultFirst={true}` 패턴 사용 (삼성 계산기와 동일)

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
  lgDivisions,
  lgRankPresets,
  lgComparisonItems,
  LG_NEXT_CALCULATOR,
  LG_RELATED_CALCULATORS,
  LG_EXTERNAL_REFERENCE_LINKS,
  LG_AFFILIATE_PRODUCTS,
} from "../../data/lgCompensation";
---
```

### 4-3. 레이아웃 순서

```txt
BaseLayout
  SiteHeader
  SimpleToolShell (calculatorId="lg-bonus" pageClass="lg-bonus-page" resultFirst={true})
    slot:hero → CalculatorHero
    slot:actions → ToolActionBar
    slot:aside → 입력 패널
    [결과 우선 패널]
    [A] KPI 핵심 카드
    [B] 다음 계산 CTA (세후·투자)
    [C] LG전자 PI 구조 설명
    [D] 사업부별 PI 비교 바 차트
    [E] 직급별 예상 성과급 표
    [F] 타 대기업 비교 바 차트
    [G] 계산 기준 요약
    InfoNotice
    [H] 다음 계산기 CTA 카드
    [I] 관련 계산기 그리드
    [J] 외부 참고 링크
    [K] 제휴 상품
    slot:seo → SeoContent (FAQ 포함)
```

---

## 5. 입력 패널 설계

### 5-1. 입력 구성 (`slot:aside`)

```astro
<div class="stack" id="lg-bonus-inputs">

  <!-- 사업부 + 직급 + 기본급 -->
  <article class="panel">
    <div class="panel-heading">
      <div>
        <p class="panel-heading__eyebrow">빠른 입력</p>
        <h2 class="panel__title">사업부·직급·기본급 입력</h2>
      </div>
    </div>

    <div class="form-grid form-grid--compact">

      <label class="field">
        <span>사업부</span>
        <select id="lgDivisionSelect">
          {lgDivisions.map((d) => <option value={d.code}>{d.label} — {d.description}</option>)}
        </select>
        <small id="lgDivisionHint"></small>
      </label>

      <label class="field">
        <span>직급</span>
        <select id="lgRankSelect">
          {lgRankPresets.map((r) => <option value={r.code}>{r.label}</option>)}
        </select>
      </label>

      <label class="field field-span-full">
        <span>월 기본급</span>
        <input id="lgMonthlyBaseInput" type="number" value="4000000" />
        <small id="lgMonthlyBaseHint">직급 선택 시 예시값이 자동 입력됩니다. 직접 수정 가능합니다.</small>
        <div class="calc-slider-row">
          <input type="range" id="lgMonthlyBaseSlider" class="calc-slider"
            min="2000000" max="12000000" step="100000" value="4000000" />
          <span id="lgMonthlyBaseSliderVal" class="calc-slider-val">400만원</span>
        </div>
      </label>

    </div>
  </article>

  <!-- 지급 기준 선택 -->
  <article class="panel">
    <div class="panel-heading">
      <div>
        <p class="panel-heading__eyebrow">PI 지급률 설정</p>
        <h2 class="panel__title">추정값 또는 직접 입력</h2>
      </div>
    </div>

    <div class="toggle-grid">
      <label class="mode-chip">
        <input id="piModeEstimate" name="piMode" type="radio" value="ESTIMATE" checked />
        <span>추정값 사용</span>
      </label>
      <label class="mode-chip">
        <input id="piModeCustom" name="piMode" type="radio" value="CUSTOM" />
        <span>직접 입력</span>
      </label>
    </div>
    <small id="piModeHint">추정값은 보도 기반 시뮬레이션이며 실제 지급률과 다를 수 있습니다.</small>

    <!-- 시나리오 선택 (추정값 모드일 때 표시) -->
    <div id="lgScenarioBlock">
      <div class="toggle-grid">
        <label class="mode-chip">
          <input name="lgScenario" type="radio" value="CONSERVATIVE" />
          <span>보수적</span>
        </label>
        <label class="mode-chip">
          <input name="lgScenario" type="radio" value="BASE" checked />
          <span>기준</span>
        </label>
        <label class="mode-chip mode-chip--highlight">
          <input name="lgScenario" type="radio" value="AGGRESSIVE" />
          <span>낙관적</span>
        </label>
      </div>
      <small id="lgScenarioHint"></small>
    </div>

    <!-- 직접 입력 (직접 입력 모드일 때 표시) -->
    <div id="lgCustomPiBlock" hidden>
      <div class="form-grid form-grid--compact">
        <label class="field">
          <span>상반기 PI 지급률 (%)</span>
          <input id="lgPiH1Input" type="number" value="100" min="0" max="200" step="5" />
          <div class="calc-slider-row">
            <input type="range" id="lgPiH1Slider" class="calc-slider" min="0" max="200" step="5" value="100" />
            <span id="lgPiH1SliderVal" class="calc-slider-val">100%</span>
          </div>
        </label>
        <label class="field">
          <span>하반기 PI 지급률 (%)</span>
          <input id="lgPiH2Input" type="number" value="100" min="0" max="200" step="5" />
          <div class="calc-slider-row">
            <input type="range" id="lgPiH2Slider" class="calc-slider" min="0" max="200" step="5" value="100" />
            <span id="lgPiH2SliderVal" class="calc-slider-val">100%</span>
          </div>
        </label>
      </div>
    </div>
  </article>

  <!-- 선택 입력 (임협 타결금) -->
  <details class="detail-box detail-box--soft">
    <summary>임협 타결금 추가 입력</summary>
    <div class="detail-box__content detail-box__content--tight">
      <div class="form-grid form-grid--compact">
        <label class="field">
          <span>임금협상 타결금 (만 원)</span>
          <input id="lgUnionBonusInput" type="number" value="0" step="10" />
          <small>미입력 시 0으로 계산합니다.</small>
        </label>
      </div>
    </div>
  </details>

  <button id="calcLgBonusBtn" class="button button--primary" type="button">성과급 계산하기</button>

</div>
```

---

## 6. 출력 섹션 설계

### [결과 우선 패널]

```astro
<article class="panel result-priority-panel" id="lg-bonus-results">
  <div class="panel-heading">
    <div>
      <p class="panel-heading__eyebrow">결과 먼저 보기</p>
      <h2 class="panel__title">내 예상 성과급</h2>
    </div>
  </div>
  <div class="result-priority-panel__actions">
    <a class="button button--secondary" href="#lg-bonus-inputs">조건 다시 입력</a>
    <a class="button button--ghost" href="#lg-bonus-details">세부 내역 보기</a>
  </div>
</article>
```

### [A] KPI 핵심 카드

```astro
<section class="lgb-section">
  <div class="lgb-section__head">
    <p class="lgb-section__eyebrow">내 계산 결과</p>
    <h2 id="lgResultHeadline">LG전자 성과급 계산 결과</h2>
    <p class="lgb-section__sub" id="lgResultSubcopy">사업부·직급 기준 시뮬레이션</p>
  </div>
  <div class="kpi-grid">
    <article class="kpi-card kpi-card--accent">
      <p>연간 PI 합계 (세전)</p>
      <strong id="lgTotalPiGross">-</strong>
      <span id="lgTotalPiGrossNote">시뮬레이션</span>
    </article>
    <article class="kpi-card">
      <p>연간 PI 합계 (세후 추정)</p>
      <strong id="lgTotalPiNet">-</strong>
      <span id="lgTotalPiNetNote">참고값</span>
    </article>
    <article class="kpi-card">
      <p>월 기본급 대비</p>
      <strong id="lgMonthlyRatio">-</strong>
      <span id="lgMonthlyRatioNote">개월치</span>
    </article>
    <article class="kpi-card">
      <p>연봉 대비 비율</p>
      <strong id="lgAnnualRatio">-</strong>
      <span id="lgAnnualRatioNote">참고값</span>
    </article>
  </div>
</section>
```

### [B] 다음 계산 CTA

```astro
<section class="lgb-next-step" aria-label="계산 결과 다음 단계">
  <p class="lgb-section__eyebrow">지금 바로 이어서</p>
  <div class="lgb-next-step__actions">
    <a id="lgAfterTaxCta" class="button button--primary"
       href={withBase("/tools/bonus-after-tax-calculator/?company=lg")}>
      세후 실수령 계산하기 →
    </a>
    <a id="lgDcaCta" class="button button--secondary"
       href={withBase("/tools/dca-investment-calculator/?m=300000&p=10&a=SP500,NASDAQ100,QQQ&fx=1&div=1")}>
      이 금액 투자하면? →
    </a>
  </div>
  <p class="lgb-next-step__note" id="lgNextStepNote">
    성과급 세전 금액을 기준으로 다음 계산기에 자동 반영합니다.
  </p>
</section>
```

### [C] LG전자 PI 구조 설명

```astro
<section class="lgb-section" id="lg-bonus-details">
  <div class="lgb-section__head">
    <p class="lgb-section__eyebrow">PI 구조</p>
    <h2>LG전자 성과급 PI란?</h2>
  </div>
  <div class="lgb-logic-grid">
    <article class="lgb-logic-card">
      <strong>PI (Performance Incentive)</strong>
      <p>사업부 목표 달성률 기반 인센티브로 상반기(7월경)·하반기(1월경) 연 2회 지급합니다.</p>
    </article>
    <article class="lgb-logic-card">
      <strong>OB (Outperformance Bonus)</strong>
      <p>목표 초과 달성 시 추가 지급되는 구조이나 지급 기준이 비공개이므로 이 계산기에는 포함하지 않습니다.</p>
    </article>
    <article class="lgb-logic-card">
      <strong>기본급 기준인 이유</strong>
      <p>PI는 연봉 총액이 아니라 월 기본급을 기준으로 지급률을 곱해 산정합니다. 각종 수당은 제외됩니다.</p>
    </article>
    <article class="lgb-logic-card">
      <strong>사업부마다 PI가 다른 이유</strong>
      <p>각 사업부가 독립 P&L 단위로 운영되어 실적과 목표달성률에 따라 지급률이 달라집니다.</p>
    </article>
  </div>
</section>
```

### [D] 사업부별 PI 비교 바 차트

```astro
<section class="lgb-section lgb-division-section">
  <div class="lgb-section__head">
    <p class="lgb-section__eyebrow">사업부별 PI 비교</p>
    <h2>H&A·HE·VS·BS 사업부 PI 범위</h2>
    <p>보수·기준·낙관적 시나리오 기준 추정값입니다.</p>
  </div>
  <div class="lgb-division-chart-wrap">
    <canvas id="lg-division-chart"></canvas>
  </div>
  <div class="lgb-division-grid">
    {lgDivisions.map((d) => (
      <article class="lgb-division-card" data-code={d.code}>
        <p class="lgb-division-card__label">{d.label}</p>
        <strong class="lgb-division-card__full">{d.fullName}</strong>
        <span class="lgb-division-card__desc">{d.description}</span>
        <p class="lgb-division-card__trend">{d.trend}</p>
        <span class="estimate-badge">{d.badge}</span>
      </article>
    ))}
  </div>
</section>
```

### [E] 직급별 예상 성과급 표

```astro
<section class="lgb-section">
  <div class="lgb-section__head">
    <p class="lgb-section__eyebrow">직급별 예시</p>
    <h2>직급별 예상 성과급 (현재 사업부·시나리오 기준)</h2>
  </div>
  <div class="table-wrap">
    <table class="result-table lgb-rank-table">
      <thead>
        <tr>
          <th>직급</th>
          <th>월 기본급</th>
          <th>연간 PI 세전</th>
          <th>세후 추정</th>
          <th>월급 대비</th>
        </tr>
      </thead>
      <tbody id="lgRankTableBody">
        <!-- JS로 렌더링 -->
      </tbody>
    </table>
  </div>
  <div class="lgb-inline-cta">
    <a class="button button--primary" href="#lg-bonus-inputs">내 직급·기본급으로 다시 계산하기</a>
  </div>
</section>
```

### [F] 타 대기업 비교 바 차트

```astro
<section class="lgb-section">
  <div class="lgb-section__head">
    <p class="lgb-section__eyebrow">대기업 비교</p>
    <h2>삼성전자·SK하이닉스·현대차와 성과급 비교</h2>
    <p>동일 연봉 기준 기준 시나리오 시뮬레이션입니다. 실제 지급 구조와 다를 수 있습니다.</p>
  </div>
  <div class="lgb-compare-chart-wrap">
    <canvas id="lg-compare-chart"></canvas>
  </div>
  <div class="lgb-compare-cta">
    <a class="button button--secondary" href={withBase("/tools/bonus-simulator/")}>
      4개사 성과급 한 번에 비교하기 →
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
  <div class="lgb-logic-grid">
    <article class="lgb-logic-card">
      <strong>PI = 월 기본급 × 지급률(%)</strong>
      <p>상반기·하반기 각각 월 기본급에 지급률을 곱합니다.</p>
    </article>
    <article class="lgb-logic-card">
      <strong>연간 PI = 상반기 + 하반기 + 임협 타결금</strong>
      <p>임협 타결금은 0 기본값이며 직접 입력 가능합니다.</p>
    </article>
    <article class="lgb-logic-card">
      <strong>세후는 참고값</strong>
      <p>개인 과세표준과 공제 조건에 따라 실제 세후 금액은 달라집니다.</p>
    </article>
    <article class="lgb-logic-card">
      <strong>사업부 지급률은 추정값</strong>
      <p>보도 기반 시뮬레이션이며 실제 목표달성률에 따라 달라질 수 있습니다.</p>
    </article>
  </div>
</article>
```

---

## 7. 인터랙션 설계

### 7-1. 상태 관리

```js
const state = {
  division: "HA",
  rank: "ASSISTANT_MANAGER",
  monthlyBase: 4000000,
  piMode: "ESTIMATE",      // "ESTIMATE" | "CUSTOM"
  scenario: "BASE",         // "CONSERVATIVE" | "BASE" | "AGGRESSIVE"
  piH1Custom: 100,          // 직접 입력 모드 상반기 %
  piH2Custom: 100,          // 직접 입력 모드 하반기 %
  unionBonus: 0,            // 임협 타결금 (원)
};
```

### 7-2. 이벤트 흐름

1. 사업부 또는 직급 변경 → 월 기본급 프리셋 자동 세팅, 사업부 추이 힌트 업데이트
2. 슬라이더 ↔ 직접입력 양방향 동기화 (삼성 계산기 동일 패턴)
3. PI 모드 전환 → 시나리오 블록 / 직접입력 블록 토글 표시
4. `calcLgBonusBtn` 클릭 또는 주요 입력 변경 → `calculate()` 실행
5. `calculate()` 실행 시:
   - KPI 카드 업데이트
   - 직급별 예상표 리렌더링
   - 타사 비교 바 차트 업데이트
   - 다음 계산기 CTA URL prefill

### 7-3. CTA URL prefill

```js
// 세후 계산기
const afterTaxUrl = `/tools/bonus-after-tax-calculator/?bonus=${totalPiGross}&salary=${annualSalary}&company=lg`;

// DCA 계산기
const monthlyInvest = Math.min(3000000, Math.max(100000, Math.round((totalPiGross / 12) / 50000) * 50000));
const dcaUrl = `/tools/dca-investment-calculator/?m=${monthlyInvest}&p=10&a=SP500,NASDAQ100,QQQ&fx=1&div=1`;
```

### 7-4. URL 파라미터 (공유 링크)

```
/tools/lg-bonus/?div=HA&rank=ASSISTANT_MANAGER&base=4000000&piMode=BASE
```

복원 시: URL 파라미터 → state → `calculate()` 순서로 처리

---

## 8. Chart.js 설계

### 8-1. 사업부별 PI 범위 바 차트 (`lg-division-chart`)

```js
{
  type: "bar",
  data: {
    labels: ["H&A", "HE", "VS", "BS"],
    datasets: [
      { label: "보수적 (상+하)", data: [...], backgroundColor: "#93C5FD" },
      { label: "기준 (상+하)",   data: [...], backgroundColor: "#1A56DB" },
      { label: "낙관적 (상+하)", data: [...], backgroundColor: "#1E429F" },
    ]
  },
  options: { responsive: true, plugins: { legend: { position: "top" } } }
}
```

Y축: PI 합계 % (0~400%)

### 8-2. 타사 비교 가로 바 차트 (`lg-compare-chart`)

```js
{
  type: "bar",
  data: {
    labels: ["LG전자", "삼성전자", "SK하이닉스", "현대차"],
    datasets: [
      {
        label: "연간 성과급 (세전, 추정)",
        data: [lgTotal, samsungTotal, skhynixTotal, hyundaiTotal],
        backgroundColor: ["#1A56DB", "#1E429F", "#0F6E56", "#B45309"],
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

> 타사 비교값은 `lgComparisonItems` 데이터의 기준 시나리오 PI를 사용자 입력 월 기본급에 적용하여 계산한다.

---

## 9. 스타일 설계

### 9-1. Prefix

- 페이지 루트: `.lg-bonus-page`
- 섹션: `.lgb-section`
- KPI: `.kpi-grid`, `.kpi-card` (공통 클래스 재사용)
- 로직 카드: `.lgb-logic-grid`, `.lgb-logic-card`
- 사업부 카드: `.lgb-division-grid`, `.lgb-division-card`
- 비교: `.lgb-compare-chart-wrap`, `.lgb-compare-cta`
- 다음 단계 CTA: `.lgb-next-step`

### 9-2. 시각 톤

- LG 브랜드 연상: `#A50034` (레드), `#1A56DB` (블루 primary)
- 기본 색상은 사이트 blue primary `#1A56DB` 기반으로 일관성 유지
- 추정/시뮬레이션 배지: `estimate-badge` 공통 클래스 재사용

### 9-3. SCSS 골격

```scss
.lg-bonus-page {
  .lgb-section {
    padding: 24px 0;
  }

  .lgb-section__head {
    margin-bottom: 16px;
  }

  .lgb-logic-grid,
  .lgb-division-grid {
    display: grid;
    gap: 10px;
    grid-template-columns: 1fr;
  }

  .lgb-logic-card,
  .lgb-division-card {
    border: 1px solid #E0DFDB;
    border-radius: 10px;
    padding: 16px;
    background: #FFFFFF;
  }

  .lgb-division-chart-wrap,
  .lgb-compare-chart-wrap {
    width: 100%;
    max-height: 280px;
    margin-bottom: 16px;
    overflow: hidden;
  }

  .lgb-next-step {
    border: 1px solid #DBEAFE;
    border-radius: 10px;
    background: #EFF6FF;
    padding: 18px;
    margin: 16px 0;
  }

  .lgb-next-step__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 12px 0 8px;
  }

  .lgb-next-step__note {
    font-size: 0.75rem;
    color: #6B7280;
    margin: 0;
  }

  .lgb-inline-cta {
    margin-top: 16px;
    text-align: center;
  }
}

@media (min-width: 768px) {
  .lg-bonus-page {
    .lgb-logic-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .lgb-division-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
}

@media (min-width: 1024px) {
  .lg-bonus-page {
    .lgb-division-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }
}
```

---

## 10. `tools.ts` 등록

```ts
{
  slug: "lg-bonus",
  title: "LG전자 성과급 계산기",
  description: "H&A·HE·VS·BS 사업부별 PI 지급률과 기본급을 입력해 세전·세후 성과급을 계산합니다.",
  category: "bonus",
  order: 4.5,           // samsung-bonus, sk-hynix-bonus, hyundai-bonus 다음
  badges: ["추정", "시뮬레이션"],
  isNew: true,
}
```

---

## 11. Sitemap / OG

### 11-1. sitemap.xml

```xml
<url>
  <loc>https://bigyocalc.com/tools/lg-bonus/</loc>
  <lastmod>2026-05-24</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

### 11-2. OG 이미지

```txt
public/og/tools/lg-bonus.png
```

텍스트:
- 메인: `LG전자 성과급 계산기`
- 서브: `H&A·HE·VS·BS 사업부별 PI 세전·세후`

---

## 12. InfoNotice 문구

```astro
<InfoNotice
  title="안내"
  lines={[
    "사업부별 PI 지급률 기본값은 보도 기반 추정값이며, 실제 지급률은 LG전자 내부 목표달성률에 따라 달라집니다.",
    "직급별 월 기본급은 참고 예시값이며 본인 기본급을 직접 입력해 사용하세요.",
    "세후 추정값은 개인 과세표준·공제 조건에 따라 실제 수령액과 다를 수 있습니다.",
    "이 계산기는 투자 권유 또는 특정 사업부 입사를 권장하지 않습니다.",
  ]}
/>
```

---

## 13. SeoContent (FAQ 포함)

```astro
<SeoContent
  introTitle="LG전자 성과급 계산기 활용 가이드"
  intro={[
    "이 계산기는 LG전자 H&A·HE·VS·BS 사업부별 PI 지급률 추정값을 기반으로 기본급 대비 세전·세후 성과급을 시뮬레이션합니다.",
    "사업부를 선택하면 해당 사업부의 보수·기준·낙관적 시나리오가 자동 반영됩니다. 직접 입력 모드로 전환하면 지급률을 자유롭게 조정할 수 있습니다."
  ]}
  inputPoints={[
    "사업부 선택 후 직급을 고르면 월 기본급 예시값이 자동 입력됩니다.",
    "추정값 모드에서는 보수·기준·낙관 시나리오 중 하나를 선택해 PI 범위를 확인할 수 있습니다.",
    "직접 입력 모드에서는 상·하반기 지급률을 슬라이더로 직접 조정합니다.",
    "임협 타결금은 선택 입력이며 0 기본값으로 계산됩니다.",
    "삼성전자·SK하이닉스·현대차와 동일 연봉 기준 비교 차트를 함께 확인할 수 있습니다."
  ]}
  criteria={[
    "PI는 월 기본급에 지급률(%)을 곱해 산정하며 각종 수당은 포함하지 않습니다.",
    "사업부별 PI 기본 시나리오는 보도 및 업계 추정 기반이며 실제 목표달성률과 다를 수 있습니다.",
    "세후 추정은 근로소득 합산 과세 기준 단순화 누진세율을 적용한 참고값입니다.",
    "타사 비교 시뮬레이션은 각 계산기의 기준 시나리오를 동일 월 기본급에 적용한 추정값입니다."
  ]}
  faq={[
    { question: "LG전자 성과급 PI가 뭔가요?", answer: "PI(Performance Incentive)는 상·하반기 목표 달성률 기반 인센티브로, 월 기본급의 일정 %를 연 2회 지급합니다." },
    { question: "사업부마다 PI가 다른 이유는?", answer: "각 사업부가 독립 P&L 단위로 운영되어 실적 기반 지급률이 달라집니다. H&A, HE, VS, BS 모두 지급 기준이 다릅니다." },
    { question: "신입은 PI를 첫해부터 받나요?", answer: "입사 시점에 따라 재직 기간 안분 지급이 일반적입니다. 정확한 기준은 사업부마다 다를 수 있습니다." },
    { question: "LG전자 성과급 계산기의 수치는 정확한가요?", answer: "보도 및 추정 기반 시뮬레이션 값으로 실제 지급률은 내부 목표달성률에 따라 달라집니다. 직접 입력 모드를 이용해 본인 조건을 반영하세요." },
    { question: "삼성전자와 LG전자 성과급 어디가 더 많나요?", answer: "사업부·직급·연도별로 다르며, 총보상(고정+변동+복지)을 함께 비교해야 합니다. 비교 차트를 참고하거나 대기업 성과급 시뮬레이터를 이용하세요." },
    { question: "세후로 얼마나 받나요?", answer: "PI는 근로소득으로 합산 과세됩니다. 개인 과세표준에 따라 세율이 다르며, 계산기 세후 값은 참고용입니다. 정확한 세후 금액은 성과급 세후 계산기를 이용하세요." },
    { question: "LG전자 OB(초과 달성 보너스)는 얼마나 되나요?", answer: "OB는 초과 달성 시 추가 지급되는 구조이나 지급 기준이 비공개이므로 이 계산기에는 포함하지 않습니다." },
    { question: "임협 타결금은 언제 지급되나요?", answer: "임금협상 타결 시 일시금으로 지급되며 연 1회가 일반적입니다. 지급 시기와 금액은 협상 결과에 따라 달라집니다." }
  ]}
  related={[
    { href: "/tools/bonus-simulator/", label: "대기업 성과급 시뮬레이터" },
    { href: "/reports/corporate-bonus-comparison-2026/", label: "2026 대기업 성과급 완전 비교" },
    { href: "/tools/bonus-after-tax-calculator/", label: "성과급 세후 실수령액 계산기" },
    { href: "/tools/samsung-bonus/", label: "삼성전자 성과급 계산기" },
    { href: "/tools/sk-hynix-bonus/", label: "SK하이닉스 성과급 계산기" },
    { href: "/tools/hyundai-bonus/", label: "현대자동차 성과급 계산기" },
  ]}
/>
```

---

## 14. 구현 순서

1. `src/data/lgCompensation.ts` 작성 (스키마 + 데이터)
2. `src/pages/tools/lg-bonus.astro` 작성 (Astro 페이지)
3. `src/styles/scss/pages/_lg-bonus.scss` 작성 및 `src/styles/app.scss`에 import 추가
4. `public/scripts/lg-bonus.js` 작성 (계산 로직·DOM·Chart.js)
5. `src/data/tools.ts`에 `lg-bonus` 항목 등록
6. `public/sitemap.xml`에 URL 추가
7. OG 이미지 생성 또는 기본 이미지 연결
8. `npm run build` 성공 확인
9. 로컬 확인 후 배포

---

## 15. QA 체크리스트

### 콘텐츠 QA

- [ ] H1/title/description에 `LG전자 성과급 계산기`가 자연스럽게 포함됨
- [ ] `LG전자 PI 계산`, `LG전자 사업부별 성과급` 키워드가 H2 또는 본문에 포함됨
- [ ] 사업부 4개(H&A·HE·VS·BS) 모두 선택 가능
- [ ] 직급별 기본급 preset이 적용되고 직접 수정 가능
- [ ] 추정값·시뮬레이션 배지가 계산기 상단 및 결과 카드에 표시됨
- [ ] 확정 지급률처럼 오해할 수 있는 표현 없음
- [ ] 세후 추정값이 참고값으로만 안내됨
- [ ] FAQ 7개 이상 포함됨

### UX QA

- [ ] 사업부 변경 시 PI 범위 힌트가 자동 업데이트됨
- [ ] 슬라이더 ↔ 직접입력 양방향 동기화 정상 동작
- [ ] PI 모드 전환 시 시나리오 블록 / 직접입력 블록이 올바르게 토글됨
- [ ] 상단 CTA (세후·투자) 링크가 성과급 금액 prefill로 연결됨
- [ ] 삼성전자·SK하이닉스·현대차 내부 링크가 연결됨
- [ ] 모바일에서 사업부 셀렉트와 슬라이더가 사용하기 편함
- [ ] 직급별 예상표가 모바일에서 깨지지 않음

### 기술 QA

- [ ] `npm run build` 성공, 빌드 에러 없음
- [ ] `/tools/lg-bonus/` 라우트 생성 확인
- [ ] `tools.ts` 등록 확인
- [ ] `sitemap.xml` 등록 확인
- [ ] `app.scss`에 `_lg-bonus.scss` import 등록 확인
- [ ] Chart.js CDN 로드 및 차트 렌더링 정상
- [ ] URL 파라미터 공유 링크 복원 정상 동작
- [ ] 링크 404 없음

---

## 16. 발행 후 관찰 지표

7~14일 기준:

- `/tools/lg-bonus/` 세션 수
- `LG전자 성과급 계산기`, `LG전자 PI 계산`, `LG전자 사업부별 성과급` 검색어 등장 여부
- CTR 8% 이상 여부
- `/tools/bonus-after-tax-calculator/` 내부 이동
- `/tools/bonus-simulator/` 내부 이동
- `/tools/dca-investment-calculator/` 내부 이동

초기 목표:

- 7일 세션 50 이상
- CTR 8% 이상
- 타 성과급 계산기 내부 이동 10건 이상
