/**
 * retirement.js — 퇴직금 계산기 (전용 ES 모듈)
 * Chart.js 4.x UMD (window.Chart) 필요 — CDN <script> 먼저 로드 후 type="module".
 */
import { CHART_COLORS, formatKRW, buildDefaultOptions } from "./chart-config.js";
import { readParam, readBool, writeParams } from "./url-state.js";

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

// ── 도넛 차트 중앙 텍스트 플러그인 ───────────────────────────────────────────
let _centerLines = ["", "세후 추정"];

const centerTextPlugin = {
  id: "retirementCenterText",
  afterDraw(chart) {
    const { ctx, chartArea: { width, height, left, top } } = chart;
    const cx = left + width / 2;
    const cy = top + height / 2;

    ctx.save();
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";

    // 상단 줄: 금액 (굵게)
    ctx.fillStyle = "#172033";
    ctx.font      = `600 16px "Pretendard", system-ui, sans-serif`;
    ctx.fillText(_centerLines[0], cx, cy - 10);

    // 하단 줄: 레이블 (작게)
    ctx.fillStyle = "#888780";
    ctx.font      = `400 10px "Pretendard", system-ui, sans-serif`;
    ctx.fillText(_centerLines[1], cx, cy + 10);
    ctx.restore();
  },
};

// ── 도넛 차트 ────────────────────────────────────────────────────────────────
let retirementDonutChart = null;

function renderDonutChart(netAmount, taxAmount) {
  const canvas = $("retirement-donut-chart");
  if (!canvas || !window.Chart) return;

  _centerLines = [formatKRW(netAmount), "세후 추정"];
  const baseOpts = buildDefaultOptions();

  if (retirementDonutChart) {
    retirementDonutChart.data.datasets[0].data = [netAmount, taxAmount];
    retirementDonutChart.update("none");
    return;
  }

  retirementDonutChart = new window.Chart(canvas, {
    type: "doughnut",
    data: {
      labels: ["세후 실수령", "세금 추정"],
      datasets: [{
        data: [netAmount, taxAmount],
        backgroundColor: ["rgba(15,110,86,0.88)", "rgba(186,117,23,0.70)"],
        borderColor:     ["rgba(15,110,86,1)",    "rgba(186,117,23,1)"],
        borderWidth: 1.5,
        hoverOffset: 6,
      }],
    },
    options: {
      ...baseOpts,
      cutout: "60%",
      plugins: {
        ...baseOpts.plugins,
        legend: { display: false },
        tooltip: {
          ...baseOpts.plugins.tooltip,
          callbacks: { label: (c) => ` ${c.label}: ${formatKRW(c.raw)}` },
        },
      },
    },
    plugins: [centerTextPlugin],
  });
}

// ── 슬라이더 동기화 ───────────────────────────────────────────────────────────
function syncAnnualSlider() {
  const input  = $("retirementAnnualSalary");
  const slider = $("retirementAnnualSlider");
  const valEl  = $("retirementAnnualSliderVal");
  if (!input || !slider) return;
  const clamped = Math.min(Math.max(Math.round(Number(input.value) || 0), 20_000_000), 300_000_000);
  slider.value = clamped;
  if (valEl) valEl.textContent = formatKoreanAmount(clamped);
}

function syncYearsSlider() {
  const input  = $("yearsOfService");
  const slider = $("yearsOfServiceSlider");
  const valEl  = $("yearsOfServiceSliderVal");
  if (!input || !slider) return;
  const clamped = Math.min(Math.max(Number(input.value) || 0, 1), 40);
  slider.value = clamped;
  if (valEl) valEl.textContent = `${Number(clamped).toFixed(1)}년`;
}

// ── 힌트 ─────────────────────────────────────────────────────────────────────
function updateHints() {
  [
    ["retirementAnnualSalary", "retirementAnnualSalaryHint"],
    ["retirementBonus",        "retirementBonusHint"],
    ["retirementLeavePay",     "retirementLeavePayHint"],
  ].forEach(([iid, hid]) => {
    const input = $(iid); const hint = $(hid);
    if (input && hint) hint.textContent = formatKoreanAmount(input.value);
  });
}

// ── 렌더 ─────────────────────────────────────────────────────────────────────
function renderRetirement() {
  const annualSalary   = Number($("retirementAnnualSalary")?.value || 0);
  const yearsOfService = Number($("yearsOfService")?.value         || 0);
  const bonus          = Number($("retirementBonus")?.value        || 0);
  const leavePay       = Number($("retirementLeavePay")?.value     || 0);
  const includeBonus   = $("retirementIncludeBonus")?.checked ?? true;
  const taxRate        = Number($("retirementTaxRate")?.value      || 0);
  const salaryInfo     = estimateNetFromAnnual(annualSalary);

  const avgMonthlyWage  = salaryInfo.monthlyGross + (includeBonus ? bonus / 12 : 0) + leavePay / 12;
  const retirementGross = avgMonthlyWage * yearsOfService;
  const estimatedTax    = retirementGross * (taxRate / 100);
  const retirementNet   = retirementGross - estimatedTax;

  // SummaryCards
  setText("retirementAvgMonthlyWage", formatWon(avgMonthlyWage));
  setText("retirementGross",          formatWon(retirementGross));
  setText("retirementNet",            formatWon(retirementNet));

  // 도넛 범례 값
  setText("retirementNetLegend", formatWon(retirementNet));
  setText("retirementTaxLegend", formatWon(estimatedTax));

  // 상세 테이블
  const rows = [
    ["월 기본 급여",      salaryInfo.monthlyGross],
    ["월 보너스 반영분",  includeBonus ? bonus / 12 : 0],
    ["월 연차수당 반영분", leavePay / 12],
    ["평균임금 추정",     avgMonthlyWage],
    ["근속연수",          `${yearsOfService}년`],
    ["퇴직금 세전",       retirementGross],
    ["퇴직소득세 추정",   estimatedTax],
    ["퇴직금 세후",       retirementNet],
  ];
  const table = $("retirementTable");
  if (table) {
    table.innerHTML = rows.map(([label, value]) => {
      const display = typeof value === "string" ? value : formatWon(value);
      return `<tr><td>${label}</td><td>${display}</td></tr>`;
    }).join("");
  }

  // 도넛 차트
  renderDonutChart(retirementNet, estimatedTax);

  // 슬라이더 반영
  syncAnnualSlider();
  syncYearsSlider();

  // URL 상태 저장
  writeParams({
    sal: annualSalary,
    yrs: yearsOfService,
    bon: bonus,
    lv:  leavePay,
    tax: taxRate,
    ib:  includeBonus ? "1" : "0",
  });
}

// ── 이벤트 바인딩 ─────────────────────────────────────────────────────────────
// 연봉 text → slider
$("retirementAnnualSalary")?.addEventListener("input", () => {
  syncAnnualSlider(); updateHints(); renderRetirement();
});
// 연봉 slider → text
$("retirementAnnualSlider")?.addEventListener("input", () => {
  const slider = $("retirementAnnualSlider");
  const input  = $("retirementAnnualSalary");
  const valEl  = $("retirementAnnualSliderVal");
  if (input && slider) input.value = slider.value;
  if (valEl  && slider) valEl.textContent = formatKoreanAmount(slider.value);
  updateHints(); renderRetirement();
});

// 근속연수 text → slider
$("yearsOfService")?.addEventListener("input", () => {
  syncYearsSlider(); renderRetirement();
});
// 근속연수 slider → text
$("yearsOfServiceSlider")?.addEventListener("input", () => {
  const slider = $("yearsOfServiceSlider");
  const input  = $("yearsOfService");
  const valEl  = $("yearsOfServiceSliderVal");
  if (input && slider) input.value = slider.value;
  if (valEl  && slider) valEl.textContent = `${Number(slider.value).toFixed(1)}년`;
  renderRetirement();
});

// 나머지 inputs
["retirementBonus", "retirementLeavePay", "retirementTaxRate"].forEach((id) => {
  $(id)?.addEventListener("input", () => { updateHints(); renderRetirement(); });
});
$("retirementIncludeBonus")?.addEventListener("change", renderRetirement);
$("calcRetirementBtn")?.addEventListener("click", renderRetirement);

// ── 리셋 / 링크 복사 ─────────────────────────────────────────────────────────
function flashButton(btn, label) {
  if (!btn) return;
  const orig = btn.textContent;
  btn.textContent = label;
  setTimeout(() => { btn.textContent = orig; }, 1600);
}

$("resetRetirementBtn")?.addEventListener("click", () => {
  document.querySelectorAll(".calculator-page input").forEach((input) => {
    if (input.type === "checkbox") input.checked = input.defaultChecked;
    else if (input.type !== "range") input.value = input.defaultValue;
  });
  updateHints(); renderRetirement();
  flashButton($("resetRetirementBtn"), "초기화됨");
});

$("copyRetirementLinkBtn")?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    flashButton($("copyRetirementLinkBtn"), "링크 복사됨");
  } catch {
    flashButton($("copyRetirementLinkBtn"), "복사 실패");
  }
});

// ── URL 파라미터에서 초기값 복원 ─────────────────────────────────────────────
(function restoreFromUrl() {
  const sal = readParam("sal", "");
  const yrs = readParam("yrs", "");
  const bon = readParam("bon", "");
  const lv  = readParam("lv",  "");
  const tax = readParam("tax", "");
  const ib  = readParam("ib",  "");
  if (sal) { const el = $("retirementAnnualSalary"); if (el) el.value = sal; }
  if (yrs) { const el = $("yearsOfService");         if (el) el.value = yrs; }
  if (bon) { const el = $("retirementBonus");        if (el) el.value = bon; }
  if (lv)  { const el = $("retirementLeavePay");     if (el) el.value = lv; }
  if (tax) { const el = $("retirementTaxRate");      if (el) el.value = tax; }
  if (ib !== "") { const el = $("retirementIncludeBonus"); if (el) el.checked = ib !== "0"; }
})();

// ── 초기 실행 ─────────────────────────────────────────────────────────────────
updateHints();
renderRetirement();
