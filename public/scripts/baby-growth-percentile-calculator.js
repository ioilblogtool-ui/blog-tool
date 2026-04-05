const configEl = document.getElementById("babyGrowthConfig");
const {
  BABY_GROWTH_DEFAULT_INPUT,
  BABY_GROWTH_TABLES,
  FEEDING_GUIDES,
  DEVELOPMENT_GUIDES,
  VACCINATION_GUIDES,
} = JSON.parse(configEl?.textContent || "{}");

const fields = {
  sex: document.getElementById("bgSex"),
  birthDate: document.getElementById("bgBirthDate"),
  measureDate: document.getElementById("bgMeasureDate"),
  weightKg: document.getElementById("bgWeightKg"),
  heightCm: document.getElementById("bgHeightCm"),
  headCm: document.getElementById("bgHeadCm"),
  useCorrectedAge: document.getElementById("bgUseCorrectedAge"),
  prematureWeeks: document.getElementById("bgPrematureWeeks"),
};

const resetBtn = document.getElementById("resetBabyGrowthBtn");
const copyBtn = document.getElementById("copyBabyGrowthLinkBtn");
const prematureField = document.getElementById("bgPrematureField");
const ageNote = document.getElementById("bgAgeNote");
const resultSubcopy = document.getElementById("bgResultSubcopy");
const percentileGrid = document.getElementById("bgPercentileGrid");
const flagList = document.getElementById("bgFlagList");
const summaryHeadline = document.getElementById("bgSummaryHeadline");
const summaryText = document.getElementById("bgSummaryText");
const chartMeta = document.getElementById("bgChartMeta");
const chartToggleButtons = document.querySelectorAll("[data-chart-metric]");

const ageValue = document.getElementById("bgAgeValue");
const ageDetail = document.getElementById("bgAgeDetail");
const weightPercentile = document.getElementById("bgWeightPercentile");
const weightCategory = document.getElementById("bgWeightCategory");
const heightPercentile = document.getElementById("bgHeightPercentile");
const heightCategory = document.getElementById("bgHeightCategory");
const headPercentile = document.getElementById("bgHeadPercentile");
const headCategory = document.getElementById("bgHeadCategory");

const feedingDaily = document.getElementById("bgFeedingDaily");
const feedingSingle = document.getElementById("bgFeedingSingle");
const feedingCount = document.getElementById("bgFeedingCount");
const feedingNote = document.getElementById("bgFeedingNote");

const developmentLabel = document.getElementById("bgDevelopmentLabel");
const developmentSummary = document.getElementById("bgDevelopmentSummary");
const developmentCurrentList = document.getElementById("bgDevelopmentCurrentList");
const developmentNextList = document.getElementById("bgDevelopmentNextList");
const developmentConsultList = document.getElementById("bgDevelopmentConsultList");

const vaccineLabel = document.getElementById("bgVaccineLabel");
const currentVaccineList = document.getElementById("bgCurrentVaccineList");
const nextVaccineList = document.getElementById("bgNextVaccineList");
const vaccineNote = document.getElementById("bgVaccineNote");

let activeChartMetric = "weight";
let growthChart = null;

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

function daysBetween(start, end) {
  return Math.floor((end.getTime() - start.getTime()) / 86400000);
}

function monthValueFromDays(days) {
  return round1(Math.max(days, 0) / 30.4375);
}

function parseDate(value) {
  const dt = new Date(value);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

function getInput() {
  return {
    sex: fields.sex?.value === "female" ? "female" : "male",
    birthDate: fields.birthDate?.value || BABY_GROWTH_DEFAULT_INPUT.birthDate,
    measureDate: fields.measureDate?.value || BABY_GROWTH_DEFAULT_INPUT.measureDate,
    weightKg: clamp(parseFloat(fields.weightKg?.value || BABY_GROWTH_DEFAULT_INPUT.weightKg) || BABY_GROWTH_DEFAULT_INPUT.weightKg, 1, 25),
    heightCm: clamp(parseFloat(fields.heightCm?.value || BABY_GROWTH_DEFAULT_INPUT.heightCm) || BABY_GROWTH_DEFAULT_INPUT.heightCm, 35, 110),
    headCircumferenceCm: clamp(parseFloat(fields.headCm?.value || BABY_GROWTH_DEFAULT_INPUT.headCircumferenceCm) || BABY_GROWTH_DEFAULT_INPUT.headCircumferenceCm, 25, 60),
    useCorrectedAge: Boolean(fields.useCorrectedAge?.checked),
    prematureWeeks: clamp(parseInt(fields.prematureWeeks?.value || BABY_GROWTH_DEFAULT_INPUT.prematureWeeks, 10) || BABY_GROWTH_DEFAULT_INPUT.prematureWeeks, 24, 39),
  };
}

function getAgeMetrics(input) {
  const birthDate = parseDate(input.birthDate);
  const measureDate = parseDate(input.measureDate);
  if (!birthDate || !measureDate) {
    return {
      chronologicalDays: 0,
      chronologicalMonths: 0,
      correctedDays: 0,
      correctedMonths: 0,
      effectiveMonths: 0,
      valid: false,
    };
  }

  const chronologicalDays = Math.max(daysBetween(birthDate, measureDate), 0);
  const chronologicalMonths = monthValueFromDays(chronologicalDays);
  const correctionDays = Math.max(40 - input.prematureWeeks, 0) * 7;
  const correctedDays = Math.max(chronologicalDays - correctionDays, 0);
  const correctedMonths = monthValueFromDays(correctedDays);
  const effectiveMonths = input.useCorrectedAge ? correctedMonths : chronologicalMonths;

  return {
    chronologicalDays,
    chronologicalMonths,
    correctedDays,
    correctedMonths,
    effectiveMonths,
    valid: true,
  };
}

function findPoints(table, month) {
  const clampedMonth = clamp(month, table[0].month, table[table.length - 1].month);
  let lower = table[0];
  let upper = table[table.length - 1];
  for (let i = 0; i < table.length - 1; i += 1) {
    if (clampedMonth >= table[i].month && clampedMonth <= table[i + 1].month) {
      lower = table[i];
      upper = table[i + 1];
      break;
    }
  }
  return { lower, upper, clampedMonth };
}

function interpolatePoint(lower, upper, month) {
  if (lower.month === upper.month) return lower;
  const ratio = (month - lower.month) / (upper.month - lower.month);
  return {
    p3: lower.p3 + (upper.p3 - lower.p3) * ratio,
    p10: lower.p10 + (upper.p10 - lower.p10) * ratio,
    p25: lower.p25 + (upper.p25 - lower.p25) * ratio,
    p50: lower.p50 + (upper.p50 - lower.p50) * ratio,
    p75: lower.p75 + (upper.p75 - lower.p75) * ratio,
    p90: lower.p90 + (upper.p90 - lower.p90) * ratio,
    p97: lower.p97 + (upper.p97 - lower.p97) * ratio,
  };
}

function percentileFromThresholds(value, point) {
  const ranges = [
    { p: 3, v: point.p3 },
    { p: 10, v: point.p10 },
    { p: 25, v: point.p25 },
    { p: 50, v: point.p50 },
    { p: 75, v: point.p75 },
    { p: 90, v: point.p90 },
    { p: 97, v: point.p97 },
  ];

  if (value <= ranges[0].v) return 3;
  if (value >= ranges[ranges.length - 1].v) return 97;

  for (let i = 0; i < ranges.length - 1; i += 1) {
    const current = ranges[i];
    const next = ranges[i + 1];
    if (value >= current.v && value <= next.v) {
      const ratio = (value - current.v) / (next.v - current.v || 1);
      return Math.round(current.p + (next.p - current.p) * ratio);
    }
  }

  return 50;
}

function categoryFromPercentile(p) {
  if (p < 3 || p > 97) return "상담 권장 구간";
  if (p < 10 || p > 90) return "경계 관찰 구간";
  return "평균 범위";
}

function evaluateMetric(table, month, value) {
  const { lower, upper, clampedMonth } = findPoints(table, month);
  const point = interpolatePoint(lower, upper, clampedMonth);
  const percentile = percentileFromThresholds(value, point);
  return {
    percentile,
    category: categoryFromPercentile(percentile),
    point,
  };
}

function findBand(bands, month) {
  return bands.find((item) => month >= item.monthStart && month <= item.monthEnd) || bands[bands.length - 1];
}

function buildSummary(results) {
  const categories = [results.weight.category, results.height.category, results.head.category];
  const needsConsult = categories.includes("상담 권장 구간");
  const needsWatch = categories.includes("경계 관찰 구간");
  if (needsConsult) {
    return {
      headline: "한 항목 이상이 경계 바깥입니다",
      body: "한 번의 수치만으로 판단하긴 어렵지만, 최근 기록과 함께 다시 보고 필요하면 소아과에서 성장 흐름을 상담해보는 편이 좋습니다.",
      flags: ["급격한 변화가 있었다면 이전 측정값과 같이 보기", "수유량, 발달, 컨디션 변화가 함께 있는지 점검", "다음 측정일을 너무 길게 두지 않기"],
    };
  }
  if (needsWatch) {
    return {
      headline: "대체로 안정적이지만 추세 관찰이 좋습니다",
      body: "현재 수치가 크게 벗어나지는 않지만 일부 항목이 경계 구간에 있어 다음 측정 때 흐름을 한 번 더 보는 편이 좋습니다.",
      flags: ["같은 시간대와 비슷한 조건에서 재측정하기", "몸무게와 키, 머리둘레를 함께 보기", "먹는 양과 젖은 기저귀 수 같이 체크하기"],
    };
  }
  return {
    headline: "세 항목이 모두 평균 범위에 가깝습니다",
    body: "현재 입력값 기준으로는 몸무게, 키, 머리둘레가 모두 평균 범위 안에 있습니다. 지금처럼 추세를 꾸준히 기록해서 보는 방식이 가장 좋습니다.",
    flags: ["백분위 숫자보다 이전 기록과의 흐름 보기", "한 번의 측정보다 연속 기록이 더 중요", "수유·수면·활동 변화도 같이 메모해두기"],
  };
}

function makePercentileCard(label, percentile, value, unit, colorClass) {
  return `
    <article class="bg-percentile-card ${colorClass}">
      <div class="bg-percentile-card__head">
        <p>${label}</p>
        <strong>P${percentile}</strong>
      </div>
      <div class="bg-percentile-bar">
        <span class="bg-percentile-bar__fill" style="width:${clamp(percentile, 3, 97)}%"></span>
      </div>
      <div class="bg-percentile-scale">
        <span>P3</span>
        <span>P50</span>
        <span>P97</span>
      </div>
      <div class="bg-percentile-card__meta">현재 입력 ${value.toFixed(1)}${unit}</div>
    </article>
  `;
}

function renderList(node, items) {
  if (!node) return;
  node.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
}

function renderAgeNote(metrics, input) {
  if (!ageNote) return;
  if (input.useCorrectedAge) {
    ageNote.innerHTML = `<strong>교정 월령 기준 사용 중</strong><span>실제 월령 ${metrics.chronologicalMonths.toFixed(1)}개월 · 교정 월령 ${metrics.correctedMonths.toFixed(1)}개월</span>`;
  } else {
    ageNote.innerHTML = `<strong>실제 월령 기준 사용 중</strong><span>현재 ${metrics.chronologicalMonths.toFixed(1)}개월 기준으로 계산합니다.</span>`;
  }
}

function syncUrlParams(input) {
  const params = new URLSearchParams();
  params.set("sex", input.sex);
  params.set("birth", input.birthDate);
  params.set("measure", input.measureDate);
  params.set("w", String(input.weightKg));
  params.set("h", String(input.heightCm));
  params.set("hc", String(input.headCircumferenceCm));
  params.set("corrected", input.useCorrectedAge ? "1" : "0");
  params.set("preterm", String(input.prematureWeeks));
  params.set("metric", activeChartMetric);
  const url = new URL(window.location.href);
  url.search = params.toString();
  history.replaceState(null, "", url.toString());
}

function loadUrlParams() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("sex") && fields.sex) fields.sex.value = params.get("sex");
  if (params.get("birth") && fields.birthDate) fields.birthDate.value = params.get("birth");
  if (params.get("measure") && fields.measureDate) fields.measureDate.value = params.get("measure");
  if (params.get("w") && fields.weightKg) fields.weightKg.value = params.get("w");
  if (params.get("h") && fields.heightCm) fields.heightCm.value = params.get("h");
  if (params.get("hc") && fields.headCm) fields.headCm.value = params.get("hc");
  if (fields.useCorrectedAge) fields.useCorrectedAge.checked = params.get("corrected") === "1";
  if (params.get("preterm") && fields.prematureWeeks) fields.prematureWeeks.value = params.get("preterm");
  if (["weight", "height", "head"].includes(params.get("metric"))) activeChartMetric = params.get("metric");
}

function metricLabel(metric) {
  if (metric === "height") return "키";
  if (metric === "head") return "머리둘레";
  return "몸무게";
}

function metricUnit(metric) {
  if (metric === "weight") return "kg";
  return "cm";
}

function metricValue(metric, input) {
  if (metric === "height") return input.heightCm;
  if (metric === "head") return input.headCircumferenceCm;
  return input.weightKg;
}

function renderChart(input, month) {
  const canvas = document.getElementById("bgGrowthChart");
  if (!canvas || typeof Chart === "undefined") return;
  const table = BABY_GROWTH_TABLES[input.sex][activeChartMetric];
  const currentValue = metricValue(activeChartMetric, input);
  const labels = table.map((item) => `${item.month}개월`);
  const currentSeries = table.map((item) => (item.month === table[0].month ? null : null));
  const highlightPoint = table.map((item) => (item.month === Math.round(clamp(month, 0, 24)) ? currentValue : null));
  if (!highlightPoint.some((item) => item !== null)) {
    highlightPoint.push(currentValue);
    labels.push(`현재 ${month.toFixed(1)}개월`);
  }

  chartMeta.textContent = `${input.sex === "male" ? "남아" : "여아"} ${metricLabel(activeChartMetric)} · ${month.toFixed(1)}개월 기준 ${currentValue.toFixed(1)}${metricUnit(activeChartMetric)}`;
  chartToggleButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.chartMetric === activeChartMetric);
  });

  if (growthChart) {
    growthChart.destroy();
    growthChart = null;
  }

  growthChart = new Chart(canvas, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "P3",
          data: table.map((item) => item.p3),
          borderColor: "#d6a16d",
          backgroundColor: "rgba(214, 161, 109, 0.12)",
          borderWidth: 2,
          tension: 0.35,
          pointRadius: 0,
        },
        {
          label: "P50",
          data: table.map((item) => item.p50),
          borderColor: "#1b8a63",
          backgroundColor: "rgba(27, 138, 99, 0.14)",
          borderWidth: 2.5,
          tension: 0.35,
          pointRadius: 0,
        },
        {
          label: "P97",
          data: table.map((item) => item.p97),
          borderColor: "#5a7fc9",
          backgroundColor: "rgba(90, 127, 201, 0.12)",
          borderWidth: 2,
          tension: 0.35,
          pointRadius: 0,
        },
        {
          label: "현재 측정값",
          data: highlightPoint,
          borderColor: "#d84f4f",
          backgroundColor: "#d84f4f",
          borderWidth: 0,
          tension: 0,
          pointRadius: 5,
          pointHoverRadius: 6,
          showLine: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 10,
            color: "#5a554f",
            font: { size: 11 },
          },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}${metricUnit(activeChartMetric)}`,
          },
        },
      },
      scales: {
        y: {
          ticks: {
            color: "#7b756d",
            callback: (value) => `${value}${metricUnit(activeChartMetric)}`,
          },
          grid: { color: "#eee7de" },
        },
        x: {
          ticks: {
            color: "#7b756d",
            maxRotation: 0,
            autoSkip: true,
          },
          grid: { display: false },
        },
      },
    },
  });
}

function render() {
  const input = getInput();
  const ageMetrics = getAgeMetrics(input);
  const month = clamp(ageMetrics.effectiveMonths, 0, 24);
  const tables = BABY_GROWTH_TABLES[input.sex];
  const weight = evaluateMetric(tables.weight, month, input.weightKg);
  const height = evaluateMetric(tables.height, month, input.heightCm);
  const head = evaluateMetric(tables.head, month, input.headCircumferenceCm);
  const summary = buildSummary({ weight, height, head });
  const feeding = findBand(FEEDING_GUIDES, month);
  const development = findBand(DEVELOPMENT_GUIDES, month);
  const vaccination = findBand(VACCINATION_GUIDES, month);
  const dailyMin = Math.round(input.weightKg * feeding.dailyMlPerKgMin);
  const dailyMax = Math.round(input.weightKg * feeding.dailyMlPerKgMax);

  if (prematureField) prematureField.style.display = input.useCorrectedAge ? "block" : "none";
  renderAgeNote(ageMetrics, input);

  ageValue.textContent = `${month.toFixed(1)}개월`;
  ageDetail.textContent = input.useCorrectedAge
    ? `실제 ${ageMetrics.chronologicalMonths.toFixed(1)}개월 · 교정 ${ageMetrics.correctedMonths.toFixed(1)}개월`
    : `실제 월령 기준`;

  weightPercentile.textContent = `P${weight.percentile}`;
  weightCategory.textContent = weight.category;
  heightPercentile.textContent = `P${height.percentile}`;
  heightCategory.textContent = height.category;
  headPercentile.textContent = `P${head.percentile}`;
  headCategory.textContent = head.category;

  summaryHeadline.textContent = summary.headline;
  summaryText.textContent = summary.body;
  flagList.innerHTML = summary.flags.map((item) => `<span class="bg-flag-chip">${item}</span>`).join("");
  resultSubcopy.textContent = `${input.sex === "male" ? "남아" : "여아"} · ${month.toFixed(1)}개월 기준 결과입니다.`;

  percentileGrid.innerHTML = [
    makePercentileCard("몸무게", weight.percentile, input.weightKg, "kg", "bg-percentile-card--mint"),
    makePercentileCard("키", height.percentile, input.heightCm, "cm", "bg-percentile-card--sky"),
    makePercentileCard("머리둘레", head.percentile, input.headCircumferenceCm, "cm", "bg-percentile-card--sand"),
  ].join("");

  feedingDaily.textContent = `${dailyMin.toLocaleString("ko-KR")}~${dailyMax.toLocaleString("ko-KR")}ml`;
  feedingSingle.textContent = feeding.singleFeedMl;
  feedingCount.textContent = feeding.feedingsPerDay;
  feedingNote.textContent = `${feeding.label} 기준 · ${feeding.note}`;

  developmentLabel.textContent = development.label;
  developmentSummary.textContent = development.summary;
  renderList(developmentCurrentList, development.currentChecks);
  renderList(developmentNextList, development.nextPreview);
  renderList(developmentConsultList, development.consultFlags);

  vaccineLabel.textContent = vaccination.label;
  renderList(currentVaccineList, vaccination.currentVaccines);
  renderList(nextVaccineList, vaccination.nextVaccines);
  vaccineNote.textContent = vaccination.note;

  renderChart(input, month);
  syncUrlParams(input);
}

function resetFields() {
  if (fields.sex) fields.sex.value = BABY_GROWTH_DEFAULT_INPUT.sex;
  if (fields.birthDate) fields.birthDate.value = BABY_GROWTH_DEFAULT_INPUT.birthDate;
  if (fields.measureDate) fields.measureDate.value = BABY_GROWTH_DEFAULT_INPUT.measureDate;
  if (fields.weightKg) fields.weightKg.value = String(BABY_GROWTH_DEFAULT_INPUT.weightKg);
  if (fields.heightCm) fields.heightCm.value = String(BABY_GROWTH_DEFAULT_INPUT.heightCm);
  if (fields.headCm) fields.headCm.value = String(BABY_GROWTH_DEFAULT_INPUT.headCircumferenceCm);
  if (fields.useCorrectedAge) fields.useCorrectedAge.checked = BABY_GROWTH_DEFAULT_INPUT.useCorrectedAge;
  if (fields.prematureWeeks) fields.prematureWeeks.value = String(BABY_GROWTH_DEFAULT_INPUT.prematureWeeks);
  activeChartMetric = "weight";
  render();
}

Object.values(fields).forEach((field) => {
  if (!field) return;
  const eventName = field.type === "checkbox" || field.tagName === "SELECT" || field.type === "date" ? "change" : "input";
  field.addEventListener(eventName, render);
});

chartToggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeChartMetric = button.dataset.chartMetric || "weight";
    render();
  });
});

resetBtn?.addEventListener("click", resetFields);
copyBtn?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    copyBtn.textContent = "링크 복사됨";
    window.setTimeout(() => {
      copyBtn.textContent = "링크 복사";
    }, 1600);
  } catch (_) {
    copyBtn.textContent = "복사 실패";
    window.setTimeout(() => {
      copyBtn.textContent = "링크 복사";
    }, 1600);
  }
});

loadUrlParams();
render();
