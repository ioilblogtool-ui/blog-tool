(function () {
  const raw = document.getElementById("itSiSmSalaryComparisonData");
  if (!raw) return;

  const seed = JSON.parse(raw.textContent || "{}");
  const companies = (seed.companies || []).slice();
  if (!companies.length) return;

  const groupLabels = {
    top: "상단권",
    stable: "안정형",
    ops: "운영형",
    growth: "성장형",
  };

  const state = {
    compareMode: "salary",
    filterGroup: "all",
    sort: "desc",
    selectedCompany: [...companies].sort((a, b) => b.avgSalaryM - a.avgSalaryM)[0].slug,
    mySalary: null,
  };

  function formatKrwM(value) {
    if (value >= 10000) {
      const uk = value / 10000;
      return `${Number.isInteger(uk) ? uk.toFixed(0) : uk.toFixed(1)}억원`;
    }
    return `${Number(value).toLocaleString("ko-KR")}만원`;
  }

  function formatRevenue(value) {
    if (value >= 10000) {
      const jo = value / 10000;
      return `${Number.isInteger(jo) ? jo.toFixed(0) : jo.toFixed(1)}조원`;
    }
    return `${Number(value).toLocaleString("ko-KR")}억원`;
  }

  function getStarterMid(entry) {
    return Math.round((entry.starterSalaryMinM + entry.starterSalaryMaxM) / 2);
  }

  function getTierLabel(value) {
    if (value >= 10000) return "1억 이상";
    if (value >= 8000) return "8천~1억";
    if (value >= 7000) return "7천~8천";
    if (value >= 6000) return "6천~7천";
    return "6천 미만";
  }

  function getMetricValue(entry, mode) {
    if (mode === "starter") return getStarterMid(entry);
    if (mode === "companySize") return entry.revenueEok;
    return entry.avgSalaryM;
  }

  function getMetricLabel(mode) {
    if (mode === "starter") return "초봉";
    if (mode === "companySize") return "회사 규모";
    return "평균 연봉";
  }

  function getMetricUnitLabel(mode, value) {
    if (mode === "companySize") return formatRevenue(value);
    return formatKrwM(value);
  }

  function getFilteredEntries() {
    let list = companies.slice();
    if (state.filterGroup !== "all") {
      list = list.filter((entry) => entry.groupType === state.filterGroup);
    }

    if (state.sort === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name, "ko"));
      return list;
    }

    list.sort((a, b) => {
      const diff = getMetricValue(a, state.compareMode) - getMetricValue(b, state.compareMode);
      return state.sort === "asc" ? diff : -diff;
    });
    return list;
  }

  function setText(id, text) {
    const element = document.getElementById(id);
    if (element) element.textContent = text;
  }

  function renderSummaryBar(filtered) {
    const target = document.getElementById("siSummaryBar");
    if (!target) return;

    const metricValues = filtered.map((entry) => getMetricValue(entry, state.compareMode));
    const avg = metricValues.length
      ? Math.round(metricValues.reduce((sum, value) => sum + value, 0) / metricValues.length)
      : 0;
    const max = metricValues.length ? Math.max(...metricValues) : 0;
    const min = metricValues.length ? Math.min(...metricValues) : 0;

    target.innerHTML = `
      <div class="si-sum-cell"><div class="si-sum-num">${filtered.length}<span>개</span></div><div class="si-sum-label">표시 기업</div></div>
      <div class="si-sum-cell"><div class="si-sum-num">${getMetricUnitLabel(state.compareMode, max)}</div><div class="si-sum-label">최고</div></div>
      <div class="si-sum-cell"><div class="si-sum-num">${getMetricUnitLabel(state.compareMode, avg)}</div><div class="si-sum-label">평균</div></div>
      <div class="si-sum-cell"><div class="si-sum-num">${getMetricUnitLabel(state.compareMode, min)}</div><div class="si-sum-label">최저</div></div>
    `;
  }

  function renderInteractiveChart() {
    const target = document.getElementById("siInteractiveChart");
    if (!target) return;

    const filtered = getFilteredEntries();
    renderSummaryBar(filtered);

    const maxValue = Math.max(...filtered.map((entry) => getMetricValue(entry, state.compareMode)), 1);
    const rows = filtered
      .map((entry) => {
        const value = getMetricValue(entry, state.compareMode);
        const width = Math.max(14, Math.round((value / maxValue) * 100));
        const myLine =
          state.compareMode === "salary" && state.mySalary
            ? `<div class="si-my-line" style="left:${Math.min(100, Math.round((state.mySalary / maxValue) * 100))}%"></div>`
            : "";

        return `
          <button class="si-bar-row" type="button" data-company="${entry.slug}">
            <span class="si-bar-meta">
              <strong>${entry.name}</strong>
              <em>${groupLabels[entry.groupType] || entry.groupType}</em>
            </span>
            <span class="si-bar-track">
              <span class="si-bar-fill is-${entry.groupType}" style="width:${width}%">
                <span class="si-bar-value">${getMetricUnitLabel(state.compareMode, value)}</span>
              </span>
              ${myLine}
            </span>
          </button>
        `;
      })
      .join("");

    target.innerHTML = `
      <div class="si-market-chart__head">
        <strong>${getMetricLabel(state.compareMode)} 기준 분포</strong>
        <span>${state.filterGroup === "all" ? "전체" : groupLabels[state.filterGroup]} · ${state.sort === "name" ? "가나다순" : state.sort === "asc" ? "낮은순" : "높은순"}</span>
      </div>
      <div class="si-market-chart__body">${rows}</div>
    `;

    target.querySelectorAll(".si-bar-row").forEach((button) => {
      button.addEventListener("click", () => {
        const slug = button.getAttribute("data-company");
        if (!slug) return;
        state.selectedCompany = slug;
        setSelectedCompany(slug);
      });
    });
  }

  function setSelectedCompany(slug) {
    const entry = companies.find((company) => company.slug === slug);
    if (!entry) return;

    const salaryRank = [...companies].sort((a, b) => b.avgSalaryM - a.avgSalaryM).findIndex((company) => company.slug === slug) + 1;
    state.selectedCompany = slug;

    setText("siProfileName", entry.name);
    setText("siProfileNameEn", entry.nameEn);
    setText("siProfileRank", `${salaryRank}위`);
    setText("siProfileSalary", formatKrwM(entry.avgSalaryM));
    setText("siProfileTier", getTierLabel(entry.avgSalaryM));
    setText("siProfileStarter", `${formatKrwM(entry.starterSalaryMinM)} ~ ${formatKrwM(entry.starterSalaryMaxM)}`);
    setText("siProfileStarterNote", entry.starterSalaryNote);
    setText("siProfileBonusLabel", entry.bonusLabel);
    setText("siProfileBonusSummary", entry.bonusSummary);
    setText("siProfileRevenue", `${Number(entry.revenueEok).toLocaleString("ko-KR")}억원`);
    setText("siProfileHeadcount", `${Number(entry.headcount).toLocaleString("ko-KR")}명`);
    setText("siProfileGroup", groupLabels[entry.groupType] || entry.groupType);
    setText("siProfileSummary", entry.summary);

    const tagWrap = document.getElementById("siProfileTags");
    if (tagWrap) tagWrap.innerHTML = entry.tags.map((tag) => `<span>${tag}</span>`).join("");

    const businessWrap = document.getElementById("siBusinessFocus");
    if (businessWrap) businessWrap.innerHTML = entry.businessFocus.map((item) => `<li>${item}</li>`).join("");

    const recommendedWrap = document.getElementById("siRecommendedFor");
    if (recommendedWrap) recommendedWrap.innerHTML = entry.recommendedFor.map((item) => `<li>${item}</li>`).join("");

    const select = document.getElementById("siCompanySelect");
    if (select) select.value = slug;
  }

  function updateBenchmark() {
    const input = document.getElementById("siMySalaryInput");
    const hint = document.getElementById("siMySalaryHint");
    const card = document.getElementById("siResultCard");
    if (!input) return;

    const value = Number.parseInt(input.value || "", 10);
    if (!value || value < 1000) {
      state.mySalary = null;
      if (card) card.style.display = "none";
      if (hint) hint.textContent = "입력하면 시장 맵에 내 연봉 기준선이 표시됩니다.";
      renderInteractiveChart();
      return;
    }

    state.mySalary = value;
    const salaryArray = companies.map((entry) => entry.avgSalaryM).sort((a, b) => a - b);
    const rank = salaryArray.filter((salary) => salary <= value).length;
    const pct = Math.round((rank / salaryArray.length) * 100);
    const overallAvg = Math.round(salaryArray.reduce((sum, salary) => sum + salary, 0) / salaryArray.length);
    const diff = value - overallAvg;
    const diffLabel = `${diff >= 0 ? "+" : ""}${Number(diff).toLocaleString("ko-KR")}만원`;
    const similar = companies
      .filter((entry) => Math.abs(entry.avgSalaryM - value) <= 700)
      .slice(0, 4)
      .map((entry) => entry.name);

    setText("siResultTitle", `내 연봉 ${Number(value).toLocaleString("ko-KR")}만원 기준 위치`);
    setText("siPct", `${pct}%`);
    setText("siDiff", diffLabel);
    setText("siTier", getTierLabel(value));
    setText(
      "siSimilarText",
      similar.length ? `유사 구간 기업: ${similar.join(", ")}` : "가까운 평균 연봉 구간 기업이 많지 않습니다.",
    );

    if (hint) hint.innerHTML = `<strong>상위 ${pct}%</strong> · 평균 대비 ${diffLabel}`;
    if (card) card.style.display = "block";
    renderInteractiveChart();
  }

  let salaryChart = null;
  let revenueChart = null;

  function buildSalaryChart() {
    const canvas = document.getElementById("siSalaryChart");
    if (!canvas || typeof Chart === "undefined") return;

    const sorted = [...companies].sort((a, b) => b.avgSalaryM - a.avgSalaryM);
    salaryChart = new Chart(canvas, {
      type: "bar",
      data: {
        labels: sorted.map((entry) => entry.name),
        datasets: [{
          label: "평균 연봉",
          data: sorted.map((entry) => entry.avgSalaryM),
          backgroundColor: "rgba(37, 99, 235, 0.78)",
          borderRadius: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label(ctx) {
                return ` ${formatKrwM(ctx.parsed.x)}`;
              },
            },
          },
        },
        onClick(_event, elements) {
          if (!elements.length) return;
          setSelectedCompany(sorted[elements[0].index].slug);
        },
        scales: {
          x: {
            ticks: {
              callback(value) {
                return `${Math.round(Number(value) / 1000)}천`;
              },
            },
          },
          y: { grid: { display: false } },
        },
      },
    });
  }

  function buildRevenueChart() {
    const canvas = document.getElementById("siRevenueChart");
    if (!canvas || typeof Chart === "undefined") return;

    const sorted = [...companies].sort((a, b) => b.revenueEok - a.revenueEok);
    revenueChart = new Chart(canvas, {
      type: "bar",
      data: {
        labels: sorted.map((entry) => entry.name),
        datasets: [{
          label: "매출 규모",
          data: sorted.map((entry) => entry.revenueEok),
          backgroundColor: "rgba(15, 23, 42, 0.72)",
          borderRadius: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label(ctx) {
                return ` ${formatRevenue(ctx.parsed.x)}`;
              },
            },
          },
        },
        onClick(_event, elements) {
          if (!elements.length) return;
          setSelectedCompany(sorted[elements[0].index].slug);
        },
        scales: {
          x: {
            ticks: {
              callback(value) {
                return `${Math.round(Number(value) / 10000)}조`;
              },
            },
          },
          y: { grid: { display: false } },
        },
      },
    });
  }

  document.querySelectorAll(".si-tab").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".si-tab").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      state.compareMode = button.getAttribute("data-mode") || "salary";
      renderInteractiveChart();
    });
  });

  document.querySelectorAll(".si-chip").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".si-chip").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      state.filterGroup = button.getAttribute("data-group") || "all";
      renderInteractiveChart();
    });
  });

  const sortSelect = document.getElementById("siSortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", (event) => {
      state.sort = event.target.value;
      renderInteractiveChart();
    });
  }

  const companySelect = document.getElementById("siCompanySelect");
  if (companySelect) {
    companySelect.addEventListener("change", (event) => {
      setSelectedCompany(event.target.value);
    });
  }

  const salaryInput = document.getElementById("siMySalaryInput");
  if (salaryInput) {
    salaryInput.addEventListener("input", updateBenchmark);
  }

  const resultCard = document.getElementById("siResultCard");
  if (resultCard) resultCard.style.display = "none";

  setSelectedCompany(state.selectedCompany);
  renderInteractiveChart();

  if (typeof Chart !== "undefined") {
    buildSalaryChart();
    buildRevenueChart();
  }
})();
