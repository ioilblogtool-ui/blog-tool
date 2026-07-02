# 요양원 vs 재가요양 월비용 완전 비교 2026 — 설계 문서

> 기획 원본: [`docs/plan/202607/nursing-home-vs-home-care-cost-2026-plan.md`](../../plan/202607/nursing-home-vs-home-care-cost-2026-plan.md)
> 작성일: 2026-07-02
> 유형: 비교 리포트 (`/reports/`)

---

## 1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/nursingHomeVsHomeCare2026.ts` |
| 리포트 등록 | `src/data/reports.ts` |
| 페이지 | `src/pages/reports/nursing-home-vs-home-care-cost-2026.astro` |
| 스크립트 | 없음 (정적 리포트) |
| 스타일 | `src/styles/scss/pages/_nursing-home-vs-home-care-cost-2026.scss` |
| 앱 CSS import | `src/styles/app.scss` |
| 사이트맵 | `public/sitemap.xml` |

---

## 2. URL 및 메타

```
슬러그: /reports/nursing-home-vs-home-care-cost-2026/
타이틀: 요양원 vs 재가요양 월비용 비교 2026 | 등급별 본인부담 얼마나 차이날까
디스크립션: 장기요양 1~5등급별 요양원·재가요양 월비용 나란히 비교. 식비·추가비용 포함 실제 부담액, 감경 대상 여부, 선택 기준 체크리스트까지 한눈에 정리.
```

---

## 3. 데이터 파일 설계

**`src/data/nursingHomeVsHomeCare2026.ts`**

```ts
// ── 타입 ──────────────────────────────────────────

export type NhGrade = "1" | "2" | "3" | "4" | "5";

export type NhCostRow = {
  grade: NhGrade;
  label: string;
  // 시설급여 (요양원)
  facilityMonthlyBase: number;    // 시설 월 수가 (2인실 기준)
  facilityBurdenGeneral: number;  // 일반 본인부담 20%
  facilityBurdenReduced: number;  // 감경 12%
  facilityExtra: number;          // 식비+기타 고정 추가비용
  facilityTotalGeneral: number;   // 일반 합산 (burden + extra)
  // 재가급여
  homeCareLimit: number;          // 월 급여 한도
  homeCareBurdenGeneral: number;  // 일반 본인부담 15%
  homeCareBurdenReduced: number;  // 감경 9%
  diff: number;                   // 시설 - 재가 (일반 기준, 추가비용 포함)
};

export type NhExtraItem = {
  label: string;
  monthly: string;
  note: string;
};

export type NhServiceCombo = {
  name: string;
  content: string;
  monthlyEstimate: number;
  badge: string;
};

export type NhCheckItem = {
  question: string;
  facilityResult: string;
  homeResult: string;
};

export type NhTimeline = {
  step: number;
  title: string;
  desc: string;
  duration: string;
};

export type NhFaqItem = {
  q: string;
  a: string;
};

// ── 등급별 월비용 비교 ────────────────────────────

export const NH_COST_TABLE: NhCostRow[] = [
  {
    grade: "1",
    label: "1등급",
    facilityMonthlyBase: 2790300,
    facilityBurdenGeneral: 558060,
    facilityBurdenReduced: 334836,
    facilityExtra: 220000,
    facilityTotalGeneral: 778060,
    homeCareLimit: 2306040,
    homeCareBurdenGeneral: 345906,
    homeCareBurdenReduced: 207544,
    diff: 432154,
  },
  {
    grade: "2",
    label: "2등급",
    facilityMonthlyBase: 2589300,
    facilityBurdenGeneral: 517860,
    facilityBurdenReduced: 310716,
    facilityExtra: 220000,
    facilityTotalGeneral: 737860,
    homeCareLimit: 2073120,
    homeCareBurdenGeneral: 310968,
    homeCareBurdenReduced: 186581,
    diff: 426892,
  },
  {
    grade: "3",
    label: "3등급",
    facilityMonthlyBase: 2389500,
    facilityBurdenGeneral: 477900,
    facilityBurdenReduced: 286740,
    facilityExtra: 220000,
    facilityTotalGeneral: 697900,
    homeCareLimit: 1586880,
    homeCareBurdenGeneral: 238032,
    homeCareBurdenReduced: 142819,
    diff: 459868,
  },
  {
    grade: "4",
    label: "4등급",
    facilityMonthlyBase: 2389500,
    facilityBurdenGeneral: 477900,
    facilityBurdenReduced: 286740,
    facilityExtra: 220000,
    facilityTotalGeneral: 697900,
    homeCareLimit: 1510200,
    homeCareBurdenGeneral: 226530,
    homeCareBurdenReduced: 135918,
    diff: 471370,
  },
  {
    grade: "5",
    label: "5등급 (치매)",
    facilityMonthlyBase: 0,
    facilityBurdenGeneral: 0,
    facilityBurdenReduced: 0,
    facilityExtra: 0,
    facilityTotalGeneral: 0,
    homeCareLimit: 1303500,
    homeCareBurdenGeneral: 195525,
    homeCareBurdenReduced: 117315,
    diff: 0,  // 시설 이용 불가
  },
];

// ── 요양원 추가비용 항목 ───────────────────────────

export const NH_EXTRA_ITEMS: NhExtraItem[] = [
  { label: "식비",              monthly: "약 180,000원", note: "1일 3식 기준, 시설마다 상이" },
  { label: "이미용·간식·행사비", monthly: "약 30,000~50,000원", note: "의무 항목 아님, 선택 가능" },
  { label: "기저귀 (해당자)",    monthly: "약 50,000~80,000원", note: "실사용량에 따라 상이" },
  { label: "상급 침실 (1인실)",  monthly: "+50,000~200,000원", note: "선택 사항, 2인실 기본 포함" },
];

// ── 재가요양 서비스 조합 예시 (3등급 기준) ──────────

export const NH_SERVICE_COMBOS: NhServiceCombo[] = [
  {
    name: "방문요양 집중형",
    content: "방문요양 하루 3시간 × 20일",
    monthlyEstimate: 1108200,
    badge: "재가",
  },
  {
    name: "주야간보호 중심형",
    content: "주야간보호 주 5일",
    monthlyEstimate: 1297800,
    badge: "재가",
  },
  {
    name: "혼합형",
    content: "방문요양 2시간×12일 + 주야간보호 주 3일",
    monthlyEstimate: 1530000,
    badge: "재가",
  },
  {
    name: "가족요양 중심형",
    content: "가족요양보호사 하루 60분×20일 + 방문목욕 2회",
    monthlyEstimate: 560000,
    badge: "절약형",
  },
];

// ── 선택 기준 체크리스트 ──────────────────────────

export const NH_CHECKLIST: NhCheckItem[] = [
  {
    question: "24시간 상시 케어가 필요한가?",
    facilityResult: "요양원 적합",
    homeResult: "재가요양 검토 가능",
  },
  {
    question: "야간 배회·낙상 위험이 높은 치매인가?",
    facilityResult: "요양원 적합",
    homeResult: "주야간보호 + 방문요양 병행",
  },
  {
    question: "가족이 함께 돌볼 수 있는 환경인가?",
    facilityResult: "해당 없음",
    homeResult: "재가 + 가족요양 절약 가능",
  },
  {
    question: "본인이 집에서 지내기를 강하게 원하는가?",
    facilityResult: "적응 어려울 수 있음",
    homeResult: "재가요양 우선 검토",
  },
  {
    question: "비용을 최대한 절약해야 하는가?",
    facilityResult: "시설 본인부담 + 추가비용 발생",
    homeResult: "한도 내 조합 설계로 절감 가능",
  },
];

// ── 신청 절차 타임라인 ────────────────────────────

export const NH_TIMELINE: NhTimeline[] = [
  {
    step: 1,
    title: "장기요양 신청",
    desc: "국민건강보험공단 방문·전화(1577-1000)·온라인 신청. 의사 소견서 지참.",
    duration: "D-day",
  },
  {
    step: 2,
    title: "방문 조사",
    desc: "공단 직원이 가정 방문, 심신 기능 상태(52개 항목) 조사.",
    duration: "신청 후 약 2주",
  },
  {
    step: 3,
    title: "등급 판정",
    desc: "등급판정위원회 심의. 결과 우편 통보.",
    duration: "신청 후 30일 이내",
  },
  {
    step: 4,
    title: "급여 유형 선택",
    desc: "재가급여 또는 시설급여 선택. 장기요양기관 계약.",
    duration: "결과 수령 후 즉시",
  },
  {
    step: 5,
    title: "서비스 개시",
    desc: "재가: 요양보호사 매칭 후 방문 시작. 시설: 입소 대기 후 입소.",
    duration: "계약 후 1~4주",
  },
];

// ── FAQ ───────────────────────────────────────────

export const NH_FAQ: NhFaqItem[] = [
  {
    q: "요양원 입소 대기는 얼마나 걸리나요?",
    a: "인기 지역 요양원은 3개월~1년 이상 대기가 필요하기도 합니다. 여러 곳에 동시에 대기 신청을 해두는 것이 좋습니다. 대기 중에는 재가급여를 먼저 이용할 수 있습니다.",
  },
  {
    q: "요양원 비용에 식비가 포함되나요?",
    a: "시설급여(수가) 본인부담금에는 식비가 포함되지 않습니다. 식비는 별도로 월 약 18만원이 추가됩니다. 기초생활수급자는 식비도 지원받을 수 있습니다.",
  },
  {
    q: "방문요양 하루 몇 시간까지 가능한가요?",
    a: "등급에 따라 다르지만 하루 최대 4시간까지 이용 가능합니다. 월 급여 한도 내에서 시간을 자유롭게 배분할 수 있습니다.",
  },
  {
    q: "가족이 요양보호사 자격을 취득하면 급여를 받을 수 있나요?",
    a: "가능합니다. 요양보호사 자격증을 취득한 배우자 또는 직계혈족이 직접 돌보면 하루 60분 기준으로 급여를 받을 수 있습니다. 교육 시간은 약 240시간이며, 자격증 취득 후 바로 신청 가능합니다.",
  },
  {
    q: "주야간보호와 방문요양을 같이 이용할 수 있나요?",
    a: "네, 재가급여 한도 내에서 자유롭게 조합할 수 있습니다. 주야간보호 + 방문요양 혼합형이 현실적으로 가장 많이 이용되는 조합입니다.",
  },
  {
    q: "치매 환자는 요양원이 낫나요, 재가가 낫나요?",
    a: "야간 배회, 심한 인지 저하, 가족 돌봄 여력이 없는 경우 요양원이 안전합니다. 경증 치매(5등급·인지지원등급)는 주야간보호를 활용한 재가요양도 효과적입니다.",
  },
  {
    q: "기초생활수급자 부모님은 본인부담이 없나요?",
    a: "재가급여와 시설급여 모두 본인부담금이 면제됩니다. 시설 입소 시 식비는 별도 지원을 받을 수 있으며, 지방자치단체별로 추가 지원이 있는 경우도 있습니다.",
  },
  {
    q: "재가요양에서 요양원으로 전환하려면 어떻게 하나요?",
    a: "등급이 유지되고 있다면 별도 재판정 없이 급여 유형만 변경할 수 있습니다. 건강보험공단에 급여 변경 신청 후 시설과 계약을 체결하면 됩니다.",
  },
];

// ── SEO 텍스트 ────────────────────────────────────

export const NH_SEO_INTRO = [
  "장기요양등급을 받은 후 가족들이 가장 먼저 부딪히는 질문은 '요양원에 모실까, 집에서 방문요양을 쓸까'입니다. 두 선택의 월비용 차이는 등급과 소득에 따라 20만~50만원 이상 벌어지며, 추가 비용까지 고려하면 차이는 더 커집니다.",
  "재가요양은 월 급여 한도 내에서 방문요양·주야간보호·방문목욕 등을 조합할 수 있어 유연성이 높고, 가족요양보호사 제도를 활용하면 비용을 대폭 줄일 수 있습니다. 요양원은 24시간 케어가 가능하지만 식비·기타 비용이 추가로 발생합니다.",
];

export const NH_SEO_CRITERIA = [
  "시설급여(요양원) 본인부담: 일반 20%, 감경 12%, 기초수급자 면제",
  "재가급여 본인부담: 일반 15%, 감경 9%, 기초수급자 면제",
  "3등급 기준 요양원 총비용(추가비용 포함): 약 70~78만원/월 vs 재가요양 약 24만원/월",
  "가족요양보호사 활용 시 재가 월비용 약 20만원대로 절감 가능",
  "모든 수가·비용은 2026년 기준 추정값이며 지역·시설에 따라 다릅니다",
];
```

---

## 4. reports.ts 등록

```ts
{
  slug: "nursing-home-vs-home-care-cost-2026",
  title: "요양원 vs 재가요양 월비용 비교 2026 | 등급별 본인부담 얼마나 차이날까",
  description: "장기요양 1~5등급별 요양원·재가요양 월비용 나란히 비교. 식비·추가비용 포함 실제 부담액, 선택 기준 체크리스트 포함.",
  order: 103,
  badges: ["복지", "노인", "요양원", "재가요양", "장기요양", "2026"],
},
```

---

## 5. 페이지 IA

```
Hero
 └─ eyebrow: 복지·지원금
 └─ title: 요양원 vs 재가요양 월비용 완전 비교 2026
 └─ description: 등급별 실제 부담 차이, 선택 기준 체크리스트까지 한눈에

InfoNotice (면책 — 추정 수가 고지)

섹션 1 — 3등급 기준 요약 카드 3개 (요약 비교)
섹션 2 — 등급별 월비용 비교표 ★ 핵심
섹션 3 — 요양원 추가비용 상세 (식비·기타)
섹션 4 — 재가요양 서비스 조합 예시 4개
섹션 5 — 선택 기준 체크리스트 5문항
섹션 6 — 가족요양보호사 제도 안내
섹션 7 — 신청 절차 타임라인
섹션 8 — 내부 CTA → 장기요양 계산기
FAQ (8개)
SeoContent
```

---

## 6. 컴포넌트 구조

### 공유 컴포넌트

| 컴포넌트 | 용도 |
|---|---|
| `BaseLayout.astro` | `<head>`, SEO, JSON-LD |
| `SiteHeader.astro` | 전역 헤더 |
| `CalculatorHero.astro` | Hero 섹션 |
| `InfoNotice.astro` | 면책·안내 배너 |
| `SeoContent.astro` | SEO 텍스트 + FAQ |
| `SiteFooter.astro` | 전역 푸터 |

### 페이지 전용 마크업

| 블록 클래스 | 설명 |
|---|---|
| `.nhc-summary-cards` | 3등급 기준 요약 카드 3개 래퍼 |
| `.nhc-summary-card` | 개별 요약 카드 |
| `.nhc-summary-card--facility` | 요양원 카드 (보라 계열) |
| `.nhc-summary-card--home` | 재가요양 카드 (청록 계열) |
| `.nhc-summary-card--diff` | 차액 카드 (주황 계열) |
| `.nhc-cost-table` | 등급별 월비용 비교표 |
| `.nhc-col--facility` | 요양원 컬럼 헤더 색 |
| `.nhc-col--home` | 재가 컬럼 헤더 색 |
| `.nhc-extra-table` | 요양원 추가비용 표 |
| `.nhc-combo-grid` | 재가 서비스 조합 카드 그리드 |
| `.nhc-combo-card` | 개별 조합 카드 |
| `.nhc-checklist` | 선택 기준 체크리스트 테이블 |
| `.nhc-checklist__facility` | 요양원 판단 컬럼 |
| `.nhc-checklist__home` | 재가 판단 컬럼 |
| `.nhc-family-box` | 가족요양보호사 안내 박스 |
| `.nhc-timeline` | 신청 절차 스텝 |
| `.nhc-timeline-item` | 개별 스텝 |
| `.nhc-cta-box` | 내부 CTA 박스 |
| `.nhc-badge` | 추정 배지 |

---

## 7. SCSS 설계

**파일:** `src/styles/scss/pages/_nursing-home-vs-home-care-cost-2026.scss`

### CSS 로컬 토큰

```scss
.nhc-page {
  --nhc-ink:         #14213d;
  --nhc-muted:       #5d6b82;
  --nhc-line:        rgba(20, 33, 61, 0.12);
  --nhc-soft:        #f5f7fb;

  --nhc-purple:      #7c3aed;   // 요양원(시설) 색
  --nhc-purple-bg:   #ede9fe;
  --nhc-purple-dk:   #6d28d9;

  --nhc-teal:        #0891b2;   // 재가요양 색
  --nhc-teal-bg:     #e0f2fe;
  --nhc-teal-dk:     #0e7490;

  --nhc-amber:       #d97706;   // 차액·비용 강조
  --nhc-amber-bg:    #fef3c7;

  --nhc-green:       #059669;   // 절약형 배지·긍정 포인트
  --nhc-green-bg:    #d1fae5;

  --nhc-red:         #dc2626;   // 경고·추가비용
  --nhc-red-bg:      #fee2e2;
}
```

### 주요 스타일 블록

```scss
// 요약 카드 3개
.nhc-summary-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
}
.nhc-summary-card {
  padding: 1.25rem;
  border-radius: 14px;
  border: 1.5px solid var(--nhc-line);
  .nhc-summary-card__label { font-size: 0.8125rem; color: var(--nhc-muted); }
  .nhc-summary-card__value { font-size: 1.5rem; font-weight: 700; margin: 0.25rem 0; }
  .nhc-summary-card__sub   { font-size: 0.75rem; color: var(--nhc-muted); }
  &--facility {
    border-top: 3px solid var(--nhc-purple);
    background: var(--nhc-purple-bg);
    .nhc-summary-card__value { color: var(--nhc-purple-dk); }
  }
  &--home {
    border-top: 3px solid var(--nhc-teal);
    background: var(--nhc-teal-bg);
    .nhc-summary-card__value { color: var(--nhc-teal-dk); }
  }
  &--diff {
    border-top: 3px solid var(--nhc-amber);
    background: var(--nhc-amber-bg);
    .nhc-summary-card__value { color: var(--nhc-amber); }
  }
}

// 월비용 비교표
.nhc-cost-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  th, td {
    padding: 0.75rem;
    border-bottom: 1px solid var(--nhc-line);
    text-align: right;
    &:first-child { text-align: left; }
  }
  th { background: var(--nhc-soft); font-weight: 600; }
  .nhc-col--facility { color: var(--nhc-purple-dk); }
  .nhc-col--home     { color: var(--nhc-teal-dk); }
  tr:last-child td { border-bottom: none; }
  .nhc-cost-table__diff { color: var(--nhc-amber); font-weight: 600; }
  .nhc-cost-table__na   { color: #d1d5db; font-style: italic; }
}

// 추가비용 표
.nhc-extra-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  th, td {
    padding: 0.625rem 0.75rem;
    border-bottom: 1px solid var(--nhc-line);
    text-align: left;
  }
  th { background: var(--nhc-soft); font-weight: 600; }
  .nhc-extra-table__amount { font-weight: 600; color: var(--nhc-red); }
}

// 재가 서비스 조합 카드 그리드
.nhc-combo-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
}
.nhc-combo-card {
  padding: 1.125rem;
  border-radius: 12px;
  border: 1.5px solid var(--nhc-line);
  .nhc-combo-card__name    { font-weight: 700; font-size: 0.9375rem; }
  .nhc-combo-card__content { font-size: 0.8125rem; color: var(--nhc-muted); margin: 0.25rem 0; }
  .nhc-combo-card__amount  { font-size: 1.125rem; font-weight: 700; color: var(--nhc-teal-dk); }
  .nhc-combo-badge {
    display: inline-block;
    font-size: 0.6875rem;
    font-weight: 600;
    padding: 0.1rem 0.5rem;
    border-radius: 99px;
    margin-bottom: 0.5rem;
    background: var(--nhc-teal-bg);
    color: var(--nhc-teal-dk);
    &--saving {
      background: var(--nhc-green-bg);
      color: var(--nhc-green);
    }
  }
}

// 선택 기준 체크리스트
.nhc-checklist {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  th, td {
    padding: 0.75rem;
    border-bottom: 1px solid var(--nhc-line);
    vertical-align: top;
  }
  th { background: var(--nhc-soft); font-weight: 600; }
  .nhc-checklist__facility { color: var(--nhc-purple-dk); }
  .nhc-checklist__home     { color: var(--nhc-teal-dk); }
}

// 가족요양 안내 박스
.nhc-family-box {
  background: var(--nhc-green-bg);
  border: 1.5px solid var(--nhc-green);
  border-radius: 14px;
  padding: 1.25rem 1.5rem;
  .nhc-family-box__title { font-weight: 700; color: var(--nhc-green); margin-bottom: 0.5rem; }
  .nhc-family-box__body  { font-size: 0.9rem; color: var(--nhc-ink); line-height: 1.7; }
}

// 타임라인
.nhc-timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.nhc-timeline-item {
  display: grid;
  grid-template-columns: 2rem 1fr;
  gap: 0 1rem;
  position: relative;
  padding-bottom: 1.25rem;
  &:last-child { padding-bottom: 0; }
  .nhc-timeline-item__dot {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: var(--nhc-teal);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.875rem;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
  }
  &:not(:last-child) .nhc-timeline-item__dot::after {
    content: "";
    position: absolute;
    top: 2rem;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: calc(100% + 0.5rem + 1.25rem);
    background: var(--nhc-line);
    z-index: 0;
  }
  .nhc-timeline-item__content { padding-top: 0.25rem; }
  .nhc-timeline-item__title   { font-weight: 700; font-size: 0.9375rem; }
  .nhc-timeline-item__desc    { font-size: 0.8125rem; color: var(--nhc-muted); margin: 0.25rem 0; }
  .nhc-timeline-item__duration {
    display: inline-block;
    font-size: 0.75rem;
    font-weight: 600;
    background: var(--nhc-teal-bg);
    color: var(--nhc-teal-dk);
    padding: 0.125rem 0.5rem;
    border-radius: 99px;
  }
}

// 내부 CTA 박스
.nhc-cta-box {
  background: var(--nhc-teal-bg);
  border: 1.5px solid var(--nhc-teal);
  border-radius: 14px;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  .nhc-cta-box__text { font-weight: 600; color: var(--nhc-ink); }
  .nhc-cta-box__btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.6rem 1.2rem;
    background: var(--nhc-teal);
    color: #fff;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.875rem;
    text-decoration: none;
    white-space: nowrap;
  }
}

// 추정 배지
.nhc-badge {
  display: inline-block;
  font-size: 0.625rem;
  font-weight: 600;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  background: var(--nhc-amber-bg);
  color: var(--nhc-amber);
  vertical-align: middle;
  margin-left: 0.25rem;
}
```

---

## 8. Astro 페이지 구조

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import SiteFooter from "../../components/SiteFooter.astro";
import {
  NH_COST_TABLE,
  NH_EXTRA_ITEMS,
  NH_SERVICE_COMBOS,
  NH_CHECKLIST,
  NH_FAMILY_BENEFIT,
  NH_TIMELINE,
  NH_FAQ,
  NH_SEO_INTRO,
  NH_SEO_CRITERIA,
} from "../../data/nursingHomeVsHomeCare2026";

const title = "요양원 vs 재가요양 월비용 비교 2026 | 등급별 본인부담 얼마나 차이날까";
const description = "장기요양 1~5등급별 요양원·재가요양 월비용 나란히 비교. 식비·추가비용 포함 실제 부담액, 감경 대상 여부, 선택 기준 체크리스트까지 한눈에 정리.";

// 3등급 기준 요약
const grade3 = NH_COST_TABLE.find(r => r.grade === "3")!;
---
<BaseLayout {title} {description} ogType="website">
  <SiteHeader />
  <main class="container page-shell nhc-page">

    <CalculatorHero
      eyebrow="복지·지원금"
      title="요양원 vs 재가요양 월비용 완전 비교 2026"
      description="장기요양등급별 실제 부담 차이, 선택 기준, 신청 절차까지 한눈에 정리했습니다."
    />

    <InfoNotice
      title="수가·비용 안내"
      lines={[
        "모든 수가·비용은 건강보험공단 고시(2026년 기준) 기반 추정값입니다.",
        "시설마다, 지역마다 실제 비용이 다를 수 있습니다. 반드시 해당 기관에 직접 확인하세요.",
      ]}
    />

    <!-- 섹션 1: 3등급 기준 요약 카드 -->
    <section class="content-section">
      <h2 class="section-title">한눈에 비교 — 3등급 기준 월비용</h2>
      <div class="nhc-summary-cards">
        <div class="nhc-summary-card nhc-summary-card--facility">
          <p class="nhc-summary-card__label">요양원 (시설급여)</p>
          <p class="nhc-summary-card__value">
            {grade3.facilityBurdenGeneral.toLocaleString()}원
            <span class="nhc-badge">추정</span>
          </p>
          <p class="nhc-summary-card__sub">본인부담 (일반 20%) + 식비·기타 별도</p>
        </div>
        <div class="nhc-summary-card nhc-summary-card--home">
          <p class="nhc-summary-card__label">재가요양 (한도 100% 이용)</p>
          <p class="nhc-summary-card__value">
            {grade3.homeCareBurdenGeneral.toLocaleString()}원
            <span class="nhc-badge">추정</span>
          </p>
          <p class="nhc-summary-card__sub">본인부담 (일반 15%)</p>
        </div>
        <div class="nhc-summary-card nhc-summary-card--diff">
          <p class="nhc-summary-card__label">추가비용 포함 차액</p>
          <p class="nhc-summary-card__value">
            {(grade3.facilityTotalGeneral - grade3.homeCareBurdenGeneral).toLocaleString()}원
          </p>
          <p class="nhc-summary-card__sub">요양원이 더 비쌈</p>
        </div>
      </div>
    </section>

    <!-- 섹션 2: 등급별 월비용 비교표 -->
    <section class="content-section">
      <h2 class="section-title">등급별 월비용 비교표</h2>
      <div style="overflow-x:auto">
        <table class="nhc-cost-table">
          <thead>
            <tr>
              <th>등급</th>
              <th class="nhc-col--facility">요양원<br/>본인부담 (일반)</th>
              <th class="nhc-col--facility">요양원<br/>+추가비용 합산</th>
              <th class="nhc-col--home">재가요양<br/>본인부담 (일반)</th>
              <th>차액</th>
            </tr>
          </thead>
          <tbody>
            {NH_COST_TABLE.map(row => (
              <tr>
                <td><strong>{row.label}</strong></td>
                {row.grade === "5" ? (
                  <>
                    <td class="nhc-cost-table__na">이용 불가</td>
                    <td class="nhc-cost-table__na">—</td>
                  </>
                ) : (
                  <>
                    <td>{row.facilityBurdenGeneral.toLocaleString()}원</td>
                    <td>{row.facilityTotalGeneral.toLocaleString()}원</td>
                  </>
                )}
                <td>{row.homeCareBurdenGeneral.toLocaleString()}원</td>
                <td class="nhc-cost-table__diff">
                  {row.grade !== "5" ? `+${row.diff.toLocaleString()}원` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style="font-size:0.75rem;color:#9ca3af;margin-top:0.5rem">
        * 요양원 추가비용(식비·기타 약 22만원) 포함 기준 / 재가는 월 한도 100% 이용 가정 / 추정값
      </p>
    </section>

    <!-- 섹션 3: 요양원 추가비용 상세 -->
    <section class="content-section">
      <h2 class="section-title">요양원, 이것도 따로 냅니다</h2>
      <table class="nhc-extra-table">
        <thead>
          <tr><th>항목</th><th>월 평균</th><th>비고</th></tr>
        </thead>
        <tbody>
          {NH_EXTRA_ITEMS.map(item => (
            <tr>
              <td>{item.label}</td>
              <td class="nhc-extra-table__amount">{item.monthly}</td>
              <td style="font-size:0.8125rem;color:#6b7280">{item.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>

    <!-- 섹션 4: 재가요양 서비스 조합 -->
    <section class="content-section">
      <h2 class="section-title">재가요양 조합 예시 (3등급 기준)</h2>
      <div class="nhc-combo-grid">
        {NH_SERVICE_COMBOS.map(combo => (
          <article class="nhc-combo-card">
            <span class={`nhc-combo-badge${combo.badge === "절약형" ? " nhc-combo-badge--saving" : ""}`}>
              {combo.badge}
            </span>
            <p class="nhc-combo-card__name">{combo.name}</p>
            <p class="nhc-combo-card__content">{combo.content}</p>
            <p class="nhc-combo-card__amount">
              월 본인부담 약 {Math.round(combo.monthlyEstimate * 0.15).toLocaleString()}원
              <span class="nhc-badge">추정</span>
            </p>
          </article>
        ))}
      </div>
    </section>

    <!-- 섹션 5: 선택 기준 체크리스트 -->
    <section class="content-section">
      <h2 class="section-title">우리 부모님은 요양원이 맞을까? 재가가 맞을까?</h2>
      <div style="overflow-x:auto">
        <table class="nhc-checklist">
          <thead>
            <tr>
              <th>상황</th>
              <th class="nhc-checklist__facility">요양원</th>
              <th class="nhc-checklist__home">재가요양</th>
            </tr>
          </thead>
          <tbody>
            {NH_CHECKLIST.map(item => (
              <tr>
                <td>{item.question}</td>
                <td class="nhc-checklist__facility">{item.facilityResult}</td>
                <td class="nhc-checklist__home">{item.homeResult}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    <!-- 섹션 6: 가족요양보호사 -->
    <section class="content-section">
      <h2 class="section-title">가족이 직접 돌보며 급여를 받는 방법</h2>
      <div class="nhc-family-box">
        <p class="nhc-family-box__title">💡 가족요양보호사 제도</p>
        <p class="nhc-family-box__body">
          배우자 또는 직계혈족이 요양보호사 자격증을 취득하면 직접 돌보며 하루 60분 기준으로
          장기요양 급여를 받을 수 있습니다. 교육 이수 시간은 약 240시간이며, 자격 취득 후 바로
          가족요양 신청이 가능합니다. 재가요양 비용을 대폭 줄일 수 있는 현실적인 방법입니다.
        </p>
      </div>
    </section>

    <!-- 섹션 7: 신청 절차 타임라인 -->
    <section class="content-section">
      <h2 class="section-title">장기요양 신청 절차</h2>
      <div class="nhc-timeline">
        {NH_TIMELINE.map(step => (
          <div class="nhc-timeline-item">
            <div class="nhc-timeline-item__dot">{step.step}</div>
            <div class="nhc-timeline-item__content">
              <p class="nhc-timeline-item__title">{step.title}</p>
              <p class="nhc-timeline-item__desc">{step.desc}</p>
              <span class="nhc-timeline-item__duration">{step.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </section>

    <!-- 섹션 8: 내부 CTA -->
    <section class="content-section">
      <div class="nhc-cta-box">
        <p class="nhc-cta-box__text">내 등급·소득으로 정확한 본인부담금 계산하기</p>
        <a href="/tools/ltci-grade-benefit-calculator-2026/" class="nhc-cta-box__btn">
          장기요양 계산기 →
        </a>
      </div>
    </section>

    <SeoContent
      introTitle="요양원 vs 재가요양, 어떻게 선택해야 할까"
      intro={NH_SEO_INTRO}
      criteria={NH_SEO_CRITERIA}
      faq={NH_FAQ.map(f => ({ question: f.q, answer: f.a }))}
      related={[
        { href: "/tools/ltci-grade-benefit-calculator-2026/", label: "장기요양등급 혜택·비용 계산기" },
        { href: "/tools/basic-pension-eligibility-calculator-2026/", label: "기초연금 수급 가능성 계산기" },
        { href: "/tools/welfare-benefit-eligibility-calculator/", label: "복지급여 수급 자격 계산기" },
        { href: "/reports/national-pension-generation-comparison-2026/", label: "국민연금 세대별 손익 비교" },
        { href: "/reports/government-welfare-benefits-2026/", label: "2026 정부 복지지원금 완전 정복" },
      ]}
    />
  </main>
  <SiteFooter />
</BaseLayout>
```

---

## 9. app.scss import

```scss
@use 'scss/pages/nursing-home-vs-home-care-cost-2026';
```

---

## 10. sitemap.xml

```xml
<url>
  <loc>https://bigyocalc.com/reports/nursing-home-vs-home-care-cost-2026/</loc>
  <changefreq>yearly</changefreq>
  <priority>0.7</priority>
</url>
```

---

## 11. 카테고리 등록

- `src/pages/index.astro` → `reportMetaBySlug`: `"nursing-home-vs-home-care-cost-2026": { category: "support", isNew: true }`
- `src/pages/reports/index.astro` → `reportMetaBySlug`:
  ```js
  "nursing-home-vs-home-care-cost-2026": {
    eyebrow: "요양원 vs 재가요양",
    tags: [{ label: "복지", mod: "support" }, { label: "노인", mod: "support" }, { label: "2026", mod: "support" }],
    category: "support",
    isNew: true,
  }
  ```
- `npm run check:all` 로 검증

---

## 12. 내부 CTA 전체 목록

| 위치 | 문구 | href |
|---|---|---|
| 섹션 8 CTA 박스 | 장기요양 계산기 | `/tools/ltci-grade-benefit-calculator-2026/` |
| SeoContent related | 기초연금 수급 가능성 계산기 | `/tools/basic-pension-eligibility-calculator-2026/` |
| SeoContent related | 복지급여 수급 자격 계산기 | `/tools/welfare-benefit-eligibility-calculator/` |
| SeoContent related | 국민연금 세대별 손익 비교 | `/reports/national-pension-generation-comparison-2026/` |
| SeoContent related | 2026 정부 복지지원금 완전 정복 | `/reports/government-welfare-benefits-2026/` |

---

## 13. QA 포인트

- [ ] 요약 카드 3개 — 요양원(보라)·재가(청록)·차액(주황) 색상 구분 확인
- [ ] 비교표 5등급 행 — 요양원 "이용 불가" 표시, 차액 "—" 표시
- [ ] 추가비용 표 금액 빨강 강조 확인
- [ ] 재가 조합 카드 4개 — "절약형" 배지만 초록색 구분
- [ ] 선택 기준 테이블 모바일 가로 스크롤 작동
- [ ] 가족요양보호사 박스 초록 border + 배경 확인
- [ ] 타임라인 스텝 연결선 정상 렌더링
- [ ] 내부 CTA → 장기요양 계산기 링크 정상
- [ ] InfoNotice 면책 배너 노출 확인
- [ ] `추정` 배지 비용 수치마다 부착 확인
- [ ] `npm run check:all` 통과
