import { readParam, writeParams } from "./url-state.js";

(() => {
  const root = document.querySelector(".retake-page");
  const dataEl = document.getElementById("retake-data");
  if (!root || !dataEl) return;

  const cfg = JSON.parse(dataEl.textContent || "{}");
  const presets = cfg.presets || [];

  const $ = (selector) => root.querySelector(selector);

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

  // calcRetakeCost — retakeExamCostCalculator2026.ts의 로직과 1:1 대응
  function calcRetakeCost(input) {
    const tuitionTotal = input.monthlyTuition * input.months;
    const extraTotal = input.extraFee;
    const grandTotal = tuitionTotal + extraTotal;
    const monthlyAverage = input.months > 0 ? grandTotal / input.months : 0;
    return { tuitionTotal, extraTotal, grandTotal, monthlyAverage };
  }

  function getType() {
    return document.querySelector('input[name="retakeType"]:checked')?.value || "COMMUTE";
  }

  function readState() {
    return {
      type: getType(),
      monthlyTuition: num($('[data-retake="monthlyTuition"]')?.value, cfg.defaultInput.monthlyTuition),
      months: Math.max(num($('[data-retake="months"]')?.value, cfg.defaultInput.months), 1),
      extraFee: num($('[data-retake="extraFee"]')?.value, cfg.defaultInput.extraFee),
    };
  }

  function render() {
    const state = readState();
    const result = calcRetakeCost(state);

    $('[data-retake-result="tuitionTotal"]').textContent = won(result.tuitionTotal);
    $('[data-retake-result="extraTotal"]').textContent = won(result.extraTotal);
    $('[data-retake-result="grandTotal"]').textContent = won(result.grandTotal);
    $('[data-retake-result="monthlyAverage"]').textContent = won(Math.round(result.monthlyAverage));

    writeParams({
      t: state.type,
      m: state.monthlyTuition,
      mo: state.months,
      e: state.extraFee,
    });
  }

  function syncSlider(inputSelector, sliderId, valId) {
    const input = $(inputSelector);
    const slider = document.getElementById(sliderId);
    const valEl = document.getElementById(valId);
    if (!input || !slider) return;
    const val = num(input.value, 0);
    slider.value = String(Math.min(Math.max(val, Number(slider.min)), Number(slider.max)));
    if (valEl) valEl.textContent = man(val);
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
      if (valEl) valEl.textContent = man(Number(slider.value));
      render();
    });
  }

  wireSlider('[data-retake="monthlyTuition"]', "retakeTuitionSlider", "retakeTuitionSliderVal");
  wireSlider('[data-retake="extraFee"]', "retakeExtraSlider", "retakeExtraSliderVal");

  $('[data-retake="months"]')?.addEventListener("input", render);

  document.querySelectorAll('input[name="retakeType"]').forEach((el) => {
    el.addEventListener("change", () => {
      const preset = presets.find((p) => p.type === el.value);
      if (!preset) return;
      $('[data-retake="monthlyTuition"]').value = preset.monthlyTuitionDefault.toLocaleString("ko-KR");
      $('[data-retake="extraFee"]').value = preset.extraFeeDefault.toLocaleString("ko-KR");
      syncSlider('[data-retake="monthlyTuition"]', "retakeTuitionSlider", "retakeTuitionSliderVal");
      syncSlider('[data-retake="extraFee"]', "retakeExtraSlider", "retakeExtraSliderVal");
      const note = $("[data-retake-type-note]");
      if (note) note.textContent = preset.note;
      render();
    });
  });

  document.getElementById("retakeResetBtn")?.addEventListener("click", () => {
    window.location.href = window.location.pathname;
  });
  document.getElementById("retakeCopyBtn")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      const btn = document.getElementById("retakeCopyBtn");
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
    const m = readParam("m", "");
    if (!m) return;
    $('[data-retake="monthlyTuition"]').value = num(m, cfg.defaultInput.monthlyTuition).toLocaleString("ko-KR");
    $('[data-retake="months"]').value = readParam("mo", String(cfg.defaultInput.months));
    $('[data-retake="extraFee"]').value = num(readParam("e", ""), cfg.defaultInput.extraFee).toLocaleString("ko-KR");

    const type = readParam("t", "COMMUTE");
    const typeInput = document.querySelector(`input[name="retakeType"][value="${type}"]`);
    if (typeInput) typeInput.checked = true;
    const preset = presets.find((p) => p.type === type);
    const note = $("[data-retake-type-note]");
    if (note && preset) note.textContent = preset.note;

    syncSlider('[data-retake="monthlyTuition"]', "retakeTuitionSlider", "retakeTuitionSliderVal");
    syncSlider('[data-retake="extraFee"]', "retakeExtraSlider", "retakeExtraSliderVal");
  }

  restoreFromUrl();
  render();
})();
