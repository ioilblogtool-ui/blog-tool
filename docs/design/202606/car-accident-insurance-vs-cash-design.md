# 자동차 사고 보험처리 vs 현금처리 계산기 설계 문서

> 기획 원본: `docs/plan/202606/car-accident-insurance-vs-cash-plan.md`  
> 작성일: 2026-06-19  
> 레이아웃: `SimpleToolShell`  
> 슬러그: `car-accident-insurance-vs-cash-calculator`  
> prefix: `cacc-`

---

## 1. 파일 구조

```
src/data/carAccidentInsuranceVsCash.ts
src/pages/tools/car-accident-insurance-vs-cash-calculator.astro
public/scripts/car-accident-insurance-vs-cash-calculator.js
src/styles/scss/pages/_car-accident-insurance-vs-cash.scss
```

등록 위치:
- `src/data/tools.ts` — order: 70.5 (자동차 카테고리, car-insurance-premium 다음)
- `public/sitemap.xml`

---

## 2. 데이터 파일 (`src/data/carAccidentInsuranceVsCash.ts`)

```ts
export const CACC_META = {
  slug: "car-accident-insurance-vs-cash-calculator",
  title: "자동차 사고 보험처리 vs 현금처리 계산기",
  seoTitle: "자동차 사고 보험처리 vs 현금처리 계산기 2026 | 수리비 얼마부터 보험처리할까",
  description:
    "수리비·자기부담금·할증률을 입력하면 보험처리와 현금처리 중 어느 쪽이 유리한지 3년 총비용 기준으로 즉시 계산합니다. 손익분기 수리비와 절약 금액 자동 산출.",
} as const;

export interface CaccPreset {
  id: string;
  label: string;
  repairCost: number;      // 만원 단위
  deductible: number;      // 자기부담금 (만원)
  surchargeRate: number;   // 할증률 (%)
}

export const CACC_PRESETS: CaccPreset[] = [
  { id: "minor",  label: "경미한 접촉",  repairCost: 80,  deductible: 20, surchargeRate: 7  },
  { id: "bumper", label: "범퍼 교체",    repairCost: 150, deductible: 20, surchargeRate: 12 },
  { id: "medium", label: "중간 사고",    repairCost: 350, deductible: 20, surchargeRate: 20 },
  { id: "major",  label: "대형 사고",    repairCost: 700, deductible: 30, surchargeRate: 35 },
];

export interface CaccSurchargeGuide {
  range: string;
  rate: string;
  note: string;
}

export const CACC_SURCHARGE_GUIDE: CaccSurchargeGuide[] = [
  { range: "50만원 미만",    rate: "0~5%",   note: "소손해 처리 적용 가능, 보험사별 상이" },
  { range: "50~150만원",    rate: "5~15%",  note: "가장 많이 고민하는 구간" },
  { range: "150~500만원",   rate: "15~30%", note: "보험처리 유리 가능성 높음" },
  { range: "500만원 이상",   rate: "30~60%", note: "보험처리 유리, 등급 영향 큼" },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const CACC_FAQS: FaqItem[] = [
  {
    question: "보험처리하면 보험료가 얼마나 오르나요?",
    answer:
      "보험사·사고 유형·현재 등급에 따라 다르지만, 일반적으로 경미한 사고는 5~15%, 중간 사고는 15~30%, 대형 사고는 30~60% 수준으로 할증됩니다. 할증은 보통 3년간 유지됩니다. 이 계산기에서 예상 할증률을 직접 입력해 3년 총비용을 비교해보세요.",
  },
  {
    question: "현금처리 제안받았는데 어떻게 판단해야 하나요?",
    answer:
      "수리비 견적과 예상 할증률을 기준으로 3년 총비용을 비교하면 됩니다. 수리비가 '자기부담금 + 3년 추가 보험료 합산'보다 낮으면 현금처리가 유리합니다. 이 계산기에서 수리비를 입력하면 손익분기 금액이 바로 나옵니다.",
  },
  {
    question: "소손해 처리(할증 없는 보험처리)란 무엇인가요?",
    answer:
      "일부 보험사에서는 사고 손해액이 일정 금액 미만인 경우 보험처리를 해도 할증이 없는 '소손해 처리' 제도를 운용합니다. 보험사마다 기준이 다르므로 가입 보험사에 직접 확인하는 것이 좋습니다. 소손해 처리 적용이 가능하다면 보험처리가 훨씬 유리할 수 있습니다.",
  },
  {
    question: "무사고 할인이 사라지면 손해가 얼마나 되나요?",
    answer:
      "무사고 연수가 길수록 할인 폭이 크기 때문에 보험처리 시 손해도 커집니다. 예를 들어 무사고 10년 이상으로 최대 60% 할인을 받고 있다면, 보험처리 한 번으로 할인이 줄어드는 손실까지 계산에 포함해야 합니다. 이 계산기는 할증률 기준으로 단순 계산하므로, 무사고 등급 변화가 큰 경우 보험사에 별도 문의를 권장합니다.",
  },
  {
    question: "상대방 과실이 있으면 계산이 달라지나요?",
    answer:
      "상대방 과실이 있다면 상대방 보험사에서 수리비 일부 또는 전액을 청구할 수 있어, 내 보험을 사용하지 않아도 됩니다. 이 경우 내 보험 할증 없이 처리가 가능하므로 반드시 과실 비율을 먼저 확인하세요. 이 계산기는 내 과실로 인한 단독 보험처리 상황을 기준으로 합니다.",
  },
  {
    question: "보험등급보호 특약이 있으면 보험처리가 무조건 유리한가요?",
    answer:
      "보험등급보호 특약은 1회 사고 시 등급 하락을 막아주므로, 특약이 있다면 보험처리 부담이 크게 줄어듭니다. 다만 특약 사용 후 다음 해부터 특약이 소멸되거나 보험료가 오를 수 있어 약관을 확인해야 합니다. 특약 유무와 적용 조건은 가입 보험사에 문의하세요.",
  },
  {
    question: "3년 이후에는 할증이 완전히 없어지나요?",
    answer:
      "대부분의 보험사는 사고 이력 할증을 3년간 적용합니다. 3년이 지나면 해당 사고의 할증은 사라지지만, 무사고 등급을 처음부터 회복하는 데는 추가 시간이 걸릴 수 있습니다. 보험사별로 등급 회복 기준이 다르므로 정확한 내용은 가입 보험사에 확인하세요.",
  },
];

export const CACC_DEFAULTS = {
  repairCost: 150,         // 만원
  deductible: 20,          // 만원
  annualPremium: 80,       // 만원
  surchargeRate: 12,       // %
  surchargePeriod: 3,      // 년
};
```

---

## 3. 계산 로직

### 핵심 공식

```js
// 보험처리 3년 총비용
const annualSurcharge = annualPremium * (surchargeRate / 100);  // 연 할증 금액
const insuranceTotalCost = deductible + annualSurcharge * surchargePeriod;

// 현금처리 총비용
const cashTotalCost = repairCost;

// 판단
const verdict = cashTotalCost < insuranceTotalCost ? "cash" : "insurance";
const saving = Math.abs(cashTotalCost - insuranceTotalCost);

// 손익분기 수리비 (보험처리와 현금처리 비용이 같아지는 수리비)
const breakEvenRepairCost = insuranceTotalCost;
// → 수리비가 breakEvenRepairCost보다 크면 보험처리 유리
```

### 연도별 누적 비교 (테이블용)

```js
function buildYearlyTable(state) {
  const { deductible, annualPremium, surchargeRate, surchargePeriod, repairCost } = state;
  const annualSurcharge = annualPremium * (surchargeRate / 100);

  const rows = [];
  let insuranceCumulative = deductible; // 즉시 자기부담금
  let cashCumulative = repairCost;      // 즉시 수리비 전액

  for (let year = 1; year <= surchargePeriod; year++) {
    insuranceCumulative += annualSurcharge;
    rows.push({
      year,
      insuranceCumulative,
      cashCumulative,            // 현금은 추가 비용 없음
      diff: cashCumulative - insuranceCumulative,
    });
  }
  return rows;
}
```

### 판단 텍스트

| 조건 | 결과 배지 | 설명 |
|------|---------|------|
| `cashTotalCost < insuranceTotalCost` | "현금처리 유리" (초록) | 수리비가 할증 총비용보다 저렴 |
| `cashTotalCost > insuranceTotalCost` | "보험처리 유리" (파랑) | 할증 총비용보다 수리비가 비쌈 |
| 차이 10만원 미만 | "비슷함 — 무사고 등급 고려" (회색) | 근소한 차이, 등급 보호 우선 검토 |

---

## 4. 화면 구성 (Astro 마크업)

```
[Hero]
  eyebrow: "사고 대응"
  title: "보험처리 vs 현금처리 계산기"
  description: "수리비와 할증률을 입력하면 3년 총비용을 기준으로 어느 쪽이 유리한지 즉시 계산합니다."

[프리셋 버튼 행 — Hero 아래]
  경미한 접촉 / 범퍼 교체 / 중간 사고 / 대형 사고

[SimpleToolShell]
  aside (입력):
    [수리비 견적]         슬라이더 10~2,000만원
    [자기부담금]          슬라이더 0~50만원
    [현재 연 보험료]       슬라이더 30~300만원
    [예상 할증률]         슬라이더 0~60%
    [할증 유지 기간]       선택 (1~5년, 기본 3년)

  main (결과):
    [KPI 3개]
      - 판단 결과 (보험처리 유리 / 현금처리 유리 / 비슷함)
      - 유리한 선택 시 절약 금액
      - 손익분기 수리비

    [3년 비용 비교 테이블]
      연도 | 보험처리 누적비용 | 현금처리 비용 | 차이

    [추가 고려사항 안내 패널]
    [할증률 참고 가이드 테이블]

[SeoContent + FAQ]
```

---

## 5. 컴포넌트 구조 (`car-accident-insurance-vs-cash-calculator.astro`)

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SimpleToolShell from "../../components/SimpleToolShell.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import ToolActionBar from "../../components/ToolActionBar.astro";
import {
  CACC_META, CACC_PRESETS, CACC_SURCHARGE_GUIDE,
  CACC_FAQS, CACC_DEFAULTS
} from "../../data/carAccidentInsuranceVsCash";
---
```

### JSON-LD

```js
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": CACC_META.title,
  "applicationCategory": "FinanceApplication",
  "description": CACC_META.description,
  "url": `${SITE}/tools/car-accident-insurance-vs-cash-calculator/`,
}
```

### config JSON (mwcConfig 패턴과 동일)

```astro
<script id="caccConfig" type="application/json" set:html={JSON.stringify({
  presets: CACC_PRESETS,
  defaults: CACC_DEFAULTS,
  surchargeGuide: CACC_SURCHARGE_GUIDE,
})} />
```

---

## 6. JS 로직 (`public/scripts/car-accident-insurance-vs-cash-calculator.js`)

### 상태 관리

```js
function readState() {
  return {
    repairCost:     parseNum(q("[data-cacc-repair]")?.value),
    deductible:     parseNum(q("[data-cacc-deductible]")?.value),
    annualPremium:  parseNum(q("[data-cacc-premium]")?.value),
    surchargeRate:  parseNum(q("[data-cacc-surcharge]")?.value),
    surchargePeriod: parseNum(q("[data-cacc-period]")?.value) || 3,
  };
}
```

### 계산 함수

```js
function calculate(state) {
  const annualSurcharge = state.annualPremium * (state.surchargeRate / 100);
  const insuranceTotalCost = state.deductible + annualSurcharge * state.surchargePeriod;
  const cashTotalCost = state.repairCost;
  const saving = Math.abs(cashTotalCost - insuranceTotalCost);
  const breakEven = insuranceTotalCost;
  const diff = cashTotalCost - insuranceTotalCost;

  let verdict;
  if (Math.abs(diff) < 10) {
    verdict = "close";
  } else if (diff < 0) {
    verdict = "cash";   // 현금처리 유리
  } else {
    verdict = "insurance"; // 보험처리 유리
  }

  const yearlyRows = buildYearlyTable(state, annualSurcharge);

  return { verdict, saving, breakEven, insuranceTotalCost, cashTotalCost, yearlyRows, annualSurcharge };
}
```

### 렌더링 주요 DOM 업데이트

```js
function render(result) {
  // 판단 배지
  const badge = q("[data-cacc-verdict]");
  badge.textContent = VERDICT_TEXT[result.verdict].label;
  badge.className = `cacc-verdict-badge cacc-verdict-badge--${result.verdict}`;

  // KPI
  setText("[data-cacc-saving]", fmt(result.saving));
  setText("[data-cacc-breakeven]", `${fmt(result.breakEven)} 이상이면 보험처리 유리`);
  setText("[data-cacc-insurance-total]", fmt(result.insuranceTotalCost));
  setText("[data-cacc-cash-total]", fmt(result.cashTotalCost));

  // 연도별 테이블
  renderYearlyTable(result.yearlyRows);
}
```

### 프리셋 적용

```js
function applyPreset(id) {
  const preset = presets.find(p => p.id === id);
  if (!preset) return;
  q("[data-cacc-repair]").value = preset.repairCost * 10000;
  q("[data-cacc-deductible]").value = preset.deductible * 10000;
  q("[data-cacc-surcharge]").value = preset.surchargeRate;
  syncSliders();
  update();
  highlightPreset(id);
}
```

### 이벤트 바인딩

```js
// 입력값 변경 → 즉시 재계산
["data-cacc-repair", "data-cacc-deductible", "data-cacc-premium",
 "data-cacc-surcharge", "data-cacc-period"].forEach(attr => {
  q(`[${attr}]`)?.addEventListener("input", update);
});

// 슬라이더 ↔ 숫자 입력 동기화 (url-state.js 패턴 참고)
// 프리셋 버튼
qa("[data-cacc-preset]").forEach(btn =>
  btn.addEventListener("click", () => applyPreset(btn.dataset.caccPreset))
);

// 초기 실행
applyPreset("bumper"); // 기본: 범퍼 교체
```

---

## 7. SCSS (`src/styles/scss/pages/_car-accident-insurance-vs-cash.scss`)

### 주요 클래스 계획

```scss
.cacc-page { /* 페이지 루트, CSS 변수 정의 */ }

.cacc-preset-grid { /* 프리셋 버튼 행 — flex wrap */ }
.cacc-preset-btn { /* 개별 프리셋 버튼 */ }
.cacc-preset-btn.is-active { /* 선택 상태 */ }

.cacc-kpi-grid { /* KPI 3열 그리드 */ }
.cacc-kpi-card { /* 개별 KPI 카드 */ }
.cacc-kpi-card--verdict { /* 판단 결과 카드 — 강조 */ }

.cacc-verdict-badge { /* 판단 배지 공통 */ }
.cacc-verdict-badge--insurance { /* 파랑 — 보험처리 유리 */ }
.cacc-verdict-badge--cash { /* 초록 — 현금처리 유리 */ }
.cacc-verdict-badge--close { /* 회색 — 비슷함 */ }

.cacc-table-wrap { /* 비교 테이블 래퍼 */ }
.cacc-compare-table { /* 연도별 비교 테이블 */ }

.cacc-notice-panel { /* 추가 고려사항 안내 패널 */ }
.cacc-guide-table { /* 할증률 참고 가이드 */ }
```

### import 추가 위치

```scss
// src/styles/app.scss 하단에 추가
@use "scss/pages/car-accident-insurance-vs-cash" as *;
```

---

## 8. tools.ts 등록

```ts
{
  slug: "car-accident-insurance-vs-cash-calculator",
  title: "자동차 사고 보험처리 vs 현금처리 계산기",
  description: "수리비와 할증률을 입력하면 보험처리와 현금처리 3년 총비용을 즉시 비교합니다. 손익분기 수리비 자동 산출.",
  order: 70.5,
  category: "자동차",
  badges: ["NEW"],
  eyebrow: "사고 대응",
  previewStats: [
    { label: "비교 기준", value: "3년 총비용" },
    { label: "판단 프리셋", value: "4종" },
  ],
},
```

---

## 9. sitemap.xml 추가

```xml
<url>
  <loc>https://bigyocalc.com/tools/car-accident-insurance-vs-cash-calculator/</loc>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## 10. 구현 순서

| 단계 | 작업 | 체크 |
|------|------|------|
| 1 | `src/data/carAccidentInsuranceVsCash.ts` 생성 | ☐ |
| 2 | `src/styles/scss/pages/_car-accident-insurance-vs-cash.scss` 생성 + `app.scss` import | ☐ |
| 3 | `src/pages/tools/car-accident-insurance-vs-cash-calculator.astro` 생성 | ☐ |
| 4 | `public/scripts/car-accident-insurance-vs-cash-calculator.js` 생성 | ☐ |
| 5 | `src/data/tools.ts` 등록 | ☐ |
| 6 | `public/sitemap.xml` URL 추가 | ☐ |
| 7 | `npm run build` 검증 | ☐ |
| 8 | 프리셋 4종 동작 확인 | ☐ |
| 9 | 슬라이더 ↔ 숫자 동기화 확인 | ☐ |
| 10 | 모바일 레이아웃 확인 | ☐ |

---

## 11. QA 포인트

- 수리비 = 손익분기 금액 입력 시 "비슷함" 배지 표시되는지
- 할증률 0% 입력 시: 보험처리 비용 = 자기부담금만, 결과 "보험처리 유리" 가능성 높음
- 할증 유지 기간 1년 선택 시 테이블 1행만 표시
- 프리셋 변경 시 슬라이더 + 숫자 입력값 동시 업데이트
- 숫자 3자리 콤마 포매팅 (만원 단위 표시)
- InfoNotice 면책 문구: "할증률은 보험사·사고이력·계약 조건에 따라 다릅니다. 정확한 내용은 가입 보험사에 확인하세요."
