(function () {
  "use strict";

  const config = JSON.parse(document.getElementById("iocConfig").textContent || "{}");
  const presets = config.presets || [];
  const defaultCompanies = config.defaultCompanies || ["출발 회사", "중간 회사", "최종 회사"];
  const defaultSteps = config.defaultSteps || [];

  const MIN_STEPS = 2;
  const MAX_STEPS = 10;
  const MAX_PATHS = 5;

  let idCounter = 0;
  const nextId = (prefix) => prefix + "-" + ++idCounter;

  const els = {
    modeButtons: document.querySelectorAll("[data-ioc-mode]"),
    modeHelp: document.getElementById("iocModeHelp"),
    pathHelp: document.getElementById("iocPathHelp"),
    directRate: document.getElementById("iocDirectRate"),
    pathList: document.getElementById("iocPathList"),
    addPathBtn: document.getElementById("iocAddPathBtn"),
    error: document.getElementById("iocError"),
    mainResultLabel: document.getElementById("iocMainResultLabel"),
    resultValue: document.getElementById("iocResultValue"),
    resultFormula: document.getElementById("iocResultFormula"),
    stepCount: document.getElementById("iocStepCount"),
    averageRate: document.getElementById("iocAverageRate"),
    lowestRate: document.getElementById("iocLowestRate"),
    decreaseRate: document.getElementById("iocDecreaseRate"),
    totalWithDirect: document.getElementById("iocTotalWithDirect"),
    structureType: document.getElementById("iocStructureType"),
    resultNote: document.getElementById("iocResultNote"),
    cumulativeBody: document.getElementById("iocCumulativeBody"),
    barList: document.getElementById("iocBarList"),
    resetBtn: document.getElementById("iocResetBtn"),
    copyBtn: document.getElementById("iocCopyLinkBtn"),
  };

  function createPath(companies, steps) {
    const normalizedSteps = steps.map((step, index) => ({
      id: nextId("step"),
      label: step.label || `${index + 1}단계`,
      rate: clampRate(step.rate),
    }));
    return {
      id: nextId("path"),
      companies: normalizeCompanies(companies, normalizedSteps.length),
      steps: normalizedSteps,
    };
  }

  function defaultPath() {
    return createPath(defaultCompanies, defaultSteps);
  }

  let state = {
    mode: "single",
    directRate: 0,
    paths: [defaultPath()],
    activePresetId: null,
  };

  function clampRate(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return 0;
    return Math.min(100, Math.max(0, n));
  }

  function normalizeCompanies(companies, stepLength) {
    const result = Array.from({ length: stepLength + 1 }, (_, index) => companies[index] || defaultCompanyName(index, stepLength));
    return result;
  }

  function defaultCompanyName(index, stepLength) {
    if (index === 0) return "출발 회사";
    if (index === stepLength) return "최종 회사";
    return `${index}단계 대상`;
  }

  function calcPath(path) {
    return path.steps.reduce((acc, step) => acc * (clampRate(step.rate) / 100), 1) * 100;
  }

  function cumulativeRates(path) {
    const result = [];
    path.steps.reduce((previous, step) => {
      const next = previous * (clampRate(step.rate) / 100);
      result.push(next * 100);
      return next;
    }, 1);
    return result;
  }

  function fmtPercent(n) {
    if (!Number.isFinite(n)) return "-";
    return (Math.round(n * 100) / 100).toLocaleString("ko-KR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "%";
  }

  function fmtRateInput(n) {
    return String(Math.round(clampRate(n) * 100) / 100);
  }

  function allSteps() {
    return state.paths.flatMap((path) => path.steps);
  }

  function modeLabel() {
    if (state.mode === "multi") return "다중 경로";
    if (state.mode === "circular") return "순환출자";
    return "단일 경로";
  }

  function setMode(mode) {
    state.mode = mode;
    state.activePresetId = null;
    if (mode !== "multi") {
      state.paths = [state.paths[0] || defaultPath()];
    }
    if (mode === "circular") {
      state.directRate = 0;
      els.directRate.value = "0";
    }
    render();
  }

  function renderMode() {
    els.modeButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.iocMode === state.mode);
    });

    const modeCopy = {
      single: "한 개의 지분 경로를 순서대로 곱해 최종 간접 연결값을 계산합니다.",
      multi: "2개 이상 경로를 각각 계산한 뒤 단순 경로 합계를 함께 표시합니다.",
      circular: "출발 회사로 돌아오는 한 바퀴 순환 연결값을 계산합니다. 특정 회사의 최종 지분율이 아닙니다.",
    };
    els.modeHelp.textContent = modeCopy[state.mode];
    els.pathHelp.textContent =
      state.mode === "multi"
        ? "경로별 회사명과 지분율을 나눠 입력하세요. 같은 지분을 중복 계산하지 않는다는 가정의 참고값입니다."
        : "출발 회사부터 최종 회사까지 이어지는 회사명과 단계별 지분율을 입력하세요.";
    els.addPathBtn.hidden = state.mode !== "multi";
    els.directRate.disabled = state.mode === "circular";
  }

  function renderPaths() {
    els.pathList.replaceChildren();

    state.paths.forEach((path, pathIndex) => {
      const card = document.createElement("article");
      card.className = "ioc-path-card";

      const header = document.createElement("div");
      header.className = "ioc-path-card__header";
      const title = document.createElement("strong");
      title.textContent = state.mode === "multi" ? `경로 ${pathIndex + 1}` : "지분 경로";
      const pathResult = document.createElement("span");
      pathResult.textContent = fmtPercent(calcPath(path));
      header.appendChild(title);
      header.appendChild(pathResult);
      card.appendChild(header);

      const companyGrid = document.createElement("div");
      companyGrid.className = "ioc-company-grid";
      path.companies.forEach((company, companyIndex) => {
        const label = document.createElement("label");
        label.innerHTML = `<span>${companyIndex === 0 ? "출발 회사" : companyIndex === path.companies.length - 1 ? "최종 회사" : `${companyIndex}단계 대상`}</span>`;
        const input = document.createElement("input");
        input.type = "text";
        input.value = company;
        input.placeholder = defaultCompanyName(companyIndex, path.steps.length);
        input.dataset.iocCompany = `${path.id}:${companyIndex}`;
        label.appendChild(input);
        companyGrid.appendChild(label);
      });
      card.appendChild(companyGrid);

      const stepList = document.createElement("div");
      stepList.className = "ioc-step-list";
      path.steps.forEach((step, stepIndex) => {
        const row = document.createElement("div");
        row.className = "ioc-step-row";

        const numBadge = document.createElement("span");
        numBadge.className = "ioc-step-row__num";
        numBadge.textContent = String(stepIndex + 1);

        const labelInput = document.createElement("input");
        labelInput.type = "text";
        labelInput.className = "ioc-step-row__label";
        labelInput.value = step.label;
        labelInput.placeholder = "예: A → B";
        labelInput.dataset.iocStepLabel = `${path.id}:${step.id}`;

        const rateWrap = document.createElement("div");
        rateWrap.className = "ioc-step-row__rate-wrap";
        const rateInput = document.createElement("input");
        rateInput.type = "number";
        rateInput.min = "0";
        rateInput.max = "100";
        rateInput.step = "0.01";
        rateInput.className = "ioc-step-row__rate";
        rateInput.value = fmtRateInput(step.rate);
        rateInput.dataset.iocStepRate = `${path.id}:${step.id}`;
        const percentSign = document.createElement("span");
        percentSign.textContent = "%";
        rateWrap.appendChild(rateInput);
        rateWrap.appendChild(percentSign);

        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "ioc-step-row__remove";
        removeBtn.textContent = "삭제";
        removeBtn.disabled = path.steps.length <= MIN_STEPS;
        removeBtn.dataset.iocRemoveStep = `${path.id}:${step.id}`;

        row.appendChild(numBadge);
        row.appendChild(labelInput);
        row.appendChild(rateWrap);
        row.appendChild(removeBtn);
        stepList.appendChild(row);
      });
      card.appendChild(stepList);

      const actions = document.createElement("div");
      actions.className = "ioc-path-card__actions";
      const addStepBtn = document.createElement("button");
      addStepBtn.type = "button";
      addStepBtn.textContent = "+ 단계 추가";
      addStepBtn.className = "ioc-add-btn";
      addStepBtn.disabled = path.steps.length >= MAX_STEPS;
      addStepBtn.dataset.iocAddStep = path.id;
      actions.appendChild(addStepBtn);

      if (state.mode === "multi") {
        const removePathBtn = document.createElement("button");
        removePathBtn.type = "button";
        removePathBtn.textContent = "경로 삭제";
        removePathBtn.className = "ioc-subtle-btn";
        removePathBtn.disabled = state.paths.length <= 1;
        removePathBtn.dataset.iocRemovePath = path.id;
        actions.appendChild(removePathBtn);
      }

      card.appendChild(actions);
      els.pathList.appendChild(card);
    });

    els.addPathBtn.disabled = state.paths.length >= MAX_PATHS;
  }

  function renderResult() {
    const steps = allSteps();
    const pathResults = state.paths.map(calcPath);
    const indirect = pathResults.reduce((sum, value) => sum + value, 0);
    const direct = state.mode === "circular" ? 0 : clampRate(state.directRate);
    const totalWithDirect = direct + indirect;
    const avg = steps.length ? steps.reduce((sum, step) => sum + clampRate(step.rate), 0) / steps.length : 0;
    const lowest = steps.length ? Math.min(...steps.map((step) => clampRate(step.rate))) : 0;
    const decrease = Math.max(0, 100 - indirect);

    els.mainResultLabel.textContent = state.mode === "circular" ? "순환 연결값" : state.mode === "multi" ? "경로별 간접 연결값 합계" : "최종 간접 연결값";
    els.resultValue.textContent = fmtPercent(indirect);
    els.resultFormula.textContent =
      state.mode === "multi"
        ? pathResults.map((value, index) => `경로 ${index + 1} ${fmtPercent(value)}`).join(" + ") + " = " + fmtPercent(indirect)
        : state.paths[0].steps.map((step) => fmtPercent(clampRate(step.rate))).join(" × ") + " = " + fmtPercent(indirect);
    els.stepCount.textContent = `${steps.length}단계`;
    els.averageRate.textContent = fmtPercent(avg);
    els.lowestRate.textContent = fmtPercent(lowest);
    els.decreaseRate.textContent = `${fmtPercent(decrease)}p`;
    els.totalWithDirect.textContent = state.mode === "circular" ? "해당 없음" : fmtPercent(totalWithDirect);
    els.structureType.textContent = modeLabel();
    els.resultNote.textContent = interpretation(indirect, direct);
  }

  function interpretation(indirect, direct) {
    if (state.mode === "circular") {
      return "순환 연결값은 출발 회사로 돌아오는 지분 고리의 연결 강도를 단순 곱셈으로 표시한 값입니다. 특정 회사의 최종 지분율을 의미하지 않습니다.";
    }
    const directNote =
      direct > 0
        ? " 직접+간접 합계는 지분 경로별 의결권 행사 주체가 다를 수 있어 하나의 직접 의결권으로 해석할 수 없습니다."
        : "";
    if (indirect >= 50) return "단순 지분 연결값이 50% 이상입니다. 다만 직접 지분이 아니므로 법적 자회사 여부나 의결권 판단은 별도로 확인해야 합니다." + directNote;
    if (indirect >= 20) return "중간 수준의 간접 연결값입니다. 여러 경로가 존재할 경우 전체 경제적 연결은 달라질 수 있습니다." + directNote;
    if (indirect >= 5) return "다단계 연결 과정에서 지분율이 크게 낮아졌습니다. 직접 지분과 다른 경로가 함께 있는지 확인하는 것이 좋습니다." + directNote;
    return "최종 간접 연결값이 낮습니다. 그러나 낮은 간접 지분율만으로 경영 영향력이 작다고 단정할 수는 없습니다." + directNote;
  }

  function renderCumulative() {
    els.cumulativeBody.replaceChildren();
    els.barList.replaceChildren();

    const primaryPath = state.paths[0];
    const cumulative = cumulativeRates(primaryPath);

    const baseBar = createBar("출발 기준", 100);
    els.barList.appendChild(baseBar);

    primaryPath.steps.forEach((step, index) => {
      const row = document.createElement("tr");
      const companyFrom = primaryPath.companies[index] || defaultCompanyName(index, primaryPath.steps.length);
      const companyTo = primaryPath.companies[index + 1] || defaultCompanyName(index + 1, primaryPath.steps.length);
      row.innerHTML = `<td>${index + 1}단계<br><span>${escapeHtml(companyFrom)} → ${escapeHtml(companyTo)}</span></td><td>${fmtPercent(clampRate(step.rate))}</td><td>${fmtPercent(cumulative[index])}</td>`;
      els.cumulativeBody.appendChild(row);
      els.barList.appendChild(createBar(`${index + 1}단계 연결 후`, cumulative[index]));
    });
  }

  function createBar(label, value) {
    const item = document.createElement("div");
    item.className = "ioc-bar-item";
    const width = Math.max(2, Math.min(100, value));
    item.innerHTML = `<span>${escapeHtml(label)}</span><div><i style="width:${width}%"></i></div><strong>${fmtPercent(value)}</strong>`;
    return item;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
  }

  function validate() {
    const messages = [];
    state.paths.forEach((path, pathIndex) => {
      if (path.steps.length < MIN_STEPS) messages.push(`${pathIndex + 1}번 경로는 최소 2단계가 필요합니다.`);
      path.steps.forEach((step) => {
        if (String(step.rate).trim() === "") messages.push("지분율을 입력해주세요.");
        if (Number(step.rate) < 0) messages.push("지분율은 0% 이상이어야 합니다.");
        if (Number(step.rate) > 100) messages.push("지분율은 100% 이하로 입력해주세요.");
      });
    });
    els.error.textContent = messages[0] || "";
  }

  function render() {
    renderMode();
    renderPaths();
    renderResult();
    renderCumulative();
    validate();
    syncActivePresetButtons();
    syncUrl();
  }

  function addStep(pathId) {
    const path = state.paths.find((item) => item.id === pathId);
    if (!path || path.steps.length >= MAX_STEPS) return;
    const index = path.steps.length;
    const from = path.companies[index] || defaultCompanyName(index, index + 1);
    const to = defaultCompanyName(index + 1, index + 1);
    path.steps.push({ id: nextId("step"), label: `${from} → ${to}`, rate: 50 });
    path.companies = normalizeCompanies(path.companies, path.steps.length);
    state.activePresetId = null;
    render();
  }

  function removeStep(pathId, stepId) {
    const path = state.paths.find((item) => item.id === pathId);
    if (!path || path.steps.length <= MIN_STEPS) return;
    path.steps = path.steps.filter((step) => step.id !== stepId);
    path.companies = normalizeCompanies(path.companies, path.steps.length);
    state.activePresetId = null;
    render();
  }

  function addPath() {
    if (state.paths.length >= MAX_PATHS) return;
    state.mode = "multi";
    state.paths.push(defaultPath());
    state.activePresetId = null;
    render();
  }

  function removePath(pathId) {
    if (state.paths.length <= 1) return;
    state.paths = state.paths.filter((path) => path.id !== pathId);
    state.activePresetId = null;
    render();
  }

  function applyPreset(presetId) {
    const preset = presets.find((item) => item.id === presetId);
    if (!preset) return;
    state.mode = preset.mode || "single";
    state.directRate = preset.directRate || 0;
    els.directRate.value = fmtRateInput(state.directRate);
    state.paths = [createPath(preset.companies, preset.steps)];
    state.activePresetId = presetId;
    render();
  }

  function syncActivePresetButtons() {
    document.querySelectorAll("[data-ioc-preset]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.iocPreset === state.activePresetId);
    });
  }

  function syncUrl() {
    const params = new URLSearchParams();
    params.set("mode", state.mode);
    params.set("direct", fmtRateInput(state.directRate));
    if (state.paths.length === 1) {
      params.set("companies", state.paths[0].companies.join(","));
      params.set("rates", state.paths[0].steps.map((step) => fmtRateInput(step.rate)).join(","));
    } else {
      params.set(
        "paths",
        state.paths
          .map((path) => `${path.companies.join(">")}|${path.steps.map((step) => fmtRateInput(step.rate)).join(",")}`)
          .join(";")
      );
    }
    window.history.replaceState(null, "", "?" + params.toString());
  }

  function loadFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");
    if (["single", "multi", "circular"].includes(mode)) state.mode = mode;
    if (params.has("direct")) state.directRate = clampRate(params.get("direct"));

    const pathsParam = params.get("paths");
    if (pathsParam) {
      const loadedPaths = pathsParam
        .split(";")
        .map((chunk) => {
          const parts = chunk.split("|");
          const companies = (parts[0] || "").split(">").filter(Boolean);
          const rates = (parts[1] || "").split(",").map(clampRate).filter(Number.isFinite);
          if (rates.length < MIN_STEPS) return null;
          return createPath(
            companies,
            rates.map((rate, index) => ({ label: `${companies[index] || defaultCompanyName(index, rates.length)} → ${companies[index + 1] || defaultCompanyName(index + 1, rates.length)}`, rate }))
          );
        })
        .filter(Boolean);
      if (loadedPaths.length) state.paths = loadedPaths.slice(0, MAX_PATHS);
      return;
    }

    const ratesParam = params.get("rates");
    if (ratesParam) {
      const rates = ratesParam.split(",").map(clampRate).filter(Number.isFinite).slice(0, MAX_STEPS);
      if (rates.length >= MIN_STEPS) {
        const companies = (params.get("companies") || "").split(",").filter(Boolean);
        state.paths = [
          createPath(
            companies,
            rates.map((rate, index) => ({ label: `${companies[index] || defaultCompanyName(index, rates.length)} → ${companies[index + 1] || defaultCompanyName(index + 1, rates.length)}`, rate }))
          ),
        ];
      }
    }
  }

  els.modeButtons.forEach((button) => {
    button.addEventListener("click", () => setMode(button.dataset.iocMode));
  });

  els.directRate.addEventListener("input", () => {
    state.directRate = clampRate(els.directRate.value);
    els.directRate.value = fmtRateInput(state.directRate);
    state.activePresetId = null;
    renderResult();
    validate();
    syncUrl();
  });

  els.pathList.addEventListener("input", (event) => {
    const target = event.target;
    if (target.dataset.iocCompany) {
      const [pathId, companyIndex] = target.dataset.iocCompany.split(":");
      const path = state.paths.find((item) => item.id === pathId);
      if (path) path.companies[Number(companyIndex)] = target.value;
    }
    if (target.dataset.iocStepLabel) {
      const [pathId, stepId] = target.dataset.iocStepLabel.split(":");
      const path = state.paths.find((item) => item.id === pathId);
      const step = path && path.steps.find((item) => item.id === stepId);
      if (step) step.label = target.value;
    }
    if (target.dataset.iocStepRate) {
      const [pathId, stepId] = target.dataset.iocStepRate.split(":");
      const path = state.paths.find((item) => item.id === pathId);
      const step = path && path.steps.find((item) => item.id === stepId);
      if (step) {
        step.rate = clampRate(target.value);
        target.value = fmtRateInput(step.rate);
      }
    }
    state.activePresetId = null;
    renderResult();
    renderCumulative();
    validate();
    syncActivePresetButtons();
    syncUrl();
  });

  els.pathList.addEventListener("click", (event) => {
    const target = event.target;
    if (target.dataset.iocAddStep) addStep(target.dataset.iocAddStep);
    if (target.dataset.iocRemovePath) removePath(target.dataset.iocRemovePath);
    if (target.dataset.iocRemoveStep) {
      const [pathId, stepId] = target.dataset.iocRemoveStep.split(":");
      removeStep(pathId, stepId);
    }
  });

  els.addPathBtn.addEventListener("click", addPath);

  document.querySelectorAll("[data-ioc-preset]").forEach((button) => {
    button.addEventListener("click", () => applyPreset(button.dataset.iocPreset));
  });

  if (els.resetBtn) {
    els.resetBtn.addEventListener("click", () => {
      state = { mode: "single", directRate: 0, paths: [defaultPath()], activePresetId: null };
      els.directRate.value = "0";
      render();
    });
  }

  if (els.copyBtn) {
    els.copyBtn.addEventListener("click", () => {
      syncUrl();
      navigator.clipboard?.writeText(window.location.href).catch(() => {});
    });
  }

  loadFromUrl();
  els.directRate.value = fmtRateInput(state.directRate);
  render();
})();
