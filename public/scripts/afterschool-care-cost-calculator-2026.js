import { readParam, writeParams } from "./url-state.js";

(() => {
  const root = document.querySelector(".afterschool-care-page");
  const dataEl = document.getElementById("acc-data");
  if (!root || !dataEl) return;

  const cfg = JSON.parse(dataEl.textContent || "{}");
  const $ = (selector) => root.querySelector(selector);

  function num(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? Math.max(parsed, 0) : fallback;
  }

  function won(value) {
    return `${Math.round(value).toLocaleString("ko-KR")}원`;
  }

  function calc(input) {
    const monthlyProgramCost = input.programCount * input.programMonthlyFee;
    const monthlySchoolCost = monthlyProgramCost + input.careMonthlyFee + input.snackMonthlyFee + input.materialMonthlyFee;
    const monthlyTotalCost = monthlySchoolCost + input.academyMonthlyFee;
    const semesterSchoolCost = monthlySchoolCost * input.semesterMonths;
    const semesterAcademyCost = input.academyMonthlyFee * input.semesterMonths;
    const semesterGrossCost = monthlyTotalCost * input.semesterMonths;
    const semesterProgramCost = monthlyProgramCost * input.semesterMonths;
    const semesterVoucher = Math.min(input.voucherAmount, semesterProgramCost);
    const remainingVoucher = Math.max(input.voucherAmount - semesterVoucher, 0);
    const semesterNetCost = Math.max(semesterGrossCost - semesterVoucher, 0);
    const monthlyNetCost = input.semesterMonths > 0 ? semesterNetCost / input.semesterMonths : 0;
    const schoolShare = monthlyTotalCost > 0 ? monthlySchoolCost / monthlyTotalCost * 100 : 0;
    const academyShare = monthlyTotalCost > 0 ? input.academyMonthlyFee / monthlyTotalCost * 100 : 0;
    const voucherSavingRate = semesterGrossCost > 0 ? semesterVoucher / semesterGrossCost * 100 : 0;
    const insight = academyShare >= 50
      ? "현재 예산에서는 학원·학습지 비용 비중이 큽니다. 전체 부담을 줄이려면 방과후 과목 수보다 학원비 조정이 더 큰 영향을 줄 수 있습니다."
      : schoolShare >= 70
        ? "현재 예산에서는 학교 방과후·돌봄 비용 비중이 큽니다. 과목별 수강료와 재료비 포함 여부를 학교 안내문에서 다시 확인하세요."
        : "학교 비용과 학원비가 비교적 균형 있게 섞여 있습니다. 이용권 적용 후 남는 학기 순부담을 기준으로 신청 조합을 비교해 보세요.";
    return {
      monthlyProgramCost,
      monthlySchoolCost,
      monthlyTotalCost,
      semesterSchoolCost,
      semesterAcademyCost,
      semesterGrossCost,
      semesterProgramCost,
      semesterVoucher,
      remainingVoucher,
      semesterNetCost,
      monthlyNetCost,
      schoolShare,
      academyShare,
      voucherSavingRate,
      insight,
    };
  }

  function readState() {
    return {
      grade: $('[data-acc-input="grade"]')?.value || cfg.defaultInput.grade,
      programCount: num($('[data-acc-input="programCount"]')?.value, cfg.defaultInput.programCount),
      programMonthlyFee: num($('[data-acc-input="programMonthlyFee"]')?.value, cfg.defaultInput.programMonthlyFee),
      careMonthlyFee: num($('[data-acc-input="careMonthlyFee"]')?.value, cfg.defaultInput.careMonthlyFee),
      snackMonthlyFee: num($('[data-acc-input="snackMonthlyFee"]')?.value, cfg.defaultInput.snackMonthlyFee),
      materialMonthlyFee: num($('[data-acc-input="materialMonthlyFee"]')?.value, cfg.defaultInput.materialMonthlyFee),
      academyMonthlyFee: num($('[data-acc-input="academyMonthlyFee"]')?.value, cfg.defaultInput.academyMonthlyFee),
      semesterMonths: num($('[data-acc-input="semesterMonths"]')?.value, cfg.defaultInput.semesterMonths),
      voucherAmount: num($('[data-acc-input="voucherAmount"]')?.value, cfg.defaultInput.voucherAmount),
    };
  }

  function setInput(partial) {
    Object.entries(partial).forEach(([key, value]) => {
      const el = $(`[data-acc-input="${key}"]`);
      if (!el) return;
      el.value = typeof value === "number" ? value.toLocaleString("ko-KR") : value;
    });
  }

  function render() {
    const state = readState();
    const result = calc(state);
    $('[data-acc-result="monthlySchoolCost"]').textContent = won(result.monthlySchoolCost);
    $('[data-acc-result="monthlyAcademyCost"]').textContent = won(state.academyMonthlyFee);
    $('[data-acc-result="semesterGrossCost"]').textContent = won(result.semesterGrossCost);
    $('[data-acc-result="voucherInput"]').textContent = won(state.voucherAmount);
    $('[data-acc-result="semesterVoucher"]').textContent = won(result.semesterVoucher);
    $('[data-acc-result="remainingVoucher"]').textContent = won(result.remainingVoucher);
    $('[data-acc-result="semesterNetCost"]').textContent = won(result.semesterNetCost);
    $('[data-acc-result="monthlyNetCost"]').textContent = `월평균 ${won(result.monthlyNetCost)}`;
    $('[data-acc-result="academyShare"]').textContent = `전체 월 비용의 ${result.academyShare.toFixed(1)}%`;
    $('[data-acc-result="voucherSavingRate"]').textContent = `절감률 ${result.voucherSavingRate.toFixed(1)}%`;
    $('[data-acc-result="semesterProgramCost"]').textContent = won(result.semesterProgramCost);
    $('[data-acc-result="semesterSchoolCost"]').textContent = won(result.semesterSchoolCost);
    $('[data-acc-result="semesterAcademyCost"]').textContent = won(result.semesterAcademyCost);
    $('[data-acc-result="schoolShare"]').textContent = `월 총비용의 ${result.schoolShare.toFixed(1)}%`;
    $('[data-acc-result="insight"]').textContent = result.insight;
    writeParams({
      g: state.grade,
      pc: state.programCount,
      pf: state.programMonthlyFee,
      cf: state.careMonthlyFee,
      sf: state.snackMonthlyFee,
      mf: state.materialMonthlyFee,
      af: state.academyMonthlyFee,
      sm: state.semesterMonths,
      va: state.voucherAmount,
    });
  }

  root.querySelectorAll("[data-acc-input]").forEach((el) => el.addEventListener("input", render));
  root.querySelectorAll("[data-acc-input]").forEach((el) => el.addEventListener("change", render));
  root.querySelectorAll("[data-acc-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      const preset = cfg.presets.find((item) => item.id === button.dataset.accPreset);
      if (!preset) return;
      root.querySelectorAll("[data-acc-preset]").forEach((el) => el.classList.toggle("is-active", el === button));
      setInput(preset.input);
      render();
    });
  });
  root.querySelectorAll("[data-acc-voucher]").forEach((button) => {
    button.addEventListener("click", () => {
      const voucherAmount = num(button.dataset.accVoucher, cfg.defaultInput.voucherAmount);
      setInput({ voucherAmount });
      root.querySelectorAll("[data-acc-voucher]").forEach((el) => el.classList.toggle("is-active", el === button));
      render();
    });
  });

  document.getElementById("accResetBtn")?.addEventListener("click", () => { window.location.href = window.location.pathname; });
  document.getElementById("accCopyBtn")?.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(window.location.href); } catch {}
  });

  function restoreFromUrl() {
    const grade = readParam("g", "");
    if (!grade) return;
    setInput({
      grade,
      programCount: num(readParam("pc", ""), cfg.defaultInput.programCount),
      programMonthlyFee: num(readParam("pf", ""), cfg.defaultInput.programMonthlyFee),
      careMonthlyFee: num(readParam("cf", ""), cfg.defaultInput.careMonthlyFee),
      snackMonthlyFee: num(readParam("sf", ""), cfg.defaultInput.snackMonthlyFee),
      materialMonthlyFee: num(readParam("mf", ""), cfg.defaultInput.materialMonthlyFee),
      academyMonthlyFee: num(readParam("af", ""), cfg.defaultInput.academyMonthlyFee),
      semesterMonths: num(readParam("sm", ""), cfg.defaultInput.semesterMonths),
      voucherAmount: num(readParam("va", ""), cfg.defaultInput.voucherAmount),
    });
  }

  restoreFromUrl();
  render();
})();
