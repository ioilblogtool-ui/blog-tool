/* ============================================================
 * bonus-etf-investment-calculator.js
 * 성과급으로 ETF 투자하면 월 배당금 얼마?
 * ============================================================ */
(function () {
  "use strict";

  // ── 유틸 ─────────────────────────────────────────────────
  function fmtWon(manwon) {
    if (!manwon || isNaN(manwon)) return "0만원";
    var v = Math.round(manwon);
    if (v >= 10000) {
      var eok = Math.floor(v / 10000);
      var rem = Math.round((v % 10000) / 100) * 100;
      if (rem > 0) return eok + "억 " + (rem / 100) + "백만원";
      return eok + "억원";
    }
    return v.toLocaleString("ko-KR") + "만원";
  }

  function fmtWonShort(manwon) {
    if (!manwon || isNaN(manwon)) return "0";
    var v = Math.round(manwon);
    if (v >= 10000) return (v / 10000).toFixed(1).replace(".0","") + "억";
    return v.toLocaleString("ko-KR") + "만";
  }

  // ── 성과급 세후 계산 (간이세율) ──────────────────────────
  // 총소득 = 연봉 + 성과급
  // 간이 근로소득세율 (누진세 단순화)
  function calcBonusTax(bonusManwon, salaryManwon) {
    var total = salaryManwon + bonusManwon;
    // 근로소득세 간이 적용
    var incomeTaxRate;
    if (total <= 1400)       incomeTaxRate = 0.06;
    else if (total <= 5000)  incomeTaxRate = 0.15;
    else if (total <= 8800)  incomeTaxRate = 0.24;
    else if (total <= 15000) incomeTaxRate = 0.35;
    else if (total <= 30000) incomeTaxRate = 0.38;
    else                      incomeTaxRate = 0.40;

    // 성과급에 해당하는 세금 (한계세율 적용)
    var incomeTax   = bonusManwon * incomeTaxRate;
    var localTax    = incomeTax * 0.1;
    // 4대보험 (근로자 부담): 국민연금4.5% + 건강3.545% + 고용0.9% ≈ 8.945%
    var insurance   = bonusManwon * 0.08945;
    var totalTax    = incomeTax + localTax + insurance;
    return {
      tax: Math.round(totalTax),
      net: Math.round(bonusManwon - totalTax),
    };
  }

  // ── ETF 배당금 계산 ───────────────────────────────────────
  function calcMonthlyDiv(investManwon, annualRatePct, taxRatePct) {
    var gross  = investManwon * (annualRatePct / 100) / 12;
    var net    = gross * (1 - taxRatePct / 100);
    return { gross: gross, net: net };
  }

  // ── DOM 참조 ──────────────────────────────────────────────
  var bonusEl       = document.getElementById("beic-bonus");
  var salaryEl      = document.getElementById("beic-salary");
  var investRatioEl = document.getElementById("beic-invest-ratio");
  var etfRateEl     = document.getElementById("beic-etf-rate");
  var etfTaxEl      = document.getElementById("beic-etf-tax");

  var taxAmountEl   = document.getElementById("beic-tax-amount");
  var netBonusEl    = document.getElementById("beic-net-bonus");
  var investHintEl  = document.getElementById("beic-invest-amount-hint");

  var resultInvestEl  = document.getElementById("beic-result-invest");
  var resultMonthlyEl = document.getElementById("beic-result-monthly");
  var resultEtfNameEl = document.getElementById("beic-result-etf-name");
  var resultAnnualEl  = document.getElementById("beic-result-annual");

  var currentEtfName = "JEPI";

  // ── 메인 업데이트 ────────────────────────────────────────
  function update() {
    var bonus  = parseFloat(bonusEl && bonusEl.value)  || 0;
    var salary = parseFloat(salaryEl && salaryEl.value) || 0;
    var ratio  = parseFloat(investRatioEl && investRatioEl.value) || 50;
    var rate   = parseFloat(etfRateEl && etfRateEl.value) || 10;
    var tax    = parseFloat(etfTaxEl && etfTaxEl.value)   || 15.4;

    // 성과급 세후
    var t = calcBonusTax(bonus, salary);
    if (taxAmountEl) taxAmountEl.textContent = "-" + fmtWon(t.tax);
    if (netBonusEl)  netBonusEl.textContent  = fmtWon(t.net);

    // 투자 금액
    var investAmount = t.net * (ratio / 100);
    if (investHintEl) investHintEl.textContent = "투자 금액: " + fmtWon(investAmount);

    // ETF 배당금
    var div = calcMonthlyDiv(investAmount, rate, tax);
    if (resultInvestEl)  resultInvestEl.textContent  = fmtWon(investAmount);
    if (resultMonthlyEl) resultMonthlyEl.textContent = fmtWon(div.net) + "/월";
    if (resultEtfNameEl) resultEtfNameEl.textContent = currentEtfName + " · 연 " + rate + "% · 세율 " + tax + "%";
    if (resultAnnualEl)  resultAnnualEl.textContent  = fmtWon(div.net * 12) + "/년";

    // 시나리오 카드 업데이트
    [25, 50, 75, 100].forEach(function (r) {
      var amt   = t.net * (r / 100);
      var d     = calcMonthlyDiv(amt, rate, tax);
      var invEl = document.getElementById("beic-sc-invest-"  + r);
      var monEl = document.getElementById("beic-sc-monthly-" + r);
      if (invEl) invEl.textContent = fmtWonShort(amt);
      if (monEl) monEl.textContent = "월 " + fmtWonShort(d.net);

      var card = document.querySelector(".beic-scenario-card[data-ratio='" + r + "']");
      if (card) card.classList.toggle("is-active", r === ratio);
    });
  }

  // ── 이벤트 ────────────────────────────────────────────────
  [bonusEl, salaryEl, investRatioEl, etfRateEl, etfTaxEl].forEach(function (el) {
    if (el) el.addEventListener("input", update);
  });

  // 빠른 입력 버튼
  document.querySelectorAll(".beic-quick-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var targetId = btn.dataset.target;
      var val = btn.dataset.val;
      var el = document.getElementById(targetId);
      if (el) { el.value = val; update(); }
    });
  });

  // 투자 비율 버튼
  document.querySelectorAll(".beic-ratio-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".beic-ratio-btn").forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      if (investRatioEl) { investRatioEl.value = btn.dataset.ratio; update(); }
    });
  });

  // ETF 선택 버튼
  document.querySelectorAll(".beic-etf-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".beic-etf-btn").forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      if (etfRateEl) etfRateEl.value = btn.dataset.rate;
      if (etfTaxEl)  etfTaxEl.value  = btn.dataset.tax;
      currentEtfName = btn.dataset.name || "";
      // 세율 버튼 동기화
      document.querySelectorAll(".beic-tax-btn").forEach(function (t) {
        t.classList.toggle("is-active", t.dataset.tax === btn.dataset.tax);
      });
      update();
    });
  });

  // 세율 버튼
  document.querySelectorAll(".beic-tax-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".beic-tax-btn").forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      if (etfTaxEl) { etfTaxEl.value = btn.dataset.tax; update(); }
    });
  });

  // FAQ
  document.querySelectorAll(".beic-faq-item").forEach(function (item) {
    var btn = item.querySelector(".beic-faq-q");
    var ans = item.querySelector(".beic-faq-a");
    if (!btn || !ans) return;
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", open ? "false" : "true");
      ans.hidden = open;
      item.classList.toggle("is-open", !open);
    });
  });

  // 초기 실행
  update();

})();
