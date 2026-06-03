(() => {
  const dataEl = document.getElementById("ubc-data");
  if (!dataEl) return;

  const cfg = JSON.parse(dataEl.textContent || "{}");
  const constants = cfg.constants;
  const periods = cfg.periods;
  const benefitDaysTable = cfg.benefitDaysTable;
  const leaveReasons = cfg.leaveReasons;
  const presets = cfg.presets;

  const q = (selector) => document.querySelector(selector);
  const qq = (selector) => Array.from(document.querySelectorAll(selector));
  const byData = (name) => q(`[data-ubc="${name}"]`);
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const formatNumber = (value) => Math.round(value).toLocaleString("ko-KR");
  const formatMoney = (value) => `${formatNumber(value)}원`;
  const formatManWon = (value) => {
    const rounded = Math.round(value);
    if (Math.abs(rounded) >= 10000) {
      const man = rounded / 10000;
      return `${man.toLocaleString("ko-KR", { maximumFractionDigits: 1 })}만 원`;
    }
    return formatMoney(rounded);
  };

  function parseMoney(value) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
  }

  function setValue(name, value) {
    const el = byData(name);
    if (!el) return;
    if (el.type === "checkbox") {
      el.checked = Boolean(value);
      return;
    }
    el.value = typeof value === "number" ? formatNumber(value) : value;
  }

  function getInput() {
    return {
      leaveDate: byData("leaveDate")?.value || "",
      age: clamp(Number(byData("age")?.value || 0), 15, 80),
      isDisabled: byData("isDisabled")?.checked || false,
      insurancePeriodId: byData("insurancePeriodId")?.value || "1y-3y",
      leaveReasonId: byData("leaveReasonId")?.value || "unknown",
      hasInsuredDays180: byData("hasInsuredDays180")?.checked || false,
      useDirectAverageWage: byData("useDirectAverageWage")?.checked || false,
      threeMonthWageTotal: parseMoney(byData("threeMonthWageTotal")?.value),
      threeMonthTotalDays: Math.max(1, Number(byData("threeMonthTotalDays")?.value || 92)),
      dailyAverageWage: parseMoney(byData("dailyAverageWage")?.value),
      dailyWorkHours: Number(byData("dailyWorkHours")?.value || 8),
      monthlyLivingCost: parseMoney(byData("monthlyLivingCost")?.value),
      retirementPay: parseMoney(byData("retirementPay")?.value),
      emergencyFund: parseMoney(byData("emergencyFund")?.value),
    };
  }

  function calculateAverageWage(input) {
    if (input.useDirectAverageWage && input.dailyAverageWage > 0) {
      return input.dailyAverageWage;
    }
    return input.threeMonthWageTotal / Math.max(1, input.threeMonthTotalDays);
  }

  function calculateDailyBenefit(dailyAverageWage) {
    const baseDailyBenefit = dailyAverageWage * constants.wageReplacementRate;
    const dailyBenefit = clamp(baseDailyBenefit, constants.dailyFloor, constants.dailyCap);
    const limitType =
      baseDailyBenefit < constants.dailyFloor
        ? "floor"
        : baseDailyBenefit > constants.dailyCap
          ? "cap"
          : "standard";
    return { baseDailyBenefit, dailyBenefit, limitType };
  }

  function getPeriod(input) {
    return periods.find((period) => period.id === input.insurancePeriodId) || periods[1];
  }

  function getLeaveReason(input) {
    return leaveReasons.find((reason) => reason.id === input.leaveReasonId) || leaveReasons.at(-1);
  }

  function getBenefitDays(input) {
    const period = getPeriod(input);
    const ageGroup = input.isDisabled || input.age >= 50 ? "over50OrDisabled" : "under50";
    return {
      days: benefitDaysTable[ageGroup][period.index],
      ageGroup,
      period,
    };
  }

  function getDeadlineLabel(leaveDate) {
    if (!leaveDate) return "퇴사일 기준 12개월 내 수급 필요";
    const date = new Date(`${leaveDate}T00:00:00`);
    if (Number.isNaN(date.getTime())) return "퇴사일 기준 12개월 내 수급 필요";
    date.setMonth(date.getMonth() + constants.applicationMonthsLimit);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 전후까지 유의`;
  }

  function buildEligibilityChecks(input, reason) {
    return [
      {
        label: "피보험단위기간 180일 이상",
        status: input.hasInsuredDays180 ? "ok" : "risk",
        description: input.hasInsuredDays180
          ? "기본 기간 요건을 충족한 것으로 입력됐습니다."
          : "180일 요건을 충족하지 못하면 수급이 어려울 수 있습니다.",
      },
      {
        label: "퇴사 사유",
        status: reason.status,
        description: reason.note,
      },
      {
        label: "근로 의사와 능력",
        status: "check",
        description: "일할 의사와 능력이 있어야 하며 실업인정 과정에서 확인됩니다.",
      },
      {
        label: "적극적 재취업 활동",
        status: "check",
        description: "실업인정일마다 구직활동 등 재취업 노력을 인정받아야 합니다.",
      },
      {
        label: "12개월 내 수급",
        status: "check",
        description: getDeadlineLabel(input.leaveDate),
      },
    ];
  }

  function buildInterpretation(input, result) {
    const limitMessages = {
      floor: `평균임금의 60%가 2026년 1일 하한액 ${formatMoney(constants.dailyFloor)}보다 낮아 하한액이 적용됐습니다.`,
      cap: `평균임금의 60%가 2026년 1일 상한액 ${formatMoney(constants.dailyCap)}을 초과해 상한액이 적용됐습니다.`,
      standard: "평균임금의 60%가 상한·하한 범위 안에 있어 평균임금 기준 금액이 적용됐습니다.",
    };
    return `입력한 조건 기준 1일 구직급여액은 ${formatMoney(result.dailyBenefit)}으로 추정됩니다. ${limitMessages[result.limitType]} ${result.period.label}, ${result.ageGroup === "over50OrDisabled" ? "50세 이상 및 장애인" : "50세 미만"} 기준 예상 수급기간은 ${result.benefitDays}일입니다.`;
  }

  function calculate(input) {
    const dailyAverageWage = calculateAverageWage(input);
    const daily = calculateDailyBenefit(dailyAverageWage);
    const benefitDays = getBenefitDays(input);
    const reason = getLeaveReason(input);
    const totalBenefit = daily.dailyBenefit * benefitDays.days;
    const livingSource = totalBenefit + input.retirementPay + input.emergencyFund;
    const livingCostMonths = input.monthlyLivingCost > 0
      ? livingSource / input.monthlyLivingCost
      : null;
    const result = {
      ...daily,
      dailyAverageWage,
      benefitDays: benefitDays.days,
      ageGroup: benefitDays.ageGroup,
      period: benefitDays.period,
      reason,
      totalBenefit,
      monthlyEquivalent30Days: daily.dailyBenefit * 30,
      monthlyEquivalent28Days: daily.dailyBenefit * 28,
      livingSource,
      livingCostMonths,
      eligibilityChecks: buildEligibilityChecks(input, reason),
    };
    result.interpretation = buildInterpretation(input, result);
    return result;
  }

  function renderChecklist(result) {
    const container = q("#ubcChecklist");
    if (!container) return;
    const statusLabel = {
      ok: "충족",
      check: "확인 필요",
      risk: "주의",
    };
    container.innerHTML = result.eligibilityChecks.map((item) => `
      <article class="ubc-checklist__item ubc-checklist__item--${item.status}">
        <span>${statusLabel[item.status]}</span>
        <div>
          <strong>${item.label}</strong>
          <p>${item.description}</p>
        </div>
      </article>
    `).join("");
  }

  function renderDaysTable(result) {
    qq("[data-ubc-day-cell]").forEach((cell) => cell.classList.remove("is-active"));
    const activeKey = `${result.ageGroup}-${result.period.index}`;
    q(`[data-ubc-day-cell="${activeKey}"]`)?.classList.add("is-active");
  }

  function renderResult(result) {
    q("#ubcTotalBenefit").textContent = formatManWon(result.totalBenefit);
    q("#ubcDailyBenefit").textContent = formatMoney(result.dailyBenefit);
    q("#ubcBenefitDays").textContent = `${result.benefitDays}일`;
    q("#ubcMonthlyEquivalent").textContent = `약 ${formatManWon(result.monthlyEquivalent30Days)}`;
    q("#ubcBenefitDaysContext").textContent = `${result.period.label} · ${result.ageGroup === "over50OrDisabled" ? "50세 이상 및 장애인" : "50세 미만"}`;

    const limitLabel = {
      floor: "하한액 적용",
      standard: "평균임금 기준",
      cap: "상한액 적용",
    }[result.limitType];
    const limitBadge = q("#ubcLimitBadge");
    const limitCard = q("#ubcLimitCard");
    q("#ubcLimitType").textContent = limitLabel;
    limitBadge.textContent = limitLabel;
    limitCard.classList.remove("ubc-limit-card--floor", "ubc-limit-card--standard", "ubc-limit-card--cap");
    limitCard.classList.add(`ubc-limit-card--${result.limitType}`);
    q("#ubcInterpretation").textContent = result.interpretation;

    q("#ubcLivingSource").textContent = formatManWon(result.livingSource);
    if (result.livingCostMonths === null) {
      q("#ubcLivingMonths").textContent = "생활비 입력 필요";
      q("#ubcLivingMessage").textContent = "월 생활비를 입력하면 예상 실업급여와 보유 현금으로 버틸 수 있는 기간을 계산합니다.";
    } else {
      q("#ubcLivingMonths").textContent = `약 ${result.livingCostMonths.toLocaleString("ko-KR", { maximumFractionDigits: 1 })}개월`;
      q("#ubcLivingMessage").textContent = `월 생활비 기준으로 실업급여, 퇴직금, 비상금을 합치면 약 ${result.livingCostMonths.toLocaleString("ko-KR", { maximumFractionDigits: 1 })}개월을 버틸 수 있습니다. 실제 지급 일정은 실업인정 회차에 따라 달라질 수 있습니다.`;
    }

    renderChecklist(result);
    renderDaysTable(result);
  }

  function update() {
    const input = getInput();
    const result = calculate(input);
    renderResult(result);
  }

  function applyPreset(id) {
    const preset = presets.find((item) => item.id === id);
    if (!preset) return;
    Object.entries(preset.input).forEach(([name, value]) => setValue(name, value));
    qq("[data-ubc-preset]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.ubcPreset === id);
    });
    update();
  }

  function reset() {
    applyPreset("salary-350-3y");
    setValue("leaveDate", new Date().toISOString().slice(0, 10));
    setValue("isDisabled", false);
    setValue("useDirectAverageWage", false);
    setValue("dailyWorkHours", "8");
    update();
  }

  function copyResult() {
    const text = [
      "실업급여 계산기 2026 결과",
      `예상 총 실업급여: ${q("#ubcTotalBenefit")?.textContent || "-"}`,
      `1일 구직급여액: ${q("#ubcDailyBenefit")?.textContent || "-"}`,
      `예상 수급기간: ${q("#ubcBenefitDays")?.textContent || "-"}`,
      `월 환산액: ${q("#ubcMonthlyEquivalent")?.textContent || "-"}`,
      "실제 수급 여부와 지급액은 고용센터 확인이 필요합니다.",
    ].join("\n");
    navigator.clipboard?.writeText(text);
  }

  function bindEvents() {
    qq("[data-ubc]").forEach((element) => {
      element.addEventListener("input", update);
      element.addEventListener("change", update);
      if (element.inputMode === "numeric" || element.classList.contains("input-number")) {
        element.addEventListener("blur", () => {
          if (element.type !== "number" && element.type !== "date" && element.tagName !== "SELECT") {
            element.value = formatNumber(parseMoney(element.value));
          }
        });
      }
    });
    qq("[data-ubc-preset]").forEach((button) => {
      button.addEventListener("click", () => applyPreset(button.dataset.ubcPreset));
    });
    q("#ubcResetBtn")?.addEventListener("click", reset);
    q("#ubcCopyBtn")?.addEventListener("click", copyResult);
  }

  bindEvents();
  applyPreset("salary-350-3y");
  setValue("leaveDate", new Date().toISOString().slice(0, 10));
})();

