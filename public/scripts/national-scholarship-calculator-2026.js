import { readParam, writeParams } from "./url-state.js";

(() => {
  const root = document.querySelector(".ns-page");
  const dataEl = document.getElementById("ns-data");
  if (!root || !dataEl) return;

  const cfg = JSON.parse(dataEl.textContent || "{}");
  const incomeBrackets = cfg.incomeBrackets || [];
  const scholarshipAmounts = cfg.scholarshipAmounts || [];
  const multiChild = cfg.multiChild || {};

  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => Array.from(root.querySelectorAll(selector));

  function num(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? Math.max(parsed, 0) : fallback;
  }

  function won(value) {
    return `${Math.round(value).toLocaleString("ko-KR")}원`;
  }

  function man(value) {
    return `${Math.round(value / 10000).toLocaleString("ko-KR")}만원`;
  }

  function findIncomeBracket(monthlyIncome) {
    const found = incomeBrackets.find((b) => b.monthlyIncomeCap !== null && monthlyIncome <= b.monthlyIncomeCap);
    return found ? found.bracket : 10;
  }

  // calcNationalScholarship — nationalScholarship2026.ts의 로직과 1:1 대응, 값 변경 시 양쪽 동기화 필수
  function calcNationalScholarship(input) {
    const bracket = findIncomeBracket(input.householdMonthlyIncome);

    let annualAmount =
      scholarshipAmounts.find((r) => bracket >= r.minBracket && bracket <= r.maxBracket)?.annualAmount ?? 0;

    if (input.multiChildStatus === "THIRD_OR_MORE" && bracket <= multiChild.THIRD_OR_MORE.fullTuitionUpToBracket) {
      annualAmount = input.annualTuition;
    } else if (input.multiChildStatus === "SECOND") {
      if (bracket <= 3) annualAmount = multiChild.SECOND.upToBracket3;
      else if (bracket <= 8) annualAmount = multiChild.SECOND.bracket4to8;
    }

    annualAmount = Math.min(annualAmount, input.annualTuition);

    const tuitionCoverageRatio =
      input.annualTuition > 0 ? Math.min(Math.round((annualAmount / input.annualTuition) * 100), 100) : 0;

    return { bracket, annualAmount, tuitionCoverageRatio };
  }

  function getMultiChildStatus() {
    return document.querySelector('input[name="nsMultiChild"]:checked')?.value || "NONE";
  }

  function readState() {
    return {
      householdSize: Number($('[data-ns="householdSize"]')?.value || cfg.defaultInput.householdSize),
      householdMonthlyIncome: num($('[data-ns="householdMonthlyIncome"]')?.value, cfg.defaultInput.householdMonthlyIncome),
      multiChildStatus: getMultiChildStatus(),
      annualTuition: num($('[data-ns="annualTuition"]')?.value, cfg.defaultInput.annualTuition),
    };
  }

  function highlightBracket(bracket) {
    $$("[data-ns-bracket-row]").forEach((row) => {
      row.classList.toggle("is-active", Number(row.dataset.nsBracketRow) === bracket);
    });
  }

  function render() {
    const state = readState();
    const result = calcNationalScholarship(state);

    $('[data-ns-result="bracket"]').textContent = `${result.bracket}구간`;
    $('[data-ns-result="annualAmount"]').textContent = result.annualAmount > 0 ? won(result.annualAmount) : "미지원";
    $('[data-ns-result="tuitionCoverageRatio"]').textContent = `${result.tuitionCoverageRatio}%`;

    highlightBracket(result.bracket);

    writeParams({
      sz: state.householdSize,
      inc: state.householdMonthlyIncome,
      mc: state.multiChildStatus,
      tu: state.annualTuition,
    });
  }

  function syncIncomeSlider() {
    const input = $('[data-ns="householdMonthlyIncome"]');
    const slider = document.getElementById("nsIncomeSlider");
    const valEl = document.getElementById("nsIncomeSliderVal");
    if (!input || !slider) return;
    const val = num(input.value, 0);
    slider.value = String(Math.min(Math.max(val, Number(slider.min)), Number(slider.max)));
    if (valEl) valEl.textContent = man(val);
  }

  $('[data-ns="householdMonthlyIncome"]')?.addEventListener("input", () => {
    syncIncomeSlider();
    render();
  });
  document.getElementById("nsIncomeSlider")?.addEventListener("input", (e) => {
    const input = $('[data-ns="householdMonthlyIncome"]');
    if (input) input.value = Number(e.target.value).toLocaleString("ko-KR");
    const valEl = document.getElementById("nsIncomeSliderVal");
    if (valEl) valEl.textContent = man(Number(e.target.value));
    render();
  });

  $('[data-ns="householdSize"]')?.addEventListener("change", render);
  $$('input[name="nsMultiChild"]').forEach((el) => el.addEventListener("change", render));

  $$('input[name="nsUnivType"]').forEach((el) => {
    el.addEventListener("change", () => {
      const tuition = Number(el.dataset.nsTuition || cfg.defaultInput.annualTuition);
      const tuitionInput = $('[data-ns="annualTuition"]');
      if (tuitionInput) tuitionInput.value = tuition.toLocaleString("ko-KR");
      render();
    });
  });

  $('[data-ns="annualTuition"]')?.addEventListener("input", render);

  function restoreFromUrl() {
    const inc = readParam("inc", "");
    if (!inc) return;
    const incomeInput = $('[data-ns="householdMonthlyIncome"]');
    if (incomeInput) incomeInput.value = num(inc, cfg.defaultInput.householdMonthlyIncome).toLocaleString("ko-KR");
    syncIncomeSlider();

    const sizeSelect = $('[data-ns="householdSize"]');
    const size = readParam("sz", String(cfg.defaultInput.householdSize));
    if (sizeSelect) sizeSelect.value = size;

    const multiChild = readParam("mc", "NONE");
    const multiChildInput = document.querySelector(`input[name="nsMultiChild"][value="${multiChild}"]`);
    if (multiChildInput) multiChildInput.checked = true;

    const tuition = readParam("tu", "");
    if (tuition) {
      const tuitionInput = $('[data-ns="annualTuition"]');
      if (tuitionInput) tuitionInput.value = num(tuition, cfg.defaultInput.annualTuition).toLocaleString("ko-KR");
    }
  }

  document.getElementById("nsResetBtn")?.addEventListener("click", () => {
    window.location.href = window.location.pathname;
  });
  document.getElementById("nsCopyBtn")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      const btn = document.getElementById("nsCopyBtn");
      if (btn) {
        const original = btn.textContent;
        btn.textContent = "링크 복사 완료";
        setTimeout(() => { btn.textContent = original; }, 1600);
      }
    } catch {
      // 클립보드 접근 실패 시 조용히 무시
    }
  });

  restoreFromUrl();
  render();
})();
