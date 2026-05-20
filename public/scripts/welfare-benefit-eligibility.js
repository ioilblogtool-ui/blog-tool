(() => {
  const root = document.querySelector(".wbe-page");
  const dataEl = document.getElementById("wbe-data");
  if (!root || !dataEl) return;

  const cfg = JSON.parse(dataEl.textContent || "{}");
  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => Array.from(root.querySelectorAll(selector));
  const types = ["livelihood", "medical", "housing", "education"];

  const initialState = {
    householdSize: 4,
    region: "metro",
    housingType: "rent",
    minorChildren: 2,
    isSingleParent: false,
    hasDisabilityOrElderly: false,
    earnedIncome: 2500000,
    businessIncome: 0,
    propertyIncome: 0,
    publicTransferIncome: 0,
    privateTransferIncome: 0,
    applyWorkDeduction: true,
    housingAsset: 0,
    generalAsset: 0,
    financialAsset: 5000000,
    debt: 0,
    carValue: 0,
    carType: "none",
    hasSupportObligor: false,
    obligorLevel: "unknown",
    hasCrisisReason: false,
  };

  let state = { ...initialState };
  let activePreset = "family-four";

  function num(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function won(value) {
    return `${Math.round(value).toLocaleString("ko-KR")}원`;
  }

  function manwon(value) {
    const rounded = Math.round(value / 10000);
    return `${rounded.toLocaleString("ko-KR")}만 원`;
  }

  function percent(value, digits = 1) {
    return `${(value * 100).toFixed(digits)}%`;
  }

  function judgementLabel(judgement) {
    return {
      likely: "가능성 높음",
      borderline: "경계",
      "needs-check": "확인 필요",
      unlikely: "어려움",
    }[judgement] || "확인 필요";
  }

  function thresholdFor(size) {
    return cfg.thresholds.find((item) => item.householdSize === size) || cfg.thresholds[3] || cfg.thresholds[0];
  }

  function calcWorkDeduction(s) {
    if (!s.applyWorkDeduction) return 0;
    const base = s.earnedIncome + s.businessIncome;
    return Math.min(base * cfg.workDeduction.basic, cfg.workDeduction.max);
  }

  function calcAssetMonthlyIncome(s) {
    const totalAsset = s.housingAsset + s.generalAsset + s.financialAsset;
    const basicAssetDeduction = cfg.assetDeductions[s.region] ?? 0;
    const assetBaseAfterDebt = Math.max(totalAsset - basicAssetDeduction - s.debt, 0);
    const ratio = totalAsset > 0 ? assetBaseAfterDebt / totalAsset : 0;
    const housingAssetMonthlyIncome = s.housingAsset * ratio * cfg.rates.housingAsset;
    const generalAssetMonthlyIncome = s.generalAsset * ratio * cfg.rates.generalAsset;
    const financialAssetMonthlyIncome = s.financialAsset * ratio * cfg.rates.financialAsset;

    return {
      totalAsset,
      basicAssetDeduction,
      assetBaseAfterDebt,
      housingAssetMonthlyIncome,
      generalAssetMonthlyIncome,
      financialAssetMonthlyIncome,
      assetMonthlyIncome: housingAssetMonthlyIncome + generalAssetMonthlyIncome + financialAssetMonthlyIncome,
    };
  }

  function judgeBenefit(type, benefitThreshold, incomeRecognized, s) {
    if (type === "medical" && (s.hasSupportObligor || s.obligorLevel === "high" || s.obligorLevel === "unknown")) {
      return "needs-check";
    }
    const ratio = incomeRecognized / benefitThreshold;
    if (ratio <= 0.95) return "likely";
    if (ratio <= 1.05) return "borderline";
    return "unlikely";
  }

  function buildWarnings(s, result) {
    const warnings = [
      {
        id: "estimate",
        title: "자가 점검용 추정",
        message: "이 계산기는 실제 제도를 단순화한 간이 계산입니다. 최종 수급 여부와 지급액은 신청 후 조사로 결정됩니다.",
        severity: "info",
      },
    ];

    if (s.carType === "general" && s.carValue > 0) {
      warnings.push({
        id: "auto",
        title: "자동차 확인 필요",
        message: s.carValue >= 10000000
          ? "일반 차량 가액이 높아 실제 조사 결과가 크게 달라질 수 있습니다."
          : "자동차는 용도와 가액에 따라 반영 방식이 달라질 수 있습니다.",
        severity: s.carValue >= 10000000 ? "danger" : "warning",
      });
    } else if ((s.carType === "business" || s.carType === "disabled") && s.carValue > 0) {
      warnings.push({
        id: "auto-purpose",
        title: "차량 특례 확인",
        message: "생업용·장애 관련 차량은 인정 조건이 따로 있으므로 상담 시 증빙을 준비하세요.",
        severity: "info",
      });
    }

    if (s.hasSupportObligor || s.obligorLevel === "high" || s.obligorLevel === "unknown") {
      warnings.push({
        id: "obligor",
        title: "부양의무자 확인 필요",
        message: "의료급여 등 일부 급여는 부양의무자 소득·재산 확인이 결과에 영향을 줄 수 있습니다.",
        severity: "warning",
      });
    }

    if (result.assetMonthlyIncome > result.incomeRecognized * 0.35 && result.assetMonthlyIncome > 0) {
      warnings.push({
        id: "asset",
        title: "재산 환산 영향 큼",
        message: "소득인정액에서 재산 소득환산액 비중이 큽니다. 전세보증금, 금융재산, 부채 인정 여부를 다시 확인하세요.",
        severity: "warning",
      });
    }

    return warnings;
  }

  function buildAlternatives(s, statuses, ratioToMedian) {
    const byType = Object.fromEntries(statuses.map((item) => [item.type, item]));
    const list = [];

    if (ratioToMedian <= 0.55) {
      list.push({
        id: "near-poor",
        label: "차상위계층",
        reason: "기준 중위소득 50% 안팎이면 차상위계층 혜택을 함께 확인할 수 있습니다.",
        priority: "high",
      });
    }
    if (s.isSingleParent && s.minorChildren > 0) {
      list.push({
        id: "single-parent",
        label: "한부모가족 지원",
        reason: "미성년 자녀가 있는 한부모 가구는 별도 소득 기준과 양육비 지원을 확인하세요.",
        priority: "high",
      });
    }
    if (s.hasCrisisReason) {
      list.push({
        id: "emergency",
        label: "긴급복지",
        reason: "실직, 질병, 폐업 등 갑작스러운 위기 사유가 있으면 긴급복지를 우선 확인하세요.",
        priority: "high",
      });
    }
    if (byType.housing && ["likely", "borderline"].includes(byType.housing.judgement) && byType.livelihood?.judgement === "unlikely") {
      list.push({
        id: "housing-only",
        label: "주거급여 단독 확인",
        reason: "생계급여가 어렵더라도 주거급여만 가능할 수 있습니다.",
        priority: "medium",
      });
    }
    if (s.minorChildren > 0 && byType.education && ["likely", "borderline"].includes(byType.education.judgement)) {
      list.push({
        id: "education",
        label: "교육급여",
        reason: "학생 자녀가 있다면 교육급여와 교육비 지원을 함께 확인하세요.",
        priority: "medium",
      });
    }
    if (statuses.some((item) => ["likely", "borderline"].includes(item.judgement)) || ratioToMedian <= 0.55) {
      list.push({
        id: "energy",
        label: "에너지·문화 바우처",
        reason: "기초생활보장 또는 차상위 후보라면 바우처성 지원도 확인 대상이 될 수 있습니다.",
        priority: "low",
      });
    }

    if (list.length === 0) {
      list.push({
        id: "consult",
        label: "주민센터 상담",
        reason: "입력값상 기준선과 거리가 있지만 가구 특성, 질병, 위기 사유가 있으면 별도 지원이 있을 수 있습니다.",
        priority: "low",
      });
    }
    return list;
  }

  function calculate(s) {
    const threshold = thresholdFor(s.householdSize);
    const actualMonthlyIncome = s.earnedIncome + s.businessIncome + s.propertyIncome + s.publicTransferIncome + s.privateTransferIncome;
    const workIncomeDeduction = calcWorkDeduction(s);
    const incomeAfterDeduction = Math.max(actualMonthlyIncome - workIncomeDeduction, 0);
    const asset = calcAssetMonthlyIncome(s);
    const incomeRecognized = incomeAfterDeduction + asset.assetMonthlyIncome;
    const ratioToMedian = incomeRecognized / threshold.medianIncome;
    const benefitStatuses = types.map((type) => {
      const benefitThreshold = threshold[type];
      const judgement = judgeBenefit(type, benefitThreshold, incomeRecognized, s);
      return {
        type,
        label: cfg.labels.benefits[type],
        threshold: benefitThreshold,
        incomeRecognized,
        gap: benefitThreshold - incomeRecognized,
        ratioToThreshold: incomeRecognized / benefitThreshold,
        judgement,
        note: type === "medical" && judgement === "needs-check" ? "부양의무자 기준 확인 필요" : "",
      };
    });
    const nearestBenefit = benefitStatuses
      .map((item) => ({ ...item, absGap: Math.abs(item.gap) }))
      .sort((a, b) => a.absGap - b.absGap)[0]?.type || null;
    const result = {
      actualMonthlyIncome,
      workIncomeDeduction,
      incomeAfterDeduction,
      ...asset,
      incomeRecognized,
      medianIncome: threshold.medianIncome,
      ratioToMedian,
      livelihoodEstimate: Math.max(threshold.livelihood - incomeRecognized, 0),
      benefitStatuses,
      nearestBenefit,
    };
    return {
      ...result,
      warningFlags: buildWarnings(s, result),
      alternativeSupports: buildAlternatives(s, benefitStatuses, ratioToMedian),
    };
  }

  function renderKpis(result) {
    $("#wbeIncomeRecognized").textContent = manwon(result.incomeRecognized);
    $("#wbeMedianRatio").textContent = percent(result.ratioToMedian);
    $("#wbeMedianBase").textContent = `기준 중위소득 ${manwon(result.medianIncome)} 대비`;
    $("#wbeLivelihoodEstimate").textContent = manwon(result.livelihoodEstimate);
    $("#wbeNearestBenefit").textContent = result.nearestBenefit ? cfg.labels.benefits[result.nearestBenefit] : "대체 지원 확인";
  }

  function renderBenefitMatrix(result) {
    const tbody = $("#wbeBenefitTableBody");
    tbody.innerHTML = result.benefitStatuses.map((item) => {
      const gapLabel = item.gap >= 0 ? `여유 ${manwon(item.gap)}` : `초과 ${manwon(Math.abs(item.gap))}`;
      return `
        <tr>
          <td>
            <strong>${item.label}</strong>
            ${item.note ? `<small>${item.note}</small>` : ""}
          </td>
          <td>${manwon(item.threshold)}</td>
          <td>${manwon(item.incomeRecognized)}</td>
          <td class="${item.gap >= 0 ? "is-positive" : "is-negative"}">${gapLabel}</td>
          <td><span class="wbe-status-badge wbe-status-badge--${item.judgement}">${judgementLabel(item.judgement)}</span></td>
        </tr>
      `;
    }).join("");
  }

  function renderGauge(result) {
    const gauge = $("#wbeGauge");
    const marker = (label, ratio, className = "") => {
      const left = clamp((ratio / 0.6) * 100, 0, 100);
      return `<span class="wbe-gauge-marker ${className}" style="left:${left}%"><span>${label}</span></span>`;
    };
    gauge.innerHTML = [
      marker("생계 32%", 0.32),
      marker("의료 40%", 0.4),
      marker("주거 48%", 0.48),
      marker("교육 50%", 0.5),
      marker(`내 위치 ${percent(result.ratioToMedian)}`, result.ratioToMedian, "wbe-gauge-marker--mine"),
    ].join("");
  }

  function renderBreakdown(result) {
    const total = Math.max(result.incomeRecognized, 1);
    const items = [
      ["공제 후 월소득", result.incomeAfterDeduction],
      ["주거재산 환산", result.housingAssetMonthlyIncome],
      ["일반재산 환산", result.generalAssetMonthlyIncome],
      ["금융재산 환산", result.financialAssetMonthlyIncome],
    ];
    $("#wbeBreakdownList").innerHTML = items.map(([label, value]) => {
      const share = clamp((value / total) * 100, 0, 100);
      return `
        <div class="wbe-breakdown-row">
          <strong>${label}</strong>
          <div class="wbe-breakdown-bar"><span style="width:${share}%"></span></div>
          <em>${manwon(value)}</em>
        </div>
      `;
    }).join("");
  }

  function renderWarnings(result) {
    $("#wbeWarningGrid").innerHTML = result.warningFlags.map((item) => `
      <article class="wbe-warning-card wbe-warning-card--${item.severity}">
        <strong>${item.title}</strong>
        <p>${item.message}</p>
      </article>
    `).join("");
  }

  function renderAlternatives(result) {
    $("#wbeAlternativeGrid").innerHTML = result.alternativeSupports.map((item) => `
      <article class="wbe-alternative-card wbe-alternative-card--${item.priority}">
        <strong>${item.label}</strong>
        <p>${item.reason}</p>
      </article>
    `).join("");
  }

  function renderMessage(result) {
    const likely = result.benefitStatuses.filter((item) => item.judgement === "likely").map((item) => item.label);
    const borderline = result.benefitStatuses.filter((item) => item.judgement === "borderline").map((item) => item.label);
    const needsCheck = result.benefitStatuses.filter((item) => item.judgement === "needs-check").map((item) => item.label);
    const lines = [];

    if (likely.length) lines.push(`${likely.join(", ")}는 입력값 기준으로 가능성 높음 구간입니다.`);
    if (borderline.length) lines.push(`${borderline.join(", ")}는 기준선 근처라 실제 조사 결과에 따라 달라질 수 있습니다.`);
    if (needsCheck.length) lines.push(`${needsCheck.join(", ")}는 부양의무자 또는 특례 기준 확인이 필요합니다.`);
    if (!lines.length) lines.push("입력값 기준으로 주요 급여 선정기준과 거리가 있습니다. 다만 위기 사유나 가구 특성에 따라 다른 지원을 확인할 수 있습니다.");
    lines.push("이 결과는 자가 점검용 추정이며 공식 판정이 아닙니다.");
    $("#wbeMessage").textContent = lines.join(" ");
  }

  function readInputs() {
    state.householdSize = clamp(num($('[data-wbe="householdSize"]')?.value, 4), 1, 6);
    state.region = $('[data-wbe="region"]')?.value || "metro";
    state.housingType = $('[data-wbe="housingType"]')?.value || "rent";
    state.minorChildren = clamp(num($('[data-wbe="minorChildren"]')?.value, 0), 0, 10);
    state.isSingleParent = $('[data-wbe="isSingleParent"]')?.checked ?? false;
    state.hasDisabilityOrElderly = $('[data-wbe="hasDisabilityOrElderly"]')?.checked ?? false;
    state.earnedIncome = Math.max(num($('[data-wbe="earnedIncome"]')?.value, 0), 0);
    state.businessIncome = Math.max(num($('[data-wbe="businessIncome"]')?.value, 0), 0);
    state.propertyIncome = Math.max(num($('[data-wbe="propertyIncome"]')?.value, 0), 0);
    state.publicTransferIncome = Math.max(num($('[data-wbe="publicTransferIncome"]')?.value, 0), 0);
    state.privateTransferIncome = Math.max(num($('[data-wbe="privateTransferIncome"]')?.value, 0), 0);
    state.applyWorkDeduction = $('[data-wbe="applyWorkDeduction"]')?.checked ?? true;
    state.housingAsset = Math.max(num($('[data-wbe="housingAsset"]')?.value, 0), 0);
    state.generalAsset = Math.max(num($('[data-wbe="generalAsset"]')?.value, 0), 0);
    state.financialAsset = Math.max(num($('[data-wbe="financialAsset"]')?.value, 0), 0);
    state.debt = Math.max(num($('[data-wbe="debt"]')?.value, 0), 0);
    state.carValue = Math.max(num($('[data-wbe="carValue"]')?.value, 0), 0);
    state.carType = $('[data-wbe="carType"]')?.value || "none";
    state.hasSupportObligor = $('[data-wbe="hasSupportObligor"]')?.checked ?? false;
    state.obligorLevel = $('[data-wbe="obligorLevel"]')?.value || "unknown";
    state.hasCrisisReason = $('[data-wbe="hasCrisisReason"]')?.checked ?? false;
  }

  function setControl(key, value) {
    const el = $(`[data-wbe="${key}"]`);
    if (!el) return;
    if (el.type === "checkbox") {
      el.checked = Boolean(value);
    } else if (el.inputMode === "numeric" || el.classList.contains("input-number")) {
      el.value = typeof value === "number" ? value.toLocaleString("ko-KR") : String(value);
    } else {
      el.value = String(value);
    }
  }

  function applyState(nextState) {
    Object.entries(nextState).forEach(([key, value]) => setControl(key, value));
  }

  function updateUrl(s) {
    const params = new URLSearchParams({
      hh: String(s.householdSize),
      region: s.region,
      house: s.housingType,
      child: String(s.minorChildren),
      single: s.isSingleParent ? "1" : "0",
      special: s.hasDisabilityOrElderly ? "1" : "0",
      earned: String(Math.round(s.earnedIncome)),
      biz: String(Math.round(s.businessIncome)),
      prop: String(Math.round(s.propertyIncome)),
      public: String(Math.round(s.publicTransferIncome)),
      private: String(Math.round(s.privateTransferIncome)),
      wd: s.applyWorkDeduction ? "1" : "0",
      hasset: String(Math.round(s.housingAsset)),
      gasset: String(Math.round(s.generalAsset)),
      fasset: String(Math.round(s.financialAsset)),
      debt: String(Math.round(s.debt)),
      car: String(Math.round(s.carValue)),
      cartype: s.carType,
      obligor: s.hasSupportObligor ? "1" : "0",
      obligorLevel: s.obligorLevel,
      crisis: s.hasCrisisReason ? "1" : "0",
    });
    const nextUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", nextUrl);
  }

  function restoreFromUrl() {
    const params = new URLSearchParams(window.location.search);
    if (!params.size) return false;
    const restored = {
      householdSize: clamp(num(params.get("hh"), initialState.householdSize), 1, 6),
      region: params.get("region") || initialState.region,
      housingType: params.get("house") || initialState.housingType,
      minorChildren: clamp(num(params.get("child"), initialState.minorChildren), 0, 10),
      isSingleParent: params.get("single") === "1",
      hasDisabilityOrElderly: params.get("special") === "1",
      earnedIncome: num(params.get("earned"), initialState.earnedIncome),
      businessIncome: num(params.get("biz"), initialState.businessIncome),
      propertyIncome: num(params.get("prop"), initialState.propertyIncome),
      publicTransferIncome: num(params.get("public"), initialState.publicTransferIncome),
      privateTransferIncome: num(params.get("private"), initialState.privateTransferIncome),
      applyWorkDeduction: params.get("wd") !== "0",
      housingAsset: num(params.get("hasset"), initialState.housingAsset),
      generalAsset: num(params.get("gasset"), initialState.generalAsset),
      financialAsset: num(params.get("fasset"), initialState.financialAsset),
      debt: num(params.get("debt"), initialState.debt),
      carValue: num(params.get("car"), initialState.carValue),
      carType: params.get("cartype") || initialState.carType,
      hasSupportObligor: params.get("obligor") === "1",
      obligorLevel: params.get("obligorLevel") || initialState.obligorLevel,
      hasCrisisReason: params.get("crisis") === "1",
    };
    applyState(restored);
    return true;
  }

  function renderPresetState() {
    $$("[data-wbe-preset]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.wbePreset === activePreset);
    });
  }

  function applyPreset(id) {
    const preset = cfg.presets.find((item) => item.id === id);
    if (!preset) return;
    activePreset = id;
    const next = { ...initialState, ...preset.input };
    applyState(next);
    renderPresetState();
    update();
  }

  function update() {
    readInputs();
    const result = calculate(state);
    renderKpis(result);
    renderBenefitMatrix(result);
    renderGauge(result);
    renderBreakdown(result);
    renderWarnings(result);
    renderAlternatives(result);
    renderMessage(result);
    updateUrl(state);
  }

  function bindEvents() {
    $$("[data-wbe]").forEach((el) => {
      el.addEventListener("input", () => {
        activePreset = "";
        renderPresetState();
        update();
      });
      el.addEventListener("change", () => {
        activePreset = "";
        renderPresetState();
        update();
      });
      if (el.classList.contains("input-number")) {
        el.addEventListener("blur", () => {
          const value = num(el.value, 0);
          el.value = value ? value.toLocaleString("ko-KR") : "0";
        });
      }
    });

    $$("[data-wbe-preset]").forEach((button) => {
      button.addEventListener("click", () => applyPreset(button.dataset.wbePreset));
    });

    document.getElementById("wbeResetBtn")?.addEventListener("click", () => applyPreset("family-four"));
    document.getElementById("wbeCopyBtn")?.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        const button = document.getElementById("wbeCopyBtn");
        if (button) {
          const original = button.textContent;
          button.textContent = "링크 복사됨";
          setTimeout(() => { button.textContent = original; }, 1600);
        }
      } catch {
        window.prompt("아래 주소를 복사하세요.", window.location.href);
      }
    });
  }

  const restored = restoreFromUrl();
  if (!restored) applyPreset(activePreset);
  bindEvents();
  renderPresetState();
  update();
})();
