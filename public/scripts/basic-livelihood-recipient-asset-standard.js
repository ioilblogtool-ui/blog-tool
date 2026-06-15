(() => {
  const root = document.querySelector(".blas-page");
  const dataEl = document.getElementById("blas-data");
  if (!root || !dataEl) return;

  const cfg = JSON.parse(dataEl.textContent || "{}");
  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => Array.from(root.querySelectorAll(selector));
  const initialState = {
    householdSize: 4,
    region: "metro",
    housingType: "jeonse",
    housingAsset: 50000000,
    generalAsset: 0,
    financialAsset: 10000000,
    insuranceRefundAsset: 0,
    debt: 0,
    hasCar: false,
    carValue: 0,
    carType: "general",
    earnedIncome: 1200000,
    publicTransferIncome: 0,
    applyWorkDeduction: true,
  };
  let state = { ...initialState };
  const numberKeys = ["householdSize", "housingAsset", "generalAsset", "financialAsset", "insuranceRefundAsset", "debt", "carValue", "earnedIncome", "publicTransferIncome"];
  const boolKeys = ["hasCar", "applyWorkDeduction"];

  function num(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? Math.max(parsed, 0) : fallback;
  }

  function manwon(value) {
    return `${Math.round(value / 10000).toLocaleString("ko-KR")}만 원`;
  }

  function percent(value) {
    return `${Math.round(value * 100).toLocaleString("ko-KR")}%`;
  }

  function thresholdFor(size) {
    return cfg.thresholds.find((item) => item.householdSize === Number(size)) || cfg.thresholds[3] || cfg.thresholds[0];
  }

  function calcWorkDeduction(s) {
    if (!s.applyWorkDeduction) return 0;
    return Math.min(s.earnedIncome * cfg.workDeduction.basic, cfg.workDeduction.max);
  }

  function calculate(s) {
    const threshold = thresholdFor(s.householdSize);
    const basicAssetDeduction = cfg.assetDeductions[s.region] || 0;
    const financialTotal = s.financialAsset + s.insuranceRefundAsset;
    const totalAsset = s.housingAsset + s.generalAsset + financialTotal;
    const assetAfterDebt = Math.max(totalAsset - s.debt, 0);
    const assetAfterBasicDeduction = Math.max(assetAfterDebt - basicAssetDeduction, 0);
    const ratio = totalAsset > 0 ? assetAfterBasicDeduction / totalAsset : 0;
    const recognizedHousing = s.housingAsset * ratio;
    const recognizedGeneral = s.generalAsset * ratio;
    const recognizedFinancial = financialTotal * ratio;
    const housingMonthlyIncome = recognizedHousing * cfg.rates.housingAsset;
    const generalMonthlyIncome = recognizedGeneral * cfg.rates.generalAsset;
    const financialMonthlyIncome = recognizedFinancial * cfg.rates.financialAsset;
    const assetMonthlyIncome = housingMonthlyIncome + generalMonthlyIncome + financialMonthlyIncome;
    const incomeAfterDeduction = Math.max(s.earnedIncome + s.publicTransferIncome - calcWorkDeduction(s), 0);
    const incomeRecognized = incomeAfterDeduction + assetMonthlyIncome;
    const assetShare = incomeRecognized > 0 ? assetMonthlyIncome / incomeRecognized : 0;
    const assetRatio = threshold.livelihood > 0 ? assetMonthlyIncome / threshold.livelihood : 0;
    let risk = "낮음";
    let riskSummary = "재산 부담이 낮은 편입니다.";
    if (s.hasCar && s.carType === "general") {
      risk = "확인 필요";
      riskSummary = "일반 자동차는 실제 조사에서 중요하게 확인될 수 있습니다.";
    } else if (assetRatio > 0.25) {
      risk = "높음";
      riskSummary = "재산 때문에 기준을 초과할 가능성이 있습니다.";
    } else if (assetRatio > 0.1) {
      risk = "경계";
      riskSummary = "소득과 함께 보면 경계가 될 수 있습니다.";
    }
    const breakdown = [
      ["주거재산", s.housingAsset, recognizedHousing, housingMonthlyIncome, recognizedHousing > 0 ? "반영" : "기본재산액 내"],
      ["일반재산", s.generalAsset, recognizedGeneral, generalMonthlyIncome, recognizedGeneral > 0 ? "반영" : "영향 낮음"],
      ["금융재산", financialTotal, recognizedFinancial, financialMonthlyIncome, recognizedFinancial > 0 ? "반영" : "영향 낮음"],
      ["부채", s.debt, -s.debt, 0, s.debt > 0 ? "차감 확인" : "없음"],
      ["자동차", s.hasCar ? s.carValue : 0, 0, 0, s.hasCar ? "확인 필요" : "없음"],
    ];
    const warnings = [
      { title: "자가 점검용 추정", message: "실제 재산 반영 방식은 주민센터 조사와 공적자료 확인 결과에 따라 달라질 수 있습니다.", severity: "info" },
    ];
    if (s.hasCar) warnings.push({ title: "자동차 확인 필요", message: "차량 용도, 가액, 장애인용 또는 생업용 여부에 따라 판단이 달라질 수 있습니다.", severity: "warning" });
    if (recognizedFinancial > 0) warnings.push({ title: "금융재산 확인", message: "예금, 적금, 주식, 보험 해지환급금은 실제 조사에서 세부 확인이 필요할 수 있습니다.", severity: "info" });
    if (s.debt > 0) warnings.push({ title: "부채 인정 여부 확인", message: "모든 부채가 차감되는 것은 아니므로 인정 가능한 부채인지 확인해야 합니다.", severity: "info" });
    if (recognizedGeneral > 0) warnings.push({ title: "일반재산 영향", message: "토지나 비주거 부동산은 결과에 민감하게 반영될 수 있습니다.", severity: "warning" });
    return { threshold, basicAssetDeduction, totalAsset, assetAfterDebt, assetAfterBasicDeduction, assetMonthlyIncome, incomeAfterDeduction, incomeRecognized, assetShare, risk, riskSummary, breakdown, warnings };
  }

  function readState() {
    numberKeys.forEach((key) => {
      const el = $(`[data-blas="${key}"]`);
      if (el) state[key] = num(el.value, initialState[key] || 0);
    });
    state.region = $('[data-blas="region"]')?.value || "metro";
    state.housingType = $('[data-blas="housingType"]')?.value || "jeonse";
    state.carType = $('[data-blas="carType"]')?.value || "general";
    boolKeys.forEach((key) => {
      const el = $(`[data-blas="${key}"]`);
      if (el) state[key] = Boolean(el.checked);
    });
    state.householdSize = Math.min(Math.max(Number(state.householdSize) || 4, 1), 6);
  }

  function setControl(key, value) {
    const el = $(`[data-blas="${key}"]`);
    if (!el) return;
    if (el.type === "checkbox") el.checked = Boolean(value);
    else if (numberKeys.includes(key)) el.value = Number(value || 0).toLocaleString("ko-KR");
    else el.value = String(value);
  }

  function render(result) {
    $('[data-blas-result="risk"]').textContent = result.risk;
    $('[data-blas-result="riskSummary"]').textContent = result.riskSummary;
    $('[data-blas-result="assetAfterDeduction"]').textContent = manwon(result.assetAfterBasicDeduction);
    $('[data-blas-result="assetMonthlyIncome"]').textContent = manwon(result.assetMonthlyIncome);
    $('[data-blas-result="incomeRecognized"]').textContent = manwon(result.incomeRecognized);
    $('[data-blas-result="assetShare"]').textContent = `소득인정액 중 재산 비중 ${percent(result.assetShare)}`;
    $('[data-blas-summary]').textContent = `입력한 총재산은 ${manwon(result.totalAsset)}이고, 지역별 기본재산액과 부채를 차감한 뒤 월 ${manwon(result.assetMonthlyIncome)}이 재산의 소득환산액으로 추정됩니다. ${result.riskSummary} 이 결과는 자가 점검용 추정입니다.`;
    const fill = Math.min((result.assetAfterDebt / Math.max(result.basicAssetDeduction, 1)) * 100, 160);
    $('[data-blas-meter-fill]').style.width = `${Math.min(fill, 100)}%`;
    $('[data-blas-meter-copy]').textContent = result.assetAfterDebt <= result.basicAssetDeduction
      ? "입력한 재산은 지역별 기본재산액 범위 안에 있습니다."
      : `기본재산액을 ${manwon(result.assetAfterDebt - result.basicAssetDeduction)} 초과합니다.`;
    $('[data-blas-breakdown-body]').innerHTML = result.breakdown.map(([label, input, recognized, monthly, status]) => `
      <tr>
        <td><strong>${label}</strong></td>
        <td>${manwon(input)}</td>
        <td>${recognized < 0 ? `-${manwon(Math.abs(recognized))}` : manwon(recognized)}</td>
        <td>${manwon(monthly)}</td>
        <td><span>${status}</span></td>
      </tr>
    `).join("");
    $('[data-blas-warnings]').innerHTML = result.warnings.map((item) => `
      <article class="blas-warning blas-warning--${item.severity}">
        <strong>${item.title}</strong>
        <p>${item.message}</p>
      </article>
    `).join("");
  }

  function updateUrl() {
    const params = new URLSearchParams();
    params.set("hh", String(state.householdSize));
    params.set("rg", state.region);
    params.set("ha", String(Math.round(state.housingAsset)));
    params.set("ga", String(Math.round(state.generalAsset)));
    params.set("fa", String(Math.round(state.financialAsset)));
    if (state.insuranceRefundAsset) params.set("ia", String(Math.round(state.insuranceRefundAsset)));
    if (state.debt) params.set("debt", String(Math.round(state.debt)));
    if (state.hasCar) params.set("car", "yes");
    if (state.carValue) params.set("cv", String(Math.round(state.carValue)));
    history.replaceState({}, "", `${location.pathname}?${params.toString()}`);
  }

  function restoreFromUrl() {
    const params = new URLSearchParams(location.search);
    const map = { hh: "householdSize", rg: "region", ha: "housingAsset", ga: "generalAsset", fa: "financialAsset", ia: "insuranceRefundAsset", debt: "debt", cv: "carValue" };
    Object.entries(map).forEach(([param, key]) => {
      if (params.has(param)) state[key] = numberKeys.includes(key) ? num(params.get(param)) : params.get(param);
    });
    if (params.get("car") === "yes") state.hasCar = true;
    Object.entries(state).forEach(([key, value]) => setControl(key, value));
  }

  function refresh() {
    readState();
    const result = calculate(state);
    render(result);
    updateUrl();
  }

  $$("[data-blas]").forEach((el) => {
    el.addEventListener("input", refresh);
    el.addEventListener("change", refresh);
  });

  $$("[data-blas-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      const preset = cfg.presets.find((item) => item.id === button.dataset.blasPreset);
      if (!preset) return;
      state = { ...initialState, ...preset.input };
      Object.entries(state).forEach(([key, value]) => setControl(key, value));
      refresh();
    });
  });

  $("#blasResetBtn")?.addEventListener("click", () => {
    state = { ...initialState };
    Object.entries(state).forEach(([key, value]) => setControl(key, value));
    refresh();
  });

  $("#blasCopyBtn")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      $("#blasCopyBtn").textContent = "링크 복사 완료";
      setTimeout(() => { $("#blasCopyBtn").textContent = "링크 복사"; }, 1600);
    } catch {
      $("#blasCopyBtn").textContent = "복사 실패";
    }
  });

  restoreFromUrl();
  refresh();
})();
