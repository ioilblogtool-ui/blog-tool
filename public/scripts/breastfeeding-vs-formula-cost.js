(() => {
  const dataEl = document.getElementById("bvf-data");
  if (!dataEl) return;

  const DATA = JSON.parse(dataEl.textContent || "{}");
  const state = {
    method: "formula",
    currentAge: 0,
    formulaGrade: "standard",
    pumpOption: "none",
    includeSupplies: true,
  };

  let chart = null;

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const fmt = (value) => Math.round(value).toLocaleString("ko-KR");
  const won = (value) => `${fmt(value)}원`;
  const man = (value) => {
    const rounded = Math.round(value / 1000) * 1000;
    if (Math.abs(rounded) >= 100000) return `${Math.round(rounded / 10000).toLocaleString("ko-KR")}만원`;
    return won(rounded);
  };

  function readInputs() {
    state.method = $('[data-bvf-input="method"]:checked')?.value || "formula";
    state.currentAge = Number($('[data-bvf-input="age"]')?.value || 0);
    state.formulaGrade = $('[data-bvf-input="grade"]:checked')?.value || "standard";
    state.pumpOption = $('[data-bvf-input="pump"]:checked')?.value || "none";
    state.includeSupplies = Boolean($('[data-bvf-input="supplies"]')?.checked);

    if (state.method === "formula") {
      state.pumpOption = "none";
      state.includeSupplies = false;
      const none = $('[data-bvf-input="pump"][value="none"]');
      if (none) none.checked = true;
      const supplies = $('[data-bvf-input="supplies"]');
      if (supplies) supplies.checked = false;
    }
  }

  function formulaMonthlyCost(age, grade) {
    const daily = DATA.DAILY_FORMULA_GRAMS[String(age)] ?? DATA.DAILY_FORMULA_GRAMS[age] ?? 48;
    const monthlyGrams = daily * 30;
    return {
      monthlyGrams,
      cost: (monthlyGrams / DATA.CAN_GRAMS) * DATA.FORMULA_PRICE[grade],
    };
  }

  function calculate(s) {
    const pump = DATA.PUMP_COST[s.method === "formula" ? "none" : s.pumpOption];
    const supplies = s.method === "formula" ? 0 : s.includeSupplies ? DATA.SUPPLIES_MONTHLY : 0;
    const monthly = [];
    let totalBreast = pump.initial;
    let totalMixed = s.method === "formula" ? 0 : pump.initial;
    let totalFormula = 0;
    let totalFormulaGrams = 0;

    for (let age = 0; age < 12; age += 1) {
      const formula = formulaMonthlyCost(age, s.formulaGrade);
      const isActive = age >= s.currentAge;
      const breastCost = supplies + pump.monthly;
      const mixedCost = formula.cost * DATA.MIXED_FORMULA_RATIO + supplies + pump.monthly;
      const formulaCost = formula.cost;

      if (isActive) {
        totalBreast += breastCost;
        totalMixed += mixedCost;
        totalFormula += formulaCost;
        totalFormulaGrams += formula.monthlyGrams;
      }

      monthly.push({
        age,
        isActive,
        breastCost,
        mixedCost,
        formulaCost,
        formulaGrams: formula.monthlyGrams,
      });
    }

    let breakEvenMonth = null;
    if (pump.initial > 0) {
      let runningBreast = pump.initial;
      let runningFormula = 0;
      for (const row of monthly.filter((item) => item.isActive)) {
        runningBreast += row.breastCost;
        runningFormula += row.formulaCost;
        if (runningFormula >= runningBreast) {
          breakEvenMonth = row.age - s.currentAge + 1;
          break;
        }
      }
    }

    return {
      monthly,
      totalBreast,
      totalMixed,
      totalFormula,
      totalFormulaGrams,
      formulaCanCount: Math.ceil(totalFormulaGrams / DATA.CAN_GRAMS),
      breakEvenMonth,
      savings: totalFormula - totalBreast,
      monthsLeft: Math.max(0, 12 - s.currentAge),
      pump,
    };
  }

  function breakEvenText(result, s) {
    if (s.method === "formula" || s.pumpOption === "none") {
      return { value: "초기비용 없음", note: "유축기 비용 제외" };
    }
    if (s.pumpOption === "rental") {
      return { value: "렌탈형", note: "월 비용이 계속 발생" };
    }
    if (!result.breakEvenMonth) {
      return { value: "회수 어려움", note: "남은 기간 내 역전 없음" };
    }
    return { value: `${result.breakEvenMonth}개월`, note: "구매 후 누적 기준" };
  }

  function renderKpis(result, s) {
    $("#bvfSavings").textContent = result.savings >= 0 ? `${man(result.savings)} 절감` : `${man(Math.abs(result.savings))} 추가`;
    $("#bvfFormulaTotal").textContent = man(result.totalFormula);
    $("#bvfBreastTotal").textContent = man(result.totalBreast);
    const be = breakEvenText(result, s);
    $("#bvfBreakEven").textContent = be.value;
    $("#bvfBreakEvenNote").textContent = be.note;
    $("#bvfFormulaGrams").textContent = `${fmt(result.totalFormulaGrams)}g`;
    $("#bvfFormulaCans").textContent = `${fmt(result.formulaCanCount)}캔`;
    $("#bvfResultSub").textContent = `${s.currentAge}개월부터 돌 전까지 ${result.monthsLeft}개월 기준입니다.`;
  }

  function renderMessage(result, s) {
    const gradeLabel = DATA.FORMULA_GRADE_LABEL[s.formulaGrade] || "분유";
    const selectedLabel = s.method === "breast" ? "완전 모유수유" : s.method === "mixed" ? "혼합 수유" : "완전 분유";
    const selectedCost = s.method === "breast" ? result.totalBreast : s.method === "mixed" ? result.totalMixed : result.totalFormula;
    $("#bvfResultTitle").textContent = `${selectedLabel} 기준 ${man(selectedCost)}`;
    $("#bvfMessage").textContent =
      `${gradeLabel} 완분 기준 남은 ${result.monthsLeft}개월 분유 비용은 약 ${man(result.totalFormula)}입니다. ` +
      `같은 기간 완모 비용은 약 ${man(result.totalBreast)}로, 조건상 ${result.savings >= 0 ? man(result.savings) + " 절감 가능" : man(Math.abs(result.savings)) + " 더 들 수 있음"}으로 계산됩니다.`;
  }

  function renderTable(result) {
    const rows = result.monthly.map((row) => `
      <tr class="${row.isActive ? "" : "is-past"}">
        <td>${row.age}개월${row.isActive ? "" : " <span>제외</span>"}</td>
        <td class="col-breast">${won(row.breastCost)}</td>
        <td class="col-mixed">${won(row.mixedCost)}</td>
        <td class="col-formula">${won(row.formulaCost)}</td>
        <td>${fmt(row.formulaGrams)}g</td>
      </tr>
    `);
    rows.push(`
      <tr class="is-total">
        <td>합계</td>
        <td class="col-breast">${won(result.totalBreast)}</td>
        <td class="col-mixed">${won(result.totalMixed)}</td>
        <td class="col-formula">${won(result.totalFormula)}</td>
        <td>${fmt(result.totalFormulaGrams)}g</td>
      </tr>
    `);
    $("#bvfMonthlyRows").innerHTML = rows.join("");
  }

  function renderChart(result, s) {
    const canvas = $("#bvfChart");
    if (!canvas || !window.Chart) return;

    const activeRows = result.monthly.filter((row) => row.isActive);
    const labels = ["시작", ...activeRows.map((row) => `${row.age}개월`)];
    const breast = [result.pump.initial];
    const mixed = [s.method === "formula" ? 0 : result.pump.initial];
    const formula = [0];

    activeRows.forEach((row) => {
      breast.push(breast[breast.length - 1] + row.breastCost);
      mixed.push(mixed[mixed.length - 1] + row.mixedCost);
      formula.push(formula[formula.length - 1] + row.formulaCost);
    });

    if (chart) chart.destroy();
    chart = new Chart(canvas, {
      type: "line",
      data: {
        labels,
        datasets: [
          { label: "완모", data: breast, borderColor: "#0F6E56", backgroundColor: "#0F6E5630", tension: 0.28 },
          { label: "혼합", data: mixed, borderColor: "#B45309", backgroundColor: "#B4530930", tension: 0.28 },
          { label: "완분", data: formula, borderColor: "#1A56DB", backgroundColor: "#1A56DB30", tension: 0.28 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom" },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${won(ctx.raw)}`,
            },
          },
        },
        scales: {
          y: {
            ticks: { callback: (value) => `${Math.round(Number(value) / 10000)}만` },
            grid: { color: "#F0EFED" },
          },
          x: { grid: { display: false } },
        },
      },
    });
  }

  function toggleGroups(method) {
    const grade = $('[data-bvf-group="grade"]');
    const pump = $('[data-bvf-group="pump"]');
    grade?.classList.toggle("is-disabled", method === "breast");
    pump?.classList.toggle("is-disabled", method === "formula");
  }

  function syncUrl(s) {
    const url = new URL(window.location.href);
    url.searchParams.set("method", s.method);
    url.searchParams.set("age", String(s.currentAge));
    url.searchParams.set("grade", s.formulaGrade);
    url.searchParams.set("pump", s.pumpOption);
    url.searchParams.set("supplies", s.includeSupplies ? "1" : "0");
    history.replaceState(null, "", url.toString());
  }

  function calculateAndRender() {
    readInputs();
    toggleGroups(state.method);
    const result = calculate(state);
    renderKpis(result, state);
    renderMessage(result, state);
    renderTable(result);
    renderChart(result, state);
    syncUrl(state);
  }

  function setRadio(name, value) {
    const input = $(`input[name="${name}"][value="${value}"]`);
    if (input) input.checked = true;
  }

  function applyState(nextState) {
    setRadio("bvf-method", nextState.method);
    setRadio("bvf-grade", nextState.formulaGrade);
    setRadio("bvf-pump", nextState.pumpOption);
    const age = $('[data-bvf-input="age"]');
    const supplies = $('[data-bvf-input="supplies"]');
    if (age) age.value = String(nextState.currentAge);
    if (supplies) supplies.checked = Boolean(nextState.includeSupplies);
    calculateAndRender();
  }

  function restoreFromUrl() {
    const url = new URL(window.location.href);
    const params = {
      method: url.searchParams.get("method"),
      currentAge: Number(url.searchParams.get("age") || 0),
      formulaGrade: url.searchParams.get("grade"),
      pumpOption: url.searchParams.get("pump"),
      includeSupplies: url.searchParams.get("supplies") !== "0",
    };
    if (["breast", "mixed", "formula"].includes(params.method)) state.method = params.method;
    if (params.currentAge >= 0 && params.currentAge <= 11) state.currentAge = params.currentAge;
    if (["standard", "organic", "premium"].includes(params.formulaGrade)) state.formulaGrade = params.formulaGrade;
    if (["none", "buy-electric", "buy-manual", "rental"].includes(params.pumpOption)) state.pumpOption = params.pumpOption;
    state.includeSupplies = params.includeSupplies;
    applyState(state);
  }

  function bindEvents() {
    $$("[data-bvf-input]").forEach((input) => {
      input.addEventListener("input", calculateAndRender);
      input.addEventListener("change", calculateAndRender);
    });

    $$("[data-bvf-preset]").forEach((button) => {
      button.addEventListener("click", () => {
        const preset = DATA.PRESETS.find((item) => item.id === button.dataset.bvfPreset);
        if (!preset) return;
        $$("[data-bvf-preset]").forEach((item) => item.classList.toggle("is-active", item === button));
        applyState(preset);
      });
    });

    $("#resetBvfBtn")?.addEventListener("click", () => {
      $$("[data-bvf-preset]").forEach((item) => item.classList.toggle("is-active", item.dataset.bvfPreset === "preset-formula-standard"));
      applyState({
        method: "formula",
        currentAge: 0,
        formulaGrade: "standard",
        pumpOption: "none",
        includeSupplies: false,
      });
    });

    $("#copyBvfLinkBtn")?.addEventListener("click", () => {
      syncUrl(state);
      navigator.clipboard?.writeText(window.location.href).then(() => {
        const button = $("#copyBvfLinkBtn");
        const original = button.textContent;
        button.textContent = "링크 복사 완료";
        setTimeout(() => {
          button.textContent = original;
        }, 1400);
      });
    });
  }

  bindEvents();
  restoreFromUrl();
})();
