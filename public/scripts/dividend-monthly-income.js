import { readParam, readBool, writeParams } from "./url-state.js";

const configEl = document.getElementById("dmiConfig");
const { DEFAULT_DIVIDEND_INPUT, DMI_PRESETS } = JSON.parse(configEl?.textContent || "{}");

// ── DOM refs ──────────────────────────────────────────────────────────────────
const modeTabs = document.querySelectorAll(".dmi-mode-tab");
const principalField = document.getElementById("dmiPrincipalField");
const targetField = document.getElementById("dmiTargetField");
const fields = {
  principal: document.getElementById("dmiPrincipal"),
  targetMonthly: document.getElementById("dmiTargetMonthly"),
  yield_: document.getElementById("dmiYield"),
  taxRate: document.getElementById("dmiTaxRate"),
  frequency: document.getElementById("dmiFrequency"),
  reinvest: document.getElementById("dmiReinvest"),
  monthlyContrib: document.getElementById("dmiMonthlyContrib"),
  dividendGrowth: document.getElementById("dmiDividendGrowth"),
  priceGrowth: document.getElementById("dmiPriceGrowth"),
  simYears: document.getElementById("dmiSimYears"),
};
const reinvestLabel = document.getElementById("dmiReinvestLabel");
const resetBtn = document.getElementById("dmiResetBtn");
const copyBtn = document.getElementById("dmiCopyLinkBtn");
const presetBtns = document.querySelectorAll(".dmi-preset-btn");

const out = {
  resultTitle: document.getElementById("dmiResultTitle"),
  mainLabel: document.getElementById("dmiMainLabel"),
  mainValue: document.getElementById("dmiMainValue"),
  mainNote: document.getElementById("dmiMainNote"),
  annualNet: document.getElementById("dmiAnnualNet"),
  taxAmount: document.getElementById("dmiTaxAmount"),
  taxRateLabel: document.getElementById("dmiTaxRateLabel"),
  taxNote: document.getElementById("dmiTaxNote"),
  perPayment: document.getElementById("dmiPerPayment"),
  freqLabel: document.getElementById("dmiFreqLabel"),
  principalHint: document.getElementById("dmiPrincipalHint"),
  freqTableBody: document.getElementById("dmiFreqTableBody"),
  sim10Label: document.getElementById("dmiSim10Label"),
  sim10Principal: document.getElementById("dmiSim10Principal"),
  sim10Monthly: document.getElementById("dmiSim10Monthly"),
  sim10Cumulative: document.getElementById("dmiSim10Cumulative"),
  sim20Label: document.getElementById("dmiSim20Label"),
  sim20Principal: document.getElementById("dmiSim20Principal"),
  sim20Monthly: document.getElementById("dmiSim20Monthly"),
  sim20Cumulative: document.getElementById("dmiSim20Cumulative"),
  warningSection: document.getElementById("dmiWarningSection"),
  warningList: document.getElementById("dmiWarningList"),
};

const FREQ_CONFIG = {
  monthly: { label: "월배당", paymentsPerYear: 12 },
  quarterly: { label: "분기배당", paymentsPerYear: 4 },
  semiannual: { label: "반기배당", paymentsPerYear: 2 },
  annual: { label: "연배당", paymentsPerYear: 1 },
};

// ── State ─────────────────────────────────────────────────────────────────────
const state = {
  mode: readParam("mode", DEFAULT_DIVIDEND_INPUT.mode),
  principal: parseInt(readParam("principal", DEFAULT_DIVIDEND_INPUT.principal), 10),
  targetMonthlyIncome: parseInt(readParam("target", DEFAULT_DIVIDEND_INPUT.targetMonthlyIncome), 10),
  annualDividendYield: parseFloat(readParam("yield", DEFAULT_DIVIDEND_INPUT.annualDividendYield)),
  taxRate: parseFloat(readParam("tax", DEFAULT_DIVIDEND_INPUT.taxRate)),
  frequency: readParam("freq", DEFAULT_DIVIDEND_INPUT.frequency),
  reinvestEnabled: readBool("reinvest", DEFAULT_DIVIDEND_INPUT.reinvestEnabled),
  monthlyContribution: parseInt(readParam("contrib", DEFAULT_DIVIDEND_INPUT.monthlyContribution), 10),
  dividendGrowthRate: parseFloat(readParam("divGrowth", DEFAULT_DIVIDEND_INPUT.dividendGrowthRate)),
  priceGrowthRate: parseFloat(readParam("priceGrowth", DEFAULT_DIVIDEND_INPUT.priceGrowthRate)),
  simulationYears: parseInt(readParam("years", DEFAULT_DIVIDEND_INPUT.simulationYears), 10),
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function parseMoney(raw) {
  return Math.max(0, parseInt(String(raw || "").replace(/[^\d]/g, ""), 10) || 0);
}

function formatMoney(raw) {
  return parseMoney(raw).toLocaleString("ko-KR");
}

function fmt(n) {
  if (n === null || n === undefined || isNaN(n)) return "-";
  return Math.round(n).toLocaleString("ko-KR") + "원";
}

function fmtCompact(n) {
  if (!n || isNaN(n)) return "-";
  if (n >= 1_0000_0000) return (n / 1_0000_0000).toFixed(1) + "억";
  if (n >= 10_000) return Math.round(n / 10_000) + "만원";
  return Math.round(n).toLocaleString("ko-KR") + "원";
}

// ── Calculation ───────────────────────────────────────────────────────────────
function calculate(s) {
  const yield_ = Math.max(0.001, s.annualDividendYield) / 100;
  const taxRate = Math.min(0.999, Math.max(0, s.taxRate)) / 100;

  let effectivePrincipal;
  let requiredPrincipal = null;

  if (s.mode === "targetIncome") {
    const grossTargetMonthly = s.targetMonthlyIncome / (1 - taxRate);
    requiredPrincipal = (grossTargetMonthly * 12) / yield_;
    effectivePrincipal = requiredPrincipal;
  } else {
    effectivePrincipal = s.principal;
  }

  const grossAnnual = effectivePrincipal * yield_;
  const taxAmount = grossAnnual * taxRate;
  const netAnnual = grossAnnual - taxAmount;
  const netMonthly = netAnnual / 12;

  const freqResults = Object.entries(FREQ_CONFIG).map(([key, cfg]) => ({
    key,
    label: cfg.label,
    paymentsPerYear: cfg.paymentsPerYear,
    grossPerPayment: grossAnnual / cfg.paymentsPerYear,
    netPerPayment: netAnnual / cfg.paymentsPerYear,
  }));

  const snapshots = runSimulation(effectivePrincipal, s, yield_, taxRate);
  const mid = Math.min(10, s.simulationYears);
  const end = s.simulationYears;
  const snapMid = snapshots[mid] || snapshots[snapshots.length - 1];
  const snapEnd = snapshots[end] || snapshots[snapshots.length - 1];

  const warnings = [];
  if (s.annualDividendYield >= 10) {
    warnings.push("배당수익률 10% 이상은 원금 변동·배당 삭감 위험이 높습니다.");
  } else if (s.annualDividendYield >= 7) {
    warnings.push("고배당 주의: 분배금 감소 또는 ETF 가격 하락 위험이 있을 수 있습니다.");
  }
  if (requiredPrincipal !== null && requiredPrincipal >= 500_000_000) {
    warnings.push("목표 달성에 5억 원 이상이 필요합니다. 목표 금액이나 수익률을 조정해보세요.");
  }

  return {
    effectivePrincipal,
    requiredPrincipal,
    grossAnnual,
    taxAmount,
    netAnnual,
    netMonthly,
    freqResults,
    snapshots,
    snapMid,
    snapEnd,
    warnings,
    midYear: mid,
    endYear: end,
  };
}

function runSimulation(initialPrincipal, s, monthlyYieldBase, taxRate) {
  const monthlyYield = monthlyYieldBase / 12;
  const monthlyPriceGrowth = s.priceGrowthRate / 100 / 12;
  const monthlyDivGrowth = s.dividendGrowthRate / 100 / 12;

  let principal = initialPrincipal;
  let currentMonthlyYield = monthlyYield;
  let cumulativeNet = 0;

  const snapshots = [];
  snapshots.push({
    year: 0,
    principal,
    monthlyNetDividend: principal * currentMonthlyYield * (1 - taxRate),
    cumulativeNet: 0,
  });

  const totalMonths = s.simulationYears * 12;
  for (let m = 1; m <= totalMonths; m++) {
    const grossDiv = principal * currentMonthlyYield;
    const netDiv = grossDiv * (1 - taxRate);
    cumulativeNet += netDiv;

    principal = principal * (1 + monthlyPriceGrowth) + s.monthlyContribution;
    if (s.reinvestEnabled) principal += netDiv;

    currentMonthlyYield *= 1 + monthlyDivGrowth;

    if (m % 12 === 0) {
      snapshots.push({
        year: m / 12,
        principal,
        monthlyNetDividend: principal * currentMonthlyYield * (1 - taxRate),
        cumulativeNet,
      });
    }
  }
  return snapshots;
}

// ── Chart ─────────────────────────────────────────────────────────────────────
let chart = null;

function buildChart(snapshots) {
  const canvas = document.getElementById("dmiSimChart");
  if (!canvas || typeof Chart === "undefined") return;

  const labels = snapshots.map((s) => `${s.year}년`);
  const monthlyData = snapshots.map((s) => Math.round(s.monthlyNetDividend));

  if (chart) chart.destroy();
  chart = new Chart(canvas, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "세후 월 배당금 (추정)",
          data: monthlyData,
          borderColor: "#1a56db",
          backgroundColor: "rgba(26,86,219,0.08)",
          fill: true,
          tension: 0.3,
          pointRadius: snapshots.length <= 11 ? 4 : 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `세후 월 배당: ${ctx.raw.toLocaleString("ko-KR")}원`,
          },
        },
      },
      scales: {
        y: {
          ticks: {
            callback: (v) => {
              if (v >= 10_000_000) return (v / 10_000_000).toFixed(0) + "천만";
              if (v >= 1_000_000) return (v / 10_000).toFixed(0) + "만";
              return v.toLocaleString("ko-KR");
            },
          },
        },
      },
    },
  });
}

// ── Render ────────────────────────────────────────────────────────────────────
function render(result) {
  const s = state;

  // mode-specific main card
  if (s.mode === "targetIncome") {
    out.resultTitle.textContent = "목표 월 배당 달성에 필요한 원금";
    out.mainLabel.textContent = "필요 투자 원금";
    out.mainValue.textContent = fmt(result.requiredPrincipal);
    out.mainNote.textContent = `세후 월 ${fmt(s.targetMonthlyIncome)} 달성 기준 추정`;
  } else {
    out.resultTitle.textContent = "세후 월 배당금 추정";
    out.mainLabel.textContent = "세후 월 배당금";
    out.mainValue.textContent = fmt(result.netMonthly);
    out.mainNote.textContent = `세전 월 ${fmt(result.grossAnnual / 12)} 기준`;
  }

  out.annualNet.textContent = fmt(result.netAnnual);
  out.taxAmount.textContent = fmt(result.taxAmount);
  out.taxRateLabel.textContent = s.taxRate;

  // 1회 수령액 (선택한 주기 기준)
  const freqEntry = result.freqResults.find((r) => r.key === s.frequency);
  if (freqEntry) {
    out.perPayment.textContent = fmt(freqEntry.netPerPayment);
    out.freqLabel.textContent = `${freqEntry.label} 기준`;
  }

  // 투자 원금 힌트
  if (s.mode === "principal") {
    out.principalHint.textContent = fmtCompact(s.principal);
  }

  // 주기별 표
  out.freqTableBody.querySelectorAll("tr").forEach((row) => {
    const key = row.dataset.freq;
    const entry = result.freqResults.find((r) => r.key === key);
    if (!entry) return;
    row.querySelector(".dmi-freq-gross").textContent = fmt(entry.grossPerPayment);
    row.querySelector(".dmi-freq-net").textContent = fmt(entry.netPerPayment);
    row.classList.toggle("dmi-freq-row--active", key === s.frequency);
  });

  // 시뮬레이션
  const mid = result.snapMid;
  const end = result.snapEnd;
  out.sim10Label.textContent = `${result.midYear}년 후`;
  out.sim10Principal.textContent = fmt(mid.principal);
  out.sim10Monthly.textContent = fmt(mid.monthlyNetDividend);
  out.sim10Cumulative.textContent = fmtCompact(mid.cumulativeNet);
  out.sim20Label.textContent = `${result.endYear}년 후`;
  out.sim20Principal.textContent = fmt(end.principal);
  out.sim20Monthly.textContent = fmt(end.monthlyNetDividend);
  out.sim20Cumulative.textContent = fmtCompact(end.cumulativeNet);

  // 차트
  buildChart(result.snapshots);

  // 경고
  if (result.warnings.length > 0) {
    out.warningSection.style.display = "";
    out.warningList.innerHTML = result.warnings.map((w) => `<li>${w}</li>`).join("");
  } else {
    out.warningSection.style.display = "none";
  }
}

// ── Mode switching ────────────────────────────────────────────────────────────
function applyMode(mode) {
  state.mode = mode;
  modeTabs.forEach((btn) => btn.classList.toggle("is-active", btn.dataset.mode === mode));
  principalField.style.display = mode === "principal" ? "" : "none";
  targetField.style.display = mode === "targetIncome" ? "" : "none";
}

// ── URL sync ──────────────────────────────────────────────────────────────────
function syncUrl() {
  writeParams({
    mode: state.mode,
    principal: state.principal,
    target: state.targetMonthlyIncome,
    yield: state.annualDividendYield,
    tax: state.taxRate,
    freq: state.frequency,
    reinvest: state.reinvestEnabled ? "1" : "0",
    contrib: state.monthlyContribution,
    divGrowth: state.dividendGrowthRate,
    priceGrowth: state.priceGrowthRate,
    years: state.simulationYears,
  });
}

// ── Recalculate ───────────────────────────────────────────────────────────────
function recalc() {
  const result = calculate(state);
  render(result);
  syncUrl();
}

// ── Init DOM from state ───────────────────────────────────────────────────────
function initDomFromState() {
  fields.principal.value = state.principal.toLocaleString("ko-KR");
  fields.targetMonthly.value = state.targetMonthlyIncome.toLocaleString("ko-KR");
  fields.yield_.value = state.annualDividendYield;
  fields.taxRate.value = state.taxRate;
  fields.frequency.value = state.frequency;
  fields.reinvest.checked = state.reinvestEnabled;
  reinvestLabel.textContent = state.reinvestEnabled ? "켜짐" : "꺼짐";
  fields.monthlyContrib.value = state.monthlyContribution.toLocaleString("ko-KR");
  fields.dividendGrowth.value = state.dividendGrowthRate;
  fields.priceGrowth.value = state.priceGrowthRate;
  fields.simYears.value = state.simulationYears;
  applyMode(state.mode);
}

// ── Reset ─────────────────────────────────────────────────────────────────────
function resetAll() {
  Object.assign(state, {
    mode: DEFAULT_DIVIDEND_INPUT.mode,
    principal: DEFAULT_DIVIDEND_INPUT.principal,
    targetMonthlyIncome: DEFAULT_DIVIDEND_INPUT.targetMonthlyIncome,
    annualDividendYield: DEFAULT_DIVIDEND_INPUT.annualDividendYield,
    taxRate: DEFAULT_DIVIDEND_INPUT.taxRate,
    frequency: DEFAULT_DIVIDEND_INPUT.frequency,
    reinvestEnabled: DEFAULT_DIVIDEND_INPUT.reinvestEnabled,
    monthlyContribution: DEFAULT_DIVIDEND_INPUT.monthlyContribution,
    dividendGrowthRate: DEFAULT_DIVIDEND_INPUT.dividendGrowthRate,
    priceGrowthRate: DEFAULT_DIVIDEND_INPUT.priceGrowthRate,
    simulationYears: DEFAULT_DIVIDEND_INPUT.simulationYears,
  });
  initDomFromState();
  presetBtns.forEach((b, i) => b.classList.toggle("is-active", i === 0));
  recalc();
}

// ── Event listeners ───────────────────────────────────────────────────────────
modeTabs.forEach((btn) => {
  btn.addEventListener("click", () => {
    applyMode(btn.dataset.mode);
    recalc();
  });
});

// money inputs
[fields.principal, fields.targetMonthly, fields.monthlyContrib].forEach((el) => {
  if (!el) return;
  el.addEventListener("input", () => {
    const raw = parseMoney(el.value);
    el.value = raw.toLocaleString("ko-KR");
    if (el === fields.principal) state.principal = raw;
    else if (el === fields.targetMonthly) state.targetMonthlyIncome = raw;
    else state.monthlyContribution = raw;
    recalc();
  });
  el.addEventListener("focus", () => {
    el.value = parseMoney(el.value) || "";
  });
  el.addEventListener("blur", () => {
    el.value = parseMoney(el.value).toLocaleString("ko-KR");
  });
});

fields.yield_.addEventListener("input", () => {
  state.annualDividendYield = parseFloat(fields.yield_.value) || 0;
  recalc();
});

fields.taxRate.addEventListener("input", () => {
  state.taxRate = parseFloat(fields.taxRate.value) || 0;
  recalc();
});

fields.frequency.addEventListener("change", () => {
  state.frequency = fields.frequency.value;
  recalc();
});

fields.reinvest.addEventListener("change", () => {
  state.reinvestEnabled = fields.reinvest.checked;
  reinvestLabel.textContent = state.reinvestEnabled ? "켜짐" : "꺼짐";
  recalc();
});

fields.dividendGrowth.addEventListener("input", () => {
  state.dividendGrowthRate = parseFloat(fields.dividendGrowth.value) || 0;
  recalc();
});

fields.priceGrowth.addEventListener("input", () => {
  state.priceGrowthRate = parseFloat(fields.priceGrowth.value) || 0;
  recalc();
});

fields.simYears.addEventListener("change", () => {
  state.simulationYears = parseInt(fields.simYears.value, 10);
  recalc();
});

// presets
presetBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const preset = DMI_PRESETS.find((p) => p.id === btn.dataset.presetId);
    if (!preset) return;
    Object.assign(state, preset.input);
    initDomFromState();
    presetBtns.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    recalc();
  });
});

// reset
if (resetBtn) {
  resetBtn.addEventListener("click", resetAll);
}

// copy link
if (copyBtn) {
  copyBtn.addEventListener("click", () => {
    syncUrl();
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    copyBtn.textContent = "복사됨!";
    setTimeout(() => {
      copyBtn.textContent = "링크 복사";
    }, 2000);
  });
}

// ── Boot ──────────────────────────────────────────────────────────────────────
initDomFromState();
recalc();
