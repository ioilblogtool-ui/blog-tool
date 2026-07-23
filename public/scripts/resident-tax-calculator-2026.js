import { readParam, writeParams } from "./url-state.js";

(() => {
  const root = document.querySelector(".resident-tax-page");
  const dataEl = document.getElementById("rtc-data");
  if (!root || !dataEl) return;

  const cfg = JSON.parse(dataEl.textContent || "{}");
  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => Array.from(root.querySelectorAll(selector));

  function num(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? Math.max(parsed, 0) : fallback;
  }

  function won(value) {
    return `${Math.round(value).toLocaleString("ko-KR")}원`;
  }

  function bool(value) {
    return value === true || value === "true";
  }

  function getCorporationBasicTax(capitalAmount, corporationType) {
    if (corporationType === "other") return 50_000;
    if (capitalAmount > 5_000_000_000) return 200_000;
    if (capitalAmount > 3_000_000_000) return 100_000;
    return 50_000;
  }

  function calcResidentTax(input) {
    const isIndividual = input.taxpayerType === "individual";
    const isIndividualBusiness = input.taxpayerType === "individualBusiness";
    const isCorporation = input.taxpayerType === "corporation";

    const individualBaseTax = isIndividual && !input.isIndividualExempt ? input.individualBaseTax : 0;
    const individualEduTax = Math.round(individualBaseTax * 0.25);
    const individualTotal = individualBaseTax + individualEduTax;

    const revenueBase = input.isVatExempt ? input.totalRevenue : input.vatBase;
    const isIndividualBusinessTaxable = isIndividualBusiness && revenueBase >= 80_000_000;
    const isBusinessSubject = isCorporation || isIndividualBusinessTaxable;

    const businessBasicTax = isBusinessSubject
      ? isCorporation
        ? getCorporationBasicTax(input.capitalAmount, input.corporationType)
        : 50_000
      : 0;

    const isFloorTaxApplied = isBusinessSubject && input.businessFloorArea > 330;
    const floorRate = input.isPollutionFacility ? 500 : 250;
    const businessFloorTax = isFloorTaxApplied ? Math.round(input.businessFloorArea * floorRate) : 0;
    const businessEduTax = Math.round(businessBasicTax * 0.25);
    const businessTotal = businessBasicTax + businessFloorTax + businessEduTax;

    const monthlyAveragePayroll = !isIndividual ? input.last12MonthsPayroll / 12 : 0;
    const isEmployeeTaxTarget = monthlyAveragePayroll > 180_000_000;
    const employeeTax = isEmployeeTaxTarget ? Math.round(input.currentMonthPayroll * 0.005) : 0;

    const totalTax = individualTotal + businessTotal + employeeTax;
    const dueDate = new Date(2026, 7, 31);
    const today = new Date();
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / 86400000);

    return {
      taxpayerType: input.taxpayerType,
      individualBaseTax,
      individualEduTax,
      individualTotal,
      isBusinessSubject,
      businessBasicTax,
      isFloorTaxApplied,
      businessFloorArea: input.businessFloorArea,
      floorRate,
      businessFloorTax,
      businessEduTax,
      businessTotal,
      monthlyAveragePayroll,
      isEmployeeTaxTarget,
      currentMonthPayroll: input.currentMonthPayroll,
      employeeTax,
      totalTax,
      dueLabel: "2026년 8월 31일",
      statusLabel: daysUntilDue >= 0 ? `마감까지 ${daysUntilDue}일` : "납부기한 경과",
    };
  }

  function readState() {
    const d = cfg.defaultInput;
    return {
      taxpayerType: $('[data-rtc-input="taxpayerType"]')?.value || d.taxpayerType,
      individualBaseTax: num($('[data-rtc-input="individualBaseTax"]')?.value, d.individualBaseTax),
      isIndividualExempt: bool($('[data-rtc-input="isIndividualExempt"]')?.checked),
      isVatExempt: bool($('[data-rtc-input="isVatExempt"]')?.checked),
      vatBase: num($('[data-rtc-input="vatBase"]')?.value, d.vatBase),
      totalRevenue: num($('[data-rtc-input="totalRevenue"]')?.value, d.totalRevenue),
      corporationType: $('[data-rtc-input="corporationType"]')?.value || d.corporationType,
      capitalAmount: num($('[data-rtc-input="capitalAmount"]')?.value, d.capitalAmount),
      businessFloorArea: num($('[data-rtc-input="businessFloorArea"]')?.value, d.businessFloorArea),
      isPollutionFacility: bool($('[data-rtc-input="isPollutionFacility"]')?.checked),
      last12MonthsPayroll: num($('[data-rtc-input="last12MonthsPayroll"]')?.value, d.last12MonthsPayroll),
      currentMonthPayroll: num($('[data-rtc-input="currentMonthPayroll"]')?.value, d.currentMonthPayroll),
      dueMonth: 8,
      dueDay: 31,
    };
  }

  function setInput(partial) {
    Object.entries(partial).forEach(([key, value]) => {
      const el = $(`[data-rtc-input="${key}"]`);
      if (!el) return;
      if (el.type === "checkbox") {
        el.checked = Boolean(value);
        return;
      }
      el.value = typeof value === "number" ? value.toLocaleString("ko-KR") : value;
    });
  }

  function updateVisibility(taxpayerType) {
    $$("[data-rtc-group]").forEach((el) => {
      const groups = el.dataset.rtcGroup.split(",");
      el.hidden = !groups.includes(taxpayerType);
    });
    root.querySelectorAll("[data-rtc-only-vat-exempt]").forEach((el) => {
      el.hidden = !$('[data-rtc-input="isVatExempt"]')?.checked;
    });
  }

  function renderBadges(result) {
    const wrap = $('[data-rtc-result="badges"]');
    if (!wrap) return;
    const badges = [];

    if (result.taxpayerType !== "individual") {
      badges.push(
        result.isBusinessSubject
          ? { tone: "info", text: "사업소분 과세 대상" }
          : { tone: "neutral", text: "사업소분 비과세 대상 (매출 8천만원 미만)" }
      );
      if (result.isBusinessSubject) {
        badges.push(
          result.isFloorTaxApplied
            ? { tone: "warn", text: "면적 세액 적용 · 330㎡ 초과로 전체 연면적 기준 계산" }
            : { tone: "neutral", text: "면적 세액 없음 · 330㎡ 이하" }
        );
        badges.push({ tone: "info", text: "지방교육세 포함 · 기본세액의 25%" });
      }
      badges.push(
        result.isEmployeeTaxTarget
          ? { tone: "warn", text: "종업원분 확인 필요 · 월평균 급여 1억 8천만원 초과" }
          : { tone: "neutral", text: "종업원분 비대상 · 월평균 급여 1억 8천만원 이하" }
      );
    } else if (result.individualBaseTax > 0) {
      badges.push({ tone: "info", text: "지방교육세 포함 · 본세의 25%" });
    }

    badges.push({ tone: "neutral", text: "지자체 확인 필요 · 조례·감면에 따라 실제 세액이 달라질 수 있음" });

    wrap.innerHTML = badges
      .map((b) => `<span class="augcalc-badge augcalc-badge--${b.tone}">${b.text}</span>`)
      .join("");
  }

  function renderFormula(result) {
    const wrap = $('[data-rtc-result="formula"]');
    if (!wrap) return;
    const rows = [];

    if (result.taxpayerType === "individual") {
      rows.push(["개인분 본세", won(result.individualBaseTax)]);
      rows.push(["지방교육세", `${won(result.individualBaseTax)} × 25% = ${won(result.individualEduTax)}`]);
      rows.push(["총 예상액", `${won(result.individualBaseTax)} + ${won(result.individualEduTax)} = ${won(result.individualTotal)}`]);
    } else if (!result.isBusinessSubject) {
      rows.push(["사업소분 기본세액", "과세 대상 아님 (0원)"]);
      if (result.isEmployeeTaxTarget) {
        rows.push(["종업원분", `${won(result.currentMonthPayroll)} × 0.5% = ${won(result.employeeTax)}`]);
      }
      rows.push(["총 예상액", won(result.totalTax)]);
    } else {
      rows.push(["사업소분 기본세액", won(result.businessBasicTax)]);
      rows.push([
        "연면적 세액",
        result.isFloorTaxApplied
          ? `${result.businessFloorArea.toLocaleString("ko-KR")}㎡ × ${result.floorRate}원 = ${won(result.businessFloorTax)}`
          : "330㎡ 이하로 없음 (0원)",
      ]);
      rows.push(["지방교육세", `${won(result.businessBasicTax)} × 25% = ${won(result.businessEduTax)}`]);
      if (result.isEmployeeTaxTarget) {
        rows.push(["종업원분", `${won(result.currentMonthPayroll)} × 0.5% = ${won(result.employeeTax)}`]);
      }
      const parts = [won(result.businessBasicTax), won(result.businessFloorTax), won(result.businessEduTax)];
      if (result.isEmployeeTaxTarget) parts.push(won(result.employeeTax));
      rows.push(["총 예상액", `${parts.join(" + ")} = ${won(result.totalTax)}`]);
    }

    wrap.innerHTML = rows
      .map(([label, value]) => `<div class="augcalc-formula__row"><span>${label}</span><strong>${value}</strong></div>`)
      .join("");
  }

  function render() {
    const state = readState();
    updateVisibility(state.taxpayerType);
    const result = calcResidentTax(state);

    $('[data-rtc-result="statusLabel"]').textContent = result.statusLabel;
    $('[data-rtc-result="totalTax"]').textContent = won(result.totalTax);
    $('[data-rtc-result="individualTax"]').textContent = won(result.individualTotal);
    $('[data-rtc-result="businessTax"]').textContent = won(result.businessTotal);
    $('[data-rtc-result="employeeTax"]').textContent = won(result.employeeTax);
    $('[data-rtc-result="eduTax"]').textContent = won(result.individualEduTax + result.businessEduTax);
    $('[data-rtc-result="dueLabel"]').textContent = result.dueLabel;
    $('[data-rtc-result="dueLabel2"]').textContent = result.dueLabel;

    renderBadges(result);
    renderFormula(result);

    writeParams({
      t: state.taxpayerType,
      ibt: state.individualBaseTax,
      ie: state.isIndividualExempt ? 1 : 0,
      ve: state.isVatExempt ? 1 : 0,
      vb: state.vatBase,
      tr: state.totalRevenue,
      ct: state.corporationType,
      ca: state.capitalAmount,
      fa: state.businessFloorArea,
      pf: state.isPollutionFacility ? 1 : 0,
      lp: state.last12MonthsPayroll,
      cp: state.currentMonthPayroll,
    });
  }

  root.querySelectorAll("[data-rtc-input]").forEach((el) => el.addEventListener("input", render));
  root.querySelectorAll("[data-rtc-input]").forEach((el) => el.addEventListener("change", render));
  root.querySelectorAll("[data-rtc-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      const preset = cfg.presets.find((item) => item.id === button.dataset.rtcPreset);
      if (!preset) return;
      root.querySelectorAll("[data-rtc-preset]").forEach((el) => el.classList.toggle("is-active", el === button));
      setInput({ ...cfg.defaultInput, ...preset.input });
      render();
    });
  });

  document.getElementById("rtcResetBtn")?.addEventListener("click", () => { window.location.href = window.location.pathname; });
  document.getElementById("rtcCopyBtn")?.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(window.location.href); } catch {}
  });

  function restoreFromUrl() {
    const taxpayerType = readParam("t", "");
    if (!taxpayerType) return;
    setInput({
      taxpayerType,
      individualBaseTax: num(readParam("ibt", ""), cfg.defaultInput.individualBaseTax),
      isIndividualExempt: readParam("ie", "0") === "1",
      isVatExempt: readParam("ve", "0") === "1",
      vatBase: num(readParam("vb", ""), cfg.defaultInput.vatBase),
      totalRevenue: num(readParam("tr", ""), cfg.defaultInput.totalRevenue),
      corporationType: readParam("ct", "") || cfg.defaultInput.corporationType,
      capitalAmount: num(readParam("ca", ""), cfg.defaultInput.capitalAmount),
      businessFloorArea: num(readParam("fa", ""), cfg.defaultInput.businessFloorArea),
      isPollutionFacility: readParam("pf", "0") === "1",
      last12MonthsPayroll: num(readParam("lp", ""), cfg.defaultInput.last12MonthsPayroll),
      currentMonthPayroll: num(readParam("cp", ""), cfg.defaultInput.currentMonthPayroll),
    });
  }

  restoreFromUrl();
  render();
})();
