(() => {
  const root = document.querySelector(".sac-page");
  if (!root) return;

  const dataEl = document.getElementById("sac-data");
  if (!dataEl) return;
  const { schools, livingCosts, fxRates } = JSON.parse(dataEl.textContent);

  const $ = (selector) => root.querySelector(selector);

  const countrySelect = $('[data-sac="country"]');
  const citySelect = $('[data-sac="city"]');
  const schoolSelect = $('[data-sac="school"]');
  const gradeSelect = $('[data-sac="grade"]');
  const childrenInput = $('[data-sac="children"]');
  const incomeInput = $('[data-sac="income"]');

  function num(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function fmtKrw(n) {
    if (n >= 100_000_000) return (n / 100_000_000).toFixed(2) + "억원";
    if (n >= 10_000) return Math.round(n / 10_000).toLocaleString("ko-KR") + "만원";
    return Math.round(n).toLocaleString("ko-KR") + "원";
  }

  function fmtLocal(n, currency) {
    return `${n.toLocaleString("en-US")} ${currency}`;
  }

  function companion() {
    return root.querySelector('input[name="sacCompanion"]:checked')?.value || "whole_family";
  }

  function currentSchool() {
    return schools.find((s) => s.id === schoolSelect.value) ?? schools[0];
  }

  function currentTier(school) {
    return school.tuitionTiers.find((t) => t.tierKey === gradeSelect.value) ?? school.tuitionTiers[0];
  }

  function populateCities() {
    const countryVal = countrySelect.value;
    const cities = [...new Set(schools.filter((s) => s.country === countryVal).map((s) => s.city))];
    citySelect.innerHTML = cities
      .map((c) => {
        const label = schools.find((s) => s.city === c).cityLabel;
        return `<option value="${c}">${label}</option>`;
      })
      .join("");
    populateSchools();
  }

  function populateSchools() {
    const cityVal = citySelect.value;
    const filtered = schools.filter((s) => s.city === cityVal);
    schoolSelect.innerHTML = filtered.map((s) => `<option value="${s.id}">${s.name}</option>`).join("");
    populateGrades();
  }

  function populateGrades() {
    const school = currentSchool();
    gradeSelect.innerHTML = school.tuitionTiers.map((t) => `<option value="${t.tierKey}">${t.tierLabel}</option>`).join("");
    render();
  }

  function render() {
    const school = currentSchool();
    const tier = currentTier(school);
    if (!school || !tier) return;

    const children = Math.max(1, Math.round(num(childrenInput.value, 1)));
    const incomeManwon = num(incomeInput.value, 0);
    const comp = companion();

    const fx = fxRates.find((f) => f.currency === school.currency);
    const living = livingCosts.find((l) => l.city === school.city);

    const annualTuitionLocal = tier.annualLocal * children;
    const annualTuitionKrw = fx?.krwPerUnit ? Math.round(annualTuitionLocal * fx.krwPerUnit) : null;

    let annualLivingLocal = null;
    if (comp === "none") {
      annualLivingLocal = 0;
    } else if (living?.monthlyFamilyExclRentLocal != null) {
      const rentByTier = living.monthlyRentLocal?.[school.tier] ?? living.monthlyRentLocal?.mid ?? 0;
      annualLivingLocal = (living.monthlyFamilyExclRentLocal + (rentByTier || 0)) * 12;
    }

    const annualLivingKrw =
      annualLivingLocal != null && fx?.krwPerUnit
        ? Math.round(annualLivingLocal * fx.krwPerUnit)
        : comp === "none"
          ? 0
          : null;

    const annualTotalKrw = annualTuitionKrw != null && annualLivingKrw != null ? annualTuitionKrw + annualLivingKrw : null;

    const set = (key, value) => {
      const el = root.querySelector(`[data-sac-result="${key}"]`) ?? document.getElementById(key);
      if (el) el.textContent = value;
    };

    set(
      "sac-result-tuition",
      annualTuitionKrw != null ? fmtKrw(annualTuitionKrw) : `${fmtLocal(annualTuitionLocal, school.currency)} (환율 확인 중)`
    );
    set("sac-result-living", comp === "none" ? "0원 (미동반)" : annualLivingKrw != null ? fmtKrw(annualLivingKrw) : "생활비 데이터 준비 중");
    set("sac-result-total", annualTotalKrw != null ? fmtKrw(annualTotalKrw) : "데이터 준비 중 (학비만 참고)");
    set("sac-result-5year", annualTotalKrw != null ? fmtKrw(annualTotalKrw * 5) : "-");

    const insightParts = [`${school.name} ${tier.tierLabel} 기준 연간 학비는 ${fmtLocal(annualTuitionLocal, school.currency)}입니다.`];
    if (annualTotalKrw != null) {
      insightParts.push(`생활비를 합산한 연간 총비용은 ${fmtKrw(annualTotalKrw)}입니다.`);
      if (incomeManwon > 0) {
        const ratio = (((annualTotalKrw / 10000) / incomeManwon) * 100).toFixed(1);
        insightParts.push(`가구 연소득 대비 ${ratio}%에 해당합니다.`);
      }
    } else if (annualTuitionKrw != null) {
      insightParts.push("이 도시는 생활비 데이터가 아직 준비되지 않아 학비만 원화로 환산했습니다.");
    } else {
      insightParts.push("이 통화의 환율이 아직 확인되지 않아 현지 통화로만 표시됩니다.");
    }
    set("insight", insightParts.join(" "));

    const badge = root.querySelector('[data-sac-result="confidenceBadge"]');
    if (badge) {
      const isOfficial = school.dataConfidence === "official_confirmed";
      badge.setAttribute("data-confidence", isOfficial ? "official" : "snippet");
      badge.textContent = isOfficial ? "공식 페이지 확인" : "검색 요약, 재확인 권장";
    }

    const sourceLink = root.querySelector('[data-sac-result="sourceLink"]');
    if (sourceLink) sourceLink.href = school.sourceUrl;
    set("sourceDate", `(${school.asOfDate} 확인)`);
    set("dataNote", school.dataNote ?? "");
  }

  countrySelect.addEventListener("change", populateCities);
  citySelect.addEventListener("change", populateSchools);
  schoolSelect.addEventListener("change", populateGrades);
  [gradeSelect, childrenInput, incomeInput].forEach((el) => el.addEventListener("input", render));
  root.querySelectorAll('input[name="sacCompanion"]').forEach((r) => r.addEventListener("change", render));

  const miniTabs = document.getElementById("sacMiniCompareTabs");
  if (miniTabs) {
    miniTabs.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-country-tab]");
      if (!btn) return;
      const countryVal = btn.getAttribute("data-country-tab");
      miniTabs.querySelectorAll(".sac-tab-btn").forEach((b) => b.classList.toggle("is-active", b === btn));
      document.querySelectorAll("[data-country-row]").forEach((row) => {
        row.classList.toggle("is-hidden", row.getAttribute("data-country-row") !== countryVal);
      });
    });
    // 초기 상태: 말레이시아만 표시
    document.querySelectorAll("[data-country-row]").forEach((row) => {
      row.classList.toggle("is-hidden", row.getAttribute("data-country-row") !== "MY");
    });
  }

  document.getElementById("sacResetBtn")?.addEventListener("click", () => {
    window.location.href = window.location.pathname;
  });
  document.getElementById("sacCopyBtn")?.addEventListener("click", async () => {
    await navigator.clipboard.writeText(window.location.href);
  });

  populateCities();
})();
