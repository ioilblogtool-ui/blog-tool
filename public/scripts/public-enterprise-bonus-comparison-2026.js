(() => {
  const root = document.querySelector(".pebc-page");
  const dataEl = document.getElementById("pebc-data");
  if (!root || !dataEl) return;

  const cfg = JSON.parse(dataEl.textContent || "{}");
  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => Array.from(root.querySelectorAll(selector));
  const initialState = {
    salary: Number(cfg.baseSalary || 60000000),
    viewMode: "gross",
    typeFilter: "all",
    industryFilter: "all",
    sortBy: "grossBonus",
  };
  let state = { ...initialState };

  function num(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function clampSalary(value) {
    return Math.min(Math.max(value, Number(cfg.minSalary || 0)), Number(cfg.maxSalary || 200000000));
  }

  function manwon(value) {
    const abs = Math.abs(value);
    if (abs >= 100000000) return `${(value / 100000000).toFixed(1)}억 원`;
    return `${Math.round(value / 10000).toLocaleString("ko-KR")}만 원`;
  }

  function percent(value) {
    return `${Number(value).toFixed(1)}%`;
  }

  function calcEntry(entry) {
    const grossBonus = state.salary * (entry.defaultSalaryPercent / 100);
    const netBonus = grossBonus * (1 - Number(cfg.taxRate || 0.22));
    return {
      ...entry,
      grossBonus,
      netBonus,
      monthlyEquivalent: grossBonus / 12,
      displayBonus: state.viewMode === "net" ? netBonus : grossBonus,
      typeLabel: cfg.typeLabels[entry.type] || entry.type,
      industryLabel: cfg.industryLabels[entry.industry] || entry.industry,
      confidenceLabel: cfg.confidenceLabels[entry.dataConfidence] || "추정",
      evaluationLabel: cfg.evaluationLabels[entry.evaluationSensitivity] || "확인 필요",
    };
  }

  function visibleRows() {
    return (cfg.entries || [])
      .filter((entry) => state.typeFilter === "all" || entry.type === state.typeFilter)
      .filter((entry) => state.industryFilter === "all" || entry.industry === state.industryFilter)
      .map(calcEntry)
      .sort((a, b) => {
        if (state.sortBy === "name") return a.shortName.localeCompare(b.shortName, "ko-KR");
        if (state.sortBy === "netBonus") return b.netBonus - a.netBonus;
        if (state.sortBy === "salaryPercent") return b.defaultSalaryPercent - a.defaultSalaryPercent;
        return b.grossBonus - a.grossBonus;
      });
  }

  function summary(rows) {
    if (!rows.length) return null;
    const top = rows.reduce((best, row) => (row.displayBonus > best.displayBonus ? row : best), rows[0]);
    const bottom = rows.reduce((low, row) => (row.displayBonus < low.displayBonus ? row : low), rows[0]);
    const averagePercent = rows.reduce((sum, row) => sum + row.defaultSalaryPercent, 0) / rows.length;
    const averageBonus = rows.reduce((sum, row) => sum + row.displayBonus, 0) / rows.length;
    return { top, bottom, averagePercent, averageBonus, gap: top.displayBonus - bottom.displayBonus, count: rows.length };
  }

  function renderKpis(rows) {
    const data = summary(rows);
    if (!data) return;
    $('[data-pebc-result="topName"]').textContent = data.top.shortName;
    $('[data-pebc-result="topBonus"]').textContent = `${state.viewMode === "net" ? "세후 추정" : "세전 추정"} ${manwon(data.top.displayBonus)}`;
    $('[data-pebc-result="count"]').textContent = `${data.count}개`;
    $('[data-pebc-result="averagePercent"]').textContent = percent(data.averagePercent);
    $('[data-pebc-result="averageBonus"]').textContent = `${state.viewMode === "net" ? "세후" : "세전"} 평균 ${manwon(data.averageBonus)}`;
    $('[data-pebc-result="gap"]').textContent = manwon(data.gap);
    $('[data-pebc-summary]').textContent =
      `기준 연봉 ${manwon(state.salary)}으로 단순 환산하면, 현재 필터의 평균 성과급률은 ${percent(data.averagePercent)}이고 ${data.top.shortName}이 가장 높게 나타납니다. 이 값은 개인별 실제 지급액이 아니라 입력 연봉 기준 추정입니다.`;
  }

  function renderChart(rows) {
    const target = $('[data-pebc-chart]');
    const max = Math.max(...rows.map((row) => row.displayBonus), 1);
    target.innerHTML = rows.map((row) => {
      const width = Math.max((row.displayBonus / max) * 100, 4);
      return `
        <article class="pebc-chart-row">
          <div>
            <strong>${row.shortName}</strong>
            <span>${row.industryLabel} · ${row.typeLabel}</span>
          </div>
          <span class="pebc-chart-row__bar"><i style="width:${width}%"></i></span>
          <em>${manwon(row.displayBonus)}</em>
        </article>
      `;
    }).join("");
  }

  function badgeClass(value) {
    if (value === "officialAverage") return "official";
    if (value === "simulated") return "simulation";
    return "check";
  }

  function renderTable(rows) {
    const target = $('[data-pebc-table-body]');
    target.innerHTML = rows.map((row, index) => `
      <tr>
        <td>${index + 1}</td>
        <th><strong>${row.shortName}</strong><small>${row.name}</small></th>
        <td>${row.typeLabel}</td>
        <td>${row.industryLabel}</td>
        <td>${percent(row.defaultSalaryPercent)}</td>
        <td>${manwon(row.grossBonus)}</td>
        <td>${manwon(row.netBonus)}</td>
        <td>${row.evaluationLabel}</td>
        <td><span class="pebc-badge pebc-badge--${badgeClass(row.dataConfidence)}">${row.confidenceLabel}</span></td>
        <td>${row.caution}</td>
      </tr>
    `).join("");
  }

  function readState() {
    const salaryEl = $('[data-pebc="salary"]');
    if (salaryEl) state.salary = clampSalary(num(salaryEl.value, initialState.salary));
    state.viewMode = $('[name="pebcViewMode"]:checked')?.value || "gross";
    state.typeFilter = $('[data-pebc="typeFilter"]')?.value || "all";
    state.industryFilter = $('[data-pebc="industryFilter"]')?.value || "all";
    state.sortBy = $('[data-pebc="sortBy"]')?.value || "grossBonus";
  }

  function setControls() {
    const salaryEl = $('[data-pebc="salary"]');
    if (salaryEl) salaryEl.value = state.salary.toLocaleString("ko-KR");
    $$('[name="pebcViewMode"]').forEach((el) => { el.checked = el.value === state.viewMode; });
    const typeEl = $('[data-pebc="typeFilter"]');
    const industryEl = $('[data-pebc="industryFilter"]');
    const sortEl = $('[data-pebc="sortBy"]');
    if (typeEl) typeEl.value = state.typeFilter;
    if (industryEl) industryEl.value = state.industryFilter;
    if (sortEl) sortEl.value = state.sortBy;
  }

  function updateUrl() {
    const params = new URLSearchParams();
    params.set("salary", String(Math.round(state.salary)));
    if (state.viewMode !== "gross") params.set("view", state.viewMode);
    if (state.typeFilter !== "all") params.set("type", state.typeFilter);
    if (state.industryFilter !== "all") params.set("ind", state.industryFilter);
    if (state.sortBy !== "grossBonus") params.set("sort", state.sortBy);
    const query = params.toString();
    history.replaceState({}, "", `${location.pathname}${query ? `?${query}` : ""}`);
  }

  function restoreFromUrl() {
    const params = new URLSearchParams(location.search);
    if (params.has("salary")) state.salary = clampSalary(num(params.get("salary"), initialState.salary));
    if (params.has("view")) state.viewMode = params.get("view") === "net" ? "net" : "gross";
    if (params.has("type")) state.typeFilter = params.get("type") || "all";
    if (params.has("ind")) state.industryFilter = params.get("ind") || "all";
    if (params.has("sort")) state.sortBy = params.get("sort") || "grossBonus";
    setControls();
  }

  function refresh() {
    readState();
    setControls();
    const rows = visibleRows();
    renderKpis(rows);
    renderChart(rows);
    renderTable(rows);
    updateUrl();
  }

  $$("[data-pebc]").forEach((el) => {
    el.addEventListener("input", refresh);
    el.addEventListener("change", refresh);
  });

  $$('[name="pebcViewMode"]').forEach((el) => {
    el.addEventListener("change", refresh);
  });

  $("#pebcResetBtn")?.addEventListener("click", () => {
    state = { ...initialState };
    setControls();
    refresh();
  });

  $("#pebcCopyBtn")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      $("#pebcCopyBtn").textContent = "링크 복사 완료";
      setTimeout(() => { $("#pebcCopyBtn").textContent = "링크 복사"; }, 1600);
    } catch {
      $("#pebcCopyBtn").textContent = "복사 실패";
    }
  });

  restoreFromUrl();
  refresh();
})();
