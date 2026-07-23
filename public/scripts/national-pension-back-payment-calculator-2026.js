import { readParam, writeParams } from "./url-state.js";

(() => {
  const root = document.querySelector(".pension-backpay-page");
  const dataEl = document.getElementById("npb-data");
  if (!root || !dataEl) return;

  const cfg = JSON.parse(dataEl.textContent || "{}");
  const $ = (selector) => root.querySelector(selector);
  const CURRENT_YEAR = 2026;

  function num(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? Math.max(parsed, 0) : fallback;
  }

  function won(value) {
    return `${Math.round(value).toLocaleString("ko-KR")}원`;
  }

  function getPensionStartAge(birthYear) {
    if (birthYear <= 1952) return 60;
    if (birthYear <= 1956) return 61;
    if (birthYear <= 1960) return 62;
    if (birthYear <= 1964) return 63;
    if (birthYear <= 1968) return 64;
    return 65;
  }

  function calc(input) {
    const baseIncome = Math.min(Math.max(input.monthlyIncome, cfg.limits.minMonthlyIncome), cfg.limits.maxMonthlyIncome);
    const monthlyPremium = Math.round(baseIncome * cfg.limits.premiumRate);
    const totalBackPayment = monthlyPremium * input.missingMonths;
    const recognizedYears = input.missingMonths / 12;

    const currentAge = CURRENT_YEAR - input.birthYear;
    const pensionStartAge = getPensionStartAge(input.birthYear);

    const breakEvenMonths = input.expectedMonthlyPensionIncrease > 0
      ? Math.ceil(totalBackPayment / input.expectedMonthlyPensionIncrease)
      : 0;
    const breakEvenYears = breakEvenMonths / 12;
    const ageAtBreakEven = pensionStartAge + breakEvenYears;

    const principalPerMonth = input.installmentMonths > 0 ? totalBackPayment / input.installmentMonths : 0;
    const installmentMonthlyRate = input.installmentAnnualRate / 100 / 12;
    const installmentTotalInterest = input.installmentMonths > 0
      ? Math.round(principalPerMonth * installmentMonthlyRate * (input.installmentMonths * (input.installmentMonths + 1)) / 2)
      : 0;
    const installmentTotalWithInterest = totalBackPayment + installmentTotalInterest;
    const installmentMonthlyPayment = input.installmentMonths > 0
      ? Math.ceil(installmentTotalWithInterest / input.installmentMonths)
      : totalBackPayment;

    const totalEnrolledMonthsAfter = input.existingEnrolledMonths + input.missingMonths;
    const minEnrollmentMet = totalEnrolledMonthsAfter >= cfg.minEnrollmentMonths;
    const overLimitWarning = input.missingMonths > cfg.maxBackpayMonths;

    const yearsReceivingAtLifeExpectancy = Math.max(input.lifeExpectancy - pensionStartAge, 0);
    const totalPensionAtLifeExpectancy = Math.round(input.expectedMonthlyPensionIncrease * 12 * yearsReceivingAtLifeExpectancy);
    const netProfitAtLifeExpectancy = totalPensionAtLifeExpectancy - totalBackPayment;
    const simpleReturnRatePercent = totalBackPayment > 0 ? (netProfitAtLifeExpectancy / totalBackPayment) * 100 : 0;

    const deferralYears = Math.max(pensionStartAge - currentAge, 0);
    const discountRateDecimal = input.discountRate / 100;
    const annualPayment = input.expectedMonthlyPensionIncrease * 12;
    let presentValueOfPension = 0;
    if (yearsReceivingAtLifeExpectancy > 0) {
      if (discountRateDecimal > 0) {
        const annuityFactor = (1 - Math.pow(1 + discountRateDecimal, -yearsReceivingAtLifeExpectancy)) / discountRateDecimal;
        presentValueOfPension = (annualPayment * annuityFactor) / Math.pow(1 + discountRateDecimal, deferralYears);
      } else {
        presentValueOfPension = annualPayment * yearsReceivingAtLifeExpectancy;
      }
    }
    presentValueOfPension = Math.round(presentValueOfPension);
    const netProfitPresentValue = presentValueOfPension - totalBackPayment;

    return {
      monthlyPremium,
      totalBackPayment,
      recognizedYears,
      currentAge,
      pensionStartAge,
      breakEvenYears,
      ageAtBreakEven,
      installmentMonthlyPayment,
      installmentTotalInterest,
      installmentTotalWithInterest,
      totalEnrolledMonthsAfter,
      minEnrollmentMet,
      overLimitWarning,
      yearsReceivingAtLifeExpectancy,
      totalPensionAtLifeExpectancy,
      netProfitAtLifeExpectancy,
      simpleReturnRatePercent,
      presentValueOfPension,
      netProfitPresentValue,
    };
  }

  function readState() {
    return {
      monthlyIncome: num($('[data-npb-input="monthlyIncome"]')?.value, cfg.defaultInput.monthlyIncome),
      missingMonths: num($('[data-npb-input="missingMonths"]')?.value, cfg.defaultInput.missingMonths),
      birthYear: num($('[data-npb-input="birthYear"]')?.value, cfg.defaultInput.birthYear),
      existingEnrolledMonths: num($('[data-npb-input="existingEnrolledMonths"]')?.value, cfg.defaultInput.existingEnrolledMonths),
      expectedMonthlyPensionIncrease: num($('[data-npb-input="expectedMonthlyPensionIncrease"]')?.value, cfg.defaultInput.expectedMonthlyPensionIncrease),
      installmentMonths: num($('[data-npb-input="installmentMonths"]')?.value, cfg.defaultInput.installmentMonths),
      installmentAnnualRate: num($('[data-npb-input="installmentAnnualRate"]')?.value, cfg.defaultInput.installmentAnnualRate),
      lifeExpectancy: num($('[data-npb-input="lifeExpectancy"]')?.value, cfg.defaultInput.lifeExpectancy),
      discountRate: num($('[data-npb-input="discountRate"]')?.value, cfg.defaultInput.discountRate),
    };
  }

  function setInput(partial) {
    Object.entries(partial).forEach(([key, value]) => {
      const el = $(`[data-npb-input="${key}"]`);
      if (!el) return;
      el.value = typeof value === "number" && (key === "monthlyIncome" || key === "expectedMonthlyPensionIncrease")
        ? value.toLocaleString("ko-KR")
        : value;
    });
  }

  function render() {
    const state = readState();
    const result = calc(state);
    $('[data-npb-result="monthlyPremium"]').textContent = won(result.monthlyPremium);
    $('[data-npb-result="totalBackPayment"]').textContent = won(result.totalBackPayment);
    $('[data-npb-result="totalBackPaymentAlt"]').textContent = won(result.totalBackPayment);
    $('[data-npb-result="recognizedYears"]').textContent = `${result.recognizedYears.toFixed(1)}년`;
    $('[data-npb-result="breakEven"]').textContent = result.breakEvenYears > 0 ? `${result.breakEvenYears.toFixed(1)}년` : "계산 불가";
    $('[data-npb-result="ageAtBreakEven"]').textContent = result.breakEvenYears > 0 ? `연금 개시 후 약 ${result.ageAtBreakEven.toFixed(1)}세` : "예상 증가액을 입력하세요";

    $('[data-npb-result="currentAge"]').textContent = `${result.currentAge}세`;
    $('[data-npb-result="pensionStartAge"]').textContent = `${result.pensionStartAge}세`;
    $('[data-npb-result="totalEnrolledMonthsAfter"]').textContent = `${result.totalEnrolledMonthsAfter}개월`;
    const badge = $('[data-npb-result="minEnrollmentBadge"]');
    if (badge) {
      badge.textContent = result.minEnrollmentMet
        ? `최소가입기간(${cfg.minEnrollmentMonths}개월) 충족`
        : `최소가입기간(${cfg.minEnrollmentMonths}개월) 미충족`;
      badge.classList.toggle("is-good", result.minEnrollmentMet);
      badge.classList.toggle("is-warn", !result.minEnrollmentMet);
    }
    const warning = $('[data-npb-result="overLimitWarning"]');
    if (warning) warning.hidden = !result.overLimitWarning;

    $('[data-npb-result="installmentPayment"]').textContent = won(result.installmentMonthlyPayment);
    const installmentTotalEl = $('[data-npb-result="installmentTotalWithInterest"]');
    if (installmentTotalEl) {
      installmentTotalEl.textContent = won(result.installmentTotalWithInterest);
      const small = installmentTotalEl.parentElement?.querySelector("small");
      if (small) small.textContent = `이자 약 ${won(result.installmentTotalInterest)}`;
    }

    $('[data-npb-result="yearsReceiving"]').textContent = `${result.yearsReceivingAtLifeExpectancy.toFixed(1)}년`;
    $('[data-npb-result="totalPensionAtLifeExpectancy"]').textContent = won(result.totalPensionAtLifeExpectancy);
    $('[data-npb-result="netProfit"]').textContent = won(result.netProfitAtLifeExpectancy);
    $('[data-npb-result="simpleReturnRate"]').textContent = `단순수익률 약 ${result.simpleReturnRatePercent.toFixed(1)}%`;
    $('[data-npb-result="netProfitPv"]').textContent = won(result.netProfitPresentValue);

    const callout = $('[data-npb-result="summaryCallout"]');
    if (callout) {
      callout.innerHTML = `${result.pensionStartAge}세부터 연금을 받는다면 약 ${result.breakEvenYears > 0 ? result.ageAtBreakEven.toFixed(1) : "-"}세부터 납부 원금을 초과합니다. ${state.lifeExpectancy}세까지 수령할 경우 추가 연금 총액은 약 ${won(result.totalPensionAtLifeExpectancy)}이며, 추납 원금 대비 단순 차익은 약 ${won(result.netProfitAtLifeExpectancy)}입니다.<br />※ 물가연동, 세금 및 화폐의 시간가치는 반영하지 않은 단순 계산입니다.`;
    }

    writeParams({
      mi: state.monthlyIncome,
      mm: state.missingMonths,
      by: state.birthYear,
      em: state.existingEnrolledMonths,
      inc: state.expectedMonthlyPensionIncrease,
      im: state.installmentMonths,
      ir: state.installmentAnnualRate,
      le: state.lifeExpectancy,
      dr: state.discountRate,
    });
  }

  root.querySelectorAll("[data-npb-input]").forEach((el) => el.addEventListener("input", render));
  root.querySelectorAll("[data-npb-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      const preset = cfg.presets.find((item) => item.id === button.dataset.npbPreset);
      if (!preset) return;
      root.querySelectorAll("[data-npb-preset]").forEach((el) => el.classList.toggle("is-active", el === button));
      setInput(preset.input);
      render();
    });
  });

  document.getElementById("npbResetBtn")?.addEventListener("click", () => { window.location.href = window.location.pathname; });
  document.getElementById("npbCopyBtn")?.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(window.location.href); } catch {}
  });

  function restoreFromUrl() {
    const monthlyIncome = readParam("mi", "");
    if (!monthlyIncome) return;
    setInput({
      monthlyIncome: num(monthlyIncome, cfg.defaultInput.monthlyIncome),
      missingMonths: num(readParam("mm", ""), cfg.defaultInput.missingMonths),
      birthYear: num(readParam("by", ""), cfg.defaultInput.birthYear),
      existingEnrolledMonths: num(readParam("em", ""), cfg.defaultInput.existingEnrolledMonths),
      expectedMonthlyPensionIncrease: num(readParam("inc", ""), cfg.defaultInput.expectedMonthlyPensionIncrease),
      installmentMonths: num(readParam("im", ""), cfg.defaultInput.installmentMonths),
      installmentAnnualRate: num(readParam("ir", ""), cfg.defaultInput.installmentAnnualRate),
      lifeExpectancy: num(readParam("le", ""), cfg.defaultInput.lifeExpectancy),
      discountRate: num(readParam("dr", ""), cfg.defaultInput.discountRate),
    });
  }

  restoreFromUrl();
  render();
})();
