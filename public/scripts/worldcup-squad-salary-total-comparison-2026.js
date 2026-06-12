(function () {
  const dataNode = document.getElementById("wcsst-data");
  const body = document.querySelector("[data-wcsst-body]");
  if (!dataNode || !body) return;

  const payload = JSON.parse(dataNode.textContent || "{}");
  const teams = Array.isArray(payload.teams) ? payload.teams : [];
  const modeSelect = document.querySelector("[data-wcsst-mode]");
  const confederationSelect = document.querySelector("[data-wcsst-confederation]");
  const featuredSelect = document.querySelector("[data-wcsst-featured]");
  const statusNode = document.querySelector("[data-wcsst-status]");
  const rows = Array.from(body.querySelectorAll("[data-wcsst-row]"));
  const rowMap = new Map(rows.map((row) => [row.dataset.wcsstRow, row]));
  const teamMap = new Map(teams.map((team) => [team.id, team]));

  const labels = {
    estimatedTotalBillion: "추정 보정 합계",
    confirmedTotalBillion: "확인 합계",
    all: "전체",
    AFC: "아시아",
    UEFA: "유럽",
    CONMEBOL: "남미",
    CONCACAF: "북중미",
    CAF: "아프리카",
  };

  const formatBillion = (value) => `${Number(value || 0).toLocaleString("ko-KR")}억`;

  function updateUrl(mode, confederation, featured) {
    const url = new URL(window.location.href);
    url.searchParams.set("mode", mode === "confirmedTotalBillion" ? "confirmed" : "estimated");
    if (confederation === "all") url.searchParams.delete("conf");
    else url.searchParams.set("conf", confederation);
    if (featured === "featured") url.searchParams.set("view", "featured");
    else url.searchParams.delete("view");
    window.history.replaceState({}, "", url);
  }

  function restoreFromUrl() {
    const params = new URLSearchParams(window.location.search);
    if (modeSelect && params.get("mode") === "confirmed") modeSelect.value = "confirmedTotalBillion";
    if (confederationSelect && params.get("conf")) confederationSelect.value = params.get("conf");
    if (featuredSelect && params.get("view") === "featured") featuredSelect.value = "featured";
  }

  function render() {
    const mode = modeSelect?.value || "estimatedTotalBillion";
    const confederation = confederationSelect?.value || "all";
    const featured = featuredSelect?.value || "all";
    const korea = teamMap.get("korea");
    const koreaValue = Number(korea?.[mode] || 0);

    const filteredTeams = teams
      .filter((team) => confederation === "all" || team.confederation === confederation)
      .filter((team) => featured !== "featured" || team.isFeatured)
      .sort((a, b) => Number(b[mode] || 0) - Number(a[mode] || 0));
    const maxValue = Math.max(...filteredTeams.map((team) => Number(team[mode] || 0)), 1);

    rows.forEach((row) => {
      row.hidden = true;
    });

    filteredTeams.forEach((team, index) => {
      const row = rowMap.get(team.id);
      if (!row) return;

      row.hidden = false;
      body.appendChild(row);

      const rankNode = row.querySelector("[data-rank]");
      const estimatedNode = row.querySelector('[data-value="estimated"]');
      const confirmedNode = row.querySelector('[data-value="confirmed"]');
      const compareCell = row.children[4];
      const bar = row.querySelector(".wcsst-bar span");

      if (rankNode) rankNode.textContent = String(index + 1);
      if (estimatedNode) estimatedNode.textContent = formatBillion(team.estimatedTotalBillion);
      if (confirmedNode) confirmedNode.textContent = formatBillion(team.confirmedTotalBillion);
      if (bar) bar.style.width = `${(Number(team[mode] || 0) / maxValue) * 100}%`;

      if (compareCell) {
        const diff = Number(team[mode] || 0) - koreaValue;
        compareCell.textContent =
          diff === 0 ? "한국과 동일" : diff > 0 ? `한국보다 ${formatBillion(diff)} 높음` : `한국보다 ${formatBillion(Math.abs(diff))} 낮음`;
      }
    });

    if (statusNode) {
      const count = filteredTeams.length;
      const confText = labels[confederation] || "선택 권역";
      const featuredText = featured === "featured" ? "관심 국가" : "전체 국가";
      statusNode.textContent = `${confText} ${featuredText} ${count}개국을 ${labels[mode]} 기준으로 표시 중입니다.`;
    }

    updateUrl(mode, confederation, featured);
  }

  restoreFromUrl();
  [modeSelect, confederationSelect, featuredSelect].forEach((control) => {
    control?.addEventListener("change", render);
  });
  render();
})();
