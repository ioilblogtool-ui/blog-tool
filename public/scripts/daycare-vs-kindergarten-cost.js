(function () {
  "use strict";

  const configEl = document.getElementById("dkConfig");
  if (!configEl) return;

  let CONFIG;
  try {
    CONFIG = JSON.parse(configEl.textContent || "{}");
  } catch (error) {
    console.error("[daycare-kindergarten] config parse error", error);
    return;
  }

  const state = {
    age: 3,
    region: "seoul",
    household: "dual",
    daycareType: "public",
    kindergartenType: "private",
    overrides: {
      daycareSpecial: null,
      daycareHidden: null,
      kindergartenAfterschool: null,
      kindergartenHidden: null,
    },
  };

  const $ = (id) => document.getElementById(id);

  function formatKRW(amount) {
    if (amount == null || Number.isNaN(amount)) return "-";
    const sign = amount < 0 ? "-" : "";
    const abs = Math.abs(Math.round(amount));
    if (abs >= 100000000) {
      const uk = abs / 100000000;
      return `${sign}${uk % 1 === 0 ? uk.toFixed(0) : uk.toFixed(1)}억 원`;
    }
    if (abs >= 10000) {
      return `${sign}${Math.round(abs / 10000).toLocaleString()}만 원`;
    }
    return `${sign}${abs.toLocaleString()}원`;
  }

  function formatKRWFull(amount) {
    if (amount == null || Number.isNaN(amount)) return "-";
    return `${Math.max(0, Math.round(amount)).toLocaleString()}원`;
  }

  function findBy(list, key, value) {
    return list.find((item) => item[key] === value);
  }

  function supportForAge() {
    return findBy(CONFIG.AGE_SUPPORT_TABLE, "age", state.age) || CONFIG.AGE_SUPPORT_TABLE[0];
  }

  function daycareProfile() {
    return findBy(CONFIG.DAYCARE_COST_PROFILES, "type", state.daycareType) || CONFIG.DAYCARE_COST_PROFILES[0];
  }

  function kindergartenProfile() {
    return findBy(CONFIG.KINDERGARTEN_COST_PROFILES, "type", state.kindergartenType) || CONFIG.KINDERGARTEN_COST_PROFILES[0];
  }

  function kindergartenEducationSupport(ageSupport) {
    if (state.kindergartenType === "public") {
      return ageSupport.eligible && state.age >= 3 && state.age <= 5 ? 100000 : 0;
    }
    return ageSupport.kindergartenEducation || 0;
  }

  function calcDaycare() {
    const support = supportForAge();
    const profile = daycareProfile();
    const baseGross = profile.baseByAge[state.age] || 0;
    const baseSupport = Math.min(baseGross, support.daycareVoucher || 0);
    const baseNet = Math.max(0, baseGross - baseSupport);
    const estimatedSpecial = profile.specialActivity[state.region] || 0;
    const estimatedHidden =
      (profile.mealSnack[state.region] || 0) +
      (profile.vehicle[state.region] || 0) +
      (profile.extendedCare[state.household] || 0);
    const special = state.overrides.daycareSpecial ?? estimatedSpecial;
    const hidden = state.overrides.daycareHidden ?? estimatedHidden;
    const discount = Math.round((special + hidden) * (profile.discountRate || 0));
    const monthly = Math.max(0, baseNet + special + hidden - discount);

    return {
      label: profile.label,
      monthly,
      annual: monthly * 12,
      baseGross,
      baseSupport,
      baseNet,
      special,
      hidden,
      discount,
      note: profile.note,
    };
  }

  function calcKindergarten() {
    const support = supportForAge();
    const profile = kindergartenProfile();
    const available = state.age >= 3;
    const baseGross = available ? profile.baseTuition[state.region] || 0 : 0;
    const educationSupport = Math.min(baseGross, kindergartenEducationSupport(support));
    const baseNet = Math.max(0, baseGross - educationSupport);
    const estimatedAfterschool = available ? profile.afterschool[state.region] || 0 : 0;
    const estimatedHidden = available
      ? (profile.mealSnack[state.region] || 0) +
        (profile.vehicle[state.region] || 0) +
        (profile.materials[state.region] || 0)
      : 0;
    const afterschool = state.overrides.kindergartenAfterschool ?? estimatedAfterschool;
    const afterschoolSupport = Math.min(
      afterschool,
      state.kindergartenType === "public"
        ? support.kindergartenAfterschool.public || 0
        : support.kindergartenAfterschool.private || 0
    );
    const afterschoolNet = Math.max(0, afterschool - afterschoolSupport);
    const hidden = state.overrides.kindergartenHidden ?? estimatedHidden;
    const discount = Math.round((afterschoolNet + hidden) * (profile.discountRate || 0));
    const monthly = Math.max(0, baseNet + afterschoolNet + hidden - discount);

    return {
      label: profile.label,
      available,
      monthly,
      annual: monthly * 12,
      baseGross,
      educationSupport,
      baseNet,
      afterschool,
      afterschoolSupport,
      afterschoolNet,
      hidden,
      discount,
      note: profile.note,
    };
  }

  function setText(id, value) {
    const el = $(id);
    if (el) el.textContent = value;
  }

  function row(label, value, basis) {
    return `
      <div class="dk-breakdown-row">
        <dt>${label}</dt>
        <dd>
          <strong>${value}</strong>
          ${basis ? `<span>${basis}</span>` : ""}
        </dd>
      </div>
    `;
  }

  function renderBreakdown(daycare, kindergarten) {
    const daycareEl = $("dkDaycareBreakdown");
    const kindergartenEl = $("dkKindergartenBreakdown");
    if (daycareEl) {
      daycareEl.innerHTML = [
        row("기본 보육료", formatKRWFull(daycare.baseGross), "공식·수납 기준"),
        row("보육료 지원", `-${formatKRWFull(daycare.baseSupport)}`, "공식"),
        row("기본료 차액", formatKRWFull(daycare.baseNet), "실부담"),
        row("특별활동비", formatKRWFull(daycare.special), "추정 또는 직접입력"),
        row("급식·간식·차량·연장", formatKRWFull(daycare.hidden), "추정 또는 직접입력"),
        daycare.discount > 0 ? row("복지 절감", `-${formatKRWFull(daycare.discount)}`, "추정") : "",
      ].join("");
    }

    if (kindergartenEl) {
      kindergartenEl.innerHTML = kindergarten.available
        ? [
            row("교육과정 원비", formatKRWFull(kindergarten.baseGross), "기관 유형 추정"),
            row("유아학비 지원", `-${formatKRWFull(kindergarten.educationSupport)}`, "공식"),
            row("교육과정 차액", formatKRWFull(kindergarten.baseNet), "실부담"),
            row("방과후·특성화", formatKRWFull(kindergarten.afterschool), "추정 또는 직접입력"),
            row("방과후 지원", `-${formatKRWFull(kindergarten.afterschoolSupport)}`, "공식"),
            row("급식·차량·교재", formatKRWFull(kindergarten.hidden), "추정 또는 직접입력"),
          ].join("")
        : row("유치원 비교", "대상 아님", "만 3세부터 현실 비교 권장");
    }
  }

  function renderBars(daycare, kindergarten) {
    const max = Math.max(daycare.monthly, kindergarten.monthly, 1);
    const daycareWidth = Math.max(4, Math.round((daycare.monthly / max) * 100));
    const kindergartenWidth = Math.max(4, Math.round((kindergarten.monthly / max) * 100));
    const daycareBar = $("dkDaycareBar");
    const kindergartenBar = $("dkKindergartenBar");
    if (daycareBar) daycareBar.style.width = `${daycareWidth}%`;
    if (kindergartenBar) kindergartenBar.style.width = `${kindergartenWidth}%`;
    setText("dkDaycareBarValue", formatKRW(daycare.monthly));
    setText("dkKindergartenBarValue", kindergarten.available ? formatKRW(kindergarten.monthly) : "비교 대상 아님");
  }

  function renderInsight(daycare, kindergarten) {
    const support = supportForAge();
    const insight = $("dkInsight");
    if (!insight) return;

    const diff = kindergarten.monthly - daycare.monthly;
    const diffAbs = Math.abs(diff);
    const winnerText =
      !kindergarten.available
        ? "현재 나이에서는 유치원보다 어린이집 중심으로 보는 것이 현실적입니다."
        : diff > 0
          ? `입력값 기준 유치원이 어린이집보다 월 ${formatKRW(diffAbs)} 더 비쌉니다.`
          : diff < 0
            ? `입력값 기준 유치원이 어린이집보다 월 ${formatKRW(diffAbs)} 더 저렴합니다.`
            : "입력값 기준 두 선택지의 월 실부담금이 거의 같습니다.";

    const householdText =
      state.household === "dual"
        ? "맞벌이 가정은 운영 시간, 등하원 거리, 연장보육·방과후 가능 여부를 비용과 함께 봐야 합니다."
        : "외벌이 가정은 기본 시간 이용만으로 충분한지, 방학 중 돌봄 공백이 생기는지까지 확인하세요.";

    insight.innerHTML = `
      <p>${winnerText}</p>
      <p>${support.note}</p>
      <p>${householdText}</p>
      <p>특별활동비와 방과후 과정비는 기관별 고지서 차이가 커서, 실제 후보 기관의 안내문을 받으면 직접 조정값에 넣어 다시 계산하는 것이 가장 정확합니다.</p>
    `;
  }

  function render() {
    const daycare = calcDaycare();
    const kindergarten = calcKindergarten();
    const diff = kindergarten.monthly - daycare.monthly;
    const annualDiff = Math.abs(diff) * 12;
    const winner =
      !kindergarten.available
        ? "어린이집"
        : diff > 0
          ? "어린이집"
          : diff < 0
            ? "유치원"
            : "비슷함";

    setText("dkWinner", winner);
    setText(
      "dkWinnerContext",
      winner === "비슷함"
        ? "월 차이 거의 없음"
        : !kindergarten.available
          ? "나이 기준"
          : `월 ${formatKRW(Math.abs(diff))} 차이`
    );
    setText("dkDaycareMonthly", formatKRW(daycare.monthly));
    setText("dkKindergartenMonthly", kindergarten.available ? formatKRW(kindergarten.monthly) : "대상 아님");
    setText("dkAnnualDiff", kindergarten.available ? formatKRW(annualDiff) : "-");
    setText("dkAnnualDiffContext", kindergarten.available ? "12개월 환산" : "만 3세 이후 비교 권장");
    setText("dkDaycareContext", daycare.label);
    setText("dkKindergartenContext", kindergarten.label);

    renderBars(daycare, kindergarten);
    renderBreakdown(daycare, kindergarten);
    renderInsight(daycare, kindergarten);
  }

  function numberOrNull(value) {
    if (value === "" || value == null) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.max(0, parsed) : null;
  }

  function syncDefaultInputs() {
    const daycare = daycareProfile();
    const kindergarten = kindergartenProfile();
    const daycareHidden =
      (daycare.mealSnack[state.region] || 0) +
      (daycare.vehicle[state.region] || 0) +
      (daycare.extendedCare[state.household] || 0);
    const kindergartenHidden =
      (kindergarten.mealSnack[state.region] || 0) +
      (kindergarten.vehicle[state.region] || 0) +
      (kindergarten.materials[state.region] || 0);

    const values = {
      dkDaycareSpecial: daycare.specialActivity[state.region] || 0,
      dkDaycareHidden: daycareHidden,
      dkKindergartenAfterschool: kindergarten.afterschool[state.region] || 0,
      dkKindergartenHidden: kindergartenHidden,
    };

    Object.entries(values).forEach(([id, value]) => {
      const input = $(id);
      if (input && input.value === "") input.placeholder = String(value);
    });
  }

  function bind() {
    $("dkAge")?.addEventListener("change", (event) => {
      state.age = Number(event.target.value) || 3;
      render();
    });

    $("dkRegion")?.addEventListener("change", (event) => {
      state.region = event.target.value;
      syncDefaultInputs();
      render();
    });

    $("dkDaycareType")?.addEventListener("change", (event) => {
      state.daycareType = event.target.value;
      syncDefaultInputs();
      render();
    });

    $("dkKindergartenType")?.addEventListener("change", (event) => {
      state.kindergartenType = event.target.value;
      syncDefaultInputs();
      render();
    });

    $("dkHousehold")?.addEventListener("click", (event) => {
      const button = event.target.closest(".dk-segment__btn");
      if (!button) return;
      state.household = button.dataset.value || "dual";
      document.querySelectorAll("#dkHousehold .dk-segment__btn").forEach((item) => {
        item.classList.toggle("is-active", item === button);
      });
      syncDefaultInputs();
      render();
    });

    const overrideMap = {
      dkDaycareSpecial: "daycareSpecial",
      dkDaycareHidden: "daycareHidden",
      dkKindergartenAfterschool: "kindergartenAfterschool",
      dkKindergartenHidden: "kindergartenHidden",
    };

    Object.entries(overrideMap).forEach(([id, key]) => {
      $(id)?.addEventListener("input", (event) => {
        state.overrides[key] = numberOrNull(event.target.value);
        render();
      });
    });

    $("dkResetBtn")?.addEventListener("click", () => {
      state.age = 3;
      state.region = "seoul";
      state.household = "dual";
      state.daycareType = "public";
      state.kindergartenType = "private";
      state.overrides = {
        daycareSpecial: null,
        daycareHidden: null,
        kindergartenAfterschool: null,
        kindergartenHidden: null,
      };

      if ($("dkAge")) $("dkAge").value = "3";
      if ($("dkRegion")) $("dkRegion").value = "seoul";
      if ($("dkDaycareType")) $("dkDaycareType").value = "public";
      if ($("dkKindergartenType")) $("dkKindergartenType").value = "private";
      document.querySelectorAll("#dkHousehold .dk-segment__btn").forEach((item) => {
        item.classList.toggle("is-active", item.dataset.value === "dual");
      });
      Object.keys(overrideMap).forEach((id) => {
        const input = $(id);
        if (input) input.value = "";
      });
      syncDefaultInputs();
      render();
    });

    $("dkCopyLinkBtn")?.addEventListener("click", () => {
      navigator.clipboard?.writeText(location.href).catch(() => {});
    });
  }

  function init() {
    bind();
    syncDefaultInputs();
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
