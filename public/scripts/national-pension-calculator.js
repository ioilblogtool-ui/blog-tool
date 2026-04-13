const configEl = document.getElementById("npcConfig");
const { defaults = {}, rules = {}, incomePresets = [] } = JSON.parse(configEl?.textContent || "{}");

const $ = (id) => document.getElementById(id);
const page = document.querySelector('[data-calculator="national-pension-calculator"]');

let compareChart = null;
let flowChart = null;

function formatManWon(value) {
  return `${Math.round(Number(value || 0)).toLocaleString("ko-KR")}만원`;
}

function formatAge(value) {
  return `${Number(value || 0).toFixed(Number(value || 0) % 1 === 0 ? 0 : 1)}세`;
}

function getNumber(id, fallback = 0) {
  const value = Number($(id)?.value);
  return Number.isFinite(value) ? value : fallback;
}

function getState() {
  const activeMode = document.querySelector(".npc-mode-tab.is-active")?.dataset.mode || defaults.incomeMode || "income";
  const activeClaim = document.querySelector(".npc-claim-tab.is-active")?.dataset.claim || defaults.claimType || "normal";
  const subscriberType = document.querySelector('[name="npcSubscriberType"]:checked')?.value || defaults.subscriberType || "employee";

  return {
    currentAge: getNumber("npcCurrentAge", defaults.currentAge),
    startYear: getNumber("npcStartYear", defaults.startYear),
    incomeMode: activeMode,
    monthlyIncome: getNumber("npcMonthlyIncome", defaults.monthlyIncome),
    monthlyPremium: getNumber("npcMonthlyPremium", defaults.monthlyPremium),
    endAge: getNumber("npcEndAge", defaults.endAge),
    subscriberType,
    claimType: activeClaim,
    deferYears: getNumber("npcDeferYears", defaults.deferYears),
    lifeExpectancy: getNumber("npcLifeExpectancy", defaults.lifeExpectancy),
    targetMonthlyExpense: getNumber("npcTargetExpense", defaults.targetMonthlyExpense),
    inflationRate: getNumber("npcInflationRate", defaults.inflationRate),
    contributionGapYears: getNumber("npcGapYears", defaults.contributionGapYears),
  };
}

function calcContribution(input) {
  const currentYear = 2026;
  const birthYear = currentYear - input.currentAge;
  const startAge = input.startYear - birthYear;
  const rawYears = input.endAge - startAge;
  const contributionYears = Math.max(0, rawYears - (input.contributionGapYears || 0));
  return {
    startAge,
    contributionYears,
    contributionMonths: contributionYears * 12,
  };
}

function calcMonthlyPremium(input) {
  if (input.incomeMode === "premium") return input.monthlyPremium;
  const fullPremium = input.monthlyIncome * rules.premiumRate2026;
  return input.subscriberType === "employee" ? fullPremium / 2 : fullPremium;
}

function calcTotalContribution(monthlyPremium, contributionMonths) {
  return Math.round(monthlyPremium * contributionMonths);
}

function estimateNormalPension(input, contributionYears) {
  const effectiveIncome = (rules.aValue2026 + input.monthlyIncome) / 2;
  const periodFactor = Math.min(1, contributionYears / rules.baseContributionYears);
  return Math.round(effectiveIncome * rules.incomeReplacementRate * periodFactor);
}

function calcPensionByClaimType(normalPension, input) {
  const earlyMonths = Math.max(0, (rules.normalStartAge - rules.earlyStartAge) * 12);
  const earlyFactor = Math.max(0, 1 - earlyMonths * rules.earlyDeductPerMonth);
  const deferMonths = Math.min(rules.maxDeferYears, input.deferYears || 0) * 12;
  const deferFactor = 1 + deferMonths * rules.deferBonusPerMonth;

  return {
    early: {
      startAge: rules.earlyStartAge,
      monthlyPension: Math.round(normalPension * earlyFactor),
    },
    normal: {
      startAge: rules.normalStartAge,
      monthlyPension: Math.round(normalPension),
    },
    deferred: {
      startAge: rules.normalStartAge + Math.min(rules.maxDeferYears, input.deferYears || 0),
      monthlyPension: Math.round(normalPension * deferFactor),
    },
  };
}

function calcBreakeven(totalContribution, monthlyPension, pensionStartAge) {
  if (monthlyPension <= 0) return null;
  const monthsNeeded = totalContribution / monthlyPension;
  return Math.round((pensionStartAge + monthsNeeded / 12) * 10) / 10;
}

function calcRealPension(nominalPension, yearsUntilPension, inflationRate) {
  const factor = Math.pow(1 + inflationRate / 100, Math.max(0, yearsUntilPension));
  return Math.round(nominalPension / factor);
}

function calcTotalPayout(monthlyPension, pensionStartAge, lifeExpectancy) {
  const years = Math.max(0, lifeExpectancy - pensionStartAge);
  return Math.round(monthlyPension * years * 12);
}

function calcShortfall(monthlyPension, targetExpense) {
  return Math.max(0, targetExpense - monthlyPension);
}

function calculate(input) {
  const contribution = calcContribution(input);
  const monthlyPremium = calcMonthlyPremium(input);
  const totalContribution = calcTotalContribution(monthlyPremium, contribution.contributionMonths);
  const incomeForEstimate = input.incomeMode === "premium"
    ? Math.round((monthlyPremium / rules.premiumRate2026) * (input.subscriberType === "employee" ? 2 : 1))
    : input.monthlyIncome;
  const normalPension = estimateNormalPension({ ...input, monthlyIncome: incomeForEstimate }, contribution.contributionYears);
  const scenarios = calcPensionByClaimType(normalPension, input);
  const yearsUntilPension = Math.max(0, rules.normalStartAge - input.currentAge);

  return {
    contributionYears: contribution.contributionYears,
    contributionMonths: contribution.contributionMonths,
    monthlyPremium: Math.round(monthlyPremium * 10) / 10,
    totalContribution,
    normalPension,
    scenarios,
    isEligible: contribution.contributionYears >= rules.minContributionYears,
    realPension: calcRealPension(normalPension, yearsUntilPension, input.inflationRate || defaults.inflationRate),
    totalPayoutByClaim: {
      early: calcTotalPayout(scenarios.early.monthlyPension, scenarios.early.startAge, input.lifeExpectancy),
      normal: calcTotalPayout(scenarios.normal.monthlyPension, scenarios.normal.startAge, input.lifeExpectancy),
      deferred: calcTotalPayout(scenarios.deferred.monthlyPension, scenarios.deferred.startAge, input.lifeExpectancy),
    },
    breakeven: {
      early: calcBreakeven(totalContribution, scenarios.early.monthlyPension, scenarios.early.startAge),
      normal: calcBreakeven(totalContribution, scenarios.normal.monthlyPension, scenarios.normal.startAge),
      deferred: calcBreakeven(totalContribution, scenarios.deferred.monthlyPension, scenarios.deferred.startAge),
    },
  };
}

function claimKey(type) {
  return type === "deferred" ? "deferred" : type;
}

function claimLabel(type, result) {
  if (type === "early") return "조기수령 60세 기준";
  if (type === "deferred") return `연기수령 ${result.scenarios.deferred.startAge}세 기준`;
  return "정상수령 65세 기준";
}

function guideMessages(state, result, activeMonthlyPension) {
  const messages = [];
  if (result.contributionYears < 20) {
    messages.push("가입기간이 아직 짧은 편이라 예상 연금이 낮게 나옵니다. 납입 종료 나이를 늘리는 효과를 먼저 확인해보세요.");
  }
  if (result.contributionYears >= 20) {
    messages.push(`현재 입력 기준 가입기간은 ${result.contributionYears}년입니다. 가입기간이 길수록 연금 추정치는 안정적으로 커집니다.`);
  }
  if (state.claimType === "early") {
    messages.push("조기수령은 빨리 받기 시작하는 대신 월수령액이 줄어듭니다. 현금흐름이 급한 경우에 적합한 선택지입니다.");
  }
  if (state.claimType === "deferred") {
    messages.push("연기수령은 월수령액을 키우는 데 유리하지만, 실제로 오래 받을 가능성과 다른 소득원이 있는지 함께 봐야 합니다.");
  }
  const shortfall = calcShortfall(activeMonthlyPension, state.targetMonthlyExpense);
  if (shortfall > 100) {
    messages.push(`목표 생활비 대비 ${formatManWon(shortfall)} 부족으로 추정됩니다. IRP나 개인연금 같은 추가 축을 같이 준비하는 것이 현실적입니다.`);
  }
  if (state.subscriberType === "regional") {
    messages.push("지역가입자는 보험료를 본인이 전액 부담하므로, 같은 소득이어도 체감 납입 부담이 더 큽니다.");
  }
  return messages;
}

function ensureChart(chartRef, canvasId, config) {
  const canvas = $(canvasId);
  if (!canvas || typeof Chart === "undefined") return chartRef;
  if (chartRef) {
    chartRef.data = config.data;
    chartRef.options = config.options;
    chartRef.update();
    return chartRef;
  }
  return new Chart(canvas, config);
}

function updateCharts(result) {
  compareChart = ensureChart(compareChart, "npcCompareChart", {
    type: "bar",
    data: {
      labels: ["조기수령", "정상수령", "연기수령"],
      datasets: [{
        data: [
          result.scenarios.early.monthlyPension,
          result.scenarios.normal.monthlyPension,
          result.scenarios.deferred.monthlyPension,
        ],
        backgroundColor: ["#df6f65", "#1d9e75", "#3f78d0"],
        borderRadius: 10,
        borderSkipped: false,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${formatManWon(ctx.parsed.y)} (추정)`,
          },
        },
      },
      scales: {
        y: {
          ticks: {
            callback: (value) => `${value.toLocaleString("ko-KR")}만`,
          },
          grid: { color: "#efeae2" },
        },
        x: {
          grid: { display: false },
          ticks: {
            autoSkip: false,
            maxRotation: 0,
            minRotation: 0,
          },
        },
      },
    },
  });

  flowChart = ensureChart(flowChart, "npcFlowChart", {
    type: "bar",
    data: {
      labels: ["총 납입액", "평생 총 수령액"],
      datasets: [{
        data: [result.totalContribution, result.activeTotalPayout],
        backgroundColor: ["#c7bfb1", "#1d9e75"],
        borderRadius: 10,
        borderSkipped: false,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${formatManWon(ctx.parsed.y)} (추정)`,
          },
        },
      },
      scales: {
        y: {
          ticks: {
            callback: (value) => `${value.toLocaleString("ko-KR")}만`,
          },
          grid: { color: "#efeae2" },
        },
        x: {
          grid: { display: false },
          ticks: {
            autoSkip: false,
            maxRotation: 0,
            minRotation: 0,
          },
        },
      },
    },
  });
}

function updateQuery(state) {
  const params = new URLSearchParams();
  params.set("age", String(state.currentAge));
  params.set("sy", String(state.startYear));
  params.set("mode", state.incomeMode);
  params.set("inc", String(state.monthlyIncome));
  params.set("prm", String(state.monthlyPremium));
  params.set("ea", String(state.endAge));
  params.set("sub", state.subscriberType);
  params.set("ct", state.claimType);
  params.set("dy", String(state.deferYears));
  params.set("le", String(state.lifeExpectancy));
  params.set("te", String(state.targetMonthlyExpense));
  params.set("inf", String(state.inflationRate));
  params.set("gap", String(state.contributionGapYears));
  history.replaceState(null, "", `${location.pathname}?${params.toString()}`);
}

function restoreQuery() {
  const params = new URLSearchParams(location.search);
  const mappings = [
    ["age", "npcCurrentAge"],
    ["sy", "npcStartYear"],
    ["inc", "npcMonthlyIncome"],
    ["prm", "npcMonthlyPremium"],
    ["ea", "npcEndAge"],
    ["dy", "npcDeferYears"],
    ["le", "npcLifeExpectancy"],
    ["te", "npcTargetExpense"],
    ["inf", "npcInflationRate"],
    ["gap", "npcGapYears"],
  ];
  mappings.forEach(([param, id]) => {
    const value = params.get(param);
    if (value !== null && $(id)) $(id).value = value;
  });

  const mode = params.get("mode");
  if (mode) {
    document.querySelectorAll(".npc-mode-tab").forEach((tab) => {
      tab.classList.toggle("is-active", tab.dataset.mode === mode);
    });
  }

  const claim = params.get("ct");
  if (claim) {
    document.querySelectorAll(".npc-claim-tab").forEach((tab) => {
      tab.classList.toggle("is-active", tab.dataset.claim === claim);
    });
  }

  const sub = params.get("sub");
  if (sub) {
    document.querySelectorAll('[name="npcSubscriberType"]').forEach((radio) => {
      radio.checked = radio.value === sub;
    });
  }
}

function syncModeVisibility() {
  const state = getState();
  $("npcIncomeField")?.classList.toggle("is-hidden", state.incomeMode !== "income");
  $("npcPremiumField")?.classList.toggle("is-hidden", state.incomeMode !== "premium");
  $("npcDeferControl").hidden = state.claimType !== "deferred";
  $("npcEndAgeDisplay").textContent = `${state.endAge}세`;
  $("npcDeferredLabel").textContent = `${rules.normalStartAge + state.deferYears}세`;
}

function render() {
  const state = getState();
  syncModeVisibility();
  const result = calculate(state);
  const activeKey = claimKey(state.claimType);
  const activeScenario = result.scenarios[activeKey];
  const activeMonthlyPension = activeScenario.monthlyPension;
  const activeBreakeven = result.breakeven[activeKey];
  const activeTotalPayout = result.totalPayoutByClaim[activeKey];
  const shortfall = calcShortfall(activeMonthlyPension, state.targetMonthlyExpense);
  const yearsUntilActive = Math.max(0, activeScenario.startAge - state.currentAge);
  const activeRealPension = calcRealPension(activeMonthlyPension, yearsUntilActive, state.inflationRate);
  const enrichedResult = { ...result, activeTotalPayout };

  $("npcIneligibleNotice").hidden = result.isEligible;
  $("npcMonthlyPension").textContent = formatManWon(activeMonthlyPension);
  $("npcRealPension").textContent = formatManWon(activeRealPension);
  $("npcTotalContribution").textContent = formatManWon(result.totalContribution);
  $("npcContributionYears").textContent = String(result.contributionYears);
  $("npcBreakevenAge").textContent = activeBreakeven ? formatAge(activeBreakeven) : "계산 불가";
  $("npcTotalPayout").textContent = formatManWon(activeTotalPayout);
  $("npcLifeLabel").textContent = `${state.lifeExpectancy}세`;
  $("npcClaimLabel").textContent = claimLabel(state.claimType, result);

  $("npcTargetDisplay").textContent = formatManWon(state.targetMonthlyExpense);
  $("npcPensionDisplay").textContent = formatManWon(activeMonthlyPension);
  $("npcShortfallDisplay").textContent = shortfall > 0 ? formatManWon(shortfall) : "충분";

  const guideList = $("npcGuideList");
  if (guideList) {
    guideList.innerHTML = guideMessages(state, result, activeMonthlyPension)
      .map((message) => `<li class="npc-guide-item">${message}</li>`)
      .join("");
  }

  updateCharts(enrichedResult);
  updateQuery(state);
}

function flashButton(button, label) {
  if (!button) return;
  const original = button.textContent;
  button.textContent = label;
  setTimeout(() => {
    button.textContent = original;
  }, 1600);
}

function resetForm() {
  $("npcCurrentAge").value = String(defaults.currentAge);
  $("npcStartYear").value = String(defaults.startYear);
  $("npcMonthlyIncome").value = String(defaults.monthlyIncome);
  $("npcMonthlyPremium").value = String(defaults.monthlyPremium);
  $("npcEndAge").value = String(defaults.endAge);
  $("npcDeferYears").value = String(defaults.deferYears);
  $("npcLifeExpectancy").value = String(defaults.lifeExpectancy);
  $("npcTargetExpense").value = String(defaults.targetMonthlyExpense);
  $("npcInflationRate").value = String(defaults.inflationRate);
  $("npcGapYears").value = String(defaults.contributionGapYears);

  document.querySelectorAll(".npc-mode-tab").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.mode === defaults.incomeMode);
  });
  document.querySelectorAll(".npc-claim-tab").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.claim === defaults.claimType);
  });
  document.querySelectorAll('[name="npcSubscriberType"]').forEach((radio) => {
    radio.checked = radio.value === defaults.subscriberType;
  });
  render();
  history.replaceState(null, "", location.pathname);
}

function bindEvents() {
  document.querySelectorAll(".npc-mode-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".npc-mode-tab").forEach((item) => item.classList.remove("is-active"));
      tab.classList.add("is-active");
      render();
    });
  });

  document.querySelectorAll(".npc-claim-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".npc-claim-tab").forEach((item) => item.classList.remove("is-active"));
      tab.classList.add("is-active");
      render();
    });
  });

  document.querySelectorAll('[name="npcSubscriberType"]').forEach((radio) => {
    radio.addEventListener("change", render);
  });

  [
    "npcCurrentAge",
    "npcStartYear",
    "npcMonthlyIncome",
    "npcMonthlyPremium",
    "npcEndAge",
    "npcDeferYears",
    "npcLifeExpectancy",
    "npcTargetExpense",
    "npcInflationRate",
    "npcGapYears",
  ].forEach((id) => {
    $(id)?.addEventListener("input", render);
    $(id)?.addEventListener("change", render);
  });

  incomePresets.forEach((preset) => {
    document.querySelector(`.npc-preset-btn[data-value="${preset.value}"]`)?.addEventListener("click", () => {
      $("npcMonthlyIncome").value = String(preset.value);
      render();
    });
  });

  $("npcAdvancedToggle")?.addEventListener("click", () => {
    const expanded = $("npcAdvancedToggle").getAttribute("aria-expanded") === "true";
    $("npcAdvancedToggle").setAttribute("aria-expanded", expanded ? "false" : "true");
    $("npcAdvancedToggle").textContent = expanded ? "고급 설정 열기" : "고급 설정 닫기";
    $("npcAdvancedPanel").hidden = expanded;
  });

  $("resetNpcBtn")?.addEventListener("click", () => {
    resetForm();
    flashButton($("resetNpcBtn"), "초기화됨");
  });

  $("copyNpcLinkBtn")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      flashButton($("copyNpcLinkBtn"), "링크 복사됨");
    } catch {
      flashButton($("copyNpcLinkBtn"), "복사 실패");
    }
  });
}

if (page) {
  restoreQuery();
  bindEvents();
  render();
}
