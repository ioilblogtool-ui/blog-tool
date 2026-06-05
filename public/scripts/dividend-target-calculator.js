(() => {
  const cfg = document.getElementById("dtcConfig");
  if (!cfg) return;
  const { presets } = JSON.parse(cfg.textContent || "{}");

  const DEFAULT_SELECTED = ["cony", "ymax", "schd", "tiger-plus"];
  const state = {
    targetMonthly: 1_000_000,
    taxMode: "before",
    selected: Object.fromEntries(presets.map(p => [p.id, DEFAULT_SELECTED.includes(p.id)])),
  };

  const fmt = n => {
    n = Math.round(n);
    if (n >= 100_000_000) return `${(n / 100_000_000).toFixed(1)}억 원`;
    if (n >= 10_000) return `${Math.round(n / 10_000).toLocaleString("ko-KR")}만 원`;
    return `${n.toLocaleString("ko-KR")}원`;
  };

  const parse = v => Number(String(v).replace(/[^\d]/g, "")) || 0;

  const els = {
    target: document.querySelector("[data-dtc-target]"),
    taxBtns: document.querySelectorAll("[data-dtc-tax]"),
    taxDesc: document.querySelector("[data-dtc-tax-desc]"),
    presetChecks: document.querySelectorAll("[data-dtc-preset-check]"),
    presetLabels: document.querySelectorAll("[data-dtc-preset-label]"),
    quickBtns: document.querySelectorAll("[data-dtc-quick]"),
    countBadge: document.querySelector("[data-dtc-selected-count]"),
    minInvest: document.querySelector("[data-dtc-min-invest]"),
    minEtf: document.querySelector("[data-dtc-min-etf]"),
    tableBody: document.querySelector("[data-dtc-table-body]"),
    resetBtn: document.getElementById("dtcResetBtn"),
    copyBtn: document.getElementById("dtcCopyBtn"),
  };

  function calcRequired(preset) {
    const annualTarget = state.targetMonthly * 12;
    const grossTarget = state.taxMode === "after"
      ? annualTarget / (1 - preset.taxRate / 100)
      : annualTarget;
    return grossTarget / (preset.annualYield / 100);
  }

  function calcNetMonthly(preset) {
    const gross = state.targetMonthly;
    if (state.taxMode === "before") return gross * (1 - preset.taxRate / 100);
    return gross;
  }

  function render() {
    const active = presets.filter(p => state.selected[p.id]);
    if (els.countBadge) els.countBadge.textContent = `${active.length}개 선택`;
    if (active.length === 0) {
      if (els.minInvest) els.minInvest.textContent = "ETF를 선택하세요";
      if (els.tableBody) els.tableBody.innerHTML = "";
      return;
    }

    const results = active.map(p => ({
      preset: p,
      required: calcRequired(p),
      netMonthly: calcNetMonthly(p),
    })).sort((a, b) => a.required - b.required);

    const best = results[0];
    if (els.minInvest) els.minInvest.textContent = fmt(best.required);
    if (els.minEtf) els.minEtf.textContent = `${best.preset.name} (연 ${best.preset.annualYield}%)`;

    const riskLabel = { high: "🔴 고위험", medium: "🟡 중간", low: "🟢 안정" };

    if (els.tableBody) {
      els.tableBody.innerHTML = results.map((r, i) => `
        <tr class="${i === 0 ? "dtc-row--best" : ""}">
          <td>${i === 0 ? '<span class="dtc-rank-badge">최저</span>' : `${i + 1}위`} ${r.preset.name}</td>
          <td>연 ${r.preset.annualYield}%</td>
          <td class="dtc-td-invest">${fmt(r.required)}</td>
          <td>${fmt(r.netMonthly)}</td>
          <td>${riskLabel[r.preset.risk] || ""}</td>
        </tr>
      `).join("");
    }
  }

  // 목표 금액 입력
  if (els.target) {
    els.target.addEventListener("input", () => {
      state.targetMonthly = parse(els.target.value);
      els.target.value = state.targetMonthly.toLocaleString("ko-KR");
      render(); saveUrl();
    });
    els.target.addEventListener("focus", () => { els.target.value = String(state.targetMonthly); });
    els.target.addEventListener("blur", () => { els.target.value = state.targetMonthly.toLocaleString("ko-KR"); });
  }

  // 빠른 버튼
  els.quickBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      state.targetMonthly = parseInt(btn.dataset.dtcQuick) || 1_000_000;
      if (els.target) els.target.value = state.targetMonthly.toLocaleString("ko-KR");
      render(); saveUrl();
    });
  });

  // 세전/세후 토글
  els.taxBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      state.taxMode = btn.dataset.dtcTax;
      els.taxBtns.forEach(b => b.classList.toggle("active", b === btn));
      if (els.taxDesc) els.taxDesc.textContent = state.taxMode === "before"
        ? "세전: 분배금에서 세금 차감 전 금액 기준"
        : "세후: 실제 통장에 입금될 금액 기준";
      render(); saveUrl();
    });
  });

  // 체크박스
  els.presetChecks.forEach(chk => {
    chk.addEventListener("change", () => {
      state.selected[chk.dataset.dtcPresetCheck] = chk.checked;
      els.presetLabels.forEach(l => l.classList.toggle("active", state.selected[l.dataset.dtcPresetLabel]));
      render(); saveUrl();
    });
  });

  function saveUrl() {
    const p = new URLSearchParams();
    p.set("target", state.targetMonthly);
    p.set("tax", state.taxMode);
    p.set("sel", presets.filter(pr => state.selected[pr.id]).map(pr => pr.id).join(","));
    history.replaceState(null, "", `?${p}`);
  }

  function loadUrl() {
    const p = new URLSearchParams(location.search);
    if (p.has("target")) {
      state.targetMonthly = parseInt(p.get("target")) || 1_000_000;
      if (els.target) els.target.value = state.targetMonthly.toLocaleString("ko-KR");
    }
    if (p.has("tax")) {
      state.taxMode = p.get("tax");
      els.taxBtns.forEach(b => b.classList.toggle("active", b.dataset.dtcTax === state.taxMode));
    }
    if (p.has("sel")) {
      const ids = p.get("sel").split(",");
      presets.forEach(pr => { state.selected[pr.id] = ids.includes(pr.id); });
      els.presetChecks.forEach(c => { c.checked = state.selected[c.dataset.dtcPresetCheck] || false; });
      els.presetLabels.forEach(l => l.classList.toggle("active", state.selected[l.dataset.dtcPresetLabel]));
    }
  }

  if (els.resetBtn) els.resetBtn.addEventListener("click", () => {
    state.targetMonthly = 1_000_000; state.taxMode = "before";
    presets.forEach(p => { state.selected[p.id] = DEFAULT_SELECTED.includes(p.id); });
    if (els.target) els.target.value = "1,000,000";
    els.taxBtns.forEach(b => b.classList.toggle("active", b.dataset.dtcTax === "before"));
    els.presetChecks.forEach(c => { c.checked = state.selected[c.dataset.dtcPresetCheck] || false; });
    els.presetLabels.forEach(l => l.classList.toggle("active", state.selected[l.dataset.dtcPresetLabel]));
    history.replaceState(null, "", location.pathname);
    render();
  });

  if (els.copyBtn) els.copyBtn.addEventListener("click", () => { saveUrl(); navigator.clipboard.writeText(location.href).catch(() => {}); });

  loadUrl();
  render();
})();
