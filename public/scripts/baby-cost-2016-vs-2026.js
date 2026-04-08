const seedElement = document.getElementById("babyCost2016Vs2026Data");

if (seedElement) {
  const seed = JSON.parse(seedElement.textContent || "{}");

  const stageSelect = document.getElementById("babyCostStageSelect");
  const feedingSelect = document.getElementById("babyCostFeedingSelect");
  const careSelect = document.getElementById("babyCostCareSelect");

  const baseMonthlyOutput = document.getElementById("babyCostBaseMonthly");
  const netBurdenOutput = document.getElementById("babyCostNetBurden");
  const largestItemOutput = document.getElementById("babyCostLargestItem");
  const feelBandOutput = document.getElementById("babyCostFeelBand");
  const summaryOutput = document.getElementById("babyCostSummary");

  const formatCostManwon = (value) => `${(value / 10000).toFixed(1)}만원`;

  const calcFeelings = (stageMode, feedingMode, childcareMode) => {
    const stage = seed.feelDefaults?.[stageMode];
    if (!stage) return null;

    const feedingCost = Number(stage[feedingMode] || 0);
    const diaperCost = Number(stage.diaper || 0);
    const childcareCost = childcareMode === "daycare" ? Number(stage.daycareUse || 0) : Number(stage.daycareHome || 0);
    const support = childcareMode === "daycare" ? Number(stage.supportDaycare || 0) : Number(stage.supportHome || 0);
    const baseMonthlyCost = feedingCost + diaperCost + childcareCost;
    const netBurden = Math.max(baseMonthlyCost - support, 0);

    let largestLabel = "분유";
    let largestCost = feedingCost;
    if (diaperCost > largestCost) {
      largestLabel = "기저귀";
      largestCost = diaperCost;
    }
    if (childcareCost > largestCost) {
      largestLabel = "어린이집";
    }

    let feelBand = "월 10만원 미만";
    if (netBurden >= 400000) feelBand = "월 40만원 이상";
    else if (netBurden >= 200000) feelBand = "월 20만~40만원";
    else if (netBurden >= 100000) feelBand = "월 10만~20만원";

    let summaryLabel = "지원금 반영 시 버틸 만한 구간";
    if (childcareMode === "daycare") summaryLabel = "공식 지원과 실제 준비비를 함께 봐야 하는 구간";
    else if (feedingMode === "formula") summaryLabel = "반복구매 체감이 크게 남는 구간";

    return {
      baseMonthlyCost,
      netBurden,
      largestLabel,
      feelBand,
      summaryLabel,
    };
  };

  const syncQuery = (stageMode, feedingMode, childcareMode) => {
    const url = new URL(window.location.href);
    url.searchParams.set("stage", stageMode);
    url.searchParams.set("feeding", feedingMode);
    url.searchParams.set("care", childcareMode);
    window.history.replaceState({}, "", url);
  };

  const render = () => {
    const stageMode = stageSelect?.value || "newborn";
    const feedingMode = feedingSelect?.value || "formula";
    const childcareMode = careSelect?.value || "home";
    const result = calcFeelings(stageMode, feedingMode, childcareMode);
    if (!result) return;

    if (baseMonthlyOutput) baseMonthlyOutput.textContent = formatCostManwon(result.baseMonthlyCost);
    if (netBurdenOutput) netBurdenOutput.textContent = formatCostManwon(result.netBurden);
    if (largestItemOutput) largestItemOutput.textContent = result.largestLabel;
    if (feelBandOutput) feelBandOutput.textContent = result.feelBand;
    if (summaryOutput) summaryOutput.textContent = result.summaryLabel;

    syncQuery(stageMode, feedingMode, childcareMode);
  };

  const applyInitialQuery = () => {
    const params = new URLSearchParams(window.location.search);
    const stage = params.get("stage");
    const feeding = params.get("feeding");
    const care = params.get("care");

    if (stage && stageSelect?.querySelector(`option[value="${stage}"]`)) stageSelect.value = stage;
    if (feeding && feedingSelect?.querySelector(`option[value="${feeding}"]`)) feedingSelect.value = feeding;
    if (care && careSelect?.querySelector(`option[value="${care}"]`)) careSelect.value = care;
  };

  const initChart = () => {
    const canvas = document.getElementById("babyCostDemographicChart");
    const annualRows = Array.isArray(seed.annualRows) ? seed.annualRows : [];
    if (!canvas || !annualRows.length || !window.Chart) return;

    const labels = annualRows.map((row) => `${row.year}`);
    const births = annualRows.map((row) => Number(row.births || 0));
    const fertilityRates = annualRows.map((row) => Number(row.fertilityRate || 0));

    new window.Chart(canvas, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            type: "bar",
            label: "출생아 수",
            data: births,
            yAxisID: "yBirths",
            backgroundColor: "rgba(192, 86, 33, 0.78)",
            borderRadius: 8,
            maxBarThickness: 34,
          },
          {
            type: "line",
            label: "합계출산율",
            data: fertilityRates,
            yAxisID: "yRate",
            borderColor: "#315b9a",
            backgroundColor: "#315b9a",
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 4,
            tension: 0.28,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: {
            position: "top",
            labels: {
              boxWidth: 12,
              color: "#625d56",
              usePointStyle: true,
            },
          },
          tooltip: {
            callbacks: {
              label(context) {
                const value = context.raw;
                if (context.dataset.yAxisID === "yBirths") {
                  return `${context.dataset.label}: ${Number(value).toLocaleString("ko-KR")}명`;
                }
                return `${context.dataset.label}: ${Number(value).toFixed(3)}명`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: "#7b756e",
            },
          },
          yBirths: {
            position: "left",
            beginAtZero: true,
            grid: {
              color: "rgba(219, 212, 202, 0.55)",
            },
            ticks: {
              color: "#7b756e",
              callback(value) {
                return `${(Number(value) / 10000).toFixed(0)}만`;
              },
            },
          },
          yRate: {
            position: "right",
            beginAtZero: true,
            suggestedMax: 1.3,
            grid: {
              drawOnChartArea: false,
            },
            ticks: {
              color: "#315b9a",
              callback(value) {
                return `${Number(value).toFixed(1)}`;
              },
            },
          },
        },
      },
    });
  };

  applyInitialQuery();
  render();
  initChart();

  [stageSelect, feedingSelect, careSelect].forEach((element) => {
    element?.addEventListener("change", render);
  });
}
