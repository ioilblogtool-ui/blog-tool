import { buildDefaultOptions, formatKRW, CHART_COLORS } from "./chart-config.js";

const dataEl = document.getElementById("ubc-data");
const data = JSON.parse(dataEl.textContent || "{}");
const { exchangeRate, tierOrder, tierMeta, companies } = data;

const usdToKrwMan = (usd) => Math.round((usd * exchangeRate) / 10_000);

const getLevel = (company, tier) => company.levels.find((l) => l.tier === tier);

let tierChart = null;
let stockChart = null;

function renderTierChart(tier) {
  const canvas = document.getElementById("ubcTierChart");
  const labels = companies.map((c) => c.name);
  const dataValues = companies.map((c) => usdToKrwMan(getLevel(c, tier).totalUsd));

  if (tierChart) {
    tierChart.data.labels = labels;
    tierChart.data.datasets[0].data = dataValues;
    tierChart.options.plugins.title.text = `${tierMeta[tier].label} 레벨 총보상 비교 (만원)`;
    tierChart.update();
  } else if (canvas && window.Chart) {
    tierChart = new window.Chart(canvas, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "총보상(만원)",
            data: dataValues,
            backgroundColor: CHART_COLORS.brand,
          },
        ],
      },
      options: buildDefaultOptions({
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: `${tierMeta[tier].label} 레벨 총보상 비교 (만원)`,
          },
          tooltip: {
            backgroundColor: "rgba(23,32,51,0.88)",
            callbacks: {
              label: (ctx) => `${formatKRW(ctx.raw * 10_000)}원`,
            },
          },
        },
        scales: {
          y: {
            ticks: { callback: (value) => formatKRW(value * 10_000) },
          },
        },
      }),
    });
  }
}

function renderStockChart() {
  const canvas = document.getElementById("ubcStockChart");
  const labels = companies.map((c) => c.name);
  const seniorLevels = companies.map((c) => getLevel(c, "senior"));
  const baseData = seniorLevels.map((l) => usdToKrwMan(l.baseUsd));
  const stockData = seniorLevels.map((l) => usdToKrwMan(l.stockUsd));
  const bonusData = seniorLevels.map((l) => usdToKrwMan(l.bonusUsd));

  if (canvas && window.Chart && !stockChart) {
    stockChart = new window.Chart(canvas, {
      type: "bar",
      data: {
        labels,
        datasets: [
          { label: "Base", data: baseData, backgroundColor: CHART_COLORS.brand, stack: "comp" },
          { label: "Stock", data: stockData, backgroundColor: CHART_COLORS.accent, stack: "comp" },
          { label: "Bonus", data: bonusData, backgroundColor: CHART_COLORS.warning, stack: "comp" },
        ],
      },
      options: buildDefaultOptions({
        plugins: {
          legend: { display: true, position: "bottom" },
          title: {
            display: true,
            text: "시니어 레벨 보상 구성 비교 (만원)",
          },
          tooltip: {
            backgroundColor: "rgba(23,32,51,0.88)",
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${formatKRW(ctx.raw * 10_000)}원`,
            },
          },
        },
        scales: {
          x: { stacked: true },
          y: {
            stacked: true,
            ticks: { callback: (value) => formatKRW(value * 10_000) },
          },
        },
      }),
    });
  }
}

function handleTabClick(event) {
  const btn = event.currentTarget;
  const tier = btn.getAttribute("data-tier-tab");
  document.querySelectorAll(".ubc-tab-btn").forEach((el) => el.classList.remove("is-active"));
  btn.classList.add("is-active");
  renderTierChart(tier);
}

document.querySelectorAll(".ubc-tab-btn").forEach((btn) => {
  btn.addEventListener("click", handleTabClick);
});

renderTierChart("senior");
renderStockChart();
