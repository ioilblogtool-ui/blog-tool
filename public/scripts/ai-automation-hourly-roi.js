const configNode = document.getElementById("aiHourlyRoiConfig");

if (configNode) {
  const config = JSON.parse(configNode.textContent || "{}");
  const defaults = config.defaults || {};
  const presets = config.presets || [];
  const weeksPerMonth = Number(config.weeksPerMonth || 4.345);

  const currency = new Intl.NumberFormat("ko-KR");
  const decimal = new Intl.NumberFormat("ko-KR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  const $ = (id) => document.getElementById(id);

  const elements = {
    form: $("aiHourlyRoiForm"),
    salary: $("ahrMonthlySalary"),
    monthlyWorkHours: $("ahrMonthlyWorkHours"),
    weeklyRepeatHours: $("ahrWeeklyRepeatHours"),
    weeklySavedHours: $("ahrWeeklySavedHours"),
    monthlyToolCost: $("ahrMonthlyToolCost"),
    users: $("ahrUsers"),
    usersField: $("ahrUsersField"),
    annualWorkingMonths: $("ahrAnnualWorkingMonths"),
    multiplier: $("ahrMultiplier"),
    currentHourly: $("ahrCurrentHourly"),
    afterHourly: $("ahrAfterHourly"),
    afterHourlySub: $("ahrAfterHourlySub"),
    monthlyEffect: $("ahrMonthlyEffect"),
    monthlyEffectSub: $("ahrMonthlyEffectSub"),
    annualEffect: $("ahrAnnualEffect"),
    annualEffectSub: $("ahrAnnualEffectSub"),
    payback: $("ahrPayback"),
    paybackSub: $("ahrPaybackSub"),
    resultBox: $("ahrResultBox"),
    resultTitle: $("ahrResultTitle"),
    resultText: $("ahrResultText"),
    summaryBody: $("ahrSummaryBody"),
    scenarioBody: $("ahrScenarioBody"),
    resetBtn: $("resetAhrBtn"),
    copyBtn: $("copyAhrLinkBtn"),
  };

  const readRadio = (name, fallback) => {
    const checked = document.querySelector(`input[name="${name}"]:checked`);
    return checked ? checked.value : fallback;
  };

  const numberValue = (input, fallback) => {
    const value = Number(input?.value);
    return Number.isFinite(value) ? value : fallback;
  };

  const setRadio = (name, value) => {
    const target = document.querySelector(`input[name="${name}"][value="${value}"]`);
    if (target) {
      target.checked = true;
    }
  };

  const formatWon = (value) => `${currency.format(Math.round(value))}원`;
  const formatHours = (value) => `${decimal.format(value)}시간`;
  const formatMonths = (value) => `${decimal.format(value)}개월`;
  const formatPercent = (value) => `${decimal.format(value)}%`;

  const readState = () => {
    const mode = readRadio("ahrMode", defaults.mode || "personal");
    const users = mode === "team" ? Math.max(1, numberValue(elements.users, defaults.users || 1)) : 1;

    return {
      mode,
      salaryMode: readRadio("ahrSalaryMode", defaults.salaryMode || "gross"),
      monthlySalary: Math.max(0, numberValue(elements.salary, defaults.monthlySalary || 0)),
      monthlyWorkHours: Math.max(1, numberValue(elements.monthlyWorkHours, defaults.monthlyWorkHours || 209)),
      weeklyRepeatHours: Math.max(0, numberValue(elements.weeklyRepeatHours, defaults.weeklyRepeatHours || 0)),
      weeklySavedHours: Math.max(0, numberValue(elements.weeklySavedHours, defaults.weeklySavedHours || 0)),
      monthlyToolCost: Math.max(0, numberValue(elements.monthlyToolCost, defaults.monthlyToolCost || 0)),
      users,
      multiplier: Number(elements.multiplier?.value || defaults.multiplier || 1.2),
      annualWorkingMonths: Math.min(12, Math.max(1, numberValue(elements.annualWorkingMonths, defaults.annualWorkingMonths || 12))),
    };
  };

  const calculate = (state) => {
    const weeklySavedHours = Math.min(state.weeklySavedHours, state.weeklyRepeatHours);
    const monthlyRepeatHours = state.weeklyRepeatHours * weeksPerMonth;
    const monthlySavedHours = weeklySavedHours * weeksPerMonth;
    const currentHourlyRate = state.monthlySalary / state.monthlyWorkHours;
    const personalMonthlySavedValue = currentHourlyRate * monthlySavedHours * state.multiplier;
    const totalMonthlySavedValue = personalMonthlySavedValue * state.users;
    const monthlyNetEffect = totalMonthlySavedValue - state.monthlyToolCost;
    const annualNetEffect = monthlyNetEffect * state.annualWorkingMonths;
    const effectiveHourlyAfterAi =
      (state.monthlySalary * state.users + monthlyNetEffect) / (state.monthlyWorkHours * state.users);
    const hourlyIncrease = effectiveHourlyAfterAi - currentHourlyRate;
    const hourlyIncreaseRate = currentHourlyRate > 0 ? (hourlyIncrease / currentHourlyRate) * 100 : 0;

    let paybackMonths = null;
    if (state.monthlyToolCost === 0) {
      paybackMonths = 0;
    } else if (totalMonthlySavedValue > 0) {
      paybackMonths = state.monthlyToolCost / totalMonthlySavedValue;
    }

    return {
      ...state,
      weeklySavedHours,
      monthlyRepeatHours,
      monthlySavedHours,
      currentHourlyRate,
      personalMonthlySavedValue,
      totalMonthlySavedValue,
      monthlyNetEffect,
      annualNetEffect,
      effectiveHourlyAfterAi,
      hourlyIncrease,
      hourlyIncreaseRate,
      paybackMonths,
    };
  };

  const interpretation = (result) => {
    if (result.monthlyNetEffect >= result.monthlyToolCost && result.monthlyNetEffect > 0) {
      return {
        tone: "good",
        title: "도입 효과가 빠르게 회수되는 구조입니다.",
        text: "현재 입력 기준으로는 AI 비용보다 절감 가치가 더 커서 단기 회수 가능성이 높습니다.",
      };
    }

    if (result.monthlyNetEffect > 0) {
      return {
        tone: "mid",
        title: "효과는 있지만 절감 시간 점검이 필요합니다.",
        text: "절감 시간이나 활용 수준이 조금만 높아져도 체감 ROI가 크게 개선될 수 있습니다.",
      };
    }

    return {
      tone: "warn",
      title: "현재 입력값 기준 ROI는 낮습니다.",
      text: "절감 시간 추정치, 도구 비용, 팀 인원 수를 다시 점검해 보는 편이 좋습니다.",
    };
  };

  const sensitivityRows = (state) => {
    return [2, 4, 6].map((savedHours) => {
      const result = calculate({
        ...state,
        weeklySavedHours: Math.min(savedHours, state.weeklyRepeatHours),
      });
      return {
        savedHours,
        monthlyNetEffect: result.monthlyNetEffect,
        paybackMonths: result.paybackMonths,
      };
    });
  };

  const renderSummary = (result) => {
    elements.summaryBody.innerHTML = `
      <tr>
        <th scope="row">현재 기준 시급</th>
        <td>${formatWon(result.currentHourlyRate)}</td>
      </tr>
      <tr>
        <th scope="row">AI 도입 후 체감 시급</th>
        <td>${formatWon(result.effectiveHourlyAfterAi)}</td>
      </tr>
      <tr>
        <th scope="row">월 반복 업무 시간</th>
        <td>${formatHours(result.monthlyRepeatHours)}</td>
      </tr>
      <tr>
        <th scope="row">월 절감 시간</th>
        <td>${formatHours(result.monthlySavedHours)}</td>
      </tr>
      <tr>
        <th scope="row">월 절감 가치</th>
        <td>${formatWon(result.totalMonthlySavedValue)}</td>
      </tr>
    `;
  };

  const renderScenario = (state) => {
    const rows = sensitivityRows(state)
      .map(
        (row) => `
          <tr>
            <th scope="row">주 ${row.savedHours}시간 절감</th>
            <td>${formatWon(row.monthlyNetEffect)}</td>
            <td>${row.paybackMonths === null ? "회수 어려움" : formatMonths(row.paybackMonths)}</td>
          </tr>
        `
      )
      .join("");

    elements.scenarioBody.innerHTML = rows;
  };

  const updateQuery = (state) => {
    const params = new URLSearchParams();
    params.set("mode", state.mode);
    params.set("salaryMode", state.salaryMode);
    params.set("salary", String(Math.round(state.monthlySalary)));
    params.set("hours", String(state.monthlyWorkHours));
    params.set("repeat", String(state.weeklyRepeatHours));
    params.set("saved", String(state.weeklySavedHours));
    params.set("cost", String(Math.round(state.monthlyToolCost)));
    params.set("users", String(state.users));
    params.set("multiplier", String(state.multiplier));
    params.set("months", String(state.annualWorkingMonths));
    history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
  };

  const restoreQuery = () => {
    const params = new URLSearchParams(window.location.search);
    if (!params.toString()) {
      return;
    }

    setRadio("ahrMode", params.get("mode") || defaults.mode);
    setRadio("ahrSalaryMode", params.get("salaryMode") || defaults.salaryMode);

    const mappings = [
      ["salary", elements.salary],
      ["hours", elements.monthlyWorkHours],
      ["repeat", elements.weeklyRepeatHours],
      ["saved", elements.weeklySavedHours],
      ["cost", elements.monthlyToolCost],
      ["users", elements.users],
      ["months", elements.annualWorkingMonths],
    ];

    mappings.forEach(([key, input]) => {
      const value = params.get(key);
      if (value !== null && input) {
        input.value = value;
      }
    });

    const multiplier = params.get("multiplier");
    if (multiplier && elements.multiplier) {
      elements.multiplier.value = multiplier;
    }
  };

  const applyPreset = (presetId) => {
    const preset = presets.find((item) => item.id === presetId);
    if (!preset) {
      return;
    }

    setRadio("ahrMode", preset.mode);
    elements.salary.value = String(preset.monthlySalary);
    elements.monthlyWorkHours.value = String(preset.monthlyWorkHours);
    elements.weeklyRepeatHours.value = String(preset.weeklyRepeatHours);
    elements.weeklySavedHours.value = String(preset.weeklySavedHours);
    elements.monthlyToolCost.value = String(preset.monthlyToolCost);
    elements.users.value = String(preset.users);
    elements.multiplier.value = String(preset.multiplier);
    elements.annualWorkingMonths.value = String(preset.annualWorkingMonths);

    renderAll();
  };

  const resetForm = () => {
    setRadio("ahrMode", defaults.mode);
    setRadio("ahrSalaryMode", defaults.salaryMode);
    elements.salary.value = String(defaults.monthlySalary);
    elements.monthlyWorkHours.value = String(defaults.monthlyWorkHours);
    elements.weeklyRepeatHours.value = String(defaults.weeklyRepeatHours);
    elements.weeklySavedHours.value = String(defaults.weeklySavedHours);
    elements.monthlyToolCost.value = String(defaults.monthlyToolCost);
    elements.users.value = String(defaults.users);
    elements.multiplier.value = String(defaults.multiplier);
    elements.annualWorkingMonths.value = String(defaults.annualWorkingMonths);
    renderAll();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      if (elements.copyBtn) {
        const original = elements.copyBtn.textContent;
        elements.copyBtn.textContent = "링크 복사 완료";
        window.setTimeout(() => {
          elements.copyBtn.textContent = original;
        }, 1600);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderAll = () => {
    const state = readState();
    const result = calculate(state);
    const summary = interpretation(result);

    if (elements.usersField) {
      elements.usersField.hidden = state.mode !== "team";
    }

    elements.currentHourly.textContent = formatWon(result.currentHourlyRate);
    elements.afterHourly.textContent = formatWon(result.effectiveHourlyAfterAi);
    elements.afterHourlySub.textContent = `현재 대비 ${formatWon(result.hourlyIncrease)} 상승 · ${formatPercent(result.hourlyIncreaseRate)}`;
    elements.monthlyEffect.textContent = formatWon(result.monthlyNetEffect);
    elements.monthlyEffectSub.textContent = `월 절감 가치 ${formatWon(result.totalMonthlySavedValue)} - 도구 비용 ${formatWon(result.monthlyToolCost)}`;
    elements.annualEffect.textContent = formatWon(result.annualNetEffect);
    elements.annualEffectSub.textContent = `${result.annualWorkingMonths}개월 기준 누적 추정`;
    elements.payback.textContent =
      result.paybackMonths === null ? "회수 어려움" : result.paybackMonths === 0 ? "즉시" : formatMonths(result.paybackMonths);
    elements.paybackSub.textContent =
      result.paybackMonths === null ? "절감 가치가 도구 비용보다 작습니다." : "월 절감 가치 기준 투자 회수 기간";

    elements.resultBox.dataset.tone = summary.tone;
    elements.resultTitle.textContent = summary.title;
    elements.resultText.textContent = summary.text;

    renderSummary(result);
    renderScenario(state);
    updateQuery(state);
  };

  restoreQuery();
  renderAll();

  document.querySelectorAll("[data-ahr-preset]").forEach((button) => {
    button.addEventListener("click", () => applyPreset(button.dataset.ahrPreset));
  });

  elements.form?.querySelectorAll("input, select").forEach((input) => {
    input.addEventListener("input", renderAll);
    input.addEventListener("change", renderAll);
  });

  elements.resetBtn?.addEventListener("click", resetForm);
  elements.copyBtn?.addEventListener("click", copyLink);
}
