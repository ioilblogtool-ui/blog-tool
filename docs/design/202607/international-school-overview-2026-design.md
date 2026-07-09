# 국내 국제학교 총정리 2026 (허브) — 설계 문서

> 기획 원본: [`docs/plan/202607/international-school-content-cluster-2026-plan.md`](../../plan/202607/international-school-content-cluster-2026-plan.md)
> 작성일: 2026-07-08
> 유형: 정보성 리포트 (`/reports/`), 클러스터 허브 — 정적 페이지
> 클러스터 2번 페이지

---

## 0. 이 페이지의 역할

이 클러스터(계산기 1개 + 리포트 6개)의 진입점. 개별 리포트(제주 비교, 서울 비교, 외국인학교 차이, 영어유치원 비교, 입학 가이드)와 메인 계산기로 트래픽을 분산시키는 내비게이션 허브다. **자체 콘텐츠는 얕게, 링크는 두껍게** — 각 하위 페이지의 핵심 요약만 담고 상세 내용은 각 페이지로 위임한다. 데이터는 전부 계산기 데이터 파일([`internationalSchoolTuitionCalculator2026.ts`](../../../src/data/internationalSchoolTuitionCalculator2026.ts))의 `IST_SCHOOLS`를 재사용 — 새 학비 숫자를 만들지 않는다.

---

## 1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/internationalSchoolOverview2026.ts` (허브 전용 카피 + `IST_SCHOOLS` re-export 참조) |
| 리포트 등록 | `src/data/reports.ts` |
| 홈 카테고리 등록 | `src/pages/index.astro` (`reportMetaBySlug`) |
| 리포트 인덱스 등록 | `src/pages/reports/index.astro` (별도 맵) |
| 페이지 | `src/pages/reports/international-school-overview-2026.astro` |
| 스크립트 | 없음 (정적 페이지, 인터랙션 없음) |
| 스타일 | `src/styles/scss/pages/_international-school-overview-2026.scss` |
| 앱 CSS import | `src/styles/app.scss` |
| 사이트맵 | `public/sitemap.xml` |

**클래스 프리픽스:** `iso-` (International School Overview)

---

## 2. URL 및 메타

```
슬러그: /reports/international-school-overview-2026/
타이틀(seoTitle): 국내 국제학교 2026 완전 정리 | 학비·입학조건 한눈에 비교
디스크립션: 국제학교 학비, 입학조건, 지역별 대표 학교를 한 페이지에서 비교. 제주·서울·송도 국제학교와 학비 계산기까지 연결.
```

---

## 3. 데이터 파일 설계

**`src/data/internationalSchoolOverview2026.ts`**

```ts
import { IST_SCHOOLS, type InternationalSchoolProfile } from "./internationalSchoolTuitionCalculator2026";

export type ClusterCard = {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
};

export type FaqItem = { question: string; answer: string };

export const ISO_META = {
  slug: "international-school-overview-2026",
  title: "국내 국제학교, 학비부터 입학조건까지",
  seoTitle: "국내 국제학교 2026 완전 정리 | 학비·입학조건 한눈에 비교",
  seoDescription:
    "국제학교 학비, 입학조건, 지역별 대표 학교를 한 페이지에서 비교. 제주·서울·송도 국제학교와 학비 계산기까지 연결.",
  description: "국제학교를 검토 중인 학부모가 처음 봐야 할 학비·입학조건·지역 정보를 한 페이지에 모았습니다.",
  updatedAt: "2026-07-08",
};

// 허브는 IST_SCHOOLS를 그대로 재사용 — 새 학비 데이터 생성 금지
export const ISO_SCHOOLS: InternationalSchoolProfile[] = IST_SCHOOLS;

export const ISO_SUMMARY_STATS = [
  { label: "반영 학교 수", value: "7개교", sub: "제주 4개 + 서울·경기·송도 3개" },
  { label: "최저 학비 대표값", value: "약 1,750만원", sub: "SFS 초등 기준 (원화 부분만, 달러 분담 별도)" },
  { label: "최고 학비 대표값", value: "약 6,000만원대", sub: "Chadwick 고등(Upper School) 기준" },
];

export const ISO_CLUSTER_CARDS: ClusterCard[] = [
  {
    href: "/tools/international-school-tuition-calculator-2026/",
    eyebrow: "계산기",
    title: "국제학교 학비 계산기",
    description: "지역·학교·학년·자녀 수를 입력하면 연간 학비와 월 부담액을 바로 계산합니다.",
    cta: "학비 계산하기",
  },
  {
    href: "/reports/jeju-international-school-comparison-2026/",
    eyebrow: "제주",
    title: "제주 국제학교 4곳 비교",
    description: "NLCS·BHA·SJA·KIS Jeju의 학비와 입학조건, 통학·기숙 옵션을 비교합니다.",
    cta: "제주 4개교 비교 보기",
  },
  {
    href: "/reports/seoul-international-school-comparison-2026/",
    eyebrow: "서울·경기·송도",
    title: "서울·경기 국제학교 비교",
    description: "SFS·Dulwich·채드윅 등 대표 학교의 학비를 비교합니다.",
    cta: "서울권 비교 보기",
  },
  {
    href: "/reports/international-school-vs-foreign-school-2026/",
    eyebrow: "입학조건",
    title: "국제학교 vs 외국인학교 차이",
    description: "입학 자격과 내국인 정원 제한이 학교 유형마다 어떻게 다른지 정리합니다.",
    cta: "차이 정리 보기",
  },
  {
    href: "/reports/international-school-vs-kindergarten-2026/",
    eyebrow: "대안 비교",
    title: "국제학교 vs 영어유치원",
    description: "영어유치원 3년 비용과 국제학교 초등 진학 비용을 비교합니다.",
    cta: "비용 비교 보기",
  },
  {
    href: "/reports/international-school-admission-guide-2026/",
    eyebrow: "입학 준비",
    title: "입학조건 체크리스트",
    description: "서류·시험 준비부터 미인가 학교 학력인정 리스크까지 체크리스트로 정리했습니다.",
    cta: "체크리스트 보기",
  },
];

export const ISO_REGION_SUMMARY = [
  {
    region: "제주",
    schoolCount: 4,
    schools: "NLCS Jeju, Branksome Hall Asia, KIS Jeju, SJA Jeju",
    feature: "제주국제자유도시특별법 근거로 내국인 입학 제한 없음. 기숙 옵션 있는 학교가 많음.",
  },
  {
    region: "서울·경기·송도",
    schoolCount: 3,
    schools: "Chadwick International(송도), Seoul Foreign School, Dulwich College Seoul",
    feature: "대부분 외국인학교로 분류되어 내국인 입학은 정원의 30%(교육감 재량 시 50%) 이내로 제한.",
  },
];

export const ISO_FAQ: FaqItem[] = [
  {
    question: "국제학교와 외국인학교는 같은 말인가요?",
    answer:
      "아닙니다. 국제학교(외국교육기관)는 경제자유구역·제주특별법 등 별도 법령으로 설립되어 내국인 입학 제한이 없는 경우가 많고, 외국인학교는 내국인 정원이 30%(교육감 재량 시 50%)로 제한됩니다. 자세한 차이는 관련 리포트에서 확인할 수 있습니다.",
  },
  {
    question: "이 페이지에 나오는 학비는 정확한가요?",
    answer:
      "각 학교 공식 홈페이지 2026-07-08 확인 기준입니다. 학교마다 매년 학비를 개정하므로, 실제 지원 전에는 반드시 학교 공식 입학처에서 최신 학비를 재확인하세요.",
  },
  {
    question: "제주와 서울 중 어디 국제학교가 더 저렴한가요?",
    answer:
      "학년과 기숙 여부에 따라 다릅니다. 통학 기준으로는 서울권이 저렴한 경우가 많지만, 제주는 기숙 비용이 추가되면 총비용이 더 높아질 수 있습니다. 학비 계산기에서 조건을 입력해 직접 비교하는 것이 정확합니다.",
  },
  {
    question: "국제학교 입학에 나이 제한이 있나요?",
    answer:
      "학교마다 학년별 정원과 입학 시험 기준이 다릅니다. 입학조건 체크리스트 리포트에서 준비 시점과 서류를 확인할 수 있습니다.",
  },
  {
    question: "이 클러스터에 없는 학교도 있나요?",
    answer:
      "네. 검색 수요가 높은 제주·서울·송도권 7개교를 우선 반영했습니다. Dwight School Seoul, YISS, KIS Pangyo 등은 추후 추가할 예정입니다.",
  },
];
```

---

## 4. 페이지 IA (섹션 순서)

```
Hero
 └─ eyebrow: 국내 국제학교
 └─ title: 국내 국제학교, 학비부터 입학조건까지
 └─ description: 지역별 대표 학교와 학비, 입학조건을 한 페이지에서 확인하세요

InfoNotice (학비 출처·확인일자, 매년 개정 안내)

섹션 1 — 핵심 요약 3개 (ISO_SUMMARY_STATS)
섹션 2 — 지역별 개요 카드 2개 (제주 / 서울·경기·송도, ISO_REGION_SUMMARY)
섹션 3 — 전체 7개교 한눈에 보기 표 (ISO_SCHOOLS 전체, 지역·학비 대표값·기숙여부)
섹션 4 — 클러스터 내비게이션 카드 6개 (ISO_CLUSTER_CARDS — 계산기 1 + 리포트 5)
SeoContent (FAQ 5개 + 관련 링크)
```

---

## 5. 컴포넌트 구조

| 컴포넌트 | 용도 |
|---|---|
| `BaseLayout.astro` | `<head>`, SEO, JSON-LD |
| `SiteHeader.astro` | 전역 헤더 |
| `CalculatorHero.astro` | Hero |
| `InfoNotice.astro` | 면책 배너 |
| `SeoContent.astro` | FAQ + 관련 링크 |

### 페이지 전용 마크업 (`iso-` 프리픽스)

| 블록 클래스 | 설명 |
|---|---|
| `.iso-page` | 루트 스코프 |
| `.iso-stat-grid` | 섹션 1 — 요약 통계 3개 |
| `.iso-region-grid` | 섹션 2 — 지역 카드 2개 |
| `.iso-school-table` | 섹션 3 — 전체 학교 표 |
| `.iso-nav-grid` / `.iso-nav-card` | 섹션 4 — 클러스터 내비게이션 카드 |

---

## 6. SCSS 설계

**파일:** `src/styles/scss/pages/_international-school-overview-2026.scss`

```scss
.iso-page {
  --iso-line: #d8e0ea;
  --iso-accent: #1a56db;

  .iso-stat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;

    @media (max-width: 720px) { grid-template-columns: 1fr; }
  }

  .iso-stat-card {
    border: 1px solid var(--iso-line);
    border-radius: 12px;
    padding: 1.1rem;

    p { margin: 0; }
    &__label { font-size: 0.8rem; color: #6b7280; }
    &__value { font-size: 1.4rem; font-weight: 700; }
    &__sub { font-size: 0.78rem; color: #6b7280; }
  }

  .iso-region-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;

    @media (max-width: 720px) { grid-template-columns: 1fr; }
  }

  .iso-region-card {
    border: 1px solid var(--iso-line);
    border-radius: 12px;
    padding: 1.25rem;
    border-top: 4px solid var(--iso-accent);
  }

  .iso-school-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;

    th, td {
      border-bottom: 1px solid var(--iso-line);
      padding: 0.6rem 0.75rem;
      text-align: left;
    }
  }

  .iso-nav-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;

    @media (max-width: 960px) { grid-template-columns: repeat(2, 1fr); }
    @media (max-width: 640px) { grid-template-columns: 1fr; }
  }

  .iso-nav-card {
    display: grid;
    gap: 0.4rem;
    padding: 1.1rem;
    border: 1px solid var(--iso-line);
    border-radius: 12px;
    text-decoration: none;
    color: inherit;

    &:hover { border-color: var(--iso-accent); }

    strong { color: #111827; font-size: 0.95rem; }
    span { color: #6b7280; font-size: 0.8rem; }
    em { color: var(--iso-accent); font-style: normal; font-size: 0.82rem; font-weight: 600; }
  }

  .table-wrap { overflow-x: auto; }
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
import {
  ISO_META,
  ISO_SCHOOLS,
  ISO_SUMMARY_STATS,
  ISO_CLUSTER_CARDS,
  ISO_REGION_SUMMARY,
  ISO_FAQ,
} from "../../data/internationalSchoolOverview2026";

const normalizedBase = import.meta.env.BASE_URL.endsWith("/") ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
const withBase = (path: string) => `${normalizedBase}${path.replace(/^\//, "")}`;
const siteBase = (import.meta.env.SITE ?? "https://bigyocalc.com").replace(/\/$/, "");
const reportUrl = `${siteBase}/reports/${ISO_META.slug}/`;

const faqItems = ISO_FAQ.map((f) => ({ question: f.question, answer: f.answer }));

const jsonLd = [
  { "@context": "https://schema.org", "@type": "Article", headline: ISO_META.title, description: ISO_META.seoDescription, dateModified: ISO_META.updatedAt, mainEntityOfPage: reportUrl, author: { "@type": "Organization", name: "비교계산소" } },
  { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: ISO_FAQ.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) },
  { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "홈", item: siteBase },
    { "@type": "ListItem", position: 2, name: "리포트", item: `${siteBase}/reports/` },
    { "@type": "ListItem", position: 3, name: ISO_META.title, item: reportUrl },
  ] },
];
---
<BaseLayout title={ISO_META.seoTitle} description={ISO_META.seoDescription} jsonLd={jsonLd}>
  <SiteHeader />
  <main class="container page-shell report-page op-page iso-page" data-report="international-school-overview-2026">
    <CalculatorHero eyebrow="국내 국제학교" title={ISO_META.title} description={ISO_META.description} />
    <InfoNotice
      title="읽기 전 꼭 확인하세요"
      lines={["학비는 각 학교 공식 홈페이지 2026-07-08 확인 기준이며 매년 개정됩니다.", "이 페이지는 정보 비교용이며 특정 학교를 추천하지 않습니다."]}
    />

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">핵심 요약</p>
        <h2>이 클러스터에서 먼저 봐야 할 숫자</h2>
      </div>
      <div class="iso-stat-grid">
        {ISO_SUMMARY_STATS.map((s) => (
          <article class="iso-stat-card">
            <p class="iso-stat-card__label">{s.label}</p>
            <p class="iso-stat-card__value">{s.value}</p>
            <p class="iso-stat-card__sub">{s.sub}</p>
          </article>
        ))}
      </div>
    </section>

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">지역별 개요</p>
        <h2>제주 vs 서울·경기·송도, 뭐가 다른가</h2>
      </div>
      <div class="iso-region-grid">
        {ISO_REGION_SUMMARY.map((r) => (
          <article class="iso-region-card">
            <h3>{r.region} ({r.schoolCount}개교)</h3>
            <p>{r.schools}</p>
            <p>{r.feature}</p>
          </article>
        ))}
      </div>
    </section>

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">전체 비교</p>
        <h2>7개교 한눈에 보기</h2>
      </div>
      <div class="table-wrap">
        <table class="iso-school-table">
          <thead><tr><th>학교</th><th>지역</th><th>대표 학년 학비</th><th>기숙 가능</th></tr></thead>
          <tbody>
            {ISO_SCHOOLS.map((school) => (
              <tr>
                <td>{school.name}</td>
                <td>{school.regionLabel}</td>
                <td>{school.tuitionTiers[0].krwPortion > 0
                  ? `${Math.round(school.tuitionTiers[0].krwPortion / 10000).toLocaleString("ko-KR")}만원~`
                  : `$${school.tuitionTiers[0].usdPortion.toLocaleString("en-US")}~`}</td>
                <td>{school.boardingAvailable ? "가능" : "확인 필요"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">더 보기</p>
        <h2>이 클러스터의 다른 콘텐츠</h2>
      </div>
      <div class="iso-nav-grid">
        {ISO_CLUSTER_CARDS.map((card) => (
          <a class="iso-nav-card" href={withBase(card.href)}>
            <span>{card.eyebrow}</span>
            <strong>{card.title}</strong>
            <span>{card.description}</span>
            <em>{card.cta} →</em>
          </a>
        ))}
      </div>
    </section>

    <SeoContent
      introTitle="국내 국제학교, 이렇게 비교하세요"
      intro={[
        "국제학교는 자녀 1인당 연간 수천만 원이 들어가는 큰 결정입니다. 학비뿐 아니라 학교 유형(국제학교/외국인학교/외국교육기관)에 따라 내국인 입학 가능 여부가 다르기 때문에, 비용과 자격을 함께 확인해야 실수 없는 선택을 할 수 있습니다.",
        "이 페이지는 제주와 서울·경기·송도권 7개교를 지역별로 묶어 학비 규모를 먼저 보여주고, 세부 비교와 입학조건은 각 하위 리포트로 연결합니다. 학비를 구체적으로 계산해보고 싶다면 계산기를, 입학 자격 자체가 궁금하다면 외국인학교 비교 리포트를 먼저 보는 것을 추천합니다.",
        "국제학교 학비는 원화와 달러를 혼합해 청구하는 경우가 많아 환율에 따라 부담이 달라집니다. 이 페이지의 학비는 학교 공식 홈페이지 기준이며 절대값보다는 학교 간 상대적 규모를 파악하는 용도로 활용하는 것이 안전합니다.",
        "국제학교 대안으로 영어유치원이나 조기유학을 고려하는 경우도 많은데, 이 클러스터의 다른 리포트에서 비용 대비 효과를 함께 비교할 수 있습니다. 실제 지원 전에는 반드시 학교 공식 입학처에서 최신 정보를 재확인하세요.",
      ]}
      criteria={[
        "학비는 각 학교 공식 홈페이지 2026-07-08 확인 기준입니다.",
        "제주 4개교, 서울·경기·송도 3개교를 우선 반영했으며 추가 학교는 순차 반영 예정입니다.",
        "이 페이지는 투자·진학을 추천하지 않으며 정보 비교 목적입니다.",
      ]}
      faq={faqItems}
      related={[
        { href: "/tools/international-school-tuition-calculator-2026/", label: "국제학교 학비 계산기" },
        { href: "/reports/jeju-international-school-comparison-2026/", label: "제주 국제학교 4곳 비교" },
        { href: "/reports/seoul-international-school-comparison-2026/", label: "서울·경기 국제학교 비교" },
        { href: "/reports/international-school-vs-foreign-school-2026/", label: "국제학교 vs 외국인학교 차이" },
      ]}
    />
  </main>
</BaseLayout>
```

---

## 8. reports.ts 등록

```ts
{
  slug: "international-school-overview-2026",
  title: "국내 국제학교 2026 완전 정리 | 학비·입학조건 한눈에 비교",
  description: "국제학교 학비, 입학조건, 지역별 대표 학교를 한 페이지에서 비교. 제주·서울·송도 국제학교와 학비 계산기까지 연결.",
  order: 73,
  badges: ["NEW", "국제학교", "학비", "입학조건"],
},
```

카테고리 등록 (양쪽): `"international-school-overview-2026": { category: "life", isNew: true }`

---

## 9. app.scss import

```scss
@use 'scss/pages/international-school-overview-2026';
```

---

## 10. sitemap.xml

```xml
<url>
  <loc>https://bigyocalc.com/reports/international-school-overview-2026/</loc>
  <lastmod>2026-07-08</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

---

## 11. 내부 CTA 전체 목록

| 위치 | 문구 | href |
|---|---|---|
| 섹션 4 카드 | 국제학교 학비 계산기 | `/tools/international-school-tuition-calculator-2026/` |
| 섹션 4 카드 | 제주 국제학교 4곳 비교 | `/reports/jeju-international-school-comparison-2026/` |
| 섹션 4 카드 | 서울·경기 국제학교 비교 | `/reports/seoul-international-school-comparison-2026/` |
| 섹션 4 카드 | 국제학교 vs 외국인학교 차이 | `/reports/international-school-vs-foreign-school-2026/` |
| 섹션 4 카드 | 국제학교 vs 영어유치원 | `/reports/international-school-vs-kindergarten-2026/` |
| 섹션 4 카드 | 입학조건 체크리스트 | `/reports/international-school-admission-guide-2026/` |

---

## 12. QA 포인트

- [ ] `IST_SCHOOLS`를 import해서 재사용하고 있는지 확인 (데이터 중복 정의 금지)
- [ ] 6개 내비게이션 카드가 모두 올바른 슬러그로 연결되는지 확인 (구현 순서상 아직 없는 페이지는 임시로 회색 처리하거나, 클러스터 전체 구현 완료 후 이 페이지를 마지막에 배포하는 것을 권장)
- [ ] `reportMetaBySlug`(홈)와 `reports/index.astro` 카테고리 맵 둘 다 등록 확인
- [ ] `npm run build` 통과

---

## 13. 구현 순서 참고

이 허브 페이지는 **클러스터의 다른 5개 리포트가 최소 1개 이상 존재해야 링크가 죽지 않으므로, 계획서의 개발 순서(계산기 → 허브 → 제주 → 서울 → 외국인학교 차이 → 영어유치원 → 입학가이드)를 따르되, 실무적으로는 하위 리포트를 먼저 만들고 허브를 마지막에 배포**하는 것도 대안이 될 수 있다. 다만 계획서 순서를 따른다면, 아직 없는 하위 페이지 링크는 구현 시점에 있는 것만 먼저 노출하고 나머지는 완료되는 대로 추가한다.
