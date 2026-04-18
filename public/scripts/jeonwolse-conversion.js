const configEl = document.getElementById("jwcConfig");
const {
  JWC_RULES = {},
  JWC_DEFAULT_INPUT = {},
  JWC_SCENARIO_PRESETS = [],
} = JSON.parse(configEl?.textContent || "{}");

const state = { ...JWC_DEFAULT_INPUT };

const modeTabs = document.querySelectorAll(".jwc-mode-tab");
const presetButtons = document.querySelectorAll(".jwc-preset-btn");

const fields = {
  jeonseDeposit: document.getElementById("jwcJeonseDeposit"),
  wolseDeposit: document.getElementById("jwcWolseDeposit"),
  monthlyRent: document.getElementById("jwcMonthlyRent"),
  baseRate: document.getElementById("jwcBaseRate"),
  customRate: document.getElementById("jwcCustomRate"),
  useLegalCap: document.getElementById("jwcUseLegalCap"),
  loanRate: document.getElementById("jwcLoanRate"),
  opportunityRate: document.getElementById("jwcOpportunityRate"),
  comparisonYears: document.getElementById("jwcComparisonYears"),
  movingCost: document.getElementById("jwcMovingCost"),
  brokerFee: document.getElementById("jwcBrokerFee"),
};

const resultEls = {
  resultSub: document.getElementById("jwcResultSub"),
  actualRate: document.getElementById("jwcActualRateValue"),
  actualRateNote: document.getElementById("jwcActualRateNote"),
  legalCap: document.getElementById("jwcLegalCapValue"),
  legalCapNote: document.getElementById("jwcLegalCapNote"),
  convertedMonthlyRent: document.getElementById("jwcConvertedMonthlyRentValue"),
  convertedJeonse: document.getElementById("jwcConvertedJeonseValue"),
  winnerCard: document.getElementById("jwcWinnerCard"),
  winner: document.getElementById("jwcWinnerValue"),
  winnerNote: document.getElementById("jwcWinnerNote"),
  costDiff: document.getElementById("jwcCostDiffValue"),
  costDiffNote: document.getElementById("jwcCostDiffNote"),
  rateStatusCallout: document.getElementById("jwcRateStatusCallout"),
  rateStatusTitle: document.getElementById("jwcRateStatusTitle"),
  rateStatusText: document.getElementById("jwcRateStatusText"),
  jeonseDeposit: document.getElementById("jwc-r-jeonse-deposit"),
  wolseDeposit: document.getElementById("jwc-r-wolse-deposit"),
  monthlyRent: document.getElementById("jwc-r-monthly-rent"),
  jeonseExtra: document.getElementById("jwc-r-jeonse-extra"),
  wolseExtra: document.getElementById("jwc-r-wolse-extra"),
  jeonseTotal: document.getElementById("jwc-r-jeonse-total"),
  wolseTotal: document.getElementById("jwc-r-wolse-total"),
  jeonseJudge: document.getElementById("jwc-r-jeonse-judge"),
  wolseJudge: document.getElementById("jwc-r-wolse-judge"),
  interpretationRate: document.getElementById("jwcInterpretationRate"),
  interpretationCost: document.getElementById("jwcInterpretationCost"),
  interpretationCashflow: document.getElementById("jwcInterpretationCashflow"),
  interpretationSensitivity: document.getElementById("jwcInterpretationSensitivity"),
  rateModeHint: document.getElementById("jwcRateModeHint"),
};

const resetBtn = document.getElementById("resetJwcBtn");
const copyBtn = document.getElementById("copyJwcLinkBtn");

function clampNumber(value, fallback = 0) {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
}

function toRate(value) {
  return clampNumber(value, 0) / 100;
}

function fmtNumber(value) {
  return Math.round(value).toLocaleString("ko-KR");
}

function fmtWon(value) {
  return `${fmtNumber(value)}원`;
}

function fmtPercent(value) {
  return `${(value * 100).toFixed(2)}%`;
}

function fmtBigWon(value) {
  const rounded = Math.round(value);
  const abs = Math.abs(rounded);
  const sign = rounded < 0 ? "-" : "";
  const eok = Math.floor(abs / 100000000);
  const man = Math.round((abs % 100000000) / 10000);
  if (eok > 0 && man > 0) return `${sign}${eok}억 ${man.toLocaleString("ko-KR")}만원`;
  if (eok > 0) return `${sign}${eok}억원`;
  return `${sign}${Math.round(abs / 10000).toLocaleString("ko-KR")}만원`;
}

function calcLegalCapRate(rules) {
  return Math.min(rules.annualCapRate, rules.baseRate + rules.plusSpreadRate);
}

function calcGapDeposit(jeonseDeposit, wolseDeposit) {
  return jeonseDeposit - wolseDeposit;
}

function calcActualConversionRate(monthlyRent, gapDeposit) {
  if (gapDeposit <= 0) return 0;
  return (monthlyRent * 12) / gapDeposit;
}

function calcMonthlyRentFromDeposit(targetDepositGap, annualRate) {
  if (targetDepositGap <= 0 || annualRate <= 0) return 0;
  return (targetDepositGap * annualRate) / 12;
}

function calcJeonseDepositFromMonthlyRent(wolseDeposit, monthlyRent, annualRate) {
  if (annualRate <= 0) return wolseDeposit;
  return wolseDeposit + (monthlyRent * 12) / annualRate;
}

function calcJeonseTotalCost(input) {
  const years = input.comparisonYears;
  const loanCost = input.jeonseDeposit * input.loanRate * years;
  const opportunityCost = input.jeonseDeposit * input.opportunityRate * years;
  return loanCost + opportunityCost + input.movingCost + input.brokerFee;
}

function calcWolseTotalCost(input) {
  const years = input.comparisonYears;
  const rentCost = input.monthlyRent * 12 * years;
  const opportunityCost = input.wolseDeposit * input.opportunityRate * years;
  return rentCost + opportunityCost + input.movingCost + input.brokerFee;
}

function getRateStatus(actualRate, legalCapRate) {
  if (actualRate > legalCapRate) return "overCap";
  if (actualRate >= legalCapRate * 0.95) return "nearCap";
  return "withinCap";
}

function getCostWinner(jeonseTotal, wolseTotal) {
  const diff = Math.abs(jeonseTotal - wolseTotal);
  if (diff < 500000) return "similar";
  return jeonseTotal < wolseTotal ? "jeonse" : "wolse";
}

function calculate(input) {
  const rules = {
    annualCapRate: JWC_RULES.annualCapRate,
    plusSpreadRate: JWC_RULES.plusSpreadRate,
    baseRate: input.baseRate,
  };

  const legalCapRate = calcLegalCapRate(rules);
  const appliedRate = input.useLegalCap ? legalCapRate : input.customRate;
  const gapDeposit = calcGapDeposit(input.jeonseDeposit, input.wolseDeposit);
  const actualRate = calcActualConversionRate(input.monthlyRent, gapDeposit);
  const convertedMonthlyRent = calcMonthlyRentFromDeposit(gapDeposit, appliedRate);
  const convertedJeonseDeposit = calcJeonseDepositFromMonthlyRent(
    input.wolseDeposit,
    input.monthlyRent,
    appliedRate
  );
  const jeonseTotalCost = calcJeonseTotalCost(input);
  const wolseTotalCost = calcWolseTotalCost(input);
  const rateStatus = getRateStatus(actualRate, legalCapRate);
  const winner = getCostWinner(jeonseTotalCost, wolseTotalCost);
  const isInvalidGap = gapDeposit <= 0;

  return {
    legalCapRate,
    appliedRate,
    gapDeposit,
    actualRate,
    convertedMonthlyRent,
    convertedJeonseDeposit,
    jeonseTotalCost,
    wolseTotalCost,
    totalCostDiff: Math.abs(jeonseTotalCost - wolseTotalCost),
    rateStatus,
    winner,
    isInvalidGap,
    jeonseExtraCost: input.jeonseDeposit * (input.loanRate + input.opportunityRate) * input.comparisonYears,
    wolseExtraCost: input.wolseDeposit * input.opportunityRate * input.comparisonYears,
  };
}

function readForm() {
  state.jeonseDeposit = Math.max(0, clampNumber(fields.jeonseDeposit.value, JWC_DEFAULT_INPUT.jeonseDeposit));
  state.wolseDeposit = Math.max(0, clampNumber(fields.wolseDeposit.value, JWC_DEFAULT_INPUT.wolseDeposit));
  state.monthlyRent = Math.max(0, clampNumber(fields.monthlyRent.value, JWC_DEFAULT_INPUT.monthlyRent));
  state.baseRate = Math.max(0, toRate(fields.baseRate.value));
  state.customRate = Math.max(0, toRate(fields.customRate.value));
  state.useLegalCap = Boolean(fields.useLegalCap.checked);
  state.loanRate = Math.max(0, toRate(fields.loanRate.value));
  state.opportunityRate = Math.max(0, toRate(fields.opportunityRate.value));
  state.comparisonYears = Math.max(1, Math.round(clampNumber(fields.comparisonYears.value, JWC_DEFAULT_INPUT.comparisonYears)));
  state.movingCost = Math.max(0, clampNumber(fields.movingCost.value, JWC_DEFAULT_INPUT.movingCost));
  state.brokerFee = Math.max(0, clampNumber(fields.brokerFee.value, JWC_DEFAULT_INPUT.brokerFee));
}

function updateTabUI() {
  modeTabs.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mode === state.mode);
  });
}

function updateCustomRateState(result) {
  fields.customRate.disabled = state.useLegalCap;
  if (resultEls.rateModeHint) {
    resultEls.rateModeHint.textContent = state.useLegalCap
      ? `법정 상한 자동 적용 중 · 현재 적용값 ${fmtPercent(result.legalCapRate)}`
      : "사용자 입력 전환율 기준으로 환산합니다.";
  }
}

function renderResult(result) {
  const modeLabelMap = {
    jeonseToWolse: "전세 차액을 월세로 환산하는 모드",
    wolseToJeonse: "현재 월세를 전세 보증금으로 환산하는 모드",
    compare: `${state.comparisonYears}년 총비용 기준으로 전세와 월세를 비교하는 모드`,
  };

  resultEls.resultSub.textContent = result.isInvalidGap
    ? "전세 보증금이 월세 보증금보다 작거나 같으면 실제 전환율 계산이 왜곡됩니다."
    : `${modeLabelMap[state.mode]} · 적용 전환율 ${fmtPercent(result.appliedRate)}`;

  resultEls.actualRate.textContent = result.isInvalidGap ? "계산 불가" : fmtPercent(result.actualRate);
  resultEls.actualRateNote.textContent = result.isInvalidGap
    ? "전세 보증금이 더 커야 계산됩니다."
    : "월세 기준 연 환산";
  resultEls.legalCap.textContent = fmtPercent(result.legalCapRate);
  resultEls.legalCapNote.textContent = `기준금리 ${(state.baseRate * 100).toFixed(2)}% + 연 2%`;
  resultEls.convertedMonthlyRent.textContent = fmtWon(result.convertedMonthlyRent);
  resultEls.convertedJeonse.textContent = fmtBigWon(result.convertedJeonseDeposit);

  const winnerTextMap = {
    jeonse: "전세 쪽",
    wolse: "월세 쪽",
    similar: "비슷함",
  };

  resultEls.winner.textContent = winnerTextMap[result.winner];
  resultEls.winnerNote.textContent = `${state.comparisonYears}년 총비용 기준`;
  resultEls.costDiff.textContent = fmtBigWon(result.totalCostDiff);
  resultEls.costDiffNote.textContent = "차이가 작으면 현금흐름도 같이 보세요.";

  resultEls.winnerCard.classList.remove("is-jeonse", "is-wolse", "is-similar");
  resultEls.winnerCard.classList.add(
    result.winner === "jeonse" ? "is-jeonse" : result.winner === "wolse" ? "is-wolse" : "is-similar"
  );

  if (result.rateStatus === "overCap") {
    resultEls.rateStatusCallout.classList.add("is-warning");
    resultEls.rateStatusTitle.textContent = "법정 상한보다 높은 전환율입니다";
    resultEls.rateStatusText.textContent = result.isInvalidGap
      ? "보증금 차이가 0 이하라 실제 전환율 계산이 어렵습니다. 입력 조건을 다시 확인하세요."
      : `현재 계약 기준 실제 전환율 ${fmtPercent(result.actualRate)}는 법정 상한 ${fmtPercent(result.legalCapRate)}보다 높게 계산됩니다. 협상 조건과 적용 범위를 다시 점검하는 편이 안전합니다.`;
  } else if (result.rateStatus === "nearCap") {
    resultEls.rateStatusCallout.classList.remove("is-warning");
    resultEls.rateStatusTitle.textContent = "법정 상한에 근접한 전환율입니다";
    resultEls.rateStatusText.textContent = `실제 전환율 ${fmtPercent(result.actualRate)}가 법정 상한 ${fmtPercent(result.legalCapRate)}에 매우 가깝습니다. 재계약이나 갱신 협상에서는 총비용뿐 아니라 법적 기준도 같이 확인하는 편이 좋습니다.`;
  } else {
    resultEls.rateStatusCallout.classList.remove("is-warning");
    resultEls.rateStatusTitle.textContent = "법정 상한 안에서 계산됩니다";
    resultEls.rateStatusText.textContent = result.isInvalidGap
      ? "보증금 차이가 0 이하라 실제 전환율 계산은 생략했습니다. 환산 결과와 총비용만 참고하세요."
      : `실제 전환율 ${fmtPercent(result.actualRate)}는 법정 상한 ${fmtPercent(result.legalCapRate)} 안에서 계산됩니다. 이제 총비용과 월 현금흐름 중 어떤 기준이 더 중요한지 같이 보시면 됩니다.`;
  }

  resultEls.jeonseDeposit.textContent = fmtBigWon(state.jeonseDeposit);
  resultEls.wolseDeposit.textContent = fmtBigWon(state.wolseDeposit);
  resultEls.monthlyRent.textContent = fmtWon(state.monthlyRent);
  resultEls.jeonseExtra.textContent = fmtBigWon(result.jeonseExtraCost);
  resultEls.wolseExtra.textContent = fmtBigWon(result.wolseExtraCost);
  resultEls.jeonseTotal.textContent = fmtBigWon(result.jeonseTotalCost);
  resultEls.wolseTotal.textContent = fmtBigWon(result.wolseTotalCost);
  resultEls.jeonseJudge.textContent =
    result.winner === "jeonse" ? "총비용 기준 우세" : result.winner === "similar" ? "비슷함" : "총비용 부담 큼";
  resultEls.wolseJudge.textContent =
    result.winner === "wolse" ? "총비용 기준 우세" : result.winner === "similar" ? "비슷함" : "총비용 부담 큼";

  resultEls.interpretationRate.textContent = result.isInvalidGap
    ? "전세 보증금이 월세 보증금보다 커야 실제 전환율을 정상적으로 계산할 수 있습니다."
    : `현재 입력값 기준 실제 전환율은 ${fmtPercent(result.actualRate)}이고, ${state.useLegalCap ? "법정 상한" : "사용자 입력"} 기준 환산 전환율은 ${fmtPercent(result.appliedRate)}입니다.`;
  resultEls.interpretationCost.textContent =
    result.winner === "similar"
      ? `${state.comparisonYears}년 총비용 차이가 ${fmtBigWon(result.totalCostDiff)} 수준이라 큰 차이가 없습니다. 총액보다 현금흐름과 목돈 여력을 더 중요하게 보는 편이 현실적입니다.`
      : `${state.comparisonYears}년 총비용 기준으로는 ${result.winner === "jeonse" ? "전세" : "월세"} 쪽이 ${fmtBigWon(result.totalCostDiff)}만큼 유리하게 계산됩니다.`;
  resultEls.interpretationCashflow.textContent =
    `월세 선택 시 매달 ${fmtWon(state.monthlyRent)}의 현금 유출이 생기고, 전세 선택 시에는 목돈 ${fmtBigWon(state.jeonseDeposit)}이 묶입니다. 총비용과 별개로 현재 현금흐름에 맞는지 같이 보세요.`;
  resultEls.interpretationSensitivity.textContent =
    `기준금리를 0.1%p만 바꿔도 법정 상한과 환산 월세가 달라집니다. 지금 결과는 기준금리 ${(state.baseRate * 100).toFixed(2)}%, 대출금리 ${(state.loanRate * 100).toFixed(2)}%, 기회비용 ${(state.opportunityRate * 100).toFixed(2)}% 가정입니다.`;
}

function syncInputsFromState() {
  fields.jeonseDeposit.value = String(state.jeonseDeposit);
  fields.wolseDeposit.value = String(state.wolseDeposit);
  fields.monthlyRent.value = String(state.monthlyRent);
  fields.baseRate.value = (state.baseRate * 100).toFixed(2);
  fields.customRate.value = (state.customRate * 100).toFixed(2);
  fields.useLegalCap.checked = state.useLegalCap;
  fields.loanRate.value = (state.loanRate * 100).toFixed(2);
  fields.opportunityRate.value = (state.opportunityRate * 100).toFixed(2);
  fields.comparisonYears.value = String(state.comparisonYears);
  fields.movingCost.value = String(state.movingCost);
  fields.brokerFee.value = String(state.brokerFee);
}

function saveParams() {
  const params = new URLSearchParams({
    mode: state.mode,
    jd: String(state.jeonseDeposit),
    wd: String(state.wolseDeposit),
    mr: String(state.monthlyRent),
    ul: state.useLegalCap ? "1" : "0",
    cr: String(state.customRate),
    br: String(state.baseRate),
    lr: String(state.loanRate),
    or: String(state.opportunityRate),
    cy: String(state.comparisonYears),
    mc: String(state.movingCost),
    bf: String(state.brokerFee),
  });
  history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
}

function restoreFromUrl() {
  const params = new URLSearchParams(window.location.search);
  if (!params.size) return;

  state.mode = params.get("mode") || state.mode;
  state.jeonseDeposit = clampNumber(params.get("jd"), state.jeonseDeposit);
  state.wolseDeposit = clampNumber(params.get("wd"), state.wolseDeposit);
  state.monthlyRent = clampNumber(params.get("mr"), state.monthlyRent);
  state.useLegalCap = params.get("ul") !== "0";
  state.customRate = clampNumber(params.get("cr"), state.customRate);
  state.baseRate = clampNumber(params.get("br"), state.baseRate);
  state.loanRate = clampNumber(params.get("lr"), state.loanRate);
  state.opportunityRate = clampNumber(params.get("or"), state.opportunityRate);
  state.comparisonYears = Math.max(1, Math.round(clampNumber(params.get("cy"), state.comparisonYears)));
  state.movingCost = clampNumber(params.get("mc"), state.movingCost);
  state.brokerFee = clampNumber(params.get("bf"), state.brokerFee);
}

function applyPreset(presetId) {
  const preset = JWC_SCENARIO_PRESETS.find((item) => item.id === presetId);
  if (!preset) return;
  Object.assign(state, JWC_DEFAULT_INPUT, preset.values);
  syncInputsFromState();
  presetButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.presetId === presetId);
  });
  recalculate();
}

function recalculate() {
  readForm();
  updateTabUI();
  const result = calculate(state);
  updateCustomRateState(result);
  renderResult(result);
  saveParams();
}

modeTabs.forEach((button) => {
  button.addEventListener("click", () => {
    state.mode = button.dataset.mode;
    recalculate();
  });
});

presetButtons.forEach((button) => {
  button.addEventListener("click", () => applyPreset(button.dataset.presetId));
});

Object.values(fields).forEach((field) => {
  const eventName = field.type === "checkbox" ? "change" : "input";
  field.addEventListener(eventName, recalculate);
  if (eventName !== "change") {
    field.addEventListener("change", recalculate);
  }
});

if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    Object.assign(state, JWC_DEFAULT_INPUT);
    syncInputsFromState();
    presetButtons.forEach((button, index) => {
      button.classList.toggle("is-active", index === 0);
    });
    recalculate();
  });
}

if (copyBtn) {
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      const original = copyBtn.textContent;
      copyBtn.textContent = "복사됨!";
      setTimeout(() => {
        copyBtn.textContent = original;
      }, 1500);
    } catch (_) {}
  });
}

restoreFromUrl();
syncInputsFromState();
updateTabUI();
recalculate();
