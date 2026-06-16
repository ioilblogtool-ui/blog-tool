(() => {
  const root = document.querySelector(".rfbc-page");
  const dataEl = document.getElementById("rfbc-data");
  if (!root || !dataEl) return;

  const cfg = JSON.parse(dataEl.textContent || "{}");
  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => Array.from(root.querySelectorAll(selector));
  const initialState = {
    salary: Number(cfg.baseSalary || 50000000),
    jobType: "office",
    viewMode: "gross",
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
    if (abs >= 100000000) return `${(value / 100000000).toFixed(1)}억원`;
    return `${Math.round(value / 10000).toLocaleString("ko-KR")}만원`;
  }

  function percent(value) {
    return `${Number(value).toFixed(1)}%`;
  }

  function calcEntry(entry) {
    const adjustment = Number(entry.jobTypeAdjustments?.[state.jobType] ?? 1);
    const adjustedPercent = Number(entry.defaultSalaryPercent || 0) * adjustment;
    const grossBonus = state.salary * (adjustedPercent / 100);
    const netBonus = grossBonus * (1 - Number(cfg.taxRate || 0.22));
    const representative = Array.isArray(entry.representativeJobTypes) && entry.representativeJobTypes.includes(state.jobType);
    return {
      ...entry,
      adjustment,
      adjustedPercent,
      grossBonus,
      netBonus,
      displayBonus: state.viewMode === "net" ? netBonus : grossBonus,
      industryLabel: cfg.industryLabels?.[entry.industry] || entry.industry,
      jobTypeLabel: cfg.jobTypeLabels?.[state.jobType] || state.jobType,
      confidenceLabel: cfg.confidenceLabels?.[entry.dataConfidence] || "확인 필요",
      jobSupportLabel: representative ? "대표 직군" : "참고 직군",
      isRepresentativeJob: representative,
    };
  }

  function visibleRows() {
    return (cfg.entries || [])
      .filter((entry) => state.industryFilter === "all" || entry.industry === state.industryFilter)
      .map(calcEntry)
      .sort((a, b) => {
        if (state.sortBy === "name") return a.shortName.localeCompare(b.shortName, "ko-KR");
        if (state.sortBy === "netBonus") return b.netBonus - a.netBonus;
        if (state.sortBy === "adjustedPercent") return b.adjustedPercent - a.adjustedPercent;
        return b.grossBonus - a.grossBonus;
      });
  }

  function summary(rows) {
    if (!rows.length) return null;
    const top = rows.reduce((best, row) => (row.displayBonus > best.displayBonus ? row : best), rows[0]);
    const bottom = rows.reduce((low, row) => (row.displayBonus < low.displayBonus ? row : low), rows[0]);
    const averagePercent = rows.reduce((sum, row) => sum + row.adjustedPercent, 0) / rows.length;
    const averageBonus = rows.reduce((sum, row) => sum + row.displayBonus, 0) / rows.length;
    const referenceCount = rows.filter((row) => !row.isRepresentativeJob).length;
    return {
      top,
      bottom,
      averagePercent,
      averageBonus,
      gap: top.displayBonus - bottom.displayBonus,
      count: rows.length,
      referenceCount,
    };
  }

  function renderEmpty() {
    const fallback = "조건에 맞는 기업 없음";
    $('[data-rfbc-result="topName"]').textContent = fallback;
    $('[data-rfbc-result="topBonus"]').textContent = "필터를 다시 선택해 주세요";
    $('[data-rfbc-result="count"]').textContent = "0개";
    $('[data-rfbc-result="averagePercent"]').textContent = "0.0%";
    $('[data-rfbc-result="averageBonus"]').textContent = "평균 없음";
    $('[data-rfbc-result="jobSupport"]').textContent = "비교 불가";
    $('[data-rfbc-result="gap"]').textContent = "차이 없음";
    $('[data-rfbc-summary]').textContent = "현재 조건에 맞는 기업이 없습니다. 업종 필터를 전체로 바꾸면 다시 비교할 수 있습니다.";
    $('[data-rfbc-chart]').innerHTML = '<p class="rfbc-empty">조건에 맞는 기업이 없습니다.</p>';
    $('[data-rfbc-table-body]').innerHTML = '<tr><td colspan="11">조건에 맞는 기업이 없습니다.</td></tr>';
  }

  function renderKpis(rows) {
    const data = summary(rows);
    if (!data) {
      renderEmpty();
      return;
    }

    const viewLabel = state.viewMode === "net" ? "세후 추정" : "세전 추정";
    $('[data-rfbc-result="topName"]').textContent = data.top.shortName;
    $('[data-rfbc-result="topBonus"]').textContent = `${viewLabel} ${manwon(data.top.displayBonus)}`;
    $('[data-rfbc-result="count"]').textContent = `${data.count}개`;
    $('[data-rfbc-result="averagePercent"]').textContent = percent(data.averagePercent);
    $('[data-rfbc-result="averageBonus"]').textContent = `${state.viewMode === "net" ? "세후" : "세전"} 평균 ${manwon(data.averageBonus)}`;
    $('[data-rfbc-result="jobSupport"]').textContent = data.referenceCount > 0 ? `참고 직군 ${data.referenceCount}개 포함` : "대표 직군 중심";
    $('[data-rfbc-result="gap"]').textContent = `최고·최저 차이 ${manwon(data.gap)}`;
    $('[data-rfbc-summary]').textContent =
      `기준 연봉 ${manwon(state.salary)}, ${data.top.jobTypeLabel} 기준으로 비교하면 ${data.top.shortName}의 ${viewLabel}액이 가장 높게 표시됩니다. ` +
      `평균 보정 성과급률은 ${percent(data.averagePercent)}이며, 이 값은 공식 지급액이 아니라 입력 연봉 기준 참고 추정값입니다.`;
  }

  function renderChart(rows) {
    const target = $('[data-rfbc-chart]');
    const max = Math.max(...rows.map((row) => row.displayBonus), 1);
    target.innerHTML = rows.map((row) => {
      const width = Math.max((row.displayBonus / max) * 100, 4);
      return `
        <article class="rfbc-chart-row">
          <div>
            <strong>${row.shortName}</strong>
            <span>${row.industryLabel} · ${row.jobTypeLabel} · ${row.jobSupportLabel}</span>
          </div>
          <span class="rfbc-chart-row__bar"><i style="width:${width}%"></i></span>
          <em>${manwon(row.displayBonus)}</em>
        </article>
      `;
    }).join("");
  }

  function badgeClass(value) {
    if (value === "publicReference") return "official";
    if (value === "reviewBased") return "review";
    if (value === "simulated") return "simulation";
    return "check";
  }

  function renderTable(rows) {
    const target = $('[data-rfbc-table-body]');
    target.innerHTML = rows.map((row, index) => `
      <tr>
        <td>${index + 1}</td>
        <th><strong>${row.shortName}</strong><small>${row.name}</small></th>
        <td>${row.industryLabel}</td>
        <td>${row.jobTypeLabel} · ${row.jobSupportLabel}</td>
        <td>${percent(row.defaultSalaryPercent)}</td>
        <td>${percent(row.adjustedPercent)}</td>
        <td>${manwon(row.grossBonus)}</td>
        <td>${manwon(row.netBonus)}</td>
        <td><span class="rfbc-badge rfbc-badge--${badgeClass(row.dataConfidence)}">${row.confidenceLabel}</span></td>
        <td>${row.structureNote}</td>
        <td>${row.caution}</td>
      </tr>
    `).join("");
  }

  function readState() {
    const salaryEl = $('[data-rfbc="salary"]');
    if (salaryEl) state.salary = clampSalary(num(salaryEl.value, initialState.salary));
    state.jobType = $('[data-rfbc="jobType"]')?.value || "office";
    state.viewMode = $('[name="rfbcViewMode"]:checked')?.value || "gross";
    state.industryFilter = $('[data-rfbc="industryFilter"]')?.value || "all";
    state.sortBy = $('[data-rfbc="sortBy"]')?.value || "grossBonus";
  }

  function setControls() {
    const salaryEl = $('[data-rfbc="salary"]');
    if (salaryEl) salaryEl.value = state.salary.toLocaleString("ko-KR");
    $$('[name="rfbcViewMode"]').forEach((el) => {
      el.checked = el.value === state.viewMode;
    });
    const jobEl = $('[data-rfbc="jobType"]');
    const industryEl = $('[data-rfbc="industryFilter"]');
    const sortEl = $('[data-rfbc="sortBy"]');
    if (jobEl) jobEl.value = state.jobType;
    if (industryEl) industryEl.value = state.industryFilter;
    if (sortEl) sortEl.value = state.sortBy;
  }

  function updateUrl() {
    const params = new URLSearchParams();
    params.set("salary", String(Math.round(state.salary)));
    if (state.jobType !== "office") params.set("job", state.jobType);
    if (state.viewMode !== "gross") params.set("view", state.viewMode);
    if (state.industryFilter !== "all") params.set("ind", state.industryFilter);
    if (state.sortBy !== "grossBonus") params.set("sort", state.sortBy);
    const query = params.toString();
    history.replaceState({}, "", `${location.pathname}${query ? `?${query}` : ""}`);
  }

  function restoreFromUrl() {
    const params = new URLSearchParams(location.search);
    if (params.has("salary")) state.salary = clampSalary(num(params.get("salary"), initialState.salary));
    if (params.has("job")) state.jobType = params.get("job") || "office";
    if (params.has("view")) state.viewMode = params.get("view") === "net" ? "net" : "gross";
    if (params.has("ind")) state.industryFilter = params.get("ind") || "all";
    if (params.has("sort")) state.sortBy = params.get("sort") || "grossBonus";
    setControls();
  }

  function refresh() {
    readState();
    setControls();
    const rows = visibleRows();
    renderKpis(rows);
    if (rows.length) {
      renderChart(rows);
      renderTable(rows);
    }
    updateUrl();
  }

  $$("[data-rfbc]").forEach((el) => {
    el.addEventListener("input", refresh);
    el.addEventListener("change", refresh);
  });

  $$('[name="rfbcViewMode"]').forEach((el) => {
    el.addEventListener("change", refresh);
  });

  $("#rfbcResetBtn")?.addEventListener("click", () => {
    state = { ...initialState };
    setControls();
    refresh();
  });

  $("#rfbcCopyBtn")?.addEventListener("click", async () => {
    const button = $("#rfbcCopyBtn");
    try {
      await navigator.clipboard.writeText(location.href);
      button.textContent = "링크 복사 완료";
      setTimeout(() => {
        button.textContent = "링크 복사";
      }, 1600);
    } catch {
      button.textContent = "복사 실패";
    }
  });

  restoreFromUrl();
  refresh();
})();
