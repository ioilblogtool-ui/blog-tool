/**
 * samsung-bonus.js - 삼성전자 성과급 계산기
 */
import { formatKRW, buildDefaultOptions, makeLabelPlugin } from "./chart-config.js";

const $ = (id) => document.getElementById(id);
const configNode = $("samsungCompensationConfig");

if (!configNode) {
  throw new Error("samsung compensation config is missing");
}

const {
  rankPresets,
  divisions,
  yearOptions,
  opiModes,
  scenarioPresets,
  operatingProfitScenarios,
  unionDemandScenarios,
  comparisonCards,
  defaultBenefits,
  averageCompensation,
} = JSON.parse(configNode.textContent || "{}");

const rankMap = Object.fromEntries(rankPresets.map((item) => [item.code, item]));
const divisionMap = Object.fromEntries(divisions.map((item) => [item.code, item]));
const scenarioMap = Object.fromEntries(scenarioPresets.map((item) => [item.code, item]));
const operatingProfitMap = Object.fromEntries(operatingProfitScenarios.map((item) => [item.code, item]));
const unionDemandMap = Object.fromEntries(unionDemandScenarios.map((item) => [item.code, item]));

const controls = {
  selfRank: $("selfRankSelect"),
  spouseRank: $("spouseRankSelect"),
  selfDivision: $("selfDivisionSelect"),
  spouseDivision: $("spouseDivisionSelect"),
  selfSalary: $("selfSalaryInput"),
  spouseSalary: $("spouseSalaryInput"),
  targetYear: $("targetYearSelect"),
  scenario: $("scenarioSelect"),
  benefits: $("benefitsInput"),
  operatingProfitScenario: $("operatingProfitScenarioSelect"),
  unionDemandScenario: $("unionDemandScenarioSelect"),
  eligibleEmployees: $("eligibleEmployeesInput"),
  customOperatingProfit: $("customOperatingProfitInput"),
  includeOpi: $("includeOpiToggle"),
  includeTai: $("includeTaiToggle"),
  includeBenefits: $("includeBenefitsToggle"),
  customOpiRate: $("customOpiRateInput"),
  taiFirstHalf: $("taiFirstHalfInput"),
  taiSecondHalf: $("taiSecondHalfInput"),
  includeNetEstimate: $("includeNetEstimateToggle"),
  modeSingle: $("modeSingle"),
  modeCouple: $("modeCouple"),
  spouseBlock: $("spouseBlock"),
  netPanel: $("netPanel"),
};

function formatWon(value) {
  return `${new Intl.NumberFormat("ko-KR").format(Math.round(Number(value || 0)))}원`;
}

function formatKoreanAmount(value) {
  const amount = Math.round(Number(value || 0));
  const sign = amount < 0 ? "-" : "";
  const abs = Math.abs(amount);
  const jo = Math.floor(abs / 1_000_000_000_000);
  const eok = Math.floor((abs % 1_000_000_000_000) / 100_000_000);
  const man = Math.floor((abs % 100_000_000) / 10_000);

  if (jo > 0 && eok > 0) return `${sign}${jo}조 ${new Intl.NumberFormat("ko-KR").format(eok)}억 원`;
  if (jo > 0) return `${sign}${jo}조 원`;
  if (eok > 0 && man > 0) return `${sign}${eok}억 ${new Intl.NumberFormat("ko-KR").format(man)}만 원`;
  if (eok > 0) return `${sign}${eok}억 원`;
  return `${sign}${new Intl.NumberFormat("ko-KR").format(man)}만 원`;
}

function setText(id, value) {
  const element = $(id);
  if (element) element.textContent = value;
}

function toNumber(input) {
  return Number(input && input.value ? input.value : 0);
}

function isChecked(input) {
  return Boolean(input && input.checked);
}

function getMode() {
  return controls.modeCouple?.checked ? "COUPLE" : "SINGLE";
}

function getOpiMode() {
  return document.querySelector('input[name="opiMode"]:checked')?.value || "ACTUAL";
}

function getOperatingProfitScenario() {
  return operatingProfitMap[controls.operatingProfitScenario?.value] || operatingProfitScenarios[0];
}

function getUnionDemandScenario() {
  return unionDemandMap[controls.unionDemandScenario?.value] || unionDemandScenarios[0];
}

function getOperatingProfit() {
  const custom = toNumber(controls.customOperatingProfit);
  return custom > 0 ? custom : getOperatingProfitScenario().operatingProfit;
}

function getEligibleEmployees() {
  return Math.max(1, toNumber(controls.eligibleEmployees) || 120_000);
}

function estimateNetFromAnnual(annual) {
  const monthlyGross = annual / 12;
  const mealNonTaxable = Math.min(200_000, monthlyGross * 0.04);
  const taxableMonthly = Math.max(0, monthlyGross - mealNonTaxable);
  const pension = Math.min(taxableMonthly * 0.045, 280_000);
  const health = taxableMonthly * 0.03545;
  const longTermCare = health * 0.1295;
  const employment = taxableMonthly * 0.009;
  const annualTaxableApprox = Math.max(0, taxableMonthly * 12 - 1_500_000);

  let incomeTaxRate = 0.06;
  if (annualTaxableApprox >= 30_000_000 && annualTaxableApprox < 50_000_000) incomeTaxRate = 0.1;
  else if (annualTaxableApprox >= 50_000_000 && annualTaxableApprox < 70_000_000) incomeTaxRate = 0.14;
  else if (annualTaxableApprox >= 70_000_000 && annualTaxableApprox < 100_000_000) incomeTaxRate = 0.17;
  else if (annualTaxableApprox >= 100_000_000 && annualTaxableApprox < 140_000_000) incomeTaxRate = 0.2;
  else if (annualTaxableApprox >= 140_000_000) incomeTaxRate = 0.24;

  const incomeTax = taxableMonthly * incomeTaxRate;
  const localIncomeTax = incomeTax * 0.1;
  const deductions = pension + health + longTermCare + employment + incomeTax + localIncomeTax;
  return Math.max(0, monthlyGross - deductions);
}

function syncRecommendedSalary(select, input, hintId) {
  const preset = rankMap[select?.value] || rankPresets[0];
  if (input) input.value = String(preset.defaultSalary);
  setText(hintId, `추천 연봉 예시: ${formatKoreanAmount(preset.defaultSalary)}`);
}

function syncSalarySlider(input, sliderId, valueId) {
  const val = Math.min(Math.max(Math.round(Number(input?.value) || 0), 30_000_000), 300_000_000);
  const slider = $(sliderId);
  const value = $(valueId);
  if (slider) slider.value = String(val);
  if (value) value.textContent = formatKoreanAmount(val);
}

function updateHints() {
  setText("selfSalaryHint", `추천 연봉 예시: ${formatKoreanAmount((rankMap[controls.selfRank?.value] || rankPresets[0]).defaultSalary)}`);
  setText("spouseSalaryHint", `추천 연봉 예시: ${formatKoreanAmount((rankMap[controls.spouseRank?.value] || rankPresets[1]).defaultSalary)}`);

  const opiMode = opiModes.find((item) => item.code === getOpiMode()) || opiModes[0];
  setText("opiModeHint", opiMode.description);

  const preset = scenarioMap[controls.scenario?.value] || scenarioPresets[1];
  setText("scenarioHint", `TAI 상반기 ${preset.taiFirstHalf.toFixed(2)} / 하반기 ${preset.taiSecondHalf.toFixed(2)}`);

  const benefit = toNumber(controls.benefits);
  setText("benefitsHint", getMode() === "COUPLE" ? `1인당 ${formatKoreanAmount(benefit)} / 부부 합산 ${formatKoreanAmount(benefit * 2)}` : `개인 복지 ${formatKoreanAmount(benefit)}`);

  const profitScenario = getOperatingProfitScenario();
  setText("operatingProfitHint", `${profitScenario.sourceLabel}: ${profitScenario.note}`);

  const unionScenario = getUnionDemandScenario();
  setText("unionDemandHint", `${Math.round(unionScenario.payoutRatio * 100)}% 기준 · ${unionScenario.note}`);
}

function normalizeControls() {
  if (controls.spouseBlock) controls.spouseBlock.hidden = getMode() !== "COUPLE";

  const actualInput = document.querySelector('input[name="opiMode"][value="ACTUAL"]');
  const scenarioInput = document.querySelector('input[name="opiMode"][value="SCENARIO"]');
  const actualChip = $("opiActualChip");
  const disableActual = controls.targetYear?.value !== "2026";

  if (actualInput) actualInput.disabled = disableActual;
  if (actualChip) {
    actualChip.style.opacity = disableActual ? "0.38" : "1";
    actualChip.style.pointerEvents = disableActual ? "none" : "";
  }
  if (disableActual && actualInput?.checked && scenarioInput) scenarioInput.checked = true;

  const preset = scenarioMap[controls.scenario?.value] || scenarioPresets[1];
  if (document.activeElement !== controls.taiFirstHalf && controls.taiFirstHalf) controls.taiFirstHalf.value = String(preset.taiFirstHalf);
  if (document.activeElement !== controls.taiSecondHalf && controls.taiSecondHalf) controls.taiSecondHalf.value = String(preset.taiSecondHalf);

  updateHints();
}

function calculateUnionOpi(annualSalary) {
  const operatingProfit = getOperatingProfit();
  const unionScenario = getUnionDemandScenario();
  const pool = operatingProfit * unionScenario.payoutRatio;
  const perHead = pool / getEligibleEmployees();
  const salaryWeight = averageCompensation > 0 ? annualSalary / averageCompensation : 1;
  const weightedAmount = perHead * salaryWeight;

  return {
    operatingProfit,
    pool,
    perHead,
    weightedAmount,
    payoutRatio: unionScenario.payoutRatio,
    stockCompensation: unionScenario.stockCompensation,
  };
}

function resolveOpiRate(divisionCode) {
  const division = divisionMap[divisionCode] || divisions[0];
  const customRate = toNumber(controls.customOpiRate);
  if (customRate > 0) return customRate;
  if (controls.targetYear?.value === "2026" && getOpiMode() === "ACTUAL") return division.actual2026Rate;
  return division.scenarioRates[controls.scenario?.value] || division.scenarioRates.BASE;
}

function calculatePerson(annualSalary, divisionCode) {
  const monthlyBase = annualSalary / 12;
  const taiFirst = toNumber(controls.taiFirstHalf);
  const taiSecond = toNumber(controls.taiSecondHalf);
  const union = calculateUnionOpi(annualSalary);
  const opiRate = resolveOpiRate(divisionCode);
  const useUnionMode = getOpiMode() === "UNION_DEMAND";
  const opiAmount = isChecked(controls.includeOpi)
    ? useUnionMode ? union.weightedAmount : annualSalary * opiRate
    : 0;
  const taiAmount = isChecked(controls.includeTai) ? monthlyBase * (taiFirst + taiSecond) : 0;
  const benefitsAmount = isChecked(controls.includeBenefits) ? toNumber(controls.benefits) : 0;
  const totalComp = annualSalary + opiAmount + taiAmount + benefitsAmount;

  return {
    annualSalary,
    opiRate: useUnionMode ? null : opiRate,
    opiAmount,
    taiAmount,
    benefitsAmount,
    totalComp,
    monthlyBase,
    monthlyCompView: totalComp / 12,
    monthlyBonusLift: (totalComp - annualSalary) / 12,
    union,
  };
}

function aggregateResults() {
  const mode = getMode();
  const self = calculatePerson(toNumber(controls.selfSalary), controls.selfDivision?.value);
  const spouse = mode === "COUPLE" ? calculatePerson(toNumber(controls.spouseSalary), controls.spouseDivision?.value) : null;
  const totals = {
    annualSalary: self.annualSalary + (spouse ? spouse.annualSalary : 0),
    opiAmount: self.opiAmount + (spouse ? spouse.opiAmount : 0),
    taiAmount: self.taiAmount + (spouse ? spouse.taiAmount : 0),
    benefitsAmount: self.benefitsAmount + (spouse ? spouse.benefitsAmount : 0),
    totalComp: self.totalComp + (spouse ? spouse.totalComp : 0),
    monthlyBase: self.monthlyBase + (spouse ? spouse.monthlyBase : 0),
    monthlyCompView: self.monthlyCompView + (spouse ? spouse.monthlyCompView : 0),
    monthlyBonusLift: self.monthlyBonusLift + (spouse ? spouse.monthlyBonusLift : 0),
  };

  return { mode, self, spouse, totals };
}

function getCurrentOpiCap(result) {
  return result.totals.annualSalary * 0.5;
}

function renderSummary(result) {
  const isCouple = result.mode === "COUPLE";
  const opiMode = getOpiMode();
  const subtitle = opiMode === "UNION_DEMAND"
    ? `${getOperatingProfitScenario().label} · ${getUnionDemandScenario().label} 추정`
    : controls.targetYear?.value === "2026" && opiMode === "ACTUAL"
      ? "기존 OPI 기준 모드"
      : `${controls.targetYear?.value} ${scenarioMap[controls.scenario?.value].label} 시나리오`;

  setText("resultHeadline", isCouple ? "부부 총보상 핵심 카드" : "개인 총보상 핵심 카드");
  setText("resultSubcopy", subtitle);
  setText("salaryCardLabel", isCouple ? "부부 연봉 합산" : "연봉");
  setText("salarySummary", formatKoreanAmount(result.totals.annualSalary));
  setText("salarySummaryNote", isCouple ? `1인당 평균 ${formatKoreanAmount(result.totals.annualSalary / 2)}` : `평균 직원 보수 ${formatKoreanAmount(averageCompensation)}`);
  setText("opiSummary", formatKoreanAmount(result.totals.opiAmount));
  setText("opiSummaryNote", opiMode === "UNION_DEMAND" ? "협의안 환산" : `${isCouple ? "합산" : divisionMap[controls.selfDivision?.value].actualLabel}`);
  setText("taiSummary", formatKoreanAmount(result.totals.taiAmount));
  setText("taiSummaryNote", `상반기 ${controls.taiFirstHalf?.value} / 하반기 ${controls.taiSecondHalf?.value}`);
  setText("totalSummary", formatKoreanAmount(result.totals.totalComp));
  setText("totalSummaryNote", `복지 ${formatKoreanAmount(result.totals.benefitsAmount)}`);
  setText("monthlySummary", formatKoreanAmount(result.totals.monthlyCompView));
  setText("monthlySummaryNote", isCouple ? `1인당 평균 ${formatKoreanAmount(result.totals.monthlyCompView / 2)}` : `월 기본 ${formatKoreanAmount(result.totals.monthlyBase)}`);
  updateNextStepLinks(result);
}

function updateNextStepLinks(result) {
  const bonusAmount = Math.max(0, Math.round(result.totals.opiAmount + result.totals.taiAmount));
  const annualSalary = Math.max(0, Math.round(result.totals.annualSalary));
  const monthlyInvest = Math.min(3_000_000, Math.max(100_000, Math.round((bonusAmount / 12) / 50_000) * 50_000));
  const afterTaxCta = $("samsungAfterTaxCta");
  const dcaCta = $("samsungDcaCta");

  if (afterTaxCta) {
    afterTaxCta.href = `/tools/bonus-after-tax-calculator/?bonus=${bonusAmount}&salary=${annualSalary}&company=samsung`;
  }
  if (dcaCta) {
    dcaCta.href = `/tools/dca-investment-calculator/?m=${monthlyInvest}&p=10&a=SP500,NASDAQ100,QQQ&fx=1&div=1`;
  }
  setText("samsungNextStepNote", `성과급 ${formatKoreanAmount(bonusAmount)} 기준 · 투자 계산기는 월 ${formatKoreanAmount(monthlyInvest)} 적립으로 연결합니다.`);
}

function renderUnionSummary(result) {
  const union = calculateUnionOpi(result.totals.annualSalary / (result.mode === "COUPLE" ? 2 : 1));
  const totalWeighted = result.mode === "COUPLE" && result.spouse
    ? result.self.union.weightedAmount + result.spouse.union.weightedAmount
    : result.self.union.weightedAmount;
  const cap = getCurrentOpiCap(result);
  const gap = totalWeighted - cap;
  const gapCopy = gap >= 0
    ? `협의안 환산액이 기존 연봉 50% 상한보다 ${formatKoreanAmount(gap)} 높습니다.`
    : `협의안 환산액이 기존 연봉 50% 상한보다 ${formatKoreanAmount(Math.abs(gap))} 낮습니다.`;

  setText("unionPoolSummary", formatKoreanAmount(union.pool));
  setText("unionPoolNote", `${formatKoreanAmount(union.operatingProfit)} × ${Math.round(union.payoutRatio * 100)}%`);
  setText("unionPerHeadSummary", formatKoreanAmount(union.perHead));
  setText("unionPerHeadNote", `${new Intl.NumberFormat("ko-KR").format(getEligibleEmployees())}명 단순 나눔`);
  setText("unionWeightedSummary", formatKoreanAmount(totalWeighted));
  setText("unionWeightedNote", result.mode === "COUPLE" ? "부부 연봉 가중 합산" : "내 연봉 가중 환산");
  setText("unionVsCurrentCopy", `${gapCopy} 실제 배분 방식, 사업부별 재원, 직급별 평가, 자사주 가격에 따라 달라질 수 있습니다.`);
}

function renderSummaryReport(result) {
  const isCouple = result.mode === "COUPLE";
  const rows = [
    [isCouple ? "부부 연봉 합산" : "연봉", formatWon(result.totals.annualSalary), false],
    [isCouple ? "부부 OPI 합산" : "OPI", formatWon(result.totals.opiAmount), false],
    [isCouple ? "부부 TAI 합산" : "TAI", formatWon(result.totals.taiAmount), false],
    [isCouple ? "부부 복지 합산" : "복지", formatWon(result.totals.benefitsAmount), false],
    [isCouple ? "부부 총보상" : "총보상", formatWon(result.totals.totalComp), true],
    ["월 기본 체감", formatWon(result.totals.monthlyBase), false],
    [isCouple ? "부부 월평균 총보상" : "월 총보상 체감", formatWon(result.totals.monthlyCompView), true],
    ["월 성과급 포함 증가분", formatWon(result.totals.monthlyBonusLift), true],
  ];

  $("summaryReportList").innerHTML = rows.map(([label, value, highlight]) => `
    <div class="report-row${highlight ? " is-highlight" : ""}">
      <span class="report-row__label">${label}</span>
      <strong class="report-row__value">${value}</strong>
    </div>
  `).join("");
}

function renderNetReport(result) {
  const enabled = isChecked(controls.includeNetEstimate);
  if (controls.netPanel) controls.netPanel.hidden = !enabled;
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
    ["안내", "참고 추정치"],
  ];

  $("netReportList").innerHTML = rows.map(([label, value]) => `
    <div class="report-row">
      <span class="report-row__label">${label}</span>
      <strong class="report-row__value">${value}</strong>
    </div>
  `).join("");
}

function renderRankMatrix() {
  const sampleDivision = controls.selfDivision?.value;
  $("rankMatrixList").innerHTML = rankPresets.map((rank) => {
    const row = calculatePerson(rank.defaultSalary, sampleDivision);
    return `
      <div class="matrix-row">
        <span class="matrix-row__cell matrix-row__cell--label">${rank.label}</span>
        <span class="matrix-row__cell">${formatKoreanAmount(rank.defaultSalary)}</span>
        <span class="matrix-row__cell">${formatKoreanAmount(row.opiAmount)}</span>
        <span class="matrix-row__cell matrix-row__cell--strong">${formatKoreanAmount(row.totalComp)}</span>
        <span class="matrix-row__cell matrix-row__cell--strong">${formatKoreanAmount(row.monthlyCompView)}</span>
      </div>
    `;
  }).join("");
}

function withTemporaryYear(yearCode, callback) {
  const savedYear = controls.targetYear?.value;
  const actualInput = document.querySelector('input[name="opiMode"][value="ACTUAL"]');
  const scenarioInput = document.querySelector('input[name="opiMode"][value="SCENARIO"]');
  const unionInput = document.querySelector('input[name="opiMode"][value="UNION_DEMAND"]');
  const savedMode = getOpiMode();

  if (controls.targetYear) controls.targetYear.value = yearCode;
  if (yearCode !== "2026" && savedMode === "ACTUAL" && scenarioInput) scenarioInput.checked = true;

  const value = callback();

  if (controls.targetYear) controls.targetYear.value = savedYear;
  if (savedMode === "ACTUAL" && actualInput) actualInput.checked = true;
  if (savedMode === "SCENARIO" && scenarioInput) scenarioInput.checked = true;
  if (savedMode === "UNION_DEMAND" && unionInput) unionInput.checked = true;

  return value;
}

function renderScenarioYears() {
  const currentYear = controls.targetYear?.value;
  $("scenarioYearGrid").innerHTML = yearOptions.map((year) => {
    const total = withTemporaryYear(year.code, () => aggregateResults().totals.totalComp);
    const note = getOpiMode() === "UNION_DEMAND" ? "협의안 환산" : year.code === "2026" ? "기존 기준 또는 시나리오" : "시뮬레이션";
    return `
      <article class="scenario-year-card${currentYear === year.code ? " is-active" : ""}">
        <p>${year.label}</p>
        <strong>${formatKoreanAmount(total)}</strong>
        <span>${note}</span>
      </article>
    `;
  }).join("");
}

let samsungDonutChart = null;
function renderDonutChart(totals) {
  const canvas = $("samsung-donut-chart");
  if (!canvas || !window.Chart) return;
  const data = [totals.annualSalary, totals.opiAmount, totals.taiAmount, totals.benefitsAmount];
  const labels = ["연봉", "OPI", "TAI", "복지"];
  const colors = ["rgba(148,163,184,0.80)", "rgba(15,110,86,0.82)", "rgba(186,117,23,0.78)", "rgba(83,74,183,0.65)"];
  if (samsungDonutChart) samsungDonutChart.destroy();
  const total = data.reduce((a, b) => a + b, 0);
  const centerPlugin = {
    id: "samsungDonutCenter",
    afterDraw(chart) {
      const { ctx, chartArea: { left, right, top, bottom } } = chart;
      const cx = (left + right) / 2;
      const cy = (top + bottom) / 2;
      ctx.save();
      ctx.font = "700 13px sans-serif";
      ctx.fillStyle = "#475569";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("총보상", cx, cy - 11);
      ctx.font = "700 16px sans-serif";
      ctx.fillStyle = "#0f172a";
      ctx.fillText(formatKoreanAmount(total), cx, cy + 11);
      ctx.restore();
    },
  };
  samsungDonutChart = new window.Chart(canvas.getContext("2d"), {
    type: "doughnut",
    data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 1, borderColor: "#fff" }] },
    options: { ...buildDefaultOptions(), cutout: "62%", plugins: { legend: { position: "bottom", labels: { boxWidth: 12, padding: 10, font: { size: 11 } } } } },
    plugins: [centerPlugin],
  });
}

let samsungRankChart = null;
function renderRankChart() {
  const canvas = $("samsung-rank-chart");
  if (!canvas || !window.Chart) return;
  const sampleDivision = controls.selfDivision?.value;
  const currentSalary = Number(controls.selfSalary?.value || 0);
  const items = rankPresets.map((rank) => {
    const row = calculatePerson(rank.defaultSalary, sampleDivision);
    return {
      label: rank.label,
      total: row.totalComp,
      isCurrent: Math.abs(rank.defaultSalary - currentSalary) < 5_000_000,
    };
  });
  if (samsungRankChart) samsungRankChart.destroy();
  samsungRankChart = new window.Chart(canvas.getContext("2d"), {
    type: "bar",
    data: {
      labels: items.map((item) => item.label),
      datasets: [{
        label: "총보상",
        data: items.map((item) => item.total),
        backgroundColor: items.map((item) => item.isCurrent ? "rgba(15,110,86,0.88)" : "rgba(148,163,184,0.60)"),
        borderRadius: 4,
      }],
    },
    options: {
      ...buildDefaultOptions(),
      indexAxis: "y",
      layout: { padding: { right: 84 } },
      plugins: { legend: { display: false } },
      scales: { x: { display: false }, y: { grid: { display: false } } },
    },
    plugins: [makeLabelPlugin(formatKoreanAmount)],
  });
}

let samsungScenarioChart = null;
function renderScenarioChart() {
  const canvas = $("samsung-scenario-chart");
  if (!canvas || !window.Chart) return;
  const years = yearOptions.map((year) => withTemporaryYear(year.code, () => {
    const r = aggregateResults();
    return {
      label: year.label,
      salary: r.totals.annualSalary,
      opi: r.totals.opiAmount,
      tai: r.totals.taiAmount,
      benefits: r.totals.benefitsAmount,
    };
  }));
  if (samsungScenarioChart) samsungScenarioChart.destroy();
  samsungScenarioChart = new window.Chart(canvas.getContext("2d"), {
    type: "bar",
    data: {
      labels: years.map((year) => year.label),
      datasets: [
        { label: "연봉", data: years.map((year) => year.salary), backgroundColor: "rgba(148,163,184,0.75)", stack: "s" },
        { label: "OPI", data: years.map((year) => year.opi), backgroundColor: "rgba(15,110,86,0.80)", stack: "s" },
        { label: "TAI", data: years.map((year) => year.tai), backgroundColor: "rgba(186,117,23,0.75)", stack: "s" },
        { label: "복지", data: years.map((year) => year.benefits), backgroundColor: "rgba(83,74,183,0.60)", stack: "s" },
      ],
    },
    options: {
      ...buildDefaultOptions(),
      scales: {
        x: { stacked: true, grid: { display: false } },
        y: { stacked: true, ticks: { callback: (value) => formatKRW(value) } },
      },
      plugins: { legend: { position: "bottom", labels: { boxWidth: 12, padding: 10, font: { size: 11 } } } },
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
  syncSalarySlider(controls.selfSalary, "selfSalarySlider", "selfSalarySliderVal");
  syncSalarySlider(controls.spouseSalary, "spouseSalarySlider", "spouseSalarySliderVal");
  const result = aggregateResults();
  renderSummary(result);
  renderUnionSummary(result);
  renderSummaryReport(result);
  renderNetReport(result);
  renderDonutChart(result.totals);
  renderRankChart();
  renderScenarioChart();
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
  if (controls.modeSingle) controls.modeSingle.checked = true;
  if (controls.selfRank) controls.selfRank.value = rankPresets[0].code;
  if (controls.spouseRank) controls.spouseRank.value = rankPresets[1].code;
  if (controls.selfDivision) controls.selfDivision.value = "DS";
  if (controls.spouseDivision) controls.spouseDivision.value = divisions[0].code;
  syncRecommendedSalary(controls.selfRank, controls.selfSalary, "selfSalaryHint");
  syncRecommendedSalary(controls.spouseRank, controls.spouseSalary, "spouseSalaryHint");
  if (controls.targetYear) controls.targetYear.value = "2026";
  const opiActual = document.querySelector('input[name="opiMode"][value="ACTUAL"]');
  if (opiActual) opiActual.checked = true;
  if (controls.scenario) controls.scenario.value = "BASE";
  if (controls.operatingProfitScenario) controls.operatingProfitScenario.value = operatingProfitScenarios[0].code;
  if (controls.unionDemandScenario) controls.unionDemandScenario.value = unionDemandScenarios[0].code;
  if (controls.benefits) controls.benefits.value = String(defaultBenefits);
  if (controls.eligibleEmployees) controls.eligibleEmployees.value = "120000";
  if (controls.customOperatingProfit) controls.customOperatingProfit.value = "0";
  if (controls.includeOpi) controls.includeOpi.checked = true;
  if (controls.includeTai) controls.includeTai.checked = true;
  if (controls.includeBenefits) controls.includeBenefits.checked = true;
  if (controls.customOpiRate) controls.customOpiRate.value = "0";
  if (controls.taiFirstHalf) controls.taiFirstHalf.value = "0.5";
  if (controls.taiSecondHalf) controls.taiSecondHalf.value = "0.5";
  if (controls.includeNetEstimate) controls.includeNetEstimate.checked = true;
  render();
}

[controls.selfRank, controls.spouseRank].forEach((select) => {
  select?.addEventListener("change", () => {
    if (select === controls.selfRank) syncRecommendedSalary(controls.selfRank, controls.selfSalary, "selfSalaryHint");
    if (select === controls.spouseRank) syncRecommendedSalary(controls.spouseRank, controls.spouseSalary, "spouseSalaryHint");
    render();
  });
});

[
  controls.selfDivision,
  controls.spouseDivision,
  controls.selfSalary,
  controls.spouseSalary,
  controls.targetYear,
  controls.scenario,
  controls.benefits,
  controls.operatingProfitScenario,
  controls.unionDemandScenario,
  controls.eligibleEmployees,
  controls.customOperatingProfit,
  controls.includeOpi,
  controls.includeTai,
  controls.includeBenefits,
  controls.customOpiRate,
  controls.taiFirstHalf,
  controls.taiSecondHalf,
  controls.includeNetEstimate,
  controls.modeSingle,
  controls.modeCouple,
].forEach((element) => {
  element?.addEventListener(element.type === "checkbox" || element.type === "radio" ? "change" : "input", render);
  element?.addEventListener("change", render);
});

$("selfSalarySlider")?.addEventListener("input", () => {
  if (controls.selfSalary) controls.selfSalary.value = $("selfSalarySlider").value;
  syncSalarySlider(controls.selfSalary, "selfSalarySlider", "selfSalarySliderVal");
  render();
});

$("spouseSalarySlider")?.addEventListener("input", () => {
  if (controls.spouseSalary) controls.spouseSalary.value = $("spouseSalarySlider").value;
  syncSalarySlider(controls.spouseSalary, "spouseSalarySlider", "spouseSalarySliderVal");
  render();
});

document.querySelectorAll('input[name="opiMode"]').forEach((radio) => {
  radio.addEventListener("change", render);
});

$("calcSamsungBonusBtn")?.addEventListener("click", render);
$("resetSamsungBonusBtn")?.addEventListener("click", () => {
  resetPage();
  flashButton($("resetSamsungBonusBtn"), "초기화됨");
});
$("copySamsungBonusLinkBtn")?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    flashButton($("copySamsungBonusLinkBtn"), "링크 복사됨");
  } catch {
    flashButton($("copySamsungBonusLinkBtn"), "복사 실패");
  }
});

resetPage();
