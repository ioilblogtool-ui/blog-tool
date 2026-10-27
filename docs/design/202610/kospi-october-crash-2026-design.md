# 코스피 10월 급락 2026 — 설계 문서

> 기획 원문: [kospi-october-crash-2026.md](../../plan/202610/kospi-october-crash-2026.md)
> 작성일: 2026-10-27 (한국시간)
> 문서 상태: **설계 작성 완료 / 구현·검증·배포 미착수**
> 수치 기준: 기획서의 2026-10-27 확인값. 이 설계 단계에서 수치를 추가 조사하지 않았다. `재확인 필요` 값은 구현 직전 KRX 원자료로 확정한다.

## 1. 문서 개요와 구현 결정

| 항목 | 결정 |
|---|---|
| slug / URL | `kospi-october-crash-2026` / `/reports/kospi-october-crash-2026/` |
| 유형 / 카테고리 | report / asset |
| 레이아웃 | `BaseLayout` 직접 사용(기존 리포트 패턴: `kospi-sidecar-record-2026.astro`, `samsung-micron-earnings-2026.astro`) |
| 코드·스타일 prefix | `KOC_` / `koc-` |
| 데이터 파일 | `src/data/kospiOctoberCrash2026.ts` |
| 유틸 | `src/utils/kospiOctoberCrash2026.ts` (빌드 시 검증·계산·화면 모델) |
| 클라이언트 JS | `public/scripts/kospi-october-crash-2026.js` — 기준점 탭 전환, 차트 렌더링만 |
| 차트 | Chart.js(기존 CDN 패턴) 라인 차트 1개. JS 미동작 시 표 fallback |
| 사용자 입력 | 없음. 기준점 탭 3개(10월 최고 종가 / 6월 사상 최고 종가 / 9월 말 종가) |
| 배지 | 공식 / 참고 / 시뮬레이션 / 추정만 |
| Title | `코스피 10월 급락 2026 \| 외국인 매도·반도체 하락 원인 정리` (BaseLayout은 접미사 미부착 — 이 문자열 그대로 전달) |
| Description | 기획서 문구 그대로 |
| OG | `public/og/reports/kospi-october-crash-2026.png` (`scripts/generate-og-tools.py` REPORTS 배열 추가) |

### 코드 확인으로 정리한 사항

- 기존 리포트는 `CalculatorHero`(eyebrow/title/description), `InfoNotice`(title/lines), `SeoContent`(introTitle/intro/criteria/faq/related)를 사용한다. FAQ 타입은 `{ question, answer }`.
- JSON-LD는 페이지에서 Article·FAQPage·BreadcrumbList 배열로 만들어 `BaseLayout`의 `jsonLd`로 전달한다(사이드카 리포트 패턴).
- 설정 데이터는 `<script id="kocConfig" type="application/json" set:html={JSON.stringify(config)}>`로 주입하고 `type="module"` 스크립트가 읽는다(레버리지 계산기 패턴).
- `url-state.js`는 `readParam`, `readBool`, `writeParams(map)`를 export한다. 기준점 탭 상태는 `?base=` 하나만 저장한다.

## 2. 파일 구조와 책임

| 파일 | 작업 | 책임 |
|---|---|---|
| `src/data/kospiOctoberCrash2026.ts` | 신규 | 타입·출처·지수 시계열·이벤트·수급·원인 카드·FAQ·intro·관련 링크·메타 |
| `src/utils/kospiOctoberCrash2026.ts` | 신규 | `validate`, `pctChange`, `recoveryNeeded`, `buildView` 순수 함수 |
| `src/pages/reports/kospi-october-crash-2026.astro` | 신규 | 빌드 시 검증 → 렌더링, JSON-LD |
| `public/scripts/kospi-october-crash-2026.js` | 신규 | 기준점 탭, Chart.js 초기화, URL `base` |
| `src/styles/scss/pages/_kospi-october-crash-2026.scss` | 신규 | `koc-` prefix |
| `src/styles/app.scss` | 수정 | `@use 'scss/pages/kospi-october-crash-2026';` |
| `src/data/reports.ts` | 수정 | 등록 |
| `src/pages/index.astro` | 수정 | `reportMetaBySlug` `{ category: "asset", isNew: true }` |
| `src/pages/reports/index.astro` | 수정 | `reportMetaBySlug` |
| `public/sitemap.xml` | 수정 | URL 추가 |
| `scripts/generate-og-tools.py` | 수정 | REPORTS 항목 추가 후 단일 slug 생성 |

## 3. 데이터 파일 설계

### 3-1. 타입

```ts
export type Badge = "공식" | "참고" | "시뮬레이션" | "추정";
export type Basis = "close" | "intraday";

export type KocSource = {
  id: string;
  org: string;          // 한국거래소, 한국은행, 언론사명
  title: string;
  url: string;
  publishedAt: string;  // YYYY-MM-DD
  period: string;       // 데이터 기준기간
  checkedAt: string;
};

export type KocIndexPoint = {
  date: string;
  close: number | null;
  changePct: number | null;       // 원자료 등락률(재계산 아님)
  intradayHigh?: number;
  intradayLow?: number;
  badge: Badge;
  status: "확정" | "재확인 필요";
  sourceId: string;
};

export type KocEvent = {
  date: string;
  time?: string;
  market: "코스피" | "코스닥";
  kind: "매도 사이드카" | "매수 사이드카" | "서킷브레이커 1단계";
  ordinalNote?: string;           // "올해 50번째(매도 26번째)"
  note: string;
  sourceId: string;
};

export type KocFlowRow = {
  id: string;
  period: string;                 // "10/1~10/19"
  scope: "코스피 전체" | "삼성전자+SK하이닉스";
  foreign: number;                // 억원, 순매수(+)/순매도(-)
  individual: number | null;
  institution: number | null;
  badge: Badge;
  sourceId: string;
  note?: string;
};

export type KocCause = {
  id: string;
  title: string;
  fact: string;                   // 사실 문장
  interpretation: string;         // 해석 문장(분리 렌더링)
  factBadge: Badge;
  interpretationBadge: "참고" | "추정";
  sourceIds: string[];
};

export type KocBasePoint = { id: "octHigh" | "juneHigh" | "septEnd"; label: string; date: string; close: number };
```

### 3-2. 초기 데이터 (기획서 3-1~3-3 이관)

`KOC_INDEX` (종가 기준 표시용 — 장중 값은 별도 필드):

| date | close | changePct | 장중 | status | sourceId |
|---|---:|---:|---|---|---|
| 2026-06-22 | 9114.55 | null | — | 재확인 필요 | `newspim-1020` |
| 2026-09-28 | 6889.74 | -2.70 | high 7065.90 | 재확인 필요 | `investing-kospi` |
| 2026-10-01 | 6971.35 | 1.95 | — | 재확인 필요 | `investing-kospi` |
| 2026-10-08 | 6625.93 | -2.62 | — | 재확인 필요 | `businesskorea-1008` |
| 2026-10-14 | 6008.81 | null | — | 재확인 필요 | `etnews-1015` (10/15 기사 내 전일 종가) |
| 2026-10-15 | 5554.22 | -7.57 | low 5528.05 (CB 시점) | 재확인 필요 | `asiae-1015` |
| 2026-10-19 | 5768.01 | null | — | 재확인 필요 | `newspim-1020` |
| 2026-10-23 | 5550.30 | 0.30 | low 5305.98 | 재확인 필요 | `jkn-1023` |
| 2026-10-26 | 5469.47 | -1.46 | high 5565.67 / low 5455.11 | 재확인 필요 | `seoul-1026` |
| 2026-10-27 | 5638.34 | 3.09 | — | 재확인 필요 | `investing-kospi` |

- 차트용 일별 전체 시계열(6/1~10/30)은 **구현 시 KRX 정보데이터시스템 [지수 > 주가지수 > 개별지수 시세추이] CSV로 채운다.** 위 표는 KRX 값과 대조할 검증 포인트로 사용한다. KRX와 다르면 KRX 값이 우선이며 본문 수치도 함께 갱신한다.
- KRX로 확정한 값은 `status: "확정"`, `badge: "공식"`, sourceId `krx-index`로 바꾼다. 확정 전 배포 금지(10장 게이트).

`KOC_EVENTS`: 10/13 09:47 매도 사이드카(올해 50번째·매도 26번째), 10/15 09:07 코스피 매도 사이드카(매도 27번째), 10/15 09:12 코스닥 매도 사이드카, 10/15 12:23 코스닥 CB, 10/15 12:38 코스피 CB(올해 10번째), 10/27 10:13 매수 사이드카(매수 26번째). 사이드카 리포트 데이터와 **같은 값**이어야 한다 → 9장 단일 출처 규칙.

`KOC_FLOWS`(억원):

| id | period | scope | foreign | individual | institution |
|---|---|---|---:|---:|---:|
| `oct1-19` | 10/1~10/19 | 코스피 전체 | -175,900 | 62,300 | null |
| `oct1-19-top2` | 10/1~10/19 | 삼성전자+SK하이닉스 | -140,700 | 57,300 | null |
| `since-peak` | 6/23~10/19 | 코스피 전체 | -848,500 | 230,800 | 86,300 |
| `d1015` | 10/15 | 코스피 전체 | -36,241 | 12,886 | 16,930 |
| `d1026` | 10/26 | 코스피 전체 | -6,955 | 474 | 6,110 |

모두 `badge: "참고"`. KRX [투자자별 거래실적] 월간·기간 조회값으로 교체하면 `공식`. 10월 전체 합계(`oct-full`)는 10/30 장 마감 후에만 추가한다.

`KOC_CAUSES`: 기획서 3-4의 9개 변수 중 화면에는 7개(AI 투자 지속성, 메모리 사이클, 중국 메모리, 미국 금리·CPI, 한국 기준금리, 환율, 실적 vs 주가). 유가·중동, 수급 구조는 본문 단락으로만 언급. 각 카드는 `fact`·`interpretation`을 분리 저장한다.

`KOC_BASE_POINTS`: `octHigh`(10/1, 6971.35), `juneHigh`(6/22, 9114.55), `septEnd`(9/30 종가 — **현재 미확보, KRX에서 채움**. 확보 전에는 탭 숨김).

`KOC_SOURCES`: 기획서 3-5 순서. URL은 기획서 표의 링크를 그대로 옮긴다.

### 3-3. 콘텐츠 데이터

- `KOC_SEO_INTRO`: 기획서 7장 4단락. 각 150자 이상, 수치 문장은 `buildView` 결과로 조합해 데이터 갱신 시 자동 반영.
- `KOC_FAQ`: 6개, 각 답변 2~3문장. 5번(반등은 바닥 신호?)은 "단정할 수 없다 + 확인 지표" 구조 고정.
- `KOC_CHECKLIST`: 반등 확인 지표 5개(외국인 순매수 전환 지속, 반도체 실적 가이던스, 미국 반도체지수, 금리 경로, 신용잔고·반대매매).
- `KOC_RELATED`: 4개(사이드카, 레버리지 계산기, 손실 복구 계산기, 삼성·마이크론 실적). 손실 복구 계산기는 `requiresPage: "src/pages/tools/stock-loss-recovery-calculator.astro"` 필드를 두고, 빌드 시 파일 미존재면 렌더링에서 제외.

## 4. 계산·검증·화면 모델

### 4-1. 함수 계약

| 함수 | 역할 |
|---|---|
| `validateKocData(data)` | 날짜 오름차순, sourceId 존재, 종가 양수, `status` 값, 이벤트 날짜가 시계열 범위 내인지. 실패 시 throw(빌드 실패) |
| `pctChange(from, to)` | `to / from - 1`. from ≤ 0이면 null |
| `recoveryNeeded(from, to)` | `from / to - 1` (to 기준에서 from 회복) |
| `findLowestClose(points, start, end)` | 구간 최저 종가 |
| `findLowestIntraday(points, start, end)` | 장중 최저(별도) |
| `buildKocView(baseId)` | KPI 4개, 하락률 카드, 회복 필요 상승률, 타임라인 행, 수급 행 |
| `formatPct(v, digits=2)` | `+`/`-` 부호 포함, 한국어 숫자 포맷 |
| `formatEok(v)` | 억원 → "3조 6,241억원" 형태 |

### 4-2. 산식과 기대값 (현재 잠정 데이터 기준 — KRX 확정 후 재계산)

| 지표 | 산식 | 기대값 |
|---|---|---:|
| 10월 고점→최저 종가 | 5469.47/6971.35−1 | −21.54% |
| 10월 고점→장중 저점 | 5305.98/6971.35−1 | −23.89% (`basis: intraday` 라벨) |
| 6월 고점→10월 최저 종가 | 5469.47/9114.55−1 | −39.99% |
| 10월 최저 종가→10월 고점 회복 필요 | 6971.35/5469.47−1 | +27.46% |
| 10/27 반등 | 5638.34/5469.47−1 | +3.09% |

- 재계산 지표는 `시뮬레이션` 배지. 원자료 등락률(changePct)은 원자료 배지를 따른다.
- 소수 둘째 자리 반올림은 표시 단계에서만.

### 4-3. 화면 모델 (빌드 시 생성, JSON 주입)

```ts
type KocView = {
  basePoints: KocBasePoint[];
  defaultBaseId: "octHigh";
  byBase: Record<string, { dropToLowClose: number; dropToLowIntraday: number; recoveryNeeded: number; lowCloseDate: string }>;
  chart: { labels: string[]; closes: number[]; events: { date: string; label: string }[] };
};
```

기준점별 결과를 빌드 시 모두 계산해 넣고, 클라이언트 JS는 표시만 바꾼다(계산 로직 이중화 방지).

## 5. 페이지 섹션·Astro 구성

### 화면 순서

1. `CalculatorHero` — eyebrow "2026 증시 리포트", H1 "코스피 10월 급락 2026, 왜 이렇게 떨어졌나", 기준일 배지
2. `InfoNotice` — "과거 데이터 정리이며 매수·매도 권유가 아닙니다", "원인 분석은 언론·증권가 해석(참고)입니다", "종가 기준과 장중 기준을 구분해 표기합니다"
3. 요약 KPI 4개 — 10월 하락률(시뮬레이션), 10월 최저 종가(공식), 외국인 순매도 10/1~19(참고), 10월 사이드카·CB 발동 수(참고)
4. 기준점 탭 + 하락률·회복 필요 카드 (`data-koc-base`)
5. 지수 흐름 차트 `<canvas id="kocChart">` + `<table class="koc-fallback">`
6. 10월 날짜별 타임라인 (`<ol class="koc-timeline">`)
7. 누가 팔고 누가 샀나 — 수급 표 + 막대(CSS bar, 정적)
8. 실적은 좋은데 주가는 왜? — 삼성 Q3 잠정 영업이익 107.4조(공식) vs 발표일 지수 −2.62%, 설명 단락
9. 원인 변수 7개 카드 (fact/interpretation 2단, 배지 각각)
10. 반등은 회복 신호일까 — 10/27 데이터 + 체크리스트 5개
11. CTA — 손실 복구 계산기(존재 시), 레버리지 ETF 계산기
12. `SeoContent` (intro 4, criteria, FAQ 6, related 4)
13. 출처·기준 표 (기관·자료명·URL·발표일·기준기간)

### 마크업 스케치

```astro
<section class="koc-section koc-base" aria-labelledby="koc-base-title">
  <h2 id="koc-base-title">어디서부터 얼마나 떨어졌나</h2>
  <div class="koc-base__tabs" role="tablist">
    {view.basePoints.map((b) => (
      <button type="button" role="tab" data-koc-base={b.id}
        aria-selected={b.id === view.defaultBaseId ? "true" : "false"}>{b.label}</button>
    ))}
  </div>
  <div class="koc-base__cards">
    <article class="koc-card"><p>최저 종가까지 하락률</p>
      <strong data-koc-result="dropToLowClose">{fmt(view.byBase.octHigh.dropToLowClose)}</strong>
      <span class="badge badge--sim">시뮬레이션</span></article>
    <!-- 장중 저점, 회복 필요 상승률 동일 패턴 -->
  </div>
</section>
<script id="kocConfig" type="application/json" set:html={JSON.stringify(view)}></script>
<script type="module" src={withBase("/scripts/kospi-october-crash-2026.js")}></script>
```

SSR 초기값을 마크업에 렌더링해 JS 없이도 기본 기준점 결과가 보이게 한다.

## 6. JS 인터랙션과 상태

- `kocConfig` 파싱 → 탭 클릭 시 `byBase[id]` 값으로 `[data-koc-result]` 갱신, `aria-selected` 토글, `writeParams({ base: id })`.
- 로드 시 `readParam("base", "octHigh")`, 존재하지 않는 id는 기본값.
- Chart.js: 라인 1개(종가), 이벤트 날짜는 포인트 스타일 강조 + 툴팁 "매도 사이드카 09:07" 등 한국어. `window.Chart` 미존재 시 캔버스 숨기고 fallback 표 노출.
- IIFE/module 패턴, 전역 노출 없음.

## 7. SCSS·반응형·접근성

- `koc-` prefix, 중첩 3단계 이내, 기존 리포트 팔레트 리터럴 색상(ARCHITECTURE 규칙).
- 상승/하락 색은 의미 색 하나만(하락=경고 톤), 부호·텍스트 병기로 색맹 대응.
- 모바일(≤480px): KPI 2×2, 기준점 탭 가로 스크롤 없이 3등분, 타임라인 세로 카드, 수급 표는 행→카드 전환, 차트 높이 240px.
- 표에 `<caption>`과 단위(억원) 명시. 탭은 `role="tablist"`/`role="tab"`.

## 8. SEO·출처·내부 링크·등록

### 메타와 JSON-LD

- Title/Description: 1장 값. Article(`datePublished`는 실제 배포일, `dateModified` = `KOC_META.updatedAt`), FAQPage, BreadcrumbList(홈 → 리포트 → 본 페이지).

### 내부 링크

| 대상 | 위치 |
|---|---|
| `/reports/kospi-sidecar-record-2026/` | 타임라인 하단 "사이드카 기록 전체 보기" |
| `/tools/kospi-leverage-etf-calculator/` | 수급 섹션(개인 KODEX 레버리지 순매수 언급 아래), CTA |
| `/tools/stock-loss-recovery-calculator/` | 기준점 카드 하단, CTA (파일 존재 시에만) |
| `/reports/samsung-micron-earnings-2026/` | 실적 vs 주가 섹션 |

### 등록 스케치

```ts
// src/data/reports.ts
{
  slug: "kospi-october-crash-2026",
  title: "코스피 10월 급락 2026 | 외국인 매도·반도체 하락 원인 정리",
  description: "2026년 10월 코스피 급락을 날짜별 지수, 외국인 수급, 삼성전자·SK하이닉스 흐름으로 정리했습니다. AI 투자 우려·금리·중국 메모리 변수와 최근 반등의 의미까지 확인하세요.",
  order: /* 기존 최댓값 확인 후 다음 값 */,
  badges: ["신규", "코스피", "급락", "2026"],
},
// src/pages/reports/index.astro reportMetaBySlug
"kospi-october-crash-2026": {
  eyebrow: "2026년 10월 증시",
  tags: [{ label: "코스피", mod: "asset" }, { label: "외국인 수급", mod: "asset" }, { label: "반도체", mod: "asset" }],
  category: "asset",
  isNew: true,
},
```

```python
# scripts/generate-og-tools.py REPORTS
{"slug": "kospi-october-crash-2026", "title": "코스피 10월 급락 2026", "description": "날짜별 지수·외국인 수급·반도체 흐름으로 본 10월 조정", "eyebrow": "자산 리포트", "stats": [("10월 고점 대비", "-21.5% · 종가"), ("외국인 순매도", "17.6조 · 10/1~19")]},
```

OG 수치는 KRX 확정값으로 생성한다. 생성은 메모리 기준(스크래치패드 Pillow 설치 후 단일 slug `generate()` 호출).

```xml
<url>
  <loc>https://bigyocalc.com/reports/kospi-october-crash-2026/</loc>
  <lastmod>배포일</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.7</priority>
</url>
```

## 9. 갱신 절차와 단일 출처

- 사이드카·CB 이벤트는 사이드카 리포트(`kospiSidecarRecord2026.ts`)와 값이 같아야 한다. 구현 시 사이드카 갱신 데이터에 `KSR_EVENTS_2026`(10월 기록)을 export하고 이 페이지에서 import해 중복 입력을 피한다. 사이드카 갱신이 먼저 배포되지 않으면 임시로 본 데이터에 두고 TODO 주석 없이 9장 규칙만 설계서에 남긴다.
- 갱신 순서: ① KRX 종가·수급 반영 → ② `updatedAt`, sitemap `lastmod` → ③ 10월 전체 월간 수급(10/30 이후) → ④ 삼성·SK하이닉스 3분기 실적 문장(실적 리포트 링크로 위임).
- 갱신 조건(기획서): 10월 저점 하회 또는 7,000선 회복 등 국면 변화 시 리드 문장 재작성.

## 10. 구현 순서·검증·완료 조건

### 구현 순서

1. KRX에서 6/1~최신 일별 종가, 10월 투자자별 매매동향 수집 → 3-2 검증 포인트 대조
2. 데이터·유틸 파일 작성, `validateKocData` 통과
3. Astro 페이지·SCSS·JS
4. 등록 5곳, OG 생성
5. `npm run check:all`, `npm run build`, `dist/reports/kospi-october-crash-2026/index.html` 확인

### 배포 게이트 (하나라도 미충족 시 배포 금지)

- `KOC_INDEX`에 `status: "재확인 필요"` 항목이 남아 있지 않다.
- 4-2 기대값을 KRX 확정값으로 다시 계산해 화면 값과 일치.
- 10월 전체 표기는 10/30 장 마감 이후 데이터에만 사용.

### QA 체크리스트

- [ ] 종가·장중 값이 같은 열에 섞이지 않음
- [ ] 모든 수치 옆 배지, 사실/해석 분리 렌더링
- [ ] 금지 표현(대폭망, 개미 전멸, 무조건 반등, 지금이 바닥, 추세 전환 확정) 없음 — 데이터 파일 grep
- [ ] 기준점 탭 3개 결과 전환, URL `?base=` 복원
- [ ] Chart.js 차단 시 fallback 표 노출
- [ ] 320/375/768px 가로 스크롤 없음
- [ ] 내부 링크 4개 동작(손실 복구 계산기 미배포 시 비노출)
- [ ] FAQ 6개·intro 4단락 길이 기준 충족

### 완료 조건

```bash
npm run check:all
npm run build
```

둘 다 성공해야 한다. **이 설계서 작성 시점에는 구현·실행하지 않았다.**
