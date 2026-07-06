(() => {
  const root = document.querySelector(".srh-page");
  const configEl = document.getElementById("srh-data");
  if (!root || !configEl) return;

  const { housingTypes, judgmentBands } = JSON.parse(configEl.textContent || "{}");

  const $ = (sel) => root.querySelector(sel);

  const INCOME_SCORE = { livelihood: 30, nearPoverty: 25, basicPensionOnly: 0, veryLow: 20, general: 0 };
  const HOMELESS_SCORE = { under1: 0, "1to5": 0, "5to10": 0, "10plus": 20 };
  const RESIDENCE_SCORE = { under1: 0, "1to3": 0, "3to5": 0, "5plus": 15 };
  const SUBSCRIPTION_SCORE = { none: 0, under6: 0, "6to23": 0, "24plus": 10 };
  const CAR_SCORE = { noneOrCheap: 10, general: 0, expensive: 0 };

  let state = {
    age: 67,
    housingOwnership: "none",
    homelessYears: "10plus",
    residenceYears: "5plus",
    incomeLevel: "veryLow",
    isDisabled: false,
    subscriptionCount: "24plus",
    carOwnership: "noneOrCheap",
    isSeparatedFromChildren: true,
    strategyPopularAreaOnly: false,
    strategyNewBuildOnly: false,
    strategySingleApplicationOnly: false,
  };

  function breakdown() {
    const items = [];
    if (state.age >= 65) items.push({ label: "만 65세 이상", points: 10 });
    if (state.age >= 70) items.push({ label: "만 70세 이상", points: 5 });
    const incomeLabel = { livelihood: "기초생활수급자", nearPoverty: "차상위계층", veryLow: "소득이 매우 낮음" }[state.incomeLevel];
    if (INCOME_SCORE[state.incomeLevel] > 0) items.push({ label: incomeLabel, points: INCOME_SCORE[state.incomeLevel] });
    if (state.isDisabled) items.push({ label: "장애인 등록", points: 15 });
    if (HOMELESS_SCORE[state.homelessYears] > 0) items.push({ label: "무주택 10년 이상", points: 20 });
    if (RESIDENCE_SCORE[state.residenceYears] > 0) items.push({ label: "해당 지역 거주 5년 이상", points: 15 });
    if (SUBSCRIPTION_SCORE[state.subscriptionCount] > 0) items.push({ label: "청약통장 24회 이상", points: 10 });
    if (CAR_SCORE[state.carOwnership] > 0) items.push({ label: "자동차 없음/저가 차량", points: 10 });
    if (state.isSeparatedFromChildren) items.push({ label: "자녀와 세대분리", points: 10 });
    if (state.strategyPopularAreaOnly) items.push({ label: "인기지역만 고집", points: -20 });
    if (state.strategyNewBuildOnly) items.push({ label: "신축만 고집", points: -15 });
    if (state.strategySingleApplicationOnly) items.push({ label: "한 공고만 신청", points: -20 });
    return items;
  }

  function judge(score) {
    return judgmentBands.find((b) => score >= b.minScore) || judgmentBands[judgmentBands.length - 1];
  }

  function rankTypes() {
    const base = [...housingTypes].sort((a, b) => a.baseRank - b.baseRank);
    const moveToFront = (ids) => {
      const front = ids.map((id) => base.find((t) => t.id === id)).filter(Boolean);
      const rest = base.filter((t) => !ids.includes(t.id));
      return [...front, ...rest];
    };
    if (state.incomeLevel === "livelihood" || state.incomeLevel === "nearPoverty") {
      return moveToFront(["permanent", "seniorPurchase"]);
    }
    if (state.incomeLevel === "basicPensionOnly") {
      return moveToFront(["national", "integrated", "seniorPurchase"]);
    }
    return base;
  }

  function actionableTips() {
    const tips = [];
    if (state.subscriptionCount !== "24plus") tips.push("청약통장을 24회 이상 유지하면 +10점");
    if (!state.isSeparatedFromChildren) tips.push("자녀와 세대분리를 검토하면 +10점");
    if (state.strategyPopularAreaOnly) tips.push("인기 지역만 고집하지 않으면 -20점 감점 해소");
    if (state.strategyNewBuildOnly) tips.push("신축만 고집하지 않으면 -15점 감점 해소");
    if (state.strategySingleApplicationOnly) tips.push("여러 공고에 동시 신청하면 -20점 감점 해소");
    return tips;
  }

  function render() {
    if (state.housingOwnership === "current") {
      $("#srhScoreValue").textContent = "신청 불가";
      $("#srhScoreLabel").textContent = "현재 주택을 보유하고 있습니다";
      $("#srhScoreMessage").textContent = "무주택 요건을 충족하지 않아 대부분의 공공임대 유형에서 신청 대상이 아닙니다.";
      $("#srhBreakdownList").innerHTML = "";
      $("#srhActionableGrid").innerHTML = "";
      $("#srhTypeRankList").innerHTML = "";
      const card = $("#srhScoreCard");
      card.className = "srh-score-card srh-score-card--band-warn";
      syncURL();
      return;
    }

    const items = breakdown();
    const score = items.reduce((sum, i) => sum + i.points, 0);
    const band = judge(score);

    $("#srhScoreValue").textContent = `${score}점`;
    $("#srhScoreLabel").textContent = band.label;
    $("#srhScoreMessage").textContent = band.message;

    const card = $("#srhScoreCard");
    card.className = "srh-score-card";
    if (score >= 80) card.classList.add("srh-score-card--band-high");
    else if (score >= 50) card.classList.add("srh-score-card--band-mid");
    else if (score >= 30) card.classList.add("srh-score-card--band-low");
    else card.classList.add("srh-score-card--band-warn");

    $("#srhBreakdownList").innerHTML = items
      .map(
        (i) =>
          `<div class="srh-breakdown-item srh-breakdown-item--${i.points >= 0 ? "positive" : "negative"}"><span>${i.label}</span><strong>${i.points > 0 ? "+" : ""}${i.points}점</strong></div>`,
      )
      .join("");

    const tips = actionableTips();
    $("#srhActionableGrid").innerHTML = tips.length
      ? tips.map((t) => `<article class="srh-checklist-card"><span aria-hidden="true">→</span><p>${t}</p></article>`).join("")
      : `<p>현재 실행 가능한 보완 항목이 모두 반영되어 있습니다.</p>`;

    $("#srhTypeRankList").innerHTML = rankTypes()
      .map(
        (t, idx) =>
          `<div class="srh-type-rank-item"><span class="srh-type-rank-item__badge">${idx + 1}</span><div><strong>${t.name}</strong><p>${t.target} · 난이도 ${t.difficulty}</p></div></div>`,
      )
      .join("");

    syncURL();
  }

  function bindInputs() {
    root.querySelectorAll("[data-srh]").forEach((el) => {
      const key = el.dataset.srh;
      const eventName = el.tagName === "SELECT" ? "change" : el.type === "checkbox" ? "change" : "input";
      el.addEventListener(eventName, () => {
        state[key] = el.type === "checkbox" ? el.checked : key === "age" ? Number(el.value) : el.value;
        render();
      });
    });
  }

  function syncURL() {
    const p = new URLSearchParams();
    Object.entries(state).forEach(([k, v]) => p.set(k, typeof v === "boolean" ? (v ? "1" : "0") : v));
    history.replaceState(null, "", `?${p.toString()}`);
  }

  document.getElementById("srhResetBtn")?.addEventListener("click", () => {
    state = {
      age: 67,
      housingOwnership: "none",
      homelessYears: "10plus",
      residenceYears: "5plus",
      incomeLevel: "veryLow",
      isDisabled: false,
      subscriptionCount: "24plus",
      carOwnership: "noneOrCheap",
      isSeparatedFromChildren: true,
      strategyPopularAreaOnly: false,
      strategyNewBuildOnly: false,
      strategySingleApplicationOnly: false,
    };
    root.querySelectorAll("[data-srh]").forEach((el) => {
      const key = el.dataset.srh;
      if (el.type === "checkbox") el.checked = !!state[key];
      else el.value = state[key];
    });
    render();
  });

  document.getElementById("srhCopyBtn")?.addEventListener("click", () => {
    syncURL();
    navigator.clipboard?.writeText(location.href).catch(() => {});
  });

  bindInputs();
  render();
})();
