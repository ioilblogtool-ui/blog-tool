# 청년미래적금 2026 리포트 — 설계 문서

> 기획 원문: `docs/plan/202605/youth-future-savings-2026.md`  
> 작성일: 2026-05-31  
> 구현 기준: 이 문서만 보고 `/reports/` 리포트 페이지 구현에 착수할 수 있는 수준

---

## 1. 문서 개요

- 구현 대상: 청년미래적금 조건·만기 수령액 정리 2026
- 슬러그: `youth-future-savings-2026`
- URL: `/reports/youth-future-savings-2026/`
- 콘텐츠 유형: 정책금융 리포트 + 정적 시뮬레이션
- 핵심 CTA: `/tools/welfare-benefit-eligibility/`, 향후 `/tools/youth-future-savings-calculator/`
- 보조 CTA: `/reports/2026-government-welfare-benefits/`, `/tools/savings-vs-etf-retirement/`
- 주요 검색 의도: `청년미래적금 조건`, `청년미래적금 신청`, `청년미래적금 만기 수령액`, `청년미래적금 계산기`, `청년도약계좌 갈아타기`

### 구현 방향

청년미래적금은 단순 안내형 글이 아니라 **가입 가능성 확인 → 일반형/우대형 비교 → 월 납입액별 수령액 → 청년도약계좌 비교 → 신청 전 체크리스트** 흐름으로 구성한다.

계산 결과와 정책 조건은 모두 공식값·공시값·추정값을 배지로 분리한다. 금융상품 가입 권유처럼 보이지 않게 “정보 정리 및 계산 보조” 톤을 유지한다.

---

## 2. 파일 구조

```text
src/
  data/
    youthFutureSavings2026.ts
  pages/
    reports/
      youth-future-savings-2026.astro

public/
  scripts/
    youth-future-savings-2026.js
  og/
    reports/
      youth-future-savings-2026.png

src/styles/scss/pages/
  _youth-future-savings-2026.scss
```

추가 등록:

- `src/data/reports.ts`
- `src/pages/index.astro`
- `src/pages/reports/index.astro`
- `src/styles/app.scss`
- `public/sitemap.xml`

---

## 3. 데이터 설계

### 3-1. 타입 정의

```ts
// src/data/youthFutureSavings2026.ts

export type YouthFutureBadge = "공식" | "공시" | "추정" | "확인 필요";

export interface YouthFutureMeta {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  updatedAt: string;
  sourceLabel: string;
}

export interface SummaryMetric {
  label: string;
  value: string;
  note: string;
  badge: YouthFutureBadge;
}

export interface EligibilityCheck {
  id: string;
  label: string;
  value: string;
  detail: string;
  badge: YouthFutureBadge;
}

export interface AccountTypeComparison {
  id: "general" | "preferred";
  name: string;
  contributionRate: number;
  target: string;
  checks: string[];
  caution: string;
}

export interface MaturityScenario {
  monthlyContribution: number;
  principal: number;
  generalContribution: number;
  preferredContribution: number;
  estimatedInterestMin: number;
  estimatedInterestMax: number;
  generalMaturityMin: number;
  generalMaturityMax: number;
  preferredMaturityMin: number;
  preferredMaturityMax: number;
  badge: YouthFutureBadge;
}

export interface BankRateInfo {
  id: string;
  name: string;
  baseRate: number;
  maxBonusRate: number;
  maxRate: number;
  tags: string[];
  note: string;
  badge: YouthFutureBadge;
}

export interface LeapComparisonRow {
  label: string;
  youthFuture: string;
  youthLeap: string;
  interpretation: string;
}

export interface DecisionCard {
  title: string;
  fit: string;
  checks: string[];
}

export interface YouthFutureFaq {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}
```

### 3-2. 메타 데이터

```ts
export const YOUTH_FUTURE_META: YouthFutureMeta = {
  slug: "youth-future-savings-2026",
  title: "청년미래적금 조건·만기 수령액 정리 2026",
  metaTitle: "청년미래적금 조건·만기 수령액 2026｜가입 대상·정부기여금·청년도약계좌 비교",
  description:
    "2026년 청년미래적금 가입 조건, 신청기간, 정부기여금, 우대금리, 비과세 혜택, 청년도약계좌 갈아타기 여부를 정리합니다. 월 납입액별 만기 수령액과 일반형·우대형 차이도 비교하세요.",
  ogTitle: "청년미래적금 조건·만기 수령액 2026",
  ogDescription:
    "가입 대상부터 정부기여금, 우대금리, 청년도약계좌 갈아타기까지 한 화면에서 확인하세요.",
  updatedAt: "2026.05.31",
  sourceLabel: "금융위원회 공개자료 및 은행연합회 공시 안내 기준",
};
```

### 3-3. 핵심 요약 카드

```ts
export const SUMMARY_METRICS: SummaryMetric[] = [
  {
    label: "출시 예정일",
    value: "2026년 6월 22일",
    note: "최초 신청기간은 출시일부터 2주 운영 안내",
    badge: "공식",
  },
  {
    label: "월 납입 한도",
    value: "최대 50만 원",
    note: "3년 만기 자유적립식 구조",
    badge: "공식",
  },
  {
    label: "정부기여금",
    value: "6% / 12%",
    note: "일반형 6%, 우대형 12% 기준",
    badge: "공식",
  },
  {
    label: "최고 금리",
    value: "연 7~8%",
    note: "기본금리와 기관별 우대금리 합산",
    badge: "공시",
  },
];
```

### 3-4. 가입 대상 체크리스트

```ts
export const ELIGIBILITY_CHECKS: EligibilityCheck[] = [
  {
    id: "age",
    label: "나이",
    value: "만 19~34세",
    detail: "병역 이행자는 병역기간을 제외할 수 있으며, 일부 출생연도 예외가 안내되어 있습니다.",
    badge: "공식",
  },
  {
    id: "income",
    label: "개인소득",
    value: "총급여·종합소득 기준 확인",
    detail: "일반형과 우대형의 소득 기준이 다르므로 본인의 전년도 소득 자료를 확인해야 합니다.",
    badge: "공식",
  },
  {
    id: "household",
    label: "가구소득",
    value: "기준 중위소득 조건",
    detail: "가구원 수와 소득 산정 방식에 따라 판정이 달라질 수 있습니다.",
    badge: "확인 필요",
  },
  {
    id: "work",
    label: "직장·사업 유형",
    value: "직장인·중소기업·소상공인",
    detail: "우대형은 재직기간, 신규 취업 여부, 소상공인 매출 기준 등 세부 조건 확인이 필요합니다.",
    badge: "확인 필요",
  },
  {
    id: "exclusion",
    label: "제외 가능성",
    value: "금융소득 종합과세 등",
    detail: "최근 금융소득 종합과세 여부나 일부 업종 제한은 신청 전 확인해야 합니다.",
    badge: "확인 필요",
  },
];
```

### 3-5. 일반형 vs 우대형 비교

```ts
export const ACCOUNT_TYPE_COMPARISONS: AccountTypeComparison[] = [
  {
    id: "general",
    name: "일반형",
    contributionRate: 6,
    target: "기본 가입 조건을 충족하는 청년",
    checks: ["개인소득", "가구소득", "금융소득 종합과세 여부"],
    caution: "대부분의 사용자가 먼저 확인해야 할 기본 유형입니다.",
  },
  {
    id: "preferred",
    name: "우대형",
    contributionRate: 12,
    target: "조건을 충족하는 중소기업 재직 청년 또는 소상공인 청년",
    checks: ["재직기간", "신규 취업 여부", "소상공인 매출", "가구소득"],
    caution: "중소기업 재직자라도 세부 요건에 따라 우대형이 아닐 수 있습니다.",
  },
];
```

### 3-6. 월 납입액별 만기 시나리오

> 초기 구현에서는 정적 시나리오 표로 제공한다. 공식 이자 산식과 은행별 금리가 안정되면 전용 계산기로 분리한다.

```ts
const MONTHS = 36;
const GENERAL_CONTRIBUTION_RATE = 0.06;
const PREFERRED_CONTRIBUTION_RATE = 0.12;

const makeScenario = (monthlyContribution: number): MaturityScenario => {
  const principal = monthlyContribution * MONTHS;
  const generalContribution = Math.round(principal * GENERAL_CONTRIBUTION_RATE);
  const preferredContribution = Math.round(principal * PREFERRED_CONTRIBUTION_RATE);

  // 월납입 적금 단순 추정: 평균 잔액 기준 3년 금리 7~8%를 보수적으로 반영
  const estimatedInterestMin = Math.round(monthlyContribution * ((MONTHS * (MONTHS + 1)) / 2) * (0.07 / 12));
  const estimatedInterestMax = Math.round(monthlyContribution * ((MONTHS * (MONTHS + 1)) / 2) * (0.08 / 12));

  return {
    monthlyContribution,
    principal,
    generalContribution,
    preferredContribution,
    estimatedInterestMin,
    estimatedInterestMax,
    generalMaturityMin: principal + generalContribution + estimatedInterestMin,
    generalMaturityMax: principal + generalContribution + estimatedInterestMax,
    preferredMaturityMin: principal + preferredContribution + estimatedInterestMin,
    preferredMaturityMax: principal + preferredContribution + estimatedInterestMax,
    badge: "추정",
  };
};

export const MATURITY_SCENARIOS: MaturityScenario[] = [
  makeScenario(100000),
  makeScenario(300000),
  makeScenario(500000),
];
```

### 3-7. 은행별 금리 데이터

> 은행별 조건은 구현 직전 은행연합회 소비자포털 기준으로 재확인한다. 초기 데이터는 대표 그룹 단위로 정리하고, 실제 공시값 입력 시 개별 은행 레코드로 확장한다.

```ts
export const BANK_RATE_INFOS: BankRateInfo[] = [
  {
    id: "major-special",
    name: "주요 시중은행·기업은행·우정사업본부",
    baseRate: 5,
    maxBonusRate: 3,
    maxRate: 8,
    tags: ["급여이체", "카드", "자동이체", "재무상담"],
    note: "기관별 세부 우대조건 충족 시 최고금리 적용 가능",
    badge: "공시",
  },
  {
    id: "regional-internet",
    name: "지방은행·수협·인터넷은행",
    baseRate: 5,
    maxBonusRate: 2,
    maxRate: 7,
    tags: ["첫거래", "자동이체", "앱가입", "재무상담"],
    note: "은행별 우대조건과 신청 채널 확인 필요",
    badge: "공시",
  },
];
```

### 3-8. 청년도약계좌 비교

```ts
export const LEAP_COMPARISON_ROWS: LeapComparisonRow[] = [
  {
    label: "만기",
    youthFuture: "3년",
    youthLeap: "5년",
    interpretation: "청년미래적금은 유지 부담이 상대적으로 짧습니다.",
  },
  {
    label: "월 납입 한도",
    youthFuture: "50만 원",
    youthLeap: "70만 원",
    interpretation: "월 납입 여력이 큰 사용자는 총 납입 한도도 함께 봐야 합니다.",
  },
  {
    label: "핵심 혜택",
    youthFuture: "정부기여금 6% 또는 12% + 비과세",
    youthLeap: "소득 구간별 정부기여금 + 비과세",
    interpretation: "본인의 소득과 우대형 해당 여부가 판단의 핵심입니다.",
  },
  {
    label: "갈아타기",
    youthFuture: "최초 가입기간 한정 전환 안내",
    youthLeap: "기존 가입자 선택 필요",
    interpretation: "해지와 전환은 실제 안내 절차를 확인해야 합니다.",
  },
];
```

### 3-9. 전환 판단 카드

```ts
export const DECISION_CARDS: DecisionCard[] = [
  {
    title: "청년미래적금 우대형 가능성이 높다면",
    fit: "전환 검토 우선",
    checks: ["중소기업 재직 또는 신규 취업 조건", "소득 기준", "3년 납입 유지 가능성"],
  },
  {
    title: "청년도약계좌 납입 기간이 많이 남았다면",
    fit: "유지와 전환 비교",
    checks: ["기존 납입기간", "해지 시 혜택 유지 여부", "전환 신청기간"],
  },
  {
    title: "월 50만 원 유지가 부담된다면",
    fit: "납입액 현실화",
    checks: ["비상금", "월 고정지출", "중도해지 가능성"],
  },
];
```

### 3-10. FAQ

```ts
export const YOUTH_FUTURE_FAQS: YouthFutureFaq[] = [
  {
    question: "청년미래적금은 누구나 가입할 수 있나요?",
    answer:
      "아닙니다. 나이, 개인소득, 가구소득, 금융소득 종합과세 여부, 직장 또는 사업 유형 등 조건을 확인해야 합니다.",
  },
  {
    question: "월 50만 원을 꼭 넣어야 하나요?",
    answer:
      "월 최대 50만 원 한도 안에서 자유롭게 납입하는 구조입니다. 다만 만기 수령액을 최대로 보려면 납입액이 중요합니다.",
  },
  {
    question: "일반형과 우대형의 가장 큰 차이는 무엇인가요?",
    answer:
      "정부기여금 비율 차이가 핵심입니다. 일반형은 납입액의 6%, 우대형은 12% 기준으로 설명할 수 있으나 우대형은 세부 조건 확인이 필요합니다.",
  },
  {
    question: "청년도약계좌에서 갈아타는 게 무조건 유리한가요?",
    answer:
      "무조건 유리하다고 단정할 수 없습니다. 기존 납입 기간, 적용 혜택, 전환 가능 기간, 본인의 청년미래적금 유형을 함께 봐야 합니다.",
  },
  {
    question: "만기 수령액 계산은 확정 금액인가요?",
    answer:
      "아닙니다. 월 납입액, 적용금리, 우대금리 충족 여부, 정부기여금 적용 여부에 따라 달라지는 추정값입니다.",
  },
];
```

### 3-11. 관련 링크

```ts
export const RELATED_LINKS: RelatedLink[] = [
  {
    href: "/reports/2026-government-welfare-benefits/",
    label: "2026 정부 복지지원금 완전 정복",
    description: "청년 자산형성 지원금과 다른 복지 제도를 함께 확인합니다.",
  },
  {
    href: "/tools/welfare-benefit-eligibility/",
    label: "복지급여 수급 자격 계산기",
    description: "가구소득 기준으로 지원 가능성을 간단히 점검합니다.",
  },
  {
    href: "/tools/savings-vs-etf-retirement/",
    label: "월 적금 vs ETF 노후 계산기",
    description: "적금 안정성과 장기 투자 수익률을 비교합니다.",
  },
  {
    href: "/tools/travel-savings-goal-calculator/",
    label: "여행 적금 목표 계산기",
    description: "월 저축 목표를 계산하는 경험으로 연결합니다.",
  },
];
```

---

## 4. 페이지 구조

### 4-1. Astro 상단 구조

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  YOUTH_FUTURE_META,
  SUMMARY_METRICS,
  ELIGIBILITY_CHECKS,
  ACCOUNT_TYPE_COMPARISONS,
  MATURITY_SCENARIOS,
  BANK_RATE_INFOS,
  LEAP_COMPARISON_ROWS,
  DECISION_CARDS,
  YOUTH_FUTURE_FAQS,
  RELATED_LINKS,
} from "../../data/youthFutureSavings2026";
import { withBase } from "../../utils/base";

const pageUrl = `${(import.meta.env.SITE ?? "https://bigyocalc.com").replace(/\/$/, "")}/reports/${YOUTH_FUTURE_META.slug}/`;
---
```

### 4-2. Layout 설정

```astro
<BaseLayout
  title={YOUTH_FUTURE_META.metaTitle}
  description={YOUTH_FUTURE_META.description}
  canonical={pageUrl}
  ogTitle={YOUTH_FUTURE_META.ogTitle}
  ogDescription={YOUTH_FUTURE_META.ogDescription}
>
```

### 4-3. JSON-LD

```astro
<Fragment slot="seo">
  <script type="application/ld+json" set:html={JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: YOUTH_FUTURE_META.title,
    description: YOUTH_FUTURE_META.description,
    dateModified: "2026-05-31",
    mainEntityOfPage: pageUrl,
    publisher: {
      "@type": "Organization",
      name: "비교계산소",
    },
  })} />
  <script type="application/ld+json" set:html={JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: YOUTH_FUTURE_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  })} />
</Fragment>
```

---

## 5. 섹션 설계

### 5-1. Hero

컴포넌트: `CalculatorHero`

```astro
<CalculatorHero
  eyebrow="정책금융 리포트"
  title="청년미래적금 조건·만기 수령액 정리 2026"
  description="가입 대상, 정부기여금, 우대금리, 비과세, 청년도약계좌 갈아타기 조건을 한 번에 정리합니다. 월 납입액별 예상 만기 수령액도 함께 비교하세요."
/>
```

Hero 바로 아래에 기준 고지 바를 배치한다.

```astro
<p class="yfs-source-note">
  기준: 2026년 5월 금융위원회 공개자료 및 은행연합회 공시 안내. 실제 가입 가능 여부와 우대금리는 신청 시점의 상품설명서가 우선합니다.
</p>
```

### 5-2. 핵심 요약 카드

클래스:

- `.yfs-summary-grid`
- `.yfs-summary-card`
- `.yfs-badge`

표현:

- 4개 카드: 출시일, 월 납입 한도, 정부기여금, 최고금리
- 카드마다 배지 `공식`, `공시` 표시
- 모바일 1열, 태블릿 2열, 데스크톱 4열

### 5-3. 가입 대상 체크리스트

구성:

- 좌측: 체크리스트 카드
- 우측: “내 조건 확인” CTA 패널

CTA:

```astro
<a href={withBase("/tools/welfare-benefit-eligibility/")} class="yfs-primary-cta">
  가구소득 기준 확인하기
</a>
```

주의:

- 실제 가입 판정 계산기로 오해하지 않도록 “지원 가능성 점검” 표현 사용
- `확인 필요` 배지 적극 사용

### 5-4. 일반형 vs 우대형 비교

구성:

- 두 개의 비교 카드
- 카드 상단에 기여금 비율 강조: `6%`, `12%`
- 체크 항목은 pill 형태로 표시
- 우대형 카드에는 `세부조건 확인 필요` 보조 배지 표시

### 5-5. 월 납입액별 만기 수령액

구성:

- 상단 설명: “아래 금액은 단순 추정입니다.”
- 데스크톱: 표
- 모바일: 카드 리스트
- 금액은 `Intl.NumberFormat("ko-KR")` 또는 헬퍼 함수로 `만원` 단위 표시

컬럼:

- 월 납입액
- 3년 원금
- 일반형 예상 수령액
- 우대형 예상 수령액
- 차이

주의 문구:

```text
이 표는 월 납입액을 매월 동일하게 납입하고, 최고금리 7~8% 범위를 단순 적용한 추정 시나리오입니다. 실제 수령액은 은행별 금리, 우대조건, 납입일, 정부기여금 지급 방식에 따라 달라질 수 있습니다.
```

### 5-6. 은행별 금리 구조

구성:

- 기본금리/우대금리/최고금리 설명
- 은행 그룹 카드
- 우대조건 태그 표시

초기 구현은 그룹형으로 충분하다. 은행별 실제 값이 확정되면 아래 구조로 확장한다.

```ts
{
  id: "kb",
  name: "KB국민은행",
  baseRate: 5,
  maxBonusRate: 3,
  maxRate: 8,
  tags: ["급여이체", "카드", "자동이체"],
  note: "세부 우대조건 확인 필요",
  badge: "공시",
}
```

### 5-7. 청년도약계좌 비교

구성:

- 비교표
- 아래에 `전환 판단 카드` 3개

카피 톤:

- “갈아타기가 유리합니다” 금지
- “전환 검토”, “유지와 비교”, “납입액 현실화”처럼 판단 보조 표현 사용

### 5-8. 신청 전 체크리스트

구성:

- 8개 체크 항목
- 체크박스 UI처럼 보이지만 저장 기능은 필요 없음
- `나이`, `소득`, `가구소득`, `재직`, `매출`, `금융소득`, `우대금리`, `현금흐름`

### 5-9. FAQ

구성:

- `<details>` / `<summary>` 사용
- 구조화 데이터 FAQ와 동일한 문장 유지

### 5-10. 관련 콘텐츠 CTA

구성:

- 4개 링크 카드
- 리포트 1개, 도구 3개
- 향후 전용 계산기 구현 후 최상단 CTA를 `/tools/youth-future-savings-calculator/`로 교체

---

## 6. UI/스타일 설계

### 6-1. 톤

- 정책금융 콘텐츠이므로 과도한 마케팅 톤을 피한다.
- 색상은 신뢰감 있는 녹색·청록·남색을 보조로 쓰되, 한 가지 색만 반복하지 않는다.
- 숫자 카드와 비교표 중심으로 정보 밀도를 높인다.

### 6-2. SCSS 구조

```scss
.yfs-page {
  --yfs-ink: #172033;
  --yfs-muted: #667085;
  --yfs-line: #d8e0ea;
  --yfs-green: #0f8a5f;
  --yfs-teal: #087f8c;
  --yfs-blue: #2f5acf;
  --yfs-warn: #9a5b00;
  --yfs-soft: #f5f8fb;
}

.yfs-section {}
.yfs-source-note {}
.yfs-summary-grid {}
.yfs-summary-card {}
.yfs-badge {}
.yfs-check-grid {}
.yfs-type-grid {}
.yfs-scenario-table-wrap {}
.yfs-bank-grid {}
.yfs-comparison-table-wrap {}
.yfs-decision-grid {}
.yfs-related-grid {}
```

### 6-3. 배지 색상

| 배지 | 배경 | 글자 |
| --- | --- | --- |
| 공식 | `#e8f7ef` | `#0f6b47` |
| 공시 | `#eaf1ff` | `#2f5acf` |
| 추정 | `#fff4df` | `#9a5b00` |
| 확인 필요 | `#f2f4f7` | `#475467` |

### 6-4. 모바일 대응

- 표는 `.responsive-table` 계열 패턴 또는 `overflow-x: auto` 사용
- 만기 수령액 표는 모바일에서 카드형으로 전환하는 것을 권장
- 긴 금액 텍스트는 `white-space: nowrap`로 줄바꿈 제어
- CTA 버튼은 모바일에서 100% 너비

---

## 7. 클라이언트 스크립트

초기 구현은 필수는 아니지만, 간단한 납입액 버튼 선택 인터랙션을 추가할 수 있다.

### 7-1. 기능

- 월 납입액 버튼: 10만 / 30만 / 50만 원
- 선택한 시나리오 카드 강조
- 전체 표는 그대로 노출

### 7-2. 파일

```text
public/scripts/youth-future-savings-2026.js
```

### 7-3. 스크립트 예시

```js
const buttons = document.querySelectorAll("[data-yfs-scenario-button]");
const rows = document.querySelectorAll("[data-yfs-scenario-row]");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.getAttribute("data-yfs-scenario-button");

    buttons.forEach((item) => {
      item.setAttribute("aria-pressed", String(item === button));
    });

    rows.forEach((row) => {
      row.classList.toggle("is-active", row.getAttribute("data-yfs-scenario-row") === target);
    });
  });
});
```

Astro 하단:

```astro
<script type="module" src={withBase("/scripts/youth-future-savings-2026.js")}></script>
```

---

## 8. 접근성

- 수치 표는 `<table>`, `<thead>`, `<tbody>`, `<th scope="col">` 사용
- CTA 버튼은 실제 링크면 `<a>`, 계산 실행이면 `<button>` 사용
- 시나리오 선택 버튼에는 `aria-pressed` 적용
- 배지만으로 의미를 전달하지 않고 보조 텍스트를 함께 제공
- 색상 대비는 WCAG AA 수준 유지

---

## 9. SEO/콘텐츠 고지

### 9-1. 본문 필수 고지

```text
이 콘텐츠는 금융상품 가입 권유가 아니라 정책금융 정보 정리와 계산 보조 콘텐츠입니다. 실제 가입 가능 여부와 적용 금리는 신청 시점의 상품설명서, 은행 심사, 공식 공고가 우선합니다.
```

### 9-2. 계산 결과 고지

```text
만기 수령액은 월 납입액, 적용금리, 우대금리 충족 여부, 정부기여금 지급 방식, 비과세 적용 여부에 따라 달라지는 추정값입니다.
```

### 9-3. 링크 정책

- 공식 출처 링크는 `rel="noopener"` 적용
- 외부 은행 링크를 넣을 경우 제휴 여부에 따라 `sponsored` 검토
- 내부 링크는 `withBase()` 사용

---

## 10. 구현 순서

1. `src/data/youthFutureSavings2026.ts` 생성
2. `src/pages/reports/youth-future-savings-2026.astro` 생성
3. `src/styles/scss/pages/_youth-future-savings-2026.scss` 생성
4. 필요 시 `public/scripts/youth-future-savings-2026.js` 생성
5. `src/styles/app.scss`에 `@use` 추가
6. `src/data/reports.ts`에 리포트 등록
7. 홈/리포트 인덱스 노출 여부 반영
8. `public/sitemap.xml`에 URL 추가
9. `npm run build`로 검증

---

## 11. QA 체크리스트

- [ ] 사용자 facing 텍스트가 모두 한국어인가?
- [ ] 금융상품 가입 권유처럼 보이는 문장이 없는가?
- [ ] 공식값·공시값·추정값·확인 필요 값이 배지로 구분되는가?
- [ ] 만기 수령액 표에 `추정` 고지가 있는가?
- [ ] 청년도약계좌 갈아타기를 무조건 유리하다고 단정하지 않았는가?
- [ ] 은행별 우대금리는 실제 공시 기준과 충돌하지 않는가?
- [ ] 모바일에서 표와 금액 텍스트가 부모 영역을 넘지 않는가?
- [ ] 내부 링크가 `withBase()`로 처리되었는가?
- [ ] `reports.ts`, `app.scss`, `sitemap.xml` 등록이 완료되었는가?
- [ ] `npm run build`가 성공하는가?

---

## 12. 참고 출처

- 금융위원회, 청년미래적금 취급기관 금리 공시 및 신청기간 안내: https://www.fsc.go.kr/po010103/87005
- 금융위원회, 청년미래적금 세부 조건 카드뉴스: https://www.fsc.go.kr/no040101?cnId=3187
- 금융위원회, 청년미래적금 취급기관·금리 수준 안내 보도자료: https://www.fsc.go.kr/no010101/86884
- 금융위원회, 2026년 청년층 자산형성 지원 청년미래적금안: https://www.fsc.go.kr/no040101?cnId=2983

