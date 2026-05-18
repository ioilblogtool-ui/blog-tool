# 모유수유 vs 분유 비용 계산기 — 설계 문서

> 작성일: 2026-05-16
> 콘텐츠 유형: `/tools/` 계산기
> 구현 기준: 수유 방식(완모/혼합/완분) × 월령별 분유 소비량 × 유축기 취득 방식 → 월별·누적 비용 비교 + 손익분기점 계산

---

## 1. 문서 개요

- 구현 대상: `모유수유 vs 분유 비용 계산기`
- slug: `breastfeeding-vs-formula-cost`
- URL: `/tools/breastfeeding-vs-formula-cost/`
- 카테고리: 출산/임신
- 핵심 검색 의도: "모유수유 비용 분유 비용 비교" "유축기 구매 렌탈 손익분기점" "분유 12개월 총비용"
- 핵심 출력: 수유 방식별 12개월 누적 비용, 유축기 손익분기점(개월), 분유 총 소비 캔 수, 절감 예상액

---

## 2. 구현 파일 구조

```text
src/
  data/
    breastfeedingVsFormulaCost.ts   ← 타입 정의, 상수, 프리셋, FAQ, 관련 링크
  pages/
    tools/
      breastfeeding-vs-formula-cost.astro

public/
  scripts/
    breastfeeding-vs-formula-cost.js

src/styles/scss/pages/
  _breastfeeding-vs-formula-cost.scss
```

추가 등록 필수:
- `src/data/tools.ts`
- `src/styles/app.scss` — `@use 'scss/pages/breastfeeding-vs-formula-cost';`
- `public/sitemap.xml`

---

## 3. 레이아웃 방향

- `CompareToolShell` 기반. 모유수유(좌) vs 분유(우) 나란히 비교 구조.
- `resultFirst={false}` — 모바일에서 입력 먼저, 결과 후.
- SCSS prefix: `bvf-`

```astro
<CompareToolShell
  calculatorId="breastfeeding-vs-formula-cost"
  pageClass="op-page bvf-page"
  resultFirst={false}
>
```

---

## 4. 데이터 모델

```ts
// src/data/breastfeedingVsFormulaCost.ts

export type FeedingMethod = 'breast' | 'mixed' | 'formula';
export type FormulaGrade = 'standard' | 'organic' | 'premium';
export type PumpOption = 'none' | 'buy-electric' | 'buy-manual' | 'rental';

export interface BvfInput {
  method: FeedingMethod;           // 수유 방식
  currentAge: number;              // 아기 현재 월령 (0~11)
  formulaGrade: FormulaGrade;      // 분유 브랜드 등급
  pumpOption: PumpOption;          // 유축기 취득 방식
  includeSupplies: boolean;        // 소모품 비용 포함 여부
}

export interface BvfMonthlyRow {
  age: number;                     // 월령 (0~11)
  breastCost: number;              // 해당 월 모유수유 비용
  mixedCost: number;               // 해당 월 혼합 수유 비용
  formulaCost: number;             // 해당 월 완전 분유 비용
  formulaGrams: number;            // 해당 월 분유 소비량(g)
}

export interface BvfResult {
  monthly: BvfMonthlyRow[];        // 잔여 월령 기준 월별 데이터
  totalBreast: number;             // 잔여 기간 모유수유 누적 비용
  totalMixed: number;              // 잔여 기간 혼합 누적 비용
  totalFormula: number;            // 잔여 기간 완전 분유 누적 비용
  formulaCanCount: number;         // 분유 총 소비 캔 수 (800g 기준)
  breakEvenMonth: number | null;   // 유축기 구매 기준 손익분기 월령 (없으면 null)
  savings: number;                 // 완모 vs 완분 절감액
  pumpCost: number;                // 유축기 초기 비용 (0이면 렌탈 또는 보유)
}

// ── 상수 ────────────────────────────────────────────────

// 월령별 1일 분유 권장 소비량(g) — 출처: 대한소아과학회 권고 참고값, 추정
export const DAILY_FORMULA_GRAMS: Record<number, number> = {
  0: 48, 1: 48,
  2: 60, 3: 60,
  4: 72, 5: 72,
  6: 60, 7: 60,
  8: 48, 9: 48,
  10: 36, 11: 36,
};

// 분유 브랜드 등급별 800g 캔 단가(원) — 추정값
export const FORMULA_PRICE: Record<FormulaGrade, number> = {
  standard: 27000,
  organic:  41000,
  premium:  62000,
};

// 유축기 취득 방식별 비용(원) — 추정값
export const PUMP_COST: Record<PumpOption, { initial: number; monthly: number }> = {
  none:        { initial: 0,      monthly: 0     },
  'buy-electric': { initial: 220000, monthly: 0  },
  'buy-manual':   { initial: 45000,  monthly: 0  },
  rental:      { initial: 0,      monthly: 20000 },
};

// 소모품 월 비용(원) — 수유패드·저장팩·세정제 등, 추정값
export const SUPPLIES_MONTHLY = 18000;

// 혼합 수유 분유 비율 (기본 50%)
export const MIXED_FORMULA_RATIO = 0.5;
```

---

## 5. 계산 로직

### 5-1. 월별 분유 비용

```text
월 분유 사용량(g) = DAILY_FORMULA_GRAMS[age] × 30
월 분유 캔 수    = 월 분유 사용량 / 800
월 분유 비용(원) = 월 분유 캔 수 × FORMULA_PRICE[grade]
```

### 5-2. 수유 방식별 월 비용

```text
완전 분유 월 비용  = 월 분유 비용
혼합 수유 월 비용  = 월 분유 비용 × 0.5 + (소모품 포함 시 SUPPLIES_MONTHLY)
완전 모유 월 비용  = (소모품 포함 시 SUPPLIES_MONTHLY)
                  + (렌탈인 경우 PUMP_COST.rental.monthly)
```

### 5-3. 누적 비용 (currentAge → 12개월까지 잔여 기간 기준)

```text
잔여 개월 = 12 - currentAge
누적 비용 = Σ(각 월 비용)  [age = currentAge ~ 11]
```

### 5-4. 유축기 손익분기점

```text
월 절감액 = 월 분유 비용 - 완전 모유 월 비용(소모품 포함)
손익분기 개월 수 = ceil(유축기 초기 비용 / 월 절감액)
```

- 월 절감액 ≤ 0이면 `null` 반환 (분유보다 모유수유가 비싼 경우)
- 손익분기 > 12이면 "12개월 내 회수 불가"로 표시

### 5-5. 분유 총 소비 캔 수

```text
총 소비량(g) = Σ(DAILY_FORMULA_GRAMS[age] × 30)  [잔여 기간]
총 캔 수     = ceil(총 소비량 / 800)
```

예외 처리:
- `currentAge >= 12` → "12개월 이후는 계산 범위 외" 안내
- 분유 가격 0 → 계산 불가 (내부 상수 사용이므로 발생 안 함)
- 혼합 비율은 50% 고정 (MVP 범위)

---

## 6. 프리셋 초안

| 프리셋 ID | 레이블 | 수유 방식 | 월령 | 분유 등급 | 유축기 |
|---------|-------|---------|-----|---------|-------|
| `preset-breast-electric` | 완모 · 전동 유축기 구매 | breast | 0 | standard | buy-electric |
| `preset-breast-rental` | 완모 · 유축기 렌탈 | breast | 0 | standard | rental |
| `preset-mixed` | 혼합 수유 · 일반 분유 | mixed | 0 | standard | buy-manual |
| `preset-formula-standard` | 완분 · 일반 분유 | formula | 0 | standard | none |
| `preset-formula-premium` | 완분 · 프리미엄 분유 | formula | 0 | premium | none |

---

## 7. 페이지 IA

1. **Hero** — 제목: "모유수유 vs 분유 비용 계산기", 부제: "수유 방식에 따라 12개월 동안 얼마나 차이 나는지 계산합니다"
2. **InfoNotice** — "이 계산기의 분유 단가, 유축기 비용, 소모품 비용은 2026년 기준 추정값입니다. 실제 가격과 다를 수 있으므로 참고용으로만 활용하세요."
3. **TrustPanel**
4. **프리셋 버튼 (5개)**
5. **입력 패널** — 수유 방식, 아기 월령, 분유 등급, 유축기 방식, 소모품 포함 여부
6. **핵심 결과 카드 (4개)** — 완분 누적 비용, 완모 누적 비용, 절감 예상액, 손익분기점
7. **분유 소비량 요약** — 총 소비 캔 수, 총 소비량(g)
8. **월별 비용 비교표** — 완모·혼합·완분 3열
9. **누적 비용 추이 차트** — 라인 차트 3선
10. **수유 방식 설명 카드 (3개)** — 완모, 혼합, 완분 각 특징·비용 요약
11. **CTA** — 기저귀 비용 계산기 / 첫해 육아비용 계산기
12. **SeoContent** — intro 5문단, FAQ 8개, 관련 링크 5개

---

## 8. 입력 UI 상세

| 필드 | 타입 | 기본값 | 유효성 검사 |
|------|------|--------|-----------|
| 수유 방식 | radio 3종 | formula | 필수 |
| 아기 현재 월령 | select 0~11 | 0 | 0~11 정수 |
| 분유 브랜드 등급 | radio 3종 | standard | 필수 |
| 유축기 취득 방식 | radio 4종 | none | 필수 |
| 소모품 비용 포함 | checkbox | checked | — |

보조 문구:
- 월령 아래: "현재 아기 월령을 선택하면 남은 기간 기준으로 계산됩니다"
- 유축기 방식 아래: "완전 분유 선택 시에는 유축기 비용이 제외됩니다"
- 소모품 아래: "수유패드·모유 저장팩·세정제 등 월 약 18,000원(추정) 포함"

수유 방식에 따른 입력 필드 표시 제어:
- `formula` 선택 시 → 유축기 방식 비활성화, 분유 등급 활성화
- `breast` 선택 시 → 유축기 방식 활성화, 분유 등급 비활성화
- `mixed` 선택 시 → 유축기 방식 활성화, 분유 등급 활성화

---

## 9. 결과 UI 상세

### KPI 카드 (4개)

| 카드 | 레이블 | 서브 텍스트 |
|------|--------|-----------|
| Main | 절감 예상액 | 완모 vs 완분 차이 |
| 일반 | 완분 누적 비용 | 잔여 기간 기준 |
| 일반 | 완모 누적 비용 | 유축기+소모품 포함 |
| Accent | 손익분기 시점 | 유축기 구매 기준 N개월 |

손익분기 카드:
- 렌탈 선택 시: "유축기 렌탈 시 손익분기 없음 (월 비용 계속 발생)"
- `buy-electric` / `buy-manual`: "구매 후 **N개월**부터 분유보다 저렴"
- 12개월 내 회수 불가 시: "12개월 내 초기 비용 회수 어려움"
- `none` (보유 중): "유축기 초기 비용 없음"

### 분유 소비량 요약 (2개 소카드)

| 항목 | 내용 |
|------|------|
| 분유 총 소비량 | 약 X g (잔여 기간) |
| 총 캔 수 (800g 기준) | 약 X캔 |

### 자연어 결과 메시지

```text
완전 분유(일반) 기준으로 남은 X개월 동안 약 XX만 원이 예상됩니다.
완전 모유수유 + 전동 유축기 구매 기준으로는 약 XX만 원으로,
분유 대비 약 XX만 원을 절감할 수 있습니다.
전동 유축기 구매 비용(22만 원)은 약 N개월 시점에 분유 지출보다 낮아집니다.
```

---

## 10. 월별 비용 비교표

| 월령 | 완전 모유수유 | 혼합 수유 | 완전 분유 |
|------|------------|---------|---------|
| 0개월 | X원 | X원 | X원 |
| 1개월 | X원 | X원 | X원 |
| … | … | … | … |
| 11개월 | X원 | X원 | X원 |
| **합계** | **X원** | **X원** | **X원** |

- 현재 월령 이전 행은 회색 처리 + "지난 기간" 레이블
- 잔여 기간 행만 합계에 포함

---

## 11. 누적 비용 추이 차트

- Chart.js Line 차트
- X축: 0~12개월
- Y축: 누적 비용 (원, 천 원 단위 생략)
- 3선: 완모(초록), 혼합(노랑), 완분(파랑)
- 손익분기 시점에 수직선 + 레이블 표시
- 유축기 초기 비용은 0개월 시점 점프로 표현

---

## 12. 수유 방식 설명 카드 (3개)

```text
카드 1 — 완전 모유수유
초기 유축기·소모품 비용이 있지만 분유 구매 비용이 없어 장기적으로 가장 저렴합니다.
모유는 면역 성분이 포함되어 있으며 아기에게 맞춤형 영양을 제공합니다.
직장 복귀 시 냉동 모유·유축 일정 관리가 필요합니다.

카드 2 — 혼합 수유
모유와 분유를 병행해 수유 부담을 분산합니다.
분유 소비량이 절반으로 줄어 완전 분유 대비 비용을 낮출 수 있습니다.
수유와 분유 준비를 동시에 해야 하는 번거로움이 있습니다.

카드 3 — 완전 분유
유축기·소모품 초기 비용이 없으며 수유 부담이 없습니다.
월 분유 비용이 꾸준히 발생하며, 브랜드 선택에 따라 지출 차이가 큽니다.
월령이 높아질수록 이유식 병행으로 분유 소비량이 자연스럽게 줄어듭니다.
```

---

## 13. JavaScript 설계

```js
// public/scripts/breastfeeding-vs-formula-cost.js
(() => {
  const DATA = JSON.parse(document.getElementById('bvf-data').textContent);
  // DATA: { DAILY_FORMULA_GRAMS, FORMULA_PRICE, PUMP_COST, SUPPLIES_MONTHLY }

  let state = {
    method: 'formula',
    currentAge: 0,
    formulaGrade: 'standard',
    pumpOption: 'none',
    includeSupplies: true,
  };

  function readInputs() {
    state.method        = q('[data-bvf-input="method"]:checked')?.value ?? 'formula';
    state.currentAge    = parseInt(q('[data-bvf-input="age"]')?.value ?? '0', 10);
    state.formulaGrade  = q('[data-bvf-input="grade"]:checked')?.value ?? 'standard';
    state.pumpOption    = q('[data-bvf-input="pump"]:checked')?.value ?? 'none';
    state.includeSupplies = q('[data-bvf-input="supplies"]')?.checked ?? true;
  }

  function calcMonthlyFormulaCost(age, grade) {
    const dailyG = DATA.DAILY_FORMULA_GRAMS[age] ?? 48;
    const monthlyG = dailyG * 30;
    return (monthlyG / 800) * DATA.FORMULA_PRICE[grade];
  }

  function calculate(s) {
    const pump = DATA.PUMP_COST[s.pumpOption];
    const suppliesCost = s.includeSupplies ? DATA.SUPPLIES_MONTHLY : 0;
    const monthly = [];

    let totalBreast = pump.initial; // 유축기 초기 비용은 0개월에 선반영
    let totalMixed = 0;
    let totalFormula = 0;
    let totalFormulaGrams = 0;

    for (let age = s.currentAge; age < 12; age++) {
      const formulaCost = calcMonthlyFormulaCost(age, s.formulaGrade);
      const formulaGrams = (DATA.DAILY_FORMULA_GRAMS[age] ?? 48) * 30;

      const breastCost = suppliesCost + pump.monthly;
      const mixedCost  = formulaCost * 0.5 + suppliesCost + (s.pumpOption !== 'none' ? pump.monthly : 0);

      totalBreast += breastCost;
      totalMixed  += mixedCost;
      totalFormula += formulaCost;
      totalFormulaGrams += formulaGrams;

      monthly.push({ age, breastCost, mixedCost, formulaCost, formulaGrams });
    }

    // 손익분기점 계산 (구매 방식만 해당)
    let breakEvenMonth = null;
    if (pump.initial > 0) {
      const avgMonthlySavings = monthly.reduce((acc, r) => {
        return acc + (r.formulaCost - r.breastCost);
      }, 0) / monthly.length;
      if (avgMonthlySavings > 0) {
        breakEvenMonth = Math.ceil(pump.initial / avgMonthlySavings);
      }
    }

    return {
      monthly,
      totalBreast,
      totalMixed,
      totalFormula,
      formulaCanCount: Math.ceil(totalFormulaGrams / 800),
      breakEvenMonth,
      savings: totalFormula - totalBreast,
      pumpCost: pump.initial,
    };
  }

  function renderKpi(r) { /* 4개 카드 갱신 */ }
  function renderSummary(r) { /* 소비량·캔 수 갱신 */ }
  function renderMessage(r, s) { /* 자연어 메시지 갱신 */ }
  function renderTable(r, s) { /* 월별 비교표 갱신 */ }
  function renderChart(r, s) { /* Chart.js 라인 차트 갱신 */ }
  function toggleInputVisibility(method) {
    /* 수유 방식에 따라 분유 등급·유축기 방식 필드 활성화/비활성화 */
  }
  function applyPreset(id) { /* 프리셋 적용 */ }
  function syncUrl(s) {}
  function restoreFromUrl() {}
  function bindEvents() {}
  function q(sel) { return document.querySelector(sel); }

  restoreFromUrl();
  bindEvents();
  const result = calculate(state);
  renderKpi(result);
  renderSummary(result);
  renderMessage(result, state);
  renderTable(result, state);
  renderChart(result, state);
})();
```

URL 파라미터: `method` / `age` / `grade` / `pump` / `supplies`

---

## 14. SCSS 설계

```scss
.bvf-page {

  .bvf-preset-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 20px;

    .bvf-preset-btn {
      border: 1px solid #dce6e2;
      border-radius: 20px;
      padding: 6px 14px;
      font-size: 0.82rem;
      cursor: pointer;
      background: #fff;
      &.is-active { background: #0F6E56; color: #fff; border-color: #0F6E56; }
    }
  }

  .bvf-method-toggle {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 16px;

    label {
      flex: 1 1 auto;
      border: 1.5px solid #dce6e2;
      border-radius: 8px;
      padding: 10px 12px;
      cursor: pointer;
      text-align: center;
      font-size: 0.9rem;
      transition: border-color 0.15s, background 0.15s;
    }
    input[type="radio"]:checked + label {
      border-color: #0F6E56;
      background: #E1F5EE;
      font-weight: 600;
    }
  }

  .bvf-kpi-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(2, 1fr);
    @media (min-width: 900px) { grid-template-columns: repeat(4, 1fr); }
  }

  .bvf-summary-row {
    display: flex;
    gap: 12px;
    margin-top: 12px;

    .bvf-summary-card {
      flex: 1;
      background: #f8faf9;
      border-radius: 10px;
      padding: 14px 16px;
      font-size: 0.88rem;

      .bvf-summary-label { color: #6b7280; font-size: 0.8rem; margin-bottom: 4px; }
      .bvf-summary-value { font-size: 1.1rem; font-weight: 700; color: #111827; }
    }
  }

  .bvf-compare-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.88rem;
    margin-top: 16px;

    th, td {
      padding: 9px 12px;
      border-bottom: 1px solid #e8ede9;
      text-align: right;
    }
    th:first-child, td:first-child { text-align: left; }

    thead th { background: #f3f4f6; font-weight: 600; font-size: 0.82rem; }
    tr.is-past td { color: #9ca3af; }
    tr.is-total td { font-weight: 700; background: #f0fdf4; }

    td.col-breast { color: #0F6E56; }
    td.col-mixed  { color: #b45309; }
    td.col-formula { color: #1a56db; }
  }

  .bvf-chart-wrap {
    position: relative;
    height: 260px;
    margin-top: 24px;
    @media (min-width: 760px) { height: 320px; }
  }

  .bvf-tip-grid {
    display: grid;
    gap: 12px;
    margin-top: 24px;
    @media (min-width: 760px) { grid-template-columns: repeat(3, 1fr); }

    .bvf-tip-card {
      border: 1px solid #e8ede9;
      border-radius: 12px;
      padding: 16px;
      font-size: 0.87rem;
      line-height: 1.7;

      .bvf-tip-title {
        font-size: 0.95rem;
        font-weight: 700;
        margin-bottom: 8px;
        color: #0F6E56;
      }
    }
  }

  // 비활성 입력 그룹 처리
  .bvf-field-group.is-disabled {
    opacity: 0.35;
    pointer-events: none;
  }
}
```

---

## 15. SEO 설계

```text
title: 모유수유 vs 분유 비용 계산기 - 12개월 총비용 비교 · 유축기 손익분기점
description: 완모·혼합·완분 수유 방식별 월별·누적 비용을 비교하세요. 유축기 구매 vs 렌탈 손익분기점, 분유 브랜드별 월 지출, 12개월 절감 금액을 한눈에 확인할 수 있습니다.
H1: 모유수유 vs 분유 비용 계산기
```

JSON-LD: `WebApplication` + `FAQPage`

키워드: 모유수유 비용 분유 비용 비교, 유축기 구매 렌탈 손익분기점, 분유 12개월 총비용, 완모 비용, 분유 월 얼마

---

## 16. SeoContent 초안

### introTitle
`모유수유 vs 분유 비용 계산기 — 수유 방식별 12개월 실비용 비교`

### intro (5문단)

1. 출산 전 수유 방식을 결정할 때 비용이 중요한 고려 요소 중 하나입니다. 모유수유는 분유값이 들지 않는 대신 유축기와 수유 소모품 초기 비용이 발생하고, 완전 분유는 초기 비용은 없지만 12개월 내내 꾸준한 지출이 이어집니다. 어느 쪽이 실제로 저렴한지, 언제부터 이득이 되는지를 숫자로 확인하는 것이 이 계산기의 목적입니다.

2. 분유 비용은 아기 월령에 따라 달라집니다. 신생아(0~1개월)는 하루 약 480ml, 4~5개월에는 720ml까지 늘어난 뒤 이유식이 시작되는 6개월 이후부터 서서히 줄어듭니다. 이 계산기는 대한소아과학회 권고 기준을 참고한 월령별 분유 소비량을 바탕으로 월별 지출을 자동 계산합니다. (추정값)

3. 유축기 구매와 렌탈 중 어느 쪽이 유리한지도 계산할 수 있습니다. 전동 유축기 구매(약 22만 원)는 초기 비용이 크지만 장기적으로 렌탈비가 없습니다. 렌탈(월 약 2만 원)은 초기 부담이 없는 대신 사용 기간 동안 비용이 계속 발생합니다. 12개월 완모를 계획한다면 구매가 유리한 경우가 많습니다.

4. 혼합 수유는 완모와 완분의 중간 비용 구조를 가집니다. 분유 소비량이 절반으로 줄어 분유 지출이 감소하고, 수유 부담도 분산됩니다. 직장 복귀 시점이나 젖양 부족으로 완모가 어려울 때 혼합 수유로 전환하는 경우가 많으므로, 혼합 시나리오도 함께 비교해보는 것이 좋습니다.

5. 이 계산기의 분유 단가, 유축기 비용, 소모품 비용은 2026년 기준 추정값입니다. 실제 브랜드·구매처에 따라 차이가 있을 수 있으므로 참고용으로만 활용하세요. 모유수유 상담비, 유선염 치료비 등 의료비 항목은 포함되어 있지 않습니다.

### FAQ (8개)

```ts
export const BVF_FAQ = [
  {
    question: "모유수유는 무조건 분유보다 저렴한가요?",
    answer: "항상 그렇지는 않습니다. 전동 유축기(약 22만 원)와 소모품(월 약 1.8만 원) 비용을 포함하면 초반 2~4개월은 분유보다 비쌀 수 있습니다. 일반적으로 일반 분유 기준으로는 3~5개월 이후부터 누적 비용이 역전됩니다. 프리미엄 분유와 비교하면 손익분기점이 더 빨리 옵니다.",
  },
  {
    question: "유축기는 구매와 렌탈 중 어느 쪽이 유리한가요?",
    answer: "12개월 완모를 계획한다면 전동 유축기 구매가 대부분의 경우 유리합니다. 전동 유축기 약 22만 원 ÷ 월 분유 절감액(약 3~5만 원) = 약 4~7개월이 손익분기점입니다. 수유 기간이 6개월 이하로 짧거나, 모유 분비 상태에 따라 완모 유지가 불확실하다면 렌탈이 초기 부담을 줄이는 데 유리합니다.",
  },
  {
    question: "혼합 수유 시 비용이 정확히 절반으로 줄어드나요?",
    answer: "분유 비용은 약 절반으로 줄어들지만, 모유수유 소모품 비용(수유패드 등)은 계속 발생합니다. 이 계산기에서는 혼합 수유를 '분유 50% + 소모품 비용' 구조로 추정합니다. 실제 혼합 비율에 따라 달라질 수 있습니다.",
  },
  {
    question: "이유식을 시작하면 분유 소비량이 줄어드나요?",
    answer: "네. 일반적으로 생후 6개월부터 이유식을 시작하면서 분유 1일 섭취량이 점차 줄어듭니다. 이 계산기는 월령별 권장 섭취량 변화를 반영하여 6개월 이후 분유 비용이 자동으로 낮아지도록 설계되어 있습니다.",
  },
  {
    question: "프리미엄 분유와 일반 분유의 비용 차이는 얼마나 되나요?",
    answer: "800g 기준 일반 분유 약 2.7만 원, 프리미엄 약 6.2만 원으로 2배 이상 차이가 납니다. (추정) 12개월 기준 총비용 차이는 약 50만 원 이상에 달할 수 있습니다. 브랜드별 실제 가격은 구매처에 따라 다릅니다.",
  },
  {
    question: "소모품 비용에는 무엇이 포함되나요?",
    answer: "수유패드, 모유 저장팩, 젖병 세정제, 수유 브라 등을 포함하며 월 약 1.8만 원(추정)으로 반영했습니다. 유선염 치료비, 수유 상담비, 수유 쿠션 등은 개인차가 크므로 포함하지 않았습니다.",
  },
  {
    question: "직장 복귀 후에도 모유수유를 유지하면 비용 절감이 가능한가요?",
    answer: "가능합니다. 직장 복귀 후 유축기로 냉동 모유를 준비하면 분유 지출 없이 수유를 유지할 수 있습니다. 다만 유축 시간 확보와 냉동 모유 관리에 추가 노력이 필요합니다. 직장 환경에 따라 유축 공간 여건도 확인이 필요합니다.",
  },
  {
    question: "이 계산기의 분유 가격은 어떤 기준인가요?",
    answer: "2026년 5월 기준 국내 주요 온·오프라인 유통 채널의 평균 가격을 참고한 추정값입니다. 정기배송 할인, 대용량 구매, 멤버십 할인 등에 따라 실제 가격이 달라질 수 있습니다. 참고용으로만 활용하세요.",
  },
];
```

---

## 17. 관련 링크

- `/tools/formula-cost/` — 분유 브랜드별 비용 계산기
- `/tools/diaper-cost/` — 기저귀 비용 계산기
- `/tools/baby-cost-first-year/` — 첫해 육아비용 총정리 계산기
- `/reports/baby-cost-2016-vs-2026/` — 육아비용 10년 변화 리포트
- `/tools/parental-leave-short-work/` — 육아휴직·단축근무 급여 계산기

---

## 18. QA 체크리스트

- [ ] 수유 방식 변경 시 유축기·분유 등급 필드 활성화/비활성화 정상 동작
- [ ] 월령 11개월 선택 시 잔여 1개월만 계산 (12개월 = 0행, 안내 메시지 표시)
- [ ] 유축기 없음(none) 선택 시 손익분기 카드 "초기 비용 없음"으로 표시
- [ ] 렌탈 선택 시 손익분기 카드 "렌탈 방식은 월 비용 계속 발생" 안내
- [ ] 소모품 체크 해제 시 모유수유 비용 감소 반영
- [ ] 누적 비용 차트 3선 (완모/혼합/완분) 정상 렌더링
- [ ] 차트에 손익분기 수직선 표시 (구매 방식이고 breakEvenMonth ≤ 12일 때)
- [ ] 월별 비교표 — 지난 월령 행 회색 처리
- [ ] 월별 비교표 합계 행 — 잔여 기간 합계만 반영
- [ ] 프리셋 5개 클릭 시 모든 입력값 즉시 갱신
- [ ] URL 파라미터 복원 정상 동작
- [ ] InfoNotice "추정값" 면책 문구 노출 확인
- [ ] 모바일 360px — KPI 2열, 표 가로 스크롤 정상
- [ ] `추정` 레이블 분유 단가·유축기 비용 근처 표시 확인
- [ ] `tools.ts`, `app.scss`, `sitemap.xml` 등록 완료
- [ ] `npm run build` 성공
