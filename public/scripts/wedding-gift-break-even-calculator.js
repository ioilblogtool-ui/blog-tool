// wedding-gift-break-even-calculator.js

(function () {
  'use strict';

  // ── 상태 ─────────────────────────────────────────────────────────
  let currentMode = 'simple';
  let lastResult = null;

  // ── 프리셋 데이터 ────────────────────────────────────────────────
  const configEl = document.getElementById('wgbeConfig');
  const PRESETS = configEl ? JSON.parse(configEl.textContent || '{}').presets || [] : [];

  // ── 포맷 유틸 ────────────────────────────────────────────────────
  function fmt(n) {
    if (typeof n !== 'number' || isNaN(n)) return '-';
    const abs = Math.abs(n);
    if (abs >= 100000000) {
      const ub = Math.floor(n / 100000000);
      const rem = Math.round((n % 100000000) / 10000);
      return rem !== 0 ? `${ub}억 ${rem.toLocaleString()}만원` : `${ub}억원`;
    }
    if (abs >= 10000) {
      const man = Math.round(n / 10000);
      return `${man.toLocaleString()}만원`;
    }
    return `${Math.round(n).toLocaleString()}원`;
  }

  function fmtSigned(n) {
    if (typeof n !== 'number' || isNaN(n)) return '-';
    const abs = Math.abs(n);
    const prefix = n >= 0 ? '+' : '-';
    if (abs >= 100000000) {
      const ub = Math.floor(abs / 100000000);
      const rem = Math.round((abs % 100000000) / 10000);
      return rem !== 0 ? `${prefix}${ub}억 ${rem.toLocaleString()}만원` : `${prefix}${ub}억원`;
    }
    if (abs >= 10000) {
      const man = Math.round(abs / 10000);
      return `${prefix}${man.toLocaleString()}만원`;
    }
    return `${prefix}${Math.round(abs).toLocaleString()}원`;
  }

  function fmtGuests(n) {
    return `${Math.round(n).toLocaleString()}명`;
  }

  // ── DOM 헬퍼 ────────────────────────────────────────────────────
  function el(id) { return document.getElementById(id); }

  function numVal(id, fallback = 0) {
    const input = el(id);
    if (!input) return fallback;
    const v = parseFloat(input.value);
    return isNaN(v) ? fallback : v;
  }

  function setVal(id, value) {
    const node = el(id);
    if (node) node.textContent = value;
  }

  // ── 입력값 수집 ──────────────────────────────────────────────────
  function getSimpleInputs() {
    return {
      mealCostPerPerson: numVal('wgbeMealCost', 5.5) * 10000,
      guaranteedGuests: numVal('wgbeGuaranteedGuests', 300),
      expectedGuests: numVal('wgbeExpectedGuests', 280),
      avgGiftAmount: numVal('wgbeAvgGift', 7) * 10000,
      venueFee: numVal('wgbeVenueFee', 100) * 10000,
      decorationFee: numVal('wgbeDecorationFee', 150) * 10000,
      otherFixedCost: numVal('wgbeOtherFixedCost', 50) * 10000,
      mealTicketLossRate: 0,
    };
  }

  function getDetailInputs() {
    const friendCount = numVal('wgbeFriendCount', 60);
    const friendAvgGift = numVal('wgbeFriendAvgGift', 5) * 10000;
    const coworkerCount = numVal('wgbeCoworkerCount', 70);
    const coworkerAvgGift = numVal('wgbeCoworkerAvgGift', 6) * 10000;
    const relativeCount = numVal('wgbeRelativeCount', 80);
    const relativeAvgGift = numVal('wgbeRelativeAvgGift', 10) * 10000;
    const parentsGuestCount = numVal('wgbeParentsGuestCount', 70);
    const parentsGuestAvgGift = numVal('wgbeParentsGuestAvgGift', 10) * 10000;
    const noShowCount = numVal('wgbeNoShowCount', 0);
    const mealTicketLossRate = numVal('wgbeMealTicketLossRate', 0);

    return {
      mealCostPerPerson: numVal('wgbeMealCostDetail', 5.5) * 10000,
      guaranteedGuests: numVal('wgbeGuaranteedGuestsDetail', 300),
      venueFee: numVal('wgbeVenueFeeDetail', 100) * 10000,
      decorationFee: numVal('wgbeDecorationFeeDetail', 150) * 10000,
      otherFixedCost: numVal('wgbeOtherFixedCostDetail', 50) * 10000,
      friendCount,
      friendAvgGift,
      coworkerCount,
      coworkerAvgGift,
      relativeCount,
      relativeAvgGift,
      parentsGuestCount,
      parentsGuestAvgGift,
      noShowCount,
      mealTicketLossRate,
    };
  }

  // ── 계산 로직 ────────────────────────────────────────────────────
  function calcSimple(inputs) {
    const {
      mealCostPerPerson, guaranteedGuests, expectedGuests,
      avgGiftAmount, venueFee, decorationFee, otherFixedCost,
      mealTicketLossRate,
    } = inputs;

    if (mealCostPerPerson <= 0 || guaranteedGuests <= 0 || expectedGuests <= 0 || avgGiftAmount <= 0) {
      return null;
    }

    const effectiveGuestCount = Math.max(guaranteedGuests, expectedGuests);
    const totalMealCost = mealCostPerPerson * effectiveGuestCount * (1 + mealTicketLossRate / 100);
    const totalFixedCost = venueFee + decorationFee + otherFixedCost;
    const totalWeddingCost = totalMealCost + totalFixedCost;
    const totalGiftAmount = avgGiftAmount * expectedGuests;
    const estimatedPnl = totalGiftAmount - totalWeddingCost;
    const breakEvenGiftPerPerson = totalWeddingCost / expectedGuests;
    const breakEvenGuestCount = totalWeddingCost / avgGiftAmount;
    const riskLevel = getRiskLevel(estimatedPnl, totalWeddingCost);

    return {
      effectiveGuestCount,
      totalMealCost,
      totalFixedCost,
      totalWeddingCost,
      totalGiftAmount,
      estimatedPnl,
      breakEvenGiftPerPerson,
      breakEvenGuestCount,
      riskLevel,
      weightedAvgGift: avgGiftAmount,
      guaranteedGuests,
      expectedGuests,
      mealTicketLossRate,
    };
  }

  function calcDetail(inputs) {
    const {
      mealCostPerPerson, guaranteedGuests,
      venueFee, decorationFee, otherFixedCost,
      friendCount, friendAvgGift,
      coworkerCount, coworkerAvgGift,
      relativeCount, relativeAvgGift,
      parentsGuestCount, parentsGuestAvgGift,
      noShowCount, mealTicketLossRate,
    } = inputs;

    const totalGuestCount = friendCount + coworkerCount + relativeCount + parentsGuestCount;

    if (totalGuestCount <= 0 || mealCostPerPerson <= 0 || guaranteedGuests <= 0) {
      return null;
    }

    const rawGiftAmount =
      friendCount * friendAvgGift +
      coworkerCount * coworkerAvgGift +
      relativeCount * relativeAvgGift +
      parentsGuestCount * parentsGuestAvgGift;

    const weightedAvgGift = rawGiftAmount / totalGuestCount;
    const noShowDeduction = noShowCount * weightedAvgGift;
    const totalGiftAmount = Math.max(rawGiftAmount - noShowDeduction, 0);

    const effectiveGuestCount = Math.max(guaranteedGuests, totalGuestCount);
    const totalMealCost = mealCostPerPerson * effectiveGuestCount * (1 + mealTicketLossRate / 100);
    const totalFixedCost = venueFee + decorationFee + otherFixedCost;
    const totalWeddingCost = totalMealCost + totalFixedCost;

    const estimatedPnl = totalGiftAmount - totalWeddingCost;
    const effectiveGuests = totalGuestCount - noShowCount;
    const breakEvenGiftPerPerson = effectiveGuests > 0 ? totalWeddingCost / effectiveGuests : 0;
    const breakEvenGuestCount = weightedAvgGift > 0 ? totalWeddingCost / weightedAvgGift : 0;
    const riskLevel = getRiskLevel(estimatedPnl, totalWeddingCost);

    return {
      effectiveGuestCount,
      totalMealCost,
      totalFixedCost,
      totalWeddingCost,
      totalGiftAmount,
      estimatedPnl,
      breakEvenGiftPerPerson,
      breakEvenGuestCount,
      riskLevel,
      weightedAvgGift,
      totalGuestCount,
      guaranteedGuests,
      expectedGuests: totalGuestCount,
      mealTicketLossRate,
      parentsGuestCount,
      relativeCount,
      friendCount,
    };
  }

  function getRiskLevel(estimatedPnl, totalWeddingCost) {
    if (totalWeddingCost <= 0) return 'NORMAL';
    const ratio = estimatedPnl / totalWeddingCost;
    if (ratio >= 0.1) return 'SAFE';
    if (ratio >= 0) return 'NORMAL';
    if (ratio >= -0.15) return 'CAUTION';
    return 'DANGER';
  }

  const RISK_LABELS = { SAFE: '안정', NORMAL: '보통', CAUTION: '주의', DANGER: '위험' };
  const RISK_COLORS = {
    SAFE: 'var(--color-brand-primary, #16a34a)',
    NORMAL: 'var(--color-brand-mid, #2563eb)',
    CAUTION: 'var(--color-warning, #f59e0b)',
    DANGER: '#E53E3E',
  };

  // ── 해석 문구 ────────────────────────────────────────────────────
  function buildMessages(result) {
    const msgs = [];

    if (result.guaranteedGuests > result.expectedGuests) {
      const diff = result.guaranteedGuests - result.expectedGuests;
      msgs.push(`보증인원이 실제 하객보다 ${diff}명 많아 식대 기준이 ${result.guaranteedGuests}명으로 적용됩니다.`);
    }

    if (result.estimatedPnl < 0) {
      const shortage = Math.abs(result.estimatedPnl);
      msgs.push(`현재 조건 기준으로 약 ${Math.round(shortage / 10000).toLocaleString()}만원 적자가 예상됩니다.`);
      msgs.push(`평균 축의금이 ${Math.ceil(result.breakEvenGiftPerPerson / 10000).toLocaleString()}만원 이상이 되어야 본전입니다.`);
    } else {
      msgs.push(`현재 조건으로 약 ${Math.round(result.estimatedPnl / 10000).toLocaleString()}만원 흑자가 예상됩니다.`);
    }

    if (currentMode === 'detail' && result.totalGuestCount > 0) {
      const elderRatio = (result.parentsGuestCount + result.relativeCount) / result.totalGuestCount;
      const friendRatio = result.friendCount / result.totalGuestCount;
      if (elderRatio > 0.5) {
        msgs.push('친척·부모님 지인 비중이 높아 평균 축의금 방어력이 큰 편입니다.');
      } else if (friendRatio > 0.4) {
        msgs.push('친구 비중이 높으면 평균 축의금이 낮아질 수 있으니 손익분기점을 확인하세요.');
      }
    }

    return msgs;
  }

  // ── 차트 인스턴스 ────────────────────────────────────────────────
  let chartDonut = null;
  let chartBar = null;

  function initCharts() {
    if (typeof Chart === 'undefined') return;
    if (chartDonut || chartBar) return; // 이미 초기화됨

    Chart.defaults.font.family = "'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif";

    const donutCanvas = el('wgbeCostDonut');
    const barCanvas = el('wgbeCompareBar');
    if (!donutCanvas || !barCanvas) return;

    chartDonut = new Chart(donutCanvas, {
      type: 'doughnut',
      data: {
        labels: ['식대', '대관료', '장식·연출', '기타 고정비'],
        datasets: [{
          data: [0, 0, 0, 0],
          backgroundColor: ['#0F6E56', '#1D9E75', '#34D399', '#A7F3D0'],
          borderWidth: 0,
          hoverOffset: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { size: 11 },
              color: '#6B7280',
              boxWidth: 10,
              padding: 8,
            },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const val = ctx.raw;
                const man = Math.round(val / 10000);
                return ` ${man.toLocaleString()}만원`;
              },
            },
          },
        },
      },
    });

    chartBar = new Chart(barCanvas, {
      type: 'bar',
      data: {
        labels: ['총예식비', '총축의금'],
        datasets: [{
          data: [0, 0],
          backgroundColor: ['#E53E3E', '#0F6E56'],
          borderRadius: 8,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const man = Math.round(ctx.raw / 10000);
                return ` ${man.toLocaleString()}만원`;
              },
            },
          },
        },
        scales: {
          x: {
            ticks: {
              font: { size: 10 },
              color: '#9CA3AF',
              callback: (v) => `${Math.round(v / 10000)}만`,
            },
            grid: { color: 'rgba(0,0,0,0.04)' },
          },
          y: {
            ticks: { font: { size: 12 }, color: '#374151' },
            grid: { display: false },
          },
        },
      },
    });
  }

  function updateCharts(result) {
    if (!result || !chartDonut || !chartBar) return;

    // 도넛: 비용 구조
    chartDonut.data.datasets[0].data = [
      result.totalMealCost,
      numVal(currentMode === 'detail' ? 'wgbeVenueFeeDetail' : 'wgbeVenueFee', 0) * 10000,
      numVal(currentMode === 'detail' ? 'wgbeDecorationFeeDetail' : 'wgbeDecorationFee', 0) * 10000,
      numVal(currentMode === 'detail' ? 'wgbeOtherFixedCostDetail' : 'wgbeOtherFixedCost', 0) * 10000,
    ];
    chartDonut.update('none');

    // 바: 총예식비 vs 총축의금
    const isPnlPositive = result.estimatedPnl >= 0;
    chartBar.data.datasets[0].backgroundColor = [
      '#6B7280',
      isPnlPositive ? '#0F6E56' : '#E53E3E',
    ];
    chartBar.data.datasets[0].data = [result.totalWeddingCost, result.totalGiftAmount];
    chartBar.update('none');
  }

  // ── DOM 갱신 ─────────────────────────────────────────────────────
  function updateDOM(result) {
    if (!result) {
      ['wgbeTotalWeddingCost', 'wgbeTotalGiftAmount', 'wgbeEstimatedPnl',
       'wgbeBreakEvenGift', 'wgbeBreakEvenGuests', 'wgbeRiskBadge',
       'wgbeEffectiveGuests', 'wgbeTotalMealCost', 'wgbeTotalFixedCost',
       'wgbeTotalWeddingCostBreakdown'].forEach((id) => setVal(id, '-'));
      const listEl = el('wgbeInterpretationList');
      if (listEl) listEl.innerHTML = '<li>입력값을 확인해주세요.</li>';
      return;
    }

    // 요약 카드
    setVal('wgbeTotalWeddingCost', fmt(result.totalWeddingCost));
    setVal('wgbeTotalGiftAmount', fmt(result.totalGiftAmount));

    const pnlEl = el('wgbeEstimatedPnl');
    if (pnlEl) {
      pnlEl.textContent = fmtSigned(result.estimatedPnl);
      pnlEl.style.color = result.estimatedPnl >= 0 ? 'var(--color-brand-primary, #16a34a)' : '#E53E3E';
    }

    setVal('wgbeBreakEvenGift', fmt(result.breakEvenGiftPerPerson));
    setVal('wgbeBreakEvenGuests', fmtGuests(result.breakEvenGuestCount));

    const riskEl = el('wgbeRiskBadge');
    if (riskEl) {
      riskEl.textContent = RISK_LABELS[result.riskLevel] || result.riskLevel;
      riskEl.style.color = RISK_COLORS[result.riskLevel] || '';
      riskEl.dataset.risk = result.riskLevel;
    }

    // 비용 분해
    setVal('wgbeEffectiveGuests', fmtGuests(result.effectiveGuestCount));
    const mealCostText = result.mealTicketLossRate > 0
      ? `${fmt(result.totalMealCost)} (누수 ${result.mealTicketLossRate}% 반영)`
      : fmt(result.totalMealCost);
    setVal('wgbeTotalMealCost', mealCostText);
    setVal('wgbeTotalFixedCost', fmt(result.totalFixedCost));
    setVal('wgbeTotalWeddingCostBreakdown', fmt(result.totalWeddingCost));

    // 해석 문구
    const listEl = el('wgbeInterpretationList');
    if (listEl) {
      const msgs = buildMessages(result);
      listEl.innerHTML = msgs.map((m) => `<li>${m}</li>`).join('');
    }

    // 차트
    updateCharts(result);
  }

  function updateDetailSummary() {
    const friendCount = numVal('wgbeFriendCount', 0);
    const coworkerCount = numVal('wgbeCoworkerCount', 0);
    const relativeCount = numVal('wgbeRelativeCount', 0);
    const parentsGuestCount = numVal('wgbeParentsGuestCount', 0);
    const friendAvgGift = numVal('wgbeFriendAvgGift', 0) * 10000;
    const coworkerAvgGift = numVal('wgbeCoworkerAvgGift', 0) * 10000;
    const relativeAvgGift = numVal('wgbeRelativeAvgGift', 0) * 10000;
    const parentsGuestAvgGift = numVal('wgbeParentsGuestAvgGift', 0) * 10000;

    const total = friendCount + coworkerCount + relativeCount + parentsGuestCount;
    const totalGift =
      friendCount * friendAvgGift +
      coworkerCount * coworkerAvgGift +
      relativeCount * relativeAvgGift +
      parentsGuestCount * parentsGuestAvgGift;

    setVal('wgbeDetailTotalGuests', `${total}명`);

    const weighted = total > 0 ? totalGift / total : 0;
    const man = Math.round(weighted / 10000 * 10) / 10;
    setVal('wgbeDetailWeightedAvg', `가중평균 ${man}만원`);
  }

  // ── 보증인원 경고 ─────────────────────────────────────────────────
  function updateGuaranteeWarning() {
    if (currentMode === 'simple') {
      const gg = numVal('wgbeGuaranteedGuests', 0);
      const eg = numVal('wgbeExpectedGuests', 0);
      const warningEl = el('wgbeGuaranteeWarning');
      const textEl = el('wgbeGuaranteeWarningText');
      if (warningEl && textEl) {
        if (gg > eg) {
          textEl.textContent = `⚠ 보증인원이 실제 하객보다 ${gg - eg}명 많아 식대 기준이 ${gg}명으로 적용됩니다.`;
          warningEl.hidden = false;
        } else {
          warningEl.hidden = true;
        }
      }
    } else {
      const gg = numVal('wgbeGuaranteedGuestsDetail', 0);
      const totalGuests = numVal('wgbeFriendCount', 0) + numVal('wgbeCoworkerCount', 0) +
        numVal('wgbeRelativeCount', 0) + numVal('wgbeParentsGuestCount', 0);
      const warningEl = el('wgbeGuaranteeWarningDetail');
      const textEl = el('wgbeGuaranteeWarningDetailText');
      if (warningEl && textEl) {
        if (gg > totalGuests && totalGuests > 0) {
          textEl.textContent = `⚠ 보증인원이 하객 합계보다 ${gg - totalGuests}명 많아 식대 기준이 ${gg}명으로 적용됩니다.`;
          warningEl.hidden = false;
        } else {
          warningEl.hidden = true;
        }
      }
    }
  }

  // ── 계산 실행 ────────────────────────────────────────────────────
  function recalculate() {
    let result;
    if (currentMode === 'simple') {
      result = calcSimple(getSimpleInputs());
    } else {
      updateDetailSummary();
      result = calcDetail(getDetailInputs());
    }
    lastResult = result;
    updateGuaranteeWarning();
    updateDOM(result);
    saveToUrl();
  }

  // ── URL param ────────────────────────────────────────────────────
  function saveToUrl() {
    const params = new URLSearchParams();

    if (currentMode === 'detail') {
      params.set('mode', 'detail');
      params.set('mc', numVal('wgbeMealCostDetail', 5.5));
      params.set('gg', numVal('wgbeGuaranteedGuestsDetail', 300));
      params.set('vf', numVal('wgbeVenueFeeDetail', 100));
      params.set('df', numVal('wgbeDecorationFeeDetail', 150));
      params.set('of', numVal('wgbeOtherFixedCostDetail', 50));
      params.set('fc', numVal('wgbeFriendCount', 60));
      params.set('fa', numVal('wgbeFriendAvgGift', 5));
      params.set('cc', numVal('wgbeCoworkerCount', 70));
      params.set('ca', numVal('wgbeCoworkerAvgGift', 6));
      params.set('rc', numVal('wgbeRelativeCount', 80));
      params.set('ra', numVal('wgbeRelativeAvgGift', 10));
      params.set('pc', numVal('wgbeParentsGuestCount', 70));
      params.set('pa', numVal('wgbeParentsGuestAvgGift', 10));
      params.set('ns', numVal('wgbeNoShowCount', 0));
      params.set('ml', numVal('wgbeMealTicketLossRate', 0));
    } else {
      params.set('mc', numVal('wgbeMealCost', 5.5));
      params.set('gg', numVal('wgbeGuaranteedGuests', 300));
      params.set('eg', numVal('wgbeExpectedGuests', 280));
      params.set('ag', numVal('wgbeAvgGift', 7));
      params.set('vf', numVal('wgbeVenueFee', 100));
      params.set('df', numVal('wgbeDecorationFee', 150));
      params.set('of', numVal('wgbeOtherFixedCost', 50));
    }

    const url = new URL(window.location.href);
    url.search = params.toString();
    window.history.replaceState(null, '', url.toString());
  }

  function setInputVal(id, value) {
    const input = el(id);
    if (input) input.value = value;
  }

  function loadFromUrl() {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('mc') && !params.has('mode')) return;

    const mode = params.get('mode') || 'simple';

    if (mode === 'detail') {
      switchMode('detail', false);
      if (params.has('mc')) setInputVal('wgbeMealCostDetail', params.get('mc'));
      if (params.has('gg')) setInputVal('wgbeGuaranteedGuestsDetail', params.get('gg'));
      if (params.has('vf')) setInputVal('wgbeVenueFeeDetail', params.get('vf'));
      if (params.has('df')) setInputVal('wgbeDecorationFeeDetail', params.get('df'));
      if (params.has('of')) setInputVal('wgbeOtherFixedCostDetail', params.get('of'));
      if (params.has('fc')) setInputVal('wgbeFriendCount', params.get('fc'));
      if (params.has('fa')) setInputVal('wgbeFriendAvgGift', params.get('fa'));
      if (params.has('cc')) setInputVal('wgbeCoworkerCount', params.get('cc'));
      if (params.has('ca')) setInputVal('wgbeCoworkerAvgGift', params.get('ca'));
      if (params.has('rc')) setInputVal('wgbeRelativeCount', params.get('rc'));
      if (params.has('ra')) setInputVal('wgbeRelativeAvgGift', params.get('ra'));
      if (params.has('pc')) setInputVal('wgbeParentsGuestCount', params.get('pc'));
      if (params.has('pa')) setInputVal('wgbeParentsGuestAvgGift', params.get('pa'));
      if (params.has('ns')) setInputVal('wgbeNoShowCount', params.get('ns'));
      if (params.has('ml')) setInputVal('wgbeMealTicketLossRate', params.get('ml'));
    } else {
      if (params.has('mc')) { setInputVal('wgbeMealCost', params.get('mc')); setInputVal('wgbeMealCostSlider', params.get('mc')); }
      if (params.has('gg')) setInputVal('wgbeGuaranteedGuests', params.get('gg'));
      if (params.has('eg')) setInputVal('wgbeExpectedGuests', params.get('eg'));
      if (params.has('ag')) { setInputVal('wgbeAvgGift', params.get('ag')); setInputVal('wgbeAvgGiftSlider', params.get('ag')); }
      if (params.has('vf')) setInputVal('wgbeVenueFee', params.get('vf'));
      if (params.has('df')) setInputVal('wgbeDecorationFee', params.get('df'));
      if (params.has('of')) setInputVal('wgbeOtherFixedCost', params.get('of'));
    }
  }

  // ── 모드 탭 전환 ─────────────────────────────────────────────────
  function switchMode(mode, sync = true) {
    currentMode = mode;
    const simplePanel = el('wgbeSimplePanel');
    const detailPanel = el('wgbeDetailPanel');
    const tabBtns = document.querySelectorAll('.wgbe-mode-tab__btn');

    if (simplePanel) simplePanel.hidden = mode !== 'simple';
    if (detailPanel) detailPanel.hidden = mode !== 'detail';

    tabBtns.forEach((btn) => {
      btn.classList.toggle('wgbe-mode-tab__btn--active', btn.dataset.mode === mode);
    });

    if (sync && mode === 'detail') {
      // 간단→상세: 기존값 공통 필드 동기
      setInputVal('wgbeMealCostDetail', numVal('wgbeMealCost', 5.5));
      setInputVal('wgbeGuaranteedGuestsDetail', numVal('wgbeGuaranteedGuests', 300));
      setInputVal('wgbeVenueFeeDetail', numVal('wgbeVenueFee', 100));
      setInputVal('wgbeDecorationFeeDetail', numVal('wgbeDecorationFee', 150));
      setInputVal('wgbeOtherFixedCostDetail', numVal('wgbeOtherFixedCost', 50));
    } else if (sync && mode === 'simple') {
      // 상세→간단: 가중평균과 합계를 반영
      const friendCount = numVal('wgbeFriendCount', 0);
      const coworkerCount = numVal('wgbeCoworkerCount', 0);
      const relativeCount = numVal('wgbeRelativeCount', 0);
      const parentsGuestCount = numVal('wgbeParentsGuestCount', 0);
      const totalGuests = friendCount + coworkerCount + relativeCount + parentsGuestCount;

      if (totalGuests > 0) {
        const totalGift =
          friendCount * (numVal('wgbeFriendAvgGift', 0) * 10000) +
          coworkerCount * (numVal('wgbeCoworkerAvgGift', 0) * 10000) +
          relativeCount * (numVal('wgbeRelativeAvgGift', 0) * 10000) +
          parentsGuestCount * (numVal('wgbeParentsGuestAvgGift', 0) * 10000);
        const weighted = Math.round(totalGift / totalGuests / 10000 * 10) / 10;
        setInputVal('wgbeAvgGift', weighted);
        setInputVal('wgbeAvgGiftSlider', weighted);
        setInputVal('wgbeExpectedGuests', totalGuests);
      }

      setInputVal('wgbeMealCost', numVal('wgbeMealCostDetail', 5.5));
      setInputVal('wgbeMealCostSlider', numVal('wgbeMealCostDetail', 5.5));
      setInputVal('wgbeGuaranteedGuests', numVal('wgbeGuaranteedGuestsDetail', 300));
      setInputVal('wgbeVenueFee', numVal('wgbeVenueFeeDetail', 100));
      setInputVal('wgbeDecorationFee', numVal('wgbeDecorationFeeDetail', 150));
      setInputVal('wgbeOtherFixedCost', numVal('wgbeOtherFixedCostDetail', 50));
    }
  }

  // ── 프리셋 적용 ──────────────────────────────────────────────────
  function applyPreset(preset) {
    setInputVal('wgbeMealCost', preset.mealCostPerPerson / 10000);
    setInputVal('wgbeMealCostSlider', preset.mealCostPerPerson / 10000);
    setInputVal('wgbeGuaranteedGuests', preset.guaranteedGuests);
    setInputVal('wgbeExpectedGuests', preset.expectedGuests);
    setInputVal('wgbeAvgGift', preset.avgGiftAmount / 10000);
    setInputVal('wgbeAvgGiftSlider', preset.avgGiftAmount / 10000);
    setInputVal('wgbeVenueFee', preset.venueFee / 10000);
    setInputVal('wgbeDecorationFee', preset.decorationFee / 10000);
    setInputVal('wgbeOtherFixedCost', preset.otherFixedCost / 10000);
    // 상세 패널 공통 필드도 동기
    setInputVal('wgbeMealCostDetail', preset.mealCostPerPerson / 10000);
    setInputVal('wgbeGuaranteedGuestsDetail', preset.guaranteedGuests);
    setInputVal('wgbeVenueFeeDetail', preset.venueFee / 10000);
    setInputVal('wgbeDecorationFeeDetail', preset.decorationFee / 10000);
    setInputVal('wgbeOtherFixedCostDetail', preset.otherFixedCost / 10000);
  }

  // ── 초기화 ──────────────────────────────────────────────────────
  function resetAll() {
    setInputVal('wgbeMealCost', 5.5);
    setInputVal('wgbeMealCostSlider', 5.5);
    setInputVal('wgbeGuaranteedGuests', 300);
    setInputVal('wgbeExpectedGuests', 280);
    setInputVal('wgbeAvgGift', 7);
    setInputVal('wgbeAvgGiftSlider', 7);
    setInputVal('wgbeVenueFee', 100);
    setInputVal('wgbeDecorationFee', 150);
    setInputVal('wgbeOtherFixedCost', 50);

    setInputVal('wgbeMealCostDetail', 5.5);
    setInputVal('wgbeGuaranteedGuestsDetail', 300);
    setInputVal('wgbeVenueFeeDetail', 100);
    setInputVal('wgbeDecorationFeeDetail', 150);
    setInputVal('wgbeOtherFixedCostDetail', 50);
    setInputVal('wgbeFriendCount', 60);
    setInputVal('wgbeFriendAvgGift', 5);
    setInputVal('wgbeCoworkerCount', 70);
    setInputVal('wgbeCoworkerAvgGift', 6);
    setInputVal('wgbeRelativeCount', 80);
    setInputVal('wgbeRelativeAvgGift', 10);
    setInputVal('wgbeParentsGuestCount', 70);
    setInputVal('wgbeParentsGuestAvgGift', 10);
    setInputVal('wgbeNoShowCount', 0);
    setInputVal('wgbeMealTicketLossRate', 0);

    switchMode('simple', false);
    recalculate();
  }

  // ── 이벤트 바인딩 ────────────────────────────────────────────────
  function bindEvents() {
    // 슬라이더 ↔ 숫자 입력 동기
    const mealSlider = el('wgbeMealCostSlider');
    const mealInput = el('wgbeMealCost');
    if (mealSlider && mealInput) {
      mealSlider.addEventListener('input', () => { mealInput.value = mealSlider.value; recalculate(); });
      mealInput.addEventListener('input', () => { mealSlider.value = mealInput.value; recalculate(); });
    }

    const giftSlider = el('wgbeAvgGiftSlider');
    const giftInput = el('wgbeAvgGift');
    if (giftSlider && giftInput) {
      giftSlider.addEventListener('input', () => { giftInput.value = giftSlider.value; recalculate(); });
      giftInput.addEventListener('input', () => { giftSlider.value = giftInput.value; recalculate(); });
    }

    // 간단 모드 나머지 입력
    ['wgbeGuaranteedGuests', 'wgbeExpectedGuests',
     'wgbeVenueFee', 'wgbeDecorationFee', 'wgbeOtherFixedCost'].forEach((id) => {
      const input = el(id);
      if (input) input.addEventListener('input', recalculate);
    });

    // 상세 모드 입력
    ['wgbeMealCostDetail', 'wgbeGuaranteedGuestsDetail',
     'wgbeVenueFeeDetail', 'wgbeDecorationFeeDetail', 'wgbeOtherFixedCostDetail',
     'wgbeFriendCount', 'wgbeFriendAvgGift',
     'wgbeCoworkerCount', 'wgbeCoworkerAvgGift',
     'wgbeRelativeCount', 'wgbeRelativeAvgGift',
     'wgbeParentsGuestCount', 'wgbeParentsGuestAvgGift',
     'wgbeNoShowCount', 'wgbeMealTicketLossRate'].forEach((id) => {
      const input = el(id);
      if (input) input.addEventListener('input', recalculate);
    });

    // 모드 탭
    document.querySelectorAll('.wgbe-mode-tab__btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        if (mode && mode !== currentMode) {
          switchMode(mode, true);
          recalculate();
        }
      });
    });

    // 프리셋 칩
    document.querySelectorAll('.wgbe-preset-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.presetIndex, 10);
        if (PRESETS[idx]) {
          document.querySelectorAll('.wgbe-preset-chip').forEach((b) => b.classList.remove('wgbe-preset-chip--active'));
          btn.classList.add('wgbe-preset-chip--active');
          applyPreset(PRESETS[idx]);
          recalculate();
        }
      });
    });

    // 초기화 버튼
    const resetBtn = el('wgbeResetBtn');
    if (resetBtn) resetBtn.addEventListener('click', resetAll);

    // 공유 링크 복사
    const copyBtn = el('wgbeCopyLinkBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
          const orig = copyBtn.textContent;
          copyBtn.textContent = '복사됨!';
          setTimeout(() => { copyBtn.textContent = orig; }, 1500);
        });
      });
    }
  }

  // ── 차트 초기화 + 데이터 적용 ───────────────────────────────────
  function tryInitAndRenderCharts() {
    if (typeof Chart === 'undefined') return;
    initCharts(); // 이미 초기화된 경우 내부 guard로 스킵
    if (lastResult) updateCharts(lastResult);
  }

  // ── 초기 실행 ────────────────────────────────────────────────────
  function init() {
    loadFromUrl();
    bindEvents();
    recalculate(); // DOM 갱신 + lastResult 저장

    // 즉시 시도 (Chart.js가 blocking script로 이미 실행된 경우)
    tryInitAndRenderCharts();

    // 모든 리소스 로드 완료 후 fallback (CDN 지연 대응)
    // initCharts 내부 guard 덕분에 이중 초기화 없음
    window.addEventListener('load', tryInitAndRenderCharts, { once: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
