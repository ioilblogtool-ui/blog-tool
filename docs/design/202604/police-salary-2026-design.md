# 경찰관 계급별 연봉·호봉 완전 정리 2026 — 설계 문서

> 기획 원문: `docs/plan/202604/police-salary-2026.md`
> 작성일: 2026-04-10
> 구현 기준: Claude/Codex가 이 문서를 보고 바로 구현에 착수할 수 있는 수준으로 고정

---

## 1. 문서 개요

### 1-1. 대상

- 기획 문서: `docs/plan/202604/police-salary-2026.md`
- 구현 대상: `경찰관 계급별 연봉·호봉 완전 정리 2026`
- 콘텐츠 유형: 인터랙티브 비교 리포트 (`/reports/` 계열)

### 1-2. 문서 역할

- 기획 문서를 현재 비교계산소 `/reports/` 구조에 맞게 실제 구현 직전 수준으로 재구성한 설계 문서다.
- 화면 구조, 데이터 스키마, 인터랙션 상태, SCSS prefix, QA 기준을 고정한다.
- 이후 구현자는 이 문서를 기준으로 `src/data/`, `src/pages/reports/`, `public/scripts/`, `src/styles/` 작업을 진행한다.

### 1-3. 페이지 성격

- **독립형 직업/연봉 콘텐츠**: 경찰 준비생·취준생·직업 리서치 사용자의 정보 탐색 니즈 충족
- **핵심 흐름**: `계급 개요 파악 → 기본급 카드 선택 → 호봉 상세 확인 → 수당 구조 이해 → 승진 경로 파악 → 입직 방법 비교 → 관련 계산기 연결`
- **인터랙션 핵심**: 계급 카드 클릭 → 호봉표 상세 패널 슬라이드 오픈
- **SEO 포지셔닝**: `경찰 연봉`, `경찰 호봉표`, `순경 월급`, `경찰 10년차 연봉` 고검색량 키워드 커버

### 1-4. 권장 slug

- `police-salary-2026`
- URL: `/reports/police-salary-2026/`

### 1-5. 권장 파일 구조

```
src/
  data/
    policeSalary2026.ts           ← 계급·호봉·수당·입직 통합 데이터
  pages/
    reports/
      police-salary-2026.astro

public/
  scripts/
    police-salary-2026.js         ← 계급 카드 클릭, 호봉 패널, 차트 인터랙션

src/styles/scss/pages/
  _police-salary-2026.scss        ← 페이지 전용 스타일 (prefix: ps-)
```

---

## 2. 현재 프로젝트 기준 정리

### 2-1. 기존 리포트 공통 구조

1. `CalculatorHero`
2. `InfoNotice` (데이터 출처 고지)
3. 상단 요약 카드 (Hero KPI)
4. 핵심 인터랙티브 섹션 (계급 카드 + 호봉 패널)
5. 예상 연봉 바 차트
6. 수당 구조 섹션
7. 승진 경로 섹션
8. 30년 생애 소득 시뮬레이션
9. 입직 방법 비교
10. FAQ
11. 관련 계산기·리포트 CTA
12. `SeoContent`

### 2-2. 현재 구현 패턴

- 메타 등록: `src/data/reports.ts`
- 허브 노출: `src/pages/reports/index.astro`
- 페이지 데이터: `src/data/policeSalary2026.ts`
- 페이지 마크업: `src/pages/reports/police-salary-2026.astro`
- 클라이언트 인터랙션: `public/scripts/police-salary-2026.js`
- 페이지 전용 스타일: `src/styles/scss/pages/_police-salary-2026.scss`

---

## 3. 데이터 스키마

### 3-1. `policeSalary2026.ts` 구조

```ts
// ===== 공식 봉급표 (공무원보수규정 별표 10, 2026.1.2 개정) =====
export type PoliceStep = {
  step: number;       // 호봉
  monthlyBase: number; // 월 기본급 (원)
};

export type PoliceRank = {
  id: string;                  // 'soon-gyeong' | 'gyeong-jang' | ...
  name: string;                // '순경'
  nameEn: string;              // 'Constable'
  equiv?: string;              // '9급 상당'
  description: string;         // 현장 실무자 역할 설명
  officialBase1: number;       // 1호봉 기본급 (공식, 원)
  representativeStep: number;  // 대표 호봉 (바 차트용)
  steps: PoliceStep[];         // 전체 호봉표
  badgeType: 'official';       // 기본급은 항상 official
  // 추정치
  estimatedMonthlyRange: [number, number]; // 예상 체감 월 보수 범위 (추정)
  estimatedAnnual: number;     // 예상 연봉 (추정, 바 차트용)
};

// ===== 수당 데이터 =====
export type Allowance = {
  name: string;
  amount: string;       // '월 160,000원' | '월 최대 180,000원' 등 문자열
  basis: string;        // '공무원수당규정 제18조' | '2026 처우개선 보도자료'
  type: 'fixed' | 'variable' | 'annual';
};

// ===== 입직 방법 =====
export type EntryMethod = {
  id: string;
  name: string;         // '순경 공채'
  startRank: string;    // '순경 1호봉'
  salaryNote: string;   // '공식 봉급표 적용'
  description: string;
};

// ===== Hero KPI 카드 =====
export const heroStats = {
  rankCount: 11,
  salaryIncreaseRate: '3.5%',
  constableBase1: 2_133_000,
  grade9InitialMonthly: 2_860_000,
} as const;
```

### 3-2. 계급 데이터 (공식 봉급표 기준)

| id | name | officialBase1 | representativeStep | estimatedAnnual |
|---|---|---|---|---|
| soon-gyeong | 순경 | 2,133,000 | 7 | 36,000,000 |
| gyeong-jang | 경장 | 2,215,300 | 7 | 38,000,000 |
| gyeong-sa | 경사 | 2,472,100 | 8 | 42,000,000 |
| gyeong-wi | 경위 | 2,507,700 | 8 | 46,000,000 |
| gyeong-gam | 경감 | 2,698,600 | 9 | 54,000,000 |
| gyeong-jeong | 경정 | 3,126,100 | 8 | 65,000,000 |
| chong-gyeong | 총경 | 3,619,000 | 7 | 78,000,000 |
| gyeong-mu-gwan | 경무관 | 4,167,700 | 5 | 92,000,000 |
| chi-an-gam | 치안감 | 4,563,500 | 4 | 102,000,000 |
| chi-an-jeong-gam | 치안정감 | 4,905,100 | 3 | 110,000,000 |

> **주의**: `estimatedAnnual`은 기본급(대표 호봉)×12 + 정액급식비 + 직급보조비 + 정근수당 + 명절휴가비 주요 항목 반영 추정치이며, **`추정` 배지 필수**.
> 치안총감은 공식 별표 10에서 별도 호봉형으로 확인되지 않아 현 버전에서 제외.

### 3-3. 수당 데이터

```ts
export const allowances: Allowance[] = [
  // 고정 수당
  { name: '정액급식비', amount: '월 160,000원', basis: '공무원수당규정 제18조', type: 'fixed' },
  { name: '위험근무수당', amount: '월 80,000원', basis: '2026 처우개선 (경찰·소방)', type: 'fixed' },
  { name: '직급보조비', amount: '계급별 차등', basis: '공무원보수규정 별표 15', type: 'fixed' },
  // 변동 수당
  { name: '112 출동수당', amount: '1일 최대 40,000원', basis: '2026 처우개선 보도자료', type: 'variable' },
  { name: '비상근무수당', amount: '1회 16,000원, 월 최대 180,000원', basis: '2026 처우개선 보도자료', type: 'variable' },
  { name: '시간외근무수당', amount: '근무시간 기준 산정', basis: '공무원수당규정', type: 'variable' },
  { name: '가족수당', amount: '배우자·자녀 수 기준 차등', basis: '공무원수당규정', type: 'variable' },
  // 연간 특별 지급
  { name: '정근수당', amount: '연 2회 (1월·7월)', basis: '공무원수당규정', type: 'annual' },
  { name: '명절휴가비', amount: '연 2회 (설·추석)', basis: '공무원수당규정', type: 'annual' },
  { name: '연가보상비', amount: '미사용 연가 기준', basis: '공무원수당규정', type: 'annual' },
  { name: '성과상여금', amount: '등급별 차등 (S/A/B)', basis: '공무원성과급규정', type: 'annual' },
];
```

### 3-4. 입직 방법 데이터

```ts
export const entryMethods: EntryMethod[] = [
  {
    id: 'constable-exam',
    name: '순경 공채',
    startRank: '순경 1호봉',
    salaryNote: '공식 봉급표 기준',
    description: '일반 공개경쟁채용시험 합격 후 순경으로 임용',
  },
  {
    id: 'police-university',
    name: '경찰대학',
    startRank: '졸업 후 경위 임용',
    salaryNote: '재학 중 별도 지급 (별표 10 비고), 졸업 후 경위 봉급표 적용',
    description: '4년제 경찰대학 졸업 후 경위로 임용. 재학 중 별표 10 비고 기준 지급',
  },
  {
    id: 'officer-candidate',
    name: '경위 공채 (간부후보생)',
    startRank: '교육 중 경위 1호봉의 80%',
    salaryNote: '임용 후 경위 봉급표 적용',
    description: '경위 공개경쟁채용시험 합격, 교육 기간 중 임용예정 계급 1호봉의 80% 지급',
  },
  {
    id: 'special',
    name: '특별채용',
    startRank: '분야별 상이',
    salaryNote: '채용 분야·계급별 별도 안내',
    description: '법학·사이버·외국어 등 특기 분야 별도 채용. 임용 계급 다양',
  },
];
```

---

## 4. 화면 구조

### 4-1. 섹션 순서

```
[A] Hero
[B] InfoNotice (출처 고지)
[C] Hero KPI 카드 4종
[D] 계급 카드 그리드 + 상세 호봉 패널
[E] 예상 연봉 바 차트
[F] 수당 구조 (3탭: 고정/변동/연간)
[G] 승진 경로 & 근속 구조
[H] 30년 생애 소득 시뮬레이션
[I] 입직 방법 비교
[J] FAQ
[K] 관련 콘텐츠 CTA
[L] SeoContent
```

### 4-2. [A] Hero

```html
<!-- CalculatorHero 컴포넌트 사용 -->
<CalculatorHero
  title="경찰관 계급별 연봉·호봉 완전 정리 2026"
  subtitle="2026년 공식 봉급표 기준 · 순경~치안정감 계급별 기본급과 수당 구조 비교"
  badges={['비교계산소 리포트', '2026 최신']}
/>
```

### 4-3. [B] InfoNotice

```html
<InfoNotice>
  기본급은 공무원보수규정 별표 10(2026.1.2 개정) 기준입니다.
  예상 연봉·실수령은 주요 수당을 포함한 <strong>추정치</strong>이며, 개인 근무 조건에 따라 달라집니다.
</InfoNotice>
```

### 4-4. [C] Hero KPI 카드 4종

```
┌──────────┐  ┌──────────┐  ┌────────────┐  ┌────────────────┐
│ 계급 수   │  │ 2026 인상│  │ 순경 1호봉 │  │ 9급 초임 월 보수│
│  11단계   │  │  3.5%    │  │ 213.3만 원 │  │ 월 평균 286만   │
└──────────┘  └──────────┘  └────────────┘  └────────────────┘
```

> 네 번째 카드 출처: 인사혁신처 2026 보도자료. `공식` 배지 적용.

### 4-5. [D] 계급 카드 그리드

**UI 구조:**
- 카드 2열(모바일) / 4열(데스크톱) 그리드
- 각 카드 상단에 계급 색상 바 (계급군별 색상 분리: 하위직/중간직/간부급)
- 카드 클릭 → 해당 계급 상세 패널 오픈 (accordion 방식)

**카드 구성:**
```
┌─────────────────────────────┐
│ [계급색상 바]                │
│ 순경              공식 배지 │
│ 9급 상당                    │
│ 1호봉 기본급: 213.3만 원    │
│ 예상 체감 월 보수: 290~330만 (추정)│
│ [상세 보기 ↓]              │
└─────────────────────────────┘
```

**상세 패널 (카드 하단 accordion):**
```
┌─────────────────────────────────────────┐
│ 순경 호봉표 (공무원보수규정 별표 10)     │
│                                          │
│ 호봉  기본급                            │
│   1   2,133,000원                        │
│   2   2,158,500원                        │
│  ...                                    │
│  [대표 호봉 하이라이트 표시]             │
│                                          │
│ 예상 실수령 (추정): 월 290~330만 원     │
│ 예상 연봉 (추정): 약 3,600만 원         │
└─────────────────────────────────────────┘
```

### 4-6. [E] 예상 연봉 바 차트

- Horizontal bar chart (Chart.js)
- x축: 연봉 (만 원)
- y축: 계급명
- 데이터: `estimatedAnnual` (추정값)
- 차트 상단 설명 문구:
  > 기본급(대표 호봉) × 12 + 정액급식비 + 직급보조비 + 정근수당 + 명절휴가비 등 주요 항목을 반영한 **추정치**입니다.

### 4-7. [F] 수당 구조 (3탭)

탭: `고정 수당` | `변동 수당` | `연간 특별 지급`

각 탭은 수당 카드 목록으로 구성:
```
[수당명]  [금액]  [법령 근거 뱃지]
```

> 법령으로 확인 가능한 항목만 포함. 불확실 항목은 범위형 또는 "차등" 표기.

### 4-8. [G] 승진 경로 & 근속 구조

**표 형식**: 일반적 커리어 흐름 예시 (`참고용` 배지 필수)

| 계급 | 일반 근속 기간 (참고) | 비고 |
|---|---|---|
| 순경 | 입직 ~ 4년 | 시험 합격 여부에 따라 차이 |
| 경장 | 4년 이후 | 근무 성적 반영 |
| 경사 | ~ 10년 | — |
| 경위 | ~ 15년 | 승진 시험 또는 심사 |
| 경감 | ~ 20년 | — |
| 경정 이상 | 20년 이후 | 간부급 |

> 승진 연수는 공식 통계 아님. 개인 승진 속도·시험 여부·보직에 따라 차이.

### 4-9. [H] 30년 생애 소득 시뮬레이션

- 입직 방식(순경/경위) 선택 → 추정 누적 보수 시각화
- 연도별 추정 연봉 꺾은선 그래프 또는 누적 바 차트
- **"보수적 추정 · 예시 · 개인별 차이 큼"** 안내 박스 필수
- 수치 고정 대신 슬라이더로 승진 속도 조절 가능하게 구성:
  - 입직 방식 선택 (순경 / 경위)
  - 승진 속도 (빠름 / 보통 / 느림) 토글
  - 결과: 추정 누적 보수, 추정 퇴직 시 계급

### 4-10. [I] 입직 방법 비교

카드 4종 (순경 공채 / 경찰대 / 경위 공채 / 특채):
```
[입직방식]  [시작 계급]  [급여 기준]  [설명]
```

### 4-11. [J] FAQ

5개 필수 포함:
1. 경찰 순경 초봉은 얼마인가요?
2. 경찰대 졸업하면 몇 계급으로 시작하나요?
3. 경찰 월급은 기본급만 받나요?
4. 경찰과 소방 연봉은 어느 쪽이 더 높은가요?
5. 경찰 호봉은 몇 년마다 오르나요?

### 4-12. [K] 관련 콘텐츠 CTA

| 위치 | 연결 대상 | 문구 |
|---|---|---|
| Hero 하단 | `/tools/salary-calculator/` | 내 연봉 실수령 계산해보기 |
| 수당 구조 하단 | `/tools/net-salary/` | 실수령 계산기로 직접 확인 |
| 페이지 하단 | 소방관 연봉 리포트 (예정) | 소방관 연봉과 비교해보기 |
| 페이지 하단 | 대기업 연봉 리포트 | 대기업 연봉 성장 비교 |

---

## 5. 인터랙션 상태 관리 (`police-salary-2026.js`)

### 5-1. 계급 카드 클릭

```js
// 상태
let activeRankId = null;

// 카드 클릭 시
function toggleRankPanel(rankId) {
  if (activeRankId === rankId) {
    closePanel(rankId);
    activeRankId = null;
  } else {
    if (activeRankId) closePanel(activeRankId);
    openPanel(rankId);
    activeRankId = rankId;
  }
}
```

### 5-2. 수당 탭

```js
// 탭 전환
function switchAllowanceTab(type) {
  // 'fixed' | 'variable' | 'annual'
  document.querySelectorAll('.ps-allowance-tab').forEach(tab => {
    tab.classList.toggle('is-active', tab.dataset.type === type);
  });
  document.querySelectorAll('.ps-allowance-list').forEach(list => {
    list.hidden = list.dataset.type !== type;
  });
}
```

### 5-3. 예상 연봉 바 차트

```js
// Chart.js horizontal bar
// 데이터: ranks.map(r => ({ label: r.name, value: r.estimatedAnnual / 10000 }))
// 툴팁: '추정 연봉 약 XXX만 원'
```

### 5-4. 생애 소득 시뮬레이션

```js
// 입직 방식 / 승진 속도 선택 시 재계산
function calcLifetimeIncome(entryMethod, promotionSpeed) {
  // 선택된 커리어 경로 배열 → 연도별 추정 연봉 합산
  // 결과: 추정 누적 보수
}
```

### 5-5. URL 파라미터 (공유 기능)

```
/reports/police-salary-2026/?rank=gyeong-sa
```
- `rank`: 초기 오픈할 계급 id
- 페이지 로드 시 해당 패널 자동 오픈

---

## 6. SCSS 설계 (`_police-salary-2026.scss`)

### 6-1. Prefix 규칙

모든 클래스는 `ps-` prefix 사용.

```scss
.ps-hero-kpi         // Hero KPI 카드 영역
.ps-rank-grid        // 계급 카드 그리드
.ps-rank-card        // 개별 계급 카드
.ps-rank-card--active // 선택 상태
.ps-rank-bar         // 계급 색상 바 (상단)
.ps-rank-panel       // 호봉 상세 패널 (accordion)
.ps-step-table       // 호봉 테이블
.ps-step-row--highlight // 대표 호봉 하이라이트
.ps-chart-wrap       // 바 차트 래퍼
.ps-allowance-tabs   // 수당 탭 영역
.ps-allowance-tab    // 개별 탭 버튼
.ps-allowance-tab--active
.ps-allowance-list   // 수당 목록
.ps-allowance-card   // 개별 수당 카드
.ps-career-table     // 승진 경로 테이블
.ps-entry-grid       // 입직 방법 카드 그리드
.ps-entry-card       // 입직 방법 개별 카드
.ps-lifetime-sim     // 생애 소득 시뮬레이션 영역
.ps-badge-official   // '공식' 배지
.ps-badge-estimate   // '추정' 배지
```

### 6-2. 계급 색상 바

```scss
$ps-rank-colors: (
  'soon-gyeong':    #4a90d9,   // 순경 — 블루
  'gyeong-jang':    #4a90d9,
  'gyeong-sa':      #5b8dd9,
  'gyeong-wi':      #2c5f9e,   // 경위~경감 — 미드 블루
  'gyeong-gam':     #2c5f9e,
  'gyeong-jeong':   #1a3f72,   // 경정~총경 — 딥 네이비
  'chong-gyeong':   #1a3f72,
  'gyeong-mu-gwan': #0d1f3c,   // 경무관 이상 — 다크 네이비
  'chi-an-gam':     #0d1f3c,
  'chi-an-jeong-gam': #0d1f3c,
);
```

### 6-3. 배지 스타일

```scss
.ps-badge-official {
  background: #e8f4e8;
  color: #2d7a2d;
  border: 1px solid #2d7a2d;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 3px;
}

.ps-badge-estimate {
  background: #fff8e6;
  color: #b8780a;
  border: 1px solid #b8780a;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 3px;
}
```

---

## 7. SEO 설계

### 7-1. 메타

```
title: 경찰관 계급별 연봉·호봉 완전 정리 2026 | 비교계산소
description: 2026년 경찰공무원 계급별 기본급, 호봉표, 수당, 예상 실수령액을 한눈에 비교합니다. 순경부터 치안정감까지 공식 봉급표 기준으로 정리했습니다.
```

### 7-2. H 태그 구조

```
H1: 경찰관 계급별 연봉·호봉 완전 정리 2026
H2: 계급별 기본급 비교
H2: 계급별 예상 연봉 비교
H2: 2026 수당 구조
H2: 승진 경로와 근속 구조
H2: 30년 생애 소득 시뮬레이션
H2: 입직 방법 비교
H2: 자주 묻는 질문
```

### 7-3. JSON-LD

- `FAQPage` 스키마 (5개 FAQ)
- `Article` 스키마 (datePublished: 2026-04-10, author: 비교계산소)

### 7-4. 내부 링크 최소 3개

- 연봉 실수령 계산기 (`/tools/salary-calculator/`)
- 실수령 계산기 (`/tools/net-salary/`)
- 대기업 연봉 성장 리포트 (`/reports/large-company-salary-growth-by-years-2026/`)

---

## 8. `src/data/reports.ts` 등록

```ts
{
  slug: 'police-salary-2026',
  title: '경찰관 계급별 연봉·호봉 완전 정리 2026',
  description: '순경~치안정감 계급별 기본급, 호봉표, 수당 구조를 공식 봉급표 기준으로 비교합니다.',
  category: '직업·연봉',
  tags: ['경찰', '공무원', '연봉', '호봉표', '2026'],
  publishedAt: '2026-04-10',
  order: /* 기존 마지막 순번 + 1 */,
}
```

---

## 9. 구현 순서

1. `src/data/policeSalary2026.ts` — 계급·호봉·수당·입직 데이터 작성
2. `src/data/reports.ts` — 메타 등록
3. `src/pages/reports/police-salary-2026.astro` — 마크업 (섹션 A~L)
4. `src/styles/scss/pages/_police-salary-2026.scss` — 스타일 작성
5. `src/styles/app.scss` — 파셜 import 추가
6. `public/scripts/police-salary-2026.js` — 인터랙션 구현
7. `public/sitemap.xml` — URL 추가
8. `npm run build` — 빌드 확인

---

## 10. QA 체크리스트

### 데이터
- [ ] 기본급 수치가 공무원보수규정 별표 10(2026.1.2 개정)과 일치하는가
- [ ] `estimatedAnnual`·`estimatedMonthlyRange` 모두 `추정` 배지가 붙어 있는가
- [ ] 치안총감 데이터가 노출되지 않는가 (공식 범위 초과)
- [ ] 수당 항목 중 근거 없는 항목이 없는가

### 인터랙션
- [ ] 계급 카드 클릭 시 호봉 패널이 정상 열림/닫힘
- [ ] 한 번에 하나의 패널만 열리는가
- [ ] 수당 탭 전환이 정상 작동하는가
- [ ] 생애 소득 시뮬레이션에서 입직 방식·승진 속도 변경 시 결과가 재계산되는가
- [ ] URL 파라미터 `?rank=xxx` 로 접근 시 해당 패널이 초기 오픈되는가

### SEO
- [ ] FAQ 5개 이상 포함되는가
- [ ] `공식` / `추정` 배지가 구분되어 노출되는가
- [ ] JSON-LD FAQPage 스키마가 정상 삽입되는가
- [ ] 내부 링크 3개 이상 포함되는가
- [ ] sitemap.xml에 URL이 추가되었는가

### 빌드
- [ ] `npm run build` 에러 없음
- [ ] `/reports/police-salary-2026/` 라우트가 `dist/`에 생성되는가
- [ ] 모바일(375px) 레이아웃에서 카드·표·차트가 깨지지 않는가
