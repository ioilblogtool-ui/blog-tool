(function () {
  "use strict";

  const configEl = document.getElementById("mpcConfig");
  if (!configEl) return;

  const config = JSON.parse(configEl.textContent || "{}");
  const loanTypePresets = Array.isArray(config.loanTypePresets) ? config.loanTypePresets : [];
  const scenarioPresets = Array.isArray(config.scenarioPresets) ? config.scenarioPresets : [];

  const state = {
    loanType: "mortgage",
    prepaymentMode: "full",
    remainingPrincipal: 300000000,
    partialAmount: 100000000,
    penaltyRate: 0.014,
    loanTermMonths: 360,
    remainingMonths: 24,
    annualRatePercent: 4.2,
  };

  const els = {
    remainingPrincipal: document.getElementById("mpcRemainingPrincipal"),
    partialAmount: document.getElementById("mpcPartialAmount"),
    partialAmountField: document.getElementById("mpcPartialAmountField"),
    penaltyRate: document.getElementById("mpcPenaltyRate"),
    loanTermMonths: document.getElementById("mpcLoanTermMonths"),
    remainingMonths: document.getElementById("mpcRemainingMonths"),
    annualRate: document.getElementById("mpcAnnualRate"),
    loanNote: document.getElementById("mpcLoanNote"),
    resultSummary: document.getElementById("mpcResultSummary"),
    penaltyAmount: document.getElementById("mpcPenaltyAmount"),
    interestSavings: document.getElementById("mpcInterestSavings"),
    netSavings: document.getElementById("mpcNetSavings"),
    breakEvenMonths: document.getElementById("mpcBreakEvenMonths"),
    verdictBox: document.getElementById("mpcVerdictBox"),
    verdictBadge: document.getElementById("mpcVerdictBadge"),
    verdictCopy: document.getElementById("mpcVerdictCopy"),
    dPrepaymentAmount: document.getElementById("mpcDPrepaymentAmount"),
    dPenaltyRate: document.getElementById("mpcDPenaltyRate"),
    dRemainingRatio: document.getElementById("mpcDRemainingRatio"),
    dPenalty: document.getElementById("mpcDPenalty"),
    dMonthlyInterest: document.getElementById("mpcDMonthlyInterest"),
    dRemainingMonths: document.getElementById("mpcDRemainingMonths"),
    dInterestSavings: document.getElementById("mpcDInterestSavings"),
    dNetSavings: document.getElementById("mpcDNetSavings"),
    resetBtn: document.getElementById("mpcResetBtn"),
    copyBtn: document.getElementById("mpcCopyLinkBtn"),
  };

  function parseWon(value) {
    return Math.max(0, Number(String(value || "").replace(/[^\d.-]/g, "")) || 0);
  }

  function formatInputWon(value) {
    return Math.round(value || 0).toLocaleString("ko-KR");
  }

  function fmtWon(value) {
    const rounded = Math.round(Number(value) || 0);
    return `${rounded.toLocaleString("ko-KR")}원`;
  }

  function fmtBig(value) {
    const rounded = Math.round(Number(value) || 0);
    const sign = rounded < 0 ? "-" : "";
    const abs = Math.abs(rounded);
    const eok = Math.floor(abs / 100000000);
    const man = Math.round((abs % 100000000) / 10000);
    if (eok > 0 && man > 0) return `${sign}${eok}억 ${man.toLocaleString("ko-KR")}만원`;
    if (eok > 0) return `${sign}${eok}억원`;
    if (man > 0) return `${sign}${man.toLocaleString("ko-KR")}만원`;
    return "0원";
  }

  function clampNumber(value, min, max) {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.min(max, Math.max(min, n));
  }

  function getLoanPreset(type) {
    return loanTypePresets.find((preset) => preset.id === type) || loanTypePresets[0];
  }

  function readForm() {
    state.remainingPrincipal = parseWon(els.remainingPrincipal?.value);
    state.partialAmount = parseWon(els.partialAmount?.value);
    state.penaltyRate = clampNumber(Number(els.penaltyRate?.value || 0) / 100, 0, 0.1);
    state.loanTermMonths = clampNumber(Number(els.loanTermMonths?.value || 1), 1, 600);
    state.remainingMonths = clampNumber(Number(els.remainingMonths?.value || 0), 0, 600);
    state.annualRatePercent = clampNumber(Number(els.annualRate?.value || 0), 0, 30);
  }

  function calculate(s) {
    const prepaymentAmount =
      s.prepaymentMode === "full"
        ? s.remainingPrincipal
        : Math.min(s.partialAmount, s.remainingPrincipal);

    const safeRemaining = Math.max(0, s.remainingMonths);
    const safeTerm = Math.max(1, s.loanTermMonths);
    const remainingRatio = Math.min(1, safeRemaining / safeTerm);
    const prepaymentPenalty = prepaymentAmount * s.penaltyRate * remainingRatio;
    const monthlyRate = s.annualRatePercent / 100 / 12;
    const estimatedInterestSavings = prepaymentAmount * monthlyRate * safeRemaining;
    const netSavings = estimatedInterestSavings - prepaymentPenalty;
    const breakEvenMonths =
      monthlyRate > 0 && prepaymentAmount > 0
        ? prepaymentPenalty / (prepaymentAmount * monthlyRate)
        : 0;

    let verdict = "불리";
    let verdictMod = "bad";
    if (safeRemaining <= 0) {
      verdict = "만기 도래";
      verdictMod = "free";
    } else if (s.penaltyRate <= 0 || prepaymentPenalty <= 0) {
      verdict = "수수료 없음";
      verdictMod = "free";
    } else if (netSavings > 0) {
      const ratio = netSavings / Math.max(1, estimatedInterestSavings);
      if (ratio > 0.2) {
        verdict = "유리";
        verdictMod = "good";
      } else {
        verdict = "소폭 유리";
        verdictMod = "neutral";
      }
    }

    const verdictCopy = {
      free:
        safeRemaining <= 0
          ? "잔여 기간이 없거나 만기가 지난 조건입니다. 실제 면제 여부는 약정서와 금융기관에서 확인하세요."
          : "수수료 없이 상환하는 조건으로 계산됩니다. 약정서의 면제 조건을 다시 확인하세요.",
      good: `수수료(${fmtWon(prepaymentPenalty)})보다 이자 절감(${fmtBig(estimatedInterestSavings)})이 커서 단순 계산 기준 중도상환이 유리합니다.`,
      neutral:
        "절감 이자가 수수료보다 소폭 많지만 차이가 크지 않습니다. 비상금과 다른 자금 활용 계획도 함께 보세요.",
      bad: `잔여 기간 기준 이자 절감(${fmtBig(estimatedInterestSavings)})보다 수수료(${fmtWon(prepaymentPenalty)}) 부담이 더 큽니다. 만기 또는 면제 시점까지 유지하는 선택도 검토하세요.`,
    }[verdictMod];

    return {
      prepaymentAmount,
      prepaymentPenalty,
      estimatedInterestSavings,
      netSavings,
      breakEvenMonths,
      remainingRatio,
      monthlyInterest: prepaymentAmount * monthlyRate,
      verdict,
      verdictMod,
      verdictCopy,
    };
  }

  function setText(node, value) {
    if (node) node.textContent = value;
  }

  function updateVerdict(result) {
    if (!els.verdictBox || !els.verdictBadge) return;
    els.verdictBox.classList.remove(
      "mpc-verdict-box--good",
      "mpc-verdict-box--neutral",
      "mpc-verdict-box--bad",
      "mpc-verdict-box--free"
    );
    els.verdictBadge.classList.remove(
      "mpc-verdict-badge--good",
      "mpc-verdict-badge--neutral",
      "mpc-verdict-badge--bad",
      "mpc-verdict-badge--free"
    );
    els.verdictBox.classList.add(`mpc-verdict-box--${result.verdictMod}`);
    els.verdictBadge.classList.add(`mpc-verdict-badge--${result.verdictMod}`);
    setText(els.verdictBadge, result.verdict);
    setText(els.verdictCopy, result.verdictCopy);
  }

  function updateUI(result) {
    setText(els.penaltyAmount, fmtBig(result.prepaymentPenalty));
    setText(els.interestSavings, fmtBig(result.estimatedInterestSavings));
    setText(els.netSavings, `${result.netSavings >= 0 ? "+" : ""}${fmtBig(result.netSavings)}`);
    setText(
      els.breakEvenMonths,
      result.breakEvenMonths > 0 ? `약 ${result.breakEvenMonths.toFixed(1)}개월` : "즉시 또는 해당 없음"
    );
    setText(
      els.resultSummary,
      `${fmtBig(result.prepaymentAmount)} 상환 기준 · ${result.verdict} · 순 절약 ${result.netSavings >= 0 ? "+" : ""}${fmtBig(result.netSavings)}`
    );
    setText(els.dPrepaymentAmount, fmtWon(result.prepaymentAmount));
    setText(els.dPenaltyRate, `${(state.penaltyRate * 100).toFixed(3)}%`);
    setText(els.dRemainingRatio, `${(result.remainingRatio * 100).toFixed(2)}%`);
    setText(els.dPenalty, fmtWon(result.prepaymentPenalty));
    setText(els.dMonthlyInterest, fmtWon(result.monthlyInterest));
    setText(els.dRemainingMonths, `${state.remainingMonths.toLocaleString("ko-KR")}개월`);
    setText(els.dInterestSavings, fmtWon(result.estimatedInterestSavings));
    setText(els.dNetSavings, `${result.netSavings >= 0 ? "+" : ""}${fmtWon(result.netSavings)}`);
    updateVerdict(result);
  }

  function syncActiveButtons() {
    document.querySelectorAll("[data-loan-type]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.loanType === state.loanType);
    });
    document.querySelectorAll("[data-mode]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.mode === state.prepaymentMode);
    });
    document.querySelectorAll("[data-preset-id]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.presetId === state.activePresetId);
    });
  }

  function syncInputs() {
    if (els.remainingPrincipal) els.remainingPrincipal.value = formatInputWon(state.remainingPrincipal);
    if (els.partialAmount) els.partialAmount.value = formatInputWon(Math.min(state.partialAmount, state.remainingPrincipal));
    if (els.penaltyRate) els.penaltyRate.value = (state.penaltyRate * 100).toFixed(3);
    if (els.loanTermMonths) els.loanTermMonths.value = String(Math.round(state.loanTermMonths));
    if (els.remainingMonths) els.remainingMonths.value = String(Math.round(state.remainingMonths));
    if (els.annualRate) els.annualRate.value = Number(state.annualRatePercent).toFixed(3);
    if (els.partialAmountField) els.partialAmountField.hidden = state.prepaymentMode !== "partial";
    const preset = getLoanPreset(state.loanType);
    if (els.loanNote && preset) els.loanNote.textContent = preset.note;
  }

  function syncUrlParams() {
    const params = new URLSearchParams({
      lt: state.loanType,
      pm: state.prepaymentMode,
      rp: String(Math.round(state.remainingPrincipal)),
      pa: String(Math.round(state.partialAmount)),
      pr: (state.penaltyRate * 100).toFixed(3),
      tm: String(Math.round(state.loanTermMonths)),
      rm: String(Math.round(state.remainingMonths)),
      ar: Number(state.annualRatePercent).toFixed(3),
    });
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  }

  function render() {
    readForm();
    if (state.partialAmount > state.remainingPrincipal) state.partialAmount = state.remainingPrincipal;
    syncInputs();
    syncActiveButtons();
    updateUI(calculate(state));
    syncUrlParams();
  }

  function onLoanTypeChange(type) {
    const preset = getLoanPreset(type);
    if (!preset) return;
    state.loanType = preset.id;
    state.penaltyRate = preset.defaultPenaltyRate;
    state.loanTermMonths = preset.defaultLoanTermMonths;
    state.annualRatePercent = preset.defaultRatePercent;
    state.activePresetId = "";
    syncInputs();
    render();
  }

  function onModeChange(mode) {
    state.prepaymentMode = mode === "partial" ? "partial" : "full";
    state.activePresetId = "";
    syncInputs();
    render();
  }

  function applyPreset(presetId) {
    const preset = scenarioPresets.find((item) => item.id === presetId);
    if (!preset) return;
    const values = preset.values;
    state.loanType = values.loanType;
    state.remainingPrincipal = values.remainingPrincipal;
    state.penaltyRate = values.penaltyRate;
    state.loanTermMonths = values.loanTermMonths;
    state.remainingMonths = values.remainingMonths;
    state.annualRatePercent = values.annualRatePercent;
    if (values.prepaymentAmount === "full") {
      state.prepaymentMode = "full";
      state.partialAmount = Math.min(state.partialAmount, state.remainingPrincipal);
    } else {
      state.prepaymentMode = "partial";
      state.partialAmount = values.prepaymentAmount;
    }
    state.activePresetId = presetId;
    syncInputs();
    render();
  }

  function resetAll() {
    const defaults = config.defaultInput || {};
    state.loanType = defaults.loanType || "mortgage";
    state.prepaymentMode = defaults.prepaymentMode || "full";
    state.remainingPrincipal = defaults.remainingPrincipal || 300000000;
    state.partialAmount = defaults.partialAmount || 100000000;
    state.penaltyRate = defaults.penaltyRate || 0.014;
    state.loanTermMonths = defaults.loanTermMonths || 360;
    state.remainingMonths = defaults.remainingMonths || 24;
    state.annualRatePercent = defaults.annualRatePercent || 4.2;
    state.activePresetId = "";
    syncInputs();
    render();
  }

  function loadFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const loanTypes = loanTypePresets.map((preset) => preset.id);
    if (loanTypes.includes(params.get("lt"))) state.loanType = params.get("lt");
    if (["full", "partial"].includes(params.get("pm"))) state.prepaymentMode = params.get("pm");
    if (params.has("rp")) state.remainingPrincipal = parseWon(params.get("rp"));
    if (params.has("pa")) state.partialAmount = parseWon(params.get("pa"));
    if (params.has("pr")) state.penaltyRate = clampNumber(Number(params.get("pr")) / 100, 0, 0.1);
    if (params.has("tm")) state.loanTermMonths = clampNumber(Number(params.get("tm")), 1, 600);
    if (params.has("rm")) state.remainingMonths = clampNumber(Number(params.get("rm")), 0, 600);
    if (params.has("ar")) state.annualRatePercent = clampNumber(Number(params.get("ar")), 0, 30);
  }

  function bindMoneyInput(input) {
    if (!input) return;
    input.addEventListener("focus", () => {
      input.value = String(parseWon(input.value) || "");
    });
    input.addEventListener("blur", () => {
      input.value = formatInputWon(parseWon(input.value));
      render();
    });
    input.addEventListener("input", () => {
      state.activePresetId = "";
      render();
    });
  }

  document.querySelectorAll("[data-loan-type]").forEach((button) => {
    button.addEventListener("click", () => onLoanTypeChange(button.dataset.loanType));
  });
  document.querySelectorAll("[data-mode]").forEach((button) => {
    button.addEventListener("click", () => onModeChange(button.dataset.mode));
  });
  document.querySelectorAll("[data-preset-id]").forEach((button) => {
    button.addEventListener("click", () => applyPreset(button.dataset.presetId));
  });

  bindMoneyInput(els.remainingPrincipal);
  bindMoneyInput(els.partialAmount);
  [els.penaltyRate, els.loanTermMonths, els.remainingMonths, els.annualRate].forEach((input) => {
    if (!input) return;
    input.addEventListener("input", () => {
      state.activePresetId = "";
      render();
    });
  });

  if (els.resetBtn) els.resetBtn.addEventListener("click", resetAll);
  if (els.copyBtn) {
    els.copyBtn.addEventListener("click", () => {
      syncUrlParams();
      navigator.clipboard?.writeText(window.location.href).then(() => {
        const original = els.copyBtn.textContent;
        els.copyBtn.textContent = "복사됨";
        setTimeout(() => {
          els.copyBtn.textContent = original;
        }, 1400);
      });
    });
  }

  loadFromUrl();
  syncInputs();
  render();
})();
