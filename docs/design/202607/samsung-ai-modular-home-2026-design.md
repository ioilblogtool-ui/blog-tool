# 삼성 AI 모듈러 홈 2026 — 설계 문서

> 기획 원본: [`docs/plan/202607/samsung-ai-modular-home-2026-plan.md`](../../plan/202607/samsung-ai-modular-home-2026-plan.md)
> 작성일: 2026-07-07
> 유형: 정보성 리포트 (`/reports/`), 정적 페이지 (JS 계산 없음 — 평형별 비용은 build-time 정적 표)

---

## 1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/samsungAiModularHome2026.ts` |
| 리포트 등록 | `src/data/reports.ts` |
| 홈/카테고리 등록 | `src/pages/index.astro` (`reportMetaBySlug`) |
| 페이지 | `src/pages/reports/samsung-ai-modular-home-2026.astro` |
| 스크립트 | (없음 — 정적 리포트. 개인화 계산은 없음) |
| 스타일 | `src/styles/scss/pages/_samsung-ai-modular-home-2026.scss` |
| 앱 CSS import | `src/styles/app.scss` |
| 사이트맵 | `public/sitemap.xml` |

**클래스 프리픽스:** `samh-` (Samsung AI Modular Home). 공유 클래스 `.op-page`/`.op-section`/`.op-message`/`.op-card`/`.op-badge`(`_opportunities-202605.scss` 정의)를 베이스로 얹는다 — `yongin-vs-pyeongtaek-cluster-housing-2026`, `first-home-buyer-benefits-2026` 등 기존 `estate` 카테고리 리포트와 동일한 실제 운영 패턴.

---

## 2. URL 및 메타

```
슬러그: /reports/samsung-ai-modular-home-2026/
타이틀(seoTitle): 삼성 AI 모듈러 홈 2026 완전 정리 | 평당 가격 얼마
디스크립션: 삼성 AI 모듈러 홈 평당 500만~650만원 가격 기준과 10·30·40평형 예상 비용을 정리했습니다. 3년 1만호 공급계획, 화성 쇼룸, 클레이튼 해외 사업까지 확인하세요.
```

---

## 3. 데이터 파일 설계

**`src/data/samsungAiModularHome2026.ts`**

이 리포트는 기존 데이터 파일을 재사용할 대상이 없는 **신규 주제**다. 다만 관련 계산기(`home-purchase-fund`, `real-estate-acquisition-tax`, `apartment-holding-tax`)의 슬러그·related 문구 톤은 그대로 참조한다.

```ts
// ── 타입 ──────────────────────────────────────────

export type PriceTableRow = {
  size: string;            // "10평" | "20평" | "30평" | "40평"
  basicPrice: number;      // 기본형 (평당 500만원 기준) — 원 단위
  packagePrice: number;    // AI 가전 패키지 포함 (평당 650만원 기준) — 원 단위
  note?: string;           // 예: "쇼룸 전시 평형"
};

export type SupplyTimelineItem = {
  period: string;          // "2026년 6월" | "3년 내" | "2029년"
  label: string;           // "화성 쇼룸 공개"
  detail: string;
  status: "완료" | "목표";
};

export type OverseasRow = {
  region: string;          // "북미"
  partner: string;         // "클레이턴 홈스"
  model: string;           // 사업 모델 설명
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type RelatedLink = {
  href: string;
  label: string;
  description: string;
};

// ── 데이터 ────────────────────────────────────────

export const SAMH_META = {
  slug: "samsung-ai-modular-home-2026",
  title: "삼성 AI 모듈러 홈, 가격과 공급 계획 총정리",
  seoTitle: "삼성 AI 모듈러 홈 2026 완전 정리 | 평당 가격 얼마",
  seoDescription:
    "삼성 AI 모듈러 홈 평당 500만~650만원 가격 기준과 10·30·40평형 예상 비용을 정리했습니다. 3년 1만호 공급계획, 화성 쇼룸, 클레이튼 해외 사업까지 확인하세요.",
  description: "평당 가격 기준과 평형별 예상 비용, 3년 1만호 공급 로드맵을 한눈에 정리한 리포트입니다.",
  updatedAt: "2026-07-07",
  dataNote:
    "평당 가격(기본형 약 500만원, AI 가전 패키지 포함 약 600만~650만원)은 2026-06-24 보도 기준이며, 삼성전자·공간제작소의 공식 확정 견적이 아닙니다. 부지 매입비, 기초공사, 인허가, 상하수도 인입 등 부대비용은 포함되지 않으므로 실제 총비용은 더 늘어날 수 있습니다.",
};

// 평당 500만원(기본형) / 650만원(AI 가전 패키지) 기준 단순 곱셈 — 부대비용 제외
export const SAMH_PRICE_TABLE: PriceTableRow[] = [
  { size: "10평", basicPrice: 50_000_000, packagePrice: 65_000_000 },
  { size: "20평", basicPrice: 100_000_000, packagePrice: 130_000_000, note: "화성 쇼룸 전시 평형" },
  { size: "30평", basicPrice: 150_000_000, packagePrice: 195_000_000 },
  { size: "40평", basicPrice: 200_000_000, packagePrice: 260_000_000 },
];

export const SAMH_SUPPLY_TIMELINE: SupplyTimelineItem[] = [
  {
    period: "2026년 6월",
    label: "화성 쇼룸 공개",
    detail: "경기 화성시에 공간제작소와 공동 기획한 쇼룸 2개소(100평형·20평형) 오픈",
    status: "완료",
  },
  {
    period: "3년 내",
    label: "1만호 공급",
    detail: "단독주택 중심으로 누적 1만호 공급이 목표",
    status: "목표",
  },
  {
    period: "2029년",
    label: "3만호 공급 + 사업 확장",
    detail: "아파트·공공주택·빌딩 등으로 모듈러 홈 사업 영역 확장",
    status: "목표",
  },
];

export const SAMH_OVERSEAS: OverseasRow[] = [
  {
    region: "북미",
    partner: "클레이턴 홈스",
    model: "클레이턴이 신규 공급하는 주택에 삼성 AI 가전 패키지를 결합해 공급 (시공은 클레이턴, 가전·AI 홈 솔루션은 삼성전자 담당)",
  },
];

export const SAMH_FAQ: FaqItem[] = [
  {
    question: "삼성 AI 모듈러 홈은 얼마인가요?",
    answer:
      "보도 기준 평당 약 500만원(기본형)이며, 에어컨·냉장고·TV 등 필수 가전과 스마트 조명·홈캠·로봇청소기 등 20여 종을 묶은 AI 가전 패키지를 포함하면 평당 600만~650만원 수준입니다. 부지 매입비와 인허가 비용은 별도입니다.",
  },
  {
    question: "모듈러 주택은 일반 주택과 무엇이 다른가요?",
    answer:
      "공장에서 방·욕실 단위 모듈을 미리 제작한 뒤 부지에서 조립하는 방식으로, 현장에서 처음부터 골조를 세우는 일반 건축보다 공사 기간이 짧습니다. 시공은 모듈러 목조주택 전문사인 공간제작소가 맡고, 삼성전자는 AI 가전과 스마트싱스 기반 홈 솔루션 결합을 담당합니다.",
  },
  {
    question: "삼성 AI 모듈러 홈은 어디서 볼 수 있나요?",
    answer: "경기 화성시에 공간제작소와 공동으로 만든 쇼룸이 있으며, 100평형과 20평형 두 개 동으로 구성되어 있습니다.",
  },
  {
    question: "아파트에도 적용되나요?",
    answer:
      "현재는 단독주택 중심 사업이며, 삼성전자는 3년 내 1만호·2029년 3만호 공급을 거치며 아파트·공공주택·빌딩으로 사업 영역을 확장할 계획이라고 밝혔습니다. 아직 구체적인 아파트 적용 일정은 공개되지 않았습니다.",
  },
  {
    question: "해외에서도 살 수 있나요?",
    answer:
      "북미에서는 현지 최대 모듈러 주택 업체인 클레이턴 홈스와 협업 중입니다. 국내처럼 삼성전자가 직접 시공하는 방식이 아니라, 클레이턴이 공급하는 신규 주택에 삼성 AI 가전 패키지를 결합하는 방식입니다.",
  },
];

export const SAMH_SEO_INTRO = [
  "삼성전자가 2026년 6월 24일 경기 화성 쇼룸에서 'AI 모듈러 홈' 사업을 공식 발표했습니다. 공간제작소와 협업한 모듈러 목조주택에 삼성 AI 가전과 스마트싱스 기반 홈 솔루션을 패키지로 결합한 형태로, 3년 내 1만호, 2029년까지 3만호 공급을 목표로 내걸었습니다.",
  "가격은 평당(3.3㎡) 약 500만원이 기본 건축비이며, 에어컨·냉장고·TV 등 필수 가전과 스마트 조명·홈캠·로봇청소기 등 20여 종의 스마트홈 연동 기기를 묶은 AI 가전 패키지를 포함하면 평당 600만~650만원 수준으로 올라갑니다. 고객은 부지 규모와 라이프스타일에 맞춰 10평형부터 40평형까지 선택할 수 있습니다.",
  "다만 이 가격은 순수 건축비 기준이며, 부지 매입비, 기초공사, 인허가, 상하수도 인입 같은 부대비용은 포함되지 않습니다. 실제 총 예산을 계산할 때는 이 부분을 반드시 별도로 고려해야 합니다.",
  "해외 사업은 국내와 결이 다릅니다. 북미에서는 삼성전자가 직접 시공하지 않고, 현지 최대 모듈러 주택 업체인 클레이턴 홈스가 공급하는 신규 주택에 AI 가전 패키지만 결합해 공급하고 있습니다.",
];

export const SAMH_SEO_CRITERIA = [
  "평당가(기본형 약 500만원, AI 가전 패키지 포함 약 600만~650만원)는 2026-06-24 보도 기준이며 공식 확정 견적이 아닙니다.",
  "평형별 예상 비용표는 평형 × 평당가 단순 곱셈이며, 부지·인허가·기초공사 등 부대비용은 포함하지 않습니다.",
  "3년 1만호·2029년 3만호는 삼성전자가 발표한 목표치이며, 실제 공급 실적과 다를 수 있습니다.",
  "국내(직접 시공+가전 결합)와 북미(가전 패키지만 공급, 클레이턴 홈스 협업)는 사업 모델이 다릅니다.",
];

export const SAMH_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/home-purchase-fund/", label: "내 집 마련 자금 계산기", description: "예산과 대출 조건을 넣어 내 집 마련 자금 계획을 확인합니다." },
  { href: "/tools/real-estate-acquisition-tax/", label: "부동산 취득세 계산기", description: "신축 주택 취득 시 예상 취득세를 계산합니다." },
  { href: "/tools/apartment-holding-tax/", label: "아파트 보유세 계산기", description: "보유세·재산세 예상 금액을 확인합니다." },
  { href: "/reports/seoul-housing-2016-vs-2026/", label: "서울 집값 2016 vs 2026", description: "아파트 가격 흐름과 대안 주거 형태를 비교하는 맥락 자료입니다." },
];
```

---

## 4. 페이지 IA (섹션 순서)

```
Hero
 └─ eyebrow: 삼성전자 주거 사업
 └─ title: 삼성 AI 모듈러 홈, 가격과 공급 계획 총정리
 └─ description: 평당 가격, 평형별 예상 비용, 3년 1만호 공급 로드맵 정리

InfoNotice (가격 추정치 안내)
 └─ dataNote, "평형별 비용표는 부대비용 제외 단순 계산", "실제 견적은 공식 채널에서 확인"

섹션 1 — 삼성 AI 모듈러 홈이란? (개념 카드 3개: 모듈러 방식 / 시공 파트너 공간제작소 / 삼성전자 역할)
섹션 2 — 평형별 예상 비용 ★ 핵심 (가격표 + 부대비용 주의 문구 + CTA)
섹션 3 — 공급 계획 타임라인 (완료/목표 배지가 있는 타임라인 카드 3개)
섹션 4 — 해외 사업 — 클레이턴 협업 (비교 카드: 국내 모델 vs 북미 모델)
SeoContent (FAQ + 관련 링크)
```

REPORT_CONTENT_GUIDE.md의 권장 IA를 따르되, "선택 UI"가 없는 정적 해설+가격표형이라 select/tabs 단계를 생략한다. 개인화된 예산 계산은 기존 `/tools/home-purchase-fund/`로 위임한다(계산기 중복 구현 방지 원칙 — `samsung-q2-earnings-bonus-outlook-2026` 설계와 동일).

---

## 5. 컴포넌트 구조

### 기존 공유 컴포넌트 (그대로 사용)

| 컴포넌트 | 용도 | 실제 Props |
|---|---|---|
| `BaseLayout.astro` | `<head>`, SEO, JSON-LD | `title`, `description`, `jsonLd` |
| `SiteHeader.astro` | 전역 헤더 | — |
| `CalculatorHero.astro` | Hero 섹션 | `eyebrow`, `title`, `description` |
| `InfoNotice.astro` | 면책 배너 | `title: string`, `lines: string[]` |
| `SeoContent.astro` | SEO 텍스트 + FAQ + 관련 링크 | `introTitle`, `intro`, `criteria`, `faq`, `related` |

### 페이지 전용 마크업 (인라인, `samh-` 프리픽스)

| 블록 클래스 | 설명 |
|---|---|
| `.samh-page` | 페이지 루트 스코프 (로컬 CSS 변수 정의) |
| `.samh-concept-grid` | 섹션 1 — 개념 카드 3개 (모듈러 방식/공간제작소/삼성전자 역할) |
| `.samh-price-table` | 섹션 2 — 평형별 가격표 |
| `.samh-price-table__package` | 패키지형(AI 가전 포함) 열 강조 스타일 |
| `.samh-cta-group` | 내부 CTA 버튼 묶음 |
| `.samh-timeline` | 섹션 3 — 공급 계획 타임라인 |
| `.samh-timeline__item[data-status]` | 완료/목표 배지 색상 분기 |
| `.samh-overseas-card` | 섹션 4 — 클레이턴 협업 비교 카드 |

---

## 6. SCSS 설계

**파일:** `src/styles/scss/pages/_samsung-ai-modular-home-2026.scss`

`.op-page` 공유 클래스(`.op-section`, `.op-message`, `.op-card`, `.op-badge`)를 베이스로 얹고, 페이지 고유 로컬 변수만 최소한으로 추가한다.

```scss
.samh-page {
  --samh-ink: #172033;
  --samh-muted: #667085;
  --samh-line: #d8e0ea;
  --samh-primary: #1a56db;
  --samh-done: #059669;
  --samh-target: #d97706;

  .samh-concept-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;

    @media (max-width: 720px) {
      grid-template-columns: 1fr;
    }
  }

  .samh-price-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;

    th, td {
      border-bottom: 1px solid var(--samh-line);
      padding: 0.6rem 0.75rem;
      text-align: right;

      &:first-child { text-align: left; }
    }

    &__package {
      font-weight: 600;
      color: var(--samh-primary);
    }
  }

  .samh-cta-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin: 1.25rem 0;
  }

  .samh-timeline {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    &__item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      border: 1px solid var(--samh-line);
      border-radius: 12px;
      padding: 1rem;

      &[data-status="완료"] { border-left: 3px solid var(--samh-done); }
      &[data-status="목표"] { border-left: 3px solid var(--samh-target); }
    }
  }

  .samh-overseas-card {
    border: 1px solid var(--samh-line);
    border-radius: 12px;
    padding: 1rem;
  }
}
```

---

## 7. Astro 페이지 구조

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import { withBase } from "../../utils/base";
import {
  SAMH_META,
  SAMH_PRICE_TABLE,
  SAMH_SUPPLY_TIMELINE,
  SAMH_OVERSEAS,
  SAMH_FAQ,
  SAMH_SEO_INTRO,
  SAMH_SEO_CRITERIA,
  SAMH_RELATED_LINKS,
} from "../../data/samsungAiModularHome2026";

const siteBase = (import.meta.env.SITE ?? "https://bigyocalc.com").replace(/\/$/, "");
const reportUrl = `${siteBase}/reports/${SAMH_META.slug}/`;
const formatWon = (value: number) => `${new Intl.NumberFormat("ko-KR").format(Math.round(value / 10000))}만원`;

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: SAMH_META.title,
    description: SAMH_META.seoDescription,
    dateModified: SAMH_META.updatedAt,
    mainEntityOfPage: reportUrl,
    author: { "@type": "Organization", name: "비교계산소" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SAMH_FAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: siteBase },
      { "@type": "ListItem", position: 2, name: "리포트", item: `${siteBase}/reports/` },
      { "@type": "ListItem", position: 3, name: SAMH_META.title, item: reportUrl },
    ],
  },
];
---
<BaseLayout title={SAMH_META.seoTitle} description={SAMH_META.seoDescription} jsonLd={jsonLd}>
  <SiteHeader />

  <main class="container page-shell report-page op-page samh-page" data-report="samsung-ai-modular-home-2026">
    <CalculatorHero
      eyebrow="삼성전자 주거 사업"
      title={SAMH_META.title}
      description={SAMH_META.description}
    />

    <InfoNotice
      title="가격 정보 안내 (중요)"
      lines={[
        SAMH_META.dataNote,
        "평형별 비용표는 부지·인허가·기초공사 등 부대비용을 제외한 단순 계산입니다.",
      ]}
    />

    <!-- 섹션 1: 개념 설명 -->
    <section class="op-section">
      <h2>삼성 AI 모듈러 홈이란?</h2>
      <div class="samh-concept-grid">
        <article class="op-card">
          <strong>모듈러 방식</strong>
          <p>공장에서 방·욕실 단위 모듈을 제작한 뒤 부지에서 조립해 공사 기간을 줄이는 건축 방식입니다.</p>
        </article>
        <article class="op-card">
          <strong>시공 파트너 공간제작소</strong>
          <p>모듈러 목조주택 전문사인 공간제작소가 실제 시공을 맡습니다.</p>
        </article>
        <article class="op-card">
          <strong>삼성전자의 역할</strong>
          <p>완성된 주택에 AI 가전과 스마트싱스 기반 홈 솔루션을 패키지로 결합합니다.</p>
        </article>
      </div>
    </section>

    <!-- 섹션 2: 평형별 예상 비용 ★ -->
    <section class="op-section">
      <h2>평형별 예상 비용</h2>
      <table class="samh-price-table">
        <thead>
          <tr><th>평형</th><th>기본형 (평당 500만원)</th><th class="samh-price-table__package">AI 가전 패키지 포함 (평당 650만원)</th></tr>
        </thead>
        <tbody>
          {SAMH_PRICE_TABLE.map((row) => (
            <tr>
              <td>{row.size}{row.note && <small> ({row.note})</small>}</td>
              <td>{formatWon(row.basicPrice)}</td>
              <td class="samh-price-table__package">{formatWon(row.packagePrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p class="op-message">부지 매입비, 기초공사, 인허가, 상하수도 인입 등 부대비용은 포함되지 않습니다.</p>
      <div class="samh-cta-group">
        <a href={withBase("/tools/home-purchase-fund/")}>내 집 마련 자금 계산기로 예산 확인하기 →</a>
      </div>
    </section>

    <!-- 섹션 3: 공급 계획 타임라인 -->
    <section class="op-section">
      <h2>공급 계획 타임라인</h2>
      <div class="samh-timeline">
        {SAMH_SUPPLY_TIMELINE.map((item) => (
          <article class="samh-timeline__item" data-status={item.status}>
            <strong>{item.period}</strong>
            <div>
              <p>{item.label}</p>
              <small>{item.detail}</small>
            </div>
          </article>
        ))}
      </div>
    </section>

    <!-- 섹션 4: 해외 사업 -->
    <section class="op-section">
      <h2>해외 사업 — 클레이턴 협업</h2>
      {SAMH_OVERSEAS.map((row) => (
        <article class="samh-overseas-card">
          <strong>{row.region}: {row.partner}</strong>
          <p>{row.model}</p>
        </article>
      ))}
      <p class="op-message">국내는 삼성전자가 직접 시공에 관여하지만, 북미는 가전 패키지 공급 중심으로 사업 모델이 다릅니다.</p>
    </section>

    <SeoContent
      introTitle="삼성 AI 모듈러 홈 핵심 정리"
      intro={SAMH_SEO_INTRO}
      criteria={SAMH_SEO_CRITERIA}
      faq={SAMH_FAQ}
      related={SAMH_RELATED_LINKS.map((l) => ({ href: l.href, label: l.label }))}
    />
  </main>
</BaseLayout>
```

---

## 8. reports.ts 등록

```ts
{
  slug: "samsung-ai-modular-home-2026",
  title: "삼성 AI 모듈러 홈 2026 완전 정리 | 평당 가격 얼마",
  description: "삼성 AI 모듈러 홈 평당 500만~650만원 가격 기준과 10·30·40평형 예상 비용을 정리했습니다. 3년 1만호 공급계획, 화성 쇼룸, 클레이튼 해외 사업까지 확인하세요.",
  order: 68,
  badges: ["삼성전자", "모듈러 홈", "2026"],
},
```

## 8-1. index.astro `reportMetaBySlug` 등록 (누락 시 "기타"로 표시됨 — 필수)

```ts
"samsung-ai-modular-home-2026": { category: "estate", isNew: true },
```

---

## 9. app.scss import

```scss
@use 'scss/pages/samsung-ai-modular-home-2026';
```

---

## 10. sitemap.xml

```xml
<url>
  <loc>https://bigyocalc.com/reports/samsung-ai-modular-home-2026/</loc>
  <lastmod>2026-07-07</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

`changefreq: monthly` — 공급 계획·가격 발표가 분기 단위로 갱신될 가능성은 있지만 `samsung-q2-earnings-bonus-outlook-2026`처럼 확정된 재발표 일정이 있는 건 아니므로 weekly보다 낮게 설정.

---

## 11. 내부 CTA 전체 목록

| 위치 | 문구 | href |
|---|---|---|
| 섹션 2 하단 | 내 집 마련 자금 계산기로 예산 확인하기 | `/tools/home-purchase-fund/` |
| SeoContent related | 내 집 마련 자금 계산기 | `/tools/home-purchase-fund/` |
| SeoContent related | 부동산 취득세 계산기 | `/tools/real-estate-acquisition-tax/` |
| SeoContent related | 아파트 보유세 계산기 | `/tools/apartment-holding-tax/` |
| SeoContent related | 서울 집값 2016 vs 2026 | `/reports/seoul-housing-2016-vs-2026/` |

---

## 12. 데이터 정확성 / QA 포인트

- [ ] 평당가(500만원/650만원)는 InfoNotice와 섹션 2 바로 아래 두 곳 모두에 "부대비용 제외" 문구가 노출되는지 확인 — 표만 보고 총비용을 오해하지 않도록
- [ ] `formatWon` 계산 결과가 표와 어긋나지 않는지 확인 (10평 5,000만원 / 20평 1억원 / 30평 1억5,000만원 / 40평 2억원 — 기본형 기준)
- [ ] `SAMH_SUPPLY_TIMELINE`의 `status`(완료/목표) 배지 색상이 타임라인 카드에 정상 반영되는지 확인
- [ ] 국내 사업 모델(시공+가전 결합)과 북미 클레이턴 모델(가전 패키지만 공급)이 혼동되지 않게 섹션 4에서 명확히 구분됐는지 확인
- [ ] "3년 내 1만호", "2029년 3만호"가 확정 실적이 아니라 삼성전자의 목표치라는 점이 FAQ·SEO_CRITERIA에 모두 명시됐는지 확인
- [ ] 모바일에서 3-카드 그리드(섹션 1) → 1열 전환 확인
- [ ] 내부 CTA 5개 링크(관련 계산기 3개 + 관련 리포트 1개 + 섹션 내 CTA) 모두 작동 확인
- [ ] `reportMetaBySlug`에 슬러그 등록 확인 (누락 시 홈 화면 "기타" 카테고리로 표시되는 사고 방지)
- [ ] `npm run build` 통과, 라우트 `/reports/samsung-ai-modular-home-2026/` 존재 확인
- [ ] 구현 시점에 삼성전자·공간제작소가 공식 가격표나 견적 도구를 새로 공개했는지 재검색 후 반영

---

## 13. 향후 확장 — 계산기 전환 시점

삼성전자가 지역별 정식 견적 도구나 상세 가격표(옵션별 추가금 등)를 공식 공개하면, 이 리포트의 섹션 2(평형별 예상 비용)를 별도 계산기(`/tools/samsung-modular-home-cost-calculator/` 등)로 분리하는 것을 검토한다. 그 전까지는 정적 표 + InfoNotice 조합으로 "추정" 톤을 유지하는 현재 설계가 안전하다.
