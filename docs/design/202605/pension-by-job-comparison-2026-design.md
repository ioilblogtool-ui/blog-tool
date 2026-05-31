# 직종별 연금 비교 리포트 2026 설계 문서

> 기획 원문: `docs/plan/202605/pension-by-job-comparison-2026.md`
> 작성일: 2026-05-31
> 구현 기준: Claude/Codex가 이 문서를 보고 바로 페이지 구현에 착수할 수 있는 수준으로 고정

---

## 1. 문서 개요

### 1-1. 대상
- 기획 문서: `docs/plan/202605/pension-by-job-comparison-2026.md`
- 구현 대상: `직종별 연금 비교 리포트 2026 — 공무원·군인·사학·국민연금`
- 참고 구조: 기존 `/reports/` 하위 리포트 패턴 동일하게 따름

### 1-2. 문서 역할
- 기획 문서를 비교계산소 `/reports/` 구조에 맞게 실제 구현 직전 수준으로 재구성.
- 화면 구조, 데이터 스키마, 섹션별 구현 상세, 인터랙션, SEO, QA 기준을 고정한다.

### 1-3. 페이지 성격
- `리포트형 비교 콘텐츠` — 계산기 없는 고정 데이터 비교
- 핵심 흐름: `KPI 요약 → 제도 핵심 비교표 → 납입 부담 비교 → 납입 기간 탭 + 수령액 bar → 납입 기간별 차트 → 손익분기점 → 연금개혁 요약 → FAQ → CTA`
- 핵심 인터랙션: 납입 기간 탭 (10년 / 20년 / 30년) → 수령액 bar row 업데이트 + Chart.js 묶음 막대

### 1-4. 권장 slug
- `pension-by-job-comparison-2026`
- URL: `/reports/pension-by-job-comparison-2026/`

### 1-5. 권장 파일 구조
- `src/data/pensionByJobComparison2026.ts`
- `src/pages/reports/pension-by-job-comparison-2026.astro`
- `public/scripts/pension-by-job-comparison-2026.js`
- `src/styles/scss/pages/_pension-by-job-comparison-2026.scss`
- `public/og/reports/pension-by-job-comparison-2026.png`

---

## 2. 현재 프로젝트 기준 정리

### 2-1. 리포트 공통 구조
1. `CalculatorHero`
2. `InfoNotice`
3. 상단 KPI 요약 카드
4. 핵심 비교표
5. 섹션별 상세 비교
6. 해설 카드 보드
7. FAQ
8. 관련 계산기 / 리포트 CTA
9. `SeoContent`

### 2-2. 현재 구현 패턴
- 메타 등록: `src/data/reports.ts`
- 허브 노출: `src/pages/reports/index.astro` (`reportMetaBySlug` 추가)
- 페이지 데이터: `src/data/<report>.ts`
- 페이지 마크업: `src/pages/reports/<slug>.astro`
- 클라이언트 인터랙션: `public/scripts/<slug>.js`
- 페이지 전용 스타일: `src/styles/scss/pages/_<slug>.scss`
- 사이트맵: `public/sitemap.xml`

### 2-3. 이번 리포트 방향
- 이미지 없이 표·CSS bar·Chart.js 묶음 막대 구성
- 납입 기간 탭 (10 / 20 / 30년) 이 핵심 인터랙션
- 공식 기관 공개 자료 기준, 추정값에는 반드시 `추정` 표기
- 연금 산정 공식은 단순화해 참고용임을 명시

---

## 3. 구현 범위

### 3-1. MVP 범위
- KPI 요약 카드 4종
- 4개 연금 제도 핵심 비교표
- 납입 부담 비교 (월 300만 원 기준)
- 납입 기간 탭 + 수령액 CSS bar row
- 납입 기간별 수령액 Chart.js 묶음 막대
- 손익분기점 카드 4종
- 연금개혁 요약 카드
- FAQ 5개
- 관련 콘텐츠 CTA

### 3-2. MVP 제외 범위
- 기준소득 직접 입력 계산기 (2차 확장)
- 개혁 전·후 수령액 상세 심층 리포트 (2차 확장)
- 노후 포트폴리오 조합 계산 (2차 확장)

---

## 4. 연금 제도 데이터 정의

### 4-1. 4개 연금 핵심 데이터

| 항목 | 공무원연금 | 군인연금 | 사학연금 | 국민연금 |
|------|----------|--------|--------|--------|
| 가입 대상 | 국가·지방 공무원 | 현역 군인 | 사립학교 교직원 | 민간 근로자 등 |
| 본인 납입률 | 기준소득 9% | 기준소득 9% | 기준소득 9% | 기준소득 4.5% |
| 국가/고용주 부담 | 기준소득 9% | 기준소득 9% | 기준소득 9% | 기준소득 4.5% |
| 총 납입률 | 18% | 18% | 18% | 9% |
| 지급 개시 나이 | 65세 (2033년 완전 전환) | 20년 복무 시 즉시 | 65세 | 63세→65세 (출생연도별) |
| 소득대체율(20년) | 약 35~40% | 약 40~50% | 약 35~40% | 약 25~30% |
| 현재 상태 | 2015·2025 개혁 반영 | 구조 유지 | 공무원연금 준용 | 2025 개혁 반영 |
| 특이사항 | 연금개혁으로 소득대체율 하락 | 20년 복무 충족 시 조기 수령 가능 | 공무원연금과 거의 동일 구조 | 소득대체율 40%→42% 단계 인상 |

> ⚠️ 위 수치는 설계 기준 참고값. 구현 전 인사혁신처·국민연금공단·군인연금공단·사학연금공단 공시 자료로 반드시 업데이트

### 4-2. 월 기준소득 300만 원 기준 납입 부담

| 구분 | 공무원연금 | 군인연금 | 사학연금 | 국민연금 |
|------|----------|--------|--------|--------|
| 본인 월 납입 | 27만 원 | 27만 원 | 27만 원 | 13.5만 원 |
| 고용주 월 납입 | 27만 원 | 27만 원 | 27만 원 | 13.5만 원 |
| 총 월 납입 | 54만 원 | 54만 원 | 54만 원 | 27만 원 |

### 4-3. 월 기준소득 300만 원 기준 납입 기간별 예상 월 수령액 (단순 추정)

| 납입 기간 | 공무원연금 | 군인연금 | 사학연금 | 국민연금 |
|---------|----------|--------|--------|--------|
| 10년 | 약 53만 원 | 약 60만 원 | 약 53만 원 | 약 25만 원 |
| 20년 | 약 105만 원 | 약 120만 원 | 약 105만 원 | 약 50만 원 |
| 30년 | 약 158만 원 | 약 180만 원 | 약 158만 원 | 약 75만 원 |

> ⚠️ 단순 소득대체율 기반 추정값. 물가연동·재직기간 가산 등 미반영. 공식 자료로 교체 필요

### 4-4. 손익분기점 (납입 총액 회수 연령)

| 구분 | 공무원연금 | 군인연금 | 사학연금 | 국민연금 |
|------|----------|--------|--------|--------|
| 20년 납입 기준 본인 납입 총액 | 약 6,480만 원 | 약 6,480만 원 | 약 6,480만 원 | 약 3,240만 원 |
| 20년 납입 기준 월 수령액 | 약 105만 원 | 약 120만 원 | 약 105만 원 | 약 50만 원 |
| 회수 완료 시점 | 약 5년 | 약 4.5년 | 약 5년 | 약 5.4년 |
| 손익분기 연령 (65세 수급 기준) | 약 70세 | 복무 완료 즉시 + 약 4.5년 | 약 70세 | 약 70세 |

> ⚠️ 군인연금은 20년 복무 충족 시 지급 개시 나이가 다름. 별도 명시 필요

---

## 5. 데이터 구조 (`src/data/pensionByJobComparison2026.ts`)

### 5-1. 타입 전체 정의

```ts
export type PensionId = 'civil' | 'military' | 'private-school' | 'national';
export type TermKey = 'y10' | 'y20' | 'y30';

export interface ReportMeta {
  seoTitle: string;
  seoDescription: string;
  ogTitle: string;
  ogDescription: string;
  dataSourceLabel: string;
  updatedAt: string;
  caution: string;
}

export interface KpiCard {
  label: string;
  value: string;
  sub: string;
  tone?: 'neutral' | 'accent' | 'warn';
}

export interface PensionRecord {
  id: PensionId;
  name: string;             // 공무원연금
  nameShort: string;        // 공무원
  target: string;           // 가입 대상
  selfRatePct: number;      // 본인 납입률 (%)
  employerRatePct: number;  // 고용주 납입률 (%)
  paymentStartAge: string;  // 지급 개시 나이 (문자열, 예외 케이스 있음)
  replacementRate20y: string; // 20년 소득대체율 범위
  currentStatus: string;    // 현재 상태 (개혁 반영 등)
  note: string;             // 특이사항
  color: string;            // UI 색상 hex
  isEstimate: boolean;
}

export interface ContributionRow {
  pensionId: PensionId;
  monthlyBaseMan: number;     // 기준 월 소득 (만 원)
  selfMonthlyMan: number;     // 본인 월 납입 (만 원)
  employerMonthlyMan: number; // 고용주 월 납입 (만 원)
  totalMonthlyMan: number;    // 합산 월 납입 (만 원)
}

export interface TermSimulation {
  termKey: TermKey;
  termLabel: string;          // '10년', '20년', '30년'
  termYears: number;
  rows: {
    pensionId: PensionId;
    monthlyReceiveMan: number; // 예상 월 수령액 (만 원)
    isEstimate: boolean;
  }[];
}

export interface BreakevenCard {
  pensionId: PensionId;
  totalContribMan: number;    // 20년 납입 본인 부담 총액 (만 원)
  monthlyReceiveMan: number;  // 예상 월 수령액 (만 원)
  breakevenYears: number;     // 회수까지 걸리는 연수
  breakevenAgeNote: string;   // "65세 수급 기준 약 70세" 등
  note: string;
  isEstimate: boolean;
}

export interface ReformCard {
  title: string;
  description: string;
  affectedPension: PensionId[];
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

export interface PensionByJobReportData {
  meta: ReportMeta;
  kpis: KpiCard[];
  pensions: PensionRecord[];
  contributions: ContributionRow[];
  termSimulations: TermSimulation[];
  breakevenCards: BreakevenCard[];
  reformCards: ReformCard[];
  faq: FaqItem[];
  relatedLinks: RelatedLink[];
}
```

### 5-2. 데이터 설계 원칙
- 모든 수령액 수치는 단순 소득대체율 기반 추정값이며 `isEstimate: true` 처리.
- 군인연금 지급 개시는 20년 복무 충족 시 즉시로 별도 표기, 비교 시 주석 필수.
- 월 기준소득은 300만 원 고정 (변동 없음) — 2차에서 입력 계산기로 확장.
- `termSimulations` 배열에 10·20·30년 3개 항목 → JS로 탭 전환 시 bar 업데이트.
- 손익분기는 본인 납입분만 기준으로 계산 (고용주 부담 제외).

### 5-3. 초기 데이터 범위
- 연금 레코드: 4개
- 납입 부담 행: 4개 (월 300만 원 기준)
- 납입 기간 시뮬레이션: 3세트 (10·20·30년) × 4개 연금
- 손익분기 카드: 4개 (20년 납입 기준)
- 연금개혁 요약 카드: 3개
- FAQ: 5개
- KPI 카드: 4종

---

## 6. 페이지 구조

### 6-1. 전체 IA
1. `CalculatorHero`
2. `InfoNotice` (추정값 안내 + 면책)
3. KPI 요약 카드 (4종)
4. 4개 연금 제도 핵심 비교표
5. 납입 부담 비교 (월 300만 원 기준)
6. 납입 기간 탭 + 수령액 CSS bar row
7. 납입 기간별 수령액 Chart.js 묶음 막대
8. 손익분기점 카드 (4종)
9. 연금개혁 요약 카드 (3종)
10. FAQ (5개)
11. 관련 콘텐츠 CTA
12. `SeoContent`

### 6-2. 모바일 우선 순서
- Hero
- InfoNotice
- KPI 카드 (2열)
- 제도 비교표 (가로 스크롤)
- 납입 부담 비교 (가로 스크롤 or 카드)
- 납입 기간 탭 (3개 버튼)
- 수령액 bar row (선택된 기간)
- Chart.js 묶음 막대 (전체폭)
- 손익분기 카드 (2열)
- 연금개혁 카드 (세로 스택)
- FAQ
- CTA
- SEO

### 6-3. PC 레이아웃
- KPI 카드: 4열
- 제도 비교표: 전체폭 가로 4열
- 납입 부담: 4열 카드
- 수령액 bar row: 전체폭
- 차트: 전체폭 (높이 280px)
- 손익분기 카드: 4열
- 연금개혁 카드: 3열
- CTA: 3열

---

## 7. 섹션별 구현 상세

### 7-1. Hero
- eyebrow: `직종별 연금 비교 리포트`
- H1: `직종별 연금 비교 2026 — 공무원·군인·사학·국민연금`
- 서브카피: `같은 월급, 20년 납입 — 직종마다 수령액이 얼마나 다를까요?`
- 설명:
  - 공무원연금, 군인연금, 사학연금, 국민연금을 동일 기준으로 비교합니다.
  - 납입 부담, 예상 수령액, 손익분기점을 한눈에 확인하세요.

### 7-2. InfoNotice
- 필수 면책 문구:
  - 수령액은 월 기준소득 300만 원, 단순 소득대체율 기반 추정값입니다. 실제 수령액은 재직기간·물가연동·개혁 시점에 따라 다릅니다.
  - 출처: 인사혁신처·국민연금공단·군인연금공단·사학연금공단 공개 자료 기준.
  - 군인연금은 20년 복무 충족 시 지급 개시 나이가 다릅니다.

### 7-3. KPI 요약 카드 (4종)

| 카드 | 값 | 설명 |
|------|-----|------|
| 20년 납입 최고 수령액 | 군인연금 약 120만 원/월 | 월 300만 원 기준 추정 |
| 20년 납입 최저 수령액 | 국민연금 약 50만 원/월 | 월 300만 원 기준 추정 |
| 수령액 격차 | 약 70만 원/월 | 군인연금 대비 국민연금 차이 |
| 본인 납입 부담 차이 | 2배 | 공무원/군인/사학 vs 국민연금 본인 납입 비율 |

### 7-4. 4개 연금 제도 핵심 비교표

#### 표 컬럼 구성
- 항목 (좌측 고정)
- 공무원연금 / 군인연금 / 사학연금 / 국민연금 (각 열)

#### 표 행 구성
- 가입 대상
- 본인 납입률
- 고용주 납입률
- 총 납입률
- 지급 개시 나이
- 20년 소득대체율
- 현재 상태

#### 표 UX 원칙
- 모바일 가로 스크롤 (min-width: 680px)
- 국민연금 열 배경 연하게 강조 (비교 기준선)
- 군인연금 지급 개시 나이에 툴팁/주석 처리

### 7-5. 납입 부담 비교

- 섹션 제목: `월 300만 원 기준 납입 부담`
- 4개 연금 카드:
  - 본인 월 납입액
  - 고용주 월 납입액
  - 합산 월 납입액
  - 20년 본인 납입 총액
- 국민연금 납입 부담이 절반임을 강조 (부담이 적은 대신 수령액도 적음 해설)

### 7-6. 납입 기간 탭 + 수령액 CSS bar row

#### 탭 3종
- `10년 납입` / `20년 납입` (기본) / `30년 납입`

#### bar row 구성 (탭 선택에 따라 JS로 수치 업데이트)
- 연금 이름 / 예상 월 수령액 숫자 / 가로 바 (최대값 기준 비례)
- 각 연금 고유 색상 적용
- `추정` 라벨 필수

#### JS 처리 방식
- `data-term` 속성으로 10·20·30년 데이터 사전 주입
- 탭 클릭 시 해당 term 데이터로 bar 너비와 수치 텍스트 업데이트

### 7-7. 납입 기간별 수령액 Chart.js 묶음 막대

- 섹션 제목: `납입 기간별 수령액 격차`
- Chart.js `bar` 타입, grouped
  - X축: 납입 기간 (10년 / 20년 / 30년)
  - Y축: 예상 월 수령액 (만 원)
  - 데이터셋: 4개 연금 (각 고유 색상)
- 범례: 상단 또는 하단
- 높이: 모바일 240px / PC 280px

### 7-8. 손익분기점 카드 (4종)

- 섹션 제목: `납입 총액을 회수하려면 몇 년이 걸릴까요?`
- 설명: 20년 납입 기준 본인 부담 총액 ÷ 월 수령액 = 회수 기간
- 카드 4종 (연금별):
  - 연금명
  - 20년 본인 납입 총액
  - 예상 월 수령액
  - 회수까지 걸리는 연수
  - 손익분기 나이 (예: 65세 수급 시 약 70세)
  - `추정` 라벨 필수
- 군인연금 카드에 "20년 복무 충족 시 즉시 수급 가능" 별도 안내

### 7-9. 연금개혁 요약 카드 (3종)

- 섹션 제목: `2025~2026 연금개혁 주요 변화`
- 카드 3종:
  1. **국민연금 개혁** — 소득대체율 40%→42% 단계 인상, 보험료율 9%→13% 단계 인상
  2. **공무원연금 개혁** — 2015년·2025년 개혁으로 소득대체율 하락, 납입률 유지
  3. **영향 요약** — 개혁 후에도 공무원·군인연금의 수령액 우위는 유지되나 격차 축소 추세

### 7-10. FAQ (5개, 항상 visible)

1. 공무원연금이 국민연금보다 얼마나 더 받나요?
2. 군인연금은 왜 다른 연금보다 유리한가요?
3. 사학연금은 공무원연금과 같은 수준인가요?
4. 공무원이 되면 국민연금 대신 공무원연금을 가입하나요?
5. 연금개혁 이후 공무원연금도 불리해졌나요?

### 7-11. 관련 콘텐츠 CTA (3개)
- `국민연금 세대별 손익 비교` → `/reports/national-pension-generational-comparison-2026/`
- `연금 수령 나이별 실수령액 비교` → `/reports/pension-age-comparison-2026/`
- `2026 공무원 9급 연봉 가이드` → `/reports/public-servant-salary-2026/`

---

## 8. 인터랙션 설계 (`public/scripts/pension-by-job-comparison-2026.js`)

### 8-1. 필요한 인터랙션
- 납입 기간 탭 전환 (10 / 20 / 30년)
- 탭 전환 시 bar row 수치·너비 업데이트
- Chart.js 묶음 막대 초기화

### 8-2. 스크립트 책임 범위
- `script[type="application/json"]`으로 전체 리포트 데이터 주입
- 탭 클릭 → 선택된 `termKey`의 시뮬레이션 데이터로 bar row 재렌더링
- Chart.js: 3개 기간 × 4개 연금 묶음 막대 초기화 (SSR 이후 클라이언트에서 렌더)

### 8-3. bar row 업데이트 로직
```js
// 탭 클릭 이벤트
tabEl.addEventListener('click', (e) => {
  const termKey = e.target.dataset.term; // 'y10' | 'y20' | 'y30'
  const termData = report.termSimulations.find(s => s.termKey === termKey);
  const maxReceive = Math.max(...termData.rows.map(r => r.monthlyReceiveMan));

  barRows.forEach((row) => {
    const pensionId = row.dataset.pension;
    const sim = termData.rows.find(r => r.pensionId === pensionId);
    const pct = Math.round((sim.monthlyReceiveMan / maxReceive) * 100);
    row.querySelector('.pbjc-bar').style.width = pct + '%';
    row.querySelector('.pbjc-receive-val').textContent = sim.monthlyReceiveMan + '만 원';
  });
});
```

### 8-4. 구현 단순화 원칙
- 데이터는 페이지 내 JSON으로 전달, 외부 fetch 없음
- Chart.js는 CDN 사용 (`chart.umd.min.js`)
- JS 미동작 시 20년 기본 데이터 서버 사이드 렌더링으로 표시

---

## 9. 스타일 가이드 (`_pension-by-job-comparison-2026.scss`)

### 9-1. CSS prefix
- `pbjc-` 사용
  - Pension By Job Comparison

### 9-2. 색상 방향
- 공무원연금: `#6366f1` (인디고)
- 군인연금: `#0f766e` (테일)
- 사학연금: `#9333ea` (퍼플)
- 국민연금: `#0891b2` (시안) — 비교 기준선, 연하게
- 수령액 bar: 각 연금 고유 색상
- 주의·추정 라벨: `#fde68a` 계열

### 9-3. 반응형 포인트
- 768px 이하:
  - KPI 카드 2열
  - 비교표 가로 스크롤 (min-width: 680px)
  - 납입 부담 카드 2열
  - 손익분기 카드 2열
  - 연금개혁 카드 1열
- 1024px 이상:
  - KPI·손익분기 카드 4열
  - 납입 부담 카드 4열
  - 연금개혁 카드 3열

---

## 10. SEO 설계

### 10-1. 메타 초안
- `seoTitle`: `직종별 연금 비교 2026 — 공무원·군인·사학·국민연금 수령액 얼마나 다를까 | 비교계산소`
- `seoDescription`: `공무원연금, 군인연금, 사학연금, 국민연금을 같은 월급·납입 기간 기준으로 비교합니다. 20년 납입 기준 예상 수령액 차이와 손익분기점을 확인하세요.`

### 10-2. 메인 키워드
- 공무원연금 국민연금 비교
- 직종별 연금 비교
- 군인연금 수령액
- 사학연금 공무원연금 차이

### 10-3. 서브 키워드
- 공무원연금 개혁 후 수령액
- 국민연금 공무원연금 얼마나 차이
- 군인연금 20년 복무
- 직종별 노후 연금 비교 2026

### 10-4. 롱테일 키워드
- 같은 월급 공무원 국민연금 수령액 비교
- 군인연금 손익분기점
- 사학연금 국민연금 차이

---

## 11. 구현 체크리스트

### 11-1. 데이터
- [ ] `src/data/pensionByJobComparison2026.ts` 생성
- [ ] 4개 연금 레코드 공식 자료 기준 확정 입력
- [ ] 납입 부담 행 4개 입력
- [ ] 납입 기간 시뮬레이션 3세트 × 4개 입력
- [ ] 손익분기 카드 4개 입력
- [ ] 연금개혁 요약 카드 3개 입력
- [ ] FAQ 5개 입력
- [ ] KPI 카드 4종 값 확정

### 11-2. 페이지
- [ ] `src/pages/reports/pension-by-job-comparison-2026.astro` 생성
- [ ] `CalculatorHero`, `InfoNotice`, `SeoContent` 적용
- [ ] KPI 카드 마크업
- [ ] 4개 연금 제도 비교표 마크업
- [ ] 납입 부담 카드 마크업
- [ ] 납입 기간 탭 + bar row 마크업 (`data-term`, `data-pension` 속성 포함)
- [ ] Chart.js canvas 마크업
- [ ] 손익분기 카드 마크업
- [ ] 연금개혁 요약 카드 마크업
- [ ] FAQ 마크업 (항상 visible)
- [ ] CTA 마크업

### 11-3. 스크립트
- [ ] `public/scripts/pension-by-job-comparison-2026.js` 생성
- [ ] 납입 기간 탭 이벤트 처리
- [ ] bar row 수치·너비 업데이트 로직
- [ ] Chart.js 묶음 막대 초기화
- [ ] JS 미동작 시 20년 기본 데이터 표시 유지

### 11-4. 스타일
- [ ] `_pension-by-job-comparison-2026.scss` 생성
- [ ] `src/styles/app.scss`에 import 추가
- [ ] 모바일 우선 반응형 적용
- [ ] 비교표 가로 스크롤 처리
- [ ] 4개 연금 고유 색상 변수 적용

### 11-5. 사이트 반영
- [ ] `src/data/reports.ts` 등록 (order: 25.05, category: asset)
- [ ] `src/pages/reports/index.astro` reportMetaBySlug 추가
- [ ] `public/sitemap.xml` 추가
- [ ] `npm run build` 확인

---

## 12. QA 기준

### 12-1. 콘텐츠 QA
- KPI 카드 값이 시뮬레이션 데이터와 모순되지 않는가
- 모든 수령액 추정값에 `추정` 라벨이 표시되는가
- InfoNotice 면책 문구가 노출되는가
- 군인연금 지급 개시 나이 특이사항이 명시되는가
- 연금개혁 내용이 최신 정책과 일치하는가

### 12-2. 데이터 QA
- 납입 기간 탭 전환 시 bar 수치가 정확히 업데이트되는가
- Chart.js 데이터셋이 시뮬레이션 데이터와 일치하는가
- 손익분기 계산(납입 총액 ÷ 월 수령액)이 올바른가

### 12-3. UI QA
- 모바일에서 비교표가 가로 스크롤로 안전하게 표시되는가
- 납입 기간 탭 active 상태가 명확히 구분되는가
- KPI 카드·손익분기 카드가 2열로 자연스럽게 쌓이는가
- Chart.js가 모바일/PC 모두 정상 렌더링되는가

### 12-4. 인터랙션 QA
- 탭 전환 시 bar row가 부드럽게 업데이트되는가
- JS 없이도 20년 기본 수령액 bar가 정상 노출되는가
- FAQ가 항상 visible 상태로 표시되는가

---

## 13. 개발 메모

- 연금 수령액 수치는 단순 소득대체율 기반 추정값이므로 `isEstimate: true` 필드 처리 및 UI `추정` 라벨 누락 금지.
- 군인연금은 지급 개시 나이가 타 연금과 달리 "20년 복무 충족 시 즉시" 구조이므로 비교표 해당 셀에 주석/툴팁 처리 필요.
- 국민연금은 타 직역연금 대비 본인 납입률이 절반(4.5%)이므로 납입 부담 비교 섹션에서 이 차이를 명확히 설명해야 "부담이 적은 대신 수령액도 적다"는 맥락이 전달됨.
- Chart.js 데이터는 `termSimulations` 배열 전체를 JSON으로 주입해 탭 전환 시 재사용.
- 구현 시작 순서:
  1. 4개 연금 공단 공식 자료 수집 → 수치 확정
  2. `src/data/pensionByJobComparison2026.ts` 작성
  3. `.astro` 페이지 마크업 조립
  4. 탭 전환 + bar 업데이트 + Chart.js 스크립트 구현
  5. 스타일 적용
  6. 사이트맵·리포트 허브 등록
- 2차 확장: `/tools/pension-by-job-calculator/` 계산기 연결 슬롯을 CTA에 미리 확보해둔다.
