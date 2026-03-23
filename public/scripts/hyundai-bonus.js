/**
 * hyundai-bonus.js — 현대자동차 성과금 계산기 (ES 모듈)
 * Chart.js 4.x UMD (window.Chart) 필요 — CDN <script> 먼저 로드 후 type="module".
 */
import { formatKRW, buildDefaultOptions, makeLabelPlugin } from "./chart-config.js";

const $ = (id) => document.getElementById(id);

const configNode = $("hyundaiCompensationConfig");

if (!configNode) {
  throw new Error("hyundai compensation config is missing");
}

const {
  rankPresets,
  yearOptions,
  packageModes,
  scenarioPresets,
  comparisonCards,
  defaultBenefits,
  defaultStockPrice,
  actualBonusMultiplier,
  actualFixedCash,
  actualStockShares,
  actualGiftValue
} = JSON.parse(configNode.textContent || "{}");

const rankMap = Object.fromEntries(rankPresets.map((item) => [item.code, item]));
const scenarioMap = Object.fromEntries(scenarioPresets.map((item) => [item.code, item]));
const packageModeMap = Object.fromEntries(packageModes.map((item) => [item.code, item]));

const selfRankSelect = $("selfRankSelect");
const spouseRankSelect = $("spouseRankSelect");
const selfSalaryInput = $("selfSalaryInput");
const spouseSalaryInput = $("spouseSalaryInput");
const selfMonthlyBaseInput = $("selfMonthlyBaseInput");
const spouseMonthlyBaseInput = $("spouseMonthlyBaseInput");
const targetYearSelect = $("targetYearSelect");
const scenarioSelect = $("scenarioSelect");
const stockPriceInput = $("stockPriceInput");
const benefitsInput = $("benefitsInput");
const includeBonusToggle = $("includeBonusToggle");
const includeStockToggle = $("includeStockToggle");
const includeBenefitsToggle = $("includeBenefitsToggle");
const bonusMultiplierInput = $("bonusMultiplierInput");
const fixedCashInput = $("fixedCashInput");
const stockSharesInput = $("stockSharesInput");
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
  const eok = Math.floor(amount / 100000000);
  const man = Math.floor((amount % 100000000) / 10000);
  if (eok > 0 && man > 0) return `${eok}억 ${new Intl.NumberFormat("ko-KR").format(man)}만원`;
  if (eok > 0) return `${eok}억원`;
  return `${new Intl.NumberFormat("ko-KR").format(man)}만원`;
}

function setText(id, value) {
  const element = $(id);
  if (element) element.textContent = value;
}

function toNumber(input) {
  return Number(input && input.value ? input.value : 0);
}

function isChecked(input) {
  return !!(input && input.checked);
}

function estimateNetFromAnnual(annual) {
  const monthlyGross = annual / 12;
  const mealNonTaxable = Math.min(200000, monthlyGross * 0.04);
  const taxableMonthly = Math.max(0, monthlyGross - mealNonTaxable);
  const pension = Math.min(taxableMonthly * 0.045, 280000);
  const health = taxableMonthly * 0.03545;
  const longTermCare = health * 0.1295;
  const employment = taxableMonthly * 0.009;
  const annualTaxableApprox = Math.max(0, taxableMonthly * 12 - 1500000);

  let incomeTaxRate = 0.06;
  if (annualTaxableApprox >= 30000000 && annualTaxableApprox < 50000000) incomeTaxRate = 0.1;
  else if (annualTaxableApprox >= 50000000 && annualTaxableApprox < 70000000) incomeTaxRate = 0.14;
  else if (annualTaxableApprox >= 70000000 && annualTaxableApprox < 100000000) incomeTaxRate = 0.17;
  else if (annualTaxableApprox >= 100000000 && annualTaxableApprox < 140000000) incomeTaxRate = 0.2;
  else if (annualTaxableApprox >= 140000000) incomeTaxRate = 0.24;

  const incomeTax = taxableMonthly * incomeTaxRate;
  const localIncomeTax = incomeTax * 0.1;
  const deductions = pension + health + longTermCare + employment + incomeTax + localIncomeTax;
  return Math.max(0, monthlyGross - deductions);
}

function getMode() {
  return modeCouple.checked ? "COUPLE" : "SINGLE";
}

function getPackageMode() {
  return document.querySelector('input[name="packageMode"]:checked')?.value || "ACTUAL";
}

function syncRecommendedValues(select, salaryInput, salaryHintId, monthlyInput, monthlyHintId) {
  const preset = rankMap[select.value] || rankPresets[0];
  salaryInput.value = String(preset.defaultSalary);
  monthlyInput.value = String(preset.defaultMonthlyBase);
  setText(salaryHintId, `추천 연봉 예시: ${formatKoreanAmount(preset.defaultSalary)}`);
  setText(monthlyHintId, `추천 월 기본급 예시: ${formatKoreanAmount(preset.defaultMonthlyBase)}`);
}

function syncSelfSalarySlider() {
  const val = Math.min(Math.max(Math.round(Number(selfSalaryInput?.value) || 0), 20_000_000), 300_000_000);
  const slider = $("selfSalarySlider");
  const valEl  = $("selfSalarySliderVal");
  if (slider) slider.value = val;
  if (valEl)  valEl.textContent = formatKoreanAmount(val);
}
function syncSpouseSalarySlider() {
  const val = Math.min(Math.max(Math.round(Number(spouseSalaryInput?.value) || 0), 20_000_000), 300_000_000);
  const slider = $("spouseSalarySlider");
  const valEl  = $("spouseSalarySliderVal");
  if (slider) slider.value = val;
  if (valEl)  valEl.textContent = formatKoreanAmount(val);
}

function updateHints() {
  const selfPreset = rankMap[selfRankSelect.value] || rankPresets[0];
  const spousePreset = rankMap[spouseRankSelect.value] || rankPresets[1] || rankPresets[0];
  const mode = getMode();
  const scenario = scenarioMap[scenarioSelect.value] || scenarioPresets[1];
  const packageMode = packageModeMap[getPackageMode()] || packageModes[0];
  const stockPrice = toNumber(stockPriceInput);
  const benefits = toNumber(benefitsInput);

  setText("selfSalaryHint", `추천 연봉 예시: ${formatKoreanAmount(selfPreset.defaultSalary)}`);
  setText("spouseSalaryHint", `추천 연봉 예시: ${formatKoreanAmount(spousePreset.defaultSalary)}`);
  setText("selfMonthlyBaseHint", `추천 월 기본급 예시: ${formatKoreanAmount(selfPreset.defaultMonthlyBase)}`);
  setText("spouseMonthlyBaseHint", `추천 월 기본급 예시: ${formatKoreanAmount(spousePreset.defaultMonthlyBase)}`);
  setText("packageModeHint", packageMode.description);
  setText("scenarioHint", `성과금 ${scenario.bonusMultiplier.toFixed(1)}배 / 정액 ${formatKoreanAmount(scenario.fixedCash)} / 자사주 ${scenario.stockShares}주`);
  setText("stockPriceHint", `현재 입력 기준 1주 ${formatWon(stockPrice)}`);
  setText("benefitsHint", mode === "COUPLE" ? `1인당 ${formatKoreanAmount(benefits)} / 부부 합산 ${formatKoreanAmount(benefits * 2)}` : `개인 복지 ${formatKoreanAmount(benefits)}`);
}

function normalizeControls() {
  spouseBlock.hidden = getMode() !== "COUPLE";

  const actualInput = document.querySelector('input[name="packageMode"][value="ACTUAL"]');
  const scenarioInput = document.querySelector('input[name="packageMode"][value="SCENARIO"]');
  const actualChip  = $("packageActualChip");
  const disable = targetYearSelect.value !== "2026";
  if (actualInput) actualInput.disabled = disable;
  if (actualChip) {
    actualChip.style.opacity = disable ? "0.38" : "1";
    actualChip.style.pointerEvents = disable ? "none" : "";
  }
  if (disable && actualInput?.checked && scenarioInput) {
    scenarioInput.checked = true;
  }

  if (targetYearSelect.value === "2026" && getPackageMode() === "ACTUAL") {
    if (document.activeElement !== bonusMultiplierInput) bonusMultiplierInput.value = String(actualBonusMultiplier);
    if (document.activeElement !== fixedCashInput) fixedCashInput.value = String(actualFixedCash);
    if (document.activeElement !== stockSharesInput) stockSharesInput.value = String(actualStockShares);
  } else {
    const preset = scenarioMap[scenarioSelect.value] || scenarioPresets[1];
    if (document.activeElement !== bonusMultiplierInput) bonusMultiplierInput.value = String(preset.bonusMultiplier);
    if (document.activeElement !== fixedCashInput) fixedCashInput.value = String(preset.fixedCash);
    if (document.activeElement !== stockSharesInput) stockSharesInput.value = String(preset.stockShares);
  }

  updateHints();
}

function calculatePerson(annualSalary, monthlyBaseWage) {
  const bonusMultiplier = toNumber(bonusMultiplierInput);
  const fixedCash = toNumber(fixedCashInput);
  const stockShares = toNumber(stockSharesInput);
  const stockPrice = toNumber(stockPriceInput);
  const bonus = isChecked(includeBonusToggle) ? monthlyBaseWage * bonusMultiplier : 0;
  const cash = isChecked(includeBonusToggle) ? fixedCash : 0;
  const giftValue = isChecked(includeBonusToggle) ? actualGiftValue : 0;
  const stockValue = isChecked(includeStockToggle) ? stockPrice * stockShares : 0;
  const benefitsAmount = isChecked(includeBenefitsToggle) ? toNumber(benefitsInput) : 0;
  const totalComp = annualSalary + bonus + cash + stockValue + giftValue + benefitsAmount;

  return {
    annualSalary,
    monthlyBaseWage,
    bonusMultiplier,
    bonus,
    cash,
    giftValue,
    stockShares,
    stockValue,
    benefitsAmount,
    totalComp,
    monthlyBase: annualSalary / 12,
    monthlyCompView: totalComp / 12,
    monthlyBonusLift: (totalComp - annualSalary) / 12
  };
}

function aggregateResults() {
  const mode = getMode();
  const self = calculatePerson(toNumber(selfSalaryInput), toNumber(selfMonthlyBaseInput));
  const spouse = mode === "COUPLE" ? calculatePerson(toNumber(spouseSalaryInput), toNumber(spouseMonthlyBaseInput)) : null;

  const totals = {
    annualSalary: self.annualSalary + (spouse ? spouse.annualSalary : 0),
    monthlyBaseWage: self.monthlyBaseWage + (spouse ? spouse.monthlyBaseWage : 0),
    bonus: self.bonus + (spouse ? spouse.bonus : 0),
    cash: self.cash + (spouse ? spouse.cash : 0),
    giftValue: self.giftValue + (spouse ? spouse.giftValue : 0),
    stockValue: self.stockValue + (spouse ? spouse.stockValue : 0),
    benefitsAmount: self.benefitsAmount + (spouse ? spouse.benefitsAmount : 0),
    totalComp: self.totalComp + (spouse ? spouse.totalComp : 0),
    monthlyBase: self.monthlyBase + (spouse ? spouse.monthlyBase : 0),
    monthlyCompView: self.monthlyCompView + (spouse ? spouse.monthlyCompView : 0),
    monthlyBonusLift: self.monthlyBonusLift + (spouse ? spouse.monthlyBonusLift : 0)
  };

  return { mode, self, spouse, totals };
}

function renderSummary(result) {
  const isCouple = result.mode === "COUPLE";
  const scenario = scenarioMap[scenarioSelect.value] || scenarioPresets[1];
  const subtitle = targetYearSelect.value === "2026" && getPackageMode() === "ACTUAL"
    ? "2026 실제 패키지 기준"
    : `${targetYearSelect.value} ${scenarioMap[scenarioSelect.value]?.label || ""} 시나리오`;

  setText("resultHeadline", isCouple ? "부부 총보상 핵심 카드" : "개인 총보상 핵심 카드");
  setText("resultSubcopy", subtitle);
  setText("salaryCardLabel", isCouple ? "부부 연봉 합산" : "연봉");
  setText("salarySummary", formatKoreanAmount(result.totals.annualSalary));
  setText("salarySummaryNote", isCouple ? `1인당 평균 ${formatKoreanAmount(result.totals.annualSalary / 2)}` : `월 기본급 ${formatKoreanAmount(result.self.monthlyBaseWage)}`);
  setText("bonusSummary", formatKoreanAmount(result.totals.bonus));
  setText("bonusSummaryNote", `${toNumber(bonusMultiplierInput).toFixed(1)}배 기준`);
  setText("fixedCashSummary", formatKoreanAmount(result.totals.cash));
  setText("fixedCashSummaryNote", `상품권 ${formatKoreanAmount(result.totals.giftValue)} 포함`);
  setText("stockSummary", formatKoreanAmount(result.totals.stockValue));
  setText("stockSummaryNote", `${toNumber(stockSharesInput)}주 × ${formatWon(toNumber(stockPriceInput))}`);
  setText("totalSummary", formatKoreanAmount(result.totals.totalComp));
  setText("totalSummaryNote", `복지 ${formatKoreanAmount(result.totals.benefitsAmount)}`);
  setText("monthlySummary", formatKoreanAmount(result.totals.monthlyCompView));
  setText("monthlySummaryNote", isCouple ? `1인당 평균 ${formatKoreanAmount(result.totals.monthlyCompView / 2)}` : `월 기본 ${formatKoreanAmount(result.totals.monthlyBase)}`);
}

function renderSummaryReport(result) {
  const isCouple = result.mode === "COUPLE";
  const rows = [
    [isCouple ? "부부 연봉 합산" : "연봉", formatWon(result.totals.annualSalary), false],
    [isCouple ? "부부 월 기본급 합산" : "월 기본급", formatWon(result.totals.monthlyBaseWage), false],
    [isCouple ? "부부 성과금 합산" : "성과금", formatWon(result.totals.bonus), false],
    [isCouple ? "부부 정액 현금 합산" : "정액 현금", formatWon(result.totals.cash), false],
    [isCouple ? "부부 상품권 합산" : "상품권", formatWon(result.totals.giftValue), false],
    [isCouple ? "부부 자사주 가치 합산" : "자사주 가치", formatWon(result.totals.stockValue), false],
    [isCouple ? "부부 복지 합산" : "복지", formatWon(result.totals.benefitsAmount), false],
    [isCouple ? "부부 연 총보상" : "연 총보상", formatWon(result.totals.totalComp), true],
    ["월 기본 체감", formatWon(result.totals.monthlyBase), false],
    [isCouple ? "부부 월평균 총보상" : "월 총보상 체감", formatWon(result.totals.monthlyCompView), true],
    ["월 성과금 포함 증가분", formatWon(result.totals.monthlyBonusLift), true]
  ];

  $("summaryReportList").innerHTML = rows.map(([label, value, highlight]) => `
    <div class="report-row${highlight ? " is-highlight" : ""}">
      <span class="report-row__label">${label}</span>
      <strong class="report-row__value">${value}</strong>
    </div>
  `).join("");
}

function renderNetReport(result) {
  const enabled = isChecked(includeNetEstimateToggle);
  if (netPanel) netPanel.hidden = !enabled;
  if (!enabled) {
    $("netReportList").innerHTML = "";
    return;
  }

  const baseNet = estimateNetFromAnnual(result.totals.annualSalary);
  const totalNet = estimateNetFromAnnual(result.totals.totalComp);
  const rows = [
    [result.mode === "COUPLE" ? "부부 월 기본 실수령 추정" : "월 기본 실수령 추정", formatWon(baseNet)],
    [result.mode === "COUPLE" ? "부부 월 총보상 실수령 추정" : "월 총보상 실수령 추정", formatWon(totalNet)],
    [result.mode === "COUPLE" ? "1인당 평균 실수령 추정" : "월 실수령 증가분 추정", formatWon(result.mode === "COUPLE" ? totalNet / 2 : totalNet - baseNet)],
    ["안내", "참고 추정치"]
  ];

  $("netReportList").innerHTML = rows.map(([label, value]) => `
    <div class="report-row">
      <span class="report-row__label">${label}</span>
      <strong class="report-row__value">${value}</strong>
    </div>
  `).join("");
}

function renderRankMatrix() {
  $("rankMatrixList").innerHTML = rankPresets.map((rank) => {
    const row = calculatePerson(rank.defaultSalary, rank.defaultMonthlyBase);
    return `
      <div class="matrix-row">
        <span class="matrix-row__cell matrix-row__cell--label">${rank.label}</span>
        <span class="matrix-row__cell">${formatKoreanAmount(rank.defaultSalary)}</span>
        <span class="matrix-row__cell">${formatKoreanAmount(rank.defaultMonthlyBase)}</span>
        <span class="matrix-row__cell">${formatKoreanAmount(row.bonus)}</span>
        <span class="matrix-row__cell matrix-row__cell--strong">${formatKoreanAmount(row.totalComp)}</span>
        <span class="matrix-row__cell matrix-row__cell--strong">${formatKoreanAmount(row.monthlyCompView)}</span>
      </div>
    `;
  }).join("");
}

function renderScenarioYears() {
  const currentYear = targetYearSelect.value;
  $("scenarioYearGrid").innerHTML = yearOptions.map((year) => {
    const savedYear = targetYearSelect.value;
    targetYearSelect.value = year.code;
    const actualInput2 = document.querySelector('input[name="packageMode"][value="ACTUAL"]');
    const scenarioInput2 = document.querySelector('input[name="packageMode"][value="SCENARIO"]');
    const wasActualChecked = actualInput2?.checked;
    if (year.code !== "2026" && actualInput2?.checked && scenarioInput2) {
      scenarioInput2.checked = true;
    }
    const r = aggregateResults();
    const total = r.totals.totalComp;
    const note = year.code === "2026" && getPackageMode() === "ACTUAL" ? "실제 기준" : "시뮬레이션";
    targetYearSelect.value = savedYear;
    if (wasActualChecked && actualInput2 && scenarioInput2) {
      actualInput2.checked = true;
    }
    return `
      <article class="scenario-year-card${currentYear === year.code ? " is-active" : ""}">
        <p>${year.label}</p>
        <strong>${formatKoreanAmount(total)}</strong>
        <span>${note}</span>
      </article>
    `;
  }).join("");
}

let _hyundaiDonutChart = null;
function renderDonutChart(totals) {
  const canvas = $("hyundai-donut-chart");
  if (!canvas || !window.Chart) return;
  const data = [
    totals.annualSalary,
    totals.bonus,
    totals.cash + totals.giftValue,
    totals.stockValue,
    totals.benefitsAmount,
  ];
  const labels = ["연봉", "성과금", "정액현금·상품권", "자사주", "복지"];
  const colors = ["#B4B2A9", "#1D9E75", "#5DCAA5", "#9FE1CB", "#E1F5EE"];
  if (_hyundaiDonutChart) { _hyundaiDonutChart.destroy(); _hyundaiDonutChart = null; }
  const total = data.reduce((a, b) => a + b, 0);
  const centerPlugin = {
    id: "hyundaiDonutCenter",
    afterDraw(chart) {
      const { ctx, chartArea: { left, right, top, bottom } } = chart;
      const cx = (left + right) / 2, cy = (top + bottom) / 2;
      ctx.save();
      ctx.font = "500 12px sans-serif";
      ctx.fillStyle = "#888780";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("총보상", cx, cy - 11);
      ctx.font = "500 15px sans-serif";
      ctx.fillStyle = "#1A1A18";
      ctx.fillText(formatKoreanAmount(total), cx, cy + 11);
      ctx.restore();
    }
  };
  _hyundaiDonutChart = new window.Chart(canvas.getContext("2d"), {
    type: "doughnut",
    data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 1, borderColor: "#fff" }] },
    options: { ...buildDefaultOptions(), cutout: "62%", plugins: { legend: { position: "bottom", labels: { boxWidth: 12, padding: 10, font: { size: 11 }, color: "#888780" } } } },
    plugins: [centerPlugin],
  });
}

let _hyundaiRankChart = null;
function renderRankChart() {
  const canvas = $("hyundai-rank-chart");
  if (!canvas || !window.Chart) return;
  const currentSalary = Number(selfSalaryInput?.value || 0);
  const items = rankPresets.map((rank) => {
    const row = calculatePerson(rank.defaultSalary, rank.defaultMonthlyBase);
    const isCurrent = Math.abs(rank.defaultSalary - currentSalary) < 5_000_000;
    return { label: rank.label, total: row.totalComp, isCurrent };
  });
  const bgColors = items.map((it) => it.isCurrent ? "#0F6E56" : "#B4B2A9");
  if (_hyundaiRankChart) { _hyundaiRankChart.destroy(); _hyundaiRankChart = null; }
  _hyundaiRankChart = new window.Chart(canvas.getContext("2d"), {
    type: "bar",
    data: {
      labels: items.map((it) => it.label),
      datasets: [{ label: "총보상", data: items.map((it) => it.total), backgroundColor: bgColors, borderRadius: 4 }],
    },
    options: {
      ...buildDefaultOptions(),
      indexAxis: "y",
      layout: { padding: { right: 84 } },
      plugins: { legend: { display: false } },
      scales: { x: { display: false }, y: { grid: { display: false }, ticks: { color: "#888780" } } },
    },
    plugins: [makeLabelPlugin(formatKoreanAmount)],
  });
}

let _hyundaiScenarioChart = null;
function renderScenarioChart(result) {
  const canvas = $("hyundai-scenario-chart");
  if (!canvas || !window.Chart) return;
  const years = yearOptions.map((year) => {
    const savedYear = targetYearSelect.value;
    targetYearSelect.value = year.code;
    const actualInput2 = document.querySelector('input[name="packageMode"][value="ACTUAL"]');
    const scenarioInput2 = document.querySelector('input[name="packageMode"][value="SCENARIO"]');
    const wasActualChecked = actualInput2?.checked;
    if (year.code !== "2026" && actualInput2?.checked && scenarioInput2) {
      scenarioInput2.checked = true;
    }
    const r = aggregateResults();
    targetYearSelect.value = savedYear;
    if (wasActualChecked && actualInput2 && scenarioInput2) {
      actualInput2.checked = true;
    }
    return {
      label: year.label,
      salary: r.totals.annualSalary,
      bonus: r.totals.bonus,
      cash: r.totals.cash + r.totals.giftValue,
      stock: r.totals.stockValue,
      benefits: r.totals.benefitsAmount,
    };
  });
  if (_hyundaiScenarioChart) { _hyundaiScenarioChart.destroy(); _hyundaiScenarioChart = null; }
  _hyundaiScenarioChart = new window.Chart($("hyundai-scenario-chart").getContext("2d"), {
    type: "bar",
    data: {
      labels: years.map((y) => y.label),
      datasets: [
        { label: "연봉",        data: years.map((y) => y.salary),   backgroundColor: "#B4B2A9", stack: "s" },
        { label: "성과금",      data: years.map((y) => y.bonus),    backgroundColor: "#0F6E56", stack: "s" },
        { label: "현금·상품권", data: years.map((y) => y.cash),     backgroundColor: "#5DCAA5", stack: "s" },
        { label: "자사주",      data: years.map((y) => y.stock),    backgroundColor: "#9FE1CB", stack: "s" },
        { label: "복지",        data: years.map((y) => y.benefits), backgroundColor: "#E1F5EE", stack: "s" },
      ],
    },
    options: {
      ...buildDefaultOptions(),
      scales: {
        x: { stacked: true, grid: { display: false }, ticks: { color: "#888780" } },
        y: { stacked: true, ticks: { callback: (v) => formatKRW(v), color: "#888780" }, grid: { color: "#F0EFED" } },
      },
      plugins: { legend: { position: "bottom", labels: { boxWidth: 12, padding: 10, font: { size: 11 }, color: "#888780" } } },
    },
  });
}

function renderComparisons(result) {
  $("comparisonGrid").innerHTML = comparisonCards.map((item) => {
    const gap = result.totals.totalComp - item.annualTotal;
    const toneClass = gap >= 0 ? "is-positive" : "is-muted";
    const gapCopy = gap >= 0 ? `${formatKoreanAmount(gap)} 높음` : `${formatKoreanAmount(Math.abs(gap))} 낮음`;
    return `
      <article class="comparison-card ${toneClass}">
        <p>${item.label}</p>
        <strong>${formatKoreanAmount(item.annualTotal)}</strong>
        <span>${item.note}</span>
        <em>${gapCopy}</em>
      </article>
    `;
  }).join("");
}

function render() {
  normalizeControls();
  syncSelfSalarySlider();
  syncSpouseSalarySlider();
  const result = aggregateResults();
  renderSummary(result);
  renderSummaryReport(result);
  renderNetReport(result);
  renderDonutChart(result.totals);
  renderRankChart();
  renderScenarioChart(result);
  renderRankMatrix();
  renderScenarioYears();
  renderComparisons(result);
}

function flashButton(button, label) {
  if (!button) return;
  const original = button.textContent;
  button.textContent = label;
  window.setTimeout(() => {
    button.textContent = original;
  }, 1500);
}

function resetPage() {
  modeSingle.checked = true;
  selfRankSelect.value = rankPresets[0].code;
  spouseRankSelect.value = rankPresets[1]?.code || rankPresets[0].code;
  syncRecommendedValues(selfRankSelect, selfSalaryInput, "selfSalaryHint", selfMonthlyBaseInput, "selfMonthlyBaseHint");
  syncRecommendedValues(spouseRankSelect, spouseSalaryInput, "spouseSalaryHint", spouseMonthlyBaseInput, "spouseMonthlyBaseHint");
  targetYearSelect.value = "2026";
  const pkgActual = document.querySelector('input[name="packageMode"][value="ACTUAL"]');
  if (pkgActual) pkgActual.checked = true;
  scenarioSelect.value = "BASE";
  stockPriceInput.value = String(defaultStockPrice);
  benefitsInput.value = String(defaultBenefits);
  includeBonusToggle.checked = true;
  includeStockToggle.checked = true;
  includeBenefitsToggle.checked = true;
  bonusMultiplierInput.value = String(actualBonusMultiplier);
  fixedCashInput.value = String(actualFixedCash);
  stockSharesInput.value = String(actualStockShares);
  includeNetEstimateToggle.checked = true;
  render();
}

[selfRankSelect, spouseRankSelect].forEach((select) => {
  select?.addEventListener("change", () => {
    if (select === selfRankSelect) {
      syncRecommendedValues(selfRankSelect, selfSalaryInput, "selfSalaryHint", selfMonthlyBaseInput, "selfMonthlyBaseHint");
    }
    if (select === spouseRankSelect) {
      syncRecommendedValues(spouseRankSelect, spouseSalaryInput, "spouseSalaryHint", spouseMonthlyBaseInput, "spouseMonthlyBaseHint");
    }
    render();
  });
});

[
  selfSalaryInput,
  spouseSalaryInput,
  selfMonthlyBaseInput,
  spouseMonthlyBaseInput,
  targetYearSelect,
  scenarioSelect,
  stockPriceInput,
  benefitsInput,
  includeBonusToggle,
  includeStockToggle,
  includeBenefitsToggle,
  bonusMultiplierInput,
  fixedCashInput,
  stockSharesInput,
  includeNetEstimateToggle,
  modeSingle,
  modeCouple
].forEach((element) => {
  element?.addEventListener(element.type === "checkbox" || element.type === "radio" ? "change" : "input", render);
  element?.addEventListener("change", render);
});

$("selfSalarySlider")?.addEventListener("input", () => {
  if (selfSalaryInput) selfSalaryInput.value = $("selfSalarySlider").value;
  syncSelfSalarySlider();
  render();
});
$("spouseSalarySlider")?.addEventListener("input", () => {
  if (spouseSalaryInput) spouseSalaryInput.value = $("spouseSalarySlider").value;
  syncSpouseSalarySlider();
  render();
});
document.querySelectorAll('input[name="packageMode"]').forEach((radio) => {
  radio.addEventListener("change", render);
});

$("calcHyundaiBonusBtn")?.addEventListener("click", render);
$("resetHyundaiBonusBtn")?.addEventListener("click", () => {
  resetPage();
  flashButton($("resetHyundaiBonusBtn"), "초기화됨");
});
$("copyHyundaiBonusLinkBtn")?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    flashButton($("copyHyundaiBonusLinkBtn"), "링크 복사됨");
  } catch {
    flashButton($("copyHyundaiBonusLinkBtn"), "복사 실패");
  }
});

resetPage();
