(function () {
  "use strict";

  const configEl = document.getElementById("lrcConfig");
  if (!configEl) return;

  const config = JSON.parse(configEl.textContent || "{}");
  const loanTypePresets = Array.isArray(config.loanTypePresets) ? config.loanTypePresets : [];
  const presets = Array.isArray(config.presets) ? config.presets : [];

  const state = {
    loanType: "mortgage",
    currentBalance: 300000000,
    currentAnnualRate: 0.048,
    remainingMonths: 240,
    currentRepaymentType: "annuity",
    currentRateType: "variable",
    newAnnualRate: 0.041,
    newTermMonths: 240,
    newRepaymentType: "annuity",
    newRateType: "fixed",
    prepaymentPenaltyRate: 0.012,
    penaltyRemainingMonths: 12,
    penaltyTotalMonths: 36,
    penaltyExemptAmount: 0,
    newLoanCosts: 0,
    rateScenarioDelta: 0.005,
    activePresetId: "",
  };

  const els = {
    currentBalance: document.getElementById("lrcCurrentBalance"),
    currentRate: document.getElementById("lrcCurrentRate"),
    remainingMonths: document.getElementById("lrcRemainingMonths"),
    currentRepayment: document.getElementById("lrcCurrentRepayment"),
    currentRateType: document.getElementById("lrcCurrentRateType"),
    newRate: document.getElementById("lrcNewRate"),
    newTermMonths: document.getElementById("lrcNewTermMonths"),
    newRepayment: document.getElementById("lrcNewRepayment"),
    newRateType: document.getElementById("lrcNewRateType"),
    penaltyRate: document.getElementById("lrcPenaltyRate"),
    penaltyRemainingMonths: document.getElementById("lrcPenaltyRemainingMonths"),
    penaltyTotalMonths: document.getElementById("lrcPenaltyTotalMonths"),
    penaltyExemptAmount: document.getElementById("lrcPenaltyExemptAmount"),
    newLoanCosts: document.getElementById("lrcNewLoanCosts"),
    scenarioDelta: document.getElementById("lrcScenarioDelta"),
    loanNote: document.getElementById("lrcLoanNote"),
    matchTermBtn: document.getElementById("lrcMatchTermBtn"),
    resultSummary: document.getElementById("lrcResultSummary"),
    monthlySaving: document.getElementById("lrcMonthlySaving"),
    interestSaving: document.getElementById("lrcInterestSaving"),
    netSaving: document.getElementById("lrcNetSaving"),
    breakEvenMonths: document.getElementById("lrcBreakEvenMonths"),
    decisionBox: document.getElementById("lrcDecisionBox"),
    decisionBadge: document.getElementById("lrcDecisionBadge"),
    decisionMessage: document.getElementById("lrcDecisionMessage"),
    warningList: document.getElementById("lrcWarningList"),
    breakdownBody: document.getElementById("lrcBreakdownBody"),
    timeline: document.getElementById("lrcTimeline"),
    scenarioBody: document.getElementById("lrcScenarioBody"),
    resetBtn: document.getElementById("lrcResetBtn"),
    copyBtn: document.getElementById("lrcCopyLinkBtn"),
  };

  function parseWon(value) {
    return Math.max(0, Number(String(value || "").replace(/[^\d.-]/g, "")) || 0);
  }

  function fmtInputWon(value) {
    return Math.round(value || 0).toLocaleString("ko-KR");
  }

  function fmtWon(value) {
    return `${Math.round(Number(value) || 0).toLocaleString("ko-KR")}원`;
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

  function fmtSignedBig(value) {
    const n = Number(value) || 0;
    return `${n > 0 ? "+" : n < 0 ? "-" : ""}${fmtBig(Math.abs(n))}`;
  }

  function fmtRate(rate) {
    return `${(rate * 100).toFixed(2)}%`;
  }

  function clamp(value, min, max) {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.min(max, Math.max(min, n));
  }

  function setText(node, value) {
    if (node) node.textContent = value;
  }

  function getLoanPreset(type) {
    return loanTypePresets.find((preset) => preset.id === type) || loanTypePresets[0];
  }

  function calculateMonthlyPayment(principal, annualRate, months, repaymentType) {
    const monthlyRate = annualRate / 12;
    if (months <= 0 || principal <= 0) return 0;
    if (repaymentType === "bullet") return principal * monthlyRate;
    if (repaymentType === "annuity") {
      if (monthlyRate === 0) return principal / months;
      const factor = Math.pow(1 + monthlyRate, months);
      return (principal * monthlyRate * factor) / (factor - 1);
    }
    return principal / months + principal * monthlyRate;
  }

  function calculateTotalInterest(principal, annualRate, months, repaymentType) {
    const monthlyRate = annualRate / 12;
    if (months <= 0 || principal <= 0) return 0;
    if (repaymentType === "bullet") return principal * monthlyRate * months;
    if (repaymentType === "annuity") {
      return calculateMonthlyPayment(principal, annualRate, months, repaymentType) * months - principal;
    }
    let remaining = principal;
    const monthlyPrincipal = principal / months;
    let totalInterest = 0;
    for (let month = 0; month < months; month += 1) {
      totalInterest += remaining * monthlyRate;
      remaining = Math.max(remaining - monthlyPrincipal, 0);
    }
    return totalInterest;
  }

  function getDecision(netSaving, breakEvenMonths) {
    if (netSaving <= 0 || breakEvenMonths === null) {
      return {
        label: "불리",
        tone: "danger",
        message: "수수료와 부대비용을 반영하면 현재 조건 유지가 나을 수 있습니다.",
      };
    }
    if (breakEvenMonths <= 12) {
      return {
        label: "지금 유리",
        tone: "positive",
        message: "갈아타기 비용을 1년 안에 회수할 수 있는 구간입니다.",
      };
    }
    if (breakEvenMonths <= 36) {
      return {
        label: "조건부 유리",
        tone: "neutral",
        message: "장기 유지할 계획이라면 갈아타기를 검토할 수 있습니다.",
      };
    }
    return {
      label: "보류",
      tone: "caution",
      message: "회수 기간이 길어 이사·상환 계획과 금리 변동을 먼저 확인해야 합니다.",
    };
  }

  function calculatePenalty(s) {
    const penaltyBase = Math.max(s.currentBalance - s.penaltyExemptAmount, 0);
    const ratio = s.penaltyTotalMonths > 0
      ? Math.min(Math.max(s.penaltyRemainingMonths, 0) / s.penaltyTotalMonths, 1)
      : 0;
    return penaltyBase * s.prepaymentPenaltyRate * ratio;
  }

  function calculateWithRate(s, newAnnualRate, switchingCost) {
    const currentInterest = calculateTotalInterest(
      s.currentBalance,
      s.currentAnnualRate,
      s.remainingMonths,
      s.currentRepaymentType
    );
    const newMonthly = calculateMonthlyPayment(
      s.currentBalance,
      newAnnualRate,
      s.newTermMonths,
      s.newRepaymentType
    );
    const newInterest = calculateTotalInterest(
      s.currentBalance,
      newAnnualRate,
      s.newTermMonths,
      s.newRepaymentType
    );
    const netSaving = currentInterest - newInterest - switchingCost;
    return { newMonthly, newInterest, netSaving };
  }

  function getWarnings(s, result) {
    const warnings = [];
    if (s.newTermMonths > s.remainingMonths) {
      warnings.push("신규 대출 기간이 더 길어 월 납입금은 줄어도 총이자가 늘 수 있습니다.");
    }
    if (s.newRateType === "variable") {
      warnings.push("신규 대출이 변동금리라면 금리 상승 시 월 납입금과 총이자가 달라질 수 있습니다.");
    }
    if (result.monthlySaving <= 0) {
      warnings.push("월 납입금 절감액이 없어서 수수료 회수 기간을 계산하기 어렵습니다.");
    }
    if (s.penaltyRemainingMonths <= 3 && result.prepaymentPenalty > 0) {
      warnings.push("수수료 면제 시점이 가까울 수 있습니다. 대환 실행일을 늦추는 선택도 비교해보세요.");
    }
    return warnings;
  }

  function calculate(s) {
    const currentMonthly = calculateMonthlyPayment(
      s.currentBalance,
      s.currentAnnualRate,
      s.remainingMonths,
      s.currentRepaymentType
    );
    const currentInterest = calculateTotalInterest(
      s.currentBalance,
      s.currentAnnualRate,
      s.remainingMonths,
      s.currentRepaymentType
    );
    const newMonthly = calculateMonthlyPayment(
      s.currentBalance,
      s.newAnnualRate,
      s.newTermMonths,
      s.newRepaymentType
    );
    const newInterest = calculateTotalInterest(
      s.currentBalance,
      s.newAnnualRate,
      s.newTermMonths,
      s.newRepaymentType
    );
    const prepaymentPenalty = calculatePenalty(s);
    const totalSwitchingCost = prepaymentPenalty + s.newLoanCosts;
    const monthlySaving = currentMonthly - newMonthly;
    const totalInterestSaving = currentInterest - newInterest;
    const netSaving = totalInterestSaving - totalSwitchingCost;
    const breakEvenMonths = monthlySaving > 0
      ? Math.ceil(totalSwitchingCost / monthlySaving)
      : null;
    const decision = getDecision(netSaving, breakEvenMonths);
    const scenarioSpecs = [
      { id: "base", label: "기준", rate: s.newAnnualRate },
      { id: "rateDown", label: "금리 하락", rate: Math.max(s.newAnnualRate - s.rateScenarioDelta, 0) },
      { id: "rateUp", label: "금리 상승", rate: s.newAnnualRate + s.rateScenarioDelta },
    ];
    const scenarioResults = scenarioSpecs.map((scenario) => ({
      ...scenario,
      ...calculateWithRate(s, scenario.rate, totalSwitchingCost),
    }));
    const result = {
      currentMonthly,
      currentInterest,
      newMonthly,
      newInterest,
      monthlySaving,
      totalInterestSaving,
      prepaymentPenalty,
      totalSwitchingCost,
      netSaving,
      breakEvenMonths,
      decision,
      scenarioResults,
    };
    result.warnings = getWarnings(s, result);
    return result;
  }

  function readForm() {
    state.currentBalance = parseWon(els.currentBalance?.value);
    state.currentAnnualRate = clamp(Number(els.currentRate?.value || 0) / 100, 0, 0.3);
    state.remainingMonths = clamp(Number(els.remainingMonths?.value || 1), 1, 600);
    state.currentRepaymentType = els.currentRepayment?.value || "annuity";
    state.currentRateType = els.currentRateType?.value || "variable";
    state.newAnnualRate = clamp(Number(els.newRate?.value || 0) / 100, 0, 0.3);
    state.newTermMonths = clamp(Number(els.newTermMonths?.value || 1), 1, 600);
    state.newRepaymentType = els.newRepayment?.value || "annuity";
    state.newRateType = els.newRateType?.value || "fixed";
    state.prepaymentPenaltyRate = clamp(Number(els.penaltyRate?.value || 0) / 100, 0, 0.1);
    state.penaltyRemainingMonths = clamp(Number(els.penaltyRemainingMonths?.value || 0), 0, 120);
    state.penaltyTotalMonths = clamp(Number(els.penaltyTotalMonths?.value || 1), 1, 120);
    state.penaltyExemptAmount = parseWon(els.penaltyExemptAmount?.value);
    state.newLoanCosts = parseWon(els.newLoanCosts?.value);
    state.rateScenarioDelta = clamp(Number(els.scenarioDelta?.value || 0) / 100, 0, 0.05);
  }

  function syncInputs() {
    if (els.currentBalance) els.currentBalance.value = fmtInputWon(state.currentBalance);
    if (els.currentRate) els.currentRate.value = (state.currentAnnualRate * 100).toFixed(3);
    if (els.remainingMonths) els.remainingMonths.value = String(Math.round(state.remainingMonths));
    if (els.currentRepayment) els.currentRepayment.value = state.currentRepaymentType;
    if (els.currentRateType) els.currentRateType.value = state.currentRateType;
    if (els.newRate) els.newRate.value = (state.newAnnualRate * 100).toFixed(3);
    if (els.newTermMonths) els.newTermMonths.value = String(Math.round(state.newTermMonths));
    if (els.newRepayment) els.newRepayment.value = state.newRepaymentType;
    if (els.newRateType) els.newRateType.value = state.newRateType;
    if (els.penaltyRate) els.penaltyRate.value = (state.prepaymentPenaltyRate * 100).toFixed(3);
    if (els.penaltyRemainingMonths) els.penaltyRemainingMonths.value = String(Math.round(state.penaltyRemainingMonths));
    if (els.penaltyTotalMonths) els.penaltyTotalMonths.value = String(Math.round(state.penaltyTotalMonths));
    if (els.penaltyExemptAmount) els.penaltyExemptAmount.value = fmtInputWon(state.penaltyExemptAmount);
    if (els.newLoanCosts) els.newLoanCosts.value = fmtInputWon(state.newLoanCosts);
    if (els.scenarioDelta) els.scenarioDelta.value = (state.rateScenarioDelta * 100).toFixed(1);
    const preset = getLoanPreset(state.loanType);
    if (els.loanNote && preset) els.loanNote.textContent = preset.note;
  }

  function syncActiveButtons() {
    document.querySelectorAll("[data-loan-type]").forEach((button) => {
      const isActive = button.dataset.loanType === state.loanType;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
    document.querySelectorAll("[data-preset-id]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.presetId === state.activePresetId);
    });
  }

  function updateDecision(decision) {
    if (!els.decisionBox || !els.decisionBadge) return;
    ["positive", "neutral", "caution", "danger"].forEach((tone) => {
      els.decisionBox.classList.remove(`lrc-decision-box--${tone}`);
      els.decisionBadge.classList.remove(`lrc-decision-badge--${tone}`);
    });
    els.decisionBox.classList.add(`lrc-decision-box--${decision.tone}`);
    els.decisionBadge.classList.add(`lrc-decision-badge--${decision.tone}`);
    setText(els.decisionBadge, decision.label);
    setText(els.decisionMessage, decision.message);
  }

  function renderBreakdown(result) {
    if (!els.breakdownBody) return;
    const rows = [
      ["월 납입금", fmtWon(result.currentMonthly), fmtWon(result.newMonthly), fmtSignedBig(result.monthlySaving)],
      ["잔여 총이자", fmtBig(result.currentInterest), fmtBig(result.newInterest), fmtSignedBig(result.totalInterestSaving)],
      ["중도상환수수료", "-", fmtWon(result.prepaymentPenalty), "비용"],
      ["신규 부대비용", "-", fmtWon(state.newLoanCosts), "비용"],
      ["순절감액", "-", "-", fmtSignedBig(result.netSaving)],
    ];
    els.breakdownBody.innerHTML = rows
      .map((row) => `<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td><td>${row[3]}</td></tr>`)
      .join("");
  }

  function renderTimeline(result) {
    if (!els.timeline) return;
    if (result.breakEvenMonths === null) {
      els.timeline.innerHTML = '<p class="lrc-empty">월 납입금 절감액이 없어 회수 기간을 계산할 수 없습니다.</p>';
      return;
    }
    const half = Math.max(1, Math.ceil(result.breakEvenMonths / 2));
    els.timeline.innerHTML = `
      <div class="lrc-timeline-step"><strong>0개월</strong><span>갈아타기 비용 ${fmtBig(result.totalSwitchingCost)} 발생</span></div>
      <div class="lrc-timeline-step"><strong>${half}개월</strong><span>비용의 약 절반 회수</span></div>
      <div class="lrc-timeline-step is-active"><strong>${result.breakEvenMonths}개월</strong><span>손익분기 도달</span></div>
      <div class="lrc-timeline-step"><strong>이후</strong><span>월 ${fmtBig(Math.max(result.monthlySaving, 0))} 절감액 누적</span></div>
    `;
  }

  function renderScenarios(result) {
    if (!els.scenarioBody) return;
    els.scenarioBody.innerHTML = result.scenarioResults
      .map((item) => `
        <tr>
          <td>${item.label}</td>
          <td>${fmtRate(item.rate)}</td>
          <td>${fmtWon(item.newMonthly)}</td>
          <td>${fmtBig(item.newInterest)}</td>
          <td>${fmtSignedBig(item.netSaving)}</td>
        </tr>
      `)
      .join("");
  }

  function renderWarnings(warnings) {
    if (!els.warningList) return;
    els.warningList.innerHTML = warnings.map((warning) => `<li>${warning}</li>`).join("");
    els.warningList.hidden = warnings.length === 0;
  }

  function syncUrlParams() {
    const params = new URLSearchParams({
      type: state.loanType,
      balance: String(Math.round(state.currentBalance)),
      cr: state.currentAnnualRate.toFixed(5),
      nr: state.newAnnualRate.toFixed(5),
      months: String(Math.round(state.remainingMonths)),
      newMonths: String(Math.round(state.newTermMonths)),
      repay: state.currentRepaymentType,
      newRepay: state.newRepaymentType,
      penalty: state.prepaymentPenaltyRate.toFixed(5),
      costs: String(Math.round(state.newLoanCosts)),
    });
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  }

  function render() {
    readForm();
    syncInputs();
    syncActiveButtons();
    const result = calculate(state);
    setText(els.monthlySaving, fmtSignedBig(result.monthlySaving));
    setText(els.interestSaving, fmtSignedBig(result.totalInterestSaving));
    setText(els.netSaving, fmtSignedBig(result.netSaving));
    setText(els.breakEvenMonths, result.breakEvenMonths === null ? "계산 불가" : `약 ${result.breakEvenMonths}개월`);
    setText(
      els.resultSummary,
      `월 ${fmtSignedBig(result.monthlySaving)} · 순절감 ${fmtSignedBig(result.netSaving)} · ${result.decision.label}`
    );
    updateDecision(result.decision);
    renderBreakdown(result);
    renderTimeline(result);
    renderScenarios(result);
    renderWarnings(result.warnings);
    syncUrlParams();
  }

  function applyLoanTypePreset(type) {
    const preset = getLoanPreset(type);
    if (!preset) return;
    state.loanType = preset.id;
    state.currentBalance = preset.defaultBalance;
    state.currentAnnualRate = preset.defaultCurrentRate;
    state.newAnnualRate = preset.defaultNewRate;
    state.remainingMonths = preset.defaultRemainingMonths;
    state.newTermMonths = preset.defaultRemainingMonths;
    state.currentRepaymentType = preset.defaultRepaymentType;
    state.newRepaymentType = preset.defaultRepaymentType;
    state.prepaymentPenaltyRate = preset.defaultPenaltyRate;
    state.penaltyTotalMonths = preset.defaultPenaltyTotalMonths;
    state.penaltyRemainingMonths = Math.min(12, preset.defaultPenaltyTotalMonths);
    state.activePresetId = "";
    syncInputs();
    render();
  }

  function applyPreset(id) {
    const preset = presets.find((item) => item.id === id);
    if (!preset) return;
    Object.assign(state, preset.input);
    state.activePresetId = id;
    syncInputs();
    render();
  }

  function resetAll() {
    Object.assign(state, config.defaultInput || {});
    state.activePresetId = "";
    syncInputs();
    render();
  }

  function loadFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const loanTypes = loanTypePresets.map((preset) => preset.id);
    if (loanTypes.includes(params.get("type"))) state.loanType = params.get("type");
    if (params.has("balance")) state.currentBalance = parseWon(params.get("balance"));
    if (params.has("cr")) state.currentAnnualRate = clamp(Number(params.get("cr")), 0, 0.3);
    if (params.has("nr")) state.newAnnualRate = clamp(Number(params.get("nr")), 0, 0.3);
    if (params.has("months")) state.remainingMonths = clamp(Number(params.get("months")), 1, 600);
    if (params.has("newMonths")) state.newTermMonths = clamp(Number(params.get("newMonths")), 1, 600);
    if (["annuity", "equalPrincipal", "bullet"].includes(params.get("repay"))) {
      state.currentRepaymentType = params.get("repay");
    }
    if (["annuity", "equalPrincipal", "bullet"].includes(params.get("newRepay"))) {
      state.newRepaymentType = params.get("newRepay");
    }
    if (params.has("penalty")) state.prepaymentPenaltyRate = clamp(Number(params.get("penalty")), 0, 0.1);
    if (params.has("costs")) state.newLoanCosts = parseWon(params.get("costs"));
  }

  function bindMoneyInput(input) {
    if (!input) return;
    input.addEventListener("focus", () => {
      input.value = String(parseWon(input.value) || "");
    });
    input.addEventListener("blur", () => {
      input.value = fmtInputWon(parseWon(input.value));
      render();
    });
    input.addEventListener("input", () => {
      state.activePresetId = "";
      render();
    });
  }

  document.querySelectorAll("[data-loan-type]").forEach((button) => {
    button.addEventListener("click", () => applyLoanTypePreset(button.dataset.loanType));
  });
  document.querySelectorAll("[data-preset-id]").forEach((button) => {
    button.addEventListener("click", () => applyPreset(button.dataset.presetId));
  });

  bindMoneyInput(els.currentBalance);
  bindMoneyInput(els.penaltyExemptAmount);
  bindMoneyInput(els.newLoanCosts);

  [
    els.currentRate,
    els.remainingMonths,
    els.currentRepayment,
    els.currentRateType,
    els.newRate,
    els.newTermMonths,
    els.newRepayment,
    els.newRateType,
    els.penaltyRate,
    els.penaltyRemainingMonths,
    els.penaltyTotalMonths,
    els.scenarioDelta,
  ].forEach((input) => {
    if (!input) return;
    input.addEventListener("input", () => {
      state.activePresetId = "";
      render();
    });
    input.addEventListener("change", () => {
      state.activePresetId = "";
      render();
    });
  });

  if (els.matchTermBtn) {
    els.matchTermBtn.addEventListener("click", () => {
      state.newTermMonths = state.remainingMonths;
      syncInputs();
      render();
    });
  }
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

  Object.assign(state, config.defaultInput || {});
  loadFromUrl();
  syncInputs();
  render();
})();
