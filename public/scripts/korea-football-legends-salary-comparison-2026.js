(function () {
  const dataEl = document.getElementById("kfls-data");
  if (!dataEl) return;

  const data = JSON.parse(dataEl.textContent || "{}");
  const players = Array.isArray(data.players) ? data.players : [];
  const playerMap = new Map(players.map((player) => [player.id, player]));

  const modeButtons = Array.from(document.querySelectorAll("[data-mode-btn]"));
  const tabButtons = Array.from(document.querySelectorAll("[data-player-tab]"));
  const detailCards = Array.from(document.querySelectorAll("[data-player-detail]"));

  const formatMan = (value) => {
    if (value >= 10000) {
      const eok = value / 10000;
      return `${eok >= 100 ? Math.round(eok).toLocaleString() : eok.toFixed(1)}억`;
    }
    return `${Math.round(value).toLocaleString()}만원`;
  };
  const formatRange = (min, max) => (min === max ? `약 ${formatMan(min)}` : `약 ${formatMan(min)} ~ ${formatMan(max)}`);

  const syncUrl = (mode, playerId) => {
    const params = new URLSearchParams(window.location.search);
    params.set("mode", mode);
    params.set("player", playerId);
    const next = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", next);
  };

  const setMode = (mode) => {
    modeButtons.forEach((btn) => btn.classList.toggle("is-active", btn.getAttribute("data-mode-btn") === mode));

    players.forEach((player) => {
      const valueEl = document.querySelector(`[data-player-value="${player.id}"]`);
      const labelEl = document.querySelector(`[data-player-label="${player.id}"]`);
      const secondaryEl = document.querySelector(`[data-player-secondary="${player.id}"]`);

      if (mode === "present") {
        if (valueEl) valueEl.textContent = formatRange(player.presentValueManMin, player.presentValueManMax);
        if (labelEl) labelEl.textContent = "현재가치 환산 연봉";
        if (secondaryEl) {
          secondaryEl.textContent = player.era === "current"
            ? "현재 시점 기준 동일"
            : `전성기 추정 연봉 ${formatRange(player.annualSalaryManMin, player.annualSalaryManMax)}`;
        }
      } else {
        if (valueEl) valueEl.textContent = formatRange(player.annualSalaryManMin, player.annualSalaryManMax);
        if (labelEl) labelEl.textContent = "전성기 추정 연봉";
        if (secondaryEl) {
          secondaryEl.textContent = player.era === "current"
            ? `현재가치 환산 ${formatRange(player.presentValueManMin, player.presentValueManMax)}`
            : `현재가치 환산 ${formatRange(player.presentValueManMin, player.presentValueManMax)}`;
        }
      }
    });

    const activeTab = tabButtons.find((btn) => btn.classList.contains("is-active"));
    syncUrl(mode, activeTab ? activeTab.getAttribute("data-player-tab") : players[0]?.id);
  };

  const selectPlayer = (playerId) => {
    if (!playerMap.has(playerId)) return;
    tabButtons.forEach((btn) => btn.classList.toggle("is-active", btn.getAttribute("data-player-tab") === playerId));
    detailCards.forEach((card) => card.classList.toggle("is-active", card.getAttribute("data-player-detail") === playerId));

    const activeMode = modeButtons.find((btn) => btn.classList.contains("is-active"));
    syncUrl(activeMode ? activeMode.getAttribute("data-mode-btn") : "peak", playerId);
  };

  modeButtons.forEach((btn) => {
    btn.addEventListener("click", () => setMode(btn.getAttribute("data-mode-btn")));
  });
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => selectPlayer(btn.getAttribute("data-player-tab")));
  });

  const params = new URLSearchParams(window.location.search);
  const initialMode = params.get("mode") === "present" ? "present" : "peak";
  const initialPlayer = params.get("player");
  if (initialPlayer && playerMap.has(initialPlayer)) selectPlayer(initialPlayer);
  if (initialMode === "present") setMode("present");
})();
