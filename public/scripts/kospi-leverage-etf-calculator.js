import { readParam, writeParams } from "./url-state.js";

const configEl = document.getElementById("klcConfig");
const config = configEl ? JSON.parse(configEl.textContent || "{}") : {};
const scenarios = config.SCENARIOS || [];
const defaultScenarioId = config.DEFAULT_SCENARIO_ID || (scenarios[0] && scenarios[0].id) || "sideways";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const fields = {
  principal: $("#klc-principal"),
  multiple: $("#klc-multiple"),
  feeRate: $("#klc-fee-rate"),
};

let currentScenarioId = defaultScenarioId;

function toNumber(value, fallback = 0) {
  const parsed = Number(String(value ?? "").replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value, min = 0) {
  return Math.max(min, toNumber(value));
}

function formatNumber(value, digits = 0) {
  if (!Number.isFinite(value)) return "-";
  return new Intl.NumberFormat("ko-KR", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

// "1,015만 9천원" 형태의 만/천 단위 표기. 1억원 이상이면 "약 X.X억원"으로 표기.
function formatWonKorean(absValue) {
  const abs = Math.round(Math.max(0, absValue));
  if (abs >= 100_000_000) {
    return `약 ${formatNumber(abs / 100_000_000, 1)}억원`;
  }
  const man = Math.floor(abs / 10_000);
  const cheon = Math.floor((abs % 10_000) / 1000);
  if (man === 0 && cheon === 0) return `${formatNumber(abs)}원`;
  if (cheon === 0) return `${formatNumber(man)}만원`;
  return `${formatNumber(man)}만 ${cheon}천원`;
}

function formatSignedWon(value) {
  if (!Number.isFinite(value)) return "-";
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${formatWonKorean(Math.abs(value))}`;
}

function formatPercent(value, digits = 2) {
  if (!Number.isFinite(value)) return "-";
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatNumber(value * 100, digits)}%`;
}

function setResult(key, value) {
  $$(`[data-result="${key}"]`).forEach((node) => {
    node.textContent = value;
  });
}

function getScenario(id) {
  return scenarios.find((s) => s.id === id) || scenarios[0];
}

function readInputs() {
  const principal = clamp(fields.principal?.value) * 10_000; // 입력 단위는 항상 만원
  const multipleRaw = fields.multiple ? toNumber(fields.multiple.value, 2) : 2;
  const multiple = Math.min(5, Math.max(1, multipleRaw));
  const feeRateInput = fields.feeRate ? toNumber(fields.feeRate.value, 0.64) : 0.64;
  const annualFeeRate = Math.max(0, feeRateInput) / 100;

  return { principal, multiple, annualFeeRate };
}

function calculateLeverage(inputs, scenario) {
  const dailyReturns = scenario.dailyIndexReturns;
  const tradingDays = dailyReturns.length;

  let indexValue = 1;
  let leverageValue = 1;
  for (const r of dailyReturns) {
    indexValue *= 1 + r;
    const leveragedDaily = Math.max(inputs.multiple * r, -1);
    leverageValue *= 1 + leveragedDaily;
  }

  const indexCumulativeReturn = indexValue - 1;
  const leverageSimpleReturn = indexCumulativeReturn * inputs.multiple;
  const leverageActualReturnPreFee = leverageValue - 1;
  const decayGap = leverageActualReturnPreFee - leverageSimpleReturn;

  const feeDrag = inputs.annualFeeRate * (tradingDays / 252);
  const leverageFinalReturn = leverageActualReturnPreFee - feeDrag;

  const finalAmount = inputs.principal * (1 + leverageFinalReturn);
  const indexOnlyFinalAmount = inputs.principal * (1 + indexCumulativeReturn);
  const recoveryReturnNeeded = leverageFinalReturn < 0 ? 1 / (1 + leverageFinalReturn) - 1 : null;

  return {
    tradingDays,
    indexCumulativeReturn,
    leverageSimpleReturn,
    leverageActualReturnPreFee,
    decayGap,
    feeDrag,
    leverageFinalReturn,
    finalAmount,
    indexOnlyFinalAmount,
    recoveryReturnNeeded,
  };
}

function renderPathTable(scenario, multiple) {
  const body = $("[data-klc-path-body]");
  if (!body) return;
  body.innerHTML = "";

  const startRow = document.createElement("tr");
  startRow.innerHTML = "<td>시작</td><td>0.00%</td><td>0.00%</td>";
  body.appendChild(startRow);

  let indexAcc = 1;
  let leverageAcc = 1;
  scenario.dailyIndexReturns.forEach((r, i) => {
    indexAcc *= 1 + r;
    leverageAcc *= 1 + Math.max(multiple * r, -1);
    const row = document.createElement("tr");
    row.innerHTML = `<td>${i + 1}일차</td><td>${formatPercent(indexAcc - 1)}</td><td>${formatPercent(leverageAcc - 1)}</td>`;
    body.appendChild(row);
  });
}

function updateMultipleLabels(multiple) {
  const label = `${formatNumber(multiple, multiple % 1 === 0 ? 0 : 1)}배`;
  setResult("multipleLabelHint", label);
}

function render() {
  const inputs = readInputs();
  const scenario = getScenario(currentScenarioId);
  const result = calculateLeverage(inputs, scenario);
  const valid = inputs.principal > 0;
  const profit = result.finalAmount - inputs.principal;
  const indexProfit = result.indexOnlyFinalAmount - inputs.principal;
  const diffVsIndex = result.finalAmount - result.indexOnlyFinalAmount;

  updateMultipleLabels(inputs.multiple);

  setResult("finalAmount", valid ? formatWonKorean(result.finalAmount) : "-");
  setResult("profitAmount", valid ? `${formatSignedWon(profit)} (${formatPercent(result.leverageFinalReturn)})` : "-");
  setResult("indexOnlyFinalAmount", valid ? `${formatWonKorean(result.indexOnlyFinalAmount)} (${formatSignedWon(indexProfit)})` : "-");

  if (valid) {
    if (Math.abs(diffVsIndex) < 1) {
      setResult("compareSentence", "이번 시나리오에서는 레버리지와 코스피200 일반 투자 결과가 거의 같습니다.");
    } else if (diffVsIndex < 0) {
      setResult("compareSentence", `이번 시나리오에서는 레버리지보다 코스피200 일반 투자가 ${formatWonKorean(Math.abs(diffVsIndex))} 더 유리합니다.`);
    } else {
      setResult("compareSentence", `이번 시나리오에서는 코스피200 일반 투자보다 레버리지가 ${formatWonKorean(Math.abs(diffVsIndex))} 더 유리합니다.`);
    }
  } else {
    setResult("compareSentence", "투자금액을 입력하면 계산합니다.");
  }

  const recoveryNote = $("[data-result='recoveryNote']");
  if (valid && result.recoveryReturnNeeded !== null) {
    setResult("recoveryNote", `원금을 회복하려면 약 ${formatPercent(result.recoveryReturnNeeded)} 상승이 필요합니다.`);
    recoveryNote?.removeAttribute("hidden");
  } else {
    recoveryNote?.setAttribute("hidden", "");
  }

  setResult("indexCumulativeReturn", valid ? formatPercent(result.indexCumulativeReturn) : "-");
  setResult("leverageSimpleReturn", valid ? formatPercent(result.leverageSimpleReturn) : "-");
  setResult("leverageActualReturnPreFee", valid ? formatPercent(result.leverageActualReturnPreFee) : "-");
  setResult("leverageFinalReturn", valid ? formatPercent(result.leverageFinalReturn) : "-");
  setResult("decayGap", valid ? `${formatPercent(result.decayGap)}p` : "-");

  const detailReason = $("[data-result='detailReason']");
  if (detailReason) {
    detailReason.textContent =
      result.decayGap < -0.0001
        ? "상승과 하락이 반복되며 최종 레버리지 수익률이 단순 계산보다 낮아졌습니다."
        : result.decayGap > 0.0001
          ? "추세가 이어지며 레버리지 수익률이 단순 계산보다 높아졌습니다."
          : "단순 계산과 시뮬레이션 결과가 거의 같습니다.";
  }

  renderPathTable(scenario, inputs.multiple);

  writeParams({
    principal: Math.round(clamp(fields.principal?.value)),
    multiple: inputs.multiple,
    scenario: currentScenarioId,
    fee: inputs.annualFeeRate * 100,
  });
}

function selectScenario(id) {
  currentScenarioId = getScenario(id).id;
  $$("[data-scenario-id]").forEach((btn) => {
    btn.setAttribute("aria-pressed", btn.dataset.scenarioId === currentScenarioId ? "true" : "false");
  });
  render();
}

function setPrincipal(won) {
  if (!fields.principal) return;
  fields.principal.value = String(Math.round(won / 10_000));
  render();
}

function hydrateFromUrl() {
  const principalWon = toNumber(readParam("principal", 10_000_000), 10_000_000);
  if (fields.principal) fields.principal.value = String(Math.round(principalWon / 10_000));
  if (fields.multiple) fields.multiple.value = readParam("multiple", "2");
  if (fields.feeRate) fields.feeRate.value = readParam("fee", "0.64");
  currentScenarioId = getScenario(readParam("scenario", defaultScenarioId)).id;
  $$("[data-scenario-id]").forEach((btn) => {
    btn.setAttribute("aria-pressed", btn.dataset.scenarioId === currentScenarioId ? "true" : "false");
  });
}

[fields.principal, fields.multiple, fields.feeRate].forEach((field) => {
  field?.addEventListener("input", render);
  field?.addEventListener("change", render);
});

$$("[data-scenario-id]").forEach((button) => {
  button.addEventListener("click", () => selectScenario(button.dataset.scenarioId));
});

$$("[data-principal-preset]").forEach((button) => {
  button.addEventListener("click", () => setPrincipal(Number(button.dataset.principalPreset)));
});

$("#klcResetBtn")?.addEventListener("click", () => {
  if (fields.principal) fields.principal.value = "1000";
  if (fields.multiple) fields.multiple.value = "2";
  if (fields.feeRate) fields.feeRate.value = "0.64";
  selectScenario(defaultScenarioId);
});

$("#klcCopyLinkBtn")?.addEventListener("click", async (event) => {
  render();
  try {
    await navigator.clipboard.writeText(window.location.href);
    event.currentTarget.textContent = "링크 복사됨";
    window.setTimeout(() => {
      event.currentTarget.textContent = "링크 복사";
    }, 1600);
  } catch {
    event.currentTarget.textContent = "복사 실패";
  }
});

hydrateFromUrl();
render();
