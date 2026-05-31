/**
 * 청년미래적금 vs 청년도약계좌 비교 리포트 2026
 * 기능: 소득 구간 탭 전환 → 추천 카드 하이라이트
 */

(function () {
  'use strict';

  const tabsEl = document.getElementById('yscIncomeTabs');
  const cardsEl = document.getElementById('yscIncomeCards');

  if (!tabsEl || !cardsEl) return;

  const tabs = tabsEl.querySelectorAll('.ysc-tab-btn');
  const cards = cardsEl.querySelectorAll('.ysc-income-card');

  function switchTab(group) {
    // 탭 active 전환
    tabs.forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.income === group);
    });

    // 카드 visible 전환
    cards.forEach((card) => {
      card.classList.toggle('is-visible', card.dataset.income === group);
    });
  }

  tabsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.ysc-tab-btn');
    if (!btn) return;
    switchTab(btn.dataset.income);
  });

  // 초기 상태: 첫 번째 탭 active (SSR에서 이미 처리되지만 JS에서도 보장)
  const firstTab = tabsEl.querySelector('.ysc-tab-btn');
  if (firstTab && !tabsEl.querySelector('.ysc-tab-btn.is-active')) {
    switchTab(firstTab.dataset.income);
  }
})();
