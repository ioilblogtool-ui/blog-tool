/**
 * sk-hynix-bonus.js — SK하이닉스 성과급 계산기 (ES 모듈)
 * Chart.js 4.x UMD (window.Chart) 필요 — CDN <script> 먼저 로드 후 type="module".
 */
import { formatKRW, buildDefaultOptions, makeLabelPlugin } from "./chart-config.js";

const $ = (id) => document.getElementById(id);

const configNode = $("skHynixCompensationConfig");
if (!configNode) throw new Error("sk hynix compensation config is missing");

const {
  rankPresets, yearOptions, payoutModes, scenarioOptions,
  psMultipliersByYear, comparisonBenchmarks, welfareDefault,
  actualPsMultiplier, immediatePsRatio, deferredPsRatio, averageCompensation,
  futurePiRatioByYear,
} = JSON.parse(configNode.textContent || "{}");

const rankMap = Object.fromEntries(rankPresets.map((item) => [item.code, item]));
const scenarioMap = Object.fromEntries(scenarioOptions.map((item) => [item.code, item]));

const selfRankSelect = $("selfRankSelect");
const spouseRankSelect = $("spouseRankSelect");
const selfSalaryInput = $("selfSalaryInput");
const spouseSalaryInput = $("spouseSalaryInput");
const targetYearSelect = $("targetYearSelect");
const scenarioSelect = $("scenarioSelect");
const welfareInput = $("welfareInput");
const includePiToggle = $("includePiToggle");
const includeWelfareToggle = $("includeWelfareToggle");
const includeNetEstimateToggle = $("includeNetEstimateToggle");
const modeSingle = $("modeSingle");
const modeCouple = $("modeCouple");
const spouseBlock = $("spouseBlock");
const netPanel = $("netPanel");

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

function formatRatio(value) {
  return `${Number(value || 0).toFixed(2)}배`;
}

function setText(id, value) {
  const el = $(id);
  if (el) el.textContent = value;
}

function toNumber(input) {
  return Number(input?.value || 0);
}

function isChecked(input) {
  return !!(input?.checked);
}

function getMode() {
  return modeCouple?.checked ? "COUPLE" : "SINGLE";
}

function getPayoutMode() {
  return document.querySelector('input[name="payoutMode"]:checked')?.value || "ACTUAL";
}

function estimateNetFromAnnual(annual) {
  const monthlyGross = annual / 12;
  const mealNonTaxable = Math.min(200_000, monthlyGross * 0.04);
  const taxable = Math.max(0, monthlyGross - mealNonTaxable);
  const pension = Math.min(taxable * 0.045, 280_000);
  const health = taxable * 0.03545;
  const ltc = health * 0.1295;
  const employment = taxable * 0.009;
  const annualTaxable = Math.max(0, taxable * 12 - 1_500_000);

  let rate = 0.06;
  if (annualTaxable >= 140_000_000) rate = 0.24;
  else if (annualTaxable >= 100_000_000) rate = 0.20;
  else if (annualTaxable >= 70_000_000) rate = 0.17;
  else if (annualTaxable >= 50_000_000) rate = 0.14;
  else if (annualTaxable >= 30_000_000) rate = 0.10;

  const incomeTax = taxable * rate;
  const localTax = incomeTax * 0.1;
  const deductions = pension + health + ltc + employment + incomeTax + localTax;
  return { monthlyGross, monthlyNet: Math.max(0, monthlyGross - deductions) };
}

function syncSelfSalarySlider() {
  const val = Math.min(Math.max(Math.round(Number(selfSalaryInput?.value) || 0), 30_000_000), 300_000_000);
  const slider = $("selfSalarySlider");
  const valEl = $("selfSalarySliderVal");
  if (slider) slider.value = val;
  if (valEl) valEl.textContent = formatKoreanAmount(val);
}

function syncSpouseSalarySlider() {
  const val = Math.min(Math.max(Math.round(Number(spouseSalaryInput?.value) || 0), 30_000_000), 300_000_000);
  const slider = $("spouseSalarySlider");
  const valEl = $("spouseSalarySliderVal");
  if (slider) slider.value = val;
  if (valEl) valEl.textContent = formatKoreanAmount(val);
}

function syncRecommendedSalary(select, input, hintId) {
  const preset = rankMap[select.value] || rankPresets[0];
  input.value = String(preset.defaultSalary);
  setText(hintId, `추천 연봉 예시: ${formatKoreanAmount(preset.defaultSalary)}`);
}

function updateSalaryHint(select, hintId) {
  const preset = rankMap[select.value] || rankPresets[0];
  setText(hintId, `추천 연봉 예시: ${formatKoreanAmount(preset.defaultSalary)}`);
}

function getPsMultiplier(year, payoutMode, scenarioCode) {
  if (year === "2026" && payoutMode === "ACTUAL") return actualPsMultiplier;
  const mapping = psMultipliersByYear[year] || psMultipliersByYear["2026"];
  if (scenarioCode === "CONSERVATIVE") return mapping.conservative;
  if (scenarioCode === "AGGRESSIVE") return mapping.aggressive;
  return mapping.base;
}

function getPiRatio(year, scenarioCode) {
  const fixedRatio = futurePiRatioByYear?.[year];
  if (typeof fixedRatio === "number") return fixedRatio;
  return (scenarioMap[scenarioCode] || scenarioOptions[1]).piRatio;
}

function normalizeControls() {
  const year = targetYearSelect.value;
  const actualInput = $("payoutActual");
  const actualChip = $("payoutActualChip");
  if (actualInput && actualChip) {
    const disable = year !== "2026";
    actualInput.disabled = disable;
    actualChip.style.opacity = disable ? "0.38" : "1";
    actualChip.style.pointerEvents = disable ? "none" : "";
    if (disable && actualInput.checked) {
      const scenarioInput = $("payoutScenario");
      if (scenarioInput) scenarioInput.checked = true;
    }
  }

  const payoutMode = getPayoutMode();
  const payoutLabel = payoutModes.find((m) => m.code === payoutMode)?.description || "";
  setText("payoutModeHint", payoutLabel);

  const scenario = scenarioMap[scenarioSelect.value] || scenarioOptions[1];
  const piRatio = getPiRatio(year, scenario.code);
  const scenarioHint = year === "2026"
    ? `PI 프리셋 ${formatRatio(piRatio)} 기준`
    : `${year}년은 PI ${formatRatio(piRatio)} 고정, 시나리오는 PS 범위만 반영`;
  setText("scenarioHint", scenarioHint);

  const welfareLabel = getMode() === "COUPLE"
    ? `1인당 복지 ${formatKoreanAmount(toNumber(welfareInput))} / 부부 합산 ${formatKoreanAmount(toNumber(welfareInput) * 2)}`
    : `개인 복지 ${formatKoreanAmount(toNumber(welfareInput))}`;
  setText("welfareHint", welfareLabel);

  spouseBlock.hidden = getMode() !== "COUPLE";
}

function calculatePerson(annualSalary, year, payoutMode, scenarioCode, includePi, includeWelfare, welfareAmount) {
  const baseSalary = annualSalary / 20;
  const psMultiplier = getPsMultiplier(year, payoutMode, scenarioCode);
  const psAmount = baseSalary * psMultiplier;
  const piRatio = getPiRatio(year, scenarioCode);
  const piAmount = includePi ? baseSalary * piRatio : 0;
  const welfare = includeWelfare ? welfareAmount : 0;
  const totalComp = annualSalary + psAmount + piAmount + welfare;

  return {
    annualSalary,
    baseSalary,
    psAmount,
    psImmediate: psAmount * immediatePsRatio,
    psDeferred: psAmount * deferredPsRatio,
    piAmount,
    welfareAmount: welfare,
    totalComp,
    monthlyBase: annualSalary / 12,
    monthlyTotal: totalComp / 12,
  };
}

function aggregateResults() {
  const mode = getMode();
  const year = targetYearSelect.value;
  const payoutMode = getPayoutMode();
  const scenarioCode = scenarioSelect.value;
  const welfareAmount = toNumber(welfareInput);
  const includePi = isChecked(includePiToggle);
  const includeWelfare = isChecked(includeWelfareToggle);

  const self = calculatePerson(toNumber(selfSalaryInput), year, payoutMode, scenarioCode, includePi, includeWelfare, welfareAmount);
  const spouse = mode === "COUPLE"
    ? calculatePerson(toNumber(spouseSalaryInput), year, payoutMode, scenarioCode, includePi, includeWelfare, welfareAmount)
    : null;

  const add = (key) => self[key] + (spouse?.[key] ?? 0);
  const totals = {
    annualSalary: add("annualSalary"),
    baseSalary: add("baseSalary"),
    psAmount: add("psAmount"),
    psImmediate: add("psImmediate"),
    psDeferred: add("psDeferred"),
    piAmount: add("piAmount"),
    welfareAmount: add("welfareAmount"),
    totalComp: add("totalComp"),
    monthlyBase: add("monthlyBase"),
    monthlyTotal: add("monthlyTotal"),
  };

  return { mode, year, payoutMode, scenarioCode, totals };
}

let donutChart = null;
let _donutCenter = ["", "총보상"];

const skDonutPlugin = {
  id: "skHynixDonutCenter",
  afterDraw(chart) {
    const { ctx, chartArea: { width, height, left, top } } = chart;
    const cx = left + width / 2;
    const cy = top + height / 2;
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#172033";
    ctx.font = '600 15px "Pretendard", system-ui, sans-serif';
    ctx.fillText(_donutCenter[0], cx, cy - 9);
    ctx.fillStyle = "#888780";
    ctx.font = '400 10px "Pretendard", system-ui, sans-serif';
    ctx.fillText(_donutCenter[1], cx, cy + 9);
    ctx.restore();
  },
};

function renderDonutChart(totals) {
  const canvas = $("sk-hynix-donut-chart");
  if (!canvas || !window.Chart) return;

  _donutCenter = [formatKoreanAmount(totals.totalComp), "총보상"];
  const data = [totals.annualSalary, totals.psAmount, totals.piAmount, totals.welfareAmount].map((v) => Math.max(0, v));
  const labels = ["연봉", "PS", "PI", "복지"];
  const bgColors = ["rgba(148,163,184,0.75)", "rgba(15,110,86,0.88)", "rgba(186,117,23,0.75)", "rgba(59,130,246,0.65)"];
  const borderColors = ["rgba(148,163,184,1)", "rgba(15,110,86,1)", "rgba(186,117,23,1)", "rgba(59,130,246,1)"];
  const baseOpts = buildDefaultOptions();

  if (donutChart) {
    donutChart.data.datasets[0].data = data;
    donutChart.update("none");
    return;
  }

  donutChart = new window.Chart(canvas, {
    type: "doughnut",
    data: { labels, datasets: [{ data, backgroundColor: bgColors, borderColor: borderColors, borderWidth: 1.5, hoverOffset: 6 }] },
    options: {
      ...baseOpts,
      cutout: "62%",
      plugins: {
        ...baseOpts.plugins,
        legend: { display: true, position: "bottom", labels: { font: { size: 11 }, boxWidth: 12, padding: 10 } },
        tooltip: { ...baseOpts.plugins.tooltip, callbacks: { label: (c) => ` ${c.label}: ${formatKoreanAmount(c.raw)}` } },
      },
    },
    plugins: [skDonutPlugin],
  });
}

let rankChart = null;

function renderRankChart() {
  const canvas = $("sk-hynix-rank-chart");
  if (!canvas || !window.Chart) return;

  const year = targetYearSelect.value;
  const payoutMode = getPayoutMode();
  const scenarioCode = scenarioSelect.value;
  const includePi = isChecked(includePiToggle);
  const includeWelfare = isChecked(includeWelfareToggle);
  const welfareAmount = toNumber(welfareInput);
  const selfSalary = toNumber(selfSalaryInput);

  const rows = rankPresets.map((rank) => calculatePerson(rank.defaultSalary, year, payoutMode, scenarioCode, includePi, includeWelfare, welfareAmount));
  const labels = rankPresets.map((r) => r.label);
  const totals = rows.map((r) => r.totalComp);
  const bgColors = rankPresets.map((rank) =>
    Math.abs(rankMap[rank.code].defaultSalary - selfSalary) < 5_000_000
      ? "rgba(15,110,86,0.88)"
      : "rgba(148,163,184,0.60)"
  );
  const baseOpts = buildDefaultOptions();

  if (rankChart) {
    rankChart.data.labels = labels;
    rankChart.data.datasets[0].data = totals;
    rankChart.data.datasets[0].backgroundColor = bgColors;
    rankChart.update("none");
    return;
  }

  rankChart = new window.Chart(canvas, {
    type: "bar",
    data: { labels, datasets: [{ label: "총보상", data: totals, backgroundColor: bgColors, borderRadius: 6, borderSkipped: false }] },
    options: {
      ...baseOpts,
      indexAxis: "y",
      layout: { padding: { right: 84 } },
      scales: {
        x: { display: false, grid: { display: false } },
        y: { grid: { display: false }, ticks: { font: { size: 12, weight: "700" } } },
      },
      plugins: {
        ...baseOpts.plugins,
        legend: { display: false },
        tooltip: { ...baseOpts.plugins.tooltip, callbacks: { label: (c) => ` ${formatKoreanAmount(c.raw)}` } },
      },
    },
    plugins: [makeLabelPlugin(formatKoreanAmount)],
  });
}

let scenarioChart = null;

function renderScenarioChart(result) {
  const canvas = $("sk-hynix-scenario-chart");
  if (!canvas || !window.Chart) return;

  const { mode, payoutMode, scenarioCode } = result;
  const includePi = isChecked(includePiToggle);
  const includeWelfare = isChecked(includeWelfareToggle);
  const welfareAmount = toNumber(welfareInput);
  const selfAnnual = toNumber(selfSalaryInput);
  const spouseAnnual = mode === "COUPLE" ? toNumber(spouseSalaryInput) : 0;

  const yearData = yearOptions.map((y) => {
    const effectivePayoutMode = y.code === "2026" ? payoutMode : "SCENARIO";
    const self = calculatePerson(selfAnnual, y.code, effectivePayoutMode, scenarioCode, includePi, includeWelfare, welfareAmount);
    const spouse = mode === "COUPLE" ? calculatePerson(spouseAnnual, y.code, effectivePayoutMode, scenarioCode, includePi, includeWelfare, welfareAmount) : null;
    return {
      salary: self.annualSalary + (spouse?.annualSalary ?? 0),
      ps: self.psAmount + (spouse?.psAmount ?? 0),
      pi: self.piAmount + (spouse?.piAmount ?? 0),
      welfare: self.welfareAmount + (spouse?.welfareAmount ?? 0),
    };
  });

  const labels = yearOptions.map((y) => y.label);
  const salary = yearData.map((d) => d.salary);
  const ps = yearData.map((d) => d.ps);
  const pi = yearData.map((d) => d.pi);
  const welfare = yearData.map((d) => d.welfare);
  const baseOpts = buildDefaultOptions();

  if (scenarioChart) {
    scenarioChart.data.labels = labels;
    scenarioChart.data.datasets[0].data = salary;
    scenarioChart.data.datasets[1].data = ps;
    scenarioChart.data.datasets[2].data = pi;
    scenarioChart.data.datasets[3].data = welfare;
    scenarioChart.update("none");
    return;
  }

  scenarioChart = new window.Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [
        { label: "연봉", data: salary, backgroundColor: "rgba(148,163,184,0.72)", borderWidth: 0 },
        { label: "PS", data: ps, backgroundColor: "rgba(15,110,86,0.88)", borderWidth: 0 },
        { label: "PI", data: pi, backgroundColor: "rgba(186,117,23,0.75)", borderWidth: 0 },
        { label: "복지", data: welfare, backgroundColor: "rgba(59,130,246,0.62)", borderWidth: 0 },
      ],
    },
    options: {
      ...baseOpts,
      scales: {
        x: { stacked: true, grid: { display: false } },
        y: { stacked: true, ticks: { callback: (v) => formatKRW(v), font: { size: 10 } }, grid: { color: "rgba(0,0,0,0.05)" } },
      },
      plugins: {
        ...baseOpts.plugins,
        legend: { display: true, position: "top", labels: { font: { size: 11 }, boxWidth: 12, padding: 12 } },
        tooltip: { ...baseOpts.plugins.tooltip, callbacks: { label: (c) => ` ${c.dataset.label}: ${formatKoreanAmount(c.raw)}` } },
      },
    },
  });
}

function renderSummary(result) {
  const { mode, year, payoutMode, scenarioCode, totals } = result;
  const isCouple = mode === "COUPLE";
  const scenarioLabel = (scenarioMap[scenarioCode] || scenarioOptions[1]).label;
  const payoutLabel = year === "2026" && payoutMode === "ACTUAL" ? "2026 실제 지급 모드" : `${year} ${scenarioLabel} 시나리오`;
  const piNote = year === "2026"
    ? (isChecked(includePiToggle) ? `${scenarioLabel} PI` : "PI 미반영")
    : (isChecked(includePiToggle) ? `PI ${formatRatio(getPiRatio(year, scenarioCode))} 고정` : "PI 미반영");

  setText("resultHeadline", isCouple ? "부부 총보상 핵심 카드" : "개인 총보상 핵심 카드");
  setText("resultSubcopy", payoutLabel);
  setText("salaryCardLabel", isCouple ? "부부 연봉 합산" : "연봉");
  setText("salarySummary", formatKoreanAmount(totals.annualSalary));
  setText("salarySummaryNote", isCouple ? `1인당 평균 ${formatKoreanAmount(totals.annualSalary / 2)}` : `평균 직원 보수 ${formatKoreanAmount(averageCompensation)}`);
  setText("psSummary", formatKoreanAmount(totals.psAmount));
  setText("psSummaryNote", `즉시 ${formatKoreanAmount(totals.psImmediate)} / 이연 ${formatKoreanAmount(totals.psDeferred)}`);
  setText("piSummary", formatKoreanAmount(totals.piAmount));
  setText("piSummaryNote", piNote);
  setText("totalSummary", formatKoreanAmount(totals.totalComp));
  setText("totalSummaryNote", `기준급 ${formatKoreanAmount(totals.baseSalary)}`);
  setText("monthlySummary", formatKoreanAmount(totals.monthlyTotal));
  setText("monthlySummaryNote", isCouple ? `1인당 평균 ${formatKoreanAmount(totals.monthlyTotal / 2)}` : `월 기본 ${formatKoreanAmount(totals.monthlyBase)}`);
}

function renderSummaryReport(result) {
  const { mode, totals } = result;
  const rows = [
    [mode === "COUPLE" ? "부부 연봉 합산" : "연봉", formatWon(totals.annualSalary), false],
    ["기준급", formatWon(totals.baseSalary), false],
    ["PS 총액", formatWon(totals.psAmount), false],
    ["PS 즉시 지급", formatWon(totals.psImmediate), false],
    ["PS 이연 지급", formatWon(totals.psDeferred), false],
    ["PI 총액", formatWon(totals.piAmount), false],
    ["복지 합산", formatWon(totals.welfareAmount), false],
    [mode === "COUPLE" ? "부부 연 총보상" : "연 총보상", formatWon(totals.totalComp), true],
    ["월 기본 체감", formatWon(totals.monthlyBase), false],
    [mode === "COUPLE" ? "부부 월평균" : "월 총보상 체감", formatWon(totals.monthlyTotal), true],
    ["월 증가분", formatWon(totals.monthlyTotal - totals.monthlyBase), true],
  ];

  $("summaryReportList").innerHTML = rows.map(([label, value, hi]) =>
    `<div class="report-row${hi ? " is-highlight" : ""}">
       <span class="report-row__label">${label}</span>
       <strong class="report-row__value">${value}</strong>
     </div>`
  ).join("");
}

function renderNetReport(result) {
  const { mode, totals } = result;
  const enabled = isChecked(includeNetEstimateToggle);
  if (netPanel) netPanel.hidden = !enabled;
  if (!enabled) {
    $("netReportList").innerHTML = "";
    return;
  }

  const baseNet = estimateNetFromAnnual(totals.annualSalary);
  const totalNet = estimateNetFromAnnual(totals.totalComp);
  const rows = [
    [mode === "COUPLE" ? "부부 월 기본 실수령 추정" : "월 기본 실수령 추정", formatWon(baseNet.monthlyNet)],
    [mode === "COUPLE" ? "부부 월 총보상 실수령 추정" : "월 총보상 실수령 추정", formatWon(totalNet.monthlyNet)],
    [mode === "COUPLE" ? "1인당 평균 실수령 추정" : "월 실수령 증가분 추정", formatWon(mode === "COUPLE" ? totalNet.monthlyNet / 2 : totalNet.monthlyNet - baseNet.monthlyNet)],
    ["안내", "참고 추정치"],
  ];

  $("netReportList").innerHTML = rows.map(([label, value]) =>
    `<div class="report-row">
       <span class="report-row__label">${label}</span>
       <strong class="report-row__value">${value}</strong>
     </div>`
  ).join("");
}

function renderRankMatrix() {
  const year = targetYearSelect.value;
  const payoutMode = getPayoutMode();
  const scenarioCode = scenarioSelect.value;
  const includePi = isChecked(includePiToggle);
  const includeWelfare = isChecked(includeWelfareToggle);
  const welfareAmount = toNumber(welfareInput);

  $("rankMatrixList").innerHTML = rankPresets.map((rank) => {
    const row = calculatePerson(rank.defaultSalary, year, payoutMode, scenarioCode, includePi, includeWelfare, welfareAmount);
    return `
      <div class="matrix-row">
        <span class="matrix-row__cell matrix-row__cell--label">${rank.label}</span>
        <span class="matrix-row__cell">${formatKoreanAmount(rank.defaultSalary)}</span>
        <span class="matrix-row__cell">${formatKoreanAmount(row.psAmount)}</span>
        <span class="matrix-row__cell matrix-row__cell--strong">${formatKoreanAmount(row.totalComp)}</span>
        <span class="matrix-row__cell matrix-row__cell--strong">${formatKoreanAmount(row.monthlyTotal)}</span>
      </div>`;
  }).join("");
}

function renderScenarioYears(result) {
  const { mode, payoutMode, scenarioCode } = result;
  const includePi = isChecked(includePiToggle);
  const includeWelfare = isChecked(includeWelfareToggle);
  const welfareAmount = toNumber(welfareInput);
  const selfAnnual = toNumber(selfSalaryInput);
  const spouseAnnual = mode === "COUPLE" ? toNumber(spouseSalaryInput) : 0;

  $("scenarioYearGrid").innerHTML = yearOptions.map((yearItem) => {
    const effectivePayoutMode = yearItem.code === "2026" ? payoutMode : "SCENARIO";
    const self = calculatePerson(selfAnnual, yearItem.code, effectivePayoutMode, scenarioCode, includePi, includeWelfare, welfareAmount);
    const spouse = mode === "COUPLE" ? calculatePerson(spouseAnnual, yearItem.code, effectivePayoutMode, scenarioCode, includePi, includeWelfare, welfareAmount) : null;
    const total = self.totalComp + (spouse?.totalComp ?? 0);
    const psMulti = getPsMultiplier(yearItem.code, effectivePayoutMode, scenarioCode);
    const piRatio = getPiRatio(yearItem.code, scenarioCode);
    const note = yearItem.code === "2026" && effectivePayoutMode === "ACTUAL"
      ? `PS ${formatRatio(psMulti)} / 실제 지급`
      : `PS ${formatRatio(psMulti)} + PI ${formatRatio(piRatio)}`;

    return `
      <article class="scenario-year-card${targetYearSelect.value === yearItem.code ? " is-active" : ""}">
        <p>${yearItem.label}</p>
        <strong>${formatKoreanAmount(total)}</strong>
        <span>${note}</span>
      </article>`;
  }).join("");
}

function renderComparisons(result) {
  const annualTotal = result.totals.totalComp;
  $("comparisonGrid").innerHTML = comparisonBenchmarks.map((item) => {
    const gap = annualTotal - item.annualTotal;
    const toneClass = gap >= 0 ? "is-positive" : "is-muted";
    const gapCopy = gap >= 0 ? `${formatKoreanAmount(gap)} 높음` : `${formatKoreanAmount(Math.abs(gap))} 낮음`;
    return `
      <article class="comparison-card ${toneClass}">
        <p>${item.label}</p>
        <strong>${formatKoreanAmount(item.annualTotal)}</strong>
        <span>${item.note}</span>
        <em>${gapCopy}</em>
      </article>`;
  }).join("");
}

function render() {
  normalizeControls();
  syncSelfSalarySlider();
  if (getMode() === "COUPLE") syncSpouseSalarySlider();
  updateSalaryHint(selfRankSelect, "selfSalaryHint");
  updateSalaryHint(spouseRankSelect, "spouseSalaryHint");

  const result = aggregateResults();
  renderSummary(result);
  renderSummaryReport(result);
  renderNetReport(result);
  renderDonutChart(result.totals);
  renderRankMatrix();
  renderRankChart();
  renderScenarioYears(result);
  renderScenarioChart(result);
  renderComparisons(result);
}

function flashButton(button, label) {
  if (!button) return;
  const original = button.textContent;
  button.textContent = label;
  window.setTimeout(() => {
    button.textContent = original;
  }, 1600);
}

function resetPage() {
  modeSingle.checked = true;
  selfRankSelect.value = rankPresets[0].code;
  spouseRankSelect.value = rankPresets[1].code;
  syncRecommendedSalary(selfRankSelect, selfSalaryInput, "selfSalaryHint");
  syncRecommendedSalary(spouseRankSelect, spouseSalaryInput, "spouseSalaryHint");
  targetYearSelect.value = "2026";
  const actualInput = $("payoutActual");
  if (actualInput) {
    actualInput.checked = true;
    actualInput.disabled = false;
  }
  scenarioSelect.value = "BASE";
  welfareInput.value = String(welfareDefault);
  includePiToggle.checked = true;
  includeWelfareToggle.checked = true;
  includeNetEstimateToggle.checked = true;
  render();
}

function bindRankSalary(select, input, hintId, sliderSync) {
  select.addEventListener("change", () => {
    syncRecommendedSalary(select, input, hintId);
    sliderSync?.();
    render();
  });
  input.addEventListener("input", () => {
    updateSalaryHint(select, hintId);
    sliderSync?.();
    render();
  });
}

bindRankSalary(selfRankSelect, selfSalaryInput, "selfSalaryHint", syncSelfSalarySlider);
bindRankSalary(spouseRankSelect, spouseSalaryInput, "spouseSalaryHint", syncSpouseSalarySlider);

$("selfSalarySlider")?.addEventListener("input", () => {
  const slider = $("selfSalarySlider");
  const valEl = $("selfSalarySliderVal");
  if (selfSalaryInput && slider) selfSalaryInput.value = slider.value;
  if (valEl && slider) valEl.textContent = formatKoreanAmount(Number(slider.value));
  render();
});

$("spouseSalarySlider")?.addEventListener("input", () => {
  const slider = $("spouseSalarySlider");
  const valEl = $("spouseSalarySliderVal");
  if (spouseSalaryInput && slider) spouseSalaryInput.value = slider.value;
  if (valEl && slider) valEl.textContent = formatKoreanAmount(Number(slider.value));
  render();
});

[$("payoutActual"), $("payoutScenario")].forEach((el) => el?.addEventListener("change", render));

[targetYearSelect, scenarioSelect, welfareInput,
 includePiToggle, includeWelfareToggle, includeNetEstimateToggle,
 modeSingle, modeCouple].forEach((el) => {
  if (!el) return;
  const evt = (el.type === "checkbox" || el.type === "radio") ? "change" : "input";
  el.addEventListener(evt, render);
  if (evt !== "change") el.addEventListener("change", render);
});

$("calcSkBonusBtn")?.addEventListener("click", render);
$("resetSkBonusBtn")?.addEventListener("click", () => {
  resetPage();
  flashButton($("resetSkBonusBtn"), "초기화됨");
});
$("copySkBonusLinkBtn")?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    flashButton($("copySkBonusLinkBtn"), "링크 복사됨");
  } catch {
    flashButton($("copySkBonusLinkBtn"), "복사 실패");
  }
});

resetPage();

