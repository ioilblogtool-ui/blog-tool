/**
 * salary.js — 연봉 인상 계산기 (전용 ES 모듈)
 *
 * Chart.js 4.x UMD (window.Chart) 필요.
 * salary.astro 에서 CDN <script> 먼저 삽입 후 이 파일을 type="module" 로드.
 */
import { CHART_COLORS, formatKRW, buildDefaultOptions, makeLabelPlugin } from "./chart-config.js";
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

// ── 차트 ─────────────────────────────────────────────────────────────────────
let salaryCompareChart = null;

function renderCompareChart(nets) {
  const canvas = $("salary-compare-chart");
  if (!canvas || !window.Chart) return;

  const labels = ["현재", "케이스 1", "케이스 2", "케이스 3"];
  const colors = [
    CHART_COLORS.gray,
    "rgba(29,158,117,0.58)",
    "rgba(29,158,117,0.80)",
    "rgba(15,110,86,0.96)",
  ];
  const baseOpts = buildDefaultOptions();

  if (salaryCompareChart) {
    salaryCompareChart.data.datasets[0].data = nets;
    salaryCompareChart.update("none");
    return;
  }

  salaryCompareChart = new window.Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        data: nets,
        backgroundColor: colors,
        borderRadius: 4,
        barThickness: 22,
      }],
    },
    options: {
      ...baseOpts,
      indexAxis: "y",
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            callback: (v) => formatKRW(v),
            font: { size: 10 },
            maxTicksLimit: 5,
          },
          grid: { color: "rgba(0,0,0,0.06)" },
        },
        y: {
          ticks: { font: { size: 11 } },
          grid: { display: false },
        },
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
function syncSalarySlider() {
  const input  = $("currentAnnualInput");
  const slider = $("currentAnnualSlider");
  const valEl  = $("currentAnnualSliderVal");
  if (!input || !slider) return;
  const clamped = Math.min(Math.max(Math.round(Number(input.value) || 0), 20_000_000), 300_000_000);
  slider.value = clamped;
  if (valEl) valEl.textContent = formatKoreanAmount(clamped);
}

function syncRaisePctSlider(n) {
  const raiseInput = $(`raise${n}`);
  const pctSlider  = $(`raise${n}Pct`);
  const pctValEl   = $(`raise${n}PctVal`);
  if (!raiseInput || !pctSlider) return;
  const annual   = Math.round(Number($("currentAnnualInput")?.value) || 0);
  const raiseAmt = Math.round(Number(raiseInput.value) || 0);
  const pct      = annual > 0 ? Math.min(30, Math.max(0, (raiseAmt / annual) * 100)) : 0;
  pctSlider.value = pct.toFixed(1);
  if (pctValEl) pctValEl.textContent = `${Number(pctSlider.value).toFixed(1)}%`;
}

function applyRaisePct(n) {
  const pctSlider  = $(`raise${n}Pct`);
  const raiseInput = $(`raise${n}`);
  const pctValEl   = $(`raise${n}PctVal`);
  if (!pctSlider || !raiseInput) return;
  const pct    = Number(pctSlider.value) || 0;
  const annual = Math.round(Number($("currentAnnualInput")?.value) || 0);
  raiseInput.value = Math.round(annual * pct / 100);
  if (pctValEl) pctValEl.textContent = `${pct.toFixed(1)}%`;
  updateHints();
}

// ── 힌트 ─────────────────────────────────────────────────────────────────────
function updateHints() {
  [
    ["currentAnnualInput", "currentAnnualInputHint"],
    ["bonus",              "bonusHint"],
    ["annualLeavePay",     "annualLeavePayHint"],
    ["raise1",             "raise1Hint"],
    ["raise2",             "raise2Hint"],
    ["raise3",             "raise3Hint"],
  ].forEach(([iid, hid]) => {
    const input = $(iid);
    const hint  = $(hid);
    if (input && hint) hint.textContent = formatKoreanAmount(input.value);
  });
}

// ── 렌더 ─────────────────────────────────────────────────────────────────────
function renderSalary() {
  const currentAnnual  = Number($("currentAnnualInput")?.value  || 0);
  const bonus          = Number($("bonus")?.value               || 0);
  const annualLeavePay = Number($("annualLeavePay")?.value      || 0);
  const includeBonus   = $("includeBonusToggle")?.checked ?? true;
  const currentInfo    = estimateNetFromAnnual(currentAnnual);
  const currentTotalComp = currentAnnual + (includeBonus ? bonus : 0) + annualLeavePay;

  // 현재 요약 카드
  setText("currentAnnualSalary",  formatWon(currentAnnual));
  setText("currentTotalComp",     formatWon(currentTotalComp));
  setText("currentGrossMonthly",  formatWon(currentInfo.monthlyGross));
  setText("currentNetDisplay",    formatWon(currentInfo.monthlyNet));

  // 시나리오
  const raises    = [1, 2, 3].map((n) => Number($(`raise${n}`)?.value || 0));
  const scenarios = raises.map((raiseAmount) => {
    const raisedAnnual = currentAnnual + raiseAmount;
    const raisedInfo   = estimateNetFromAnnual(raisedAnnual);
    return {
      raiseAmount,
      raisedAnnual,
      expectedNet:          raisedInfo.monthlyNet,
      monthlyNetIncrease:   raisedInfo.monthlyNet   - currentInfo.monthlyNet,
      monthlyGrossIncrease: raisedInfo.monthlyGross - currentInfo.monthlyGross,
      expectedRate:         raisedInfo.netRate,
      totalComp:            raisedAnnual + (includeBonus ? bonus : 0) + annualLeavePay,
    };
  });

  // 케이스 카드
  scenarios.forEach((item, i) => {
    const n = i + 1;
    setText(`raiseCase${n}Net`,    formatWon(item.expectedNet));
    setText(`raiseCase${n}Annual`, `인상 후 ${formatWon(item.raisedAnnual)}`);
    const subEl = $(`raiseCase${n}Sub`);
    if (subEl) {
      const manwon = Math.round(item.monthlyNetIncrease / 10_000);
      subEl.textContent = manwon >= 0 ? `+${manwon}만원 / 월` : `${manwon}만원 / 월`;
    }
  });

  // 최고 케이스
  const bestIdx = scenarios.reduce(
    (bi, s, i) => (s.monthlyNetIncrease > scenarios[bi].monthlyNetIncrease ? i : bi),
    0
  );
  setText("raiseBestLabel", `케이스 ${bestIdx + 1}`);
  setText("raiseBestNet",   `월 실수령 +${formatWon(scenarios[bestIdx].monthlyNetIncrease)}`);

  // 상세 테이블
  const rows = [
    { label: "연봉 인상액",    current: 0,                    values: scenarios.map((s) => s.raiseAmount) },
    { label: "인상 후 연봉",   current: currentAnnual,         values: scenarios.map((s) => s.raisedAnnual) },
    { label: "인상 후 총보상", current: currentTotalComp,      values: scenarios.map((s) => s.totalComp) },
    { label: "월 세전 증가",   current: 0,                    values: scenarios.map((s) => s.monthlyGrossIncrease) },
    { label: "월 실수령 증가", current: 0,                    values: scenarios.map((s) => s.monthlyNetIncrease) },
    { label: "예상 월 실수령", current: currentInfo.monthlyNet, values: scenarios.map((s) => s.expectedNet) },
    { label: "예상 실수령률",  current: currentInfo.netRate,   values: scenarios.map((s) => s.expectedRate), isPercent: true },
  ];

  const resultTable = $("resultTable");
  if (resultTable) {
    resultTable.innerHTML = rows.map((row) => {
      const fmt = row.isPercent ? (v) => `${Number(v).toFixed(1)}%` : formatWon;
      return `<tr>
        <td>${row.label}</td>
        <td>${fmt(row.current)}</td>
        <td>${fmt(row.values[0])}</td>
        <td>${fmt(row.values[1])}</td>
        <td>${fmt(row.values[2])}</td>
      </tr>`;
    }).join("");
  }

  // 차트
  renderCompareChart([
    currentInfo.monthlyNet,
    scenarios[0].expectedNet,
    scenarios[1].expectedNet,
    scenarios[2].expectedNet,
  ]);

  // 슬라이더 반영
  syncSalarySlider();
  [1, 2, 3].forEach(syncRaisePctSlider);

  // URL 상태 저장
  writeParams({
    sal: currentAnnual,
    bon: bonus,
    lv:  annualLeavePay,
    ib:  includeBonus ? "1" : "0",
    r1:  raises[0],
    r2:  raises[1],
    r3:  raises[2],
  });
}

// ── 이벤트 바인딩 ─────────────────────────────────────────────────────────────
// 현재 연봉 text → slider
$("currentAnnualInput")?.addEventListener("input", () => {
  syncSalarySlider();
  updateHints();
  renderSalary();
});

// 현재 연봉 slider → text
const _annualSlider    = $("currentAnnualSlider");
const _annualSliderVal = $("currentAnnualSliderVal");
_annualSlider?.addEventListener("input", () => {
  const input = $("currentAnnualInput");
  if (input) input.value = _annualSlider.value;
  if (_annualSliderVal) _annualSliderVal.textContent = formatKoreanAmount(_annualSlider.value);
  updateHints();
  renderSalary();
});

// 보너스 / 연차수당
["bonus", "annualLeavePay"].forEach((id) => {
  $(id)?.addEventListener("input", () => { updateHints(); renderSalary(); });
});
$("includeBonusToggle")?.addEventListener("change", renderSalary);

// 케이스별 인상액 + % 슬라이더
[1, 2, 3].forEach((n) => {
  $(`raise${n}`)?.addEventListener("input", () => {
    syncRaisePctSlider(n);
    updateHints();
    renderSalary();
  });
  $(`raise${n}Pct`)?.addEventListener("input", () => {
    applyRaisePct(n);
    renderSalary();
  });
});

$("calcBtn")?.addEventListener("click", renderSalary);

// ── 리셋 / 링크 복사 ─────────────────────────────────────────────────────────
function flashButton(btn, label) {
  if (!btn) return;
  const orig = btn.textContent;
  btn.textContent = label;
  setTimeout(() => { btn.textContent = orig; }, 1600);
}

$("resetSalaryBtn")?.addEventListener("click", () => {
  document.querySelectorAll(".calculator-page input").forEach((input) => {
    if (input.type === "checkbox") input.checked = input.defaultChecked;
    else if (input.type !== "range") input.value = input.defaultValue;
  });
  updateHints();
  renderSalary();
  flashButton($("resetSalaryBtn"), "초기화됨");
});

$("copySalaryLinkBtn")?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    flashButton($("copySalaryLinkBtn"), "링크 복사됨");
  } catch {
    flashButton($("copySalaryLinkBtn"), "복사 실패");
  }
});

// ── URL 파라미터에서 초기값 복원 ─────────────────────────────────────────────
(function restoreFromUrl() {
  const sal = readParam("sal", "");
  const bon = readParam("bon", "");
  const lv  = readParam("lv",  "");
  const ib  = readParam("ib",  "");
  const r1  = readParam("r1",  "");
  const r2  = readParam("r2",  "");
  const r3  = readParam("r3",  "");
  if (sal) { const el = $("currentAnnualInput"); if (el) el.value = sal; }
  if (bon) { const el = $("bonus");              if (el) el.value = bon; }
  if (lv)  { const el = $("annualLeavePay");     if (el) el.value = lv; }
  if (ib !== "") { const el = $("includeBonusToggle"); if (el) el.checked = ib !== "0"; }
  if (r1)  { const el = $("raise1"); if (el) el.value = r1; }
  if (r2)  { const el = $("raise2"); if (el) el.value = r2; }
  if (r3)  { const el = $("raise3"); if (el) el.value = r3; }
})();

// ── 초기 실행 ─────────────────────────────────────────────────────────────────
updateHints();
renderSalary();
