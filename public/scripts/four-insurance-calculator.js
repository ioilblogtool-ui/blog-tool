const configEl = document.getElementById("ficConfig");
const { rates = {}, defaults = {}, presets = [] } = JSON.parse(configEl?.textContent || "{}");

const $ = (id) => document.getElementById(id);
const page = document.querySelector('[data-calculator="four-insurance-calculator"]');

function formatWon(value) {
  return `${Math.round(Number(value || 0)).toLocaleString("ko-KR")}원`;
}

function getNumber(id, fallback = 0) {
  const value = Number($(id)?.value);
  return Number.isFinite(value) ? value : fallback;
}

function getChecked(id, fallback = false) {
  const el = $(id);
  return el ? el.checked : fallback;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function taxableMonthlyPay(input) {
  return Math.max(0, input.monthlySalary - input.taxFreeAmount);
}

function calcNationalPension(monthlyPay, enabled) {
  if (!enabled) return 0;
  const base = clamp(
    monthlyPay,
    rates.nationalPensionMinMonthlyBase || 410000,
    rates.nationalPensionMaxMonthlyBase || 6590000
  );
  return base * (rates.nationalPensionEmployee || 0.0475);
}

function calcHealthInsurance(monthlyPay) {
  return monthlyPay * (rates.healthInsuranceEmployee || 0.03595);
}

function calcLongTermCare(healthInsurance) {
  return healthInsurance * (rates.longTermCareRateOnHealth || 0.1314);
}

function calcEmploymentInsurance(monthlyPay, enabled) {
  return enabled ? monthlyPay * (rates.employmentInsuranceEmployee || 0.009) : 0;
}

function calcSimpleAnnualTaxBase(annualTaxable, dependents, childrenUnder20) {
  const earnedIncomeDeduction = Math.min(12_000_000, Math.max(7_500_000, annualTaxable * 0.2));
  const personalDeduction = Math.max(1, dependents) * 1_500_000;
  const childDeduction = Math.max(0, childrenUnder20) * 150_000;
  return Math.max(0, annualTaxable - earnedIncomeDeduction - personalDeduction - childDeduction);
}

function calcProgressiveTax(taxBase) {
  const brackets = [
    { limit: 14_000_000, rate: 0.06, deduction: 0 },
    { limit: 50_000_000, rate: 0.15, deduction: 1_260_000 },
    { limit: 88_000_000, rate: 0.24, deduction: 5_760_000 },
    { limit: 150_000_000, rate: 0.35, deduction: 15_440_000 },
    { limit: 300_000_000, rate: 0.38, deduction: 19_940_000 },
    { limit: 500_000_000, rate: 0.4, deduction: 25_940_000 },
    { limit: 1_000_000_000, rate: 0.42, deduction: 35_940_000 },
    { limit: Infinity, rate: 0.45, deduction: 65_940_000 },
  ];
  const bracket = brackets.find((item) => taxBase <= item.limit) || brackets[0];
  const annualTax = Math.max(0, taxBase * bracket.rate - bracket.deduction);
  const credit = annualTax <= 1_300_000 ? annualTax * 0.55 : 715_000 + (annualTax - 1_300_000) * 0.3;
  return Math.max(0, annualTax - Math.min(740_000, credit));
}

function calcEstimatedIncomeTax(input, monthlyPay) {
  const annualTaxable = monthlyPay * 12;
  const taxBase = calcSimpleAnnualTaxBase(annualTaxable, input.dependents, input.childrenUnder20);
  return calcProgressiveTax(taxBase) / 12;
}

function calculate(input) {
  const taxablePay = taxableMonthlyPay(input);
  const nationalPension = calcNationalPension(taxablePay, input.applyNationalPension);
  const healthInsurance = calcHealthInsurance(taxablePay);
  const longTermCare = calcLongTermCare(healthInsurance);
  const employmentInsurance = calcEmploymentInsurance(taxablePay, input.applyEmploymentInsurance);
  const totalInsurance = nationalPension + healthInsurance + longTermCare + employmentInsurance;
  const estimatedIncomeTax = calcEstimatedIncomeTax(input, taxablePay);
  const estimatedLocalTax = estimatedIncomeTax * (rates.localIncomeTaxRate || 0.1);
  const totalDeduction = totalInsurance + estimatedIncomeTax + estimatedLocalTax;
  const employerShareTotal =
    nationalPension +
    healthInsurance +
    longTermCare +
    (input.applyEmploymentInsurance ? taxablePay * (rates.employmentInsuranceEmployerBase || 0.009) : 0);

  return {
    taxablePay,
    nationalPension,
    healthInsurance,
    longTermCare,
    employmentInsurance,
    totalInsurance,
    estimatedIncomeTax,
    estimatedLocalTax,
    totalDeduction,
    estimatedNetPay: Math.max(0, input.monthlySalary - totalDeduction),
    employerShareTotal,
  };
}

function getState() {
  return {
    monthlySalary: getNumber("ficMonthlySalary", defaults.monthlySalary || 4000000),
    taxFreeAmount: getNumber("ficTaxFreeAmount", defaults.taxFreeAmount || 200000),
    dependents: getNumber("ficDependents", defaults.dependents || 1),
    childrenUnder20: getNumber("ficChildrenUnder20", defaults.childrenUnder20 || 0),
    applyNationalPension: getChecked("ficApplyNationalPension", defaults.applyNationalPension !== false),
    applyEmploymentInsurance: getChecked("ficApplyEmploymentInsurance", defaults.applyEmploymentInsurance !== false),
    showEmployerShare: getChecked("ficShowEmployerShare", defaults.showEmployerShare !== false),
  };
}

function setText(id, value) {
  const el = $(id);
  if (el) el.textContent = value;
}

function renderBreakdown(result, state) {
  const tbody = $("ficBreakdownBody");
  if (!tbody) return;
  const rows = [
    ["국민연금", result.nationalPension, "기준소득월액 4.75%"],
    ["건강보험", result.healthInsurance, "보수월액 3.595%"],
    ["장기요양보험", result.longTermCare, "건강보험료의 13.14%"],
    ["고용보험", result.employmentInsurance, state.applyEmploymentInsurance ? "보수월액 0.9%" : "미적용"],
    ["근로소득세", result.estimatedIncomeTax, "간이 추정"],
    ["지방소득세", result.estimatedLocalTax, "소득세의 10%"],
  ];
  tbody.innerHTML = rows
    .map(
      ([label, amount, note]) => `
        <tr>
          <th>${label}</th>
          <td>${formatWon(amount)}</td>
          <td>${note}</td>
        </tr>
      `
    )
    .join("");
}

function render() {
  const state = getState();
  const result = calculate(state);

  setText("ficNetPay", formatWon(result.estimatedNetPay));
  setText("ficTotalInsurance", formatWon(result.totalInsurance));
  setText("ficTaxTotal", formatWon(result.estimatedIncomeTax + result.estimatedLocalTax));
  setText("ficTotalDeduction", formatWon(result.totalDeduction));
  setText("ficTaxablePay", formatWon(result.taxablePay));
  setText("ficNationalPension", formatWon(result.nationalPension));
  setText("ficHealthInsurance", formatWon(result.healthInsurance));
  setText("ficLongTermCare", formatWon(result.longTermCare));
  setText("ficEmploymentInsurance", formatWon(result.employmentInsurance));
  setText("ficEmployerShare", state.showEmployerShare ? formatWon(result.employerShareTotal) : "숨김");
  setText(
    "ficSummaryText",
    `월급 ${formatWon(state.monthlySalary)} 기준 예상 총 공제액은 ${formatWon(result.totalDeduction)}입니다.`
  );
  renderBreakdown(result, state);
}

function applyPreset(preset) {
  if (!preset) return;
  if ($("ficMonthlySalary")) $("ficMonthlySalary").value = preset.monthlySalary;
  if ($("ficTaxFreeAmount")) $("ficTaxFreeAmount").value = preset.taxFreeAmount;
  render();
}

function reset() {
  if ($("ficMonthlySalary")) $("ficMonthlySalary").value = defaults.monthlySalary || 4000000;
  if ($("ficTaxFreeAmount")) $("ficTaxFreeAmount").value = defaults.taxFreeAmount || 200000;
  if ($("ficDependents")) $("ficDependents").value = defaults.dependents || 1;
  if ($("ficChildrenUnder20")) $("ficChildrenUnder20").value = defaults.childrenUnder20 || 0;
  if ($("ficApplyNationalPension")) $("ficApplyNationalPension").checked = defaults.applyNationalPension !== false;
  if ($("ficApplyEmploymentInsurance")) $("ficApplyEmploymentInsurance").checked = defaults.applyEmploymentInsurance !== false;
  if ($("ficShowEmployerShare")) $("ficShowEmployerShare").checked = defaults.showEmployerShare !== false;
  render();
}

function copyLink() {
  const state = getState();
  const url = new URL(window.location.href);
  url.searchParams.set("salary", String(state.monthlySalary));
  url.searchParams.set("taxfree", String(state.taxFreeAmount));
  url.searchParams.set("dependents", String(state.dependents));
  navigator.clipboard?.writeText(url.toString());
}

function hydrateFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const pairs = [
    ["salary", "ficMonthlySalary"],
    ["taxfree", "ficTaxFreeAmount"],
    ["dependents", "ficDependents"],
  ];
  pairs.forEach(([key, id]) => {
    const value = params.get(key);
    if (value && $(id)) $(id).value = value;
  });
}

if (page) {
  hydrateFromQuery();
  page.querySelectorAll("input").forEach((input) => input.addEventListener("input", render));
  page.querySelectorAll(".fic-preset-btn").forEach((button, index) => {
    button.addEventListener("click", () => applyPreset(presets[index]));
  });
  $("resetFicBtn")?.addEventListener("click", reset);
  $("copyFicLinkBtn")?.addEventListener("click", copyLink);
  render();
}

