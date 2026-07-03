(function () {
  const input = document.getElementById("nadwSearchInput");
  const tabs = document.querySelectorAll(".nadw-region-tab");
  const rows = [...document.querySelectorAll("#nadwMemberRows tr")];
  const emptyState = document.getElementById("nadwEmptyState");

  if (!input || !rows.length) return;

  let activeRegion = "all";

  function applyFilter() {
    const keyword = (input.value || "").trim().toLowerCase();
    let visibleCount = 0;

    rows.forEach((row) => {
      const matchesRegion = activeRegion === "all" || row.dataset.region === activeRegion;
      const haystack = `${row.dataset.name} ${row.dataset.district}`.toLowerCase();
      const matchesKeyword = !keyword || haystack.includes(keyword);
      const visible = matchesRegion && matchesKeyword;
      row.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    if (emptyState) emptyState.hidden = visibleCount > 0;
  }

  input.addEventListener("input", applyFilter);

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      activeRegion = tab.dataset.region;
      applyFilter();
    });
  });

  function initChart() {
    const canvas = document.getElementById("nadwChartCanvas");
    if (!canvas || typeof Chart === "undefined") return;
    const labels = JSON.parse(canvas.dataset.labels || "[]");
    const data = JSON.parse(canvas.dataset.values || "[]");
    new Chart(canvas.getContext("2d"), {
      type: "bar",
      data: {
        labels,
        datasets: [{ data, backgroundColor: "rgba(26, 86, 219, 0.75)" }],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { title: { display: true, text: "억원 (표본 평균)" } } },
      },
    });
  }

  initChart();
})();
