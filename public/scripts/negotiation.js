/**
 * negotiation.js — 이직 계산기 (전용 ES 모듈)
 * Chart.js 4.x UMD (window.Chart) 필요 — CDN <script> 먼저 로드 후 type="module".
 */
import { CHART_COLORS, formatKRW, buildDefaultOptions, makeLabelPlugin } from "./chart-config.js";
import { readParam, writeParams } from "./url-state.js";

const $ = (id) => document.getElementById(id);
const setText = (id, val) => { const el = $(id); if (el) el.textContent = val; };

// ── 포맷 헬퍼 ─────────────────────────────────────────────────────────────────
function formatWon(value) {
  return `${new Intl.NumberFormat("ko-KR").format(Math.round(Number(value || 0)))}원`;
}

function formatKoreanAmount(value) {
  const amount = Math.round(Number(value || 0));
  const eok = Math.floor(amount / 100_000_000);
  const man = Math.floor((amount % 100_000_000) / 10_000);
  if (eok > 0 && man > 0) return `${eok}억 ${new Intl.NumberFormat("ko-KR").format(man)}만원`;
  if (eok > 0) return `${eok}억원`;
  return `${new Intl.NumberFormat("ko-KR").format(man)}만원`;
}

// ── 세후 추정 ─────────────────────────────────────────────────────────────────
function estimateNetFromAnnual(annual) {
  const monthlyGross   = annual / 12;
  const mealNonTaxable = Math.min(200_000, monthlyGross * 0.04);
  const taxable        = Math.max(0, monthlyGross - mealNonTaxable);
  const pension        = Math.min(taxable * 0.045, 280_000);
  const health         = taxable * 0.03545;
  const ltc            = health * 0.1295;
  const employment     = taxable * 0.009;
  const annualTaxable  = Math.max(0, taxable * 12 - 1_500_000);

  let rate = 0.06;
  if      (annualTaxable >= 140_000_000) rate = 0.24;
  else if (annualTaxable >= 100_000_000) rate = 0.20;
  else if (annualTaxable >=  70_000_000) rate = 0.17;
  else if (annualTaxable >=  50_000_000) rate = 0.14;
  else if (annualTaxable >=  30_000_000) rate = 0.10;

  const incomeTax  = taxable * rate;
  const localTax   = incomeTax * 0.1;
  const deductions = pension + health + ltc + employment + incomeTax + localTax;
  const monthlyNet = Math.max(0, monthlyGross - deductions);
  const netRate    = monthlyGross > 0 ? (monthlyNet / monthlyGross) * 100 : 0;
  return { monthlyGross, monthlyNet, netRate };
}

// ── 가로 바 차트 ─────────────────────────────────────────────────────────────
let negCompareChart = null;

function renderCompareChart(currentNet, targetNet) {
  const canvas = $("negotiation-compare-chart");
  if (!canvas || !window.Chart) return;

  const data     = [currentNet, targetNet];
  const baseOpts = buildDefaultOptions();

  if (negCompareChart) {
    negCompareChart.data.datasets[0].data = data;
    negCompareChart.update("none");
    return;
  }

  negCompareChart = new window.Chart(canvas, {
    type: "bar",
    data: {
      labels: ["현재 월 실수령", "목표 월 실수령"],
      datasets: [{
        data,
        backgroundColor: [CHART_COLORS.gray, "rgba(15,110,86,0.92)"],
        borderRadius: 4,
        barThickness: 28,
      }],
    },
    options: {
      ...baseOpts,
      indexAxis: "y",
      scales: {
        x: {
          beginAtZero: true,
          ticks: { callback: (v) => formatKRW(v), font: { size: 10 }, maxTicksLimit: 5 },
          grid: { color: "rgba(0,0,0,0.06)" },
        },
        y: { ticks: { font: { size: 11 } }, grid: { display: false } },
      },
      plugins: {
        ...baseOpts.plugins,
        tooltip: {
          ...baseOpts.plugins.tooltip,
          callbacks: { label: (c) => ` 월 실수령 ${formatKRW(c.raw)}` },
        },
      },
    },
    plugins: [makeLabelPlugin(formatKRW)],
  });
}

// ── 슬라이더 동기화 ───────────────────────────────────────────────────────────
function syncSlider(inputId, sliderId, valElId) {
  const input  = $(inputId);
  const slider = $(sliderId);
  const valEl  = $(valElId);
  if (!input || !slider) return;
  const clamped = Math.min(Math.max(Math.round(Number(input.value) || 0), 20_000_000), 300_000_000);
  slider.value = clamped;
  if (valEl) valEl.textContent = formatKoreanAmount(clamped);
}

// ── 힌트 ─────────────────────────────────────────────────────────────────────
function updateHints() {
  [
    ["negCurrentAnnual", "negCurrentAnnualHint"],
    ["negTargetAnnual",  "negTargetAnnualHint"],
  ].forEach(([iid, hid]) => {
    const input = $(iid); const hint = $(hid);
    if (input && hint) hint.textContent = formatKoreanAmount(input.value);
  });
}

// ── 렌더 ─────────────────────────────────────────────────────────────────────
function renderNegotiation() {
  const currentAnnual = Number($("negCurrentAnnual")?.value || 0);
  const targetAnnual  = Number($("negTargetAnnual")?.value  || 0);
  const currentInfo   = estimateNetFromAnnual(currentAnnual);
  const targetInfo    = estimateNetFromAnnual(targetAnnual);
  const raiseAmount   = Math.max(0, targetAnnual - currentAnnual);
  const raisePct      = currentAnnual > 0 ? (raiseAmount / currentAnnual) * 100 : 0;
  const grossIncrease = targetInfo.monthlyGross - currentInfo.monthlyGross;
  const netIncrease   = targetInfo.monthlyNet   - currentInfo.monthlyNet;

  // SummaryCards (기존 ID 유지)
  setText("negRaiseAmount",          formatWon(raiseAmount));
  setText("negRaisePct",             `${raisePct.toFixed(1)}%`);
  setText("negMonthlyGrossIncrease", formatWon(grossIncrease));
  setText("negMonthlyNetIncrease",   formatWon(netIncrease));

  // KPI 비교 카드 (신규 ID)
  setText("negCurrentNet", formatWon(currentInfo.monthlyNet));
  setText("negTargetNet",  formatWon(targetInfo.monthlyNet));

  const subEl = $("negNetIncreaseSub");
  if (subEl) {
    const manwon = Math.round(netIncrease / 10_000);
    subEl.textContent = manwon >= 0 ? `+${manwon}만원 / 월` : `${manwon}만원 / 월`;
  }

  // 상세 테이블
  const rows = [
    ["현재 연봉",          formatWon(currentAnnual)],
    ["현재 월 실수령",     formatWon(currentInfo.monthlyNet)],
    ["목표 연봉",          formatWon(targetAnnual)],
    ["목표 월 실수령",     formatWon(targetInfo.monthlyNet)],
    ["연봉 증가액",        formatWon(raiseAmount)],
    ["연봉 인상률",        `${raisePct.toFixed(1)}%`],
    ["월 세전 증가",       formatWon(grossIncrease)],
    ["월 실수령 증가",     formatWon(netIncrease)],
    ["목표 실수령률",      `${targetInfo.netRate.toFixed(1)}%`],
  ];
  const table = $("negotiationTable");
  if (table) {
    table.innerHTML = rows
      .map(([label, value]) => `<tr><td>${label}</td><td>${value}</td></tr>`)
      .join("");
  }

  // 차트
  renderCompareChart(currentInfo.monthlyNet, targetInfo.monthlyNet);

  // 슬라이더 반영
  syncSlider("negCurrentAnnual", "negCurrentAnnualSlider", "negCurrentAnnualSliderVal");
  syncSlider("negTargetAnnual",  "negTargetAnnualSlider",  "negTargetAnnualSliderVal");

  // URL 상태 저장
  writeParams({ cur: currentAnnual, tgt: targetAnnual });
}

// ── 이벤트 바인딩 ─────────────────────────────────────────────────────────────
// 텍스트 input → slider
["negCurrentAnnual", "negTargetAnnual"].forEach((id) => {
  $(id)?.addEventListener("input", () => {
    syncSlider(id, `${id}Slider`, `${id}SliderVal`);
    updateHints();
    renderNegotiation();
  });
});

// slider → 텍스트 input
[
  ["negCurrentAnnualSlider", "negCurrentAnnual", "negCurrentAnnualSliderVal"],
  ["negTargetAnnualSlider",  "negTargetAnnual",  "negTargetAnnualSliderVal"],
].forEach(([sliderId, inputId, valElId]) => {
  $(sliderId)?.addEventListener("input", () => {
    const slider = $(sliderId);
    const input  = $(inputId);
    const valEl  = $(valElId);
    if (input  && slider) input.value   = slider.value;
    if (valEl  && slider) valEl.textContent = formatKoreanAmount(slider.value);
    updateHints();
    renderNegotiation();
  });
});

$("calcNegotiationBtn")?.addEventListener("click", renderNegotiation);

// ── 리셋 / 링크 복사 ─────────────────────────────────────────────────────────
function flashButton(btn, label) {
  if (!btn) return;
  const orig = btn.textContent;
  btn.textContent = label;
  setTimeout(() => { btn.textContent = orig; }, 1600);
}

$("resetNegotiationBtn")?.addEventListener("click", () => {
  document.querySelectorAll(".calculator-page input").forEach((input) => {
    if (input.type === "checkbox") input.checked = input.defaultChecked;
    else if (input.type !== "range") input.value = input.defaultValue;
  });
  updateHints();
  renderNegotiation();
  flashButton($("resetNegotiationBtn"), "초기화됨");
});

$("copyNegotiationLinkBtn")?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    flashButton($("copyNegotiationLinkBtn"), "링크 복사됨");
  } catch {
    flashButton($("copyNegotiationLinkBtn"), "복사 실패");
  }
});

// ── URL 파라미터에서 초기값 복원 ─────────────────────────────────────────────
(function restoreFromUrl() {
  const cur = readParam("cur", "");
  const tgt = readParam("tgt", "");
  if (cur) { const el = $("negCurrentAnnual"); if (el) el.value = cur; }
  if (tgt) { const el = $("negTargetAnnual");  if (el) el.value = tgt; }
})();

// ── 초기 실행 ─────────────────────────────────────────────────────────────────
updateHints();
renderNegotiation();
