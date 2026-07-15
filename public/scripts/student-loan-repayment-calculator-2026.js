import { readParam, writeParams } from "./url-state.js";

(() => {
  const root = document.querySelector(".slr-page");
  const dataEl = document.getElementById("slr-data");
  if (!root || !dataEl) return;

  const cfg = JSON.parse(dataEl.textContent || "{}");
  const THRESHOLD_INCOME = cfg.thresholdIncome;
  const REPAYMENT_RATE = { UNDERGRAD: 0.2, GRAD: 0.25 };

  const $ = (selector) => root.querySelector(selector);

  function num(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? Math.max(parsed, 0) : fallback;
  }

  function won(value) {
    return `${Math.round(value).toLocaleString("ko-KR")}원`;
  }

  function getCourseType() {
    return document.querySelector('input[name="slrCourse"]:checked')?.value || "UNDERGRAD";
  }

  // calcLoanRepayment — studentLoanRepaymentCalculator2026.ts의 로직과 1:1 대응
  function calcLoanRepayment(input) {
    const graceInterest = input.principal * (input.interestRate / 100) * input.graceYears;
    const balanceAfterGrace = input.principal + graceInterest;

    const rate = REPAYMENT_RATE[input.courseType];
    const annualMandatoryRepay = Math.max((input.expectedAnnualIncome - THRESHOLD_INCOME) * rate, 0);
    const monthlyMandatoryRepay = annualMandatoryRepay / 12;
    const mandatoryPayoffYears = annualMandatoryRepay > 0 ? balanceAfterGrace / annualMandatoryRepay : null;

    const monthlyRate = input.interestRate / 100 / 12;
    const n = input.repayYears * 12;
    const monthlyEqualPayment =
      monthlyRate > 0
        ? (balanceAfterGrace * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
        : balanceAfterGrace / n;
    const totalEqualPaid = monthlyEqualPayment * n;
    const totalEqualInterest = totalEqualPaid - balanceAfterGrace;

    return {
      graceInterest,
      balanceAfterGrace,
      annualMandatoryRepay,
      monthlyMandatoryRepay,
      mandatoryPayoffYears,
      monthlyEqualPayment,
      totalEqualPaid,
      totalEqualInterest,
    };
  }

  function readState() {
    return {
      principal: num($('[data-slr="principal"]')?.value, cfg.defaultInput.principal),
      interestRate: num($('[data-slr="interestRate"]')?.value, cfg.interestRateDefault),
      graceYears: num($('[data-slr="graceYears"]')?.value, cfg.defaultInput.graceYears),
      repayYears: Math.max(num($('[data-slr="repayYears"]')?.value, cfg.defaultInput.repayYears), 1),
      expectedAnnualIncome: num($('[data-slr="expectedAnnualIncome"]')?.value, cfg.defaultInput.expectedAnnualIncome),
      courseType: getCourseType(),
    };
  }

  function render() {
    const state = readState();
    const result = calcLoanRepayment(state);

    $('[data-slr-result="graceInterest"]').textContent = won(result.graceInterest);
    $('[data-slr-result="balanceAfterGrace"]').textContent = won(result.balanceAfterGrace);
    $('[data-slr-result="annualMandatoryRepay"]').textContent = won(result.annualMandatoryRepay);
    $('[data-slr-result="monthlyMandatoryRepay"]').textContent = won(result.monthlyMandatoryRepay);
    $('[data-slr-result="monthlyEqualPayment"]').textContent = won(result.monthlyEqualPayment);
    $('[data-slr-result="totalEqualPaid"]').textContent = won(result.totalEqualPaid);
    $('[data-slr-result="totalEqualInterest"]').textContent = won(result.totalEqualInterest);

    const payoffEl = $('[data-slr-result="mandatoryPayoffNote"]');
    if (payoffEl) {
      payoffEl.textContent =
        result.annualMandatoryRepay > 0
          ? `연 의무상환액 기준 단순 완제 예상 기간(참고) 약 ${result.mandatoryPayoffYears.toFixed(1)}년`
          : "예상 연소득이 상환기준소득 이하라 의무상환액이 발생하지 않습니다(소득 발생 시까지 유예).";
    }

    writeParams({
      p: state.principal,
      r: state.interestRate,
      g: state.graceYears,
      y: state.repayYears,
      inc: state.expectedAnnualIncome,
      c: state.courseType,
    });
  }

  function syncSlider(inputSelector, sliderId, valId) {
    const input = $(inputSelector);
    const slider = document.getElementById(sliderId);
    const valEl = document.getElementById(valId);
    if (!input || !slider) return;
    const val = num(input.value, 0);
    slider.value = String(Math.min(Math.max(val, Number(slider.min)), Number(slider.max)));
    if (valEl) valEl.textContent = `${Math.round(val / 10000).toLocaleString("ko-KR")}만원`;
  }

  function wireSlider(inputSelector, sliderId, valId) {
    const input = $(inputSelector);
    const slider = document.getElementById(sliderId);
    const valEl = document.getElementById(valId);
    if (!input || !slider) return;

    input.addEventListener("input", () => {
      syncSlider(inputSelector, sliderId, valId);
      render();
    });
    slider.addEventListener("input", () => {
      input.value = Number(slider.value).toLocaleString("ko-KR");
      if (valEl) valEl.textContent = `${Math.round(Number(slider.value) / 10000).toLocaleString("ko-KR")}만원`;
      render();
    });
  }

  wireSlider('[data-slr="principal"]', "slrPrincipalSlider", "slrPrincipalSliderVal");
  wireSlider('[data-slr="expectedAnnualIncome"]', "slrIncomeSlider", "slrIncomeSliderVal");

  ["interestRate", "graceYears", "repayYears"].forEach((key) => {
    $(`[data-slr="${key}"]`)?.addEventListener("input", render);
  });
  document.querySelectorAll('input[name="slrCourse"]').forEach((el) => el.addEventListener("change", render));

  document.getElementById("slrResetBtn")?.addEventListener("click", () => {
    window.location.href = window.location.pathname;
  });
  document.getElementById("slrCopyBtn")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      const btn = document.getElementById("slrCopyBtn");
      if (btn) {
        const original = btn.textContent;
        btn.textContent = "링크 복사 완료";
        setTimeout(() => { btn.textContent = original; }, 1600);
      }
    } catch {
      // 클립보드 접근 실패 시 조용히 무시
    }
  });

  function restoreFromUrl() {
    const p = readParam("p", "");
    if (!p) return;
    $('[data-slr="principal"]').value = num(p, cfg.defaultInput.principal).toLocaleString("ko-KR");
    $('[data-slr="interestRate"]').value = readParam("r", String(cfg.interestRateDefault));
    $('[data-slr="graceYears"]').value = readParam("g", String(cfg.defaultInput.graceYears));
    $('[data-slr="repayYears"]').value = readParam("y", String(cfg.defaultInput.repayYears));
    $('[data-slr="expectedAnnualIncome"]').value = num(readParam("inc", ""), cfg.defaultInput.expectedAnnualIncome).toLocaleString("ko-KR");

    const course = readParam("c", "UNDERGRAD");
    const courseInput = document.querySelector(`input[name="slrCourse"][value="${course}"]`);
    if (courseInput) courseInput.checked = true;

    syncSlider('[data-slr="principal"]', "slrPrincipalSlider", "slrPrincipalSliderVal");
    syncSlider('[data-slr="expectedAnnualIncome"]', "slrIncomeSlider", "slrIncomeSliderVal");
  }

  restoreFromUrl();
  render();
})();
