(function () {
  'use strict';

  // 점수 계산
  const BASE_SCORE = { 1: 70, 2: 55, 3: 40, 4: 25, 5: 25 };
  const AGE_BONUS = { '0-5': 10, '6-11': 5, '12-17': 0, '18-23': 3, '24+': 8 };
  const URGENCY_BONUS = { asap: -10, '3m': 0, '6m': 5, anytime: 10 };
  const CLASS_LABELS = {
    '0-5': '0세반 (정원 3명)', '6-11': '0세반 후반 (정원 3명)',
    '12-17': '1세반 (정원 5명)', '18-23': '1세반 후반 (정원 5명)',
    '24+': '2세반 이상 (정원 7명↑)',
  };
  const URGENCY_LABELS = { asap: '1개월 내', '3m': '3개월 내', '6m': '6개월 내', anytime: '언제든 가능' };

  function calcScore(rank, ageGroup, isDualIncome, hasSibling, urgency) {
    const base = BASE_SCORE[Math.min(rank, 5)] ?? 0;
    const dual = isDualIncome ? 20 : 0;
    const sib = hasSibling ? 15 : 0;
    const age = AGE_BONUS[ageGroup] ?? 0;
    const urg = URGENCY_BONUS[urgency] ?? 0;
    return Math.max(0, Math.min(100, base + dual + sib + age + urg));
  }

  function getLevel(score) {
    if (score >= 80) return { level: 'high',     label: '가능성 높음',      icon: '✅', probability: '약 65~80%' };
    if (score >= 50) return { level: 'medium',   label: '가능성 중간',      icon: '⚠️', probability: '약 35~65%' };
    if (score >= 30) return { level: 'low',      label: '가능성 낮음',      icon: '🔶', probability: '약 15~35%' };
    return              { level: 'very-low', label: '가능성 매우 낮음', icon: '❌', probability: '약 15% 미만' };
  }

  function buildChecks(rank, ageGroup, isDualIncome, hasSibling) {
    return [
      {
        label: '맞벌이 가정',
        met: isDualIncome,
        impact: isDualIncome ? '2순위 우선순위 적용' : '해당 없음 (맞벌이면 +20점)',
      },
      {
        label: `대기순번 ${rank}번`,
        met: rank <= 3,
        impact: rank <= 3 ? '유리한 위치' : '경쟁 높음 (3번 이내면 유리)',
      },
      {
        label: '형제·자매 해당 어린이집 재원',
        met: hasSibling,
        impact: hasSibling ? '2순위 혜택 적용 (+15점)' : '해당 없음 (있으면 +15점)',
      },
      {
        label: CLASS_LABELS[ageGroup],
        met: ageGroup === '0-5' || ageGroup === '6-11',
        impact: ageGroup === '0-5' || ageGroup === '6-11'
          ? '정원 3명 · 회전율 높음'
          : '정원 5명 이상 · 일반 경쟁',
      },
    ];
  }

  function buildPhoneMent(rank, isDualIncome, urgency) {
    const urgMap = { asap: '가능한 빨리', '3m': '3개월 이내', '6m': '6개월 이내', anytime: '여유 있게' };
    const dual = isDualIncome ? '\n맞벌이 가정이라 복직 준비 중이고,' : '';
    return `"안녕하세요, 현재 대기 ${rank}번으로 등록된 아이 보호자입니다.${dual}\n입소 시점을 ${urgMap[urgency]}로 계획하고 있는데,\n현재 자리 상황과 예상 시점을 여쭤볼 수 있을까요?"`;
  }

  // DOM 참조
  const rankSlider  = document.getElementById('dwcRankSlider');
  const rankVal     = document.getElementById('dwcRankVal');
  const ageButtons  = document.querySelectorAll('[data-dwc-age]');
  const dualToggle  = document.getElementById('dwcDualIncome');
  const sibToggle   = document.getElementById('dwcSibling');
  const urgButtons  = document.querySelectorAll('[data-dwc-urgency]');

  const resultCard  = document.getElementById('dwcResultCard');
  const scoreEl     = document.getElementById('dwcScore');
  const levelEl     = document.getElementById('dwcLevel');
  const probEl      = document.getElementById('dwcProbability');
  const checkList   = document.getElementById('dwcChecklist');
  const phoneMentEl = document.getElementById('dwcPhoneMent');
  const copyBtn     = document.getElementById('dwcCopyBtn');
  const tipsEl      = document.getElementById('dwcTips');

  // 상태
  let state = { rank: 3, ageGroup: '12-17', isDualIncome: true, hasSibling: false, urgency: '3m' };

  function render() {
    const { rank, ageGroup, isDualIncome, hasSibling, urgency } = state;
    const score = calcScore(rank, ageGroup, isDualIncome, hasSibling, urgency);
    const lvl = getLevel(score);
    const checks = buildChecks(rank, ageGroup, isDualIncome, hasSibling);
    const ment = buildPhoneMent(rank, isDualIncome, urgency);

    // 결과 카드 레벨 클래스
    if (resultCard) {
      resultCard.className = `dwc-result-card dwc-result-card--${lvl.level}`;
    }
    if (scoreEl)  scoreEl.textContent  = `${score}점`;
    if (levelEl)  levelEl.textContent  = `${lvl.icon} ${lvl.label}`;
    if (probEl)   probEl.textContent   = `입소 가능성 ${lvl.probability}`;

    // 체크리스트
    if (checkList) {
      checkList.innerHTML = checks.map(c => `
        <li class="dwc-check-item ${c.met ? 'dwc-check-item--met' : 'dwc-check-item--unmet'}">
          <span class="dwc-check-icon">${c.met ? '✅' : '⬜'}</span>
          <span class="dwc-check-label">${c.label}</span>
          <span class="dwc-check-impact">${c.impact}</span>
        </li>
      `).join('');
    }

    // 전화 멘트
    if (phoneMentEl) phoneMentEl.textContent = ment;

    // URL 파라미터 동기화
    try {
      const url = new URL(location.href);
      url.searchParams.set('rank', rank);
      url.searchParams.set('age', ageGroup);
      url.searchParams.set('dual', isDualIncome ? '1' : '0');
      url.searchParams.set('sib', hasSibling ? '1' : '0');
      url.searchParams.set('urg', urgency);
      history.replaceState(null, '', url.toString());
    } catch (_) {}
  }

  // 이벤트 바인딩
  if (rankSlider) {
    rankSlider.addEventListener('input', () => {
      state.rank = parseInt(rankSlider.value, 10);
      if (rankVal) rankVal.textContent = `${state.rank}번`;
      render();
    });
  }

  ageButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      ageButtons.forEach(b => b.classList.remove('dwc-btn--active'));
      btn.classList.add('dwc-btn--active');
      state.ageGroup = btn.dataset.dwcAge;
      render();
    });
  });

  urgButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      urgButtons.forEach(b => b.classList.remove('dwc-btn--active'));
      btn.classList.add('dwc-btn--active');
      state.urgency = btn.dataset.dwcUrgency;
      render();
    });
  });

  if (dualToggle) {
    dualToggle.addEventListener('change', () => {
      state.isDualIncome = dualToggle.checked;
      render();
    });
  }

  if (sibToggle) {
    sibToggle.addEventListener('change', () => {
      state.hasSibling = sibToggle.checked;
      render();
    });
  }

  // 복사 버튼
  if (copyBtn && phoneMentEl) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(phoneMentEl.textContent ?? '').then(() => {
        copyBtn.textContent = '복사됨!';
        setTimeout(() => { copyBtn.textContent = '복사'; }, 1500);
      });
    });
  }

  // 초기화 버튼
  const resetBtn = document.getElementById('dwcResetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state = { rank: 3, ageGroup: '12-17', isDualIncome: true, hasSibling: false, urgency: '3m' };
      if (rankSlider) { rankSlider.value = '3'; }
      if (rankVal) rankVal.textContent = '3번';
      ageButtons.forEach(b => {
        b.classList.toggle('dwc-btn--active', b.dataset.dwcAge === '12-17');
      });
      urgButtons.forEach(b => {
        b.classList.toggle('dwc-btn--active', b.dataset.dwcUrgency === '3m');
      });
      if (dualToggle) dualToggle.checked = true;
      if (sibToggle)  sibToggle.checked  = false;
      render();
    });
  }

  // 링크 복사
  const copyLinkBtn = document.getElementById('dwcCopyLinkBtn');
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(location.href).then(() => {
        copyLinkBtn.textContent = '링크 복사됨!';
        setTimeout(() => { copyLinkBtn.textContent = '링크 복사'; }, 1500);
      });
    });
  }

  // URL 파라미터 복원
  try {
    const p = new URLSearchParams(location.search);
    if (p.get('rank')) state.rank = parseInt(p.get('rank'), 10);
    if (p.get('age'))  state.ageGroup = p.get('age');
    if (p.get('dual') !== null) state.isDualIncome = p.get('dual') === '1';
    if (p.get('sib')  !== null) state.hasSibling   = p.get('sib')  === '1';
    if (p.get('urg'))  state.urgency = p.get('urg');

    if (rankSlider) rankSlider.value = String(state.rank);
    if (rankVal)    rankVal.textContent = `${state.rank}번`;
    ageButtons.forEach(b => b.classList.toggle('dwc-btn--active', b.dataset.dwcAge === state.ageGroup));
    urgButtons.forEach(b => b.classList.toggle('dwc-btn--active', b.dataset.dwcUrgency === state.urgency));
    if (dualToggle) dualToggle.checked = state.isDualIncome;
    if (sibToggle)  sibToggle.checked  = state.hasSibling;
  } catch (_) {}

  render();
})();
