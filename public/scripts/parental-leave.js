/**
 * parental-leave.js — 육아휴직 계산기 (전용 ES 모듈)
 * Chart.js 4.x UMD (window.Chart) 필요 — CDN <script> 먼저 로드 후 type="module".
 */
import { formatKRW, buildDefaultOptions } from "./chart-config.js";
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

function formatPct(value) {
  return `${Number(value || 0).toFixed(1)}%`;
}

// ── 실수령 추정 ───────────────────────────────────────────────────────────────
function estimateNetFromAnnual(annual) {
  const monthlyGross   = annual / 12;
  const mealNonTaxable = Math.min(200_000, monthlyGross * 0.04);
  const taxableMonthly = Math.max(0, monthlyGross - mealNonTaxable);
  const pension        = Math.min(taxableMonthly * 0.045, 280_000);
  const health         = taxableMonthly * 0.03545;
  const ltc            = health * 0.1295;
  const employment     = taxableMonthly * 0.009;
  const annualTaxable  = Math.max(0, taxableMonthly * 12 - 1_500_000);

  let rate = 0.06;
  if      (annualTaxable >= 140_000_000) rate = 0.24;
  else if (annualTaxable >= 100_000_000) rate = 0.20;
  else if (annualTaxable >=  70_000_000) rate = 0.17;
  else if (annualTaxable >=  50_000_000) rate = 0.14;
  else if (annualTaxable >=  30_000_000) rate = 0.10;

  const incomeTax  = taxableMonthly * rate;
  const localTax   = incomeTax * 0.1;
  const deductions = pension + health + ltc + employment + incomeTax + localTax;
  const monthlyNet = Math.max(0, monthlyGross - deductions);
  return { monthlyGross, monthlyNet, netRate: monthlyGross > 0 ? (monthlyNet / monthlyGross) * 100 : 0 };
}

// ── 월별 현금흐름 라인 차트 ───────────────────────────────────────────────────
let cashFlowChart = null;

function renderCashFlowChart(beforeNet, leaveMonthlyIncome, afterMonthlyNet) {
  const canvas = $("leave-cashflow-chart");
  if (!canvas || !window.Chart) return;

  // 5-포인트: 휴직 전 → 휴직 시작 → 휴직 중 → 복직 직후 → 복직 후
  const labels      = ["휴직 전", "휴직 시작", "휴직 중", "복직 직후", "복직 후"];
  const leaveData   = [beforeNet, leaveMonthlyIncome, leaveMonthlyIncome, null, null];
  const returnData  = [null, null, leaveMonthlyIncome, afterMonthlyNet, afterMonthlyNet];
  const baseData    = [beforeNet, beforeNet, beforeNet, beforeNet, beforeNet];

  const baseOpts = buildDefaultOptions();

  if (cashFlowChart) {
    cashFlowChart.data.datasets[0].data = leaveData;
    cashFlowChart.data.datasets[1].data = returnData;
    cashFlowChart.data.datasets[2].data = baseData;
    cashFlowChart.update("none");
    return;
  }

  cashFlowChart = new window.Chart(canvas, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "휴직 중 수령",
          data: leaveData,
          borderColor:          "rgba(186,117,23,0.88)",
          backgroundColor:      "rgba(186,117,23,0.07)",
          pointBackgroundColor: "rgba(186,117,23,0.92)",
          borderWidth: 2.5,
          pointRadius: 4,
          tension: 0,
          fill: true,
          spanGaps: false,
        },
        {
          label: "복직 후 실수령",
          data: returnData,
          borderColor:          "rgba(15,110,86,0.88)",
          backgroundColor:      "rgba(15,110,86,0.07)",
          pointBackgroundColor: "rgba(15,110,86,0.92)",
          borderWidth: 2.5,
          pointRadius: 4,
          tension: 0,
          fill: true,
          spanGaps: false,
        },
        {
          label: "휴직 전 기준",
          data: baseData,
          borderColor:     "rgba(148,163,184,0.6)",
          backgroundColor: "transparent",
          pointRadius: 0,
          borderWidth: 1.5,
          borderDash: [4, 4],
          tension: 0,
          fill: false,
        },
      ],
    },
    options: {
      ...baseOpts,
      plugins: {
        ...baseOpts.plugins,
        legend: {
          display: true,
          position: "top",
          labels: { font: { size: 11 }, boxWidth: 12, padding: 12 },
        },
        tooltip: {
          ...baseOpts.plugins.tooltip,
          callbacks: {
            label: (c) => c.raw != null ? ` ${c.dataset.label}: ${formatKRW(c.raw)} / 월` : "",
          },
        },
      },
      scales: {
        x: { grid: { color: "rgba(0,0,0,0.05)" } },
        y: {
          ticks: { callback: (v) => formatKRW(v), font: { size: 10 } },
          grid:  { color: "rgba(0,0,0,0.05)" },
        },
      },
    },
  });
}

// ── 힌트 업데이트 ─────────────────────────────────────────────────────────────
function updateHints() {
  [
    ["leaveAfterAnnual",      "leaveAfterAnnualHint"],
    ["leaveRetirementPayout", "leaveRetirementPayoutHint"],
    ["leaveBonus",            "leaveBonusHint"],
    ["leaveAnnualLeavePay",   "leaveAnnualLeavePayHint"],
  ].forEach(([iid, hid]) => {
    const input = $(iid); const hint = $(hid);
    if (input && hint) hint.textContent = formatKoreanAmount(input.value);
  });
}

// ── 렌더 ─────────────────────────────────────────────────────────────────────
function renderLeave() {
  const beforeNet          = Number($("leaveBeforeNet")?.value         || 0);
  const afterAnnual        = Number($("leaveAfterAnnual")?.value       || 0);
  const leaveMonthlyIncome = Number($("leaveMonthlyIncome")?.value     || 0);
  const leaveMonths        = Number($("leaveMonths")?.value            || 0);
  const retirementPayout   = Number($("leaveRetirementPayout")?.value  || 0);
  const includeBonus       = $("leaveIncludeBonus")?.checked ?? true;
  const leaveBonus         = Number($("leaveBonus")?.value             || 0);
  const leaveAnnualLeavePay= Number($("leaveAnnualLeavePay")?.value    || 0);

  const afterInfo    = estimateNetFromAnnual(afterAnnual);
  const monthlyGap   = afterInfo.monthlyNet - leaveMonthlyIncome;
  const totalComp    = afterAnnual + (includeBonus ? leaveBonus : 0) + leaveAnnualLeavePay;
  const bufferMonths = monthlyGap > 0 ? retirementPayout / monthlyGap : 0;

  // SummaryCards
  setText("leaveMonthlyIncomeCard", formatWon(leaveMonthlyIncome));
  setText("leaveAfterMonthlyNet",   formatWon(afterInfo.monthlyNet));
  setText("leaveMonthlyGap",        formatWon(monthlyGap));
  setText("leaveBufferMonths",      monthlyGap > 0 ? `${bufferMonths.toFixed(1)}개월` : "계산 불가");

  // 상세 테이블
  const rows = [
    ["휴직 전 월 실수령",       beforeNet],
    ["휴직 중 월 수령",          leaveMonthlyIncome],
    ["휴직 기간 총 수령",        leaveMonthlyIncome * leaveMonths],
    ["복직 후 연봉",             afterAnnual],
    ["복직 후 월 실수령",        afterInfo.monthlyNet],
    ["복직 후 실수령률",         formatPct(afterInfo.netRate)],
    ["휴직 대비 복직 후 차이",   monthlyGap],
    ["휴직 전 대비 복직 후 차이",afterInfo.monthlyNet - beforeNet],
    ["복직 후 총보상",           totalComp],
    ["중간정산 금액",            retirementPayout],
    ["버퍼 가능 개월",           monthlyGap > 0 ? `${bufferMonths.toFixed(1)}개월` : "계산 불가"],
  ];

  const table = $("leaveTable");
  if (table) {
    table.innerHTML = rows.map(([label, value]) => {
      const display = typeof value === "string" ? value : formatWon(value);
      return `<tr><td>${label}</td><td>${display}</td></tr>`;
    }).join("");
  }

  // 차트
  renderCashFlowChart(beforeNet, leaveMonthlyIncome, afterInfo.monthlyNet);
  updateHints();

  // URL 상태 저장
  writeParams({
    bn:  $("leaveBeforeNet")?.value          || "",
    aa:  $("leaveAfterAnnual")?.value        || "",
    mi:  $("leaveMonthlyIncome")?.value      || "",
    lm:  $("leaveMonths")?.value             || "",
    rp:  $("leaveRetirementPayout")?.value   || "",
    lb:  $("leaveBonus")?.value              || "",
    lp:  $("leaveAnnualLeavePay")?.value     || "",
    ib:  includeBonus ? "1" : "0",
  });
}

// ── 이벤트 바인딩 ─────────────────────────────────────────────────────────────
["leaveBeforeNet","leaveAfterAnnual","leaveMonthlyIncome","leaveMonths",
 "leaveRetirementPayout","leaveBonus","leaveAnnualLeavePay"].forEach((id) => {
  $(id)?.addEventListener("input", renderLeave);
});
$("leaveIncludeBonus")?.addEventListener("change", renderLeave);
$("calcLeaveBtn")?.addEventListener("click", renderLeave);

// ── 리셋 / 링크 복사 ─────────────────────────────────────────────────────────
function flashButton(btn, label) {
  if (!btn) return;
  const orig = btn.textContent;
  btn.textContent = label;
  setTimeout(() => { btn.textContent = orig; }, 1600);
}

$("resetLeaveBtn")?.addEventListener("click", () => {
  document.querySelectorAll(".calculator-page input").forEach((input) => {
    if (input.type === "checkbox") input.checked = input.defaultChecked;
    else if (input.type !== "range") input.value = input.defaultValue;
  });
  renderLeave();
  flashButton($("resetLeaveBtn"), "초기화됨");
});

$("copyLeaveLinkBtn")?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    flashButton($("copyLeaveLinkBtn"), "링크 복사됨");
  } catch {
    flashButton($("copyLeaveLinkBtn"), "복사 실패");
  }
});

// ── URL 파라미터 복원 후 초기 실행 ────────────────────────────────────────────
(function applyUrlParams() {
  const bn = readParam("bn", "");
  const aa = readParam("aa", "");
  const mi = readParam("mi", "");
  const lm = readParam("lm", "");
  const rp = readParam("rp", "");
  const lb = readParam("lb", "");
  const lp = readParam("lp", "");
  const ib = readParam("ib", "");
  const hasParams = [bn, aa, mi, lm, rp, lb, lp, ib].some((v) => v !== "");

  if (hasParams) {
    const set = (id, val) => { const el = $(id); if (el && val) el.value = val; };
    set("leaveBeforeNet",        bn);
    set("leaveAfterAnnual",      aa);
    set("leaveMonthlyIncome",    mi);
    set("leaveMonths",           lm);
    set("leaveRetirementPayout", rp);
    set("leaveBonus",            lb);
    set("leaveAnnualLeavePay",   lp);
    const ibEl = $("leaveIncludeBonus");
    if (ib !== "" && ibEl) ibEl.checked = ib !== "0";
  }
})();

renderLeave();
