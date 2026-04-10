# 대한민국 영화 손익 비교 리포트 설계 문서

> 기획 원문: `docs/plan/202604/korean-movie-break-even-profit.md`
> 작성일: 2026-04-08
> 구현 기준: Claude/Codex가 이 문서를 보고 바로 페이지 구현에 착수할 수 있는 수준으로 고정

---

## 1. 문서 개요

### 1-1. 대상
- 기획 문서: `docs/plan/202604/korean-movie-break-even-profit.md`
- 구현 대상: `대한민국 영화 손익 비교 리포트 — 많이 본 영화와 많이 번 영화는 다르다`
- 참고 페이지: 기존 `/reports/` 하위 리포트 구조 동일하게 따름

### 1-2. 문서 역할
- 기획 문서를 현재 비교계산소 `/reports/` 구조에 맞게 실제 구현 직전 수준으로 재구성한 설계 문서다.
- 화면 구조, 데이터 스키마, 섹션 목적, 인터랙션, SEO, QA 기준을 고정한다.
- 이후 구현자는 이 문서를 기준으로 `src/data/`, `src/pages/reports/`, `public/scripts/`, `src/styles/` 작업을 진행한다.

### 1-3. 페이지 성격
- 계산기보다 `리포트형 비교 콘텐츠`
- 핵심 흐름: `관점 제시 → 대표 영화 TOP 비교표 → 저예산 대박작 → 천만 영화의 실상 → 손익분기점 구조 해설 → FAQ → 연관 계산기 연결`
- 정렬 인터랙션(흥행순 / 제작비순 / 효율순) 탑재
- 톤은 흥행 기사식 나열보다 `숫자로 보는 영화 산업 비교`에 집중

### 1-4. 권장 slug
- `korean-movie-break-even-profit`
- URL: `/reports/korean-movie-break-even-profit/`

### 1-5. 권장 파일 구조
- `src/data/koreanMovieBreakEvenProfit.ts`
- `src/pages/reports/korean-movie-break-even-profit.astro`
- `public/scripts/korean-movie-break-even-profit.js`
- `src/styles/scss/pages/_korean-movie-break-even-profit.scss`
- `public/og/reports/korean-movie-break-even-profit.png`

---

## 2. 현재 프로젝트 기준 정리

### 2-1. 리포트 공통 구조
현재 `/reports/` 콘텐츠는 아래 흐름을 따른다.
1. `CalculatorHero`
2. `InfoNotice`
3. 상단 요약 카드 (KPI)
4. 핵심 비교표 / 차트
5. 섹션별 상세 비교
6. 해설 카드 보드
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
- 이미지 없이 운영한다 (인물 사진 권리 문제 없음, 표/카드 중심)
- `정렬 토글 UI`가 이 리포트의 핵심 인터랙션이다
- 데이터는 `공개 수치만` 사용하고, 불확실한 수치는 `추정` 라벨 필수
- 차트는 `Chart.js 가로 막대`를 사용하되 선택적으로 제한한다 (CSS 바 우선 검토)

---

## 3. 구현 범위

### 3-1. MVP 범위
- 대한민국 대표 흥행 영화 15편 내외 비교 데이터 고정
- 핵심 비교표 1종 (정렬 인터랙션 포함)
- 상단 KPI 요약 카드 4종
- 저예산 대박작 섹션 (카드 4종 내외)
- 천만 영화 포인트 섹션
- 손익분기점 구조 해설 섹션
- FAQ
- 내부 링크 CTA

### 3-2. MVP 제외 범위
- 실시간 박스오피스 API 연동
- 영화 2개 직접 선택 비교 UI (2차 확장)
- 연도별/장르별 필터 (2차 확장)
- 사용자 즐겨찾기/저장 기능

---

## 4. 페이지 목적

- `관객 수 = 흥행 = 수익`이라는 통념을 깨고, 제작비 대비 수익 구조로 한국 영화를 다시 보게 만든다.
- 대표 영화들의 손익 구조를 한 번에 비교할 수 있는 유일한 비교 리포트로 포지셔닝한다.
- 리포트 체류 후 연관 계산기(FIRE, 투자 수익, 연봉 비교)로 자연스럽게 이어지게 한다.

---

## 5. 핵심 사용자 시나리오

### 5-1. 영화 팬
- `영화 손익분기점`, `천만 영화 수익`, `한국 영화 얼마나 벌었나` 검색 후 유입
- 좋아하는 영화가 실제로 얼마나 남겼는지 확인하고 싶어한다
- 흥행 순위 기준 표를 먼저 읽고, 이후 효율 기준으로 정렬해 비교한다

### 5-2. 데이터·숫자 선호 사용자
- 제작비 대비 ROI, 저예산 대박작 사례에 관심 많음
- 비교표 전체를 스캔하면서 의외의 수치에 반응
- 커뮤니티/SNS 공유 가능한 비교 포인트를 찾는다

### 5-3. 일반 검색 유입 사용자
- `손익분기점이 왜 기사마다 다르게 나오나`에 의문을 가지고 유입
- 핵심 FAQ와 해설 섹션 위주로 빠르게 읽는다

---

## 6. 데이터 정의

### 6-1. 영화 데이터 항목
각 영화 레코드에 포함할 필드:

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | `string` | 슬러그형 식별자 |
| `title` | `string` | 영화명 |
| `year` | `number` | 개봉연도 |
| `audienceCount` | `number` | 누적 관객 수 (만 명) |
| `boxOfficeRevenue` | `number` | 박스오피스 매출 (억 원) |
| `productionCost` | `number \| null` | 제작비 (억 원, 공개치만) |
| `breakEvenPoint` | `number \| null` | 손익분기점 관객 수 (만 명) |
| `breakEvenSource` | `string` | 손익분기점 출처 문구 |
| `profitResult` | `'hit' \| 'breakeven' \| 'loss'` | 흥행 결과 |
| `profitLabel` | `string` | 수익성 라벨 (대박 / 본전권 / 적자 / 추정) |
| `roi` | `number \| null` | 추정 ROI (제작비 대비, %) |
| `isEstimate` | `boolean` | 수치 추정 여부 |
| `badges` | `string[]` | 천만 / 저예산 / 고효율 / 대작 등 |
| `comment` | `string` | 한 줄 코멘트 |

### 6-2. 정렬 방식
- `audienceDesc`: 관객 수 내림차순 (기본)
- `productionCostAsc`: 제작비 오름차순 (저예산 순)
- `roiDesc`: 추정 ROI 내림차순 (효율순)

### 6-3. 영화 대상 선정 기준
- 한국 영화 역대 흥행 TOP 20 내외 기준 선정
- 제작비 또는 손익분기점 공개 자료가 존재하는 작품 우선
- 저예산 대박작은 별도 섹션으로 구분 (제작비 30억 이하 기준 검토)
- 필수 포함 후보: 명량, 극한직업, 신과함께, 국제시장, 범죄도시, 왕의 남자, 괴물, 오징어게임 등

---

## 7. 데이터 구조 (`src/data/koreanMovieBreakEvenProfit.ts`)

### 7-1. 타입 정의

```ts
export type ProfitResult = 'hit' | 'breakeven' | 'loss';
export type SortMode = 'audienceDesc' | 'productionCostAsc' | 'roiDesc';

export interface ReportMeta {
  seoTitle: string;
  seoDescription: string;
  ogTitle: string;
  ogDescription: string;
  updatedAt: string;
  caution: string;
}

export interface KpiCard {
  label: string;
  value: string;
  sub: string;
  tone?: 'neutral' | 'accent' | 'warn';
}

export interface MovieRecord {
  id: string;
  title: string;
  year: number;
  audienceCount: number;        // 만 명
  boxOfficeRevenue: number;     // 억 원
  productionCost: number | null; // 억 원
  breakEvenPoint: number | null; // 만 명
  breakEvenSource: string;
  profitResult: ProfitResult;
  profitLabel: string;
  roi: number | null;           // %
  isEstimate: boolean;
  badges: string[];
  comment: string;
}

export interface LowBudgetCard {
  title: string;
  year: number;
  productionCost: number;       // 억 원
  audienceCount: number;        // 만 명
  profitLabel: string;
  highlight: string;
}

export interface BreakEvenFactorCard {
  title: string;
  description: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface RelatedLink {
  label: string;
  href: string;
}

export interface KoreanMovieBreakEvenReportData {
  meta: ReportMeta;
  kpis: KpiCard[];
  movies: MovieRecord[];
  lowBudgetCards: LowBudgetCard[];
  breakEvenFactors: BreakEvenFactorCard[];
  faq: FaqItem[];
  relatedLinks: RelatedLink[];
}
```

### 7-2. 데이터 설계 원칙
- 수치는 실시간 호출이 아니라 고정 데이터로 보관한다.
- 공개치가 없는 제작비/손익분기점은 `null`로 두고 표에서 `-` 표시한다.
- `isEstimate: true`인 경우 UI에서 `추정` 라벨을 반드시 붙인다.
- 출처가 다른 손익분기점은 `breakEvenSource`에 출처 문구를 남긴다.
- ROI는 단순 계산값이 아니라 구조 이해용 참고치임을 명시한다.

### 7-3. 초기 데이터 범위
- 영화 레코드: 15편 내외
- 저예산 대박작 카드: 4개 내외
- 손익분기점 요인 카드: 5개
- FAQ: 5개

---

## 8. 페이지 구조

### 8-1. 전체 IA
1. `CalculatorHero`
2. `InfoNotice` (면책 문구)
3. 상단 KPI 요약 카드
4. 핵심 비교표 (정렬 토글 UI 포함)
5. 저예산 대박작 섹션
6. 천만 영화인데 의외의 포인트 섹션
7. 영화 손익분기점이 왜 매번 다를까 해설 카드 보드
8. FAQ
9. 관련 계산기 / 리포트 CTA
10. `SeoContent`

### 8-2. 모바일 우선 순서
- Hero
- 기준 안내 (InfoNotice)
- KPI 카드 (2열)
- 정렬 탭
- 비교표 (가로 스크롤 허용)
- 저예산 대박작 카드 (세로 스택)
- 천만 포인트 섹션
- 해설 카드
- FAQ
- CTA
- SEO

### 8-3. PC 레이아웃
- KPI 카드: 4열 가로
- 비교표: 전체폭, 열 고정 너비 유지
- 저예산 카드: 2열 그리드
- 해설 카드: 2열 또는 3열
- CTA: 3열 카드

---

## 9. 섹션별 구현 상세

### 9-1. Hero
- eyebrow: `한국 영화 손익 리포트`
- H1: `대한민국 영화 손익 비교 리포트`
- 서브카피: `많이 본 영화와 많이 번 영화는 다를 수 있습니다`
- 설명:
  - 제작비, 손익분기점, 실제 관객 수를 비교하면 "흥행작"과 "수익률 좋은 영화"가 다를 수 있다는 점이 보입니다.
  - 저예산 대박작부터 천만 영화까지 숫자로 정리했습니다.

### 9-2. InfoNotice
- 필수 면책 문구:
  - 본 리포트는 공개된 박스오피스, 제작비, 기사 및 인터뷰 기준 자료를 바탕으로 정리한 참고용 비교 콘텐츠입니다.
  - 실제 정산 구조, 투자 계약, 부가판권 수익, 인센티브 지급 내역은 작품별로 다를 수 있습니다.
  - `추정` 라벨이 붙은 수치는 공개 기사 기반 추정값입니다.
  - 업데이트일 명시 (KOBIS 기준 연도)

### 9-3. 상단 KPI 요약 카드 (4종)
| 카드 | 값 | 설명 |
|------|-----|------|
| 최고 흥행 영화 | 관객 수 최대 영화명 + 관객 수 | KOBIS 기준 |
| 추정 최고 효율 | 제작비 대비 ROI가 가장 높은 영화 | 공개치 기준 추정 |
| 저예산 대박작 | 대표 저예산 대박 작품 | 제작비 대비 성과 |
| 천만인데 의외 | 천만이지만 수익성 포인트가 있는 사례 | 한 줄 코멘트 |

### 9-4. 핵심 비교표

#### 정렬 토글 UI
- 탭 3종:
  - `관객 수순` (기본)
  - `제작비순` (낮은 제작비 우선)
  - `추정 효율순` (ROI 높은 순)
- JS로 정렬 전환 처리

#### 표 컬럼 구성
| 컬럼 | 표시 방식 |
|------|----------|
| 영화명 | 문자열 + 배지 |
| 개봉연도 | 4자리 연도 |
| 관객 수 | N만 명 |
| 제작비 | N억 원 / `-` |
| 손익분기점 | N만 명 / `-` |
| 흥행 결과 | 달성 / 본전권 / 미달 색상 배지 |
| 추정 수익성 | 대박 / 흑자 / 본전권 / 추정 라벨 |
| 코멘트 | 한 줄 문장 |

#### 표 UX 원칙
- 모바일에서 가로 스크롤 허용
- 영화명 열은 좌측 고정(sticky) 검토
- `추정` 라벨은 다른 색으로 구분
- 손익분기점 돌파 여부를 색상으로 직관적으로 표시 (초록 / 노랑 / 회색)

### 9-5. 저예산 대박작 섹션
- 섹션 제목: `적은 돈으로 더 많이 남긴 영화`
- 설명 1문장: 관객 수보다 제작비 대비 효율이 훨씬 높은 작품들입니다.
- 카드 4종 구성
  - 영화명
  - 개봉연도
  - 제작비 (N억 원)
  - 관객 수 (N만 명)
  - 수익성 라벨
  - 핵심 포인트 문장 1개

### 9-6. 천만 영화인데 의외의 포인트 섹션
- 섹션 제목: `천만 영화라고 모두 수익률이 높은 건 아닙니다`
- 설명: 제작비가 높으면 천만 관객도 수익성이 기대보다 낮을 수 있습니다.
- 구성:
  - 해설 텍스트 블록
  - 비교 예시 2~3편 (제작비 높은 천만 vs 제작비 낮은 흥행작)
  - 핵심 문장 1개 (강조 카드형)

### 9-7. 손익분기점 해설 카드 보드
- 섹션 제목: `영화 손익분기점은 왜 기사마다 다르게 보일까`
- 해설 카드 5종:
  1. 제작비 범위 차이 (순제작비 / 총제작비)
  2. P&A 비용 포함 여부 (홍보·마케팅비)
  3. 배급·투자 정산 구조
  4. 부가판권(OTT·해외·DVD) 포함 여부
  5. 기사·인터뷰 시점별 출처 차이
- 각 카드: 제목 + 2~3문장 설명

### 9-8. FAQ
- 5개 구성:
  1. 영화 손익분기점은 왜 기사마다 다르게 나오나요?
  2. 천만 영화면 무조건 대박인가요?
  3. 실제 수익은 정확히 알 수 있나요?
  4. 저예산 영화가 수익률이 더 높은 이유가 있나요?
  5. 제작비 정보는 어디서 확인하나요?
- FAQ는 항상 visible 유지 (접기/펼치기 없이 노출)

### 9-9. 관련 계산기 / 리포트 CTA
- 계산기 CTA 2~3개:
  - `연봉 실수령 계산기` — "큰 숫자가 체감 안 된다면 내 연봉 기준으로도 비교해보세요"
  - `적립식 투자 계산기` — "제작비 대비 수익처럼 투자 수익도 비교해보세요"
  - `FIRE 계산기` — "수익률 개념이 궁금했다면 장기 투자 수익도 계산해보세요"
- 리포트 CTA 1개:
  - `다른 비교 리포트 보기`

---

## 10. 인터랙션 설계 (`public/scripts/korean-movie-break-even-profit.js`)

### 10-1. 필요한 인터랙션
- 비교표 정렬 전환 (관객 수순 / 제작비순 / 효율순)
- 정렬 탭 active 상태 전환
- (선택) 배지 필터: 천만 / 저예산 / 고효율

### 10-2. 스크립트 책임 범위
- `script[type="application/json"]`으로 영화 데이터 주입
- 정렬 모드에 따라 테이블 행 재정렬
- DOM 업데이트만 담당
- URL 파라미터 동기화는 MVP 이후 선택 구현

### 10-3. 구현 단순화 원칙
- 데이터는 페이지 내 JSON으로 전달, 외부 fetch 없음
- 정렬은 단순 배열 sort 후 tbody 재렌더링
- 차트는 MVP에서 CSS 가로 바 우선 검토, 필요 시 Chart.js 가로 막대 1개만 도입

---

## 11. 스타일 가이드 (`_korean-movie-break-even-profit.scss`)

### 11-1. CSS prefix
- `kmbep-` 사용
  - Korean Movie Break Even Profit

### 11-2. 톤 앤 매너
- 영화 산업 특성상 약간 다이나믹한 느낌을 허용하되, 사이트 기본 톤 유지
- 색상 방향:
  - 흥행 대박: 골드/앰버 포인트
  - 손익분기점 달성: 그린 포인트
  - 미달/부진: 회색 또는 레드 포인트
  - 추정 라벨: 딤 계열 색상
- 비교표 행 호버: 배경 연하게 강조

### 11-3. 반응형 포인트
- 768px 이하:
  - KPI 카드 2열
  - 비교표 가로 스크롤 (min-width: 680px)
  - 영화명 열 좌측 sticky 적용 시 min-width 지정 필요
  - 저예산 카드 1열
  - 해설 카드 1열
- 1024px 이상:
  - KPI 4열
  - 저예산 카드 2열
  - 해설 카드 2~3열
  - CTA 3열

---

## 12. SEO 설계

### 12-1. 메타 초안
- `seoTitle`: `대한민국 영화 TOP 손익분기점과 실제 수익 비교 | 비교계산소`
- `seoDescription`: `한국 영화의 제작비, 손익분기점, 실제 관객 수를 비교해보세요. 천만 영화, 저예산 대박작, 흥행작의 수익 구조를 데이터로 정리한 비교 리포트입니다.`

### 12-2. 메인 키워드
- 영화 손익분기점
- 한국영화 손익분기점
- 천만영화 수익
- 영화 제작비 수익 비교
- 한국영화 얼마나 벌었나

### 12-3. 서브 키워드
- 왕의 남자 손익분기점
- 저예산 대박 영화
- 영화 제작비 비교
- 한국영화 ROI
- 천만 영화 제작비

### 12-4. 롱테일 키워드
- 명량 얼마나 벌었나
- 극한직업 손익분기점
- 저예산 한국 영화 성공 사례
- 천만 영화인데 수익률 낮은 이유

---

## 13. 구현 체크리스트

### 13-1. 데이터
- [ ] `src/data/koreanMovieBreakEvenProfit.ts` 생성
- [ ] 영화 15편 내외 레코드 입력 (KOBIS + 기사 기반)
- [ ] 저예산 대박작 카드 데이터 분리
- [ ] 손익분기점 해설 카드 데이터 입력
- [ ] FAQ 5개 입력
- [ ] KPI 카드 4개 값 확정

### 13-2. 페이지
- [ ] `src/pages/reports/korean-movie-break-even-profit.astro` 생성
- [ ] `CalculatorHero`, `InfoNotice`, `SeoContent` 공통 컴포넌트 적용
- [ ] 비교표 마크업 (정렬 탭 + tbody)
- [ ] 저예산 카드 섹션 마크업
- [ ] 천만 포인트 섹션 마크업
- [ ] 해설 카드 보드 마크업
- [ ] FAQ 마크업

### 13-3. 스크립트
- [ ] `public/scripts/korean-movie-break-even-profit.js` 생성
- [ ] 정렬 탭 이벤트 처리
- [ ] 테이블 행 재정렬 로직
- [ ] JS 미동작 시에도 기본 콘텐츠(관객 수순) 읽기 가능 유지

### 13-4. 스타일
- [ ] `_korean-movie-break-even-profit.scss` 생성
- [ ] `src/styles/app.scss`에 import 추가
- [ ] 모바일 우선 반응형 적용
- [ ] 표 가로 스크롤 처리

### 13-5. 사이트 반영
- [ ] `src/data/reports.ts` 등록
- [ ] `src/pages/reports/index.astro` 허브 노출 확인
- [ ] `public/sitemap.xml` 추가
- [ ] `npm run build` 확인

---

## 14. QA 기준

### 14-1. 콘텐츠 QA
- KPI 카드 값이 비교표 데이터와 모순되지 않는가
- `추정` 라벨이 필요한 수치에 빠짐없이 표시되는가
- InfoNotice 면책 문구가 명확하게 노출되는가
- 손익분기점 해설 카드 5종이 중복되지 않는가

### 14-2. 데이터 QA
- `productionCost: null`인 영화에서 ROI 계산 오류 없는가
- 정렬 시 null 값 처리 (최하단 배치 권장)
- 배지 라벨이 해당 영화 데이터와 일치하는가

### 14-3. UI QA
- 모바일에서 비교표가 가로 스크롤로 안전하게 표시되는가
- 정렬 탭 active 상태가 명확하게 구분되는가
- KPI 카드가 2열로 자연스럽게 쌓이는가
- 저예산 카드가 모바일 1열 / PC 2열로 전환되는가

### 14-4. 인터랙션 QA
- 정렬 전환 시 테이블 렌더링이 깜박이지 않는가
- JS 없이도 기본 관객 수순 표가 정상 노출되는가
- FAQ가 항상 visible 상태로 표시되는가

---

## 15. 개발 메모

- 이 리포트는 이미지 없이 표/카드 중심으로 구성하므로 저작권 이슈가 없다.
- 비교표의 핵심 데이터는 KOBIS 공식 통계와 언론 보도 자료를 교차 확인해 입력한다.
- 손익분기점 수치는 기사별로 다를 수 있으므로 `breakEvenSource` 필드에 출처 문구를 남긴다.
- 구현 시작 순서:
  1. `src/data/koreanMovieBreakEvenProfit.ts` 데이터 확정
  2. `.astro` 페이지 마크업 조립
  3. 정렬 스크립트 구현
  4. 스타일 적용
  5. 사이트맵 / 리포트 허브 등록
- `추정` 라벨 누락은 콘텐츠 신뢰 문제로 이어지므로 QA에서 반드시 이중 확인한다.
