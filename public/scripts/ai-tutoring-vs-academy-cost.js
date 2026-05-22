(function () {
  const dataEl = document.getElementById("atacData");
  if (!dataEl) return;

  const seed = JSON.parse(dataEl.textContent || "{}");
  const defaults = seed.defaults || {};
  const subjects = seed.subjects || [];
  const presets = seed.presets || [];

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const number = (id, fallback = 0) => {
    const el = document.getElementById(id);
    const value = Number(el && el.value);
    return Number.isFinite(value) ? value : fallback;
  };
  const bool = (id) => Boolean(document.getElementById(id)?.checked);
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const formatWon = (value) => `${Math.round(value).toLocaleString("ko-KR")}원`;
  const formatSignedWon = (value) => `${value >= 0 ? "" : "-"}${formatWon(Math.abs(value))}`;
  const pct = (value) => `${Math.round(value).toLocaleString("ko-KR")}%`;

  function checkedValues(name) {
    return $$(`input[name="${name}"]:checked`).map((input) => input.value);
  }

  function setValue(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.type === "checkbox") {
      el.checked = Boolean(value);
    } else {
      el.value = value;
    }
  }

  function setCheckedGroup(name, values) {
    $$(`input[name="${name}"]`).forEach((input) => {
      input.checked = values.includes(input.value);
    });
  }

  function setRadio(name, value) {
    $$(`input[name="${name}"]`).forEach((input) => {
      input.checked = input.value === value;
    });
  }

  function readInput(overrides = {}) {
    const input = {
      gradeLevel: $("#atac-grade-level")?.value || defaults.gradeLevel,
      childCount: number("atac-child-count", defaults.childCount),
      subjectCount: number("atac-subject-count", defaults.subjectCount),
      subjects: checkedValues("atac-subjects"),
      weeklyClassCount: number("atac-weekly-class-count", defaults.weeklyClassCount),
      minutesPerClass: number("atac-minutes-per-class", defaults.minutesPerClass),
      weeksPerMonth: number("atac-weeks-per-month", defaults.weeksPerMonth),
      academyFeePerSubject: number("atac-academy-fee", defaults.academyFeePerSubject),
      usePrivateTutoring: bool("atac-use-private-tutoring"),
      tutoringHourlyRate: number("atac-tutoring-hourly-rate", defaults.tutoringHourlyRate),
      weeklyTutoringHours: number("atac-weekly-tutoring-hours", defaults.weeklyTutoringHours),
      monthlyMaterialCost: number("atac-material-cost", defaults.monthlyMaterialCost),
      monthlyTransportCost: number("atac-transport-cost", defaults.monthlyTransportCost),
      monthlySnackCost: number("atac-snack-cost", defaults.monthlySnackCost),
      selectedAiTools: checkedValues("atac-ai-tools"),
      chatgptPrice: number("atac-chatgpt-price", defaults.chatgptPrice),
      khanmigoPrice: number("atac-khanmigo-price", defaults.khanmigoPrice),
      wrtnPrice: number("atac-wrtn-price", defaults.wrtnPrice),
      otherAiPrice: number("atac-other-ai-price", defaults.otherAiPrice),
      aiMaterialCost: number("atac-ai-material-cost", defaults.aiMaterialCost),
      parentWeeklyCareHours: number("atac-parent-weekly-care-hours", defaults.parentWeeklyCareHours),
      parentHourlyValue: number("atac-parent-hourly-value", defaults.parentHourlyValue),
      includeParentTimeCost: bool("atac-include-parent-time-cost"),
      scenarioType: document.querySelector('input[name="atac-scenario-type"]:checked')?.value || defaults.scenarioType,
      aiReplaceRate: number("atac-ai-replace-rate", defaults.aiReplaceRate),
      academySubjectsKept: number("atac-academy-subjects-kept", defaults.academySubjectsKept),
      classReductionRate: number("atac-class-reduction-rate", defaults.classReductionRate),
      riskLevel: $("#atac-risk-level")?.value || defaults.riskLevel,
    };

    input.subjects = input.subjects.length ? input.subjects : ["other"];
    input.subjectCount = Math.max(1, input.subjectCount);
    return { ...input, ...overrides };
  }

  function scoreSubjects(input) {
    const gradeAdjustment = { elementaryLow: -12, elementaryHigh: -6, middle: 0, high: -10 }[input.gradeLevel] || 0;
    const riskAdjustment = { low: 5, medium: 0, high: -10 }[input.riskLevel] || 0;
    return input.subjects.map((id) => {
      const subject = subjects.find((item) => item.id === id) || subjects.find((item) => item.id === "other");
      const score = clamp((subject?.baseScore || 55) + gradeAdjustment + riskAdjustment, 0, 100);
      return { id, label: subject?.label || "기타", note: subject?.note || "", score };
    });
  }

  function calculate(input) {
    const academy = input.academyFeePerSubject * input.subjectCount * input.childCount;
    const tutoring = input.usePrivateTutoring
      ? input.tutoringHourlyRate * input.weeklyTutoringHours * input.weeksPerMonth * input.childCount
      : 0;
    const extra = input.monthlyMaterialCost + input.monthlyTransportCost + input.monthlySnackCost;
    const currentTotal = academy + tutoring + extra;

    const aiPriceMap = {
      chatgpt: input.chatgptPrice,
      khanmigo: input.khanmigoPrice,
      wrtn: input.wrtnPrice,
      other: input.otherAiPrice,
    };
    const aiSubscriptions = input.selectedAiTools.reduce((sum, id) => sum + (aiPriceMap[id] || 0), 0);
    const keptAcademy = input.academyFeePerSubject * Math.min(input.academySubjectsKept, input.subjectCount) * input.childCount;
    const reducedExtra = extra * (1 - clamp(input.classReductionRate, 0, 100) / 100);
    const parentTimeCost = input.includeParentTimeCost
      ? input.parentWeeklyCareHours * input.parentHourlyValue * input.weeksPerMonth
      : 0;
    const aiTotal = aiSubscriptions + keptAcademy + reducedExtra + parentTimeCost + input.aiMaterialCost;
    const monthlySaving = currentTotal - aiTotal;
    const annualSaving = monthlySaving * 12;
    const savingRate = currentTotal > 0 ? (monthlySaving / currentTotal) * 100 : 0;
    const subjectScores = scoreSubjects(input);
    const averageScore = subjectScores.reduce((sum, item) => sum + item.score, 0) / subjectScores.length;
    const monthlyClassCount = Math.max(1, input.weeklyClassCount * input.weeksPerMonth);
    const oneClassCost = currentTotal / monthlyClassCount;
    const breakevenCount = oneClassCost > 0 ? Math.ceil(Math.max(0, aiSubscriptions + input.aiMaterialCost + parentTimeCost) / oneClassCost) : 0;

    let recommendation = {
      type: "academy",
      label: "학원 유지 권장",
      summary: "입시 리스크나 과목 난도가 높아 AI는 보조 도구로 두는 편이 안전합니다.",
    };
    if (input.riskLevel !== "high" && averageScore >= 78 && savingRate >= 40) {
      recommendation = {
        type: "fullAi",
        label: "완전 대체 검토 가능",
        summary: "대체 가능 과목 비중이 높고 비용 절감 폭도 커서 단계적 완전 전환을 검토할 수 있습니다.",
      };
    } else if (input.riskLevel !== "high" && averageScore >= 60 && savingRate >= 20) {
      recommendation = {
        type: "hybrid",
        label: "하이브리드 전환 권장",
        summary: "핵심 과목은 유지하고 반복 학습·첨삭·질문 풀이를 AI로 넘기는 구성이 가장 현실적입니다.",
      };
    }

    return {
      academy,
      tutoring,
      extra,
      currentTotal,
      aiSubscriptions,
      keptAcademy,
      reducedExtra,
      parentTimeCost,
      aiTotal,
      monthlySaving,
      annualSaving,
      savingRate,
      subjectScores,
      averageScore,
      breakevenCount,
      recommendation,
    };
  }

  function scenarioResult(input, type) {
    const scenarioInput = { ...input };
    if (type === "fullAi") {
      scenarioInput.academySubjectsKept = 0;
      scenarioInput.classReductionRate = 100;
      scenarioInput.aiReplaceRate = 90;
    }
    if (type === "hybrid") {
      scenarioInput.academySubjectsKept = Math.min(1, input.subjectCount);
      scenarioInput.classReductionRate = 50;
      scenarioInput.aiReplaceRate = 50;
    }
    if (type === "academy") {
      scenarioInput.academySubjectsKept = input.subjectCount;
      scenarioInput.classReductionRate = 0;
      scenarioInput.aiReplaceRate = 10;
    }
    return calculate(scenarioInput);
  }

  function render(input, result) {
    $("#atac-current-monthly-cost").textContent = formatWon(result.currentTotal);
    $("#atac-ai-monthly-cost").textContent = formatWon(result.aiTotal);
    $("#atac-monthly-saving").textContent = formatSignedWon(result.monthlySaving);
    $("#atac-annual-saving").textContent = formatSignedWon(result.annualSaving);
    $("#atac-saving-rate").textContent = pct(result.savingRate);
    $("#atac-recommendation-label").textContent = result.recommendation.label;
    $("#atac-recommendation-summary").textContent = result.recommendation.summary;
    $("#atac-breakeven-count").textContent = `${result.breakevenCount.toLocaleString("ko-KR")}회`;
    $("#atac-parent-time-cost").textContent = formatWon(result.parentTimeCost);

    const resultPanel = $("#atac-result-panel");
    if (resultPanel) resultPanel.dataset.tone = result.monthlySaving >= 0 ? "positive" : "negative";

    $("#atac-subject-score-list").innerHTML = result.subjectScores
      .map(
        (item) => `
          <article class="atac-score-row">
            <div>
              <strong>${item.label}</strong>
              <span>${item.note}</span>
            </div>
            <b>${Math.round(item.score)}점</b>
            <i style="--score:${item.score}%"></i>
          </article>
        `
      )
      .join("");

    const rows = [
      ["현재 학원비", result.academy, "사용자 입력"],
      ["현재 개인 과외비", result.tutoring, input.usePrivateTutoring ? "사용자 입력" : "미사용"],
      ["현재 교재·교통·간식비", result.extra, "사용자 입력"],
      ["AI 구독료", result.aiSubscriptions, "가격 확인 필요"],
      ["유지 학원비", result.keptAcademy, "시뮬레이션"],
      ["보호자 시간 비용", result.parentTimeCost, input.includeParentTimeCost ? "추정" : "제외"],
      ["AI 전환 후 부대비용", result.reducedExtra + input.aiMaterialCost, "시뮬레이션"],
    ];
    $("#atac-cost-breakdown-table").innerHTML = rows
      .map(
        ([label, value, badge]) => `
          <tr>
            <th>${label}</th>
            <td>${formatWon(value)}</td>
            <td><span class="atac-badge">${badge}</span></td>
          </tr>
        `
      )
      .join("");

    const scenarioLabels = {
      fullAi: "완전 대체",
      hybrid: "하이브리드",
      academy: "학원 유지",
    };
    $("#atac-scenario-comparison").innerHTML = ["fullAi", "hybrid", "academy"]
      .map((type) => {
        const item = scenarioResult(input, type);
        return `
          <article class="atac-scenario-card${type === input.scenarioType ? " is-active" : ""}">
            <span>${scenarioLabels[type]}</span>
            <strong>${formatSignedWon(item.monthlySaving)}</strong>
            <small>월 절감액 · ${pct(item.savingRate)}</small>
          </article>
        `;
      })
      .join("");

    $$(".atac-scenario-option").forEach((label) => {
      label.classList.toggle("is-active", label.querySelector("input")?.checked);
    });
    $("#atac-ai-replace-rate-value").textContent = pct(input.aiReplaceRate);
    $("#atac-class-reduction-rate-value").textContent = pct(input.classReductionRate);
  }

  function calculateAndRender() {
    const input = readInput();
    render(input, calculate(input));
  }

  function applyPreset(id) {
    const preset = presets.find((item) => item.id === id);
    if (!preset) return;
    Object.entries(preset.values).forEach(([key, value]) => {
      const idMap = {
        gradeLevel: "atac-grade-level",
        subjectCount: "atac-subject-count",
        weeklyClassCount: "atac-weekly-class-count",
        academyFeePerSubject: "atac-academy-fee",
        aiReplaceRate: "atac-ai-replace-rate",
        academySubjectsKept: "atac-academy-subjects-kept",
        classReductionRate: "atac-class-reduction-rate",
        riskLevel: "atac-risk-level",
      };
      if (key === "subjects") setCheckedGroup("atac-subjects", value);
      if (idMap[key]) setValue(idMap[key], value);
    });
    $$(".atac-preset-btn").forEach((button) => button.classList.toggle("is-active", button.dataset.atacPreset === id));
    calculateAndRender();
  }

  function resetDefaults() {
    setValue("atac-grade-level", defaults.gradeLevel);
    setValue("atac-child-count", defaults.childCount);
    setValue("atac-subject-count", defaults.subjectCount);
    setCheckedGroup("atac-subjects", defaults.subjects);
    setValue("atac-weekly-class-count", defaults.weeklyClassCount);
    setValue("atac-minutes-per-class", defaults.minutesPerClass);
    setValue("atac-weeks-per-month", defaults.weeksPerMonth);
    setValue("atac-academy-fee", defaults.academyFeePerSubject);
    setValue("atac-use-private-tutoring", defaults.usePrivateTutoring);
    setValue("atac-tutoring-hourly-rate", defaults.tutoringHourlyRate);
    setValue("atac-weekly-tutoring-hours", defaults.weeklyTutoringHours);
    setValue("atac-material-cost", defaults.monthlyMaterialCost);
    setValue("atac-transport-cost", defaults.monthlyTransportCost);
    setValue("atac-snack-cost", defaults.monthlySnackCost);
    setCheckedGroup("atac-ai-tools", defaults.selectedAiTools);
    setValue("atac-chatgpt-price", defaults.chatgptPrice);
    setValue("atac-khanmigo-price", defaults.khanmigoPrice);
    setValue("atac-wrtn-price", defaults.wrtnPrice);
    setValue("atac-other-ai-price", defaults.otherAiPrice);
    setValue("atac-ai-material-cost", defaults.aiMaterialCost);
    setValue("atac-parent-weekly-care-hours", defaults.parentWeeklyCareHours);
    setValue("atac-parent-hourly-value", defaults.parentHourlyValue);
    setValue("atac-include-parent-time-cost", defaults.includeParentTimeCost);
    setRadio("atac-scenario-type", defaults.scenarioType);
    setValue("atac-ai-replace-rate", defaults.aiReplaceRate);
    setValue("atac-academy-subjects-kept", defaults.academySubjectsKept);
    setValue("atac-class-reduction-rate", defaults.classReductionRate);
    setValue("atac-risk-level", defaults.riskLevel);
    $$(".atac-preset-btn").forEach((button) => button.classList.remove("is-active"));
    calculateAndRender();
  }

  async function copyLink() {
    const input = readInput();
    const params = new URLSearchParams({
      grade: input.gradeLevel,
      subjects: input.subjects.join(","),
      fee: String(input.academyFeePerSubject),
      scenario: input.scenarioType,
      replace: String(input.aiReplaceRate),
    });
    const url = `${location.origin}${location.pathname}?${params.toString()}`;
    await navigator.clipboard?.writeText(url);
    const button = $("#atacCopyLinkBtn");
    if (button) {
      const old = button.textContent;
      button.textContent = "링크 복사됨";
      setTimeout(() => {
        button.textContent = old;
      }, 1400);
    }
  }

  $$("input, select").forEach((el) => {
    el.addEventListener("input", calculateAndRender);
    el.addEventListener("change", calculateAndRender);
  });
  $$("[data-atac-preset]").forEach((button) => button.addEventListener("click", () => applyPreset(button.dataset.atacPreset)));
  $("#atacResetBtn")?.addEventListener("click", resetDefaults);
  $("#atacCopyLinkBtn")?.addEventListener("click", copyLink);
  calculateAndRender();
})();
