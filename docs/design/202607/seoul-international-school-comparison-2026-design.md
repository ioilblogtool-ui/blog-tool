# 서울·경기 국제학교 비교 2026 — 설계 문서

> 기획 원본: [`docs/plan/202607/international-school-content-cluster-2026-plan.md`](../../plan/202607/international-school-content-cluster-2026-plan.md)
> 작성일: 2026-07-08
> 유형: 비교 리포트 (`/reports/`) — 정적 페이지
> 클러스터 4번 페이지

---

## 0. 이 페이지의 차별점

제주 리포트가 "내국인 입학 제한 없음"을 다뤘다면, 이 페이지는 **서울·경기·송도권 3개교(Chadwick International, Seoul Foreign School, Dulwich College Seoul)가 대부분 "외국인학교"로 분류되어 내국인 정원이 30%(교육감 재량 시 50%)로 제한**된다는 점을 명확히 짚는다. 학비 비교와 함께 "왜 서울은 아무나 못 가는가"에 대한 답을 제공해 [international-school-vs-foreign-school-2026](./international-school-vs-foreign-school-2026-design.md)과 자연스럽게 이어지도록 설계한다. 데이터는 계산기 데이터 파일의 `IST_SCHOOLS`에서 `region === "seoul_songdo"`만 필터링해 재사용한다.

**자기잠식 방지**: 이 페이지와 [international-school-vs-foreign-school-2026](./international-school-vs-foreign-school-2026-design.md)은 둘 다 "외국인학교 내국인 정원 30%"를 언급하지만 관점이 다르다 — 이 페이지는 "서울권 3개교의 학비·특징 비교"가 본론이고 입학자격은 배경 설명 수준으로 짧게, 반대쪽 리포트는 "국제학교 유형별 입학자격 비교"가 본론이다. 상호 링크로 연결한다.

---

## 1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/seoulInternationalSchoolComparison2026.ts` |
| 리포트 등록 | `src/data/reports.ts` |
| 홈 카테고리 등록 | `src/pages/index.astro` |
| 리포트 인덱스 등록 | `src/pages/reports/index.astro` |
| 페이지 | `src/pages/reports/seoul-international-school-comparison-2026.astro` |
| 스크립트 | 없음 (정적 비교표) |
| 스타일 | `src/styles/scss/pages/_seoul-international-school-comparison-2026.scss` |
| 앱 CSS import | `src/styles/app.scss` |
| 사이트맵 | `public/sitemap.xml` |

**클래스 프리픽스:** `sis-` (Seoul International School — `public-servant-salary` 등 기존 `sis` 약어와 겹치지 않는지 구현 시 재확인 필요. 겹칠 경우 `sisc-`로 대체)

---

## 2. URL 및 메타

```
슬러그: /reports/seoul-international-school-comparison-2026/
타이틀(seoTitle): 서울·경기 국제학교 2026 비교 | SFS·Dulwich·채드윅 학비 정리
디스크립션: 서울·판교·송도 국제학교의 학비와 입학조건을 비교합니다. SFS, Dulwich Seoul, Dwight, 채드윅 송도 등 대표 학교 포함.
```

> 디스크립션에 Dwight를 언급한 계획서 문구는 유지하되, 실제 이번 구현 범위에는 Dwight 데이터가 없으므로 디스크립션에서 Dwight 언급은 제거하거나 "추후 추가 예정"으로 조정 필요 — 아래 최종안에 반영.

**최종 디스크립션**: `서울·송도 국제학교의 학비와 입학조건을 비교합니다. Chadwick·SFS·Dulwich 등 대표 학교 포함, 외국인학교 내국인 정원 제한도 함께 정리했습니다.`

---

## 3. 데이터 파일 설계

**`src/data/seoulInternationalSchoolComparison2026.ts`**

```ts
import { IST_SCHOOLS, type InternationalSchoolProfile } from "./internationalSchoolTuitionCalculator2026";

export type FaqItem = { question: string; answer: string };
export type RelatedLink = { href: string; label: string };

export const SISC_META = {
  slug: "seoul-international-school-comparison-2026",
  title: "서울·경기·송도 국제학교, 뭐가 다를까",
  seoTitle: "서울·경기 국제학교 2026 비교 | SFS·Dulwich·채드윅 학비 정리",
  seoDescription:
    "서울·송도 국제학교의 학비와 입학조건을 비교합니다. Chadwick·SFS·Dulwich 등 대표 학교 포함, 외국인학교 내국인 정원 제한도 함께 정리했습니다.",
  description: "Chadwick International(송도), Seoul Foreign School, Dulwich College Seoul 3개교의 학비와 입학조건을 비교합니다.",
  updatedAt: "2026-07-08",
  admissionNote:
    "이 3개교는 모두 「외국인학교 및 외국인유치원 설립·운영에 관한 규정」에 따른 외국인학교로, 내국인 입학 정원이 30%(교육감 재량 시 50%)로 제한됩니다. 내국인 지원자는 해외 거주 3년 이상 + 학교장 판단(한국어 능력·문화 적응 우려) 요건도 충족해야 합니다.",
};

// 서울·경기·송도 3개교만 필터링해 재사용 — 새 데이터 정의 금지
export const SISC_SCHOOLS: InternationalSchoolProfile[] = IST_SCHOOLS.filter((s) => s.region === "seoul_songdo");

export type ExpansionCandidate = { name: string; area: string; note: string };

// 아직 데이터가 없는 확장 후보 — 학비를 추정해서 채우지 않고 이름만 안내
export const SISC_EXPANSION_CANDIDATES: ExpansionCandidate[] = [
  { name: "Dwight School Seoul", area: "서울 강남", note: "추후 학비 데이터 추가 예정" },
  { name: "YISS (Yongsan International School of Seoul)", area: "서울 한남", note: "추후 학비 데이터 추가 예정" },
  { name: "KIS Pangyo", area: "경기 판교", note: "추후 학비 데이터 추가 예정" },
];

export const SISC_FAQ: FaqItem[] = [
  {
    question: "서울권 국제학교는 아무나 지원할 수 있나요?",
    answer:
      "이 3개교는 모두 외국인학교로 분류되어 내국인 정원이 30%(교육감 재량 시 50%)로 제한됩니다. 내국인 지원자는 해외 거주 3년 이상 등 별도 요건을 충족해야 합니다. 제주 국제학교와 달리 정원 제한이 있다는 점이 가장 큰 차이입니다.",
  },
  {
    question: "서울권 3개교 중 학비가 가장 낮은 곳은?",
    answer:
      "초등 기준으로는 Seoul Foreign School(원화 1,750만원+달러 7,000)이 상대적으로 낮은 편입니다. 다만 중등 데이터가 아직 확인되지 않아 학년에 따라 순위가 달라질 수 있습니다.",
  },
  {
    question: "Dulwich College Seoul은 왜 학비가 전부 원화인가요?",
    answer:
      "이 클러스터의 7개교 중 Dulwich만 학비를 전액 원화로 청구합니다. 나머지 학교는 원화와 달러를 혼합해 청구하므로, Dulwich는 환율 변동의 영향을 받지 않는다는 차이가 있습니다.",
  },
  {
    question: "채드윅 송도는 왜 다른 두 학교보다 학비가 높나요?",
    answer:
      "Chadwick International은 Village School부터 Upper School까지 원화·달러 혼합 학비가 다른 두 학교보다 높게 책정되어 있습니다. 다만 2026/27학년도 확정 요율은 2026년 1월 공개 예정이라 최신 수치는 재확인이 필요합니다.",
  },
  {
    question: "이 페이지에 없는 서울권 학교도 있나요?",
    answer:
      "네. Dwight School Seoul, YISS, KIS Pangyo 등은 검색 수요를 확인한 뒤 추후 추가할 예정입니다.",
  },
];

export const SISC_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/international-school-tuition-calculator-2026/", label: "국제학교 학비 계산기" },
  { href: "/reports/international-school-overview-2026/", label: "국내 국제학교 총정리" },
  { href: "/reports/jeju-international-school-comparison-2026/", label: "제주 국제학교 4곳 비교" },
  { href: "/reports/international-school-vs-foreign-school-2026/", label: "국제학교 vs 외국인학교 차이" },
];
```

---

## 4. 페이지 IA (섹션 순서)

```
Hero
 └─ eyebrow: 서울·경기·송도 국제학교
 └─ title: 서울·경기·송도 국제학교, 뭐가 다를까
 └─ description: Chadwick·SFS·Dulwich 학비와 입학조건을 비교합니다

InfoNotice (학비 출처 + admissionNote 요약)

섹션 1 — 입학자격 배경 카드 (admissionNote, 제주와 대비 한 줄 언급 + 상세 리포트 링크)
섹션 2 — 3개교 학비 비교표 (SISC_SCHOOLS 전체 tuitionTiers 펼쳐서)
섹션 3 — 학교별 상세 카드 3개 (Village/Upper 등 학제 구조 설명)
섹션 4 — 확장 예정 학교 안내 (SISC_EXPANSION_CANDIDATES, 학비 없이 이름만)
SeoContent (FAQ 5개 + 관련 링크)
```

---

## 5. 컴포넌트 구조

공유 컴포넌트는 이전 문서들과 동일. 페이지 전용 마크업(`sisc-` 프리픽스, `sis` 약어 충돌 방지):

| 블록 클래스 | 설명 |
|---|---|
| `.sisc-page` | 루트 스코프 |
| `.sisc-admission-card` | 섹션 1 — 입학자격 배경 |
| `.sisc-compare-table` | 섹션 2 — 학비 비교표 |
| `.sisc-school-card-grid` | 섹션 3 — 학교별 상세 카드 |
| `.sisc-expansion-list` | 섹션 4 — 확장 예정 학교 안내 |

---

## 6. SCSS 설계

**파일:** `src/styles/scss/pages/_seoul-international-school-comparison-2026.scss`

```scss
.sisc-page {
  --sisc-line: #d8e0ea;
  --sisc-accent: #1a56db;

  .sisc-admission-card {
    border: 1px solid var(--sisc-line);
    border-left: 4px solid var(--sisc-accent);
    border-radius: 12px;
    padding: 1.25rem;
  }

  .sisc-compare-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;

    th, td {
      border-bottom: 1px solid var(--sisc-line);
      padding: 0.6rem 0.75rem;
      text-align: left;
      vertical-align: top;
    }
  }

  .sisc-school-card-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;

    @media (max-width: 960px) { grid-template-columns: repeat(2, 1fr); }
    @media (max-width: 640px) { grid-template-columns: 1fr; }
  }

  .sisc-school-card {
    border: 1px solid var(--sisc-line);
    border-radius: 12px;
    padding: 1.1rem;

    h3 { margin: 0 0 0.4rem; }
  }

  .sisc-expansion-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;

    span {
      border: 1px dashed var(--sisc-line);
      border-radius: 999px;
      padding: 0.4rem 0.9rem;
      font-size: 0.82rem;
      color: #6b7280;
    }
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
  SISC_META,
  SISC_SCHOOLS,
  SISC_EXPANSION_CANDIDATES,
  SISC_FAQ,
  SISC_RELATED_LINKS,
} from "../../data/seoulInternationalSchoolComparison2026";

const normalizedBase = import.meta.env.BASE_URL.endsWith("/") ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
const withBase = (path: string) => `${normalizedBase}${path.replace(/^\//, "")}`;
const faqItems = SISC_FAQ.map((f) => ({ question: f.question, answer: f.answer }));
const formatTier = (t: typeof SISC_SCHOOLS[number]["tuitionTiers"][number]) =>
  t.krwPortion > 0 && t.usdPortion > 0 ? `${(t.krwPortion / 10000).toLocaleString("ko-KR")}만원 + $${t.usdPortion.toLocaleString("en-US")}`
  : t.krwPortion > 0 ? `${(t.krwPortion / 10000).toLocaleString("ko-KR")}만원`
  : `$${t.usdPortion.toLocaleString("en-US")}`;
---
<BaseLayout title={SISC_META.seoTitle} description={SISC_META.seoDescription}>
  <SiteHeader />
  <main class="container page-shell report-page op-page sisc-page">
    <CalculatorHero eyebrow="서울·경기·송도 국제학교" title={SISC_META.title} description={SISC_META.description} />
    <InfoNotice title="읽기 전 꼭 확인하세요" lines={["학비는 각 학교 공식 홈페이지 2026-07-08 확인 기준입니다.", SISC_META.admissionNote]} />

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">입학자격 배경</p>
        <h2>서울권은 왜 내국인 정원이 제한될까</h2>
      </div>
      <article class="sisc-admission-card">
        <p>{SISC_META.admissionNote}</p>
        <p>제주 국제학교는 이런 제한이 없습니다 — <a href={withBase("/reports/jeju-international-school-comparison-2026/")}>제주 국제학교 비교 보기</a></p>
      </article>
    </section>

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">학비 비교</p>
        <h2>서울·경기·송도 3개교 학년별 학비</h2>
      </div>
      <div class="table-wrap">
        <table class="sisc-compare-table">
          <thead><tr><th>학교</th><th>학년 구간</th><th>학비</th></tr></thead>
          <tbody>
            {SISC_SCHOOLS.flatMap((school) => school.tuitionTiers.map((tier) => (
              <tr>
                <td>{school.name}</td>
                <td>{tier.tierLabel}</td>
                <td>{formatTier(tier)}</td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </section>

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">학교별 상세</p>
        <h2>3개교 한 줄 요약</h2>
      </div>
      <div class="sisc-school-card-grid">
        {SISC_SCHOOLS.map((school) => (
          <article class="sisc-school-card">
            <h3>{school.name}</h3>
            <p>{school.tuitionTiers.length}단계 학년 구간, {school.tuitionTiers[0].tierLabel} 기준 대표 학비.</p>
            <p>{school.dataNote ?? ""}</p>
          </article>
        ))}
      </div>
    </section>

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">확장 예정</p>
        <h2>이 지역에 더 있는 학교</h2>
      </div>
      <div class="sisc-expansion-list">
        {SISC_EXPANSION_CANDIDATES.map((c) => <span>{c.name} ({c.area})</span>)}
      </div>
      <p class="op-message">학비 데이터 확보 후 순차적으로 이 페이지에 추가할 예정입니다.</p>
    </section>

    <SeoContent
      introTitle="서울·경기 국제학교 비교, 이렇게 읽으세요"
      intro={[
        "서울·경기·송도 국제학교를 검토하는 학부모가 가장 먼저 부딪히는 벽은 학비가 아니라 '내국인이 지원할 수 있는가'입니다. 이 3개교는 모두 외국인학교로 분류되어 내국인 정원이 제한되므로, 학비를 보기 전에 지원 자격부터 확인하는 것이 순서입니다.",
        "자격을 충족한다는 전제 하에 학비를 비교하면, 학교마다 학제 구분(Village/Middle/Upper 또는 Year 단위)과 원화·달러 혼합 비율이 달라 단순 숫자 비교보다는 학년 구간을 맞춰 보는 것이 정확합니다.",
        "Dulwich College Seoul처럼 전액 원화로 청구하는 학교는 환율 변동 영향을 받지 않는 대신, 나머지 학교는 환율이 오르면 실제 부담도 함께 오릅니다. 학비 계산기에서 환율을 조정해보며 민감도를 확인하는 것을 추천합니다.",
        "이 페이지는 검색 수요가 높은 3개교를 우선 반영했습니다. Dwight, YISS, KIS Pangyo 등은 데이터가 확보되는 대로 추가할 예정이며, 실제 지원 전에는 반드시 학교 공식 입학처에서 최신 학비와 입학 요건을 재확인하세요.",
      ]}
      criteria={[
        "학비는 각 학교 공식 홈페이지 2026-07-08 확인 기준입니다.",
        "내국인 입학 정원 제한(30%, 교육감 재량 시 50%)은 「외국인학교 및 외국인유치원 설립·운영에 관한 규정」 기준입니다.",
        "이 페이지는 특정 학교를 추천하지 않으며 비교 정보만 제공합니다.",
      ]}
      faq={faqItems}
      related={SISC_RELATED_LINKS}
    />
  </main>
</BaseLayout>
```

---

## 8. reports.ts 등록

```ts
{
  slug: "seoul-international-school-comparison-2026",
  title: "서울·경기 국제학교 2026 비교 | SFS·Dulwich·채드윅 학비 정리",
  description: "서울·송도 국제학교의 학비와 입학조건을 비교합니다. Chadwick·SFS·Dulwich 등 대표 학교 포함, 외국인학교 내국인 정원 제한도 함께 정리했습니다.",
  order: 73.2,
  badges: ["NEW", "서울", "국제학교", "학비"],
},
```

카테고리 등록 (양쪽): `"seoul-international-school-comparison-2026": { category: "life", isNew: true }`

---

## 9. app.scss import / sitemap.xml

```scss
@use 'scss/pages/seoul-international-school-comparison-2026';
```

```xml
<url>
  <loc>https://bigyocalc.com/reports/seoul-international-school-comparison-2026/</loc>
  <lastmod>2026-07-08</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

---

## 10. QA 포인트

- [ ] `IST_SCHOOLS`에서 `region === "seoul_songdo"` 필터링 결과가 정확히 3개교인지 확인
- [ ] 계획서 원문 디스크립션에 있던 "Dwight" 언급이 최종 메타 디스크립션에서는 빠졌는지 확인 (실제 데이터 없는 학교를 메타에 노출하지 않기)
- [ ] `.sisc-` 프리픽스가 기존 코드베이스의 다른 `sis-` 계열 클래스와 충돌하지 않는지 최종 확인
- [ ] jeju 리포트와 이 리포트가 상호 링크로 연결되는지 확인 (자기잠식 방지 설계 검증)
- [ ] `npm run build` 통과
