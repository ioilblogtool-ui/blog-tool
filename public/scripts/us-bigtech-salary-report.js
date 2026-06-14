import { buildDefaultOptions, formatKRW, CHART_COLORS } from "./chart-config.js";

const dataEl = document.getElementById("ubr-data");
if (!dataEl) {
  console.warn("us-bigtech-salary-report: data script not found");
} else {
  const data = JSON.parse(dataEl.textContent || "{}");
  const { exchangeRate = 1400, levels = [] } = data;

  const tierLabels = {
    entry: "엔트리",
    mid: "미드",
    senior: "시니어",
    staff: "스태프",
    principal: "프린시플",
  };

  const toKrwMan = (usd) => Math.round((usd * exchangeRate) / 10_000);

  const canvas = document.getElementById("ubrStackChart");
  if (canvas && window.Chart && levels.length > 0) {
    new window.Chart(canvas, {
      type: "bar",
      data: {
        labels: levels.map((l) => `${l.levelLabel}\n(${tierLabels[l.tier] ?? l.tier})`),
        datasets: [
          {
            label: "Base",
            data: levels.map((l) => toKrwMan(l.baseUsd)),
            backgroundColor: CHART_COLORS.brand,
          },
          {
            label: "Stock",
            data: levels.map((l) => toKrwMan(l.stockUsd)),
            backgroundColor: CHART_COLORS.accent,
          },
          {
            label: "Bonus",
            data: levels.map((l) => toKrwMan(l.bonusUsd)),
            backgroundColor: CHART_COLORS.warning,
          },
        ],
      },
      options: buildDefaultOptions({
        scales: {
          x: { stacked: true, ticks: { autoSkip: false } },
          y: {
            stacked: true,
            ticks: {
              callback: (value) => `${formatKRW(value * 10_000)}`,
            },
          },
        },
        plugins: {
          legend: { display: true, position: "top" },
          tooltip: {
            backgroundColor: "rgba(23,32,51,0.88)",
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${formatKRW(ctx.raw * 10_000)}원`,
            },
          },
        },
      }),
    });
  }
}
