# 태아보험 보험료 계산기 — 설계 문서

> 기획 원문: `docs/plan/202604/fetal-insurance-calculator.md`
> 작성일: 2026-04-17
> 구현 기준: Codex가 이 문서만 보고 바로 `/tools/` 페이지를 구현할 수 있는 수준으로 고정
> 참고 패턴: `pregnancy-birth-cost`, `child-tutoring-cost-calculator`

---

## 1. 문서 개요

- **slug**: `fetal-insurance-calculator`
- **URL**: `/tools/fetal-insurance-calculator/`
- **콘텐츠 유형**: 계산기 (`/tools/`)
- **레이아웃**: `BaseLayout` + `SimpleToolShell`
- **pageClass**: `fi-page`
- **resultFirst**: `true`

### 1-1. 페이지 목적

- 임신 주수, 산모 나이, 보장 수준, 특약 수, 납입 기간을 입력하면 **예상 월 보험료 범위**와 **총 납입 예상액**을 보여준다.
- 사용자가 가장 궁금해하는 질문인 `지금 가입 가능 구간인지`, `늦어진 편인지`, `무엇을 더 확인해야 하는지`를 숫자와 경고 카드로 바로 보여준다.
- 특정 보험사 직접 비교가 아니라 **조건별 보험료 범위 추정 + 체크리스트 도구**로 설계한다.

### 1-2. 핵심 UX 원칙

- 보험사명 직접 비교 제거
- 태아 성별 입력 제거
- `최저가` 표현 금지, `범위 추정`만 사용
- 결과 영역은 숫자 3개 + 가이드 카드 2개 구조로 단순화
- 모바일에서 입력 후 즉시 결과가 보이도록 한 화면 내 계산

---

## 2. 파일 구조

```text
src/
  data/
    fetalInsuranceCalculator.ts
    tools.ts
  pages/
    tools/
      fetal-insurance-calculator.astro

public/
  scripts/
    fetal-insurance-calculator.js

src/styles/scss/pages/
  _fetal-insurance-calculator.scss
```

추가 등록:

- `src/pages/index.astro` `topicBySlug`
- `src/pages/tools/index.astro` `topicBySlug`, `toolHighlights`
- `src/styles/app.scss`
- `public/sitemap.xml`

---

## 3. 데이터 파일 설계

파일: `src/data/fetalInsuranceCalculator.ts`

### 3-1. 타입 정의

```ts
export type FetalCoveragePlan = "basic" | "standard" | "enhanced";
export type PaymentTerm = "10y" | "20y" | "30y";
export type MaturityAge = "30" | "80" | "100";

export type WeekBand = {
  minWeek: number;
  maxWeek: number;
  label: string;
  status: "safe" | "caution" | "late";
};

export type PremiumRangeRule = {
  maternalAgeMin: number;
  maternalAgeMax: number;
  weekBand: string;
  plan: FetalCoveragePlan;
  paymentTerm: PaymentTerm;
  monthlyMin: number;
  monthlyMax: number;
};

export type SpecialContractOption = {
  id: string;
  label: string;
  extraMonthly: number;
  defaultSelected: boolean;
};

export type FetalGuideCard = {
  title: string;
  body: string;
  tone: "neutral" | "warn" | "positive";
};
```

### 3-2. 상수 데이터

```ts
export const FI_META = {
  slug: "fetal-insurance-calculator",
  title: "태아보험 보험료 계산기",
  updatedAt: "2026-04",
  disclaimer: "실제 보험료는 인수 조건, 고지사항, 특약 구성, 보험사 심사 결과에 따라 달라질 수 있습니다.",
};

export const FI_WEEK_BANDS: WeekBand[] = [
  { minWeek: 4, maxWeek: 11, label: "초기 검토 구간", status: "safe" },
  { minWeek: 12, maxWeek: 16, label: "비교 시작 적정 구간", status: "safe" },
  { minWeek: 17, maxWeek: 21, label: "가입 조건 확인 집중 구간", status: "caution" },
  { minWeek: 22, maxWeek: 27, label: "일부 특약 제한 가능 구간", status: "late" },
];

export const FI_SPECIAL_OPTIONS: SpecialContractOption[] = [
  { id: "newborn-admission", label: "신생아 입원", extraMonthly: 4000, defaultSelected: true },
  { id: "congenital-check", label: "선천 이상", extraMonthly: 6000, defaultSelected: true },
  { id: "nicu", label: "NICU/인큐베이터", extraMonthly: 4500, defaultSelected: true },
  { id: "surgery", label: "수술/입원", extraMonthly: 3500, defaultSelected: false },
  { id: "disease", label: "질병 진단", extraMonthly: 5000, defaultSelected: false },
];

export const FI_PREMIUM_RULES: PremiumRangeRule[] = [
  { maternalAgeMin: 20, maternalAgeMax: 29, weekBand: "early", plan: "basic", paymentTerm: "20y", monthlyMin: 28000, monthlyMax: 38000 },
  { maternalAgeMin: 20, maternalAgeMax: 29, weekBand: "early", plan: "standard", paymentTerm: "20y", monthlyMin: 42000, monthlyMax: 56000 },
  { maternalAgeMin: 20, maternalAgeMax: 29, weekBand: "early", plan: "enhanced", paymentTerm: "20y", monthlyMin: 58000, monthlyMax: 76000 },
  { maternalAgeMin: 30, maternalAgeMax: 34, weekBand: "early", plan: "standard", paymentTerm: "20y", monthlyMin: 46000, monthlyMax: 62000 },
  { maternalAgeMin: 35, maternalAgeMax: 39, weekBand: "mid", plan: "standard", paymentTerm: "20y", monthlyMin: 52000, monthlyMax: 70000 },
  { maternalAgeMin: 35, maternalAgeMax: 39, weekBand: "late", plan: "enhanced", paymentTerm: "20y", monthlyMin: 70000, monthlyMax: 92000 },
];
```

실제 구현에서는 위 예시보다 더 촘촘한 룰 테이블이 필요하다. 최소 조합:

- 산모 나이: `20~29`, `30~34`, `35~39`, `40+`
- 주수 구간: `4~11`, `12~16`, `17~21`, `22~27`
- 보장 수준: `basic`, `standard`, `enhanced`
- 납입 기간: `10y`, `20y`, `30y`

### 3-3. FAQ / 관련 링크

```ts
export const FI_FAQ = [
  {
    question: "태아보험은 몇 주까지 가입 가능한가요?",
    answer: "보험사와 특약 구성에 따라 다르지만 일반적으로 임신 22주 전후까지 비교를 마치는 흐름을 권장합니다. 이 계산기는 주수별 체크 구간을 안내하는 용도입니다.",
  },
  {
    question: "성별 입력 없이도 계산이 되나요?",
    answer: "됩니다. 이 페이지는 보험사 실견적 비교가 아니라 보장 수준과 주수 기준의 범위 추정 계산기라 성별 입력을 받지 않습니다.",
  },
  {
    question: "총 납입액은 어떻게 계산하나요?",
    answer: "월 보험료 추정 범위에 납입 기간 개월 수를 곱해 최소값과 최대값 범위로 계산합니다.",
  },
];

export const FI_RELATED_LINKS = [
  { href: "/reports/fetal-insurance-guide-2026/", label: "태아보험 2026 가입 가이드" },
  { href: "/tools/pregnancy-birth-cost/", label: "임신 출산 비용 계산기" },
  { href: "/reports/postpartum-center-cost-2026/", label: "산후조리원 비용 비교 2026" },
];
```

---

## 4. 페이지 섹션 구성

파일: `src/pages/tools/fetal-insurance-calculator.astro`

### 4-1. Hero

- eyebrow: `임신·출산 보험`
- title: `태아보험 보험료 계산기`
- description: `임신 주수, 산모 나이, 보장 수준 기준으로 예상 보험료 범위와 가입 체크포인트를 바로 확인합니다.`

### 4-2. 안내 박스

`InfoNotice` 3줄:

- 실시간 보험사 견적이 아니라 범위 추정 도구라는 점
- 실제 보험료는 심사 조건과 고지사항에 따라 달라진다는 점
- `updatedAt` 기준 명시

### 4-3. 입력 패널

섹션 A. 기본 조건

- `임신 주수` `input[type=number]`
- `산모 나이` `input[type=number]`
- `보장 수준` `radio 3개`
- `납입 기간` `segmented button`
- `만기` `select`

섹션 B. 특약 선택

- `checkbox` 목록 5개
- 기본 선택 2~3개 활성화

섹션 C. 옵션

- `고위험 임신 여부` `toggle`
- `취약지 추가 여부` `toggle`

하단 액션:

- `계산하기`
- `초기화`
- `링크 복사`

### 4-4. 결과 패널

결과 KPI 카드 3개

- `예상 월 보험료 범위`
- `총 납입 예상액`
- `현재 주수 체크 상태`

가이드 카드 2개

- `지금 확인할 포인트`
- `가입 늦어질 때 주의점`

비교 테이블

- 기본형 / 표준형 / 강화형 3열
- 선택한 조건 기준 월 보험료 범위 표기

해석 섹션

- 왜 범위로만 보여주는지
- 총 납입액 해석
- 특약 체크 순서

FAQ

관련 링크 CTA

### 4-5. JSON-LD

- `WebApplication`
- `FAQPage`

---

## 5. JavaScript 인터랙션 설계

파일: `public/scripts/fetal-insurance-calculator.js`

### 5-1. 상태 객체

```js
const state = {
  week: 12,
  maternalAge: 32,
  plan: "standard",
  paymentTerm: "20y",
  maturityAge: "80",
  specialOptions: ["newborn-admission", "congenital-check", "nicu"],
  highRisk: false,
  underserved: false,
};
```

### 5-2. 주요 함수

| 함수 | 역할 |
|---|---|
| `readState()` | DOM 값을 읽어 상태 갱신 |
| `resolveWeekBand(week)` | 주수 구간과 상태 배지 계산 |
| `findPremiumBase(state)` | 가장 가까운 보험료 룰 테이블 선택 |
| `calcSpecialOptionCost(ids)` | 특약 추가 비용 합산 |
| `calculate(state)` | 월 보험료 최소/최대, 총 납입액 계산 |
| `renderResult(result)` | KPI 카드/가이드 카드/표 렌더 |
| `renderGuides(result)` | safe/caution/late 문구 분기 |
| `syncUrl()` | query string 반영 |
| `restoreFromUrl()` | 공유 URL 복원 |

### 5-3. 계산 로직

```text
기본 보험료 범위 = 룰 테이블 기준 최소/최대
특약 추가 비용 = 선택 특약 월 비용 합계
고위험 임신 가산 = +8% ~ +15% 범위
취약지 추가 = 총 납입액 설명 카드에만 문구 반영, 보험료 직접 가산 없음

월 보험료 최소 = 기본 최소 + 특약 추가
월 보험료 최대 = 기본 최대 + 특약 추가

총 납입 최소 = 월 보험료 최소 × 납입 기간 개월 수
총 납입 최대 = 월 보험료 최대 × 납입 기간 개월 수
```

### 5-4. 출력 포맷

- 월 보험료: `4.8만 ~ 6.4만 원`
- 총 납입액: `1,152만 ~ 1,536만 원`
- 주수 상태 배지: `적정`, `확인 필요`, `늦은 편`

### 5-5. 방어 로직

- 주수 최소 `4`, 최대 `32`
- 나이 최소 `20`, 최대 `45`
- 룰 매칭 실패 시 가장 가까운 연령/주수 구간으로 fallback
- NaN 입력 시 기본값으로 회귀

---

## 6. SCSS 설계

파일: `src/styles/scss/pages/_fetal-insurance-calculator.scss`

prefix: `fi-`

### 6-1. 핵심 컴포넌트

- `.fi-page`
- `.fi-step`
- `.fi-chip-row`
- `.fi-special-list`
- `.fi-result-grid`
- `.fi-kpi-card`
- `.fi-guide-grid`
- `.fi-guide-card`
- `.fi-compare-table`
- `.fi-status-badge`

### 6-2. 톤

- 메인 컬러: 청록/민트 계열
- 경고 카드: 앰버
- 늦은 구간 배지: 코랄

### 6-3. 모바일 기준

- 입력 필드 1열
- KPI 카드 1열 → 3열 확장
- 비교 테이블은 가로 스크롤 허용

---

## 7. 등록 작업

### 7-1. `src/data/tools.ts`

```ts
{
  slug: "fetal-insurance-calculator",
  title: "태아보험 보험료 계산기",
  description: "임신 주수와 보장 수준 기준으로 예상 보험료 범위와 총 납입액을 계산합니다.",
  order: 70,
  eyebrow: "임신·출산 보험",
  category: "calculator",
  badges: ["태아보험", "보험료", "임신", "2026"],
}
```

### 7-2. 분류 등록

- `src/pages/index.astro`
- `src/pages/tools/index.astro`

```ts
"fetal-insurance-calculator": "육아·복지·출산"
```

### 7-3. `src/styles/app.scss`

```scss
@use 'scss/pages/fetal-insurance-calculator';
```

### 7-4. `public/sitemap.xml`

```xml
<url>
  <loc>https://bigyocalc.com/tools/fetal-insurance-calculator/</loc>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## 8. 구현 순서

1. `fetalInsuranceCalculator.ts` 작성
2. `.astro` 페이지 기본 레이아웃 작성
3. `fetal-insurance-calculator.js` 계산 로직 작성
4. SCSS 작성 및 `app.scss` 등록
5. `tools.ts`, 메인/도구 인덱스 분류 추가
6. sitemap 등록
7. `npm run build` 검증

---

## 9. QA 체크리스트

- [ ] 주수별 상태 배지가 `적정/확인 필요/늦은 편`으로 정확히 바뀌는지
- [ ] 특약 선택 수가 늘면 월 보험료 범위가 같이 증가하는지
- [ ] 고위험 임신 토글이 가이드 문구와 범위 가산에 반영되는지
- [ ] URL 공유 후 같은 입력 상태가 복원되는지
- [ ] 모바일에서 비교 테이블이 깨지지 않는지
- [ ] 결과 문구에 `최저가`, `확정`, `무조건` 같은 표현이 없는지
- [ ] `npm run build` 통과

