# 국제학교 vs 외국인학교 2026 — 설계 문서

> 기획 원본: [`docs/plan/202607/international-school-content-cluster-2026-plan.md`](../../plan/202607/international-school-content-cluster-2026-plan.md)
> 작성일: 2026-07-08
> 유형: 정보성 리포트 (`/reports/`) — 정적 페이지, 법·제도 설명 중심
> 클러스터 5번 페이지

---

## 0. 이 페이지의 역할과 정확성 요구 수준

이 클러스터에서 **가장 신중하게 다뤄야 하는 페이지**다. 학비 숫자가 틀리면 재정 계획에 착오가 생기는 정도지만, 입학 자격을 잘못 설명하면 학부모가 애초에 지원 자체가 불가능한 학교에 시간을 쏟게 만들 수 있다. 따라서 이 페이지는:
- 법령·규정 원문에 가장 가깝게 서술한다 (2차 자료 인용 시 출처를 명시하고, 확정 서술과 "재검증 권고" 서술을 구분한다)
- "국제학교", "외국인학교", "외국교육기관"이라는 세 용어가 실무에서 뒤섞여 쓰이는 현실을 인정하고, 이 리포트에서 각 용어를 어떤 의미로 쓰는지 먼저 정의한다
- [seoul-international-school-comparison-2026](./seoul-international-school-comparison-2026-design.md)과 겹치는 "외국인학교 내국인 정원 30%" 내용은 **여기서 본론으로, 그쪽에서는 배경 설명으로만** 다뤄 자기잠식을 피한다

---

## 1. 팩트체크 결과 (2026-07-08 웹검색) ★ 재검증 권고

### 1-1. 용어 정리

| 용어 | 법적 근거 | 내국인 입학 |
|---|---|---|
| **외국인학교** | 「외국인학교 및 외국인유치원 설립·운영에 관한 규정」(교육부) | 정원의 **30%**까지 (교육감이 시·도 교육규칙으로 정하는 경우 **50%**까지). 내국인은 **해외 거주 합산 3년 이상** + 학교장이 한국어 능력 부족 또는 문화적 부적응 우려로 판단한 경우에만 입학 가능 |
| **국제학교(제주국제학교 등 외국교육기관)** | 「경제자유구역 및 제주국제자유도시의 외국교육기관 설립·운영에 관한 특별법」 | **제한 없음** — 정원 전체를 내국인으로 채울 수 있고 해외 거주 요건도 없음 |
| **미인가 국제학교** | 법적 근거 없음 (사설 교육기관, 학원 등으로 분류) | 제한 없음이지만 **초중등교육법상 "학교"로 인정되지 않아 학력이 공식 인정되지 않음** |

이 클러스터의 7개교 분류(재검증 권고):
- **외국인학교**: Seoul Foreign School, Dulwich College Seoul, Chadwick International — 내국인 정원 제한 적용 대상으로 추정 (구현 전 각 학교 공식 분류 재확인 필요)
- **국제학교(외국교육기관)**: NLCS Jeju, Branksome Hall Asia, KIS Jeju, SJA Jeju — 제주국제자유도시특별법 근거로 내국인 제한 없음

### 1-2. 미인가 국제학교 현황

전국 미인가·미등록 국제교육시설은 약 200여 개로 추산되며 이 중 약 120~125곳이 "국제학교"를 표방하는 미인가 시설로 추정된다(10년 새 증가). 미인가 시설은 초중등교육법상 학교가 아니므로 **국내 학력으로 인정되지 않고, 국내 대학 진학이나 병역 관련 학력 증빙을 위해서는 별도로 검정고시에 응시**해야 한다. 정부는 2026년 들어 미인가 국제학교에 대한 관리를 강화하는 추세다.

> **재검증 권고**: 위 수치와 법령명은 2차 보도·나무위키 등에서 확인한 것으로, 구현 전 국가법령정보센터 원문과 교육부 공식 발표로 재확인 필요.

---

## 2. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/internationalSchoolVsForeignSchool2026.ts` |
| 리포트 등록 | `src/data/reports.ts` |
| 홈 카테고리 등록 | `src/pages/index.astro` |
| 리포트 인덱스 등록 | `src/pages/reports/index.astro` |
| 페이지 | `src/pages/reports/international-school-vs-foreign-school-2026.astro` |
| 스크립트 | 없음 (정적 페이지) |
| 스타일 | `src/styles/scss/pages/_international-school-vs-foreign-school-2026.scss` |
| 앱 CSS import | `src/styles/app.scss` |
| 사이트맵 | `public/sitemap.xml` |

**클래스 프리픽스:** `isf-` (International School vs Foreign school)

---

## 3. URL 및 메타

```
슬러그: /reports/international-school-vs-foreign-school-2026/
타이틀(seoTitle): 국제학교 vs 외국인학교 2026 | 입학조건·학비 차이 완전정리
디스크립션: 국제학교, 외국인학교, 외국교육기관의 입학자격과 학비 차이를 비교합니다. 내국인 입학 가능 여부까지 확인하세요.
```

---

## 4. 데이터 파일 설계

**`src/data/internationalSchoolVsForeignSchool2026.ts`**

```ts
import { IST_SCHOOLS, type InternationalSchoolProfile } from "./internationalSchoolTuitionCalculator2026";

export type FaqItem = { question: string; answer: string };
export type RelatedLink = { href: string; label: string };

export type SchoolTypeRow = {
  type: string;
  legalBasis: string;
  koreanQuota: string;
  residencyRequirement: string;
  academicRecognition: string;
};

export const ISF_META = {
  slug: "international-school-vs-foreign-school-2026",
  title: "국제학교 vs 외국인학교, 헷갈리는 차이 정리",
  seoTitle: "국제학교 vs 외국인학교 2026 | 입학조건·학비 차이 완전정리",
  seoDescription:
    "국제학교, 외국인학교, 외국교육기관의 입학자격과 학비 차이를 비교합니다. 내국인 입학 가능 여부까지 확인하세요.",
  description: "국제학교·외국인학교·외국교육기관·미인가 국제학교, 4가지 유형의 법적 근거와 입학자격 차이를 정리했습니다.",
  updatedAt: "2026-07-08",
  verificationNote:
    "이 페이지의 법령명과 수치는 2026-07-08 웹검색 기준이며, 국가법령정보센터 원문·교육부 공식 발표로 재검증을 권장합니다.",
};

export const ISF_TYPE_ROWS: SchoolTypeRow[] = [
  {
    type: "외국인학교",
    legalBasis: "「외국인학교 및 외국인유치원 설립·운영에 관한 규정」(교육부)",
    koreanQuota: "정원의 30% (교육감 재량 시 50%)",
    residencyRequirement: "해외 거주 합산 3년 이상 + 학교장 판단(한국어 능력·문화 적응)",
    academicRecognition: "정식 학력 인정",
  },
  {
    type: "국제학교 (외국교육기관, 제주국제학교 등)",
    legalBasis: "「경제자유구역 및 제주국제자유도시의 외국교육기관 설립·운영에 관한 특별법」",
    koreanQuota: "제한 없음",
    residencyRequirement: "제한 없음",
    academicRecognition: "정식 학력 인정",
  },
  {
    type: "미인가 국제학교",
    legalBasis: "법적 근거 없음 (사설 교육시설)",
    koreanQuota: "제한 없음",
    residencyRequirement: "제한 없음",
    academicRecognition: "학력 인정 안 됨 — 검정고시 필요",
  },
];

// 이 클러스터 7개교의 유형 분류 — 구현 전 각 학교 공식 분류 재확인 필요
export const ISF_SCHOOL_CLASSIFICATION: { schoolId: string; typeLabel: string }[] = [
  { schoolId: "nlcs-jeju", typeLabel: "국제학교 (외국교육기관)" },
  { schoolId: "branksome-hall-asia", typeLabel: "국제학교 (외국교육기관)" },
  { schoolId: "kis-jeju", typeLabel: "국제학교 (외국교육기관)" },
  { schoolId: "sja-jeju", typeLabel: "국제학교 (외국교육기관)" },
  { schoolId: "chadwick-songdo", typeLabel: "외국인학교 (재확인 필요)" },
  { schoolId: "sfs-seoul", typeLabel: "외국인학교" },
  { schoolId: "dulwich-seoul", typeLabel: "외국인학교 (재확인 필요)" },
];

export const ISF_SCHOOLS: InternationalSchoolProfile[] = IST_SCHOOLS;

export const ISF_FAQ: FaqItem[] = [
  {
    question: "국제학교와 외국인학교, 법적으로 뭐가 다른가요?",
    answer:
      "외국인학교는 「외국인학교 및 외국인유치원 설립·운영에 관한 규정」의 적용을 받아 내국인 정원이 30%(교육감 재량 시 50%)로 제한됩니다. 반면 제주국제학교 등 국제학교(외국교육기관)는 「경제자유구역 및 제주국제자유도시의 외국교육기관 설립·운영에 관한 특별법」에 근거해 내국인 입학 제한이 없습니다.",
  },
  {
    question: "미인가 국제학교에 보내면 학력이 인정되나요?",
    answer:
      "아니요. 미인가 국제학교는 초중등교육법상 정식 '학교'로 인정되지 않아 국내 학력으로 인정되지 않습니다. 국내 대학 진학이나 병역 관련 학력 증빙을 위해서는 검정고시에 별도로 응시해야 합니다.",
  },
  {
    question: "내국인이 외국인학교에 입학하려면 어떤 조건을 채워야 하나요?",
    answer:
      "출생 이후 해외 체류 기간이 합산 3년(1,095일) 이상이어야 하며, 학교장이 한국어 능력이 현저히 부족하거나 문화적 차이로 학교 부적응 우려가 있다고 판단해야 입학할 수 있습니다. 체류는 연속적이지 않아도 되고 부모 동반도 필수가 아닙니다.",
  },
  {
    question: "이 클러스터의 7개교는 각각 어떤 유형인가요?",
    answer:
      "제주 4개교(NLCS, Branksome Hall Asia, KIS Jeju, SJA Jeju)는 국제학교(외국교육기관)로 내국인 입학 제한이 없습니다. 서울·송도 3개교(Chadwick, SFS, Dulwich)는 외국인학교로 분류되어 내국인 정원 제한이 적용되는 것으로 추정되나, 학교별 정확한 법적 분류는 재확인이 필요합니다.",
  },
  {
    question: "제주 국제학교에 내국인이 몰리면 정원이 줄어들지 않나요?",
    answer:
      "제주 국제학교는 정원 제한 자체가 없어 외국인학교처럼 '내국인 정원 30% 초과' 문제가 발생하지 않습니다. 다만 실제 합격은 입학 시험과 정원 경쟁에 따라 달라지므로, 법적 자격과 합격 가능성은 별개입니다.",
  },
];

export const ISF_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/international-school-overview-2026/", label: "국내 국제학교 총정리" },
  { href: "/reports/jeju-international-school-comparison-2026/", label: "제주 국제학교 4곳 비교" },
  { href: "/reports/seoul-international-school-comparison-2026/", label: "서울·경기 국제학교 비교" },
  { href: "/reports/international-school-admission-guide-2026/", label: "국제학교 입학조건 체크리스트" },
];
```

---

## 5. 페이지 IA (섹션 순서)

```
Hero
 └─ eyebrow: 입학자격
 └─ title: 국제학교 vs 외국인학교, 헷갈리는 차이 정리
 └─ description: 법적 근거부터 내국인 입학 가능 여부까지 한 번에 정리합니다

InfoNotice (verificationNote — 법령 재검증 권고 명시)

섹션 1 — 용어부터 정리 (국제학교/외국인학교/외국교육기관/미인가 개념 카드 4개)
섹션 2 — 유형별 비교표 (ISF_TYPE_ROWS: 법적 근거·내국인 정원·거주요건·학력인정)
섹션 3 — 이 클러스터 7개교는 어떤 유형인가 (ISF_SCHOOL_CLASSIFICATION 배지 목록)
섹션 4 — 미인가 국제학교 주의 (검정고시 필요성 강조 박스)
SeoContent (FAQ 5개 + 관련 링크)
```

---

## 6. 컴포넌트 구조

공유 컴포넌트는 이전 문서들과 동일. 페이지 전용 마크업(`isf-` 프리픽스):

| 블록 클래스 | 설명 |
|---|---|
| `.isf-page` | 루트 스코프 |
| `.isf-term-grid` | 섹션 1 — 용어 정의 카드 4개 |
| `.isf-type-table` | 섹션 2 — 유형별 비교표 |
| `.isf-classification-list` | 섹션 3 — 7개교 유형 배지 |
| `.isf-warning-card` | 섹션 4 — 미인가 주의 박스 |

---

## 7. SCSS 설계

**파일:** `src/styles/scss/pages/_international-school-vs-foreign-school-2026.scss`

```scss
.isf-page {
  --isf-line: #d8e0ea;
  --isf-warning-bg: #fff7ed;
  --isf-warning-border: #fb923c;

  .isf-term-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;

    @media (max-width: 640px) { grid-template-columns: 1fr; }
  }

  .isf-term-card {
    border: 1px solid var(--isf-line);
    border-radius: 12px;
    padding: 1.1rem;

    h3 { margin: 0 0 0.4rem; font-size: 0.95rem; }
    p { margin: 0; font-size: 0.85rem; color: #4b5563; }
  }

  .isf-type-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.88rem;

    th, td {
      border-bottom: 1px solid var(--isf-line);
      padding: 0.6rem 0.75rem;
      text-align: left;
      vertical-align: top;
    }
  }

  .isf-classification-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
  }

  .isf-classification-chip {
    border: 1px solid var(--isf-line);
    border-radius: 999px;
    padding: 0.4rem 0.9rem;
    font-size: 0.82rem;

    &--jeju { border-color: #0f6e56; color: #0f6e56; }
    &--foreign { border-color: #1a56db; color: #1a56db; }
  }

  .isf-warning-card {
    background: var(--isf-warning-bg);
    border: 1px solid var(--isf-warning-border);
    border-radius: 12px;
    padding: 1.25rem;
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
  ISF_META,
  ISF_TYPE_ROWS,
  ISF_SCHOOL_CLASSIFICATION,
  ISF_SCHOOLS,
  ISF_FAQ,
  ISF_RELATED_LINKS,
} from "../../data/internationalSchoolVsForeignSchool2026";

const faqItems = ISF_FAQ.map((f) => ({ question: f.question, answer: f.answer }));
const classificationWithNames = ISF_SCHOOL_CLASSIFICATION.map((c) => ({
  ...c,
  name: ISF_SCHOOLS.find((s) => s.id === c.schoolId)?.name ?? c.schoolId,
  isJeju: c.typeLabel.includes("외국교육기관"),
}));
---
<BaseLayout title={ISF_META.seoTitle} description={ISF_META.seoDescription}>
  <SiteHeader />
  <main class="container page-shell report-page op-page isf-page">
    <CalculatorHero eyebrow="입학자격" title={ISF_META.title} description={ISF_META.description} />
    <InfoNotice title="읽기 전 꼭 확인하세요" lines={[ISF_META.verificationNote, "이 페이지는 법령 요약이며 실제 지원 전 학교·교육청 공식 확인이 필요합니다."]} />

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">용어부터 정리</p>
        <h2>국제학교·외국인학교·외국교육기관, 뭐가 다를까</h2>
      </div>
      <div class="isf-term-grid">
        <article class="isf-term-card"><h3>외국인학교</h3><p>외국인 자녀 교육을 위해 설립된 각종학교. 내국인은 정원 30%까지 제한적으로 입학 가능.</p></article>
        <article class="isf-term-card"><h3>국제학교(외국교육기관)</h3><p>경제자유구역·제주특별법 근거로 설립. 내국인 입학 제한이 없음.</p></article>
        <article class="isf-term-card"><h3>미인가 국제학교</h3><p>법적 근거 없는 사설 교육시설. 정식 학력으로 인정되지 않음.</p></article>
        <article class="isf-term-card"><h3>제주국제학교</h3><p>국제학교(외국교육기관)의 대표 사례. 이 클러스터의 제주 4개교가 해당.</p></article>
      </div>
    </section>

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">유형별 비교</p>
        <h2>법적 근거·내국인 정원·학력인정 한눈에 보기</h2>
      </div>
      <div class="table-wrap">
        <table class="isf-type-table">
          <thead><tr><th>유형</th><th>법적 근거</th><th>내국인 정원</th><th>거주 요건</th><th>학력 인정</th></tr></thead>
          <tbody>
            {ISF_TYPE_ROWS.map((row) => (
              <tr>
                <td>{row.type}</td>
                <td>{row.legalBasis}</td>
                <td>{row.koreanQuota}</td>
                <td>{row.residencyRequirement}</td>
                <td>{row.academicRecognition}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">이 클러스터 7개교</p>
        <h2>어떤 유형에 속할까</h2>
      </div>
      <div class="isf-classification-list">
        {classificationWithNames.map((c) => (
          <span class={`isf-classification-chip ${c.isJeju ? "isf-classification-chip--jeju" : "isf-classification-chip--foreign"}`}>
            {c.name} · {c.typeLabel}
          </span>
        ))}
      </div>
    </section>

    <section class="content-section op-section">
      <article class="isf-warning-card">
        <h2>미인가 국제학교, 지원 전 꼭 확인하세요</h2>
        <p>전국에 약 120여 개로 추산되는 미인가 국제학교는 초중등교육법상 정식 학교가 아니라 학력이 인정되지 않습니다. 국내 대학 진학이나 병역 관련 학력 증빙을 위해서는 검정고시에 별도로 응시해야 합니다. 정부는 최근 미인가 국제학교에 대한 관리를 강화하고 있습니다.</p>
      </article>
    </section>

    <SeoContent
      introTitle="국제학교 용어, 왜 이렇게 헷갈릴까"
      intro={[
        "'국제학교'라는 말은 실제로는 법적 근거가 다른 여러 유형의 학교를 뭉뚱그려 부르는 경우가 많습니다. 제주의 NLCS나 Branksome Hall Asia는 국제학교(외국교육기관)이고, 서울의 SFS나 Dulwich는 외국인학교인데, 두 유형은 내국인 입학 가능 여부가 완전히 다릅니다.",
        "외국인학교는 「외국인학교 및 외국인유치원 설립·운영에 관한 규정」에 따라 내국인 정원이 30%(교육감 재량 시 50%)로 제한되고, 해외 거주 3년 이상 요건도 있습니다. 반면 제주국제학교는 「경제자유구역 및 제주국제자유도시의 외국교육기관 설립·운영에 관한 특별법」에 따라 이런 제한이 전혀 없습니다.",
        "가장 주의해야 할 것은 미인가 국제학교입니다. 학비가 저렴하지 않은데도 초중등교육법상 정식 학교로 인정되지 않아 학력이 인정되지 않고, 대학 진학이나 병역을 위해서는 검정고시를 따로 봐야 합니다. '국제학교'라는 이름만 보고 정식 학교로 오해하지 않도록 주의해야 합니다.",
        "이 페이지의 법령명과 수치는 웹검색 기준으로 정리한 것이며, 실제 지원 전에는 국가법령정보센터 원문과 각 학교·교육청의 공식 안내로 다시 확인하는 것이 안전합니다.",
      ]}
      criteria={[
        "법령명과 수치는 2026-07-08 웹검색 기준이며 재검증을 권장합니다.",
        "이 클러스터 7개교의 유형 분류 중 일부는 학교 공식 확인이 추가로 필요합니다.",
        "이 페이지는 법률 자문이 아니며 정보 비교 목적입니다.",
      ]}
      faq={faqItems}
      related={ISF_RELATED_LINKS}
    />
  </main>
</BaseLayout>
```

---

## 9. reports.ts 등록

```ts
{
  slug: "international-school-vs-foreign-school-2026",
  title: "국제학교 vs 외국인학교 2026 | 입학조건·학비 차이 완전정리",
  description: "국제학교, 외국인학교, 외국교육기관의 입학자격과 학비 차이를 비교합니다. 내국인 입학 가능 여부까지 확인하세요.",
  order: 73.3,
  badges: ["NEW", "입학조건", "국제학교", "외국인학교"],
},
```

카테고리 등록 (양쪽): `"international-school-vs-foreign-school-2026": { category: "life", isNew: true }`

---

## 10. app.scss import / sitemap.xml

```scss
@use 'scss/pages/international-school-vs-foreign-school-2026';
```

```xml
<url>
  <loc>https://bigyocalc.com/reports/international-school-vs-foreign-school-2026/</loc>
  <lastmod>2026-07-08</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

---

## 11. QA 포인트 (이 페이지는 특히 엄격하게)

- [ ] **최우선**: 「외국인학교 및 외국인유치원 설립·운영에 관한 규정」, 「경제자유구역 및 제주국제자유도시의 외국교육기관 설립·운영에 관한 특별법」 정식 법령명을 국가법령정보센터(law.go.kr)에서 재확인
- [ ] 내국인 정원 30%/50% 수치, 해외 거주 3년(1,095일) 요건을 교육부 공식 자료로 재확인
- [ ] 이 클러스터 7개교의 실제 법적 분류(외국인학교 vs 외국교육기관)를 각 학교 공식 페이지의 "학교 유형" 안내로 재확인 — 특히 Chadwick·Dulwich는 "재확인 필요"로 표시된 상태이므로 확정 전 배지 문구 조정
- [ ] 미인가 국제학교 통계(120여 개)의 출처와 시점을 명시하고, 과장되지 않게 서술
- [ ] "학력 인정"이라는 단어가 오해를 유발하지 않도록 — 검정고시 응시로 국내 학력 취득이 "가능"하다는 것이지 미인가 학교 재학 자체가 자동으로 문제라는 식으로 단정하지 않기
- [ ] `npm run build` 통과
