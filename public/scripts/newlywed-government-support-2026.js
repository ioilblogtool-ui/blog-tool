(function () {
  const root = document.getElementById("ngs-scenario-result");
  if (!root) return;

  let scenarios = [];
  let supports = [];
  let badgeLabels = {};

  function parseJson(value, fallback) {
    try {
      return JSON.parse(value || "");
    } catch (_error) {
      return fallback;
    }
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function parseData() {
    scenarios = parseJson(root.dataset.scenarios, []);
    supports = parseJson(root.dataset.supports, []);
    badgeLabels = parseJson(root.dataset.badgeLabels, {});
  }

  function findScenario(id) {
    return scenarios.find((scenario) => scenario.id === id) || scenarios[0];
  }

  function findSupport(id) {
    return supports.find((support) => support.id === id);
  }

  function renderRecommendedCards(scenario) {
    const grid = document.getElementById("ngs-recommend-grid");
    if (!grid || !scenario) return;

    grid.innerHTML = scenario.recommendedSupportIds
      .map(findSupport)
      .filter(Boolean)
      .map((item) => {
        const badgeLabel = badgeLabels[item.badge] || item.badge;
        return `
          <article class="ngs-recommend-card">
            <span class="ngs-badge ngs-badge--${escapeHtml(item.badge)}">${escapeHtml(badgeLabel)}</span>
            <strong>${escapeHtml(item.shortTitle)}</strong>
            <p>${escapeHtml(item.summary)}</p>
            <small>${escapeHtml(item.timing)}</small>
          </article>
        `;
      })
      .join("");
  }

  function updateScenario(id) {
    const scenario = findScenario(id);
    if (!scenario) return;

    const title = document.getElementById("ngs-scenario-title");
    const description = document.getElementById("ngs-scenario-description");
    const caution = document.getElementById("ngs-scenario-caution");
    const cta = document.getElementById("ngs-scenario-cta");

    if (title) title.textContent = scenario.label;
    if (description) description.textContent = scenario.description;
    if (caution) caution.textContent = scenario.caution;
    if (cta) {
      cta.textContent = scenario.ctaLabel;
      cta.setAttribute("href", scenario.ctaHref);
      if (scenario.ctaHref.startsWith("http")) {
        cta.setAttribute("target", "_blank");
        cta.setAttribute("rel", "noopener noreferrer");
      } else {
        cta.removeAttribute("target");
        cta.removeAttribute("rel");
      }
    }

    renderRecommendedCards(scenario);

    document.querySelectorAll(".ngs-scenario-tab").forEach((tab) => {
      const isActive = tab.dataset.scenarioId === scenario.id;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  }

  function initScenarioTabs() {
    document.querySelectorAll(".ngs-scenario-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        updateScenario(tab.dataset.scenarioId);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    parseData();
    initScenarioTabs();
  });
})();
