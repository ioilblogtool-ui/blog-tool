# 자녀 생애 증여 플랜 리포트 설계 문서

> 기획 원본: `docs/plan/202606/child-lifetime-gift-plan-report.md`
> 콘텐츠 유형: `/reports/` 정적 리포트
> 작성일: 2026-06-28
> 구현 기준: 2026년 6월 기준 증여재산공제, 혼인·출산 증여재산공제, 주택자금 자금출처 주의사항을 생애 타임라인으로 정리

---

## 1. 문서 개요

| 항목 | 내용 |
|---|---|
| 구현 대상 | 자녀 생애 증여 플랜: 0세부터 결혼·주택자금까지 얼마까지 세금 없을까? |
| slug | `child-lifetime-gift-plan` |
| URL | `/reports/child-lifetime-gift-plan/` |
| 페이지 유형 | 정적 리포트, 계산기 CTA 연결형 |
| 카테고리 | 세금/부동산/자녀 자산관리 |
| 레이아웃 | `BaseLayout.astro` + `report-page clg-page` |
| CSS prefix | `clg-` |
| JS | 없음. 1차는 정적 페이지 |
| 핵심 CTA | `/tools/gift-tax-calculator/`, `/tools/gift-tax-child-calculator/` |

---

## 2. 구현 파일 구조

```txt
src/
  data/
    childLifetimeGiftPlan.ts
  pages/
    reports/
      child-lifetime-gift-plan.astro
  styles/
    scss/
      pages/
        _child-lifetime-gift-plan.scss
    app.scss

public/
  og/
    reports/
      child-lifetime-gift-plan.svg
  sitemap.xml
```

추가 등록:

* `src/data/reports.ts` — 리포트 허브 등록
* `src/styles/app.scss` — `@use 'scss/pages/child-lifetime-gift-plan';`
* `public/sitemap.xml` — `/reports/child-lifetime-gift-plan/` URL 추가

---

## 3. 페이지 방향

### 3-1. 콘텐츠 성격

* 계산기처럼 입력값을 받는 페이지가 아니라, 자녀 증여를 생애 단계별로 이해시키는 리포트
* 상단에서는 핵심 한도만 빠르게 보여주고, 중반 이후에 조건과 오해를 설명
* 세금 콘텐츠이므로 단정형보다 조건부 표현 사용
* 모든 숫자에는 `공식`, `참고`, `주의` 성격을 구분

### 3-2. UX 핵심

사용자는 아래 순서로 이해해야 합니다.

1. 자녀 증여는 10년 단위 공제가 핵심이다.
2. 미성년과 성년의 공제 한도는 다르다.
3. 결혼·출산 시점에는 추가공제를 검토할 수 있다.
4. 주택자금은 별도 비과세 한도처럼 보면 위험하다.
5. 실제 증여 전에는 계산기와 공식 출처 확인이 필요하다.

---

## 4. 데이터 모델

### 4-1. 타입 설계

```ts
// src/data/childLifetimeGiftPlan.ts

export type GiftPlanBadge = "공식" | "참고" | "주의";

export type GiftPlanMeta = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  updatedAt: string;
  caution: string;
};

export type GiftSummaryCard = {
  label: string;
  value: string;
  note: string;
  badge: GiftPlanBadge;
};

export type GiftTimelineItem = {
  ageLabel: string;
  event: string;
  deductionLabel: string;
  amountLabel: string;
  badge: GiftPlanBadge;
  note: string;
};

export type GiftRuleCard = {
  title: string;
  body: string;
  example: string;
  badge: GiftPlanBadge;
};

export type MarriageBirthRule = {
  label: string;
  value: string;
  note: string;
};

export type HousingMyth = {
  myth: string;
  fact: string;
  risk: string;
};

export type GiftPlanScenario = {
  id: string;
  title: string;
  summary: string;
  steps: string[];
  strength: string;
  caution: string;
};

export type GiftChecklistItem = {
  text: string;
  reason: string;
};

export type GiftRelatedLink = {
  label: string;
  href: string;
  description: string;
};

export type GiftFaq = {
  question: string;
  answer: string;
};

export type GiftSource = {
  label: string;
  href: string;
  note: string;
};

export type ChildLifetimeGiftPlanReport = {
  meta: GiftPlanMeta;
  summaryCards: GiftSummaryCard[];
  timeline: GiftTimelineItem[];
  rules: GiftRuleCard[];
  marriageBirthRules: MarriageBirthRule[];
  housingMyths: HousingMyth[];
  scenarios: GiftPlanScenario[];
  checklist: GiftChecklistItem[];
  relatedLinks: GiftRelatedLink[];
  faq: GiftFaq[];
  sources: GiftSource[];
};
```

---

## 5. 데이터 초기값

```ts
export const childLifetimeGiftPlan: ChildLifetimeGiftPlanReport = {
  meta: {
    slug: "child-lifetime-gift-plan",
    title: "자녀 생애 증여 플랜",
    seoTitle: "자녀 생애 증여 플랜 | 0세부터 결혼·주택자금까지 증여세 한도 정리",
    description:
      "자녀에게 태어날 때부터 성년, 결혼, 출산, 주택자금 시점까지 얼마를 증여하면 증여세가 없을 수 있는지 10년 단위 공제와 혼인·출산 추가공제 기준으로 정리했습니다.",
    ogTitle: "자녀 생애 증여 플랜",
    ogDescription:
      "0세 2,000만 원, 성년 5,000만 원, 결혼·출산 추가공제까지 한눈에 보는 자녀 증여 로드맵.",
    updatedAt: "2026년 6월 기준",
    caution:
      "이 리포트는 일반적인 증여재산공제 기준을 설명하는 참고용 콘텐츠입니다. 실제 세액은 증여자, 수증자, 최근 10년 증여 이력, 재산 종류, 신고 여부에 따라 달라질 수 있습니다.",
  },
  summaryCards: [
    {
      label: "미성년 자녀",
      value: "10년 2,000만 원",
      note: "만 19세 미만 자녀 기준",
      badge: "공식",
    },
    {
      label: "성년 자녀",
      value: "10년 5,000만 원",
      note: "만 19세 이상 자녀 기준",
      badge: "공식",
    },
    {
      label: "혼인·출산",
      value: "추가 1억 원",
      note: "요건 충족 시, 합산 한도 확인",
      badge: "공식",
    },
    {
      label: "주택자금",
      value: "자금출처 관리",
      note: "별도 비과세 한도로 단정 금지",
      badge: "주의",
    },
  ],
  timeline: [
    {
      ageLabel: "0~9세",
      event: "자녀 명의 계좌·펀드 시작",
      deductionLabel: "미성년 공제",
      amountLabel: "2,000만 원",
      badge: "공식",
      note: "첫 10년 공제 구간으로 설명합니다.",
    },
    {
      ageLabel: "10~18세",
      event: "교육비 외 자산 형성",
      deductionLabel: "미성년 공제",
      amountLabel: "2,000만 원",
      badge: "공식",
      note: "이전 증여일로부터 10년 경과 여부를 확인해야 합니다.",
    },
    {
      ageLabel: "19~28세",
      event: "대학·취업·독립 준비",
      deductionLabel: "성년 공제",
      amountLabel: "5,000만 원",
      badge: "공식",
      note: "성년이 되면 공제 한도가 달라집니다.",
    },
    {
      ageLabel: "결혼 전후",
      event: "결혼자금 지원",
      deductionLabel: "성년 공제 + 혼인공제",
      amountLabel: "최대 1억 5,000만 원 검토",
      badge: "참고",
      note: "요건 충족과 최근 10년 증여 이력을 함께 확인합니다.",
    },
    {
      ageLabel: "출산 후",
      event: "출산 관련 지원",
      deductionLabel: "혼인·출산 합산 한도",
      amountLabel: "1억 원 한도 내",
      badge: "공식",
      note: "혼인공제 사용액이 있으면 남은 한도를 확인합니다.",
    },
    {
      ageLabel: "주택 구입",
      event: "전세·매매 자금 지원",
      deductionLabel: "남은 공제·차용·증빙",
      amountLabel: "상황별 확인",
      badge: "주의",
      note: "주택자금은 자금출처 소명 가능성이 중요합니다.",
    },
  ],
  rules: [
    {
      title: "공제 한도는 매년이 아니라 10년 단위입니다",
      body: "증여재산공제는 같은 증여자 그룹으로부터 받은 10년 이내 증여액을 합산해서 판단합니다.",
      example: "0세에 2,000만 원을 받고 5세에 다시 2,000만 원을 받으면 최근 10년 합산액을 봐야 합니다.",
      badge: "공식",
    },
    {
      title: "성년이 되면 공제 한도가 달라집니다",
      body: "미성년 자녀는 10년간 2,000만 원, 성년 자녀는 10년간 5,000만 원 공제를 검토할 수 있습니다.",
      example: "20세 이후 증여는 성년 자녀 공제 구간으로 봅니다.",
      badge: "공식",
    },
    {
      title: "증여세 0원도 기록은 남기는 편이 좋습니다",
      body: "공제 한도 이내라 세액이 없더라도, 나중에 주택 취득 자금출처 확인에서 증여 사실을 설명해야 할 수 있습니다.",
      example: "계좌이체 내역, 신고 내역, 가족 간 차용증과 상환 내역을 분리해 관리합니다.",
      badge: "주의",
    },
  ],
  marriageBirthRules: [
    { label: "적용 대상", value: "직계존속 → 직계비속", note: "부모·조부모가 자녀 등에게 증여하는 경우" },
    { label: "추가공제 한도", value: "1억 원", note: "혼인·출산 공제 합산 한도" },
    { label: "기본공제와 관계", value: "별도 검토", note: "성년 자녀 기본공제 5,000만 원과 함께 설명" },
    { label: "주의사항", value: "요건 확인", note: "혼인신고일·출산일 기준 기간 요건 재확인 필요" },
  ],
  housingMyths: [
    {
      myth: "자녀 주택자금 1억은 무조건 비과세다",
      fact: "주택자금 자체가 별도 비과세 한도라고 단정하면 위험합니다.",
      risk: "증여공제, 혼인·출산 공제, 차용 여부, 자금출처 증빙을 함께 봐야 합니다.",
    },
    {
      myth: "차용증만 쓰면 증여가 아니다",
      fact: "실제 이자 지급과 원금 상환 내역이 중요합니다.",
      risk: "상환 능력이나 이자 지급 내역이 없으면 증여로 볼 여지가 있습니다.",
    },
    {
      myth: "부모가 대신 계약금을 내도 괜찮다",
      fact: "자녀 명의 취득자금이면 자금출처 확인 대상이 될 수 있습니다.",
      risk: "계약금·중도금·잔금 흐름을 설명할 자료가 필요합니다.",
    },
  ],
  scenarios: [
    {
      id: "simple",
      title: "보수형",
      summary: "성년 이후 5,000만 원 공제를 중심으로 단순하게 관리하는 플랜",
      steps: ["미성년 시기에는 증여하지 않음", "성년 이후 5,000만 원 증여", "결혼·주택자금은 별도 계산"],
      strength: "관리하기 쉽고 신고 이력이 단순합니다.",
      caution: "어릴 때부터 자산을 불리는 효과는 작습니다.",
    },
    {
      id: "standard",
      title: "표준형",
      summary: "미성년 2,000만 원과 성년 5,000만 원을 나눠 쓰는 플랜",
      steps: ["출생 직후 또는 유년기에 2,000만 원", "10년 경과 후 추가 구간 확인", "성년 이후 5,000만 원 검토"],
      strength: "생애 초반 자산 형성과 세금 관리의 균형이 좋습니다.",
      caution: "증여일과 계좌 기록을 꾸준히 남겨야 합니다.",
    },
    {
      id: "marriage",
      title: "결혼지원형",
      summary: "성년 공제와 혼인·출산 추가공제를 결혼 시점에 집중 활용하는 플랜",
      steps: ["최근 10년 증여 이력 확인", "성년 자녀 기본공제 확인", "혼인·출산 추가공제 요건 확인"],
      strength: "결혼자금 마련에 직접적으로 연결됩니다.",
      caution: "요건을 충족하지 못하면 예상보다 과세표준이 커질 수 있습니다.",
    },
    {
      id: "housing",
      title: "주택준비형",
      summary: "증여공제, 혼인공제, 차용 설계, 자금출처 증빙을 함께 보는 플랜",
      steps: ["증여와 차용을 구분", "계약금·잔금 출처 정리", "상환 계획과 이자 지급 기록 관리"],
      strength: "내 집 마련 자금출처 설명에 유리합니다.",
      caution: "세무 검토 필요성이 가장 큽니다.",
    },
  ],
  checklist: [
    { text: "증여일, 금액, 증여자를 기록했는가", reason: "10년 합산 판단의 기준입니다." },
    { text: "자녀 명의 계좌로 실제 이체했는가", reason: "증여 사실을 설명하기 쉬워집니다." },
    { text: "증여세 신고 여부를 검토했는가", reason: "세액이 없어도 자금출처 증빙에 도움이 될 수 있습니다." },
    { text: "최근 10년 증여 이력을 정리했는가", reason: "기본공제 잔여 한도를 확인해야 합니다." },
    { text: "주택자금 목적이라면 자금출처 자료를 남겼는가", reason: "취득자금 소명에 필요할 수 있습니다." },
    { text: "차용이라면 상환 내역을 남길 수 있는가", reason: "차용과 증여를 구분하는 핵심 자료입니다." },
  ],
  relatedLinks: [
    {
      label: "증여세 계산기",
      href: "/tools/gift-tax-calculator/",
      description: "이번 증여금액으로 예상 증여세를 계산합니다.",
    },
    {
      label: "자녀 생애 증여세 계산기",
      href: "/tools/gift-tax-child-calculator/",
      description: "자녀 나이와 혼인·출산 여부로 남은 한도를 계산합니다.",
    },
    {
      label: "결혼비용 계산기",
      href: "/tools/wedding-budget-calculator/",
      description: "결혼자금 규모를 먼저 잡아봅니다.",
    },
    {
      label: "부동산 취득세 계산기",
      href: "/tools/real-estate-acquisition-tax/",
      description: "주택 취득 시 세금까지 함께 확인합니다.",
    },
  ],
  faq: [
    {
      question: "태어나자마자 자녀에게 2,000만 원을 증여하면 세금이 없나요?",
      answer:
        "미성년 자녀는 10년간 2,000만 원까지 증여재산공제를 적용받을 수 있습니다. 다만 같은 증여자 그룹으로부터 받은 10년 이내 증여액을 합산하므로, 이미 증여한 금액이 있으면 남은 한도를 확인해야 합니다.",
    },
    {
      question: "성년 자녀는 10년마다 5,000만 원씩 받을 수 있나요?",
      answer:
        "성년 자녀는 10년간 5,000만 원 공제를 검토할 수 있습니다. 다만 10년 기간 계산, 동일인 합산, 이전 증여 이력에 따라 실제 한도는 달라질 수 있습니다.",
    },
    {
      question: "결혼할 때 부모가 1억 5,000만 원까지 줘도 세금이 없나요?",
      answer:
        "성년 자녀 기본공제 5,000만 원과 혼인·출산 추가공제 1억 원을 함께 검토하면 1억 5,000만 원 구간이 나올 수 있습니다. 다만 혼인 요건, 최근 10년 증여 이력, 혼인·출산 공제 기사용액을 확인해야 합니다.",
    },
    {
      question: "혼인공제와 출산공제를 각각 1억 원씩 받을 수 있나요?",
      answer:
        "혼인·출산 증여재산공제는 합산 한도 1억 원으로 보는 것이 핵심입니다. 이미 혼인공제를 사용했다면 출산 시 남은 한도를 확인해야 합니다.",
    },
    {
      question: "자녀 주택자금은 따로 비과세 한도가 있나요?",
      answer:
        "주택자금이라는 이유만으로 별도 비과세 한도가 자동 적용된다고 단정하면 안 됩니다. 일반 증여공제, 혼인·출산 추가공제, 차용 관계, 자금출처 증빙을 함께 봐야 합니다.",
    },
    {
      question: "증여세가 0원이어도 신고하는 게 좋나요?",
      answer:
        "항상 의무라고 단정할 수는 없지만, 큰 금액이거나 향후 주택 취득 자금출처를 소명해야 할 가능성이 있다면 신고와 증빙을 남기는 것이 유리할 수 있습니다.",
    },
  ],
  sources: [
    {
      label: "국가법령정보센터 — 상속세 및 증여세법",
      href: "https://www.law.go.kr/법령/상속세및증여세법",
      note: "증여재산공제와 혼인·출산 증여재산공제 기준 확인",
    },
    {
      label: "국세청",
      href: "https://www.nts.go.kr",
      note: "증여세 신고, 자금출처 안내 확인",
    },
    {
      label: "홈택스",
      href: "https://www.hometax.go.kr",
      note: "증여세 신고 실무 확인",
    },
  ],
};
```

---

## 6. Astro 페이지 구성

### 6-1. import

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import { childLifetimeGiftPlan } from "../../data/childLifetimeGiftPlan";

const report = childLifetimeGiftPlan;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: report.meta.title,
      description: report.meta.description,
      inLanguage: "ko-KR",
      dateModified: "2026-06-28",
      publisher: { "@type": "Organization", name: "비교계산소" },
    },
    {
      "@type": "FAQPage",
      mainEntity: report.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ],
};
---
```

### 6-2. 전체 섹션 순서

```txt
[BaseLayout]
  [SiteHeader]
  [main.clg-page.report-page]
    [CalculatorHero]
    [InfoNotice]
    ① summary cards
    ② lifetime timeline
    ③ 10-year rule cards
    ④ marriage/birth deduction section
    ⑤ housing myth section
    ⑥ scenario cards
    ⑦ checklist
    ⑧ calculator CTA
    ⑨ FAQ
    ⑩ source/methodology
```

---

## 7. 섹션 구현 상세

### 7-1. Hero

* `CalculatorHero` 재사용
* eyebrow: `세금 리포트`
* title: `자녀 생애 증여 플랜`
* description: 기획서의 H1 문장 또는 짧은 설명
* 하단 `InfoNotice`로 기준일과 세무 주의 문구 노출

```astro
<CalculatorHero
  eyebrow="세금 리포트"
  title={report.meta.title}
  description="0세부터 성년, 결혼·출산, 주택자금까지 자녀 증여 한도를 생애 흐름으로 정리했습니다."
/>
<InfoNotice
  title="세금 신고 전 확인하세요"
  lines={[report.meta.caution, `${report.meta.updatedAt}으로 작성했습니다.`]}
/>
```

### 7-2. Summary cards

* 4개 카드 고정
* 첫 화면에서 핵심 숫자가 바로 보여야 함
* `badge` 값에 따라 색상만 다르게 적용

마크업 예:

```astro
<section class="clg-summary-grid" aria-label="자녀 증여 핵심 요약">
  {report.summaryCards.map((card) => (
    <article class={`clg-summary-card clg-summary-card--${card.badge}`}>
      <span>{card.badge}</span>
      <p>{card.label}</p>
      <strong>{card.value}</strong>
      <small>{card.note}</small>
    </article>
  ))}
</section>
```

### 7-3. Timeline

* desktop: 가로 연결선이 있는 6단계 카드
* mobile: 세로 카드 스택
* 주택 구입 단계만 `주의` 배지로 시각적 강조

구현 원칙:

* 텍스트가 카드 밖으로 넘치지 않도록 `minmax(0, 1fr)` 사용
* 숫자 라벨은 `amountLabel`에만 크게 표시
* `note`는 본문 크기보다 작게

### 7-4. 10년 단위 공제 규칙

* `rules` 배열을 3개 카드로 렌더링
* 각 카드에 `title`, `body`, `example`
* 예시는 회색/연한 배경의 작은 박스로 처리

### 7-5. 혼인·출산 추가공제

구성:

* 왼쪽: 성년 기본공제 5,000만 원 + 추가공제 1억 원 요약
* 오른쪽: `marriageBirthRules` 표 또는 카드 리스트

주의:

* "1억 5,000만 원까지 무조건 비과세" 문구 금지
* `요건 충족 시`, `최근 10년 증여 이력에 따라`, `공제 기사용액 확인` 문구 포함

### 7-6. 주택자금 오해 정리

* 이 페이지의 차별화 섹션
* `housingMyths` 배열을 3개 카드 또는 표로 구현
* `myth`는 사용자 오해 문장, `fact`는 정정 문장, `risk`는 실무 주의

권장 UI:

```txt
[오해] 자녀 주택자금 1억은 무조건 비과세다
[정리] 주택자금 자체가 별도 비과세 한도라고 단정하면 위험합니다.
[주의] 증여공제, 혼인·출산 공제, 차용 여부, 자금출처 증빙을 함께 봐야 합니다.
```

### 7-7. Scenario cards

* 4개 플랜 카드: 보수형, 표준형, 결혼지원형, 주택준비형
* 카드는 동일 높이 강제하지 않음. 대신 모바일에서 자연스럽게 스택
* `steps`는 짧은 리스트로 표시

### 7-8. Checklist

* 체크박스 모양은 실제 input이 아니라 CSS 장식으로 처리
* `text`는 굵게, `reason`은 보조 설명
* 주택자금과 차용 항목은 `주의` 스타일로 구분 가능

### 7-9. CTA

CTA는 3회 배치:

1. Summary cards 아래: `증여세 계산기로 바로 계산하기`
2. 혼인·출산 섹션 아래: `자녀 생애 증여세 계산기로 한도 확인하기`
3. FAQ 위: 관련 계산기 카드 4개

버튼 문구:

* `이번 증여금액으로 세금 계산하기`
* `자녀 나이별 증여 한도 확인하기`
* `주택 취득세도 함께 보기`

### 7-10. FAQ

* visible FAQ 우선
* 아코디언을 쓰더라도 질문/답변이 DOM에 존재해야 함
* `FAQPage` 구조화 데이터와 동일한 배열 사용

### 7-11. 출처/방법론

* 페이지 하단에 `sources` 배열 렌더링
* 외부 링크는 `target="_blank" rel="noopener noreferrer"` 적용
* 방법론 문구:

```md
이 리포트는 2026년 6월 기준 상속세 및 증여세법상 일반 증여재산공제와 혼인·출산 증여재산공제 구조를 설명합니다. 실제 신고 단계에서는 증여일, 증여자 관계, 최근 10년 증여 이력, 재산 평가 방식, 특례 적용 여부를 별도로 확인해야 합니다.
```

---

## 8. SCSS 설계

### 8-1. prefix

모든 페이지 전용 클래스는 `clg-` prefix 사용.

```scss
.clg-page {}
.clg-summary-grid {}
.clg-summary-card {}
.clg-timeline {}
.clg-timeline-card {}
.clg-rule-grid {}
.clg-marriage-panel {}
.clg-myth-grid {}
.clg-scenario-grid {}
.clg-checklist {}
.clg-related-grid {}
.clg-source-list {}
```

### 8-2. 색상 방향

세금/부동산 콘텐츠라서 과한 색을 피하고, 중립 + 녹색 + 청록 + 주의색을 조합.

* 기본 텍스트: `var(--color-text)`
* 보조 텍스트: `var(--color-muted)`
* 공식 배지: 녹색 계열
* 참고 배지: 청록/파랑 계열
* 주의 배지: 황색/적갈색 계열
* 배경: 흰색 또는 `var(--color-surface)`

단일 녹색 테마로만 보이지 않게 `공식`, `참고`, `주의` 배지 색을 분리합니다.

### 8-3. 레이아웃 기준

```scss
.clg-section {
  max-width: 1120px;
  margin: 0 auto;
  padding: 56px 20px;
}

.clg-summary-grid,
.clg-rule-grid,
.clg-scenario-grid,
.clg-related-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

@media (max-width: 920px) {
  .clg-summary-grid,
  .clg-scenario-grid,
  .clg-related-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .clg-summary-grid,
  .clg-rule-grid,
  .clg-scenario-grid,
  .clg-related-grid {
    grid-template-columns: 1fr;
  }
}
```

### 8-4. 카드 규칙

* 카드 border-radius는 8px 이하
* 카드 안에 또 다른 카드 삽입 금지
* 표는 모바일에서 카드형 변환 또는 `overflow-x: auto`
* 텍스트가 긴 `amountLabel`은 `font-size`를 과하게 키우지 않음

---

## 9. 접근성 및 SEO

### 9-1. heading 구조

```txt
H1 자녀 생애 증여 플랜
H2 한눈에 보는 자녀 증여 핵심 한도
H2 0세부터 주택자금까지 생애 증여 타임라인
H2 증여세 한도는 10년 단위로 봅니다
H2 결혼·출산 시점의 추가공제
H2 자녀 주택자금 증여에서 자주 하는 오해
H2 우리 집은 어떤 증여 플랜에 가까울까?
H2 증여세 0원보다 중요한 신고·증빙 체크리스트
H2 같이 보면 좋은 계산기
H2 자주 묻는 질문
H2 기준과 출처
```

### 9-2. 구조화 데이터

* `Article`
* `FAQPage`
* `BreadcrumbList`는 기존 패턴 있으면 추가

### 9-3. 링크 접근성

* CTA 링크는 목적이 드러나는 문구 사용
* `자세히 보기` 단독 문구 금지
* 외부 출처는 새 탭 + `rel="noopener noreferrer"`

---

## 10. 보안/법적 문구

### 필수 문구

* `참고용 콘텐츠입니다`
* `실제 세액은 개인 상황에 따라 달라질 수 있습니다`
* `신고 전 국세청 홈택스 또는 세무 전문가 확인을 권장합니다`
* `주택자금은 별도 비과세 한도로 단정하지 않습니다`

### 금지 문구

* `무조건 비과세`
* `신고하지 않아도 됩니다`
* `1억 5,000만 원까지 세금 없습니다`
* `차용증만 쓰면 증여가 아닙니다`

---

## 11. 리포트 허브 등록안

`src/data/reports.ts` 추가 예시:

```ts
{
  slug: "child-lifetime-gift-plan",
  title: "자녀 생애 증여 플랜",
  description: "0세부터 성년, 결혼·출산, 주택자금까지 자녀 증여 한도를 생애 흐름으로 정리했습니다.",
  category: "세금",
  tags: ["증여세", "자녀", "결혼자금", "주택자금"],
  updatedAt: "2026-06",
  isNew: true,
}
```

실제 타입 필드는 현재 `reports.ts` 구조를 확인해 맞춰야 합니다.

---

## 12. QA 체크리스트

### 콘텐츠 QA

* [ ] 기준일이 상단과 출처 섹션에 표시되는가
* [ ] 모든 세금 수치에 `공식/참고/주의` 맥락이 있는가
* [ ] 혼인·출산 추가공제를 무조건 비과세처럼 표현하지 않았는가
* [ ] 주택자금 별도 비과세 오해를 분명히 정리했는가
* [ ] 증여세 0원 신고 관련 문구가 단정형이 아닌가
* [ ] FAQ가 6개 이상 visible 상태인가

### 개발 QA

* [ ] `src/data/childLifetimeGiftPlan.ts` 타입 에러 없음
* [ ] `/reports/child-lifetime-gift-plan/` 정적 HTML 생성
* [ ] `src/data/reports.ts` 리포트 허브 노출 확인
* [ ] `public/sitemap.xml` URL 포함
* [ ] `src/styles/app.scss` SCSS import 포함
* [ ] 320px 모바일에서 가로 스크롤 없음
* [ ] `npm run build` 성공

---

## 13. 확장 계획

### 2차 확장

* 생년월일 입력 기반 `내 자녀 증여 타임라인` 자동 생성
* 최근 증여일·증여금액 입력 시 다음 공제 가능 시점 안내
* 결혼 예정일 입력 시 혼인공제 적용 기간 안내
* 주택자금 증여 vs 차용 시나리오 비교

### 계산기 연결

1차에서는 리포트가 허브 역할을 하고, 실제 계산은 아래 페이지로 보냅니다.

* `/tools/gift-tax-calculator/`
* `/tools/gift-tax-child-calculator/`
* `/tools/income-home-affordability-calculator/`
* `/tools/real-estate-acquisition-tax/`

---

## 14. 구현 순서

1. `src/data/childLifetimeGiftPlan.ts` 생성
2. `src/pages/reports/child-lifetime-gift-plan.astro` 생성
3. `src/styles/scss/pages/_child-lifetime-gift-plan.scss` 생성
4. `src/styles/app.scss` import 추가
5. `src/data/reports.ts` 등록
6. `public/sitemap.xml` 등록
7. OG 이미지 생성 또는 SVG 추가
8. `npm run build` 확인

---

## 15. 최종 구현 메모

이 리포트는 숫자보다 "오해 방지"가 중요합니다. 사용자가 가져가야 할 결론은 "자녀에게 얼마까지 줄 수 있다" 하나가 아니라, **10년 합산, 혼인·출산 요건, 주택자금 출처, 신고·증빙**을 함께 봐야 한다는 점입니다.

따라서 페이지 상단은 간단하게, 중반은 타임라인으로, 하단은 주택자금과 체크리스트로 현실감을 주는 구성이 가장 적합합니다.
