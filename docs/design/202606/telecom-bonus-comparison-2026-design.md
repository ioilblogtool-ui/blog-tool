# 통신 3사(KT·SKT·LG유플러스) 성과급 비교 계산기 — 설계 문서

> 기획 원문: `docs/plan/202606/telecom-bonus-comparison-2026-plan.md`
> 작성일: 2026-06-15
> 구현 기준: Codex/Claude가 이 문서만 보고 `/tools/telecom-bonus-comparison/` 페이지 구현에 착수할 수 있는 수준
> 참고 페이지: `semiconductor-bonus-comparison`(동일 패턴의 N사 동시 비교 계산기 — 입력 패널/KPI/결과 표/Chart.js 구조를 그대로 따른다)

---

## 1. 문서 개요

### 1-1. 대상

- 구현 대상: `통신 3사(KT·SKT·LG유플러스) 성과급 비교 계산기 2026`
- 콘텐츠 유형: 계산기 (tool)
- slug: `telecom-bonus-comparison`
- URL: `/tools/telecom-bonus-comparison/`

### 1-2. 문서 역할

- 기획 문서를 기준으로 데이터 스키마, 페이지 섹션, 입출력, CTA, 스타일 prefix, QA를 구현 단위로 고정한다.
- `semiconductor-bonus-comparison`의 "기준 연봉/월급 1회 입력 + 회사별 성과급 방식·지급률 개별 입력 + 세후 비교" 구조를 그대로 차용한다. 차이점은 비교 대상이 KT/SKT/LG유플러스 3사로 고정되어 있고(회사 선택 토글 없음), 회사별 추가 설명으로 PS 구조 비교 섹션을 둔다는 점이다.

### 1-3. 페이지 성격

- **3사 동시 비교 계산기**: 회사 선택/해제 토글 없이 항상 3사(KT/SKT/LG유플러스)를 표시
- **사용자 입력 기준 시뮬레이션**: 3사 모두 기본 지급률은 추정값이며 사용자가 직접 조정 가능
- **연도별 변동성 강조**: PS(이익배분) 특성상 연도별 차이가 크다는 점을 InfoNotice·구조 설명·FAQ에서 일관되게 안내, 특정 연도·수치를 단정하지 않음

### 1-4. 권장 파일 구조

```txt
src/
  data/
    telecomBonusComparison2026.ts
  pages/
    tools/
      telecom-bonus-comparison.astro

public/
  scripts/
    telecom-bonus-comparison.js
  og/
    tools/
      telecom-bonus-comparison.png

src/styles/scss/pages/
  _telecom-bonus-comparison.scss
```

필수 등록: `src/data/tools.ts`, `src/styles/app.scss`, `public/sitemap.xml`, `src/pages/index.astro`(`topicBySlug`)

---

## 2. SEO 설계

### 2-1. 메타

```ts
title: "KT·SKT·LG유플러스 성과급 비교 계산기 2026"
description: "KT, SK텔레콤, LG유플러스 통신 3사의 성과급(PS)을 같은 연봉 기준으로 비교해보세요. 회사별 지급률을 직접 조정해 세전·세후 예상액과 차이를 한 화면에서 확인할 수 있습니다."
ogImage: "/og/tools/telecom-bonus-comparison.png"
```

### 2-2. 키워드 매핑

| 키워드 | 반영 위치 |
|---|---|
| 통신사 성과급 비교 | title, H1 |
| 통신 3사 성과급 | title, hero, FAQ |
| KT 성과급 | KT 카드/표, FAQ |
| SKT 성과급 | SKT 카드/표, FAQ |
| LG유플러스 성과급 | LG유플러스 카드/표, FAQ |
| 통신사 PS 계산기 | description, FAQ |

---

## 3. 데이터 스키마

### 3-1. `src/data/telecomBonusComparison2026.ts`

```ts
export type TelecomCompanyId = "kt" | "skt" | "lguplus";
export type BonusInputMode = "salaryPercent" | "monthlyMultiple" | "fixedAmount";
export type TaxMode = "simple" | "manual";
export type EvidenceBadge = "추정" | "시뮬레이션" | "사용자 입력 기준";

export interface TelecomCompanyConfig {
  id: TelecomCompanyId;
  name: string;          // "KT" / "SK텔레콤" / "LG유플러스"
  shortName: string;      // "KT" / "SKT" / "LG유플러스"
  defaultMode: BonusInputMode;
  defaultSalaryPercent: number;
  defaultMonthlyMultiple: number;
  defaultFixedAmount: number;
  structureSummary: string;  // PS(이익배분) 구조 설명
  caution: string;
  badges: EvidenceBadge[];
}

export const TELECOM_COMPANIES: TelecomCompanyConfig[] = [
  {
    id: "kt", name: "KT", shortName: "KT",
    defaultMode: "salaryPercent",
    defaultSalaryPercent: 13, defaultMonthlyMultiple: 1.3, defaultFixedAmount: 0,
    structureSummary: "그룹 경영 실적과 평가 결과에 따른 PS(성과급) 구조로 알려져 있습니다.",
    caution: "직군(본사/계열사), 평가, 노사 합의에 따라 실제 금액이 달라질 수 있습니다.",
    badges: ["추정", "시뮬레이션"],
  },
  {
    id: "skt", name: "SK텔레콤", shortName: "SKT",
    defaultMode: "salaryPercent",
    defaultSalaryPercent: 15, defaultMonthlyMultiple: 1.5, defaultFixedAmount: 0,
    structureSummary: "SK그룹 평가 기준에 따른 PS·격려금 구조로 알려져 있습니다.",
    caution: "그룹 공통 기준과 개인/조직 평가에 따라 실제 금액이 달라질 수 있습니다.",
    badges: ["추정", "시뮬레이션"],
  },
  {
    id: "lguplus", name: "LG유플러스", shortName: "LG유플러스",
    defaultMode: "salaryPercent",
    defaultSalaryPercent: 12, defaultMonthlyMultiple: 1.2, defaultFixedAmount: 0,
    structureSummary: "LG그룹 공통 성과급 기준에 따른 구조로 알려져 있습니다.",
    caution: "그룹 공통 기준과 개인/조직 평가에 따라 실제 금액이 달라질 수 있습니다.",
    badges: ["추정", "시뮬레이션"],
  },
];

export const TELECOM_SIMPLE_TAX_RATE = 0.22;

export interface FaqItem { question: string; answer: string; }
export const TELECOM_BONUS_FAQ: FaqItem[] = [ /* 5개 이상, 14장 참조 */ ];

export interface RelatedLink { href: string; label: string; description: string; }
export const TELECOM_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/corporate-bonus-comparison-2026/", label: "2026 대기업 성과급 비교 리포트", description: "주요 대기업 성과급 발표 동향" },
  { href: "/tools/finance-bonus-comparison/", label: "금융권 성과급 비교", description: "은행·증권·보험 성과급 비교" },
  { href: "/tools/semiconductor-bonus-comparison/", label: "반도체 성과급 비교", description: "삼성전자·SK하이닉스 등 비교" },
  { href: "/tools/bonus-after-tax-calculator/", label: "성과급 세후 실수령액 계산기", description: "성과급 세금을 정확히 계산" },
  { href: "/tools/bonus-simulator/", label: "대기업 성과급 시뮬레이터", description: "여러 대기업 성과급 한 번에 비교" },
];
```

### 3-2. 계산 로직

`semiconductor-bonus-comparison`과 동일한 계산식을 3사 각각에 적용:

```
연간 성과급(세전) = 기준액 × 입력값

  - salaryPercent 모드: 기준액 = 연봉, 입력값 = 지급률(%) / 100
  - monthlyMultiple 모드: 기준액 = 월급(연봉÷12), 입력값 = 배수
  - fixedAmount 모드: 입력값 = 사용자가 입력한 금액 그대로

연간 성과급(세후 추정) = 연간 성과급(세전) × (1 - 세율)
  - simple 모드: 세율 = TELECOM_SIMPLE_TAX_RATE(22%)
  - manual 모드: 세율 = 사용자 입력 세율 / 100

월평균 환산 = 연간 성과급(세전) / 12
총보상(세전) = 연봉 + 연간 성과급(세전)
```

KPI 산출:

```
최고 예상 세후 성과급 = max(3사 세후 성과급)
회사 간 최대 차이 = max(3사 세전 성과급) - min(3사 세전 성과급)
월평균 차이 = 회사 간 최대 차이 / 12
성과급 포함 최고 총보상 = max(3사 총보상)
```

---

## 4. 페이지 구조

### 4-1. 레이아웃 쉘

`SimpleToolShell.astro` — `resultFirst={false}` (기획의 `CompareToolShell` 의도는 "입력 1곳 + 3사 동시 비교 결과"이며, 동일 패턴인 `semiconductor-bonus-comparison`도 `SimpleToolShell`을 사용하므로 이를 따른다)

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
  TELECOM_COMPANIES,
  TELECOM_BONUS_FAQ,
  TELECOM_RELATED_LINKS,
} from "../../data/telecomBonusComparison2026";

const config = { companies: TELECOM_COMPANIES };

const faqSchema = TELECOM_BONUS_FAQ.map((item) => ({
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
  SimpleToolShell (calculatorId="telecom-bonus-comparison" pageClass="tbc-page" resultFirst={false})
    slot:hero → CalculatorHero + InfoNotice
    slot:actions → ToolActionBar
    slot:aside → 입력 패널 (연봉/월급 공통 입력 + 3사별 지급 방식 입력 + 세율)
    [A] KPI 핵심 비교 카드
    [B] 3사 비교 결과 표
    [C] 3사 비교 바 차트
    [D] PS 구조 설명 (3사 카드)
    [E] 다음 단계 관련 계산기 그리드
    slot:seo → SeoContent (FAQ 포함)
```

---

## 5. 입력 패널 설계 (`slot:aside`)

`semiconductor-bonus-comparison`의 입력 패널 구조를 차용하되, 회사 선택 토글은 두지 않고(3사 고정) 회사별 입력 패널을 항상 모두 표시한다.

```astro
<section class="tbc-calculator" data-tbc-calculator>
  <article class="panel tbc-input-panel">
    <div class="panel-heading">
      <div>
        <p class="panel-heading__eyebrow">기준 입력</p>
        <h2 class="panel__title">같은 조건으로 맞추기</h2>
      </div>
      <p class="panel-heading__summary">연봉과 월 기본급을 먼저 맞춘 뒤 회사별 성과급 방식을 조정하세요.</p>
    </div>

    <div class="form-grid">
      <label class="field" for="tbcAnnualSalary">
        <span>기준 연봉</span>
        <input id="tbcAnnualSalary" data-tbc-annual-salary type="text" inputmode="numeric" value="60,000,000" />
        <small>성과급 포함 전 연봉 또는 비교 기준 연봉</small>
      </label>
      <label class="field" for="tbcMonthlySalary">
        <span>월 기본급</span>
        <input id="tbcMonthlySalary" data-tbc-monthly-salary type="text" inputmode="numeric" value="5,000,000" />
        <small data-tbc-monthly-hint>연봉을 바꾸면 자동 갱신됩니다.</small>
      </label>
      <button class="button button--secondary tbc-reset-monthly" type="button" data-tbc-reset-monthly>
        연봉 기준으로 다시 계산
      </button>
      <label class="field" for="tbcTaxMode">
        <span>세후 계산 방식</span>
        <select id="tbcTaxMode" data-tbc-tax-mode>
          <option value="simple" selected>간편 추정 (22%)</option>
          <option value="manual">직접 세율 입력</option>
        </select>
      </label>
      <label class="field" for="tbcManualTaxRate">
        <span>직접 공제율</span>
        <input id="tbcManualTaxRate" data-tbc-manual-tax-rate type="number" min="0" max="60" step="0.1" value="22" />
        <small>직접 세율 입력 모드에서 사용합니다.</small>
      </label>
    </div>
  </article>

  <article class="panel tbc-company-inputs">
    <div class="panel-heading">
      <div>
        <p class="panel-heading__eyebrow">회사별 가정</p>
        <h2 class="panel__title">성과급 방식 입력</h2>
      </div>
      <p class="panel-heading__summary">기본값은 추정 시뮬레이션 값입니다. 실제 비교가 필요하면 알고 있는 지급 기준으로 수정하세요.</p>
    </div>
    <div class="tbc-company-panel-list">
      {TELECOM_COMPANIES.map((company) => (
        <section class="tbc-company-panel" data-tbc-company-panel={company.id}>
          <div class="tbc-company-panel__head">
            <div>
              <strong>{company.name}</strong>
              <span>{company.structureSummary}</span>
            </div>
            <div class="tbc-company-panel__badges">
              {company.badges.map((badge) => <span>{badge}</span>)}
            </div>
          </div>
          <div class="tbc-company-panel__inputs">
            <label class="field" for={`tbcMode-${company.id}`}>
              <span>성과급 방식</span>
              <select id={`tbcMode-${company.id}`} data-tbc-mode={company.id}>
                <option value="salaryPercent" selected={company.defaultMode === "salaryPercent"}>연봉 대비 %</option>
                <option value="monthlyMultiple" selected={company.defaultMode === "monthlyMultiple"}>월급 n개월</option>
                <option value="fixedAmount" selected={company.defaultMode === "fixedAmount"}>고정 금액</option>
              </select>
            </label>
            <label class="field" for={`tbcPercent-${company.id}`} data-tbc-field-group={company.id} data-tbc-field-mode="salaryPercent">
              <span>성과급률 (%)</span>
              <input id={`tbcPercent-${company.id}`} data-tbc-salary-percent={company.id} type="number" min="0" max="100" step="0.5" value={company.defaultSalaryPercent} />
            </label>
            <label class="field" for={`tbcMultiple-${company.id}`} data-tbc-field-group={company.id} data-tbc-field-mode="monthlyMultiple">
              <span>월급 개월 수</span>
              <input id={`tbcMultiple-${company.id}`} data-tbc-monthly-multiple={company.id} type="number" min="0" max="12" step="0.1" value={company.defaultMonthlyMultiple} />
            </label>
            <label class="field" for={`tbcFixed-${company.id}`} data-tbc-field-group={company.id} data-tbc-field-mode="fixedAmount">
              <span>고정 성과급</span>
              <input id={`tbcFixed-${company.id}`} data-tbc-fixed-amount={company.id} type="text" inputmode="numeric" value={company.defaultFixedAmount.toLocaleString("ko-KR")} />
            </label>
          </div>
          <p class="tbc-company-panel__caution">{company.caution}</p>
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
<section class="tbc-results">
  <div class="tbc-section-head">
    <p class="tbc-section-head__eyebrow">핵심 결과</p>
    <h2>통신 3사 성과급 비교</h2>
    <p>입력값을 바꾸면 결과가 바로 갱신됩니다. 모든 금액은 사용자 입력 기준 시뮬레이션입니다.</p>
  </div>
  <div class="tbc-kpi-grid">
    <article class="tbc-kpi-card">
      <span>최고 예상 세후 성과급</span>
      <strong data-tbc-best-net>-</strong>
      <small data-tbc-best-net-company>-</small>
    </article>
    <article class="tbc-kpi-card">
      <span>3사 간 최대 차이 (세전)</span>
      <strong data-tbc-max-gap>-</strong>
      <small>3사 비교 기준</small>
    </article>
    <article class="tbc-kpi-card">
      <span>월평균 차이</span>
      <strong data-tbc-monthly-gap>-</strong>
      <small>12개월 환산</small>
    </article>
    <article class="tbc-kpi-card">
      <span>성과급 포함 최고 총보상</span>
      <strong data-tbc-best-total>-</strong>
      <small data-tbc-best-total-company>-</small>
    </article>
  </div>
</section>
```

### [B] 3사 비교 결과 표

```astro
<section class="tbc-result-section">
  <div class="tbc-section-head">
    <p class="tbc-section-head__eyebrow">회사별 표</p>
    <h2>세전·세후·월평균 환산</h2>
  </div>
  <div class="tbc-table-wrap">
    <table class="tbc-result-table">
      <caption>통신 3사 성과급 비교 결과 표</caption>
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
      <tbody data-tbc-result-table></tbody>
    </table>
  </div>
  <p class="tbc-footnote">예상 세후 금액은 간편 공제율(또는 직접 입력한 공제율)을 적용한 추정값입니다. 실제 통장 입금액은 지급월 급여, 부양가족, 비과세 항목, 4대보험, 연말정산 결과에 따라 달라질 수 있습니다.</p>
</section>
```

### [C] 3사 비교 바 차트

```astro
<section class="tbc-chart-section">
  <div class="tbc-section-head">
    <p class="tbc-section-head__eyebrow">시각화</p>
    <h2>3사 세전·세후 성과급 비교</h2>
  </div>
  <div class="tbc-chart-wrap">
    <canvas id="tbcCompareChart" aria-label="통신 3사 성과급 비교 차트" role="img"></canvas>
  </div>
</section>
```

### [D] PS 구조 설명 (3사 카드)

```astro
<section class="tbc-guide">
  <div class="tbc-section-head">
    <p class="tbc-section-head__eyebrow">회사별 해설</p>
    <h2>통신 3사 PS(이익배분) 구조 한눈에 보기</h2>
  </div>
  <div class="tbc-guide-grid">
    {TELECOM_COMPANIES.map((company) => (
      <article class="tbc-guide-card">
        <div class="tbc-guide-card__head">
          <strong>{company.name}</strong>
          <div class="tbc-guide-card__badges">
            {company.badges.map((badge) => <span>{badge}</span>)}
          </div>
        </div>
        <p>{company.structureSummary}</p>
        <p>{company.caution}</p>
      </article>
    ))}
  </div>
</section>
```

### [E] 관련 계산기 그리드

```astro
<section class="tbc-related">
  <div class="tbc-section-head">
    <p class="tbc-section-head__eyebrow">다음 단계</p>
    <h2>함께 보면 좋은 계산기</h2>
  </div>
  <div class="tbc-related-grid">
    {TELECOM_RELATED_LINKS.map((link) => (
      <a class="tbc-related-card" href={withBase(link.href)}>
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
  annualSalary: 60000000,
  monthlySalary: 5000000,
  monthlyManuallyEdited: false,
  taxMode: "simple",        // "simple" | "manual"
  manualTaxRate: 22,
  companies: {
    kt:      { mode: "salaryPercent", salaryPercent: 13, monthlyMultiple: 1.3, fixedAmount: 0 },
    skt:     { mode: "salaryPercent", salaryPercent: 15, monthlyMultiple: 1.5, fixedAmount: 0 },
    lguplus: { mode: "salaryPercent", salaryPercent: 12, monthlyMultiple: 1.2, fixedAmount: 0 },
  },
};
```

### 7-2. 이벤트 흐름

1. 연봉 입력 변경 → `monthlyManuallyEdited`가 `false`면 월급을 연봉÷12로 자동 갱신, 슬라이더/표시값 동기화 → `calculate()`
2. 월급 입력을 사용자가 직접 수정 → `monthlyManuallyEdited = true`로 설정 (이후 연봉 변경 시에도 월급 유지)
3. `data-tbc-reset-monthly` 클릭 → `monthlyManuallyEdited = false` → 월급을 연봉÷12로 재계산
4. 회사별 `select[data-tbc-mode]` 변경 → 해당 회사의 `data-tbc-field-group` 블록 중 `data-tbc-field-mode`가 일치하는 것만 표시(`hidden` 토글)
5. 회사별 지급률/배수/고정금액 입력 변경 → `state.companies[id]` 갱신 → `calculate()`
6. `tbcTaxMode` 변경 → `manual` 선택 시 `tbcManualTaxRate` 입력 표시
7. `calculate()`:
   - 3사 각각 세전/세후/월평균/총보상 계산 (3-2장 공식)
   - KPI 카드 [A] 갱신 (최고 세후 성과급 + 해당 회사명, 최대 차이, 월평균 차이, 최고 총보상 + 해당 회사명)
   - 결과 표 [B] 3행 리렌더링
   - Chart.js [C] 데이터셋 갱신 (3사 × 세전/세후 그룹 바 차트)

### 7-3. URL 파라미터 (공유 링크)

```
/tools/telecom-bonus-comparison/?salary=70000000&monthly=5800000&taxMode=simple&kt=salaryPercent:13&skt=salaryPercent:15&lguplus=salaryPercent:12
```

- `kt`/`skt`/`lguplus` 파라미터는 `{mode}:{value}` 형식 (예: `monthlyMultiple:1.5`, `fixedAmount:5000000`)
- 복원 순서: 연봉/월급 → 세율 모드 → 3사 입력값 → `calculate()`
- 파라미터가 없으면 `TELECOM_COMPANIES`의 기본값을 사용

---

## 8. Chart.js 설계

- 차트: 그룹 바 차트 1개 (`tbcCompareChart`)
- X축: KT / SKT / LG유플러스 (3개 그룹)
- 데이터셋 2개: "세전 성과급", "세후 추정"
- 공통 `chart-config.js` 옵션·색상 토큰 재사용 (반도체 비교 페이지와 동일 패턴)
- 모바일에서는 `tbc-chart-wrap`에 `position: relative; height: 240px; overflow: hidden;`을 적용해 컨테이너 높이를 고정 (다른 페이지의 차트 래퍼 패턴과 동일)

---

## 9. 스타일 설계

### 9-1. Prefix

- 페이지 루트: `.tbc-page`
- 입력 패널: `.tbc-calculator`, `.tbc-input-panel`, `.tbc-company-inputs`, `.tbc-company-panel`, `.tbc-company-panel__head`, `.tbc-company-panel__inputs`, `.tbc-company-panel__badges`, `.tbc-company-panel__caution`
- 결과: `.tbc-results`, `.tbc-kpi-grid`, `.tbc-kpi-card`, `.tbc-result-section`, `.tbc-table-wrap`, `.tbc-result-table`, `.tbc-footnote`
- 차트: `.tbc-chart-section`, `.tbc-chart-wrap`
- 해설: `.tbc-guide`, `.tbc-guide-grid`, `.tbc-guide-card`, `.tbc-guide-card__head`, `.tbc-guide-card__badges`
- 관련: `.tbc-related`, `.tbc-related-grid`, `.tbc-related-card`
- 공통: `.tbc-section-head`, `.tbc-section-head__eyebrow`

### 9-2. 시각 톤

- 사이트 기본 톤(blue primary `#1A56DB`) 유지
- 3사 비교 시 카드/표/차트 모두 동일한 시각적 비중으로 표시 (특정 회사 우대 톤 금지)
- 추정/시뮬레이션 배지는 `semiconductor-bonus-comparison`의 `.sbc-company-panel__badges`와 동일한 스타일로 재사용

### 9-3. SCSS 골격

```scss
.tbc-page {
  .tbc-company-panel-list {
    display: grid;
    gap: 12px;
    grid-template-columns: 1fr;
  }

  .tbc-company-panel {
    border: 1px solid #E0DFDB;
    border-radius: 10px;
    padding: 16px;
    background: #FFFFFF;
  }

  .tbc-company-panel__head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 12px;

    strong { display: block; font-size: 1rem; color: #0F172A; }
    span { display: block; font-size: 0.8rem; color: #64748B; margin-top: 2px; }
  }

  .tbc-company-panel__badges {
    display: flex;
    gap: 4px;

    span {
      font-size: 0.7rem;
      padding: 2px 8px;
      border-radius: 999px;
      background: #EFF6FF;
      color: #1A56DB;
    }
  }

  .tbc-company-panel__inputs {
    display: grid;
    gap: 10px;
    grid-template-columns: 1fr;
  }

  .tbc-company-panel__caution {
    margin: 10px 0 0;
    font-size: 0.75rem;
    color: #6B7280;
  }

  .tbc-kpi-grid {
    display: grid;
    gap: 10px;
    grid-template-columns: 1fr;
  }

  .tbc-kpi-card {
    border: 1px solid #E0DFDB;
    border-radius: 10px;
    padding: 16px;
    background: #F7F6F4;

    span { display: block; font-size: 0.8rem; color: #6B7280; }
    strong { display: block; font-size: 1.4rem; color: #1A56DB; margin: 6px 0 2px; }
    small { display: block; font-size: 0.75rem; color: #888780; }
  }

  .tbc-table-wrap { overflow-x: auto; }

  .tbc-result-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;

    th, td { padding: 10px; border-bottom: 1px solid #E0DFDB; text-align: left; white-space: nowrap; }
    th { font-size: 0.75rem; color: #6B7280; }
  }

  .tbc-chart-wrap {
    position: relative;
    height: 240px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .tbc-guide-grid,
  .tbc-related-grid {
    display: grid;
    gap: 10px;
    grid-template-columns: 1fr;
  }

  .tbc-guide-card {
    border: 1px solid #E0DFDB;
    border-radius: 10px;
    padding: 16px;
    background: #FFFFFF;
  }

  .tbc-guide-card__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    strong { font-size: 1rem; color: #0F172A; }
  }

  .tbc-guide-card__badges {
    display: flex;
    gap: 4px;

    span {
      font-size: 0.7rem;
      padding: 2px 8px;
      border-radius: 999px;
      background: #EFF6FF;
      color: #1A56DB;
    }
  }

  .tbc-related-card {
    display: grid;
    gap: 6px;
    border: 1px solid #E0DFDB;
    border-radius: 10px;
    padding: 16px;
    color: inherit;
    text-decoration: none;
    background: #FFFFFF;

    strong { color: #0F172A; }
    span { color: #64748B; font-size: 0.86rem; }
  }
}

@media (min-width: 768px) {
  .tbc-page {
    .tbc-company-panel-list,
    .tbc-kpi-grid,
    .tbc-guide-grid,
    .tbc-related-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
}

@media (min-width: 1024px) {
  .tbc-page {
    .tbc-company-panel-list,
    .tbc-kpi-grid,
    .tbc-guide-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .tbc-related-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
}
```

---

## 10. `tools.ts` 등록

```ts
{
  slug: "telecom-bonus-comparison",
  title: "통신 3사 성과급 비교 계산기",
  description: "KT·SK텔레콤·LG유플러스 성과급(PS)을 같은 연봉 기준으로 비교합니다. 회사별 지급률을 직접 조정해 세전·세후 예상액과 차이를 확인하세요.",
  category: "bonus",
  order: 27.7,
  eyebrow: "Telecom 3사 Tool",
  iframeReady: true,
  badges: ["신규", "추정"],
  previewStats: [
    { label: "비교 대상", value: "3개사", context: "KT·SKT·LGU+" },
    { label: "산출 항목", value: "세전·세후", context: "월평균 환산" }
  ]
}
```

`src/pages/index.astro`의 `topicBySlug`에도 `"telecom-bonus-comparison": "성과급 비교"` 추가.

---

## 11. Sitemap / OG

### 11-1. sitemap.xml

```xml
<url>
  <loc>https://bigyocalc.com/tools/telecom-bonus-comparison/</loc>
  <lastmod>2026-06-15</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

### 11-2. OG 이미지

```txt
public/og/tools/telecom-bonus-comparison.png
```

텍스트:
- 메인: `KT·SKT·LG유플러스 성과급 비교`
- 서브: `세전·세후 시뮬레이션 2026`

---

## 12. InfoNotice 문구

```astro
<InfoNotice
  title="계산 전 안내"
  lines={[
    "이 계산기는 사용자가 입력한 연봉과 성과급률을 기준으로 한 비교용 시뮬레이션입니다.",
    "실제 지급액은 회사, 사업부, 직급, 평가, 노사 합의 결과, 세금 및 공제 방식에 따라 달라질 수 있습니다.",
    "통신 3사의 PS(이익배분)는 매년 실적과 노사 합의에 따라 연도별 변동이 큰 항목으로, 회사별 기본 지급률은 입력 편의를 위한 추정값입니다.",
    "이 계산기는 특정 통신사에 대한 투자 권유 또는 평가를 목적으로 하지 않습니다.",
  ]}
/>
```

---

## 13. SeoContent (FAQ 포함)

```astro
<SeoContent
  introTitle="통신 3사(KT·SKT·LG유플러스) 성과급 비교 계산기 활용 가이드"
  intro={[
    "이 계산기는 KT, SK텔레콤, LG유플러스 통신 3사의 성과급(PS)을 같은 연봉·월 기본급 기준으로 동시에 비교할 수 있는 시뮬레이션 도구입니다.",
    "통신 3사는 매년 실적 발표 이후 성과급(PS) 지급률이 뉴스로 다뤄지는 경우가 많으며, 'KT 성과급', 'SKT 성과급', 'LG유플러스 성과급' 등의 검색 수요가 꾸준히 발생합니다.",
    "기준 연봉을 입력하면 월 기본급이 자동으로 계산되며, 회사별로 성과급 입력 방식(연봉 대비 %, 월급 n개월, 고정 금액)을 선택해 각자의 조건에 맞게 조정할 수 있습니다.",
    "KT는 그룹 경영 실적과 평가 결과에 따른 PS 구조, SK텔레콤은 SK그룹 평가 기준에 따른 PS·격려금 구조, LG유플러스는 LG그룹 공통 성과급 기준에 따른 구조로 알려져 있습니다. 다만 통신업은 연도별 실적 변동에 따라 지급률 차이가 큰 편으로 알려져 있어, 이 계산기의 기본 지급률은 참고용 추정값입니다.",
    "세후 추정값은 간편 공제율(22%) 또는 직접 입력한 세율을 적용한 참고값이며, 정확한 세후 금액은 성과급 세후 실수령액 계산기를 통해 다시 확인하는 것을 권장합니다.",
  ]}
  inputPoints={[
    "기준 연봉을 입력하면 월 기본급이 자동으로 계산되며, 직접 수정도 가능합니다.",
    "KT·SKT·LG유플러스 3사 각각 성과급 입력 방식을 연봉 대비 %, 월급 개월 수, 고정 금액 중에서 선택할 수 있습니다.",
    "세율은 간편 추정(22%) 또는 직접 입력 중 선택할 수 있습니다.",
    "입력값을 바꾸면 KPI 카드, 결과 표, 비교 차트가 실시간으로 갱신됩니다.",
  ]}
  criteria={[
    "연간 성과급(세전) = 기준액 × 입력값 (모드별로 연봉, 월급, 고정 금액 중 하나를 기준액으로 사용)",
    "회사별 기본 성과급률은 보도·업계 추정 기반 시뮬레이션 값으로 공식 지급률이 아닙니다.",
    "세후 추정은 간편 공제율(22%) 또는 사용자가 입력한 세율을 적용한 참고값입니다.",
    "통신 3사의 PS는 연도별 실적과 노사 합의에 따라 변동성이 큰 항목으로, 특정 연도의 지급률을 보장하지 않습니다.",
  ]}
  faq={[
    { question: "통신 3사 성과급(PS)은 어떻게 산정되나요?", answer: "KT·SK텔레콤·LG유플러스 모두 그룹 경영 실적과 개인/조직 평가 결과에 따른 이익배분제(PS) 구조로 알려져 있습니다. 정확한 산정 기준은 각 회사의 공식 발표를 참고하세요." },
    { question: "이 계산기의 기본 지급률(13%, 15%, 12%)은 확정된 수치인가요?", answer: "아니요. 보도·업계 추정 기반 시뮬레이션 기본값이며, 실제 지급률은 사업 실적과 노사 협의에 따라 매년 달라질 수 있습니다. 직접 입력 모드로 원하는 수치를 적용해 보세요." },
    { question: "KT, SKT, LG유플러스 중 어디가 성과급이 더 많은가요?", answer: "연도와 실적에 따라 다르며, 이 계산기는 동일한 연봉·지급률 가정 하에서의 비교용 시뮬레이션만 제공합니다. 특정 회사가 더 우수하다고 단정할 수 없습니다." },
    { question: "세후로 얼마나 받게 되나요?", answer: "성과급은 근로소득으로 합산 과세됩니다. 이 계산기의 세후 값은 간편 공제율(22%) 또는 직접 입력한 세율을 적용한 참고값이며, 정확한 금액은 성과급 세후 실수령액 계산기를 이용하세요." },
    { question: "회사별로 성과급 입력 방식이 다른 이유는 무엇인가요?", answer: "통신사마다 성과급을 연봉 대비 비율, 월급의 개월 수, 또는 고정 금액으로 발표하는 경우가 있어, 사용자가 알고 있는 정보에 맞춰 입력 방식을 선택할 수 있도록 구성했습니다." },
    { question: "다른 업종 성과급과 비교하려면 어떻게 하나요?", answer: "반도체 성과급 비교, 금융권 성과급 비교 등 다른 업종별 비교 계산기와 대기업 성과급 비교 리포트를 함께 확인할 수 있습니다." },
  ]}
  related={[
    { href: "/reports/corporate-bonus-comparison-2026/", label: "2026 대기업 성과급 비교 리포트" },
    { href: "/tools/finance-bonus-comparison/", label: "금융권 성과급 비교" },
    { href: "/tools/semiconductor-bonus-comparison/", label: "반도체 성과급 비교" },
    { href: "/tools/bonus-after-tax-calculator/", label: "성과급 세후 실수령액 계산기" },
    { href: "/tools/bonus-simulator/", label: "대기업 성과급 시뮬레이터" },
  ]}
/>
```

---

## 14. 구현 순서

1. `src/data/telecomBonusComparison2026.ts` 작성 (3개사 config, FAQ, 관련 링크)
2. `src/pages/tools/telecom-bonus-comparison.astro` 작성 (`semiconductor-bonus-comparison` 구조 복제 — 회사 선택 토글 제거, 3사 항상 노출)
3. `src/styles/scss/pages/_telecom-bonus-comparison.scss` 작성 및 `app.scss`에 import 추가
4. `public/scripts/telecom-bonus-comparison.js` 작성 — 입력 동기화, 3사 계산 로직, KPI/표/차트 렌더링, URL 파라미터 직렬화/복원
5. `src/data/tools.ts`에 항목 등록
6. `public/sitemap.xml`에 URL 추가
7. `src/pages/index.astro`의 `topicBySlug`에 등록
8. OG 이미지 생성 또는 기본 이미지 연결
9. `npm run build` 성공 확인
10. 로컬 확인 후 배포 (3사 입력 모드 전환, KPI/표/차트 갱신, URL 파라미터 복원 동작 확인)

---

## 15. QA 체크리스트

### 콘텐츠 QA

- [ ] H1/title/description에 "통신 3사 성과급", "KT·SKT·LG유플러스" 키워드 포함
- [ ] KT/SKT/LG유플러스 각각의 성과급 키워드가 FAQ·해설 카드에 포함됨
- [ ] 3사 모두 추정/시뮬레이션 배지 표시
- [ ] PS 구조 설명이 3사 동일한 분량/형식으로 작성되어 특정 회사 우대 톤이 없음
- [ ] "최근 추세" 등 표현에 구체적 연도·수치를 단정하지 않음
- [ ] FAQ 5개 이상, SeoContent intro 5문단/800자 이상

### UX QA

- [ ] 연봉 입력 시 월급 자동 갱신, 월급 직접 수정 시 유지(`monthlyManuallyEdited`) 정상 동작
- [ ] 회사별 입력 모드(연봉%/월급배수/고정금액) 전환 시 해당 블록만 표시
- [ ] 세율 모드(간편/직접) 전환 정상 동작
- [ ] KPI 카드(최고 세후, 최대 차이, 월평균 차이, 최고 총보상)가 입력 변경 시 즉시 갱신
- [ ] 결과 표 3행, 비교 차트(세전/세후 그룹 바) 정상 렌더링
- [ ] 모바일에서 3사 입력 패널/결과 표가 가로 스크롤 없이 또는 자연스러운 스크롤로 표시됨

### 기술 QA

- [ ] `npm run build` 성공, `/tools/telecom-bonus-comparison/` 라우트 생성 확인
- [ ] `tools.ts`, `sitemap.xml`, `app.scss`, `index.astro` 등록 확인
- [ ] URL 파라미터(`salary`, `monthly`, `taxMode`, `kt`, `skt`, `lguplus`) 공유 링크 복원 정상 동작
- [ ] 관련 링크 404 없음 (`finance-bonus-comparison`, `semiconductor-bonus-comparison`, `bonus-after-tax-calculator` 등)

---

## 16. 발행 후 관찰 지표

7~14일 기준:

- `/tools/telecom-bonus-comparison/` 세션 수
- `통신사 성과급 비교`, `KT 성과급`, `SKT 성과급`, `LG유플러스 성과급` 검색어 등장 여부
- CTR 8% 이상 여부
- `/tools/bonus-after-tax-calculator/`, `/reports/corporate-bonus-comparison-2026/` 내부 이동

초기 목표:

- 7일 세션 40 이상
- CTR 8% 이상
- 내부 이동 5건 이상
