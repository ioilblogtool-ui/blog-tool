# HYBE·SM·JYP·YG 4대 기획사 비교 2026 리포트 — 설계 문서

> 기획 원문: [kpop-big4-agency-comparison-2026.md](../../plan/202610/kpop-big4-agency-comparison-2026.md)
> 작성일: 2026-10-08
> 문서 상태: **설계 문서 작성 완료 / 데이터 확정·구현·빌드·화면 검증·배포 미착수**
> 수치 기준: 기획서에서 2026-10-08 조사한 외부 집계·보도 값. 이번 작업은 구현 설계이며 수치를 추가 조사하지 않았다. 구현 1단계에서 DART·KRX·공식 아티스트 페이지로 확정한다.

## 1. 문서 개요와 구현 결정

| 항목 | 결정 |
|---|---|
| slug / URL | `kpop-big4-agency-comparison-2026` / `/reports/kpop-big4-agency-comparison-2026/` |
| 유형 / 카테고리 | report / `culture` (기존 값. 신규 카테고리 없음) |
| 레이아웃 | `BaseLayout.astro` 직접 사용 + `SiteHeader`·`CalculatorHero`·`InfoNotice`·`SeoContent`. 입력 폼이 없어 ToolShell 미사용 |
| 코드·스타일 prefix | 상수 `KB4_` / CSS `kb4-` |
| 비교 기준 | 연간: 2025 회계연도 연결 / 최신 분기: 2026 2Q 연결 / 시총: 단일 영업일 종가 / 직원 수: 2025 사업보고서 별도 |
| 사용자 입력 | 없음. 기간 토글도 두지 않고 연간 표와 분기 표를 정적으로 모두 렌더 |
| 차트 | 정적 CSS bar 3종. Chart.js·클라이언트 JS 없음 (`REPORT_CONTENT_GUIDE`의 CSS bar 우선 원칙) |
| 순위·KPI | 빌드 시 유틸 함수가 데이터에서 산출. 문구 하드코딩 금지 |
| 데이터 배지 | 공식 / 참고 / 시뮬레이션 / 추정만 |
| 광고 | 기존 리포트와 동일한 BaseLayout 기본값. 증권·투자 제휴 블록 없음 |

### 코드 확인으로 정리한 사항

- `BaseLayout` Props: `title`, `description?`, `ogImage?`, `jsonLd?`, `recordSessions?`, `loadAds?`. canonical·OG는 레이아웃이 생성하므로 페이지는 전달하지 않는다. Title 접미사는 자동으로 붙지 않는다.
- `SeoContent` Props: `introTitle`, `intro`, `inputPoints?`, `criteria?`, `faq?`(`{ question, answer }`), `related?`, 그리고 리포트용 선택 문구 `introSummary`·`criteriaTitle`·`criteriaLinkLabel`·`relatedTitle` 등이 이미 추가돼 있다(2027 출산 리포트 작업). 컴포넌트 수정은 필요 없다.
- `SeoContent` 고정 id(`overview`, `highlights`, `criteria`, `faq`, `related`)는 본문 섹션 id로 재사용하지 않는다.
- 기존 실적 리포트(`kospi-large-cap-2026-q2-earnings.astro`)는 데이터 파일 상수 import + 페이지 내 정렬·색상 매핑 패턴이다. 이번에는 순위·검증 로직이 많아 `src/utils/`로 순수 함수를 분리한다(현재 `src/utils/base.ts`만 존재 — 새 파일 추가는 기존 구조와 충돌하지 않음).
- 리포트 허브 태그 modifier는 `rc-tag--salary`, `rc-tag--asset` 등 기존 클래스만 사용한다. 영화 리포트(`culture`)가 `salary` mod를 쓰므로 동일하게 맞춘다. 새 mod 추가 안 함.
- 검증 스크립트는 `scripts/check-<slug>.mjs` 패턴(예: `check-childbirth-benefits-changes-2027.mjs`)을 따른다. `npm run check:mapping`은 카테고리 매핑을 검사한다.
- OG는 `scripts/generate-og-tools.py`의 `REPORTS` 배열에 항목 추가, 출력 `public/og/reports/<slug>.png`.

## 2. 파일 구조와 책임

아래는 향후 생성·수정 대상이며 현재 생성된 파일이 아니다.

| 파일 | 작업 | 책임 |
|---|---|---|
| `src/data/kpopBig4AgencyComparison2026.ts` | 신규 | 타입·출처·회사 레코드·패노메논 사실 표·메타·intro·FAQ·관련 링크·갱신 기록 |
| `src/utils/kpopBig4AgencyComparison2026.ts` | 신규 | 검증·파생지표 계산·순위·표시 포맷·화면 모델 생성(순수 함수) |
| `src/pages/reports/kpop-big4-agency-comparison-2026.astro` | 신규 | 빌드 시 검증 호출, 렌더링, Article+FAQPage+BreadcrumbList JSON-LD |
| `src/styles/scss/pages/_kpop-big4-agency-comparison-2026.scss` | 신규 | `kb4-` prefix 스타일 |
| `src/styles/app.scss` | 수정 | `@use` 1줄 |
| `scripts/check-kpop-big4-agency-comparison-2026.mjs` | 신규 | 데이터·dist HTML 검증 |
| `src/data/reports.ts` | 수정 | slug·title·description·order·badges |
| `src/pages/index.astro` | 수정 | `reportMetaBySlug`에 `{ category: "culture", isNew: true }` |
| `src/pages/reports/index.astro` | 수정 | eyebrow `엔터 기업 비교`, tags `기획사`·`시총`·`실적`(mod `salary`), category `culture`, isNew |
| `public/sitemap.xml` | 수정 | 공개 시 URL·lastmod |
| `scripts/generate-og-tools.py` / `public/og/reports/kpop-big4-agency-comparison-2026.png` | 수정 / 생성 | 1200×630 OG |
| 관련 리포트 3개 데이터·페이지 | 수정 | 역방향 링크(8절) |

`public/scripts/*.js`는 만들지 않는다.

## 3. 데이터 파일 설계

### 3-1. 타입

```ts
export type AgencyId = 'hybe' | 'sm' | 'jyp' | 'yg';
export type Badge = '공식' | '참고' | '시뮬레이션' | '추정';

export type Source = {
  id: string;
  publisher: string;        // 금융감독원 DART, 한국거래소, 회사명, 언론사
  title: string;            // 자료명 (예: '하이브 2025 사업보고서')
  url: string;
  publishedAt: string | null;
  checkedAt: string;        // 실제 확인일 YYYY-MM-DD
  locator: string;          // '연결 포괄손익계산서', 'II. 사업의 내용 > 매출', 'p.12' 등
  limitation: string | null;
};

export type Metric =
  | { status: 'available'; value: number; badge: Badge; sourceId: string; note?: string }
  | { status: 'missing'; value: null; badge: null; sourceId: null; reason: string };

export type AnnualFinancials = {
  fiscalYear: 2025;
  basis: 'consolidated';
  unit: 'eok';              // 억원 정수(원 자료 백만원 ÷ 100, 반올림 규칙 3-3)
  revenue: Metric;
  operatingIncome: Metric;
  netIncome: Metric;        // 지배주주 귀속 여부는 note에 명시
  totalAssets: Metric;
  prevRevenue: Metric;      // 2024, 성장률 계산 전용
  prevOperatingIncome: Metric;
  nonOperatingNote: string | null; // SM 지분법 이익 등
};

export type QuarterFinancials = {
  label: '2026 2Q';
  periodEnd: '2026-06-30';
  basis: 'consolidated';
  releaseStatus: 'preliminary' | 'reported';
  unit: 'eok';
  revenue: Metric;
  operatingIncome: Metric;
  prevYearRevenue: Metric;          // 2025 2Q
  prevYearOperatingIncome: Metric;
};

export type MarketSnapshot = {
  asOf: string;                     // 단일 영업일, 종가
  priceType: 'close';
  closePriceWon: Metric;
  sharesOutstanding: Metric;        // 보통주 상장주식수
  marketCapSource: 'computed' | 'quoted';
};

export type ArtistEntry = {
  name: string;                     // 공식 표기
  label: string;                    // HYBE는 레이블명, 그 외 회사명 또는 자회사명
  relation: '본사' | '레이블 자회사' | '자회사';
  contractScope: '그룹' | '개인' | '그룹+개인' | '확인 필요';
  sourceId: string;                 // 공식 아티스트 페이지
  verifiedAt: string;
};

export type Segment = {
  originalName: string;             // 사업보고서 원 분류명
  commonKey: 'album' | 'concert' | 'md' | 'platform' | 'ads' | 'other';
  revenue: Metric;
};

export type EvidenceText = { text: string; badge: Badge; sourceIds: string[] };

export type AgencyRecord = {
  id: AgencyId;
  nameKo: string;                   // 하이브 / SM엔터테인먼트 / JYP엔터테인먼트 / YG엔터테인먼트
  shortName: string;                // HYBE / SM / JYP / YG
  listedName: string;
  market: 'KOSPI' | 'KOSDAQ';
  ticker: string;
  structure: 'multi-label' | 'hq-with-subsidiaries';
  annual: AnnualFinancials;
  latestQuarter: QuarterFinancials;
  employees: Metric & { basis?: 'separate' };
  segments: Segment[];
  keyIp: ArtistEntry[];             // 3~5팀
  strengths: EvidenceText[];        // 2~3개
  risks: EvidenceText[];            // 2~3개
};
```

### 3-2. 패노메논 사실 표

```ts
export type FanomenonFactKind = '확인된 사실' | '제기된 문제' | '당사자 설명' | '정부 설명' | '미확인';
export type FanomenonFact = {
  id: string;
  topic: 'role' | 'audit' | 'schedule' | 'venue' | 'format' | 'entity' | 'trademark' | 'opportunityCost' | 'government' | 'revenueModel' | 'economicEffect' | 'smallAgencies' | 'lineup';
  kind: FanomenonFactKind;
  text: string;
  badge: Badge | null;              // 경제효과 전망 = '추정', 보도 확인 = '참고', 국회·정부 원문 = '공식'
  sourceIds: string[];
  date: string | null;
};
```

`kind`는 배지가 아니라 표 열 값이다. ‘제기된 문제’와 ‘당사자 설명’은 같은 topic에 각각 별도 레코드로 둔다. 미확인 항목(법인명·자본금·라인업·중소기획사 참여 방식·수익 배분·상표 귀속 변경)은 `kind: '미확인'`, `badge: null`로 저장한다.

### 3-3. 초기 데이터 값 (기획서 조사값 — 구현 1단계에서 교체)

단위 억원. 모든 값 현재 `참고`. DART 대조 후 일치하면 `공식`으로, 불일치하면 DART 값으로 바꾸고 이전 값을 갱신 기록에 남긴다.

| id | 매출 | 영업이익 | 순이익 | 총자산 | 2024 매출 | 2024 영업이익 | 2Q26 매출 | 2Q26 영업이익 | 2Q25 영업이익 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| hybe | 26,499 | 459 → DART 확인(보도 499) | -2,373 | 54,855 | 22,556 | 1,841 | 14,500 | 1,678 → 확인(보도 1,709) | 623 |
| sm | 11,749 | 1,813 | 3,472 | 20,077 | 9,897 | 848 | 3,496 | 476 | 476 |
| jyp | 8,219 | 1,552 | 1,606 | 8,511 | 6,018 | 1,282 | 1,831 | 310 | 529 |
| yg | 5,454 | 529 | 369 | 8,388 | 3,649 | -208 | 1,278 | 98 → 확인(보도 110) | 73 |

반올림: 백만원 값을 100으로 나눠 사사오입, 정수 억원으로 저장. 표시는 1조 이상 `2조 6,499억원`, 미만 `1,813억원`. 계산은 저장된 억원 정수로만 한다.

직원 수(참고값 HYBE 874 / SM 714 / JYP 441 / YG 366)는 기준 불명확이라 **초기 데이터에 넣지 않고** `status: 'missing'`, `reason: '사업보고서 직원 현황 확인 전'`으로 시작한다. 시가총액·주가도 같은 이유로 `missing`에서 시작해 KRX 일괄 수집 후 채운다(기획서의 시각 혼재 값 사용 금지).

### 3-4. 출처 ID 계획

| id | 자료 |
|---|---|
| `dart-{agency}-2025-ar` | 2025 사업보고서(연결 손익·재무상태·직원 현황·매출 구분) ×4 |
| `dart-{agency}-2026-h1` | 2026 반기보고서 ×4 (2Q 단독 = 반기 − 1Q 아님, 손익계산서의 3개월 열 사용) |
| `krx-close-{asOf}` | KRX 정보데이터시스템 개별종목 시세(종가·상장주식수) |
| `artist-{agency}` | 공식 아티스트 페이지 ×4 |
| `news-*` | 기획서 3-1의 국감·행사 보도(파이낸셜뉴스·디지털데일리·아시아경제·머니투데이·YTN·더팩트·연합뉴스) |
| `kcti-2026-07` | 한국문화관광연구원 경제효과 전망(보도 인용) |
| `na-minutes-2026-10-07` | 국회 문체위 국감 회의록(공개 시 추가, 보도보다 우선) |

## 4. 유틸 함수 설계 (`src/utils/kpopBig4AgencyComparison2026.ts`)

| 함수 | 입력 → 출력 | 규칙 |
|---|---|---|
| `validateData(records, sources, facts)` | → `string[]` 오류 목록 | 아래 4-1 규칙. 페이지 frontmatter에서 오류가 있으면 `throw`로 빌드 실패 |
| `operatingMargin(m)` | 매출·영업이익 → `number \| null` | `OI / Rev × 100`, 소수 1자리. 둘 중 missing이면 null. 매출 ≤ 0이면 null |
| `growth(curr, prev)` | → `{ kind: 'pct'; value } \| { kind: '흑자전환' \| '적자전환' \| '적자지속' } \| null` | prev > 0: `(curr−prev)/prev×100` 소수 1자리. prev ≤ 0 & curr > 0: 흑자전환. prev > 0 & curr ≤ 0: 적자전환. 둘 다 ≤ 0: 적자지속 |
| `marketCap(snapshot)` | → 억원 `number \| null` | `close × shares / 1e8`, 정수 반올림. `marketCapSource: 'computed'`면 배지 `시뮬레이션` |
| `capToSales(cap, revenue)` | → `number \| null` | 소수 2자리 |
| `per(cap, netIncome)` | → `number \| 'N/A' \| null` | 순이익 ≤ 0이면 `'N/A'`(적자), 소수 1자리. Forward PER 미사용 |
| `rankBy(records, key)` | → `{ id, value, rank }[] \| null` | 4개사 모두 available일 때만 순위. 하나라도 missing이면 null(‘집계 중’ 표시). 동률은 같은 순위 |
| `buildKpis(records, snapshotDate)` | → KPI 4개 | 시총·매출·영업이익·영업이익률 1위. 시총은 4개 스냅샷의 `asOf`가 모두 같을 때만 |
| `buildBars(records, key)` | → `{ id, value, widthPct, label }[]` | 최댓값 대비 비율. 음수는 0% 폭 + 값 라벨로 ‘적자’ 표시 |
| `formatEok(n)` | 억원 → 문자열 | 3-3 표시 규칙, 음수는 `-2,373억원` |

### 4-1. 검증 규칙

- 회사 id 4개 정확히 존재, 중복 없음.
- 모든 available `Metric.sourceId`가 sources에 존재.
- `annual.fiscalYear === 2025`, `basis === 'consolidated'`; 분기 `label === '2026 2Q'`.
- 매출·총자산 > 0, 정수. 영업이익·순이익은 음수 허용.
- `badge === '공식'`이면 출처 publisher가 DART·KRX·회사·국회·정부 중 하나.
- 4개 `MarketSnapshot.asOf`가 서로 다르면 오류(값이 모두 missing이면 통과).
- `keyIp` 각 항목에 `verifiedAt`·`sourceId` 필수. HYBE 항목은 `relation === '레이블 자회사'`이면 `label !== 'HYBE'`.
- `FanomenonFact`에서 `kind === '미확인'`이면 `badge === null`; `topic === 'economicEffect'`이면 `badge === '추정'`.
- 배지 문자열이 4종 외면 오류.

missing 값 자체는 오류가 아니다(렌더는 ‘재확인 필요’). 단 4-2의 공개 게이트에서 차단한다.

### 4-2. 공개 게이트

`REPORT_META.publishReady`(boolean)를 두고, 검증 스크립트가 `true`일 때 다음을 추가로 강제한다: 연간 매출·영업이익·순이익·총자산 모두 `공식`, 2Q 매출·영업이익 `공식`, 시총 4개 available·동일 `asOf`, 직원 수 4개 available, `keyIp` 회사당 3개 이상. `false` 상태에서는 sitemap·reports.ts 등록을 하지 않는다.

## 5. 화면 구조

| 순서 / id | 구성 | 데이터·규칙 |
|---|---|---|
| Hero | eyebrow ‘4대 기획사 비교 리포트’, H1 ‘HYBE·SM·JYP·YG, 4대 기획사는 실제로 얼마나 다를까?’, 설명 1줄 | — |
| InfoNotice | 기준 3줄: 실적 2025 연결·2026 2Q 연결 / 시총 `{asOf}` 종가 / 공개자료 비교이며 투자 권유 아님 | asOf는 데이터에서 |
| `kb4-fanomenon` | 타임라인 카드 4개(2026-07-27 행사 발표 → 2026-10-07 국감 → 4개사 동일 지분 전담 법인 → 2027년 12월 개최 예정) + ‘왜 이 네 회사를 비교하나’ 2문장 | facts의 `확인된 사실`만 |
| `kb4-kpi` | KPI 카드 4개: 시총 1위·매출 1위·영업이익 1위·영업이익률 1위. 카드마다 회사명·값·기준 | `buildKpis`. null이면 ‘집계 중’ |
| `kb4-insight` | 한 줄 강조: ‘매출 1위와 영업이익 1위는 다른 회사’ — `rankBy(revenue)[0].id !== rankBy(operatingIncome)[0].id`일 때만 렌더 | 조건부 문구 |
| `kb4-table` | 전체 비교표: 시총·매출·영업이익·영업이익률·순이익·총자산·직원 수·대표 IP. 셀마다 배지 | 모바일은 회사별 카드 |
| `kb4-chart-scale` | CSS bar ① 매출 vs 영업이익 묶음(회사별 2막대) ② 시가총액 | `buildBars` |
| `kb4-quarter` | 2026 2Q 표(매출·영업이익·영업이익률·영업이익 YoY) + 계절성 안내 문구 | 연간 표와 별도. 이 표로 KPI 만들지 않음 |
| `kb4-chart-margin` | CSS bar ③ 영업이익률 2025 vs 2026 2Q | 같은 회사 2막대 |
| `kb4-companies` | 회사 카드 4개: 규모 요약 / 구조 / 대표 IP(레이블 표기) / 최근 실적 / 강점 / 리스크 | 강점·리스크마다 출처 링크 |
| `kb4-valuation` | 시총/매출·PER 표 + ‘시총이 매출에 비례하지 않는 이유’ 설명 3문장 | HYBE PER ‘적자(N/A)’ |
| `kb4-business` | 100% 누적 가로 막대(회사별 매출 구성) + 원 분류명 툴팁 대신 범례 표 | `segments`, 공통 key 매핑 주석 |
| `kb4-fanomenon-detail` | ‘다시 패노메논’: 2열 표 확인된 것 / 아직 확인되지 않은 것, 이어 상표권 3분리 표(제기된 문제 / 당사자 설명 / 확인된 사실) | facts |
| `kb4-sources` | 출처 목록(기관·자료명·발표일·기준기간·확인일·URL) | sources |
| SeoContent | intro 4단락·criteria 4개·FAQ 10개·related 3개 | 데이터 파일 |

목차 앵커는 단순 링크 목록. sticky·스크롤 추적 없음.

### 5-1. 문구 규칙

- ‘소속’ 대신 HYBE는 ‘{레이블} (HYBE 레이블)’, 그 외 ‘계약 아티스트’. `contractScope`가 ‘개인’이면 ‘개인 활동 계약’ 병기.
- 강점·리스크·평가 문장에 ‘저평가’, ‘매수’, ‘유망’ 등 투자 판단 어휘 금지(검증 스크립트 금칙어 검사).
- 박진영 기회비용 발언(2~3배, 수백억원)은 `당사자 설명` 행에서만 인용부호 없이 요약, 사실처럼 수치 카드화하지 않음.
- 개최 기간은 ‘2027년 12월’까지만. 세부 일정은 공식 발표 확인 시 추가.
- 국감의 다른 쟁점(영화 관련 공방)은 다루지 않는다.

### 5-2. 반응형

| 폭 | 표시 |
|---|---|
| ≤ 640px | `kb4-table`·`kb4-quarter`는 회사별 카드 세로 스택(표는 `display:none`이 아니라 `<details>` 안 ‘표로 보기’로 유지). KPI 2×2. 막대는 가로형, 라벨 막대 위 |
| 641~1023px | 표 영역만 가로 스크롤(`overflow-x:auto`), KPI 2×2 |
| ≥ 1024px | 표 전체, KPI 1×4 |

320px에서 페이지 가로 스크롤 0. 회사 색은 사이트 팔레트 리터럴 4색(브랜드 색 모방 금지) + 회사명 텍스트 라벨로 색에만 의존하지 않음. 적자 값은 색 + ‘적자’ 텍스트.

## 6. 콘텐츠 데이터 (데이터 파일에 저장)

### 6-1. 메타

| 항목 | 값 |
|---|---|
| title | `4대 기획사 비교 2026 \| HYBE·SM·JYP·YG 시총·실적` (37자) |
| description | `박진영 패노메논 이슈로 주목받은 HYBE·SM·JYP·YG 4대 기획사를 시가총액, 2025 매출·영업이익, 영업이익률, 대표 아티스트와 사업구조로 비교합니다.` (89자) |
| reports.ts badges | `["기획사", "시총·실적"]` |
| ogImage | `/og/reports/kpop-big4-agency-comparison-2026.png` |
| JSON-LD | `@graph`: Article(headline=H1, datePublished/dateModified=실제 공개·실질 갱신일), FAQPage(화면 FAQ와 동일 텍스트), BreadcrumbList(홈 › 리포트 › 페이지) |

### 6-2. intro·FAQ

기획서 7절 intro 4단락과 FAQ 10개를 그대로 이관하되, 순위·수치가 들어간 문장은 유틸 결과로 템플릿화한다(예: `${top(revenue).shortName}`). DART 확정 후 순위가 바뀌어도 본문이 자동으로 일치해야 한다. 정적 서술 문장 중 순위를 단정하는 것은 검증 스크립트가 dist HTML과 KPI를 대조한다.

### 6-3. criteria (4개)

1. 실적은 각 사 2025 사업보고서 연결 재무제표, 최신 분기는 2026 반기보고서의 2분기(3개월) 값
2. 시가총액은 `{asOf}` 종가 × 보통주 상장주식수 직접 계산(시뮬레이션)
3. 영업이익률 = 영업이익 ÷ 매출, 성장률은 전년 대비이며 전년 적자는 흑자전환으로 표기
4. 대표 아티스트는 `{verifiedAt}` 공식 아티스트 페이지 기준, HYBE는 레이블을 구분

## 7. 구현 순서

| 단계 | 작업 | 산출 |
|---|---|---|
| 1 | **데이터 확정**: DART 2025 사업보고서·2026 반기보고서 ×4에서 3-3 표 값 대조, 매출 구분·직원 현황 추출 / KRX 단일 영업일 종가·상장주식수 / 공식 아티스트 페이지 4곳 / 연합뉴스 원문·국회 회의록 | 데이터 확정 메모, 불일치 기록 |
| 2 | 데이터 파일·유틸 작성, `validateData` | `src/data`, `src/utils` |
| 3 | 페이지·SCSS·`app.scss` | 렌더 |
| 4 | 검증 스크립트 | `scripts/check-…mjs` |
| 5 | 등록(reports.ts·홈·허브)·관련 링크 양방향 | publishReady=true일 때만 |
| 6 | OG 생성·sitemap | 공개 단계 |
| 7 | 빌드·검증·반응형 확인, 결과 기록 | 기획서·설계서 하단 기록 |

1단계에서 공식 아티스트 페이지가 계속 열리지 않으면 회사 사업보고서 ‘주요 아티스트’ 기재 또는 회사 공식 보도자료로 대체하고 출처 limitation에 기록한다. 둘 다 불가하면 대표 IP 열을 ‘재확인 필요’로 두고 publishReady를 false로 유지한다.

## 8. 내부 링크

| 이 페이지 → | 역방향 |
|---|---|
| `/reports/korean-movie-break-even-profit/` ‘영화는 얼마나 벌어야 남을까 — 흥행 손익 비교’ | 영화 리포트 관련 링크에 ‘4대 기획사 시총·실적 비교’ 추가 |
| `/reports/kospi-large-cap-2026-q2-earnings/` ‘코스피 대형주 2분기 실적도 비교해 보기’ | 관련 링크 추가 |
| `/reports/us-bigtech-q2-2026-earnings/` ‘실적과 주가 반응, 미국 빅테크 2분기 비교’ | 선택(문맥 맞으면 추가) |

역방향 링크는 각 페이지의 기존 관련 링크 데이터 구조를 따른다. 구현 시 해당 파일 구조를 확인하고, 구조가 없으면 페이지 하단 관련 링크 영역에만 추가한다.

## 9. 검증 스크립트 (`scripts/check-kpop-big4-agency-comparison-2026.mjs`)

| 검사 | 기준 |
|---|---|
| 데이터 검증 | 4-1 규칙 전부, publishReady면 4-2 게이트 |
| 산식 | 영업이익률·성장률·시총·시총/매출을 스크립트에서 독립 재계산해 데이터·HTML 표시값과 대조. 고정 케이스: YG 2025 영업이익 성장 = ‘흑자전환’, HYBE PER = ‘N/A’ |
| 순위 일관성 | KPI 1위, insight 문구, intro·FAQ 순위 문장이 같은 결과 |
| 기간 분리 | KPI 영역에 ‘2Q’ 값이 포함되지 않음 |
| 메타 | Title ≤ 50자, Description 80~120자, intro 4단락·600자 이상, FAQ ≥ 7, FAQPage JSON-LD 질문 = 화면 질문 |
| 배지 | dist HTML에 4종 외 배지 텍스트 없음 |
| 금칙어 | 저평가·고평가·매수·매도·목표주가·유망 |
| 링크 | 관련 3개 경로가 dist에 존재, 역방향 링크 존재(등록 단계 이후) |
| 아티스트 | HYBE 레이블 표기, verifiedAt 표시 |

## 10. QA 포인트와 완료 조건

아래는 향후 조건이며 현재 완료 체크가 아니다.

- [ ] 7절 1단계 데이터 확정 완료, 모든 핵심 수치 `공식`(시총은 `시뮬레이션`)
- [ ] HYBE 2025 영업이익(459 vs 499)·YG 2Q(98 vs 110)·JYP 2Q 매출 불일치 해소와 기록
- [ ] 시총 4개 동일 영업일 종가, 화면 기준일 표시
- [ ] 연간·분기 표 분리, KPI는 연간만
- [ ] 패노메논 3분리 표와 미확인 목록이 데이터 기준과 일치
- [ ] 대표 아티스트 회사당 3팀 이상, 확인일·레이블 표시
- [ ] `node scripts/check-kpop-big4-agency-comparison-2026.mjs` 통과
- [ ] `npm run check:mapping` 통과
- [ ] `npm run build` 성공, `dist/reports/kpop-big4-agency-comparison-2026/index.html` 생성
- [ ] 320/480/640/820/1280px에서 scrollWidth = clientWidth, 카드/표 전환·막대 라벨 가독성
- [ ] 브라우저 콘솔 오류 없음, FAQ 펼침 동작
- [ ] OG 1200×630 시각 확인
- [ ] `QUALITY_SCORE.md`·`DEPLOY_CHECKLIST.md` 검토

전체 `npm run check:all`은 기존 저장소 오류(직전 기록 397건)가 있으므로 신규 파일 오류 0건 여부를 별도로 기록하고, 전체 통과로 기록하지 않는다.

**현재 작업 기록 (2026-10-08):** 설계 문서 작성만 수행. 데이터 확정·구현·검증 스크립트·빌드·커밋·push·배포 미수행.

## 구현·검증 기록 — 2026-10-08

사용자 구현 요청에 따라 리포트를 구현했다. 커밋·push·배포는 수행하지 않았다.

### 7절 1단계 데이터 확정 결과 (DART 원문 대조)

기획 단계의 외부 집계(stockanalysis)·보도 값과 DART 원문이 여러 항목에서 달랐다. 모두 DART 원문으로 교체했다.

| 항목 | 기획 단계 값 | DART 확정값 | 출처 |
|---|---|---|---|
| HYBE 2025 영업이익 | 459억(집계) / 499억(잠정 보도) | **493억** (49,318,276천원) | 2025 사업보고서 요약재무정보 |
| SM 2025 영업이익 | 1,813억 | **1,830억** | 연결 포괄손익계산서 |
| YG 2025 영업이익 | 529억 | **713억** (71,341,515,441원) | 연결 포괄손익계산서 |
| YG 2024 영업이익 | -208억 | **-206억** | 상동 |
| 순이익 | 지배주주 귀속 위주 | 연결 당기순이익과 지배주주 순이익 분리 저장(PER은 지배주주 기준) | 상동 |
| SM 2026 2Q 영업이익 | 476억 | **529억** | 2026 반기보고서 3개월 열 |
| YG 2026 2Q 영업이익 | 98억 / 110억 | **110억** | 상동 |
| HYBE 2026 2Q 영업이익 | 1,678억 / 1,709억 | **1,709억** | 상동 |
| 직원 수(별도, 2025-12-31) | 874·714·441·366(집계) | **893·765·496·438** | 사업보고서 직원 등 현황 |
| 발행주식 | 유통주식수(집계) | 2026-06-30 발행주식 총수 | 반기보고서 주식의 총수 |

- 순위 결론은 유지: 매출·시총·총자산 1위 HYBE, 2025 영업이익 1위 SM, 영업이익률 1위 JYP(18.9%), HYBE 영업이익 4위. 영업이익률 순위는 JYP 18.9% > SM 15.6% > YG 13.1% > HYBE 1.9%로 확정(기획 단계 YG 9.7%는 오류).
- 시가총액: KRX 정보데이터시스템은 로그인 필요로 사용 불가. 2026-10-07 종가(Yahoo Finance 일별 시세, `참고`) × 발행주식 총수(DART, `공식`)로 계산해 `시뮬레이션` 표기. HYBE 약 7.20조, SM 약 1.81조, JYP 약 1.37조, YG 약 7,757억.
- 매출 구성: 각 사 사업보고서 분류 원문 유지. SM은 공연이 ‘공연·영상 콘텐츠 제작 등’에 묶여 있어 공연 단독 비교 불가를 화면에 명시.
- 아티스트: 공식 아티스트 페이지 대신 7절 대체 경로(사업보고서 기재)를 사용. HYBE(기타 참고사항 10팀), SM(회사의 개요 17팀·명), JYP(사업의 개요 기재 그룹 10팀), YG(전속계약 현황 7팀·명). HYBE 레이블 목록은 hybecorp.com 비즈니스 페이지로 확인했으나 아티스트별 레이블 배정은 공시에 없어 표기하지 않음(‘HYBE 레이블 소속’ 일괄 표기).
- 분기 원인 설명: HYBE만 보도(뉴시스)로 유지. JYP·YG 원인 보도는 수치 불일치·발표 전 전망 기사·개인 신상 내용이 섞여 제외.

### 설계 대비 변경

- 금액 단위를 억원 정수 → **백만원 정수**로 변경. 억원 반올림값으로 성장률을 계산하면 원문과 0.1%p 어긋나는 문제(YG 매출 +49.5% vs 원문 +49.4%) 때문. 화면 표시는 억원.
- 거래소 필드명 `market` → `exchange` (시세 스냅샷 `market`과 키 충돌로 값이 덮어써지는 버그를 타입 검사에서 발견해 수정).
- `ArtistEntry.relation`·`contractScope` 대신 회사별 `ipNote`로 공시 기재 기준을 설명.
- 모바일 비교표: `<details>` 대신 1023px 이하 회사별 카드, 1024px 이상 표로 전환.
- 주격 조사(이/가, 은/는) 헬퍼를 추가해 데이터 기반 문장의 ‘SM가’ 오류 방지.

### 생성·수정 파일

신규: `src/data/kpopBig4AgencyComparison2026.ts`, `src/utils/kpopBig4AgencyComparison2026.ts`, `src/pages/reports/kpop-big4-agency-comparison-2026.astro`, `src/styles/scss/pages/_kpop-big4-agency-comparison-2026.scss`, `scripts/check-kpop-big4-agency-comparison-2026.mjs`, `public/og/reports/kpop-big4-agency-comparison-2026.png`
수정: `src/styles/app.scss`, `src/data/reports.ts`(order 92), `src/pages/index.astro`, `src/pages/reports/index.astro`(culture), `public/sitemap.xml`(lastmod 2026-10-08), `scripts/generate-og-tools.py`, 역방향 링크 `src/data/koreanMovieBreakEvenProfit.ts`, `src/pages/reports/kospi-large-cap-2026-q2-earnings.astro`

### 실제 검증 결과

| 검증 | 결과 |
|---|---|
| `node scripts/check-kpop-big4-agency-comparison-2026.mjs` | 통과 — DART 고정값·산식 독립 재계산·순위·기준일 일치·오류 데이터 9종 거부·메타 길이·intro(4단락 884자)·FAQ 10개·dist HTML(H1 1개, FAQ 스키마=화면, id 중복 없음, 배지 4종만, 금칙어 없음, KPI에 분기값 없음, 역방향 링크 2개) |
| `npm run check:mapping` | 통과 (reports 224개 매핑) |
| `npm run build` | 성공, 428페이지 |
| `npx astro check` | 신규 파일 오류 0건. 전체 400 errors — 기존 `reports/index.astro`·`index.astro` 등의 기존 타입 오류이며, 이번에 추가한 등록 줄에서는 오류 없음. 전체 통과로 기록하지 않음 |
| 브라우저(astro preview) | 320/375/820/1280px에서 scrollWidth = clientWidth. 모바일 카드/데스크톱 표 전환, CSS 막대·매출 구성 막대 표시, 콘솔 오류 없음. 홈·리포트 허브에 노출 확인 |
| OG | 1200×630 생성 후 시각 확인(임시 venv의 Pillow 사용, 다른 OG 이미지는 재생성하지 않음) |

남은 과제: 연합뉴스 원문·국회 회의록 직접 대조, 패노메논 법인명·자본금 공개 시 반영, 3분기 보고서 공시(11월) 때 분기 표 갱신, 시가총액 기준일 갱신.
