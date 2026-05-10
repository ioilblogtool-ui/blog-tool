const $ = (id) => document.getElementById(id);
const won = (v) => `${Math.round(v).toLocaleString("ko-KR")}원`;
const hours = (v) => `${Number(v).toFixed(1)}시간`;
const pct = (v) => `${Number(v).toFixed(1)}%`;
let config = { presets: [], toolCosts: [] };

function n(id) {
  return Number($(id)?.value || 0) || 0;
}

function calculate(input) {
  const weeklyWorkHours = Math.max(1, input.weeklyWorkHours);
  const weeklyRepetitiveHours = Math.min(Math.max(0, input.weeklyRepetitiveHours), weeklyWorkHours);
  const monthlyWorkHours = weeklyWorkHours * 4.3;
  const hourlyWage = input.monthlyIncome / monthlyWorkHours;
  const weeklySavedHours = weeklyRepetitiveHours * (input.aiSavingRate / 100);
  const monthlySavedHours = weeklySavedHours * 4.3;
  const monthlySavedValue = monthlySavedHours * hourlyWage * input.memberCount;
  const monthlyTotalCost = input.monthlyAiCost * input.memberCount;
  const monthlyNetProfit = monthlySavedValue - monthlyTotalCost;
  const annualTotalCost = monthlyTotalCost * 12 + input.initialSetupCost;
  const annualNetProfit = monthlySavedValue * 12 - annualTotalCost;
  const breakEvenMonth = monthlyNetProfit > 0 ? input.initialSetupCost / monthlyNetProfit : null;
  const roiPercent = annualTotalCost > 0 ? (annualNetProfit / annualTotalCost) * 100 : 0;
  const roiGrade = roiPercent >= 300 ? "excellent" : roiPercent >= 100 ? "good" : roiPercent >= 0 ? "neutral" : "loss";
  return { hourlyWage, weeklySavedHours, monthlySavedHours, monthlySavedValue, monthlyTotalCost, monthlyNetProfit, annualTotalCost, annualNetProfit, breakEvenMonth, roiPercent, roiGrade };
}

function readForm() {
  return {
    userType: $("awrUserType")?.value || "employee",
    monthlyIncome: n("awrMonthlyIncome"),
    weeklyWorkHours: n("awrWeeklyWorkHours"),
    weeklyRepetitiveHours: n("awrRepetitiveHours"),
    aiSavingRate: n("awrSavingRate"),
    monthlyAiCost: n("awrMonthlyAiCost"),
    initialSetupCost: n("awrInitialCost"),
    memberCount: Math.max(1, n("awrMemberCount")),
  };
}

function gradeText(result) {
  if (result.roiGrade === "excellent") return ["매우 좋음", "AI 도구 비용 대비 시간절감 효과가 매우 큽니다. 유료 플랜 유지 또는 상위 플랜 검토가 가능합니다."];
  if (result.roiGrade === "good") return ["좋음", "비용 대비 절감 효과가 양호합니다. 반복업무가 꾸준하다면 현재 플랜 유지가 합리적입니다."];
  if (result.roiGrade === "neutral") return ["애매함", "효과는 있으나 압도적인 수준은 아닙니다. 무료/저가 플랜과 비교해보는 것이 좋습니다."];
  return ["손해", "현재 입력값 기준으로는 비용이 절감 효과보다 큽니다. 사용 목적을 재정의하거나 적용 업무를 좁혀보세요."];
}

function render() {
  const input = readForm();
  $("awrSavingRateLabel").textContent = `${input.aiSavingRate}%`;
  const result = calculate(input);
  const [title, body] = gradeText(result);
  $("awrHourlyWage").textContent = won(result.hourlyWage);
  $("awrMonthlySavedHours").textContent = hours(result.monthlySavedHours);
  $("awrMonthlySavedValue").textContent = won(result.monthlySavedValue);
  $("awrMonthlyNetProfit").textContent = won(result.monthlyNetProfit);
  $("awrAnnualNetProfit").textContent = won(result.annualNetProfit);
  $("awrBreakEven").textContent = result.breakEvenMonth === null ? "회수 불가" : result.breakEvenMonth <= 0 ? "즉시 회수" : `${result.breakEvenMonth.toFixed(1)}개월`;
  $("awrRoi").textContent = pct(result.roiPercent);
  $("awrTier").textContent = result.monthlyNetProfit >= 200000 ? "유료 AI 도구 또는 팀 플랜 추천" : result.monthlyNetProfit >= 50000 ? "개인 유료 플랜 추천" : result.monthlyNetProfit > 0 ? "무료 또는 저가 플랜 추천" : "무료 AI 도구 우선";
  $("awrGradeTitle").textContent = title;
  $("awrGradeText").textContent = body;
  $("awrGradeBox").dataset.grade = result.roiGrade;
  $("awrDetailBody").innerHTML = [
    ["주간 절감 시간", hours(result.weeklySavedHours)],
    ["월간 총비용", won(result.monthlyTotalCost)],
    ["연간 총비용", won(result.annualTotalCost)],
    ["연간 ROI", pct(result.roiPercent)],
  ].map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join("");
}

function applyPreset(id) {
  const preset = config.presets.find((item) => item.id === id);
  if (!preset) return;
  $("awrUserType").value = preset.userType;
  $("awrMonthlyIncome").value = preset.monthlyIncome;
  $("awrWeeklyWorkHours").value = preset.weeklyWorkHours;
  $("awrRepetitiveHours").value = preset.weeklyRepetitiveHours;
  $("awrSavingRate").value = preset.aiSavingRate;
  $("awrMonthlyAiCost").value = preset.monthlyAiCost;
  $("awrInitialCost").value = preset.initialSetupCost;
  $("awrMemberCount").value = preset.memberCount;
  document.querySelectorAll("[data-awr-preset]").forEach((btn) => btn.classList.toggle("is-active", btn.dataset.awrPreset === id));
  render();
}

document.addEventListener("DOMContentLoaded", () => {
  const seed = $("awrConfig");
  config = seed ? JSON.parse(seed.textContent || "{}") : config;
  document.querySelectorAll("#awrForm input, #awrForm select").forEach((el) => {
    el.addEventListener("input", render);
    el.addEventListener("change", render);
  });
  document.querySelectorAll("[data-awr-preset]").forEach((btn) => btn.addEventListener("click", () => applyPreset(btn.dataset.awrPreset)));
  document.querySelectorAll("[data-awr-cost]").forEach((btn) => btn.addEventListener("click", () => {
    $("awrMonthlyAiCost").value = btn.dataset.awrCost;
    render();
  }));
  $("awrResetBtn")?.addEventListener("click", () => applyPreset(config.presets[0]?.id));
  $("awrCopyLinkBtn")?.addEventListener("click", async () => {
    await navigator.clipboard?.writeText(window.location.href);
  });
  render();
});

