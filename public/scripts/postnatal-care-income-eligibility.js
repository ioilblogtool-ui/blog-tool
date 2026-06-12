const configEl = document.getElementById("pnceiConfig");
const {
  PNCEI_DEFAULT_INPUT: DEFAULTS,
  PNCEI_THRESHOLDS_2026: THRESHOLDS,
  PNCEI_EXCEPTION_REASONS: EXCEPTIONS,
} = JSON.parse(configEl?.textContent || "{}");

const fields = {
  region: document.getElementById("pnceiRegion"),
  householdSize: document.getElementById("pnceiHouseholdSize"),
  birthType: document.getElementById("pnceiBirthType"),
  childOrder: document.getElementById("pnceiChildOrder"),
  judgeMode: document.querySelectorAll('input[name="pnceiJudgeMode"]'),
  insuranceType: document.getElementById("pnceiInsuranceType"),
  motherPremium: document.getElementById("pnceiMotherPremium"),
  spousePremium: document.getElementById("pnceiSpousePremium"),
  monthlyIncome: document.getElementById("pnceiMonthlyIncome"),
  dualIncome: document.getElementById("pnceiDualIncome"),
  exceptions: document.querySelectorAll('input[name="pnceiExceptions"]'),
};

const resultEls = {
  subcopy: document.getElementById("pnceiResultSubcopy"),
  statusCard: document.getElementById("pnceiStatusCard"),
  statusLabel: document.getElementById("pnceiStatusLabel"),
  statusNote: document.getElementById("pnceiStatusNote"),
  premiumLimit: document.getElementById("pnceiPremiumLimit"),
  premiumLimitNote: document.getElementById("pnceiPremiumLimitNote"),
  premiumTotal: document.getElementById("pnceiPremiumTotal"),
  premiumTotalNote: document.getElementById("pnceiPremiumTotalNote"),
  difference: document.getElementById("pnceiDifference"),
  differenceNote: document.getElementById("pnceiDifferenceNote"),
  sourceBadge: document.getElementById("pnceiSourceBadge"),
  sourceText: document.getElementById("pnceiSourceText"),
  interpretation: document.getElementById("pnceiInterpretation"),
  warningList: document.getElementById("pnceiWarningList"),
  exceptionMessages: document.getElementById("pnceiExceptionMessages"),
  costCta: document.getElementById("pnceiCostCta"),
};

const resetBtn = document.getElementById("resetPnceiBtn");
const copyBtn = document.getElementById("copyPnceiLinkBtn");

function parseWon(raw) {
  return Math.max(0, parseInt(String(raw || "").replace(/[^\d]/g, ""), 10) || 0);
}

function fmtWon(n) {
  if (!Number.isFinite(n)) return "-";
  return Math.round(n).toLocaleString("ko-KR") + "원";
}

function fmtGap(n) {
  if (!Number.isFinite(n)) return "-";
  const abs = Math.abs(Math.round(n));
  return `${n >= 0 ? "+" : "-"}${abs.toLocaleString("ko-KR")}원`;
}

function setText(el, text) {
  if (el) el.textContent = text;
}

function activeJudgeMode() {
  const active = Array.from(fields.judgeMode || []).find((item) => item.checked);
  return active?.value || DEFAULTS.judgeMode;
}

function checkedExceptionKeys() {
  return Array.from(fields.exceptions || [])
    .filter((item) => item.checked)
    .map((item) => item.value);
}

function readState() {
  return {
    region: fields.region?.value || DEFAULTS.region,
    householdSize: parseInt(fields.householdSize?.value || DEFAULTS.householdSize, 10),
    birthType: fields.birthType?.value || DEFAULTS.birthType,
    childOrder: fields.childOrder?.value || DEFAULTS.childOrder,
    judgeMode: activeJudgeMode(),
    insuranceType: fields.insuranceType?.value || DEFAULTS.insuranceType,
    motherPremium: parseWon(fields.motherPremium?.value),
    spousePremium: parseWon(fields.spousePremium?.value),
    monthlyIncome: parseWon(fields.monthlyIncome?.value),
    dualIncome: fields.dualIncome?.value !== "no",
    exceptionReasonKeys: checkedExceptionKeys(),
  };
}

function findThreshold(state) {
  return THRESHOLDS.find((item) => item.householdSize === state.householdSize) || null;
}

function getPremiumLimit(threshold, insuranceType) {
  if (!threshold) return 0;
  if (insuranceType === "local") return threshold.localPremiumLimit;
  if (insuranceType === "mixed") return threshold.mixedPremiumLimit || threshold.employeePremiumLimit;
  return threshold.employeePremiumLimit;
}

function getEffectivePremiumTotal(state) {
  const mother = state.motherPremium;
  const spouse = state.spousePremium;

  if (!state.dualIncome || mother === 0 || spouse === 0) {
    return mother + spouse;
  }

  const higher = Math.max(mother, spouse);
  const lower = Math.min(mother, spouse);
  return Math.round(higher + lower * 0.5);
}

function hasExceptionSignal(state) {
  return (
    state.exceptionReasonKeys.length > 0 ||
    state.birthType !== "single" ||
    state.childOrder !== "first"
  );
}

function getStatus(ratio, state) {
  const hasException = hasExceptionSignal(state);
  if (ratio > 1.05 && hasException) return "exception_check";
  if (ratio > 1.05) return "over";
  if (ratio >= 0.95) return "borderline";
  return "likely";
}

function getStatusLabel(status) {
  return {
    likely: "150% 이하 가능성 높음",
    borderline: "경계 구간",
    over: "150% 초과 가능성",
    exception_check: "예외지원 확인 필요",
  }[status] || "확인 필요";
}

function getIncomeTypeSuggestion(status) {
  if (status === "likely") return "tonghap";
  if (status === "over" || status === "exception_check") return "ra";
  return "unknown";
}

function buildWarnings(state, threshold, compareBase) {
  const warnings = [];
  if (!threshold) warnings.push("선택한 가구원 수의 기준표를 찾지 못했습니다.");
  if (state.insuranceType === "mixed" && state.dualIncome) {
    warnings.push("맞벌이 50% 합산 안내는 직장-직장 또는 지역-지역 기준으로 안내되므로 혼합 세대는 보건소 확인이 필요합니다.");
  }
  if (state.judgeMode === "income") {
    warnings.push("월소득 판정은 보조 계산입니다. 실제 신청은 건강보험료 기준표와 자격확인 기준을 함께 봅니다.");
  }
  if (compareBase <= 0) warnings.push("기준 금액이 등록되지 않아 정확한 비교가 어렵습니다.");
  warnings.push("기준표 금액은 노인장기요양보험료 미포함 건강보험료 본인부담금 기준입니다.");
  return warnings;
}

function getExceptionMessages(state) {
  const messages = [];
  if (state.childOrder !== "first") {
    messages.push("둘째 이상 출산가정은 지역에 따라 확대지원이나 서비스 기간 선택 기준을 확인할 필요가 있습니다.");
  }
  if (state.birthType !== "single") {
    messages.push("쌍태아·삼태아 이상은 서비스 가격, 지원금, 제공 인력 기준이 단태아와 달라질 수 있습니다.");
  }
  state.exceptionReasonKeys.forEach((key) => {
    const item = EXCEPTIONS.find((reason) => reason.key === key);
    if (item) messages.push(item.resultMessage);
  });
  return [...new Set(messages)];
}

function calculate(state) {
  const threshold = findThreshold(state);
  const premiumLimit = getPremiumLimit(threshold, state.insuranceType);
  const premiumTotal = getEffectivePremiumTotal(state);
  const compareBase = state.judgeMode === "income" ? threshold?.medianIncome150 || 0 : premiumLimit;
  const inputAmount = state.judgeMode === "income" ? state.monthlyIncome : premiumTotal;
  const ratio = compareBase > 0 ? inputAmount / compareBase : 0;
  const status = getStatus(ratio, state);
  const differenceAmount = compareBase - inputAmount;
  const exceptionMessages = getExceptionMessages(state);

  return {
    status,
    statusLabel: getStatusLabel(status),
    sourceBadge: threshold?.sourceBadge || "확인 필요",
    sourceText: threshold?.sourceLabel || "기준표 확인 필요",
    householdSize: state.householdSize,
    insuranceType: state.insuranceType,
    premiumTotal,
    premiumLimit,
    medianIncome150: threshold?.medianIncome150 || 0,
    inputAmount,
    compareBase,
    differenceAmount,
    differenceRate: ratio,
    incomeTypeSuggestion: getIncomeTypeSuggestion(status),
    exceptionMessages,
    warnings: buildWarnings(state, threshold, compareBase),
  };
}

function statusClass(status) {
  return {
    likely: "pncei-result-card--likely",
    borderline: "pncei-result-card--borderline",
    over: "pncei-result-card--over",
    exception_check: "pncei-result-card--exception",
  }[status] || "";
}

function insuranceLabel(type) {
  return { employee: "직장가입자", local: "지역가입자", mixed: "혼합" }[type] || "직장가입자";
}

function judgeModeLabel(mode) {
  return mode === "income" ? "월소득 보조 판정" : "건강보험료 기준";
}

function buildInterpretation(result, state) {
  const compareLabel = state.judgeMode === "income" ? "월소득" : "건강보험료";
  const baseLabel = state.judgeMode === "income" ? "기준중위소득 150% 월 기준액" : "150% 건강보험료 기준";

  if (result.status === "likely") {
    return `입력한 ${compareLabel}은 ${baseLabel}보다 낮아 통합형 구간에 가까운 것으로 추정됩니다. 실제 신청 전에는 거주지 보건소와 복지로에서 자격확인 여부를 다시 확인하세요.`;
  }
  if (result.status === "borderline") {
    return `입력한 ${compareLabel}이 기준과 가까운 경계 구간입니다. 보험료 산정월, 장기요양보험료 포함 여부, 맞벌이 합산 방식에 따라 판정이 달라질 수 있습니다.`;
  }
  if (result.status === "exception_check") {
    return `입력값은 150% 기준을 초과할 가능성이 있지만, 출산 순위·다태아·예외지원 사유 때문에 라형 또는 지자체 지원을 확인할 필요가 있습니다.`;
  }
  return `입력한 ${compareLabel}은 150% 기준을 초과할 가능성이 있습니다. 라형 기준 본인부담금과 거주지 예외지원 여부를 함께 확인하세요.`;
}

function renderWarnings(warnings) {
  if (!resultEls.warningList) return;
  resultEls.warningList.innerHTML = warnings
    .map((item) => `<p>${item}</p>`)
    .join("");
}

function renderExceptions(messages) {
  if (!resultEls.exceptionMessages) return;
  if (!messages.length) {
    resultEls.exceptionMessages.innerHTML = `
      <article class="pncei-exception-card">
        <strong>체크한 예외지원 사유가 없습니다</strong>
        <p>150% 기준을 초과한다면 거주지 보건소의 라형 또는 지자체 확대지원 기준을 확인하세요.</p>
      </article>
    `;
    return;
  }

  resultEls.exceptionMessages.innerHTML = messages
    .map((message) => `
      <article class="pncei-exception-card pncei-exception-card--active">
        <strong>확인 필요</strong>
        <p>${message}</p>
      </article>
    `)
    .join("");
}

function buildCostUrl(result, state) {
  const params = new URLSearchParams();
  params.set("inc", result.incomeTypeSuggestion);
  params.set("bt", state.birthType);
  params.set("co", state.childOrder);
  return `/tools/postnatal-care-cost/?${params.toString()}`;
}

function render(result, state) {
  const modeLabel = judgeModeLabel(state.judgeMode);
  const baseAmount = state.judgeMode === "income" ? result.medianIncome150 : result.premiumLimit;
  const inputAmount = state.judgeMode === "income" ? state.monthlyIncome : result.premiumTotal;
  const diff = result.differenceAmount;
  const absRate = Number.isFinite(result.differenceRate) ? Math.round(result.differenceRate * 100) : 0;

  setText(resultEls.subcopy, `${state.householdSize}인 가구 · ${insuranceLabel(state.insuranceType)} · ${modeLabel}`);
  setText(resultEls.statusLabel, result.statusLabel);
  setText(resultEls.statusNote, result.incomeTypeSuggestion === "tonghap" ? "통합형 가능성" : result.incomeTypeSuggestion === "ra" ? "라형 확인" : "보건소 확인");
  setText(resultEls.premiumLimit, fmtWon(baseAmount));
  setText(resultEls.premiumLimitNote, state.judgeMode === "income" ? "월소득 기준" : `${insuranceLabel(state.insuranceType)} 기준`);
  setText(resultEls.premiumTotal, fmtWon(inputAmount));
  setText(resultEls.premiumTotalNote, state.judgeMode === "income" ? "입력 월소득" : state.dualIncome ? "낮은 보험료 50% 반영" : "단순 합산");
  setText(resultEls.difference, fmtGap(diff));
  setText(resultEls.differenceNote, `${absRate}% 수준 · ${diff >= 0 ? "기준 이하" : "기준 초과"}`);
  setText(resultEls.sourceText, result.sourceText);
  setText(resultEls.interpretation, buildInterpretation(result, state));

  if (resultEls.statusCard) {
    resultEls.statusCard.className = `pncei-result-card pncei-result-card--status ${statusClass(result.status)}`;
  }
  if (resultEls.sourceBadge) {
    resultEls.sourceBadge.textContent = result.sourceBadge;
    resultEls.sourceBadge.className = `pncei-badge pncei-badge--${result.sourceBadge === "공식" ? "official" : "needs-check"}`;
  }
  if (resultEls.costCta) {
    resultEls.costCta.href = buildCostUrl(result, state);
  }

  renderWarnings(result.warnings);
  renderExceptions(result.exceptionMessages);
}

function syncUrlParams(state) {
  const params = new URLSearchParams();
  params.set("mode", state.judgeMode);
  params.set("rg", state.region);
  params.set("hh", String(state.householdSize));
  params.set("ins", state.insuranceType);
  params.set("mp", String(state.motherPremium));
  params.set("sp", String(state.spousePremium));
  params.set("mi", String(state.monthlyIncome));
  params.set("dual", state.dualIncome ? "yes" : "no");
  params.set("bt", state.birthType);
  params.set("co", state.childOrder);
  if (state.exceptionReasonKeys.length) params.set("ex", state.exceptionReasonKeys.join(","));
  history.replaceState(null, "", `?${params.toString()}`);
}

function formatInput(el) {
  if (!el) return;
  const value = parseWon(el.value);
  el.value = value ? value.toLocaleString("ko-KR") : "";
}

function runCalculation() {
  const state = readState();
  const result = calculate(state);
  render(result, state);
  syncUrlParams(state);
}

function restoreFromUrl() {
  const params = new URLSearchParams(location.search);
  const mode = params.get("mode");
  if (mode) {
    Array.from(fields.judgeMode || []).forEach((item) => {
      item.checked = item.value === mode;
    });
  }
  if (params.get("rg") && fields.region) fields.region.value = params.get("rg");
  if (params.get("hh") && fields.householdSize) fields.householdSize.value = params.get("hh");
  if (params.get("ins") && fields.insuranceType) fields.insuranceType.value = params.get("ins");
  if (params.get("mp") && fields.motherPremium) fields.motherPremium.value = Number(params.get("mp")).toLocaleString("ko-KR");
  if (params.get("sp") && fields.spousePremium) fields.spousePremium.value = Number(params.get("sp")).toLocaleString("ko-KR");
  if (params.get("mi") && fields.monthlyIncome) fields.monthlyIncome.value = Number(params.get("mi")).toLocaleString("ko-KR");
  if (params.get("dual") && fields.dualIncome) fields.dualIncome.value = params.get("dual");
  if (params.get("bt") && fields.birthType) fields.birthType.value = params.get("bt");
  if (params.get("co") && fields.childOrder) fields.childOrder.value = params.get("co");

  const ex = params.get("ex")?.split(",").filter(Boolean) || [];
  Array.from(fields.exceptions || []).forEach((item) => {
    item.checked = ex.includes(item.value);
  });
}

function resetAll() {
  if (fields.region) fields.region.value = DEFAULTS.region;
  if (fields.householdSize) fields.householdSize.value = DEFAULTS.householdSize;
  if (fields.birthType) fields.birthType.value = DEFAULTS.birthType;
  if (fields.childOrder) fields.childOrder.value = DEFAULTS.childOrder;
  Array.from(fields.judgeMode || []).forEach((item) => {
    item.checked = item.value === DEFAULTS.judgeMode;
  });
  if (fields.insuranceType) fields.insuranceType.value = DEFAULTS.insuranceType;
  if (fields.motherPremium) fields.motherPremium.value = DEFAULTS.motherPremium.toLocaleString("ko-KR");
  if (fields.spousePremium) fields.spousePremium.value = DEFAULTS.spousePremium.toLocaleString("ko-KR");
  if (fields.monthlyIncome) fields.monthlyIncome.value = DEFAULTS.monthlyIncome.toLocaleString("ko-KR");
  if (fields.dualIncome) fields.dualIncome.value = DEFAULTS.dualIncome ? "yes" : "no";
  Array.from(fields.exceptions || []).forEach((item) => {
    item.checked = false;
  });
  runCalculation();
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(location.href);
    if (copyBtn) {
      const original = copyBtn.textContent;
      copyBtn.textContent = "링크 복사됨";
      setTimeout(() => {
        copyBtn.textContent = original;
      }, 1500);
    }
  } catch (error) {
    console.error(error);
  }
}

[fields.region, fields.householdSize, fields.birthType, fields.childOrder, fields.insuranceType, fields.dualIncome]
  .forEach((field) => field?.addEventListener("change", runCalculation));

[fields.motherPremium, fields.spousePremium, fields.monthlyIncome].forEach((field) => {
  field?.addEventListener("input", runCalculation);
  field?.addEventListener("blur", () => {
    formatInput(field);
    runCalculation();
  });
});

Array.from(fields.judgeMode || []).forEach((field) => field.addEventListener("change", runCalculation));
Array.from(fields.exceptions || []).forEach((field) => field.addEventListener("change", runCalculation));
resetBtn?.addEventListener("click", resetAll);
copyBtn?.addEventListener("click", copyLink);

restoreFromUrl();
runCalculation();
