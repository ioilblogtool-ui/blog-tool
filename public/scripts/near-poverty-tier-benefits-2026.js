(() => {
  const seedEl = document.getElementById("npt-data");
  const page = document.querySelector(".npt-page");
  if (!seedEl || !page) return;

  const seed = JSON.parse(seedEl.textContent || "{}");
  const four = seed.thresholdRow;
  const wonTick = (value) => `${Math.round(value / 10000).toLocaleString("ko-KR")}만`;

  function renderThresholdChart() {
    const canvas = document.getElementById("nptThresholdChart");
    if (!canvas || !window.Chart || !four) return;

    new window.Chart(canvas, {
      type: "bar",
      data: {
        labels: ["생계 32%", "의료 40%", "주거 48%", "차상위 확인 50%"],
        datasets: [
          {
            label: "4인 가구 기준",
            data: [four.livelihood, four.medical, four.housing, four.education],
            backgroundColor: ["#0f6e56", "#17806a", "#38b99a", "#d98b3c"],
            borderRadius: 5,
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `${Math.round(ctx.raw).toLocaleString("ko-KR")}원`,
            },
          },
        },
        scales: {
          x: {
            ticks: { callback: wonTick },
            grid: { color: "rgba(148, 163, 184, 0.22)" },
          },
          y: { grid: { display: false } },
        },
      },
    });
  }

  function setFilter(group) {
    page.querySelectorAll("[data-npt-filter]").forEach((button) => {
      const active = button.dataset.nptFilter === group;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
    });

    page.querySelectorAll("[data-npt-group]").forEach((card) => {
      card.hidden = group !== "all" && card.dataset.nptGroup !== group;
    });
  }

  page.querySelectorAll("[data-npt-filter]").forEach((button) => {
    button.addEventListener("click", () => setFilter(button.dataset.nptFilter || "all"));
  });

  if (window.Chart) {
    renderThresholdChart();
  } else {
    window.addEventListener("load", renderThresholdChart, { once: true });
  }
})();
