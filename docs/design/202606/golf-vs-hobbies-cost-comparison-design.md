# 골프 vs 다른 취미 비용 비교 — 설계 문서

## 1. 개요

- **슬러그**: `reports/golf-vs-hobbies-cost-comparison`
- **유형**: 리포트 (BaseLayout 직접 사용)
- **prefix**: `ghc-`
- **데이터 파일**: `src/data/golfVsHobbiesCost2026.ts`

---

## 2. 데이터 파일 (`src/data/golfVsHobbiesCost2026.ts`)

```ts
export type HobbyCategory = "outdoor" | "indoor" | "watersport" | "racket" | "fitness";

export interface HobbyCostEntry {
  id: string;
  name: string;
  category: HobbyCategory;
  emoji: string;
  monthlyMin: number;
  monthlyMax: number;
  monthlyAvg: number;
  initialCost: number;       // 초기 장비·가입비
  annualCost: number;        // monthlyAvg × 12
  fiveYearTotal: number;     // initialCost + annualCost × 5
  tenYearTotal: number;      // initialCost + annualCost × 10
  socialScore: number;       // 인맥 형성 1~5
  healthScore: number;       // 건강 효과 1~5
  entryBarrier: "낮음" | "보통" | "높음";
  peakSeason: string;
  highlight: string;         // 한 줄 특징
  isGolf?: boolean;          // 골프 강조 여부
}

export const HOBBY_LIST: HobbyCostEntry[] = [
  {
    id: "golf",
    name: "골프",
    category: "outdoor",
    emoji: "⛳",
    monthlyMin: 200_000,
    monthlyMax: 800_000,
    monthlyAvg: 400_000,
    initialCost: 2_000_000,
    annualCost: 4_800_000,
    fiveYearTotal: 26_000_000,
    tenYearTotal: 50_000_000,
    socialScore: 5,
    healthScore: 4,
    entryBarrier: "높음",
    peakSeason: "3~11월",
    highlight: "비즈니스 네트워킹 최강, 전국 300+ 골프장",
    isGolf: true,
  },
  {
    id: "ski",
    name: "스키·보드",
    category: "outdoor",
    emoji: "⛷️",
    monthlyMin: 80_000,
    monthlyMax: 300_000,
    monthlyAvg: 150_000,
    initialCost: 800_000,
    annualCost: 1_800_000,
    fiveYearTotal: 9_800_000,
    tenYearTotal: 18_800_000,
    socialScore: 3,
    healthScore: 4,
    entryBarrier: "보통",
    peakSeason: "12~3월 (시즌제)",
    highlight: "겨울 시즌 집중, 리조트 숙박 비용 추가",
  },
  {
    id: "tennis",
    name: "테니스",
    category: "racket",
    emoji: "🎾",
    monthlyMin: 60_000,
    monthlyMax: 200_000,
    monthlyAvg: 120_000,
    initialCost: 400_000,
    annualCost: 1_440_000,
    fiveYearTotal: 7_600_000,
    tenYearTotal: 14_800_000,
    socialScore: 4,
    healthScore: 5,
    entryBarrier: "보통",
    peakSeason: "연중",
    highlight: "최근 MZ세대 급증, 레슨비가 주 비용",
  },
  {
    id: "fitness",
    name: "헬스·피트니스",
    category: "fitness",
    emoji: "💪",
    monthlyMin: 30_000,
    monthlyMax: 150_000,
    monthlyAvg: 80_000,
    initialCost: 300_000,
    annualCost: 960_000,
    fiveYearTotal: 5_100_000,
    tenYearTotal: 9_900_000,
    socialScore: 2,
    healthScore: 5,
    entryBarrier: "낮음",
    peakSeason: "연중",
    highlight: "가장 접근성 높은 취미, PT 포함 시 비용 상승",
  },
  {
    id: "cycling",
    name: "자전거 (로드)",
    category: "outdoor",
    emoji: "🚴",
    monthlyMin: 50_000,
    monthlyMax: 200_000,
    monthlyAvg: 100_000,
    initialCost: 1_500_000,
    annualCost: 1_200_000,
    fiveYearTotal: 7_500_000,
    tenYearTotal: 13_500_000,
    socialScore: 3,
    healthScore: 5,
    entryBarrier: "보통",
    peakSeason: "3~11월",
    highlight: "초기 자전거 구매가 비용의 핵심",
  },
  {
    id: "fishing",
    name: "낚시",
    category: "outdoor",
    emoji: "🎣",
    monthlyMin: 50_000,
    monthlyMax: 250_000,
    monthlyAvg: 120_000,
    initialCost: 600_000,
    annualCost: 1_440_000,
    fiveYearTotal: 7_800_000,
    tenYearTotal: 15_000_000,
    socialScore: 3,
    healthScore: 2,
    entryBarrier: "보통",
    peakSeason: "3~11월",
    highlight: "장비 업그레이드 욕심이 비용 상승 주범",
  },
  {
    id: "hiking",
    name: "등산",
    category: "outdoor",
    emoji: "🏔️",
    monthlyMin: 10_000,
    monthlyMax: 80_000,
    monthlyAvg: 40_000,
    initialCost: 400_000,
    annualCost: 480_000,
    fiveYearTotal: 2_800_000,
    tenYearTotal: 5_200_000,
    socialScore: 3,
    healthScore: 5,
    entryBarrier: "낮음",
    peakSeason: "연중 (봄·가을 성수기)",
    highlight: "가장 경제적인 야외 취미",
  },
  {
    id: "baseball",
    name: "야구 (사회인)",
    category: "outdoor",
    emoji: "⚾",
    monthlyMin: 20_000,
    monthlyMax: 100_000,
    monthlyAvg: 60_000,
    initialCost: 300_000,
    annualCost: 720_000,
    fiveYearTotal: 3_900_000,
    tenYearTotal: 7_500_000,
    socialScore: 5,
    healthScore: 4,
    entryBarrier: "낮음",
    peakSeason: "3~10월",
    highlight: "팀 스포츠, 사회적 유대감 최고",
  },
  {
    id: "bowling",
    name: "볼링",
    category: "indoor",
    emoji: "🎳",
    monthlyMin: 20_000,
    monthlyMax: 80_000,
    monthlyAvg: 50_000,
    initialCost: 100_000,
    annualCost: 600_000,
    fiveYearTotal: 3_100_000,
    tenYearTotal: 6_100_000,
    socialScore: 4,
    healthScore: 2,
    entryBarrier: "낮음",
    peakSeason: "연중",
    highlight: "실내·사계절 가능, 가장 낮은 진입 장벽",
  },
  {
    id: "surfing",
    name: "서핑",
    category: "watersport",
    emoji: "🏄",
    monthlyMin: 80_000,
    monthlyMax: 350_000,
    monthlyAvg: 180_000,
    initialCost: 800_000,
    annualCost: 2_160_000,
    fiveYearTotal: 11_600_000,
    tenYearTotal: 22_400_000,
    socialScore: 4,
    healthScore: 5,
    entryBarrier: "보통",
    peakSeason: "6~9월",
    highlight: "라이프스타일 취미, 교통·숙박비 포함 시 고비용",
  },
];

// 정렬: 월 평균 비용 내림차순
export const HOBBY_LIST_SORTED = [...HOBBY_LIST].sort((a, b) => b.monthlyAvg - a.monthlyAvg);

// KPI 계산
export const GHC_KPI = {
  cheapest: HOBBY_LIST_SORTED[HOBBY_LIST_SORTED.length - 1],
  mostExpensive: HOBBY_LIST_SORTED[0],
  golfRank: HOBBY_LIST_SORTED.findIndex(h => h.id === 'golf') + 1,
  totalCount: HOBBY_LIST.length,
};

export const CATEGORY_LABEL: Record<HobbyCategory, string> = {
  outdoor: "야외",
  indoor: "실내",
  watersport: "수상",
  racket: "라켓",
  fitness: "피트니스",
};

export const SCORE_LABELS = { 1: "★", 2: "★★", 3: "★★★", 4: "★★★★", 5: "★★★★★" };

export interface FaqItem { question: string; answer: string; }
export const GHC_FAQ: FaqItem[] = [
  {
    question: "골프는 정말 가장 비싼 취미인가요?",
    answer: "월 비용 기준으로는 골프가 비교 취미 10종 중 1위입니다. 하지만 스키·보드는 시즌 리조트 숙박비를 포함하면 월 환산 시 골프 못지않은 경우도 있습니다. 서핑도 교통·숙박비 포함 시 상당한 수준입니다.",
  },
  {
    question: "골프 비용 데이터의 기준이 무엇인가요?",
    answer: "월 평균은 퍼블릭 라운딩 2회 + 연습장 월정액 + 장비 감가상각 + 의류 기준입니다. 월 4회 이상 라운딩하거나 프리미엄 골프장을 이용하면 월 70~150만원까지 오를 수 있습니다.",
  },
  {
    question: "취미별 10년 총비용은 어떻게 계산되나요?",
    answer: "초기 비용(장비·가입비) + 월 평균 비용 × 12개월 × 10년으로 계산합니다. 물가 상승률·장비 교체 주기·레슨비 변동은 포함하지 않은 단순화된 추정치입니다.",
  },
  {
    question: "인맥 형성 지수는 어떻게 산정했나요?",
    answer: "팀 스포츠(야구·볼링 등)는 함께 즐기는 구조로 5점에 가깝게 평가했고, 개인 운동(자전거·등산)은 낮게 평가했습니다. 골프는 비즈니스 골프 관행상 5점으로 설정했습니다.",
  },
  {
    question: "테니스가 갑자기 뜨는 이유는 뭔가요?",
    answer: "2022년 이후 MZ세대 사이에서 '힙한 운동'으로 부상했습니다. 레슨비가 월 5~10만원대로 저렴하고, 도심 내 공공 테니스장이 많아 접근성이 좋습니다. 골프의 대체재로도 주목받고 있습니다.",
  },
  {
    question: "비용이 적은 취미를 골라야 할까요?",
    answer: "취미는 비용보다 지속 가능성과 삶의 질 향상이 중요합니다. 비싼 취미도 꾸준히 즐기면 삶의 만족도와 건강에 기여합니다. 이 비교는 예산 계획 수립을 돕기 위한 참고 자료입니다.",
  },
];

export const GHC_META = {
  slug: "golf-vs-hobbies-cost-comparison",
  title: "골프 vs 취미 비용 비교 2026 — 10종 월 유지비 랭킹",
  description: "골프·테니스·스키·헬스·낚시 등 10가지 취미의 월 유지비와 10년 총비용을 비교합니다.",
};
```

---

## 3. Astro 페이지 (`src/pages/reports/golf-vs-hobbies-cost-comparison.astro`)

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import CalculatorHero from '@/components/CalculatorHero.astro';
import InfoNotice from '@/components/InfoNotice.astro';
import SeoContent from '@/components/SeoContent.astro';
import CompareCta from '@/components/CompareCta.astro';
import {
  HOBBY_LIST_SORTED, GHC_KPI, CATEGORY_LABEL, SCORE_LABELS, GHC_FAQ, GHC_META
} from '@/data/golfVsHobbiesCost2026';

function fw(v: number) { return Math.round(v / 10_000) + '만원'; }

const config = { hobbies: HOBBY_LIST_SORTED };
---

<BaseLayout
  title={GHC_META.title}
  description={GHC_META.description}
  slug={`reports/${GHC_META.slug}`}
>
  <div class="ghc-page">
    <CalculatorHero title={GHC_META.title} description={GHC_META.description} />

    <InfoNotice
      title="데이터 기준"
      lines={[
        "전국 평균 기준 참고용 추정치입니다. 지역·수준·빈도에 따라 편차가 큽니다.",
        "초기 비용은 중간급 장비 기준이며, 10년 총비용은 물가 상승 미반영입니다.",
      ]}
    />

    <!-- KPI -->
    <div class="ghc-kpi-grid">
      <div class="ghc-kpi-card">
        <span>최저 비용 취미</span>
        <strong>{GHC_KPI.cheapest.emoji} {GHC_KPI.cheapest.name}</strong>
        <small>월 {fw(GHC_KPI.cheapest.monthlyAvg)}</small>
      </div>
      <div class="ghc-kpi-card">
        <span>최고 비용 취미</span>
        <strong>{GHC_KPI.mostExpensive.emoji} {GHC_KPI.mostExpensive.name}</strong>
        <small>월 {fw(GHC_KPI.mostExpensive.monthlyAvg)}</small>
      </div>
      <div class="ghc-kpi-card ghc-kpi-card--golf">
        <span>골프 비용 순위</span>
        <strong>{GHC_KPI.golfRank}위</strong>
        <small>비교 {GHC_KPI.totalCount}종 중</small>
      </div>
      <div class="ghc-kpi-card">
        <span>골프 월 평균</span>
        <strong>40만원</strong>
        <small>최저 20만 ~ 최고 80만원</small>
      </div>
    </div>

    <!-- 탭 전환 + 차트 -->
    <div class="ghc-chart-section">
      <div class="ghc-tab-row">
        <button class="ghc-tab is-active" data-ghc-tab="monthly">월 비용</button>
        <button class="ghc-tab" data-ghc-tab="fiveYear">5년 총비용</button>
        <button class="ghc-tab" data-ghc-tab="tenYear">10년 총비용</button>
      </div>
      <div class="ghc-chart-wrap">
        <canvas id="ghcBarChart"></canvas>
      </div>
    </div>

    <!-- 비교 테이블 -->
    <div class="ghc-table-section">
      <h2>취미별 상세 비교</h2>
      <div class="ghc-table-wrap">
        <table class="ghc-table">
          <thead>
            <tr>
              <th>순위</th>
              <th>취미</th>
              <th>월 비용</th>
              <th>초기 비용</th>
              <th>5년 총비용</th>
              <th class="ghc-col-social">인맥</th>
              <th class="ghc-col-health">건강</th>
              <th class="ghc-col-entry">진입</th>
            </tr>
          </thead>
          <tbody>
            {HOBBY_LIST_SORTED.map((h, i) => (
              <tr class:list={[{ "ghc-row--golf": h.isGolf }]}>
                <td class="ghc-col-rank">{i + 1}</td>
                <td class="ghc-col-name">
                  <span class="ghc-hobby-emoji">{h.emoji}</span>
                  {h.name}
                  {h.isGolf && <span class="ghc-badge-golf">골프</span>}
                </td>
                <td>
                  <span class="ghc-cost-avg">{fw(h.monthlyAvg)}</span>
                  <small class="ghc-cost-range">{fw(h.monthlyMin)}~{fw(h.monthlyMax)}</small>
                </td>
                <td>{fw(h.initialCost)}</td>
                <td>{fw(h.fiveYearTotal)}</td>
                <td class="ghc-col-social ghc-score">{SCORE_LABELS[h.socialScore as keyof typeof SCORE_LABELS]}</td>
                <td class="ghc-col-health ghc-score">{SCORE_LABELS[h.healthScore as keyof typeof SCORE_LABELS]}</td>
                <td class="ghc-col-entry">
                  <span class:list={["ghc-entry-badge", `ghc-entry--${h.entryBarrier === "낮음" ? "low" : h.entryBarrier === "보통" ? "mid" : "high"}`]}>
                    {h.entryBarrier}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <!-- 취미 카드 그리드 -->
    <div class="ghc-cards-section">
      <h2>취미별 특징 한눈에 보기</h2>
      <div class="ghc-cards-grid">
        {HOBBY_LIST_SORTED.map(h => (
          <div class:list={["ghc-card", { "ghc-card--golf": h.isGolf }]}>
            <div class="ghc-card-header">
              <span class="ghc-card-emoji">{h.emoji}</span>
              <strong>{h.name}</strong>
              <span class="ghc-card-season">{h.peakSeason}</span>
            </div>
            <div class="ghc-card-cost">
              <span>월 평균</span>
              <strong>{fw(h.monthlyAvg)}</strong>
            </div>
            <div class="ghc-card-cost">
              <span>10년 총비용</span>
              <strong>{fw(h.tenYearTotal)}</strong>
            </div>
            <p class="ghc-card-highlight">{h.highlight}</p>
            <div class="ghc-card-scores">
              <span>인맥 {SCORE_LABELS[h.socialScore as keyof typeof SCORE_LABELS]}</span>
              <span>건강 {SCORE_LABELS[h.healthScore as keyof typeof SCORE_LABELS]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    <!-- 골프의 특장점 -->
    <div class="ghc-golf-merit-section">
      <h2>⛳ 골프가 비싸도 선택받는 이유</h2>
      <div class="ghc-merit-grid">
        <div class="ghc-merit-card">
          <strong>비즈니스 네트워킹</strong>
          <p>국내 CEO·임원급의 80% 이상이 골프를 즐기는 것으로 알려져 있습니다. 비즈니스 골프 문화로 인해 인맥 형성과 계약 기회가 많습니다.</p>
        </div>
        <div class="ghc-merit-card">
          <strong>야외 활동 + 걷기</strong>
          <p>18홀 라운딩 시 약 8~10km를 걷습니다. 자연 속에서 즐기는 유산소 운동으로 심폐 건강과 스트레스 해소에 효과적입니다.</p>
        </div>
        <div class="ghc-merit-card">
          <strong>전국 500+ 골프장</strong>
          <p>국내 골프장 수는 지속 증가 중으로, 지방 골프장의 경우 주중 10만원대 이하 라운딩도 가능합니다. 접근성이 계속 좋아지고 있습니다.</p>
        </div>
        <div class="ghc-merit-card">
          <strong>평생 즐길 수 있는 스포츠</strong>
          <p>80대에도 즐기는 사람이 많습니다. 체력 부담이 다른 스포츠에 비해 낮고, 나이가 들수록 더 깊이 즐길 수 있는 전략적 스포츠입니다.</p>
        </div>
      </div>
    </div>

    <CompareCta links={[
      { href: "/tools/golf-monthly-cost-calculator/", label: "내 골프 월 유지비 계산하기", tone: "primary" },
      { href: "/tools/golf-membership-vs-public/", label: "회원권 vs 퍼블릭 손익 비교", tone: "secondary" },
    ]} />

    <SeoContent
      introTitle="골프, 정말 가장 비싼 취미일까요?"
      intro={[
        "골프의 월 평균 유지비는 10가지 주요 취미 중 가장 높은 수준이지만, 단순 비용만으로 취미를 선택하는 사람은 없습니다.",
        "비즈니스 네트워킹, 야외 활동, 전략적 재미라는 골프만의 가치를 고려하면 비용 대비 만족도는 개인마다 다릅니다.",
      ]}
      faq={GHC_FAQ}
    />
  </div>
</BaseLayout>

<script id="ghcConfig" type="application/json" set:html={JSON.stringify(config)}></script>
<script src="/scripts/golf-vs-hobbies-cost-comparison.js" defer></script>
```

---

## 4. JS 로직 (`public/scripts/golf-vs-hobbies-cost-comparison.js`)

```js
(function () {
  'use strict';

  const cfg = JSON.parse(document.getElementById('ghcConfig').textContent);
  const hobbies = cfg.hobbies; // 월 비용 내림차순 정렬된 상태

  let activeTab = 'monthly';
  let chartInst = null;

  const TAB_FIELD = { monthly: 'monthlyAvg', fiveYear: 'fiveYearTotal', tenYear: 'tenYearTotal' };
  const TAB_LABEL = { monthly: '월 비용', fiveYear: '5년 총비용', tenYear: '10년 총비용' };

  const GOLF_COLOR = '#1a56db';
  const OTHER_COLOR = '#94a3b8';

  function fwShort(v) {
    if (v >= 100_000_000) return (v / 100_000_000).toFixed(1) + '억';
    if (v >= 10_000) return Math.round(v / 10_000) + '만';
    return v.toLocaleString('ko-KR');
  }

  function renderChart(tab) {
    const ctx = document.getElementById('ghcBarChart');
    if (!ctx) return;

    // 해당 탭 기준 내림차순 재정렬
    const field = TAB_FIELD[tab];
    const sorted = [...hobbies].sort((a, b) => b[field] - a[field]);

    const labels = sorted.map(h => `${h.emoji} ${h.name}`);
    const data = sorted.map(h => h[field]);
    const colors = sorted.map(h => h.isGolf ? GOLF_COLOR : OTHER_COLOR);

    if (chartInst) {
      chartInst.data.labels = labels;
      chartInst.data.datasets[0].data = data;
      chartInst.data.datasets[0].backgroundColor = colors;
      chartInst.options.plugins.title.text = TAB_LABEL[tab];
      chartInst.update();
      return;
    }

    chartInst = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: TAB_LABEL[tab],
          data,
          backgroundColor: colors,
          borderRadius: 4,
        }],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: TAB_LABEL[tab], font: { size: 14 } },
          tooltip: {
            callbacks: {
              label: ctx => `${fwShort(ctx.raw)}원`,
            },
          },
        },
        scales: {
          x: { ticks: { callback: v => fwShort(v) + '원' } },
        },
      },
    });
  }

  function bindTabs() {
    document.querySelectorAll('[data-ghc-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-ghc-tab]').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        activeTab = btn.dataset.ghcTab;
        renderChart(activeTab);
      });
    });
  }

  function loadChartJs(cb) {
    if (window.Chart) { cb(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
    s.onload = cb;
    document.head.appendChild(s);
  }

  function init() {
    bindTabs();
    loadChartJs(() => renderChart(activeTab));
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
```

---

## 5. SCSS (`src/styles/scss/pages/_golf-vs-hobbies-cost-comparison.scss`)

```scss
.ghc-page {

  // KPI
  .ghc-kpi-grid {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin: 1.5rem 0;
    @media (min-width: 768px) { grid-template-columns: repeat(4, 1fr); }
  }
  .ghc-kpi-card {
    background: var(--color-surface); border-radius: 0.625rem; padding: 1rem;
    display: flex; flex-direction: column; gap: 0.25rem;
    span { font-size: 0.75rem; color: var(--color-text-muted); }
    strong { font-size: 1.125rem; font-weight: 700; }
    small { font-size: 0.75rem; color: var(--color-text-muted); }
    &--golf strong { color: var(--color-primary); }
  }

  // 탭
  .ghc-chart-section { margin: 2rem 0; }
  .ghc-tab-row { display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; }
  .ghc-tab {
    padding: 0.375rem 0.875rem; border-radius: 2rem;
    border: 1px solid var(--color-border);
    background: var(--color-surface); font-size: 0.8125rem; cursor: pointer;
    &.is-active { background: var(--color-primary); color: #fff; border-color: var(--color-primary); }
  }
  .ghc-chart-wrap { height: 420px; position: relative; }

  // 테이블
  .ghc-table-section { margin: 2rem 0;
    h2 { font-size: 1.125rem; margin-bottom: 0.75rem; }
  }
  .ghc-table-wrap { overflow-x: auto; }
  .ghc-table {
    width: 100%; border-collapse: collapse; font-size: 0.875rem; min-width: 560px;
    th, td { padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--color-border); text-align: right; }
    th:first-child, td:first-child, th:nth-child(2), td:nth-child(2) { text-align: left; }
    th { background: var(--color-surface); font-weight: 600; white-space: nowrap; }
  }
  .ghc-row--golf td { background: #eff6ff; font-weight: 600; }
  .ghc-col-rank { color: var(--color-text-muted); font-size: 0.8125rem; }
  .ghc-col-name { white-space: nowrap; }
  .ghc-hobby-emoji { margin-right: 0.375rem; }
  .ghc-badge-golf {
    font-size: 0.6875rem; background: var(--color-primary); color: #fff;
    padding: 0.125rem 0.375rem; border-radius: 0.25rem; margin-left: 0.375rem;
  }
  .ghc-cost-avg { display: block; font-weight: 600; }
  .ghc-cost-range { font-size: 0.75rem; color: var(--color-text-muted); white-space: nowrap; }
  .ghc-score { font-size: 0.6875rem; color: #f59e0b; }
  .ghc-entry-badge {
    font-size: 0.75rem; padding: 0.125rem 0.5rem; border-radius: 0.25rem; white-space: nowrap;
    &--low  { background: #d1fae5; color: #065f46; }
    &--mid  { background: #fef3c7; color: #92400e; }
    &--high { background: #fee2e2; color: #991b1b; }
  }
  // 모바일: 일부 컬럼 숨김
  @media (max-width: 599px) {
    .ghc-col-social, .ghc-col-health, .ghc-col-entry { display: none; }
  }

  // 카드 그리드
  .ghc-cards-section { margin: 2rem 0;
    h2 { font-size: 1.125rem; margin-bottom: 1rem; }
  }
  .ghc-cards-grid {
    display: grid; grid-template-columns: 1fr; gap: 0.75rem;
    @media (min-width: 480px) { grid-template-columns: repeat(2, 1fr); }
    @media (min-width: 768px) { grid-template-columns: repeat(3, 1fr); }
  }
  .ghc-card {
    border-radius: 0.625rem; padding: 1rem;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    &--golf { border-color: var(--color-primary); background: #eff6ff; }
  }
  .ghc-card-header {
    display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;
    strong { font-size: 0.9375rem; }
    .ghc-card-emoji { font-size: 1.25rem; }
    .ghc-card-season { font-size: 0.75rem; color: var(--color-text-muted); margin-left: auto; }
  }
  .ghc-card-cost {
    display: flex; justify-content: space-between; align-items: baseline;
    margin-bottom: 0.375rem;
    span { font-size: 0.75rem; color: var(--color-text-muted); }
    strong { font-size: 0.9375rem; font-weight: 700; }
  }
  .ghc-card-highlight { font-size: 0.8125rem; color: var(--color-text-muted); margin: 0.5rem 0; line-height: 1.5; }
  .ghc-card-scores {
    display: flex; gap: 0.75rem; font-size: 0.75rem; color: #f59e0b;
    margin-top: 0.5rem;
  }

  // 골프 특장점
  .ghc-golf-merit-section { margin: 2rem 0;
    h2 { font-size: 1.125rem; margin-bottom: 1rem; }
  }
  .ghc-merit-grid {
    display: grid; grid-template-columns: 1fr; gap: 0.75rem;
    @media (min-width: 560px) { grid-template-columns: repeat(2, 1fr); }
  }
  .ghc-merit-card {
    background: var(--color-surface); border-radius: 0.5rem;
    padding: 1rem; border-left: 3px solid var(--color-primary);
    strong { display: block; font-size: 0.9375rem; margin-bottom: 0.375rem; }
    p { font-size: 0.875rem; line-height: 1.6; color: var(--color-text-muted); margin: 0; }
  }
}
```

---

## 6. 등록 체크리스트

| 파일 | 작업 |
|---|---|
| `src/data/reports.ts` | `{ slug: "golf-vs-hobbies-cost-comparison", order: ..., badges: ["골프", "취미 비교", "유지비", "2026"] }` |
| `src/styles/app.scss` | `@use 'scss/pages/golf-vs-hobbies-cost-comparison';` |
| `public/sitemap.xml` | `/reports/golf-vs-hobbies-cost-comparison/` 추가 |

---

## 7. QA 포인트

- [ ] 탭 전환 시 차트 데이터·정렬 순서 즉시 업데이트
- [ ] 골프 바(차트) 파란색, 나머지 회색 구분
- [ ] 테이블 골프 행 배경색 강조
- [ ] 모바일(599px 이하) 테이블 컬럼 숨김 정상 동작
- [ ] 카드 그리드 반응형 (1→2→3열)
- [ ] BaseLayout 사용 → SiteFooter 중복 없음
- [ ] `npm run build` 오류 없음
