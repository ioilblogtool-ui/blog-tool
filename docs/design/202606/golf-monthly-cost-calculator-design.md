# 골프 월 유지비 계산기 — 설계 문서

## 1. 개요

- **슬러그**: `tools/golf-monthly-cost-calculator`
- **유형**: 계산기 (SimpleToolShell)
- **prefix**: `gmc-`
- **데이터 파일**: `src/data/golfMonthlyCost2026.ts`

---

## 2. 데이터 파일 (`src/data/golfMonthlyCost2026.ts`)

```ts
export interface GolfCostDefaults {
  roundingCount: number;       // 월 라운딩 횟수
  greenFee: number;            // 1회 그린피
  caddyFee: number;            // 캐디피/인 (토글)
  cartFee: number;             // 카트비/인 (토글)
  mealCost: number;            // 식사비/회
  practiceType: "monthly" | "session" | "none";
  practiceMonthly: number;     // 연습장 월정액
  practiceSessionCount: number;// 횟수권 - 월 횟수
  practiceSessionPrice: number;// 횟수권 - 1회 단가
  clubPrice: number;           // 클럽 세트 구매가
  clubYears: number;           // 클럽 사용 기간
  consumables: number;         // 볼·티 등 소모품/월
  shoesAnnual: number;         // 골프화 연간 구매가
  apparelAnnual: number;       // 골프웨어 연간 지출
  insurance: number;           // 보험료/월 (0=OFF)
  screenCount: number;         // 스크린골프 월 횟수
  screenPrice: number;         // 스크린골프 1회 단가
  transportPerRound: number;   // 라운딩 1회 교통비
  hasCaddy: boolean;
  hasCart: boolean;
}

export const GMC_DEFAULTS: GolfCostDefaults = {
  roundingCount: 2,
  greenFee: 150_000,
  caddyFee: 30_000,
  cartFee: 15_000,
  mealCost: 30_000,
  practiceType: "monthly",
  practiceMonthly: 150_000,
  practiceSessionCount: 8,
  practiceSessionPrice: 10_000,
  clubPrice: 1_500_000,
  clubYears: 5,
  consumables: 30_000,
  shoesAnnual: 200_000,
  apparelAnnual: 300_000,
  insurance: 0,
  screenCount: 2,
  screenPrice: 20_000,
  transportPerRound: 20_000,
  hasCaddy: true,
  hasCart: true,
};

export interface GolfCostResult {
  roundingMonthly: number;
  practiceMonthly: number;
  equipMonthly: number;
  apparelMonthly: number;
  otherMonthly: number;
  totalMonthly: number;
  totalAnnual: number;
  costPerRound: number;
  breakdown: { label: string; monthly: number; ratio: number }[];
}

export function calcGolfMonthlyCost(d: GolfCostDefaults): GolfCostResult {
  const roundingMonthly =
    d.roundingCount *
    (d.greenFee +
      (d.hasCaddy ? d.caddyFee : 0) +
      (d.hasCart ? d.cartFee : 0) +
      d.mealCost);

  const practiceMonthly =
    d.practiceType === "monthly"
      ? d.practiceMonthly
      : d.practiceType === "session"
      ? d.practiceSessionCount * d.practiceSessionPrice
      : 0;

  const equipMonthly =
    d.clubPrice / d.clubYears / 12 + d.consumables + d.shoesAnnual / 12;

  const apparelMonthly = d.apparelAnnual / 12;

  const otherMonthly =
    d.insurance +
    d.screenCount * d.screenPrice +
    d.roundingCount * d.transportPerRound;

  const totalMonthly =
    roundingMonthly + practiceMonthly + equipMonthly + apparelMonthly + otherMonthly;

  const totalAnnual = totalMonthly * 12;
  const costPerRound = d.roundingCount > 0 ? totalMonthly / d.roundingCount : 0;

  const breakdown = [
    { label: "라운딩", monthly: roundingMonthly, ratio: roundingMonthly / totalMonthly },
    { label: "연습장", monthly: practiceMonthly, ratio: practiceMonthly / totalMonthly },
    { label: "장비 감가", monthly: equipMonthly, ratio: equipMonthly / totalMonthly },
    { label: "의류", monthly: apparelMonthly, ratio: apparelMonthly / totalMonthly },
    { label: "기타", monthly: otherMonthly, ratio: otherMonthly / totalMonthly },
  ];

  return { roundingMonthly, practiceMonthly, equipMonthly, apparelMonthly, otherMonthly, totalMonthly, totalAnnual, costPerRound, breakdown };
}

export interface FaqItem { question: string; answer: string; }
export const GMC_FAQ: FaqItem[] = [
  {
    question: "골프 월 유지비 평균이 얼마나 되나요?",
    answer: "라운딩 빈도와 골프장 수준에 따라 크게 다르지만, 월 2회 퍼블릭 기준 평균적으로 40~60만원 수준입니다. 연습장을 꾸준히 다니고 장비·의류 지출까지 포함하면 월 70~100만원에 달하는 경우도 많습니다.",
  },
  {
    question: "캐디피·카트비는 필수인가요?",
    answer: "대부분의 국내 골프장에서는 캐디 동반이 필수입니다. 카트는 선택 가능한 골프장도 있지만 퍼블릭의 경우 카트 이용이 거의 필수에 가깝습니다. 셀프 라운딩이 가능한 골프장을 이용하면 캐디피를 절감할 수 있습니다.",
  },
  {
    question: "클럽 세트는 얼마짜리를 사야 하나요?",
    answer: "입문자는 30~70만원의 중고 세트 또는 입문용 세트로 시작해도 충분합니다. 클럽보다 레슨과 연습에 투자하는 것이 실력 향상에 더 효과적입니다. 브랜드 신품 세트는 150만~수백만 원에 달합니다.",
  },
  {
    question: "스크린골프 비용도 포함해야 하나요?",
    answer: "스크린골프는 연습 효과와 저비용 라운딩 대안으로 활용하는 골퍼가 많습니다. 1회 1~3만원으로 필드 대비 저렴하므로 월 이용 횟수와 단가를 직접 입력해 포함 여부를 선택하세요.",
  },
  {
    question: "골프웨어 비용을 절감하는 방법이 있나요?",
    answer: "골프웨어는 드레스코드가 있는 골프장이 많아 필수 지출이지만, 아웃렛·시즌오프 세일을 활용하거나 일반 기능성 의류를 대체 사용하면 연간 10~20만원 수준으로도 유지할 수 있습니다.",
  },
  {
    question: "골프 보험이란 무엇인가요?",
    answer: "골프 중 홀인원·이글 달성 시 동반자 대접 비용과 골프장 내 사고(인신·물적)를 보장하는 보험입니다. 월 5,000~20,000원 수준이며 자주 라운딩하는 골퍼에게 유용합니다.",
  },
];

export const GMC_META = {
  slug: "golf-monthly-cost-calculator",
  title: "골프 월 유지비 계산기 2026",
  description: "라운딩·연습장·장비·의류 비용을 모두 합산해 실제 골프 월 유지비를 계산하고 항목별 비중을 확인하세요.",
};
```

---

## 3. Astro 페이지 (`src/pages/tools/golf-monthly-cost-calculator.astro`)

```astro
---
import SimpleToolShell from '@/layouts/SimpleToolShell.astro';
import CalculatorHero from '@/components/CalculatorHero.astro';
import InfoNotice from '@/components/InfoNotice.astro';
import SeoContent from '@/components/SeoContent.astro';
import { GMC_DEFAULTS, GMC_FAQ, GMC_META } from '@/data/golfMonthlyCost2026';

const config = { defaults: GMC_DEFAULTS };
---

<SimpleToolShell calculatorId="golf-monthly-cost-calculator" pageClass="gmc-page">
  <CalculatorHero
    slot="hero"
    title={GMC_META.title}
    description={GMC_META.description}
  />

  <!-- 입력 패널 (aside) -->
  <div slot="aside">

    <!-- 라운딩 섹션 -->
    <div class="gmc-section">
      <div class="gmc-section-header" data-gmc-toggle="rounding">
        <span>⛳ 라운딩</span>
        <span class="gmc-section-arrow">▾</span>
      </div>
      <div class="gmc-section-body" data-gmc-body="rounding">

        <label class="gmc-field">
          <span>월 라운딩 횟수</span>
          <input data-gmc="roundingCount" type="range" min="0" max="12" step="1" value="2" />
          <div class="gmc-field-row">
            <input data-gmc-num="roundingCount" type="text" inputmode="numeric" value="2" />
            <span>회/월</span>
          </div>
        </label>

        <label class="gmc-field">
          <span>1회 그린피</span>
          <input data-gmc="greenFee" type="range" min="50000" max="500000" step="10000" value="150000" />
          <div class="gmc-field-row">
            <input data-gmc-num="greenFee" type="text" inputmode="numeric" value="150,000" />
            <span>원</span>
          </div>
        </label>

        <div class="gmc-toggle-row">
          <label class="gmc-toggle-label">
            <input data-gmc-bool="hasCaddy" type="checkbox" checked />
            캐디피 포함 (30,000원/인)
          </label>
          <label class="gmc-toggle-label">
            <input data-gmc-bool="hasCart" type="checkbox" checked />
            카트비 포함 (15,000원/인)
          </label>
        </div>

        <label class="gmc-field">
          <span>식사·음료 (1회)</span>
          <input data-gmc="mealCost" type="range" min="0" max="100000" step="5000" value="30000" />
          <div class="gmc-field-row">
            <input data-gmc-num="mealCost" type="text" inputmode="numeric" value="30,000" />
            <span>원</span>
          </div>
        </label>

        <label class="gmc-field">
          <span>교통비 (1회)</span>
          <input data-gmc="transportPerRound" type="range" min="0" max="100000" step="5000" value="20000" />
          <div class="gmc-field-row">
            <input data-gmc-num="transportPerRound" type="text" inputmode="numeric" value="20,000" />
            <span>원</span>
          </div>
        </label>
      </div>
    </div>

    <!-- 연습장 섹션 -->
    <div class="gmc-section">
      <div class="gmc-section-header" data-gmc-toggle="practice">
        <span>🏌️ 연습장</span>
        <span class="gmc-section-arrow">▾</span>
      </div>
      <div class="gmc-section-body" data-gmc-body="practice">
        <div class="gmc-radio-group">
          <label><input type="radio" name="practiceType" value="monthly" checked /> 월정액</label>
          <label><input type="radio" name="practiceType" value="session" /> 횟수권</label>
          <label><input type="radio" name="practiceType" value="none" /> 안 감</label>
        </div>

        <div data-gmc-show="practiceType-monthly">
          <label class="gmc-field">
            <span>월정액</span>
            <input data-gmc="practiceMonthly" type="range" min="50000" max="500000" step="10000" value="150000" />
            <div class="gmc-field-row">
              <input data-gmc-num="practiceMonthly" type="text" inputmode="numeric" value="150,000" />
              <span>원/월</span>
            </div>
          </label>
        </div>

        <div data-gmc-show="practiceType-session">
          <label class="gmc-field">
            <span>월 이용 횟수</span>
            <input data-gmc="practiceSessionCount" type="range" min="1" max="30" step="1" value="8" />
            <div class="gmc-field-row">
              <input data-gmc-num="practiceSessionCount" type="text" inputmode="numeric" value="8" />
              <span>회</span>
            </div>
          </label>
          <label class="gmc-field">
            <span>1회 단가</span>
            <input data-gmc="practiceSessionPrice" type="range" min="5000" max="30000" step="1000" value="10000" />
            <div class="gmc-field-row">
              <input data-gmc-num="practiceSessionPrice" type="text" inputmode="numeric" value="10,000" />
              <span>원</span>
            </div>
          </label>
        </div>
      </div>
    </div>

    <!-- 장비 섹션 -->
    <div class="gmc-section">
      <div class="gmc-section-header" data-gmc-toggle="equip">
        <span>🛠️ 장비·소모품</span>
        <span class="gmc-section-arrow">▾</span>
      </div>
      <div class="gmc-section-body" data-gmc-body="equip">
        <label class="gmc-field">
          <span>클럽 세트 구매가</span>
          <input data-gmc="clubPrice" type="range" min="300000" max="5000000" step="100000" value="1500000" />
          <div class="gmc-field-row">
            <input data-gmc-num="clubPrice" type="text" inputmode="numeric" value="1,500,000" />
            <span>원</span>
          </div>
        </label>
        <label class="gmc-field">
          <span>예상 사용 기간</span>
          <input data-gmc="clubYears" type="range" min="1" max="10" step="1" value="5" />
          <div class="gmc-field-row">
            <input data-gmc-num="clubYears" type="text" inputmode="numeric" value="5" />
            <span>년</span>
          </div>
        </label>
        <label class="gmc-field">
          <span>소모품 (볼·티 등)</span>
          <input data-gmc="consumables" type="range" min="0" max="100000" step="5000" value="30000" />
          <div class="gmc-field-row">
            <input data-gmc-num="consumables" type="text" inputmode="numeric" value="30,000" />
            <span>원/월</span>
          </div>
        </label>
        <label class="gmc-field">
          <span>골프화 (연간)</span>
          <input data-gmc="shoesAnnual" type="range" min="0" max="500000" step="50000" value="200000" />
          <div class="gmc-field-row">
            <input data-gmc-num="shoesAnnual" type="text" inputmode="numeric" value="200,000" />
            <span>원/년</span>
          </div>
        </label>
      </div>
    </div>

    <!-- 기타 섹션 -->
    <div class="gmc-section">
      <div class="gmc-section-header" data-gmc-toggle="other">
        <span>📦 의류·기타</span>
        <span class="gmc-section-arrow">▾</span>
      </div>
      <div class="gmc-section-body" data-gmc-body="other">
        <label class="gmc-field">
          <span>골프웨어 (연간)</span>
          <input data-gmc="apparelAnnual" type="range" min="0" max="1000000" step="50000" value="300000" />
          <div class="gmc-field-row">
            <input data-gmc-num="apparelAnnual" type="text" inputmode="numeric" value="300,000" />
            <span>원/년</span>
          </div>
        </label>
        <label class="gmc-field">
          <span>스크린골프 (월 횟수)</span>
          <input data-gmc="screenCount" type="range" min="0" max="20" step="1" value="2" />
          <div class="gmc-field-row">
            <input data-gmc-num="screenCount" type="text" inputmode="numeric" value="2" />
            <span>회/월</span>
          </div>
        </label>
        <label class="gmc-field">
          <span>스크린골프 1회 단가</span>
          <input data-gmc="screenPrice" type="range" min="5000" max="50000" step="1000" value="20000" />
          <div class="gmc-field-row">
            <input data-gmc-num="screenPrice" type="text" inputmode="numeric" value="20,000" />
            <span>원</span>
          </div>
        </label>
        <label class="gmc-field">
          <span>골프 보험료 (월)</span>
          <input data-gmc="insurance" type="range" min="0" max="50000" step="1000" value="0" />
          <div class="gmc-field-row">
            <input data-gmc-num="insurance" type="text" inputmode="numeric" value="0" />
            <span>원/월</span>
          </div>
          <span class="gmc-hint">0원 = 미가입</span>
        </label>
      </div>
    </div>
  </div>

  <!-- 결과 패널 (main) -->
  <div slot="main">
    <InfoNotice
      title="계산 기준 안내"
      lines={[
        "지역·시즌·골프장 등급에 따라 실제 비용 차이가 큽니다.",
        "장비 감가상각은 구매가를 사용 기간으로 균등 배분한 참고값입니다.",
      ]}
    />

    <div class="gmc-kpi-grid">
      <div class="gmc-kpi-card gmc-kpi-card--primary">
        <span>월 총 유지비</span>
        <strong data-gmc-result="totalMonthly">—</strong>
      </div>
      <div class="gmc-kpi-card">
        <span>연간 총 유지비</span>
        <strong data-gmc-result="totalAnnual">—</strong>
      </div>
      <div class="gmc-kpi-card">
        <span>라운딩 비중</span>
        <strong data-gmc-result="roundingRatio">—</strong>
      </div>
      <div class="gmc-kpi-card">
        <span>1회 라운딩 실질 단가</span>
        <strong data-gmc-result="costPerRound">—</strong>
      </div>
    </div>

    <div class="gmc-chart-section">
      <h3>항목별 비용 비중</h3>
      <div class="gmc-chart-wrap">
        <canvas id="gmcDonutChart"></canvas>
      </div>
    </div>

    <div class="gmc-table-section">
      <h3>항목 상세</h3>
      <table class="gmc-table">
        <thead>
          <tr>
            <th>항목</th>
            <th>월 비용</th>
            <th>연간 비용</th>
            <th>비중</th>
          </tr>
        </thead>
        <tbody id="gmcTableBody"></tbody>
        <tfoot>
          <tr class="gmc-table-total">
            <td>합계</td>
            <td data-gmc-result="totalMonthly">—</td>
            <td data-gmc-result="totalAnnual">—</td>
            <td>100%</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div class="gmc-compare-box" data-gmc-result="compareText"></div>

    <SeoContent
      introTitle="골프 유지비, 얼마나 드나요?"
      intro={[
        "골프는 '비싼 취미'의 대명사이지만, 실제 월 유지비는 이용 방식에 따라 30만원부터 150만원 이상까지 크게 차이가 납니다.",
        "라운딩 횟수, 골프장 선택, 연습 빈도, 장비 투자 수준을 직접 입력해 내 상황에 맞는 실제 유지비를 확인해보세요.",
      ]}
      faq={GMC_FAQ}
    />
  </div>
</SimpleToolShell>

<script id="gmcConfig" type="application/json" set:html={JSON.stringify(config)}></script>
<script src="/scripts/golf-monthly-cost-calculator.js" defer></script>
```

---

## 4. JS 로직 (`public/scripts/golf-monthly-cost-calculator.js`)

```js
(function () {
  'use strict';

  const cfg = JSON.parse(document.getElementById('gmcConfig').textContent);
  const D = cfg.defaults;

  const state = { ...D };

  const CHART_COLORS = ['#1a56db', '#0ea5e9', '#14b8a6', '#f59e0b', '#6b7280'];

  // ── 계산 ──────────────────────────────────────────────────
  function calculate() {
    const roundingMonthly =
      state.roundingCount *
      (state.greenFee +
        (state.hasCaddy ? state.caddyFee : 0) +
        (state.hasCart ? state.cartFee : 0) +
        state.mealCost);

    const practiceMonthly =
      state.practiceType === 'monthly'
        ? state.practiceMonthly
        : state.practiceType === 'session'
        ? state.practiceSessionCount * state.practiceSessionPrice
        : 0;

    const equipMonthly =
      state.clubPrice / state.clubYears / 12 +
      state.consumables +
      state.shoesAnnual / 12;

    const apparelMonthly = state.apparelAnnual / 12;

    const otherMonthly =
      state.insurance +
      state.screenCount * state.screenPrice +
      state.roundingCount * state.transportPerRound;

    const totalMonthly = roundingMonthly + practiceMonthly + equipMonthly + apparelMonthly + otherMonthly;
    const totalAnnual = totalMonthly * 12;
    const costPerRound = state.roundingCount > 0 ? totalMonthly / state.roundingCount : 0;

    const breakdown = [
      { label: '라운딩', monthly: roundingMonthly },
      { label: '연습장', monthly: practiceMonthly },
      { label: '장비 감가', monthly: equipMonthly },
      { label: '의류', monthly: apparelMonthly },
      { label: '기타', monthly: otherMonthly },
    ];

    return { roundingMonthly, totalMonthly, totalAnnual, costPerRound, breakdown };
  }

  // ── 렌더 ──────────────────────────────────────────────────
  function formatWon(v) {
    return Math.round(v).toLocaleString('ko-KR') + '원';
  }

  function formatWonShort(v) {
    if (v >= 10_000_000) return (v / 10_000_000).toFixed(1) + '억원';
    if (v >= 10_000) return Math.round(v / 10_000) + '만원';
    return v.toLocaleString('ko-KR') + '원';
  }

  let chartInst = null;

  function renderChart(breakdown, total) {
    const ctx = document.getElementById('gmcDonutChart');
    if (!ctx) return;
    const data = breakdown.map(b => Math.round(b.monthly));
    const labels = breakdown.map(b => b.label);
    if (chartInst) {
      chartInst.data.datasets[0].data = data;
      chartInst.update();
      return;
    }
    chartInst = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{ data, backgroundColor: CHART_COLORS, borderWidth: 2 }],
      },
      options: {
        cutout: '65%',
        plugins: {
          legend: { position: 'bottom', labels: { font: { size: 12 } } },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const val = ctx.raw;
                const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                return `${ctx.label}: ${val.toLocaleString('ko-KR')}원 (${pct}%)`;
              },
            },
          },
        },
      },
    });
  }

  function renderTable(breakdown, total) {
    const tbody = document.getElementById('gmcTableBody');
    if (!tbody) return;
    tbody.innerHTML = breakdown
      .map((b) => {
        const pct = total > 0 ? ((b.monthly / total) * 100).toFixed(1) : 0;
        return `<tr>
          <td>${b.label}</td>
          <td>${formatWon(b.monthly)}</td>
          <td>${formatWon(b.monthly * 12)}</td>
          <td>${pct}%</td>
        </tr>`;
      })
      .join('');
  }

  function setResult(key, val) {
    document.querySelectorAll(`[data-gmc-result="${key}"]`).forEach(el => { el.textContent = val; });
  }

  function renderCompare(totalMonthly) {
    const box = document.querySelector('[data-gmc-result="compareText"]');
    if (!box) return;
    const annual = totalMonthly * 12;
    const gymMonths = Math.round(annual / 80_000);
    box.innerHTML = `<strong>같은 금액으로...</strong> 헬스장 월정액 ${gymMonths}개월치 · 테니스 레슨 ${Math.round(annual / 120_000)}개월치 이용 가능`;
  }

  function render() {
    const result = calculate();
    setResult('totalMonthly', formatWonShort(result.totalMonthly));
    setResult('totalAnnual', formatWonShort(result.totalAnnual));
    setResult('roundingRatio', result.totalMonthly > 0 ? ((result.roundingMonthly / result.totalMonthly) * 100).toFixed(1) + '%' : '—');
    setResult('costPerRound', result.costPerRound > 0 ? formatWon(result.costPerRound) : '—');
    renderChart(result.breakdown, result.totalMonthly);
    renderTable(result.breakdown, result.totalMonthly);
    renderCompare(result.totalMonthly);
    // tfoot 총합도 갱신
    document.querySelectorAll('[data-gmc-result="totalMonthly"]').forEach(el => { el.textContent = formatWon(result.totalMonthly); });
    document.querySelectorAll('[data-gmc-result="totalAnnual"]').forEach(el => { el.textContent = formatWon(result.totalAnnual); });
  }

  // ── 슬라이더·숫자 동기화 ──────────────────────────────────
  function syncNumFromSlider(key, el) {
    state[key] = Number(el.value);
    document.querySelectorAll(`[data-gmc-num="${key}"]`).forEach(n => {
      n.value = Number(el.value).toLocaleString('ko-KR');
    });
  }

  function syncSliderFromNum(key, val) {
    state[key] = val;
    document.querySelectorAll(`[data-gmc="${key}"]`).forEach(s => { s.value = val; });
  }

  // ── 섹션 접기/펼치기 ─────────────────────────────────────
  function bindSectionToggles() {
    document.querySelectorAll('[data-gmc-toggle]').forEach(header => {
      header.addEventListener('click', () => {
        const key = header.dataset.gmcToggle;
        const body = document.querySelector(`[data-gmc-body="${key}"]`);
        const arrow = header.querySelector('.gmc-section-arrow');
        if (!body) return;
        const isOpen = body.style.display !== 'none';
        body.style.display = isOpen ? 'none' : '';
        if (arrow) arrow.textContent = isOpen ? '▸' : '▾';
      });
    });
  }

  // ── practiceType 라디오 연동 ──────────────────────────────
  function bindPracticeType() {
    document.querySelectorAll('[name="practiceType"]').forEach(radio => {
      radio.addEventListener('change', () => {
        state.practiceType = radio.value;
        ['monthly', 'session'].forEach(t => {
          const el = document.querySelector(`[data-gmc-show="practiceType-${t}"]`);
          if (el) el.style.display = state.practiceType === t ? '' : 'none';
        });
        render();
      });
    });
  }

  // ── 이벤트 바인딩 ─────────────────────────────────────────
  function bindEvents() {
    document.querySelectorAll('[data-gmc]').forEach(el => {
      el.addEventListener('input', () => {
        const key = el.dataset.gmc;
        syncNumFromSlider(key, el);
        render();
      });
    });

    document.querySelectorAll('[data-gmc-num]').forEach(el => {
      el.addEventListener('change', () => {
        const key = el.dataset.gmcNum;
        const raw = Number(el.value.replace(/,/g, ''));
        if (!isNaN(raw)) { syncSliderFromNum(key, raw); render(); }
        el.value = state[key].toLocaleString('ko-KR');
      });
    });

    document.querySelectorAll('[data-gmc-bool]').forEach(el => {
      el.addEventListener('change', () => {
        state[el.dataset.gmcBool] = el.checked;
        render();
      });
    });
  }

  function loadChartJs(cb) {
    if (window.Chart) { cb(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
    s.onload = cb;
    document.head.appendChild(s);
  }

  function init() {
    // practiceType 초기 표시
    ['monthly', 'session'].forEach(t => {
      const el = document.querySelector(`[data-gmc-show="practiceType-${t}"]`);
      if (el) el.style.display = state.practiceType === t ? '' : 'none';
    });
    bindSectionToggles();
    bindPracticeType();
    bindEvents();
    loadChartJs(render);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
```

---

## 5. SCSS (`src/styles/scss/pages/_golf-monthly-cost-calculator.scss`)

```scss
.gmc-page {

  // 섹션 접기/펼치기
  .gmc-section {
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
    margin-bottom: 0.75rem;
    overflow: hidden;
  }

  .gmc-section-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.75rem 1rem;
    background: var(--color-surface);
    cursor: pointer; font-weight: 600; font-size: 0.9375rem;
    &:hover { background: var(--color-surface-hover, #f3f4f6); }
  }

  .gmc-section-body { padding: 0.75rem 1rem; }

  // 필드
  .gmc-field { margin-bottom: 1rem;
    > span { font-size: 0.875rem; font-weight: 500; display: block; margin-bottom: 0.25rem; }
  }
  .gmc-field-row {
    display: flex; align-items: center; gap: 0.5rem; margin-top: 0.25rem;
    input[type="text"] {
      width: 90px; text-align: right; padding: 0.25rem 0.5rem;
      border: 1px solid var(--color-border); border-radius: 0.25rem;
      font-size: 0.875rem;
    }
    span { font-size: 0.8125rem; color: var(--color-text-muted); }
  }
  .gmc-hint { font-size: 0.75rem; color: var(--color-text-muted); display: block; margin-top: 0.25rem; }

  .gmc-toggle-row {
    display: flex; flex-direction: column; gap: 0.375rem; margin-bottom: 1rem;
  }
  .gmc-toggle-label {
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 0.875rem; cursor: pointer;
    input[type="checkbox"] { width: 1rem; height: 1rem; }
  }

  .gmc-radio-group {
    display: flex; gap: 1rem; margin-bottom: 0.75rem;
    label { display: flex; align-items: center; gap: 0.375rem; font-size: 0.875rem; cursor: pointer; }
  }

  // KPI
  .gmc-kpi-grid {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin: 1.5rem 0;
    @media (min-width: 768px) { grid-template-columns: repeat(4, 1fr); }
  }
  .gmc-kpi-card {
    background: var(--color-surface); border-radius: 0.625rem; padding: 1rem;
    display: flex; flex-direction: column; gap: 0.25rem;
    span { font-size: 0.75rem; color: var(--color-text-muted); }
    strong { font-size: 1.125rem; font-weight: 700; color: var(--color-primary); }
    &--primary {
      background: var(--color-primary); color: #fff;
      span { color: rgba(255,255,255,0.8); }
      strong { color: #fff; font-size: 1.375rem; }
    }
  }

  // 차트
  .gmc-chart-section { margin: 2rem 0; h3 { font-size: 1rem; margin-bottom: 1rem; } }
  .gmc-chart-wrap { max-width: 320px; margin: 0 auto; }

  // 테이블
  .gmc-table-section { margin: 2rem 0; h3 { font-size: 1rem; margin-bottom: 0.75rem; } }
  .gmc-table {
    width: 100%; border-collapse: collapse; font-size: 0.875rem;
    th, td { padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--color-border); text-align: right; }
    th:first-child, td:first-child { text-align: left; }
    th { background: var(--color-surface); font-weight: 600; }
  }
  .gmc-table-total td { font-weight: 700; background: var(--color-surface); }

  // 비교 박스
  .gmc-compare-box {
    background: var(--color-surface);
    border-left: 4px solid var(--color-primary);
    border-radius: 0.375rem;
    padding: 1rem 1.25rem;
    margin: 1.5rem 0;
    font-size: 0.9375rem;
    line-height: 1.7;
    strong { display: block; margin-bottom: 0.25rem; }
  }
}
```

---

## 6. 등록 체크리스트

| 파일 | 작업 |
|---|---|
| `src/data/tools.ts` | `{ slug: "golf-monthly-cost-calculator", title: "골프 월 유지비 계산기", order: ..., badges: ["골프", "유지비", "라운딩", "2026"] }` |
| `src/styles/app.scss` | `@use 'scss/pages/golf-monthly-cost-calculator';` |
| `public/sitemap.xml` | `/tools/golf-monthly-cost-calculator/` 추가 |
| `src/pages/index.astro` | `"golf-monthly-cost-calculator": { category: "leisure", isNew: true }` |

---

## 7. QA 포인트

- [ ] 섹션 접기/펼치기 정상 동작
- [ ] practiceType 라디오 전환 시 연관 입력 show/hide
- [ ] 캐디피·카트비 체크박스 토글 → 즉시 계산 반영
- [ ] 슬라이더 ↔ 숫자 입력 양방향 동기화
- [ ] 도넛 차트 항목 0원인 경우 비중 0%로 표시 (레이블 유지)
- [ ] 테이블 총합 = KPI 카드 값 일치
- [ ] `npm run build` 오류 없음
