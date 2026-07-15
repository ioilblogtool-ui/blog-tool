import { readParam, writeParams } from "./url-state.js";

(() => {
  const root = document.querySelector(".appfee-page");
  const dataEl = document.getElementById("appfee-data");
  if (!root || !dataEl) return;

  const cfg = JSON.parse(dataEl.textContent || "{}");

  const $ = (selector) => root.querySelector(selector);

  function num(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? Math.max(parsed, 0) : fallback;
  }

  function won(value) {
    return `${Math.round(value).toLocaleString("ko-KR")}원`;
  }

  // calcApplicationFee — collegeApplicationFeeCalculator2026.ts의 로직과 1:1 대응
  function calcApplicationFee(input) {
    const susiTotal = input.susiFee * input.susiCount;
    const jeongsiTotal = input.jeongsiFee * input.jeongsiCount;
    return { susiTotal, jeongsiTotal, grandTotal: susiTotal + jeongsiTotal };
  }

  function readState() {
    return {
      susiCount: num(document.getElementById("appfeeSusiCountSlider")?.value, cfg.defaultInput.susiCount),
      susiFee: num($('[data-appfee="susiFee"]')?.value, cfg.defaultInput.susiFee),
      jeongsiCount: num(document.getElementById("appfeeJeongsiCountSlider")?.value, cfg.defaultInput.jeongsiCount),
      jeongsiFee: num($('[data-appfee="jeongsiFee"]')?.value, cfg.defaultInput.jeongsiFee),
    };
  }

  function render() {
    const state = readState();
    const result = calcApplicationFee(state);

    $('[data-appfee-result="susiTotal"]').textContent = won(result.susiTotal);
    $('[data-appfee-result="jeongsiTotal"]').textContent = won(result.jeongsiTotal);
    $('[data-appfee-result="grandTotal"]').textContent = won(result.grandTotal);

    document.getElementById("appfeeSusiCountVal").textContent = `${state.susiCount}개`;
    document.getElementById("appfeeJeongsiCountVal").textContent = `${state.jeongsiCount}개`;

    writeParams({
      sc: state.susiCount,
      sf: state.susiFee,
      jc: state.jeongsiCount,
      jf: state.jeongsiFee,
    });
  }

  document.getElementById("appfeeSusiCountSlider")?.addEventListener("input", render);
  document.getElementById("appfeeJeongsiCountSlider")?.addEventListener("input", render);
  $('[data-appfee="susiFee"]')?.addEventListener("input", render);
  $('[data-appfee="jeongsiFee"]')?.addEventListener("input", render);

  document.querySelectorAll('input[name="appfeeSusiTier"]').forEach((el) => {
    el.addEventListener("change", () => {
      $('[data-appfee="susiFee"]').value = Number(el.dataset.appfeeFee).toLocaleString("ko-KR");
      render();
    });
  });
  document.querySelectorAll('input[name="appfeeJeongsiTier"]').forEach((el) => {
    el.addEventListener("change", () => {
      $('[data-appfee="jeongsiFee"]').value = Number(el.dataset.appfeeFee).toLocaleString("ko-KR");
      render();
    });
  });

  document.getElementById("appfeeResetBtn")?.addEventListener("click", () => {
    window.location.href = window.location.pathname;
  });
  document.getElementById("appfeeCopyBtn")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      const btn = document.getElementById("appfeeCopyBtn");
      if (btn) {
        const original = btn.textContent;
        btn.textContent = "링크 복사 완료";
        setTimeout(() => { btn.textContent = original; }, 1600);
      }
    } catch {
      // 클립보드 접근 실패 시 조용히 무시
    }
  });

  function restoreFromUrl() {
    const sc = readParam("sc", "");
    if (!sc) return;
    document.getElementById("appfeeSusiCountSlider").value = sc;
    $('[data-appfee="susiFee"]').value = num(readParam("sf", ""), cfg.defaultInput.susiFee).toLocaleString("ko-KR");
    document.getElementById("appfeeJeongsiCountSlider").value = readParam("jc", String(cfg.defaultInput.jeongsiCount));
    $('[data-appfee="jeongsiFee"]').value = num(readParam("jf", ""), cfg.defaultInput.jeongsiFee).toLocaleString("ko-KR");
  }

  restoreFromUrl();
  render();
})();
