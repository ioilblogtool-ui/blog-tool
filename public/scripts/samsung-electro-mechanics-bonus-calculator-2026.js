// samsung-electro-mechanics-bonus-calculator-2026

(function () {
  const dataEl = document.getElementById("semb-data");
  if (!dataEl) return;

  const { scenarios, gradeMultipliers, defaults, taxRate } = JSON.parse(dataEl.textContent);

  // 입력 요소
  const sliderProfit = document.getElementById("semb-slider-profit");
  const sliderRate   = document.getElementById("semb-slider-rate");
  const inputHead    = document.getElementById("semb-input-headcount");
  const inputSalary  = document.getElementById("semb-input-salary");
  const selectGrade  = document.getElementById("semb-select-grade");

  // 표시 요소
  const dispProfit = document.getElementById("semb-disp-profit");
  const dispRate   = document.getElementById("semb-disp-rate");
  const dispHead   = document.getElementById("semb-disp-head");

  const kpiFund       = document.getElementById("semb-kpi-fund");
  const kpiAvgPre     = document.getElementById("semb-kpi-avg-pre");
  const kpiMyAfter    = document.getElementById("semb-kpi-my-after");
  const detailAvgAfter = document.getElementById("semb-detail-avg-after");
  const detailMyPre    = document.getElementById("semb-detail-my-pre");
  const detailMyAfter2 = document.getElementById("semb-detail-my-after2");
  const detailRatio    = document.getElementById("semb-detail-ratio");

  function fmt(n) {
    return n.toLocaleString("ko-KR");
  }

  function calc() {
    const profit   = parseInt(sliderProfit.value, 10);     // 억원
    const rate     = parseFloat(sliderRate.value) / 100;
    const headcount = parseInt(inputHead.value, 10) || defaults.headcount;
    const salary   = parseInt(inputSalary.value, 10) || defaults.salary;
    const multiplier = parseFloat(selectGrade.value) || 1.0;

    const totalFundHundredMil = Math.round(profit * rate);            // 억원
    const perPersonPreTax = Math.round((totalFundHundredMil * 1e8) / headcount / 1e4); // 만원
    const perPersonAfterTax = Math.round(perPersonPreTax * (1 - taxRate));
    const myPreTax  = Math.round(perPersonPreTax * multiplier);
    const myAfterTax = Math.round(myPreTax * (1 - taxRate));
    const ratio = salary > 0 ? ((myAfterTax / salary) * 100).toFixed(1) : "—";

    // 표시값 업데이트
    if (dispProfit) dispProfit.textContent = fmt(profit) + "억원";
    if (dispRate)   dispRate.textContent   = sliderRate.value + "%";
    if (dispHead)   dispHead.textContent   = fmt(headcount) + "명";

    if (kpiFund)       kpiFund.textContent    = fmt(totalFundHundredMil) + "억원";
    if (kpiAvgPre)     kpiAvgPre.textContent  = fmt(perPersonPreTax) + "만원";
    if (kpiMyAfter)    kpiMyAfter.textContent = fmt(myAfterTax) + "만원";
    if (detailAvgAfter) detailAvgAfter.textContent = fmt(perPersonAfterTax) + "만원";
    if (detailMyPre)    detailMyPre.textContent    = fmt(myPreTax) + "만원";
    if (detailMyAfter2) detailMyAfter2.textContent = fmt(myAfterTax) + "만원";
    if (detailRatio)    detailRatio.textContent    = ratio + "%";

    highlightScenario(profit, parseFloat(sliderRate.value));
  }

  function highlightScenario(profit, rate) {
    const rows = document.querySelectorAll(".semb-scenario-row");
    let closest = null;
    let minDiff = Infinity;

    scenarios.forEach((s) => {
      const diff = Math.abs(s.operatingProfitHundredMillion - profit);
      if (diff < minDiff) {
        minDiff = diff;
        closest = s.operatingProfitHundredMillion;
      }
    });

    rows.forEach((row) => {
      const rowProfit = parseInt(row.dataset.profit, 10);
      row.classList.toggle("semb-scenario-row--active", rowProfit === closest);
    });

    // 열 강조: 10%에 가까우면 10% 열, 12%에 가까우면 12% 열
    const col10Cells = document.querySelectorAll(".semb-scenario-col--10");
    const col12Cells = document.querySelectorAll(".semb-scenario-col--12");
    if (rate <= 11) {
      col10Cells.forEach((c) => c.classList.add("semb-scenario-col--active"));
      col12Cells.forEach((c) => c.classList.remove("semb-scenario-col--active"));
    } else {
      col10Cells.forEach((c) => c.classList.remove("semb-scenario-col--active"));
      col12Cells.forEach((c) => c.classList.add("semb-scenario-col--active"));
    }
  }

  sliderProfit.addEventListener("input", calc);
  sliderRate.addEventListener("input", calc);
  inputHead.addEventListener("input", calc);
  inputSalary.addEventListener("input", calc);
  selectGrade.addEventListener("change", calc);

  calc(); // 초기 렌더
})();
