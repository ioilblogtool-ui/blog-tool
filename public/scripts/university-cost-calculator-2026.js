import { readParam, writeParams } from "./url-state.js";

(() => {
  const root = document.querySelector(".ucc-page");
  const dataEl = document.getElementById("ucc-data");
  if (!root || !dataEl) return;

  const cfg = JSON.parse(dataEl.textContent || "{}");
  const tuitionPresets = cfg.tuitionPresets || [];
  const residencePresets = cfg.residencePresets || [];

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

  // calcUniversityCost — universityCostCalculator2026.ts의 로직과 1:1 대응, 값 변경 시 양쪽 동기화 필수
  function calcUniversityCost(input) {
    const tuitionTotal = input.annualTuition * input.yearsEnrolled;
    const monthlyTotal = input.monthlyHousing + input.monthlyLiving + input.monthlyCommute;
    const livingTotal = monthlyTotal * 12 * input.yearsEnrolled;
    const aidTotal = input.annualScholarship * input.yearsEnrolled;
    const grossTotal = tuitionTotal + livingTotal;
    const netBurden = Math.max(grossTotal - aidTotal, 0);
    const monthlyAverage = netBurden / (input.yearsEnrolled * 12);
    const aidCoverageRatio = grossTotal > 0 ? Math.min(Math.round((aidTotal / grossTotal) * 100), 100) : 0;
    return { tuitionTotal, livingTotal, aidTotal, grossTotal, netBurden, monthlyAverage, aidCoverageRatio };
  }

  function getResidenceType() {
    return document.querySelector('input[name="uccResidence"]:checked')?.value || "PARENTS";
  }

  function getYears() {
    return Number(document.querySelector('input[name="uccYears"]:checked')?.value || "4");
  }

  function getViewMode() {
    return document.querySelector('input[name="uccViewMode"]:checked')?.value || "GROSS";
  }

  function readState() {
    return {
      annualTuition: num($('[data-ucc="annualTuition"]')?.value, cfg.defaultInput.annualTuition),
      residenceType: getResidenceType(),
      monthlyHousing: num($('[data-ucc="monthlyHousing"]')?.value, cfg.defaultInput.monthlyHousing),
      monthlyLiving: num($('[data-ucc="monthlyLiving"]')?.value, cfg.defaultInput.monthlyLiving),
      monthlyCommute: num($('[data-ucc="monthlyCommute"]')?.value, cfg.defaultInput.monthlyCommute),
      annualScholarship: num($('[data-ucc="annualScholarship"]')?.value, cfg.defaultInput.annualScholarship),
      yearsEnrolled: getYears(),
    };
  }

  function renderBreakdown(state, result) {
    const wrap = $("[data-ucc-breakdown]");
    if (!wrap) return;
    const viewMode = getViewMode();

    let items;
    if (viewMode === "GROSS") {
      items = [
        ["등록금 총액", result.tuitionTotal],
        ["주거·생활비 총액", result.livingTotal],
      ];
    } else {
      items = [
        ["총비용(장학금 반영 전)", result.grossTotal],
        ["장학금 차감", result.aidTotal],
        ["실부담금", result.netBurden],
      ];
    }
    const total = Math.max(result.grossTotal, 1);
    wrap.innerHTML = items
      .map(([label, value]) => {
        const width = Math.min(Math.max((value / total) * 100, 0), 100);
        return `<article class="ucc-breakdown-row"><strong>${label}</strong><span><i style="width:${width}%"></i></span><em>${man(value)}</em></article>`;
      })
      .join("");
  }

  function render() {
    const state = readState();
    const result = calcUniversityCost(state);

    $('[data-ucc-result="tuitionTotal"]').textContent = won(result.tuitionTotal);
    $('[data-ucc-result="livingTotal"]').textContent = won(result.livingTotal);
    $('[data-ucc-result="aidTotal"]').textContent = result.aidTotal > 0 ? `-${won(result.aidTotal)}` : won(0);
    $('[data-ucc-result="netBurden"]').textContent = won(result.netBurden);
    $('[data-ucc-result="monthlyAverage"]').textContent = won(Math.round(result.monthlyAverage));
    $('[data-ucc-result="aidCoverageRatio"]').textContent = `${result.aidCoverageRatio}%`;

    renderBreakdown(state, result);

    writeParams({
      t: state.annualTuition,
      r: state.residenceType,
      h: state.monthlyHousing,
      l: state.monthlyLiving,
      c: state.monthlyCommute,
      s: state.annualScholarship,
      y: state.yearsEnrolled,
    });
  }

  function syncSliderFromInput(inputSelector, sliderId, valId) {
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
      syncSliderFromInput(inputSelector, sliderId, valId);
      render();
    });
    slider.addEventListener("input", () => {
      input.value = Number(slider.value).toLocaleString("ko-KR");
      if (valEl) valEl.textContent = man(Number(slider.value));
      render();
    });
  }

  wireSlider('[data-ucc="annualTuition"]', "uccTuitionSlider", "uccTuitionSliderVal");
  wireSlider('[data-ucc="monthlyHousing"]', "uccHousingSlider", "uccHousingSliderVal");
  wireSlider('[data-ucc="monthlyLiving"]', "uccLivingSlider", "uccLivingSliderVal");
  wireSlider('[data-ucc="monthlyCommute"]', "uccCommuteSlider", "uccCommuteSliderVal");
  wireSlider('[data-ucc="annualScholarship"]', "uccScholarshipSlider", "uccScholarshipSliderVal");

  $$('input[name="uccYears"]').forEach((el) => el.addEventListener("change", render));
  $$('input[name="uccViewMode"]').forEach((el) => el.addEventListener("change", render));

  $$('input[name="uccResidence"]').forEach((el) => {
    el.addEventListener("change", () => {
      const preset = residencePresets.find((p) => p.type === el.value);
      if (!preset) return;
      $('[data-ucc="monthlyHousing"]').value = preset.monthlyHousingDefault.toLocaleString("ko-KR");
      $('[data-ucc="monthlyLiving"]').value = preset.monthlyLivingDefault.toLocaleString("ko-KR");
      syncSliderFromInput('[data-ucc="monthlyHousing"]', "uccHousingSlider", "uccHousingSliderVal");
      syncSliderFromInput('[data-ucc="monthlyLiving"]', "uccLivingSlider", "uccLivingSliderVal");
      const note = $("[data-ucc-residence-note]");
      if (note) note.textContent = preset.note;
      render();
    });
  });

  $$("[data-ucc-tuition-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      const value = Number(button.dataset.uccTuitionValue || "0");
      $('[data-ucc="annualTuition"]').value = value.toLocaleString("ko-KR");
      syncSliderFromInput('[data-ucc="annualTuition"]', "uccTuitionSlider", "uccTuitionSliderVal");
      render();
    });
  });

  function restoreFromUrl() {
    const t = readParam("t", "");
    if (!t) return;
    $('[data-ucc="annualTuition"]').value = num(t, cfg.defaultInput.annualTuition).toLocaleString("ko-KR");
    $('[data-ucc="monthlyHousing"]').value = num(readParam("h", ""), cfg.defaultInput.monthlyHousing).toLocaleString("ko-KR");
    $('[data-ucc="monthlyLiving"]').value = num(readParam("l", ""), cfg.defaultInput.monthlyLiving).toLocaleString("ko-KR");
    $('[data-ucc="monthlyCommute"]').value = num(readParam("c", ""), cfg.defaultInput.monthlyCommute).toLocaleString("ko-KR");
    $('[data-ucc="annualScholarship"]').value = num(readParam("s", ""), cfg.defaultInput.annualScholarship).toLocaleString("ko-KR");

    const residence = readParam("r", "PARENTS");
    const residenceInput = document.querySelector(`input[name="uccResidence"][value="${residence}"]`);
    if (residenceInput) residenceInput.checked = true;

    const years = readParam("y", "4");
    const yearsInput = document.querySelector(`input[name="uccYears"][value="${years}"]`);
    if (yearsInput) yearsInput.checked = true;

    ["annualTuition", "monthlyHousing", "monthlyLiving", "monthlyCommute", "annualScholarship"].forEach((key) => {
      const map = {
        annualTuition: ["uccTuitionSlider", "uccTuitionSliderVal"],
        monthlyHousing: ["uccHousingSlider", "uccHousingSliderVal"],
        monthlyLiving: ["uccLivingSlider", "uccLivingSliderVal"],
        monthlyCommute: ["uccCommuteSlider", "uccCommuteSliderVal"],
        annualScholarship: ["uccScholarshipSlider", "uccScholarshipSliderVal"],
      };
      const [sliderId, valId] = map[key];
      syncSliderFromInput(`[data-ucc="${key}"]`, sliderId, valId);
    });
  }

  document.getElementById("uccResetBtn")?.addEventListener("click", () => {
    window.location.href = window.location.pathname;
  });
  document.getElementById("uccCopyBtn")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      const btn = document.getElementById("uccCopyBtn");
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
