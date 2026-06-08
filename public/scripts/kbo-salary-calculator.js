(() => {
  const root = document.querySelector("[data-ksc-root]");
  if (!root) return;

  const configEl = document.getElementById("kscConfig");
  const config = JSON.parse(configEl?.textContent || "{}");
  const leagueAvg = config.leagueAvg ?? 140_000_000;
  const totalPlayers = config.totalPlayers ?? 600;
  const distribution = (config.distribution || []).map((d) => ({
    ...d,
    max: d.max === null ? Infinity : d.max,
  }));
  const benchmarks = config.benchmarks || [];
  const won = new Intl.NumberFormat("ko-KR");

  const out = (key) => document.querySelector(`[data-ksc-output="${key}"]`);

  function numeric(value, fallback = 0) {
    const n = Number(String(value ?? "").replace(/[^\d]/g, ""));
    return Number.isFinite(n) && n >= 0 ? n : fallback;
  }

  function fmt(value) {
    const v = Math.round(value);
    if (v === 0) return "0원";
    if (Math.abs(v) >= 100_000_000) {
      const eok = v / 100_000_000;
      return `${eok.toFixed(eok % 1 === 0 ? 0 : 1)}억원`;
    }
    return `${won.format(Math.round(v / 10_000))}만원`;
  }

  function fmtExact(value) {
    return `${won.format(Math.round(value))}원`;
  }

  function fmtPct(v) {
    return `${v.toFixed(1)}%`;
  }

  // 세후 계산 (근로소득 기준)
  function calcNet(annual) {
    const monthlyGross = annual / 12;
    const mealNonTaxable = Math.min(200_000, monthlyGross * 0.04);
    const taxable = Math.max(0, monthlyGross - mealNonTaxable);

    const pension = Math.min(taxable * 0.045, 280_000);
    const health = taxable * 0.03545;
    const ltc = health * 0.1295;
    const employment = taxable * 0.009;

    const annualTaxable = Math.max(0, taxable * 12 - 1_500_000);
    let rate = 0.06;
    if (annualTaxable >= 300_000_000) rate = 0.38;
    else if (annualTaxable >= 150_000_000) rate = 0.35;
    else if (annualTaxable >= 88_000_000) rate = 0.28;
    else if (annualTaxable >= 50_000_000) rate = 0.24;
    else if (annualTaxable >= 14_000_000) rate = 0.15;
    else if (annualTaxable >= 8_000_000) rate = 0.15;
    else if (annualTaxable >= 1_400_000) rate = 0.06;

    // 정확한 누진세 계산
    let incomeTax = 0;
    const brackets = [
      { limit: 14_000_000, rate: 0.06, deduction: 0 },
      { limit: 50_000_000, rate: 0.15, deduction: 1_260_000 },
      { limit: 88_000_000, rate: 0.24, deduction: 5_760_000 },
      { limit: 150_000_000, rate: 0.35, deduction: 15_440_000 },
      { limit: 300_000_000, rate: 0.38, deduction: 19_940_000 },
      { limit: 500_000_000, rate: 0.40, deduction: 25_940_000 },
      { limit: 1_000_000_000, rate: 0.42, deduction: 35_940_000 },
      { limit: Infinity, rate: 0.45, deduction: 65_940_000 },
    ];

    for (const b of brackets) {
      if (annualTaxable <= b.limit) {
        incomeTax = (annualTaxable * b.rate - b.deduction) / 12;
        break;
      }
    }
    incomeTax = Math.max(0, incomeTax);
    const localTax = incomeTax * 0.1;

    const totalDeduction = pension + health + ltc + employment + incomeTax + localTax;
    const monthlyNet = Math.max(0, monthlyGross - totalDeduction);

    return {
      monthlyGross,
      monthlyNet,
      netRate: monthlyGross > 0 ? (monthlyNet / monthlyGross) * 100 : 0,
      breakdown: [
        { label: "국민연금", basis: "과세 급여 × 4.5%", monthly: pension, annual: pension * 12 },
        { label: "건강보험", basis: "과세 급여 × 3.545%", monthly: health, annual: health * 12 },
        { label: "장기요양보험", basis: "건강보험 × 12.95%", monthly: ltc, annual: ltc * 12 },
        { label: "고용보험", basis: "과세 급여 × 0.9%", monthly: employment, annual: employment * 12 },
        { label: "근로소득세", basis: "누진세율 (6~45%)", monthly: incomeTax, annual: incomeTax * 12 },
        { label: "지방소득세", basis: "소득세 × 10%", monthly: localTax, annual: localTax * 12 },
      ],
      totalMonthlyDeduction: totalDeduction,
    };
  }

  function getLeagueRank(salary) {
    let cumCount = 0;
    for (const d of distribution) {
      if (salary >= d.min && (d.max === Infinity || salary < d.max)) {
        // 구간 내 추정 위치
        const inBracketRatio = d.max === Infinity ? 0.5 : (salary - d.min) / (d.max - d.min);
        const aboveCount = totalPlayers - cumCount - d.count + Math.floor(d.count * inBracketRatio);
        return Math.round((aboveCount / totalPlayers) * 100);
      }
      cumCount += d.count;
    }
    return 0;
  }

  function read() {
    const get = (key) => root.querySelector(`[data-ksc-input="${key}"]`);
    return {
      salary: numeric(get("salary")?.value, config.defaults?.salary ?? 140_000_000),
      includeSigning: Boolean(get("includeSigning")?.checked),
      signing: numeric(get("signing")?.value, 0),
      signingYears: Number(get("signingYears")?.value || 3),
    };
  }

  function render() {
    const input = read();
    const { salary } = input;
    const result = calcNet(salary);

    // 결과 카드
    set("monthlyNet", fmt(result.monthlyNet));
    set("monthlyNetNote", `월 세후 실수령 (근로소득 추정)`);
    set("monthlyGross", fmt(result.monthlyGross));
    set("netRate", fmtPct(result.netRate));
    set("annualDeduction", fmt(result.totalMonthlyDeduction * 12));
    set("annualDeductionNote", "연간 세금·보험 합계");

    const rank = getLeagueRank(salary);
    set("leagueRank", rank <= 3 ? `상위 ${rank}%` : `상위 ${rank}%`);
    set("leagueRankNote", rank <= 10 ? "⭐ 리그 최상위" : rank <= 30 ? "상위권" : "");

    const vsAvgRatio = salary / leagueAvg;
    set("vsAvg", vsAvgRatio >= 1 ? `${vsAvgRatio.toFixed(1)}배` : `평균의 ${fmtPct(vsAvgRatio * 100)}`);

    // 계약금 결과
    const signingEl = out("signingResult");
    if (signingEl) {
      if (input.includeSigning && input.signing > 0) {
        signingEl.hidden = false;
        const annualSigning = input.signing / input.signingYears;
        const totalAnnual = salary + annualSigning;
        set("totalWithSigning", fmt(totalAnnual));
        set("signingNote", `연봉 ${fmt(salary)} + 계약금 연할 ${fmt(annualSigning)}`);
      } else {
        signingEl.hidden = true;
      }
    }

    // 공제 내역 테이블
    const tbody = out("breakdown");
    if (tbody) {
      tbody.innerHTML = result.breakdown
        .map(
          (r) =>
            `<tr>
              <td class="ksc-bd-label">${r.label}</td>
              <td class="ksc-bd-basis">${r.basis}</td>
              <td class="ksc-bd-monthly">${fmtExact(r.monthly)}</td>
              <td class="ksc-bd-annual">${fmtExact(r.annual)}</td>
            </tr>`
        )
        .join("");
    }
    set("totalMonthlyDeduction", fmtExact(result.totalMonthlyDeduction));
    set("totalAnnualDeduction", fmtExact(result.totalMonthlyDeduction * 12));

    // 리그 분포 하이라이트
    document.querySelectorAll("[data-dist-min]").forEach((row, i) => {
      const min = Number(row.dataset.distMin);
      const maxRaw = row.dataset.distMax;
      const max = maxRaw === "Infinity" ? Infinity : Number(maxRaw);
      const isHere = salary >= min && (max === Infinity || salary < max);
      row.classList.toggle("ksc-dist-row--active", isHere);
      const youEl = row.querySelector("[data-ksc-dist-you]");
      if (youEl) youEl.hidden = !isHere;
    });

    // 대표 선수 비교
    document.querySelectorAll("[data-bench-salary]").forEach((row) => {
      const benchSalary = Number(row.dataset.benchSalary);
      const ratioEl = row.querySelector("[data-ksc-bench-ratio]");
      if (ratioEl) {
        if (salary === 0) {
          ratioEl.textContent = "-";
        } else {
          const ratio = benchSalary / salary;
          ratioEl.textContent = ratio >= 1
            ? `${ratio.toFixed(1)}배`
            : `내 연봉이 ${(1 / ratio).toFixed(1)}배`;
          ratioEl.className = `ksc-bench-ratio ${ratio > 1 ? "ksc-bench-ratio--above" : "ksc-bench-ratio--below"}`;
        }
      }
    });

    // 포지션 비교 카드
    document.querySelectorAll("[data-pos-avg]").forEach((card) => {
      const posAvg = Number(card.dataset.posAvg);
      const ratioEl = card.querySelector("[data-poc-avg]");
      if (ratioEl) {
        const ratio = posAvg > 0 ? salary / posAvg : 0;
        ratioEl.textContent = ratio >= 1
          ? `평균의 ${ratio.toFixed(1)}배 ↑`
          : `평균의 ${fmtPct(ratio * 100)} ↓`;
        ratioEl.className = `ksc-poc-ratio ${ratio >= 1 ? "ksc-poc-ratio--above" : "ksc-poc-ratio--below"}`;
      }
    });

    // 슬라이더 동기화
    const slider = root.querySelector('[data-ksc-input="salarySlider"]');
    if (slider && Number(slider.value) !== salary) {
      slider.value = Math.min(salary, Number(slider.max));
    }
  }

  function set(key, value) {
    const el = out(key);
    if (el) el.textContent = value;
  }

  // 입력 이벤트
  const salaryInput = root.querySelector('[data-ksc-input="salary"]');
  const salarySlider = root.querySelector('[data-ksc-input="salarySlider"]');

  salaryInput?.addEventListener("input", () => {
    const v = numeric(salaryInput.value, 0);
    if (salarySlider) salarySlider.value = Math.min(v, Number(salarySlider.max));
    render();
  });
  salaryInput?.addEventListener("blur", () => {
    const v = numeric(salaryInput.value, 0);
    salaryInput.value = v > 0 ? v.toLocaleString("ko-KR") : "0";
  });
  salaryInput?.addEventListener("focus", () => {
    salaryInput.value = String(numeric(salaryInput.value, 0));
  });

  salarySlider?.addEventListener("input", () => {
    const v = Number(salarySlider.value);
    if (salaryInput) salaryInput.value = v.toLocaleString("ko-KR");
    render();
  });

  // 빠른 선택 버튼
  root.querySelectorAll("[data-ksc-quick]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const v = Number(btn.dataset.kscQuick);
      if (salaryInput) salaryInput.value = v.toLocaleString("ko-KR");
      if (salarySlider) salarySlider.value = Math.min(v, Number(salarySlider.max));
      render();
    });
  });

  // 계약금 토글
  const includeSigningEl = root.querySelector('[data-ksc-input="includeSigning"]');
  const signingField = root.querySelector('[data-ksc-field="signing"]');
  includeSigningEl?.addEventListener("change", () => {
    if (signingField) signingField.hidden = !includeSigningEl.checked;
    render();
  });

  root.querySelectorAll('[data-ksc-input="signing"], [data-ksc-input="signingYears"]').forEach((el) => {
    el.addEventListener("input", render);
    el.addEventListener("change", render);
  });

  // 리셋
  document.getElementById("resetKscBtn")?.addEventListener("click", () => {
    const def = config.defaults?.salary ?? 140_000_000;
    if (salaryInput) salaryInput.value = def.toLocaleString("ko-KR");
    if (salarySlider) salarySlider.value = def;
    if (includeSigningEl) includeSigningEl.checked = false;
    if (signingField) signingField.hidden = true;
    render();
  });

  // 링크 복사
  document.getElementById("copyKscLinkBtn")?.addEventListener("click", () => {
    const input = read();
    const url = new URL(location.href);
    url.searchParams.set("salary", String(input.salary));
    if (input.includeSigning && input.signing > 0) {
      url.searchParams.set("signing", String(input.signing));
      url.searchParams.set("years", String(input.signingYears));
    }
    navigator.clipboard.writeText(url.toString()).catch(() => {});
  });

  // URL 복원
  const params = new URLSearchParams(location.search);
  if (params.has("salary")) {
    const v = Number(params.get("salary"));
    if (salaryInput) salaryInput.value = v.toLocaleString("ko-KR");
    if (salarySlider) salarySlider.value = Math.min(v, Number(salarySlider?.max ?? 2_500_000_000));
  }
  if (params.has("signing")) {
    if (includeSigningEl) includeSigningEl.checked = true;
    if (signingField) signingField.hidden = false;
    const signingInputEl = root.querySelector('[data-ksc-input="signing"]');
    if (signingInputEl) signingInputEl.value = Number(params.get("signing")).toLocaleString("ko-KR");
    const yearsEl = root.querySelector('[data-ksc-input="signingYears"]');
    if (yearsEl && params.has("years")) yearsEl.value = params.get("years");
  }

  render();
})();
