(() => {
  const dataEl = document.getElementById("hiri-data");
  if (!dataEl) return;

  const DATA = JSON.parse(dataEl.textContent || "{}");
  const RATES = DATA.rates;
  const PRESETS = DATA.presets || [];
  const EXAMPLE_WAGES = DATA.exampleWages || [];
  const DEFAULT_INPUT = DATA.defaultInput || {
    incomeMode: "monthlyWage",
    monthlyWage: 3000000,
    annualSalary: 36000000,
    viewMode: "employeeAndEmployer",
  };

  let state = { ...DEFAULT_INPUT };

  const q = (selector) => document.querySelector(selector);
  const qa = (selector) => Array.from(document.querySelectorAll(selector));

  function parseWon(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? Math.max(0, parsed) : fallback;
  }

  function formatWon(value) {
    return `${Math.round(value || 0).toLocaleString("ko-KR")}원`;
  }

  function formatSignedWon(value) {
    const rounded = Math.round(value || 0);
    if (rounded === 0) return "변동 없음";
    return `${rounded > 0 ? "+" : "-"}${Math.abs(rounded).toLocaleString("ko-KR")}원`;
  }

  function floorToTenWon(value) {
    return Math.floor(Math.max(0, value || 0) / 10) * 10;
  }

  function calculatePremium(monthlyWage, rule) {
    const employeeHealth = floorToTenWon(monthlyWage * rule.employeeShareRate);
    const employerHealth = floorToTenWon(monthlyWage * rule.employerShareRate);
    const employeeCare = floorToTenWon(employeeHealth * rule.longTermCareRateOnHealthPremium);
    const employerCare = floorToTenWon(employerHealth * rule.longTermCareRateOnHealthPremium);

    return {
      employee: {
        health: employeeHealth,
        care: employeeCare,
        total: employeeHealth + employeeCare,
      },
      employer: {
        health: employerHealth,
        care: employerCare,
        total: employerHealth + employerCare,
      },
      combined: {
        health: employeeHealth + employerHealth,
        care: employeeCare + employerCare,
        total: employeeHealth + employeeCare + employerHealth + employerCare,
      },
    };
  }

  function getMonthlyWage() {
    return state.incomeMode === "annualSalary" ? state.annualSalary / 12 : state.monthlyWage;
  }

  function calculate(monthlyWage = getMonthlyWage()) {
    const previous = calculatePremium(monthlyWage, RATES.previous);
    const current = calculatePremium(monthlyWage, RATES.current);

    return {
      monthlyWage,
      previous,
      current,
      increase: {
        employee: current.employee.total - previous.employee.total,
        employer: current.employer.total - previous.employer.total,
        combined: current.combined.total - previous.combined.total,
      },
    };
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function getRows(result) {
    const employee = {
      label: "근로자 본인 부담",
      previous: result.previous.employee.total,
      current: result.current.employee.total,
      increase: result.increase.employee,
    };
    const employer = {
      label: "사업주 부담",
      previous: result.previous.employer.total,
      current: result.current.employer.total,
      increase: result.increase.employer,
    };
    const total = {
      label: "근로자+사업주 총 부담",
      previous: result.previous.combined.total,
      current: result.current.combined.total,
      increase: result.increase.combined,
    };

    if (state.viewMode === "employeeOnly") return [employee];
    if (state.viewMode === "total") return [total];
    return [employee, employer, total];
  }

  function renderBreakdown(result) {
    const tbody = document.getElementById("hiriBreakdownTable");
    if (!tbody) return;

    const healthIncrease = result.current.employee.health - result.previous.employee.health;
    const careIncrease = result.current.employee.care - result.previous.employee.care;
    const rows = [
      ...getRows(result),
      {
        label: "근로자 건강보험료",
        previous: result.previous.employee.health,
        current: result.current.employee.health,
        increase: healthIncrease,
      },
      {
        label: "근로자 장기요양보험료",
        previous: result.previous.employee.care,
        current: result.current.employee.care,
        increase: careIncrease,
      },
    ];

    tbody.innerHTML = rows
      .map(
        (row) => `
          <tr>
            <td>${row.label}</td>
            <td>${formatWon(row.previous)}</td>
            <td>${formatWon(row.current)}</td>
            <td>${formatSignedWon(row.increase)}</td>
            <td>${formatSignedWon(row.increase * 12)}</td>
          </tr>
        `
      )
      .join("");
  }

  function renderExamples() {
    const tbody = document.getElementById("hiriExampleTable");
    if (!tbody) return;

    tbody.innerHTML = EXAMPLE_WAGES.map((wage) => {
      const result = calculate(wage);
      return `
        <tr>
          <td>${formatWon(wage)}</td>
          <td>${formatWon(result.previous.employee.total)}</td>
          <td>${formatWon(result.current.employee.total)}</td>
          <td>${formatSignedWon(result.increase.employee)}</td>
          <td>${formatSignedWon(result.increase.employee * 12)}</td>
        </tr>
      `;
    }).join("");
  }

  function render() {
    const result = calculate();
    const monthlyWage = result.monthlyWage;

    setText("hiriMonthlyIncrease", formatSignedWon(result.increase.employee));
    setText("hiriAnnualIncrease", formatSignedWon(result.increase.employee * 12));
    setText("hiriEmployee2026", formatWon(result.current.employee.total));
    setText("hiriEmployee2025", formatWon(result.previous.employee.total));
    setText(
      "hiriBasisText",
      `${state.incomeMode === "annualSalary" ? "세전 연봉 환산" : "월 보수월액"} ${formatWon(monthlyWage)} 기준`
    );

    renderBreakdown(result);
    renderExamples();
    syncControls();
    syncUrl();
  }

  function syncControls() {
    qa("[data-hiri-mode]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.hiriMode === state.incomeMode);
    });
    qa("[data-hiri-view]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.hiriView === state.viewMode);
    });
    qa("[data-hiri-preset]").forEach((button) => {
      const wage = Number(button.dataset.hiriPreset);
      button.classList.toggle("is-active", state.incomeMode === "monthlyWage" && wage === state.monthlyWage);
    });

    const monthlyField = q(".hiri-monthly-field");
    const annualField = q(".hiri-annual-field");
    if (monthlyField) monthlyField.hidden = state.incomeMode !== "monthlyWage";
    if (annualField) annualField.hidden = state.incomeMode !== "annualSalary";

    const monthlyInput = q('[data-hiri-input="monthlyWage"]');
    const annualInput = q('[data-hiri-input="annualSalary"]');
    if (monthlyInput && document.activeElement !== monthlyInput) monthlyInput.value = formatNumberInput(state.monthlyWage);
    if (annualInput && document.activeElement !== annualInput) annualInput.value = formatNumberInput(state.annualSalary);
  }

  function formatNumberInput(value) {
    return Math.round(value || 0).toLocaleString("ko-KR");
  }

  function syncUrl() {
    const params = new URLSearchParams();
    params.set("mode", state.incomeMode === "annualSalary" ? "annual" : "monthly");
    params.set(state.incomeMode === "annualSalary" ? "salary" : "wage", String(Math.round(getMonthlyWage() * (state.incomeMode === "annualSalary" ? 12 : 1))));
    params.set("view", state.viewMode);
    const nextUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", nextUrl);
  }

  function readUrl() {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");
    const view = params.get("view");

    if (mode === "annual") {
      state.incomeMode = "annualSalary";
      state.annualSalary = parseWon(params.get("salary"), state.annualSalary);
      state.monthlyWage = state.annualSalary / 12;
    } else if (mode === "monthly") {
      state.incomeMode = "monthlyWage";
      state.monthlyWage = parseWon(params.get("wage"), state.monthlyWage);
      state.annualSalary = state.monthlyWage * 12;
    }

    if (["employeeOnly", "employeeAndEmployer", "total"].includes(view)) {
      state.viewMode = view;
    }
  }

  function bindEvents() {
    qa("[data-hiri-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        state.incomeMode = button.dataset.hiriMode;
        if (state.incomeMode === "annualSalary") {
          state.annualSalary = state.monthlyWage * 12;
        } else {
          state.monthlyWage = state.annualSalary / 12;
        }
        render();
      });
    });

    qa("[data-hiri-view]").forEach((button) => {
      button.addEventListener("click", () => {
        state.viewMode = button.dataset.hiriView;
        render();
      });
    });

    qa("[data-hiri-preset]").forEach((button) => {
      button.addEventListener("click", () => {
        const wage = Number(button.dataset.hiriPreset);
        if (!Number.isFinite(wage)) return;
        state.incomeMode = "monthlyWage";
        state.monthlyWage = wage;
        state.annualSalary = wage * 12;
        render();
      });
    });

    qa("[data-hiri-input]").forEach((input) => {
      input.addEventListener("input", () => {
        const key = input.dataset.hiriInput;
        const value = parseWon(input.value);
        if (key === "monthlyWage") {
          state.monthlyWage = value;
          state.annualSalary = value * 12;
        }
        if (key === "annualSalary") {
          state.annualSalary = value;
          state.monthlyWage = value / 12;
        }
        render();
      });

      input.addEventListener("blur", () => {
        input.value = formatNumberInput(parseWon(input.value));
      });
    });

    const resetBtn = document.getElementById("hiriResetBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        state = { ...DEFAULT_INPUT };
        render();
      });
    }

    const copyBtn = document.getElementById("hiriCopyLinkBtn");
    if (copyBtn) {
      copyBtn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          copyBtn.textContent = "링크 복사됨";
          setTimeout(() => {
            copyBtn.textContent = "링크 복사";
          }, 1600);
        } catch {
          copyBtn.textContent = "복사 실패";
        }
      });
    }
  }

  if (!RATES?.previous || !RATES?.current) return;
  readUrl();
  bindEvents();
  render();
})();
