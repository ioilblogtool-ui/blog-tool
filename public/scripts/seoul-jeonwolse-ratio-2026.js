import { buildDefaultOptions } from "./chart-config.js";

const dataEl = document.getElementById("seoulJeonwolseRatio2026Data");
const seed = dataEl ? JSON.parse(dataEl.textContent || "{}") : null;

if (!seed) {
  console.warn("Seoul jeonwolse ratio report data not available.");
}

const $ = (id) => document.getElementById(id);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const rankingModes = {
  leaseRatio: {
    topLabel: "전세 비중 높은 순",
    bottomLabel: "전세 비중 낮은 순",
    description: "전세 비중이 많이 남아 있는 구와 빠르게 낮아진 구를 비교합니다.",
    value: (row) => row.leaseRatio2026,
    diff: (row) => row.leaseRatio2026 - row.leaseRatio2021,
    valueSuffix: "%",
    diffSuffix: "%p",
    diffLabel: "2021 대비",
  },
  monthlyGrowth: {
    topLabel: "월세 증가폭 큰 순",
    bottomLabel: "월세 증가폭 작은 순",
    description: "2021 대비 월세 비중이 얼마나 빨리 늘었는지 정렬합니다.",
    value: (row) => row.monthlyRatio2026 - row.monthlyRatio2021,
    diff: (row) => row.monthlyRatio2026,
    valueSuffix: "%p",
    diffSuffix: "%",
    diffLabel: "현재 월세",
  },
  semiMonthlyRatio: {
    topLabel: "반전세 비중 높은 순",
    bottomLabel: "반전세 비중 낮은 순",
    description: "전세와 월세 사이의 혼합형 계약 비중이 높은 구를 보여줍니다.",
    value: (row) => row.semiMonthlyRatio2026,
    diff: (row) => row.conversionRate2026,
    valueSuffix: "%",
    diffSuffix: "%",
    diffLabel: "전환율",
  },
};

const state = {
  district: seed?.districtRows?.[0]?.district || "",
  rankingMode: "leaseRatio",
};

function formatSigned(value, suffix = "") {
  const fixed = Number(value).toFixed(1).replace(/\.0$/, "");
  return `${value > 0 ? "+" : ""}${fixed}${suffix}`;
}

function getDistrict(district) {
  return seed?.districtRows?.find((item) => item.district === district) || seed?.districtRows?.[0];
}

function renderDistrict() {
  const row = getDistrict(state.district);
  if (!row) return;

  $("sjrDistrictName").textContent = row.district;
  $("sjrDistrictLease").textContent = `전세 비중 ${row.leaseRatio2026}%`;
  $("sjrDistrictTags").textContent = row.tags.join(" · ");
  $("sjrDistrictInterpretation").textContent = row.interpretation;
  $("sjrDistrictDelta").innerHTML =
    `<strong>2021 대비</strong> 전세 ${formatSigned(row.leaseRatio2026 - row.leaseRatio2021, "%p")}, 월세 ${formatSigned(row.monthlyRatio2026 - row.monthlyRatio2021, "%p")}`;

  $$("[data-district]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.district === row.district);
  });
}

function createStructureChart() {
  const canvas = $("sjrStructureChart");
  if (!canvas || !window.Chart || !seed?.citySeries?.length) return;

  const years = [seed.citySeries[0], seed.citySeries[seed.citySeries.length - 1]];

  new window.Chart(canvas.getContext("2d"), {
    type: "bar",
    data: {
      labels: years.map((item) => String(item.year)),
      datasets: [
        { label: "전세", data: years.map((item) => item.leaseRatio), backgroundColor: "#0f766e", stack: "share", borderRadius: 10 },
        { label: "월세", data: years.map((item) => item.monthlyRatio), backgroundColor: "#d97706", stack: "share", borderRadius: 10 },
        { label: "반전세", data: years.map((item) => item.semiMonthlyRatio), backgroundColor: "#2563eb", stack: "share", borderRadius: 10 },
      ],
    },
    options: buildDefaultOptions({
      scales: {
        x: { stacked: true },
        y: { stacked: true, beginAtZero: true, max: 100, title: { display: true, text: "비중 (%)" } },
      },
    }),
  });
}

function createTrendChart() {
  const canvas = $("sjrTrendChart");
  if (!canvas || !window.Chart || !seed?.citySeries?.length) return;

  new window.Chart(canvas.getContext("2d"), {
    type: "line",
    data: {
      labels: seed.citySeries.map((item) => String(item.year)),
      datasets: [
        { label: "전세 비중", data: seed.citySeries.map((item) => item.leaseRatio), borderColor: "#0f766e", backgroundColor: "rgba(15, 118, 110, 0.14)", tension: 0.28, fill: false, yAxisID: "y" },
        { label: "월세 비중", data: seed.citySeries.map((item) => item.monthlyRatio), borderColor: "#d97706", backgroundColor: "rgba(217, 119, 6, 0.14)", tension: 0.28, fill: false, yAxisID: "y" },
        { label: "반전세 비중", data: seed.citySeries.map((item) => item.semiMonthlyRatio), borderColor: "#2563eb", backgroundColor: "rgba(37, 99, 235, 0.14)", tension: 0.28, fill: false, yAxisID: "y" },
        { label: "전환율", data: seed.citySeries.map((item) => item.conversionRate), borderColor: "#7c3aed", backgroundColor: "rgba(124, 58, 237, 0.14)", tension: 0.28, fill: false, borderDash: [6, 4], yAxisID: "y1" },
      ],
    },
    options: buildDefaultOptions({
      scales: {
        y: { beginAtZero: true, max: 60, title: { display: true, text: "비중 (%)" } },
        y1: { beginAtZero: true, position: "right", grid: { drawOnChartArea: false }, title: { display: true, text: "전환율 (%)" } },
      },
    }),
  });
}

function sortRows(mode, direction) {
  const config = rankingModes[mode];
  const rows = [...(seed?.districtRows || [])];
  rows.sort((a, b) => config.value(b) - config.value(a));
  return direction === "top" ? rows.slice(0, 5) : rows.slice(-5).reverse();
}

function renderRankingList(containerId, rows, mode) {
  const config = rankingModes[mode];
  const target = $(containerId);
  if (!target) return;

  target.innerHTML = rows
    .map((row, index) => `
      <article class="sjr-ranking-item">
        <span class="sjr-ranking-item__rank">${index + 1}</span>
        <div class="sjr-ranking-item__body">
          <strong>${row.district}</strong>
          <p>${row.interpretation}</p>
        </div>
        <div class="sjr-ranking-item__meta">
          <b>${formatSigned(config.value(row), config.valueSuffix)}</b>
          <small>${config.diffLabel} ${formatSigned(config.diff(row), config.diffSuffix)}</small>
        </div>
      </article>
    `)
    .join("");
}

function renderRanking() {
  const mode = state.rankingMode;
  const config = rankingModes[mode];
  $("sjrRankingDesc").textContent = config.description;
  $("sjrTopMetricLabel").textContent = config.topLabel;
  $("sjrBottomMetricLabel").textContent = config.bottomLabel;
  renderRankingList("sjrTopList", sortRows(mode, "top"), mode);
  renderRankingList("sjrBottomList", sortRows(mode, "bottom"), mode);
}

function bindDistrictButtons() {
  $$("[data-district]").forEach((button) => {
    button.addEventListener("click", () => {
      state.district = button.dataset.district || state.district;
      renderDistrict();
    });
  });
}

function bindRankingTabs() {
  $$("[data-ranking-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.rankingMode = button.dataset.rankingMode || "leaseRatio";
      $$("[data-ranking-mode]").forEach((item) => {
        item.classList.toggle("is-active", item === button);
      });
      renderRanking();
    });
  });
}

if (seed) {
  createStructureChart();
  createTrendChart();
  bindDistrictButtons();
  bindRankingTabs();
  renderDistrict();
  renderRanking();
}
