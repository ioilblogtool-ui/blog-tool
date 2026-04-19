const configEl = document.getElementById("ipcConfig");
const {
  defaults = {},
  presets = [],
  returnPresets = [],
  rules = {},
} = JSON.parse(configEl?.textContent || "{}");

const page = document.querySelector('[data-calculator="irp-pension-calculator"]');
const $ = (id) => document.getElementById(id);

function formatCurrency(value) {
  return `${Math.round(Number(value || 0)).toLocaleString("ko-KR")}원`;
}

function formatManwon(value) {
  return `${Math.round(Number(value || 0) / 10000).toLocaleString("ko-KR")}만원`;
}

function parseCurrency(value) {
  return Number(String(value || "").replace(/[^\d.-]/g, "")) || 0;
}

function formatInput(input) {
  const numeric = parseCurrency(input.value);
  input.value = numeric > 0 ? numeric.toLocaleString("ko-KR") : "";
}

function getNumber(id, fallback = 0) {
  const element = $(id);
  if (!element) return fallback;
  if (element.dataset.currency === "true") return parseCurrency(element.value);
  const value = Number(element.value);
  return Number.isFinite(value) ? value : fallback;
}

function getChecked(name, fallback) {
  return document.querySelector(`[name="${name}"]:checked`)?.value || fallback;
}

function readInputs() {
  return {
    currentAge: getNumber("ipcCurrentAge", defaults.currentAge),
    retireAge: getNumber("ipcRetireAge", defaults.retireAge),
    currentIrpBalance: getNumber("ipcCurrentIrp", defaults.currentIrpBalance),
    currentDcBalance: getNumber("ipcCurrentDc", defaults.currentDcBalance),
    monthlyContribution: getNumber("ipcMonthlyContribution", defaults.monthlyContribution),
    annualReturnRate: getNumber("ipcAnnualReturn", defaults.annualReturnRate * 100) / 100,
    payoutMode: getChecked("ipcPayoutMode", defaults.payoutMode),
    annuityStartAge: getNumber("ipcAnnuityStartAge", defaults.annuityStartAge),
    annuityPeriod: getNumber("ipcAnnuityPeriod", defaults.annuityPeriod),
    applyPostRetirementReturn: Boolean($("ipcPostRetirementReturn")?.checked),
    postRetirementReturnRate: getNumber("ipcPostRetirementReturnRate", defaults.postRetirementReturnRate * 100) / 100,
  };
}

function validate(input) {
  const retireAge = Math.max(input.currentAge, input.retireAge);
  const annuityStartAge = Math.max(retireAge, input.annuityStartAge);
  return {
    ...input,
    currentAge: Math.max(rules.minCurrentAge || 20, input.currentAge),
    retireAge,
    annuityStartAge,
    annuityPeriod: Math.max(10, input.annuityPeriod),
    annualReturnRate: Math.min(rules.maxReturnRate || 0.12, Math.max(0, input.annualReturnRate)),
    postRetirementReturnRate: Math.min(rules.maxReturnRate || 0.12, Math.max(0, input.postRetirementReturnRate)),
    monthlyContribution: Math.max(0, input.monthlyContribution),
  };
}

function calculateFutureValue(balance, monthlyContribution, annualReturnRate, months) {
  const monthlyRate = annualReturnRate / 12;
  if (months <= 0) return balance;
  if (monthlyRate === 0) return balance + monthlyContribution * months;
  return balance * Math.pow(1 + monthlyRate, months) +
    monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
}

function calculateMonthlyAnnuity(total, months, annualReturnRate, applyReturn) {
  if (months <= 0) return 0;
  const monthlyRate = applyReturn ? annualReturnRate / 12 : 0;
  if (monthlyRate <= 0) return total / months;
  return total * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -months)));
}

function runScenario(input, overrides = {}) {
  const state = validate({ ...input, ...overrides });
  const accumulationMonths = Math.max(0, (state.retireAge - state.currentAge) * 12);
  const currentTotalBalance = state.currentIrpBalance + state.currentDcBalance;
  const futureValue = calculateFutureValue(
    currentTotalBalance,
    state.monthlyContribution,
    state.annualReturnRate,
    accumulationMonths
  );
  const principal = currentTotalBalance + state.monthlyContribution * accumulationMonths;
  const expectedGain = Math.max(0, futureValue - principal);
  const annuityMonths = Math.max(1, state.annuityPeriod * 12);
  const annuity = calculateMonthlyAnnuity(
    futureValue,
    annuityMonths,
    state.postRetirementReturnRate,
    state.applyPostRetirementReturn
  );
  return {
    input: state,
    accumulationMonths,
    futureValue,
    principal,
    expectedGain,
    annuityMonths,
    monthlyAnnuity: annuity,
    lumpSum: futureValue,
  };
}

function comparisonRows(input) {
  const annuity = runScenario(input, { payoutMode: "annuity" });
  const lumpSum = runScenario(input, { payoutMode: "lump-sum" });
  return [
    ["초기 활용 방식", "매달 나눠 수령", "은퇴 시점 목돈 확보"],
    ["예상 월 현금흐름", formatManwon(annuity.monthlyAnnuity), "별도 운용 필요"],
    ["은퇴 시점 총 적립금", formatManwon(annuity.futureValue), formatManwon(lumpSum.futureValue)],
    ["적합한 상황", "생활비 안정성 우선", "주택·대출상환·재투자 계획"],
  ];
}

function sensitivityRows(input) {
  const rows = [];
  [100000, 300000, 500000].forEach((contribution) => {
    const result = runScenario(input, { monthlyContribution: contribution });
    rows.push({
      label: `월 ${Math.round(contribution / 10000)}만원 납입`,
      futureValue: result.futureValue,
      monthlyAnnuity: result.monthlyAnnuity,
    });
  });
  [0.03, 0.05, 0.07].forEach((rate) => {
    const result = runScenario(input, { annualReturnRate: rate });
    rows.push({
      label: `수익률 ${Math.round(rate * 100)}%`,
      futureValue: result.futureValue,
      monthlyAnnuity: result.monthlyAnnuity,
    });
  });
  [55, 60, 65].forEach((retireAge) => {
    const result = runScenario(input, { retireAge });
    rows.push({
      label: `은퇴 ${retireAge}세`,
      futureValue: result.futureValue,
      monthlyAnnuity: result.monthlyAnnuity,
    });
  });
  return rows;
}

function renderSummary(result) {
  $("ipcFutureValue").textContent = formatManwon(result.futureValue);
  $("ipcPrincipal").textContent = formatManwon(result.principal);
  $("ipcExpectedGain").textContent = formatManwon(result.expectedGain);
  $("ipcMonthlyAnnuity").textContent = formatManwon(result.monthlyAnnuity);
  $("ipcMonthlyAnnuitySub").textContent =
    `${result.input.annuityPeriod}년 기준 월 추정 수령액 · ${result.input.applyPostRetirementReturn ? "은퇴 후 운용 반영" : "보수적 단순 분할"}`;
}

function renderComparison(input) {
  const body = $("ipcComparisonBody");
  if (!body) return;
  body.innerHTML = comparisonRows(input)
    .map(
      ([label, annuity, lumpSum]) =>
        `<tr><th scope="row">${label}</th><td>${annuity}</td><td>${lumpSum}</td></tr>`
    )
    .join("");
}

function renderSensitivity(input) {
  const body = $("ipcSensitivityBody");
  if (!body) return;
  body.innerHTML = sensitivityRows(input)
    .map(
      (row) =>
        `<tr><th scope="row">${row.label}</th><td>${formatManwon(row.futureValue)}</td><td>${formatManwon(row.monthlyAnnuity)}</td></tr>`
    )
    .join("");
}

function updateQuery(input) {
  const params = new URLSearchParams();
  params.set("age", String(input.currentAge));
  params.set("retire", String(input.retireAge));
  params.set("irp", String(input.currentIrpBalance));
  params.set("dc", String(input.currentDcBalance));
  params.set("monthly", String(input.monthlyContribution));
  params.set("rate", String(input.annualReturnRate));
  params.set("mode", input.payoutMode);
  params.set("start", String(input.annuityStartAge));
  params.set("period", String(input.annuityPeriod));
  params.set("post", input.applyPostRetirementReturn ? "1" : "0");
  params.set("postRate", String(input.postRetirementReturnRate));
  history.replaceState(null, "", `${location.pathname}?${params.toString()}`);
}

function restoreQuery() {
  const params = new URLSearchParams(location.search);
  const map = [
    ["age", "ipcCurrentAge"],
    ["retire", "ipcRetireAge"],
    ["irp", "ipcCurrentIrp"],
    ["dc", "ipcCurrentDc"],
    ["monthly", "ipcMonthlyContribution"],
    ["rate", "ipcAnnualReturn", true],
    ["start", "ipcAnnuityStartAge"],
    ["period", "ipcAnnuityPeriod"],
    ["postRate", "ipcPostRetirementReturnRate", true],
  ];
  map.forEach(([param, id, isRate]) => {
    const value = params.get(param);
    if (value === null || !$(id)) return;
    const numeric = Number(value);
    $(id).value = Number.isFinite(numeric)
      ? String(isRate ? numeric * 100 : numeric)
      : value;
  });

  const mode = params.get("mode");
  if (mode) {
    const radio = document.querySelector(`[name="ipcPayoutMode"][value="${mode}"]`);
    if (radio) radio.checked = true;
  }
  $("ipcPostRetirementReturn").checked = params.get("post") === "1";

  document.querySelectorAll('[data-currency="true"]').forEach(formatInput);
}

function applyPreset(presetId) {
  const preset = presets.find((item) => item.id === presetId);
  if (!preset) return;
  const values = preset.values || {};
  $("ipcCurrentAge").value = String(values.currentAge ?? defaults.currentAge);
  $("ipcRetireAge").value = String(values.retireAge ?? defaults.retireAge);
  $("ipcCurrentIrp").value = String(values.currentIrpBalance ?? defaults.currentIrpBalance);
  $("ipcCurrentDc").value = String(values.currentDcBalance ?? defaults.currentDcBalance);
  $("ipcMonthlyContribution").value = String(values.monthlyContribution ?? defaults.monthlyContribution);
  $("ipcAnnualReturn").value = String((values.annualReturnRate ?? defaults.annualReturnRate) * 100);
  $("ipcAnnuityStartAge").value = String(values.annuityStartAge ?? defaults.annuityStartAge);
  $("ipcAnnuityPeriod").value = String(values.annuityPeriod ?? defaults.annuityPeriod);
  $("ipcPostRetirementReturn").checked = Boolean(values.applyPostRetirementReturn);
  $("ipcPostRetirementReturnRate").value = String((values.postRetirementReturnRate ?? defaults.postRetirementReturnRate) * 100);
  const radio = document.querySelector(`[name="ipcPayoutMode"][value="${values.payoutMode ?? defaults.payoutMode}"]`);
  if (radio) radio.checked = true;
  document.querySelectorAll('[data-currency="true"]').forEach(formatInput);
  renderAll();
}

function resetForm() {
  if (!page) return;
  page.querySelectorAll("input").forEach((input) => {
    if (input.type === "radio") {
      input.checked = input.defaultChecked;
    } else if (input.type === "checkbox") {
      input.checked = input.defaultChecked;
    } else {
      input.value = input.defaultValue;
    }
  });
  page.querySelectorAll("select").forEach((select) => {
    select.value = select.querySelector("option[selected]")?.value || select.options[0]?.value || "";
  });
  document.querySelectorAll('[data-currency="true"]').forEach(formatInput);
  renderAll();
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(location.href);
    const button = $("copyIpcLinkBtn");
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

function togglePostRetirementField() {
  $("ipcPostRetirementWrap").hidden = !$("ipcPostRetirementReturn")?.checked;
}

function renderAll() {
  togglePostRetirementField();
  const input = validate(readInputs());
  const result = runScenario(input);
  renderSummary(result);
  renderComparison(input);
  renderSensitivity(input);
  updateQuery(input);
}

restoreQuery();

document.querySelectorAll('[data-currency="true"]').forEach((input) => {
  formatInput(input);
  input.addEventListener("input", () => formatInput(input));
  input.addEventListener("blur", () => formatInput(input));
});

document.querySelectorAll("[data-ipc-preset]").forEach((button) => {
  button.addEventListener("click", () => applyPreset(button.dataset.ipcPreset));
});

document.querySelectorAll("[data-ipc-return]").forEach((button) => {
  button.addEventListener("click", () => {
    $("ipcAnnualReturn").value = String(Number(button.dataset.ipcReturn) * 100);
    renderAll();
  });
});

page?.querySelectorAll("input, select").forEach((element) => {
  element.addEventListener("input", renderAll);
  element.addEventListener("change", renderAll);
});

$("resetIpcBtn")?.addEventListener("click", resetForm);
$("copyIpcLinkBtn")?.addEventListener("click", copyLink);
$("ipcPostRetirementReturn")?.addEventListener("change", renderAll);

renderAll();
