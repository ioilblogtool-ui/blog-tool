const configEl = document.getElementById("fireConfig");
const { FIRE_DEFAULT_INPUT, FIRE_CAGR_BENCHMARKS, FIRE_LEGEND_INVESTORS } = JSON.parse(configEl?.textContent || "{}");

const fields = {
  currentAge: document.getElementById("fireCurrentAge"),
  targetRetireAge: document.getElementById("fireTargetRetireAge"),
  currentNetWorth: document.getElementById("fireCurrentNetWorth"),
  monthlyExpense: document.getElementById("fireMonthlyExpense"),
  monthlyInvestment: document.getElementById("fireMonthlyInvestment"),
  annualReturnRate: document.getElementById("fireAnnualReturnRate"),
  inflationRate: document.getElementById("fireInflationRate"),
  withdrawalRate: document.getElementById("fireWithdrawalRate"),
  fireMode: document.getElementById("fireMode"),
  monthlyPassiveIncome: document.getElementById("fireMonthlyPassiveIncome"),
  monthlyPension: document.getElementById("fireMonthlyPension"),
};

const moneyFieldKeys = [
  "currentNetWorth",
  "monthlyExpense",
  "monthlyInvestment",
  "monthlyPassiveIncome",
  "monthlyPension",
];

const amountHintEls = {
  currentNetWorth: document.getElementById("fireCurrentNetWorthHint"),
  monthlyInvestment: document.getElementById("fireMonthlyInvestmentHint"),
  monthlyExpense: document.getElementById("fireMonthlyExpenseHint"),
  monthlyPassiveIncome: document.getElementById("fireMonthlyPassiveIncomeHint"),
  monthlyPension: document.getElementById("fireMonthlyPensionHint"),
};

const presetGrid = document.getElementById("firePresetGrid");
const rateChips = document.getElementById("fireRateChips");
const returnWarning = document.getElementById("fireReturnWarning");
const benchmarkToggles = document.getElementById("fireBenchmarkToggles");
const quickValueButtons = document.querySelectorAll("[data-quick-target]");
const scenarioTableBody = document.getElementById("fireScenarioTableBody");
const benchmarkTableBody = document.getElementById("fireBenchmarkTableBody");

const resultSubcopy = document.getElementById("fireResultSubcopy");
const targetAssetValue = document.getElementById("fireTargetAssetValue");
const targetAssetNote = document.getElementById("fireTargetAssetNote");
const expectedAgeValue = document.getElementById("fireExpectedAgeValue");
const expectedAgeNote = document.getElementById("fireExpectedAgeNote");
const shortageValue = document.getElementById("fireShortageValue");
const shortageNote = document.getElementById("fireShortageNote");
const additionalMonthlyValue = document.getElementById("fireAdditionalMonthlyValue");
const additionalMonthlyNote = document.getElementById("fireAdditionalMonthlyNote");
const monthlyWithdrawValue = document.getElementById("fireMonthlyWithdrawValue");
const monthlyWithdrawNote = document.getElementById("fireMonthlyWithdrawNote");
const fireTypeValue = document.getElementById("fireTypeValue");
const depletionAgeValue = document.getElementById("fireDepletionAgeValue");
const depletionAgeNote = document.getElementById("fireDepletionAgeNote");
const fireTypeNote = document.getElementById("fireTypeNote");
const fireInsightText = document.getElementById("fireInsightText");

const resetBtn = document.getElementById("resetFireBtn");
const copyBtn = document.getElementById("copyFireLinkBtn");

let projectionChart = null;
let longevityChart = null;
let activeBenchmarkPeriod = 10;

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function roundToUnit(value, unit = 10000) {
  return Math.round(value / unit) * unit;
}

function parseMoneyValue(raw) {
  const manwon = Math.max(0, parseInt(String(raw || "").replace(/[^\d]/g, ""), 10) || 0);
  return manwon * 10000;
}

function formatMoneyValue(value) {
  const raw = String(value ?? "").replace(/[^\d]/g, "");
  if (!raw) return "";
  const numeric = Number(raw);
  if (!Number.isFinite(numeric)) return "";
  const manwon = numeric >= 100000 ? Math.round(numeric / 10000) : numeric;
  return manwon.toLocaleString("ko-KR");
}
function fmtBig(n) {
  if (!Number.isFinite(n)) return "-";
  const abs = Math.abs(Math.round(n));
  const sign = n < 0 ? "-" : "";
  const eok = Math.floor(abs / 100000000);
  const man = Math.round((abs % 100000000) / 10000);
  if (eok > 0 && man > 0) return `${sign}${eok}억 ${man.toLocaleString("ko-KR")}만원`;
  if (eok > 0) return `${sign}${eok}억원`;
  return `${sign}${man.toLocaleString("ko-KR")}만원`;
}

function fmtPercent(n) {
  return `${(n * 100).toFixed(1)}%`;
}

function fmtInlineMoney(n) {
  if (!Number.isFinite(n) || n <= 0) return "0원";
  const eok = Math.floor(n / 100000000);
  const man = Math.round((n % 100000000) / 10000);
  if (eok > 0 && man > 0) return `약 ${eok}억 ${man.toLocaleString("ko-KR")}만원`;
  if (eok > 0) return `약 ${eok}억원`;
  return `약 ${Math.round(n / 10000).toLocaleString("ko-KR")}만원`;
}

function fmtChartMoneyFromMan(manValue) {
  const won = Number(manValue) * 10000;
  if (!Number.isFinite(won)) return "-";
  const eok = won / 100000000;
  if (Math.abs(eok) >= 1) return `${eok.toFixed(Math.abs(eok) >= 10 ? 0 : 1)}억원`;
  return `${Math.round(manValue).toLocaleString("ko-KR")}만원`;
}

function getInput() {
  const currentAge = clamp(parseInt(fields.currentAge?.value || FIRE_DEFAULT_INPUT.currentAge, 10) || FIRE_DEFAULT_INPUT.currentAge, 20, 70);
  const targetRetireAge = clamp(parseInt(fields.targetRetireAge?.value || FIRE_DEFAULT_INPUT.targetRetireAge, 10) || FIRE_DEFAULT_INPUT.targetRetireAge, currentAge + 1, 90);
  const currentNetWorth = parseMoneyValue(fields.currentNetWorth?.value || FIRE_DEFAULT_INPUT.currentNetWorth);
  const monthlyExpense = parseMoneyValue(fields.monthlyExpense?.value || FIRE_DEFAULT_INPUT.monthlyExpense);
  const monthlyInvestment = parseMoneyValue(fields.monthlyInvestment?.value || FIRE_DEFAULT_INPUT.monthlyInvestment);
  const annualReturnRate = clamp((parseFloat(fields.annualReturnRate?.value || FIRE_DEFAULT_INPUT.annualReturnRate * 100) || 0) / 100, 0.01, 0.2);
  const inflationRate = clamp((parseFloat(fields.inflationRate?.value || FIRE_DEFAULT_INPUT.inflationRate * 100) || 0) / 100, 0, 0.12);
  const withdrawalRate = clamp(parseFloat(fields.withdrawalRate?.value || FIRE_DEFAULT_INPUT.withdrawalRate), 0.03, 0.04);
  const monthlyPassiveIncome = parseMoneyValue(fields.monthlyPassiveIncome?.value || 0);
  const monthlyPension = parseMoneyValue(fields.monthlyPension?.value || 0);
  const fireMode = fields.fireMode?.value === "COUPLE" ? "COUPLE" : "SINGLE";

  return {
    currentAge,
    targetRetireAge,
    currentNetWorth,
    monthlyExpense,
    monthlyInvestment,
    annualReturnRate,
    inflationRate,
    withdrawalRate,
    monthlyPassiveIncome,
    monthlyPension,
    fireMode,
  };
}

function formatMoneyFields() {
  moneyFieldKeys.forEach((key) => {
    if (fields[key]) fields[key].value = formatMoneyValue(fields[key].value);
  });
}

function normalizeAgeFields() {
  const currentAge = clamp(parseInt(fields.currentAge?.value || FIRE_DEFAULT_INPUT.currentAge, 10) || FIRE_DEFAULT_INPUT.currentAge, 20, 70);
  const targetRetireAge = clamp(parseInt(fields.targetRetireAge?.value || FIRE_DEFAULT_INPUT.targetRetireAge, 10) || FIRE_DEFAULT_INPUT.targetRetireAge, currentAge + 1, 90);
  if (fields.currentAge) fields.currentAge.value = String(currentAge);
  if (fields.targetRetireAge) fields.targetRetireAge.value = String(targetRetireAge);
}

function renderAmountHints(input) {
  amountHintEls.currentNetWorth.textContent = fmtInlineMoney(input.currentNetWorth);
  amountHintEls.monthlyInvestment.textContent = fmtInlineMoney(input.monthlyInvestment);
  amountHintEls.monthlyExpense.textContent = fmtInlineMoney(input.monthlyExpense);
  amountHintEls.monthlyPassiveIncome.textContent = fmtInlineMoney(input.monthlyPassiveIncome);
  amountHintEls.monthlyPension.textContent = fmtInlineMoney(input.monthlyPension);
}

function baseMetrics(input) {
  const annualExpense = input.monthlyExpense * 12;
  const netAnnualExpense = Math.max((input.monthlyExpense - input.monthlyPassiveIncome - input.monthlyPension) * 12, 0);
  const targetFireAsset = input.withdrawalRate > 0 ? netAnnualExpense / input.withdrawalRate : 0;
  return { annualExpense, netAnnualExpense, targetFireAsset };
}

function simulateProjection(input, overrideMonthlyInvestment) {
  const metrics = baseMetrics(input);
  const monthlyRate = input.annualReturnRate / 12;
  const monthlyInflation = input.inflationRate / 12;
  const monthlyInvestment = overrideMonthlyInvestment === undefined ? input.monthlyInvestment : overrideMonthlyInvestment;
  const maxMonths = Math.max((80 - input.currentAge) * 12, 12);
  const targetMonths = Math.max((input.targetRetireAge - input.currentAge) * 12, 12);

  let projectedAsset = input.currentNetWorth;
  let targetAsset = metrics.targetFireAsset;
  let expectedRetireAge = projectedAsset >= targetAsset ? input.currentAge : null;
  let expectedRetireYear = projectedAsset >= targetAsset ? new Date().getFullYear() : null;
  let achievedMonth = projectedAsset >= targetAsset ? 0 : null;
  const projections = [{ age: input.currentAge, year: new Date().getFullYear(), projectedAsset: Math.round(projectedAsset), targetAsset: Math.round(targetAsset) }];

  let targetAtDesired = targetAsset;
  let projectedAtDesired = projectedAsset;

  for (let month = 1; month <= maxMonths; month += 1) {
    projectedAsset = projectedAsset * (1 + monthlyRate) + monthlyInvestment;
    targetAsset = targetAsset * (1 + monthlyInflation);

    if (month === targetMonths) {
      targetAtDesired = targetAsset;
      projectedAtDesired = projectedAsset;
    }

    if (achievedMonth === null && projectedAsset >= targetAsset) {
      achievedMonth = month;
      expectedRetireAge = input.currentAge + month / 12;
      expectedRetireYear = new Date().getFullYear() + month / 12;
    }

    if (month % 12 === 0) {
      projections.push({
        age: input.currentAge + month / 12,
        year: new Date().getFullYear() + month / 12,
        projectedAsset: Math.round(projectedAsset),
        targetAsset: Math.round(targetAsset),
      });
    }
  }

  const assetAtExpected = achievedMonth === null
    ? projectedAtDesired
    : projections.find((item) => Math.abs(item.age - Math.round(expectedRetireAge * 10) / 10) < 0.51)?.projectedAsset ?? projectedAsset;
  const targetAtExpected = achievedMonth === null
    ? targetAtDesired
    : projections.find((item) => Math.abs(item.age - Math.round(expectedRetireAge * 10) / 10) < 0.51)?.targetAsset ?? targetAsset;

  return {
    ...metrics,
    projections,
    expectedRetireAge,
    expectedRetireYear,
    shortageAmount: Math.max(targetAtDesired - projectedAtDesired, 0),
    projectedAtDesired,
    targetAtDesired,
    assetAtExpected,
    targetAtExpected,
  };
}


function simulateRetirementDepletion(input, result) {
  const monthlyRate = input.annualReturnRate / 12;
  const monthlyInflation = input.inflationRate / 12;
  const maxMonths = Math.max((100 - input.targetRetireAge) * 12, 12);
  let asset = Math.max(result.projectedAtDesired, 0);
  let monthlyNeed = Math.max(input.monthlyExpense - input.monthlyPassiveIncome - input.monthlyPension, 0);
  let depletedAge = asset <= 0 ? input.targetRetireAge : null;
  const points = [{ age: input.targetRetireAge, asset: Math.round(asset), annualNeed: Math.round(monthlyNeed * 12) }];

  for (let month = 1; month <= maxMonths; month += 1) {
    asset = asset * (1 + monthlyRate) - monthlyNeed;
    monthlyNeed = monthlyNeed * (1 + monthlyInflation);

    if (asset <= 0 && depletedAge === null) {
      asset = 0;
      depletedAge = input.targetRetireAge + month / 12;
    }

    if (month % 12 === 0 || asset === 0) {
      points.push({
        age: input.targetRetireAge + month / 12,
        asset: Math.round(Math.max(asset, 0)),
        annualNeed: Math.round(monthlyNeed * 12),
      });
    }

    if (asset === 0) break;
  }

  return {
    points,
    depletedAge,
  };
}

function calculateAdditionalMonthlyNeeded(input, baseResult) {
  if (baseResult.shortageAmount <= 0) return 0;
  let low = input.monthlyInvestment;
  let high = Math.max(input.monthlyInvestment + 100000, 200000);
  while (simulateProjection(input, high).shortageAmount > 0 && high < 50000000) high *= 2;
  for (let i = 0; i < 32; i += 1) {
    const mid = Math.floor((low + high) / 2);
    const result = simulateProjection(input, mid);
    if (result.shortageAmount > 0) low = mid + 1;
    else high = mid;
  }
  return Math.max(high - input.monthlyInvestment, 0);
}

function classifyFireType(input) {
  const coastResult = simulateProjection({ ...input, monthlyInvestment: 0 });
  const netMonthlyExpense = Math.max(input.monthlyExpense - input.monthlyPassiveIncome - input.monthlyPension, 0);
  if (coastResult.shortageAmount <= 0) return { label: "Coast FIRE", note: "지금 자산을 굴리는 것만으로도 목표선에 가까워지는 구간입니다." };
  if (input.monthlyPassiveIncome + input.monthlyPension >= input.monthlyExpense * 0.25) return { label: "Barista FIRE", note: "은퇴 후 일부 현금흐름을 섞는 반은퇴형 구조에 가깝습니다." };
  if (netMonthlyExpense <= 2000000) return { label: "Lean FIRE", note: "소비를 낮게 유지하는 절제형 FIRE 기준에 가깝습니다." };
  if (netMonthlyExpense >= 4500000) return { label: "Fat FIRE", note: "생활비 여유를 크게 두는 상위 소비형 FIRE 기준입니다." };
  return { label: "Regular FIRE", note: "가장 일반적인 생활비 기준의 FIRE 시나리오입니다." };
}

function buildScenarioRows(input) {
  return [
    { label: "내 입력", rate: input.annualReturnRate, isCurrent: true },
    { label: "보수적", rate: 0.05 },
    { label: "기본", rate: 0.07 },
    { label: "공격적", rate: 0.09 },
  ].map((scenario) => {
    const scenarioInput = { ...input, annualReturnRate: scenario.rate };
    const result = simulateProjection(scenarioInput);
    const additionalMonthlyNeeded = calculateAdditionalMonthlyNeeded(scenarioInput, result);
    return { ...scenario, targetFireAsset: result.targetAtDesired, expectedRetireAge: result.expectedRetireAge, shortageAmount: result.shortageAmount, additionalMonthlyNeeded };
  });
}

function syncUrlParams(input) {
  const params = new URLSearchParams();
  params.set("age", String(input.currentAge));
  params.set("retire", String(input.targetRetireAge));
  params.set("net", String(input.currentNetWorth));
  params.set("exp", String(input.monthlyExpense));
  params.set("inv", String(input.monthlyInvestment));
  params.set("r", String(Math.round(input.annualReturnRate * 1000) / 10));
  params.set("infl", String(Math.round(input.inflationRate * 1000) / 10));
  params.set("wr", String(input.withdrawalRate));
  params.set("mode", input.fireMode);
  params.set("pi", String(input.monthlyPassiveIncome));
  params.set("pen", String(input.monthlyPension));
  history.replaceState(null, "", `?${params.toString()}`);
}

function loadFromUrlParams() {
  const params = new URLSearchParams(location.search);
  const mappings = {
    age: ["currentAge", 20, 70],
    retire: ["targetRetireAge", 30, 90],
    net: ["currentNetWorth", 0, 100000000000],
    exp: ["monthlyExpense", 0, 100000000],
    inv: ["monthlyInvestment", 0, 100000000],
    r: ["annualReturnRate", 1, 20],
    infl: ["inflationRate", 0, 12],
    pi: ["monthlyPassiveIncome", 0, 100000000],
    pen: ["monthlyPension", 0, 100000000],
  };

  Object.entries(mappings).forEach(([key, [fieldKey, min, max]]) => {
    const raw = params.get(key);
    if (raw === null || !fields[fieldKey]) return;
    const value = Number(raw);
    if (!Number.isFinite(value)) return;
    if (moneyFieldKeys.includes(fieldKey)) fields[fieldKey].value = formatMoneyValue(clamp(value, min, max));
    else fields[fieldKey].value = String(clamp(value, min, max));
  });

  const wr = params.get("wr");
  if (wr && ["0.04", "0.035", "0.03"].includes(wr) && fields.withdrawalRate) fields.withdrawalRate.value = wr;
  const mode = params.get("mode");
  if (mode && ["SINGLE", "COUPLE"].includes(mode) && fields.fireMode) fields.fireMode.value = mode;
}


function renderQuickValueState(input) {
  quickValueButtons.forEach((button) => {
    const target = button.getAttribute("data-quick-target");
    const value = Number(button.getAttribute("data-quick-value") || 0);
    const current = input[target];
    button.classList.toggle("is-active", Number.isFinite(value) && current === value);
  });
}

function renderPresetState(monthlyExpense) {
  presetGrid?.querySelectorAll("[data-preset-code]").forEach((button) => {
    const amount = parseInt(button.getAttribute("data-monthly-expense") || "0", 10);
    button.classList.toggle("is-active", amount === monthlyExpense);
  });
}

function renderKpis(input, result, additionalMonthlyNeeded, fireType, retirementResult) {
  const expectedAgeRounded = result.expectedRetireAge === null ? null : Math.round(result.expectedRetireAge * 10) / 10;
  const expectedYearRounded = result.expectedRetireYear === null ? null : Math.round(result.expectedRetireYear);
  const withdrawBase = result.expectedRetireAge === null ? result.projectedAtDesired : Math.max(result.assetAtExpected, result.targetAtExpected);
  const monthlyWithdrawable = withdrawBase * input.withdrawalRate / 12;

  if (resultSubcopy) resultSubcopy.textContent = `${input.fireMode === "COUPLE" ? "부부 합산" : "1인 기준"} · 목표 ${input.targetRetireAge}세 · 기대수익률 ${(input.annualReturnRate * 100).toFixed(1)}%`;
  if (targetAssetValue) targetAssetValue.textContent = fmtBig(result.targetAtDesired);
  if (targetAssetNote) targetAssetNote.textContent = `순 생활비 ${fmtBig(result.netAnnualExpense)} / 안전인출률 ${(input.withdrawalRate * 100).toFixed(1)}%`;
  if (expectedAgeValue) expectedAgeValue.textContent = expectedAgeRounded === null ? "미달성" : `${expectedAgeRounded}세`;
  if (expectedAgeNote) expectedAgeNote.textContent = expectedYearRounded === null ? "80\uC138 \uC804\uAE4C\uC9C0 \uCD95\uC801 \uBAA9\uD45C\uC120 \uBBF8\uB2EC" : `${expectedYearRounded}\uB144 \uC804\uD6C4 \uC608\uC0C1`;
  if (shortageValue) shortageValue.textContent = fmtBig(result.shortageAmount);
  if (shortageNote) shortageNote.textContent = result.shortageAmount > 0 ? `${input.targetRetireAge}세 기준 부족분` : "목표 은퇴 나이 안에 도달 가능";
  if (additionalMonthlyValue) additionalMonthlyValue.textContent = additionalMonthlyNeeded > 0 ? fmtBig(additionalMonthlyNeeded) : "0원";
  if (additionalMonthlyNote) additionalMonthlyNote.textContent = additionalMonthlyNeeded > 0 ? "목표 시점에 맞추려면 추가 적립 필요" : "현재 투자금으로도 목표 시점 충족";
  const depletionAgeRounded = retirementResult.depletedAge === null ? null : Math.round(retirementResult.depletedAge * 10) / 10;
  if (depletionAgeValue) depletionAgeValue.textContent = depletionAgeRounded === null ? "100세+" : `${depletionAgeRounded}세`;
  if (depletionAgeNote) depletionAgeNote.textContent = depletionAgeRounded === null ? "100세 이후까지 자산 유지" : "재정 수명 차트 기준 자산 소진 시점";
  if (monthlyWithdrawValue) monthlyWithdrawValue.textContent = fmtBig(monthlyWithdrawable);
  if (monthlyWithdrawNote) monthlyWithdrawNote.textContent = "예상 도달 자산 기준 월 인출 가능액";
  if (fireTypeValue) fireTypeValue.textContent = fireType.label;
  if (fireTypeNote) fireTypeNote.textContent = fireType.note;

  if (fireInsightText) {
    const ageSentence = expectedAgeRounded === null ? `현재 조건이라면 80세 전까지도 목표 자산에 도달하지 못합니다.` : `현재 조건이라면 ${expectedAgeRounded}세 전후 FIRE 가능성이 보입니다.`;
    const shortageSentence = result.shortageAmount > 0 ? `\uBAA9\uD45C \uC2DC\uC810\uAE4C\uC9C0 \uC57D ${fmtBig(result.shortageAmount)} \uBD80\uC871\uD558\uACE0, \uC774\uB97C \uBA54\uC6B0\uB824\uBA74 \uC6D4 ${fmtBig(additionalMonthlyNeeded)} \uC815\uB3C4 \uCD94\uAC00 \uC801\uB9BD\uC774 \uD544\uC694\uD569\uB2C8\uB2E4.` : "\uCD95\uC801 \uB2E8\uACC4\uC5D0\uC11C\uB294 \uBAA9\uD45C\uC120 \uC548\uC73C\uB85C \uB4E4\uC5B4\uC624\uBA70, \uC544\uB798 \uC7AC\uC815 \uC218\uBA85 \uCC28\uD2B8\uC5D0\uC11C \uC740\uD1F4 \uD6C4 \uC790\uC0B0 \uC9C0\uC18D \uAE30\uAC04\uC744 \uD568\uAED8 \uD655\uC778\uD558\uC138\uC694.";
    fireInsightText.textContent = `${ageSentence} ${shortageSentence}`;
  }
}

function renderProjectionChart(result) {
  const ctx = document.getElementById("fireProjectionChart");
  if (!ctx) return;
  if (projectionChart) projectionChart.destroy();

  projectionChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: result.projections.map((item) => `${Math.round(item.age)}세`),
      datasets: [
        {
          label: "예상 자산",
          data: result.projections.map((item) => Math.round(item.projectedAsset / 10000)),
          borderColor: "#0F6E56",
          backgroundColor: "#0F6E5622",
          fill: false,
          tension: 0.28,
          pointRadius: 2.5,
        },
        {
          label: "필요 FIRE 자산",
          data: result.projections.map((item) => Math.round(item.targetAsset / 10000)),
          borderColor: "#D97706",
          backgroundColor: "#D9770622",
          fill: false,
          tension: 0.22,
          pointRadius: 2.5,
          borderDash: [6, 4],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom", labels: { font: { size: 11 }, boxWidth: 12 } },
        tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${fmtChartMoneyFromMan(ctx.parsed.y)}` } },
      },
      scales: {
        y: { ticks: { callback: (value) => fmtChartMoneyFromMan(value) }, grid: { color: "#F0EFEA" } },
        x: { grid: { display: false }, ticks: { font: { size: 10 }, maxTicksLimit: 8 } },
      },
    },
  });
}


function renderLongevityChart(retirementResult) {
  const ctx = document.getElementById("fireLongevityChart");
  if (!ctx) return;
  if (longevityChart) longevityChart.destroy();

  longevityChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: retirementResult.points.map((item) => `${Math.round(item.age)}\uC138`),
      datasets: [
        {
          label: "\uC740\uD1F4 \uD6C4 \uB0A8\uB294 \uC790\uC0B0",
          data: retirementResult.points.map((item) => Math.round(item.asset / 10000)),
          borderColor: "#7C3AED",
          backgroundColor: "#7C3AED22",
          fill: true,
          tension: 0.24,
          pointRadius: 2.5,
        },
        {
          label: "\uC5F0\uAC04 \uD544\uC694 \uC0DD\uD65C\uBE44",
          data: retirementResult.points.map((item) => Math.round(item.annualNeed / 10000)),
          borderColor: "#B45309",
          backgroundColor: "#B4530922",
          fill: false,
          tension: 0.18,
          pointRadius: 2,
          borderDash: [5, 4],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom", labels: { font: { size: 11 }, boxWidth: 12 } },
        tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${fmtChartMoneyFromMan(ctx.parsed.y)}` } },
      },
      scales: {
        y: { ticks: { callback: (value) => fmtChartMoneyFromMan(value) }, grid: { color: "#F0EFEA" } },
        x: { grid: { display: false }, ticks: { font: { size: 10 }, maxTicksLimit: 8 } },
      },
    },
  });
}

function updateReturnWarning(rate) {
  if (!returnWarning) return;
  returnWarning.style.display = rate > 0.15 ? "block" : "none";
}

function renderBenchmarkTable(input) {
  if (!benchmarkTableBody) return;
  const fieldKey = `cagr${activeBenchmarkPeriod}y`;

  const customRow = `
    <tr class="fire-benchmark-row--current">
      <td>내 가정</td>
      <td>입력 기대수익률</td>
      <td>${fmtPercent(input.annualReturnRate)}</td>
      <td>현재 계산에 바로 적용 중인 기준입니다.</td>
    </tr>`;

  const marketRows = FIRE_CAGR_BENCHMARKS.map((item) => `
    <tr>
      <td>${item.category === "INDEX" ? "지수" : "종목"}</td>
      <td>${item.label}</td>
      <td>${fmtPercent(item[fieldKey])}</td>
      <td>${item.description}</td>
    </tr>`).join("");

  const difficultyLabel = { EXTREME: "재현 불가에 가까움", VERY_HIGH: "재현 매우 어려움", HIGH: "달성 가능" };
  const legendHeader = `
    <tr class="fire-benchmark-section-header">
      <td colspan="4">📌 투자의 대가 · 커리어 평균 (참고용)</td>
    </tr>`;

  const legendRows = (FIRE_LEGEND_INVESTORS || []).map((item) => `
    <tr class="fire-benchmark-row--legend">
      <td>대가</td>
      <td>
        <strong>${item.label}</strong>
        <span class="fire-legend-fund">${item.fund}</span>
      </td>
      <td class="fire-legend-cagr">${fmtPercent(item.careerCagr)}</td>
      <td>${item.careerPeriod} · ${difficultyLabel[item.difficulty] || ""}</td>
    </tr>`).join("");

  benchmarkTableBody.innerHTML = customRow + marketRows + legendHeader + legendRows;
}

function renderScenarioTable(rows) {
  if (!scenarioTableBody) return;
  scenarioTableBody.innerHTML = rows.map((row) => {
    const age = row.expectedRetireAge === null ? "미달성" : `${Math.round(row.expectedRetireAge * 10) / 10}세`;
    return `
      <tr class="${row.isCurrent ? "fire-scenario-row fire-scenario-row--current" : "fire-scenario-row"}">
        <td>${row.label}</td>
        <td>${fmtPercent(row.rate)}</td>
        <td>${fmtBig(row.targetFireAsset)}</td>
        <td>${age}</td>
        <td>${fmtBig(row.shortageAmount)}</td>
        <td>${row.additionalMonthlyNeeded > 0 ? fmtBig(row.additionalMonthlyNeeded) : "0원"}</td>
      </tr>
    `;
  }).join("");
}

function runCalculation() {
  const input = getInput();
  const result = simulateProjection(input);
  const additionalMonthlyNeeded = roundToUnit(calculateAdditionalMonthlyNeeded(input, result), 10000);
  const retirementResult = simulateRetirementDepletion(input, result);
  const fireType = classifyFireType(input);
  const scenarioRows = buildScenarioRows(input);
  renderAmountHints(input);
  renderPresetState(input.monthlyExpense);
  renderQuickValueState(input);
  renderKpis(input, result, additionalMonthlyNeeded, fireType, retirementResult);
  renderProjectionChart(result);
  renderLongevityChart(retirementResult);
  renderBenchmarkTable(input);
  renderScenarioTable(scenarioRows);
  syncUrlParams(input);
}

function resetAll() {
  Object.entries(FIRE_DEFAULT_INPUT).forEach(([key, value]) => {
    if (!fields[key]) return;
    if (moneyFieldKeys.includes(key)) fields[key].value = formatMoneyValue(value);
    else if (["annualReturnRate", "inflationRate"].includes(key)) fields[key].value = (value * 100).toFixed(1);
    else fields[key].value = String(value);
  });
  if (fields.withdrawalRate) fields.withdrawalRate.value = String(FIRE_DEFAULT_INPUT.withdrawalRate);
  if (fields.fireMode) fields.fireMode.value = FIRE_DEFAULT_INPUT.fireMode;
  activeBenchmarkPeriod = 10;
  benchmarkToggles?.querySelectorAll("[data-period]").forEach((button) => button.classList.toggle("is-active", button.getAttribute("data-period") === "10"));
  runCalculation();
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(location.href);
    if (copyBtn) copyBtn.textContent = "링크 복사됨";
    setTimeout(() => { if (copyBtn) copyBtn.textContent = "링크 복사"; }, 1600);
  } catch (error) {
    console.error(error);
  }
}

Object.entries(fields).forEach(([key, field]) => {
  if (!field) return;
  field.addEventListener("input", () => {
    if (moneyFieldKeys.includes(key)) field.value = formatMoneyValue(parseMoneyValue(field.value));
    runCalculation();
  });
  field.addEventListener("change", runCalculation);
});

fields.currentAge?.addEventListener("change", () => {
  normalizeAgeFields();
  runCalculation();
});

fields.targetRetireAge?.addEventListener("change", () => {
  normalizeAgeFields();
  runCalculation();
});


quickValueButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.getAttribute("data-quick-target");
    const value = Number(button.getAttribute("data-quick-value") || 0);
    if (!target || !fields[target] || !Number.isFinite(value)) return;
    fields[target].value = formatMoneyValue(value);
    runCalculation();
  });
});

presetGrid?.querySelectorAll("[data-preset-code]").forEach((button) => {
  button.addEventListener("click", () => {
    const monthlyExpense = parseInt(button.getAttribute("data-monthly-expense") || "0", 10);
    if (fields.monthlyExpense && monthlyExpense > 0) {
      fields.monthlyExpense.value = formatMoneyValue(monthlyExpense);
      runCalculation();
    }
  });
});

rateChips?.querySelectorAll("[data-rate]").forEach((chip) => {
  chip.addEventListener("click", () => {
    const rate = parseFloat(chip.getAttribute("data-rate") || "7");
    if (fields.annualReturnRate) {
      fields.annualReturnRate.value = rate.toFixed(1);
      rateChips.querySelectorAll("[data-rate]").forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      updateReturnWarning(rate / 100);
      runCalculation();
    }
  });
});

fields.annualReturnRate?.addEventListener("input", () => {
  const rate = parseFloat(fields.annualReturnRate.value) / 100;
  updateReturnWarning(rate);
  rateChips?.querySelectorAll("[data-rate]").forEach((c) => c.classList.remove("is-active"));
});

benchmarkToggles?.querySelectorAll("[data-period]").forEach((button) => {
  button.addEventListener("click", () => {
    activeBenchmarkPeriod = parseInt(button.getAttribute("data-period") || "10", 10);
    benchmarkToggles.querySelectorAll("[data-period]").forEach((item) => item.classList.toggle("is-active", item === button));
    renderBenchmarkTable(getInput());
  });
});

resetBtn?.addEventListener("click", resetAll);
copyBtn?.addEventListener("click", copyLink);

loadFromUrlParams();
normalizeAgeFields();
formatMoneyFields();
runCalculation();


