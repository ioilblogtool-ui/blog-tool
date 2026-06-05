(() => {
  const cfg = document.getElementById("udtaConfig");
  if (!cfg) return;
  const { presets, brackets } = JSON.parse(cfg.textContent || "{}");

  const state = {
    dividendUsd: 1000,
    rate: 1380,
    annualIncome: 5_000_000,
    presetId: presets[0]?.id || "aapl",
  };

  const fmtKrw = n => {
    n = Math.round(n);
    if (Math.abs(n) >= 10_000) return `${Math.round(n / 10_000).toLocaleString("ko-KR")}만 원`;
    return `${n.toLocaleString("ko-KR")}원`;
  };
  const fmtUsd = n => `$${n.toFixed(2)}`;
  const parse = v => Number(String(v).replace(/[^\d.]/g, "")) || 0;

  const els = {
    dividend: document.querySelector("[data-udta-dividend]"),
    krwHint: document.querySelector("[data-udta-krw-hint]"),
    rate: document.querySelector("[data-udta-rate]"),
    annual: document.querySelector("[data-udta-annual]"),
    presetBtns: document.querySelectorAll("[data-udta-preset]"),
    presetLabels: document.querySelectorAll("[data-udta-preset-label]"),
    netKrw: document.querySelector("[data-udta-net-krw]"),
    netUsd: document.querySelector("[data-udta-net-usd]"),
    usTax: document.querySelector("[data-udta-us-tax]"),
    extraTax: document.querySelector("[data-udta-extra-tax]"),
    comprehensiveDesc: document.querySelector("[data-udta-comprehensive-desc]"),
    breakdown: document.querySelector("[data-udta-breakdown]"),
    resetBtn: document.getElementById("udtaResetBtn"),
    copyBtn: document.getElementById("udtaCopyBtn"),
  };

  const COMPREHENSIVE_THRESHOLD = 20_000_000;
  const US_WITHHOLD = 0.15;

  function render() {
    const grossUsd = state.dividendUsd;
    const grossKrw = grossUsd * state.rate;

    // 미국 원천징수
    const usTaxUsd = grossUsd * US_WITHHOLD;
    const usTaxKrw = usTaxUsd * state.rate;
    const afterUsTaxKrw = grossKrw - usTaxKrw;

    // 종합과세 판단
    const isComprehensive = state.annualIncome > COMPREHENSIVE_THRESHOLD;
    let extraTaxKrw = 0;
    let comprehensiveDesc = "연간 금융소득 2,000만원 이하 — 종합과세 해당 없음";

    if (isComprehensive) {
      const overAmount = state.annualIncome - COMPREHENSIVE_THRESHOLD;
      // 초과분에 대한 세율 찾기
      let taxableAmount = Math.min(grossKrw, overAmount);
      let marginalRate = 0.15; // 기본
      for (const b of brackets) {
        if (overAmount <= b.threshold) { marginalRate = b.rate; break; }
      }
      // 외국납부세액공제 적용 (15% 중 국내세율과의 차이만큼 추가)
      const domesticTaxBeforeCredit = taxableAmount * marginalRate;
      const foreignTaxCredit = Math.min(usTaxKrw, domesticTaxBeforeCredit);
      extraTaxKrw = Math.max(0, domesticTaxBeforeCredit - foreignTaxCredit);
      comprehensiveDesc = `연간 금융소득 ${fmtKrw(state.annualIncome)} — 종합과세 적용 (추정)`;
    }

    const netKrw = afterUsTaxKrw - extraTaxKrw;

    if (els.krwHint) els.krwHint.textContent = `${fmtKrw(grossKrw)} (환율 ${state.rate.toLocaleString()}원 기준)`;
    if (els.netKrw) els.netKrw.textContent = fmtKrw(netKrw);
    if (els.netUsd) els.netUsd.textContent = `${fmtUsd(grossUsd * (1 - US_WITHHOLD))} (세후)`;
    if (els.usTax) els.usTax.textContent = fmtKrw(usTaxKrw);
    if (els.extraTax) els.extraTax.textContent = isComprehensive ? fmtKrw(extraTaxKrw) : "해당 없음";
    if (els.comprehensiveDesc) els.comprehensiveDesc.textContent = comprehensiveDesc;

    if (els.breakdown) {
      els.breakdown.innerHTML = `
        <div class="udta-breakdown-row"><span>세전 배당금</span><span>${fmtUsd(grossUsd)} = ${fmtKrw(grossKrw)}</span></div>
        <div class="udta-breakdown-row udta-breakdown-row--deduct"><span>미국 원천징수 (15%)</span><span>- ${fmtKrw(usTaxKrw)}</span></div>
        <div class="udta-breakdown-row"><span>미국 세후 금액</span><span>${fmtKrw(afterUsTaxKrw)}</span></div>
        ${isComprehensive ? `<div class="udta-breakdown-row udta-breakdown-row--deduct"><span>종합과세 추가 (추정)</span><span>- ${fmtKrw(extraTaxKrw)}</span></div>` : ""}
        <div class="udta-breakdown-row udta-breakdown-row--total"><span>최종 실수령</span><span>${fmtKrw(netKrw)}</span></div>
      `;
    }
  }

  if (els.dividend) {
    els.dividend.addEventListener("input", () => {
      state.dividendUsd = parse(els.dividend.value);
      els.dividend.value = state.dividendUsd.toLocaleString("ko-KR");
      render();
    });
    els.dividend.addEventListener("focus", () => { els.dividend.value = String(state.dividendUsd); });
    els.dividend.addEventListener("blur", () => { els.dividend.value = state.dividendUsd.toLocaleString("ko-KR"); });
  }

  if (els.rate) els.rate.addEventListener("input", () => { state.rate = parse(els.rate.value) || 1380; render(); });

  if (els.annual) {
    els.annual.addEventListener("input", () => {
      state.annualIncome = parse(els.annual.value);
      els.annual.value = state.annualIncome.toLocaleString("ko-KR");
      render();
    });
    els.annual.addEventListener("focus", () => { els.annual.value = String(state.annualIncome); });
    els.annual.addEventListener("blur", () => { els.annual.value = state.annualIncome.toLocaleString("ko-KR"); });
  }

  els.presetBtns.forEach(btn => {
    btn.addEventListener("change", () => {
      state.presetId = btn.value;
      els.presetLabels.forEach(l => l.classList.toggle("active", l.dataset.udtaPresetLabel === state.presetId));
      render();
    });
  });

  if (els.resetBtn) els.resetBtn.addEventListener("click", () => {
    state.dividendUsd = 1000; state.rate = 1380; state.annualIncome = 5_000_000; state.presetId = presets[0]?.id;
    if (els.dividend) els.dividend.value = "1,000";
    if (els.rate) els.rate.value = "1380";
    if (els.annual) els.annual.value = "5,000,000";
    els.presetBtns.forEach(b => { b.checked = b.value === state.presetId; });
    els.presetLabels.forEach(l => l.classList.toggle("active", l.dataset.udtaPresetLabel === state.presetId));
    render();
  });

  if (els.copyBtn) els.copyBtn.addEventListener("click", () => navigator.clipboard.writeText(location.href).catch(() => {}));

  render();
})();
