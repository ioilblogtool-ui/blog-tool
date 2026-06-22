(() => {
  const root = document.querySelector(".ms-page");
  const configEl = document.getElementById("msConfig");
  if (!root || !configEl) return;

  const config = JSON.parse(configEl.textContent || "{}");
  const optionsByCategory = config.optionsByCategory || {};
  const presets = config.presets || [];

  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => Array.from(root.querySelectorAll(selector));

  const rankSelect = $('[data-ms="rankId"]');
  const categoryButtons = $$("[data-ms-category]");

  let state = {
    category: "soldier",
    rankId: "이병",
  };

  function won(value) {
    return `${Math.round(value).toLocaleString("ko-KR")}원`;
  }

  function getOptions(category) {
    return optionsByCategory[category] || [];
  }

  function findOption(category, rankId) {
    return getOptions(category).find((item) => item.id === rankId) || getOptions(category)[0];
  }

  function renderCategoryButtons() {
    categoryButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.msCategory === state.category);
    });
  }

  function renderRankSelect() {
    const options = getOptions(state.category);
    rankSelect.innerHTML = options
      .map((item) => `<option value="${item.id}">${item.label}</option>`)
      .join("");
    if (!options.some((item) => item.id === state.rankId)) {
      state.rankId = options[0]?.id;
    }
    rankSelect.value = state.rankId;
  }

  function renderResult() {
    const option = findOption(state.category, state.rankId);
    if (!option) return;

    $("#msMonthlyBase").textContent = won(option.monthlyBase);
    $("#msMonthlyNet").textContent = won(option.monthlyNet);
    $("#msAnnualGross").textContent = won(option.annualGross);
    $("#msAnnualNet").textContent = won(option.monthlyNet * 12);
    $("#msRankNote").textContent = option.note || "";
    $("#msSummaryText").textContent = `${option.label} 기준 예상 월급과 실수령액입니다.`;
  }

  function renderRankTable() {
    const options = getOptions(state.category);
    const body = $("#msRankRows");
    body.innerHTML = options
      .map(
        (item) => `
          <tr class="${item.id === state.rankId ? "is-current" : ""}">
            <td>${item.label}</td>
            <td>${won(item.monthlyBase)}</td>
            <td>${won(item.monthlyNet)}</td>
            <td>${won(item.annualGross)}</td>
          </tr>
        `,
      )
      .join("");
  }

  function render() {
    renderCategoryButtons();
    renderRankSelect();
    renderResult();
    renderRankTable();
    updateUrl();
  }

  function updateUrl() {
    const params = new URLSearchParams();
    params.set("category", state.category);
    params.set("rank", state.rankId);
    history.replaceState(null, "", `${location.pathname}?${params.toString()}`);
  }

  function restoreFromUrl() {
    const params = new URLSearchParams(location.search);
    if (params.has("category")) state.category = params.get("category");
    if (params.has("rank")) state.rankId = params.get("rank");
  }

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.category = button.dataset.msCategory;
      state.rankId = getOptions(state.category)[0]?.id;
      render();
    });
  });

  rankSelect.addEventListener("change", () => {
    state.rankId = rankSelect.value;
    render();
  });

  $$("[data-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      $$("[data-preset]").forEach((btn) => btn.classList.remove("is-active"));
      button.classList.add("is-active");
      state.category = button.dataset.presetCategory;
      state.rankId = button.dataset.presetRank;
      render();
    });
  });

  document.getElementById("msResetBtn")?.addEventListener("click", () => {
    state = { category: "soldier", rankId: "이병" };
    render();
  });

  document.getElementById("msCopyBtn")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(location.href);
    } catch (error) {
      const textarea = document.createElement("textarea");
      textarea.value = location.href;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
  });

  restoreFromUrl();
  render();
})();
