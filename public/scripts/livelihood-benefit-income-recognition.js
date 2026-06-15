(() => {
  const root = document.querySelector(".lbirc-page");
  const dataEl = document.getElementById("lbirc-data");
  if (!root || !dataEl) return;

  const cfg = JSON.parse(dataEl.textContent || "{}");
  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => Array.from(root.querySelectorAll(selector));
  const initialState = {
    householdSize: 4,
    region: "metro",
    housingType: "rent",
    earnedIncome: 1500000,
    publicTransferIncome: 0,
    otherIncome: 0,
    applyWorkDeduction: true,
    housingAsset: 50000000,
    generalAsset: 0,
    financialAsset: 5000000,
    debt: 0,
    hasCar: false,
    carValue: 0,
    hasCrisisReason: false,
  };
  let state = { ...initialState };

  const numberKeys = ["householdSize", "earnedIncome", "publicTransferIncome", "otherIncome", "housingAsset", "generalAsset", "financialAsset", "debt", "carValue"];
  const boolKeys = ["applyWorkDeduction", "hasCar", "hasCrisisReason"];

  function num(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? Math.max(parsed, 0) : fallback;
  }

  function won(value) {
    return `${Math.round(value).toLocaleString("ko-KR")}원`;
  }

  function manwon(value) {
    return `${Math.round(value / 10000).toLocaleString("ko-KR")}만 원`;
  }

  function percent(value, digits = 1) {
    return `${(value * 100).toFixed(digits)}%`;
  }

  function thresholdFor(size) {
    return cfg.thresholds.find((item) => item.householdSize === Number(size)) || cfg.thresholds[3] || cfg.thresholds[0];
  }

  function calcWorkDeduction(s) {
    if (!s.applyWorkDeduction) return 0;
    return Math.min(s.earnedIncome * cfg.workDeduction.basic, cfg.workDeduction.max);
  }

  function calcAssetMonthlyIncome(s) {
    const totalAsset = s.housingAsset + s.generalAsset + s.financialAsset;
    const basicAssetDeduction = cfg.assetDeductions[s.region] || 0;
    const assetAfterDeduction = Math.max(totalAsset - s.debt - basicAssetDeduction, 0);
    const ratio = totalAsset > 0 ? assetAfterDeduction / totalAsset : 0;
    const housing = s.housingAsset * ratio * cfg.rates.housingAsset;
    const general = s.generalAsset * ratio * cfg.rates.generalAsset;
    const financial = s.financialAsset * ratio * cfg.rates.financialAsset;
    return {
      totalAsset,
      basicAssetDeduction,
      assetAfterDeduction,
      housingMonthlyIncome: housing,
      generalMonthlyIncome: general,
      financialMonthlyIncome: financial,
      assetMonthlyIncome: housing + general + financial,
    };
  }

  function calculate(s) {
    const threshold = thresholdFor(s.householdSize);
    const grossIncome = s.earnedIncome + s.publicTransferIncome + s.otherIncome;
    const workDeduction = calcWorkDeduction(s);
    const incomeAfterDeduction = Math.max(grossIncome - workDeduction, 0);
    const asset = calcAssetMonthlyIncome(s);
    const incomeRecognized = incomeAfterDeduction + asset.assetMonthlyIncome;
    const gap = threshold.livelihood - incomeRecognized;
    const ratio = incomeRecognized / threshold.livelihood;
    let judgement = "기준 초과";
    if (ratio <= 0.95) judgement = "가능성 있음";
    else if (ratio <= 1.05) judgement = "경계 구간";
    const warnings = [
      {
        title: "자가 점검용 추정",
        message: "실제 수급 여부와 지급액은 주민센터 조사와 공적자료 확인 결과에 따라 달라질 수 있습니다.",
        severity: "info",
      },
    ];
    if (s.hasCar || s.carValue > 0) {
      warnings.push({
        title: "자동차 확인 필요",
        message: "차량 용도와 가액은 실제 조사에서 다르게 반영될 수 있습니다.",
        severity: "warning",
      });
    }
    if (asset.assetMonthlyIncome > threshold.livelihood * 0.2) {
      warnings.push({
        title: "재산 환산 영향 큼",
        message: "재산의 월 소득환산액이 생계급여 기준에 의미 있게 반영됩니다. 재산 종류와 부채 인정 여부를 확인하세요.",
        severity: "warning",
      });
    }
    if (s.hasCrisisReason) {
      warnings.push({
        title: "긴급복지 함께 확인",
        message: "최근 실직, 질병, 폐업 등 위기 사유가 있다면 긴급복지 지원도 함께 확인해볼 수 있습니다.",
        severity: "info",
      });
    }
    return {
      threshold,
      grossIncome,
      workDeduction,
      incomeAfterDeduction,
      ...asset,
      incomeRecognized,
      gap,
      ratio,
      estimatedBenefit: Math.max(gap, 0),
      judgement,
      warnings,
    };
  }

  function readState() {
    numberKeys.forEach((key) => {
      const el = $(`[data-lbirc="${key}"]`);
      if (el) state[key] = num(el.value, initialState[key] || 0);
    });
    state.region = $('[data-lbirc="region"]')?.value || "metro";
    state.housingType = $('[data-lbirc="housingType"]')?.value || "rent";
    boolKeys.forEach((key) => {
      const el = $(`[data-lbirc="${key}"]`);
      if (el) state[key] = Boolean(el.checked);
    });
    state.householdSize = Math.min(Math.max(Number(state.householdSize) || 4, 1), 6);
  }

  function setControl(key, value) {
    const el = $(`[data-lbirc="${key}"]`);
    if (!el) return;
    if (el.type === "checkbox") el.checked = Boolean(value);
    else if (numberKeys.includes(key)) el.value = Number(value || 0).toLocaleString("ko-KR");
    else el.value = String(value);
  }

  function renderBreakdown(result) {
    const items = [
      ["소득평가액", result.incomeAfterDeduction],
      ["근로소득 공제", result.workDeduction],
      ["주거재산 환산", result.housingMonthlyIncome],
      ["일반재산 환산", result.generalMonthlyIncome],
      ["금융재산 환산", result.financialMonthlyIncome],
    ];
    const total = Math.max(result.incomeRecognized, 1);
    $('[data-lbirc-breakdown]').innerHTML = items.map(([label, value]) => {
      const width = Math.min(Math.max((value / total) * 100, 0), 100);
      return `<article class="lbirc-breakdown-row"><strong>${label}</strong><span><i style="width:${width}%"></i></span><em>${manwon(value)}</em></article>`;
    }).join("");
  }

  function renderWarnings(result) {
    $('[data-lbirc-warnings]').innerHTML = result.warnings.map((item) => (
      `<article class="lbirc-warning lbirc-warning--${item.severity}"><strong>${item.title}</strong><p>${item.message}</p></article>`
    )).join("");
  }

  function render(result) {
    $('[data-lbirc-result="incomeRecognized"]').textContent = manwon(result.incomeRecognized);
    $('[data-lbirc-result="threshold"]').textContent = manwon(result.threshold.livelihood);
    $('[data-lbirc-result="thresholdMeta"]').textContent = `${state.householdSize}인 가구 기준`;
    $('[data-lbirc-result="benefit"]').textContent = manwon(result.estimatedBenefit);
    $('[data-lbirc-result="gap"]').textContent = result.gap >= 0 ? `${manwon(result.gap)} 낮음` : `${manwon(Math.abs(result.gap))} 초과`;
    $('[data-lbirc-result="judgement"]').textContent = result.judgement;
    const summary = result.gap >= 0
      ? `입력값 기준 소득인정액은 월 약 ${manwon(result.incomeRecognized)}으로 추정됩니다. ${state.householdSize}인 가구 생계급여 선정기준보다 약 ${manwon(result.gap)} 낮아 생계급여 신청 가능성이 있는 구간입니다.`
      : `입력값 기준 소득인정액은 월 약 ${manwon(result.incomeRecognized)}으로 추정됩니다. ${state.householdSize}인 가구 생계급여 선정기준보다 약 ${manwon(Math.abs(result.gap))} 높아 기준을 초과한 것으로 보입니다.`;
    $('[data-lbirc-summary]').textContent = `${summary} 이 결과는 자가 점검용 추정입니다.`;
    const fill = Math.min(Math.max(result.ratio * 100, 0), 140);
    $('[data-lbirc-gauge-fill]').style.width = `${Math.min(fill, 100)}%`;
    renderBreakdown(result);
    renderWarnings(result);
  }

  function updateUrl() {
    const params = new URLSearchParams();
    params.set("hh", String(state.householdSize));
    params.set("rg", state.region);
    params.set("inc", String(Math.round(state.earnedIncome)));
    params.set("pub", String(Math.round(state.publicTransferIncome)));
    params.set("ha", String(Math.round(state.housingAsset)));
    params.set("fa", String(Math.round(state.financialAsset)));
    if (state.debt) params.set("debt", String(Math.round(state.debt)));
    if (state.hasCar || state.carValue) params.set("car", "yes");
    history.replaceState({}, "", `${location.pathname}?${params.toString()}`);
  }

  function restoreFromUrl() {
    const params = new URLSearchParams(location.search);
    const map = { hh: "householdSize", rg: "region", inc: "earnedIncome", pub: "publicTransferIncome", ha: "housingAsset", fa: "financialAsset", debt: "debt" };
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

  $$("[data-lbirc]").forEach((el) => {
    el.addEventListener("input", refresh);
    el.addEventListener("change", refresh);
  });

  $$("[data-lbirc-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      const preset = cfg.presets.find((item) => item.id === button.dataset.lbircPreset);
      if (!preset) return;
      state = { ...initialState, ...preset.input };
      Object.entries(state).forEach(([key, value]) => setControl(key, value));
      refresh();
    });
  });

  $("#lbircResetBtn")?.addEventListener("click", () => {
    state = { ...initialState };
    Object.entries(state).forEach(([key, value]) => setControl(key, value));
    refresh();
  });

  $("#lbircCopyBtn")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      $("#lbircCopyBtn").textContent = "링크 복사 완료";
      setTimeout(() => { $("#lbircCopyBtn").textContent = "링크 복사"; }, 1600);
    } catch {
      $("#lbircCopyBtn").textContent = "복사 실패";
    }
  });

  restoreFromUrl();
  refresh();
})();
