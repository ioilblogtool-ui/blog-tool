(() => {
  const seedEl = document.getElementById("gwb-data");
  const page = document.querySelector(".gwb-page");
  if (!seedEl || !page) return;

  const seed = JSON.parse(seedEl.textContent || "{}");
  const rows = seed.medianRows || [];
  const four = seed.thresholdRow || rows.find((row) => row.householdSize === 4);
  const wonTick = (value) => `${Math.round(value / 10000).toLocaleString("ko-KR")}만`;

  function renderMedianChart() {
    const canvas = document.getElementById("gwbMedianChart");
    if (!canvas || !window.Chart || !rows.length) return;

    new window.Chart(canvas, {
      type: "bar",
      data: {
        labels: rows.map((row) => `${row.householdSize}인`),
        datasets: [
          {
            label: "2025년",
            data: rows.map((row) => row.median2025),
            backgroundColor: "#cbd5e1",
            borderRadius: 5,
          },
          {
            label: "2026년",
            data: rows.map((row) => row.median2026),
            backgroundColor: "#0f6e56",
            borderRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom" },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${Math.round(ctx.raw).toLocaleString("ko-KR")}원`,
            },
          },
        },
        scales: {
          y: {
            ticks: { callback: wonTick },
            grid: { color: "rgba(148, 163, 184, 0.22)" },
          },
          x: { grid: { display: false } },
        },
      },
    });
  }

  function renderThresholdChart() {
    const canvas = document.getElementById("gwbThresholdChart");
    if (!canvas || !window.Chart || !four) return;

    new window.Chart(canvas, {
      type: "bar",
      data: {
        labels: ["생계 32%", "의료 40%", "주거 48%", "교육 50%"],
        datasets: [
          {
            label: "4인 가구 선정기준",
            data: [four.livelihood, four.medical, four.housing, four.education],
            backgroundColor: ["#0f6e56", "#17806a", "#38b99a", "#93c5bd"],
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
    page.querySelectorAll("[data-gwb-filter]").forEach((button) => {
      const active = button.dataset.gwbFilter === group;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
    });

    page.querySelectorAll("[data-gwb-group]").forEach((card) => {
      card.hidden = group !== "all" && card.dataset.gwbGroup !== group;
    });
  }

  page.querySelectorAll("[data-gwb-filter]").forEach((button) => {
    button.addEventListener("click", () => setFilter(button.dataset.gwbFilter || "all"));
  });

  if (window.Chart) {
    renderMedianChart();
    renderThresholdChart();
  } else {
    window.addEventListener("load", () => {
      renderMedianChart();
      renderThresholdChart();
    }, { once: true });
  }
})();
