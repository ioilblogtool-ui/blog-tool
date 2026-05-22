(function () {
  "use strict";

  const dataNode = document.getElementById("shlcData");
  if (!dataNode) return;

  let seed;
  try {
    seed = JSON.parse(dataNode.textContent || "{}");
  } catch (error) {
    console.error("[single-household-living-cost] data parse error", error);
    return;
  }

  const formatWon = (value) => `${Number(value || 0).toLocaleString("ko-KR")}원`;
  const formatManwon = (value) => `${Math.round(Number(value || 0) / 10000).toLocaleString("ko-KR")}만원`;
  const colors = ["#16795b", "#ba7517", "#45536f", "#7b5ea7", "#be4f38", "#557a2f", "#6c746f"];

  function renderCostDonut() {
    const root = document.getElementById("shlcCostDonut");
    if (!root) return;
    const items = seed.costItems || [];
    root.innerHTML = items
      .map((item, index) => {
        const width = Math.max(4, Number(item.share || 0));
        return `
          <div class="shlc-donut-row">
            <span style="background:${colors[index % colors.length]}"></span>
            <strong>${item.label}</strong>
            <div class="shlc-donut-bar"><i style="width:${width}%;background:${colors[index % colors.length]}"></i></div>
            <em>${item.share}%</em>
          </div>
        `;
      })
      .join("");
  }

  function scenarioItems(scenario) {
    return [
      ["주거비", scenario.housing],
      ["식비", scenario.food],
      ["통신·구독", scenario.telecomSubscription],
      ["교통비", scenario.transport],
      ["보험·의료", scenario.insuranceMedical],
      ["여가", scenario.leisure],
      ["완충", scenario.buffer],
    ];
  }

  function renderBudgetScenario(type) {
    const scenarios = seed.budgetScenarios || [];
    const scenario = scenarios.find((item) => item.type === type) || scenarios[1] || scenarios[0];
    const panel = document.getElementById("shlcBudgetPanel");
    const chart = document.getElementById("shlcBudgetChart");
    if (!scenario || !panel || !chart) return;

    panel.innerHTML = `
      <span class="shlc-badge shlc-badge--simulation">시뮬레이션</span>
      <strong>${scenario.label} 월 ${formatManwon(scenario.monthlyTotal)}</strong>
      <p>${scenario.description}</p>
    `;

    chart.innerHTML = scenarioItems(scenario)
      .map(([label, value], index) => {
        const pct = scenario.monthlyTotal ? Math.round((value / scenario.monthlyTotal) * 100) : 0;
        return `
          <div class="shlc-budget-row">
            <span>${label}</span>
            <div><i style="width:${Math.max(2, pct)}%;background:${colors[index % colors.length]}"></i></div>
            <strong>${formatManwon(value)} · ${pct}%</strong>
          </div>
        `;
      })
      .join("");

    document.querySelectorAll("[data-shlc-budget]").forEach((button) => {
      const selected = button.dataset.shlcBudget === scenario.type;
      button.setAttribute("aria-selected", selected ? "true" : "false");
    });
  }

  function bindBudgetTabs() {
    document.querySelectorAll("[data-shlc-budget]").forEach((button) => {
      button.addEventListener("click", () => renderBudgetScenario(button.dataset.shlcBudget));
    });
    renderBudgetScenario("average");
  }

  function bindSavingChecklist() {
    const actions = seed.savingActions || [];
    const totalEl = document.getElementById("shlcSavingTotal");
    const annualEl = document.getElementById("shlcSavingAnnual");

    function update() {
      let total = 0;
      document.querySelectorAll("[data-shlc-saving]:checked").forEach((checkbox) => {
        const action = actions.find((item) => item.id === checkbox.dataset.shlcSaving);
        total += Number(action?.monthlySaving || 0);
      });
      if (totalEl) totalEl.textContent = formatWon(total);
      if (annualEl) annualEl.textContent = `연간 ${formatWon(total * 12)}`;
    }

    document.querySelectorAll("[data-shlc-saving]").forEach((checkbox) => checkbox.addEventListener("change", update));
    update();
  }

  renderCostDonut();
  bindBudgetTabs();
  bindSavingChecklist();
})();
