# 태아보험 언제 가입해야 할까? 2026 완전 가이드 — 설계 문서

> 기획 원문: `docs/plan/202604/fetal-insurance-guide-2026.md`
> 작성일: 2026-04-17
> 구현 기준: Codex가 이 문서만 보고 바로 `/reports/` 페이지를 구현할 수 있는 수준으로 고정
> 참고 패턴: `postpartum-center-cost-2026`, `elementary-school-ready-cost-2026`

---

## 1. 문서 개요

- **slug**: `fetal-insurance-guide-2026`
- **URL**: `/reports/fetal-insurance-guide-2026/`
- **콘텐츠 유형**: 리포트 (`/reports/`)
- **레이아웃**: `BaseLayout`
- **pageClass**: `fetal-guide-report-page`

### 1-1. 페이지 목적

- 사용자가 `태아보험을 지금 알아봐도 되는지`, `몇 주에 무엇을 체크해야 하는지`, `어떤 특약을 우선순위로 봐야 하는지`를 한 페이지에서 이해하게 한다.
- 보험사 직접 비교 페이지가 아니라 **가입 시기 판단 + 체크리스트 + 특약 구조 이해** 리포트로 설계한다.
- 계산기로 자연스럽게 이어지는 내부 링크 허브 역할도 맡는다.

### 1-2. 핵심 메시지

- `12주 전후부터 체크를 시작하고, 22주 전후에는 조건 제한 가능성을 반드시 확인한다`
- `보험사명 최저가 경쟁보다 특약 구조와 중복 보장 정리가 더 중요하다`
- `2026 기준으로도 숫자 하나보다 체크 구간과 확인 항목이 핵심이다`

---

## 2. 파일 구조

```text
src/
  data/
    fetalInsuranceGuide2026.ts
    reports.ts
  pages/
    reports/
      fetal-insurance-guide-2026.astro

public/
  scripts/
    fetal-insurance-guide-2026.js

src/styles/scss/pages/
  _fetal-insurance-guide-2026.scss
```

추가 등록:

- `src/pages/index.astro` 리포트 카테고리 메타
- `src/pages/reports/index.astro` 리포트 카테고리 메타
- `src/styles/app.scss`
- `public/sitemap.xml`

---

## 3. 데이터 파일 설계

파일: `src/data/fetalInsuranceGuide2026.ts`

### 3-1. 타입 정의

```ts
export type GuideStageTone = "safe" | "warn" | "danger";

export type WeekStage = {
  id: string;
  label: string;
  weekRange: string;
  tone: GuideStageTone;
  summary: string;
  action: string;
};

export type CoverageCheckItem = {
  category: string;
  item: string;
  why: string;
  priority: "high" | "medium" | "low";
};

export type DuplicateCoverageTip = {
  title: string;
  body: string;
};

export type PaymentTermCompareRow = {
  term: string;
  monthly: string;
  total: string;
  suitableFor: string;
};

export type FAQItem = {
  q: string;
  a: string;
};
```

### 3-2. 상단 KPI 데이터

```ts
export const FIG_HERO_STATS = [
  { label: "체크 시작 권장", value: "12주 전후", note: "구조 비교 시작" },
  { label: "조건 확인 집중", value: "17~21주", note: "특약 범위 점검" },
  { label: "제한 가능 구간", value: "22주 전후", note: "일부 특약 제한 가능" },
  { label: "핵심 포인트", value: "특약 구조", note: "보험사명보다 중요" },
];
```

### 3-3. 주수별 체크 흐름

```ts
export const FIG_WEEK_STAGES: WeekStage[] = [
  {
    id: "early",
    label: "비교 시작 구간",
    weekRange: "4~11주",
    tone: "safe",
    summary: "보험료보다 어떤 특약 구조를 볼지 정리하기 좋은 구간",
    action: "기본 보장과 예산 범위를 먼저 정리",
  },
  {
    id: "best",
    label: "적정 검토 구간",
    weekRange: "12~16주",
    tone: "safe",
    summary: "기형아 검사 이후 비교를 본격적으로 시작하기 좋은 구간",
    action: "태아 특약과 중복 보장 여부를 함께 점검",
  },
  {
    id: "focus",
    label: "조건 확인 집중 구간",
    weekRange: "17~21주",
    tone: "warn",
    summary: "비교를 미루지 말고 실제 가입 가능 조건을 빠르게 확인해야 하는 구간",
    action: "주요 특약 제한 여부와 고지사항 재점검",
  },
  {
    id: "late",
    label: "제한 가능 구간",
    weekRange: "22주 이후",
    tone: "danger",
    summary: "일부 특약 제한 또는 가입 가능 상품 축소 가능성이 커지는 구간",
    action: "가능 상품 범위를 먼저 확인하고 우선순위 특약부터 정리",
  },
];
```

### 3-4. 특약 체크리스트

```ts
export const FIG_COVERAGE_CHECKLIST: CoverageCheckItem[] = [
  { category: "우선 확인", item: "선천 이상 관련 특약", why: "가입 시기에 따라 제한 가능성이 큼", priority: "high" },
  { category: "우선 확인", item: "신생아 입원", why: "출생 직후 보장 체감이 큰 항목", priority: "high" },
  { category: "우선 확인", item: "NICU/인큐베이터", why: "조산·입원 이슈와 연결", priority: "high" },
  { category: "구조 확인", item: "수술/입원", why: "다른 실손·건강보험과 중복 여부 점검 필요", priority: "medium" },
  { category: "구조 확인", item: "질병 진단", why: "정액 보장인지 비례 보장인지 확인 필요", priority: "medium" },
];
```

### 3-5. 중복 보장 / 납입기간 비교 / FAQ / 관련 링크

```ts
export const FIG_DUPLICATE_TIPS: DuplicateCoverageTip[] = [
  {
    title: "실손 계열은 여러 개 가입해도 실제 손해 범위 내에서만 보장될 수 있습니다.",
    body: "정액 진단비와 실손 보장을 구분해서 봐야 합니다.",
  },
  {
    title: "보장 항목이 많아도 이미 가진 보험과 겹치면 체감 효율이 떨어질 수 있습니다.",
    body: "배우자 보험, 기존 어린이보험 예정 구조와 같이 보세요.",
  },
];

export const FIG_PAYMENT_TERM_ROWS: PaymentTermCompareRow[] = [
  { term: "10년 납", monthly: "높음", total: "낮음", suitableFor: "단기 부담 가능, 총액 최소화 선호" },
  { term: "20년 납", monthly: "중간", total: "중간", suitableFor: "가장 무난한 기본형" },
  { term: "30년 납", monthly: "낮음", total: "높음", suitableFor: "월 부담 최소화 우선" },
];

export const FIG_FAQ: FAQItem[] = [
  { q: "태아보험은 꼭 12주 전에 가입해야 하나요?", a: "아닙니다. 다만 12주 전후는 비교를 시작하기 좋은 구간이고, 22주 전후부터는 일부 조건 제한 가능성을 반드시 확인해야 합니다." },
  { q: "보험사 비교를 직접 보여주지 않는 이유는 무엇인가요?", a: "이 페이지는 특정 보험사 광고형 비교가 아니라 주수별 판단과 특약 구조 이해에 초점을 둔 가이드형 리포트입니다." },
  { q: "기존 보험이 있으면 무엇부터 봐야 하나요?", a: "실손성 보장과 정액 보장을 먼저 나눠 보고, 출생 직후 체감이 큰 특약부터 중복 여부를 점검하는 흐름이 좋습니다." },
];

export const FIG_RELATED_LINKS = [
  { href: "/tools/fetal-insurance-calculator/", label: "태아보험 보험료 계산기" },
  { href: "/tools/pregnancy-birth-cost/", label: "임신 출산 비용 계산기" },
  { href: "/reports/postpartum-center-cost-2026/", label: "산후조리원 비용 비교 2026" },
];
```

---

## 4. 페이지 섹션 구성

파일: `src/pages/reports/fetal-insurance-guide-2026.astro`

### 4-1. 상단 구조

1. `CalculatorHero`
2. `InfoNotice`
3. KPI 카드 4개
4. TOC

### 4-2. 본문 섹션

섹션 1. 태아보험이 무엇인지

- 보험사 비교보다 특약 구조를 먼저 이해해야 한다는 설명

섹션 2. 언제부터 알아보면 좋은지

- `FIG_WEEK_STAGES` 4단계 카드
- 각 구간별 `지금 해야 할 일`

섹션 3. 주수별 체크라인

- 가로 타임라인 또는 세로 스텝
- `12주`, `16주`, `20주`, `22주 이후`

섹션 4. 꼭 확인할 특약

- 우선 확인 / 구조 확인 2그룹 카드

섹션 5. 자주 겹치는 보장

- `FIG_DUPLICATE_TIPS`
- 실손/정액 구조 차이 요약

섹션 6. 10년 납 vs 20년 납 vs 30년 납

- 비교 테이블
- 월 부담 vs 총 납입액 해석 문구

섹션 7. 2026 기준 체크 포인트

- `제도 변경`이 아니라 `현재 기준 확인 사항` 톤으로 작성
- 과장 표현 금지

섹션 8. 내부 링크 카드

- 계산기 이동 CTA
- 임신/출산 관련 페이지 2~3개 연결

섹션 9. FAQ

섹션 10. `SeoContent`

### 4-3. 인터랙션

- TOC 스크롤 이동
- FAQ accordion
- 체크리스트 항목 접기/펼치기 정도만 사용
- 페이지 본문은 정적 중심

---

## 5. JavaScript 설계

파일: `public/scripts/fetal-insurance-guide-2026.js`

### 5-1. 기능 범위

| 기능 | 설명 |
|---|---|
| `initTOC()` | 목차 클릭 시 부드러운 스크롤 |
| `initFaq()` | FAQ accordion |
| `initSectionObserver()` | 현재 읽는 섹션 TOC 강조 |

이 페이지는 계산 로직이 없고 문서형 인터랙션만 둔다.

### 5-2. 상태

- 전역 상태 객체 불필요
- DOM dataset 기반 최소 인터랙션

---

## 6. SCSS 설계

파일: `src/styles/scss/pages/_fetal-insurance-guide-2026.scss`

prefix: `fig-`

### 6-1. 주요 클래스

- `.fetal-guide-report-page`
- `.fig-overview-grid`
- `.fig-kpi-card`
- `.fig-toc`
- `.fig-stage-grid`
- `.fig-stage-card`
- `.fig-check-grid`
- `.fig-check-card`
- `.fig-duplicate-grid`
- `.fig-payment-table`
- `.fig-cta-card`
- `.fig-faq-item`

### 6-2. 비주얼 방향

- 임신/출산 카테고리에 맞는 따뜻한 베이지 + 코랄 포인트
- `safe / warn / danger` 카드 배경 차등
- 보고서형 페이지이므로 카드와 테이블 가독성 우선

---

## 7. 등록 작업

### 7-1. `src/data/reports.ts`

```ts
{
  slug: "fetal-insurance-guide-2026",
  title: "태아보험 언제 가입해야 할까? 2026 완전 가이드",
  description: "임신 주수별 체크라인과 특약 구조를 기준으로 태아보험 가입 시기를 정리한 가이드입니다.",
  order: 90,
  badges: ["태아보험", "가입시기", "임신", "2026"],
}
```

### 7-2. 카테고리 매핑

- `src/pages/index.astro`
- `src/pages/reports/index.astro`

```ts
"fetal-insurance-guide-2026": { category: "life", isNew: true }
```

### 7-3. `src/styles/app.scss`

```scss
@use 'scss/pages/fetal-insurance-guide-2026';
```

### 7-4. `public/sitemap.xml`

```xml
<url>
  <loc>https://bigyocalc.com/reports/fetal-insurance-guide-2026/</loc>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## 8. 구현 순서

1. `fetalInsuranceGuide2026.ts` 작성
2. `.astro` 본문 구조 작성
3. `fetal-insurance-guide-2026.js` 인터랙션 작성
4. SCSS 작성 및 `app.scss` 등록
5. `reports.ts`, 메인/리포트 인덱스 등록
6. sitemap 등록
7. `npm run build` 검증

---

## 9. QA 체크리스트

- [ ] 상단 KPI 카드와 주수별 단계 카드 문구가 서로 충돌하지 않는지
- [ ] `22주 이후` 문구가 과장 없이 `제한 가능성` 톤으로 유지되는지
- [ ] 보험사 직접 비교나 최저가 표현이 들어가지 않는지
- [ ] FAQ accordion과 TOC 스크롤이 모바일에서 정상 동작하는지
- [ ] 내부 링크가 실제 존재하는 페이지로 연결되는지
- [ ] `npm run build` 통과

