# 제주 국제학교 4곳 비교 2026 — 설계 문서

> 기획 원본: [`docs/plan/202607/international-school-content-cluster-2026-plan.md`](../../plan/202607/international-school-content-cluster-2026-plan.md)
> 작성일: 2026-07-08
> 유형: 비교 리포트 (`/reports/`) — 정적 페이지
> 클러스터 3번 페이지

---

## 0. 이 페이지의 차별점

허브([international-school-overview-2026](./international-school-overview-2026-design.md))가 7개교를 얕게 훑는다면, 이 페이지는 **제주 4개교(NLCS Jeju, Branksome Hall Asia, KIS Jeju, SJA Jeju)만 깊게** 파고든다. 제주 국제학교의 가장 큰 차별점인 **"제주국제자유도시특별법 근거로 내국인 입학 제한이 없다"**는 제도적 배경을 설명하고, 통학 vs 기숙 비용 차이를 집중적으로 다룬다. 데이터는 계산기 데이터 파일의 `IST_SCHOOLS`에서 `region === "jeju"`만 필터링해 재사용한다.

---

## 1. 팩트체크 — 제주 국제학교 법적 근거 (2026-07-08 웹검색)

제주 국제학교(제주국제학교)는 **「경제자유구역 및 제주국제자유도시의 외국교육기관 설립·운영에 관한 특별법」**에 근거해 설립된다. 이 특별법에 따라 제주 국제학교는 일반 외국인학교와 달리:
- 내국인 학생 입학 비율에 제한이 없음 (정원 전체를 한국 국적 학생으로 채울 수 있음)
- 해외 거주 기간 등 국적·거주 요건 제한도 없음

반면 서울·경기·송도의 외국인학교(SFS, Dulwich, Chadwick 등 이 클러스터의 서울권 3개교 포함)는 **「외국인학교 및 외국인유치원 설립·운영에 관한 규정」**에 따라 내국인 정원이 30%(교육감 재량 시 50%)로 제한되고, 내국인은 해외 거주 3년 이상 + 학교장 판단(한국어 능력·문화적 적응 우려) 요건을 충족해야 입학할 수 있다. **이 제도적 차이가 "제주는 아무나 갈 수 있는데 서울은 왜 어렵냐"는 흔한 오해를 푸는 핵심 포인트**이며, 이 리포트에서 명확히 설명한다.

> 이 법적 근거는 2차 검색 결과 기준이며, 구현 직전 국가법령정보센터에서 「경제자유구역 및 제주국제자유도시의 외국교육기관 설립·운영에 관한 특별법」 원문으로 재확인 권장.

---

## 2. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/jejuInternationalSchoolComparison2026.ts` |
| 리포트 등록 | `src/data/reports.ts` |
| 홈 카테고리 등록 | `src/pages/index.astro` |
| 리포트 인덱스 등록 | `src/pages/reports/index.astro` |
| 페이지 | `src/pages/reports/jeju-international-school-comparison-2026.astro` |
| 스크립트 | 없음 (정적 비교표, 인터랙션 없음) |
| 스타일 | `src/styles/scss/pages/_jeju-international-school-comparison-2026.scss` |
| 앱 CSS import | `src/styles/app.scss` |
| 사이트맵 | `public/sitemap.xml` |

**클래스 프리픽스:** `jis-` (Jeju International School)

---

## 3. URL 및 메타

```
슬러그: /reports/jeju-international-school-comparison-2026/
타이틀(seoTitle): 제주 국제학교 2026 순위 | NLCS·BHA·SJA·KIS 학비 비교
디스크립션: 제주 4개 국제학교의 학비, 입학조건, 통학·기숙 여부, 커리큘럼을 한 번에 비교합니다. 제주 이주 전 확인할 것 포함.
```

---

## 4. 데이터 파일 설계

**`src/data/jejuInternationalSchoolComparison2026.ts`**

```ts
import { IST_SCHOOLS, type InternationalSchoolProfile } from "./internationalSchoolTuitionCalculator2026";

export type FaqItem = { question: string; answer: string };
export type RelatedLink = { href: string; label: string };

export const JIS_META = {
  slug: "jeju-international-school-comparison-2026",
  title: "제주 국제학교 4곳, 뭐가 다를까",
  seoTitle: "제주 국제학교 2026 순위 | NLCS·BHA·SJA·KIS 학비 비교",
  seoDescription:
    "제주 4개 국제학교의 학비, 입학조건, 통학·기숙 여부, 커리큘럼을 한 번에 비교합니다. 제주 이주 전 확인할 것 포함.",
  description: "NLCS Jeju, Branksome Hall Asia, KIS Jeju, SJA Jeju 4개교의 학비·기숙 여부·커리큘럼을 비교합니다.",
  updatedAt: "2026-07-08",
  legalBasisNote:
    "제주 국제학교는 「경제자유구역 및 제주국제자유도시의 외국교육기관 설립·운영에 관한 특별법」에 근거해 설립되어 내국인 입학 비율·거주 요건 제한이 없습니다. 이는 서울·경기 외국인학교(내국인 정원 30%, 해외 거주 3년 이상 요건)와 가장 큰 차이입니다.",
};

// 제주 4개교만 필터링해 재사용 — 새 데이터 정의 금지
export const JIS_SCHOOLS: InternationalSchoolProfile[] = IST_SCHOOLS.filter((s) => s.region === "jeju");

export type CurriculumRow = {
  schoolId: string;
  curriculum: string;
  foundedYear: string;
  gradeRange: string;
  admissionFeature: string;
};

// 학비 외 커리큘럼·설립연도·학년범위는 이 리포트 전용 — 구현 전 각 학교 About 페이지에서 재확인 필요
export const JIS_CURRICULUM_ROWS: CurriculumRow[] = [
  {
    schoolId: "nlcs-jeju",
    curriculum: "영국식 (GCSE, A-Level)",
    foundedYear: "확인 필요",
    gradeRange: "만 3세~고3 (Year 13)",
    admissionFeature: "런던 NLCS 본교와 커리큘럼 연계",
  },
  {
    schoolId: "branksome-hall-asia",
    curriculum: "IB (International Baccalaureate)",
    foundedYear: "확인 필요",
    gradeRange: "JK~고3 (Grade 12)",
    admissionFeature: "캐나다 토론토 Branksome Hall 본교와 자매결연, 여학생 중심 전통 (제주 캠퍼스는 남녀공학 여부 확인 필요)",
  },
  {
    schoolId: "kis-jeju",
    curriculum: "미국식 (AP)",
    foundedYear: "확인 필요",
    gradeRange: "유치~고3 (Grade 12)",
    admissionFeature: "국내 최초 제주 국제학교 중 하나, 미국 대학 진학 실적 강조",
  },
  {
    schoolId: "sja-jeju",
    curriculum: "미국식 (AP)",
    foundedYear: "확인 필요",
    gradeRange: "유치~중등 확인 (고등 학년 운영 여부 확인 필요)",
    admissionFeature: "미국 버몬트주 St. Johnsbury Academy 본교와 연계",
  },
];

export const JIS_FAQ: FaqItem[] = [
  {
    question: "제주 국제학교는 왜 내국인이 자유롭게 입학할 수 있나요?",
    answer:
      "제주 국제학교는 「경제자유구역 및 제주국제자유도시의 외국교육기관 설립·운영에 관한 특별법」에 근거해 설립되어, 서울·경기의 일반 외국인학교와 달리 내국인 입학 비율이나 해외 거주 요건에 제한이 없습니다. 정원 전체를 한국 국적 학생으로 채우는 것도 가능합니다.",
  },
  {
    question: "제주 4개교 중 학비가 가장 저렴한 곳은 어디인가요?",
    answer:
      "통학 기준으로는 SJA Jeju의 유치~초등 구간(원화 2,413만원+달러 8,990) 학비가 상대적으로 낮은 편입니다. 다만 기숙사 이용 여부, 학년, 환율에 따라 순위가 바뀔 수 있어 학비 계산기로 직접 비교하는 것이 정확합니다.",
  },
  {
    question: "통학과 기숙 중 어느 쪽이 총비용이 더 낮나요?",
    answer:
      "학비만 보면 통학이 저렴하지만, 제주에 거주지가 없다면 별도 주거비·생활비가 추가됩니다. 기숙사를 이용하면 학비에 기숙사비가 추가되는 대신 별도 주거비 부담이 없어, 가족의 제주 이주 여부에 따라 유불리가 달라집니다.",
  },
  {
    question: "제주 4개교의 커리큘럼 차이는 무엇인가요?",
    answer:
      "NLCS Jeju는 영국식(GCSE·A-Level), Branksome Hall Asia는 IB, KIS Jeju와 SJA Jeju는 미국식(AP) 커리큘럼을 따릅니다. 진학을 원하는 국가·대학에 따라 유리한 커리큘럼이 다를 수 있습니다.",
  },
  {
    question: "제주 국제학교에 다니려면 꼭 제주로 이사해야 하나요?",
    answer:
      "기숙사를 이용하면 반드시 이주할 필요는 없지만, 통학을 원한다면 학교 인근(제주 영어교육도시 등)에 거주해야 합니다. 이 경우 학비 외에 제주 지역 주거비도 함께 고려해야 합니다.",
  },
];

export const JIS_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/international-school-tuition-calculator-2026/", label: "국제학교 학비 계산기" },
  { href: "/reports/international-school-overview-2026/", label: "국내 국제학교 총정리" },
  { href: "/reports/seoul-international-school-comparison-2026/", label: "서울·경기 국제학교 비교" },
  { href: "/reports/international-school-vs-foreign-school-2026/", label: "국제학교 vs 외국인학교 차이" },
];
```

---

## 5. 페이지 IA (섹션 순서)

```
Hero
 └─ eyebrow: 제주 국제학교
 └─ title: 제주 국제학교 4곳, 뭐가 다를까
 └─ description: NLCS·BHA·KIS·SJA 학비와 입학조건을 비교합니다

InfoNotice (학비 출처·확인일자 + "이 페이지는 특정 학교를 추천하지 않습니다")

섹션 1 — 왜 제주는 내국인 입학이 자유로운가 (legalBasisNote 설명 카드)
섹션 2 — 4개교 학비·기숙 비교표 (JIS_SCHOOLS 전체 tuitionTiers 펼쳐서)
섹션 3 — 커리큘럼·설립 비교 (JIS_CURRICULUM_ROWS)
섹션 4 — 통학 vs 기숙 비용 차이 설명 (개념 설명 + 계산기 CTA)
섹션 5 — 학교별 상세 카드 4개 (장단점, 잘 맞는 경우)
SeoContent (FAQ 5개 + 관련 링크)
```

---

## 6. 컴포넌트 구조

공유 컴포넌트는 이전 설계 문서들과 동일(`BaseLayout`, `SiteHeader`, `CalculatorHero`, `InfoNotice`, `SeoContent`).

### 페이지 전용 마크업 (`jis-` 프리픽스)

| 블록 클래스 | 설명 |
|---|---|
| `.jis-page` | 루트 스코프 |
| `.jis-legal-card` | 섹션 1 — 법적 근거 설명 카드 |
| `.jis-compare-table` | 섹션 2 — 학비 비교표 |
| `.jis-curriculum-table` | 섹션 3 — 커리큘럼 비교표 |
| `.jis-boarding-compare` | 섹션 4 — 통학 vs 기숙 비교 2열 카드 |
| `.jis-school-card-grid` / `.jis-school-card` | 섹션 5 — 학교별 상세 카드 4개 |

---

## 7. SCSS 설계

**파일:** `src/styles/scss/pages/_jeju-international-school-comparison-2026.scss`

```scss
.jis-page {
  --jis-line: #d8e0ea;
  --jis-accent: #0f6e56;

  .jis-legal-card {
    border: 1px solid var(--jis-line);
    border-left: 4px solid var(--jis-accent);
    border-radius: 12px;
    padding: 1.25rem;
  }

  .jis-compare-table, .jis-curriculum-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;

    th, td {
      border-bottom: 1px solid var(--jis-line);
      padding: 0.6rem 0.75rem;
      text-align: left;
      vertical-align: top;
    }
  }

  .jis-boarding-compare {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;

    @media (max-width: 720px) { grid-template-columns: 1fr; }
  }

  .jis-boarding-card {
    border: 1px solid var(--jis-line);
    border-radius: 12px;
    padding: 1.1rem;
  }

  .jis-school-card-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;

    @media (max-width: 720px) { grid-template-columns: 1fr; }
  }

  .jis-school-card {
    border: 1px solid var(--jis-line);
    border-radius: 12px;
    padding: 1.1rem;

    h3 { margin: 0 0 0.4rem; }
  }

  .table-wrap { overflow-x: auto; }
}
```

---

## 8. Astro 페이지 구조 (핵심 스니펫)

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  JIS_META,
  JIS_SCHOOLS,
  JIS_CURRICULUM_ROWS,
  JIS_FAQ,
  JIS_RELATED_LINKS,
} from "../../data/jejuInternationalSchoolComparison2026";

const normalizedBase = import.meta.env.BASE_URL.endsWith("/") ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
const withBase = (path: string) => `${normalizedBase}${path.replace(/^\//, "")}`;
const faqItems = JIS_FAQ.map((f) => ({ question: f.question, answer: f.answer }));
const formatTier = (t: typeof JIS_SCHOOLS[number]["tuitionTiers"][number]) =>
  t.krwPortion > 0 && t.usdPortion > 0 ? `${(t.krwPortion / 10000).toLocaleString("ko-KR")}만원 + $${t.usdPortion.toLocaleString("en-US")}`
  : t.krwPortion > 0 ? `${(t.krwPortion / 10000).toLocaleString("ko-KR")}만원`
  : `$${t.usdPortion.toLocaleString("en-US")}`;
---
<BaseLayout title={JIS_META.seoTitle} description={JIS_META.seoDescription}>
  <SiteHeader />
  <main class="container page-shell report-page op-page jis-page">
    <CalculatorHero eyebrow="제주 국제학교" title={JIS_META.title} description={JIS_META.description} />
    <InfoNotice title="읽기 전 꼭 확인하세요" lines={["학비는 각 학교 공식 홈페이지 2026-07-08 확인 기준입니다.", "이 페이지는 특정 학교를 추천하지 않으며 비교 정보만 제공합니다."]} />

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">제도적 배경</p>
        <h2>왜 제주는 내국인 입학이 자유로울까</h2>
      </div>
      <article class="jis-legal-card">
        <p>{JIS_META.legalBasisNote}</p>
      </article>
    </section>

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">학비 비교</p>
        <h2>제주 4개교 학년별 학비</h2>
      </div>
      <div class="table-wrap">
        <table class="jis-compare-table">
          <thead><tr><th>학교</th><th>학년 구간</th><th>학비</th><th>기숙</th></tr></thead>
          <tbody>
            {JIS_SCHOOLS.flatMap((school) => school.tuitionTiers.map((tier) => (
              <tr>
                <td>{school.name}</td>
                <td>{tier.tierLabel}</td>
                <td>{formatTier(tier)}</td>
                <td>{school.boardingAvailable ? "가능" : "확인 필요"}</td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </section>

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">커리큘럼</p>
        <h2>영국식·IB·미국식 — 뭐가 다를까</h2>
      </div>
      <div class="table-wrap">
        <table class="jis-curriculum-table">
          <thead><tr><th>학교</th><th>커리큘럼</th><th>학년 범위</th><th>특징</th></tr></thead>
          <tbody>
            {JIS_CURRICULUM_ROWS.map((row) => {
              const school = JIS_SCHOOLS.find((s) => s.id === row.schoolId)!;
              return (
                <tr>
                  <td>{school.name}</td>
                  <td>{row.curriculum}</td>
                  <td>{row.gradeRange}</td>
                  <td>{row.admissionFeature}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">비용 구조</p>
        <h2>통학 vs 기숙, 총비용은 어느 쪽이 유리할까</h2>
      </div>
      <div class="jis-boarding-compare">
        <article class="jis-boarding-card">
          <h3>통학</h3>
          <p>학비만 부담하면 되지만, 제주 영어교육도시 인근에 거주지가 필요합니다. 별도 주거비·생활비가 추가로 발생합니다.</p>
        </article>
        <article class="jis-boarding-card">
          <h3>기숙</h3>
          <p>학비에 기숙사비가 추가되지만, 가족이 제주로 이주하지 않아도 됩니다. 학교별 기숙사비 추가액은 표를 참고하세요.</p>
        </article>
      </div>
      <p class="op-message">정확한 총비용은 <a href={withBase("/tools/international-school-tuition-calculator-2026/")}>학비 계산기</a>에서 학교·기숙 여부를 선택해 계산해보세요.</p>
    </section>

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">학교별 상세</p>
        <h2>4개교 한 줄 요약</h2>
      </div>
      <div class="jis-school-card-grid">
        {JIS_SCHOOLS.map((school) => (
          <article class="jis-school-card">
            <h3>{school.name}</h3>
            <p>{school.tuitionTiers[0].tierLabel} 기준 대표 학비, {school.boardingAvailable ? "기숙 가능" : "기숙 확인 필요"}.</p>
            <p>{school.dataNote ?? ""}</p>
          </article>
        ))}
      </div>
    </section>

    <SeoContent
      introTitle="제주 국제학교 비교, 이렇게 읽으세요"
      intro={[
        "제주 국제학교를 검토하는 학부모가 가장 궁금해하는 것은 '내국인도 정말 자유롭게 갈 수 있나'와 '4개 학교 중 어디가 맞을까'입니다. 이 페이지는 제도적 배경과 학비, 커리큘럼을 함께 비교해 두 질문에 답합니다.",
        "제주 국제학교는 경제자유구역·제주특별법 근거로 설립되어 서울·경기 외국인학교와 달리 내국인 입학 제한이 없습니다. 다만 학교별로 입학 시험 난이도와 정원 경쟁률은 다르므로, 제도적 자격과 실제 합격 가능성은 별개로 봐야 합니다.",
        "학비를 비교할 때는 통학과 기숙 여부를 함께 고려해야 합니다. 기숙 학비가 더 높아 보여도, 통학을 위해 제주로 이주할 경우의 주거비까지 더하면 순위가 바뀔 수 있습니다.",
        "이 페이지의 학비·커리큘럼 정보는 학교 공식 페이지 기준이지만 설립연도 등 일부 항목은 확인이 더 필요합니다. 실제 지원 전에는 반드시 학교 공식 입학처에서 최신 정보를 재확인하세요.",
      ]}
      criteria={[
        "학비는 각 학교 공식 홈페이지 2026-07-08 확인 기준입니다.",
        "커리큘럼·설립연도 등 일부 정보는 추가 확인이 필요한 항목으로 표시했습니다.",
        "이 페이지는 특정 학교를 추천하지 않으며 비교 정보만 제공합니다.",
      ]}
      faq={faqItems}
      related={JIS_RELATED_LINKS}
    />
  </main>
</BaseLayout>
```

---

## 9. reports.ts 등록

```ts
{
  slug: "jeju-international-school-comparison-2026",
  title: "제주 국제학교 2026 순위 | NLCS·BHA·SJA·KIS 학비 비교",
  description: "제주 4개 국제학교의 학비, 입학조건, 통학·기숙 여부, 커리큘럼을 한 번에 비교합니다. 제주 이주 전 확인할 것 포함.",
  order: 73.1,
  badges: ["NEW", "제주", "국제학교", "학비"],
},
```

카테고리 등록 (양쪽): `"jeju-international-school-comparison-2026": { category: "life", isNew: true }`

---

## 10. app.scss import / sitemap.xml

```scss
@use 'scss/pages/jeju-international-school-comparison-2026';
```

```xml
<url>
  <loc>https://bigyocalc.com/reports/jeju-international-school-comparison-2026/</loc>
  <lastmod>2026-07-08</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

---

## 11. QA 포인트

- [ ] `IST_SCHOOLS`에서 `region === "jeju"` 필터링 결과가 정확히 4개교인지 확인
- [ ] `JIS_CURRICULUM_ROWS`의 설립연도("확인 필요") 등 미확인 항목을 실제 값으로 채울지, 그대로 둘지 구현 시점에 재검토
- [ ] 법적 근거 문구가 실제 법령 원문과 일치하는지 국가법령정보센터에서 재확인
- [ ] `npm run build` 통과, 학비 표 렌더링 시 KRW/USD 혼합 표기가 깨지지 않는지 확인
