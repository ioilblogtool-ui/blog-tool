# 국제학교 vs 영어유치원 2026 — 설계 문서

> 기획 원본: [`docs/plan/202607/international-school-content-cluster-2026-plan.md`](../../plan/202607/international-school-content-cluster-2026-plan.md)
> 작성일: 2026-07-08
> 유형: 비교 리포트 (`/reports/`) — 정적 페이지
> 클러스터 6번 페이지

---

## 0. 데이터 재사용 원칙 (이 페이지의 핵심 설계 결정)

이 사이트에는 이미 [`english-kindergarten-vs-regular-kindergarten-cost-2026`](../../../src/pages/reports/english-kindergarten-vs-regular-kindergarten-cost-2026.astro) 리포트와 그 데이터 파일 [`englishKindergartenVsRegularCost2026.ts`](../../../src/data/englishKindergartenVsRegularCost2026.ts)이 존재하며, 영어유치원 학비(프리미엄형 월 220만원, 일반형 월 120만원, 3년 누적 각 8,460만원/4,680만원)를 이미 다루고 있다. **이 페이지는 새 영어유치원 비용을 조사·생성하지 않고 기존 데이터를 그대로 import해 재사용한다.** 국제학교 쪽 데이터는 계산기 데이터 파일의 `IST_SCHOOLS`를 재사용한다. 이 페이지가 새로 추가하는 것은 오직 "두 데이터를 나란히 놓고 비교하는 서술과 표"뿐이다.

**자기잠식 방지**: 기존 영어유치원 리포트와 겹치지 않도록, 이 페이지는 영어유치원 자체의 상세 비교(등급별·지역별)는 다루지 않고 "영어유치원 총비용 vs 국제학교 총비용"이라는 상위 비교에 집중한다. 관련 링크 1번째로 기존 영어유치원 리포트를 배치해 상세 비교가 필요한 사용자를 그쪽으로 유도한다.

---

## 1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/internationalSchoolVsKindergarten2026.ts` |
| 리포트 등록 | `src/data/reports.ts` |
| 홈 카테고리 등록 | `src/pages/index.astro` |
| 리포트 인덱스 등록 | `src/pages/reports/index.astro` |
| 페이지 | `src/pages/reports/international-school-vs-kindergarten-2026.astro` |
| 스크립트 | 없음 (정적 비교) |
| 스타일 | `src/styles/scss/pages/_international-school-vs-kindergarten-2026.scss` |
| 앱 CSS import | `src/styles/app.scss` |
| 사이트맵 | `public/sitemap.xml` |

**클래스 프리픽스:** `isk-` (International School vs Kindergarten)

---

## 2. URL 및 메타

```
슬러그: /reports/international-school-vs-kindergarten-2026/
타이틀(seoTitle): 국제학교 vs 영어유치원 2026 | 비용·효과 한눈에 비교
디스크립션: 영어유치원 3년 비용과 국제학교 초등 진학 비용을 비교합니다. 어느 쪽이 우리 가정에 맞는지 확인하세요.
```

---

## 3. 데이터 파일 설계

**`src/data/internationalSchoolVsKindergarten2026.ts`**

```ts
import { IST_SCHOOLS } from "./internationalSchoolTuitionCalculator2026";
import { CUMULATIVE_COST_ROWS, EKC_META } from "./englishKindergartenVsRegularCost2026";

export type FaqItem = { question: string; answer: string };
export type RelatedLink = { href: string; label: string };

export const ISK_META = {
  slug: "international-school-vs-kindergarten-2026",
  title: "영어유치원 3년 vs 국제학교, 뭐가 남을까",
  seoTitle: "국제학교 vs 영어유치원 2026 | 비용·효과 한눈에 비교",
  seoDescription:
    "영어유치원 3년 비용과 국제학교 초등 진학 비용을 비교합니다. 어느 쪽이 우리 가정에 맞는지 확인하세요.",
  description: "영어유치원 3년 누적 비용과 국제학교 초등 1년·6년 비용을 나란히 비교해 다음 선택을 돕습니다.",
  updatedAt: "2026-07-08",
  dataSourceNote: `영어유치원 비용은 기존 「${EKC_META.title}」 리포트 데이터(${EKC_META.updatedAt} 기준)를 그대로 인용했습니다. 국제학교 학비는 이 클러스터의 학비 계산기 데이터(2026-07-08 확인)를 인용했습니다.`,
};

// 영어유치원 3년 누적 비용 — 기존 리포트 데이터 그대로 인용 (재계산·재조사 금지)
export const ISK_KINDERGARTEN_ROWS = CUMULATIVE_COST_ROWS;

// 국제학교 쪽 비교값 — IST_SCHOOLS에서 초등 진학 시점 학비만 추출
export const ISK_SCHOOL_ENTRY_ROWS = IST_SCHOOLS.map((school) => {
  const elementaryTier = school.tuitionTiers.find((t) =>
    t.tierKey.includes("elementary") || t.tierKey.includes("village") || t.tierKey === "y1_6" || t.tierKey === "all_grades"
  ) ?? school.tuitionTiers[0];
  return {
    schoolName: school.name,
    region: school.regionLabel,
    tierLabel: elementaryTier.tierLabel,
    krwPortion: elementaryTier.krwPortion,
    usdPortion: elementaryTier.usdPortion,
  };
});

export const ISK_FAQ: FaqItem[] = [
  {
    question: "영어유치원 3년과 국제학교 초등 1년 중 어느 쪽이 더 비싼가요?",
    answer:
      "영어유치원 프리미엄형 3년 누적 비용(약 8,460만원)은 국제학교 초등 1년 학비보다 높은 경우가 많습니다. 다만 국제학교는 초등 이후로도 계속 학비가 발생하므로, 단년도 비교가 아니라 장기 누적 비교가 필요합니다.",
  },
  {
    question: "영어유치원을 보내면 국제학교 입학에 유리한가요?",
    answer:
      "영어 노출 경험이 국제학교 적응에 도움이 될 수는 있지만, 입학 자격(내국인 정원 제한, 해외 거주 요건 등)과는 무관합니다. 영어유치원 이력이 입학 심사에 가산점으로 작용한다는 공식 근거는 없습니다.",
  },
  {
    question: "국제학교 대신 영어유치원 + 사교육을 계속하는 게 나을까요?",
    answer:
      "가정마다 다릅니다. 영어유치원은 유아기에 한정되지만 국제학교는 초·중·고 전체 학비가 매년 발생합니다. 장기 누적 비용과 진학 목표(국내 대학 vs 해외 대학)를 함께 고려해 결정하는 것이 좋습니다.",
  },
  {
    question: "이 비교의 영어유치원 비용은 어디서 가져온 데이터인가요?",
    answer:
      "이 사이트의 기존 영어유치원 vs 일반유치원 비교 리포트 데이터를 그대로 인용했습니다. 더 상세한 등급별·지역별 비교는 해당 리포트에서 확인할 수 있습니다.",
  },
  {
    question: "국제학교 학비도 매년 오르나요?",
    answer:
      "네. 대부분의 국제학교는 매년 학비를 개정하며, 이 페이지의 국제학교 학비는 2026-07-08 확인 기준입니다. 실제 지원 전에는 학교 공식 입학처에서 최신 학비를 재확인하세요.",
  },
];

export const ISK_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/english-kindergarten-vs-regular-kindergarten-cost-2026/", label: "영어유치원 vs 일반유치원 비용 비교" },
  { href: "/tools/international-school-tuition-calculator-2026/", label: "국제학교 학비 계산기" },
  { href: "/reports/international-school-overview-2026/", label: "국내 국제학교 총정리" },
  { href: "/tools/child-tutoring-cost-calculator/", label: "자녀 사교육비 계산기" },
];
```

---

## 4. 페이지 IA (섹션 순서)

```
Hero
 └─ eyebrow: 대안 비교
 └─ title: 영어유치원 3년 vs 국제학교, 뭐가 남을까
 └─ description: 두 선택지의 비용 구조를 나란히 비교합니다

InfoNotice (dataSourceNote — 두 데이터 출처 명시)

섹션 1 — 영어유치원 3년 누적 비용 (ISK_KINDERGARTEN_ROWS, 기존 리포트 인용 표시)
섹션 2 — 국제학교 초등 진학 학비 (ISK_SCHOOL_ENTRY_ROWS, 7개교)
섹션 3 — 나란히 비교 (영어유치원 3년 총액 vs 국제학교 1년 학비, 시각적 대비)
섹션 4 — 선택 가이드 (어떤 가정에 어느 쪽이 맞는지 서술형 카드 2개)
SeoContent (FAQ 5개 + 관련 링크 — 1번째 링크 반드시 기존 영어유치원 리포트)
```

**자기잠식 방지 배치**: SeoContent `related` 1번째 항목을 반드시 기존 `english-kindergarten-vs-regular-kindergarten-cost-2026`으로 고정.

---

## 5. 컴포넌트 구조

공유 컴포넌트는 이전 문서들과 동일. 페이지 전용 마크업(`isk-` 프리픽스):

| 블록 클래스 | 설명 |
|---|---|
| `.isk-page` | 루트 스코프 |
| `.isk-kinder-table` | 섹션 1 — 영어유치원 비용표 |
| `.isk-school-table` | 섹션 2 — 국제학교 초등 학비표 |
| `.isk-vs-compare` | 섹션 3 — 나란히 비교 2열 |
| `.isk-guide-grid` | 섹션 4 — 선택 가이드 카드 2개 |

---

## 6. SCSS 설계

**파일:** `src/styles/scss/pages/_international-school-vs-kindergarten-2026.scss`

```scss
.isk-page {
  --isk-line: #d8e0ea;
  --isk-accent: #1a56db;

  .isk-kinder-table, .isk-school-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;

    th, td {
      border-bottom: 1px solid var(--isk-line);
      padding: 0.6rem 0.75rem;
      text-align: left;
    }
  }

  .isk-vs-compare {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 1rem;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;

      .isk-vs-divider { display: none; }
    }
  }

  .isk-vs-card {
    border: 1px solid var(--isk-line);
    border-radius: 12px;
    padding: 1.25rem;
    text-align: center;

    strong { display: block; font-size: 1.5rem; margin: 0.4rem 0; }
  }

  .isk-vs-divider {
    font-weight: 700;
    color: #9ca3af;
  }

  .isk-guide-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;

    @media (max-width: 640px) { grid-template-columns: 1fr; }
  }

  .isk-guide-card {
    border: 1px solid var(--isk-line);
    border-radius: 12px;
    padding: 1.1rem;
  }

  .table-wrap { overflow-x: auto; }
}
```

---

## 7. Astro 페이지 구조 (핵심 스니펫)

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  ISK_META,
  ISK_KINDERGARTEN_ROWS,
  ISK_SCHOOL_ENTRY_ROWS,
  ISK_FAQ,
  ISK_RELATED_LINKS,
} from "../../data/internationalSchoolVsKindergarten2026";

const normalizedBase = import.meta.env.BASE_URL.endsWith("/") ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
const withBase = (path: string) => `${normalizedBase}${path.replace(/^\//, "")}`;
const faqItems = ISK_FAQ.map((f) => ({ question: f.question, answer: f.answer }));
const fmtMan = (n: number) => `${(n / 10000).toLocaleString("ko-KR")}만원`;
const premiumKinder = ISK_KINDERGARTEN_ROWS.find((r) => r.isHighest)!;
const cheapestSchool = ISK_SCHOOL_ENTRY_ROWS.reduce((min, cur) =>
  (cur.krwPortion || 0) > 0 && ((min.krwPortion || Infinity) > cur.krwPortion) ? cur : min
);
---
<BaseLayout title={ISK_META.seoTitle} description={ISK_META.seoDescription}>
  <SiteHeader />
  <main class="container page-shell report-page op-page isk-page">
    <CalculatorHero eyebrow="대안 비교" title={ISK_META.title} description={ISK_META.description} />
    <InfoNotice title="읽기 전 꼭 확인하세요" lines={[ISK_META.dataSourceNote, "이 페이지는 특정 기관을 추천하지 않으며 비용 비교 정보만 제공합니다."]} />

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">영어유치원</p>
        <h2>영어유치원 3년 누적 비용</h2>
        <p>기존 영어유치원 리포트 데이터를 그대로 인용했습니다.</p>
      </div>
      <div class="table-wrap">
        <table class="isk-kinder-table">
          <thead><tr><th>구분</th><th>월 순부담액</th><th>3년 누적</th></tr></thead>
          <tbody>
            {ISK_KINDERGARTEN_ROWS.map((row) => (
              <tr>
                <td>{row.option}</td>
                <td>{fmtMan(row.monthlyNetFee)}</td>
                <td>{fmtMan(row.threeYearTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">국제학교</p>
        <h2>국제학교 초등 진학 학비 (1년 기준)</h2>
      </div>
      <div class="table-wrap">
        <table class="isk-school-table">
          <thead><tr><th>학교</th><th>지역</th><th>학비</th></tr></thead>
          <tbody>
            {ISK_SCHOOL_ENTRY_ROWS.map((row) => (
              <tr>
                <td>{row.schoolName}</td>
                <td>{row.region}</td>
                <td>{row.krwPortion > 0 ? fmtMan(row.krwPortion) : `$${row.usdPortion.toLocaleString("en-US")}`}{row.usdPortion > 0 && row.krwPortion > 0 ? ` + $${row.usdPortion.toLocaleString("en-US")}` : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">나란히 비교</p>
        <h2>영어유치원 3년 vs 국제학교 1년</h2>
      </div>
      <div class="isk-vs-compare">
        <article class="isk-vs-card">
          <span>영어유치원(프리미엄형) 3년 누적</span>
          <strong>{fmtMan(premiumKinder.threeYearTotal)}</strong>
        </article>
        <span class="isk-vs-divider">VS</span>
        <article class="isk-vs-card">
          <span>{cheapestSchool.schoolName} 초등 1년</span>
          <strong>{fmtMan(cheapestSchool.krwPortion)}</strong>
        </article>
      </div>
      <p class="op-message">국제학교는 초등 이후에도 매년 학비가 발생하므로, 장기 총비용은 <a href={withBase("/tools/international-school-tuition-calculator-2026/")}>학비 계산기</a>에서 재학 기간을 늘려 확인하세요.</p>
    </section>

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">선택 가이드</p>
        <h2>어떤 가정에 어느 쪽이 맞을까</h2>
      </div>
      <div class="isk-guide-grid">
        <article class="isk-guide-card">
          <h3>영어유치원이 맞는 경우</h3>
          <p>유아기 영어 노출을 원하지만 초·중·고까지 장기 고정비를 감당하기 어려운 가정. 이후 국내 초등학교로 진학할 계획이 있는 경우.</p>
        </article>
        <article class="isk-guide-card">
          <h3>국제학교가 맞는 경우</h3>
          <p>초·중·고까지 국제 커리큘럼과 해외 대학 진학을 목표로 하고, 장기간 학비를 안정적으로 감당할 수 있는 가정.</p>
        </article>
      </div>
    </section>

    <SeoContent
      introTitle="영어유치원과 국제학교, 어떻게 비교해야 할까"
      intro={[
        "자녀 영어 교육을 고민하는 학부모는 영어유치원과 국제학교를 종종 같은 선택지처럼 비교하지만, 둘은 기간과 비용 구조가 근본적으로 다릅니다. 영어유치원은 보통 3년(만 3~5세) 한정이지만 국제학교는 초·중·고까지 이어지는 장기 지출입니다.",
        "단순히 '한 해 비용'만 비교하면 국제학교가 더 비싸 보일 수 있지만, 영어유치원 프리미엄형 3년 누적 비용도 이미 국제학교 초등 1년 학비에 근접하거나 이를 넘어서는 경우가 많습니다. 총비용을 비교하려면 기간을 맞춰야 정확합니다.",
        "이 페이지는 이미 발행된 영어유치원 리포트의 비용 데이터를 그대로 인용해 국제학교 학비와 나란히 배치했습니다. 영어유치원 등급별·지역별 상세 비교가 필요하다면 관련 리포트를 참고하세요.",
        "결정은 비용만으로 내릴 수 없습니다. 자녀가 이후 국내 교육과정으로 돌아올지, 해외 대학 진학을 목표로 할지에 따라 적합한 선택이 달라집니다.",
      ]}
      criteria={[
        `영어유치원 비용은 기존 리포트(${ISK_META.dataSourceNote.includes("기준") ? "2026-06-27" : ""} 기준) 데이터를 인용했습니다.`,
        "국제학교 학비는 2026-07-08 각 학교 공식 페이지 확인 기준입니다.",
        "이 페이지는 특정 기관을 추천하지 않으며 비용 비교 정보만 제공합니다.",
      ]}
      faq={faqItems}
      related={ISK_RELATED_LINKS}
    />
  </main>
</BaseLayout>
```

---

## 8. reports.ts 등록

```ts
{
  slug: "international-school-vs-kindergarten-2026",
  title: "국제학교 vs 영어유치원 2026 | 비용·효과 한눈에 비교",
  description: "영어유치원 3년 비용과 국제학교 초등 진학 비용을 비교합니다. 어느 쪽이 우리 가정에 맞는지 확인하세요.",
  order: 73.4,
  badges: ["NEW", "영어유치원", "국제학교", "비용비교"],
},
```

카테고리 등록 (양쪽): `"international-school-vs-kindergarten-2026": { category: "life", isNew: true }`

---

## 9. app.scss import / sitemap.xml

```scss
@use 'scss/pages/international-school-vs-kindergarten-2026';
```

```xml
<url>
  <loc>https://bigyocalc.com/reports/international-school-vs-kindergarten-2026/</loc>
  <lastmod>2026-07-08</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

---

## 10. QA 포인트

- [ ] `CUMULATIVE_COST_ROWS`를 `englishKindergartenVsRegularCost2026.ts`에서 정확히 import하는지 확인 (새 수치 재정의 금지)
- [ ] `IST_SCHOOLS`에서 초등 진학 시점 tier를 추출하는 로직이 7개교 전부에서 올바르게 동작하는지 확인 (tierKey 매칭 로직 재검증 — 학교마다 tierKey 네이밍이 달라 `includes` 매칭이 정확한지 케이스별 확인 필요)
- [ ] SeoContent `related` 1번째 항목이 `english-kindergarten-vs-regular-kindergarten-cost-2026`로 고정되어 있는지 확인 (자기잠식 방지)
- [ ] `npm run build` 통과
