import { buildDefaultOptions, CHART_COLORS, formatKRW } from "./chart-config.js";
import { readBool, readParam, writeParams } from "./url-state.js";

(function () {
  const config = window.FLIGHT_TIMING_CONFIG;
  if (!config) return;

  const state = {
    chart: null,
  };

  const $ = (id) => document.getElementById(id);

  const els = {
    origin: $("fct-origin"),
    region: $("fct-region"),
    destinationLabel: $("fct-destination-label"),
    month: $("fct-month"),
    weeksBefore: $("fct-weeks-before"),
    persons: $("fct-persons"),
    nights: $("fct-nights"),
    day: $("fct-day"),
    time: $("fct-time"),
    baggage: $("fct-baggage"),
    airline: $("fct-airline"),
    presetSummary: $("fctPresetSummary"),
    regionHint: $("fctRegionHint"),
    seasonNote: $("fct-season-note"),
    timeSavingHint: $("fctTimeSaving"),
    recommendedWeeks: $("fct-recommended-weeks"),
    currentFare: $("fct-current-fare"),
    currentTotal: $("fctCurrentTotal"),
    optimalFare: $("fct-optimal-fare"),
    optimalTotal: $("fctOptimalTotal"),
    totalSaving: $("fct-total-saving"),
    savingPerPerson: $("fctSavingPerPerson"),
    adviceBadge: $("fct-advice-badge"),
    adviceTitle: $("fctAdviceTitle"),
    adviceMessage: $("fct-advice-message"),
    seasonPremium: $("fctSeasonPremium"),
    timeSaving: $("fct-time-saving"),
    windowLabel: $("fctWindowLabel"),
    tableBody: $("fct-scenario-table-body"),
    chart: $("fct-chart"),
    reset: $("resetFlightTimingBtn"),
    copy: $("copyFlightTimingLinkBtn"),
    presetButtons: Array.from(document.querySelectorAll("[data-fct-preset]")),
  };

  function clamp(value, min, max) {
    const num = Number(value);
    if (!Number.isFinite(num)) return min;
    return Math.min(max, Math.max(min, num));
  }

  function roundToNearestThousand(value) {
    return Math.round((Number(value) || 0) / 1000) * 1000;
  }

  function getGuide(region) {
    return config.REGION_GUIDES.find((item) => item.region === region) || config.REGION_GUIDES[0];
  }

  function getSeason(month) {
    return config.SEASON_FACTORS[String(month)] || config.SEASON_FACTORS[month] || config.SEASON_FACTORS["7"];
  }

  function getBaseFare(values) {
    return (
      config.BASE_FARES.find((item) => item.origin === values.origin && item.region === values.region) ||
      config.BASE_FARES.find((item) => item.origin === "icn" && item.region === values.region) ||
      config.BASE_FARES[0]
    );
  }

  function getBookingWindowRule(region, weeksBeforeDeparture) {
    return (
      config.BOOKING_WINDOW_RULES.find(
        (rule) => rule.region === region && weeksBeforeDeparture >= rule.minWeeks && weeksBeforeDeparture <= rule.maxWeeks,
      ) || config.BOOKING_WINDOW_RULES.find((rule) => rule.region === region)
    );
  }

  function baggageExtra(values) {
    if (!values.baggageIncluded) return 0;
    return values.airlinePreference === "fsc" ? 0 : config.BAGGAGE_INCLUDED_EXTRA;
  }

  function estimateFare(values, weeksBeforeDeparture) {
    const base = getBaseFare(values);
    const season = getSeason(values.departureMonth);
    const booking = getBookingWindowRule(values.region, weeksBeforeDeparture);
    const origin = config.ORIGIN_FACTORS[values.origin] || config.ORIGIN_FACTORS.icn;
    const day = config.DAY_FACTORS[values.dayPreference] || config.DAY_FACTORS.any;
    const time = config.TIME_FACTORS[values.timePreference] || config.TIME_FACTORS.regular;
    const airline = config.AIRLINE_FACTORS[values.airlinePreference] || config.AIRLINE_FACTORS["lcc-ok"];

    const raw =
      base.baseFare * origin.factor * season.factor * booking.factor * day.factor * time.factor * airline.factor +
      baggageExtra(values);

    return {
      farePerPerson: roundToNearestThousand(raw),
      baseFare: base,
      season,
      booking,
      origin,
      day,
      time,
      airline,
    };
  }

  function getInputValues() {
    return {
      origin: els.origin.value,
      region: els.region.value,
      destinationLabel: els.destinationLabel.value.trim() || "대표 도시",
      departureMonth: clamp(els.month.value, 1, 12),
      persons: clamp(els.persons.value, 1, 10),
      nights: clamp(els.nights.value, 1, 30),
      dayPreference: els.day.value,
      timePreference: els.time.value,
      baggageIncluded: Boolean(els.baggage.checked),
      airlinePreference: els.airline.value,
      weeksBeforeDeparture: clamp(els.weeksBefore.value, 0, 52),
    };
  }

  function findOptimal(values) {
    const guide = getGuide(values.region);
    const candidates = [];
    for (let week = guide.recommendedMinWeeks; week <= guide.recommendedMaxWeeks; week += 1) {
      candidates.push({
        week,
        fare: estimateFare(values, week).farePerPerson,
      });
    }
    return candidates.reduce((best, item) => (item.fare < best.fare ? item : best), candidates[0]);
  }

  function buildScenarios(values) {
    const weeks = values.weeksBeforeDeparture;
    const scenarioDefs = [
      { id: "now", label: "지금 예매", week: weeks },
      { id: "after-2", label: "2주 후", week: Math.max(weeks - 2, 0) },
      { id: "after-4", label: "4주 후", week: Math.max(weeks - 4, 0) },
      { id: "after-8", label: "8주 후", week: Math.max(weeks - 8, 0) },
      { id: "last-minute", label: "출발 직전", week: 0 },
    ];
    const rows = scenarioDefs.map((item) => {
      const farePerPerson = estimateFare(values, item.week).farePerPerson;
      return {
        ...item,
        farePerPerson,
        totalFare: farePerPerson * values.persons,
      };
    });
    const minFare = Math.min(...rows.map((item) => item.farePerPerson));
    return rows.map((item) => ({ ...item, isBest: item.farePerPerson === minFare }));
  }

  function getAdvice(values, current, optimal, scenarios) {
    const season = current.season;
    const currentFare = current.farePerPerson;
    const optimalFare = optimal.fare;
    const laterBest = Math.min(...scenarios.filter((item) => item.id !== "now").map((item) => item.farePerPerson));
    const bestGapRate = currentFare ? (currentFare - laterBest) / currentFare : 0;
    const nearOptimal = optimalFare ? Math.abs(currentFare - optimalFare) / optimalFare <= 0.03 : false;
    const isHighRisk = values.weeksBeforeDeparture <= 3 || (season.tone === "peak" && current.booking.factor >= 1);

    if (isHighRisk) {
      return {
        status: "high-risk",
        label: "지연 위험",
        title: "더 늦추면 가격 상승 위험이 큰 조건입니다",
        message:
          "출발이 임박했거나 성수기 영향이 큰 조건입니다. 대기 전략보다 지금 실제 항공권 가격을 확인하고 확정하는 편이 안전합니다.",
      };
    }

    if (nearOptimal || currentFare <= optimalFare) {
      return {
        status: "book-now",
        label: "지금 예매 추천",
        title: "현재 가격대가 권장 구간에 가까운 편입니다",
        message:
          "현재 예매 예상가가 권장 구간의 최저 예상가와 큰 차이가 없습니다. 일정이 확정됐다면 실제 가격을 확인하고 예매를 검토할 만합니다.",
      };
    }

    if (bestGapRate >= 0.05) {
      return {
        status: "wait-possible",
        label: "대기 가능",
        title: "조금 기다리면 낮아질 가능성이 있습니다",
        message:
          "현재는 권장 예매 구간보다 이르거나 조건상 더 낮은 시나리오가 남아 있습니다. 다만 성수기와 가족 여행은 좌석 소진 위험도 함께 확인해야 합니다.",
      };
    }

    return {
      status: "book-now",
      label: "확인 후 예매",
      title: "대기 이점이 크지 않은 조건입니다",
      message:
        "예상 절약 폭이 크지 않습니다. 실제 항공권 비교 결과에서 일정과 수하물 조건이 맞는다면 예매를 검토해도 됩니다.",
    };
  }

  function calculate(values) {
    const current = estimateFare(values, values.weeksBeforeDeparture);
    const optimal = findOptimal(values);
    const scenarios = buildScenarios(values);
    const guide = getGuide(values.region);
    const optimalFare = optimal.fare;
    const savingPerPerson = current.farePerPerson - optimalFare;
    const regularTimeFare = estimateFare({ ...values, timePreference: "regular" }, values.weeksBeforeDeparture).farePerPerson;
    const currentTimeSaving = regularTimeFare - current.farePerPerson;
    const lowSeasonFare = estimateFare({ ...values, departureMonth: 11 }, values.weeksBeforeDeparture).farePerPerson;
    const seasonPremium = current.farePerPerson - lowSeasonFare;
    const advice = getAdvice(values, current, optimal, scenarios);

    return {
      values,
      current,
      optimal,
      scenarios,
      guide,
      advice,
      currentTotal: current.farePerPerson * values.persons,
      optimalTotal: optimalFare * values.persons,
      savingPerPerson,
      totalSaving: savingPerPerson * values.persons,
      currentTimeSaving,
      seasonPremium,
    };
  }

  function renderCurrencyDelta(value) {
    if (value > 0) return `${formatKRW(value)} 절약 예상`;
    if (value < 0) return `${formatKRW(Math.abs(value))} 추가 부담 예상`;
    return "차이 거의 없음";
  }

  function render(result) {
    const { values, guide, current, optimal, advice } = result;
    const season = current.season;
    const timeLabel = current.time.label;

    els.recommendedWeeks.textContent = guide.recommendedWeeksLabel;
    els.currentFare.textContent = `1인 ${formatKRW(current.farePerPerson)}`;
    els.currentTotal.textContent = `${values.persons}인 총 ${formatKRW(result.currentTotal)}`;
    els.optimalFare.textContent = `1인 ${formatKRW(optimal.fare)}`;
    els.optimalTotal.textContent = `${optimal.week}주 전 기준 총 ${formatKRW(result.optimalTotal)}`;
    els.totalSaving.textContent = renderCurrencyDelta(result.totalSaving);
    els.savingPerPerson.textContent = `1인 기준 ${renderCurrencyDelta(result.savingPerPerson)}`;
    els.adviceBadge.textContent = advice.label;
    els.adviceBadge.dataset.status = advice.status;
    els.adviceTitle.textContent = advice.title;
    els.adviceMessage.textContent = advice.message;
    els.regionHint.textContent = `${guide.label}은 ${guide.recommendedWeeksLabel}을 참고 구간으로 봅니다.`;
    els.seasonNote.textContent = `${values.departureMonth}월: ${season.label} (${season.factor.toFixed(2)}배 추정)`;
    els.seasonPremium.textContent = `성수기 프리미엄: ${renderCurrencyDelta(result.seasonPremium)}`;
    els.timeSaving.textContent = `${timeLabel} 선택 효과: ${renderCurrencyDelta(result.currentTimeSaving)}`;
    els.timeSavingHint.textContent = `${timeLabel} 기준 ${renderCurrencyDelta(result.currentTimeSaving)}`;
    els.windowLabel.textContent = `현재 예매 구간: ${current.booking.label}`;

    renderScenarioTable(result.scenarios);
    renderChart(result.scenarios);
  }

  function renderScenarioTable(scenarios) {
    els.tableBody.innerHTML = scenarios
      .map(
        (item) => `
          <tr class="${item.isBest ? "is-best" : ""}">
            <td>${item.label}${item.isBest ? " <span>최저 예상</span>" : ""}</td>
            <td>${item.week}주 전</td>
            <td>${formatKRW(item.farePerPerson)}</td>
            <td>${formatKRW(item.totalFare)}</td>
          </tr>
        `,
      )
      .join("");
  }

  function renderChart(scenarios) {
    if (!window.Chart || !els.chart) return;
    if (state.chart) state.chart.destroy();

    state.chart = new window.Chart(els.chart, {
      type: "bar",
      data: {
        labels: scenarios.map((item) => item.label),
        datasets: [
          {
            data: scenarios.map((item) => item.farePerPerson),
            backgroundColor: scenarios.map((item) => (item.isBest ? CHART_COLORS.brand : "rgba(83, 74, 183, 0.26)")),
            borderRadius: 8,
          },
        ],
      },
      options: buildDefaultOptions({
        scales: {
          y: {
            ticks: {
              callback: (value) => formatKRW(value),
            },
            grid: {
              color: "rgba(136, 135, 128, 0.16)",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `1인 예상가 ${formatKRW(ctx.raw)}`,
            },
          },
        },
      }),
    });
  }

  function setValues(values) {
    els.origin.value = values.origin;
    els.region.value = values.region;
    els.destinationLabel.value = values.destinationLabel;
    els.month.value = String(values.departureMonth);
    els.persons.value = String(values.persons);
    els.nights.value = String(values.nights);
    els.day.value = values.dayPreference;
    els.time.value = values.timePreference;
    els.baggage.checked = values.baggageIncluded;
    els.airline.value = values.airlinePreference;
    els.weeksBefore.value = String(values.weeksBeforeDeparture);
  }

  function syncUrl(values) {
    writeParams({
      origin: values.origin,
      region: values.region,
      month: values.departureMonth,
      persons: values.persons,
      nights: values.nights,
      weeks: values.weeksBeforeDeparture,
      day: values.dayPreference,
      time: values.timePreference,
      baggage: values.baggageIncluded ? 1 : 0,
      airline: values.airlinePreference,
    });
  }

  function recalculate({ updateUrl = true } = {}) {
    const values = getInputValues();
    const result = calculate(values);
    render(result);
    if (updateUrl) syncUrl(values);
  }

  function applyPreset(id) {
    const preset = config.PRESETS.find((item) => item.id === id) || config.PRESETS[0];
    setValues(preset);
    els.presetSummary.textContent = preset.description;
    els.presetButtons.forEach((button) => {
      const active = button.dataset.fctPreset === id;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    recalculate();
  }

  function restoreFromUrl() {
    const defaults = config.DEFAULT_INPUT;
    setValues({
      ...defaults,
      origin: readParam("origin", defaults.origin),
      region: readParam("region", defaults.region),
      departureMonth: clamp(readParam("month", defaults.departureMonth), 1, 12),
      persons: clamp(readParam("persons", defaults.persons), 1, 10),
      nights: clamp(readParam("nights", defaults.nights), 1, 30),
      dayPreference: readParam("day", defaults.dayPreference),
      timePreference: readParam("time", defaults.timePreference),
      baggageIncluded: readBool("baggage", defaults.baggageIncluded),
      airlinePreference: readParam("airline", defaults.airlinePreference),
      weeksBeforeDeparture: clamp(readParam("weeks", defaults.weeksBeforeDeparture), 0, 52),
    });
  }

  function bindEvents() {
    [
      els.origin,
      els.region,
      els.destinationLabel,
      els.month,
      els.weeksBefore,
      els.persons,
      els.nights,
      els.day,
      els.time,
      els.baggage,
      els.airline,
    ].forEach((el) => {
      el.addEventListener("input", () => recalculate());
      el.addEventListener("change", () => recalculate());
    });

    els.presetButtons.forEach((button) => {
      button.addEventListener("click", () => applyPreset(button.dataset.fctPreset));
    });

    els.reset.addEventListener("click", () => applyPreset(config.PRESETS[0].id));
    els.copy.addEventListener("click", async () => {
      recalculate();
      try {
        await navigator.clipboard.writeText(window.location.href);
        els.copy.textContent = "복사 완료";
        window.setTimeout(() => {
          els.copy.textContent = "링크 복사";
        }, 1600);
      } catch {
        els.copy.textContent = "주소창 URL을 복사하세요";
      }
    });
  }

  function init() {
    bindEvents();
    restoreFromUrl();
    recalculate({ updateUrl: false });
  }

  init();
})();
