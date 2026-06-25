(() => {
  const root = document.querySelector(".fcac-page");
  const dataEl = document.getElementById("fcac-data");
  if (!root || !dataEl) return;

  const cfg = JSON.parse(dataEl.textContent || "{}");
  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => Array.from(root.querySelectorAll(selector));

  const initialState = {
    region: "seoul",
    childBirthYear: 2025,
    childBirthMonth: 3,
    applyYear: 2027,
    applyMonth: 3,
    childCount: 1,
    householdSize: 3,
    healthInsuranceFee: 270000,
    careGapReason: "dual_income",
    monthlyCareHours: 40,
  };
  let state = { ...initialState };

  function num(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? Math.max(parsed, 0) : fallback;
  }

  function won(value) {
    return `${Math.round(value).toLocaleString("ko-KR")}원`;
  }

  function calcAgeMonths(s) {
    return (s.applyYear - s.childBirthYear) * 12 + (s.applyMonth - s.childBirthMonth);
  }

  function calculate(s) {
    const ageMonths = calcAgeMonths(s);
    const isAgeEligible = ageMonths >= cfg.minAgeMonths && ageMonths <= cfg.maxAgeMonths;
    const isCareGapEligible = s.careGapReason !== "none";
    const isCareHoursEligible = s.monthlyCareHours >= cfg.minCareHours;

    const householdKey = Math.min(Math.max(s.householdSize, 1), 6);
    const incomeEntry = cfg.incomeThreshold[householdKey] || cfg.incomeThreshold[6];
    const isIncomeEligible = s.healthInsuranceFee <= incomeEntry.value;

    const childCountKey = Math.min(Math.max(s.childCount, 1), 3);
    const monthlyAmount = cfg.monthlyAmountByChild[childCountKey] || 0;
    const maxMonths = cfg.maxMonthsByRegion[s.region] || 12;
    const maxTotalAmount = monthlyAmount * maxMonths;

    const coreEligible = isAgeEligible && isCareGapEligible && isCareHoursEligible && isIncomeEligible;
    const judgement = coreEligible ? "likely" : "partial";

    return {
      ageMonths,
      isAgeEligible,
      isCareGapEligible,
      isCareHoursEligible,
      isIncomeEligible,
      incomeEntry,
      monthlyAmount,
      maxMonths,
      maxTotalAmount,
      judgement,
    };
  }

  function judgementLabel(level) {
    if (level === "likely") return "가능성 높음 (지역 참여 여부는 별도 확인)";
    return "일부 조건 미충족";
  }

  function readState() {
    state.region = $('[data-fcac="region"]')?.value || "seoul";
    state.childBirthYear = num($('[data-fcac="childBirthYear"]')?.value, initialState.childBirthYear);
    state.childBirthMonth = num($('[data-fcac="childBirthMonth"]')?.value, initialState.childBirthMonth);
    state.applyYear = num($('[data-fcac="applyYear"]')?.value, initialState.applyYear);
    state.applyMonth = num($('[data-fcac="applyMonth"]')?.value, initialState.applyMonth);
    state.childCount = num($('[data-fcac="childCount"]')?.value, 1);
    state.householdSize = num($('[data-fcac="householdSize"]')?.value, 3);
    state.healthInsuranceFee = num($('[data-fcac="healthInsuranceFee"]')?.value);
    state.careGapReason = $('[data-fcac="careGapReason"]')?.value || "none";
    state.monthlyCareHours = num($('[data-fcac="monthlyCareHours"]')?.value);
  }

  function setControl(key, value) {
    const el = $(`[data-fcac="${key}"]`);
    if (!el) return;
    if (key === "healthInsuranceFee") el.value = Number(value || 0).toLocaleString("ko-KR");
    else el.value = String(value);
  }

  function render(result) {
    $('[data-fcac-result="judgement"]').textContent = judgementLabel(result.judgement);
    $('[data-fcac-result="ageCheck"]').textContent = result.isAgeEligible ? "충족" : "미충족";
    $('[data-fcac-result="incomeCheck"]').textContent = result.isIncomeEligible ? "충족" : "미충족";
    $('[data-fcac-result="incomeBadge"]').textContent = `(${result.incomeEntry.badge})`;
    $('[data-fcac-result="careHoursCheck"]').textContent = result.isCareHoursEligible ? "충족" : "미충족";
    $('[data-fcac-result="regionCheck"]').textContent = "확인 필요";
    $('[data-fcac-result="monthlyAmount"]').textContent = won(result.monthlyAmount);
    $('[data-fcac-result="maxTotal"]').textContent = `${won(result.maxTotalAmount)} (최대 ${result.maxMonths}개월)`;
  }

  function refresh() {
    readState();
    render(calculate(state));
  }

  $$("[data-fcac]").forEach((el) => {
    el.addEventListener("input", refresh);
    el.addEventListener("change", refresh);
  });

  $$("[data-fcac-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      const preset = cfg.presets.find((item) => item.id === button.dataset.fcacPreset);
      if (!preset) return;
      state = { ...initialState, ...preset.input };
      Object.entries(state).forEach(([key, value]) => setControl(key, value));
      refresh();
    });
  });

  $("#fcacResetBtn")?.addEventListener("click", () => {
    state = { ...initialState };
    Object.entries(state).forEach(([key, value]) => setControl(key, value));
    refresh();
  });

  $("#fcacCopyBtn")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      $("#fcacCopyBtn").textContent = "링크 복사 완료";
      setTimeout(() => { $("#fcacCopyBtn").textContent = "링크 복사"; }, 1600);
    } catch {
      $("#fcacCopyBtn").textContent = "복사 실패";
    }
  });

  refresh();
})();
