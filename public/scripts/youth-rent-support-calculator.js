(() => {
  const root = document.querySelector(".yrsc-page");
  const dataEl = document.getElementById("yrsc-data");
  if (!root || !dataEl) return;

  const cfg = JSON.parse(dataEl.textContent || "{}");
  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => Array.from(root.querySelectorAll(selector));

  const moneyKeys = ["monthlyIncome", "originMonthlyIncome", "youthAsset", "originAsset", "monthlyRent"];

  const initialState = {
    age: 26,
    isHomeless: true,
    livesSeparately: true,
    hasLeaseContract: true,
    monthlyIncome: 1300000,
    originHouseholdSize: 4,
    originMonthlyIncome: 4000000,
    youthAsset: 30000000,
    originAsset: 200000000,
    monthlyRent: 350000,
    excludedReason: "none",
  };
  let state = { ...initialState };

  function num(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? Math.max(parsed, 0) : fallback;
  }
  function won(value) {
    return `${Math.round(value).toLocaleString("ko-KR")}원`;
  }

  function calculate(s) {
    const isAgeEligible = s.age >= cfg.minAge && s.age <= cfg.maxAge;
    const isBasicEligible = s.isHomeless && s.livesSeparately && s.hasLeaseContract;

    const youthIncomeLimit = cfg.medianIncome1Person * cfg.youthIncomeRate;
    const originHouseholdSize = Math.min(Math.max(s.originHouseholdSize || 4, 1), 6);
    const originMedianIncome = cfg.originMedianIncomeBySize[originHouseholdSize] || cfg.originMedianIncomeBySize[4];
    const originIncomeLimit = originMedianIncome * cfg.originIncomeRate;
    const isYouthIncomeEligible = s.monthlyIncome <= youthIncomeLimit;
    const isOriginIncomeEligible = s.originMonthlyIncome <= originIncomeLimit;

    const isYouthAssetEligible = s.youthAsset <= cfg.youthAssetLimit;
    const isOriginAssetEligible = s.originAsset <= cfg.originAssetLimit;

    const isExcluded = s.excludedReason !== "none";

    const monthlyAmount = isExcluded ? 0 : Math.min(s.monthlyRent, cfg.monthlyCap);
    const maxTotalAmount = monthlyAmount * cfg.maxMonths;

    const coreEligible =
      isAgeEligible && isBasicEligible &&
      isYouthIncomeEligible && isOriginIncomeEligible &&
      isYouthAssetEligible && isOriginAssetEligible &&
      !isExcluded;

    return {
      isAgeEligible, isBasicEligible,
      isYouthIncomeEligible, isOriginIncomeEligible,
      isYouthAssetEligible, isOriginAssetEligible,
      isExcluded,
      monthlyAmount, maxTotalAmount,
      judgement: isExcluded ? "excluded" : coreEligible ? "likely" : "partial",
    };
  }

  function judgementLabel(level) {
    if (level === "excluded") return "제외 대상";
    if (level === "likely") return "가능성 높음";
    return "일부 조건 미충족";
  }

  function readState() {
    state.age = num($('[data-yrsc="age"]')?.value, initialState.age);
    state.isHomeless = $('[data-yrsc="isHomeless"]')?.checked ?? true;
    state.livesSeparately = $('[data-yrsc="livesSeparately"]')?.checked ?? true;
    state.hasLeaseContract = $('[data-yrsc="hasLeaseContract"]')?.checked ?? true;
    state.monthlyIncome = num($('[data-yrsc="monthlyIncome"]')?.value);
    state.originHouseholdSize = num($('[data-yrsc="originHouseholdSize"]')?.value, 4);
    state.originMonthlyIncome = num($('[data-yrsc="originMonthlyIncome"]')?.value);
    state.youthAsset = num($('[data-yrsc="youthAsset"]')?.value);
    state.originAsset = num($('[data-yrsc="originAsset"]')?.value);
    state.monthlyRent = num($('[data-yrsc="monthlyRent"]')?.value);
    state.excludedReason = $('[data-yrsc="excludedReason"]')?.value || "none";
  }

  function setControl(key, value) {
    const el = $(`[data-yrsc="${key}"]`);
    if (!el) return;
    if (el.type === "checkbox") el.checked = Boolean(value);
    else if (moneyKeys.includes(key)) el.value = Number(value || 0).toLocaleString("ko-KR");
    else el.value = String(value);
  }

  function render(result) {
    $('[data-yrsc-result="judgement"]').textContent = judgementLabel(result.judgement);
    $('[data-yrsc-result="ageCheck"]').textContent = result.isAgeEligible ? "충족" : "미충족";
    $('[data-yrsc-result="basicCheck"]').textContent = result.isBasicEligible ? "충족" : "미충족";
    $('[data-yrsc-result="youthIncomeCheck"]').textContent = result.isYouthIncomeEligible ? "충족" : "미충족";
    $('[data-yrsc-result="originIncomeCheck"]').textContent = result.isOriginIncomeEligible ? "충족" : "미충족";
    $('[data-yrsc-result="youthAssetCheck"]').textContent = result.isYouthAssetEligible ? "충족" : "미충족";
    $('[data-yrsc-result="originAssetCheck"]').textContent = result.isOriginAssetEligible ? "충족" : "미충족";
    $('[data-yrsc-result="excludedCheck"]').textContent = result.isExcluded ? "제외 사유 있음" : "해당 없음";
    $('[data-yrsc-result="monthlyAmount"]').textContent = won(result.monthlyAmount);
    $('[data-yrsc-result="maxTotal"]').textContent = won(result.maxTotalAmount);
  }

  function refresh() {
    readState();
    render(calculate(state));
  }

  $$("[data-yrsc]").forEach((el) => {
    el.addEventListener("input", refresh);
    el.addEventListener("change", refresh);
  });

  $$("[data-yrsc-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      const preset = cfg.presets.find((item) => item.id === button.dataset.yrscPreset);
      if (!preset) return;
      state = { ...initialState, ...preset.input };
      Object.entries(state).forEach(([key, value]) => setControl(key, value));
      refresh();
    });
  });

  $("#yrscResetBtn")?.addEventListener("click", () => {
    state = { ...initialState };
    Object.entries(state).forEach(([key, value]) => setControl(key, value));
    refresh();
  });

  $("#yrscCopyBtn")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      $("#yrscCopyBtn").textContent = "링크 복사 완료";
      setTimeout(() => { $("#yrscCopyBtn").textContent = "링크 복사"; }, 1600);
    } catch {
      $("#yrscCopyBtn").textContent = "복사 실패";
    }
  });

  refresh();
})();
