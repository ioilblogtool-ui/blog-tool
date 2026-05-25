(function () {
  const root = document.querySelector(".shbc-page");
  const configNode = document.getElementById("shbcConfig");
  if (!root || !configNode) return;

  const config = JSON.parse(configNode.textContent || "{}");
  const companies = config.companies || [];
  const taxBrackets = config.taxBrackets || [];
  const companyMap = Object.fromEntries(companies.map((company) => [company.id, company]));

  const DEFAULT_ANNUAL_SALARY = 70000000;
  const DEFAULT_MANUAL_TAX_RATE = 22;
  let monthlySalaryTouched = false;

  const formatter = new Intl.NumberFormat("ko-KR");

  function query(selector) {
    return root.querySelector(selector);
  }

  function queryAll(selector) {
    return Array.from(root.querySelectorAll(selector));
  }

  function parseNumber(value) {
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;
    return Number(String(value || "").replace(/[^\d.-]/g, "")) || 0;
  }

  function formatWon(value) {
    return `${formatter.format(Math.round(value || 0))}원`;
  }

  function formatAmount(value) {
    const amount = Math.round(value || 0);
    const eok = Math.floor(amount / 100000000);
    const man = Math.floor((amount % 100000000) / 10000);
    if (eok > 0 && man > 0) return `${eok}억 ${formatter.format(man)}만원`;
    if (eok > 0) return `${eok}억원`;
    return `${formatter.format(man)}만원`;
  }

  function formatPercent(value) {
    return `${(value * 100).toFixed(1)}%`;
  }

  function setText(selector, value) {
    const el = query(selector);
    if (el) el.textContent = value;
  }

  function getInput(selector) {
    return query(selector);
  }

  function setInputValue(selector, value) {
    const input = getInput(selector);
    if (input) input.value = String(value);
  }

  function getEstimatedTaxRate(annualSalary, taxMode, manualTaxRate) {
    if (taxMode === "manual") return Math.max(0, Math.min(60, manualTaxRate)) / 100;
    const bracket = taxBrackets.find((item) => {
      const minOk = annualSalary >= item.minAnnualSalary;
      const maxOk = item.maxAnnualSalary === null || annualSalary <= item.maxAnnualSalary;
      return minOk && maxOk;
    });
    return bracket ? bracket.estimatedDeductionRate : 0.24;
  }

  function calculateGrossBonus(input, annualSalary, monthlySalary) {
    const monthlyBonus = monthlySalary * input.monthlyMultiple;
    const percentBonus = annualSalary * (input.salaryPercent / 100);
    const fixedBonus = input.fixedAmount;

    if (input.mode === "monthlyMultiple") return monthlyBonus;
    if (input.mode === "salaryPercent") return percentBonus;
    if (input.mode === "fixedAmount") return fixedBonus;
    return monthlyBonus + percentBonus + fixedBonus;
  }

  function readCompanyInput(company) {
    const id = company.id;
    return {
      selected: Boolean(query(`[data-shbc-company-toggle="${id}"]`)?.checked),
      mode: query(`[data-shbc-mode="${id}"]`)?.value || company.defaultMode,
      monthlyMultiple: parseNumber(query(`[data-shbc-monthly-multiple="${id}"]`)?.value),
      salaryPercent: parseNumber(query(`[data-shbc-salary-percent="${id}"]`)?.value),
      fixedAmount: parseNumber(query(`[data-shbc-fixed-amount="${id}"]`)?.value),
    };
  }

  function readState() {
    const annualSalary = Math.max(0, parseNumber(query("[data-shbc-annual-salary]")?.value));
    const monthlySalary = Math.max(0, parseNumber(query("[data-shbc-monthly-salary]")?.value));
    const taxMode = query("[data-shbc-tax-mode]")?.value || "simple";
    const manualTaxRate = parseNumber(query("[data-shbc-manual-tax-rate]")?.value);
    return { annualSalary, monthlySalary, taxMode, manualTaxRate };
  }

  function calculate() {
    const state = readState();
    const taxRate = getEstimatedTaxRate(state.annualSalary, state.taxMode, state.manualTaxRate);
    const results = companies
      .map((company) => {
        const input = readCompanyInput(company);
        if (!input.selected) return null;
        const grossBonus = calculateGrossBonus(input, state.annualSalary, state.monthlySalary);
        const estimatedDeduction = grossBonus * taxRate;
        const netBonus = Math.max(0, grossBonus - estimatedDeduction);
        return {
          company,
          input,
          grossBonus,
          estimatedDeduction,
          netBonus,
          netRate: grossBonus > 0 ? netBonus / grossBonus : 0,
          monthlyNetEquivalent: netBonus / 12,
          totalCompensation: state.annualSalary + grossBonus,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.netBonus - a.netBonus);

    return { ...state, taxRate, results };
  }

  function modeLabel(mode) {
    return {
      monthlyMultiple: "월급 n개월",
      salaryPercent: "연봉 대비 %",
      fixedAmount: "고정 금액",
      mixed: "혼합",
    }[mode] || "직접 입력";
  }

  function renderKpi(result) {
    if (result.results.length === 0) {
      setText("[data-shbc-best-net]", "회사를 선택하세요");
      setText("[data-shbc-max-gap]", "-");
      setText("[data-shbc-monthly-gap]", "-");
      setText("[data-shbc-best-total]", "-");
      return;
    }

    const best = result.results[0];
    const worst = result.results[result.results.length - 1];
    const maxGap = Math.max(0, best.netBonus - worst.netBonus);

    setText("[data-shbc-best-net]", formatAmount(best.netBonus));
    setText("[data-shbc-max-gap]", formatAmount(maxGap));
    setText("[data-shbc-monthly-gap]", formatAmount(maxGap / 12));
    setText("[data-shbc-best-total]", formatAmount(best.totalCompensation));
    setText("[data-shbc-tax-note]", `세후 금액은 ${formatPercent(result.taxRate)} 간편 공제율 기준 추정입니다.`);
  }

  function renderTable(result) {
    const tbody = query("[data-shbc-result-table]");
    if (!tbody) return;

    if (result.results.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7">비교할 회사를 1개 이상 선택해 주세요.</td></tr>`;
      return;
    }

    tbody.innerHTML = result.results.map((item, index) => `
      <tr class="${index === 0 ? "is-best" : ""}">
        <td>
          <strong>${item.company.shortName}</strong>
          <span>${item.company.defaultPaymentLabel}</span>
        </td>
        <td>${modeLabel(item.input.mode)}</td>
        <td>${formatWon(item.grossBonus)}</td>
        <td>${formatWon(item.netBonus)}</td>
        <td>${formatWon(item.monthlyNetEquivalent)}</td>
        <td>${formatWon(item.totalCompensation)}</td>
        <td><span class="shbc-small-badge">시뮬레이션</span></td>
      </tr>
    `).join("");
  }

  function renderCards(result) {
    const container = query("[data-shbc-result-cards]");
    if (!container) return;

    container.innerHTML = result.results.map((item, index) => `
      <article class="shbc-result-card ${index === 0 ? "shbc-result-card--best" : ""}">
        <div>
          <p>${index === 0 ? "최고 예상 세후" : "예상 세후"}</p>
          <h3>${item.company.shortName}</h3>
        </div>
        <strong>${formatAmount(item.netBonus)}</strong>
        <span>세전 ${formatAmount(item.grossBonus)} · 월평균 ${formatAmount(item.monthlyNetEquivalent)}</span>
      </article>
    `).join("");
  }

  function updateCompanyPanels() {
    companies.forEach((company) => {
      const input = readCompanyInput(company);
      const panel = query(`[data-shbc-company-panel="${company.id}"]`);
      if (panel) panel.classList.toggle("is-disabled", !input.selected);
    });
  }

  function updateMonthlySalaryFromAnnual() {
    if (monthlySalaryTouched) return;
    const annual = parseNumber(query("[data-shbc-annual-salary]")?.value);
    setInputValue("[data-shbc-monthly-salary]", Math.round(annual / 12));
  }

  function update() {
    updateCompanyPanels();
    const result = calculate();
    renderKpi(result);
    renderTable(result);
    renderCards(result);
  }

  function reset() {
    monthlySalaryTouched = false;
    setInputValue("[data-shbc-annual-salary]", DEFAULT_ANNUAL_SALARY);
    setInputValue("[data-shbc-monthly-salary]", Math.round(DEFAULT_ANNUAL_SALARY / 12));
    setInputValue("[data-shbc-tax-mode]", "simple");
    setInputValue("[data-shbc-manual-tax-rate]", DEFAULT_MANUAL_TAX_RATE);

    companies.forEach((company) => {
      const toggle = query(`[data-shbc-company-toggle="${company.id}"]`);
      if (toggle) toggle.checked = company.defaultSelected;
      setInputValue(`[data-shbc-mode="${company.id}"]`, company.defaultMode);
      setInputValue(`[data-shbc-monthly-multiple="${company.id}"]`, company.defaultMonthlyMultiple);
      setInputValue(`[data-shbc-salary-percent="${company.id}"]`, company.defaultSalaryPercent);
      setInputValue(`[data-shbc-fixed-amount="${company.id}"]`, company.defaultFixedAmount);
    });
    update();
  }

  function copyLink() {
    const result = calculate();
    const params = new URLSearchParams();
    params.set("salary", Math.round(result.annualSalary));
    params.set("tax", result.taxMode);
    const selected = result.results.map((item) => item.company.id).join(",");
    params.set("companies", selected);
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard?.writeText(url);
  }

  function bindEvents() {
    root.addEventListener("input", (event) => {
      if (event.target.matches("[data-shbc-annual-salary]")) updateMonthlySalaryFromAnnual();
      if (event.target.matches("[data-shbc-monthly-salary]")) monthlySalaryTouched = true;
      update();
    });
    root.addEventListener("change", update);
    document.getElementById("shbcResetBtn")?.addEventListener("click", reset);
    document.getElementById("shbcCopyBtn")?.addEventListener("click", copyLink);
  }

  bindEvents();
  reset();
})();
