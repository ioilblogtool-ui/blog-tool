(() => {
  const root = document.querySelector(".ist-page");
  if (!root) return;

  const dataEl = document.getElementById("ist-data");
  if (!dataEl) return;
  const { schools } = JSON.parse(dataEl.textContent);

  const $ = (selector) => root.querySelector(selector);

  const regionSelect = $('[data-ist="region"]');
  const schoolSelect = $('[data-ist="school"]');
  const gradeSelect = $('[data-ist="grade"]');
  const boardingToggle = $('[data-ist="boarding"]');
  const boardingRow = document.getElementById("istBoardingRow");
  const childrenInput = $('[data-ist="children"]');
  const incomeInput = $('[data-ist="income"]');
  const fxRateInput = $('[data-ist="fxrate"]');
  const yearsInput = $('[data-ist="years"]');

  function num(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function fmtKrw(n) {
    if (n >= 100_000_000) return (n / 100_000_000).toFixed(2) + "억원";
    if (n >= 10_000) return Math.round(n / 10_000).toLocaleString("ko-KR") + "만원";
    return Math.round(n).toLocaleString("ko-KR") + "원";
  }

  function currentSchool() {
    return schools.find((s) => s.id === schoolSelect.value) ?? schools[0];
  }

  function currentTier(school) {
    return school.tuitionTiers.find((t) => t.tierKey === gradeSelect.value) ?? school.tuitionTiers[0];
  }

  function burdenLevel(ratio) {
    if (ratio === null) return "-";
    const r = Number(ratio);
    if (r < 20) return "여유";
    if (r < 35) return "보통";
    if (r < 50) return "높음";
    return "매우 높음";
  }

  // 대표 학년(첫 번째 tier) 기준, 기숙 미포함 연간 학비를 같은 환율로 계산 — 학교 간 비교용
  function representativeAnnualKrw(school, fxRate) {
    const tier = school.tuitionTiers[0];
    return Math.round(tier.krwPortion + tier.usdPortion * fxRate);
  }

  let compareChart = null;

  function renderChart(fxRate, selectedSchoolId) {
    const canvas = document.getElementById("istCompareChart");
    if (!canvas || !window.Chart) return;

    const rows = schools.map((s) => ({
      id: s.id,
      name: s.name,
      region: s.region,
      value: representativeAnnualKrw(s, fxRate),
    }));

    const colorFor = (row) => {
      if (row.id === selectedSchoolId) return "rgba(26, 86, 219, 0.95)";
      return row.region === "jeju" ? "rgba(15, 110, 86, 0.55)" : "rgba(107, 114, 128, 0.55)";
    };

    if (compareChart) {
      compareChart.data.labels = rows.map((r) => r.name);
      compareChart.data.datasets[0].data = rows.map((r) => Math.round(r.value / 10000));
      compareChart.data.datasets[0].backgroundColor = rows.map(colorFor);
      compareChart.update();
      return;
    }

    compareChart = new window.Chart(canvas, {
      type: "bar",
      data: {
        labels: rows.map((r) => r.name),
        datasets: [
          {
            label: "대표 학년 연간 학비(만원)",
            data: rows.map((r) => Math.round(r.value / 10000)),
            backgroundColor: rows.map(colorFor),
            borderRadius: 6,
            maxBarThickness: 36,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label(context) {
                return `연간 학비: ${Number(context.raw || 0).toLocaleString("ko-KR")}만원`;
              },
            },
          },
        },
        scales: {
          x: { ticks: { color: "#4b5563", maxRotation: 45, minRotation: 25 }, grid: { display: false } },
          y: {
            beginAtZero: true,
            ticks: { color: "#6b7280", callback: (v) => `${Number(v).toLocaleString("ko-KR")}만` },
            grid: { color: "rgba(219, 212, 202, 0.5)" },
          },
        },
      },
    });
  }

  function populateSchools() {
    const region = regionSelect.value;
    const filtered = schools.filter((s) => s.region === region);
    schoolSelect.innerHTML = filtered.map((s) => `<option value="${s.id}">${s.name}</option>`).join("");
    populateGrades();
  }

  function populateGrades() {
    const school = currentSchool();
    gradeSelect.innerHTML = school.tuitionTiers
      .map((t) => `<option value="${t.tierKey}">${t.tierLabel}</option>`)
      .join("");

    if (boardingRow) boardingRow.classList.toggle("is-hidden", !school.boardingAvailable);
    if (!school.boardingAvailable) boardingToggle.checked = false;

    syncYearsDefault();
    render();
  }

  function syncYearsDefault() {
    const school = currentSchool();
    const tier = currentTier(school);
    if (tier) yearsInput.value = tier.suggestedYears;
  }

  function render() {
    const school = currentSchool();
    const tier = currentTier(school);
    if (!school || !tier) return;

    const fxRate = num(fxRateInput.value, 1380);
    const children = Math.max(1, Math.round(num(childrenInput.value, 1)));
    const incomeManwon = num(incomeInput.value, 0);
    const years = Math.max(1, Math.round(num(yearsInput.value, tier.suggestedYears)));
    const boarding = boardingToggle.checked;

    const boardingKrw = boarding ? (tier.boardingSurchargeKrw || 0) : 0;
    const boardingUsd = boarding ? (tier.boardingSurchargeUsd || 0) : 0;

    const annualKrw = Math.round(tier.krwPortion + tier.usdPortion * fxRate + boardingKrw + boardingUsd * fxRate);
    const monthlyKrw = Math.round(annualKrw / 12);
    const firstYearTotalKrw = annualKrw + school.applicationFeeKrw + school.firstYearExtraKrw;
    const allChildrenKrw = annualKrw * children;
    const incomeRatio = incomeManwon > 0 ? (((annualKrw / 10000) / incomeManwon) * 100).toFixed(1) : null;
    const totalOverYearsKrw = annualKrw * years;

    const set = (key, value) => {
      const el = root.querySelector(`[data-ist-result="${key}"]`) ?? document.getElementById(key);
      if (el) el.textContent = value;
    };

    const burden = burdenLevel(incomeRatio);

    set(
      "ist-result-annual",
      fmtKrw(annualKrw) + (children > 1 ? ` (자녀 ${children}명: ${fmtKrw(allChildrenKrw)})` : "")
    );
    set("ist-result-monthly", fmtKrw(monthlyKrw));
    set("ist-result-ratio", incomeRatio !== null ? `${incomeRatio}%` : "소득 입력 시 표시");
    set("ist-result-burden", burden);
    set("totalYearsLine", `예상 재학 ${years}년간 총 ${fmtKrw(totalOverYearsKrw)} (현재 학비 기준, 인상률 미반영)`);

    const insightParts = [
      `${school.name} ${tier.tierLabel} 기준 연간 학비는 ${fmtKrw(annualKrw)}입니다.`,
    ];
    if (children > 1) insightParts.push(`자녀 ${children}명 기준으로는 연간 ${fmtKrw(allChildrenKrw)}이 필요합니다(할인 미반영).`);
    if (incomeRatio !== null) {
      insightParts.push(`입력하신 가구 연소득 대비 ${incomeRatio}%로, 부담 등급은 '${burden}'입니다.`);
    } else {
      insightParts.push("가구 연소득을 입력하면 소득 대비 부담 등급을 확인할 수 있습니다.");
    }
    set("insight", insightParts.join(" "));

    set("firstYearTotal", fmtKrw(firstYearTotalKrw));
    set("firstYearNote", school.firstYearExtraNote);

    renderChart(fxRate, school.id);

    const sourceLink = root.querySelector('[data-ist-result="sourceLink"]');
    if (sourceLink) sourceLink.href = school.sourceUrl;
    set("sourceDate", `(${school.asOfDate} 확인)`);

    const warningEl = root.querySelector('[data-ist-result="dataWarning"]');
    if (warningEl) {
      if (school.dataNote) {
        warningEl.textContent = "⚠ " + school.dataNote;
        warningEl.classList.remove("is-hidden");
      } else {
        warningEl.classList.add("is-hidden");
      }
    }

    set("multiChildNote", "다자녀 안내: " + school.multiChildNote);
  }

  regionSelect.addEventListener("change", populateSchools);
  schoolSelect.addEventListener("change", populateGrades);
  gradeSelect.addEventListener("change", () => {
    syncYearsDefault();
    render();
  });
  [boardingToggle, childrenInput, incomeInput, fxRateInput, yearsInput].forEach((el) => {
    el.addEventListener("input", render);
  });

  const miniTabs = document.getElementById("istMiniCompareTabs");
  if (miniTabs) {
    miniTabs.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-region-tab]");
      if (!btn) return;
      const region = btn.getAttribute("data-region-tab");
      miniTabs.querySelectorAll(".ist-tab-btn").forEach((b) => b.classList.toggle("is-active", b === btn));
      document.querySelectorAll("[data-region-row]").forEach((row) => {
        row.classList.toggle("is-hidden", row.getAttribute("data-region-row") !== region);
      });
    });
  }

  document.getElementById("istResetBtn")?.addEventListener("click", () => {
    window.location.href = window.location.pathname;
  });
  document.getElementById("istCopyBtn")?.addEventListener("click", async () => {
    await navigator.clipboard.writeText(window.location.href);
  });

  populateSchools();
})();
