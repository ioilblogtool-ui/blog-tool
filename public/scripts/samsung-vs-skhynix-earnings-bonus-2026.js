(function () {
  const payloadScript = document.getElementById("sevbPayload");
  if (!payloadScript) return;
  const payload = JSON.parse(payloadScript.textContent || "{}");
  const { hynixRankPresets, samsungRankPresets, samsungDivisions, psMultipliersByYear } = payload;

  const hynixRankSelect = document.getElementById("sevbHynixRank");
  const samsungRankSelect = document.getElementById("sevbSamsungRank");
  const samsungDivisionSelect = document.getElementById("sevbSamsungDivision");
  const yearSelect = document.getElementById("sevbYear");
  const scenarioSelect = document.getElementById("sevbScenario");

  if (!hynixRankSelect || !samsungRankSelect || !samsungDivisionSelect || !yearSelect || !scenarioSelect) return;

  const scenarioKeyMap = { CONSERVATIVE: "conservative", BASE: "base", AGGRESSIVE: "aggressive" };

  function scenarioLabel(code) {
    return code === "CONSERVATIVE" ? "보수적" : code === "BASE" ? "기준" : "공격적";
  }

  function calcHynix() {
    const rank = hynixRankPresets.find((r) => r.code === hynixRankSelect.value);
    const yearData = psMultipliersByYear[yearSelect.value];
    const rate = yearData[scenarioKeyMap[scenarioSelect.value]];
    const bonus = Math.round((rank.defaultSalary * rate) / 100);
    document.getElementById("sevbHynixResult").textContent = bonus.toLocaleString("ko-KR") + "원";
    document.getElementById("sevbHynixRate").textContent = "PS " + rate + "% · " + scenarioLabel(scenarioSelect.value);
  }

  function calcSamsung() {
    const rank = samsungRankPresets.find((r) => r.code === samsungRankSelect.value);
    const division = samsungDivisions.find((d) => d.code === samsungDivisionSelect.value);
    const scenarioKey = scenarioSelect.value;
    const rateFraction =
      scenarioKey === "CONSERVATIVE"
        ? division.scenarioRates.CONSERVATIVE
        : scenarioKey === "BASE"
          ? division.scenarioRates.BASE
          : division.scenarioRates.AGGRESSIVE;
    const ratePercent = rateFraction * 100;
    const bonus = Math.round((rank.defaultSalary * ratePercent) / 100);
    document.getElementById("sevbSamsungResult").textContent = bonus.toLocaleString("ko-KR") + "원";
    document.getElementById("sevbSamsungRate").textContent = "OPI " + ratePercent.toFixed(1) + "% · " + scenarioLabel(scenarioKey);
  }

  function recalcAll() {
    calcHynix();
    calcSamsung();
  }

  [hynixRankSelect, samsungRankSelect, samsungDivisionSelect, yearSelect, scenarioSelect].forEach((el) => {
    el.addEventListener("change", recalcAll);
  });

  recalcAll();
})();
