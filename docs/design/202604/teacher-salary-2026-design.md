# 학교 선생님 연봉·호봉 완전 정리 2026 — 설계 문서

> 기획 원문: `docs/plan/202604/teacher-salary-2026.md`
> 작성일: 2026-04-11
> 구현 기준: Claude/Codex가 이 문서를 보고 바로 구현에 착수할 수 있는 수준으로 고정
> 참고 리포트: `police-salary-2026`, `nurse-salary-2026` (카드·탭·차트 패턴 재사용)

---

## 1. 문서 개요

### 1-1. 대상

- 기획 문서: `docs/plan/202604/teacher-salary-2026.md`
- 구현 대상: `학교 선생님 연봉·호봉 완전 정리 2026`
- 콘텐츠 유형: 인터랙티브 비교 리포트 (`/reports/` 계열)

### 1-2. 문서 역할

- 기획 문서를 현재 비교계산소 `/reports/` 구조에 맞게 실제 구현 직전 수준으로 재구성한 설계 문서다.
- 화면 구조, 데이터 스키마, 인터랙션 상태, SCSS prefix, QA 기준을 고정한다.
- 이후 구현자는 이 문서를 기준으로 `src/data/`, `src/pages/reports/`, `public/scripts/`, `src/styles/` 작업을 진행한다.

### 1-3. 페이지 성격

- **공통 봉급표 + 학교급·수당 구조 콘텐츠**: 교대·사범대 진학 고민자, 임용 준비생, 직업 탐색 사용자의 정보 니즈 충족
- **핵심 흐름**: `2026 핵심 수치 파악 → 초등·중·고 차이 비교 → 호봉표 확인 → 수당 구조 이해 → 공립·사립 비교 → 연봉 시뮬레이션 → 진입 경로 확인 → 관련 계산기 연결`
- **경찰/소방과 차이**: 계급 대신 **호봉 단일 체계** (1~40호봉 + 근속가봉); 학교급별 시작 호봉·수당 구조 비교가 핵심
- **SEO 포지셔닝**: `교사 연봉`, `교사 호봉표`, `선생님 월급`, `초등교사 연봉`, `기간제교사 월급` 고검색량 키워드 커버

### 1-4. 권장 slug

- `teacher-salary-2026`
- URL: `/reports/teacher-salary-2026/`

### 1-5. 권장 파일 구조

```
src/
  data/
    teacherSalary2026.ts          ← 호봉표·수당·진입경로·공립사립 통합 데이터
  pages/
    reports/
      teacher-salary-2026.astro

public/
  scripts/
    teacher-salary-2026.js        ← 호봉 패널, 탭, 차트, 시뮬레이션 인터랙션

src/styles/scss/pages/
  _teacher-salary-2026.scss       ← 페이지 전용 스타일 (prefix: ts-)
```

---

## 2. 현재 프로젝트 기준 정리

### 2-1. 기존 리포트 공통 구조

1. `CalculatorHero`
2. `InfoNotice` (데이터 출처 고지)
3. Hero KPI 카드
4. 핵심 인터랙티브 섹션
5. 비교 차트
6. 수당 구조 (탭)
7. 공립·사립 비교
8. 연봉 시뮬레이션
9. 워라밸 비교
10. 진입 경로
11. FAQ
12. 관련 콘텐츠 CTA
13. `SeoContent`

### 2-2. 기존 경찰/소방 리포트와의 차이

| 항목 | 경찰/소방 리포트 | 교사 리포트 |
|---|---|---|
| 기본 구조 | 계급별 카드 + 호봉 패널 | **호봉 단일 체계** + 학교급 비교 카드 |
| 비교 축 | 계급 | **학교급(초등·중학교·고등학교)·기간제** |
| 시작 기준 | 1호봉 | **신규 교사 9호봉** 시작 |
| 차별화 섹션 | 입직/계급 구조 | **공립·사립 비교, 교직수당·담임수당 구조** |
| 수치 표현 | 공식 봉급표 중심 | 공식 봉급표 + **세후 추정 실수령 함께 제시** |

### 2-3. 현재 구현 패턴

- 메타 등록: `src/data/reports.ts`
- 페이지 데이터: `src/data/teacherSalary2026.ts`
- 페이지 마크업: `src/pages/reports/teacher-salary-2026.astro`
- 클라이언트 인터랙션: `public/scripts/teacher-salary-2026.js`
- 페이지 전용 스타일: `src/styles/scss/pages/_teacher-salary-2026.scss`

---

## 3. 데이터 스키마

### 3-1. `teacherSalary2026.ts` 구조

```ts
// ===== 호봉 데이터 (공식 봉급표: 인사혁신처 2026.1.2 개정) =====
export type TeacherStep = {
  step: number;              // 호봉 (1~40)
  monthlyBase: number;       // 월 기본급 (원)
  annualGross: number;       // 세전 연봉 = monthlyBase × 12
  monthlyNetEstimate: number; // 세후 실수령 추정 (원, 미혼·부양가족 없음 기준)
  label?: string;            // 'entry' | '5yr' | '10yr' | ... (대표 구간 배지)
};

// ===== 학교급 비교 =====
export type SchoolLevel = {
  id: 'elementary' | 'middle' | 'high' | 'special' | 'fixed_term';
  name: string;              // '초등교사'
  entryStep: number;         // 신규 시작 호봉 (9, 8, 10 등)
  entryStepBasis: string;    // '교대 4년 기준'
  qualificationNote: string; // '초등 정교사 자격증'
  classTeacherRate: string;  // '대부분 담임' | '담임 여부 별도 배정'
  overtimeNote: string;      // '시간외 상대적 적음' | '야자 등 발생 가능'
  characteristics: string[]; // 체감 포인트 배열
  badge: string;             // '담임 체감 큼'
  estimatedEntryMonthly: [number, number]; // 체감 초임 월 보수 범위 (추정)
};

// ===== 수당 =====
export type TeacherAllowance = {
  name: string;
  amount: string;            // '월 250,000원'
  condition: string;         // '전 교사 공통'
  basis: string;             // '공무원수당규정'
  type: 'fixed' | 'role' | 'annual';
};

// ===== 공립 vs 사립 =====
export type PublicPrivateItem = {
  category: string;          // '봉급표'
  public: string;            // '국가 교원 봉급표 적용'
  private: string;           // '동일 봉급표 적용(원칙)'
  note?: string;
};

// ===== 진입 경로 =====
export type TeacherEntryPath = {
  id: string;
  name: string;              // '초등 임용고시'
  qualification: string;     // '초등 정교사 2급'
  entryStep: number;
  entryStepBasis: string;
  description: string;
};

// ===== 업무 강도 (편집 기준) =====
export type WorkloadItem = {
  category: string;          // '생활지도'
  elementary: '낮음' | '중간' | '높음' | '매우 높음';
  middle: '낮음' | '중간' | '높음' | '매우 높음';
  high: '낮음' | '중간' | '높음' | '매우 높음';
};

// ===== Hero KPI =====
export const heroStats = {
  increaseRate2026: '3.5%',
  entryStep: 9,
  entryMonthlyBase: 2_495_600,
  step40MonthlyBase: 6_205_700,
  hobongCount: 40,
} as const;
```

### 3-2. 호봉표 데이터 (공식, 인사혁신처 2026.1.2 개정)

> **전체 40호봉 배열**을 `teacherSteps` 로 export한다.
> 세후 추정은 미혼·부양가족 없음 기준 (국민연금 4.5%, 건강보험 3.545%, 장기요양 0.46%, 고용보험 0.9%, 소득세).

| 호봉 | 월 기본급(원) | 세전 연봉(원) | 세후 실수령 추정(원) | label |
|---|---|---|---|---|
| 1 | 2,041,500 | 24,498,000 | 1,830,000 | — |
| 2 | 2,068,600 | 24,823,200 | 1,855,000 | — |
| 3 | 2,096,400 | 25,156,800 | 1,880,000 | — |
| 4 | 2,181,000 | 26,172,000 | 1,955,000 | — |
| 5 | 2,291,500 | 27,498,000 | 2,055,000 | `5호봉` |
| 6 | 2,346,300 | 28,155,600 | 2,100,000 | — |
| 7 | 2,401,900 | 28,822,800 | 2,150,000 | — |
| 8 | 2,447,900 | 29,374,800 | 2,195,000 | — |
| **9** | **2,495,600** | **29,947,200** | **2,235,000** | `신입(교대·사범대)` |
| 10 | 2,516,700 | 30,200,400 | 2,255,000 | `10호봉` |
| 11 | 2,580,000 | 30,960,000 | 2,310,000 | — |
| 12 | 2,650,000 | 31,800,000 | 2,370,000 | — |
| 13 | 2,720,000 | 32,640,000 | 2,435,000 | — |
| 14 | 2,805,000 | 33,660,000 | 2,510,000 | `14호봉` |
| 15 | 2,889,700 | 34,676,400 | 2,585,000 | — |
| 16 | 2,978,000 | 35,736,000 | 2,660,000 | — |
| 17 | 3,068,000 | 36,816,000 | 2,740,000 | — |
| 18 | 3,161,000 | 37,932,000 | 2,820,000 | — |
| 19 | 3,257,000 | 39,084,000 | 2,905,000 | `20호봉 전후` |
| 20 | 3,481,000 | 41,772,000 | 3,105,000 | — |
| 21 | 3,600,700 | 43,208,400 | 3,205,000 | `21호봉` |
| 22 | 3,730,000 | 44,760,000 | 3,315,000 | — |
| 23 | 3,860,000 | 46,320,000 | 3,425,000 | — |
| 24 | 3,994,000 | 47,928,000 | 3,540,000 | — |
| 25 | 4,129,400 | 49,552,800 | 3,655,000 | — |
| 26 | 4,268,000 | 51,216,000 | 3,770,000 | — |
| 27 | 4,410,000 | 52,920,000 | 3,890,000 | — |
| 28 | 4,545,000 | 54,540,000 | 4,005,000 | — |
| 29 | 4,682,100 | 56,185,200 | 4,120,000 | — |
| 30 | 4,826,800 | 57,921,600 | 4,240,000 | `30호봉` |
| 31 | 4,974,000 | 59,688,000 | 4,365,000 | — |
| 32 | 5,118,000 | 61,416,000 | 4,480,000 | — |
| 33 | 5,265,000 | 63,180,000 | 4,600,000 | — |
| 34 | 5,410,000 | 64,920,000 | 4,715,000 | — |
| 35 | 5,553,600 | 66,643,200 | 4,830,000 | — |
| 36 | 5,696,000 | 68,352,000 | 4,945,000 | — |
| 37 | 5,839,000 | 70,068,000 | 5,060,000 | — |
| 38 | 5,980,000 | 71,760,000 | 5,170,000 | — |
| 39 | 6,093,000 | 73,116,000 | 5,265,000 | — |
| **40** | **6,205,700** | **74,468,400** | **5,355,000** | `40호봉` |

> 40호봉 이후: 근속가봉(근가호봉) 적용. 1호봉당 약 35,000~40,000원 추가 가산. `참고` 배지 필수.

### 3-3. 학교급 비교 데이터

```ts
export const schoolLevels: SchoolLevel[] = [
  {
    id: 'elementary',
    name: '초등교사',
    entryStep: 9,
    entryStepBasis: '교대 4년 졸업 기준',
    qualificationNote: '초등 정교사 2급 → 임용고시 합격',
    classTeacherRate: '대부분 담임 배정',
    overtimeNote: '시간외수당 상대적으로 적음',
    characteristics: ['전 과목 담당', '학부모 소통 많음', '생활지도 비중 높음'],
    badge: '담임 체감 큼',
    estimatedEntryMonthly: [2_800_000, 3_100_000],
  },
  {
    id: 'middle',
    name: '중학교 교사',
    entryStep: 9,
    entryStepBasis: '사범대 4년 기준 (비사범계 교직이수는 8호봉)',
    qualificationNote: '중등 정교사 2급(표시과목) → 임용고시 합격',
    classTeacherRate: '담임 여부 학교별 배정',
    overtimeNote: '방과후·야간자율학습 등 발생 가능',
    characteristics: ['표시과목 전담', '시험·평가 비중 높음', '진학지도 시작'],
    badge: '과목 차이 큼',
    estimatedEntryMonthly: [2_650_000, 3_100_000],
  },
  {
    id: 'high',
    name: '고등학교 교사',
    entryStep: 9,
    entryStepBasis: '사범대 4년 기준',
    qualificationNote: '중등 정교사 2급(표시과목) → 임용고시 합격',
    classTeacherRate: '담임 여부 학교별 배정',
    overtimeNote: '야자 지도·입시 상담 등 발생 시 시간외수당 증가',
    characteristics: ['내신·수능 연계 높음', '입시 진학 부담', '과목별 편차 큼'],
    badge: '입시 부담 큼',
    estimatedEntryMonthly: [2_650_000, 3_300_000],
  },
  {
    id: 'special',
    name: '특수교사',
    entryStep: 10,
    entryStepBasis: '특수교육 관련학과 졸업 (+1호봉 가산)',
    qualificationNote: '특수 정교사 2급 → 임용고시 합격',
    classTeacherRate: '소규모 학급 담임',
    overtimeNote: '수당 추가 지급',
    characteristics: ['특수학교·특수학급 배치', '특수교사 수당 12만원 추가'],
    badge: '+1호봉 가산',
    estimatedEntryMonthly: [2_900_000, 3_200_000],
  },
  {
    id: 'fixed_term',
    name: '기간제교사',
    entryStep: 8,
    entryStepBasis: '경력 없음 기준 (경력 인정 시 호봉 조정)',
    qualificationNote: '정교사 자격증 보유 시 지원 가능',
    classTeacherRate: '담임 배정 학교별 상이',
    overtimeNote: '시간제는 근무시간 비례 지급',
    characteristics: ['호봉 산정 후 고정급 원칙', '공무원연금 미적용', '계약 만료 갱신 구조'],
    badge: '고정급 원칙',
    estimatedEntryMonthly: [2_400_000, 2_700_000],
  },
];
```

> 시작 호봉 조정 요인 (`참고` 배지 필수):
> - 군 복무: 최대 3호봉 가산
> - 기간제 교직 경력: 인정 범위 내 가산
> - 대학원 석사: +1호봉, 박사: +2호봉 (학교·교육청 기준 상이)

### 3-4. 수당 데이터

```ts
export const allowances: TeacherAllowance[] = [
  // 고정 수당
  { name: '교직수당', amount: '월 250,000원', condition: '전 교사 공통', basis: '공무원수당규정', type: 'fixed' },
  { name: '정액급식비', amount: '월 160,000원', condition: '전 공무원 공통', basis: '공무원수당규정 제18조', type: 'fixed' },
  { name: '교원연구비', amount: '월 60,000~70,000원', condition: '경력 5년 미만 7만원, 이상 6만원', basis: '공무원수당규정', type: 'fixed' },
  // 역할 수당
  { name: '담임수당', amount: '월 200,000원', condition: '담임교사 배정 시', basis: '공무원수당규정', type: 'role' },
  { name: '보직수당', amount: '월 150,000원', condition: '교무·연구·학생부장 등', basis: '공무원수당규정', type: 'role' },
  { name: '특수교사 수당', amount: '월 120,000원', condition: '특수학교·특수학급 배치 시', basis: '공무원수당규정', type: 'role' },
  // 연간 특별 지급
  { name: '명절휴가비', amount: '본봉의 60% (연 2회)', condition: '설·추석', basis: '공무원수당규정', type: 'annual' },
  { name: '성과상여금', amount: 'S·A·B 등급제 차등', condition: '연 1회', basis: '공무원성과급규정', type: 'annual' },
  { name: '연가보상비', amount: '미사용 연가 기준', condition: '해당 연도 미사용 연가 발생 시', basis: '공무원수당규정', type: 'annual' },
  { name: '정근수당', amount: '연 2회 (1월·7월)', condition: '근속 연수 기준 차등', basis: '공무원수당규정', type: 'annual' },
];
```

### 3-5. 공립 vs 사립 비교 데이터

```ts
export const publicPrivateComparison: PublicPrivateItem[] = [
  { category: '봉급표', public: '국가 교원 봉급표 (단일)', private: '동일 봉급표 적용 (원칙)' },
  { category: '연금', public: '공무원연금', private: '사학연금 (수준 유사)' },
  { category: '정년', public: '62세 보장', private: '학교법인 규정에 따라 상이' },
  { category: '복지·수당', public: '전국 균일', private: '학교별 편차 큼 (추가 수당 학교마다 다름)', note: '참고' },
  { category: '안정성', public: '높음', private: '학교 재정에 따라 리스크 있음', note: '참고' },
  { category: '인사·전보', public: '5년 단위 순환전보 (교육청 관할)', private: '동일 학교 장기 근무 가능' },
];
```

### 3-6. 업무 강도 비교 데이터 (`편집부 기준` 배지 필수)

```ts
export const workloadComparison: WorkloadItem[] = [
  { category: '생활지도',   elementary: '높음',    middle: '중간~높음', high: '중간' },
  { category: '학부모 소통', elementary: '높음',    middle: '중간',     high: '중간' },
  { category: '시험·평가',  elementary: '중간',    middle: '높음',     high: '매우 높음' },
  { category: '진학상담',   elementary: '낮음',    middle: '중간',     high: '매우 높음' },
  { category: '입시 부담',  elementary: '낮음',    middle: '중간',     high: '높음' },
  { category: '행정 업무',  elementary: '중간~높음', middle: '중간',     high: '중간' },
];
```

### 3-7. 진입 경로 데이터

```ts
export const entryPaths: TeacherEntryPath[] = [
  {
    id: 'elementary',
    name: '초등 임용고시',
    qualification: '초등 정교사 2급',
    entryStep: 9,
    entryStepBasis: '교육대학교 4년 졸업',
    description: '전국 17개 교육청 별도 시험. 교대 졸업 후 해당 시도교육청 응시.',
  },
  {
    id: 'secondary-major',
    name: '중등 임용고시 (사범대)',
    qualification: '중등 정교사 2급 (표시과목)',
    entryStep: 9,
    entryStepBasis: '사범계 4년 졸업',
    description: '표시과목별 인원 선발. 국어·수학·영어·과학 등 과목별 경쟁률 상이.',
  },
  {
    id: 'secondary-education',
    name: '중등 임용고시 (비사범계 교직이수)',
    qualification: '중등 정교사 2급 (교직이수)',
    entryStep: 8,
    entryStepBasis: '비사범계 4년 + 교직과목 이수',
    description: '사범대 졸업보다 1호봉 낮게 시작. 교직이수 학점 충족 필요.',
  },
  {
    id: 'special',
    name: '특수교사 임용고시',
    qualification: '특수 정교사 2급',
    entryStep: 10,
    entryStepBasis: '특수교육 관련학과 졸업 (+1호봉 가산)',
    description: '특수학교 또는 일반학교 특수학급 배치. 별도 가산 호봉 적용.',
  },
  {
    id: 'fixed-term',
    name: '기간제교사',
    qualification: '정교사 자격증 (2급 이상)',
    entryStep: 8,
    entryStepBasis: '경력 없음 기준',
    description: '학교 단위 계약 채용. 공무원연금 미적용, 호봉 산정 후 고정급 원칙.',
  },
];
```

### 3-8. Hero KPI 및 총보상 요약

```ts
export const heroStats = {
  increaseRate2026: '3.5%',       // 공식 (2026년 인상률)
  entryStep: 9,                   // 공식 (신입 교대·사범대 기준)
  entryMonthlyBase: 2_495_600,    // 공식 (9호봉 기본급)
  step40MonthlyBase: 6_205_700,   // 공식 (40호봉 기본급)
  hobongCount: 40,                // 공식
} as const;

// 총보상 패키지 (추정, 추정 배지 필수)
export const totalCompPackage = [
  { label: '신규 (9호봉)', annualBase: 29_947_200, estimated: [35_000_000, 38_000_000], note: '교직수당+담임+식대 포함 추정' },
  { label: '10년차 (19호봉)', annualBase: 39_084_000, estimated: [48_000_000, 52_000_000], note: '보직·성과 여부에 따라 상이' },
  { label: '20년차 (29호봉)', annualBase: 56_185_200, estimated: [64_000_000, 70_000_000], note: '명절휴가비 포함' },
  { label: '30년차 (39호봉)', annualBase: 73_116_000, estimated: [80_000_000, 85_000_000], note: '고경력 보전수당 포함 추정' },
] as const;
```

---

## 4. 화면 구조

### 4-1. 섹션 순서

```
[A] Hero
[B] InfoNotice (출처 고지)
[C] Hero KPI 카드 4종
[D] 초등 vs 중학교 vs 고등학교 비교 카드 (+ 기간제 포함 5종)
[E] 2026 교원 호봉표 (대표 구간 패널 + 전체 펼치기)
[F] 대표 호봉 구간별 예상 연봉 바 차트
[G] 수당 구조 (3탭: 고정/역할/연간)
[H] 공립 vs 사립 비교
[I] 연차별 예상 연봉 시뮬레이션
[J] 업무 강도·워라밸 비교
[K] 교사 되는 길 (진입 경로)
[L] FAQ
[M] 관련 콘텐츠 CTA
[N] SeoContent
```

### 4-2. [A] Hero

```html
<CalculatorHero
  title="학교 선생님 연봉·호봉 완전 정리 2026"
  subtitle="2026년 교원 봉급표 기준 · 초등·중학교·고등학교 선생님 월급과 기간제 차이까지 한눈에 비교"
  badges={['비교계산소 리포트', '2026 최신']}
/>
```

### 4-3. [B] InfoNotice

```html
<InfoNotice>
  기본급(본봉)은 인사혁신처 2026년 고시 「유치원·초등학교·중학교·고등학교 교원 등의 봉급표」 기준입니다.
  세후 실수령 추정은 미혼·부양가족 없음 기준이며, 개인 공제 조건에 따라 달라집니다.
  수당은 담임·보직·학교 유형에 따라 편차가 있습니다.
</InfoNotice>
```

### 4-4. [C] Hero KPI 카드 4종

```
┌────────────┐  ┌────────────┐  ┌──────────────┐  ┌──────────────┐
│ 2026 인상률 │  │  신입 시작  │  │ 9호봉 기본급  │  │ 40호봉 기본급 │
│   3.5%     │  │  9호봉     │  │  249.6만 원  │  │  620.6만 원  │
│  공식       │  │  공식       │  │  공식         │  │  공식         │
└────────────┘  └────────────┘  └──────────────┘  └──────────────┘
```

> 모든 카드: `공식` 배지. 세 번째·네 번째 카드 부제: "교대·사범대 졸업 기준", "40호봉 기준"

### 4-5. [D] 학교급 비교 카드

**UI 구조:**
- 5개 카드 (초등 / 중학교 / 고등학교 / 특수교사 / 기간제)
- 카드 상단 색상 바 (학교급별 색상 분리)
- 활성 카드 → 아래 상세 패널 오픈 (accordion)

**카드 구성:**
```
┌─────────────────────────────┐
│ [색상 바]                    │
│ 초등교사           공식 배지 │
│ 교대 4년 → 9호봉 시작         │
│ 기본급 249.6만 원/월          │
│ 체감 초임: 280~310만 원 (추정) │
│ [상세 보기 ↓]                │
└─────────────────────────────┘
```

**상세 패널 (accordion):**
```
┌──────────────────────────────────────────┐
│ 초등교사 특징                              │
│ • 전 과목 담당, 학부모 소통 비중 높음        │
│ • 담임수당 거의 전원 수령 (월 +20만원)       │
│ • 시간외수당 상대적으로 적음                 │
│                                           │
│ 호봉 시작 기준                             │
│   교대 4년: 9호봉  (기본급 249.6만원)        │
│   군 복무: +1~3호봉 가산 [참고]             │
│                                           │
│ 예상 초임 월 보수 (추정): 280~310만원       │
└──────────────────────────────────────────┘
```

### 4-6. [E] 2026 교원 호봉표

**구성:**
- 상단: 대표 구간 요약 패널 (신입·5호봉·9호봉·14호봉·21호봉·30호봉·40호봉)
- "전체 호봉표 펼쳐보기" 버튼 → 1~40호봉 전체 테이블 표시
- 9호봉 행 하이라이트 (신입 기준)

**대표 구간 패널:**
```
┌──────────────────────────────────────────────────────────────┐
│ 구간      호봉    기본급      정액급식비 포함    세후 추정     │
│ 신입       9호봉  249.6만원    265.6만원     약 223.5만원   │
│ 5호봉      5호봉  229.2만원    245.2만원     약 205.5만원   │
│ 10호봉    10호봉  251.7만원    267.7만원     약 225.5만원   │
│ 중견      14호봉  280.5만원    296.5만원     약 251.0만원   │
│ 숙련      21호봉  360.1만원    376.1만원     약 320.5만원   │
│ 장기      30호봉  482.7만원    498.7만원     약 424.0만원   │
│ 최고      40호봉  620.6만원    636.6만원     약 535.5만원   │
└──────────────────────────────────────────────────────────────┘
```

> 세후 추정: `추정` 배지 필수. 정액급식비 포함 표시는 `공식`.

### 4-7. [F] 대표 호봉 예상 연봉 바 차트

- Horizontal bar chart (Chart.js)
- x축: 예상 연봉 (만 원, 추정)
- y축: 대표 호봉 구간 라벨 (신입·5·10·14·21·30·40호봉)
- 데이터: 기본급×12 + 교직수당×12 + 정액급식비×12 + 명절휴가비 기준 추정
- 차트 상단 설명:
  > 기본급 × 12 + 교직수당 + 정액급식비 + 명절휴가비 주요 항목 포함 **추정치**. 담임·보직 수당 미포함.

### 4-8. [G] 수당 구조 (3탭)

탭: `고정 수당` | `역할 수당` | `연간 특별 지급`

- 고정: 교직수당, 정액급식비, 교원연구비
- 역할: 담임수당, 보직수당, 특수교사 수당
- 연간: 명절휴가비, 성과상여금, 연가보상비, 정근수당

각 탭은 수당 카드 목록:
```
[수당명]  [금액]  [지급 조건]  [근거]
```

### 4-9. [H] 공립 vs 사립 비교

- 비교 테이블 6행 (봉급표 / 연금 / 정년 / 복지·수당 / 안정성 / 인사·전보)
- `공식` 항목과 `참고` 항목 배지 구분
- 상단 안내: "봉급표 자체는 공립·사립 동일 기준이나, 수당·복지·학교 문화는 학교별 편차가 있습니다."

### 4-10. [I] 연차별 예상 연봉 시뮬레이션

**컨트롤:**
- 진입 유형 선택: `초등(교대)` / `중등(사범대)` / `기간제`
- 담임 여부 토글: `담임` / `비담임`
- 정액급식비 포함 토글

**출력:**
- 9호봉 기준 시작 → 연간 1호봉씩 상승 가정
- 꺾은선 차트 (Chart.js): x축 = 경력 연차, y축 = 예상 연봉
- 현재 선택 연차의 호봉·기본급·예상 연봉 요약 카드

**안내 박스:**
```
이 시뮬레이션은 보수적 추정 예시입니다. 실제 호봉 승급은 매년 1호봉이 원칙이나,
성과·징계·휴직 등에 따라 달라질 수 있습니다.
```
> `추정` 배지 필수. 누적 보수 개념보다 연봉 추이를 보여주는 데 집중.

### 4-11. [J] 업무 강도·워라밸 비교

- 비교 테이블 (초등 / 중학교 / 고등학교)
- 6개 항목 (생활지도 / 학부모 소통 / 시험·평가 / 진학상담 / 입시 부담 / 행정 업무)
- 배지: `비교계산소 편집부 기준` / `일반적 체감 비교`
- 상단 안내: "학교·지역·담임 여부에 따라 실제 업무 강도는 달라질 수 있습니다."

### 4-12. [K] 교사 되는 길 (진입 경로)

카드 5종 (초등 임용 / 중등 임용·사범대 / 중등 임용·교직이수 / 특수교사 / 기간제):
```
[진입방식]  [자격 요건]  [시작 호봉]  [특이사항]
```

### 4-13. [L] FAQ

6개 포함:
1. 초등교사와 고등학교 교사 본봉이 정말 같나요?
2. 임용고시 붙으면 첫 월급이 얼마예요?
3. 10년 버티면 교사 연봉은 얼마인가요?
4. 기간제교사도 호봉표 적용받나요?
5. 담임을 맡으면 월급 차이가 큰가요?
6. 사립학교 교사와 공립학교 교사 연봉은 많이 다른가요?

### 4-14. [M] 관련 콘텐츠 CTA

| 위치 | 연결 대상 | 문구 |
|---|---|---|
| 수당 섹션 하단 | `/tools/salary/` | 내 실수령 계산해보기 |
| 공립·사립 비교 하단 | `/tools/salary-tier/` | 교사 연봉이 상위 몇 %인지 확인 |
| 페이지 하단 | `/reports/police-salary-2026/` | 경찰관 연봉과 비교해보기 |
| 페이지 하단 | `/reports/firefighter-salary-2026/` | 소방관 연봉과 비교해보기 |
| 페이지 하단 | `/reports/nurse-salary-2026/` | 간호사 연봉과 비교해보기 |

---

## 5. 인터랙션 상태 관리 (`teacher-salary-2026.js`)

### 5-1. 학교급 카드 클릭

```js
let activeSchoolLevel = null;

function toggleSchoolPanel(levelId) {
  if (activeSchoolLevel === levelId) {
    closePanel(levelId);
    activeSchoolLevel = null;
  } else {
    if (activeSchoolLevel) closePanel(activeSchoolLevel);
    openPanel(levelId);
    activeSchoolLevel = levelId;
  }
}
```

### 5-2. 호봉표 펼치기

```js
let hobongExpanded = false;

function toggleHobongTable() {
  hobongExpanded = !hobongExpanded;
  document.querySelector('.ts-hobong-full').hidden = !hobongExpanded;
  document.querySelector('.ts-hobong-toggle-btn').textContent =
    hobongExpanded ? '▲ 접기' : '전체 호봉표 펼쳐보기 ▼';
}
```

### 5-3. 수당 탭

```js
function switchAllowanceTab(type) {
  // 'fixed' | 'role' | 'annual'
  document.querySelectorAll('.ts-allowance-tab').forEach(tab => {
    tab.classList.toggle('is-active', tab.dataset.type === type);
  });
  document.querySelectorAll('.ts-allowance-list').forEach(list => {
    list.hidden = list.dataset.type !== type;
  });
}
```

### 5-4. 연봉 시뮬레이션

```js
let simState = {
  entryType: 'elementary',  // 'elementary' | 'secondary-major' | 'fixed-term'
  isClassTeacher: true,
  includeMealAllowance: true,
};

function calcSimulation(state) {
  const startStep = getStartStep(state.entryType);
  // 연차별 호봉 계산 → 기본급 + 수당 → Chart.js 업데이트
}
```

### 5-5. URL 파라미터 (공유)

```
/reports/teacher-salary-2026/?level=elementary
```
- `level`: 초기 활성 학교급 카드 (`elementary` | `middle` | `high` | `special` | `fixed_term`)
- 페이지 로드 시 해당 카드 자동 오픈

---

## 6. SCSS 설계 (`_teacher-salary-2026.scss`)

### 6-1. Prefix 규칙

모든 클래스는 `ts-` prefix 사용.

```scss
.ts-hero-kpi           // Hero KPI 카드 영역
.ts-level-grid         // 학교급 카드 그리드
.ts-level-card         // 개별 학교급 카드
.ts-level-card--active // 선택 상태
.ts-level-bar          // 학교급 색상 바 (상단)
.ts-level-panel        // 상세 패널 (accordion)
.ts-hobong-summary     // 대표 호봉 요약 패널
.ts-hobong-row         // 대표 호봉 행
.ts-hobong-row--highlight // 신입(9호봉) 하이라이트
.ts-hobong-full        // 전체 호봉 테이블 (초기 hidden)
.ts-hobong-toggle-btn  // 전체 펼치기 버튼
.ts-chart-wrap         // 바 차트 래퍼
.ts-allowance-tabs     // 수당 탭 영역
.ts-allowance-tab      // 개별 탭 버튼
.ts-allowance-tab--active
.ts-allowance-list     // 수당 목록
.ts-allowance-card     // 개별 수당 카드
.ts-pp-table           // 공립·사립 비교 테이블
.ts-sim-controls       // 시뮬레이션 컨트롤
.ts-sim-chart          // 시뮬레이션 차트
.ts-workload-table     // 업무 강도 비교 테이블
.ts-entry-grid         // 진입 경로 카드 그리드
.ts-entry-card         // 진입 경로 개별 카드
.ts-badge-official     // '공식' 배지
.ts-badge-estimate     // '추정' 배지
.ts-badge-ref          // '참고' 배지
.ts-badge-editorial    // '편집부 기준' 배지
```

### 6-2. 학교급 색상 바

```scss
$ts-level-colors: (
  'elementary':  #4caf8d,   // 초등 — 그린
  'middle':      #4a90d9,   // 중학교 — 블루
  'high':        #5c6bc0,   // 고등학교 — 인디고
  'special':     #9c7cc7,   // 특수교사 — 퍼플
  'fixed_term':  #90a4ae,   // 기간제 — 그레이
);
```

### 6-3. 배지 스타일

```scss
.ts-badge-official {
  background: #e8f4e8; color: #2d7a2d;
  border: 1px solid #2d7a2d;
  font-size: 0.7rem; padding: 2px 6px; border-radius: 3px;
}
.ts-badge-estimate {
  background: #fff8e6; color: #b8780a;
  border: 1px solid #b8780a;
  font-size: 0.7rem; padding: 2px 6px; border-radius: 3px;
}
.ts-badge-ref {
  background: #e8f0fb; color: #2a5bbf;
  border: 1px solid #2a5bbf;
  font-size: 0.7rem; padding: 2px 6px; border-radius: 3px;
}
.ts-badge-editorial {
  background: #f3f3f3; color: #555;
  border: 1px solid #aaa;
  font-size: 0.7rem; padding: 2px 6px; border-radius: 3px;
}
```

---

## 7. SEO 설계

### 7-1. 메타

```
title: 학교 선생님 연봉·호봉 완전 정리 2026 | 비교계산소
description: 2026년 교원 봉급표 기준으로 초등·중학교·고등학교 선생님 월급, 호봉표, 기간제교사 차이, 담임·보직 수당 구조까지 한눈에 비교합니다.
```

### 7-2. H 태그 구조

```
H1: 학교 선생님 연봉·호봉 완전 정리 2026
H2: 2026 교원 봉급표 핵심 요약
H2: 초등교사 vs 중학교 교사 vs 고등학교 교사 차이
H2: 2026 교원 호봉별 기본급표
H2: 2026 교사 수당 구조
H2: 공립학교 vs 사립학교 교사 비교
H2: 연차별 예상 연봉 시뮬레이션
H2: 업무 강도·워라밸 비교
H2: 교사 되는 길
H2: 교사 연봉 FAQ
```

### 7-3. JSON-LD

- `FAQPage` 스키마 (6개 FAQ)
- `Article` 스키마 (datePublished: 2026-04-11, author: 비교계산소)

### 7-4. 내부 링크 최소 5개

- `/tools/salary/` — 실수령 계산기
- `/tools/salary-tier/` — 연봉 티어 계산기
- `/reports/police-salary-2026/` — 경찰관 연봉 리포트
- `/reports/firefighter-salary-2026/` — 소방관 연봉 리포트
- `/reports/nurse-salary-2026/` — 간호사 연봉 리포트

---

## 8. `src/data/reports.ts` 등록

```ts
{
  slug: 'teacher-salary-2026',
  title: '학교 선생님 연봉·호봉 완전 정리 2026',
  description: '초등·중학교·고등학교 교사 호봉표, 수당 구조, 기간제 차이를 2026년 교원 봉급표 기준으로 비교합니다.',
  category: '직업·연봉',
  tags: ['교사', '공무원', '연봉', '호봉표', '2026', '초등교사', '임용고시'],
  publishedAt: '2026-04-11',
  order: /* 기존 마지막 순번 + 1 */,
}
```

---

## 9. 구현 순서

1. `src/data/teacherSalary2026.ts` — 호봉표·학교급·수당·진입경로·공립사립·업무강도 데이터 작성
2. `src/data/reports.ts` — 메타 등록
3. `src/pages/reports/teacher-salary-2026.astro` — 마크업 (섹션 A~N)
4. `src/styles/scss/pages/_teacher-salary-2026.scss` — 스타일 작성
5. `src/styles/app.scss` — 파셜 import 추가
6. `public/scripts/teacher-salary-2026.js` — 인터랙션 구현
7. `public/sitemap.xml` — URL 추가
8. `npm run build` — 빌드 확인

---

## 10. QA 체크리스트

### 데이터
- [ ] 호봉표 수치가 인사혁신처 2026 교원 봉급표와 일치하는가
- [ ] 신입 9호봉 시작 기준이 카드·패널·차트 모두에 일관되게 반영되었는가
- [ ] 세후 실수령 추정 모두에 `추정` 배지가 붙어 있는가
- [ ] 업무강도 비교 섹션에 `편집부 기준` 배지가 붙어 있는가
- [ ] 40호봉 이후 근속가봉 설명에 `참고` 배지가 붙어 있는가
- [ ] 공립·사립 비교의 불확실 항목(복지, 안정성)에 `참고` 배지가 붙어 있는가

### 인터랙션
- [ ] 학교급 카드 클릭 시 상세 패널이 정상 열림/닫힘
- [ ] 한 번에 하나의 패널만 열리는가
- [ ] 호봉표 전체 펼치기/접기가 정상 작동하는가
- [ ] 수당 탭 전환이 정상 작동하는가
- [ ] 연봉 시뮬레이션에서 진입유형·담임여부 변경 시 차트가 재계산되는가
- [ ] URL 파라미터 `?level=xxx` 접근 시 해당 카드가 초기 오픈되는가

### SEO
- [ ] FAQ 6개 이상 포함되는가
- [ ] `공식` / `추정` / `참고` 배지가 구분되어 노출되는가
- [ ] JSON-LD FAQPage 스키마가 정상 삽입되는가
- [ ] 내부 링크 5개 이상 포함되는가
- [ ] sitemap.xml에 URL이 추가되었는가

### 빌드
- [ ] `npm run build` 에러 없음
- [ ] `/reports/teacher-salary-2026/` 라우트가 `dist/`에 생성되는가
- [ ] 모바일(375px) 레이아웃에서 카드·표·차트가 깨지지 않는가
