import { readParam, writeParams } from "./url-state.js";

(() => {
  const root = document.querySelector(".dvc-page");
  const dataEl = document.getElementById("dvc-data");
  if (!root || !dataEl) return;

  const cfg = JSON.parse(dataEl.textContent || "{}");
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

  // calcResidenceCost — dormVsCommuteCostComparison2026.ts의 로직과 1:1 대응
  function calcResidenceCost(input, years) {
    const monthlyTotal = input.monthlyHousing + input.monthlyLiving;
    const total4y = monthlyTotal * 12 * years;
    return { ...input, monthlyTotal, total4y };
  }

  // calcCommuteTime — 동일 파일의 로직과 1:1 대응
  function calcCommuteTime(input, years) {
    const dailyMinutes = input.oneWayMinutes * 2;
    const annualMinutes = dailyMinutes * input.schoolDaysPerYear;
    const annualHours = annualMinutes / 60;
    return { annualHours, totalHours: annualHours * years };
  }

  function getYears() {
    return Number(document.querySelector('input[name="dvcYears"]:checked')?.value || "4");
  }

  function readResidenceInputs() {
    return residencePresets.map((preset) => ({
      type: preset.type,
      monthlyHousing: num($(`[data-dvc-residence="${preset.type}"][data-dvc-field="housing"]`)?.value, preset.monthlyHousingDefault),
      monthlyLiving: num($(`[data-dvc-residence="${preset.type}"][data-dvc-field="living"]`)?.value, preset.monthlyLivingDefault),
    }));
  }

  function readCommuteInput() {
    return {
      oneWayMinutes: num($('[data-dvc-commute="oneWayMinutes"]')?.value, cfg.defaultInput.oneWayMinutes),
      schoolDaysPerYear: num($('[data-dvc-commute="schoolDaysPerYear"]')?.value, cfg.defaultInput.schoolDaysPerYear),
    };
  }

  function render() {
    const years = getYears();
    const residenceInputs = readResidenceInputs();
    const results = residenceInputs.map((input) => calcResidenceCost(input, years));
    const commuteResult = calcCommuteTime(readCommuteInput(), years);

    const lowest = results.reduce((min, r) => (r.total4y < min.total4y ? r : min), results[0]);

    results.forEach((r) => {
      $(`[data-dvc-result="${r.type}-total4y"]`).textContent = won(r.total4y);
      $(`[data-dvc-result="${r.type}-monthly"]`).textContent = `월 ${won(r.monthlyTotal)}`;
      const card = $(`[data-dvc-card="${r.type}"]`);
      if (card) card.classList.toggle("is-lowest", r.type === lowest.type);
    });

    const commuteEl = $('[data-dvc-result="commuteHours"]');
    if (commuteEl) {
      commuteEl.textContent = `통학시간 연 ${Math.round(commuteResult.annualHours).toLocaleString("ko-KR")}시간 · ${years}년 누적 ${Math.round(commuteResult.totalHours).toLocaleString("ko-KR")}시간`;
    }

    const barList = $("[data-dvc-bar-list]");
    if (barList) {
      const maxTotal = Math.max(...results.map((r) => r.monthlyTotal), 1);
      barList.innerHTML = results
        .map((r) => {
          const label = { PARENTS: "부모님 집(통학)", DORM: "기숙사", OFFCAMPUS: "자취" }[r.type] || r.type;
          const width = Math.min(Math.max((r.monthlyTotal / maxTotal) * 100, 2), 100);
          return `<article class="dvc-breakdown-row"><strong>${label}</strong><span><i style="width:${width}%"></i></span><em>${man(r.monthlyTotal)}/월</em></article>`;
        })
        .join("");
    }

    writeParams({
      y: years,
      om: readCommuteInput().oneWayMinutes,
      sd: readCommuteInput().schoolDaysPerYear,
    });
  }

  $$('input[name="dvcYears"]').forEach((el) => el.addEventListener("change", render));
  $$("[data-dvc-commute]").forEach((el) => el.addEventListener("input", render));
  $$("[data-dvc-residence]").forEach((el) => el.addEventListener("input", render));

  document.getElementById("dvcResetBtn")?.addEventListener("click", () => {
    window.location.href = window.location.pathname;
  });
  document.getElementById("dvcCopyBtn")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      const btn = document.getElementById("dvcCopyBtn");
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
    const y = readParam("y", "");
    if (!y) return;
    const yearsInput = document.querySelector(`input[name="dvcYears"][value="${y}"]`);
    if (yearsInput) yearsInput.checked = true;
    const om = readParam("om", "");
    if (om) $('[data-dvc-commute="oneWayMinutes"]').value = num(om, cfg.defaultInput.oneWayMinutes).toLocaleString("ko-KR");
    const sd = readParam("sd", "");
    if (sd) $('[data-dvc-commute="schoolDaysPerYear"]').value = num(sd, cfg.defaultInput.schoolDaysPerYear).toLocaleString("ko-KR");
  }

  restoreFromUrl();
  render();
})();
