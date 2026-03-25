// salary-tier.js
// 연봉 티어 계산기 — 클라이언트 스크립트

(function () {
  const raw = document.getElementById('salaryTierData');
  if (!raw) return;
  const seed   = JSON.parse(raw.textContent || '{}');
  const DATA   = seed.data  || [];
  const AVG    = seed.avg   || 0;
  const MAX_SAL = Math.max(...DATA.map(d => d.sal));

  const TIER_COLOR = { s: '#9FE1CB', a: '#C0DD97', b: '#D3D1C7', c: '#FAC775' };
  const TIER_TEXT  = { s: '#085041', a: '#27500A', b: '#444441', c: '#633806' };
  const TIER_META  = {
    s: 'S티어 · 9,000만원 이상',
    a: 'A티어 · 6,000 — 9,000만원',
    b: 'B티어 · 5,000 — 6,500만원',
    c: 'C티어 · 5,000만원 미만',
  };

  let curFilter = 'all';
  let curSort   = 'desc';
  let mySal     = null;

  // ── URL 파라미터 복원 ──────────────────────────────────────────────────────
  const params = new URLSearchParams(location.search);
  const paramSal = parseInt(params.get('sal') || '', 10);
  if (paramSal > 0) {
    mySal = paramSal;
    const inp = document.getElementById('stMySalInput');
    if (inp) inp.value = String(paramSal);
  }

  // ── 필터/정렬 ─────────────────────────────────────────────────────────────
  function getFiltered() {
    let d = curFilter === 'all'
      ? [...DATA]
      : DATA.filter(x => x.cat === curFilter);
    if (curSort === 'desc') d.sort((a, b) => b.sal - a.sal);
    else if (curSort === 'asc') d.sort((a, b) => a.sal - b.sal);
    else d.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
    return d;
  }

  // ── 요약 바 렌더링 ─────────────────────────────────────────────────────────
  function renderSummaryBar(filtered) {
    const el = document.getElementById('stSummaryBar');
    if (!el) return;
    const sals = filtered.map(x => x.sal);
    const avg  = sals.length ? Math.round(sals.reduce((a, b) => a + b, 0) / sals.length) : 0;
    const max  = sals.length ? Math.max(...sals) : 0;
    const min  = sals.length ? Math.min(...sals) : 0;
    el.innerHTML = `
      <div class="st-sum-cell">
        <div class="st-sum-num">${filtered.length}<span>개</span></div>
        <div class="st-sum-label">표시 기업</div>
      </div>
      <div class="st-sum-cell">
        <div class="st-sum-num st-sum-num--high">${max.toLocaleString('ko-KR')}<span>만</span></div>
        <div class="st-sum-label">최고 연봉</div>
      </div>
      <div class="st-sum-cell">
        <div class="st-sum-num">${avg.toLocaleString('ko-KR')}<span>만</span></div>
        <div class="st-sum-label">필터 평균</div>
      </div>
      <div class="st-sum-cell">
        <div class="st-sum-num st-sum-num--low">${min.toLocaleString('ko-KR')}<span>만</span></div>
        <div class="st-sum-label">최저 연봉</div>
      </div>
    `;
  }

  // ── 바 차트 렌더링 ─────────────────────────────────────────────────────────
  function renderChart() {
    const area = document.getElementById('stChartArea');
    if (!area) return;
    const filtered = getFiltered();
    renderSummaryBar(filtered);

    const myPct = mySal ? Math.round((mySal / MAX_SAL) * 100) : null;
    let html = '';

    for (const tier of ['s', 'a', 'b', 'c']) {
      const rows = filtered.filter(x => x.tier === tier);
      if (!rows.length) continue;
      html += `<div class="st-tier-label">
        <span style="width:8px;height:8px;border-radius:50%;background:${TIER_COLOR[tier]};display:inline-block;flex-shrink:0;"></span>
        ${TIER_META[tier]}
      </div>`;
      for (const co of rows) {
        const pct = Math.round((co.sal / MAX_SAL) * 100);
        html += `<div class="st-bar-row">
          <div class="st-bar-company" title="${co.name}">${co.name}</div>
          <div class="st-bar-track">
            <div class="st-bar-fill" style="width:${pct}%;background:${TIER_COLOR[tier]};">
              <span class="st-bar-val" style="color:${TIER_TEXT[tier]};">${co.sal.toLocaleString('ko-KR')}만</span>
              ${co.note ? `<span class="st-bar-note">${co.note}</span>` : ''}
            </div>
            ${myPct != null ? `<div class="st-my-line" style="left:${myPct}%;"></div>` : ''}
          </div>
        </div>`;
      }
    }
    area.innerHTML = html;
  }

  // ── 내 연봉 계산 ───────────────────────────────────────────────────────────
  function updateMyPos() {
    const inp = document.getElementById('stMySalInput');
    const val = inp ? parseInt(inp.value, 10) : NaN;
    const card = document.getElementById('stResultCard');
    const hint = document.getElementById('stMySalHint');

    if (!val || val < 500) {
      mySal = null;
      if (card) card.hidden = true;
      if (hint) hint.textContent = '입력하면 위치를 바로 보여드려요';
      renderChart();
      return;
    }

    mySal = val;
    renderChart();

    const allSals = [...DATA].map(x => x.sal).sort((a, b) => a - b);
    const rank = allSals.filter(s => s <= val).length;
    const pct  = Math.round((rank / allSals.length) * 100);
    const diff = val - AVG;
    const diffStr = diff >= 0
      ? `+${diff.toLocaleString('ko-KR')}만`
      : `${diff.toLocaleString('ko-KR')}만`;

    const tier = val >= 9000 ? 'S' : val >= 6000 ? 'A' : val >= 5000 ? 'B' : 'C';
    const similar = DATA.filter(x => Math.abs(x.sal - val) <= 500).slice(0, 4).map(x => x.name);
    const above   = DATA
      .filter(x => x.sal > val)
      .sort((a, b) => a.sal - b.sal)
      .slice(0, 2)
      .map(x => `${x.name}(${x.sal.toLocaleString('ko-KR')}만)`);

    const titleEl   = document.getElementById('stResultTitle');
    const pctEl     = document.getElementById('stRPct');
    const diffEl    = document.getElementById('stRDiff');
    const tierEl    = document.getElementById('stRTier');
    const similarEl = document.getElementById('stSimilarText');

    if (titleEl)   titleEl.textContent = `내 연봉 ${val.toLocaleString('ko-KR')}만원 기준`;
    if (pctEl)     pctEl.textContent   = `${pct}%`;
    if (diffEl)    diffEl.textContent  = diffStr;
    if (tierEl)    tierEl.textContent  = tier + '티어';

    // tier highlight
    if (tierEl) {
      const tierColors = { S: '#9FE1CB', A: '#C0DD97', B: '#D3D1C7', C: '#FAC775' };
      const tierText   = { S: '#085041', A: '#27500A', B: '#444441', C: '#633806' };
      tierEl.style.background = tierColors[tier] || '';
      tierEl.style.color      = tierText[tier]   || '';
    }

    let simHTML = '';
    if (similar.length) simHTML += `비슷한 수준의 기업: <strong>${similar.join(', ')}</strong><br>`;
    if (above.length)   simHTML += `<span class="st-above-note">바로 위 기업: ${above.join(' · ')}</span>`;
    if (similarEl) similarEl.innerHTML = simHTML || '비교 구간 내 데이터가 없습니다.';

    if (card) card.hidden = false;
    if (hint) hint.innerHTML = `<strong>상위 ${pct}%</strong> · 평균 대비 ${diffStr} · ${tier}티어`;

    // URL 파라미터 업데이트 (히스토리 교체)
    const url = new URL(location.href);
    url.searchParams.set('sal', String(val));
    history.replaceState(null, '', url.toString());
  }

  // ── 이벤트 바인딩 ─────────────────────────────────────────────────────────
  const salInput = document.getElementById('stMySalInput');
  if (salInput) salInput.addEventListener('input', updateMyPos);

  document.querySelectorAll('.st-ftab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.st-ftab').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      curFilter = btn.dataset.filter || 'all';
      renderChart();
    });
  });

  const sortSel = document.getElementById('stSortSel');
  if (sortSel) {
    sortSel.addEventListener('change', () => {
      curSort = sortSel.value;
      renderChart();
    });
  }

  // 링크 복사
  const copyBtn = document.getElementById('stCopyBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard?.writeText(location.href).then(() => {
        copyBtn.textContent = '복사 완료!';
        setTimeout(() => { copyBtn.textContent = '링크 복사'; }, 2000);
      });
    });
  }

  // ── 초기 렌더링 ───────────────────────────────────────────────────────────
  renderChart();
  if (mySal) updateMyPos();
})();
