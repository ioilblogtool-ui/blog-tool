(() => {
  const root = document.querySelector("[data-ssg-root]");
  if (!root) return;

  const config = JSON.parse(document.getElementById("ssgConfig")?.textContent || "{}");
  const defaults = config.defaults || {};
  const scenarios = config.scenarios || [];
  const stockKinds = config.stockKinds || [];
  const brackets = (config.brackets || []).map((item) => ({
    ...item,
    limit: item.limit === null ? Infinity : item.limit,
  }));
  const won = new Intl.NumberFormat("ko-KR");
  const spouseDeductionLimit = 600_000_000;
  const selfReportCreditRate = 0.03;

  const out = (key) => document.querySelector(`[data-ssg-output="${key}"]`);
  const input = (key) => root.querySelector(`[data-ssg-input="${key}"]`);

  function numeric(value, fallback = 0) {
    const n = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(n) && n >= 0 ? n : fallback;
  }

  function fmtWon(value) {
    const v = Math.round(Number.isFinite(value) ? value : 0);
    return `${won.format(v)}원`;
  }

  function fmtShort(value) {
    const v = Math.round(Number.isFinite(value) ? value : 0);
    if (v === 0) return "0원";
    if (Math.abs(v) >= 100_000_000) {
      const eok = v / 100_000_000;
      return `${eok.toFixed(Math.abs(eok) % 1 === 0 ? 0 : 1)}억원`;
    }
    if (Math.abs(v) >= 10_000) return `${won.format(Math.round(v / 10_000))}만원`;
    return `${won.format(v)}원`;
  }

  function fmtSigned(value) {
    const sign = value > 0 ? "+" : "";
    return `${sign}${fmtWon(value)}`;
  }

  function read() {
    return {
      stockKind: input("stockKind")?.value || "foreign_stock",
      donor: input("donor")?.value || "husband",
      giftValue: numeric(input("giftValue")?.value, defaults.giftValue || 0),
      priorSpouseGiftAmount: numeric(input("priorSpouseGiftAmount")?.value, 0),
      donorOriginalCost: numeric(input("donorOriginalCost")?.value, defaults.donorOriginalCost || 0),
      expectedSalePrice: numeric(input("expectedSalePrice")?.value, defaults.expectedSalePrice || 0),
      holdingPeriod: input("holdingPeriod")?.value || "over_1y",
      foreignStockBasicDeduction: numeric(input("foreignStockBasicDeduction")?.value, defaults.foreignStockBasicDeduction || 2_500_000),
      capitalGainTaxRate: numeric(input("capitalGainTaxRate")?.value, 22) / 100,
      applySelfReportCredit: Boolean(input("applySelfReportCredit")?.checked),
    };
  }

  function calcGiftTax(taxBase, applySelfReportCredit) {
    if (taxBase <= 0) {
      return { calculatedTax: 0, credit: 0, finalTax: 0, rate: 0, label: "비과세" };
    }
    const bracket = brackets.find((item) => taxBase <= item.limit) || brackets[brackets.length - 1];
    const calculatedTax = Math.max(0, taxBase * bracket.rate - bracket.deduction);
    const credit = applySelfReportCredit ? Math.floor(calculatedTax * selfReportCreditRate) : 0;
    return {
      calculatedTax,
      credit,
      finalTax: Math.max(0, calculatedTax - credit),
      rate: bracket.rate,
      label: bracket.label,
    };
  }

  function calcCapitalGainTax(salePrice, costBasis, basicDeduction, taxRate) {
    const gain = Math.max(0, salePrice - costBasis);
    const taxableGain = Math.max(0, gain - basicDeduction);
    const tax = taxableGain * taxRate;
    return { gain, taxableGain, tax };
  }

  function calculate(data) {
    const priorDeductionUsed = Math.min(data.priorSpouseGiftAmount, spouseDeductionLimit);
    const remainingBeforeGift = Math.max(0, spouseDeductionLimit - priorDeductionUsed);
    const currentDeduction = Math.min(data.giftValue, remainingBeforeGift);
    const giftTaxBase = Math.max(0, data.giftValue - currentDeduction);
    const giftTax = calcGiftTax(giftTaxBase, data.applySelfReportCredit);
    const totalDeductionUsed = Math.min(spouseDeductionLimit, data.priorSpouseGiftAmount + data.giftValue);
    const remainingDeduction = Math.max(0, spouseDeductionLimit - data.priorSpouseGiftAmount - data.giftValue);

    const directSale = calcCapitalGainTax(
      data.expectedSalePrice,
      data.donorOriginalCost,
      data.foreignStockBasicDeduction,
      data.capitalGainTaxRate
    );
    const giftedCostBasis = data.holdingPeriod === "under_1y" ? data.donorOriginalCost : data.giftValue;
    const giftedSale = calcCapitalGainTax(
      data.expectedSalePrice,
      giftedCostBasis,
      data.foreignStockBasicDeduction,
      data.capitalGainTaxRate
    );
    const totalGiftedTax = giftTax.finalTax + giftedSale.tax;
    const estimatedSaving = directSale.tax - totalGiftedTax;

    return {
      priorDeductionUsed,
      remainingBeforeGift,
      currentDeduction,
      giftTaxBase,
      giftTax,
      totalDeductionUsed,
      remainingDeduction,
      directSale,
      giftedCostBasis,
      giftedSale,
      totalGiftedTax,
      estimatedSaving,
    };
  }

  function set(key, value) {
    const el = out(key);
    if (el) el.textContent = value;
  }

  function renderWarning(data) {
    const el = out("holdingWarning");
    if (!el) return;
    const title = el.querySelector("strong");
    const text = el.querySelector("span");
    el.className = "ssg-warning";
    if (data.holdingPeriod === "under_1y") {
      el.classList.add("ssg-warning--danger");
      title.textContent = "1년 이내 매도 주의";
      text.textContent = "증여 당시 평가액이 아니라 증여자의 원래 취득가액으로 양도차익이 계산될 수 있습니다.";
      return;
    }
    el.classList.add("ssg-warning--safe");
    title.textContent = "1년 이후 매도 기준";
    text.textContent = "증여 당시 평가액을 취득가액으로 활용하는 절세 효과를 기대할 수 있으나 실제 신고 전 증빙을 확인하세요.";
  }

  function render() {
    const data = read();
    const result = calculate(data);
    const stockKind = stockKinds.find((item) => item.value === data.stockKind);

    set("stockKindNote", stockKind?.note || "과세 구조를 확인하세요.");
    set("estimatedSaving", fmtSigned(result.estimatedSaving));
    set("savingNote", result.estimatedSaving > 0 ? "증여 후 매도 세금이 더 낮은 추정" : "증여 효과가 제한적이거나 추가 부담 가능");
    set("giftTax", fmtWon(result.giftTax.finalTax));
    set("giftTaxNote", result.giftTaxBase === 0 ? "6억 공제 한도 이내" : `${result.giftTax.label}, 신고공제 반영`);
    set("remainingDeduction", fmtWon(result.remainingDeduction));
    set("directSaleTax", data.stockKind === "foreign_stock" ? fmtWon(result.directSale.tax) : "별도 확인");
    set("directSaleTaxNote", data.stockKind === "foreign_stock" ? "해외주식 22% 가정" : "국내주식·ETF 과세 유형 확인");
    set("giftedSaleTax", data.stockKind === "foreign_stock" ? fmtWon(result.giftedSale.tax) : "별도 확인");
    set("giftedSaleTaxNote", data.holdingPeriod === "under_1y" ? "1년 이내 취득가액 경고" : "증여 평가액 기준 가정");
    set("giftTaxBase", fmtWon(result.giftTaxBase));
    set("giftTaxBaseNote", result.giftTaxBase === 0 ? "과세표준 없음" : `${Math.round(result.giftTax.rate * 100)}% 구간`);

    renderWarning(data);

    const resultComment = out("resultComment");
    if (resultComment) {
      if (data.stockKind !== "foreign_stock") {
        resultComment.textContent = "국내주식·ETF는 대주주 여부, 상장 지역, 배당소득·매매차익 과세 방식에 따라 달라질 수 있어 양도세 비교는 참고 안내로만 봐야 합니다.";
      } else if (data.holdingPeriod === "under_1y") {
        resultComment.textContent = "1년 이내 매도 조건에서는 배우자의 증여 당시 평가액을 취득가액으로 인정받지 못할 수 있어 절세액이 거의 사라질 수 있습니다.";
      } else {
        resultComment.textContent = "증여 후 1년이 지난 뒤 매도하는 조건에서는 직접 매도와 증여 후 매도의 예상 세금 차이를 비교할 수 있습니다.";
      }
    }

    const comparisonRows = out("comparisonRows");
    if (comparisonRows) {
      comparisonRows.innerHTML = [
        ["증여 없이 직접 매도", fmtWon(data.donorOriginalCost), fmtWon(result.directSale.gain), data.stockKind === "foreign_stock" ? fmtWon(result.directSale.tax) : "별도 확인"],
        [
          "배우자 증여 후 매도",
          data.holdingPeriod === "under_1y" ? `${fmtWon(result.giftedCostBasis)} (이월 가능)` : fmtWon(result.giftedCostBasis),
          fmtWon(result.giftedSale.gain),
          data.stockKind === "foreign_stock" ? `${fmtWon(result.giftedSale.tax)} + 증여세 ${fmtWon(result.giftTax.finalTax)}` : `증여세 ${fmtWon(result.giftTax.finalTax)}`,
        ],
      ]
        .map(([label, basis, gain, tax]) => `<tr><td>${label}</td><td>${basis}</td><td>${gain}</td><td>${tax}</td></tr>`)
        .join("");
    }

    const usedRatio = Math.min(1, result.totalDeductionUsed / spouseDeductionLimit);
    const bar = out("deductionBarUsed");
    if (bar) bar.style.width = `${(usedRatio * 100).toFixed(1)}%`;
    set("deductionUsedLabel", `사용 ${fmtShort(result.totalDeductionUsed)}`);
    set("deductionRemainLabel", `잔액 ${fmtShort(result.remainingDeduction)}`);
    set("deductionDesc", `이번 증여에는 ${fmtWon(result.currentDeduction)} 공제가 적용되고, 공제 초과분 ${fmtWon(result.giftTaxBase)}에 대해 증여세를 계산합니다.`);

    const breakdownRows = out("breakdownRows");
    if (breakdownRows) {
      const rows = [
        ["① 이번 증여 평가액", fmtWon(data.giftValue)],
        ["② 최근 10년 배우자 증여액", fmtWon(data.priorSpouseGiftAmount)],
        ["③ 배우자 공제 한도", fmtWon(spouseDeductionLimit)],
        ["④ 이번 증여 적용 공제", fmtWon(result.currentDeduction)],
        ["⑤ 증여세 과세표준", fmtWon(result.giftTaxBase)],
        ["⑥ 산출세액", fmtWon(result.giftTax.calculatedTax)],
        ["⑦ 신고세액공제", data.applySelfReportCredit ? `▼ ${fmtWon(result.giftTax.credit)}` : "미적용"],
        ["⑧ 예상 증여세", fmtWon(result.giftTax.finalTax)],
      ];
      breakdownRows.innerHTML = rows.map(([label, value]) => `<tr><td>${label}</td><td>${value}</td></tr>`).join("");
    }
  }

  function formatMoneyInputs() {
    [
      "giftValue",
      "priorSpouseGiftAmount",
      "donorOriginalCost",
      "expectedSalePrice",
      "foreignStockBasicDeduction",
    ].forEach((key) => {
      const el = input(key);
      if (!el) return;
      el.addEventListener("focus", () => {
        el.value = String(numeric(el.value, 0));
      });
      el.addEventListener("blur", () => {
        el.value = numeric(el.value, 0).toLocaleString("ko-KR");
      });
    });
  }

  function applyValues(values) {
    Object.entries(values).forEach(([key, value]) => {
      const el = input(key);
      if (!el) return;
      if (el.type === "checkbox") {
        el.checked = Boolean(value);
      } else if (["giftValue", "priorSpouseGiftAmount", "donorOriginalCost", "expectedSalePrice", "foreignStockBasicDeduction"].includes(key)) {
        el.value = Number(value || 0).toLocaleString("ko-KR");
      } else if (key === "capitalGainTaxRate") {
        el.value = String(Number(value || 0) * 100);
      } else {
        el.value = String(value);
      }
    });
  }

  function restoreFromUrl() {
    const params = new URLSearchParams(location.search);
    const values = {};
    [
      ["kind", "stockKind"],
      ["donor", "donor"],
      ["gift", "giftValue"],
      ["prior", "priorSpouseGiftAmount"],
      ["cost", "donorOriginalCost"],
      ["sale", "expectedSalePrice"],
      ["hold", "holdingPeriod"],
    ].forEach(([param, key]) => {
      if (params.has(param)) values[key] = params.get(param);
    });
    if (Object.keys(values).length) applyValues(values);
  }

  root.querySelectorAll("[data-ssg-input]").forEach((el) => {
    el.addEventListener("input", render);
    el.addEventListener("change", render);
  });

  root.querySelectorAll("[data-ssg-quick]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const el = input("giftValue");
      if (el) el.value = Number(btn.dataset.ssgQuick || 0).toLocaleString("ko-KR");
      render();
    });
  });

  document.querySelectorAll("[data-ssg-scenario]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const scenario = scenarios.find((item) => item.id === btn.dataset.ssgScenario);
      if (!scenario) return;
      applyValues(scenario.input || {});
      document.querySelectorAll("[data-ssg-scenario]").forEach((item) => item.classList.toggle("is-active", item === btn));
      render();
    });
  });

  document.getElementById("resetSsgBtn")?.addEventListener("click", () => {
    applyValues(defaults);
    document.querySelectorAll("[data-ssg-scenario]").forEach((item, index) => item.classList.toggle("is-active", index === 0));
    render();
  });

  document.getElementById("copySsgLinkBtn")?.addEventListener("click", () => {
    const data = read();
    const url = new URL(location.href);
    url.searchParams.set("kind", data.stockKind);
    url.searchParams.set("donor", data.donor);
    url.searchParams.set("gift", String(data.giftValue));
    url.searchParams.set("prior", String(data.priorSpouseGiftAmount));
    url.searchParams.set("cost", String(data.donorOriginalCost));
    url.searchParams.set("sale", String(data.expectedSalePrice));
    url.searchParams.set("hold", data.holdingPeriod);
    navigator.clipboard?.writeText(url.toString()).catch(() => {});
  });

  formatMoneyInputs();
  restoreFromUrl();
  render();
})();
