(function () {
  const raw = document.getElementById("insuranceSalaryBonusComparisonData");
  if (!raw) return;

  const seed = JSON.parse(raw.textContent || "{}");
  const entries = Array.isArray(seed.entries) ? seed.entries.slice() : [];
  if (!entries.length) return;

  const typeLabels = {
    life: "생명보험",
    nonlife: "손해보험",
  };

  const state = {
    compareMode: "avgSalary",
    insuranceFilter: "all",
    sort: "desc",
    selectedCompany: [...entries].sort((a, b) => b.avgSalaryManwon - a.avgSalaryManwon)[0].slug,
    myBaseSalary: 7000,
    scenario: "base",
    includeExtraBonus: true,
  };

  function formatManwon(value) {
    if (value >= 10000) {
      const eok = value / 10000;
      return `${Number.isInteger(eok) ? eok.toFixed(0) : eok.toFixed(1)}억원`;
    }
    return `${Number(value).toLocaleString("ko-KR")}만원`;
  }

  function formatBonusRate(rate) {
    return `${Math.round(Number(rate) * 100)}%`;
  }

  function getScenarioRate(entry) {
    if (state.scenario === "conservative") return entry.bonusRateMin;
    if (state.scenario === "aggressive") return entry.bonusRateMax;
    return entry.bonusRateBase;
  }

  function getSortValue(entry) {
    if (state.compareMode === "bonus") return entry.bonusRateBase;
    if (state.compareMode === "newHire") return entry.newHireSalaryManwon;
    if (state.compareMode === "totalComp") return entry.estTotalCompBase;
    return entry.avgSalaryManwon;
  }

  function getCompareLabel() {
    if (state.compareMode === "bonus") return "성과급";
    if (state.compareMode === "newHire") return "신입 초봉";
    if (state.compareMode === "totalComp") return "기준 총보상";
    return "평균 연봉";
  }

  function getCompareDisplay(entry) {
    if (state.compareMode === "bonus") return formatBonusRate(entry.bonusRateBase);
    if (state.compareMode === "newHire") return formatManwon(entry.newHireSalaryManwon);
    if (state.compareMode === "totalComp") return formatManwon(entry.estTotalCompBase);
    return formatManwon(entry.avgSalaryManwon);
  }

  function filteredEntries() {
    let list = entries.slice();
    if (state.insuranceFilter !== "all") {
      list = list.filter((entry) => entry.insuranceType === state.insuranceFilter);
    }

    if (state.sort === "name") {
      list.sort((a, b) => a.companyName.localeCompare(b.companyName, "ko"));
      return list;
    }

    list.sort((a, b) => {
      const diff = getSortValue(a) - getSortValue(b);
      return state.sort === "asc" ? diff : -diff;
    });

    return list;
  }

  function setText(id, text) {
    const node = document.getElementById(id);
    if (node) node.textContent = text;
  }

  function renderSummaryBar() {
    const target = document.getElementById("insuranceSummaryBar");
    if (!target) return;

    const list = filteredEntries();
    const values = list.map((entry) => getSortValue(entry));
    const max = values.length ? Math.max(...values) : 0;
    const min = values.length ? Math.min(...values) : 0;
    const avg = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
    const formatter = state.compareMode === "bonus" ? formatBonusRate : formatManwon;

    target.innerHTML = `
      <div class="ins-sum-cell"><div class="ins-sum-num">${list.length}<span>개</span></div><div class="ins-sum-label">표시 보험사</div></div>
      <div class="ins-sum-cell"><div class="ins-sum-num">${formatter(max)}</div><div class="ins-sum-label">최고</div></div>
      <div class="ins-sum-cell"><div class="ins-sum-num">${formatter(Math.round(avg))}</div><div class="ins-sum-label">평균</div></div>
      <div class="ins-sum-cell"><div class="ins-sum-num">${formatter(min)}</div><div class="ins-sum-label">최저</div></div>
    `;
  }

  function renderTable() {
    const target = document.getElementById("insuranceCompareTableBody");
    if (!target) return;

    const rows = filteredEntries()
      .map((entry) => `
        <tr data-company="${entry.slug}" class="${entry.slug === state.selectedCompany ? "is-selected" : ""}">
          <td>${entry.companyName}</td>
          <td>${typeLabels[entry.insuranceType] || entry.insuranceType}</td>
          <td>${formatManwon(entry.avgSalaryManwon)}</td>
          <td>${formatManwon(entry.newHireSalaryManwon)}</td>
          <td>${formatManwon(entry.managerSalaryManwon)}</td>
          <td>${formatBonusRate(entry.bonusRateBase)}</td>
          <td>${formatManwon(entry.estTotalCompBase)}</td>
          <td>${entry.companyTag}</td>
        </tr>
      `)
      .join("");

    target.innerHTML = rows;
    target.querySelectorAll("tr[data-company]").forEach((row) => {
      row.addEventListener("click", () => {
        const slug = row.getAttribute("data-company");
        if (!slug) return;
        state.selectedCompany = slug;
        renderProfile();
        renderTable();
        syncControls();
      });
    });
  }

  function renderProfile() {
    const entry = entries.find((item) => item.slug === state.selectedCompany);
    if (!entry) return;

    setText("insuranceProfileName", entry.companyName);
    setText("insuranceProfileNameEn", entry.nameEn);
    setText("insuranceProfileType", typeLabels[entry.insuranceType] || entry.insuranceType);
    setText("insuranceProfileAvgSalary", formatManwon(entry.avgSalaryManwon));
    setText("insuranceProfileTagline", entry.companyTag);
    setText("insuranceProfileNewHire", formatManwon(entry.newHireSalaryManwon));
    setText("insuranceProfileTotalComp", formatManwon(entry.estTotalCompBase));
    setText("insuranceProfileBonus", `기준 성과급 ${formatBonusRate(entry.bonusRateBase)}`);
    setText("insuranceProfileManager", formatManwon(entry.managerSalaryManwon));
    setText("insuranceProfileHeadcount", `${Number(entry.employeeCount).toLocaleString("ko-KR")}명`);
    setText("insuranceProfileRevenue", entry.revenueText);
    setText("insuranceProfileBonusComment", entry.bonusComment);
    setText("insuranceProfileSummary", entry.summary);

    const tags = document.getElementById("insuranceProfileTags");
    if (tags) tags.innerHTML = entry.tags.map((tag) => `<span>${tag}</span>`).join("");

    const links = document.getElementById("insuranceProfileLinks");
    if (links) {
      const next = [];
      if (entry.hiringUrl) next.push(`<a href="${entry.hiringUrl}" target="_blank" rel="noopener noreferrer">채용</a>`);
      if (entry.officialUrl) next.push(`<a href="${entry.officialUrl}" target="_blank" rel="noopener noreferrer">공식 사이트</a>`);
      if (entry.irUrl) next.push(`<a href="${entry.irUrl}" target="_blank" rel="noopener noreferrer">IR</a>`);
      links.innerHTML = next.join("");
    }
  }

  function getAverageTotalComp() {
    return Math.round(entries.reduce((sum, entry) => sum + entry.estTotalCompBase, 0) / entries.length);
  }

  function renderCompensationResult() {
    const entry = entries.find((item) => item.slug === state.selectedCompany);
    if (!entry) return;

    const salary = Math.max(0, Number(state.myBaseSalary) || 0);
    const bonus = Math.round(salary * getScenarioRate(entry));
    const extra = state.includeExtraBonus ? Number(entry.extraBonusM || 0) : 0;
    const total = salary + bonus + extra;
    const avgTotal = getAverageTotalComp();
    const diff = total - avgTotal;

    let level = "중간";
    if (diff >= 2500) level = "상위권";
    else if (diff >= 800) level = "중상";
    else if (diff <= -1800) level = "보수적";
    else if (diff <= -500) level = "중하";

    const scenarioLabel = state.scenario === "conservative" ? "보수적" : state.scenario === "aggressive" ? "공격적" : "기준";

    setText("insuranceResultTitle", `${entry.companyName} ${scenarioLabel} 시나리오 결과`);
    setText("insuranceExpectedBonus", formatManwon(bonus));
    setText("insuranceExpectedTotal", formatManwon(total));
    setText("insuranceTotalLevel", level);
    setText(
      "insuranceResultComment",
      `입력한 기본 연봉 ${formatManwon(salary)} 기준으로 예상 총보상은 ${formatManwon(total)} 수준입니다. 업계 평균 총보상 대비 ${diff >= 0 ? "높은" : "낮은"} 편으로 읽히며, ${entry.companyName}은 ${entry.companyTag} 성격으로 해석할 수 있습니다.`
    );
  }

  let avgSalaryChart = null;
  let totalCompChart = null;

  function chartColor(entry) {
    return entry.insuranceType === "nonlife" ? "rgba(14, 165, 233, 0.78)" : "rgba(99, 102, 241, 0.76)";
  }

  function buildOrUpdateCharts() {
    if (typeof Chart === "undefined") return;
    const list = filteredEntries();
    const avgCanvas = document.getElementById("insuranceAvgSalaryChart");
    const totalCanvas = document.getElementById("insuranceTotalCompChart");
    if (!avgCanvas || !totalCanvas) return;

    const labels = list.map((entry) => entry.companyName);
    const avgData = list.map((entry) => entry.avgSalaryManwon);
    const totalData = list.map((entry) => entry.estTotalCompBase);
    const colors = list.map(chartColor);

    const sharedOptions = {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      plugins: {
        legend: { display: false },
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
    };

    if (!avgSalaryChart) {
      avgSalaryChart = new Chart(avgCanvas, {
        type: "bar",
        data: {
          labels,
          datasets: [{ data: avgData, backgroundColor: colors, borderRadius: 6 }],
        },
        options: {
          ...sharedOptions,
          plugins: {
            ...sharedOptions.plugins,
            tooltip: {
              callbacks: {
                label(ctx) {
                  return ` ${formatManwon(ctx.parsed.x)}`;
                },
              },
            },
          },
          onClick(_event, elements) {
            if (!elements.length) return;
            state.selectedCompany = list[elements[0].index].slug;
            renderProfile();
            renderTable();
            syncControls();
            renderCompensationResult();
          },
        },
      });
    } else {
      avgSalaryChart.data.labels = labels;
      avgSalaryChart.data.datasets[0].data = avgData;
      avgSalaryChart.data.datasets[0].backgroundColor = colors;
      avgSalaryChart.update("none");
    }

    if (!totalCompChart) {
      totalCompChart = new Chart(totalCanvas, {
        type: "bar",
        data: {
          labels,
          datasets: [{ data: totalData, backgroundColor: colors, borderRadius: 6 }],
        },
        options: {
          ...sharedOptions,
          plugins: {
            ...sharedOptions.plugins,
            tooltip: {
              callbacks: {
                label(ctx) {
                  return ` ${formatManwon(ctx.parsed.x)}`;
                },
              },
            },
          },
          onClick(_event, elements) {
            if (!elements.length) return;
            state.selectedCompany = list[elements[0].index].slug;
            renderProfile();
            renderTable();
            syncControls();
            renderCompensationResult();
          },
        },
      });
    } else {
      totalCompChart.data.labels = labels;
      totalCompChart.data.datasets[0].data = totalData;
      totalCompChart.data.datasets[0].backgroundColor = colors;
      totalCompChart.update("none");
    }
  }

  function syncControls() {
    const companySelect = document.getElementById("insuranceCompanySelect");
    if (companySelect) companySelect.value = state.selectedCompany;

    const baseSalaryInput = document.getElementById("insuranceBaseSalaryInput");
    if (baseSalaryInput && String(baseSalaryInput.value) !== String(state.myBaseSalary)) {
      baseSalaryInput.value = String(state.myBaseSalary);
    }
  }

  function rerender() {
    renderSummaryBar();
    renderTable();
    renderProfile();
    renderCompensationResult();
    buildOrUpdateCharts();
    syncControls();
  }

  document.querySelectorAll(".ins-tab").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".ins-tab").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      state.compareMode = button.getAttribute("data-mode") || "avgSalary";
      rerender();
    });
  });

  document.querySelectorAll(".ins-chip").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".ins-chip").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      state.insuranceFilter = button.getAttribute("data-type") || "all";

      const list = filteredEntries();
      if (!list.find((entry) => entry.slug === state.selectedCompany)) {
        state.selectedCompany = list[0] ? list[0].slug : entries[0].slug;
      }

      rerender();
    });
  });

  const sortSelect = document.getElementById("insuranceSortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", (event) => {
      state.sort = event.target.value;
      rerender();
    });
  }

  const companySelect = document.getElementById("insuranceCompanySelect");
  if (companySelect) {
    companySelect.addEventListener("change", (event) => {
      state.selectedCompany = event.target.value;
      renderProfile();
      renderTable();
      renderCompensationResult();
    });
  }

  const baseSalaryInput = document.getElementById("insuranceBaseSalaryInput");
  if (baseSalaryInput) {
    baseSalaryInput.addEventListener("input", (event) => {
      state.myBaseSalary = Number(event.target.value) || 0;
      renderCompensationResult();
    });
  }

  document.querySelectorAll(".ins-pill").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".ins-pill").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      state.scenario = button.getAttribute("data-scenario") || "base";
      renderCompensationResult();
    });
  });

  const extraBonusToggle = document.getElementById("insuranceExtraBonusToggle");
  if (extraBonusToggle) {
    extraBonusToggle.addEventListener("change", (event) => {
      state.includeExtraBonus = Boolean(event.target.checked);
      renderCompensationResult();
    });
  }

  rerender();
})();
