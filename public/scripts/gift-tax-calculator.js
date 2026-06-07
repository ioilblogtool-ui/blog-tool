(() => {
  const root = document.querySelector("[data-gtc-root]");
  if (!root) return;

  const configEl = document.getElementById("gtcConfig");
  const config = JSON.parse(configEl?.textContent || "{}");
  const relations = config.relations || [];
  const brackets = (config.brackets || []).map((b) => ({
    ...b,
    limit: b.limit === null ? Infinity : b.limit,
  }));
  const won = new Intl.NumberFormat("ko-KR");

  const out = (key) => document.querySelector(`[data-gtc-output="${key}"]`);

  function numeric(value, fallback = 0) {
    const n = Number(String(value ?? "").replace(/[^\d]/g, ""));
    return Number.isFinite(n) && n >= 0 ? n : fallback;
  }

  function fmt(value) {
    if (!Number.isFinite(value) || value < 0) return "0원";
    const v = Math.round(value);
    if (v === 0) return "0원";
    if (v >= 100_000_000) {
      const eok = v / 100_000_000;
      const frac = eok % 1 === 0 ? 0 : 1;
      return `${eok.toFixed(frac)}억원`;
    }
    return `${won.format(Math.round(v / 10_000))}만원`;
  }

  function fmtExact(value) {
    return `${won.format(Math.round(value))}원`;
  }

  function fmtPct(rate) {
    return `${(rate * 100).toFixed(0)}%`;
  }

  function read() {
    const get = (key) => root.querySelector(`[data-gtc-input="${key}"]`);
    return {
      relation: get("relation")?.value || "child_adult",
      giftAmount: numeric(get("giftAmount")?.value, 0),
      priorGiftAmount: numeric(get("priorGiftAmount")?.value, 0),
      selfReport: Boolean(get("selfReport")?.checked),
    };
  }

  function getRelation(value) {
    return relations.find((r) => r.value === value) || relations[0];
  }

  function calcTax(taxBase) {
    if (taxBase <= 0) return { tax: 0, rate: 0, deductionAmount: 0, bracketIndex: -1 };
    for (let i = 0; i < brackets.length; i++) {
      if (taxBase <= brackets[i].limit) {
        const b = brackets[i];
        const tax = taxBase * b.rate - b.deduction;
        return { tax: Math.max(0, tax), rate: b.rate, deductionAmount: b.deduction, bracketIndex: i };
      }
    }
    const last = brackets[brackets.length - 1];
    return { tax: taxBase * last.rate - last.deduction, rate: last.rate, deductionAmount: last.deduction, bracketIndex: brackets.length - 1 };
  }

  function render() {
    const input = read();
    const rel = getRelation(input.relation);
    const totalGift = input.giftAmount + input.priorGiftAmount;
    const usedDeduction = Math.min(input.priorGiftAmount, rel.deduction);
    const remainingDeduction = Math.max(0, rel.deduction - usedDeduction);
    const currentDeduction = Math.min(input.giftAmount, remainingDeduction);
    const taxBase = Math.max(0, input.giftAmount - currentDeduction);
    const { tax: calculatedTax, rate, bracketIndex } = calcTax(taxBase);
    const discount = input.selfReport ? Math.floor(calculatedTax * 0.03) : 0;
    const finalTax = Math.max(0, calculatedTax - discount);

    // deduction badge
    const badge = out("deductionBadge");
    if (badge) {
      badge.textContent = `${rel.label} — ${rel.note}`;
      badge.classList.toggle("gtc-deduction-badge--zero", rel.deduction === 0);
    }

    // result cards
    set("deductionAmount", fmtExact(currentDeduction));
    set("deductionNote", rel.deduction === 0 ? "공제 없음" : `${rel.label} 공제`);
    set("taxBase", fmtExact(taxBase));
    set("taxBaseNote", taxBase === 0 ? "과세 없음" : "공제 후 과세표준");
    set("taxRate", taxBase === 0 ? "0%" : fmtPct(rate));
    set("taxRateNote", taxBase === 0 ? "비과세" : brackets[bracketIndex]?.label || "");
    set("calculatedTax", fmtExact(calculatedTax));
    set("selfReportDiscount", input.selfReport ? `▼ ${fmtExact(discount)}` : "미적용");
    set("finalTax", fmtExact(finalTax));
    set("finalTaxNote", finalTax === 0 ? "납부 없음" : "최종 납부액");

    // message
    const msgEl = out("message");
    if (msgEl) {
      if (taxBase === 0) {
        msgEl.textContent = `공제 한도(${fmtExact(rel.deduction)}) 이내 증여로 증여세가 없습니다.`;
        msgEl.className = "gtc-result-message gtc-result-message--ok";
      } else {
        const effRate = ((finalTax / input.giftAmount) * 100).toFixed(1);
        msgEl.textContent = `실효세율 ${effRate}% — 증여금액 대비 실제 세부담 비율입니다.`;
        msgEl.className = "gtc-result-message gtc-result-message--info";
      }
    }

    // breakdown table
    const tbody = out("breakdown");
    if (tbody) {
      const rows = [
        ["①", "이번 증여금액", fmtExact(input.giftAmount)],
        ["②", `10년 내 기증여액`, fmtExact(input.priorGiftAmount)],
        ["③", `증여재산 공제 한도 (${rel.label})`, fmtExact(rel.deduction)],
        ["④", `공제 잔액 (③ - 기사용분)`, fmtExact(remainingDeduction)],
        ["⑤", `적용 공제액 (min ①, ④)`, fmtExact(currentDeduction)],
        ["⑥", "과세표준 (① - ⑤)", fmtExact(taxBase)],
      ];
      if (taxBase > 0) {
        rows.push(["⑦", `산출세액 (⑥ × ${fmtPct(rate)} - 누진공제)`, fmtExact(calculatedTax)]);
        rows.push(["⑧", `신고세액공제 (3%)`, input.selfReport ? `▼ ${fmtExact(discount)}` : "미적용"]);
        rows.push(["⑨", "최종 납부세액 (⑦ - ⑧)", fmtExact(finalTax)]);
      } else {
        rows.push(["⑦", "납부세액", "0원 (공제 한도 이내)"]);
      }
      tbody.innerHTML = rows
        .map(
          ([step, label, value]) =>
            `<tr><td class="gtc-step">${step}</td><td>${label}</td><td class="gtc-value">${value}</td></tr>`
        )
        .join("");
    }

    // quota bar
    const usedTotal = Math.min(totalGift, rel.deduction);
    const quotaRatio = rel.deduction > 0 ? Math.min(1, usedTotal / rel.deduction) : 1;
    const barEl = out("quotaBarUsed");
    if (barEl) barEl.style.width = `${(quotaRatio * 100).toFixed(1)}%`;
    set("quotaUsedLabel", `사용 ${fmtExact(usedTotal)}`);
    set("quotaRemainLabel", `잔액 ${fmtExact(Math.max(0, rel.deduction - usedTotal))}`);
    const quotaDescEl = out("quotaDesc");
    if (quotaDescEl) {
      if (rel.deduction === 0) {
        quotaDescEl.textContent = "이 관계는 증여재산 공제가 없습니다.";
      } else {
        quotaDescEl.textContent = `10년간 공제 한도 ${fmtExact(rel.deduction)} 중 ${fmtExact(usedTotal)} 사용. 잔여 ${fmtExact(Math.max(0, rel.deduction - usedTotal))} 남음.`;
      }
    }

    // highlight active bracket in rate table
    document.querySelectorAll("[data-gtc-bracket]").forEach((row) => {
      const idx = Number(row.dataset.gtcBracket);
      row.classList.toggle("gtc-rate-table__active", idx === bracketIndex);
    });
  }

  function set(key, value) {
    const el = out(key);
    if (el) el.textContent = value;
  }

  // wire inputs
  root.querySelectorAll("[data-gtc-input]").forEach((el) => {
    el.addEventListener("input", render);
    el.addEventListener("change", render);
  });

  // quick amount buttons
  root.querySelectorAll("[data-gtc-quick]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = root.querySelector('[data-gtc-input="giftAmount"]');
      if (input) {
        const v = Number(btn.dataset.gtcQuick);
        input.value = v.toLocaleString("ko-KR");
        render();
      }
    });
  });

  // comma formatting for numeric inputs
  ["giftAmount", "priorGiftAmount"].forEach((key) => {
    const el = root.querySelector(`[data-gtc-input="${key}"]`);
    if (!el) return;
    el.addEventListener("blur", () => {
      const n = numeric(el.value, 0);
      el.value = n > 0 ? n.toLocaleString("ko-KR") : "0";
    });
    el.addEventListener("focus", () => {
      el.value = String(numeric(el.value, 0));
    });
  });

  // reset
  document.getElementById("resetGtcBtn")?.addEventListener("click", () => {
    const defaults = config.defaults || {};
    const relEl = root.querySelector('[data-gtc-input="relation"]');
    if (relEl) relEl.value = defaults.relation || "child_adult";
    const giftEl = root.querySelector('[data-gtc-input="giftAmount"]');
    if (giftEl) giftEl.value = (defaults.giftAmount || 100_000_000).toLocaleString("ko-KR");
    const priorEl = root.querySelector('[data-gtc-input="priorGiftAmount"]');
    if (priorEl) priorEl.value = "0";
    const reportEl = root.querySelector('[data-gtc-input="selfReport"]');
    if (reportEl) reportEl.checked = true;
    render();
  });

  // copy link
  document.getElementById("copyGtcLinkBtn")?.addEventListener("click", () => {
    const input = read();
    const url = new URL(location.href);
    url.searchParams.set("rel", input.relation);
    url.searchParams.set("amt", String(input.giftAmount));
    url.searchParams.set("prior", String(input.priorGiftAmount));
    url.searchParams.set("report", input.selfReport ? "1" : "0");
    navigator.clipboard.writeText(url.toString()).catch(() => {});
  });

  // restore from URL
  const params = new URLSearchParams(location.search);
  if (params.has("rel")) {
    const relEl = root.querySelector('[data-gtc-input="relation"]');
    if (relEl) relEl.value = params.get("rel");
  }
  if (params.has("amt")) {
    const giftEl = root.querySelector('[data-gtc-input="giftAmount"]');
    if (giftEl) giftEl.value = Number(params.get("amt")).toLocaleString("ko-KR");
  }
  if (params.has("prior")) {
    const priorEl = root.querySelector('[data-gtc-input="priorGiftAmount"]');
    if (priorEl) priorEl.value = Number(params.get("prior")).toLocaleString("ko-KR");
  }
  if (params.has("report")) {
    const reportEl = root.querySelector('[data-gtc-input="selfReport"]');
    if (reportEl) reportEl.checked = params.get("report") !== "0";
  }

  render();
})();
