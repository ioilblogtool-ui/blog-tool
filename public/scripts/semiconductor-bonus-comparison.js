(() => {
  const configEl = document.getElementById("sbcConfig");
  const root = document.querySelector("[data-sbc-calculator]");
  if (!configEl || !root) return;

  const config = JSON.parse(configEl.textContent || "{}");
  const companies = Array.isArray(config.companies) ? config.companies : [];
  const taxBrackets = Array.isArray(config.taxBrackets) ? config.taxBrackets : [];

  const state = {
    annualSalary: 80_000_000,
    monthlySalary: 6_666_667,
    monthlySalaryTouched: false,
    taxMode: "simple",
    manualTaxRate: 0.22,
    companies: {},
  };

  companies.forEach((company) => {
    state.companies[company.id] = {
      selected: Boolean(company.defaultSelected),
      mode: company.defaultMode || "salaryPercent",
      salaryPercent: Number(company.defaultSalaryPercent || 0),
      monthlyMultiple: Number(company.defaultMonthlyMultiple || 0),
      fixedAmount: Number(company.defaultFixedAmount || 0),
    };
  });

  const els = {
    annualSalary: root.querySelector("[data-sbc-annual-salary]"),
    monthlySalary: root.querySelector("[data-sbc-monthly-salary]"),
    monthlyHint: root.querySelector("[data-sbc-monthly-hint]"),
    resetMonthly: root.querySelector("[data-sbc-reset-monthly]"),
    taxMode: root.querySelector("[data-sbc-tax-mode]"),
    manualTaxRate: root.querySelector("[data-sbc-manual-tax-rate]"),
    bestNet: document.querySelector("[data-sbc-best-net]"),
    maxGap: document.querySelector("[data-sbc-max-gap]"),
    monthlyGap: document.querySelector("[data-sbc-monthly-gap]"),
    bestTotal: document.querySelector("[data-sbc-best-total]"),
    compareNote: document.querySelector("[data-sbc-compare-note]"),
    resultTable: document.querySelector("[data-sbc-result-table]"),
    resultCards: document.querySelector("[data-sbc-result-cards]"),
    companyEmpty: root.querySelector("[data-sbc-company-empty]"),
    resetBtn: document.getElementById("sbcResetBtn"),
    copyBtn: document.getElementById("sbcCopyLinkBtn"),
  };

  const formatWon = (value) => {
    const rounded = Math.round(Number(value) || 0);
    if (Math.abs(rounded) >= 100_000_000) {
      const eok = rounded / 100_000_000;
      return `${eok.toLocaleString("ko-KR", { maximumFractionDigits: 1 })}억 원`;
    }
    if (Math.abs(rounded) >= 10_000) {
      return `${Math.round(rounded / 10_000).toLocaleString("ko-KR")}만 원`;
    }
    return `${rounded.toLocaleString("ko-KR")}원`;
  };

  const formatInputNumber = (value) => String(Math.max(0, Math.round(Number(value) || 0))).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const parseNumber = (value) => Number(String(value || "").replace(/[^\d.-]/g, "")) || 0;
  const groupLabels = {
    integrated: "종합 반도체",
    memory: "메모리",
    foundry: "파운드리",
    display: "디스플레이",
    fabless: "팹리스",
    equipment: "장비",
  };
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;",
  })[char]);

  function getCompany(id) {
    return companies.find((company) => company.id === id);
  }

  function findBracketRate(annualSalary) {
    const bracket = taxBrackets.find((item) => {
      const minOk = annualSalary >= Number(item.minAnnualSalary || 0);
      const maxOk = item.maxAnnualSalary === null || annualSalary <= Number(item.maxAnnualSalary);
      return minOk && maxOk;
    });
    return Number(bracket?.estimatedDeductionRate ?? 0.22);
  }

  function calculateGrossBonus(input) {
    if (input.mode === "salaryPercent") {
      return state.annualSalary * (input.salaryPercent / 100);
    }
    if (input.mode === "monthlyMultiple") {
      return state.monthlySalary * input.monthlyMultiple;
    }
    return input.fixedAmount;
  }

  function getTaxRate() {
    if (state.taxMode === "manual") return Math.min(Math.max(state.manualTaxRate, 0), 0.6);
    return findBracketRate(state.annualSalary);
  }

  function getInputLabel(input) {
    if (input.mode === "salaryPercent") return `연봉 대비 ${input.salaryPercent.toLocaleString("ko-KR")}％`;
    if (input.mode === "monthlyMultiple") return `월급 ${input.monthlyMultiple.toLocaleString("ko-KR")}개월`;
    return `고정 ${formatWon(input.fixedAmount)}`;
  }

  function calculateResults() {
    const taxRate = getTaxRate();
    return companies
      .filter((company) => state.companies[company.id]?.selected)
      .map((company) => {
        const input = state.companies[company.id];
        const grossBonus = calculateGrossBonus(input);
        const estimatedDeduction = grossBonus * taxRate;
        const netBonus = Math.max(grossBonus - estimatedDeduction, 0);
        return {
          company,
          input,
          grossBonus,
          estimatedDeduction,
          netBonus,
          netRate: grossBonus > 0 ? netBonus / grossBonus : 0,
          monthlyNetEquivalent: netBonus / 12,
          totalCompensation: state.annualSalary + grossBonus,
        };
      })
      .sort((a, b) => b.netBonus - a.netBonus);
  }

  function syncInputs() {
    if (els.annualSalary) els.annualSalary.value = formatInputNumber(state.annualSalary);
    if (els.monthlySalary) els.monthlySalary.value = formatInputNumber(state.monthlySalary);
    if (els.monthlyHint) {
      els.monthlyHint.textContent = state.monthlySalaryTouched
        ? "직접 입력한 월 기본급을 유지합니다."
        : "연봉 변경 시 연봉 ÷ 12로 자동 갱신됩니다.";
    }
    if (els.taxMode) els.taxMode.value = state.taxMode;
    if (els.manualTaxRate) {
      els.manualTaxRate.value = String(Math.round(state.manualTaxRate * 1000) / 10);
      els.manualTaxRate.disabled = state.taxMode !== "manual";
    }

    companies.forEach((company) => {
      const input = state.companies[company.id];
      const toggle = root.querySelector(`[data-sbc-company-toggle="${company.id}"]`);
      const panel = root.querySelector(`[data-sbc-company-panel="${company.id}"]`);
      const mode = root.querySelector(`[data-sbc-mode="${company.id}"]`);
      const percent = root.querySelector(`[data-sbc-salary-percent="${company.id}"]`);
      const multiple = root.querySelector(`[data-sbc-monthly-multiple="${company.id}"]`);
      const fixed = root.querySelector(`[data-sbc-fixed-amount="${company.id}"]`);
      if (toggle) toggle.checked = input.selected;
      if (panel) panel.hidden = !input.selected;
      if (mode) mode.value = input.mode;
      if (percent) percent.value = String(input.salaryPercent);
      if (multiple) multiple.value = String(input.monthlyMultiple);
      if (fixed) fixed.value = formatInputNumber(input.fixedAmount);

      root.querySelectorAll(`[data-sbc-field-group="${company.id}"]`).forEach((field) => {
        field.hidden = field.dataset.sbcFieldMode !== input.mode;
      });
    });

    const selectedCount = companies.filter((company) => state.companies[company.id]?.selected).length;
    if (els.companyEmpty) els.companyEmpty.hidden = selectedCount > 0;
  }

  function renderResults() {
    const results = calculateResults();
    const best = results[0];
    const worst = results[results.length - 1];
    const maxGap = best && worst ? Math.max(best.netBonus - worst.netBonus, 0) : 0;

    if (els.bestNet) els.bestNet.textContent = best ? formatWon(best.netBonus) : "선택 없음";
    if (els.maxGap) els.maxGap.textContent = formatWon(maxGap);
    if (els.monthlyGap) els.monthlyGap.textContent = formatWon(maxGap / 12);
    if (els.bestTotal) els.bestTotal.textContent = best ? formatWon(best.totalCompensation) : "선택 없음";
    if (els.compareNote) {
      els.compareNote.textContent = results.length <= 1
        ? "비교 회사를 2개 이상 선택하면 회사 간 차이를 함께 볼 수 있습니다."
        : `${best.company.name}이 현재 입력 기준에서 예상 세후 성과급이 가장 높습니다.`;
    }

    if (els.resultTable) {
      els.resultTable.innerHTML = results.map((result, index) => {
        const company = result.company;
        const detail = company.detailHref
          ? `<a href="${company.detailHref}">${escapeHtml(company.detailCtaLabel || "상세 계산")}</a>`
          : `<span>직접 입력</span>`;
        return `
          <tr class="${index === 0 ? "is-best" : ""}">
            <td><strong>${escapeHtml(company.name)}</strong><small>${escapeHtml(groupLabels[company.group] || "반도체")}</small></td>
            <td>${escapeHtml(company.defaultBonusTerm)}</td>
            <td>${escapeHtml(getInputLabel(result.input))}</td>
            <td>${formatWon(result.grossBonus)}</td>
            <td><strong>${formatWon(result.netBonus)}</strong><span>추정</span></td>
            <td>${formatWon(result.monthlyNetEquivalent)}</td>
            <td>${formatWon(result.totalCompensation)}</td>
            <td>${detail}</td>
          </tr>
        `;
      }).join("");
    }

    if (els.resultCards) {
      els.resultCards.innerHTML = results.map((result, index) => {
        const company = result.company;
        const detail = company.detailHref
          ? `<a href="${company.detailHref}">${escapeHtml(company.detailCtaLabel || "상세 계산")} →</a>`
          : "";
        return `
          <article class="sbc-result-card ${index === 0 ? "sbc-result-card--best" : ""}">
            <div class="sbc-result-card__head">
              <strong>${escapeHtml(company.name)}</strong>
              <span>${index === 0 ? "현재 최고" : "시뮬레이션"}</span>
            </div>
            <dl>
              <div><dt>입력 기준</dt><dd>${escapeHtml(getInputLabel(result.input))}</dd></div>
              <div><dt>세전 성과급</dt><dd>${formatWon(result.grossBonus)}</dd></div>
              <div><dt>예상 세후</dt><dd>${formatWon(result.netBonus)}</dd></div>
              <div><dt>월평균 환산</dt><dd>${formatWon(result.monthlyNetEquivalent)}</dd></div>
            </dl>
            <p>${escapeHtml(company.caution)}</p>
            ${detail}
          </article>
        `;
      }).join("");
    }
  }

  function update() {
    syncInputs();
    renderResults();
  }

  function resetAll() {
    state.annualSalary = 80_000_000;
    state.monthlySalary = Math.round(state.annualSalary / 12);
    state.monthlySalaryTouched = false;
    state.taxMode = "simple";
    state.manualTaxRate = 0.22;
    companies.forEach((company) => {
      state.companies[company.id] = {
        selected: Boolean(company.defaultSelected),
        mode: company.defaultMode || "salaryPercent",
        salaryPercent: Number(company.defaultSalaryPercent || 0),
        monthlyMultiple: Number(company.defaultMonthlyMultiple || 0),
        fixedAmount: Number(company.defaultFixedAmount || 0),
      };
    });
    update();
  }

  els.annualSalary?.addEventListener("input", (event) => {
    state.annualSalary = parseNumber(event.target.value);
    if (!state.monthlySalaryTouched) state.monthlySalary = Math.round(state.annualSalary / 12);
    update();
  });

  els.monthlySalary?.addEventListener("input", (event) => {
    state.monthlySalaryTouched = true;
    state.monthlySalary = parseNumber(event.target.value);
    update();
  });

  els.resetMonthly?.addEventListener("click", () => {
    state.monthlySalaryTouched = false;
    state.monthlySalary = Math.round(state.annualSalary / 12);
    update();
  });

  els.taxMode?.addEventListener("change", (event) => {
    state.taxMode = event.target.value === "manual" ? "manual" : "simple";
    update();
  });

  els.manualTaxRate?.addEventListener("input", (event) => {
    state.manualTaxRate = parseNumber(event.target.value) / 100;
    update();
  });

  companies.forEach((company) => {
    root.querySelector(`[data-sbc-company-toggle="${company.id}"]`)?.addEventListener("change", (event) => {
      state.companies[company.id].selected = event.target.checked;
      update();
    });
    root.querySelector(`[data-sbc-mode="${company.id}"]`)?.addEventListener("change", (event) => {
      state.companies[company.id].mode = event.target.value;
      update();
    });
    root.querySelector(`[data-sbc-salary-percent="${company.id}"]`)?.addEventListener("input", (event) => {
      state.companies[company.id].salaryPercent = parseNumber(event.target.value);
      update();
    });
    root.querySelector(`[data-sbc-monthly-multiple="${company.id}"]`)?.addEventListener("input", (event) => {
      state.companies[company.id].monthlyMultiple = parseNumber(event.target.value);
      update();
    });
    root.querySelector(`[data-sbc-fixed-amount="${company.id}"]`)?.addEventListener("input", (event) => {
      state.companies[company.id].fixedAmount = parseNumber(event.target.value);
      update();
    });
  });

  els.resetBtn?.addEventListener("click", resetAll);
  els.copyBtn?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      els.copyBtn.textContent = "링크 복사됨";
      window.setTimeout(() => { els.copyBtn.textContent = "링크 복사"; }, 1500);
    } catch {
      els.copyBtn.textContent = "복사 실패";
    }
  });

  update();
})();
