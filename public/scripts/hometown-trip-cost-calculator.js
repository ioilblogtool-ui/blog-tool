(() => {
  const root = document.querySelector(".htc-page");
  const dataEl = document.getElementById("htc-data");
  if (!root || !dataEl) return;

  const DATA = JSON.parse(dataEl.textContent || "{}");
  const routes = DATA.routes || [];
  const carDefaults = DATA.carDefaults || {};
  const trafficScenarios = DATA.trafficScenarios || {};
  const defaultInput = DATA.defaultInput || {};
  let state = { ...defaultInput };

  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => Array.from(root.querySelectorAll(selector));

  function num(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? Math.max(0, parsed) : fallback;
  }

  function won(value) {
    return `${Math.round(value || 0).toLocaleString("ko-KR")}원`;
  }

  function durationLabel(minutes) {
    return `${Math.floor(minutes / 60)}시간 ${Math.round(minutes % 60)}분`;
  }

  function getRoute() {
    return routes.find((r) => r.id === state.routeId) || routes[0];
  }

  function calcLocalTransit() {
    const oneWayMinutes = state.homeToStationMinutes + state.stationToDestMinutes;
    const oneWayCost = state.homeToStationCost + state.stationToDestCost;
    return { roundTripMinutes: oneWayMinutes * 2, roundTripCostPerPerson: oneWayCost * 2 };
  }

  function calcTrainMode(train) {
    if (!train) return null;
    const local = calcLocalTransit();
    const fareCost = train.fareOneWay * 2 * state.adultCount + train.childFareOneWay * 2 * state.childCount;
    const totalPassengers = state.adultCount + state.childCount;
    const localTransitCost = local.roundTripCostPerPerson * totalPassengers;
    const totalCost = fareCost + localTransitCost;
    return {
      fareCost,
      localTransitCost,
      totalCost,
      perPersonCost: totalPassengers > 0 ? Math.round(totalCost / totalPassengers) : 0,
      rideDurationMin: train.durationMin,
      totalDurationMin: train.durationMin + local.roundTripMinutes,
    };
  }

  function calcBusMode(route) {
    const fareOneWay = state.busTier === "premium" ? route.busPremiumFareOneWay : route.busGeneralFareOneWay;
    const local = calcLocalTransit();
    const totalPassengers = state.adultCount + state.childCount;
    const fareCost = fareOneWay * 2 * totalPassengers;
    const localTransitCost = local.roundTripCostPerPerson * totalPassengers;
    const totalCost = fareCost + localTransitCost;
    return {
      fareCost,
      localTransitCost,
      totalCost,
      perPersonCost: totalPassengers > 0 ? Math.round(totalCost / totalPassengers) : 0,
      rideDurationMin: route.busDurationMin,
      totalDurationMin: route.busDurationMin + local.roundTripMinutes,
    };
  }

  function calcCarMode(route) {
    const fuelNeeded = (route.distanceKm * 2) / state.fuelEfficiencyKmPerLiter;
    const fuelCost = Math.round(fuelNeeded * state.fuelPricePerLiter);
    const tollCost = state.tollFreeAssumption ? 0 : route.tollOneWay * 2;
    const cashCost = fuelCost + tollCost + state.parkingCost;
    const maintenanceCost = state.includeVehicleMaintenance ? Math.round(route.distanceKm * 2 * state.maintenanceCostPerKm) : 0;
    const totalCost = cashCost + maintenanceCost;
    const totalPassengers = Math.max(state.adultCount + state.childCount, 1);
    const traffic = trafficScenarios[state.trafficScenario] || trafficScenarios.normal;

    return {
      cashCost,
      totalCost,
      perPersonCost: Math.round(totalCost / totalPassengers),
      durationMinLow: Math.round(route.carDurationMin * traffic.multiplierMin),
      durationMinHigh: Math.round(route.carDurationMin * traffic.multiplierMax),
    };
  }

  function calcBreakeven(route, cheapestPublicLabel) {
    const fareOneWay = cheapestPublicLabel === "KTX" ? route.ktx?.fareOneWay
      : cheapestPublicLabel === "SRT" ? route.srt?.fareOneWay
      : (state.busTier === "premium" ? route.busPremiumFareOneWay : route.busGeneralFareOneWay);
    if (fareOneWay === undefined) return null;
    const local = calcLocalTransit();
    for (let n = 1; n <= 8; n++) {
      const testCarInput = { ...state, adultCount: n, childCount: 0 };
      const savedState = state;
      state = testCarInput;
      const testCar = calcCarMode(route);
      state = savedState;
      const testPublicTotal = fareOneWay * 2 * n + local.roundTripCostPerPerson * n;
      if (testCar.totalCost <= testPublicTotal) return n;
    }
    return null;
  }

  function calculate() {
    const route = getRoute();
    const ktx = calcTrainMode(route.ktx);
    const srt = calcTrainMode(route.srt);
    const bus = calcBusMode(route);
    const car = calcCarMode(route);

    const candidates = [];
    if (ktx) candidates.push({ label: "KTX", cost: ktx.totalCost, duration: ktx.totalDurationMin });
    if (srt) candidates.push({ label: "SRT", cost: srt.totalCost, duration: srt.totalDurationMin });
    candidates.push({ label: "고속버스", cost: bus.totalCost, duration: bus.totalDurationMin });
    candidates.push({ label: "자가용", cost: car.totalCost, duration: (car.durationMinLow + car.durationMinHigh) / 2 });

    const cheapest = candidates.reduce((a, b) => (b.cost < a.cost ? b : a));
    const fastest = candidates.reduce((a, b) => (b.duration < a.duration ? b : a));
    const cheapestPublic = candidates.filter((c) => c.label !== "자가용").reduce((a, b) => (b.cost < a.cost ? b : a), candidates[0]);

    const breakevenPassengers = calcBreakeven(route, cheapestPublic.label);

    return { route, ktx, srt, bus, car, cheapestLabel: cheapest.label, fastestLabel: fastest.label, breakevenPassengers };
  }

  function setText(selector, value) {
    const el = $(selector);
    if (el) el.textContent = value;
  }

  function readInputs() {
    state.adultCount = Math.min(Math.max(num($('[data-htc-input="adultCount"]')?.value, state.adultCount), 1), 8);
    state.childCount = Math.min(Math.max(num($('[data-htc-input="childCount"]')?.value, state.childCount), 0), 6);
    state.homeToStationMinutes = num($('[data-htc-input="homeToStationMinutes"]')?.value, state.homeToStationMinutes);
    state.homeToStationCost = num($('[data-htc-input="homeToStationCost"]')?.value, state.homeToStationCost);
    state.stationToDestMinutes = num($('[data-htc-input="stationToDestMinutes"]')?.value, state.stationToDestMinutes);
    state.stationToDestCost = num($('[data-htc-input="stationToDestCost"]')?.value, state.stationToDestCost);
    state.busTier = $('[data-htc-input="busTier"]')?.value || state.busTier;
    const carTypeEl = $('[data-htc-input="carType"]');
    if (carTypeEl) {
      state.carType = carTypeEl.value;
      state.fuelEfficiencyKmPerLiter = carDefaults[state.carType]?.fuelEfficiencyKmPerLiter ?? state.fuelEfficiencyKmPerLiter;
    }
    state.fuelPricePerLiter = num($('[data-htc-input="fuelPricePerLiter"]')?.value, state.fuelPricePerLiter);
    state.parkingCost = num($('[data-htc-input="parkingCost"]')?.value, state.parkingCost);
    state.trafficScenario = $('[data-htc-input="trafficScenario"]')?.value || state.trafficScenario;
    state.tollFreeAssumption = Boolean($('[data-htc-input="tollFreeAssumption"]')?.checked);
    state.includeVehicleMaintenance = Boolean($('[data-htc-input="includeVehicleMaintenance"]')?.checked);
    state.maintenanceCostPerKm = num($('[data-htc-input="maintenanceCostPerKm"]')?.value, state.maintenanceCostPerKm);
  }

  function syncInputs() {
    const el = (name) => $(`[data-htc-input="${name}"]`);
    if (el("adultCount")) el("adultCount").value = state.adultCount;
    if (el("childCount")) el("childCount").value = state.childCount;
    if (el("homeToStationMinutes")) el("homeToStationMinutes").value = state.homeToStationMinutes;
    if (el("homeToStationCost") && document.activeElement !== el("homeToStationCost")) el("homeToStationCost").value = Math.round(state.homeToStationCost).toLocaleString("ko-KR");
    if (el("stationToDestMinutes")) el("stationToDestMinutes").value = state.stationToDestMinutes;
    if (el("stationToDestCost") && document.activeElement !== el("stationToDestCost")) el("stationToDestCost").value = Math.round(state.stationToDestCost).toLocaleString("ko-KR");
    if (el("busTier")) el("busTier").value = state.busTier;
    if (el("carType")) el("carType").value = state.carType;
    if (el("fuelPricePerLiter") && document.activeElement !== el("fuelPricePerLiter")) el("fuelPricePerLiter").value = Math.round(state.fuelPricePerLiter).toLocaleString("ko-KR");
    if (el("parkingCost") && document.activeElement !== el("parkingCost")) el("parkingCost").value = Math.round(state.parkingCost).toLocaleString("ko-KR");
    if (el("trafficScenario")) el("trafficScenario").value = state.trafficScenario;
    if (el("tollFreeAssumption")) el("tollFreeAssumption").checked = state.tollFreeAssumption;
    if (el("includeVehicleMaintenance")) el("includeVehicleMaintenance").checked = state.includeVehicleMaintenance;
    if (el("maintenanceCostPerKm")) el("maintenanceCostPerKm").value = state.maintenanceCostPerKm;

    const maintenanceField = $("[data-htc-maintenance-field]");
    if (maintenanceField) maintenanceField.hidden = !state.includeVehicleMaintenance;
  }

  function render() {
    readInputs();
    const result = calculate();

    setText('[data-htc-result="routeLabel"]', `${result.route.label} · 왕복·문전 기준`);

    const ktxCard = $('[data-htc-mode="KTX"]');
    if (ktxCard) {
      ktxCard.hidden = !result.ktx;
      if (result.ktx) {
        setText('[data-htc-result="ktx.totalCost"]', won(result.ktx.totalCost));
        setText('[data-htc-result="ktx.perPersonCost"]', `1인당 ${won(result.ktx.perPersonCost)}`);
        setText('[data-htc-result="ktx.totalDurationMin"]', `문전 총 ${durationLabel(result.ktx.totalDurationMin)}`);
      }
    }
    const srtCard = $('[data-htc-mode="SRT"]');
    if (srtCard) {
      srtCard.hidden = !result.srt;
      if (result.srt) {
        setText('[data-htc-result="srt.totalCost"]', won(result.srt.totalCost));
        setText('[data-htc-result="srt.perPersonCost"]', `1인당 ${won(result.srt.perPersonCost)}`);
        setText('[data-htc-result="srt.totalDurationMin"]', `문전 총 ${durationLabel(result.srt.totalDurationMin)}`);
      }
    }
    setText('[data-htc-result="bus.totalCost"]', won(result.bus.totalCost));
    setText('[data-htc-result="bus.perPersonCost"]', `1인당 ${won(result.bus.perPersonCost)}`);
    setText('[data-htc-result="bus.totalDurationMin"]', `문전 총 ${durationLabel(result.bus.totalDurationMin)}`);
    setText('[data-htc-result="car.totalCost"]', won(result.car.totalCost));
    setText('[data-htc-result="car.perPersonCost"]', `1인당 ${won(result.car.perPersonCost)}`);
    setText('[data-htc-result="car.duration"]', `${durationLabel(result.car.durationMinLow)} ~ ${durationLabel(result.car.durationMinHigh)}`);
    setText('[data-htc-result="sourceNote"]', result.route.sourceNote);
    setText(
      '[data-htc-result="breakeven"]',
      result.breakevenPassengers
        ? `성인 ${result.breakevenPassengers}명 이상이면 자가용이 대중교통보다 저렴해질 수 있습니다.`
        : "현재 조건에서는 인원이 늘어도 자가용이 더 저렴해지지 않습니다."
    );

    $$("[data-htc-mode]").forEach((card) => {
      card.classList.toggle("is-cheapest", card.dataset.htcMode === result.cheapestLabel);
      card.classList.toggle("is-fastest", card.dataset.htcMode === result.fastestLabel);
    });

    $$("[data-htc-route]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.htcRoute === state.routeId);
    });

    syncInputs();
    syncUrl();
  }

  function syncUrl() {
    const params = new URLSearchParams();
    params.set("route", state.routeId);
    params.set("adults", String(state.adultCount));
    params.set("children", String(state.childCount));
    params.set("bus", state.busTier);
    params.set("car", state.carType);
    params.set("traffic", state.trafficScenario);
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  }

  function restoreFromUrl() {
    const params = new URLSearchParams(window.location.search);
    if (!params.size) return;
    const routeId = params.get("route");
    if (routeId && routes.some((r) => r.id === routeId)) state.routeId = routeId;
    state.adultCount = num(params.get("adults"), state.adultCount);
    state.childCount = num(params.get("children"), state.childCount);
    if (params.get("bus")) state.busTier = params.get("bus");
    const carType = params.get("car");
    if (carType && carDefaults[carType]) {
      state.carType = carType;
      state.fuelEfficiencyKmPerLiter = carDefaults[carType].fuelEfficiencyKmPerLiter;
    }
    if (params.get("traffic") && trafficScenarios[params.get("traffic")]) state.trafficScenario = params.get("traffic");
    syncInputs();
  }

  function bindEvents() {
    $$("[data-htc-input]").forEach((input) => {
      input.addEventListener("input", render);
      input.addEventListener("change", render);
      input.addEventListener("blur", () => {
        if (["homeToStationCost", "stationToDestCost", "fuelPricePerLiter", "parkingCost"].includes(input.dataset.htcInput)) {
          input.value = num(input.value).toLocaleString("ko-KR");
        }
        render();
      });
    });

    $$("[data-htc-route]").forEach((button) => {
      button.addEventListener("click", () => {
        state.routeId = button.dataset.htcRoute;
        syncInputs();
        render();
      });
    });

    document.getElementById("htcResetBtn")?.addEventListener("click", () => {
      state = { ...defaultInput };
      syncInputs();
      render();
    });

    document.getElementById("htcCopyBtn")?.addEventListener("click", async () => {
      const btn = document.getElementById("htcCopyBtn");
      try {
        await navigator.clipboard.writeText(window.location.href);
        if (btn) {
          const original = btn.textContent;
          btn.textContent = "링크 복사됨";
          setTimeout(() => {
            btn.textContent = original;
          }, 1600);
        }
      } catch {
        if (btn) btn.textContent = "복사 실패";
      }
    });
  }

  restoreFromUrl();
  bindEvents();
  render();
})();
