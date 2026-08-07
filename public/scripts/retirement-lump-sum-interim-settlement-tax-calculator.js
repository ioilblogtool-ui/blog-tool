(() => {
  const root = document.querySelector("[data-rist-root]");
  const configNode = document.getElementById("ristConfig");
  if (!root || !configNode) return;

  const config = JSON.parse(configNode.textContent || "{}");
  const state = { ...(config.defaultInput || {}) };
  const won = new Intl.NumberFormat("ko-KR");
  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const input = (name) => root.querySelector(`[data-rist="${name}"]`);
  const output = (name) => document.querySelector(`[data-rist-output="${name}"]`);

  function parseNumber(value) {
    return Number(String(value ?? "").replace(/[^\d.-]/g, "")) || 0;
  }

  function formatWon(value) {
    return `${won.format(Math.round(Number(value || 0)))}원`;
  }

  function formatSignedWon(value) {
    const amount = Math.round(Number(value || 0));
    if (Math.abs(amount) < 1) return "차이 없음";
    return `${amount >= 0 ? "+" : "-"}${won.format(Math.abs(amount))}원`;
  }

  function formatPercent(value, digits = 2) {
    return `${Number(value || 0).toFixed(digits)}%`;
  }

  function setText(name, value) {
    const el = output(name);
    if (el) el.textContent = value;
  }

  function getReason(id) {
    return (config.reasons || []).find((item) => item.id === id) || config.reasons?.[0];
  }

  // ─── 근속연수·세액 계산 ───────────────────────────────────────
  function calcServiceYears(startStr, endStr) {
    const start = new Date(startStr);
    const end = new Date(endStr);
    const days = (end - start) / MS_PER_DAY;
    return Math.max(0, days / 365.25);
  }

  function getServiceYearDeduction(years) {
    const tier = (config.serviceYearTiers || []).find((t) => years <= t.maxYears);
    return tier ? tier.base + tier.perYear * (years - tier.fromYear) : 0;
  }

  function getConvertedIncomeDeduction(income) {
    const tier = (config.convertedIncomeTiers || []).find((t) => income <= t.maxIncome);
    return tier ? tier.base + tier.rate * (income - tier.fromIncome) : 0;
  }

  function findTaxBracket(base) {
    const brackets = config.taxBrackets || [];
    return brackets.find((b) => base <= b.limit) || brackets[brackets.length - 1];
  }

  function calcRetirementTax(totalPay, rawServiceYears) {
    const years = Math.max(1, Math.ceil(rawServiceYears));
    const serviceDeduction = getServiceYearDeduction(years);
    const convertedIncome = (Math.max(0, totalPay - serviceDeduction) * 12) / years;
    const convertedDeduction = getConvertedIncomeDeduction(convertedIncome);
    const taxBase = Math.max(0, convertedIncome - convertedDeduction);
    const bracket = findTaxBracket(taxBase);
    const convertedTax = Math.max(0, taxBase * bracket.rate - bracket.cumDed);
    const calculatedTax = (convertedTax * years) / 12;
    const localTax = calculatedTax * 0.1;
    const totalTax = calculatedTax + localTax;

    return {
      totalPay,
      years,
      serviceDeduction,
      convertedIncome,
      convertedDeduction,
      taxBase,
      bracketLabel: bracket.label,
      convertedTax,
      calculatedTax,
      localTax,
      totalTax,
    };
  }

  // ─── 두 시나리오 비교 (총세금 기준) ─────────────────────────────
  // 시나리오 A(noInterim): 중간정산 없이 전체 근속기간·급여를 한 번에 받았다고 가정
  // 시나리오 B-분리과세(totalSeparate): 중간정산분 + 이후 퇴직분을 각각 계산해 합산
  //   (이후 퇴직분은 정산일부터 근속연수가 다시 0에서 시작된다고 보고 별도 계산)
  // 시나리오 B-세액정산(totalSettled): 최종 퇴직 시 이전 퇴직소득을 합산 재정산 →
  //   정의상 noInterim과 총세금이 같아지고, 이미 낸 세금(interim)을 뺀 나머지를 최종 퇴직 시 추가 납부
  function calculate(s) {
    const serviceYearsAtSettlement = calcServiceYears(s.hireDate, s.settlementDate);
    const remainingYearsRaw = calcServiceYears(s.settlementDate, s.futureRetireDate);
    const totalServiceYears = calcServiceYears(s.hireDate, s.futureRetireDate);
    const remainingPay = Math.max(0, s.futureTotalPay - s.settlementAmount);

    const interim = calcRetirementTax(s.settlementAmount, serviceYearsAtSettlement);
    const remaining = calcRetirementTax(remainingPay, remainingYearsRaw);
    const noInterim = calcRetirementTax(s.futureTotalPay, totalServiceYears);

    const totalSeparate = interim.totalTax + remaining.totalTax;
    const totalSettled = noInterim.totalTax;
    const additionalDueAtFinalRetirement = Math.max(0, totalSettled - interim.totalTax);

    const diffNotApplied = totalSeparate - noInterim.totalTax;
    const diffApplied = totalSettled - noInterim.totalTax; // 정의상 항상 0

    return {
      reasonEligible: s.reason !== "none",
      interim,
      interimNetAmount: s.settlementAmount - interim.totalTax,
      remaining,
      noInterim,
      totalSeparate,
      totalSettled,
      additionalDueAtFinalRetirement,
      diffNotApplied,
      diffApplied,
      percentNotApplied: s.futureTotalPay > 0 ? (diffNotApplied / s.futureTotalPay) * 100 : 0,
    };
  }

  function getVerdict(result, option) {
    if (option === "applied") {
      return { tone: "neutral", label: "세액정산 적용 시 총세금 차이가 없습니다" };
    }
    if (option === "unknown") {
      return { tone: "unknown", label: "세액정산 적용 여부에 따라 결과가 달라집니다" };
    }
    if (result.diffNotApplied > 10000) return { tone: "unfavorable", label: "세금만 보면 다소 불리할 수 있습니다" };
    if (result.diffNotApplied < -10000) return { tone: "favorable", label: "세금만 보면 다소 유리할 수 있습니다" };
    return { tone: "neutral", label: "세금 차이가 거의 없습니다" };
  }

  // ─── 렌더링 ────────────────────────────────────────────────
  function renderReasonWarning(result) {
    const el = output("reasonWarning");
    if (!el) return;
    el.hidden = result.reasonEligible;
  }

  function renderVerdict(result, s) {
    const verdict = getVerdict(result, s.taxSettlementOption);
    const badge = output("verdictBadge");
    if (badge) {
      badge.textContent = verdict.label;
      badge.dataset.tone = verdict.tone;
    }

    setText("summaryInterimNet", formatWon(result.interimNetAmount));
    setText("summaryInterimTax", formatWon(result.interim.totalTax));

    let longTermText;
    if (s.taxSettlementOption === "applied") {
      longTermText = "0원 (계속근무와 동일)";
    } else if (s.taxSettlementOption === "not-applied") {
      longTermText = formatSignedWon(result.diffNotApplied);
    } else {
      longTermText = `분리과세 시 ${formatSignedWon(result.diffNotApplied)}`;
    }
    setText("summaryLongTermImpact", longTermText);

    const longTermCard = output("summaryLongTermImpact")?.closest("[data-rist-tone]");
    if (longTermCard) {
      longTermCard.dataset.tone = verdict.tone;
    }

    let guidance;
    if (s.taxSettlementOption === "applied") {
      guidance = `최종 퇴직 시 퇴직소득 세액정산을 적용하면 총세금은 중간정산을 하지 않았을 때(${formatWon(
        result.noInterim.totalTax
      )})와 같아집니다. 지금은 ${formatWon(result.interim.totalTax)}을 내고, 최종 퇴직 시 약 ${formatWon(
        result.additionalDueAtFinalRetirement
      )}을 추가로 정산하게 됩니다.`;
    } else {
      const pctText = formatPercent(Math.abs(result.percentNotApplied));
      guidance = `세금 차이는 예상 최종 퇴직급여의 약 ${pctText} 수준입니다. ${
        s.taxSettlementOption === "unknown" ? "회사에 세액정산 적용 여부를 확인해보세요. " : ""
      }주택구입·전세보증금·요양비처럼 지금 자금이 꼭 필요한 상황이라면 세금 차이만으로 결정할 필요는 없습니다.`;
    }
    setText("verdictGuidance", guidance);
  }

  function renderTotalTaxChart(result) {
    const maxValue = Math.max(result.noInterim.totalTax, result.totalSeparate, 1);
    const bar1 = output("chartBarNoInterim");
    const bar2 = output("chartBarSeparate");
    if (bar1) bar1.style.width = `${Math.min(100, (result.noInterim.totalTax / maxValue) * 100)}%`;
    if (bar2) bar2.style.width = `${Math.min(100, (result.totalSeparate / maxValue) * 100)}%`;
    setText("chartValueNoInterim", formatWon(result.noInterim.totalTax));
    setText("chartValueSeparate", formatWon(result.totalSeparate));
    setText("chartDiffSeparate", formatSignedWon(result.diffNotApplied));
  }

  function renderCompositionChart(result, s) {
    const total = Math.max(1, s.settlementAmount);
    const netPct = (result.interimNetAmount / total) * 100;
    const incomeTaxPct = (result.interim.calculatedTax / total) * 100;
    const localTaxPct = (result.interim.localTax / total) * 100;

    const netBar = output("compositionNet");
    const incomeTaxBar = output("compositionIncomeTax");
    const localTaxBar = output("compositionLocalTax");
    if (netBar) netBar.style.width = `${Math.max(0, netPct)}%`;
    if (incomeTaxBar) incomeTaxBar.style.width = `${Math.max(0, incomeTaxPct)}%`;
    if (localTaxBar) localTaxBar.style.width = `${Math.max(0, localTaxPct)}%`;

    setText("compositionNetLabel", `실수령액 ${formatPercent(netPct, 1)}`);
    setText("compositionIncomeTaxLabel", `소득세 ${formatPercent(incomeTaxPct, 1)}`);
    setText("compositionLocalTaxLabel", `지방소득세 ${formatPercent(localTaxPct, 1)}`);
  }

  function renderCompare(result) {
    setText("interimYears", `${result.interim.years}년`);
    setText("interimServiceDeduction", formatWon(result.interim.serviceDeduction));
    setText("interimConvertedDeduction", formatWon(result.interim.convertedDeduction));
    setText("continuedYears", `${result.noInterim.years}년`);
    setText("continuedServiceDeduction", formatWon(result.noInterim.serviceDeduction));
    setText("continuedConvertedDeduction", formatWon(result.noInterim.convertedDeduction));
  }

  function renderBreakdown(result) {
    const body = output("breakdownRows");
    if (!body) return;
    const rows = [
      ["퇴직급여", formatWon(result.interim.totalPay), formatWon(result.remaining.totalPay), formatWon(result.noInterim.totalPay)],
      ["근속연수", `${result.interim.years}년`, `${result.remaining.years}년`, `${result.noInterim.years}년`],
      ["근속연수공제", formatWon(result.interim.serviceDeduction), formatWon(result.remaining.serviceDeduction), formatWon(result.noInterim.serviceDeduction)],
      ["환산급여", formatWon(result.interim.convertedIncome), formatWon(result.remaining.convertedIncome), formatWon(result.noInterim.convertedIncome)],
      ["환산급여공제", formatWon(result.interim.convertedDeduction), formatWon(result.remaining.convertedDeduction), formatWon(result.noInterim.convertedDeduction)],
      ["과세표준", formatWon(result.interim.taxBase), formatWon(result.remaining.taxBase), formatWon(result.noInterim.taxBase)],
      ["환산산출세액", formatWon(result.interim.convertedTax), formatWon(result.remaining.convertedTax), formatWon(result.noInterim.convertedTax)],
      ["근속연수 반영 소득세", formatWon(result.interim.calculatedTax), formatWon(result.remaining.calculatedTax), formatWon(result.noInterim.calculatedTax)],
      ["지방소득세", formatWon(result.interim.localTax), formatWon(result.remaining.localTax), formatWon(result.noInterim.localTax)],
      ["총세금", formatWon(result.interim.totalTax), formatWon(result.remaining.totalTax), formatWon(result.noInterim.totalTax)],
    ];
    body.innerHTML = rows
      .map(
        (row, index) => `
      <tr class="${index === rows.length - 1 ? "rist-total-row" : ""}">
        <td>${row[0]}</td>
        <td>${row[1]}</td>
        <td>${row[2]}</td>
        <td>${row[3]}</td>
      </tr>
    `
      )
      .join("");
    setText("totalSeparateFooter", formatWon(result.totalSeparate));
  }

  function renderMessage(result, s) {
    const el = output("naturalMessage");
    if (!el) return;

    const base = `입사 후 ${result.interim.years}년차에 ${formatWon(s.settlementAmount)}을 중간정산 받으면 예상 퇴직소득세는 약 ${formatWon(
      result.interim.totalTax
    )}, 실수령액은 약 ${formatWon(result.interimNetAmount)}으로 추정됩니다.`;

    let comparison;
    if (s.taxSettlementOption === "applied") {
      comparison = `최종 퇴직 시 세액정산을 적용하면 총세금은 중간정산을 하지 않고 한 번에 받았을 때(약 ${formatWon(
        result.noInterim.totalTax
      )})와 같아지며, 최종 퇴직 시 약 ${formatWon(result.additionalDueAtFinalRetirement)}을 추가로 정산합니다.`;
    } else {
      const diffAbs = formatWon(Math.abs(result.diffNotApplied));
      const diffWord = result.diffNotApplied > 0 ? "늘어날" : result.diffNotApplied < 0 ? "줄어들" : "거의 변하지 않을";
      comparison = `중간정산분과 이후 퇴직분을 각각 계산하면 총세금은 약 ${formatWon(
        result.totalSeparate
      )}로, 중간정산 없이 한 번에 받았을 때(약 ${formatWon(result.noInterim.totalTax)})보다 약 ${diffAbs} ${diffWord} 수 있습니다.`;
      if (s.taxSettlementOption === "unknown") {
        comparison += ` 다만 최종 퇴직 시 세액정산이 적용되면 총세금은 ${formatWon(result.noInterim.totalTax)}로 동일해집니다.`;
      }
    }

    const closing = "세금 차이는 참고용 추정이며, 중간정산은 자금을 미리 활용할 수 있다는 장점도 있으니 자금 필요성과 함께 고려하는 것이 안전합니다.";

    el.textContent = "";
    [base, comparison, closing].forEach((sentence) => {
      const p = document.createElement("p");
      p.textContent = sentence;
      el.appendChild(p);
    });
  }

  function readInputs() {
    state.reason = input("reason")?.value || state.reason;
    state.hireDate = input("hireDate")?.value || state.hireDate;
    state.settlementDate = input("settlementDate")?.value || state.settlementDate;
    state.settlementAmount = parseNumber(input("settlementAmount")?.value);
    state.futureRetireDate = input("futureRetireDate")?.value || state.futureRetireDate;
    state.futureTotalPay = parseNumber(input("futureTotalPay")?.value);
    state.taxSettlementOption = input("taxSettlementOption")?.value || state.taxSettlementOption;
  }

  function setInputValue(name, value) {
    const el = input(name);
    if (!el) return;
    if (el.dataset.format === "money") {
      el.value = won.format(Math.round(Number(value || 0)));
    } else {
      el.value = String(value ?? "");
    }
  }

  function syncInputs() {
    Object.entries(state).forEach(([key, value]) => setInputValue(key, value));
  }

  function render() {
    readInputs();
    syncInputs();

    const reasonDetailEl = output("reasonDetail");
    if (reasonDetailEl) reasonDetailEl.textContent = getReason(state.reason)?.detail || "";

    const result = calculate(state);
    renderReasonWarning(result);
    renderVerdict(result, state);
    renderTotalTaxChart(result);
    renderCompositionChart(result, state);
    renderCompare(result);
    renderBreakdown(result);
    renderMessage(result, state);
  }

  function applyPreset(id) {
    const preset = (config.presets || []).find((item) => item.id === id);
    if (!preset) return;
    Object.assign(state, preset.input);
    $$(".rist-preset-btn").forEach((button) => button.classList.toggle("is-active", button.dataset.preset === id));
    syncInputs();
    render();
  }

  function init() {
    syncInputs();

    $$(".rist-preset-btn").forEach((button) => {
      button.addEventListener("click", () => applyPreset(button.dataset.preset));
    });

    $$("[data-rist]").forEach((el) => {
      el.addEventListener("input", render);
      el.addEventListener("change", render);
    });

    const resetButton = document.getElementById("resetRistBtn");
    if (resetButton) {
      resetButton.addEventListener("click", () => {
        Object.keys(state).forEach((key) => delete state[key]);
        Object.assign(state, config.defaultInput || {});
        $$(".rist-preset-btn").forEach((button, index) => button.classList.toggle("is-active", index === 0));
        syncInputs();
        render();
      });
    }

    const copyButton = document.getElementById("copyRistLinkBtn");
    if (copyButton) {
      copyButton.addEventListener("click", async () => {
        const url = new URL(window.location.href);
        url.searchParams.set("reason", String(state.reason));
        url.searchParams.set("hire", String(state.hireDate));
        url.searchParams.set("settle", String(state.settlementDate));
        url.searchParams.set("amount", String(state.settlementAmount));
        url.searchParams.set("retire", String(state.futureRetireDate));
        url.searchParams.set("futurePay", String(state.futureTotalPay));
        url.searchParams.set("settlement", String(state.taxSettlementOption));
        await navigator.clipboard?.writeText(url.toString());
        copyButton.textContent = "링크 복사됨";
        setTimeout(() => {
          copyButton.textContent = "링크 복사";
        }, 1600);
      });
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get("reason")) state.reason = params.get("reason");
    if (params.get("hire")) state.hireDate = params.get("hire");
    if (params.get("settle")) state.settlementDate = params.get("settle");
    const amount = parseNumber(params.get("amount"));
    if (amount > 0) state.settlementAmount = amount;
    if (params.get("retire")) state.futureRetireDate = params.get("retire");
    const futurePay = parseNumber(params.get("futurePay"));
    if (futurePay > 0) state.futureTotalPay = futurePay;
    if (params.get("settlement")) state.taxSettlementOption = params.get("settlement");

    syncInputs();
    render();
  }

  init();
})();
