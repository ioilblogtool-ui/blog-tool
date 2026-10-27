// url-state.js는 브라우저에 최대 4시간 캐시된다. deleteParams가 없는 이전 사본을 피하려고 버전 쿼리를 붙인다.
import { readParam, writeParams, deleteParams } from "./url-state.js?v=20261027";

const configEl = document.getElementById("klcConfig");
const config = configEl ? JSON.parse(configEl.textContent || "{}") : {};
const scenarios = config.SCENARIOS || [];
const defaultScenarioId = config.DEFAULT_SCENARIO_ID || (scenarios[0] && scenarios[0].id) || "sideways";
const PATH_DEFAULTS = config.PATH_DEFAULTS || {
  dropPct: 20,
  dropDays: 1,
  reboundMode: "auto",
  reboundPct: 25,
  reboundDays: 1,
  altAmpPct: 10,
  altCycles: 2,
};
const PATH_LIMITS = config.PATH_LIMITS || {
  dropPct: [0.1, 95],
  days: [1, 60],
  reboundPct: [0, 500],
  altAmpPct: [1, 30],
  altCycles: [1, 20],
};
const PATH_URL_KEYS = ["drop", "dd", "rm", "reb", "rd", "amp", "n"];
const PATH_TABLE_COLLAPSE_AT = 20;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const fields = {
  principal: $("#klc-principal"),
  multiple: $("#klc-multiple"),
  feeRate: $("#klc-fee-rate"),
};

const pathFields = {
  drop: $("#klc-drop"),
  dropDays: $("#klc-drop-days"),
  rebound: $("#klc-rebound"),
  reboundDays: $("#klc-rebound-days"),
  altAmp: $("#klc-alt-amp"),
  altCycles: $("#klc-alt-cycles"),
};

let currentScenarioId = defaultScenarioId;
let pathTableExpanded = false;

function toNumber(value, fallback = 0) {
  const parsed = Number(String(value ?? "").replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value, min = 0) {
  return Math.max(min, toNumber(value));
}

function clampRange(value, [min, max], fallback) {
  const n = toNumber(value, fallback);
  return Math.min(max, Math.max(min, n));
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
  // 분할 경로의 부동소수 오차(예: -0.0000001)가 "-0.00%"로 보이지 않게 표시 자릿수로 먼저 반올림한다.
  const rounded = Number((value * 100).toFixed(digits));
  if (rounded === 0) return `${formatNumber(0, digits)}%`;
  const sign = rounded > 0 ? "+" : "";
  return `${sign}${formatNumber(rounded, digits)}%`;
}

function setResult(key, value) {
  $$(`[data-result="${key}"]`).forEach((node) => {
    node.textContent = value;
  });
}

function toggleNode(selector, show) {
  const node = $(selector);
  if (!node) return;
  if (show) node.removeAttribute("hidden");
  else node.setAttribute("hidden", "");
}

// ── 시장 흐름 경로 ────────────────────────────────

function splitDaily(totalReturn, days) {
  return Array(days).fill(Math.pow(1 + totalReturn, 1 / days) - 1);
}

function readPathState() {
  const reboundMode = $('input[name="klc-rebound-mode"]:checked')?.value === "manual" ? "manual" : "auto";
  return {
    dropPct: clampRange(pathFields.drop?.value, PATH_LIMITS.dropPct, PATH_DEFAULTS.dropPct),
    dropDays: Math.round(clampRange(pathFields.dropDays?.value, PATH_LIMITS.days, PATH_DEFAULTS.dropDays)),
    reboundMode,
    reboundPct: clampRange(pathFields.rebound?.value, PATH_LIMITS.reboundPct, PATH_DEFAULTS.reboundPct),
    reboundDays: Math.round(clampRange(pathFields.reboundDays?.value, PATH_LIMITS.days, PATH_DEFAULTS.reboundDays)),
    altAmpPct: clampRange(pathFields.altAmp?.value, PATH_LIMITS.altAmpPct, PATH_DEFAULTS.altAmpPct),
    altCycles: Math.round(clampRange(pathFields.altCycles?.value, PATH_LIMITS.altCycles, PATH_DEFAULTS.altCycles)),
  };
}

function autoRebound(dropPct) {
  return 1 / (1 - dropPct / 100) - 1;
}

function buildPath(builder, s) {
  if (builder === "crashRebound") {
    const drop = -s.dropPct / 100;
    const rebound = s.reboundMode === "auto" ? autoRebound(s.dropPct) : s.reboundPct / 100;
    return {
      returns: [...splitDaily(drop, s.dropDays), ...splitDaily(rebound, s.reboundDays)],
      segments: [
        { label: "하락", days: s.dropDays },
        { label: "반등", days: s.reboundDays },
      ],
      dropDays: s.dropDays,
    };
  }
  if (builder === "alternating") {
    const a = s.altAmpPct / 100;
    const returns = [];
    for (let i = 0; i < s.altCycles; i++) returns.push(a, -a);
    return { returns, segments: [{ label: "반복", days: returns.length }], dropDays: 1 };
  }
  return null;
}

function getScenario(id) {
  const meta = scenarios.find((s) => s.id === id) || scenarios[0];
  if (!meta || !meta.builder) return { ...meta, segments: null, dropDays: 1 };
  const built = buildPath(meta.builder, readPathState());
  return { ...meta, dailyIndexReturns: built.returns, segments: built.segments, dropDays: built.dropDays };
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
    // 하루 변동 × 배율이 -100% 이하이면 레버리지 가치가 0이 된다.
    wipedOut: dailyReturns.some((r) => inputs.multiple * r <= -1),
  };
}

// 레버리지 누적 가치 L에서 원금 1로 돌아가기 위해, days일 균등 반등을 가정할 때 필요한 지수 총 상승률.
// src/utils/kospiLeverageEtfCalculator.ts의 indexRecoveryNeeded와 같은 산식이다.
function indexRecoveryNeeded(L, multiple, days) {
  if (L >= 1) return 0;
  if (L <= 0) return null;
  const target = 1 / L;
  const lev = (T) => Math.pow(1 + Math.max(multiple * (Math.pow(1 + T, 1 / days) - 1), -1), days);
  let lo = 0;
  let hi = 10;
  if (lev(hi) < target) return null;
  for (let i = 0; i < 200 && hi - lo > 1e-12; i++) {
    const mid = (lo + hi) / 2;
    if (lev(mid) >= target) hi = mid;
    else lo = mid;
  }
  return hi;
}

function segmentLabelAt(segments, index) {
  if (!segments) return "";
  let offset = 0;
  for (const seg of segments) {
    if (index < offset + seg.days) return seg.label;
    offset += seg.days;
  }
  return "";
}

function renderPathTable(scenario, multiple) {
  const body = $("[data-klc-path-body]");
  if (!body) return;
  body.innerHTML = "";

  const showSegment = Boolean(scenario.segments);
  const total = scenario.dailyIndexReturns.length;
  const collapse = total > PATH_TABLE_COLLAPSE_AT && !pathTableExpanded;

  const addRow = (cells, className) => {
    const row = document.createElement("tr");
    if (className) row.className = className;
    row.innerHTML = cells.map((c) => `<td>${c}</td>`).join("");
    body.appendChild(row);
  };

  addRow(["시작", "0.00%", "0.00%"]);

  let indexAcc = 1;
  let leverageAcc = 1;
  scenario.dailyIndexReturns.forEach((r, i) => {
    indexAcc *= 1 + r;
    leverageAcc *= 1 + Math.max(multiple * r, -1);
    if (collapse && i >= 5 && i < total - 5) {
      if (i === 5) addRow([`… ${total - 10}일 생략 …`, "", ""], "klc-path-gap");
      return;
    }
    const segment = showSegment ? `${segmentLabelAt(scenario.segments, i)} · ` : "";
    addRow([`${segment}${i + 1}일차`, formatPercent(indexAcc - 1), formatPercent(leverageAcc - 1)]);
  });

  const toggle = $("[data-klc-path-toggle]");
  if (toggle) {
    if (total > PATH_TABLE_COLLAPSE_AT) {
      toggle.removeAttribute("hidden");
      toggle.textContent = pathTableExpanded ? "접기" : `전체 ${total}일 보기`;
    } else {
      toggle.setAttribute("hidden", "");
    }
  }
}

function updateMultipleLabels(multiple) {
  const label = `${formatNumber(multiple, multiple % 1 === 0 ? 0 : 1)}배`;
  setResult("multipleLabelHint", label);
}

function updatePathPanel(scenario) {
  const builder = scenario.builder || null;
  toggleNode("[data-klc-path-panel]", Boolean(builder));
  $$("[data-klc-builder]").forEach((node) => {
    if (node.dataset.klcBuilder === builder) node.removeAttribute("hidden");
    else node.setAttribute("hidden", "");
  });

  const state = readPathState();
  const manual = state.reboundMode === "manual";
  if (pathFields.rebound) pathFields.rebound.disabled = !manual;
  if (!manual) {
    const auto = autoRebound(state.dropPct);
    if (pathFields.rebound) pathFields.rebound.value = formatNumber(auto * 100, 2).replace(/,/g, "");
    setResult("autoReboundHint", `원점 회복에 필요한 ${formatPercent(auto)}가 자동 적용됩니다.`);
  } else {
    setResult("autoReboundHint", "직접 입력한 반등률을 적용합니다.");
  }
}

function render() {
  const inputs = readInputs();
  const scenario = getScenario(currentScenarioId);
  updatePathPanel(scenario);
  const result = calculateLeverage(inputs, scenario);
  const valid = inputs.principal > 0 && !result.wipedOut;
  const profit = result.finalAmount - inputs.principal;
  const indexProfit = result.indexOnlyFinalAmount - inputs.principal;
  const diffVsIndex = result.finalAmount - result.indexOnlyFinalAmount;

  updateMultipleLabels(inputs.multiple);
  toggleNode("[data-result='wipeoutWarning']", result.wipedOut);

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
    setResult("compareSentence", result.wipedOut ? "하루 변동이 너무 커서 계산하지 않았습니다." : "투자금액을 입력하면 계산합니다.");
  }

  const showRecovery = valid && result.recoveryReturnNeeded !== null;
  if (showRecovery) {
    setResult("recoveryNote", `원금을 회복하려면 레버리지 ETF가 약 ${formatPercent(result.recoveryReturnNeeded)} 상승해야 합니다.`);
    const days = scenario.dropDays || 1;
    const indexNeeded = indexRecoveryNeeded(1 + result.leverageActualReturnPreFee, inputs.multiple, days);
    const dayText = days === 1 ? "하루에 반등한다고" : `${days}거래일에 걸쳐 고르게 오른다고`;
    setResult(
      "indexRecoveryNote",
      indexNeeded === null
        ? "코스피200 기준으로는 계산 범위(+1,000%)를 넘는 상승이 필요합니다."
        : `코스피200 기준으로는 ${dayText} 가정할 때 약 ${formatPercent(indexNeeded)} 상승이 필요합니다(운용보수 제외).`,
    );
  }
  toggleNode("[data-result='recoveryNote']", showRecovery);
  toggleNode("[data-result='indexRecoveryNote']", showRecovery);

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
  syncPathParams(scenario);
}

function syncPathParams(scenario) {
  if (!scenario.builder) {
    deleteParams(PATH_URL_KEYS);
    return;
  }
  const s = readPathState();
  if (scenario.builder === "crashRebound") {
    deleteParams(["amp", "n", ...(s.reboundMode === "auto" ? ["reb"] : [])]);
    const params = { drop: s.dropPct, dd: s.dropDays, rm: s.reboundMode, rd: s.reboundDays };
    if (s.reboundMode === "manual") params.reb = s.reboundPct;
    writeParams(params);
  } else {
    deleteParams(["drop", "dd", "rm", "reb", "rd"]);
    writeParams({ amp: s.altAmpPct, n: s.altCycles });
  }
}

function selectScenario(id) {
  currentScenarioId = (scenarios.find((s) => s.id === id) || scenarios[0]).id;
  pathTableExpanded = false;
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

function setReboundMode(mode) {
  $$('input[name="klc-rebound-mode"]').forEach((radio) => {
    radio.checked = radio.value === mode;
  });
}

function applyPathState(s) {
  if (pathFields.drop) pathFields.drop.value = String(s.dropPct);
  if (pathFields.dropDays) pathFields.dropDays.value = String(s.dropDays);
  if (pathFields.rebound) pathFields.rebound.value = String(s.reboundPct);
  if (pathFields.reboundDays) pathFields.reboundDays.value = String(s.reboundDays);
  if (pathFields.altAmp) pathFields.altAmp.value = String(s.altAmpPct);
  if (pathFields.altCycles) pathFields.altCycles.value = String(s.altCycles);
  setReboundMode(s.reboundMode);
}

function hydrateFromUrl() {
  // render()가 principal을 만원 단위로 기록하므로 읽을 때도 만원 단위로 해석한다.
  const principalManwon = toNumber(readParam("principal", 1000), 1000);
  if (fields.principal) fields.principal.value = String(Math.round(Math.max(0, principalManwon)));
  if (fields.multiple) fields.multiple.value = readParam("multiple", "2");
  if (fields.feeRate) fields.feeRate.value = readParam("fee", "0.64");
  currentScenarioId = (scenarios.find((s) => s.id === readParam("scenario", defaultScenarioId)) || scenarios[0]).id;
  $$("[data-scenario-id]").forEach((btn) => {
    btn.setAttribute("aria-pressed", btn.dataset.scenarioId === currentScenarioId ? "true" : "false");
  });
  applyPathState({
    dropPct: toNumber(readParam("drop", PATH_DEFAULTS.dropPct), PATH_DEFAULTS.dropPct),
    dropDays: toNumber(readParam("dd", PATH_DEFAULTS.dropDays), PATH_DEFAULTS.dropDays),
    reboundMode: readParam("rm", PATH_DEFAULTS.reboundMode) === "manual" ? "manual" : "auto",
    reboundPct: toNumber(readParam("reb", PATH_DEFAULTS.reboundPct), PATH_DEFAULTS.reboundPct),
    reboundDays: toNumber(readParam("rd", PATH_DEFAULTS.reboundDays), PATH_DEFAULTS.reboundDays),
    altAmpPct: toNumber(readParam("amp", PATH_DEFAULTS.altAmpPct), PATH_DEFAULTS.altAmpPct),
    altCycles: toNumber(readParam("n", PATH_DEFAULTS.altCycles), PATH_DEFAULTS.altCycles),
  });
}

[fields.principal, fields.multiple, fields.feeRate, ...Object.values(pathFields)].forEach((field) => {
  field?.addEventListener("input", render);
  field?.addEventListener("change", render);
});

// 기간·횟수 필드는 포커스를 벗어날 때 허용 범위의 정수로 보정한다.
[
  [pathFields.dropDays, PATH_LIMITS.days],
  [pathFields.reboundDays, PATH_LIMITS.days],
  [pathFields.altCycles, PATH_LIMITS.altCycles],
].forEach(([field, range]) => {
  field?.addEventListener("blur", () => {
    field.value = String(Math.round(clampRange(field.value, range, range[0])));
    render();
  });
});

$$('input[name="klc-rebound-mode"]').forEach((radio) => {
  radio.addEventListener("change", render);
});

$$("[data-scenario-id]").forEach((button) => {
  button.addEventListener("click", () => selectScenario(button.dataset.scenarioId));
});

$$("[data-principal-preset]").forEach((button) => {
  button.addEventListener("click", () => setPrincipal(Number(button.dataset.principalPreset)));
});

$$("[data-klc-path-preset]").forEach((button) => {
  button.addEventListener("click", () => {
    const days = Number(button.dataset.days);
    applyPathState({ ...readPathState(), dropPct: Number(button.dataset.drop), dropDays: days, reboundDays: days, reboundMode: "auto" });
    pathTableExpanded = false;
    render();
  });
});

$("[data-klc-path-toggle]")?.addEventListener("click", () => {
  pathTableExpanded = !pathTableExpanded;
  render();
});

$("#klcResetBtn")?.addEventListener("click", () => {
  if (fields.principal) fields.principal.value = "1000";
  if (fields.multiple) fields.multiple.value = "2";
  if (fields.feeRate) fields.feeRate.value = "0.64";
  applyPathState(PATH_DEFAULTS);
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
