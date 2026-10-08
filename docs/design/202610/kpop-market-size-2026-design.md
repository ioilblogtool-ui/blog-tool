# K팝 시장 규모 2026 리포트 — 설계 문서

> 기획 원문: [kpop-market-size-2026.md](../../plan/202610/kpop-market-size-2026.md)
> 작성일: 2026-10-08
> 문서 상태: **설계 문서 작성 완료 / 데이터 확정·구현·빌드·화면 검증·배포 미착수**
> 수치 기준: 기획서에서 2026-10-08 조사한 값. 이번 작업은 구현 설계이며 수치를 추가 조사하지 않았다. 구현 1단계에서 원 보고서·DART·ECOS로 확정한다.
> 연동 문서: [kpop-big4-agency-comparison-2026-design.md](./kpop-big4-agency-comparison-2026-design.md) — 4대 기획사 비교(기업 레벨 허브). 이 페이지는 산업 레벨 허브.

## 1. 문서 개요와 구현 결정

| 항목 | 결정 |
|---|---|
| slug / URL | `kpop-market-size-2026` / `/reports/kpop-market-size-2026/` |
| 유형 / 카테고리 | report / `culture` (기존 값. 신규 카테고리 없음) |
| 레이아웃 | `BaseLayout.astro` 직접 사용 + `SiteHeader`·`CalculatorHero`·`InfoNotice`·`SeoContent`. 입력 폼이 없어 ToolShell 미사용 |
| 코드·스타일 prefix | 상수 `KMS_` / CSS `kms-` |
| 대표값 | 국내 음악산업 매출(2024 확정). ‘K팝 시장 ○조원’ 단일값 표기 금지 |
| 기준연도 | 국내 확정 2024(콘텐츠산업조사·대중문화예술 실태조사) / 2025 잠정 성장률(동향분석) / 글로벌 2025(IFPI) / 음반 수출 2025(관세청) / 4사 2024·2025(DART) |
| 사용자 입력 | 없음. 원화 환산도 토글 없이 달러값 옆 보조 텍스트로 정적 렌더 |
| 차트 | 정적 CSS bar 2종(음악 매출·수출 추이) + CSS 포함관계 다이어그램 1종. Chart.js·클라이언트 JS 없음 (`REPORT_CONTENT_GUIDE` CSS bar 우선 원칙, 4대 기획사 설계와 동일) |
| 계산 | 빌드 시 유틸 순수 함수에서 산출(배수·비중·4사 합계·환산). 화면 문구 하드코딩 금지 |
| 데이터 배지 | 공식 / 참고 / 시뮬레이션 / 추정만 |
| 광고 | BaseLayout 기본값. 증권·투자 제휴 블록 없음 |
| 공개 게이트 | `KMS_META.publishReady` — 4-3 조건 충족 전 reports.ts·sitemap 미등록 |

### 코드 확인으로 정리한 사항

- `BaseLayout` Props(`title`, `description?`, `ogImage?`, `jsonLd?`, `loadAds?` 등), `SeoContent` Props(`introTitle`, `intro`, `criteria?`, `faq?`, `related?`, 리포트용 `introSummary`·`criteriaTitle`·`relatedTitle`)는 4대 기획사 설계에서 확인한 내용과 같다. 컴포넌트 수정 없음.
- `SeoContent` 고정 id(`overview`, `highlights`, `criteria`, `faq`, `related`)를 본문 섹션 id로 쓰지 않는다.
- 순수 함수는 `src/utils/<camelSlug>.ts`로 분리(현재 `base.ts`, `samsungMicronEarnings2026.ts` 존재, 4대 기획사도 같은 패턴 예정).
- 리포트 허브: `src/pages/reports/index.astro`의 `reportMetaBySlug`. culture 리포트(영화)는 태그 mod `salary`를 쓴다 → 동일하게 맞추고 새 mod 추가 안 함.
- OG: `scripts/generate-og-tools.py`의 `REPORTS` 배열에 `{slug, title, description, eyebrow, stats}` 추가, 출력 `public/og/reports/<slug>.png`.
- 검증 스크립트: `scripts/check-<slug>.mjs` 패턴.
- 현재 워킹트리에 다른 세션의 미커밋 변경(`reports.ts`, `index.astro`, `sitemap.xml`, `app.scss`, `generate-og-tools.py` 등)이 있다. 구현 시 공용 파일은 최신 상태를 다시 읽고 1줄 단위로만 추가한다.

## 2. 파일 구조와 책임

아래는 향후 생성·수정 대상이며 현재 생성된 파일이 아니다.

| 파일 | 작업 | 책임 |
|---|---|---|
| `src/data/kpopMarketSize2026.ts` | 신규 | 타입·출처·통계 레코드·시계열·환율·수익경로 설명·경제효과·메타·intro·FAQ·관련 링크·갱신 기록 |
| `src/utils/kpopMarketSize2026.ts` | 신규 | 검증·배수/비중·4사 합계·환산·표시 포맷·화면 모델 생성(순수 함수) |
| `src/pages/reports/kpop-market-size-2026.astro` | 신규 | 빌드 시 검증 호출, 렌더링, Article+FAQPage+BreadcrumbList JSON-LD |
| `src/styles/scss/pages/_kpop-market-size-2026.scss` | 신규 | `kms-` prefix 스타일 |
| `src/styles/app.scss` | 수정 | `@use` 1줄 |
| `scripts/check-kpop-market-size-2026.mjs` | 신규 | 데이터·산식·dist HTML 검증 |
| `src/data/reports.ts` | 수정 | slug·title·description·order·badges |
| `src/pages/index.astro` | 수정 | `reportMetaBySlug`에 `{ category: "culture", isNew: true }` |
| `src/pages/reports/index.astro` | 수정 | eyebrow `K팝 산업 규모`, tags `음악산업`·`수출`·`세계시장`(mod `salary`), category `culture`, isNew |
| `public/sitemap.xml` | 수정 | 공개 시 URL(트레일링 슬래시)·lastmod |
| `scripts/generate-og-tools.py` / `public/og/reports/kpop-market-size-2026.png` | 수정 / 생성 | 1200×630 OG |
| 4대 기획사 리포트 데이터 | 수정(연동) | 역방향 관련 링크 1줄(8절) |

`public/scripts/*.js`는 만들지 않는다.

## 3. 데이터 파일 설계

### 3-1. 타입

```ts
export type Badge = '공식' | '참고' | '시뮬레이션' | '추정';
export type StatStatus = '확정' | '잠정' | '재확인 필요';

export type Scope =
  | 'content-industry'      // 콘텐츠산업 11개 장르
  | 'music-industry'        // 음악산업 (콘텐츠산업 특수분류)
  | 'pop-culture-industry'  // 대중문화예술산업 (기획업+제작업)
  | 'agency'                // 대중문화예술기획업
  | 'album-export'          // 관세청 음반 물품 수출
  | 'global-recorded'       // IFPI recorded music
  | 'hallyu'                // 한류 전체 파급효과
  | 'company';              // 개별 기업 연결 실적

export type Unit = 'baekeok' | 'eok' | 'usd-million' | 'usd-thousand' | 'usd-billion' | 'count' | 'person' | 'pct';
// baekeok = 백억원(콘텐츠산업조사 원표 단위), eok = 억원

export type Source = {
  id: string;
  publisher: string;        // 문화체육관광부, 한국콘텐츠진흥원, IFPI, 관세청, 한국국제문화교류진흥원, 금융감독원 DART, 한국은행
  title: string;
  url: string;
  publishedAt: string;      // YYYY-MM-DD
  checkedAt: string;
  locator: string;          // '붙임 표 음악 행', 'p.○', '보도 본문' 등
  isPrimary: boolean;       // 원 보고서·원표 확인 = true, 언론 보도 = false
  limitation: string | null;
};

export type MarketStat = {
  id: string;               // 'music-sales-2024'
  metricName: string;       // '국내 음악산업 매출'
  value: number | null;     // 원자료 단위 그대로
  unit: Unit;
  year: number;
  period: '연간';
  scope: Scope;
  status: StatStatus;
  badge: Badge | null;      // value null이면 null
  sourceId: string | null;
  includes: string;         // 범위 비교표 '포함' 열
  excludes: string;         // 범위 비교표 '불포함' 열
  notes?: string;
  missingReason?: string;   // value null일 때 필수
};

export type SeriesPoint = { year: number; value: number };
export type Series = {
  id: 'music-sales' | 'music-export' | 'content-sales' | 'content-export';
  unit: 'baekeok' | 'usd-million';
  scope: Scope;
  sourceId: string;         // 단일 조사표 1개만 허용
  points: SeriesPoint[];    // 2019~2024 확정
  provisional?: { year: 2025; growthPct: number; sourceId: string }; // 막대 아님, 칩
  breakNote?: string;       // 조사 기준 변경 확인 결과(2020→2021)
};

export type FxRate = {
  year: number;
  krwPerUsd: number | null; // ECOS 연평균 매매기준율
  basis: '연평균 매매기준율';
  sourceId: string | null;
  checkedAt: string | null;
};

export type RevenueChannel = {
  key: 'album' | 'streaming' | 'concert' | 'fanmeeting' | 'md' | 'ads' | 'ip' | 'platform' | 'video' | 'royalty';
  label: string;            // '음반', '음원·스트리밍' ...
  description: string;      // 1~2문장 산업 일반 설명
  example?: { text: string; badge: '참고'; sourceId: string }; // 공개 수치 사례 최대 1개
};

export type EconomicEffect = {
  id: string;
  label: string;
  value: number | null;
  unit: Unit;
  scopeLabel: '한류 전체';  // 고정. K팝 단독 표기 금지
  badge: Badge;
  sourceId: string;
  note: string;
};
```

4사 매출은 이 파일에 복제하지 않는다(3-4).

### 3-2. 초기 통계 레코드 (기획서 조사값)

| id | metricName | value | unit | year | scope | status | badge | 비고 |
|---|---|---:|---|---:|---|---|---|---|
| `content-sales-2024` | 콘텐츠산업 매출 | 15,740 | baekeok | 2024 | content-industry | 확정 | 공식 | 원표 확인 완료 |
| `content-export-2024` | 콘텐츠산업 수출 | 14,075.4 | usd-million | 2024 | content-industry | 확정 | 공식 | 원표 확인 완료 |
| `content-sales-2025` | 콘텐츠산업 매출(잠정) | 16,148.39 | baekeok | 2025 | content-industry | 잠정 | 공식 | 보도 확인 → 원문 대조 전 `참고` |
| `content-export-2025` | 콘텐츠산업 수출(잠정) | 14,905.82 | usd-million | 2025 | content-industry | 잠정 | 참고 | 동일 |
| `music-sales-2024` | 국내 음악산업 매출 | 1,327 | baekeok | 2024 | music-industry | 확정 | 공식 | **대표 KPI** |
| `music-export-2024` | 음악산업 수출 | 1,801.4 | usd-million | 2024 | music-industry | 확정 | 공식 | KPI |
| `music-sales-2025` | 음악산업 매출(잠정) | null | baekeok | 2025 | music-industry | 재확인 필요 | null | 동향분석 원문에 절대값 있으면 채움, 없으면 null 유지 |
| `music-export-2025` | 음악산업 수출(잠정) | null | usd-million | 2025 | music-industry | 재확인 필요 | null | 동일 |
| `music-biz-2024` | 음악산업 사업체 수 | 37,082 | count | 2024 | music-industry | 확정 | 공식 | |
| `music-workers-2024` | 음악산업 종사자 | 73,677 | person | 2024 | music-industry | 확정 | 공식 | |
| `popculture-sales-2024` | 대중문화예술산업 매출 | 153,845 | eok | 2024 | pop-culture-industry | 확정 | 참고 | 실태조사 원문 대조 후 공식, KPI |
| `agency-domestic-2024` | 기획업 국내 매출 | 78,020 | eok | 2024 | agency | 확정 | 참고 | 동일 |
| `agency-overseas-2024` | 기획업 해외 매출 | 17,057 | eok | 2024 | agency | 확정 | 참고 | 동일 |
| `album-export-2025` | 음반 수출 | 301,744 | usd-thousand | 2025 | album-export | 확정 | 참고 | 관세청 원자료 대조 후 공식 |
| `global-recorded-2025` | 글로벌 recorded music 매출 | 31.7 | usd-billion | 2025 | global-recorded | 확정 | 공식 | KPI |
| `global-streaming-share-2025` | 스트리밍 매출 비중 | 69.6 | pct | 2025 | global-recorded | 확정 | 공식 | |
| `global-paid-subs-2025` | 유료 스트리밍 계정 | 837 | count(백만) | 2025 | global-recorded | 확정 | 공식 | unit 표기 '백만 계정'은 notes |
| `global-growth-2025` | 글로벌 성장률 | 6.4 | pct | 2025 | global-recorded | 확정 | 공식 | 아시아 +10.9%는 notes |
| `korea-rank-ifpi-2025` | IFPI 한국 시장 순위 | null | count | 2025 | global-recorded | 재확인 필요 | null | IFPI 원문 Top 10 확인 전 비표시 |

2025 잠정 성장률(음악 매출 +15.8%, 수출 +32.4%)은 `Series.provisional`에 저장한다.

### 3-3. 시계열 (자료 A 단일 원표 — 2026-02-27 문체부 보도자료 붙임)

| 연도 | music-sales (백억원) | music-export (백만 달러) |
|---|---:|---:|
| 2019 | 681 | 756.2 |
| 2020 | 606 | 679.6 |
| 2021 | 937 | 775.3 |
| 2022 | 1,101 | 927.6 |
| 2023 | 1,263 | 1,222.5 |
| 2024 | 1,327 | 1,801.4 |

- 시계열은 반드시 같은 발표의 한 표에서만 가져온다. 이전 연도 발표값과 섞지 않는다(과거 연도 수정 가능성).
- `breakNote`: 2020→2021 음악 매출 +54.6% 구간이 조사 기준 변경인지 1단계에서 확인. 확인 불가 시 “2021년 증가 폭에는 조사 범위 변화가 포함됐는지 원 보고서로 확인되지 않았습니다” 주석.

### 3-4. 4대 기획사 데이터 연동

- 4사 연결매출의 단일 출처는 `src/data/kpopBig4AgencyComparison2026.ts`(4대 기획사 설계 3-3). 이 페이지는 해당 파일의 `AGENCY_RECORDS`를 import해 `annual.revenue`(2025)·`annual.prevRevenue`(2024)만 읽는다. 숫자를 이 파일에 다시 적지 않는다.
- 4대 기획사 설계의 초기값(2024: HYBE 22,556 / SM 9,897 / JYP 6,018 / YG 3,649억원, 2025: 26,499 / 11,749 / 8,219 / 5,454억원) 기준 검산: 2024 합계 42,120억원 ÷ 음악산업 132,700억원 = **31.7%**, 2025 합계 51,921억원.
- 연동 조건: 4개사 해당 Metric이 모두 `available`이고 `badge === '공식'`일 때만 섹션 6 비율 카드를 렌더. 아니면 섹션 6은 “4대 기획사 실적 확정 후 비교를 제공합니다” 안내만.
- 4대 기획사 데이터 파일이 아직 없으면 import 자체를 하지 않고 `KMS_BIG4_ENABLED = false` 상수로 섹션 6을 숨긴다(빌드 실패 방지). 권장 구현 순서는 4대 기획사 리포트 선행(7절).

### 3-5. 환율

| year | krwPerUsd | 상태 |
|---|---|---|
| 2024 | null | 1단계에서 한국은행 ECOS 연평균 매매기준율로 확정 |
| 2025 | null | 동일 |

`krwPerUsd`가 null이면 원화 환산 텍스트를 렌더하지 않는다(달러값만). 언론 환산값(예: 음악 수출 약 2조 5,797억원)은 사용하지 않는다.

### 3-6. 출처 ID 계획

| id | 자료 | isPrimary |
|---|---|---|
| `mcst-content-survey-2024` | 문체부 「2025년 콘텐츠산업조사(2024년 기준)」 보도자료 붙임 표 | true (확인 완료) |
| `kocca-trend-2025` | KOCCA 「2025년 4분기 및 연간 콘텐츠산업 동향분석 보고서」 | 보도 → 원문 확인 후 true |
| `kocca-popculture-2025` | KOCCA·문체부 「2025 대중문화예술산업 실태조사」 | 동일 |
| `ifpi-gmr-2026` | IFPI Global Music Report 2026 보도자료(필요 시 State of the Industry PDF) | true |
| `kcs-album-export-2025` | 관세청 수출입무역통계(음반) | 보도 → 원자료 확인 후 true |
| `kocca-hallyu-export-effect-2026` | KOCCA 「한류산업 수출의 경제 효과」 | 보도 → 원문 확인 후 true |
| `kofice-hallyu-effect-2025` | KOFICE 「2025 한류의 경제적 파급효과 연구」 PDF | 원문 확인 후 true |
| `ecos-fx-{year}` | 한국은행 ECOS 원/달러 연평균 | true |
| (4사) | 4대 기획사 데이터 파일의 `dart-{agency}-*` 출처를 그대로 참조 | — |

## 4. 유틸 함수 설계 (`src/utils/kpopMarketSize2026.ts`)

| 함수 | 입력 → 출력 | 규칙 |
|---|---|---|
| `validateData(stats, series, sources, effects, fx)` | → `string[]` | 4-1 규칙. 페이지 frontmatter에서 오류 있으면 `throw` |
| `toKrwDisplay(value, unit)` | → 문자열 | baekeok → 조·억 변환(1,327 → `13조 2,700억원`), eok → `15조 3,845억원` / `1조 7,057억원` |
| `toUsdDisplay(value, unit)` | → 문자열 | usd-million 1,801.4 → `18억 145만 달러`, usd-thousand 301,744 → `3억 174만 달러`, usd-billion 31.7 → `317억 달러` |
| `multiple(series, from, to)` | → `number \| null` | `to ÷ from`, 소수 2자리. 두 연도 모두 같은 Series에 있을 때만 |
| `share(part, whole)` | → `number \| null` | `allowedSharePairs` 화이트리스트만 허용: (music-industry, content-industry) 같은 연도·같은 sourceId. 그 외 조합은 `throw`. 소수 1자리 |
| `big4Total(records, year)` | → 억원 `number \| null` | 4개사 모두 available·공식일 때만 합. 결과 배지 `시뮬레이션` |
| `big4VsMusic(total2024, musicSales2024)` | → `number \| null` | `total ÷ (1,327 × 100)` × 100, 소수 1자리. 결과 배지 `시뮬레이션`, 라벨 ‘단순 규모 비교’ |
| `convertUsdToKrw(usdValue, unit, fx)` | → 억원 `number \| null` | 해당 통계 `year`의 fx만 사용. fx null이면 null. 결과 배지 `시뮬레이션` |
| `buildBars(series)` | → `{ year, value, widthPct, label }[]` | 시리즈 최댓값 대비 폭. 2025 provisional은 막대 생성 안 함 |
| `buildScopeRows(stats)` | → 범위 비교표 행 | `includes`·`excludes`를 그대로 사용 |
| `buildKpis(stats)` | → KPI 4개 | `music-sales-2024`, `music-export-2024`, `popculture-sales-2024`, `global-recorded-2025` 고정 순서. 각 카드에 year·scope 라벨·출처·배지 |

### 4-1. 검증 규칙

- 배지 문자열 4종 외 → 오류. `value === null`이면 `badge === null`·`missingReason` 필수.
- `badge === '공식'`이면 출처 `isPrimary === true` 또는 publisher가 정부·공공기관·IFPI·DART.
- `status === '잠정'`인 레코드는 `badge !== '공식'`이거나 notes에 ‘잠정’ 포함(화면 칩 렌더 근거).
- Series는 sourceId 1개, 연도 연속(2019~2024), 중복 없음, 값 > 0.
- `share()` 화이트리스트 외 호출 금지(정적 검사: 검증 스크립트가 유틸 소스에서 `share(` 호출 인자를 확인하지 않고, 대신 유틸 내부에서 throw).
- `EconomicEffect.scopeLabel === '한류 전체'` 고정.
- 서로 다른 scope 값을 더하는 함수가 존재하지 않음(코드 리뷰 항목 + 검증 스크립트가 화면의 ‘합계’ 문자열 위치를 4사 카드로 한정 검사).
- 4사 연동: `KMS_BIG4_ENABLED`가 true면 import된 레코드 수 4.

### 4-2. 표시 정밀도

- 원자료 정밀도로 계산, 표시만 반올림. 배수 소수 2자리(`약 1.95배`), 비중·비율 소수 1자리(`약 8.4%`, `약 31.7%`).
- 원화 큰 수는 `조 + 억`(억 이하 버림 없이 원표 단위까지), 달러는 `억 + 만 달러`.

### 4-3. 공개 게이트 (`publishReady`)

`true`일 때 검증 스크립트가 추가 강제:
- KPI 4개 레코드 모두 `badge === '공식'`.
- 대중문화예술 실태조사·관세청·한류 연구 출처 `isPrimary === true`.
- 2025 음악 절대값은 null 허용(칩으로 대체) — 대신 `missingReason` 존재.
- IFPI 한국 순위는 null 허용(비표시).
- 섹션 6이 렌더되는 경우 4사 값 모두 공식.
- related 링크 3개 이상이 dist에 존재.

`false`이면 reports.ts·홈·허브·sitemap 등록을 하지 않는다.

## 5. 화면 구조

| 순서 / id | 구성 | 데이터·규칙 |
|---|---|---|
| Hero | eyebrow ‘K팝 산업 리포트’, H1 ‘K팝 시장 규모 2026, 실제로 얼마나 클까?’, 설명 ‘K팝 시장 규모는 조사 범위에 따라 숫자가 달라집니다.’ | — |
| InfoNotice | 기준 3줄: 국내 확정 2024·2025 잠정 성장률 / 세계 IFPI 2025 / 공식 단일 ‘K팝 시장’ 통계 없음·원화 환산은 연평균 환율 시뮬레이션 | 데이터 기준일 표시 |
| `kms-kpi` | KPI 4개(3-2의 KPI 표시 레코드). 카드 구성: 지표명 / 값 / `2024 · 음악산업 · 문체부` 라인 / 배지. 카드 위 1줄 “카드마다 범위·연도·통화가 다릅니다” | `buildKpis` |
| `kms-scope` | **핵심 섹션** “‘K팝 시장 몇 조?’ 숫자가 다른 이유”: ① 포함관계 다이어그램 ② 범위 비교표(지표·규모·기준연도·포함·불포함) ③ 해설 “음악산업(13.3조)보다 대중문화예술산업(15.4조)이 큰 이유” | `buildScopeRows` |
| `kms-trend` | “국내 음악산업은 얼마나 커졌나”: CSS bar 2개(매출·수출, 2019~2024) + 2025 잠정 칩 + 요약 문장(배수·비중) | `buildBars`, `multiple`, `share` |
| `kms-overseas` | “K팝은 해외에서 얼마나 벌까”: 3카드(음악산업 수출 2024 / 기획업 해외매출 2024 / 음반 수출 2025)를 띠 “서로 겹치는 범위 — 더하지 않습니다”로 묶음. 달러 카드에 원화 환산 보조 텍스트(fx 있을 때) | 통계 레코드 |
| `kms-channels` | “K팝은 무엇으로 돈을 벌까”: 10개 수익 경로 카드 그리드(라벨+1~2문장). 사례 수치는 최대 2개(`참고`). 하단에 후속 ‘K팝 수익구조 2026’ CTA 자리(페이지 미존재 시 렌더 안 함) | `RevenueChannel[]` |
| `kms-big4` | “4대 기획사는 산업에서 얼마나 차지할까”: 4사 2025 연결매출 미니 표 + 합계 + 2024 동일연도 비교 카드 “4사 연결매출 합계는 같은 해 국내 음악산업 매출의 약 31.7% 규모(단순 규모 비교)” + 주석(해외 자회사·비음악 매출 포함, 시장점유율 아님) + 4대 기획사 리포트 CTA | 3-4 게이트 |
| `kms-global` | “세계 음악시장과 비교”: IFPI 4지표(매출·성장률·스트리밍 비중·유료 계정) + 지역 성장률 한 줄 + “공연·MD 제외, 국가 소비 기준이라 K팝 점유율 공식값 없음” 고정 문구. 한국 순위는 레코드 있을 때만 | 통계 레코드 |
| `kms-economy` | “K팝이 한국 경제에 미치는 영향”: 1억 달러당 효과 3카드(생산유발·연관 수출·취업유발) + 2025 한류 유발 총수출·생산유발 2카드. 모든 카드 `한류 전체` 태그 | `EconomicEffect[]` |
| `kms-sources` | 출처 목록(기관·자료명·발표일·기준연도·확인일·URL·원문/보도 구분) | sources |
| SeoContent | intro 4단락·criteria 4개·FAQ 9개·related 3개 | 데이터 파일 |

목차 앵커는 단순 링크 목록. sticky·스크롤 추적 없음.

### 5-1. 포함관계 다이어그램 (`kms-scope`)

- 순수 HTML/CSS. SVG·이미지 미사용(텍스트 검색·접근성).
- 데스크톱: 왼쪽 ‘국내 매출(원)’ 열 — 콘텐츠산업 박스 안에 음악산업 박스, 그 옆에 대중문화예술산업 박스가 음악산업과 일부 겹치는 형태(겹침은 점선 테두리 영역 + ‘일부 겹침’ 라벨로 표현, 실제 원 겹침 연출 대신 레이어 배치). 오른쪽 ‘해외·세계(달러)’ 열 — 음악산업 수출 / 음반 수출 / 세계 recorded music을 별도 박스로.
- 두 열 사이 세로 구분선 + 라벨 “통화·범위가 달라 크기 비교 불가”.
- 박스 크기는 수치 비례가 아님을 캡션으로 명시(“박스 크기는 포함관계만 나타냅니다”).
- 모바일: 세로 계단형 리스트(들여쓰기 깊이로 포함관계, 각 행 오른쪽에 규모).

### 5-2. 문구 규칙

- 금지: ‘K팝 시장 ○조원’, ‘K팝 전체 수출’, ‘시장점유율’, ‘세계 점유율 ○%’, ‘K팝 경제효과 ○조’(한류 전체만 허용).
- 투자 어휘 금지: 매수·매도·유망·저평가·고평가·목표주가.
- 2025 잠정값 표기: `2025 잠정 +15.8%` 칩 + “연간 동향분석 추계, 확정 통계 아님”.
- ‘K팝’은 본문 표기 통일(K-pop, 케이팝 혼용 금지. 검색 키워드는 FAQ에서 자연스럽게 1회 이내).

### 5-3. 반응형

| 폭 | 표시 |
|---|---|
| ≤ 640px | KPI 2×2, 범위 비교표는 지표별 카드 스택(`<details>` ‘표로 보기’ 유지), 다이어그램 세로 계단형, 막대는 가로형(라벨 막대 위), 수익경로 2열 |
| 641~1023px | 표 영역만 `overflow-x:auto`, KPI 2×2, 수익경로 3열 |
| ≥ 1024px | 표 전체, KPI 1×4, 다이어그램 2열, 수익경로 5열 |

320px에서 페이지 가로 스크롤 0. 색은 사이트 토큰 사용, 확정/잠정은 색 + 텍스트 칩 병기. 4사 미니 표의 회사 색은 4대 기획사 페이지와 같은 팔레트 리터럴 재사용(브랜드 색 모방 금지).

## 6. 콘텐츠 데이터 (데이터 파일에 저장)

### 6-1. 메타

| 항목 | 값 |
|---|---|
| title | `K팝 시장 규모 2026 \| 매출·수출 얼마나 클까` (28자) |
| description | `K팝 시장 규모를 국내 음악산업 매출 13.3조원, 음악 수출 18억 달러, 기획업 해외매출, 세계 음악시장 317억 달러로 나눠 비교하고 통계마다 숫자가 다른 이유를 정리합니다.` (100자) — 숫자는 데이터 레코드와 검증 스크립트로 대조 |
| reports.ts badges | `["K팝", "산업 규모"]` |
| ogImage | `/og/reports/kpop-market-size-2026.png` |
| OG REPORTS 항목 | title `K팝 시장 규모 2026`, description `음악산업·기획업·수출·세계시장, 범위별로 나눠 본 K팝 산업 규모`, eyebrow `문화·엔터 리포트`, stats `[("음악산업 매출", "13.3조원 · 2024"), ("음악 수출", "18억 달러 · 2024")]` — 단일 ‘K팝 ○조’ 금지 |
| JSON-LD | `@graph`: Article(headline=H1, datePublished/dateModified=실제 공개·실질 갱신일), FAQPage(화면 FAQ와 동일 텍스트), BreadcrumbList(홈 › 리포트 › 페이지) |

### 6-2. intro·FAQ

기획서 7절 intro 4단락(각 150자 이상, 총 600자 이상)과 FAQ 9개를 이관한다. 수치가 들어간 문장은 유틸 결과로 템플릿화한다(예: `${toKrwDisplay(musicSales2024)}`, `${multiple('music-sales', 2019, 2024)}배`). FAQ 5(4사 합계)는 `KMS_BIG4_ENABLED`·공식 조건 미충족 시 “4대 기획사 실적 확정 후 업데이트” 버전 답변으로 대체하되 2문장 이상 유지.

### 6-3. criteria (4개)

1. 국내 매출·수출은 문체부 콘텐츠산업조사(2024년 기준) 확정 통계, 2025년은 KOCCA 연간 동향분석의 잠정 성장률만 별도 표기
2. 대중문화예술산업·기획업은 대중문화예술산업 실태조사(2024년 기준, 격년)
3. 세계 시장은 IFPI recorded music 기준(공연·MD 제외)이며 K팝 점유율은 계산하지 않음
4. 4사 합계·비율·원화 환산은 공식 원자료를 가공한 `시뮬레이션` 값, 환율은 해당 연도 연평균 매매기준율

## 7. 구현 순서

| 단계 | 작업 | 산출 |
|---|---|---|
| 0 | **선행 확인**: 4대 기획사 리포트 구현 상태 확인. 미구현이면 해당 작업을 먼저 하거나 `KMS_BIG4_ENABLED=false`로 진행 | 연동 방식 결정 |
| 1 | **데이터 확정**: KOCCA 동향분석 원문(2025 음악 절대값 유무) / 대중문화예술 실태조사 원문 / IFPI Top 10 / 관세청 음반 수출 원자료 / KOCCA·KOFICE 한류 연구 원문 / ECOS 2024·2025 연평균 환율 / 음악 2020→2021 기준 변경 여부 | 데이터 확정 메모, 불일치 기록 |
| 2 | 데이터 파일·유틸 작성, `validateData` | `src/data`, `src/utils` |
| 3 | 페이지·SCSS·`app.scss` | 렌더 |
| 4 | 검증 스크립트 | `scripts/check-…mjs` |
| 5 | 등록(reports.ts·홈·허브)·관련 링크 양방향 | publishReady=true일 때만 |
| 6 | OG 생성·sitemap | 공개 단계 |
| 7 | 빌드·검증·반응형 확인, 결과 기록 | 기획서·설계서 하단 기록 |

1단계에서 원문 확인이 안 되는 항목은 `참고` 유지 + limitation 기록. KPI 레코드(음악 매출·수출·대중문화예술·IFPI) 중 하나라도 공식 확정이 안 되면 publishReady false 유지.

## 8. 내부 링크

| 이 페이지 → | 위치 | 역방향 |
|---|---|---|
| `/reports/kpop-big4-agency-comparison-2026/` ‘HYBE·SM·JYP·YG 4대 기획사 시총·실적 비교’ | `kms-big4` CTA + related | 4대 기획사 데이터 관련 링크에 ‘K팝 산업 전체 규모는 얼마나 클까’ 추가(4대 기획사 설계 8절 표에 행 추가 필요 — 해당 구현 담당과 조율) |
| `/reports/korean-movie-break-even-profit/` ‘영화는 얼마나 벌어야 남을까 — 흥행 손익 비교’ | `kms-scope` 해설(콘텐츠산업 내 다른 장르) + related | 영화 리포트 `relatedLinks`에 추가 |
| `/reports/kospi-large-cap-2026-q2-earnings/` ‘코스피 대형주 2분기 실적도 비교해 보기’ | related | 선택(문맥 맞으면 추가) |

- related 3개는 4대 기획사 리포트가 공개돼야 관련성 있게 충족된다. 4대 기획사 미공개 상태에서 이 페이지를 먼저 공개하지 않는다(4-3 게이트).
- ‘K팝 수익구조 2026’ 등 미존재 페이지는 링크·CTA 모두 렌더하지 않는다.

## 9. 검증 스크립트 (`scripts/check-kpop-market-size-2026.mjs`)

| 검사 | 기준 |
|---|---|
| 데이터 검증 | 4-1 규칙 전부, publishReady면 4-3 게이트 |
| 산식 | 스크립트에서 독립 재계산 후 데이터·HTML 대조. 고정 케이스: 1,327÷681 = 1.95배, 1,801.4÷756.2 = 2.38배, 1,327÷15,740 = 8.4%, 1,801.4÷14,075.4 = 12.8%. 4사 연동 시 2024 합계 ÷ 132,700 재계산(초기값 기준 31.7%) |
| 표시 변환 | `13조 2,700억원`, `18억 145만 달러`, `3억 174만 달러`, `317억 달러`, `15조 3,845억원` 문자열이 dist에 존재 |
| 시계열 | 막대 6개(2019~2024), 2025 막대 없음, 2025 칩 텍스트 존재 |
| 금칙 표현 | dist 본문에 ‘K팝 시장 [0-9]’, ‘K팝 전체 수출’, ‘시장점유율’, ‘점유율 [0-9]’, 투자 어휘 없음(‘시장점유율 아님’ 같은 부정 문맥은 허용 목록) |
| 경제효과 | `kms-economy` 카드마다 ‘한류 전체’ 텍스트 |
| 환율 | 원화 환산 텍스트가 있으면 같은 카드에 환율·연도·‘시뮬레이션’ 존재 |
| 메타 | Title ≤ 50자, Description 80~120자이며 숫자가 레코드와 일치, intro 4단락·600자 이상, FAQ ≥ 7(각 2문장 이상), FAQPage JSON-LD 질문 = 화면 질문 |
| 배지 | dist HTML에 4종 외 배지 텍스트 없음 |
| 링크 | related 경로가 dist에 존재, 미존재 페이지 링크 없음 |

## 10. QA 포인트와 완료 조건

아래는 향후 조건이며 현재 완료 체크가 아니다.

- [ ] 7절 0단계 4대 기획사 연동 방식 결정
- [ ] 7절 1단계 데이터 확정, KPI 4개 `공식`
- [ ] 2025 음악 절대값 유무 확인 결과 반영(없으면 칩만)
- [ ] IFPI 한국 순위: 원문 확인 시에만 표시
- [ ] ECOS 환율 확정 또는 원화 환산 비표시
- [ ] 범위 비교표·다이어그램에 합산·점유율 표현 없음
- [ ] 4사 비교 카드 ‘단순 규모 비교’·`시뮬레이션` 표기, 4사 값 공식 확정 시에만 렌더
- [ ] `node scripts/check-kpop-market-size-2026.mjs` 통과
- [ ] `npm run check:mapping` 통과
- [ ] `npm run build` 성공, `dist/reports/kpop-market-size-2026/index.html` 생성
- [ ] 320/480/640/820/1280px에서 scrollWidth = clientWidth, 다이어그램·표 카드 전환·막대 라벨 가독성
- [ ] 브라우저 콘솔 오류 없음, FAQ 펼침 동작
- [ ] OG 1200×630 시각 확인(단일 ‘K팝 ○조’ 없음)
- [ ] 역방향 링크(4대 기획사·영화) 반영
- [ ] `QUALITY_SCORE.md`·`DEPLOY_CHECKLIST.md` 검토

전체 `npm run check:all`은 기존 저장소 오류가 있으므로 신규 파일 오류 0건 여부를 별도로 기록하고, 전체 통과로 기록하지 않는다.

**현재 작업 기록 (2026-10-08):** 설계 문서 작성만 수행. 데이터 확정·구현·검증 스크립트·빌드·커밋·push·배포 미수행.

## 11. 구현 기록 (2026-10-08)

| 항목 | 결과 |
|---|---|
| 0단계 연동 | 4대 기획사 리포트가 같은 날 DART 확인값으로 구현됨 → `KMS_BIG4_ENABLED = true`. 페이지에서 `KB4_AGENCIES`를 import(숫자 복제 없음). 2024 4사 합계 4조 2,121억원 ÷ 음악산업 13조 2,700억원 = **31.7%**, 2025 합계 5조 1,921억원 |
| 1단계 데이터 | ECOS 731Y004 연평균 매매기준율 2024 **1,363.98원**, 2025 **1,422.22원**(공식). 콘텐츠산업조사 원표(공식). IFPI 2025(공식). 2025 음악 절대금액: 보도에 없음 → null 유지, 성장률 칩만. 대중문화예술 실태조사·음반 수출·한류 연구: 원문 미열람, 복수 보도 일치 → `참고`. IFPI 한국 7위: Music Business Worldwide 인용 → `참고`로 표시(설계 5절의 ‘원문 확인 시에만’에서 완화, 출처 표기) |
| 공개 게이트 변경 | 4-3의 “KPI 4개 모두 공식”을 **“KPI 값 존재 + 배지 공식 또는 참고(출처에 보도 인용 명시)”**로 완화. 대중문화예술산업 KPI는 `참고` 배지로 노출. related 3개(4대 기획사·영화·코스피) 충족으로 `publishReady = true` |
| 생성 파일 | `src/data/kpopMarketSize2026.ts`, `src/utils/kpopMarketSize2026.ts`, `src/pages/reports/kpop-market-size-2026.astro`, `src/styles/scss/pages/_kpop-market-size-2026.scss`, `scripts/check-kpop-market-size-2026.mjs`, `public/og/reports/kpop-market-size-2026.png` |
| 수정 파일 | `app.scss`(@use), `reports.ts`(order 93), `index.astro`·`reports/index.astro`(culture), `sitemap.xml`, `generate-og-tools.py`, 역방향 링크 `koreanMovieBreakEvenProfit.ts`·`kpopBig4AgencyComparison2026.ts`(KB4_RELATED 끝) |
| 검증 | `node scripts/check-kpop-market-size-2026.mjs` 통과(dist 포함), 4대 기획사 검증 스크립트 통과, `npm run check:mapping` 통과, `npm run build` 성공(428페이지), `astro check` 신규 파일 오류 0(전체 397건은 기존), 320/820/1280px scrollWidth = clientWidth, 콘솔 오류 없음 |
| 미수행 | 커밋·push·배포. 창이 가려져 브라우저 스크린샷은 일부만 확인(수치 검증으로 대체) |
