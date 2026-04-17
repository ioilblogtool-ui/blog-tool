const CONFIG = window.__TRAVEL_CONFIG__ || {};

const DEFAULT_INPUT = CONFIG.DEFAULT_INPUT || {};
const PRESETS = Array.isArray(CONFIG.PRESETS) ? CONFIG.PRESETS : [];
const REGION_BASE_COSTS = CONFIG.REGION_BASE_COSTS || {};

const FLIGHT_MULTIPLIERS = {
  lcc: 0.72,
  economy: 1,
  premium: 1.35,
  business: 2.4,
};

const HOTEL_MULTIPLIERS = {
  guesthouse: 0.65,
  "3star": 1,
  "4star": 1.45,
  "5star": 2.3,
};

const COST_LABELS = {
  flight: "항공권",
  hotel: "숙박",
  meal: "식비",
  transport: "현지 교통",
  activity: "관광·입장료",
  insurance: "여행자보험",
  shopping: "쇼핑",
  emergency: "비상금",
};

const CHART_COLORS = [
  "#0F6E56",
  "#1D9E75",
  "#534AB7",
  "#BA7517",
  "#2563EB",
  "#14B8A6",
  "#E11D48",
  "#94A3B8",
];

const $ = (id) => document.getElementById(id);
const PRESET_MAP = new Map(PRESETS.map((preset) => [preset.id, preset]));

let donutChart = null;
let urlTimer = null;

function parseNumber(value) {
  return Number(String(value || "").replace(/[^\d.-]/g, "")) || 0;
}

function formatNumberInput(value) {
  return Math.round(Number(value) || 0).toLocaleString("ko-KR");
}

function formatWon(value) {
  return `${Math.round(Number(value) || 0).toLocaleString("ko-KR")}원`;
}

function formatShortWon(value) {
  const num = Math.round(Number(value) || 0);
  if (Math.abs(num) >= 100000000) {
    return `${(num / 100000000).toFixed(1)}억원`;
  }
  if (Math.abs(num) >= 10000) {
    return `${Math.round(num / 10000).toLocaleString("ko-KR")}만원`;
  }
  return `${num.toLocaleString("ko-KR")}원`;
}

function formatDiff(value) {
  const abs = Math.abs(value);
  return `${value >= 0 ? "+" : "-"}${formatWon(abs)}`;
}

function getCheckedValue(name) {
  return document.querySelector(`input[name="${name}"]:checked`)?.value || "";
}

function setCheckedValue(name, value) {
  const node = document.querySelector(`input[name="${name}"][value="${value}"]`);
  if (node) node.checked = true;
}

function setNumericValue(id, value) {
  const input = $(id);
  if (input) input.value = formatNumberInput(value);
}

function setPlainValue(id, value) {
  const input = $(id);
  if (input) input.value = String(value);
}

function computeRecommendedRooms(persons) {
  return Math.max(1, Math.ceil(persons / 2));
}

function updateRoomsHint(persons) {
  const roomsHint = $("otcRoomsHint");
  if (!roomsHint) return;
  const recommendedRooms = computeRecommendedRooms(persons);
  roomsHint.textContent = `${persons}인 기준 ${recommendedRooms}실 추천`;
}

function updateInsuranceField() {
  const enabled = $("otcInsurance")?.checked ?? true;
  const field = $("otcInsuranceField");
  if (field) {
    field.hidden = !enabled;
  }
}

function clearActivePreset() {
  document.querySelectorAll(".otc-preset-chip").forEach((button) => {
    button.classList.remove("is-active");
  });
}

function setActivePreset(presetId) {
  document.querySelectorAll(".otc-preset-chip").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.preset === presetId);
  });
}

function updatePresetSummary(text) {
  const summary = $("otcPresetSummary");
  if (summary) summary.textContent = text;
}

function applyRegionSuggestion(region, { replaceFlight = true, replaceHotel = true, replaceDaily = true, replaceInsurance = true } = {}) {
  const regionBase = REGION_BASE_COSTS[region];
  if (!regionBase) return;

  const flightClass = getCheckedValue("otcFlightClass") || DEFAULT_INPUT.flightClass || "economy";
  const hotelTier = getCheckedValue("otcHotelTier") || DEFAULT_INPUT.hotelTier || "3star";

  if (replaceFlight) {
    setNumericValue("otcFlightPerPerson", Math.round(regionBase.flightEconomy * (FLIGHT_MULTIPLIERS[flightClass] || 1)));
  }
  if (replaceHotel) {
    setNumericValue("otcHotelPerNight", Math.round(regionBase.hotel3Star * (HOTEL_MULTIPLIERS[hotelTier] || 1)));
  }
  if (replaceDaily) {
    setNumericValue("otcMeal", regionBase.mealPerPersonPerDay);
    setNumericValue("otcTransport", regionBase.transportPerPersonPerDay);
    setNumericValue("otcActivity", regionBase.activityPerPersonPerDay);
  }
  if (replaceInsurance) {
    setNumericValue("otcInsurancePerPerson", regionBase.insurancePerPerson);
  }
}

function applyPreset(presetId) {
  const preset = PRESET_MAP.get(presetId);
  if (!preset) return;

  setPlainValue("otcRegion", preset.region);
  setPlainValue("otcPersons", preset.persons);
  setPlainValue("otcDays", preset.days);
  setPlainValue("otcNights", preset.nights);
  setPlainValue("otcRooms", computeRecommendedRooms(preset.persons));
  setCheckedValue("otcFlightClass", preset.flightClass);
  setCheckedValue("otcHotelTier", preset.hotelTier);
  setCheckedValue("otcEmergencyRate", String(preset.emergencyRate));
  setNumericValue("otcFlightPerPerson", preset.flightPerPerson);
  setNumericValue("otcHotelPerNight", preset.hotelPerNight);
  setNumericValue("otcMeal", preset.mealPerPersonPerDay);
  setNumericValue("otcTransport", preset.transportPerPersonPerDay);
  setNumericValue("otcActivity", preset.activityPerPersonPerDay);
  setNumericValue("otcInsurancePerPerson", preset.insurancePerPerson);
  setNumericValue("otcShopping", preset.shopping);
  setNumericValue("otcBudget", preset.budget);

  const insurance = $("otcInsurance");
  if (insurance) insurance.checked = true;

  updateRoomsHint(preset.persons);
  updateInsuranceField();
  setActivePreset(presetId);
  updatePresetSummary(preset.description);
  render();
}

function applyDefaultState() {
  setPlainValue("otcRegion", DEFAULT_INPUT.region || "japan");
  setPlainValue("otcPersons", DEFAULT_INPUT.persons || 2);
  setPlainValue("otcDays", DEFAULT_INPUT.days || 4);
  setPlainValue("otcNights", DEFAULT_INPUT.nights || 3);
  setPlainValue("otcRooms", DEFAULT_INPUT.rooms || 1);
  setCheckedValue("otcFlightClass", DEFAULT_INPUT.flightClass || "economy");
  setCheckedValue("otcHotelTier", DEFAULT_INPUT.hotelTier || "3star");
  setCheckedValue("otcEmergencyRate", String(DEFAULT_INPUT.emergencyRate || 0.1));
  setNumericValue("otcFlightPerPerson", DEFAULT_INPUT.flightPerPerson || 0);
  setNumericValue("otcHotelPerNight", DEFAULT_INPUT.hotelPerNight || 0);
  setNumericValue("otcMeal", DEFAULT_INPUT.mealPerPersonPerDay || 0);
  setNumericValue("otcTransport", DEFAULT_INPUT.transportPerPersonPerDay || 0);
  setNumericValue("otcActivity", DEFAULT_INPUT.activityPerPersonPerDay || 0);
  setNumericValue("otcInsurancePerPerson", DEFAULT_INPUT.insurancePerPerson || 0);
  setNumericValue("otcShopping", DEFAULT_INPUT.shopping || 0);
  setNumericValue("otcBudget", DEFAULT_INPUT.budget || 0);

  const insurance = $("otcInsurance");
  if (insurance) insurance.checked = DEFAULT_INPUT.insuranceEnabled !== false;

  updateRoomsHint(DEFAULT_INPUT.persons || 2);
  updateInsuranceField();
}

function readState() {
  const persons = Math.max(1, parseInt($("otcPersons")?.value || "0", 10) || 1);
  const days = Math.max(1, parseInt($("otcDays")?.value || "0", 10) || 1);
  const nights = Math.max(1, parseInt($("otcNights")?.value || "0", 10) || 1);
  const rooms = Math.max(1, parseInt($("otcRooms")?.value || "0", 10) || 1);

  return {
    region: $("otcRegion")?.value || "japan",
    persons,
    days,
    nights,
    rooms,
    flightClass: getCheckedValue("otcFlightClass") || "economy",
    hotelTier: getCheckedValue("otcHotelTier") || "3star",
    flightPerPerson: Math.max(0, parseNumber($("otcFlightPerPerson")?.value)),
    hotelPerNight: Math.max(0, parseNumber($("otcHotelPerNight")?.value)),
    mealPerPersonPerDay: Math.max(0, parseNumber($("otcMeal")?.value)),
    transportPerPersonPerDay: Math.max(0, parseNumber($("otcTransport")?.value)),
    activityPerPersonPerDay: Math.max(0, parseNumber($("otcActivity")?.value)),
    insuranceEnabled: $("otcInsurance")?.checked ?? true,
    insurancePerPerson: Math.max(0, parseNumber($("otcInsurancePerPerson")?.value)),
    shopping: Math.max(0, parseNumber($("otcShopping")?.value)),
    emergencyRate: Math.max(0, Number(getCheckedValue("otcEmergencyRate") || 0.1)),
    budget: Math.max(0, parseNumber($("otcBudget")?.value)),
  };
}

function calculate(state) {
  const flight = state.flightPerPerson * state.persons;
  const hotel = state.hotelPerNight * state.nights * state.rooms;
  const meal = state.mealPerPersonPerDay * state.days * state.persons;
  const transport = state.transportPerPersonPerDay * state.days * state.persons;
  const activity = state.activityPerPersonPerDay * state.days * state.persons;
  const insurance = state.insuranceEnabled ? state.insurancePerPerson * state.persons : 0;
  const shopping = state.shopping;
  const subtotal = flight + hotel + meal + transport + activity + insurance + shopping;
  const emergency = Math.round(subtotal * state.emergencyRate);
  const total = subtotal + emergency;
  const perPerson = Math.round(total / state.persons);

  return {
    flight,
    hotel,
    meal,
    transport,
    activity,
    insurance,
    shopping,
    subtotal,
    emergency,
    total,
    perPerson,
  };
}

function renderSummary(state, result) {
  const totalCost = $("otcTotalCost");
  const perPerson = $("otcPerPerson");
  const emergency = $("otcEmergency");
  const totalNote = $("otcTotalNote");
  const subcopy = $("otcResultSubcopy");

  if (totalCost) totalCost.textContent = formatShortWon(result.total);
  if (perPerson) perPerson.textContent = formatShortWon(result.perPerson);
  if (emergency) emergency.textContent = formatShortWon(result.emergency);
  if (totalNote) totalNote.textContent = `${state.persons}인 · ${state.nights}박 ${state.days}일 기준`;
  if (subcopy) {
    subcopy.textContent = `${state.region === "japan" ? "일본" : state.region === "southeast-asia" ? "동남아" : state.region === "europe" ? "유럽" : state.region === "americas" ? "미주" : "대만·홍콩"} ${state.persons}인 여행 예상 총액입니다.`;
  }
}

function renderBudgetGauge(state, result) {
  const budget = state.budget;
  const fill = $("otcGaugeFill");
  const status = $("otcBudgetStatus");
  const display = $("otcBudgetDisplay");
  const diffNode = $("otcBudgetDiff");
  const message = $("otcGaugeMessage");

  if (display) display.textContent = formatShortWon(budget);

  if (budget <= 0) {
    if (fill) fill.style.width = "0%";
    if (status) {
      status.textContent = "미입력";
      status.className = "otc-budget-status otc-budget-status--neutral";
    }
    if (diffNode) diffNode.textContent = "예산을 입력하면 초과 여부를 보여줍니다.";
    if (message) message.textContent = "총예산을 넣으면 사유 예산인지, 촉박한지, 초과인지 바로 판단할 수 있습니다.";
    return;
  }

  const ratio = result.total / budget;
  const width = Math.min(ratio * 100, 100);
  const diff = budget - result.total;

  if (fill) {
    fill.style.width = `${width}%`;
    fill.className = "otc-gauge-fill";
    if (ratio > 1) fill.classList.add("otc-gauge-fill--over");
    else if (ratio > 0.9) fill.classList.add("otc-gauge-fill--warn");
  }

  if (diffNode) {
    diffNode.textContent = diff >= 0 ? `${formatWon(diff)} 남음` : `${formatWon(Math.abs(diff))} 초과`;
  }

  if (ratio > 1) {
    if (status) {
      status.textContent = "초과";
      status.className = "otc-budget-status otc-budget-status--over";
    }
    if (message) message.textContent = `현재 입력값은 예산보다 ${formatWon(Math.abs(diff))} 더 필요합니다. 항공권 등급, 숙박 단가, 쇼핑 예산부터 줄여보세요.`;
  } else if (ratio > 0.9) {
    if (status) {
      status.textContent = "촉박";
      status.className = "otc-budget-status otc-budget-status--warn";
    }
    if (message) message.textContent = `예산 안에는 들어오지만 여유가 크지 않습니다. 비상금과 현장 추가지출을 한 번 더 점검하는 편이 안전합니다.`;
  } else {
    if (status) {
      status.textContent = "여유";
      status.className = "otc-budget-status otc-budget-status--ok";
    }
    if (message) message.textContent = `예산 안에서 ${formatWon(diff)} 정도 여유가 있습니다. 쇼핑이나 액티비티를 조금 추가해도 대응 가능한 수준입니다.`;
  }
}

function renderBreakdown(result) {
  const body = $("otcBreakdownBody");
  const totalNode = $("otcBreakdownTotal");
  if (!body) return;

  const rows = [
    ["flight", result.flight],
    ["hotel", result.hotel],
    ["meal", result.meal],
    ["transport", result.transport],
    ["activity", result.activity],
    ["insurance", result.insurance],
    ["shopping", result.shopping],
    ["emergency", result.emergency],
  ].filter(([, value]) => value > 0);

  body.innerHTML = rows
    .map(([key, value]) => {
      const ratio = result.total > 0 ? `${Math.round((value / result.total) * 100)}%` : "0%";
      return `<tr><td>${COST_LABELS[key]}</td><td>${formatWon(value)}</td><td>${ratio}</td></tr>`;
    })
    .join("");

  if (totalNode) totalNode.textContent = formatWon(result.total);
}

function renderInsight(result) {
  const insight = $("otcInsight");
  if (!insight) return;

  const candidates = [
    ["항공권", result.flight],
    ["숙박", result.hotel],
    ["식비", result.meal],
    ["현지 교통", result.transport],
    ["관광·입장료", result.activity],
    ["쇼핑", result.shopping],
  ].filter(([, value]) => value > 0);

  candidates.sort((a, b) => b[1] - a[1]);
  const top = candidates[0];

  if (!top || result.total <= 0) {
    insight.textContent = "입력값을 넣으면 가장 큰 비용 항목을 요약해드립니다.";
    return;
  }

  const share = Math.round((top[1] / result.total) * 100);
  insight.textContent = `현재 기준 가장 큰 비용은 ${top[0]}이며 전체의 ${share}% 정도를 차지합니다. 총액을 줄이려면 이 항목부터 조정하는 편이 가장 효과적입니다.`;
}

function renderChart(result) {
  const canvas = $("otcDonutChart");
  const Chart = window.Chart;
  if (!canvas || !Chart) return;

  const labels = Object.values(COST_LABELS);
  const values = [
    result.flight,
    result.hotel,
    result.meal,
    result.transport,
    result.activity,
    result.insurance,
    result.shopping,
    result.emergency,
  ];

  if (donutChart) {
    donutChart.data.labels = labels;
    donutChart.data.datasets[0].data = values;
    donutChart.update("none");
    return;
  }

  donutChart = new Chart(canvas, {
    type: "doughnut",
    data: {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: CHART_COLORS,
          borderWidth: 2,
          borderColor: "#ffffff",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "62%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 12,
            boxHeight: 12,
            usePointStyle: true,
            padding: 14,
          },
        },
        tooltip: {
          callbacks: {
            label(context) {
              return `${context.label}: ${formatWon(context.raw)}`;
            },
          },
        },
      },
    },
  });
}

function serializeState(state) {
  const params = new URLSearchParams();
  params.set("r", state.region);
  params.set("p", String(state.persons));
  params.set("d", String(state.days));
  params.set("n", String(state.nights));
  params.set("rm", String(state.rooms));
  params.set("fc", state.flightClass);
  params.set("ht", state.hotelTier);
  params.set("fp", String(state.flightPerPerson));
  params.set("hp", String(state.hotelPerNight));
  params.set("ml", String(state.mealPerPersonPerDay));
  params.set("tr", String(state.transportPerPersonPerDay));
  params.set("ac", String(state.activityPerPersonPerDay));
  params.set("ins", state.insuranceEnabled ? "1" : "0");
  params.set("ip", String(state.insurancePerPerson));
  params.set("sh", String(state.shopping));
  params.set("er", String(state.emergencyRate));
  params.set("b", String(state.budget));
  return params.toString();
}

function updateUrl(state) {
  clearTimeout(urlTimer);
  urlTimer = window.setTimeout(() => {
    const query = serializeState(state);
    history.replaceState(null, "", `${location.pathname}?${query}`);
  }, 200);
}

function restoreFromUrl() {
  const params = new URLSearchParams(location.search);
  if (!params.size) return false;

  const setValueIfExists = (id, key, formatter = null) => {
    if (!params.has(key)) return;
    const node = $(id);
    if (!node) return;
    const value = params.get(key) || "";
    node.value = formatter ? formatter(value) : value;
  };

  setValueIfExists("otcRegion", "r");
  setValueIfExists("otcPersons", "p");
  setValueIfExists("otcDays", "d");
  setValueIfExists("otcNights", "n");
  setValueIfExists("otcRooms", "rm");
  setValueIfExists("otcFlightPerPerson", "fp", formatNumberInput);
  setValueIfExists("otcHotelPerNight", "hp", formatNumberInput);
  setValueIfExists("otcMeal", "ml", formatNumberInput);
  setValueIfExists("otcTransport", "tr", formatNumberInput);
  setValueIfExists("otcActivity", "ac", formatNumberInput);
  setValueIfExists("otcInsurancePerPerson", "ip", formatNumberInput);
  setValueIfExists("otcShopping", "sh", formatNumberInput);
  setValueIfExists("otcBudget", "b", formatNumberInput);

  if (params.has("fc")) setCheckedValue("otcFlightClass", params.get("fc"));
  if (params.has("ht")) setCheckedValue("otcHotelTier", params.get("ht"));
  if (params.has("er")) setCheckedValue("otcEmergencyRate", params.get("er"));

  const insurance = $("otcInsurance");
  if (insurance && params.has("ins")) {
    insurance.checked = params.get("ins") === "1";
  }

  updateRoomsHint(parseInt($("otcPersons")?.value || "2", 10));
  updateInsuranceField();
  clearActivePreset();
  updatePresetSummary("공유된 링크 입력값을 불러왔습니다.");
  return true;
}

function render() {
  const state = readState();
  const result = calculate(state);
  renderSummary(state, result);
  renderBudgetGauge(state, result);
  renderBreakdown(result);
  renderInsight(result);
  renderChart(result);
  updateUrl(state);
}

function bindFormattedInputs() {
  const numericIds = [
    "otcFlightPerPerson",
    "otcHotelPerNight",
    "otcMeal",
    "otcTransport",
    "otcActivity",
    "otcInsurancePerPerson",
    "otcShopping",
    "otcBudget",
  ];

  numericIds.forEach((id) => {
    const node = $(id);
    if (!node) return;

    node.addEventListener("input", () => {
      clearActivePreset();
      render();
    });

    node.addEventListener("blur", () => {
      node.value = formatNumberInput(parseNumber(node.value));
      render();
    });
  });
}

function bindEvents() {
  document.querySelectorAll(".otc-preset-chip").forEach((button) => {
    button.addEventListener("click", () => {
      const presetId = button.dataset.preset;
      if (!presetId) return;
      applyPreset(presetId);
    });
  });

  $("resetOverseasTravelBtn")?.addEventListener("click", () => {
    applyDefaultState();
    applyPreset(PRESETS[0]?.id);
  });

  $("copyOverseasTravelLinkBtn")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      const button = $("copyOverseasTravelLinkBtn");
      if (!button) return;
      const original = button.textContent;
      button.textContent = "링크 복사 완료";
      window.setTimeout(() => {
        button.textContent = original;
      }, 1500);
    } catch (_) {
      window.alert("링크 복사에 실패했습니다. 주소창의 URL을 직접 복사해주세요.");
    }
  });

  $("otcRegion")?.addEventListener("change", () => {
    clearActivePreset();
    applyRegionSuggestion($("otcRegion")?.value || "japan");
    updatePresetSummary("지역 기준 평균값으로 항공·숙박·현지 지출을 다시 제안했습니다.");
    render();
  });

  $("otcPersons")?.addEventListener("input", () => {
    clearActivePreset();
    const persons = Math.max(1, parseInt($("otcPersons")?.value || "0", 10) || 1);
    const rooms = $("otcRooms");
    if (rooms) rooms.value = String(computeRecommendedRooms(persons));
    updateRoomsHint(persons);
    render();
  });

  $("otcDays")?.addEventListener("input", () => {
    clearActivePreset();
    render();
  });

  $("otcNights")?.addEventListener("input", () => {
    clearActivePreset();
    render();
  });

  $("otcRooms")?.addEventListener("input", () => {
    clearActivePreset();
    render();
  });

  $("otcInsurance")?.addEventListener("change", () => {
    clearActivePreset();
    updateInsuranceField();
    render();
  });

  document.querySelectorAll('input[name="otcFlightClass"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      clearActivePreset();
      applyRegionSuggestion($("otcRegion")?.value || "japan", {
        replaceFlight: true,
        replaceHotel: false,
        replaceDaily: false,
        replaceInsurance: false,
      });
      render();
    });
  });

  document.querySelectorAll('input[name="otcHotelTier"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      clearActivePreset();
      applyRegionSuggestion($("otcRegion")?.value || "japan", {
        replaceFlight: false,
        replaceHotel: true,
        replaceDaily: false,
        replaceInsurance: false,
      });
      render();
    });
  });

  document.querySelectorAll('input[name="otcEmergencyRate"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      clearActivePreset();
      render();
    });
  });

  bindFormattedInputs();
}

function init() {
  applyDefaultState();
  bindEvents();

  if (!restoreFromUrl() && PRESETS[0]) {
    applyPreset(PRESETS[0].id);
  } else {
    render();
  }
}

document.addEventListener("DOMContentLoaded", init);
