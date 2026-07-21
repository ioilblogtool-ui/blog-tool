(() => {
  const root = document.querySelector(".hbc-page");
  const dataEl = document.getElementById("hbc-data");
  if (!root || !dataEl) return;

  const DATA = JSON.parse(dataEl.textContent || "{}");
  const presets = DATA.presets || [];
  const defaultInput = DATA.defaultInput || {};
  let state = { ...defaultInput };

  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => Array.from(root.querySelectorAll(selector));

  const INSURANCE_CONFIG = {
    nationalPensionEmployeeRate: 4.75,
    nationalPensionMonthlyIncomeMin: 400_000,
    nationalPensionMonthlyIncomeMax: 6_370_000,
    healthInsuranceEmployeeRate: 3.595,
    longTermCareRateOnHealthInsurance: 13.14,
    employmentInsuranceEmployeeRate: 0.9,
  };

  const TAX_BRACKETS = [
    { minAnnualSalary: 0, maxAnnualSalary: 50_000_000, baseWithholdingRate: 8, conservativeRate: 10, label: "5천만 원 이하" },
    { minAnnualSalary: 50_000_000, maxAnnualSalary: 80_000_000, baseWithholdingRate: 12, conservativeRate: 15, label: "5천만~8천만 원" },
    { minAnnualSalary: 80_000_000, maxAnnualSalary: 120_000_000, baseWithholdingRate: 18, conservativeRate: 22, label: "8천만~1.2억 원" },
    { minAnnualSalary: 120_000_000, maxAnnualSalary: 200_000_000, baseWithholdingRate: 24, conservativeRate: 28, label: "1.2억~2억 원" },
    { minAnnualSalary: 200_000_000, maxAnnualSalary: null, baseWithholdingRate: 30, conservativeRate: 35, label: "2억 원 초과" },
  ];

  function num(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? Math.max(0, parsed) : fallback;
  }

  function won(value) {
    return `${Math.round(value || 0).toLocaleString("ko-KR")}원`;
  }

  function getTaxBracket(annualSalary) {
    return (
      TAX_BRACKETS.find((b) => annualSalary >= b.minAnnualSalary && (b.maxAnnualSalary === null || annualSalary < b.maxAnnualSalary)) ||
      TAX_BRACKETS[0]
    );
  }

  function calcPensionHealthImmediate(bonusGrossAmount) {
    const pensionBase = Math.min(
      Math.max(bonusGrossAmount, INSURANCE_CONFIG.nationalPensionMonthlyIncomeMin),
      INSURANCE_CONFIG.nationalPensionMonthlyIncomeMax
    );
    const nationalPension = (pensionBase * INSURANCE_CONFIG.nationalPensionEmployeeRate) / 100;
    const healthInsurance = (bonusGrossAmount * INSURANCE_CONFIG.healthInsuranceEmployeeRate) / 100;
    const longTermCareInsurance = (healthInsurance * INSURANCE_CONFIG.longTermCareRateOnHealthInsurance) / 100;
    return { nationalPension, healthInsurance, longTermCareInsurance };
  }

  function calculate() {
    const bracket = getTaxBracket(state.annualSalary);
    const incomeTaxRate = state.incomeTaxMode === "conservative" ? bracket.conservativeRate : bracket.baseWithholdingRate;
    const incomeTax = (state.bonusGrossAmount * incomeTaxRate) / 100;
    const localIncomeTax = state.includeLocalIncomeTax ? incomeTax * 0.1 : 0;
    const employmentInsurance = (state.bonusGrossAmount * INSURANCE_CONFIG.employmentInsuranceEmployeeRate) / 100;

    const immediate = calcPensionHealthImmediate(state.bonusGrossAmount);
    const active = state.pensionHealthReflection === "immediate"
      ? immediate
      : { nationalPension: 0, healthInsurance: 0, longTermCareInsurance: 0 };

    const totalDeduction = incomeTax + localIncomeTax + employmentInsurance + active.nationalPension + active.healthInsurance + active.longTermCareInsurance;
    const netAmount = Math.max(state.bonusGrossAmount - totalDeduction, 0);

    const scenarioTaxOnly = Math.max(state.bonusGrossAmount - incomeTax - localIncomeTax, 0);
    const scenarioTaxPlusEmployment = Math.max(scenarioTaxOnly - employmentInsurance, 0);
    const scenarioAllImmediate = Math.max(
      scenarioTaxPlusEmployment - immediate.nationalPension - immediate.healthInsurance - immediate.longTermCareInsurance,
      0
    );

    return {
      bracket,
      incomeTax,
      localIncomeTax,
      nationalPension: active.nationalPension,
      healthInsurance: active.healthInsurance,
      longTermCareInsurance: active.longTermCareInsurance,
      employmentInsurance,
      totalDeduction,
      netAmount,
      netRate: state.bonusGrossAmount > 0 ? (netAmount / state.bonusGrossAmount) * 100 : 0,
      scenarioTaxOnly,
      scenarioTaxPlusEmployment,
      scenarioAllImmediate,
    };
  }

  function setText(selector, value) {
    const el = $(selector);
    if (el) el.textContent = value;
  }

  function readInputs() {
    state.bonusGrossAmount = num($('[data-hbc-input="bonusGrossAmount"]')?.value, state.bonusGrossAmount);
    state.annualSalary = num($('[data-hbc-input="annualSalary"]')?.value, state.annualSalary);
    state.paymentMonth = num($('[data-hbc-input="paymentMonth"]')?.value, state.paymentMonth);
    state.includeLocalIncomeTax = Boolean($('[data-hbc-input="includeLocalIncomeTax"]')?.checked);
    state.pensionHealthReflection = $('[data-hbc-input="pensionHealthReflection"]')?.value || state.pensionHealthReflection;
  }

  function syncInputs() {
    const el = (name) => $(`[data-hbc-input="${name}"]`);
    if (el("bonusGrossAmount") && document.activeElement !== el("bonusGrossAmount")) {
      el("bonusGrossAmount").value = Math.round(state.bonusGrossAmount).toLocaleString("ko-KR");
    }
    if (el("annualSalary") && document.activeElement !== el("annualSalary")) {
      el("annualSalary").value = Math.round(state.annualSalary).toLocaleString("ko-KR");
    }
    if (el("paymentMonth")) el("paymentMonth").value = String(state.paymentMonth);
    if (el("includeLocalIncomeTax")) el("includeLocalIncomeTax").checked = state.includeLocalIncomeTax;
    if (el("pensionHealthReflection")) el("pensionHealthReflection").value = state.pensionHealthReflection;
  }

  function render() {
    readInputs();
    const result = calculate();

    setText('[data-hbc-result="bracketLabel"]', `연봉 기준 근사 세율(${result.bracket.label}) 적용`);
    setText('[data-hbc-result="netAmount"]', won(result.netAmount));
    setText('[data-hbc-result="netRate"]', `실수령률 ${result.netRate.toFixed(1)}%`);
    setText('[data-hbc-result="grossAmount"]', won(state.bonusGrossAmount));
    setText('[data-hbc-result="totalDeduction"]', won(result.totalDeduction));
    setText('[data-hbc-result="incomeTax"]', won(result.incomeTax));
    setText('[data-hbc-result="localIncomeTax"]', won(result.localIncomeTax));
    setText('[data-hbc-result="nationalPension"]', won(result.nationalPension));
    setText('[data-hbc-result="healthInsurance"]', won(result.healthInsurance));
    setText('[data-hbc-result="longTermCareInsurance"]', won(result.longTermCareInsurance));
    setText('[data-hbc-result="employmentInsurance"]', won(result.employmentInsurance));
    setText('[data-hbc-result="scenarioTaxOnly"]', won(result.scenarioTaxOnly));
    setText('[data-hbc-result="scenarioTaxPlusEmployment"]', won(result.scenarioTaxPlusEmployment));
    setText('[data-hbc-result="scenarioAllImmediate"]', won(result.scenarioAllImmediate));

    $$("[data-hbc-preset]").forEach((button) => {
      const preset = presets.find((item) => item.id === button.dataset.hbcPreset);
      const isActive = preset && preset.input.bonusGrossAmount === state.bonusGrossAmount && preset.input.annualSalary === state.annualSalary;
      button.classList.toggle("is-active", Boolean(isActive));
    });

    syncInputs();
    syncUrl();
  }

  function syncUrl() {
    const params = new URLSearchParams();
    params.set("bonus", String(Math.round(state.bonusGrossAmount)));
    params.set("salary", String(Math.round(state.annualSalary)));
    params.set("month", String(state.paymentMonth));
    params.set("insurance", state.pensionHealthReflection);
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  }

  function restoreFromUrl() {
    const params = new URLSearchParams(window.location.search);
    if (!params.size) return;
    state.bonusGrossAmount = num(params.get("bonus"), state.bonusGrossAmount);
    state.annualSalary = num(params.get("salary"), state.annualSalary);
    state.paymentMonth = num(params.get("month"), state.paymentMonth);
    if (params.get("insurance")) state.pensionHealthReflection = params.get("insurance");
    syncInputs();
  }

  function bindEvents() {
    $$("[data-hbc-input]").forEach((input) => {
      input.addEventListener("input", render);
      input.addEventListener("change", render);
      input.addEventListener("blur", () => {
        if (["bonusGrossAmount", "annualSalary"].includes(input.dataset.hbcInput)) {
          input.value = num(input.value).toLocaleString("ko-KR");
        }
        render();
      });
    });

    $$("[data-hbc-preset]").forEach((button) => {
      button.addEventListener("click", () => {
        const preset = presets.find((item) => item.id === button.dataset.hbcPreset);
        if (!preset) return;
        state = { ...defaultInput, ...preset.input };
        syncInputs();
        render();
      });
    });

    document.getElementById("hbcResetBtn")?.addEventListener("click", () => {
      state = { ...defaultInput };
      syncInputs();
      render();
    });

    document.getElementById("hbcCopyBtn")?.addEventListener("click", async () => {
      const btn = document.getElementById("hbcCopyBtn");
      try {
        await navigator.clipboard.writeText(window.location.href);
        if (btn) {
          const original = btn.textContent;
          btn.textContent = "링크 복사됨";
          setTimeout(() => {
            btn.textContent = original;
          }, 1600);
        }
      } catch {
        if (btn) btn.textContent = "복사 실패";
      }
    });
  }

  restoreFromUrl();
  bindEvents();
  render();
})();
