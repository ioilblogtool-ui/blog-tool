(() => {
  const root = document.querySelector("[data-reat-root]");
  if (!root) return;

  const configEl = document.getElementById("reatConfig");
  const config = JSON.parse(configEl?.textContent || "{}");
  const defaults = config.defaults || {};
  const won = new Intl.NumberFormat("ko-KR");

  const tabs = [...root.querySelectorAll("[data-reat-tab]")];
  const inputs = [...root.querySelectorAll("[data-reat-input]")];
  const out = (key) => document.querySelector(`[data-reat-output="${key}"]`);
  const field = (key) => root.querySelector(`[data-reat-field="${key}"]`);

  const PRICE_MIN = 1_000_000;
  const SIX_EOK = 600_000_000;
  const NINE_EOK = 900_000_000;

  function numeric(value, fallback = 0, min = 0) {
    const n = Number(String(value ?? "").replace(/[^\d.]/g, ""));
    if (!Number.isFinite(n) || n < min) return fallback;
    return n;
  }

  function money(value) {
    if (!Number.isFinite(value)) return "-";
    const rounded = Math.round(value);
    if (Math.abs(rounded) >= 100_000_000) {
      const eok = rounded / 100_000_000;
      return `${eok.toFixed(eok % 1 === 0 ? 0 : 1)}억원`;
    }
    return `${won.format(Math.round(rounded / 10_000))}만원`;
  }

  function moneyExact(value) {
    return `${won.format(Math.round(value))}원`;
  }

  function percent(rate) {
    const value = rate * 100;
    const digits = Math.abs(value - Math.round(value)) < 0.0001 ? 0 : 2;
    return `${value.toFixed(digits)}%`;
  }

  function currentType() {
    return root.querySelector("[data-reat-tab].is-active")?.dataset.reatTab || "buy";
  }

  function setType(type) {
    tabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.reatTab === type));
  }

  function read() {
    const get = (key) => root.querySelector(`[data-reat-input="${key}"]`);
    return {
      acquisitionType: currentType(),
      propertyType: get("propertyType")?.value || "housing",
      price: Math.max(numeric(get("price")?.value, defaults.price || 500_000_000, PRICE_MIN), PRICE_MIN),
      houseCountAfter: Number(get("houseCountAfter")?.value || 1),
      isAdjusted: Boolean(get("isAdjusted")?.checked),
      giftAppraisalPrice: numeric(get("giftAppraisalPrice")?.value, 0, 0),
      area: numeric(get("area")?.value, defaults.area || 84, 1),
    };
  }

  function normalRate(price) {
    if (price <= SIX_EOK) return 0.01;
    if (price <= NINE_EOK) return 0.01 + ((price - SIX_EOK) / (NINE_EOK - SIX_EOK)) * 0.02;
    return 0.03;
  }

  function acquisitionRate(input) {
    if (input.propertyType === "nonHousing") {
      if (input.acquisitionType === "inherit") return { rate: 0.023, kind: "nonHousingInherit" };
      if (input.acquisitionType === "gift") return { rate: 0.035, kind: "nonHousingGift" };
      return { rate: 0.04, kind: "nonHousingBuy" };
    }

    if (input.acquisitionType === "inherit") return { rate: 0.028, kind: "inherit" };

    if (input.acquisitionType === "gift") {
      const standardPrice = input.giftAppraisalPrice || input.price;
      if (input.isAdjusted && standardPrice >= 300_000_000) return { rate: 0.12, kind: "giftHeavy" };
      return { rate: 0.035, kind: "gift" };
    }

    if (input.houseCountAfter >= 4) return { rate: 0.12, kind: "heavy12" };
    if (input.houseCountAfter === 3) return { rate: input.isAdjusted ? 0.12 : 0.08, kind: input.isAdjusted ? "heavy12" : "heavy8" };
    if (input.houseCountAfter === 2 && input.isAdjusted) return { rate: 0.08, kind: "heavy8" };
    return { rate: normalRate(input.price), kind: "normal" };
  }

  function surtaxes(input, rateInfo, acquisitionTax) {
    const isHousing = input.propertyType === "housing";
    const isOver85 = isHousing && input.area > 85;
    const isHeavy8 = rateInfo.kind === "heavy8";
    const isHeavy12 = rateInfo.kind === "heavy12" || rateInfo.kind === "giftHeavy";

    if (isHeavy12) {
      return {
        localEducationTax: input.price * 0.004,
        localEducationBasis: "취득가액 × 0.4%",
        ruralSpecialTax: isOver85 ? input.price * 0.01 : 0,
        ruralBasis: isOver85 ? "취득가액 × 1.0%" : "85㎡ 이하 주택은 0원",
      };
    }

    if (isHeavy8) {
      return {
        localEducationTax: input.price * 0.004,
        localEducationBasis: "취득가액 × 0.4%",
        ruralSpecialTax: isOver85 ? input.price * 0.006 : 0,
        ruralBasis: isOver85 ? "취득가액 × 0.6%" : "85㎡ 이하 주택은 0원",
      };
    }

    return {
      localEducationTax: acquisitionTax * 0.1,
      localEducationBasis: "취득세 × 10%",
      ruralSpecialTax: isOver85 ? input.price * 0.002 : 0,
      ruralBasis: isOver85 ? "취득가액 × 0.2%" : isHousing ? "85㎡ 이하 주택은 0원" : "비주택은 별도 확인 필요",
    };
  }

  function notes(input, rateInfo) {
    const list = [];
    if (rateInfo.kind === "normal") {
      list.push("주택 유상거래 일반세율 1~3%를 적용했습니다.");
      if (input.price > SIX_EOK && input.price <= NINE_EOK) list.push("6억 초과~9억 이하 구간은 비례 세율로 계산했습니다.");
    }
    if (rateInfo.kind === "heavy8") list.push("중과세율 8% 구간으로 계산했습니다. 일시적 2주택 특례 여부는 별도 확인이 필요합니다.");
    if (rateInfo.kind === "heavy12") list.push("3주택 이상 또는 법인 등 12% 중과 가능 구간으로 계산했습니다.");
    if (rateInfo.kind === "giftHeavy") list.push("조정대상지역 내 공시가격 3억 원 이상 주택 증여 중과 가능 구간으로 계산했습니다.");
    if (input.propertyType === "nonHousing") list.push("비주택은 용도와 과세표준 판단이 달라질 수 있어 지자체 확인이 필요합니다.");
    if (input.area > 85 && input.propertyType === "housing") list.push("전용면적 85㎡ 초과 주택으로 농어촌특별세를 반영했습니다.");
    list.push("생애최초·출산가구·일시적 2주택 등 감면 특례는 자동 반영하지 않았습니다.");
    return list;
  }

  function calculate(input) {
    const rateInfo = acquisitionRate(input);
    const acquisitionTax = input.price * rateInfo.rate;
    const extra = surtaxes(input, rateInfo, acquisitionTax);
    const totalTax = acquisitionTax + extra.localEducationTax + extra.ruralSpecialTax;
    return {
      ...rateInfo,
      acquisitionTax,
      localEducationTax: extra.localEducationTax,
      localEducationBasis: extra.localEducationBasis,
      ruralSpecialTax: extra.ruralSpecialTax,
      ruralBasis: extra.ruralBasis,
      totalTax,
      notes: notes(input, rateInfo),
    };
  }

  function describe(input, result) {
    const typeLabel = { buy: "매매", gift: "증여", inherit: "상속" }[input.acquisitionType];
    const regionLabel = input.isAdjusted ? "조정대상지역" : "비조정지역";
    const propertyLabel = input.propertyType === "housing" ? `주택 ${input.houseCountAfter}채 기준` : "비주택";
    return `${money(input.price)} ${propertyLabel}을 ${typeLabel}(${regionLabel}, 전용 ${input.area}㎡)하는 경우 총 납부세액은 약 ${money(result.totalTax)}입니다.`;
  }

  function renderBreakdown(input, result) {
    const body = out("breakdown");
    if (!body) return;
    const rows = [
      ["취득세", `취득가액 × ${percent(result.rate)}`, result.acquisitionTax],
      ["지방교육세", result.localEducationBasis, result.localEducationTax],
      ["농어촌특별세", result.ruralBasis, result.ruralSpecialTax],
      ["합계", "취득세 + 지방교육세 + 농어촌특별세", result.totalTax],
    ];
    body.innerHTML = rows.map(([label, basis, amount], index) => `
      <tr class="${index === rows.length - 1 ? "reat-total-row" : ""}">
        <td>${label}</td>
        <td>${basis}</td>
        <td>${moneyExact(amount)}</td>
      </tr>
    `).join("");
  }

  function renderNotes(result) {
    const noteList = out("notes");
    if (!noteList) return;
    noteList.innerHTML = result.notes.map((note) => `<li>${note}</li>`).join("");
  }

  function render() {
    const input = read();
    const result = calculate(input);
    out("rate").textContent = percent(result.rate);
    out("rateNote").textContent = result.kind.includes("heavy") || result.kind === "giftHeavy" ? "중과 가능 구간" : "기본 세율 구간";
    out("acquisitionTax").textContent = money(result.acquisitionTax);
    out("localEducationTax").textContent = money(result.localEducationTax);
    out("localEducationNote").textContent = result.localEducationBasis;
    out("ruralSpecialTax").textContent = money(result.ruralSpecialTax);
    out("ruralNote").textContent = result.ruralBasis;
    out("totalTax").textContent = money(result.totalTax);
    out("message").textContent = describe(input, result);
    renderBreakdown(input, result);
    renderNotes(result);
    syncUrl(input);
  }

  function updateVisibility() {
    const input = read();
    const isHousing = input.propertyType === "housing";
    const isBuy = input.acquisitionType === "buy";
    const isGift = input.acquisitionType === "gift";
    field("count").hidden = !isHousing || !isBuy;
    field("adjusted").hidden = !isHousing || input.acquisitionType === "inherit";
    field("appraisal").hidden = !isHousing || !isGift || !input.isAdjusted;
    field("area").hidden = !isHousing;
  }

  function syncUrl(input) {
    try {
      const params = new URLSearchParams({
        type: input.acquisitionType,
        ptype: input.propertyType,
        price: String(input.price),
        count: String(input.houseCountAfter),
        adj: input.isAdjusted ? "1" : "0",
        area: String(input.area),
      });
      if (input.giftAppraisalPrice) params.set("appraisal", String(input.giftAppraisalPrice));
      history.replaceState(null, "", `${location.pathname}?${params.toString()}`);
    } catch (_) {}
  }

  function restoreFromUrl() {
    try {
      const params = new URLSearchParams(location.search);
      const type = params.get("type");
      if (["buy", "gift", "inherit"].includes(type)) setType(type);
      const setValue = (key, value) => {
        const el = root.querySelector(`[data-reat-input="${key}"]`);
        if (el && value != null) el.value = value;
      };
      setValue("propertyType", params.get("ptype"));
      if (params.has("price")) setValue("price", Number(params.get("price")).toLocaleString("ko-KR"));
      setValue("houseCountAfter", params.get("count"));
      const adjusted = root.querySelector('[data-reat-input="isAdjusted"]');
      if (adjusted && params.has("adj")) adjusted.checked = params.get("adj") === "1";
      if (params.has("area")) setValue("area", params.get("area"));
      if (params.has("appraisal")) setValue("giftAppraisalPrice", Number(params.get("appraisal")).toLocaleString("ko-KR"));
    } catch (_) {}
  }

  function reset() {
    setType(defaults.acquisitionType || "buy");
    root.querySelector('[data-reat-input="propertyType"]').value = defaults.propertyType || "housing";
    root.querySelector('[data-reat-input="price"]').value = Number(defaults.price || 500_000_000).toLocaleString("ko-KR");
    root.querySelector('[data-reat-input="houseCountAfter"]').value = String(defaults.houseCountAfter || 1);
    root.querySelector('[data-reat-input="isAdjusted"]').checked = Boolean(defaults.isAdjusted);
    root.querySelector('[data-reat-input="giftAppraisalPrice"]').value = "";
    root.querySelector('[data-reat-input="area"]').value = String(defaults.area || 84);
    updateVisibility();
    render();
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      setType(tab.dataset.reatTab);
      updateVisibility();
      render();
    });
  });

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      if (input.dataset.reatInput === "price" || input.dataset.reatInput === "giftAppraisalPrice") {
        const value = numeric(input.value, 0, 0);
        input.value = value ? value.toLocaleString("ko-KR") : "";
      }
      updateVisibility();
      render();
    });
    input.addEventListener("change", () => {
      updateVisibility();
      render();
    });
  });

  root.querySelectorAll("[data-reat-price]").forEach((button) => {
    button.addEventListener("click", () => {
      const price = Number(button.dataset.reatPrice);
      root.querySelector('[data-reat-input="price"]').value = price.toLocaleString("ko-KR");
      render();
    });
  });

  document.getElementById("resetReatBtn")?.addEventListener("click", reset);
  document.getElementById("copyReatLinkBtn")?.addEventListener("click", () => {
    render();
    navigator.clipboard?.writeText(location.href);
  });

  restoreFromUrl();
  updateVisibility();
  render();
})();
