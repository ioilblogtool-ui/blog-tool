# 간호사 연차별 연봉 + 병원 규모별 비교 2026 — 설계 문서

> 기획 원문: `docs/plan/202604/nurse-salary-2026.md`
> 작성일: 2026-04-10
> 구현 기준: Claude/Codex가 이 문서를 보고 바로 구현에 착수할 수 있는 수준으로 고정
> 참고 리포트: `police-salary-2026`, `firefighter-salary-2026` (카드 선택형 상세 패널, 비교 리포트 패턴 재사용)

---

## 1. 문서 개요

### 1-1. 대상

- 기획 문서: `docs/plan/202604/nurse-salary-2026.md`
- 구현 대상: `간호사 연차별 연봉 + 병원 규모별 비교 2026`
- 콘텐츠 유형: 인터랙티브 비교 리포트 (`/reports/` 계열)

### 1-2. 문서 역할

- 기획 문서를 현재 비교계산소 `/reports/` 구조에 맞게 실제 구현 직전 수준으로 재구성한 설계 문서다.
- 화면 구조, 데이터 스키마, 인터랙션 상태, SCSS prefix, QA 기준을 고정한다.
- 이후 구현자는 이 문서를 기준으로 `src/data/`, `src/pages/reports/`, `public/scripts/`, `src/styles/` 작업을 진행한다.

### 1-3. 페이지 성격

- **범위형 직업/연봉 콘텐츠**: 간호대생, 신규간호사, 이직 고민 간호사가 병원 유형별 보상 수준을 빠르게 비교하는 데 초점
- **핵심 흐름**: `기관 유형 파악 → 병원 카드 선택 → 연차별 상세 확인 → 성장 추세 비교 → 수당 구조 이해 → 직급/커리어 확인 → 워라밸 비교`
- **인터랙션 핵심**: 병원 유형 카드 클릭 → 연차별 상세 패널 오픈
- **SEO 포지셔닝**: `간호사 연봉`, `신규간호사 연봉`, `대학병원 간호사 연봉`, `간호사 3년차 연봉`, `간호사 월급` 커버

### 1-4. 권장 slug

- `nurse-salary-2026`
- URL: `/reports/nurse-salary-2026/`

### 1-5. 권장 파일 구조

```
src/
  data/
    nurseSalary2026.ts            ← 병원 유형·연차·수당·워라밸 통합 데이터
  pages/
    reports/
      nurse-salary-2026.astro

public/
  scripts/
    nurse-salary-2026.js          ← 병원 카드 클릭, 상세 패널, 차트 인터랙션

src/styles/scss/pages/
  _nurse-salary-2026.scss         ← 페이지 전용 스타일 (prefix: ns-)
```

---

## 2. 현재 프로젝트 기준 정리

### 2-1. 기존 리포트 공통 구조

1. `CalculatorHero`
2. `InfoNotice` (데이터 출처 고지)
3. Hero KPI 카드
4. 핵심 인터랙티브 섹션 (유형 카드 + 상세 패널)
5. 성장 비교 차트
6. 비교 테이블
7. 수당 구조
8. 직급 구조 & 커리어 경로
9. 워라밸 비교
10. FAQ
11. 관련 콘텐츠 CTA
12. `SeoContent`

### 2-2. 기존 경찰/소방 리포트와의 차이

| 항목 | 경찰/소방 리포트 | 간호사 리포트 |
|---|---|---|
| 기본 데이터 성격 | 공식 봉급표 중심 | **시장형 범위 데이터 중심** |
| 비교 축 | 계급/호봉 | **병원 유형/연차** |
| 수치 표현 | 단일 수치 + 일부 추정 | **범위형 + 추정 배지 중심** |
| 핵심 메시지 | 계급·수당 구조 이해 | **병원 규모·교대근무에 따른 격차 이해** |
| 차별화 섹션 | 입직/승진/공무원 수당 | **워라밸 + 이직률 + 병원 유형 비교** |

### 2-3. 현재 구현 패턴

- 메타 등록: `src/data/reports.ts`
- 페이지 데이터: `src/data/nurseSalary2026.ts`
- 페이지 마크업: `src/pages/reports/nurse-salary-2026.astro`
- 클라이언트 인터랙션: `public/scripts/nurse-salary-2026.js`
- 페이지 전용 스타일: `src/styles/scss/pages/_nurse-salary-2026.scss`

---

## 3. 데이터 스키마

### 3-1. `nurseSalary2026.ts` 구조

```ts
export type SalaryBand = {
  annualGross: [number, number];         // 세전 연봉 범위 (원)
  monthlyNetEstimate: [number, number];  // 세후 실수령 월 범위 (원, 추정)
  note?: string;
};

export type NurseYearPoint = {
  year: number;                 // 0, 1, 3, 5, 7, 10, 15, 20
  label: string;                // '신입', '1년차', ...
  gradeLabel: string;           // 'Staff Nurse', 'Charge Nurse 예시' 등
  salary: SalaryBand;
  highlight?: boolean;
};

export type NurseHospitalType = {
  id: string;                   // 'big5', 'capital-univ', 'general', ...
  name: string;                 // '빅5 상급종합병원'
  shortName: string;            // 카드용 짧은 이름
  category: 'hospital' | 'public';
  badge?: string;               // '초봉 강세' | '워라밸 강점'
  examples: string[];
  description: string;
  entryRange: [number, number]; // 신입 세전 연봉 범위
  year20Range: [number, number];
  yearlyProgression: NurseYearPoint[];
  allowanceNotes: string[];
  workLifeBalanceScore: number; // 1~5, 편집 기준
  growthScore: number;          // 1~5, 편집 기준
  turnoverRiskLabel: string;    // '낮음' | '보통' | '높음'
  tags: string[];               // '초봉 강세', '공공형' 등
  isEstimated: true;
};

export type NurseAllowanceGroup = {
  id: 'fixed' | 'special' | 'annual';
  name: string;
  items: Array<{
    name: string;
    amount: string;             // '월 10~20만 원' 같은 문자열
    basis: string;              // '채용공고·현직자 제보 기반' 등
    note?: string;
  }>;
};

export type NurseCareerStage = {
  stage: string;                // '신규간호사'
  typicalYears: string;         // '0~2년'
  titleExamples: string[];      // '일반간호사', '주임간호사 예시'
  note: string;
};

export const heroStats = {
  categories: 6,
  comparisonYears: [0, 1, 3, 5, 10, 20],
  maxGapLabel: '최대 2배 이상 차이 가능',
  turnoverInsight: '병원 규모별 이직률 차이 존재',
} as const;
```

### 3-2. 병원 유형 데이터

권장 유형 6종:

| id | name | category | badge | 특징 |
|---|---|---|---|---|
| big5 | 빅5 상급종합병원 | hospital | 초봉 강세 | 상위권 병원, 경쟁 치열 |
| capital-univ | 수도권 대학병원 | hospital | 안정적 성장 | 교육·브랜드 강점 |
| general | 종합병원 | hospital | 균형형 | 초봉과 성장폭 중간 |
| local-small | 중소·일반병원 | hospital | 진입 장벽 낮음 | 성장 정체 가능성 |
| public-health | 보건소·공공기관 | public | 워라밸 강점 | 안정성 높음 |
| rehab-care | 요양·재활병원 | hospital | 근무강도 차이 큼 | 야간/부서 편차 큼 |

> 모든 금액 데이터는 `isEstimated: true`를 유지한다.
> 공개 화면에서는 `공식` 대신 `범위형`, `추정`, `편집 기준` 배지를 사용한다.

### 3-3. 연차별 데이터 포인트

권장 연차 포인트:

```ts
export const yearLabels = [
  { year: 0, label: '신입' },
  { year: 1, label: '1년차' },
  { year: 3, label: '3년차' },
  { year: 5, label: '5년차' },
  { year: 7, label: '7년차' },
  { year: 10, label: '10년차' },
  { year: 15, label: '15년차' },
  { year: 20, label: '20년차' },
] as const;
```

> `5년차` 또는 `10년차` 중 한 지점은 `highlight: true`로 기본 강조한다.
> 사용자 의사결정상 `3~5년차` 이직 분기 메시지가 중요하므로 `5년차` 하이라이트를 우선 추천한다.

### 3-4. 수당 그룹 데이터

```ts
export const nurseAllowanceGroups: NurseAllowanceGroup[] = [
  {
    id: 'fixed',
    name: '고정 수당',
    items: [
      { name: '나이트수당', amount: '월 10~40만 원', basis: '채용공고·현직자 제보 기반', note: '월 나이트 횟수에 따라 차이' },
      { name: '식대/복지포인트', amount: '병원별 차등', basis: '병원 공시·채용안내 기반' },
      { name: '교대근무수당', amount: '병원별 상이', basis: '현직자 제보·채용공고 기반' },
    ],
  },
  {
    id: 'special',
    name: '특수 파트 수당',
    items: [
      { name: 'ICU/ER/OR 수당', amount: '월 10~30만 원', basis: '현직자 제보 기반', note: '병원별 지급 여부 차이' },
      { name: '중환자/응급실 야간 가산', amount: '추가 지급 가능', basis: '부서 운영 기준 상이' },
      { name: '프리셉터/교육 수당', amount: '병원별 상이', basis: '병원 내부 제도 기준' },
    ],
  },
  {
    id: 'annual',
    name: '연간 특별 지급',
    items: [
      { name: '성과급/상여금', amount: '연 0~3,000만 원+', basis: '병원 공시·현직자 제보 기반', note: '병원 성격·실적에 따라 편차 큼' },
      { name: '의료비 감면', amount: '복지 혜택 차등', basis: '복지 안내 기준' },
      { name: '명절/격려금', amount: '병원별 차등', basis: '병원 내부 복지 기준' },
    ],
  },
];
```

### 3-5. 워라밸/커리어 데이터

```ts
export const nurseCareerStages: NurseCareerStage[] = [
  {
    stage: '신규간호사',
    typicalYears: '0~2년',
    titleExamples: ['일반간호사'],
    note: '프리셉터 적응기, 이직 고민이 가장 큰 구간',
  },
  {
    stage: '중간연차 간호사',
    typicalYears: '3~5년',
    titleExamples: ['일반간호사', '주임간호사 예시'],
    note: '이직/전과/전문파트 이동 분기점',
  },
  {
    stage: '책임 역할 진입',
    typicalYears: '6~10년',
    titleExamples: ['책임간호사 예시'],
    note: '병원별 승진 명칭과 속도 차이 큼',
  },
  {
    stage: '관리자급',
    typicalYears: '10년+',
    titleExamples: ['수간호사 예시', '파트장 예시'],
    note: '학위, 평가, 공석, 조직 구조에 따라 차이',
  },
];
```

---

## 4. 화면 구조

### 4-1. 섹션 순서

```
[A] Hero
[B] InfoNotice (출처/표기 원칙 고지)
[C] Hero KPI 카드 4종
[D] 핵심 인사이트 스트립
[E] 병원 유형 카드 그리드 + 상세 패널
[F] 연차별 성장 차트
[G] 전체 비교 테이블
[H] 수당 구조 (3탭)
[I] 직급 구조 & 커리어 경로
[J] 워라밸 비교
[K] FAQ
[L] 관련 콘텐츠 CTA + SeoContent
```

### 4-2. [A] Hero

```html
<CalculatorHero
  eyebrow="직업·연봉 리포트"
  title="간호사 연차별 연봉 + 병원 규모별 비교 2026"
  subtitle="2026년 채용공고·병원공시·협회 자료 기반 · 신입~20년차 · 병원 유형별 범위형 비교"
  badges={['비교계산소 리포트', '2026 최신']} />
```

### 4-3. [B] InfoNotice

```html
<InfoNotice
  title="데이터 기준 안내"
  lines={[
    "간호사 연봉 데이터는 공식 단일 봉급표가 아닌 채용공고·병원공시·협회 자료·현직자 제보를 종합한 범위형 추정치입니다.",
    "세전 연봉은 범위형, 세후 실수령 월급은 추정치로 표기합니다.",
    "성과급·나이트수당·특수파트 수당은 병원과 부서에 따라 큰 차이가 있습니다.",
    "워라밸 점수와 성장성 평가는 비교계산소 편집 기준입니다.",
  ]} />
```

### 4-4. [C] Hero KPI 카드 4종

권장 구성:

```
┌────────────────┐ ┌────────────────┐ ┌────────────────────┐ ┌────────────────────┐
│ 비교 기관 수    │ │ 비교 연차 구간   │ │ 병원 규모 격차      │ │ 이직률 인사이트      │
│ 6개 유형        │ │ 신입~20년차      │ │ 최대 2배 이상 가능  │ │ 규모별 차이 존재     │
└────────────────┘ └────────────────┘ └────────────────────┘ └────────────────────┘
```

> 단일 금액 카드보다 설명형 KPI 카드 우선.
> 모든 카드에 `범위형`, `공식 조사 기반`, `편집 요약` 중 하나의 배지 적용.

### 4-5. [D] 핵심 인사이트 스트립

4개 인사이트 칩 구성:

- `초봉은 빅5·상급종합병원이 강함`
- `3~5년차 이직 구간이 중요`
- `공공형은 워라밸 강점`
- `중소병원은 상승폭 제한 가능`

보강 문구:

> 병원 규모가 작을수록 사직률이 높아지는 경향이 있습니다.

### 4-6. [E] 병원 유형 카드 그리드 + 상세 패널

**카드 그리드**

- 모바일 2열 / 데스크톱 3열
- 카드 상단에 카테고리 색상 바
- 카드 클릭 시 상세 패널 열림

카드 구성 예시:

```
┌────────────────────────────┐
│ [민트/틸 색상 바]            │
│ 빅5 상급종합병원   초봉 강세 │
│ 대표 예시: 서울아산, 세브란스 │
│ 신입 세전: 4,800~6,500만 원 │
│ 10년차: 6,500~8,500만 원    │
│ [상세 보기 ↓]              │
└────────────────────────────┘
```

**상세 패널**

```text
- 유형 설명
- 대표 병원 예시
- 연차별 테이블
- 실수령 추정 범위
- 워라밸/성장성/이직률 요약
```

권장 테이블 컬럼:

| 연차 | 직급 예시 | 세전 연봉 | 세후 실수령(월, 추정) | 비고 |
|---|---|---|---|---|

비고 문구 예시:

- `나이트수당 포함 범위`
- `성과급 포함 가능`
- `교대 여부에 따라 편차 큼`

### 4-7. [F] 연차별 성장 차트

- Chart.js grouped bar chart
- x축: `신입 / 1 / 3 / 5 / 7 / 10 / 15 / 20년차`
- y축: 연봉(만 원)
- 시리즈: 병원 유형 6종
- 범례 클릭으로 병원 유형 on/off 가능

차트 상단 문구:

> 병원 유형에 따라 초봉, 성과급, 나이트수당 구조가 달라 동일 연차라도 차이가 큽니다.

### 4-8. [G] 전체 비교 테이블

표 목적:

- SEO용 구조화 데이터 강화
- 한눈에 보는 요약 비교
- 스크랩/저장 대응

권장 컬럼:

| 병원 유형 | 신입 초봉 범위 | 5년차 범위 | 10년차 범위 | 20년차 범위 | 워라밸 | 특징 |
|---|---|---|---|---|---|---|

특징 태그 예시:

- `초봉 강세`
- `장기근속 강점`
- `상승 제한`
- `워라밸 강점`
- `부서 편차 큼`

### 4-9. [H] 수당 구조 (3탭)

탭 구성:

- `고정 수당`
- `특수 파트 수당`
- `연간 특별 지급`

카드 구조:

```text
[수당명]
[금액 범위]
[출처/근거]
[설명 또는 주의 문구]
```

반드시 포함할 문구:

> 성과급과 특수수당은 병원별 편차가 매우 크므로 예시 범위로만 확인해야 합니다.

### 4-10. [I] 직급 구조 & 커리어 경로

- 타임라인 또는 4단 카드 구조
- 병원별 명칭 차이를 명시
- `예시`, `참고용` 배지 사용

권장 카드:

1. 신규간호사
2. 중간연차
3. 책임 역할 진입
4. 관리자급

상단 카피:

> 간호사는 연차만 쌓인다고 자동으로 연봉이 크게 오르는 구조가 아니라, 직급·부서·이직 여부가 중요합니다.

### 4-11. [J] 워라밸 비교

형식:

- 레이더 차트 또는 가로 점수 카드
- 각 병원 유형에 대해 `워라밸`, `성장성`, `업무강도`, `이직유연성` 비교

점수는 모두 `편집 기준` 배지 필요.

권장 표 형식 보조:

| 유형 | 워라밸 | 성장성 | 업무강도 | 이직유연성 |
|---|---|---|---|---|

### 4-12. [K] FAQ

필수 5개:

1. 신규간호사 연봉은 어느 정도인가요?
2. 빅5 간호사 연봉이 정말 가장 높은가요?
3. 대학병원과 종합병원 간호사 연봉 차이는 얼마나 나나요?
4. 나이트수당이 실수령에 얼마나 영향을 주나요?
5. 보건소 간호사는 연봉보다 워라밸이 좋은 편인가요?

### 4-13. [L] 관련 콘텐츠 CTA

| 위치 | 연결 대상 | 문구 |
|---|---|---|
| Hero 하단 | `/tools/salary/` | 내 실수령 월급 계산해보기 |
| 비교 테이블 하단 | `/reports/police-salary-2026/` | 경찰 연봉 리포트도 비교하기 |
| 워라밸 섹션 하단 | `/reports/firefighter-salary-2026/` | 소방관 연봉 리포트와 비교하기 |
| 페이지 하단 | `/reports/index/` 또는 관련 허브 | 직업 연봉 시리즈 더 보기 |

---

## 5. 인터랙션 상태 관리 (`nurse-salary-2026.js`)

### 5-1. 병원 카드 클릭

```js
let activeHospitalId = null;

function toggleHospitalPanel(hospitalId) {
  if (activeHospitalId === hospitalId) {
    closePanel(hospitalId);
    activeHospitalId = null;
  } else {
    if (activeHospitalId) closePanel(activeHospitalId);
    openPanel(hospitalId);
    activeHospitalId = hospitalId;
  }
}
```

### 5-2. 수당 탭

```js
function switchAllowanceTab(groupId) {
  document.querySelectorAll('.ns-allowance-tab').forEach((tab) => {
    tab.classList.toggle('is-active', tab.dataset.group === groupId);
  });

  document.querySelectorAll('.ns-allowance-list').forEach((list) => {
    list.hidden = list.dataset.group !== groupId;
  });
}
```

### 5-3. 성장 차트

```js
function createGrowthChart(data) {
  // grouped bar chart
  // dataset: hospitalType.yearlyProgression.map(point => point.salary.annualGross midpoint)
  // tooltip: '세전 연봉 범위 4,800~6,500만 원'
}
```

### 5-4. URL 파라미터

공유 기능:

```
/reports/nurse-salary-2026/?type=big5
```

- `type`: 초기 오픈할 병원 유형 id
- 페이지 로드 시 해당 유형 패널 자동 오픈

---

## 6. SCSS 설계 (`_nurse-salary-2026.scss`)

### 6-1. Prefix 규칙

모든 클래스는 `ns-` prefix 사용.

```scss
.ns-hero-kpi
.ns-insight-strip
.ns-insight-chip
.ns-hospital-grid
.ns-hospital-card
.ns-hospital-card--active
.ns-hospital-bar
.ns-hospital-panel
.ns-year-table
.ns-year-row--highlight
.ns-growth-chart
.ns-compare-table
.ns-allowance-tabs
.ns-allowance-tab
.ns-allowance-list
.ns-allowance-card
.ns-career-grid
.ns-career-card
.ns-balance-grid
.ns-balance-card
.ns-badge-range
.ns-badge-estimate
.ns-badge-editorial
```

### 6-2. 간호사 테마 색상

```scss
$ns-primary: #1f8f8b;   // 메인 틸
$ns-mid: #5cc6be;       // 민트
$ns-deep: #156b68;      // 딥 틸
$ns-soft: #eefaf8;      // 소프트 배경
$ns-border: #bfe9e3;    // 카드 테두리
$ns-public: #4f9fb8;    // 공공형 계열 보조 색상
```

### 6-3. 병원 유형별 색상 바

```scss
$ns-type-colors: (
  'big5': #1f8f8b,
  'capital-univ': #239b93,
  'general': #41b8aa,
  'local-small': #7ccfc4,
  'public-health': #4f9fb8,
  'rehab-care': #8bbd9e,
);
```

### 6-4. 배지 스타일

```scss
.ns-badge-range {
  background: #eefaf8;
  color: #156b68;
  border: 1px solid #1f8f8b;
}

.ns-badge-estimate {
  background: #fff7e8;
  color: #a46a00;
  border: 1px solid #d59b2d;
}

.ns-badge-editorial {
  background: #eef4ff;
  color: #2f5f9e;
  border: 1px solid #8eb4ea;
}
```

### 6-5. 핵심 인사이트 스트립

```scss
.ns-insight-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.ns-insight-chip {
  background: linear-gradient(135deg, #f4fffd 0%, #eefaf8 100%);
  border: 1px solid $ns-border;
  border-radius: 12px;
  padding: 14px 16px;
  font-weight: 700;
}
```

---

## 7. SEO 설계

### 7-1. 메타

```text
title: 간호사 연차별 연봉 + 병원 규모별 비교 2026 | 비교계산소
description: 2026년 간호사 연차별 연봉, 병원 유형별 연봉 차이, 나이트수당과 특수파트 수당까지 한눈에 비교합니다. 신입부터 20년차까지 범위형 데이터로 정리했습니다.
```

### 7-2. H 태그 구조

```text
H1: 간호사 연차별 연봉 + 병원 규모별 비교 2026
H2: 병원 유형별 연봉 비교
H2: 연차별 연봉 성장 비교
H2: 한눈에 보는 병원 유형별 연봉
H2: 간호사 급여 구성 요소
H2: 직급 구조와 커리어 경로
H2: 병원 유형별 워라밸 비교
H2: 자주 묻는 질문
```

### 7-3. JSON-LD

- `FAQPage` 스키마 (5개 FAQ)
- `Article` 스키마 (datePublished: 2026-04-10)

### 7-4. 내부 링크 최소 3개

- `/tools/salary/`
- `/reports/police-salary-2026/`
- `/reports/firefighter-salary-2026/`

---

## 8. `src/data/reports.ts` 등록

```ts
{
  slug: 'nurse-salary-2026',
  title: '간호사 연차별 연봉 + 병원 규모별 비교 2026',
  description: '빅5·대학병원·종합병원·중소병원·공공기관 등 병원 유형별 간호사 연봉과 나이트수당 구조를 범위형 데이터로 비교합니다.',
  category: '직업·연봉',
  tags: ['간호사', '연봉', '월급', '대학병원', '신규간호사', '2026'],
  publishedAt: '2026-04-10',
  order: 22,
}
```

> `order`는 실제 등록 시 기존 최신 리포트 다음 순번으로 조정한다.

---

## 9. 구현 순서

1. `src/data/nurseSalary2026.ts` — 병원 유형·연차·수당·워라밸 데이터 작성
2. `src/data/reports.ts` — 메타 등록
3. `src/pages/reports/nurse-salary-2026.astro` — 마크업 (섹션 A~L)
4. `src/styles/scss/pages/_nurse-salary-2026.scss` — 간호사 테마 스타일
5. `src/styles/app.scss` — 파셜 import 추가
6. `public/scripts/nurse-salary-2026.js` — 인터랙션 구현
7. `public/sitemap.xml` — URL 추가
8. `npm run build` — 빌드 확인

---

## 10. QA 체크리스트

### 데이터

- [ ] 모든 금액 수치가 단일 공식값이 아닌 범위형/추정치임을 명확히 표기했는가
- [ ] 세전 연봉과 세후 실수령(월)이 구분되어 있는가
- [ ] 성과급·특수수당이 고정 수치처럼 오해되지 않게 배지/주석이 붙어 있는가
- [ ] 병원 유형 6종이 중복 없이 구분되는가
- [ ] 워라밸/성장성 점수에 `편집 기준` 배지가 붙어 있는가

### 인터랙션

- [ ] 병원 카드 클릭 시 상세 패널이 정상 열림/닫힘
- [ ] 한 번에 하나의 패널만 열리는가
- [ ] 수당 탭 3종 전환이 정상 작동하는가
- [ ] 성장 차트 범례 on/off가 정상 작동하는가
- [ ] URL 파라미터 `?type=big5` 접근 시 해당 패널이 초기 오픈되는가

### SEO

- [ ] FAQ 5개 이상 포함되는가
- [ ] `범위형`, `추정`, `편집 기준` 배지가 구분되어 노출되는가
- [ ] JSON-LD FAQPage 스키마가 정상 삽입되는가
- [ ] 내부 링크 3개 이상 포함되는가
- [ ] sitemap.xml에 URL이 추가되었는가

### 빌드

- [ ] `npm run build` 에러 없음
- [ ] `/reports/nurse-salary-2026/` 라우트가 `dist/`에 생성되는가
- [ ] 모바일(375px)에서 카드·표·차트가 깨지지 않는가
- [ ] 민트/틸 계열 대비가 충분해 텍스트 가독성이 유지되는가

