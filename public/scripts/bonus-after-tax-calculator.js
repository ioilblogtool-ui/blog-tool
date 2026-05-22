const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const configNode = document.getElementById("batConfig");

if (!configNode) {
  throw new Error("bonus after tax config is missing");
}

const {
  defaultInput,
  insuranceConfigs,
  taxBrackets,
  presets
} = JSON.parse(configNode.textContent || "{}");

const state = { ...defaultInput };
const numberFormatter = new Intl.NumberFormat("ko-KR");

function parseNumber(value) {
  return Number(String(value || "0").replace(/[^\d.-]/g, "")) || 0;
}

function formatWon(value) {
  return `${numberFormatter.format(Math.round(Number(value || 0)))}원`;
}

function formatMan(value) {
  const amount = Math.round(Number(value || 0));
  const eok = Math.floor(amount / 100000000);
  const man = Math.floor((amount % 100000000) / 10000);

  if (eok > 0 && man > 0) return `${eok}억 ${numberFormatter.format(man)}만원`;
  if (eok > 0) return `${eok}억원`;
  return `${numberFormatter.format(man)}만원`;
}

function formatPercent(value, digits = 1) {
  return `${Number(value || 0).toFixed(digits)}%`;
}

function setText(selector, value) {
  const element = $(selector);
  if (element) element.textContent = value;
}

function setInputValue(name, value) {
  const input = $(`[data-bat="${name}"]`);
  if (!input) return;
  if (input.type === "checkbox") {
    input.checked = Boolean(value);
  } else {
    input.value = value === null || value === undefined
      ? ""
      : typeof value === "number" && input.dataset.format === "money"
      ? numberFormatter.format(Math.round(value))
      : String(value);
  }
}

function syncInputsFromState() {
  Object.entries(state).forEach(([key, value]) => setInputValue(key, value));
  setText("#batMonthlySalaryHint", `자동 월급 추정: ${formatWon(getMonthlySalary(state))}`);
}

function readInputs() {
  $$("[data-bat]").forEach((input) => {
    const key = input.dataset.bat;
    if (!key) return;

    if (input.type === "checkbox") {
      state[key] = input.checked;
    } else if (input.dataset.type === "number" || input.dataset.format === "money") {
      state[key] = parseNumber(input.value);
    } else {
      state[key] = input.value;
    }
  });
}

function getYearConfig(year) {
  return insuranceConfigs.find((item) => item.year === Number(year)) || insuranceConfigs[0];
}

function getMonthlySalary(input) {
  return input.monthlySalaryOverride && input.monthlySalaryOverride > 0
    ? input.monthlySalaryOverride
    : input.annualSalary / 12;
}

function getTaxableBonus(input, grossOverride = null) {
  const gross = grossOverride ?? input.bonusGrossAmount;
  return Math.max(gross - input.nonTaxableAmount, 0);
}

function getTaxBracket(input) {
  return taxBrackets.find((bracket) => (
    input.annualSalary >= bracket.minAnnualSalary &&
    (bracket.maxAnnualSalary === null || input.annualSalary < bracket.maxAnnualSalary)
  )) || taxBrackets[0];
}

function getIncomeTaxRate(input) {
  if (input.incomeTaxMode === "manual") return Math.max(0, Number(input.manualWithholdingRate || 0));
  const bracket = getTaxBracket(input);
  return input.incomeTaxMode === "conservative" ? bracket.conservativeRate : bracket.baseWithholdingRate;
}

function calculateForGross(input, grossAmount) {
  const config = getYearConfig(input.taxYear);
  const taxableBonus = getTaxableBonus(input, grossAmount);
  const incomeTaxRate = getIncomeTaxRate(input);
  const incomeTax = taxableBonus * incomeTaxRate / 100;
  const localIncomeTax = input.includeLocalIncomeTax ? incomeTax * 0.1 : 0;

  let nationalPension = 0;
  let healthInsurance = 0;
  let longTermCareInsurance = 0;
  let employmentInsurance = 0;

  if (input.includeSocialInsurance) {
    if (input.includeNationalPension && !input.assumePensionCapReached) {
      const monthlyBonus = taxableBonus / getInstallmentCount(input.paymentMethod);
      const pensionBase = Math.min(
        Math.max(monthlyBonus, config.nationalPensionMonthlyIncomeMin),
        config.nationalPensionMonthlyIncomeMax
      );
      nationalPension = pensionBase * config.nationalPensionEmployeeRate / 100 * getInstallmentCount(input.paymentMethod);
    }

    if (input.includeHealthInsurance) {
      healthInsurance = taxableBonus * config.healthInsuranceEmployeeRate / 100;
    }

    if (input.includeLongTermCare) {
      longTermCareInsurance = healthInsurance * config.longTermCareRateOnHealthInsurance / 100;
    }

    if (input.includeEmploymentInsurance) {
      employmentInsurance = taxableBonus * config.employmentInsuranceEmployeeRate / 100;
    }
  }

  const totalDeduction = incomeTax + localIncomeTax + nationalPension + healthInsurance + longTermCareInsurance + employmentInsurance;
  const netAmount = Math.max(grossAmount - totalDeduction, 0);

  return {
    taxableBonus,
    incomeTaxRate,
    incomeTax,
    localIncomeTax,
    nationalPension,
    healthInsurance,
    longTermCareInsurance,
    employmentInsurance,
    totalDeduction,
    netAmount,
    netRate: grossAmount > 0 ? netAmount / grossAmount * 100 : 0,
  };
}

function getInstallmentCount(method) {
  if (method === "twoInstallments") return 2;
  if (method === "fourInstallments") return 4;
  return 1;
}

function getInstallmentLabel(method) {
  if (method === "twoInstallments") return "2회 분할";
  if (method === "fourInstallments") return "4회 분할";
  return "일시 지급";
}

function calculateInstallmentResults(input) {
  return ["single", "twoInstallments", "fourInstallments"].map((method) => {
    const installmentCount = getInstallmentCount(method);
    const installmentInput = { ...input, paymentMethod: method };
    const grossPerInstallment = input.bonusGrossAmount / installmentCount;
    const result = calculateForGross(installmentInput, grossPerInstallment);

    return {
      method,
      label: getInstallmentLabel(method),
      grossPerInstallment,
      netPerInstallment: result.netAmount,
      totalNetAmount: result.netAmount * installmentCount,
      totalDeduction: result.totalDeduction * installmentCount,
    };
  });
}

function getWarnings(input, result) {
  const warnings = ["간이 추정 결과입니다. 실제 원천징수액과 연말정산 결과는 달라질 수 있습니다."];

  if (!input.includeSocialInsurance) warnings.push("4대보험을 제외한 세금 중심 결과입니다.");
  if (input.assumePensionCapReached) warnings.push("국민연금 상한 도달로 가정해 추가 국민연금 공제를 0원으로 처리했습니다.");
  if (result.netRate < 60) warnings.push("실수령률이 낮은 편입니다. 직접 원천징수율과 4대보험 반영 여부를 확인하세요.");
  if (input.incomeTaxMode === "manual") warnings.push("직접 입력한 원천징수율을 적용했습니다.");

  return warnings;
}

function calculate() {
  const result = calculateForGross(state, state.bonusGrossAmount);
  result.monthlySalary = getMonthlySalary(state);
  result.installmentResults = calculateInstallmentResults(state);
  result.warnings = getWarnings(state, result);
  return result;
}

function renderInstallments(result) {
  const target = $("#batInstallmentRows");
  if (!target) return;

  target.innerHTML = result.installmentResults.map((item) => `
    <tr class="${item.method === state.paymentMethod ? "is-selected" : ""}">
      <td>${item.label}</td>
      <td>${formatWon(item.grossPerInstallment)}</td>
      <td>${formatWon(item.netPerInstallment)}</td>
      <td>${formatWon(item.totalNetAmount)}</td>
      <td>${formatWon(item.totalDeduction)}</td>
    </tr>
  `).join("");
}

function renderWarnings(result) {
  const target = $("#batWarnings");
  if (!target) return;

  target.innerHTML = result.warnings.map((warning) => `<li>${warning}</li>`).join("");
}

function render() {
  readInputs();

  const result = calculate();
  const taxSum = result.incomeTax + result.localIncomeTax;
  const insuranceSum = result.nationalPension + result.healthInsurance + result.longTermCareInsurance + result.employmentInsurance;
  const bracket = getTaxBracket(state);

  setText("#batNetAmount", formatWon(result.netAmount));
  setText("#batTotalDeduction", formatWon(result.totalDeduction));
  setText("#batNetRate", formatPercent(result.netRate));
  setText("#batTaxSum", formatWon(taxSum));
  setText("#batInsuranceSum", formatWon(insuranceSum));
  setText("#batIncomeTax", formatWon(result.incomeTax));
  setText("#batLocalIncomeTax", formatWon(result.localIncomeTax));
  setText("#batNationalPension", formatWon(result.nationalPension));
  setText("#batHealthInsurance", formatWon(result.healthInsurance));
  setText("#batLongTermCare", formatWon(result.longTermCareInsurance));
  setText("#batEmploymentInsurance", formatWon(result.employmentInsurance));
  setText("#batAppliedRate", formatPercent(result.incomeTaxRate));
  setText("#batTaxBracket", bracket.label);
  setText("#batMonthlySalaryHint", `자동 월급 추정: ${formatWon(result.monthlySalary)}`);
  setText("#batSummaryText", `성과급 ${formatMan(state.bonusGrossAmount)} 기준 세후 실수령액은 약 ${formatMan(result.netAmount)}입니다.`);

  renderInstallments(result);
  renderWarnings(result);
}

function applyPreset(id) {
  const preset = presets.find((item) => item.id === id);
  if (!preset) return;

  Object.assign(state, preset.input);
  state.monthlySalaryOverride = null;
  syncInputsFromState();

  $$(".bat-preset-btn").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.preset === id);
  });

  render();
}

function applyQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const bonus = parseNumber(params.get("bonus"));
  const salary = parseNumber(params.get("salary"));
  const company = params.get("company");
  const taxRate = parseNumber(params.get("taxRate"));
  const insurance = params.get("insurance");

  if (bonus > 0) state.bonusGrossAmount = bonus;
  if (salary > 0) state.annualSalary = salary;
  if (taxRate > 0) {
    state.incomeTaxMode = "manual";
    state.manualWithholdingRate = taxRate;
  }
  if (insurance === "false") state.includeSocialInsurance = false;

  if (company) {
    const labels = {
      samsung: "삼성전자 계산기",
      "sk-hynix": "SK하이닉스 계산기",
      hyundai: "현대자동차 계산기",
      simulator: "대기업 성과급 시뮬레이터",
    };
    setText("#batSourceBadge", `${labels[company] || "성과급 계산기"}에서 가져온 세전 성과급`);
  }
}

function init() {
  applyQueryParams();
  syncInputsFromState();

  $$("[data-bat]").forEach((input) => {
    input.addEventListener("input", render);
    input.addEventListener("change", render);
  });

  $$(".bat-preset-btn").forEach((button) => {
    button.addEventListener("click", () => applyPreset(button.dataset.preset));
  });

  const resetBtn = document.getElementById("batResetBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      Object.keys(state).forEach((key) => delete state[key]);
      Object.assign(state, defaultInput);
      syncInputsFromState();
      render();
    });
  }

  const copyBtn = document.getElementById("batCopyBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const url = new URL(window.location.href);
      url.searchParams.set("bonus", String(state.bonusGrossAmount));
      url.searchParams.set("salary", String(state.annualSalary));
      await navigator.clipboard?.writeText(url.toString());
      copyBtn.textContent = "링크 복사됨";
      setTimeout(() => { copyBtn.textContent = "링크 복사"; }, 1600);
    });
  }

  render();
}

init();
