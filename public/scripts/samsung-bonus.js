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
  comparisonCards,
  defaultBenefits,
  averageCompensation
} = JSON.parse(configNode.textContent || "{}");

const rankMap = Object.fromEntries(rankPresets.map((item) => [item.code, item]));
const divisionMap = Object.fromEntries(divisions.map((item) => [item.code, item]));
const scenarioMap = Object.fromEntries(scenarioPresets.map((item) => [item.code, item]));

const selfRankSelect = $("selfRankSelect");
const spouseRankSelect = $("spouseRankSelect");
const selfDivisionSelect = $("selfDivisionSelect");
const spouseDivisionSelect = $("spouseDivisionSelect");
const selfSalaryInput = $("selfSalaryInput");
const spouseSalaryInput = $("spouseSalaryInput");
const targetYearSelect = $("targetYearSelect");
const opiModeSelect = $("opiModeSelect");
const scenarioSelect = $("scenarioSelect");
const benefitsInput = $("benefitsInput");
const includeOpiToggle = $("includeOpiToggle");
const includeTaiToggle = $("includeTaiToggle");
const includeBenefitsToggle = $("includeBenefitsToggle");
const customOpiRateInput = $("customOpiRateInput");
const taiFirstHalfInput = $("taiFirstHalfInput");
const taiSecondHalfInput = $("taiSecondHalfInput");
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

function syncRecommendedSalary(select, input, hintId) {
  const preset = rankMap[select.value] || rankPresets[0];
  input.value = String(preset.defaultSalary);
  setText(hintId, `추천 연봉 예시: ${formatKoreanAmount(preset.defaultSalary)}`);
}

function updateHints() {
  setText("selfSalaryHint", `추천 연봉 예시: ${formatKoreanAmount((rankMap[selfRankSelect.value] || rankPresets[0]).defaultSalary)}`);
  setText("spouseSalaryHint", `추천 연봉 예시: ${formatKoreanAmount((rankMap[spouseRankSelect.value] || rankPresets[1]).defaultSalary)}`);

  const opiMode = opiModes.find((item) => item.code === opiModeSelect.value) || opiModes[0];
  setText("opiModeHint", opiMode.description);

  const preset = scenarioMap[scenarioSelect.value] || scenarioPresets[1];
  setText("scenarioHint", `TAI 상반기 ${preset.taiFirstHalf.toFixed(2)} / 하반기 ${preset.taiSecondHalf.toFixed(2)}`);

  const benefit = toNumber(benefitsInput);
  setText("benefitsHint", getMode() === "COUPLE" ? `1인당 ${formatKoreanAmount(benefit)} / 부부 합산 ${formatKoreanAmount(benefit * 2)}` : `개인 복지 ${formatKoreanAmount(benefit)}`);
}

function normalizeControls() {
  spouseBlock.hidden = getMode() !== "COUPLE";

  if (targetYearSelect.value !== "2026" && opiModeSelect.value === "ACTUAL") {
    opiModeSelect.value = "SCENARIO";
  }

  const actualOption = opiModeSelect.querySelector('option[value="ACTUAL"]');
  if (actualOption) actualOption.disabled = targetYearSelect.value !== "2026";

  const preset = scenarioMap[scenarioSelect.value] || scenarioPresets[1];
  if (document.activeElement !== taiFirstHalfInput) taiFirstHalfInput.value = String(preset.taiFirstHalf);
  if (document.activeElement !== taiSecondHalfInput) taiSecondHalfInput.value = String(preset.taiSecondHalf);

  updateHints();
}

function resolveOpiRate(divisionCode) {
  const division = divisionMap[divisionCode] || divisions[0];
  const customRate = toNumber(customOpiRateInput);
  if (customRate > 0) return customRate;
  if (targetYearSelect.value === "2026" && opiModeSelect.value === "ACTUAL") return division.actual2026Rate;
  return division.scenarioRates[scenarioSelect.value] || division.scenarioRates.BASE;
}

function calculatePerson(annualSalary, divisionCode) {
  const monthlyBase = annualSalary / 12;
  const opiRate = resolveOpiRate(divisionCode);
  const taiFirst = toNumber(taiFirstHalfInput);
  const taiSecond = toNumber(taiSecondHalfInput);
  const opiAmount = isChecked(includeOpiToggle) ? annualSalary * opiRate : 0;
  const taiAmount = isChecked(includeTaiToggle) ? monthlyBase * (taiFirst + taiSecond) : 0;
  const benefitsAmount = isChecked(includeBenefitsToggle) ? toNumber(benefitsInput) : 0;
  const totalComp = annualSalary + opiAmount + taiAmount + benefitsAmount;

  return {
    annualSalary,
    opiRate,
    opiAmount,
    taiAmount,
    benefitsAmount,
    totalComp,
    monthlyBase,
    monthlyCompView: totalComp / 12,
    monthlyBonusLift: (totalComp - annualSalary) / 12
  };
}

function aggregateResults() {
  const mode = getMode();
  const self = calculatePerson(toNumber(selfSalaryInput), selfDivisionSelect.value);
  const spouse = mode === "COUPLE" ? calculatePerson(toNumber(spouseSalaryInput), spouseDivisionSelect.value) : null;

  const totals = {
    annualSalary: self.annualSalary + (spouse ? spouse.annualSalary : 0),
    opiAmount: self.opiAmount + (spouse ? spouse.opiAmount : 0),
    taiAmount: self.taiAmount + (spouse ? spouse.taiAmount : 0),
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
  const subtitle = targetYearSelect.value === "2026" && opiModeSelect.value === "ACTUAL"
    ? "2026 실제 기준 모드"
    : `${targetYearSelect.value} ${scenarioMap[scenarioSelect.value].label} 시나리오`;

  setText("resultHeadline", isCouple ? "부부 총보상 핵심 카드" : "개인 총보상 핵심 카드");
  setText("resultSubcopy", subtitle);
  setText("salaryCardLabel", isCouple ? "부부 연봉 합산" : "연봉");
  setText("salarySummary", formatKoreanAmount(result.totals.annualSalary));
  setText("salarySummaryNote", isCouple ? `1인당 평균 ${formatKoreanAmount(result.totals.annualSalary / 2)}` : `평균 직원 보수 ${formatKoreanAmount(averageCompensation)}`);
  setText("opiSummary", formatKoreanAmount(result.totals.opiAmount));
  setText("opiSummaryNote", `${isCouple ? "합산" : divisionMap[selfDivisionSelect.value].actualLabel}`);
  setText("taiSummary", formatKoreanAmount(result.totals.taiAmount));
  setText("taiSummaryNote", `상반기 ${taiFirstHalfInput.value} / 하반기 ${taiSecondHalfInput.value}`);
  setText("totalSummary", formatKoreanAmount(result.totals.totalComp));
  setText("totalSummaryNote", `복지 ${formatKoreanAmount(result.totals.benefitsAmount)}`);
  setText("monthlySummary", formatKoreanAmount(result.totals.monthlyCompView));
  setText("monthlySummaryNote", isCouple ? `1인당 평균 ${formatKoreanAmount(result.totals.monthlyCompView / 2)}` : `월 기본 ${formatKoreanAmount(result.totals.monthlyBase)}`);
}

function renderSummaryReport(result) {
  const isCouple = result.mode === "COUPLE";
  const rows = [
    [isCouple ? "부부 연봉 합산" : "연봉", formatWon(result.totals.annualSalary), false],
    [isCouple ? "부부 OPI 합산" : "OPI", formatWon(result.totals.opiAmount), false],
    [isCouple ? "부부 TAI 합산" : "TAI", formatWon(result.totals.taiAmount), false],
    [isCouple ? "부부 복지 합산" : "복지", formatWon(result.totals.benefitsAmount), false],
    [isCouple ? "부부 연 총보상" : "연 총보상", formatWon(result.totals.totalComp), true],
    ["월 기본 체감", formatWon(result.totals.monthlyBase), false],
    [isCouple ? "부부 월평균 총보상" : "월 총보상 체감", formatWon(result.totals.monthlyCompView), true],
    ["월 성과급 포함 증가분", formatWon(result.totals.monthlyBonusLift), true]
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
  const sampleDivision = selfDivisionSelect.value;
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

function renderScenarioYears(result) {
  const currentYear = targetYearSelect.value;
  $("scenarioYearGrid").innerHTML = yearOptions.map((year) => {
    const savedYear = targetYearSelect.value;
    const savedMode = opiModeSelect.value;
    targetYearSelect.value = year.code;
    if (year.code !== "2026") opiModeSelect.value = "SCENARIO";
    const rerun = aggregateResults();
    const total = rerun.totals.totalComp;
    const note = year.code === "2026" && savedMode === "ACTUAL" ? "실제 기준" : "시뮬레이션";
    targetYearSelect.value = savedYear;
    opiModeSelect.value = savedMode;

    return `
      <article class="scenario-year-card${currentYear === year.code ? " is-active" : ""}">
        <p>${year.label}</p>
        <strong>${formatKoreanAmount(total)}</strong>
        <span>${note}</span>
      </article>
    `;
  }).join("");
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
  const result = aggregateResults();
  renderSummary(result);
  renderSummaryReport(result);
  renderNetReport(result);
  renderRankMatrix();
  renderScenarioYears(result);
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
  spouseRankSelect.value = rankPresets[1].code;
  selfDivisionSelect.value = divisions[1].code;
  spouseDivisionSelect.value = divisions[0].code;
  syncRecommendedSalary(selfRankSelect, selfSalaryInput, "selfSalaryHint");
  syncRecommendedSalary(spouseRankSelect, spouseSalaryInput, "spouseSalaryHint");
  targetYearSelect.value = "2026";
  opiModeSelect.value = "ACTUAL";
  scenarioSelect.value = "BASE";
  benefitsInput.value = String(defaultBenefits);
  includeOpiToggle.checked = true;
  includeTaiToggle.checked = true;
  includeBenefitsToggle.checked = true;
  customOpiRateInput.value = "0";
  taiFirstHalfInput.value = "0.5";
  taiSecondHalfInput.value = "0.5";
  includeNetEstimateToggle.checked = true;
  render();
}

[selfRankSelect, spouseRankSelect].forEach((select) => {
  select?.addEventListener("change", () => {
    if (select === selfRankSelect) syncRecommendedSalary(selfRankSelect, selfSalaryInput, "selfSalaryHint");
    if (select === spouseRankSelect) syncRecommendedSalary(spouseRankSelect, spouseSalaryInput, "spouseSalaryHint");
    render();
  });
});

[selfDivisionSelect, spouseDivisionSelect, selfSalaryInput, spouseSalaryInput, targetYearSelect, opiModeSelect, scenarioSelect, benefitsInput, includeOpiToggle, includeTaiToggle, includeBenefitsToggle, customOpiRateInput, taiFirstHalfInput, taiSecondHalfInput, includeNetEstimateToggle, modeSingle, modeCouple].forEach((element) => {
  element?.addEventListener(element.type === "checkbox" || element.type === "radio" ? "change" : "input", render);
  element?.addEventListener("change", render);
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
