# 가족 간 계좌이체 증여세 기준 리포트 설계 문서

> 기획 원본: `docs/plan/202606/family-bank-transfer-gift-tax-report.md`
> 콘텐츠 유형: `/reports/` 정적 리포트
> 작성일: 2026-06-29
> 구현 기준: 가족 간 계좌이체의 증여 리스크를 관계·용도·증빙 기준으로 설명하고, 증여세 계산기와 차용증 후속 콘텐츠로 연결

---

## 1. 문서 개요

| 항목 | 내용 |
|---|---|
| 구현 대상 | 가족 간 계좌이체 증여세 기준 리포트 |
| slug | `family-bank-transfer-gift-tax` |
| URL | `/reports/family-bank-transfer-gift-tax/` |
| 페이지 유형 | 정적 리포트, 체크리스트, 사례 가이드 |
| 카테고리 | 세금/증여/가족자금 |
| 레이아웃 | `BaseLayout.astro` + `report-page fbt-page` |
| CSS prefix | `fbt-` |
| JS | 없음. 1차 MVP는 정적 페이지 |
| 핵심 CTA | `/tools/gift-tax-calculator/`, `/reports/child-lifetime-gift-plan/`, `/tools/spouse-stock-gift-tax-calculator/` |

---

## 2. 구현 목표

### 2-1. 사용자 문제

검색 사용자는 보통 아래 상황에서 들어옵니다.

* 부모님이 자녀에게 돈을 보냈는데 증여세가 나올지 궁금하다.
* 부부끼리 생활비 또는 투자금을 이체했는데 괜찮은지 궁금하다.
* 전세자금·주택자금·사업자금처럼 목돈을 가족에게 보냈거나 받았다.
* 빌린 돈이라고 주장하려면 차용증만 있으면 되는지 알고 싶다.
* 관계별 증여재산공제 한도가 얼마인지 빠르게 확인하고 싶다.

이 리포트는 위 질문에 대해 "금액 하나로 판단하지 않는다"는 원칙을 먼저 설명하고, 관계·용도·증빙에 따라 리스크를 구분해서 보여줍니다.

### 2-2. 페이지 성공 기준

* 첫 화면에서 "가족 간 이체는 금액만으로 판단하지 않는다"는 메시지가 전달된다.
* 사용자가 본인 상황을 `관계`, `용도`, `금액 성격`, `증빙` 기준으로 분류할 수 있다.
* 차용증 섹션에서 후속 콘텐츠 또는 계산기로 자연스럽게 이동한다.
* 세금 콘텐츠답게 단정형 표현을 피하고, 공식 기준과 참고 해석을 구분한다.

---

## 3. 구현 파일 구조

```txt
src/
  data/
    familyBankTransferGiftTax.ts
  pages/
    reports/
      family-bank-transfer-gift-tax.astro
  styles/
    scss/
      pages/
        _family-bank-transfer-gift-tax.scss
    app.scss

public/
  og/
    reports/
      family-bank-transfer-gift-tax.svg
  sitemap.xml
```

추가 등록:

* `src/data/reports.ts` — 리포트 허브 카드 등록
* `src/styles/app.scss` — `@use 'scss/pages/family-bank-transfer-gift-tax';`
* `public/sitemap.xml` — `/reports/family-bank-transfer-gift-tax/` URL 추가

---

## 4. 페이지 방향

### 4-1. 콘텐츠 성격

* 계산기보다 "판단 기준 리포트"에 가까운 콘텐츠
* "얼마까지 무조건 안전"이라는 단정형 답변을 피함
* 세금 콘텐츠이므로 `공식`, `참고`, `주의`, `고위험` 배지를 적극 사용
* 사용자가 본인 상황을 빠르게 대입할 수 있도록 표, 카드, 사례 중심으로 구성
* 차용증은 단독 해결책이 아니라 이자 지급·원금 상환·계좌 기록과 함께 설명

### 4-2. UX 핵심 흐름

사용자는 아래 순서로 이해해야 합니다.

1. 가족 간 계좌이체는 금액만으로 판단하지 않는다.
2. 생활비·교육비와 전세자금·주택자금·투자금은 리스크가 다르다.
3. 관계별 증여재산공제는 10년 합산 기준이다.
4. 빌린 돈이라면 차용증뿐 아니라 이자·상환 기록이 필요하다.
5. 애매한 목돈 이전은 증여세 계산기 또는 세무 상담으로 이어져야 한다.

### 4-3. 톤앤매너

* 사용자 facing 텍스트는 전부 한국어
* 법률·세금 문구는 단정하지 않고 조건부 표현 사용
* 불안을 과도하게 자극하지 않고, 실무적으로 남겨야 할 증빙을 안내
* "절세 꿀팁"보다는 "문제되지 않게 정리하는 기준"에 초점

---

## 5. 데이터 모델

### 5-1. 타입 설계

```ts
// src/data/familyBankTransferGiftTax.ts

export type FamilyTransferBadge = "공식" | "참고" | "주의" | "고위험";
export type TransferRiskLevel = "낮음" | "중간" | "높음" | "매우 높음";

export type FamilyTransferMeta = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  updatedAt: string;
  caution: string;
};

export type SummaryCard = {
  label: string;
  value: string;
  note: string;
  badge: FamilyTransferBadge;
};

export type RiskTableItem = {
  transferType: string;
  risk: TransferRiskLevel;
  badge: FamilyTransferBadge;
  interpretation: string;
  checkPoint: string;
};

export type RelationGuide = {
  id: string;
  label: string;
  title: string;
  summary: string;
  deductionLabel: string;
  keyPoints: string[];
  caution: string;
};

export type DeductionLimit = {
  relation: string;
  amountLabel: string;
  note: string;
  badge: FamilyTransferBadge;
};

export type ChecklistItem = {
  title: string;
  reason: string;
  example: string;
};

export type CaseStudy = {
  id: string;
  title: string;
  amountLabel: string;
  risk: TransferRiskLevel;
  situation: string;
  interpretation: string;
  evidence: string[];
};

export type AuditPoint = {
  title: string;
  body: string;
  badge: FamilyTransferBadge;
};

export type RelatedLink = {
  label: string;
  href: string;
  description: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type SourceLink = {
  label: string;
  href: string;
  note: string;
};

export type FamilyBankTransferGiftTaxReport = {
  meta: FamilyTransferMeta;
  summaryCards: SummaryCard[];
  riskTable: RiskTableItem[];
  relationGuides: RelationGuide[];
  deductionLimits: DeductionLimit[];
  checklist: ChecklistItem[];
  cases: CaseStudy[];
  auditPoints: AuditPoint[];
  relatedLinks: RelatedLink[];
  faq: FaqItem[];
  sources: SourceLink[];
};
```

---

## 6. 데이터 구성 상세

### 6-1. Meta

```ts
export const familyBankTransferGiftTax: FamilyBankTransferGiftTaxReport = {
  meta: {
    slug: "family-bank-transfer-gift-tax",
    title: "가족 간 계좌이체 증여세 기준 리포트",
    seoTitle: "가족 간 계좌이체 증여세 기준 리포트 | 부모·자녀·부부 이체, 얼마부터 문제될까?",
    description:
      "부모·자녀·부부·형제 사이 계좌이체가 증여세 대상이 되는지 생활비, 전세자금, 주택자금, 차용증, 이자, 상환 증빙 기준으로 정리했습니다.",
    ogTitle: "가족 간 계좌이체 증여세 기준",
    ogDescription:
      "생활비인지, 빌린 돈인지, 증여인지 헷갈리는 가족 간 이체를 관계·용도·증빙 기준으로 정리.",
    updatedAt: "2026년 6월 기준",
    caution:
      "이 리포트는 일반적인 판단 기준을 정리한 참고용 콘텐츠입니다. 실제 증여세 과세 여부는 자금 출처, 사용처, 가족관계, 상환 기록, 세무조사 시점의 사실관계에 따라 달라질 수 있습니다.",
  },
  ...
};
```

### 6-2. Summary Cards

상단 요약 카드는 4개로 고정합니다.

| 카드 | 값 | 배지 | 의도 |
|---|---|---|---|
| 단일 안전금액 | 없음 | 주의 | "얼마까지 괜찮다" 오해 방지 |
| 배우자 공제 | 10년 6억 원 | 공식 | 부부간 목돈 이전 기준 |
| 성인 자녀 공제 | 10년 5,000만 원 | 공식 | 부모·자녀 검색 의도 대응 |
| 차용 증빙 | 이자·상환 기록 | 참고 | 차용증 후속 콘텐츠 연결 |

### 6-3. Risk Table

대표 항목:

| transferType | risk | interpretation | checkPoint |
|---|---|---|---|
| 생활비·교육비 목적의 정기 이체 | 낮음~중간 | 실제 생활비로 사용됐는지 중요 | 카드값·월세·교육비 지출 증빙 |
| 명절 용돈·소액 축의금 | 낮음 | 사회통념상 인정 범위인지 확인 | 금액 규모와 반복성 |
| 자녀 전세보증금 지원 | 높음 | 목돈 이전, 자금출처 조사 가능성 | 증여 신고 또는 차용 증빙 |
| 주택 구입자금 지원 | 매우 높음 | 자산 취득자금으로 남는 거래 | 자금출처 소명 준비 |
| 주식·코인 투자금 지원 | 높음 | 수익 귀속과 자금 출처 이슈 | 투자계좌 명의와 원천 |
| 부모 병원비 대납 | 낮음~중간 | 부양 목적·사용처 증빙 중요 | 병원 영수증, 이체 내역 |
| 가족 간 돈 빌려줌 | 중간~높음 | 차용증, 이자, 상환 기록 필요 | 원금·이자 상환 흐름 |
| 부부 생활비 이체 | 낮음 | 공동 생활비라면 리스크 낮음 | 실제 생활비 지출 |
| 부부 명의 자산 취득자금 이전 | 중간~높음 | 명의와 자금 출처 불일치 주의 | 취득자금 출처 |

리스크 배지 매핑:

| risk | badge | CSS class |
|---|---|---|
| 낮음 | 참고 | `fbt-risk--low` |
| 중간 | 주의 | `fbt-risk--medium` |
| 높음 | 고위험 | `fbt-risk--high` |
| 매우 높음 | 고위험 | `fbt-risk--critical` |

### 6-4. Relation Guides

관계별 카드 4개:

1. 부모 → 자녀
2. 자녀 → 부모
3. 부부 간
4. 형제·친족

각 카드에는 아래 필드를 노출합니다.

* 관계 label
* 핵심 요약
* 공제한도
* 주요 체크포인트 3개
* 주의 문장

### 6-5. Deduction Limits

기존 증여세 계산기와 동일한 기준을 사용합니다.

| 관계 | 10년 합산 공제 | 배지 |
|---|---:|---|
| 배우자 | 6억 원 | 공식 |
| 성인 자녀 | 5,000만 원 | 공식 |
| 미성년 자녀 | 2,000만 원 | 공식 |
| 직계존속 | 5,000만 원 | 공식 |
| 기타 친족 | 1,000만 원 | 공식 |

표 하단 고정 문구:

```md
공제한도는 이번 이체 1건 기준이 아니라 10년 합산 기준입니다. 과거 현금·부동산·주식 증여가 있었다면 함께 합산해야 합니다.
```

### 6-6. Checklist

차용증 체크리스트 항목:

* 차용증 작성일
* 원금
* 이자율
* 이자 지급일
* 원금 상환일
* 계좌이체 메모
* 상환 내역

각 항목은 `title`, `reason`, `example`로 구성합니다.

예:

```ts
{
  title: "이자 지급 내역",
  reason: "가족 간 거래가 실제 대여였는지 보여주는 핵심 자료입니다.",
  example: "매월 말 '차용금 이자' 메모로 계좌이체",
}
```

### 6-7. Case Studies

사례 5개:

1. 부모가 성인 자녀에게 매달 100만 원 생활비 이체
2. 부모가 자녀 전세보증금 1억 원 지원
3. 부부간 생활비 계좌로 매달 300만 원 이체
4. 형이 동생에게 사업자금 5,000만 원 이체
5. 자녀가 부모 병원비 2,000만 원 대납

각 사례 카드 구성:

* 제목
* 금액
* 리스크 배지
* 상황 설명
* 해석
* 남겨야 할 증빙 리스트

### 6-8. Audit Points

세무조사/자금출처 확인에서 보는 자료:

* 돈이 어디서 나왔는가
* 실제 어디에 쓰였는가
* 반복적으로 이체됐는가
* 빌린 돈이라면 갚고 있는가
* 명의와 실질 소유자가 일치하는가

---

## 7. Astro 페이지 설계

### 7-1. 기본 구조

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import { familyBankTransferGiftTax as report } from "../../data/familyBankTransferGiftTax";

const badgeClass = (badge: string) => ({
  "공식": "fbt-badge--official",
  "참고": "fbt-badge--reference",
  "주의": "fbt-badge--caution",
  "고위험": "fbt-badge--danger",
}[badge] ?? "fbt-badge--reference");

const riskClass = (risk: string) => ({
  "낮음": "low",
  "중간": "medium",
  "높음": "high",
  "매우 높음": "critical",
}[risk] ?? "medium");

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: report.meta.seoTitle,
      description: report.meta.description,
      inLanguage: "ko-KR",
      dateModified: "2026-06-29",
      author: { "@type": "Organization", name: "비교계산소" },
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

<BaseLayout title={report.meta.seoTitle} description={report.meta.description} jsonLd={jsonLd}>
  <SiteHeader />
  <main class="report-page fbt-page">
    ...
  </main>
</BaseLayout>
```

### 7-2. Section Order

1. `fbt-hero`
2. `InfoNotice`
3. `fbt-summary-grid`
4. `fbt-risk-list`
5. `fbt-relation-grid`
6. `fbt-deduction-table`
7. `fbt-checklist-grid`
8. `fbt-case-grid`
9. `fbt-audit-grid`
10. `fbt-related-grid`
11. `SeoContent` FAQ
12. `fbt-source-list`

---

## 8. 섹션별 UI 설계

### 8-1. Hero

클래스:

```txt
fbt-hero
fbt-hero__eyebrow
fbt-hero__title
fbt-hero__lead
fbt-hero__meta
```

카피:

```md
가족 간 계좌이체 증여세 기준 리포트
부모·자녀·부부 사이 돈 이체, 얼마부터 문제될까?
```

Hero 하단 메타 배지:

* 2026년 6월 기준
* 10년 합산 공제 기준
* 생활비·차용증·주택자금 구분

### 8-2. InfoNotice

상단 주의 문구:

```md
가족 간 계좌이체는 금액만으로 판단하지 않습니다.
생활비인지, 빌린 돈인지, 증여인지에 따라 세금 판단이 달라집니다.
전세자금·주택자금·투자금처럼 목돈이 오간 경우에는 증빙이 특히 중요합니다.
```

### 8-3. Summary Cards

클래스:

```txt
fbt-summary-grid
fbt-summary-card
fbt-badge
```

목적:

* 첫 화면에서 "무조건 안전 금액 없음"을 먼저 노출
* 공제한도는 두 번째 정보로 배치
* 계산기 CTA 전환을 위해 "10년 합산" 반복 노출

### 8-4. Quick Risk Cards

모바일 가독성을 위해 일반 table 대신 카드형 리스트를 우선합니다.

```astro
<section class="fbt-section">
  <div class="section-header section-header--compact">
    <p class="section-header__eyebrow">빠른 판정</p>
    <h2>이체 목적별 증여 리스크</h2>
  </div>
  <div class="fbt-risk-list">
    {report.riskTable.map((item) => (
      <article class={`fbt-risk-card fbt-risk--${riskClass(item.risk)}`}>
        <div class="fbt-risk-card__head">
          <span class={`fbt-badge ${badgeClass(item.badge)}`}>{item.risk}</span>
          <h3>{item.transferType}</h3>
        </div>
        <p>{item.interpretation}</p>
        <strong>{item.checkPoint}</strong>
      </article>
    ))}
  </div>
</section>
```

Desktop 2열, mobile 1열.

### 8-5. Relation Guides

관계별 카드 4개:

* 부모 → 자녀
* 자녀 → 부모
* 부부 간
* 형제·친족

카드 구성:

```txt
상단: 관계 label + 공제한도
중간: 핵심 요약
하단: 체크포인트 3개
주의: 작은 caution box
```

### 8-6. Deduction Limits Table

표는 실제 숫자를 한눈에 보여주는 영역입니다.

```astro
<div class="table-wrap">
  <table class="fbt-table fbt-deduction-table">
    <thead>
      <tr><th>관계</th><th>10년 합산 공제</th><th>설명</th></tr>
    </thead>
    <tbody>
      {report.deductionLimits.map((item) => (
        <tr>
          <td>{item.relation}</td>
          <td>{item.amountLabel}</td>
          <td>{item.note}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

### 8-7. Loan Evidence Checklist

체크리스트는 저장하고 싶은 영역이므로 카드형으로 구성합니다.

```txt
fbt-checklist-grid
fbt-check-card
fbt-check-card__mark
```

각 카드:

* 제목
* 왜 필요한가
* 예시

강조 문구:

```md
차용증은 시작점일 뿐입니다. 가족 간 돈 거래가 빌린 돈으로 인정받으려면 실제 이자 지급과 원금 상환 흐름이 계좌 기록으로 남아야 합니다.
```

### 8-8. Case Studies

사례 카드는 `risk`를 눈에 띄게 보여주되, 겁주는 UI가 되지 않게 배지와 설명 중심으로 처리합니다.

```txt
fbt-case-grid
fbt-case-card
fbt-case-card__amount
fbt-case-card__evidence
```

사례별 필드:

* 상황
* 금액
* 리스크
* 해석
* 필요한 증빙

### 8-9. Audit Points

자금출처 확인 포인트는 짧은 카드 5개로 구성합니다.

```txt
fbt-audit-grid
fbt-audit-card
```

각 카드에는 2~3문장 이하만 사용합니다.

### 8-10. Related CTA

CTA는 중간 1회, 하단 1회 배치합니다.

중간 CTA:

```txt
관계별 공제한도부터 계산해보세요
→ 증여세 계산기
```

하단 CTA:

```txt
차용증·자녀 증여·부부 자산 이전까지 이어서 보기
```

---

## 9. 스타일 설계

### 9-1. Color Tokens

```scss
.fbt-page {
  --fbt-ink: #172026;
  --fbt-muted: #5d6975;
  --fbt-line: #d9e2e8;
  --fbt-soft: #f6f9fb;
  --fbt-green: #0f766e;
  --fbt-blue: #2458d3;
  --fbt-amber: #a15c07;
  --fbt-red: #b42318;
}
```

팔레트는 세금/금융 리포트답게 차분하게 가되, 단색 테마가 되지 않도록 green, blue, amber, red를 역할별로만 사용합니다.

### 9-2. Layout

```scss
.fbt-page {
  background: #fff;
  color: var(--fbt-ink);
}

.fbt-section {
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
  padding: 36px 0;
}

.fbt-summary-grid,
.fbt-relation-grid,
.fbt-case-grid {
  display: grid;
  gap: 12px;
}
```

Breakpoint:

| viewport | 처리 |
|---|---|
| `< 640px` | 1열 카드, table은 가로 overflow |
| `640~960px` | 2열 카드 |
| `> 960px` | summary 4열, relation/case 2~3열 |

### 9-3. Badge Classes

```scss
.fbt-badge {
  display: inline-flex;
  align-items: center;
  min-height: 26px;
  padding: 4px 9px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 900;
}

.fbt-badge--official { background: #ecfdf5; color: #0f766e; }
.fbt-badge--reference { background: #eff6ff; color: #2458d3; }
.fbt-badge--caution { background: #fffbeb; color: #a15c07; }
.fbt-badge--danger { background: #fff1f2; color: #b42318; }
```

### 9-4. Risk Cards

```scss
.fbt-risk-card {
  padding: 16px;
  border: 1px solid var(--fbt-line);
  border-radius: 8px;
  background: #fff;
}

.fbt-risk--low { border-left: 4px solid var(--fbt-blue); }
.fbt-risk--medium { border-left: 4px solid var(--fbt-amber); }
.fbt-risk--high,
.fbt-risk--critical { border-left: 4px solid var(--fbt-red); }
```

### 9-5. Tables

```scss
.fbt-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.92rem;
}

.fbt-table th,
.fbt-table td {
  padding: 11px 12px;
  border-bottom: 1px solid var(--fbt-line);
  text-align: left;
}

.fbt-table th {
  background: var(--fbt-soft);
  color: var(--fbt-muted);
  font-size: 0.82rem;
}
```

---

## 10. SEO/구조화 데이터

### 10-1. Title

```txt
가족 간 계좌이체 증여세 기준 리포트 | 부모·자녀·부부 이체, 얼마부터 문제될까?
```

### 10-2. Description

```txt
부모·자녀·부부·형제 사이 계좌이체가 증여세 대상이 되는지 생활비, 전세자금, 주택자금, 차용증, 이자, 상환 증빙 기준으로 정리했습니다.
```

### 10-3. JSON-LD

사용 타입:

* `Article`
* `FAQPage`

`WebApplication`은 사용하지 않습니다. 1차 MVP가 정적 리포트이기 때문입니다.

---

## 11. FAQ 설계

FAQ는 `SeoContent` 또는 페이지 하단 visible FAQ로 노출합니다. 구조화 데이터와 화면 노출 내용이 일치해야 합니다.

필수 질문:

1. 가족 간 계좌이체는 얼마부터 증여세가 나오나요?
2. 부모님이 자녀에게 생활비를 보내면 증여인가요?
3. 부부간 계좌이체도 증여세가 나오나요?
4. 자녀 전세자금을 부모가 지원하면 증여세가 나오나요?
5. 차용증만 쓰면 증여세를 피할 수 있나요?
6. 가족 간 무이자 대여도 괜찮나요?
7. 계좌이체 메모는 도움이 되나요?
8. 현금으로 주면 더 안전한가요?
9. 증여세 신고를 안 하면 언제 문제가 되나요?
10. 가족 간 돈 거래 기록은 얼마나 보관해야 하나요?

---

## 12. CTA/내부링크 설계

### 12-1. Primary CTA

```txt
증여세 계산기로 공제한도 확인하기
→ /tools/gift-tax-calculator/
```

### 12-2. Secondary CTA

```txt
자녀 생애 증여 플랜 보기
→ /reports/child-lifetime-gift-plan/

부부간 주식 증여세 계산기 보기
→ /tools/spouse-stock-gift-tax-calculator/
```

### 12-3. Placeholder CTA

후속 콘텐츠가 구현되기 전까지는 링크를 비활성 텍스트로 두거나 관련 섹션 anchor로 연결합니다.

```txt
가족 간 차용증 이자 계산 리포트
→ 2차 콘텐츠 예정
```

---

## 13. 공식 출처

데이터 파일에는 아래 출처를 포함합니다.

```ts
sources: [
  {
    label: "상속세 및 증여세법 제46조",
    href: "https://www.law.go.kr/법령/상속세및증여세법/제46조",
    note: "비과세되는 증여재산 기준",
  },
  {
    label: "상속세 및 증여세법 제53조",
    href: "https://www.law.go.kr/법령/상속세및증여세법/제53조",
    note: "관계별 증여재산공제 기준",
  },
  {
    label: "상속세 및 증여세법 제41조의4",
    href: "https://www.law.go.kr/법령/상속세및증여세법/제41조의4",
    note: "금전 무상대출 등에 따른 이익의 증여 기준",
  },
]
```

출처 섹션에는 `target="_blank"`와 `rel="noreferrer"`를 사용합니다.

---

## 14. OG 이미지 설계

파일:

```txt
public/og/reports/family-bank-transfer-gift-tax.svg
```

문구:

```txt
가족 간 계좌이체 증여세 기준
부모·자녀·부부 이체, 얼마부터 문제될까?
생활비 · 전세자금 · 차용증 · 10년 공제
```

비주얼:

* 배경: `#f6f9fb`
* 중앙 흰색 패널
* 3개 칩:
  * 생활비
  * 전세자금
  * 차용증
* 경고색은 작게만 사용

---

## 15. 2차 확장 설계

### 15-1. 가족 간 이체 리스크 체크기

2차에서 JS를 추가할 경우 파일:

```txt
public/scripts/family-bank-transfer-gift-tax.js
```

입력:

* 관계
* 목적
* 금액대
* 차용증 여부
* 이자 지급 여부
* 상환 기록 여부

결과:

* 리스크 레벨
* 필요한 증빙 3개
* 추천 CTA

### 15-2. 계산 방식

점수 기반 단순 판정:

```txt
baseRisk = relationRisk + purposeRisk + amountRisk
evidenceDiscount = loanAgreement + interestPayment + repaymentHistory
finalRisk = baseRisk - evidenceDiscount
```

사용자에게는 점수를 노출하지 않고 `낮음/중간/높음/매우 높음`만 표시합니다.

### 15-3. 2차 확장 주의

* "안전"이라는 결과값을 직접 표시하지 않습니다.
* 결과 문구는 `리스크 낮음`, `증빙 필요`, `전문가 확인 권장`처럼 표현합니다.
* 금액만으로 판정하지 않고 목적과 증빙을 함께 반영합니다.

---

## 16. 구현 순서

1. `src/data/familyBankTransferGiftTax.ts` 작성
2. `src/pages/reports/family-bank-transfer-gift-tax.astro` 작성
3. `src/styles/scss/pages/_family-bank-transfer-gift-tax.scss` 작성
4. `public/og/reports/family-bank-transfer-gift-tax.svg` 작성
5. `src/data/reports.ts` 등록
6. `src/styles/app.scss`에 SCSS 추가
7. `public/sitemap.xml` URL 추가
8. `npm run build`
9. 생성 파일 확인: `dist/reports/family-bank-transfer-gift-tax/index.html`

---

## 17. QA 체크리스트

### 콘텐츠 QA

* [ ] "얼마까지 무조건 괜찮다"는 표현이 없는가?
* [ ] 생활비·교육비와 자산 취득자금이 명확히 구분되는가?
* [ ] 차용증을 단독 해결책처럼 쓰지 않았는가?
* [ ] 10년 합산 공제 기준이 반복 노출되는가?
* [ ] 신고 전 전문가 확인 문구가 상단과 하단에 있는가?
* [ ] 공식 기준과 해석/주의 문구가 배지로 구분되는가?

### UI QA

* [ ] 모바일에서 리스크 카드와 사례 카드가 1열로 자연스럽게 쌓이는가?
* [ ] 리스크 배지 색상이 과하지 않고 의미가 구분되는가?
* [ ] 표가 모바일에서 잘리거나 글자가 겹치지 않는가?
* [ ] CTA 버튼이 리포트 중간과 하단에 각각 배치되는가?
* [ ] FAQ가 visible 상태로 노출되는가?
* [ ] 버튼·카드 안 긴 한국어 문구가 넘치지 않는가?

### 빌드 QA

* [ ] `npm run build` 성공
* [ ] `dist/reports/family-bank-transfer-gift-tax/index.html` 생성
* [ ] OG 이미지 경로 정상
* [ ] sitemap URL 포함
* [ ] reports 허브에서 카드 노출

---

## 18. 구현 시 금지 표현

아래 표현은 사용하지 않습니다.

```txt
이 금액 이하는 안전합니다
가족 간 계좌이체는 문제 없습니다
차용증만 쓰면 증여세를 피할 수 있습니다
생활비는 무조건 비과세입니다
부부간 이체는 증여세가 나오지 않습니다
```

대신 아래처럼 씁니다.

```txt
금액만으로 판단하기 어렵고, 이체 목적과 사용처, 증빙을 함께 봐야 합니다.
실제 생활비로 사용된 내역이 있다면 리스크가 낮아질 수 있습니다.
차용으로 보려면 차용증뿐 아니라 이자 지급과 원금 상환 기록이 중요합니다.
부부간 생활비 이체와 배우자 명의 자산 취득자금은 구분해서 봐야 합니다.
```

