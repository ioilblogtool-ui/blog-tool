# 광역단체장 후보 평균 재산 비교 리포트 2026 설계 문서

> 기획 원문: `docs/plan/202605/governor-mayor-candidate-assets-comparison-2026.md`
> 작성일: 2026-05-31
> 구현 기준: Claude/Codex가 이 문서를 보고 바로 페이지 구현에 착수할 수 있는 수준으로 고정

---

## 1. 문서 개요

### 1-1. 대상
- 기획 문서: `docs/plan/202605/governor-mayor-candidate-assets-comparison-2026.md`
- 구현 대상: `2026 광역단체장(시도지사) 후보 재산 비교 리포트`
- 참고 페이지: 기존 `/reports/` 하위 리포트 구조 동일하게 따름

### 1-2. 문서 역할
- 기획 문서를 현재 비교계산소 `/reports/` 구조에 맞게 실제 구현 직전 수준으로 재구성한 설계 문서다.
- 화면 구조, 데이터 스키마, 섹션 목적, 인터랙션, SEO, QA 기준을 고정한다.
- 이후 구현자는 이 문서를 기준으로 `src/data/`, `src/pages/reports/`, `public/scripts/`, `src/styles/` 작업을 진행한다.

### 1-3. 페이지 성격
- 계산기보다 `리포트형 비교 콘텐츠`
- 핵심 흐름: `KPI 요약 → 전체 후보 랭킹 테이블 → 정당별 평균 비교 → 지역별 분포 → 재산 구성 항목 분석 → FAQ → 연관 콘텐츠 CTA`
- 정렬 인터랙션 (재산 높은 순 / 낮은 순 / 지역별 / 정당별) 탑재
- 톤: 특정 후보 평가 없이 숫자 나열 중심. 선거법 고려해 편향 표현 배제

### 1-4. 권장 slug
- `governor-mayor-candidate-assets-comparison-2026`
- URL: `/reports/governor-mayor-candidate-assets-comparison-2026/`

### 1-5. 권장 파일 구조
- `src/data/governorCandidateAssets2026.ts`
- `src/pages/reports/governor-mayor-candidate-assets-comparison-2026.astro`
- `public/scripts/governor-mayor-candidate-assets-comparison-2026.js`
- `src/styles/scss/pages/_governor-mayor-candidate-assets-comparison-2026.scss`
- `public/og/reports/governor-mayor-candidate-assets-comparison-2026.png`

---

## 2. 현재 프로젝트 기준 정리

### 2-1. 리포트 공통 구조
현재 `/reports/` 콘텐츠는 아래 흐름을 따른다.
1. `CalculatorHero`
2. `InfoNotice`
3. 상단 KPI 요약 카드
4. 핵심 비교표 / 차트
5. 섹션별 상세 비교
6. 해설 / 분석 카드 보드
7. FAQ
8. 관련 계산기 / 리포트 CTA
9. `SeoContent`

### 2-2. 현재 구현 패턴
- 메타 등록: `src/data/reports.ts`
- 허브 노출: `src/pages/reports/index.astro`
- 페이지 데이터: `src/data/<report>.ts`
- 페이지 마크업: `src/pages/reports/<slug>.astro`
- 클라이언트 인터랙션: `public/scripts/<slug>.js`
- 페이지 전용 스타일: `src/styles/scss/pages/_<slug>.scss`
- 사이트맵: `public/sitemap.xml`

### 2-3. 이번 리포트 방향
- 이미지 없이 운영한다 (후보 인물 사진 저작권/선거법 이슈 회피)
- `정렬 토글 UI`가 핵심 인터랙션
- 데이터는 중앙선관위 공개 신고 자료만 사용, 추정·가공값 없음
- 차트: Chart.js 가로 막대 (정당별 평균, 지역별 분포) 2개 운영
- 면책·편집 원칙 엄수: 특정 후보 평가·비방·지지 표현 완전 배제

---

## 3. 구현 범위

### 3-1. MVP 범위
- 광역단체장 주요 후보 재산 전체 테이블 (정렬 인터랙션 포함)
- 상단 KPI 요약 카드 4종
- 정당별 평균 재산 비교 (Chart.js 가로 막대)
- 지역별 재산 분포 시각화
- 재산 구성 항목 분석 (부동산 / 금융 / 채무 카드)
- FAQ 5개
- 내부 링크 CTA

### 3-2. MVP 제외 범위
- 지역 선택 → 후보 상세 드릴다운 (2차 확장)
- 후보별 연도별 재산 변화 추이 (2차 확장)
- 개인 재산 계산기 연동 (2차 확장)

---

## 4. 페이지 목적

- 중앙선관위 공개 재산 신고 데이터를 유권자가 한 화면에서 비교할 수 있게 제공한다.
- 선거 시즌 검색 트래픽(시도지사 후보 재산, 광역단체장 재산)을 집중 흡수한다.
- 리포트 체류 후 연관 콘텐츠(공무원 급여, 고위공직자 재산 리포트)로 자연스럽게 이어지게 한다.

---

## 5. 핵심 사용자 시나리오

### 5-1. 지방선거 관심 유권자
- `서울시장 후보 재산`, `경기도지사 후보 재산` 등 지역명+후보 재산 키워드로 유입
- 자신이 사는 지역 후보가 얼마나 가졌는지 먼저 확인하고 싶어한다
- 랭킹 테이블에서 지역 필터를 쓰거나 가나다순 정렬로 원하는 지역을 찾는다

### 5-2. 정치·데이터 관심 사용자
- `광역단체장 후보 재산 순위` 키워드로 유입
- 전체 테이블을 재산 높은 순으로 정렬해 스캔
- 정당별 평균 비교 섹션에서 숫자 차이를 확인하고 공유한다

### 5-3. 언론인·리서처
- 빠른 집계 수치 확인 필요
- KPI 카드(전체 평균, 최고·최저)와 정당별 평균 섹션을 직접 참조
- 데이터 출처(선관위 신고 기준일)를 확인한다

---

## 6. 데이터 정의

### 6-1. 후보 데이터 항목

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | `string` | 슬러그형 식별자 |
| `name` | `string` | 후보명 |
| `party` | `string` | 소속 정당 |
| `partyCode` | `PartyCode` | 정당 코드 (정렬·필터용) |
| `region` | `string` | 출마 지역 (예: 서울특별시) |
| `regionShort` | `string` | 약식 지역명 (예: 서울) |
| `regionCode` | `string` | 지역 코드 (정렬용, 수도권 우선) |
| `totalAssets` | `number` | 신고 재산 총액 (만 원) |
| `realEstate` | `number \| null` | 부동산 (만 원) |
| `financialAssets` | `number \| null` | 금융자산 (만 원) |
| `debt` | `number \| null` | 채무 (만 원) |
| `netAssets` | `number \| null` | 순재산 = 총재산 - 채무 (만 원, 계산값) |
| `dataSource` | `string` | 데이터 출처 문구 (선관위 공개 기준) |
| `declaredDate` | `string` | 신고 기준일 |
| `note` | `string` | 비고 (빈칸 허용) |

### 6-2. 정당 코드 (PartyCode)

```ts
export type PartyCode = 'ppp' | 'dp' | 'rebuilding' | 'etc';
// ppp: 국민의힘, dp: 더불어민주당, rebuilding: 조국혁신당, etc: 기타/무소속
```

### 6-3. 정렬 방식 (SortMode)

```ts
export type SortMode =
  | 'assetsDesc'    // 재산 높은 순 (기본)
  | 'assetsAsc'     // 재산 낮은 순
  | 'regionAsc'     // 지역별 (수도권 → 광역시 → 도 순)
  | 'partyAsc';     // 정당별 (국민의힘 → 민주당 → 기타 순)
```

### 6-4. 집계 데이터

```ts
export interface PartyAverage {
  partyCode: PartyCode;
  partyLabel: string;
  averageAssets: number;   // 만 원
  candidateCount: number;
}

export interface RegionSummary {
  region: string;
  regionShort: string;
  candidates: CandidateRecord[];
  maxAssets: number;
  minAssets: number;
}
```

---

## 7. 데이터 구조 (`src/data/governorCandidateAssets2026.ts`)

### 7-1. 타입 전체 정의

```ts
export type PartyCode = 'ppp' | 'dp' | 'rebuilding' | 'etc';
export type SortMode = 'assetsDesc' | 'assetsAsc' | 'regionAsc' | 'partyAsc';

export interface ReportMeta {
  seoTitle: string;
  seoDescription: string;
  ogTitle: string;
  ogDescription: string;
  dataSourceLabel: string;   // "중앙선거관리위원회 재산 신고 공개 자료"
  declaredDateRange: string; // "2026년 X월 X일 기준"
  updatedAt: string;
  caution: string;
}

export interface KpiCard {
  label: string;
  value: string;
  sub: string;
  tone?: 'neutral' | 'accent' | 'warn';
}

export interface CandidateRecord {
  id: string;
  name: string;
  party: string;
  partyCode: PartyCode;
  region: string;
  regionShort: string;
  regionCode: string;
  totalAssets: number;        // 만 원
  realEstate: number | null;  // 만 원
  financialAssets: number | null;
  debt: number | null;
  netAssets: number | null;
  dataSource: string;
  declaredDate: string;
  note: string;
}

export interface PartyAverage {
  partyCode: PartyCode;
  partyLabel: string;
  averageAssets: number;
  candidateCount: number;
  color: string;              // Chart.js용 색상 hex
}

export interface AssetCompositionCard {
  title: string;
  description: string;
  icon?: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface RelatedLink {
  label: string;
  href: string;
  description: string;
}

export interface GovernorAssetsReportData {
  meta: ReportMeta;
  kpis: KpiCard[];
  candidates: CandidateRecord[];
  partyAverages: PartyAverage[];
  assetCompositionCards: AssetCompositionCard[];
  faq: FaqItem[];
  relatedLinks: RelatedLink[];
}
```

### 7-2. 데이터 설계 원칙
- 모든 수치는 중앙선관위 공개 신고 자료에서만 추출한다. 추정·가공값 없음.
- 재산 세부 항목(`realEstate`, `financialAssets`, `debt`)이 공개되지 않은 경우 `null` 처리, UI에서 `-` 표시.
- `netAssets`는 `totalAssets - (debt ?? 0)` 계산값이며, 참고 목적임을 명시.
- `declaredDate`는 선관위 신고 마감일 또는 공개 기준일로 고정 입력.
- 후보 탈락·사퇴 시 `note` 필드에 사유 기재, 집계에서 제외 여부 명시.

### 7-3. 초기 데이터 범위
- 후보 레코드: 17개 시도 × 주요 정당 후보 (국민의힘·민주당 각 1명 이상, 기타 포함)
- 실제 후보 수 확정 시 선관위 공개 자료 기준으로 입력
- 정당별 평균 집계: 4개 파티코드
- FAQ: 5개
- KPI 카드: 4종
- 재산 구성 항목 카드: 3종 (부동산 / 금융 / 채무 구조 해설)

---

## 8. 페이지 구조

### 8-1. 전체 IA
1. `CalculatorHero`
2. `InfoNotice` (면책 + 데이터 기준 안내)
3. 상단 KPI 요약 카드 (4종)
4. 전체 후보 랭킹 테이블 (정렬 토글 포함)
5. 정당별 평균 재산 비교 (Chart.js 가로 막대)
6. 지역별 재산 분포 (CSS bar row 우선)
7. 재산 구성 항목 해설 카드 (3종)
8. FAQ (5개)
9. 관련 계산기 / 리포트 CTA
10. `SeoContent`

### 8-2. 모바일 우선 순서
- Hero
- InfoNotice (기준 안내 2~3줄)
- KPI 카드 (2열)
- 정렬 탭
- 랭킹 테이블 (가로 스크롤 허용)
- 정당별 평균 차트 (가로 막대)
- 지역별 분포 (세로 스택 bar row)
- 재산 구성 카드 (세로 스택)
- FAQ
- CTA
- SEO

### 8-3. PC 레이아웃
- KPI 카드: 4열 가로
- 랭킹 테이블: 전체폭
- 정당별 차트 + 지역 분포: 좌우 2열 또는 독립 섹션
- 재산 구성 카드: 3열 그리드
- CTA: 3열 카드

---

## 9. 섹션별 구현 상세

### 9-1. Hero
- eyebrow: `2026 지방선거 데이터 리포트`
- H1: `광역단체장 후보 재산 비교 2026`
- 서브카피: `시도지사 후보 재산을 한눈에 비교합니다`
- 설명:
  - 중앙선거관리위원회 후보 재산 신고 공개 자료를 기반으로 정리한 참고용 비교 리포트입니다.
  - 정당별·지역별 평균과 전체 후보 순위를 확인하세요.

### 9-2. InfoNotice
- 필수 면책 문구:
  - 본 리포트는 중앙선거관리위원회 공개 재산 신고 자료를 기준으로 정리했습니다.
  - 신고 재산은 실제 재산과 차이가 있을 수 있습니다.
  - 특정 후보를 지지하거나 비방하는 목적으로 사용할 수 없습니다.
  - 데이터 기준일: 선관위 공개 일자 명시 (변수로 처리)

### 9-3. 상단 KPI 요약 카드 (4종)

| 카드 | 값 | 설명 |
|------|-----|------|
| 후보 전체 평균 재산 | N억 원 | 전체 후보 단순 평균 |
| 최고 재산 후보 | 후보명 + N억 원 | 재산 총액 1위 |
| 최저 재산 후보 | 후보명 + N억 원 | 재산 총액 최하위 |
| 정당별 평균 차이 | N억 원 차이 | 1위 정당 평균 - 2위 정당 평균 |

> KPI 값은 `governorCandidateAssets2026.ts`에서 집계 계산 후 하드코딩 또는 빌드타임 계산으로 주입

### 9-4. 전체 후보 랭킹 테이블

#### 정렬 토글 UI
- 탭 4종:
  - `재산 높은 순` (기본)
  - `재산 낮은 순`
  - `지역별`
  - `정당별`
- JS로 정렬 전환 처리

#### 표 컬럼 구성

| 컬럼 | 표시 방식 |
|------|----------|
| 순위 | 1~N 숫자 (정렬에 따라 변동) |
| 후보명 | 이름 문자열 |
| 소속 정당 | 정당명 + 색상 배지 |
| 출마 지역 | 시도명 |
| 신고 재산 총액 | N억 N천만 원 |
| 부동산 | N억 원 / `-` |
| 금융자산 | N억 원 / `-` |
| 채무 | N억 원 / `-` |
| 비고 | note 텍스트 (있으면 표시) |

#### 표 UX 원칙
- 모바일에서 가로 스크롤 허용 (min-width: 720px)
- 후보명·지역 열은 좌측 sticky 검토
- 정당 배지: 국민의힘(파란 계열), 민주당(파란 계열 → 선거 공식 색상 지양, 중립 회색 계열 사용), 기타(회색)
- 재산 0 이하(채무 > 자산) 케이스는 빨간 배지 처리

### 9-5. 정당별 평균 재산 비교

- 섹션 제목: `정당별 후보 평균 재산`
- 설명 1문장: 각 정당 광역단체장 후보의 평균 재산을 비교합니다.
- Chart.js 가로 막대 차트 1개
  - X축: 평균 재산 (억 원)
  - Y축: 정당명
  - 색상: 중립 팔레트 (파랑·초록·보라·회색 계열, 정당 공식색 사용 지양)
- 차트 아래 보조 텍스트: "단순 평균이며, 후보 수에 따라 변동될 수 있습니다."

### 9-6. 지역별 재산 분포

- 섹션 제목: `지역별 최고 재산 후보 비교`
- CSS bar row 방식 (Chart.js 미사용 우선)
- 17개 시도 순서로 나열
- 각 행: 지역명 / 후보명 / 정당 / 재산 총액 / 가로 바 (비례 너비)
- 수도권(서울·경기·인천) 상단 배치
- 모바일: 세로 스택, 가로 바 100% 기준 상대적 너비

### 9-7. 재산 구성 항목 해설 카드 (3종)

- 섹션 제목: `재산 신고 항목 이해하기`
- 설명: 재산 신고 항목별 의미를 간단히 정리했습니다.
- 카드 3종:
  1. **부동산** — 토지·건물·아파트 등 부동산 신고액. 공시지가 기준
  2. **금융자산** — 예금·주식·채권·보험 등 금융 자산 합계
  3. **채무** — 금융 대출·보증 채무 합계. 재산 총액에서 차감하면 순재산

### 9-8. FAQ

- 5개 구성 (항상 visible, 접기/펼치기 없이 노출):
  1. 재산 신고는 어디서 확인하나요?
  2. 신고 재산과 실제 재산이 다를 수 있나요?
  3. 정당별 평균 재산 비교는 어떤 의미가 있나요?
  4. 재산이 많은 후보가 더 좋은 후보인가요?
  5. 데이터는 언제 기준인가요?

### 9-9. 관련 콘텐츠 CTA

- 계산기 CTA 2개:
  - `공무원 급여 비교 2026` → `/tools/public-servant-salary-2026/`
  - `연봉 실수령 계산기` → `/tools/salary-calculator/` (있으면)
- 리포트 CTA 1개:
  - `다른 비교 리포트 보기` → `/reports/`

---

## 10. 인터랙션 설계 (`public/scripts/governor-mayor-candidate-assets-comparison-2026.js`)

### 10-1. 필요한 인터랙션
- 랭킹 테이블 정렬 전환 (재산 높은 순 / 낮은 순 / 지역별 / 정당별)
- 정렬 탭 active 상태 전환
- Chart.js 정당별 평균 가로 막대 차트 렌더링

### 10-2. 스크립트 책임 범위
- `script[type="application/json"]`으로 후보 데이터 주입
- 정렬 모드에 따라 테이블 행 재정렬
- Chart.js 차트 초기화 (정당별 평균 막대)
- DOM 업데이트만 담당
- URL 파라미터 동기화는 MVP 이후 선택

### 10-3. 구현 단순화 원칙
- 데이터는 페이지 내 JSON으로 전달, 외부 fetch 없음
- 정렬은 단순 배열 sort 후 tbody 재렌더링
- null 값은 정렬 시 최하단 배치
- 지역별 분포는 CSS bar row로 구현 (JS 불필요)

---

## 11. 스타일 가이드 (`_governor-mayor-candidate-assets-comparison-2026.scss`)

### 11-1. CSS prefix
- `gmca-` 사용
  - Governor Mayor Candidate Assets

### 11-2. 톤 앤 매너
- 정치 콘텐츠 특성상 **중립 톤**을 엄격히 유지한다.
- 색상 방향:
  - 정당 배지: 중립 회색 팔레트 사용 (특정 정당 연상 색 사용 지양)
  - 재산 규모: 높은 값에 강한 포인트 주지 않음, 중립 차트 색
  - 채무 > 자산 케이스: 딤 레드 (경고 아닌 정보용)
- 전반적 스타일: 공공 데이터 리포트 느낌, 뉴스 기사보다 명확·깔끔

### 11-3. 반응형 포인트
- 768px 이하:
  - KPI 카드 2열
  - 랭킹 테이블 가로 스크롤 (min-width: 720px)
  - 후보명 + 지역 열 좌측 sticky 적용
  - 정당별 차트 전체폭
  - 지역별 분포 1열
  - 재산 구성 카드 1열
- 1024px 이상:
  - KPI 4열
  - 재산 구성 카드 3열
  - CTA 3열

---

## 12. SEO 설계

### 12-1. 메타 초안
- `seoTitle`: `광역단체장 후보 재산 비교 2026 — 시도지사 후보 재산 순위 | 비교계산소`
- `seoDescription`: `2026 지방선거 광역단체장(시도지사) 후보 재산을 한눈에 비교합니다. 정당별·지역별 평균 재산과 전체 후보 순위를 중앙선거관리위원회 공개 자료 기준으로 정리했습니다.`

### 12-2. 메인 키워드
- 시도지사 후보 재산
- 광역단체장 후보 재산
- 2026 지방선거 후보 재산
- 광역단체장 재산 비교

### 12-3. 서브 키워드
- 서울시장 후보 재산
- 경기도지사 후보 재산
- 정당별 후보 재산 평균
- 공직후보 재산 신고

### 12-4. 롱테일 키워드
- [후보명] 재산 (후보명이 테이블에 명시되면 자동 포함)
- 지방선거 후보 재산 공개
- 선관위 후보 재산 신고

---

## 13. 구현 체크리스트

### 13-1. 데이터
- [ ] `src/data/governorCandidateAssets2026.ts` 생성
- [ ] 선관위 공개 자료 기준 후보 레코드 입력
- [ ] 정당별 평균 집계 데이터 입력 (`partyAverages`)
- [ ] KPI 카드 4종 값 확정
- [ ] 재산 구성 항목 해설 카드 3종 입력
- [ ] FAQ 5개 입력
- [ ] `meta.declaredDate` 기준일 확정 입력

### 13-2. 페이지
- [ ] `src/pages/reports/governor-mayor-candidate-assets-comparison-2026.astro` 생성
- [ ] `CalculatorHero`, `InfoNotice`, `SeoContent` 공통 컴포넌트 적용
- [ ] KPI 카드 4종 마크업
- [ ] 랭킹 테이블 마크업 (정렬 탭 + thead + tbody)
- [ ] 정당별 평균 차트 canvas 마크업
- [ ] 지역별 분포 CSS bar row 마크업
- [ ] 재산 구성 카드 3종 마크업
- [ ] FAQ 마크업 (항상 visible)
- [ ] CTA 마크업

### 13-3. 스크립트
- [ ] `public/scripts/governor-mayor-candidate-assets-comparison-2026.js` 생성
- [ ] 정렬 탭 이벤트 처리
- [ ] 테이블 행 재정렬 로직 (null 최하단 처리)
- [ ] Chart.js 정당별 평균 가로 막대 초기화
- [ ] JS 미동작 시에도 기본 테이블(재산 높은 순) 읽기 가능 유지

### 13-4. 스타일
- [ ] `_governor-mayor-candidate-assets-comparison-2026.scss` 생성
- [ ] `src/styles/app.scss`에 import 추가
- [ ] 모바일 우선 반응형 적용
- [ ] 테이블 가로 스크롤 처리
- [ ] 정당 배지 중립 색상 적용

### 13-5. 사이트 반영
- [ ] `src/data/reports.ts` 등록
- [ ] `src/pages/reports/index.astro` 허브 노출 확인
- [ ] `public/sitemap.xml` 추가
- [ ] `npm run build` 확인

---

## 14. QA 기준

### 14-1. 콘텐츠 QA
- KPI 카드 값이 테이블 데이터와 모순되지 않는가
- InfoNotice 면책 문구가 명확하게 노출되는가
- 특정 후보 평가·비방·지지 표현이 없는가
- 데이터 기준일(선관위 신고일)이 명시되어 있는가
- 정당 배지가 특정 정당 연상 색상을 사용하지 않는가

### 14-2. 데이터 QA
- `realEstate: null`인 후보에서 테이블 렌더링 오류 없는가 (`-` 표시 확인)
- `debt > totalAssets`인 케이스 처리 확인
- 정렬 시 null 값이 최하단에 배치되는가
- 정당별 평균 집계값이 후보 레코드 합산과 일치하는가

### 14-3. UI QA
- 모바일에서 테이블이 가로 스크롤로 안전하게 표시되는가
- 정렬 탭 active 상태가 명확하게 구분되는가
- KPI 카드가 2열로 자연스럽게 쌓이는가
- 지역별 분포 bar row가 모바일에서 깨지지 않는가

### 14-4. 인터랙션 QA
- 정렬 전환 시 테이블 렌더링이 정상 동작하는가
- Chart.js 차트가 모바일/PC 모두 정상 렌더링되는가
- JS 없이도 기본 테이블이 정상 노출되는가
- FAQ가 항상 visible 상태로 표시되는가

---

## 15. 개발 메모

- 이 리포트는 이미지 없이 표/차트 중심으로 구성하므로 저작권 및 선거법 이슈가 없다.
- 정당 색상은 특정 정당 연상을 피하기 위해 공식 정당 색(빨강·파랑 계열) 사용을 지양하고 중립 팔레트(회색·인디고·슬레이트 등)를 사용한다.
- 선관위 데이터 입력 시 수치 단위를 **만 원** 기준으로 통일하고, 화면 표시는 **억 원** 단위로 포맷한다.
- 후보 탈락·사퇴 발생 시 `note` 처리 후 집계 제외 여부를 명확히 한다.
- 구현 시작 순서:
  1. 선관위 공개 자료에서 후보 데이터 수집·정제
  2. `src/data/governorCandidateAssets2026.ts` 데이터 확정
  3. `.astro` 페이지 마크업 조립
  4. 정렬 스크립트 + Chart.js 구현
  5. 스타일 적용
  6. 사이트맵 / 리포트 허브 등록
- 선거 이후에는 URL 유지, `meta.updatedAt`만 업데이트해 아카이브 콘텐츠로 운영한다.
