import { buildDefaultOptions } from "./chart-config.js";

const dataEl = document.getElementById("bitcoinGoldSp5002026Data");
const seed = dataEl ? JSON.parse(dataEl.textContent || "{}") : null;

if (!seed || !window.Chart) {
  console.warn("Asset comparison report data or Chart.js not available.");
}

const $ = (id) => document.getElementById(id);

const state = {
  compareMode: seed?.calculatorDefaults?.compareMode || "growth",
  investmentAmount: seed?.calculatorDefaults?.investmentAmount || 1000000,
  allocationPreset: seed?.calculatorDefaults?.allocationPreset || "balanced",
};

let primaryChart;

const chartDescriptions = {
  growth: "기본 보기에서는 2016=100 성장 곡선을 로그 스케일로 보여줍니다.",
  drawdown: "최대 낙폭은 더 많이 벌었는가보다 얼마나 크게 흔들렸는가를 보여줍니다.",
  recovery: "회복 기간은 고점에서 다시 원금권을 되찾는 데 얼마나 오래 걸렸는지 보여줍니다.",
  real: "명목 수익, 실질 수익, 세후 추정 수익을 나란히 두면 체감 차이가 더 선명해집니다.",
};

function formatWon(value) {
  const safe = Math.round(Number(value) || 0);
  if (safe >= 100000000) {
    return `${(safe / 100000000).toFixed(1)}억원`;
  }
  if (safe >= 10000) {
    return `${Math.round(safe / 10000).toLocaleString("ko-KR")}만원`;
  }
  return `${safe.toLocaleString("ko-KR")}원`;
}

function calcOutcome(amount, asset) {
  const safeAmount = Math.max(Number(amount) || 0, 0);
  const multiple = asset.endValue / asset.startValue;
  const finalAmount = Math.round(safeAmount * multiple);
  return {
    finalAmount,
    profitAmount: finalAmount - safeAmount,
    multiple,
  };
}

function syncQuery() {
  const url = new URL(window.location.href);
  url.searchParams.set("mode", state.compareMode);
  url.searchParams.set("amount", String(state.investmentAmount));
  url.searchParams.set("preset", state.allocationPreset);
  window.history.replaceState({}, "", url);
}

function applyPresetCardState() {
  document.querySelectorAll("[data-preset-card]").forEach((card) => {
    card.classList.toggle("is-active", card.dataset.presetCard === state.allocationPreset);
  });
}

function getPrimaryConfig() {
  const labels = seed.growthSeries.map((item) => String(item.year));

  if (state.compareMode === "growth") {
    return {
      type: "line",
      data: {
        labels,
        datasets: seed.snapshots.map((asset) => ({
          label: asset.label,
          data: seed.growthSeries.map((item) => item[asset.id]),
          borderColor: asset.color,
          backgroundColor: `${asset.color}22`,
          tension: 0.3,
          yAxisID: "y",
        })),
      },
      options: buildDefaultOptions({
        plugins: {
          legend: { display: true, position: "bottom" },
        },
        scales: {
          y: {
            type: "logarithmic",
            min: 100,
            title: { display: true, text: "지수 (2016=100, 로그)" },
          },
        },
      }),
    };
  }

  if (state.compareMode === "drawdown") {
    return {
      type: "bar",
      data: {
        labels: seed.snapshots.map((asset) => asset.label),
        datasets: [
          {
            label: "최대 낙폭",
            data: seed.snapshots.map((asset) => asset.mdd),
            backgroundColor: seed.snapshots.map((asset) => asset.color),
            borderRadius: 10,
          },
        ],
      },
      options: buildDefaultOptions({
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            max: 0,
            title: { display: true, text: "MDD (%)" },
          },
        },
      }),
    };
  }

  if (state.compareMode === "recovery") {
    return {
      type: "bar",
      data: {
        labels: seed.snapshots.map((asset) => asset.label),
        datasets: [
          {
            label: "회복 기간",
            data: seed.snapshots.map((asset) => asset.recoveryMonths ?? 0),
            backgroundColor: seed.snapshots.map((asset) => asset.color),
            borderRadius: 10,
          },
        ],
      },
      options: buildDefaultOptions({
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "개월" },
          },
        },
      }),
    };
  }

  return {
    type: "bar",
    data: {
      labels: seed.snapshots.map((asset) => asset.label),
      datasets: [
        {
          label: "명목 수익률",
          data: seed.snapshots.map((asset) => asset.totalReturnRate),
          backgroundColor: seed.snapshots.map((asset) => `${asset.color}bb`),
          borderRadius: 8,
        },
        {
          label: "실질 수익률",
          data: seed.snapshots.map((asset) => asset.inflationAdjustedReturnRate),
          backgroundColor: "#1f9d74",
          borderRadius: 8,
        },
        {
          label: "세후 추정",
          data: seed.snapshots.map((asset) => asset.afterTaxReturnRate),
          backgroundColor: "#c26a18",
          borderRadius: 8,
        },
      ],
    },
      options: buildDefaultOptions({
      plugins: {
        legend: { display: true, position: "bottom" },
      },
      scales: {
        y: {
          type: "logarithmic",
          min: 1,
          title: { display: true, text: "수익률 (%) - 로그" },
        },
      },
    }),
  };
}

function renderPrimaryChart() {
  const canvas = $("assetComparisonPrimaryChart");
  if (!canvas || !window.Chart) return;

  if (primaryChart) {
    primaryChart.destroy();
  }

  const config = getPrimaryConfig();
  primaryChart = new window.Chart(canvas.getContext("2d"), config);
  const desc = $("assetComparisonChartDesc");
  if (desc) desc.textContent = chartDescriptions[state.compareMode];
}

function renderSimulation() {
  const tbody = $("assetComparisonSimulationBody");
  if (!tbody) return;

  const rows = seed.snapshots
    .map((asset) => ({ asset, ...calcOutcome(state.investmentAmount, asset) }))
    .sort((a, b) => b.finalAmount - a.finalAmount);

  tbody.innerHTML = rows
    .map(
      ({ asset, finalAmount, profitAmount, multiple }) => `
        <tr>
          <td>${asset.label}</td>
          <td class="is-current">${formatWon(finalAmount)}</td>
          <td>${formatWon(profitAmount)}</td>
          <td>${multiple.toFixed(1)}배</td>
        </tr>`,
    )
    .join("");

  const top = rows[0];
  $("assetComparisonTopAsset").textContent = top.asset.label;
  $("assetComparisonTopValue").textContent = formatWon(top.finalAmount);
  $("assetComparisonTopProfit").textContent = formatWon(top.profitAmount);
}

function bindModeTabs() {
  document.querySelectorAll("[data-compare-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.compareMode = button.dataset.compareMode;
      document.querySelectorAll("[data-compare-mode]").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      renderPrimaryChart();
      syncQuery();
    });
  });
}

function bindAmountControls() {
  const amountInput = $("assetComparisonAmountInput");
  if (amountInput) {
    amountInput.addEventListener("input", () => {
      state.investmentAmount = Math.max(Number(amountInput.value) || 0, 0);
      document.querySelectorAll("[data-amount]").forEach((button) => {
        button.classList.toggle("is-active", Number(button.dataset.amount) === state.investmentAmount);
      });
      renderSimulation();
      syncQuery();
    });
  }

  document.querySelectorAll("[data-amount]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextAmount = Number(button.dataset.amount) || 0;
      state.investmentAmount = nextAmount;
      if (amountInput) amountInput.value = String(nextAmount);
      document.querySelectorAll("[data-amount]").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      renderSimulation();
      syncQuery();
    });
  });
}

function bindPresetCards() {
  document.querySelectorAll("[data-preset-card]").forEach((card) => {
    card.addEventListener("click", () => {
      state.allocationPreset = card.dataset.presetCard;
      applyPresetCardState();
      syncQuery();
    });
  });
}

function readQuery() {
  const url = new URL(window.location.href);
  const mode = url.searchParams.get("mode");
  const amount = Number(url.searchParams.get("amount"));
  const preset = url.searchParams.get("preset");

  if (["growth", "drawdown", "recovery", "real"].includes(mode)) {
    state.compareMode = mode;
  }
  if (Number.isFinite(amount) && amount > 0) {
    state.investmentAmount = amount;
  }
  if (["aggressive", "balanced", "defensive"].includes(preset)) {
    state.allocationPreset = preset;
  }

  document.querySelectorAll("[data-compare-mode]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.compareMode === state.compareMode);
  });
  document.querySelectorAll("[data-amount]").forEach((button) => {
    button.classList.toggle("is-active", Number(button.dataset.amount) === state.investmentAmount);
  });
  if ($("assetComparisonAmountInput")) {
    $("assetComparisonAmountInput").value = String(state.investmentAmount);
  }
  applyPresetCardState();
}

if (seed && window.Chart) {
  readQuery();
  bindModeTabs();
  bindAmountControls();
  bindPresetCards();
  renderPrimaryChart();
  renderSimulation();
}
