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

function getTodayIso() {
  return new Date().toISOString().slice(0, 10);
}

function getVoucher(childOrder, included) {
  if (!included) return 0;
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

function leavePayForMonth(monthlyWage, monthNumber) {
  if (monthNumber <= 3) return Math.min(monthlyWage, 2500000);
  if (monthNumber <= 6) return Math.min(monthlyWage, 2000000);
  return Math.min(monthlyWage * 0.8, 1600000);
}

function allowedLeaveMonths(extensionType) {
  return extensionType === "NONE" ? 12 : 18;
}

function buildTimeline(monthlyWage, spouseSalary, leaveMonths, childOrder, includeVoucher) {
  const voucher = getVoucher(childOrder, includeVoucher);
  const timeline = [];

  for (let month = 0; month < 24; month += 1) {
    const onLeave = month < leaveMonths;
    const leaveUserIncome = onLeave ? leavePayForMonth(monthlyWage, month + 1) : monthlyWage;
    const spouseIncome = spouseSalary;
    const parentBenefit = parentBenefitForMonth(month);
    const childAllowance = childAllowanceForMonth(month);
    const other = month === 0 ? voucher : 0;
    const total = leaveUserIncome + spouseIncome + parentBenefit + childAllowance + other;

    timeline.push({ month, leaveUserIncome, spouseIncome, parentBenefit, childAllowance, other, total, onLeave });
  }

  return timeline;
}

function renderSingleLeaveTotal() {
  const leaveUser = $("singleLeaveUser").value;
  const monthlyWage = Number($("singleMonthlyWage").value || 0);
  const spouseSalary = Number($("singleSpouseSalary").value || 0);
  const requestedLeaveMonths = Number($("singleLeaveMonths").value || 12);
  const extensionType = $("singleExtensionType").value;
  const childOrder = $("singleChildOrder").value;
  const includeVoucher = $("includeVoucherToggle").checked;
  const status = $("singleCurrentStatus").value;
  const birthDate = $("singleBirthDate").value || getTodayIso();

  $("singleMonthlyWageHint").textContent = formatKoreanAmount(monthlyWage);
  $("singleSpouseSalaryHint").textContent = formatKoreanAmount(spouseSalary);
  if (!$("singleBirthDate").value) {
    $("singleBirthDate").value = birthDate;
  }

  const effectiveLeaveMonths = Math.min(requestedLeaveMonths, allowedLeaveMonths(extensionType));
  const timeline = buildTimeline(monthlyWage, spouseSalary, effectiveLeaveMonths, childOrder, includeVoucher);
  const leaveUserIncomeTotal = timeline.reduce((sum, item) => sum + item.leaveUserIncome, 0);
  const spouseIncomeTotal = timeline.reduce((sum, item) => sum + item.spouseIncome, 0);
  const supportTotal = timeline.reduce((sum, item) => sum + item.parentBenefit + item.childAllowance, 0);
  const voucherTotal = getVoucher(childOrder, includeVoucher);
  const total = timeline.reduce((sum, item) => sum + item.total, 0);
  const householdAverage = total / 24;
  const summaryLabel = `${leaveUser === "MOTHER" ? "엄마" : "아빠"} ${effectiveLeaveMonths}개월 육아휴직`;
  const spouseLabel = leaveUser === "MOTHER" ? "남편 월급 포함" : "아내 월급 포함";

  $("singleTotalSummary").textContent = formatKoreanAmount(total);
  $("singleHouseholdAverage").textContent = formatKoreanAmount(householdAverage);
  $("singleLeaveUserIncomeSummary").textContent = formatKoreanAmount(leaveUserIncomeTotal);
  $("singleSpouseIncomeSummary").textContent = formatKoreanAmount(spouseIncomeTotal);

  $("singleLeaveUserIncomeValue").textContent = formatKoreanAmount(leaveUserIncomeTotal);
  $("singleSpouseIncomeValue").textContent = formatKoreanAmount(spouseIncomeTotal);
  $("singleSupportValue").textContent = formatKoreanAmount(supportTotal);
  $("singleVoucherValue").textContent = formatKoreanAmount(voucherTotal);
  $("singleSummaryNote").textContent = `${status === "BEFORE_BIRTH" ? "출생 전 가정" : "출생 후 계산"} · ${summaryLabel} · ${spouseLabel}`;

  $("singleLeaveTimelineTable").innerHTML = timeline
    .map((item) => `
      <tr>
        <td>${item.month}개월</td>
        <td>${formatWon(item.leaveUserIncome)}</td>
        <td>${formatWon(item.spouseIncome)}</td>
        <td>${formatWon(item.parentBenefit)}</td>
        <td>${formatWon(item.childAllowance + item.other)}</td>
        <td>${formatWon(item.total)}</td>
      </tr>
    `)
    .join("");
}

const page = document.querySelector("[data-calculator]")?.dataset.calculator;

if (page === "single-parental-leave-total") {
  if (!$("singleBirthDate").value) {
    $("singleBirthDate").value = getTodayIso();
  }

  [
    "singleLeaveUser",
    "singleMonthlyWage",
    "singleSpouseSalary",
    "singleLeaveMonths",
    "singleExtensionType",
    "singleChildOrder",
    "singleBirthDate",
    "singleCurrentStatus",
    "includeVoucherToggle"
  ].forEach((id) => {
    const element = $(id);
    element?.addEventListener("input", renderSingleLeaveTotal);
    element?.addEventListener("change", renderSingleLeaveTotal);
  });

  $("calcSingleLeaveBtn")?.addEventListener("click", renderSingleLeaveTotal);
  renderSingleLeaveTotal();
}
