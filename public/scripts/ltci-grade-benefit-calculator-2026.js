(function () {
  let selectedGrade = null;
  let selectedMode  = "home";
  let burdenHomeRatio     = 0.15;
  let burdenFacilityRatio = 0.20;

  const gradeBtns      = document.querySelectorAll(".ltci-grade-btn");
  const modeBtns       = document.querySelectorAll(".ltci-mode-btn");
  const burdenSelect   = document.getElementById("ltci-burden");
  const resultsEl      = document.getElementById("ltci-results");
  const compareEl      = document.getElementById("ltci-compare");
  const limitEl        = document.getElementById("ltci-limit");
  const burdenAmountEl = document.getElementById("ltci-burden-amount");
  const burdenRatioEl  = document.getElementById("ltci-burden-ratio");
  const publicEl       = document.getElementById("ltci-public");
  const compareHomeEl  = document.getElementById("ltci-compare-home");
  const compareFacEl   = document.getElementById("ltci-compare-facility");

  const fmt = n => n.toLocaleString("ko-KR") + "원";

  gradeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      gradeBtns.forEach(b => b.classList.remove("ltci-grade-btn--active"));
      btn.classList.add("ltci-grade-btn--active");
      selectedGrade = {
        grade:        btn.dataset.grade,
        homeLimit:    parseInt(btn.dataset.homeLimit),
        facilityRate: parseInt(btn.dataset.facilityRate),
        eligible:     btn.dataset.eligible === "true",
      };
      render();
    });
  });

  modeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      modeBtns.forEach(b => b.classList.remove("ltci-mode-btn--active"));
      btn.classList.add("ltci-mode-btn--active");
      selectedMode = btn.dataset.mode;
      render();
    });
  });

  burdenSelect.addEventListener("change", () => {
    const opt = burdenSelect.selectedOptions[0];
    burdenHomeRatio     = parseFloat(opt.dataset.homeRatio);
    burdenFacilityRatio = parseFloat(opt.dataset.facilityRatio);
    render();
  });

  function calcHome(grade) {
    const limit  = grade.homeLimit;
    const burden = Math.round(limit * burdenHomeRatio);
    return { limit, burden, pub: limit - burden };
  }

  function calcFacility(grade) {
    if (!grade.eligible) return null;
    const monthly = grade.facilityRate * 30;
    const burden  = Math.round(monthly * burdenFacilityRatio);
    return { limit: monthly, burden, pub: monthly - burden };
  }

  function render() {
    if (!selectedGrade) return;

    const home = calcHome(selectedGrade);
    const fac  = calcFacility(selectedGrade);

    if (selectedMode === "compare") {
      resultsEl.style.display = "none";
      compareEl.style.display = "grid";

      compareHomeEl.innerHTML = `
        <p>한도: <strong>${fmt(home.limit)}</strong></p>
        <p>본인부담: <strong>${fmt(home.burden)}</strong> (${(burdenHomeRatio * 100).toFixed(0)}%)</p>
        <p>공단지원: <strong>${fmt(home.pub)}</strong></p>
      `;

      compareFacEl.innerHTML = fac
        ? `<p>월 수가: <strong>${fmt(fac.limit)}</strong></p>
           <p>본인부담: <strong>${fmt(fac.burden)}</strong> (${(burdenFacilityRatio * 100).toFixed(0)}%)</p>
           <p>공단지원: <strong>${fmt(fac.pub)}</strong></p>
           <p style="font-size:0.75rem;color:#9ca3af;margin-top:0.25rem">+ 식비·기타 약 26만원 별도</p>`
        : `<p style="color:#9ca3af">이 등급은 시설급여 이용 불가</p>`;
      return;
    }

    resultsEl.style.display = "grid";
    compareEl.style.display = "none";

    const data = selectedMode === "facility" ? fac : home;

    if (!data) {
      limitEl.textContent        = "이용 불가";
      burdenAmountEl.textContent = "—";
      publicEl.textContent       = "—";
      burdenRatioEl.textContent  = "해당 등급 시설 이용 불가";
      return;
    }

    limitEl.textContent        = fmt(data.limit);
    burdenAmountEl.textContent = fmt(data.burden);
    publicEl.textContent       = fmt(data.pub);
    burdenRatioEl.textContent  = selectedMode === "facility"
      ? `시설 ${(burdenFacilityRatio * 100).toFixed(0)}%`
      : `재가 ${(burdenHomeRatio * 100).toFixed(0)}%`;
  }

  // 초기 렌더: 1등급 선택
  if (gradeBtns.length > 0) {
    gradeBtns[0].click();
  }
})();
