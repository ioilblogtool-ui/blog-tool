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

function monthDiff(fromDate, toDate) {
  return (toDate.getFullYear() - fromDate.getFullYear()) * 12 + (toDate.getMonth() - fromDate.getMonth());
}

function getTodayIso() {
  return new Date().toISOString().slice(0, 10);
}

function getVoucher(childOrder) {
  return childOrder === "SECOND_PLUS" ? 3000000 : 2000000;
}

function parentBenefitForMonth(monthIndex) {
  if (monthIndex < 12) return 1000000;
  if (monthIndex < 24) return 500000;
  return 0;
}

function childAllowanceForMonth(monthIndex) {
  return monthIndex < 24 ? 100000 : 0;
}

function calculateTimeline(childOrder, windowMonths) {
  const voucher = getVoucher(childOrder);
  const timeline = [];

  for (let month = 0; month < windowMonths; month += 1) {
    const voucherAmount = month === 0 ? voucher : 0;
    const parentBenefit = parentBenefitForMonth(month);
    const childAllowance = childAllowanceForMonth(month);
    const total = voucherAmount + parentBenefit + childAllowance;

    timeline.push({ month, voucherAmount, parentBenefit, childAllowance, total });
  }

  return timeline;
}

function renderBirthSupport() {
  const birthDateInput = $("birthDate");
  const childOrder = $("childOrder").value;
  const ageInput = $("currentAgeMonths");
  const windowMonths = Number($("supportWindowMonths").value || 24);
  const salaryReference = Number($("supportMonthlySalaryReference").value || 0);

  if (!birthDateInput.value) {
    birthDateInput.value = getTodayIso();
  }

  const birthDate = new Date(birthDateInput.value);
  const currentAgeMonths = Math.max(0, Math.min(windowMonths, Number(ageInput.value || 0)));
  const timeline = calculateTimeline(childOrder, windowMonths);
  const voucher = getVoucher(childOrder);
  const parentBenefitTotal = timeline.reduce((sum, item) => sum + item.parentBenefit, 0);
  const childAllowanceTotal = timeline.reduce((sum, item) => sum + item.childAllowance, 0);
  const total = timeline.reduce((sum, item) => sum + item.total, 0);
  const accumulated = timeline.slice(0, currentAgeMonths + 1).reduce((sum, item) => sum + item.total, 0);
  const average = total / windowMonths;
  const autoAge = Math.max(0, Math.min(windowMonths, monthDiff(birthDate, new Date())));
  const salaryEquivalent = salaryReference > 0 ? total / salaryReference : 0;
  const replacementRate = salaryReference > 0 ? average / salaryReference : 0;

  if (document.activeElement !== ageInput) {
    ageInput.value = String(autoAge);
  }

  $("supportSalaryReferenceHint").textContent = formatKoreanAmount(salaryReference);
  $("supportTotalSummary").textContent = formatKoreanAmount(total);
  $("supportMonthlyAverage").textContent = formatKoreanAmount(average);
  $("supportSalaryEquivalent").textContent = `${salaryEquivalent.toFixed(1)}개월치`;
  $("supportReplacementRate").textContent = formatPercent(replacementRate);

  $("firstMeetingVoucherValue").textContent = formatKoreanAmount(voucher);
  $("parentBenefitTotalValue").textContent = formatKoreanAmount(parentBenefitTotal);
  $("childAllowanceTotalValue").textContent = formatKoreanAmount(childAllowanceTotal);
  $("supportCurrentAccumulated").textContent = formatKoreanAmount(accumulated);
  $("supportSummaryNote").textContent = `${childOrder === "SECOND_PLUS" ? "둘째 이상" : "첫째"} 기준 · 출생~${windowMonths}개월`;

  $("birthSupportTimelineTable").innerHTML = timeline
    .map((item) => `
      <tr>
        <td>${item.month}개월</td>
        <td>${formatWon(item.voucherAmount)}</td>
        <td>${formatWon(item.parentBenefit)}</td>
        <td>${formatWon(item.childAllowance)}</td>
        <td>${formatWon(item.total)}</td>
      </tr>
    `)
    .join("");
}

const page = document.querySelector("[data-calculator]")?.dataset.calculator;

if (page === "birth-support-total") {
  if (!$("birthDate").value) {
    $("birthDate").value = getTodayIso();
  }

  ["birthDate", "childOrder", "currentAgeMonths", "supportWindowMonths", "supportMonthlySalaryReference"].forEach((id) => {
    const element = $(id);
    element?.addEventListener("input", renderBirthSupport);
    element?.addEventListener("change", renderBirthSupport);
  });

  $("calcBirthSupportBtn")?.addEventListener("click", renderBirthSupport);
  renderBirthSupport();
}
