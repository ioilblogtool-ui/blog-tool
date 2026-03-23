// new-employee-salary-2026.js
// 신입사원 초봉 비교 리포트 클라이언트 스크립트

(function () {
  const raw = document.getElementById("salaryReportData");
  if (!raw) return;
  const seed = JSON.parse(raw.textContent || "{}");
  const entries = seed.entries || [];

  // ── 색상 맵 ─────────────────────────────────────────────────────────────
  const SECTOR_COLORS = {
    it:            "rgba(16, 185, 129, 0.82)",
    semiconductor: "rgba(37,  99, 235, 0.82)",
    auto:          "rgba(245, 158, 11, 0.82)",
    finance:       "rgba(99,  102, 241, 0.82)",
    conglomerate:  "rgba(239, 68,  68, 0.82)",
    steel:         "rgba(107, 114, 128, 0.82)",
    public:        "rgba(20,  184, 166, 0.82)",
    average:       "rgba(156, 163, 175, 0.82)",
  };

  function colorOf(entry) {
    return SECTOR_COLORS[entry.sectorType] || "rgba(156, 163, 175, 0.82)";
  }

  function formatKrwM(m) {
    if (m >= 10000) {
      const uk = m / 10000;
      return (uk % 1 === 0 ? uk : uk.toFixed(1)) + "억원";
    }
    return m.toLocaleString("ko-KR") + "만원";
  }

  // ── 개요 바 차트 ─────────────────────────────────────────────────────────
  const overviewCanvas = document.getElementById("salaryOverviewCanvas");
  let overviewChart = null;

  function buildOverviewChart() {
    if (!overviewCanvas) return;
    const sorted = [...entries].sort((a, b) => b.annualKrwM - a.annualKrwM);
    const labels = sorted.map((e) => e.name);
    const data   = sorted.map((e) => e.annualKrwM);
    const colors = sorted.map((e) => colorOf(e));

    overviewChart = new Chart(overviewCanvas, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "기본급 기준 연봉 (만원)",
            data,
            backgroundColor: colors,
            borderRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        onClick(_evt, elements) {
          if (!elements.length) return;
          const idx = elements[0].index;
          const slug = sorted[idx].slug;
          setSelected(slug);
          document
            .getElementById("salaryProfileCard")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label(ctx) {
                const entry = sorted[ctx.dataIndex];
                const net = entry.monthlyNetKrwM;
                return [
                  ` 연봉: ${formatKrwM(ctx.parsed.x)}`,
                  ` 월 실수령 추정: 약 ${net}만원`,
                  entry.totalCompM
                    ? ` 총보상 추정: 약 ${formatKrwM(entry.totalCompM)}`
                    : "",
                ].filter(Boolean);
              },
            },
          },
        },
        scales: {
          x: {
            grid: { color: "rgba(0,0,0,0.06)" },
            ticks: {
              callback(v) {
                return v >= 10000
                  ? (v / 10000).toFixed(v % 10000 === 0 ? 0 : 1) + "억"
                  : (v / 10000).toFixed(1) + "억";
              },
            },
          },
          y: {
            grid: { display: false },
            ticks: { font: { size: 13 } },
          },
        },
      },
    });
  }

  // ── 월 실수령 바 차트 ────────────────────────────────────────────────────
  const netCanvas = document.getElementById("salaryNetCanvas");

  function buildNetChart() {
    if (!netCanvas) return;
    const sorted = [...entries].sort((a, b) => b.monthlyNetKrwM - a.monthlyNetKrwM);
    const labels = sorted.map((e) => e.name);
    const data   = sorted.map((e) => e.monthlyNetKrwM);
    const colors = sorted.map((e) => colorOf(e));

    new Chart(netCanvas, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "월 실수령 추정 (만원)",
            data,
            backgroundColor: colors,
            borderRadius: 5,
          },
        ],
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
                return ` 월 실수령 추정: 약 ${ctx.parsed.x}만원`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: { color: "rgba(0,0,0,0.06)" },
            ticks: {
              callback(v) { return v + "만"; },
            },
          },
          y: {
            grid: { display: false },
            ticks: { font: { size: 13 } },
          },
        },
      },
    });
  }

  // ── 프로필 업데이트 ──────────────────────────────────────────────────────
  function setSelected(slug) {
    const entry = entries.find((e) => e.slug === slug);
    if (!entry) return;

    setText("profileName",        entry.name);
    setText("profileNameEn",      entry.nameEn);
    setText("profileRank",        entry.rank + "위");
    setText("profileAnnual",      formatKrwM(entry.annualKrwM));
    setText("profileSector",      entry.sector);
    setText("profileMonthlyNet",  "약 " + entry.monthlyNetKrwM + "만원");
    setText("profileTotal",       entry.totalCompM ? "약 " + formatKrwM(entry.totalCompM) : "–");
    setText("profileSectorDetail",entry.sector);
    setText("profileMonthlyGross",Math.round(entry.annualKrwM / 12) + "만원");
    setText("profileSummary",     entry.summary);

    const tagsEl = document.getElementById("profileTags");
    if (tagsEl) {
      tagsEl.innerHTML = entry.tags.map((t) => `<span>${t}</span>`).join("");
    }

    const benefitsEl = document.getElementById("profileBenefits");
    if (benefitsEl) {
      benefitsEl.innerHTML = entry.benefits.map((b) => `<li>${b}</li>`).join("");
    }

    const selectEl = document.getElementById("salaryCompanySelect");
    if (selectEl) selectEl.value = slug;
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  // ── 셀렉트 이벤트 ───────────────────────────────────────────────────────
  const selectEl = document.getElementById("salaryCompanySelect");
  if (selectEl) {
    selectEl.addEventListener("change", (e) => {
      setSelected(e.target.value);
    });
  }

  // ── 인터랙티브 바 차트 ──────────────────────────────────────────────────
  const interactiveData = seed.interactiveData || [];
  const AVG_SAL = 3800;
  const MAX_SAL_I = Math.max(...interactiveData.map((x) => x.sal), 1);

  let curFilter = "all";
  let curSort   = "desc";
  let mySal     = null;

  const TIER_META = {
    s: { label: "S티어 · 9,000만 이상",      color: "#9FE1CB" },
    a: { label: "A티어 · 6,000 ~ 9,000만",   color: "#C0DD97" },
    b: { label: "B티어 · 5,000 ~ 6,500만",   color: "#D3D1C7" },
    c: { label: "C티어 · 5,000만 미만",       color: "#FAC775" },
  };
  const TIER_FILL = { s: "sal-ts", a: "sal-ta", b: "sal-tb", c: "sal-tc" };

  function getFiltered() {
    let d = curFilter === "all"
      ? [...interactiveData]
      : interactiveData.filter((x) => x.cat === curFilter);
    if (curSort === "desc") d.sort((a, b) => b.sal - a.sal);
    else if (curSort === "asc") d.sort((a, b) => a.sal - b.sal);
    else d.sort((a, b) => a.name.localeCompare(b.name, "ko"));
    return d;
  }

  function renderInteractiveChart() {
    const area = document.getElementById("salaryInteractiveChart");
    if (!area) return;
    const filtered = getFiltered();

    // 요약 통계
    const sbar = document.getElementById("salarySummaryBar");
    if (sbar) {
      const allSals = filtered.map((x) => x.sal);
      const avg = allSals.length ? Math.round(allSals.reduce((a, b) => a + b, 0) / allSals.length) : 0;
      const max = allSals.length ? Math.max(...allSals) : 0;
      const min = allSals.length ? Math.min(...allSals) : 0;
      sbar.innerHTML = `
        <div class="sal-sum-cell"><div class="sal-sum-num">${filtered.length}<span style="font-size:13px">개</span></div><div class="sal-sum-label">표시 기업</div></div>
        <div class="sal-sum-cell"><div class="sal-sum-num" style="color:#1D9E75;">${max.toLocaleString()}<span style="font-size:11px">만</span></div><div class="sal-sum-label">최고 영끌</div></div>
        <div class="sal-sum-cell"><div class="sal-sum-num">${avg.toLocaleString()}<span style="font-size:11px">만</span></div><div class="sal-sum-label">필터 평균</div></div>
        <div class="sal-sum-cell"><div class="sal-sum-num" style="color:#BA7517;">${min.toLocaleString()}<span style="font-size:11px">만</span></div><div class="sal-sum-label">최저 영끌</div></div>
      `;
    }

    // 바 차트 렌더
    let html = "";
    for (const tier of ["s", "a", "b", "c"]) {
      const rows = filtered.filter((x) => x.tier === tier);
      if (!rows.length) continue;
      html += `<div class="sal-tier-label"><span style="width:8px;height:8px;border-radius:50%;background:${TIER_META[tier].color};display:inline-block;flex-shrink:0;"></span>${TIER_META[tier].label}</div>`;
      for (const co of rows) {
        const pct   = Math.round((co.sal / MAX_SAL_I) * 100);
        const myPct = mySal ? Math.round((mySal / MAX_SAL_I) * 100) : null;
        html += `<div class="sal-bar-row">
          <div class="sal-bar-company" title="${co.name}">${co.name}</div>
          <div class="sal-bar-track">
            <div class="sal-bar-fill ${TIER_FILL[tier]}" style="width:${pct}%">
              <span class="sal-bar-val">${co.sal.toLocaleString()}만</span>
              ${co.note ? `<span class="sal-bar-tag">${co.note}</span>` : ""}
            </div>
            ${myPct !== null ? `<div class="sal-my-line" style="left:${myPct}%;"></div>` : ""}
          </div>
        </div>`;
      }
    }
    area.innerHTML = html;
  }

  function updateMyPos() {
    const input = document.getElementById("mySalInput");
    const hint  = document.getElementById("mySalHint");
    const card  = document.getElementById("salaryResultCard");
    if (!input) return;
    const val = parseInt(input.value);
    if (!val || val < 500) {
      mySal = null;
      if (card) card.style.display = "none";
      if (hint) hint.textContent = "입력하면 차트에 위치를 표시해드려요";
      renderInteractiveChart();
      return;
    }
    mySal = val;
    renderInteractiveChart();

    const allSals = interactiveData.map((x) => x.sal).sort((a, b) => a - b);
    const rank    = allSals.filter((s) => s <= val).length;
    const pct     = Math.round((rank / allSals.length) * 100);
    const diff    = val - AVG_SAL;
    const diffStr = diff >= 0 ? `+${diff.toLocaleString()}만` : `${diff.toLocaleString()}만`;
    const tier    = val >= 9000 ? "S" : val >= 6000 ? "A" : val >= 5000 ? "B" : "C";

    const similar = interactiveData.filter((x) => Math.abs(x.sal - val) <= 500).slice(0, 4).map((x) => x.name);
    const above   = interactiveData.filter((x) => x.sal > val).sort((a, b) => a.sal - b.sal).slice(0, 2).map((x) => `${x.name}(${x.sal.toLocaleString()}만)`);

    setText("salaryResultTitle", `내 연봉 ${val.toLocaleString()}만원 기준 위치`);
    setText("r-pct",  `${pct}%`);
    setText("r-diff", diffStr);
    setText("r-tier", tier + "티어");

    const simEl = document.getElementById("similarText");
    if (simEl) {
      let simHTML = "";
      if (similar.length) simHTML += `비슷한 수준의 기업: <strong>${similar.join(", ")}</strong><br>`;
      if (above.length)   simHTML += `<small>바로 위 기업: ${above.join(" · ")}</small>`;
      simEl.innerHTML = simHTML || "비교 구간 내 데이터가 없습니다.";
    }

    if (hint) hint.innerHTML = `<strong>상위 ${pct}%</strong> · 평균 대비 ${diffStr} · ${tier}티어`;
    if (card) card.style.display = "block";
  }

  // 필터 탭 이벤트
  document.querySelectorAll(".salary-ftab").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".salary-ftab").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      curFilter = btn.dataset.filter || "all";
      renderInteractiveChart();
    });
  });

  // 정렬 이벤트
  const sortSel = document.getElementById("salarySort");
  if (sortSel) sortSel.addEventListener("change", (e) => { curSort = e.target.value; renderInteractiveChart(); });

  // 내 연봉 입력 이벤트
  const mySalInput = document.getElementById("mySalInput");
  if (mySalInput) mySalInput.addEventListener("input", updateMyPos);

  // 인터랙티브 차트 초기 렌더 (Chart.js 의존 없음)
  if (interactiveData.length > 0) {
    const resultCard = document.getElementById("salaryResultCard");
    if (resultCard) resultCard.style.display = "none";
    renderInteractiveChart();
  }

  // ── 초기화 ──────────────────────────────────────────────────────────────
  if (typeof Chart !== "undefined") {
    buildOverviewChart();
    buildNetChart();
  } else {
    // Chart.js 로드 대기
    const scriptEls = document.querySelectorAll("script[src*='chart.js']");
    const chartScript = scriptEls[scriptEls.length - 1];
    if (chartScript) {
      chartScript.addEventListener("load", () => {
        buildOverviewChart();
        buildNetChart();
      });
    }
  }
})();
