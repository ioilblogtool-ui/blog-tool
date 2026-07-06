# 설계 문서
## 서울 구별 아파트 집값 순위 2026

> 기획 원본: `docs/plan/202607/seoul-district-apartment-price-ranking-2026-plan.md`

---

## 0. 구현 개요

| 항목 | 값 |
|------|---|
| slug | `seoul-district-apartment-price-ranking-2026` |
| 페이지 경로 | `src/pages/reports/seoul-district-apartment-price-ranking-2026.astro` |
| 데이터 파일 | `src/data/seoulDistrictRanking2026.ts` |
| 스크립트 | `public/scripts/seoul-district-apartment-price-ranking-2026.js` |
| SCSS | `src/styles/scss/pages/_seoul-district-apartment-price-ranking-2026.scss` |
| SCSS prefix | `.sdar` (Seoul District Apartment Ranking) |
| 레이아웃 쉘 | BaseLayout (기존 구별 리포트 패턴, 레이아웃 쉘 없이 직접 구성) |

---

## 1. 데이터 파일 설계 (`seoulDistrictRanking2026.ts`)

### 1-1. 설계 원칙
기존 구별 파일(`gangnamApartmentPrice2026.ts` 등)은 각각 구조가 달라 import 통합이 복잡함.  
**별도 요약 데이터 파일**로 관리 — 각 구의 대표 단지 1개 + 구 요약 지표만 담음.

### 1-2. 타입 정의

```ts
// src/data/seoulDistrictRanking2026.ts

export type DataStatus = "공식" | "추정" | "참고";

export interface DistrictRow {
  id: string;                      // "yongsan"
  districtName: string;            // "용산구"
  representativeComplex: string;   // "한남더힐"
  latestPriceManwon: number;       // 84㎡ 대표 단지 최신 실거래가 (만원)
  latestTradeDate: string;         // "2026.06"
  prevYearPriceManwon: number;     // 2025년 동기 대표 단지 실거래가
  yoyChangePercent: number;        // 전년 대비 상승률 % (소수점 1자리)
  jeonseRatio: number | null;      // 전세가율 % (null = 데이터 없음)
  reportSlug: string | null;       // 기존 구별 리포트 slug (없으면 null)
  areaNote: string;                // "한남·이태원권 초고가 단지 기준"
  status: DataStatus;
  tradeNote?: string;              // 거래 건수 적음 등 주의사항
}

export interface SdarMeta {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  updatedAt: string;
  dataAsOf: string;
  notice: string;
}
```

### 1-3. 구별 데이터 (1차: 기존 파일 보유 7개 구)

기존 구별 리포트 데이터에서 추출한 값으로 초기 입력:

| 구 | 대표 단지 | 최신가(만원) | 전년가(만원) | 상승률 | 전세가율 | 기존 리포트 |
|----|---------|-----------|-----------|-------|--------|----------|
| 용산구 | 한남더힐 | 1,100,000 | 980,000 | +12.2% | 28% | yongsan-apartment-price-2026 |
| 강남구 | 압구정 현대 | 520,000 | — | — | — | gangnam-apartment-price-2026 |
| 성동구 | 갤러리아포레 | 650,000 | 560,000 | +16.1% | — | seongdong-apartment-price-2026 |
| 송파구 | 리센츠 | 345,000 | 310,000 | +11.3% | 44.9% | songpa-apartment-price-2026 |
| 강동구 | 올림픽파크포레온 | 313,000 | 320,000 | -2.2% | 43% | gangdong-apartment-price-2026 |
| 마포구 | 공덕자이 | 283,000 | — | — | — | mapo-apartment-price-2026 |
| 강서구 | 마곡 단지 | 198,500 | — | — | — | gangseo-magok-apartment-price-2026 |

> 강남·마포·강서는 전년가 미확인 → `prevYearPriceManwon: 0`, `yoyChangePercent: 0`, `status: "참고"`로 처리하고 UI에서 상승률 "-" 표시

### 1-4. 2차 수집 대상 구 (신규 데이터 수집 필요)

우선순위 순:

| 우선 | 구 | 예상 가격대 | 비고 |
|------|---|-----------|------|
| 1 | 서초구 | 40~60억 | 반포·서초동 — 강남 인접, 핵심 비교 |
| 2 | 양천구 | 12~18억 | 목동 신시가지 — 중간가격대 대표 |
| 3 | 노원구 | 6~9억 | 저가 구간 대표 |
| 4 | 도봉구 | 5~8억 | 최저가 구간 |
| 5 | 동작구 | 15~20억 | 흑석·사당 |
| 6 | 영등포구 | 15~22억 | 여의도 일대 |
| 7 | 구로구 | 6~10억 | 중저가 |
| 8 | 성북구 | 8~12억 | |
| 9 | 관악구 | 6~9억 | |
| 10~18 | 나머지 9개 구 | — | 3차 확장 |

---

## 2. 화면 구성 상세

### 레이아웃 스켈레톤

```
[BaseLayout]
  [SiteHeader]
  [CalculatorHero]         ← 타이틀 + 부제
  <main class="sdar-page">
    [InfoNotice]           ← 데이터 기준 고지
    .sdar-summary          ← Summary 카드 4개
    .sdar-table-section    ← 메인 순위표
    .sdar-price-band       ← 가격대별 구 분류
    .sdar-chart            ← 바차트 (Chart.js)
    .sdar-notable          ← 주목할 구 TOP3
    .sdar-related          ← 구별 상세 리포트 링크 그리드
    .sdar-method           ← 데이터 기준 및 한계
    [SeoContent]           ← FAQ + SEO 텍스트
  </main>
  [SiteFooter]
```

### 2-1. Summary 카드 (4개)

| 카드 | 값 | 비고 |
|------|---|------|
| 가장 비싼 구 | "용산구 · 110억대" | 대표 단지 주석 |
| 가장 저렴한 구 | "도봉구 · XX억대" | 2차 수집 후 확정 |
| 최고↔최저 격차 | "약 XX배" | 1차 발행 시 보유 구 기준 |
| 가장 많이 오른 구 | "성동구 +16.1%" | yoyChangePercent 최대값 |

Astro에서 계산:
```ts
const sorted = SDAR_DISTRICTS.filter(d => d.latestPriceManwon > 0)
  .sort((a, b) => b.latestPriceManwon - a.latestPriceManwon);
const richest = sorted[0];
const cheapest = sorted[sorted.length - 1];
const ratio = (richest.latestPriceManwon / cheapest.latestPriceManwon).toFixed(1);
const topGain = [...SDAR_DISTRICTS]
  .filter(d => d.yoyChangePercent !== 0)
  .sort((a, b) => b.yoyChangePercent - a.yoyChangePercent)[0];
```

### 2-2. 메인 순위표 (`.sdar-table-section`)

**정렬 탭 (3개):**
- `매매가 높은 순` (기본)
- `상승률 높은 순`
- `전세가율 높은 순`

**테이블 컬럼:**
```
순위 | 구 이름 | 대표 단지 | 84㎡ 평균 매매가 | 전년 대비 | 전세가율 | 상세 리포트
```

마크업 패턴:
```html
<div class="sdar-sort-tabs">
  <button class="sdar-tab is-active" data-sort="price">매매가 높은 순</button>
  <button class="sdar-tab" data-sort="gain">상승률 높은 순</button>
  <button class="sdar-tab" data-sort="jeonse">전세가율 높은 순</button>
</div>
<div class="sdar-table-wrap">
  <table class="sdar-table">
    <thead>...</thead>
    <tbody id="sdar-tbody">
      <tr data-price="1100000" data-gain="12.2" data-jeonse="28">
        <td class="sdar-rank">1</td>
        <td class="sdar-district">용산구<span>한남더힐 기준</span></td>
        <td class="sdar-price">110억</td>
        <td class="sdar-gain is-up">+12.2%</td>
        <td class="sdar-jeonse">28%</td>
        <td class="sdar-link"><a href="/reports/yongsan-apartment-price-2026/">상세 보기</a></td>
      </tr>
      ...
    </tbody>
  </table>
</div>
```

**상승률 표시 규칙:**
- `yoyChangePercent > 0` → `.is-up` (녹색)
- `yoyChangePercent < 0` → `.is-down` (적색)
- `yoyChangePercent === 0` (데이터 없음) → `"-"` 표시

**`status: "참고"` 행:** `.sdar-badge--ref` 뱃지 표시 ("참고")

### 2-3. 가격대별 구 분류 (`.sdar-price-band`)

```
[50억+] 용산구
[30~50억] 강남구 · 성동구
[20~30억] 송파구 · 강동구 · 마포구
[10~20억] 강서구 · (양천구) · (동작구) ...
[10억 미만] (노원구) · (도봉구) ...
```

괄호 = 2차 수집 대상. 1차 발행 시 "추가 예정" placeholder 표시.

### 2-4. 바차트 (`.sdar-chart`)

Chart.js 수평 바차트:
- X축: 만원 단위 실거래가
- Y축: 구 이름 (정렬: 매매가 높은 순)
- 색상: `--sdar-teal` 단색, 보유 구별 리포트 있는 항목 강조

차트 데이터는 JS에서 data attribute 읽어 동적 생성:
```js
const labels = [...document.querySelectorAll('#sdar-tbody tr')]
  .map(tr => tr.querySelector('.sdar-district').textContent.trim());
const data = [...document.querySelectorAll('#sdar-tbody tr')]
  .map(tr => parseInt(tr.dataset.price));
```

### 2-5. 주목할 구 TOP3 (`.sdar-notable`)

상승률 기준 상위 3개 구 카드.  
카드 구조: `구 이름` + `상승률 배지` + `이유 1~2줄` (사실 기반, 단정 금지 톤)

### 2-6. 관련 리포트 그리드 (`.sdar-related`)

기존 구별 리포트 있는 7개만 카드 표시. 기존 `hmap-related-card` 패턴 재사용.

---

## 3. JS 설계 (`seoul-district-apartment-price-ranking-2026.js`)

### 3-1. 정렬 로직

```js
(function () {
  const tabs = document.querySelectorAll('.sdar-tab');
  const tbody = document.getElementById('sdar-tbody');

  function sortTable(key) {
    const rows = [...tbody.querySelectorAll('tr')];
    rows.sort((a, b) => {
      const av = parseFloat(a.dataset[key]) || 0;
      const bv = parseFloat(b.dataset[key]) || 0;
      return bv - av; // 높은 순
    });
    rows.forEach((row, i) => {
      row.querySelector('.sdar-rank').textContent = i + 1;
      tbody.appendChild(row);
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      sortTable(tab.dataset.sort); // data-sort="price"|"gain"|"jeonse"
    });
  });

  // Chart.js 초기화
  function initChart() {
    const rows = [...tbody.querySelectorAll('tr')];
    const labels = rows.map(tr => tr.querySelector('.sdar-district').firstChild.textContent.trim());
    const data = rows.map(tr => parseInt(tr.dataset.price) / 10000); // 억 단위

    // chart-config.js의 공통 설정 활용
    const ctx = document.getElementById('sdar-chart-canvas').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: 'rgba(15, 118, 110, 0.75)',
        }]
      },
      options: {
        indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: {
          x: { title: { display: true, text: '억원 (84㎡ 대표 단지 기준)' } }
        }
      }
    });
  }

  initChart();
})();
```

---

## 4. SCSS 설계 (`_seoul-district-apartment-price-ranking-2026.scss`)

prefix: `.sdar`  
기존 `_hanam-misa-apartment-price-2026.scss` (`.hmap`) 패턴 최대한 재사용.

```scss
.sdar-page {
  --sdar-ink: #172033;
  --sdar-muted: #667085;
  --sdar-line: #d8e0ea;
  --sdar-soft: #f6f8fb;
  --sdar-teal: #0f766e;
  --sdar-blue: #2563eb;
  --sdar-green: #138a5b;
  --sdar-red: #c2410c;
  --sdar-amber: #b7791f;

  // 섹션 간격
  .sdar-summary,
  .sdar-table-section,
  .sdar-price-band,
  .sdar-chart,
  .sdar-notable,
  .sdar-related,
  .sdar-method { margin-top: 28px; }

  // Summary 카드 그리드
  .sdar-summary-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  // 정렬 탭 (기존 hmap-tabs 패턴)
  .sdar-sort-tabs { display: flex; gap: 8px; margin-bottom: 14px; overflow-x: auto; }
  .sdar-tab { /* hmap-tab 동일 */ }
  .sdar-tab.is-active { border-color: var(--sdar-teal); background: #eaf7f5; color: var(--sdar-teal); }

  // 테이블
  .sdar-table-wrap { border: 1px solid var(--sdar-line); border-radius: 8px; overflow-x: auto; }
  .sdar-table { border-collapse: collapse; min-width: 860px; width: 100%; }

  // 상승률 색상
  .sdar-gain.is-up { color: var(--sdar-green); font-weight: 800; }
  .sdar-gain.is-down { color: var(--sdar-red); font-weight: 800; }

  // 상태 뱃지
  .sdar-badge--ref {
    border-radius: 999px; background: #fff4df;
    color: var(--sdar-amber); font-size: 11px; font-weight: 900; padding: 2px 7px;
  }

  // 가격대별 구분
  .sdar-price-band-list { display: grid; gap: 10px; }
  .sdar-price-band-row { display: flex; align-items: baseline; gap: 12px; }
  .sdar-price-band-label { min-width: 100px; font-size: 13px; font-weight: 900; color: var(--sdar-muted); }
  .sdar-price-band-tags { display: flex; flex-wrap: wrap; gap: 6px; }
  .sdar-price-tag {
    border: 1px solid var(--sdar-line); border-radius: 6px;
    background: #fff; font-size: 13px; padding: 4px 10px;
  }
  .sdar-price-tag.has-report { border-color: var(--sdar-teal); color: var(--sdar-teal); }

  // 주목 TOP3
  .sdar-notable-grid {
    display: grid; gap: 12px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .sdar-notable-card {
    border: 1px solid var(--sdar-line); border-radius: 8px;
    background: #fff; padding: 16px;
    display: grid; gap: 8px;
  }

  // 관련 리포트
  .sdar-related-grid {
    display: grid; gap: 12px;
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  // 반응형
  @media (max-width: 920px) {
    .sdar-summary-grid,
    .sdar-related-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .sdar-notable-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (max-width: 640px) {
    .sdar-summary-grid,
    .sdar-notable-grid,
    .sdar-related-grid { grid-template-columns: 1fr; }
  }
}
```

---

## 5. Astro 페이지 구조 (`seoul-district-apartment-price-ranking-2026.astro`)

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  SDAR_DISTRICTS,
  SDAR_META,
  SDAR_FAQ,
  SDAR_SEO_INTRO,
  SDAR_PRICE_BANDS,
  formatEok,
} from "../../data/seoulDistrictRanking2026";

// Summary 계산
const withPrice = SDAR_DISTRICTS.filter(d => d.latestPriceManwon > 0);
const sorted = [...withPrice].sort((a, b) => b.latestPriceManwon - a.latestPriceManwon);
const richest = sorted[0];
const cheapest = sorted[sorted.length - 1];
const ratio = (richest.latestPriceManwon / cheapest.latestPriceManwon).toFixed(1);
const topGain = [...withPrice]
  .filter(d => d.yoyChangePercent !== 0)
  .sort((a, b) => b.yoyChangePercent - a.yoyChangePercent)[0];
---
```

---

## 6. 데이터 파일 초기 입력값 (`seoulDistrictRanking2026.ts`)

```ts
export const SDAR_DISTRICTS: DistrictRow[] = [
  {
    id: "yongsan",
    districtName: "용산구",
    representativeComplex: "한남더힐",
    latestPriceManwon: 1100000,
    latestTradeDate: "2026 상반기",
    prevYearPriceManwon: 980000,
    yoyChangePercent: 12.2,
    jeonseRatio: 28,
    reportSlug: "yongsan-apartment-price-2026",
    areaNote: "한남·이태원권 초고가 단지 기준",
    status: "추정",
  },
  {
    id: "gangnam",
    districtName: "강남구",
    representativeComplex: "압구정 현대",
    latestPriceManwon: 520000,
    latestTradeDate: "2026 상반기",
    prevYearPriceManwon: 0,
    yoyChangePercent: 0,
    jeonseRatio: null,
    reportSlug: "gangnam-apartment-price-2026",
    areaNote: "압구정 재건축 기대권 기준 — 전년 비교 확인 필요",
    status: "참고",
    tradeNote: "전년 대비 상승률 미확인",
  },
  {
    id: "seongdong",
    districtName: "성동구",
    representativeComplex: "갤러리아포레",
    latestPriceManwon: 650000,
    latestTradeDate: "2026 상반기",
    prevYearPriceManwon: 560000,
    yoyChangePercent: 16.1,
    jeonseRatio: null,
    reportSlug: "seongdong-apartment-price-2026",
    areaNote: "성수동 한강뷰 초고가 단지 기준",
    status: "추정",
    tradeNote: "전세가율 데이터 미확인",
  },
  {
    id: "songpa",
    districtName: "송파구",
    representativeComplex: "리센츠",
    latestPriceManwon: 345000,
    latestTradeDate: "2026 상반기",
    prevYearPriceManwon: 310000,
    yoyChangePercent: 11.3,
    jeonseRatio: 44.9,
    reportSlug: "songpa-apartment-price-2026",
    areaNote: "잠실 대단지 기준",
    status: "추정",
  },
  {
    id: "gangdong",
    districtName: "강동구",
    representativeComplex: "올림픽파크포레온",
    latestPriceManwon: 313000,
    latestTradeDate: "2026.06.25",
    prevYearPriceManwon: 320000,
    yoyChangePercent: -2.2,
    jeonseRatio: 43,
    reportSlug: "gangdong-apartment-price-2026",
    areaNote: "둔촌 재건축 대단지 기준 — 입주 물량 조정기",
    status: "추정",
  },
  {
    id: "mapo",
    districtName: "마포구",
    representativeComplex: "공덕자이",
    latestPriceManwon: 283000,
    latestTradeDate: "2026 상반기",
    prevYearPriceManwon: 0,
    yoyChangePercent: 0,
    jeonseRatio: null,
    reportSlug: "mapo-apartment-price-2026",
    areaNote: "공덕·아현권 대표 단지 기준",
    status: "참고",
    tradeNote: "전년 대비 상승률 미확인",
  },
  {
    id: "gangseo",
    districtName: "강서구",
    representativeComplex: "마곡 대단지",
    latestPriceManwon: 198500,
    latestTradeDate: "2026 상반기",
    prevYearPriceManwon: 0,
    yoyChangePercent: 0,
    jeonseRatio: null,
    reportSlug: "gangseo-magok-apartment-price-2026",
    areaNote: "마곡 신도시 대단지 기준",
    status: "참고",
    tradeNote: "전년 대비 상승률 미확인",
  },
];
```

---

## 7. sitemap.xml 등록

```xml
<url>
  <loc>https://bigyocalc.com/reports/seoul-district-apartment-price-ranking-2026/</loc>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## 8. app.scss 등록

```scss
// src/styles/app.scss 에 추가
@use "scss/pages/seoul-district-apartment-price-ranking-2026";
```

---

## 9. 구현 순서

| 단계 | 작업 | 비고 |
|------|------|------|
| 1 | `seoulDistrictRanking2026.ts` 데이터 파일 작성 (7개 구) | 위 초기값 입력 |
| 2 | `_seoul-district-apartment-price-ranking-2026.scss` 작성 | hmap 패턴 복붙 후 prefix 교체 |
| 3 | `app.scss`에 import 추가 | |
| 4 | `.astro` 페이지 작성 (HTML 구조 + Summary 카드) | |
| 5 | `seoul-district-apartment-price-ranking-2026.js` 작성 (정렬 + Chart.js) | |
| 6 | `sitemap.xml` 등록 | |
| 7 | `npm run build` 확인 | |
| 8 | 2차 구 데이터 수집 후 `SDAR_DISTRICTS` 확장 | 서초·양천·노원 우선 |

---

## 10. QA 포인트

- [ ] 정렬 탭 클릭 시 순위 번호 재계산 정상 작동 확인
- [ ] `yoyChangePercent === 0` 행에서 상승률 "-" 표시 확인 (숫자 "0%" 노출 금지)
- [ ] `status: "참고"` 행에 뱃지 표시 확인
- [ ] `jeonseRatio: null` 행에서 전세가율 컬럼 "-" 표시 확인
- [ ] `reportSlug` 있는 행의 "상세 보기" 링크 정상 작동, 없는 행은 링크 미표시
- [ ] Chart.js 수평 바 정상 렌더링 (모바일 포함)
- [ ] 모바일 480px 테이블 가로 스크롤 정상 작동
- [ ] `npm run build` 에러 없음
- [ ] sitemap.xml 경로 포함 확인
