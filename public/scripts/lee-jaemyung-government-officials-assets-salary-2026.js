(function () {
  const raw = document.getElementById("leeGovernmentOfficialsAssetsSalary2026Data");
  if (!raw) return;

  const seed = JSON.parse(raw.textContent || "{}");
  const entries = Array.isArray(seed.entries) ? seed.entries.slice() : [];
  if (!entries.length) return;

  const groupLabels = {
    "presidential-office": "대통령실",
    "prime-minister-office": "국무총리실",
    cabinet: "내각",
    "other-core": "기타 핵심 인사",
  };

  const state = {
    compareMode: "asset",
    groupFilter: "all",
    assetBreakdownFilter: "all",
    sort: "desc",
    selectedOfficial: [...entries].sort((a, b) => b.totalAssetsManwon - a.totalAssetsManwon)[0].slug,
    myAnnualSalary: 8000,
    myNetWorth: 10000,
  };

  function formatManwon(value) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return "미공개";
    if (value >= 10000) {
      const eok = Number(value) / 10000;
      return `${Number.isInteger(eok) ? eok.toFixed(0) : eok.toFixed(1)}억원`;
    }
    return `${Number(value).toLocaleString("ko-KR")}만원`;
  }

  function formatRatio(value) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return "-";
    return `${Number(value).toLocaleString("ko-KR", { maximumFractionDigits: 1 })}배`;
  }

  function formatPercent(value) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return "미공개";
    return `${Number(value).toLocaleString("ko-KR", { maximumFractionDigits: 1 })}%`;
  }

  function getGroupLabel(group) {
    return groupLabels[group] || "기타 핵심 인사";
  }

  function getCompareLabel() {
    if (state.compareMode === "annualComp") return "연 보수";
    if (state.compareMode === "monthlyComp") return "월 보수";
    if (state.compareMode === "assetToComp") return "재산배수";
    return "총재산";
  }

  function getCompareValue(entry) {
    if (state.compareMode === "annualComp") return entry.annualCompManwon;
    if (state.compareMode === "monthlyComp") return entry.monthlyCompManwon;
    if (state.compareMode === "assetToComp") return entry.assetToComp;
    return entry.totalAssetsManwon;
  }

  function getCompareDisplay(entry) {
    if (state.compareMode === "assetToComp") return formatRatio(entry.assetToComp);
    return formatManwon(getCompareValue(entry));
  }

  function getBreakdownLabel() {
    if (state.assetBreakdownFilter === "real-estate") return "실물자산";
    if (state.assetBreakdownFilter === "financial") return "금융자산";
    if (state.assetBreakdownFilter === "debt") return "채무";
    return "전체 자산";
  }

  function getBreakdownValue(entry) {
    if (state.assetBreakdownFilter === "real-estate") {
      return Number(entry.buildingManwon || 0) + Number(entry.landManwon || 0) + Number(entry.jeonseRightManwon || 0);
    }
    if (state.assetBreakdownFilter === "financial") {
      return Number(entry.depositsManwon || 0) + Number(entry.securitiesManwon || 0);
    }
    if (state.assetBreakdownFilter === "debt") {
      return Number(entry.debtsManwon || 0);
    }
    return Number(entry.totalAssetsManwon || 0);
  }

  function filteredEntries() {
    let list = entries.slice();
    if (state.groupFilter !== "all") list = list.filter((entry) => entry.group === state.groupFilter);

    if (state.sort === "name") {
      list.sort((a, b) => a.personName.localeCompare(b.personName, "ko"));
      return list;
    }

    list.sort((a, b) => {
      const diff = getCompareValue(a) - getCompareValue(b);
      return state.sort === "asc" ? diff : -diff;
    });
    return list;
  }

  function setText(id, text) {
    const node = document.getElementById(id);
    if (node) node.textContent = text;
  }

  function renderSummaryBar() {
    const target = document.getElementById("govSummaryBar");
    if (!target) return;

    const list = filteredEntries();
    const values = list.map((entry) => Number(getCompareValue(entry)) || 0);
    const maxEntry = list[0];
    const minEntry = list[list.length - 1];
    const avg = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
    const avgDisplay = state.compareMode === "assetToComp" ? formatRatio(avg) : formatManwon(Math.round(avg));

    target.innerHTML = `
      <div class="gov-sum-cell"><div class="gov-sum-num">${list.length}<span>명</span></div><div class="gov-sum-label">표시 인물</div></div>
      <div class="gov-sum-cell"><div class="gov-sum-num">${maxEntry ? getCompareDisplay(maxEntry) : "-"}</div><div class="gov-sum-label">${getCompareLabel()} 상단</div></div>
      <div class="gov-sum-cell"><div class="gov-sum-num">${avgDisplay}</div><div class="gov-sum-label">${getCompareLabel()} 평균</div></div>
      <div class="gov-sum-cell"><div class="gov-sum-num">${minEntry ? getCompareDisplay(minEntry) : "-"}</div><div class="gov-sum-label">${getCompareLabel()} 하단</div></div>
    `;
  }

  function renderBreakdownBoard() {
    const target = document.getElementById("govBreakdownBoard");
    const label = document.getElementById("govBreakdownLabel");
    if (!target) return;

    if (label) label.textContent = `${getBreakdownLabel()} 기준으로 길이를 비교합니다.`;

    const list = filteredEntries();
    const max = Math.max(...list.map((entry) => getBreakdownValue(entry)), 1);
    target.innerHTML = list.map((entry) => {
      const value = getBreakdownValue(entry);
      const width = Math.max(6, Math.round((value / max) * 100));
      return `
        <article class="gov-breakdown-row ${entry.slug === state.selectedOfficial ? "is-selected" : ""}" data-official="${entry.slug}">
          <div class="gov-breakdown-row__meta"><strong>${entry.personName}</strong><span>${entry.roleTitle}</span></div>
          <div class="gov-breakdown-row__bar"><span style="width:${width}%"></span></div>
          <div class="gov-breakdown-row__value">${formatManwon(value)}</div>
        </article>
      `;
    }).join("");

    target.querySelectorAll("[data-official]").forEach((node) => {
      node.addEventListener("click", () => {
        const slug = node.getAttribute("data-official");
        if (!slug) return;
        state.selectedOfficial = slug;
        renderProfile();
        renderTable();
        renderBenchmark();
        syncControls();
      });
    });
  }

  function renderTable() {
    const target = document.getElementById("govCompareTableBody");
    if (!target) return;

    target.innerHTML = filteredEntries().map((entry) => `
      <tr data-official="${entry.slug}" class="${entry.slug === state.selectedOfficial ? "is-selected" : ""}">
        <td>${entry.personName}</td>
        <td>${entry.roleTitle}</td>
        <td>${getGroupLabel(entry.group)}</td>
        <td>${formatManwon(entry.totalAssetsManwon)}</td>
        <td>${formatManwon(entry.estimatedNetWorthManwon)}</td>
        <td>${formatPercent(entry.financialAssetShareKnown)}</td>
        <td>${formatManwon(entry.buildingManwon)}</td>
        <td>${formatManwon(entry.depositsManwon)}</td>
        <td>${formatManwon(entry.securitiesManwon)}</td>
        <td>${formatManwon(entry.debtsManwon)}</td>
        <td>${formatManwon(entry.annualCompManwon)}</td>
        <td>${formatRatio(entry.assetToComp)}</td>
      </tr>
    `).join("");

    target.querySelectorAll("tr[data-official]").forEach((row) => {
      row.addEventListener("click", () => {
        const slug = row.getAttribute("data-official");
        if (!slug) return;
        state.selectedOfficial = slug;
        renderProfile();
        renderTable();
        renderBenchmark();
        renderBreakdownBoard();
        syncControls();
      });
    });
  }

  function renderProfile() {
    const entry = entries.find((item) => item.slug === state.selectedOfficial);
    if (!entry) return;

    setText("govProfileName", entry.personName);
    setText("govProfileRole", entry.roleTitle);
    setText("govProfileGroup", getGroupLabel(entry.group));
    setText("govProfileSummary", entry.summary);
    setText("govProfileAssets", formatManwon(entry.totalAssetsManwon));
    setText("govProfileAnnualComp", formatManwon(entry.annualCompManwon));
    setText("govProfileMonthlyComp", formatManwon(entry.monthlyCompManwon));
    setText("govProfileAssetRatio", formatRatio(entry.assetToComp));
    setText("govProfileNetWorth", formatManwon(entry.estimatedNetWorthManwon));
    setText("govProfileFinancialShare", formatPercent(entry.financialAssetShareKnown));
    setText("govProfileBuilding", formatManwon(entry.buildingManwon));
    setText("govProfileLand", formatManwon(entry.landManwon));
    setText("govProfileJeonse", formatManwon(entry.jeonseRightManwon));
    setText("govProfileDeposits", formatManwon(entry.depositsManwon));
    setText("govProfileSecurities", formatManwon(entry.securitiesManwon));
    setText("govProfileDebts", formatManwon(entry.debtsManwon));
    setText("govProfileMemo", entry.memo || "기사 요약 기준 메모 없음");

    const tags = document.getElementById("govProfileTags");
    if (tags) tags.innerHTML = entry.tags.map((tag) => `<span>${tag}</span>`).join("");

    const source = document.getElementById("govProfileSource");
    if (source) {
      source.textContent = entry.sourceLabel;
      source.setAttribute("href", entry.sourceUrl);
    }
  }

  function renderBenchmark() {
    const entry = entries.find((item) => item.slug === state.selectedOfficial);
    if (!entry) return;

    const mySalary = Math.max(0, Number(state.myAnnualSalary) || 0);
    const myNetWorth = Math.max(0, Number(state.myNetWorth) || 0);
    const salaryMultiple = mySalary > 0 ? entry.annualCompManwon / mySalary : 0;
    const assetMultiple = myNetWorth > 0 ? entry.totalAssetsManwon / myNetWorth : 0;

    setText("govResultTitle", `${entry.personName} · ${entry.roleTitle} 비교`);
    setText("govSalaryMultiple", mySalary > 0 ? formatRatio(salaryMultiple) : "-");
    setText("govAssetMultiple", myNetWorth > 0 ? formatRatio(assetMultiple) : "-");
    setText("govYearsOfComp", formatRatio(entry.assetToComp));
    setText(
      "govResultComment",
      `${entry.personName}의 연 보수는 입력한 내 연봉 ${formatManwon(mySalary)} 대비 ${mySalary > 0 ? formatRatio(salaryMultiple) : "-"} 수준이고, 공개 총재산 ${formatManwon(entry.totalAssetsManwon)}은 내 자산 ${formatManwon(myNetWorth)} 대비 ${myNetWorth > 0 ? formatRatio(assetMultiple) : "-"}로 읽힙니다.`,
    );
  }

  let assetsChart = null;
  let ratioChart = null;

  function getBarColor(entry) {
    if (entry.group === "presidential-office") return "rgba(30, 64, 175, 0.78)";
    if (entry.group === "prime-minister-office") return "rgba(8, 145, 178, 0.78)";
    if (entry.group === "cabinet") return "rgba(15, 118, 110, 0.78)";
    return "rgba(71, 85, 105, 0.76)";
  }

  function buildOrUpdateCharts() {
    if (typeof Chart === "undefined") return;
    const list = filteredEntries();
    const assetsCanvas = document.getElementById("govAssetsChart");
    const ratioCanvas = document.getElementById("govAssetRatioChart");
    if (!assetsCanvas || !ratioCanvas) return;

    const labels = list.map((entry) => entry.personName);
    const assetData = list.map((entry) => entry.totalAssetsManwon);
    const ratioData = list.map((entry) => entry.assetToComp);
    const colors = list.map(getBarColor);

    const sharedOptions = {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { callback(value) { return `${Math.round(Number(value) / 10000)}억`; } } },
        y: { grid: { display: false } },
      },
    };

    if (!assetsChart) {
      assetsChart = new Chart(assetsCanvas, { type: "bar", data: { labels, datasets: [{ data: assetData, backgroundColor: colors, borderRadius: 10 }] }, options: sharedOptions });
    } else {
      assetsChart.data.labels = labels;
      assetsChart.data.datasets[0].data = assetData;
      assetsChart.data.datasets[0].backgroundColor = colors;
      assetsChart.update();
    }

    const ratioOptions = { ...sharedOptions, scales: { x: { ticks: { callback(value) { return `${Number(value).toLocaleString("ko-KR")}배`; } } }, y: { grid: { display: false } } } };
    if (!ratioChart) {
      ratioChart = new Chart(ratioCanvas, { type: "bar", data: { labels, datasets: [{ data: ratioData, backgroundColor: colors, borderRadius: 10 }] }, options: ratioOptions });
    } else {
      ratioChart.data.labels = labels;
      ratioChart.data.datasets[0].data = ratioData;
      ratioChart.data.datasets[0].backgroundColor = colors;
      ratioChart.options = ratioOptions;
      ratioChart.update();
    }
  }

  function syncControls() {
    const select = document.getElementById("govOfficialSelect");
    if (select) select.value = state.selectedOfficial;

    document.querySelectorAll("#govModeTabs .gov-tab").forEach((button) => button.classList.toggle("is-active", button.getAttribute("data-mode") === state.compareMode));
    document.querySelectorAll("#govGroupTabs .gov-chip").forEach((button) => button.classList.toggle("is-active", button.getAttribute("data-group") === state.groupFilter));
    document.querySelectorAll("#govBreakdownTabs .gov-chip").forEach((button) => button.classList.toggle("is-active", button.getAttribute("data-breakdown") === state.assetBreakdownFilter));
  }

  function bindEvents() {
    document.querySelectorAll("#govModeTabs .gov-tab").forEach((button) => {
      button.addEventListener("click", () => {
        state.compareMode = button.getAttribute("data-mode") || "asset";
        renderSummaryBar();
        renderTable();
        renderBreakdownBoard();
        buildOrUpdateCharts();
        syncControls();
      });
    });
    document.querySelectorAll("#govGroupTabs .gov-chip").forEach((button) => {
      button.addEventListener("click", () => {
        state.groupFilter = button.getAttribute("data-group") || "all";
        renderSummaryBar();
        renderTable();
        renderBreakdownBoard();
        buildOrUpdateCharts();
        syncControls();
      });
    });
    document.querySelectorAll("#govBreakdownTabs .gov-chip").forEach((button) => {
      button.addEventListener("click", () => {
        state.assetBreakdownFilter = button.getAttribute("data-breakdown") || "all";
        renderBreakdownBoard();
        syncControls();
      });
    });

    const sortSelect = document.getElementById("govSortSelect");
    if (sortSelect) sortSelect.addEventListener("change", (event) => { state.sort = event.target.value; renderSummaryBar(); renderTable(); renderBreakdownBoard(); buildOrUpdateCharts(); });

    const officialSelect = document.getElementById("govOfficialSelect");
    if (officialSelect) officialSelect.addEventListener("change", (event) => { state.selectedOfficial = event.target.value; renderProfile(); renderBenchmark(); renderTable(); renderBreakdownBoard(); });

    const mySalaryInput = document.getElementById("govMySalaryInput");
    if (mySalaryInput) mySalaryInput.addEventListener("input", (event) => { state.myAnnualSalary = Number(event.target.value) || 0; renderBenchmark(); });

    const myNetWorthInput = document.getElementById("govMyNetWorthInput");
    if (myNetWorthInput) myNetWorthInput.addEventListener("input", (event) => { state.myNetWorth = Number(event.target.value) || 0; renderBenchmark(); });
  }

  function init() {
    renderSummaryBar();
    renderBreakdownBoard();
    renderTable();
    renderProfile();
    renderBenchmark();
    buildOrUpdateCharts();
    syncControls();
    bindEvents();
  }

  init();
})();
