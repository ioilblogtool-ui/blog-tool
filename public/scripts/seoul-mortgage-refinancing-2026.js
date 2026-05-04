import { buildDefaultOptions, formatKRW } from "./chart-config.js";

const dataEl = document.getElementById("smr-data");
const seed = dataEl ? JSON.parse(dataEl.textContent || "{}") : { districtRows: [] };
const allowedGaps = [0.3, 0.5, 0.9, 1.2];
const allowedSorts = ["benefit", "balance", "district"];
const state = {
  gap: 0.9,
  sort: "benefit",
};
let chart;

const $ = (id) => document.getElementById(id);

function formatWon(value) {
  return `${formatKRW(value)}원`.replace("억원", "억 원").replace("만원", "만 원").replace("원원", "원");
}

function readStateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const gap = Number(params.get("gap"));
  const sort = params.get("sort");
  state.gap = allowedGaps.includes(gap) ? gap : 0.9;
  state.sort = allowedSorts.includes(sort) ? sort : "benefit";
}

function writeStateToUrl() {
  const params = new URLSearchParams();
  params.set("gap", String(state.gap));
  params.set("sort", state.sort);
  window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
}

function getCalculatedRows() {
  const rows = [...(seed.districtRows || [])].map((row) => {
    const annualInterestSaving = Math.round(row.estimatedAverageBalance * (state.gap / 100));
    const threeYearGrossSaving = annualInterestSaving * 3;
    const estimatedNetBenefit = threeYearGrossSaving - row.estimatedFeeAndCost;
    return {
      ...row,
      rateGapPercentPoint: state.gap,
      refinanceRatePercent: +(row.currentRatePercent - state.gap).toFixed(2),
      annualInterestSaving,
      threeYearGrossSaving,
      estimatedNetBenefit,
    };
  });

  rows.sort((a, b) => {
    if (state.sort === "balance") return b.estimatedAverageBalance - a.estimatedAverageBalance;
    if (state.sort === "district") return a.district.localeCompare(b.district, "ko-KR");
    return b.estimatedNetBenefit - a.estimatedNetBenefit;
  });

  return rows;
}

function riskLabel(level) {
  if (level === "high") return "심사 변수 큼";
  if (level === "low") return "비용 회수 확인";
  return "조건 확인";
}

function renderCards(rows) {
  const grid = $("smr-district-grid");
  if (!grid) return;

  grid.innerHTML = rows.map((row) => `
    <article class="smr-district-card">
      <div>
        <p>${row.district}</p>
        <strong>${formatWon(row.estimatedAverageBalance)}</strong>
      </div>
      <span>연간 절감액 ${formatWon(row.annualInterestSaving)}</span>
      <small>${row.note}</small>
    </article>
  `).join("");
}

function renderTable(rows) {
  const body = $("smr-district-table-body");
  if (!body) return;

  body.innerHTML = rows.map((row) => `
    <tr>
      <td><strong>${row.district}</strong><span class="smr-mobile-badge">${riskLabel(row.riskLevel)}</span></td>
      <td>${row.loanCountLabel}</td>
      <td>${row.totalLoanBalanceLabel}</td>
      <td>${formatWon(row.estimatedAverageBalance)}</td>
      <td>${row.currentRatePercent}% → ${row.refinanceRatePercent}%</td>
      <td>${formatWon(row.annualInterestSaving)}</td>
      <td>${formatWon(row.estimatedNetBenefit)}</td>
      <td>${row.note}</td>
    </tr>
  `).join("");
}

function renderSummary(rows) {
  const target = $("smr-summary-cards");
  if (!target) return;

  target.innerHTML = rows.slice(0, 3).map((row) => `
    <article class="smr-top-card">
      <span class="smr-risk-badge is-${row.riskLevel}">${riskLabel(row.riskLevel)}</span>
      <p>${row.district}</p>
      <strong>${formatWon(row.estimatedNetBenefit)}</strong>
      <small>3년 추정 순이익 · 금리 차이 ${row.rateGapPercentPoint}%p 기준</small>
    </article>
  `).join("");
}

function renderChart(rows) {
  const canvas = $("smr-benefit-chart");
  if (!canvas || !window.Chart) return;

  const data = rows.slice(0, 10);
  if (chart) chart.destroy();

  chart = new window.Chart(canvas.getContext("2d"), {
    type: "bar",
    data: {
      labels: data.map((row) => row.district),
      datasets: [
        {
          label: "연간 이자 절감액",
          data: data.map((row) => row.annualInterestSaving),
          backgroundColor: data.map((row) => row.riskLevel === "high" ? "#b45309" : "#0f766e"),
          borderRadius: 8,
        },
      ],
    },
    options: buildDefaultOptions({
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label(context) {
              const row = data[context.dataIndex];
              return [
                `연간 절감액 ${formatWon(row.annualInterestSaving)}`,
                `추정 평균 잔액 ${formatWon(row.estimatedAverageBalance)}`,
                `3년 순이익 ${formatWon(row.estimatedNetBenefit)}`,
              ];
            },
          },
        },
      },
      scales: {
        y: { beginAtZero: true, ticks: { callback: (value) => formatWon(value) } },
      },
    }),
  });
}

function render() {
  const rows = getCalculatedRows();
  renderSummary(rows);
  renderCards(rows);
  renderTable(rows);
  renderChart(rows);
}

function bindControls() {
  const gapSelect = $("smr-rate-gap");
  const sortSelect = $("smr-sort-select");
  if (gapSelect) {
    gapSelect.value = String(state.gap);
    gapSelect.addEventListener("change", () => {
      const next = Number(gapSelect.value);
      state.gap = allowedGaps.includes(next) ? next : 0.9;
      writeStateToUrl();
      render();
    });
  }
  if (sortSelect) {
    sortSelect.value = state.sort;
    sortSelect.addEventListener("change", () => {
      state.sort = allowedSorts.includes(sortSelect.value) ? sortSelect.value : "benefit";
      writeStateToUrl();
      render();
    });
  }
}

if (seed.districtRows?.length) {
  readStateFromUrl();
  bindControls();
  render();
}
