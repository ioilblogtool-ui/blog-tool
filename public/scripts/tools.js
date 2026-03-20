const $ = (id) => document.getElementById(id);

function toNumber(id) {
  const el = $(id);
  return Number(el && el.value ? el.value : 0);
}

function isChecked(id) {
  const el = $(id);
  return !!(el && el.checked);
}

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

function formatPct(value) {
  return `${Number(value || 0).toFixed(1)}%`;
}

function setHint(inputId, hintId) {
  const input = $(inputId);
  const hint = $(hintId);
  if (!input || !hint) return;
  hint.textContent = formatKoreanAmount(input.value);
}

function computeTotalComp(annual, bonus, leavePay, includeBonus) {
  return annual + (includeBonus ? bonus : 0) + leavePay;
}

function estimateNetFromAnnual(annual) {
  const monthlyGross = annual / 12;
  const mealNonTaxable = Math.min(200000, monthlyGross * 0.04);
  const taxableMonthly = Math.max(0, monthlyGross - mealNonTaxable);
  const pension = Math.min(taxableMonthly * 0.045, 280000);
  const health = taxableMonthly * 0.03545;
  const longTermCare = health * 0.1295;
  const employment = taxableMonthly * 0.009;
  const annualTaxableApprox = Math.max(0, taxableMonthly * 12 - 1500000);

  let incomeTaxRate = 0.06;
  if (annualTaxableApprox >= 30000000 && annualTaxableApprox < 50000000) incomeTaxRate = 0.1;
  else if (annualTaxableApprox >= 50000000 && annualTaxableApprox < 70000000) incomeTaxRate = 0.14;
  else if (annualTaxableApprox >= 70000000 && annualTaxableApprox < 100000000) incomeTaxRate = 0.17;
  else if (annualTaxableApprox >= 100000000 && annualTaxableApprox < 140000000) incomeTaxRate = 0.2;
  else if (annualTaxableApprox >= 140000000) incomeTaxRate = 0.24;

  const incomeTax = taxableMonthly * incomeTaxRate;
  const localIncomeTax = incomeTax * 0.1;
  const deductions = pension + health + longTermCare + employment + incomeTax + localIncomeTax;
  const monthlyNet = Math.max(0, monthlyGross - deductions);
  const netRate = monthlyGross > 0 ? (monthlyNet / monthlyGross) * 100 : 0;

  return {
    monthlyGross,
    monthlyNet,
    netRate
  };
}

function renderSalary() {
  const currentAnnual = toNumber("currentAnnualInput");
  const bonus = toNumber("bonus");
  const annualLeavePay = toNumber("annualLeavePay");
  const includeBonus = isChecked("includeBonusToggle");
  const currentInfo = estimateNetFromAnnual(currentAnnual);
  const currentTotalComp = computeTotalComp(currentAnnual, bonus, annualLeavePay, includeBonus);
  const raises = [toNumber("raise1"), toNumber("raise2"), toNumber("raise3")];

  $("currentAnnualSalary").textContent = formatWon(currentAnnual);
  $("currentTotalComp").textContent = formatWon(currentTotalComp);
  $("currentGrossMonthly").textContent = formatWon(currentInfo.monthlyGross);
  $("currentNetDisplay").textContent = formatWon(currentInfo.monthlyNet);

  const scenarios = raises.map((raiseAmount) => {
    const raisedAnnual = currentAnnual + raiseAmount;
    const raisedInfo = estimateNetFromAnnual(raisedAnnual);
    return {
      raiseAmount,
      raisedAnnual,
      monthlyGrossIncrease: raisedInfo.monthlyGross - currentInfo.monthlyGross,
      monthlyNetIncrease: raisedInfo.monthlyNet - currentInfo.monthlyNet,
      expectedNet: raisedInfo.monthlyNet,
      expectedRate: raisedInfo.netRate,
      totalComp: computeTotalComp(raisedAnnual, bonus, annualLeavePay, includeBonus)
    };
  });

  const rows = [
    { label: "연봉 인상액", current: 0, values: scenarios.map((item) => item.raiseAmount) },
    { label: "인상 후 연봉", current: currentAnnual, values: scenarios.map((item) => item.raisedAnnual) },
    { label: "인상 후 총보상", current: currentTotalComp, values: scenarios.map((item) => item.totalComp) },
    { label: "월 세전 증가", current: 0, values: scenarios.map((item) => item.monthlyGrossIncrease) },
    { label: "월 실수령 증가", current: 0, values: scenarios.map((item) => item.monthlyNetIncrease) },
    { label: "예상 월 실수령", current: currentInfo.monthlyNet, values: scenarios.map((item) => item.expectedNet) },
    { label: "예상 실수령률", current: currentInfo.netRate, values: scenarios.map((item) => item.expectedRate), isPercent: true }
  ];

  $("resultTable").innerHTML = rows
    .map((row) => {
      const formatter = row.isPercent ? formatPct : formatWon;
      return `
        <tr>
          <td>${row.label}</td>
          <td>${formatter(row.current)}</td>
          <td>${formatter(row.values[0])}</td>
          <td>${formatter(row.values[1])}</td>
          <td>${formatter(row.values[2])}</td>
        </tr>
      `;
    })
    .join("");
}

function renderRetirement() {
  const annualSalary = toNumber("retirementAnnualSalary");
  const yearsOfService = toNumber("yearsOfService");
  const retirementBonus = toNumber("retirementBonus");
  const retirementLeavePay = toNumber("retirementLeavePay");
  const includeBonus = isChecked("retirementIncludeBonus");
  const retirementTaxRate = toNumber("retirementTaxRate");
  const salaryInfo = estimateNetFromAnnual(annualSalary);

  const avgMonthlyWage = salaryInfo.monthlyGross + (includeBonus ? retirementBonus / 12 : 0) + retirementLeavePay / 12;
  const retirementGross = avgMonthlyWage * yearsOfService;
  const estimatedTax = retirementGross * (retirementTaxRate / 100);
  const retirementNet = retirementGross - estimatedTax;

  $("retirementAvgMonthlyWage").textContent = formatWon(avgMonthlyWage);
  $("retirementGross").textContent = formatWon(retirementGross);
  $("retirementNet").textContent = formatWon(retirementNet);

  const rows = [
    ["월 기본 급여", salaryInfo.monthlyGross],
    ["월 보너스 반영분", includeBonus ? retirementBonus / 12 : 0],
    ["월 연차수당 반영분", retirementLeavePay / 12],
    ["평균임금 추정", avgMonthlyWage],
    ["근속연수", `${yearsOfService}년`],
    ["퇴직금 세전", retirementGross],
    ["퇴직소득세 추정", estimatedTax],
    ["퇴직금 세후", retirementNet]
  ];

  $("retirementTable").innerHTML = rows
    .map(([label, value]) => {
      const displayValue = typeof value === "string" ? value : formatWon(value);
      return `
        <tr>
          <td>${label}</td>
          <td>${displayValue}</td>
        </tr>
      `;
    })
    .join("");
}

function renderNegotiation() {
  const currentAnnual = toNumber("negCurrentAnnual");
  const targetAnnual = toNumber("negTargetAnnual");
  const currentInfo = estimateNetFromAnnual(currentAnnual);
  const targetInfo = estimateNetFromAnnual(targetAnnual);
  const raiseAmount = Math.max(0, targetAnnual - currentAnnual);
  const raisePct = currentAnnual > 0 ? (raiseAmount / currentAnnual) * 100 : 0;

  $("negRaiseAmount").textContent = formatWon(raiseAmount);
  $("negRaisePct").textContent = formatPct(raisePct);
  $("negMonthlyGrossIncrease").textContent = formatWon(targetInfo.monthlyGross - currentInfo.monthlyGross);
  $("negMonthlyNetIncrease").textContent = formatWon(targetInfo.monthlyNet - currentInfo.monthlyNet);

  const rows = [
    ["현재 연봉", currentAnnual],
    ["현재 월 실수령", currentInfo.monthlyNet],
    ["목표 연봉", targetAnnual],
    ["목표 월 실수령", targetInfo.monthlyNet],
    ["연봉 증가액", raiseAmount],
    ["연봉 인상률", formatPct(raisePct)],
    ["월 세전 증가", targetInfo.monthlyGross - currentInfo.monthlyGross],
    ["월 실수령 증가", targetInfo.monthlyNet - currentInfo.monthlyNet],
    ["목표 연봉 실수령률", formatPct(targetInfo.netRate)]
  ];

  $("negotiationTable").innerHTML = rows
    .map(([label, value]) => {
      const displayValue = typeof value === "string" ? value : formatWon(value);
      return `
        <tr>
          <td>${label}</td>
          <td>${displayValue}</td>
        </tr>
      `;
    })
    .join("");
}

function renderLeave() {
  const beforeNet = toNumber("leaveBeforeNet");
  const afterAnnual = toNumber("leaveAfterAnnual");
  const leaveMonthlyIncome = toNumber("leaveMonthlyIncome");
  const leaveMonths = toNumber("leaveMonths");
  const retirementPayout = toNumber("leaveRetirementPayout");
  const includeBonus = isChecked("leaveIncludeBonus");
  const leaveBonus = toNumber("leaveBonus");
  const leaveAnnualLeavePay = toNumber("leaveAnnualLeavePay");
  const afterInfo = estimateNetFromAnnual(afterAnnual);
  const monthlyGap = afterInfo.monthlyNet - leaveMonthlyIncome;
  const totalComp = computeTotalComp(afterAnnual, leaveBonus, leaveAnnualLeavePay, includeBonus);
  const bufferMonths = monthlyGap > 0 ? retirementPayout / monthlyGap : 0;

  $("leaveMonthlyIncomeCard").textContent = formatWon(leaveMonthlyIncome);
  $("leaveAfterMonthlyNet").textContent = formatWon(afterInfo.monthlyNet);
  $("leaveMonthlyGap").textContent = formatWon(monthlyGap);
  $("leaveBufferMonths").textContent = monthlyGap > 0 ? `${bufferMonths.toFixed(1)}개월` : "계산 불가";

  const rows = [
    ["휴직 전 월 실수령", beforeNet],
    ["휴직 중 월 수령", leaveMonthlyIncome],
    ["휴직 기간 총 수령", leaveMonthlyIncome * leaveMonths],
    ["복직 후 연봉", afterAnnual],
    ["복직 후 월 실수령", afterInfo.monthlyNet],
    ["복직 후 실수령률", formatPct(afterInfo.netRate)],
    ["휴직 대비 복직 후 차이", monthlyGap],
    ["휴직 전 대비 복직 후 차이", afterInfo.monthlyNet - beforeNet],
    ["복직 후 총보상", totalComp],
    ["중간정산 금액", retirementPayout],
    ["버퍼 가능 개월", monthlyGap > 0 ? `${bufferMonths.toFixed(1)}개월` : "계산 불가"]
  ];

  $("leaveTable").innerHTML = rows
    .map(([label, value]) => {
      const displayValue = typeof value === "string" ? value : formatWon(value);
      return `
        <tr>
          <td>${label}</td>
          <td>${displayValue}</td>
        </tr>
      `;
    })
    .join("");
}

function renderHints() {
  [
    ["currentAnnualInput", "currentAnnualInputHint"],
    ["bonus", "bonusHint"],
    ["annualLeavePay", "annualLeavePayHint"],
    ["raise1", "raise1Hint"],
    ["raise2", "raise2Hint"],
    ["raise3", "raise3Hint"],
    ["retirementAnnualSalary", "retirementAnnualSalaryHint"],
    ["retirementBonus", "retirementBonusHint"],
    ["retirementLeavePay", "retirementLeavePayHint"],
    ["negCurrentAnnual", "negCurrentAnnualHint"],
    ["negTargetAnnual", "negTargetAnnualHint"],
    ["leaveAfterAnnual", "leaveAfterAnnualHint"],
    ["leaveRetirementPayout", "leaveRetirementPayoutHint"],
    ["leaveBonus", "leaveBonusHint"],
    ["leaveAnnualLeavePay", "leaveAnnualLeavePayHint"]
  ].forEach(([inputId, hintId]) => setHint(inputId, hintId));
}

function bindEvents(ids, renderer) {
  ids.forEach((id) => {
    const el = $(id);
    if (!el) return;
    el.addEventListener(el.type === "checkbox" ? "change" : "input", () => {
      renderHints();
      renderer();
    });
  });
}

function initSalaryPage() {
  bindEvents(["currentAnnualInput", "bonus", "annualLeavePay", "includeBonusToggle", "raise1", "raise2", "raise3"], renderSalary);
  $("calcBtn")?.addEventListener("click", renderSalary);
  renderHints();
  renderSalary();
}

function initRetirementPage() {
  bindEvents(["retirementAnnualSalary", "yearsOfService", "retirementBonus", "retirementLeavePay", "retirementIncludeBonus", "retirementTaxRate"], renderRetirement);
  $("calcRetirementBtn")?.addEventListener("click", renderRetirement);
  renderHints();
  renderRetirement();
}

function initNegotiationPage() {
  bindEvents(["negCurrentAnnual", "negTargetAnnual"], renderNegotiation);
  $("calcNegotiationBtn")?.addEventListener("click", renderNegotiation);
  renderHints();
  renderNegotiation();
}

function initLeavePage() {
  bindEvents(["leaveBeforeNet", "leaveAfterAnnual", "leaveMonthlyIncome", "leaveMonths", "leaveRetirementPayout", "leaveBonus", "leaveAnnualLeavePay", "leaveIncludeBonus"], renderLeave);
  $("calcLeaveBtn")?.addEventListener("click", renderLeave);
  renderHints();
  renderLeave();
}

const page = document.querySelector("[data-calculator]")?.dataset.calculator;

if (page === "salary") initSalaryPage();
if (page === "retirement") initRetirementPage();
if (page === "negotiation") initNegotiationPage();
if (page === "leave") initLeavePage();
