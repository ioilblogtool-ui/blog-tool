(() => {
  const root = document.querySelector(".hbirc-page");
  const dataEl = document.getElementById("hbirc-data");
  if (!root || !dataEl) return;

  const cfg = JSON.parse(dataEl.textContent || "{}");
  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => Array.from(root.querySelectorAll(selector));
  const initialState = {
    householdSize: 4,
    region: "metro",
    zone: "zone2",
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
    monthlyRent: 450000,
    jeonseDeposit: 150000000,
    houseAge: 15,
    repairGrade: "auto",
  };
  let state = { ...initialState };

  const numberKeys = [
    "householdSize",
    "earnedIncome",
    "publicTransferIncome",
    "otherIncome",
    "housingAsset",
    "generalAsset",
    "financialAsset",
    "debt",
    "carValue",
    "monthlyRent",
    "jeonseDeposit",
    "houseAge",
  ];
  const boolKeys = ["applyWorkDeduction", "hasCar"];

  function num(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? Math.max(parsed, 0) : fallback;
  }

  function manwon(value) {
    return `${Math.round(value / 10000).toLocaleString("ko-KR")}만 원`;
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

  function calculateIncome(s) {
    const threshold = thresholdFor(s.householdSize);
    const grossIncome = s.earnedIncome + s.publicTransferIncome + s.otherIncome;
    const workDeduction = calcWorkDeduction(s);
    const incomeAfterDeduction = Math.max(grossIncome - workDeduction, 0);
    const asset = calcAssetMonthlyIncome(s);
    const incomeRecognized = incomeAfterDeduction + asset.assetMonthlyIncome;
    const housingThreshold = threshold.housing;
    const livelihoodThreshold = threshold.livelihood;
    const gap = housingThreshold - incomeRecognized;
    const ratio = incomeRecognized / housingThreshold;
    let judgement = "기준 초과";
    if (ratio <= 0.95) judgement = "가능성 있음";
    else if (ratio <= 1.05) judgement = "경계 구간";
    return {
      threshold,
      grossIncome,
      workDeduction,
      incomeAfterDeduction,
      ...asset,
      incomeRecognized,
      housingThreshold,
      livelihoodThreshold,
      gap,
      ratio,
      judgement,
      passed: incomeRecognized <= housingThreshold,
    };
  }

  function suggestRepairGrade(houseAge) {
    if (houseAge < 15) return "minor";
    if (houseAge < 20) return "medium";
    return "major";
  }

  function calculateRent(s, income) {
    const sizeKey = Math.min(Math.max(Number(s.householdSize) || 1, 1), 6);
    const standardRent = (cfg.standardRent[s.zone] || cfg.standardRent.zone2)[sizeKey];

    let actualRent = s.monthlyRent;
    if (s.housingType === "jeonse") {
      actualRent = (s.jeonseDeposit * cfg.jeonseConversionRate) / 12;
    }

    const effectiveRent = Math.min(actualRent, standardRent);
    const overStandard = actualRent > standardRent;

    let selfBurden = 0;
    if (income.incomeRecognized > income.livelihoodThreshold) {
      selfBurden = (income.incomeRecognized - income.livelihoodThreshold) * cfg.selfBurdenRate;
    }

    const estimatedBenefit = Math.max(effectiveRent - selfBurden, 0);

    return {
      zone: s.zone,
      standardRent,
      actualRent,
      effectiveRent,
      selfBurden,
      estimatedBenefit,
      overStandard,
    };
  }

  function calculateRepair(s, income) {
    const grade = s.repairGrade === "auto" ? suggestRepairGrade(s.houseAge) : s.repairGrade;
    const table = cfg.repairTable[grade];
    const supportRatio =
      income.incomeRecognized <= income.livelihoodThreshold
        ? cfg.repairSupportRatio.livelihoodRecipient
        : cfg.repairSupportRatio.housingOnly;
    const estimatedAmount = table.baseAmount * supportRatio;

    return {
      grade,
      label: table.label,
      baseAmount: table.baseAmount,
      supportRatio,
      estimatedAmount,
    };
  }

  function buildWarnings(s, income, rent, repair) {
    const warnings = [
      {
        title: "자가 점검용 추정",
        message: "실제 수급 여부와 지급액은 주민센터 조사와 국토교통부 최신 고시값에 따라 달라질 수 있습니다.",
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
    if (rent && rent.overStandard) {
      warnings.push({
        title: "기준임대료 초과",
        message: "실제 임차료가 기준임대료보다 높아 초과분은 본인 부담입니다.",
        severity: "info",
      });
    }
    if (income.assetMonthlyIncome > income.housingThreshold * 0.2) {
      warnings.push({
        title: "재산 환산 영향 큼",
        message: "재산의 월 소득환산액이 주거급여 기준에 의미 있게 반영됩니다. 재산 종류와 부채 인정 여부를 확인하세요.",
        severity: "warning",
      });
    }
    return warnings;
  }

  function readState() {
    numberKeys.forEach((key) => {
      const el = $(`[data-hbirc="${key}"]`);
      if (el) state[key] = num(el.value, initialState[key] || 0);
    });
    state.region = $('[data-hbirc="region"]')?.value || "metro";
    state.zone = $('[data-hbirc="zone"]')?.value || "zone2";
    state.repairGrade = $('[data-hbirc="repairGrade"]')?.value || "auto";
    boolKeys.forEach((key) => {
      const el = $(`[data-hbirc="${key}"]`);
      if (el) state[key] = Boolean(el.checked);
    });
    state.householdSize = Math.min(Math.max(Number(state.householdSize) || 4, 1), 6);
  }

  function setControl(key, value) {
    const el = $(`[data-hbirc="${key}"]`);
    if (!el) return;
    if (el.type === "checkbox") el.checked = Boolean(value);
    else if (numberKeys.includes(key)) el.value = Number(value || 0).toLocaleString("ko-KR");
    else el.value = String(value);
  }

  function setHousingType(type) {
    state.housingType = type;
    $$("[data-hbirc-housing]").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.hbircHousing === type));
    });
    $$("[data-hbirc-branch]").forEach((panel) => {
      const match = panel.dataset.hbircBranch === type;
      panel.hidden = !match;
      panel.setAttribute("aria-hidden", String(!match));
    });
  }

  function renderBreakdown(income) {
    const items = [
      ["소득평가액", income.incomeAfterDeduction],
      ["근로소득 공제", income.workDeduction],
      ["주거재산 환산", income.housingMonthlyIncome],
      ["일반재산 환산", income.generalMonthlyIncome],
      ["금융재산 환산", income.financialMonthlyIncome],
    ];
    const total = Math.max(income.incomeRecognized, 1);
    const el = $("[data-hbirc-breakdown]");
    if (!el) return;
    el.innerHTML = items
      .map(([label, value]) => {
        const width = Math.min(Math.max((value / total) * 100, 0), 100);
        return `<article class="hbirc-breakdown-row"><strong>${label}</strong><span><i style="width:${width}%"></i></span><em>${manwon(value)}</em></article>`;
      })
      .join("");
  }

  function renderWarnings(warnings) {
    const el = $("[data-hbirc-warnings]");
    if (!el) return;
    el.innerHTML = warnings
      .map(
        (item) =>
          `<article class="hbirc-warning hbirc-warning--${item.severity}"><strong>${item.title}</strong><p>${item.message}</p></article>`,
      )
      .join("");
  }

  function renderBranchResult(income, rent, repair) {
    const rentSection = $('[data-hbirc-branch-result="rent"]');
    const ownSection = $('[data-hbirc-branch-result="own"]');
    const freeNotice = $('[data-hbirc-branch-result="free"]');

    if (rentSection) rentSection.hidden = !rent;
    if (ownSection) ownSection.hidden = !repair;
    if (freeNotice) freeNotice.hidden = state.housingType !== "free";

    if (rent) {
      $('[data-hbirc-result="zoneLabel"]') && ($('[data-hbirc-result="zoneLabel"]').textContent = cfg.labels.zones[rent.zone]);
      $('[data-hbirc-result="standardRent"]') && ($('[data-hbirc-result="standardRent"]').textContent = manwon(rent.standardRent));
      $('[data-hbirc-result="effectiveRent"]') && ($('[data-hbirc-result="effectiveRent"]').textContent = manwon(rent.effectiveRent));
      $('[data-hbirc-result="estimatedRentBenefit"]') &&
        ($('[data-hbirc-result="estimatedRentBenefit"]').textContent = manwon(rent.estimatedBenefit));
    }

    if (repair) {
      $('[data-hbirc-result="repairGradeLabel"]') &&
        ($('[data-hbirc-result="repairGradeLabel"]').textContent = repair.label);
      $('[data-hbirc-result="repairBaseAmount"]') &&
        ($('[data-hbirc-result="repairBaseAmount"]').textContent = manwon(repair.baseAmount));
      $('[data-hbirc-result="estimatedRepairAmount"]') &&
        ($('[data-hbirc-result="estimatedRepairAmount"]').textContent = manwon(repair.estimatedAmount));
    }
  }

  function render(income, rent, repair, warnings) {
    $('[data-hbirc-result="incomeRecognized"]').textContent = manwon(income.incomeRecognized);
    $('[data-hbirc-result="threshold"]').textContent = manwon(income.housingThreshold);
    $('[data-hbirc-result="thresholdMeta"]').textContent = `${state.householdSize}인 가구 기준`;
    $('[data-hbirc-result="judgement"]').textContent = income.judgement;
    $('[data-hbirc-result="gap"]').textContent =
      income.gap >= 0 ? `${manwon(income.gap)} 낮음` : `${manwon(Math.abs(income.gap))} 초과`;

    let secondSentence = "";
    if (state.housingType === "free") {
      secondSentence = "무상거주는 별도 임대료·수선비 계산이 없어 소득인정액 기준 통과 여부만 확인하세요.";
    } else if (rent) {
      secondSentence = income.passed
        ? `${cfg.labels.zones[rent.zone]} 기준임대료(월 ${manwon(rent.standardRent)}) 안에서 실제 임차료가 ${
            rent.overStandard ? "일부" : "전액"
          } 반영될 수 있습니다.`
        : "입력값 기준으로는 주거급여 기준을 초과한 것으로 보입니다.";
    } else if (repair) {
      secondSentence = income.passed
        ? `자가 ${repair.label} 기준 약 ${manwon(repair.estimatedAmount)}의 수선비 지원을 받을 수 있습니다.`
        : "입력값 기준으로는 주거급여 기준을 초과한 것으로 보입니다.";
    }

    const summary = `입력값 기준 소득인정액은 월 약 ${manwon(income.incomeRecognized)}으로 추정됩니다. ${state.householdSize}인 가구 주거급여 선정기준보다 ${
      income.gap >= 0 ? `약 ${manwon(income.gap)} 낮아` : `약 ${manwon(Math.abs(income.gap))} 높아`
    } ${income.passed ? "신청 가능성이 있는 구간입니다." : "기준을 초과한 것으로 보입니다."} ${secondSentence}`;
    $("[data-hbirc-summary]").textContent = `${summary} 이 결과는 자가 점검용 추정입니다.`;

    const fill = Math.min(Math.max(income.ratio * 100, 0), 140);
    $("[data-hbirc-gauge-fill]").style.width = `${Math.min(fill, 100)}%`;

    renderBreakdown(income);
    renderWarnings(warnings);
    renderBranchResult(income, rent, repair);
  }

  function updateUrl() {
    const params = new URLSearchParams();
    params.set("hh", String(state.householdSize));
    params.set("rg", state.region);
    params.set("zn", state.zone);
    params.set("ht", state.housingType);
    params.set("inc", String(Math.round(state.earnedIncome)));
    params.set("pub", String(Math.round(state.publicTransferIncome)));
    params.set("ha", String(Math.round(state.housingAsset)));
    params.set("fa", String(Math.round(state.financialAsset)));
    if (state.debt) params.set("debt", String(Math.round(state.debt)));
    if (state.hasCar || state.carValue) params.set("car", "yes");
    if (state.housingType === "rent") params.set("rent", String(Math.round(state.monthlyRent)));
    if (state.housingType === "jeonse") params.set("jeonse", String(Math.round(state.jeonseDeposit)));
    if (state.housingType === "own") {
      params.set("age", String(Math.round(state.houseAge)));
      params.set("grade", state.repairGrade);
    }
    history.replaceState({}, "", `${location.pathname}?${params.toString()}`);
  }

  function restoreFromUrl() {
    const params = new URLSearchParams(location.search);
    const map = {
      hh: "householdSize",
      rg: "region",
      zn: "zone",
      inc: "earnedIncome",
      pub: "publicTransferIncome",
      ha: "housingAsset",
      fa: "financialAsset",
      debt: "debt",
      rent: "monthlyRent",
      jeonse: "jeonseDeposit",
      age: "houseAge",
      grade: "repairGrade",
    };
    Object.entries(map).forEach(([param, key]) => {
      if (params.has(param)) state[key] = numberKeys.includes(key) ? num(params.get(param)) : params.get(param);
    });
    if (params.has("ht")) state.housingType = params.get("ht");
    if (params.get("car") === "yes") state.hasCar = true;
    Object.entries(state).forEach(([key, value]) => setControl(key, value));
    setHousingType(state.housingType);
  }

  function refresh() {
    readState();
    const income = calculateIncome(state);
    let rent = null;
    let repair = null;
    if (state.housingType === "rent" || state.housingType === "jeonse") {
      rent = calculateRent(state, income);
    } else if (state.housingType === "own") {
      repair = calculateRepair(state, income);
    }
    const warnings = buildWarnings(state, income, rent, repair);
    render(income, rent, repair, warnings);
    updateUrl();
  }

  $$("[data-hbirc]").forEach((el) => {
    el.addEventListener("input", refresh);
    el.addEventListener("change", refresh);
  });

  $$("[data-hbirc-housing]").forEach((button) => {
    button.addEventListener("click", () => {
      setHousingType(button.dataset.hbircHousing);
      refresh();
    });
  });

  $$("[data-hbirc-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      const preset = cfg.presets.find((item) => item.id === button.dataset.hbircPreset);
      if (!preset) return;
      state = { ...initialState, ...preset.input };
      Object.entries(state).forEach(([key, value]) => setControl(key, value));
      setHousingType(state.housingType);
      refresh();
    });
  });

  $("#hbircResetBtn")?.addEventListener("click", () => {
    state = { ...initialState };
    Object.entries(state).forEach(([key, value]) => setControl(key, value));
    setHousingType(state.housingType);
    refresh();
  });

  $("#hbircCopyBtn")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      $("#hbircCopyBtn").textContent = "링크 복사 완료";
      setTimeout(() => {
        $("#hbircCopyBtn").textContent = "링크 복사";
      }, 1600);
    } catch {
      $("#hbircCopyBtn").textContent = "복사 실패";
    }
  });

  restoreFromUrl();
  refresh();
})();
