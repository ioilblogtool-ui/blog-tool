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

function allowedLeaveMonths(extensionType) {
  return extensionType === "NONE" ? 12 : 18;
}

function leavePayForMonth(monthlyWage, monthNumber) {
  if (monthNumber <= 3) return { pay: Math.min(monthlyWage, 2500000), cap: 2500000, ratio: "100%" };
  if (monthNumber <= 6) return { pay: Math.min(monthlyWage, 2000000), cap: 2000000, ratio: "100%" };
  return { pay: Math.min(monthlyWage * 0.8, 1600000), cap: 1600000, ratio: "80%" };
}

function flashButton(button, label) {
  if (!button) return;
  const original = button.textContent;
  button.textContent = label;
  window.setTimeout(() => {
    button.textContent = original;
  }, 1600);
}

function resetLeavePayForm() {
  $("leavePayMonthlyWage").value = "2500000";
  $("leavePayMonths").value = "12";
  $("leavePayExtensionType").value = "NONE";
  $("leavePayUser").value = "MOTHER";
  $("leavePayStartMonth").value = "0";
  renderParentalLeavePay();
}

function renderParentalLeavePay() {
  const monthlyWage = Number($("leavePayMonthlyWage").value || 0);
  const requestedLeaveMonths = Number($("leavePayMonths").value || 12);
  const extensionType = $("leavePayExtensionType").value;
  const leaveUser = $("leavePayUser").value;
  const startMonth = Number($("leavePayStartMonth").value || 0);
  const effectiveMonths = Math.min(requestedLeaveMonths, allowedLeaveMonths(extensionType));

  $("leavePayMonthlyWageHint").textContent = formatKoreanAmount(monthlyWage);

  const rows = [];
  let total = 0;
  let cappedCount = 0;

  for (let month = 1; month <= effectiveMonths; month += 1) {
    const result = leavePayForMonth(monthlyWage, month);
    const basePay = result.ratio === "80%" ? monthlyWage * 0.8 : monthlyWage;
    const capped = result.pay < basePay;
    if (capped) cappedCount += 1;
    total += result.pay;

    rows.push({
      label: `${startMonth + month}개월차`,
      ratio: result.ratio,
      cap: result.cap,
      pay: result.pay,
      capped
    });
  }

  const average = effectiveMonths > 0 ? total / effectiveMonths : 0;
  const replacementRate = monthlyWage > 0 ? average / monthlyWage : 0;
  const allowanceLabel = extensionType === "NONE" ? "12개월" : "18개월";

  $("leavePayTotalSummary").textContent = formatKoreanAmount(total);
  $("leavePayAverageSummary").textContent = formatKoreanAmount(average);
  $("leavePayReplacementSummary").textContent = formatPercent(replacementRate);
  $("leavePayAllowanceSummary").textContent = allowanceLabel;
  $("leavePaySummaryNote").textContent = `${leaveUser === "MOTHER" ? "엄마" : "아빠"} 기준 · 요청 ${requestedLeaveMonths}개월 / 반영 ${effectiveMonths}개월 · 상한 적용 ${cappedCount}개월`;

  $("leavePayTable").innerHTML = rows
    .map((row) => `
      <tr>
        <td>${row.label}</td>
        <td>${row.ratio}</td>
        <td>${formatWon(row.cap)}</td>
        <td>${formatWon(row.pay)}</td>
        <td>${row.capped ? "적용" : "미적용"}</td>
      </tr>
    `)
    .join("");
}

const page = document.querySelector("[data-calculator]")?.dataset.calculator;

if (page === "parental-leave-pay") {
  ["leavePayMonthlyWage", "leavePayMonths", "leavePayExtensionType", "leavePayUser", "leavePayStartMonth"].forEach((id) => {
    const element = $(id);
    element?.addEventListener("input", renderParentalLeavePay);
    element?.addEventListener("change", renderParentalLeavePay);
  });

  $("calcLeavePayBtn")?.addEventListener("click", renderParentalLeavePay);
  $("resetLeavePayBtn")?.addEventListener("click", () => {
    resetLeavePayForm();
    flashButton($("resetLeavePayBtn"), "초기화됨");
  });

  $("copyLeavePayLinkBtn")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      flashButton($("copyLeavePayLinkBtn"), "링크 복사됨");
    } catch {
      flashButton($("copyLeavePayLinkBtn"), "복사 실패");
    }
  });

  renderParentalLeavePay();
}
