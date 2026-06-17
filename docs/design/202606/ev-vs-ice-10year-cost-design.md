# 전기차 vs 내연기관 10년 유지비 심화 비교 계산기 설계 문서

## 기본 정보
- slug: `ev-vs-ice-10year-cost`
- 레이아웃: `CompareToolShell`
- 데이터 파일: `src/data/evVsIce10YearCost.ts`
- 스크립트: `public/scripts/ev-vs-ice-10year-cost.js`
- SCSS: `src/styles/scss/pages/_ev-vs-ice-10year-cost.scss`
- prefix: `evi-`
- 기존 `ev-vs-ice-cost-calculator` 와 공존 (별도 페이지, 내부 링크로 연결)

## 화면 구성

```
[Hero: 전기차 vs 내연기관 10년 유지비 계산기 2026]
[aside: 공통 + 전기차 입력 + 내연기관 입력]
[main: 결과]
  - KPI 4개
  - 연도별 누적비용 라인 차트
  - 배터리 교체 시나리오 토글
  - 비용 항목 테이블
  - 지역별 보조금 프리셋
[SeoContent + FAQ]
```

## 입력 패널 (aside — CompareToolShell aside 슬롯)

### 공통 조건
```html
<section class="evi-section">
  <h3>공통 조건</h3>
  <label>연간 주행거리 <input data-evi="annualKm" type="number" value="15000"> km</label>
  <label>보유 기간 <input data-evi="holdYears" type="number" value="10" min="3" max="15"> 년</label>
</section>
```

### 지역별 보조금 프리셋
```html
<section class="evi-section">
  <h3>지역 선택 (보조금 자동 반영)</h3>
  <div class="evi-region-grid">
    <button class="evi-region-btn is-active" data-region="seoul">서울</button>
    <button class="evi-region-btn" data-region="gyeonggi">경기</button>
    <button class="evi-region-btn" data-region="busan">부산</button>
    <button class="evi-region-btn" data-region="daegu">대구</button>
    <button class="evi-region-btn" data-region="incheon">인천</button>
    <button class="evi-region-btn" data-region="gwangju">광주</button>
  </div>
</section>
```

### 전기차 조건
```html
<section class="evi-section">
  <h3>전기차 조건</h3>
  <label>차량 가격 <input data-evi="evPrice" type="number" value="5500"> 만원</label>
  <p class="evi-subsidy-display">국가 보조금: <strong id="eviNationalSubsidy">650</strong>만원 + 지자체: <strong id="eviLocalSubsidy">200</strong>만원</p>
  <label>배터리 용량 <input data-evi="evBattery" type="number" value="77"> kWh</label>
  <label>가정충전 비율 <input data-evi="homeChargePct" type="number" value="70"> %</label>
  <label>가정충전 단가 <input data-evi="homeChargeRate" type="number" value="120"> 원/kWh</label>
  <label>공공충전 단가 <input data-evi="publicChargeRate" type="number" value="300"> 원/kWh</label>
  <label class="evi-toggle-label">
    <input type="checkbox" data-evi-bool="includeBatteryReplace"> 배터리 교체 비용 포함 (10년차 +1,000만원)
  </label>
</section>
```

### 내연기관 조건
```html
<section class="evi-section">
  <h3>내연기관 조건</h3>
  <label>차량 가격 <input data-evi="icePrice" type="number" value="3500"> 만원</label>
  <label>연비 <input data-evi="iceFuelEff" type="number" value="12"> km/L</label>
  <label>연료 단가 <input data-evi="iceFuelPrice" type="number" value="1700"> 원/L</label>
  <label>연간 소모품비 <input data-evi="iceMaintenanceAnnual" type="number" value="50"> 만원/년</label>
</section>
```

## 계산 로직

### 전기차 연간 충전비
```js
function calcEvAnnualCharge(annualKm, evBattery, homeChargePct, homeChargeRate, publicChargeRate) {
  // 전비: 배터리 용량 기준 추정 (77kWh → 약 6km/kWh)
  const efficiency = 6.0; // km/kWh (추정, 추후 입력값으로 변경 가능)
  const totalKwh = annualKm / efficiency;
  const homeKwh = totalKwh * homeChargePct / 100;
  const publicKwh = totalKwh * (1 - homeChargePct / 100);
  return (homeKwh * homeChargeRate + publicKwh * publicChargeRate) / 10000; // 만원
}
```

### 내연기관 연간 연료비
```js
function calcIceAnnualFuel(annualKm, iceFuelEff, iceFuelPrice) {
  return annualKm / iceFuelEff * iceFuelPrice / 10000; // 만원
}
```

### 연도별 누적비용
```js
function calcYearly(params, holdYears) {
  const { evPrice, evSubsidy, evAnnualCharge, evInsurance,
          icePrice, iceAnnualFuel, iceMaintenanceAnnual, iceInsurance,
          includeBatteryReplace } = params;

  const evNetPrice = evPrice - evSubsidy;
  const evYearly = [];
  const iceYearly = [];

  for (let y = 1; y <= holdYears; y++) {
    let evCumul = evNetPrice + evAnnualCharge * y + evInsurance * y;
    if (includeBatteryReplace && y >= 10) evCumul += 1000; // 배터리 교체
    evYearly.push(evCumul);

    const iceCumul = icePrice + (iceAnnualFuel + iceMaintenanceAnnual + iceInsurance) * y;
    iceYearly.push(iceCumul);
  }
  return { evYearly, iceYearly };
}
```

### 손익분기점
```js
function findBreakEven(evYearly, iceYearly) {
  for (let i = 0; i < evYearly.length; i++) {
    if (evYearly[i] <= iceYearly[i]) return i + 1;
  }
  return null;
}
```

## KPI 카드 4개
1. **전기차 10년 총비용** (보조금 차감 후)
2. **내연기관 10년 총비용**
3. **차액** (전기차가 X만원 절약 / 손해)
4. **손익분기점** (X년차에 전기차가 더 유리해짐)

## 라인 차트
- x축: 1~보유기간(년), y축: 누적비용(만원)
- 전기차: `#10b981` (초록), 내연기관: `#6b7280` (회색)
- 교차 시점 수직 점선 + 라벨 "이 시점부터 전기차 유리"

## 지역별 보조금 데이터
```ts
export const EVI_SUBSIDIES: Record<string, { national: number; local: number }> = {
  seoul:    { national: 650, local: 200 },
  gyeonggi: { national: 650, local: 300 },
  busan:    { national: 650, local: 350 },
  daegu:    { national: 650, local: 400 },
  incheon:  { national: 650, local: 300 },
  gwangju:  { national: 650, local: 500 },
};
```

## 데이터 파일 구조
```ts
export const EVI_DEFAULTS = {
  annualKm: 15000,
  holdYears: 10,
  region: 'seoul',
  evPrice: 5500,
  evBattery: 77,
  homeChargePct: 70,
  homeChargeRate: 120,
  publicChargeRate: 300,
  includeBatteryReplace: false,
  evInsuranceAnnual: 130,
  icePrice: 3500,
  iceFuelEff: 12,
  iceFuelPrice: 1700,
  iceMaintenanceAnnual: 50,
  iceInsuranceAnnual: 110,
};

export const EVI_META = {
  slug: "ev-vs-ice-10year-cost",
  title: "전기차 vs 내연기관 10년 유지비 계산기 2026 | 언제 본전 뽑나?",
  description: "차량가격·보조금·충전비·연료비 입력하면 10년 총비용 비교와 손익분기점 바로 계산. 배터리 교체 시나리오 포함.",
  updatedAt: "2026-06-17",
  caution: "전비·연비·보험료는 차종 및 운전 습관에 따라 다릅니다. 보조금은 예산 소진 시 변경될 수 있습니다.",
};
```

## SCSS 구조
```scss
.evi-page { ... }
.evi-section { background: #fff; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 1.25rem; margin-bottom: 0.75rem; }
.evi-section h3 { font-size: 0.875rem; font-weight: 700; color: #374151; margin-bottom: 0.75rem; }
.evi-subsidy-display { font-size: 0.8rem; color: #6b7280; background: #f0fdf4; border-radius: 0.5rem; padding: 0.5rem 0.75rem; margin-bottom: 0.75rem; }
.evi-subsidy-display strong { color: #059669; }
.evi-region-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.375rem; }
.evi-region-btn { border: 1px solid #e5e7eb; background: #fff; border-radius: 0.5rem; padding: 0.375rem 0; font-size: 0.8rem; cursor: pointer; }
.evi-region-btn.is-active { background: #1a56db; color: #fff; border-color: #1a56db; }
.evi-toggle-label { display: flex; gap: 0.5rem; align-items: flex-start; font-size: 0.8rem; color: #4b5563; cursor: pointer; }
.evi-kpi-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
.evi-kpi-card { background: #f8f9fa; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 1rem; text-align: center; }
.evi-kpi-card--ev { border-top: 3px solid #10b981; }
.evi-kpi-card--ice { border-top: 3px solid #6b7280; }
.evi-kpi-card--diff { border-top: 3px solid #1a56db; }
.evi-kpi__label { display: block; font-size: 0.75rem; color: #6b7280; margin-bottom: 0.25rem; }
.evi-kpi__value { display: block; font-size: 1.5rem; font-weight: 700; color: #111827; }
.evi-kpi__sub { display: block; font-size: 0.7rem; color: #9ca3af; margin-top: 0.125rem; }
.evi-chart-wrap { position: relative; height: 300px; margin: 1.5rem 0; }
.evi-breakeven-label { text-align: center; font-size: 0.875rem; color: #059669; font-weight: 600; margin-bottom: 1rem; }
.evi-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
.evi-table th, .evi-table td { padding: 0.625rem 0.75rem; border-bottom: 1px solid #e5e7eb; text-align: right; }
.evi-table th:first-child, .evi-table td:first-child { text-align: left; }
.evi-table tfoot td { font-weight: 700; background: #f8f9fa; }
@media (max-width: 640px) {
  .evi-kpi-grid { grid-template-columns: 1fr; }
  .evi-region-grid { grid-template-columns: repeat(3, 1fr); }
}
```

## 구현 순서
1. `src/data/evVsIce10YearCost.ts` — EVI_DEFAULTS, EVI_SUBSIDIES, EVI_META, EVI_FAQ
2. `src/pages/tools/ev-vs-ice-10year-cost.astro` — CompareToolShell 마크업
3. `public/scripts/ev-vs-ice-10year-cost.js` — IIFE, calc, render, chart, region
4. `src/styles/scss/pages/_ev-vs-ice-10year-cost.scss`
5. `src/styles/app.scss` — @use 추가
6. `src/data/tools.ts` — 등록 (category: "자동차", order: 70.3)
7. `public/sitemap.xml` — URL 추가
8. 기존 `ev-vs-ice-cost-calculator` 페이지에 내부 링크 추가

## QA 포인트
- [ ] 지역 버튼 선택 시 보조금 표시 즉시 업데이트
- [ ] 배터리 교체 체크 시 10년차 비용 +1,000만원 반영
- [ ] 손익분기점 없을 때 "보유기간 내 역전 없음" 표시
- [ ] 보조금 차감 후 전기차 실구매가 KPI에 반영
- [ ] 모바일 KPI 2열 정상 표시
- [ ] 차트 교차 시점 어노테이션 표시
