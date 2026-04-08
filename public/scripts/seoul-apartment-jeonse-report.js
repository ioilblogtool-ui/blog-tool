import { buildDefaultOptions } from "./chart-config.js";

const dataEl = document.getElementById("seoulApartmentJeonseReportData");
const seed = dataEl ? JSON.parse(dataEl.textContent || "{}") : null;

if (!seed) {
  console.warn("Seoul apartment jeonse report data not available.");
}

const $ = (id) => document.getElementById(id);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const state = {
  districtKey: seed?.districtCards?.[0]?.key || "gangseo",
  budgetMode: "deposit",
  secondaryChartMode: "jeonse",
};

let marketChart;
let secondaryChart;

function findScenario(value) {
  const amount = Number(value) || 0;
  return (
    seed?.budgetScenarios?.find((scenario) => amount >= scenario.budgetMin && amount <= scenario.budgetMax) ||
    seed?.budgetScenarios?.[0] ||
    null
  );
}

function findDistrict(key) {
  return seed?.districtCards?.find((item) => item.key === key) || seed?.districtCards?.[0] || null;
}

function makeMarketChart() {
  const canvas = $("jrMarketChart");
  if (!canvas || !window.Chart || !seed?.marketSeries?.length) return;

  const labels = seed.marketSeries.map((item) => String(item.year));
  const ctx = canvas.getContext("2d");

  marketChart = new window.Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          type: "line",
          label: "서울 평균 전세가",
          data: seed.marketSeries.map((item) => item.jeonseEok),
          borderColor: "#0f766e",
          backgroundColor: "rgba(15, 118, 110, 0.14)",
          tension: 0.32,
          fill: true,
          yAxisID: "y",
        },
        {
          type: "bar",
          label: "전세 비중",
          data: seed.marketSeries.map((item) => item.jeonseShare),
          backgroundColor: "rgba(217, 119, 6, 0.72)",
          borderRadius: 8,
          yAxisID: "y1",
        },
      ],
    },
    options: buildDefaultOptions({
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "전세가 (억원)" },
        },
        y1: {
          beginAtZero: true,
          position: "right",
          grid: { drawOnChartArea: false },
          title: { display: true, text: "전세 비중 (%)" },
        },
      },
    }),
  });
}

const secondaryChartMap = {
  jeonse: {
    label: "서울 평균 전세가",
    values: seed?.marketSeries?.map((item) => item.jeonseEok) || [],
    unit: "억원",
    color: "#0f766e",
    desc: "서울 평균 전세가 흐름입니다. 큰 보증금이 필요한 구조가 계속 올라온다는 점을 보여줍니다.",
    badge: "전세가 (억원)",
  },
  semiJeonse: {
    label: "대표 반전세 월세",
    values: seed?.marketSeries?.map((item) => item.semiJeonseMonthlyManwon) || [],
    unit: "만원",
    color: "#0ea5e9",
    desc: "반전세는 보증금을 일부 낮추는 대신 월 고정비가 붙는 구조라, 전세가 어려울수록 같이 검토되는 구간이 커집니다.",
    badge: "반전세 월세 (만원)",
  },
  wolse: {
    label: "서울 평균 월세",
    values: seed?.marketSeries?.map((item) => item.rentMonthlyManwon) || [],
    unit: "만원",
    color: "#dc2626",
    desc: "서울 평균 월세 흐름입니다. 보증금 장벽은 낮아 보여도 월 현금 유출 부담이 꾸준히 커졌다는 점을 보여줍니다.",
    badge: "월세 (만원)",
  },
};

function makeSecondaryChart() {
  const canvas = $("jrSecondaryChart");
  if (!canvas || !window.Chart || !seed?.marketSeries?.length) return;

  const current = secondaryChartMap[state.secondaryChartMode];
  const labels = seed.marketSeries.map((item) => String(item.year));
  const ctx = canvas.getContext("2d");

  secondaryChart = new window.Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: current.label,
          data: current.values,
          borderColor: current.color,
          backgroundColor: `${current.color}22`,
          fill: true,
          tension: 0.32,
        },
      ],
    },
    options: buildDefaultOptions({
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: current.unit },
        },
      },
    }),
  });
}

function updateSecondaryChart() {
  if (!secondaryChart) return;
  const current = secondaryChartMap[state.secondaryChartMode];
  secondaryChart.data.datasets[0].label = current.label;
  secondaryChart.data.datasets[0].data = current.values;
  secondaryChart.data.datasets[0].borderColor = current.color;
  secondaryChart.data.datasets[0].backgroundColor = `${current.color}22`;
  secondaryChart.options.scales.y.title.text = current.unit;
  secondaryChart.update("none");

  const desc = $("jrSecondaryChartDesc");
  const unit = $("jrSecondaryChartUnit");
  if (desc) desc.textContent = current.desc;
  if (unit) unit.textContent = current.badge;
}

function renderDistrict() {
  const district = findDistrict(state.districtKey);
  if (!district) return;

  const name = $("jrDistrictName");
  const tagline = $("jrDistrictTagline");
  const commute = $("jrDistrictCommute");
  const summary = $("jrDistrictSummary");
  const thenNow = $("jrDistrictThenNow");
  const compromise = $("jrDistrictCompromise");

  if (name) name.textContent = district.name;
  if (tagline) tagline.textContent = district.tagline;
  if (commute) commute.textContent = district.commuteFit;
  if (summary) summary.textContent = district.summary;
  if (thenNow) thenNow.innerHTML = `<strong>예전 vs 지금</strong> ${district.thenVsNow}`;
  if (compromise) compromise.innerHTML = `<strong>양보 포인트</strong> ${district.compromise.join(", ")}`;

  $$('[data-district-key]').forEach((button) => {
    button.classList.toggle("is-active", button.dataset.districtKey === district.key);
  });

  $$('[data-district-panel]').forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.districtPanel === district.key);
  });
}

function renderBudget() {
  const input = $("jrBudgetInput");
  const scenario = findScenario(input?.value);
  if (!scenario) return;

  const guide = $("jrScenarioGuide");
  const cta = $("jrScenarioCta");
  const jeonse = $("jrResultJeonse");
  const semiJeonse = $("jrResultSemiJeonse");
  const wolse = $("jrResultWolse");

  const modeSuffix = state.budgetMode === "monthlyTotal"
    ? " 월 고정비 관점으로 보면 전세보다 반전세·월세 해석이 더 중요합니다."
    : " 보증금 기준으로 보면 전세 유지 가능 범위를 먼저 확인하는 편이 좋습니다.";

  if (guide) guide.textContent = scenario.depositGuide;
  if (cta) cta.textContent = `${scenario.recommendedCta}${modeSuffix}`;
  if (jeonse) jeonse.textContent = scenario.jeonseResult;
  if (semiJeonse) semiJeonse.textContent = scenario.semiJeonseResult;
  if (wolse) wolse.textContent = scenario.wolseResult;
}

function bindDistrictButtons() {
  $$('[data-district-key]').forEach((button) => {
    button.addEventListener("click", () => {
      state.districtKey = button.dataset.districtKey || state.districtKey;
      renderDistrict();
    });
  });
}

function bindBudgetControls() {
  $("jrBudgetInput")?.addEventListener("input", renderBudget);

  $$('[data-budget-mode]').forEach((button) => {
    button.addEventListener("click", () => {
      state.budgetMode = button.dataset.budgetMode || "deposit";
      $$('[data-budget-mode]').forEach((item) => {
        item.classList.toggle("is-active", item === button);
      });
      renderBudget();
    });
  });
}

function bindSecondaryTabs() {
  $$('[data-secondary-mode]').forEach((button) => {
    button.addEventListener("click", () => {
      state.secondaryChartMode = button.dataset.secondaryMode || "jeonse";
      $$('[data-secondary-mode]').forEach((item) => {
        item.classList.toggle("is-active", item === button);
      });
      updateSecondaryChart();
    });
  });
}

if (seed) {
  makeMarketChart();
  makeSecondaryChart();
  bindSecondaryTabs();
  bindDistrictButtons();
  bindBudgetControls();
  renderDistrict();
  renderBudget();
}
