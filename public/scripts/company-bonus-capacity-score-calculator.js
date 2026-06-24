(() => {
  const root = document.querySelector(".cbc-page");
  const dataEl = document.getElementById("cbc-data");
  if (!root || !dataEl) return;

  const cfg = JSON.parse(dataEl.textContent || "{}");
  const companies = cfg.companies || [];
  const industries = cfg.industries || [];
  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => Array.from(root.querySelectorAll(selector));

  let mode = "preset";

  const initialState = {
    companyId: cfg.defaultCompanyId,
    customName: "우리 회사",
    industry: "semiconductor",
    revenue: 3_336_059,
    operatingProfit: 436_011,
    previousOperatingProfit: 327_300,
    employeeCount: 125_000,
    previousBonusRate: 47,
    outlook: "up",
    annualSalary: 7_000,
    baseSalaryRatio: 70,
  };
  let state = { ...initialState };

  const numberKeys = ["revenue", "operatingProfit", "previousOperatingProfit", "employeeCount", "previousBonusRate", "annualSalary", "baseSalaryRatio"];

  function num(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? Math.max(parsed, 0) : fallback;
  }

  // 영업이익은 적자(음수)가 실제로 존재하므로 0으로 clamp하지 않는다.
  function numSigned(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function formatEok(value) {
    return `${Math.round(value).toLocaleString("ko-KR")}억 원`;
  }

  function formatManwon(value) {
    if (value >= 10000) {
      const eok = Math.floor(value / 10000);
      const man = Math.round(value % 10000);
      return man > 0 ? `${eok}억 ${man.toLocaleString("ko-KR")}만 원` : `${eok}억 원`;
    }
    return `${Math.round(value).toLocaleString("ko-KR")}만 원`;
  }

  function formatPercent(value) {
    return `${value.toFixed(1)}%`;
  }

  function getIndustry(industryId) {
    return industries.find((i) => i.industry === industryId) || null;
  }

  function getCompany(companyId) {
    return companies.find((c) => c.id === companyId) || null;
  }

  function scoreProfitGrowth(rate) {
    if (rate >= 300) return 30;
    if (rate >= 100) return 24;
    if (rate >= 30) return 18;
    if (rate >= 0) return 12;
    if (rate >= -30) return 6;
    return 0;
  }

  function scoreMargin(margin, industryAverageMargin) {
    if (!industryAverageMargin || industryAverageMargin <= 0) return margin > 0 ? 12 : 0;
    const relative = margin / industryAverageMargin;
    if (relative >= 1.5) return 25;
    if (relative >= 1.2) return 21;
    if (relative >= 0.9) return 16;
    if (relative >= 0.6) return 10;
    if (relative > 0) return 5;
    return 0;
  }

  function scoreProfitPerEmployee(valueEok, industryAverageEok) {
    if (!industryAverageEok || industryAverageEok <= 0) return valueEok > 0 ? 9 : 0;
    const relative = valueEok / industryAverageEok;
    if (relative >= 1.5) return 20;
    if (relative >= 1.2) return 17;
    if (relative >= 0.9) return 13;
    if (relative >= 0.6) return 9;
    if (relative > 0) return 5;
    return 0;
  }

  function scorePreviousBonus(rate) {
    if (rate >= 50) return 15;
    if (rate >= 30) return 12;
    if (rate >= 10) return 8;
    if (rate > 0) return 4;
    return 0;
  }

  function scoreOutlook(outlook) {
    return { "strong-up": 10, up: 8, flat: 5, down: 2, weak: 0 }[outlook] ?? 5;
  }

  function getScoreLabel(score) {
    if (score >= 80) return "성과급 체력 매우 높음";
    if (score >= 60) return "성과급 가능성 높음";
    if (score >= 40) return "보통";
    if (score >= 20) return "제한적";
    return "낮음";
  }

  function getScoreMessage(score) {
    if (score >= 80) return "실적과 이익률이 모두 강해 성과급 기대가 큰 구간입니다.";
    if (score >= 60) return "영업이익 개선이 확인되며 전년보다 성과급 기대가 높아질 수 있습니다.";
    if (score >= 40) return "실적은 나쁘지 않지만 성과급 확대를 확신하기는 어려운 구간입니다.";
    if (score >= 20) return "이익률이나 증가율이 약해 성과급 기대를 낮춰 잡는 편이 안전합니다.";
    return "영업이익 체력이 약하거나 적자 구간이면 성과급 기대가 낮습니다.";
  }

  function performanceMultiplier(rate) {
    if (rate >= 300) return 1.8;
    if (rate >= 100) return 1.5;
    if (rate >= 30) return 1.25;
    if (rate >= 0) return 1.05;
    if (rate >= -30) return 0.75;
    return 0.4;
  }

  function outlookMultiplier(outlook) {
    return { "strong-up": 1.15, up: 1.08, flat: 1.0, down: 0.85, weak: 0.65 }[outlook] ?? 1.0;
  }

  function netRateFor(grossManwon) {
    if (grossManwon <= 500) return 0.88;
    if (grossManwon <= 1500) return 0.82;
    if (grossManwon <= 3000) return 0.76;
    return 0.7;
  }

  function calculate(s) {
    const invalid = s.revenue <= 0 || s.operatingProfit === 0 && s.previousOperatingProfit === 0 || s.employeeCount <= 0;
    const industry = getIndustry(s.industry);

    const operatingMargin = s.revenue > 0 ? (s.operatingProfit / s.revenue) * 100 : 0;
    // 분모를 절대값으로 둬서 "전년도 적자(음수)"인 경우에도 일반화된다.
    // 예: 전년 -25,000 → 올해 -17,224 (적자 축소)면 +31.1%로 정상 평가되고,
    // 전년 -1,000 → 올해 +500 (흑자 전환)이면 +150%로 큰 개선으로 평가된다.
    const operatingProfitGrowthRate =
      s.previousOperatingProfit !== 0
        ? ((s.operatingProfit - s.previousOperatingProfit) / Math.abs(s.previousOperatingProfit)) * 100
        : s.operatingProfit > 0
          ? 300
          : 0;
    const operatingProfitPerEmployeeEok = s.employeeCount > 0 ? s.operatingProfit / s.employeeCount : 0;

    const marginVsIndustry = industry && industry.averageOperatingMargin > 0 ? operatingMargin / industry.averageOperatingMargin : 0;
    const profitPerEmployeeVsIndustry = industry && industry.averageProfitPerEmployeeEok > 0 ? operatingProfitPerEmployeeEok / industry.averageProfitPerEmployeeEok : 0;

    const breakdown = {
      profitGrowth: scoreProfitGrowth(operatingProfitGrowthRate),
      margin: scoreMargin(operatingMargin, industry ? industry.averageOperatingMargin : 0),
      profitPerEmployee: scoreProfitPerEmployee(operatingProfitPerEmployeeEok, industry ? industry.averageProfitPerEmployeeEok : 0),
      previousBonus: scorePreviousBonus(s.previousBonusRate),
      outlook: scoreOutlook(s.outlook),
    };
    const total = breakdown.profitGrowth + breakdown.margin + breakdown.profitPerEmployee + breakdown.previousBonus + breakdown.outlook;

    let expectedBonusRate = s.previousBonusRate * performanceMultiplier(operatingProfitGrowthRate) * outlookMultiplier(s.outlook);
    expectedBonusRate = Math.min(Math.max(expectedBonusRate, 0), 200);
    if (s.operatingProfit < 0) expectedBonusRate = Math.min(expectedBonusRate, 20);

    const baseSalaryManwon = (s.annualSalary * s.baseSalaryRatio) / 100;
    const grossBonusManwon = (baseSalaryManwon * expectedBonusRate) / 100;
    const netBonusManwon = grossBonusManwon * netRateFor(grossBonusManwon);
    const monthlyEquivalentManwon = netBonusManwon / 12;

    const insights = [];
    if (marginVsIndustry >= 1.2) insights.push("같은 업종 평균보다 이익률이 높아 성과급 체력에 강하게 기여합니다.");
    if (operatingProfitGrowthRate >= 100) insights.push("전년 대비 실적 개선폭이 커 성과급 기대를 높이는 요인입니다.");
    if (profitPerEmployeeVsIndustry >= 1.2) insights.push("같은 업종 안에서 직원 1인당 이익 창출력이 높아 보상 여력 지표가 강합니다.");
    if (s.previousBonusRate === 0) insights.push("전년도 지급 이력이 약하면 올해 실적이 좋아도 실제 지급률은 보수적일 수 있습니다.");
    if (s.operatingProfit < 0) insights.push("적자 구간에서는 성과급보다 격려금 또는 일회성 보상 성격일 수 있습니다.");
    if (insights.length === 0) insights.push("실적 지표가 업종 평균과 비슷한 수준으로, 평이한 성과급 체력 구간입니다.");

    const warnings = [];
    if (s.revenue <= 0) warnings.push("매출을 입력해야 정확한 계산이 가능합니다.");
    if (s.employeeCount <= 0) warnings.push("직원 수를 입력해야 직원 1인당 영업이익을 계산할 수 있습니다.");

    return {
      score: invalid ? 0 : Math.round(total),
      scoreLabel: invalid ? "-" : getScoreLabel(total),
      scoreMessage: invalid ? "" : getScoreMessage(total),
      expectedBonusRate,
      grossBonusManwon,
      netBonusManwon,
      monthlyEquivalentManwon,
      operatingMargin,
      operatingProfitGrowthRate,
      operatingProfitPerEmployeeEok,
      marginVsIndustry,
      profitPerEmployeeVsIndustry,
      breakdown,
      warnings,
      insights,
      invalid,
    };
  }

  function setControl(key, value) {
    const el = $(`[data-cbc="${key}"]`);
    if (!el) return;
    if (numberKeys.includes(key)) el.value = Number(value || 0).toLocaleString("ko-KR");
    else el.value = String(value);
  }

  function readState() {
    const signedKeys = ["operatingProfit", "previousOperatingProfit"];
    numberKeys.forEach((key) => {
      const el = $(`[data-cbc="${key}"]`);
      if (!el) return;
      state[key] = signedKeys.includes(key) ? numSigned(el.value, initialState[key] || 0) : num(el.value, initialState[key] || 0);
    });
    state.industry = $('[data-cbc="industry"]')?.value || state.industry;
    state.outlook = $('[data-cbc="outlook"]')?.value || state.outlook;
    if (mode === "preset") {
      state.companyId = $('[data-cbc="companyId"]')?.value || state.companyId;
    } else {
      state.customName = $('[data-cbc="customName"]')?.value || state.customName;
    }
  }

  function applyCompanyPreset(companyId) {
    const company = getCompany(companyId);
    if (!company) return;
    state = {
      ...state,
      companyId,
      industry: company.industry,
      revenue: company.revenueEok,
      operatingProfit: company.operatingProfitEok,
      previousOperatingProfit: company.previousOperatingProfitEok,
      employeeCount: company.employeeCount,
      previousBonusRate: company.previousBonusRate,
      outlook: company.outlook,
    };
    setControl("industry", company.industry);
    setControl("outlook", company.outlook);
    numberKeys.forEach((key) => {
      const map = { revenue: "revenueEok", operatingProfit: "operatingProfitEok", previousOperatingProfit: "previousOperatingProfitEok", employeeCount: "employeeCount", previousBonusRate: "previousBonusRate" };
      if (map[key] && company[map[key]] !== undefined) setControl(key, company[map[key]]);
    });
    const noteEl = $("[data-cbc-data-note]");
    if (noteEl) {
      const basisLabel = { base: "기본급", monthly: "월급", annual: "연봉" }[company.bonusRateBasis] || "기본급";
      noteEl.textContent = `${company.dataConfidence} · ${company.dataAsOf} · 전년 성과급률은 ${basisLabel} 기준 보도. ${company.dataNote}`.trim();
    }
  }

  function setMode(nextMode) {
    mode = nextMode;
    $$("[data-cbc-mode]").forEach((btn) => btn.classList.toggle("is-active", btn.getAttribute("data-cbc-mode") === nextMode));
    $$("[data-cbc-mode-panel]").forEach((panel) => {
      panel.hidden = panel.getAttribute("data-cbc-mode-panel") !== nextMode;
    });
  }

  function renderPeerTable() {
    const body = $("[data-cbc-peer-body]");
    if (!body) return;
    const peers = companies.filter((c) => c.industry === state.industry);
    body.innerHTML = peers
      .map((c) => {
        const margin = c.revenueEok > 0 ? (c.operatingProfitEok / c.revenueEok) * 100 : 0;
        const perEmployee = c.employeeCount > 0 ? c.operatingProfitEok / c.employeeCount : 0;
        const isActive = mode === "preset" && c.id === state.companyId;
        return `<tr class="${isActive ? "is-active" : ""}"><td>${c.name}</td><td>${margin.toFixed(1)}%</td><td>${perEmployee.toFixed(2)}억 원</td><td>${c.previousBonusRate}%</td></tr>`;
      })
      .join("");
  }

  function render(result) {
    const scoreEl = $('[data-cbc-result="score"]');
    if (scoreEl) scoreEl.textContent = result.invalid ? "-" : String(result.score);
    $('[data-cbc-result="scoreLabel"]').textContent = result.scoreLabel;
    $('[data-cbc-result="scoreMessage"]').textContent = result.scoreMessage;
    $("[data-cbc-result='scoreBar']").style.width = `${Math.min(Math.max(result.score, 0), 100)}%`;
    $("[data-cbc-invalid]").hidden = !result.invalid;

    $('[data-cbc-result="expectedBonusRate"]').textContent = result.invalid ? "-" : `약 ${formatPercent(result.expectedBonusRate)}`;
    $('[data-cbc-result="grossBonus"]').textContent = result.invalid ? "-" : formatManwon(result.grossBonusManwon);
    $('[data-cbc-result="netBonus"]').textContent = result.invalid ? "-" : formatManwon(result.netBonusManwon);
    $('[data-cbc-result="monthlyEquivalent"]').textContent = result.invalid ? "-" : formatManwon(result.monthlyEquivalentManwon);

    const breakdownMax = { profitGrowth: 30, margin: 25, profitPerEmployee: 20, previousBonus: 15, outlook: 10 };
    Object.entries(breakdownMax).forEach(([key, max]) => {
      const row = $(`[data-cbc-breakdown="${key}"]`);
      if (!row) return;
      const value = result.invalid ? 0 : result.breakdown[key];
      row.querySelector("i").style.width = `${(value / max) * 100}%`;
      row.querySelector("em").textContent = `${value}/${max}`;
    });

    const marginRel = $('[data-cbc-relative="margin"]');
    if (marginRel) marginRel.textContent = result.invalid ? "" : ` · 업종 평균 대비 ${result.marginVsIndustry.toFixed(1)}배`;
    const perEmployeeRel = $('[data-cbc-relative="profitPerEmployee"]');
    if (perEmployeeRel) perEmployeeRel.textContent = result.invalid ? "" : ` · 업종 평균 대비 ${result.profitPerEmployeeVsIndustry.toFixed(1)}배`;

    const insightsEl = $("[data-cbc-insights]");
    if (insightsEl) {
      insightsEl.innerHTML = result.invalid
        ? ""
        : result.insights.map((text) => `<p class="cbc-insight">${text}</p>`).join("");
    }

    renderPeerTable();
  }

  function refresh() {
    readState();
    const result = calculate(state);
    render(result);
  }

  $$("[data-cbc-mode]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setMode(btn.getAttribute("data-cbc-mode"));
      refresh();
    });
  });

  $('[data-cbc="companyId"]')?.addEventListener("change", (e) => {
    applyCompanyPreset(e.target.value);
    refresh();
  });

  $$("[data-cbc]").forEach((el) => {
    el.addEventListener("input", refresh);
    el.addEventListener("change", refresh);
  });

  $("#cbcResetBtn")?.addEventListener("click", () => {
    state = { ...initialState };
    setMode("preset");
    Object.entries(state).forEach(([key, value]) => setControl(key, value));
    applyCompanyPreset(state.companyId);
    refresh();
  });

  $("#cbcCopyBtn")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      $("#cbcCopyBtn").textContent = "링크 복사 완료";
      setTimeout(() => {
        $("#cbcCopyBtn").textContent = "링크 복사";
      }, 1600);
    } catch {
      $("#cbcCopyBtn").textContent = "복사 실패";
    }
  });

  applyCompanyPreset(state.companyId);
  refresh();
})();
