const configEl = document.getElementById("savingsVsEtfRetirementData");
const config = JSON.parse(configEl?.textContent || "{}");
const defaults = config.defaults || {};
const presets = config.presets || [];

const state = {
  activePreset: "balanced",
  assetChart: null,
  depletionChart: null,
};

const $ = (id) => document.getElementById(id);
const page = document.querySelector('[data-calculator="savings-vs-etf-retirement"]');

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
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "-";
  const sign = numeric < 0 ? "-" : "";
  const abs = Math.abs(numeric);
  if (abs >= 100000000) return `${sign}${(abs / 100000000).toFixed(1).replace(".0", "")}억 원`;
  if (abs >= 10000) return `${sign}${Math.round(abs / 10000).toLocaleString("ko-KR")}만 원`;
  return `${sign}${Math.round(abs).toLocaleString("ko-KR")}원`;
}

function formatYears(value) {
  if (value === null || value === undefined || !Number.isFinite(value)) return "연금으로 충당";
  return `${value.toFixed(1).replace(".0", "")}년`;
}

function formatAge(value) {
  if (value === null || value === undefined) return "100세 이후";
  return `${value}세`;
}

function annualToMonthlyRate(annualPercent) {
  return Math.pow(1 + annualPercent / 100, 1 / 12) - 1;
}

function futureValueMonthly(monthlyAmount, annualPercent, months, timing) {
  if (months <= 0 || monthlyAmount <= 0) return 0;
  const monthlyRate = annualToMonthlyRate(annualPercent);
  if (Math.abs(monthlyRate) < 0.0000001) return monthlyAmount * months;
  const value = monthlyAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  return timing === "begin" ? value * (1 + monthlyRate) : value;
}

function readInput() {
  return {
    currentAge: getNumber("sverCurrentAge", defaults.currentAge),
    retirementAge: getNumber("sverRetirementAge", defaults.retirementAge),
    monthlyAmount: getNumber("sverMonthlyAmount", defaults.monthlyAmount),
    savingsAnnualRate: getNumber("sverSavingsRate", defaults.savingsAnnualRate),
    etfAnnualReturn: getNumber("sverEtfReturn", defaults.etfAnnualReturn),
    etfFeeRate: getNumber("sverEtfFee", defaults.etfFeeRate),
    inflationRate: getNumber("sverInflationRate", defaults.inflationRate),
    monthlyLivingCost: getNumber("sverMonthlyLivingCost", defaults.monthlyLivingCost),
    postRetirementReturn: getNumber("sverPostReturn", defaults.postRetirementReturn),
    contributionTiming: document.querySelector('input[name="sverContributionTiming"]:checked')?.value || defaults.contributionTiming,
    withdrawalMode: document.querySelector('input[name="sverWithdrawalMode"]:checked')?.value || defaults.withdrawalMode,
    includeTax: $("sverIncludeTax")?.checked || false,
    expectedMonthlyPension: getNumber("sverExpectedPension", defaults.expectedMonthlyPension),
  };
}

function normalizeInput(raw) {
  const currentAge = clamp(raw.currentAge, 18, 80);
  const retirementAge = clamp(raw.retirementAge, currentAge + 1, 85);
  return {
    currentAge,
    retirementAge,
    monthlyAmount: Math.max(0, raw.monthlyAmount),
    savingsAnnualRate: clamp(raw.savingsAnnualRate, -5, 15),
    etfAnnualReturn: clamp(raw.etfAnnualReturn, -20, 30),
    etfFeeRate: clamp(raw.etfFeeRate, 0, 3),
    inflationRate: clamp(raw.inflationRate, 0, 10),
    monthlyLivingCost: Math.max(0, raw.monthlyLivingCost),
    postRetirementReturn: clamp(raw.postRetirementReturn, -10, 15),
    contributionTiming: raw.contributionTiming === "begin" ? "begin" : "end",
    withdrawalMode: raw.withdrawalMode === "inflationAdjusted" ? "inflationAdjusted" : "fixed",
    includeTax: Boolean(raw.includeTax),
    expectedMonthlyPension: Math.max(0, raw.expectedMonthlyPension),
  };
}

function effectiveRate(percent, includeTax) {
  return includeTax ? percent * (1 - 0.154) : percent;
}

function simulateDepletion(asset, input) {
  const monthlyReturn = annualToMonthlyRate(input.postRetirementReturn);
  let balance = asset;
  let monthlyExpense = Math.max(0, input.monthlyLivingCost - input.expectedMonthlyPension);
  const rows = [];
  let depletionAge = null;

  for (let month = 0; month <= (100 - input.retirementAge) * 12; month += 1) {
    const age = input.retirementAge + month / 12;
    if (month % 12 === 0) {
      rows.push({ age: Math.round(age), balance: Math.max(0, balance) });
    }
    if (month > 0 && depletionAge === null && balance <= 0) {
      depletionAge = Math.floor(age);
      break;
    }
    balance = balance * (1 + monthlyReturn) - monthlyExpense;
    if (input.withdrawalMode === "inflationAdjusted") {
      monthlyExpense *= Math.pow(1 + input.inflationRate / 100, 1 / 12);
    }
  }

  return { depletionAge, rows };
}

function calculate(raw) {
  const input = normalizeInput(raw);
  const yearsToRetirement = input.retirementAge - input.currentAge;
  const monthsToRetirement = yearsToRetirement * 12;
  const savingsRate = effectiveRate(input.savingsAnnualRate, input.includeTax);
  const etfRate = effectiveRate(input.etfAnnualReturn - input.etfFeeRate, input.includeTax);
  const savingsFutureValue = futureValueMonthly(input.monthlyAmount, savingsRate, monthsToRetirement, input.contributionTiming);
  const etfFutureValue = futureValueMonthly(input.monthlyAmount, etfRate, monthsToRetirement, input.contributionTiming);
  const inflationFactor = Math.pow(1 + input.inflationRate / 100, yearsToRetirement);
  const savingsRealValue = savingsFutureValue / inflationFactor;
  const etfRealValue = etfFutureValue / inflationFactor;
  const nominalGap = etfFutureValue - savingsFutureValue;
  const realGap = etfRealValue - savingsRealValue;
  const monthlyNetCost = Math.max(0, input.monthlyLivingCost - input.expectedMonthlyPension);
  const savingsCoverYears = monthlyNetCost > 0 ? savingsFutureValue / monthlyNetCost / 12 : null;
  const etfCoverYears = monthlyNetCost > 0 ? etfFutureValue / monthlyNetCost / 12 : null;
  const savingsSim = simulateDepletion(savingsFutureValue, input);
  const etfSim = simulateDepletion(etfFutureValue, input);
  const requiredTo90 = monthlyNetCost * 12 * Math.max(0, 90 - input.retirementAge);
  const savingsShortfallTo90 = Math.max(0, requiredTo90 - savingsFutureValue);
  const etfShortfallTo90 = Math.max(0, requiredTo90 - etfFutureValue);
  const similarBand = input.monthlyAmount * 12;
  const status = Math.abs(nominalGap) <= similarBand ? "similar" : nominalGap > 0 ? "etfBetter" : "savingsBetter";
  const statusMessage =
    status === "similar"
      ? "현재 입력값에서는 두 방식의 은퇴 시점 자산 차이가 1년 납입액 안쪽입니다."
      : status === "etfBetter"
        ? "현재 입력값에서는 ETF 기대수익률 가정이 적금보다 은퇴 시점 자산을 더 크게 만듭니다."
        : "현재 입력값에서는 적금 조건이 ETF 가정보다 은퇴 시점 자산을 더 크게 만듭니다.";

  return {
    input,
    yearsToRetirement,
    monthsToRetirement,
    savingsFutureValue,
    etfFutureValue,
    savingsRealValue,
    etfRealValue,
    nominalGap,
    realGap,
    savingsCoverYears,
    etfCoverYears,
    savingsDepletionAge: savingsSim.depletionAge,
    etfDepletionAge: etfSim.depletionAge,
    savingsShortfallTo90,
    etfShortfallTo90,
    status,
    statusMessage,
    savingsRows: savingsSim.rows,
    etfRows: etfSim.rows,
  };
}

function setText(id, value) {
  const element = $(id);
  if (element) element.textContent = value;
}

function renderTable(result) {
  const tbody = $("sverCompareBody");
  if (!tbody) return;
  const rows = [
    ["은퇴 시점 명목 자산", formatWon(result.savingsFutureValue), formatWon(result.etfFutureValue)],
    ["현재 구매력 환산", formatWon(result.savingsRealValue), formatWon(result.etfRealValue)],
    ["생활비 커버 기간", formatYears(result.savingsCoverYears), formatYears(result.etfCoverYears)],
    ["자산 고갈 예상 나이", formatAge(result.savingsDepletionAge), formatAge(result.etfDepletionAge)],
    ["90세까지 부족액", formatWon(result.savingsShortfallTo90), formatWon(result.etfShortfallTo90)],
  ];
  tbody.innerHTML = rows
    .map((row) => `<tr><th scope="row">${row[0]}</th><td>${row[1]}</td><td>${row[2]}</td></tr>`)
    .join("");
}

function renderAssetChart(result) {
  const canvas = $("sverAssetChart");
  if (!canvas || !window.Chart) return;
  state.assetChart?.destroy();
  state.assetChart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: ["적금 명목", "ETF 명목", "적금 실질", "ETF 실질"],
      datasets: [
        {
          label: "예상 자산",
          data: [
            result.savingsFutureValue,
            result.etfFutureValue,
            result.savingsRealValue,
            result.etfRealValue,
          ],
          backgroundColor: ["#2563eb", "#10b981", "#93c5fd", "#86efac"],
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (context) => formatWon(context.parsed.y) } },
      },
      scales: {
        y: { ticks: { callback: (value) => formatWon(value) } },
      },
    },
  });
}

function renderDepletionChart(result) {
  const canvas = $("sverDepletionChart");
  if (!canvas || !window.Chart) return;
  const ages = Array.from(new Set([...result.savingsRows, ...result.etfRows].map((row) => row.age))).sort((a, b) => a - b);
  const byAge = (rows) => new Map(rows.map((row) => [row.age, row.balance]));
  const savingsMap = byAge(result.savingsRows);
  const etfMap = byAge(result.etfRows);
  state.depletionChart?.destroy();
  state.depletionChart = new Chart(canvas, {
    type: "line",
    data: {
      labels: ages,
      datasets: [
        {
          label: "적금",
          data: ages.map((age) => savingsMap.get(age) ?? null),
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.12)",
          tension: 0.25,
        },
        {
          label: "ETF",
          data: ages.map((age) => etfMap.get(age) ?? null),
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.12)",
          tension: 0.25,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: { callbacks: { label: (context) => `${context.dataset.label}: ${formatWon(context.parsed.y)}` } },
      },
      scales: {
        x: { title: { display: true, text: "나이" } },
        y: { ticks: { callback: (value) => formatWon(value) } },
      },
    },
  });
}

function updateActivePreset(id) {
  state.activePreset = id;
  document.querySelectorAll("[data-sver-preset]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.sverPreset === id);
  });
}

function render() {
  const result = calculate(readInput());
  setText("sverSavingsFutureValue", formatWon(result.savingsFutureValue));
  setText("sverEtfFutureValue", formatWon(result.etfFutureValue));
  setText("sverNominalGap", formatWon(result.nominalGap));
  setText("sverRealGap", formatWon(result.realGap));
  setText("sverSavingsCoverYears", formatYears(result.savingsCoverYears));
  setText("sverEtfCoverYears", formatYears(result.etfCoverYears));
  setText("sverSavingsDepletionAge", formatAge(result.savingsDepletionAge));
  setText("sverEtfDepletionAge", formatAge(result.etfDepletionAge));
  setText("sverStatusBadge", result.status === "similar" ? "차이 작음" : result.status === "etfBetter" ? "ETF 우세" : "적금 우세");
  setText("sverResultMessage", result.statusMessage);
  const message = $("sverResultBox");
  if (message) {
    message.classList.remove("sver-verdict--similar", "sver-verdict--etf", "sver-verdict--savings");
    message.classList.add(`sver-verdict--${result.status === "etfBetter" ? "etf" : result.status === "savingsBetter" ? "savings" : "similar"}`);
  }
  renderTable(result);
  renderAssetChart(result);
  renderDepletionChart(result);
}

function setInputValue(id, value) {
  const element = $(id);
  if (!element) return;
  element.value = element.dataset.currency === "true" ? Number(value).toLocaleString("ko-KR") : value;
}

function applyDefaults() {
  setInputValue("sverCurrentAge", defaults.currentAge);
  setInputValue("sverRetirementAge", defaults.retirementAge);
  setInputValue("sverMonthlyAmount", defaults.monthlyAmount);
  setInputValue("sverSavingsRate", defaults.savingsAnnualRate);
  setInputValue("sverEtfReturn", defaults.etfAnnualReturn);
  setInputValue("sverEtfFee", defaults.etfFeeRate);
  setInputValue("sverInflationRate", defaults.inflationRate);
  setInputValue("sverMonthlyLivingCost", defaults.monthlyLivingCost);
  setInputValue("sverExpectedPension", defaults.expectedMonthlyPension);
  setInputValue("sverPostReturn", defaults.postRetirementReturn);
  const timing = document.querySelector(`input[name="sverContributionTiming"][value="${defaults.contributionTiming}"]`);
  const withdrawal = document.querySelector(`input[name="sverWithdrawalMode"][value="${defaults.withdrawalMode}"]`);
  if (timing) timing.checked = true;
  if (withdrawal) withdrawal.checked = true;
  if ($("sverIncludeTax")) $("sverIncludeTax").checked = defaults.includeTax;
  updateActivePreset("balanced");
}

function bindEvents() {
  page?.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => {
      if (input.dataset.currency === "true") formatCurrencyInput(input);
      render();
    });
    input.addEventListener("change", render);
  });

  document.querySelectorAll("[data-sver-monthly]").forEach((button) => {
    button.addEventListener("click", () => {
      setInputValue("sverMonthlyAmount", Number(button.dataset.sverMonthly));
      render();
    });
  });

  document.querySelectorAll("[data-sver-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      const preset = presets.find((item) => item.id === button.dataset.sverPreset);
      if (!preset) return;
      setInputValue("sverSavingsRate", preset.savingsAnnualRate);
      setInputValue("sverEtfReturn", preset.etfAnnualReturn);
      setInputValue("sverEtfFee", preset.etfFeeRate);
      setInputValue("sverInflationRate", preset.inflationRate);
      setInputValue("sverPostReturn", preset.postRetirementReturn);
      updateActivePreset(preset.id);
      render();
    });
  });

  $("resetSverBtn")?.addEventListener("click", () => {
    applyDefaults();
    render();
  });

  $("copySverLinkBtn")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setText("sverCopyStatus", "링크를 복사했습니다.");
    } catch {
      setText("sverCopyStatus", "주소창의 링크를 복사해 주세요.");
    }
  });
}

applyDefaults();
bindEvents();
render();
