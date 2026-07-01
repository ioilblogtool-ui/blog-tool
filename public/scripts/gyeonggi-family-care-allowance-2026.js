// gyeonggi-family-care-allowance-2026

(function () {
  const dataEl = document.getElementById("gfca-data");
  if (!dataEl) return;

  const data = JSON.parse(dataEl.textContent);
  const { ageTable } = data;

  const yearSel = document.getElementById("birth-year");
  const monthSel = document.getElementById("birth-month");
  const kpiBlock = document.getElementById("gfca-result-kpi");
  const resultApplyMonth = document.getElementById("result-apply-month");
  const resultCareStart = document.getElementById("result-care-start");
  const resultStatus = document.getElementById("result-status");

  function clearHighlight() {
    document.querySelectorAll(".gfca-age-row--highlighted").forEach((el) => {
      el.classList.remove("gfca-age-row--highlighted");
    });
  }

  function findRow(year, month) {
    return ageTable.find((row) => {
      const startY = row.birthYearStart;
      const startM = row.birthMonthStart;
      const endY = row.birthYearEnd;
      const endM = row.birthMonthEnd;

      const birthNum = year * 100 + month;
      const startNum = startY * 100 + startM;
      const endNum = endY * 100 + endM;

      return birthNum >= startNum && birthNum <= endNum;
    });
  }

  function updateResult() {
    const year = parseInt(yearSel.value, 10);
    const month = parseInt(monthSel.value, 10);

    clearHighlight();

    if (!year || !month) {
      kpiBlock.hidden = true;
      return;
    }

    const row = findRow(year, month);

    if (!row) {
      kpiBlock.hidden = false;
      resultApplyMonth.textContent = "해당 없음";
      resultCareStart.textContent = "—";
      resultStatus.textContent = "조건 확인 필요";
      return;
    }

    // highlight table row
    const rowEl = document.getElementById(row.id);
    if (rowEl) {
      if (!row.isCurrent) {
        rowEl.classList.add("gfca-age-row--highlighted");
      }
      rowEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    kpiBlock.hidden = false;
    resultApplyMonth.textContent = row.applyMonth;
    resultCareStart.textContent = row.careStartMonth;
    resultStatus.textContent = row.isCurrent ? "✅ 현재 접수 중" : "대기 (미래 접수)";
  }

  yearSel.addEventListener("change", updateResult);
  monthSel.addEventListener("change", updateResult);
})();
