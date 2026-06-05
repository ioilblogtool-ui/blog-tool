(function () {
  const els = {
    currentSalary: document.getElementById("pwrc-current-salary"),
    currentYears: document.getElementById("pwrc-current-years"),
    yearsUntilPeak: document.getElementById("pwrc-years-until-peak"),
    yearsAfterPeak: document.getElementById("pwrc-years-after-peak"),
    cutRate: document.getElementById("pwrc-cut-rate"),
    dcReturn: document.getElementById("pwrc-dc-return"),
    verdict: document.getElementById("pwrc-verdict"),
    verdictCopy: document.getElementById("pwrc-verdict-copy"),
    dbKeep: document.getElementById("pwrc-db-keep"),
    dcSwitch: document.getElementById("pwrc-dc-switch"),
    diff: document.getElementById("pwrc-diff"),
    dbBar: document.getElementById("pwrc-db-bar"),
    dcBar: document.getElementById("pwrc-dc-bar"),
    postSalary: document.getElementById("pwrc-post-salary"),
    dbImpact: document.getElementById("pwrc-db-impact"),
    breakEven: document.getElementById("pwrc-break-even"),
    presets: Array.from(document.querySelectorAll(".pwrc-preset")),
  };

  if (!els.currentSalary || !els.verdict) return;

  const toNumber = (el, fallback) => {
    const value = Number(el.value);
    return Number.isFinite(value) ? value : fallback;
  };

  const formatManwon = (value) => {
    const sign = value < 0 ? "-" : "";
    const abs = Math.abs(value);
    if (abs >= 10000) {
      const eok = Math.floor(abs / 10000);
      const man = Math.round(abs % 10000);
      return man > 0
        ? `${sign}${eok.toLocaleString("ko-KR")}억 ${man.toLocaleString("ko-KR")}만원`
        : `${sign}${eok.toLocaleString("ko-KR")}억원`;
    }
    return `${sign}${Math.round(abs).toLocaleString("ko-KR")}만원`;
  };

  const calculateWithoutBreakEven = (input) => {
    const currentSalary = Math.max(input.currentSalaryManwon, 0);
    const currentYears = Math.max(input.currentServiceYears, 0);
    const yearsUntilPeak = Math.max(input.yearsUntilPeak, 0);
    const yearsAfterPeak = Math.max(input.yearsAfterPeak, 0);
    const cutRate = Math.min(Math.max(input.salaryCutRate, 0), 80);
    const dcReturn = Math.max(input.dcReturnRate, -20) / 100;

    const serviceAtSwitch = currentYears + yearsUntilPeak;
    const totalServiceYears = serviceAtSwitch + yearsAfterPeak;
    const postPeakSalaryManwon = currentSalary * (1 - cutRate / 100);
    const dbKeepManwon = (postPeakSalaryManwon / 12) * totalServiceYears;
    const dbNoCutBasisManwon = (currentSalary / 12) * totalServiceYears;
    const dbImpactManwon = Math.max(dbNoCutBasisManwon - dbKeepManwon, 0);
    const transferPrincipalManwon = (currentSalary / 12) * serviceAtSwitch;
    const grownPrincipal = transferPrincipalManwon * Math.pow(1 + dcReturn, yearsAfterPeak);

    let dcFutureContributionManwon = 0;
    for (let year = 1; year <= yearsAfterPeak; year += 1) {
      dcFutureContributionManwon += (postPeakSalaryManwon / 12) * Math.pow(1 + dcReturn, yearsAfterPeak - year);
    }

    const switchToDcManwon = grownPrincipal + dcFutureContributionManwon;
    const diffManwon = switchToDcManwon - dbKeepManwon;

    return {
      postPeakSalaryManwon,
      dbKeepManwon,
      dbImpactManwon,
      switchToDcManwon,
      diffManwon,
    };
  };

  const findBreakEvenReturn = (input) => {
    const zeroInput = { ...input, dcReturnRate: 0 };
    const zero = calculateWithoutBreakEven(zeroInput);
    if (zero.switchToDcManwon - zero.dbKeepManwon >= 0) return 0;

    const highInput = { ...input, dcReturnRate: 15 };
    const high = calculateWithoutBreakEven(highInput);
    if (high.switchToDcManwon - high.dbKeepManwon < 0) return null;

    let low = 0;
    let highRate = 15;
    for (let i = 0; i < 32; i += 1) {
      const mid = (low + highRate) / 2;
      const midResult = calculateWithoutBreakEven({ ...input, dcReturnRate: mid });
      if (midResult.switchToDcManwon - midResult.dbKeepManwon >= 0) highRate = mid;
      else low = mid;
    }
    return highRate;
  };

  const readInput = () => ({
    currentSalaryManwon: toNumber(els.currentSalary, 8000),
    currentServiceYears: toNumber(els.currentYears, 20),
    yearsUntilPeak: toNumber(els.yearsUntilPeak, 1),
    yearsAfterPeak: toNumber(els.yearsAfterPeak, 3),
    salaryCutRate: toNumber(els.cutRate, 20),
    dcReturnRate: toNumber(els.dcReturn, 5),
  });

  const update = () => {
    const input = readInput();
    const result = calculateWithoutBreakEven(input);
    const diffPct = result.dbKeepManwon > 0 ? (result.diffManwon / result.dbKeepManwon) * 100 : 0;
    const breakEven = findBreakEvenReturn(input);
    const absDiffPct = Math.abs(diffPct);

    let title = "비슷한 구간";
    let copy = "두 방식의 차이가 크지 않습니다. 전환 가능 여부와 운용 부담을 먼저 확인하세요.";
    if (absDiffPct >= 3 && result.diffManwon > 0) {
      title = "DC 전환 검토";
      copy = `DC 전환 추정액이 DB 유지보다 ${formatManwon(result.diffManwon)} 큽니다. 운용위험을 감수할 수 있는지 함께 확인하세요.`;
    } else if (absDiffPct >= 3 && result.diffManwon < 0) {
      title = "DB 유지 우세";
      copy = `DB 유지 추정액이 DC 전환보다 ${formatManwon(Math.abs(result.diffManwon))} 큽니다. 전환 실익이 제한적일 수 있습니다.`;
    }

    els.verdict.textContent = title;
    els.verdictCopy.textContent = copy;
    els.dbKeep.textContent = formatManwon(result.dbKeepManwon);
    els.dcSwitch.textContent = formatManwon(result.switchToDcManwon);
    els.diff.textContent = formatManwon(result.diffManwon);
    els.postSalary.textContent = formatManwon(result.postPeakSalaryManwon);
    els.dbImpact.textContent = formatManwon(result.dbImpactManwon);
    els.breakEven.textContent = breakEven === null ? "15% 초과" : `${breakEven.toFixed(1)}%`;

    const maxAmount = Math.max(result.dbKeepManwon, result.switchToDcManwon, 1);
    els.dbBar.style.width = `${Math.max(8, (result.dbKeepManwon / maxAmount) * 100)}%`;
    els.dcBar.style.width = `${Math.max(8, (result.switchToDcManwon / maxAmount) * 100)}%`;
  };

  [els.currentSalary, els.currentYears, els.yearsUntilPeak, els.yearsAfterPeak, els.cutRate, els.dcReturn].forEach((el) => {
    el.addEventListener("input", update);
  });

  els.presets.forEach((button) => {
    button.addEventListener("click", () => {
      els.presets.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      els.yearsUntilPeak.value = button.dataset.yearsUntilPeak || els.yearsUntilPeak.value;
      els.yearsAfterPeak.value = button.dataset.yearsAfterPeak || els.yearsAfterPeak.value;
      els.cutRate.value = button.dataset.salaryCutRate || els.cutRate.value;
      update();
    });
  });

  update();
})();
