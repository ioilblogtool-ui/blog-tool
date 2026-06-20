const $ = (id) => document.getElementById(id);

function parseConfig() {
  try {
    return JSON.parse($("cstp-config")?.textContent || "{}");
  } catch {
    return { defaults: {}, policy: {}, presets: [] };
  }
}

const CONFIG = parseConfig();
const DEFAULTS = CONFIG.defaults || {};
const POLICY = CONFIG.policy || {};
const PRESETS = Array.isArray(CONFIG.presets) ? CONFIG.presets : [];

function formatWon(value) {
  return `${new Intl.NumberFormat("ko-KR").format(Math.round(Number(value || 0)))}원`;
}

function formatManwon(value) {
  const amount = Math.round(Number(value || 0));
  const eok = Math.floor(amount / 100000000);
  const man = Math.round((amount % 100000000) / 10000);
  if (eok > 0 && man > 0) return `${eok}억 ${new Intl.NumberFormat("ko-KR").format(man)}만원`;
  if (eok > 0) return `${eok}억원`;
  if (man > 0) return `${new Intl.NumberFormat("ko-KR").format(man)}만원`;
  return "0원";
}

function formatPercent(value) {
  return `${Number(value || 0).toFixed(1).replace(/\.0$/, "")}%`;
}

function clamp(value, min, max) {
  return Math.min(Math.max(Number(value || 0), min), max);
}

function getNumber(id) {
  return Number($(id)?.value || 0);
}

function getState() {
  const companyPayMode = $("cstpCompanyPayMode")?.value || DEFAULTS.companyPayMode || "AUTO";
  return {
    monthlyOrdinaryWage: getNumber("cstpWage"),
    weeklyHoursBefore: getNumber("cstpBeforeHours"),
    weeklyHoursAfter: getNumber("cstpAfterHours"),
    plannedMonths: getNumber("cstpMonths"),
    companyPayMode,
    manualCompanyPay: companyPayMode === "MANUAL" ? getNumber("cstpManualCompanyPay") : null,
  };
}

function calculate(input) {
  const before = Math.max(input.weeklyHoursBefore, 1);
  const after = Math.max(input.weeklyHoursAfter, 0);
  const effectiveAfter = Math.min(after, before);
  const monthlyWage = Math.max(input.monthlyOrdinaryWage, 0);
  const reducedHours = Math.max(before - after, 0);
  const firstTenHours = Math.min(reducedHours, 10);
  const extraHours = Math.max(reducedHours - 10, 0);
  const minBase = POLICY.minimumBaseWage || 500000;
  const firstCap = POLICY.firstTenHoursCapWage || 2500000;
  const extraCap = POLICY.extraHoursCapWage || 1600000;

  const autoCompanyPay = monthlyWage * (effectiveAfter / before);
  const companyPay = input.companyPayMode === "MANUAL" && input.manualCompanyPay !== null && input.manualCompanyPay >= 0
    ? input.manualCompanyPay
    : autoCompanyPay;

  const firstBase = firstTenHours > 0 ? clamp(monthlyWage, minBase, firstCap) : 0;
  const firstSupport = firstBase * (firstTenHours / before);
  const extraRawBase = monthlyWage * 0.8;
  const extraBase = extraHours > 0 ? clamp(extraRawBase, minBase, extraCap) : 0;
  const extraSupport = extraBase * (extraHours / before);
  const governmentSupport = reducedHours > 0 ? firstSupport + extraSupport : 0;
  const estimatedTotal = companyPay + governmentSupport;
  const replacementRate = monthlyWage > 0 ? (estimatedTotal / monthlyWage) * 100 : 0;
  const delta = estimatedTotal - monthlyWage;
  const plannedMonths = clamp(input.plannedMonths || 1, 1, 36);

  const warnings = [];
  if (monthlyWage <= 0) warnings.push("월 통상임금을 입력하면 예상 월수령액을 계산할 수 있습니다.");
  if (after >= before) warnings.push("단축 후 주 근로시간은 단축 전 주 근로시간보다 작아야 합니다.");
  if (after < (POLICY.minWeeklyHoursAfter || 15) || after > (POLICY.maxWeeklyHoursAfter || 35)) {
    warnings.push(`단축 후 주 근로시간은 일반적으로 주 ${POLICY.minWeeklyHoursAfter || 15}시간 이상 ${POLICY.maxWeeklyHoursAfter || 35}시간 이하 범위를 확인해야 합니다.`);
  }
  if (input.companyPayMode === "MANUAL" && input.manualCompanyPay === 0) {
    warnings.push("회사 지급액 직접 입력 모드입니다. 회사 안내 월 지급액이 0원인지 다시 확인하세요.");
  }

  return {
    before,
    after,
    effectiveAfter,
    monthlyWage,
    reducedHours,
    firstTenHours,
    extraHours,
    autoCompanyPay,
    companyPay,
    firstBase,
    firstSupport,
    extraRawBase,
    extraBase,
    extraSupport,
    governmentSupport,
    estimatedTotal,
    replacementRate,
    delta,
    plannedMonths,
    warnings,
    firstHitLower: firstTenHours > 0 && monthlyWage < minBase,
    firstHitCap: firstTenHours > 0 && monthlyWage > firstCap,
    extraHitLower: extraHours > 0 && extraRawBase < minBase,
    extraHitCap: extraHours > 0 && extraRawBase > extraCap,
  };
}

function setText(id, value) {
  const element = $(id);
  if (element) element.textContent = value;
}

function setWidth(id, value) {
  const element = $(id);
  if (!element) return;
  element.style.width = `${Math.max(value, value > 0 ? 8 : 0)}%`;
  element.classList.toggle("is-empty", value <= 0);
}

function renderWarnings(warnings) {
  const wrap = $("cstpWarnings");
  if (!wrap) return;
  wrap.innerHTML = warnings.map((warning) => `<p>${warning}</p>`).join("");
  wrap.classList.toggle("is-visible", warnings.length > 0);
}

function renderResult(state, result) {
  setText("cstpWageHint", formatManwon(state.monthlyOrdinaryWage));
  setText("cstpTotal", formatManwon(result.estimatedTotal));
  setText("cstpCompany", formatManwon(result.companyPay));
  setText("cstpGovernment", formatManwon(result.governmentSupport));
  setText("cstpReplacement", formatPercent(result.replacementRate));
  setText("cstpDelta", result.delta >= 0
    ? `기존 월급 대비 ${formatManwon(result.delta)} 증가`
    : `기존 월급 대비 ${formatManwon(Math.abs(result.delta))} 감소`);
  setText("cstpCompanyNote", state.companyPayMode === "MANUAL" ? "회사 안내 금액 기준" : "단축 후 근로시간 비율 기준");
  setText("cstpResultSummary", `주 ${result.before}시간에서 ${result.after}시간으로 줄이면 주 ${result.reducedHours}시간 단축으로 계산합니다.`);
  setText("cstpReducedSummary", `근무 ${result.effectiveAfter}시간 · 단축 ${result.reducedHours}시간`);
  setText("cstpPolicySummary", `최초 ${result.firstTenHours}시간 + 추가 ${result.extraHours}시간`);

  const workWidth = (result.effectiveAfter / result.before) * 100;
  const firstWidth = (result.firstTenHours / result.before) * 100;
  const extraWidth = (result.extraHours / result.before) * 100;
  setWidth("cstpWorkBar", workWidth);
  setWidth("cstpFirstBar", firstWidth);
  setWidth("cstpExtraBar", extraWidth);
  renderWarnings(result.warnings);
}

function renderFormula(state, result) {
  const firstBaseNote = result.firstTenHours > 0
    ? `${formatManwon(result.firstBase)} 기준액${result.firstHitCap ? " · 상한 적용" : result.firstHitLower ? " · 하한 적용" : ""}`
    : "최초 10시간 구간 없음";
  const extraBaseNote = result.extraHours > 0
    ? `${formatManwon(result.extraBase)} 기준액${result.extraHitCap ? " · 상한 적용" : result.extraHitLower ? " · 하한 적용" : ""}`
    : "추가 단축분 없음";

  setText("cstpFirstSupport", result.firstTenHours > 0 ? formatManwon(result.firstSupport) : "해당 없음");
  setText("cstpExtraSupport", result.extraHours > 0 ? formatManwon(result.extraSupport) : "해당 없음");
  setText("cstpFirstBase", firstBaseNote);
  setText("cstpExtraBase", extraBaseNote);
  setText("cstpFirstFormula", result.firstTenHours > 0
    ? `min/max(${formatManwon(state.monthlyOrdinaryWage)}, ${formatManwon(POLICY.minimumBaseWage)}, ${formatManwon(POLICY.firstTenHoursCapWage)}) × ${result.firstTenHours}/${result.before}`
    : "단축시간이 10시간 미만이거나 없음");
  setText("cstpExtraFormula", result.extraHours > 0
    ? `min/max(${formatManwon(state.monthlyOrdinaryWage * 0.8)}, ${formatManwon(POLICY.minimumBaseWage)}, ${formatManwon(POLICY.extraHoursCapWage)}) × ${result.extraHours}/${result.before}`
    : "추가 단축시간 없음");
  setText("cstpCapNote", `최초 10시간 구간은 월 통상임금 100%에 ${formatManwon(POLICY.firstTenHoursCapWage)} 상한을, 추가 단축분은 월 통상임금 80%에 ${formatManwon(POLICY.extraHoursCapWage)} 상한을 비교한 뒤 단축시간 비율을 곱합니다.`);
}

function renderTotalTable(result) {
  const rows = [
    ["회사 지급 예상액", result.companyPay, result.companyPay * result.plannedMonths],
    ["고용보험 급여", result.governmentSupport, result.governmentSupport * result.plannedMonths],
    ["월수령 예상액", result.estimatedTotal, result.estimatedTotal * result.plannedMonths],
    ["기존 월급 대비 차이", result.delta, result.delta * result.plannedMonths],
  ];
  const tbody = $("cstpTotalTable");
  if (!tbody) return;
  tbody.innerHTML = rows.map(([label, monthly, total]) => `
    <tr>
      <td>${label}</td>
      <td>${formatWon(monthly)}</td>
      <td>${formatWon(total)}</td>
    </tr>
  `).join("");
}

function renderScenarioTable(state) {
  const tbody = $("cstpScenarioBody");
  if (!tbody) return;
  const baseBefore = Math.max(state.weeklyHoursBefore || POLICY.defaultWeeklyHoursBefore || 40, 1);
  const afterOptions = PRESETS.map((preset) => preset.weeklyHoursAfter).filter((value, index, array) => array.indexOf(value) === index);
  tbody.innerHTML = afterOptions.map((after) => {
    const scenarioInput = {
      ...state,
      weeklyHoursBefore: baseBefore,
      weeklyHoursAfter: after,
      companyPayMode: "AUTO",
      manualCompanyPay: null,
    };
    const result = calculate(scenarioInput);
    const current = Number(after) === Number(state.weeklyHoursAfter);
    return `
      <tr class="${current ? "is-highlight" : ""}">
        <td><strong>${baseBefore}→${after}시간</strong></td>
        <td>${formatWon(result.companyPay)}</td>
        <td>${formatWon(result.governmentSupport)}</td>
        <td>${formatWon(result.estimatedTotal)}</td>
        <td>${formatPercent(result.replacementRate)}</td>
      </tr>
    `;
  }).join("");
}

function syncManualField() {
  const mode = $("cstpCompanyPayMode")?.value || "AUTO";
  const wrap = $("cstpManualPayWrap");
  if (wrap) wrap.classList.toggle("is-active", mode === "MANUAL");
  setText("cstpCompanyModeHint", mode === "MANUAL" ? "회사 안내 금액을 월수령 예상에 반영" : "통상임금 × 단축 후 근로시간 비율");
}

function syncQuery(state) {
  const params = new URLSearchParams();
  params.set("wage", String(Math.round(state.monthlyOrdinaryWage)));
  params.set("before", String(state.weeklyHoursBefore));
  params.set("after", String(state.weeklyHoursAfter));
  params.set("months", String(state.plannedMonths));
  params.set("company", state.companyPayMode);
  if (state.companyPayMode === "MANUAL" && state.manualCompanyPay !== null) {
    params.set("manual", String(Math.round(state.manualCompanyPay)));
  }
  window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
}

function applyQuery() {
  const params = new URLSearchParams(window.location.search);
  const mapping = {
    wage: "cstpWage",
    before: "cstpBeforeHours",
    after: "cstpAfterHours",
    months: "cstpMonths",
    manual: "cstpManualCompanyPay",
  };
  Object.entries(mapping).forEach(([key, id]) => {
    const value = params.get(key);
    if (value !== null && $(id)) $(id).value = value;
  });
  const company = params.get("company");
  if (company && $("cstpCompanyPayMode")) $("cstpCompanyPayMode").value = company;
}

function render() {
  syncManualField();
  const state = getState();
  const result = calculate(state);
  renderResult(state, result);
  renderFormula(state, result);
  renderTotalTable(result);
  renderScenarioTable(state);
  syncQuery(state);
}

function resetForm() {
  $("cstpWage").value = String(DEFAULTS.monthlyOrdinaryWage || 3000000);
  $("cstpBeforeHours").value = String(DEFAULTS.weeklyHoursBefore || 40);
  $("cstpAfterHours").value = String(DEFAULTS.weeklyHoursAfter || 30);
  $("cstpMonths").value = String(DEFAULTS.plannedMonths || 12);
  $("cstpCompanyPayMode").value = DEFAULTS.companyPayMode || "AUTO";
  $("cstpManualCompanyPay").value = DEFAULTS.manualCompanyPay ? String(DEFAULTS.manualCompanyPay) : "";
  render();
}

function flashButton(button, label) {
  if (!button) return;
  const original = button.textContent;
  button.textContent = label;
  window.setTimeout(() => {
    button.textContent = original;
  }, 1600);
}

if (document.querySelector('[data-calculator="childcare-short-time-pay-calculator"]')) {
  applyQuery();

  [
    "cstpWage",
    "cstpBeforeHours",
    "cstpAfterHours",
    "cstpMonths",
    "cstpCompanyPayMode",
    "cstpManualCompanyPay",
  ].forEach((id) => {
    const element = $(id);
    element?.addEventListener("input", render);
    element?.addEventListener("change", render);
  });

  document.querySelectorAll(".cstp-wage-preset").forEach((button) => {
    button.addEventListener("click", () => {
      $("cstpWage").value = button.dataset.wage;
      render();
    });
  });

  document.querySelectorAll(".cstp-hours-preset").forEach((button) => {
    button.addEventListener("click", () => {
      $("cstpBeforeHours").value = button.dataset.before;
      $("cstpAfterHours").value = button.dataset.after;
      render();
    });
  });

  $("calcCstpBtn")?.addEventListener("click", render);
  $("resetCstpBtn")?.addEventListener("click", () => {
    resetForm();
    flashButton($("resetCstpBtn"), "초기화됨");
  });
  $("copyCstpLinkBtn")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      flashButton($("copyCstpLinkBtn"), "링크 복사됨");
    } catch {
      flashButton($("copyCstpLinkBtn"), "복사 실패");
    }
  });

  render();
}
