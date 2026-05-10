(() => {
  const root = document.querySelector("[data-era-root]");
  if (!root) return;

  const won = new Intl.NumberFormat("ko-KR");
  const fields = [...root.querySelectorAll("[data-era-input]")];
  const out = (key) => document.querySelector(`[data-era-output="${key}"]`);

  function num(value) {
    return Math.max(0, Number(String(value).replace(/[^\d.]/g, "")) || 0);
  }

  function money(value) {
    if (!Number.isFinite(value)) return "-";
    if (value >= 100000000) return `${(value / 100000000).toFixed(1).replace(".0", "")}억원`;
    return `${won.format(Math.round(value / 10000))}만원`;
  }

  function period(months) {
    if (months === null) return "도달 어려움";
    return `${Math.floor(months / 12)}년 ${months % 12}개월`;
  }

  function retirementAgeLabel(age) {
    return age === null ? "도달 어려움" : `만 ${Math.floor(age)}세`;
  }

  function read() {
    const data = {};
    fields.forEach((field) => {
      data[field.dataset.eraInput] = field.value;
    });
    return {
      currentAge: num(data.currentAge),
      income: num(data.income),
      expense: num(data.expense),
      assets: num(data.assets),
      returnRate: num(data.returnRate),
      retireExpense: num(data.retireExpense),
      withdrawal: Math.max(0.1, num(data.withdrawal)),
      pension: num(data.pension),
      passive: num(data.passive),
      margin: num(data.margin),
    };
  }

  function monthsToTarget(input, target) {
    if (input.assets >= target) return 0;
    const saving = input.income - input.expense;
    if (saving <= 0) return null;
    const monthlyRate = (1 + input.returnRate / 100) ** (1 / 12) - 1;
    let assets = input.assets;
    for (let month = 1; month <= 1200; month += 1) {
      assets = assets * (1 + monthlyRate) + saving;
      if (assets >= target) return month;
    }
    return null;
  }

  function calculate(input) {
    const saving = input.income - input.expense;
    const savingRate = input.income > 0 ? (saving / input.income) * 100 : 0;
    const netRetireExpense = Math.max(input.retireExpense - input.pension - input.passive, 0);
    const required = (netRetireExpense * 12) / (input.withdrawal / 100) * (1 + input.margin / 100);
    const months = monthsToTarget(input, required);
    const gap = Math.max(required - input.assets, 0);
    return { saving, savingRate, required, gap, months, age: months === null ? null : input.currentAge + months / 12 };
  }

  function scenarioRows(input) {
    return [
      {
        name: "현행 유지",
        input,
        note: "현재 소득·지출·수익률 유지",
      },
      {
        name: "지출 10% 절감",
        input: { ...input, expense: input.expense * 0.9, retireExpense: input.retireExpense * 0.9 },
        note: "월 저축액 증가와 필요자산 감소가 동시에 반영",
      },
      {
        name: "수익률 1%p 상승",
        input: { ...input, returnRate: input.returnRate + 1 },
        note: "장기 복리 개선 효과만 반영",
      },
      {
        name: "지출 절감 + 수익률 개선",
        input: { ...input, expense: input.expense * 0.9, retireExpense: input.retireExpense * 0.9, returnRate: input.returnRate + 1 },
        note: "생활비와 운용 효율을 함께 개선한 경우",
      },
    ].map((scenario) => ({ ...scenario, result: calculate(scenario.input) }));
  }

  function renderScenarios(input) {
    const body = document.querySelector("[data-era-scenarios]");
    if (!body) return;
    body.replaceChildren();

    scenarioRows(input).forEach((scenario) => {
      const row = document.createElement("tr");
      [
        scenario.name,
        retirementAgeLabel(scenario.result.age),
        period(scenario.result.months),
        money(scenario.result.required),
        money(scenario.result.saving),
        scenario.note,
      ].forEach((value) => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      });
      body.appendChild(row);
    });
  }

  function render() {
    const input = read();
    const result = calculate(input);
    out("age").textContent = retirementAgeLabel(result.age);
    out("years").textContent = result.months === null ? "저축 여력 필요" : period(result.months);
    out("required").textContent = money(result.required);
    out("gap").textContent = money(result.gap);
    out("saving").textContent = money(result.saving);
    out("rate").textContent = `${result.savingRate.toFixed(1)}%`;
    out("message").textContent = result.months === null
      ? "현재 월 저축액이 0원 이하라 목표 은퇴자산 도달이 어렵습니다. 지출 조정이나 추가 소득을 먼저 점검하세요."
      : `현재 조건이 유지되면 약 ${Math.floor(result.months / 12)}년 뒤 목표 은퇴자산에 도달하는 것으로 추정됩니다.`;
    renderScenarios(input);
  }

  root.addEventListener("input", render);
  root.addEventListener("change", render);
  document.getElementById("resetEraBtn")?.addEventListener("click", () => location.reload());
  document.getElementById("copyEraLinkBtn")?.addEventListener("click", () => navigator.clipboard?.writeText(location.href));
  render();
})();
