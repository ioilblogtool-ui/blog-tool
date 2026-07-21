(() => {
  const root = document.querySelector(".fci-page");
  const dataEl = document.getElementById("fci-data");
  if (!root || !dataEl) return;

  const DATA = JSON.parse(dataEl.textContent || "{}");
  const presets = DATA.presets || [];
  const tierLabel = DATA.tierLabel || {};
  const defaultInput = DATA.defaultInput || {};
  let state = { ...defaultInput };

  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => Array.from(root.querySelectorAll(selector));

  function num(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? Math.max(0, parsed) : fallback;
  }

  function won(value) {
    return `${Math.round(value || 0).toLocaleString("ko-KR")}원`;
  }

  function getEligibility(input) {
    if (input.collisionCoverage === "no") return "blocked-collision";
    if (input.singleAccidentCoverage === "no") return "blocked-single-accident";
    if (input.collisionCoverage === "unsure" || input.singleAccidentCoverage === "unsure") return "needs-check";
    return "eligible";
  }

  function getLossTier(lossRatio) {
    if (lossRatio >= 100) return "presumed-total-loss";
    if (lossRatio >= 90) return "total-loss-borderline";
    if (lossRatio >= 70) return "high-cost-repair";
    return "partial-likely";
  }

  function calcDeductible(damage, input) {
    const raw = Math.round((damage * input.deductibleRate) / 100);
    return Math.min(Math.max(raw, input.deductibleMin), input.deductibleMax);
  }

  function calculate() {
    const eligibility = getEligibility(state);
    const estimatedDamage = state.repairCost + state.towingCost + state.cleaningCost + state.additionalDamageEstimate;
    const lossRatio = state.vehicleValue > 0 ? Math.round((estimatedDamage / state.vehicleValue) * 1000) / 10 : 0;
    const tier = getLossTier(lossRatio);
    const isTotalLoss = lossRatio >= 100 || state.isFunctionUnrecoverable;

    const deductibleAmount = calcDeductible(estimatedDamage, state);

    let expectedPayout;
    if (isTotalLoss) {
      expectedPayout = state.deductibleWaiverOnTotalLoss === "waived"
        ? state.vehicleValue
        : Math.max(state.vehicleValue - deductibleAmount, 0);
    } else {
      expectedPayout = Math.max(estimatedDamage - deductibleAmount, 0);
    }

    return { eligibility, estimatedDamage, lossRatio, tier, isTotalLoss, deductibleAmount, expectedPayout };
  }

  function calcSensitivity() {
    const baseDamage = state.repairCost + state.towingCost + state.cleaningCost + state.additionalDamageEstimate;
    return [0, 3_000_000, 5_000_000, 7_000_000].map((extraCost) => {
      const totalDamage = baseDamage + extraCost;
      const lossRatio = state.vehicleValue > 0 ? Math.round((totalDamage / state.vehicleValue) * 1000) / 10 : 0;
      return { extraCost, totalDamage, lossRatio, tier: getLossTier(lossRatio) };
    });
  }

  function interpretation(result) {
    const parts = [];
    if (result.tier === "partial-likely") {
      const diff = won(state.vehicleValue - result.estimatedDamage);
      parts.push(`현재 입력값에서는 예상 손해액이 차량가액보다 ${diff} 낮아 분손 가능성이 높습니다. 다만 정비 과정에서 엔진·변속기·전자제어장치의 추가 손상이 발견되면 수리비가 증가해 전손 검토 구간으로 변경될 수 있습니다.`);
    } else if (result.tier === "high-cost-repair") {
      parts.push("예상 손해액이 차량가액의 70%를 넘는 고액 수리 구간입니다. 추가 손상이 발견되면 전손 경계 구간으로 넘어갈 수 있습니다.");
    } else if (result.tier === "total-loss-borderline") {
      parts.push("예상 손해액이 차량가액에 근접한 전손 경계 구간입니다. 손해사정 결과에 따라 추정전손으로 판정될 가능성이 있습니다.");
    } else {
      parts.push("예상 손해액이 차량가액 이상으로, 추정전손으로 검토될 가능성이 큽니다.");
    }
    if (state.isFunctionUnrecoverable) {
      parts.push("수리해도 정상 기능 회복이 어렵다고 입력하셨으므로 절대전손 여부도 함께 검토될 수 있습니다.");
    }
    return parts.join(" ");
  }

  function setText(selector, value) {
    const el = $(selector);
    if (el) el.textContent = value;
  }

  function readInputs() {
    state.collisionCoverage = $('[data-fci-input="collisionCoverage"]')?.value || state.collisionCoverage;
    state.singleAccidentCoverage = $('[data-fci-input="singleAccidentCoverage"]')?.value || state.singleAccidentCoverage;
    const scenarioInput = $('input[name="fci-scenario"]:checked');
    if (scenarioInput) state.floodScenario = scenarioInput.value;
    state.vehicleValue = num($('[data-fci-input="vehicleValue"]')?.value, state.vehicleValue);
    state.repairCost = num($('[data-fci-input="repairCost"]')?.value, state.repairCost);
    state.towingCost = num($('[data-fci-input="towingCost"]')?.value, state.towingCost);
    state.cleaningCost = num($('[data-fci-input="cleaningCost"]')?.value, state.cleaningCost);
    state.additionalDamageEstimate = num($('[data-fci-input="additionalDamageEstimate"]')?.value, state.additionalDamageEstimate);
    state.isFunctionUnrecoverable = Boolean($('[data-fci-input="isFunctionUnrecoverable"]')?.checked);
    state.deductibleRate = num($('[data-fci-input="deductibleRate"]')?.value, state.deductibleRate);
    state.deductibleMin = num($('[data-fci-input="deductibleMin"]')?.value, state.deductibleMin);
    state.deductibleMax = num($('[data-fci-input="deductibleMax"]')?.value, state.deductibleMax);
    state.deductibleWaiverOnTotalLoss = $('[data-fci-input="deductibleWaiverOnTotalLoss"]')?.value || state.deductibleWaiverOnTotalLoss;
  }

  function syncInputs() {
    const el = (name) => $(`[data-fci-input="${name}"]`);
    if (el("collisionCoverage")) el("collisionCoverage").value = state.collisionCoverage;
    if (el("singleAccidentCoverage")) el("singleAccidentCoverage").value = state.singleAccidentCoverage;
    $$('input[name="fci-scenario"]').forEach((input) => { input.checked = input.value === state.floodScenario; });
    if (el("vehicleValue") && document.activeElement !== el("vehicleValue")) el("vehicleValue").value = Math.round(state.vehicleValue).toLocaleString("ko-KR");
    if (el("repairCost") && document.activeElement !== el("repairCost")) el("repairCost").value = Math.round(state.repairCost).toLocaleString("ko-KR");
    if (el("towingCost") && document.activeElement !== el("towingCost")) el("towingCost").value = Math.round(state.towingCost).toLocaleString("ko-KR");
    if (el("cleaningCost") && document.activeElement !== el("cleaningCost")) el("cleaningCost").value = Math.round(state.cleaningCost).toLocaleString("ko-KR");
    if (el("additionalDamageEstimate") && document.activeElement !== el("additionalDamageEstimate")) el("additionalDamageEstimate").value = Math.round(state.additionalDamageEstimate).toLocaleString("ko-KR");
    if (el("isFunctionUnrecoverable")) el("isFunctionUnrecoverable").checked = state.isFunctionUnrecoverable;
    if (el("deductibleRate")) el("deductibleRate").value = state.deductibleRate;
    if (el("deductibleMin") && document.activeElement !== el("deductibleMin")) el("deductibleMin").value = Math.round(state.deductibleMin).toLocaleString("ko-KR");
    if (el("deductibleMax") && document.activeElement !== el("deductibleMax")) el("deductibleMax").value = Math.round(state.deductibleMax).toLocaleString("ko-KR");
    if (el("deductibleWaiverOnTotalLoss")) el("deductibleWaiverOnTotalLoss").value = state.deductibleWaiverOnTotalLoss;
  }

  const SCENARIO_WARNING = {
    windowOpen: { title: "보상 제외 가능성이 큽니다", body: "창문이나 선루프를 열어둔 상태에서 빗물이 들어온 경우에는 보상 대상에서 제외될 가능성이 큽니다. 다만 실제 판단은 사고 원인과 가입 약관에 따라 달라질 수 있습니다." },
    restrictedArea: { title: "과실 반영 가능성이 있습니다", body: "경찰·지자체 통제구역에 고의로 진입했거나 대피 명령을 무시한 경우, 보상 판단과 보험료에 불리하게 반영될 수 있습니다." },
  };

  const ELIGIBILITY_WARNING = {
    "blocked-collision": { title: "자기차량손해담보 미가입 상태입니다", body: "책임보험만 가입한 경우 침수로 인한 내 차량 피해는 보상되지 않습니다. 보험증권에서 자기차량손해담보 가입 여부를 먼저 확인하세요." },
    "blocked-single-accident": { title: "차량단독사고(침수) 특약 미가입 상태입니다", body: "자기차량손해담보가 있어도 차대차 사고만 보장하는 형태라면 침수가 보장되지 않을 수 있습니다. 보험증권에서 단독사고·침수 보장 여부를 확인하세요." },
    "needs-check": { title: "가입 여부를 먼저 확인해주세요", body: "자기차량손해담보와 침수·단독사고 특약 가입 여부에 따라 보상 가능성이 완전히 달라집니다. 보험사 앱 또는 보험증권에서 확인한 뒤 다시 계산해보세요." },
  };

  function render() {
    readInputs();

    const scenarioWarning = $("[data-fci-scenario-warning]");
    if (state.floodScenario === "normal") {
      if (scenarioWarning) scenarioWarning.hidden = true;
    } else {
      const info = SCENARIO_WARNING[state.floodScenario];
      setText("[data-fci-scenario-warning-title]", info.title);
      setText("[data-fci-scenario-warning-body]", info.body);
      if (scenarioWarning) scenarioWarning.hidden = false;
    }

    const eligibility = getEligibility(state);
    const warningPanel = $("[data-fci-warning]");
    const resultPanel = $("[data-fci-result-panel]");
    const sensitivityPanel = $("[data-fci-sensitivity-panel]");

    if (eligibility !== "eligible") {
      const info = ELIGIBILITY_WARNING[eligibility];
      setText("[data-fci-warning-title]", info.title);
      setText("[data-fci-warning-body]", info.body);
      if (warningPanel) warningPanel.hidden = false;
      if (resultPanel) resultPanel.hidden = true;
      if (sensitivityPanel) sensitivityPanel.hidden = true;
      syncInputs();
      syncUrl();
      return;
    }
    if (warningPanel) warningPanel.hidden = true;
    if (resultPanel) resultPanel.hidden = false;
    if (sensitivityPanel) sensitivityPanel.hidden = false;

    const result = calculate();

    setText('[data-fci-result="tierConclusion"]', tierLabel[result.tier] || "");
    setText('[data-fci-result="vehicleValue"]', won(state.vehicleValue));
    setText('[data-fci-result="estimatedDamage"]', won(result.estimatedDamage));
    setText('[data-fci-result="lossRatio"]', `${result.lossRatio}%`);
    setText('[data-fci-result="deductibleAmount"]', won(result.deductibleAmount));
    setText('[data-fci-result="expectedPayout"]', won(result.expectedPayout));
    setText('[data-fci-result="interpretation"]', interpretation(result));

    const sensitivityBody = $("[data-fci-sensitivity-body]");
    if (sensitivityBody) {
      sensitivityBody.innerHTML = calcSensitivity().map((row) => `
        <tr>
          <td>${won(row.extraCost)}</td>
          <td>${won(row.totalDamage)}</td>
          <td>${row.lossRatio}%</td>
          <td>${tierLabel[row.tier] || ""}</td>
        </tr>
      `).join("");
    }

    $$("[data-fci-preset]").forEach((button) => {
      const preset = presets.find((item) => item.id === button.dataset.fciPreset);
      const isActive = preset
        && preset.input.vehicleValue === state.vehicleValue
        && preset.input.repairCost === state.repairCost;
      button.classList.toggle("is-active", Boolean(isActive));
    });

    syncInputs();
    syncUrl();
  }

  function syncUrl() {
    const params = new URLSearchParams();
    params.set("collision", state.collisionCoverage);
    params.set("single", state.singleAccidentCoverage);
    params.set("scenario", state.floodScenario);
    params.set("value", String(Math.round(state.vehicleValue)));
    params.set("repair", String(Math.round(state.repairCost)));
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  }

  function restoreFromUrl() {
    const params = new URLSearchParams(window.location.search);
    if (!params.size) return;
    if (params.get("collision")) state.collisionCoverage = params.get("collision");
    if (params.get("single")) state.singleAccidentCoverage = params.get("single");
    if (params.get("scenario")) state.floodScenario = params.get("scenario");
    state.vehicleValue = num(params.get("value"), state.vehicleValue);
    state.repairCost = num(params.get("repair"), state.repairCost);
    syncInputs();
  }

  function bindEvents() {
    $$("[data-fci-input]").forEach((input) => {
      input.addEventListener("input", render);
      input.addEventListener("change", render);
      input.addEventListener("blur", () => {
        if (["vehicleValue", "repairCost", "towingCost", "cleaningCost", "additionalDamageEstimate", "deductibleMin", "deductibleMax"].includes(input.dataset.fciInput)) {
          input.value = num(input.value).toLocaleString("ko-KR");
        }
        render();
      });
    });
    $$('input[name="fci-scenario"]').forEach((input) => input.addEventListener("change", render));

    $$("[data-fci-preset]").forEach((button) => {
      button.addEventListener("click", () => {
        const preset = presets.find((item) => item.id === button.dataset.fciPreset);
        if (!preset) return;
        state = { ...defaultInput, ...preset.input };
        syncInputs();
        render();
      });
    });

    document.getElementById("fciResetBtn")?.addEventListener("click", () => {
      state = { ...defaultInput };
      syncInputs();
      render();
    });

    document.getElementById("fciCopyBtn")?.addEventListener("click", async () => {
      const btn = document.getElementById("fciCopyBtn");
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
