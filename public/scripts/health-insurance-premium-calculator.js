(() => {
  const dataEl = document.getElementById("hip-data");
  if (!dataEl) return;

  const DATA = JSON.parse(dataEl.textContent || "{}");
  const RULES = DATA.rules;
  const PRESETS = DATA.presets || [];
  const DEFAULT_INPUT = DATA.defaultInput;
  const pointUnitPrice = RULES.regionalPointUnitPrice || 211.5;

  let state = clone(DEFAULT_INPUT);

  const q = (selector) => document.querySelector(selector);
  const qa = (selector) => Array.from(document.querySelectorAll(selector));

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function parseWon(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? Math.max(0, parsed) : fallback;
  }

  function formatWon(value) {
    return `${Math.round(value || 0).toLocaleString("ko-KR")}원`;
  }

  function formatSignedWon(value) {
    const rounded = Math.round(value || 0);
    if (rounded === 0) return "변화 없음";
    return `${rounded > 0 ? "+" : "-"}${Math.abs(rounded).toLocaleString("ko-KR")}원`;
  }

  function floorToTenWon(value) {
    return Math.floor(Math.max(0, value || 0) / 10) * 10;
  }

  function getLongTermCarePremium(healthPremium, rules) {
    return floorToTenWon(healthPremium * rules.longTermCareRateOnHealthPremium);
  }

  function getPremiumBreakdown(healthPremium, rules, badge) {
    const safeHealthPremium = floorToTenWon(healthPremium);
    const longTermCarePremium = getLongTermCarePremium(safeHealthPremium, rules);
    const totalPremium = safeHealthPremium + longTermCarePremium;
    return {
      healthPremium: safeHealthPremium,
      longTermCarePremium,
      totalPremium,
      annualTotalPremium: totalPremium * 12,
      badge,
    };
  }

  function getMonthlyWage(employeeInput) {
    return employeeInput.incomeMode === "annualSalary"
      ? employeeInput.annualSalary / 12
      : employeeInput.monthlyWage;
  }

  function calculateEmployeePremium(employeeInput, rules) {
    const monthlyWage = getMonthlyWage(employeeInput);
    const employee = getPremiumBreakdown(monthlyWage * rules.employeeShareRate, rules, "official");
    const employer = getPremiumBreakdown(monthlyWage * rules.employerShareRate, rules, "official");
    const previousEmployee = getPremiumBreakdown(
      monthlyWage * rules.previousYear.employeeShareRate,
      rules.previousYear,
      "notice"
    );

    const combinedTotal = employee.totalPremium + employer.totalPremium;
    const combined = {
      healthPremium: employee.healthPremium + employer.healthPremium,
      longTermCarePremium: employee.longTermCarePremium + employer.longTermCarePremium,
      totalPremium: combinedTotal,
      annualTotalPremium: combinedTotal * 12,
      badge: "official",
    };

    return {
      employee,
      employer,
      combined,
      previousEmployee,
      monthlyIncreaseFrom2025: employee.totalPremium - previousEmployee.totalPremium,
      otherIncomeWarning: employeeInput.otherAnnualIncome > rules.otherIncomeThreshold,
      monthlyWage,
      monthlyWageBasisLabel:
        employeeInput.incomeMode === "annualSalary" ? "연봉 12분의 1 환산 기준" : "월 보수월액 입력 기준",
    };
  }

  function estimateRegionalPremium(regionalInput, rules) {
    const incomeMonthly = regionalInput.annualIncome / 12;
    const incomePremium = incomeMonthly * rules.healthRate;
    const propertyBase = Math.max(0, regionalInput.propertyTaxBase + regionalInput.rentDeposit * 0.3);
    const propertyPremium = propertyBase > 0 ? propertyBase * 0.0000015 : 0;
    const carPremium = regionalInput.carValue >= 40_000_000 ? 25_000 : 0;
    return incomePremium + propertyPremium + carPremium;
  }

  function calculateRegionalSimple(regionalInput, rules) {
    return {
      regional: getPremiumBreakdown(estimateRegionalPremium(regionalInput, rules), rules, "estimate"),
      estimatedPoints: null,
      usedDirectPoints: false,
      cautionMessages: [
        "지역가입자 보험료는 소득·재산·자동차·세대 구성에 따라 달라지는 간이 추정값입니다.",
        "정확한 금액은 국민건강보험공단 보험료 조회 또는 고지서를 기준으로 확인해야 합니다.",
      ],
    };
  }

  function calculateRegionalByPoints(regionalInput, rules) {
    return {
      regional: getPremiumBreakdown(regionalInput.directPoints * pointUnitPrice, rules, "estimate"),
      estimatedPoints: regionalInput.directPoints,
      usedDirectPoints: true,
      cautionMessages: [
        "부과점수 직접 입력 결과도 실제 감면·정산 여부에 따라 달라질 수 있습니다.",
      ],
    };
  }

  function calculateRegional(regionalInput, rules) {
    return regionalInput.inputMode === "points" && regionalInput.directPoints > 0
      ? calculateRegionalByPoints(regionalInput, rules)
      : calculateRegionalSimple(regionalInput, rules);
  }

  function calculateTransitionPremium(transitionInput, rules) {
    const beforeEmployee = getPremiumBreakdown(transitionInput.beforeMonthlyWage * rules.employeeShareRate, rules, "official");
    const regionalInput = {
      inputMode: transitionInput.directRegionalPoints > 0 ? "points" : "simple",
      annualIncome: transitionInput.afterAnnualIncome,
      propertyTaxBase: transitionInput.afterPropertyTaxBase,
      rentDeposit: transitionInput.afterRentDeposit,
      carValue: 0,
      directPoints: transitionInput.directRegionalPoints,
    };
    const regionalResult = calculateRegional(regionalInput, rules);
    const afterRegional = regionalResult.regional;
    const continuation = transitionInput.useContinuationScenario
      ? getPremiumBreakdown(transitionInput.beforeMonthlyWage * rules.employeeShareRate, rules, "simulation")
      : null;

    return {
      beforeEmployee,
      afterRegional,
      continuation,
      monthlyDifference: afterRegional.totalPremium - beforeEmployee.totalPremium,
      recommendedLabel:
        continuation && continuation.totalPremium < afterRegional.totalPremium
          ? "임의계속가입 검토"
          : "피부양자·지역가입자 조건 확인",
      cautionMessages: [
        "퇴직 후 실제 자격은 피부양자 요건, 임의계속가입 신청 가능 여부, 세대 소득·재산에 따라 달라집니다.",
        ...regionalResult.cautionMessages,
      ],
    };
  }

  function calculate() {
    const employee = calculateEmployeePremium(state.employee, RULES);
    const regional = calculateRegional(state.regional, RULES);
    const transition = calculateTransitionPremium(state.transition, RULES);
    const warnings = [];

    if (employee.otherIncomeWarning) {
      warnings.push("보수 외 소득이 연 2,000만 원을 초과해 소득월액보험료 확인이 필요합니다.");
    }
    if (state.mode === "regional") {
      warnings.push("지역가입자 결과는 실제 고지액과 다를 수 있는 간이 추정값입니다.");
    }
    if (state.mode === "transition") {
      warnings.push("퇴직 후 피부양자 등재 또는 임의계속가입 가능 여부를 국민건강보험공단에서 확인하세요.");
    }
    if (state.mode === "employee" && state.employee.incomeMode === "annualSalary") {
      warnings.push("연봉 입력값은 12개월로 나눈 추정 보수월액 기준입니다.");
    }

    return { employee, regional, transition, warnings };
  }

  function getActiveBreakdown(result) {
    if (state.mode === "regional") return result.regional.regional;
    if (state.mode === "transition") return result.transition.afterRegional;
    return result.employee.employee;
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function renderKpis(result) {
    const active = getActiveBreakdown(result);
    setText("hipTotalPremium", formatWon(active.totalPremium));
    setText("hipHealthPremium", formatWon(active.healthPremium));
    setText("hipCarePremium", formatWon(active.longTermCarePremium));
    setText("hipAnnualPremium", formatWon(active.annualTotalPremium));
    setText("hipIncrease", state.mode === "employee" ? formatSignedWon(result.employee.monthlyIncreaseFrom2025) : "직장 기준만");
    setText("hipHealthSub", state.mode === "employee" ? "본인 부담" : "간이 추정");
    setText("hipBasisText", getBasisText(result));

    const badge = q("#hipMainBadge");
    if (badge) {
      badge.className = `hip-badge hip-badge--${active.badge === "official" ? "official" : active.badge === "simulation" ? "simulation" : "estimate"}`;
      badge.textContent = active.badge === "official" ? "공식" : active.badge === "simulation" ? "시뮬레이션" : "추정";
    }
  }

  function getBasisText(result) {
    if (state.mode === "regional") return "지역가입자 입력값 기반 간이 추정입니다.";
    if (state.mode === "transition") return `퇴직 후 지역가입자 전환 시 월 차이 ${formatSignedWon(result.transition.monthlyDifference)}입니다.`;
    return result.employee.monthlyWageBasisLabel;
  }

  function renderEmployeeTable(employeeResult) {
    const tbody = q("#hipEmployeeTable");
    if (!tbody) return;
    const rows = [
      ["근로자 부담", employeeResult.employee, "공식"],
    ];
    if (state.employee.showEmployerShare) {
      rows.push(["회사 부담", employeeResult.employer, "공식"]);
      rows.push(["전체 보험료", employeeResult.combined, "공식"]);
    }
    tbody.innerHTML = rows
      .map(([label, item, badge]) => `
        <tr>
          <td>${label} <span class="hip-badge hip-badge--official">${badge}</span></td>
          <td>${formatWon(item.healthPremium)}</td>
          <td>${formatWon(item.longTermCarePremium)}</td>
          <td><strong>${formatWon(item.totalPremium)}</strong></td>
        </tr>
      `)
      .join("");
  }

  function renderRegionalPanel(regionalResult) {
    const notice = q("#hipRegionalNotice");
    if (!notice) return;
    notice.textContent = regionalResult.usedDirectPoints
      ? `부과점수 ${regionalResult.estimatedPoints.toLocaleString("ko-KR")}점과 점수당 ${pointUnitPrice.toLocaleString("ko-KR")}원을 적용한 참고값입니다.`
      : "소득·재산·전월세·자동차·세대 구성과 감면 여부에 따라 실제 고지액이 달라질 수 있습니다.";
  }

  function renderTransitionTable(transitionResult) {
    const tbody = q("#hipTransitionTable");
    if (!tbody) return;
    const rows = [
      ["퇴직 전 직장가입자", transitionResult.beforeEmployee, "공식", "official"],
      ["퇴직 후 지역가입자", transitionResult.afterRegional, "추정", "estimate"],
    ];
    if (transitionResult.continuation) {
      rows.push(["임의계속가입", transitionResult.continuation, "시뮬레이션", "simulation"]);
    }
    tbody.innerHTML = rows
      .map(([label, item, badge, badgeClass]) => `
        <tr>
          <td>${label}</td>
          <td>${formatWon(item.healthPremium)}</td>
          <td>${formatWon(item.longTermCarePremium)}</td>
          <td><strong>${formatWon(item.totalPremium)}</strong></td>
          <td><span class="hip-badge hip-badge--${badgeClass}">${badge}</span></td>
        </tr>
      `)
      .join("");

    const msg = q("#hipTransitionMessage");
    if (msg) {
      msg.textContent = `퇴직 후 지역가입자 간이 추정액은 퇴직 전보다 월 ${formatSignedWon(transitionResult.monthlyDifference)}입니다. ${transitionResult.recommendedLabel}가 필요합니다.`;
    }
  }

  function renderWarnings(result) {
    const list = q("#hipWarningList");
    if (!list) return;
    list.innerHTML = result.warnings.map((warning) => `<div class="hip-warning">${warning}</div>`).join("");
  }

  function renderVisibility() {
    qa("[data-hip-panel]").forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.hipPanel === state.mode);
    });
    qa("[data-hip-result-panel]").forEach((panel) => {
      panel.hidden = panel.dataset.hipResultPanel !== state.mode;
    });
    qa("[data-hip-mode]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.hipMode === state.mode);
    });

    const monthlyField = q(".hip-employee-monthly-field");
    const annualField = q(".hip-employee-annual-field");
    if (monthlyField) monthlyField.hidden = state.employee.incomeMode !== "monthlyWage";
    if (annualField) annualField.hidden = state.employee.incomeMode !== "annualSalary";
    qa("[data-hip-employee-income-mode]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.hipEmployeeIncomeMode === state.employee.incomeMode);
    });

    const simpleFields = q(".hip-regional-simple-fields");
    const pointFields = q(".hip-regional-point-fields");
    if (simpleFields) simpleFields.hidden = state.regional.inputMode !== "simple";
    if (pointFields) pointFields.hidden = state.regional.inputMode !== "points";
    qa("[data-hip-regional-input-mode]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.hipRegionalInputMode === state.regional.inputMode);
    });
  }

  function updateInputValues() {
    qa("[data-hip-input]").forEach((input) => {
      const path = input.dataset.hipInput;
      const value = getPath(state, path);
      if (input.type === "checkbox") {
        input.checked = Boolean(value);
      } else if (input.type === "number") {
        input.value = value || 0;
      } else {
        input.value = Number(value || 0).toLocaleString("ko-KR");
      }
    });
  }

  function getPath(obj, path) {
    return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
  }

  function setPath(obj, path, value) {
    const parts = path.split(".");
    let target = obj;
    parts.slice(0, -1).forEach((part) => {
      target = target[part];
    });
    target[parts[parts.length - 1]] = value;
  }

  function readInput(input) {
    const path = input.dataset.hipInput;
    const value = input.type === "checkbox" ? input.checked : parseWon(input.value);
    setPath(state, path, value);
    if (input.type !== "checkbox" && input.type !== "number") {
      input.value = Number(value || 0).toLocaleString("ko-KR");
    }
  }

  function applyPreset(id) {
    const preset = PRESETS.find((item) => item.id === id);
    if (!preset) return;
    if (preset.input.mode) state.mode = preset.input.mode;
    if (preset.input.employee) Object.assign(state.employee, preset.input.employee);
    if (preset.input.regional) Object.assign(state.regional, preset.input.regional);
    if (preset.input.transition) Object.assign(state.transition, preset.input.transition);
    qa("[data-hip-preset]").forEach((btn) => btn.classList.toggle("is-active", btn.dataset.hipPreset === id));
    updateInputValues();
    renderVisibility();
    recalc();
  }

  function syncUrlParams() {
    const params = new URLSearchParams();
    params.set("mode", state.mode);
    params.set("wage", Math.round(state.employee.monthlyWage));
    params.set("salary", Math.round(state.employee.annualSalary));
    params.set("other", Math.round(state.employee.otherAnnualIncome));
    params.set("ri", Math.round(state.regional.annualIncome));
    params.set("rp", Math.round(state.regional.propertyTaxBase));
    params.set("rent", Math.round(state.regional.rentDeposit));
    params.set("points", String(state.regional.directPoints || 0));
    params.set("twage", Math.round(state.transition.beforeMonthlyWage));
    params.set("tai", Math.round(state.transition.afterAnnualIncome));
    params.set("tap", Math.round(state.transition.afterPropertyTaxBase));
    history.replaceState(null, "", `${location.pathname}?${params.toString()}${location.hash}`);
  }

  function restoreFromUrl() {
    const params = new URLSearchParams(location.search);
    if (["employee", "regional", "transition"].includes(params.get("mode"))) state.mode = params.get("mode");
    const mappings = [
      ["wage", "employee.monthlyWage"],
      ["salary", "employee.annualSalary"],
      ["other", "employee.otherAnnualIncome"],
      ["ri", "regional.annualIncome"],
      ["rp", "regional.propertyTaxBase"],
      ["rent", "regional.rentDeposit"],
      ["points", "regional.directPoints"],
      ["twage", "transition.beforeMonthlyWage"],
      ["tai", "transition.afterAnnualIncome"],
      ["tap", "transition.afterPropertyTaxBase"],
    ];
    mappings.forEach(([param, path]) => {
      if (params.has(param)) setPath(state, path, parseWon(params.get(param)));
    });
    if (state.regional.directPoints > 0) state.regional.inputMode = "points";
  }

  function copyLink() {
    syncUrlParams();
    navigator.clipboard?.writeText(location.href);
    const btn = q("#hipCopyLinkBtn");
    if (btn) {
      const original = btn.textContent;
      btn.textContent = "복사 완료";
      setTimeout(() => {
        btn.textContent = original;
      }, 1200);
    }
  }

  function bindEvents() {
    qa("[data-hip-mode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.mode = btn.dataset.hipMode;
        renderVisibility();
        recalc();
      });
    });
    qa("[data-hip-employee-income-mode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.employee.incomeMode = btn.dataset.hipEmployeeIncomeMode;
        renderVisibility();
        recalc();
      });
    });
    qa("[data-hip-regional-input-mode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.regional.inputMode = btn.dataset.hipRegionalInputMode;
        renderVisibility();
        recalc();
      });
    });
    qa("[data-hip-input]").forEach((input) => {
      input.addEventListener("input", () => {
        readInput(input);
        recalc();
      });
      input.addEventListener("change", () => {
        readInput(input);
        recalc();
      });
    });
    qa("[data-hip-preset]").forEach((btn) => {
      btn.addEventListener("click", () => applyPreset(btn.dataset.hipPreset));
    });
    q("#hipResetBtn")?.addEventListener("click", () => {
      state = clone(DEFAULT_INPUT);
      updateInputValues();
      renderVisibility();
      recalc();
    });
    q("#hipCopyLinkBtn")?.addEventListener("click", copyLink);
  }

  function recalc() {
    const result = calculate();
    renderKpis(result);
    renderEmployeeTable(result.employee);
    renderRegionalPanel(result.regional);
    renderTransitionTable(result.transition);
    renderWarnings(result);
    syncUrlParams();
  }

  restoreFromUrl();
  updateInputValues();
  bindEvents();
  renderVisibility();
  recalc();
})();
