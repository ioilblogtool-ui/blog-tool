(function () {
  const config = JSON.parse(
    document.getElementById("aic-config").textContent
  );
  const UNIT_PRICES = config.unitPrices;
  const AREA_MULTIPLIERS = config.areaMultipliers;
  const ITEMS_META = config.items;

  // 평수 → 계수 선형 보간
  function getAreaMultiplier(pyeong) {
    const t = AREA_MULTIPLIERS;
    if (pyeong <= t[0].pyeong) return t[0].multiplier;
    if (pyeong >= t[t.length - 1].pyeong) return t[t.length - 1].multiplier;
    for (let i = 0; i < t.length - 1; i++) {
      const a = t[i], b = t[i + 1];
      if (pyeong >= a.pyeong && pyeong <= b.pyeong) {
        const ratio = (pyeong - a.pyeong) / (b.pyeong - a.pyeong);
        return a.multiplier + ratio * (b.multiplier - a.multiplier);
      }
    }
    return 1;
  }

  function getUnitPrice(itemKey, subOption) {
    const prices = UNIT_PRICES[itemKey];
    if (!prices) return null;
    const key = subOption && prices[subOption] ? subOption : "default";
    return prices[key] || null;
  }

  function calcItem(itemKey, subOption, pyeong) {
    const unit = getUnitPrice(itemKey, subOption);
    if (!unit) return null;
    const mult = getAreaMultiplier(pyeong);
    return {
      min:  Math.round(unit.min  * mult / 10000) * 10000,
      mid:  Math.round(unit.mid  * mult / 10000) * 10000,
      high: Math.round(unit.high * mult / 10000) * 10000,
    };
  }

  function fmt(n) {
    return (n / 10000).toLocaleString() + "만 원";
  }

  function recalculate() {
    const pyeong = parseInt(document.getElementById("aic-pyeong").value);
    const selectedKeys = [...document.querySelectorAll(".aic-item-check:checked")]
      .map((el) => el.dataset.key);

    const subOptions = {};
    document.querySelectorAll(".aic-suboption-select").forEach((sel) => {
      subOptions[sel.dataset.key] = sel.value;
    });

    const emptyState = document.getElementById("aic-empty-state");
    const gradeCards = document.getElementById("aic-grade-cards");
    const breakdownSection = document.getElementById("aic-breakdown-section");

    if (selectedKeys.length === 0) {
      emptyState.style.display = "";
      gradeCards.style.display = "none";
      breakdownSection.style.display = "none";
      return;
    }

    emptyState.style.display = "none";
    gradeCards.style.display = "";
    breakdownSection.style.display = "";

    let total = { min: 0, mid: 0, high: 0 };
    const rows = [];

    ITEMS_META.forEach((meta) => {
      if (!selectedKeys.includes(meta.key)) return;
      const sub = subOptions[meta.key] || null;
      const r = calcItem(meta.key, sub, pyeong);
      if (!r) return;
      total.min  += r.min;
      total.mid  += r.mid;
      total.high += r.high;

      const subLabel = sub && meta.subOptions
        ? (meta.subOptions.find((o) => o.value === sub) || {}).label || ""
        : "";
      rows.push({ label: meta.label + (subLabel ? ` (${subLabel})` : ""), r });
    });

    // 카드
    document.getElementById("aic-result-min").textContent  = fmt(total.min);
    document.getElementById("aic-result-mid").textContent  = fmt(total.mid);
    document.getElementById("aic-result-high").textContent = fmt(total.high);
    document.getElementById("aic-per-min").textContent  = fmt(Math.round(total.min  / pyeong / 10000) * 10000);
    document.getElementById("aic-per-mid").textContent  = fmt(Math.round(total.mid  / pyeong / 10000) * 10000);
    document.getElementById("aic-per-high").textContent = fmt(Math.round(total.high / pyeong / 10000) * 10000);

    // 합계 행
    document.getElementById("aic-total-min").textContent  = fmt(total.min);
    document.getElementById("aic-total-mid").textContent  = fmt(total.mid);
    document.getElementById("aic-total-high").textContent = fmt(total.high);

    // 분해 테이블
    document.getElementById("aic-breakdown-body").innerHTML = rows.map((row) =>
      `<tr>
        <td>${row.label}</td>
        <td class="aic-col-min">${fmt(row.r.min)}</td>
        <td class="aic-col-mid">${fmt(row.r.mid)}</td>
        <td class="aic-col-high">${fmt(row.r.high)}</td>
      </tr>`
    ).join("");

    updateShareUrl();
  }

  function toggleSubOption(key, show) {
    const el = document.querySelector(`.aic-suboption[data-for="${key}"]`);
    if (el) el.classList.toggle("is-visible", show);
  }

  function updateShareUrl() {
    const pyeong = document.getElementById("aic-pyeong").value;
    const selected = [...document.querySelectorAll(".aic-item-check:checked")]
      .map((el) => el.dataset.key).join(",");
    const subOptions = {};
    document.querySelectorAll(".aic-suboption-select").forEach((sel) => {
      subOptions[sel.dataset.key] = sel.value;
    });
    const params = new URLSearchParams({ pyeong, items: selected });
    Object.entries(subOptions).forEach(([k, v]) => params.set(k, v));
    history.replaceState(null, "", `${location.pathname}?${params.toString()}`);
  }

  function updatePyeongDisplay(pyeong) {
    document.getElementById("aic-pyeong-display").textContent = pyeong;
    document.getElementById("aic-sqm-display").textContent = Math.round(pyeong * 3.3 * 0.75);
  }

  function restoreFromUrl() {
    const params = new URLSearchParams(location.search);
    if (params.has("pyeong")) {
      const v = parseInt(params.get("pyeong"));
      document.getElementById("aic-pyeong").value = v;
      updatePyeongDisplay(v);
    }
    if (params.has("items") && params.get("items")) {
      const keys = params.get("items").split(",");
      document.querySelectorAll(".aic-item-check").forEach((cb) => {
        const on = keys.includes(cb.dataset.key);
        cb.checked = on;
        toggleSubOption(cb.dataset.key, on);
      });
    }
    document.querySelectorAll(".aic-suboption-select").forEach((sel) => {
      if (params.has(sel.dataset.key)) sel.value = params.get(sel.dataset.key);
    });
  }

  // 이벤트
  document.getElementById("aic-pyeong").addEventListener("input", (e) => {
    updatePyeongDisplay(parseInt(e.target.value));
    recalculate();
  });

  document.querySelectorAll(".aic-item-check").forEach((cb) => {
    cb.addEventListener("change", (e) => {
      toggleSubOption(e.target.dataset.key, e.target.checked);
      recalculate();
    });
  });

  document.querySelectorAll(".aic-suboption-select").forEach((sel) => {
    sel.addEventListener("change", recalculate);
  });

  // 초기화 버튼
  const resetBtn = document.getElementById("aic-reset");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      document.getElementById("aic-pyeong").value = 24;
      updatePyeongDisplay(24);
      document.querySelectorAll(".aic-item-check").forEach((cb) => {
        const defaultOn = ["wallpaper", "floor", "lighting"].includes(cb.dataset.key);
        cb.checked = defaultOn;
        toggleSubOption(cb.dataset.key, defaultOn);
      });
      document.querySelectorAll(".aic-suboption-select").forEach((sel) => {
        const meta = config.items.find((i) => i.key === sel.dataset.key);
        if (meta && meta.defaultSubOption) sel.value = meta.defaultSubOption;
      });
      recalculate();
    });
  }

  restoreFromUrl();
  recalculate();
})();
