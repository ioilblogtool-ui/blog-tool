(function () {
  const root = document.querySelector(".cacc-page");
  const configNode = document.getElementById("caccConfig");
  if (!root || !configNode) return;

  const config = JSON.parse(configNode.textContent || "{}");
  const presets = config.presets || [];
  const formatter = new Intl.NumberFormat("ko-KR");

  const q = (sel) => root.querySelector(sel);
  const qa = (sel) => Array.from(root.querySelectorAll(sel));
  const parseNum = (v) => Number(String(v ?? "").replace(/[^\d.]/g, "")) || 0;
  const fmt = (v) => `${formatter.format(Math.round(v || 0))}원`;
  const fmtMan = (v) => {
    const man = Math.round(v / 10000);
    return `${formatter.format(man)}만원`;
  };

  const VERDICT = {
    insurance: { label: "보험처리 유리", cls: "cacc-verdict-badge--insurance" },
    cash:      { label: "현금처리 유리", cls: "cacc-verdict-badge--cash" },
    close:     { label: "비슷함 — 무사고 등급 고려", cls: "cacc-verdict-badge--close" },
  };

  // ── 상태 읽기 ──────────────────────────────────────────
  function readState() {
    return {
      repairCost:    parseNum(q("[data-cacc-repair]")?.value),
      deductible:    parseNum(q("[data-cacc-deductible]")?.value),
      annualPremium: parseNum(q("[data-cacc-premium]")?.value),
      surchargeRate: parseNum(q("[data-cacc-surcharge]")?.value) / 100,
      period:        parseNum(q("[data-cacc-period]")?.value) || 3,
    };
  }

  // ── 계산 ───────────────────────────────────────────────
  function calculate(s) {
    const annualSurcharge = s.annualPremium * s.surchargeRate;
    const insuranceTotal = s.deductible + annualSurcharge * s.period;
    const cashTotal = s.repairCost;
    const diff = cashTotal - insuranceTotal;
    const saving = Math.abs(diff);
    const breakEven = insuranceTotal;

    let verdict;
    if (saving < 100000) {
      verdict = "close";
    } else if (diff < 0) {
      verdict = "cash";
    } else {
      verdict = "insurance";
    }

    // 연도별 누적 테이블 데이터
    const maxPeriod = Math.max(s.period, 3);
    const rows = [];
    for (let y = 1; y <= maxPeriod; y++) {
      const insuranceCumul = s.deductible + annualSurcharge * y;
      rows.push({
        year: y,
        insuranceCumul,
        cashTotal,
        diff: cashTotal - insuranceCumul,
      });
    }

    return { verdict, saving, breakEven, insuranceTotal, cashTotal, annualSurcharge, rows };
  }

  // ── 렌더링 ─────────────────────────────────────────────
  function render(result) {
    // 판단 배지
    const badge = q("[data-cacc-verdict]");
    if (badge) {
      badge.textContent = VERDICT[result.verdict].label;
      badge.className = `cacc-verdict-badge ${VERDICT[result.verdict].cls}`;
    }

    // 판단 설명
    const desc = q("[data-cacc-verdict-desc]");
    if (desc) {
      if (result.verdict === "cash") {
        desc.textContent = `수리비(${fmtMan(result.cashTotal)})가 보험처리 3년 총비용(${fmtMan(result.insuranceTotal)})보다 저렴합니다.`;
      } else if (result.verdict === "insurance") {
        desc.textContent = `수리비(${fmtMan(result.cashTotal)})가 보험처리 3년 총비용(${fmtMan(result.insuranceTotal)})보다 비쌉니다.`;
      } else {
        desc.textContent = `두 선택의 3년 총비용 차이가 10만원 미만입니다. 무사고 등급 유지 여부를 우선 고려하세요.`;
      }
    }

    // KPI
    const savingEl = q("[data-cacc-saving]");
    if (savingEl) savingEl.textContent = fmtMan(result.saving);

    const breakevenEl = q("[data-cacc-breakeven]");
    if (breakevenEl) breakevenEl.textContent = fmtMan(result.breakEven);

    const insuranceTotalEl = q("[data-cacc-insurance-total]");
    if (insuranceTotalEl) insuranceTotalEl.textContent = fmtMan(result.insuranceTotal);

    // 비교 테이블
    renderTable(result);
  }

  function renderTable(result) {
    const tbody = q("[data-cacc-table-body]");
    if (!tbody) return;

    const theadRow = root.querySelector(".cacc-compare-table thead tr");

    // 헤더 동적 업데이트 (period에 맞게)
    const period = result.rows.length;
    if (theadRow) {
      theadRow.innerHTML = `
        <th>구분</th>
        <th>즉시 비용</th>
        ${result.rows.map((r) => `<th>${r.year}년 누적</th>`).join("")}
      `;
    }

    // 보험처리 행
    const insuranceRowCells = result.rows
      .map((r) => {
        const cls = r.diff > 0 ? " is-winner" : "";
        return `<td class="${cls}">${fmtMan(r.insuranceCumul)}</td>`;
      })
      .join("");

    // 현금처리 행
    const cashRowCells = result.rows
      .map((r) => {
        const cls = r.diff < 0 ? " is-winner" : "";
        return `<td class="${cls}">${fmtMan(r.cashTotal)}</td>`;
      })
      .join("");

    // 차이 행
    const diffCells = result.rows
      .map((r) => {
        const isInsurance = r.diff > 0;
        const label = Math.abs(r.diff) < 100000
          ? "비슷함"
          : (isInsurance ? `보험 유리 ${fmtMan(Math.abs(r.diff))}` : `현금 유리 ${fmtMan(Math.abs(r.diff))}`);
        const cls = Math.abs(r.diff) < 100000 ? "" : " is-saving";
        return `<td class="${cls}">${label}</td>`;
      })
      .join("");

    tbody.innerHTML = `
      <tr>
        <td>보험처리</td>
        <td>${fmtMan(result.rows[0] ? result.rows[0].insuranceCumul - result.annualSurcharge : 0)}</td>
        ${insuranceRowCells}
      </tr>
      <tr>
        <td>현금처리</td>
        <td>${fmtMan(result.cashTotal)}</td>
        ${cashRowCells}
      </tr>
      <tr class="is-total">
        <td>비교</td>
        <td>-</td>
        ${diffCells}
      </tr>
    `;
  }

  // ── 슬라이더 ↔ 숫자 동기화 ────────────────────────────
  function syncSliderToInput(sliderId, inputId, hintId, multiplier, unit) {
    const slider = document.getElementById(sliderId);
    const input = document.getElementById(inputId);
    const hint = document.getElementById(hintId);
    const valEl = document.getElementById(sliderId + "Val");

    if (!slider || !input) return;

    function updateHint(rawVal) {
      if (!hint) return;
      if (unit === "만원") {
        hint.textContent = `${formatter.format(rawVal)}만원`;
      } else if (unit === "%") {
        hint.textContent = `보험료의 ${rawVal}% 할증`;
      }
    }

    slider.addEventListener("input", () => {
      const val = Number(slider.value);
      input.value = unit === "%" ? val : val * multiplier;
      if (valEl) valEl.textContent = `${formatter.format(val)}${unit}`;
      updateHint(val);
      update();
    });

    input.addEventListener("input", () => {
      const val = parseNum(input.value);
      const sliderVal = unit === "%" ? val : Math.round(val / multiplier);
      slider.value = Math.min(Math.max(sliderVal, Number(slider.min)), Number(slider.max));
      if (valEl) valEl.textContent = `${formatter.format(slider.value)}${unit}`;
      updateHint(Number(slider.value));
      update();
    });
  }

  // ── 프리셋 ─────────────────────────────────────────────
  function applyPreset(id) {
    const preset = presets.find((p) => p.id === id);
    if (!preset) return;

    const repairInput = q("[data-cacc-repair]");
    const deductibleInput = q("[data-cacc-deductible]");
    const surchargeInput = q("[data-cacc-surcharge]");

    if (repairInput) repairInput.value = preset.repairCost * 10000;
    if (deductibleInput) deductibleInput.value = preset.deductible * 10000;
    if (surchargeInput) surchargeInput.value = preset.surchargeRate;

    // 슬라이더 동기화
    const repairSlider = document.getElementById("caccRepairSlider");
    const deductibleSlider = document.getElementById("caccDeductibleSlider");
    const surchargeSlider = document.getElementById("caccSurchargeSlider");

    if (repairSlider) {
      repairSlider.value = preset.repairCost;
      const el = document.getElementById("caccRepairSliderVal");
      if (el) el.textContent = `${formatter.format(preset.repairCost)}만원`;
    }
    if (deductibleSlider) {
      deductibleSlider.value = preset.deductible;
      const el = document.getElementById("caccDeductibleSliderVal");
      if (el) el.textContent = `${formatter.format(preset.deductible)}만원`;
    }
    if (surchargeSlider) {
      surchargeSlider.value = preset.surchargeRate;
      const el = document.getElementById("caccSurchargeSliderVal");
      if (el) el.textContent = `${preset.surchargeRate}%`;
    }

    // 프리셋 버튼 하이라이트
    qa("[data-cacc-preset]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.caccPreset === id);
    });

    update();
  }

  // ── 업데이트 ───────────────────────────────────────────
  function update() {
    const state = readState();
    const result = calculate(state);
    render(result);
  }

  // ── 리셋 ───────────────────────────────────────────────
  const resetBtn = document.getElementById("caccResetBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => applyPreset("bumper"));
  }

  // ── 링크 복사 ──────────────────────────────────────────
  const copyBtn = document.getElementById("caccCopyLinkBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const s = readState();
      const params = new URLSearchParams({
        repair: s.repairCost,
        deductible: s.deductible,
        premium: s.annualPremium,
        surcharge: Math.round(s.surchargeRate * 100),
        period: s.period,
      });
      const url = `${location.origin}${location.pathname}?${params}`;
      navigator.clipboard?.writeText(url).catch(() => {});
    });
  }

  // ── URL 파라미터 복원 ──────────────────────────────────
  function restoreFromUrl() {
    const params = new URLSearchParams(location.search);
    if (!params.has("repair")) return false;

    const repairInput = q("[data-cacc-repair]");
    const deductibleInput = q("[data-cacc-deductible]");
    const premiumInput = q("[data-cacc-premium]");
    const surchargeInput = q("[data-cacc-surcharge]");
    const periodSelect = q("[data-cacc-period]");

    if (repairInput && params.has("repair")) repairInput.value = params.get("repair");
    if (deductibleInput && params.has("deductible")) deductibleInput.value = params.get("deductible");
    if (premiumInput && params.has("premium")) premiumInput.value = params.get("premium");
    if (surchargeInput && params.has("surcharge")) surchargeInput.value = params.get("surcharge");
    if (periodSelect && params.has("period")) periodSelect.value = params.get("period");

    return true;
  }

  // ── 이벤트 바인딩 ──────────────────────────────────────
  syncSliderToInput("caccRepairSlider",     "caccRepairCost",   "caccRepairHint",      10000, "만원");
  syncSliderToInput("caccDeductibleSlider", "caccDeductible",   "caccDeductibleHint",  10000, "만원");
  syncSliderToInput("caccPremiumSlider",    "caccPremium",      "caccPremiumHint",     10000, "만원");
  syncSliderToInput("caccSurchargeSlider",  "caccSurcharge",    "caccSurchargeHint",   1,     "%");

  q("[data-cacc-period]")?.addEventListener("change", update);

  qa("[data-cacc-preset]").forEach((btn) => {
    btn.addEventListener("click", () => applyPreset(btn.dataset.caccPreset));
  });

  // ── 초기 실행 ──────────────────────────────────────────
  const restored = restoreFromUrl();
  if (!restored) {
    applyPreset("bumper");
  } else {
    update();
  }
})();
