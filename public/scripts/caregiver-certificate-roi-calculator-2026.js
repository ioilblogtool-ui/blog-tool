(() => {
  const root = document.querySelector(".ccrc-page");
  if (!root) return;

  const $ = (selector) => root.querySelector(selector);

  const TRACKS = {
    STANDARD: { hours: 320 },
    NURSE: { hours: 40 },
    LICENSED_50H: { hours: 50 },
  };

  function num(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? Math.max(parsed, 0) : fallback;
  }

  function won(value) {
    return `${Math.round(value).toLocaleString("ko-KR")}원`;
  }

  function getTrack() {
    return document.querySelector('input[name="ccrcTrack"]:checked')?.value || "STANDARD";
  }

  function render() {
    const educationCost = num($('[data-ccrc="educationCost"]').value, 500000);
    const dailyStudyHours = num($('[data-ccrc="dailyStudyHours"]').value, 4);
    const expectedMonthlyPay = num($('[data-ccrc="expectedMonthlyPay"]').value, 1800000);
    const currentMonthlyPay = num($('[data-ccrc="currentMonthlyPay"]').value, 1000000);
    const track = getTrack();

    const hours = TRACKS[track]?.hours ?? 320;
    const studyDays = Math.ceil(hours / Math.max(dailyStudyHours, 1));
    const additionalIncome = Math.max(expectedMonthlyPay - currentMonthlyPay, 0);
    const roiMonths = additionalIncome > 0 ? educationCost / additionalIncome : null;

    const set = (key, value) => {
      const el = $(`[data-ccrc-result="${key}"]`);
      if (el) el.textContent = value;
    };
    set("roiMonths", roiMonths !== null ? `약 ${roiMonths.toFixed(1)}개월` : "추가 수입 없음");
    set("additionalIncome", won(additionalIncome));
    set("studyDays", `${studyDays}일`);
  }

  const costInput = $('[data-ccrc="educationCost"]');
  const costSlider = $('[data-ccrc-slider="educationCost"]');
  const costVal = $('[data-ccrc-slider-val="educationCost"]');

  function syncCostSlider() {
    const val = Math.min(Math.max(num(costInput.value, 500000), 0), 2000000);
    costSlider.value = String(val);
    costVal.textContent = `${Math.round(val / 10000).toLocaleString("ko-KR")}만원`;
  }
  costInput.addEventListener("input", () => { syncCostSlider(); render(); });
  costSlider.addEventListener("input", () => {
    costInput.value = Number(costSlider.value).toLocaleString("ko-KR");
    syncCostSlider();
    render();
  });

  root.querySelectorAll('input[name="ccrcTrack"]').forEach((el) => el.addEventListener("change", render));
  ["dailyStudyHours", "expectedMonthlyPay", "currentMonthlyPay"].forEach((key) => {
    $(`[data-ccrc="${key}"]`)?.addEventListener("input", render);
  });

  document.getElementById("ccrcResetBtn")?.addEventListener("click", () => {
    window.location.href = window.location.pathname;
  });
  document.getElementById("ccrcCopyBtn")?.addEventListener("click", async () => {
    await navigator.clipboard.writeText(window.location.href);
  });

  syncCostSlider();
  render();
})();
