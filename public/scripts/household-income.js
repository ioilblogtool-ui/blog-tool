const $ = (id) => document.getElementById(id);

const configNode = $("householdIncomeConfig");

if (!configNode) {
  throw new Error("household income config is missing");
}

const {
  averageDisposableIncome,
  averageHouseholdIncome,
  deductionPresets,
  householdSizeOptions,
  ratioCards,
  yearOptions
} = JSON.parse(configNode.textContent || "{}");

const householdSizeMap = Object.fromEntries(householdSizeOptions.map((item) => [item.code, item]));
const deductionPresetMap = Object.fromEntries(deductionPresets.map((item) => [item.code, item]));

const mySalaryInput = $("mySalaryInput");
const myBonusInput = $("myBonusInput");
const spouseSalaryInput = $("spouseSalaryInput");
const spouseBonusInput = $("spouseBonusInput");
const otherAnnualCompInput = $("otherAnnualCompInput");
const householdSizeSelect = $("householdSizeSelect");
const targetYearSelect = $("targetYearSelect");
const includeNetEstimateToggle = $("includeNetEstimateToggle");
const includeNonTaxableToggle = $("includeNonTaxableToggle");
const dependentsInput = $("dependentsInput");
const deductionPresetSelect = $("deductionPresetSelect");

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

function formatPercent(value) {
  return `${Math.round(Number(value || 0) * 100)}%`;
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

function estimateEarnedTakeHome(annualAmount) {
  const includeNonTaxable = isChecked(includeNonTaxableToggle);
  const deductionPreset = deductionPresetMap[deductionPresetSelect.value] || deductionPresets[1];
  const dependents = Math.max(0, toNumber(dependentsInput));

  const monthlyGross = annualAmount / 12;
  const nonTaxableMonthly = includeNonTaxable ? Math.min(200000, monthlyGross * 0.04) : 0;
  const taxableMonthly = Math.max(0, monthlyGross - nonTaxableMonthly);
  const pension = Math.min(taxableMonthly * 0.045, 280000);
  const health = taxableMonthly * 0.03545;
  const longTermCare = health * 0.1295;
  const employment = taxableMonthly * 0.009;
  const annualDeduction = deductionPreset.baseDeduction + (deductionPreset.dependentDeduction * dependents);
  const annualTaxableApprox = Math.max(0, taxableMonthly * 12 - annualDeduction);

  let incomeTaxRate = 0.06;
  if (annualTaxableApprox >= 30000000 && annualTaxableApprox < 50000000) incomeTaxRate = 0.1;
  else if (annualTaxableApprox >= 50000000 && annualTaxableApprox < 70000000) incomeTaxRate = 0.14;
  else if (annualTaxableApprox >= 70000000 && annualTaxableApprox < 100000000) incomeTaxRate = 0.17;
  else if (annualTaxableApprox >= 100000000 && annualTaxableApprox < 140000000) incomeTaxRate = 0.2;
  else if (annualTaxableApprox >= 140000000) incomeTaxRate = 0.24;

  const incomeTax = taxableMonthly * incomeTaxRate;
  const localIncomeTax = incomeTax * 0.1;
  const deductions = pension + health + longTermCare + employment + incomeTax + localIncomeTax;

  return Math.max(0, (monthlyGross - deductions) * 12);
}

function estimateOtherTakeHome(otherAnnualComp) {
  if (otherAnnualComp <= 0) return 0;
  return otherAnnualComp * (isChecked(includeNonTaxableToggle) ? 0.96 : 0.9);
}

function getHouseholdBand(annualGross) {
  if (annualGross < 50000000) return { label: "5천만 원 미만", note: "세전 총소득 기준" };
  if (annualGross < 80000000) return { label: "5천만~8천만 원", note: "세전 총소득 기준" };
  if (annualGross < 120000000) return { label: "8천만~1억 2천만 원", note: "세전 총소득 기준" };
  return { label: "1억 2천만 원 이상", note: "세전 총소득 기준" };
}

function updateHints() {
  const householdSize = householdSizeMap[householdSizeSelect.value] || householdSizeOptions[0];
  const deductionPreset = deductionPresetMap[deductionPresetSelect.value] || deductionPresets[1];
  setText("householdSizeHint", householdSize.note);
  setText("deductionPresetHint", deductionPreset.description);
}

function aggregateResults() {
  const mySalary = toNumber(mySalaryInput);
  const myBonus = toNumber(myBonusInput);
  const spouseSalary = toNumber(spouseSalaryInput);
  const spouseBonus = toNumber(spouseBonusInput);
  const otherAnnualComp = toNumber(otherAnnualCompInput);
  const householdGrossAnnual = mySalary + myBonus + spouseSalary + spouseBonus + otherAnnualComp;
  const householdGrossMonthly = householdGrossAnnual / 12;
  const selectedHouseholdMedianIncome = (householdSizeMap[householdSizeSelect.value] || householdSizeOptions[0]).medianMonthlyIncome;
  const estimatedAnnualTakeHome =
    estimateEarnedTakeHome(mySalary + myBonus) +
    estimateEarnedTakeHome(spouseSalary + spouseBonus) +
    estimateOtherTakeHome(otherAnnualComp);
  const estimatedMonthlyTakeHome = estimatedAnnualTakeHome / 12;
  const medianIncomeRatio = householdGrossMonthly / selectedHouseholdMedianIncome;
  const averageIncomeRatio = householdGrossAnnual / averageHouseholdIncome;
  const disposableIncomeRatio = estimatedAnnualTakeHome / averageDisposableIncome;

  return {
    mySalary,
    myBonus,
    spouseSalary,
    spouseBonus,
    otherAnnualComp,
    householdGrossAnnual,
    householdGrossMonthly,
    estimatedAnnualTakeHome,
    estimatedMonthlyTakeHome,
    selectedHouseholdMedianIncome,
    medianIncomeRatio,
    averageIncomeRatio,
    disposableIncomeRatio,
    band: getHouseholdBand(householdGrossAnnual)
  };
}

function renderSummary(result) {
  const householdSize = householdSizeMap[householdSizeSelect.value] || householdSizeOptions[0];

  setText("resultHeadline", "우리집 소득 핵심 카드");
  setText("resultSubcopy", `${targetYearSelect.value} ${householdSize.label} 가구 기준`);
  setText("householdAnnualSummary", formatKoreanAmount(result.householdGrossAnnual));
  setText("householdAnnualSummaryNote", `평균 가구소득 ${formatPercent(result.averageIncomeRatio)}`);
  setText("householdMonthlySummary", formatKoreanAmount(result.householdGrossMonthly));
  setText("householdMonthlySummaryNote", `월 기준 중위소득 ${formatPercent(result.medianIncomeRatio)}`);
  setText("takeHomeSummary", formatKoreanAmount(result.estimatedAnnualTakeHome));
  setText("takeHomeSummaryNote", `월 추정 ${formatKoreanAmount(result.estimatedMonthlyTakeHome)}`);
  setText("averageRatioSummary", formatPercent(result.averageIncomeRatio));
  setText("averageRatioSummaryNote", "2024 평균 가구소득 기준");
  setText("medianRatioSummary", formatPercent(result.medianIncomeRatio));
  setText("medianRatioSummaryNote", `${householdSize.label} 가구 월 기준`);
}

function renderAnnualSummary(result) {
  const rows = [
    ["본인 연봉", formatWon(result.mySalary), false],
    ["본인 성과급", formatWon(result.myBonus), false],
    ["배우자 연소득", formatWon(result.spouseSalary), false],
    ["배우자 성과급", formatWon(result.spouseBonus), false],
    ["기타 연 보상", formatWon(result.otherAnnualComp), false],
    ["가구 총소득", formatWon(result.householdGrossAnnual), true]
  ];

  $("annualSummaryList").innerHTML = rows.map(([label, value, highlight]) => `
    <div class="report-row${highlight ? " is-highlight" : ""}">
      <span class="report-row__label">${label}</span>
      <strong class="report-row__value">${value}</strong>
    </div>
  `).join("");
}

function renderMonthlySummary(result) {
  const rows = [
    ["가구 월 총소득 체감", formatWon(result.householdGrossMonthly), false],
    ["가구 월 실수령 추정", isChecked(includeNetEstimateToggle) ? formatWon(result.estimatedMonthlyTakeHome) : "숨김", true],
    ["월 추가 소득 효과", formatWon(result.householdGrossMonthly - ((result.mySalary + result.spouseSalary) / 12)), false],
    ["참고", "실수령 추정은 단순 계산", false]
  ];

  $("monthlySummaryList").innerHTML = rows.map(([label, value, highlight]) => `
    <div class="report-row${highlight ? " is-highlight" : ""}">
      <span class="report-row__label">${label}</span>
      <strong class="report-row__value">${value}</strong>
    </div>
  `).join("");
}

function renderPositionBars(result) {
  const maxValue = Math.max(result.householdGrossMonthly, result.selectedHouseholdMedianIncome, averageHouseholdIncome / 12);
  const barItems = [
    { label: "기준 중위소득", value: result.selectedHouseholdMedianIncome, note: "가구원 수별 월 기준" },
    { label: "평균 가구소득", value: averageHouseholdIncome / 12, note: "2024 평균 연소득 ÷ 12" },
    { label: "우리집 위치", value: result.householdGrossMonthly, note: "현재 입력값 기준" }
  ];

  $("positionBars").innerHTML = barItems.map((item) => `
    <div class="position-bar-row${item.label === "우리집 위치" ? " is-accent" : ""}">
      <div class="position-bar-row__head">
        <span>${item.label}</span>
        <strong>${formatWon(item.value)}</strong>
      </div>
      <div class="position-bar-track">
        <span class="position-bar-fill" style="width:${Math.max(12, (item.value / maxValue) * 100)}%"></span>
      </div>
      <p>${item.note}</p>
    </div>
  `).join("");
}

function renderBand(result) {
  $("incomeBandCard").innerHTML = `
    <p>${result.band.label}</p>
    <strong>${formatKoreanAmount(result.householdGrossAnnual)}</strong>
    <span>${result.band.note}</span>
    <em>${result.householdGrossAnnual >= averageHouseholdIncome ? "평균 가구소득 이상" : "평균 가구소득 미만"}</em>
  `;
}

function renderRatioCards(result) {
  const values = {
    AVERAGE: { ratio: result.averageIncomeRatio, amount: averageHouseholdIncome, suffix: "연 기준" },
    MEDIAN: { ratio: result.medianIncomeRatio, amount: result.selectedHouseholdMedianIncome, suffix: "월 기준" },
    DISPOSABLE: { ratio: result.disposableIncomeRatio, amount: averageDisposableIncome, suffix: "연 기준" }
  };

  $("ratioCardGrid").innerHTML = ratioCards.map((item) => {
    const current = values[item.code];
    const toneClass = current.ratio >= 1 ? "is-positive" : "is-muted";
    return `
      <article class="comparison-card ${toneClass}">
        <p>${item.label}</p>
        <strong>${formatPercent(current.ratio)}</strong>
        <span>${item.note}</span>
        <em>비교선 ${formatKoreanAmount(current.amount)} ${current.suffix}</em>
      </article>
    `;
  }).join("");
}

function render() {
  updateHints();
  const result = aggregateResults();
  renderSummary(result);
  renderAnnualSummary(result);
  renderMonthlySummary(result);
  renderPositionBars(result);
  renderBand(result);
  renderRatioCards(result);
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
  mySalaryInput.value = "52000000";
  myBonusInput.value = "6000000";
  spouseSalaryInput.value = "28000000";
  spouseBonusInput.value = "2000000";
  otherAnnualCompInput.value = "3000000";
  householdSizeSelect.value = "3";
  targetYearSelect.value = yearOptions[0].code;
  includeNetEstimateToggle.checked = true;
  includeNonTaxableToggle.checked = true;
  dependentsInput.value = "1";
  deductionPresetSelect.value = "SIMPLE";
  render();
}

[
  mySalaryInput,
  myBonusInput,
  spouseSalaryInput,
  spouseBonusInput,
  otherAnnualCompInput,
  householdSizeSelect,
  targetYearSelect,
  includeNetEstimateToggle,
  includeNonTaxableToggle,
  dependentsInput,
  deductionPresetSelect
].forEach((element) => {
  element?.addEventListener(element.type === "checkbox" ? "change" : "input", render);
  element?.addEventListener("change", render);
});

$("calcHouseholdIncomeBtn")?.addEventListener("click", render);
$("resetHouseholdIncomeBtn")?.addEventListener("click", () => {
  resetPage();
  flashButton($("resetHouseholdIncomeBtn"), "초기화됨");
});
$("copyHouseholdIncomeLinkBtn")?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    flashButton($("copyHouseholdIncomeLinkBtn"), "링크 복사됨");
  } catch {
    flashButton($("copyHouseholdIncomeLinkBtn"), "복사 실패");
  }
});

resetPage();
