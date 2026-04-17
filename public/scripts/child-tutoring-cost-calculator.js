// ─── child-tutoring-cost-calculator.js ───────────────────────────────────────
// 아이 사교육비 계산기 — 바닐라 JS
// ─────────────────────────────────────────────────────────────────────────────

(function () {
  "use strict";

  // ── 설정 데이터 로드 ──────────────────────────────────────────────────────
  const configEl = document.getElementById("tutoringConfig");
  if (!configEl) return;

  let CONFIG;
  try {
    CONFIG = JSON.parse(configEl.textContent || "{}");
  } catch (e) {
    console.error("[tutoring] config parse error", e);
    return;
  }

  // ── 상태 ──────────────────────────────────────────────────────────────────
  const state = {
    childCount: 1,
    children: [createDefaultChild()],
    opportunityYears: 10,
    opportunityRate: 0.05,
    growthScenario: 0,
  };

  function createDefaultChild() {
    return {
      level: "elementary",
      grade: 3,
      region: "seoul",
      subjects: [
        { name: "english", type: "academy", cost: 250000 },
        { name: "math",    type: "academy", cost: 220000 },
      ],
      bookCost: 30000,
      extraCost: 0,
    };
  }

  // ── 유틸리티 ──────────────────────────────────────────────────────────────
  function formatKRW(amount) {
    if (amount == null || isNaN(amount)) return "-";
    const abs = Math.abs(amount);
    const sign = amount < 0 ? "-" : "";
    if (abs >= 100000000) {
      const uk = abs / 100000000;
      const formatted = uk % 1 === 0 ? uk.toFixed(0) : uk.toFixed(1);
      return `${sign}${formatted}억 원`;
    }
    if (abs >= 10000) {
      const man = Math.round(abs / 10000);
      return `${sign}${man.toLocaleString()}만 원`;
    }
    return `${sign}${Math.round(abs).toLocaleString()}원`;
  }

  function formatKRWFull(amount) {
    if (amount == null || isNaN(amount)) return "-";
    return Math.round(amount).toLocaleString() + "원";
  }

  function childLabel(index) {
    const labels = ["첫째", "둘째", "셋째", "넷째"];
    return labels[index] || `${index + 1}째`;
  }

  // ── 계산 함수 ─────────────────────────────────────────────────────────────
  function calcChildMonthly(child) {
    const subjectTotal = child.subjects.reduce(
      (sum, s) => sum + (Number(s.cost) || 0),
      0
    );
    return subjectTotal + (Number(child.bookCost) || 0) + (Number(child.extraCost) || 0);
  }

  function calcTotalMonthly() {
    return state.children.reduce((sum, c) => sum + calcChildMonthly(c), 0);
  }

  function calcAnnual() {
    return calcTotalMonthly() * 12;
  }

  function calcCumulative() {
    const child = state.children[0];
    if (!child) return { amount: 0, context: "" };
    const levelMeta = CONFIG.SCHOOL_LEVEL_DATA.find(
      (l) => l.level === child.level
    );
    if (!levelMeta) return { amount: 0, context: "" };
    const remainYears =
      child.grade && child.grade > 0
        ? levelMeta.durationYears - child.grade + 1
        : levelMeta.durationYears;
    const amount = calcChildMonthly(child) * 12 * remainYears;
    return {
      amount,
      context: `${levelMeta.shortLabel} 잔여 ${remainYears}년 기준 (참고)`,
    };
  }

  function calcTierForChild(child) {
    if (!child.region) return null;
    const levelMeta = CONFIG.SCHOOL_LEVEL_DATA.find(
      (l) => l.level === child.level
    );
    if (!levelMeta) return null;
    const avg = levelMeta.avgMonthlyCost[child.region];
    const monthly = calcChildMonthly(child);
    if (!avg || avg === 0) return null;
    const ratio = monthly / avg;
    const tier = CONFIG.COMPARISON_TIERS.find(
      (t) => ratio >= t.minRatio && (t.maxRatio === null || ratio < t.maxRatio)
    );
    const diff = monthly - avg;
    return { tier, ratio, diff, avg, monthly };
  }

  // 적립식 미래가치: FV = PMT × ((1+r)^n − 1) / r  (월 복리)
  function calcOpportunityCost(monthly, yearlyRate, years) {
    const r = yearlyRate / 12;
    const n = years * 12;
    if (r === 0) return monthly * n;
    return monthly * ((Math.pow(1 + r, n) - 1) / r);
  }

  function calcSimulationTable(child) {
    const levels = ["preschool", "elementary", "middle", "high"];
    const levelOrder = levels.indexOf(child.level);
    const baseMonthly = calcChildMonthly(child);
    const rows = [];
    let runningMonthly = baseMonthly;

    levels.forEach((level, idx) => {
      const meta = CONFIG.SCHOOL_LEVEL_DATA.find((l) => l.level === level);
      if (!meta) return;
      if (idx < levelOrder) return;
      if (idx > levelOrder) {
        runningMonthly =
          baseMonthly * Math.pow(1 + state.growthScenario, idx - levelOrder);
      }
      const years =
        idx === levelOrder && child.grade && child.grade > 0
          ? meta.durationYears - child.grade + 1
          : meta.durationYears;
      const cumulative = runningMonthly * 12 * years;
      rows.push({
        label: meta.shortLabel,
        monthly: runningMonthly,
        years,
        cumulative,
      });
    });

    const total = rows.reduce((s, r) => s + r.cumulative, 0);
    return { rows, total };
  }

  // ── 카드 렌더링 ───────────────────────────────────────────────────────────
  function renderChildCards() {
    const container = document.getElementById("childCardsContainer");
    const template = document.getElementById("childCardTemplate");
    if (!container || !template) return;

    // 현재 카드 수와 필요 카드 수 비교
    const existingCards = container.querySelectorAll(".tutoring-child-card");
    const currentCount = existingCards.length;
    const targetCount = state.childCount;

    if (currentCount < targetCount) {
      // 카드 추가
      for (let i = currentCount; i < targetCount; i++) {
        const clone = template.content.cloneNode(true);
        const card = clone.querySelector(".tutoring-child-card");
        card.dataset.childIndex = i;
        card.querySelector(".tutoring-child-card__title").textContent =
          childLabel(i);
        setupCardEventListeners(card, i);
        updateGradeSelect(card, state.children[i].level);
        container.appendChild(clone);
      }
    } else if (currentCount > targetCount) {
      // 카드 제거
      const cards = container.querySelectorAll(".tutoring-child-card");
      for (let i = targetCount; i < currentCount; i++) {
        if (cards[i]) cards[i].remove();
      }
    }

    // 상태 동기화
    syncAllCardsFromState();
  }

  function syncAllCardsFromState() {
    const cards = document.querySelectorAll(".tutoring-child-card");
    cards.forEach((card) => {
      const idx = parseInt(card.dataset.childIndex, 10);
      const child = state.children[idx];
      if (!child) return;
      syncCardFromState(card, child);
    });
  }

  function syncCardFromState(card, child) {
    // 학교급 버튼
    card.querySelectorAll(".tutoring-level-btn").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.level === child.level);
    });
    // 학년
    updateGradeSelect(card, child.level);
    const gradeSelect = card.querySelector(".tutoring-grade-select");
    if (gradeSelect && child.grade) {
      gradeSelect.value = String(child.grade);
    }
    // 지역
    const regionSelect = card.querySelector(".tutoring-region-select");
    if (regionSelect) regionSelect.value = child.region || "";
    // 교재비 / 기타비용
    const bookInput = card.querySelector(".tutoring-book-cost");
    if (bookInput) bookInput.value = child.bookCost || "";
    const extraInput = card.querySelector(".tutoring-extra-cost");
    if (extraInput) extraInput.value = child.extraCost || "";
    // 과목 행
    renderSubjectRows(card, child);
    // 소계 갱신
    updateSubtotal(card, child);
  }

  function updateGradeSelect(card, level) {
    const levelMeta = CONFIG.SCHOOL_LEVEL_DATA.find((l) => l.level === level);
    const gradeField = card.querySelector(".tutoring-field--grade");
    const gradeSelect = card.querySelector(".tutoring-grade-select");
    if (!gradeField || !gradeSelect) return;

    if (!levelMeta || levelMeta.grades.length === 0) {
      gradeField.style.display = "none";
      return;
    }
    gradeField.style.display = "";
    gradeSelect.innerHTML = levelMeta.grades
      .map((g) => `<option value="${g}">${g}학년</option>`)
      .join("");
  }

  function renderSubjectRows(card, child) {
    const rowsContainer = card.querySelector(".tutoring-subject-rows");
    if (!rowsContainer) return;
    rowsContainer.innerHTML = "";

    child.subjects.forEach((subject, sIdx) => {
      const row = createSubjectRow(subject, sIdx);
      rowsContainer.appendChild(row);
    });
  }

  function createSubjectRow(subject, sIdx) {
    const template = document.getElementById("subjectRowTemplate");
    const clone = template.content.cloneNode(true);
    const row = clone.querySelector(".tutoring-subject-row");

    // 과목 선택 옵션 채우기
    const nameSelect = row.querySelector(".tutoring-subject-name");
    CONFIG.SUBJECT_OPTIONS.forEach((opt) => {
      const option = document.createElement("option");
      option.value = opt.id;
      option.textContent = opt.label;
      if (opt.id === subject.name) option.selected = true;
      nameSelect.appendChild(option);
    });

    // 학습 유형 옵션 채우기
    const typeSelect = row.querySelector(".tutoring-learning-type");
    CONFIG.LEARNING_TYPE_OPTIONS.forEach((opt) => {
      const option = document.createElement("option");
      option.value = opt.id;
      option.textContent = opt.label;
      if (opt.id === subject.type) option.selected = true;
      typeSelect.appendChild(option);
    });

    // 비용 값
    const costInput = row.querySelector(".tutoring-subject-cost");
    costInput.value = subject.cost || "";

    // 삭제 버튼
    const removeBtn = row.querySelector(".tutoring-remove-subject-btn");
    removeBtn.dataset.subjectIndex = sIdx;

    return row;
  }

  function setupCardEventListeners(card, childIdx) {
    // 아코디언 토글
    const toggleBtn = card.querySelector(".tutoring-child-card__toggle");
    const body = card.querySelector(".tutoring-child-card__body");
    if (toggleBtn && body) {
      toggleBtn.addEventListener("click", () => {
        const expanded = toggleBtn.getAttribute("aria-expanded") === "true";
        toggleBtn.setAttribute("aria-expanded", String(!expanded));
        body.classList.toggle("is-collapsed", expanded);
        toggleBtn.classList.toggle("is-collapsed", expanded);
      });
    }

    // 학교급 버튼
    card.querySelectorAll(".tutoring-level-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const level = btn.dataset.level;
        state.children[childIdx].level = level;
        state.children[childIdx].grade = 1;
        card.querySelectorAll(".tutoring-level-btn").forEach((b) =>
          b.classList.remove("is-active")
        );
        btn.classList.add("is-active");
        updateGradeSelect(card, level);
        render();
      });
    });

    // 학년 선택
    const gradeSelect = card.querySelector(".tutoring-grade-select");
    if (gradeSelect) {
      gradeSelect.addEventListener("change", () => {
        state.children[childIdx].grade = parseInt(gradeSelect.value, 10) || 1;
        render();
      });
    }

    // 지역 선택
    const regionSelect = card.querySelector(".tutoring-region-select");
    if (regionSelect) {
      regionSelect.addEventListener("change", () => {
        state.children[childIdx].region = regionSelect.value;
        render();
      });
    }

    // 교재비
    const bookInput = card.querySelector(".tutoring-book-cost");
    if (bookInput) {
      bookInput.addEventListener("input", () => {
        state.children[childIdx].bookCost = Number(bookInput.value) || 0;
        updateSubtotal(card, state.children[childIdx]);
        render();
      });
    }

    // 기타비용
    const extraInput = card.querySelector(".tutoring-extra-cost");
    if (extraInput) {
      extraInput.addEventListener("input", () => {
        state.children[childIdx].extraCost = Number(extraInput.value) || 0;
        updateSubtotal(card, state.children[childIdx]);
        render();
      });
    }

    // 과목 추가 버튼
    const addBtn = card.querySelector(".tutoring-add-subject-btn");
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        state.children[childIdx].subjects.push({
          name: "",
          type: "academy",
          cost: 0,
        });
        renderSubjectRows(card, state.children[childIdx]);
        bindSubjectRowEvents(card, childIdx);
        render();
      });
    }

    // 과목 행 이벤트
    bindSubjectRowEvents(card, childIdx);
  }

  function bindSubjectRowEvents(card, childIdx) {
    const rowsContainer = card.querySelector(".tutoring-subject-rows");
    if (!rowsContainer) return;

    rowsContainer.querySelectorAll(".tutoring-subject-row").forEach((row, sIdx) => {
      const nameSelect = row.querySelector(".tutoring-subject-name");
      const typeSelect = row.querySelector(".tutoring-learning-type");
      const costInput = row.querySelector(".tutoring-subject-cost");
      const removeBtn = row.querySelector(".tutoring-remove-subject-btn");

      if (nameSelect) {
        nameSelect.onchange = () => {
          state.children[childIdx].subjects[sIdx].name = nameSelect.value;
          render();
        };
      }
      if (typeSelect) {
        typeSelect.onchange = () => {
          state.children[childIdx].subjects[sIdx].type = typeSelect.value;
          render();
        };
      }
      if (costInput) {
        costInput.oninput = () => {
          state.children[childIdx].subjects[sIdx].cost =
            Number(costInput.value) || 0;
          updateSubtotal(card, state.children[childIdx]);
          render();
        };
      }
      if (removeBtn) {
        removeBtn.onclick = () => {
          state.children[childIdx].subjects.splice(sIdx, 1);
          renderSubjectRows(card, state.children[childIdx]);
          bindSubjectRowEvents(card, childIdx);
          updateSubtotal(card, state.children[childIdx]);
          render();
        };
      }
    });
  }

  function updateSubtotal(card, child) {
    const subtotalEl = card.querySelector(".tutoring-child-subtotal__value");
    if (subtotalEl) {
      subtotalEl.textContent = formatKRWFull(calcChildMonthly(child));
    }
  }

  // ── KPI 렌더 ──────────────────────────────────────────────────────────────
  function renderKPI() {
    const totalMonthly = calcTotalMonthly();
    const annual = calcAnnual();
    const { amount: cumulative, context: cumContext } = calcCumulative();

    setEl("kpiMonthly", formatKRW(totalMonthly));
    setEl("kpiAnnual", formatKRW(annual));
    setEl("kpiCumulative", formatKRW(cumulative));
    setEl("kpiCumulativeContext", cumContext);
    setEl("kpiTotal", formatKRW(totalMonthly));
    setEl("kpiTotalContext", `월 기준 전체 ${state.childCount}명 합산`);
  }

  // ── 또래 비교 렌더 ────────────────────────────────────────────────────────
  function renderComparison() {
    const container = document.getElementById("comparisonCards");
    if (!container) return;
    container.innerHTML = "";

    let hasAny = false;

    state.children.forEach((child, idx) => {
      const result = calcTierForChild(child);
      if (!result) return;
      hasAny = true;

      const { tier, ratio, diff, avg, monthly } = result;
      const regionLabel =
        CONFIG.REGION_OPTIONS.find((r) => r.id === child.region)?.label || "";
      const levelMeta = CONFIG.SCHOOL_LEVEL_DATA.find(
        (l) => l.level === child.level
      );
      const levelLabel = levelMeta ? levelMeta.shortLabel : "";

      // 막대 너비 계산 (100% = 평균의 2배)
      const barWidth = Math.min((ratio / 2) * 100, 100);
      const avgMarkerLeft = 50; // 평균은 항상 50% 위치

      const diffText =
        diff > 0
          ? `평균보다 ${formatKRW(diff)} 더 많음`
          : diff < 0
          ? `평균보다 ${formatKRW(Math.abs(diff))} 적음`
          : "평균과 동일";

      const card = document.createElement("div");
      card.className = "tutoring-comparison-card";
      card.innerHTML = `
        <div class="tutoring-comparison-card__header">
          <span class="tutoring-comparison-card__name">${childLabel(idx)} (${levelLabel} · ${regionLabel})</span>
          <span class="tutoring-tier-badge ${tier ? tier.colorClass : ""}">
            ${tier ? tier.label : "-"}
          </span>
        </div>
        <div class="tutoring-bar-wrap">
          <div class="tutoring-bar" style="width: ${barWidth}%"></div>
          <div class="tutoring-bar__avg-marker" style="left: ${avgMarkerLeft}%">
            <span class="tutoring-bar__avg-label">평균<br>${formatKRW(avg)}</span>
          </div>
        </div>
        <div class="tutoring-comparison-card__meta">
          <span>내 지출: <strong>${formatKRW(monthly)}</strong></span>
          <span class="tutoring-comparison-card__diff">${diffText}</span>
        </div>
        <p class="tutoring-comparison-card__note">${tier ? tier.badge : ""} · 지역 또래 평균 추정치 기준</p>
      `;
      container.appendChild(card);
    });

    if (!hasAny) {
      container.innerHTML =
        '<p class="tutoring-comparison-empty">지역을 선택하면 또래 평균과 비교할 수 있습니다.</p>';
    }
  }

  // ── 누적 시뮬레이션 렌더 ─────────────────────────────────────────────────
  function renderSimulation() {
    const tableEl = document.getElementById("simulationTable");
    if (!tableEl) return;

    const child = state.children[0];
    if (!child) {
      tableEl.innerHTML = "";
      return;
    }

    const { rows, total } = calcSimulationTable(child);

    if (rows.length === 0) {
      tableEl.innerHTML = "";
      return;
    }

    const scenarioText =
      state.growthScenario === 0
        ? "현재 수준 유지"
        : `학교급 상승 시 +${state.growthScenario * 100}%`;

    let html = `
      <table class="tutoring-sim-table">
        <caption class="sr-only">학교급별 누적 교육비 시뮬레이션 (${scenarioText})</caption>
        <thead>
          <tr>
            <th>학교급</th>
            <th>월 교육비 (추정)</th>
            <th>기간</th>
            <th>누적 예상</th>
          </tr>
        </thead>
        <tbody>
    `;
    rows.forEach((row) => {
      html += `
        <tr>
          <td>${row.label}</td>
          <td>${formatKRW(row.monthly)}</td>
          <td>${row.years}년</td>
          <td><strong>${formatKRW(row.cumulative)}</strong></td>
        </tr>
      `;
    });
    html += `
        </tbody>
        <tfoot>
          <tr class="tutoring-sim-total">
            <td colspan="3">합계</td>
            <td><strong>${formatKRW(total)}</strong></td>
          </tr>
        </tfoot>
      </table>
      <p class="tutoring-sim-note">* 첫째 자녀 기준. 월 교육비는 현재 입력 기준이며 누적 예상값은 참고용입니다.</p>
    `;
    tableEl.innerHTML = html;
  }

  // ── 기회비용 렌더 ─────────────────────────────────────────────────────────
  function renderOpportunity() {
    const monthly = calcTotalMonthly();
    const fv = calcOpportunityCost(
      monthly,
      state.opportunityRate,
      state.opportunityYears
    );

    setEl("opMonthly", formatKRW(monthly));
    setEl("opYears", String(state.opportunityYears));
    setEl("opRate", String(Math.round(state.opportunityRate * 100)));
    setEl("opFutureValue", formatKRW(fv));
  }

  // ── 메인 render ───────────────────────────────────────────────────────────
  function render() {
    renderKPI();
    renderComparison();
    renderSimulation();
    renderOpportunity();

    // 소계 갱신
    document.querySelectorAll(".tutoring-child-card").forEach((card) => {
      const idx = parseInt(card.dataset.childIndex, 10);
      const child = state.children[idx];
      if (child) updateSubtotal(card, child);
    });
  }

  // ── 헬퍼 ──────────────────────────────────────────────────────────────────
  function setEl(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  // ── 초기화 ────────────────────────────────────────────────────────────────
  function init() {
    // 자녀 수 버튼
    document.getElementById("childCountButtons")?.addEventListener("click", (e) => {
      const btn = e.target.closest(".tutoring-count-btn");
      if (!btn) return;
      const count = parseInt(btn.dataset.count, 10);
      state.childCount = count;

      // 자녀 배열 조정
      while (state.children.length < count) {
        state.children.push(createDefaultChild());
      }
      state.children.length = count;

      // 버튼 상태
      document.querySelectorAll(".tutoring-count-btn").forEach((b) =>
        b.classList.toggle("is-active", b.dataset.count === String(count))
      );

      renderChildCards();
      render();
    });

    // 시나리오 버튼
    document.querySelectorAll(".tutoring-scenario-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.growthScenario = parseFloat(btn.dataset.growth) || 0;
        document.querySelectorAll(".tutoring-scenario-btn").forEach((b) =>
          b.classList.remove("is-active")
        );
        btn.classList.add("is-active");
        renderSimulation();
      });
    });

    // 기간 탭
    document.getElementById("yearPresets")?.addEventListener("click", (e) => {
      const btn = e.target.closest(".tutoring-tab-btn");
      if (!btn) return;
      state.opportunityYears = parseInt(btn.dataset.years, 10) || 10;
      document
        .querySelectorAll("#yearPresets .tutoring-tab-btn")
        .forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      renderOpportunity();
    });

    // 수익률 탭
    document.getElementById("ratePresets")?.addEventListener("click", (e) => {
      const btn = e.target.closest(".tutoring-tab-btn");
      if (!btn) return;
      state.opportunityRate = parseFloat(btn.dataset.rate) || 0.05;
      document
        .querySelectorAll("#ratePresets .tutoring-tab-btn")
        .forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      renderOpportunity();
    });

    // 리셋 버튼
    document.getElementById("tutoringResetBtn")?.addEventListener("click", () => {
      state.childCount = 1;
      state.children = [createDefaultChild()];
      state.opportunityYears = 10;
      state.opportunityRate = 0.05;
      state.growthScenario = 0;

      document.querySelectorAll(".tutoring-count-btn").forEach((b) =>
        b.classList.toggle("is-active", b.dataset.count === "1")
      );
      document.querySelectorAll(".tutoring-scenario-btn").forEach((b) =>
        b.classList.toggle("is-active", b.dataset.growth === "0")
      );
      document.querySelectorAll("#yearPresets .tutoring-tab-btn").forEach((b) =>
        b.classList.toggle("is-active", b.dataset.years === "10")
      );
      document.querySelectorAll("#ratePresets .tutoring-tab-btn").forEach((b) =>
        b.classList.toggle("is-active", b.dataset.rate === "0.05")
      );

      renderChildCards();
      render();
    });

    // 링크 복사
    document.getElementById("tutoringCopyLinkBtn")?.addEventListener("click", () => {
      navigator.clipboard?.writeText(location.href).catch(() => {});
    });

    // 초기 카드 렌더링
    renderChildCards();
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
