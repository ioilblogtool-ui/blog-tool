(() => {
  const root = document.querySelector(".wic-page");
  const dataEl = document.getElementById("wic-data");
  if (!root || !dataEl) return;

  const cfg = JSON.parse(dataEl.textContent || "{}");
  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => Array.from(root.querySelectorAll(selector));

  const initialState = {
    householdType: "single-earner",
    applicationTiming: "regular",
    applicantIncome: 18000000,
    spouseIncome: 0,
    housing: 0,
    deposit: 50000000,
    savings: 5000000,
    securities: 0,
    vehicle: 0,
    other: 0,
  };
  let state = { ...initialState };

  const numberKeys = [
    "applicantIncome",
    "spouseIncome",
    "housing",
    "deposit",
    "savings",
    "securities",
    "vehicle",
    "other",
  ];

  function num(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? Math.max(parsed, 0) : fallback;
  }

  function manwon(value) {
    return `${Math.round(value / 10000).toLocaleString("ko-KR")}만 원`;
  }

  function getBand(householdType) {
    return cfg.bands.find((band) => band.householdType === householdType) || cfg.bands[0];
  }

  function sumAssets(s) {
    return s.housing + s.deposit + s.savings + s.securities + s.vehicle + s.other;
  }

  function evaluateAssetTier(totalAsset) {
    if (totalAsset >= cfg.assetThresholds.eligibilityLimit) {
      return { tier: "over-240m", tierLabel: "신청 불가(2.4억 이상)", reductionRate: 0 };
    }
    if (totalAsset >= cfg.assetThresholds.reductionStart) {
      return { tier: "170m-240m", tierLabel: "50% 감액 구간(1.7억~2.4억)", reductionRate: 0.5 };
    }
    return { tier: "under-170m", tierLabel: "감액 없음(1.7억 미만)", reductionRate: 0 };
  }

  function calculateBaseAmount(totalIncome, band) {
    if (totalIncome >= band.incomeLimit) {
      return { baseAmount: 0, bandLabel: "소득 기준 초과" };
    }
    if (band.increasingEnd > 0 && totalIncome <= band.increasingEnd) {
      return { baseAmount: band.maxAmount * (totalIncome / band.increasingEnd), bandLabel: "점증구간" };
    }
    if (totalIncome <= band.flatEnd) {
      return { baseAmount: band.maxAmount, bandLabel: "평탄구간(최대 지급)" };
    }
    const ratio = (band.incomeLimit - totalIncome) / (band.incomeLimit - band.flatEnd);
    return { baseAmount: Math.max(band.maxAmount * ratio, 0), bandLabel: "점감구간" };
  }

  function calculate(s) {
    const band = getBand(s.householdType);
    const totalIncome = s.applicantIncome + s.spouseIncome;
    const incomeEligible = totalIncome < band.incomeLimit;
    const { baseAmount, bandLabel } = calculateBaseAmount(totalIncome, band);

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

    let summary = `입력한 조건 기준으로 총소득 ${manwon(totalIncome)}은 ${bandLabel}에 해당해 기본 산정액은 ${manwon(baseAmount)}입니다.`;
    if (!incomeEligible) {
      summary = `총소득 ${manwon(totalIncome)}은 ${cfg.labels.household[s.householdType]} 소득 기준(${manwon(band.incomeLimit)} 미만)을 초과해 신청이 어려울 것으로 예상됩니다.`;
    } else if (assetIneligible) {
      summary = `재산 합계 ${manwon(totalAsset)}은 2.4억 원 이상으로 신청이 어려울 것으로 예상됩니다.`;
    } else {
      if (assetResult.reductionRate > 0) {
        summary += ` 재산 합계 ${manwon(totalAsset)}은 1.7억~2.4억 구간에 해당해 50% 감액이 적용됐습니다.`;
      }
      if (timingReductionRate > 0) {
        summary += " 기한 후 신청으로 5% 추가 감액이 적용됐습니다.";
      }
      summary += ` 최종 예상 지급액은 ${manwon(finalAmount)}입니다.`;
    }

    return {
      band,
      bandLabel,
      totalIncome,
      incomeEligible,
      baseAmount,
      totalAsset,
      assetResult,
      assetIneligible,
      afterAssetAmount,
      timingReductionRate,
      finalAmount,
      reductionSummary,
      summary,
    };
  }

  function readState() {
    numberKeys.forEach((key) => {
      const el = $(`[data-wic="${key}"]`);
      if (el) state[key] = num(el.value, initialState[key] || 0);
    });
    state.householdType = $('[data-wic="householdType"]')?.value || "single-earner";
    state.applicationTiming = $('[data-wic="applicationTiming"]')?.value || "regular";
  }

  function setControl(key, value) {
    const el = $(`[data-wic="${key}"]`);
    if (!el) return;
    if (numberKeys.includes(key)) el.value = Number(value || 0).toLocaleString("ko-KR");
    else el.value = String(value);
  }

  function render(result) {
    $('[data-wic-result="finalAmount"]').textContent = manwon(result.finalAmount);
    $('[data-wic-result="baseAmount"]').textContent = manwon(result.baseAmount);
    $('[data-wic-result="bandLabel"]').textContent = result.incomeEligible ? result.bandLabel : "소득 기준 초과";
    $('[data-wic-result="reductionSummary"]').textContent = result.reductionSummary;
    $("[data-wic-summary]").textContent = `${result.summary} 이 결과는 모의계산입니다.`;

    const assetText =
      result.assetResult.reductionRate > 0
        ? `재산 합계 ${manwon(result.totalAsset)}은 1.7억~2.4억 구간에 해당해 산정액의 50%만 지급됩니다.`
        : result.assetIneligible
          ? `재산 합계 ${manwon(result.totalAsset)}은 2.4억 원 이상으로 신청이 어려울 것으로 예상됩니다.`
          : `재산 합계 ${manwon(result.totalAsset)}은 감액 기준(1.7억 원) 미만이라 재산으로 인한 감액이 없습니다.`;
    $('[data-wic-reduction-text="asset"]').textContent = assetText;

    const timingText =
      result.timingReductionRate > 0
        ? "기한 후 신청(6/2~12/1)은 산정액의 95%만 지급되어 5% 감액이 적용됩니다."
        : "정기 신청(5/1~6/1)은 산정액 전액이 지급됩니다.";
    $('[data-wic-reduction-text="timing"]').textContent = timingText;

    $$("[data-wic-band-row]").forEach((row) => {
      row.classList.toggle("is-active", row.getAttribute("data-wic-band-row") === state.householdType);
    });

    const descEl = $("[data-wic-household-desc]");
    if (descEl) {
      const desc = cfg.labels.household[state.householdType];
      descEl.textContent = desc ? `${desc} 기준` : "";
    }
  }

  function updateUrl() {
    const params = new URLSearchParams();
    params.set("ht", state.householdType);
    params.set("at", state.applicationTiming);
    params.set("inc", String(Math.round(state.applicantIncome)));
    if (state.spouseIncome) params.set("sinc", String(Math.round(state.spouseIncome)));
    const totalAsset = sumAssets(state);
    if (totalAsset) params.set("asset", String(Math.round(totalAsset)));
    history.replaceState({}, "", `${location.pathname}?${params.toString()}`);
  }

  function restoreFromUrl() {
    const params = new URLSearchParams(location.search);
    if (params.has("ht")) state.householdType = params.get("ht");
    if (params.has("at")) state.applicationTiming = params.get("at");
    if (params.has("inc")) state.applicantIncome = num(params.get("inc"));
    if (params.has("sinc")) state.spouseIncome = num(params.get("sinc"));
    Object.entries(state).forEach(([key, value]) => setControl(key, value));
  }

  function refresh() {
    readState();
    const result = calculate(state);
    render(result);
    updateUrl();
  }

  $$("[data-wic]").forEach((el) => {
    el.addEventListener("input", refresh);
    el.addEventListener("change", refresh);
  });

  $$("[data-wic-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      const preset = cfg.presets.find((item) => item.id === button.dataset.wicPreset);
      if (!preset) return;
      state = { ...initialState, ...preset.input };
      Object.entries(state).forEach(([key, value]) => setControl(key, value));
      refresh();
    });
  });

  $("#wicResetBtn")?.addEventListener("click", () => {
    state = { ...initialState };
    Object.entries(state).forEach(([key, value]) => setControl(key, value));
    refresh();
  });

  $("#wicCopyBtn")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      $("#wicCopyBtn").textContent = "링크 복사 완료";
      setTimeout(() => {
        $("#wicCopyBtn").textContent = "링크 복사";
      }, 1600);
    } catch {
      $("#wicCopyBtn").textContent = "복사 실패";
    }
  });

  restoreFromUrl();
  refresh();
})();
