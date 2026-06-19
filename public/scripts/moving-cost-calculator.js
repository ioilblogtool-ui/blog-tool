(function () {
  'use strict';

  const cfgEl = document.getElementById('mccConfig');
  if (!cfgEl) return;

  const cfg = JSON.parse(cfgEl.textContent);
  const state = {
    ...cfg.defaults,
    checkedRisks: [],
  };

  function roundManwon(value) {
    return Math.round(value / 10000) * 10000;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function formatWonShort(value) {
    const rounded = roundManwon(Math.max(0, value));
    if (rounded >= 100000000) return `${(rounded / 100000000).toFixed(1)}억원`;
    if (rounded >= 10000) return `${Math.round(rounded / 10000).toLocaleString('ko-KR')}만원`;
    return `${rounded.toLocaleString('ko-KR')}원`;
  }

  function setText(key, value) {
    document.querySelectorAll(`[data-mcc-result="${key}"]`).forEach((el) => {
      el.textContent = value;
    });
  }

  function setHtml(key, value) {
    document.querySelectorAll(`[data-mcc-result="${key}"]`).forEach((el) => {
      el.innerHTML = value;
    });
  }

  function getByValue(list, value) {
    return list.find((item) => item.value === value) || list[0];
  }

  function getBand(pyeong) {
    return cfg.baseBands.find((band) => pyeong >= band.minPyeong && pyeong <= band.maxPyeong) || cfg.baseBands[cfg.baseBands.length - 1];
  }

  function applyRate(range, rate) {
    return {
      min: range.min * rate,
      max: range.max * rate,
    };
  }

  function getBaseRange() {
    const band = getBand(state.pyeong);
    if (state.type === 'semi') return applyRate(band.full, band.semiRate);
    if (state.type === 'basic') return applyRate(band.full, band.basicRate);
    return band.full;
  }

  function getDistanceFee() {
    if (state.distanceKm <= 30) return { min: 0, max: 0 };
    if (state.distanceKm <= 80) return { min: 100000, max: 250000 };
    return { min: 250000, max: 600000 };
  }

  function getLadderFee() {
    const ladder = getByValue(cfg.ladderOptions, state.ladder);
    const floor = getByValue(cfg.floorOptions, state.floor);
    return {
      min: ladder.min * floor.ladderFactor,
      max: ladder.max * floor.ladderFactor,
    };
  }

  function calculate() {
    const base = getBaseRange();
    const volume = getByValue(cfg.volumeOptions, state.volume);
    const region = getByValue(cfg.regionOptions, state.region);
    const distanceFee = getDistanceFee();
    const ladderFee = getLadderFee();

    const baseAdjusted = {
      min: base.min * volume.factor,
      max: base.max * volume.factor,
    };
    const subtotal = {
      min: baseAdjusted.min + distanceFee.min + ladderFee.min,
      max: baseAdjusted.max + distanceFee.max + ladderFee.max,
    };
    const dateFactor = state.peak ? { min: 1.1, max: 1.25 } : { min: 1, max: 1 };
    const estimated = {
      min: roundManwon(subtotal.min * dateFactor.min * region.minFactor),
      max: roundManwon(subtotal.max * dateFactor.max * region.maxFactor),
    };
    const dateRegion = {
      min: Math.max(0, estimated.min - subtotal.min),
      max: Math.max(0, estimated.max - subtotal.max),
    };
    const extra = {
      min: roundManwon(distanceFee.min + ladderFee.min + dateRegion.min),
      max: roundManwon(distanceFee.max + ladderFee.max + dateRegion.max),
    };

    return {
      estimated,
      midpoint: roundManwon((estimated.min + estimated.max) / 2),
      extra,
      band: getBand(state.pyeong),
      breakdown: [
        { key: 'base', label: '기본 이사비', range: baseAdjusted, badge: '추정' },
        { key: 'distance', label: '거리 가산', range: distanceFee, badge: '추정' },
        { key: 'ladder', label: '사다리차', range: ladderFee, badge: '추정' },
        { key: 'date', label: '날짜·지역 보정', range: dateRegion, badge: '추정' },
      ],
    };
  }

  function getGradeText(result) {
    const width = result.estimated.max - result.estimated.min;
    if (state.peak || state.distanceKm > 80 || state.volume === 'high') return '상단 견적 가능';
    if (width >= 800000) return '조건 확인 필요';
    return '비교 견적 권장';
  }

  function renderKpis(result) {
    setText('range', `약 ${formatWonShort(result.estimated.min)}~${formatWonShort(result.estimated.max)}`);
    setText('midpoint', `약 ${formatWonShort(result.midpoint)}`);
    setText('extra', `약 ${formatWonShort(result.extra.min)}~${formatWonShort(result.extra.max)}`);
    setText('grade', getGradeText(result));
  }

  function renderSummary(result) {
    const type = getByValue(cfg.typeOptions, state.type);
    const ladder = getByValue(cfg.ladderOptions, state.ladder);
    const volume = getByValue(cfg.volumeOptions, state.volume);
    const peakText = state.peak ? '손없는날·주말·월말 조건' : '일반일 조건';
    setHtml(
      'summary',
      `<strong>${state.pyeong}평 ${type.label}</strong>, ${state.distanceKm}km 이동, 사다리차 ${ladder.label}, 짐 ${volume.label}, ${peakText} 기준입니다. 참고 견적 범위는 <strong>약 ${formatWonShort(result.estimated.min)}~${formatWonShort(result.estimated.max)}</strong>입니다.`
    );
    setText('bandNote', `${result.band.label} · ${result.band.note}`);
  }

  function renderBreakdown(result) {
    const bars = document.getElementById('mccBreakdownBars');
    const tbody = document.getElementById('mccBreakdownTable');
    const maxTotal = result.breakdown.reduce((sum, item) => sum + item.range.max, 0);

    if (bars) {
      bars.innerHTML = result.breakdown
        .filter((item) => item.range.max > 0)
        .map((item) => {
          const width = maxTotal > 0 ? clamp(Math.round((item.range.max / maxTotal) * 100), 5, 100) : 0;
          return `<div class="mcc-bar-row">
            <span>${item.label}</span>
            <div class="mcc-bar-track"><div class="mcc-bar-fill" style="width:${width}%"></div></div>
            <strong>${formatWonShort(item.range.max)}</strong>
          </div>`;
        })
        .join('');
    }

    if (tbody) {
      tbody.innerHTML = result.breakdown
        .map((item) => `<tr>
          <td>${item.label} <span class="mcc-badge">${item.badge}</span></td>
          <td>${formatWonShort(item.range.min)}~${formatWonShort(item.range.max)}</td>
          <td>${formatWonShort((item.range.min + item.range.max) / 2)}</td>
        </tr>`)
        .join('');
    }
  }

  function renderRiskText() {
    const count = state.checkedRisks.length;
    const highCount = state.checkedRisks.filter((id) => {
      const item = cfg.checklist.find((entry) => entry.id === id);
      return item && item.risk === '높음';
    }).length;

    if (count === 0) {
      setText('riskText', '견적 전 해당되는 추가비 항목을 체크해 보세요.');
      return;
    }

    setText('riskText', `추가비 확인 항목 ${count}개, 그중 위험도 높은 항목 ${highCount}개가 있습니다.`);
  }

  function syncInputs() {
    document.querySelectorAll('[data-mcc]').forEach((el) => {
      const key = el.dataset.mcc;
      if (el.type === 'checkbox') {
        el.checked = Boolean(state[key]);
      } else {
        el.value = state[key];
      }
    });
    document.querySelectorAll('[data-mcc-num]').forEach((el) => {
      const key = el.dataset.mccNum;
      el.value = Number(state[key]).toLocaleString('ko-KR');
    });
  }

  function updateActivePresets() {
    document.querySelectorAll('[data-mcc-pyeong]').forEach((button) => {
      button.classList.toggle('is-active', Number(button.dataset.mccPyeong) === Number(state.pyeong));
    });
    document.querySelectorAll('[data-mcc-distance]').forEach((button) => {
      button.classList.toggle('is-active', Number(button.dataset.mccDistance) === Number(state.distanceKm));
    });
  }

  function syncUrl() {
    const params = new URLSearchParams();
    params.set('py', state.pyeong);
    params.set('km', state.distanceKm);
    params.set('type', state.type);
    params.set('ladder', state.ladder);
    params.set('floor', state.floor);
    params.set('peak', state.peak ? '1' : '0');
    params.set('volume', state.volume);
    params.set('region', state.region);
    history.replaceState(null, '', `?${params.toString()}`);
  }

  function restoreFromUrl() {
    const params = new URLSearchParams(location.search);
    if (params.has('py')) state.pyeong = clamp(Number(params.get('py')) || cfg.defaults.pyeong, 1, 99);
    if (params.has('km')) state.distanceKm = clamp(Number(params.get('km')) || cfg.defaults.distanceKm, 1, 200);
    ['type', 'ladder', 'floor', 'volume', 'region'].forEach((key) => {
      if (params.has(key)) state[key] = params.get(key);
    });
    if (params.has('peak')) state.peak = params.get('peak') === '1';
  }

  function update() {
    const result = calculate();
    renderKpis(result);
    renderSummary(result);
    renderBreakdown(result);
    renderRiskText();
    syncInputs();
    updateActivePresets();
    syncUrl();
  }

  function bindEvents() {
    document.querySelectorAll('[data-mcc]').forEach((el) => {
      const eventName = el.tagName === 'SELECT' ? 'change' : 'input';
      el.addEventListener(eventName, () => {
        const key = el.dataset.mcc;
        state[key] = el.type === 'number' || el.type === 'range' ? Number(el.value) : el.value;
        update();
      });
    });

    document.querySelectorAll('[data-mcc-num]').forEach((el) => {
      el.addEventListener('change', () => {
        const key = el.dataset.mccNum;
        const raw = Number(el.value.replace(/,/g, ''));
        if (!Number.isNaN(raw)) state[key] = clamp(raw, 1, key === 'distanceKm' ? 200 : 99);
        update();
      });
    });

    document.querySelectorAll('[data-mcc-bool]').forEach((el) => {
      el.addEventListener('change', () => {
        state[el.dataset.mccBool] = el.checked;
        update();
      });
    });

    document.querySelectorAll('[data-mcc-pyeong]').forEach((button) => {
      button.addEventListener('click', () => {
        state.pyeong = Number(button.dataset.mccPyeong);
        update();
      });
    });

    document.querySelectorAll('[data-mcc-distance]').forEach((button) => {
      button.addEventListener('click', () => {
        state.distanceKm = Number(button.dataset.mccDistance);
        update();
      });
    });

    document.querySelectorAll('[data-mcc-check]').forEach((el) => {
      el.addEventListener('change', () => {
        state.checkedRisks = Array.from(document.querySelectorAll('[data-mcc-check]:checked')).map((item) => item.dataset.mccCheck);
        renderRiskText();
      });
    });

    const resetBtn = document.getElementById('mccResetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        Object.assign(state, cfg.defaults, { checkedRisks: [] });
        document.querySelectorAll('[data-mcc-check]').forEach((el) => { el.checked = false; });
        update();
      });
    }

    const copyBtn = document.getElementById('mccCopyLinkBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        syncUrl();
        try {
          await navigator.clipboard.writeText(location.href);
          copyBtn.textContent = '링크 복사 완료';
          setTimeout(() => { copyBtn.textContent = '링크 복사'; }, 1600);
        } catch (error) {
          copyBtn.textContent = '주소창 링크를 복사하세요';
        }
      });
    }
  }

  function init() {
    restoreFromUrl();
    bindEvents();
    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
