// ─── 양도소득세 계산기 ──────────────────────────────────────
// capital-gains-tax-calculator.js
// 2026년 소득세법 기준

(function () {
  "use strict";

  // ── 기본 누진세율 8구간 ────────────────────────────────────
  const TAX_BRACKETS = [
    { limit: 14_000_000,    rate: 0.06, cumDed: 0 },
    { limit: 50_000_000,    rate: 0.15, cumDed: 1_260_000 },
    { limit: 88_000_000,    rate: 0.24, cumDed: 5_760_000 },
    { limit: 150_000_000,   rate: 0.35, cumDed: 15_440_000 },
    { limit: 300_000_000,   rate: 0.38, cumDed: 19_940_000 },
    { limit: 500_000_000,   rate: 0.40, cumDed: 25_940_000 },
    { limit: 1_000_000_000, rate: 0.42, cumDed: 35_940_000 },
    { limit: Infinity,      rate: 0.45, cumDed: 65_940_000 },
  ];

  // ── 기본공제 ──────────────────────────────────────────────
  const BASIC_DEDUCTION = 2_500_000;

  // ── 핵심 계산 함수 ────────────────────────────────────────
  function calcCapitalGainsTax(params) {
    const {
      propertyType,   // "house" | "land" | "commercial"
      houseCount,     // "one" | "two" | "three_plus"
      adjustedZone,   // boolean
      residenceYears, // number (거주 년수)
      acquirePrice,   // 취득가액 (원)
      sellPrice,      // 양도가액 (원)
      expenses,       // 필요경비 (원)
      holdingTotalMonths, // 보유 총 개월수
      heavyTaxApply,  // boolean (다주택 중과 적용 여부)
    } = params;

    const holdingYears = holdingTotalMonths / 12;

    // 1. 양도차익
    const rawGain = sellPrice - acquirePrice - expenses;
    if (rawGain <= 0) {
      return { taxableGain: 0, longTermDeductAmt: 0, taxBase: 0, taxAmount: 0, localTax: 0, total: 0, effectiveRate: 0, appliedRate: 0, rateLabel: "손실 — 납부세액 없음", isExempt: false, isLoss: true };
    }

    // 2. 1주택 비과세 판단
    const ONE_HOUSE_EXEMPT_LIMIT = 1_200_000_000;
    const isOneHouse = propertyType === "house" && houseCount === "one";
    const meetsHoldReq = holdingTotalMonths >= 24;
    const meetsResidReq = !adjustedZone || residenceYears >= 2;
    const isExemptCheck = isOneHouse && meetsHoldReq && meetsResidReq;

    // 1주택 비과세 — 12억 이하 전액 비과세
    if (isExemptCheck && sellPrice <= ONE_HOUSE_EXEMPT_LIMIT) {
      return {
        taxableGain: 0, longTermDeductAmt: 0, taxBase: 0,
        taxAmount: 0, localTax: 0, total: 0,
        effectiveRate: 0, appliedRate: 0,
        rateLabel: "1주택 비과세 (전액)",
        isExempt: true, isLoss: false,
        rawGain, sellPrice, acquirePrice, expenses,
      };
    }

    // 3. 1주택 12억 초과 — 과세 양도차익 계산
    let taxableGain = rawGain;
    let isPartialExempt = false;
    if (isExemptCheck && sellPrice > ONE_HOUSE_EXEMPT_LIMIT) {
      // 과세 양도차익 = 전체 양도차익 × (양도가액 − 12억) / 양도가액
      taxableGain = rawGain * (sellPrice - ONE_HOUSE_EXEMPT_LIMIT) / sellPrice;
      isPartialExempt = true;
    }

    // 4. 단기양도세율 판단 (2년 미만)
    let shortTermRate = 0;
    if (holdingTotalMonths < 12) {
      shortTermRate = propertyType === "house" ? 0.70 : 0.50;
    } else if (holdingTotalMonths < 24) {
      shortTermRate = propertyType === "house" ? 0.60 : 0.40;
    }
    const isShortTerm = shortTermRate > 0;

    // 5. 장기보유특별공제
    let longTermDeductRate = 0;
    if (!isShortTerm && !heavyTaxApply) {
      if (isOneHouse && holdingYears >= 3) {
        // 1주택 거주 충족 여부
        const residMet = residenceYears >= 2;
        if (residMet) {
          // 보유공제 (연4%, 최대40%) + 거주공제 (연4%, 최대40%)
          const holdRate = Math.min(Math.floor(holdingYears) * 0.04, 0.40);
          const residRate = Math.min(Math.floor(residenceYears) * 0.04, 0.40);
          longTermDeductRate = Math.min(holdRate + residRate, 0.80);
        } else {
          // 거주 미충족 — 일반공제 연2% 최대30%
          longTermDeductRate = Math.min(Math.floor(holdingYears) * 0.02, 0.30);
        }
      } else if (!isOneHouse || propertyType !== "house") {
        // 일반 (다주택·비주택) — 연2% 최대30%
        if (holdingYears >= 3) {
          longTermDeductRate = Math.min(Math.floor(holdingYears) * 0.02, 0.30);
        }
      }
    }

    const longTermDeductAmt = Math.floor(taxableGain * longTermDeductRate);
    const gainAfterLongTerm = taxableGain - longTermDeductAmt;

    // 6. 기본공제 250만 (단기 단일세율 적용 시에도 공제)
    const taxBase = Math.max(gainAfterLongTerm - BASIC_DEDUCTION, 0);

    // 7. 세율 적용
    let taxAmount = 0;
    let appliedRate = 0;
    let rateLabel = "";

    if (isShortTerm) {
      // 단기 단일세율
      appliedRate = shortTermRate;
      taxAmount = Math.floor(taxBase * shortTermRate);
      rateLabel = `단기 ${(shortTermRate * 100).toFixed(0)}%`;
    } else {
      // 기본세율 (누진)
      let baseRate = 0;
      let baseDed = 0;
      for (const b of TAX_BRACKETS) {
        if (taxBase <= b.limit) {
          baseRate = b.rate;
          baseDed = b.cumDed;
          break;
        }
      }
      // 다주택 중과 적용 여부
      let heavyAdd = 0;
      if (heavyTaxApply && propertyType === "house") {
        if (houseCount === "two") heavyAdd = 0.20;
        else if (houseCount === "three_plus") heavyAdd = 0.30;
      }
      appliedRate = baseRate + heavyAdd;
      if (heavyAdd > 0) {
        // 중과: 기본세율 누진 계산 후 중과분 추가
        const baseTax = Math.floor(taxBase * baseRate - baseDed);
        const heavyTax = Math.floor(taxBase * heavyAdd);
        taxAmount = baseTax + heavyTax;
        rateLabel = `기본세율 ${(baseRate * 100).toFixed(0)}% + 중과 +${(heavyAdd * 100).toFixed(0)}%p`;
      } else {
        taxAmount = Math.floor(taxBase * baseRate - baseDed);
        rateLabel = `기본세율 ${(baseRate * 100).toFixed(0)}%`;
      }
    }

    taxAmount = Math.max(taxAmount, 0);

    // 8. 지방소득세 10%
    const localTax = Math.floor(taxAmount * 0.1);
    const total = taxAmount + localTax;
    const effectiveRate = rawGain > 0 ? (total / rawGain) * 100 : 0;

    return {
      rawGain, taxableGain, longTermDeductAmt, longTermDeductRate,
      taxBase, taxAmount, localTax, total,
      appliedRate, effectiveRate, rateLabel,
      isExempt: false, isLoss: false, isPartialExempt,
      isShortTerm,
      sellPrice, acquirePrice, expenses,
    };
  }

  // ── DOM 읽기 ──────────────────────────────────────────────
  function read() {
    const g = (id) => document.getElementById(id);
    const parseMon = (v) => Math.round(parseFloat(v || "0") * 12 + parseFloat(document.getElementById("cgt-hold-months")?.value || "0"));

    return {
      propertyType: g("cgt-property-type")?.value || "house",
      houseCount: g("cgt-house-count")?.value || "one",
      adjustedZone: g("cgt-adjusted-zone")?.checked || false,
      residenceYears: parseFloat(g("cgt-residence-years")?.value || "0"),
      acquirePrice: parseFloat((g("cgt-acquire-price")?.value || "0").replace(/,/g, "")) || 0,
      sellPrice: parseFloat((g("cgt-sell-price")?.value || "0").replace(/,/g, "")) || 0,
      expenses: parseFloat((g("cgt-expenses")?.value || "0").replace(/,/g, "")) || 0,
      holdingTotalMonths:
        parseFloat(g("cgt-hold-years")?.value || "0") * 12 +
        parseFloat(g("cgt-hold-months")?.value || "0"),
      heavyTaxApply: g("cgt-heavy-tax")?.checked || false,
    };
  }

  // ── 포맷 유틸 ─────────────────────────────────────────────
  const fmt = (n) => Math.round(n).toLocaleString("ko-KR");
  const fmtWon = (n) => {
    const abs = Math.abs(n);
    if (abs >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}억`;
    if (abs >= 10_000_000)    return `${(n / 10_000_000).toFixed(1)}천만`;
    if (abs >= 10_000)        return `${Math.round(n / 10_000)}만`;
    return fmt(n) + "원";
  };
  const pct = (n) => n.toFixed(1) + "%";

  // ── 렌더 ────────────────────────────────────────────────
  function render() {
    const p = read();

    // 주택 수 섹션 표시/숨김
    const houseCountRow = document.getElementById("cgt-house-count-row");
    const residenceRow = document.getElementById("cgt-residence-row");
    const adjustedRow = document.getElementById("cgt-adjusted-row");
    const heavyTaxRow = document.getElementById("cgt-heavy-tax-row");

    if (houseCountRow) houseCountRow.style.display = p.propertyType === "house" ? "" : "none";
    if (residenceRow) residenceRow.style.display = (p.propertyType === "house" && p.houseCount === "one") ? "" : "none";
    if (adjustedRow) adjustedRow.style.display = p.propertyType === "house" ? "" : "none";
    if (heavyTaxRow) heavyTaxRow.style.display = (p.propertyType === "house" && p.houseCount !== "one") ? "" : "none";

    const r = calcCapitalGainsTax(p);

    // 결과 카드들 업데이트
    setCard("cgt-result-total", r.isLoss ? "손실 (납부 없음)" : `${fmt(r.total)}원`, r.isExempt ? "cgt-card--exempt" : r.isLoss ? "cgt-card--loss" : "cgt-card--main");
    setCard("cgt-result-tax",   r.isLoss ? "-" : `${fmt(r.taxAmount)}원`);
    setCard("cgt-result-local", r.isLoss ? "-" : `${fmt(r.localTax)}원`);
    setCard("cgt-result-gain",  r.isLoss ? "손실" : `${fmt(r.rawGain)}원`);
    setCard("cgt-result-rate",  r.isExempt ? "비과세" : r.isLoss ? "-" : r.rateLabel);
    setCard("cgt-result-eff",   r.isExempt ? "0%" : r.isLoss ? "-" : pct(r.effectiveRate));

    // 공제 바
    updateDeductBar(r);

    // 계산 상세 테이블
    updateBreakdown(r, p);

    // 비과세 배너
    const exemptBanner = document.getElementById("cgt-exempt-banner");
    const partialBanner = document.getElementById("cgt-partial-banner");
    if (exemptBanner) exemptBanner.style.display = r.isExempt ? "" : "none";
    if (partialBanner) partialBanner.style.display = r.isPartialExempt ? "" : "none";

    // URL 상태
    saveUrl(p);
  }

  function setCard(id, value, cls) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = value;
    if (cls) {
      const card = el.closest(".cgt-result-card");
      if (card) {
        card.className = card.className.replace(/cgt-card--\S+/g, "").trim();
        card.classList.add(cls);
      }
    }
  }

  function updateDeductBar(r) {
    const bar = document.getElementById("cgt-deduct-bar");
    if (!bar || !r.rawGain) return;
    const pctVal = r.longTermDeductRate ? (r.longTermDeductRate * 100).toFixed(0) : 0;
    const label = document.getElementById("cgt-deduct-label");
    if (label) label.textContent = pctVal > 0 ? `장기보유특별공제 ${pctVal}% 적용 — ${fmtWon(r.longTermDeductAmt)} 공제` : "장기보유특별공제 해당 없음";
    bar.style.width = pctVal + "%";
  }

  function updateBreakdown(r, p) {
    const tbody = document.getElementById("cgt-breakdown-body");
    if (!tbody) return;

    if (r.isLoss) {
      tbody.innerHTML = `<tr><td colspan="2" style="text-align:center;color:#6b7280;padding:16px">양도차손 — 납부세액 없음</td></tr>`;
      return;
    }

    const rows = [
      ["양도가액",         `${fmt(r.sellPrice)}원`],
      ["(−) 취득가액",     `${fmt(r.acquirePrice)}원`],
      ["(−) 필요경비",     `${fmt(r.expenses)}원`],
      ["= 양도차익",       `<strong>${fmt(r.rawGain)}원</strong>`],
      r.isExempt
        ? ["→ 1주택 비과세 전액", "<strong style='color:#16a34a'>0원 과세</strong>"]
        : r.isPartialExempt
          ? ["(−) 1주택 비과세분", `${fmt(r.rawGain - r.taxableGain)}원`]
          : null,
      r.isPartialExempt ? ["= 과세 양도차익", `${fmt(r.taxableGain)}원`] : null,
      !r.isExempt ? ["(−) 장기보유특별공제", r.longTermDeductAmt > 0 ? `${fmt(r.longTermDeductAmt)}원 (${(r.longTermDeductRate * 100).toFixed(0)}%)` : "해당 없음"] : null,
      !r.isExempt ? ["(−) 기본공제", "2,500,000원"] : null,
      !r.isExempt ? ["= 과세표준", `<strong>${fmt(r.taxBase)}원</strong>`] : null,
      !r.isExempt ? ["적용세율", r.rateLabel] : null,
      !r.isExempt ? ["양도소득세", `${fmt(r.taxAmount)}원`] : null,
      !r.isExempt ? ["지방소득세 (10%)", `${fmt(r.localTax)}원`] : null,
      !r.isExempt ? ["= 최종 납부세액", `<strong style='color:#1a56db'>${fmt(r.total)}원</strong>`] : null,
    ].filter(Boolean);

    tbody.innerHTML = rows.map(([label, val]) =>
      `<tr><td class="cgt-bd-label">${label}</td><td class="cgt-bd-val">${val}</td></tr>`
    ).join("");
  }

  // ── URL 상태 저장/복원 ────────────────────────────────────
  function saveUrl(p) {
    try {
      const url = new URL(location.href);
      url.searchParams.set("pt", p.propertyType);
      url.searchParams.set("hc", p.houseCount);
      url.searchParams.set("az", p.adjustedZone ? "1" : "0");
      url.searchParams.set("ry", p.residenceYears);
      url.searchParams.set("ap", p.acquirePrice);
      url.searchParams.set("sp", p.sellPrice);
      url.searchParams.set("ex", p.expenses);
      url.searchParams.set("hy", Math.floor(p.holdingTotalMonths / 12));
      url.searchParams.set("hm", p.holdingTotalMonths % 12);
      url.searchParams.set("ht", p.heavyTaxApply ? "1" : "0");
      history.replaceState(null, "", url.toString());
    } catch {}
  }

  function restoreUrl() {
    try {
      const sp = new URLSearchParams(location.search);
      const g = (id) => document.getElementById(id);
      if (sp.get("pt")) { const el = g("cgt-property-type"); if (el) el.value = sp.get("pt"); }
      if (sp.get("hc")) { const el = g("cgt-house-count"); if (el) el.value = sp.get("hc"); }
      if (sp.get("az")) { const el = g("cgt-adjusted-zone"); if (el) el.checked = sp.get("az") === "1"; }
      if (sp.get("ry")) { const el = g("cgt-residence-years"); if (el) el.value = sp.get("ry"); }
      if (sp.get("ap")) { const el = g("cgt-acquire-price"); if (el) el.value = formatInput(parseFloat(sp.get("ap"))); }
      if (sp.get("sp")) { const el = g("cgt-sell-price"); if (el) el.value = formatInput(parseFloat(sp.get("sp"))); }
      if (sp.get("ex")) { const el = g("cgt-expenses"); if (el) el.value = formatInput(parseFloat(sp.get("ex"))); }
      if (sp.get("hy")) { const el = g("cgt-hold-years"); if (el) el.value = sp.get("hy"); }
      if (sp.get("hm")) { const el = g("cgt-hold-months"); if (el) el.value = sp.get("hm"); }
      if (sp.get("ht")) { const el = g("cgt-heavy-tax"); if (el) el.checked = sp.get("ht") === "1"; }
    } catch {}
  }

  function formatInput(n) {
    return Math.round(n).toLocaleString("ko-KR");
  }

  // ── 이벤트 바인딩 ─────────────────────────────────────────
  function bindEvents() {
    // 모든 입력 → render
    const inputIds = [
      "cgt-property-type", "cgt-house-count",
      "cgt-residence-years", "cgt-acquire-price",
      "cgt-sell-price", "cgt-expenses",
      "cgt-hold-years", "cgt-hold-months",
    ];
    inputIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("input", render);
    });
    const checkIds = ["cgt-adjusted-zone", "cgt-heavy-tax"];
    checkIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("change", render);
    });

    // 숫자 입력 콤마 처리
    ["cgt-acquire-price", "cgt-sell-price", "cgt-expenses"].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("input", function () {
        const raw = this.value.replace(/,/g, "");
        if (!isNaN(raw) && raw !== "") {
          const cursor = this.selectionStart;
          const formatted = parseInt(raw, 10).toLocaleString("ko-KR");
          this.value = formatted;
          // 커서 위치 보정
          const diff = formatted.length - (cursor + (formatted.length - this.value.length));
          try { this.setSelectionRange(diff, diff); } catch {}
        }
      });
    });

    // 빠른 금액 버튼
    document.querySelectorAll("[data-quick-sell]").forEach((btn) => {
      btn.addEventListener("click", function () {
        const el = document.getElementById("cgt-sell-price");
        if (el) { el.value = parseInt(this.dataset.quickSell).toLocaleString("ko-KR"); render(); }
        document.querySelectorAll("[data-quick-sell]").forEach((b) => b.classList.remove("active"));
        this.classList.add("active");
      });
    });
    document.querySelectorAll("[data-quick-acquire]").forEach((btn) => {
      btn.addEventListener("click", function () {
        const el = document.getElementById("cgt-acquire-price");
        if (el) { el.value = parseInt(this.dataset.quickAcquire).toLocaleString("ko-KR"); render(); }
        document.querySelectorAll("[data-quick-acquire]").forEach((b) => b.classList.remove("active"));
        this.classList.add("active");
      });
    });

    // 시뮬레이션 케이스 클릭
    document.querySelectorAll("[data-sim-index]").forEach((btn) => {
      btn.addEventListener("click", function () {
        loadSim(parseInt(this.dataset.simIndex));
        document.querySelectorAll("[data-sim-index]").forEach((b) => b.classList.remove("active"));
        this.classList.add("active");
      });
    });

    // 링크 복사
    const copyBtn = document.getElementById("cgt-copy-link");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        render(); // URL 갱신
        navigator.clipboard?.writeText(location.href).then(() => {
          this.textContent = "✅ 복사됨";
          setTimeout(() => (this.textContent = "🔗 링크 복사"), 1500);
        });
      });
    }

    // 초기화
    const resetBtn = document.getElementById("cgt-reset");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        document.getElementById("cgt-property-type").value = "house";
        document.getElementById("cgt-house-count").value = "one";
        document.getElementById("cgt-adjusted-zone").checked = false;
        document.getElementById("cgt-residence-years").value = "2";
        document.getElementById("cgt-acquire-price").value = "300,000,000";
        document.getElementById("cgt-sell-price").value = "600,000,000";
        document.getElementById("cgt-expenses").value = "10,000,000";
        document.getElementById("cgt-hold-years").value = "5";
        document.getElementById("cgt-hold-months").value = "0";
        document.getElementById("cgt-heavy-tax").checked = false;
        document.querySelectorAll("[data-quick-sell],[data-quick-acquire],[data-sim-index]").forEach((b) => b.classList.remove("active"));
        render();
      });
    }
  }

  // 시뮬레이션 케이스 로드
  const SIM_DATA = [
    { pt: "house", hc: "one",  az: true,  ry: 5,  ap: 400_000_000, sp: 1_000_000_000, ex: 15_000_000, hy: 5,  hm: 0, ht: false },
    { pt: "house", hc: "one",  az: true,  ry: 4,  ap: 500_000_000, sp: 1_500_000_000, ex: 20_000_000, hy: 8,  hm: 0, ht: false },
    { pt: "house", hc: "two",  az: false, ry: 0,  ap: 200_000_000, sp: 500_000_000,   ex: 8_000_000,  hy: 6,  hm: 0, ht: false },
    { pt: "house", hc: "two",  az: false, ry: 0,  ap: 300_000_000, sp: 400_000_000,   ex: 5_000_000,  hy: 0,  hm: 11, ht: false },
    { pt: "land",  hc: "one",  az: false, ry: 0,  ap: 100_000_000, sp: 300_000_000,   ex: 5_000_000,  hy: 10, hm: 0, ht: false },
    { pt: "commercial", hc: "one", az: false, ry: 0, ap: 200_000_000, sp: 500_000_000, ex: 10_000_000, hy: 5, hm: 0, ht: false },
  ];

  function loadSim(i) {
    const d = SIM_DATA[i];
    if (!d) return;
    const g = (id) => document.getElementById(id);
    g("cgt-property-type").value = d.pt;
    g("cgt-house-count").value = d.hc;
    g("cgt-adjusted-zone").checked = d.az;
    g("cgt-residence-years").value = d.ry;
    g("cgt-acquire-price").value = d.ap.toLocaleString("ko-KR");
    g("cgt-sell-price").value = d.sp.toLocaleString("ko-KR");
    g("cgt-expenses").value = d.ex.toLocaleString("ko-KR");
    g("cgt-hold-years").value = d.hy;
    g("cgt-hold-months").value = d.hm;
    g("cgt-heavy-tax").checked = d.ht;
    render();
  }

  // ── 진입점 ────────────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", function () {
    restoreUrl();
    bindEvents();
    render();
  });
})();
