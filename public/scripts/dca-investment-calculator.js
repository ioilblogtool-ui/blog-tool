// DCA 적립식 투자 계산기 — 클라이언트 스크립트
// 모든 수치는 과거 데이터 기반 참고 추정값이며, 미래 수익을 보장하지 않습니다.

// ── 설정 로드 ─────────────────────────────────────────────────────────────────
const configEl = document.getElementById("dcaConfig");
const { DCA_ASSETS, PERIOD_OPTIONS, DEFAULT_SELECTED_ASSETS, USD_KRW_RATES } =
  JSON.parse(configEl?.textContent || "{}");

// ── DOM 참조 ──────────────────────────────────────────────────────────────────
const monthlySlider   = document.getElementById("dcaMonthlySlider");
const monthlyInput    = document.getElementById("dcaMonthlyInput");
const monthlyLabel    = document.getElementById("dcaMonthlyLabel");
const periodSelect    = document.getElementById("dcaPeriodSelect");
const fxToggle        = document.getElementById("dcaFxToggle");
const dividendToggle  = document.getElementById("dcaDividendToggle");
const assetList       = document.getElementById("dcaAssetList");
const assetHint       = document.getElementById("dcaAssetHint");
const assetTabs       = document.getElementById("dcaAssetTabs");
const searchInput     = document.getElementById("dcaAssetSearch");
const searchClear     = document.getElementById("dcaSearchClear");
const noResults       = document.getElementById("dcaNoResults");
const selectAllBtn    = document.getElementById("dcaSelectAllBtn");
const clearAllBtn     = document.getElementById("dcaClearAllBtn");

const elTopFinalValue = document.getElementById("dcaTopFinalValue");
const elTopFinalNote  = document.getElementById("dcaTopFinalNote");
const elPrincipal     = document.getElementById("dcaPrincipal");
const elTopProfit     = document.getElementById("dcaTopProfit");
const elTopCagr       = document.getElementById("dcaTopCagr");
const elTopCagrNote   = document.getElementById("dcaTopCagrNote");
const elResultSub     = document.getElementById("dcaResultSubcopy");
const elRankBody      = document.getElementById("dcaRankTableBody");
const elInsightCard   = document.getElementById("dcaInsightCard");
const elInsightText   = document.getElementById("dcaInsightText");

const resetBtn        = document.getElementById("resetDcaBtn");
const copyBtn         = document.getElementById("copyDcaLinkBtn");
const tabBtns         = document.querySelectorAll(".dca-tab");

let barChart    = null;
let lineChart   = null;
let activeTab   = "INDEX_US";
let isSearching = false;

// ── 유틸 ──────────────────────────────────────────────────────────────────────
const fmt    = (n) => Math.round(n).toLocaleString("ko-KR");

function fmtBig(n) {
  if (n === 0) return "0원";
  const abs  = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  const eok  = Math.floor(abs / 100000000);
  const man  = Math.round((abs % 100000000) / 10000);
  if (eok > 0 && man > 0) return `${sign}${eok}억 ${man.toLocaleString("ko-KR")}만원`;
  if (eok > 0) return `${sign}${eok}억원`;
  return `${sign}${man.toLocaleString("ko-KR")}만원`;
}

function fmtMan(wonVal) {
  const man = wonVal / 10000;
  if (man >= 10000) {
    const eok = man / 10000;
    return `${eok % 1 === 0 ? eok : eok.toFixed(1)}억원`;
  }
  return `${Math.round(man).toLocaleString("ko-KR")}만원`;
}

// ── 계산 로직 ─────────────────────────────────────────────────────────────────
/**
 * 단일 자산 DCA 시뮬레이션
 */
function calcDca(asset, monthlyAmount, startYear, periods, useFx, useDividend) {
  const endYear      = startYear + periods - 1;
  const effectiveStart = Math.max(startYear, asset.availableFrom);
  const totalMonths  = (endYear - effectiveStart + 1) * 12;

  if (totalMonths <= 0) {
    return { finalValue: 0, principal: 0, profit: 0, profitRate: 0, cagr: 0, yearlyValues: [], effectiveStartYear: effectiveStart, effectiveMonths: 0 };
  }

  // 월별 수익률 배열 생성
  const monthlyRates = [];
  for (let y = effectiveStart; y <= endYear; y++) {
    const annualReturn = asset.yearlyReturns[y] ?? 0;
    const annualDiv    = useDividend ? (asset.dividendYields?.[y] ?? 0) : 0;
    const monthlyRate  = (annualReturn + annualDiv) / 12;
    for (let m = 0; m < 12; m++) {
      monthlyRates.push(monthlyRate);
    }
  }

  // 환율 월별 조정 배열
  const fxAdjust = [];
  if (useFx && asset.currency === 'USD') {
    for (let y = effectiveStart; y <= endYear; y++) {
      const fxThis = USD_KRW_RATES[y]   ?? 1300;
      const fxPrev = USD_KRW_RATES[y-1] ?? fxThis;
      const fxReturn = (fxThis - fxPrev) / fxPrev;
      for (let m = 0; m < 12; m++) {
        fxAdjust.push(m === 11 ? fxReturn : 0);
      }
    }
  } else {
    for (let i = 0; i < monthlyRates.length; i++) fxAdjust.push(0);
  }

  // DCA 계산: 매월 투자, 이후 복리 성장
  const N = monthlyRates.length;
  const yearlyEndValues = new Array(Math.ceil(N / 12)).fill(0);

  // 각 달에 투자한 금액이 기간 말까지 얼마가 되는지 계산
  let totalValue = 0;
  const monthFutureValues = [];

  for (let i = 0; i < N; i++) {
    let value = monthlyAmount;
    for (let j = i; j < N; j++) {
      value *= (1 + monthlyRates[j]);
      value *= (1 + fxAdjust[j]);
    }
    monthFutureValues.push(value);
  }

  totalValue = monthFutureValues.reduce((s, v) => s + v, 0);

  // 연도별 누적 잔액 계산 (라인차트용)
  // 각 연도 말 시점까지 투자한 달들의 현재가치(해당 연도 말 기준) 합산
  const yearlyValues = [];
  for (let y = effectiveStart; y <= endYear; y++) {
    const yIdx       = y - effectiveStart;
    const endMonthIdx = (yIdx + 1) * 12; // 해당 연도 말 달 인덱스 (exclusive)

    let yearEndValue = 0;
    for (let i = 0; i < endMonthIdx && i < N; i++) {
      let value = monthlyAmount;
      for (let j = i; j <= endMonthIdx - 1 && j < N; j++) {
        value *= (1 + monthlyRates[j]);
        value *= (1 + fxAdjust[j]);
      }
      yearEndValue += value;
    }

    yearlyValues.push({ year: y, value: Math.round(yearEndValue) });
  }

  const principal   = monthlyAmount * totalMonths;
  const profit      = totalValue - principal;
  const profitRate  = principal > 0 ? (profit / principal) * 100 : 0;
  const actualYears = totalMonths / 12;
  const cagr        = principal > 0 && totalValue > 0
    ? (Math.pow(totalValue / principal, 1 / actualYears) - 1) * 100
    : 0;

  return {
    finalValue: Math.round(totalValue),
    principal:  Math.round(principal),
    profit:     Math.round(profit),
    profitRate: Math.round(profitRate * 10) / 10,
    cagr:       Math.round(cagr * 10) / 10,
    yearlyValues,
    effectiveStartYear: effectiveStart,
    effectiveMonths:    totalMonths,
  };
}

// ── 입력값 읽기 ───────────────────────────────────────────────────────────────
function getMonthlyAmount() {
  const v = parseInt(monthlyInput?.value || "300000", 10);
  return Math.max(100000, Math.min(3000000, v || 300000));
}

function getSelectedPeriod() {
  return parseInt(periodSelect?.value || "10", 10);
}

function getSelectedAssets() {
  const checked = assetList?.querySelectorAll('input[type="checkbox"]:checked') || [];
  const selectedIds = Array.from(checked).map((el) => el.value);
  return DCA_ASSETS.filter((a) => selectedIds.includes(a.id));
}

// ── 렌더링 ────────────────────────────────────────────────────────────────────
function renderKpiCards(results, monthlyAmount, periods) {
  if (!results.length) return;

  const best       = results[0];
  const principal  = monthlyAmount * periods * 12;

  if (elTopFinalValue) elTopFinalValue.textContent = fmtBig(best.finalValue);
  if (elTopFinalNote)  elTopFinalNote.textContent  = best.asset.name;
  if (elPrincipal)     elPrincipal.textContent     = fmtBig(principal);
  if (elTopProfit)     elTopProfit.textContent     = fmtBig(best.profit);
  if (elTopCagr)       elTopCagr.textContent       = `${best.cagr > 0 ? '+' : ''}${best.cagr}%`;
  if (elTopCagrNote)   elTopCagrNote.textContent   = `${best.asset.name} · 연평균`;

  const count = results.length;
  if (elResultSub) {
    elResultSub.textContent = `${count}개 자산 · ${periods}년 · 월 ${fmtMan(monthlyAmount)} 기준`;
  }
}

function renderBarChart(results) {
  const ctx = document.getElementById("dcaBarChart");
  if (!ctx) return;

  if (barChart) { barChart.destroy(); barChart = null; }

  // 수익 상위 6개만 차트에 표시
  const top = results.slice(0, 6);
  const labels = top.map((r) => r.asset.name);
  const data   = top.map((r) => Math.round(r.finalValue / 10000)); // 만원 단위
  const colors = top.map((r) => r.asset.color);

  barChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: '최종 평가금액 (만원)',
        data,
        backgroundColor: colors.map((c) => c + 'CC'),
        borderColor: colors,
        borderWidth: 2,
        borderRadius: 6,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.parsed.y.toLocaleString('ko-KR')}만원`,
          },
        },
      },
      scales: {
        y: {
          ticks: {
            callback: (v) => `${Number(v).toLocaleString('ko-KR')}만`,
          },
          grid: { color: '#F0EFEA' },
        },
        x: {
          grid: { display: false },
          ticks: { font: { size: 11 } },
        },
      },
    },
  });
}

function renderLineChart(results, startYear, endYear) {
  const ctx = document.getElementById("dcaLineChart");
  if (!ctx) return;

  if (lineChart) { lineChart.destroy(); lineChart = null; }

  // 수익 상위 6개만 라인 차트에 표시
  const top = results.slice(0, 6);

  // 공통 연도 레이블 (전체 기간)
  const allYears = [];
  for (let y = startYear; y <= endYear; y++) allYears.push(y);

  const datasets = top.map((r) => {
    const yearMap = {};
    r.yearlyValues.forEach((yv) => { yearMap[yv.year] = yv.value; });
    const data = allYears.map((y) => yearMap[y] !== undefined ? Math.round(yearMap[y] / 10000) : null);

    return {
      label: r.asset.name,
      data,
      borderColor: r.asset.color,
      backgroundColor: r.asset.color + '22',
      fill: false,
      tension: 0.3,
      pointRadius: 3,
      spanGaps: false,
    };
  });

  lineChart = new Chart(ctx, {
    type: 'line',
    data: { labels: allYears, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { size: 11 }, boxWidth: 12 },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y?.toLocaleString('ko-KR') ?? '-'}만원`,
          },
        },
      },
      scales: {
        y: {
          ticks: {
            callback: (v) => `${Number(v).toLocaleString('ko-KR')}만`,
          },
          grid: { color: '#F0EFEA' },
        },
        x: {
          grid: { display: false },
          ticks: { font: { size: 10 } },
        },
      },
    },
  });
}

function renderRankTable(results) {
  if (!elRankBody) return;

  if (!results.length) {
    elRankBody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#888;padding:20px">자산을 선택하면 결과가 표시됩니다</td></tr>';
    return;
  }

  const rows = results.map((r, idx) => {
    const rank = idx + 1;
    const badgeClass = rank <= 3 ? `dca-rank-badge dca-rank-badge--${rank}` : '';
    const rankCell = badgeClass
      ? `<span class="${badgeClass}">${rank}</span>`
      : rank;

    const dotStyle = `display:inline-block;width:8px;height:8px;border-radius:50%;background:${r.asset.color};margin-right:6px;vertical-align:middle`;

    return `
      <tr>
        <td>${rankCell}</td>
        <td><span style="${dotStyle}"></span>${r.asset.name}</td>
        <td>${fmtBig(r.finalValue)}</td>
        <td>${r.profit >= 0 ? '+' : ''}${fmtBig(r.profit)}</td>
        <td>${r.profitRate >= 0 ? '+' : ''}${r.profitRate}%</td>
        <td>${r.cagr >= 0 ? '+' : ''}${r.cagr}%</td>
      </tr>
    `;
  }).join('');

  elRankBody.innerHTML = rows;
}

function renderInsight(results, monthlyAmount, periods) {
  if (!elInsightCard || !elInsightText || !results.length) return;

  const best = results[0];
  elInsightText.textContent =
    `매달 ${fmtMan(monthlyAmount)}씩 ${periods}년간 적립식 투자했을 때, ` +
    `${best.asset.name}이(가) ${fmtBig(best.finalValue)}으로 가장 높은 수익을 기록했습니다. ` +
    `원금 ${fmtBig(best.principal)} 대비 ${best.profitRate >= 0 ? '+' : ''}${best.profitRate}% 수익이며, ` +
    `연평균 ${best.cagr >= 0 ? '+' : ''}${best.cagr}% CAGR에 해당합니다.`;

  elInsightCard.style.display = '';
}

// ── 메인 계산 ─────────────────────────────────────────────────────────────────
function runCalculation() {
  const monthlyAmount  = getMonthlyAmount();
  const periods        = getSelectedPeriod();
  const endYear        = 2025;
  const startYear      = endYear - periods + 1;
  const useFx          = fxToggle?.checked || false;
  const useDividend    = dividendToggle?.checked !== false;
  const selectedAssets = getSelectedAssets();

  if (!selectedAssets.length) {
    if (elRankBody) {
      elRankBody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#888;padding:20px">자산을 1개 이상 선택하세요</td></tr>';
    }
    return;
  }

  const results = selectedAssets
    .map((asset) => ({ asset, ...calcDca(asset, monthlyAmount, startYear, periods, useFx, useDividend) }))
    .filter((r) => r.effectiveMonths > 0)
    .sort((a, b) => b.finalValue - a.finalValue);

  renderKpiCards(results, monthlyAmount, periods);
  renderBarChart(results);
  renderLineChart(results, startYear, endYear);
  renderRankTable(results);
  renderInsight(results, monthlyAmount, periods);
  syncUrlParams(monthlyAmount, periods, selectedAssets, useFx, useDividend);
}

// ── URL 파라미터 ──────────────────────────────────────────────────────────────
function syncUrlParams(monthly, periods, assets, fx, div) {
  const params = new URLSearchParams();
  params.set("m",   monthly);
  params.set("p",   periods);
  params.set("a",   assets.map((a) => a.id).join(","));
  params.set("fx",  fx  ? "1" : "0");
  params.set("div", div ? "1" : "0");
  history.replaceState(null, "", `?${params.toString()}`);
}

function loadFromUrlParams() {
  const params = new URLSearchParams(location.search);

  const m = params.get("m");
  if (m && monthlySlider && monthlyInput) {
    const val = parseInt(m, 10);
    monthlySlider.value = val;
    monthlyInput.value  = val;
    updateMonthlyLabel(val);
  }

  const p = params.get("p");
  if (p && periodSelect) {
    periodSelect.value = p;
  }

  const a = params.get("a");
  if (a) {
    const ids = a.split(",");
    assetList?.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      cb.checked = ids.includes(cb.value);
    });
  }

  if (fxToggle)       fxToggle.checked       = params.get("fx")  === "1";
  if (dividendToggle) dividendToggle.checked  = params.get("div") !== "0";

  const tab = params.get("tab");
  if (tab) switchTab(tab);
}

// ── 슬라이더 ─────────────────────────────────────────────────────────────────
function updateMonthlyLabel(val) {
  if (!monthlyLabel) return;
  const man = val / 10000;
  if (man >= 10000) {
    const eok = man / 10000;
    monthlyLabel.textContent = `${eok % 1 === 0 ? eok : eok.toFixed(1)}억원`;
  } else {
    monthlyLabel.textContent = `${Math.round(man).toLocaleString("ko-KR")}만원`;
  }
}

// ── 탭 제어 ───────────────────────────────────────────────────────────────────
function isItemVisibleInTab(item, tabName) {
  if (tabName === "SEMICONDUCTOR") {
    return item.dataset.sector === "SEMICONDUCTOR";
  }
  return item.dataset.category === tabName;
}

function switchTab(tabName) {
  if (isSearching) return; // 검색 중엔 탭 전환 무시
  activeTab = tabName;
  tabBtns.forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.tab === tabName);
  });
  assetList?.querySelectorAll(".dca-asset-item").forEach((item) => {
    item.style.display = isItemVisibleInTab(item, tabName) ? "flex" : "none";
  });
  updateSelectAllLabel();
}

// ── 선택 카운터 업데이트 ──────────────────────────────────────────────────────
function updateSelectionHint() {
  const allChecks   = assetList?.querySelectorAll('input[type="checkbox"]') || [];
  const checkedCount = Array.from(allChecks).filter((cb) => cb.checked).length;
  if (assetHint) {
    assetHint.textContent = checkedCount > 0
      ? `${checkedCount}개 선택됨 · 차트 상위 6개 자동 표시 · 테이블 전체 표시`
      : "차트는 수익 상위 6개 자동 표시 · 테이블은 전체 표시";
    assetHint.style.color = "#B4B2A9";
  }
}

// ── 전체선택 버튼 레이블 업데이트 ─────────────────────────────────────────────
function updateSelectAllLabel() {
  if (!selectAllBtn) return;
  selectAllBtn.textContent = isSearching ? "검색 결과 전체 선택" : "탭 전체 선택";
}

// ── 검색 ──────────────────────────────────────────────────────────────────────
function handleSearch(query) {
  const q = query.trim().toLowerCase();
  isSearching = q.length > 0;

  // 검색창 클리어 버튼 표시/숨김
  if (searchClear) searchClear.style.display = isSearching ? "block" : "none";

  // 탭 표시/숨김
  if (assetTabs) assetTabs.style.display = isSearching ? "none" : "";

  const items = assetList?.querySelectorAll(".dca-asset-item") || [];
  let visibleCount = 0;

  items.forEach((item) => {
    if (isSearching) {
      const nameMatch   = item.dataset.name?.includes(q);
      const tickerMatch = item.dataset.ticker?.includes(q);
      const show = nameMatch || tickerMatch;
      item.style.display = show ? "flex" : "none";
      if (show) visibleCount++;
    } else {
      // 검색 해제 시 현재 탭 기준 복원
      item.style.display = isItemVisibleInTab(item, activeTab) ? "flex" : "none";
    }
  });

  // 검색 결과 없음 메시지
  if (noResults) noResults.style.display = (isSearching && visibleCount === 0) ? "" : "none";

  updateSelectAllLabel();
}

// ── 탭 전체 선택 / 전체 해제 ──────────────────────────────────────────────────
function selectAllVisible() {
  const items = assetList?.querySelectorAll(".dca-asset-item") || [];
  items.forEach((item) => {
    if (item.style.display !== "none") {
      const cb = item.querySelector('input[type="checkbox"]');
      if (cb) cb.checked = true;
    }
  });
  updateSelectionHint();
  runCalculation();
}

function clearAllSelected() {
  assetList?.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
    cb.checked = false;
  });
  updateSelectionHint();
  runCalculation();
}

// ── 리셋 ──────────────────────────────────────────────────────────────────────
function resetAll() {
  if (monthlySlider) monthlySlider.value = "300000";
  if (monthlyInput)  monthlyInput.value  = "300000";
  updateMonthlyLabel(300000);

  if (periodSelect) periodSelect.value = "10";
  if (fxToggle)     fxToggle.checked   = false;
  if (dividendToggle) dividendToggle.checked = true;

  // 검색 초기화
  if (searchInput) searchInput.value = "";
  handleSearch("");

  assetList?.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
    cb.checked = DEFAULT_SELECTED_ASSETS.includes(cb.value);
  });

  switchTab("INDEX_US");
  updateSelectionHint();
  runCalculation();
  history.replaceState(null, "", location.pathname);
}

// ── 링크 복사 ─────────────────────────────────────────────────────────────────
function copyLink() {
  navigator.clipboard.writeText(location.href).then(() => {
    if (copyBtn) {
      const original = copyBtn.textContent;
      copyBtn.textContent = "복사됨!";
      setTimeout(() => { copyBtn.textContent = original; }, 1500);
    }
  });
}

// ── 이벤트 바인딩 ─────────────────────────────────────────────────────────────
monthlySlider?.addEventListener("input", () => {
  const val = parseInt(monthlySlider.value, 10);
  if (monthlyInput) monthlyInput.value = val;
  updateMonthlyLabel(val);
  runCalculation();
});

monthlyInput?.addEventListener("change", () => {
  let val = parseInt(monthlyInput.value, 10);
  val = Math.max(100000, Math.min(3000000, val || 300000));
  monthlyInput.value = val;
  if (monthlySlider) monthlySlider.value = val;
  updateMonthlyLabel(val);
  runCalculation();
});

periodSelect?.addEventListener("change", runCalculation);
fxToggle?.addEventListener("change",      runCalculation);
dividendToggle?.addEventListener("change", runCalculation);

assetList?.addEventListener("change", (e) => {
  if (e.target.type === "checkbox") {
    updateSelectionHint();
    runCalculation();
  }
});

tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => switchTab(btn.dataset.tab));
});

// ── 검색 이벤트 ───────────────────────────────────────────────────────────────
searchInput?.addEventListener("input", (e) => handleSearch(e.target.value));
searchInput?.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    searchInput.value = "";
    handleSearch("");
    searchInput.blur();
  }
});
searchClear?.addEventListener("click", () => {
  searchInput.value = "";
  handleSearch("");
  searchInput.focus();
});

// ── 전체선택 / 전체해제 ───────────────────────────────────────────────────────
selectAllBtn?.addEventListener("click", selectAllVisible);
clearAllBtn?.addEventListener("click",  clearAllSelected);

resetBtn?.addEventListener("click", resetAll);
copyBtn?.addEventListener("click",  copyLink);

// ── 초기 실행 ─────────────────────────────────────────────────────────────────
loadFromUrlParams();
updateSelectionHint();
updateMonthlyLabel(getMonthlyAmount());
runCalculation();
