# 펫보험 vs 비보험 손익 계산기 — 설계 문서

## 1. 개요

- **슬러그**: `tools/pet-insurance-calculator`
- **유형**: 계산기 (SimpleToolShell)
- **prefix**: `pic-`
- **데이터 파일**: `src/data/petInsuranceCalculator2026.ts`

---

## 2. 데이터 파일 (`src/data/petInsuranceCalculator2026.ts`)

```ts
export interface PetInsurancePreset {
  id: string;
  label: string;             // "소형견 기본형", "고령묘 프리미엄" 등
  monthlyPremium: number;    // 월 보험료
  coverageLimit: number;     // 연간 보장 한도
  coverageRate: number;      // 보장 비율 (0~1)
  deductibleRate: number;    // 자기부담금 비율 (0~1)
}

export const PIC_PRESETS: PetInsurancePreset[] = [
  {
    id: "small-dog-basic",
    label: "소형견 기본형",
    monthlyPremium: 25_000,
    coverageLimit: 2_000_000,
    coverageRate: 0.7,
    deductibleRate: 0.2,
  },
  {
    id: "small-dog-premium",
    label: "소형견 프리미엄",
    monthlyPremium: 45_000,
    coverageLimit: 5_000_000,
    coverageRate: 0.8,
    deductibleRate: 0.1,
  },
  {
    id: "large-dog-basic",
    label: "대형견 기본형",
    monthlyPremium: 50_000,
    coverageLimit: 3_000_000,
    coverageRate: 0.7,
    deductibleRate: 0.2,
  },
  {
    id: "cat-basic",
    label: "고양이 기본형",
    monthlyPremium: 20_000,
    coverageLimit: 2_000_000,
    coverageRate: 0.7,
    deductibleRate: 0.2,
  },
  {
    id: "cat-premium",
    label: "고양이 프리미엄",
    monthlyPremium: 35_000,
    coverageLimit: 4_000_000,
    coverageRate: 0.8,
    deductibleRate: 0.1,
  },
];

export const PIC_DEFAULTS = {
  monthlyPremium: 30_000,
  coverageLimit: 3_000_000,
  coverageRate: 0.8,          // 80%
  deductibleRate: 0.2,        // 자기부담 20%
  annualRoutine: 300_000,     // 연간 일반 병원비
  emergencyProb: 0.15,        // 연간 응급 발생 확률 15%
  emergencyCost: 1_500_000,   // 응급 발생 시 비용
  analysisYears: 10,          // 분석 기간
};

// 핵심 계산 함수 (JS에서도 동일 로직 사용)
export function calcInsuranceResult(params: {
  monthlyPremium: number;
  coverageLimit: number;
  coverageRate: number;
  deductibleRate: number;
  annualRoutine: number;
  emergencyProb: number;
  emergencyCost: number;
  analysisYears: number;
}) {
  const {
    monthlyPremium, coverageLimit, coverageRate, deductibleRate,
    annualRoutine, emergencyProb, emergencyCost, analysisYears,
  } = params;

  const annualPremium = monthlyPremium * 12;

  // 연간 예상 병원비 (기대값)
  const annualExpectedHospital = annualRoutine + emergencyProb * emergencyCost;

  // 보험 가입 시
  const coverable = Math.min(annualExpectedHospital, coverageLimit);
  const covered = coverable * coverageRate;
  const selfPay = annualExpectedHospital - covered;
  const insuranceAnnual = annualPremium + selfPay;

  // 비보험 시
  const noInsuranceAnnual = annualExpectedHospital;

  // 누적 배열 (1~analysisYears)
  const insuranceCumulative: number[] = [];
  const noInsuranceCumulative: number[] = [];
  let breakEvenYear: number | null = null;

  for (let y = 1; y <= analysisYears; y++) {
    insuranceCumulative.push(insuranceAnnual * y);
    noInsuranceCumulative.push(noInsuranceAnnual * y);
    if (breakEvenYear === null && insuranceCumulative[y - 1] < noInsuranceCumulative[y - 1]) {
      breakEvenYear = y;
    }
  }

  const tenYearSaving = noInsuranceCumulative[analysisYears - 1] - insuranceCumulative[analysisYears - 1];

  return {
    annualPremium,
    annualExpectedHospital,
    insuranceAnnual,
    noInsuranceAnnual,
    insuranceCumulative,
    noInsuranceCumulative,
    breakEvenYear,
    tenYearSaving,
    isInsuranceBetter: tenYearSaving > 0,
  };
}

export interface FaqItem { question: string; answer: string; }
export const PIC_FAQ: FaqItem[] = [
  {
    question: "펫보험, 가입하는 게 유리한가요?",
    answer: "반려동물이 건강하고 병원을 거의 안 가는 경우 단기적으로는 비보험이 유리합니다. 그러나 큰 수술(십자인대·종양·디스크 등) 한 번이면 200~500만원이 발생하며, 이 경우 보험 수년치 보험료보다 훨씬 큽니다. 응급 발생 확률을 현실적으로 설정해 직접 비교해보세요.",
  },
  {
    question: "보험 가입 시기는 언제가 좋은가요?",
    answer: "어릴수록 유리합니다. 생후 2~3개월부터 가입 가능하며 이때 보험료가 가장 낮습니다. 나이가 들수록 보험료가 올라가고 일부 질환은 가입 자체가 거절되는 경우도 있습니다. 또한 기존 질환(선천성 등)은 보장에서 제외되는 경우가 많으므로 건강할 때 가입하는 것이 중요합니다.",
  },
  {
    question: "자기부담금이 뭔가요?",
    answer: "병원비 중 보험이 내 주지 않는 본인 부담 비율입니다. 예를 들어 자기부담금 20%, 보장률 80%이면 100만원 병원비 발생 시 보험이 80만원을 내주고 내가 20만원을 냅니다. 단, 보장 한도 초과 금액은 전액 본인 부담입니다.",
  },
  {
    question: "응급 발생 확률 15%는 어디서 나온 건가요?",
    answer: "농림축산식품부 반려동물 보고서 등의 연간 응급 처치 비율 데이터를 참고한 기본값입니다. 노령 반려동물, 유전질환 품종(스코티시폴드·골든리트리버 등)은 더 높게 설정하는 것이 현실적입니다. 슬라이더로 0~50% 사이에서 직접 조정해보세요.",
  },
  {
    question: "연간 보장 한도가 소진되면 어떻게 되나요?",
    answer: "연간 보장 한도 초과분은 전액 본인 부담입니다. 예를 들어 연간 보장 한도가 200만원인데 300만원짜리 수술이 발생하면, 초과 100만원은 보험 적용 없이 내가 부담합니다. 큰 수술 위험이 높은 품종은 보장 한도가 높은 상품을 선택하는 것이 좋습니다.",
  },
  {
    question: "이 계산기가 추천하는 특정 보험 상품이 있나요?",
    answer: "이 계산기는 특정 보험 상품을 추천하지 않습니다. 국내에서 판매 중인 펫보험 상품(메리츠화재·현대해상·삼성화재·DB손해보험 등)은 조건이 다르므로 실제 가입 전 각 보험사의 약관과 실제 보험료를 확인하시기 바랍니다.",
  },
  {
    question: "계산기에서 보험이 유리하다고 나왔는데, 실제로도 그런가요?",
    answer: "계산기 결과는 입력값(월 보험료, 응급 발생 확률, 병원비 등)에 따른 기대값 시뮬레이션입니다. 실제로는 응급이 전혀 없을 수도, 한 번에 큰 수술이 생길 수도 있습니다. 기대값 기준으로 보험 유·불리를 판단하되, 고액 수술에 대비한 '안전망' 역할도 고려하세요.",
  },
];

export const PIC_META = {
  slug: "pet-insurance-calculator",
  title: "펫보험 vs 비보험 손익 계산기 2026",
  description: "월 보험료, 보장 범위, 예상 병원비를 입력하면 펫보험 가입 시 손익분기점과 N년 후 절감액을 계산해드립니다.",
};
```

---

## 3. Astro 페이지 구조 (`src/pages/tools/pet-insurance-calculator.astro`)

```astro
<SimpleToolShell
  calculatorId="pet-insurance-calculator"
  pageClass="pic-page"
  title={PIC_META.title}
  description={PIC_META.description}
  resultFirst={false}
>
  <!-- slot:aside -->
  <div slot="aside">
    <!-- 프리셋 선택 -->
    <label class="pic-field">
      <span>보험 상품 유형</span>
      <select data-pic="preset">
        <option value="custom">직접 입력</option>
        {PIC_PRESETS.map(p => <option value={p.id}>{p.label}</option>)}
      </select>
    </label>

    <!-- 보험 설정 -->
    <div class="pic-section-label">보험 설정</div>

    <label class="pic-field">
      <span>월 보험료</span>
      <input data-pic="monthlyPremium" type="range" min="10000" max="100000" step="5000" value="30000" />
      <div class="pic-field-row">
        <input data-pic-num="monthlyPremium" type="text" inputmode="numeric" value="30,000" />
        <span>원/월</span>
      </div>
    </label>

    <label class="pic-field">
      <span>연간 보장 한도</span>
      <input data-pic="coverageLimit" type="range" min="500000" max="10000000" step="500000" value="3000000" />
      <div class="pic-field-row">
        <input data-pic-num="coverageLimit" type="text" inputmode="numeric" value="3,000,000" />
        <span>원</span>
      </div>
    </label>

    <label class="pic-field">
      <span>보장 비율</span>
      <input data-pic="coverageRate" type="range" min="50" max="100" step="10" value="80" />
      <div class="pic-field-row">
        <input data-pic-num="coverageRate" type="text" inputmode="numeric" value="80" />
        <span>%</span>
      </div>
    </label>

    <!-- 병원비 시나리오 -->
    <div class="pic-section-label">예상 병원비</div>

    <label class="pic-field">
      <span>연간 일반 병원비</span>
      <input data-pic="annualRoutine" type="range" min="0" max="2000000" step="50000" value="300000" />
      <div class="pic-field-row">
        <input data-pic-num="annualRoutine" type="text" inputmode="numeric" value="300,000" />
        <span>원</span>
      </div>
      <span class="pic-hint">예방접종·정기검진·일반 진료 연합산</span>
    </label>

    <label class="pic-field">
      <span>응급·수술 발생 확률</span>
      <input data-pic="emergencyProb" type="range" min="0" max="50" step="5" value="15" />
      <div class="pic-field-row">
        <input data-pic-num="emergencyProb" type="text" inputmode="numeric" value="15" />
        <span>%/년</span>
      </div>
      <span class="pic-hint">노령·유전질환 품종은 20~30%로 설정</span>
    </label>

    <label class="pic-field">
      <span>응급 발생 시 예상 비용</span>
      <input data-pic="emergencyCost" type="range" min="200000" max="5000000" step="100000" value="1500000" />
      <div class="pic-field-row">
        <input data-pic-num="emergencyCost" type="text" inputmode="numeric" value="1,500,000" />
        <span>원</span>
      </div>
    </label>

    <!-- 분석 기간 -->
    <label class="pic-field">
      <span>비교 기간</span>
      <input data-pic="analysisYears" type="range" min="1" max="15" step="1" value="10" />
      <div class="pic-field-row">
        <input data-pic-num="analysisYears" type="text" inputmode="numeric" value="10" />
        <span>년</span>
      </div>
    </label>
  </div>

  <!-- slot:main -->
  <div slot="main">
    <InfoNotice
      title="계산 기준 안내"
      lines={[
        "이 계산기는 응급 발생 확률을 기반으로 한 기대값 시뮬레이션입니다.",
        "실제 보험료·약관 조건은 보험사별로 다르므로 가입 전 반드시 확인하세요.",
        "특정 보험 상품 추천이 아닙니다.",
      ]}
    />

    <!-- KPI -->
    <div class="pic-kpi-grid">
      <div class="pic-kpi-card pic-kpi-card--primary">
        <span>손익분기점</span>
        <strong data-pic-result="breakEven">—</strong>
        <small data-pic-result="breakEvenLabel"></small>
      </div>
      <div class="pic-kpi-card">
        <span>보험 가입 시 연간 지출</span>
        <strong data-pic-result="insuranceAnnual">—</strong>
      </div>
      <div class="pic-kpi-card">
        <span>비보험 시 연간 지출(기대)</span>
        <strong data-pic-result="noInsuranceAnnual">—</strong>
      </div>
      <div class="pic-kpi-card">
        <span data-pic-result="savingLabel">N년 절감액</span>
        <strong data-pic-result="saving">—</strong>
      </div>
    </div>

    <!-- 라인 차트 -->
    <div class="pic-chart-section">
      <h3>누적 비용 비교</h3>
      <div class="pic-chart-wrap">
        <canvas id="picLineChart"></canvas>
      </div>
      <p class="pic-chart-caption">보험 가입(파랑) vs 비보험(주황) 누적 비용 교차점 = 손익분기점</p>
    </div>

    <!-- 결론 텍스트 -->
    <div class="pic-conclusion" data-pic-result="conclusion"></div>

    <!-- 시나리오 3종 -->
    <div class="pic-scenario-section">
      <h3>시나리오별 비교</h3>
      <div class="pic-scenario-grid">
        <div class="pic-scenario-card pic-scenario--good">
          <strong>건강한 경우</strong>
          <span>응급 발생 확률 0%</span>
          <p data-pic-result="scenarioGood">—</p>
        </div>
        <div class="pic-scenario-card pic-scenario--avg">
          <strong>평균적인 경우</strong>
          <span>입력값 그대로</span>
          <p data-pic-result="scenarioAvg">—</p>
        </div>
        <div class="pic-scenario-card pic-scenario--bad">
          <strong>큰 수술 발생</strong>
          <span>수술비 300만원 1회</span>
          <p data-pic-result="scenarioBad">—</p>
        </div>
      </div>
    </div>

    <SeoContent introTitle="펫보험, 가입해야 할까요?" intro={[...]} faq={PIC_FAQ} />
  </div>
</SimpleToolShell>
```

---

## 4. JS 로직 (`public/scripts/pet-insurance-calculator.js`)

### 상태

```js
const state = {
  monthlyPremium: 30_000,
  coverageLimit: 3_000_000,
  coverageRate: 0.8,
  deductibleRate: 0.2,
  annualRoutine: 300_000,
  emergencyProb: 0.15,
  emergencyCost: 1_500_000,
  analysisYears: 10,
};
```

### 계산 함수

```js
function calculate() {
  const annualPremium = state.monthlyPremium * 12;
  const annualExpected = state.annualRoutine + state.emergencyProb * state.emergencyCost;

  const coverable = Math.min(annualExpected, state.coverageLimit);
  const covered = coverable * state.coverageRate;
  const selfPay = annualExpected - covered;
  const insuranceAnnual = annualPremium + selfPay;
  const noInsuranceAnnual = annualExpected;

  const insuranceCum = [], noInsuranceCum = [];
  let breakEven = null;

  for (let y = 1; y <= state.analysisYears; y++) {
    insuranceCum.push(insuranceAnnual * y);
    noInsuranceCum.push(noInsuranceAnnual * y);
    if (!breakEven && insuranceCum[y-1] < noInsuranceCum[y-1]) breakEven = y;
  }

  const lastY = state.analysisYears;
  const saving = noInsuranceCum[lastY-1] - insuranceCum[lastY-1];

  return { annualPremium, insuranceAnnual, noInsuranceAnnual, insuranceCum, noInsuranceCum, breakEven, saving };
}
```

### 차트

```js
// Chart.js 라인 차트
// dataset[0]: 보험 가입 누적 (파랑, solid)
// dataset[1]: 비보험 누적 (주황, solid)
// 교차점 강조: 수직선 annotation (Chart.js annotation 플러그인 없이 afterDraw 커스텀)
function renderChart(result) {
  const years = Array.from({ length: state.analysisYears }, (_, i) => `${i+1}년`);
  // ...
}
```

### 시나리오 계산

```js
function calcScenario(emergencyProb, emergencyCost) {
  // 현재 state에서 해당 값만 override하여 계산
}

// 3종 시나리오
// 1. 건강: emergencyProb=0
// 2. 평균: 현재 state 그대로
// 3. 수술: emergencyProb=1, emergencyCost=3_000_000
```

### 프리셋 선택

```js
// preset select 변경 시 state 일괄 업데이트
function applyPreset(presetId) {
  const preset = cfg.presets.find(p => p.id === presetId);
  if (!preset) return;
  state.monthlyPremium = preset.monthlyPremium;
  state.coverageLimit = preset.coverageLimit;
  state.coverageRate = preset.coverageRate;
  state.deductibleRate = preset.deductibleRate;
  syncElsFromState();
  update();
}
```

---

## 5. SCSS (`src/styles/scss/pages/_pet-insurance-calculator.scss`)

prefix: `pic-`

```scss
.pic-page {
  .pic-section-label {
    font-size: 0.75rem; font-weight: 600;
    color: var(--color-text-muted);
    text-transform: uppercase; letter-spacing: 0.05em;
    margin: 1rem 0 0.5rem;
  }

  .pic-field { margin-bottom: 1rem; }
  .pic-field > span { font-size: 0.875rem; font-weight: 500; display: block; margin-bottom: 0.25rem; }
  .pic-hint { font-size: 0.75rem; color: var(--color-text-muted); display: block; margin-top: 0.25rem; }

  .pic-field-row {
    display: flex; align-items: center; gap: 0.5rem; margin-top: 0.25rem;
    input[type="text"] {
      width: 90px; text-align: right;
      padding: 0.25rem 0.5rem;
      border: 1px solid var(--color-border);
      border-radius: 0.25rem; font-size: 0.875rem;
    }
    span { font-size: 0.8125rem; color: var(--color-text-muted); }
  }

  // KPI
  .pic-kpi-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem; margin: 1.5rem 0;
    @media (min-width: 768px) { grid-template-columns: repeat(4, 1fr); }
  }

  .pic-kpi-card {
    background: var(--color-surface);
    border-radius: 0.625rem; padding: 1rem;
    display: flex; flex-direction: column; gap: 0.25rem;

    span { font-size: 0.75rem; color: var(--color-text-muted); }
    strong { font-size: 1.125rem; font-weight: 700; color: var(--color-primary); }
    small { font-size: 0.75rem; color: var(--color-text-muted); }

    &--primary { background: var(--color-primary); color: #fff;
      span, small { color: rgba(255,255,255,0.8); }
      strong { color: #fff; font-size: 1.375rem; }
    }
  }

  // 차트
  .pic-chart-section { margin: 2rem 0; }
  .pic-chart-wrap { height: 300px; position: relative; }
  .pic-chart-caption { font-size: 0.8125rem; color: var(--color-text-muted); text-align: center; margin-top: 0.5rem; }

  // 결론
  .pic-conclusion {
    background: var(--color-surface);
    border-left: 4px solid var(--color-primary);
    border-radius: 0.375rem;
    padding: 1rem 1.25rem;
    margin: 1.5rem 0;
    font-size: 0.9375rem;
    line-height: 1.7;
  }

  // 시나리오
  .pic-scenario-section { margin: 2rem 0; }
  .pic-scenario-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
    @media (min-width: 560px) { grid-template-columns: repeat(3, 1fr); }
  }

  .pic-scenario-card {
    border-radius: 0.5rem;
    padding: 1rem;
    display: flex; flex-direction: column; gap: 0.25rem;

    strong { font-size: 0.9375rem; font-weight: 700; }
    span { font-size: 0.75rem; color: var(--color-text-muted); }
    p { font-size: 0.875rem; margin-top: 0.5rem; font-weight: 600; }

    &--good { background: #d1fae5; p { color: #065f46; } }
    &--avg  { background: #dbeafe; p { color: #1e40af; } }
    &--bad  { background: #fee2e2; p { color: #991b1b; } }
  }
}
```

---

## 6. 등록 체크리스트

| 파일 | 작업 |
|---|---|
| `src/data/tools.ts` | order 추가 (반려동물 카테고리) |
| `src/styles/app.scss` | `@use 'scss/pages/pet-insurance-calculator';` |
| `public/sitemap.xml` | `/tools/pet-insurance-calculator/` 추가 |
| `src/pages/index.astro` | topicBySlug에 `"pet-insurance-calculator": "반려동물"` 추가 |

---

## 7. QA 포인트

- [ ] 프리셋 선택 시 모든 슬라이더·숫자 일괄 업데이트
- [ ] 슬라이더 ↔ 숫자 양방향 동기화
- [ ] 보험이 유리한 경우 결론 텍스트 파란색, 비보험 유리 시 회색 표시
- [ ] 라인 차트 교차점(손익분기) 시각적으로 강조
- [ ] 시나리오 3종 결과값 정상 계산
- [ ] 분석 기간 변경 시 차트 x축 동적 업데이트
- [ ] `npm run build` 오류 없음
