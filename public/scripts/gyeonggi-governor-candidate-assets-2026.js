/**
 * 경기도지사 후보 재산·부동산 비교 2026
 * 기능: 금액 단위 토글, 후보 카드 강조, 전체 후보 접기/펼치기
 */

(function () {
  'use strict';

  const dataEl = document.getElementById('ggca-data');
  let candidates = [];
  if (dataEl) {
    try {
      candidates = JSON.parse(dataEl.textContent || '[]');
    } catch (error) {
      console.warn('[ggca] data parse error', error);
    }
  }

  const moneyEls = Array.from(document.querySelectorAll('[data-ggca-money]'));
  const unitButtons = Array.from(document.querySelectorAll('[data-ggca-unit-toggle]'));
  const candidateCards = Array.from(document.querySelectorAll('[data-ggca-candidate-card]'));
  const extraToggle = document.getElementById('ggca-extra-toggle');
  const extraCandidates = document.getElementById('ggca-extra-candidates');

  function formatMoney(value, unit) {
    if (value === null || value === undefined || value === '') return '확인 필요';
    const numeric = Number(value);
    if (Number.isNaN(numeric)) return '확인 필요';
    if (unit === 'manwon') return `${numeric.toLocaleString('ko-KR')}만원`;
    const eok = numeric / 10000;
    return `${Number.isInteger(eok) ? eok.toFixed(0) : eok.toFixed(1)}억`;
  }

  function setUnit(unit) {
    moneyEls.forEach((el) => {
      el.textContent = formatMoney(el.dataset.ggcaMoney, unit);
    });

    unitButtons.forEach((button) => {
      const isActive = button.dataset.ggcaUnitToggle === unit;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  }

  unitButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setUnit(button.dataset.ggcaUnitToggle || 'eok');
    });
  });

  candidateCards.forEach((card) => {
    card.addEventListener('click', () => {
      candidateCards.forEach((item) => item.classList.remove('is-focused'));
      card.classList.add('is-focused');
    });
  });

  if (extraToggle && extraCandidates) {
    extraToggle.addEventListener('click', () => {
      const willOpen = extraCandidates.hidden;
      extraCandidates.hidden = !willOpen;
      extraToggle.setAttribute('aria-expanded', String(willOpen));
      extraToggle.textContent = willOpen ? '전체 후보 접기' : '전체 후보 보기';
    });
  }

  if (candidates.length) {
    document.documentElement.dataset.ggcaLoaded = 'true';
  }
})();
