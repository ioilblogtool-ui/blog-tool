(() => {
  const root = document.querySelector(".nwp-page");
  const dataEl = document.getElementById("nwp-data");
  if (!root || !dataEl) return;

  const cfg = JSON.parse(dataEl.textContent || "{}");
  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => Array.from(root.querySelectorAll(selector));

  const ASSET_KEYS = ["realEstate", "jeonseDeposit", "savings", "domesticStock", "overseasStock", "crypto", "pension"];

  const initialState = {
    realEstate: 500000000,
    jeonseDeposit: 0,
    savings: 30000000,
    domesticStock: 10000000,
    overseasStock: 0,
    crypto: 0,
    pension: 0,
    debt: 300000000,
  };

  let state = { ...initialState };
  let activePreset = "capital-owner-30s";

  function num(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function fmtEok(value) {
    const eok = value / 100000000;
    const sign = eok < 0 ? "-약 " : "약 ";
    return `${sign}${Math.abs(eok).toFixed(1)}억 원`;
  }

  function fmtPercent(value) {
    return `${Math.round(value * 100)}%`;
  }

  // 로그 스케일 보간 — 두 지점 모두 양수여야 안전(3억·10억 모두 양수이므로 NaN 발생 불가)
  function logInterp(value, a, b) {
    const ratio = (Math.log(value) - Math.log(a.value)) / (Math.log(b.value) - Math.log(a.value));
    return a.topPercentile + ratio * (b.topPercentile - a.topPercentile);
  }

  // 통계청 공식 누적분포 지점(3억 미만 57.0%, 10억 이상 11.8%) 두 개만 사용한다.
  // 평균값은 백분위 경계로 사용하지 않는다(상위 10% 가구 "평균"이 상위 10% 진입 "기준"은 아니기 때문).
  function estimateTopPercentile(netWorth) {
    const { low, high } = cfg.boundaryPoints;

    if (netWorth <= 0) {
      return { value: 90, confidence: "low" };
    }
    if (netWorth >= low.value && netWorth <= high.value) {
      return { value: logInterp(netWorth, low, high), confidence: "high" };
    }
    if (netWorth < low.value) {
      const v = logInterp(netWorth, low, high);
      return { value: clamp(v, 1, 97), confidence: "medium" };
    }
    // 10억 초과 구간
    const v = logInterp(netWorth, low, high);
    const confidence = netWorth <= high.value * 3 ? "medium" : "low";
    return { value: clamp(v, 1, 97), confidence };
  }

  function roundPercentile(result) {
    // 확신도가 낮을수록 과도한 정밀 표시를 피하고 5 단위로 반올림
    if (result.confidence === "high") return Math.round(result.value);
    return Math.round(result.value / 5) * 5;
  }

  function getBand(percentile, netWorth) {
    if (percentile <= 3) return { key: "top1", label: "상위 1% 근접" };
    if (percentile <= 15) return { key: "top10", label: "상위권" };
    if (netWorth > cfg.meanStats.netWorthAverage) return { key: "aboveAverage", label: "평균 이상" };
    return { key: "belowAverage", label: "평균 이하" };
  }

  function getGapToNextBand(netWorth) {
    const { low, high } = cfg.boundaryPoints;
    if (netWorth < low.value) {
      return { label: `상위 약 ${low.topPercentile}%(순자산 3억 원)`, amountNeeded: low.value - netWorth };
    }
    if (netWorth < high.value) {
      return { label: `상위 약 ${high.topPercentile}%(순자산 10억 원)`, amountNeeded: high.value - netWorth };
    }
    return null;
  }

  function calculate(s) {
    const totalAsset = ASSET_KEYS.reduce((sum, key) => sum + s[key], 0);
    const netWorth = totalAsset - s.debt;
    const debtRatio = totalAsset > 0 ? Math.min(s.debt / totalAsset, 1) : 0;
    const realEstateAmount = s.realEstate + s.jeonseDeposit;
    const financialAmount = s.savings + s.domesticStock + s.overseasStock + s.crypto;
    const otherAmount = s.pension;
    const realEstateRatio = totalAsset > 0 ? realEstateAmount / totalAsset : 0;
    const financialRatio = totalAsset > 0 ? financialAmount / totalAsset : 0;
    const otherRatio = totalAsset > 0 ? otherAmount / totalAsset : 0;

    const percentileResult = estimateTopPercentile(netWorth);
    const percentileDisplay = roundPercentile(percentileResult);
    const band = getBand(percentileDisplay, netWorth);
    const gapToNextBand = getGapToNextBand(netWorth);
    const averageMultiple = netWorth / cfg.meanStats.netWorthAverage;

    const top1Krw = cfg.koreaTop1NetWorthKrw;
    let koreaTop1Text;
    if (netWorth > 0) {
      const ratio = top1Krw / netWorth;
      const ratioDisplay = ratio >= 100 ? Math.round(ratio).toLocaleString("ko-KR") : ratio.toFixed(1);
      const inversePercent = (netWorth / top1Krw) * 100;
      const inverseDisplay = inversePercent >= 0.01 ? `약 ${inversePercent.toFixed(2)}%` : "0.01% 미만";
      koreaTop1Text = `한국 부자 TOP10 1위(${cfg.koreaTop1Name} · ${cfg.koreaTop1Display})의 추정 자산은 입력한 순자산의 약 ${ratioDisplay}배입니다. 반대로 말하면 내 순자산은 TOP10 1위 자산의 ${inverseDisplay} 수준입니다.`;
    } else {
      koreaTop1Text = "순자산이 0 이하라 부자 TOP10과의 배율 비교가 어렵습니다.";
    }

    return {
      totalAsset,
      netWorth,
      debtRatio,
      realEstateRatio,
      financialRatio,
      otherRatio,
      percentileDisplay,
      confidence: percentileResult.confidence,
      band,
      gapToNextBand,
      averageMultiple,
      koreaTop1Text,
    };
  }

  function renderGauge(result) {
    const gauge = $("#nwpGauge");
    if (!gauge) return;
    // 게이지는 0~15억 스케일로 고정(그 이상은 끝에 고정 표시)
    const scaleMax = 1_500_000_000;
    const pos = clamp((result.netWorth / scaleMax) * 100, 0, 100);
    gauge.innerHTML = `<span class="nwp-gauge-marker" style="left:${pos}%" aria-label="순자산 ${fmtEok(result.netWorth)}, 전국 가구 추정 상위 ${result.percentileDisplay}%"><span>상위 ${result.percentileDisplay}%</span></span>`;

    const lowPos = clamp((cfg.boundaryPoints.low.value / scaleMax) * 100, 0, 100);
    const highPos = clamp((cfg.boundaryPoints.high.value / scaleMax) * 100, 0, 100);
    const avgPos = clamp((cfg.meanStats.netWorthAverage / scaleMax) * 100, 0, 100);

    const lowTick = $("#nwpTickLow");
    const highTick = $("#nwpTickHigh");
    const avgTick = $("#nwpTickAverage");
    if (lowTick) lowTick.style.left = `${lowPos}%`;
    if (highTick) highTick.style.left = `${highPos}%`;
    if (avgTick) avgTick.style.left = `${avgPos}%`;
  }

  function renderKpis(result) {
    $("#nwpNetWorth").textContent = fmtEok(result.netWorth);
    $("#nwpPercentile").textContent = `상위 약 ${result.percentileDisplay}%`;
    $("#nwpBandLabel").textContent = result.confidence === "low" ? `${result.band.label} · 추정 범위 넓음` : result.band.label;
    $("#nwpAverageMultiple").textContent = `${result.averageMultiple.toFixed(1)}배`;
    $("#nwpDebtRatio").textContent = fmtPercent(result.debtRatio);
    if (result.gapToNextBand) {
      $("#nwpGapAmount").textContent = `+${fmtEok(result.gapToNextBand.amountNeeded)}`;
      $("#nwpGapLabel").textContent = `${result.gapToNextBand.label} 진입까지`;
    } else {
      $("#nwpGapAmount").textContent = "진입 완료";
      $("#nwpGapLabel").textContent = "이미 상위 약 12%(순자산 10억 원 이상) 구간입니다";
    }
  }

  function renderDiagnosis(result) {
    const parts = [];
    parts.push(`순자산 규모는 전국 가구 기준 상위 약 ${result.percentileDisplay}% 수준으로 추정됩니다.`);
    if (result.realEstateRatio >= 0.7) {
      parts.push(`다만 총자산의 ${Math.round(result.realEstateRatio * 100)}%가 부동산에 집중되어 있어, 생활비나 투자 기회에 바로 활용할 수 있는 금융자산 비중(${Math.round(result.financialRatio * 100)}%)은 상대적으로 낮습니다.`);
    } else if (result.financialRatio >= 0.5) {
      parts.push(`금융자산 비중이 ${Math.round(result.financialRatio * 100)}%로 높아 유동성이 좋은 자산 구성입니다.`);
    }
    if (result.debtRatio >= 0.5) {
      parts.push(`총자산 대비 부채비율이 ${fmtPercent(result.debtRatio)}로 높은 편이므로 상환 부담을 함께 점검하는 것이 좋습니다.`);
    }
    $("#nwpDiagnosis").textContent = parts.join(" ");
  }

  function renderWaterfall(result) {
    const el = $("#nwpWaterfall");
    if (!el) return;
    const maxValue = Math.max(result.totalAsset, 1);
    const debtWidth = clamp((result.debt ?? 0) / maxValue, 0, 1) * 100;
    const netWidth = clamp(Math.max(result.netWorth, 0) / maxValue, 0, 1) * 100;
    el.innerHTML = `
      <div class="nwp-waterfall-row">
        <span class="nwp-waterfall-label">총자산</span>
        <div class="nwp-waterfall-bar"><span style="width:100%;background:#0f6e56"></span></div>
        <span class="nwp-waterfall-value">${fmtEok(result.totalAsset)}</span>
      </div>
      <div class="nwp-waterfall-row">
        <span class="nwp-waterfall-label">부채</span>
        <div class="nwp-waterfall-bar"><span style="width:${debtWidth}%;background:#dc2626"></span></div>
        <span class="nwp-waterfall-value">-${fmtEok(state.debt)}</span>
      </div>
      <div class="nwp-waterfall-row">
        <span class="nwp-waterfall-label">순자산</span>
        <div class="nwp-waterfall-bar"><span style="width:${netWidth}%;background:#0f6e56"></span></div>
        <span class="nwp-waterfall-value">${fmtEok(result.netWorth)}</span>
      </div>
    `;
  }

  function renderComposition(result) {
    const donut = $("#nwpDonut");
    const legend = $("#nwpCompositionLegend");
    if (!donut || !legend) return;

    const re = result.realEstateRatio * 100;
    const fi = result.financialRatio * 100;
    const ot = result.otherRatio * 100;
    donut.style.background = `conic-gradient(#0f6e56 0% ${re}%, #34d399 ${re}% ${re + fi}%, #d1d5db ${re + fi}% ${re + fi + ot}%, #f3f4f6 ${re + fi + ot}% 100%)`;

    legend.innerHTML = `
      <div><span class="dot" style="background:#0f6e56"></span>부동산 ${Math.round(re)}%</div>
      <div><span class="dot" style="background:#34d399"></span>금융자산 ${Math.round(fi)}%</div>
      <div><span class="dot" style="background:#d1d5db"></span>연금 ${Math.round(ot)}%</div>
    `;
  }

  function renderTop10Card(result) {
    $("#nwpTop10Text").textContent = result.koreaTop1Text;
  }

  function renderMessage(result) {
    const lines = [
      `입력한 총자산은 ${fmtEok(result.totalAsset)}, 총부채는 ${fmtEok(state.debt)}으로 순자산은 ${fmtEok(result.netWorth)}입니다.`,
      `2025년 가계금융복지조사 기준 전국 가구 대비 상위 약 ${result.percentileDisplay}% 구간으로 추정되며, 가구 평균 순자산 대비 약 ${result.averageMultiple.toFixed(1)}배 수준입니다.`,
    ];
    if (result.confidence === "low") {
      lines.push("이 구간은 공식 통계 지점에서 멀리 벗어나 추정 신뢰도가 낮으므로 넓은 범위로 표시했습니다.");
    }
    lines.push("이 결과는 표본조사의 공식 누적분포 지점을 보간한 구간 추정치이며 정확한 개인·가구 순위를 보장하지 않습니다.");
    $("#nwpMessage").textContent = lines.join(" ");
  }

  function readInputs() {
    ASSET_KEYS.forEach((key) => {
      state[key] = Math.max(num($(`[data-nwp="${key}"]`)?.value, initialState[key]), 0);
    });
    state.debt = Math.max(num($('[data-nwp="debt"]')?.value, initialState.debt), 0);
  }

  function setControl(key, value) {
    const el = $(`[data-nwp="${key}"]`);
    if (!el) return;
    if (el.classList.contains("input-number")) {
      el.value = typeof value === "number" ? value.toLocaleString("ko-KR") : String(value);
    } else {
      el.value = String(value);
    }
  }

  function applyState(nextState) {
    Object.entries(nextState).forEach(([key, value]) => setControl(key, value));
  }

  function updateUrl(s) {
    const params = new URLSearchParams({
      re: String(Math.round(s.realEstate)),
      jd: String(Math.round(s.jeonseDeposit)),
      sv: String(Math.round(s.savings)),
      ds: String(Math.round(s.domesticStock)),
      os: String(Math.round(s.overseasStock)),
      cr: String(Math.round(s.crypto)),
      pe: String(Math.round(s.pension)),
      dt: String(Math.round(s.debt)),
    });
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  }

  function restoreFromUrl() {
    const params = new URLSearchParams(window.location.search);
    if (!params.size) return false;
    applyState({
      realEstate: num(params.get("re"), initialState.realEstate),
      jeonseDeposit: num(params.get("jd"), initialState.jeonseDeposit),
      savings: num(params.get("sv"), initialState.savings),
      domesticStock: num(params.get("ds"), initialState.domesticStock),
      overseasStock: num(params.get("os"), initialState.overseasStock),
      crypto: num(params.get("cr"), initialState.crypto),
      pension: num(params.get("pe"), initialState.pension),
      debt: num(params.get("dt"), initialState.debt),
    });
    return true;
  }

  function renderPresetState() {
    $$("[data-nwp-preset]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.nwpPreset === activePreset);
    });
  }

  function applyPreset(id) {
    const preset = cfg.presets.find((item) => item.id === id);
    if (!preset) return;
    activePreset = id;
    applyState({ ...initialState, ...preset.input });
    renderPresetState();
    update();
  }

  function update() {
    readInputs();
    const result = calculate(state);
    renderGauge(result);
    renderKpis(result);
    renderDiagnosis(result);
    renderWaterfall({ ...result, debt: state.debt });
    renderComposition(result);
    renderTop10Card(result);
    renderMessage(result);
    updateUrl(state);
  }

  function bindEvents() {
    $$("[data-nwp]").forEach((el) => {
      el.addEventListener("input", () => {
        activePreset = "";
        renderPresetState();
        update();
      });
      el.addEventListener("change", () => {
        activePreset = "";
        renderPresetState();
        update();
      });
      if (el.classList.contains("input-number")) {
        el.addEventListener("blur", () => {
          const value = num(el.value, 0);
          el.value = value ? value.toLocaleString("ko-KR") : "0";
        });
      }
    });

    $$("[data-nwp-preset]").forEach((button) => {
      button.addEventListener("click", () => applyPreset(button.dataset.nwpPreset));
    });

    document.getElementById("nwpResetBtn")?.addEventListener("click", () => applyPreset("capital-owner-30s"));
    document.getElementById("nwpCopyBtn")?.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        const button = document.getElementById("nwpCopyBtn");
        if (button) {
          const original = button.textContent;
          button.textContent = "링크 복사됨";
          setTimeout(() => {
            button.textContent = original;
          }, 1600);
        }
      } catch {
        window.prompt("아래 주소를 복사하세요.", window.location.href);
      }
    });
  }

  const restored = restoreFromUrl();
  if (!restored) applyPreset(activePreset);
  bindEvents();
  renderPresetState();
  update();
})();
