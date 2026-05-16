(() => {
  'use strict';

  // ─── 상수 ───────────────────────────────────────────────────
  const EARLY_RATE = 0.06;
  const DELAYED_RATE = 0.072;
  const SCENARIO_AGES = [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70];
  const TYPE_LABEL = { early: '조기수령', normal: '정상수령', delayed: '연기수령' };

  // ─── 초기 상태 ──────────────────────────────────────────────
  let state = {
    currentAge: 55,
    birthYear: 1970,
    normalMonthly: 1200000,
    privateMonthly: 500000,
    retirementMonthly: 700000,
    healthLifeAge: 82,
    expectedLifeAge: 90,
    inflationRate: 2.0,
  };

  // ─── 유틸 ───────────────────────────────────────────────────
  function q(id) { return document.getElementById(id); }

  function sanitize(val, fallback = 0, min = 0) {
    const n = parseFloat(String(val).replace(/,/g, ''));
    return isNaN(n) || n < min ? fallback : n;
  }

  function wonStr(v) {
    if (v <= 0) return '0원';
    if (v >= 100000000) {
      const okBillion = (v / 100000000).toFixed(1);
      return `${okBillion}억 원`;
    }
    return `${Math.round(v / 10000).toLocaleString('ko-KR')}만 원`;
  }

  function monthlyStr(v) {
    return `${Math.round(v / 10000).toLocaleString('ko-KR')}만 원`;
  }

  // ─── 핵심 계산 함수 ─────────────────────────────────────────
  function getNormalAge(birthYear) {
    if (birthYear >= 1969) return 65;
    if (birthYear >= 1965) return 64;
    if (birthYear >= 1961) return 63;
    if (birthYear >= 1957) return 62;
    if (birthYear >= 1953) return 61;
    return 60;
  }

  function getRate(startAge, normalAge) {
    const diff = startAge - normalAge;
    if (diff < 0) return Math.max(0.70, 1 + diff * EARLY_RATE);
    if (diff > 0) return 1 + Math.min(diff, 5) * DELAYED_RATE;
    return 1.0;
  }

  function calcNominal(monthly, start, end) {
    return Math.max(0, end - start) * 12 * monthly;
  }

  function calcPV(monthly, start, end, currentAge, inflationRate) {
    if (inflationRate === 0) return calcNominal(monthly, start, end);
    let total = 0;
    for (let age = start; age < end; age++) {
      total += (monthly * 12) / Math.pow(1 + inflationRate / 100, age - currentAge);
    }
    return total;
  }

  function findBreakEven(aStart, aMonthly, bStart, bMonthly) {
    for (let age = bStart; age <= 100; age++) {
      const aTotal = calcNominal(aMonthly, aStart, age);
      const bTotal = calcNominal(bMonthly, bStart, age);
      if (bTotal >= aTotal) return age;
    }
    return null;
  }

  // ─── 전체 계산 ──────────────────────────────────────────────
  function calculate(s) {
    const normalAge = getNormalAge(s.birthYear);
    // 정상 수급개시연령 ±5년 범위만 표시
    const validAges = SCENARIO_AGES.filter(a => a >= Math.max(55, normalAge - 5) && a <= normalAge + 5);

    return validAges.map(startAge => {
      const rate = getRate(startAge, normalAge);
      const national = s.normalMonthly * rate;
      const total = national + s.privateMonthly + s.retirementMonthly;
      return {
        startAge,
        normalAge,
        type: startAge < normalAge ? 'early' : startAge > normalAge ? 'delayed' : 'normal',
        rate,
        national,
        total,
        nominalHealth: calcNominal(total, startAge, s.healthLifeAge),
        nominalExpected: calcNominal(total, startAge, s.expectedLifeAge),
        pvHealth: calcPV(total, startAge, s.healthLifeAge, s.currentAge, s.inflationRate),
        pvExpected: calcPV(total, startAge, s.expectedLifeAge, s.currentAge, s.inflationRate),
      };
    });
  }

  function recommend(scenarios, s) {
    if (!scenarios.length) return null;

    // 건강수명 기준 누적액 최대 시나리오 추천
    const best = [...scenarios].sort((a, b) => b.nominalHealth - a.nominalHealth)[0];

    // 손익분기: 가장 이른 수령 vs 정상수령
    const earliest = scenarios[0];
    const normal = scenarios.find(sc => sc.type === 'normal');
    let breakEven = null;
    if (earliest && normal && earliest.startAge < normal.startAge) {
      breakEven = findBreakEven(earliest.startAge, earliest.total, normal.startAge, normal.total);
    }

    // 추천 메시지 생성
    const typeKr = TYPE_LABEL[best.type];
    let msg = `입력하신 조건에서는 ${best.startAge}세 ${typeKr}이 건강수명(${s.healthLifeAge}세) 기준 누적 수령액이 가장 높습니다.`;
    if (breakEven) {
      msg += ` 조기수령과 정상수령의 손익분기점은 약 ${breakEven}세입니다.`;
    }
    msg += ' 이 결과는 참고용 추정이며, 건강보험료·세금은 포함되지 않습니다.';

    return { best, breakEven, msg };
  }

  // ─── 렌더링 ─────────────────────────────────────────────────
  function renderKpi(scenarios, rec, s) {
    if (!rec) return;

    const { best, breakEven, msg } = rec;
    const earliest = scenarios[0];
    const latest = scenarios[scenarios.length - 1];

    setText('poaRecommended', `${best.startAge}세 ${TYPE_LABEL[best.type]}`);
    setText('poaRecommendedType', `건강수명(${s.healthLifeAge}세) 기준 누적액 최대`);

    if (breakEven) {
      setText('poaBreakEven', `${breakEven}세`);
    } else {
      setText('poaBreakEven', '역전 없음');
    }

    setText('poaMaxCumulative', wonStr(best.nominalHealth));
    setText('poaMaxCumulativeType', `${best.startAge}세 시작 기준`);

    if (earliest) {
      setText('poaEarlyMonthly', monthlyStr(earliest.total));
      setText('poaEarlyLabel', `${earliest.startAge}세 시작 · 지급률 ${(earliest.rate * 100).toFixed(1)}%`);
    }

    if (latest) {
      setText('poaDelayedMonthly', monthlyStr(latest.total));
      setText('poaDelayedLabel', `${latest.startAge}세 시작 · 지급률 ${(latest.rate * 100).toFixed(1)}%`);
    }

    setText('poaMessage', msg);
  }

  function renderTable(scenarios, rec) {
    const tbody = q('poaScenarioBody');
    if (!tbody || !scenarios.length) return;

    const recommendedAge = rec?.best?.startAge;

    tbody.innerHTML = scenarios.map(sc => {
      const isRec = sc.startAge === recommendedAge;
      const rateClass = sc.type === 'early' ? ' class="poa-rate"' : sc.type === 'delayed' ? ' class="poa-rate"' : '';
      const rowClass = isRec ? ' class="is-recommended"' : sc.type === 'early' ? ' class="is-early"' : sc.type === 'delayed' ? ' class="is-delayed"' : '';

      return `<tr${rowClass}>
        <td><strong>${sc.startAge}세</strong>${isRec ? ' <span class="poa-rec-badge">추천</span>' : ''}</td>
        <td>${TYPE_LABEL[sc.type]}</td>
        <td${rateClass}>${(sc.rate * 100).toFixed(1)}%</td>
        <td>${monthlyStr(sc.national)}</td>
        <td>${monthlyStr(sc.total)}</td>
        <td>${sc.nominalHealth > 0 ? wonStr(sc.nominalHealth) : '<span style="color:#aaa">—</span>'}</td>
        <td>${sc.nominalExpected > 0 ? wonStr(sc.nominalExpected) : '<span style="color:#aaa">—</span>'}</td>
        <td>${sc.pvHealth > 0 ? wonStr(sc.pvHealth) : '<span style="color:#aaa">—</span>'}</td>
      </tr>`;
    }).join('');
  }

  function setText(id, text) {
    const el = q(id);
    if (el) el.textContent = text;
  }

  function updateNormalAgeHint() {
    const hint = q('poaNormalAgeHint');
    if (!hint) return;
    const normalAge = getNormalAge(state.birthYear);
    hint.innerHTML = `정상 수급개시연령: <strong>${normalAge}세</strong> / 조기수령 가능: <strong>${normalAge - 5}세~</strong>`;
  }

  // ─── 입력 읽기 ──────────────────────────────────────────────
  function readInputs() {
    state.currentAge      = sanitize(q('poaCurrentAge')?.value, 55, 40);
    state.birthYear       = sanitize(q('poaBirthYear')?.value, 1970, 1950);
    state.normalMonthly   = sanitize(q('poaNational')?.value, 0, 0);
    state.privateMonthly  = sanitize(q('poaPrivate')?.value, 0, 0);
    state.retirementMonthly = sanitize(q('poaRetirement')?.value, 0, 0);
    state.healthLifeAge   = sanitize(q('poaHealthLife')?.value, 82, 65);
    state.expectedLifeAge = sanitize(q('poaExpectedLife')?.value, 90, 65);
    state.inflationRate   = sanitize(q('poaInflation')?.value, 2.0, 0);

    // 건강수명 > 기대수명 자동 보정
    if (state.healthLifeAge > state.expectedLifeAge) {
      state.expectedLifeAge = state.healthLifeAge;
      const el = q('poaExpectedLife');
      if (el) el.value = state.expectedLifeAge;
    }
  }

  // ─── 전체 업데이트 ──────────────────────────────────────────
  function update() {
    readInputs();
    updateNormalAgeHint();
    const scenarios = calculate(state);
    const rec = recommend(scenarios, state);
    renderKpi(scenarios, rec, state);
    renderTable(scenarios, rec);
    syncUrl();
  }

  // ─── URL 동기화 ─────────────────────────────────────────────
  function syncUrl() {
    try {
      const params = new URLSearchParams({
        age: state.currentAge,
        birth: state.birthYear,
        national: state.normalMonthly,
        prv: state.privateMonthly,
        retire: state.retirementMonthly,
        health: state.healthLifeAge,
        expect: state.expectedLifeAge,
        inflation: state.inflationRate,
      });
      const url = `${location.pathname}?${params.toString()}`;
      history.replaceState(null, '', url);
    } catch (_) {}
  }

  function restoreFromUrl() {
    try {
      const params = new URLSearchParams(location.search);
      if (params.has('age'))       state.currentAge         = sanitize(params.get('age'), 55, 40);
      if (params.has('birth'))     state.birthYear          = sanitize(params.get('birth'), 1970, 1950);
      if (params.has('national'))  state.normalMonthly      = sanitize(params.get('national'), 0, 0);
      if (params.has('prv'))       state.privateMonthly     = sanitize(params.get('prv'), 0, 0);
      if (params.has('retire'))    state.retirementMonthly  = sanitize(params.get('retire'), 0, 0);
      if (params.has('health'))    state.healthLifeAge      = sanitize(params.get('health'), 82, 65);
      if (params.has('expect'))    state.expectedLifeAge    = sanitize(params.get('expect'), 90, 65);
      if (params.has('inflation')) state.inflationRate      = sanitize(params.get('inflation'), 2.0, 0);

      // 복원된 값을 DOM에 반영
      const setVal = (id, val) => { const el = q(id); if (el) el.value = val; };
      setVal('poaCurrentAge', state.currentAge);
      setVal('poaBirthYear', state.birthYear);
      setVal('poaNational', state.normalMonthly);
      setVal('poaPrivate', state.privateMonthly);
      setVal('poaRetirement', state.retirementMonthly);
      setVal('poaHealthLife', state.healthLifeAge);
      setVal('poaExpectedLife', state.expectedLifeAge);
      setVal('poaInflation', state.inflationRate);
    } catch (_) {}
  }

  // ─── 리셋 ───────────────────────────────────────────────────
  function resetAll() {
    state = {
      currentAge: 55, birthYear: 1970,
      normalMonthly: 1200000, privateMonthly: 500000, retirementMonthly: 700000,
      healthLifeAge: 82, expectedLifeAge: 90, inflationRate: 2.0,
    };
    const setVal = (id, val) => { const el = q(id); if (el) el.value = val; };
    setVal('poaCurrentAge', 55); setVal('poaBirthYear', 1970);
    setVal('poaNational', 1200000); setVal('poaPrivate', 500000); setVal('poaRetirement', 700000);
    setVal('poaHealthLife', 82); setVal('poaExpectedLife', 90); setVal('poaInflation', 2.0);
    update();
  }

  // ─── 링크 복사 ──────────────────────────────────────────────
  function copyLink() {
    syncUrl();
    navigator.clipboard?.writeText(location.href).catch(() => {});
  }

  // ─── 이벤트 바인딩 ──────────────────────────────────────────
  function bindEvents() {
    const inputs = ['poaCurrentAge','poaBirthYear','poaNational','poaPrivate',
                    'poaRetirement','poaHealthLife','poaExpectedLife','poaInflation'];
    inputs.forEach(id => {
      const el = q(id);
      if (el) el.addEventListener('input', update);
    });

    const resetBtn = q('poaResetBtn');
    if (resetBtn) resetBtn.addEventListener('click', resetAll);

    const copyBtn = q('poaCopyLinkBtn');
    if (copyBtn) copyBtn.addEventListener('click', copyLink);
  }

  // ─── 초기화 ─────────────────────────────────────────────────
  restoreFromUrl();
  bindEvents();
  update();
})();
