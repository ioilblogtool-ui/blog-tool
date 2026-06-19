# 반도체 주식 2026 상반기 수익률 리포트 설계 문서

> 기획 원본: `docs/plan/202606/semiconductor-stocks-h1-2026-plan.md`  
> 작성일: 2026-06-19  
> slug: `semiconductor-stocks-h1-2026` / prefix: `sshi-`  
> 유형: 리포트 (`/reports/semiconductor-stocks-h1-2026/`)

---

## 1. 파일 구성

| 파일 | 경로 |
|------|------|
| 데이터 | `src/data/semiconductorStocksH12026.ts` |
| 페이지 | `src/pages/reports/semiconductor-stocks-h1-2026.astro` |
| 스타일 | `src/styles/scss/pages/_semiconductor-stocks-h1-2026.scss` |
| reports.ts 등록 | `src/data/reports.ts` |
| sitemap | `public/sitemap.xml` |
| app.scss | `src/styles/app.scss` |

---

## 2. 데이터 파일: `src/data/semiconductorStocksH12026.ts`

### 2-1. 타입 정의

```typescript
export type StockRow = {
  rank: number;           // 수익률 순위
  name: string;           // 종목명 (한국어)
  ticker: string;         // 티커 심볼
  country: 'US' | 'KR' | 'TW' | 'JP';
  sector: '설계' | '메모리' | '파운드리' | '장비' | '패키징' | '아날로그';
  open: number;           // 2026-01-02 종가 (각국 통화)
  close: number;          // 2026-06-18 종가 (각국 통화)
  currency: 'USD' | 'KRW' | 'TWD' | 'JPY';
  ytd: number;            // YTD 수익률 % (소수점 제거)
  note: string;           // 주요 상승 요인 (30자 이내)
  isEstimate?: boolean;   // 연초가 추정치 여부
};
```

### 2-2. 종목 데이터 (수익률 내림차순)

```typescript
export const STOCKS: StockRow[] = [
  // 미국
  { rank:1,  name:'샌디스크',         ticker:'SNDK',  country:'US', sector:'메모리',  open:237.38,   close:2184.75, currency:'USD', ytd:820, note:'낸드 공급 타이트·AI 스토리지 수요', isEstimate:true },
  { rank:2,  name:'마이크론',          ticker:'MU',    country:'US', sector:'메모리',  open:285.38,   close:1133.99, currency:'USD', ytd:297, note:'HBM3E 양산·AI 메모리 수요 폭발', isEstimate:true },
  { rank:3,  name:'마벨테크놀로지',    ticker:'MRVL',  country:'US', sector:'설계',    open:84.98,    close:310.58,  currency:'USD', ytd:265, note:'데이터센터 커스텀 AI칩 수혜', isEstimate:true },
  { rank:4,  name:'인텔',              ticker:'INTC',  country:'US', sector:'설계',    open:36.68,    close:133.99,  currency:'USD', ytd:263, note:'애플 파운드리 계약·파운드리 재건', isEstimate:true },
  { rank:5,  name:'어플라이드머티리얼즈', ticker:'AMAT', country:'US', sector:'장비',  open:256.98,   close:617.11,  currency:'USD', ytd:140, note:'AI 팹 증설 → WFE 수요 급증', isEstimate:true },
  { rank:6,  name:'AMD',               ticker:'AMD',   country:'US', sector:'설계',    open:214.18,   close:537.37,  currency:'USD', ytd:151, note:'MI300X·EPYC 데이터센터 점유 확대', isEstimate:true },
  { rank:7,  name:'램리서치',          ticker:'LRCX',  country:'US', sector:'장비',    open:171.29,   close:389.04,  currency:'USD', ytd:127, note:'식각 장비 독과점·AI 팹 수혜', isEstimate:true },
  { rank:8,  name:'KLA',               ticker:'KLAC',  country:'US', sector:'장비',    open:121.17,   close:259.56,  currency:'USD', ytd:114, note:'검사 장비 독과점·첨단 노드 필수', isEstimate:true },
  { rank:9,  name:'텍사스인스트루먼츠', ticker:'TXN',  country:'US', sector:'아날로그', open:173.49,  close:322.86,  currency:'USD', ytd:86,  note:'전기차·산업용 아날로그 회복', isEstimate:true },
  { rank:10, name:'ASML',              ticker:'ASML',  country:'US', sector:'장비',    open:1069.54,  close:1929.68, currency:'USD', ytd:80,  note:'EUV 독점·Terafab 수혜 기대', isEstimate:true },
  { rank:11, name:'TSMC',              ticker:'TSM',   country:'TW', sector:'파운드리', open:303.84,  close:462.12,  currency:'USD', ytd:52,  note:'AI칩 위탁 수요·용량 타이트', isEstimate:true },
  { rank:12, name:'브로드컴',          ticker:'AVGO',  country:'US', sector:'설계',    open:346.08,   close:411.35,  currency:'USD', ytd:19,  note:'AI 커스텀칩(XPU)·네트워킹 강세', isEstimate:true },
  { rank:13, name:'퀄컴',             ticker:'QCOM',  country:'US', sector:'설계',    open:171.05,   close:226.11,  currency:'USD', ytd:32,  note:'스마트폰 회복·AI PC 칩셋', isEstimate:true },
  { rank:14, name:'엔비디아',          ticker:'NVDA',  country:'US', sector:'설계',    open:186.51,   close:210.69,  currency:'USD', ytd:13,  note:'H100→B200 전환 기저·여전히 AI 1위', isEstimate:true },
  // 한국
  { rank:15, name:'SK하이닉스',        ticker:'000660', country:'KR', sector:'메모리', open:650000,   close:2009000, currency:'KRW', ytd:209, note:'HBM3E 엔비디아 독점 공급', isEstimate:true },
  { rank:16, name:'한미반도체',        ticker:'042700', country:'KR', sector:'장비',   open:155000,   close:309000,  currency:'KRW', ytd:99,  note:'TC본더 HBM 패키징 핵심 장비', isEstimate:true },
  { rank:17, name:'DB하이텍',          ticker:'000990', country:'KR', sector:'파운드리', open:65800,  close:220500,  currency:'KRW', ytd:235, note:'아날로그 전문 파운드리 회복', isEstimate:true },
  { rank:18, name:'삼성전자',          ticker:'005930', country:'KR', sector:'메모리', open:333600,   close:369750,  currency:'KRW', ytd:11,  note:'HBM4 공급 재개·파운드리 수주', isEstimate:true },
  // 대만
  { rank:19, name:'미디어텍',          ticker:'2454',  country:'TW', sector:'설계',    open:1390,     close:4560,    currency:'TWD', ytd:228, note:'AI PC/스마트폰 AP·데이터센터 칩', isEstimate:false },
  // 일본
  { rank:20, name:'도쿄일렉트론',      ticker:'8035',  country:'JP', sector:'장비',    open:19870,    close:70860,   currency:'JPY', ytd:257, note:'아시아 장비 1위·AI 팹 투자 수혜', isEstimate:true },
  { rank:21, name:'르네사스',          ticker:'6723',  country:'JP', sector:'설계',    open:0,        close:2461,    currency:'JPY', ytd:9,   note:'차량용 MCU·EV 수요 회복 기대', isEstimate:false },
];
```

### 2-3. 요약 KPI

```typescript
export const SUMMARY = {
  topStock: '샌디스크(SNDK)',
  topYtd: 820,
  sectorAvg: {
    메모리: 334,   // SNDK+MU+SK하이닉스 평균
    장비: 147,    // AMAT+LRCX+KLAC+ASML+한미+TEL 평균
    설계: 133,    // NVDA+AMD+AVGO+MRVL+QCOM+INTC+미디어텍 평균
    파운드리: 99, // TSMC+DB하이텍 평균
  },
  kospiYtd: 84,    // 코스피 YTD (참고)
  sp500Ytd: 15,    // S&P500 YTD (참고, 추정)
  dataDate: '2026-06-18',
};
```

### 2-4. 섹터 설명

```typescript
export const SECTOR_DESC: Record<string, string> = {
  설계: 'GPU·CPU·AP·네트워킹 칩을 설계하는 팹리스 기업',
  메모리: 'DRAM·HBM·낸드를 직접 생산하는 종합 반도체 기업',
  파운드리: '고객사 설계를 위탁 생산하는 파운드리 전문 기업',
  장비: '반도체 제조 공정에 필요한 장비를 만드는 기업',
  패키징: 'HBM 등 고급 패키징·후공정 전문 기업',
  아날로그: '산업·전기차용 아날로그·임베디드 칩 전문 기업',
};
```

### 2-5. FAQ

```typescript
export const FAQ_ITEMS = [
  { q: '샌디스크(SNDK)가 왜 1위인가요?', a: 'WD에서 분사한 독립 낸드 플래시 전문 기업으로, AI 데이터센터의 스토리지 수요 급증과 낸드 공급 타이트 상황이 맞물려 연초 대비 820% 폭등했습니다.' },
  { q: '엔비디아가 AI 대장주인데 왜 수익률이 낮나요?', a: '엔비디아는 2024~2025년에 이미 수백 % 상승한 기저 효과로 2026년 상반기 추가 상승폭이 제한됐습니다. 수익률보다 시가총액(약 5,100조원)에서 압도적 1위입니다.' },
  { q: 'HBM이란 무엇인가요?', a: '고대역폭메모리(High Bandwidth Memory)의 약자로, AI 가속기에 탑재되는 초고속 D램입니다. 엔비디아 H100/B200에 SK하이닉스가 독점 공급하며 주가 상승의 핵심 동인입니다.' },
  { q: '반도체 ETF vs 개별 주식, 어떤 게 더 나은가요?', a: 'ETF는 분산 투자로 변동성이 낮고, 개별 주식은 고수익 기회가 있지만 리스크도 큽니다. SNDK·MU 같은 종목을 미리 담았다면 ETF 대비 훨씬 높은 수익이 가능했지만 예측은 어렵습니다.' },
  { q: '2026 하반기에도 반도체 주식이 오를 수 있나요?', a: '애널리스트 다수는 AI 인프라 투자 사이클이 2027년까지 이어진다고 전망합니다. 다만 상반기 급등에 따른 밸류에이션 부담, 미중 무역 갈등, 금리 변수 등 리스크 요인도 존재합니다.' },
  { q: 'ASML은 네덜란드 회사인데 왜 포함됐나요?', a: 'ASML은 EUV 장비를 전 세계에서 유일하게 생산하는 반도체 장비 독점 기업입니다. 나스닥에도 상장되어 있으며, 모든 첨단 팹은 ASML 없이는 운영이 불가능합니다.' },
];
```

### 2-6. 리포트 메타

```typescript
export const REPORT_META = {
  title: '반도체 주식 2026 상반기 수익률 | 미국·한국·대만 21종목 랭킹',
  description: '엔비디아·SK하이닉스·TSMC 등 반도체 주식 21종목의 2026년 상반기 수익률을 국가·섹터별로 비교. 어디가 제일 올랐는지 바로 확인하세요.',
  slug: 'semiconductor-stocks-h1-2026',
  updatedAt: '2026-06-19',
};
```

---

## 3. 페이지 구조: `semiconductor-stocks-h1-2026.astro`

```
BaseLayout (title, description)
  └─ SiteHeader
  └─ main.container.page-shell.report-page.sshi-page
       ├─ CalculatorHero (title, description)
       ├─ section.sshi-kpi          ← 요약 KPI 3개
       ├─ section.sshi-chart-bar    ← 수익률 가로 바 차트 (Chart.js)
       ├─ section.sshi-sector       ← 섹터별 평균 비교 카드
       ├─ section.sshi-highlights   ← 핵심 종목 해설 (5개)
       ├─ section.sshi-table        ← 전체 순위표
       ├─ InfoNotice (출처·면책)
       └─ SeoContent (seoText + faqItems)
```

### 3-1. CalculatorHero props

```astro
<CalculatorHero
  title="반도체 주식 2026 상반기 수익률"
  description="미국·한국·대만·일본 21종목 수익률 랭킹 — 어디가 제일 올랐나"
  badge="2026 상반기"
/>
```

### 3-2. KPI 섹션

카드 3개:
- **상반기 최고 수익률**: 샌디스크(SNDK) +820%
- **메모리 섹터 평균**: +334%
- **코스피 YTD 대비**: 반도체 상위 5종목 평균 초과 수익 +150%p↑

### 3-3. 차트 1 — 수익률 가로 바 차트

```
Chart.js horizontal bar (indexAxis: 'y')
- 데이터: STOCKS 수익률 내림차순
- 국가별 색상: US=#3b82f6, KR=#ef4444, TW=#10b981, JP=#f59e0b
- 레이블: "종목명 (티커)" — 수익률% 툴팁
- 기준선: 코스피 YTD 84% 점선 표시
```

### 3-4. 차트 2 — 섹터별 평균 바 차트 (선택)

```
Chart.js vertical bar
- X: 섹터명 (메모리, 장비, 설계, 파운드리, 아날로그)
- Y: 섹터 평균 YTD %
- 단색 (#1a56db)
```

### 3-5. 핵심 종목 해설 카드 (5개)

각 카드 구성:
```
국기 + 종목명(한국어) + 티커
수익률 배지 (+XXX%)
상승 요인 1~2줄 (약 100자)
```

대상 종목: SNDK / MU / SK하이닉스 / AMD / TSMC

### 3-6. 전체 순위표

```html
<table class="sshi-rank-table">
  <thead>순위 | 종목 | 국가 | 섹터 | 수익률 | 현재가</thead>
  <tbody>STOCKS 배열 순서대로</tbody>
</table>
```

- 모바일: `overflow-x: auto` 래퍼
- 수익률 셀: `+XXX%` 색상 — 100% 이상 #ef4444(빨강), 50~99% #f59e0b(주황), 0~49% #10b981(초록)

### 3-7. InfoNotice

```
출처: finviz.com, Yahoo Finance, alphasquare.co.kr (2026-06-18 기준)
본 리포트는 투자 권유가 아니며 과거 수익률이 미래를 보장하지 않습니다.
연초가(*)는 YTD 수익률 역산 추정치입니다.
```

---

## 4. 스타일: `_semiconductor-stocks-h1-2026.scss`

```scss
.sshi-page {
  // KPI 카드 3개
  .sshi-kpi {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;

    @media (max-width: 640px) { grid-template-columns: 1fr; }
  }

  .sshi-kpi-card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    padding: 1.25rem 1rem;
    text-align: center;

    .sshi-kpi-label { font-size: 0.8rem; color: #6b7280; margin-bottom: 0.25rem; }
    .sshi-kpi-value { font-size: 1.75rem; font-weight: 700; color: #1a56db; }
    .sshi-kpi-sub   { font-size: 0.75rem; color: #9ca3af; margin-top: 0.25rem; }
  }

  // 차트 래퍼
  .sshi-chart-wrap {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    padding: 1.5rem;
    margin-bottom: 2rem;

    h2 { font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem; }
    canvas { max-height: 560px; }
  }

  // 섹터 카드
  .sshi-sector-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 0.75rem;
    margin-bottom: 2rem;
  }

  .sshi-sector-card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    padding: 1rem;
    text-align: center;

    .sshi-sector-name  { font-size: 0.8rem; color: #6b7280; margin-bottom: 0.25rem; }
    .sshi-sector-avg   { font-size: 1.4rem; font-weight: 700; color: #ef4444; }
    .sshi-sector-count { font-size: 0.72rem; color: #9ca3af; }
  }

  // 핵심 종목 해설
  .sshi-highlights {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .sshi-highlight-card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    padding: 1.25rem;

    .sshi-hc-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }
    .sshi-hc-name   { font-weight: 700; font-size: 1rem; }
    .sshi-hc-ticker { font-size: 0.75rem; color: #9ca3af; }
    .sshi-hc-ytd    {
      display: inline-block;
      background: #fef2f2;
      color: #ef4444;
      font-weight: 700;
      font-size: 0.85rem;
      padding: 0.2rem 0.5rem;
      border-radius: 0.25rem;
      margin-bottom: 0.5rem;
    }
    .sshi-hc-note   { font-size: 0.85rem; color: #374151; line-height: 1.6; }
  }

  // 전체 순위표
  .sshi-table-wrap {
    overflow-x: auto;
    margin-bottom: 2rem;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
  }

  .sshi-rank-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;

    th {
      background: #f9fafb;
      padding: 0.75rem 1rem;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
      font-weight: 600;
      white-space: nowrap;
    }

    td {
      padding: 0.65rem 1rem;
      border-bottom: 1px solid #f3f4f6;
      white-space: nowrap;
    }

    tr:last-child td { border-bottom: none; }

    .sshi-ytd-high   { color: #ef4444; font-weight: 700; }  // 100%+
    .sshi-ytd-mid    { color: #f59e0b; font-weight: 600; }  // 50~99%
    .sshi-ytd-low    { color: #10b981; font-weight: 600; }  // 0~49%

    .sshi-country-badge {
      display: inline-block;
      font-size: 0.7rem;
      padding: 0.1rem 0.4rem;
      border-radius: 0.25rem;
      background: #f3f4f6;
      color: #374151;
    }
  }
}
```

---

## 5. 스크립트: `semiconductor-stocks-h1-2026.astro` 내 `<script>`

리포트 페이지이므로 별도 `public/scripts/` JS 파일 없이, `.astro` 파일 하단 `<script>` 태그로 Chart.js 차트 초기화.

```html
<script id="sshiData" type="application/json" set:html={JSON.stringify(chartData)} />
<script>
  function loadChartJs(cb) {
    if (window.Chart) return cb();
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
    s.onload = cb;
    document.head.appendChild(s);
  }

  loadChartJs(() => {
    const data = JSON.parse(document.getElementById('sshiData').textContent);

    // 차트 1: 수익률 가로 바
    const ctx1 = document.getElementById('sshiBarChart').getContext('2d');
    new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          data: data.ytds,
          backgroundColor: data.colors,
          borderRadius: 4,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: ctx => `+${ctx.parsed.x}%` } }
        },
        scales: {
          x: { ticks: { callback: v => `+${v}%` } }
        }
      }
    });

    // 차트 2: 섹터별 평균
    const ctx2 = document.getElementById('sshiSectorChart').getContext('2d');
    new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: data.sectorLabels,
        datasets: [{
          data: data.sectorAvgs,
          backgroundColor: '#1a56db',
          borderRadius: 4,
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { ticks: { callback: v => `+${v}%` } } }
      }
    });
  });
</script>
```

`chartData` 구성 (Astro frontmatter에서 생성):
```typescript
const chartData = {
  labels:       STOCKS.map(s => `${s.name} (${s.ticker})`),
  ytds:         STOCKS.map(s => s.ytd),
  colors:       STOCKS.map(s => ({ US:'#3b82f6', KR:'#ef4444', TW:'#10b981', JP:'#f59e0b' }[s.country])),
  sectorLabels: ['메모리','설계','장비','파운드리','아날로그'],
  sectorAvgs:   [334, 133, 147, 99, 86],
};
```

---

## 6. reports.ts 등록

```typescript
{
  slug: 'semiconductor-stocks-h1-2026',
  title: '반도체 주식 2026 상반기 수익률 | 미국·한국·대만 21종목 랭킹',
  description: '엔비디아·SK하이닉스·TSMC 등 반도체 주식 21종목의 2026년 상반기 수익률을 국가·섹터별로 비교. 어디가 제일 올랐는지 바로 확인.',
  order: 32.5,
  badges: ['NEW', '2026상반기', '수익률랭킹', '미국·한국·대만'],
},
```

---

## 7. sitemap.xml 추가

```xml
<url>
  <loc>https://bigyocalc.com/reports/semiconductor-stocks-h1-2026/</loc>
  <lastmod>2026-06-19</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.85</priority>
</url>
```

---

## 8. reports/index.astro 등록

`reportMetaBySlug`에 추가:
```javascript
'semiconductor-stocks-h1-2026': {
  label: '반도체 주식 2026 상반기',
  category: 'asset',
},
```

---

## 9. 구현 순서

1. `src/data/semiconductorStocksH12026.ts` 생성
2. `src/pages/reports/semiconductor-stocks-h1-2026.astro` 생성
3. `src/styles/scss/pages/_semiconductor-stocks-h1-2026.scss` 생성 + `app.scss` import 추가
4. `src/data/reports.ts` 엔트리 추가
5. `public/sitemap.xml` URL 추가
6. `src/pages/reports/index.astro` `reportMetaBySlug` 추가
7. `npm run build` 검증

---

## 10. QA 포인트

- [ ] 수익률 바 차트가 모바일에서 스크롤 없이 렌더링되는가 (세로로 길어야 정상)
- [ ] 전체 순위표 모바일 overflow-x 스크롤 동작 확인
- [ ] 연초가 추정치(`*`) 표기 InfoNotice에 명확히 있는가
- [ ] "투자 권유 아님" 면책 문구 노출 확인
- [ ] reports/index 카드에 정상 노출되는가
- [ ] 내부링크: semiconductor-etf-2026 ↔ semiconductor-stocks-h1-2026 양방향 링크 확인
