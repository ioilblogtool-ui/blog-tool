(() => {
  const root = document.querySelector("[data-ysm-root]");
  const configEl = document.getElementById("ysm-config");
  if (!root || !configEl) return;

  const config = JSON.parse(configEl.textContent || "{}");
  const tiers = config.leapIncomeTiers || [];
  const defaultInput = config.defaultInput || {};
  const won = new Intl.NumberFormat("ko-KR");
  const TAX_RATE = 0.154;
  const FUTURE_MONTHS = 36;
  const FUTURE_LIMIT = 500000;
  const LEAP_MONTHS = 60;
  const LEAP_LIMIT = 700000;
  const FUTURE_CONTRIBUTION_RATES = { general: 0.06, preferred: 0.12 };

  const byId = (id) => document.getElementById(id);
  const out = (key) => document.querySelector(`[data-ysm-output="${key}"]`);
  const num = (value) => Math.max(0, Number(String(value).replace(/[^\d.]/g, "")) || 0);
  const roundWon = (value) => Math.round(value);
  const formatWon = (value) => `${won.format(roundWon(value))}원`;
  const formatManwon = (value) => `${won.format(Math.round(value / 10000))}만 원`;

  function calculateInstallmentInterest({ monthlyContribution, months, annualRate }) {
    const monthlyRate = annualRate / 100 / 12;
    return roundWon(monthlyContribution * ((months * (months + 1)) / 2) * monthlyRate);
  }

  function calculateTax({ grossInterest, taxFree, includeTax }) {
    if (taxFree || !includeTax) return 0;
    return roundWon(grossInterest * TAX_RATE);
  }

  function readInput() {
    const selectedProducts = [...root.querySelectorAll("[data-ysm-product]:checked")].map((item) => item.value);
    return {
      monthlyContribution: num(byId("ysm-monthly")?.value),
      selectedProducts,
      youthFutureType: byId("ysm-future-type")?.value || defaultInput.youthFutureType || "general",
      leapIncomeTierId: byId("ysm-leap-tier")?.value || defaultInput.leapIncomeTierId || "tier-2",
      regularAnnualRate: num(byId("ysm-regular-rate")?.value),
      regularMonths: Math.max(1, num(byId("ysm-regular-months")?.value)),
      includeTax: byId("ysm-include-tax")?.checked ?? true,
      futureBaseRate: num(byId("ysm-future-base-rate")?.value),
      futureBonusRate: num(byId("ysm-future-bonus-rate")?.value),
      leapAnnualRate: num(byId("ysm-leap-rate")?.value),
      policyTaxFree: byId("ysm-policy-tax-free")?.checked ?? true,
    };
  }

  function calculateFutureSavings(input) {
    const appliedMonthly = Math.min(input.monthlyContribution, FUTURE_LIMIT);
    const cappedAmount = Math.max(input.monthlyContribution - FUTURE_LIMIT, 0);
    const principal = appliedMonthly * FUTURE_MONTHS;
    const contributionRate = FUTURE_CONTRIBUTION_RATES[input.youthFutureType] || FUTURE_CONTRIBUTION_RATES.general;
    const governmentContribution = roundWon(principal * contributionRate);
    const annualRate = input.futureBaseRate + input.futureBonusRate;
    const grossInterest = calculateInstallmentInterest({ monthlyContribution: appliedMonthly, months: FUTURE_MONTHS, annualRate });
    const taxAmount = calculateTax({ grossInterest, taxFree: input.policyTaxFree, includeTax: input.includeTax });
    const netInterest = grossInterest - taxAmount;
    const maturityAmount = principal + governmentContribution + netInterest;

    return {
      productId: "future",
      productName: input.youthFutureType === "preferred" ? "청년미래적금 우대형" : "청년미래적금 일반형",
      months: FUTURE_MONTHS,
      appliedMonthlyContribution: appliedMonthly,
      cappedAmount,
      principal,
      annualRate,
      grossInterest,
      taxAmount,
      netInterest,
      governmentContribution,
      taxSaving: input.policyTaxFree ? roundWon(grossInterest * TAX_RATE) : 0,
      maturityAmount,
      badges: ["공식", "추정"],
      warnings: [
        "청년미래적금 가입 자격과 우대형 여부는 실제 신청 시점에 확인해야 합니다.",
        cappedAmount > 0 ? "청년미래적금은 월 50만 원 한도까지만 반영했습니다." : "",
      ].filter(Boolean),
    };
  }

  function calculateLeapSavings(input, tier) {
    const appliedMonthly = Math.min(input.monthlyContribution, LEAP_LIMIT);
    const cappedAmount = Math.max(input.monthlyContribution - LEAP_LIMIT, 0);
    const principal = appliedMonthly * LEAP_MONTHS;
    const monthlyRaw = Math.min(appliedMonthly, tier.contributionBaseAmount) * tier.contributionRate;
    const monthlyGovernmentContribution = Math.min(monthlyRaw, tier.monthlyContributionMax);
    const governmentContribution = roundWon(monthlyGovernmentContribution * LEAP_MONTHS);
    const grossInterest = calculateInstallmentInterest({ monthlyContribution: appliedMonthly, months: LEAP_MONTHS, annualRate: input.leapAnnualRate });
    const taxAmount = calculateTax({ grossInterest, taxFree: input.policyTaxFree, includeTax: input.includeTax });
    const netInterest = grossInterest - taxAmount;
    const maturityAmount = principal + governmentContribution + netInterest;

    return {
      productId: "leap",
      productName: "청년도약계좌",
      months: LEAP_MONTHS,
      appliedMonthlyContribution: appliedMonthly,
      cappedAmount,
      principal,
      annualRate: input.leapAnnualRate,
      grossInterest,
      taxAmount,
      netInterest,
      governmentContribution,
      taxSaving: input.policyTaxFree ? roundWon(grossInterest * TAX_RATE) : 0,
      maturityAmount,
      badges: ["공식", "추정"],
      warnings: [
        "청년도약계좌 유지·전환 판단은 기존 납입 기간과 공식 전환 절차를 함께 확인해야 합니다.",
        cappedAmount > 0 ? "청년도약계좌는 월 70만 원 한도까지만 반영했습니다." : "",
      ].filter(Boolean),
    };
  }

  function calculateRegularSavings(input) {
    const principal = input.monthlyContribution * input.regularMonths;
    const grossInterest = calculateInstallmentInterest({
      monthlyContribution: input.monthlyContribution,
      months: input.regularMonths,
      annualRate: input.regularAnnualRate,
    });
    const taxAmount = calculateTax({ grossInterest, taxFree: false, includeTax: input.includeTax });
    const netInterest = grossInterest - taxAmount;
    const maturityAmount = principal + netInterest;

    return {
      productId: "regular",
      productName: "일반 적금",
      months: input.regularMonths,
      appliedMonthlyContribution: input.monthlyContribution,
      cappedAmount: 0,
      principal,
      annualRate: input.regularAnnualRate,
      grossInterest,
      taxAmount,
      netInterest,
      governmentContribution: 0,
      taxSaving: 0,
      maturityAmount,
      badges: ["추정"],
      warnings: ["일반 적금 금리와 세금은 은행별 상품 조건에 따라 달라질 수 있습니다."],
    };
  }

  function calculateComparison(input) {
    const tier = tiers.find((item) => item.id === input.leapIncomeTierId) || tiers[1] || tiers[0];
    const results = [];
    if (input.selectedProducts.includes("future")) results.push(calculateFutureSavings(input));
    if (input.selectedProducts.includes("leap") && tier) results.push(calculateLeapSavings(input, tier));
    if (input.selectedProducts.includes("regular")) results.push(calculateRegularSavings(input));

    const sorted = [...results].sort((a, b) => b.maturityAmount - a.maturityAmount);
    const best = sorted[0] || null;
    const regular = results.find((item) => item.productId === "regular");
    return {
      results,
      bestProductName: best?.productName || "비교 상품 없음",
      bestMaturityAmount: best?.maturityAmount || 0,
      additionalVsRegular: best && regular ? best.maturityAmount - regular.maturityAmount : 0,
      totalGovernmentContribution: results.reduce((sum, item) => sum + item.governmentContribution, 0),
      totalTaxSaving: results.reduce((sum, item) => sum + item.taxSaving, 0),
      interpretation: best
        ? `${best.productName}의 예상 만기 수령액이 가장 높습니다. 다만 정책 적금은 가입 자격과 우대조건 확인이 필요합니다.`
        : "비교할 상품을 선택해 주세요.",
      warnings: [...new Set(results.flatMap((item) => item.warnings))],
    };
  }

  function renderTable(results) {
    const target = out("comparisonRows");
    if (!target) return;
    target.innerHTML = results.map((item) => `
      <tr>
        <th scope="row">
          <strong>${item.productName}</strong>
          <span>${item.badges.map((badge) => `<em class="ysm-badge ysm-badge--${badge.replace(" ", "-")}">${badge}</em>`).join("")}</span>
        </th>
        <td>${item.months}개월</td>
        <td>${formatManwon(item.appliedMonthlyContribution)}</td>
        <td>${formatManwon(item.principal)}</td>
        <td>${formatManwon(item.netInterest)}</td>
        <td>${formatManwon(item.governmentContribution)}</td>
        <td><strong>${formatManwon(item.maturityAmount)}</strong></td>
      </tr>
    `).join("");
  }

  function renderWarnings(warnings) {
    const target = out("warnings");
    if (!target) return;
    target.innerHTML = warnings.map((warning) => `<li>${warning}</li>`).join("");
  }

  function renderDelta(results) {
    const target = out("deltaCards");
    if (!target) return;
    const regular = results.find((item) => item.productId === "regular");
    target.innerHTML = results
      .filter((item) => item.productId !== "regular")
      .map((item) => {
        const delta = regular ? item.maturityAmount - regular.maturityAmount : item.governmentContribution + item.taxSaving;
        return `
          <article class="ysm-delta-card">
            <span>${item.productName}</span>
            <strong>${delta >= 0 ? "+" : ""}${formatManwon(delta)}</strong>
            <p>일반 적금 대비 차액은 정부기여금, 비과세 효과, 금리 차이를 합산한 추정값입니다.</p>
          </article>
        `;
      })
      .join("");
  }

  function render() {
    const result = calculateComparison(readInput());
    out("bestAmount").textContent = formatManwon(result.bestMaturityAmount);
    out("bestProduct").textContent = result.bestProductName;
    out("additionalVsRegular").textContent = result.additionalVsRegular
      ? `${result.additionalVsRegular >= 0 ? "+" : ""}${formatManwon(result.additionalVsRegular)}`
      : "비교 기준 없음";
    out("governmentContribution").textContent = formatManwon(result.totalGovernmentContribution);
    out("taxSaving").textContent = formatWon(result.totalTaxSaving);
    out("interpretation").textContent = result.interpretation;
    renderTable(result.results);
    renderDelta(result.results);
    renderWarnings(result.warnings);
  }

  function applyPreset(amount) {
    const monthly = byId("ysm-monthly");
    if (monthly) monthly.value = amount;
    root.querySelectorAll("[data-ysm-preset]").forEach((button) => {
      const active = Number(button.dataset.ysmPreset) === Number(amount);
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    render();
  }

  function reset() {
    byId("ysm-monthly").value = defaultInput.monthlyContribution || 500000;
    byId("ysm-future-type").value = defaultInput.youthFutureType || "general";
    byId("ysm-leap-tier").value = defaultInput.leapIncomeTierId || "tier-2";
    byId("ysm-future-base-rate").value = defaultInput.futureBaseRate || 5;
    byId("ysm-future-bonus-rate").value = defaultInput.futureBonusRate || 0;
    byId("ysm-leap-rate").value = defaultInput.leapAnnualRate || 5;
    byId("ysm-regular-rate").value = defaultInput.regularAnnualRate || 3.5;
    byId("ysm-regular-months").value = defaultInput.regularMonths || 36;
    byId("ysm-include-tax").checked = defaultInput.includeTax !== false;
    byId("ysm-policy-tax-free").checked = defaultInput.policyTaxFree !== false;
    root.querySelectorAll("[data-ysm-product]").forEach((item) => {
      item.checked = (defaultInput.selectedProducts || []).includes(item.value);
    });
    applyPreset(defaultInput.monthlyContribution || 500000);
  }

  root.addEventListener("input", render);
  root.addEventListener("change", render);
  root.querySelectorAll("[data-ysm-preset]").forEach((button) => {
    button.addEventListener("click", () => applyPreset(button.dataset.ysmPreset));
  });
  document.getElementById("resetYsmBtn")?.addEventListener("click", reset);
  document.getElementById("copyYsmLinkBtn")?.addEventListener("click", () => navigator.clipboard?.writeText(location.href));
  applyPreset(defaultInput.monthlyContribution || 500000);
})();
