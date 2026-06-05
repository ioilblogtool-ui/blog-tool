/* ============================================================
 * monthly-dividend-etf-calculator.js
 * 월배당 ETF 배당금 계산기
 * ============================================================ */
(function () {
  "use strict";

  // ── 유틸 ─────────────────────────────────────────────────
  function fmtManwon(v) {
    if (v === 0 || isNaN(v)) return "0";
    if (v >= 10000) {
      var eok = Math.floor(v / 10000);
      var rem = Math.round((v % 10000) / 100) * 100;
      if (rem > 0) return eok.toLocaleString("ko-KR") + "억 " + (rem / 10000 * 10000 / 100).toFixed(0) + "백만";
      return eok.toLocaleString("ko-KR") + "억";
    }
    return Math.round(v).toLocaleString("ko-KR") + "만";
  }

  function fmtWon(manwon) {
    if (manwon >= 10000) {
      return (manwon / 10000).toFixed(1).replace(".0","") + "억원";
    }
    return Math.round(manwon).toLocaleString("ko-KR") + "만원";
  }

  function calc(investmentManwon, annualRatePct, taxRatePct) {
    var grossMonthly = investmentManwon * (annualRatePct / 100) / 12;
    var tax = grossMonthly * (taxRatePct / 100);
    var netMonthly = grossMonthly - tax;
    return { grossMonthly: grossMonthly, tax: tax, netMonthly: netMonthly };
  }

  function calcRequired(targetNet, annualRatePct, taxRatePct) {
    var monthlyNetRate = (annualRatePct / 100 / 12) * (1 - taxRatePct / 100);
    if (monthlyNetRate <= 0) return 0;
    return targetNet / monthlyNetRate;
  }

  // ── 탭 전환 ──────────────────────────────────────────────
  var tabs = document.querySelectorAll(".mdec-tab");
  var sections = {
    calc:    document.getElementById("mdec-tab-calc"),
    goal:    document.getElementById("mdec-tab-goal"),
    compare: document.getElementById("mdec-tab-compare"),
  };

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) { t.classList.remove("mdec-tab--active"); t.setAttribute("aria-selected","false"); });
      tab.classList.add("mdec-tab--active");
      tab.setAttribute("aria-selected","true");
      var key = tab.dataset.tab;
      Object.keys(sections).forEach(function (k) {
        if (sections[k]) sections[k].hidden = (k !== key);
      });
    });
  });

  // ── 탭1: 배당금 계산 ─────────────────────────────────────
  var investEl  = document.getElementById("mdec-investment");
  var rateEl    = document.getElementById("mdec-rate");
  var taxEl     = document.getElementById("mdec-tax");

  var monthlyNetEl   = document.getElementById("mdec-monthly-net");
  var monthlyNetSub  = document.getElementById("mdec-monthly-net-sub");
  var monthlyGrossEl = document.getElementById("mdec-monthly-gross");
  var monthlyTaxEl   = document.getElementById("mdec-monthly-tax");
  var taxRateDisplay = document.getElementById("mdec-tax-rate-display");
  var annualNetEl    = document.getElementById("mdec-annual-net");
  var scenarioTbody  = document.getElementById("mdec-scenario-tbody");
  var scenarioRateEl = document.getElementById("mdec-scenario-rate-display");

  function updateCalc() {
    var inv  = parseFloat(investEl.value) || 0;
    var rate = parseFloat(rateEl.value)   || 0;
    var tax  = parseFloat(taxEl.value)    || 0;

    var r = calc(inv, rate, tax);

    if (monthlyNetEl)   monthlyNetEl.textContent   = fmtWon(r.netMonthly);
    if (monthlyNetSub)  monthlyNetSub.textContent  = "월 " + fmtWon(r.netMonthly) + " · 연 " + fmtWon(r.netMonthly * 12);
    if (monthlyGrossEl) monthlyGrossEl.textContent = fmtWon(r.grossMonthly);
    if (monthlyTaxEl)   monthlyTaxEl.textContent   = fmtWon(r.tax);
    if (taxRateDisplay) taxRateDisplay.textContent = "세율 " + tax + "%";
    if (annualNetEl)    annualNetEl.textContent    = fmtWon(r.netMonthly * 12);

    // 시나리오 표 업데이트
    if (scenarioTbody && window.MDEC_INVEST_SCENARIOS) {
      var scenarios = window.MDEC_INVEST_SCENARIOS;
      scenarioTbody.innerHTML = scenarios.map(function (s) {
        var sr = calc(s.investmentManwon, rate, tax);
        var isHighlight = s.investmentManwon === inv;
        return "<tr" + (isHighlight ? ' class="mdec-row--highlight"' : "") + ">" +
          "<td><strong>" + s.label + "</strong></td>" +
          "<td>" + fmtWon(sr.grossMonthly) + "</td>" +
          "<td class='mdec-cell--muted'>" + fmtWon(sr.tax) + "</td>" +
          "<td><strong>" + fmtWon(sr.netMonthly) + "</strong></td>" +
          "<td>" + fmtWon(sr.netMonthly * 12) + "</td>" +
          "</tr>";
      }).join("");
    }

    if (scenarioRateEl) scenarioRateEl.textContent = "연 분배율 " + rate + "% · 세율 " + tax + "%";
  }

  if (investEl) investEl.addEventListener("input", updateCalc);
  if (rateEl)   rateEl.addEventListener("input",   updateCalc);
  if (taxEl)    taxEl.addEventListener("input",    updateCalc);

  // 빠른 투자금 버튼
  document.querySelectorAll(".mdec-quick-btn:not(.mdec-goal-preset)").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (investEl) { investEl.value = btn.dataset.val; updateCalc(); }
    });
  });

  // 세율 버튼
  document.querySelectorAll(".mdec-tax-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (taxEl) { taxEl.value = btn.dataset.tax; updateCalc(); }
      document.querySelectorAll(".mdec-tax-btn").forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
    });
  });

  // ETF 프리셋 버튼
  document.querySelectorAll(".mdec-etf-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".mdec-etf-btn").forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");

      if (rateEl) rateEl.value = btn.dataset.rate;
      if (taxEl)  taxEl.value  = btn.dataset.tax;
      updateCalc();

      // ETF 정보 표시
      var etfInfo = document.getElementById("mdec-etf-info");
      var etfInfoName = document.getElementById("mdec-etf-info-name");
      var etfInfoDesc = document.getElementById("mdec-etf-info-desc");
      var etfInfoRemark = document.getElementById("mdec-etf-info-remark");

      if (window.MDEC_ETF_PRESETS && btn.dataset.etfId) {
        var preset = window.MDEC_ETF_PRESETS.find(function (e) { return e.id === btn.dataset.etfId; });
        if (preset && etfInfo) {
          etfInfo.hidden = false;
          if (etfInfoName) etfInfoName.textContent = preset.name + " (" + preset.ticker + ")";
          if (etfInfoDesc) etfInfoDesc.textContent = preset.description;
          if (etfInfoRemark) {
            etfInfoRemark.textContent = preset.remark || "";
            etfInfoRemark.hidden = !preset.remark;
          }
        }
      }
    });
  });

  // ── 탭2: 목표 역산 ───────────────────────────────────────
  var goalTargetEl = document.getElementById("mdec-goal-target");
  var goalRateEl   = document.getElementById("mdec-goal-rate");
  var goalTaxEl    = document.getElementById("mdec-goal-tax");
  var goalValueEl  = document.getElementById("mdec-goal-value");
  var goalSubEl    = document.getElementById("mdec-goal-sub");

  function updateGoal() {
    var target = parseFloat((goalTargetEl && goalTargetEl.value) || "100") || 0;
    var rate   = parseFloat((goalRateEl   && goalRateEl.value)   || "10")  || 0;
    var tax    = parseFloat((goalTaxEl    && goalTaxEl.value)    || "15.4") || 0;

    var req = calcRequired(target, rate, tax);
    if (goalValueEl) goalValueEl.textContent = fmtWon(req);
    if (goalSubEl)   goalSubEl.textContent   = "연 분배율 " + rate + "% · 세율 " + tax + "% 기준";
  }

  if (goalTargetEl) goalTargetEl.addEventListener("input", updateGoal);
  if (goalRateEl)   goalRateEl.addEventListener("input",   updateGoal);
  if (goalTaxEl)    goalTaxEl.addEventListener("input",    updateGoal);

  document.querySelectorAll(".mdec-goal-preset").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (goalTargetEl) { goalTargetEl.value = btn.dataset.val; updateGoal(); }
    });
  });

  // ── 탭3: ETF 비교표 필터 ─────────────────────────────────
  document.querySelectorAll(".mdec-compare-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".mdec-compare-btn").forEach(function (b) { b.classList.remove("mdec-compare-btn--active"); });
      btn.classList.add("mdec-compare-btn--active");
      var filter = btn.dataset.filter;
      document.querySelectorAll(".mdec-compare-table tbody tr").forEach(function (row) {
        if (filter === "all") {
          row.hidden = false;
        } else if (filter === "domestic" || filter === "us") {
          row.hidden = row.dataset.etfMarket !== filter;
        } else {
          row.hidden = row.dataset.etfCategory !== filter;
        }
      });
    });
  });

  // ── 초기 계산 ─────────────────────────────────────────────
  updateCalc();
  updateGoal();

})();
