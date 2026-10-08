import { parseNumericInput, validateState, calculateEmployee, calculateComparison, calculateRegional, calculateTransition,
  parseUrlState, serializeUrlState, getCapabilities } from "./health-insurance-premium-core.js";

const dataEl = document.getElementById("hip-data");
if (dataEl) {
  const data = JSON.parse(dataEl.textContent);
  const restored = parseUrlState(location.search, data.defaultInput);
  let state = restored.state;
  const drafts = { ...restored.errors };
  let notices = restored.notices;
  const root = document.querySelector(".hip-page");
  const q = (s) => root.querySelector(s), qa = (s) => Array.from(root.querySelectorAll(s));
  const el = (id) => document.getElementById(id);
  const text = (id, value) => { if (el(id)) el(id).textContent = value; };
  const get = (path) => path.split(".").reduce((o, k) => o[k], state);
  // 이 함수는 DOM에 직접 지정된 허용 경로에만 사용한다. URL 원문은 전달하지 않는다.
  const set = (path, value) => { const keys = path.split("."); if (keys.length === 1) state[keys[0]] = value; else state[keys[0]][keys[1]] = value; };
  const won = (a) => a?.value === null || a === null || a === undefined ? a?.reason || "기준 확인 후 계산" :
    `${Math.round(typeof a === "number" ? a : a.value).toLocaleString("ko-KR")}원`;
  const signed = (a) => a?.value === null ? a.reason || "기준 확인 후 계산" :
    a.value === 0 ? "변화 없음" : `${a.value > 0 ? "+" : "−"}${won(Math.abs(a.value))}`;
  function rows(id, items) {
    const tbody = el(id);
    tbody.replaceChildren(...items.map((cells) => {
      const tr = document.createElement("tr");
      cells.forEach((value, index) => { const cell = document.createElement(index === 0 ? "th" : "td");
        if (!index) cell.scope = "row"; cell.textContent = value; tr.append(cell); });
      return tr;
    }));
  }
  function hydrate() {
    qa("[data-hip-input]").forEach((input) => {
      const value = get(input.dataset.hipInput);
      if (input.type === "checkbox") input.checked = value;
      else input.value = value === null ? "" : value.toLocaleString("ko-KR", { maximumFractionDigits: 2 });
    });
    qa("[data-hip-choice]").forEach((input) => {
      if (input.type === "radio") input.checked = input.value === String(get(input.dataset.hipChoice));
      else input.value = String(get(input.dataset.hipChoice));
    });
  }
  function visibility() {
    qa("[data-hip-panel], [data-hip-result-panel]").forEach((node) => { node.hidden = (node.dataset.hipPanel || node.dataset.hipResultPanel) !== state.mode; });
    qa("[data-hip-visible]").forEach((node) => { node.hidden = node.dataset.hipVisible === "annual" ? state.employee.incomeMode !== "annualSalary" : node.dataset.hipVisible === "monthly" ? state.employee.incomeMode !== "monthlyWage" : false; });
    el("hipComparisonInputs").hidden = state.year !== 2027;
    el("hipPreviousOptions").hidden = !state.comparison.enabled;
    el("hipPreviousFields").hidden = state.comparison.previousBasis !== "custom";
    el("hipContinuationField").hidden = !state.transition.showContinuation;
    el("hipTheoryEmployerCard").hidden = !state.employee.showEmployerShare;
    el("hipHealthCard").hidden = state.mode === "transition";
    el("hipCareCard").hidden = state.mode === "transition";
    const compare = state.mode === "employee" && state.year === 2027 && state.comparison.enabled;
    el("hipYearComparison").hidden = !compare;
    el("hipRaiseComparison").hidden = !compare || state.comparison.previousBasis !== "custom";
    el("hipTheoryPanel").hidden = state.mode !== "employee";
  }
  function fieldErrors(errors) {
    qa("[data-hip-error]").forEach((node) => { const path = node.dataset.hipError;
      const input = q(`[data-hip-input="${path}"]`);
      const active = input && !input.closest("[hidden]");
      const message = active ? drafts[path] || errors[path] || "" : "";
      node.textContent = message; input?.setAttribute("aria-invalid", message ? "true" : "false");
    });
  }
  function render() {
    visibility();
    const rule = data.rules[state.year], errors = validateState(state);
    fieldErrors(errors);
    const employee = calculateEmployee(state.employee, rule);
    const regional = state.mode === "regional" ? calculateRegional(state.regional, rule) : null;
    const transition = state.mode === "transition" ? calculateTransition(state.transition, rule) : null;
    const active = state.mode === "employee" ? employee.employee : state.mode === "regional" ? regional.regional : {
      health: { value: null }, care: { value: null }, monthlyTotal: transition.after, annualTotal: transition.afterAnnual,
    };
    text("hipTotalPremium", won(active.monthlyTotal)); text("hipHealthPremium", won(active.health));
    text("hipCarePremium", won(active.care)); text("hipAnnualPremium", won(active.annualTotal));
    [["hipTotalPremium", active.monthlyTotal], ["hipHealthPremium", active.health],
      ["hipCarePremium", active.care], ["hipAnnualPremium", active.annualTotal]].forEach(([id, amount]) => {
      el(id).classList.toggle("hip-kpi-value--pending", amount?.value === null);
    });
    text("hipResultTitle", state.mode === "employee" ? "월 건강보험 관련 공제액" : state.mode === "regional" ? "지역가입자 월 납부액" : "확인한 퇴직 후 납부액");
    text("hipTotalLabel", state.mode === "employee" ? "본인 월 공제 합계" : "월 납부 합계");
    text("hipBasisText", state.mode === "transition" ? `${state.year}년 공단 확인 월 합계 기준입니다. 항목별 보험료를 역산하지 않습니다.` :
      `${state.year}년 기준 · 상하한·단수처리 등 확인되지 않은 납부액은 표시하지 않습니다.`);
    text("hipYearNotice", `${state.year}년 기준 · 공식자료 확인일 2026-10-08${state.year === 2026 ? " · 2026 기록 조회" : " · 건강보험료율 7.19% 동결"}`);
    const theory = employee.theoretical;
    text("hipTheoryHealth", theory ? won(theory.employee.health) : employee.employee.health.reason);
    text("hipTheoryEmployer", theory ? won(theory.employer.health) : employee.employer.health.reason);
    text("hipTheoryBasis", theory ? `월 보수 환산 ${won(employee.monthlyWage)} × 건강보험료율 ${(rule.healthRate.value * 100).toFixed(2)}% × 본인 부담 50% · 상하한·단수처리·감면·정산 미반영` : "보수 입력값을 확인해 주세요. 무보수 상태는 공단 자격 확인이 필요합니다.");
    const sides = [["근로자 부담", employee.employee]];
    if (state.employee.showEmployerShare) sides.push(["회사 별도 부담", employee.employer], ["양쪽 합산", employee.combined]);
    rows("hipEmployeeTable", sides.map(([label, b]) => [label, won(b.health), won(b.care), won(b.monthlyTotal), won(b.annualTotal)]));
    text("hipBurdenRatio", employee.burdenRatio.value === null ? "보수 대비 총 부담 비율은 합계 기준 확인 후 표시합니다." : `본인 합계는 월 보수의 ${employee.burdenRatio.value.toFixed(2)}%입니다.`);
    const comparison = state.mode === "employee" ? calculateComparison(state, data.rules) : null;
    if (comparison) {
      text("hipComparisonBasis", state.comparison.previousBasis === "same" ? "현재와 같은 보수를 2026·2027에 적용했습니다." : `이전 월 보수 ${won(comparison.previousWage)} → 현재 월 보수 ${won(comparison.currentWage)}`);
      const metrics = [["health", "본인 건강보험"], ["care", "본인 장기요양"], ["monthlyTotal", "월 공제 합계"], ["annualTotal", "연 공제 합계"]];
      rows("hipYearTable", metrics.map(([key, label]) => [label, won(comparison.employee.previous[key]), won(comparison.employee.sameBasisCurrent[key]), signed(comparison.employee.rulesEffect[key])]));
      rows("hipRaiseTable", metrics.map(([key, label]) => [label, signed(comparison.employee.rulesEffect[key]), signed(comparison.employee.wageEffect[key]), signed(comparison.employee.totalEffect[key])]));
      text("hipTheoryComparison", comparison.theoretical ? `상하한·단수처리 미반영 건강보험 이론값: 2026 ${won(comparison.theoretical.previous.health)} → 2027 ${won(comparison.theoretical.sameBasisCurrent.health)} · 같은 보수의 차이 ${signed(comparison.theoretical.rulesEffect.health)}. 장기요양 합계 동결을 의미하지 않습니다.` : "이전 보수와 현재 보수를 입력해 주세요.");
      text("hipTheoryRaise", comparison.theoretical ? `건강보험 이론값의 보수 변화 효과: 월 ${signed(comparison.theoretical.wageEffect.health)} · 12개월 환산 ${signed({ value: comparison.theoretical.wageEffect.health.value * 12 })}. 상하한·단수처리 미반영이며 전체 실수령 변화가 아닙니다.` : "이전 보수와 현재 보수를 입력해 주세요.");
    }
    if (transition) {
      const items = [["퇴직 전 직장", won(transition.before.employee.monthlyTotal), won(transition.before.employee.annualTotal), "비교 기준"],
        ["공단 확인 지역", won(transition.after), won(transition.afterAnnual), signed(transition.difference)]];
      if (transition.continuation) items.push(["공단 확인 임의계속", won(transition.continuation), won(transition.continuationAnnual), signed(transition.continuationDifference)]);
      rows("hipTransitionTable", items); text("hipTransitionBasis", `${state.year}년 금액끼리 비교합니다. 입력한 월 합계의 동일 조건 12개월 환산이며 자격 판정은 포함하지 않습니다.`);
    }
    text("hipFormulaText", state.mode === "employee" ? `선택 연도 ${state.year} · 보수 ${won(employee.monthlyWage)} · 건강보험료율 ${(rule.healthRate.value * 100).toFixed(2)}%. 본인·회사 분담 50%씩. 건강보험 합산 상하한: ${rule.employeeLimits.value ? `${won(rule.employeeLimits.value.lower)} ~ ${won(rule.employeeLimits.value.upper)}` : "확인 필요"}. 단수처리: ${rule.rounding.status === "verified" ? "확인된 기준 적용" : "세부 기준 확인 필요"}.` : "지역가입자 계산에는 소득분과 재산분이 필요하며, 퇴직 비교에는 공단에서 확인한 월 합계를 사용합니다.");
    const warnings = [...notices];
    if (state.mode === "employee" && employee.missingRuleIds.length) warnings.push(`${state.year}년 ${employee.missingRuleIds.map((id) => ({employeeLimits:"보험료 상하한",rounding:"단수처리",careIncomeRate:"장기요양 요율"})[id] || "계산 기준").join("·")} 확인 후 납부 합계를 제공합니다.`);
    if (state.mode === "employee" && state.employee.otherAnnualIncome > 0) warnings.push(employee.warningCodes.includes("otherIncomeAbove") ? "보수 외 소득이 연 2,000만원을 초과했습니다. 소득 종류별 평가와 별도 소득월액보험료를 공단에서 확인하세요." : "보수 외 소득은 별도 부과 기준을 확인해야 하며 급여 공제액에 자동 합산하지 않습니다.");
    if (state.mode === "regional" && !getCapabilities(rule).regionalHealth) warnings.push("지역 저소득·상하한·단수처리 기준을 확인 중입니다. 공단 공식 조회로 실제 보험료를 확인하세요.");
    if (employee.lowerApplied && state.mode === "employee") warnings.push("건강보험료 하한을 적용했습니다.");
    if (employee.upperApplied && state.mode === "employee") warnings.push("건강보험료 상한을 적용했습니다.");
    el("hipWarningList").replaceChildren(...[...new Set(warnings)].map((message) => { const node = document.createElement("p"); node.className = "hip-warning"; node.textContent = message; return node; }));
    text("hipLiveSummary", `${state.year}년 ${state.mode === "employee" ? `건강보험 이론값 ${won(theory?.employee.health)}` : "납부액"} · 월 합계 ${won(active.monthlyTotal)}`);
    // 무효 원문을 정규화된 숫자로 URL에 저장하지 않는다.
    if (!Object.keys(errors).length && !Object.keys(drafts).some((path) => q(`[data-hip-input="${path}"]`)?.closest("[hidden]") === null)) syncUrl();
  }
  function syncUrl() { history.replaceState(null, "", `${location.pathname}?${serializeUrlState(state)}${location.hash}`); }
  qa("[data-hip-input]").forEach((input) => {
    input.addEventListener("input", () => {
      const path = input.dataset.hipInput;
      if (input.type === "checkbox") set(path, input.checked);
      else { const parsed = parseNumericInput(input.value, path === "regional.propertyPoints"); set(path, parsed.value);
        if (parsed.error) drafts[path] = parsed.error; else delete drafts[path]; }
      qa("[data-hip-preset]").forEach((button) => button.classList.remove("is-active"));
      text("hipActionStatus", ""); el("hipManualLink").hidden = true; render();
    });
    if (input.type !== "checkbox") {
      input.addEventListener("focus", () => { if (!drafts[input.dataset.hipInput]) input.value = input.value.replaceAll(",", ""); });
      input.addEventListener("blur", () => { const value = get(input.dataset.hipInput); if (!drafts[input.dataset.hipInput] && value !== null) input.value = value.toLocaleString("ko-KR", { maximumFractionDigits: 2 }); });
    }
  });
  qa("[data-hip-choice]").forEach((input) => input.addEventListener("change", () => {
    set(input.dataset.hipChoice, input.dataset.hipChoice === "year" ? Number(input.value) : input.value); notices = []; render();
  }));
  qa("[data-hip-preset]").forEach((button) => button.addEventListener("click", () => {
    const preset = data.presets.find((p) => p.id === button.dataset.hipPreset);
    state.mode = "employee"; state.year = 2027;
    state.employee.otherAnnualIncome = 0; state.employee.excludedAnnualPay = 0;
    if (preset.id === "raise") { state.employee.incomeMode = "annualSalary"; state.employee.annualSalary = 55_000_000;
      Object.assign(state.comparison, { enabled: true, previousBasis: "custom", previousAnnualSalary: 50_000_000, previousExcludedAnnualPay: 0 });
    } else { state.employee.incomeMode = "monthlyWage"; state.employee.monthlyWage = preset.wage; state.comparison.previousBasis = "same"; }
    Object.keys(drafts).forEach((path) => { if (path.startsWith("employee.") || path.startsWith("comparison.")) delete drafts[path]; }); notices = [];
    hydrate(); render(); qa("[data-hip-preset]").forEach((b) => b.classList.toggle("is-active", b === button));
  }));
  el("hipResetBtn").addEventListener("click", () => {
    state = structuredClone(data.defaultInput); Object.keys(drafts).forEach((key) => delete drafts[key]); notices = [];
    qa("[data-hip-preset]").forEach((b) => b.classList.remove("is-active")); text("hipActionStatus", "초기화했습니다."); el("hipManualLink").hidden = true;
    hydrate(); render();
  });
  el("hipCopyLinkBtn").addEventListener("click", async () => {
    if (Object.keys(validateState(state)).length) { text("hipActionStatus", "입력값을 확인한 뒤 링크를 복사해 주세요."); return; }
    syncUrl();
    try { if (!navigator.clipboard?.writeText) throw new Error("clipboard"); await navigator.clipboard.writeText(location.href); text("hipActionStatus", "공유 링크를 복사했습니다."); }
    catch { el("hipManualLink").hidden = false; el("hipManualLink").value = location.href; el("hipManualLink").select(); text("hipActionStatus", "자동 복사가 되지 않았습니다. 아래 링크를 직접 복사해 주세요."); }
  });
  hydrate(); render();
}
