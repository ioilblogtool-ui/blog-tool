(function () {
  const raw = document.getElementById("largeCompanySalaryGrowthByYears2026Data");
  if (!raw) return;

  const seed = JSON.parse(raw.textContent || "{}");
  const entries = Array.isArray(seed.entries) ? seed.entries.slice() : [];
  if (!entries.length) return;

  const industryLabels = {
    all: "전체",
    semiconductor: "반도체",
    auto: "자동차",
    platform: "플랫폼·통신",
    itService: "IT서비스",
    electronics: "전자·제조",
    construction: "건설",
    airline: "항공",
  };

  const growthLabels = {
    all: "전체",
    starterFast: "초봉형",
    stable: "안정형",
    longTenure: "장기근속형",
    performanceHeavy: "성과급형",
  };

  const state = {
    industryFilter: "all",
    growthTypeFilter: "all",
    rangeMode: "fifteenYears",
    sort: "year10Desc",
    selectedCompany: [...entries].sort((a, b) => getBandMid(b, 10) - getBandMid(a, 10))[0].slug,
    mySalary: null,
  };

  function formatKrwM(value) {
    if (value >= 10000) {
      const uk = value / 10000;
      return `${Number.isInteger(uk) ? uk.toFixed(0) : uk.toFixed(1)}억원`;
    }
    return `${Number(value).toLocaleString("ko-KR")}만원`;
  }

  function formatYears(value) {
    return `${Number(value).toFixed(1)}년`;
  }

  function formatBand(point) {
    return `${formatKrwM(point.min)} ~ ${formatKrwM(point.max)}`;
  }

  function getBand(entry, year) {
    return (entry.salaryBands || []).find((point) => point.year === year);
  }

  function getBandMid(entry, year) {
    return getBand(entry, year)?.mid ?? 0;
  }

  function getFilteredEntries() {
    let list = entries.slice();
    if (state.industryFilter !== "all") {
      list = list.filter((entry) => entry.industry === state.industryFilter);
    }
    if (state.growthTypeFilter !== "all") {
      list = list.filter((entry) => entry.growthType === state.growthTypeFilter);
    }

    if (state.sort === "name") {
      list.sort((a, b) => a.companyName.localeCompare(b.companyName, "ko"));
      return list;
    }

    if (state.sort === "avgDesc") {
      list.sort((a, b) => b.avgSalaryManwon - a.avgSalaryManwon);
      return list;
    }

    if (state.sort === "starterDesc") {
      list.sort((a, b) => (b.starterSalaryManwon ?? 0) - (a.starterSalaryManwon ?? 0));
      return list;
    }

    list.sort((a, b) => getBandMid(b, 10) - getBandMid(a, 10));
    return list;
  }

  function setText(id, text) {
    const element = document.getElementById(id);
    if (element) element.textContent = text;
  }

  function renderSummaryBar(filtered) {
    const target = document.getElementById("growthSummaryBar");
    if (!target) return;

    const avgYear10 = filtered.length
      ? Math.round(filtered.reduce((sum, entry) => sum + getBandMid(entry, 10), 0) / filtered.length)
      : 0;
    const avgSalary = filtered.length
      ? Math.round(filtered.reduce((sum, entry) => sum + entry.avgSalaryManwon, 0) / filtered.length)
      : 0;

    target.innerHTML = `
      <div class="growth-sum-cell"><div class="growth-sum-num">${filtered.length}<span>개</span></div><div class="growth-sum-label">표시 기업</div></div>
      <div class="growth-sum-cell"><div class="growth-sum-num">${formatKrwM(avgYear10)}</div><div class="growth-sum-label">10년차 mid 평균</div></div>
      <div class="growth-sum-cell"><div class="growth-sum-num">${formatKrwM(avgSalary)}</div><div class="growth-sum-label">평균 연봉 평균</div></div>
      <div class="growth-sum-cell"><div class="growth-sum-num">${growthLabels[state.growthTypeFilter] || "전체"}</div><div class="growth-sum-label">성장 유형</div></div>
    `;
  }

  function renderTypeHighlight() {
    document.querySelectorAll(".growth-type-card").forEach((card) => {
      const type = card.getAttribute("data-type");
      card.classList.toggle("is-dimmed", state.growthTypeFilter !== "all" && type !== state.growthTypeFilter);
      card.classList.toggle("is-active", state.growthTypeFilter !== "all" && type === state.growthTypeFilter);
    });
  }

  function renderTable(filtered) {
    const tbody = document.getElementById("growthTableBody");
    if (!tbody) return;

    tbody.innerHTML = filtered.map((entry) => `
      <tr data-company-row="${entry.slug}">
        <td>${entry.companyName}</td>
        <td>${industryLabels[entry.industry] || entry.industry}</td>
        <td>${entry.starterSalaryManwon ? formatKrwM(entry.starterSalaryManwon) : "-"}</td>
        <td>${formatKrwM(entry.avgSalaryManwon)}</td>
        <td>${formatYears(entry.tenureYears)}</td>
        <td>${formatBand(getBand(entry, 5))}</td>
        <td>${formatBand(getBand(entry, 10))}</td>
        <td>${formatBand(getBand(entry, 15))}</td>
        <td>${growthLabels[entry.growthType] || entry.growthType}</td>
      </tr>
    `).join("");

    tbody.querySelectorAll("tr").forEach((row) => {
      row.addEventListener("click", () => {
        const slug = row.getAttribute("data-company-row");
        if (!slug) return;
        state.selectedCompany = slug;
        setSelectedCompany(slug);
        buildLineChart();
      });
    });
  }

  function setSelectedCompany(slug) {
    const entry = entries.find((item) => item.slug === slug);
    if (!entry) return;

    state.selectedCompany = slug;
    setText("growthCompanyName", entry.companyName);
    setText("growthCompanyType", growthLabels[entry.growthType] || entry.growthType);
    setText("growthStarter", entry.starterSalaryManwon ? formatKrwM(entry.starterSalaryManwon) : "추정 필요");
    setText("growthAverage", formatKrwM(entry.avgSalaryManwon));
    setText("growthTenure", formatYears(entry.tenureYears));
    setText("growthYear10", formatBand(getBand(entry, 10)));
    setText("growthCompanySummary", entry.summary);

    const tags = document.getElementById("growthCompanyTags");
    if (tags) tags.innerHTML = (entry.tags || []).map((tag) => `<span>${tag}</span>`).join("");

    const bands = document.getElementById("growthCompanyBands");
    if (bands) {
      bands.innerHTML = `
        <span>1년차 ${formatBand(getBand(entry, 1))}</span>
        <span>5년차 ${formatBand(getBand(entry, 5))}</span>
        <span>10년차 ${formatBand(getBand(entry, 10))}</span>
        <span>15년차 ${formatBand(getBand(entry, 15))}</span>
      `;
    }

    const select = document.getElementById("growthCompanySelect");
    if (select) select.value = slug;
  }

  function updateBenchmark() {
    const input = document.getElementById("growthMySalaryInput");
    const hint = document.getElementById("growthInputHint");
    const card = document.getElementById("growthResultCard");
    if (!input) return;

    const value = Number.parseInt(input.value || "", 10);
    if (!value || value < 1000) {
      state.mySalary = null;
      if (card) card.style.display = "none";
      if (hint) hint.textContent = "입력하면 유사 기업과 시장 체감 문구가 표시됩니다.";
      return;
    }

    state.mySalary = value;
    const filtered = getFilteredEntries();
    const year5Array = filtered.map((entry) => getBandMid(entry, 5)).sort((a, b) => a - b);
    const rank = year5Array.filter((salary) => salary <= value).length;
    const pct = Math.max(1, Math.round((rank / Math.max(1, year5Array.length)) * 100));
    const avg = year5Array.length ? Math.round(year5Array.reduce((sum, item) => sum + item, 0) / year5Array.length) : 0;
    const diff = value - avg;
    const similar = filtered
      .map((entry) => ({
        entry,
        diff: Math.abs(getBandMid(entry, 5) - value),
      }))
      .sort((a, b) => a.diff - b.diff)
      .slice(0, 3);

    const nearestEntry = similar[0]?.entry;
    const bandText = nearestEntry
      ? value >= getBandMid(nearestEntry, 10)
        ? "10년차 근처"
        : value >= getBandMid(nearestEntry, 7)
          ? "7년차 근처"
          : "5년차 근처"
      : "비교 데이터 없음";

    const similarText = similar.length
      ? `가까운 기업: ${similar.map((item) => `${item.entry.companyName} (${growthLabels[item.entry.growthType]})`).join(", ")}`
      : "가까운 구간 기업이 많지 않습니다.";

    setText("growthResultTitle", `내 연봉 ${Number(value).toLocaleString("ko-KR")}만원 기준`);
    setText("growthPct", `${pct}%`);
    setText("growthDiff", `${diff >= 0 ? "+" : ""}${Number(diff).toLocaleString("ko-KR")}만원`);
    setText("growthBand", bandText);
    setText("growthSimilarText", similarText);

    if (card) card.style.display = "block";
    if (hint) {
      hint.innerHTML = `<strong>5년차 mid 기준</strong> · 평균 대비 ${diff >= 0 ? "+" : ""}${Number(diff).toLocaleString("ko-KR")}만원`;
    }
  }

  let lineChart = null;

  function buildLineChart() {
    const canvas = document.getElementById("growthLineChart");
    if (!canvas || typeof Chart === "undefined") return;

    const filtered = getFilteredEntries();
    renderSummaryBar(filtered);
    renderTypeHighlight();
    renderTable(filtered);

    if (!filtered.some((entry) => entry.slug === state.selectedCompany) && filtered[0]) {
      state.selectedCompany = filtered[0].slug;
      setSelectedCompany(filtered[0].slug);
    }

    const years = state.rangeMode === "tenYears" ? [1, 3, 5, 7, 10] : [1, 3, 5, 7, 10, 12, 15];
    const emphasized = filtered.slice(0, 5);

    if (lineChart) {
      lineChart.destroy();
      lineChart = null;
    }

    const palettes = [
      { border: "#0f766e", background: "rgba(15, 118, 110, 0.12)" },
      { border: "#2563eb", background: "rgba(37, 99, 235, 0.12)" },
      { border: "#c2410c", background: "rgba(194, 65, 12, 0.12)" },
      { border: "#7c3aed", background: "rgba(124, 58, 237, 0.12)" },
      { border: "#be123c", background: "rgba(190, 18, 60, 0.12)" },
    ];

    lineChart = new Chart(canvas, {
      type: "line",
      data: {
        labels: years.map((year) => `${year}년차`),
        datasets: emphasized.map((entry, index) => {
          const isSelected = entry.slug === state.selectedCompany;
          const palette = palettes[index % palettes.length];
          return {
            label: entry.companyName,
            data: years.map((year) => getBandMid(entry, year)),
            borderColor: isSelected ? "#111827" : palette.border,
            backgroundColor: palette.background,
            borderWidth: isSelected ? 4 : 2.5,
            tension: 0.28,
            pointRadius: isSelected ? 4 : 2.5,
            pointHoverRadius: 5,
          };
        }),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "nearest",
          intersect: false,
        },
        plugins: {
          legend: {
            position: "bottom",
          },
          tooltip: {
            callbacks: {
              label(context) {
                return `${context.dataset.label}: ${formatKrwM(context.parsed.y)}`;
              },
            },
          },
        },
        scales: {
          y: {
            ticks: {
              callback(value) {
                return formatKrwM(Number(value));
              },
            },
          },
        },
      },
    });
  }

  function bindEvents() {
    const industryFilter = document.getElementById("growthIndustryFilter");
    if (industryFilter) {
      industryFilter.addEventListener("change", (event) => {
        state.industryFilter = event.target.value;
        buildLineChart();
        updateBenchmark();
      });
    }

    document.querySelectorAll("[data-type-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        state.growthTypeFilter = button.getAttribute("data-type-filter") || "all";
        document.querySelectorAll("[data-type-filter]").forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");
        buildLineChart();
        updateBenchmark();
      });
    });

    document.querySelectorAll("[data-range]").forEach((button) => {
      button.addEventListener("click", () => {
        state.rangeMode = button.getAttribute("data-range") || "fifteenYears";
        document.querySelectorAll("[data-range]").forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");
        buildLineChart();
      });
    });

    const sortSelect = document.getElementById("growthSortSelect");
    if (sortSelect) {
      sortSelect.addEventListener("change", (event) => {
        state.sort = event.target.value;
        buildLineChart();
        updateBenchmark();
      });
    }

    const companySelect = document.getElementById("growthCompanySelect");
    if (companySelect) {
      companySelect.addEventListener("change", (event) => {
        state.selectedCompany = event.target.value;
        setSelectedCompany(state.selectedCompany);
        buildLineChart();
      });
    }

    const salaryInput = document.getElementById("growthMySalaryInput");
    if (salaryInput) {
      salaryInput.addEventListener("input", updateBenchmark);
    }
  }

  setSelectedCompany(state.selectedCompany);
  bindEvents();
  buildLineChart();
})();
