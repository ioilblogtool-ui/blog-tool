(function () {
  const root = document.querySelector(".acc-page");
  const configNode = document.getElementById("accConfig");
  if (!root || !configNode) return;

  const config = JSON.parse(configNode.textContent || "{}");
  const rates = config.rates || {};
  const presets = config.presets || [];
  const inverterRatio = config.inverterRatio || 0.6;
  const formatter = new Intl.NumberFormat("ko-KR");

  const q = (sel) => root.querySelector(sel);
  const qa = (sel) => Array.from(root.querySelectorAll(sel));
  const fmt = (v) => `${formatter.format(Math.round(v || 0))}원`;
  const fmtKwh = (v) => `${Math.round((v || 0) * 10) / 10}kWh`;
  const setText = (sel, val) => qa(sel).forEach((el) => (el.textContent = val));

  // --- 요금 계산 함수 ---

  function calcBasicCharge(kwh) {
    for (const entry of rates.basicCharge) {
      if (kwh <= entry.maxKwh) return entry.charge;
    }
    return rates.basicCharge.at(-1).charge;
  }

  function calcEnergyCharge(kwh, tiers) {
    let charge = 0;
    let remaining = kwh;
    let prevMax = 0;
    for (const tier of tiers) {
      const bracket = Math.min(remaining, tier.maxKwh - prevMax);
      if (bracket <= 0) break;
      charge += bracket * tier.rate;
      remaining -= bracket;
      prevMax = tier.maxKwh;
      if (remaining <= 0) break;
    }
    return charge;
  }

  function calcBillDetail(kwh, isSummer) {
    const tiers = isSummer ? rates.summerTiers : rates.normalTiers;
    const basic = calcBasicCharge(kwh);
    const energy = calcEnergyCharge(kwh, tiers);
    const climate = kwh * rates.climateCharge;
    const fuel = kwh * rates.fuelAdjustment;
    const subtotal = basic + energy + climate + fuel;
    const taxAmount = subtotal * (rates.vatRate + rates.fundRate);
    const total = Math.floor((subtotal + taxAmount) / 10) * 10;
    return { basic, energy, climate, fuel, taxAmount, total, subtotal };
  }

  function getTier(kwh, isSummer) {
    const t1 = isSummer ? 300 : 200;
    const t2 = isSummer ? 450 : 400;
    if (kwh <= t1) return 1;
    if (kwh <= t2) return 2;
    return 3;
  }

  // --- 입력 읽기 ---

  function readState() {
    const watt = Math.max(100, Math.min(5000, Number(q("[data-acc-watt]")?.value) || 1200));
    const isInverter = Boolean(q("[data-acc-inverter]")?.checked);
    const hours = Math.max(0.5, Math.min(24, Number(q("[data-acc-hours]")?.value) || 8));
    const days = Math.max(1, Math.min(31, Number(q("[data-acc-days]")?.value) || 25));
    const base = Math.max(50, Math.min(400, Number(q("[data-acc-base]")?.value) || 200));
    const isSummer = q("[data-acc-season]")?.value === "summer";
    return { watt, isInverter, hours, days, base, isSummer };
  }

  // --- URL 파라미터 ---

  function readUrlParams() {
    const p = new URLSearchParams(location.search);
    if (p.has("w")) { const el = q("[data-acc-watt]"); if (el) el.value = p.get("w"); }
    if (p.has("h")) { const el = q("[data-acc-hours]"); if (el) el.value = p.get("h"); }
    if (p.has("d")) { const el = q("[data-acc-days]"); if (el) el.value = p.get("d"); }
    if (p.has("base")) { const el = q("[data-acc-base]"); if (el) el.value = p.get("base"); }
    if (p.has("inv")) { const el = q("[data-acc-inverter]"); if (el) el.checked = p.get("inv") === "1"; }
    if (p.has("season")) { const el = q("[data-acc-season]"); if (el) el.value = p.get("season"); }
  }

  function buildUrlParams(state) {
    return `?w=${state.watt}&h=${state.hours}&d=${state.days}&base=${state.base}&inv=${state.isInverter ? 1 : 0}&season=${state.isSummer ? "summer" : "normal"}`;
  }

  // --- 차트 ---
  let donutChart = null;

  function updateDonut(baseKwh, airconKwh) {
    const canvas = document.getElementById("aircon-usage-donut");
    if (!canvas || typeof Chart === "undefined") return;

    const data = {
      labels: ["기존 사용량", "에어컨 추가"],
      datasets: [{
        data: [Math.round(baseKwh * 10) / 10, Math.round(airconKwh * 10) / 10],
        backgroundColor: ["#e2e8f0", "#0F6E56"],
        borderWidth: 0,
      }],
    };

    if (donutChart) {
      donutChart.data = data;
      donutChart.update();
      return;
    }

    donutChart = new Chart(canvas, {
      type: "doughnut",
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "68%",
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.parsed}kWh`,
            },
          },
        },
      },
    });
  }

  // --- 누진 바 ---

  function updateTierBar(totalKwh, isSummer) {
    const maxDisplay = 700;
    const t1 = isSummer ? 300 : 200;
    const t2 = isSummer ? 450 : 400;
    const fillPct = Math.min((totalKwh / maxDisplay) * 100, 100);
    const marker1Pct = (t1 / maxDisplay) * 100;
    const marker2Pct = (t2 / maxDisplay) * 100;

    const fill = q("[data-acc-tier-fill]");
    const m1 = q("[data-acc-marker-1]");
    const m2 = q("[data-acc-marker-2]");
    const m1Label = q("[data-acc-marker-1-label]");
    const m2Label = q("[data-acc-marker-2-label]");

    if (fill) fill.style.width = `${fillPct}%`;
    if (m1) m1.style.left = `${marker1Pct}%`;
    if (m2) m2.style.left = `${marker2Pct}%`;
    if (m1Label) m1Label.textContent = `${t1}`;
    if (m2Label) m2Label.textContent = `${t2}`;

    const tier = getTier(totalKwh, isSummer);
    if (fill) {
      fill.dataset.tier = tier;
    }
  }

  // --- 메인 계산 ---

  function recalculate() {
    const s = readState();
    const effectiveWatt = s.isInverter ? s.watt * inverterRatio : s.watt;
    const airconKwh = (effectiveWatt / 1000) * s.hours * s.days;
    const totalKwh = s.base + airconKwh;
    const tier = getTier(totalKwh, s.isSummer);

    const detailBase = calcBillDetail(s.base, s.isSummer);
    const detailTotal = calcBillDetail(totalKwh, s.isSummer);
    const extraAmount = detailTotal.total - detailBase.total;

    // KPI
    setText("[data-acc-extra]", fmt(extraAmount));
    setText("[data-acc-total]", fmt(detailTotal.total));
    setText("[data-acc-kwh]", fmtKwh(airconKwh));
    setText("[data-acc-total-kwh-label]", `총 ${Math.round(totalKwh)}kWh`);

    // 누진 배지
    const badge = q("[data-acc-tier-badge]");
    if (badge) {
      badge.textContent = `${tier}단계`;
      badge.className = `acc-tier-badge acc-tier-badge--${tier}`;
    }

    // 누진 바
    updateTierBar(totalKwh, s.isSummer);

    // 누진 구간 설명
    const t1 = s.isSummer ? 300 : 200;
    const t2 = s.isSummer ? 450 : 400;
    const tierDesc = q("[data-acc-tier-desc]");
    if (tierDesc) {
      if (tier === 1) tierDesc.textContent = `1단계 구간 (${t1}kWh 이하) · 93.3원/kWh`;
      else if (tier === 2) tierDesc.textContent = `2단계 구간 (${t1+1}~${t2}kWh) · 187.9원/kWh`;
      else tierDesc.textContent = `3단계 구간 (${t2+1}kWh 초과) · 280.6원/kWh`;
    }

    // 도넛 차트
    updateDonut(s.base, airconKwh);
    setText("[data-acc-base-kwh-label]", fmtKwh(s.base));
    setText("[data-acc-aircon-kwh-label]", fmtKwh(airconKwh));

    // 상세 테이블
    setText("[data-acc-base-basic]", fmt(detailBase.basic));
    setText("[data-acc-total-basic]", fmt(detailTotal.basic));
    setText("[data-acc-base-energy]", fmt(detailBase.energy));
    setText("[data-acc-total-energy]", fmt(detailTotal.energy));
    setText("[data-acc-base-climate]", fmt(detailBase.climate));
    setText("[data-acc-total-climate]", fmt(detailTotal.climate));
    setText("[data-acc-base-fuel]", fmt(detailBase.fuel));
    setText("[data-acc-total-fuel]", fmt(detailTotal.fuel));
    setText("[data-acc-base-tax]", fmt(detailBase.taxAmount));
    setText("[data-acc-total-tax]", fmt(detailTotal.taxAmount));
    setText("[data-acc-base-bill]", fmt(detailBase.total));
    setText("[data-acc-total-bill]", fmt(detailTotal.total));
    setText("[data-acc-extra-cell]", `+${fmt(extraAmount)}`);

    // 절약 팁
    const airconKwh1hLess = (effectiveWatt / 1000) * Math.max(0, s.hours - 1) * s.days;
    const totalKwh1hLess = s.base + airconKwh1hLess;
    const detail1hLess = calcBillDetail(totalKwh1hLess, s.isSummer);
    const saving1h = detailTotal.total - detail1hLess.total;
    const tip1h = q("[data-acc-tip-1h]");
    if (tip1h) tip1h.textContent = `월 약 ${fmt(saving1h)} 절약 가능합니다.`;

    const tipInverter = q("[data-acc-tip-inverter]");
    if (tipInverter) {
      if (s.isInverter) {
        const nonInverterKwh = (s.watt / 1000) * s.hours * s.days;
        const nonInverterDetail = calcBillDetail(s.base + nonInverterKwh, s.isSummer);
        const inverterSaving = nonInverterDetail.total - detailTotal.total;
        tipInverter.textContent = `인버터 선택으로 일반 대비 월 약 ${fmt(inverterSaving)} 절약 중입니다.`;
      } else {
        const inverterKwh = (s.watt * inverterRatio / 1000) * s.hours * s.days;
        const inverterDetail = calcBillDetail(s.base + inverterKwh, s.isSummer);
        const wouldSave = detailTotal.total - inverterDetail.total;
        tipInverter.textContent = `인버터 에어컨으로 교체 시 월 약 ${fmt(wouldSave)} 절약 가능합니다.`;
      }
    }
  }

  // --- 슬라이더 표시 업데이트 ---

  function syncRangeDisplay() {
    const hours = q("[data-acc-hours]");
    const days = q("[data-acc-days]");
    const base = q("[data-acc-base]");
    const hoursDisplay = q("[data-acc-hours-display]");
    const daysDisplay = q("[data-acc-days-display]");
    const baseDisplay = q("[data-acc-base-display]");
    if (hours && hoursDisplay) hoursDisplay.textContent = hours.value;
    if (days && daysDisplay) daysDisplay.textContent = days.value;
    if (base && baseDisplay) baseDisplay.textContent = base.value;
  }

  // --- 이벤트 바인딩 ---

  function bindEvents() {
    // 입력 변경
    root.addEventListener("input", (e) => {
      syncRangeDisplay();
      recalculate();
    });

    root.addEventListener("change", () => recalculate());

    // 프리셋 버튼
    qa("[data-acc-preset]").forEach((btn) => {
      btn.addEventListener("click", () => {
        qa("[data-acc-preset]").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");

        const presetId = btn.dataset.accPreset;
        const wattField = q("[data-acc-watt-field]");
        const wattInput = q("[data-acc-watt]");

        if (presetId === "custom") {
          if (wattField) wattField.hidden = false;
        } else {
          if (wattField) wattField.hidden = false;
          const watt = Number(btn.dataset.accPresetWatt);
          if (wattInput && watt) wattInput.value = watt;
        }
        recalculate();
      });
    });

    // 리셋
    const resetBtn = document.getElementById("accResetBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        const watt = q("[data-acc-watt]");
        const hours = q("[data-acc-hours]");
        const days = q("[data-acc-days]");
        const base = q("[data-acc-base]");
        const inverter = q("[data-acc-inverter]");
        const season = q("[data-acc-season]");
        if (watt) watt.value = 1200;
        if (hours) hours.value = 8;
        if (days) days.value = 25;
        if (base) base.value = 200;
        if (inverter) inverter.checked = true;
        if (season) season.value = "summer";

        qa("[data-acc-preset]").forEach((b, i) => b.classList.toggle("is-active", i === 1));
        syncRangeDisplay();
        recalculate();
        history.replaceState(null, "", location.pathname);
      });
    }

    // 링크 복사
    const copyBtn = document.getElementById("accCopyLinkBtn");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        const url = location.origin + location.pathname + buildUrlParams(readState());
        navigator.clipboard.writeText(url).then(() => {
          const original = copyBtn.textContent;
          copyBtn.textContent = "복사됨!";
          setTimeout(() => (copyBtn.textContent = original), 2000);
        });
      });
    }
  }

  // --- 초기화 ---
  readUrlParams();
  syncRangeDisplay();
  bindEvents();
  recalculate();
})();
