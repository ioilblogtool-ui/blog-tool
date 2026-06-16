# 골프 회원권 vs 퍼블릭 손익 비교 — 설계 문서

## 1. 개요

- **슬러그**: `tools/golf-membership-vs-public`
- **유형**: 계산기 (CompareToolShell)
- **prefix**: `gmp-`
- **데이터 파일**: `src/data/golfMembershipVsPublic2026.ts`

---

## 2. 데이터 파일 (`src/data/golfMembershipVsPublic2026.ts`)

```ts
export interface GmpDefaults {
  // 공통 이용 패턴
  roundingPerMonth: number;     // 월 라운딩 횟수
  activeMonths: number;         // 연간 이용 개월
  // 회원권
  membershipPrice: number;      // 매입가 (원)
  holdingYears: number;         // 보유 기간 (년)
  resalePrice: number;          // 예상 매각가 (원)
  annualFee: number;            // 연 관리비 (원)
  memberGreenFee: number;       // 회원 그린피/회
  caddyFee: number;             // 캐디피/인
  cartFee: number;              // 카트비/인
  // 퍼블릭
  weekdayGreenFee: number;      // 주중 그린피
  weekendGreenFee: number;      // 주말 그린피
  weekendRatio: number;         // 주말 라운딩 비율 (0~1)
}

export const GMP_DEFAULTS: GmpDefaults = {
  roundingPerMonth: 4,
  activeMonths: 10,
  membershipPrice: 30_000_000,
  holdingYears: 5,
  resalePrice: 25_000_000,
  annualFee: 1_000_000,
  memberGreenFee: 80_000,
  caddyFee: 30_000,
  cartFee: 15_000,
  weekdayGreenFee: 150_000,
  weekendGreenFee: 200_000,
  weekendRatio: 0.4,
};

export interface GmpYearResult {
  year: number;
  memberCum: number;
  publicCum: number;
  diff: number;           // memberCum - publicCum (음수 = 회원권 유리)
}

export interface GmpResult {
  // 연간
  memberAnnualRound: number;
  memberAnnual: number;
  publicAnnual: number;
  // 1회 단가
  memberCostPerRound: number;
  publicCostPerRound: number;
  // 누적
  years: GmpYearResult[];
  breakEvenYear: number | null;
  // 총합 (holdingYears 기준)
  memberTotal: number;
  publicTotal: number;
  saving: number;         // publicTotal - memberTotal (양수 = 회원권 절감)
}

export function calcGmpResult(d: GmpDefaults): GmpResult {
  const annualRoundings = d.roundingPerMonth * d.activeMonths;

  const memberAnnualRound =
    annualRoundings * (d.memberGreenFee + d.caddyFee + d.cartFee);
  const memberAnnual = memberAnnualRound + d.annualFee;

  const avgGreenFee =
    d.weekdayGreenFee * (1 - d.weekendRatio) + d.weekendGreenFee * d.weekendRatio;
  const publicAnnual = annualRoundings * (avgGreenFee + d.caddyFee + d.cartFee);

  // 매각 차손을 연도별 균등 배분
  const annualCapLoss = (d.membershipPrice - d.resalePrice) / d.holdingYears;

  const years: GmpYearResult[] = [];
  let breakEvenYear: number | null = null;

  for (let y = 1; y <= d.holdingYears; y++) {
    const memberCum = memberAnnual * y + annualCapLoss * y;
    const publicCum = publicAnnual * y;
    const diff = memberCum - publicCum;
    years.push({ year: y, memberCum, publicCum, diff });
    if (breakEvenYear === null && diff < 0) breakEvenYear = y;
  }

  const last = years[years.length - 1];
  const memberTotal = last.memberCum;
  const publicTotal = last.publicCum;
  const saving = publicTotal - memberTotal;

  const memberCostPerRound =
    annualRoundings > 0
      ? (memberAnnual + annualCapLoss) / annualRoundings
      : 0;
  const publicCostPerRound = annualRoundings > 0 ? publicAnnual / annualRoundings : 0;

  return {
    memberAnnualRound, memberAnnual, publicAnnual,
    memberCostPerRound, publicCostPerRound,
    years, breakEvenYear,
    memberTotal, publicTotal, saving,
  };
}

// 시나리오 3종 헬퍼
export type GmpScenario = "base" | "noLoss" | "loss30";
export function getScenarioDefaults(base: GmpDefaults, scenario: GmpScenario): GmpDefaults {
  if (scenario === "noLoss") return { ...base, resalePrice: base.membershipPrice };
  if (scenario === "loss30") return { ...base, resalePrice: Math.round(base.membershipPrice * 0.7) };
  return base;
}

export interface FaqItem { question: string; answer: string; }
export const GMP_FAQ: FaqItem[] = [
  {
    question: "골프 회원권, 언제 사는 게 유리한가요?",
    answer: "월 라운딩 횟수가 4회 이상이고 동일 골프장 또는 계열 골프장을 자주 이용한다면 3~5년 안에 손익분기를 넘길 수 있습니다. 반면 라운딩 횟수가 적거나 다양한 골프장을 선호한다면 퍼블릭이 유리합니다.",
  },
  {
    question: "회원권 매각 시 시세 손실을 어떻게 추정하나요?",
    answer: "국내 회원권 시세는 골프장 입지·시설·회원 수에 따라 다르지만, 일반적으로 5년 보유 후 5~20% 하락하는 경우가 많습니다. 인기 골프장은 시세가 유지되거나 상승하기도 합니다. '매각가' 슬라이더로 시나리오별로 확인해보세요.",
  },
  {
    question: "회원권 관리비란 무엇인가요?",
    answer: "골프 회원권 보유 시 매년 내는 연회비 성격의 비용입니다. 골프장마다 다르며 연 50만~200만원 수준이 일반적입니다. 관리비 외에 식음·시설 이용 할인 등 부수 혜택이 포함되는 경우도 있습니다.",
  },
  {
    question: "기회비용(투자 수익률)은 왜 포함하지 않나요?",
    answer: "이 계산기는 라운딩 비용 관점의 순수 손익분기를 보여줍니다. 기회비용(회원권 매입 금액을 투자했을 때의 수익)을 포함하면 계산이 복잡해지고, 가정(수익률 가정)에 따라 결과가 크게 달라지므로 별도 참고 항목으로 안내합니다.",
  },
  {
    question: "법인 회원권은 이 계산기로 판단할 수 있나요?",
    answer: "이 계산기는 개인 회원권 기준입니다. 법인 회원권은 세제 처리 방식(손금 인정 여부)이 달라 세무사 상담이 필요합니다.",
  },
  {
    question: "회원권 구매 후 양도·증여는 자유롭게 할 수 있나요?",
    answer: "대부분의 회원권은 양도가 가능하지만 골프장 규정에 따라 명의변경 수수료, 대기 기간, 제한 조건이 있을 수 있습니다. 구매 전 해당 골프장 약관을 반드시 확인하세요.",
  },
];

export const GMP_META = {
  slug: "golf-membership-vs-public",
  title: "골프 회원권 vs 퍼블릭 손익 비교 2026",
  description: "회원권 매입가·관리비·회원 그린피와 퍼블릭 그린피를 비교해 손익분기점과 N년 절감액을 계산합니다.",
};
```

---

## 3. Astro 페이지 (`src/pages/tools/golf-membership-vs-public.astro`)

```astro
---
import CompareToolShell from '@/layouts/CompareToolShell.astro';
import CalculatorHero from '@/components/CalculatorHero.astro';
import InfoNotice from '@/components/InfoNotice.astro';
import SeoContent from '@/components/SeoContent.astro';
import { GMP_DEFAULTS, GMP_FAQ, GMP_META } from '@/data/golfMembershipVsPublic2026';

const config = { defaults: GMP_DEFAULTS };
---

<CompareToolShell calculatorId="golf-membership-vs-public" pageClass="gmp-page">
  <CalculatorHero slot="hero" title={GMP_META.title} description={GMP_META.description} />

  <!-- 공통 이용 패턴 -->
  <div slot="shared-inputs">
    <div class="gmp-shared-panel">
      <div class="gmp-shared-label">이용 패턴 (공통)</div>
      <label class="gmp-field">
        <span>월 라운딩 횟수</span>
        <input data-gmp="roundingPerMonth" type="range" min="1" max="12" step="1" value="4" />
        <div class="gmp-field-row">
          <input data-gmp-num="roundingPerMonth" type="text" inputmode="numeric" value="4" />
          <span>회/월</span>
        </div>
      </label>
      <label class="gmp-field">
        <span>연간 이용 개월</span>
        <input data-gmp="activeMonths" type="range" min="6" max="12" step="1" value="10" />
        <div class="gmp-field-row">
          <input data-gmp-num="activeMonths" type="text" inputmode="numeric" value="10" />
          <span>개월</span>
        </div>
      </label>
      <label class="gmp-field">
        <span>캐디피 (인당)</span>
        <input data-gmp="caddyFee" type="range" min="0" max="60000" step="5000" value="30000" />
        <div class="gmp-field-row">
          <input data-gmp-num="caddyFee" type="text" inputmode="numeric" value="30,000" />
          <span>원</span>
        </div>
      </label>
      <label class="gmp-field">
        <span>카트비 (인당)</span>
        <input data-gmp="cartFee" type="range" min="0" max="40000" step="5000" value="15000" />
        <div class="gmp-field-row">
          <input data-gmp-num="cartFee" type="text" inputmode="numeric" value="15,000" />
          <span>원</span>
        </div>
      </label>
    </div>
  </div>

  <!-- 회원권 패널 -->
  <div slot="left-inputs">
    <div class="gmp-col-label gmp-col-label--member">🏆 회원권</div>

    <label class="gmp-field">
      <span>회원권 매입가</span>
      <input data-gmp="membershipPrice" type="range" min="5000000" max="200000000" step="1000000" value="30000000" />
      <div class="gmp-field-row">
        <input data-gmp-num="membershipPrice" type="text" inputmode="numeric" value="30,000,000" />
        <span>원</span>
      </div>
    </label>
    <label class="gmp-field">
      <span>보유 기간</span>
      <input data-gmp="holdingYears" type="range" min="1" max="15" step="1" value="5" />
      <div class="gmp-field-row">
        <input data-gmp-num="holdingYears" type="text" inputmode="numeric" value="5" />
        <span>년</span>
      </div>
    </label>
    <label class="gmp-field">
      <span>예상 매각가</span>
      <input data-gmp="resalePrice" type="range" min="0" max="200000000" step="1000000" value="25000000" />
      <div class="gmp-field-row">
        <input data-gmp-num="resalePrice" type="text" inputmode="numeric" value="25,000,000" />
        <span>원</span>
      </div>
    </label>
    <label class="gmp-field">
      <span>연 관리비</span>
      <input data-gmp="annualFee" type="range" min="0" max="3000000" step="100000" value="1000000" />
      <div class="gmp-field-row">
        <input data-gmp-num="annualFee" type="text" inputmode="numeric" value="1,000,000" />
        <span>원/년</span>
      </div>
    </label>
    <label class="gmp-field">
      <span>회원 그린피</span>
      <input data-gmp="memberGreenFee" type="range" min="30000" max="200000" step="5000" value="80000" />
      <div class="gmp-field-row">
        <input data-gmp-num="memberGreenFee" type="text" inputmode="numeric" value="80,000" />
        <span>원/회</span>
      </div>
    </label>
  </div>

  <!-- 퍼블릭 패널 -->
  <div slot="right-inputs">
    <div class="gmp-col-label gmp-col-label--public">🏌️ 퍼블릭</div>

    <label class="gmp-field">
      <span>주중 그린피</span>
      <input data-gmp="weekdayGreenFee" type="range" min="50000" max="400000" step="10000" value="150000" />
      <div class="gmp-field-row">
        <input data-gmp-num="weekdayGreenFee" type="text" inputmode="numeric" value="150,000" />
        <span>원/회</span>
      </div>
    </label>
    <label class="gmp-field">
      <span>주말 그린피</span>
      <input data-gmp="weekendGreenFee" type="range" min="50000" max="500000" step="10000" value="200000" />
      <div class="gmp-field-row">
        <input data-gmp-num="weekendGreenFee" type="text" inputmode="numeric" value="200,000" />
        <span>원/회</span>
      </div>
    </label>
    <label class="gmp-field">
      <span>주말 라운딩 비율</span>
      <input data-gmp="weekendRatioPct" type="range" min="0" max="100" step="10" value="40" />
      <div class="gmp-field-row">
        <input data-gmp-num="weekendRatioPct" type="text" inputmode="numeric" value="40" />
        <span>%</span>
      </div>
    </label>
  </div>

  <!-- 결과 -->
  <div slot="result">
    <InfoNotice
      title="계산 기준 안내"
      lines={[
        "회원권 매각차손을 보유 기간으로 균등 배분해 연간 비용에 포함합니다.",
        "기회비용(투자 수익)은 계산에 포함되지 않습니다.",
        "실제 회원권 가격은 골프장마다 다르므로 거래소 시세를 직접 확인하세요.",
      ]}
    />

    <!-- 핵심 결론 박스 -->
    <div class="gmp-conclusion" data-gmp-result="conclusionBox"></div>

    <!-- KPI 비교 -->
    <div class="gmp-kpi-compare">
      <div class="gmp-kpi-col gmp-kpi-col--member">
        <div class="gmp-kpi-col-header">회원권</div>
        <div class="gmp-kpi-item">
          <span>연간 라운딩 비용</span>
          <strong data-gmp-result="memberAnnualRound">—</strong>
        </div>
        <div class="gmp-kpi-item">
          <span>연간 총 비용</span>
          <strong data-gmp-result="memberAnnual">—</strong>
        </div>
        <div class="gmp-kpi-item">
          <span>1회 실질 단가</span>
          <strong data-gmp-result="memberCostPerRound">—</strong>
        </div>
        <div class="gmp-kpi-item">
          <span data-gmp-result="totalLabel">N년 총비용</span>
          <strong data-gmp-result="memberTotal">—</strong>
        </div>
      </div>
      <div class="gmp-kpi-col gmp-kpi-col--public">
        <div class="gmp-kpi-col-header">퍼블릭</div>
        <div class="gmp-kpi-item">
          <span>연간 라운딩 비용</span>
          <strong data-gmp-result="publicAnnual">—</strong>
        </div>
        <div class="gmp-kpi-item">
          <span>연간 총 비용</span>
          <strong data-gmp-result="publicAnnual2">—</strong>
        </div>
        <div class="gmp-kpi-item">
          <span>1회 실질 단가</span>
          <strong data-gmp-result="publicCostPerRound">—</strong>
        </div>
        <div class="gmp-kpi-item">
          <span data-gmp-result="totalLabel2">N년 총비용</span>
          <strong data-gmp-result="publicTotal">—</strong>
        </div>
      </div>
    </div>

    <!-- 라인 차트 -->
    <div class="gmp-chart-section">
      <h3>누적 비용 비교</h3>
      <div class="gmp-chart-tabs">
        <button class="gmp-chart-tab is-active" data-gmp-scenario="base">기본 조건</button>
        <button class="gmp-chart-tab" data-gmp-scenario="noLoss">시세 유지</button>
        <button class="gmp-chart-tab" data-gmp-scenario="loss30">시세 -30%</button>
      </div>
      <div class="gmp-chart-wrap">
        <canvas id="gmpLineChart"></canvas>
      </div>
    </div>

    <SeoContent
      introTitle="골프 회원권, 사는 게 유리할까요?"
      intro={[
        "월 4회 이상 같은 골프장을 이용한다면 회원권이 3~5년 이내에 본전을 넘길 수 있습니다.",
        "하지만 시세 하락과 관리비를 포함하면 실질 손익은 단순 그린피 차이보다 복잡합니다. 직접 입력해 내 상황의 손익분기를 확인해보세요.",
      ]}
      faq={GMP_FAQ}
    />
  </div>
</CompareToolShell>

<script id="gmpConfig" type="application/json" set:html={JSON.stringify(config)}></script>
<script src="/scripts/golf-membership-vs-public.js" defer></script>
```

---

## 4. JS 로직 (`public/scripts/golf-membership-vs-public.js`)

```js
(function () {
  'use strict';

  const cfg = JSON.parse(document.getElementById('gmpConfig').textContent);
  const state = { ...cfg.defaults };
  let activeScenario = 'base';
  let chartInst = null;

  // ── 계산 ──────────────────────────────────────────────────
  function calcForScenario(s) {
    const d = { ...state };
    if (s === 'noLoss') d.resalePrice = d.membershipPrice;
    if (s === 'loss30') d.resalePrice = Math.round(d.membershipPrice * 0.7);

    const annualRoundings = d.roundingPerMonth * d.activeMonths;
    const memberAnnualRound = annualRoundings * (d.memberGreenFee + d.caddyFee + d.cartFee);
    const memberAnnual = memberAnnualRound + d.annualFee;

    const avgGreenFee = d.weekdayGreenFee * (1 - d.weekendRatio) + d.weekendGreenFee * d.weekendRatio;
    const publicAnnual = annualRoundings * (avgGreenFee + d.caddyFee + d.cartFee);

    const annualCapLoss = (d.membershipPrice - d.resalePrice) / d.holdingYears;

    const years = [];
    let breakEvenYear = null;
    for (let y = 1; y <= d.holdingYears; y++) {
      const memberCum = (memberAnnual + annualCapLoss) * y;
      const publicCum = publicAnnual * y;
      years.push({ year: y, memberCum, publicCum });
      if (!breakEvenYear && memberCum < publicCum) breakEvenYear = y;
    }

    const last = years[years.length - 1];
    const memberCostPerRound = annualRoundings > 0 ? (memberAnnual + annualCapLoss) / annualRoundings : 0;
    const publicCostPerRound = annualRoundings > 0 ? publicAnnual / annualRoundings : 0;

    return { memberAnnualRound, memberAnnual, publicAnnual, memberCostPerRound, publicCostPerRound, years, breakEvenYear, memberTotal: last.memberCum, publicTotal: last.publicCum };
  }

  // ── 포맷 ──────────────────────────────────────────────────
  function fw(v) { return Math.round(v).toLocaleString('ko-KR') + '원'; }
  function fws(v) {
    if (v >= 100_000_000) return (v / 100_000_000).toFixed(1) + '억원';
    if (v >= 10_000) return Math.round(v / 10_000) + '만원';
    return fw(v);
  }

  function setResult(key, val) {
    document.querySelectorAll(`[data-gmp-result="${key}"]`).forEach(el => { el.textContent = val; });
  }

  // ── 렌더 ──────────────────────────────────────────────────
  function renderChart(result) {
    const ctx = document.getElementById('gmpLineChart');
    if (!ctx) return;
    const labels = result.years.map(y => `${y.year}년`);
    const memberData = result.years.map(y => Math.round(y.memberCum));
    const publicData = result.years.map(y => Math.round(y.publicCum));
    if (chartInst) {
      chartInst.data.labels = labels;
      chartInst.data.datasets[0].data = memberData;
      chartInst.data.datasets[1].data = publicData;
      chartInst.update();
      return;
    }
    chartInst = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: '회원권', data: memberData, borderColor: '#1a56db', backgroundColor: 'rgba(26,86,219,0.1)', tension: 0.3, fill: false },
          { label: '퍼블릭', data: publicData, borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.1)', tension: 0.3, fill: false },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.raw.toLocaleString('ko-KR')}원` } },
        },
        scales: {
          y: { ticks: { callback: v => fws(v) } },
        },
      },
    });
  }

  function render() {
    const result = calcForScenario(activeScenario);
    const { holdingYears } = state;

    setResult('memberAnnualRound', fw(result.memberAnnualRound));
    setResult('memberAnnual', fw(result.memberAnnual));
    setResult('memberCostPerRound', fw(result.memberCostPerRound));
    setResult('publicAnnual', fw(result.publicAnnual));
    setResult('publicAnnual2', fw(result.publicAnnual));
    setResult('publicCostPerRound', fw(result.publicCostPerRound));
    setResult('totalLabel', `${holdingYears}년 총비용`);
    setResult('totalLabel2', `${holdingYears}년 총비용`);
    setResult('memberTotal', fws(result.memberTotal));
    setResult('publicTotal', fws(result.publicTotal));

    // 결론 박스
    const box = document.querySelector('[data-gmp-result="conclusionBox"]');
    if (box) {
      const saving = result.publicTotal - result.memberTotal;
      if (result.breakEvenYear) {
        box.className = 'gmp-conclusion gmp-conclusion--member';
        box.innerHTML = `<strong>🏆 회원권 유리</strong> — ${result.breakEvenYear}년차부터 회원권이 유리합니다.<br>${holdingYears}년 후 <em>${fws(Math.abs(saving))}</em> 절감 예상`;
      } else {
        box.className = 'gmp-conclusion gmp-conclusion--public';
        box.innerHTML = `<strong>퍼블릭 유리</strong> — 현재 이용 패턴에서는 ${holdingYears}년간 퍼블릭이 <em>${fws(Math.abs(saving))}</em> 더 저렴합니다.`;
      }
    }

    renderChart(result);
  }

  // ── 이벤트 ────────────────────────────────────────────────
  function syncNum(key, val) {
    state[key] = val;
    document.querySelectorAll(`[data-gmp="${key}"]`).forEach(s => { s.value = val; });
  }

  function bindEvents() {
    document.querySelectorAll('[data-gmp]').forEach(el => {
      el.addEventListener('input', () => {
        const key = el.dataset.gmp;
        // weekendRatioPct → weekendRatio (0~1 변환)
        if (key === 'weekendRatioPct') {
          state.weekendRatio = Number(el.value) / 100;
          document.querySelectorAll('[data-gmp-num="weekendRatioPct"]').forEach(n => { n.value = el.value; });
        } else {
          state[key] = Number(el.value);
          document.querySelectorAll(`[data-gmp-num="${key}"]`).forEach(n => { n.value = Number(el.value).toLocaleString('ko-KR'); });
        }
        render();
      });
    });

    document.querySelectorAll('[data-gmp-num]').forEach(el => {
      el.addEventListener('change', () => {
        const key = el.dataset.gmpNum;
        const raw = Number(el.value.replace(/,/g, ''));
        if (isNaN(raw)) return;
        if (key === 'weekendRatioPct') {
          state.weekendRatio = raw / 100;
          document.querySelectorAll(`[data-gmp="weekendRatioPct"]`).forEach(s => { s.value = raw; });
        } else {
          syncNum(key, raw);
        }
        render();
        el.value = key === 'weekendRatioPct' ? raw : raw.toLocaleString('ko-KR');
      });
    });

    document.querySelectorAll('[data-gmp-scenario]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-gmp-scenario]').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        activeScenario = btn.dataset.gmpScenario;
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
    bindEvents();
    loadChartJs(render);
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
```

---

## 5. SCSS (`src/styles/scss/pages/_golf-membership-vs-public.scss`)

```scss
.gmp-page {

  .gmp-shared-panel {
    background: var(--color-surface); border-radius: 0.5rem;
    padding: 1rem; margin-bottom: 1rem;
  }
  .gmp-shared-label {
    font-size: 0.75rem; font-weight: 600;
    color: var(--color-text-muted); text-transform: uppercase;
    letter-spacing: 0.05em; margin-bottom: 0.75rem;
  }

  .gmp-col-label {
    font-size: 1rem; font-weight: 700; padding: 0.5rem 0; margin-bottom: 0.75rem;
    border-bottom: 2px solid;
    &--member { color: #1a56db; border-color: #1a56db; }
    &--public { color: #f59e0b; border-color: #f59e0b; }
  }

  .gmp-field { margin-bottom: 1rem;
    > span { font-size: 0.875rem; font-weight: 500; display: block; margin-bottom: 0.25rem; }
  }
  .gmp-field-row {
    display: flex; align-items: center; gap: 0.5rem; margin-top: 0.25rem;
    input[type="text"] {
      width: 100px; text-align: right; padding: 0.25rem 0.5rem;
      border: 1px solid var(--color-border); border-radius: 0.25rem; font-size: 0.875rem;
    }
    span { font-size: 0.8125rem; color: var(--color-text-muted); }
  }

  // 결론 박스
  .gmp-conclusion {
    border-radius: 0.5rem; padding: 1.125rem 1.25rem;
    margin: 1.25rem 0; font-size: 0.9375rem; line-height: 1.7;
    strong { display: block; font-size: 1.0625rem; margin-bottom: 0.25rem; }
    em { font-style: normal; font-weight: 700; }
    &--member { background: #dbeafe; border-left: 4px solid #1a56db; strong { color: #1e40af; } }
    &--public  { background: #fef3c7; border-left: 4px solid #f59e0b; strong { color: #92400e; } }
  }

  // KPI 비교
  .gmp-kpi-compare {
    display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin: 1.5rem 0;
  }
  .gmp-kpi-col {
    border-radius: 0.625rem; overflow: hidden;
  }
  .gmp-kpi-col-header {
    padding: 0.5rem 0.875rem; font-weight: 700; font-size: 0.875rem;
    .gmp-kpi-col--member & { background: #1a56db; color: #fff; }
    .gmp-kpi-col--public & { background: #f59e0b; color: #fff; }
  }
  .gmp-kpi-item {
    padding: 0.625rem 0.875rem;
    border-bottom: 1px solid var(--color-border);
    background: var(--color-surface);
    &:last-child { border-bottom: none; }
    span { font-size: 0.75rem; color: var(--color-text-muted); display: block; }
    strong { font-size: 0.9375rem; font-weight: 700; }
  }

  // 차트
  .gmp-chart-section { margin: 2rem 0; h3 { font-size: 1rem; margin-bottom: 0.75rem; } }
  .gmp-chart-tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; }
  .gmp-chart-tab {
    padding: 0.375rem 0.875rem; border-radius: 2rem;
    border: 1px solid var(--color-border);
    background: var(--color-surface); font-size: 0.8125rem;
    cursor: pointer;
    &.is-active {
      background: var(--color-primary); color: #fff; border-color: var(--color-primary);
    }
  }
  .gmp-chart-wrap { height: 320px; position: relative; }
}
```

---

## 6. 등록 체크리스트

| 파일 | 작업 |
|---|---|
| `src/data/tools.ts` | `{ slug: "golf-membership-vs-public", title: "골프 회원권 vs 퍼블릭 손익 비교", order: ..., badges: ["골프", "회원권", "손익", "2026"] }` |
| `src/styles/app.scss` | `@use 'scss/pages/golf-membership-vs-public';` |
| `public/sitemap.xml` | `/tools/golf-membership-vs-public/` 추가 |
| `src/pages/index.astro` | `"golf-membership-vs-public": { category: "leisure", isNew: true }` |

---

## 7. QA 포인트

- [ ] 시나리오 탭 전환 시 차트·결론 박스 즉시 업데이트
- [ ] weekendRatioPct (0~100%) → weekendRatio (0~1) 변환 정확성
- [ ] 매각가 > 매입가 입력 시 음수 차손 처리 (회원권 더 유리)
- [ ] holdingYears 변경 시 차트 x축 항목 수 동적 업데이트
- [ ] 결론 박스: 손익분기 없음 vs 있음 두 케이스 모두 정상 표시
- [ ] `npm run build` 오류 없음
