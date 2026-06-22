(() => {
  const root = document.querySelector(".cmc-page");
  const dataEl = document.getElementById("cmc-data");
  if (!root || !dataEl) return;

  const cfg = JSON.parse(dataEl.textContent || "{}");
  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => Array.from(root.querySelectorAll(selector));

  const initialState = { ...cfg.defaultInput };
  let state = { ...initialState };

  const numericKeys = [
    "husbandSalary",
    "wifeSalary",
    "husbandBonus",
    "wifeBonus",
    "otherMonthlyIncome",
    "loanBalance",
    "loanRate",
    "manualMonthlyPayment",
    "rent",
    "maintenanceFee",
    "children",
    "daycare",
    "formulaFood",
    "diaper",
    "childMedical",
    "childInsurance",
    "careEducation",
    "food",
    "transport",
    "telecomSubscription",
    "coupleInsurance",
    "medicalBeautyClothing",
    "familyEvents",
    "otherCard",
    "depositSavings",
    "isa",
    "pension",
    "stockEtf",
    "crypto",
    "currentAssets",
    "targetAssets",
    "expectedReturn",
  ];

  const moneyKeys = numericKeys.filter((key) => !["loanRate", "children", "expectedReturn"].includes(key));

  function number(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? Math.max(parsed, 0) : fallback;
  }

  function won(value) {
    const rounded = Math.round(value || 0);
    if (Math.abs(rounded) >= 100000000) {
      const eok = rounded / 100000000;
      return `${Number(eok.toFixed(eok >= 10 ? 1 : 2)).toLocaleString("ko-KR")}억 원`;
    }
    return `${Math.round(rounded / 10000).toLocaleString("ko-KR")}만 원`;
  }

  function monthly(value) {
    return `${Math.round((value || 0) / 10000).toLocaleString("ko-KR")}만 원`;
  }

  function percent(value) {
    return `${Number((value || 0).toFixed(1)).toLocaleString("ko-KR")}%`;
  }

  function estimateIncomeTax(taxable) {
    const brackets = [
      { limit: 14000000, rate: 0.06, quick: 0 },
      { limit: 50000000, rate: 0.15, quick: 1260000 },
      { limit: 88000000, rate: 0.24, quick: 5760000 },
      { limit: 150000000, rate: 0.35, quick: 15440000 },
      { limit: 300000000, rate: 0.38, quick: 19940000 },
      { limit: 500000000, rate: 0.40, quick: 25940000 },
      { limit: 1000000000, rate: 0.42, quick: 35940000 },
      { limit: Infinity, rate: 0.45, quick: 65940000 },
    ];
    const bracket = brackets.find((item) => taxable <= item.limit) || brackets[0];
    return Math.max(taxable * bracket.rate - bracket.quick, 0);
  }

  function estimateAnnualNetIncome(grossAnnual) {
    if (!grossAnnual) return 0;
    const pension = Math.min(grossAnnual * 0.045, 2817000);
    const health = grossAnnual * 0.03545;
    const longTermCare = health * 0.1295;
    const employment = grossAnnual * 0.009;
    const earnedIncomeDeduction = Math.min(Math.max(grossAnnual * 0.18, 1500000), 20000000);
    const taxable = Math.max(grossAnnual - pension - health - longTermCare - employment - earnedIncomeDeduction, 0);
    const incomeTax = estimateIncomeTax(taxable);
    const localTax = incomeTax * 0.1;
    return Math.max(grossAnnual - pension - health - longTermCare - employment - incomeTax - localTax, 0);
  }

  function monthlyNet(salary, bonus) {
    return estimateAnnualNetIncome(salary + bonus) / 12;
  }

  function housingCost(s) {
    const monthlyInterest = s.loanBalance * (s.loanRate / 100) / 12;
    const loanPayment = s.manualMonthlyPayment > 0 ? s.manualMonthlyPayment : monthlyInterest;
    if (s.housingType === "none") return s.maintenanceFee;
    if (s.housingType === "monthlyRent") return s.rent + s.maintenanceFee + monthlyInterest;
    return loanPayment + s.maintenanceFee;
  }

  function targetYears(currentAssets, monthlyInvestment, targetAssets, expectedReturn) {
    if (targetAssets <= 0) return null;
    if (currentAssets >= targetAssets) return 0;
    if (monthlyInvestment <= 0 && expectedReturn <= 0) return null;
    const monthlyRate = Math.pow(1 + expectedReturn / 100, 1 / 12) - 1;
    let assets = currentAssets;
    for (let month = 1; month <= 720; month += 1) {
      assets = assets * (1 + monthlyRate) + monthlyInvestment;
      if (assets >= targetAssets) return month / 12;
    }
    return null;
  }

  function savingBand(rate) {
    return (
      cfg.savingRateBands.find((band) => rate >= band.min && rate < band.max) ||
      cfg.savingRateBands[cfg.savingRateBands.length - 1]
    );
  }

  function calculate(s) {
    const husbandMonthlyNet = monthlyNet(s.husbandSalary, s.husbandBonus);
    const wifeMonthlyNet = monthlyNet(s.wifeSalary, s.wifeBonus);
    const totalMonthlyNet = husbandMonthlyNet + wifeMonthlyNet + s.otherMonthlyIncome;
    const housing = housingCost(s);
    const childcare =
      s.daycare + s.formulaFood + s.diaper + s.childMedical + s.childInsurance + s.careEducation;
    const living =
      s.food +
      s.transport +
      s.telecomSubscription +
      s.coupleInsurance +
      s.medicalBeautyClothing +
      s.familyEvents +
      s.otherCard;
    const monthlyInvesting =
      s.depositSavings + s.isa + s.pension + s.stockEtf + s.crypto;
    const fixedCost = housing + s.coupleInsurance + s.telecomSubscription;
    const variableCost = Math.max(childcare + living - s.coupleInsurance - s.telecomSubscription, 0);
    const spendingBeforeInvesting = housing + childcare + living;
    const monthlySurplus = totalMonthlyNet - spendingBeforeInvesting;
    const investableAmount = Math.max(monthlySurplus, 0);
    const savingRate = totalMonthlyNet > 0 ? (monthlySurplus / totalMonthlyNet) * 100 : 0;
    const inputInvestmentRate = totalMonthlyNet > 0 ? (monthlyInvesting / totalMonthlyNet) * 100 : 0;
    const usedMonthlyInvestment = monthlyInvesting > 0 ? Math.min(monthlyInvesting, investableAmount) : investableAmount;
    const years = targetYears(s.currentAssets, usedMonthlyInvestment, s.targetAssets, s.expectedReturn);
    const band = savingBand(savingRate);

    const categories = [
      { label: "주거비", value: housing },
      { label: "육아비", value: childcare },
      { label: "생활비", value: living },
      { label: "월 투자 입력액", value: monthlyInvesting },
    ].sort((a, b) => b.value - a.value);

    return {
      husbandMonthlyNet,
      wifeMonthlyNet,
      totalMonthlyNet,
      housing,
      childcare,
      living,
      fixedCost,
      variableCost,
      spendingBeforeInvesting,
      monthlyInvesting,
      monthlySurplus,
      investableAmount,
      savingRate,
      inputInvestmentRate,
      usedMonthlyInvestment,
      years,
      band,
      largestCategory: categories[0],
      expenseRatio: totalMonthlyNet > 0 ? (spendingBeforeInvesting / totalMonthlyNet) * 100 : 0,
    };
  }

  function setText(selector, value) {
    const el = $(selector);
    if (el) el.textContent = value;
  }

  function setWidth(selector, value) {
    const el = $(selector);
    if (el) el.style.width = `${Math.max(0, Math.min(value, 100))}%`;
  }

  function renderSuggestions(result) {
    const list = $("[data-cmc-suggestions]");
    if (!list) return;
    list.textContent = "";
    const suggestions = [];
    if (result.totalMonthlyNet > 0 && result.housing / result.totalMonthlyNet > 0.35) {
      suggestions.push("주거비 비중이 높습니다. 대출 갈아타기나 전월세 구조 비교를 먼저 확인해보세요.");
    }
    if (result.totalMonthlyNet > 0 && result.childcare / result.totalMonthlyNet > 0.15) {
      suggestions.push("육아비 비중이 큽니다. 분유, 기저귀, 어린이집 비용을 항목별로 나눠보면 조정 포인트가 보입니다.");
    }
    if (result.savingRate < 10) {
      suggestions.push("저축률이 낮은 편입니다. 보험료, 구독, 차량비처럼 매달 반복되는 고정비부터 점검해보세요.");
    }
    if (result.savingRate >= 40) {
      suggestions.push("저축률이 강한 편입니다. FIRE 계산기로 장기 목표 시점을 더 자세히 확인해보세요.");
    }
    if (!suggestions.length) {
      suggestions.push(`${result.largestCategory.label} 항목이 가장 큽니다. 이 항목을 10%만 줄여도 월 현금흐름이 바로 개선됩니다.`);
    }
    suggestions.slice(0, 3).forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });
  }

  function renderBreakdown(result) {
    const rows = [
      ["월 실수령 합계", result.totalMonthlyNet],
      ["주거비", result.housing],
      ["육아비", result.childcare],
      ["생활비", result.living],
      ["월 투자 입력액", result.monthlyInvesting],
      ["생활비 차감 후 잉여현금", result.monthlySurplus],
    ];
    rows.forEach(([label, value]) => {
      setText(`[data-cmc-breakdown="${label}"]`, monthly(value));
    });
  }

  function render(result) {
    setText('[data-cmc-result="totalMonthlyNet"]', monthly(result.totalMonthlyNet));
    setText('[data-cmc-result="fixedCost"]', monthly(result.fixedCost));
    setText('[data-cmc-result="variableCost"]', monthly(result.variableCost));
    setText('[data-cmc-result="investableAmount"]', monthly(result.investableAmount));
    setText('[data-cmc-result="savingRate"]', percent(result.savingRate));
    setText('[data-cmc-result="targetYears"]', result.years === null ? "도달 어려움" : `${Number(result.years.toFixed(1))}년`);
    setText('[data-cmc-result="band"]', result.band.label);
    setText('[data-cmc-result="bandDescription"]', result.band.description);
    setText('[data-cmc-result="husbandMonthlyNet"]', monthly(result.husbandMonthlyNet));
    setText('[data-cmc-result="wifeMonthlyNet"]', monthly(result.wifeMonthlyNet));
    setText('[data-cmc-result="monthlyInvesting"]', monthly(result.monthlyInvesting));
    setText('[data-cmc-result="inputInvestmentRate"]', percent(result.inputInvestmentRate));

    const badge = $('[data-cmc-result="band"]');
    if (badge) {
      badge.className = `cmc-saving-badge cmc-saving-badge--${result.band.tone}`;
    }

    const summary =
      `현재 입력 기준 월 실수령 합계는 ${monthly(result.totalMonthlyNet)}이고, 주거·육아·생활비를 뺀 월 잉여현금은 ${monthly(result.monthlySurplus)}입니다. ` +
      `저축률은 ${percent(result.savingRate)}로 '${result.band.label}' 구간이며, ${won(state.targetAssets)} 목표까지는 ` +
      `${result.years === null ? "현재 조건으로 60년 안에 도달하기 어렵습니다" : `약 ${Number(result.years.toFixed(1))}년이 걸리는 것으로 추정됩니다`}.`;
    setText("[data-cmc-summary]", summary);

    const base = result.totalMonthlyNet || 1;
    setWidth('[data-cmc-bar="housing"]', (result.housing / base) * 100);
    setWidth('[data-cmc-bar="childcare"]', (result.childcare / base) * 100);
    setWidth('[data-cmc-bar="living"]', (result.living / base) * 100);
    setWidth('[data-cmc-bar="surplus"]', (result.investableAmount / base) * 100);

    renderBreakdown(result);
    renderSuggestions(result);
  }

  function readState() {
    numericKeys.forEach((key) => {
      const el = $(`[data-cmc="${key}"]`);
      if (el) state[key] = number(el.value, initialState[key] || 0);
    });
    state.housingType = $('[data-cmc="housingType"]')?.value || "jeonseLoan";
  }

  function setControl(key, value) {
    const el = $(`[data-cmc="${key}"]`);
    if (!el) return;
    if (moneyKeys.includes(key)) {
      el.value = Number(value || 0).toLocaleString("ko-KR");
    } else {
      el.value = String(value);
    }
  }

  function updateUrl() {
    const params = new URLSearchParams();
    params.set("hs", String(Math.round(state.husbandSalary)));
    params.set("ws", String(Math.round(state.wifeSalary)));
    params.set("lb", String(Math.round(state.loanBalance)));
    params.set("rt", String(state.loanRate));
    params.set("ch", String(Math.round(state.children)));
    params.set("ta", String(Math.round(state.targetAssets)));
    history.replaceState({}, "", `${location.pathname}?${params.toString()}`);
  }

  function restoreFromUrl() {
    const params = new URLSearchParams(location.search);
    const map = {
      hs: "husbandSalary",
      ws: "wifeSalary",
      lb: "loanBalance",
      rt: "loanRate",
      ch: "children",
      ta: "targetAssets",
    };
    Object.entries(map).forEach(([param, key]) => {
      if (params.has(param)) state[key] = number(params.get(param), state[key]);
    });
    Object.entries(state).forEach(([key, value]) => setControl(key, value));
  }

  function refresh() {
    readState();
    render(calculate(state));
    updateUrl();
  }

  $$("[data-cmc]").forEach((el) => {
    el.addEventListener("input", refresh);
    el.addEventListener("change", refresh);
    if (moneyKeys.includes(el.dataset.cmc)) {
      el.addEventListener("blur", () => {
        el.value = number(el.value).toLocaleString("ko-KR");
      });
      el.addEventListener("focus", () => {
        el.value = String(number(el.value));
      });
    }
  });

  $$("[data-cmc-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      const preset = cfg.presets.find((item) => item.id === button.dataset.cmcPreset);
      if (!preset) return;
      state = { ...initialState, ...preset.input };
      Object.entries(state).forEach(([key, value]) => setControl(key, value));
      $$("[data-cmc-preset]").forEach((item) => item.setAttribute("aria-pressed", "false"));
      button.setAttribute("aria-pressed", "true");
      refresh();
    });
  });

  $("#cmcResetBtn")?.addEventListener("click", () => {
    state = { ...initialState };
    Object.entries(state).forEach(([key, value]) => setControl(key, value));
    refresh();
  });

  $("#cmcCopyBtn")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      const btn = $("#cmcCopyBtn");
      if (btn) {
        const prev = btn.textContent;
        btn.textContent = "복사 완료";
        setTimeout(() => {
          btn.textContent = prev;
        }, 1400);
      }
    } catch {
      window.prompt("현재 계산 링크를 복사하세요.", location.href);
    }
  });

  Object.entries(state).forEach(([key, value]) => setControl(key, value));
  restoreFromUrl();
  refresh();
})();
