(function () {
  "use strict";

  const configEl = document.getElementById("sirConfig");
  if (!configEl) return;

  const config = JSON.parse(configEl.textContent || "{}");
  const generationPresets = Array.isArray(config.generationPresets) ? config.generationPresets : [];
  const scenarioPresets = Array.isArray(config.presets) ? config.presets : [];

  const state = {
    generation: "gen4",
    visitType: "outpatient",
    hospitalType: "clinic",
    hasSpecialNonCoveredRider: true,
    coveredPatientPaid: 50000,
    nonCoveredGeneral: 0,
    manualTherapy: 0,
    nonCoveredInjection: 0,
    mriMra: 0,
    prescriptionCost: 0,
    coveredCoinsuranceRate: 0.2,
    nonCoveredCoinsuranceRate: 0.3,
    specialNonCoveredCoinsuranceRate: 0.3,
    outpatientDeductible: 30000,
    outpatientLimit: 200000,
    annualLimit: 50000000,
    claimedThisYear: 0,
    nonCoveredBenefitThisYear: 0,
    activePresetId: "",
    ...(config.defaultInput || {}),
  };

  const els = {
    generationTabs: document.getElementById("sirGenerationTabs"),
    generationNote: document.getElementById("sirGenerationNote"),
    visitType: document.getElementById("sirVisitType"),
    hospitalType: document.getElementById("sirHospitalType"),
    hasSpecialRider: document.getElementById("sirHasSpecialRider"),
    claimedThisYear: document.getElementById("sirClaimedThisYear"),
    nonCoveredBenefitThisYear: document.getElementById("sirNonCoveredBenefitThisYear"),
    coveredPatientPaid: document.getElementById("sirCoveredPatientPaid"),
    nonCoveredGeneral: document.getElementById("sirNonCoveredGeneral"),
    manualTherapy: document.getElementById("sirManualTherapy"),
    nonCoveredInjection: document.getElementById("sirNonCoveredInjection"),
    mriMra: document.getElementById("sirMriMra"),
    prescriptionCost: document.getElementById("sirPrescriptionCost"),
    coveredRate: document.getElementById("sirCoveredRate"),
    nonCoveredRate: document.getElementById("sirNonCoveredRate"),
    specialRate: document.getElementById("sirSpecialRate"),
    outpatientDeductible: document.getElementById("sirOutpatientDeductible"),
    outpatientLimit: document.getElementById("sirOutpatientLimit"),
    annualLimit: document.getElementById("sirAnnualLimit"),
    presets: document.getElementById("sirPresets"),
    resultSummary: document.getElementById("sirResultSummary"),
    estimatedRefund: document.getElementById("sirEstimatedRefund"),
    eligibleAmount: document.getElementById("sirEligibleAmount"),
    deductibleAmount: document.getElementById("sirDeductibleAmount"),
    remainingLimit: document.getElementById("sirRemainingLimit"),
    tierBox: document.getElementById("sirTierBox"),
    tierBadge: document.getElementById("sirTierBadge"),
    tierDescription: document.getElementById("sirTierDescription"),
    warningList: document.getElementById("sirWarningList"),
    breakdownBody: document.getElementById("sirBreakdownBody"),
    resetBtn: document.getElementById("sirResetBtn"),
    copyBtn: document.getElementById("sirCopyLinkBtn"),
  };

  const moneyKeys = [
    "claimedThisYear",
    "nonCoveredBenefitThisYear",
    "coveredPatientPaid",
    "nonCoveredGeneral",
    "manualTherapy",
    "nonCoveredInjection",
    "mriMra",
    "prescriptionCost",
    "outpatientDeductible",
    "outpatientLimit",
    "annualLimit",
  ];

  const moneyInputMap = {
    claimedThisYear: els.claimedThisYear,
    nonCoveredBenefitThisYear: els.nonCoveredBenefitThisYear,
    coveredPatientPaid: els.coveredPatientPaid,
    nonCoveredGeneral: els.nonCoveredGeneral,
    manualTherapy: els.manualTherapy,
    nonCoveredInjection: els.nonCoveredInjection,
    mriMra: els.mriMra,
    prescriptionCost: els.prescriptionCost,
    outpatientDeductible: els.outpatientDeductible,
    outpatientLimit: els.outpatientLimit,
    annualLimit: els.annualLimit,
  };

  function parseWon(value) {
    return Math.max(0, Number(String(value || "").replace(/[^\d.-]/g, "")) || 0);
  }

  function fmtInputWon(value) {
    return Math.round(Number(value) || 0).toLocaleString("ko-KR");
  }

  function fmtWon(value) {
    return `${Math.round(Number(value) || 0).toLocaleString("ko-KR")}원`;
  }

  function fmtBig(value) {
    const rounded = Math.round(Number(value) || 0);
    const sign = rounded < 0 ? "-" : "";
    const abs = Math.abs(rounded);
    const eok = Math.floor(abs / 100000000);
    const man = Math.round((abs % 100000000) / 10000);
    if (eok > 0 && man > 0) return `${sign}${eok}억 ${man.toLocaleString("ko-KR")}만 원`;
    if (eok > 0) return `${sign}${eok}억 원`;
    if (man > 0) return `${sign}${man.toLocaleString("ko-KR")}만 원`;
    return `${sign}${abs.toLocaleString("ko-KR")}원`;
  }

  function clamp(value, min, max) {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.min(max, Math.max(min, n));
  }

  function setText(node, value) {
    if (node) node.textContent = value;
  }

  function setMoneyInput(key) {
    const node = moneyInputMap[key];
    if (node) node.value = fmtInputWon(state[key]);
  }

  function getGenerationPreset(id) {
    return generationPresets.find((item) => item.id === id);
  }

  function applyGenerationPreset(id) {
    state.generation = id;
    const preset = getGenerationPreset(id);
    if (preset) {
      state.coveredCoinsuranceRate = preset.coveredCoinsuranceRate;
      state.nonCoveredCoinsuranceRate = preset.nonCoveredCoinsuranceRate;
      state.specialNonCoveredCoinsuranceRate = preset.specialNonCoveredCoinsuranceRate;
      state.outpatientDeductible = preset.outpatientDeductible;
      state.outpatientLimit = preset.outpatientLimit;
      state.annualLimit = preset.annualLimit;
    }
    render();
  }

  function buildItem(label, amount, rate, note, eligibleOverride) {
    const eligibleAmount = typeof eligibleOverride === "number" ? eligibleOverride : amount;
    const deductible = eligibleAmount * rate;
    const refundBase = Math.max(eligibleAmount - deductible, 0);
    return {
      label,
      amount,
      eligibleAmount,
      deductible,
      refundBase,
      note,
    };
  }

  function calculate(s) {
    const specialTotal = s.manualTherapy + s.nonCoveredInjection + s.mriMra;
    const specialEligible = s.hasSpecialNonCoveredRider ? undefined : 0;
    const specialNote = s.hasSpecialNonCoveredRider ? "3대 비급여 특약" : "특약 미가입";
    const items = [
      buildItem("급여 본인부담금", s.coveredPatientPaid, s.coveredCoinsuranceRate, "급여", s.coveredPatientPaid),
      buildItem("일반 비급여", s.nonCoveredGeneral, s.nonCoveredCoinsuranceRate, "비급여", s.nonCoveredGeneral),
      buildItem("도수·체외충격파·증식치료", s.manualTherapy, s.specialNonCoveredCoinsuranceRate, specialNote, specialEligible),
      buildItem("비급여 주사료", s.nonCoveredInjection, s.specialNonCoveredCoinsuranceRate, specialNote, specialEligible),
      buildItem("MRI/MRA", s.mriMra, s.specialNonCoveredCoinsuranceRate, specialNote, specialEligible),
      buildItem("처방조제비", s.prescriptionCost, s.coveredCoinsuranceRate, "처방조제비", s.prescriptionCost),
    ].filter((item) => item.amount > 0);

    const totalPaid = items.reduce((sum, item) => sum + item.amount, 0);
    const eligibleAmount = items.reduce((sum, item) => sum + item.eligibleAmount, 0);
    const itemDeductible = items.reduce((sum, item) => sum + item.deductible, 0);
    const refundBase = items.reduce((sum, item) => sum + item.refundBase, 0);
    const outpatientDeductibleApplied =
      s.visitType === "outpatient" ? Math.min(refundBase, s.outpatientDeductible) : 0;
    const afterOutpatientDeductible = Math.max(refundBase - outpatientDeductibleApplied, 0);
    const afterVisitLimit =
      s.visitType === "outpatient" ? Math.min(afterOutpatientDeductible, s.outpatientLimit) : afterOutpatientDeductible;
    const remainingLimitBefore = Math.max(s.annualLimit - s.claimedThisYear, 0);
    const estimatedRefund = Math.min(afterVisitLimit, remainingLimitBefore);
    const remainingLimitAfter = Math.max(remainingLimitBefore - estimatedRefund, 0);
    const nonCoveredBase = items
      .filter((item) => item.label !== "급여 본인부담금" && item.label !== "처방조제비")
      .reduce((sum, item) => sum + item.refundBase, 0);
    const nonCoveredClaimRefund = refundBase > 0 ? estimatedRefund * (nonCoveredBase / refundBase) : 0;
    const nonCoveredBenefitAfterClaim = s.nonCoveredBenefitThisYear + nonCoveredClaimRefund;

    return {
      items,
      totalPaid,
      specialTotal,
      eligibleAmount,
      itemDeductible,
      refundBase,
      outpatientDeductibleApplied,
      visitLimitCut: Math.max(afterOutpatientDeductible - afterVisitLimit, 0),
      annualLimitCut: Math.max(afterVisitLimit - estimatedRefund, 0),
      estimatedRefund,
      remainingLimitBefore,
      remainingLimitAfter,
      deductibleTotal: Math.max(totalPaid - estimatedRefund, 0),
      nonCoveredBenefitAfterClaim,
    };
  }

  function getTier(amount) {
    if (amount === 0) {
      return {
        label: "비급여 할인 가능 구간",
        tone: "positive",
        description: "올해 비급여 보험금이 없거나 매우 낮은 상태입니다. 4세대 실손은 갱신 시 할인 구간에 해당할 수 있습니다.",
      };
    }
    if (amount < 1000000) {
      return {
        label: "비급여 유지 구간",
        tone: "neutral",
        description: "비급여 보험금 누적액이 100만 원 미만입니다. 통상 할증 전 구간으로 참고할 수 있습니다.",
      };
    }
    if (amount < 1500000) {
      return {
        label: "비급여 할증 주의",
        tone: "caution",
        description: "비급여 보험금 누적액이 100만 원을 넘었습니다. 4세대 실손은 갱신 보험료 영향 여부를 확인하세요.",
      };
    }
    if (amount < 3000000) {
      return {
        label: "비급여 높은 할증 가능",
        tone: "caution",
        description: "비급여 보험금 누적액이 높은 편입니다. 추가 청구 전 보험료 차등 구간을 확인하는 것이 좋습니다.",
      };
    }
    return {
      label: "비급여 최대 할증 가능",
      tone: "danger",
      description: "비급여 보험금 누적액이 300만 원 이상입니다. 실제 할증률은 보험회사와 갱신 조건에서 확인해야 합니다.",
    };
  }

  function getWarnings(s, result) {
    const warnings = [
      "이 결과는 입력값과 대표 자기부담률을 이용한 예상치입니다. 실제 보험금은 약관, 특약, 면책사항, 심사 결과에 따라 달라질 수 있습니다.",
    ];
    if (s.generation === "gen1" || s.generation === "gen2") {
      warnings.push("1세대·2세대 실손은 가입 시기와 보험회사별 약관 차이가 커서 보험증권 기준 직접 입력을 권장합니다.");
    }
    if (!s.hasSpecialNonCoveredRider && result.specialTotal > 0) {
      warnings.push("3대 비급여 특약 미가입으로 설정되어 도수치료·비급여 주사료·MRI/MRA 금액은 보장대상에서 제외했습니다.");
    }
    if (s.visitType === "outpatient" && result.refundBase <= s.outpatientDeductible && result.eligibleAmount > 0) {
      warnings.push("통원 최소 공제금액보다 환급 기초액이 작거나 비슷해 환급액이 0원일 수 있습니다.");
    }
    if (result.remainingLimitBefore <= 0) {
      warnings.push("연간 한도를 이미 소진한 것으로 입력되어 이번 청구 예상 환급액이 제한됩니다.");
    }
    if (s.generation === "gen4") {
      warnings.push("4세대 실손은 비급여 보험금 누적액에 따라 갱신 보험료가 달라질 수 있습니다.");
    }
    return warnings;
  }

  function rowHtml(cells) {
    return `<tr>${cells.map((cell) => `<td>${cell}</td>`).join("")}</tr>`;
  }

  function renderBreakdown(result) {
    if (!els.breakdownBody) return;
    const rows = result.items.map((item) =>
      rowHtml([
        item.label,
        fmtWon(item.amount),
        fmtWon(item.eligibleAmount),
        fmtWon(item.deductible),
        fmtWon(item.refundBase),
        item.note,
      ])
    );
    if (result.outpatientDeductibleApplied > 0) {
      rows.push(rowHtml(["통원 최소 공제", "-", "-", fmtWon(result.outpatientDeductibleApplied), "-", "통원 공제 반영"]));
    }
    if (result.visitLimitCut > 0) {
      rows.push(rowHtml(["통원 회당 한도", "-", "-", fmtWon(result.visitLimitCut), "-", "회당 한도 초과분"]));
    }
    if (result.annualLimitCut > 0) {
      rows.push(rowHtml(["연간 한도", "-", "-", fmtWon(result.annualLimitCut), "-", "연간 잔여 한도 초과분"]));
    }
    els.breakdownBody.innerHTML = rows.length
      ? rows.join("")
      : rowHtml(["입력 대기", "0원", "0원", "0원", "0원", "영수증 금액을 입력하세요"]);
  }

  function syncInputs() {
    if (els.visitType) els.visitType.value = state.visitType;
    if (els.hospitalType) els.hospitalType.value = state.hospitalType;
    if (els.hasSpecialRider) els.hasSpecialRider.checked = state.hasSpecialNonCoveredRider;
    if (els.coveredRate) els.coveredRate.value = String(Math.round(state.coveredCoinsuranceRate * 100));
    if (els.nonCoveredRate) els.nonCoveredRate.value = String(Math.round(state.nonCoveredCoinsuranceRate * 100));
    if (els.specialRate) els.specialRate.value = String(Math.round(state.specialNonCoveredCoinsuranceRate * 100));
    moneyKeys.forEach(setMoneyInput);
  }

  function syncButtons() {
    document.querySelectorAll("[data-generation]").forEach((button) => {
      const active = button.getAttribute("data-generation") === state.generation;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
    document.querySelectorAll("[data-preset-id]").forEach((button) => {
      button.classList.toggle("is-active", button.getAttribute("data-preset-id") === state.activePresetId);
    });
  }

  function render() {
    syncInputs();
    syncButtons();
    const generation = getGenerationPreset(state.generation);
    if (els.generationNote) {
      els.generationNote.textContent = generation
        ? `${generation.description} ${generation.caution}`
        : "직접 입력 모드입니다. 내 보험증권의 자기부담률, 통원 공제금액, 연간 한도를 입력하세요.";
    }

    const result = calculate(state);
    const tier = getTier(result.nonCoveredBenefitAfterClaim);
    setText(
      els.resultSummary,
      `총 병원비 ${fmtBig(result.totalPaid)} 기준 예상 환급액은 ${fmtBig(result.estimatedRefund)}입니다.`
    );
    setText(els.estimatedRefund, fmtBig(result.estimatedRefund));
    setText(els.eligibleAmount, fmtBig(result.eligibleAmount));
    setText(els.deductibleAmount, fmtBig(result.deductibleTotal));
    setText(els.remainingLimit, fmtBig(result.remainingLimitAfter));
    setText(els.tierBadge, tier.label);
    setText(els.tierDescription, `${tier.description} 이번 청구 후 비급여 누적 예상액은 ${fmtBig(result.nonCoveredBenefitAfterClaim)}입니다.`);
    if (els.tierBox) {
      els.tierBox.className = `sir-tier-box sir-tier-box--${tier.tone}`;
    }
    if (els.warningList) {
      els.warningList.innerHTML = getWarnings(state, result).map((warning) => `<li>${warning}</li>`).join("");
    }
    renderBreakdown(result);
    updateUrl(result);
  }

  function updateUrl(result) {
    const params = new URLSearchParams();
    params.set("gen", state.generation);
    params.set("visit", state.visitType);
    params.set("covered", String(Math.round(state.coveredPatientPaid)));
    params.set("noncovered", String(Math.round(state.nonCoveredGeneral)));
    params.set("manual", String(Math.round(state.manualTherapy)));
    params.set("injection", String(Math.round(state.nonCoveredInjection)));
    params.set("mri", String(Math.round(state.mriMra)));
    params.set("claimed", String(Math.round(state.claimedThisYear)));
    params.set("nb", String(Math.round(state.nonCoveredBenefitThisYear)));
    const next = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", next);
  }

  function loadFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const gen = params.get("gen");
    if (gen === "gen1" || gen === "gen2" || gen === "gen3" || gen === "gen4" || gen === "custom") {
      state.generation = gen;
      const preset = getGenerationPreset(gen);
      if (preset) {
        state.coveredCoinsuranceRate = preset.coveredCoinsuranceRate;
        state.nonCoveredCoinsuranceRate = preset.nonCoveredCoinsuranceRate;
        state.specialNonCoveredCoinsuranceRate = preset.specialNonCoveredCoinsuranceRate;
        state.outpatientDeductible = preset.outpatientDeductible;
        state.outpatientLimit = preset.outpatientLimit;
        state.annualLimit = preset.annualLimit;
      }
    }
    const visit = params.get("visit");
    if (visit === "outpatient" || visit === "inpatient") state.visitType = visit;
    const valueMap = {
      covered: "coveredPatientPaid",
      noncovered: "nonCoveredGeneral",
      manual: "manualTherapy",
      injection: "nonCoveredInjection",
      mri: "mriMra",
      claimed: "claimedThisYear",
      nb: "nonCoveredBenefitThisYear",
    };
    Object.entries(valueMap).forEach(([param, key]) => {
      if (params.has(param)) state[key] = parseWon(params.get(param));
    });
  }

  function bindInputs() {
    moneyKeys.forEach((key) => {
      const node = moneyInputMap[key];
      if (!node) return;
      node.addEventListener("input", () => {
        state[key] = parseWon(node.value);
        state.activePresetId = "";
        render();
      });
      node.addEventListener("blur", () => setMoneyInput(key));
    });
    if (els.visitType) {
      els.visitType.addEventListener("change", () => {
        state.visitType = els.visitType.value;
        render();
      });
    }
    if (els.hospitalType) {
      els.hospitalType.addEventListener("change", () => {
        state.hospitalType = els.hospitalType.value;
        render();
      });
    }
    if (els.hasSpecialRider) {
      els.hasSpecialRider.addEventListener("change", () => {
        state.hasSpecialNonCoveredRider = els.hasSpecialRider.checked;
        render();
      });
    }
    [
      [els.coveredRate, "coveredCoinsuranceRate"],
      [els.nonCoveredRate, "nonCoveredCoinsuranceRate"],
      [els.specialRate, "specialNonCoveredCoinsuranceRate"],
    ].forEach(([node, key]) => {
      if (!node) return;
      node.addEventListener("input", () => {
        state[key] = clamp(Number(node.value) / 100, 0, 1);
        state.generation = "custom";
        state.activePresetId = "";
        render();
      });
    });
  }

  function bindButtons() {
    if (els.generationTabs) {
      els.generationTabs.addEventListener("click", (event) => {
        const button = event.target.closest("[data-generation]");
        if (!button) return;
        state.activePresetId = "";
        applyGenerationPreset(button.getAttribute("data-generation"));
      });
    }
    if (els.presets) {
      els.presets.addEventListener("click", (event) => {
        const button = event.target.closest("[data-preset-id]");
        if (!button) return;
        const preset = scenarioPresets.find((item) => item.id === button.getAttribute("data-preset-id"));
        if (!preset) return;
        Object.assign(state, config.defaultInput || {}, preset.input || {});
        state.activePresetId = preset.id;
        const generation = getGenerationPreset(state.generation);
        if (generation) {
          state.coveredCoinsuranceRate = generation.coveredCoinsuranceRate;
          state.nonCoveredCoinsuranceRate = generation.nonCoveredCoinsuranceRate;
          state.specialNonCoveredCoinsuranceRate = generation.specialNonCoveredCoinsuranceRate;
          state.outpatientDeductible = generation.outpatientDeductible;
          state.outpatientLimit = generation.outpatientLimit;
          state.annualLimit = generation.annualLimit;
        }
        render();
      });
    }
    if (els.resetBtn) {
      els.resetBtn.addEventListener("click", () => {
        Object.assign(state, config.defaultInput || {});
        state.activePresetId = "";
        render();
      });
    }
    if (els.copyBtn) {
      els.copyBtn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          els.copyBtn.textContent = "링크 복사됨";
          window.setTimeout(() => {
            els.copyBtn.textContent = "링크 복사";
          }, 1400);
        } catch (error) {
          els.copyBtn.textContent = "주소창 링크를 복사하세요";
        }
      });
    }
  }

  loadFromUrl();
  bindInputs();
  bindButtons();
  render();
})();
