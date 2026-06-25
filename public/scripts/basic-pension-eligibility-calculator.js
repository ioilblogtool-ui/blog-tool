(() => {
  const root = document.querySelector(".bpec-page");
  const dataEl = document.getElementById("bpec-data");
  if (!root || !dataEl) return;

  const cfg = JSON.parse(dataEl.textContent || "{}");
  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => Array.from(root.querySelectorAll(selector));

  const initialState = {
    householdType: "single",
    region: "metro",
    earnedIncome: 0,
    publicPensionIncome: 300000,
    generalAsset: 150000000,
    financialAsset: 10000000,
    debt: 0,
    hasLuxuryAsset: false,
  };
  let state = { ...initialState };

  const numberKeys = ["earnedIncome", "publicPensionIncome", "generalAsset", "financialAsset", "debt"];
  const boolKeys = ["hasLuxuryAsset"];

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

  // 소득평가액 = 0.7 × (근로소득 - 116만원, 최소 0) + 기타소득(국민연금 등)
  function calcIncomeEvaluation(s) {
    const earnedAfterDeduction = Math.max(s.earnedIncome - cfg.workIncomeDeduction, 0);
    const earnedEvaluated = earnedAfterDeduction * cfg.workIncomeRate;
    return earnedEvaluated + s.publicPensionIncome;
  }

  // 재산의 소득환산액 = [{(일반재산 - 기본재산공제액) + (금융재산 - 2000만원) - 부채} × 4% ÷ 12]
  function calcAssetConversion(s) {
    const basicDeduction = cfg.basicAssetDeduction[s.region] || 0;
    const generalAfterDeduction = Math.max(s.generalAsset - basicDeduction, 0);
    const financialAfterDeduction = Math.max(s.financialAsset - cfg.financialAssetDeduction, 0);
    const netAsset = Math.max(generalAfterDeduction + financialAfterDeduction - s.debt, 0);
    const monthlyConverted = (netAsset * cfg.assetConversionRateAnnual) / 12;
    return { basicDeduction, generalAfterDeduction, financialAfterDeduction, netAsset, monthlyConverted };
  }

  function calculate(s) {
    const incomeEvaluation = calcIncomeEvaluation(s);
    const asset = calcAssetConversion(s);
    const incomeRecognized = incomeEvaluation + asset.monthlyConverted;
    const threshold = cfg.selectionThreshold[s.householdType];
    const gap = threshold - incomeRecognized;
    const ratio = incomeRecognized / threshold;

    let judgement = "기준 초과 (수급 어려움)";
    if (ratio <= 0.9) judgement = "수급 가능성 높음";
    else if (ratio <= 1.0) judgement = "경계 구간 (조사 결과에 따라 달라질 수 있음)";

    const maxBenefit = cfg.maxBenefit[s.householdType];
    const estimatedBenefit = incomeRecognized < threshold ? maxBenefit : 0;

    return { incomeEvaluation, asset, incomeRecognized, threshold, gap, ratio, judgement, estimatedBenefit };
  }

  function readState() {
    state.householdType = $('[data-bpec="householdType"]')?.value || "single";
    state.region = $('[data-bpec="region"]')?.value || "metro";
    numberKeys.forEach((key) => {
      const el = $(`[data-bpec="${key}"]`);
      if (el) state[key] = num(el.value, initialState[key] || 0);
    });
    boolKeys.forEach((key) => {
      const el = $(`[data-bpec="${key}"]`);
      if (el) state[key] = Boolean(el.checked);
    });
  }

  function setControl(key, value) {
    const el = $(`[data-bpec="${key}"]`);
    if (!el) return;
    if (el.type === "checkbox") el.checked = Boolean(value);
    else if (numberKeys.includes(key)) el.value = Number(value || 0).toLocaleString("ko-KR");
    else el.value = String(value);
  }

  function renderBreakdown(result) {
    const breakdown = $("[data-bpec-breakdown]");
    if (!breakdown) return;
    const items = [
      ["소득평가액", result.incomeEvaluation],
      ["재산 소득환산액", result.asset.monthlyConverted],
      ["기본재산공제 후 일반재산", result.asset.generalAfterDeduction],
      ["금융재산공제 후 금융재산", result.asset.financialAfterDeduction],
    ];
    const total = Math.max(result.incomeRecognized, 1);
    breakdown.innerHTML = items.map(([label, value]) => {
      const width = Math.min(Math.max((value / total) * 100, 0), 100);
      return `<article class="bpec-breakdown-row"><strong>${label}</strong><span><i style="width:${width}%"></i></span><em>${manwon(value)}</em></article>`;
    }).join("");
  }

  function renderWarnings() {
    const warnings = $("[data-bpec-warnings]");
    if (!warnings) return;
    const items = [
      { title: "자가 점검용 추정", message: "실제 수급 여부와 지급액은 복지로 모의계산 또는 주민센터 확인 결과에 따라 달라질 수 있습니다.", severity: "info" },
    ];
    if (state.hasLuxuryAsset) {
      items.push({ title: "고급자동차·회원권 확인 필요", message: "고급자동차·회원권은 별도로 월 100% 소득환산이 적용되어 이 결과보다 소득인정액이 높아질 수 있습니다. 주민센터에서 확인하세요.", severity: "warning" });
    }
    if (state.publicPensionIncome > 0) {
      items.push({ title: "국민연금 연계 감액 확인 필요", message: "국민연금 가입기간이 길거나 수령액이 기초연금액의 150%를 넘으면 기초연금이 추가로 감액될 수 있습니다.", severity: "warning" });
    }
    warnings.innerHTML = items.map((item) => (
      `<article class="bpec-warning bpec-warning--${item.severity}"><strong>${item.title}</strong><p>${item.message}</p></article>`
    )).join("");
  }

  function render(result) {
    $('[data-bpec-result="incomeRecognized"]').textContent = won(result.incomeRecognized);
    $('[data-bpec-result="threshold"]').textContent = won(result.threshold);
    $('[data-bpec-result="benefit"]').textContent = won(result.estimatedBenefit);
    $('[data-bpec-result="gap"]').textContent = result.gap >= 0 ? `${won(result.gap)} 낮음` : `${won(Math.abs(result.gap))} 초과`;
    $('[data-bpec-result="judgement"]').textContent = result.judgement;
    const fill = Math.min(Math.max(result.ratio * 100, 0), 100);
    $("[data-bpec-gauge-fill]").style.width = `${fill}%`;
    renderBreakdown(result);
    renderWarnings();
  }

  function updateUrl() {
    const params = new URLSearchParams();
    params.set("ht", state.householdType);
    params.set("rg", state.region);
    params.set("inc", String(Math.round(state.earnedIncome)));
    params.set("pub", String(Math.round(state.publicPensionIncome)));
    params.set("ga", String(Math.round(state.generalAsset)));
    params.set("fa", String(Math.round(state.financialAsset)));
    if (state.debt) params.set("debt", String(Math.round(state.debt)));
    if (state.hasLuxuryAsset) params.set("lux", "yes");
    history.replaceState({}, "", `${location.pathname}?${params.toString()}`);
  }

  function restoreFromUrl() {
    const params = new URLSearchParams(location.search);
    const map = { ht: "householdType", rg: "region", inc: "earnedIncome", pub: "publicPensionIncome", ga: "generalAsset", fa: "financialAsset", debt: "debt" };
    Object.entries(map).forEach(([param, key]) => {
      if (params.has(param)) state[key] = numberKeys.includes(key) ? num(params.get(param)) : params.get(param);
    });
    if (params.get("lux") === "yes") state.hasLuxuryAsset = true;
    Object.entries(state).forEach(([key, value]) => setControl(key, value));
  }

  function refresh() {
    readState();
    const result = calculate(state);
    render(result);
    updateUrl();
  }

  $$("[data-bpec]").forEach((el) => {
    el.addEventListener("input", refresh);
    el.addEventListener("change", refresh);
  });

  $$("[data-bpec-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      const preset = cfg.presets.find((item) => item.id === button.dataset.bpecPreset);
      if (!preset) return;
      state = { ...initialState, ...preset.input };
      Object.entries(state).forEach(([key, value]) => setControl(key, value));
      refresh();
    });
  });

  $("#bpecResetBtn")?.addEventListener("click", () => {
    state = { ...initialState };
    Object.entries(state).forEach(([key, value]) => setControl(key, value));
    refresh();
  });

  $("#bpecCopyBtn")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      $("#bpecCopyBtn").textContent = "링크 복사 완료";
      setTimeout(() => { $("#bpecCopyBtn").textContent = "링크 복사"; }, 1600);
    } catch {
      $("#bpecCopyBtn").textContent = "복사 실패";
    }
  });

  restoreFromUrl();
  refresh();
})();
