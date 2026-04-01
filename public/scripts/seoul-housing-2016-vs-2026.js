import { buildDefaultOptions } from "./chart-config.js";

const dataEl = document.getElementById("seoulHousing2016Vs2026Data");
const seed = dataEl ? JSON.parse(dataEl.textContent || "{}") : null;

if (!seed || !window.Chart) {
  console.warn("Seoul housing report data or Chart.js not available.");
}

const $ = (id) => document.getElementById(id);

const state = {
  secondaryChartMode: "jeonse",
};

const chartMap = {
  jeonse: {
    label: "서울 평균 전세가",
    values: seed?.coreSeries?.map((item) => item.jeonseEok) || [],
    unit: "억원",
    color: "#2563eb",
    desc: "서울 평균 전세가의 10년 변화를 기준으로 보고 있습니다.",
  },
  rentDeposit: {
    label: "서울 평균 월세 보증금",
    values: seed?.coreSeries?.map((item) => item.rentDepositEok) || [],
    unit: "억원",
    color: "#0f766e",
    desc: "서울 평균 월세 보증금의 10년 변화를 기준으로 보고 있습니다.",
  },
  rentMonthly: {
    label: "서울 평균 월세",
    values: seed?.coreSeries?.map((item) => item.rentMonthlyManwon) || [],
    unit: "만원",
    color: "#dc2626",
    desc: "서울 평균 월세의 10년 변화를 기준으로 보고 있습니다.",
  },
};

const labels = seed?.coreSeries?.map((item) => String(item.year)) || [];
let mainChart;
let secondaryChart;

function makeMainChart() {
  const canvas = $("housingMainChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  mainChart = new window.Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          type: "line",
          label: "서울 평균 매매가",
          data: seed.coreSeries.map((item) => item.saleEok),
          borderColor: "#ef4444",
          backgroundColor: "rgba(239, 68, 68, 0.18)",
          tension: 0.32,
          yAxisID: "y",
        },
        {
          type: "bar",
          label: "PIR",
          data: seed.coreSeries.map((item) => item.pir),
          backgroundColor: "rgba(59, 130, 246, 0.68)",
          borderRadius: 8,
          yAxisID: "y1",
        },
      ],
    },
    options: buildDefaultOptions({
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "매매가 (억원)" },
        },
        y1: {
          beginAtZero: true,
          position: "right",
          grid: { drawOnChartArea: false },
          title: { display: true, text: "PIR (배)" },
        },
      },
    }),
  });
}

function makeSecondaryChart() {
  const canvas = $("housingSecondaryChart");
  if (!canvas) return;
  const current = chartMap[state.secondaryChartMode];
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
          tension: 0.32,
          fill: true,
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
  const current = chartMap[state.secondaryChartMode];
  secondaryChart.data.datasets[0].label = current.label;
  secondaryChart.data.datasets[0].data = current.values;
  secondaryChart.data.datasets[0].borderColor = current.color;
  secondaryChart.data.datasets[0].backgroundColor = `${current.color}22`;
  secondaryChart.options.scales.y.title.text = current.unit;
  secondaryChart.update("none");
  const desc = $("housingSecondaryChartDesc");
  if (desc) desc.textContent = current.desc;
}

function calcFeelings(income) {
  const safeIncome = Math.max(Number(income) || 0, 1);
  const defaults = seed.calculatorDefaults;
  const sale2016Years = (defaults.avgSale2016Manwon / safeIncome).toFixed(1);
  const sale2026Years = (defaults.avgSale2026Manwon / safeIncome).toFixed(1);
  const jeonse2026Years = (defaults.avgJeonse2026Manwon / safeIncome).toFixed(1);
  const annualRent = defaults.avgMonthlyRent2026Manwon * 12;
  const annualRentShare = Math.round((annualRent / safeIncome) * 100);

  return { sale2016Years, sale2026Years, jeonse2026Years, annualRent, annualRentShare };
}

function renderFeelings() {
  const input = $("housingSalaryInput");
  if (!input) return;
  const result = calcFeelings(input.value);
  const sale2016 = $("housingFeelSale2016");
  const sale2026 = $("housingFeelSale2026");
  const jeonse2026 = $("housingFeelJeonse2026");
  const rent2026 = $("housingFeelRent2026");
  const rent2026Sub = $("housingFeelRent2026Sub");

  if (sale2016) sale2016.textContent = `${result.sale2016Years}배`;
  if (sale2026) sale2026.textContent = `${result.sale2026Years}배`;
  if (jeonse2026) jeonse2026.textContent = `${result.jeonse2026Years}배`;
  if (rent2026) rent2026.textContent = `${result.annualRent.toLocaleString("ko-KR")}만원`;
  if (rent2026Sub) rent2026Sub.textContent = `연봉의 ${result.annualRentShare}%`;
}

function bindTabs() {
  document.querySelectorAll("[data-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.secondaryChartMode = button.dataset.mode;
      document.querySelectorAll("[data-mode]").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      updateSecondaryChart();
    });
  });
}

function bindInputs() {
  $("housingSalaryInput")?.addEventListener("input", renderFeelings);
}

if (seed && window.Chart) {
  makeMainChart();
  makeSecondaryChart();
  bindTabs();
  bindInputs();
  renderFeelings();
}
