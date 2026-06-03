(() => {
  const configEl = document.getElementById("isacConfig");
  if (!configEl) return;
  const { types, products, limits } = JSON.parse(configEl.textContent || "{}");

  // ── 상태 ──────────────────────────────────────────────
  const state = {
    typeId: "general",
    annualAmount: 12_000_000,
    rate: 5,
    period: 5,
    productId: "etf",
  };

  // ── 헬퍼 ──────────────────────────────────────────────
  const fmt = (n) => {
    n = Math.round(n);
    if (Math.abs(n) >= 100_000_000) return `${(n / 100_000_000).toFixed(2)}억 원`;
    if (Math.abs(n) >= 10_000) return `${Math.round(n / 10_000).toLocaleString("ko-KR")}만 원`;
    return `${n.toLocaleString("ko-KR")}원`;
  };
  const fmtRate = (r) => `${(r * 100).toFixed(1)}%`;
  const parseAmt = (v) => Number(String(v).replace(/[^0-9]/g, "")) || 0;

  const getType = () => types.find((t) => t.id === state.typeId) || types[0];
  const getProduct = () => products.find((p) => p.id === state.productId) || products[0];

  // ── 핵심 계산 ──────────────────────────────────────────
  function calcYear(year) {
    const annual = state.annualAmount;
    const r = state.rate / 100;
    const type = getType();
    const product = getProduct();

    // 단리 근사: 매년 납입 → 복리 누적
    let principal = 0;
    let isaFund = 0;
    let normalFund = 0;

    for (let y = 1; y <= year; y++) {
      principal += annual;
      // ISA: 세전 복리
      isaFund = (isaFund + annual) * (1 + r);
      // 일반: 수익에 매년 세금
      const normalReturn = normalFund * r;
      const normalTax = normalReturn * product.normalTaxRate;
      normalFund = normalFund + annual + normalReturn - normalTax;
    }

    const isaProfit = isaFund - principal;

    // ISA 세금 계산
    const taxFreeLimit = type.taxFreeLimit;
    const taxableProfit = Math.max(0, isaProfit - taxFreeLimit);
    const taxFreeAmount = Math.min(isaProfit, taxFreeLimit);
    const isaTax = taxableProfit > 0 ? taxableProfit * type.excessRate : 0;
    const isaFinal = isaFund - isaTax;

    const normalProfit = normalFund - principal;
    const normalFinal = normalFund;

    return {
      principal,
      isaFund,
      isaProfit,
      isaFinal,
      isaTax,
      taxFreeAmount,
      taxableProfit,
      normalFund,
      normalProfit,
      normalFinal,
      normalTaxPaid: principal + normalProfit * (1 - product.normalTaxRate) + principal - normalFund + normalProfit,
    };
  }

  // 일반계좌 총 세금 별도 계산 (누적)
  function calcNormalTotalTax() {
    const annual = state.annualAmount;
    const r = state.rate / 100;
    const product = getProduct();
    let fund = 0;
    let totalTax = 0;
    for (let y = 1; y <= state.period; y++) {
      fund += annual;
      const ret = fund * r;
      const tax = ret * product.normalTaxRate;
      totalTax += tax;
      fund += ret - tax;
    }
    return totalTax;
  }

  // ── DOM 요소 ───────────────────────────────────────────
  const els = {
    typeLabels: document.querySelectorAll("[data-isac-type-label]"),
    typeRadios: document.querySelectorAll("[data-isac-type]"),
    annual: document.querySelector("[data-isac-annual]"),
    rate: document.querySelector("[data-isac-rate]"),
    period: document.querySelector("[data-isac-period]"),
    productLabels: document.querySelectorAll("[data-isac-product-label]"),
    productRadios: document.querySelectorAll("[data-isac-product]"),
    // 결과
    taxSave: document.querySelector("[data-isac-tax-save]"),
    taxSaveDesc: document.querySelector("[data-isac-tax-save-desc]"),
    isaFinal: document.querySelector("[data-isac-isa-final]"),
    normalFinal: document.querySelector("[data-isac-normal-final]"),
    periodLabel: document.querySelector("[data-isac-period-label]"),
    // 상세
    principalIsa: document.querySelector("[data-isac-principal-isa]"),
    principalNormal: document.querySelector("[data-isac-principal-normal]"),
    profitIsa: document.querySelector("[data-isac-profit-isa]"),
    profitNormal: document.querySelector("[data-isac-profit-normal]"),
    taxfree: document.querySelector("[data-isac-taxfree]"),
    taxableIsa: document.querySelector("[data-isac-taxable-isa]"),
    taxableNormal: document.querySelector("[data-isac-taxable-normal]"),
    rateIsa: document.querySelector("[data-isac-rate-isa]"),
    rateNormal: document.querySelector("[data-isac-rate-normal]"),
    taxIsa: document.querySelector("[data-isac-tax-isa]"),
    taxNormal: document.querySelector("[data-isac-tax-normal]"),
    finalIsa: document.querySelector("[data-isac-final-isa]"),
    finalNormal: document.querySelector("[data-isac-final-normal]"),
    yearlyBody: document.querySelector("[data-isac-yearly-body]"),
    resetBtn: document.getElementById("isacResetBtn"),
    copyBtn: document.getElementById("isacCopyBtn"),
  };

  // ── 렌더 ──────────────────────────────────────────────
  function render() {
    const c = calcYear(state.period);
    const normalTax = calcNormalTotalTax();
    const type = getType();
    const product = getProduct();
    const taxSaved = normalTax - c.isaTax;

    // 요약 카드
    if (els.taxSave) els.taxSave.textContent = fmt(taxSaved);
    if (els.taxSaveDesc) els.taxSaveDesc.textContent = `${state.period}년 후 일반 계좌 대비 절약`;
    if (els.isaFinal) els.isaFinal.textContent = fmt(c.isaFinal);
    if (els.normalFinal) els.normalFinal.textContent = fmt(c.normalFinal);
    if (els.periodLabel) els.periodLabel.textContent = `${state.period}년 만기 기준`;

    // 상세 테이블
    if (els.principalIsa) els.principalIsa.textContent = fmt(c.principal);
    if (els.principalNormal) els.principalNormal.textContent = fmt(c.principal);
    if (els.profitIsa) els.profitIsa.textContent = fmt(c.isaProfit);
    if (els.profitNormal) els.profitNormal.textContent = fmt(c.normalProfit + normalTax); // 세전 기준
    if (els.taxfree) {
      els.taxfree.textContent = c.isaProfit > 0
        ? `${fmt(c.taxFreeAmount)} (한도: ${fmt(type.taxFreeLimit)})`
        : fmt(0);
    }
    if (els.taxableIsa) els.taxableIsa.textContent = fmt(c.taxableProfit);
    if (els.taxableNormal) els.taxableNormal.textContent = fmt(c.normalProfit + normalTax);
    if (els.rateIsa) {
      els.rateIsa.textContent = c.taxableProfit > 0
        ? `${fmtRate(type.excessRate)} 분리과세`
        : "0% (전액 비과세)";
    }
    if (els.rateNormal) els.rateNormal.textContent = `${fmtRate(product.normalTaxRate)}`;
    if (els.taxIsa) els.taxIsa.textContent = fmt(c.isaTax);
    if (els.taxNormal) els.taxNormal.textContent = fmt(normalTax);
    if (els.finalIsa) els.finalIsa.textContent = fmt(c.isaFinal);
    if (els.finalNormal) els.finalNormal.textContent = fmt(c.normalFinal);

    // 연도별 테이블
    if (els.yearlyBody) {
      let rows = "";
      for (let y = 3; y <= state.period; y++) {
        const yc = calcYear(y);
        const yntax = (() => {
          const annual = state.annualAmount;
          const r = state.rate / 100;
          let fund = 0, tax = 0;
          for (let i = 1; i <= y; i++) {
            fund += annual;
            const ret = fund * r;
            tax += ret * product.normalTaxRate;
            fund += ret - tax;
          }
          return tax;
        })();
        const saved = yntax - yc.isaTax;
        const isCurrent = y === state.period;
        rows += `<tr class="${isCurrent ? "isac-yr--current" : ""}">
          <td>${y}년차${isCurrent ? " ★" : ""}</td>
          <td>${fmt(yc.principal)}</td>
          <td>${fmt(yc.isaProfit)}</td>
          <td class="isac-td-save">${fmt(saved)}</td>
        </tr>`;
      }
      els.yearlyBody.innerHTML = rows;
    }
  }

  // ── 이벤트 ────────────────────────────────────────────
  // ISA 유형
  els.typeRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      state.typeId = radio.value;
      els.typeLabels.forEach((l) => l.classList.toggle("active", l.dataset.isacTypeLabel === state.typeId));
      render(); saveUrl();
    });
  });

  // 연간 납입액
  if (els.annual) {
    els.annual.addEventListener("input", () => {
      const raw = parseAmt(els.annual.value);
      state.annualAmount = Math.min(raw, limits.annualMax);
      render(); saveUrl();
    });
    els.annual.addEventListener("focus", () => {
      els.annual.value = state.annualAmount.toLocaleString("ko-KR");
    });
    els.annual.addEventListener("blur", () => {
      els.annual.value = `${Math.round(state.annualAmount / 10000).toLocaleString("ko-KR")}만원`;
    });
  }

  // 수익률
  if (els.rate) {
    els.rate.addEventListener("input", () => {
      state.rate = Math.max(0.1, Math.min(30, parseFloat(els.rate.value) || 5));
      render(); saveUrl();
    });
  }

  // 투자 기간
  if (els.period) {
    els.period.addEventListener("input", () => {
      state.period = Math.max(3, Math.min(10, parseInt(els.period.value) || 5));
      render(); saveUrl();
    });
  }

  // 투자 상품
  els.productRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      state.productId = radio.value;
      els.productLabels.forEach((l) => l.classList.toggle("active", l.dataset.isacProductLabel === state.productId));
      render(); saveUrl();
    });
  });

  // URL 상태
  function saveUrl() {
    const p = new URLSearchParams();
    p.set("type", state.typeId);
    p.set("amount", state.annualAmount);
    p.set("rate", state.rate);
    p.set("period", state.period);
    p.set("product", state.productId);
    history.replaceState(null, "", `?${p}`);
  }

  function loadUrl() {
    const p = new URLSearchParams(location.search);
    if (p.has("type") && types.find((t) => t.id === p.get("type"))) {
      state.typeId = p.get("type");
      els.typeRadios.forEach((r) => { r.checked = r.value === state.typeId; });
      els.typeLabels.forEach((l) => l.classList.toggle("active", l.dataset.isacTypeLabel === state.typeId));
    }
    if (p.has("amount")) {
      state.annualAmount = Math.min(parseInt(p.get("amount")) || 12_000_000, limits.annualMax);
      if (els.annual) els.annual.value = `${Math.round(state.annualAmount / 10000).toLocaleString("ko-KR")}만원`;
    }
    if (p.has("rate")) {
      state.rate = Math.max(0.1, Math.min(30, parseFloat(p.get("rate")) || 5));
      if (els.rate) els.rate.value = state.rate;
    }
    if (p.has("period")) {
      state.period = Math.max(3, Math.min(10, parseInt(p.get("period")) || 5));
      if (els.period) els.period.value = state.period;
    }
    if (p.has("product") && products.find((pr) => pr.id === p.get("product"))) {
      state.productId = p.get("product");
      els.productRadios.forEach((r) => { r.checked = r.value === state.productId; });
      els.productLabels.forEach((l) => l.classList.toggle("active", l.dataset.isacProductLabel === state.productId));
    }
  }

  // 리셋
  if (els.resetBtn) {
    els.resetBtn.addEventListener("click", () => {
      state.typeId = "general"; state.annualAmount = 12_000_000;
      state.rate = 5; state.period = 5; state.productId = "etf";
      els.typeRadios.forEach((r) => { r.checked = r.value === "general"; });
      els.typeLabels.forEach((l) => l.classList.toggle("active", l.dataset.isacTypeLabel === "general"));
      els.productRadios.forEach((r) => { r.checked = r.value === "etf"; });
      els.productLabels.forEach((l) => l.classList.toggle("active", l.dataset.isacProductLabel === "etf"));
      if (els.annual) els.annual.value = "1,200만원";
      if (els.rate) els.rate.value = 5;
      if (els.period) els.period.value = 5;
      history.replaceState(null, "", location.pathname);
      render();
    });
  }

  // 링크 복사
  if (els.copyBtn) {
    els.copyBtn.addEventListener("click", () => {
      saveUrl();
      navigator.clipboard.writeText(location.href).catch(() => {});
    });
  }

  loadUrl();
  render();
})();
