# 태국 국제학교 2026 완전 정리 — 설계 문서

> 기획 원본: [`docs/plan/202607/southeast-asia-international-school-content-plan.md`](../../plan/202607/southeast-asia-international-school-content-plan.md) 7번
> 작성일: 2026-07-09 (2026-07-09 리서치 완료 후 업데이트 — 치앙마이 섹션 복원, 타이틀 원복)
> 유형: 정보형 리포트 (`/reports/`) — 정적 페이지
> 클러스터 4번 페이지
> 데이터 출처: [`southeast-asia-international-school-cost-calculator-2026-design.md`](./southeast-asia-international-school-cost-calculator-2026-design.md)의 `SAC_SCHOOLS` 중 `country === "TH"` 재사용

---

## 0. 치앙마이 데이터 확보 — 계획서 원안 타이틀·스코프로 복원

이전 리비전은 치앙마이 데이터 부재로 방콕 단독 진행 및 타이틀 축소("방콕 학비 총정리")를 권고했으나, 후속 리서치에서 **치앙마이 4개교(PTIS·CMIS는 공식 확인, Grace·American Pacific은 검색 요약)와 생활비를 확보**했다. 계획서 원안 타이틀(`태국 국제학교 2026 완전 정리 | 방콕·치앙마이 학비 비교`)로 복원한다.

또한 방콕 학교 데이터도 대폭 보강되었다: 기존 4개교(ISB·Harrow·Shrewsbury·KIS)에 더해 **Bangkok Patana School이 재검증으로 공식 확인**되었고, 저가형 등급으로 **Bangkok Prep(공식 확인)·Wells(검색 요약)**가 추가되어 방콕은 총 7개교, 저가~프리미엄 전 구간을 커버한다. **NIST International School만 여전히 데이터 확인 불가로 제외 상태를 유지**한다(공식 사이트가 JS 렌더링이라 정적 조회 불가, 검색 결과끼리도 불일치).

**남은 유일한 격차**: 치앙마이는 PTIS 데이터가 2024-2025학년도 구버전(최신 2026-27 PDF 미발견)이라는 점 — dataNote로 명시하고 실제 학비는 이보다 10~15% 높을 수 있음을 안내한다.

---

## 1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/thailandInternationalSchoolGuide2026.ts` |
| 리포트 등록 | `src/data/reports.ts` |
| 홈 카테고리 등록 | `src/pages/index.astro` |
| 리포트 인덱스 등록 | `src/pages/reports/index.astro` |
| 페이지 | `src/pages/reports/thailand-international-school-guide-2026.astro` |
| 스크립트 | 없음 (정적 비교표, 인터랙션 없음) |
| 스타일 | `src/styles/scss/pages/_thailand-international-school-guide-2026.scss` |
| 앱 CSS import | `src/styles/app.scss` |
| 사이트맵 | `public/sitemap.xml` |

**클래스 프리픽스:** `tis-` (Thailand International School)

---

## 2. URL 및 메타

```
슬러그: /reports/thailand-international-school-guide-2026/
타이틀(seoTitle): 태국 국제학교 2026 완전 정리 | 방콕·치앙마이 학비 비교
디스크립션: 방콕·치앙마이 국제학교의 학비와 등급별 구간을 비교합니다. 한국 국제학교 대비 비용 차이까지 한눈에 확인하세요.
```

---

## 3. 데이터 파일 설계

**`src/data/thailandInternationalSchoolGuide2026.ts`**

```ts
import { SAC_SCHOOLS, SAC_LIVING_COSTS, SAC_FX_RATES, type SeaSchoolProfile } from "./southeastAsiaInternationalSchoolCostCalculator2026";

export type FaqItem = { question: string; answer: string };
export type RelatedLink = { href: string; label: string; description: string };

export const TIS_META = {
  slug: "thailand-international-school-guide-2026",
  title: "태국 국제학교, 방콕·치앙마이는 얼마나 들까",
  seoTitle: "태국 국제학교 2026 완전 정리 | 방콕·치앙마이 학비 비교",
  seoDescription:
    "방콕·치앙마이 국제학교의 학비와 등급별 구간을 비교합니다. 한국 국제학교 대비 비용 차이까지 한눈에 확인하세요.",
  description: "방콕 7곳·치앙마이 4곳, 총 11개교의 학비·커리큘럼·등급을 비교합니다.",
  updatedAt: "2026-07-09",
  nistExcludedNote:
    "NIST International School(방콕)은 공식 홈페이지가 자바스크립트 렌더링 방식이라 실제 학비를 확인할 수 없었고, 검색 결과끼리도 서로 다른 수치(45만~113만 THB 범위)를 제시해 이 페이지에서 제외했습니다.",
};

// 방콕 + 치앙마이 필터링해 재사용 — 새 데이터 정의 금지
export const TIS_BANGKOK_SCHOOLS: SeaSchoolProfile[] = SAC_SCHOOLS.filter((s) => s.country === "TH" && s.city === "bangkok");
export const TIS_CHIANGMAI_SCHOOLS: SeaSchoolProfile[] = SAC_SCHOOLS.filter((s) => s.country === "TH" && s.city === "chiang_mai");
export const TIS_BANGKOK_LIVING_COST = SAC_LIVING_COSTS.find((l) => l.city === "bangkok")!;
export const TIS_CHIANGMAI_LIVING_COST = SAC_LIVING_COSTS.find((l) => l.city === "chiang_mai")!;
export const TIS_FX_RATE = SAC_FX_RATES.find((f) => f.currency === "THB")!;

export type SchoolProfileNote = { schoolId: string; oneLinerKo: string; bestFor: string };

export const TIS_SCHOOL_NOTES: SchoolProfileNote[] = [
  { schoolId: "isb-bangkok", oneLinerKo: "방콕 7개교 중 학년별 데이터가 가장 촘촘한 미국식 프리미엄 학교.", bestFor: "미국 대학 진학을 목표로 하는 가정" },
  { schoolId: "harrow-bangkok", oneLinerKo: "영국 명문 Harrow의 방콕 분교, 학년별 세부 학비는 아직 확인되지 않음.", bestFor: "영국식 전통 명문교를 선호하는 가정(학년별 정확한 학비는 재확인 필요)" },
  { schoolId: "shrewsbury-city-bangkok", oneLinerKo: "City Campus 기준 유치~초등 데이터 확보, 중·고등은 별도 확인 필요.", bestFor: "유치~초등 자녀를 둔 영국식 커리큘럼 희망 가정" },
  { schoolId: "kis-bangkok", oneLinerKo: "IB 커리큘럼, 방콕 7개교 중 중간 가격대.", bestFor: "IB 디플로마를 목표로 하는 가정" },
  { schoolId: "patana-bangkok", oneLinerKo: "방콕의 대표 프리미엄 영국식 학교, 학년별 데이터가 가장 촘촘하게 공식 확인됨.", bestFor: "영국식 프리미엄 명문교를 원하는 가정" },
  { schoolId: "bangkok-prep", oneLinerKo: "방콕 7개교 중 중간~저가 구간을 대표하는 영국식 학교, 공식 확인됨.", bestFor: "합리적인 가격대의 영국식 커리큘럼을 원하는 가정" },
  { schoolId: "wells-bangkok", oneLinerKo: "방콕에서 가장 저렴한 축으로 추정되나, 공식 페이지 직접 확인은 아직 안 됨.", bestFor: "예산을 최우선으로 고려하는 가정(수치 재확인 권장)" },
  { schoolId: "ptis-chiangmai", oneLinerKo: "치앙마이의 대표 IB 국제학교, 다만 데이터가 2024-25학년도 기준으로 다소 오래됨.", bestFor: "IB 디플로마를 목표로 하는 가정" },
  { schoolId: "cmis-chiangmai", oneLinerKo: "치앙마이 4개교 중 최신 데이터(2026-27)로 공식 확인됨.", bestFor: "최신 학비 정보를 우선하는 가정" },
  { schoolId: "grace-chiangmai", oneLinerKo: "치앙마이 4개교 중 가장 저렴.", bestFor: "예산을 최우선으로 고려하는 가정" },
  { schoolId: "apis-chiangmai", oneLinerKo: "Primary와 Main Campus로 캠퍼스가 나뉘어 학년 간 학비 체계가 다름.", bestFor: "캠퍼스별 학비 차이를 감안할 수 있는 가정" },
];

export const TIS_FAQ: FaqItem[] = [
  {
    question: "방콕과 치앙마이 중 어디가 더 저렴한가요?",
    answer:
      "치앙마이가 전반적으로 저렴한 편입니다. 치앙마이 4개교의 학비는 약 29만~74만 THB 범위인 반면, 방콕은 저가형(Wells·Bangkok Prep)도 24만~86만 THB, 프리미엄(ISB·Patana)은 100만 THB를 넘는 학교도 있습니다. 다만 방콕에도 저가형 학교가 있어 도시보다는 학교 등급이 더 중요한 변수입니다.",
  },
  {
    question: "방콕 국제학교 중 가장 저렴한 곳은 어디인가요?",
    answer:
      "확보된 데이터 기준으로는 Wells International School이 가장 낮은 것으로 추정되지만, 이 학교는 공식 페이지 직접 확인이 안 되어 수치의 확실성이 낮습니다. 공식 확인된 학교 중에서는 Bangkok Prep International School이 상대적으로 저렴한 편입니다.",
  },
  {
    question: "NIST International School은 왜 이 페이지에 없나요?",
    answer:
      "NIST의 공식 홈페이지는 자바스크립트로 학비를 표시하는 방식이라 직접 조회가 불가능했고, 검색 결과마다 제시하는 수치가 서로 달라(45만~113만 THB 범위) 신뢰할 수 있는 단일 수치를 확보하지 못했습니다. 확인되는 대로 추가할 예정입니다.",
  },
  {
    question: "치앙마이 국제학교 학비는 최신 정보인가요?",
    answer:
      "치앙마이 4개교 중 Chiang Mai International School(CMIS)은 2026-2027학년도 최신 정보입니다. 다만 Prem Tinsulanonda International School(PTIS)은 2024-2025학년도 공식 자료를 기준으로 하며, 국제학교 학비는 보통 연 5~8% 인상되므로 실제 2026-27학년도 학비는 이보다 10~15% 높을 수 있습니다.",
  },
  {
    question: "방콕·치앙마이 국제학교 학비에 생활비까지 더하면 얼마나 드나요?",
    answer:
      "방콕은 외국인 4인 가족 기준 월 생활비(주거비 제외) 약 8만 6,839 THB, 치앙마이는 약 6만 6,555 THB로 조사되었습니다. 정확한 총비용은 계산기에서 학교와 거주 형태를 선택해 확인할 수 있습니다.",
  },
];

export const TIS_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/southeast-asia-international-school-cost-calculator-2026/", label: "동남아 국제학교 비용 계산기", description: "학비와 생활비를 합산해 직접 계산해보세요." },
  { href: "/reports/korea-vs-southeast-asia-international-school-2026/", label: "한국 vs 동남아 국제학교 비교", description: "한국과 동남아 3개국 총비용을 비교합니다." },
  { href: "/reports/malaysia-international-school-guide-2026/", label: "말레이시아 국제학교 총정리", description: "쿠알라룸푸르·조호바루 국제학교 학비를 정리합니다." },
  { href: "/reports/vietnam-international-school-guide-2026/", label: "베트남 국제학교 총정리", description: "호치민·하노이 국제학교 학비를 정리합니다." },
];
```

---

## 4. 페이지 IA (섹션 순서)

```
Hero
 └─ eyebrow: 태국 국제학교
 └─ title: 태국 국제학교, 방콕·치앙마이는 얼마나 들까
 └─ description: 방콕 7개교·치앙마이 4개교의 학비와 생활비를 비교합니다

InfoNotice (학비 출처·확인일자 + NIST 제외 사유 명시)

섹션 1 — 방콕 7개교 학비 비교표 (TIS_BANGKOK_SCHOOLS, 등급순 정렬: 저가→프리미엄)
섹션 2 — 치앙마이 4개교 학비 비교표 (TIS_CHIANGMAI_SCHOOLS, PTIS 구버전 데이터 경고 포함)
섹션 3 — 학교별 상세 카드 11개 (TIS_SCHOOL_NOTES)
섹션 4 — 방콕 vs 치앙마이 생활비 비교 (양쪽 다 수치 확보 — 2열 카드)
섹션 5 — 계산기 CTA
SeoContent (FAQ 5개 + 관련 링크 4개)
```

---

## 5. 컴포넌트 구조

공유 컴포넌트는 국내 클러스터와 동일. 페이지 전용 마크업(`tis-` 프리픽스)은 말레이시아 리포트와 동일한 패턴을 재사용한다:

| 블록 클래스 | 설명 |
|---|---|
| `.tis-page` | 루트 스코프 |
| `.tis-compare-table` | 섹션 1·2 — 학비 비교표 |
| `.tis-confidence-badge` | 공식확인/검색요약 배지 |
| `.tis-school-card-grid` / `.tis-school-card` | 섹션 3 — 학교별 상세 카드 |
| `.tis-living-cost-grid` / `.tis-living-cost-card` | 섹션 4 — 도시별 생활비 카드 2열 (둘 다 데이터 있으므로 "pending" 변형 불필요) |
| `.tis-calc-cta` | 섹션 5 — 계산기 유도 배너 |

---

## 6. SCSS 설계

**파일:** `src/styles/scss/pages/_thailand-international-school-guide-2026.scss`

```scss
.tis-page {
  --tis-line: #d8e0ea;
  --tis-accent: #0f6e56;

  .tis-compare-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.88rem;

    th, td {
      border-bottom: 1px solid var(--tis-line);
      padding: 0.55rem 0.7rem;
      text-align: left;
    }
  }

  .tis-confidence-badge {
    display: inline-flex;
    border-radius: var(--radius-chip, 20px);
    padding: 0.15rem 0.55rem;
    font-size: 0.72rem;

    &[data-confidence="official"] { background: var(--color-brand-tint); color: var(--color-brand-primary); }
    &[data-confidence="snippet"] { background: var(--color-warning-tint); color: var(--color-warning); }
  }

  .tis-school-card-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;

    @media (max-width: 720px) { grid-template-columns: 1fr; }
  }

  .tis-school-card {
    border: 1px solid var(--tis-line);
    border-radius: var(--radius-card, 12px);
    padding: 1.1rem;

    h3 { margin: 0 0 0.4rem; }
  }

  .tis-living-cost-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;

    @media (max-width: 640px) { grid-template-columns: 1fr; }
  }

  .tis-living-cost-card {
    border: 1px solid var(--tis-line);
    border-left: 4px solid var(--tis-accent);
    border-radius: var(--radius-card, 12px);
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
  TIS_META, TIS_BANGKOK_SCHOOLS, TIS_CHIANGMAI_SCHOOLS, TIS_SCHOOL_NOTES,
  TIS_BANGKOK_LIVING_COST, TIS_CHIANGMAI_LIVING_COST, TIS_FAQ, TIS_RELATED_LINKS,
} from "../../data/thailandInternationalSchoolGuide2026";

const normalizedBase = import.meta.env.BASE_URL.endsWith("/") ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
const withBase = (path: string) => `${normalizedBase}${path.replace(/^\//, "")}`;
const faqItems = TIS_FAQ.map((f) => ({ question: f.question, answer: f.answer }));
const badgeAttr = (s: typeof TIS_BANGKOK_SCHOOLS[number]) => (s.dataConfidence === "official_confirmed" ? "official" : "snippet");
const badgeLabel = (s: typeof TIS_BANGKOK_SCHOOLS[number]) => (s.dataConfidence === "official_confirmed" ? "공식 확인" : "검색 요약");
---
<BaseLayout title={TIS_META.seoTitle} description={TIS_META.seoDescription}>
  <SiteHeader />
  <main class="container page-shell report-page op-page tis-page">
    <CalculatorHero eyebrow="태국 국제학교" title={TIS_META.title} description={TIS_META.description} />
    <InfoNotice title="읽기 전 꼭 확인하세요" lines={[
      "학비는 학교 공식 페이지 또는 검색 결과 기준(2026-07-09)이며, 학교별로 확인 수준이 다릅니다.",
      TIS_META.nistExcludedNote,
    ]} />

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">학비 비교 · 방콕</p>
        <h2>방콕 7개교 학년별 학비</h2>
      </div>
      <div class="table-wrap">
        <table class="tis-compare-table">
          <thead><tr><th>학교</th><th>학년 구간</th><th>학비(THB)</th><th>커리큘럼</th><th>확인</th></tr></thead>
          <tbody>
            {TIS_BANGKOK_SCHOOLS.flatMap((school) => school.tuitionTiers.map((tier) => (
              <tr>
                <td>{school.name}</td>
                <td>{tier.tierLabel}</td>
                <td>{tier.annualLocal.toLocaleString("en-US")}</td>
                <td>{school.curriculum}</td>
                <td><span class="tis-confidence-badge" data-confidence={badgeAttr(school)}>{badgeLabel(school)}</span></td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </section>

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">학비 비교 · 치앙마이</p>
        <h2>치앙마이 4개교 학년별 학비</h2>
      </div>
      <div class="table-wrap">
        <table class="tis-compare-table">
          <thead><tr><th>학교</th><th>학년 구간</th><th>학비(THB)</th><th>커리큘럼</th><th>확인</th></tr></thead>
          <tbody>
            {TIS_CHIANGMAI_SCHOOLS.flatMap((school) => school.tuitionTiers.map((tier) => (
              <tr>
                <td>{school.name}</td>
                <td>{tier.tierLabel}</td>
                <td>{tier.annualLocal.toLocaleString("en-US")}</td>
                <td>{school.curriculum}</td>
                <td><span class="tis-confidence-badge" data-confidence={badgeAttr(school)}>{badgeLabel(school)}</span></td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
      <p class="op-message">⚠ Prem Tinsulanonda International School(PTIS)은 2024-2025학년도 공식 자료 기준입니다. 실제 2026-27학년도 학비는 연 5~8% 인상을 감안해 이보다 높을 수 있습니다.</p>
    </section>

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">학교별 상세</p>
        <h2>11개교 한 줄 요약</h2>
      </div>
      <div class="tis-school-card-grid">
        {[...TIS_BANGKOK_SCHOOLS, ...TIS_CHIANGMAI_SCHOOLS].map((school) => {
          const note = TIS_SCHOOL_NOTES.find((n) => n.schoolId === school.id)!;
          return (
            <article class="tis-school-card">
              <h3>{school.name} <small>({school.cityLabel})</small></h3>
              <p>{note.oneLinerKo}</p>
              <p><strong>추천:</strong> {note.bestFor}</p>
              {school.dataNote && <p class="tis-data-note">⚠ {school.dataNote}</p>}
            </article>
          );
        })}
      </div>
    </section>

    <section class="content-section op-section">
      <div class="section-header section-header--compact">
        <p class="section-header__eyebrow">생활비</p>
        <h2>방콕 vs 치앙마이 가족 생활비</h2>
      </div>
      <div class="tis-living-cost-grid">
        <article class="tis-living-cost-card">
          <h3>방콕</h3>
          <p>외국인 4인 가족 기준 월 생활비(주거비 제외) 약 {TIS_BANGKOK_LIVING_COST.monthlyFamilyExclRentLocal?.toLocaleString("en-US")} THB</p>
          <p>3베드룸 콘도 월세: 외곽 약 {TIS_BANGKOK_LIVING_COST.monthlyRentLocal.budget?.toLocaleString("en-US")} THB ~ 시내중심 약 {TIS_BANGKOK_LIVING_COST.monthlyRentLocal.premium?.toLocaleString("en-US")} THB</p>
        </article>
        <article class="tis-living-cost-card">
          <h3>치앙마이</h3>
          <p>외국인 4인 가족 기준 월 생활비(주거비 제외) 약 {TIS_CHIANGMAI_LIVING_COST.monthlyFamilyExclRentLocal?.toLocaleString("en-US")} THB</p>
          <p>3베드룸 콘도 월세: 외곽 약 {TIS_CHIANGMAI_LIVING_COST.monthlyRentLocal.budget?.toLocaleString("en-US")} THB ~ 시내중심 약 {TIS_CHIANGMAI_LIVING_COST.monthlyRentLocal.premium?.toLocaleString("en-US")} THB</p>
        </article>
      </div>
    </section>

    <section class="content-section op-section">
      <div class="tis-calc-cta">
        <div>
          <h3>우리 가족 조건으로 직접 계산해보세요</h3>
          <p>학교·학년·자녀 수를 입력하면 총비용을 바로 확인할 수 있습니다.</p>
        </div>
        <a class="button button--primary" href={withBase("/tools/southeast-asia-international-school-cost-calculator-2026/")}>계산기 바로가기</a>
      </div>
    </section>

    <SeoContent
      introTitle="태국 방콕·치앙마이 국제학교 비교, 이렇게 읽으세요"
      intro={[
        "방콕은 동남아에서 국제학교 밀도가 가장 높은 도시 중 하나로, 저가형부터 프리미엄까지 폭넓은 등급의 학교가 있습니다. 치앙마이는 저비용·느린 육아 콘셉트로 최근 관심이 높아지는 지역으로, 방콕보다 전반적으로 학비가 낮습니다.",
        "이번 조사로 방콕은 7개교, 치앙마이는 4개교의 학비를 확인했습니다. 다만 확인 수준은 학교마다 다릅니다 — Bangkok Patana·Bangkok Prep·PTIS·CMIS는 학교 공식 자료로 직접 확인했고, 나머지는 검색 결과 요약을 기반으로 합니다.",
        "치앙마이 데이터 중 PTIS는 2024-2025학년도 자료로 다소 오래되었습니다. 국제학교 학비는 보통 매년 인상되므로, 실제 2026-27학년도 학비는 이 페이지 수치보다 높을 가능성이 있습니다.",
        "NIST International School은 공식 페이지에서 학비를 확인할 수 없어 이 페이지에서 제외했습니다. 방콕 국제학교를 검토할 때는 이 페이지에 없는 학교도 있다는 점을 감안하고, 실제 지원 전에는 반드시 학교 공식 입학처에서 최신 학비를 재확인하세요.",
      ]}
      criteria={[
        `학비는 학교 공식 페이지 또는 검색 결과 기준 ${TIS_META.updatedAt} 확인입니다.`,
        "NIST International School은 데이터 신뢰도 문제로 이 페이지에서 제외했습니다.",
        "PTIS(치앙마이)는 2024-25학년도 자료 기준으로, 최신 학비와 차이가 있을 수 있습니다.",
        "이 페이지는 특정 학교를 추천하지 않으며 비교 정보만 제공합니다.",
      ]}
      faq={faqItems}
      related={TIS_RELATED_LINKS}
    />
  </main>
</BaseLayout>
```

---

## 8. reports.ts 등록

```ts
{
  slug: "thailand-international-school-guide-2026",
  title: "태국 국제학교 2026 완전 정리 | 방콕·치앙마이 학비 비교",
  description: "방콕·치앙마이 국제학교의 학비와 등급별 구간을 비교합니다. 한국 국제학교 대비 비용 차이까지 한눈에 확인하세요.",
  order: 74.2,
  badges: ["NEW", "태국", "국제학교", "학비"],
},
```

카테고리 등록(양쪽): `"thailand-international-school-guide-2026": { category: "life", isNew: true }`

---

## 9. app.scss import / sitemap.xml

```scss
@use 'scss/pages/thailand-international-school-guide-2026';
```

```xml
<url>
  <loc>https://bigyocalc.com/reports/thailand-international-school-guide-2026/</loc>
  <lastmod>2026-07-09</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

---

## 10. QA 포인트

- [ ] `SAC_SCHOOLS`에서 `country === "TH" && city === "bangkok"` 필터링 결과가 7개교, `city === "chiang_mai"`가 4개교인지 확인
- [ ] NIST가 `SAC_SCHOOLS`에 실수로 포함되지 않았는지 확인 (계산기 데이터와 공유하므로 한 곳만 확인하면 전체 반영됨)
- [ ] PTIS의 "2024-25학년도 구버전" 경고가 표 근처에 실제로 노출되는지 확인 — 다른 학교와 동일하게 보이면 안 됨
- [ ] Harrow처럼 범위만 있는 학교가 비교표에서 다른 학교와 다른 형식(단일 값 vs 학년별 다중 값)으로 섞여도 표가 깨지지 않는지 확인
- [ ] Bangkok Patana의 Year11·Year13이 다른 학년보다 낮게 표시되는 것이 오류로 오인되지 않도록 각주나 툴팁 처리 확인
- [ ] `npm run build` 통과
- [ ] `CONTENT_GUIDE.md` SeoContent intro 4단락·FAQ 5개 기준 충족
