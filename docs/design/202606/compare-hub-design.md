# 비교표 허브(`/compare/`) 설계 문서

> 기획 원문: `docs/plan/202606/compare-menu.md`  
> 작성일: 2026-06-01  
> 구현 대상: `/compare/` 비교표 허브 1차 MVP  
> 구현 기준: 이 문서만 보고 데이터 파일, 페이지, 스타일, 상단 메뉴, 사이트맵 등록까지 진행할 수 있는 수준

---

## 1. 문서 개요

- 구현 대상: 비교표 허브
- slug: `compare`
- URL: `/compare/`
- 콘텐츠 유형: navigation hub / comparison hub
- 상단 대메뉴명: `비교표`
- 1차 목표: 기존 계산기·리포트를 “비교 의사결정” 기준으로 재분류한다.
- 1차 제외: `/compare/bonus/`, `/compare/welfare/` 등 하위 페이지 구현은 제외한다.

### 핵심 방향

`/compare/`는 단순 링크 모음이 아니라, 사용자가 “어떤 비교부터 보면 되는지” 빠르게 고르게 하는 허브다.

역할은 다음처럼 나눈다.

| 기존 메뉴 | 역할 |
| --- | --- |
| 계산기 | 내 값을 입력해서 결과 확인 |
| 리포트 | 시장·제도·트렌드 해석 |
| 비교표 | 여러 선택지를 같은 기준으로 빠르게 비교 |

---

## 2. 구현 파일 구조

```text
src/
  data/
    compareHub.ts
  pages/
    compare/
      index.astro

src/styles/scss/pages/
  _compare-hub.scss
```

수정 파일:

```text
src/components/SiteHeader.astro
src/styles/app.scss
public/sitemap.xml
```

선택 수정:

```text
src/pages/index.astro
src/pages/tools/index.astro
src/pages/reports/index.astro
```

1차 MVP에서는 선택 수정은 필수로 보지 않는다. `/compare/` 출시 후 내부 회전이 약하면 8단계 CTA 통합에서 반영한다.

---

## 3. 데이터 설계

파일: `src/data/compareHub.ts`

### 3-1. 타입 정의

```ts
export type CompareItemType = "calculator" | "report" | "compare" | "planned";
export type CompareCategoryId = "bonus" | "welfare" | "realEstate" | "investment" | "salary";
export type CompareBadgeTone = "default" | "new" | "popular" | "estimate" | "official";

export interface CompareBadge {
  label: string;
  tone: CompareBadgeTone;
}

export interface CompareStat {
  label: string;
  value: string;
  context?: string;
}

export interface CompareItem {
  id: string;
  title: string;
  description: string;
  href: string;
  type: CompareItemType;
  categoryId: CompareCategoryId;
  criteria: string[];
  badges: CompareBadge[];
  stats: CompareStat[];
  ctaLabel: string;
  priority: number;
}

export interface CompareCategory {
  id: CompareCategoryId;
  title: string;
  description: string;
  criteria: string[];
  featuredItemIds: string[];
}

export interface ComparePrinciple {
  categoryId: CompareCategoryId;
  title: string;
  criteria: string[];
  caution: string;
}

export interface PlannedCompareItem {
  title: string;
  description: string;
  reason: string;
  categoryId: CompareCategoryId;
}
```

### 3-2. 카테고리 데이터

```ts
export const COMPARE_CATEGORIES: CompareCategory[] = [
  {
    id: "bonus",
    title: "성과급 비교",
    description: "회사·업종별 성과급을 연봉, 지급률, 세후 실수령액 기준으로 비교합니다.",
    criteria: ["연봉", "성과급률", "세후 추정", "지급 구조"],
    featuredItemIds: ["semiconductor-bonus", "auto-bonus", "shipbuilding-bonus", "finance-bonus"],
  },
  {
    id: "welfare",
    title: "지원금 비교",
    description: "청년, 출산, 복지, 주거 지원 제도를 가입 대상과 지원금 기준으로 비교합니다.",
    criteria: ["가입 대상", "소득 기준", "지원금", "신청기간"],
    featuredItemIds: ["youth-savings-maturity", "youth-savings-comparison", "welfare-benefit", "birth-support-total"],
  },
  {
    id: "realEstate",
    title: "부동산·대출 비교",
    description: "전월세, 매매, 대출, 청약, 세금을 초기자금과 월 부담 기준으로 비교합니다.",
    criteria: ["초기자금", "월 부담", "대출금리", "세금"],
    featuredItemIds: ["jeonse-vs-wolse", "loan-refinancing", "home-purchase-fund", "apt-cheonyak"],
  },
  {
    id: "investment",
    title: "투자·ETF 비교",
    description: "적금, ETF, 배당, 수수료를 수익률과 세금, 투자기간 기준으로 비교합니다.",
    criteria: ["수익률", "세금", "수수료", "투자기간"],
    featuredItemIds: ["savings-vs-etf", "stock-fee", "monthly-dividend-etf", "dca-investment"],
  },
  {
    id: "salary",
    title: "연봉·초봉 비교",
    description: "기업, 업종, 직군별 연봉과 초봉을 총보상 관점에서 비교합니다.",
    criteria: ["초봉", "평균연봉", "성과급", "복지"],
    featuredItemIds: ["new-employee-salary", "it-salary-top10", "it-si-sm", "insurance-salary"],
  },
];
```

### 3-3. 인기 비교표 TOP 6

1차 MVP는 정적 우선순위로 운영한다.

```ts
export const FEATURED_COMPARE_ITEM_IDS = [
  "semiconductor-bonus",
  "youth-savings-comparison",
  "youth-savings-maturity",
  "jeonse-vs-wolse",
  "savings-vs-etf",
  "new-employee-salary",
];
```

### 3-4. 비교 아이템 데이터

```ts
export const COMPARE_ITEMS: CompareItem[] = [
  {
    id: "semiconductor-bonus",
    title: "반도체 성과급 비교 계산기",
    description: "삼성전자, SK하이닉스, DB하이텍 등 반도체 기업 성과급을 같은 연봉 기준으로 비교합니다.",
    href: "/tools/semiconductor-bonus-comparison/",
    type: "calculator",
    categoryId: "bonus",
    criteria: ["연봉", "성과급률", "세후 추정"],
    badges: [{ label: "인기", tone: "popular" }, { label: "계산기", tone: "default" }],
    stats: [{ label: "비교 회사", value: "8개" }, { label: "핵심 결과", value: "세후 추정" }],
    ctaLabel: "비교하기",
    priority: 1,
  },
  {
    id: "auto-bonus",
    title: "자동차 성과급 비교 계산기",
    description: "현대차, 기아, 현대모비스 성과급을 같은 기준으로 비교합니다.",
    href: "/tools/auto-bonus-comparison/",
    type: "calculator",
    categoryId: "bonus",
    criteria: ["연봉", "성과급률", "업종 비교"],
    badges: [{ label: "성과급", tone: "default" }],
    stats: [{ label: "업종", value: "자동차" }, { label: "비교", value: "세전·세후" }],
    ctaLabel: "계산하기",
    priority: 2,
  },
  {
    id: "shipbuilding-bonus",
    title: "조선업 성과급 비교 계산기",
    description: "HD현대중공업, 한화오션, 삼성중공업 성과급을 비교합니다.",
    href: "/tools/shipbuilding-bonus-comparison/",
    type: "calculator",
    categoryId: "bonus",
    criteria: ["업종", "성과급", "총보상"],
    badges: [{ label: "신규", tone: "new" }],
    stats: [{ label: "업종", value: "조선" }, { label: "핵심", value: "총보상" }],
    ctaLabel: "비교하기",
    priority: 3,
  },
  {
    id: "finance-bonus",
    title: "금융권 성과급 비교 계산기",
    description: "은행, 증권, 보험 성과급을 같은 연봉 기준으로 비교합니다.",
    href: "/tools/finance-bonus-comparison/",
    type: "calculator",
    categoryId: "bonus",
    criteria: ["은행", "증권", "보험"],
    badges: [{ label: "성과급", tone: "default" }],
    stats: [{ label: "업종", value: "금융" }, { label: "비교", value: "3개 축" }],
    ctaLabel: "계산하기",
    priority: 4,
  },
  {
    id: "youth-savings-comparison",
    title: "청년미래적금 vs 청년도약계좌 비교",
    description: "청년미래적금, 청년도약계좌, 청년희망적금의 조건과 수령액을 비교합니다.",
    href: "/reports/youth-savings-comparison-2026/",
    type: "report",
    categoryId: "welfare",
    criteria: ["가입조건", "정부기여금", "만기"],
    badges: [{ label: "청년지원", tone: "official" }, { label: "리포트", tone: "default" }],
    stats: [{ label: "비교", value: "정책적금" }, { label: "기준", value: "2026" }],
    ctaLabel: "리포트 보기",
    priority: 1,
  },
  {
    id: "youth-savings-maturity",
    title: "청년 적금 만기 수령액 계산기",
    description: "청년미래적금, 청년도약계좌, 일반 적금의 만기 수령액을 비교합니다.",
    href: "/tools/youth-savings-maturity-calculator/",
    type: "calculator",
    categoryId: "welfare",
    criteria: ["월 납입액", "정부기여금", "비과세"],
    badges: [{ label: "신규", tone: "new" }, { label: "계산기", tone: "default" }],
    stats: [{ label: "비교 상품", value: "3종" }, { label: "결과", value: "만기 수령액" }],
    ctaLabel: "계산하기",
    priority: 2,
  },
];
```

구현 시 위 예시는 시작 데이터다. 실제 파일에는 아래 항목까지 추가한다.

| id | href | category |
| --- | --- | --- |
| `welfare-benefit` | `/tools/welfare-benefit-eligibility/` | welfare |
| `birth-support-total` | `/tools/birth-support-total/` | welfare |
| `jeonse-vs-wolse` | `/tools/jeonse-vs-wolse-calculator/` | realEstate |
| `loan-refinancing` | `/tools/loan-refinancing-calculator/` | realEstate |
| `home-purchase-fund` | `/tools/home-purchase-fund/` | realEstate |
| `apt-cheonyak` | `/tools/apt-cheonyak-gajum-calculator/` | realEstate |
| `savings-vs-etf` | `/tools/savings-vs-etf-retirement/` | investment |
| `stock-fee` | `/reports/stock-brokerage-fee-comparison-2026/` | investment |
| `monthly-dividend-etf` | `/reports/monthly-dividend-etf-2026/` | investment |
| `dca-investment` | `/tools/dca-investment-calculator/` | investment |
| `new-employee-salary` | `/reports/new-employee-salary-2026/` | salary |
| `it-salary-top10` | `/reports/it-salary-top10/` | salary |
| `it-si-sm` | `/reports/it-si-sm-salary-comparison-2026/` | salary |
| `insurance-salary` | `/reports/insurance-salary-bonus-comparison-2026/` | salary |

### 3-5. 비교 기준 데이터

```ts
export const COMPARE_PRINCIPLES: ComparePrinciple[] = [
  {
    categoryId: "bonus",
    title: "성과급 비교 기준",
    criteria: ["연봉", "월급", "성과급률", "세후 추정", "지급 안정성"],
    caution: "성과급은 회사 공지, 사업부, 개인 평가, 지급월에 따라 달라질 수 있습니다.",
  },
  {
    categoryId: "welfare",
    title: "지원금 비교 기준",
    criteria: ["가입 대상", "소득 기준", "지원금", "신청기간", "중복 가능성"],
    caution: "지원금은 신청 시점의 공식 공고와 개인별 심사 결과가 우선합니다.",
  },
  {
    categoryId: "realEstate",
    title: "부동산·대출 비교 기준",
    criteria: ["초기자금", "월 부담", "세금", "대출금리", "거주기간"],
    caution: "금리, 세금, 매매·전월세 가격은 시점과 계약 조건에 따라 달라질 수 있습니다.",
  },
  {
    categoryId: "investment",
    title: "투자·ETF 비교 기준",
    criteria: ["수익률", "세금", "수수료", "변동성", "투자기간"],
    caution: "투자 결과는 보장되지 않으며, 계산 결과는 입력값 기반 추정입니다.",
  },
  {
    categoryId: "salary",
    title: "연봉·초봉 비교 기준",
    criteria: ["초봉", "평균연봉", "성과급", "복지", "성장성"],
    caution: "연봉은 계약 형태, 직군, 지역, 성과급 포함 여부에 따라 달라질 수 있습니다.",
  },
];
```

### 3-6. 준비 중 비교표

```ts
export const PLANNED_COMPARE_ITEMS: PlannedCompareItem[] = [
  {
    title: "대기업 복지포인트 비교",
    description: "성과급 이후 복리후생까지 비교하는 확장 콘텐츠",
    reason: "성과급 유입 이후 복지 검색 확장",
    categoryId: "bonus",
  },
  {
    title: "청년 주거지원 대출 비교",
    description: "청년 전월세 대출과 주거지원 정책 비교",
    reason: "지원금과 부동산 교차 수요",
    categoryId: "welfare",
  },
  {
    title: "월배당 ETF 비교표",
    description: "국내·해외 월배당 ETF 수익률과 분배금 비교",
    reason: "투자 카테고리 확장",
    categoryId: "investment",
  },
];
```

---

## 4. 페이지 IA

1. Hero
2. 인기 비교표 TOP 6
3. 카테고리 탭 또는 앵커
4. 카테고리별 비교표 카드
5. 비교 기준 안내
6. 준비 중 비교표
7. FAQ

---

## 5. Astro 페이지 설계

파일: `src/pages/compare/index.astro`

### 5-1. import

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  COMPARE_CATEGORIES,
  COMPARE_ITEMS,
  FEATURED_COMPARE_ITEM_IDS,
  COMPARE_PRINCIPLES,
  PLANNED_COMPARE_ITEMS,
} from "../../data/compareHub";
import { withBase } from "../../utils/base";

const featuredItems = FEATURED_COMPARE_ITEM_IDS
  .map((id) => COMPARE_ITEMS.find((item) => item.id === id))
  .filter(Boolean);

const itemsByCategory = COMPARE_CATEGORIES.map((category) => ({
  ...category,
  items: COMPARE_ITEMS
    .filter((item) => item.categoryId === category.id)
    .sort((a, b) => a.priority - b.priority),
}));
---
```

### 5-2. BaseLayout

```astro
<BaseLayout
  title="비교표｜연봉·성과급·지원금·부동산·투자 한눈에 비교"
  description="비교계산소의 비교표 모음입니다. 연봉, 성과급, 청년지원금, 출산지원금, 부동산, 대출, ETF, 적금까지 같은 기준으로 비교하고 관련 계산기로 바로 확인하세요."
>
```

### 5-3. Hero

```astro
<CalculatorHero
  eyebrow="비교표 허브"
  title="비교표"
  description="연봉, 성과급, 지원금, 부동산, 투자 상품을 같은 기준으로 비교합니다. 계산기와 리포트를 오가기 전에 먼저 큰 차이를 확인하세요."
/>
```

### 5-4. 고지

```astro
<InfoNotice
  title="비교표 이용 기준"
  lines={[
    "비교표는 공개자료와 계산 모델을 기준으로 정리한 참고용 콘텐츠입니다.",
    "실제 조건은 회사 공지, 정부 공고, 금융회사 상품설명서, 계약 조건에 따라 달라질 수 있습니다.",
    "금액과 수익률은 공식값, 공시값, 추정값을 구분해 확인해야 합니다.",
  ]}
/>
```

---

## 6. 섹션 상세 설계

### 6-1. 인기 비교표 TOP 6

클래스:

- `.compare-section`
- `.compare-section__head`
- `.compare-featured-grid`
- `.compare-card`
- `.compare-card--featured`

렌더링:

```astro
<section class="compare-section" id="popular">
  <div class="compare-section__head">
    <p>인기 비교표</p>
    <h2>많이 찾는 비교부터 빠르게 보기</h2>
  </div>
  <div class="compare-featured-grid">
    {featuredItems.map((item) => <CompareCard item={item} featured />)}
  </div>
</section>
```

컴포넌트를 따로 만들지 않고 페이지 안에서 `article` 반복으로 구현해도 된다. 1차 MVP에서는 파일 수를 줄이기 위해 페이지 내부 반복을 권장한다.

### 6-2. 카테고리 앵커

```astro
<nav class="compare-category-nav" aria-label="비교표 카테고리">
  {COMPARE_CATEGORIES.map((category) => (
    <a href={`#${category.id}`}>{category.title}</a>
  ))}
</nav>
```

모바일에서는 가로 스크롤 pill nav로 처리한다.

### 6-3. 카테고리별 카드

```astro
{itemsByCategory.map((category) => (
  <section class="compare-section" id={category.id}>
    <div class="compare-section__head">
      <p>{category.criteria.join(" · ")}</p>
      <h2>{category.title}</h2>
      <span>{category.description}</span>
    </div>
    <div class="compare-card-grid">
      {category.items.map((item) => (
        <article class="compare-card">
          ...
        </article>
      ))}
    </div>
  </section>
))}
```

### 6-4. 카드 구조

```astro
<article class="compare-card">
  <div class="compare-card__top">
    <span class={`compare-type compare-type--${item.type}`}>{typeLabel[item.type]}</span>
    <div class="compare-card__badges">
      {item.badges.map((badge) => <span class={`compare-badge compare-badge--${badge.tone}`}>{badge.label}</span>)}
    </div>
  </div>
  <h3>{item.title}</h3>
  <p>{item.description}</p>
  <div class="compare-card__criteria">
    {item.criteria.map((criterion) => <span>{criterion}</span>)}
  </div>
  <div class="compare-card__stats">
    {item.stats.map((stat) => (
      <span><strong>{stat.value}</strong>{stat.label}</span>
    ))}
  </div>
  <a href={withBase(item.href)}>{item.ctaLabel}</a>
</article>
```

### 6-5. 비교 기준 안내

```astro
<section class="compare-section compare-principles" id="criteria">
  <div class="compare-section__head">
    <p>비교 기준</p>
    <h2>비교표는 같은 기준으로 봐야 의미가 있습니다</h2>
  </div>
  <div class="compare-principle-grid">
    {COMPARE_PRINCIPLES.map((principle) => (
      <article>
        <h3>{principle.title}</h3>
        <ul>{principle.criteria.map((item) => <li>{item}</li>)}</ul>
        <p>{principle.caution}</p>
      </article>
    ))}
  </div>
</section>
```

### 6-6. 준비 중 비교표

준비 중 항목은 링크 없는 카드로 처리한다.

```astro
<section class="compare-section" id="planned">
  <div class="compare-section__head">
    <p>준비 중</p>
    <h2>다음에 확장할 비교표</h2>
  </div>
  <div class="compare-planned-grid">
    {PLANNED_COMPARE_ITEMS.map((item) => (
      <article class="compare-planned-card" aria-disabled="true">
        <span>준비 중</span>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <small>{item.reason}</small>
      </article>
    ))}
  </div>
</section>
```

---

## 7. 상단 메뉴 수정

파일: `src/components/SiteHeader.astro`

### 7-1. 데스크톱 메뉴

`리포트` 드롭다운 뒤, `소개` 링크 앞에 추가한다.

```astro
<a class="site-nav__link" href={withBase("/compare/")}>비교표</a>
```

1차 MVP에서는 드롭다운 없이 단일 링크로 시작한다. `/compare/bonus/`, `/compare/welfare/`가 생긴 뒤 드롭다운 전환을 검토한다.

### 7-2. 모바일 메뉴

모바일 메뉴에는 별도 섹션으로 추가한다.

```astro
<div class="site-header__mobile-section">
  <p class="site-header__mobile-label">비교표</p>
  <div class="site-header__mobile-links">
    <a href={withBase("/compare/")}>
      <span>비교표 전체 보기</span>
      <span class="site-header__mobile-badge">신규</span>
    </a>
  </div>
</div>
```

하위 페이지가 없으므로 모바일에서도 `/compare/` 1개 링크만 노출한다.

---

## 8. 스타일 설계

파일: `src/styles/scss/pages/_compare-hub.scss`

### 8-1. prefix

- page class: `.compare-page`
- 섹션 prefix: `.compare-`

### 8-2. 색상 방향

운영형 허브이므로 과한 랜딩 느낌보다 정보 탐색형 UI로 간다.

```scss
.compare-page {
  --compare-ink: #172033;
  --compare-muted: #667085;
  --compare-line: #d8e0ea;
  --compare-soft: #f5f8fb;
  --compare-green: #0f8a5f;
  --compare-blue: #2f5acf;
  --compare-warn: #9a5b00;
}
```

### 8-3. 레이아웃

```scss
.compare-section {
  display: grid;
  gap: 18px;
  margin-top: 28px;
}

.compare-featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}

.compare-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}
```

### 8-4. 카드

```scss
.compare-card {
  display: grid;
  gap: 12px;
  min-width: 0;
  padding: 16px;
  border: 1px solid var(--compare-line);
  border-radius: 8px;
  background: #fff;
  color: inherit;
}
```

카드는 중첩 카드 구조를 피한다. 섹션 자체는 카드로 감싸지 않고, 개별 비교 항목만 카드로 표현한다.

### 8-5. 모바일

- 카테고리 nav는 `overflow-x: auto`
- 카드 grid는 1열
- 통계 영역은 2열 이하로 자동 줄바꿈
- 버튼 텍스트가 줄바꿈되어도 높이가 자연스럽게 늘어나도록 처리

---

## 9. SEO 설계

### 9-1. Meta

| 항목 | 내용 |
| --- | --- |
| Title | 비교표｜연봉·성과급·지원금·부동산·투자 한눈에 비교 |
| Description | 비교계산소의 비교표 모음입니다. 연봉, 성과급, 청년지원금, 출산지원금, 부동산, 대출, ETF, 적금까지 같은 기준으로 비교하고 관련 계산기로 바로 확인하세요. |
| Canonical | `/compare/` |

### 9-2. FAQ

`SeoContent` FAQ에 포함한다.

```ts
const compareFaq = [
  {
    question: "비교표와 계산기는 무엇이 다른가요?",
    answer: "비교표는 여러 선택지를 같은 기준으로 먼저 비교하는 페이지이고, 계산기는 사용자의 입력값을 기준으로 구체적인 결과를 추정하는 도구입니다.",
  },
  {
    question: "비교표의 금액은 확정값인가요?",
    answer: "아닙니다. 공식자료, 공시자료, 계산 모델을 바탕으로 정리한 참고값이며 실제 조건은 회사 공지, 정부 공고, 금융회사 상품설명서가 우선합니다.",
  },
  {
    question: "성과급과 지원금 비교표는 언제 분리되나요?",
    answer: "1차로 비교표 허브를 만든 뒤, 성과급과 지원금 섹션의 사용량을 보고 /compare/bonus/, /compare/welfare/ 하위 페이지로 확장합니다.",
  },
];
```

---

## 10. 사이트맵

`public/sitemap.xml`에 추가한다.

```xml
<url>
  <loc>https://bigyocalc.com/compare/</loc>
  <lastmod>2026-06-01</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.90</priority>
</url>
```

---

## 11. 구현 순서

1. `src/data/compareHub.ts` 생성
2. `src/pages/compare/index.astro` 생성
3. `src/styles/scss/pages/_compare-hub.scss` 생성
4. `src/styles/app.scss`에 `@use 'scss/pages/compare-hub';` 추가
5. `src/components/SiteHeader.astro`에 데스크톱 `비교표` 링크 추가
6. 모바일 메뉴에 `비교표` 섹션 추가
7. `public/sitemap.xml`에 `/compare/` 추가
8. `npm run build` 실행
9. 로컬 `/compare/` 화면 확인

---

## 12. QA 체크리스트

- [ ] `/compare/`가 정상 빌드되는가?
- [ ] 상단 데스크톱 메뉴에 `비교표`가 노출되는가?
- [ ] 모바일 메뉴에 `비교표` 링크가 노출되는가?
- [ ] 인기 비교표 TOP 6이 상단에 노출되는가?
- [ ] 5개 카테고리 섹션이 모두 노출되는가?
- [ ] 모든 카드 링크가 기존 실제 페이지로 연결되는가?
- [ ] 준비 중 카드는 링크처럼 보이지 않는가?
- [ ] 비교 기준 안내와 추정값 고지가 포함되어 있는가?
- [ ] 모바일 390px에서 가로 넘침이 없는가?
- [ ] `public/sitemap.xml`에 `/compare/`가 등록되어 있는가?
- [ ] `npm run build`가 성공하는가?

---

## 13. 다음 단계

이 설계 문서 기준으로 3단계 `/compare/` 구현을 진행한다.

구현 후에는 `/compare/`에서 가장 클릭이 많이 발생하는 섹션을 보고 다음 설계 문서를 작성한다.

우선순위:

1. `docs/design/202606/compare-bonus-design.md`
2. `docs/design/202606/compare-welfare-design.md`

