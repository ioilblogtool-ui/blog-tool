import { readParam, writeParams } from "./url-state.js";

(() => {
  const root = document.querySelector(".national-work-page");
  const dataEl = document.getElementById("nwsc-data");
  if (!root || !dataEl) return;

  const cfg = JSON.parse(dataEl.textContent || "{}");
  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => Array.from(root.querySelectorAll(selector));

  function num(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? Math.max(parsed, 0) : fallback;
  }

  function won(value) {
    return `${Math.round(value).toLocaleString("ko-KR")}원`;
  }

  function pct(value) {
    return `${Math.round(value).toLocaleString("ko-KR")}%`;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(Number.isFinite(value) ? value : 0, min), max);
  }

  function calcMonthlyPay(hourlyWage, weeklyHours, monthlyWeeks) {
    return hourlyWage * weeklyHours * monthlyWeeks;
  }

  function calc(input) {
    const hourlyWage = clamp(input.hourlyWage, 0, 50_000);
    const weeklyHours = clamp(input.weeklyHours, 0, 40);
    const monthlyWeeks = clamp(input.monthlyWeeks, 4, 4.345);
    const semesterMonths = clamp(input.semesterMonths, 0, 6);
    const vacationWeeklyHours = clamp(input.vacationWeeklyHours, 0, 40);
    const vacationMonths = input.includeVacation ? clamp(input.vacationMonths, 0, 3) : 0;
    const monthlyDeduction = clamp(input.monthlyDeduction, 0, 5_000_000);
    const monthlyLivingCost = clamp(input.monthlyLivingCost, 0, 5_000_000);

    const monthlyGrossPay = calcMonthlyPay(hourlyWage, weeklyHours, monthlyWeeks);
    const monthlyNetPay = Math.max(0, monthlyGrossPay - monthlyDeduction);
    const semesterNetPay = monthlyNetPay * semesterMonths;
    const vacationMonthlyGrossPay = input.includeVacation ? calcMonthlyPay(hourlyWage, vacationWeeklyHours, monthlyWeeks) : 0;
    const vacationMonthlyNetPay = input.includeVacation ? Math.max(0, vacationMonthlyGrossPay - monthlyDeduction) : 0;
    const vacationNetPay = vacationMonthlyNetPay * vacationMonths;
    const totalNetPay = semesterNetPay + vacationNetPay;
    const livingCoverageRate = monthlyLivingCost > 0 ? (monthlyNetPay / monthlyLivingCost) * 100 : 0;
    const monthlyShortageOrSurplus = monthlyNetPay - monthlyLivingCost;
    const campusMonthlyPay = calcMonthlyPay(cfg.wages.campus, weeklyHours, monthlyWeeks);
    const offCampusMonthlyPay = calcMonthlyPay(cfg.wages.offcampus, weeklyHours, monthlyWeeks);
    const typeGapMonthly = offCampusMonthlyPay - campusMonthlyPay;

    return {
      hourlyWage,
      weeklyHours,
      monthlyWeeks,
      semesterMonths,
      monthlyNetPay,
      semesterNetPay,
      vacationNetPay,
      totalNetPay,
      livingCoverageRate,
      monthlyShortageOrSurplus,
      campusMonthlyPay,
      offCampusMonthlyPay,
      typeGapMonthly,
      insight: buildInsight(monthlyNetPay, livingCoverageRate, monthlyLivingCost, weeklyHours, hourlyWage),
    };
  }

  function buildInsight(monthlyNetPay, coverage, monthlyLivingCost, weeklyHours, hourlyWage) {
    if (hourlyWage <= 0 || weeklyHours <= 0) return "시급과 주당 근로시간을 입력하면 월 예상 수령액을 계산할 수 있습니다.";
    const base = `주 ${weeklyHours.toLocaleString("ko-KR")}시간 기준 월 예상 수령액은 약 ${won(monthlyNetPay)}입니다.`;
    if (monthlyLivingCost <= 0) return `${base} 생활비 예산을 입력하면 충당률도 함께 볼 수 있습니다.`;
    if (coverage >= 100) return `${base} 입력한 월 생활비 예산을 대부분 충당할 수 있지만, 실제 근로시간은 선발과 근로지 배정에 따라 달라집니다.`;
    if (coverage >= 70) return `${base} 월 생활비 예산의 약 ${Math.round(coverage).toLocaleString("ko-KR")}%를 충당하는 수준입니다.`;
    if (coverage >= 40) return `${base} 생활비 일부를 보전할 수 있으나 주거비·등록금까지 포함하면 추가 예산이 필요할 수 있습니다.`;
    return `${base} 생활비 전체를 맡기기에는 부족한 편이므로 다른 지원금·아르바이트·대출 계획과 함께 봐야 합니다.`;
  }

  function readState() {
    const d = cfg.defaultInput;
    return {
      workType: $('[data-nwsc-input="workType"]')?.value || d.workType,
      hourlyWage: num($('[data-nwsc-input="hourlyWage"]')?.value, d.hourlyWage),
      weeklyHours: num($('[data-nwsc-input="weeklyHours"]')?.value, d.weeklyHours),
      monthlyWeeks: num($('[data-nwsc-input="monthlyWeeks"]')?.value, d.monthlyWeeks),
      semesterMonths: num($('[data-nwsc-input="semesterMonths"]')?.value, d.semesterMonths),
      includeVacation: Boolean($('[data-nwsc-input="includeVacation"]')?.checked),
      vacationWeeklyHours: num($('[data-nwsc-input="vacationWeeklyHours"]')?.value, d.vacationWeeklyHours),
      vacationMonths: num($('[data-nwsc-input="vacationMonths"]')?.value, d.vacationMonths),
      monthlyLivingCost: num($('[data-nwsc-input="monthlyLivingCost"]')?.value, d.monthlyLivingCost),
      monthlyDeduction: num($('[data-nwsc-input="monthlyDeduction"]')?.value, d.monthlyDeduction),
    };
  }

  function setInput(partial) {
    Object.entries(partial).forEach(([key, value]) => {
      const el = $(`[data-nwsc-input="${key}"]`);
      if (!el) return;
      if (el.type === "checkbox") {
        el.checked = Boolean(value);
      } else {
        el.value = typeof value === "number" && key !== "monthlyWeeks" ? value.toLocaleString("ko-KR") : value;
      }
    });
  }

  function syncWageFromType() {
    const type = $('[data-nwsc-input="workType"]')?.value;
    if (type === "campus") setInput({ hourlyWage: cfg.wages.campus });
    if (type === "offcampus") setInput({ hourlyWage: cfg.wages.offcampus });
  }

  function renderScenarios(state) {
    const wrap = $('[data-nwsc-result="scenarioRows"]');
    if (!wrap) return;
    wrap.innerHTML = cfg.hourScenarios
      .map((hours) => {
        const current = calcMonthlyPay(state.hourlyWage, hours, state.monthlyWeeks);
        const campus = calcMonthlyPay(cfg.wages.campus, hours, state.monthlyWeeks);
        const offcampus = calcMonthlyPay(cfg.wages.offcampus, hours, state.monthlyWeeks);
        return `<tr><td>주 ${hours}시간</td><td>${won(current)}</td><td>${won(campus)}</td><td>${won(offcampus)}</td></tr>`;
      })
      .join("");
  }

  function render() {
    const state = readState();
    const result = calc(state);

    $('[data-nwsc-result="monthlyNetPay"]').textContent = won(result.monthlyNetPay);
    $('[data-nwsc-result="semesterNetPay"]').textContent = won(result.semesterNetPay);
    $('[data-nwsc-result="totalNetPay"]').textContent = won(result.totalNetPay);
    $('[data-nwsc-result="livingCoverageRate"]').textContent = state.monthlyLivingCost > 0 ? pct(result.livingCoverageRate) : "예산 미입력";
    $('[data-nwsc-result="shortageOrSurplus"]').textContent = state.monthlyLivingCost > 0 ? won(result.monthlyShortageOrSurplus) : "-";
    $('[data-nwsc-result="campusMonthlyPay"]').textContent = won(result.campusMonthlyPay);
    $('[data-nwsc-result="offCampusMonthlyPay"]').textContent = won(result.offCampusMonthlyPay);
    $('[data-nwsc-result="typeGapMonthly"]').textContent = won(result.typeGapMonthly);
    $('[data-nwsc-result="insight"]').textContent = result.insight;
    renderScenarios(state);

    writeParams({
      t: state.workType,
      w: state.hourlyWage,
      wh: state.weeklyHours,
      mw: state.monthlyWeeks,
      m: state.semesterMonths,
      vac: state.includeVacation ? 1 : 0,
      vwh: state.vacationWeeklyHours,
      vm: state.vacationMonths,
      living: state.monthlyLivingCost,
      deduct: state.monthlyDeduction,
    });
  }

  $$("[data-nwsc-input]").forEach((el) => el.addEventListener("input", render));
  $$("[data-nwsc-input]").forEach((el) => el.addEventListener("change", render));
  $('[data-nwsc-input="workType"]')?.addEventListener("change", () => {
    syncWageFromType();
    render();
  });

  $$("[data-nwsc-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      const preset = cfg.presets.find((item) => item.id === button.dataset.nwscPreset);
      if (!preset) return;
      $$("[data-nwsc-preset]").forEach((el) => el.classList.toggle("is-active", el === button));
      setInput({ ...cfg.defaultInput, ...preset.input });
      render();
    });
  });

  document.getElementById("nwscResetBtn")?.addEventListener("click", () => { window.location.href = window.location.pathname; });
  document.getElementById("nwscCopyBtn")?.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(window.location.href); } catch {}
  });

  function restoreFromUrl() {
    const workType = readParam("t", "");
    if (!workType) return;
    setInput({
      workType,
      hourlyWage: num(readParam("w", ""), cfg.defaultInput.hourlyWage),
      weeklyHours: num(readParam("wh", ""), cfg.defaultInput.weeklyHours),
      monthlyWeeks: num(readParam("mw", ""), cfg.defaultInput.monthlyWeeks),
      semesterMonths: num(readParam("m", ""), cfg.defaultInput.semesterMonths),
      includeVacation: readParam("vac", "0") === "1",
      vacationWeeklyHours: num(readParam("vwh", ""), cfg.defaultInput.vacationWeeklyHours),
      vacationMonths: num(readParam("vm", ""), cfg.defaultInput.vacationMonths),
      monthlyLivingCost: num(readParam("living", ""), cfg.defaultInput.monthlyLivingCost),
      monthlyDeduction: num(readParam("deduct", ""), cfg.defaultInput.monthlyDeduction),
    });
  }

  restoreFromUrl();
  render();
})();
