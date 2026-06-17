# 신차 vs 중고차 5년 총비용 계산기 설계 문서

## 기본 정보
- slug: `new-vs-used-car-5year-cost`
- 레이아웃: `SimpleToolShell`
- 데이터 파일: `src/data/newVsUsedCar5YearCost.ts`
- 스크립트: `public/scripts/new-vs-used-car-5year-cost.js`
- SCSS: `src/styles/scss/pages/_new-vs-used-car-5year-cost.scss`
- prefix: `nuc-`

## 화면 구성

```
[Hero: 신차 vs 중고차 5년 총비용 계산기 2026]
[aside: 입력 패널]         [main: 결과 영역]
  - 신차 조건               - KPI 카드 4개
  - 중고차 조건             - 연도별 누적비용 라인 차트
  - 프리셋 버튼 3종         - 비용 항목 테이블
                            - 결론 박스 (어느 쪽 유리)
[SeoContent + FAQ]
```

## 입력 패널 (aside)

### 프리셋 버튼
```html
<div class="nuc-presets">
  <button data-preset="small">소형차 (아반떼급)</button>
  <button data-preset="mid">준중형 (K5급)</button>
  <button data-preset="suv">SUV (투싼급)</button>
</div>
```

### 신차 섹션
```html
<section class="nuc-section">
  <h3>신차 조건</h3>
  <label>차량 가격 <input data-nuc="newPrice" type="number" value="3000"> 만원</label>
  <label>첫해 보험료 <input data-nuc="newInsurance" type="number" value="120"> 만원/년</label>
  <label>월 유지비 <input data-nuc="newMonthly" type="number" value="15"> 만원/월</label>
  <label>5년 후 잔존가치 <input data-nuc="newResidual" type="number" value="40"> %</label>
</section>
```

### 중고차 섹션
```html
<section class="nuc-section">
  <h3>중고차 조건</h3>
  <label>차량 가격 <input data-nuc="usedPrice" type="number" value="1800"> 만원</label>
  <label>연식 <input data-nuc="usedAge" type="number" value="3"> 년</label>
  <label>첫해 보험료 <input data-nuc="usedInsurance" type="number" value="90"> 만원/년</label>
  <label>월 유지비 <input data-nuc="usedMonthly" type="number" value="20"> 만원/월</label>
  <label>5년 후 잔존가치 <input data-nuc="usedResidual" type="number" value="25"> %</label>
</section>
```

## 계산 로직

### 취득세
```js
// 신차: 차량가격 × 7%
// 중고차: 차량가격 × 7% (동일, 단 경차는 4% — 단순화하여 7% 고정)
const newAcquisitionTax = newPrice * 0.07;
const usedAcquisitionTax = usedPrice * 0.07;
```

### 5년 총비용
```js
function calcTotal(price, acquisitionTax, insurance, monthly, residualPct) {
  const purchase = price + acquisitionTax;
  const insuranceTotal = insurance * 5;          // 5년 보험료 합산
  const maintenanceTotal = monthly * 12 * 5;     // 5년 유지비
  const depreciation = price * (1 - residualPct / 100); // 감가
  return { purchase, insuranceTotal, maintenanceTotal, depreciation,
           total: insuranceTotal + maintenanceTotal + depreciation + acquisitionTax };
}
```

### 연도별 누적비용 (라인 차트용)
```js
// 각 연도별 누적 지출 (감가는 선형 분산)
function calcYearly(price, acquisitionTax, insurance, monthly, residualPct) {
  const yearly = [];
  const annualDepreciation = price * (1 - residualPct / 100) / 5;
  for (let y = 1; y <= 5; y++) {
    yearly.push(acquisitionTax + insurance * y + monthly * 12 * y + annualDepreciation * y);
  }
  return yearly;
}
```

### 손익분기점
```js
// 신차 vs 중고차 누적비용이 역전되는 연도
// 연도별 비교하여 처음 역전 시점 반환
function findBreakEven(newYearly, usedYearly) {
  for (let i = 0; i < newYearly.length; i++) {
    if (newYearly[i] <= usedYearly[i]) return i + 1;
  }
  return null; // 5년 내 역전 없음
}
```

## KPI 카드 (4개)
```html
<div class="nuc-kpi-grid">
  <div class="nuc-kpi-card nuc-kpi-card--new">
    <span class="nuc-kpi__label">신차 5년 총비용</span>
    <span class="nuc-kpi__value" id="nucNewTotal">—</span>
  </div>
  <div class="nuc-kpi-card nuc-kpi-card--used">
    <span class="nuc-kpi__label">중고차 5년 총비용</span>
    <span class="nuc-kpi__value" id="nucUsedTotal">—</span>
  </div>
  <div class="nuc-kpi-card nuc-kpi-card--diff">
    <span class="nuc-kpi__label">차액</span>
    <span class="nuc-kpi__value" id="nucDiff">—</span>
  </div>
  <div class="nuc-kpi-card">
    <span class="nuc-kpi__label">손익분기점</span>
    <span class="nuc-kpi__value" id="nucBreakEven">—</span>
  </div>
</div>
```

## 라인 차트
- Chart.js Line, x축: 1~5년차, y축: 누적 총비용(만원)
- 신차: `#1a56db` (파랑), 중고차: `#f59e0b` (앰버)
- 교차 시점에 수직 점선 표시

## 결론 박스
```html
<!-- 신차가 유리한 경우 -->
<div class="nuc-conclusion nuc-conclusion--new">
  <strong>5년 기준 신차가 더 유리합니다</strong>
  <p>중고차 대비 약 XXX만원 절약</p>
</div>
<!-- 중고차가 유리한 경우 -->
<div class="nuc-conclusion nuc-conclusion--used">
  <strong>5년 기준 중고차가 더 유리합니다</strong>
  <p>신차 대비 약 XXX만원 절약</p>
</div>
```

## 비용 항목 테이블
| 항목 | 신차 | 중고차 |
|------|------|--------|
| 구매가 | | |
| 취득세 (7%) | | |
| 5년 보험료 | | |
| 5년 유지비 | | |
| 감가 손실 | | |
| **총 비용** | | |

## 프리셋 데이터

```ts
export const NUC_PRESETS = {
  small: {
    label: "소형차 (아반떼급)",
    newPrice: 2500, newInsurance: 100, newMonthly: 12, newResidual: 42,
    usedPrice: 1400, usedAge: 3, usedInsurance: 80, usedMonthly: 16, usedResidual: 28,
  },
  mid: {
    label: "준중형 (K5급)",
    newPrice: 3200, newInsurance: 120, newMonthly: 15, newResidual: 40,
    usedPrice: 1800, usedAge: 3, usedInsurance: 95, usedMonthly: 20, usedResidual: 25,
  },
  suv: {
    label: "SUV (투싼급)",
    newPrice: 3800, newInsurance: 140, newMonthly: 18, newResidual: 38,
    usedPrice: 2200, usedAge: 3, usedInsurance: 110, usedMonthly: 22, usedResidual: 23,
  },
};

export const NUC_DEFAULTS = NUC_PRESETS.mid;

export const NUC_META = {
  slug: "new-vs-used-car-5year-cost",
  title: "신차 vs 중고차 5년 총비용 계산기 2026 | 실제로 어떤 게 더 싸?",
  description: "신차·중고차 구매가격·보험·유지비·감가 입력하면 5년 총보유비용 바로 비교. 연도별 손익분기점 포함.",
  updatedAt: "2026-06-17",
  caution: "취득세·보험료·유지비는 차종·지역·운전 조건에 따라 다를 수 있습니다. 참고용 추정값입니다.",
};
```

## SCSS 구조
```scss
.nuc-page { ... }
.nuc-presets { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.nuc-presets button { ... }
.nuc-presets button.is-active { background: #1a56db; color: #fff; }
.nuc-section { background: #fff; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 1.25rem; margin-bottom: 1rem; }
.nuc-section h3 { font-size: 0.875rem; font-weight: 700; color: #374151; margin-bottom: 0.75rem; }
.nuc-kpi-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
.nuc-kpi-card { background: #f8f9fa; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 1rem; text-align: center; }
.nuc-kpi-card--new { border-top: 3px solid #1a56db; }
.nuc-kpi-card--used { border-top: 3px solid #f59e0b; }
.nuc-kpi-card--diff { border-top: 3px solid #10b981; }
.nuc-kpi__label { display: block; font-size: 0.75rem; color: #6b7280; }
.nuc-kpi__value { display: block; font-size: 1.5rem; font-weight: 700; color: #111827; }
.nuc-conclusion { border-radius: 0.75rem; padding: 1.25rem; margin: 1.5rem 0; }
.nuc-conclusion--new { background: #eff6ff; border: 1px solid #bfdbfe; }
.nuc-conclusion--used { background: #fffbeb; border: 1px solid #fde68a; }
.nuc-chart-wrap { position: relative; height: 280px; margin: 1.5rem 0; }
.nuc-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
.nuc-table th, .nuc-table td { padding: 0.625rem 0.75rem; border-bottom: 1px solid #e5e7eb; text-align: right; }
.nuc-table th:first-child, .nuc-table td:first-child { text-align: left; }
.nuc-table tfoot td { font-weight: 700; background: #f8f9fa; }
```

## 구현 순서
1. `src/data/newVsUsedCar5YearCost.ts` — NUC_PRESETS, NUC_DEFAULTS, NUC_META, NUC_FAQ
2. `src/pages/tools/new-vs-used-car-5year-cost.astro` — SimpleToolShell 마크업
3. `public/scripts/new-vs-used-car-5year-cost.js` — IIFE, calc, render, chart
4. `src/styles/scss/pages/_new-vs-used-car-5year-cost.scss`
5. `src/styles/app.scss` — @use 추가
6. `src/data/tools.ts` — 등록 (category: "자동차", order: 70.1)
7. `public/sitemap.xml` — URL 추가

## QA 포인트
- [ ] 신차가 유리한 경우 / 중고차가 유리한 경우 결론 박스 각각 정상 표시
- [ ] 5년 내 손익분기 없을 때 "5년 내 역전 없음" 표시
- [ ] 프리셋 3종 전환 시 모든 입력값 정상 반영
- [ ] 차트 신차/중고차 선 색상 구분
- [ ] 모바일 KPI 그리드 2열 정상 표시
