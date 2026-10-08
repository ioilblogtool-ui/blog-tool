# 삼성전자 vs 마이크론 최신 실적 비교 2026 — 설계 문서

> 기획 원문: [samsung-micron-earnings-2026.md](../../plan/202610/samsung-micron-earnings-2026.md)
> 작성일: 2026-10-08 (한국시간)
> 문서 상태: **설계·구현 완료 / 빌드·기능·반응형 검증 완료 / 전체 타입 검사 기존 파일 오류 / 배포 미착수**
> 수치 기준: 기획서에서 2026-10-08 확인한 자료. 이번 작업은 구현 설계이며 최신 수치를 추가 조사한 작업이 아니다. 실제 발행 직전 공식 자료를 다시 대조한다.

## 1. 문서 개요와 구현 결정

| 항목 | 결정 |
|---|---|
| slug / URL | `samsung-micron-earnings-2026` / `/reports/samsung-micron-earnings-2026/` |
| 유형 / 카테고리 | report / asset |
| 레이아웃 | `src/layouts/BaseLayout.astro` 직접 사용. 입력 폼이 없는 정적 비교 리포트 |
| 코드·스타일 prefix | `SME_` / `sme-` |
| 초기 데이터 | 삼성전자 2026 Q3 잠정 연결 K-IFRS + 마이크론 FY2026 Q4 연결 US-GAAP |
| 확장 | 같은 URL에서 삼성전자 확정실적·사업부 공개, SK하이닉스 Q3, 마이크론 다음 분기 순차 반영 |
| 초기 사용자 입력 | 없음. 환산 입력·정렬·회사 선택·스냅샷 선택 UI는 초기 범위에서 제외 |
| 차트 | 정적 CSS bar와 정확한 표. Chart.js와 별도 클라이언트 JS 불필요 |
| 데이터 배지 | 공식 / 참고 / 시뮬레이션 / 추정만 사용 |
| 성과급 | 안내와 기존 리포트 CTA. 이 페이지에서 지급률·개인 수령액 계산 없음 |
| 환율 | 초기 원통화 표시만. 환율을 확보해 별도 설계하기 전 환산 결과 없음 |

### 코드 확인으로 정리한 사항

- `package.json`의 Astro 의존성은 5.x 범위다. ARCHITECTURE 문서의 4.x 표기는 설명의 이전 상태이며 이번 작업에서 의존성을 변경하지 않는다.
- `CalculatorHero`는 `eyebrow/title/description`, `InfoNotice`는 `title/lines`를 받는다.
- `SeoContent` FAQ 타입은 `{ question, answer }`다. 기획·일반 가이드의 `{ q, a }` 예시를 그대로 전달하면 안 된다.
- `BaseLayout`이 canonical·OG·기본 WebSite JSON-LD를 출력한다. 페이지가 Article·FAQPage·BreadcrumbList를 만들어 `jsonLd`로 전달한다. `SeoContent`에는 JSON-LD 자동 생성 코드가 없다.
- `BaseLayout`은 Title 접미사를 붙이지 않는다. 초기 최종 Title은 `삼성전자 3분기 실적 2026 | 마이크론과 영업이익 비교 — 비교계산소`로 전달한다(50자 이내). Description은 기획서의 98자 문구를 사용한다.
- `_tokens.scss`와 `app.scss`에서 CSS 토큰 정의·로드를 확인했다. 다만 ARCHITECTURE의 페이지 CSS 변수 미사용 규칙을 준수해 신규 SCSS는 같은 팔레트의 리터럴 색상으로 작성한다. 공용 클래스는 기존 구현을 그대로 재사용한다.
- 기존 Python OG 생성기의 리포트 출력 위치는 `public/og/reports/`다. 기획서의 임시 `/og/<slug>.png` 계획을 실제 생성 패턴에 맞춰 `/og/reports/<slug>.png`로 구체화한다.

## 2. 파일 구조와 책임

| 파일 | 작업·책임 |
|---|---|
| `src/data/samsungMicronEarnings2026.ts` | 신규. 타입·출처·버전별 원자료·스냅샷·메타·설명·FAQ·관련 링크 |
| `src/utils/samsungMicronEarnings2026.ts` | 신규. 검증·계산·표시·화면 모델 생성. 원자료를 변형하지 않는 순수 함수 |
| `src/pages/reports/samsung-micron-earnings-2026.astro` | 신규. 빌드 시 데이터 검증과 렌더링, 페이지 JSON-LD |
| `src/styles/scss/pages/_samsung-micron-earnings-2026.scss` | 신규. `sme-` prefix, 표·KPI·추이·설명 카드 |
| `public/og/reports/samsung-micron-earnings-2026.png` | 후속 생성. 1200×630, 비교 기업·기간·잠정 여부 |
| `scripts/generate-og-tools.py` | 기존 REPORTS 배열에 메타 추가. 생성 결과는 신규 이미지 외 변경되지 않도록 확인 |
| `src/data/reports.ts` | 신규 리포트 등록 |
| `src/pages/index.astro` | 홈 `reportMetaBySlug` 등록 |
| `src/pages/reports/index.astro` | 허브 `reportMetaBySlug` 등록 |
| `src/styles/app.scss` | `@use` 추가 |
| `public/sitemap.xml` | URL·실제 공개 갱신일 등록 |

상호작용이 없으므로 `public/scripts/<slug>.js`와 JSON DOM 주입은 만들지 않는다. 다른 실적·보상 리포트의 모델을 import하지 않는다. 교차 링크 추가가 필요하면 구현 범위에 명시하고 해당 페이지의 데이터·본문 문맥에서 검토한다.

## 3. 데이터 파일 설계

### 3-1. 타입과 버전 관리

```ts
export type CompanyId = 'samsung' | 'micron' | 'skhynix';
export type Badge = '공식' | '참고' | '시뮬레이션' | '추정';
export type Basis = 'K-IFRS' | 'US-GAAP' | 'non-GAAP';
export type MetricKey = 'revenue' | 'operatingProfit' | 'netIncome';
export type Source = {
  id: string;
  title: string;
  url: string;
  publisher: string;
  publishedAt: string | null;
  checkedAt: string;
  locator: string; // 표 이름·원자료 단위·PDF 페이지 등
};
export type Metric =
  | { status: 'available'; value: number; badge: Badge; sourceId: string }
  | { status: 'unpublished'; value: null; badge: null; sourceId: null; reason: string };
export type Company = {
  id: CompanyId;
  name: string;
  businessSummary: string;
  availability: 'available' | 'pending';
};
export type QuarterRecord = {
  recordId: string; // company-fiscalYear-quarter-scope-basis-revision
  revision: number;
  companyId: CompanyId;
  fiscalYear: number;
  fiscalQuarter: 1 | 2 | 3 | 4;
  periodLabel: string;
  periodStart: string;
  periodEnd: string;
  periodStartMethod: 'published' | 'day-after-previous-end';
  periodSourceIds: string[];
  weeks: number | null;
  currency: 'KRW' | 'USD';
  unit: 'trillion' | 'million';
  scope: 'consolidated' | 'DS' | 'memory';
  basis: Basis;
  releaseStatus: 'preliminary' | 'reported';
  auditStatus: 'unaudited' | 'reviewed' | 'audited' | 'unknown';
  releasedAt: string | null; // 최초 발표일이 미확인이면 null
  checkedAt: string;
  revenue: Metric;
  operatingProfit: Metric;
  netIncome: Metric;
  reportedMargin: Metric;
  officialGrowth: Partial<Record<'revenueYoy' | 'revenueQoq' | 'opYoy' | 'opQoq', Metric>>;
  previousQuarterId: string | null;
  previousYearQuarterId: string | null;
};
export type Snapshot = {
  id: string;
  updatedAt: string;
  recordIds: string[]; // 연결 비교에 사용할 불변 버전 ID
  segmentRecordIds: string[]; // DS·메모리는 연결 표와 분리
  note: string;
};
export type EvidenceItem = {
  id: string;
  companyId: CompanyId;
  topic: 'pricing' | 'shipments' | 'AI' | 'HBM' | 'business';
  text: string;
  badge: Badge;
  sourceIds: string[];
  appliesToRecordIds: string[];
};
export type ProductUpdate = {
  companyId: CompanyId;
  generation: 'HBM3E' | 'HBM4' | 'HBM4E';
  stage: 'sample' | 'qualification' | 'production' | 'collaboration' | 'unconfirmed';
  announcedAt: string | null;
  text: string;
  sourceIds: string[];
};
export type Guidance = {
  companyId: CompanyId;
  periodLabel: string;
  basis: Basis;
  announcedAt: string;
  sourceId: string;
  lines: string[]; // 미래 전망이라는 안내를 함께 렌더링
};
```

`Metric`의 판별 유니온으로 미공개와 공식 0을 구분한다. `QuarterRecord`에 revision을 추가해 잠정·확정 발표를 서로 다른 ID로 보존한다. 기존 객체를 덮어쓰면 과거 스냅샷까지 확정 숫자로 바뀌므로 금지한다. 정정 발표도 새 revision으로 추가한다. 이전 분기 참조도 버전 ID를 사용한다.

필수 export: `SME_META`, `SME_COMPANIES`, `SME_SOURCES`, `SME_RECORDS`, `SME_SNAPSHOTS`, `SME_ACTIVE_SNAPSHOT_ID`, `SME_EVIDENCE`, `SME_PRODUCT_UPDATES`, `SME_GUIDANCE`, `SME_UPDATE_LOG`, `SME_FAQ`, `SME_SEO_INTRO`, `SME_CRITERIA`, `SME_RELATED`.

메타에는 `slug`, `title`, `seoTitle`, `seoDescription`, `description`, `updatedAt`, `publishedAt: string | null`, `ogImage`을 둔다. `publishedAt`은 실제 발행 전 null이며 문서 작성일을 발행일로 쓰지 않는다.

### 3-2. 초기 실제 원자료

금액 데이터는 기획서의 확인값을 옮기는 기준이다. 역사적 수치를 재인용한 발표자료는 출처로 연결하되 역사적 최초 발표일을 현재 발표일로 채우지 않는다.

| 레코드 ID | 회사·기간 | 매출 | 영업이익 | 순이익 | 기준·단위 |
|---|---|---:|---:|---|---|
| `samsung-2026-q3-consolidated-kifrs-r1` | 2026-07-01~09-30 | 195 | 107.4 | 미공개 | 잠정 / KRW 조 원 |
| `samsung-2026-q2-consolidated-kifrs-r1` | 2026-04-01~06-30 | 171.5 | 89.49 | 이번 자료 미수집 | 발표 실적 / KRW 조 원 |
| `samsung-2025-q3-consolidated-kifrs-r1` | 2025-07-01~09-30 | 86.06 | 12.17 | 이번 자료 미수집 | 발표 실적 / KRW 조 원 |
| `micron-2026-q4-consolidated-gaap-r1` | 2026-05-29~09-03 | 54,229 | 43,751 | 37,701 | 발표 실적 / USD 백만 달러 |
| `micron-2026-q3-consolidated-gaap-r1` | 이전 분기 기록 | 41,456 | 33,318 | 이번 자료 미수집 | 발표 실적 / USD 백만 달러 |
| `micron-2025-q4-consolidated-gaap-r1` | 전년동기 기록 | 11,315 | 3,654 | 이번 자료 미수집 | 발표 실적 / USD 백만 달러 |

과거 마이크론 두 레코드의 정확한 시작일·종료일은 기획서에 전체가 수집되지 않았다. 구현 시 해당 공식 분기 자료로 보완한 뒤 완전한 `QuarterRecord`로 입력한다. 시작일을 모르는 채 placeholder 날짜를 넣지 않는다. 과거 분기의 순이익 등 이번 페이지에서 필요하지 않은 지표는 “이번 자료 미수집” 사유로 처리하며 회사가 공개하지 않았다는 의미로 노출하지 않는다. 초기 활성 분기의 순이익 미공개와 구분한다.

현재 삼성전자 `releasedAt='2026-10-08'`, 마이크론 `releasedAt='2026-09-30'`, 모든 이번 조사 `checkedAt='2026-10-08'`. 마이크론 Q4 `periodStartMethod='day-after-previous-end'`, `weeks=14`. 삼성전자는 `weeks=null`로 달력 기간을 그대로 표시한다. 현재 마이크론 `auditStatus='unaudited'`, 삼성전자 잠정 `auditStatus='unknown'`. 과거 자료의 감사 상태도 확인한 경우에만 채운다.

초기 `SME_ACTIVE_SNAPSHOT_ID='2026-10-08-preliminary'`. `recordIds`는 삼성전자 Q3 r1·마이크론 Q4 r1, `segmentRecordIds=[]`. 회사 배열 순서는 삼성전자→SK하이닉스→마이크론으로 고정하되 초기 표는 활성 레코드가 있는 두 회사만 렌더링한다. SK하이닉스는 `pending` 안내에만 표시한다.

삼성전자 공식 증가율은 매출 YoY 126.59·QoQ 13.70, 영업이익 YoY 782.50·QoQ 20.01로 저장한다. 마이크론 공식 이익률 80.7은 `reportedMargin`에 보존하되 KPI·표의 이익률은 동일 산식으로 계산한다. 표시 단위 변환만 하는 원통화 금액은 `공식`, 재계산 이익률·증가율은 `시뮬레이션`이다.

### 3-3. 출처 연결

| sourceId | 원문·검증 위치 |
|---|---|
| `samsung-q3-2026-kr` | [삼성전자 한국 뉴스룸](https://news.samsung.com/kr/삼성전자-2026년-3분기-잠정실적-발표), 현재 잠정치·공식 증가율 |
| `samsung-q3-2026-global` | [삼성전자 글로벌 뉴스룸](https://news.samsung.com/global/samsung-electronics-announces-earnings-guidance-for-third-quarter-2026), 비교 분기 원값·조 원 단위 |
| `micron-q4-2026-release` | [마이크론 FY2026 Q4 발표](https://investors.micron.com/news/press-release/2026/Micron-Technology-Inc--Reports-Record-Fiscal-Fourth-Quarter-and-Full-Year-2026-Results/default.aspx), GAAP 재무표·전망 표 |
| `micron-q4-2026-remarks` | [공식 준비자료](https://s25.q4cdn.com/621799436/files/doc_financials/2026/q4/Q4-FY26-Prepared-Remarks.pdf), 4쪽 HBM·7쪽 DRAM/NAND |

HBM 제품 출처는 기획서 3-3 링크와 각 발표일을 별도 Source로 옮긴다. 역사적 분기 원문과 정확한 발표 일정은 발행 직전 보완한다. 기간 추론은 `periodStartMethod`와 출처로 설명하고 공식 공시의 직접 표기처럼 취급하지 않는다.

### 3-4. 콘텐츠 데이터

`SME_EVIDENCE`의 삼성전자 초기 카드는 “잠정자료에서는 사업부별 실적 원인이 공개되지 않았습니다. 확정실적 발표 후 보강합니다.”로 한다. 마이크론의 가격·출하·제품 관련 설명은 기획서의 공식 근거만 옮긴다. 편집 해석은 별도 `참고` 항목으로 만들며 공식 코멘트와 한 문장으로 합치지 않는다.

`SME_PRODUCT_UPDATES`는 발표 당시의 상태를 설명한다. “협력”을 “양산”으로 자동 승격하지 않는다. HBM3E 최신 자료를 확인하지 못한 셀은 “최신 공식 자료 확인 필요”로 표시하고 숫자·배지는 생략한다.

FAQ는 기획서의 9개 질문을 `{ question, answer }` 배열로 완성한다. 수치를 답변에 쓸 때는 활성 화면 모델로부터 조합해 갱신 때 낡은 답변이 남지 않게 한다. intro 4개 단락은 기획서 초안을 사용하되 길이 검수 후 확정한다. 관련 링크는 필수 4개와 `semiconductor-etf-2026` 총 5개로 고정한다.

## 4. 계산·검증·화면 모델

### 4-1. 함수 계약

| 함수 | 역할 |
|---|---|
| `validateReportData(data)` | ID·출처·활성 레코드·날짜·수치·기간·이전 분기 호환성 검사. 실패하면 빌드 중 throw |
| `resolveSnapshot(id, data)` | 스냅샷의 명시 ID만 조회. 배열 마지막 요소를 최신으로 간주하지 않음 |
| `calculateMargin(revenue, operatingProfit)` | 매출이 양수이고 두 값이 유한하면 % 반환. 아니면 계산 불가 |
| `calculateGrowth(current, previous)` | 양수 비교 기반에서는 % 계산, 0·음수 기반에서는 상태 문구 반환 |
| `formatMoney(record, metric)` | 원자료 단위에 따라 조 원·억 달러 표시. 부호와 미공개 사유 처리 |
| `formatPercent(value, digits)` | 한국어 숫자 포맷, 이익률 1자리·성장률 2자리 |
| `buildReportView(snapshot, data)` | KPI·표 행·추이·이익률·FAQ·주의 문구·페이지 메타를 생성 |
| `buildJsonLd(view, canonical)` | 화면과 일치하는 Article·FAQ·Breadcrumb 데이터 생성 |

### 4-2. 산식과 예외

```ts
type GrowthResult =
  | { kind: 'percent'; value: number; badge: '시뮬레이션' }
  | { kind: 'label'; label: string };

function calculateMargin(revenue: number | null, op: number | null): number | null {
  if (revenue === null || op === null || !Number.isFinite(revenue) ||
      !Number.isFinite(op) || revenue <= 0) return null;
  return op / revenue * 100;
}

function calculateGrowth(current: number | null, previous: number | null): GrowthResult {
  if (current === null || previous === null || !Number.isFinite(current) ||
      !Number.isFinite(previous)) return { kind: 'label', label: '계산 불가' };
  if (previous > 0) return {
    kind: 'percent', value: (current / previous - 1) * 100, badge: '시뮬레이션'
  };
  if (previous < 0 && current > 0) return { kind: 'label', label: '흑자 전환' };
  if (previous < 0 && current < 0) return {
    kind: 'label', label: current > previous ? '적자 축소' : current < previous ? '적자 확대' : '적자 지속'
  };
  return { kind: 'label', label: '계산 불가' };
}
```

기본 표는 공식 발표 증가율이 있으면 그 값과 `공식`을 사용한다. 없으면 이전 레코드로 계산해 `시뮬레이션`을 사용한다. 표 캡션에 혼용 기준을 설명한다. 유틸은 검산용 재계산값도 보존하지만 공식값을 재계산 결과로 덮어쓰지 않는다.

금액 표시: KRW trillion은 원값을 조 원으로, USD million은 `/100` 하여 억 달러로 표시한다. 원자료 단위·정밀 값은 출처 설명에 남긴다. 예: 54,229백만 달러→542.29억 달러, 43,751→437.51억 달러. 연결표의 열 제목에도 통화를 표기한다. 이익률·성장률은 표시 전 반올림하지 않는다. 음의 0은 0으로 표시한다.

CSS 이익률 막대는 양수에 대해서만 `0~100%` 너비로 표시한다. 100%를 넘으면 막대는 100%로 제한하고 텍스트는 실제값 유지, 범위 초과 안내를 붙인다. 음수면 장식 막대를 생략하고 실제 음수 값·적자 문구를 표시한다. 숨기거나 0으로 바꾸지 않는다.

### 4-3. 데이터 검증 조건

- ID 중복·깨진 sourceId·snapshot recordId 참조는 오류.
- 활성 회사당 연결 레코드는 하나. DS·memory는 연결 `recordIds`에 들어갈 수 없다.
- 현재·과거 비교 참조의 회사·scope·basis·currency·unit 일치가 필수. 공식 증가율이 있는 경우에도 기본 참조의 정합성을 확인한다.
- QoQ 참조는 회계연도 경계를 포함해 정확히 직전 분기, YoY는 전년도 같은 회계분기여야 한다.
- 날짜는 유효한 ISO 날짜이고 시작≤종료. 추론 시작일은 직전 종료일+1일과 일치. 주 수는 기간의 포괄 일수와 일치해야 한다.
- `available` 값은 유한한 숫자, 출처·배지 필수. `unpublished`는 값·배지·출처가 null이고 사유 필수.
- 초기 연결 공식 표는 K-IFRS·US-GAAP만 허용. Non-GAAP는 주석이나 별도 영역으로만 다룬다.
- pending 회사는 비교 금액·이익률 막대에 들어갈 수 없다. 발표 후에만 availability와 활성 레코드를 함께 바꾼다.
- 미래 가이던스는 별도 객체. 실제 실적 KPI·성장률의 현재 값으로 사용하지 않는다.

## 5. 페이지 섹션·Astro 구성

### 화면 순서

| ID | 구성 |
|---|---|
| Hero | 리포트 제목·요약, 마지막 자료 갱신일 |
| InfoNotice | 잠정 여부·회계기준·기간 차이, 환산 미사용 |
| `sme-summary` | 초기 4 KPI: 회사별 매출·영업이익. 회사 영업이익 카드에 계산 이익률 보조 행 |
| `sme-comparison` | 정확한 원통화 비교표·공식 성장률/계산 성장률·분기·기간·발표일 |
| `sme-trends` | 회사별 전년동기→직전→현재의 매출·영업이익 표, 회사 안에서만 CSS bar 비교 |
| `sme-margin` | 이익률 값·산식·양사 또는 3사 막대. 사업구조 비교 한계 바로 안내 |
| `sme-drivers` | 회사별 공식 설명·편집 해석·미공개 상태 |
| `sme-business` | 전체 기업 범위와 DS·메모리 차이. 공개 후 사업부 표 추가 |
| `sme-hbm` | 세대별 발표 상태·날짜, 다음 분기 가이던스, 기술 리포트 링크 |
| `sme-updates` | SK하이닉스 대기 또는 추가 완료 안내, 갱신 내역 |
| `sme-bonus` | 산정 차이 설명·성과급 리포트 CTA 두 개 |
| `sme-sources` | 출처 목록·단위·계산 기준·한계 |
| SeoContent | 상세 인트로·기준·FAQ 9개·관련 링크 5개 |

`SeoContent` 내부 고정 ID(`overview/criteria/faq/related`)와 중복되지 않도록 페이지 ID에 prefix를 붙인다. 별도의 “관련 리포트” 링크 목록을 중복 생성하지 않고 하단 related 영역을 사용한다.

### 마크업 스케치

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import SiteHeader from '../../components/SiteHeader.astro';
import CalculatorHero from '../../components/CalculatorHero.astro';
import InfoNotice from '../../components/InfoNotice.astro';
import SeoContent from '../../components/SeoContent.astro';
import { withBase } from '../../utils/base';
import * as data from '../../data/samsungMicronEarnings2026';
import { validateReportData, resolveSnapshot, buildReportView, buildJsonLd }
  from '../../utils/samsungMicronEarnings2026';

validateReportData(data);
const snapshot = resolveSnapshot(data.SME_ACTIVE_SNAPSHOT_ID, data);
const view = buildReportView(snapshot, data);
const canonical = new URL(Astro.url.pathname, Astro.site ?? 'https://bigyocalc.com').href;
const jsonLd = buildJsonLd(view, canonical);
---
<BaseLayout title={view.meta.seoTitle} description={view.meta.seoDescription}
  ogImage={view.meta.ogImage} jsonLd={jsonLd}>
  <SiteHeader />
  <main class="container page-shell report-page sme-page">
    <CalculatorHero eyebrow="최신 반도체 실적 비교" title={view.meta.title}
      description={view.meta.description} />
    <InfoNotice title="실적 비교 기준" lines={view.noticeLines} />
    <section id="sme-summary" class="content-section" aria-labelledby="sme-summary-title">
      <div class="section-header section-header--compact">
        <h2 id="sme-summary-title">최신 실적 한눈에</h2>
      </div>
      <div class:list={['sme-kpi-grid', { 'sme-kpi-grid--three': view.companies.length === 3 }]}>
        {view.kpiGroups.map(group => (
          <div class="sme-company-kpis">
          {group.cards.map(card => (
          <article class="report-stat-card sme-kpi">
            <h3>{card.label}</h3><p>{card.displayValue}</p>
            <span class="sme-badge" data-badge={card.badge}>{card.badge}</span>
            <small>{card.periodLabel}</small>
          </article>
          ))}
          </div>
        ))}
      </div>
    </section>
    <!-- 비교표·추이·이익률·해석·사업구조·HBM·갱신·CTA·출처 순 -->
    <SeoContent introTitle="최신 반도체 실적을 읽는 기준" intro={view.intro}
      introSummary="기간과 사업구조를 함께 확인하며 실적을 비교하세요."
      criteria={view.criteria} criteriaTitle="비교 기준과 출처"
      faq={view.faq} related={view.related}
      relatedTitle="함께 보는 반도체·성과급 리포트" relatedEyebrow="관련 리포트"
      relatedLinkLabel="관련 리포트"
      relatedSummary="HBM 경쟁, 향후 실적 전망과 성과급 산정 기준을 이어서 확인하세요." />
  </main>
</BaseLayout>
```

비교표는 `<caption>`, 열 `<th scope="col">`, 항목 `<th scope="row">`를 사용한다. 스크롤 래퍼에 `tabindex="0"`, `role="region"`, 표 제목 `aria-labelledby`를 연결한다. 미공개 셀은 “사업부 수치 미공개” 등 이유를 텍스트로 설명한다. 출처 링크는 셀 또는 카드에서 `#sme-source-{sourceId}`로 연결하고 원문은 출처 목록에 둔다.

## 6. JS 인터랙션과 상태

초기 클라이언트 상태 객체·이벤트 핸들러·URL 파라미터는 없다. 빌드 상태는 활성 스냅샷 ID 하나이며, 모든 핵심 수치·FAQ·표는 SSG HTML에 포함된다. 브라우저 JS가 꺼져도 보고서를 읽을 수 있어야 한다. FAQ는 기존 SeoContent 동작을 사용한다.

초기 함수 목록은 4절의 빌드용 순수 함수로 충분하다. 환율 입력을 후속 추가할 때만 별도 JS 설계를 수행한다. 그때 원통화 자료는 불변으로 유지하고 양수·유한값 입력 검증, 기준일·출처 또는 사용자 가정 설명, `시뮬레이션` 배지, `textContent` 갱신, URL 상태 복원을 함께 설계한다. 이번 문서의 초기 완료 조건에 환산 기능을 포함하지 않는다.

## 7. SCSS·반응형·접근성

모든 신규 선택자는 `.sme-page` 아래의 `sme-` 이름으로 한정한다. 공통 `report-stat-card`, `content-section`, `section-header`를 우선 재사용한다. 기존 페이지 prefix나 글로벌 `table/h2/a` 규칙을 추가하지 않는다. `!important`는 사용하지 않는다.

| 화면 폭 | 배치 |
|---|---|
| 320~767px | KPI·해석·회사별 추이 1열. 패딩 16px. 긴 표만 내부 가로 스크롤 |
| 768~1023px | KPI 2열, 해석·추이 2열. 패딩 24px |
| 1024px 이상 | 초기 KPI 4열, 본문은 기존 container 폭. 핵심 비교표 전체 폭 |

3사 확장 후 KPI는 6개(각 회사 매출·영업이익)로 늘린다. 데스크톱 3열×2행에서 회사별 두 카드를 세로로 정렬하고 모바일 회사별 순서를 유지한다. 별도 modifier `sme-kpi-grid--three`와 grid 배치로 해결하며 DOM의 읽기 순서는 삼성전자→SK하이닉스→마이크론을 유지한다.

주요 클래스: `sme-kpi-grid`, `sme-kpi`, `sme-table-wrap`, `sme-table`, `sme-badge`, `sme-insight-grid`, `sme-trend`, `sme-bar-track`, `sme-bar-fill`, `sme-source-list`, `sme-update-list`, `sme-cta-group`.

```scss
.sme-page {
  .sme-kpi-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 12px; }
  .sme-company-kpis { display: grid; grid-template-columns: minmax(0, 1fr); gap: 12px; }
  .sme-table-wrap { max-width: 100%; overflow-x: auto; }
  .sme-table { width: 100%; min-width: 600px; border-collapse: collapse; }
  .sme-bar-track { overflow: hidden; background: #dbeafe; border-radius: 8px; }
  .sme-bar-fill { height: 12px; background: #1a56db; }
  .sme-badge { display: inline-block; border-radius: 20px; padding: 2px 8px; }
  .sme-badge[data-badge='공식'] { color: #1447bf; background: #dbeafe; }
  .sme-badge[data-badge='시뮬레이션'] { color: #7c3aed; background: #ede9fe; }
  .sme-badge[data-badge='참고'], .sme-badge[data-badge='추정'] {
    color: #92400e; background: #fef3c7;
  }
  @media (min-width: 768px) {
    .sme-company-kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (min-width: 1024px) {
    .sme-kpi-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .sme-kpi-grid--three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .sme-kpi-grid--three .sme-company-kpis { grid-template-columns: minmax(0, 1fr); }
  }
}
```

회사 단위 wrapper에 KPI 두 개를 묶는다. 초기 데스크톱은 회사 wrapper 2열·내부 카드 2열로 총 4개 카드가 한 행에 나오며, 3사 데스크톱은 회사 wrapper 3열·내부 카드 1열로 회사별 카드가 세로로 배치된다.

막대는 장식이며 `aria-hidden="true"`, 값·회사·기간은 텍스트로 제공한다. 색상만으로 공식·계산·미공개를 구별하지 않는다. 포커스는 기존 버튼·링크 스타일을 유지하고 표 래퍼에도 명확한 포커스 표시를 추가한다. 링크·숫자 긴 문자열은 줄바꿈 가능하게 하되 숫자와 단위는 필요한 범위만 묶는다. 애니메이션·툴팁·고정 하단 CTA는 초기 범위에 넣지 않는다.

## 8. SEO·출처·내부 링크·등록

### 메타와 JSON-LD

`BaseLayout`의 canonical을 사용하며 페이지에서 별도 canonical 태그를 추가하지 않는다. 초기 Title은 1절, Description·H1은 기획서 기준이다. 실제 발행 시 메타·등록 설명·OG를 일치시킨다.

페이지 `jsonLd`는 `{'@context':'https://schema.org','@graph':[Article, FAQPage, BreadcrumbList]}` 객체로 전달한다. Article의 `datePublished`는 실제 공개일이 있을 때만 추가, `dateModified`는 공개 콘텐츠의 실제 갱신일로 설정한다. FAQPage는 `view.faq`에서 생성한다. 화면에 없는 FAQ는 만들지 않는다. 기본 WebSite JSON-LD는 BaseLayout의 기존 출력을 유지한다. 새 사이트 전역 스키마·레이아웃 수정은 불필요하다.

OG에는 특정 수치 대신 “삼성전자 2026 Q3 잠정 / 마이크론 FY2026 Q4”와 매출·영업이익·이익률 비교 주제를 사용한다. 숫자 갱신 때 이미지 수치가 낡는 문제를 줄인다. 3사 확장 시 기업명·기간 문구도 갱신한다. `ogImage='/og/reports/samsung-micron-earnings-2026.png'`를 명시한다. `npm run og:generate`는 현재 Node 스크립트의 고정 도구 목록이며 이 리포트를 자동 포함하지 않으므로, 구현 단계에 Python REPORTS 등록과 해당 이미지 생성 결과를 직접 확인한다. 전체 이미지 재생성으로 무관한 변경을 남기지 않는다.

### 내부 링크

기획서의 필수 4개를 문맥별로 배치하고 SeoContent.related에는 ETF까지 총 5개를 전달한다. 페이지 본문 내부 링크는 `withBase('/reports/.../')`, SeoContent.related는 원경로를 전달한다(SeoContent가 base를 붙이므로 중복 적용 금지).

성과급 CTA 설명: “분기 영업이익 증가율이 개인 성과급 증가율과 같지는 않습니다. OPI·TAI·PS의 회사별 산정 기준과 연간 실적을 확인하세요.” 이후 삼성전자·SK하이닉스 보상 비교와 SK하이닉스 PS 전망 링크. 기존 보상 모델을 이 페이지 숫자에 연결하지 않는다.

출처 목록의 새 탭 링크는 `target="_blank" rel="noopener noreferrer"`. 제휴 블록은 0개. 실적 해석을 특정 종목 매수나 수익 보장 문구로 작성하지 않는다.

### 등록 스케치

```ts
// src/data/reports.ts — order는 구현 시 현재 목록과 충돌·노출 순서 확인
{
  slug: 'samsung-micron-earnings-2026',
  title: SME_META.seoTitle,
  description: SME_META.seoDescription,
  order: /* 현재 목록에서 정한 숫자 */,
  badges: ['공식', '시뮬레이션'],
}
// src/pages/index.astro > reportMetaBySlug
'samsung-micron-earnings-2026': { category: 'asset', isNew: true },
// src/pages/reports/index.astro > reportMetaBySlug
'samsung-micron-earnings-2026': {
  eyebrow: '최신 반도체 실적',
  tags: [{ label: '삼성전자·마이크론', mod: 'asset' }, { label: '실적 비교', mod: 'asset' }],
  category: 'asset', isNew: true,
},
```

`reports.ts`에서 메타를 참조하려면 신규 데이터 파일의 `SME_META`를 import한다. 의존 방향은 reports→개별 데이터로 한정하고 개별 데이터에서 reports를 import하지 않는다.

`app.scss`에는 `@use "scss/pages/samsung-micron-earnings-2026";`를 추가한다. sitemap에는 `https://bigyocalc.com/reports/samsung-micron-earnings-2026/`와 공개 콘텐츠의 실제 갱신일을 추가한다. 리포트이므로 `tools.ts`에는 등록하지 않는다.

## 9. 갱신·3사 확장 절차

1. **삼성전자 확정실적:** 현재 잠정 r1을 유지하고 확정 r2 추가. 이전 비교값이 수정되면 과거 레코드도 새 revision 추가 후 r2에서 참조. 새 스냅샷을 활성화하고 DS 공식 자료는 별도 segment 배열에 등록한다.
2. **삼성전자 컨콜:** 해당 실적·제품에 적용되는 근거 항목을 추가하고 발표 날짜와 범위를 명시한다. 아직 미공개인 메모리 영업이익은 null로 유지한다.
3. **SK하이닉스 Q3:** 공식 회사·기간·회계·통화 자료와 비교 기준 레코드 추가. availability를 available로 바꾸고 새 스냅샷에 연결 레코드를 추가한다. 회사별 KPI 그룹 3개·표 3열·이익률 3막대를 생성한다.
4. **3사 메타:** 같은 slug로 `삼성전자·SK하이닉스·마이크론 실적 비교 2026 — 비교계산소` Title과 H1·설명·허브 태그·OG 변경. 날짜·정확한 실적기간은 화면에서 표시한다.
5. **마이크론 다음 분기:** 새 FY2027 Q1 레코드와 스냅샷을 추가한다. 다른 회사는 그 시점의 최신 공식 레코드를 유지하고 상단 “최신 발표 기준·기간 다름” 안내를 재작성한다. 삼성전자 Q3만 최신인 상태에서 계속 “동일 Q3 비교”처럼 표현하지 않는다.
6. **HBM 발표:** 제품 상태 기록·근거를 추가한다. 실적 스냅샷이 그대로여도 콘텐츠 갱신일·변경 로그·메타 dateModified를 바꾼다.

과거 스냅샷은 데이터에 보존하고 초기에는 화면 선택 기능을 제공하지 않는다. 사용자 갱신 로그에는 “잠정→확정”, “SK하이닉스 추가”, “마이크론 최신 분기 반영”을 구체적으로 기록한다. 동일 활성 스냅샷에서 과거 수치가 바뀌는 수정은 새 revision·스냅샷으로 처리한다.

## 10. 구현 순서·검증·완료 조건

### 구현 순서

1. 발행 직전 공식 자료 재확인, 과거 마이크론 기간·HBM3E·확정 발표 일정 보완. 확인되지 않은 정보는 미확인 설명으로 처리한다.
2. 데이터 타입·출처·원자료·스냅샷과 순수 계산 함수 작성. 유효성 검증을 Astro frontmatter에서 호출한다.
3. 페이지 메타·4 KPI·비교표·회사별 추이·이익률을 SSG로 작성한다.
4. 실적 원인·사업구조·HBM·업데이트·성과급 CTA·출처·SEO 본문 작성.
5. SCSS·접근성·메타·등록·OG 생성.
6. 의미 있는 계산·자료 참조 검증과 2사/3사 화면 검증, `npm run check:all`, `npm run build`.
7. 품질 루브릭·배포 체크리스트 확인 후 별도 배포 단계로 진행.

### 계산·갱신 검증 기준

| 검증 | 기대 결과 |
|---|---|
| 삼성전자 107.4 / 195 | 영업이익률 55.1%, 시뮬레이션 |
| 마이크론 43,751 / 54,229 | 영업이익률 80.7%, 시뮬레이션 |
| 마이크론 매출 54,229 / 41,456 | QoQ 30.81%, 시뮬레이션 |
| 마이크론 영업이익 43,751 / 3,654 | YoY 1,097.35%, 시뮬레이션 |
| 삼성전자 공식 증가율 vs 반올림 원값 검산 | 공식 발표값 유지, 재계산값 차이 고지 |
| 미공개 vs 수치 0 | 미공개는 이유 표시, 0은 실제 0과 공식 배지 표시 |
| 이전 값 0·음수·null | 계산 불가 또는 부호에 맞는 흑자 전환·적자 축소/확대 |
| 잘못된 회사·회계기준 이전 분기 참조 | 유효성 검증 실패 |
| pending SK하이닉스 | 숫자·비교 열·막대 없음, 대기 안내만 노출 |
| 3사 가상 검증 fixture | 동적 회사 열·KPI 그룹·막대 생성. 가상 수치는 운영 데이터에 넣지 않음 |
| r1 보존 후 r2 활성화 | 과거 스냅샷은 잠정값, 새 스냅샷만 확정값 조회 |
| Non-GAAP·가이던스 혼입 | 활성 연결 비교 검증 실패 또는 별도 데이터만 렌더링 |
| 원통화 금액 표시 | USD 백만→억 달러 변환 일치, 환율·원화 차액 표시 없음 |

새 테스트 프레임워크를 추가하지 않고 현재 프로젝트에서 실행 가능한 방식으로 순수 함수 검증을 한다. 단순 문구·카드 배치에 구현을 복제하는 테스트는 만들지 않는다. 계산 예외·자료 범위·스냅샷 보존을 우선 검증한다.

### 구현 후 QA 체크리스트

- [ ] 공식 원자료·실적기간·출처·발표 상태 발행 직전 재확인
- [ ] 2사 기본 화면·3사 fixture·DS 별도 표에서 통화·범위·기간 안내 일치
- [ ] JavaScript 비활성화 상태에서도 KPI·표·설명·FAQ 표시
- [ ] 320 / 375 / 768 / 1024 / 1440px에서 표 이외 본문 가로 넘침 없음
- [ ] 키보드로 표 스크롤·출처·CTA 이동, 포커스 확인
- [ ] 숫자·배지·표 캡션·출처 링크·미공개 사유 확인
- [ ] intro 4단락·각 150자 이상·총 600자 이상, FAQ 9개·각 2문장 이상
- [ ] Title 50자 이내·Description 80~120자, canonical 하나·OG 파일 정상
- [ ] Article·FAQ·Breadcrumb JSON-LD가 화면 내용·실제 발행일과 일치
- [ ] 내부 링크 5개와 CTA 2개의 경로·base 처리·대상 최신성 확인
- [ ] 홈·리포트 허브 asset 노출, sitemap·SCSS 등록 확인
- [ ] `npm run check:all`, `npm run build` 성공, dist의 신규 HTML·OG 확인
- [ ] QUALITY_SCORE·DEPLOY_CHECKLIST 검수, 완료된 항목만 기록

### 현재 상태

설계 작성 당시에는 문서만 작성했으며, 이후 구현 요청에 따라 아래 구현·검증 기록을 추가했다. 기존 기획서의 상태는 기획 작성 시점 기록으로 보존한다.

## 11. 구현·검증 기록 (2026-10-08)

- 데이터·계산 유틸·Astro 리포트·SCSS 작성, 홈·허브·sitemap 등록 완료. 신규 OG만 Python 생성기로 생성했다.
- 현재·직전·전년동기 원자료, 마이크론 과거 분기 기간과 HBM3E 공식 제품 안내를 확인했다. 정확한 확정 발표 일정과 환율은 미확정 상태로 유지한다.
- `node scripts/check-samsung-micron-earnings.mjs`: 산식, 미공개/0/음수, 출처·범위 오류 차단, 3사 fixture, 버전·스냅샷 보존, SEO 조건 검증 통과.
- 신규 TS 데이터·유틸 대상 `tsc --noEmit --strict`: 오류 없음.
- `npm run check:mapping`: 누락 없음.
- `npm run build`: 성공, 신규 리포트를 포함한 정적 라우트 생성 확인. 샌드박스의 node_modules 접근 EPERM으로 동일 빌드를 샌드박스 밖에서 실행했다.
- `npm run check:all`: 전체 1,173개 파일에서 397개 오류·2개 경고·740개 힌트로 실패. 오류는 공통 SiteHeader·ToolTabs와 기존 데이터·페이지에 있으며 신규 리포트 파일 진단은 없었다. 전체 검사가 통과했다고 기록하지 않는다. 다른 페이지 오류 수정은 이번 범위에 포함하지 않았다.
- 빌드 결과 브라우저 확인: 320·375·768·1024·1440px에서 본문 가로 넘침 없음. 작은 화면의 표 내부 스크롤, FAQ 펼침, 출처 앵커, H1 1개, canonical 1개, FAQ 9개와 JSON-LD 일치 확인.
- 구현 조정: FAQ는 화면 모델에서 계산 결과를 포함해 생성한다. `SME_FAQ`에 숫자를 중복 저장하지 않는다. 비교기간 안내도 활성 레코드에서 생성하며 갱신 때 이전 분기 문구가 남지 않게 했다.
- 미실행: 커밋·push·배포·라이브 확인. 회사 발표 후 실제 3사 숫자 반영은 후속 갱신이다.
