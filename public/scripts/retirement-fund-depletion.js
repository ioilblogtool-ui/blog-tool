const rfdConfigEl = document.getElementById("rfdConfig");
const {
  defaults = {},
  rules = {},
  presets = [],
  scenarios = [],
} = JSON.parse(rfdConfigEl?.textContent || "{}");

const rfdPage = document.querySelector('[data-calculator="retirement-fund-depletion"]');
const rfdRoot = document.querySelector("[data-rfd-root]");
const rfdState = { chart: null };
const $ = (id) => document.getElementById(id);

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function parseCurrency(value) {
  return Number(String(value || "").replace(/[^\d.-]/g, "")) || 0;
}

function formatCurrencyInput(input) {
  const numeric = parseCurrency(input.value);
  input.value = numeric > 0 ? numeric.toLocaleString("ko-KR") : "0";
}

function getNumber(id, fallback = 0) {
  const element = $(id);
  if (!element) return fallback;
  if (element.dataset.currency === "true") return parseCurrency(element.value);
  const value = Number(element.value);
  return Number.isFinite(value) ? value : fallback;
}

function formatWon(value) {
  const numeric = Number(value || 0);
  if (!Number.isFinite(numeric)) return "-";
  if (Math.abs(numeric) >= 100000000) {
    return `${(numeric / 100000000).toFixed(1).replace(".0", "")}억 원`;
  }
  if (Math.abs(numeric) >= 10000) {
    return `${Math.round(numeric / 10000).toLocaleString("ko-KR")}만 원`;
  }
  return `${Math.round(numeric).toLocaleString("ko-KR")}원`;
}

function formatShortWon(value) {
  const numeric = Number(value || 0);
  if (Math.abs(numeric) >= 100000000) return `${(numeric / 100000000).toFixed(1).replace(".0", "")}억`;
  if (Math.abs(numeric) >= 10000) return `${Math.round(numeric / 10000).toLocaleString("ko-KR")}만`;
  return `${Math.round(numeric).toLocaleString("ko-KR")}`;
}

function readInput() {
  return {
    currentAge: getNumber("rfdCurrentAge", defaults.currentAge),
    retirementAge: getNumber("rfdRetirementAge", defaults.retirementAge),
    lifeExpectancy: getNumber("rfdLifeExpectancy", defaults.lifeExpectancy),
    monthlyLivingCost: getNumber("rfdMonthlyLivingCost", defaults.monthlyLivingCost),
    currentAssets: getNumber("rfdCurrentAssets", defaults.currentAssets),
    monthlyContribution: getNumber("rfdMonthlyContribution", defaults.monthlyContribution),
    monthlyPension: getNumber("rfdMonthlyPension", defaults.monthlyPension),
    otherRetirementIncome: getNumber("rfdOtherIncome", defaults.otherRetirementIncome),
    inflationRate: getNumber("rfdInflationRate", defaults.inflationRate * 100) / 100,
    annualReturnRate: getNumber("rfdAnnualReturnRate", defaults.annualReturnRate * 100) / 100,
  };
}

function normalizeInput(raw) {
  const currentAge = clamp(raw.currentAge, rules.minCurrentAge || 20, rules.maxCurrentAge || 80);
  const retirementAge = clamp(raw.retirementAge, currentAge + 1, rules.maxRetirementAge || 80);
  const lifeExpectancy = clamp(raw.lifeExpectancy, retirementAge + 1, rules.maxLifeExpectancy || 110);

  return {
    currentAge,
    retirementAge,
    lifeExpectancy,
    monthlyLivingCost: Math.max(0, raw.monthlyLivingCost),
    currentAssets: Math.max(0, raw.currentAssets),
    monthlyContribution: Math.max(0, raw.monthlyContribution),
    monthlyPension: Math.max(0, raw.monthlyPension),
    otherRetirementIncome: Math.max(0, raw.otherRetirementIncome),
    inflationRate: clamp(raw.inflationRate, rules.minInflationRate || 0, rules.maxInflationRate || 0.1),
    annualReturnRate: clamp(raw.annualReturnRate, rules.minAnnualReturnRate ?? -0.1, rules.maxAnnualReturnRate || 0.15),
  };
}

function futureValueOfAssets(currentAssets, annualReturnRate, years) {
  return currentAssets * Math.pow(1 + annualReturnRate, years);
}

function futureValueOfMonthlyContribution(monthlyContribution, annualReturnRate, years) {
  const months = Math.max(0, years * 12);
  const monthlyRate = Math.pow(1 + annualReturnRate, 1 / 12) - 1;
  if (months <= 0 || monthlyContribution <= 0) return 0;
  if (Math.abs(monthlyRate) < 0.0000001) return monthlyContribution * months;
  return monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
}

function calcProjectedAssetsAtRetirement(input) {
  const years = input.retirementAge - input.currentAge;
  return (
    futureValueOfAssets(input.currentAssets, input.annualReturnRate, years) +
    futureValueOfMonthlyContribution(input.monthlyContribution, input.annualReturnRate, years)
  );
}

function calcMonthlyCostAtRetirement(input) {
  const years = input.retirementAge - input.currentAge;
  return input.monthlyLivingCost * Math.pow(1 + input.inflationRate, years);
}

function calcAnnualNetExpenseAtRetirement(input) {
  const monthlyCost = calcMonthlyCostAtRetirement(input);
  const monthlyIncome = input.monthlyPension + input.otherRetirementIncome;
  return Math.max(0, (monthlyCost - monthlyIncome) * 12);
}

function simulateRetirementYears(input, startingAssets) {
  const projection = [];
  const retirementYears = input.lifeExpectancy - input.retirementAge;
  let balance = startingAssets;
  let annualExpense = calcMonthlyCostAtRetirement(input) * 12;
  const annualIncome = (input.monthlyPension + input.otherRetirementIncome) * 12;
  let depletionAge = null;
  let depletionYearOffset = null;

  for (let i = 0; i <= retirementYears; i += 1) {
    const age = input.retirementAge + i;
    const startBalance = balance;
    const netExpense = Math.max(0, annualExpense - annualIncome);
    const investmentReturn = startBalance * input.annualReturnRate;
    const endBalance = startBalance + investmentReturn - netExpense;

    projection.push({
      age,
      yearOffset: i,
      startBalance,
      annualExpense,
      annualIncome,
      investmentReturn,
      endBalance,
    });

    if (depletionAge === null && endBalance <= 0) {
      depletionAge = age;
      depletionYearOffset = i;
    }

    balance = endBalance;
    annualExpense *= 1 + input.inflationRate;
  }

  return { projection, depletionAge, depletionYearOffset };
}

function calcRequiredAssetsAtRetirement(input) {
  let low = 0;
  let high = 10000000000;

  for (let i = 0; i < 60; i += 1) {
    const mid = (low + high) / 2;
    const simulated = simulateRetirementYears(input, mid);
    const last = simulated.projection[simulated.projection.length - 1];

    if (last.endBalance >= 0 && simulated.depletionAge === null) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return Math.round(high);
}

function calcRequiredAdditionalMonthlyContribution(shortfallAmount, input) {
  if (shortfallAmount <= 0) return 0;
  const years = input.retirementAge - input.currentAge;
  const months = years * 12;
  const monthlyRate = Math.pow(1 + input.annualReturnRate, 1 / 12) - 1;
  if (months <= 0) return shortfallAmount;
  if (Math.abs(monthlyRate) < 0.0000001) return shortfallAmount / months;
  return shortfallAmount / ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
}

function getRetirementStatus(depletionAge, lifeExpectancy) {
  if (depletionAge === null) {
    return {
      status: "stable",
      label: "안정",
      message: "입력값 기준 기대수명까지 자산이 유지되는 것으로 추정됩니다.",
    };
  }
  if (depletionAge >= lifeExpectancy - 5) {
    return {
      status: "caution",
      label: "주의",
      message: `입력값 기준 ${depletionAge}세 전후 자산 고갈 가능성이 있습니다.`,
    };
  }
  return {
    status: "risk",
    label: "위험",
    message: `기대수명보다 이른 ${depletionAge}세 전후 자산 고갈 가능성이 있습니다.`,
  };
}

function calculateRetirementFund(rawInput) {
  const input = normalizeInput(rawInput);
  const yearsToRetirement = input.retirementAge - input.currentAge;
  const retirementYears = input.lifeExpectancy - input.retirementAge;
  const projectedAssetsAtRetirement = calcProjectedAssetsAtRetirement(input);
  const requiredAssetsAtRetirement = calcRequiredAssetsAtRetirement(input);
  const shortfallAmount = Math.max(0, requiredAssetsAtRetirement - projectedAssetsAtRetirement);
  const requiredAdditionalMonthlyContribution = calcRequiredAdditionalMonthlyContribution(shortfallAmount, input);
  const simulated = simulateRetirementYears(input, projectedAssetsAtRetirement);
  const status = getRetirementStatus(simulated.depletionAge, input.lifeExpectancy);

  return {
    input,
    yearsToRetirement,
    retirementYears,
    monthlyCostAtRetirement: calcMonthlyCostAtRetirement(input),
    annualNetExpenseAtRetirement: calcAnnualNetExpenseAtRetirement(input),
    projectedAssetsAtRetirement,
    requiredAssetsAtRetirement,
    shortfallAmount,
    requiredAdditionalMonthlyContribution,
    depletionAge: simulated.depletionAge,
    depletionYearOffset: simulated.depletionYearOffset,
    status: status.status,
    statusLabel: status.label,
    summaryMessage: status.message,
    projection: simulated.projection,
  };
}

function scenarioRows(input) {
  return scenarios.map((scenario) => {
    const nextInput = normalizeInput({
      ...input,
      monthlyLivingCost: input.monthlyLivingCost * scenario.livingCostMultiplier,
      inflationRate: input.inflationRate + scenario.inflationDelta,
      annualReturnRate: input.annualReturnRate + scenario.returnDelta,
    });
    const result = calculateRetirementFund(nextInput);
    return {
      ...scenario,
      result,
    };
  });
}

function sensitivityRows(input, baseResult) {
  const options = [
    { label: "월 적립액 +10만", input: { ...input, monthlyContribution: input.monthlyContribution + 100000 } },
    { label: "월 적립액 +30만", input: { ...input, monthlyContribution: input.monthlyContribution + 300000 } },
    { label: "은퇴 나이 +3년", input: { ...input, retirementAge: Math.min(input.lifeExpectancy - 1, input.retirementAge + 3) } },
    { label: "생활비 -10%", input: { ...input, monthlyLivingCost: input.monthlyLivingCost * 0.9 } },
  ];

  return options.map((option) => {
    const result = calculateRetirementFund(option.input);
    const baseAge = baseResult.depletionAge || baseResult.input.lifeExpectancy;
    const nextAge = result.depletionAge || result.input.lifeExpectancy;
    return {
      label: option.label,
      result,
      ageDiff: nextAge - baseAge,
    };
  });
}

function renderSummary(result) {
  $("rfdSummaryMessage").textContent = result.summaryMessage;
  $("rfdStatusBadge").textContent = result.statusLabel;
  $("rfdStatusBadge").dataset.status = result.status;
  $("rfdStatusDetail").textContent =
    `${result.yearsToRetirement}년 뒤 은퇴, 은퇴 후 ${result.retirementYears}년 기간 기준입니다.`;
  $("rfdDepletionAge").textContent = result.depletionAge === null ? "유지 가능" : `${result.depletionAge}세`;
  $("rfdRequiredAssets").textContent = formatWon(result.requiredAssetsAtRetirement);
  $("rfdProjectedAssets").textContent = formatWon(result.projectedAssetsAtRetirement);
  $("rfdShortfall").textContent = result.shortfallAmount > 0 ? formatWon(result.shortfallAmount) : "부족 없음";
  $("rfdAdditionalMonthly").textContent =
    result.requiredAdditionalMonthlyContribution > 0 ? `${formatWon(result.requiredAdditionalMonthlyContribution)}/월` : "추가 없음";
}

function renderScenarioTable(input) {
  const body = $("rfdScenarioBody");
  if (!body) return;
  body.innerHTML = scenarioRows(input)
    .map(({ label, description, result }) => {
      const depletion = result.depletionAge === null ? "기대수명까지 유지" : `${result.depletionAge}세 전후`;
      return `<tr>
        <th scope="row"><strong>${label}</strong><span>${description}</span></th>
        <td>${depletion}</td>
        <td>${result.shortfallAmount > 0 ? formatWon(result.shortfallAmount) : "부족 없음"}</td>
        <td>${result.requiredAdditionalMonthlyContribution > 0 ? `${formatWon(result.requiredAdditionalMonthlyContribution)}/월` : "추가 없음"}</td>
      </tr>`;
    })
    .join("");
}

function renderSensitivity(input, baseResult) {
  const grid = $("rfdSensitivityGrid");
  if (!grid) return;
  grid.innerHTML = sensitivityRows(input, baseResult)
    .map((row) => {
      const depletion = row.result.depletionAge === null ? "유지 가능" : `${row.result.depletionAge}세`;
      const diff = row.ageDiff === 0 ? "변화 없음" : `${row.ageDiff > 0 ? "+" : ""}${row.ageDiff}년`;
      return `<article class="rfd-sensitivity-card">
        <p>${row.label}</p>
        <strong>${depletion}</strong>
        <span>기본 대비 ${diff}</span>
      </article>`;
    })
    .join("");
}

function renderChart(result) {
  const canvas = $("rfdBalanceChart");
  if (!canvas || typeof Chart === "undefined") return;
  const labels = result.projection.map((point) => `${point.age}세`);
  const data = result.projection.map((point) => Math.max(0, Math.round(point.endBalance / 10000)));
  const pointColors = result.projection.map((point) => (point.endBalance <= 0 ? "#dc2626" : "#0f766e"));

  if (rfdState.chart) {
    rfdState.chart.data.labels = labels;
    rfdState.chart.data.datasets[0].data = data;
    rfdState.chart.data.datasets[0].pointBackgroundColor = pointColors;
    rfdState.chart.update();
    return;
  }

  rfdState.chart = new Chart(canvas, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "잔액(만원)",
          data,
          borderColor: "#0f766e",
          backgroundColor: "rgba(15, 118, 110, 0.12)",
          pointBackgroundColor: pointColors,
          pointRadius: 3,
          fill: true,
          tension: 0.25,
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
            label: (context) => `잔액 ${Number(context.raw || 0).toLocaleString("ko-KR")}만원`,
          },
        },
      },
      scales: {
        y: {
          ticks: {
            callback: (value) => formatShortWon(Number(value) * 10000),
          },
        },
      },
    },
  });
}

function updateQuery(input) {
  const params = new URLSearchParams();
  params.set("age", String(input.currentAge));
  params.set("retire", String(input.retirementAge));
  params.set("life", String(input.lifeExpectancy));
  params.set("cost", String(input.monthlyLivingCost));
  params.set("assets", String(input.currentAssets));
  params.set("save", String(input.monthlyContribution));
  params.set("pension", String(input.monthlyPension));
  params.set("income", String(input.otherRetirementIncome));
  params.set("inflation", String(input.inflationRate));
  params.set("return", String(input.annualReturnRate));
  history.replaceState(null, "", `${location.pathname}?${params.toString()}`);
}

function restoreQuery() {
  const params = new URLSearchParams(location.search);
  const map = [
    ["age", "rfdCurrentAge"],
    ["retire", "rfdRetirementAge"],
    ["life", "rfdLifeExpectancy"],
    ["cost", "rfdMonthlyLivingCost"],
    ["assets", "rfdCurrentAssets"],
    ["save", "rfdMonthlyContribution"],
    ["pension", "rfdMonthlyPension"],
    ["income", "rfdOtherIncome"],
    ["inflation", "rfdInflationRate", true],
    ["return", "rfdAnnualReturnRate", true],
  ];

  map.forEach(([param, id, isRate]) => {
    const value = params.get(param);
    const element = $(id);
    if (value === null || !element) return;
    const numeric = Number(value);
    element.value = Number.isFinite(numeric) ? String(isRate ? numeric * 100 : numeric) : value;
  });

  document.querySelectorAll('[data-currency="true"]').forEach(formatCurrencyInput);
}

function setInputValue(key, value, isRate = false) {
  const input = document.querySelector(`[data-rfd-input="${key}"]`);
  if (!input) return;
  input.value = String(isRate ? Number(value) * 100 : value);
  if (input.dataset.currency === "true") formatCurrencyInput(input);
}

function applyPreset(presetId) {
  const preset = presets.find((item) => item.id === presetId);
  if (!preset) return;
  Object.entries(preset.values || {}).forEach(([key, value]) => {
    setInputValue(key, value, key === "inflationRate" || key === "annualReturnRate");
  });
  renderAll();
}

function resetForm() {
  if (!rfdPage) return;
  rfdPage.querySelectorAll("input").forEach((input) => {
    input.value = input.defaultValue;
  });
  document.querySelectorAll('[data-currency="true"]').forEach(formatCurrencyInput);
  renderAll();
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(location.href);
    const button = $("copyRfdLinkBtn");
    if (!button) return;
    const original = button.textContent;
    button.textContent = "링크 복사됨";
    window.setTimeout(() => {
      button.textContent = original;
    }, 1600);
  } catch {
    window.alert("링크 복사에 실패했습니다.");
  }
}

function renderAll() {
  const input = normalizeInput(readInput());
  const result = calculateRetirementFund(input);
  renderSummary(result);
  renderScenarioTable(input);
  renderSensitivity(input, result);
  renderChart(result);
  updateQuery(input);
}

if (rfdRoot) {
  restoreQuery();

  document.querySelectorAll('[data-currency="true"]').forEach((input) => {
    formatCurrencyInput(input);
    input.addEventListener("input", () => formatCurrencyInput(input));
    input.addEventListener("blur", () => formatCurrencyInput(input));
  });

  document.querySelectorAll("[data-rfd-preset]").forEach((button) => {
    button.addEventListener("click", () => applyPreset(button.dataset.rfdPreset));
  });

  document.querySelectorAll("[data-rfd-set]").forEach((button) => {
    button.addEventListener("click", () => {
      setInputValue(button.dataset.rfdSet, button.dataset.rfdValue);
      renderAll();
    });
  });

  document.querySelectorAll("[data-rfd-rate]").forEach((button) => {
    button.addEventListener("click", () => {
      setInputValue(button.dataset.rfdRate, button.dataset.rfdValue, true);
      renderAll();
    });
  });

  rfdPage?.querySelectorAll("input").forEach((element) => {
    element.addEventListener("input", renderAll);
    element.addEventListener("change", renderAll);
  });

  $("resetRfdBtn")?.addEventListener("click", resetForm);
  $("copyRfdLinkBtn")?.addEventListener("click", copyLink);

  renderAll();
}
