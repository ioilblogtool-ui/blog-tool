(function () {
  const root = document.querySelector(".abc-page");
  const configNode = document.getElementById("abcConfig");
  if (!root || !configNode) return;

  const config = JSON.parse(configNode.textContent || "{}");
  const companies = config.companies || [];
  const taxBrackets = config.taxBrackets || [];

  const DEFAULT_ANNUAL_SALARY = 80000000;
  const DEFAULT_MANUAL_TAX_RATE = 22;
  let monthlySalaryTouched = false;

  const formatter = new Intl.NumberFormat("ko-KR");

  function query(selector) {
    return root.querySelector(selector);
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

  function setInputValue(selector, value) {
    const input = query(selector);
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

  function calculateCashBonus(input, annualSalary, monthlySalary) {
    const monthlyBonus = monthlySalary * input.monthlyMultiple;
    const percentBonus = annualSalary * (input.salaryPercent / 100);
    const fixedBonus = input.fixedAmount;

    if (input.mode === "monthlyMultiple") return monthlyBonus;
    if (input.mode === "salaryPercent") return percentBonus;
    if (input.mode === "fixedAmount") return fixedBonus;
    // mixed: 월급 n개월 + 고정 격려금
    return monthlyBonus + fixedBonus;
  }

  function readCompanyInput(company) {
    const id = company.id;
    return {
      selected: Boolean(query(`[data-abc-company-toggle="${id}"]`)?.checked),
      mode: query(`[data-abc-mode="${id}"]`)?.value || company.defaultMode,
      monthlyMultiple: parseNumber(query(`[data-abc-monthly-multiple="${id}"]`)?.value),
      salaryPercent: parseNumber(query(`[data-abc-salary-percent="${id}"]`)?.value),
      fixedAmount: parseNumber(query(`[data-abc-fixed-amount="${id}"]`)?.value),
      stockShares: company.supportsStock ? parseNumber(query(`[data-abc-stock-shares="${id}"]`)?.value) : 0,
      stockPrice: company.supportsStock ? parseNumber(query(`[data-abc-stock-price="${id}"]`)?.value) : 0,
    };
  }

  function readState() {
    const annualSalary = Math.max(0, parseNumber(query("[data-abc-annual-salary]")?.value));
    const monthlySalary = Math.max(0, parseNumber(query("[data-abc-monthly-salary]")?.value));
    const taxMode = query("[data-abc-tax-mode]")?.value || "simple";
    const manualTaxRate = parseNumber(query("[data-abc-manual-tax-rate]")?.value);
    return { annualSalary, monthlySalary, taxMode, manualTaxRate };
  }

  function calculate() {
    const state = readState();
    const taxRate = getEstimatedTaxRate(state.annualSalary, state.taxMode, state.manualTaxRate);
    const results = companies
      .map((company) => {
        const input = readCompanyInput(company);
        if (!input.selected) return null;
        const cashBonus = calculateCashBonus(input, state.annualSalary, state.monthlySalary);
        const stockValue = input.stockShares * input.stockPrice;
        const estimatedDeduction = cashBonus * taxRate;
        const netBonus = Math.max(0, cashBonus - estimatedDeduction);
        return {
          company,
          input,
          cashBonus,
          stockValue,
          estimatedDeduction,
          netBonus,
          netRate: cashBonus > 0 ? netBonus / cashBonus : 0,
          monthlyNetEquivalent: netBonus / 12,
          totalCompensation: state.annualSalary + cashBonus,
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
      setText("[data-abc-best-net]", "회사를 선택하세요");
      setText("[data-abc-max-gap]", "-");
      setText("[data-abc-monthly-gap]", "-");
      setText("[data-abc-best-total]", "-");
      return;
    }

    const best = result.results[0];
    const worst = result.results[result.results.length - 1];
    const maxGap = Math.max(0, best.netBonus - worst.netBonus);

    setText("[data-abc-best-net]", formatAmount(best.netBonus));
    setText("[data-abc-max-gap]", formatAmount(maxGap));
    setText("[data-abc-monthly-gap]", formatAmount(maxGap / 12));
    setText("[data-abc-best-total]", formatAmount(best.totalCompensation));
    setText("[data-abc-tax-note]", `세후 금액은 ${formatPercent(result.taxRate)} 간편 공제율 기준 추정입니다.`);
  }

  function renderTable(result) {
    const tbody = query("[data-abc-result-table]");
    if (!tbody) return;

    if (result.results.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8">비교할 회사를 1개 이상 선택해 주세요.</td></tr>`;
      return;
    }

    tbody.innerHTML = result.results.map((item, index) => {
      const stockCell = item.stockValue > 0
        ? `<span class="abc-stock-note">${formatWon(item.stockValue)}</span><small>주가 기준 참고값</small>`
        : `<span style="color:#9CA3AF">—</span>`;
      return `
        <tr class="${index === 0 ? "is-best" : ""}">
          <td>
            <strong>${item.company.shortName}</strong>
            <span>${item.company.defaultPaymentLabel}</span>
          </td>
          <td>${modeLabel(item.input.mode)}</td>
          <td>${formatWon(item.cashBonus)}</td>
          <td>${formatWon(item.netBonus)}</td>
          <td>${formatWon(item.monthlyNetEquivalent)}</td>
          <td>${formatWon(item.totalCompensation)}</td>
          <td>${stockCell}</td>
          <td><span class="abc-small-badge">시뮬레이션</span></td>
        </tr>
      `;
    }).join("");
  }

  function renderCards(result) {
    const container = query("[data-abc-result-cards]");
    if (!container) return;

    container.innerHTML = result.results.map((item, index) => {
      const stockLine = item.stockValue > 0
        ? ` · 자사주 참고 ${formatAmount(item.stockValue)}`
        : "";
      return `
        <article class="abc-result-card ${index === 0 ? "abc-result-card--best" : ""}">
          <div>
            <p>${index === 0 ? "최고 예상 세후" : "예상 세후"}</p>
            <h3>${item.company.shortName}</h3>
          </div>
          <strong>${formatAmount(item.netBonus)}</strong>
          <span>세전 ${formatAmount(item.cashBonus)} · 월평균 ${formatAmount(item.monthlyNetEquivalent)}${stockLine}</span>
        </article>
      `;
    }).join("");
  }

  function updateCompanyPanels() {
    companies.forEach((company) => {
      const input = readCompanyInput(company);
      const panel = query(`[data-abc-company-panel="${company.id}"]`);
      if (panel) panel.classList.toggle("is-disabled", !input.selected);
    });
  }

  function updateMonthlySalaryFromAnnual() {
    if (monthlySalaryTouched) return;
    const annual = parseNumber(query("[data-abc-annual-salary]")?.value);
    setInputValue("[data-abc-monthly-salary]", Math.round(annual / 12));
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
    setInputValue("[data-abc-annual-salary]", DEFAULT_ANNUAL_SALARY);
    setInputValue("[data-abc-monthly-salary]", Math.round(DEFAULT_ANNUAL_SALARY / 12));
    setInputValue("[data-abc-tax-mode]", "simple");
    setInputValue("[data-abc-manual-tax-rate]", DEFAULT_MANUAL_TAX_RATE);

    companies.forEach((company) => {
      const toggle = query(`[data-abc-company-toggle="${company.id}"]`);
      if (toggle) toggle.checked = company.defaultSelected;
      setInputValue(`[data-abc-mode="${company.id}"]`, company.defaultMode);
      setInputValue(`[data-abc-monthly-multiple="${company.id}"]`, company.defaultMonthlyMultiple);
      setInputValue(`[data-abc-salary-percent="${company.id}"]`, company.defaultSalaryPercent);
      setInputValue(`[data-abc-fixed-amount="${company.id}"]`, company.defaultFixedAmount);
      if (company.supportsStock) {
        setInputValue(`[data-abc-stock-shares="${company.id}"]`, company.defaultStockShares);
        setInputValue(`[data-abc-stock-price="${company.id}"]`, company.defaultStockPrice);
      }
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
      if (event.target.matches("[data-abc-annual-salary]")) updateMonthlySalaryFromAnnual();
      if (event.target.matches("[data-abc-monthly-salary]")) monthlySalaryTouched = true;
      update();
    });
    root.addEventListener("change", update);
    document.getElementById("abcResetBtn")?.addEventListener("click", reset);
    document.getElementById("abcCopyBtn")?.addEventListener("click", copyLink);
  }

  bindEvents();
  reset();
})();
