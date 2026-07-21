(() => {
  const root = document.querySelector(".ebe-page");
  const dataEl = document.getElementById("ebe-data");
  if (!root || !dataEl) return;

  const DATA = JSON.parse(dataEl.textContent || "{}");
  const thresholds = DATA.thresholds || [];
  const supportAmounts = DATA.supportAmounts || [];
  const presets = DATA.presets || [];
  const defaultInput = DATA.defaultInput || {};
  let state = { ...defaultInput };

  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => Array.from(root.querySelectorAll(selector));

  function num(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? Math.max(0, parsed) : fallback;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function won(value) {
    return `${Math.round(value || 0).toLocaleString("ko-KR")}원`;
  }

  function signedWon(value) {
    const rounded = Math.round(value || 0);
    if (rounded === 0) return "기준과 같음";
    return `${rounded > 0 ? "+" : "-"}${Math.abs(rounded).toLocaleString("ko-KR")}원`;
  }

  function thresholdFor(size) {
    return thresholds.find((item) => item.householdSize === Number(size)) || thresholds[3] || thresholds[0];
  }

  function supportFor(level) {
    return supportAmounts.find((item) => item.level === level)?.annualActivitySupport || 0;
  }

  function calculate() {
    const threshold = thresholdFor(state.householdSize);
    const gap = threshold.educationThreshold - state.monthlyRecognizedIncome;
    const ratio = threshold.educationThreshold > 0 ? state.monthlyRecognizedIncome / threshold.educationThreshold : 0;
    const status =
      state.monthlyRecognizedIncome <= threshold.educationThreshold
        ? "eligible"
        : state.monthlyRecognizedIncome <= threshold.educationThreshold * 1.1
          ? "borderline"
          : "over";
    const educationCostStatus =
      state.monthlyRecognizedIncome <= threshold.educationThreshold
        ? "likely"
        : state.monthlyRecognizedIncome <= threshold.educationCostCheckLine
          ? "check"
          : "unlikely";
    const elementarySupport = state.elementaryCount * supportFor("elementary");
    const middleSupport = state.middleCount * supportFor("middle");
    const highSupport = state.highCount * supportFor("high");
    const totalActivitySupport = elementarySupport + middleSupport + highSupport;
    const studentCount = state.elementaryCount + state.middleCount + state.highCount;

    return {
      threshold,
      gap,
      ratio,
      status,
      educationCostStatus,
      elementarySupport,
      middleSupport,
      highSupport,
      totalActivitySupport,
      expectedActivitySupport: status === "eligible" ? totalActivitySupport : 0,
      studentCount,
    };
  }

  function setText(selector, value) {
    const el = $(selector);
    if (el) el.textContent = value;
  }

  function statusLabel(status) {
    return {
      eligible: "기준 안",
      borderline: "경계 구간",
      over: "기준 초과",
    }[status];
  }

  function statusDescription(result) {
    if (result.status === "eligible") return "교육급여 기준 안에 들어올 가능성이 있습니다.";
    if (result.status === "borderline") return "기준을 조금 넘는 구간입니다. 실제 소득·재산 조사와 교육비 지원을 함께 확인하세요.";
    return "교육급여 기준은 넘지만 교육비 지원 등 다른 제도를 확인할 수 있습니다.";
  }

  function educationCostLabel(status) {
    return {
      likely: "함께 확인",
      check: "확인 권장",
      unlikely: "가능성 낮음",
    }[status];
  }

  function educationCostDescription(result) {
    if (result.educationCostStatus === "likely") {
      return "교육급여 기준 안이라면 교육비 지원 항목도 함께 확인하는 것이 좋습니다.";
    }
    if (result.educationCostStatus === "check") {
      return "교육급여는 어려울 수 있지만 중위소득 80% 참고선 안에 있어 교육비 지원은 확인해볼 만합니다.";
    }
    return "일반적인 교육비 지원 기준도 넘을 가능성이 큽니다. 다만 지역별 예외 지원과 학교 안내문은 확인하세요.";
  }

  function readInputs() {
    state.householdSize = clamp(num($('[data-ebe-input="householdSize"]')?.value, state.householdSize), 1, 6);
    state.monthlyRecognizedIncome = num($('[data-ebe-input="monthlyRecognizedIncome"]')?.value, state.monthlyRecognizedIncome);
    state.elementaryCount = clamp(num($('[data-ebe-input="elementaryCount"]')?.value, state.elementaryCount), 0, 5);
    state.middleCount = clamp(num($('[data-ebe-input="middleCount"]')?.value, state.middleCount), 0, 5);
    state.highCount = clamp(num($('[data-ebe-input="highCount"]')?.value, state.highCount), 0, 5);
    state.showEducationCostSupport = Boolean($('[data-ebe-input="showEducationCostSupport"]')?.checked);
  }

  function syncInputs() {
    const inputMap = {
      householdSize: state.householdSize,
      monthlyRecognizedIncome: Math.round(state.monthlyRecognizedIncome).toLocaleString("ko-KR"),
      elementaryCount: state.elementaryCount,
      middleCount: state.middleCount,
      highCount: state.highCount,
    };
    Object.entries(inputMap).forEach(([key, value]) => {
      const el = $(`[data-ebe-input="${key}"]`);
      if (el && document.activeElement !== el) el.value = String(value);
    });
    const costToggle = $('[data-ebe-input="showEducationCostSupport"]');
    if (costToggle) costToggle.checked = state.showEducationCostSupport;
  }

  function renderSupportBreakdown(result) {
    const wrap = $("[data-ebe-support-breakdown]");
    if (!wrap) return;
    const rows = [
      ["초등학생", state.elementaryCount, result.elementarySupport],
      ["중학생", state.middleCount, result.middleSupport],
      ["고등학생", state.highCount, result.highSupport],
    ];
    wrap.innerHTML = "";
    rows.forEach(([label, count, value]) => {
      const row = document.createElement("article");
      row.className = "ebe-support-row";
      const title = document.createElement("strong");
      title.textContent = `${label} ${count}명`;
      const amount = document.createElement("span");
      amount.textContent = won(value);
      row.append(title, amount);
      wrap.append(row);
    });
  }

  function render() {
    readInputs();
    const result = calculate();
    const meter = $("[data-ebe-meter-fill]");
    const statusCard = $("[data-ebe-status-card]");
    const costCard = $("[data-ebe-education-cost-card]");
    const highCard = $("[data-ebe-high-card]");

    setText('[data-ebe-result="summary"]', `${state.householdSize}인 가구, 학생 ${result.studentCount}명 기준`);
    setText('[data-ebe-result="statusLabel"]', statusLabel(result.status));
    setText('[data-ebe-result="statusDescription"]', statusDescription(result));
    setText('[data-ebe-result="gap"]', signedWon(result.gap));
    setText('[data-ebe-result="thresholdText"]', `교육급여 기준 ${won(result.threshold.educationThreshold)}`);
    setText('[data-ebe-result="expectedActivitySupport"]', won(result.expectedActivitySupport));
    setText('[data-ebe-result="studentCount"]', `선정 시 받을 수 있는 금액: ${won(result.totalActivitySupport)}`);
    setText('[data-ebe-result="educationCostStatus"]', educationCostLabel(result.educationCostStatus));
    setText('[data-ebe-result="educationCostDescription"]', educationCostDescription(result));
    setText('[data-ebe-result="meterCaption"]', `교육급여 기준 대비 ${Math.round(result.ratio * 100)}% 수준입니다.`);

    if (meter) meter.style.width = `${Math.min(Math.max(result.ratio * 100, 0), 140)}%`;
    if (statusCard) statusCard.dataset.status = result.status;
    if (costCard) costCard.hidden = !state.showEducationCostSupport;
    if (highCard) highCard.hidden = state.highCount < 1;

    $$("[data-ebe-threshold-row]").forEach((row) => {
      row.classList.toggle("is-active", Number(row.dataset.ebeThresholdRow) === state.householdSize);
    });
    $$("[data-ebe-preset]").forEach((button) => {
      const preset = presets.find((item) => item.id === button.dataset.ebePreset);
      const isActive = preset && preset.input.householdSize === state.householdSize
        && preset.input.monthlyRecognizedIncome === state.monthlyRecognizedIncome
        && preset.input.elementaryCount === state.elementaryCount
        && preset.input.middleCount === state.middleCount
        && preset.input.highCount === state.highCount;
      button.classList.toggle("is-active", Boolean(isActive));
    });

    renderSupportBreakdown(result);
    syncInputs();
    syncUrl();
  }

  function syncUrl() {
    const params = new URLSearchParams();
    params.set("household", String(state.householdSize));
    params.set("income", String(Math.round(state.monthlyRecognizedIncome)));
    params.set("el", String(state.elementaryCount));
    params.set("mid", String(state.middleCount));
    params.set("high", String(state.highCount));
    params.set("cost", state.showEducationCostSupport ? "1" : "0");
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  }

  function restoreFromUrl() {
    const params = new URLSearchParams(window.location.search);
    if (!params.size) return;
    state.householdSize = clamp(num(params.get("household"), state.householdSize), 1, 6);
    state.monthlyRecognizedIncome = num(params.get("income"), state.monthlyRecognizedIncome);
    state.elementaryCount = clamp(num(params.get("el"), state.elementaryCount), 0, 5);
    state.middleCount = clamp(num(params.get("mid"), state.middleCount), 0, 5);
    state.highCount = clamp(num(params.get("high"), state.highCount), 0, 5);
    state.showEducationCostSupport = params.get("cost") !== "0";
    syncInputs();
  }

  function bindEvents() {
    $$("[data-ebe-input]").forEach((input) => {
      input.addEventListener("input", render);
      input.addEventListener("change", render);
      input.addEventListener("blur", () => {
        if (input.dataset.ebeInput === "monthlyRecognizedIncome") {
          input.value = num(input.value).toLocaleString("ko-KR");
        }
        render();
      });
    });

    $$("[data-ebe-preset]").forEach((button) => {
      button.addEventListener("click", () => {
        const preset = presets.find((item) => item.id === button.dataset.ebePreset);
        if (!preset) return;
        state = { ...preset.input };
        syncInputs();
        render();
      });
    });

    document.getElementById("ebeResetBtn")?.addEventListener("click", () => {
      state = { ...defaultInput };
      syncInputs();
      render();
    });

    document.getElementById("ebeCopyBtn")?.addEventListener("click", async () => {
      const btn = document.getElementById("ebeCopyBtn");
      try {
        await navigator.clipboard.writeText(window.location.href);
        if (btn) {
          const original = btn.textContent;
          btn.textContent = "링크 복사됨";
          setTimeout(() => {
            btn.textContent = original;
          }, 1600);
        }
      } catch {
        if (btn) btn.textContent = "복사 실패";
      }
    });
  }

  restoreFromUrl();
  bindEvents();
  render();
})();
