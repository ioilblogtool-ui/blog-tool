# 국제학교 입학조건 체크리스트 2026 — 설계 문서

> 기획 원본: [`docs/plan/202607/international-school-content-cluster-2026-plan.md`](../../plan/202607/international-school-content-cluster-2026-plan.md)
> 작성일: 2026-07-08
> 유형: 정보성 리포트 (`/reports/`, 체크리스트형) — 정적 페이지
> 클러스터 7번 페이지 (마지막)

---

## 0. 이 페이지의 차별점 — "자격 비교"가 아니라 "실행 체크리스트"

[international-school-vs-foreign-school-2026](./international-school-vs-foreign-school-2026-design.md)이 "국제학교·외국인학교·외국교육기관이 법적으로 어떻게 다른가"를 다뤘다면, 이 페이지는 **"실제로 지원하려면 무엇을 준비해야 하는가"**에 집중한다. 관점 차이:

| | vs-foreign-school (5번) | admission-guide (7번, 이 문서) |
|---|---|---|
| 질문 | 어떤 유형이고 누가 지원 가능한가 | 지원하려면 뭘 준비해야 하는가 |
| 형식 | 법령·유형 비교표 | 시점별·서류별 체크리스트 |
| 대상 | 아직 유형도 구분 못 하는 학부모 | 지원을 결심하고 준비 단계에 들어간 학부모 |

법·제도 설명이 겹치는 부분(외국인학교 3년 거주 요건, 미인가 학교 리스크)은 **한두 문장으로 축약하고 5번 리포트로 링크**해 자기잠식을 피한다. 이 페이지의 본체는 준비 타임라인과 서류 체크리스트다.

---

## 1. 팩트체크 결과 (2026-07-08 웹검색, 재검증 권고)

- 외국인학교 입학 서류·시험은 학교별로 다르지만 공통적으로 **영어 능력 시험(자체 시험 또는 표준화 시험), 인터뷰, 이전 학교 성적표/추천서**가 요구된다.
- 내국인 지원자는 해외 거주 3년(1,095일) 증빙 서류(출입국사실증명원 등)가 필수다.
- 미인가 국제학교는 학력이 인정되지 않아 국내 대학 진학·병역 학력 증빙을 위해 **검정고시**가 필요하다 (5번 리포트에서 다룬 내용, 여기서는 "준비 체크리스트 항목"으로만 짧게 인용).
- 제주국제학교는 내국인 거주 요건이 없어 서류 준비 부담이 상대적으로 적지만, 학교별 입학 시험(영어·수학 등)과 인터뷰는 동일하게 필요하다.

> 학교별 정확한 서류 목록·시험 과목은 이 리포트에서 일반화해 다루며, 개별 학교의 최신 입학 요강 확인이 최종적으로 필요하다는 점을 InfoNotice에 명시한다.

---

## 2. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/internationalSchoolAdmissionGuide2026.ts` |
| 리포트 등록 | `src/data/reports.ts` |
| 홈 카테고리 등록 | `src/pages/index.astro` |
| 리포트 인덱스 등록 | `src/pages/reports/index.astro` |
| 페이지 | `src/pages/reports/international-school-admission-guide-2026.astro` |
| 스크립트 | 없음 (정적 체크리스트, 인터랙션 없음) |
| 스타일 | `src/styles/scss/pages/_international-school-admission-guide-2026.scss` |
| 앱 CSS import | `src/styles/app.scss` |
| 사이트맵 | `public/sitemap.xml` |

**클래스 프리픽스:** `isg-` (International School admission Guide)

---

## 3. URL 및 메타

```
슬러그: /reports/international-school-admission-guide-2026/
타이틀(seoTitle): 국제학교 입학조건 2026 완전 정리 | 준비 체크리스트
디스크립션: 국제학교 입학 자격, 시험 준비, 서류부터 미인가 학교 학력인정 리스크까지 체크리스트로 정리했습니다.
```

---

## 4. 데이터 파일 설계

**`src/data/internationalSchoolAdmissionGuide2026.ts`**

```ts
export type FaqItem = { question: string; answer: string };
export type RelatedLink = { href: string; label: string };

export type TimelineStep = {
  timing: string;    // "입학 1년 전" 등
  title: string;
  detail: string;
};

export type DocumentItem = {
  category: string;  // "공통 서류" | "내국인 추가 서류" | "시험·인터뷰"
  items: string[];
};

export type AgeGuideRow = {
  ageGroup: string;
  focus: string;
  note: string;
};

export const ISG_META = {
  slug: "international-school-admission-guide-2026",
  title: "국제학교 입학, 뭐부터 준비해야 할까",
  seoTitle: "국제학교 입학조건 2026 완전 정리 | 준비 체크리스트",
  seoDescription:
    "국제학교 입학 자격, 시험 준비, 서류부터 미인가 학교 학력인정 리스크까지 체크리스트로 정리했습니다.",
  description: "입학 시기별 준비 타임라인, 서류 체크리스트, 미인가 학교 주의사항을 한 페이지에 정리했습니다.",
  updatedAt: "2026-07-08",
  verificationNote:
    "학교별 정확한 서류·시험 과목은 일반화한 내용이며, 최종 지원 전 개별 학교 최신 입학 요강 확인이 반드시 필요합니다.",
};

export const ISG_TIMELINE: TimelineStep[] = [
  { timing: "입학 1년~1년 반 전", title: "학교 리스트업·설명회 참석", detail: "관심 학교의 입학설명회(오픈하우스)에 참석해 커리큘럼과 분위기를 확인합니다." },
  { timing: "입학 6개월~1년 전", title: "서류 준비 시작", detail: "성적표·추천서·재학증명서 등 공통 서류를 준비합니다. 내국인은 해외 거주 증빙 서류도 함께 준비합니다." },
  { timing: "입학 3~6개월 전", title: "지원서 접수·시험 응시", detail: "학교별 입학 시험(영어·수학 등)과 인터뷰 일정에 맞춰 지원서를 접수합니다." },
  { timing: "입학 1~3개월 전", title: "합격 발표·등록금 납부", detail: "합격 후 예치금·입학금을 납부하고 등록을 완료합니다." },
  { timing: "입학 직전", title: "생활 준비", detail: "교복·통학(버스 또는 기숙사) 신청, 건강검진 등 학교별 생활 준비 사항을 확인합니다." },
];

export const ISG_DOCUMENTS: DocumentItem[] = [
  {
    category: "공통 서류",
    items: ["최근 2~3년 성적표(영문)", "재학증명서", "담임 추천서 1~2부", "여권 사본", "예방접종 증명서"],
  },
  {
    category: "내국인 추가 서류 (외국인학교 지원 시)",
    items: ["출입국사실증명원(해외 거주 3년 이상 증빙)", "가족관계증명서", "학교장 면담을 위한 한국어·문화 적응 관련 소명 자료"],
  },
  {
    category: "시험·인터뷰",
    items: ["영어 능력 시험(자체 또는 표준화 시험)", "학년별 수학·영어 배치고사", "학생 개별 인터뷰", "학부모 인터뷰(저학년일수록 비중 높음)"],
  },
];

export const ISG_AGE_GUIDE: AgeGuideRow[] = [
  { ageGroup: "유치부(만 3~5세)", focus: "영어 노출 정도, 부모 인터뷰 비중 높음", note: "시험보다 적응 가능성 위주로 평가하는 경우가 많음" },
  { ageGroup: "초등 저학년", focus: "기초 영어·수학 배치고사", note: "학년이 올라갈수록 빈 자리(TO)가 줄어드는 경향" },
  { ageGroup: "초등 고학년~중등", focus: "정식 입학 시험 + 인터뷰", note: "전 학년 성적표·추천서 비중 커짐" },
  { ageGroup: "고등", focus: "학업 성취도 + 목표 진학 대학 연계성", note: "특정 커리큘럼(IB/AP/A-Level) 전환 가능 여부 사전 확인 필요" },
];

export const ISG_FAQ: FaqItem[] = [
  {
    question: "국제학교 입학시험은 뭘 준비해야 하나요?",
    answer:
      "대부분 영어 능력 시험(자체 시험 또는 표준화 시험)과 학년별 수학 배치고사, 학생 인터뷰가 기본입니다. 저학년일수록 학부모 인터뷰 비중이 높아지는 경향이 있습니다. 정확한 과목·형식은 학교별로 다르므로 최신 입학 요강을 확인해야 합니다.",
  },
  {
    question: "내국인이 외국인학교에 지원하려면 어떤 서류가 필요한가요?",
    answer:
      "공통 서류(성적표, 재학증명서, 추천서 등) 외에 해외 거주 3년 이상을 증빙하는 출입국사실증명원이 필요합니다. 자세한 자격 요건은 「국제학교 vs 외국인학교」 리포트에서 확인할 수 있습니다.",
  },
  {
    question: "제주 국제학교는 준비가 더 간단한가요?",
    answer:
      "해외 거주 증빙 서류가 필요 없다는 점에서 서류 준비 부담은 적지만, 학교별 입학 시험과 인터뷰는 동일하게 거쳐야 합니다.",
  },
  {
    question: "몇 살부터 준비를 시작해야 하나요?",
    answer:
      "일반적으로 입학 1년~1년 반 전부터 학교 리스트업과 설명회 참석을 시작하는 것이 좋습니다. 학년이 올라갈수록 빈 자리(TO)가 줄어드는 경향이 있어 저학년일수록 여유 있게 준비하는 것이 유리합니다.",
  },
  {
    question: "미인가 국제학교를 준비할 때 특히 주의할 점은?",
    answer:
      "미인가 국제학교는 학력이 인정되지 않아 국내 대학 진학·병역을 위해 검정고시를 별도로 봐야 합니다. 지원 전 학교가 정식 인가 기관인지 반드시 확인하세요. 자세한 내용은 「국제학교 vs 외국인학교」 리포트를 참고하세요.",
  },
];

export const ISG_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/international-school-vs-foreign-school-2026/", label: "국제학교 vs 외국인학교 차이" },
  { href: "/tools/international-school-tuition-calculator-2026/", label: "국제학교 학비 계산기" },
  { href: "/reports/jeju-international-school-comparison-2026/", label: "제주 국제학교 4곳 비교" },
  { href: "/reports/international-school-overview-2026/", label: "국내 국제학교 총정리" },
];
```

---

## 5. 페이지 IA (섹션 순서)

```
Hero
 └─ eyebrow: 입학 준비
 └─ title: 국제학교 입학, 뭐부터 준비해야 할까
 └─ description: 준비 시점별 타임라인과 서류 체크리스트를 정리했습니다

InfoNotice (verificationNote — 학교별 최신 요강 확인 필요 명시)

섹션 1 — 준비 타임라인 (ISG_TIMELINE, 세로 타임라인 5단계)
섹션 2 — 서류 체크리스트 (ISG_DOCUMENTS, 3개 카테고리)
섹션 3 — 나이·학년별 준비 포인트 (ISG_AGE_GUIDE, 표)
섹션 4 — 미인가 학교 주의 (짧은 요약 + 5번 리포트 링크)
SeoContent (FAQ 5개 + 관련 링크)
```

---

## 6. 컴포넌트 구조

공유 컴포넌트는 이전 문서들과 동일. 페이지 전용 마크업(`isg-` 프리픽스):

| 블록 클래스 | 설명 |
|---|---|
| `.isg-page` | 루트 스코프 |
| `.isg-timeline` | 섹션 1 — 준비 타임라인 |
| `.isg-doc-grid` | 섹션 2 — 서류 체크리스트 3개 카테고리 |
| `.isg-age-table` | 섹션 3 — 나이별 준비 표 |
| `.isg-warning-note` | 섹션 4 — 미인가 학교 짧은 경고 |

---

## 7. SCSS 설계

**파일:** `src/styles/scss/pages/_international-school-admission-guide-2026.scss`

```scss
.isg-page {
  --isg-line: #d8e0ea;
  --isg-accent: #1a56db;

  .isg-timeline {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .isg-timeline__item {
    border: 1px solid var(--isg-line);
    border-radius: 12px;
    padding: 1rem;
    display: flex;
    gap: 1rem;
    align-items: flex-start;

    strong { flex-shrink: 0; min-width: 140px; color: var(--isg-accent); font-size: 0.85rem; }
  }

  .isg-doc-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;

    @media (max-width: 960px) { grid-template-columns: 1fr; }
  }

  .isg-doc-card {
    border: 1px solid var(--isg-line);
    border-radius: 12px;
    padding: 1.1rem;

    h3 { margin: 0 0 0.5rem; font-size: 0.9rem; }
    ul { margin: 0; padding-left: 1.1rem; font-size: 0.85rem; color: #4b5563; }
    li { margin-bottom: 0.3rem; }
  }

  .isg-age-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.88rem;

    th, td {
      border-bottom: 1px solid var(--isg-line);
      padding: 0.6rem 0.75rem;
      text-align: left;
    }
  }

  .isg-warning-note {
    background: #fff7ed;
    border: 1px solid #fb923c;
    border-radius: 12px;
    padding: 1rem 1.25rem;
    font-size: 0.88rem;
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
  ISG_META,
  ISG_TIMELINE,
  ISG_DOCUMENTS,
  ISG_AGE_GUIDE,
  ISG_FAQ,
  ISG_RELATED_LINKS,
} from "../../data/internationalSchoolAdmissionGuide2026";

const normalizedBase = import.meta.env.BASE_URL.endsWith("/") ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
const withBase = (path: string) => `${normalizedBase}${path.replace(/^\//, "")}`;
const faqItems = ISG_FAQ.map((f) => ({ question: f.question, answer: f.answer }));
---
<BaseLayout title={ISG_META.seoTitle} description={ISG_META.seoDescription}>
  <SiteHeader />
  <main class="container page-shell report-page op-page isg-page">
    <CalculatorHero eyebrow="입학 준비" title={ISG_META.title} description={ISG_META.description} />
    <InfoNotice title="읽기 전 꼭 확인하세요" lines={[ISG_META.verificationNote, "이 페이지는 일반적인 준비 절차를 정리한 것으로 학교별 세부 요강과 다를 수 있습니다."]} />

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">준비 타임라인</p>
        <h2>입학까지 언제 뭘 준비해야 할까</h2>
      </div>
      <div class="isg-timeline">
        {ISG_TIMELINE.map((step) => (
          <article class="isg-timeline__item">
            <strong>{step.timing}</strong>
            <div>
              <p><strong>{step.title}</strong></p>
              <p>{step.detail}</p>
            </div>
          </article>
        ))}
      </div>
    </section>

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">서류 체크리스트</p>
        <h2>준비해야 할 서류</h2>
      </div>
      <div class="isg-doc-grid">
        {ISG_DOCUMENTS.map((doc) => (
          <article class="isg-doc-card">
            <h3>{doc.category}</h3>
            <ul>{doc.items.map((item) => <li>{item}</li>)}</ul>
          </article>
        ))}
      </div>
    </section>

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">나이·학년별</p>
        <h2>학년에 따라 준비 포인트가 다릅니다</h2>
      </div>
      <div class="table-wrap">
        <table class="isg-age-table">
          <thead><tr><th>연령대</th><th>준비 포인트</th><th>참고</th></tr></thead>
          <tbody>
            {ISG_AGE_GUIDE.map((row) => (
              <tr><td>{row.ageGroup}</td><td>{row.focus}</td><td>{row.note}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    <section class="content-section op-section">
      <div class="isg-warning-note">
        <p>미인가 국제학교는 학력이 인정되지 않아 국내 대학 진학·병역을 위해 검정고시가 필요합니다. 지원 전 학교의 정식 인가 여부를 꼭 확인하세요 — <a href={withBase("/reports/international-school-vs-foreign-school-2026/")}>자세히 보기</a></p>
      </div>
    </section>

    <SeoContent
      introTitle="국제학교 입학 준비, 순서대로 이렇게"
      intro={[
        "국제학교 입학은 서류 하나만 잘 챙긴다고 되는 일이 아닙니다. 학교 리스트업부터 시험, 인터뷰, 등록까지 최소 1년의 준비 기간이 필요한 경우가 많아, 미리 타임라인을 파악해두는 것이 중요합니다.",
        "서류는 크게 공통 서류(성적표, 추천서 등), 내국인이 외국인학교에 지원할 때 추가로 필요한 서류(해외 거주 증빙), 시험·인터뷰 준비로 나눌 수 있습니다. 제주 국제학교는 해외 거주 증빙이 필요 없어 서류 부담이 상대적으로 적습니다.",
        "학년이 올라갈수록 빈 자리가 줄어드는 경향이 있어, 저학년일수록 여유 있게 준비를 시작하는 것이 유리합니다. 반대로 유치부는 시험보다 부모 인터뷰와 적응 가능성을 더 비중 있게 보는 경우가 많습니다.",
        "가장 주의해야 할 것은 미인가 국제학교입니다. 학비를 다 내고도 학력이 인정되지 않을 수 있으므로, 지원 전 반드시 학교의 정식 인가 여부를 확인해야 합니다. 이 페이지의 절차는 일반적인 안내이며, 최종 서류·시험 요건은 학교별 최신 입학 요강을 확인하세요.",
      ]}
      criteria={[
        "이 페이지는 여러 학교의 공통적인 절차를 일반화한 것으로, 학교별 세부 요강과 다를 수 있습니다.",
        "내국인 외국인학교 지원 요건(해외 거주 3년 이상)은 2026-07-08 웹검색 기준이며 재검증을 권장합니다.",
        "이 페이지는 특정 학교를 추천하지 않으며 준비 절차 안내 목적입니다.",
      ]}
      faq={faqItems}
      related={ISG_RELATED_LINKS}
    />
  </main>
</BaseLayout>
```

---

## 9. reports.ts 등록

```ts
{
  slug: "international-school-admission-guide-2026",
  title: "국제학교 입학조건 2026 완전 정리 | 준비 체크리스트",
  description: "국제학교 입학 자격, 시험 준비, 서류부터 미인가 학교 학력인정 리스크까지 체크리스트로 정리했습니다.",
  order: 73.5,
  badges: ["NEW", "입학준비", "체크리스트", "국제학교"],
},
```

카테고리 등록 (양쪽): `"international-school-admission-guide-2026": { category: "life", isNew: true }`

---

## 10. app.scss import / sitemap.xml

```scss
@use 'scss/pages/international-school-admission-guide-2026';
```

```xml
<url>
  <loc>https://bigyocalc.com/reports/international-school-admission-guide-2026/</loc>
  <lastmod>2026-07-08</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

---

## 11. QA 포인트

- [ ] 5번 리포트(`international-school-vs-foreign-school-2026`)와 내용이 겹치지 않는지 확인 — 법·제도 설명은 1~2문장 요약 + 링크로만, 본문은 타임라인·체크리스트 중심 유지
- [ ] 서류·시험 항목이 지나치게 구체적인 확정 사실처럼 서술되지 않았는지 확인 (일반화한 안내임을 InfoNotice·criteria에서 명확히)
- [ ] `npm run build` 통과

---

## 12. 클러스터 전체 구현 체크리스트 (7개 페이지 완료 시점 기준)

이 문서로 계획서의 7개 페이지 설계가 모두 완료되었다. 구현 시 아래 순서를 권장한다 (계획서 13번과 동일):

1. ~~`international-school-tuition-calculator-2026`~~ — 완료 (설계+구현+배포)
2. `international-school-overview-2026` — 허브, 다른 5개 리포트가 최소 1개 이상 있어야 링크 정상 작동
3. `jeju-international-school-comparison-2026`
4. `seoul-international-school-comparison-2026`
5. `international-school-vs-foreign-school-2026`
6. `international-school-vs-kindergarten-2026`
7. `international-school-admission-guide-2026`

**공통 확인 사항**: 6개 리포트 모두 `IST_SCHOOLS`(계산기 데이터)를 import해 재사용하므로, 계산기 데이터가 변경되면 6개 리포트에 자동 반영된다 — 학비 갱신 시 `internationalSchoolTuitionCalculator2026.ts` 한 곳만 수정하면 된다.
