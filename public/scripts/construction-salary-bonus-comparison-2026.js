(function () {
  const raw = document.getElementById("constructionSalaryBonusComparisonData");
  if (!raw) return;

  const seed = JSON.parse(raw.textContent || "{}");
  const entries = Array.isArray(seed.entries) ? seed.entries.slice() : [];
  if (!entries.length) return;

  const typeLabels = {
    construction: "종합건설",
    engineering: "엔지니어링",
    plant: "플랜트",
  };

  const state = {
    compareMode: "avgSalary",
    companyTypeFilter: "all",
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
    if (state.compareMode === "totalComp") return entry.estTotalCompBaseManwon;
    if (state.compareMode === "contractorRank") return -entry.contractorRank;
    return entry.avgSalaryManwon;
  }

  function getCompareLabel() {
    if (state.compareMode === "bonus") return "성과급";
    if (state.compareMode === "newHire") return "신입 초봉";
    if (state.compareMode === "totalComp") return "기준 총보상";
    if (state.compareMode === "contractorRank") return "시공능력";
    return "평균 연봉";
  }

  function getCompareDisplay(entry) {
    if (state.compareMode === "bonus") return formatBonusRate(entry.bonusRateBase);
    if (state.compareMode === "newHire") return formatManwon(entry.newHireSalaryManwon);
    if (state.compareMode === "totalComp") return formatManwon(entry.estTotalCompBaseManwon);
    if (state.compareMode === "contractorRank") return `${entry.contractorRank}위`;
    return formatManwon(entry.avgSalaryManwon);
  }

  function filteredEntries() {
    let list = entries.slice();
    if (state.companyTypeFilter !== "all") {
      list = list.filter((entry) => entry.companyType === state.companyTypeFilter);
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
    const target = document.getElementById("constructionSummaryBar");
    if (!target) return;

    const list = filteredEntries();
    const label = getCompareLabel();
    const values = list.map((entry) => getSortValue(entry));
    const maxEntry = list[0];
    const minEntry = list[list.length - 1];
    const avg = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
    const avgDisplay = state.compareMode === "bonus"
      ? formatBonusRate(avg)
      : state.compareMode === "contractorRank"
        ? `${Math.round(Math.abs(avg))}위`
        : formatManwon(Math.round(avg));

    target.innerHTML = `
      <div class="con-sum-cell"><div class="con-sum-num">${list.length}<span>개</span></div><div class="con-sum-label">표시 건설사</div></div>
      <div class="con-sum-cell"><div class="con-sum-num">${maxEntry ? getCompareDisplay(maxEntry) : "-"}</div><div class="con-sum-label">${label} 상단</div></div>
      <div class="con-sum-cell"><div class="con-sum-num">${avgDisplay}</div><div class="con-sum-label">${label} 평균</div></div>
      <div class="con-sum-cell"><div class="con-sum-num">${minEntry ? getCompareDisplay(minEntry) : "-"}</div><div class="con-sum-label">${label} 하단</div></div>
    `;
  }

  function renderTable() {
    const target = document.getElementById("constructionCompareTableBody");
    if (!target) return;

    const rows = filteredEntries()
      .map((entry) => `
        <tr data-company="${entry.slug}" class="${entry.slug === state.selectedCompany ? "is-selected" : ""}">
          <td>${entry.companyName}</td>
          <td>${typeLabels[entry.companyType] || entry.companyType}</td>
          <td>${formatManwon(entry.avgSalaryManwon)}</td>
          <td>${formatManwon(entry.newHireSalaryManwon)}</td>
          <td>${formatManwon(entry.managerSalaryManwon)}</td>
          <td>${formatBonusRate(entry.bonusRateBase)}</td>
          <td>${formatManwon(entry.estTotalCompBaseManwon)}</td>
          <td>${entry.contractorRank}위</td>
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
        renderCompensationResult();
      });
    });
  }

  function renderProfile() {
    const entry = entries.find((item) => item.slug === state.selectedCompany);
    if (!entry) return;

    setText("constructionProfileName", entry.companyName);
    setText("constructionProfileNameEn", entry.nameEn);
    setText("constructionProfileType", typeLabels[entry.companyType] || entry.companyType);
    setText("constructionProfileAvgSalary", formatManwon(entry.avgSalaryManwon));
    setText("constructionProfileTagline", entry.companyTag);
    setText("constructionProfileNewHire", formatManwon(entry.newHireSalaryManwon));
    setText("constructionProfileTotalComp", formatManwon(entry.estTotalCompBaseManwon));
    setText("constructionProfileBonus", `기준 성과급 ${formatBonusRate(entry.bonusRateBase)}`);
    setText("constructionProfileManager", formatManwon(entry.managerSalaryManwon));
    setText("constructionProfileHeadcount", `${Number(entry.employeeCount).toLocaleString("ko-KR")}명`);
    setText("constructionProfileRank", `${entry.contractorRank}위`);
    setText("constructionProfileRevenue", entry.revenueText);
    setText("constructionProfileGrowth", entry.growthTag);
    setText("constructionProfileBonusRange", `${formatBonusRate(entry.bonusRateMin)} ~ ${formatBonusRate(entry.bonusRateMax)}`);
    setText("constructionProfileBonusComment", entry.bonusComment);
    setText("constructionProfileSummary", entry.summary);

    const tags = document.getElementById("constructionProfileTags");
    if (tags) tags.innerHTML = entry.tags.map((tag) => `<span>${tag}</span>`).join("");

    const links = document.getElementById("constructionProfileLinks");
    if (links) {
      const next = [];
      if (entry.hiringUrl) next.push(`<a href="${entry.hiringUrl}" target="_blank" rel="noopener noreferrer">채용</a>`);
      if (entry.officialUrl) next.push(`<a href="${entry.officialUrl}" target="_blank" rel="noopener noreferrer">공식 사이트</a>`);
      if (entry.irUrl) next.push(`<a href="${entry.irUrl}" target="_blank" rel="noopener noreferrer">IR</a>`);
      links.innerHTML = next.join("");
    }
  }

  function getAverageTotalComp() {
    return Math.round(entries.reduce((sum, entry) => sum + entry.estTotalCompBaseManwon, 0) / entries.length);
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

    setText("constructionResultTitle", `${entry.companyName} ${scenarioLabel} 시나리오 결과`);
    setText("constructionExpectedBonus", formatManwon(bonus));
    setText("constructionExpectedTotal", formatManwon(total));
    setText("constructionTotalLevel", level);
    setText(
      "constructionResultComment",
      `입력한 기본 연봉 ${formatManwon(salary)} 기준으로 예상 총보상은 ${formatManwon(total)} 수준입니다. 업계 평균 총보상 대비 ${diff >= 0 ? "높은" : "낮은"} 편으로 읽히며, ${entry.companyName}은 ${entry.companyTag} 성격으로 해석할 수 있습니다.`
    );
  }

  let avgSalaryChart = null;
  let totalCompChart = null;

  function chartColor(entry) {
    if (entry.companyType === "plant") return "rgba(245, 158, 11, 0.78)";
    if (entry.companyType === "engineering") return "rgba(14, 116, 144, 0.76)";
    return "rgba(71, 85, 105, 0.78)";
  }

  function buildOrUpdateCharts() {
    if (typeof Chart === "undefined") return;
    const list = filteredEntries();
    const avgCanvas = document.getElementById("constructionAvgSalaryChart");
    const totalCanvas = document.getElementById("constructionTotalCompChart");
    if (!avgCanvas || !totalCanvas) return;

    const labels = list.map((entry) => entry.companyName);
    const avgData = list.map((entry) => entry.avgSalaryManwon);
    const totalData = list.map((entry) => entry.estTotalCompBaseManwon);
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
    const companySelect = document.getElementById("constructionCompanySelect");
    if (companySelect) companySelect.value = state.selectedCompany;

    const baseSalaryInput = document.getElementById("constructionBaseSalaryInput");
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

  document.querySelectorAll(".con-tab").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".con-tab").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      state.compareMode = button.getAttribute("data-mode") || "avgSalary";
      rerender();
    });
  });

  document.querySelectorAll(".con-chip").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".con-chip").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      state.companyTypeFilter = button.getAttribute("data-type") || "all";

      const list = filteredEntries();
      if (!list.find((entry) => entry.slug === state.selectedCompany)) {
        state.selectedCompany = list[0] ? list[0].slug : entries[0].slug;
      }

      rerender();
    });
  });

  const sortSelect = document.getElementById("constructionSortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", (event) => {
      state.sort = event.target.value;
      rerender();
    });
  }

  const companySelect = document.getElementById("constructionCompanySelect");
  if (companySelect) {
    companySelect.addEventListener("change", (event) => {
      state.selectedCompany = event.target.value;
      renderProfile();
      renderTable();
      renderCompensationResult();
    });
  }

  const baseSalaryInput = document.getElementById("constructionBaseSalaryInput");
  if (baseSalaryInput) {
    baseSalaryInput.addEventListener("input", (event) => {
      state.myBaseSalary = Number(event.target.value) || 0;
      renderCompensationResult();
    });
  }

  document.querySelectorAll(".con-pill").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".con-pill").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      state.scenario = button.getAttribute("data-scenario") || "base";
      renderCompensationResult();
    });
  });

  const extraBonusToggle = document.getElementById("constructionExtraBonusToggle");
  if (extraBonusToggle) {
    extraBonusToggle.addEventListener("change", (event) => {
      state.includeExtraBonus = Boolean(event.target.checked);
      renderCompensationResult();
    });
  }

  rerender();
})();
