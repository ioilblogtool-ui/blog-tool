(function () {
  "use strict";

  const root = document.querySelector('[data-report="ai-learning-vs-academy-2026"]');
  const dataNode = document.getElementById("alvaData");
  if (!root || !dataNode) return;

  const seed = JSON.parse(dataNode.textContent || "{}");
  const scenario = seed.costScenario || {};
  const roadmap = Array.isArray(seed.gradeRoadmap) ? seed.gradeRoadmap : [];
  const subjects = Array.isArray(seed.subjectMatrix) ? seed.subjectMatrix : [];
  const checklist = Array.isArray(seed.checklist) ? seed.checklist : [];

  const formatWon = (value) => `${Math.round(Number(value || 0)).toLocaleString("ko-KR")}원`;
  const formatMan = (value) => `${Math.round(Number(value || 0) / 10000).toLocaleString("ko-KR")}만원`;

  function calculateFiveYearCosts() {
    const rows = [];
    let academyMonthly = Number(scenario.monthlyAcademyCost || 0);
    let aiMonthly = Number(scenario.monthlyAiCost || 0);
    let hybridMonthly = Number(scenario.monthlyHybridCost || 0);
    let academyTotal = 0;
    let aiTotal = 0;
    let hybridTotal = 0;

    for (let year = 1; year <= 5; year += 1) {
      academyTotal += academyMonthly * 12;
      aiTotal += aiMonthly * 12;
      hybridTotal += hybridMonthly * 12;

      rows.push({
        year,
        academy: Math.round(academyTotal),
        fullAi: Math.round(aiTotal),
        hybrid: Math.round(hybridTotal),
      });

      academyMonthly *= 1 + Number(scenario.academyIncreaseRate || 0);
      aiMonthly *= 1 + Number(scenario.aiIncreaseRate || 0);
      hybridMonthly *= 1 + Number(scenario.academyIncreaseRate || 0) * 0.5;
    }

    return rows;
  }

  function renderCostTable(rows) {
    const tbody = root.querySelector("[data-alva-cost-table]");
    if (!tbody) return;

    tbody.innerHTML = rows
      .map(
        (row) => `
          <tr>
            <th>${row.year}년차</th>
            <td>${formatMan(row.fullAi)}</td>
            <td>${formatMan(row.hybrid)}</td>
            <td>${formatMan(row.academy)}</td>
            <td>${formatMan(row.academy - row.hybrid)}</td>
          </tr>
        `,
      )
      .join("");
  }

  function renderCostChart(rows) {
    const canvas = document.getElementById("alvaCostChart");
    if (!canvas || !window.Chart) return;

    new window.Chart(canvas, {
      type: "line",
      data: {
        labels: rows.map((row) => `${row.year}년차`),
        datasets: [
          {
            label: "AI 중심",
            data: rows.map((row) => row.fullAi),
            borderColor: "#0f766e",
            backgroundColor: "rgba(15, 118, 110, 0.12)",
            tension: 0.35,
            fill: true,
          },
          {
            label: "하이브리드",
            data: rows.map((row) => row.hybrid),
            borderColor: "#2563eb",
            backgroundColor: "rgba(37, 99, 235, 0.1)",
            tension: 0.35,
            fill: true,
          },
          {
            label: "학원 유지",
            data: rows.map((row) => row.academy),
            borderColor: "#dc2626",
            backgroundColor: "rgba(220, 38, 38, 0.08)",
            tension: 0.35,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: "#344054",
              font: { family: "'Pretendard', sans-serif", weight: 800 },
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: ${formatMan(context.raw)}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#475467", font: { weight: 800 } },
          },
          y: {
            grid: { color: "rgba(31, 41, 55, 0.08)" },
            ticks: { color: "#667085", callback: (value) => formatMan(value) },
          },
        },
      },
    });
  }

  function bindGradeFilter() {
    const buttons = Array.from(root.querySelectorAll("[data-alva-grade]"));
    const detail = root.querySelector("[data-alva-grade-detail]");
    if (!buttons.length || !detail || !roadmap.length) return;

    function render(id) {
      const item = roadmap.find((row) => row.gradeBand === id) || roadmap[0];
      buttons.forEach((button) => button.classList.toggle("is-active", button.dataset.alvaGrade === item.gradeBand));
      detail.innerHTML = `
        <span>${item.label}</span>
        <h3>${item.recommendedStrategy}</h3>
        <dl>
          <div><dt>AI 활용</dt><dd>${item.aiUse}</dd></div>
          <div><dt>학원 활용</dt><dd>${item.academyUse}</dd></div>
        </dl>
        <p>${item.caution}</p>
      `;
    }

    buttons.forEach((button) => {
      button.addEventListener("click", () => render(button.dataset.alvaGrade));
    });
    render(buttons[0].dataset.alvaGrade);
  }

  function bindSubjectFilter() {
    const buttons = Array.from(root.querySelectorAll("[data-alva-subject]"));
    const cards = Array.from(root.querySelectorAll("[data-alva-subject-card]"));
    if (!buttons.length || !cards.length || !subjects.length) return;

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const active = button.dataset.alvaSubject;
        buttons.forEach((item) => item.classList.toggle("is-active", item === button));
        cards.forEach((card) => {
          const shouldShow = active === "all" || card.dataset.alvaSubjectCard === active;
          card.hidden = !shouldShow;
        });
      });
    });
  }

  function bindChecklist() {
    const boxes = Array.from(root.querySelectorAll("[data-alva-check]"));
    const result = root.querySelector("[data-alva-check-result]");
    const meter = root.querySelector("[data-alva-check-meter]");
    if (!boxes.length || !result) return;

    function update() {
      const checked = boxes.filter((box) => box.checked).length;
      const ratio = checklist.length ? Math.round((checked / checklist.length) * 100) : 0;
      if (meter) meter.style.width = `${ratio}%`;

      let title = "학원 유지 + AI 보조 권장";
      let body = "AI를 바로 전환하기보다 숙제·복습 보조로 먼저 붙이고, 사람 피드백 루프를 유지하는 편이 안전합니다.";
      if (checked >= 7) {
        title = "AI 중심 또는 강한 하이브리드 검토 가능";
        body = "다만 성적 향상을 보장하는 것은 아니므로 주간 점검과 검증된 교재 확인은 남겨두는 편이 좋습니다.";
      } else if (checked >= 4) {
        title = "하이브리드 권장";
        body = "한 과목 또는 한 수업 횟수부터 줄이고, AI 복습 루틴이 유지되는지 4주 단위로 확인해보세요.";
      }

      result.innerHTML = `<strong>${checked}/${boxes.length}개 체크 · ${title}</strong><p>${body}</p>`;
    }

    boxes.forEach((box) => box.addEventListener("change", update));
    update();
  }

  const rows = calculateFiveYearCosts();
  renderCostTable(rows);
  renderCostChart(rows);
  bindGradeFilter();
  bindSubjectFilter();
  bindChecklist();
})();
