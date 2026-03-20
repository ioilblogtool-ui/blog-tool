const $ = (id) => document.getElementById(id);

const configNode = $("skHynixCompensationConfig");

if (!configNode) {
  throw new Error("sk hynix compensation config is missing");
}

const {
  rankPresets,
  yearOptions,
  payoutModes,
  scenarioOptions,
  psMultipliersByYear,
  comparisonBenchmarks,
  welfareDefault,
  actualPsMultiplier,
  immediatePsRatio,
  deferredPsRatio,
  averageCompensation
} = JSON.parse(configNode.textContent || "{}");

const rankMap = Object.fromEntries(rankPresets.map((item) => [item.code, item]));
const scenarioMap = Object.fromEntries(scenarioOptions.map((item) => [item.code, item]));

const selfRankSelect = $("selfRankSelect");
const spouseRankSelect = $("spouseRankSelect");
const selfSalaryInput = $("selfSalaryInput");
const spouseSalaryInput = $("spouseSalaryInput");
const targetYearSelect = $("targetYearSelect");
const payoutModeSelect = $("payoutModeSelect");
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
  const eok = Math.floor(amount / 100000000);
  const man = Math.floor((amount % 100000000) / 10000);

  if (eok > 0 && man > 0) return `${eok}억 ${new Intl.NumberFormat("ko-KR").format(man)}만원`;
  if (eok > 0) return `${eok}억원`;
  return `${new Intl.NumberFormat("ko-KR").format(man)}만원`;
}

function formatRatio(value) {
  return `${Number(value || 0).toFixed(2)}배`;
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

function getMode() {
  return modeCouple && modeCouple.checked ? "COUPLE" : "SINGLE";
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
  const monthlyNet = Math.max(0, monthlyGross - deductions);

  return {
    monthlyGross,
    monthlyNet
  };
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

function normalizeControls() {
  const year = targetYearSelect.value;
  const actualOption = payoutModeSelect.querySelector('option[value="ACTUAL"]');
  if (actualOption) actualOption.disabled = year !== "2026";
  if (year !== "2026" && payoutModeSelect.value === "ACTUAL") {
    payoutModeSelect.value = "SCENARIO";
  }

  const payoutMode = payoutModes.find((item) => item.code === payoutModeSelect.value) || payoutModes[0];
  setText("payoutModeHint", payoutMode.description);

  const scenario = scenarioMap[scenarioSelect.value] || scenarioOptions[1];
  setText("scenarioHint", `PI 프리셋 ${scenario.piRatio}배 기준`);

  const welfareLabel = getMode() === "COUPLE"
    ? `1인당 복지 ${formatKoreanAmount(toNumber(welfareInput))} / 부부 합산 ${formatKoreanAmount(toNumber(welfareInput) * 2)}`
    : `개인 복지 ${formatKoreanAmount(toNumber(welfareInput))}`;
  setText("welfareHint", welfareLabel);

  spouseBlock.hidden = getMode() !== "COUPLE";
}

function getPsMultiplier(year, payoutMode, scenarioCode) {
  if (year === "2026" && payoutMode === "ACTUAL") return actualPsMultiplier;

  const mapping = psMultipliersByYear[year] || psMultipliersByYear["2026"];
  if (scenarioCode === "CONSERVATIVE") return mapping.conservative;
  if (scenarioCode === "AGGRESSIVE") return mapping.aggressive;
  return mapping.base;
}

function calculatePerson(annualSalary, year, payoutMode, scenarioCode, includePi, includeWelfare, welfareAmount) {
  const baseSalary = annualSalary / 20;
  const psMultiplier = getPsMultiplier(year, payoutMode, scenarioCode);
  const psAmount = baseSalary * psMultiplier;
  const piRatio = (scenarioMap[scenarioCode] || scenarioOptions[1]).piRatio;
  const piAmount = includePi ? baseSalary * piRatio : 0;
  const welfareAmountApplied = includeWelfare ? welfareAmount : 0;
  const totalComp = annualSalary + psAmount + piAmount + welfareAmountApplied;

  return {
    annualSalary,
    baseSalary,
    psAmount,
    psImmediate: psAmount * immediatePsRatio,
    psDeferred: psAmount * deferredPsRatio,
    piAmount,
    welfareAmount: welfareAmountApplied,
    totalComp,
    monthlyBase: annualSalary / 12,
    monthlyTotal: totalComp / 12
  };
}

function aggregateResults() {
  const mode = getMode();
  const year = targetYearSelect.value;
  const payoutMode = payoutModeSelect.value;
  const scenarioCode = scenarioSelect.value;
  const welfareAmount = toNumber(welfareInput);
  const includePi = isChecked(includePiToggle);
  const includeWelfare = isChecked(includeWelfareToggle);

  const selfResult = calculatePerson(toNumber(selfSalaryInput), year, payoutMode, scenarioCode, includePi, includeWelfare, welfareAmount);
  const spouseResult = mode === "COUPLE"
    ? calculatePerson(toNumber(spouseSalaryInput), year, payoutMode, scenarioCode, includePi, includeWelfare, welfareAmount)
    : null;

  const totals = {
    annualSalary: selfResult.annualSalary + (spouseResult ? spouseResult.annualSalary : 0),
    baseSalary: selfResult.baseSalary + (spouseResult ? spouseResult.baseSalary : 0),
    psAmount: selfResult.psAmount + (spouseResult ? spouseResult.psAmount : 0),
    psImmediate: selfResult.psImmediate + (spouseResult ? spouseResult.psImmediate : 0),
    psDeferred: selfResult.psDeferred + (spouseResult ? spouseResult.psDeferred : 0),
    piAmount: selfResult.piAmount + (spouseResult ? spouseResult.piAmount : 0),
    welfareAmount: selfResult.welfareAmount + (spouseResult ? spouseResult.welfareAmount : 0),
    totalComp: selfResult.totalComp + (spouseResult ? spouseResult.totalComp : 0),
    monthlyBase: selfResult.monthlyBase + (spouseResult ? spouseResult.monthlyBase : 0),
    monthlyTotal: selfResult.monthlyTotal + (spouseResult ? spouseResult.monthlyTotal : 0)
  };

  return { mode, year, payoutMode, scenarioCode, totals };
}

function renderSummary(result) {
  const { mode, year, payoutMode, scenarioCode, totals } = result;
  const isCouple = mode === "COUPLE";
  const scenarioLabel = (scenarioMap[scenarioCode] || scenarioOptions[1]).label;
  const payoutLabel = year === "2026" && payoutMode === "ACTUAL" ? "2026 실제 지급 모드" : `${year} ${scenarioLabel} 시나리오`;

  setText("resultHeadline", isCouple ? "부부 총보상 핵심 카드" : "개인 총보상 핵심 카드");
  setText("resultSubcopy", payoutLabel);
  setText("salaryCardLabel", isCouple ? "부부 연봉 합산" : "연봉");
  setText("salarySummary", formatKoreanAmount(totals.annualSalary));
  setText("salarySummaryNote", isCouple ? `1인당 평균 ${formatKoreanAmount(totals.annualSalary / 2)}` : `평균 직원 보수 ${formatKoreanAmount(averageCompensation)}`);
  setText("psSummary", formatKoreanAmount(totals.psAmount));
  setText("psSummaryNote", `즉시 ${formatKoreanAmount(totals.psImmediate)} / 이연 ${formatKoreanAmount(totals.psDeferred)}`);
  setText("piSummary", formatKoreanAmount(totals.piAmount));
  setText("piSummaryNote", isChecked(includePiToggle) ? `${scenarioLabel} PI` : "PI 미반영");
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
    ["월 증가분", formatWon(totals.monthlyTotal - totals.monthlyBase), true]
  ];

  $("summaryReportList").innerHTML = rows
    .map(([label, value, highlight]) => `
      <div class="report-row${highlight ? " is-highlight" : ""}">
        <span class="report-row__label">${label}</span>
        <strong class="report-row__value">${value}</strong>
      </div>
    `)
    .join("");
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
    ["안내", "참고 추정치"]
  ];

  $("netReportList").innerHTML = rows
    .map(([label, value]) => `
      <div class="report-row">
        <span class="report-row__label">${label}</span>
        <strong class="report-row__value">${value}</strong>
      </div>
    `)
    .join("");
}

function renderRankMatrix() {
  const year = targetYearSelect.value;
  const payoutMode = payoutModeSelect.value;
  const scenarioCode = scenarioSelect.value;
  const includePi = isChecked(includePiToggle);
  const includeWelfare = isChecked(includeWelfareToggle);
  const welfareAmount = toNumber(welfareInput);

  $("rankMatrixList").innerHTML = rankPresets
    .map((rank) => {
      const row = calculatePerson(rank.defaultSalary, year, payoutMode, scenarioCode, includePi, includeWelfare, welfareAmount);
      return `
        <div class="matrix-row">
          <span class="matrix-row__cell matrix-row__cell--label">${rank.label}</span>
          <span class="matrix-row__cell">${formatKoreanAmount(rank.defaultSalary)}</span>
          <span class="matrix-row__cell">${formatKoreanAmount(row.psAmount)}</span>
          <span class="matrix-row__cell matrix-row__cell--strong">${formatKoreanAmount(row.totalComp)}</span>
          <span class="matrix-row__cell matrix-row__cell--strong">${formatKoreanAmount(row.monthlyTotal)}</span>
        </div>
      `;
    })
    .join("");
}

function renderScenarioYears(result) {
  const { mode, payoutMode, scenarioCode } = result;
  const includePi = isChecked(includePiToggle);
  const includeWelfare = isChecked(includeWelfareToggle);
  const welfareAmount = toNumber(welfareInput);
  const selfAnnual = toNumber(selfSalaryInput);
  const spouseAnnual = mode === "COUPLE" ? toNumber(spouseSalaryInput) : 0;

  $("scenarioYearGrid").innerHTML = yearOptions
    .map((yearItem) => {
      const effectivePayoutMode = yearItem.code === "2026" ? payoutMode : "SCENARIO";
      const selfYear = calculatePerson(selfAnnual, yearItem.code, effectivePayoutMode, scenarioCode, includePi, includeWelfare, welfareAmount);
      const spouseYear = mode === "COUPLE"
        ? calculatePerson(spouseAnnual, yearItem.code, effectivePayoutMode, scenarioCode, includePi, includeWelfare, welfareAmount)
        : null;
      const total = selfYear.totalComp + (spouseYear ? spouseYear.totalComp : 0);
      const psMultiplier = getPsMultiplier(yearItem.code, effectivePayoutMode, scenarioCode);
      const note = yearItem.code === "2026" && effectivePayoutMode === "ACTUAL" ? "실제 지급" : "시나리오";

      return `
        <article class="scenario-year-card${targetYearSelect.value === yearItem.code ? " is-active" : ""}">
          <p>${yearItem.label}</p>
          <strong>${formatKoreanAmount(total)}</strong>
          <span>PS ${formatRatio(psMultiplier)} / ${note}</span>
        </article>
      `;
    })
    .join("");
}

function renderComparisons(result) {
  const annualTotal = result.totals.totalComp;

  $("comparisonGrid").innerHTML = comparisonBenchmarks
    .map((item) => {
      const gap = annualTotal - item.annualTotal;
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
    })
    .join("");
}

function render() {
  normalizeControls();
  updateSalaryHint(selfRankSelect, "selfSalaryHint");
  updateSalaryHint(spouseRankSelect, "spouseSalaryHint");

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
  }, 1600);
}

function resetPage() {
  modeSingle.checked = true;
  selfRankSelect.value = rankPresets[0].code;
  spouseRankSelect.value = rankPresets[1].code;
  syncRecommendedSalary(selfRankSelect, selfSalaryInput, "selfSalaryHint");
  syncRecommendedSalary(spouseRankSelect, spouseSalaryInput, "spouseSalaryHint");
  targetYearSelect.value = "2026";
  payoutModeSelect.value = "ACTUAL";
  scenarioSelect.value = "BASE";
  welfareInput.value = String(welfareDefault);
  includePiToggle.checked = true;
  includeWelfareToggle.checked = true;
  includeNetEstimateToggle.checked = true;
  render();
}

function bindInput(select, input, hintId) {
  select.addEventListener("change", () => {
    syncRecommendedSalary(select, input, hintId);
    render();
  });

  input.addEventListener("input", () => {
    updateSalaryHint(select, hintId);
    render();
  });
}

bindInput(selfRankSelect, selfSalaryInput, "selfSalaryHint");
bindInput(spouseRankSelect, spouseSalaryInput, "spouseSalaryHint");
[targetYearSelect, payoutModeSelect, scenarioSelect, welfareInput, includePiToggle, includeWelfareToggle, includeNetEstimateToggle, modeSingle, modeCouple].forEach((element) => {
  element?.addEventListener(element.type === "checkbox" || element.type === "radio" ? "change" : "input", render);
  element?.addEventListener("change", render);
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

