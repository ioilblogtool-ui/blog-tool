const dataNode = document.getElementById("ssf-data");
const currencyToggle = document.getElementById("ssf-currency-toggle");
const metricSelect = document.getElementById("ssf-metric-select");
const companyFilter = document.getElementById("ssf-company-filter");
const scenarioTabs = document.getElementById("ssf-scenario-tabs");
const scenarioBoard = document.getElementById("ssf-scenario-board");
const liveNote = document.getElementById("ssf-live-note");
const data = dataNode ? JSON.parse(dataNode.textContent || "{}") : {};

const state = {
  currency: "native",
  metric: "operatingProfit",
  scenario: "base",
  companyType: "all",
};

const labels = {
  native: "원통화",
  krw: "원화 환산",
  usd: "달러 환산",
  bear: "보수",
  base: "기준",
  bull: "낙관",
};

const getCompany = (slug) => data.companies?.find((company) => company.slug === slug);

const formatNativeCurrency = (value, currency) => {
  if (currency === "KRW") return `${value.toLocaleString("ko-KR", { maximumFractionDigits: 1 })}조원`;
  if (currency === "USD") return `$${value.toLocaleString("ko-KR", { maximumFractionDigits: 1 })}B`;
  return `NT$${value.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}조`;
};

const convertToKrw = (value, currency) => {
  if (currency === "KRW") return value;
  if (currency === "USD") return (value * data.fx.usdKrw) / 1000;
  return value * data.fx.twdKrw;
};

const convertToUsd = (value, currency) => {
  if (currency === "USD") return value;
  if (currency === "KRW") return (value * 1000) / data.fx.usdKrw;
  return value * data.fx.twdUsd * 1000;
};

const formatValue = (value, currency) => {
  if (state.currency === "krw") return `약 ${convertToKrw(value, currency).toLocaleString("ko-KR", { maximumFractionDigits: 1 })}조원`;
  if (state.currency === "usd") return `약 $${convertToUsd(value, currency).toLocaleString("ko-KR", { maximumFractionDigits: 1 })}B`;
  return formatNativeCurrency(value, currency);
};

const setActive = (container, attr, value) => {
  container?.querySelectorAll("button").forEach((button) => {
    const active = button.dataset[attr] === value;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
};

const updateCurrencyCells = () => {
  document.querySelectorAll("[data-native][data-krw][data-usd]").forEach((cell) => {
    cell.textContent = cell.dataset[state.currency] || cell.dataset.native;
  });
  if (liveNote) liveNote.textContent = `${labels[state.currency]} 기준 전망치를 표시 중입니다.`;
};

const updateCompanyFilter = () => {
  document.querySelectorAll("[data-company-type]").forEach((node) => {
    const type = node.dataset.companyType;
    const visible = state.companyType === "all" || type === state.companyType;
    node.hidden = !visible;
  });
};

const scenarioHtml = () => {
  const items = data.scenarios?.filter((scenario) => scenario.scenario === state.scenario) || [];
  return items.map((scenario) => {
    const company = getCompany(scenario.companySlug);
    if (!company) return "";
    return `
      <article class="ssf-scenario-card" data-company-type="${company.businessType}">
        <span>${labels[scenario.scenario]} 시나리오</span>
        <h3>${company.shortName}</h3>
        <strong>${formatValue(scenario.impliedMarketCap, company.currency)}</strong>
        <p>2028E 영업이익 ${formatValue(scenario.operatingProfit, company.currency)} × ${String(scenario.targetMultiple).replace(".0", "")}배</p>
        <ul>${scenario.assumptions.map((item) => `<li>${item}</li>`).join("")}</ul>
      </article>
    `;
  }).join("");
};

const updateScenario = () => {
  if (scenarioBoard) scenarioBoard.innerHTML = scenarioHtml();
  updateCompanyFilter();
};

currencyToggle?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-currency]");
  if (!button) return;
  state.currency = button.dataset.currency;
  setActive(currencyToggle, "currency", state.currency);
  updateCurrencyCells();
  updateScenario();
});

metricSelect?.addEventListener("change", (event) => {
  state.metric = event.target.value;
  if (liveNote) liveNote.textContent = `${labels[state.currency]} 기준 ${event.target.options[event.target.selectedIndex].text} 지표를 확인 중입니다.`;
});

companyFilter?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-company-type]");
  if (!button) return;
  state.companyType = button.dataset.companyType;
  setActive(companyFilter, "companyType", state.companyType);
  updateCompanyFilter();
});

scenarioTabs?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-scenario]");
  if (!button) return;
  state.scenario = button.dataset.scenario;
  setActive(scenarioTabs, "scenario", state.scenario);
  updateScenario();
});

updateCurrencyCells();
updateCompanyFilter();
