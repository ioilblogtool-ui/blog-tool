// url-state.js는 브라우저에 최대 4시간 캐시된다. 다른 페이지와 같은 버전 쿼리로 불러 캐시 사본을 맞춘다.
import { readParam, writeParams } from "./url-state.js?v=20261027";

const configEl = document.getElementById("kocConfig");
const config = configEl ? JSON.parse(configEl.textContent || "{}") : {};
const byBase = config.byBase || {};
const chartData = config.chart || { labels: [], closes: [], events: [] };

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function setOut(key, value) {
  $$(`[data-koc-out="${key}"]`).forEach((node) => {
    node.textContent = value;
  });
}

// 기준점 결과는 빌드 시 계산돼 있으므로 표시만 바꾼다.
function selectBase(id, { sync = true } = {}) {
  const view = byBase[id] ? byBase[id] : byBase.octHigh;
  const activeId = byBase[id] ? id : "octHigh";
  if (!view) return;
  $$("[data-koc-base]").forEach((btn) => {
    btn.setAttribute("aria-selected", btn.dataset.kocBase === activeId ? "true" : "false");
  });
  setOut("caption", `기준: ${view.date} 종가 ${view.close}`);
  setOut("dropToLowClose", view.dropToLowClose);
  setOut("dropToLowIntraday", view.dropToLowIntraday);
  setOut("recoveryNeeded", view.recoveryNeeded);
  setOut("fromLatest", view.fromLatest);
  if (sync) writeParams({ base: activeId });
}

function initChart() {
  const wrap = $("[data-koc-chart-wrap]");
  const canvas = document.getElementById("kocChart");
  if (!wrap || !canvas || typeof window.Chart === "undefined") return;
  wrap.removeAttribute("hidden");

  const eventByDate = new Map();
  chartData.events.forEach((ev) => {
    eventByDate.set(ev.date, [...(eventByDate.get(ev.date) || []), ev.label]);
  });
  const eventPoints = chartData.labels.map((date, i) => (eventByDate.has(date) ? chartData.closes[i] : null));

  new window.Chart(canvas, {
    type: "line",
    data: {
      labels: chartData.labels,
      datasets: [
        {
          label: "코스피 종가",
          data: chartData.closes,
          borderColor: "#1d4ed8",
          backgroundColor: "rgba(29, 78, 216, 0.08)",
          borderWidth: 2,
          pointRadius: 0,
          fill: true,
          tension: 0.15,
        },
        {
          label: "시장조치",
          data: eventPoints,
          showLine: false,
          pointRadius: 5,
          pointBackgroundColor: "#dc2626",
          pointBorderColor: "#ffffff",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: (items) => {
              const d = items[0].label;
              return `${Number(d.slice(5, 7))}월 ${Number(d.slice(8, 10))}일`;
            },
            label: (ctx) => {
              if (ctx.datasetIndex === 0) return `종가 ${ctx.parsed.y.toLocaleString("ko-KR", { minimumFractionDigits: 2 })}`;
              const labels = eventByDate.get(ctx.label);
              return labels ? labels.join(", ") : null;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            maxTicksLimit: 6,
            callback(value) {
              const d = this.getLabelForValue(value);
              return `${Number(d.slice(5, 7))}/${Number(d.slice(8, 10))}`;
            },
          },
          grid: { display: false },
        },
        y: {
          ticks: { callback: (v) => Number(v).toLocaleString("ko-KR") },
        },
      },
    },
  });
}

$$("[data-koc-base]").forEach((btn) => {
  btn.addEventListener("click", () => selectBase(btn.dataset.kocBase));
});

selectBase(readParam("base", "octHigh"), { sync: false });
initChart();
