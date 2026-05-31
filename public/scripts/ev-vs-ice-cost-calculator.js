// ─────────────────────────────────────────────────────────────────────────────
// 전기차 vs 내연기관 총비용 비교 계산기
// /tools/ev-vs-ice-cost-calculator/
// ─────────────────────────────────────────────────────────────────────────────

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

// ── 설정 로드 ────────────────────────────────────────────────────────────────
const configNode = document.getElementById("evcConfig");
if (!configNode) throw new Error("evcConfig missing");
const { defaultEv, defaultIce, defaultCommon, fuelPrices, presets, acquisitionTax, vehicleTax } =
  JSON.parse(configNode.textContent || "{}");

// ── 상태 ─────────────────────────────────────────────────────────────────────
const state = {
  ev: { ...defaultEv },
  ice: { ...defaultIce },
  common: { ...defaultCommon },
};

// ── 포맷 유틸 ────────────────────────────────────────────────────────────────
const nf = new Intl.NumberFormat("ko-KR");

function parseWon(str) {
  return Number(String(str || "0").replace(/[^\d]/g, "")) || 0;
}

function formatMan(val) {
  if (val === null || val === undefined) return "-";
  const n = Math.round(Number(val));
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 100_000_000) {
    const eok = Math.floor(abs / 100_000_000);
    const man = Math.floor((abs % 100_000_000) / 10_000);
    if (man > 0) return `${sign}${eok}억 ${nf.format(man)}만원`;
    return `${sign}${eok}억원`;
  }
  return `${sign}${nf.format(Math.floor(abs / 10_000))}만원`;
}

function formatDiff(val) {
  if (val === null || val === undefined) return "-";
  const n = Math.round(Number(val));
  if (n === 0) return "동일";
  const prefix = n > 0 ? "ICE +▲" : "EV +▼";
  return `${prefix} ${formatMan(Math.abs(n))}`;
}

// ── 계산 ─────────────────────────────────────────────────────────────────────

function calcEvAcquisitionTax(price) {
  const base = price * 0.07;
  return Math.max(base - acquisitionTax.evReductionMax, 0);
}

function calcIceAcquisitionTax(price) {
  return price * 0.07;
}

function calcIceVehicleTaxAnnual(cc) {
  const rate = cc <= 1600 ? vehicleTax.iceRatePerCC_below1600 : vehicleTax.iceRatePerCC_above1600;
  return Math.round(cc * rate * (1 + vehicleTax.educationTaxRate));
}

function getFuelPrice(fuelType) {
  const fp = fuelPrices.find((f) => f.type === fuelType);
  return fp ? fp.pricePerLiter : state.common.fuelPricePerLiter;
}

function calcEvAnnualFuel(ev, common) {
  const { annualMileageKm, slowChargingRatePerKwh, fastChargingRatePerKwh } = common;
  const { energyEfficiency, slowChargingRatio } = ev;
  if (!energyEfficiency) return 0;
  const kwhPerKm = 1 / energyEfficiency;
  const totalKwh = annualMileageKm * kwhPerKm;
  const slowCost = totalKwh * slowChargingRatio * slowChargingRatePerKwh;
  const fastCost = totalKwh * (1 - slowChargingRatio) * fastChargingRatePerKwh;
  return Math.round(slowCost + fastCost);
}

function calcIceAnnualFuel(ice, common) {
  const { annualMileageKm } = common;
  const { fuelEfficiency, fuelType } = ice;
  if (!fuelEfficiency) return 0;
  const pricePerL = fuelType === "gasoline"
    ? common.fuelPricePerLiter
    : fuelPrices.find((f) => f.type === fuelType)?.pricePerLiter ?? common.fuelPricePerLiter;
  return Math.round((annualMileageKm / fuelEfficiency) * pricePerL);
}

function calcBreakdown(ev, ice, common) {
  const years = common.comparisonYears;

  // EV
  const evEffPrice = ev.vehiclePrice - ev.nationalSubsidy - ev.localSubsidy;
  const evAcqTax = calcEvAcquisitionTax(ev.vehiclePrice);
  const evVehTax = vehicleTax.evFixedAmountWon * years;
  const evAnnualFuel = calcEvAnnualFuel(ev, common);
  const evTotalFuel = evAnnualFuel * years;
  const evTotalMaint = ev.annualMaintenanceCost * years;
  const evTotalInsur = ev.annualInsurance * years;
  const evTco = evEffPrice + evAcqTax + evVehTax + evTotalFuel + evTotalMaint + evTotalInsur;

  // ICE
  const iceEffPrice = ice.vehiclePrice;
  const iceAcqTax = calcIceAcquisitionTax(ice.vehiclePrice);
  const iceVehTaxAnnual = calcIceVehicleTaxAnnual(ice.engineDisplacementCC);
  const iceVehTax = iceVehTaxAnnual * years;
  const iceAnnualFuel = calcIceAnnualFuel(ice, common);
  const iceTotalFuel = iceAnnualFuel * years;
  const iceTotalMaint = ice.annualMaintenanceCost * years;
  const iceTotalInsur = ice.annualInsurance * years;
  const iceTco = iceEffPrice + iceAcqTax + iceVehTax + iceTotalFuel + iceTotalMaint + iceTotalInsur;

  return {
    ev: {
      effectiveVehiclePrice: evEffPrice,
      acquisitionTax: evAcqTax,
      totalVehicleTax: evVehTax,
      totalFuelCost: evTotalFuel,
      totalMaintenance: evTotalMaint,
      totalInsurance: evTotalInsur,
      tco: evTco,
      monthlyAvgCost: Math.round(evTco / years / 12),
      annualFuelCost: evAnnualFuel,
    },
    ice: {
      effectiveVehiclePrice: iceEffPrice,
      acquisitionTax: iceAcqTax,
      totalVehicleTax: iceVehTax,
      totalFuelCost: iceTotalFuel,
      totalMaintenance: iceTotalMaint,
      totalInsurance: iceTotalInsur,
      tco: iceTco,
      monthlyAvgCost: Math.round(iceTco / years / 12),
      annualFuelCost: iceAnnualFuel,
    },
    tcoDiff: iceTco - evTco,
    monthlyFuelDiff: Math.round((iceAnnualFuel - evAnnualFuel) / 12),
  };
}

function calcYearly(ev, ice, common, maxYears) {
  const result = [];
  for (let y = 1; y <= maxYears; y++) {
    const bd = calcBreakdown(ev, ice, { ...common, comparisonYears: y });
    result.push({ year: y, evCumulative: bd.ev.tco, iceCumulative: bd.ice.tco });
  }
  return result;
}

function findBreakeven(yearly) {
  for (let i = 0; i < yearly.length; i++) {
    const { year, evCumulative, iceCumulative } = yearly[i];
    if (evCumulative <= iceCumulative) {
      // 선형 보간 — 이전 연도와의 차이로 월 단위 근사
      if (i === 0) return { years: year, months: 0, withinRange: true };
      const prev = yearly[i - 1];
      const prevDiff = prev.iceCumulative - prev.evCumulative;
      const curDiff = iceCumulative - evCumulative;
      const ratio = prevDiff / (prevDiff - curDiff); // 0~1
      const months = Math.round(ratio * 12);
      return { years: year - 1, months, withinRange: true };
    }
  }
  return { years: null, months: null, withinRange: false };
}

// ── 렌더 ─────────────────────────────────────────────────────────────────────

function setText(id, text) {
  const el = $(id);
  if (el) el.textContent = text;
}

function renderKpi(bd, breakeven) {
  const years = state.common.comparisonYears;
  const tone = bd.tcoDiff > 50_000 ? "ev_better" : bd.tcoDiff < -50_000 ? "ice_better" : "neutral";

  setText("#evcYearsLabel", `${years}년`);
  setText("#evcBreakdownYearsLabel", `${years}년`);

  const mainCard = $(".evc-kpi-card--main");
  if (mainCard) {
    mainCard.classList.remove("evc-kpi-card--positive", "evc-kpi-card--caution");
    if (tone === "ev_better") mainCard.classList.add("evc-kpi-card--positive");
    else if (tone === "ice_better") mainCard.classList.add("evc-kpi-card--caution");
  }

  setText("#evcTcoDiff", formatMan(Math.abs(bd.tcoDiff)));
  const diffLabel = bd.tcoDiff > 0
    ? `전기차가 ${formatMan(bd.tcoDiff)} 저렴`
    : bd.tcoDiff < 0
    ? `내연기관이 ${formatMan(Math.abs(bd.tcoDiff))} 저렴`
    : "비용이 동일합니다";
  setText("#evcTcoDiffLabel", diffLabel);

  const monthlyDiff = bd.monthlyFuelDiff;
  setText("#evcMonthlyFuelDiff", `${monthlyDiff >= 0 ? "+" : ""}${formatMan(monthlyDiff)}`);

  if (breakeven.withinRange) {
    const breakevenText = breakeven.years === 0
      ? "처음부터 전기차 유리"
      : `${breakeven.years}년 ${breakeven.months > 0 ? breakeven.months + "개월" : ""} 후`;
    setText("#evcBreakeven", breakevenText);
    setText("#evcBreakevenSub", "이 시점부터 전기차가 경제적으로 유리");
  } else {
    setText("#evcBreakeven", `${years}년 내 미달`);
    setText("#evcBreakevenSub", "비교 기간을 늘리거나 조건을 조정하세요");
  }

  setText("#evcEffectivePrice", formatMan(bd.ev.effectiveVehiclePrice));
}

function renderBreakdown(bd) {
  const e = bd.ev;
  const i = bd.ice;

  setText("#bdEvPrice", formatMan(e.effectiveVehiclePrice));
  setText("#bdIcePrice", formatMan(i.effectiveVehiclePrice));
  setText("#bdPriceDiff", formatDiff(i.effectiveVehiclePrice - e.effectiveVehiclePrice));

  setText("#bdEvAcq", formatMan(e.acquisitionTax));
  setText("#bdIceAcq", formatMan(i.acquisitionTax));
  setText("#bdAcqDiff", formatDiff(i.acquisitionTax - e.acquisitionTax));

  setText("#bdEvVehTax", formatMan(e.totalVehicleTax));
  setText("#bdIceVehTax", formatMan(i.totalVehicleTax));
  setText("#bdVehTaxDiff", formatDiff(i.totalVehicleTax - e.totalVehicleTax));

  setText("#bdEvFuel", formatMan(e.totalFuelCost));
  setText("#bdIceFuel", formatMan(i.totalFuelCost));
  setText("#bdFuelDiff", formatDiff(i.totalFuelCost - e.totalFuelCost));

  setText("#bdEvMaint", formatMan(e.totalMaintenance));
  setText("#bdIceMaint", formatMan(i.totalMaintenance));
  setText("#bdMaintDiff", formatDiff(i.totalMaintenance - e.totalMaintenance));

  setText("#bdEvInsur", formatMan(e.totalInsurance));
  setText("#bdIceInsur", formatMan(i.totalInsurance));
  setText("#bdInsurDiff", formatDiff(i.totalInsurance - e.totalInsurance));

  setText("#bdEvTco", formatMan(e.tco));
  setText("#bdIceTco", formatMan(i.tco));

  const totalDiffEl = $("#bdTcoDiff");
  if (totalDiffEl) {
    const diff = i.tco - e.tco;
    totalDiffEl.textContent = diff > 0
      ? `EV 절약 ${formatMan(diff)}`
      : diff < 0
      ? `ICE 절약 ${formatMan(Math.abs(diff))}`
      : "동일";
    totalDiffEl.className = "evc-diff-cell evc-diff-cell--total";
    if (diff > 0) totalDiffEl.classList.add("evc-diff-cell--positive");
    else if (diff < 0) totalDiffEl.classList.add("evc-diff-cell--caution");
  }
}

// ── Chart.js 그래프 ───────────────────────────────────────────────────────────
let chart = null;

function renderChart(yearly, breakevenYear) {
  const ctx = $("#evcBreakevenChart");
  if (!ctx) return;

  const labels = yearly.map((d) => `${d.year}년`);
  const evData = yearly.map((d) => Math.round(d.evCumulative / 10_000));
  const iceData = yearly.map((d) => Math.round(d.iceCumulative / 10_000));

  if (chart) {
    chart.data.labels = labels;
    chart.data.datasets[0].data = evData;
    chart.data.datasets[1].data = iceData;
    chart.update();
    return;
  }

  if (!window.Chart) return;

  chart = new window.Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "⚡ 전기차 누적비용",
          data: evData,
          borderColor: "#2563eb",
          backgroundColor: "rgba(37,99,235,0.08)",
          borderWidth: 2.5,
          pointRadius: 4,
          tension: 0.3,
          fill: false,
        },
        {
          label: "🔥 내연기관 누적비용",
          data: iceData,
          borderColor: "#dc2626",
          backgroundColor: "rgba(220,38,38,0.06)",
          borderWidth: 2.5,
          pointRadius: 4,
          tension: 0.3,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { position: "top", labels: { font: { size: 12 }, boxWidth: 16 } },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString("ko-KR")}만원`,
          },
        },
      },
      scales: {
        y: {
          ticks: {
            callback: (v) => `${v.toLocaleString("ko-KR")}만`,
            font: { size: 11 },
          },
          grid: { color: "rgba(0,0,0,0.06)" },
        },
        x: { ticks: { font: { size: 11 } } },
      },
    },
  });
}

// ── 전체 업데이트 ─────────────────────────────────────────────────────────────
function update() {
  const bd = calcBreakdown(state.ev, state.ice, state.common);
  const maxChartYears = Math.max(state.common.comparisonYears, 10);
  const yearly = calcYearly(state.ev, state.ice, state.common, maxChartYears);
  const breakevenData = findBreakeven(yearly);
  renderKpi(bd, breakevenData);
  renderBreakdown(bd);
  renderChart(yearly, breakevenData.years);
  scheduleUrlWrite();
}

// ── 입력 헬퍼 ────────────────────────────────────────────────────────────────
function syncInputDisplay(inputEl, val, formatFn) {
  if (inputEl && document.activeElement !== inputEl) {
    inputEl.value = formatFn(val);
  }
}

function formatManDisplay(val) {
  const m = Math.round(val / 10_000);
  return `${nf.format(m)}만원`;
}

// ── 공통 설정 슬라이더 ────────────────────────────────────────────────────────
const mileageSlider = $("#evcMileageSlider");
const mileageInput = $("#evcMileageInput");
const mileageVal = $("#evcMileageVal");

function syncMileage(val) {
  const clamped = Math.max(3_000, Math.min(60_000, val));
  state.common.annualMileageKm = clamped;
  if (mileageSlider) mileageSlider.value = clamped;
  if (mileageVal) mileageVal.textContent = `${nf.format(clamped)}km`;
  if (mileageInput && document.activeElement !== mileageInput) {
    mileageInput.value = `${nf.format(clamped)}km`;
  }
  update();
}

if (mileageSlider) {
  mileageSlider.addEventListener("input", () => syncMileage(Number(mileageSlider.value)));
}
if (mileageInput) {
  mileageInput.addEventListener("change", () => {
    syncMileage(Number(mileageInput.value.replace(/[^\d]/g, "")));
  });
  mileageInput.addEventListener("focus", () => { mileageInput.value = state.common.annualMileageKm; });
  mileageInput.addEventListener("blur", () => { mileageInput.value = `${nf.format(state.common.annualMileageKm)}km`; });
}

const yearsSelect = $("#evcYearsSelect");
if (yearsSelect) {
  yearsSelect.addEventListener("change", () => {
    state.common.comparisonYears = Number(yearsSelect.value);
    update();
  });
}

// 단가 입력
["#evcSlowRateInput", "#evcFastRateInput", "#evcFuelPriceInput"].forEach((sel, i) => {
  const el = $(sel);
  if (!el) return;
  el.addEventListener("input", () => {
    const v = Number(el.value) || 0;
    if (i === 0) state.common.slowChargingRatePerKwh = v;
    else if (i === 1) state.common.fastChargingRatePerKwh = v;
    else state.common.fuelPricePerLiter = v;
    update();
  });
});

// ── EV 입력 ──────────────────────────────────────────────────────────────────
function bindWonInput(inputId, stateKey, obj) {
  const el = $(inputId);
  if (!el) return;
  el.addEventListener("change", () => {
    obj[stateKey] = parseWon(el.value);
    update();
  });
  el.addEventListener("focus", () => { el.value = obj[stateKey]; });
  el.addEventListener("blur", () => { el.value = formatManDisplay(obj[stateKey]); });
}

bindWonInput("#evcEvPrice", "vehiclePrice", state.ev);
bindWonInput("#evcEvNational", "nationalSubsidy", state.ev);
bindWonInput("#evcEvLocal", "localSubsidy", state.ev);
bindWonInput("#evcEvInsurance", "annualInsurance", state.ev);
bindWonInput("#evcEvMaintenance", "annualMaintenanceCost", state.ev);

const evEfficiencyInput = $("#evcEvEfficiency");
if (evEfficiencyInput) {
  evEfficiencyInput.addEventListener("input", () => {
    state.ev.energyEfficiency = Number(evEfficiencyInput.value) || 6;
    update();
  });
}

const evSlowRatioSlider = $("#evcEvSlowRatio");
const evSlowRatioVal = $("#evcEvSlowRatioVal");
if (evSlowRatioSlider) {
  evSlowRatioSlider.addEventListener("input", () => {
    const v = Number(evSlowRatioSlider.value) / 100;
    state.ev.slowChargingRatio = v;
    if (evSlowRatioVal) evSlowRatioVal.textContent = `${evSlowRatioSlider.value}%`;
    update();
  });
}

// ── ICE 입력 ─────────────────────────────────────────────────────────────────
bindWonInput("#evcIcePrice", "vehiclePrice", state.ice);
bindWonInput("#evcIceInsurance", "annualInsurance", state.ice);
bindWonInput("#evcIceMaintenance", "annualMaintenanceCost", state.ice);

const iceEfficiencyInput = $("#evcIceEfficiency");
if (iceEfficiencyInput) {
  iceEfficiencyInput.addEventListener("input", () => {
    state.ice.fuelEfficiency = Number(iceEfficiencyInput.value) || 13;
    update();
  });
}

const iceCCInput = $("#evcIceCC");
if (iceCCInput) {
  iceCCInput.addEventListener("input", () => {
    state.ice.engineDisplacementCC = Number(iceCCInput.value) || 2000;
    update();
  });
}

const iceFuelTypeSelect = $("#evcIceFuelType");
if (iceFuelTypeSelect) {
  iceFuelTypeSelect.addEventListener("change", () => {
    state.ice.fuelType = iceFuelTypeSelect.value;
    // 연료 단가 자동 동기화
    const fp = fuelPrices.find((f) => f.type === iceFuelTypeSelect.value);
    if (fp) {
      state.common.fuelPricePerLiter = fp.pricePerLiter;
      const fuelPriceInput = $("#evcFuelPriceInput");
      if (fuelPriceInput) fuelPriceInput.value = fp.pricePerLiter;
    }
    update();
  });
}

// ── 프리셋 ───────────────────────────────────────────────────────────────────
function applyPreset(presetId) {
  const preset = presets.find((p) => p.id === presetId);
  if (!preset) return;

  Object.assign(state.ev, preset.ev);
  Object.assign(state.ice, preset.ice);

  // ICE 연료 단가 동기화
  if (preset.ice.fuelType) {
    const fp = fuelPrices.find((f) => f.type === preset.ice.fuelType);
    if (fp) state.common.fuelPricePerLiter = fp.pricePerLiter;
  }

  // UI 반영
  syncAllInputsFromState();
  update();
}

function syncAllInputsFromState() {
  // EV 차량가·보조금
  [
    ["#evcEvPrice", state.ev.vehiclePrice],
    ["#evcEvNational", state.ev.nationalSubsidy],
    ["#evcEvLocal", state.ev.localSubsidy],
    ["#evcEvInsurance", state.ev.annualInsurance],
    ["#evcEvMaintenance", state.ev.annualMaintenanceCost],
  ].forEach(([sel, val]) => {
    const el = $(sel);
    if (el) el.value = formatManDisplay(val);
  });

  if (evEfficiencyInput) evEfficiencyInput.value = state.ev.energyEfficiency;
  if (evSlowRatioSlider) {
    evSlowRatioSlider.value = Math.round(state.ev.slowChargingRatio * 100);
    if (evSlowRatioVal) evSlowRatioVal.textContent = `${evSlowRatioSlider.value}%`;
  }

  // ICE
  [
    ["#evcIcePrice", state.ice.vehiclePrice],
    ["#evcIceInsurance", state.ice.annualInsurance],
    ["#evcIceMaintenance", state.ice.annualMaintenanceCost],
  ].forEach(([sel, val]) => {
    const el = $(sel);
    if (el) el.value = formatManDisplay(val);
  });

  if (iceEfficiencyInput) iceEfficiencyInput.value = state.ice.fuelEfficiency;
  if (iceCCInput) iceCCInput.value = state.ice.engineDisplacementCC;
  if (iceFuelTypeSelect) iceFuelTypeSelect.value = state.ice.fuelType;

  // 단가
  const slowInput = $("#evcSlowRateInput");
  const fastInput = $("#evcFastRateInput");
  const fuelInput = $("#evcFuelPriceInput");
  if (slowInput) slowInput.value = state.common.slowChargingRatePerKwh;
  if (fastInput) fastInput.value = state.common.fastChargingRatePerKwh;
  if (fuelInput) fuelInput.value = state.common.fuelPricePerLiter;
}

$$(".evc-preset-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    $$(".evc-preset-btn").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    applyPreset(btn.dataset.preset);
  });
});

// ── URL 파라미터 ─────────────────────────────────────────────────────────────
function readUrlParams() {
  try {
    const p = new URLSearchParams(window.location.search);
    if (p.get("evPrice")) state.ev.vehiclePrice = Number(p.get("evPrice"));
    if (p.get("evNat")) state.ev.nationalSubsidy = Number(p.get("evNat"));
    if (p.get("evLocal")) state.ev.localSubsidy = Number(p.get("evLocal"));
    if (p.get("icePrice")) state.ice.vehiclePrice = Number(p.get("icePrice"));
    if (p.get("mileage")) state.common.annualMileageKm = Number(p.get("mileage"));
    if (p.get("years")) {
      state.common.comparisonYears = Number(p.get("years"));
      if (yearsSelect) yearsSelect.value = p.get("years");
    }
    if (p.get("fuelType")) state.ice.fuelType = p.get("fuelType");
  } catch (_) {}
}

let urlTimer = null;
function scheduleUrlWrite() {
  clearTimeout(urlTimer);
  urlTimer = setTimeout(() => {
    try {
      const p = new URLSearchParams();
      p.set("evPrice", state.ev.vehiclePrice);
      p.set("evNat", state.ev.nationalSubsidy);
      p.set("evLocal", state.ev.localSubsidy);
      p.set("icePrice", state.ice.vehiclePrice);
      p.set("mileage", state.common.annualMileageKm);
      p.set("years", state.common.comparisonYears);
      p.set("fuelType", state.ice.fuelType);
      window.history.replaceState(null, "", `${window.location.pathname}?${p.toString()}`);
    } catch (_) {}
  }, 400);
}

// ── 리셋 ─────────────────────────────────────────────────────────────────────
const resetBtn = $("#evcResetBtn");
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    state.ev = { ...defaultEv };
    state.ice = { ...defaultIce };
    state.common = { ...defaultCommon };
    syncAllInputsFromState();
    syncMileage(state.common.annualMileageKm);
    $$(".evc-preset-btn").forEach((b) => b.classList.remove("is-active"));
    update();
  });
}

// ── 링크 복사 ────────────────────────────────────────────────────────────────
const copyBtn = $("#evcCopyBtn");
if (copyBtn) {
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch (_) {
      const ta = document.createElement("textarea");
      ta.value = window.location.href;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
  });
}

// ── 초기화 ───────────────────────────────────────────────────────────────────
readUrlParams();
syncAllInputsFromState();
syncMileage(state.common.annualMileageKm);

// Chart.js는 CDN <script> 태그로 블로킹 로드되므로 이 시점에 항상 존재
// 혹시 로드 실패 시 그래프 없이 나머지 기능은 정상 동작
update();
