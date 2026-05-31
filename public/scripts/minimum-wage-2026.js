(function () {
  const root = document.querySelector(".mwc-page");
  const configNode = document.getElementById("mwcConfig");
  if (!root || !configNode) return;

  const config = JSON.parse(configNode.textContent || "{}");
  const minimumWage = Number(config.minimumWage) || 10320;
  const monthlyWeeks = Number(config.monthlyWeeks) || 365 / 7 / 12;
  const weeklyHolidayMinHours = Number(config.weeklyHolidayMinHours) || 15;
  const nontaxMeal = Number(config.nontaxMeal) || 200000;
  const insurance = config.insuranceRates || {};
  const taxBrackets = config.incomeTaxBrackets || [];
  const presets = config.presets || [];
  const formatter = new Intl.NumberFormat("ko-KR");

  const q = (selector) => root.querySelector(selector);
  const qa = (selector) => Array.from(root.querySelectorAll(selector));
  const parseNum = (value) => Number(String(value ?? "").replace(/[^\d.]/g, "")) || 0;
  const fmt = (value) => `${formatter.format(Math.round(value || 0))}원`;
  const setText = (selector, value) => {
    qa(selector).forEach((element) => {
      element.textContent = value;
    });
  };

  function toggleField(selector, visible) {
    const element = q(selector);
    if (element) element.hidden = !visible;
  }

  function readState() {
    const hourlyMode = q("[data-mwc-hourly-mode]")?.value || "auto";
    const manualWage = parseNum(q("[data-mwc-hourly-wage]")?.value);
    const isManual = hourlyMode === "manual";
    const isTrainee = Boolean(q("[data-mwc-trainee]")?.checked);
    const weeklyHours = Math.max(0, Math.min(40, parseNum(q("[data-mwc-weekly-hours]")?.value) || 40));
    const dailyHours = Math.max(0, parseNum(q("[data-mwc-daily-hours]")?.value) || 8);
    const weeklyDays = Math.max(1, Math.min(7, parseNum(q("[data-mwc-weekly-days]")?.value) || 5));
    const includeHoliday = Boolean(q("[data-mwc-include-holiday]")?.checked);
    const deductionMode = q("[data-mwc-deduction-mode]")?.value || "estimated";
    const customRate = parseNum(q("[data-mwc-custom-rate]")?.value) / 100;
    const baseHourlyWage = isManual ? manualWage : minimumWage;
    const hourlyWage = isManual && isTrainee ? baseHourlyWage * 0.9 : baseHourlyWage;

    return {
      hourlyMode,
      hourlyWage,
      baseHourlyWage,
      weeklyHours,
      dailyHours,
      weeklyDays,
      includeHoliday,
      deductionMode,
      customRate,
      isTrainee,
      isManual,
    };
  }

  function calculate(state) {
    const isHolidayEligible = state.weeklyHours >= weeklyHolidayMinHours;
    const weeklyHolidayHours = isHolidayEligible ? Math.min(state.weeklyHours / 40, 1) * 8 : 0;
    const weeklyHolidayPayWeek = weeklyHolidayHours * state.hourlyWage;
    const monthlyScheduledHours = state.weeklyHours * monthlyWeeks;
    const monthlyHolidayHours = weeklyHolidayHours * monthlyWeeks;
    const monthlyGrossBase = monthlyScheduledHours * state.hourlyWage;
    const monthlyHolidayPay = monthlyHolidayHours * state.hourlyWage;
    const monthlyGross = monthlyGrossBase + (state.includeHoliday ? monthlyHolidayPay : 0);
    const dailyGross = state.dailyHours * state.hourlyWage;
    const weeklyGross = state.weeklyHours * state.hourlyWage + (state.includeHoliday ? weeklyHolidayPayWeek : 0);
    const annualGross = monthlyGross * 12;
    const effectiveHourly = state.weeklyHours > 0 ? weeklyGross / state.weeklyHours : state.hourlyWage;

    const nationalPension = monthlyGross * Number(insurance.nationalPension || 0);
    const healthInsurance = monthlyGross * Number(insurance.healthInsurance || 0);
    const longTermCare = healthInsurance * Number(insurance.longTermCareRatio || 0);
    const employmentInsurance = monthlyGross * Number(insurance.employmentInsurance || 0);
    const totalInsurance = nationalPension + healthInsurance + longTermCare + employmentInsurance;

    const taxableIncome = Math.max(0, monthlyGross - nontaxMeal);
    const bracket = taxBrackets.find((item) => taxableIncome >= item.minIncome && taxableIncome < item.maxIncome);
    const incomeTax = bracket ? Number(bracket.monthlyTax || 0) : 0;
    const localTax = Math.round(incomeTax * 0.1);

    let totalDeduction = totalInsurance + incomeTax + localTax;
    if (state.deductionMode === "none") {
      totalDeduction = 0;
    } else if (state.deductionMode === "custom") {
      totalDeduction = monthlyGross * state.customRate;
    }

    const monthlyNet = Math.max(0, monthlyGross - totalDeduction);
    const annualNet = monthlyNet * 12;
    const isCompliant = state.hourlyWage >= minimumWage;
    const deficit = Math.max(0, minimumWage - state.hourlyWage);
    const monthlyDeficit = deficit * (monthlyScheduledHours + (state.includeHoliday ? monthlyHolidayHours : 0));

    return {
      isHolidayEligible,
      weeklyHolidayPayWeek,
      monthlyHolidayPay,
      effectiveHourly,
      dailyGross,
      weeklyGross,
      monthlyGross,
      annualGross,
      nationalPension,
      healthInsurance,
      longTermCare,
      employmentInsurance,
      incomeTax,
      localTax,
      totalDeduction,
      monthlyNet,
      annualNet,
      isCompliant,
      monthlyDeficit,
    };
  }

  function render(state, result) {
    setText("[data-mwc-monthly-net]", fmt(result.monthlyNet));
    setText("[data-mwc-monthly-gross]", fmt(result.monthlyGross));
    setText("[data-mwc-effective-hourly]", fmt(result.effectiveHourly));
    setText("[data-mwc-daily-gross]", fmt(result.dailyGross));
    setText("[data-mwc-weekly-gross]", fmt(result.weeklyGross));
    setText("[data-mwc-annual-gross]", fmt(result.annualGross));
    setText("[data-mwc-annual-net]", fmt(result.annualNet));
    setText("[data-mwc-holiday-week]", fmt(result.weeklyHolidayPayWeek));
    setText("[data-mwc-holiday-month]", fmt(result.monthlyHolidayPay));
    setText("[data-mwc-national-pension]", fmt(result.nationalPension));
    setText("[data-mwc-health-insurance]", fmt(result.healthInsurance));
    setText("[data-mwc-long-term-care]", fmt(result.longTermCare));
    setText("[data-mwc-employment-insurance]", fmt(result.employmentInsurance));
    setText("[data-mwc-income-tax]", fmt(result.incomeTax + result.localTax));
    setText("[data-mwc-total-deduction]", fmt(result.totalDeduction));
    setText("[data-mwc-deficit-amount]", fmt(result.monthlyDeficit));
    setText("[data-mwc-holiday-status]", result.isHolidayEligible ? "발생 가능" : "미발생");

    const badge = q("[data-mwc-compliance-badge]");
    if (badge) {
      badge.textContent = result.isCompliant ? "충족" : "미달";
      badge.className = result.isCompliant ? "mwc-badge mwc-badge--ok" : "mwc-badge mwc-badge--warn";
    }

    const holidayNote = q("[data-mwc-holiday-note]");
    if (holidayNote) {
      holidayNote.textContent = result.isHolidayEligible
        ? `주 ${state.weeklyHours}시간 기준 주휴수당 발생 가능`
        : "주 15시간 미만 - 주휴수당 미발생";
    }

    const deficitBanner = q("[data-mwc-deficit-banner]");
    if (deficitBanner) {
      deficitBanner.hidden = !(state.isManual && !result.isCompliant);
    }

    toggleField("[data-mwc-hourly-field]", state.isManual);
    toggleField("[data-mwc-trainee-field]", state.isManual);
    toggleField("[data-mwc-custom-rate-field]", state.deductionMode === "custom");
    toggleField("[data-mwc-compliance-section]", state.isManual);
  }

  function update() {
    const state = readState();
    const result = calculate(state);
    render(state, result);
  }

  function applyPreset(id) {
    const preset = presets.find((item) => item.id === id);
    if (!preset) return;

    const hourlyMode = q("[data-mwc-hourly-mode]");
    const hourlyWage = q("[data-mwc-hourly-wage]");
    const weeklyHours = q("[data-mwc-weekly-hours]");
    const dailyHours = q("[data-mwc-daily-hours]");
    const weeklyDays = q("[data-mwc-weekly-days]");
    const includeHoliday = q("[data-mwc-include-holiday]");

    if (hourlyMode) hourlyMode.value = preset.hourlyMode;
    if (hourlyWage) hourlyWage.value = preset.hourlyWage;
    if (weeklyHours) weeklyHours.value = preset.weeklyHours;
    if (dailyHours) dailyHours.value = preset.dailyHours;
    if (weeklyDays) weeklyDays.value = preset.weeklyDays;
    if (includeHoliday) includeHoliday.checked = Boolean(preset.includeWeeklyHoliday);

    qa("[data-mwc-preset]").forEach((button) => {
      button.classList.toggle("is-active", button.getAttribute("data-mwc-preset") === id);
    });

    update();
  }

  function reset() {
    applyPreset("fulltime");
    const deductionMode = q("[data-mwc-deduction-mode]");
    const customRate = q("[data-mwc-custom-rate]");
    const trainee = q("[data-mwc-trainee]");
    if (deductionMode) deductionMode.value = "estimated";
    if (customRate) customRate.value = "9.8";
    if (trainee) trainee.checked = false;
    update();
  }

  function copyLink() {
    const text = window.location.href;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  }

  root.addEventListener("input", update);
  root.addEventListener("change", update);
  qa("[data-mwc-preset]").forEach((button) => {
    button.addEventListener("click", () => applyPreset(button.getAttribute("data-mwc-preset")));
  });
  document.getElementById("mwcResetBtn")?.addEventListener("click", reset);
  document.getElementById("mwcCopyLinkBtn")?.addEventListener("click", copyLink);

  update();
})();
