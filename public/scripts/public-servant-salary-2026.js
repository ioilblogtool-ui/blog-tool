/* ============================================================
 * public-servant-salary-2026.js
 * 인터랙션: 봉급 인상률 차트, 호봉표 펼치기,
 *           실수령액 계산기, 수당 탭, FAQ accordion
 * ============================================================ */

(function () {
  "use strict";

  var root = document.querySelector("[data-pss-root]");
  if (!root) return;

  // ── 데이터 파싱 ────────────────────────────────────────────
  var GRADES = [];
  var DEDUCTION = {};
  var RAISE = [];
  var MEAL = 160000;

  try {
    GRADES = JSON.parse(root.dataset.pssGrades || "[]");
    DEDUCTION = JSON.parse(root.dataset.pssDeduction || "{}");
    RAISE = JSON.parse(root.dataset.pssRaise || "[]");
    MEAL = parseInt(root.dataset.meal || "160000", 10);
  } catch (e) {
    console.warn("[pss] 데이터 파싱 실패:", e);
  }

  // ── 숫자 포맷 ─────────────────────────────────────────────
  function fmtWon(n) {
    return Math.round(n).toLocaleString("ko-KR") + "원";
  }
  function fmtMan(n) {
    return Math.round(n / 10000).toLocaleString("ko-KR") + "만 원";
  }

  // ── 소득세 계산 ───────────────────────────────────────────
  function calcLaborIncomeDeduction(income) {
    if (income <= 5000000)   return income * 0.7;
    if (income <= 15000000)  return 3500000 + (income - 5000000) * 0.4;
    if (income <= 45000000)  return 7500000 + (income - 15000000) * 0.15;
    if (income <= 100000000) return 12000000 + (income - 45000000) * 0.05;
    return 14750000 + (income - 100000000) * 0.02;
  }

  function calcTaxBracket(taxable) {
    if (taxable <= 14000000)  return taxable * 0.06;
    if (taxable <= 50000000)  return 840000  + (taxable - 14000000)  * 0.15;
    if (taxable <= 88000000)  return 6240000 + (taxable - 50000000)  * 0.24;
    if (taxable <= 150000000) return 15360000 + (taxable - 88000000) * 0.35;
    return 37060000 + (taxable - 150000000) * 0.38;
  }

  function calcMonthlyIncomeTax(monthlyBase) {
    var annual = monthlyBase * 12;
    var deducted = calcLaborIncomeDeduction(annual);
    var netIncome = annual - deducted;
    var personalExemption = 1500000;
    var taxable = Math.max(0, netIncome - personalExemption);
    var annualTax = Math.max(0, calcTaxBracket(taxable));
    return Math.round(annualTax / 12);
  }

  // ── 실수령액 계산 ─────────────────────────────────────────
  function calcNet(base, gradeId, hasSpouse, children) {
    var grade = GRADES.find(function (g) { return g.id === gradeId; });
    if (!grade) return null;

    var jobGrade = grade.jobGradeSupport || 0;
    var family = (hasSpouse ? 40000 : 0) + children * 20000;
    var allowance = jobGrade + MEAL + family;
    var total = base + allowance;

    var pension = Math.round(base * DEDUCTION.pension);
    var health = Math.round(base * DEDUCTION.healthInsurance);
    var ltc = Math.round(health * DEDUCTION.longTermCare);
    var incomeTax = calcMonthlyIncomeTax(base);
    var localTax = Math.round(incomeTax * 0.1);
    var deduction = pension + health + ltc + incomeTax + localTax;

    var net = total - deduction;
    var annual = net * 12;

    return { base, allowance, total, deduction, net, annual };
  }

  // ── 계산기 렌더링 ─────────────────────────────────────────
  var elGrade    = root.querySelector("[data-pss-grade]");
  var elHobong   = root.querySelector("[data-pss-hobong]");
  var elHobongDisplay = root.querySelector("[data-pss-hobong-display]");
  var elSpouse   = root.querySelector("[data-pss-spouse]");
  var elChildren = root.querySelector("[data-pss-children]");

  var elRBase      = root.querySelector("[data-pss-r-base]");
  var elRAllowance = root.querySelector("[data-pss-r-allowance]");
  var elRTotal     = root.querySelector("[data-pss-r-total]");
  var elRDeduction = root.querySelector("[data-pss-r-deduction]");
  var elRNet       = root.querySelector("[data-pss-r-net]");
  var elRAnnual    = root.querySelector("[data-pss-r-annual]");

  function getHobongBase(gradeId, hobong) {
    var grade = GRADES.find(function (g) { return g.id === gradeId; });
    if (!grade) return 0;
    var row = grade.hobong.find(function (h) { return h.no === hobong; });
    return row ? row.monthlyBase : 0;
  }

  function updateCalc() {
    var gradeId  = elGrade ? elGrade.value : "9";
    var hobono   = elHobong ? parseInt(elHobong.value, 10) : 1;
    var hasSpouse = elSpouse ? elSpouse.value === "1" : false;
    var children = elChildren ? parseInt(elChildren.value, 10) : 0;

    if (elHobongDisplay) elHobongDisplay.textContent = hobono + "호봉";

    var base = getHobongBase(gradeId, hobono);
    if (!base) return;

    var r = calcNet(base, gradeId, hasSpouse, children);
    if (!r) return;

    if (elRBase)      elRBase.textContent      = fmtWon(r.base);
    if (elRAllowance) elRAllowance.textContent  = fmtWon(r.allowance);
    if (elRTotal)     elRTotal.textContent      = fmtWon(r.total);
    if (elRDeduction) elRDeduction.textContent  = "−" + fmtWon(r.deduction);
    if (elRNet)       elRNet.textContent        = fmtWon(r.net);
    if (elRAnnual)    elRAnnual.textContent      = fmtMan(r.annual);

    highlightHobongRow(hobono);
  }

  function highlightHobongRow(hobong) {
    root.querySelectorAll("[data-pss-hobong-row]").forEach(function (row) {
      var no = parseInt(row.dataset.pssHobongRow, 10);
      row.classList.toggle("pss-hobong-row--is-active", no === hobong);
    });
  }

  if (elGrade)    elGrade.addEventListener("change", updateCalc);
  if (elSpouse)   elSpouse.addEventListener("change", updateCalc);
  if (elChildren) elChildren.addEventListener("change", updateCalc);
  if (elHobong) {
    elHobong.addEventListener("input", updateCalc);
  }
  updateCalc();

  // ── 호봉표 펼치기 ─────────────────────────────────────────
  var toggleBtn = document.getElementById("pss-hobong-toggle");
  var fullPanel = document.getElementById("pss-hobong-full");

  if (toggleBtn && fullPanel) {
    toggleBtn.addEventListener("click", function () {
      var expanded = toggleBtn.getAttribute("aria-expanded") === "true";
      fullPanel.hidden = expanded;
      toggleBtn.setAttribute("aria-expanded", String(!expanded));
      toggleBtn.textContent = expanded
        ? "전체 호봉표 펼쳐보기 (1~30호봉) ▼"
        : "전체 호봉표 접기 ▲";
    });
  }

  // ── 수당 탭 ─────────────────────────────────────────────
  function initAllowanceTabs() {
    var tabs = root.querySelectorAll("[data-pss-tab]");
    var panels = root.querySelectorAll("[data-pss-tabpanel]");

    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var target = tab.dataset.pssTab;

        tabs.forEach(function (t) {
          t.classList.remove("is-active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("is-active");
        tab.setAttribute("aria-selected", "true");

        panels.forEach(function (panel) {
          panel.hidden = panel.dataset.pssTabpanel !== target;
        });
      });
    });
  }
  initAllowanceTabs();

  // ── FAQ accordion ─────────────────────────────────────────
  function initFaq() {
    var items = root.querySelectorAll(".pss-faq-q");
    items.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var expanded = btn.getAttribute("aria-expanded") === "true";
        var answer = btn.nextElementSibling;
        if (!answer) return;
        btn.setAttribute("aria-expanded", String(!expanded));
        answer.hidden = expanded;
      });
    });
  }
  initFaq();

  // ── 봉급 인상률 Bar Chart ─────────────────────────────────
  function initRaiseChart() {
    var canvas = document.getElementById("pss-raise-chart");
    if (!canvas || !RAISE.length) return;
    if (typeof Chart === "undefined") {
      console.warn("[pss] Chart.js 미로드. 차트를 건너뜁니다.");
      return;
    }

    var labels = RAISE.map(function (r) { return String(r.year); });
    var values = RAISE.map(function (r) { return r.ratePercent; });
    var noteLabels = RAISE.map(function (r) { return r.noteLabel || ""; });
    var colors = values.map(function (v) { return v >= 5 ? "#1b3a6b" : v >= 3 ? "#1a56db" : "#90aed6"; });

    new Chart(canvas, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "봉급 인상률 (%)",
          data: values,
          backgroundColor: colors,
          borderRadius: 4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                var note = noteLabels[ctx.dataIndex];
                return note
                  ? ctx.parsed.y + "% (" + note + ")"
                  : ctx.parsed.y + "%";
              },
            },
          },
        },
        scales: {
          y: {
            min: 0,
            max: 8,
            ticks: { callback: function (v) { return v + "%"; } },
          },
        },
      },
    });
  }
  initRaiseChart();

})();
