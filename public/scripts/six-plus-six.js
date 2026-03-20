const $ = (id) => document.getElementById(id);

function formatWon(value) {
  return `${new Intl.NumberFormat("ko-KR").format(Math.round(Number(value || 0)))}원`;
}

function formatKoreanAmount(value) {
  const amount = Math.round(Number(value || 0));
  const eok = Math.floor(amount / 100000000);
  const man = Math.floor((amount % 100000000) / 10000);

  if (eok > 0 && man > 0) return `${eok}억 ${new Intl.NumberFormat("ko-KR").format(man)}만원`;
  if (eok > 0) return `${eok}억원`;
  return `${new Intl.NumberFormat("ko-KR").format(man)}만원`;
}

function formatPercent(value) {
  return `${(Number(value || 0) * 100).toFixed(1)}%`;
}

function normalLeavePay(monthlyWage, monthNumber) {
  if (monthNumber <= 3) return Math.min(monthlyWage, 2500000);
  if (monthNumber <= 6) return Math.min(monthlyWage, 2000000);
  return Math.min(monthlyWage * 0.8, 1600000);
}

function specialLeavePay(monthlyWage, monthNumber) {
  const caps = [2500000, 2500000, 3000000, 3500000, 4000000, 4500000];
  if (monthNumber <= 6) return Math.min(monthlyWage, caps[monthNumber - 1]);
  return normalLeavePay(monthlyWage, monthNumber);
}

function allowedLeaveMonths(motherMonths, fatherMonths) {
  return motherMonths >= 3 && fatherMonths >= 3 ? 18 : 12;
}

function computeTotal(monthlyWage, months, useSpecial, allowedMonthsCount) {
  const effectiveMonths = Math.min(months, allowedMonthsCount);
  let total = 0;
  const monthly = [];

  for (let month = 1; month <= effectiveMonths; month += 1) {
    const pay = useSpecial ? specialLeavePay(monthlyWage, month) : normalLeavePay(monthlyWage, month);
    total += pay;
    monthly.push(pay);
  }

  return { total, monthly, effectiveMonths };
}

function renderSixPlusSix() {
  const motherWage = Number($("sixMotherWage").value || 0);
  const fatherWage = Number($("sixFatherWage").value || 0);
  const requestedMotherMonths = Number($("sixMotherMonths").value || 6);
  const requestedFatherMonths = Number($("sixFatherMonths").value || 6);
  const childAgeMonths = Number($("sixChildAgeMonths").value || 0);
  const leaveMode = $("sixLeaveMode").value;

  const extensionMonths = allowedLeaveMonths(requestedMotherMonths, requestedFatherMonths);
  const specialEligible = childAgeMonths <= 18 && requestedMotherMonths > 0 && requestedFatherMonths > 0;
  const motherSpecial = computeTotal(motherWage, requestedMotherMonths, specialEligible, extensionMonths);
  const fatherSpecial = computeTotal(fatherWage, requestedFatherMonths, specialEligible, extensionMonths);
  const motherNormal = computeTotal(motherWage, requestedMotherMonths, false, extensionMonths);
  const fatherNormal = computeTotal(fatherWage, requestedFatherMonths, false, extensionMonths);

  const householdTotal = motherSpecial.total + fatherSpecial.total;
  const normalTotal = motherNormal.total + fatherNormal.total;
  const difference = householdTotal - normalTotal;
  const originalSalaryTotal = motherWage * motherSpecial.effectiveMonths + fatherWage * fatherSpecial.effectiveMonths;
  const replacementRate = originalSalaryTotal > 0 ? householdTotal / originalSalaryTotal : 0;

  $("sixEligibilitySummary").textContent = specialEligible ? "6+6 가능" : "6+6 불가";
  $("sixHouseholdTotalSummary").textContent = formatKoreanAmount(householdTotal);
  $("sixDifferenceSummary").textContent = formatKoreanAmount(difference);
  $("sixReplacementSummary").textContent = formatPercent(replacementRate);

  $("sixMotherTotalValue").textContent = formatKoreanAmount(motherSpecial.total);
  $("sixFatherTotalValue").textContent = formatKoreanAmount(fatherSpecial.total);
  $("sixHouseholdTotalValue").textContent = formatKoreanAmount(householdTotal);
  $("sixDifferenceValue").textContent = formatKoreanAmount(difference);
  $("sixSummaryNote").textContent = `${leaveMode === "SIMULTANEOUS" ? "동시" : "순차"} 사용 · 자녀 생후 ${childAgeMonths}개월 · 연장 한도 ${extensionMonths}개월`;

  const maxMonths = Math.max(motherSpecial.effectiveMonths, fatherSpecial.effectiveMonths, 6);
  const rows = [];

  for (let month = 1; month <= maxMonths; month += 1) {
    rows.push([
      `${month}개월차`,
      month <= motherSpecial.effectiveMonths ? formatWon(motherSpecial.monthly[month - 1] || 0) : "-",
      month <= motherNormal.effectiveMonths ? formatWon(motherNormal.monthly[month - 1] || 0) : "-",
      month <= fatherSpecial.effectiveMonths ? formatWon(fatherSpecial.monthly[month - 1] || 0) : "-",
      month <= fatherNormal.effectiveMonths ? formatWon(fatherNormal.monthly[month - 1] || 0) : "-"
    ]);
  }

  rows.push([
    "총액",
    formatWon(motherSpecial.total),
    formatWon(motherNormal.total),
    formatWon(fatherSpecial.total),
    formatWon(fatherNormal.total)
  ]);

  $("sixComparisonTable").innerHTML = rows
    .map((row) => `
      <tr>
        <td>${row[0]}</td>
        <td>${row[1]}</td>
        <td>${row[2]}</td>
        <td>${row[3]}</td>
        <td>${row[4]}</td>
      </tr>
    `)
    .join("");
}

const page = document.querySelector("[data-calculator]")?.dataset.calculator;

if (page === "six-plus-six") {
  ["sixMotherWage", "sixFatherWage", "sixMotherMonths", "sixFatherMonths", "sixChildAgeMonths", "sixLeaveMode"].forEach((id) => {
    const element = $(id);
    element?.addEventListener("input", renderSixPlusSix);
    element?.addEventListener("change", renderSixPlusSix);
  });

  $("calcSixPlusSixBtn")?.addEventListener("click", renderSixPlusSix);
  renderSixPlusSix();
}
