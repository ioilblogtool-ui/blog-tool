# 초등입학 전 체크리스트·비용 총정리 2026 — 설계 문서

> 기획 원문: `docs/plan/202604/elementary-school-ready-cost-2026.md`
> 작성일: 2026-04-15
> 구현 기준: Claude/Codex가 이 문서를 보고 바로 구현에 착수할 수 있는 수준으로 고정
> 참고 리포트: `baby-cost-guide-first-year`, `postpartum-center-cost-2026` (카드·탭·테이블 패턴 재사용)

---

## 1. 문서 개요

### 1-1. 대상

- 기획 문서: `docs/plan/202604/elementary-school-ready-cost-2026.md`
- 구현 대상: `2026 초등학교 입학 준비 완벽 가이드`
- 콘텐츠 유형: 정적 리포트 (`/reports/` 계열) + 체크박스 인터랙션

### 1-2. 문서 역할

- 기획 문서를 현재 비교계산소 `/reports/` 구조에 맞게 실제 구현 직전 수준으로 재구성한 설계 문서다.
- 화면 구조, 데이터 스키마, 인터랙션 상태, SCSS prefix, QA 기준을 고정한다.
- 이후 구현자는 이 문서를 기준으로 `src/data/`, `src/pages/reports/`, `public/scripts/`, `src/styles/` 작업을 진행한다.

### 1-3. 페이지 성격

- **초등 입학 준비 허브 콘텐츠**: 일정·준비물·비용·돌봄·지원금을 한 페이지에서 해결하는 시즌형 실전 가이드
- **핵심 흐름**: `일정 확인 → 준비물 체크 → 비용 파악 → 월 고정지출 계획 → 돌봄 신청 → 지원금 확인 → 절약 팁`
- **SEO 포지셔닝**: `초등학교 입학 준비 비용 2026`, `초등 입학 준비물 체크리스트`, `취학통지서 일정 2026` 커버

### 1-4. 권장 slug

- `elementary-school-ready-cost-2026`
- URL: `/reports/elementary-school-ready-cost-2026/`

### 1-5. 권장 파일 구조

```
src/
  data/
    elementarySchoolReadyCost2026.ts   ← 준비물·비용·지원금·FAQ 데이터 통합
  pages/
    reports/
      elementary-school-ready-cost-2026.astro

public/
  scripts/
    elementary-school-ready-cost-2026.js  ← 체크박스 상태, TOC 스크롤, FAQ accordion

src/styles/scss/pages/
  _elementary-school-ready-cost-2026.scss  ← 페이지 전용 스타일 (prefix: esr-)
```

---

## 2. 현재 프로젝트 기준 정리

### 2-1. 기존 리포트 공통 구조 재사용

1. `CalculatorHero` — 제목/설명
2. `InfoNotice` — 데이터 기준일·학교별 상이 고지
3. 상단 요약 KPI 카드 (핵심 수치 4개)
4. 앵커 TOC
5. 섹션 1: 입학 대상·취학통지서 일정 타임라인
6. 섹션 2: 준비물 체크리스트 (체크박스 인터랙션)
7. 섹션 3: 품목별 평균 비용 (3단 가격 표)
8. 섹션 4: 첫 달 총비용 시나리오 카드
9. 섹션 5: 방과후·돌봄·학원 비교 표
10. 섹션 6: 입학 전 학습 준비 비용 표
11. 섹션 7: 초등 돌봄 신청 플로우
12. 섹션 8: 국가 지원금 총정리 표
13. 섹션 9: 후회한 준비물 TOP5
14. 섹션 10: 형제자매 절감 팁 표
15. 섹션 11: 2016 vs 2026 비용 비교
16. FAQ accordion
17. 관련 콘텐츠 CTA
18. `SeoContent`

### 2-2. 데이터 출처 표기 원칙

| 출처 유형 | 배지 표시 | 예시 |
|---|---|---|
| 교육부·통계청 공식 자료 | `공식` | 초등학생 사교육비 월 평균 |
| 보건복지부·복지로 안내 | `공식` | 아동수당·교육급여 기준 |
| 온라인 커머스·리뷰 기반 추정 | `추정` | 책가방 평균 구매가 |
| 언론 보도·커뮤니티 취합 | `참고` | 후회한 준비물 TOP5 |

---

## 3. 데이터 구조 (`src/data/elementarySchoolReadyCost2026.ts`)

```ts
// ── 공통 타입 ────────────────────────────────────────────────────

export type PriceTier = 'frugal' | 'average' | 'premium';

// ── KPI 요약 카드 ─────────────────────────────────────────────────
export type SummaryKpi = {
  label: string;   // "준비물 일회성 비용"
  frugal: string;  // "12만~20만 원"
  average: string; // "20만~35만 원"
  premium: string; // "35만~60만 원+"
};

// ── 준비물 체크리스트 ─────────────────────────────────────────────
export type ChecklistCategory = 'required' | 'school_specific' | 'optional';

export type ChecklistItem = {
  id: string;          // "backpack"
  name: string;        // "책가방"
  category: ChecklistCategory;
  note?: string;       // "브랜드보다 무게·수납 구조 확인"
};

// ── 품목별 비용 ───────────────────────────────────────────────────
export type ItemCostRow = {
  item: string;     // "책가방 세트"
  frugal: string;   // "5만~8만 원"
  average: string;  // "9만~15만 원"
  premium: string;  // "16만 원+"
  note: string;     // "브랜드 차이 큼"
};

// ── 첫 달 총비용 시나리오 ────────────────────────────────────────
export type FirstMonthScenario = {
  tier: PriceTier;
  label: string;         // "절약형"
  oneTime: string;       // "12만~20만 원"
  monthly: string;       // "5만~15만 원"
  total: string;         // "17만~35만 원"
};

// ── 방과후·돌봄·학원 비교 ────────────────────────────────────────
export type AfterSchoolCompareRow = {
  type: string;      // "학교 방과후"
  costLevel: string; // "낮음~중간"
  pros: string;      // "이동 부담 적음"
  cons: string;      // "선택 폭 제한 가능"
  recommended: string; // "기본 보완형"
};

// ── 입학 전 학습 준비 비용 ────────────────────────────────────────
export type PreLearningRow = {
  method: string;    // "집에서 가정학습"
  monthlyCost: string; // "0~3만 원"
  feature: string;   // "비용 낮음, 부모 시간 필요"
  recommended: '높음' | '중간' | '선택';
};

// ── 돌봄 신청 플로우 ───────────────────────────────────────────────
export type CareFlowStep = {
  step: number;
  title: string;   // "학교 입학 안내 확인"
  desc: string;    // "취학통지서, 예비소집, 학교별 안내문 확인"
};

// ── 국가 지원금 ───────────────────────────────────────────────────
export type SupportRow = {
  name: string;        // "아동수당"
  target: string;      // "연령 기준 충족 아동"
  content: string;     // "월 정액 지원"
  channel: string;     // "복지로/지자체"
  badge: '공식' | '참고';
};

// ── 후회한 준비물 TOP5 ────────────────────────────────────────────
export type RegretItem = {
  rank: number;
  item: string;   // "너무 비싼 책가방"
  reason: string; // "1학년은 체형이 빠르게 변해 금방 작아짐"
  tip: string;    // "중저가 or 적당한 가격대에서 선택 권장"
};

// ── 형제자매 절감 팁 ──────────────────────────────────────────────
export type SiblingTipRow = {
  item: string;          // "필기구/파일"
  reusability: '높음' | '중간' | '낮음~중간';
  tip: string;           // "남은 재고 활용"
};

// ── 2016 vs 2026 비교 ─────────────────────────────────────────────
export type YearCompareRow = {
  category: string;    // "책가방 평균"
  year2016: string;    // "5만~8만 원"
  year2026: string;    // "9만~15만 원"
  changeNote: string;  // "브랜드·캐릭터 제품 증가로 상승"
};

// ── FAQ ───────────────────────────────────────────────────────────
export type FaqItem = {
  q: string;
  a: string;
};
```

---

## 4. 화면 구조 상세

### 4-1. 상단 요약 박스 (KPI 4개)

```
┌─────────────────────────────────────────────────────────────┐
│  준비물 일회성 비용          첫 달 총 예상 비용               │
│  12만~60만 원 (추정)         17만~120만 원 (추정)            │
│                                                              │
│  월 고정지출 예상            놓치면 안 되는 지원금            │
│  5만~60만 원+                아동수당·교육급여·교육비 지원    │
└─────────────────────────────────────────────────────────────┘
```

- 배지: `추정` / `참고`
- 클래스: `esr-kpi-grid`

### 4-2. 앵커 TOC

```
[1. 입학 대상·일정] [2. 준비물 체크리스트] [3. 품목별 비용]
[4. 첫 달 총비용]   [5. 방과후·학원 비교]  [6. 학습 준비 비용]
[7. 돌봄 신청]      [8. 국가 지원금]       [9. 후회템 TOP5]
[10. 절감 팁]       [11. 2016 vs 2026]    [12. FAQ]
```

- 클래스: `esr-toc`
- 모바일: 가로 스크롤 (`overflow-x: auto`)

### 4-3. 섹션 1 — 입학 대상·취학통지서 일정

타임라인 카드 4개 (12월 → 1월 → 2월 → 3월):

```
[12월] 취학통지서 확인 (정부24 온라인 발급)
[1월]  예비소집·학교 안내문 확인 / 준비물 쇼핑 시작
[2월]  준비물 완료 / 돌봄·방과후 신청
[3월]  입학식 / 생활 패턴 적응
```

- 클래스: `esr-timeline`
- 각 스텝: `esr-timeline__step`
- 아이콘: 번호 뱃지 or 월 표기

### 4-4. 섹션 2 — 준비물 체크리스트

카테고리별 그룹으로 분리, 각 항목에 체크박스:

```
[필수 준비물]          뱃지: 필수 (green)
☐ 책가방
☐ 실내화 / 실내화 가방
☐ 필통, 연필, 지우개
☐ 색연필·사인펜
☐ 공책
☐ 물통
☐ 이름스티커

[학교별 확인 필요]     뱃지: 학교별 (orange)
☐ 체육복
☐ 미술 준비물
☐ 알림장/파일
☐ 개인 위생용품
☐ 보조가방

[있으면 편한 항목]     뱃지: 선택 (gray)
☐ 방수 네임라벨
☐ 연필깎이
☐ 책상 정리용품
☐ 우산/우비
```

- 클래스: `esr-checklist`, `esr-checklist__group`, `esr-checklist__item`
- JS: `localStorage`로 체크 상태 유지 (페이지 재방문 시 복원)
- 완료 카운터 표시: "15개 중 n개 완료"

### 4-5. 섹션 3 — 품목별 평균 비용

3단 헤더 테이블 (절약형 / 평균형 / 확장형):

| 품목 | 절약형 | 평균형 | 확장형 | 비고 |
|------|--------|--------|--------|------|
| 책가방 세트 | 5만~8만 원 | 9만~15만 원 | 16만 원+ | 브랜드 차이 큼 |
| 실내화/가방 | 2만~3만 원 | 3만~5만 원 | 5만 원+ | 학교 기준 확인 |
| 필통/필기구 | 1만~2만 원 | 2만~4만 원 | 4만 원+ | 캐릭터 여부 영향 |
| 공책/파일/라벨 | 1만~2만 원 | 2만~3만 원 | 3만 원+ | 소모품 재구매 가능 |
| 물통/보조용품 | 1만~2만 원 | 2만~4만 원 | 4만 원+ | 선택 품목 포함 |

- 클래스: `esr-cost-table`
- 헤더 셀: `esr-cost-table__tier--frugal`, `--average`, `--premium` (색상 구분)
- 하단: "가격은 2026년 1~3월 온라인 커머스 기준 추정값" 출처 표기

### 4-6. 섹션 4 — 첫 달 총비용 시나리오 카드

3단 카드 (절약형 / 평균형 / 확장형):

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   절약형      │  │   평균형      │  │   확장형      │
│ 준비물 12~20만│  │ 준비물 20~35만│  │ 준비물 35~60만│
│ 월 고정 5~15만│  │ 월 고정 10~30만│ │ 월 고정 20~60만│
│ 첫 달 17~35만│  │ 첫 달 30~65만│  │ 첫 달 55~120만│
└──────────────┘  └──────────────┘  └──────────────┘
```

- 클래스: `esr-scenario-grid`, `esr-scenario-card`
- 배지: `추정`
- 하단 노트: "방과후·학원비·학교 납부금 수준에 따라 크게 달라짐"

### 4-7. 섹션 5 — 방과후·돌봄·학원 비교

| 구분 | 비용 수준 | 장점 | 단점 | 추천 대상 |
|------|-----------|------|------|-----------|
| 학교 방과후 | 낮음~중간 | 이동 부담 적음 | 선택 폭 제한 가능 | 기본 보완형 |
| 돌봄+방과후 | 낮음~중간 | 보호 공백 완화 | 지역/학교별 차이 | 맞벌이·저학년 |
| 민간 학원 | 중간~높음 | 과목 선택 다양 | 월 고정비 큼 | 특정 과목 집중 |
| 학습지/방문형 | 중간 | 집에서 가능 | 누적 비용 증가 | 보조형 |

- 클래스: `esr-compare-table`

### 4-8. 섹션 6 — 입학 전 학습 준비 비용

| 방식 | 월 비용 | 특징 | 추천도 |
|------|---------|------|--------|
| 가정학습 | 0~3만 원 | 비용 낮음, 부모 시간 필요 | 높음 |
| 문제집/워크북 | 2만~6만 원 | 가장 무난 | 높음 |
| 방문/학습지 | 4만~12만 원 | 관리 편함 | 중간 |
| 학원 | 10만 원+ | 비용 높음 | 선택 |

- 클래스: `esr-learning-table`
- 추천도 셀: `esr-badge--high`, `--mid`, `--optional` 색상 구분

### 4-9. 섹션 7 — 초등 돌봄 신청 가이드

플로우 5단계 카드:

```
① 학교 입학 안내 확인
② 돌봄 필요 여부 결정
③ 학교/교육청 신청 일정 확인
④ 지역 연계 프로그램 확인
⑤ 대기 또는 추가 접수 여부 확인
```

- 클래스: `esr-care-flow`
- 각 스텝: `esr-care-flow__step` (번호 원형 배지 + 제목 + 설명)
- 하단 노트: "늘봄학교 정책이 지역 연계형으로 확대 중 (2026)" — `참고` 배지

### 4-10. 섹션 8 — 국가 지원금 총정리

| 제도 | 대상 | 주요 내용 | 신청 채널 |
|------|------|-----------|-----------|
| 아동수당 | 연령 기준 충족 아동 | 월 정액 지원 | 복지로/지자체 |
| 교육급여 | 소득 기준 충족 가구 | 교육활동지원비 | 복지로/행정복지센터 |
| 교육비 지원 | 기준 충족 학생 | 방과후 자유수강권 등 | 학교/교육청 |

- 클래스: `esr-support-table`
- 각 항목 `공식` 배지
- 하단 노트: "소득·연령·지역 요건은 복지로(bokjiro.go.kr) 및 학교 공지 직접 확인 필요"

### 4-11. 섹션 9 — 후회한 준비물 TOP5

랭킹 카드 5개:

```
① 너무 비싼 책가방 — 1학년은 체형 변화가 빠름
② 캐릭터 위주 학용품 과다 구매 — 학교 내 분실·교체 잦음
③ 학교 규격 확인 전 실내화 구매 — 학교별 허용 색상/디자인 다름
④ 필요 이상 선행학습 등록 — 적응보다 학습 부담이 먼저 생김
⑤ 이름표/라벨링 늦게 준비 — 입학 전에 미리 붙여두는 것이 중요
```

- 클래스: `esr-regret-list`, `esr-regret-item`
- 출처 배지: `참고`

### 4-12. 섹션 10 — 형제자매 있을 때 절감 팁

| 항목 | 재사용 가능성 | 절감 팁 |
|------|---------------|---------|
| 필기구/파일 | 높음 | 남은 재고 활용 |
| 실내화 가방 | 높음 | 상태 좋으면 재사용 |
| 라벨/이름표 | 중간 | 일부만 새로 구매 |
| 책가방 | 낮음~중간 | 체형·취향 고려 |
| 정리용품 | 높음 | 집에 있는 물건 활용 |

- 클래스: `esr-sibling-table`
- 재사용 가능성 셀: 높음(green), 중간(orange), 낮음~중간(gray) 배지

### 4-13. 섹션 11 — 2016 vs 2026 비교

| 항목 | 2016 기준 | 2026 기준 | 변화 요인 |
|------|-----------|-----------|-----------|
| 책가방 평균 | 5만~8만 원 | 9만~15만 원 | 브랜드·캐릭터 제품 증가 |
| 문구류/준비물 | 5만~10만 원 | 12만~25만 원 | 소비 다양화, 물가 상승 |
| 초등 사교육 구조 | 학원 중심 | 방과후+학원 혼합 | 늘봄·방과후 제도 변화 |
| 아동수당 지급 | 없음 | 월 정액 지급 | 지급 연령 확대 (2026) |

- 클래스: `esr-year-compare-table`
- 각 변화 항목: `추정` 배지

### 4-14. FAQ Accordion

8개 질문. JS로 토글 제어.

```
Q. 2026년 초등학교 입학 대상은 어떻게 확인하나요?
Q. 취학통지서는 어디서 받나요?
Q. 준비물은 학교마다 다른가요?
Q. 책가방은 언제 사는 게 좋나요?
Q. 돌봄은 언제 신청해야 하나요?
Q. 방과후와 학원은 어떻게 다른가요?
Q. 아동수당과 교육급여를 같이 받을 수 있나요?
Q. 형제자매가 있으면 어떤 준비물을 재사용할 수 있나요?
```

- 클래스: `esr-faq`, `esr-faq__item`, `esr-faq__question`, `esr-faq__answer`

---

## 5. JavaScript 구현 (`public/scripts/elementary-school-ready-cost-2026.js`)

### 5-1. 체크박스 상태 관리

```js
// localStorage key: 'esr_checklist'
// 구조: { "backpack": true, "indoor_shoes": false, ... }

function initChecklist() { ... }
function saveChecklist() { ... }
function updateCounter() {
  // "15개 중 n개 완료" 업데이트
}
```

### 5-2. FAQ Accordion

```js
document.querySelectorAll('.esr-faq__question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.esr-faq__item');
    item.classList.toggle('is-open');
  });
});
```

### 5-3. 앵커 TOC 스크롤 하이라이트

```js
const observer = new IntersectionObserver(entries => {
  // 현재 뷰포트에 보이는 섹션에 해당하는 TOC 항목 활성화
}, { threshold: 0.3 });
```

---

## 6. SCSS 구조 (`src/styles/scss/pages/_elementary-school-ready-cost-2026.scss`)

```scss
// prefix: esr-

.esr-kpi-grid { }          // 상단 KPI 4개 그리드
.esr-toc { }               // 앵커 TOC
.esr-timeline { }          // 입학 일정 타임라인
.esr-checklist { }         // 준비물 체크리스트
.esr-checklist__group { }
.esr-checklist__item { }
.esr-cost-table { }        // 품목별 비용 표
.esr-scenario-grid { }     // 첫 달 총비용 시나리오 카드
.esr-scenario-card { }
.esr-compare-table { }     // 방과후·학원 비교
.esr-learning-table { }    // 학습 준비 비용
.esr-care-flow { }         // 돌봄 신청 플로우
.esr-care-flow__step { }
.esr-support-table { }     // 국가 지원금
.esr-regret-list { }       // 후회한 준비물
.esr-regret-item { }
.esr-sibling-table { }     // 형제자매 절감 팁
.esr-year-compare-table { } // 2016 vs 2026
.esr-faq { }               // FAQ accordion
.esr-faq__item { }
.esr-faq__question { }
.esr-faq__answer { }

// 배지 변형
.esr-badge--required { }   // 필수 (green)
.esr-badge--school { }     // 학교별 (orange)
.esr-badge--optional { }   // 선택 (gray)
.esr-badge--high { }       // 추천도 높음
.esr-badge--mid { }        // 추천도 중간
```

모바일 대응:
- `esr-toc`: `overflow-x: auto` (가로 스크롤)
- `esr-cost-table`, `esr-compare-table`: `min-width: 540px` + 래퍼 `overflow-x: auto`
- `esr-scenario-grid`: mobile 1열, tablet+ 3열 (`grid-template-columns`)
- `esr-care-flow`: mobile 세로 스택

---

## 7. Astro 페이지 구조 (`src/pages/reports/elementary-school-ready-cost-2026.astro`)

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import CalculatorHero from '../../components/CalculatorHero.astro';
import InfoNotice from '../../components/InfoNotice.astro';
import SeoContent from '../../components/SeoContent.astro';
import { checklistItems, itemCostRows, firstMonthScenarios, ... }
  from '../../data/elementarySchoolReadyCost2026';
---

<BaseLayout
  title="2026 초등학교 입학 준비 완벽 가이드 | 체크리스트·비용·지원금 총정리"
  description="2026년 초등학교 입학 준비를 앞둔 부모를 위한 실전 가이드. 취학통지서 일정, 준비물 체크리스트, 책가방·학용품 비용, 방과후·학원 비교, 초등 돌봄 신청, 국가 지원금까지 한 번에 정리했습니다."
  ogImage="/og/elementary-school-ready-cost-2026.png"
>
  <div class="report-page">

    <CalculatorHero
      title="초등입학 전 체크리스트·비용 총정리 2026"
      description="일정 확인부터 준비물, 비용, 돌봄, 지원금까지 한 번에 확인하는 초등 입학 실전 가이드"
    />

    <InfoNotice>
      준비물·비용은 학교·브랜드·지역에 따라 다를 수 있습니다. 가격은 2026년 1~3월 기준 추정값이며, 학교 안내문 확인 후 구매하세요.
    </InfoNotice>

    <!-- 상단 KPI 요약 -->
    <!-- 앵커 TOC -->
    <!-- 섹션 1~13 -->

    <SeoContent
      title="2026 초등학교 입학 준비 총정리"
      faqs={faqData}
    />

  </div>
</BaseLayout>

<script src="/scripts/elementary-school-ready-cost-2026.js"></script>
```

---

## 8. `src/data/reports.ts` 추가 항목

```ts
{
  slug: 'elementary-school-ready-cost-2026',
  title: '초등입학 전 체크리스트·비용 총정리 2026',
  description: '취학통지서 일정·준비물 체크리스트·비용·돌봄·지원금을 한 번에 정리한 초등 입학 실전 가이드',
  category: '육아',
  tags: ['초등입학', '준비물', '비용', '돌봄', '지원금'],
  publishedAt: '2026-04-15',
},
```

---

## 9. `public/sitemap.xml` 추가

```xml
<url>
  <loc>https://bigyocalc.com/reports/elementary-school-ready-cost-2026/</loc>
  <changefreq>yearly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## 10. 구현 순서

1. `src/data/elementarySchoolReadyCost2026.ts` — 데이터 작성
2. `src/pages/reports/elementary-school-ready-cost-2026.astro` — 마크업 구현
3. `src/styles/scss/pages/_elementary-school-ready-cost-2026.scss` — 스타일 작성
4. `src/styles/app.scss` — import 추가
5. `public/scripts/elementary-school-ready-cost-2026.js` — 체크박스·FAQ·TOC 인터랙션
6. `src/data/reports.ts` — 항목 추가
7. `public/sitemap.xml` — URL 추가
8. `npm run build` — 빌드 확인

---

## 11. QA 포인트

### 기능
- [ ] 체크박스 체크 → localStorage 저장 → 페이지 재방문 시 복원
- [ ] "n개 완료" 카운터 실시간 업데이트
- [ ] FAQ accordion 개별 토글 작동
- [ ] 앵커 TOC 클릭 → 해당 섹션으로 스크롤
- [ ] TOC 스크롤 하이라이트 작동

### 모바일
- [ ] KPI 그리드 2열 배치 (375px 기준)
- [ ] 시나리오 카드 1열 스택
- [ ] 테이블 가로 스크롤 작동
- [ ] TOC 가로 스크롤 작동
- [ ] 돌봄 플로우 세로 스택

### 콘텐츠
- [ ] 배지(추정/참고/공식) 모든 항목 적용 확인
- [ ] 학교별 상이 면책 문구 표기
- [ ] 비용 조사 시점 출처 표기
- [ ] 지원금 직접 확인 안내 문구 포함

### SEO
- [ ] title 태그 70자 이내
- [ ] meta description 적용
- [ ] sitemap.xml URL 추가
- [ ] FAQ JSON-LD 스키마 (SeoContent 컴포넌트에서 자동 처리)
