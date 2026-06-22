(() => {
  const root = document.querySelector(".cic-page");
  const dataEl = document.getElementById("cic-data");
  if (!root || !dataEl) return;

  const cfg = JSON.parse(dataEl.textContent || "{}");
  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => Array.from(root.querySelectorAll(selector));

  const initialState = {
    totalIncome: 30000000,
    childCount: 1,
    applicationTiming: "regular",
    housing: 0,
    deposit: 50000000,
    savings: 5000000,
    securities: 0,
    vehicle: 0,
    other: 0,
  };
  let state = { ...initialState };

  const numberKeys = ["totalIncome", "childCount", "housing", "deposit", "savings", "securities", "vehicle", "other"];

  function num(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? Math.max(parsed, 0) : fallback;
  }

  function manwon(value) {
    return `${Math.round(value / 10000).toLocaleString("ko-KR")}만 원`;
  }

  function sumAssets(s) {
    return s.housing + s.deposit + s.savings + s.securities + s.vehicle + s.other;
  }

  function evaluateAssetTier(totalAsset) {
    if (totalAsset >= cfg.assetThresholds.eligibilityLimit) {
      return { tier: "over-240m", reductionRate: 0 };
    }
    if (totalAsset >= cfg.assetThresholds.reductionStart) {
      return { tier: "170m-240m", reductionRate: 0.5 };
    }
    return { tier: "under-170m", reductionRate: 0 };
  }

  function calculatePerChildAmount(totalIncome) {
    const rule = cfg.rule;
    if (totalIncome >= rule.incomeLimit) return 0;
    if (totalIncome <= rule.fullAmountIncomeCeiling) return rule.maxPerChild;
    const decreased =
      rule.maxPerChild - ((totalIncome - rule.fullAmountIncomeCeiling) * rule.decreaseNumerator) / rule.decreaseDenominator;
    return Math.min(Math.max(decreased, rule.minPerChild), rule.maxPerChild);
  }

  function calculate(s) {
    const childCount = Math.max(Math.round(s.childCount) || 0, 0);
    const incomeEligible = s.totalIncome < cfg.rule.incomeLimit;
    const perChildAmount = incomeEligible ? calculatePerChildAmount(s.totalIncome) : 0;
    const baseAmount = perChildAmount * childCount;

    const totalAsset = sumAssets(s);
    const assetResult = evaluateAssetTier(totalAsset);
    const assetIneligible = assetResult.tier === "over-240m";

    const afterAssetAmount = baseAmount * (1 - assetResult.reductionRate);
    const timingReductionRate = cfg.timingReduction[s.applicationTiming] || 0;
    const rawFinalAmount = afterAssetAmount * (1 - timingReductionRate);
    const finalAmount = !incomeEligible || assetIneligible ? 0 : rawFinalAmount;

    const reductions = [];
    if (assetResult.reductionRate > 0) reductions.push("재산 50%");
    if (timingReductionRate > 0) reductions.push("기한후신청 5%");
    const reductionSummary = reductions.length > 0 ? reductions.join(" + ") : "없음";

    let summary = `부부합산 총소득 ${manwon(s.totalIncome)} 기준으로 자녀 1인당 산정액은 ${manwon(perChildAmount)}이며, 자녀 ${childCount}명 기준 기본 산정액은 ${manwon(baseAmount)}입니다.`;
    if (!incomeEligible) {
      summary = `부부합산 총소득 ${manwon(s.totalIncome)}은 자녀장려금 소득 기준(${manwon(cfg.rule.incomeLimit)} 미만)을 초과해 신청이 어려울 것으로 예상됩니다.`;
    } else if (assetIneligible) {
      summary = `재산 합계 ${manwon(totalAsset)}은 2.4억 원 이상으로 신청이 어려울 것으로 예상됩니다.`;
    } else {
      if (assetResult.reductionRate > 0) summary += " 재산 합계가 1.7억~2.4억 구간에 해당해 50% 감액이 적용됐습니다.";
      if (timingReductionRate > 0) summary += " 기한 후 신청으로 5% 추가 감액이 적용됐습니다.";
      summary += ` 최종 예상 지급액은 ${manwon(finalAmount)}입니다.`;
    }

    return {
      childCount,
      incomeEligible,
      perChildAmount,
      baseAmount,
      totalAsset,
      assetResult,
      assetIneligible,
      timingReductionRate,
      finalAmount,
      reductionSummary,
      summary,
    };
  }

  function renderComparisonTable(result) {
    const body = $("[data-cic-comparison-body]");
    if (!body) return;
    const rows = [1, 2, 3].map((count) => {
      const amount = result.incomeEligible && !result.assetIneligible
        ? result.perChildAmount * count * (1 - result.assetResult.reductionRate) * (1 - result.timingReductionRate)
        : 0;
      const isActive = count === result.childCount;
      return `<tr class="${isActive ? "is-active" : ""}"><td>${count}명${isActive ? " (입력값)" : ""}</td><td>${manwon(amount)}</td></tr>`;
    });
    body.innerHTML = rows.join("");
  }

  function readState() {
    numberKeys.forEach((key) => {
      const el = $(`[data-cic="${key}"]`);
      if (el) state[key] = num(el.value, initialState[key] || 0);
    });
    state.applicationTiming = $('[data-cic="applicationTiming"]')?.value || "regular";
  }

  function setControl(key, value) {
    const el = $(`[data-cic="${key}"]`);
    if (!el) return;
    if (numberKeys.includes(key)) el.value = Number(value || 0).toLocaleString("ko-KR");
    else el.value = String(value);
  }

  function render(result) {
    $('[data-cic-result="finalAmount"]').textContent = manwon(result.finalAmount);
    $('[data-cic-result="perChildAmount"]').textContent = manwon(result.perChildAmount);
    $('[data-cic-result="childCount"]').textContent = `${result.childCount}명`;
    $('[data-cic-result="reductionSummary"]').textContent = result.reductionSummary;
    $("[data-cic-summary]").textContent = `${result.summary} 이 결과는 모의계산입니다.`;

    const assetText =
      result.assetResult.reductionRate > 0
        ? `재산 합계 ${manwon(result.totalAsset)}은 1.7억~2.4억 구간에 해당해 산정액의 50%만 지급됩니다.`
        : result.assetIneligible
          ? `재산 합계 ${manwon(result.totalAsset)}은 2.4억 원 이상으로 신청이 어려울 것으로 예상됩니다.`
          : `재산 합계 ${manwon(result.totalAsset)}은 감액 기준(1.7억 원) 미만이라 재산으로 인한 감액이 없습니다.`;
    $('[data-cic-reduction-text="asset"]').textContent = assetText;

    const timingText =
      result.timingReductionRate > 0
        ? "기한 후 신청(6/2~12/1)은 산정액의 95%만 지급되어 5% 감액이 적용됩니다."
        : "정기 신청(5/1~6/1)은 산정액 전액이 지급됩니다.";
    $('[data-cic-reduction-text="timing"]').textContent = timingText;

    renderComparisonTable(result);
  }

  function updateUrl() {
    const params = new URLSearchParams();
    params.set("inc", String(Math.round(state.totalIncome)));
    params.set("cc", String(Math.round(state.childCount)));
    params.set("at", state.applicationTiming);
    const totalAsset = sumAssets(state);
    if (totalAsset) params.set("asset", String(Math.round(totalAsset)));
    history.replaceState({}, "", `${location.pathname}?${params.toString()}`);
  }

  function restoreFromUrl() {
    const params = new URLSearchParams(location.search);
    if (params.has("inc")) state.totalIncome = num(params.get("inc"));
    if (params.has("cc")) state.childCount = num(params.get("cc"), 1);
    if (params.has("at")) state.applicationTiming = params.get("at");
    Object.entries(state).forEach(([key, value]) => setControl(key, value));
  }

  function refresh() {
    readState();
    const result = calculate(state);
    render(result);
    updateUrl();
  }

  $$("[data-cic]").forEach((el) => {
    el.addEventListener("input", refresh);
    el.addEventListener("change", refresh);
  });

  $$("[data-cic-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      const preset = cfg.presets.find((item) => item.id === button.dataset.cicPreset);
      if (!preset) return;
      state = { ...initialState, ...preset.input };
      Object.entries(state).forEach(([key, value]) => setControl(key, value));
      refresh();
    });
  });

  $("#cicResetBtn")?.addEventListener("click", () => {
    state = { ...initialState };
    Object.entries(state).forEach(([key, value]) => setControl(key, value));
    refresh();
  });

  $("#cicCopyBtn")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      $("#cicCopyBtn").textContent = "링크 복사 완료";
      setTimeout(() => {
        $("#cicCopyBtn").textContent = "링크 복사";
      }, 1600);
    } catch {
      $("#cicCopyBtn").textContent = "복사 실패";
    }
  });

  restoreFromUrl();
  refresh();
})();
