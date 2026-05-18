(() => {
  const cfg = JSON.parse(document.getElementById("yetcConfig").textContent);
  const { presets } = cfg;

  let chart = null;

  const state = {
    grossSalary: 50000000, withheldTax: 0,
    dependents: 1, elderlyDependents: 0, disabledDependents: 0, children: 0,
    creditCardAmount: 0, debitCashAmount: 0,
    housingSubscription: 0, mortgageRepayment: 0,
    medicalExpense: 0, educationExpense: 0,
    pensionSaving: 0, irpAmount: 0,
    insurance: 0, donation: 0,
    monthlyRent: 0, isRenter: true,
  };

  // ── 유틸 ────────────────────────────────────────────────
  const q  = (sel) => document.querySelector(sel);
  const qq = (sel) => Array.from(document.querySelectorAll(sel));
  const fmt  = (n) => Math.round(n).toLocaleString("ko-KR");
  const fmtW = (n) => fmt(n) + "원";
  const manWon = (n) => {
    const abs = Math.abs(n);
    const m   = Math.floor(abs / 10000);
    const r   = abs % 10000;
    const sign = n < 0 ? "-" : "";
    if (m > 0 && r > 0) return sign + m + "만 " + r.toLocaleString() + "원";
    if (m > 0) return sign + m + "만 원";
    return sign + r.toLocaleString() + "원";
  };

  // ── 입력 읽기 ────────────────────────────────────────────
  function num(attr, fallback = 0) {
    const el = q(`[data-yetc="${attr}"]`);
    if (!el) return fallback;
    const v = parseFloat(String(el.value).replace(/,/g, ""));
    return isNaN(v) ? fallback : v;
  }

  function readInputs() {
    state.grossSalary        = num("grossSalary",  50000000);
    state.withheldTax        = num("withheldTax",  0);
    state.dependents         = num("dependents",   1);
    state.elderlyDependents  = num("elderlyDependents",  0);
    state.disabledDependents = num("disabledDependents", 0);
    state.children           = num("children", 0);
    state.creditCardAmount   = num("creditCardAmount", 0);
    state.debitCashAmount    = num("debitCashAmount",  0);
    state.housingSubscription= num("housingSubscription", 0);
    state.mortgageRepayment  = num("mortgageRepayment",  0);
    state.medicalExpense     = num("medicalExpense",   0);
    state.educationExpense   = num("educationExpense", 0);
    state.pensionSaving      = Math.min(num("pensionSaving", 0), 6000000);
    state.irpAmount          = Math.min(num("irpAmount", 0), Math.max(0, 9000000 - state.pensionSaving));
    state.insurance          = num("insurance", 0);
    state.donation           = num("donation",  0);
    state.monthlyRent        = num("monthlyRent", 0);
    state.isRenter           = q('[data-yetc="isRenter"]')?.checked ?? true;
  }

  // ── 계산 ────────────────────────────────────────────────
  function calcLaborDeduction(sal) {
    if (sal <= 5000000)    return sal * 0.70;
    if (sal <= 15000000)   return 3500000  + (sal - 5000000)  * 0.40;
    if (sal <= 45000000)   return 7500000  + (sal - 15000000) * 0.15;
    if (sal <= 100000000)  return 12000000 + (sal - 45000000) * 0.05;
    return Math.min(14750000 + (sal - 100000000) * 0.02, 20000000);
  }

  function calcTax(base) {
    if (base <= 0)           return 0;
    if (base <= 14000000)    return base * 0.06;
    if (base <= 50000000)    return base * 0.15 - 1260000;
    if (base <= 88000000)    return base * 0.24 - 5760000;
    if (base <= 150000000)   return base * 0.35 - 15440000;
    if (base <= 300000000)   return base * 0.38 - 19940000;
    if (base <= 500000000)   return base * 0.40 - 25940000;
    if (base <= 1000000000)  return base * 0.42 - 35940000;
    return base * 0.45 - 65940000;
  }

  function calcCreditCard(s) {
    const minUse   = s.grossSalary * 0.25;
    const totalUse = s.creditCardAmount + s.debitCashAmount;
    if (totalUse <= minUse) return 0;

    const excess       = totalUse - minUse;
    const creditExcess = Math.max(0, s.creditCardAmount - minUse);
    const debitExcess  = Math.min(s.debitCashAmount, Math.max(0, excess - creditExcess));
    const raw = creditExcess * 0.15 + debitExcess * 0.30;

    let limit = 3000000;
    if (s.grossSalary > 120000000)     limit = 2000000;
    else if (s.grossSalary > 70000000) limit = 2500000;
    return Math.min(raw, limit);
  }

  function calcHousing(s) {
    const sub  = Math.min(s.housingSubscription * 0.40, 3000000);
    const mort = Math.min(s.mortgageRepayment   * 0.40, 4000000);
    return Math.min(sub + mort, 4000000);
  }

  function calcPensionCredit(s) {
    const rate = s.grossSalary <= 55000000 ? 0.165 : 0.132;
    const base = Math.min(s.pensionSaving + s.irpAmount, 9000000);
    return base * rate;
  }

  function calcMedicalCredit(s) {
    const threshold = s.grossSalary * 0.03;
    return Math.max(0, s.medicalExpense - threshold) * 0.15;
  }

  function calcRentCredit(s) {
    if (!s.isRenter || s.grossSalary > 70000000 || !s.monthlyRent) return 0;
    const rate = s.grossSalary <= 55000000 ? 0.17 : 0.15;
    return Math.min(s.monthlyRent, 7500000) * rate;
  }

  function calculate(s) {
    const laborDeduction   = calcLaborDeduction(s.grossSalary);
    const laborIncome      = s.grossSalary - laborDeduction;
    const personalDeduction = s.dependents * 1500000
                            + s.elderlyDependents  * 1000000
                            + s.disabledDependents * 2000000;
    const creditCardDeduction = calcCreditCard(s);
    const housingDeduction    = calcHousing(s);
    const totalDeduction = personalDeduction + creditCardDeduction + housingDeduction;
    const taxBase    = Math.max(0, laborIncome - totalDeduction);
    const taxAmount  = calcTax(taxBase);

    // 자녀세액공제
    let childCredit = 0;
    if (s.children === 1)      childCredit = 150000;
    else if (s.children === 2) childCredit = 350000;
    else if (s.children >= 3)  childCredit = 350000 + (s.children - 2) * 300000;

    const pensionCredit   = calcPensionCredit(s);
    const medicalCredit   = calcMedicalCredit(s);
    const educationCredit = Math.min(s.educationExpense, 9000000) * 0.15;
    const insuranceCredit = Math.min(s.insurance, 1000000) * 0.12;
    const donationCredit  = Math.min(s.donation,  20000000) * 0.15;
    const rentCredit      = calcRentCredit(s);
    const totalTaxCredit  = childCredit + pensionCredit + medicalCredit
                          + educationCredit + insuranceCredit + donationCredit + rentCredit;

    const finalTax   = Math.max(0, taxAmount - totalTaxCredit);
    const withheld   = s.withheldTax > 0
      ? s.withheldTax
      : Math.round(taxAmount * 0.92);   // 근로소득세액공제 간이 추정
    const refund     = withheld - finalTax;
    const isAutoWithheld = s.withheldTax === 0;

    const pensionRemaining = Math.max(0, 6000000 - s.pensionSaving);
    const irpRemaining     = Math.max(0, 9000000 - (s.pensionSaving + s.irpAmount));
    const pensionRate      = s.grossSalary <= 55000000 ? 0.165 : 0.132;

    return {
      laborDeduction, laborIncome, personalDeduction,
      creditCardDeduction, housingDeduction, totalDeduction,
      taxBase, taxAmount,
      childCredit, pensionCredit, medicalCredit,
      educationCredit, insuranceCredit, donationCredit, rentCredit,
      totalTaxCredit, finalTax, withheld, refund,
      isAutoWithheld,
      pensionRemaining, irpRemaining, pensionRate,
    };
  }

  // ── KPI 렌더 ────────────────────────────────────────────
  function renderKpi(r, s) {
    const refundEl = q("#yetcRefund");
    const kpiMain  = q("#yetcKpiMain");
    if (r.refund >= 0) {
      refundEl.textContent = "+" + manWon(r.refund);
      kpiMain?.classList.remove("yetc-kpi-card--pay");
      kpiMain?.classList.add("yetc-kpi-card--refund");
      q("#yetcRefundLabel").textContent = "예상 환급액";
    } else {
      refundEl.textContent = manWon(r.refund) + " 추납";
      kpiMain?.classList.remove("yetc-kpi-card--refund");
      kpiMain?.classList.add("yetc-kpi-card--pay");
      q("#yetcRefundLabel").textContent = "추가 납부 예상";
    }
    if (q("#yetcFinalTax"))     q("#yetcFinalTax").textContent     = manWon(r.finalTax);
    if (q("#yetcTotalCredit"))  q("#yetcTotalCredit").textContent  = manWon(r.totalTaxCredit);

    const remEl = q("#yetcPensionRemaining");
    if (remEl) {
      if (r.pensionRemaining > 0 || r.irpRemaining > 0) {
        remEl.textContent = "+" + manWon((r.pensionRemaining + r.irpRemaining) * r.pensionRate);
      } else {
        remEl.textContent = "한도 충족";
      }
    }

    // 기납부세액 자동추정 배지
    const badge = q("#yetcAutoBadge");
    if (badge) badge.hidden = !r.isAutoWithheld;
  }

  // ── 공제 기여도 테이블 ────────────────────────────────────
  function renderTable(r, s) {
    const tbody = q("#yetcTableBody");
    if (!tbody) return;

    const marginalRate = (() => {
      const base = r.taxBase;
      if (base <= 14000000)   return 0.06;
      if (base <= 50000000)   return 0.15;
      if (base <= 88000000)   return 0.24;
      if (base <= 150000000)  return 0.35;
      return 0.38;
    })();

    const rows = [
      { label: "인적공제",       deduction: r.personalDeduction,    type: "income",  credit: 0 },
      { label: "신용카드 공제",  deduction: r.creditCardDeduction,   type: "income",  credit: 0 },
      { label: "주택자금 공제",  deduction: r.housingDeduction,      type: "income",  credit: 0 },
      { label: "자녀세액공제",   deduction: 0, type: "tax", credit: r.childCredit },
      { label: "연금저축·IRP",  deduction: 0, type: "tax", credit: r.pensionCredit },
      { label: "의료비",         deduction: 0, type: "tax", credit: r.medicalCredit },
      { label: "교육비",         deduction: 0, type: "tax", credit: r.educationCredit },
      { label: "보험료",         deduction: 0, type: "tax", credit: r.insuranceCredit },
      { label: "기부금",         deduction: 0, type: "tax", credit: r.donationCredit },
      { label: "월세",           deduction: 0, type: "tax", credit: r.rentCredit },
    ];

    let html = "";
    let totalContrib = 0;
    rows.forEach((row) => {
      const contrib = row.type === "income"
        ? Math.round(row.deduction * marginalRate)
        : row.credit;
      if (contrib === 0 && row.deduction === 0) return;
      totalContrib += contrib;
      const deductDisplay = row.deduction > 0 ? fmtW(row.deduction) : "-";
      html += `<tr${contrib === 0 ? ' class="is-zero"' : ""}>
        <td>${row.label}</td>
        <td>${deductDisplay}</td>
        <td class="yetc-contribution">${contrib > 0 ? fmtW(contrib) : "-"}</td>
      </tr>`;
    });
    html += `<tr class="is-total">
      <td>합계</td>
      <td>${fmtW(r.totalDeduction)}</td>
      <td class="yetc-contribution">${fmtW(totalContrib)}</td>
    </tr>`;
    tbody.innerHTML = html;
  }

  // ── 시나리오 카드 ────────────────────────────────────────
  function renderScenario(r, s) {
    const card = q("#yetcScenarioCard");
    if (!card) return;

    const hasPensionRoom = r.pensionRemaining > 0 || r.irpRemaining > 0;
    card.classList.toggle("is-visible", hasPensionRoom);

    if (!hasPensionRoom) return;

    const pensionGain = Math.round(r.pensionRemaining * r.pensionRate);
    const irpGain     = Math.round(r.irpRemaining     * r.pensionRate);

    let rowsHtml = "";
    if (r.pensionRemaining > 0) {
      rowsHtml += `<div class="yetc-scenario-row">
        <div class="yetc-scenario-item">연금저축 ${manWon(r.pensionRemaining)} 추가 납입</div>
        <div class="yetc-scenario-gain">+${manWon(pensionGain)} 추가 환급</div>
        <div class="yetc-scenario-note">12월 31일까지 납입 필요</div>
      </div>`;
    }
    if (r.irpRemaining > 0 && r.irpRemaining < 9000000) {
      rowsHtml += `<div class="yetc-scenario-row">
        <div class="yetc-scenario-item">IRP ${manWon(r.irpRemaining)} 추가 납입</div>
        <div class="yetc-scenario-gain">+${manWon(irpGain)} 추가 환급</div>
        <div class="yetc-scenario-note">연금저축+IRP 합산 900만 원 한도</div>
      </div>`;
    }

    const rowsEl = q("#yetcScenarioRows");
    if (rowsEl) rowsEl.innerHTML = rowsHtml;
  }

  // ── 제휴 배너 ────────────────────────────────────────────
  function renderBanner(r) {
    const banner = q("#yetcAffiliateBanner");
    if (banner) {
      banner.classList.toggle("is-visible", r.pensionRemaining > 0 || r.irpRemaining > 0);
    }
  }

  // ── 도넛 차트 ────────────────────────────────────────────
  function renderChart(r) {
    const canvas = q("#yetcChart");
    if (!canvas || typeof Chart === "undefined") return;

    const items = [
      { label: "자녀세액공제",  val: r.childCredit    },
      { label: "연금저축·IRP", val: r.pensionCredit  },
      { label: "의료비",        val: r.medicalCredit  },
      { label: "교육비",        val: r.educationCredit },
      { label: "보험료",        val: r.insuranceCredit },
      { label: "기부금",        val: r.donationCredit  },
      { label: "월세",          val: r.rentCredit      },
    ].filter((i) => i.val > 0);

    if (chart) { chart.destroy(); chart = null; }
    if (!items.length) return;

    chart = new Chart(canvas, {
      type: "doughnut",
      data: {
        labels: items.map((i) => i.label),
        datasets: [{
          data: items.map((i) => i.val),
          backgroundColor: ["#0F6E56","#1D9E75","#4DC4A0","#7DD8BC","#B0EAD8","#1a56db","#534AB7"],
          borderWidth: 2,
          borderColor: "#fff",
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { position: "bottom", labels: { font: { size: 11 }, padding: 10 } },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${manWon(ctx.parsed)}`,
            },
          },
        },
      },
    });
  }

  // ── 자연어 메시지 ────────────────────────────────────────
  function renderMessage(r, s) {
    const el = q("#yetcMessage");
    if (!el) return;
    const salStr = manWon(s.grossSalary);
    let msg = `총급여 ${salStr} 기준, 입력하신 공제 항목 적용 시 결정세액은 약 ${manWon(r.finalTax)}입니다.\n`;
    if (r.refund >= 0) {
      msg += `기납부세액 대비 약 ${manWon(r.refund)}을 환급받을 것으로 예상됩니다.`;
    } else {
      msg += `기납부세액이 결정세액보다 적어 약 ${manWon(Math.abs(r.refund))}을 추가 납부해야 합니다.`;
    }
    if (r.pensionRemaining > 0) {
      msg += `\n\n연금저축 한도 중 ${manWon(r.pensionRemaining)}이 남아있습니다. `
           + `12월 31일까지 추가 납입하면 약 ${manWon(Math.round(r.pensionRemaining * r.pensionRate))}을 더 환급받을 수 있습니다.`;
    }
    if (r.isAutoWithheld) {
      msg += `\n\n※ 기납부세액은 자동 추정값입니다. 정확한 값은 원천징수영수증에서 확인하세요.`;
    }
    el.textContent = msg;
  }

  // ── 탭 전환 ──────────────────────────────────────────────
  function switchTab(tabId) {
    qq(".yetc-tab-btn").forEach((btn) =>
      btn.classList.toggle("is-active", btn.dataset.tab === tabId)
    );
    qq(".yetc-tab-panel").forEach((panel) => {
      panel.hidden = panel.dataset.panel !== tabId;
    });
  }

  // ── 프리셋 ───────────────────────────────────────────────
  function applyPreset(id) {
    const p = presets.find((pr) => pr.id === id);
    if (!p) return;
    const set = (attr, val) => {
      const el = q(`[data-yetc="${attr}"]`);
      if (!el) return;
      if (el.type === "checkbox") { el.checked = !!val; }
      else { el.value = typeof val === "number" ? val.toLocaleString("ko-KR") : val; }
    };
    Object.entries(p).forEach(([k, v]) => {
      if (k === "id" || k === "label" || k === "summary") return;
      set(k, v);
    });
    qq(".yetc-preset-btn").forEach((btn) =>
      btn.classList.toggle("is-active", btn.dataset.preset === id)
    );
    update();
  }

  // ── URL 상태 ────────────────────────────────────────────
  function syncUrl(s) {
    const url = new URL(location.href);
    const short = {
      sal: s.grossSalary, wt: s.withheldTax,
      dep: s.dependents, eld: s.elderlyDependents, dis: s.disabledDependents, chd: s.children,
      cc: s.creditCardAmount, dc: s.debitCashAmount,
      hs: s.housingSubscription, mr: s.mortgageRepayment,
      med: s.medicalExpense, edu: s.educationExpense,
      pen: s.pensionSaving, irp: s.irpAmount,
      ins: s.insurance, don: s.donation,
      rent: s.monthlyRent, renter: s.isRenter ? 1 : 0,
    };
    Object.entries(short).forEach(([k, v]) => url.searchParams.set(k, String(v)));
    history.replaceState(null, "", url);
  }

  function restoreFromUrl() {
    const p = new URLSearchParams(location.search);
    if (!p.has("sal")) return;
    const map = {
      sal: "grossSalary", wt: "withheldTax",
      dep: "dependents", eld: "elderlyDependents", dis: "disabledDependents", chd: "children",
      cc: "creditCardAmount", dc: "debitCashAmount",
      hs: "housingSubscription", mr: "mortgageRepayment",
      med: "medicalExpense", edu: "educationExpense",
      pen: "pensionSaving", irp: "irpAmount",
      ins: "insurance", don: "donation",
      rent: "monthlyRent",
    };
    Object.entries(map).forEach(([short, attr]) => {
      if (!p.has(short)) return;
      const el = q(`[data-yetc="${attr}"]`);
      if (el) el.value = Number(p.get(short)).toLocaleString("ko-KR");
    });
    const renterEl = q('[data-yetc="isRenter"]');
    if (renterEl && p.has("renter")) renterEl.checked = p.get("renter") === "1";
  }

  // ── 메인 업데이트 ────────────────────────────────────────
  function update() {
    readInputs();
    const r = calculate(state);
    renderKpi(r, state);
    renderTable(r, state);
    renderScenario(r, state);
    renderBanner(r);
    renderChart(r);
    renderMessage(r, state);
    syncUrl(state);
  }

  // ── 이벤트 바인딩 ────────────────────────────────────────
  function bindEvents() {
    qq(".yetc-tab-btn").forEach((btn) =>
      btn.addEventListener("click", () => switchTab(btn.dataset.tab))
    );
    qq("[data-yetc]").forEach((el) =>
      el.addEventListener("change", () => {
        qq(".yetc-preset-btn").forEach((b) => b.classList.remove("is-active"));
        update();
      })
    );
    qq(".yetc-preset-btn").forEach((btn) =>
      btn.addEventListener("click", () => applyPreset(btn.dataset.preset))
    );
    q("#yetcResetBtn")?.addEventListener("click",  () => applyPreset("single-basic"));
    q("#yetcCopyBtn")?.addEventListener("click",   () => navigator.clipboard?.writeText(location.href));
  }

  restoreFromUrl();
  bindEvents();
  switchTab("basic");
  applyPreset("single-basic");
})();
