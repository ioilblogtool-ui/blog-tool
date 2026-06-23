(function () {
  const dataEl = document.getElementById("brd-data");
  if (!dataEl) return;

  const data = JSON.parse(dataEl.textContent || "{}");
  const examples = Array.isArray(data.examples) ? data.examples : [];
  const priorityIds = (data.priorities || []).map((p) => p.id);

  const tabButtons = Array.from(document.querySelectorAll("[data-priority-tab]"));
  const panels = Array.from(document.querySelectorAll("[data-priority-panel]"));
  const frameRows = Array.from(document.querySelectorAll("[data-frame-row]"));
  const slider = document.querySelector("[data-budget-slider]");
  const budgetValueEl = document.querySelector("[data-budget-value]");
  const exampleNoteEl = document.querySelector("[data-example-note]");

  function setPriority(priorityId) {
    if (!priorityIds.includes(priorityId)) return;
    tabButtons.forEach((btn) => btn.classList.toggle("is-active", btn.getAttribute("data-priority-tab") === priorityId));
    panels.forEach((panel) => panel.classList.toggle("is-active", panel.getAttribute("data-priority-panel") === priorityId));
    frameRows.forEach((row) => {
      const list = (row.getAttribute("data-priorities") || "").split(",").filter(Boolean);
      row.classList.toggle("is-highlighted", list.includes(priorityId));
    });
    syncUrl();
  }

  function formatEokRange(min, max) {
    if (min === max) return `${min}억 원`;
    return `${min}억~${max}억 원`;
  }

  function findClosestExample(region, budgetEok) {
    const regionExamples = examples.filter((e) => e.region === region);
    if (regionExamples.length === 0) return null;
    let closest = regionExamples[0];
    let closestDiff = Infinity;
    regionExamples.forEach((ex) => {
      const mid = (ex.priceEokMin + ex.priceEokMax) / 2;
      const diff = Math.abs(mid - budgetEok);
      if (diff < closestDiff) {
        closestDiff = diff;
        closest = ex;
      }
    });
    return { example: closest, diff: closestDiff };
  }

  function renderExamples(budgetEok) {
    const regions = ["bundang", "dongtan"];
    let anyFar = false;
    regions.forEach((region) => {
      const result = findClosestExample(region, budgetEok);
      const complexEl = document.querySelector(`[data-example-complex="${region}"]`);
      const locationEl = document.querySelector(`[data-example-location="${region}"]`);
      const priceEl = document.querySelector(`[data-example-price="${region}"]`);
      const metaEl = document.querySelector(`[data-example-meta="${region}"]`);
      if (!result) {
        if (complexEl) complexEl.textContent = "확인된 예시 없음";
        return;
      }
      if (result.diff >= 3) anyFar = true;
      const { example } = result;
      if (complexEl) complexEl.textContent = example.complex;
      if (locationEl) locationEl.textContent = `${example.location} · ${example.sizeLabel}`;
      if (priceEl) priceEl.textContent = formatEokRange(example.priceEokMin, example.priceEokMax);
      if (metaEl) metaEl.textContent = `${example.tradeLabel} · ${example.sourceLabel}`;
    });
    if (exampleNoteEl) exampleNoteEl.hidden = !anyFar;
  }

  function syncUrl() {
    const activeTab = tabButtons.find((btn) => btn.classList.contains("is-active"));
    const params = new URLSearchParams(window.location.search);
    if (activeTab) params.set("priority", activeTab.getAttribute("data-priority-tab"));
    if (slider) params.set("budget", slider.value);
    const next = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", next);
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => setPriority(btn.getAttribute("data-priority-tab")));
  });

  if (slider) {
    slider.addEventListener("input", () => {
      const budgetEok = Number(slider.value);
      if (budgetValueEl) budgetValueEl.textContent = `${budgetEok}억`;
      renderExamples(budgetEok);
      syncUrl();
    });
  }

  const params = new URLSearchParams(window.location.search);
  const initialPriority = params.get("priority");
  if (initialPriority && priorityIds.includes(initialPriority)) {
    setPriority(initialPriority);
  }

  const initialBudget = Number(params.get("budget"));
  if (slider && initialBudget >= 9 && initialBudget <= 20) {
    slider.value = String(initialBudget);
  }

  const startBudget = slider ? Number(slider.value) : 15;
  if (budgetValueEl) budgetValueEl.textContent = `${startBudget}억`;
  renderExamples(startBudget);
})();
