const marketTabs = document.getElementById("se26MarketTabs");
const chartSeedElement = document.getElementById("se26ChartSeed");

if (marketTabs) {
  marketTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-market-tab]");
    if (!button) return;

    const market = button.getAttribute("data-market-tab") || "all";
    marketTabs.querySelectorAll(".se26-tab-btn").forEach((item) => {
      item.classList.toggle("is-active", item === button);
    });

    document.querySelectorAll("[data-market-row]").forEach((row) => {
      const rowMarket = row.getAttribute("data-market-row");
      row.classList.toggle("is-hidden", !(market === "all" || rowMarket === market));
    });
  });
}

if (chartSeedElement) {
  const seed = JSON.parse(chartSeedElement.textContent || "{}");

  const initAumChart = () => {
    const canvas = document.getElementById("se26AumChart");
    const rows = Array.isArray(seed.etfs) ? seed.etfs : [];
    if (!canvas || !rows.length || !window.Chart) return;

    new window.Chart(canvas, {
      type: "bar",
      data: {
        labels: rows.map((item) => item.ticker),
        datasets: [
          {
            label: "원화 기준 규모(억원)",
            data: rows.map((item) => Number(item.aumKrwBillion || 0)),
            backgroundColor: rows.map((item) => item.market === "US" ? "rgba(30, 64, 175, 0.82)" : "rgba(5, 150, 105, 0.82)"),
            borderRadius: 8,
            maxBarThickness: 40,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label(context) {
                const value = Number(context.raw || 0);
                if (value >= 1000) {
                  return `원화 기준 규모: ${(value / 1000).toFixed(2)}조원`;
                }
                return `원화 기준 규모: ${(value * 10).toFixed(0)}억원`;
              },
            },
          },
        },
        scales: {
          x: {
            ticks: { color: "#4b5563", maxRotation: 45, minRotation: 25 },
            grid: { display: false },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: "#6b7280",
              callback(value) {
                const numeric = Number(value);
                return numeric >= 1000 ? `${(numeric / 1000).toFixed(0)}조` : `${(numeric * 10).toFixed(0)}억`;
              },
            },
            grid: { color: "rgba(219, 212, 202, 0.5)" },
          },
        },
      },
    });
  };

  const initMarketCapChart = () => {
    const canvas = document.getElementById("se26MarketCapChart");
    const rows = Array.isArray(seed.companies) ? seed.companies : [];
    if (!canvas || !rows.length || !window.Chart) return;

    new window.Chart(canvas, {
      type: "bar",
      data: {
        labels: rows.map((item) => item.name),
        datasets: [
          {
            label: "원화 환산 시총(조원)",
            data: rows.map((item) => Number(item.marketCapKrwTrillion || 0)),
            backgroundColor: "rgba(180, 83, 9, 0.82)",
            borderRadius: 8,
            maxBarThickness: 34,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label(context) {
                return `원화 환산 시총: ${Number(context.raw || 0).toLocaleString("ko-KR", { maximumFractionDigits: 1 })}조원`;
              },
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: "#4b5563",
              maxRotation: 55,
              minRotation: 35,
            },
            grid: { display: false },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: "#6b7280",
              callback(value) {
                return `${Number(value).toLocaleString("ko-KR")}조`;
              },
            },
            grid: { color: "rgba(219, 212, 202, 0.5)" },
          },
        },
      },
    });
  };

  initAumChart();
  initMarketCapChart();
}
