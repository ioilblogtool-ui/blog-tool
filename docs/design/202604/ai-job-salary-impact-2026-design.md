# 직군별 AI 도입 전후 연봉 효과 비교 2026 — 설계 문서

> 기획 원문: `docs/plan/202604/ai-job-salary-impact-2026.md`
> 작성일: 2026-04-18
> 구현 기준: Codex/Claude가 이 문서만 보고 바로 `/reports/` 페이지를 구현할 수 있는 수준으로 고정
> 참고 리포트: `large-company-salary-growth-by-years-2026`, `teacher-salary-2026`, `bitcoin-gold-sp500-10year-comparison-2026`

---

## 1. 문서 개요

### 1-1. 대상
- 기획 문서: `docs/plan/202604/ai-job-salary-impact-2026.md`
- 구현 대상: `직군별 AI 도입 전후 연봉 효과 비교 2026`
- 권장 slug: `ai-job-salary-impact-2026`
- 권장 URL: `/reports/ai-job-salary-impact-2026/`
- 콘텐츠 유형: 인터랙티브 비교 리포트 (`/reports/`)

### 1-2. 페이지 성격
- 단순 의견형 칼럼이 아니라 `직군별 비교 + 연봉 격차 + 채용시장 해석 + 실전 액션`까지 주는 데이터 리포트
- 핵심 흐름:
  `왜 지금 봐야 하나 -> 10개 직군 비교 -> AI 활용자 vs 비활용자 격차 -> 수혜 직군 TOP3 -> 압박 직군 TOP3 -> 채용시장 변화 -> 협상 포인트 -> 추천 툴 스택 -> 액션 체크리스트 -> 관련 계산기 CTA`
- 공포 마케팅 금지
- “AI가 일자리를 없앤다”보다 “직무 구조와 연봉 협상 포인트가 어떻게 바뀌는지”를 설명하는 방향으로 고정

### 1-3. 이 문서의 역할
- 기획 문서를 실제 구현 직전 설계 문서로 변환
- 데이터 스키마, 섹션 목적, 인터랙션, 차트 방식, CTA, QA 체크리스트를 고정
- 이후 구현은 이 문서를 기준으로 `src/data/`, `src/pages/reports/`, `public/scripts/`, `src/styles/`, `src/data/reports.ts`에 반영

---

## 2. 권장 파일 구조

```text
src/
  data/
    aiJobSalaryImpact2026.ts
  pages/
    reports/
      ai-job-salary-impact-2026.astro

public/
  scripts/
    ai-job-salary-impact-2026.js
  og/
    reports/
      ai-job-salary-impact-2026.png

src/styles/scss/pages/
  _ai-job-salary-impact-2026.scss
```

### 2-1. 추가 반영 파일
- `src/data/reports.ts`
- `src/pages/index.astro`
- `src/pages/reports/index.astro`
- `src/styles/app.scss`
- `public/sitemap.xml`

---

## 3. 구현 범위

### 3-1. MVP 범위
- 리포트 메타/히어로/주의문
- AI와 연봉을 함께 봐야 하는 이유 요약
- 비교 대상 10개 직군 카드/매트릭스
- AI 활용자 vs 비활용자 연봉 격차 비교
- 수혜 직군 TOP3 / 압박 직군 TOP3
- 국내 채용시장 변화 요약 카드
- 연봉 협상 포인트와 KPI 예시
- 직군별 추천 AI 툴 스택
- 액션 체크리스트
- 관련 계산기 CTA
- FAQ / 출처 / SEO 콘텐츠

### 3-2. MVP 제외
- 실시간 채용 API 연동
- 사용자 입력 기반 개인 맞춤 진단
- 로그인/북마크/저장 기능
- 외부 데이터 크롤링 자동화
- 고급 애니메이션/스크롤 인터랙션

### 3-3. 확장 여지
- 연도 슬라이더 (`2025 -> 2026 -> 2027`)
- 직군별 상세 모달
- 국내 채용공고 키워드 빈도 추이 차트
- `ai-automation-hourly-roi` 계산기와 query string 연동

---

## 4. 페이지 목표

- 사용자가 “내 직군은 AI 때문에 연봉 상승 쪽인지 압박 쪽인지”를 빠르게 이해하게 만든다.
- AI 활용자 vs 비활용자의 차이를 단순 도구 사용 여부가 아니라 `성과 개선 가능성`과 `협상력` 관점으로 재구성한다.
- 연봉 차이를 확정 수치처럼 단정하지 않고, `시장 방향성 + 역할 변화 + 협상 포인트`로 해석한다.
- 마지막에는 사용자가 바로 행동할 수 있도록 계산기와 연결한다.

---

## 5. 데이터 설계 (`src/data/aiJobSalaryImpact2026.ts`)

### 5-1. 타입 정의

```ts
export type ImpactTone = "positive" | "neutral" | "warning";
export type ImpactLevel = "low" | "medium" | "high" | "very-high";
export type JobTrack = "builder" | "operator" | "analyst" | "creative" | "support";

export interface ReportMeta {
  slug: string;
  title: string;
  description: string;
  updatedAt: string;
  methodology: string;
  caution: string;
}

export interface HeroStat {
  label: string;
  value: string;
  sub: string;
  tone?: ImpactTone;
}

export interface JobImpactRow {
  id: string;
  name: string;
  track: JobTrack;
  aiAdoptionLevel: ImpactLevel;
  automationRiskLevel: ImpactLevel;
  salaryUpsideLevel: ImpactLevel;
  hiringMomentumLevel: ImpactLevel;
  aiPremiumRange: string;
  salaryBand2026: string;
  summary: string;
  why: string[];
  recommendedTools: string[];
  negotiationSignals: string[];
  tags: string[];
}

export interface GapCompareRow {
  id: string;
  jobName: string;
  aiUserSalaryIndex: number;
  nonAiSalaryIndex: number;
  productivityIndex: number;
  negotiationPowerIndex: number;
  summary: string;
}

export interface RankedCard {
  id: string;
  jobName: string;
  headline: string;
  summary: string;
  reason: string;
  tone: ImpactTone;
}

export interface HiringSignalRow {
  companyType: string;
  aiAdoptionStyle: string;
  hiringChange: string;
  implication: string;
}

export interface ToolStackRow {
  jobName: string;
  coreTools: string[];
  useCases: string[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  weight: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
}

export interface SourceLink {
  label: string;
  href: string;
}
```

### 5-2. 권장 export 구조

```ts
export const aiJobSalaryImpact2026 = {
  meta,
  heroStats,
  introCards,
  jobImpactRows,
  gapCompareRows,
  winnersTop3,
  pressureTop3,
  hiringSignals,
  negotiationChecklist,
  toolStacks,
  futureOutlook,
  faq,
  relatedLinks,
  sourceLinks,
} as const;
```

### 5-3. 데이터 작성 원칙
- 연봉 수치는 “확정 평균 연봉”이 아니라 `범위` 또는 `인덱스` 중심으로 제시
- 연봉 프리미엄은 `%`보다 `상대 격차 해석`을 우선
- 해외 원문 데이터는 국내 해석 프레임으로 재구성
- `AI 활용자`와 `비활용자` 차이는 “도구 사용 자체”가 아니라 “성과 설명 가능성”을 포함한 해석으로 작성
- 모든 직군은 최소 1개의 리스크와 1개의 기회 포인트를 함께 제시

---

## 6. 페이지 구조 (`src/pages/reports/ai-job-salary-impact-2026.astro`)

### 6-1. 기본 구성
- `BaseLayout`
- `SiteHeader`
- `CalculatorHero`
- `InfoNotice`
- KPI 카드
- 섹션형 비교 보드
- 표/차트/카드 인터랙션
- `SeoContent`

### 6-2. 권장 페이지 클래스
- page class prefix: `ajs-`

### 6-3. 섹션 순서

#### [A] Hero
- eyebrow: `AI 커리어 리포트`
- title: `AI를 쓰는 사람과 아닌 사람의 연봉 차이, 직군별로 얼마나 벌어졌나`
- subtitle: `개발자·마케터·디자이너·PM·회계·번역 등 10개 직군 기준`
- badges: `2026`, `직군비교`, `연봉`, `AI`

#### [B] InfoNotice
- “이 페이지는 공식 연봉표가 아닌 시장 해석형 리포트”
- “일부 수치는 인덱스/범위 기반 추정”
- “실제 연봉은 기업 규모, 경력, 포지션, 성과에 따라 다름”

#### [C] Hero KPI
- 카드 4개 권장
- 예시:
  - AI 프리미엄 강한 직군 수
  - 비교 대상 직군 수
  - 채용시장 변화 시그널
  - 향후 3년 전망 요약

#### [D] 왜 지금 AI와 연봉을 같이 봐야 하나
- 3개 인트로 카드
- 메시지:
  - AI는 직업 전체보다 업무 구성 비중을 먼저 바꾼다
  - 연봉 프리미엄은 AI 사용 그 자체보다 결과 개선 능력에 붙는다
  - 반복 업무 비중이 높은 직군일수록 평균 연봉 압박이 커질 수 있다

#### [E] 비교 대상 10개 직군 매트릭스
- 메인 테이블 혹은 카드 그리드
- 각 행:
  - 직군명
  - AI 도입 체감도
  - 자동화 리스크
  - 연봉 상승 가능성
  - 채용시장 변화
  - 한줄 해석
- 상단 필터:
  - `전체`
  - `수혜 가능성 높음`
  - `압박 가능성 높음`
  - `크리에이티브`
  - `오퍼레이션`

#### [F] AI 활용자 vs 비활용자 격차
- 차트 1: grouped bar
- 항목:
  - 연봉 인덱스
  - 생산성 인덱스
  - 협상력 인덱스
- 기본 직군 1개 선택 + 드롭다운으로 다른 직군 전환

#### [G] 수혜 직군 TOP3
- 카드 3개
- 각 카드:
  - 직군명
  - 왜 유리한지
  - 어떤 AI 활용이 프리미엄을 만드는지

#### [H] 압박 직군 TOP3
- 카드 3개
- 각 카드:
  - 직군명
  - 왜 압박 받는지
  - 어떤 방향으로 역할 이동이 필요한지

#### [I] 국내 채용시장 변화
- 기업 유형별 카드/표
- 대기업 / 스타트업 / BPO·상담 / 전문직 조직
- 채용공고 문구 변화, 인원 구조 변화, 해석 포인트 정리

#### [J] 연봉 협상에 먹히는 AI 활용 포인트
- KPI 예시 박스
- 예시 문구:
  - 시간 절감
  - 처리량 증가
  - 오류 감소
  - 리서치 속도 향상
- “AI를 쓸 줄 안다”보다 “AI로 어떤 KPI를 개선했는가”가 중요하다는 구조로 작성

#### [K] 직군별 추천 AI 툴 스택
- 직군 탭 또는 카드형 리스트
- 개발자 / 마케터 / 디자이너 / PM / 회계 / 번역 / 상담

#### [L] 2026 -> 2028 전망
- 타임라인 3포인트
- 2026: 사용 여부 자체가 차이
- 2027: 기본 역량화
- 2028: 관리·검증·조합 능력이 격차

#### [M] 내 상황 체크리스트
- 체크 항목 5~6개
- 합산 점수에 따라 CTA 문구 분기
- 점수 구간:
  - 낮음: AI 시급/ROI 계산기
  - 중간: AI 스택 비용 계산기
  - 높음: 연봉 인상/협상 계산기

#### [N] FAQ / 출처 / 관련 계산기
- FAQ 4~6개
- 출처 링크
- CTA:
  - `/tools/ai-automation-hourly-roi/`
  - `/tools/ai-stack-cost-calculator/`
  - `/tools/salary/`
  - `/tools/negotiation/`

---

## 7. 인터랙션 설계 (`public/scripts/ai-job-salary-impact-2026.js`)

### 7-1. 필요한 상태

```ts
type ViewState = {
  activeFilter: string;
  selectedJobId: string;
  checklistScore: number;
};
```

### 7-2. 인터랙션 목록
- 직군 필터 버튼
- 직군 선택 드롭다운 또는 카드 선택
- AI 활용자 vs 비활용자 차트 업데이트
- 체크리스트 점수 계산
- CTA 문구와 링크 동적 변경
- URL query 저장 권장:
  - `?job=developer&filter=positive`

### 7-3. 차트 권장
- Chart.js 사용
- 차트 1: 직군별 AI 영향 매트릭스
  - horizontal bar 또는 bubble 대체
- 차트 2: AI 활용자 vs 비활용자 인덱스 비교
  - grouped bar
- 차트 3: 2026~2028 전망
  - line 또는 step line

### 7-4. 스크립트에서 할 일
- 데이터 JSON 파싱
- 필터링된 직군 카드 렌더
- 선택 직군 상세 카드 갱신
- gap 차트 데이터 교체
- 체크리스트 점수 누적 및 CTA 변경

---

## 8. 스타일 가이드 (`_ai-job-salary-impact-2026.scss`)

### 8-1. prefix
- `ajs-`

### 8-2. 톤
- 기존 비교계산소 리포트와 맞추되 AI 주제답게 너무 네온톤으로 가지 않음
- 기본 방향:
  - background: 아이보리/화이트 계열
  - accent: teal + indigo 조합
  - warning: muted orange/red

### 8-3. 주요 블록
- `.ajs-hero-kpis`
- `.ajs-filter-bar`
- `.ajs-job-grid`
- `.ajs-job-card`
- `.ajs-impact-table`
- `.ajs-gap-chart`
- `.ajs-rank-grid`
- `.ajs-signal-grid`
- `.ajs-stack-grid`
- `.ajs-checklist-box`
- `.ajs-cta-box`

### 8-4. 모바일 기준
- 상단 KPI 2열
- 직군 카드 1열
- 비교 차트는 가로 스크롤 허용보다 카드형 대체를 우선
- 체크리스트 CTA는 하단 고정 금지, 섹션 내부 박스로 처리

---

## 9. SEO / 메타 / 스키마

### 9-1. 메타
- `title`: `직군별 AI 도입 전후 연봉 효과 비교 2026 | AI 활용자 vs 비활용자 격차 분석`
- `description`: `개발자, 마케터, 디자이너, PM, 회계, 번역 등 10개 직군 기준으로 AI 도입 이후 연봉 격차와 채용시장 변화를 2026 데이터 기준으로 비교한 인터랙티브 리포트입니다.`

### 9-2. H1
- `직군별 AI 도입 전후 연봉 효과 비교 2026`

### 9-3. 구조화 데이터
- `Article`
- `FAQPage`

### 9-4. 내부 링크
- `/tools/ai-automation-hourly-roi/`
- `/tools/ai-stack-cost-calculator/`
- `/tools/salary/`
- `/tools/negotiation/`

---

## 10. 등록 반영

### 10-1. `src/data/reports.ts`

```ts
{
  slug: "ai-job-salary-impact-2026",
  title: "직군별 AI 도입 전후 연봉 효과 비교 2026",
  description: "개발자, 마케터, 디자이너, PM, 회계, 번역 등 10개 직군 기준으로 AI 도입 이후 연봉 격차와 채용시장 변화를 비교하는 인터랙티브 리포트입니다.",
  order: 31,
  badges: ["AI", "직군비교", "연봉", "2026"],
}
```

### 10-2. `src/styles/app.scss`

```scss
@use 'scss/pages/ai-job-salary-impact-2026';
```

### 10-3. `public/sitemap.xml`

```xml
<url>
  <loc>https://bigyocalc.com/reports/ai-job-salary-impact-2026/</loc>
  <changefreq>quarterly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## 11. 구현 순서

1. `src/data/aiJobSalaryImpact2026.ts` 작성
2. `src/pages/reports/ai-job-salary-impact-2026.astro` 마크업 작성
3. `public/scripts/ai-job-salary-impact-2026.js` 인터랙션 작성
4. `src/styles/scss/pages/_ai-job-salary-impact-2026.scss` 작성
5. `src/data/reports.ts` 등록
6. `src/pages/index.astro`, `src/pages/reports/index.astro` 노출 보정
7. `src/styles/app.scss` 등록
8. `public/sitemap.xml` 등록
9. `npm run build` 검증

---

## 12. QA 체크리스트

- [ ] 연봉 수치를 확정 평균처럼 오해할 표현이 없는가
- [ ] “AI 사용자 = 무조건 고연봉” 식의 단정이 없는가
- [ ] 모든 직군에 기회와 리스크가 함께 정리되어 있는가
- [ ] AI 활용자 vs 비활용자 비교가 단순 도구 사용 여부를 넘어 성과/협상 포인트와 연결되는가
- [ ] 차트와 카드가 모바일에서 깨지지 않는가
- [ ] CTA 링크가 실제 존재 경로와 맞는가
- [ ] `src/data/reports.ts`, `src/styles/app.scss`, `public/sitemap.xml` 등록이 빠지지 않았는가
- [ ] `npm run build`가 성공하는가

---

## 13. 핵심 구현 메모

- 이 페이지의 핵심은 “AI가 직업을 없애는가”가 아니라 “직군별 연봉 프리미엄과 압박이 어디서 생기는가”를 보여주는 데 있다.
- 숫자는 강하게 보이되 해석은 보수적으로 가져간다.
- 카드/표/차트의 균형을 유지하고, CTA는 계산기 연결 중심으로 설계한다.
