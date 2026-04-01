import { buildDefaultOptions } from "./chart-config.js";

const dataEl = document.getElementById("salaryAsset2016Vs2026Data");
const seed = dataEl ? JSON.parse(dataEl.textContent || "{}") : null;

if (!seed || !window.Chart) {
  console.warn("Salary asset report data or Chart.js not available.");
}

const $ = (id) => document.getElementById(id);

const state = {
  chartMode: "average",
};

const labels = seed?.averageSeries?.map((item) => String(item.year)) || [];
let primaryChart;
let ageChart;

const chartConfigs = {
  average: {
    title: "평균 연봉과 평균 자산 추이를 보고 있습니다.",
  },
  index: {
    title: "2016=100 기준 연봉·자산·서울 집값 지수를 보고 있습니다.",
  },
};

function createPrimaryChart() {
  const canvas = $("salaryAssetPrimaryChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  primaryChart = new window.Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "평균 연봉",
          data: seed.averageSeries.map((item) => item.averageSalaryManwon),
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.18)",
          tension: 0.32,
          yAxisID: "y",
        },
        {
          label: "평균 자산",
          data: seed.averageSeries.map((item) => item.averageAssetEok),
          borderColor: "#0f766e",
          backgroundColor: "rgba(15, 118, 110, 0.18)",
          tension: 0.32,
          yAxisID: "y1",
        },
      ],
    },
    options: buildDefaultOptions({
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "평균 연봉 (만원)" },
        },
        y1: {
          beginAtZero: true,
          position: "right",
          grid: { drawOnChartArea: false },
          title: { display: true, text: "평균 자산 (억원)" },
        },
      },
    }),
  });
}

function updatePrimaryChart() {
  if (!primaryChart) return;
  const desc = $("salaryAssetPrimaryChartDesc");

  if (state.chartMode === "average") {
    primaryChart.config.type = "line";
    primaryChart.data.labels = labels;
    primaryChart.data.datasets = [
      {
        label: "평균 연봉",
        data: seed.averageSeries.map((item) => item.averageSalaryManwon),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.18)",
        tension: 0.32,
        yAxisID: "y",
      },
      {
        label: "평균 자산",
        data: seed.averageSeries.map((item) => item.averageAssetEok),
        borderColor: "#0f766e",
        backgroundColor: "rgba(15, 118, 110, 0.18)",
        tension: 0.32,
        yAxisID: "y1",
      },
    ];
    primaryChart.options.scales.y.title.text = "평균 연봉 (만원)";
    primaryChart.options.scales.y1.display = true;
    primaryChart.options.scales.y1.title.text = "평균 자산 (억원)";
    primaryChart.options.scales.y1.grid.drawOnChartArea = false;
  } else {
    primaryChart.config.type = "line";
    primaryChart.data.labels = labels;
    primaryChart.data.datasets = [
      {
        label: "중위 연봉 지수",
        data: seed.indexSeries.map((item) => item.salaryIndex),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.16)",
        tension: 0.32,
        yAxisID: "y",
      },
      {
        label: "중위 자산 지수",
        data: seed.indexSeries.map((item) => item.assetIndex),
        borderColor: "#0f766e",
        backgroundColor: "rgba(15, 118, 110, 0.16)",
        tension: 0.32,
        yAxisID: "y",
      },
      {
        label: "서울 집값 지수",
        data: seed.indexSeries.map((item) => item.housingIndex),
        borderColor: "#dc2626",
        backgroundColor: "rgba(220, 38, 38, 0.16)",
        tension: 0.32,
        yAxisID: "y",
      },
    ];
    primaryChart.options.scales.y.title.text = "지수 (2016=100)";
    primaryChart.options.scales.y1.display = false;
  }

  if (desc) desc.textContent = chartConfigs[state.chartMode].title;
  primaryChart.update();
}

function createAgeChart() {
  const canvas = $("salaryAssetAgeChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ageChart = new window.Chart(ctx, {
    type: "bar",
    data: {
      labels: seed.ageRows.map((item) => item.age),
      datasets: [
        {
          label: "2016 자산",
          data: seed.ageRows.map((item) => item.asset2016Eok),
          backgroundColor: "rgba(148, 163, 184, 0.8)",
          borderRadius: 8,
        },
        {
          label: "2026 자산",
          data: seed.ageRows.map((item) => item.asset2026Eok),
          backgroundColor: "rgba(15, 118, 110, 0.82)",
          borderRadius: 8,
        },
      ],
    },
    options: buildDefaultOptions({
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "자산 (억원)" },
        },
      },
    }),
  });
}

function calcFeelings(income, savingRate) {
  const safeIncome = Math.max(Number(income) || 0, 1);
  const rate = Math.min(Math.max(Number(savingRate) || 0, 0), 100);
  const annualSaving = Math.round(safeIncome * (rate / 100));
  const tenYearSaving = annualSaving * 10;
  const houseGapManwon = Math.max(seed.calculatorDefaults.seoulAvgHouse2026Manwon - tenYearSaving, 0);
  const jeonseYears = (seed.calculatorDefaults.seoulAvgJeonse2026Manwon / Math.max(annualSaving, 1)).toFixed(1);
  const houseMultiple = (seed.calculatorDefaults.seoulAvgHouse2026Manwon / safeIncome).toFixed(1);

  let salaryPosition = "하위 25% 구간";
  if (safeIncome >= 14500) salaryPosition = "상위 5% 안쪽";
  else if (safeIncome >= 10200) salaryPosition = "상위 10% 안쪽";
  else if (safeIncome >= 6500) salaryPosition = "상위 25% 안쪽";
  else if (safeIncome >= 3910) salaryPosition = "중위권 이상";
  else if (safeIncome >= 2250) salaryPosition = "중위권 아래";

  return { annualSaving, tenYearSaving, houseGapManwon, jeonseYears, houseMultiple, salaryPosition };
}

function renderFeelings() {
  const incomeInput = $("salaryAssetIncomeInput");
  const savingRateInput = $("salaryAssetSavingRateInput");
  if (!incomeInput || !savingRateInput) return;

  const result = calcFeelings(incomeInput.value, savingRateInput.value);
  $("salaryAssetPosition").textContent = result.salaryPosition;
  $("salaryAssetSaving").textContent = `${result.tenYearSaving.toLocaleString("ko-KR")}만원`;
  $("salaryAssetHouseGap").textContent = `${result.houseGapManwon.toLocaleString("ko-KR")}만원`;
  $("salaryAssetJeonseYears").textContent = `${result.jeonseYears}년`;
  $("salaryAssetHouseMultiple").textContent = `${result.houseMultiple}배`;
  $("salaryAssetSavingRateValue").textContent = `${Number(savingRateInput.value)}%`;
}

function bindTabs() {
  document.querySelectorAll("[data-chart-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.chartMode = button.dataset.chartMode;
      document.querySelectorAll("[data-chart-mode]").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      updatePrimaryChart();
    });
  });
}

function bindInputs() {
  $("salaryAssetIncomeInput")?.addEventListener("input", renderFeelings);
  $("salaryAssetSavingRateInput")?.addEventListener("input", renderFeelings);
}

if (seed && window.Chart) {
  createPrimaryChart();
  createAgeChart();
  bindTabs();
  bindInputs();
  renderFeelings();
}
