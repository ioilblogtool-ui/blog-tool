(() => {
  const root = document.querySelector("[data-jvw-root]");
  if (!root) return;

  const won = new Intl.NumberFormat("ko-KR");
  const fields = [...root.querySelectorAll("[data-jvw-input]")];
  const out = (key) => document.querySelector(`[data-jvw-output="${key}"]`);

  function num(value) {
    return Math.max(0, Number(String(value).replace(/[^\d.]/g, "")) || 0);
  }

  function money(value) {
    if (!Number.isFinite(value)) return "-";
    if (value >= 100000000) return `${(value / 100000000).toFixed(1).replace(".0", "")}억원`;
    return `${won.format(Math.round(value / 10000))}만원`;
  }

  function read() {
    const data = {};
    fields.forEach((field) => {
      data[field.dataset.jvwInput] = field.type === "checkbox" ? field.checked : field.value;
    });
    return {
      jeonseDeposit: num(data.jeonseDeposit),
      jeonseLoan: num(data.jeonseLoan),
      loanRate: num(data.loanRate),
      wolseDeposit: num(data.wolseDeposit),
      rent: num(data.rent),
      maintenance: num(data.maintenance),
      includeMaintenance: Boolean(data.includeMaintenance),
      returnRate: num(data.returnRate),
      months: Math.max(1, num(data.months)),
    };
  }

  function calculate(input) {
    const years = input.months / 12;
    const jeonseEquity = Math.max(input.jeonseDeposit - input.jeonseLoan, 0);
    const jeonseInterest = input.jeonseLoan * input.loanRate / 100 * years;
    const jeonseOpportunity = jeonseEquity * input.returnRate / 100 * years;
    const jeonseTotal = jeonseInterest + jeonseOpportunity;
    const effectiveRent = input.rent + (input.includeMaintenance ? input.maintenance : 0);
    const wolseRentTotal = effectiveRent * input.months;
    const wolseDepositOpportunity = input.wolseDeposit * input.returnRate / 100 * years;
    const remainingCash = Math.max(jeonseEquity - input.wolseDeposit, 0);
    const remainingReturn = remainingCash * input.returnRate / 100 * years;
    const wolseTotal = wolseRentTotal + wolseDepositOpportunity - remainingReturn;
    const diff = jeonseTotal - wolseTotal;
    const breakeven = (jeonseTotal - wolseDepositOpportunity + remainingReturn) / input.months;
    return { jeonseTotal, wolseTotal, diff, breakeven };
  }

  function render() {
    const result = calculate(read());
    const better = Math.abs(result.diff) < 10000 ? "거의 비슷합니다" : result.diff > 0 ? "월세가 유리합니다" : "전세가 유리합니다";
    out("better").textContent = better;
    out("difference").textContent = money(Math.abs(result.diff));
    out("jeonseTotal").textContent = money(result.jeonseTotal);
    out("wolseTotal").textContent = money(result.wolseTotal);
    out("breakeven").textContent = money(result.breakeven);
    out("message").textContent = `현재 조건에서는 ${better}. 손익분기 월세는 약 ${money(result.breakeven)}입니다.`;
  }

  root.addEventListener("input", render);
  root.addEventListener("change", render);
  document.getElementById("resetJvwBtn")?.addEventListener("click", () => location.reload());
  document.getElementById("copyJvwLinkBtn")?.addEventListener("click", () => navigator.clipboard?.writeText(location.href));
  render();
})();
